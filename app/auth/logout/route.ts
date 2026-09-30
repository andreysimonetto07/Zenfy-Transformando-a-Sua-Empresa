import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true }, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
