"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/codir-module/data-table";
import { StatusBadge } from "@/components/codir-module/status-badge";
import { getReunions } from "@/lib/codir-module";
import { formatDate, formatDateLong } from "@/lib/codir-module/utils";
import type { CodirReunion } from "@/types/codir-module";
import { Calendar, Plus, Users } from "lucide-react";

export default function CodirReunionsPage() {
  const [reunions, setReunions] = useState<CodirReunion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReunions();
  }, []);

  async function loadReunions() {
    try {
      setLoading(true);
      const data = await getReunions();
      setReunions(data);
    } catch (error) {
      console.error('Erreur chargement réunions:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[hsl(var(--vyxo-navy))] dark:text-[hsl(var(--vyxo-gold))]">
            <Calendar className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Réunions CODIR</h1>
              <p className="text-muted-foreground text-lg">
                Historique et planification des réunions
              </p>
            </div>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Réunion
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Réunions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reunions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Planifiées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reunions.filter(r => r.statut === 'planifiee').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Terminées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reunions.filter(r => r.statut === 'terminee').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des réunions */}
      <Card>
        <CardHeader>
          <CardTitle>Toutes les Réunions</CardTitle>
          <CardDescription>
            Historique complet des réunions CODIR
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={reunions}
            columns={[
              {
                key: 'date',
                header: 'Date',
                render: (item) => (
                  <div>
                    <div className="font-medium">{formatDate(item.date)}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDateLong(item.date)}
                    </div>
                  </div>
                ),
              },
              {
                key: 'titre',
                header: 'Titre',
                render: (item) => (
                  <div>
                    <p className="font-medium">{item.titre}</p>
                    {item.lieu && (
                      <p className="text-xs text-muted-foreground">📍 {item.lieu}</p>
                    )}
                  </div>
                ),
              },
              {
                key: 'participants',
                header: 'Participants',
                render: (item) => (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{item.participants.length}</span>
                  </div>
                ),
              },
              {
                key: 'statut',
                header: 'Statut',
                render: (item) => <StatusBadge type="reunion" value={item.statut} />,
              },
              {
                key: 'actions',
                header: '',
                render: (item) => (
                  <Button variant="ghost" size="sm">
                    Détails
                  </Button>
                ),
              },
            ]}
            emptyMessage="Aucune réunion enregistrée"
          />
        </CardContent>
      </Card>
    </div>
  );
}
