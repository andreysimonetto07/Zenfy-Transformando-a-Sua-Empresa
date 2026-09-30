import AdminFileUpload from "@/components/AdminFileUpload";
import { requireProfile } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/permissions";
import { createServiceClient } from "@/lib/supabase/server";
import { dateBr } from "@/lib/client-portal";

export default async function AdminArquivosPage(){
  const {supabase}=await requireProfile(ADMIN_ROLES);
  const service=createServiceClient();

  const [{data:clients},{data:files}]=await Promise.all([
    supabase.from("clients").select("id,profiles(name,email),companies(name)").order("created_at",{ascending:false}),
    supabase.from("files").select("id,client_id,name,path,created_at").order("created_at",{ascending:false}).limit(100),
  ]);

  const clientOptions=(clients??[]).map((client:any)=>{
    const profile=Array.isArray(client.profiles)?client.profiles[0]:client.profiles;
    const company=Array.isArray(client.companies)?client.companies[0]:client.companies;
    return {id:client.id,name:company?.name||profile?.name||"Cliente",email:profile?.email||""};
  });

  const clientMap=new Map(clientOptions.map((client)=>[client.id,client]));
  const withUrls=await Promise.all((files??[]).map(async(file:any)=>{
    const {data}=await service.storage.from("client-files").createSignedUrl(file.path,60*30);
    return {...file,url:data?.signedUrl||null};
  }));

  return <div className="mx-auto max-w-7xl">
    <div className="mb-7">
      <p className="eyebrow">Materiais</p>
      <h1 className="mt-2 text-3xl font-black text-[#09113f]">Arquivos dos clientes</h1>
      <p className="mt-2 max-w-2xl text-zinc-600">Envie briefings, relatórios, criativos e documentos direto para a área do cliente. O cliente recebe uma notificação no portal.</p>
    </div>

    <AdminFileUpload clients={clientOptions}/>

    <section className="surface mt-6 overflow-hidden">
      <div className="border-b border-zinc-200 p-5 sm:p-6">
        <h2 className="text-xl font-black text-[#09113f]">Arquivos recentes</h2>
      </div>

      {withUrls.length ? <div className="divide-y divide-zinc-100">
        {withUrls.map((file:any)=>{
          const client=clientMap.get(file.client_id);
          return <div key={file.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-black text-[#09113f]">{file.name||"Arquivo"}</p>
              <p className="mt-1 text-sm text-zinc-500">{client?.name||"Cliente"} · {dateBr(file.created_at)}</p>
            </div>
            {file.url?<a href={file.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Abrir arquivo ↗</a>:<span className="text-xs text-zinc-400">Link indisponível</span>}
          </div>
        })}
      </div>:<div className="p-10 text-center text-sm text-zinc-500">Nenhum arquivo enviado ainda.</div>}
    </section>
  </div>;
}
