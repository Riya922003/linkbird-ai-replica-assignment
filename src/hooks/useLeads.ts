"use client"

import { useQuery } from "@tanstack/react-query"
import { getLeads } from "@/app/actions/leads"

export interface UseLeadsOptions {
  page?: number
  limit?: number
  enabled?: boolean
}

export function useLeads({ page = 1, limit = 10, enabled = true }: UseLeadsOptions = {}) {
  return useQuery({
    queryKey: ["leads", page, limit],
    queryFn: () => getLeads({ page, limit }),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

// Hook for a single lead (if you need it later)
export function useLead(leadId: string, enabled = true) {
  return useQuery({
    queryKey: ["lead", leadId],
    queryFn: () => {
      // You'll need to create a getLead action later
      throw new Error("getLead action not implemented yet")
    },
    enabled: enabled && !!leadId,
  })
}
