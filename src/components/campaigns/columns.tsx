"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { User, Clock, X, UserCheck, MessageCircle } from "lucide-react"
import Link from "next/link"

// Define the Campaign type
export type Campaign = {
  id: string
  name: string
  status: "Active" | "Paused" | "Draft"
  totalLeads: number
  // Request Status stats
  requestsSent: number
  requestsAccepted: number
  requestsPending: number
  // Connection Status stats
  connectionsEstablished: number
  messagesReplied: number
}

export const columns: ColumnDef<Campaign>[] = [
  {
    accessorKey: "name",
    header: "Campaign Name",
    cell: ({ row }) => {
      const campaign = row.original;
      return (
        <Link href={`/campaigns/${campaign.id}`} className="font-medium hover:underline">
          {campaign.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      
      const statusConfig = {
        "Active": { 
          className: "bg-green-50 text-green-700 border-green-200", 
          label: "Active"
        },
        "Paused": { 
          className: "bg-red-50 text-red-700 border-red-200", 
          label: "Inactive"
        },
        "Draft": { 
          className: "bg-red-50 text-red-700 border-red-200", 
          label: "Inactive"
        },
      }
      
      const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["Draft"]
      
      return (
        <Badge 
          variant="outline" 
          className={`${config.className} text-xs font-medium`}
        >
          {config.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: "totalLeads",
    header: "Total Leads",
    cell: ({ row }) => {
      const totalLeads = row.getValue("totalLeads") as number
      
      return (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-900">
            {totalLeads.toLocaleString()}
          </span>
        </div>
      )
    },
  },
  {
    id: "requestStatus",
    header: "Request Status",
    cell: ({ row }) => {
      const campaign = row.original
      
      return (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">{campaign.requestsSent}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">{campaign.requestsAccepted}</span>
          </div>
          <div className="flex items-center gap-1">
            <X className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium">{campaign.requestsPending}</span>
          </div>
        </div>
      )
    },
  },
  {
    id: "connectionStatus",
    header: "Connection Status",
    cell: ({ row }) => {
      const campaign = row.original
      
      return (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <UserCheck className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">{campaign.connectionsEstablished}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium">{campaign.messagesReplied}</span>
          </div>
        </div>
      )
    },
  },
]
