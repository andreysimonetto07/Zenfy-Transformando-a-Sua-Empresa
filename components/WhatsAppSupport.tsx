"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { PublicAccount } from "@/types/account";
import { usePathname } from "next/navigation";

const contacts=[
  {
    name:"Andrey",
    role:"Desenvolvedor & Suporte",
    phone:"+55 45 99840-6220",
    wa:"5545998406220",
    message:(company:string,insidePortal:boolean)=>insidePortal
      ? `Olá Andrey! Estou no portal da Zenfy e quero falar sobre site, landing page ou suporte para ${company}. Pode me ajudar?`
      : `Olá Andrey! Vi o site da Zenfy e quero conversar sobre site, landing page ou uma solução digital para ${company}. Pode me ajudar?`,
  },
  {
    name:"Pedro Henrique de Carli Silva",
    role:"Suporte & Gestor de Tráfego",
    phone:"+55 45 9812-2270",
    wa:"554598122270",
    message:(company:string,insidePortal:boolean)=>insidePortal
      ? `Olá Pedro! Estou no portal da Zenfy e quero falar sobre tráfego pago/campanhas para ${company}. Pode me ajudar?`
      : `Olá Pedro! Vi o site da Zenfy e quero conversar sobre tráfego pago para ${company}. Pode me explicar como funciona?`,
  },
];

