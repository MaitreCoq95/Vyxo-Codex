"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { 
  Loader2, 
  Mail, 
  Calendar, 
  MapPin, 
  Building2, 
  Phone, 
  History,
  Sparkles,
  Plus
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

interface Activity {
  id: string
  action: string
  description: string
  created_at: string
  metadata: any
}

interface ClientDetailsDialogProps {
  client: {
    id: string
    name: string
    sector: string
    status: string
    city?: string
    contact_email?: string
    contact_phone?: string
    notes?: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClientDetailsDialog({ client, open, onOpenChange }: ClientDetailsDialogProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [newActivityType, setNewActivityType] = useState<'note' | 'call' | 'meeting' | 'email'>('note')
  const [newActivityText, setNewActivityText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open && client.id) {
      fetchActivities()
    }
  }, [open, client.id])

  async function fetchActivities() {
    try {
      setLoading(true)
      const res = await fetch(`/api/crm/activities?entityId=${client.id}&entityType=client`)
      if (res.ok) {
        const data = await res.json()
        setActivities(data)
      }
    } catch (error) {
      console.error("Failed to fetch activities", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddActivity() {
    if (!newActivityText.trim()) return

    try {
      setIsSubmitting(true)
      const res = await fetch('/api/crm/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity_type: 'client',
          entity_id: client.id,
          action: `manual_${newActivityType}`,
          description: newActivityText,
          metadata: { type: newActivityType }
        })
      })

      if (!res.ok) throw new Error('Failed to add activity')

      setNewActivityText('')
      fetchActivities()
      toast({
        title: "Activity Added",
        description: `New ${newActivityType} logged successfully.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add activity.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-vyxo-navy dark:text-white">
              {client.name}
            </DialogTitle>
            <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
              {client.status}
            </Badge>
          </div>
          <DialogDescription className="flex items-center gap-2">
            <Building2 className="h-3 w-3" /> {client.sector || 'Unknown Sector'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{client.contact_email || 'No email'}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{client.contact_phone || 'No phone'}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{client.city || 'No location'}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Added {format(new Date(), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>

        {client.notes && (
          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md text-sm text-muted-foreground mb-4">
            <p className="font-semibold mb-1 text-xs uppercase tracking-wider">Notes</p>
            {client.notes}
          </div>
        )}

        <Separator />

        <div className="mt-4 mb-4">
          <div className="flex gap-2 mb-2">
            <Button 
              variant={newActivityType === 'note' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setNewActivityType('note')}
              className="h-7 text-xs"
            >
              Note
            </Button>
            <Button 
              variant={newActivityType === 'call' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setNewActivityType('call')}
              className="h-7 text-xs"
            >
              Call
            </Button>
            <Button 
              variant={newActivityType === 'meeting' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setNewActivityType('meeting')}
              className="h-7 text-xs"
            >
              Meeting
            </Button>
            <Button 
              variant={newActivityType === 'email' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setNewActivityType('email')}
              className="h-7 text-xs"
            >
              Email
            </Button>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder={`Add a ${newActivityType} note...`}
              value={newActivityText}
              onChange={(e) => setNewActivityText(e.target.value)}
              className="h-8 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleAddActivity()
                }
              }}
            />
            <Button 
              size="sm" 
              className="h-8 bg-vyxo-gold text-vyxo-navy hover:bg-vyxo-gold/90"
              onClick={handleAddActivity}
              disabled={!newActivityText.trim() || isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
            <History className="h-4 w-4 text-vyxo-gold" /> Activity Timeline
          </h3>
          
          <ScrollArea className="flex-1 pr-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-vyxo-gold" />
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No activities recorded yet.
              </div>
            ) : (
              <div className="space-y-4 pl-2 border-l-2 border-slate-100 dark:border-slate-800 ml-2">
                {activities.map((activity) => (
                  <div key={activity.id} className="relative pl-6 pb-2">
                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-white dark:bg-slate-950 border-2 border-vyxo-gold" />
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(activity.created_at), 'MMM d, h:mm a')}
                      </span>
                      <p className="font-medium text-sm text-vyxo-navy dark:text-white">
                        {activity.description}
                      </p>
                      {activity.action === 'campaign_generated' && activity.metadata?.variations && (
                        <Card className="mt-2 bg-slate-50 dark:bg-slate-900 border-none">
                          <CardContent className="p-3 text-xs font-mono text-muted-foreground">
                            <div className="flex items-center gap-1 mb-2 text-vyxo-gold font-semibold">
                              <Sparkles className="h-3 w-3" /> AI Campaign
                            </div>
                            Subject: {activity.metadata.variations[0].subject}
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
