# Correções de segurança aplicadas

## Ações que tem de fazer (fora do código)
1. **Vercel → Settings → Environment Variables**
   - `SESSION_SECRET`: string aleatória com 32+ caracteres (`openssl rand -hex 32`). Ao mudá-lo, todas as sessões antigas ficam inválidas (recomendado).
   - `ADMIN_PASSWORD`: definir uma palavra-passe **nova e forte**. As palavras-passe que estavam no código do site (visíveis a qualquer pessoa) devem ser consideradas comprometidas.
   - `SUPABASE_ANON_KEY` (ou já existir `VITE_SUPABASE_ANON_KEY`) e `SUPABASE_URL`/`VITE_SUPABASE_URL`: o servidor usa-as para verificar palavras-passe no login.
2. **Supabase → Authentication → Users**: confirmar que os e-mails de administrador existem e têm palavra-passe forte. Ativar "Confirm email" no Supabase Auth.
3. Fazer novo deploy.

## O que mudou
- Removido o acesso de administrador por cabeçalho HTTP (`x-admin-auth`, `x-tarira-admin`, `x-admin-key`).
- `/api/auth/login` passa a verificar a palavra-passe (Supabase Auth ou hash scrypt local).
- Registo: o papel `admin` não pode ser auto-atribuído; e-mails de admin reservados; registar sobre conta existente exige a palavra-passe dela; sem palavra-passe por defeito.
- Papel admin só para e-mails autorizados (lista fixa / `ADMIN_EMAIL`), nunca por o e-mail conter "admin"/"tarira".
- `SESSION_SECRET` deixou de ter valor fixo no código.
- Novas regras de acesso (`serverAccess.ts`): rotas internas só admin; contratações, pagamentos, clientes e levantamentos só do próprio utilizador; lista pública de candidatos sem contactos/documentos/dados financeiros; escrita em candidatos/clientes só pelo dono ou admin.
- Frontend envia o token de sessão em todos os pedidos `/api/...` e recarrega os dados quando a sessão muda.
- Removidas do frontend as palavras-passe de administrador embutidas.
- Cabeçalhos de segurança (CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, HSTS) no `vercel.json`.
