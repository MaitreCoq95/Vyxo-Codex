"use client"

import { useState } from "react"
import { MoreHorizontal, MapPin, Building2, Phone, Mail, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { EditClientDialog } from "@/components/crm/edit-client-dialog"
import { ClientDetailsDialog } from "@/components/crm/client-details-dialog"
import { useToast } from "@/components/ui/use-toast"

interface ClientCardProps {
  client: {
    id: string
    name: string
    sector: string
    status: "active" | "lead" | "inactive" | "archived"
    logo?: string
    city?: string
    contactName?: string
    contact_email?: string
    contact_phone?: string
    notes?: string
  }
  onRefresh?: () => void
}

export function ClientCard({ client, onRefresh }: ClientCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const statusColors = {
    active: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
    lead: "bg-vyxo-gold/10 text-vyxo-gold hover:bg-vyxo-gold/20",
    inactive: "bg-zinc-500/10 text-zinc-500 hover:bg-zinc-500/20",
    archived: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this client?")) return

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/crm/clients/${client.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete client")

      toast({
        title: "Success",
        description: "Client deleted successfully",
      })

      onRefresh?.()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete client",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <EditClientDialog 
        client={client} 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen}
        onClientUpdated={() => onRefresh?.()} 
      />

      <ClientDetailsDialog
        client={client}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
      />
      
      <Card className="group hover:shadow-md transition-all duration-300 border-l-4 border-l-transparent hover:border-l-vyxo-gold">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 rounded-lg border border-border">
              <AvatarImage src={client.logo} alt={client.name} />
              <AvatarFallback className="rounded-lg bg-vyxo-navy text-white font-bold">
                {client.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg leading-none tracking-tight group-hover:text-vyxo-navy dark:group-hover:text-vyxo-gold transition-colors">
                {client.name}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center mt-1">
                <Building2 className="h-3 w-3 mr-1" /> {client.sector}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" disabled={isDeleting}>
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setShowDetailsDialog(true)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsEditOpen(true)}>Edit Client</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" /> {client.city || "Paris, FR"}
            </div>
            <Badge variant="secondary" className={statusColors[client.status]}>
              {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
