import NotificationBell from "@/components/NotificationBell";

export default function InternalTopbar({
  mode,
  name,
  companyName,
}:{
  mode:"admin"|"client";
  name:string;
  companyName?:string|null;
}) {
  const firstName = name.trim().split(/\s+/)[0] || name;
  const initials=name.trim().split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join("").toUpperCase()||"Z";
  const admin = mode === "admin";

  return (
    <header className="sticky top-0 z-[100] isolate border-b border-white/10 bg-[#06114f] text-white shadow-xl shadow-blue-950/10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(25,211,231,.20),transparent_20rem),radial-gradient(circle_at_100%_100%,rgba(217,70,239,.16),transparent_24rem)]" />
      </div>

      <div className="relative flex min-h-[70px] items-center justify-between gap-2 px-3 sm:min-h-[72px] sm:gap-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[.16em] text-cyan-100/75 sm:tracking-[.18em]">{admin ? "Zenfy Admin" : "Portal da empresa"}</p>
          <div className="mt-1 hidden items-center gap-2 sm:flex">
            <h2 className="truncate text-lg font-black">{admin ? "Gestão, clientes e resultados" : companyName||"Campanhas, projetos e acompanhamento"}</h2>
            <span className="hidden rounded-full border border-white/10 bg-white/10 px-2 py-1 text-[10px] font-black uppercase tracking-[.1em] text-blue-50/80 md:inline-flex">{admin ? "Admin" : "Cliente"}</span>
          </div>
          {!admin&&companyName&&<p className="mt-1 max-w-[180px] truncate text-xs font-black text-cyan-100 sm:hidden">{companyName}</p>}
        </div>

        <div className="relative z-[110] flex min-w-0 items-center gap-2">
          <div className="flex min-w-0 items-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.08] px-2 py-1.5 sm:px-3 sm:py-2">
            <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl brand-gradient text-[10px] font-black text-white">
              {initials}
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#06114f] bg-emerald-400"/>
            </span>
            <div className="min-w-0 pr-1">
              <p className="max-w-[76px] truncate text-xs font-black sm:max-w-[150px] sm:text-sm">{firstName}</p>
              <p className="text-[9px] font-bold text-emerald-300 sm:text-[10px]">● Conectado</p>
            </div>
          </div>
          <NotificationBell />
        </div>
      </div>
    </header>
  );
}
