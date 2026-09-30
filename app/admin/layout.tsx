import Sidebar from "@/components/Sidebar";
import InternalTopbar from "@/components/InternalTopbar";
import { requireProfile } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/permissions";

const items: [string, string][] = [
  ["/admin/dashboard", "Dashboard"],
  ["/admin/leads", "Leads"],
  ["/admin/empresas", "Empresas"],
  ["/admin/clientes", "Clientes"],
  ["/admin/trafego", "Gestão de tráfego"],
  ["/admin/projetos", "Projetos"],
  ["/admin/portfolio", "Portfólio & Cases"],
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
    <div className="min-h-screen bg-[#eef3fb] md:flex">
      <Sidebar items={items} title="Zenfy Admin" subtitle="Companhia A & P" userName={profile.name} />
      <div className="min-w-0 flex-1">
        <InternalTopbar mode="admin" name={profile.name} />
        <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
