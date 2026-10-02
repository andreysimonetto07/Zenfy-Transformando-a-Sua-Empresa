"use client";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente isolado usado SOMENTE na recuperação de senha.
 *
 * O portal normal usa @supabase/ssr + PKCE/cookies.
 * A recuperação usa implicit flow para que o link do e-mail não dependa
 * do code_verifier salvo no navegador onde o pedido foi iniciado.
 */
export function createRecoveryClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: "implicit",
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
        storageKey: "zenfy-password-recovery",
      },
    },
  );
}
