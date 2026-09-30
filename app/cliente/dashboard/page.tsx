import Link from "next/link";
import { requireClientPortal, brl, numberBr, dateBr } from "@/lib/client-portal";

export default async function ClientDashboard() {
  const { supabase, profile, client, company } = await requireClientPortal();

  const clientId = client?.id || "00000000-0000-0000-0000-000000000000";
  const [
    projectsRes,
    messagesRes,
    requestsRes,
    reportsRes,
    invoicesRes,
    sitesRes,
  ] = await Promise.all([
    supabase.from("projects").select("id,name,status,progress,deadline").order("created_at",{ascending:false}).limit(3),
    supabase.from("messages").select("id",{count:"exact",head:true}).eq("receiver_id",profile.id).eq("read",false),
    supabase.from("service_requests").select("id",{count:"exact",head:true}).eq("client_id",profile.id).neq("status","concluida"),
    supabase.from("traffic_reports").select("*").eq("client_id",clientId).order("period_end",{ascending:false}).limit(1),
    supabase.from("invoices").select("*").eq("client_id",clientId).in("status",["pendente","atrasado"]).order("due_date",{ascending:true}).limit(1),
    supabase.from("client_sites").select("id",{count:"exact",head:true}).eq("client_id",clientId).eq("status","ativo"),
  ]);

  const projects = projectsRes.data ?? [];
  const report = reportsRes.data?.[0] ?? null;
  const invoice = invoicesRes.data?.[0] ?? null;
  const cpl = report && Number(report.leads) > 0 ? Number(report.spend) / Number(report.leads) : 0;

  return (
    <div className="mx-auto max-w-7xl">
      <section className="relative overflow-hidden rounded-[2rem] bg-[#06114f] p-6 text-white shadow-2xl shadow-blue-950/10 sm:p-8 lg:p-10">
        <div className="absolute inset-0 zenfy-dark-art opacity-80" />
        <div className="relative">
          <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-100">Área do Cliente</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">Olá, {profile.name}.</h1>
          <p className="mt-3 max-w-2xl text-blue-50/85">{company?.name ? `${company.name} está conectada à Zenfy.` : "Sua conta está conectada à Zenfy."} Acompanhe projetos, tráfego, mensagens e faturamento em um só lugar.</p>
          <p className="mt-5 text-lg font-black text-cyan-100">Zenfy hoje. Mais oportunidades amanhã.</p>
        </div>
      </section>

      {!client && (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Sua conta existe, mas ainda não está vinculada a um registro de cliente. A equipe Zenfy precisa concluir essa vinculação.
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Investimento em tráfego" value={report ? brl(report.spend) : "Sem relatório"} hint={report ? `${report.platform} · até ${dateBr(report.period_end)}` : "Seu gestor publica aqui"} href="/cliente/trafego" />
        <Stat label="Leads gerados" value={report ? numberBr(report.leads) : "—"} hint={report ? `CPL: ${brl(cpl)}` : "Aguardando dados"} href="/cliente/trafego" />
        <Stat label="Mensagens novas" value={String(messagesRes.count ?? 0)} hint="Fale diretamente com a equipe" href="/cliente/mensagens" />
        <Stat label="Solicitações abertas" value={String(requestsRes.count ?? 0)} hint="Suporte e alterações" href="/cliente/suporte" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
        <section className="surface p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div><p className="eyebrow">Projetos</p><h2 className="mt-1 text-2xl font-black text-[#09113f]">Em andamento</h2></div>
            <Link href="/cliente/projetos" className="text-sm font-black text-brand hover:underline">Ver todos →</Link>
          </div>

          {projects.length ? (
            <div className="mt-5 grid gap-4">
              {projects.map((project) => (
                <article key={project.id} className="rounded-2xl border border-zinc-200 bg-white p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div><h3 className="font-black text-[#09113f]">{project.name}</h3><p className="text-sm text-zinc-500">{project.status}</p></div>
                    <p className="text-sm font-bold text-brand">{project.progress ?? 0}%</p>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100"><div className="h-full rounded-full brand-gradient transition-all" style={{width:`${project.progress ?? 0}%`}} /></div>
                  {project.deadline && <p className="mt-2 text-xs text-zinc-400">Prazo previsto: {dateBr(project.deadline)}</p>}
                </article>
              ))}
            </div>
          ) : (
            <Empty text="Nenhum projeto foi iniciado ainda. Quando a equipe criar seu primeiro projeto, ele aparece aqui." />
          )}
        </section>

        <div className="grid gap-6">
          <section className="surface p-5 sm:p-6">
            <p className="eyebrow">Estrutura ativa</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Mini label="Sites ativos" value={String(sitesRes.count ?? 0)} />
              <Mini label="Plano" value={client?.plan || "—"} />
            </div>
            <Link href="/cliente/sites" className="btn btn-ghost mt-4 w-full">Ver sites</Link>
          </section>

          <section className="surface p-5 sm:p-6">
            <p className="eyebrow">Financeiro</p>
            {invoice ? (
              <div className="mt-3">
                <p className="text-2xl font-black text-[#09113f]">{brl(invoice.amount)}</p>
                <p className="mt-1 text-sm text-zinc-500">{invoice.description}</p>
                <p className="mt-1 text-xs text-zinc-400">Vencimento: {dateBr(invoice.due_date)}</p>
              </div>
            ) : <p className="mt-3 text-sm text-zinc-500">Nenhuma cobrança pendente.</p>}
            <Link href="/cliente/faturamento" className="btn btn-ghost mt-4 w-full">Abrir faturamento</Link>
          </section>
        </div>
      </div>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <Quick href="/cliente/mensagens" title="Falar com a Zenfy" text="Envie uma mensagem direto para a equipe." />
        <Quick href="/cliente/suporte" title="Abrir suporte" text="Solicite alteração, ajuda ou atendimento." />
        <Quick href="/cliente/trafego" title="Ver tráfego pago" text="Acompanhe investimento, leads e desempenho." />
      </section>
    </div>
  );
}

function Stat({label,value,hint,href}:{label:string;value:string;hint:string;href:string}) {
  return <Link href={href} className="surface group p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl"><p className="text-xs font-black uppercase tracking-[.12em] text-zinc-400">{label}</p><p className="mt-2 text-2xl font-black tracking-tight text-[#09113f]">{value}</p><p className="mt-2 text-xs text-zinc-500">{hint}</p><span className="mt-3 inline-block text-sm font-black text-brand transition-transform group-hover:translate-x-1">Abrir →</span></Link>;
}
function Mini({label,value}:{label:string;value:string}) { return <div className="rounded-2xl bg-blue-50/70 p-4"><p className="text-xs font-bold text-zinc-500">{label}</p><p className="mt-1 text-lg font-black text-[#09113f]">{value}</p></div>; }
function Quick({href,title,text}:{href:string;title:string;text:string}) { return <Link href={href} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"><p className="font-black text-[#09113f]">{title}</p><p className="mt-1 text-sm text-zinc-500">{text}</p></Link>; }
function Empty({text}:{text:string}) { return <div className="mt-5 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-7 text-center text-sm text-zinc-500">{text}</div>; }
