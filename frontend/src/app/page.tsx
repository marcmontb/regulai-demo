"use client";

import { useState } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { useChat } from "@/components/chat/ChatProvider";
import { useSidePanel } from "@/components/chat/SidePanelProvider";
import { Send, Sparkles, Search, ShieldCheck, FileText, Beaker, LayoutDashboard } from "lucide-react";

export default function AILandingPage() {
  const { t, locale } = useI18n();
  const { sendMessage } = useChat();
  const { open } = useSidePanel();
  const [input, setInput] = useState("");

  const pills = locale === "en"
    ? [
        { label: "Check REACH status", icon: Search },
        { label: "Validate supplier", icon: ShieldCheck },
        { label: "Draft notification", icon: FileText },
        { label: "REACH quotas", icon: Beaker },
        { label: "Open dashboard", icon: LayoutDashboard },
      ]
    : [
        { label: "Consultar estado REACH", icon: Search },
        { label: "Validar proveedor", icon: ShieldCheck },
        { label: "Redactar notificación", icon: FileText },
        { label: "Cuotas REACH", icon: Beaker },
        { label: "Abrir dashboard", icon: LayoutDashboard },
      ];

  const handleSubmit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    open();
    setInput("");
  };

  return (
    <div className="flex flex-col items-center justify-center px-6" style={{ minHeight: "calc(100vh - 0px)" }}>
      <div className="w-full max-w-2xl flex flex-col items-center">
        <div className="flex items-center gap-1 mb-2">
          <Image
            src="/quimidroga-logo.png"
            alt="Quimidroga"
            width={160}
            height={32}
            className="object-contain"
            style={{ height: 30, width: "auto" }}
          />
          <span className="text-lg font-semibold tracking-tight text-[#00b331]">AI</span>
        </div>
        <h1 className="text-2xl font-medium text-[#1a1a1a] tracking-tight mb-1">
          {t("ai.landing.greeting")}
        </h1>
        <p className="text-[13px] text-[#6b6b6b] mb-8 text-center max-w-md">
          {t("ai.landing.subtitle")}
        </p>

        <div className="w-full bg-white border border-[#e0e0e0] rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm hover:border-[#d0d0d0] focus-within:border-[#5e6ad2] focus-within:shadow-md transition-all duration-200">
          <Sparkles className="w-5 h-5 text-[#5e6ad2] shrink-0" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(input); }}
            placeholder={t("ai.landing.placeholder")}
            className="flex-1 text-[15px] bg-transparent outline-none placeholder:text-[#a0a0a0] text-[#1a1a1a]"
          />
          <button
            type="button"
            onClick={() => handleSubmit(input)}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-lg bg-[#5e6ad2] text-white flex items-center justify-center hover:opacity-90 transition-all duration-150 disabled:opacity-30"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {pills.map((pill) => {
            const Icon = pill.icon;
            return (
              <button
                key={pill.label}
                type="button"
                onClick={() => handleSubmit(pill.label)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#f0f0f0] bg-white text-[13px] text-[#6b6b6b] hover:border-[#e0e0e0] hover:bg-[#f8f8f8] hover:text-[#1a1a1a] transition-all duration-150"
              >
                <Icon className="w-3.5 h-3.5" />
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
