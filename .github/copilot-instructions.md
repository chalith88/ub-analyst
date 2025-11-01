# Copilot Instructions for Bank Scraper Project

A dual-workspace TypeScript project that scrapes Sri Lankan bank interest rates and fees using Playwright/PDF parsing, with a React client for visualization. **Not** a monorepo—two independent package.json roots with different module systems.

## Copilot instructions — UB Scraper (concise)

This repo contains two separate TypeScript workspaces:
- Root: backend scraper API (CommonJS, `type: "commonjs"`). Entry: `src/server.ts`.
- `client/`: React + Vite UI (ES modules). Entry: `client/src/App.tsx`.

Keep edits short and specific. Follow these project conventions and examples.

Quick commands
- Start backend (dev): `npm run dev` (runs `ts-node -T src/server.ts`).
- Install Playwright browser: `npm run playwright-install`.
- Run tariff normalization harness: `npm run test:tariff`.
- Frontend: `cd client && npm run dev` (Vite on :5173). Unit tests via `npm test` (Vitest).

Key patterns to follow
- Scrapers live in `src/scrapers/`. Each bank commonly exposes two files: `<bank>.ts` (rates) and `<bank>-tariff.ts` (fees).
- Scraper function signature: async function scrape{Bank}(opts?: { show?: boolean; slow?: number })
  - Example route: `GET /scrape/hnb?show=true&slow=200&save=true` returns JSON and can persist to `output/*.json` when `save=true`.
- PDF/OCR flows: sampath/peoples use `pdfjs-dist` + OCR; intermediate lines are dumped to `output/*-tariff-ocr-lines.txt`.

Data & merging rules
- Tariff aggregation: `/scrape/tariffs-all` runs each `*-tariff` endpoint sequentially and merges rows by (bank, product, feeType); see `src/server.ts` for merge behavior.
- Rate shape: backend uses flexible `RateRow` fields; frontend expects stricter `client/src/types.ts` product keys (e.g., `HL`, `PL`, `LAP`, `EDU`).
- Tenure handling: scrapers provide both `tenureLabel` (raw) and `tenureYears` (normalized). Follow `src/utils/text.ts` helpers like `normalizeAwpr` and `expandTenureYears`.

Common pitfalls (do not change these assumptions)
- Do not change module types: root is CommonJS; client is ESM. Mixing breaks runtime.
- Backend dev uses `ts-node -T` (bypasses typecheck). Use it for scripts and quick iterations.
- Playwright scrapers may need increased timeouts; routes/documentation in `src/server.ts` indicate recommended `slow` and `timeout` patterns.

Where to look first (high-signal files)
- `src/server.ts` — routes, query params, aggregator logic (single best place to learn runtime behavior).
- `src/scrapers/*` — scraper implementations and export signatures.
- `src/utils/text.ts` — normalization helpers used across scrapers.
- `client/src/tariff-calculator.ts` and `client/src/TARIFF_README.md` — tariff calculation patterns and bank-specific fee routers.

If you change scraper output shape
- Update the corresponding client `types` and run `client` tests. For tariff changes, run `npm run test:tariff` and check `client` tests.

Production deployment
- Backend: Render (Express API). Config: `render.yaml`, scripts: `npm run build && npm start`.
- Frontend: Netlify (React PWA). Config: `netlify.toml`, redirects API calls to Render.
- PWA features: service worker, manifest.json, offline caching via `/service-worker.js`.
- CORS: update `src/server.ts` with production domains. Build: `client/` has separate build process.

When in doubt, run the server and call `/` for a list of example scrape URLs and query params.

Questions or missing reasoning? Ask for the intended change context (why the change, which bank/files) and I will update examples and tests to match.
