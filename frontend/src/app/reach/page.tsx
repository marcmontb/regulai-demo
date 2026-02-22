"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { reachSubstances } from "@/lib/mock-data";
import { cn, formatNumber } from "@/lib/utils";
import {
  Beaker, AlertTriangle, CheckCircle2, TrendingUp,
  ExternalLink, Shield,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend, Cell,
} from "recharts";

const alertColors = {
  normal: { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", bar: "#10b981" },
  warning: { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", bar: "#f59e0b" },
  critical: { text: "text-red-600", bg: "bg-red-50", border: "border-red-200", bar: "#ef4444" },
};

const echaData = [
  { substance: "Limonene", dossierLeader: "Citrus & Allied Essences Ltd", status: "Active", lastUpdate: "2025-11-30" },
  { substance: "Linalool", dossierLeader: "BASF SE", status: "Active", lastUpdate: "2025-12-15" },
  { substance: "Citral", dossierLeader: "Symrise AG", status: "Active", lastUpdate: "2025-10-22" },
  { substance: "Eugenol", dossierLeader: "Indesso Aroma", status: "Active", lastUpdate: "2025-09-18" },
  { substance: "Cinnamaldehyde", dossierLeader: "Emerald Kalama Chemical", status: "Under Evaluation", lastUpdate: "2026-01-10" },
  { substance: "Geraniol", dossierLeader: "BASF SE", status: "Active", lastUpdate: "2025-11-05" },
];

export default function ReachPage() {
  const { t, locale } = useI18n();
  const [selectedSubstance, setSelectedSubstance] = useState<string>(reachSubstances[0].id);

  const substance = reachSubstances.find((s) => s.id === selectedSubstance)!;
  const remaining = substance.annualQuota - substance.consumed;
  const consumedPct = (substance.consumed / substance.annualQuota * 100).toFixed(1);
  const alertStyle = alertColors[substance.alertLevel];

  const alerts = reachSubstances.filter((s) => s.alertLevel !== "normal");

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
          <Beaker className="w-6 h-6 text-accent" />
          {t("reach.title")}
        </h1>
        <p className="text-navy-500 mt-1">{t("reach.subtitle")}</p>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-navy-700">{t("reach.quotaAlerts")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {alerts.map((a) => {
              const pct = (a.consumed / a.annualQuota * 100).toFixed(1);
              const style = alertColors[a.alertLevel];
              return (
                <button
                  key={a.id}
                  onClick={() => setSelectedSubstance(a.id)}
                  className={cn(
                    "p-4 rounded-xl border text-left transition-all hover:shadow-sm",
                    style.bg, style.border,
                    selectedSubstance === a.id && "ring-2 ring-offset-1 ring-accent"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={cn("w-4 h-4", style.text)} />
                      <span className="font-semibold text-sm text-navy-800">{a.name}</span>
                    </div>
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", style.bg, style.text)}>
                      {pct}%
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-navy-500">
                    {formatNumber(a.consumed, locale)} / {formatNumber(a.annualQuota, locale)} {a.unit}
                  </div>
                  <div className="w-full bg-white/60 rounded-full h-1.5 mt-2">
                    <div className={cn("h-1.5 rounded-full")} style={{ width: `${pct}%`, backgroundColor: alertColors[a.alertLevel].bar }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Substance Selector */}
      <div className="bg-white rounded-xl border border-border p-5">
        <div className="flex gap-2 flex-wrap mb-4">
          {reachSubstances.map((s) => {
            const style = alertColors[s.alertLevel];
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSubstance(s.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                  selectedSubstance === s.id
                    ? "border-accent bg-accent text-white"
                    : cn("bg-white text-navy-600 hover:bg-surface-hover", style.border)
                )}
              >
                {s.name}
                {s.alertLevel !== "normal" && selectedSubstance !== s.id && (
                  <span className="ml-1.5 w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: style.bar }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Quota Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-navy-50 rounded-lg p-4">
            <div className="text-xs text-navy-400">{t("reach.substance")}</div>
            <div className="text-lg font-bold text-navy-900 mt-1">{substance.name}</div>
            <div className="text-xs text-navy-400 mt-0.5">CAS {substance.cas}</div>
          </div>
          <div className="bg-navy-50 rounded-lg p-4">
            <div className="text-xs text-navy-400">{t("reach.annualQuota")}</div>
            <div className="text-lg font-bold text-navy-900 mt-1">{formatNumber(substance.annualQuota, locale)} {substance.unit}</div>
          </div>
          <div className={cn("rounded-lg p-4", alertStyle.bg)}>
            <div className={cn("text-xs", alertStyle.text)}>{t("reach.consumed")}</div>
            <div className={cn("text-lg font-bold mt-1", alertStyle.text)}>{formatNumber(substance.consumed, locale)} {substance.unit}</div>
            <div className="text-xs text-navy-400 mt-0.5">{consumedPct}%</div>
          </div>
          <div className="bg-navy-50 rounded-lg p-4">
            <div className="text-xs text-navy-400">{t("reach.remaining")}</div>
            <div className="text-lg font-bold text-navy-900 mt-1">{formatNumber(remaining, locale)} {substance.unit}</div>
            <div className="text-xs text-navy-400 mt-0.5">{(100 - parseFloat(consumedPct)).toFixed(1)}%</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-navy-100 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-700"
              style={{ width: `${consumedPct}%`, backgroundColor: alertStyle.bar }}
            />
          </div>
        </div>

        {/* Monthly Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-navy-700 mb-3">{t("reach.monthlyConsumption")}</h4>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={substance.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
                  formatter={(value: number) => [formatNumber(value, locale) + ` ${substance.unit}`, ""]}
                />
                <Bar dataKey="current" fill="#0d9488" radius={[4, 4, 0, 0]} name={locale === "en" ? "2026" : "2026"} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-navy-700 mb-3">{t("reach.yearComparison")}</h4>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={substance.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
                  formatter={(value: number) => [formatNumber(value, locale) + ` ${substance.unit}`, ""]}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="current" stroke="#0d9488" strokeWidth={2} dot={{ r: 3 }} name={t("reach.currentYear") + " (2026)"} />
                <Line type="monotone" dataKey="previous" stroke="#94a3b8" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 5" name={t("reach.previousYear") + " (2025)"} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ECHA Database Connection */}
      <div className="bg-white rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-navy-800">{t("reach.echaConnection")}</h3>
          <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-medium">
            {locale === "en" ? "Connected" : "Conectado"}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-navy-50 border-b border-border">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-navy-600">{t("reach.substance")}</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-navy-600">{t("reach.dossierLeader")}</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-navy-600">{t("reach.registrationStatus")}</th>
              </tr>
            </thead>
            <tbody>
              {echaData.map((row, i) => (
                <tr key={i} className="border-b border-border-light last:border-0">
                  <td className="px-4 py-2.5 text-sm font-medium text-navy-800">{row.substance}</td>
                  <td className="px-4 py-2.5 text-sm text-navy-600">{row.dossierLeader}</td>
                  <td className="px-4 py-2.5">
                    <span className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full",
                      row.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    )}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
