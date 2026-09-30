export default function TrafficShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-[440px]">
      <div className="absolute -left-8 top-6 h-36 w-36 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="absolute -right-8 bottom-2 h-40 w-40 rounded-full bg-violet-400/20 blur-3xl" />

      <div className="relative rounded-[2rem] border border-white/80 bg-white/95 p-5 shadow-2xl shadow-blue-950/10 sm:p-7">
        <p className="eyebrow">Gestão de tráfego</p>
        <h3 className="mt-2 text-2xl font-black tracking-[-0.035em] text-[#09113f]">Campanhas com acompanhamento claro.</h3>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Metric label="Investimento" value="Acompanhado" />
          <Metric label="Leads" value="Mensurados" />
          <Metric label="CPL" value="Calculado" />
          <Metric label="ROAS" value="Registrado" />
        </div>

        <div className="mt-5 rounded-2xl bg-[#06114f] p-4 text-white">
          <p className="text-xs font-black uppercase tracking-[.14em] text-cyan-100">No portal do cliente</p>
          <p className="mt-2 text-sm leading-relaxed text-blue-50/80">Relatórios de Meta Ads, Google Ads e outras campanhas podem ser publicados pela equipe para o cliente acompanhar investimento, cliques, leads e faturamento atribuído.</p>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
      <p className="text-[10px] font-black uppercase tracking-[.12em] text-zinc-400">{label}</p>
      <p className="mt-1 text-sm font-black text-[#09113f]">{value}</p>
    </div>
  );
}
