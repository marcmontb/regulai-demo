"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { changeRecords } from "@/lib/mock-data";
import { cn, formatDate } from "@/lib/utils";
import {
  AlertTriangle, CheckCircle2, Clock, Eye,
  Send, Users, ChevronRight, X,
  Sparkles, Loader2, Mail,
} from "lucide-react";

const typeConfig = {
  regulatory: { color: "text-[#dc2626]", bg: "bg-[#fef2f2]", border: "border-[#fee2e2]" },
  specification: { color: "text-[#ca8a04]", bg: "bg-[#fefce8]", border: "border-[#fef3c7]" },
  supplier: { color: "text-[#5e6ad2]", bg: "bg-[#eef2ff]", border: "border-[#e0e7ff]" },
  formulation: { color: "text-[#7c3aed]", bg: "bg-[#f5f3ff]", border: "border-[#ede9fe]" },
};

const statusConfig = {
  detected: { icon: AlertTriangle, color: "text-[#ca8a04]", bg: "bg-[#fefce8]" },
  under_review: { icon: Clock, color: "text-[#5e6ad2]", bg: "bg-[#eef2ff]" },
  notified: { icon: Send, color: "text-[#059669]", bg: "bg-[#ecfdf5]" },
  completed: { icon: CheckCircle2, color: "text-[#059669]", bg: "bg-[#ecfdf5]" },
};

