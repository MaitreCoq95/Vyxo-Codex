"use client";

import { useState } from "react";
import { IdeaWithVotes } from "@/types/bucket-project";
import { CodirMember } from "@/types/codir";
import IdeaCard from "./IdeaCard";
import IdeaDetail from "./IdeaDetail";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createIdea } from "@/app/(dashboard)/vyxo-bucket/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Internal simple form for adding idea
function NewIdeaFormComp({ members, currentUser, onClose }: { members: CodirMember[], currentUser: CodirMember | null, onClose: () => void }) {
    return <div className="p-4">Formulaire création (Please use NewIdeaDialog)</div>
}

export default function IdeaBoard({ ideas, members }: { ideas: IdeaWithVotes[], members: CodirMember[] }) {
    const [selectedIdea, setSelectedIdea] = useState<IdeaWithVotes | null>(null);
    const [currentUser, setCurrentUser] = useState<CodirMember | null>(members[0] || null); // Simulating auth with dropdown
    
    // Columns
    const columns = [
        { id: 'idea', label: 'Idées Brutes' },
        { id: 'under_review', label: 'En Revue CODIR' },
        { id: 'approved', label: 'Validées' },
        { id: 'rejected', label: 'Rejetées' },
        { id: 'converted_to_project', label: 'En Projet' }
    ];

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Header controls */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                     <h2 className="text-lg font-semibold">Vue Kanban</h2>
                     {/* Identity Switcher for Demo */}
                     <div className="flex items-center gap-2 text-sm bg-muted px-3 py-1 rounded-full">
                        <span className="text-muted-foreground">Je suis :</span>
                        <Select value={currentUser?.id} onValueChange={(uid) => setCurrentUser(members.find(m => m.id === uid) || null)}>
                            <SelectTrigger className="h-8 border-none bg-transparent shadow-none focus:ring-0 w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {members.map(m => (
                                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                     </div>
                </div>
                
                <NewIdeaDialog members={members} currentUser={currentUser} />
            </div>

            {/* Board */}
            <div className="flex-1 overflow-x-auto">
                <div className="flex gap-4 h-full min-w-[1200px]">
                    {columns.map(col => (
                        <div key={col.id} className="w-80 flex-shrink-0 flex flex-col bg-muted/30 rounded-lg border">
                            <div className="p-3 border-b font-medium bg-muted/50 rounded-t-lg flex justify-between items-center">
                                {col.label}
                                <span className="text-xs bg-background px-2 py-0.5 rounded-full border">
                                    {ideas.filter(i => i.status === col.id).length}
                                </span>
                            </div>
                            <div className="p-3 flex-1 overflow-y-auto space-y-3">
                                {ideas.filter(i => i.status === col.id).map(idea => (
                                    <IdeaCard 
                                        key={idea.id} 
                                        idea={idea} 
                                        voteCount={{
                                            yes: idea.votes?.filter(v => v.vote === 'yes').length || 0,
                                            no: idea.votes?.filter(v => v.vote === 'no').length || 0,
                                            total: idea.votes?.length || 0
                                        }}
                                        onClick={() => setSelectedIdea(idea)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedIdea && (
                <IdeaDetail 
                    idea={selectedIdea} 
                    members={members} 
                    currentUser={currentUser} 
                    isOpen={!!selectedIdea} 
                    onClose={() => setSelectedIdea(null)} 
                />
            )}
        </div>
    );
}

// Subcomponent for creating new idea


function NewIdeaDialog({ members, currentUser }: { members: CodirMember[], currentUser: CodirMember | null }) {
    const [open, setOpen] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiRationale, setAiRationale] = useState<string | null>(null);
    
    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Consulting",
        subcategory: "",
        time_horizon: "moyen terme",
        // Scoring
        strategic_fit: 3,
        business_potential: 3,
        complexity: 3,
        risk_level: 3
    });

    const handleAnalyzeAI = async () => {
        if (!formData.title || !formData.description) return;
        setIsAnalyzing(true);
        try {
            const res = await fetch('/api/ai/score-idea', {
                method: 'POST',
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    category: formData.category,
                    subcategory: formData.subcategory
                })
            });
            const data = await res.json();
            
            if (data.strategic_fit) {
                setFormData(prev => ({
                    ...prev,
                    strategic_fit: data.strategic_fit,
                    business_potential: data.business_potential,
                    complexity: data.complexity,
                    risk_level: data.risk_level
                }));
                setAiRationale(data.rationale);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!currentUser) return;
        
        await createIdea({
            ...formData,
            created_by: currentUser.id
        });
        setOpen(false);
        setFormData({ 
            title: "", description: "", category: "Consulting", subcategory: "", time_horizon: "moyen terme",
            strategic_fit: 3, business_potential: 3, complexity: 3, risk_level: 3
        });
        setAiRationale(null);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[hsl(var(--vyxo-navy))] text-[hsl(var(--vyxo-gold))]">
                    <Plus className="w-4 h-4 mr-2" /> Ajouter une idée
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Nouvelle Idée</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label>Titre</Label>
                        <Input 
                            value={formData.title} 
                            onChange={e => setFormData({...formData, title: e.target.value})} 
                            required 
                            placeholder="Ex: Café Bartop à Lyon"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea 
                            value={formData.description} 
                            onChange={e => setFormData({...formData, description: e.target.value})} 
                            required 
                            className="min-h-[100px]"
                        />
                        <div className="flex justify-end">
                             <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={handleAnalyzeAI}
                                disabled={isAnalyzing || !formData.description}
                                className="text-xs"
                             >
                                {isAnalyzing ? <span className="animate-spin mr-2">⏳</span> : "✨"} 
                                {isAnalyzing ? "Analyse en cours..." : "Pré-noter avec l'IA"}
                             </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Catégorie</Label>
                            <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {["Consulting", "SaaS / Produit digital", "Hardware", "Expérience", "Formation", "Partenariats", "R&D"].map(c => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Sous-catégorie</Label>
                            <Input 
                                value={formData.subcategory} 
                                onChange={e => setFormData({...formData, subcategory: e.target.value})} 
                                placeholder="Ex: Cold Chain"
                            />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label>Horizon</Label>
                        <Select value={formData.time_horizon} onValueChange={v => setFormData({...formData, time_horizon: v})}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="court terme">Court terme (0-3 mois)</SelectItem>
                                    <SelectItem value="moyen terme">Moyen terme (3-12 mois)</SelectItem>
                                    <SelectItem value="long terme">Long terme (+12 mois)</SelectItem>
                                </SelectContent>
                            </Select>
                    </div>

                    {/* AI Scoring Display */}
                    <div className="bg-muted/50 p-4 rounded-lg border space-y-3">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-sm">Notation Préliminaire</h4>
                            {aiRationale && <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded">IA Suggestion</span>}
                        </div>
                        
                        {aiRationale && (
                            <p className="text-xs text-muted-foreground italic mb-3">
                                &quot;{aiRationale}&quot;
                            </p>
                        )}

                        <div className="grid grid-cols-2 gap-4 text-xs">
                             <div className="space-y-1">
                                <div className="flex justify-between"><span>Stratégie</span> <span>{formData.strategic_fit}/5</span></div>
                                <div className="h-1 bg-gray-200 rounded overflow-hidden"><div className="h-full bg-blue-500" style={{width: `${formData.strategic_fit * 20}%`}}></div></div>
                             </div>
                             <div className="space-y-1">
                                <div className="flex justify-between"><span>Business</span> <span>{formData.business_potential}/5</span></div>
                                <div className="h-1 bg-gray-200 rounded overflow-hidden"><div className="h-full bg-green-500" style={{width: `${formData.business_potential * 20}%`}}></div></div>
                             </div>
                             <div className="space-y-1">
                                <div className="flex justify-between"><span>Complexité</span> <span>{formData.complexity}/5</span></div>
                                <div className="h-1 bg-gray-200 rounded overflow-hidden"><div className="h-full bg-red-400" style={{width: `${formData.complexity * 20}%`}}></div></div>
                             </div>
                             <div className="space-y-1">
                                <div className="flex justify-between"><span>Risque</span> <span>{formData.risk_level}/5</span></div>
                                <div className="h-1 bg-gray-200 rounded overflow-hidden"><div className="h-full bg-orange-400" style={{width: `${formData.risk_level * 20}%`}}></div></div>
                             </div>
                        </div>
                    </div>
                    
                    <Button type="submit" className="w-full bg-[hsl(var(--vyxo-navy))] text-[hsl(var(--vyxo-gold))] font-bold hover:bg-[hsl(var(--vyxo-navy))/90]">
                        Créer l&apos;idée
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

