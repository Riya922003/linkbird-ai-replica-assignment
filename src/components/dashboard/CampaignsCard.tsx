import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { memo } from "react";

interface CampaignItem {
  id: string
  name: string
  status: string
  createdAt: Date
}

interface CampaignsCardProps {
  campaigns?: CampaignItem[]
  totalCampaigns?: number
}

export const CampaignsCard = memo(({ campaigns = [], totalCampaigns = 0 }: CampaignsCardProps) => {
  // Limit campaigns to show maximum 6 items to ensure card fits within height
  const displayCampaigns = campaigns.slice(0, 6);
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-3 flex-shrink-0">
        <CardTitle className="text-base font-semibold">Campaigns</CardTitle>
        <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs text-gray-600">
          All Campaigns
          <ChevronDown className="h-3 w-3 text-gray-600" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 px-3 pb-2">
        <div className="space-y-0">
          {displayCampaigns.length > 0 ? (
            displayCampaigns.map((campaign, index) => (
              <div key={campaign.id}>
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm font-medium truncate pr-2">{campaign.name}</span>
                  <Badge className={`${
                    campaign.status === 'Active' 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : campaign.status === 'Paused'
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } rounded-md px-2 py-0.5 text-xs flex-shrink-0`}>
                    {campaign.status}
                  </Badge>
                </div>
                {index < displayCampaigns.length - 1 && (
                  <div className="h-px bg-gray-300/85 rounded-full mx-1 my-1"></div>
                )}
              </div>
            ))
          ) : (
            <div className="py-4 text-center text-gray-500">
              <p>No campaigns found</p>
              <p className="text-xs text-gray-400 mt-1">Total: {totalCampaigns}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

CampaignsCard.displayName = 'CampaignsCard';
