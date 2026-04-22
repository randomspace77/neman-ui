import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowRight, Command, Layers, Moon, Palette, Smartphone, Zap } from "lucide-react"
import Link from "next/link"

function AnnouncementBanner() {
  return (
    <div className="neman-banner">
      <a
        href="https://github.com/neman-ui"
        className="flex items-center gap-1 text-sm font-medium text-foreground transition-opacity duration-300 hover:opacity-80"
      >
        <span>Neman UI v0.1 is out</span>
        <ArrowRight className="size-3" />
      </a>
    </div>
  )
}

function Navbar() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-[56px] max-w-[1080px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Command className="size-4" />
          </div>
          <span className="text-title-secondary font-[590]">Neman</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {[
            { label: "Docs", href: "/docs" },
            { label: "Components", href: "/components" },
            { label: "AI", href: "/ai" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-[8px] px-3 py-1.5 text-sm font-medium text-secondary-foreground transition-colors duration-150 hover:bg-fill-subtle hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/docs">Get Started</Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}

function HeroSection() {
  return (
    <section className="neman-gradient-surface">
      <div className="mx-auto flex max-w-[1080px] flex-col items-center px-6 pt-[20vh] pb-24">
        <Badge variant="outline" className="mb-6 rounded-full border-border/50 px-3 py-1 text-sm">
          v0.1 — Open Source
        </Badge>

        <h1 className="neman-hero-title mb-6 max-w-[768px] text-center text-[36px] leading-[44px] text-foreground">
          Warm, ultra-rounded, refined.
        </h1>

        <p className="mb-10 max-w-[600px] text-center text-body-secondary text-muted-foreground">
          A design system built on Radix UI and Tailwind CSS with 22px core radius, brand blue accents,
          weight&nbsp;590 typography, and micro-shadow depth — with full dark mode support.
        </p>

        <div className="flex items-center gap-3">
          <Button size="lg" asChild>
            <Link href="/docs">
              Get Started
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/components">View Components</Link>
          </Button>
        </div>

        {/* Search card — Manus-inspired */}
        <div className="mt-16 flex w-full max-w-[640px] flex-col rounded-[22px] border border-border bg-card py-3 shadow-[var(--shadow-card)] transition-all duration-300 focus-within:border-foreground/20">
          <Input
            placeholder="Search components, tokens, patterns..."
            className="h-[46px] rounded-none border-0 bg-transparent px-5 shadow-none focus-visible:ring-0 focus-visible:border-0"
          />
          <div className="flex flex-wrap gap-2 px-4 pt-1 text-sm">
            <span className="rounded-full border border-border/60 px-3 py-1 text-muted-foreground transition-colors duration-150 hover:bg-fill-subtle hover:text-foreground cursor-pointer">
              Button
            </span>
            <span className="rounded-full border border-border/60 px-3 py-1 text-muted-foreground transition-colors duration-150 hover:bg-fill-subtle hover:text-foreground cursor-pointer">
              Dialog
            </span>
            <span className="rounded-full border border-border/60 px-3 py-1 text-muted-foreground transition-colors duration-150 hover:bg-fill-subtle hover:text-foreground cursor-pointer">
              Badge
            </span>
            <span className="rounded-full border border-border/60 px-3 py-1 text-muted-foreground transition-colors duration-150 hover:bg-fill-subtle hover:text-foreground cursor-pointer">
              Color tokens
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function PrinciplesSection() {
  const principles = [
    {
      icon: <Palette className="size-5" />,
      title: "Restrained Colors",
      desc: "Warm gray #f8f8f7 and white as base. Brand blue #0081f2 as the sole accent — no rainbow noise.",
    },
    {
      icon: <Layers className="size-5" />,
      title: "Ultra Rounded",
      desc: "Core radius 22px — near-capsule but preserving rectangular identity. Capsule elements use 100px.",
    },
    {
      icon: <Zap className="size-5" />,
      title: "Near-Invisible Borders",
      desc: "Default borders at 6% opacity. Subtle structure without visual noise. Emphasis borders at 12%.",
    },
    {
      icon: <Moon className="size-5" />,
      title: "Full Dark Mode",
      desc: "All tokens have Light/Dark mappings. Warm grays shift together. Switch seamlessly via html.dark class.",
    },
    {
      icon: <Smartphone className="size-5" />,
      title: "Weight 590",
      desc: "A signature typographic weight between Regular and Semibold. Used for all titles and emphasis — instantly recognizable.",
    },
    {
      icon: <Command className="size-5" />,
      title: "Micro Shadows",
      desc: "Four-level drop shadow system from XS (4%) to L (24%). Card shadow only 2% opacity — almost flat but layered.",
    },
  ]

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-[1080px] px-6 py-24">
        <h2 className="neman-hero-title mb-3 text-center text-[28px] leading-[34px] text-foreground">
          Design Principles
        </h2>
        <p className="mx-auto mb-16 max-w-[560px] text-center text-body-secondary text-muted-foreground">
          Every token and component serves a purpose. Nothing decorative — everything intentional.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((item) => (
            <div
              key={item.title}
              className="group rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[var(--shadow-drop-4)]"
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-fill-subtle text-foreground transition-colors duration-300 group-hover:bg-brand/10 group-hover:text-brand">
                {item.icon}
              </div>
              <h3 className="text-title-primary mb-2 font-[590]">{item.title}</h3>
              <p className="text-body-primary text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ComponentPreviewSection() {
  return (
    <section className="border-t border-border bg-fill-subtle">
      <div className="mx-auto max-w-[1080px] px-6 py-24">
        <h2 className="neman-hero-title mb-3 text-center text-[28px] leading-[34px] text-foreground">
          Every Component, Polished
        </h2>
        <p className="mx-auto mb-16 max-w-[560px] text-center text-body-secondary text-muted-foreground">
          Built on Radix UI primitives with Tailwind CSS. 22px radius, warm shadows, weight 590 — every detail considered.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Buttons Preview */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-title-secondary mb-4 font-[590]">Buttons</h3>
            <div className="flex flex-wrap gap-3">
              <Button>Primary</Button>
              <Button variant="blue">Blue</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive" size="sm">Delete</Button>
            </div>
          </div>

          {/* Input Preview */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-title-secondary mb-4 font-[590]">Input</h3>
            <Input placeholder="Search components..." />
          </div>

          {/* Badges Preview */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-title-secondary mb-4 font-[590]">Badges</h3>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="blue">Blue</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="destructive">Error</Badge>
              <Badge variant="secondary">Secondary</Badge>
            </div>
          </div>

          {/* Color Palette Preview */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-title-secondary mb-4 font-[590]">Color Tokens</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Background", color: "bg-background" },
                { label: "Foreground", color: "bg-foreground" },
                { label: "Brand Blue", color: "bg-brand" },
                { label: "Primary", color: "bg-primary" },
                { label: "Muted", color: "bg-muted" },
                { label: "Destructive", color: "bg-destructive" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`size-6 rounded-lg ${item.color} border border-border`} />
                  <span className="text-label-secondary text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/components">
              See All Components
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function FooterSection() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-[1080px] px-6 py-24">
        <h2 className="neman-hero-title mb-8 text-[36px] leading-[44px] text-primary-foreground">
          Less structure,<br />more intelligence.
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {[
            {
              title: "Components",
              links: ["Button", "Input", "Card", "Dialog", "Tabs"],
            },
            {
              title: "Tokens",
              links: ["Colors", "Typography", "Spacing", "Radius", "Shadows"],
            },
            {
              title: "Resources",
              links: ["GitHub", "npm Package", "Figma Kit", "Changelog"],
            },
            {
              title: "Community",
              links: ["Discord", "Twitter", "Blog", "Contributing"],
            },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="mb-3 text-sm font-medium">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <span className="text-sm text-primary-foreground/60 transition-opacity duration-150 hover:text-primary-foreground hover:opacity-100 cursor-pointer">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex items-center justify-between border-t border-primary-foreground/10 pt-6">
          <span className="text-sm text-primary-foreground/60">
            © 2025 Neman UI. Built with Radix UI and Tailwind CSS.
          </span>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  )
}

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col">
      <AnnouncementBanner />
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <PrinciplesSection />
        <ComponentPreviewSection />
      </main>
      <FooterSection />
    </div>
  )
}