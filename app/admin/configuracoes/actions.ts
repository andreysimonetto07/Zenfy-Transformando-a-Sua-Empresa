"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireProfile } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

const teamMemberSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  password: z.string().min(8).max(128),
  role: z.enum(["admin", "super_admin"]),
});

type Result = { ok: true } | { ok: false; error: string };

export async function createTeamMemberAction(raw: unknown): Promise<Result> {
  try {
    await requireProfile(["super_admin"]);

    const parsed = teamMemberSchema.safeParse(raw);
    if (!parsed.success) return { ok: false, error: "Confira nome, e-mail, senha e nível de acesso." };

    const admin = createServiceClient();
    const d = parsed.data;

    const { data, error } = await admin.auth.admin.createUser({
      email: d.email,
      password: d.password,
      email_confirm: true,
      user_metadata: { name: d.name },
    });

    if (error || !data.user) {
      if (error?.message.toLowerCase().includes("already")) {
        return { ok: false, error: "Já existe uma conta com este e-mail." };
      }
      return { ok: false, error: error?.message || "Não foi possível criar o acesso." };
    }

    const { error: profileError } = await admin
      .from("profiles")
      .update({ name: d.name, email: d.email, role: d.role, updated_at: new Date().toISOString() })
      .eq("id", data.user.id);

    if (profileError) {
      await admin.auth.admin.deleteUser(data.user.id);
      return { ok: false, error: "A conta foi revertida porque não foi possível criar o perfil administrativo." };
    }

    revalidatePath("/admin/configuracoes");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Não foi possível criar o acesso." };
  }
}
