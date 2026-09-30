"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireProfile } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/permissions";
import { createServiceClient } from "@/lib/supabase/server";

type Result = { ok:true; message?:string } | { ok:false; error:string };

const id=z.string().uuid();

export async function uploadAdminFileAction(formData:FormData):Promise<Result>{
  try{
    const clientId=String(formData.get("client_id")||"");
    const projectId=String(formData.get("project_id")||"").trim();
    const file=formData.get("file");

    if(!id.safeParse(clientId).success) return {ok:false,error:"Escolha o cliente."};
    if(projectId && !id.safeParse(projectId).success) return {ok:false,error:"Projeto inválido."};
    if(!(file instanceof File)||file.size===0) return {ok:false,error:"Escolha um arquivo."};
    if(file.size>10*1024*1024) return {ok:false,error:"O arquivo deve ter no máximo 10 MB."};

    const {profile}=await requireProfile(ADMIN_ROLES);
    const service=createServiceClient();

    const {data:client,error:clientError}=await service.from("clients").select("id").eq("id",clientId).maybeSingle();
    if(clientError||!client) return {ok:false,error:"Cliente não encontrado."};

    const safeName=file.name.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9._-]/g,"-");
    const path=`admin/${clientId}/${Date.now()}-${safeName}`;
    const buffer=Buffer.from(await file.arrayBuffer());

    const {error:uploadError}=await service.storage.from("client-files").upload(path,buffer,{
      contentType:file.type||"application/octet-stream",
      upsert:false,
    });

    if(uploadError){
      if(uploadError.message.toLowerCase().includes("bucket")) return {ok:false,error:"Rode a migration 004_client_portal.sql no Supabase antes de enviar arquivos."};
      throw new Error(uploadError.message);
    }

    const {error:dbError}=await service.from("files").insert({
      owner_id:profile.id,
      client_id:clientId,
      project_id:projectId||null,
      path,
      name:file.name,
    });

    if(dbError){
      await service.storage.from("client-files").remove([path]);
      throw new Error(dbError.message);
    }

    revalidatePath("/admin/arquivos");
    revalidatePath("/cliente/arquivos");
    return {ok:true,message:"Arquivo enviado para a área do cliente."};
  }catch(error){
    return {ok:false,error:error instanceof Error?error.message:"Não foi possível enviar o arquivo."};
  }
}
