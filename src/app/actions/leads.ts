"use server"

import { db } from "@/db"
import { leads } from "@/db/schema"
import { count, desc, eq } from "drizzle-orm"

export interface GetLeadsParams {
  pageParam?: number
  limit?: number
  campaignId?: string
}

export interface Lead {
  id: string
  name: string
  email: string
  company: string | null
  jobTitle: string | null
  status: string
  description: string | null
  lastContacted: Date | null
  campaignId: string
  createdAt: Date
  campaign?: {
    id: string
    name: string
  }
}

export interface GetLeadsResult {
  leads: Lead[]
  totalCount: number
}

export async function getLeads({ 
  pageParam = 1, 
  limit = 10,
  campaignId
}: GetLeadsParams = {}): Promise<GetLeadsResult> {
  try {
    // Calculate offset for pagination
    const offset = (pageParam - 1) * limit

    // Build where condition for campaignId filter
    const whereCondition = campaignId ? eq(leads.campaignId, campaignId) : undefined

    // Get total count with optional campaignId filter
    const [total] = await db
      .select({ count: count() })
      .from(leads)
      .where(whereCondition)

    // Query leads with pagination, ordering, and optional campaignId filter
    const leadsData = await db.query.leads.findMany({
      limit: limit,
      offset: offset,
      orderBy: [desc(leads.createdAt)],
      where: whereCondition,
      with: {
        campaign: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    })

    return {
      leads: leadsData,
      totalCount: total.count,
    }
  } catch (error) {
    console.error('Error fetching leads:', error)
    throw new Error('Failed to fetch leads')
  }
}

export async function getLeadsCount(): Promise<number> {
  try {
    const result = await db.query.leads.findMany()
    return result.length
  } catch (error) {
    console.error('Error counting leads:', error)
    throw new Error('Failed to count leads')
  }
}
