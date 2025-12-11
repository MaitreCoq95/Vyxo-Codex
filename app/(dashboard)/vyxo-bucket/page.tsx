import { createClient } from "@supabase/supabase-js";
import { getCodirMembers } from "@/lib/codir-data";
import { IdeaWithVotes } from "@/types/bucket-project";
import IdeaBoard from "@/components/bucket/IdeaBoard";
import { Lightbulb } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function VyxoBucketPage() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch Ideas
    const { data: ideasData } = await supabase
        .from("vch_idea_bucket")
        .select(`
            *,
            votes:vch_idea_votes(*)
        `)
        .order('created_at', { ascending: false });
    
    const ideas = (ideasData || []) as IdeaWithVotes[];

    // Fetch Members for Auth simulation & Creator names
    const members = await getCodirMembers();

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            <div className="container py-6 flex-none">
                <div className="flex items-center gap-3 text-[hsl(var(--vyxo-navy))] dark:text-[hsl(var(--vyxo-gold))] border-b pb-4 mb-2">
                    <Lightbulb className="w-8 h-8" />
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Vyxo Bucket</h1>
                        <p className="text-muted-foreground">Le sceau à idées du CODIR. Proposez, votez, transformez.</p>
                    </div>
                </div>
            </div>
            
            <div className="container flex-1 min-h-0 pb-6">
                <IdeaBoard ideas={ideas} members={members} />
            </div>
        </div>
    );
}
