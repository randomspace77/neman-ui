import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function ComponentsPage() {
  return (
    <div className="min-h-svh bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1080px] items-center justify-between px-6 py-3">
          <Link href="/" className="text-title-secondary font-[590]">Neman UI</Link>
          <div className="flex items-center gap-4">
            <Link href="/docs" className="text-label-secondary text-muted-foreground hover:text-foreground transition-colors duration-150">Docs</Link>
            <Link href="/components" className="text-label-secondary text-muted-foreground hover:text-foreground transition-colors duration-150">Components</Link>
            <Link href="/ai" className="text-label-secondary text-muted-foreground hover:text-foreground transition-colors duration-150">AI</Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[1080px] px-6 py-12">
        <h1 className="text-headline-tertiary font-[590] mb-2">Design Tokens</h1>
        <p className="text-body-secondary text-muted-foreground mb-12">
          Color, typography, spacing, and radius tokens that define the Neman visual language.
        </p>

        {/* Color Palette */}
        <section className="mb-16">
          <h2 className="text-headline-primary font-[590] mb-6">Colors</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Background", var: "--background", light: "#f8f8f7", dark: "#171717" },
              { name: "Foreground", var: "--foreground", light: "#34322d", dark: "#dadada" },
              { name: "Card", var: "--card", light: "#ffffff", dark: "#1f1f1f" },
              { name: "Primary", var: "--primary", light: "#1a1a19", dark: "#fffffff2" },
              { name: "Brand Blue", var: "--brand", light: "#0081f2", dark: "#1a93fe" },
              { name: "Muted", var: "--muted", light: "#f8f8f7", dark: "#1c1c1c" },
              { name: "Destructive", var: "--destructive", light: "#f25a5a", dark: "#eb4d4d" },
              { name: "Success", var: "--success", light: "#25ba3b", dark: "#5eb92d" },
              { name: "Warning", var: "--warning", light: "#efa201", dark: "#ffbf36" },
              { name: "Border (6%)", var: "--border", light: "#0000000f", dark: "#ffffff0f" },
              { name: "Ring", var: "--ring", light: "#0081f2", dark: "#1a93fe" },
              { name: "Fill Subtle", var: "--fill-subtle", light: "#37352f0a", dark: "#ffffff0a" },
            ].map((item) => (
              <div key={item.name} className="rounded-2xl border border-border p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="size-8 rounded-lg border border-border shadow-sm"
                    style={{ backgroundColor: item.light }}
                  />
                  <div>
                    <div className="text-sm font-[590]">{item.name}</div>
                    <div className="text-label-primary text-muted-foreground font-mono">{item.var}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="mb-16">
          <h2 className="text-headline-primary font-[590] mb-6">Typography</h2>
          <div className="rounded-2xl border border-border p-6 space-y-4">
            <div className="flex items-baseline gap-4">
              <span className="text-label-primary w-32 shrink-0 text-muted-foreground font-mono">.text-headline-tertiary</span>
              <span className="text-headline-tertiary font-[590]">Headline Tertiary 28px/590</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-label-primary w-32 shrink-0 text-muted-foreground font-mono">.text-headline-secondary</span>
              <span className="text-headline-secondary font-[590]">Headline Secondary 24px/590</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-label-primary w-32 shrink-0 text-muted-foreground font-mono">.text-headline-primary</span>
              <span className="text-headline-primary font-[590]">Headline Primary 20px/590</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-label-primary w-32 shrink-0 text-muted-foreground font-mono">.text-title-tertiary</span>
              <span className="text-title-tertiary font-[590]">Title Tertiary 18px/590</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-label-primary w-32 shrink-0 text-muted-foreground font-mono">.text-title-secondary</span>
              <span className="text-title-secondary font-[590]">Title Secondary 16px/590</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-label-primary w-32 shrink-0 text-muted-foreground font-mono">.text-title-primary</span>
              <span className="text-title-primary font-[590]">Title Primary 14px/590</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-label-primary w-32 shrink-0 text-muted-foreground font-mono">.text-body-secondary</span>
              <span className="text-body-secondary">Body Secondary 16px/400</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-label-primary w-32 shrink-0 text-muted-foreground font-mono">.text-body-primary</span>
              <span className="text-body-primary">Body Primary 14px/400</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-label-primary w-32 shrink-0 text-muted-foreground font-mono">.text-label-secondary-bold</span>
              <span className="text-label-secondary-bold font-[590]">Label Secondary Bold 13px/590</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-label-primary w-32 shrink-0 text-muted-foreground font-mono">.text-label-primary</span>
              <span className="text-label-primary">Label Primary 12px/400</span>
            </div>
          </div>
        </section>

        {/* Radius and Spacing */}
        <section className="mb-16">
          <h2 className="text-headline-primary font-[590] mb-6">Radius System</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "sm (4px)", value: "4px" },
              { name: "lg (8px)", value: "8px" },
              { name: "Core (22px)", value: "22px" },
              { name: "Capsule (100px)", value: "100px" },
            ].map((item) => (
              <div key={item.name} className="rounded-2xl border border-border p-4 flex flex-col items-center gap-3">
                <div
                  className="size-16 bg-fill-subtle border border-border"
                  style={{ borderRadius: item.value }}
                />
                <div className="text-sm font-[590]">{item.name}</div>
                <div className="text-label-primary text-muted-foreground">{item.value}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}