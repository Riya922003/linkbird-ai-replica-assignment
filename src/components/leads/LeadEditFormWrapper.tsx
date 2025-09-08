"use client"

import { LeadEditForm } from "@/components/leads/LeadEditForm"
import { useLeadManagementStore } from "@/store/lead-management-store"

export function LeadEditFormWrapper() {
  const { isEditFormOpen, editingLead, closeEditForm, saveLead } = useLeadManagementStore()

  return (
    <LeadEditForm
      lead={editingLead || undefined}
      isOpen={isEditFormOpen}
      onClose={closeEditForm}
      onSave={saveLead}
    />
  )
}
