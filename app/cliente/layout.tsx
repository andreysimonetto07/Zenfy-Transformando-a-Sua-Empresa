import Sidebar from "@/components/Sidebar";
import InternalTopbar from "@/components/InternalTopbar";
import { requireProfile } from "@/lib/auth";

const items: [string,string][] = [
  ["/cliente/dashboard","Visão Geral"],
  ["/cliente/resultados","Resultados"],
  ["/cliente/mensagens","Mensagens"],
  ["/cliente/suporte","Suporte"],
  ["/cliente/perfil","Minha Conta"],
];

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireProfile(["client"]);

  return (
    <div className="min-h-screen bg-[#f3f7fc] md:flex">
      <Sidebar items={items} title="Zenfy" subtitle="Área do Cliente" userName={profile.name} />
      <div className="min-w-0 flex-1">
        <InternalTopbar mode="client" name={profile.name} />
        <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
