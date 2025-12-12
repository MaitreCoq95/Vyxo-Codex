import {
  FileText,
  Workflow,
  ClipboardCheck,
  AlertTriangle,
  ShieldAlert,
  Bot
} from "lucide-react";

export const CodexCardData = [
  {
    label: "Docs",
    title: "Référentiel documentaire",
    description: "Procédures, modes opératoires et formulaires centralisés.",
    href: "/codex/documents",
    color: "#a855f7",
    icon: <FileText className="h-6 w-6" />,
  },
  {
    label: "Processus",
    title: "Processus & cartographie",
    description: "Visualisez et structurez vos processus clés.",
    href: "/codex/processus",
    color: "#3b82f6",
    icon: <Workflow className="h-6 w-6" />,
  },
  {
    label: "Audits",
    title: "Audits & inspections",
    description: "Planifiez, exécutez et suivez vos audits internes.",
    href: "/codex/audit-sim",
    color: "#22c55e",
    icon: <ClipboardCheck className="h-6 w-6" />,
  },
  {
    label: "Actions",
    title: "Actions & CAPA",
    description: "Pilotez actions correctives et préventives facilement.",
    href: "/codex/actions",
    color: "#f97316",
    icon: <AlertTriangle className="h-6 w-6" />,
  },
  {
    label: "Conformité",
    title: "Risques & conformité",
    description: "Maîtrisez risques, exigences ISO et obligations terrain.",
    href: "/codex/compliance",
    color: "#ef4444",
    icon: <ShieldAlert className="h-6 w-6" />,
  },
  {
    label: "IA Codex",
    title: "Assistant IA Codex",
    description: "Posez vos questions, trouvez la bonne information immédiatement.",
    href: "/codex/admin",
    color: "#eab308",
    icon: <Bot className="h-6 w-6" />,
  },
];
