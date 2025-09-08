"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function CampaignsLoading() {
  return (
    <div className="flex flex-col h-full">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tab Navigation Skeleton */}
      <div className="flex-1 flex flex-col">
        <div className="flex space-x-1 mb-6">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-24" />
        </div>

        {/* Data Table Skeleton */}
        <Card className="h-full flex flex-col">
          {/* Search and Filter Header Skeleton */}
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
          
          {/* Table Content Skeleton */}
          <CardContent className="flex-1 overflow-y-auto hide-scrollbar">
            {/* Table Header Skeleton */}
            <div className="grid grid-cols-5 gap-4 py-3 border-b border-gray-200 bg-gray-50">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Table Rows Skeleton */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-4 py-4 border-b border-gray-100">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-4 w-12" />
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-6" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-6" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-6" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-6" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-6" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>

          {/* Pagination Footer Skeleton */}
          <div className="p-6 border-t bg-white flex-shrink-0">
            <div className="flex items-center justify-end space-x-2">
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
