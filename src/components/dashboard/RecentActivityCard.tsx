import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, Clock, User } from "lucide-react";

interface RecentActivityItem {
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

interface RecentActivityCardProps {
  recentActivity?: RecentActivityItem[]
}

export const RecentActivityCard = ({ recentActivity = [] }: RecentActivityCardProps) => {
  // Limit recent activity to show maximum 9 items
  const displayActivity = recentActivity.slice(0, 9);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return (
          <Badge className="bg-violet-50 text-violet-700 hover:bg-violet-50 flex items-center gap-1 rounded-full">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
      case 'contacted':
        return (
          <Badge className="bg-orange-50 text-orange-700 hover:bg-orange-50 flex items-center gap-1 rounded-full">
            <User className="h-3 w-3" />
            Contacted
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-50 text-gray-700 hover:bg-gray-50 flex items-center gap-1 rounded-full">
            <Clock className="h-3 w-3" />
            {status}
          </Badge>
        )
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 flex-shrink-0">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          Most Recent
          <ChevronDown className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 px-4 pb-4">
        <div className="space-y-0">
          {/* Header */}
          <div className="grid grid-cols-3 gap-4 text-xs font-medium text-slate-500 border-b pb-2 mb-2">
            <span>Lead</span>
            <span>Campaign</span>
            <span>Status</span>
          </div>
          
          {/* Activity Items */}
          <div>
            {displayActivity.length > 0 ? (
              displayActivity.map((activity) => (
                <div key={activity.id} className="grid grid-cols-3 gap-4 items-center border-t py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {activity.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{activity.name}</div>
                      <div className="text-xs text-slate-500">{activity.company || activity.email}</div>
                    </div>
                  </div>
                  <div className="text-sm">{activity.campaign.name}</div>
                  {getStatusBadge(activity.status)}
                </div>
              ))
            ) : (
              <div className="border-t py-6 text-center text-gray-500">
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
