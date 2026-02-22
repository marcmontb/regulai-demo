"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { materials, homologationComparisons } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  ShieldCheck, AlertTriangle, CheckCircle2, XCircle,
  MinusCircle, Sparkles, Loader2, ChevronDown,
  Leaf, Award, Scale,
} from "lucide-react";

const statusConfig = {
  unchanged: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200" },
  changed: { icon: MinusCircle, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200" },
  out_of_spec: { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50", border: "border-red-200" },
  missing: { icon: XCircle, color: "text-red-500", bg: "bg-red-50", border: "border-red-200" },
};

const riskColors = {
  low: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

export default function HomologationPage() {
  const { t } = useI18n();
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const validMaterials = materials.filter((m) => homologationComparisons[m.id]);
  const comparison = selectedMaterial ? homologationComparisons[selectedMaterial] : [];
  const categories = [...new Set(comparison.map((c) => c.category))];
  const filteredComparison = filterCategory === "all"
    ? comparison
    : comparison.filter((c) => c.category === filterCategory);

  const anomalyCount = comparison.filter((c) => c.status === "out_of_spec" || c.status === "missing").length;
  const changedCount = comparison.filter((c) => c.status !== "unchanged").length;

  const scoringSustainability = 82;
  const scoringQuality = comparison.some((c) => c.status === "out_of_spec") ? 61 : 94;
  const scoringCompliance = comparison.some((c) => c.status === "missing") ? 70 : 96;
  const overallScore = Math.round((scoringSustainability + scoringQuality + scoringCompliance) / 3);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setShowResults(false);
    setActionMessage(null);
    await new Promise((r) => setTimeout(r, 2000));
    setIsAnalyzing(false);
    setShowResults(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-accent" />
          {t("homologation.title")}
        </h1>
        <p className="text-navy-500 mt-1">{t("homologation.subtitle")}</p>
      </div>

      {/* Material Selection */}
      <div className="bg-white rounded-xl border border-border p-5">
        <label className="text-sm font-medium text-navy-700 block mb-2">
          {t("homologation.selectMaterial")}
        </label>
        <div className="flex gap-3 flex-wrap">
          {validMaterials.map((mat) => (
            <button
              key={mat.id}
              onClick={() => { setSelectedMaterial(mat.id); setShowResults(false); setActionMessage(null); }}
              className={cn(
                "px-4 py-2.5 rounded-lg border text-sm transition-all",
                selectedMaterial === mat.id
                  ? "border-accent bg-accent/5 text-accent font-medium"
                  : "border-border bg-white text-navy-600 hover:border-navy-300"
              )}
            >
              <div className="font-medium">{mat.name}</div>
              <div className="text-xs text-navy-400 mt-0.5">CAS {mat.cas} — {mat.supplierName}</div>
            </button>
          ))}
        </div>

        {selectedMaterial && !showResults && (
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dark transition-colors disabled:opacity-70"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("homologation.comparing")}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {t("homologation.comparison")}
              </>
            )}
          </button>
        )}
      </div>

      {/* Results */}
      {showResults && selectedMaterial && (
        <div className="space-y-6 animate-fade-in">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-border p-4">
              <div className="text-sm text-navy-500">{t("homologation.fieldsAnalyzed")}</div>
              <div className="text-2xl font-bold text-navy-900 mt-1">{comparison.length}</div>
            </div>
            <div className="bg-white rounded-xl border border-red-200 p-4">
              <div className="text-sm text-red-500">{t("homologation.anomaliesDetected")}</div>
              <div className="text-2xl font-bold text-red-600 mt-1">{anomalyCount}</div>
            </div>
            <div className="bg-white rounded-xl border border-amber-200 p-4">
              <div className="text-sm text-amber-500">{t("homologation.changed")}</div>
              <div className="text-2xl font-bold text-amber-600 mt-1">{changedCount}</div>
            </div>
            <div className={cn(
              "bg-white rounded-xl border p-4",
              overallScore >= 80 ? "border-emerald-200" : overallScore >= 60 ? "border-amber-200" : "border-red-200"
            )}>
              <div className="text-sm text-navy-500">{t("homologation.overallScore")}</div>
              <div className={cn(
                "text-2xl font-bold mt-1",
                overallScore >= 80 ? "text-emerald-600" : overallScore >= 60 ? "text-amber-600" : "text-red-600"
              )}>{overallScore}/100</div>
            </div>
          </div>

          {/* Scoring */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-navy-800 mb-4">{t("homologation.scoring")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: t("homologation.sustainability"), score: scoringSustainability, icon: Leaf, color: "emerald" },
                { label: t("homologation.quality"), score: scoringQuality, icon: Award, color: scoringQuality >= 80 ? "emerald" : "amber" },
                { label: t("homologation.compliance"), score: scoringCompliance, icon: Scale, color: scoringCompliance >= 80 ? "emerald" : "amber" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg bg-${item.color}-50 flex items-center justify-center`}>
                    <item.icon className={`w-5 h-5 text-${item.color}-500`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-navy-600">{item.label}</span>
                      <span className="font-semibold text-navy-800">{item.score}/100</span>
                    </div>
                    <div className="w-full bg-navy-100 rounded-full h-2 mt-1.5">
                      <div
                        className={`h-2 rounded-full bg-${item.color}-500 transition-all duration-1000`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterCategory("all")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                filterCategory === "all" ? "bg-accent text-white" : "bg-white border border-border text-navy-600 hover:bg-surface-hover"
              )}
            >
              {t("common.all")} ({comparison.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  filterCategory === cat ? "bg-accent text-white" : "bg-white border border-border text-navy-600 hover:bg-surface-hover"
                )}
              >
                {cat} ({comparison.filter((c) => c.category === cat).length})
              </button>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-navy-50 border-b border-border">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-navy-600 uppercase tracking-wider">{t("homologation.field")}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-navy-600 uppercase tracking-wider">{t("homologation.previous")}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-navy-600 uppercase tracking-wider">{t("homologation.current")}</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-navy-600 uppercase tracking-wider">{t("homologation.status")}</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-navy-600 uppercase tracking-wider">{t("homologation.riskLevel")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComparison.map((row, i) => {
                    const cfg = statusConfig[row.status];
                    const Icon = cfg.icon;
                    return (
                      <tr key={i} className={cn("border-b border-border-light last:border-0 transition-colors", cfg.bg + "/30")}>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-navy-800">{row.field}</div>
                          <div className="text-xs text-navy-400">{row.category}</div>
                          {row.expectedRange && <div className="text-[10px] text-navy-300 mt-0.5">Expected: {row.expectedRange}</div>}
                        </td>
                        <td className="px-4 py-3 text-sm text-navy-600">{row.previousValue || "—"}</td>
                        <td className={cn(
                          "px-4 py-3 text-sm font-medium",
                          row.status === "out_of_spec" ? "text-red-600" : row.status === "changed" ? "text-amber-600" : row.status === "missing" ? "text-red-400 italic" : "text-navy-600"
                        )}>
                          {row.currentValue || (row.status === "missing" ? "MISSING" : "—")}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium", cfg.bg, cfg.color)}>
                            <Icon className="w-3 h-3" />
                            {t(`homologation.${row.status === "out_of_spec" ? "outOfSpec" : row.status}`)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {row.riskLevel && (
                            <span className={cn("px-2 py-1 rounded-full text-xs font-medium", riskColors[row.riskLevel])}>
                              {t(`homologation.${row.riskLevel}`)}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          {actionMessage ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="text-sm text-emerald-700 font-medium">{actionMessage}</span>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setActionMessage(t("homologation.approvedAction"))}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                {t("homologation.approve")}
              </button>
              <button
                onClick={() => setActionMessage(t("homologation.incidentCreated"))}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
                {t("homologation.createIncident")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
