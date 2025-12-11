import { createClient } from "@supabase/supabase-js";
import { getCodirMembers } from "@/lib/codir-data";
import { ProjectWithDetails } from "@/types/bucket-project";
import ProjectBoard from "@/components/projects/ProjectBoard";
import { FolderKanban } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function VyxoProjectsPage() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch Projects
    // We need to join owner manually or use view. 
    // For simplicity, we fetch raw and join in memory for `ProjectWithDetails` logic.
    // Or we rely on client side matching/fetching.
    // Let's separate fetch for members and projects.
    
    // 1. Fetch Projects
    const { data: projectsData } = await supabase
        .from("vch_projects")
        .select("*")
        .order('created_at', { ascending: false });

    const rawProjects = (projectsData || []) as any[];
    
    // 2. Fetch Members
    const members = await getCodirMembers();

    // 3. Join Owner Name
    const projects: ProjectWithDetails[] = rawProjects.map(p => ({
        ...p,
        ownerName: members.find(m => m.id === p.owner_id)?.name
    }));

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            <div className="container py-6 flex-none">
                <div className="flex items-center gap-3 text-[hsl(var(--vyxo-navy))] dark:text-[hsl(var(--vyxo-gold))] border-b pb-4 mb-2">
                    <FolderKanban className="w-8 h-8" />
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Vyxo Projets</h1>
                        <p className="text-muted-foreground">Pipeline d&apos;exécution des projets validés.</p>
                    </div>
                </div>
            </div>
            
            <div className="container flex-1 min-h-0 pb-6">
                <ProjectBoard projects={projects} members={members} />
            </div>
        </div>
    );
}
