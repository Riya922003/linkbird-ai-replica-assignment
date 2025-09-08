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
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getLeads } from "@/app/actions/leads"
import { Lead } from "@/components/leads/columns"
import { useLeadSheetStore } from "@/store/lead-sheet-store"
import { Search, Filter } from "lucide-react"

interface DataTableProps {
  columns: ColumnDef<Lead, unknown>[]
  campaignId?: string
}

export function LeadsDataTable({
  columns,
  campaignId,
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

  // Sheet store for opening lead details
  const { onOpen } = useLeadSheetStore()

  // Set up infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["leads", campaignId],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const result = await getLeads({ 
        pageParam: pageParam, 
        limit: 10,
        campaignId: campaignId 
      })
      
      // Store totalCount in ref for use in getNextPageParam
      totalCountRef.current = result.totalCount
      
      // Transform database leads to match the UI format
      return result.leads.map((lead) => {
        return {
          id: lead.id,
          name: lead.name,
          email: lead.email,
          company: lead.company || "",
          jobTitle: lead.jobTitle || "", // Use actual jobTitle from database
          campaignName: lead.campaign?.name || "Unknown Campaign",
          description: lead.description || "",
          status: lead.status as "Pending" | "Contacted" | "Responded" | "Converted",
          activity: lead.lastContacted 
            ? `Last contacted ${new Date(lead.lastContacted).toLocaleDateString()}`
            : "No activity yet",
          activityLevel: 0, // TODO: Calculate based on actual activity data
          lastContacted: lead.lastContacted?.toISOString() || null,
          createdAt: lead.createdAt.toISOString(),
        }
      }) as Lead[]
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Calculate total number of leads fetched so far
      const totalFetched = allPages.reduce((sum, page) => sum + page.length, 0)
      
      // If we have fetched fewer leads than the total count, fetch the next page
      if (totalFetched < totalCountRef.current) {
        return allPages.length + 1
      }
      
      // Otherwise, stop fetching
      return undefined
    },
    enabled: true, // Always enable the query
  })

  // Flatten all pages into a single array
  const allLeads = React.useMemo(() => {
    return data?.pages.flatMap(page => page) ?? []
  }, [data])

  // Filter and search leads
  const filteredLeads = React.useMemo(() => {
    return allLeads.filter(lead => {
      const matchesSearch = searchTerm === "" || 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.campaignName.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [allLeads, searchTerm, statusFilter])

  const table = useReactTable({
    data: filteredLeads,
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
  if (isLoading && allLeads.length === 0) {
    return (
      <Card className="h-full flex flex-col">
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

  if (error && allLeads.length === 0) {
    return (
      <Card className="h-full flex flex-col p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-destructive">Error loading leads: {error.message}</div>
        </div>
      </Card>
    )
  }

    return (
    <Card className="h-full flex flex-col">
      {/* Search and Filter Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 h-4 w-4" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Responded">Responded</SelectItem>
                <SelectItem value="Converted">Converted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {(searchTerm || statusFilter !== "all") && (
          <div className="mt-2 text-sm text-gray-500">
            Showing {filteredLeads.length} of {allLeads.length} leads
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
                      onOpen(row.original)
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
                          <div className="text-muted-foreground">Loading more leads...</div>
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
