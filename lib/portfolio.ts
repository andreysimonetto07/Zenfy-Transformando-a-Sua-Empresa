import { createClient } from "@supabase/supabase-js";
import type { PortfolioProject, Testimonial } from "@/types/portfolio";

function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

const projectFields = "id,name,client_name,image_url,video_url,description,service,category,media_type,technologies,url,date,results,objective,work_done,featured";

export async function getPublishedProjects(): Promise<PortfolioProject[]> {
  const supabase = publicClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("portfolio_projects").select(projectFields).eq("published", true).order("date", { ascending: false });
  return error ? [] : (data as PortfolioProject[]);
}

export async function getFeaturedProjects(): Promise<PortfolioProject[]> {
  const supabase = publicClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("portfolio_projects").select(projectFields).eq("published", true).eq("featured", true).order("date", { ascending: false }).limit(3);
  return error ? [] : (data as PortfolioProject[]);
}

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  const supabase = publicClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("testimonials").select("id,name,company,role,quote,avatar_url,rating,featured").eq("published", true).order("featured", { ascending: false }).limit(12);
  return error ? [] : (data as Testimonial[]);
}
