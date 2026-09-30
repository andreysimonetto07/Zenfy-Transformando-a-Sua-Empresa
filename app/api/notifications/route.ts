import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ notifications: [], unread: 0 }, { status: 401 });

  const { data, error } = await supabase
    .from("notifications")
    .select("id,type,title,body,link,read,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) return NextResponse.json({ notifications: [], unread: 0 });

  const notifications = data ?? [];
  return NextResponse.json({
    notifications,
    unread: notifications.filter((item) => !item.read).length,
  }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });

  const payload = await request.json().catch(() => ({}));

  if (payload?.all === true) {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);
    return NextResponse.json({ ok: !error });
  }

  const id = typeof payload?.id === "string" ? payload.id : "";
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id)
    .eq("user_id", user.id);

  return NextResponse.json({ ok: !error });
}
