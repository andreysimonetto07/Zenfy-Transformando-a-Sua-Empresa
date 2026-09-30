import type { PortfolioProject } from "@/types/portfolio";
export default function PortfolioCard({ p }: { p: PortfolioProject }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white">
      {p.image_url && /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.image_url} alt={p.name} loading="lazy" className="aspect-video w-full object-cover" />}
      <div className="flex flex-1 flex-col p-6">
        {p.service && <p className="text-sm font-medium text-brand">{p.service}</p>}
        <h2 className="mt-1 text-xl font-bold">{p.name}</h2>
        {p.client_name && <p className="text-sm text-zinc-500">{p.client_name}</p>}
        {p.description && <p className="mt-3 text-sm text-zinc-600">{p.description}</p>}
        {p.results && <p className="mt-3 text-sm"><span className="font-semibold">Resultados: </span>{p.results}</p>}
        {p.technologies && p.technologies.length > 0 && <p className="mt-3 text-xs text-zinc-500">{p.technologies.join(", ")}</p>}
        <div className="mt-auto flex items-center justify-between pt-5 text-sm">
          {p.date && <time dateTime={p.date} className="text-zinc-500">{new Date(p.date).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</time>}
          {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand hover:underline">Ver projeto</a>}
        </div>
      </div>
    </article>
  );
}
