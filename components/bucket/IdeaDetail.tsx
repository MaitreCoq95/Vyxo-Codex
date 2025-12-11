"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Idea, IdeaWithVotes, VoteType } from "@/types/bucket-project";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ThumbsUp, ThumbsDown, AlertCircle, ArrowRight, User as UserIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Assuming we have textarea or use Input
import { useState, useTransition } from "react";
import { voteOnIdea, convertIdeaToProject, updateIdeaScores } from "@/app/(dashboard)/vyxo-bucket/actions";
import { CodirMember } from "@/types/codir";

interface IdeaDetailProps {
  idea: IdeaWithVotes;
  members: CodirMember[]; // To show who submitted and identify current user for voting (simulation)
  currentUser?: CodirMember | null; // Simulated current user
  isOpen: boolean;
  onClose: () => void;
}

export default function IdeaDetail({ idea, members, currentUser, isOpen, onClose }: IdeaDetailProps) {
  const [isPending, startTransition] = useTransition();
  const [comment, setComment] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Use props directly for initial render, update comes from revalidate
  const score = (idea.strategic_fit || 0) + (idea.business_potential || 0) + (6 - (idea.complexity || 3)) + (6 - (idea.risk_level || 3));
  
  const handleAnalyzeAI = async () => {
    setIsAnalyzing(true);
    try {
        const res = await fetch('/api/ai/score-idea', {
            method: 'POST',
            body: JSON.stringify({
                title: idea.title,
                description: idea.description,
                category: idea.category,
                subcategory: idea.subcategory
            })
        });
        const data = await res.json();
        
        if (data.strategic_fit) {
            startTransition(async () => {
                await updateIdeaScores(idea.id, {
                    strategic_fit: data.strategic_fit,
                    business_potential: data.business_potential,
                    complexity: data.complexity,
                    risk_level: data.risk_level
                });
            });
        }
    } catch (e) {
        console.error(e);
    } finally {
        setIsAnalyzing(false);
    }
  };
  
  const votes = idea.votes || [];
  const yesVotes = votes.filter(v => v.vote === 'yes').length;
  const noVotes = votes.filter(v => v.vote === 'no').length;
  const abstainVotes = votes.filter(v => v.vote === 'abstain').length;

  const handleVote = (vote: VoteType) => {
    if (!currentUser) return;
    startTransition(async () => {
      await voteOnIdea(idea.id, currentUser.id, vote, comment);
      setComment("");
    });
  };

  const handleConvertToProject = () => {
    startTransition(async () => {
        // Basic conversion with mostly default values
        await convertIdeaToProject(idea.id, {
            title: idea.title,
            description: idea.description,
            category: idea.category,
            subcategory: idea.subcategory,
            owner_id: idea.created_by, // Default to idea creator
            priority: 'medium',
            effort_estimation: 'medium'
        });
        onClose();
    });
  };

  const creator = members.find(m => m.id === idea.created_by);
  const myVote = votes.find(v => v.member_id === currentUser?.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge>{idea.category}</Badge>
            {idea.subcategory && <Badge variant="outline">{idea.subcategory}</Badge>}
            <Badge variant={idea.status === 'approved' ? 'default' : 'secondary'} className={idea.status === 'approved' ? 'bg-green-600' : ''}>
                {idea.status.replace('_', ' ')}
            </Badge>
          </div>
          <DialogTitle className="text-2xl">{idea.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 mt-1">
             Proposé par {creator ? creator.name : 'Inconnu'} • {new Date(idea.created_at).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
            
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
                 <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-sm text-foreground/80 whitespace-pre-wrap">{idea.description}</p>
                 </div>

                 {idea.notes_internal && (
                     <div className="bg-muted p-3 rounded-md text-sm">
                        <h4 className="font-semibold text-xs uppercase mb-1">Notes Internes</h4>
                        <p>{idea.notes_internal}</p>
                     </div>
                 )}

                 <Separator />

                 {/* Voting Section */}
                 <div>
                    <h3 className="font-semibold mb-3 flex items-center justify-between">
                        Votes du CODIR
                        <span className="text-xs font-normal text-muted-foreground">{yesVotes} Pour - {noVotes} Contre - {abstainVotes} Abst.</span>
                    </h3>
                    
                    {/* Progress Bar */}
                    <div className="h-2 flex w-full rounded-full overflow-hidden bg-secondary mb-4">
                        <div style={{ width: `${(yesVotes / (votes.length || 1)) * 100}%` }} className="bg-green-500" />
                        <div style={{ width: `${(noVotes / (votes.length || 1)) * 100}%` }} className="bg-red-500" />
                        <div style={{ width: `${(abstainVotes / (votes.length || 1)) * 100}%` }} className="bg-gray-400" />
                    </div>

                    <div className="space-y-2">
                        {votes.map(vote => {
                             const voter = members.find(m => m.id === vote.member_id);
                             return (
                                 <div key={vote.id} className="flex items-center justify-between text-sm bg-muted/50 p-2 rounded">
                                     <div className="flex items-center gap-2">
                                         <UserIcon className="w-4 h-4 text-muted-foreground" />
                                         <span className="font-medium">{voter?.name}</span>
                                     </div>
                                     <div className="flex items-center gap-3">
                                         {vote.comment && <span className="text-xs text-muted-foreground italic">"{vote.comment}"</span>}
                                         <Badge variant={vote.vote === 'yes' ? 'default' : vote.vote === 'no' ? 'destructive' : 'outline'} className={vote.vote === 'yes' ? 'bg-green-600' : ''}>
                                             {vote.vote}
                                         </Badge>
                                     </div>
                                 </div>
                             )
                        })}
                    </div>

                    {/* VOTE INPUT */}
                    {currentUser && idea.status === 'idea' && (
                        <div className="mt-6 p-4 border rounded-lg bg-card">
                            <h4 className="font-semibold text-sm mb-3">Votre vote ({currentUser.name})</h4>
                            <Textarea 
                                placeholder="Un commentaire (optionnel)..." 
                                className="mb-3 h-20"
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleVote('yes')} className="bg-green-600 hover:bg-green-700 text-white" disabled={isPending}>
                                    <ThumbsUp className="w-4 h-4 mr-2" /> Pour
                                </Button>
                                <Button size="sm" onClick={() => handleVote('no')} variant="destructive" disabled={isPending}>
                                    <ThumbsDown className="w-4 h-4 mr-2" /> Contre
                                </Button>
                                <Button size="sm" onClick={() => handleVote('abstain')} variant="outline" disabled={isPending}>
                                    Abstention
                                </Button>
                            </div>
                        </div>
                    )}
                 </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
                <div className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-sm">Vyxo Score: <span className="text-lg">{score}/20</span></h3>
                         <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 text-xs"
                            onClick={handleAnalyzeAI}
                            disabled={isAnalyzing || isPending}
                        >
                            {isAnalyzing ? <span className="animate-spin">⏳</span> : "✨"} IA
                        </Button>
                    </div>
                    <div className="space-y-3 text-xs">
                        <div className="flex justify-between"><span>Stratégie</span> <span>{idea.strategic_fit}/5</span></div>
                        <Progress value={(idea.strategic_fit / 5) * 100} className="h-1" />
                        
                        <div className="flex justify-between"><span>Business</span> <span>{idea.business_potential}/5</span></div>
                        <Progress value={(idea.business_potential / 5) * 100} className="h-1" />
                        
                        <div className="flex justify-between"><span>Complexité</span> <span>{idea.complexity}/5</span></div>
                        <Progress value={(idea.complexity / 5) * 100} className="h-1 bg-secondary" indicatorClassName="bg-red-400" /> {/* Inverted logic displayed usually, but keep simple */}
                        
                        <div className="flex justify-between"><span>Risque</span> <span>{idea.risk_level}/5</span></div>
                        <Progress value={(idea.risk_level / 5) * 100} className="h-1 bg-secondary" indicatorClassName="bg-orange-400" />
                    </div>
                </div>

                <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-sm mb-2">Meta</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex justify-between"><span>Horizon:</span> <span className="text-foreground">{idea.time_horizon}</span></div>
                    </div>
                </div>

                {idea.status === 'approved' && (
                    <Button className="w-full bg-[hsl(var(--vyxo-navy))] text-[hsl(var(--vyxo-gold))]" onClick={handleConvertToProject} disabled={isPending}>
                        <ArrowRight className="w-4 h-4 mr-2" /> Transformer en Projet
                    </Button>
                )}
            </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
