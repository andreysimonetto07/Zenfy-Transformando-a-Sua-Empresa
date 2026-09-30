"use client";

import { useState,useTransition } from "react";
import { updateSupportStatusAction } from "@/app/admin/tarefas/actions";

export default function SupportStatusSelect({id,status}:{id:string;status:string}){
  const [value,setValue]=useState(status);
  const [pending,startTransition]=useTransition();

  function change(next:string){
    setValue(next);
    startTransition(async()=>{
      const result=await updateSupportStatusAction({id,status:next});
      if(!result.ok)setValue(status);
    });
  }

  return <select value={value} disabled={pending} onChange={e=>change(e.target.value)} className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-bold outline-none focus:border-brand"><option value="aberta">Aberta</option><option value="em_andamento">Em andamento</option><option value="concluida">Concluída</option></select>;
}
