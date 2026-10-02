"use client";

import { useState, useTransition } from "react";
import { saveDailyClientUpdateAction } from "@/app/admin/clientes/actions";

export default function DailyClientUpdateForm({clientId,today,initial}:{clientId:string;today:string;initial?:any|null}){
  const [pending,startTransition]=useTransition();
  const [feedback,setFeedback]=useState<{ok:boolean;text:string}|null>(null);

  function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    const raw={...Object.fromEntries(new FormData(e.currentTarget).entries()),client_id:clientId};
    startTransition(async()=>{
      const result=await saveDailyClientUpdateAction(raw);
      setFeedback({ok:result.ok,text:result.ok?result.message||"Relatório salvo.":result.error||"Erro ao salvar."});
    });
  }

  return <section className="surface overflow-hidden">
    <div className="border-b border-zinc-100 p-5 sm:p-6">
      <p className="eyebrow">Transparência com o cliente</p>
      <h2 className="mt-2 text-2xl font-black text-[#09113f]">Relatório do dia</h2>
      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-500">No fim do dia, registre de forma simples o que a Zenfy fez, o que aconteceu e qual é o próximo passo. O cliente vê isso na própria dashboard.</p>
    </div>

    <form onSubmit={submit} className="grid gap-4 p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm"><span className="mb-1.5 block font-bold text-zinc-700">Data</span><input name="update_date" type="date" defaultValue={initial?.update_date||today} required className="input"/></label>
        <label className="text-sm"><span className="mb-1.5 block font-bold text-zinc-700">Título</span><input name="title" defaultValue={initial?.title||"Atualização do dia"} maxLength={120} required className="input"/></label>
      </div>
      <label className="text-sm"><span className="mb-1.5 block font-bold text-zinc-700">O que fizemos hoje</span><textarea name="work_done" defaultValue={initial?.work_done||""} rows={4} maxLength={4000} required className="input" placeholder="Ex.: Ajustamos os públicos, pausamos um anúncio com CPL alto e publicamos dois novos criativos."/></label>
      <label className="text-sm"><span className="mb-1.5 block font-bold text-zinc-700">O que aconteceu / resultados</span><textarea name="results" defaultValue={initial?.results||""} rows={3} maxLength={3000} className="input" placeholder="Ex.: Hoje entraram 12 leads e o custo por lead caiu em relação a ontem."/></label>
      <label className="text-sm"><span className="mb-1.5 block font-bold text-zinc-700">Próximos passos</span><textarea name="next_steps" defaultValue={initial?.next_steps||""} rows={3} maxLength={3000} className="input" placeholder="Ex.: Amanhã vamos acompanhar os novos criativos e testar uma nova segmentação."/></label>

      {feedback&&<p className={`rounded-xl p-3 text-sm ${feedback.ok?"bg-emerald-50 text-emerald-800":"bg-red-50 text-red-700"}`}>{feedback.text}</p>}
      <button disabled={pending} className="btn btn-primary w-fit">{pending?"Salvando...":"Publicar relatório do dia"}</button>
    </form>
  </section>;
}
