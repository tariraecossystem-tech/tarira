// Vercel Serverless Function: mantém o projeto Supabase do Tarira ativo
// (chamado pelo cron-job.org). Ficheiro independente: não importa o
// server.ts, só o pacote @supabase/supabase-js, para não depender de toda
// a cadeia de imports da aplicação (Nodemailer, Gemini, etc.).
import { createClient } from '@supabase/supabase-js';

export default async function handler(_req: any, res: any) {
  const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
  const apiKey =
    (process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY ||
      '').trim();

  if (!supabaseUrl || !apiKey) {
    return res.status(503).json({ status: 'error', error: 'Supabase não configurado' });
  }

  try {
    const client = createClient(supabaseUrl, apiKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const { error } = await client
      .from('site_content')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return res.status(500).json({ status: 'error', error: error.message });
    }
    return res.status(200).json({ status: 'ok', db: 'reachable', timestamp: new Date().toISOString() });
  } catch (err: any) {
    return res.status(500).json({ status: 'error', error: err?.message || 'unknown' });
  }
}