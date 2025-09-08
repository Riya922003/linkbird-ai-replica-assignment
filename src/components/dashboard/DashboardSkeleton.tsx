import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Dashboard Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-32" />
      </div>

      {/* Main Dashboard Grid */}
      <div className="flex flex-1 gap-6 min-h-0">
        {/* Left Column */}
        <div className="flex flex-col gap-6 w-1/2">
          {/* Campaigns Card Skeleton */}
          <div className="flex-1">
            <Card className="h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 flex-shrink-0">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-28" />
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* LinkedIn Accounts Card Skeleton */}
          <div className="flex-1">
            <Card className="h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                <Skeleton className="h-6 w-36" />
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-1/2 h-full">
          {/* Recent Activity Card Skeleton */}
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 flex-shrink-0">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-28" />
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4 text-xs font-medium text-slate-500 border-b pb-3">
                  <Skeleton className="h-3 w-8" />
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-3 gap-4 items-center border-t py-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
