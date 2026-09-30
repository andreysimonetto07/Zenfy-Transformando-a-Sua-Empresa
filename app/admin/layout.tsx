import Sidebar from "@/components/Sidebar";
import { requireProfile } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/permissions";

const items: [string, string][] = [
  ["/admin/dashboard", "Dashboard"],
  ["/admin/leads", "Leads"],
  ["/admin/empresas", "Empresas"],
  ["/admin/clientes", "Clientes"],
  ["/admin/trafego", "Gestão de tráfego"],
  ["/admin/projetos", "Projetos"],
  ["/admin/propostas", "Propostas"],
  ["/admin/tarefas", "Tarefas & Suporte"],
  ["/admin/mensagens", "Mensagens"],
  ["/admin/arquivos", "Arquivos"],
  ["/admin/prospeccao", "Prospecção"],
  ["/admin/modelos", "Modelos"],
  ["/admin/configuracoes", "Configurações"],
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireProfile(ADMIN_ROLES);
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar items={items} title="Zenfy Admin" subtitle="Companhia A & P" userName={profile.name} />
      <main className="min-w-0 flex-1 bg-mist p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
