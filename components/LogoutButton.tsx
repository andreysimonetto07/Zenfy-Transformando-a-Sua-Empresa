"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    await createClient().auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={pending}
      className="mt-3 w-full rounded-lg border border-white/10 px-3 py-2 text-left text-sm text-zinc-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-60 md:mt-auto"
    >
      {pending ? "Saindo..." : "Sair da conta"}
    </button>
  );
}
