"use server"

import { unstable_cache } from "next/cache"
import { db } from "@/db"
import { campaigns, leads } from "@/db/schema"
import { desc, sql } from "drizzle-orm"

// Define the Campaign type to match our columns
export type CampaignWithStats = {
  id: string
  name: string
  status: "Active" | "Paused" | "Draft"
  userId: string
  createdAt: Date
  // Stats for table display
  totalLeads: number
  successfulLeads: number
  responseRate: number
  // Request Status stats (placeholder for future implementation)
  requestsSent: number
  requestsAccepted: number
  requestsPending: number
  // Connection Status stats (placeholder for future implementation)
  connectionsEstablished: number
  messagesReplied: number
}

export interface GetCampaignsParams {
  pageParam?: number
  limit?: number
}

export interface GetCampaignsResult {
  campaigns: CampaignWithStats[]
  totalCount: number
  hasMore: boolean
}

export const getCampaignsWithStats = unstable_cache(
  async ({
    pageParam = 1,
    limit = 15,
  }: GetCampaignsParams = {}): Promise<GetCampaignsResult> => {
    try {
      const offset = (pageParam - 1) * limit

      // Efficient Drizzle query using LEFT JOIN with aggregate functions and conditional counting
      const campaignResults = await db
        .select({
          id: campaigns.id,
          name: campaigns.name,
          status: campaigns.status,
          userId: campaigns.userId,
          createdAt: campaigns.createdAt,
          totalLeads: sql<number>`COALESCE(COUNT(${leads.id}), 0)`.as('totalLeads'),
          successfulLeads: sql<number>`COALESCE(COUNT(CASE WHEN ${leads.status} = 'Converted' THEN 1 END), 0)`.as('successfulLeads'),
          contactedLeads: sql<number>`COALESCE(COUNT(CASE WHEN ${leads.status} IN ('Contacted', 'Converted', 'Replied') THEN 1 END), 0)`.as('contactedLeads'),
          repliedLeads: sql<number>`COALESCE(COUNT(CASE WHEN ${leads.status} = 'Replied' THEN 1 END), 0)`.as('repliedLeads')
        })
        .from(campaigns)
        .leftJoin(leads, sql`${campaigns.id} = ${leads.campaignId}`)
        .groupBy(campaigns.id, campaigns.name, campaigns.status, campaigns.userId, campaigns.createdAt)
        .orderBy(desc(campaigns.createdAt))
        .limit(limit)
        .offset(offset)

      // Get total count for pagination - run in parallel
      const totalCountPromise = db
        .select({ count: sql<number>`COUNT(*)` })
        .from(campaigns)

      const [totalCountResult] = await Promise.all([totalCountPromise])
      const totalCount = totalCountResult[0]?.count || 0
      const hasMore = offset + campaignResults.length < totalCount

      // Transform results with calculated stats
      const campaignsWithStats: CampaignWithStats[] = campaignResults.map((campaign) => {
        const totalLeads = Number(campaign.totalLeads) || 0
        const successfulLeads = Number(campaign.successfulLeads) || 0
        const contactedLeads = Number((campaign as typeof campaign & { contactedLeads: number }).contactedLeads) || 0
        const repliedLeads = Number((campaign as typeof campaign & { repliedLeads: number }).repliedLeads) || 0
        const responseRate = totalLeads > 0 ? (successfulLeads / totalLeads) * 100 : 0

        return {
          id: campaign.id,
          name: campaign.name,
          status: campaign.status as "Active" | "Paused" | "Draft",
          userId: campaign.userId,
          createdAt: campaign.createdAt,
          totalLeads,
          successfulLeads,
          responseRate: Math.round(responseRate * 100) / 100, // Round to 2 decimal places
          // More accurate stats based on actual data
          requestsSent: contactedLeads, // Leads that have been contacted
          requestsAccepted: successfulLeads, // Leads that converted
          requestsPending: totalLeads - contactedLeads, // Leads not yet contacted
          connectionsEstablished: repliedLeads, // Leads that replied (indicating connection)
          messagesReplied: repliedLeads, // Same as connections for now
        }
      })

      return {
        campaigns: campaignsWithStats,
        totalCount,
        hasMore,
      }
    } catch (error) {
      console.error("Error fetching campaigns with stats:", error)
      throw new Error("Failed to fetch campaigns with statistics")
    }
  },
  ['campaigns-with-stats'],
  { revalidate: 60 * 5 } // 5-minute cache revalidation
)

// New function to get a single campaign by ID
export const getCampaignById = unstable_cache(
  async (campaignId: string) => {
    if (!campaignId) {
      return null
    }

    try {
      const campaign = await db.query.campaigns.findFirst({
        where: (campaigns, { eq }) => eq(campaigns.id, campaignId),
        with: {
          leads: {
            columns: {
              id: true,
              status: true,
            },
          },
        },
      })

      if (!campaign) {
        return null
      }

      // Calculate stats for the single campaign
      const totalLeads = campaign.leads.length
      const contactedLeads = campaign.leads.filter(
        (lead) => lead.status === 'Contacted' || lead.status === 'Converted'
      ).length
      const repliedLeads = campaign.leads.filter(
        (lead) => lead.status === 'Replied'
      ).length
      const convertedLeads = campaign.leads.filter(
        (lead) => lead.status === 'Converted'
      ).length
      
      const acceptanceRate = totalLeads > 0 ? (contactedLeads / totalLeads) * 100 : 0
      const replyRate = contactedLeads > 0 ? (repliedLeads / contactedLeads) * 100 : 0
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0

      return {
        ...campaign,
        totalLeads,
        contactedLeads,
        repliedLeads,
        convertedLeads,
        acceptanceRate: Math.round(acceptanceRate),
        replyRate: Math.round(replyRate),
        conversionRate: Math.round(conversionRate * 100) / 100,
      }
    } catch (error) {
      console.error(`Error fetching campaign ${campaignId}:`, error)
      return null
    }
  },
  ['campaign-by-id'],
  { revalidate: 60 * 5 } // 5-minute cache revalidation
)

export async function getCampaignsCount(): Promise<number> {
  try {
    const result = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(campaigns)

    return result[0]?.count || 0
  } catch (error) {
    console.error("Error fetching campaigns count:", error)
    throw new Error("Failed to fetch campaigns count")
  }
}
