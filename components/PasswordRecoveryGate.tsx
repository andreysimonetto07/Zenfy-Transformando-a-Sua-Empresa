"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PasswordUpdateForm from "@/components/PasswordUpdateForm";
import { createRecoveryClient } from "@/lib/supabase/recovery";
import { SUPPORT_EMAIL_HREF } from "@/lib/contact";

type State="checking"|"confirm"|"ready"|"error";

export default function PasswordRecoveryGate(){
  const [state,setState]=useState<State>("checking");
  const [detail,setDetail]=useState("Seu link pode ter expirado ou já ter sido utilizado. Solicite um novo e-mail e use somente o link mais recente.");

  async function confirmRecovery(){
    if(state!=="confirm")return;
    setState("checking");
    try{
      const url=new URL(window.location.href);
      const tokenHash=url.searchParams.get("token_hash");
      if(!tokenHash||url.searchParams.get("type")!=="recovery")throw new Error("Invalid recovery link");
      const {data,error}=await createRecoveryClient().auth.verifyOtp({token_hash:tokenHash,type:"recovery"});
      if(error||!data.session)throw new Error("Invalid recovery link");
      window.history.replaceState({},document.title,"/redefinir-senha");
      setState("ready");
    }catch{
      setState("error");
    }
  }

  useEffect(()=>{
    let mounted=true;
    const supabase=createRecoveryClient();

    async function prepare(){
      const url=new URL(window.location.href);
      const query=url.searchParams;
      const hash=new URLSearchParams(window.location.hash.replace(/^#/,""));
      const authError=query.get("error_description")||hash.get("error_description")||query.get("error")||hash.get("error");

      if(authError){
        if(mounted)setState("error");
        return;
      }

      try{
        // Validate single-use tokens only after a click, so link scanners and
        // browser prefetch do not consume the password-recovery link.
        if(query.get("token_hash")){
          if(query.get("type")!=="recovery")throw new Error("Invalid recovery link");
          if(mounted)setState("confirm");
          return;
        }

        if(query.get("code")){
          if(mounted)setDetail("Peça um novo link de recuperação e abra o e-mail mais recente para continuar.");
          throw new Error("Unsupported legacy recovery link");
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
        if(!session)throw new Error("Missing recovery session");

        const {error:userError}=await supabase.auth.getUser();
        if(userError)throw userError;

        if(!mounted)return;
        window.history.replaceState({},document.title,"/redefinir-senha");
        setState("ready");
      }catch{
        if(!mounted)return;
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
          <p role="status" className="mt-2 text-sm text-zinc-500">Aguarde alguns segundos.</p>
        </div>}

        {state==="confirm"&&<>
          <p className="eyebrow">Conta Zenfy</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#09113f]">Redefinir sua senha</h1>
          <p className="mb-6 mt-3 text-sm leading-relaxed text-zinc-600">Confirme abaixo para validar o link do e-mail. Depois, você poderá criar uma nova senha para sua conta.</p>
          <button type="button" onClick={confirmRecovery} className="btn btn-primary w-full">Continuar com a recuperação</button>
          <p className="mt-4 text-xs leading-relaxed text-zinc-500">Se não foi você quem pediu a recuperação, pode fechar esta página. Sua senha permanece a mesma.</p>
        </>}

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
          <p role="alert" className="mt-3 text-sm leading-relaxed text-zinc-500">{detail}</p>
          <Link href="/recuperar-senha" className="btn btn-primary mt-5 w-full">Enviar um link novo</Link>
          <Link href="/login" className="mt-3 inline-block text-sm font-bold text-zinc-500 hover:text-brand">Voltar ao login</Link>
          <p className="mt-4 text-xs text-zinc-500">Precisa de ajuda? <a href={SUPPORT_EMAIL_HREF} className="font-semibold text-brand hover:underline">Fale com o suporte</a>.</p>
        </div>}
      </section>
    </div>
  </main>;
}
