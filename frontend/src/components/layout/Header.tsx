"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { Globe, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const { locale, setLocale, t } = useI18n();
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
    <header className="h-14 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <Search className="w-4 h-4 text-navy-400" />
        <input
          type="text"
          placeholder={t("common.search") + "..."}
          className="bg-transparent text-sm text-navy-700 placeholder:text-navy-300 outline-none w-full"
        />
      </div>

      <div className="flex items-center gap-4">
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-2 text-sm text-navy-600 hover:text-navy-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-surface-hover"
          >
            <Globe className="w-4 h-4" />
            <span>{locale === "en" ? "EN" : "ES"}</span>
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-border rounded-lg shadow-lg py-1 min-w-[140px] animate-fade-in">
              <button
                onClick={() => { setLocale("en"); setLangOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-surface-hover transition-colors ${locale === "en" ? "text-accent font-medium" : "text-navy-600"}`}
              >
                {t("common.english")}
              </button>
              <button
                onClick={() => { setLocale("es"); setLangOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-surface-hover transition-colors ${locale === "es" ? "text-accent font-medium" : "text-navy-600"}`}
              >
                {t("common.spanish")}
              </button>
            </div>
          )}
        </div>

        <a href="https://www.quimidroga.com/" target="_blank" rel="noopener noreferrer" className="relative h-6 flex items-center justify-end opacity-90 hover:opacity-100 transition-opacity">
          <Image
            src="/quimidroga-logo.png"
            alt="Quimidroga"
            width={100}
            height={20}
            className="object-contain object-right"
            style={{ height: 20, width: "auto" }}
          />
        </a>
      </div>
    </header>
  );
}
