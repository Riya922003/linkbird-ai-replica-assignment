"use client";

import { Sidebar } from "../../components/sidebar";
import { useSidebarStore } from "@/store/sidebar-store";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, Plus } from "lucide-react";
import { usePathname } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed, setCollapsed } = useSidebarStore();
  const { data: session } = useSession();
  const pathname = usePathname();
  
  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const handleCreateLead = () => {
    // TODO: Implement create lead functionality
    console.log("Create lead clicked");
  };

  const handleCreateCampaign = () => {
    // TODO: Implement create campaign functionality
    console.log("Create campaign clicked");
  };
  
  const isLeadsPage = pathname === "/leads";
  const isCampaignsPage = pathname === "/campaigns";
  
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
      <div className="flex-1 transition-all duration-300 ease-in-out overflow-hidden relative">
        {/* Top Right Buttons */}
        {session && (
          <div className="absolute top-4 right-6 z-10 flex items-center gap-3">
            {/* Create Lead Button - Only show on leads page */}
            {isLeadsPage && (
              <Button 
                onClick={handleCreateLead}
                size="sm"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <div className="flex items-center justify-center w-4 h-4 bg-white rounded-full">
                  <Plus className="h-3 w-3 text-blue-600" />
                </div>
                Create Lead
              </Button>
            )}

            {/* Create Campaign Button - Only show on campaigns page */}
            {isCampaignsPage && (
              <Button 
                onClick={handleCreateCampaign}
                size="sm"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <div className="flex items-center justify-center w-4 h-4 bg-white rounded-full">
                  <Plus className="h-3 w-3 text-blue-600" />
                </div>
                Create Campaign
              </Button>
            )}
            
            {/* Logout Button */}
            <Button 
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-white hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        )}
        
        <main className="flex-1 flex flex-col p-6 h-full overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}