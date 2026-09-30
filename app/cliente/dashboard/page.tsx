import { requireProfile } from "@/lib/auth";

export default async function ClientDashboard() {
  const { supabase, profile } = await requireProfile(["client"]);
  const { data: project } = await supabase.from("projects").select("name,status,progress,deadline").order("created_at", { ascending: false }).limit(1).maybeSingle();
  return (
    <>
      <h1 className="text-2xl font-bold">Olá, {profile.name}</h1>
      <p className="mb-8 text-zinc-600">Bem-vindo à Zenfy.</p>
      {project ? (
        <div className="max-w-md rounded-lg border border-zinc-200 bg-white p-6">
          <h2 className="font-semibold">{project.name}</h2>
          <div className="mt-4 h-2 rounded bg-zinc-200"><div className="h-2 rounded bg-brand" style={{ width: `${project.progress}%` }} /></div>
          <p className="mt-2 text-sm text-zinc-600">{project.progress}% · {project.status}</p>
          {project.deadline && <p className="text-sm text-zinc-600">Prazo previsto: {new Date(project.deadline).toLocaleDateString("pt-BR")}</p>}
        </div>
      ) : <p className="text-zinc-600">Seu projeto aparecerá aqui assim que for iniciado.</p>}
    </>
  );
}
