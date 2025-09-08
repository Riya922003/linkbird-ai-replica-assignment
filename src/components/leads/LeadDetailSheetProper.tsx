"use client"

import * as React from "react"
import { useLeadSheetStore } from "@/store/lead-sheet-store"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Building, Calendar, Activity } from "lucide-react"

export function LeadDetailSheetProper() {
  const { isOpen, leadData, onClose } = useLeadSheetStore()

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-96">
        <SheetHeader>
          <SheetTitle>{leadData?.name || "Lead Details"}</SheetTitle>
          <SheetDescription>
            View and manage lead information
          </SheetDescription>
        </SheetHeader>

        {leadData && (
          <div className="py-6 space-y-6">
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant={
                leadData.status === "Converted" ? "success" :
                leadData.status === "Qualified" ? "outline" :
                leadData.status === "Contacted" ? "default" : "secondary"
              }>
                {leadData.status}
              </Badge>
            </div>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{leadData.email}</p>
                </div>
                {leadData.company && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Company</label>
                    <p className="text-sm flex items-center gap-2">
                      <Building className="h-3 w-3" />
                      {leadData.company}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Campaign Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Campaign</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{leadData.campaignName}</p>
              </CardContent>
            </Card>

            {/* Activity Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Latest Activity</label>
                  <p className="text-sm">{leadData.activity}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="text-sm flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {new Date(leadData.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {leadData.lastContacted && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Contacted</label>
                    <p className="text-sm flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {new Date(leadData.lastContacted).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button className="flex-1">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" className="flex-1">
                Edit Lead
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
