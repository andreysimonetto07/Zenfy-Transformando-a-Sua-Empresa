import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import LoginForm from "@/components/LoginForm";
import { redirect } from "next/navigation";
import { getCurrentAccount } from "@/lib/account";

export const metadata = { title: "Entrar | Zenfy", robots: { index: false } };

export default async function Login({ searchParams }: { searchParams: Promise<Record<string,string|string[]|undefined>> }) {
  const account = await getCurrentAccount();
  if (account) redirect(account.dashboardHref);

  const params=await searchParams;
  return <main className="zenfy-light-art relative min-h-[calc(100vh-73px)] overflow-hidden">
    <div className="relative grid min-h-[calc(100vh-73px)] lg:grid-cols-2">
      <section className="zenfy-dark-art relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-10">
        <BrandLogo light />
        <div className="relative z-10">
          <div className="mb-8 max-w-[230px] rounded-3xl border border-white/15 bg-white p-3 shadow-xl"><BrandLogo href="" /></div>
          <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-100">Zenfy · Companhia A &amp; P</p>
          <h2 className="mt-3 max-w-xl text-4xl font-black tracking-[-0.045em] text-white">Seu projeto, organizado em um só lugar.</h2>
          <p className="mt-4 max-w-lg text-blue-50/85">Clientes e equipe usam a mesma entrada. O sistema reconhece o tipo de conta e abre o painel correto.</p>
        </div>
      </section>
      <section className="flex items-center justify-center px-5 py-12 sm:px-6 sm:py-16"><div className="surface w-full max-w-md p-6 sm:p-8">
        <div className="mb-7 flex justify-center lg:hidden"><BrandLogo href="" /></div>
        <p className="eyebrow">Acesso Zenfy</p><h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#09113f]">Entrar na sua conta</h1><p className="mb-6 mt-2 text-sm leading-relaxed text-zinc-600">Use o e-mail e a senha cadastrados. Administradores são encaminhados ao painel interno; clientes, à área da empresa.</p>
        {params.senha==="alterada" && <p className="mb-4 rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-900">Senha alterada. Agora você já pode entrar.</p>}
        {params.erro==="link" && <p className="mb-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700">Esse link expirou ou já foi utilizado.</p>}
        <LoginForm/>
        <div className="mt-7 border-t border-zinc-200 pt-6 text-center text-sm text-zinc-500">Ainda não tem conta? <Link href="/cadastro" className="font-black text-brand hover:underline">Criar conta da empresa</Link></div>
      </div></section>
    </div>
  </main>;
}
