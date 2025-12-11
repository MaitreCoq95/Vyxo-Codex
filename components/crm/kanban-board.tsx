"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { MoreHorizontal, Plus, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { type Engagement } from "@/lib/supabase"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { AddDealDialog } from "./add-deal-dialog"

// Map Supabase statuses to Kanban columns
const statusToColumn: Record<string, string> = {
  'draft': 'proposal',
  'active': 'negotiation',
  'completed': 'closed',
  'paused': 'contacted',
  'cancelled': 'new'
}

// Reverse map for updating Supabase
const columnToStatus: Record<string, string> = {
  'proposal': 'draft',
  'negotiation': 'active',
  'closed': 'completed',
  'contacted': 'paused',
  'new': 'cancelled'
}

type KanbanItem = Engagement & {
  client_name: string
}

export function KanbanBoard() {
  const [columns, setColumns] = useState<Record<string, KanbanItem[]>>({
    new: [],
    contacted: [],
    proposal: [],
    negotiation: [],
    closed: []
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  async function fetchPipeline() {
    try {
      const response = await fetch('/api/crm/pipeline')
      if (!response.ok) throw new Error('Failed to fetch pipeline')
      const data = await response.json()
      
      const engagements = data.engagements || []
      
      // Group by status
      const newColumns: Record<string, KanbanItem[]> = {
        new: [],
        contacted: [],
        proposal: [],
        negotiation: [],
        closed: []
      }

      engagements.forEach((eng: any) => {
        const columnKey = statusToColumn[eng.status] || 'new'
        if (newColumns[columnKey]) {
          newColumns[columnKey].push({
            ...eng,
            client_name: eng.vch_clients?.name || 'Unknown Client'
          })
        }
      })

      setColumns(newColumns)
    } catch (error) {
      console.error('Error fetching pipeline:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPipeline()
  }, [])

  async function updateStatus(engagementId: string, newStatus: string, targetColumn: string) {
    try {
      const response = await fetch(`/api/crm/pipeline/${engagementId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) throw new Error('Failed to update status')

      toast({
        title: "Status Updated",
        description: `Moved to ${targetColumn.charAt(0).toUpperCase() + targetColumn.slice(1)}`,
      })
    } catch (error) {
      console.error('Failed to update status:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save changes. Reverting...",
      })
      fetchPipeline() // Revert on error
    }
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result

    // Dropped outside the list
    if (!destination) {
      return
    }

    // Dropped in the same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return
    }

    // Moving between columns
    const sourceColumn = columns[source.droppableId]
    const destColumn = columns[destination.droppableId]
    const sourceItems = [...sourceColumn]
    const destItems = [...destColumn]
    const [removed] = sourceItems.splice(source.index, 1)

    if (source.droppableId === destination.droppableId) {
      // Reordering in same column
      sourceItems.splice(destination.index, 0, removed)
      setColumns({
        ...columns,
        [source.droppableId]: sourceItems
      })
    } else {
      // Moving to different column
      const newStatus = columnToStatus[destination.droppableId]
      if (!newStatus) return

      destItems.splice(destination.index, 0, { ...removed, status: newStatus as any })
      setColumns({
        ...columns,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destItems
      })

      updateStatus(draggableId, newStatus, destination.droppableId)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-vyxo-gold" />
      </div>
    )
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-full gap-6 overflow-x-auto pb-4">
        {Object.entries(columns).map(([columnId, items]) => (
          <div key={columnId} className="w-[300px] min-w-[300px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                {columnId}
              </h3>
              <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800">
                {items.length}
              </Badge>
            </div>
            
            <Droppable droppableId={columnId}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex-1 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl p-2 border border-dashed border-slate-200 dark:border-slate-800 min-h-[150px]"
                >
                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Card className="hover:shadow-md transition-shadow border-none shadow-sm">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <Badge variant="outline" className="text-xs border-vyxo-gold/50 text-vyxo-gold bg-vyxo-gold/5">
                                    €{item.budget_amount?.toLocaleString() || '0'}
                                  </Badge>
                                  
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-2">
                                        <MoreHorizontal className="h-3 w-3" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuItem>View Details</DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                                <h4 className="font-semibold text-sm">{item.client_name}</h4>
                                <p className="text-xs text-muted-foreground mb-3">{item.name}</p>
                                <div className="flex items-center justify-between">
                                  <Avatar className="h-6 w-6">
                                      <AvatarFallback className="text-[10px] bg-vyxo-navy text-white">
                                          {item.client_name.charAt(0)}
                                      </AvatarFallback>
                                  </Avatar>
                                  <div className="text-[10px] text-zinc-400">
                                    {new Date(item.created_at).toLocaleDateString()}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                  
                  <AddDealDialog onDealAdded={fetchPipeline} />
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}
