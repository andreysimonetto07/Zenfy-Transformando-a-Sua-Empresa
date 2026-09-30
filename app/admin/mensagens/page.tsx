import AdminMessageComposer from "@/components/AdminMessageComposer";
import { requireProfile } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/permissions";

export default async function MensagensAdmin(){
  const {supabase,profile}=await requireProfile(ADMIN_ROLES);
  const [{data:messages},{data:clients}]=await Promise.all([
    supabase.from("messages").select("id,sender_id,receiver_id,content,read,created_at").order("created_at",{ascending:false}).limit(250),
    supabase.from("profiles").select("id,name,email").eq("role","client").order("name"),
  ]);

  const profileIds=Array.from(new Set((messages??[]).flatMap(m=>[m.sender_id,m.receiver_id]).filter(Boolean)));
  const {data:people}=profileIds.length?await supabase.from("profiles").select("id,name,email,role").in("id",profileIds):{data:[]};
  const names=new Map((people??[]).map(p=>[p.id,p]));

  return <div className="mx-auto max-w-7xl">
    <div className="mb-7"><p className="eyebrow">Relacionamento</p><h1 className="mt-2 text-3xl font-black text-[#09113f]">Mensagens</h1><p className="mt-2 text-zinc-600">Central de conversa entre a equipe Zenfy e os clientes.</p></div>
    <AdminMessageComposer clients={(clients??[]).map(c=>({id:c.id,name:c.name,email:c.email||""}))}/>
    <section className="surface mt-6 overflow-hidden">
      <div className="border-b border-zinc-200 p-5 sm:p-6"><h2 className="text-xl font-black text-[#09113f]">Conversas recentes</h2></div>
      {(messages??[]).length?<div className="divide-y divide-zinc-100">{(messages??[]).map(m=>{const sender=names.get(m.sender_id);const receiver=names.get(m.receiver_id);const mine=m.sender_id===profile.id;return <article key={m.id} className="p-5 sm:p-6"><div className="flex flex-wrap items-center gap-2 text-xs"><span className={`rounded-full px-2.5 py-1 font-black ${mine?"bg-blue-50 text-brand":"bg-zinc-100 text-zinc-600"}`}>{mine?"Equipe Zenfy":"Cliente"}</span><span className="font-bold text-zinc-500">{sender?.name||"Usuário"} → {receiver?.name||"Usuário"}</span><span className="ml-auto text-zinc-400">{m.created_at?new Date(m.created_at).toLocaleString("pt-BR",{dateStyle:"short",timeStyle:"short"}):""}</span></div><p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">{m.content}</p></article>})}</div>:<div className="p-10 text-center text-sm text-zinc-500">Nenhuma mensagem ainda.</div>}
    </section>
  </div>;
}
