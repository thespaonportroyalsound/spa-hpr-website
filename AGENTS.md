# AGENTS.md — The Spa on Port Royal Sound, HPR (spa-hpr-site)

Static community website for "The Spa" — the official source of truth for rules, pricing, and info. Must be easily scraped by search engines and AI/voice assistants so residents and renters get accurate answers online.

## Workflow

`index.html`, `rules.html`, `documents.html`, `unit-finder.html`, `pest-control.html`, and `style.css` are the source of truth — edit them directly. No spec files, no generation step, no build tools.

To change the site: edit the HTML/CSS in place and verify by opening the relevant page in a browser.

## Hard constraints

- **Vanilla HTML + CSS only.** No framework, no build step, no package manager, no npm scripts. If you reach for a tool, stop. `unit-finder.html` loads a small vanilla JavaScript file (`unit-finder/unit-finder.js`) to drive the finder — no libraries, no build step.
- **Multi-page layout** (five pages) with a shared top navbar linking between pages.
  - `index.html` — Home: welcome intro + key rules at a glance (pet policy, parking cost, quiet hours, pool hours, prohibited vehicles, trash/walkways).
  - `rules.html` — Full rules & regulations (warnings, parking, quiet hours, pools, trash, walkways, service animals).
  - `unit-finder.html` — Interactive unit & building finder. Enter a unit number to see which of the nine buildings (A–I) it is in and where it sits within that building, paired with an overhead property map. Unit-to-building data, floor-1 unit layouts, and stairwell positions live in `unit-finder/unit-finder.js` and can be edited in place. Page-specific styles are in `unit-finder/public/css/unit-finder.css`.
  - `pest-control.html` — Orkin pest control schedule: the standing visit days (the second Wednesday and fourth Thursday of each month) and, for each month, which buildings (A–I) are covered on each of those two visits. Static table, no JavaScript.
  - `documents.html` — Governing document links + contacts for both managers.
- **Public information only.** Do not add private resident-only content.

## Audience & UX

- Older users — large readable type, clear language, no clever/hidden UI.
- Must work on phones, laptops, and tablets (responsive).
- Non-profit community association: simple and lightweight over flashy. Prefer clarity and fast load over visual richness.
- Optimize for scrapability: semantic HTML, descriptive headings, plain-text rules so search/AI/voice tools can extract answers directly.

## Design

Hunter-green palette: deep green `#1B3A28`, green `#244C34`, moss accent `#5B7A4B`, cream `#F1E9D2`, paper `#FBF7EC`. Source Serif 4 font stack (modern serif), self-hosted from `fonts/source-serif-4-latin-var.woff2` and preloaded — the site makes no third-party requests. Compact top navbar with brand + page links; small masthead on the home page and a slim page header on interior pages — no street address in the header.

## Output

- `index.html`, `rules.html`, `documents.html`, `unit-finder.html`, `pest-control.html` + `style.css` at root
- `fonts/` — `source-serif-4-latin-var.woff2` (variable weight 400–700, latin subset, ~40 KB) and its OFL license. Loaded with `@font-face` in `style.css` and preloaded in every page head.
- `images/` — overhead property map: the source `theSpa-LabeledSVG.af` (Affinity), its SVG export `theSpa-LabeledSVG.svg`, and the raster `spa-map-base.webp` (30KB, 2706×936) that the page actually loads. Both source files are excluded from the deploy by `.assetsignore`. The unit-finder page overlays a small transparent SVG on top for click targets and highlights. Also holds the masthead photo `hero-entrance-1152.webp`, `rasters/site-logo-260.webp`, `favicon-48.png`, `apple-touch-icon-180.png`, and the social-preview crop `og-entrance-1200x630.jpg`.
- `images/rasters/photos/` — the property photos actually used, each in two sizes: `-800.webp` (800×534) and `-400.webp` (400×267), served through `srcset`/`sizes`. They are cropped to the 3:2 box the pages display. The 1920px originals of all 24 carousel photos are in git history (`git log -- images/rasters/photos`); see `carousel-images.txt` for the source-URL mapping.
- `_headers` — Cloudflare Workers cache policy: one-year immutable caching for `/images/*` and `/fonts/*`. Image filenames carry their size, so replacing a photo means adding a new filename, not overwriting one.
- `.assetsignore` — keeps repo-only files (docs, `wrangler.jsonc`, map sources) off the published site, because `wrangler.jsonc` publishes the whole repo root as assets.
- Deploy to any static host — no server runtime needed
