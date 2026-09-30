import LeadsBoard from "@/components/LeadsBoard";
import { requireProfile } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/permissions";
import { getAdminProfiles } from "@/lib/leads-query";
import type { LeadRow } from "@/types/lead";

export default async function LeadsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { supabase } = await requireProfile(ADMIN_ROLES);
  const params = await searchParams;
  const { data, error } = await supabase
    .from("leads")
    .select(`
      *,
      companies(id,name,city,state,industry,whatsapp,phone,email,instagram,website),
      assignee:profiles!leads_assigned_to_fkey(id,name,email)
    `)
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(`Não foi possível carregar os leads: ${error.message}`);
  const profiles = await getAdminProfiles(supabase);
  const first = (key: string) => Array.isArray(params[key]) ? params[key]?.[0] : params[key];
  const initialFilters = {
    q: first("q"), status: first("status"), assigned: first("assigned"), service: first("service"),
    source: first("source"), city: first("city"), industry: first("industry"), overdue: first("overdue"), view: first("view"),
  };
  return <LeadsBoard leads={(data ?? []) as LeadRow[]} profiles={profiles} initialFilters={initialFilters} />;
}
