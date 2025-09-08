import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CampaignsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-28" />
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div className="flex items-center justify-between py-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-16" />
              </div>
              {i < 5 && <div className="h-1 bg-gray-300/85 rounded-full mx-2 mb-3"></div>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function RecentActivityCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-28" />
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          <div className="grid grid-cols-3 gap-4 text-xs font-medium text-slate-500 border-b pb-3">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
          
          <div>
            {Array.from({ length: 5 }).map((_, i) => (
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
        </div>
      </CardContent>
    </Card>
  );
}
