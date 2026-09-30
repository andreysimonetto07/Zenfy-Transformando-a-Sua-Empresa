import StatCard from "@/components/StatCard";
import { requireProfile } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/permissions";

export default async function AdminDashboard() {
  const { supabase } = await requireProfile(ADMIN_ROLES);
  const countStatus = async (status?: string) => {
    let q = supabase.from("leads").select("*", { count: "exact", head: true });
    if (status) q = q.eq("status", status);
    const { count, error } = await q;
    if (error) throw new Error(error.message);
    return count ?? 0;
  };
  const countOverdue = async () => {
    const { count, error } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .lt("next_contact", new Date().toISOString())
      .not("status", "in", "(client,not_interested)");
    if (error) throw new Error(error.message);
    return count ?? 0;
  };

  const [total, news, interested, meetings, proposals, clients, overdue] = await Promise.all([
    countStatus(), countStatus("new"), countStatus("interested"), countStatus("meeting_scheduled"),
    countStatus("proposal_sent"), countStatus("client"), countOverdue(),
  ]);

  return <>
    <div className="mb-6"><h1 className="text-2xl font-bold">Dashboard</h1><p className="mt-1 text-sm text-zinc-600">Visão geral comercial da Zenfy.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Leads totais" value={total} />
      <StatCard label="Novos leads" value={news} />
      <StatCard label="Interessados" value={interested} />
      <StatCard label="Reuniões marcadas" value={meetings} />
      <StatCard label="Propostas enviadas" value={proposals} />
      <StatCard label="Clientes" value={clients} />
      <StatCard label="Contatos atrasados" value={overdue} />
    </div>
  </>;
}
