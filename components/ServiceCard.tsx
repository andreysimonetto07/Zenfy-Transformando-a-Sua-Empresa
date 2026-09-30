import Link from "next/link";
import type { Service } from "@/lib/services";
export default function ServiceCard({ s }: { s: Service }) {
  return (
    <article className="grid gap-6 border-b border-zinc-200 py-10 md:grid-cols-[1fr_2fr]">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{s.title}</h2>
        <p className="mt-3 text-zinc-600">{s.description}</p>
        <Link href="/solicitar-orcamento" className="btn btn-primary mt-6">Solicitar orçamento</Link>
      </div>
      <dl className="grid gap-5 text-sm sm:grid-cols-3">
        <div><dt className="font-semibold">Problema que resolve</dt><dd className="mt-1 text-zinc-600">{s.problem}</dd></div>
        <div><dt className="font-semibold">Benefícios</dt><dd className="mt-1"><ul className="list-disc space-y-1 pl-4 text-zinc-600">{s.benefits.map((b) => <li key={b}>{b}</li>)}</ul></dd></div>
        <div><dt className="font-semibold">Indicado para</dt><dd className="mt-1 text-zinc-600">{s.audience}</dd></div>
      </dl>
    </article>
  );
}
