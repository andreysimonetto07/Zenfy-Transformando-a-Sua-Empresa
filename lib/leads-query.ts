import type { SupabaseClient } from "@supabase/supabase-js";
import type { ActivityRow, AdminProfile, LeadRow } from "@/types/lead";

export function one<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

export async function getAdminProfiles(supabase: SupabaseClient): Promise<AdminProfile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,name,email")
    .in("role", ["admin", "super_admin"])
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminProfile[];
}

export async function getLeadById(supabase: SupabaseClient, id: string): Promise<LeadRow | null> {
  const { data, error } = await supabase
    .from("leads")
    .select(`
      *,
      companies(*),
      assignee:profiles!leads_assigned_to_fkey(id,name,email)
    `)
    .eq("id", id)
    .single();
  if (error) return null;
  return data as LeadRow;
}

export async function getLeadActivities(supabase: SupabaseClient, leadId: string): Promise<ActivityRow[]> {
  const { data, error } = await supabase
    .from("activities")
    .select(`
      id,action,description,created_at,user_id,
      author:profiles!activities_user_id_fkey(id,name,email)
    `)
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as ActivityRow[];
}
