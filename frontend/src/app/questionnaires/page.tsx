"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { materials, questionnaireTemplates, questionnaireResponses } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  FileQuestion, Sparkles, Loader2, CheckCircle2,
  Edit3, Download, AlertCircle, ChevronDown,
} from "lucide-react";

const confidenceColor = (c: number) =>
  c >= 0.95 ? "text-emerald-600 bg-emerald-50" : c >= 0.85 ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50";

const confidenceBar = (c: number) =>
  c >= 0.95 ? "bg-emerald-500" : c >= 0.85 ? "bg-amber-500" : "bg-red-500";

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
    TPL001: ["MAT001", "MAT005", "MAT006"],
    TPL002: ["MAT004", "MAT007"],
    TPL003: ["MAT001", "MAT002", "MAT003"],
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
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
          <FileQuestion className="w-6 h-6 text-accent" />
          {t("questionnaires.title")}
        </h1>
        <p className="text-navy-500 mt-1">{t("questionnaires.subtitle")}</p>
      </div>

      {/* Selection */}
      <div className="bg-white rounded-xl border border-border p-5 space-y-4">
        <div>
          <label className="text-sm font-medium text-navy-700 block mb-2">{t("questionnaires.selectTemplate")}</label>
          <div className="flex gap-3 flex-wrap">
            {questionnaireTemplates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => { setSelectedTemplate(tpl.id); setSelectedProduct(null); setShowResults(false); setExported(false); }}
                className={cn(
                  "px-4 py-2.5 rounded-lg border text-sm transition-all text-left",
                  selectedTemplate === tpl.id
                    ? "border-accent bg-accent/5 text-accent font-medium"
                    : "border-border bg-white text-navy-600 hover:border-navy-300"
                )}
              >
                <div className="font-medium">{tpl.name}</div>
                <div className="text-xs text-navy-400 mt-0.5">{tpl.fields} {locale === "en" ? "fields" : "campos"}</div>
              </button>
            ))}
          </div>
        </div>

        {selectedTemplate && (
          <div>
            <label className="text-sm font-medium text-navy-700 block mb-2">{t("questionnaires.selectProduct")}</label>
            <div className="flex gap-3 flex-wrap">
              {availableProducts.map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => { setSelectedProduct(mat.id); setShowResults(false); setExported(false); }}
                  className={cn(
                    "px-4 py-2.5 rounded-lg border text-sm transition-all",
                    selectedProduct === mat.id
                      ? "border-accent bg-accent/5 text-accent font-medium"
                      : "border-border bg-white text-navy-600 hover:border-navy-300"
                  )}
                >
                  <div className="font-medium">{mat.name}</div>
                  <div className="text-xs text-navy-400 mt-0.5">CAS {mat.cas}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedTemplate && selectedProduct && !showResults && (
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !responses}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dark transition-colors disabled:opacity-70"
          >
            {isGenerating ? (
              <><Loader2 className="w-4 h-4 animate-spin" />{t("questionnaires.generating")}</>
            ) : (
              <><Sparkles className="w-4 h-4" />{t("questionnaires.generate")}</>
            )}
          </button>
        )}

        {selectedTemplate && selectedProduct && !responses && !isGenerating && (
          <div className="flex items-center gap-2 text-sm text-navy-400">
            <AlertCircle className="w-4 h-4" />
            {locale === "en" ? "No template data available for this combination" : "No hay datos disponibles para esta combinación"}
          </div>
        )}
      </div>

      {/* Results */}
      {showResults && responses && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-navy-800">{t("questionnaires.results")}</h2>
              <p className="text-xs text-navy-400 mt-0.5">
                {t("questionnaires.reviewNote")} — {locale === "en" ? "Avg. confidence" : "Confianza prom."}: {avgConfidence}%
              </p>
            </div>
            <button
              onClick={() => setExported(true)}
              disabled={exported}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                exported ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-primary text-white hover:bg-primary-dark"
              )}
            >
              {exported ? <><CheckCircle2 className="w-4 h-4" />PDF Exported</> : <><Download className="w-4 h-4" />{t("questionnaires.exportPdf")}</>}
            </button>
          </div>

          <div className="space-y-3">
            {responses.map((field, i) => {
              const isEditing = editingField === field.id;
              const displayValue = editedValues[field.id] ?? field.aiAnswer;
              return (
                <div key={field.id} className="bg-white rounded-xl border border-border p-5 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-navy-400">Q{i + 1}</span>
                        <h4 className="text-sm font-medium text-navy-800">{field.question}</h4>
                      </div>

                      {isEditing ? (
                        <div className="mt-2">
                          <textarea
                            className="w-full border border-accent rounded-lg p-3 text-sm text-navy-700 focus:outline-none focus:ring-2 focus:ring-accent/30"
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
                        <div className="bg-accent/5 border border-accent/20 rounded-lg p-3 mt-2">
                          <div className="flex items-start gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                            <p className="text-sm text-navy-700">{displayValue}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4 mt-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-navy-400">{t("questionnaires.confidence")}:</span>
                          <span className={cn("text-xs font-medium px-1.5 py-0.5 rounded", confidenceColor(field.confidence))}>
                            {(field.confidence * 100).toFixed(0)}%
                          </span>
                          <div className="w-16 bg-navy-100 rounded-full h-1.5 ml-1">
                            <div className={cn("h-1.5 rounded-full transition-all duration-500", confidenceBar(field.confidence))} style={{ width: `${field.confidence * 100}%` }} />
                          </div>
                        </div>
                        <div className="text-xs text-navy-400">
                          <span className="font-medium">{t("questionnaires.source")}:</span> {field.source}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setEditingField(isEditing ? null : field.id)}
                      className="text-navy-400 hover:text-accent transition-colors p-1"
                    >
                      <Edit3 className="w-4 h-4" />
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
