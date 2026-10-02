"use client";

import { useState, useTransition } from "react";
import { disconnectMetaIntegrationAction, saveMetaIntegrationAction, syncMetaIntegrationAction } from "@/app/admin/integracoes/actions";

type Integration = {
  external_account_id?:string|null;
  account_name?:string|null;
  status?:string|null;
  last_synced_at?:string|null;
  last_error?:string|null;
}|null;

export default function MetaIntegrationCard({clientId,integration}:{clientId:string;integration:Integration}) {
  const [pending,startTransition]=useTransition();
  const [feedback,setFeedback]=useState<{ok:boolean;text:string}|null>(null);

  function save(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form=e.currentTarget;
    const fd=new FormData(form);
    const raw={
      client_id:clientId,
      account_id:String(fd.get("account_id")||""),
      account_name:String(fd.get("account_name")||""),
    };
    startTransition(async()=>{
      const result=await saveMetaIntegrationAction(raw);
      setFeedback({ok:result.ok,text:result.ok?result.message:result.error});
    });
  }

  function sync() {
    startTransition(async()=>{
      const result=await syncMetaIntegrationAction({client_id:clientId});
      setFeedback({ok:result.ok,text:result.ok?result.message:result.error});
    });
  }

  function disconnect() {
    if(!window.confirm("Desconectar Meta Ads deste cliente? Os dados já sincronizados serão mantidos."))return;
    startTransition(async()=>{
      const result=await disconnectMetaIntegrationAction({client_id:clientId});
      setFeedback({ok:result.ok,text:result.ok?result.message:result.error});
    });
  }

  const connected=integration?.status==="active";

  return <section className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-white p-5 shadow-xl shadow-blue-950/5 sm:p-6">
    <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-400/10 blur-3xl"/>
    <div className="relative">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="eyebrow">Integração automática</p>
          <h2 className="mt-2 text-2xl font-black text-[#09113f]">Meta Ads</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-500">Conecte a conta de anúncios deste cliente. O token fica somente nas variáveis secretas da Vercel; o Supabase guarda apenas o ID da conta.</p>
        </div>
        <span className={`w-fit rounded-full px-3 py-1.5 text-xs font-black ${connected?"bg-emerald-50 text-emerald-700":integration?.status==="error"?"bg-red-50 text-red-600":"bg-zinc-100 text-zinc-500"}`}>{connected?"Conectado":integration?.status==="error"?"Erro na conexão":"Não conectado"}</span>
      </div>

      <form onSubmit={save} className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <label className="text-sm"><span className="mb-1.5 block font-bold text-zinc-700">ID da conta de anúncios</span><input name="account_id" defaultValue={integration?.external_account_id||""} placeholder="act_1234567890" required className="input"/></label>
        <label className="text-sm"><span className="mb-1.5 block font-bold text-zinc-700">Nome da conta</span><input name="account_name" defaultValue={integration?.account_name||""} placeholder="Empresa X" className="input"/></label>
        <button disabled={pending} className="btn btn-primary">{pending?"Salvando...":"Salvar conexão"}</button>
      </form>

      {integration&&<div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Info label="Conta" value={integration.account_name||integration.external_account_id||"—"}/>
        <Info label="Última sincronização" value={integration.last_synced_at?new Date(integration.last_synced_at).toLocaleString("pt-BR",{dateStyle:"short",timeStyle:"short"}):"Ainda não sincronizado"}/>
        <Info label="Modo" value="Automático + manual"/>
      </div>}

      {integration?.last_error&&<p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{integration.last_error}</p>}
      {feedback&&<p className={`mt-3 rounded-xl p-3 text-sm ${feedback.ok?"bg-emerald-50 text-emerald-800":"bg-red-50 text-red-700"}`}>{feedback.text}</p>}

      {integration&&<div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={sync} disabled={pending||!connected} className="btn btn-ghost">Sincronizar agora</button>
        <button type="button" onClick={disconnect} disabled={pending} className="rounded-2xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100">Desconectar</button>
      </div>}
    </div>
  </section>;
}

function Info({label,value}:{label:string;value:string}){return <div className="rounded-2xl bg-zinc-50 p-4"><p className="text-[10px] font-black uppercase tracking-[.12em] text-zinc-400">{label}</p><p className="mt-1 truncate text-sm font-black text-[#09113f]">{value}</p></div>}
