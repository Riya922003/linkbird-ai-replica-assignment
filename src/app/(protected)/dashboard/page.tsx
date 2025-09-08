// src/app/(protected)/dashboard/page.tsx

import { Suspense } from "react";
import { Metadata } from "next";
import { CampaignsCard } from "@/components/dashboard/CampaignsCard";
import { LinkedInAccountsCard } from "@/components/dashboard/LinkedInAccountsCard";
import { RecentActivityCard } from "@/components/dashboard/RecentActivityCard";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { getDashboardStats } from "@/app/actions/dashboard";

export const metadata: Metadata = {
  title: "Dashboard - LinkBird",
  description: "View your campaign performance and recent activity",
  robots: "noindex", // Protected page
};

async function DashboardContent() {
  // Fetch dashboard data using cached server action
  const dashboardData = await getDashboardStats();

  return (
    <div className="flex flex-col h-full max-h-screen overflow-hidden">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-120px)] overflow-hidden">
        <div className="flex flex-col gap-4 h-full overflow-hidden">
          <div className="h-[50%] min-h-0 overflow-hidden">
            <CampaignsCard 
              campaigns={dashboardData.campaignsList}
              totalCampaigns={dashboardData.totalCampaigns}
            />
          </div>
          <div className="h-[50%] min-h-0 overflow-hidden">
            <LinkedInAccountsCard />
          </div>
        </div>

        <div className="h-full overflow-hidden">
          <RecentActivityCard 
            recentActivity={dashboardData.recentActivity}
          />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
