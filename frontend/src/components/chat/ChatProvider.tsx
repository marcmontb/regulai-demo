"use client";

import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";
import { getMockResponse, type AgenticResponse, type ToolCall } from "@/lib/mock-chat";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  sources?: string[];
  steps?: ToolCall[];
  navigateTo?: string;
  timestamp: Date;
}

interface ChatContextValue {
  messages: ChatMessage[];
  isTyping: boolean;
  currentStepIndex: number | null;
  completedSteps: ToolCall[];
  pendingSteps: ToolCall[];
  pendingNavigateTo: string | null;
  sendMessage: (text: string) => void;
  clearMessages: () => void;
  clearPendingNavigation: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

let msgCounter = 0;
function nextId() {
  return `msg-${++msgCounter}-${Date.now()}`;
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<ToolCall[]>([]);
  const [pendingSteps, setPendingSteps] = useState<ToolCall[]>([]);
  const [pendingNavigateTo, setPendingNavigateTo] = useState<string | null>(null);
  const abortRef = useRef(false);

  const clearPendingNavigation = useCallback(() => {
    setPendingNavigateTo(null);
  }, []);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    abortRef.current = false;

    const userMsg: ChatMessage = {
      id: nextId(),
      role: "user",
      text: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setCompletedSteps([]);
    setPendingSteps([]);
    setPendingNavigateTo(null);

    const response: AgenticResponse = getMockResponse(trimmed);
    const steps = response.steps ?? [];

    if (steps.length === 0) {
      setCurrentStepIndex(null);
      const aiMsg: ChatMessage = {
        id: nextId(),
        role: "assistant",
        text: response.text,
        sources: response.sources,
        steps: [],
        navigateTo: response.navigateTo,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      if (response.navigateTo) setPendingNavigateTo(response.navigateTo);
      return;
    }

    setPendingSteps([...steps]);
    setCurrentStepIndex(0);

    let stepIndex = 0;

    function runNextStep() {
      if (abortRef.current || stepIndex >= steps.length) {
        setCurrentStepIndex(null);
        const aiMsg: ChatMessage = {
          id: nextId(),
          role: "assistant",
          text: response.text,
          sources: response.sources,
          steps: [...steps],
          navigateTo: response.navigateTo,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
        setCompletedSteps([]);
        setPendingSteps([]);
        if (response.navigateTo) setPendingNavigateTo(response.navigateTo);
        return;
      }

      const step = steps[stepIndex];
      const duration = Math.min(step.duration, 1200);

      setTimeout(() => {
        if (abortRef.current) return;
        setCompletedSteps((prev) => [...prev, step]);
        stepIndex += 1;
        setCurrentStepIndex(stepIndex < steps.length ? stepIndex : null);
        if (stepIndex < steps.length) {
          runNextStep();
        } else {
          setCurrentStepIndex(null);
          const aiMsg: ChatMessage = {
            id: nextId(),
            role: "assistant",
            text: response.text,
            sources: response.sources,
            steps: [...steps],
            navigateTo: response.navigateTo,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiMsg]);
          setIsTyping(false);
          setCompletedSteps([]);
          setPendingSteps([]);
          if (response.navigateTo) setPendingNavigateTo(response.navigateTo);
        }
      }, duration);
    }

    runNextStep();
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentStepIndex(null);
    setCompletedSteps([]);
    setPendingSteps([]);
    setPendingNavigateTo(null);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        isTyping,
        currentStepIndex,
        completedSteps,
        pendingSteps,
        pendingNavigateTo,
        sendMessage,
        clearMessages,
        clearPendingNavigation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