export default function ChangesPage() {
  const { t, locale } = useI18n();
  const [selectedChange, setSelectedChange] = useState<string | null>(null);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [sendingNotification, setSendingNotification] = useState(false);
  const [sentChanges, setSentChanges] = useState<Set<string>>(new Set());

  const selected = changeRecords.find((c) => c.id === selectedChange);

  const handleSendNotification = async () => {
    if (!selectedChange) return;
    setSendingNotification(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSendingNotification(false);
    setSentChanges((prev) => new Set(prev).add(selectedChange));
    setShowEmailPreview(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div>
        <h1 className="text-base font-medium text-[#1a1a1a] tracking-tight">{t("changes.title")}</h1>
        <p className="text-[13px] text-[#6b6b6b] mt-0.5">{t("changes.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Change Log */}
        <div className="lg:col-span-1 space-y-2">
          <h3 className="text-[13px] font-medium text-[#1a1a1a]">{t("changes.changeLog")}</h3>
          {changeRecords.map((change) => {
            const type = typeConfig[change.type];
            const status = statusConfig[change.status];
            const StatusIcon = status.icon;
            const isSent = sentChanges.has(change.id);
            return (
              <button
                key={change.id}
                onClick={() => { setSelectedChange(change.id); setShowEmailPreview(false); }}
                className={cn(
                  "w-full text-left p-3 rounded-md border transition-all duration-150",
                  selectedChange === change.id
                    ? "border-[#5e6ad2] bg-[#eef2ff]"
                    : "border-[#f0f0f0] bg-white hover:border-[#e0e0e0] hover:bg-[#f8f8f8]"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded uppercase", type.bg, type.color)}>
                        {t(`changes.${change.type}`)}
                      </span>
                      <span className={cn("flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded", status.bg, status.color)}>
                        <StatusIcon className="w-2.5 h-2.5" />
                        {isSent ? t("changes.notified") : t(`changes.${change.status === "under_review" ? "underReview" : change.status}`)}
                      </span>
                    </div>
                    <h4 className="text-[13px] font-medium text-[#1a1a1a] line-clamp-2">{change.title}</h4>
                    <p className="text-[11px] text-[#a0a0a0] mt-0.5">{formatDate(change.date, locale)}</p>
                  </div>
                  <ChevronRight className={cn("w-3.5 h-3.5 shrink-0 mt-1 transition-colors duration-150", selectedChange === change.id ? "text-[#5e6ad2]" : "text-[#d4d4d4]")} />
                </div>
                <div className="flex items-center gap-1 mt-1.5 text-[11px] text-[#a0a0a0]">
                  <Users className="w-3 h-3" />
                  {change.affectedClients.length} {locale === "en" ? "affected clients" : "clientes afectados"}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail View */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="space-y-3 animate-fade-in">
              <div className="bg-white rounded-md border border-[#f0f0f0] p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={cn("text-[11px] font-medium px-1.5 py-0.5 rounded uppercase", typeConfig[selected.type].bg, typeConfig[selected.type].color)}>
                    {t(`changes.${selected.type}`)}
                  </span>
                  <span className="text-[11px] text-[#a0a0a0]">{formatDate(selected.date, locale)}</span>
                </div>
                <h2 className="text-base font-medium text-[#1a1a1a]">{selected.title}</h2>
                <p className="text-[13px] text-[#6b6b6b] mt-1.5">{selected.description}</p>
              </div>

              {/* Affected Clients */}
              <div className="bg-white rounded-md border border-[#f0f0f0] p-4">
                <h3 className="text-[13px] font-medium text-[#1a1a1a] mb-3 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#6b6b6b]" />
                  {t("changes.affectedClients")} ({selected.affectedClients.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#fafafa] border-b border-[#f0f0f0]">
                        <th className="text-left px-3 py-2 text-[11px] font-medium text-[#6b6b6b] uppercase tracking-wider">{t("changes.client")}</th>
                        <th className="text-left px-3 py-2 text-[11px] font-medium text-[#6b6b6b] uppercase tracking-wider">{t("changes.products")}</th>
                        <th className="text-center px-3 py-2 text-[11px] font-medium text-[#6b6b6b] uppercase tracking-wider">{t("changes.notificationStatus")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.affectedClients.map((client, i) => {
                        const notified = client.notified || sentChanges.has(selected.id);
                        return (
                          <tr key={i} className="border-b border-[#f5f5f5] last:border-0 transition-colors duration-150 hover:bg-[#fafafa]">
                            <td className="px-3 py-2 text-[13px] font-medium text-[#1a1a1a]">{client.name}</td>
                            <td className="px-3 py-2">
                              <div className="flex flex-wrap gap-1">
                                {client.products.map((p, j) => (
                                  <span key={j} className="text-[11px] bg-[#f5f5f5] text-[#6b6b6b] px-1.5 py-0.5 rounded">{p}</span>
                                ))}
                              </div>
                            </td>
                            <td className="px-3 py-2 text-center">
                              <span className={cn(
                                "inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded",
                                notified ? "bg-[#ecfdf5] text-[#059669]" : "bg-[#fefce8] text-[#ca8a04]"
                              )}>
                                {notified ? <><CheckCircle2 className="w-3 h-3" />{t("changes.sent")}</> : <><Clock className="w-3 h-3" />{t("changes.pending")}</>}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-[#f0f0f0]">
                  <button
                    onClick={() => setShowEmailPreview(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5e6ad2] text-white rounded-md text-[13px] font-medium hover:opacity-90 transition-all duration-150"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {t("changes.previewEmail")}
                  </button>
                  {!sentChanges.has(selected.id) && (
                    <button
                      onClick={handleSendNotification}
                      disabled={sendingNotification}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-[#e8e8e8] bg-white text-[#1a1a1a] rounded-md text-[13px] font-medium hover:bg-[#f8f8f8] hover:border-[#d4d4d4] transition-all duration-150 disabled:opacity-70"
                    >
                      {sendingNotification ? (
                        <><Loader2 className="w-3.5 h-3.5 animate-spin" />{locale === "en" ? "Sending..." : "Enviando..."}</>
                      ) : (
                        <><Send className="w-3.5 h-3.5" />{t("changes.sendNotification")}</>
                      )}
                    </button>
                  )}
                  {sentChanges.has(selected.id) && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ecfdf5] text-[#059669] rounded-md text-[13px] font-medium border border-[#dcfce7]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {t("changes.notificationSent")}
                    </div>
                  )}
                </div>
              </div>

              {/* Email Preview */}
              {showEmailPreview && selected.aiDraftEmail && (
                <div className="bg-white rounded-md border border-[#e0e7ff] p-4 animate-fade-in">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#5e6ad2]" />
                      <h3 className="text-[13px] font-medium text-[#1a1a1a]">{t("changes.emailDraft")}</h3>
                    </div>
                    <button onClick={() => setShowEmailPreview(false)} className="text-[#a0a0a0] hover:text-[#6b6b6b] transition-colors duration-150">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="bg-[#fafafa] rounded-md p-3 border border-[#f0f0f0] space-y-2">
                    <div className="flex items-center gap-2 text-[13px]">
                      <span className="font-medium text-[#6b6b6b] w-14">{t("changes.to")}:</span>
                      <span className="text-[#1a1a1a]">{selected.affectedClients.map((c) => c.name).join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[13px]">
                      <span className="font-medium text-[#6b6b6b] w-14">{t("changes.subject")}:</span>
                      <span className="text-[#1a1a1a]">{selected.title}</span>
                    </div>
                    <div className="border-t border-[#f0f0f0] pt-2">
                      <pre className="text-[13px] text-[#1a1a1a] whitespace-pre-wrap font-[inherit] leading-relaxed">
                        {selected.aiDraftEmail}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-md border border-[#f0f0f0] p-10 text-center">
              <Mail className="w-10 h-10 text-[#e8e8e8] mx-auto mb-2" />
              <p className="text-[13px] text-[#a0a0a0]">
                {locale === "en" ? "Select a change record to view details" : "Selecciona un registro de cambio para ver los detalles"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
