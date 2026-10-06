# Validação das melhorias do site

6 de outubro de 2026.

- Build de produção do Next.js e verificação TypeScript aprovados.
- Build do GitHub Actions aprovado no commit inicial das melhorias.
- Deployment de produção da Vercel confirmado como READY.
- Páginas reais carregadas em quadros de largura controlada no navegador remoto, sem alterar a autenticação.
- Em 320 pixels: orçamento sem rolagem horizontal, botões separados, menu com rolagem interna e foco dentro do diálogo; Escape fecha o menu.
- Em 390 pixels: acesso ao portal e WhatsApp em posições separadas, com espaço reservado no fim da página.
- Portfólio e equipe em 390 pixels: seis demonstrações, sem rolagem horizontal e sem espaços vazios de fotos.
- Suporte em tela curta: painel limitado à altura disponível e com rolagem interna.
- Encaminhamentos de orçamento conferidos para os números já cadastrados no site, com mensagens específicas para sites, sistemas, tráfego e orientação inicial.
- Nenhuma mensagem de WhatsApp foi enviada durante a validação.
- A página de verificação visual temporária foi retirada do código final.
- Segurança do Supabase: permissões de execução de rotinas internas revogadas de anon/authenticated, mantidas para service_role; search_path da função is_admin definido explicitamente. Consultas de verificação confirmaram as permissões.
- A identificação visual de contas foi revisada no código; não foi utilizada uma sessão real de cliente ou administrador para testar o fluxo autenticado completo.

## Pendência externa

A credencial Meta Ads existente expirou. A aplicação permite novas tentativas de integração em erro, informa indisponibilidade aos clientes e autentica a sincronização diária com CRON_SECRET. A retomada dos dados depende de um responsável renovar META_ACCESS_TOKEN na Meta/Vercel e fazer novo deploy. A configuração do Instagram, sozinha, não renova esse token.
