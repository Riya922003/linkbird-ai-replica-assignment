"use client"

import * as React from "react"
import Image from "next/image"
import { useLeadSheetStore } from "@/store/lead-sheet-store"
import { useLeadManagementStore } from "@/store/lead-management-store"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  Mail, 
  CheckCircle, 
  MessageCircle, 
  Target,
  ChevronDown,
  X
} from "lucide-react"

export function LeadDetailSheet() {
  const { isOpen, leadData, onClose } = useLeadSheetStore()
  const { openEditForm } = useLeadManagementStore()

  const handleEditLead = () => {
    if (leadData) {
      openEditForm(leadData)
      onClose() // Close the detail sheet when opening edit form
    }
  }

  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-96 p-0">
        <SheetTitle className="sr-only">
          {leadData ? `Lead Profile for ${leadData.name}` : "Lead Profile"}
        </SheetTitle>
        {leadData && (
          <div className="h-full flex flex-col">
            {/* Header Section */}
            <div className="p-6 border-b">
              {/* Close Button */}
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-semibold">Lead Profile</h2>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Main Header with Avatar and Info */}
              <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold text-lg">
                  {getInitials(leadData.name)}
                </div>

                {/* Name and Title */}
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-gray-900 mb-1">
                    {leadData.name}
                  </h1>
                  <p className="text-gray-600 text-sm mb-3">
                    {leadData.jobTitle || leadData.company || "Professional"}
                  </p>

                  {/* Campaign and Status Row */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {leadData.campaignName}
                      </span>
                    </div>
                    <Badge 
                      className={`
                        ${leadData.status === "Pending Approval" ? "bg-purple-50 text-purple-700 border-purple-200" : ""}
                        ${leadData.status === "Sent 7 mins ago" ? "bg-orange-50 text-orange-700 border-orange-200" : ""}
                        ${leadData.status === "Followup" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                        ${leadData.status === "Do Not Contact" ? "bg-gray-50 text-gray-700 border-gray-200" : ""}
                        text-xs font-medium border rounded-full
                      `}
                    >
                      {leadData.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 overflow-auto">
              {/* Additional Profile Info Accordion */}
              <div className="p-6 border-b">
                <Accordion type="single" collapsible>
                  <AccordionItem value="profile-info" className="border-none">
                    <AccordionTrigger className="text-sm font-medium hover:no-underline py-2">
                      Additional Profile Info
                      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                    </AccordionTrigger>
                    <AccordionContent className="pt-2">
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><strong>Email:</strong> {leadData.email}</p>
                        {leadData.company && (
                          <p><strong>Company:</strong> {leadData.company}</p>
                        )}
                        <p><strong>Created:</strong> {new Date(leadData.createdAt).toLocaleDateString()}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Timeline Section */}
              <div className="p-6">
                <div className="space-y-6">
                  {/* Timeline Item 1 - Invitation Request */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="w-px h-8 bg-gray-200 mt-2"></div>
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-sm">Invitation Request</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Message: Hi Om, I&apos;m building consultative...
                      </p>
                      <button className="text-blue-600 text-sm hover:underline">
                        See More
                      </button>
                    </div>
                  </div>

                  {/* Timeline Item 2 - Connection Status */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="w-px h-8 bg-gray-200 mt-2"></div>
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">Connection Status</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Check connection status
                      </p>
                    </div>
                  </div>

                  {/* Timeline Item 3 - Replied */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <MessageCircle className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-sm">Replied</span>
                      </div>
                      <button className="text-blue-600 text-sm hover:underline">
                        View Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
