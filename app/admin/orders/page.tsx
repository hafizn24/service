"use client"

import { useState, useMemo, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import type { ServiceOrderExtended } from "@/lib/types/order"
import { getOrders } from "@/app/actions/orders"
import { useOrdersData, useOrderActions } from "./_hooks/use-orders"
import { getOrdersColumnConfig } from "./_config/columns"
import { OrderDeleteDialog } from "./_components/order-delete-dialog"
import { GenericDataTable } from "@/components/admin/generic-data-table"
import placeholderData from "./data.json"

// Configuration flag - set to true to use real database, false for placeholder data
const USE_REAL_DATA = false

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all-orders")
  const [isLoading, setIsLoading] = useState(true)

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders()
  }, [])

  // Fetch orders from database or use placeholder data
  const fetchOrders = async () => {
    try {
      setIsLoading(true)

      if (USE_REAL_DATA) {
        const data = await getOrders()
        setOrders(data)
      } else {
        // Simulate API delay for placeholder data
        await new Promise((resolve) => setTimeout(resolve, 500))
        setOrders(placeholderData as ServiceOrderExtended[])
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error("Failed to load orders", {
        description: "Please refresh the page.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const {
    orders,
    setOrders,
    allOrders,
    pendingPaymentOrders,
    pendingWorkOrders,
    completedWorkOrders,
  } = useOrdersData(placeholderData as ServiceOrderExtended[])

  const {
    handleRowEdit,
    handleRowDelete,
    handleAddNew,
    confirmDelete,
    isDeleting,
    deleteDialogOpen,
    setDeleteDialogOpen,
    orderToDelete,
  } = useOrderActions()

  // Get column configuration
  const customColumns = useMemo(() => getOrdersColumnConfig(), [])

  // Handle delete confirmation with local state update
  const handleConfirmDelete = async () => {
    await confirmDelete(() => {
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.so_id !== orderToDelete?.so_id)
      )
    })
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading orders...</p>
      </div>
    )
  }

  const tableProps = {
    idField: "so_id" as const,
    enableDragDrop: false,
    enableSelection: true,
    enablePagination: true,
    enableActions: true,
    pageSize: 10,
    customColumns,
    onRowEdit: handleRowEdit,
    onRowDelete: handleRowDelete,
    onAddNew: handleAddNew,
    addButtonLabel: "New Order",
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="px-4 lg:px-6">
          {!USE_REAL_DATA && (
            <Badge variant="outline" className="mt-2">
              Using placeholder data
            </Badge>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile: Vertical tabs with full width */}
          <TabsList className="hidden sm:inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground mx-4 lg:mx-6">
            <TabsTrigger value="all-orders" className="relative">
              All Orders
              <Badge variant="outline" className="ml-2 rounded-full h-5 min-w-[1.25rem] px-1">
                {allOrders.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="payment-pending" className="relative">
              Pending Payments
              <Badge variant="outline" className="ml-2 rounded-full h-5 min-w-[1.25rem] px-1">
                {pendingPaymentOrders.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="work-pending" className="relative">
              Pending Work
              <Badge variant="outline" className="ml-2 rounded-full h-5 min-w-[1.25rem] px-1">
                {pendingWorkOrders.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="work-completed" className="relative">
              Completed Work
              <Badge variant="outline" className="ml-2 rounded-full h-5 min-w-[1.25rem] px-1">
                {completedWorkOrders.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Mobile: Scrollable pill-style tabs */}
          <div className="sm:hidden mx-4 overflow-x-auto scrollbar-hide">
            <TabsList className="flex w-max gap-2 rounded-md bg-muted p-1 text-muted-foreground">
              <TabsTrigger
                value="all-orders"
                className="flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-primary"
              >
                All Orders
                <Badge
                  variant="outline"
                  className="rounded-full h-4 min-w-[1rem] px-1 text-[10px]"
                >
                  {allOrders.length}
                </Badge>
              </TabsTrigger>

              <TabsTrigger
                value="payment-pending"
                className="flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-primary"
              >
                Pending Pay
                <Badge
                  variant="outline"
                  className="rounded-full h-4 min-w-[1rem] px-1 text-[10px]"
                >
                  {pendingPaymentOrders.length}
                </Badge>
              </TabsTrigger>

              <TabsTrigger
                value="work-pending"
                className="flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-primary"
              >
                Pending Work
                <Badge
                  variant="outline"
                  className="rounded-full h-4 min-w-[1rem] px-1 text-[10px]"
                >
                  {pendingWorkOrders.length}
                </Badge>
              </TabsTrigger>

              <TabsTrigger
                value="work-completed"
                className="flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-primary"
              >
                Completed
                <Badge
                  variant="outline"
                  className="rounded-full h-4 min-w-[1rem] px-1 text-[10px]"
                >
                  {completedWorkOrders.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab 1: All Orders */}
          <TabsContent value="all-orders" className="mt-4">
            <GenericDataTable
              data={allOrders}
              {...tableProps}
            />
          </TabsContent>

          {/* Tab 2: Pending Payment Orders */}
          <TabsContent value="payment-pending" className="mt-4">
            <GenericDataTable
              data={pendingPaymentOrders}
              {...tableProps}
            />
          </TabsContent>

          {/* Tab 3: Pending Work Orders */}
          <TabsContent value="work-pending" className="mt-4">
            <GenericDataTable
              data={pendingWorkOrders}
              {...tableProps}
            />
          </TabsContent>

          {/* Tab 4: Completed Work Orders */}
          <TabsContent value="work-completed" className="mt-4">
            <GenericDataTable
              data={completedWorkOrders}
              {...tableProps}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <OrderDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        order={orderToDelete}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}