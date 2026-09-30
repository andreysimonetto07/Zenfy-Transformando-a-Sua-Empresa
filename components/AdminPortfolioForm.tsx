"use client";

import { useState, useTransition } from "react";
import { createPortfolioProjectAction, createTestimonialAction } from "@/app/admin/portfolio/actions";

export default function AdminPortfolioForm() {
  const [kind,setKind]=useState<"project"|"testimonial">("project");
  const [pending,startTransition]=useTransition();
  const [feedback,setFeedback]=useState<{ok:boolean;text:string}|null>(null);

  function submit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form=e.currentTarget;
    const fd=new FormData(form);
    setFeedback(null);
    startTransition(async()=>{
      const result=kind==="project" ? await createPortfolioProjectAction(fd) : await createTestimonialAction(fd);
      setFeedback({ok:result.ok,text:result.ok ? result.message || "Salvo." : result.error || "Não foi possível salvar."});
      if(result.ok) form.reset();
    });
  }

  return <section className="surface p-5 sm:p-6">
    <div className="flex gap-2">
      <button type="button" onClick={()=>setKind("project")} className={`rounded-xl px-4 py-2 text-sm font-black ${kind==="project"?"brand-gradient text-white":"bg-zinc-100 text-zinc-600"}`}>Projeto / Case</button>
      <button type="button" onClick={()=>setKind("testimonial")} className={`rounded-xl px-4 py-2 text-sm font-black ${kind==="testimonial"?"brand-gradient text-white":"bg-zinc-100 text-zinc-600"}`}>Avaliação</button>
    </div>

    <form key={kind} onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
      {kind==="project" ? <>
        <F name="name" label="Nome do projeto" required /><F name="client_name" label="Empresa / cliente" />
        <label className="text-sm"><span className="mb-1.5 block font-bold">Categoria</span><select name="category" className="input"><option value="site">Site</option><option value="landing_page">Landing Page</option><option value="sistema">Sistema</option><option value="video">Edição de vídeo</option><option value="criativo">Criativo</option><option value="case">Case de sucesso</option></select></label>
        <label className="text-sm"><span className="mb-1.5 block font-bold">Mídia</span><select name="media_type" className="input"><option value="image">Imagem</option><option value="video">Vídeo</option></select></label>
        <F name="image_url" label="URL da imagem / capa" placeholder="https://..." /><F name="video_url" label="URL direta do vídeo" placeholder="https://...mp4" />
        <F name="service" label="Serviço" /><F name="technologies" label="Tecnologias" placeholder="Next.js, Vercel, Supabase" />
        <F name="url" label="Link do projeto" placeholder="https://..." /><F name="date" label="Data" type="date" />
        <Area name="description" label="Descrição" /><Area name="objective" label="Objetivo" /><Area name="work_done" label="O que a Zenfy fez" /><Area name="results" label="Resultado / case" />
        <Check name="published" label="Publicar no site" /><Check name="featured" label="Destacar na Home" />
      </> : <>
        <F name="name" label="Nome da pessoa" required /><F name="company" label="Empresa" />
        <F name="role" label="Cargo / relação" /><F name="rating" label="Nota (1 a 5)" type="number" min="1" max="5" />
        <Area name="quote" label="Depoimento real" required />
        <Check name="published" label="Publicar no site" /><Check name="featured" label="Destacar" />
      </>}
      {feedback&&<p className={`rounded-2xl p-3 text-sm sm:col-span-2 ${feedback.ok?"bg-emerald-50 text-emerald-900":"bg-red-50 text-red-700"}`}>{feedback.text}</p>}
      <div className="sm:col-span-2"><button disabled={pending} className="btn btn-primary">{pending?"Salvando...":"Salvar"}</button></div>
    </form>
  </section>;
}

function F(props:{name:string;label:string;type?:string;required?:boolean;placeholder?:string;min?:string;max?:string}){return <label className="text-sm"><span className="mb-1.5 block font-bold">{props.label}</span><input name={props.name} type={props.type||"text"} required={props.required} placeholder={props.placeholder} min={props.min} max={props.max} className="input"/></label>}
function Area({name,label,required}:{name:string;label:string;required?:boolean}){return <label className="text-sm sm:col-span-2"><span className="mb-1.5 block font-bold">{label}</span><textarea name={name} required={required} rows={4} className="input"/></label>}
function Check({name,label}:{name:string;label:string}){return <label className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-bold text-zinc-700"><input name={name} type="checkbox" className="h-4 w-4" />{label}</label>}
