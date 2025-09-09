"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Save, User, Building, Tag } from "lucide-react"

interface Lead {
  id: string
  name: string
  email: string
  company: string | null
  status: "Pending" | "Contacted" | "Qualified" | "Converted"
  campaignName?: string
  createdAt: string
  activity?: string
  lastContacted?: string | null
}

interface LeadEditFormProps {
  lead?: Lead
  isOpen: boolean
  onClose: () => void
  onSave: (lead: Lead) => void
}

export function LeadEditForm({ lead, isOpen, onClose, onSave }: LeadEditFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Lead>({
    defaultValues: lead || {
      id: "",
      name: "",
      email: "",
      company: "",
      status: "Pending",
      campaignName: "",
      createdAt: new Date().toISOString()
    }
  })

  React.useEffect(() => {
    if (lead) {
      reset(lead)
    }
  }, [lead, reset])

  const onSubmit = (data: Lead) => {
    onSave(data)
    onClose()
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Form Content */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white border-l shadow-lg overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-white sticky top-0">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              {lead ? "Edit Lead" : "Create Lead"}
            </h2>
            <p className="text-sm text-gray-600">
              {lead ? "Update lead information" : "Add a new lead to your campaign"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Name is required" })}
                  placeholder="Enter full name"
                  className="mt-1"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  placeholder="Enter email address"
                  className="mt-1"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  {...register("company")}
                  placeholder="Enter company name"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Lead Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Lead Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  {...register("status")}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Converted">Converted</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building className="h-4 w-4" />
                Campaign
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="campaignName">Campaign</Label>
                <Input
                  id="campaignName"
                  {...register("campaignName")}
                  placeholder="Enter campaign name"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4">
            <Button type="submit" className="w-full">
              <Save className="h-4 w-4 mr-2" />
              {lead ? "Update Lead" : "Create Lead"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="w-full">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
