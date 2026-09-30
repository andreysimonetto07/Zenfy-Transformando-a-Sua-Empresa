# Zenfy

**Transformando sua empresa.**  
**Uma empresa da Companhia A & P.**

Site institucional + CRM da Zenfy, construído com Next.js, TypeScript, Tailwind CSS e Supabase, pronto para ser conectado à Vercel.

## Estrutura de marca

- **Companhia A & P** — empresa-mãe / estrutura institucional.
- **Zenfy** — empresa de soluções digitais, sites, landing pages, sistemas e estratégia.
- A estrutura permite que a Companhia A & P reúna outros produtos, empresas e SaaS futuramente.

## Tecnologias

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Supabase Auth + PostgreSQL + RLS
- Vercel

## Branding

Os assets oficiais da Zenfy estão em:

```text
public/brand/zenfy/
  logo-primary.webp
  logo-growth.webp
  bg-dark.webp
  bg-light.webp
```

O background escuro é usado no hero, login e CTAs. O claro aparece em seções institucionais. As duas logos são usadas como identidade principal e elemento visual secundário.

## Rotas públicas

- `/`
- `/servicos`
- `/sobre`
- `/portfolio`
- `/contato`
- `/solicitar-orcamento`
- `/login`
- `/robots.txt`
- `/sitemap.xml`

## CRM implementado

- `/admin/dashboard`
- `/admin/leads`
- `/admin/leads/[id]`
- `/admin/empresas`
- `/admin/empresas/[id]`

Inclui Kanban, lista, busca, filtros, cadastro/edição de lead, histórico de atividades, registro de contato, cadastro de empresas e conversão de lead em cliente.

As demais rotas administrativas e da área do cliente já possuem páginas-base para evitar links 404 enquanto os módulos são desenvolvidos.

## Configuração local

1. Instale as dependências:

```bash
npm install
```

2. Crie `.env.local` com base em `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Rode:

```bash
npm run dev
```

> Nunca publique `.env.local` ou a chave secreta do Supabase no GitHub.

## Supabase

Para projeto novo, execute `supabase/schema.sql` no SQL Editor.

Para uma instalação anterior do banco que ainda use os status antigos do CRM, aplique `supabase/migrations/002_crm.sql`.

Depois crie os usuários administrativos no Supabase Auth e promova os perfis necessários para `super_admin`.

## Deploy na Vercel

Importe este repositório na Vercel e cadastre:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

Depois do primeiro deploy, use a URL de produção em `NEXT_PUBLIC_SITE_URL`, autorize essa URL em **Supabase Auth → URL Configuration** e faça um redeploy.

---

**Zenfy — Uma empresa da Companhia A & P.**
