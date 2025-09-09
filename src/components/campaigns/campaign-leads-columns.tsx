"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, User, Send, UserCheck } from "lucide-react"
import { Lead } from "@/components/leads/columns"

export const columns: ColumnDef<Lead, unknown>[] = [
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
  {
    accessorKey: "description",
    header: "Lead Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string
      return (
        <div className="max-w-xs">
          <span className="text-gray-700 text-sm">
            {description || "No description available"}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "activity",
    header: "Activity",
    cell: ({ row }) => {
      const activity = row.getValue("activity") as string
      const activityLevel = row.original.activityLevel || 0
      
      return (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${activityLevel}%` }}
            />
          </div>
          <span className="text-xs text-gray-600">{activity}</span>
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
