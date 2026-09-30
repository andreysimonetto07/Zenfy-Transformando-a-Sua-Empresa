"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireProfile } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/permissions";

const schema=z.object({
  receiver_id:z.string().uuid(),
  content:z.string().trim().min(1).max(3000),
});

export async function sendAdminMessageAction(raw:unknown){
  try{
    const parsed=schema.safeParse(raw);
    if(!parsed.success)return{ok:false,error:"Escolha o cliente e escreva uma mensagem."};
    const {supabase,profile}=await requireProfile(ADMIN_ROLES);
    const {error}=await supabase.from("messages").insert({
      sender_id:profile.id,
      receiver_id:parsed.data.receiver_id,
      content:parsed.data.content,
    });
    if(error)throw new Error(error.message);
    revalidatePath("/admin/mensagens");
    revalidatePath("/cliente/mensagens");
    return{ok:true,message:"Mensagem enviada."};
  }catch(e){return{ok:false,error:e instanceof Error?e.message:"Não foi possível enviar."}}
}
