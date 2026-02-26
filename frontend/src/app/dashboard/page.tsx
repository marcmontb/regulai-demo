"use client";

import { useI18n } from "@/lib/i18n";
import { kpiData, activityFeed } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import {
  ShieldCheck, FileQuestion, GitBranch, Beaker, Bell,
  Database, Users, FileText, Wheat,
  AlertTriangle, CheckCircle2, Clock, ArrowRight,
} from "lucide-react";

const kpiCards = [
  { key: "pendingHomologations" as const, icon: ShieldCheck, color: "text-amber-600", bg: "bg-[#fefce8]" },
  { key: "openQuestionnaires" as const, icon: FileQuestion, color: "text-[#5e6ad2]", bg: "bg-[#eef2ff]" },
  { key: "reachAlerts" as const, icon: AlertTriangle, color: "text-red-600", bg: "bg-[#fef2f2]" },
  { key: "pendingChanges" as const, icon: Bell, color: "text-[#6b6b6b]", bg: "bg-[#f5f5f5]" },
];

const modules = [
  { href: "/homologation", icon: ShieldCheck, titleKey: "nav.homologation", descEn: "AI-powered validation of supplier questionnaires with anomaly detection", descEs: "Validación de cuestionarios de proveedores con detección de anomalías por IA", active: true },
  { href: "/questionnaires", icon: FileQuestion, titleKey: "nav.questionnaires", descEn: "Automatic AI responses to client regulatory questionnaires", descEs: "Respuestas automáticas por IA a cuestionarios regulatorios de clientes", active: true },
  { href: "/flowcharts", icon: GitBranch, titleKey: "nav.flowcharts", descEn: "Generate consolidated manufacturing process flowcharts with AI", descEs: "Generación de diagramas de flujo consolidados de fabricación con IA", active: true },
  { href: "/reach", icon: Beaker, titleKey: "nav.reach", descEn: "Monitor REACH quotas, consumption trends, and regulatory alerts", descEs: "Monitorización de cuotas REACH, tendencias de consumo y alertas regulatorias", active: true },
  { href: "/changes", icon: Bell, titleKey: "nav.changes", descEn: "Automated detection and notification of regulatory changes", descEs: "Detección y notificación automatizada de cambios regulatorios", active: true },
  { href: "/modules/internal-homologation", icon: Database, titleKey: "nav.internalHomologation", descEn: "Automate internal homologation records from approved questionnaires", descEs: "Automatización de registros de homologación interna desde cuestionarios aprobados", active: false },
  { href: "/modules/supplier-standardization", icon: Users, titleKey: "nav.supplierStandardization", descEn: "Standardized supplier qualification and scoring process", descEs: "Proceso estandarizado de calificación y puntuación de proveedores", active: false },
  { href: "/modules/sds-extraction", icon: FileText, titleKey: "nav.sdsExtraction", descEn: "Extract and validate data from Safety Data Sheets with AI", descEs: "Extracción y validación de datos de Fichas de Seguridad con IA", active: false },
  { href: "/modules/feed-requirements", icon: Wheat, titleKey: "nav.feedRequirements", descEn: "FEED-specific homologation requirements and processes", descEs: "Requisitos y procesos de homologación específicos para FEED", active: false },
];

const statusIcons = {
  completed: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
  in_progress: <Clock className="w-3.5 h-3.5 text-[#5e6ad2]" />,
  alert: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
};

export default function DashboardPage() {
  const { t, locale } = useI18n();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-base font-medium text-[#1a1a1a] tracking-tight">{t("dashboard.welcome")}</h1>
        <p className="text-[13px] text-[#6b6b6b] mt-0.5">{t("dashboard.subtitle")}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          const value = kpiData[card.key];
          return (
            <div key={card.key} className="bg-white rounded-md border border-[#f0f0f0] p-4 transition-colors duration-150 hover:border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-7 h-7 rounded-md ${card.bg} flex items-center justify-center`}>
                  <Icon className={`w-3.5 h-3.5 ${card.color}`} />
                </div>
                <span className="text-xl font-semibold text-[#1a1a1a]">{value}</span>
              </div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-[#6b6b6b]">{t(`dashboard.kpi.${card.key}`)}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Module Cards */}
        <div className="lg:col-span-3">
          <h2 className="text-[13px] font-medium text-[#1a1a1a] mb-3">{t("dashboard.modules.title")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {modules.map((mod) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.href}
                  href={mod.href}
                  className={`group bg-white rounded-md border border-[#f0f0f0] p-3 transition-all duration-150 hover:border-[#e0e0e0] ${!mod.active ? "opacity-40" : ""}`}
                >
                  <div className="flex items-start gap-2.5">
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${mod.active ? "text-[#5e6ad2]" : "text-[#a0a0a0]"}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[13px] font-medium text-[#1a1a1a] truncate">{t(mod.titleKey)}</h3>
                        {mod.active ? (
                          <span className="text-[9px] font-medium bg-[#ecfdf5] text-[#059669] px-1.5 py-0.5 rounded whitespace-nowrap">
                            {t("dashboard.modules.active")}
                          </span>
                        ) : (
                          <span className="text-[9px] font-medium bg-[#f5f5f5] text-[#a0a0a0] px-1.5 py-0.5 rounded whitespace-nowrap">
                            {t("dashboard.modules.comingSoon")}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#6b6b6b] mt-0.5 line-clamp-2">
                        {locale === "en" ? mod.descEn : mod.descEs}
                      </p>
                    </div>
                    {mod.active && (
                      <ArrowRight className="w-3.5 h-3.5 text-[#d4d4d4] group-hover:text-[#5e6ad2] transition-colors duration-150 shrink-0 mt-0.5" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-md border border-[#f0f0f0] p-4">
        <h2 className="text-[13px] font-medium text-[#1a1a1a] mb-3">{t("dashboard.activity.title")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
          {activityFeed.slice(0, 8).map((item) => (
            <div key={item.id} className="flex gap-2.5 p-2 rounded-md hover:bg-[#f8f8f8] transition-colors duration-150">
              <div className="mt-0.5">{statusIcons[item.status]}</div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-[#1a1a1a] truncate">{item.title}</p>
                <p className="text-[11px] text-[#6b6b6b] mt-0.5 line-clamp-2">{item.description}</p>
                <p className="text-[10px] text-[#a0a0a0] mt-0.5">{formatDate(item.timestamp, locale)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
