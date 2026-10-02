export type AnalyticsMetricRow = {
  date: string;
  spend: number | string;
  impressions: number | string;
  reach: number | string;
  clicks: number | string;
  ctr: number | string;
  cpc: number | string;
  cpm: number | string;
  frequency: number | string;
  leads: number | string;
  conversions: number | string;
  purchases: number | string;
  revenue: number | string;
  roas: number | string;
  campaign_id?: string | null;
  campaign_name?: string | null;
};

export type AnalyticsTotals = {
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  leads: number;
  conversions: number;
  purchases: number;
  revenue: number;
  ctr: number;
  cpc: number;
  cpm: number;
  frequency: number;
  cpl: number;
  roas: number;
};

const n = (value: unknown) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

export function summarizeAnalytics(rows: AnalyticsMetricRow[]): AnalyticsTotals {
  const spend = rows.reduce((s, r) => s + n(r.spend), 0);
  const impressions = rows.reduce((s, r) => s + n(r.impressions), 0);
  const reach = rows.reduce((s, r) => s + n(r.reach), 0);
  const clicks = rows.reduce((s, r) => s + n(r.clicks), 0);
  const leads = rows.reduce((s, r) => s + n(r.leads), 0);
  const conversions = rows.reduce((s, r) => s + n(r.conversions), 0);
  const purchases = rows.reduce((s, r) => s + n(r.purchases), 0);
  const revenue = rows.reduce((s, r) => s + n(r.revenue), 0);

  return {
    spend, impressions, reach, clicks, leads, conversions, purchases, revenue,
    ctr: impressions > 0 ? clicks / impressions * 100 : 0,
    cpc: clicks > 0 ? spend / clicks : 0,
    cpm: impressions > 0 ? spend / impressions * 1000 : 0,
    frequency: reach > 0 ? impressions / reach : 0,
    cpl: leads > 0 ? spend / leads : 0,
    roas: spend > 0 ? revenue / spend : 0,
  };
}

export function comparisonPercent(current: number, previous: number) {
  if (!previous) return current ? 100 : 0;
  return (current - previous) / previous * 100;
}

export function aggregateCampaigns(rows: AnalyticsMetricRow[]) {
  const map = new Map<string, AnalyticsMetricRow[]>();
  for (const row of rows) {
    const key = row.campaign_id || row.campaign_name || "Sem campanha";
    const list = map.get(key) || [];
    list.push(row);
    map.set(key, list);
  }

  return [...map.entries()].map(([key, list]) => ({
    id: key,
    name: list[0]?.campaign_name || "Campanha",
    ...summarizeAnalytics(list),
  })).sort((a,b) => b.leads - a.leads || b.spend - a.spend);
}

export function isoDaysAgo(days: number) {
  const date = new Date();
  date.setUTCHours(0,0,0,0);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0,10);
}
