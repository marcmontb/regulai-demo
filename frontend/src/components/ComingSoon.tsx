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
    <div className="max-w-2xl mx-auto py-12">
      <div className="bg-white rounded-2xl border border-border p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-navy-100 flex items-center justify-center mx-auto mb-5">
          <Icon className="w-8 h-8 text-navy-400" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-medium mb-4">
          <Construction className="w-3.5 h-3.5" />
          {t("comingSoon.title")}
        </div>

        <h1 className="text-2xl font-bold text-navy-900 mb-2">{t(titleKey)}</h1>
        <p className="text-navy-500 text-sm max-w-md mx-auto">
          {locale === "en" ? descriptionEn : descriptionEs}
        </p>

        {features.length > 0 && (
          <div className="mt-6 text-left bg-navy-50 rounded-xl p-5 max-w-md mx-auto">
            <h3 className="text-xs font-semibold text-navy-600 uppercase tracking-wider mb-3">
              {locale === "en" ? "Planned Features" : "Funcionalidades Previstas"}
            </h3>
            <ul className="space-y-2">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-navy-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  {locale === "en" ? f.en : f.es}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("comingSoon.backToDashboard")}
        </Link>
      </div>
    </div>
  );
}
