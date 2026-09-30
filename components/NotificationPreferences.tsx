"use client";

import { useEffect, useState } from "react";

type Prefs = {
  in_app_enabled: boolean;
  browser_enabled: boolean;
  messages: boolean;
  files: boolean;
  billing: boolean;
  traffic: boolean;
  projects: boolean;
  support: boolean;
  leads: boolean;
};

const defaults: Prefs = {
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

export default function NotificationPreferences({ showLeads = false }: { showLeads?: boolean }) {
  const [prefs, setPrefs] = useState<Prefs>(defaults);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!("Notification" in window)) setPermission("unsupported");
    else setPermission(Notification.permission);

    fetch("/api/notification-preferences", { cache: "no-store", credentials: "include" })
      .then((res) => res.json())
      .then((json) => setPrefs({ ...defaults, ...(json.preferences || {}) }))
      .catch(() => null);
  }, []);

  async function save(next: Partial<Prefs>) {
    const merged = { ...prefs, ...next };
    setPrefs(merged);
    window.dispatchEvent(new CustomEvent("zenfy:notification-preferences", { detail: next }));
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/notification-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(next),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.ok === false) throw new Error(json.error || "Não foi possível salvar.");
      setFeedback("Preferências salvas.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  }

  async function enableBrowser() {
    if (!("Notification" in window)) {
      setPermission("unsupported");
      return;
    }

    setFeedback(null);
    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === "granted") {
      if ("serviceWorker" in navigator) {
        await navigator.serviceWorker.register("/zenfy-sw.js").catch(() => null);
      }
      await save({ browser_enabled: true });
      setFeedback("Notificações do Chrome ativadas.");
    } else {
      await save({ browser_enabled: false });
      setFeedback(result === "denied"
        ? "O Chrome bloqueou as notificações. Você pode liberar novamente nas permissões do site."
        : "Permissão não concedida.");
    }
  }

  async function disableBrowser() {
    await save({ browser_enabled: false });
    setFeedback("Notificações do Chrome desativadas para esta conta.");
  }

  const categories: { key: keyof Prefs; title: string; text: string }[] = [
    { key: "messages", title: "Mensagens", text: "Novas mensagens entre cliente e equipe Zenfy." },
    { key: "files", title: "Arquivos", text: "Envio de documentos, criativos e materiais." },
    { key: "billing", title: "Faturamento", text: "Novas cobranças e alterações de status." },
    { key: "traffic", title: "Tráfego", text: "Atualizações de leads, investimento e resultados." },
    { key: "projects", title: "Projetos e sites", text: "Progresso, prazos e alterações nos projetos." },
    { key: "support", title: "Suporte", text: "Solicitações e movimentações de atendimento." },
  ];
  if (showLeads) categories.push({ key: "leads", title: "Leads e clientes", text: "Novos contatos do site e novos cadastros." });

  return (
    <section className="surface overflow-hidden">
      <div className="border-b border-zinc-100 p-5 sm:p-6">
        <p className="eyebrow">Notificações</p>
        <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-[#09113f]">Como você quer ser avisado?</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">Escolha o que aparece dentro da Zenfy e se o Chrome também pode mostrar avisos do sistema.</p>
      </div>

      <div className="grid gap-4 p-5 sm:p-6">
        <Toggle
          checked={prefs.in_app_enabled}
          disabled={saving}
          title="Central de notificações da Zenfy"
          text="Mantém o sininho e o histórico de avisos dentro do portal."
          onChange={(value) => save({ in_app_enabled: value })}
        />

        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-violet-50/60 p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-black text-[#09113f]">Notificações no Chrome</p>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-zinc-500">Mostra um aviso do navegador quando chegar uma nova notificação enquanto a Zenfy estiver aberta em alguma aba.</p>
              <p className="mt-2 text-xs font-bold text-zinc-400">
                Status do navegador: {permission === "granted" ? "permitido" : permission === "denied" ? "bloqueado" : permission === "unsupported" ? "não suportado" : "ainda não solicitado"}
              </p>
            </div>

            {prefs.browser_enabled && permission === "granted" ? (
              <button type="button" onClick={disableBrowser} disabled={saving} className="btn btn-ghost shrink-0">Desativar no Chrome</button>
            ) : (
              <button type="button" onClick={enableBrowser} disabled={saving || permission === "unsupported"} className="btn btn-primary shrink-0">Ativar no Chrome</button>
            )}
          </div>

          {permission === "denied" && (
            <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">As notificações foram bloqueadas no Chrome. Abra as permissões deste site no navegador, mude “Notificações” para “Permitir” e volte aqui.</p>
          )}
        </div>

        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-[.14em] text-zinc-400">Tipos de aviso</p>
          <div className="grid gap-3 md:grid-cols-2">
            {categories.map((item) => (
              <Toggle
                key={item.key}
                checked={Boolean(prefs[item.key])}
                disabled={saving}
                title={item.title}
                text={item.text}
                onChange={(value) => save({ [item.key]: value } as Partial<Prefs>)}
              />
            ))}
          </div>
        </div>

        {feedback && <p className="rounded-xl bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-600">{feedback}</p>}
      </div>
    </section>
  );
}

function Toggle({ checked, disabled, title, text, onChange }: { checked: boolean; disabled?: boolean; title: string; text: string; onChange: (value: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-4 transition hover:border-blue-200">
      <span>
        <span className="block font-black text-[#09113f]">{title}</span>
        <span className="mt-1 block text-sm leading-relaxed text-zinc-500">{text}</span>
      </span>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5 shrink-0 accent-blue-600" />
    </label>
  );
}
