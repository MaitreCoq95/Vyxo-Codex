import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-vyxo-navy">
        <Sidebar />
      </div>
      <main className="md:pl-72 pb-10">
        <Header />
        <div className="pt-20 px-4 md:px-8">
            {children}
        </div>
      </main>
    </div>
  )
}
