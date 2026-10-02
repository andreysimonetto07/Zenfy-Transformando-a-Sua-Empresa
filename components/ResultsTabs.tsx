import Link from "next/link";

const tabs=[
  ["overview","Visão geral"],
  ["meta","Meta Ads"],
  ["ga","Google Analytics"],
  ["manual","Dados manuais"],
] as const;

export default function ResultsTabs({active,period}:{active:string;period:number}) {
  return <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
    {tabs.map(([value,label])=><Link key={value} href={`/cliente/resultados?tab=${value}&period=${period}`} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-black transition ${active===value?"brand-gradient text-white shadow-md":"border border-zinc-200 bg-white text-zinc-600 hover:border-blue-200"}`}>{label}</Link>)}
  </div>;
}
