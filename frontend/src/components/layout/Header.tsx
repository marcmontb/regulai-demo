"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { useSidePanel } from "@/components/chat/SidePanelProvider";
import { useSidebar } from "./SidebarProvider";
import { Globe, Sparkles, PanelLeftOpen } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const { locale, setLocale, t } = useI18n();
  const { toggle: togglePanel, isOpen: panelOpen } = useSidePanel();
  const { isOpen: sidebarOpen, toggle: toggleSidebar } = useSidebar();
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-12 bg-white border-b border-[#f0f0f0] flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-2">
        {!sidebarOpen && (
          <button
            type="button"
            onClick={toggleSidebar}
            className="w-8 h-8 rounded-md flex items-center justify-center text-[#a0a0a0] hover:text-[#6b6b6b] hover:bg-[#f0f0f0] transition-colors duration-150"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={togglePanel}
          className={`flex items-center gap-1.5 text-[13px] px-2.5 py-1.5 rounded-md transition-colors duration-150 ${
            panelOpen
              ? "text-[#5e6ad2] bg-[#eef2ff]"
              : "text-[#6b6b6b] hover:text-[#1a1a1a] hover:bg-[#f8f8f8]"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI</span>
        </button>

        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 text-[13px] text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors duration-150 px-2 py-1 rounded-md hover:bg-[#f8f8f8]"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{locale === "en" ? "EN" : "ES"}</span>
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-[#f0f0f0] rounded-md shadow-sm py-0.5 min-w-[120px] animate-fade-in">
              <button
                onClick={() => { setLocale("en"); setLangOpen(false); }}
                className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#f8f8f8] transition-colors duration-150 ${locale === "en" ? "text-[#5e6ad2] font-medium" : "text-[#6b6b6b]"}`}
              >
                {t("common.english")}
              </button>
              <button
                onClick={() => { setLocale("es"); setLangOpen(false); }}
                className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-[#f8f8f8] transition-colors duration-150 ${locale === "es" ? "text-[#5e6ad2] font-medium" : "text-[#6b6b6b]"}`}
              >
                {t("common.spanish")}
              </button>
            </div>
          )}
        </div>

        <a href="https://www.quimidroga.com/" target="_blank" rel="noopener noreferrer" className="flex items-center opacity-80 hover:opacity-100 transition-opacity duration-150">
          <Image
            src="/quimidroga-logo.png"
            alt="Quimidroga"
            width={80}
            height={16}
            className="object-contain"
            style={{ height: 16, width: "auto" }}
          />
        </a>
      </div>
    </header>
  );
}
