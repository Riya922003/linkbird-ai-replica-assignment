"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutDemo() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ 
      callbackUrl: "/login",
      redirect: true 
    });
  };

  if (!session) {
    return null;
  }

  return (
    <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
      <h3 className="text-lg font-semibold mb-2">Logout Functionality Demo</h3>
      <p className="text-sm text-gray-600 mb-4">
        Welcome, {session.user?.name || session.user?.email}! 
        You can logout using the button below or from the header/sidebar.
      </p>
      <Button 
        onClick={handleLogout}
        variant="destructive"
        size="sm"
        className="flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        Logout Now
      </Button>
    </div>
  );
}
