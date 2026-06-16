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

**Headings:** Sora — modern, AI-focused, premium  
**Body:** Inter — clean, readable, trusted

```css
font-family: 'Sora', sans-serif;   /* h1–h4 */
font-family: 'Inter', sans-serif;  /* body, labels, UI */
```

Load from Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

---

## Buttons

### Primary

```css
background: #6D4AFF;
color: #FFFFFF;
border-radius: 16px;
padding: 10px 20px;
font-family: Inter;
font-weight: 500;
```

### Hover

```css
background: #7F5FFF;
box-shadow: 0 4px 20px rgba(109, 74, 255, 0.35);
```

### Outline (light bg)

```css
background: rgba(255, 255, 255, 0.55);
backdrop-filter: blur(8px);
border: 1px solid #E8EAF0;
color: #0F1117;
border-radius: 16px;
```

### Outline (dark bg)

```css
background: rgba(255, 255, 255, 0.08);
backdrop-filter: blur(8px);
border: 1px solid rgba(255, 255, 255, 0.18);
color: #FFFFFF;
border-radius: 16px;
```

---

## Card System

### Light card (white sections)

```css
background: rgba(255, 255, 255, 0.72);
backdrop-filter: blur(20px) saturate(160%);
border: 1px solid rgba(255, 255, 255, 0.85);
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.07), inset 0 1px 0 rgba(255, 255, 255, 1);
border-radius: 16px;
```

### Dark card (dark sections)

```css
background: rgba(255, 255, 255, 0.07);
backdrop-filter: blur(24px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.12);
box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.10);
border-radius: 16px;
```

---

## Implementation Notes

- Dark sections use `#0F1117` as background (replaces `#0f042d`)
- Keep glass/blur effects across all cards and buttons (Apple liquid glass)
- Never use `rounded-btn` (4px) — all interactive elements use `rounded-2xl` (16px)
- Purple glow shadows: `0 4px 20px rgba(109, 74, 255, 0.35)`
- Neutral shadows: `0 2px 12px rgba(0, 0, 0, 0.07)`
