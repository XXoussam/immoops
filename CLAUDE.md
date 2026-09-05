# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server (Vite HMR)
npm run build     # TypeScript check + production build
npm run lint      # ESLint
npm run preview   # preview production build locally
```

No test runner is configured.

## Project overview

ImmoOps is a French-language marketing landing page for an AI automation platform targeting real estate agencies. It is a single-page React app with no routing — `App.tsx` composes all sections in order.

## Architecture

**Page composition** — `src/App.tsx` is the single entry point. It assembles layout components (`Navbar`, `Footer`) around a fixed sequence of section components. There is no router.

**Content data** — All copy, lists, and structured data (nav links, services, FAQ items, channels, smart ops features) live in `src/lib/constants.ts`. Edit content there, not inside components.

**Component layers:**

| Folder | Role |
|---|---|
| `src/components/sections/` | Full-width page sections (`Hero`, `Services`, `FAQ`, etc.) |
| `src/components/layout/` | `Navbar` and `Footer` |
| `src/components/ui/` | Primitives: `Button`, `Badge`, `Accordion`, `GlassCard`, `SectionWrapper` |
| `src/hooks/` | `useScrollReveal` (one-shot IntersectionObserver), `useCountUp` |

**Scroll reveal** — `SectionWrapper` wraps every section and wires `useScrollReveal` to a fade+slide-up animation. Sections that manage their own layout skip `SectionWrapper` and apply the hook directly.

**Component rules:**
- Named exports only — no default exports in section or UI components.
- Wrap new sections in `SectionWrapper` (handles scroll reveal + max-width layout).
- Static data and copy belong in `src/lib/constants.ts`, not hardcoded in JSX.

## Design system

The full brand guide lives in **`brand_name/brand.md`**. All color, typography, and component decisions must follow it.

### Color tokens

Tokens are defined in **`tailwind.config.js`** and must match the brand guide values:

| Tailwind token   | Hex       | Role                          |
|------------------|-----------|-------------------------------|
| `purple`         | `#6D4AFF` | Primary purple                |
| `purple-hover`   | `#7F5FFF` | Hover state                   |
| `purple-light`   | `#C084FC` | Accent / soft glow            |
| `purple-pale`    | `#F7F5FF` | Soft tinted background        |
| `ink`            | `#0F1117` | Dark text                     |
| `ink-body`       | `#6B7280` | Secondary / body text         |
| `gray-bg`        | `#F7F5FF` | Page soft background          |
| `gray-line`      | `#E8EAF0` | Borders                       |

Accent colors (use sparingly): `#8B5CF6` electric purple, `#60A5FA` sky blue, `#10B981` emerald.

### Typography

- **Headings (`h1`–`h4`):** Sora — `font-tight` alias in Tailwind
- **Body / UI:** Inter — `font-sans` alias in Tailwind

### CSS utility classes

**`src/index.css`** defines all composable utility classes. Always use these in JSX — never write raw Tailwind chains for headings, buttons, cards, or layout:

| Class | Purpose |
|---|---|
| `.h1` `.h2` `.h3` `.h4` | Headings (Sora, weight 500) |
| `.h1-white` `.h2-white` | White variants for dark sections |
| `.body1` `.body2` | Body text (Inter) |
| `.body1-white` | White body for dark sections |
| `.label` `.label-muted` `.label-white` | Section eyebrow labels |
| `.btn-primary` | Purple glass button — `#6D4AFF`, `border-radius: 16px` |
| `.btn-primary-dark` | White glass button for dark sections |
| `.btn-outline` | Frosted light-bg outline button |
| `.btn-outline-white` | Frosted dark-bg outline button |
| `.card` `.card-white` `.card-dark` `.glass-card` | Liquid glass cards |
| `.container-main` | Max-width `1200px`, centered, responsive padding |
| `.section` `.section-sm` | Vertical section spacing |
| `.reveal` | Scroll-reveal base state (paired with `.visible`) |

**Never use `Button.tsx`** in section components — it uses a different token set (`bg-accent`) incompatible with the rest of the site.

### Button radius

All buttons use `border-radius: 16px` (`rounded-2xl`). Do not use `rounded-btn` (4px) for any user-facing button.

### Cards — liquid glass

All cards use `backdrop-filter: blur()` with semi-transparent backgrounds and an inset top-edge highlight. See `brand_name/brand.md` for full specs. Use `.card-white` on light sections, `.card-dark` on dark sections.

### Icons

HugeIcons (`@hugeicons/react`) is the primary icon library. Do not use Lucide React. Icon components from constants are typed as `object` and passed as props; render them with `<HugeiconsIcon icon={X} size={24} strokeWidth={1.5} />`.

## Language

All UI copy is in French. Keep all user-facing text in French when adding or modifying content.

## Screenshot workflow

Puppeteer is installed at `C:/Users/nateh/AppData/Local/Temp/puppeteer-test/`. Chrome cache is at `C:/Users/nateh/.cache/puppeteer/`.

- Dev server must be running before screenshotting (`npm run dev`)
- Take a screenshot: `node screenshot.mjs http://localhost:5173`
- Optional label: `node screenshot.mjs http://localhost:5173 label` → saves as `screenshot-N-label.png`
- Screenshots are saved to `./temp_screenshots/screenshot-N.png` (auto-incremented, never overwritten)
- After screenshotting, use the Read tool on the saved PNG — Claude can analyze the image directly

**When comparing screenshots, be specific:**
- "heading is 32px but reference shows ~24px"
- "card gap is 16px but should be 24px"

**Check:** spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing.
