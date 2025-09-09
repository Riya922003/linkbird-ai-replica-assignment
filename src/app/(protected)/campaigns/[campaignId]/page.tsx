// src/app/(protected)/campaigns/[campaignId]/page.tsx

import { getCampaignById } from "@/app/actions/campaigns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadsDataTable } from "@/components/leads/LeadsDataTable";
import { columns } from "@/components/campaigns/campaign-leads-columns";
import { Target, Activity, Send } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";


interface CampaignDetailsPageProps {
  params: Promise<{
    campaignId: string;
  }>;
}

export async function generateMetadata({ params }: CampaignDetailsPageProps): Promise<Metadata> {
  const { campaignId } = await params;
  const campaign = await getCampaignById(campaignId);

  if (!campaign) {
    return {
      title: "Campaign Not Found",
      description: "The requested campaign could not be found.",
    }
  }

  return {
    title: `Campaign: ${campaign.name}`,
    description: `Details for the campaign: ${campaign.name}`,
    robots: "noindex", // Protected page
  };
}

export default async function CampaignDetailsPage({ params }: CampaignDetailsPageProps) {
  const { campaignId } = await params;
  const campaign = await getCampaignById(campaignId);

  if (!campaign) {
    notFound();
  }

  let statusBadgeClass = "bg-gray-100 text-gray-700 hover:bg-gray-200";
  switch (campaign.status) {
    case "Active":
      statusBadgeClass = "bg-green-100 text-green-700 hover:bg-green-200";
      break;
    case "Paused":
      statusBadgeClass = "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
      break;
    case "Completed":
      statusBadgeClass = "bg-blue-100 text-blue-700 hover:bg-blue-200";
      break;
    case "Draft":
    default:
      statusBadgeClass = "bg-gray-100 text-gray-700 hover:bg-gray-200";
      break;
  }

  return (
    <div className="flex flex-col h-full max-h-screen overflow-hidden">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0 pr-4 sm:pr-8 md:pr-32">
        <div className="flex-1 min-w-0 pr-4">
          <h1 className="text-2xl font-semibold text-gray-900 truncate">{campaign.name}</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track your campaign performance</p>
        </div>
        <div className="flex-shrink-0">
          <Badge className={statusBadgeClass}>
            <Activity className="h-3 w-3 mr-1" />
            {campaign.status}
          </Badge>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="overview" className="flex flex-col h-full overflow-hidden">
        <TabsList className="grid w-full grid-cols-4 mb-6 sticky top-0 bg-white z-10 mr-4 sm:mr-8 md:mr-32">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="sequence">Sequence</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="flex-1 overflow-hidden">
          <div className="space-y-6 h-full overflow-auto p-1">
            
            {/* Main Statistics Cards - 4 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{campaign.totalLeads}</div>
                    <div className="text-sm text-gray-600 mt-1">Total Leads</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{campaign.contactedLeads}</div>
                    <div className="text-sm text-gray-600 mt-1">Contacted</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{campaign.repliedLeads}</div>
                    <div className="text-sm text-gray-600 mt-1">Replied</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{campaign.convertedLeads}</div>
                    <div className="text-sm text-gray-600 mt-1">Converted</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column - Campaign Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Campaign Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Leads Contacted */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">Leads Contacted</label>
                      <span className="text-sm text-gray-500">{campaign.contactedLeads} / {campaign.totalLeads}</span>
                    </div>
                    <Progress value={(campaign.contactedLeads / (campaign.totalLeads || 1)) * 100} className="h-2" />
                  </div>
                  
                  {/* Acceptance Rate */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">Acceptance Rate</label>
                      <span className="text-sm text-gray-500">{campaign.acceptanceRate}%</span>
                    </div>
                    <Progress value={campaign.acceptanceRate} className="h-2 [&>*]:bg-green-600" />
                  </div>
                  
                  {/* Reply Rate */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">Reply Rate</label>
                      <span className="text-sm text-gray-500">{campaign.replyRate}%</span>
                    </div>
                    <Progress value={campaign.replyRate} className="h-2 [&>*]:bg-orange-500" />
                  </div>

                  {/* Conversion Rate */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">Conversion Rate</label>
                      <span className="text-sm text-gray-500">{campaign.conversionRate}%</span>
                    </div>
                    <Progress value={campaign.conversionRate} className="h-2 [&>*]:bg-purple-600" />
                  </div>
                </CardContent>
              </Card>

              {/* Right Column - Campaign Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Campaign Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Campaign ID</span>
                    <span className="text-sm text-gray-800 font-mono bg-gray-100 px-2 py-1 rounded">{campaign.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Created On</span>
                    <span className="text-sm text-gray-800">{new Date(campaign.createdAt).toLocaleDateString()}</span>
                  </div>
                   <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Target Audience</span>
                    <span className="text-sm text-gray-800">Not specified</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Status</span>
                    <Badge className={statusBadgeClass}>{campaign.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Leads Tab Content */}
        <TabsContent value="leads" className="flex-1 overflow-hidden">
          <LeadsDataTable columns={columns} campaignId={campaignId} />
        </TabsContent>

        {/* Sequence Tab Content */}
        <TabsContent value="sequence" className="flex-1 overflow-auto">
          <div className="space-y-6 p-1">
            
            {/* Main Message Sequence Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Message Sequence</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Preview</Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Save</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column - Available Fields */}
                  <div className="flex flex-col h-full">
                    <div className="flex-1 flex flex-col">
                      <h4 className="text-sm font-semibold text-gray-700 mb-6">Available fields:</h4>
                      <div className="bg-slate-50 border rounded-md p-4 flex-1 min-h-[250px]">
                        <div className="space-y-4">
                          <div className="text-sm">
                            <span className="font-medium text-blue-600">{"{{fullName}}"}</span>
                            <span className="text-gray-700"> - Full Name</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-blue-600">{"{{firstName}}"}</span>
                            <span className="text-gray-700"> - First Name</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-blue-600">{"{{lastName}}"}</span>
                            <span className="text-gray-700"> - Last Name</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-blue-600">{"{{jobTitle}}"}</span>
                            <span className="text-gray-700"> - Job Title</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column - Message Template */}
                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">Message Template</h3>
                      <p className="text-sm text-gray-600 mt-1">Design your message template using the available fields</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border">
                        <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                        <span className="text-sm text-gray-700">
                          Use {"{{field_name}}"} to insert mapped field from your Data
                        </span>
                      </div>
                      
                      <div className="p-4 bg-white border rounded-lg min-h-[200px] max-h-[250px] overflow-y-auto">
                        <div className="text-sm text-gray-700 leading-relaxed">
                          Hi {"{{firstName}}"}, I hope this message finds you well. <br /><br />
                          I came across your profile and was truly impressed by your experience and work at the company. Your background in {"{{jobTitle}}"} caught my attention, and I believe there might be some exciting opportunities we could explore together.<br /><br />
                          I&apos;d love to connect with you and discuss how your expertise could potentially align with some innovative projects we&apos;re working on. Would you be open to a brief conversation? I think it could be mutually beneficial.<br /><br />
                          Looking forward to the possibility of connecting with you, {"{{fullName}}"}.<br /><br />
                          Best regards!
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Connection Message Card */}
            <Card>
              <CardHeader>
                <CardTitle>Connection Message</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Connection Message</h3>
                    <p className="text-sm text-gray-600 mt-1">Edit your connection message here.</p>
                  </div>
                  
                  <div className="p-4 bg-white border rounded-lg min-h-[120px] max-h-[200px] overflow-y-auto">
                    <div className="text-sm text-gray-700 leading-relaxed">
                      Awesome to connect, {"{{FirstName}}"}! Allow me to explain Kandid a bit. So these are consultative safeguarders that engage with visitors like an offline store salesperson does. It helps them with product recommendations based on their preferences/concerns. Here&apos;s a video to help you visualize it better: https://youtu.be/TllOhq_tdn.
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm">Preview</Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Save</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* First Follow-up Message Card */}
            <Card>
              <CardHeader>
                <CardTitle>First Follow-up Message</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">First Follow-up Message</h3>
                    <p className="text-sm text-gray-600 mt-1">Edit your first follow-up message here.</p>
                  </div>
                  
                  <div className="p-4 bg-white border rounded-lg min-h-[120px] max-h-[200px] overflow-y-auto">
                    <div className="text-sm text-gray-700 leading-relaxed">
                      Hey, did you get a chance to go through the video? It was for a brand called Foxtale and they have seen a 4% uplift in their B2C revenue and 8% ROI on Kandid. Would you like to explore a POC for Just Herbs?
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2 p-2 border rounded">
                        <Send className="h-4 w-4" />
                        <span className="text-sm">Send</span>
                      </div>
                      <select className="border rounded px-3 py-2 text-sm">
                        <option>1 day</option>
                        <option>2 days</option>
                        <option>3 days</option>
                        <option>1 week</option>
                      </select>
                      <span className="text-sm text-gray-600">After Welcome Message</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Preview</Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Save</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Second Follow-up Message Card */}
            <Card>
              <CardHeader>
                <CardTitle>Second Follow-up Message</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Second Follow-up Message</h3>
                    <p className="text-sm text-gray-600 mt-1">Edit your second follow-up message here.</p>
                  </div>
                  
                  <div className="p-4 bg-white border rounded-lg min-h-[120px] max-h-[200px] overflow-y-auto">
                    <div className="text-sm text-gray-700 leading-relaxed">
                      Hi {"{{FirstName}}"}, just following up on my message. Just try it for 1 week. No cost. If it doesn&apos;t deliver results, you can remove it.
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2 p-2 border rounded">
                        <Send className="h-4 w-4" />
                        <span className="text-sm">Send</span>
                      </div>
                      <select className="border rounded px-3 py-2 text-sm">
                        <option>1 day</option>
                        <option>2 days</option>
                        <option>3 days</option>
                        <option>1 week</option>
                      </select>
                      <span className="text-sm text-gray-600">After First Follow-up</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Preview</Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Save</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab Content */}
        <TabsContent value="settings" className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-3 p-1">
            
            {/* Combined Campaign Details and AutoPilot Mode Card */}
            <Card>
              <CardContent className="py-2 px-6">
                {/* Campaign Details Section */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Campaign Details</h3>
                  
                  {/* Campaign Name */}
                  <div className="mb-3">
                    <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700 mb-1.5">Campaign Name</label>
                    <Input 
                      id="campaignName" 
                      defaultValue={campaign.name}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Campaign Status */}
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Campaign Status</label>
                    </div>
                    <Switch 
                      defaultChecked={campaign.status === "Active"} 
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>

                  {/* Request without personalization */}
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Request without personalization</label>
                    </div>
                    <Switch className="data-[state=checked]:bg-blue-600" />
                  </div>
                </div>

                {/* AutoPilot Mode Section */}
                <div>
                  {/* AutoPilot Mode Header Box */}
                  <div className="bg-gray-300/30 border border-gray-500/50 rounded-lg p-2.5 mb-3">
                    <h3 className="text-base font-medium text-gray-900 mb-0.5">AutoPilot Mode</h3>
                    <p className="text-sm text-gray-600">Let the system automatically manage LinkedIn account assignments</p>
                  </div>

                  {/* Account Selection Status */}
                  <div className="w-full mb-3 relative">
                    <select className="w-full bg-gray-100 border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 pr-8 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="1">1 account selected</option>
                      <option value="2">2 accounts selected</option>
                      <option value="3">3 accounts selected</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Selected Accounts Section */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Accounts:</h4>
                    <div className="inline-flex items-center gap-1.5 p-1.5 border border-gray-200 rounded-2xl bg-gray-50">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-xs">
                        JL
                      </div>
                      <span className="text-sm text-gray-800 font-medium">Jivesh Lakhani</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone Card */}
            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-900 text-lg font-semibold">Danger Zone</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Irreversible and destructive actions</p>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="border border-red-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Delete Campaign</h4>
                      <p className="text-sm text-gray-600">
                        Permanently delete this campaign and all associated data.
                      </p>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white font-medium ml-4"
                    >
                      Delete Campaign
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
