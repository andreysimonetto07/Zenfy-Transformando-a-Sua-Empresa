# Recuperação de senha — Zenfy

A Zenfy possui uma rota própria em:

```
/auth/recovery
```

Ela aceita:

- `code` (PKCE)
- `token_hash` + `type=recovery`
- sessão enviada no fragmento do navegador

## Por que usar token_hash

Links padrão de recuperação são de uso único. Alguns sistemas de segurança/antispam de e-mail podem visitar o link antes do usuário. Se o link passar primeiro pelo endpoint de confirmação da Supabase, ele pode ser consumido e o usuário recebe "link expirado" logo depois.

Para evitar isso, o e-mail deve apontar diretamente para a Zenfy com o `TokenHash`. A página da Zenfy faz a validação no navegador quando o usuário realmente abre a página.

## 1. Site URL

No Supabase:

```
Authentication
→ URL Configuration
```

Defina **Site URL** como o domínio de produção da Zenfy, por exemplo:

```
https://agencia-zenfy.vercel.app
```

Em **Redirect URLs**, mantenha o domínio de produção:

```
https://agencia-zenfy.vercel.app/**
```

e localhost apenas para desenvolvimento.

## 2. Template de recuperação

No Supabase:

```
Authentication
→ Email Templates
→ Reset Password / Recovery
```

Substitua o link do botão pelo formato abaixo:

```html
<a href="{{ .SiteURL }}/auth/recovery?token_hash={{ .TokenHash }}&type=recovery">
  Redefinir minha senha
</a>
```

Você pode manter o restante do HTML do e-mail.

O ponto importante é NÃO usar apenas `{{ .ConfirmationURL }}` no botão de recuperação.

## 3. Vercel

Confirme que a variável:

```
NEXT_PUBLIC_SITE_URL
```

possui o mesmo domínio usado em **Site URL** no Supabase.

Depois de mudar a variável, faça um redeploy.

## 4. Teste

1. Acesse `/recuperar-senha`.
2. Solicite um novo link.
3. Use apenas o e-mail mais recente.
4. Clique no botão do e-mail.
5. A URL deve abrir `/auth/recovery?...type=recovery`.
6. A Zenfy valida a recuperação e redireciona para `/redefinir-senha`.
7. Defina a nova senha.
8. O sistema encerra a sessão de recuperação e volta para o login.

## Segurança

O token de recuperação não deve ser enviado por chat, salvo no banco da aplicação ou registrado em logs.
