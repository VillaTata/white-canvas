

## Plan: Refactor and Upgrade Landing Page

### 1. Extract sections into separate components

Split `Index.tsx` (547 lines) into focused components:

- `src/components/landing/Navbar.tsx` -- header + nav links + logo/name with scroll-to-top
- `src/components/landing/HeroSection.tsx` -- hero with logo + butterflies
- `src/components/landing/FincaSection.tsx` -- "La Finca" section with cards
- `src/components/landing/GaleriaSection.tsx` -- gallery tabs + grid + modal
- `src/components/landing/ReservasSection.tsx` -- reservation buttons
- `src/pages/Index.tsx` -- slim orchestrator composing the above

### 2. Navbar: Logo + "Villa Tata" name, clickable to scroll top

- Replace the standalone floating `<img>` logo with a navbar-integrated clickable `<a href="#top">` containing the logo image + "Villa Tata" text beside it.
- Add `id="top"` to the root wrapper or hero section.
- The logo still animates from center to top-left on load. After settling, clicking it or the name scrolls to top via `window.scrollTo({ top: 0, behavior: 'smooth' })`.

### 3. Typography upgrades (green-scale background awareness)

Since the background is green-toned:

- **H1** (Hero, currently removed -- will stay removed per user preference, logo only).
- **H2** ("La Finca", "Galeria", "Reserva tu experiencia"): Add a subtle text-shadow, use `text-white` with a light green underline accent or decorative line beneath, slightly larger sizing, and a serif or elegant font weight.
- **H3** (card titles): Add an icon or green accent bar on top, uppercase tracking.

### 4. Separate styles

- Create `src/styles/landing.css` for landing-specific custom CSS (animations, text-shadow utilities, decorative underlines).
- Keep Tailwind utility classes inline but move complex/reusable patterns to the CSS file.

### 5. Custom hooks extraction

- Move gallery logic (tab switching, modal navigation, keyboard/swipe handlers) into `src/hooks/useGallery.ts`.
- Move intersection observer logic into `src/hooks/useScrollReveal.ts`.

### Technical Summary

```text
src/
├── components/
│   └── landing/
│       ├── Navbar.tsx        (logo + "Villa Tata" + nav links)
│       ├── HeroSection.tsx   (logo image + butterflies bg)
│       ├── FincaSection.tsx   
│       ├── GaleriaSection.tsx (tabs + grid + lightbox modal)
│       └── ReservasSection.tsx
├── hooks/
│   ├── useGallery.ts         (tab, modal, keyboard, swipe)
│   └── useScrollReveal.ts    (intersection observer)
├── styles/
│   └── landing.css           (custom animations, text effects)
└── pages/
    └── Index.tsx             (composition only)
```

Key changes:
- Navbar logo + "Villa Tata" text both wrapped in a clickable element that scrolls to `#top`
- H2 headings get text-shadow, decorative green accent underline, slightly larger font
- H3 headings get uppercase tracking and green accent bar
- All gallery/scroll logic extracted to custom hooks
- Section components are self-contained with their own props

