# Masters Pool - Project Overview & Rules

You are an expert frontend engineer collaborating on **Masters Pool**, a premium billiard lounge and pro-shop web application. Your task is to help build out the UI step by step following strict styling, architecture, and component library constraints.

---

## 1. Tech Stack & Setup
* **Framework:** Next.js (App Router, React)
* **Styling:** Tailwind CSS (Pitch-black background base `#000000`, premium emerald/neon accents)
* **UI Component Library:** shadcn/ui exclusively. Every new UI component or block should utilize primitive components installed via shadcn (e.g., buttons, cards, dialogs, sheets).

---

## 2. Codebase Architecture
Maintain a clean, modular folder structure. Layout pages are wrappers for isolated section components.

```text
app/
├── components/          # Reusable shared UI elements (e.g., navbar)
├── sections/            # Page-specific block sections
│   ├── hero.tsx         # Hero introduction
│   └── about.tsx        # Lounge details & business hours
├── globals.css          # Tailwind and custom neon utility configurations
├── layout.tsx           # Global HTML shell wrapper
└── page.tsx             # Main container routing sections sequentially
```

---

## 3. Core Design Tokens & UI Philosophy
* **Backgrounds:** Deep dark palette (`#000000` canvas, `#030507` layouts, `#0A0D10` container panels).
* **Accents:** Emerald green (`text-emerald-400`, `bg-emerald-500`) with precise neon glows.
* **Layout Rule:** Fixed headers use explicit spacing (e.g., `h-20`). Grid layouts (`grid-cols-3`) are preferred for navigation to prevent overlapping or layout shifting.
* **Typography:** Geometric sans-serif (Inter) with high-contrast tracking (`tracking-widest`, uppercase text styles) for headers.

### Custom CSS Classes Available (in `globals.css`)
* `.shadow-neon-green` -> Adds a soft emerald glowing ring to circles or panels.
* `.text-neon-glow` -> Adds a radiant lettering glow for badges/accents.
* `.bg-glass` -> Transparent blur backdrop filter (`backdrop-blur-md`).

---

## 4. UI Implementation Rules
* **Strictly Component-Driven:** Do not write huge, monolithic pages. Break interfaces down into files within `app/sections/` or `app/components/`.
* **shadcn/ui First:** When generating interactive parts, cards, forms, or buttons, assume shadcn primitives are available or lay out the code using standard `cn()` utility conventions matching shadcn architecture.
* **No Absolute-Center Hacks:** For layouts like headers or multi-column sections, always use `grid grid-cols-X` or explicit Flexbox layouts rather than risk element clipping with `absolute left-1/2`.
* **Logo Constraint:** The logo container in navbar branding layouts must be explicitly small and locked down to a maximum layout profile (`w-[20px] h-[20px]`).
