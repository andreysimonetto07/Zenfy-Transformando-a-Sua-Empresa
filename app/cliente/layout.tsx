import Sidebar from "@/components/Sidebar";
import InternalTopbar from "@/components/InternalTopbar";
import { requireClientPortal } from "@/lib/client-portal";

const items: [string,string][] = [
  ["/cliente/dashboard","Visão Geral"],
  ["/cliente/resultados","Resultados"],
  ["/cliente/inspiracoes","Sites & Inspirações"],
  ["/cliente/projetos","Projetos"],
  ["/cliente/faturamento","Faturamento"],
  ["/cliente/perfil","Minha Conta"],
];

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireClientPortal();

  return (
    <div className="min-h-screen bg-[#f3f7fc] md:flex">
      <Sidebar items={items} title="Zenfy" subtitle="Área do Cliente" userName={profile.name} />
      <div className="min-w-0 flex-1">
        <InternalTopbar mode="client" name={profile.name} />
        <main className="min-w-0 p-4 pb-28 sm:p-6 sm:pb-28 lg:p-8 lg:pb-28">{children}</main>
      </div>
    </div>
  );
}
