// Performance optimization utilities for the dashboard
export const DASHBOARD_CACHE_TAGS = {
  STATS: 'dashboard-stats',
  CAMPAIGNS: 'dashboard-campaigns',
  LEADS: 'dashboard-leads',
  RECENT_ACTIVITY: 'dashboard-recent-activity'
} as const;

export const CACHE_DURATIONS = {
  DASHBOARD_STATS: 300, // 5 minutes
  CAMPAIGNS_LIST: 180, // 3 minutes
  RECENT_ACTIVITY: 60   // 1 minute
} as const;

// Stale-while-revalidate configuration
export const SWR_CONFIG = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  refreshInterval: 300000, // 5 minutes
  dedupingInterval: 30000  // 30 seconds
} as const;
