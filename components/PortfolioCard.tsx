import type { PortfolioProject } from "@/types/portfolio";
export default function PortfolioCard({ p }: { p: PortfolioProject }) {
  return (
    <article className="surface group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-950/10">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-violet-50">
        {p.image_url ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.image_url} alt={p.name} loading="lazy" className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.03]" /> : <div className="flex aspect-[16/10] items-center justify-center text-sm font-semibold text-zinc-400">Projeto Zenfy</div>}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {p.service && <p className="eyebrow">{p.service}</p>}
        <h2 className="mt-2 text-xl font-black tracking-tight text-[#09113f]">{p.name}</h2>
        {p.client_name && <p className="mt-1 text-sm font-medium text-zinc-500">{p.client_name}</p>}
        {p.description && <p className="mt-4 text-sm leading-relaxed text-zinc-600">{p.description}</p>}
        {p.results && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900"><strong>Resultado:</strong> {p.results}</p>}
        <div className="mt-auto flex items-center justify-between gap-4 pt-6 text-sm">
          {p.date && <time dateTime={p.date} className="text-zinc-500">{new Date(p.date).toLocaleDateString("pt-BR", { month:"long", year:"numeric" })}</time>}
          {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="font-bold text-brand hover:underline">Ver projeto →</a>}
        </div>
      </div>
    </article>
  );
}
