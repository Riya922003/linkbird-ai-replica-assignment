import { Suspense } from "react"
import { getCampaignsWithStats } from "@/app/actions/campaigns"
import { CampaignsDataTable } from "./CampaignsDataTable"
import { columns } from "./columns"

interface CampaignsServerComponentProps {
  statusFilter?: "Active" | "Paused" | "Draft"
}

async function CampaignsData({ statusFilter }: CampaignsServerComponentProps) {
  // Fetch initial data on the server
  const initialData = await getCampaignsWithStats({ pageParam: 1, limit: 15 })
  
  return (
    <CampaignsDataTable 
      columns={columns} 
      statusFilter={statusFilter}
      initialData={initialData}
    />
  )
}

function CampaignsLoadingSkeleton() {
  return (
    <div className="h-full flex flex-col">
      {/* Search and Filter Header Skeleton */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="w-40 h-10 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      
      {/* Table Skeleton */}
      <div className="flex-1 p-4">
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded">
              <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-1/6" />
              </div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
              <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function CampaignsServerComponent({ statusFilter }: CampaignsServerComponentProps) {
  return (
    <Suspense fallback={<CampaignsLoadingSkeleton />}>
      <CampaignsData statusFilter={statusFilter} />
    </Suspense>
  )
}
