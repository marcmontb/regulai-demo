"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { materials, homologationComparisons } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  AlertTriangle, CheckCircle2, XCircle,
  MinusCircle, Sparkles, Loader2,
  Leaf, Award, Scale,
} from "lucide-react";

const statusConfig = {
  unchanged: { icon: CheckCircle2, color: "text-[#059669]", bg: "bg-[#ecfdf5]", border: "border-[#dcfce7]" },
  changed: { icon: MinusCircle, color: "text-[#ca8a04]", bg: "bg-[#fefce8]", border: "border-[#fef3c7]" },
  out_of_spec: { icon: AlertTriangle, color: "text-[#dc2626]", bg: "bg-[#fef2f2]", border: "border-[#fee2e2]" },
  missing: { icon: XCircle, color: "text-[#dc2626]", bg: "bg-[#fef2f2]", border: "border-[#fee2e2]" },
};

const riskColors = {
  low: "bg-[#ecfdf5] text-[#059669]",
  medium: "bg-[#fefce8] text-[#ca8a04]",
  high: "bg-[#fef2f2] text-[#dc2626]",
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
    <div className="max-w-6xl mx-auto space-y-5">
      <div>
        <h1 className="text-base font-medium text-[#1a1a1a] tracking-tight">{t("homologation.title")}</h1>
        <p className="text-[13px] text-[#6b6b6b] mt-0.5">{t("homologation.subtitle")}</p>
      </div>

      {/* Material Selection */}
      <div className="bg-white rounded-md border border-[#f0f0f0] p-4">
        <label className="text-[11px] font-medium text-[#6b6b6b] uppercase tracking-wider block mb-2">
          {t("homologation.selectMaterial")}
        </label>
        <div className="flex gap-2 flex-wrap">
          {validMaterials.map((mat) => (
            <button
              key={mat.id}
              onClick={() => { setSelectedMaterial(mat.id); setShowResults(false); setActionMessage(null); }}
              className={cn(
                "px-3 py-2 rounded-md border text-[13px] transition-all duration-150",
                selectedMaterial === mat.id
                  ? "border-[#5e6ad2] bg-[#eef2ff] text-[#5e6ad2] font-medium"
                  : "border-[#f0f0f0] bg-white text-[#6b6b6b] hover:border-[#e0e0e0] hover:bg-[#f8f8f8]"
              )}
            >
              <div className="font-medium">{mat.name}</div>
              <div className="text-[11px] opacity-70 mt-0.5">CAS {mat.cas} — {mat.supplierName}</div>
            </button>
          ))}
        </div>

        {selectedMaterial && !showResults && (
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="mt-3 flex items-center gap-1.5 px-4 py-2 bg-[#5e6ad2] text-white rounded-md text-[13px] font-medium hover:opacity-90 transition-all duration-150 disabled:opacity-70"
          >
            {isAnalyzing ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" />{t("homologation.comparing")}</>
            ) : (
              <><Sparkles className="w-3.5 h-3.5" />{t("homologation.comparison")}</>
            )}
          </button>
        )}
      </div>

      {/* Results */}
      {showResults && selectedMaterial && (
        <div className="space-y-4 animate-fade-in">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-md border border-[#f0f0f0] p-3">
              <div className="text-[11px] font-medium text-[#6b6b6b] uppercase tracking-wider">{t("homologation.fieldsAnalyzed")}</div>
              <div className="text-xl font-semibold text-[#1a1a1a] mt-1">{comparison.length}</div>
            </div>
            <div className="bg-white rounded-md border border-[#fee2e2] p-3">
              <div className="text-[11px] font-medium text-[#dc2626] uppercase tracking-wider">{t("homologation.anomaliesDetected")}</div>
              <div className="text-xl font-semibold text-[#dc2626] mt-1">{anomalyCount}</div>
            </div>
            <div className="bg-white rounded-md border border-[#fef3c7] p-3">
              <div className="text-[11px] font-medium text-[#ca8a04] uppercase tracking-wider">{t("homologation.changed")}</div>
              <div className="text-xl font-semibold text-[#ca8a04] mt-1">{changedCount}</div>
            </div>
            <div className={cn(
              "bg-white rounded-md border p-3",
              overallScore >= 80 ? "border-[#dcfce7]" : overallScore >= 60 ? "border-[#fef3c7]" : "border-[#fee2e2]"
            )}>
              <div className="text-[11px] font-medium text-[#6b6b6b] uppercase tracking-wider">{t("homologation.overallScore")}</div>
              <div className={cn(
                "text-xl font-semibold mt-1",
                overallScore >= 80 ? "text-[#059669]" : overallScore >= 60 ? "text-[#ca8a04]" : "text-[#dc2626]"
              )}>{overallScore}/100</div>
            </div>
          </div>

          {/* Scoring */}
          <div className="bg-white rounded-md border border-[#f0f0f0] p-4">
            <h3 className="text-[13px] font-medium text-[#1a1a1a] mb-3">{t("homologation.scoring")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: t("homologation.sustainability"), score: scoringSustainability, icon: Leaf, color: "#059669" },
                { label: t("homologation.quality"), score: scoringQuality, icon: Award, color: scoringQuality >= 80 ? "#059669" : "#ca8a04" },
                { label: t("homologation.compliance"), score: scoringCompliance, icon: Scale, color: scoringCompliance >= 80 ? "#059669" : "#ca8a04" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#fafafa] flex items-center justify-center border border-[#f0f0f0]">
                    <item.icon className="w-4 h-4" style={{ color: item.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-[#6b6b6b]">{item.label}</span>
                      <span className="font-medium text-[#1a1a1a]">{item.score}/100</span>
                    </div>
                    <div className="w-full bg-[#f0f0f0] rounded-full h-1 mt-1.5">
                      <div
                        className="h-1 rounded-full transition-all duration-1000"
                        style={{ width: `${item.score}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterCategory("all")}
              className={cn(
                "px-2.5 py-1 rounded text-[11px] font-medium transition-all duration-150",
                filterCategory === "all" ? "bg-[#5e6ad2] text-white" : "bg-[#f5f5f5] text-[#6b6b6b] hover:bg-[#f0f0f0]"
              )}
            >
              {t("common.all")} ({comparison.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={cn(
                  "px-2.5 py-1 rounded text-[11px] font-medium transition-all duration-150",
                  filterCategory === cat ? "bg-[#5e6ad2] text-white" : "bg-[#f5f5f5] text-[#6b6b6b] hover:bg-[#f0f0f0]"
                )}
              >
                {cat} ({comparison.filter((c) => c.category === cat).length})
              </button>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-md border border-[#f0f0f0] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#fafafa] border-b border-[#f0f0f0]">
                    <th className="text-left px-3 py-2 text-[11px] font-medium text-[#6b6b6b] uppercase tracking-wider">{t("homologation.field")}</th>
                    <th className="text-left px-3 py-2 text-[11px] font-medium text-[#6b6b6b] uppercase tracking-wider">{t("homologation.previous")}</th>
                    <th className="text-left px-3 py-2 text-[11px] font-medium text-[#6b6b6b] uppercase tracking-wider">{t("homologation.current")}</th>
                    <th className="text-center px-3 py-2 text-[11px] font-medium text-[#6b6b6b] uppercase tracking-wider">{t("homologation.status")}</th>
                    <th className="text-center px-3 py-2 text-[11px] font-medium text-[#6b6b6b] uppercase tracking-wider">{t("homologation.riskLevel")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComparison.map((row, i) => {
                    const cfg = statusConfig[row.status];
                    const Icon = cfg.icon;
                    return (
                      <tr key={i} className="border-b border-[#f5f5f5] last:border-0 transition-colors duration-150 hover:bg-[#fafafa]">
                        <td className="px-3 py-2.5">
                          <div className="text-[13px] font-medium text-[#1a1a1a]">{row.field}</div>
                          <div className="text-[11px] text-[#a0a0a0]">{row.category}</div>
                          {row.expectedRange && <div className="text-[10px] text-[#a0a0a0] mt-0.5">Expected: {row.expectedRange}</div>}
                        </td>
                        <td className="px-3 py-2.5 text-[13px] text-[#6b6b6b]">{row.previousValue || "—"}</td>
                        <td className={cn(
                          "px-3 py-2.5 text-[13px] font-medium",
                          row.status === "out_of_spec" ? "text-[#dc2626]" : row.status === "changed" ? "text-[#ca8a04]" : row.status === "missing" ? "text-[#dc2626] italic" : "text-[#6b6b6b]"
                        )}>
                          {row.currentValue || (row.status === "missing" ? "MISSING" : "—")}
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium", cfg.bg, cfg.color)}>
                            <Icon className="w-3 h-3" />
                            {t(`homologation.${row.status === "out_of_spec" ? "outOfSpec" : row.status}`)}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          {row.riskLevel && (
                            <span className={cn("px-2 py-0.5 rounded text-[11px] font-medium", riskColors[row.riskLevel])}>
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
            <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-md p-3 flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#059669]" />
              <span className="text-[13px] text-[#166534] font-medium">{actionMessage}</span>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setActionMessage(t("homologation.approvedAction"))}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#059669] text-white rounded-md text-[13px] font-medium hover:opacity-90 transition-all duration-150"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t("homologation.approve")}
              </button>
              <button
                onClick={() => setActionMessage(t("homologation.incidentCreated"))}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#dc2626] text-white rounded-md text-[13px] font-medium hover:opacity-90 transition-all duration-150"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                {t("homologation.createIncident")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
