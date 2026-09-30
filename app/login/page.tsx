import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export const metadata = { title: "Entrar | Zenfy", robots: { index: false } };

export default async function Login({ searchParams }: { searchParams: Promise<Record<string,string|string[]|undefined>> }) {
  const params=await searchParams;
  return <main className="relative min-h-[calc(100vh-73px)] overflow-hidden bg-[#f6fbff]">
    <div className="absolute inset-0 bg-cover bg-center lg:hidden" style={{backgroundImage:"url('/brand/zenfy/Zenfy-BackGround2.webp')"}}/><div className="absolute inset-0 bg-white/60 lg:hidden"/>
    <div className="relative grid min-h-[calc(100vh-73px)] lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-[#06114f] lg:block"><div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage:"url('/brand/zenfy/Zenfy-BackGround1.webp')"}}/><div className="absolute inset-0 bg-gradient-to-t from-[#020624]/90 via-[#06114f]/25 to-[#06114f]/10"/><div className="absolute left-10 top-10 w-40 rounded-3xl border border-white/20 bg-white/95 p-3 shadow-2xl"><Image src="/brand/zenfy/Zenfy-logo1.webp" alt="Zenfy" width={1254} height={1254} className="h-auto w-full rounded-2xl"/></div><div className="absolute inset-x-10 bottom-10 rounded-3xl border border-white/20 bg-[#06114f]/45 p-8 text-white shadow-2xl backdrop-blur-xl"><p className="text-xs font-black uppercase tracking-[.18em] text-cyan-100">Zenfy · Companhia A &amp; P</p><h2 className="mt-3 text-3xl font-black tracking-tight">Seu projeto, organizado em um só lugar.</h2><p className="mt-3 max-w-lg text-blue-50/85">Clientes e equipe usam a mesma entrada. O sistema reconhece o tipo de conta e abre o painel correto.</p></div></section>
      <section className="flex items-center justify-center px-5 py-12 sm:px-6 sm:py-16"><div className="surface w-full max-w-md p-6 sm:p-8">
        <div className="mb-7 flex justify-center lg:hidden"><div className="w-32 rounded-3xl border border-white bg-white p-2 shadow-xl"><Image src="/brand/zenfy/Zenfy-logo1.webp" alt="Zenfy" width={1254} height={1254} className="h-auto w-full rounded-2xl"/></div></div>
        <p className="eyebrow">Acesso Zenfy</p><h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#09113f]">Entrar na sua conta</h1><p className="mb-6 mt-2 text-sm leading-relaxed text-zinc-600">Use o e-mail e a senha cadastrados. Administradores são encaminhados ao painel interno; clientes, à área da empresa.</p>
        {params.senha==="alterada" && <p className="mb-4 rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-900">Senha alterada. Agora você já pode entrar.</p>}
        {params.erro==="link" && <p className="mb-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700">Esse link expirou ou já foi utilizado.</p>}
        <LoginForm/>
        <div className="mt-7 border-t border-zinc-200 pt-6 text-center text-sm text-zinc-500">Ainda não tem conta? <Link href="/cadastro" className="font-black text-brand hover:underline">Criar conta da empresa</Link></div>
      </div></section>
    </div>
  </main>;
}
