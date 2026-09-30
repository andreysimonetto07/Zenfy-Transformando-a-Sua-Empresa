"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type NotificationItem = {
  id: string;
  type: string | null;
  title: string | null;
  body: string | null;
  link: string | null;
  read: boolean | null;
  created_at: string | null;
};

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

const defaultPrefs: Prefs = {
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

export default function NotificationBell() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const wrapper = useRef<HTMLDivElement>(null);
  const knownIds = useRef<Set<string>>(new Set());
  const initialized = useRef(false);

  const filteredItems = useMemo(() => items.filter((item) => categoryEnabled(item.type, prefs)), [items, prefs]);
  const visibleItems = prefs.in_app_enabled ? filteredItems : [];
  const unread = useMemo(() => visibleItems.filter((item) => !item.read).length, [visibleItems]);

  async function loadPreferences() {
    try {
      const res = await fetch("/api/notification-preferences", { cache: "no-store", credentials: "include" });
      if (!res.ok) return;
      const json = await res.json();
      setPrefs({ ...defaultPrefs, ...(json.preferences || {}) });
    } catch {}
  }

  async function showBrowserNotification(item: NotificationItem, currentPrefs: Prefs) {
    if (!currentPrefs.browser_enabled || !categoryEnabled(item.type, currentPrefs)) return;
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    const title = item.title || "Zenfy";
    const options: NotificationOptions & { image?: string } = {
      body: item.body || "Você recebeu uma nova atualização.",
      icon: "/brand/zenfy/icon-64.png",
      badge: "/brand/zenfy/icon-32.png",
      tag: "zenfy-" + item.id,
      data: { link: item.link || "/" },
    };

    try {
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.register("/zenfy-sw.js");
        await registration.showNotification(title, options);
      } else {
        const notification = new Notification(title, options);
        notification.onclick = () => {
          window.focus();
          if (item.link) window.location.href = item.link;
          notification.close();
        };
      }
    } catch {}
  }

  async function refresh() {
    try {
      const res = await fetch("/api/notifications", { cache: "no-store", credentials: "include" });
      if (!res.ok) return;
      const json = await res.json();
      const nextItems: NotificationItem[] = Array.isArray(json.notifications) ? json.notifications : [];

      if (!initialized.current) {
        knownIds.current = new Set(nextItems.map((item) => item.id));
        initialized.current = true;
      } else {
        const fresh = nextItems.filter((item) => !knownIds.current.has(item.id) && !item.read);
        fresh.forEach((item) => showBrowserNotification(item, prefs));
        nextItems.forEach((item) => knownIds.current.add(item.id));
      }

      setItems(nextItems);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPreferences();
    refresh();

    const timer = window.setInterval(refresh, 15000);
    const onFocus = () => {
      loadPreferences();
      refresh();
    };
    const onPreferences = (event: Event) => {
      const custom = event as CustomEvent<Partial<Prefs>>;
      if (custom.detail) setPrefs((current) => ({ ...current, ...custom.detail }));
      else loadPreferences();
    };

    window.addEventListener("focus", onFocus);
    window.addEventListener("zenfy:notification-preferences", onPreferences as EventListener);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("zenfy:notification-preferences", onPreferences as EventListener);
    };
  }, []);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (wrapper.current && !wrapper.current.contains(event.target as Node)) setOpen(false);
    };
    const esc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    window.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("keydown", esc);
    };
  }, []);

  async function markOne(item: NotificationItem) {
    if (!item.read) {
      setItems((current) => current.map((n) => n.id === item.id ? { ...n, read: true } : n));
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: item.id }),
      }).catch(() => null);
    }
    if (item.link) window.location.href = item.link;
    else setOpen(false);
  }

  async function markAll() {
    const ids = new Set(visibleItems.map((item) => item.id));
    setItems((current) => current.map((n) => ids.has(n.id) ? { ...n, read: true } : n));
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ all: true }),
    }).catch(() => null);
  }

  return (
    <div ref={wrapper} className="relative z-[120]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`relative flex h-11 w-11 items-center justify-center rounded-2xl border transition duration-200 ${open ? "border-cyan-300/40 bg-white/20 text-white" : "border-white/10 bg-white/10 text-white hover:bg-white/15"}`}
        aria-label="Notificações"
        aria-expanded={open}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-fuchsia-500 px-1 text-[10px] font-black text-white shadow-lg">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      <div className={`absolute right-0 top-[calc(100%+10px)] z-[200] w-[min(92vw,390px)] origin-top-right overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-white shadow-[0_24px_80px_rgba(2,6,36,.30)] transition-all duration-200 ${open ? "visible translate-y-0 scale-100 opacity-100" : "invisible -translate-y-2 scale-[.98] opacity-0"}`}>
        <div className="flex items-center justify-between border-b border-zinc-100 bg-white px-4 py-3.5">
          <div>
            <p className="font-black text-[#09113f]">Notificações</p>
            <p className="text-xs text-zinc-400">{prefs.in_app_enabled ? (unread ? unread + " não lida" + (unread > 1 ? "s" : "") : "Tudo em dia") : "Central interna desativada"}</p>
          </div>
          {prefs.in_app_enabled && unread > 0 && <button type="button" onClick={markAll} className="text-xs font-black text-brand hover:underline">Marcar todas</button>}
        </div>

        <div className="max-h-[min(430px,65vh)] overflow-y-auto bg-white">
          {!prefs.in_app_enabled ? (
            <div className="p-8 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500">🔕</div>
              <p className="mt-3 font-bold text-[#09113f]">Central interna desativada</p>
              <p className="mt-1 text-sm text-zinc-400">Você pode ativá-la novamente nas configurações da conta.</p>
            </div>
          ) : loading ? (
            <div className="p-8 text-center text-sm text-zinc-400">Carregando...</div>
          ) : visibleItems.length ? (
            <div className="divide-y divide-zinc-100">
              {visibleItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => markOne(item)}
                  className={`w-full p-4 text-left transition hover:bg-blue-50/60 ${item.read ? "bg-white" : "bg-blue-50/35"}`}
                >
                  <div className="flex gap-3">
                    <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.read ? "bg-zinc-200" : "brand-gradient"}`} />
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm ${item.read ? "font-bold text-zinc-700" : "font-black text-[#09113f]"}`}>{item.title || "Notificação"}</p>
                      {item.body && <p className="mt-1 text-sm leading-relaxed text-zinc-500">{item.body}</p>}
                      <p className="mt-2 text-[11px] font-semibold text-zinc-400">{timeAgo(item.created_at)}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-brand">✓</div>
              <p className="mt-3 font-bold text-[#09113f]">Nenhuma notificação</p>
              <p className="mt-1 text-sm text-zinc-400">Novidades da sua conta vão aparecer aqui.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function categoryEnabled(type: string | null, prefs: Prefs) {
  const value = (type || "").toLowerCase();
  if (value === "message") return prefs.messages;
  if (value === "file") return prefs.files;
  if (value === "invoice") return prefs.billing;
  if (value === "traffic") return prefs.traffic;
  if (value === "project" || value === "site") return prefs.projects;
  if (value === "support") return prefs.support;
  if (value === "lead" || value === "client" || value === "novo_lead") return prefs.leads;
  return true;
}

function timeAgo(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const diff = Math.max(0, Date.now() - date.getTime());
  const min = Math.floor(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return "há " + min + " min";
  const hours = Math.floor(min / 60);
  if (hours < 24) return "há " + hours + "h";
  const days = Math.floor(hours / 24);
  if (days < 7) return "há " + days + " dia" + (days > 1 ? "s" : "");
  return date.toLocaleDateString("pt-BR");
}
