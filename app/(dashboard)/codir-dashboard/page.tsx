"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/codir-module/stat-card";
import { StatusBadge } from "@/components/codir-module/status-badge";
import { ProgressBar } from "@/components/codir-module/progress-bar";
import { DataTable } from "@/components/codir-module/data-table";
import { getDashboardStats, getDecisions, getActions, getProjets, getReunions } from "@/lib/codir-module";
import { formatDate, formatDateRelative, isOverdue } from "@/lib/codir-module/utils";
import type { CodirDashboardStats, CodirDecision, CodirAction, CodirProjet, CodirReunion } from "@/types/codir-module";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Target,
  TrendingUp,
  AlertCircle,
  FileText,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CodirDashboardPage() {
  const [stats, setStats] = useState<CodirDashboardStats | null>(null);
  const [recentDecisions, setRecentDecisions] = useState<CodirDecision[]>([]);
  const [urgentActions, setUrgentActions] = useState<CodirAction[]>([]);
  const [activeProjets, setActiveProjets] = useState<CodirProjet[]>([]);
  const [prochaineCodirData, setProchaineCodirData] = useState<CodirReunion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      const [statsData, decisions, actions, projets, reunions] = await Promise.all([
        getDashboardStats(),
        getDecisions(),
        getActions(),
        getProjets(),
        getReunions(),
      ]);

      setStats(statsData);

      // Recent decisions (last 5)
      setRecentDecisions(decisions.slice(0, 5));

      // Urgent actions (due soon or overdue)
      const today = new Date().toISOString().split('T')[0];
      const urgent = actions
        .filter(a => a.deadline && a.etat !== 'completed')
        .sort((a, b) => (a.deadline || '').localeCompare(b.deadline || ''))
        .slice(0, 5);
      setUrgentActions(urgent);

      // Active projects
      const active = projets.filter(p => p.etat === 'en_cours').slice(0, 5);
      setActiveProjets(active);

      // Prochaine réunion
      const prochaine = reunions.find(r => new Date(r.date) > new Date() && r.statut !== 'terminee');
      setProchaineCodirData(prochaine || null);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
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
        <div className="flex items-center gap-3 text-[hsl(var(--vyxo-navy))] dark:text-[hsl(var(--vyxo-gold))]">
          <Building2 className="h-8 w-8" />
          <h1 className="text-3xl font-bold tracking-tight">Vyxo CODIR — Dashboard</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed">
          Synthèse & Pilotage du Comité de Direction
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Réunions CODIR"
          value={stats?.reunions.total || 0}
          subtitle={stats?.reunions.prochaine ? `Prochaine: ${formatDate(stats.reunions.prochaine.date)}` : 'Aucune planifiée'}
          icon={Calendar}
          color="text-blue-600"
        />
        <StatCard
          title="Décisions Actives"
          value={stats?.decisions.en_cours || 0}
          subtitle={`${stats?.decisions.terminees || 0} terminées`}
          icon={Target}
          color="text-purple-600"
        />
        <StatCard
          title="Actions en Cours"
          value={stats?.actions.in_progress || 0}
          subtitle={`${stats?.actions.en_retard || 0} en retard`}
          icon={CheckCircle2}
          color={stats && stats.actions.en_retard > 0 ? "text-red-600" : "text-green-600"}
        />
        <StatCard
          title="Projets Actifs"
          value={stats?.projets.en_cours || 0}
          subtitle={`${stats?.projets.avancement_moyen || 0}% avancement moyen`}
          icon={TrendingUp}
          color="text-orange-600"
        />
      </div>

      {/* Prochaine Réunion + Risques */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Prochaine Réunion CODIR
            </CardTitle>
          </CardHeader>
          <CardContent>
            {prochaineCodirData ? (
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-lg">{prochaineCodirData.titre}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateLong(prochaineCodirData.date)}
                    </p>
                    {prochaineCodirData.lieu && (
                      <p className="text-sm text-muted-foreground">📍 {prochaineCodirData.lieu}</p>
                    )}
                  </div>
                  <StatusBadge type="reunion" value={prochaineCodirData.statut} />
                </div>
                {prochaineCodirData.objectifs && (
                  <p className="text-sm border-l-2 pl-3">{prochaineCodirData.objectifs}</p>
                )}
                <Link href="/codir-reunions">
                  <Button variant="outline" size="sm" className="w-full">
                    Voir les détails
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Aucune réunion planifiée</p>
                <Link href="/codir-reunions">
                  <Button variant="outline" size="sm" className="mt-4">
                    Planifier une réunion
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Points d'Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats && stats.actions.en_retard > 0 && (
                <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Actions en retard</p>
                    <p className="text-xs text-muted-foreground">
                      {stats.actions.en_retard} action(s) dépassent leur deadline
                    </p>
                  </div>
                </div>
              )}
              {stats && stats.decisions.en_cours === 0 && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Pas de décisions en cours</p>
                    <p className="text-xs text-muted-foreground">
                      Aucune décision active à suivre
                    </p>
                  </div>
                </div>
              )}
              {stats && stats.projets.avancement_moyen < 30 && stats.projets.en_cours > 0 && (
                <div className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Avancement projets faible</p>
                    <p className="text-xs text-muted-foreground">
                      Moyenne d'avancement: {stats.projets.avancement_moyen}%
                    </p>
                  </div>
                </div>
              )}
              {!stats || (stats.actions.en_retard === 0 && stats.decisions.en_cours > 0 && stats.projets.avancement_moyen >= 30) && (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-600" />
                  <p>Tout va bien ! 🎉</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs: Decisions / Actions / Projets */}
      <Tabs defaultValue="decisions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="decisions">
            <FileText className="h-4 w-4 mr-2" />
            Décisions Récentes
          </TabsTrigger>
          <TabsTrigger value="actions">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Actions Urgentes
          </TabsTrigger>
          <TabsTrigger value="projets">
            <Target className="h-4 w-4 mr-2" />
            Projets en Cours
          </TabsTrigger>
        </TabsList>

        <TabsContent value="decisions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dernières Décisions</CardTitle>
              <CardDescription>
                Les 5 décisions les plus récentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={recentDecisions}
                columns={[
                  {
                    key: 'titre',
                    header: 'Décision',
                    render: (item) => (
                      <div>
                        <p className="font-medium">{item.titre}</p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ),
                  },
                  {
                    key: 'theme',
                    header: 'Thème',
                    render: (item) => <StatusBadge type="theme" value={item.theme} />,
                  },
                  {
                    key: 'responsable',
                    header: 'Responsable',
                  },
                  {
                    key: 'impact',
                    header: 'Impact',
                    render: (item) => <StatusBadge type="impact" value={item.impact} />,
                  },
                  {
                    key: 'etat',
                    header: 'État',
                    render: (item) => <StatusBadge type="decision" value={item.etat} />,
                  },
                ]}
                emptyMessage="Aucune décision enregistrée"
              />
              <Link href="/codir-decisions">
                <Button variant="outline" className="w-full mt-4">
                  Voir toutes les décisions
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Actions Prioritaires</CardTitle>
              <CardDescription>
                Actions avec deadline proche ou dépassée
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={urgentActions}
                columns={[
                  {
                    key: 'description',
                    header: 'Action',
                    render: (item) => (
                      <div>
                        <p className="font-medium">{item.description}</p>
                      </div>
                    ),
                  },
                  {
                    key: 'responsable',
                    header: 'Responsable',
                  },
                  {
                    key: 'deadline',
                    header: 'Échéance',
                    render: (item) => (
                      <div className={isOverdue(item.deadline) ? 'text-red-600 font-medium' : ''}>
                        {formatDateRelative(item.deadline)}
                        <div className="text-xs text-muted-foreground">
                          {formatDate(item.deadline)}
                        </div>
                      </div>
                    ),
                  },
                  {
                    key: 'pourcentage_avancement',
                    header: 'Avancement',
                    render: (item) => (
                      <ProgressBar value={item.pourcentage_avancement} showLabel={false} size="sm" />
                    ),
                  },
                  {
                    key: 'etat',
                    header: 'État',
                    render: (item) => <StatusBadge type="action" value={item.etat} />,
                  },
                ]}
                emptyMessage="Aucune action urgente"
              />
              <Link href="/codir-roadmap">
                <Button variant="outline" className="w-full mt-4">
                  Voir la roadmap complète
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Projets en Cours</CardTitle>
              <CardDescription>
                Projets actifs du CODIR
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={activeProjets}
                columns={[
                  {
                    key: 'nom',
                    header: 'Projet',
                    render: (item) => (
                      <div>
                        <p className="font-medium">{item.nom}</p>
                        {item.objectif && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {item.objectif}
                          </p>
                        )}
                      </div>
                    ),
                  },
                  {
                    key: 'responsable',
                    header: 'Responsable',
                  },
                  {
                    key: 'avancement',
                    header: 'Avancement',
                    render: (item) => <ProgressBar value={item.avancement} size="sm" />,
                  },
                  {
                    key: 'deadline',
                    header: 'Deadline',
                    render: (item) => (
                      <div>
                        <div className="text-sm">{formatDateRelative(item.deadline)}</div>
                        <div className="text-xs text-muted-foreground">{formatDate(item.deadline)}</div>
                      </div>
                    ),
                  },
                  {
                    key: 'priorite',
                    header: 'Priorité',
                    render: (item) => <StatusBadge type="priorite" value={item.priorite} />,
                  },
                ]}
                emptyMessage="Aucun projet actif"
              />
              <Link href="/codir-projets">
                <Button variant="outline" className="w-full mt-4">
                  Voir tous les projets
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/codir-reunions">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Nouvelle Réunion
              </Button>
            </Link>
            <Link href="/codir-decisions">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Nouvelle Décision
              </Button>
            </Link>
            <Link href="/codir-projets">
              <Button variant="outline" className="w-full justify-start">
                <Target className="h-4 w-4 mr-2" />
                Nouveau Projet
              </Button>
            </Link>
            <Link href="/codir-kpis">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Voir les KPIs
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
