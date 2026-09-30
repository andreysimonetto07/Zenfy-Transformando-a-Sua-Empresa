import Link from "next/link";

export default function ComingSoon({ title, description, back = "/admin/dashboard" }: { title: string; description: string; back?: string }) {
  return (
    <div className="mx-auto max-w-3xl py-8">
      <div className="rounded-2xl border border-blue-100 bg-white p-8 shadow-sm md:p-10">
        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-brand">Próxima fase</span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-3 max-w-xl leading-relaxed text-zinc-600">{description}</p>
        <p className="mt-6 rounded-xl bg-mist p-4 text-sm text-zinc-600">Este módulo já tem rota reservada e será conectado ao Supabase conforme a próxima etapa de desenvolvimento da Zenfy.</p>
        <Link href={back} className="btn btn-primary mt-7">Voltar ao painel</Link>
      </div>
    </div>
  );
}
