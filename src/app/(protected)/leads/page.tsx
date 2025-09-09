"use client"

import { LeadsDataTable } from "@/components/leads/LeadsDataTable"
import { LeadDetailSheet } from "@/components/leads/LeadDetailSheet"
import { LeadEditFormWrapper } from "@/components/leads/LeadEditFormWrapper"
import { columns } from "@/components/leads/columns"

export default function LeadsPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 pr-40">
        <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
      </div>
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <LeadsDataTable columns={columns} />
      </div>
      <LeadDetailSheet />
      <LeadEditFormWrapper />
    </div>
  )
}
