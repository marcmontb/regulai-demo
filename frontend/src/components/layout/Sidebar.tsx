"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { useSidePanel } from "@/components/chat/SidePanelProvider";
import { useSidebar } from "./SidebarProvider";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, ShieldCheck, FileQuestion, GitBranch,
  Beaker, Bell, Database, Users, FileText, Wheat, Sparkles,
  PanelRightOpen, PanelLeftClose, PanelLeftOpen,
} from "lucide-react";

const navItems = [
  { href: "/", icon: Sparkles, labelKey: "nav.aiAssistant", active: true, isAI: true },
  { href: "/dashboard", icon: LayoutDashboard, labelKey: "nav.dashboard", active: true },
  { href: "/homologation", icon: ShieldCheck, labelKey: "nav.homologation", active: true },
  { href: "/questionnaires", icon: FileQuestion, labelKey: "nav.questionnaires", active: true },
  { href: "/flowcharts", icon: GitBranch, labelKey: "nav.flowcharts", active: true },
  { href: "/reach", icon: Beaker, labelKey: "nav.reach", active: true },
  { href: "/changes", icon: Bell, labelKey: "nav.changes", active: true },
  { divider: true } as const,
  { href: "/modules/internal-homologation", icon: Database, labelKey: "nav.internalHomologation", active: false },
  { href: "/modules/supplier-standardization", icon: Users, labelKey: "nav.supplierStandardization", active: false },
  { href: "/modules/sds-extraction", icon: FileText, labelKey: "nav.sdsExtraction", active: false },
  { href: "/modules/feed-requirements", icon: Wheat, labelKey: "nav.feedRequirements", active: false },
];

type NavItem = { href: string; icon: React.ComponentType<{ className?: string }>; labelKey: string; active: boolean; isAI?: boolean } | { divider: true };

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const { toggle: toggleAIPanel } = useSidePanel();
  const { isOpen, toggle: toggleSidebar } = useSidebar();

  const width = isOpen ? 220 : 56;

  return (
    <aside
      className="fixed left-0 top-0 h-screen bg-[#fafbfc] flex flex-col z-40 border-r border-[#f0f0f0] transition-[width] duration-200 ease-out overflow-hidden"
      style={{ width }}
    >
      {/* Logo + collapse toggle */}
      <div className="px-3 py-3 border-b border-[#f0f0f0] flex items-center justify-between min-h-[48px]">
        {isOpen ? (
          <div className="flex items-center gap-0">
            <Image
              src="/quimidroga-logo.png"
              alt="Quimidroga"
              width={120}
              height={24}
              className="object-contain"
              style={{ height: 22, width: "auto" }}
            />
            <span className="text-sm font-semibold tracking-tight text-[#00b331] -ml-0.5">
              AI
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <Image
              src="/quimidroga-logo.png"
              alt="Quimidroga"
              width={28}
              height={28}
              className="object-contain"
              style={{ height: 22, width: 22, objectPosition: "left" }}
            />
          </div>
        )}
        {isOpen && (
          <button
            type="button"
            onClick={toggleSidebar}
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#a0a0a0] hover:text-[#6b6b6b] hover:bg-[#f0f0f0] transition-colors duration-150 shrink-0"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {!isOpen && (
        <button
          type="button"
          onClick={toggleSidebar}
          className="mx-auto mt-2 w-8 h-8 rounded-md flex items-center justify-center text-[#a0a0a0] hover:text-[#6b6b6b] hover:bg-[#f0f0f0] transition-colors duration-150"
        >
          <PanelLeftOpen className="w-4 h-4" />
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-1.5 px-1.5">
        {(navItems as NavItem[]).map((item, i) => {
          if ("divider" in item) {
            return <div key={i} className={cn("my-1.5 border-t border-[#f0f0f0]", isOpen ? "mx-2" : "mx-1")} />;
          }
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && item.href !== "/dashboard" && pathname.startsWith(item.href));

          if (!isOpen) {
            return (
              <Link
                key={item.href}
                href={item.href}
                title={t(item.labelKey)}
                className={cn(
                  "flex items-center justify-center w-8 h-8 mx-auto rounded-md transition-all duration-150 mb-0.5",
                  isActive
                    ? item.isAI
                      ? "bg-[#eef2ff] text-[#5e6ad2]"
                      : "bg-[#f0f0f0] text-[#1a1a1a]"
                    : "text-[#6b6b6b] hover:bg-[#f5f5f5] hover:text-[#1a1a1a]",
                  !item.active && "opacity-40"
                )}
              >
                <Icon className={cn(
                  "w-4 h-4",
                  isActive ? "text-[#5e6ad2]" : item.isAI ? "text-[#5e6ad2]" : "text-[#6b6b6b]"
                )} />
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] transition-all duration-150 mb-0.5",
                isActive
                  ? item.isAI
                    ? "bg-[#eef2ff] font-medium text-[#5e6ad2]"
                    : "bg-[#f0f0f0] font-medium text-[#1a1a1a]"
                  : "text-[#6b6b6b] hover:bg-[#f5f5f5] hover:text-[#1a1a1a]",
                !item.active && "opacity-40"
              )}
            >
              <Icon className={cn(
                "w-4 h-4 shrink-0",
                isActive ? "text-[#5e6ad2]" : item.isAI ? "text-[#5e6ad2]" : "text-[#6b6b6b]"
              )} />
              <span className="truncate">{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>

      {/* AI Panel Toggle */}
      {isOpen ? (
        <button
          type="button"
          onClick={toggleAIPanel}
          className="mx-1.5 mb-1.5 flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] text-[#6b6b6b] hover:bg-[#f5f5f5] hover:text-[#1a1a1a] transition-all duration-150"
        >
          <PanelRightOpen className="w-4 h-4" />
          <span>{t("nav.togglePanel")}</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={toggleAIPanel}
          title={t("nav.togglePanel")}
          className="mx-auto mb-1.5 w-8 h-8 rounded-md flex items-center justify-center text-[#6b6b6b] hover:bg-[#f5f5f5] hover:text-[#1a1a1a] transition-all duration-150"
        >
          <PanelRightOpen className="w-4 h-4" />
        </button>
      )}

      {/* Footer */}
      <div className={cn("py-2 border-t border-[#f0f0f0]", isOpen ? "px-4" : "px-2 text-center")}>
        <p className="text-[11px] text-[#a0a0a0]">{isOpen ? "v1.0.0" : "v1"}</p>
      </div>
    </aside>
  );
}
