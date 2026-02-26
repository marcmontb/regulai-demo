"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { materials, questionnaireTemplates, questionnaireResponses } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  Sparkles, Loader2, CheckCircle2,
  Edit3, Download, AlertCircle,
} from "lucide-react";

const confidenceColor = (c: number) =>
  c >= 0.95 ? "text-[#059669] bg-[#ecfdf5]" : c >= 0.85 ? "text-[#ca8a04] bg-[#fefce8]" : "text-[#dc2626] bg-[#fef2f2]";

const confidenceBar = (c: number) =>
  c >= 0.95 ? "bg-[#059669]" : c >= 0.85 ? "bg-[#ca8a04]" : "bg-[#dc2626]";

export default function QuestionnairesPage() {
  const { t, locale } = useI18n();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [exported, setExported] = useState(false);

  const responseKey = selectedTemplate && selectedProduct ? `${selectedTemplate}-${selectedProduct}` : null;
  const responses = responseKey ? questionnaireResponses[responseKey] : null;

  const templateProducts: Record<string, string[]> = {
    TPL001: ["MAT001", "MAT002", "MAT006"],
    TPL002: ["MAT004", "MAT007"],
    TPL003: ["MAT005", "MAT008"],
  };

  const availableProducts = selectedTemplate ? materials.filter((m) => templateProducts[selectedTemplate]?.includes(m.id)) : [];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setShowResults(false);
    setExported(false);
    setEditedValues({});
    await new Promise((r) => setTimeout(r, 2500));
    setIsGenerating(false);
    setShowResults(true);
  };

  const avgConfidence = responses
    ? (responses.reduce((sum, r) => sum + r.confidence, 0) / responses.length * 100).toFixed(1)
    : "0";

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div>
        <h1 className="text-base font-medium text-[#1a1a1a] tracking-tight">{t("questionnaires.title")}</h1>
        <p className="text-[13px] text-[#6b6b6b] mt-0.5">{t("questionnaires.subtitle")}</p>
      </div>

      {/* Selection */}
      <div className="bg-white rounded-md border border-[#f0f0f0] p-4 space-y-4">
        <div>
          <label className="text-[11px] font-medium text-[#6b6b6b] uppercase tracking-wider block mb-2">{t("questionnaires.selectTemplate")}</label>
          <div className="flex gap-2 flex-wrap">
            {questionnaireTemplates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => { setSelectedTemplate(tpl.id); setSelectedProduct(null); setShowResults(false); setExported(false); }}
                className={cn(
                  "px-3 py-2 rounded-md border text-[13px] transition-all duration-150 text-left",
                  selectedTemplate === tpl.id
                    ? "border-[#5e6ad2] bg-[#eef2ff] text-[#5e6ad2] font-medium"
                    : "border-[#f0f0f0] bg-white text-[#6b6b6b] hover:border-[#e0e0e0] hover:bg-[#f8f8f8]"
                )}
              >
                <div className="font-medium">{tpl.name}</div>
                <div className="text-[11px] opacity-70 mt-0.5">{tpl.fields} {locale === "en" ? "fields" : "campos"}</div>
              </button>
            ))}
          </div>
        </div>

        {selectedTemplate && (
          <div>
            <label className="text-[11px] font-medium text-[#6b6b6b] uppercase tracking-wider block mb-2">{t("questionnaires.selectProduct")}</label>
            <div className="flex gap-2 flex-wrap">
              {availableProducts.map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => { setSelectedProduct(mat.id); setShowResults(false); setExported(false); }}
                  className={cn(
                    "px-3 py-2 rounded-md border text-[13px] transition-all duration-150",
                    selectedProduct === mat.id
                      ? "border-[#5e6ad2] bg-[#eef2ff] text-[#5e6ad2] font-medium"
                      : "border-[#f0f0f0] bg-white text-[#6b6b6b] hover:border-[#e0e0e0] hover:bg-[#f8f8f8]"
                  )}
                >
                  <div className="font-medium">{mat.name}</div>
                  <div className="text-[11px] opacity-70 mt-0.5">CAS {mat.cas}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedTemplate && selectedProduct && !showResults && (
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !responses}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#5e6ad2] text-white rounded-md text-[13px] font-medium hover:opacity-90 transition-all duration-150 disabled:opacity-70"
          >
            {isGenerating ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" />{t("questionnaires.generating")}</>
            ) : (
              <><Sparkles className="w-3.5 h-3.5" />{t("questionnaires.generate")}</>
            )}
          </button>
        )}

        {selectedTemplate && selectedProduct && !responses && !isGenerating && (
          <div className="flex items-center gap-1.5 text-[13px] text-[#a0a0a0]">
            <AlertCircle className="w-3.5 h-3.5" />
            {locale === "en" ? "No template data available for this combination" : "No hay datos disponibles para esta combinación"}
          </div>
        )}
      </div>

      {/* Results */}
      {showResults && responses && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[13px] font-medium text-[#1a1a1a]">{t("questionnaires.results")}</h2>
              <p className="text-[11px] text-[#a0a0a0] mt-0.5">
                {t("questionnaires.reviewNote")} — {locale === "en" ? "Avg. confidence" : "Confianza prom."}: {avgConfidence}%
              </p>
            </div>
            <button
              onClick={() => setExported(true)}
              disabled={exported}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-150",
                exported ? "bg-[#ecfdf5] text-[#059669] border border-[#dcfce7]" : "bg-[#5e6ad2] text-white hover:opacity-90"
              )}
            >
              {exported ? <><CheckCircle2 className="w-3.5 h-3.5" />PDF Exported</> : <><Download className="w-3.5 h-3.5" />{t("questionnaires.exportPdf")}</>}
            </button>
          </div>

          <div className="space-y-2">
            {responses.map((field, i) => {
              const isEditing = editingField === field.id;
              const displayValue = editedValues[field.id] ?? field.aiAnswer;
              return (
                <div key={field.id} className="bg-white rounded-md border border-[#f0f0f0] p-4 animate-fade-in transition-colors duration-150 hover:border-[#e0e0e0]" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-medium text-[#a0a0a0]">Q{i + 1}</span>
                        <h4 className="text-[13px] font-medium text-[#1a1a1a]">{field.question}</h4>
                      </div>

                      {isEditing ? (
                        <div className="mt-1.5">
                          <textarea
                            className="w-full border border-[#5e6ad2] rounded-md p-2.5 text-[13px] text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#5e6ad2]/30"
                            rows={3}
                            defaultValue={displayValue}
                            onBlur={(e) => {
                              setEditedValues((prev) => ({ ...prev, [field.id]: e.target.value }));
                              setEditingField(null);
                            }}
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div className="bg-[#eef2ff] border border-[#e0e7ff] rounded-md p-2.5 mt-1.5">
                          <div className="flex items-start gap-1.5">
                            <Sparkles className="w-3 h-3 text-[#5e6ad2] mt-0.5 shrink-0" />
                            <p className="text-[13px] text-[#1a1a1a]">{displayValue}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-[#a0a0a0]">{t("questionnaires.confidence")}:</span>
                          <span className={cn("text-[11px] font-medium px-1.5 py-0.5 rounded", confidenceColor(field.confidence))}>
                            {(field.confidence * 100).toFixed(0)}%
                          </span>
                          <div className="w-12 bg-[#f0f0f0] rounded-full h-1 ml-1">
                            <div className={cn("h-1 rounded-full transition-all duration-500", confidenceBar(field.confidence))} style={{ width: `${field.confidence * 100}%` }} />
                          </div>
                        </div>
                        <div className="text-[11px] text-[#a0a0a0]">
                          <span className="font-medium">{t("questionnaires.source")}:</span> {field.source}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setEditingField(isEditing ? null : field.id)}
                      className="text-[#a0a0a0] hover:text-[#5e6ad2] transition-colors duration-150 p-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
