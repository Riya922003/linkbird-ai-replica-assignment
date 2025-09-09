"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, User, Send, UserCheck } from "lucide-react"

// Define the Lead type
export type Lead = {
  id: string
  name: string
  jobTitle?: string
  campaignName: string
  description?: string
  status: "Pending" | "Contacted" | "Responded" | "Converted"
  activity: string
  activityLevel?: number // 0-100 for activity bar visualization
  lastContacted: string | null
  createdAt: string
}

export const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: "name",
    header: "Lead Name/Contact",
    cell: ({ row }) => {
      const lead = row.original
      
      // Generate initials from the name
      const getInitials = (name: string) => {
        return name
          .split(' ')
          .map(word => word[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      }
      
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/images/avatars/person.jpg" alt={lead.name} />
            <AvatarFallback className="text-sm font-medium bg-blue-100 text-blue-800">
              {getInitials(lead.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{lead.name}</span>
            <span className="text-sm text-gray-500">
              {lead.jobTitle || "Contact"}
            </span>
          </div>
        </div>
      )
    },
  },
  // ...existing code...
  {
    accessorKey: "campaignName",
    header: "Campaign Name",
    cell: ({ row }) => {
      return <span className="font-medium">{row.getValue("campaignName")}</span>
    },
  },
  {
    accessorKey: "activity",
    header: "Activity",
    cell: ({ row }) => {
      const activityLevel = row.original.activityLevel || 0
      const status = row.original.status
      
      // Get the color based on status
      const getActivityColor = (status: string) => {
        switch (status) {
          case "Pending": return "bg-yellow-400"      // Yellow for pending
          case "Contacted": return "bg-blue-400"      // Blue for contacted
          case "Responded": return "bg-purple-400"    // Purple for responded
          case "Converted": return "bg-green-400"     // Green for converted
          default: return "bg-yellow-400"             // Default to yellow
        }
      }
      
      // Create activity level bars
      const bars = Array.from({ length: 5 }, (_, index) => {
        const isActive = index < Math.ceil(activityLevel / 20) // Convert 0-100 to 0-5 bars
        return (
          <div
            key={index}
            className={`w-1 h-4 rounded-sm ${
              isActive ? getActivityColor(status) : 'bg-gray-200'
            }`}
          />
        )
      })
      
      return (
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {bars}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      
      const statusConfig = {
        "Pending": { 
          className: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100", 
          label: "Pending",
          icon: Clock
        },
        "Contacted": { 
          className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100", 
          label: "Contacted",
          icon: User
        },
        "Responded": { 
          className: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100", 
          label: "Responded",
          icon: Send
        },
        "Converted": { 
          className: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100", 
          label: "Converted",
          icon: UserCheck
        },
        // Legacy status mapping
        "Pending Approval": { 
          className: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100", 
          label: "Pending",
          icon: Clock
        },
        "Qualified": { 
          className: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100", 
          label: "Responded",
          icon: Send
        },
        "Followup": { 
          className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100", 
          label: "Contacted",
          icon: User
        },
      }
      
      const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["Pending"]
      const IconComponent = config.icon
      
      return (
        <Badge 
          variant="outline" 
          className={`${config.className} flex items-center gap-1.5 px-2 py-1 text-xs font-medium border rounded-full`}
        >
          <IconComponent className="h-3 w-3" />
          {config.label}
        </Badge>
      )
    },
  },
]
