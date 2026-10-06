import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

const allowedOtpTypes = new Set<EmailOtpType>(["signup","invite","magiclink","recovery","email_change","email"]);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const typeParam = url.searchParams.get("type");
  const requestedNext = url.searchParams.get("next");
  const errorCode = url.searchParams.get("error_code");
  const errorDescription = url.searchParams.get("error_description");

  if (errorCode || errorDescription) {
    return NextResponse.redirect(new URL("/login?erro=link", url.origin));
  }

  const recovery = typeParam === "recovery";
  if(recovery && tokenHash){
    const recoveryUrl = new URL("/redefinir-senha",url.origin);
    recoveryUrl.searchParams.set("token_hash",tokenHash);
    recoveryUrl.searchParams.set("type","recovery");
    return NextResponse.redirect(recoveryUrl);
  }
  const fallbackNext = recovery ? "/redefinir-senha?recovery=1" : "/cliente/dashboard";
  const next = requestedNext && requestedNext.startsWith("/") && !requestedNext.startsWith("//") && !requestedNext.includes("\\")
    ? requestedNext
    : fallbackNext;

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
  }

  if (tokenHash && typeParam && allowedOtpTypes.has(typeParam as EmailOtpType)) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: typeParam as EmailOtpType,
    });
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
  }

  return NextResponse.redirect(new URL("/login?erro=link", url.origin));
}
