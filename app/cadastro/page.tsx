import Image from "next/image";
import RegisterForm from "@/components/RegisterForm";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Criar conta", "Crie a conta da sua empresa na Zenfy.", "/cadastro");

export default function Cadastro() {
  return <main className="relative min-h-[calc(100vh-73px)] overflow-hidden bg-[#eef8ff]"><div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage:"url('/brand/zenfy/Zenfy-BackGround2.webp')"}}/><div className="absolute inset-0 bg-white/38"/><div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-6 sm:py-16 lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:py-20">
    <div className="hidden lg:block"><p className="eyebrow">Área do cliente</p><h1 className="mt-3 text-5xl font-black tracking-[-0.05em] text-[#09113f]">Sua empresa dentro da Zenfy.</h1><p className="mt-5 max-w-lg text-lg leading-relaxed text-zinc-600">Crie seu acesso para acompanhar projetos, arquivos, mensagens e solicitações.</p><div className="mt-8 flex gap-4"><div className="w-44 rounded-3xl border border-white bg-white/95 p-2 shadow-xl"><Image src="/brand/zenfy/Zenfy-logo1.webp" alt="Zenfy" width={1254} height={1254} className="h-auto w-full rounded-2xl"/></div><div className="mt-12 w-44 rounded-3xl border border-white bg-white/95 p-2 shadow-xl"><Image src="/brand/zenfy/Zenfy-logo2.webp" alt="Zenfy" width={1254} height={1254} className="h-auto w-full rounded-2xl"/></div></div></div>
    <section className="surface p-6 sm:p-9"><p className="eyebrow">Cadastro</p><h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#09113f]">Criar conta da empresa</h2><p className="mb-7 mt-2 text-sm leading-relaxed text-zinc-600">O cadastro público cria somente contas de cliente. Acessos administrativos são liberados internamente pela Companhia A &amp; P.</p><RegisterForm/></section>
  </div></main>;
}
