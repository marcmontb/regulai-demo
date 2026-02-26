"use client";

import { I18nProvider } from "@/lib/i18n";
import { ChatProvider } from "@/components/chat/ChatProvider";
import { SidePanelProvider } from "@/components/chat/SidePanelProvider";
import { SidebarProvider, useSidebar } from "./SidebarProvider";
import Sidebar from "./Sidebar";
import Header from "./Header";
import AISidePanel from "@/components/chat/AISidePanel";
import { useSidePanel } from "@/components/chat/SidePanelProvider";
import { usePathname } from "next/navigation";

function ShellInner({ children }: { children: React.ReactNode }) {
  const { isOpen: sidebarOpen } = useSidebar();
  const { isOpen: panelOpen } = useSidePanel();
  const pathname = usePathname();
  const isAILanding = pathname === "/";

  const sidebarWidth = sidebarOpen ? 220 : 56;

  return (
    <div
      className="transition-[margin] duration-200 ease-out"
      style={{ marginRight: panelOpen ? 400 : 0 }}
    >
      <div className="flex min-h-screen">
        <Sidebar />
        <div
          className="flex-1 transition-[margin-left] duration-200 ease-out"
          style={{ marginLeft: sidebarWidth }}
        >
          {!isAILanding && <Header />}
          <main className={isAILanding ? "" : "p-6"}>{children}</main>
        </div>
      </div>
      <AISidePanel />
    </div>
  );
}

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <ChatProvider>
        <SidePanelProvider>
          <SidebarProvider>
            <ShellInner>{children}</ShellInner>
          </SidebarProvider>
        </SidePanelProvider>
      </ChatProvider>
    </I18nProvider>
  );
}
