# ImmoOps AI — Brand System

**Style direction:** Luxury AI × Modern Real Estate × Apple-inspired  
**Feel:** Premium, trustworthy, modern — not the typical bright startup purple.

---

## Color Palette

| Token name       | Role                | Hex       |
|------------------|---------------------|-----------|
| `purple`         | Primary purple      | `#6D4AFF` |
| `purple-hover`   | Hover state         | `#7F5FFF` |
| `purple-light`   | Accent / soft glow  | `#C084FC` |
| `purple-pale`    | Soft tinted bg      | `#F7F5FF` |
| `ink`            | Dark text           | `#0F1117` |
| `ink-body`       | Secondary text      | `#6B7280` |
| `gray-bg`        | Soft background     | `#F7F5FF` |
| `gray-line`      | Borders             | `#E8EAF0` |
| `white`          | Background          | `#FFFFFF` |
| `success`        | Emerald accent      | `#10B981` |
| `accent-blue`    | Sky blue accent     | `#60A5FA` |
| `electric`       | Electric purple     | `#8B5CF6` |

### Accent colors (use sparingly)

```
#8B5CF6  Electric Purple
#60A5FA  Sky Blue
#10B981  Emerald
```

---

## Gradients

### Hero gradient

```css
background: linear-gradient(135deg, #6D4AFF 0%, #8B5CF6 50%, #C084FC 100%);
```

### Glassmorphism (cards, floating elements)

```css
background: rgba(255, 255, 255, 0.08);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.18);
```

---

## Typography

Style reference: [galadrim.fr](https://galadrim.fr) — geometric sans with mono labels.

**Headings + body:** Jost — geometric, Futura-like (headings weight 500, tight tracking)  
**Labels, buttons, tags:** Fira Mono — uppercase, 11–12px, letter-spacing 0.04em

```css
font-family: 'Jost', sans-serif;       /* h1–h4, body */
font-family: 'Fira Mono', monospace;   /* eyebrow labels, buttons, tags */
```

Load from Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Fira+Mono:wght@400;500;700&display=swap" rel="stylesheet">
```

---

## Buttons

Square, solid, mono uppercase. Height 44px, padding 0 20px, `border-radius: 0`.

### Primary

```css
background: #6D4AFF;
color: #FFFFFF;
border-radius: 0;
font: 500 12px 'Fira Mono', monospace;
text-transform: uppercase;
letter-spacing: 0.04em;
```

### Hover

```css
background: #7F5FFF;
box-shadow: 0 4px 20px rgba(109, 74, 255, 0.35);
```

### Outline (light bg)

```css
background: transparent;
border: 1px solid rgba(15, 17, 23, 0.22);
color: #0F1117;   /* hover: border + text #6D4AFF */
```

### Outline (dark bg)

```css
background: transparent;
border: 1px solid rgba(255, 255, 255, 0.3);
color: #FFFFFF;   /* hover: background rgba(255,255,255,0.08) */
```

---

## Card System

Flat, square, 1px hairline border, with small `+` cross marks centred on each corner (purple at 55% on light, `#C084FC` at 60% on dark).

### Light card (white sections)

```css
background: #FFFFFF;
border: 1px solid #E8EAF0;   /* hover: rgba(109, 74, 255, 0.45) */
border-radius: 0;
```

### Dark card (dark sections)

```css
background: rgba(255, 255, 255, 0.04);
border: 1px solid rgba(255, 255, 255, 0.10);   /* hover: rgba(192, 132, 252, 0.45) */
border-radius: 0;
```

---

## Implementation Notes

- Dark sections use `#0F1117` as background (replaces `#0f042d`)
- Square corners everywhere (buttons, cards, tags, labels); only true circles (avatars, dots) stay round
- Labels, buttons and tags are set in Fira Mono uppercase
- Purple glow shadows: `0 4px 20px rgba(109, 74, 255, 0.35)`
- Neutral shadows: `0 2px 12px rgba(0, 0, 0, 0.07)`
