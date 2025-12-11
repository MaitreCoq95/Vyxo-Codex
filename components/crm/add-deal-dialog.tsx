"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  name: z.string().min(2, "Deal name is required"),
  client_id: z.string().min(1, "Client is required"),
  budget_amount: z.number().min(0, "Amount must be positive"),
  status: z.string(),
})

interface AddDealDialogProps {
  onDealAdded: () => void
}

export function AddDealDialog({ onDealAdded }: AddDealDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState<any[]>([])
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      client_id: "",
      budget_amount: 0,
      status: "draft",
    },
  })

  useEffect(() => {
    if (open) {
      fetchClients()
    }
  }, [open])

  async function fetchClients() {
    try {
      const res = await fetch('/api/crm/clients')
      if (res.ok) {
        const data = await res.json()
        setClients(data.clients || [])
      }
    } catch (error) {
      console.error("Failed to fetch clients", error)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      const response = await fetch("/api/crm/pipeline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to create deal")
      }

      toast({
        title: "Success",
        description: "Deal created successfully",
      })

      setOpen(false)
      form.reset()
      onDealAdded()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create deal. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full mt-2 text-zinc-400 hover:text-vyxo-navy hover:bg-white border border-transparent hover:border-dashed hover:border-slate-300">
          <Plus className="h-4 w-4 mr-2" /> Add Deal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Deal</DialogTitle>
          <DialogDescription>
            Create a new opportunity in your pipeline.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deal Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Q4 Audit Project" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budget_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Value (€)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Stage</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Proposal (Draft)</SelectItem>
                      <SelectItem value="active">Negotiation (Active)</SelectItem>
                      <SelectItem value="paused">Contacted (Paused)</SelectItem>
                      <SelectItem value="completed">Closed Won</SelectItem>
                      <SelectItem value="cancelled">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={loading} className="bg-vyxo-navy text-white hover:bg-vyxo-navy/90">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Deal
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
