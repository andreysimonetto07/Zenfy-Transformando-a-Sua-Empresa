"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireProfile } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/permissions";

const statusSchema=z.object({id:z.string().uuid(),status:z.enum(["aberta","em_andamento","concluida"])});

export async function updateSupportStatusAction(raw:unknown){
  try{
    const parsed=statusSchema.safeParse(raw); if(!parsed.success)return{ok:false,error:"Status inválido."};
    const {supabase}=await requireProfile(ADMIN_ROLES);
    const {error}=await supabase.from("service_requests").update({status:parsed.data.status}).eq("id",parsed.data.id);
    if(error)throw new Error(error.message);
    revalidatePath("/admin/tarefas"); revalidatePath("/cliente/suporte"); revalidatePath("/cliente/dashboard");
    return{ok:true};
  }catch(e){return{ok:false,error:e instanceof Error?e.message:"Não foi possível atualizar."}}
}
