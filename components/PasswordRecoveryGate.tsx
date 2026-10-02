"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PasswordUpdateForm from "@/components/PasswordUpdateForm";
import { createRecoveryClient } from "@/lib/supabase/recovery";

type State="checking"|"ready"|"error";

export default function PasswordRecoveryGate(){
  const [state,setState]=useState<State>("checking");
  const [detail,setDetail]=useState("");

  useEffect(()=>{
    let mounted=true;
    const supabase=createRecoveryClient();

    async function prepare(){
      const url=new URL(window.location.href);
      const query=url.searchParams;
      const hash=new URLSearchParams(window.location.hash.replace(/^#/,""));
      const authError=query.get("error_description")||hash.get("error_description")||query.get("error")||hash.get("error");

      if(authError){
        if(mounted){
          setDetail(decodeURIComponent(authError));
          setState("error");
        }
        return;
      }

      try{
        // Um link antigo gerado pelo fluxo PKCE não consegue ser recuperado
        // sem o verifier original. Pedimos um link novo, já gerado no fluxo
        // de recuperação independente de navegador.
        if(query.get("code")){
          throw new Error("Este é um link antigo de recuperação. Solicite um novo link na Zenfy e use o e-mail mais recente.");
        }

        const accessToken=hash.get("access_token");
        const refreshToken=hash.get("refresh_token");

        if(accessToken&&refreshToken){
          const {error}=await supabase.auth.setSession({
            access_token:accessToken,
            refresh_token:refreshToken,
          });
          if(error)throw error;
        }

        const {data:{session},error}=await supabase.auth.getSession();
        if(error)throw error;
        if(!session)throw new Error("Não encontramos uma sessão válida neste link. Solicite um novo e-mail de recuperação.");

        const {error:userError}=await supabase.auth.getUser();
        if(userError)throw userError;

        if(!mounted)return;
        window.history.replaceState({},document.title,"/redefinir-senha");
        setState("ready");
      }catch(error){
        if(!mounted)return;
        setDetail(error instanceof Error?error.message:"Não foi possível validar o link.");
        setState("error");
      }
    }

    prepare();
    return()=>{mounted=false};
  },[]);

  return <main className="zenfy-light-art relative min-h-[calc(100vh-73px)] overflow-hidden">
    <div className="relative mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center justify-center px-5 py-12 sm:px-6">
      <section className="surface w-full max-w-md p-6 sm:p-8">
        {state==="checking"&&<div className="py-6 text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600"/>
          <p className="eyebrow mt-5">Conta Zenfy</p>
          <h1 className="mt-2 text-2xl font-black text-[#09113f]">Validando sua recuperação...</h1>
          <p className="mt-2 text-sm text-zinc-500">Aguarde alguns segundos.</p>
        </div>}

        {state==="ready"&&<>
          <p className="eyebrow">Conta Zenfy</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#09113f]">Crie sua nova senha</h1>
          <p className="mb-7 mt-2 text-sm leading-relaxed text-zinc-600">Seu link foi validado. Defina uma nova senha para concluir a recuperação.</p>
          <PasswordUpdateForm/>
        </>}

        {state==="error"&&<div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 font-black text-red-600">!</div>
          <p className="eyebrow mt-5">Recuperação de senha</p>
          <h1 className="mt-2 text-2xl font-black text-[#09113f]">Não conseguimos validar este link.</h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500">Solicite um novo e-mail agora e use somente o link mais recente. Os links gerados antes desta correção não vão funcionar.</p>
          {detail&&<p className="mt-4 rounded-xl bg-zinc-50 p-3 text-xs leading-relaxed text-zinc-400">{detail}</p>}
          <Link href="/recuperar-senha" className="btn btn-primary mt-5 w-full">Enviar um link novo</Link>
          <Link href="/login" className="mt-3 inline-block text-sm font-bold text-zinc-500 hover:text-brand">Voltar ao login</Link>
        </div>}
      </section>
    </div>
  </main>;
}
