import { getSupabaseClient } from './supabase';

/**
 * Redimensiona e comprime uma imagem no browser (Canvas) para garantir uploads
 * rápidos (< 150 KB) e evitar falhas de limite de payload no servidor/Vercel
 * ou bloqueios prolongados no botão "Guardar Alterações".
 */
async function compressImageFile(file: File, maxDimension = 720, quality = 0.84): Promise<{ blob: Blob; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error || new Error('Erro ao ler ficheiro de imagem'));
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) {
        reject(new Error('Dados de imagem inválidos'));
        return;
      }
      const img = new Image();
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            if (width >= height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({ blob: file, dataUrl });
            return;
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          canvas.toBlob(
            (b) => {
              resolve({
                blob: b || file,
                dataUrl: compressedDataUrl || dataUrl,
              });
            },
            'image/jpeg',
            quality
          );
        } catch {
          resolve({ blob: file, dataUrl });
        }
      };
      img.onerror = () => resolve({ blob: file, dataUrl });
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 3500): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

/**
 * Envia uma fotografia de candidato/perfil para o ImgBB (ou Supabase Storage),
 * com compressão automática e reserva imediata em Base64 otimizado — garantindo
 * que o upload conclui em poucos segundos e nunca bloqueia a gravação do perfil.
 */
export async function uploadImageToImgBB(file: File): Promise<string> {
  const compressed = await compressImageFile(file).catch(() => null);
  const uploadBlob = compressed?.blob || file;
  const fallbackDataUrl =
    compressed?.dataUrl ||
    (await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => (typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Erro ao ler ficheiro')));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    }));

  const uploadTask = async (): Promise<string> => {
    let finalUrl = '';

    // 1) Tentativa principal: ImgBB direto (VITE_IMGBB_API_KEY)
    try {
      const imgbbApiKey = ((import.meta as any).env?.VITE_IMGBB_API_KEY || '').trim();
      if (imgbbApiKey) {
        const formData = new FormData();
        formData.append('image', uploadBlob, file.name || 'profile.jpg');
        const response = await fetchWithTimeout(
          `https://api.imgbb.com/1/upload?key=${encodeURIComponent(imgbbApiKey)}`,
          {
            method: 'POST',
            body: formData,
          },
          3500
        );
        const result = await response.json();
        if (result?.success && result.data?.url) {
          finalUrl = result.data.display_url || result.data.url;
        }
      }
    } catch (imgErr) {
      console.warn('Aviso: Upload direto para o ImgBB falhou, a tentar alternativa:', imgErr);
    }

    // 1b) Tentativa via servidor (/api/upload-imgbb) caso a chave IMGBB esteja nas variáveis do servidor Vercel
    if (!finalUrl) {
      try {
        const proxyRes = await fetchWithTimeout(
          '/api/upload-imgbb',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: fallbackDataUrl, name: file.name }),
          },
          3000
        );
        if (proxyRes.ok) {
          const proxyJson = await proxyRes.json();
          if (proxyJson?.url) {
            finalUrl = proxyJson.url;
          }
        }
      } catch {
        // ignora e segue para reserva
      }
    }

    // 2) Reserva: Supabase Storage (se o ImgBB não estiver disponível)
    if (!finalUrl) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          const cleanName = `candidate_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          const uploadPromise = supabase.storage.from('uploads').upload(cleanName, uploadBlob, {
            cacheControl: '3600',
            upsert: true,
            contentType: 'image/jpeg',
          });
          const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
            setTimeout(() => resolve({ data: null, error: new Error('Storage upload timeout') }), 3000)
          );
          const { data, error } = await Promise.race([uploadPromise, timeoutPromise]);
          if (!error && data) {
            const { data: publicData } = supabase.storage.from('uploads').getPublicUrl(cleanName);
            if (publicData?.publicUrl) {
              finalUrl = publicData.publicUrl;
            }
          }
        }
      } catch (supErr) {
        console.warn('Aviso: Upload para o Supabase Storage não disponível:', supErr);
      }
    }

    return finalUrl || fallbackDataUrl;
  };

  let finalUrl = fallbackDataUrl;
  try {
    finalUrl = await Promise.race([
      uploadTask(),
      new Promise<string>((resolve) => setTimeout(() => resolve(fallbackDataUrl), 5500)),
    ]);
  } catch {
    finalUrl = fallbackDataUrl;
  }

  // 4) Registo assíncrono não-bloqueante para auditoria
  if (finalUrl) {
    try {
      const rawCache = localStorage.getItem('tarira_imgbb_uploads');
      const list = rawCache ? JSON.parse(rawCache) : [];
      if (Array.isArray(list)) {
        list.push({
          url: finalUrl,
          fileName: file.name,
          purpose: 'candidate_photo',
          uploadedAt: new Date().toISOString(),
        });
        localStorage.setItem('tarira_imgbb_uploads', JSON.stringify(list.slice(-100)));
      }
    } catch {
      // ignora erro de localStorage
    }

    const supabase = getSupabaseClient();
    if (supabase && !finalUrl.startsWith('data:')) {
      const recordKey = `file_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      supabase
        .from('site_content')
        .upsert(
          {
            key: recordKey,
            value: {
              url: finalUrl,
              fileName: file.name,
              fileSize: file.size,
              mimeType: file.type || 'image/jpeg',
              purpose: 'candidate_photo',
              source: finalUrl.includes('ibb.co') || finalUrl.includes('imgbb.com') ? 'imgbb' : 'storage',
              uploadedAt: new Date().toISOString(),
            },
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'key' }
        )
        .then(() => {}, () => {});
    }
  }

  return finalUrl;
}
