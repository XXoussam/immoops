Review the current component or section for design system compliance.

Check:
1. **Typography** — using `.h1`–`.h4`, `.body1`, `.body2`, `.label` classes, not raw `text-*` sizes
2. **Buttons** — using `.btn-primary`, `.btn-outline`, `.btn-outline-white`, not the Button.tsx component
3. **Layout** — using `.container-main` and `.section` / `.section-sm` for spacing
4. **Colors** — using design tokens (`purple`, `ink`, `gray-*`) not arbitrary hex values
5. **Cards** — using `.card`, `.card-white`, or `.card-dark`
6. **Icons** — using HugeIcons as primary, with `size={24}` prop
7. **Scroll reveal** — section is wrapped in `SectionWrapper` or uses `useScrollReveal` directly
8. **Content** — static lists/data defined in `src/lib/constants.ts`, not hardcoded in JSX
9. **Language** — all user-facing text is in French

Report violations with file and line number. Suggest the correct class or pattern.
