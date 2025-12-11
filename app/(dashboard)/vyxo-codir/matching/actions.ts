"use server";

import { getCodirMembers } from "@/lib/codir-data";
import { CodirMember } from "@/types/codir";

interface MatchResult {
  missionTitle: string;
  recommendedMembers: {
    member: CodirMember;
    role: "Lead" | "Support";
    score: number;
    matchReasons: string[];
  }[];
  justification: string;
  prospectionScript: string;
  quote: {
    total: number;
    details: string;
  };
}

// Simulated "Mission Types" database
const MISSION_TYPES = [
  {
    keywords: ["iso", "9001", "certification", "qualité", "sgi", "audit"],
    title: "Diagnostic & Accompagnement Certification ISO 9001 / SGI",
    basePrice: 15000,
    scriptTemplate: "Bonjour [Nom], j'ai noté que [Entreprise] visait l'excellence opérationnelle. Avec l'expertise de Rafael et Vivien sur les normes ISO, nous pouvons sécuriser votre certification en 6 mois tout en réduisant vos coûts de non-qualité."
  },
  {
    keywords: ["finance", "reporting", "daf", "budget", "forecast", "excel", "power bi"],
    title: "Automatisation du Reporting Financier & Pilotage ROI",
    basePrice: 12000,
    scriptTemplate: "Bonjour [Nom], votre direction financière passe-t-elle trop de temps sur Excel ? Nicolas Lemoine a automatisé des reportings complexes (-90% de temps de traitement). Parlons de votre pilotage."
  },
  {
    keywords: ["logistique", "transport", "entrepôt", "froid", "gdp", "pharma", "supply chain"],
    title: "Optimisation Supply Chain & Conformité Pharma (GDP)",
    basePrice: 18000,
    scriptTemplate: "Bonjour [Nom], la logistique pharma ne pardonne pas. Wyssam Housseine, notre expert ex-directeur d'agence (500t/j), peut blinder votre chaîne du froid et vos audits GDP."
  },
  {
    keywords: ["commerce", "vente", "business", "croissance", "closing", "pipeline"],
    title: "Structuration Machine de Vente & Pipeline B2B",
    basePrice: 10000,
    scriptTemplate: "Bonjour [Nom], avez-vous le sentiment de passer à côté de deals par manque de structure ? Aurore Chardon peut aligner votre stratégie commerciale pour transformer votre pipeline en revenue prévisible."
  },
  {
    keywords: ["ia", "automatisation", "bot", "système", "complexe", "architecture"],
    title: "Architecture de Systèmes Hybrides & IA Opérationnelle",
    basePrice: 20000,
    scriptTemplate: "Bonjour [Nom], l'IA ne doit pas être un gadget. Vivien Closse conçoit des écosystèmes (Humain + IA) qui automatisent vos processus critiques sans perdre le contrôle terrain."
  }
];

export async function matchMission(query: string): Promise<MatchResult | null> {
  const members = await getCodirMembers();
  const lowerQuery = query.toLowerCase();

  // 1. Identify Mission Type
  let bestMissionType = MISSION_TYPES[0];
  let maxTypeScore = -1;

  for (const mType of MISSION_TYPES) {
    const score = mType.keywords.reduce((acc, k) => lowerQuery.includes(k) ? acc + 1 : acc, 0);
    if (score > maxTypeScore) {
      maxTypeScore = score;
      bestMissionType = mType;
    }
  }

  // If no specific match, try generic matching logic or default
  if (maxTypeScore === 0) {
      // Fallback: analyze keywords globally to find best members anyway
  }

  // 2. Score Members against the chosen mission type + query
  const scoredMembers = members.map(member => {
    let score = 0;
    const reasons: string[] = [];

    // Check matches in competencies (rich or map)
    const allSkills = [
      ...Object.values(member.competencies).flat(),
      ...(member.competenciesRich?.map(c => c.label) || [])
    ];

    // Match against Mission Keywords
    bestMissionType.keywords.forEach(kw => {
      const hasSkill = allSkills.some(s => s.toLowerCase().includes(kw));
      if (hasSkill) {
        score += 3;
        reasons.push(`Compétence clé: ${kw}`);
      }
    });

    // Match against Query
    if (member.mission.toLowerCase().includes(lowerQuery) || member.role.toLowerCase().includes(lowerQuery)) {
       score += 5;
       reasons.push("Alignement Rôle/Mission");
    }

    // Impact zones
    member.impactZones.forEach(iz => {
       if (iz.toLowerCase().includes(lowerQuery)) {
          score += 2;
          reasons.push(`Zone d'impact: ${iz}`);
       }
    });

    return { member, score, reasons: [...new Set(reasons)] };
  });

  // Sort by score
  scoredMembers.sort((a, b) => b.score - a.score);

  const topMembers = scoredMembers.filter(m => m.score > 0).slice(0, 3);
  
  if (topMembers.length === 0) return null;

  const lead = topMembers[0];
  const supports = topMembers.slice(1);

  // 3. Construct Result
  return {
    missionTitle: bestMissionType.title,
    recommendedMembers: [
      { 
        member: lead.member, 
        role: "Lead", 
        score: lead.score, 
        matchReasons: lead.reasons 
      },
      ...supports.map(s => ({
        member: s.member,
        role: "Support" as const,
        score: s.score,
        matchReasons: s.reasons
      }))
    ],
    justification: `${lead.member.name} est identifié(e) comme Lead car ses compétences matchent à ${Math.round((lead.score / (maxTypeScore * 3 || 10)) * 100)}% avec les besoins détectés. ${supports.length > 0 ? `Supporté(e) par ${supports.map(s => s.member.name.split(' ')[0]).join(' et ')} pour couvrir les aspects complémentaires.` : ""}`,
    prospectionScript: bestMissionType.scriptTemplate,
    quote: {
      total: bestMissionType.basePrice,
      details: "Estimation basée sur une intervention standard de 3 mois. Inclut diagnostic, implémentation et transfert de compétences."
    }
  };
}
