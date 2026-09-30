import BrandShowcase from "@/components/BrandShowcase";
import RegisterForm from "@/components/RegisterForm";
import { pageMeta } from "@/lib/seo";
import { redirect } from "next/navigation";
import { getCurrentAccount } from "@/lib/account";

export const metadata = pageMeta("Criar conta", "Crie a conta da sua empresa na Zenfy.", "/cadastro");

export default async function Cadastro() {
  const account = await getCurrentAccount();
  if (account) redirect(account.dashboardHref);
  return (
    <main className="zenfy-light-art relative min-h-[calc(100vh-73px)] overflow-hidden">
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-6 sm:py-16 lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:py-20">
        <div className="hidden lg:block">
          <p className="eyebrow">Área do cliente</p>
          <h1 className="mt-3 text-5xl font-black tracking-[-0.05em] text-[#09113f]">Sua empresa dentro da Zenfy.</h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-zinc-600">Crie seu acesso para acompanhar projetos, arquivos, mensagens e solicitações.</p>
          <div className="mt-10"><BrandShowcase variant="primary" compact /></div>
        </div>

        <section className="surface p-6 sm:p-9">
          <p className="eyebrow">Cadastro</p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#09113f]">Criar conta da empresa</h2>
          <p className="mb-7 mt-2 text-sm leading-relaxed text-zinc-600">O cadastro público cria somente contas de cliente. Acessos administrativos são liberados internamente pela Companhia A &amp; P.</p>
          <RegisterForm />
        </section>
      </div>
    </main>
  );
}
