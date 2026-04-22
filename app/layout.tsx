import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import "@/app/globals.css"

export const metadata: Metadata = {
  title: {
    default: "Neman UI",
    template: "%s — Neman UI",
  },
  description: "A warm, ultra-rounded, and refined design system built on Radix UI and Tailwind CSS.",
  metadataBase: process.env.NEXT_PUBLIC_APP_URL
    ? new URL(process.env.NEXT_PUBLIC_APP_URL)
    : undefined,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;590;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-svh bg-background font-sans text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}