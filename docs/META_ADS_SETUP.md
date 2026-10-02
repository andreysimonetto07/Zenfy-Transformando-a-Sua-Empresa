# Integração Meta Ads — Zenfy

A Zenfy usa a Meta Marketing API apenas para leitura de resultados. O token **não é salvo no Supabase**. Ele fica como Secret na Vercel.

## 1. Banco de dados

No Supabase SQL Editor, rode as migrations na ordem em que ainda não tiver executado:

- 004_client_portal.sql
- 005_portfolio_cases_social.sql
- 006_notifications.sql
- 007_notification_preferences.sql
- **008_meta_ads_analytics.sql**

A 008 cria:

- `analytics_integrations`
- `ad_daily_metrics`
- `analytics_sync_logs`

## 2. Meta for Developers / Business Manager

Crie ou use um App da empresa Zenfy na Meta.

Para o primeiro modelo da Zenfy, o mais simples é um **System User** do Business Manager com acesso às contas de anúncios que a agência administra.

O token precisa ter permissão para leitura dos anúncios/insights, normalmente `ads_read`.

A conta de anúncios de cada cliente precisa estar atribuída ao Business/System User utilizado pelo token.

## 3. Variáveis da Vercel

Em Vercel → Project → Settings → Environment Variables, crie como **Secret**:

```
META_ACCESS_TOKEN=<token do system user>
CRON_SECRET=<senha aleatória longa>
```

Crie também:

```
META_GRAPH_VERSION=<versão ativa do Graph API usada pelo seu app>
```

Exemplo de formato:

```
vXX.X
```

Não use `NEXT_PUBLIC_` em tokens.

Depois das variáveis, faça um novo deploy.

## 4. Conectar um cliente

Na Zenfy:

```
Admin
→ Clientes
→ abra a empresa
→ Meta Ads
```

Informe o ID da conta de anúncios:

```
act_1234567890
```

ou apenas:

```
1234567890
```

A Zenfy normaliza o valor automaticamente.

Clique em **Salvar conexão** e depois **Sincronizar agora**.

## 5. O que é importado

A sincronização busca por dia e por campanha:

- investimento
- impressões
- alcance
- cliques
- cliques únicos
- cliques no link
- CTR
- CPC
- CPM
- frequência
- leads
- conversões
- compras
- valor de conversão/faturamento atribuído
- ROAS
- campanha
- conta
- data

A Zenfy reconsulta os últimos 35 dias para capturar conversões atribuídas com atraso.

## 6. Atualização automática

Existem três camadas:

### Ao abrir o painel
Se a Meta estiver conectada e os dados estiverem antigos, a Zenfy tenta atualizar automaticamente antes de exibir a dashboard.

### Vercel Cron
O `vercel.json` chama:

```
/api/meta/sync
```

uma vez por dia como sincronização de segurança.

### GitHub Actions
O workflow:

```
.github/workflows/meta-sync.yml
```

está preparado para sincronizar de hora em hora.

Para ativar, em GitHub → Settings → Secrets and variables → Actions, crie:

```
ZENFY_SITE_URL
ZENFY_CRON_SECRET
```

Exemplo de `ZENFY_SITE_URL`:

```
https://agencia-zenfy.vercel.app
```

`ZENFY_CRON_SECRET` precisa ser exatamente o mesmo valor de `CRON_SECRET` configurado na Vercel.

## 7. Dados manuais continuam existindo

A integração automática não remove o módulo manual.

Use o manual para informações que a Meta não conhece, por exemplo:

- lead qualificado
- reunião realizada
- venda fechada pelo WhatsApp
- faturamento confirmado fora do pixel
- correções internas

O automático é a fonte principal para mídia. O manual é complemento/correção.

## 8. Google Analytics

A aba Google Analytics já existe no portal, separada de Meta Ads. A conexão GA4 será implementada como integração própria para não misturar métricas de site com métricas de mídia paga.
