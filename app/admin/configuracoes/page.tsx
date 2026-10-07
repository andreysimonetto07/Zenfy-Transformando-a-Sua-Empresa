import TeamMemberForm from "@/components/TeamMemberForm";
import NotificationPreferences from "@/components/NotificationPreferences";
import ThemeSettings from "@/components/ThemeSettings";
import { requireProfile } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/permissions";

type TeamProfile = { id: string; name: string; email?: string | null; role: string; created_at?: string | null };

export default async function ConfiguracoesPage() {
  const { supabase, profile } = await requireProfile(ADMIN_ROLES);
  const { data } = await supabase
    .from("profiles")
    .select("id,name,email,role,created_at")
    .in("role", ["admin", "super_admin"])
    .order("created_at", { ascending: true });

  const team = (data ?? []) as TeamProfile[];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-7">
        <p className="eyebrow">Zenfy Admin</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#09113f]">Configurações e equipe</h1>
        <p className="mt-2 text-zinc-600">Gerencie quem pode acessar o painel administrativo da Zenfy.</p>
      </div>

      <section className="surface p-6">
        <h2 className="text-xl font-black text-[#09113f]">Equipe administrativa</h2>
        <div className="mt-5 overflow-hidden rounded-xl border border-zinc-200">
          {team.map((member) => (
            <div key={member.id} className="flex flex-col gap-1 border-b border-zinc-200 p-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="font-semibold">{member.name}</p><p className="text-sm text-zinc-500">{member.email || "Sem e-mail"}</p></div>
              <span className="mt-2 inline-flex w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-brand sm:mt-0">{member.role === "super_admin" ? "Super administrador" : "Administrador"}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="surface mt-6 p-6">
        <h2 className="text-xl font-bold">Adicionar integrante</h2>
        {profile.role === "super_admin" ? (
          <>
            <p className="mb-5 mt-2 text-sm leading-relaxed text-zinc-600">Crie o acesso do Pedro Henrique ou de outro integrante. Use uma senha temporária e envie a senha para a pessoa por um canal privado.</p>
            <TeamMemberForm />
          </>
        ) : (
          <p className="mt-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">Somente um super administrador pode criar novos acessos administrativos.</p>
        )}
      </section>

      <div className="mt-6">
        <ThemeSettings />
      </div>

      <div className="mt-6">
        <NotificationPreferences showLeads />
      </div>

      <section className="mt-6 rounded-[1.5rem] border border-blue-100 bg-gradient-to-br from-blue-50/80 to-violet-50/50 p-6">
        <h2 className="font-bold text-[#09113f]">Contas de clientes</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">Empresas não são cadastradas aqui. Elas usam o cadastro público da Zenfy e recebem automaticamente o nível <strong>Cliente</strong>.</p>
      </section>
    </div>
  );
}
