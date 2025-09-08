"use client";

import { Sidebar } from "../../components/sidebar";
import { useSidebarStore } from "@/store/sidebar-store";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed, setCollapsed } = useSidebarStore();
  
  return (
    <div className="flex h-screen max-h-screen bg-slate-50 overflow-hidden">
      {/* Mobile overlay - only visible on mobile when sidebar is expanded */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area - no margins needed since we're using flexbox */}
      <div className="flex-1 transition-all duration-300 ease-in-out overflow-hidden">
        <main className="flex-1 flex flex-col p-6 h-full overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}