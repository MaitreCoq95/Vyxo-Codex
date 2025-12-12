import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/styles/themes.css";
import { ThemeProvider } from "@/hooks/use-theme";
import { LanguageProvider } from "@/components/language-provider";
import SupabaseProvider from "@/components/supabase-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vyxo Codex",
  description: "Knowledge Management System",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="light" role="operator">
          <LanguageProvider>
            <SupabaseProvider>
              {children}
              <Toaster />
            </SupabaseProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
