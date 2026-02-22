"use client";

import { I18nProvider } from "@/lib/i18n";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-[260px] transition-all duration-300">
          <Header />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </I18nProvider>
  );
}
