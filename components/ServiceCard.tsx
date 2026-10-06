import Link from "next/link";
import type { Service } from "@/lib/services";

export default function ServiceCard({ s }: { s: Service }) {
  return (
    <article className="surface group p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-950/10 sm:p-8">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl brand-gradient text-lg font-black text-white shadow-lg">↗</div>
      <h2 className="mt-5 text-2xl font-black tracking-[-0.035em] text-[#09113f]">{s.title}</h2>
      <p className="mt-3 leading-relaxed text-zinc-600">{s.description}</p>
      <div className="mt-6 grid gap-4 text-sm sm:grid-cols-3 lg:grid-cols-1">
        <div className="rounded-2xl bg-blue-50/70 p-4"><p className="font-bold text-[#09113f]">Resolve</p><p className="mt-1 text-zinc-600">{s.problem}</p></div>
        <div className="rounded-2xl bg-violet-50/60 p-4"><p className="font-bold text-[#09113f]">Benefícios</p><ul className="mt-2 space-y-1.5 text-zinc-600">{s.benefits.map((b) => <li key={b}>• {b}</li>)}</ul></div>
        <div className="rounded-2xl bg-cyan-50/60 p-4"><p className="font-bold text-[#09113f]">Ideal para</p><p className="mt-1 text-zinc-600">{s.audience}</p></div>
      </div>
      <Link href={`/solicitar-orcamento?servico=${encodeURIComponent(s.title)}`} className="btn btn-primary mt-6 w-full sm:w-auto">Pedir orçamento desta solução</Link>
    </article>
  );
}
