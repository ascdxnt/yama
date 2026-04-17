# Yamaha CR — Digital Sales Platform Architecture

> **Classification:** Internal Engineering Document
> **Version:** 1.0.0
> **Date:** April 16, 2026
> **Author:** Platform Architecture Team
> **Status:** Active — Single Source of Truth

---

## Table of Contents

1. [Strategic Context](#1-strategic-context)
2. [Tech Stack & Toolchain](#2-tech-stack--toolchain)
3. [Design System](#3-design-system)
4. [Typography & Spacing System](#4-typography--spacing-system)
5. [Component Architecture](#5-component-architecture)
6. [Folder Structure](#6-folder-structure)
7. [Navigation & Mega Menu](#7-navigation--mega-menu)
8. [Page Breakdown & UX Decisions](#8-page-breakdown--ux-decisions)
9. [Product Page — The Money Page](#9-product-page--the-money-page)
10. [Financing Calculator](#10-financing-calculator)
11. [Multi-Currency System](#11-multi-currency-system)
12. [Service Booking Flow](#12-service-booking-flow)
13. [Locations System](#13-locations-system)
14. [Tracking & Analytics System](#14-tracking--analytics-system)
15. [SEO Strategy](#15-seo-strategy)
16. [Performance Strategy](#16-performance-strategy)
17. [Rendering Strategy](#17-rendering-strategy)
18. [CMS Architecture](#18-cms-architecture)
19. [Code: Product Page](#19-code-product-page)
20. [Code: Financing Calculator](#20-code-financing-calculator)
21. [Code: WhatsApp Tracking](#21-code-whatsapp-tracking)
22. [Code: SEO System](#22-code-seo-system)
23. [Code: Tracking Data Layer](#23-code-tracking-data-layer)
24. [Deployment & CI/CD](#24-deployment--cicd)
25. [Future Scaling](#25-future-scaling)

---

## 1. Strategic Context

This platform replaces a Wix site for a Yamaha dealership network in Costa Rica. The problem is not "we need a website." The problem is:

- Leads arrive from paid ads with high intent and low patience
- The current site bleeds conversions through slow load, poor mobile UX, and buried CTAs
- There is no event tracking — marketing spend is unattributable
- SEO is non-existent — organic is left on the table
- No financing tools — the #1 purchase driver is invisible

**This platform is a conversion machine.** Every architectural decision flows from one question: *does this help someone buy a motorcycle faster?*

**Success metrics:**
- Time to first CTA interaction: < 3 seconds
- WhatsApp click-through rate: > 8% of product page visitors
- Lighthouse score: 95+ across all categories
- First Contentful Paint: < 1.2s
- Largest Contentful Paint: < 2.0s
- Cumulative Layout Shift: < 0.05

---

## 2. Tech Stack & Toolchain

| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js 15+ (App Router) | Server Components, streaming, edge runtime |
| Language | TypeScript (strict) | Zero tolerance for runtime type errors |
| Styling | Tailwind CSS 4 + tailwind-merge + clsx | Utility-first, tree-shakeable, zero runtime |
| UI Primitives | Radix UI + custom components | Accessible, unstyled, composable |
| State | React primitives + Zustand | Server-first, minimal client state |
| Forms | React Hook Form + Zod | Schema-driven validation, zero re-renders |
| CMS | Sanity v3 | Real-time preview, structured content, GROQ |
| Image Pipeline | Next.js Image + Sanity CDN + AVIF/WebP | Automatic format negotiation, responsive srcsets |
| Analytics | Custom data layer → GA4 + Meta Pixel + TikTok Pixel | Single event bus, no vendor lock-in |
| Maps | Google Maps Embed API | Lightweight, no JS SDK overhead |
| Deployment | Vercel (Edge Network) | Global CDN, edge functions, instant rollback |
| Monitoring | Vercel Analytics + Web Vitals API | Real-user metrics, not synthetic |

**Why not:**
- Redux → Zustand is 1.1KB, Redux toolkit is 13KB+. Server Components eliminate 80% of client state.
- Styled-components / CSS modules → Runtime CSS-in-JS is dead for performance. Tailwind compiles to static CSS.
- WordPress / Strapi → Sanity's real-time collaboration and structured content modeling is purpose-built for product catalogs.

---

## 3. Design System

### Brand Tokens

```typescript
// lib/design-tokens.ts
export const tokens = {
  color: {
    primary: {
      DEFAULT: '#003e95',
      50: '#e8f0ff',
      100: '#c5d9ff',
      200: '#9fbfff',
      300: '#6b9eff',
      400: '#3d7ef7',
      500: '#003e95',
      600: '#003580',
      700: '#002b6a',
      800: '#002054',
      900: '#00163f',
    },
    secondary: {
      DEFAULT: '#0e87d7',
      50: '#e6f4fd',
      100: '#b3def8',
      200: '#80c8f3',
      300: '#4db2ee',
      400: '#1a9ce9',
      500: '#0e87d7',
      600: '#0b6fb2',
      700: '#08578d',
      800: '#053f68',
      900: '#032743',
    },
    surface: {
      white: '#ffffff',
      ghost: '#f8fafc',
      muted: '#f1f5f9',
      subtle: '#e2e8f0',
      border: '#cbd5e1',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      muted: '#94a3b8',
      inverse: '#ffffff',
    },
    semantic: {
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      whatsapp: '#25D366',
    },
  },
  radius: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 12px rgba(0, 0, 0, 0.08)',
    lg: '0 12px 32px rgba(0, 0, 0, 0.12)',
    xl: '0 24px 64px rgba(0, 0, 0, 0.16)',
    glow: {
      primary: '0 0 24px rgba(0, 62, 149, 0.25)',
      secondary: '0 0 24px rgba(14, 135, 215, 0.25)',
      cta: '0 4px 24px rgba(14, 135, 215, 0.4)',
    },
  },
  motion: {
    fast: '150ms cubic-bezier(0.16, 1, 0.3, 1)',
    normal: '250ms cubic-bezier(0.16, 1, 0.3, 1)',
    slow: '400ms cubic-bezier(0.16, 1, 0.3, 1)',
    spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;
```

### Design Rules (Enforced)

1. **Primary (#003e95) = Authority.** Navigation bars, section headings, structural dividers, footer. Never on small interactive elements.
2. **Secondary (#0e87d7) = Action.** All CTAs, hover states, active indicators, links, interactive highlights. This is the "do something" color.
3. **WhatsApp green (#25D366) = The exception.** WhatsApp CTAs use brand green with white text. This is the only non-brand color allowed on primary CTAs.
4. **Depth is mandatory.** Every card has shadow. Every section has contrast against its neighbor. No flat panels floating in white void.
5. **Motion is purposeful.** Hover lifts (translateY -2px + shadow increase). Page transitions use shared layout animation. No decorative animation.

---

## 4. Typography & Spacing System

### Type Scale

Font: **Inter** (variable weight, subset Latin + Latin Extended for Spanish characters)

| Token | Size | Weight | Line Height | Use |
|---|---|---|---|---|
| `display` | 56px / 3.5rem | 800 | 1.05 | Hero headlines |
| `h1` | 40px / 2.5rem | 700 | 1.15 | Page titles |
| `h2` | 32px / 2rem | 700 | 1.2 | Section headings |
| `h3` | 24px / 1.5rem | 600 | 1.3 | Subsection headings |
| `h4` | 20px / 1.25rem | 600 | 1.35 | Card titles |
| `body-lg` | 18px / 1.125rem | 400 | 1.6 | Lead paragraphs |
| `body` | 16px / 1rem | 400 | 1.6 | Default body |
| `body-sm` | 14px / 0.875rem | 400 | 1.5 | Captions, metadata |
| `label` | 12px / 0.75rem | 600 | 1.4 | Badges, labels, overlines |

### Spacing Scale (8px base grid)

```
4px  → micro gaps (icon to text)
8px  → tight (inline elements)
12px → compact (form field gaps)
16px → default (between related items)
24px → comfortable (between card elements)
32px → section-internal padding
48px → between sections (mobile)
64px → between sections (tablet)
96px → between sections (desktop)
```

**Rule:** No arbitrary values. Every margin, padding, and gap maps to this scale. Tailwind config enforces it.

### Responsive Type (Mobile-First)

```css
/* Implemented via Tailwind's responsive prefixes */
.display → text-3xl md:text-4xl lg:text-[3.5rem]
.h1      → text-2xl md:text-3xl lg:text-[2.5rem]
.h2      → text-xl  md:text-2xl lg:text-[2rem]
```

Mobile headings are 60-70% of desktop size. Never smaller than 24px for primary headings on mobile.

---

## 5. Component Architecture

### Component Categories

```
primitives/     → Button, Input, Badge, Icon (no business logic)
composites/     → ProductCard, PriceDisplay, SpecTable (composed from primitives)
blocks/         → HeroSection, ProductGrid, FinancingCalc (page-level sections)
layouts/        → PageLayout, ProductLayout, ServiceLayout (structural shells)
patterns/       → MegaMenu, StickyBar, FilterPanel (interaction patterns)
```

### Component API Conventions

Every component follows this contract:

```typescript
// Strict prop interface — no `any`, no `Record<string, unknown>`
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'whatsapp';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string; // escape hatch, composed via cn()
}
```

### cn() utility (composition function)

```typescript
// lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

This is the single way to compose class names. Direct string concatenation is banned.

### Server vs Client Components

**Default: Server Component.** Only add `'use client'` when the component needs:
- Event handlers (onClick, onChange)
- Browser APIs (window, navigator)
- React hooks (useState, useEffect, useRef)
- Third-party client-only libraries

**Server Component examples:** ProductPage, ProductGrid, SpecTable, Footer, Header shell
**Client Component examples:** MegaMenu toggle, FinancingCalculator, StickyBar visibility, WhatsApp click handler

---

## 6. Folder Structure

```
yamahacr/
├── public/
│   ├── fonts/
│   │   └── inter-var-latin.woff2
│   ├── icons/
│   │   ├── whatsapp.svg
│   │   ├── yamaha-logo.svg
│   │   └── sprite.svg
│   └── og/                          # Pre-generated OG images
│
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout: fonts, metadata, analytics shell
│   │   ├── page.tsx                  # Homepage
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   ├── loading.tsx
│   │   │
│   │   ├── motos/
│   │   │   ├── page.tsx             # /motos — category listing
│   │   │   ├── [category]/
│   │   │   │   ├── page.tsx         # /motos/scooter — filtered grid
│   │   │   │   └── [slug]/
│   │   │   │       ├── page.tsx     # /motos/scooter/nmax-155 — product page
│   │   │   │       └── loading.tsx
│   │   │
│   │   ├── cuadraciclos/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── marino/
│   │   │   ├── page.tsx
│   │   │   ├── waverunner/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── motores-fuera-de-borda/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   └── taller-marino/
│   │   │       └── page.tsx
│   │   │
│   │   ├── cotizador/
│   │   │   └── page.tsx             # Quote request form
│   │   │
│   │   ├── repuestos/
│   │   │   └── page.tsx
│   │   │
│   │   ├── taller/
│   │   │   ├── page.tsx             # Service booking entry
│   │   │   └── reservar/
│   │   │       └── page.tsx         # Booking flow
│   │   │
│   │   ├── sucursales/
│   │   │   └── page.tsx             # Locations/dealerships
│   │   │
│   │   ├── contacto/
│   │   │   └── page.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── revalidate/
│   │   │   │   └── route.ts         # Sanity webhook → on-demand ISR
│   │   │   ├── lead/
│   │   │   │   └── route.ts         # Form submissions
│   │   │   └── financing/
│   │   │       └── route.ts         # Server-side financing calc (optional)
│   │   │
│   │   └── sitemap.ts               # Dynamic sitemap generation
│   │
│   ├── components/
│   │   ├── primitives/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── icon.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── composites/
│   │   │   ├── product-card.tsx
│   │   │   ├── price-display.tsx
│   │   │   ├── spec-table.tsx
│   │   │   ├── currency-badge.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── blocks/
│   │   │   ├── hero-section.tsx
│   │   │   ├── product-grid.tsx
│   │   │   ├── financing-calculator.tsx
│   │   │   ├── category-showcase.tsx
│   │   │   ├── testimonials.tsx
│   │   │   ├── dealership-map.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── patterns/
│   │   │   ├── mega-menu/
│   │   │   │   ├── mega-menu.tsx
│   │   │   │   ├── mega-menu-desktop.tsx
│   │   │   │   ├── mega-menu-mobile.tsx
│   │   │   │   └── menu-product-card.tsx
│   │   │   ├── sticky-cta-bar.tsx
│   │   │   ├── whatsapp-fab.tsx
│   │   │   └── filter-panel.tsx
│   │   │
│   │   └── layouts/
│   │       ├── page-layout.tsx
│   │       ├── product-layout.tsx
│   │       └── header/
│   │           ├── header.tsx
│   │           ├── header-nav.tsx
│   │           └── header-cta.tsx
│   │
│   ├── lib/
│   │   ├── utils.ts                 # cn(), formatPrice(), etc.
│   │   ├── design-tokens.ts
│   │   ├── constants.ts             # Site-wide constants
│   │   ├── sanity/
│   │   │   ├── client.ts            # Sanity client config
│   │   │   ├── queries.ts           # GROQ queries
│   │   │   ├── schemas/             # Sanity schema definitions
│   │   │   │   ├── product.ts
│   │   │   │   ├── category.ts
│   │   │   │   ├── dealership.ts
│   │   │   │   └── page.ts
│   │   │   └── types.ts             # Generated types from schemas
│   │   │
│   │   ├── tracking/
│   │   │   ├── data-layer.ts        # Unified event bus
│   │   │   ├── ga4.ts               # Google Analytics 4
│   │   │   ├── meta-pixel.ts        # Meta/Facebook pixel
│   │   │   ├── tiktok-pixel.ts      # TikTok pixel
│   │   │   ├── events.ts            # Event type definitions
│   │   │   └── provider.tsx         # Analytics context provider
│   │   │
│   │   ├── financing/
│   │   │   ├── calculator.ts        # Pure calculation logic
│   │   │   └── types.ts
│   │   │
│   │   └── hooks/
│   │       ├── use-currency.ts
│   │       ├── use-financing.ts
│   │       └── use-intersection.ts
│   │
│   ├── stores/
│   │   ├── quote-store.ts           # Zustand: quote/cotizador state
│   │   └── ui-store.ts              # Zustand: menu open, modal state
│   │
│   └── types/
│       ├── product.ts
│       ├── navigation.ts
│       ├── cms.ts
│       └── index.ts
│
├── sanity/                           # Sanity Studio (separate config)
│   ├── sanity.config.ts
│   ├── sanity.cli.ts
│   └── schemas/
│
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
├── .env.local.example
└── ARCHITECTURE.md                   # ← You are here
```

**Why this structure:**
- `app/` routes mirror the URL structure 1:1 — no mental mapping needed
- `components/` is organized by abstraction level, not by page — forces reuse
- `lib/` contains zero React — pure functions, configs, and integrations
- `stores/` is intentionally small — most state lives on the server
- Sanity studio is co-located but independently deployable

---

## 7. Navigation & Mega Menu

### Information Architecture

```
┌─ MOTOS                        ← Primary category
│  ├─ Scooter                   ← Subcategory (filterable grid)
│  ├─ Urbanas / Street
│  ├─ Montañero
│  ├─ Alta Cilindrada
│  ├─ Motocross
│  └─ Enduro
│
├─ CUADRACICLOS & MULAS         ← Flat category (grid)
│
├─ MARINO                       ← Primary category
│  ├─ Waverunner
│  ├─ Motores Fuera de Borda
│  └─ Taller Marino
│
├─ REPUESTOS                    ← Single page
├─ TALLER                       ← Service booking entry
├─ CONTACTO                     ← Contact page
└─ COTIZAR ← [CTA BUTTON]      ← Always visible, secondary color, stands out
```

### Desktop Mega Menu (UX Decision)

**Pattern:** Hover-triggered dropdown panel (200ms delay to prevent accidental triggers). Full-width, constrained to `max-w-7xl`.

**Layout for "MOTOS":**

```
┌─────────────────────────────────────────────────────────────────┐
│ MOTOS                                                           │
├────────────────┬────────────────┬───────────────────────────────┤
│ CATEGORÍAS     │ DESTACADOS     │ FEATURED PRODUCT              │
│                │                │                               │
│ ● Scooter      │ [IMG] NMAX 155 │ ┌─────────────────────────┐  │
│ ● Urbanas      │ desde ₡2.8M    │ │     [HERO IMAGE]        │  │
│ ● Montañero    │ [Cotizar →]    │ │                         │  │
│ ● Alta Cil.    │                │ │  MT-09 2026             │  │
│ ● Motocross    │ [IMG] MT-07    │ │  La nueva referencia    │  │
│ ● Enduro       │ desde $9,200   │ │                         │  │
│                │ [Cotizar →]    │ │  [Ver modelo →]         │  │
│ [Ver todas →]  │                │ └─────────────────────────┘  │
└────────────────┴────────────────┴───────────────────────────────┘
```

Three columns:
1. **Category links** — direct navigation, hover highlights
2. **Featured products** — 2-3 product cards with image, price, CTA (CMS-controlled)
3. **Hero product** — single spotlight, larger image, editorial copy

**Why:** Users who open the mega menu are in exploration mode. Showing products directly in the menu cuts one navigation step. The featured product is a conversion shortcut — marketing controls which product gets the spotlight.

### Mobile Menu (UX Decision)

**Pattern:** Full-screen overlay, accordion navigation, thumb-zone optimized.

```
┌──────────────────────────┐
│  ✕                YAMAHA │  ← Close button in thumb zone (left)
├──────────────────────────┤
│                          │
│  MOTOS              ▾    │  ← Tap to expand
│  ┌────────────────────┐  │
│  │ Scooter         →  │  │  ← Each row is 48px+ tap target
│  │ Urbanas         →  │  │
│  │ Montañero       →  │  │
│  │ Alta Cilindrada →  │  │
│  │ Motocross       →  │  │
│  │ Enduro          →  │  │
│  │                    │  │
│  │ [Ver todas motos]  │  │  ← Catch-all link
│  └────────────────────┘  │
│                          │
│  CUADRACICLOS        →   │
│  MARINO              ▾   │
│  REPUESTOS           →   │
│  TALLER              →   │
│                          │
├──────────────────────────┤
│  [    COTIZAR AHORA    ] │  ← Persistent CTA at bottom
│  [  WhatsApp ● En línea] │  ← WhatsApp always visible
└──────────────────────────┘
```

**Rules:**
- Minimum tap target: 48x48px (WCAG)
- Accordion only expands one section at a time (prevents scroll overload)
- CTA bar is sticky at the bottom of the overlay
- Close button is top-left (thumb reaches it on right-hand hold)
- No hamburger animation that takes 500ms — instant open/close

---

## 8. Page Breakdown & UX Decisions

### Homepage

**Job:** Establish trust. Surface categories. Push users into product pages.

```
SECTION 1 — Hero
├── Full-bleed video/image background
├── Headline: "Yamaha Costa Rica — [Rotating tagline]"
├── Two CTAs: [Ver Motos] [Cotizar Ahora]
└── Scroll indicator (subtle)

SECTION 2 — Category Grid
├── 3-column grid (mobile: horizontal scroll)
├── Cards: Motos, Cuadraciclos, Marino
├── Each card: background image, category name, product count, arrow
└── Tap → category page

SECTION 3 — Featured Products
├── Heading: "Modelos Destacados"
├── 4-column product card grid (mobile: 2-col)
├── Each card: image, name, price, category badge, CTA
└── CMS-controlled selection

SECTION 4 — Financing Teaser
├── Split layout: copy left, calculator preview right
├── Headline: "Financiamiento desde ₡X/mes"
├── Mini calculator (down payment slider → monthly payment)
└── CTA: [Calcular mi cuota]

SECTION 5 — Dealerships
├── Map with pins
├── 3 nearest locations (if geolocation available)
└── CTA: [Ver sucursales]

SECTION 6 — Trust Bar
├── Logos: authorized dealer, warranty, financing partners
└── Social proof numbers (units sold, years in CR, etc.)
```

**UX Decision — Why no carousel:**
Carousels have < 1% interaction rate on banner 2+. The hero is a single, high-impact message. Product browsing happens in dedicated grids with scroll, not hidden behind arrows.

### Category Page (`/motos/scooter`)

**Job:** Let user compare and filter. Reduce choice to 1-2 products.

```
├── Breadcrumb: Inicio > Motos > Scooter
├── Category hero (small): name + count + description
├── Filter bar: price range, engine size (if applicable)
├── Product grid: 3-col desktop, 2-col mobile
│   └── Product card:
│       ├── Image (hover: alternate angle)
│       ├── Name
│       ├── Price (currency-aware)
│       ├── Key spec badges (cc, type)
│       └── [Ver modelo] → product page
└── No pagination — load more on scroll (ISR'd, fast)
```

**UX Decision — No infinite scroll, use "Load More":**
Infinite scroll breaks the back button and makes footer unreachable. "Load more" is a conscious user action that preserves scroll position.

---

## 9. Product Page — The Money Page

This page is the most important page on the entire platform. It is not a product detail page. It is a landing page that happens to have product details.

### Above the Fold (0-100vh)

```
┌──────────────────────────────────────────────────────┐
│ [Breadcrumb: Inicio > Motos > Scooter > NMAX 155]   │
│                                                      │
│                  ┌──────────────┐                    │
│                  │              │                    │
│                  │  HERO IMAGE  │                    │
│                  │  (gallery)   │                    │
│                  │              │                    │
│                  └──────────────┘                    │
│  ← Thumbnails / dots →                              │
│                                                      │
│  YAMAHA NMAX 155                            2026     │
│  ════════════════                                    │
│                                                      │
│  ₡2,890,000                                         │
│  ──────────                                         │
│  Precio de lista · IVI incluido                     │
│                                                      │
│  Desde ₡48,166/mes    ← Financing hook              │
│  con 20% de prima                                   │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │  💬  CONSULTAR POR WHATSAPP                  │    │ ← PRIMARY CTA (green)
│  └─────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────┐    │
│  │      SOLICITAR COTIZACIÓN                    │    │ ← SECONDARY CTA (blue)
│  └─────────────────────────────────────────────┘    │
│                                                      │
│  ● En stock  ● Garantía 2 años  ● Financiamiento   │
└──────────────────────────────────────────────────────┘
```

**UX Decisions:**
- Price is the second thing the eye hits after the image. No hiding prices.
- "Desde ₡X/mes" is calculated dynamically and shown inline — financing intent happens here, not on a separate page.
- WhatsApp is PRIMARY because it has the highest conversion rate for CR market. Quote form is secondary.
- Trust badges below CTAs reduce post-click anxiety.

### Mid Section

```
SECTION: Key Specs (scan-friendly)
├── Grid: 2x3 on mobile, single row on desktop
├── Each spec: icon + value + label
├── Examples: Motor 155cc | Potencia 15.4 HP | Peso 131 kg | Tanque 7.1 L
└── Designed for 3-second scan, not reading

SECTION: Financing Calculator (interactive)
├── Heading: "Calculá tu cuota"
├── Sliders:
│   ├── Down payment: 10% — 50% (default: 20%)
│   └── Term: 12 — 72 months (default: 48)
├── Output: Monthly payment (large, bold)
├── Disclaimer: "Sujeto a aprobación crediticia"
└── CTA: [Solicitar financiamiento →]

SECTION: Benefits
├── Two-column layout
├── Left: emotional benefits (freedom, adventure, lifestyle image)
├── Right: practical benefits (fuel efficiency, maintenance cost, warranty)
└── This is not a feature list — it's objection handling
```

### Bottom Section

```
SECTION: Full Specifications
├── Accordion groups: Motor, Chasis, Dimensiones, Eléctrico
├── Each row: spec name : value
├── Collapsed by default on mobile (saves scroll)
└── Schema.org markup for rich snippets

SECTION: Related Models
├── Heading: "También te puede interesar"
├── 3-4 product cards from same category
└── Algorithm: same category, adjacent price range

SECTION: Nearest Dealership
├── Map showing closest location
├── Address, phone, hours
└── CTA: [Cómo llegar] [Llamar]
```

### Mobile Product Page — Sticky Bottom Bar

```
┌──────────────────────────────────────┐
│  ₡2,890,000   [WhatsApp] [Cotizar]  │
│               ← price always visible │
└──────────────────────────────────────┘
```

This bar appears after the user scrolls past the above-the-fold CTAs. It ensures the conversion action is always within thumb reach. The price is repeated because on long pages, users forget the price.

---

## 10. Financing Calculator

### Logic

```typescript
// lib/financing/calculator.ts
interface FinancingInput {
  price: number;
  downPaymentPercent: number; // 10-50
  termMonths: number;         // 12, 24, 36, 48, 60, 72
  annualRate?: number;        // default: 12.5% (CR market standard)
}

interface FinancingOutput {
  downPayment: number;
  financedAmount: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
}

export function calculateFinancing({
  price,
  downPaymentPercent,
  termMonths,
  annualRate = 12.5,
}: FinancingInput): FinancingOutput {
  const downPayment = price * (downPaymentPercent / 100);
  const financedAmount = price - downPayment;
  const monthlyRate = annualRate / 100 / 12;

  // Standard amortization formula
  const monthlyPayment =
    financedAmount *
    (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);

  const totalCost = downPayment + monthlyPayment * termMonths;
  const totalInterest = totalCost - price;

  return {
    downPayment: Math.round(downPayment),
    financedAmount: Math.round(financedAmount),
    monthlyPayment: Math.round(monthlyPayment),
    totalInterest: Math.round(totalInterest),
    totalCost: Math.round(totalCost),
  };
}
```

### UX

- Sliders update output in real-time (no submit button)
- Output number animates on change (number counter effect, 200ms)
- Mobile: sliders are full-width, thumb-sized handles (44px)
- The calculator is embedded on the product page, not a separate route
- Pre-populated with 20% down / 48 months as sensible defaults for CR market

---

## 11. Multi-Currency System

### Design

Products are assigned a currency at the CMS level. The system does NOT convert between currencies — it displays the correct one.

```typescript
// lib/utils.ts
type Currency = 'CRC' | 'USD';

const formatters: Record<Currency, Intl.NumberFormat> = {
  CRC: new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }),
  USD: new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }),
};

export function formatPrice(amount: number, currency: Currency): string {
  return formatters[currency].format(amount);
}
```

**Output examples:**
- `formatPrice(2890000, 'CRC')` → `₡2.890.000`
- `formatPrice(9200, 'USD')` → `$9,200`

**Rules:**
- CRC: no decimals, period as thousands separator
- USD: no decimals, comma as thousands separator
- Currency is set per-product in Sanity, not per-session
- The `<PriceDisplay>` component handles rendering and takes `{amount, currency}` as props
- Financing calculator respects the product's currency

---

## 12. Service Booking Flow

### Multi-Step Form

```
Step 1: Service Type
├── Card selection (not dropdown)
├── Options: Mantenimiento | Reparación | Diagnóstico | Garantía
└── Visual: icon + title + short description per card

Step 2: Vehicle Info
├── Model (dropdown, filtered by type)
├── Year
├── Plate number (optional)
└── Description of issue (textarea, optional)

Step 3: Location & Schedule
├── Dealership selector (cards with map preview)
├── Date picker (disabled dates from API)
├── Time slot selector (morning / afternoon)
└── Shows real-time availability when API is integrated

Step 4: Contact Info
├── Name
├── Phone (required — CR format: 8 digits)
├── Email (optional)
└── Preferred contact method: WhatsApp / Llamada / Email

Step 5: Confirmation
├── Summary of all selections
├── Edit buttons per section
├── [Confirmar Reserva] CTA
└── Post-submit: success screen with reference number
```

**UX Decisions:**
- Card selection over dropdowns — visual, faster on mobile, no keyboard needed
- Progress indicator at top (step X of 5)
- Back button always visible
- Form state persisted in Zustand — survives accidental navigation
- Phone validation: exactly 8 digits, starts with 2/4/6/7/8 (CR mobile/landline prefixes)
- Built with React Hook Form + Zod — each step is a sub-schema, validated independently

**Architecture note:** This is designed API-ready. Currently, `Step 5` submits to our `/api/lead` endpoint which stores the booking and sends a notification. When the dealership provides an availability API, we plug it into Step 3 without changing the UI.

---

## 13. Locations System

### Design

```
┌───────────────────────────────────────────────────────┐
│  SUCURSALES YAMAHA                                    │
│                                                       │
│  [Filtrar: Todas ▾] [San José] [Heredia] [Alajuela]  │
│                                                       │
│  ┌─────────────────────────────┬─────────────────┐   │
│  │                             │                 │   │
│  │     GOOGLE MAP              │  Location Card  │   │
│  │     (interactive)           │  ─────────────  │   │
│  │                             │  Sucursal       │   │
│  │     Pins for each           │  La Uruca       │   │
│  │     location, colored       │                 │   │
│  │     by region               │  San José,      │   │
│  │                             │  200m norte     │   │
│  │                             │  del Hospital   │   │
│  │                             │                 │   │
│  │                             │  L-V: 8am-6pm  │   │
│  │                             │  S: 8am-12pm   │   │
│  │                             │                 │   │
│  │                             │  [Cómo llegar]  │   │
│  │                             │  [Llamar]       │   │
│  │                             │  [WhatsApp]     │   │
│  └─────────────────────────────┴─────────────────┘   │
│                                                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│  │ La Uruca │ │ Heredia  │ │ Alajuela │  ...        │
│  │ San José │ │ Centro   │ │ Centro   │             │
│  │ 2.3 km   │ │ 12 km    │ │ 18 km    │             │
│  └──────────┘ └──────────┘ └──────────┘             │
└───────────────────────────────────────────────────────┘
```

- Google Maps Embed (not JS API) — zero JavaScript overhead
- Distance shown if geolocation is available (progressive enhancement)
- Mobile: map collapses to a static preview, taps to expand
- Each location card has structured data (LocalBusiness schema)

---

## 14. Tracking & Analytics System

### Event Naming Convention

Format: `{category}_{action}_{label}`

| Event Name | Trigger | Parameters |
|---|---|---|
| `product_view` | Product page load | product_id, category, price, currency |
| `product_gallery_interact` | Gallery image change | product_id, image_index |
| `whatsapp_click` | WhatsApp CTA click | product_id, page, position (hero/sticky/fab) |
| `quote_request_start` | Cotizador form opened | product_id (if from product page) |
| `quote_request_submit` | Cotizador form submitted | product_id, source |
| `financing_calculator_interact` | Calculator slider moved | product_id, down_payment, term, monthly_result |
| `financing_cta_click` | "Solicitar financiamiento" | product_id, monthly_result |
| `service_booking_start` | Booking flow entered | — |
| `service_booking_step` | Each step completed | step_number, step_name |
| `service_booking_submit` | Booking confirmed | service_type, location |
| `dealership_directions` | "Cómo llegar" click | location_id |
| `dealership_call` | Phone number click | location_id |
| `category_view` | Category page load | category_name, product_count |
| `search_query` | Search performed | query, results_count |
| `nav_mega_menu_open` | Mega menu interaction | category |
| `cta_cotizar_nav` | "Cotizar" nav button | page |

### Data Layer Architecture

```typescript
// lib/tracking/events.ts
type TrackingEvent =
  | { name: 'product_view'; params: { product_id: string; category: string; price: number; currency: 'CRC' | 'USD' } }
  | { name: 'whatsapp_click'; params: { product_id?: string; page: string; position: 'hero' | 'sticky' | 'fab' } }
  | { name: 'financing_calculator_interact'; params: { product_id: string; down_payment: number; term: number; monthly_result: number } }
  // ... all events strictly typed

// lib/tracking/data-layer.ts
class TrackingDataLayer {
  private listeners: Array<(event: TrackingEvent) => void> = [];

  subscribe(listener: (event: TrackingEvent) => void) {
    this.listeners.push(listener);
    return () => { this.listeners = this.listeners.filter(l => l !== listener); };
  }

  push(event: TrackingEvent) {
    // Push to window.dataLayer for GTM compatibility
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: event.name,
        ...event.params,
      });
    }

    // Notify all listeners (GA4, Meta, TikTok)
    this.listeners.forEach(listener => listener(event));
  }
}

export const dataLayer = new TrackingDataLayer();
```

**Why a custom data layer instead of GTM directly:**
- Type safety — every event is validated at compile time
- Vendor independence — adding/removing a pixel doesn't touch component code
- Testability — mock the data layer in tests, verify events fire
- Performance — pixels load lazily, events are queued during hydration

### Pixel Integration

Each pixel adapter subscribes to the data layer and translates events to vendor-specific formats:

- **GA4:** `gtag('event', eventName, params)`
- **Meta Pixel:** `fbq('track', mappedEventName, params)` with standard event mapping (ViewContent, Lead, etc.)
- **TikTok:** `ttq.track(mappedEventName, params)`

Pixels are loaded via `next/script` with `strategy="afterInteractive"` — they never block page load.

---

## 15. SEO Strategy

### Technical SEO

| Feature | Implementation |
|---|---|
| Metadata | `generateMetadata()` per route, dynamic from CMS |
| Sitemap | `app/sitemap.ts` — auto-generated, includes products, categories, pages |
| Robots | `/robots.txt` via `app/robots.ts` |
| Canonical URLs | Set per page, self-referencing |
| Open Graph | Dynamic OG images via `ImageResponse` for product pages |
| JSON-LD | Product schema, LocalBusiness schema, BreadcrumbList |
| Hreflang | Not needed (single-language, Spanish) |
| Core Web Vitals | Optimized (see Performance section) |

### URL Structure

```
/                           → Homepage
/motos                      → All motorcycles
/motos/scooter              → Scooter category
/motos/scooter/nmax-155     → Product page (slug from CMS)
/cuadraciclos               → ATVs & utility
/cuadraciclos/grizzly-700   → Product page
/marino                     → Marine overview
/marino/waverunner          → Waverunner category
/marino/waverunner/fx-ho    → Product page
/marino/motores-fuera-de-borda → Outboard motors
/marino/taller-marino       → Marine workshop
/cotizador                  → Quote request
/repuestos                  → Parts
/taller                     → Service overview
/taller/reservar            → Service booking
/sucursales                 → Dealerships
/contacto                   → Contact
```

**Rules:**
- All lowercase, hyphens, no trailing slashes
- Slugs are CMS-controlled, not auto-generated from names
- Category + slug combo ensures unique, descriptive URLs
- No `/products/` or `/p/` prefixes — keep URLs shallow

### JSON-LD (Product Page)

```typescript
// Generated server-side per product
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Yamaha NMAX 155",
  "image": ["https://cdn.sanity.io/..."],
  "description": "...",
  "brand": {
    "@type": "Brand",
    "name": "Yamaha"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "CRC",
    "price": 2890000,
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Yamaha Costa Rica"
    }
  }
}
```

---

## 16. Performance Strategy

### Budget

| Metric | Target | Strategy |
|---|---|---|
| FCP | < 1.2s | Server Components, streamed HTML, font preload |
| LCP | < 2.0s | Priority image loading, optimized hero, edge caching |
| CLS | < 0.05 | Explicit image dimensions, font-display: optional, skeleton UI |
| INP | < 150ms | Minimal client JS, no heavy hydration, event delegation |
| TTI | < 3.0s | Code splitting, dynamic imports, lazy third-party scripts |
| Bundle (client) | < 120KB gzipped | Tree shaking, no barrel exports, component-level splitting |

### Specific Optimizations

1. **Image Pipeline**
   - Sanity CDN with automatic format negotiation (AVIF → WebP → JPEG)
   - `<Image>` component with responsive `srcSet` (640, 768, 1024, 1280, 1920)
   - Hero images: `priority` flag, preload hint in `<head>`
   - Gallery images: lazy loaded, triggered by viewport intersection
   - Blur placeholder: low-quality image placeholder (LQIP) from Sanity

2. **Font Loading**
   - Inter variable font, self-hosted, subset to Latin + Latin Extended
   - `font-display: optional` — prevents layout shift, accepts FOIT for first load
   - Preloaded in root layout `<head>`

3. **JavaScript Budget**
   - Server Components render to HTML — zero JS for static content
   - Client Components are split per-route via dynamic imports
   - Third-party scripts (analytics pixels) load `afterInteractive`
   - No polyfills for modern browsers — `browserslist: "last 2 versions"`

4. **Caching Strategy**
   - Static pages: ISR with 60s revalidation
   - Product pages: ISR with on-demand revalidation via Sanity webhook
   - API routes: `Cache-Control: s-maxage=60, stale-while-revalidate=300`
   - Static assets: immutable cache headers (hashed filenames)

5. **Edge Rendering**
   - Layout and navigation render at the edge (Vercel Edge Runtime)
   - Dynamic content (pricing, availability) streams in via Suspense
   - Middleware at edge for geolocation-based dealership suggestions

---

## 17. Rendering Strategy

### Hybrid Approach

| Page | Strategy | Why |
|---|---|---|
| Homepage | SSG + ISR (60s) | High traffic, content changes weekly |
| Category pages | SSG + ISR (60s) | Mostly static, new products monthly |
| Product pages | ISR (on-demand) | Prices change, triggered by CMS webhook |
| Cotizador | SSR | Form state, potential personalization |
| Service booking | SSR | Multi-step form, no cache benefit |
| Locations | SSG + ISR (24h) | Rarely changes |
| Contact | SSG | Static |

### On-Demand Revalidation

```typescript
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidation-secret');
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { _type, slug } = body;

  switch (_type) {
    case 'product':
      revalidatePath(`/motos/${slug.current}`);
      revalidateTag('products');
      break;
    case 'dealership':
      revalidatePath('/sucursales');
      revalidateTag('dealerships');
      break;
    case 'category':
      revalidateTag('categories');
      revalidatePath('/motos');
      break;
  }

  return NextResponse.json({ revalidated: true });
}
```

Sanity fires this webhook on publish. Page regenerates in < 5 seconds. No full redeploy needed.

---

## 18. CMS Architecture (Sanity)

### Content Models

**Product**
```
- name: string (required)
- slug: slug (auto from name, editable)
- category: reference → Category
- productType: 'moto' | 'cuadraciclo' | 'waverunner' | 'motor_fuera_borda'
- price: number (required)
- currency: 'CRC' | 'USD' (required)
- images: array of image (min 1)
- heroImage: image (required, used for OG)
- shortDescription: text (max 160 chars — used for meta)
- keySpecs: array of { icon, value, label }
- fullSpecs: array of { group, specs: [{ name, value }] }
- benefits: array of { type: 'emotional' | 'practical', title, description }
- financing: { eligible: boolean, defaultDownPayment: number, defaultTerm: number }
- relatedProducts: array of reference → Product
- seo: { title, description, ogImage }
- status: 'active' | 'coming_soon' | 'discontinued'
- featured: boolean
- sortOrder: number
```

**Category**
```
- name: string
- slug: slug
- parentCategory: 'motos' | 'cuadraciclos' | 'marino'
- description: text
- image: image
- productCount: computed
```

**Dealership**
```
- name: string
- slug: slug
- region: 'san_jose' | 'heredia' | 'alajuela' | 'cartago' | ...
- address: text
- coordinates: geopoint
- phone: string
- whatsapp: string
- hours: array of { day, open, close }
- services: array of string ('ventas' | 'taller' | 'repuestos' | 'marino')
- googleMapsEmbed: url
```

**Quote Request (stored, not in CMS)**
```
- product: reference → Product (optional)
- name: string
- phone: string
- email: string (optional)
- message: text (optional)
- source: 'product_page' | 'cotizador' | 'whatsapp'
- timestamp: datetime
- status: 'new' | 'contacted' | 'closed'
```

---

## 19. Code: Product Page

```typescript
// app/motos/[category]/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProduct, getRelatedProducts } from '@/lib/sanity/queries';
import { ProductHero } from '@/components/blocks/product-hero';
import { KeySpecs } from '@/components/composites/key-specs';
import { FinancingCalculator } from '@/components/blocks/financing-calculator';
import { ProductBenefits } from '@/components/blocks/product-benefits';
import { FullSpecs } from '@/components/blocks/full-specs';
import { RelatedProducts } from '@/components/blocks/related-products';
import { NearestDealership } from '@/components/blocks/nearest-dealership';
import { StickyCtaBar } from '@/components/patterns/sticky-cta-bar';
import { ProductJsonLd } from '@/components/seo/product-json-ld';
import { trackingEvents } from '@/lib/tracking/events';

interface ProductPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  return {
    title: `${product.name} ${product.year} — Yamaha Costa Rica`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} — Desde ${product.formattedPrice}`,
      description: product.shortDescription,
      images: [{ url: product.heroImage.url, width: 1200, height: 630 }],
      type: 'website',
    },
    alternates: {
      canonical: `https://yamahacr.com/motos/${product.category.slug}/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product.category.slug, product._id);

  return (
    <>
      <ProductJsonLd product={product} />

      <article className="relative">
        <ProductHero product={product} />

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <KeySpecs specs={product.keySpecs} />
        </section>

        {product.financing.eligible && (
          <section className="bg-surface-ghost py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <FinancingCalculator
                price={product.price}
                currency={product.currency}
                defaultDownPayment={product.financing.defaultDownPayment}
                defaultTerm={product.financing.defaultTerm}
                productId={product._id}
              />
            </div>
          </section>
        )}

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <ProductBenefits benefits={product.benefits} />
        </section>

        <section className="border-t border-surface-subtle py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FullSpecs specGroups={product.fullSpecs} />
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="bg-surface-ghost py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <RelatedProducts products={relatedProducts} />
            </div>
          </section>
        )}

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <NearestDealership />
          </div>
        </section>
      </article>

      <StickyCtaBar
        productName={product.name}
        price={product.price}
        currency={product.currency}
        productId={product._id}
        whatsappNumber="+50688888888"
      />
    </>
  );
}
```

---

## 20. Code: Financing Calculator

```typescript
// components/blocks/financing-calculator.tsx
'use client';

import { useState, useCallback, useMemo } from 'react';
import { calculateFinancing } from '@/lib/financing/calculator';
import { formatPrice } from '@/lib/utils';
import { dataLayer } from '@/lib/tracking/data-layer';
import { cn } from '@/lib/utils';

interface FinancingCalculatorProps {
  price: number;
  currency: 'CRC' | 'USD';
  defaultDownPayment: number;
  defaultTerm: number;
  productId: string;
}

const TERM_OPTIONS = [12, 24, 36, 48, 60, 72];

export function FinancingCalculator({
  price,
  currency,
  defaultDownPayment,
  defaultTerm,
  productId,
}: FinancingCalculatorProps) {
  const [downPaymentPercent, setDownPaymentPercent] = useState(defaultDownPayment);
  const [termMonths, setTermMonths] = useState(defaultTerm);

  const result = useMemo(
    () => calculateFinancing({ price, downPaymentPercent, termMonths }),
    [price, downPaymentPercent, termMonths]
  );

  const handleDownPaymentChange = useCallback(
    (value: number) => {
      setDownPaymentPercent(value);
      dataLayer.push({
        name: 'financing_calculator_interact',
        params: {
          product_id: productId,
          down_payment: value,
          term: termMonths,
          monthly_result: calculateFinancing({ price, downPaymentPercent: value, termMonths }).monthlyPayment,
        },
      });
    },
    [productId, price, termMonths]
  );

  const handleTermChange = useCallback(
    (value: number) => {
      setTermMonths(value);
      dataLayer.push({
        name: 'financing_calculator_interact',
        params: {
          product_id: productId,
          down_payment: downPaymentPercent,
          term: value,
          monthly_result: calculateFinancing({ price, downPaymentPercent, termMonths: value }).monthlyPayment,
        },
      });
    },
    [productId, price, downPaymentPercent]
  );

  return (
    <div className="rounded-xl border border-surface-subtle bg-white p-6 shadow-lg sm:p-8">
      <h2 className="text-2xl font-bold text-text-primary">Calculá tu cuota</h2>
      <p className="mt-1 text-sm text-text-muted">
        Simulá el financiamiento de tu próxima Yamaha
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-8">
          {/* Down Payment Slider */}
          <div>
            <div className="flex items-baseline justify-between">
              <label className="text-sm font-semibold text-text-secondary">
                Prima
              </label>
              <output className="text-lg font-bold text-primary-500">
                {downPaymentPercent}%
                <span className="ml-2 text-sm font-normal text-text-muted">
                  ({formatPrice(result.downPayment, currency)})
                </span>
              </output>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              step={5}
              value={downPaymentPercent}
              onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
              className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-muted accent-secondary-500
                         [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6
                         [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-secondary-500
                         [&::-webkit-slider-thumb]:shadow-md"
              aria-label="Porcentaje de prima"
            />
            <div className="mt-1 flex justify-between text-xs text-text-muted">
              <span>10%</span>
              <span>50%</span>
            </div>
          </div>

          {/* Term Selector */}
          <div>
            <label className="text-sm font-semibold text-text-secondary">
              Plazo
            </label>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {TERM_OPTIONS.map((term) => (
                <button
                  key={term}
                  onClick={() => handleTermChange(term)}
                  className={cn(
                    'rounded-lg border px-3 py-2.5 text-sm font-semibold transition-all',
                    term === termMonths
                      ? 'border-secondary-500 bg-secondary-50 text-secondary-700 shadow-sm'
                      : 'border-surface-subtle bg-white text-text-secondary hover:border-secondary-300'
                  )}
                >
                  {term}m
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col items-center justify-center rounded-xl bg-primary-500 p-8 text-white">
          <span className="text-sm font-medium uppercase tracking-wider text-primary-200">
            Cuota mensual
          </span>
          <span className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {formatPrice(result.monthlyPayment, currency)}
          </span>
          <span className="mt-1 text-sm text-primary-200">
            por {termMonths} meses
          </span>

          <div className="mt-6 w-full space-y-2 border-t border-primary-400 pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-primary-200">Monto a financiar</span>
              <span className="font-semibold">{formatPrice(result.financedAmount, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-200">Costo total</span>
              <span className="font-semibold">{formatPrice(result.totalCost, currency)}</span>
            </div>
          </div>

          <button className="mt-6 w-full rounded-lg bg-secondary-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-secondary-400 hover:shadow-glow-cta">
            Solicitar financiamiento
          </button>
          <p className="mt-3 text-center text-xs text-primary-300">
            Sujeto a aprobación crediticia. Tasa referencial 12.5% anual.
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## 21. Code: WhatsApp Tracking

```typescript
// components/patterns/whatsapp-cta.tsx
'use client';

import { useCallback } from 'react';
import { dataLayer } from '@/lib/tracking/data-layer';
import { cn } from '@/lib/utils';

interface WhatsAppCtaProps {
  phoneNumber: string;
  message?: string;
  productId?: string;
  productName?: string;
  page: string;
  position: 'hero' | 'sticky' | 'fab';
  variant?: 'primary' | 'compact';
  className?: string;
}

function buildWhatsAppUrl(phone: string, message?: string): string {
  const cleaned = phone.replace(/[^0-9]/g, '');
  const base = `https://wa.me/${cleaned}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function WhatsAppCta({
  phoneNumber,
  message,
  productId,
  productName,
  page,
  position,
  variant = 'primary',
  className,
}: WhatsAppCtaProps) {
  const defaultMessage = productName
    ? `Hola, me interesa el modelo ${productName}. ¿Podrían darme más información?`
    : 'Hola, me gustaría recibir información sobre sus productos.';

  const finalMessage = message || defaultMessage;
  const href = buildWhatsAppUrl(phoneNumber, finalMessage);

  const handleClick = useCallback(() => {
    dataLayer.push({
      name: 'whatsapp_click',
      params: {
        product_id: productId,
        page,
        position,
      },
    });
  }, [productId, page, position]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-bold transition-all',
        variant === 'primary' && [
          'rounded-xl bg-[#25D366] px-6 py-4 text-white shadow-md',
          'hover:bg-[#20bd5a] hover:shadow-lg hover:-translate-y-0.5',
          'active:translate-y-0 active:shadow-md',
        ],
        variant === 'compact' && [
          'rounded-lg bg-[#25D366] px-4 py-2.5 text-sm text-white',
          'hover:bg-[#20bd5a]',
        ],
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={cn(variant === 'primary' ? 'h-5 w-5' : 'h-4 w-4')}
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.325 0-4.47-.744-6.228-2.01l-.436-.326-2.641.885.885-2.641-.326-.436A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      </svg>
      {variant === 'primary' ? 'Consultar por WhatsApp' : 'WhatsApp'}
    </a>
  );
}
```

### Floating WhatsApp Button (FAB)

```typescript
// components/patterns/whatsapp-fab.tsx
'use client';

import { WhatsAppCta } from './whatsapp-cta';

interface WhatsAppFabProps {
  phoneNumber: string;
  page: string;
}

export function WhatsAppFab({ phoneNumber, page }: WhatsAppFabProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8">
      <WhatsAppCta
        phoneNumber={phoneNumber}
        page={page}
        position="fab"
        className="h-14 w-14 rounded-full p-0 shadow-xl [&>svg]:h-7 [&>svg]:w-7 [&>span]:sr-only"
      />
    </div>
  );
}
```

---

## 22. Code: SEO System

```typescript
// components/seo/product-json-ld.tsx
import type { Product } from '@/types/product';

interface ProductJsonLdProps {
  product: Product;
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.map((img) => img.url),
    description: product.shortDescription,
    brand: {
      '@type': 'Brand',
      name: 'Yamaha',
    },
    offers: {
      '@type': 'Offer',
      url: `https://yamahacr.com/motos/${product.category.slug}/${product.slug}`,
      priceCurrency: product.currency,
      price: product.price,
      availability:
        product.status === 'active'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/PreOrder',
      seller: {
        '@type': 'Organization',
        name: 'Yamaha Costa Rica',
      },
    },
    ...(product.keySpecs && {
      additionalProperty: product.keySpecs.map((spec) => ({
        '@type': 'PropertyValue',
        name: spec.label,
        value: spec.value,
      })),
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// app/sitemap.ts
import { MetadataRoute } from 'next';
import { getAllProducts, getAllCategories } from '@/lib/sanity/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yamahacr.com';

  const products = await getAllProducts();
  const categories = await getAllCategories();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/motos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/cuadraciclos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/marino`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/cotizador`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/repuestos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/taller`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/sucursales`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contacto`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/motos/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/motos/${product.category.slug}/${product.slug}`,
    lastModified: new Date(product._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
```

---

## 23. Code: Tracking Data Layer

```typescript
// lib/tracking/data-layer.ts
type TrackingEvent =
  | { name: 'product_view'; params: { product_id: string; category: string; price: number; currency: string } }
  | { name: 'whatsapp_click'; params: { product_id?: string; page: string; position: string } }
  | { name: 'quote_request_start'; params: { product_id?: string } }
  | { name: 'quote_request_submit'; params: { product_id?: string; source: string } }
  | { name: 'financing_calculator_interact'; params: { product_id: string; down_payment: number; term: number; monthly_result: number } }
  | { name: 'financing_cta_click'; params: { product_id: string; monthly_result: number } }
  | { name: 'service_booking_start'; params: Record<string, never> }
  | { name: 'service_booking_step'; params: { step_number: number; step_name: string } }
  | { name: 'service_booking_submit'; params: { service_type: string; location: string } }
  | { name: 'dealership_directions'; params: { location_id: string } }
  | { name: 'dealership_call'; params: { location_id: string } }
  | { name: 'category_view'; params: { category_name: string; product_count: number } }
  | { name: 'cta_cotizar_nav'; params: { page: string } };

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
    fbq: (...args: unknown[]) => void;
    ttq: { track: (...args: unknown[]) => void };
  }
}

type Listener = (event: TrackingEvent) => void;

class DataLayer {
  private listeners: Listener[] = [];
  private queue: TrackingEvent[] = [];
  private initialized = false;

  subscribe(listener: Listener) {
    this.listeners.push(listener);

    if (this.initialized) {
      this.queue.forEach(listener);
    }

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  init() {
    this.initialized = true;
    this.queue.forEach((event) => {
      this.listeners.forEach((listener) => listener(event));
    });
    this.queue = [];
  }

  push(event: TrackingEvent) {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: event.name, ...event.params });
    }

    if (!this.initialized) {
      this.queue.push(event);
      return;
    }

    this.listeners.forEach((listener) => listener(event));
  }
}

export const dataLayer = new DataLayer();

// lib/tracking/ga4.ts
import { dataLayer } from './data-layer';

export function initGA4(measurementId: string) {
  return dataLayer.subscribe((event) => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', event.name, event.params);
  });
}

// lib/tracking/meta-pixel.ts
import { dataLayer } from './data-layer';

const META_EVENT_MAP: Record<string, string> = {
  product_view: 'ViewContent',
  quote_request_submit: 'Lead',
  whatsapp_click: 'Contact',
  financing_cta_click: 'InitiateCheckout',
  service_booking_submit: 'Schedule',
};

export function initMetaPixel() {
  return dataLayer.subscribe((event) => {
    if (typeof window.fbq !== 'function') return;
    const metaEvent = META_EVENT_MAP[event.name];
    if (metaEvent) {
      window.fbq('track', metaEvent, event.params);
    } else {
      window.fbq('trackCustom', event.name, event.params);
    }
  });
}

// lib/tracking/tiktok-pixel.ts
import { dataLayer } from './data-layer';

const TIKTOK_EVENT_MAP: Record<string, string> = {
  product_view: 'ViewContent',
  quote_request_submit: 'SubmitForm',
  whatsapp_click: 'Contact',
  financing_cta_click: 'ClickButton',
};

export function initTikTokPixel() {
  return dataLayer.subscribe((event) => {
    if (!window.ttq?.track) return;
    const ttEvent = TIKTOK_EVENT_MAP[event.name];
    if (ttEvent) {
      window.ttq.track(ttEvent, event.params);
    }
  });
}

// lib/tracking/provider.tsx
'use client';

import { useEffect } from 'react';
import { dataLayer } from './data-layer';
import { initGA4 } from './ga4';
import { initMetaPixel } from './meta-pixel';
import { initTikTokPixel } from './tiktok-pixel';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const unsubGA4 = initGA4(process.env.NEXT_PUBLIC_GA4_ID!);
    const unsubMeta = initMetaPixel();
    const unsubTikTok = initTikTokPixel();

    dataLayer.init();

    return () => {
      unsubGA4();
      unsubMeta();
      unsubTikTok();
    };
  }, []);

  return <>{children}</>;
}
```

---

## 24. Deployment & CI/CD

### Vercel Configuration

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
    deviceSizes: [640, 768, 1024, 1280, 1920],
  },
  experimental: {
    optimizePackageImports: ['@radix-ui/react-accordion', '@radix-ui/react-dialog'],
  },
  headers: async () => [
    {
      source: '/fonts/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
  ],
};

export default nextConfig;
```

### CI Pipeline (GitHub Actions)

```
on push:
  1. Type check (tsc --noEmit)
  2. Lint (eslint)
  3. Unit tests (vitest — calculator, utils, tracking)
  4. Build (next build)
  5. Lighthouse CI (budget enforcement)
  6. Deploy preview → Vercel

on merge to main:
  1. All above +
  2. Production deploy → Vercel
  3. Sanity webhook reconfiguration (if schema changed)
```

---

## 25. Future Scaling

### WebAssembly-Ready Components

The financing calculator is a candidate for WASM if computational complexity increases (e.g., multi-product comparison, amortization table generation). Current architecture isolates calculation logic in `lib/financing/calculator.ts` — this module can be swapped for a WASM build without touching the UI component.

### AI-Powered Features (Future)

- **Smart product recommendations** — based on browsing patterns, served via Edge Middleware
- **Chat assistant** — RAG-based, trained on product catalog + FAQs, replaces static FAQ page
- **Dynamic pricing display** — A/B test price presentation (total vs monthly) based on user segment

### Multi-Dealership Scaling

The CMS and routing architecture supports multi-region expansion:
- Dealership-scoped inventory (product availability per location)
- Region-based landing pages (`/san-jose/motos/nmax-155`)
- Separate WhatsApp numbers per dealership

### Performance Monitoring

Post-launch, implement:
- Real User Monitoring (RUM) via Vercel Analytics
- Error tracking via Sentry (client + server)
- Custom dashboards: conversion funnel, WhatsApp CTR by product, financing calculator engagement rate

---

## Appendix: Environment Variables

```bash
# .env.local.example
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXX
NEXT_PUBLIC_TIKTOK_PIXEL_ID=XXXXXXXXXX
NEXT_PUBLIC_WHATSAPP_NUMBER=+50688888888
NEXT_PUBLIC_SITE_URL=https://yamahacr.com

SANITY_PROJECT_ID=xxxxxxxxxx
SANITY_DATASET=production
SANITY_API_TOKEN=sk-xxxxxxxx
REVALIDATION_SECRET=xxxxxxxx

NEXT_PUBLIC_GOOGLE_MAPS_KEY=AIzaXXXXXXXXXXXX
```

---

*This document is the single source of truth for the Yamaha CR platform architecture. Every implementation decision should trace back to a section in this document. If it's not here, it hasn't been decided.*
