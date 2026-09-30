import NotificationBell from "@/components/NotificationBell";

export default function InternalTopbar({
  mode,
  name,
}:{
  mode:"admin"|"client";
  name:string;
}) {
  const firstName = name.trim().split(/\s+/)[0] || name;
  const admin = mode === "admin";

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#06114f] text-white shadow-xl shadow-blue-950/10">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(25,211,231,.20),transparent_20rem),radial-gradient(circle_at_100%_100%,rgba(217,70,239,.16),transparent_24rem)]" />
        <div className="relative flex min-h-[72px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[.18em] text-cyan-100/75">{admin ? "Central administrativa Zenfy" : "Portal do cliente Zenfy"}</p>
            <div className="mt-1 flex items-center gap-2">
              <h2 className="truncate text-base font-black sm:text-lg">{admin ? "Gestão, clientes e resultados" : "Campanhas, projetos e atendimento"}</h2>
              <span className="hidden rounded-full border border-white/10 bg-white/10 px-2 py-1 text-[10px] font-black uppercase tracking-[.1em] text-blue-50/80 md:inline-flex">{admin ? "Admin" : "Cliente"}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-black">{firstName}</p>
              <p className="text-[10px] text-blue-50/55">{admin ? "Equipe Zenfy" : "Conta conectada"}</p>
            </div>
            <NotificationBell />
          </div>
        </div>
      </div>
    </header>
  );
}
