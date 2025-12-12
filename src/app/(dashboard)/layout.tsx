import { Header } from "@/components/layout/header"
import { StaggeredMenu } from "@/components/ui/staggered-menu";
import { 
  Github,
  Linkedin,
  Twitter
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  // Define Menu Items
  const codexMenuItems = [
    { label: "Dashboard", href: "/codex" },
    { label: "Formations", href: "/codex/learning" },
    { label: "Assistant IA", href: "/codex/admin" },
    { label: "Paramètres", href: "/codex/settings" }
  ];

  const socialItems = [
    { label: "GitHub", href: "https://github.com", icon: <Github className="w-5 h-5" /> },
    { label: "Twitter", href: "https://twitter.com", icon: <Twitter className="w-5 h-5" /> },
    { label: "LinkedIn", href: "https://linkedin.com", icon: <Linkedin className="w-5 h-5" /> },
  ];

  return (
    <div className="h-full relative flex">
      {/* New Retractable Menu Container */}
      <div className="fixed inset-y-0 left-0 z-[80] w-20 p-2 hidden md:block">
        <StaggeredMenu 
            position="left"
            items={codexMenuItems}
            socialItems={socialItems}
            displaySocials={true}
            colors={["#B19EEF", "#5227FF", "#1D1B60"]}
            menuButtonColor="#ffffff"
            openMenuButtonColor="#020617"
            accentColor="rgba(94, 92, 255, 1)"
            changeMenuColorOnOpen={true}
            closeOnClickAway={true}
            className="h-full w-full"
        />
      </div>

      {/* Main Content Area - Adjusted Padding */}
      <main className="flex-1 md:pl-20 pb-10 transition-all duration-300">
        <Header />
        <div className="pt-20 px-4 md:px-8">
            {children}
        </div>
      </main>
    </div>
  )
}
