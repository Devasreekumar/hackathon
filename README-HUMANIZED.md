Tribal Heritage — E‑commerce Website (Humanized README)

Overview

This is a small, friendly e‑commerce demo called "Tribal Heritage" that showcases handcrafted products, artisan profiles and exhibitions. It's built as a learning / demo project for exploring a modern frontend stack (React + Vite + Tailwind) and includes features you'll expect from a production admin and storefront: dashboards, product management, orders, authentication, theme switching (dark/light) and multilingual support (English and Hindi).

Why this project exists

- To give artisans a simple, well‑designed place to show and sell their craft.
- To demonstrate practical UI patterns: dashboards, tables, forms, charts, and dialogs using Radix UI and Tailwind.
- To be an educational playground: you can inspect the code, tweak colors, add translations or wire a real backend.

Key Features

- Role-based dashboards: `admin`, `artisan`, `customer`, `consultant` with tailored views.
- Product and order management (stored in localStorage for this demo). 
- Exhibitions list and countdown to upcoming events.
- Dark / Light theme toggle with system preference and localStorage persistence.
- Language switching (English / Hindi) using a simple `LocaleContext` and `t()` helper.
- Charts (Recharts) with theme-aware tooltips and styles.
- Accessible components with Radix UI patterns + custom UI primitives.

Tech Stack

- React 18
- Vite (dev server / build)
- Tailwind CSS (utility-first styling, dark mode via `class` strategy)
- Recharts for data visualization
- Radix UI & custom UI primitives for dialog, buttons, inputs, etc.
- Sonner for toasts

Run locally

1. Install dependencies

```powershell
cd "hi/pj"
npm install
```

2. Start dev server

```powershell
npm run dev
# then open http://localhost:3000 or the port Vite picks (e.g. http://localhost:3001)
```

3. Build for production

```powershell
npm run build
npm run preview
```

Theme & Translations

- Theme: The app uses a `ThemeContext` that writes the chosen theme to `localStorage`. An inline script in `index.html` applies `.dark` early so the page doesn't flash to the wrong theme while React loads.
- Translations: `LocaleContext` provides a `t(key)` helper. Many pages have been wired to use this context; you can add keys in `src/contexts/LocaleContext.jsx` and use `useLocale()` in components.

Project Layout (high level)

- `src/` – app source files
  - `components/` – page components (HomePage, AdminDashboard, LoginPage, RegisterPage, etc.)
  - `components/ui/` – UI primitives (Card, Button, Input, Table, etc.)
  - `contexts/` – `ThemeContext`, `LocaleContext`, `AuthContext`
  - `utils/` – helpers and sample data
  - `index.css` – Tailwind/CSS variables (including theme color vars)

Notes & Troubleshooting

- If dark mode doesn’t look fully applied, make sure the `.dark` class exists on the `<html>` element (the `ThemeContext` toggles it). The inline script in `index.html` should also set it on first load.
- Native `<select>` dropdowns may look different across platforms and sometimes need extra styling, especially for dark mode. The app includes small in‑component styles to handle dark/background color for options.
- Data in this demo is saved to `localStorage`. Clear localStorage or open a private window to reset sample data.

How to contribute / extend

- Add translations: update `src/contexts/LocaleContext.jsx` and add `t('yourKey')` to components.
- Replace localStorage with an API backend: swap `utils/api.js` with real endpoints and adapt data loading hooks.
- Improve dark mode: adjust CSS variables in `src/index.css` and add `dark:` Tailwind variants to components that need them.

Questions / Next Steps

If you'd like, I can:
- Overwrite the existing `README.md` with this humanized version (I created `README-HUMANIZED.md` so you can preview first).
- Commit the changes and open a PR for you.
- Add more detailed contributor instructions or a demo account list.

Tell me which of the above you'd like me to do next.