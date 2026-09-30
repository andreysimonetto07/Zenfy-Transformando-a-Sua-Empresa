import Sidebar from "@/components/Sidebar";
import { requireProfile } from "@/lib/auth";

const items: [string,string][] = [
  ["/cliente/dashboard","Visão Geral"],
  ["/cliente/trafego","Tráfego"],
  ["/cliente/sites","Sites"],
  ["/cliente/projetos","Projetos"],
  ["/cliente/mensagens","Mensagens"],
  ["/cliente/suporte","Suporte"],
  ["/cliente/arquivos","Arquivos"],
  ["/cliente/faturamento","Faturamento"],
  ["/cliente/perfil","Minha Conta"],
];

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireProfile(["client"]);
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar items={items} title="Zenfy" subtitle="Área do Cliente" userName={profile.name} />
      <div className="min-w-0 flex-1 bg-[#f6f8fc] p-4 sm:p-6 lg:p-8">{children}</div>
    </div>
  );
}
