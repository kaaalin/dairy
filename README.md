# DairyFlow Sales Intelligence Demo

Interactive white-label frontend prototype for a private-label dairy exporter.
It reproduces the structure and interaction pattern of the supplied Salesforce
screens while removing the original client brand, employees, product codes,
record identifiers, scores, and commercial data.

## Included interactions

- sortable and searchable three-lead dashboard;
- manual lead entry stored for the current browser session;
- complete drill-down for REWE Group, Majid Al Futtaim Retail, and Freshippo;
- five working lead tabs with realistic demo content;
- two expandable applications per seeded lead;
- product, incompatible-technology, competitor, decision-maker, and source modals;
- World and China product-level prospecting with expandable company results;
- responsive desktop, tablet, and mobile layouts.

Real company names and official company-page links are used to make the demo
credible. All individual contacts, scores, values, fit assessments, supplier
relationships, and opportunity details are explicitly fictional.

## Run locally

Requires Node.js 22 or later.

```bash
npm install
npx next dev
```

Then open `http://localhost:3000`.

## Deploy with GitHub and Vercel

1. Create a new GitHub repository and upload the contents of this folder.
2. In Vercel, choose **Add New → Project** and import that repository.
3. Keep the detected framework as **Next.js**.
4. Deploy. The included `vercel.json` makes Vercel use the standard Next.js build.

No environment variables, database, authentication, or external APIs are
required.

## Main files

- `app/page.tsx` — demo data, state, components, and interactions.
- `app/globals.css` — visual system and responsive layout.
- `app/layout.tsx` — page metadata and fonts.
- `vercel.json` — Vercel framework and build configuration.
