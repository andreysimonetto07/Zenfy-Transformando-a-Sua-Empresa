import { redirect } from "next/navigation";
import PasswordUpdateForm from "@/components/PasswordUpdateForm";
import { createClient } from "@/lib/supabase/server";

export const metadata={title:"Nova senha | Zenfy",robots:{index:false}};

export default async function RedefinirSenha(){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();

  if(!user) redirect("/recuperar-senha?erro=sessao");

  return <main className="zenfy-light-art relative min-h-[calc(100vh-73px)] overflow-hidden">
    <div className="relative mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center justify-center px-5 py-12 sm:px-6">
      <section className="surface w-full max-w-md p-6 sm:p-8">
        <p className="eyebrow">Conta Zenfy</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#09113f]">Defina uma nova senha</h1>
        <p className="mb-7 mt-2 text-sm leading-relaxed text-zinc-600">O link foi validado. Agora crie sua nova senha e salve para voltar ao login.</p>
        <PasswordUpdateForm/>
      </section>
    </div>
  </main>;
}
