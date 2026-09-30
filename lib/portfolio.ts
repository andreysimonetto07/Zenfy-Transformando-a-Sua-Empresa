import { createClient } from "@supabase/supabase-js";
import type { PortfolioProject } from "@/types/portfolio";

export async function getPublishedProjects(): Promise<PortfolioProject[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  const { data, error } = await createClient(url, key, { auth: { persistSession: false } })
    .from("portfolio_projects")
    .select("id,name,client_name,image_url,description,service,technologies,url,date,results")
    .eq("published", true).order("date", { ascending: false });
  return error ? [] : (data as PortfolioProject[]);
}
