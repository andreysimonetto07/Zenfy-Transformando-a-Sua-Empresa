"use client";

import { useEffect } from "react";

export default function RecoveryBridge(){
  useEffect(()=>{
    const suffix=window.location.search+window.location.hash;
    window.location.replace("/redefinir-senha"+suffix);
  },[]);

  return <main className="zenfy-light-art flex min-h-[calc(100vh-73px)] items-center justify-center px-5">
    <div className="surface p-8 text-center">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600"/>
      <p className="mt-4 text-sm font-bold text-zinc-500">Abrindo recuperação segura...</p>
    </div>
  </main>;
}
