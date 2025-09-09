"use client"

import * as React from "react"
import { useLeadSheetStore } from "@/store/lead-sheet-store"
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  X,
  Trash2
} from "lucide-react"

export function LeadDetailSheet() {
  const { isOpen, leadData, onClose } = useLeadSheetStore()

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
      <SheetContent 
        className="w-96 p-0 [&>button]:hidden sm:max-w-md" 
        side="right"
      >
        <SheetTitle className="sr-only">
          {leadData ? `Lead Profile for ${leadData.name}` : "Lead Profile"}
        </SheetTitle>
        {leadData ? (
          <div className="h-full flex flex-col overflow-hidden">
            {/* Header Section - Enclosed in a box */}
            <div className="mx-4 mt-4 mb-2 border border-gray-200 rounded-lg bg-white shadow-sm">
              <div className="p-3">
                {/* Close Button and Delete Button */}
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-lg font-semibold">Lead Profile</h2>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-50">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Main Header with Avatar and Info */}
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <Avatar className="w-12 h-12 flex-shrink-0">
                    <AvatarImage src="/images/avatars/person.jpg" alt={leadData.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-800 font-semibold text-sm">
                      {getInitials(leadData.name)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Name and Title */}
                  <div className="flex-1 min-w-0">
                    <h1 className="text-lg font-bold text-gray-900 mb-0.5">
                      {leadData.name}
                    </h1>
                    <p className="text-gray-600 text-sm mb-2">
                      {leadData.jobTitle || "Professional"}
                    </p>

                    {/* Campaign and Status Row - Shifted left under Professional */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Target className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {leadData.campaignName}
                        </span>
                      </div>
                      <Badge 
                        className={`
                          ${leadData.status === "Pending" ? "bg-purple-50 text-purple-700 border-purple-200" : ""}
                          ${leadData.status === "Contacted" ? "bg-orange-50 text-orange-700 border-orange-200" : ""}
                          ${leadData.status === "Responded" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                          ${leadData.status === "Converted" ? "bg-green-50 text-green-700 border-green-200" : ""}
                          text-xs font-medium border rounded-full px-2 py-1
                        `}
                      >
                        {leadData.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Profile Info Accordion - Inside the box */}
              <div className="border-t border-gray-100 px-3 py-2">
                <Accordion type="single" collapsible>
                  <AccordionItem value="profile-info" className="border-none">
                    <AccordionTrigger className="text-sm font-medium hover:no-underline py-2 px-0">
                      Additional Profile Info
                    </AccordionTrigger>
                    <AccordionContent className="pt-1 pb-2">
                      <div className="space-y-1.5 text-sm text-gray-600">
                        <p><strong>Name:</strong> {leadData.name}</p>
                        <p><strong>Email:</strong> reyansh.shah@example.com</p>
                        <p><strong>Company:</strong> TechCorp Solutions</p>
                        <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                        <p><strong>Location:</strong> San Francisco, CA</p>
                        <p><strong>Created:</strong> {new Date(leadData.createdAt).toLocaleDateString()}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 overflow-auto">
              {/* Timeline Section */}
              <div className="p-4">
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
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No lead data available</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
