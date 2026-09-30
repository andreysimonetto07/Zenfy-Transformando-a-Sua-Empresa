"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCompanyAction } from "@/app/admin/leads/actions";

export default function CompanyCreateButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    startTransition(async () => {
      const result = await createCompanyAction(data);
      if (!result.ok) return setError(result.error);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn btn-primary">+ Nova Empresa</button>
      {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label="Nova empresa">
        <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
          <div className="mb-5 flex justify-between"><h2 className="text-xl font-bold">Nova empresa</h2><button onClick={() => setOpen(false)} aria-label="Fechar" className="text-xl text-zinc-500">×</button></div>
          <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
            {[["name","Nome *"],["document","CNPJ/documento"],["industry","Nicho"],["phone","Telefone"],["whatsapp","WhatsApp"],["email","E-mail"],["instagram","Instagram"],["facebook","Facebook"],["website","Site"],["city","Cidade"],["state","Estado"]].map(([name,label]) => <label key={name} className="text-sm"><span className="mb-1 block font-medium">{label}</span><input name={name} required={name === "name"} className="input" /></label>)}
            <label className="text-sm md:col-span-2"><span className="mb-1 block font-medium">Observações</span><textarea name="notes" rows={4} className="input" /></label>
            {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700 md:col-span-2">{error}</p>}
            <div className="flex justify-end gap-3 md:col-span-2"><button type="button" onClick={() => setOpen(false)} className="btn btn-ghost">Cancelar</button><button disabled={pending} className="btn btn-primary">{pending ? "Salvando..." : "Cadastrar empresa"}</button></div>
          </form>
        </div>
      </div>}
    </>
  );
}
