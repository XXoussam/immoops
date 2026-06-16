Add a new landing page section to the ImmoOps site.

Steps:
1. Ask for the section name and purpose if not provided
2. Create `src/components/sections/<SectionName>.tsx` using `SectionWrapper` for scroll reveal
3. Add any static content/data to `src/lib/constants.ts`
4. Import and add the section in `src/App.tsx` at the correct position
5. Follow the design system: use `.h2`, `.body1`, `.btn-primary`, `.container-main`, `.card` etc. — not raw Tailwind
6. All copy must be in French

The section must follow the existing component pattern: named export, no default export, TypeScript, no inline styles.
