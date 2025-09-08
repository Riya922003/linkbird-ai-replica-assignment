import { create } from 'zustand'

interface Lead {
  id: string
  name: string
  email: string
  company: string | null
  status: "Pending" | "Contacted" | "Qualified" | "Converted"
  campaignName?: string
  activity?: string
  lastContacted?: string | null
  createdAt: string
}

interface LeadManagementStore {
  // Edit form state
  isEditFormOpen: boolean
  editingLead: Lead | null
  
  // Actions
  openEditForm: (lead?: Lead) => void
  closeEditForm: () => void
  
  // Lead operations
  saveLead: (lead: Lead) => void
  deleteLead: (leadId: string) => void
}

export const useLeadManagementStore = create<LeadManagementStore>((set, get) => ({
  // Initial state
  isEditFormOpen: false,
  editingLead: null,
  
  // Actions
  openEditForm: (lead?: Lead) => {
    set({ 
      isEditFormOpen: true, 
      editingLead: lead || null 
    })
  },
  
  closeEditForm: () => {
    set({ 
      isEditFormOpen: false, 
      editingLead: null 
    })
  },
  
  // Lead operations
  saveLead: (lead: Lead) => {
    // TODO: Add server action to save lead
    // For now, just close the form
    get().closeEditForm()
  },
  
  deleteLead: (leadId: string) => {
    // TODO: Add server action to delete lead
    // For now, just close any open forms
    get().closeEditForm()
  }
}))
