export default function AnalyticsMetricCard({
  label,
  value,
  comparison,
  hint,
}:{
  label:string;
  value:string;
  comparison?:number|null;
  hint?:string;
}) {
  const neutral=comparison==null||!Number.isFinite(comparison);
  const positive=!neutral&&comparison>=0;

  return <div className="surface group p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl">
    <div className="flex items-start justify-between gap-3">
      <p className="text-xs font-black uppercase tracking-[.12em] text-zinc-400">{label}</p>
      {!neutral&&<span className={`rounded-full px-2 py-1 text-[10px] font-black ${positive?"bg-emerald-50 text-emerald-700":"bg-red-50 text-red-600"}`}>{positive?"+":""}{comparison!.toFixed(1)}%</span>}
    </div>
    <p className="mt-2 text-2xl font-black tracking-tight text-[#09113f]">{value}</p>
    {hint&&<p className="mt-2 text-xs leading-relaxed text-zinc-500">{hint}</p>}
  </div>;
}
