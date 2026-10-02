"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type State = "loading" | "error";

export default function RecoveryBridge(){
  const [state,setState]=useState<State>("loading");
  const [detail,setDetail]=useState("");

  useEffect(()=>{
    let active=true;

    async function recover(){
      const supabase=createClient();
      const url=new URL(window.location.href);
      const query=url.searchParams;
      const hash=new URLSearchParams(window.location.hash.replace(/^#/,""));

      const queryError=query.get("error_description")||query.get("error");
      const hashError=hash.get("error_description")||hash.get("error");
      if(queryError||hashError){
        if(active){
          setDetail(decodeURIComponent(queryError||hashError||""));
          setState("error");
        }
        return;
      }

      try{
        const code=query.get("code");
        const tokenHash=query.get("token_hash");
        const type=query.get("type");
        const accessToken=hash.get("access_token");
        const refreshToken=hash.get("refresh_token");

        let error:Error|null=null;

        if(code){
          const result=await supabase.auth.exchangeCodeForSession(code);
          error=result.error;
        }else if(tokenHash&&type==="recovery"){
          const result=await supabase.auth.verifyOtp({token_hash:tokenHash,type:"recovery"});
          error=result.error;
        }else if(accessToken&&refreshToken){
          const result=await supabase.auth.setSession({access_token:accessToken,refresh_token:refreshToken});
          error=result.error;
        }else{
          const session=await supabase.auth.getSession();
          if(!session.data.session) error=new Error("Nenhuma sessão de recuperação foi encontrada.");
        }

        if(error)throw error;
        if(!active)return;

        window.history.replaceState({},document.title,"/auth/recovery");
        window.location.replace("/redefinir-senha?recovery=1");
      }catch(error){
        if(!active)return;
        setDetail(error instanceof Error?error.message:"Não foi possível validar o link.");
        setState("error");
      }
    }

    recover();
    return()=>{active=false};
  },[]);

  return <main className="zenfy-light-art relative min-h-[calc(100vh-73px)] overflow-hidden">
    <div className="relative mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center justify-center px-5 py-12 sm:px-6">
      <section className="surface w-full max-w-md p-6 text-center sm:p-8">
        {state==="loading"?<>
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600"/>
          <p className="eyebrow mt-5">Conta Zenfy</p>
          <h1 className="mt-2 text-2xl font-black text-[#09113f]">Validando seu link...</h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">Isso leva só alguns segundos. Não feche esta página.</p>
        </>:<>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-xl text-red-600">!</div>
          <p className="eyebrow mt-5">Não foi possível validar</p>
          <h1 className="mt-2 text-2xl font-black text-[#09113f]">Esse link não está mais válido.</h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500">Peça um novo link de recuperação e use somente o e-mail mais recente. Links antigos deixam de funcionar quando um novo é solicitado.</p>
          {detail&&<p className="mt-3 rounded-xl bg-zinc-50 p-3 text-xs text-zinc-400">{detail}</p>}
          <Link href="/recuperar-senha" className="btn btn-primary mt-5 w-full">Solicitar novo link</Link>
        </>}
      </section>
    </div>
  </main>;
}
