# Zenfy

**Transformando sua empresa.**  
**Uma empresa da Companhia A & P.**

Plataforma institucional + CRM da Zenfy, construída com Next.js (App Router), TypeScript, Tailwind CSS e Supabase, preparada para deploy na Vercel.

## Estrutura de marca

- **Companhia A & P** — estrutura institucional / empresa-mãe.
- **Zenfy** — empresa focada em sites, landing pages, desenvolvimento web e soluções digitais.
- A arquitetura de marca foi pensada para permitir que a Companhia A & P reúna outras empresas, produtos e SaaS futuramente.

## Tecnologias

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Supabase Auth + PostgreSQL + RLS
- Vercel

## Instalação local

1. `npm install`
2. Copie `.env.example` para `.env.local`.
3. Preencha as variáveis do Supabase.
4. `npm run dev`

## Variáveis de ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`SUPABASE_SERVICE_ROLE_KEY` é somente servidor e nunca deve ser publicada no GitHub.

## Supabase — projeto novo

1. Crie um projeto no Supabase.
2. Rode `supabase/schema.sql` no SQL Editor.
3. Crie os usuários dos administradores no Supabase Auth.
4. Promova os perfis necessários para `super_admin`.

## CRM implementado

- `/admin/dashboard`
- `/admin/leads`
- `/admin/leads/[id]`
- `/admin/empresas`
- `/admin/empresas/[id]`

O CRM possui Kanban, lista, filtros, cadastro/edição de lead, histórico de atividades, registro de contato, empresas e conversão de lead em cliente.

As demais rotas administrativas e da área do cliente já existem como módulos preparados para as próximas fases, evitando links 404 durante o desenvolvimento.

## Branding

Os assets oficiais enviados para a Zenfy ficam em:

```text
public/brand/zenfy/
  logo-primary.png
  logo-growth.png
  bg-dark.png
  bg-light.png
```

## Deploy

1. `npm install`
2. `npm run build`
3. Suba o projeto para o GitHub.
4. Importe o repositório na Vercel.
5. Cadastre as quatro variáveis de ambiente na Vercel.
6. Defina `NEXT_PUBLIC_SITE_URL` com a URL oficial da Vercel ou domínio próprio.
7. No Supabase Auth, autorize a URL oficial nos Redirect URLs.
