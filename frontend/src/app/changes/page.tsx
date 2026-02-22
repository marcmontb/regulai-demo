"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { changeRecords } from "@/lib/mock-data";
import { cn, formatDate } from "@/lib/utils";
import {
  Bell, AlertTriangle, CheckCircle2, Clock, Eye,
  Send, FileText, Users, ChevronRight, X,
  Sparkles, Loader2, Mail,
} from "lucide-react";

const typeConfig = {
  regulatory: { color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  specification: { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  supplier: { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  formulation: { color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
};

const statusConfig = {
  detected: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50" },
  under_review: { icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
  notified: { icon: Send, color: "text-emerald-500", bg: "bg-emerald-50" },
  completed: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
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
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
          <Bell className="w-6 h-6 text-accent" />
          {t("changes.title")}
        </h1>
        <p className="text-navy-500 mt-1">{t("changes.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Change Log */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="font-semibold text-navy-800">{t("changes.changeLog")}</h3>
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
                  "w-full text-left p-4 rounded-xl border transition-all",
                  selectedChange === change.id
                    ? "border-accent bg-accent/5 shadow-sm"
                    : "border-border bg-white hover:border-navy-300 hover:shadow-sm"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full uppercase", type.bg, type.color)}>
                        {t(`changes.${change.type}`)}
                      </span>
                      <span className={cn("flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full", status.bg, status.color)}>
                        <StatusIcon className="w-3 h-3" />
                        {isSent ? t("changes.notified") : t(`changes.${change.status === "under_review" ? "underReview" : change.status}`)}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-navy-800 line-clamp-2">{change.title}</h4>
                    <p className="text-xs text-navy-400 mt-1">{formatDate(change.date, locale)}</p>
                  </div>
                  <ChevronRight className={cn("w-4 h-4 shrink-0 mt-1 transition-colors", selectedChange === change.id ? "text-accent" : "text-navy-300")} />
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs text-navy-400">
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
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white rounded-xl border border-border p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full uppercase", typeConfig[selected.type].bg, typeConfig[selected.type].color)}>
                    {t(`changes.${selected.type}`)}
                  </span>
                  <span className="text-xs text-navy-400">{formatDate(selected.date, locale)}</span>
                </div>
                <h2 className="text-lg font-bold text-navy-900">{selected.title}</h2>
                <p className="text-sm text-navy-600 mt-2">{selected.description}</p>
              </div>

              {/* Affected Clients */}
              <div className="bg-white rounded-xl border border-border p-5">
                <h3 className="font-semibold text-navy-800 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-navy-500" />
                  {t("changes.affectedClients")} ({selected.affectedClients.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-navy-50 border-b border-border">
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-navy-600">{t("changes.client")}</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-navy-600">{t("changes.products")}</th>
                        <th className="text-center px-4 py-2.5 text-xs font-semibold text-navy-600">{t("changes.notificationStatus")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.affectedClients.map((client, i) => {
                        const notified = client.notified || sentChanges.has(selected.id);
                        return (
                          <tr key={i} className="border-b border-border-light last:border-0">
                            <td className="px-4 py-2.5 text-sm font-medium text-navy-800">{client.name}</td>
                            <td className="px-4 py-2.5">
                              <div className="flex flex-wrap gap-1">
                                {client.products.map((p, j) => (
                                  <span key={j} className="text-xs bg-navy-50 text-navy-600 px-2 py-0.5 rounded-full">{p}</span>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-2.5 text-center">
                              <span className={cn(
                                "inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                                notified ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
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
                <div className="flex gap-3 mt-4 pt-4 border-t border-border">
                  <button
                    onClick={() => setShowEmailPreview(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    {t("changes.previewEmail")}
                  </button>
                  {!sentChanges.has(selected.id) && (
                    <button
                      onClick={handleSendNotification}
                      disabled={sendingNotification}
                      className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dark transition-colors disabled:opacity-70"
                    >
                      {sendingNotification ? (
                        <><Loader2 className="w-4 h-4 animate-spin" />{locale === "en" ? "Sending..." : "Enviando..."}</>
                      ) : (
                        <><Send className="w-4 h-4" />{t("changes.sendNotification")}</>
                      )}
                    </button>
                  )}
                  {sentChanges.has(selected.id) && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" />
                      {t("changes.notificationSent")}
                    </div>
                  )}
                </div>
              </div>

              {/* Email Preview Modal */}
              {showEmailPreview && selected.aiDraftEmail && (
                <div className="bg-white rounded-xl border border-accent/30 p-5 animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-accent" />
                      <h3 className="font-semibold text-navy-800">{t("changes.emailDraft")}</h3>
                    </div>
                    <button onClick={() => setShowEmailPreview(false)} className="text-navy-400 hover:text-navy-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="bg-navy-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-navy-500 w-16">{t("changes.to")}:</span>
                      <span className="text-navy-700">{selected.affectedClients.map((c) => c.name).join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-navy-500 w-16">{t("changes.subject")}:</span>
                      <span className="text-navy-700">{selected.title}</span>
                    </div>
                    <div className="border-t border-border pt-3">
                      <pre className="text-sm text-navy-700 whitespace-pre-wrap font-sans leading-relaxed">
                        {selected.aiDraftEmail}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-border p-12 text-center">
              <Mail className="w-12 h-12 text-navy-200 mx-auto mb-3" />
              <p className="text-navy-400 text-sm">
                {locale === "en" ? "Select a change record to view details" : "Selecciona un registro de cambio para ver los detalles"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
