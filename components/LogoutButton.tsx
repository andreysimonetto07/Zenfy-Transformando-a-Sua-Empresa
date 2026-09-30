"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const [pending,setPending]=useState(false);

  async function logout(){
    if(pending)return;
    setPending(true);
    try{
      const supabase=createClient();
      await Promise.race([
        supabase.auth.signOut(),
        new Promise((_,reject)=>setTimeout(()=>reject(new Error("timeout")),5000)),
      ]);
    }catch{
      // Mesmo se o servidor demorar, forçamos uma nova navegação para não deixar
      // a interface presa em "Saindo...".
    }finally{
      window.location.assign("/");
    }
  }

  return <button type="button" onClick={logout} disabled={pending} className="mt-4 w-full rounded-xl border border-white/10 px-3 py-2.5 text-left text-sm font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white disabled:opacity-60 md:mt-auto">{pending?"Saindo...":"Sair da conta"}</button>;
}
