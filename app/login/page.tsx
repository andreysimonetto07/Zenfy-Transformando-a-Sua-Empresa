import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export const metadata = { title: "Entrar | Zenfy", robots: { index: false } };

export default async function Login({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const passwordChanged = params.senha === "alterada";
  const linkError = params.erro === "link";

  return (
    <main className="grid min-h-[calc(100vh-73px)] lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-[#06114f] lg:block">
        <Image src="/brand/zenfy/bg-dark.webp" alt="" fill priority sizes="50vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#03072a]/85 via-[#06114f]/20 to-transparent" />
        <div className="absolute left-10 top-10 w-40 rounded-2xl border border-white/20 bg-white/95 p-3 shadow-2xl">
          <Image src="/brand/zenfy/logo-primary.webp" alt="Zenfy" width={1254} height={1254} className="h-auto w-full" />
        </div>
        <div className="absolute inset-x-10 bottom-10 rounded-3xl border border-white/20 bg-[#06114f]/45 p-7 text-white shadow-2xl backdrop-blur-md">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-100">Zenfy</p>
          <h2 className="mt-3 text-3xl font-bold">Seu projeto, organizado em um só lugar.</h2>
          <p className="mt-3 text-blue-50/85">Acompanhe projetos, mensagens e arquivos da sua empresa com a equipe Zenfy.</p>
        </div>
      </section>
      <section className="flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center lg:hidden"><div className="w-36 rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm"><Image src="/brand/zenfy/logo-primary.webp" alt="Zenfy" width={1254} height={1254} className="h-auto w-full" /></div></div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Área do Cliente e Equipe</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Entrar na Zenfy</h1>
          <p className="mb-6 mt-2 text-sm text-zinc-600">Clientes, Andrey e Pedro usam a mesma tela. O sistema direciona cada conta para o painel correto.</p>
          {passwordChanged && <p className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">Senha alterada com sucesso. Entre novamente.</p>}
          {linkError && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">Este link não é mais válido. Solicite um novo link de recuperação.</p>}
          <LoginForm />
          <div className="mt-8 border-t border-zinc-200 pt-6 text-center text-sm text-zinc-500">
            Sua empresa ainda não tem acesso? <Link href="/cadastro" className="font-semibold text-brand hover:underline">Criar conta</Link>
          </div>
          <p className="mt-5 text-center text-xs text-zinc-400">Zenfy · Uma empresa da Companhia A &amp; P</p>
        </div>
      </section>
    </main>
  );
}
