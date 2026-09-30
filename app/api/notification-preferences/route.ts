import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const defaults = {
  in_app_enabled: true,
  browser_enabled: false,
  messages: true,
  files: true,
  billing: true,
  traffic: true,
  projects: true,
  support: true,
  leads: true,
};

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ preferences: defaults }, { status: 401 });

  const { data, error } = await supabase
    .from("notification_preferences")
    .select("in_app_enabled,browser_enabled,messages,files,billing,traffic,projects,support,leads")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) return NextResponse.json({ preferences: defaults });
  return NextResponse.json({ preferences: { ...defaults, ...data } }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const allowed = ["in_app_enabled","browser_enabled","messages","files","billing","traffic","projects","support","leads"] as const;
  const payload: Record<string, boolean | string> = { user_id: user.id, updated_at: new Date().toISOString() };

  for (const key of allowed) {
    if (typeof body?.[key] === "boolean") payload[key] = body[key];
  }

  const { error } = await supabase
    .from("notification_preferences")
    .upsert(payload, { onConflict: "user_id" });

  return NextResponse.json({ ok: !error, error: error?.message || null });
}
