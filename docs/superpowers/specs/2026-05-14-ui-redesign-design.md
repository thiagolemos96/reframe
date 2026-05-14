# ReFrame — UI Redesign Spec

**Date:** 2026-05-14
**Status:** Approved

## Context

The current UI was built solo by a backend developer and works functionally but lacks visual polish. The goal is a full redesign: new visual style, restructured screens, and a user-configurable accent color system. All existing functionality is preserved — this is a UI-only change.

---

## Design Decisions

| Area | Decision |
|---|---|
| Visual style | Glass Premium dark — blur, gradients, translucent surfaces |
| Accent color | User-chosen: 6 preset swatches + custom native color picker |
| Info overlay | Large clock, bottom-left corner, no background card |
| Settings structure | Bottom sheet (slides up), ~55% height, two-column layout |

---

## 1. Visual Style System

### CSS Custom Properties

All accent color references use a single CSS variable propagated from a root property:

```css
:root {
  --accent: #6366f1;
  --accent-light: #a5b4fc;   /* set via JS alongside --accent */
  --accent-bg: rgba(99,102,241,0.15);   /* set via JS */
  --accent-border: rgba(99,102,241,0.35);   /* set via JS */
}
```

`color-mix()` is not supported on Safari 12 (the app's target). All derived variables are computed in JS and set together:

```js
const applyAccent = (hex) => {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  const root = document.documentElement;
  root.style.setProperty('--accent', hex);
  root.style.setProperty('--accent-light', `rgba(${r},${g},${b},0.85)`);
  root.style.setProperty('--accent-bg', `rgba(${r},${g},${b},0.15)`);
  root.style.setProperty('--accent-border', `rgba(${r},${g},${b},0.35)`);
};
```

Call `applyAccent(config.accentColor)` on app load and on every color change.

### Base palette

```
--bg-base:    #08080f       /* page background */
--bg-surface: rgba(255,255,255,0.04)   /* cards, sheet */
--bg-input:   rgba(255,255,255,0.05)   /* form fields */
--border:     rgba(255,255,255,0.08)   /* subtle borders */
--text-primary:   #ffffff
--text-secondary: rgba(255,255,255,0.45)
--text-muted:     rgba(255,255,255,0.25)
```

### Typography

- Font stack: `-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui`
- Clock: `font-weight: 100`, large (`4rem+`), `letter-spacing: -3px`
- Labels: `0.58rem`, `text-transform: uppercase`, `letter-spacing: 2px`
- Body: `0.85rem`, `font-weight: 400`

---

## 2. Config Changes

Add `accentColor` field to `DEFAULT_CONFIG` in `AppContext.jsx`:

```js
const DEFAULT_CONFIG = {
  time: 10,
  effect: 'zoom',
  showInfo: 'yes',
  fitMode: 'cover',
  infoColor: '#ffffff',
  infoBg: 'glass',
  infoShadow: 'normal',
  accentColor: '#6366f1'   // new
};
```

On app load and on every config change, apply the accent CSS variable:

```js
document.documentElement.style.setProperty('--accent', config.accentColor);
```

---

## 3. Start Screen

**File:** `src/components/StartScreen.jsx`

- Centered glass card (`border-radius: 24px`, `backdrop-filter: blur(20px)`)
- App icon (frame emoji or SVG) above the title
- Title: "ReFrame", `font-weight: 300`
- Subtitle: "Turn your screen into a personal photo frame"
- CTA button: `background: linear-gradient(135deg, var(--accent), ...)`, full width, `border-radius: 14px`
- Settings button: visible but dimmed (`opacity: 0.3`) since there are no photos yet

---

## 4. Info Overlay

**File:** `src/components/InfoOverlay.jsx`

- Position: `bottom: 28px`, `left: 28px` (was bottom-right)
- No background card — text only with `text-shadow` for legibility
- Layout:
  ```
  21:47                          ← font-size: 4rem, weight: 100
  Wednesday, 14 May · 23°C São Paulo   ← font-size: 0.8rem, muted
  ```
- Date and weather on one line, separated by `·`
- Clock color: `#ffffff`
- Weather accent: `var(--accent-light)` for the temperature/city
- Remove all `infoBg`, `infoShadow`, `infoColor` config options — replaced by fixed style

**CSS:** Remove `.info-container` glass/dark logic. Replace with:
```css
.info-container {
  position: absolute;
  bottom: 28px;
  left: 28px;
  z-index: 10;
  pointer-events: none;
}
```

---

## 5. Settings — Bottom Sheet

**File:** `src/components/SettingsModal.jsx` (restructure, keep filename)

### Behavior

- Opens by sliding up from bottom (`transform: translateY(0)` animated from `translateY(100%)`)
- Height: `55vh` (fixed, no scroll needed — content fits in two columns)
- Clicking the backdrop closes the sheet
- Handle bar at top (36px wide, 4px tall, `rgba(255,255,255,0.1)`)

### Layout — Two columns

**Left column: Gallery**
- Label: "Gallery · N photos"
- Thumbnail grid: 42×42px, `border-radius: 8px`, tap to remove (confirm dialog)
- Add button: dashed border with accent color, `+` icon

**Right column: Display settings**
- Section label: "Display"
- Two-up row: Effect + Interval (each a styled `<select>` / `<input>`)
- Photo Mode (full-width select)
- Accent Color picker (see section 6)

### Footer

Two buttons side by side:
- "Save and Return" — `background: linear-gradient(135deg, var(--accent), ...)`, flex: 1
- "Reset" — destructive, `color: #ff453a`, `border: 1px solid rgba(255,69,58,0.2)`, fixed width

### CSS Animation

```css
.settings-sheet {
  transform: translateY(100%);
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
}
.settings-sheet.open {
  transform: translateY(0);
}
```

---

## 6. Accent Color Picker

Inside the right column of the settings sheet.

### Preset swatches (6 colors)

| Color | Hex |
|---|---|
| Indigo (default) | `#6366f1` |
| Blue | `#0a84ff` |
| Cyan | `#06b6d4` |
| Green | `#10b981` |
| Amber | `#f59e0b` |
| Red | `#ef4444` |

Each rendered as a `22px` circle. Active swatch shows a white ring (`border: 2px solid white`, `box-shadow: 0 0 0 1px var(--accent)`).

### Custom swatch

A 7th circle with `conic-gradient(red, yellow, lime, cyan, blue, magenta, red)`. Clicking it triggers a hidden `<input type="color">`. The selected color is applied immediately and saved to config.

### Behavior

On selection (preset or custom):
1. Update `config.accentColor`
2. Call `document.documentElement.style.setProperty('--accent', color)`
3. UI updates instantly — no save required for color preview

---

## 7. Settings Button

**File:** `src/App.jsx` (inline in `MainLayout`)

Replace the current bare icon with a glass pill:

```
42×42px circle
background: rgba(0,0,0,0.4)
backdrop-filter: blur(10px)
border: 1px solid rgba(255,255,255,0.12)
border-radius: 50%
position: fixed, top: 16px, right: 16px
```

---

## 8. Files to Modify

| File | Change |
|---|---|
| `src/App.css` | Full rewrite — new design tokens, bottom sheet animation, glass styles |
| `src/index.css` | Remove Vite defaults that conflict |
| `src/components/StartScreen.jsx` | New glass card layout |
| `src/components/InfoOverlay.jsx` | New position (bottom-left), no background, single-line date+weather |
| `src/components/SettingsModal.jsx` | Full restructure: bottom sheet, two columns, color picker |
| `src/context/AppContext.jsx` | Add `accentColor` to config, apply CSS var on change |

---

## 9. What Does NOT Change

- All slideshow logic (`Slideshow.jsx`) — untouched
- `LoadingScreen.jsx` — minor style update only (consistent with new palette)
- `useTime.js`, `useWeather.js` — untouched
- `db.js` — untouched
- All config fields except removing `infoColor`, `infoBg`, `infoShadow` (replaced by fixed overlay style)

---

## 10. Verification

1. `npm run dev` in `ReFrame/`
2. Start screen appears: glass card centered, button uses accent color
3. Add photos: slideshow starts, clock appears bottom-left (large, no card)
4. Settings button opens bottom sheet with slide-up animation
5. Change accent color via preset: entire UI updates immediately
6. Change accent via custom (rainbow swatch): color picker opens, selection applies
7. Settings saved on "Save and Return": persist after page reload
8. Reset: returns to start screen, accent resets to indigo
9. Test on mobile/iPad viewport: bottom sheet and two-column layout behave correctly
