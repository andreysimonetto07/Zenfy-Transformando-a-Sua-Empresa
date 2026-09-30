import Image from "next/image";
import LoginForm from "@/components/LoginForm";

export const metadata = { title: "Entrar | Zenfy", robots: { index: false } };

export default function Login() {
  return (
    <main className="grid min-h-[calc(100vh-73px)] lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-[#06114f] lg:block">
        <Image src="/brand/zenfy/bg-dark.webp" alt="" fill priority sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-[#06114f]/35" />
        <div className="absolute inset-x-10 bottom-10 rounded-3xl border border-white/15 bg-white/10 p-7 text-white backdrop-blur-md">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-200">Zenfy</p>
          <h2 className="mt-3 text-3xl font-bold">Seu projeto, organizado em um só lugar.</h2>
          <p className="mt-3 text-blue-50/75">Acompanhe projetos, mensagens e arquivos da sua empresa com a equipe Zenfy.</p>
        </div>
      </section>
      <section className="flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-sm">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Área do Cliente</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Entrar na Zenfy</h1>
          <p className="mb-8 mt-2 text-sm text-zinc-600">Acesse com o e-mail cadastrado pela equipe Zenfy.</p>
          <LoginForm />
          <p className="mt-8 text-center text-xs text-zinc-400">Zenfy · Uma empresa da Companhia A &amp; P</p>
        </div>
      </section>
    </main>
  );
}
