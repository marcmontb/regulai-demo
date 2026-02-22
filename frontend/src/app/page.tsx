"use client";

import { useI18n } from "@/lib/i18n";
import { kpiData, activityFeed } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import {
  ShieldCheck, FileQuestion, GitBranch, Beaker, Bell,
  Database, Users, FileText, Wheat, TrendingUp,
  AlertTriangle, CheckCircle2, Clock, ArrowRight, Sparkles,
} from "lucide-react";

const kpiCards = [
  { key: "pendingHomologations" as const, icon: ShieldCheck, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200" },
  { key: "openQuestionnaires" as const, icon: FileQuestion, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200" },
  { key: "reachAlerts" as const, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50", border: "border-red-200" },
  { key: "pendingChanges" as const, icon: Bell, color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-200" },
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
  completed: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  in_progress: <Clock className="w-4 h-4 text-blue-500" />,
  alert: <AlertTriangle className="w-4 h-4 text-amber-500" />,
};

export default function DashboardPage() {
  const { t, locale } = useI18n();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
            {t("dashboard.welcome")}
            <Sparkles className="w-5 h-5 text-accent" />
          </h1>
          <p className="text-navy-500 mt-1">{t("dashboard.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-navy-400 bg-white border border-border rounded-lg px-3 py-2">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{locale === "en" ? "System Status: Operational" : "Estado del Sistema: Operativo"}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          const value = kpiData[card.key];
          return (
            <div
              key={card.key}
              className={`bg-white rounded-xl border ${card.border} p-5 animate-fade-in`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <span className="text-2xl font-bold text-navy-900">{value}</span>
              </div>
              <p className="text-sm text-navy-500">{t(`dashboard.kpi.${card.key}`)}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-navy-800">{t("dashboard.activity.title")}</h2>
          </div>
          <div className="space-y-3">
            {activityFeed.slice(0, 6).map((item) => (
              <div key={item.id} className="flex gap-3 p-2 rounded-lg hover:bg-surface-hover transition-colors">
                <div className="mt-0.5">{statusIcons[item.status]}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-navy-800 truncate">{item.title}</p>
                  <p className="text-xs text-navy-400 mt-0.5 line-clamp-2">{item.description}</p>
                  <p className="text-[10px] text-navy-300 mt-1">{formatDate(item.timestamp, locale)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module Cards */}
        <div className="lg:col-span-2">
          <h2 className="font-semibold text-navy-800 mb-4">{t("dashboard.modules.title")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {modules.map((mod) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.href}
                  href={mod.href}
                  className={`group bg-white rounded-xl border border-border p-4 transition-all duration-200 hover:shadow-md hover:border-accent/30 ${!mod.active ? "opacity-60" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${mod.active ? "bg-accent/10 text-accent" : "bg-navy-100 text-navy-400"}`}>
                      <Icon className="w-[18px] h-[18px]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-navy-800 truncate">{t(mod.titleKey)}</h3>
                        {mod.active ? (
                          <span className="text-[9px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap">
                            {t("dashboard.modules.active")}
                          </span>
                        ) : (
                          <span className="text-[9px] bg-navy-100 text-navy-400 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                            {t("dashboard.modules.comingSoon")}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-navy-400 mt-1 line-clamp-2">
                        {locale === "en" ? mod.descEn : mod.descEs}
                      </p>
                    </div>
                    {mod.active && (
                      <ArrowRight className="w-4 h-4 text-navy-300 group-hover:text-accent transition-colors shrink-0 mt-1" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
