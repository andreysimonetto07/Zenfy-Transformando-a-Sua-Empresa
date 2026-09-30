import ClientProfileForm from "@/components/ClientProfileForm";
import { requireClientPortal } from "@/lib/client-portal";

export default async function PerfilPage() {
  const { profile, company, client }=await requireClientPortal();

  return <div className="mx-auto max-w-5xl">
    <div className="mb-7"><p className="eyebrow">Minha conta</p><h1 className="mt-2 text-3xl font-black text-[#09113f]">Dados da conta e empresa</h1><p className="mt-2 text-zinc-600">Mantenha as informações usadas pela equipe Zenfy atualizadas.</p></div>
    <div className="mb-5 grid gap-4 sm:grid-cols-3"><Card label="E-mail de acesso" value={profile.email || "—"}/><Card label="Plano" value={client?.plan || "Não definido"}/><Card label="Status" value={client?.status || "—"}/></div>
    <ClientProfileForm initial={{
      name:profile.name,
      phone:profile.phone,
      company_name:company?.name || "Minha empresa",
      whatsapp:company?.whatsapp,
      website:company?.website,
      instagram:company?.instagram,
      city:company?.city,
      state:company?.state,
    }}/>
    <p className="mt-4 text-xs text-zinc-400">Para alterar o e-mail de acesso, fale com o suporte da Zenfy.</p>
  </div>;
}
function Card({label,value}:{label:string;value:string}){return <div className="surface p-5"><p className="text-xs font-black uppercase tracking-[.12em] text-zinc-400">{label}</p><p className="mt-2 truncate font-black text-[#09113f]">{value}</p></div>}
