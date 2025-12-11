"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface AddCompanyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddCompanyDialog({ open, onOpenChange, onSuccess }: AddCompanyDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    sector: "",
    size_range: "",
    location: "",
    linkedin_url: "",
    description: ""
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!formData.name) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom de l'entreprise est requis"
      })
      return
    }

    try {
      setLoading(true)
      
      const res = await fetch('/api/vyxhunter/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'manual'
        })
      })

      if (!res.ok) throw new Error('Failed to create company')

      const data = await res.json()

      toast({
        title: "✅ Entreprise ajoutée !",
        description: `${formData.name} a été ajoutée à VyxHunter`
      })

      // Reset form
      setFormData({
        name: "",
        website: "",
        sector: "",
        size_range: "",
        location: "",
        linkedin_url: "",
        description: ""
      })

      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter l'entreprise"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter une entreprise manuellement</DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle entreprise à votre pipeline VyxHunter
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Nom de l&apos;entreprise *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: TechCorp"
                required
              />
            </div>

            <div>
              <Label htmlFor="website">Site web</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/company/..."
              />
            </div>

            <div>
              <Label htmlFor="sector">Secteur</Label>
              <Input
                id="sector"
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                placeholder="Ex: SaaS, Finance, Santé"
              />
            </div>

            <div>
              <Label htmlFor="size">Taille</Label>
              <select
                id="size"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.size_range}
                onChange={(e) => setFormData({ ...formData, size_range: e.target.value })}
              >
                <option value="">Sélectionner...</option>
                <option value="1-10">1-10 employés</option>
                <option value="11-50">11-50 employés</option>
                <option value="51-200">51-200 employés</option>
                <option value="201-500">201-500 employés</option>
                <option value="501-1000">501-1000 employés</option>
                <option value="1000+">1000+ employés</option>
              </select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ex: Paris, France"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brève description de l'entreprise..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ajout en cours...
                </>
              ) : (
                "Ajouter l'entreprise"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
