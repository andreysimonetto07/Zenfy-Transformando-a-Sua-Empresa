import { NextResponse } from "next/server";
import { syncAllMetaClients } from "@/lib/meta-ads";

export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (!secret || authorization !== `Bearer ${secret}`) {
    return NextResponse.json({ ok:false, error:"Unauthorized" }, { status:401 });
  }

  try {
    const results = await syncAllMetaClients();
    const ok = results.every(result => result.ok);
    return NextResponse.json({ ok, results }, { status: ok ? 200 : 502 });
  } catch (error) {
    return NextResponse.json({
      ok:false,
      error:error instanceof Error?error.message:"Erro na sincronização.",
    }, { status:500 });
  }
}
