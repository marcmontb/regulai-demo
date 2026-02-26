"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "./ChatProvider";
import { useSidePanel } from "./SidePanelProvider";
import { useI18n } from "@/lib/i18n";
import { Send, X, Loader2, Check, ChevronDown, ChevronRight } from "lucide-react";
import type { ToolCall } from "@/lib/mock-chat";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const result: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  function flushTable() {
    if (tableRows.length === 0) return;
    const headers = tableRows[0];
    const dataRows = tableRows.slice(2);
    result.push(
      <div key={`table-${result.length}`} className="overflow-x-auto my-1.5">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="bg-[#fafafa] border-b border-[#f0f0f0]">
              {headers.map((h, i) => (
                <th key={i} className="text-left px-2 py-1 font-medium text-[#6b6b6b]">{h.trim()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, ri) => (
              <tr key={ri} className="border-b border-[#f5f5f5]">
                {row.map((cell, ci) => (
                  <td key={ci} className="px-2 py-1 text-[#1a1a1a]">{cell.trim()}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
    inTable = false;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      const cells = line.split("|").filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      if (cells.every((c) => /^[\s-:]+$/.test(c))) {
        tableRows.push(cells);
        inTable = true;
        continue;
      }
      tableRows.push(cells);
      inTable = true;
      continue;
    } else if (inTable) {
      flushTable();
    }
    if (line.trim() === "") {
      result.push(<br key={`br-${i}`} />);
      continue;
    }
    const processed = line
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-medium">$1</strong>')
      .replace(/⚠️/g, '<span class="text-[#ca8a04]">⚠️</span>')
      .replace(/✅/g, '<span class="text-[#059669]">✅</span>')
      .replace(/🔴/g, '<span class="text-[#dc2626]">🔴</span>')
      .replace(/🔄/g, '<span class="text-[#5e6ad2]">🔄</span>')
      .replace(/❌/g, '<span class="text-[#dc2626]">❌</span>');
    if (/^\d+\./.test(line.trim())) {
      result.push(<p key={`p-${i}`} className="ml-3 text-[12px] leading-relaxed" dangerouslySetInnerHTML={{ __html: processed }} />);
    } else if (line.trim().startsWith("- ")) {
      result.push(<p key={`p-${i}`} className="ml-2 text-[12px] leading-relaxed" dangerouslySetInnerHTML={{ __html: "• " + processed.replace(/^- /, "") }} />);
    } else {
      result.push(<p key={`p-${i}`} className="text-[12px] leading-relaxed" dangerouslySetInnerHTML={{ __html: processed }} />);
    }
  }
  if (inTable) flushTable();
  return result;
}

function StepRow({ step, isActive, isDone }: { step: ToolCall; isActive: boolean; isDone: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const hasResult = !!step.result;

  return (
    <div className="border-b border-[#f0f0f0] last:border-0">
      <button
        type="button"
        onClick={() => hasResult && setExpanded((e) => !e)}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2 text-left transition-colors duration-150",
          hasResult ? "hover:bg-[#fafafa]" : "cursor-default"
        )}
      >
        {isDone ? (
          <Check className="w-4 h-4 text-[#059669] shrink-0" />
        ) : isActive ? (
          <Loader2 className="w-4 h-4 text-[#5e6ad2] shrink-0 animate-spin" />
        ) : (
          <div className="w-4 h-4 shrink-0 rounded-full border-2 border-[#e0e0e0]" />
        )}
        <span className="text-[12px] text-[#1a1a1a] flex-1">{step.label}</span>
        {hasResult && (expanded ? <ChevronDown className="w-3.5 h-3.5 text-[#a0a0a0]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#a0a0a0]" />)}
      </button>
      {hasResult && expanded && (
        <div className="px-3 pb-2 pl-9">
          <p className="text-[11px] text-[#6b6b6b] bg-[#fafafa] border border-[#f0f0f0] rounded-md px-2 py-1.5">{step.result}</p>
        </div>
      )}
    </div>
  );
}

export default function AISidePanel() {
  const { isOpen, close } = useSidePanel();
  const { messages, isTyping, currentStepIndex, completedSteps, pendingSteps, pendingNavigateTo, sendMessage, clearPendingNavigation } = useChat();
  const { t } = useI18n();
  const router = useRouter();
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, currentStepIndex, completedSteps]);

  useEffect(() => {
    if (pendingNavigateTo) {
      router.push(pendingNavigateTo);
      clearPendingNavigation();
    }
  }, [pendingNavigateTo, router, clearPendingNavigation]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    sendMessage(input);
    setInput("");
  };

  const activeSteps = pendingSteps;

  return (
    <div
      className={cn(
        "fixed top-0 right-0 h-full w-[400px] bg-white border-l border-[#f0f0f0] flex flex-col z-50 shadow-lg transition-transform duration-200 ease-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#f0f0f0] bg-[#fafbfc]">
        <span className="text-[13px] font-medium text-[#1a1a1a]">{t("chat.title")}</span>
        <button
          type="button"
          onClick={close}
          className="w-8 h-8 rounded-md flex items-center justify-center text-[#a0a0a0] hover:text-[#6b6b6b] hover:bg-[#f0f0f0] transition-colors duration-150"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
        <div className="flex-1 px-3 py-3 space-y-3">
          {messages.length === 0 && !isTyping && (
            <div className="flex items-center justify-center h-full">
              <p className="text-[13px] text-[#a0a0a0] text-center max-w-[260px]">{t("chat.subtitle")}</p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}>
              {msg.role === "user" ? (
                <div className="max-w-[85%] rounded-md px-3 py-2 bg-[#5e6ad2] text-white">
                  <p className="text-[12px]">{msg.text}</p>
                </div>
              ) : (
                <div className="max-w-[95%] rounded-md border border-[#f0f0f0] bg-[#fafafa] overflow-hidden">
                  {msg.steps && msg.steps.length > 0 && (
                    <div className="border-b border-[#f0f0f0] bg-white">
                      {msg.steps.map((step, idx) => (
                        <StepRow key={idx} step={step} isActive={false} isDone={true} />
                      ))}
                    </div>
                  )}
                  <div className="p-3 space-y-0.5">
                    {renderMarkdown(msg.text)}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-[#f0f0f0]">
                        {msg.sources.map((s, i) => (
                          <span key={i} className="text-[9px] font-medium bg-[#eef2ff] text-[#5e6ad2] px-1.5 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isTyping && (currentStepIndex !== null || completedSteps.length > 0) && (
            <div className="flex justify-start">
              <div className="max-w-[95%] rounded-md border border-[#f0f0f0] bg-[#fafafa] overflow-hidden w-full">
                <div className="bg-white border-b border-[#f0f0f0]">
                  {completedSteps.map((step, idx) => (
                    <StepRow key={`done-${idx}`} step={step} isActive={false} isDone={true} />
                  ))}
                  {currentStepIndex !== null && activeSteps[currentStepIndex] && (
                    <StepRow key="active" step={activeSteps[currentStepIndex]} isActive={true} isDone={false} />
                  )}
                </div>
                <div className="px-3 py-2 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 text-[#5e6ad2] animate-spin" />
                  <span className="text-[11px] text-[#6b6b6b]">{t("chat.typing")}</span>
                </div>
              </div>
            </div>
          )}

          {isTyping && currentStepIndex === null && completedSteps.length === 0 && (
            <div className="flex justify-start">
              <div className="rounded-md border border-[#f0f0f0] bg-[#fafafa] px-3 py-2 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 text-[#5e6ad2] animate-spin" />
                <span className="text-[11px] text-[#6b6b6b]">{t("chat.typing")}</span>
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>

        <div className="border-t border-[#f0f0f0] px-3 py-2 bg-white">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
              placeholder={t("chat.placeholder")}
              disabled={isTyping}
              className="flex-1 text-[13px] bg-transparent outline-none placeholder:text-[#a0a0a0] text-[#1a1a1a] disabled:opacity-50"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="w-8 h-8 rounded-md bg-[#5e6ad2] text-white flex items-center justify-center hover:opacity-90 transition-all duration-150 disabled:opacity-30"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
