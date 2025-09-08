"use client"

import { CampaignsDataTable } from "@/components/campaigns/CampaignsDataTable"
import { columns } from "@/components/campaigns/columns"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function CampaignsPage() {
  const handleCreateCampaign = () => {
    // TODO: Implement create campaign functionality
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
        <Button 
          onClick={handleCreateCampaign} 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <div className="flex items-center justify-center w-5 h-5 bg-white rounded-full">
            <Plus className="h-3 w-3 text-blue-600" />
          </div>
          Create Campaign
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <CampaignsDataTable columns={columns} />
      </div>
    </div>
  )
}
