"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireProfile } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/permissions";

const projectSchema = z.object({
  name: z.string().trim().min(2),
  client_name: z.string().trim().optional(),
  category: z.enum(["site","landing_page","sistema","video","criativo","case"]),
  media_type: z.enum(["image","video"]),
  image_url: z.string().trim().optional(),
  video_url: z.string().trim().optional(),
  description: z.string().trim().optional(),
  objective: z.string().trim().optional(),
  work_done: z.string().trim().optional(),
  results: z.string().trim().optional(),
  service: z.string().trim().optional(),
  technologies: z.string().trim().optional(),
  url: z.string().trim().optional(),
  date: z.string().trim().optional(),
  published: z.boolean(),
  featured: z.boolean(),
});

const testimonialSchema = z.object({
  name: z.string().trim().min(2),
  company: z.string().trim().optional(),
  role: z.string().trim().optional(),
  quote: z.string().trim().min(5),
  rating: z.number().int().min(1).max(5).nullable(),
  published: z.boolean(),
  featured: z.boolean(),
});

function checked(value: FormDataEntryValue | null) { return value === "on" || value === "true"; }
function optional(value: string | undefined) { return value?.trim() || null; }

export async function createPortfolioProjectAction(formData: FormData) {
  const { supabase } = await requireProfile(ADMIN_ROLES);
  const parsed = projectSchema.safeParse({
    name: formData.get("name"),
    client_name: formData.get("client_name"),
    category: formData.get("category"),
    media_type: formData.get("media_type"),
    image_url: formData.get("image_url"),
    video_url: formData.get("video_url"),
    description: formData.get("description"),
    objective: formData.get("objective"),
    work_done: formData.get("work_done"),
    results: formData.get("results"),
    service: formData.get("service"),
    technologies: formData.get("technologies"),
    url: formData.get("url"),
    date: formData.get("date"),
    published: checked(formData.get("published")),
    featured: checked(formData.get("featured")),
  });

  if (!parsed.success) return { ok:false, error:"Confira os campos do projeto." };
  const d = parsed.data;
  const { error } = await supabase.from("portfolio_projects").insert({
    name:d.name,
    client_name:optional(d.client_name),
    category:d.category,
    media_type:d.media_type,
    image_url:optional(d.image_url),
    video_url:optional(d.video_url),
    description:optional(d.description),
    objective:optional(d.objective),
    work_done:optional(d.work_done),
    results:optional(d.results),
    service:optional(d.service),
    technologies:d.technologies ? d.technologies.split(",").map((x)=>x.trim()).filter(Boolean) : [],
    url:optional(d.url),
    date:optional(d.date),
    published:d.published,
    featured:d.featured,
  });

  if (error) return { ok:false, error:error.message };
  revalidatePath("/portfolio"); revalidatePath("/admin/portfolio"); revalidatePath("/");
  return { ok:true, message:"Projeto adicionado ao portfólio." };
}

export async function createTestimonialAction(formData: FormData) {
  const { supabase } = await requireProfile(ADMIN_ROLES);
  const ratingRaw = String(formData.get("rating") || "").trim();
  const parsed = testimonialSchema.safeParse({
    name:formData.get("name"),
    company:formData.get("company"),
    role:formData.get("role"),
    quote:formData.get("quote"),
    rating:ratingRaw ? Number(ratingRaw) : null,
    published:checked(formData.get("published")),
    featured:checked(formData.get("featured")),
  });
  if (!parsed.success) return { ok:false, error:"Confira os campos do depoimento." };

  const d=parsed.data;
  const { error }=await supabase.from("testimonials").insert({
    name:d.name, company:optional(d.company), role:optional(d.role), quote:d.quote,
    rating:d.rating, published:d.published, featured:d.featured
  });
  if(error) return {ok:false,error:error.message};
  revalidatePath("/portfolio"); revalidatePath("/admin/portfolio"); revalidatePath("/");
  return {ok:true,message:"Depoimento salvo."};
}

export async function togglePortfolioPublishAction(formData: FormData) {
  const { supabase }=await requireProfile(ADMIN_ROLES);
  const id=String(formData.get("id")||"");
  const value=String(formData.get("published"))==="true";
  await supabase.from("portfolio_projects").update({published:!value}).eq("id",id);
  revalidatePath("/portfolio"); revalidatePath("/admin/portfolio"); revalidatePath("/");
}

export async function toggleTestimonialPublishAction(formData: FormData) {
  const { supabase }=await requireProfile(ADMIN_ROLES);
  const id=String(formData.get("id")||"");
  const value=String(formData.get("published"))==="true";
  await supabase.from("testimonials").update({published:!value}).eq("id",id);
  revalidatePath("/portfolio"); revalidatePath("/admin/portfolio"); revalidatePath("/");
}
