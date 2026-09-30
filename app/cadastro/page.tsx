import Image from "next/image";
import RegisterForm from "@/components/RegisterForm";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Criar conta", "Crie a conta da sua empresa na Zenfy.", "/cadastro");

export default function Cadastro() {
  return (
    <main className="relative min-h-[calc(100vh-73px)] overflow-hidden bg-[#f7fbff]">
      <Image src="/brand/zenfy/bg-light.webp" alt="" fill priority sizes="100vw" className="object-cover opacity-85" />
      <div className="absolute inset-0 bg-white/40" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:py-20">
        <div className="hidden lg:block">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Área do Cliente</p>
          <h1 className="mt-3 text-5xl font-extrabold tracking-[-0.045em] text-[#09113f]">Sua empresa dentro da Zenfy.</h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-zinc-600">Crie sua conta para acompanhar projetos, arquivos, mensagens e solicitações em um único lugar.</p>
          <div className="mt-8 w-52 rounded-3xl border border-white bg-white/90 p-3 shadow-xl">
            <Image src="/brand/zenfy/logo-growth.webp" alt="Zenfy" width={1254} height={1254} className="h-auto w-full rounded-2xl" />
          </div>
        </div>
        <section className="rounded-[2rem] border border-white/90 bg-white/90 p-6 shadow-2xl shadow-blue-950/10 backdrop-blur-lg sm:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Cadastro</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">Criar conta da empresa</h2>
          <p className="mb-7 mt-2 text-sm text-zinc-600">O cadastro público sempre cria uma conta de cliente. Contas administrativas são liberadas apenas pela equipe da Companhia A &amp; P.</p>
          <RegisterForm />
        </section>
      </div>
    </main>
  );
}
