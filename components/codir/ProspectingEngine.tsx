"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { matchMission } from "@/app/(dashboard)/vyxo-codir/matching/actions";
import { Loader2, Search, Rocket, User, FileText, Banknote, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProspectingEngine() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Awaited<ReturnType<typeof matchMission>>>(null);
  const [isPending, startTransition] = useTransition();

  const handleSearch = () => {
    if (!query) return;
    startTransition(async () => {
      const res = await matchMission(query);
      setResult(res);
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="bg-card border rounded-xl p-8 shadow-sm">
        <div className="max-w-2xl mx-auto space-y-6 text-center">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                    <Sparkles className="text-[hsl(var(--vyxo-gold))]" />
                    Engine de Prospection
                </h2>
                <p className="text-muted-foreground">
                    Décrivez un besoin client ou une opportunité de marché. 
                    L&apos;IA identifiera la meilleure squad Codir, le script d&apos;approche et le pricing.
                </p>
            </div>
            
            <div className="flex gap-2">
                <Input 
                    placeholder="Ex: Besoin d'une certification ISO 9001 urgente pour un client industriel..." 
                    className="h-12 text-lg"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button 
                   size="lg" 
                   className="h-12 px-8 bg-[hsl(var(--vyxo-navy))] hover:bg-[hsl(var(--vyxo-navy))/90] text-white"
                   onClick={handleSearch}
                   disabled={isPending}
                >
                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                </Button>
            </div>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Recommendation Details */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="border-[hsl(var(--vyxo-navy))]/20 shadow-md overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-[hsl(var(--vyxo-navy))] to-[hsl(var(--vyxo-gold))]" />
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Rocket className="text-[hsl(var(--vyxo-gold))]" />
                            Mission Recommandée : {result.missionTitle}
                        </CardTitle>
                        <CardDescription>
                            {result.justification}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Squad Recommandée</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {result.recommendedMembers.map((rec) => (
                                    <div key={rec.member.id} className={`flex items-start gap-4 p-4 rounded-lg border ${rec.role === 'Lead' ? 'bg-[hsl(var(--vyxo-gold))]/10 border-[hsl(var(--vyxo-gold))]' : 'bg-background'}`}>
                                        <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${rec.member.id}`} />
                                            <AvatarFallback>{rec.member.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold">{rec.member.name}</h4>
                                                <Badge variant={rec.role === 'Lead' ? "default" : "secondary"}>{rec.role}</Badge>
                                            </div>
                                            <p className="text-sm text-foreground/80 mt-1 mb-2 line-clamp-1">{rec.member.role}</p>
                                            <div className="flex flex-wrap gap-1">
                                                {rec.matchReasons.slice(0, 3).map((reason, i) => (
                                                    <Badge key={i} variant="outline" className="text-[10px] h-5 px-1.5 bg-background">
                                                        {reason}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        <div>
                             <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Script d&apos;approche
                             </h3>
                             <div className="bg-muted p-4 rounded-lg italic text-foreground/90 border-l-4 border-[hsl(var(--vyxo-navy))]">
                                &quot;{result.prospectionScript}&quot;
                             </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Col: Quote & Pricing */}
            <div className="space-y-6">
                 <Card className="bg-[hsl(var(--vyxo-navy))] text-white border-none shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Banknote className="text-[hsl(var(--vyxo-gold))]" />
                            Estimation Offre
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center py-4">
                            <span className="text-4xl font-bold font-mono">{result.quote.total.toLocaleString('fr-FR')} €</span>
                            <p className="text-white/70 text-sm mt-1">Budget estimatif HT</p>
                        </div>
                        <Separator className="bg-white/20" />
                        <p className="text-sm text-white/80 leading-relaxed">
                            {result.quote.details}
                        </p>
                        <Button className="w-full bg-[hsl(var(--vyxo-gold))] text-[hsl(var(--vyxo-navy))] hover:bg-white font-bold">
                            Générer Devis PDF
                        </Button>
                    </CardContent>
                 </Card>
            </div>
        </div>
      )}
    </div>
  );
}
