"use client";

import { useState, useTransition } from "react";
import { ProjectWithDetails } from "@/types/bucket-project";
import { CodirMember } from "@/types/codir";
import ProjectCard from "./ProjectCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { createProject, updateProjectStatus } from "@/app/(dashboard)/vyxo-projets/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription as SheetDesc } from "@/components/ui/sheet"; // Use alias if needed or just remove if we decided on Dialog
import { Badge } from "@/components/ui/badge";

function NewProjectDialog({ members }: { members: CodirMember[] }) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Consulting",
        subcategory: "",
        owner_id: members[0]?.id || "",
        priority: "medium",
        time_horizon: "moyen terme"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createProject(formData);
        setOpen(false);
        setFormData({ ...formData, title: "", description: "" });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[hsl(var(--vyxo-navy))] text-[hsl(var(--vyxo-gold))]">
                    <Plus className="w-4 h-4 mr-2" /> Nouveau Projet
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Lancer un Projet</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label>Titre du Projet</Label>
                        <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Catégorie</Label>
                            <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {["Consulting", "SaaS / Produit digital", "Hardware", "Expérience", "Formation"].map(c => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Owner (Leader)</Label>
                            <Select value={formData.owner_id} onValueChange={v => setFormData({...formData, owner_id: v})}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {members.map(m => (
                                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button type="submit" className="w-full">Créer Projet</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}



export default function ProjectBoard({ projects, members }: { projects: ProjectWithDetails[], members: CodirMember[] }) {
    
    // Statuses
    const columns = [
        { id: 'draft', label: 'Draft / Cadrage' },
        { id: 'discovery', label: 'Discovery' },
        { id: 'design', label: 'Design' },
        { id: 'build', label: 'Build' },
        { id: 'launch', label: 'Launch' },
        { id: 'live', label: 'Live' }
        // Parked / Archived could be separate view or end columns
    ];

    const [selectedProject, setSelectedProject] = useState<ProjectWithDetails | null>(null);

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Pipeline Projets</h2>
                <NewProjectDialog members={members} />
            </div>

            <div className="flex-1 overflow-x-auto">
                <div className="flex gap-4 h-full min-w-[1600px]">
                    {columns.map(col => (
                        <div key={col.id} className="w-72 flex-shrink-0 flex flex-col bg-muted/30 rounded-lg border">
                            <div className="p-3 border-b font-medium bg-muted/50 rounded-t-lg flex justify-between items-center text-sm">
                                {col.label}
                                <span className="text-xs bg-background px-2 py-0.5 rounded-full border">
                                    {projects.filter(p => p.status === col.id).length}
                                </span>
                            </div>
                            <div className="p-3 flex-1 overflow-y-auto space-y-3">
                                {projects.filter(p => p.status === col.id).map(project => (
                                    <ProjectCard 
                                        key={project.id} 
                                        project={project}
                                        onClick={() => setSelectedProject(project)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedProject && (
                <ProjectDetailModal 
                    project={selectedProject} 
                    members={members}
                    isOpen={!!selectedProject} 
                    onClose={() => setSelectedProject(null)} 
                />
            )}
        </div>
    );
}

// Inline Detail Modal for simplicity in this file for now

function ProjectDetailModal({ project, members, isOpen, onClose }: { project: ProjectWithDetails, members: CodirMember[], isOpen: boolean, onClose: () => void }) {
    const [isPending, startTransition] = useTransition();

    const handleStatusMove = (newStatus: string) => {
        startTransition(async () => {
            await updateProjectStatus(project.id, newStatus);
            onClose();
        });
    }

    const nextStatusMap: Record<string, string> = {
        'draft': 'discovery',
        'discovery': 'design',
        'design': 'build',
        'build': 'launch',
        'launch': 'live',
        'live': 'archived'
    };
    
    const owner = members.find(m => m.id === project.owner_id);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge>{project.category}</Badge>
                        <Badge variant="outline">{project.status}</Badge>
                    </div>
                    <DialogTitle className="text-2xl">{project.title}</DialogTitle>
                    <DialogDescription>
                        Owner: {owner?.name || 'Unassigned'} • Créé le {new Date(project.created_at).toLocaleDateString()}
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                    <div>
                        <h3 className="font-semibold text-sm mb-2">Description</h3>
                        <p className="text-sm text-foreground/80">{project.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                         <div className="p-3 bg-muted rounded">
                             <span className="text-xs text-muted-foreground uppercase block mb-1">Revenu Espéré</span>
                             <span className="font-mono font-bold text-lg">
                                 {project.expected_revenue ? `${project.expected_revenue}€` : '-'}
                             </span>
                         </div>
                         <div className="p-3 bg-muted rounded">
                             <span className="text-xs text-muted-foreground uppercase block mb-1">Priorité</span>
                             <span className="font-bold capitalize">{project.priority || '-'}</span>
                         </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                        {/* Move Forward Action */}
                        {nextStatusMap[project.status] && (
                            <Button onClick={() => handleStatusMove(nextStatusMap[project.status])} disabled={isPending}>
                                Passer en {nextStatusMap[project.status]}
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