export default function WhatsAppSupport({account}:{account:PublicAccount|null}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open,setOpen]=useState(false);
  const pathname=usePathname();
  const company=(account?.companyName||"minha empresa").trim();
  const insidePortal=pathname.startsWith("/cliente") || pathname.startsWith("/admin");

  useEffect(() => {
    const element = dialog.current;
    if (open && !element?.open) element?.showModal();
    if (!open && element?.open) element.close();
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  useEffect(() => setOpen(false), [pathname]);

  return <div className="support-dock fixed inset-x-0 bottom-0 z-[120] border-t border-zinc-200 bg-white/95 px-3 pt-2 backdrop-blur-xl md:inset-x-auto md:bottom-6 md:right-6 md:border-0 md:bg-transparent md:p-0">
    <dialog ref={dialog} onClose={() => setOpen(false)} onCancel={() => setOpen(false)}
      onClick={event => { if (event.target === dialog.current) setOpen(false); }}
      aria-labelledby="support-title"
      className="support-dialog fixed m-0 w-[min(calc(100vw-24px),380px)] overflow-y-auto rounded-3xl border border-zinc-200 bg-white p-3 shadow-2xl">
      <div className="mb-2 flex items-center justify-between gap-3 px-1">
        <p className="text-xs font-bold text-zinc-500">Atendimento Zenfy</p>
        <button type="button" onClick={() => setOpen(false)} className="min-h-11 rounded-xl px-3 text-sm font-bold text-zinc-600" autoFocus>Fechar ×</button>
      </div>
      <div className="rounded-[1.2rem] bg-[#06114f] p-4 text-white">
        <p className="text-[10px] font-black uppercase tracking-[.16em] text-cyan-100">{insidePortal ? "Suporte à sua empresa" : "Orçamento personalizado"}</p>
        <h3 id="support-title" className="mt-1 text-lg font-black">Com quem você precisa falar?</h3>
        <p className="mt-1 text-xs leading-relaxed text-blue-50/65">Escolha o contato certo e o WhatsApp já abre com uma mensagem pronta.</p>
      </div>

      <div className="mt-2 grid gap-2">
        {contacts.map(contact=>{
          const href=`https://wa.me/${contact.wa}?text=${encodeURIComponent(contact.message(company,insidePortal))}`;
          return <a key={contact.name} href={href} target="_blank" rel="noopener noreferrer" className="group rounded-[1.2rem] border border-zinc-100 bg-white p-4 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/45">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
                <WhatsIcon/>
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-black text-[#09113f]">{contact.name}</p>
                <p className="mt-0.5 text-xs font-bold text-brand">{contact.role}</p>
                <p className="mt-1 text-sm text-zinc-500">{contact.phone}</p>
              </div>
              <span className="mt-2 font-black text-emerald-600 transition-transform group-hover:translate-x-1">→</span>
            </div>
          </a>;
        })}
      </div>

      <p className="px-2 pb-1 pt-3 text-center text-[11px] leading-relaxed text-zinc-400">Conte seu objetivo e receba orientação da nossa equipe.</p>
    </dialog>

    <div className="flex h-14 items-center gap-2 md:h-auto">
      <Link href={account?.dashboardHref || "/login"} className="flex min-h-12 min-w-0 flex-1 items-center gap-2 rounded-xl px-2 py-1.5 text-[#09113f] md:hidden" aria-label={account ? `Conta conectada: ${account.name}. Abrir painel` : "Entrar na área do cliente"}>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl brand-gradient text-xs font-black text-white">{account?.initials || "Z"}</span>
        <span className="min-w-0">
          <span className={`block text-[10px] font-bold ${account ? "text-emerald-700" : "text-zinc-500"}`}>{account ? "● Conta conectada" : "Já é cliente?"}</span>
          <span className="block truncate text-xs font-black">{account?.companyName || account?.name || "Acessar meu portal"}</span>
        </span>
      </Link>
    <button type="button" onClick={()=>setOpen(v=>!v)} className={`group flex h-12 shrink-0 items-center justify-center gap-3 rounded-full border px-3 text-sm font-black shadow-2xl transition duration-300 active:scale-[.98] md:h-auto md:w-auto md:px-4 md:py-3.5 ${open?"border-[#06114f] bg-[#06114f] text-white":"border-emerald-400/40 bg-emerald-500 text-white shadow-emerald-900/20 hover:-translate-y-1 hover:bg-emerald-600"}`} aria-label={insidePortal ? "Falar com a equipe pelo WhatsApp" : "Pedir orçamento pelo WhatsApp"} aria-expanded={open}>
      <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
        <WhatsIcon/>
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-emerald-500 bg-white"/>
      </span>
      <span>{insidePortal ? "WhatsApp" : "Orçamento"}<span className="hidden md:inline"> pelo WhatsApp</span></span>
    </button>
    </div>
  </div>;
}

function WhatsIcon(){
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.8 11.8 0 0 0 12.08 0C5.56 0 .25 5.3.25 11.82c0 2.08.54 4.11 1.57 5.9L.15 23.82l6.24-1.64a11.8 11.8 0 0 0 5.68 1.45h.01c6.51 0 11.82-5.3 11.82-11.82 0-3.16-1.23-6.13-3.38-8.33Zm-8.44 18.15h-.01a9.78 9.78 0 0 1-4.98-1.36l-.36-.21-3.7.97.99-3.61-.23-.37a9.8 9.8 0 0 1-1.5-5.23c0-5.4 4.4-9.8 9.81-9.8 2.62 0 5.08 1.02 6.93 2.88a9.74 9.74 0 0 1 2.87 6.93c0 5.4-4.4 9.8-9.8 9.8Zm5.38-7.34c-.29-.15-1.74-.86-2.01-.96-.27-.1-.47-.15-.66.15-.2.3-.76.96-.93 1.16-.17.2-.34.22-.63.07-.3-.15-1.24-.46-2.36-1.46a8.84 8.84 0 0 1-1.64-2.04c-.17-.3-.02-.45.13-.6.13-.13.3-.34.44-.51.15-.17.2-.3.3-.49.1-.2.05-.37-.03-.52-.07-.15-.66-1.6-.9-2.19-.24-.57-.48-.49-.66-.5h-.56c-.2 0-.52.08-.78.37-.27.3-1.03 1.01-1.03 2.46s1.06 2.85 1.2 3.04c.15.2 2.08 3.18 5.04 4.46.7.3 1.25.49 1.68.62.71.23 1.35.2 1.86.12.57-.09 1.74-.71 1.99-1.4.24-.68.24-1.27.17-1.39-.07-.12-.27-.2-.56-.35Z"/></svg>;
}
