"use client";

import { useI18n } from "@/lib/i18n";
import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";

interface ComingSoonProps {
  icon: React.ComponentType<{ className?: string }>;
  titleKey: string;
  descriptionEn: string;
  descriptionEs: string;
  features: { en: string; es: string }[];
}

export default function ComingSoon({ icon: Icon, titleKey, descriptionEn, descriptionEs, features }: ComingSoonProps) {
  const { t, locale } = useI18n();

  return (
    <div className="max-w-lg mx-auto py-10">
      <div className="bg-white rounded-md border border-[#f0f0f0] p-6 text-center">
        <div className="w-12 h-12 rounded-md bg-[#fafafa] border border-[#f0f0f0] flex items-center justify-center mx-auto mb-4">
          <Icon className="w-6 h-6 text-[#a0a0a0]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#fefce8] text-[#ca8a04] rounded text-[11px] font-medium mb-3">
          <Construction className="w-3 h-3" />
          {t("comingSoon.title")}
        </div>

        <h1 className="text-base font-medium text-[#1a1a1a] mb-1.5">{t(titleKey)}</h1>
        <p className="text-[13px] text-[#6b6b6b] max-w-sm mx-auto">
          {locale === "en" ? descriptionEn : descriptionEs}
        </p>

        {features.length > 0 && (
          <div className="mt-5 text-left bg-[#fafafa] rounded-md border border-[#f0f0f0] p-4 max-w-sm mx-auto">
            <h3 className="text-[10px] font-medium text-[#a0a0a0] uppercase tracking-wider mb-2">
              {locale === "en" ? "Planned Features" : "Funcionalidades Previstas"}
            </h3>
            <ul className="space-y-1.5">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-[#6b6b6b]">
                  <div className="w-1 h-1 rounded-full bg-[#5e6ad2] mt-2 shrink-0" />
                  {locale === "en" ? f.en : f.es}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 mt-5 px-3 py-1.5 bg-[#5e6ad2] text-white rounded-md text-[13px] font-medium hover:opacity-90 transition-all duration-150"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t("comingSoon.backToDashboard")}
        </Link>
      </div>
    </div>
  );
}
