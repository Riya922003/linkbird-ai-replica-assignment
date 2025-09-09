"use client"

import { CampaignsDataTable } from "@/components/campaigns/CampaignsDataTable"
import { columns } from "@/components/campaigns/columns"

export default function CampaignsPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
      </div>
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <CampaignsDataTable columns={columns} />
      </div>
    </div>
  )
}
