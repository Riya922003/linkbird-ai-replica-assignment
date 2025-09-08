"use server"

import { unstable_cache, revalidateTag } from "next/cache"
import { db } from "@/db"
import { campaigns, leads } from "@/db/schema"
import { count, desc, eq } from "drizzle-orm"
import { DASHBOARD_CACHE_TAGS, CACHE_DURATIONS } from "@/lib/cache-config"

export interface DashboardStats {
  totalCampaigns: number
  activeCampaigns: number
  totalLeads: number
  recentActivity: RecentActivityItem[]
  campaignsList: CampaignItem[]
}

export interface RecentActivityItem {
  id: string
  name: string
  email: string
  company: string | null
  status: string
  lastContacted: Date | null
  createdAt: Date
  campaign: {
    id: string
    name: string
  }
}

export interface CampaignItem {
  id: string
  name: string
  status: string
  createdAt: Date
}

const getDashboardStatsUncached = async (): Promise<DashboardStats> => {
  try {
    // Run all queries in parallel for better performance with timeout
    const timeout = 10000; // 10 seconds timeout
    const queries = Promise.all([
      // Get total campaign count
      db.select({ count: count() }).from(campaigns),
      
      // Get active campaigns count
      db.select({ count: count() }).from(campaigns).where(eq(campaigns.status, 'Active')),
      
      // Get total leads count
      db.select({ count: count() }).from(leads),
      
      // Get recent activity (recent leads with campaign info)
      db.query.leads.findMany({
        limit: 15, // Increased limit for better user experience
        orderBy: [desc(leads.createdAt)],
        with: {
          campaign: {
            columns: {
              id: true,
              name: true,
            }
          }
        }
      }),
      
      // Get campaigns list for the campaigns card
      db.query.campaigns.findMany({
        limit: 15, // Increased limit
        orderBy: [desc(campaigns.createdAt)],
        columns: {
          id: true,
          name: true,
          status: true,
          createdAt: true,
        }
      })
    ]);

    const [
      totalCampaignsResult,
      activeCampaignsResult,
      totalLeadsResult,
      recentActivity,
      campaignsList
    ] = await Promise.race([
      queries,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), timeout)
      )
    ]) as Awaited<typeof queries>;

    return {
      totalCampaigns: totalCampaignsResult[0]?.count || 0,
      activeCampaigns: activeCampaignsResult[0]?.count || 0,
      totalLeads: totalLeadsResult[0]?.count || 0,
      recentActivity: recentActivity.map(lead => ({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        company: lead.company,
        status: lead.status,
        lastContacted: lead.lastContacted,
        createdAt: lead.createdAt,
        campaign: {
          id: lead.campaign.id,
          name: lead.campaign.name,
        }
      })),
      campaignsList: campaignsList.map(campaign => ({
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        createdAt: campaign.createdAt,
      }))
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    
    // Return fallback data instead of throwing
    return {
      totalCampaigns: 0,
      activeCampaigns: 0,
      totalLeads: 0,
      recentActivity: [],
      campaignsList: []
    }
  }
}

// Cached version with 5-minute revalidation
export const getDashboardStats = unstable_cache(
  getDashboardStatsUncached,
  ['dashboard-stats'],
  {
    revalidate: CACHE_DURATIONS.DASHBOARD_STATS, // 5 minutes
    tags: [DASHBOARD_CACHE_TAGS.STATS]
  }
)

// Helper function to revalidate dashboard cache when data changes
export async function revalidateDashboardCache() {
  revalidateTag(DASHBOARD_CACHE_TAGS.STATS)
}
