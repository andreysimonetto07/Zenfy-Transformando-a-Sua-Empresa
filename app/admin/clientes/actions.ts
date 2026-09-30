"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireProfile } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/permissions";

type Result={ok:true;message?:string}|{ok:false;error:string};

const id=z.string().uuid();
const projectSchema=z.object({
  client_id:id, company_id:id.optional().or(z.literal("")),
  name:z.string().trim().min(2).max(160), description:z.string().trim().max(3000).optional(),
  type:z.string().trim().max(80).optional(), status:z.string().trim().max(80).default("planejamento"),
  progress:z.coerce.number().min(0).max(100), start_date:z.string().optional(), deadline:z.string().optional(), price:z.coerce.number().min(0).optional(),
});
const siteSchema=z.object({
  client_id:id, project_id:id.optional().or(z.literal("")), name:z.string().trim().min(2).max(160),
  url:z.string().trim().max(400).optional(), domain:z.string().trim().max(240).optional(), platform:z.string().trim().max(100).optional(),
  status:z.enum(["planejamento","desenvolvimento","ativo","pausado","arquivado"]), notes:z.string().trim().max(2000).optional(),
});
const trafficSchema=z.object({
  client_id:id, project_id:id.optional().or(z.literal("")), period_start:z.string().min(8), period_end:z.string().min(8),
  platform:z.string().trim().min(2).max(100), spend:z.coerce.number().min(0), impressions:z.coerce.number().int().min(0),
  clicks:z.coerce.number().int().min(0), leads:z.coerce.number().int().min(0), conversions:z.coerce.number().int().min(0),
  revenue:z.coerce.number().min(0), notes:z.string().trim().max(2000).optional(),
});
const invoiceSchema=z.object({
  client_id:id, description:z.string().trim().min(2).max(220), amount:z.coerce.number().min(0),
  due_date:z.string().optional(), status:z.enum(["pendente","pago","atrasado","cancelado"]), payment_url:z.string().trim().max(500).optional(),
});

const quickTrafficSchema=z.object({
  client_id:id,
  date:z.string().min(8),
  platform:z.string().trim().min(2).max(100),
  spend:z.coerce.number().min(0),
  impressions:z.coerce.number().int().min(0),
  clicks:z.coerce.number().int().min(0),
  leads:z.coerce.number().int().min(0),
  conversions:z.coerce.number().int().min(0),
  revenue:z.coerce.number().min(0),
});

export async function createProjectAction(raw:unknown):Promise<Result>{
  try{
    const p=projectSchema.safeParse(raw); if(!p.success)return{ok:false,error:"Confira os dados do projeto."};
    const {supabase}=await requireProfile(ADMIN_ROLES); const d=p.data;
    const {error}=await supabase.from("projects").insert({client_id:d.client_id,company_id:d.company_id||null,name:d.name,description:d.description||null,type:d.type||null,status:d.status,progress:Math.round(d.progress/10)*10,start_date:d.start_date||null,deadline:d.deadline||null,price:d.price??null});
    if(error)throw new Error(error.message); refresh(d.client_id); return{ok:true,message:"Projeto criado."};
  }catch(e){return{ok:false,error:e instanceof Error?e.message:"Não foi possível criar o projeto."}}
}

export async function createSiteAction(raw:unknown):Promise<Result>{
  try{
    const p=siteSchema.safeParse(raw); if(!p.success)return{ok:false,error:"Confira os dados do site."};
    const {supabase}=await requireProfile(ADMIN_ROLES); const d=p.data;
    const {error}=await supabase.from("client_sites").insert({client_id:d.client_id,project_id:d.project_id||null,name:d.name,url:d.url||null,domain:d.domain||null,platform:d.platform||null,status:d.status,notes:d.notes||null});
    if(error)throw new Error(error.message); refresh(d.client_id); return{ok:true,message:"Site vinculado ao cliente."};
  }catch(e){return{ok:false,error:formatMigrationError(e)}}
}

export async function createTrafficReportAction(raw:unknown):Promise<Result>{
  try{
    const p=trafficSchema.safeParse(raw); if(!p.success)return{ok:false,error:"Confira os números e o período do relatório."};
    const {supabase}=await requireProfile(ADMIN_ROLES); const d=p.data;
    const {error}=await supabase.from("traffic_reports").insert({...d,project_id:d.project_id||null,notes:d.notes||null});
    if(error)throw new Error(error.message); refresh(d.client_id); return{ok:true,message:"Relatório de tráfego publicado."};
  }catch(e){return{ok:false,error:formatMigrationError(e)}}
}

