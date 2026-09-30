import ClientMessageComposer from "@/components/ClientMessageComposer";
import { requireClientPortal, dateBr } from "@/lib/client-portal";
import { createServiceClient } from "@/lib/supabase/server";

export default async function MensagensPage() {
  const { supabase, profile }=await requireClientPortal();
  const [{data:messages},{data:projects}]=await Promise.all([
    supabase.from("messages").select("id,sender_id,receiver_id,project_id,content,read,created_at").or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`).order("created_at",{ascending:true}).limit(200),
    supabase.from("projects").select("id,name").order("created_at",{ascending:false}),
  ]);

  const service=createServiceClient();
  await service.from("messages").update({read:true}).eq("receiver_id",profile.id).eq("read",false);

  return <div className="mx-auto max-w-5xl">
    <div className="mb-7"><p className="eyebrow">Contato direto</p><h1 className="mt-2 text-3xl font-black text-[#09113f]">Mensagens</h1><p className="mt-2 text-zinc-600">Converse com a equipe Zenfy sem depender de perder informações no WhatsApp.</p></div>

    <section className="surface mb-6 p-4 sm:p-6">
      <div className="max-h-[560px] space-y-3 overflow-y-auto pr-1">
        {(messages ?? []).length ? (messages ?? []).map(message=>{
          const mine=message.sender_id===profile.id;
          return <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}><div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm shadow-sm sm:max-w-[72%] ${mine ? "brand-gradient text-white" : "border border-zinc-200 bg-white text-zinc-700"}`}><p className="whitespace-pre-wrap leading-relaxed">{message.content}</p><p className={`mt-2 text-[10px] ${mine ? "text-white/65" : "text-zinc-400"}`}>{mine ? "Você" : "Equipe Zenfy"} · {message.created_at ? new Date(message.created_at).toLocaleString("pt-BR",{dateStyle:"short",timeStyle:"short"}) : dateBr(message.created_at)}</p></div></div>
        }) : <div className="py-14 text-center text-sm text-zinc-500">Nenhuma mensagem ainda. Use o formulário abaixo para falar com a equipe.</div>}
      </div>
    </section>

    <ClientMessageComposer projects={projects ?? []} />
  </div>;
}
