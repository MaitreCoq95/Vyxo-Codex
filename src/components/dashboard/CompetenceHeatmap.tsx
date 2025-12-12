'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createClient } from '@/infrastructure/supabase/client';
import { Loader2 } from 'lucide-react';

interface CompetenceData {
  userId: string;
  userName: string;
  skills: Record<string, number>; // skillId -> mastery_level (0-4)
}

export function CompetenceHeatmap({ companyId = '' }: { companyId?: string }) {
  const [data, setData] = useState<CompetenceData[]>([]);
  const [skills, setSkills] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  
  useEffect(() => {
    if (companyId) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);
  
  async function loadData() {
    setLoading(true);
    
    // Récupérer utilisateurs de l'entreprise
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('company_id', companyId)
      .limit(50); // Pagination
      
    if (!profiles) {
      setLoading(false);
      return;
    }
    
    // Récupérer tous les modules
    const { data: modules } = await supabase
      .from('modules')
      .select('id, title')
      .limit(20);
      
    if (!modules) {
      setLoading(false);
      return;
    }
    
    setSkills(modules.map(m => ({ id: m.id, name: m.title })));
    
    // Récupérer progression pour chaque utilisateur
    const competenceData: CompetenceData[] = [];
    
    for (const profile of profiles) {
      const { data: progress } = await supabase
        .from('user_progress')
        .select('module_id, mastery_level')
        .eq('user_id', profile.id);
        
      const skillsMap: Record<string, number> = {};
      progress?.forEach(p => {
        skillsMap[p.module_id] = p.mastery_level || 0;
      });
      
      competenceData.push({
        userId: profile.id,
        userName: profile.full_name || 'Utilisateur',
        skills: skillsMap
      });
    }
    
    setData(competenceData);
    setLoading(false);
  }
  
  const getColor = (level: number) => {
    if (level >= 3) return 'bg-green-500 hover:bg-green-600';
    if (level === 2) return 'bg-blue-500 hover:bg-blue-600';
    if (level === 1) return 'bg-yellow-500 hover:bg-yellow-600';
    return 'bg-red-500 hover:bg-red-600';
  };
  
  const getLabel = (level: number) => {
    if (level >= 3) return 'Expert';
    if (level === 2) return 'Confirmé';
    if (level === 1) return 'Débutant';
    return 'Non acquis';
  };
  
  // Stats agrégées
  const criticalGaps = data.reduce((count, user) => {
    return count + Object.values(user.skills).filter(level => level === 0).length;
  }, 0);
  
  const experts = data.reduce((count, user) => {
    return count + Object.values(user.skills).filter(level => level >= 3).length;
  }, 0);
  
  if (loading) {
    return (
      <Card className="magic-bento-card">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="magic-bento-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Matrice Compétences</CardTitle>
            <CardDescription>
              {data.length} collaborateur{data.length > 1 ? 's' : ''} × {skills.length} compétence{skills.length > 1 ? 's' : ''}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-red-500/10 border-red-500/20 text-red-400">
              {criticalGaps} lacune{criticalGaps > 1 ? 's' : ''}
            </Badge>
            <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-400">
              {experts} expert{experts > 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Légende */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 rounded bg-red-500" />
            <span className="text-muted-foreground">Non acquis (0)</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 rounded bg-yellow-500" />
            <span className="text-muted-foreground">Débutant (1)</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 rounded bg-blue-500" />
            <span className="text-muted-foreground">Confirmé (2)</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 rounded bg-green-500" />
            <span className="text-muted-foreground">Expert (3-4)</span>
          </div>
        </div>
        
        {/* Grille scrollable */}
        <div className="overflow-x-auto">
          <div className="min-w-max">
            {/* Header compétences */}
            <div className="flex gap-1 mb-2">
              <div className="w-32 shrink-0" /> {/* Espace pour noms */}
              {skills.map(skill => (
                <button
                  key={skill.id}
                  onClick={() => setSelectedSkill(selectedSkill === skill.id ? null : skill.id)}
                  className={`w-24 p-2 text-xs font-medium rounded transition-colors ${
                    selectedSkill === skill.id
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  <div className="truncate">{skill.name}</div>
                </button>
              ))}
            </div>
            
            {/* Lignes utilisateurs */}
            {data.map(user => (
              <div key={user.userId} className="flex gap-1 mb-1">
                <button
                  onClick={() => setSelectedUser(selectedUser === user.userId ? null : user.userId)}
                  className={`w-32 shrink-0 p-2 text-xs font-medium text-left rounded transition-colors ${
                    selectedUser === user.userId
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  <div className="truncate">{user.userName}</div>
                </button>
                
                {skills.map(skill => {
                  const level = user.skills[skill.id] || 0;
                  const isHighlighted = 
                    selectedSkill === skill.id || 
                    selectedUser === user.userId;
                  
                  return (
                    <div
                      key={skill.id}
                      className={`w-24 h-10 rounded flex items-center justify-center text-xs font-bold text-white transition-all cursor-pointer ${
                        getColor(level)
                      } ${isHighlighted ? 'ring-2 ring-white scale-105' : ''}`}
                      title={`${user.userName} - ${skill.name}: ${getLabel(level)} (${level}/4)`}
                    >
                      {level}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline">
            📊 Export CSV
          </Button>
          <Button size="sm" variant="outline">
            📄 Export PDF
          </Button>
          {(selectedSkill || selectedUser) && (
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => {
                setSelectedSkill(null);
                setSelectedUser(null);
              }}
            >
              ✕ Réinitialiser sélection
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
