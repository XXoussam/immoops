# Component conventions

## Structure

- `sections/` — full-width page sections. Each maps to one visible block on the page.
- `layout/` — `Navbar` and `Footer` only.
- `ui/` — primitives shared across sections: `Button`, `Badge`, `Accordion`, `GlassCard`, `SectionWrapper`.

## Rules for all components

- Named exports only, no default exports.
- Wrap new sections in `SectionWrapper` (handles scroll reveal + max-width layout).
- Use CSS utility classes from `index.css`, not raw Tailwind chains:
  - Headings: `.h2`, `.h3`, `.h4`
  - Body: `.body1`, `.body2`
  - Buttons: `.btn-primary`, `.btn-outline`, `.btn-outline-white`
  - Layout: `.container-main`, `.section`, `.section-sm`
  - Cards: `.card`, `.card-white`, `.card-dark`
- Do not use the `Button.tsx` component in section files — it uses a different token set (`bg-accent`) that is inconsistent with the rest of the site.
- Static data and copy belong in `src/lib/constants.ts`, not hardcoded in JSX.
- All user-facing text is in French.
