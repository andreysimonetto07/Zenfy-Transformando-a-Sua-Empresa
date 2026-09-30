import PasswordUpdateForm from "@/components/PasswordUpdateForm";

export const metadata = { title: "Nova senha | Zenfy", robots: { index: false } };

export default function RedefinirSenha() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-6xl items-center justify-center px-5 py-16">
      <section className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-7 shadow-xl shadow-blue-950/5">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Conta Zenfy</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Defina sua nova senha</h1>
        <p className="mb-7 mt-2 text-sm leading-relaxed text-zinc-600">Use pelo menos 8 caracteres. Depois de salvar, você volta ao login para entrar normalmente.</p>
        <PasswordUpdateForm />
      </section>
    </main>
  );
}
