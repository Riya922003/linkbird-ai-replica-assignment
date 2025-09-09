"use client"

import * as React from "react"
import { useEffect } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getCampaignsWithStats } from "@/app/actions/campaigns"
import { Campaign } from "@/components/campaigns/columns"
import { Search } from "lucide-react"

interface DataTableProps {
  columns: ColumnDef<Campaign, unknown>[]
}

export function CampaignsDataTable({
  columns,
}: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")

  // Store totalCount from server
  const totalCountRef = React.useRef<number>(0)

  // Infinite scroll trigger
  const { ref, inView } = useInView()

  // Set up infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["campaigns", statusFilter],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const result = await getCampaignsWithStats({ pageParam: pageParam, limit: 15 })
      
      // Store totalCount in ref for use in getNextPageParam
      totalCountRef.current = result.totalCount
      
      // Transform database campaigns to match the UI format
      return result.campaigns.map((campaign) => {
        return {
          id: campaign.id,
          name: campaign.name,
          status: campaign.status as "Active" | "Paused" | "Draft",
          totalLeads: campaign.totalLeads,
          requestsSent: campaign.requestsSent,
          requestsAccepted: campaign.requestsAccepted,
          requestsPending: campaign.requestsPending,
          connectionsEstablished: campaign.connectionsEstablished,
          messagesReplied: campaign.messagesReplied,
        }
      }) as Campaign[]
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Calculate total number of campaigns fetched so far
      const totalFetched = allPages.reduce((sum, page) => sum + page.length, 0)
      
      // If we have fetched fewer campaigns than the total count, fetch the next page
      if (totalFetched < totalCountRef.current) {
        return allPages.length + 1
      }
      
      // Otherwise, stop fetching
      return undefined
    },
    enabled: true, // Always enable the query
  })

  // Flatten all pages into a single array
  const allCampaigns = React.useMemo(() => {
    return data?.pages.flatMap(page => page) ?? []
  }, [data])

  // Filter and search campaigns
  const filteredCampaigns = React.useMemo(() => {
    return allCampaigns.filter(campaign => {
      const matchesSearch = searchTerm === "" || 
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.id.toLowerCase().includes(searchTerm.toLowerCase())
      
      let matchesStatus = false
      if (statusFilter === "all") {
        matchesStatus = true
      } else if (statusFilter === "Active") {
        matchesStatus = campaign.status === "Active"
      } else if (statusFilter === "Inactive") {
        matchesStatus = campaign.status === "Paused" || campaign.status === "Draft"
      }
      
      return matchesSearch && matchesStatus
    })
  }, [allCampaigns, searchTerm, statusFilter])

  const table = useReactTable({
    data: filteredCampaigns,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
  })

  // Scroll-based infinite loading (disabled - using intersection observer instead)
  const tableContainerRef = React.useRef<HTMLDivElement>(null)

  // Intersection observer-based infinite loading
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage])

  // Handle loading and error states
  if (isLoading && allCampaigns.length === 0) {
    return (
      <Card className="h-full flex flex-col shadow-lg border-gray-200">
        {/* Search and Filter Header */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="w-40 h-10 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        
        {/* Skeleton Table */}
        <div className="flex-1 p-4">
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded">
                <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-1/6" />
                </div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  if (error && allCampaigns.length === 0) {
    return (
      <Card className="h-full flex flex-col p-6 shadow-lg border-gray-200">
        <div className="flex items-center justify-center h-32">
          <div className="text-destructive">Error loading campaigns: {error.message}</div>
        </div>
      </Card>
    )
  }

    return (
    <Card className="h-full flex flex-col shadow-lg border-gray-200">
      {/* Search and Filter Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant={statusFilter === "all" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
              className={`text-sm ${
                statusFilter === "all" 
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300" 
                  : ""
              }`}
            >
              All Campaigns
            </Button>
            <Button
              variant={statusFilter === "Active" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("Active")}
              className="text-sm"
            >
              Active
            </Button>
            <Button
              variant={statusFilter === "Inactive" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("Inactive")}
              className="text-sm"
            >
              Inactive
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        {(searchTerm || statusFilter !== "all") && (
          <div className="mt-2 text-sm text-gray-500">
            Showing {filteredCampaigns.length} of {allCampaigns.length} campaigns
          </div>
        )}
      </div>
      
      {/* Table Content Area */}
      <div
        ref={tableContainerRef}
        className="flex-1 overflow-y-auto hide-scrollbar"
      >
        <Table>
          <TableHeader className="sticky top-0 bg-gray-50 border-b border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-gray-50">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="font-medium text-gray-700 py-3">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              <>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={(e) => {
                      e.preventDefault()
                      // TODO: Add campaign detail sheet functionality
                    }}
                    className="cursor-pointer hover:bg-gray-50 border-b border-gray-100"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                
                {/* Intersection observer trigger row - place at the end of table */}
                {hasNextPage && (
                  <TableRow ref={ref}>
                    <TableCell
                      colSpan={columns.length}
                      className="h-16 text-center"
                    >
                      {isFetchingNextPage ? (
                        <div className="flex items-center justify-center">
                          <div className="text-muted-foreground">Loading more campaigns...</div>
                        </div>
                      ) : (
                        <div className="text-muted-foreground text-sm">Scroll to load more...</div>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
