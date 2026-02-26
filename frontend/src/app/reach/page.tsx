"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { reachSubstances } from "@/lib/mock-data";
import { cn, formatNumber } from "@/lib/utils";
import {
  AlertTriangle, Shield,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend,
} from "recharts";

const alertColors = {
  normal: { text: "text-[#059669]", bg: "bg-[#ecfdf5]", border: "border-[#dcfce7]", bar: "#059669" },
  warning: { text: "text-[#ca8a04]", bg: "bg-[#fefce8]", border: "border-[#fef3c7]", bar: "#ca8a04" },
  critical: { text: "text-[#dc2626]", bg: "bg-[#fef2f2]", border: "border-[#fee2e2]", bar: "#dc2626" },
};

const echaData = [
  { substance: "Toluene", dossierLeader: "BASF SE", status: "Active", lastUpdate: "2025-11-30" },
  { substance: "Butyl Acetate", dossierLeader: "BASF SE", status: "Active", lastUpdate: "2025-12-15" },
  { substance: "Titanium Dioxide", dossierLeader: "Evonik Industries AG", status: "Under Evaluation", lastUpdate: "2026-01-10" },
  { substance: "Epoxy Resin (BPA)", dossierLeader: "Dow Chemical Company", status: "Active", lastUpdate: "2025-10-22" },
  { substance: "MDI", dossierLeader: "Wanhua Chemical Group", status: "Active", lastUpdate: "2025-09-18" },
  { substance: "Ethylene Glycol", dossierLeader: "BASF SE", status: "Active", lastUpdate: "2025-11-05" },
  { substance: "DEHP (DOP)", dossierLeader: "Evonik Industries AG", status: "SVHC — Authorization Required", lastUpdate: "2026-02-01" },
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
    <div className="max-w-6xl mx-auto space-y-5">
      <div>
        <h1 className="text-base font-medium text-[#1a1a1a] tracking-tight">{t("reach.title")}</h1>
        <p className="text-[13px] text-[#6b6b6b] mt-0.5">{t("reach.subtitle")}</p>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-[13px] font-medium text-[#1a1a1a]">{t("reach.quotaAlerts")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {alerts.map((a) => {
              const pct = (a.consumed / a.annualQuota * 100).toFixed(1);
              const style = alertColors[a.alertLevel];
              return (
                <button
                  key={a.id}
                  onClick={() => setSelectedSubstance(a.id)}
                  className={cn(
                    "p-3 rounded-md border text-left transition-all duration-150",
                    style.bg, style.border,
                    selectedSubstance === a.id && "ring-1 ring-[#5e6ad2]"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className={cn("w-3.5 h-3.5", style.text)} />
                      <span className="font-medium text-[13px] text-[#1a1a1a]">{a.name}</span>
                    </div>
                    <span className={cn("text-[11px] font-medium px-1.5 py-0.5 rounded", style.bg, style.text)}>
                      {pct}%
                    </span>
                  </div>
                  <div className="mt-1.5 text-[11px] text-[#6b6b6b]">
                    {formatNumber(a.consumed, locale)} / {formatNumber(a.annualQuota, locale)} {a.unit}
                  </div>
                  <div className="w-full bg-white/60 rounded-full h-1 mt-1.5">
                    <div className="h-1 rounded-full" style={{ width: `${pct}%`, backgroundColor: alertColors[a.alertLevel].bar }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Substance Selector */}
      <div className="bg-white rounded-md border border-[#f0f0f0] p-4">
        <div className="flex gap-1.5 flex-wrap mb-4">
          {reachSubstances.map((s) => {
            const style = alertColors[s.alertLevel];
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSubstance(s.id)}
                className={cn(
                  "px-2.5 py-1 rounded text-[11px] font-medium transition-all duration-150 border",
                  selectedSubstance === s.id
                    ? "border-[#5e6ad2] bg-[#5e6ad2] text-white"
                    : cn("bg-white text-[#6b6b6b] hover:bg-[#f8f8f8]", style.border)
                )}
              >
                {s.name}
                {s.alertLevel !== "normal" && selectedSubstance !== s.id && (
                  <span className="ml-1 w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: style.bar }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Quota Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-5">
          <div className="bg-[#fafafa] rounded-md p-3 border border-[#f0f0f0]">
            <div className="text-[10px] font-medium text-[#a0a0a0] uppercase tracking-wider">{t("reach.substance")}</div>
            <div className="text-base font-semibold text-[#1a1a1a] mt-1">{substance.name}</div>
            <div className="text-[11px] text-[#a0a0a0] mt-0.5">CAS {substance.cas}</div>
          </div>
          <div className="bg-[#fafafa] rounded-md p-3 border border-[#f0f0f0]">
            <div className="text-[10px] font-medium text-[#a0a0a0] uppercase tracking-wider">{t("reach.annualQuota")}</div>
            <div className="text-base font-semibold text-[#1a1a1a] mt-1">{formatNumber(substance.annualQuota, locale)} {substance.unit}</div>
          </div>
          <div className={cn("rounded-md p-3 border", alertStyle.bg, alertStyle.border)}>
            <div className={cn("text-[10px] font-medium uppercase tracking-wider", alertStyle.text)}>{t("reach.consumed")}</div>
            <div className={cn("text-base font-semibold mt-1", alertStyle.text)}>{formatNumber(substance.consumed, locale)} {substance.unit}</div>
            <div className="text-[11px] text-[#6b6b6b] mt-0.5">{consumedPct}%</div>
          </div>
          <div className="bg-[#fafafa] rounded-md p-3 border border-[#f0f0f0]">
            <div className="text-[10px] font-medium text-[#a0a0a0] uppercase tracking-wider">{t("reach.remaining")}</div>
            <div className="text-base font-semibold text-[#1a1a1a] mt-1">{formatNumber(remaining, locale)} {substance.unit}</div>
            <div className="text-[11px] text-[#a0a0a0] mt-0.5">{(100 - parseFloat(consumedPct)).toFixed(1)}%</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-5">
          <div className="w-full bg-[#f0f0f0] rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${consumedPct}%`, backgroundColor: alertStyle.bar }}
            />
          </div>
        </div>

        {/* Monthly Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <h4 className="text-[13px] font-medium text-[#1a1a1a] mb-3">{t("reach.monthlyConsumption")}</h4>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={substance.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#a0a0a0" }} />
                <YAxis tick={{ fontSize: 10, fill: "#a0a0a0" }} />
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid #f0f0f0", boxShadow: "none" }}
                  formatter={(value: number) => [formatNumber(value, locale) + ` ${substance.unit}`, ""]}
                />
                <Bar dataKey="current" fill="#5e6ad2" radius={[3, 3, 0, 0]} name={locale === "en" ? "2026" : "2026"} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="text-[13px] font-medium text-[#1a1a1a] mb-3">{t("reach.yearComparison")}</h4>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={substance.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#a0a0a0" }} />
                <YAxis tick={{ fontSize: 10, fill: "#a0a0a0" }} />
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid #f0f0f0", boxShadow: "none" }}
                  formatter={(value: number) => [formatNumber(value, locale) + ` ${substance.unit}`, ""]}
                />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="current" stroke="#5e6ad2" strokeWidth={1.5} dot={{ r: 2.5 }} name={t("reach.currentYear") + " (2026)"} />
                <Line type="monotone" dataKey="previous" stroke="#d4d4d4" strokeWidth={1.5} dot={{ r: 2.5 }} strokeDasharray="5 5" name={t("reach.previousYear") + " (2025)"} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ECHA Database Connection */}
      <div className="bg-white rounded-md border border-[#f0f0f0] p-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-[#5e6ad2]" />
          <h3 className="text-[13px] font-medium text-[#1a1a1a]">{t("reach.echaConnection")}</h3>
          <span className="text-[10px] bg-[#ecfdf5] text-[#059669] px-1.5 py-0.5 rounded font-medium">
            {locale === "en" ? "Connected" : "Conectado"}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#f0f0f0]">
                <th className="text-left px-3 py-2 text-[11px] font-medium text-[#6b6b6b] uppercase tracking-wider">{t("reach.substance")}</th>
                <th className="text-left px-3 py-2 text-[11px] font-medium text-[#6b6b6b] uppercase tracking-wider">{t("reach.dossierLeader")}</th>
                <th className="text-left px-3 py-2 text-[11px] font-medium text-[#6b6b6b] uppercase tracking-wider">{t("reach.registrationStatus")}</th>
              </tr>
            </thead>
            <tbody>
              {echaData.map((row, i) => (
                <tr key={i} className="border-b border-[#f5f5f5] last:border-0 transition-colors duration-150 hover:bg-[#fafafa]">
                  <td className="px-3 py-2 text-[13px] font-medium text-[#1a1a1a]">{row.substance}</td>
                  <td className="px-3 py-2 text-[13px] text-[#6b6b6b]">{row.dossierLeader}</td>
                  <td className="px-3 py-2">
                    <span className={cn(
                      "text-[11px] font-medium px-2 py-0.5 rounded",
                      row.status === "Active" ? "bg-[#ecfdf5] text-[#059669]" : "bg-[#fefce8] text-[#ca8a04]"
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