export async function updateTrafficReportAction(raw:unknown):Promise<Result>{
  try{
    const schema=trafficSchema.extend({report_id:id});
    const p=schema.safeParse(raw); if(!p.success)return{ok:false,error:"Confira os números e o período do relatório."};
    const {supabase}=await requireProfile(ADMIN_ROLES); const d=p.data;
    const {report_id,...payload}=d;
    let updateResult=await supabase.from("traffic_reports").update({...payload,project_id:payload.project_id||null,notes:payload.notes||null,updated_at:new Date().toISOString()}).eq("id",report_id);
    if(updateResult.error?.message.includes("updated_at")){
      updateResult=await supabase.from("traffic_reports").update({...payload,project_id:payload.project_id||null,notes:payload.notes||null}).eq("id",report_id);
    }
    if(updateResult.error)throw new Error(updateResult.error.message); refresh(payload.client_id); return{ok:true,message:"Relatório atualizado."};
  }catch(e){return{ok:false,error:formatMigrationError(e)}}
}

export async function deleteTrafficReportAction(raw:unknown):Promise<Result>{
  try{
    const p=z.object({report_id:id,client_id:id}).safeParse(raw); if(!p.success)return{ok:false,error:"Relatório inválido."};
    const {supabase}=await requireProfile(ADMIN_ROLES);
    const {error}=await supabase.from("traffic_reports").delete().eq("id",p.data.report_id);
    if(error)throw new Error(error.message); refresh(p.data.client_id); return{ok:true,message:"Relatório excluído."};
  }catch(e){return{ok:false,error:formatMigrationError(e)}}
}

export async function quickUpdateTrafficAction(raw:unknown):Promise<Result>{
  try{
    const p=quickTrafficSchema.safeParse(raw);
    if(!p.success)return{ok:false,error:"Confira a data e os números informados."};

    const {supabase}=await requireProfile(ADMIN_ROLES);
    const d=p.data;

    const {data:existing,error:findError}=await supabase
      .from("traffic_reports")
      .select("id")
      .eq("client_id",d.client_id)
      .eq("period_start",d.date)
      .eq("period_end",d.date)
      .ilike("platform",d.platform)
      .order("created_at",{ascending:false})
      .limit(1)
      .maybeSingle();

    if(findError)throw new Error(findError.message);

    const payload={
      client_id:d.client_id,
      period_start:d.date,
      period_end:d.date,
      platform:d.platform,
      spend:d.spend,
      impressions:d.impressions,
      clicks:d.clicks,
      leads:d.leads,
      conversions:d.conversions,
      revenue:d.revenue,
    };

    const payloadWithTimestamp={...payload,updated_at:new Date().toISOString()};

    let result=existing?.id
      ? await supabase.from("traffic_reports").update(payloadWithTimestamp).eq("id",existing.id)
      : await supabase.from("traffic_reports").insert({...payloadWithTimestamp,notes:"Atualização rápida pelo painel administrativo"});

    if(result.error?.message.includes("updated_at")){
      result=existing?.id
        ? await supabase.from("traffic_reports").update(payload).eq("id",existing.id)
        : await supabase.from("traffic_reports").insert({...payload,notes:"Atualização rápida pelo painel administrativo"});
    }

    if(result.error)throw new Error(result.error.message);
    refresh(d.client_id);
    return{ok:true,message:existing?.id?"Métricas do dia atualizadas.":"Métricas do dia publicadas."};
  }catch(e){return{ok:false,error:formatMigrationError(e)}}
}

export async function createInvoiceAction(raw:unknown):Promise<Result>{
  try{
    const p=invoiceSchema.safeParse(raw); if(!p.success)return{ok:false,error:"Confira os dados da cobrança."};
    const {supabase}=await requireProfile(ADMIN_ROLES); const d=p.data;
    const {error}=await supabase.from("invoices").insert({client_id:d.client_id,description:d.description,amount:d.amount,due_date:d.due_date||null,status:d.status,payment_url:d.payment_url||null});
    if(error)throw new Error(error.message); refresh(d.client_id); return{ok:true,message:"Cobrança criada."};
  }catch(e){return{ok:false,error:formatMigrationError(e)}}
}

function refresh(clientId:string){
  revalidatePath("/admin/clientes");
  revalidatePath(`/admin/clientes/${clientId}`);
  revalidatePath("/cliente/dashboard");
  revalidatePath("/cliente/trafego");
  revalidatePath("/cliente/sites");
  revalidatePath("/cliente/projetos");
  revalidatePath("/cliente/faturamento");
}
function formatMigrationError(error:unknown){
  const message=error instanceof Error?error.message:"Operação indisponível.";
  if(message.includes("does not exist")||message.includes("schema cache")) return "Rode a migration 004_client_portal.sql no Supabase antes de usar este módulo.";
  return message;
}
