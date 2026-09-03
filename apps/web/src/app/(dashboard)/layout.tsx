"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Menu, Terminal } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* Sidebar for Desktop and Mobile Drawer */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 bg-black">
        {/* Mobile Top Navigation Bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-black sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white text-black flex items-center justify-center rounded font-bold">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-sm tracking-tight">DevTime</span>
          </div>

          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-md border border-neutral-800 bg-neutral-950 text-neutral-300 hover:text-white"
            aria-label="Open Navigation"
          >
            <Menu className="w-4 h-4" />
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
