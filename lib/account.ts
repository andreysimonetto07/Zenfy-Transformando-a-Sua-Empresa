import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { PublicAccount } from "@/types/account";
import { cache } from "react";

function roleLabel(role: PublicAccount["role"]) {
  if (role === "super_admin") return "Super administrador";
  if (role === "admin") return "Administrador";
  return "Cliente";
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "Z";
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

export const getCurrentAccount = cache(async (): Promise<PublicAccount | null> => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("name,email,role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) return null;

  const role = profile.role as PublicAccount["role"];
  const name = profile.name || user.user_metadata?.name || user.email?.split("@")[0] || "Conta Zenfy";
  const email = profile.email || user.email || "";
  let companyName:string|null=null;

  if(role==="client"){
    const service=createServiceClient();
    const {data:client}=await service
      .from("clients")
      .select("company_id,companies(name)")
      .eq("profile_id",user.id)
      .maybeSingle();

    const company=Array.isArray((client as any)?.companies)
      ? (client as any).companies[0]
      : (client as any)?.companies;

    companyName=company?.name||null;
  }

  return {
    name,
    email,
    role,
    roleLabel: roleLabel(role),
    dashboardHref: role === "client" ? "/cliente/dashboard" : "/admin/dashboard",
    initials: initials(name),
    companyName,
  };
});
