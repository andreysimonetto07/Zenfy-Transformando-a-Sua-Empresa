# E-mails oficiais da Zenfy

Contato público e remetente solicitado: **agenciazenfy@gmail.com**. Nome de exibição: **Zenfy**.

O formulário `/contato` registra solicitações no painel da equipe. O link de e-mail abre o aplicativo de e-mail do visitante. Configurar o SMTP do Supabase altera o remetente dos e-mails de autenticação; não encaminha automaticamente as solicitações do formulário para a caixa do Gmail.

## Status

- Contato público, rodapé, atendimento e links de ajuda atualizados no site.
- Recuperação preparada para validar links `token_hash` somente após o clique do usuário.
- Modelos de confirmação e recuperação preparados em `supabase/templates/`.
- **SMTP e modelos no painel ainda dependem de acesso autenticado ao Supabase e de uma senha de app do Gmail. A senha comum da conta Google não é uma credencial SMTP válida. A entrega dos e-mails ainda precisa ser verificada após a ativação.**

## 1. Preparar o Gmail

1. Entre na conta `agenciazenfy@gmail.com` no Google.
2. Em **Conta do Google → Segurança**, ative a **Verificação em duas etapas**, se ainda não estiver ativa.
3. Abra [Senhas de app](https://myaccount.google.com/apppasswords).
4. Crie uma senha de app com o nome **Zenfy Supabase**.
5. Insira essa senha diretamente no campo protegido do Supabase. Não publique em conversas, arquivos, variáveis `NEXT_PUBLIC_*` ou no GitHub.

Se a opção não estiver disponível, consulte as restrições da conta na [documentação do Google](https://support.google.com/accounts/answer/185833?hl=pt-BR). Não desative proteções da conta para tentar usar uma senha comum.

## 2. Ativar o SMTP

Projeto Supabase: `jvqluqugqfelocrktkxx`.
Abra **Authentication → Emails → SMTP Settings** e habilite o SMTP personalizado com:

| Campo | Valor |
| --- | --- |
| Sender email | `agenciazenfy@gmail.com` |
| Sender name | `Zenfy` |
| Host | `smtp.gmail.com` |
| Port | `587` (STARTTLS) |
| Username | `agenciazenfy@gmail.com` |
| Password | Senha de app do Google, inserida diretamente no painel |

Salve somente com uma credencial válida. Mantenha a confirmação de e-mail ativada. Os e-mails de cada cliente continuam sendo os endereços das próprias contas; o Gmail oficial é o remetente e o contato do suporte.

## 3. Conferir URLs

Em **Authentication → URL Configuration**:

- **Site URL:** `https://agencia-zenfy.vercel.app`
- Permita os retornos de produção usados pelo site: `/auth/callback`, `/auth/recovery` e `/redefinir-senha`. A configuração `https://agencia-zenfy.vercel.app/**` contempla esses caminhos e seus parâmetros.
- Autorize `localhost` somente se também for usado para desenvolvimento.

## 4. Aplicar modelos

Em **Authentication → Emails → Templates**, copie o conteúdo dos arquivos:

| Modelo no painel | Assunto | Arquivo |
| --- | --- | --- |
| Confirm signup | Confirme sua conta na Zenfy | `supabase/templates/confirmation.html` |
| Reset password | Redefina sua senha na Zenfy | `supabase/templates/recovery.html` |

Os modelos usam `{{ .SiteURL }}` e `{{ .TokenHash }}`, preenchidos pelo Supabase. O link de recuperação abre a Zenfy e só consome o token quando o usuário clica em **Continuar com a recuperação**, evitando que a mera abertura da URL por um scanner invalide o link.

## 5. Verificar entrega e acesso

1. Use uma conta de teste controlada pela equipe para solicitar um cadastro em `/cadastro`.
2. Confira a chegada do e-mail, inclusive na pasta de spam, e o remetente **Zenfy <agenciazenfy@gmail.com>**.
3. Abra o link e confirme que o portal reconhece a conta cadastrada.
4. Em `/recuperar-senha`, solicite um link para essa mesma conta.
5. Confira a entrega e abra o link em outro navegador ou dispositivo. Clique em **Continuar com a recuperação**.
6. O titular da conta define a senha no formulário e verifica o login com a nova senha.
7. Reabrir um link já utilizado deve mostrar uma orientação para pedir um novo e-mail, sem alterar a senha.
8. Verifique eventuais falhas no log de Auth do Supabase. Uma resposta de sucesso da solicitação, sozinha, não comprova a entrega: endereços não cadastrados também recebem uma resposta genérica.

## Referências

- [SMTP personalizado no Supabase](https://supabase.com/docs/guides/auth/auth-smtp)
- [SMTP do Google no Supabase](https://supabase.com/docs/guides/troubleshooting/using-google-smtp-with-supabase-custom-smtp-ZZzU4Y)
- [Senhas de app do Google](https://support.google.com/accounts/answer/185833?hl=pt-BR)
- [Modelos de e-mail do Supabase](https://supabase.com/docs/guides/auth/auth-email-templates)
