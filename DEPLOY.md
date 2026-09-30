# Deploy da Zenfy

## Vercel

Importe o repositório `andreysimonetto07/Zenfy-Transformando-a-Sua-Empresa`.

Configure as variáveis:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

Depois do primeiro deploy, use a URL de produção em `NEXT_PUBLIC_SITE_URL` e faça um redeploy.

## Supabase Auth

Em **Authentication → URL Configuration**:

- defina **Site URL** para a URL de produção;
- adicione `https://SEU-DOMINIO/**` em Redirect URLs;
- mantenha `http://localhost:3000/**` para desenvolvimento local.

## Segurança

Nunca coloque `.env.local`, `SUPABASE_SERVICE_ROLE_KEY` ou a chave secreta em commits públicos.

> O Build Check do GitHub deve estar verde antes de publicar em produção.
