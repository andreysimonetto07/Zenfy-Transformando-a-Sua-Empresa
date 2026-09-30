"use client";

import { useMemo, useState } from "react";
import PortfolioCard from "@/components/PortfolioCard";
import type { PortfolioProject, PortfolioCategory } from "@/types/portfolio";

const filters: { value: "all" | PortfolioCategory; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "site", label: "Sites" },
  { value: "landing_page", label: "Landing Pages" },
  { value: "sistema", label: "Sistemas" },
  { value: "video", label: "Vídeos" },
  { value: "criativo", label: "Criativos" },
  { value: "case", label: "Cases" },
];

export default function PortfolioFilters({ projects }: { projects: PortfolioProject[] }) {
  const [filter, setFilter] = useState<"all" | PortfolioCategory>("all");
  const visible = useMemo(() => filter === "all" ? projects : projects.filter((p) => p.category === filter), [filter, projects]);

  return (
    <>
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        {filters.map((item) => (
          <button key={item.value} type="button" onClick={() => setFilter(item.value)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-black transition ${filter === item.value ? "brand-gradient text-white shadow-md" : "border border-zinc-200 bg-white text-zinc-600 hover:border-blue-200"}`}>
            {item.label}
          </button>
        ))}
      </div>

      {visible.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{visible.map((project) => <PortfolioCard key={project.id} p={project} />)}</div>
      ) : (
        <div className="surface p-10 text-center text-sm text-zinc-500">Ainda não há projetos publicados nesta categoria.</div>
      )}
    </>
  );
}
