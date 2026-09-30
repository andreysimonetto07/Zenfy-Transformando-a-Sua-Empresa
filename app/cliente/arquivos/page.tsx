import ClientFileUpload from "@/components/ClientFileUpload";
import { requireClientPortal, dateBr } from "@/lib/client-portal";
import { createServiceClient } from "@/lib/supabase/server";

export default async function ArquivosPage() {
  const { supabase }=await requireClientPortal();
  const [{data:files},{data:projects}]=await Promise.all([
    supabase.from("files").select("id,name,path,created_at,project_id").order("created_at",{ascending:false}),
    supabase.from("projects").select("id,name").order("created_at",{ascending:false}),
  ]);

  const service=createServiceClient();
  const withUrls=await Promise.all((files ?? []).map(async file=>{
    const {data}=await service.storage.from("client-files").createSignedUrl(file.path,60*30);
    return {...file,url:data?.signedUrl || null};
  }));

  return <div className="mx-auto max-w-6xl">
    <div className="mb-7"><p className="eyebrow">Materiais</p><h1 className="mt-2 text-3xl font-black text-[#09113f]">Arquivos</h1><p className="mt-2 text-zinc-600">Envie briefings, imagens e documentos e acesse arquivos vinculados à sua conta.</p></div>
    <ClientFileUpload projects={projects ?? []}/>
    <section className="surface mt-6 overflow-hidden">{withUrls.length ? <div className="divide-y divide-zinc-100">{withUrls.map(file=><div key={file.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-black text-[#09113f]">{file.name || "Arquivo"}</p><p className="mt-1 text-xs text-zinc-400">{dateBr(file.created_at)}</p></div>{file.url ? <a href={file.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Abrir arquivo ↗</a> : <span className="text-xs text-zinc-400">Link indisponível</span>}</div>)}</div> : <div className="p-10 text-center text-sm text-zinc-500">Nenhum arquivo enviado ainda.</div>}</section>
  </div>;
}
