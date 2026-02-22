"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, ShieldCheck, FileQuestion, GitBranch,
  Beaker, Bell, Database, Users, FileText, Wheat,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", icon: LayoutDashboard, labelKey: "nav.dashboard", active: true },
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

type NavItem = { href: string; icon: React.ComponentType<{ className?: string }>; labelKey: string; active: boolean } | { divider: true };

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-navy-950 text-white flex flex-col z-40 transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-bold text-sm text-white shrink-0">
          RA
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <div className="font-semibold text-base tracking-tight">RegulAI</div>
            <div className="text-[10px] text-white/50 leading-none">{t("app.tagline")}</div>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {(navItems as NavItem[]).map((item, i) => {
          if ("divider" in item) {
            return <div key={i} className="my-2 mx-3 border-t border-white/10" />;
          }
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group relative mb-0.5",
                isActive
                  ? "bg-accent/20 text-accent-light font-medium"
                  : "text-white/60 hover:text-white hover:bg-white/5",
                !item.active && "opacity-50"
              )}
            >
              <Icon className={cn("w-[18px] h-[18px] shrink-0", isActive && "text-accent-light")} />
              {!collapsed && (
                <span className="truncate">{t(item.labelKey)}</span>
              )}
              {!collapsed && !item.active && (
                <span className="ml-auto text-[9px] bg-white/10 text-white/40 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                  {t("dashboard.modules.comingSoon")}
                </span>
              )}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-accent rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-10 border-t border-white/10 text-white/40 hover:text-white/70 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
