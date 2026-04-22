import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function DocsPage() {
  return (
    <div className="min-h-svh bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1080px] items-center justify-between px-6 py-3">
          <Link href="/" className="text-title-secondary font-[590]">Neman UI</Link>
          <div className="flex items-center gap-4">
            <Link href="/docs" className="text-label-secondary text-foreground hover:text-foreground transition-colors duration-150">Docs</Link>
            <Link href="/components" className="text-label-secondary text-muted-foreground hover:text-foreground transition-colors duration-150">Components</Link>
            <Link href="/ai" className="text-label-secondary text-muted-foreground hover:text-foreground transition-colors duration-150">AI</Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[1080px] px-6 py-12">
        <h1 className="text-headline-tertiary font-[590] mb-2">Design Tokens</h1>
        <p className="text-body-secondary text-muted-foreground mb-12">
          Color, typography, shadows, spacing, and radius tokens that define the Neman visual language.
        </p>

        {/* ─── Color Palette ──────────────────────────────────────────── */}
        <section className="mb-20">
          <h2 className="text-headline-primary font-[590] mb-2">Colors</h2>
          <p className="text-body-primary text-muted-foreground mb-8">
            A warm gray palette paired with a vibrant brand blue. All tokens support automatic dark mode.
          </p>

          {/* Primary palette */}
          <h3 className="text-title-secondary font-[590] mb-4">Core</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
            {[
              { name: "Background", var: "--background", light: "#f8f8f7", dark: "#171717" },
              { name: "Foreground", var: "--foreground", light: "#34322d", dark: "#dadada" },
              { name: "Card", var: "--card", light: "#ffffff", dark: "#1f1f1f" },
              { name: "Primary", var: "--primary", light: "#37352f", dark: "#dadada" },
              { name: "Primary Foreground", var: "--primary-foreground", light: "#ffffff", dark: "#1a1a1a" },
              { name: "Secondary", var: "--secondary", light: "#f8f8f7", dark: "#1c1c1c" },
            ].map((item) => (
              <div key={item.name} className="rounded-[22px] border border-border bg-card p-4 shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="size-10 rounded-[14px] border border-border/60 shadow-sm"
                    style={{ backgroundColor: item.light }}
                  />
                  <div className="size-10 rounded-[14px] border border-border/60 shadow-sm dark-mode-swatch" style={{ backgroundColor: item.dark }} />
                </div>
                <div className="text-title-primary font-[590]">{item.name}</div>
                <div className="text-label-primary text-muted-foreground font-mono mt-0.5">{item.var}</div>
                <div className="flex gap-3 mt-2">
                  <span className="text-label-primary text-muted-foreground">Light: {item.light}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Semantic colors */}
          <h3 className="text-title-secondary font-[590] mb-4">Brand &amp; Semantic</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
            {[
              { name: "Brand Blue", var: "--brand", light: "#0081f2", dark: "#1a93fe", textLight: true },
              { name: "Destructive", var: "--destructive", light: "#f25a5a", dark: "#eb4d4d" },
              { name: "Success", var: "--success", light: "#25ba3b", dark: "#5eb92d" },
              { name: "Warning", var: "--warning", light: "#efa201", dark: "#ffbf36" },
              { name: "Muted Foreground", var: "--muted-foreground", light: "#6e6d69", dark: "#8a8a8a" },
              { name: "Ring / Focus", var: "--ring", light: "#0081f2", dark: "#1a93fe", textLight: true },
            ].map((item) => (
              <div key={item.name} className="rounded-[22px] border border-border bg-card p-4 shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="flex size-10 items-center justify-center rounded-[14px] text-label-primary-bold text-xs shadow-sm"
                    style={{ backgroundColor: item.light, color: item.textLight ? "#ffffff" : item.light }}
                  >
                    Aa
                  </div>
                </div>
                <div className="text-title-primary font-[590]">{item.name}</div>
                <div className="text-label-primary text-muted-foreground font-mono mt-0.5">{item.var}</div>
                <div className="text-label-primary text-muted-foreground mt-1">Light: {item.light} · Dark: {item.dark}</div>
              </div>
            ))}
          </div>

          {/* Fill system */}
          <h3 className="text-title-secondary font-[590] mb-4">Fill System</h3>
          <div className="grid gap-4 sm:grid-cols-2 mb-10">
            {[
              { name: "Fill Subtle", var: "--fill-subtle", light: "#37352f0a (4%)", dark: "#ffffff0f (6%)" },
              { name: "Fill Medium", var: "--fill-medium", light: "#37352f14 (8%)", dark: "#ffffff1f (12%)" },
              { name: "Border", var: "--border", light: "#0000000f (6%)", dark: "#ffffff17 (9%)" },
              { name: "Input", var: "--input", light: "#0000000f (6%)", dark: "#ffffff17 (9%)" },
            ].map((item) => (
              <div key={item.name} className="rounded-[22px] border border-border bg-card p-4 shadow-[var(--shadow-card)]">
                <div className="text-title-primary font-[590]">{item.name}</div>
                <div className="text-label-primary text-muted-foreground font-mono mt-0.5">{item.var}</div>
                <div className="text-label-primary text-muted-foreground mt-1">Light: {item.light}</div>
                <div className="text-label-primary text-muted-foreground">Dark: {item.dark}</div>
              </div>
            ))}
          </div>

          {/* Shadow system */}
          <h3 className="text-title-secondary font-[590] mb-4">Shadows</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
            {[
              { name: "drop-1", css: "0 1px 2px rgba(0,0,0,0.04)", var: "--shadow-drop-1" },
              { name: "drop-2", css: "0 2px 4px rgba(0,0,0,0.05)", var: "--shadow-drop-2" },
              { name: "drop-3", css: "0 4px 16px rgba(0,0,0,0.08)", var: "--shadow-drop-3" },
              { name: "drop-4", css: "0 8px 32px rgba(0,0,0,0.12)", var: "--shadow-drop-4" },
            ].map((item) => (
              <div key={item.name} className="rounded-[22px] border border-border bg-card p-5" style={{ boxShadow: item.css }}>
                <div className="text-title-primary font-[590]">{item.name}</div>
                <div className="text-label-primary text-muted-foreground font-mono mt-0.5">{item.var}</div>
                <div className="text-label-primary text-muted-foreground mt-1">{item.css}</div>
              </div>
            ))}
          </div>

          {/* Card shadow */}
          <div className="rounded-[22px] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="text-title-primary font-[590]">Card Shadow</div>
            <div className="text-label-primary text-muted-foreground font-mono mt-0.5">--shadow-card</div>
            <div className="text-label-primary text-muted-foreground mt-1">Light: 0px 12px 32px 0px rgba(0,0,0,0.02) · Dark: 0px 12px 32px 0px rgba(0,0,0,0.3)</div>
          </div>
        </section>

        {/* ─── Typography ─────────────────────────────────────────────── */}
        <section className="mb-20">
          <h2 className="text-headline-primary font-[590] mb-2">Typography</h2>
          <p className="text-body-primary text-muted-foreground mb-8">
            Inter (sans) for UI, Libre Baskerville (serif) for hero headings. The signature weight is <strong>590</strong> — a Neman-specific semi-bold.
          </p>

          <div className="rounded-[22px] border border-border bg-card p-6 shadow-[var(--shadow-card)] space-y-5 mb-10">
            {/* Display */}
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between">
                <span className="neman-hero-title text-[36px] leading-[44px] text-foreground italic">Display / Hero</span>
                <span className="text-label-primary text-muted-foreground font-mono shrink-0 ml-4">Libre Baskerville · 36px · italic 400</span>
              </div>
              <div className="text-label-primary text-muted-foreground font-mono">.neman-hero-title</div>
            </div>

            {/* Headlines */}
            {[
              { label: "Headline Tertiary", cls: "text-headline-tertiary", size: "28px/590", mono: ".text-headline-tertiary" },
              { label: "Headline Secondary", cls: "text-headline-secondary", size: "24px/590", mono: ".text-headline-secondary" },
              { label: "Headline Primary", cls: "text-headline-primary", size: "20px/590", mono: ".text-headline-primary" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <div className="flex items-baseline justify-between">
                  <span className={`${item.cls} font-[590]`}>{item.label}</span>
                  <span className="text-label-primary text-muted-foreground font-mono shrink-0 ml-4">{item.size}</span>
                </div>
                <div className="text-label-primary text-muted-foreground font-mono">{item.mono}</div>
              </div>
            ))}

            {/* Titles */}
            {[
              { label: "Title Tertiary", cls: "text-title-tertiary", size: "18px/590", mono: ".text-title-tertiary" },
              { label: "Title Secondary", cls: "text-title-secondary", size: "16px/590", mono: ".text-title-secondary" },
              { label: "Title Primary", cls: "text-title-primary", size: "14px/590", mono: ".text-title-primary" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <div className="flex items-baseline justify-between">
                  <span className={`${item.cls} font-[590]`}>{item.label}</span>
                  <span className="text-label-primary text-muted-foreground font-mono shrink-0 ml-4">{item.size}</span>
                </div>
                <div className="text-label-primary text-muted-foreground font-mono">{item.mono}</div>
              </div>
            ))}

            {/* Body */}
            {[
              { label: "Body Tertiary", cls: "text-body-tertiary", size: "18px/400", mono: ".text-body-tertiary" },
              { label: "Body Secondary", cls: "text-body-secondary", size: "16px/400", mono: ".text-body-secondary" },
              { label: "Body Primary", cls: "text-body-primary", size: "14px/400", mono: ".text-body-primary" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <div className="flex items-baseline justify-between">
                  <span className={item.cls}>{item.label}</span>
                  <span className="text-label-primary text-muted-foreground font-mono shrink-0 ml-4">{item.size}</span>
                </div>
                <div className="text-label-primary text-muted-foreground font-mono">{item.mono}</div>
              </div>
            ))}

            {/* Labels */}
            {[
              { label: "Label Secondary Bold", cls: "text-label-secondary-bold", size: "13px/590", mono: ".text-label-secondary-bold" },
              { label: "Label Secondary", cls: "text-label-secondary", size: "13px/400", mono: ".text-label-secondary" },
              { label: "Label Primary Bold", cls: "text-label-primary-bold", size: "12px/600", mono: ".text-label-primary-bold" },
              { label: "Label Primary", cls: "text-label-primary", size: "12px/400", mono: ".text-label-primary" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <div className="flex items-baseline justify-between">
                  <span className={item.cls}>{item.label}</span>
                  <span className="text-label-primary text-muted-foreground font-mono shrink-0 ml-4">{item.size}</span>
                </div>
                <div className="text-label-primary text-muted-foreground font-mono">{item.mono}</div>
              </div>
            ))}
          </div>

          {/* Font families */}
          <h3 className="text-title-secondary font-[590] mb-4">Font Families</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[22px] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <div className="text-label-secondary-bold text-muted-foreground mb-2">Sans (Primary)</div>
              <div className="text-headline-primary font-[590]">Inter</div>
              <div className="text-body-primary text-muted-foreground mt-1">
                Weights: 400, 500, <strong>590</strong>, 600, 700
              </div>
              <div className="text-label-primary text-muted-foreground font-mono mt-2">--font-sans</div>
            </div>
            <div className="rounded-[22px] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <div className="text-label-secondary-bold text-muted-foreground mb-2">Serif (Hero)</div>
              <div className="neman-hero-title text-[24px] leading-[32px] text-foreground italic">Libre Baskerville</div>
              <div className="text-body-primary text-muted-foreground mt-1">
                Weights: 400, 700 + italic
              </div>
              <div className="text-label-primary text-muted-foreground font-mono mt-2">--font-serif</div>
            </div>
          </div>
        </section>

        {/* ─── Radius System ───────────────────────────────────────── */}
        <section className="mb-20">
          <h2 className="text-headline-primary font-[590] mb-2">Radius System</h2>
          <p className="text-body-primary text-muted-foreground mb-8">
            The core radius is <strong>22px</strong> (<code className="text-brand font-mono">--radius: 1.375rem</code>),
            scaled through a multiplicative system.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
            {[
              { name: "sm", px: "~5px", css: "0.36×r", demo: "5px" },
              { name: "md", px: "~12px", css: "0.55×r", demo: "12px" },
              { name: "lg (core)", px: "22px", css: "1×r", demo: "22px" },
              { name: "xl", px: "~30px", css: "1.36×r", demo: "30px" },
              { name: "2xl", px: "~40px", css: "1.8×r", demo: "40px" },
              { name: "3xl", px: "~48px", css: "2.2×r", demo: "48px" },
              { name: "4xl", px: "~57px", css: "2.6×r", demo: "9999px" },
              { name: "Capsule", px: "∞", css: "rounded-full", demo: "9999px" },
            ].map((item) => (
              <div key={item.name} className="rounded-[22px] border border-border bg-card p-5 shadow-[var(--shadow-card)] flex flex-col items-center gap-3">
                <div
                  className="size-16 bg-brand/10 border-2 border-brand/30 flex items-center justify-center text-label-primary-bold text-brand"
                  style={{ borderRadius: item.demo }}
                >
                  {item.px}
                </div>
                <div className="text-title-primary font-[590] text-center">{item.name}</div>
                <div className="text-label-primary text-muted-foreground font-mono">{item.css}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Animations ───────────────────────────────────────── */}
        <section className="mb-20">
          <h2 className="text-headline-primary font-[590] mb-2">Animations</h2>
          <p className="text-body-primary text-muted-foreground mb-8">
            Subtle, purpose-driven motion that adds polish without distraction.
          </p>

          <div className="rounded-[22px] border border-border bg-card p-6 shadow-[var(--shadow-card)] space-y-6">
            {[
              { name: "Button Press", desc: "scale(1) → scale(0.98) → scale(1)", keyframe: "scale-button" },
              { name: "Menu Appear", desc: "opacity 0, translateY(-8px) → opacity 1, translateY(0)", keyframe: "menu-slide-down" },
              { name: "Tooltip In", desc: "opacity 0, scale(0.92) → opacity 1, scale(1)", keyframe: "tip-in" },
              { name: "Tooltip Out", desc: "opacity 1, scale(1) → opacity 0, scale(0.92)", keyframe: "tip-out" },
              { name: "Fade In", desc: "opacity 0 → opacity 1", keyframe: "fade-in" },
              { name: "Cursor Blink", desc: "opacity on/off at 1s intervals", keyframe: "cursor-blink" },
              { name: "Typing Dots", desc: "3 dots with staggered bounce, 1.4s cycle", keyframe: "bounce" },
              { name: "Reasoning Dots", desc: "Progressive dot indicator (... animation)", keyframe: "neman-dot-pulse" },
            ].map((item) => (
              <div key={item.name} className="flex items-start gap-4">
                <div className="size-2 mt-2 rounded-full bg-brand shrink-0" />
                <div>
                  <div className="text-body-primary font-[590]">{item.name}</div>
                  <div className="text-body-primary text-muted-foreground">{item.desc}</div>
                  <div className="text-label-primary text-muted-foreground font-mono mt-0.5">{item.keyframe}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Design Principles ─────────────────────────────────────── */}
        <section className="mb-20">
          <h2 className="text-headline-primary font-[590] mb-2">Design Principles</h2>
          <p className="text-body-primary text-muted-foreground mb-8">
            The philosophical foundation behind every visual and interaction choice.
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Warmth Over Cold",
                description: "Warm grays (#f8f8f7) instead of pure neutrals. Brand blue (#0081f2) with personality. Every surface feels approachable.",
                icon: "🌡",
              },
              {
                title: "Radius as Identity",
                description: "22px core radius is the signature — buttons, cards, dialogs, inputs all carry this generous roundness. Pill shapes for badges and small elements.",
                icon: "⬭",
              },
              {
                title: "Weight 590",
                description: "A custom semi-bold weight (590) that sits between 500 and 600 — giving titles and labels a distinctive, warm presence.",
                icon: "Aa",
              },
              {
                title: "Subtle Depth",
                description: "Micro-shadows (drop-1 to drop-4) create gentle elevation without heaviness. Cards breathe. Dialogs lift. Never overpower.",
                icon: "◈",
              },
              {
                title: "Focused Motion",
                description: "Every animation serves a purpose: button press confirms action, tooltip appears with grace, streaming cursor signals life.",
                icon: "↝",
              },
              {
                title: "Brand Blue Focus",
                description: "The brand blue (#0081f2) is used sparingly — focused states, active tabs, primary actions, AI elements. Never as decoration.",
                icon: "◉",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[22px] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <div className="text-headline-primary mb-2">{item.icon}</div>
                <div className="text-title-secondary font-[590] mb-1">{item.title}</div>
                <div className="text-body-primary text-muted-foreground">{item.description}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Quick Start ─────────────────────────────────────────── */}
        <section>
          <h2 className="text-headline-primary font-[590] mb-2">Quick Start</h2>
          <p className="text-body-primary text-muted-foreground mb-8">
            Get up and running with Neman UI in your project.
          </p>

          <div className="rounded-[22px] border border-border bg-[#1a1a1a] dark:bg-[#0f0f0f] p-5 shadow-[var(--shadow-drop-2)]">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
              <span className="text-label-secondary text-white/50">Terminal</span>
            </div>
            <pre className="text-[13px] leading-[22px] text-white/75">
              <code>{`# Clone the repository
git clone https://github.com/neman-ui/neman-ui.git
cd neman-ui

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build`}</code>
            </pre>
          </div>

          <div className="mt-8 rounded-[22px] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="text-title-secondary font-[590] mb-2">Tech Stack</div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Next.js 16 — React framework with static export",
                "Tailwind CSS v4 — Utility-first with @theme inline",
                "Radix UI — Accessible component primitives",
                "class-variance-authority — Variant styling",
                "next-themes — Dark mode support",
                "Inter + Libre Baskerville — Typography",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <div className="size-1.5 mt-2 rounded-full bg-brand shrink-0" />
                  <span className="text-body-primary text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}