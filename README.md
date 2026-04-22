# Neman UI

A warm, ultra-rounded, and refined design system built on Next.js, Radix UI, and Tailwind CSS v4.

## Overview

Neman UI is a component library with a distinctive visual language centered around:

- **22px core radius** — generous rounding on buttons, cards, dialogs, and inputs
- **Weight 590** — a custom semi-bold that gives titles and labels a warm, distinctive presence
- **Brand blue (#0081f2)** — used sparingly for focus states, active elements, and AI interactions
- **Warm grays (#f8f8f7 / #171717)** — backgrounds that feel approachable, not sterile
- **Micro-shadows** — four depth levels (drop-1 through drop-4) for subtle elevation
- **Purpose-driven motion** — every animation serves a usability goal

## Features

- **30+ components** — Button, Input, Card, Dialog, Select, Tabs, Badge, Switch, Tooltip, Table, and more
- **10 AI chat components** — Messages, Reasoning, Tool Calls, Code Blocks, Streaming, Attachments, Sources, Suggestions, Branching, and Prompt Input
- **Dark mode** — Full dark theme with adjusted contrasts
- **Static export** — Deploys to GitHub Pages or any static host
- **TypeScript** — Fully typed components and props
- **Accessible** — Built on Radix UI primitives with ARIA support

## Quick Start

```bash
# Clone the repository
git clone https://github.com/neman-ui/neman-ui.git
cd neman-ui

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

The dev server runs on `http://localhost:4000`.

## Project Structure

```
neman-ui/
├── app/                    # Next.js app directory
│   ├── page.tsx            # Home page
│   ├── layout.tsx          # Root layout with theme provider
│   ├── globals.css         # Design tokens, animations, utilities
│   ├── docs/page.tsx       # Design system documentation
│   ├── components/page.tsx # Component showcase
│   └── ai/page.tsx         # AI chat component showcase
├── components/
│   ├── ui/                 # UI components (30+ files)
│   ├── theme-provider.tsx  # Dark/light theme context
│   └── theme-toggle.tsx    # Theme switch button
├── lib/
│   └── utils.ts            # cn() utility
├── docs/
│   └── manus-design-system/ # Design specification documents
├── next.config.ts          # Next.js config with GitHub Pages support
├── tsconfig.json
├── postcss.config.mjs
└── package.json
```

## Design Tokens

All tokens are defined as CSS custom properties in `app/globals.css`:

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| `--background` | `#f8f8f7` | `#171717` | Page background |
| `--foreground` | `#34322d` | `#dadada` | Primary text |
| `--primary` | `#1a1a19` | `#e8e7e5` | Primary action |
| `--brand` | `#0081f2` | `#1a93fe` | Brand accent |
| `--destructive` | `#f25a5a` | `#eb4d4d` | Error state |
| `--success` | `#25ba3b` | `#5eb92d` | Success state |
| `--warning` | `#efa201` | `#ffbf36` | Warning state |
| `--radius` | `1.375rem` | — | Core radius (22px) |

## Typography Scale

| Class | Size | Weight | Line Height |
|-------|------|--------|-------------|
| `.text-display` | 36px | 590 | 44px |
| `.text-headline-tertiary` | 28px | 590 | 38px |
| `.text-headline-secondary` | 24px | 590 | 32px |
| `.text-headline-primary` | 20px | 590 | 28px |
| `.text-title-tertiary` | 18px | 590 | 24px |
| `.text-title-secondary` | 16px | 590 | 24px |
| `.text-title-primary` | 14px | 590 | 20px |
| `.text-body-tertiary` | 18px | 400 | 28px |
| `.text-body-secondary` | 16px | 400 | 24px |
| `.text-body-primary` | 14px | 400 | 22px |
| `.text-label-secondary-bold` | 13px | 590 | 18px |
| `.text-label-secondary` | 13px | 400 | 18px |
| `.text-label-primary-bold` | 12px | 600 | 16px |
| `.text-label-primary` | 12px | 400 | 16px |

## Deployment

### GitHub Pages

The project is configured for automatic deployment via GitHub Actions:

1. Push to `main` triggers the workflow in `.github/workflows/deploy.yml`
2. Builds with `GITHUB_PAGES=true` to enable the `/neman-ui` base path
3. Deploys to `https://neman-ui.github.io/neman-ui`

Make sure GitHub repository Settings > Pages > Source is set to "GitHub Actions".

### Manual Build

```bash
pnpm build
```

Output is generated in the `out/` directory as static files.

## Tech Stack

- **Next.js 16** — React framework with static export
- **Tailwind CSS v4** — Utility-first CSS with `@theme inline` tokens
- **Radix UI** — Accessible component primitives
- **class-variance-authority** — Component variant styling
- **next-themes** — Dark mode support
- **Inter** (sans) + **Libre Baskerville** (serif) — Typography

## License

MIT