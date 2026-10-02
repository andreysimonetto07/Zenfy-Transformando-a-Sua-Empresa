"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { applyTheme, type ThemeMode } from "@/components/ThemeSync";

const options:{value:ThemeMode;title:string;text:string;icon:string}[]=[
  {value:"light",title:"Tema claro",text:"Visual claro e limpo em qualquer dispositivo.",icon:"☀"},
  {value:"system",title:"Tema do dispositivo",text:"A Zenfy acompanha automaticamente o tema do celular ou computador.",icon:"◐"},
  {value:"dark",title:"Tema escuro",text:"Interface escura para ambientes com pouca luz.",icon:"☾"},
];

export default function ThemeSettings({initialTheme="system"}:{initialTheme?:ThemeMode}){
  const [theme,setTheme]=useState<ThemeMode>(initialTheme);
  const [saving,setSaving]=useState(false);
  const [feedback,setFeedback]=useState("");

  useEffect(()=>{
    fetch("/api/theme",{cache:"no-store",credentials:"include"})
      .then(async response=>response.ok?response.json():null)
      .then(data=>{
        const value=data?.theme;
        if(value==="light"||value==="system"||value==="dark"){
          setTheme(value);
          applyTheme(value);
        }
      })
      .catch(()=>null);
  },[]);

  async function choose(next:ThemeMode){
    if(saving)return;
    setTheme(next);
    applyTheme(next);
    setSaving(true);
    setFeedback("");

    try{
      const response=await fetch("/api/theme",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        credentials:"include",
        body:JSON.stringify({theme:next}),
      });
      const data=await response.json().catch(()=>({}));
      if(!response.ok||!data.ok)throw new Error();
      setFeedback("Tema salvo na sua conta.");
    }catch{
      setFeedback("O tema foi aplicado neste dispositivo, mas não conseguimos salvar na conta agora.");
    }finally{
      setSaving(false);
    }
  }

  return <section className="surface overflow-hidden">
    <div className="flex items-center gap-4 border-b border-zinc-100 p-5 sm:p-6">
      <div className="relative h-12 w-12 shrink-0">
        <Image src="/brand/zenfy/icone-zenfy-transparente.png" alt="" fill sizes="48px" className="object-contain"/>
      </div>
      <div>
        <p className="eyebrow">Aparência</p>
        <h2 className="mt-1 text-2xl font-black text-[#09113f]">Escolha o tema da Zenfy</h2>
        <p className="mt-1 text-sm leading-relaxed text-zinc-500">Sua escolha fica salva na conta e pode acompanhar você em outros dispositivos.</p>
      </div>
    </div>

    <div className="grid gap-3 p-5 sm:p-6 lg:grid-cols-3">
      {options.map(option=>{
        const active=theme===option.value;
        return <button
          key={option.value}
          type="button"
          disabled={saving}
          onClick={()=>choose(option.value)}
          className={`group relative overflow-hidden rounded-[1.4rem] border p-4 text-left transition duration-250 disabled:cursor-wait ${active?"border-blue-300 bg-blue-50/80 shadow-lg shadow-blue-950/5":"border-zinc-200 bg-white hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"}`}
        >
          <div className="flex items-start justify-between gap-3">
            <span className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xl font-black ${active?"brand-gradient text-white":"bg-zinc-100 text-zinc-600"}`}>{option.icon}</span>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-black ${active?"border-brand bg-brand text-white":"border-zinc-300 text-transparent"}`}>✓</span>
          </div>
          <p className="mt-4 font-black text-[#09113f]">{option.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-zinc-500">{option.text}</p>

          <div className={`mt-4 overflow-hidden rounded-xl border ${active?"border-blue-200":"border-zinc-200"}`}>
            <div className={`flex h-8 items-center gap-1.5 border-b px-2 ${option.value==="dark"?"border-white/10 bg-[#07102f]":option.value==="system"?"theme-mini-system border-zinc-200":"border-zinc-200 bg-white"}`}>
              <i className="h-1.5 w-1.5 rounded-full bg-red-300"/><i className="h-1.5 w-1.5 rounded-full bg-amber-300"/><i className="h-1.5 w-1.5 rounded-full bg-emerald-300"/>
            </div>
            <div className={`h-14 p-2 ${option.value==="dark"?"bg-[#0c1538]":option.value==="system"?"theme-mini-system-body":"bg-[#f5f8ff]"}`}>
              <div className={`h-2 w-2/3 rounded-full ${option.value==="dark"?"bg-white/20":"bg-zinc-300"}`}/>
              <div className={`mt-2 h-2 w-2/5 rounded-full ${option.value==="dark"?"bg-white/10":"bg-zinc-200"}`}/>
            </div>
          </div>
        </button>;
      })}
    </div>

    {feedback&&<p className="mx-5 mb-5 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-brand sm:mx-6 sm:mb-6">{feedback}</p>}
  </section>;
}
