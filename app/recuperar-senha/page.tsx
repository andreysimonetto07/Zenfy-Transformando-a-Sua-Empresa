import PasswordResetRequestForm from "@/components/PasswordResetRequestForm";

export const metadata = { title: "Recuperar senha | Zenfy", robots: { index: false } };

export default function RecuperarSenha() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-6xl items-center justify-center px-5 py-16">
      <section className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-7 shadow-xl shadow-blue-950/5">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Zenfy</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Recuperar senha</h1>
        <p className="mb-7 mt-2 text-sm leading-relaxed text-zinc-600">Informe o e-mail da sua conta. Se ele estiver cadastrado, você receberá um link seguro para criar uma nova senha.</p>
        <PasswordResetRequestForm />
      </section>
    </main>
  );
}
