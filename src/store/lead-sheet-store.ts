import { create } from "zustand"
import { Lead } from "@/components/leads/columns"

interface LeadSheetStore {
  isOpen: boolean
  leadData: Lead | null
  onOpen: (leadData: Lead) => void
  onClose: () => void
}

export const useLeadSheetStore = create<LeadSheetStore>((set) => ({
  isOpen: false,
  leadData: null,
  onOpen: (leadData: Lead) => {
    set({
      isOpen: true,
      leadData,
    })
  },
  onClose: () => {
    set({
      isOpen: false,
      leadData: null,
    })
  },
}))
