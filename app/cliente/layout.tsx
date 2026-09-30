import Sidebar from "@/components/Sidebar";
import { requireProfile } from "@/lib/auth";

const items: [string, string][] = [["/cliente/dashboard", "Visão Geral"], ["/cliente/projetos", "Meus Projetos"], ["/cliente/mensagens", "Mensagens"], ["/cliente/arquivos", "Arquivos"], ["/cliente/solicitacoes", "Solicitações"], ["/cliente/perfil", "Meu Perfil"]];

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  await requireProfile(["client"]);
  return <div className="flex min-h-screen flex-col md:flex-row"><Sidebar items={items} title="Zenfy" subtitle="Área do Cliente" /><div className="min-w-0 flex-1 bg-mist p-4 sm:p-6 lg:p-8">{children}</div></div>;
}
