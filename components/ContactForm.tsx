"use client";
import { useState } from "react";

const services = ["Site completo", "Landing Page", "Tráfego Pago", "Automação", "Criativos", "Copywriting", "Consultoria", "Outro"];

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const body = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/contato", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setState(res.ok ? "ok" : "error");
  }
  if (state === "ok") return <p className="rounded-md bg-mist p-6">Recebemos sua mensagem. Entraremos em contato pelo WhatsApp ou e-mail informado.</p>;
  const f = (name: string, label: string, type = "text", req = false) => (
    <label className="block text-sm"><span className="mb-1 block font-medium">{label}</span>
      <input name={name} type={type} required={req} className="input" /></label>
  );
  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
      {f("name", "Nome", "text", true)}{f("company", "Empresa")}
      {f("whatsapp", "WhatsApp", "tel", true)}{f("email", "E-mail", "email", true)}
      {f("instagram", "Instagram")}{f("website", "Site atual")}
      <label className="block text-sm md:col-span-2"><span className="mb-1 block font-medium">Serviço desejado</span>
        <select name="service" required className="input">{services.map((s) => <option key={s}>{s}</option>)}</select></label>
      <label className="block text-sm md:col-span-2"><span className="mb-1 block font-medium">Mensagem</span>
        <textarea name="message" rows={4} className="input" /></label>
      {state === "error" && <p className="text-sm text-red-600 md:col-span-2">Não foi possível enviar. Confira os campos e tente novamente.</p>}
      <button disabled={state === "sending"} className="btn btn-primary md:col-span-2">
        {state === "sending" ? "Enviando..." : "Quero transformar minha empresa"}</button>
    </form>
  );
}
