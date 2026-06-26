# AGENTS.md — The Spa on Port Royal Sound, HPR (spa-hpr-site)

Static community website for "The Spa" — the official source of truth for rules, pricing, and info. Must be easily scraped by search engines and AI/voice assistants so residents and renters get accurate answers online.

## Workflow

`index.html`, `rules.html`, `documents.html`, `unit-finder.html`, and `style.css` are the source of truth — edit them directly. No spec files, no generation step, no build tools.

To change the site: edit the HTML/CSS in place and verify by opening the relevant page in a browser.

## Hard constraints

- **Vanilla HTML + CSS only.** No framework, no build step, no package manager, no npm scripts. If you reach for a tool, stop. `unit-finder.html` uses a small amount of inline vanilla JavaScript to drive the finder — no libraries, no build step.
- **Multi-page layout** (four pages) with a shared top navbar linking between pages.
  - `index.html` — Home: welcome intro + key rules at a glance (pet policy, parking cost, quiet hours, pool hours, prohibited vehicles, trash/walkways).
  - `rules.html` — Full rules & regulations (warnings, parking, quiet hours, pools, trash, walkways, service animals).
  - `unit-finder.html` — Interactive unit & building finder. Enter a unit number to see which of the nine buildings (A–I) it is in and where it sits within that building, paired with an overhead property map. Unit-to-building data, floor-1 unit layouts, and stairwell positions live in inline JS at the bottom of the file and can be edited in place.
  - `documents.html` — Governing document links + contacts for both managers.
- **Public information only.** Do not add private resident-only content.

## Audience & UX

- Older users — large readable type, clear language, no clever/hidden UI.
- Must work on phones, laptops, and tablets (responsive).
- Non-profit community association: simple and lightweight over flashy. Prefer clarity and fast load over visual richness.
- Optimize for scrapability: semantic HTML, descriptive headings, plain-text rules so search/AI/voice tools can extract answers directly.

## Design

Hunter-green palette: deep green `#1B3A28`, green `#244C34`, moss accent `#5B7A4B`, cream `#F1E9D2`, paper `#FBF7EC`. Source Serif 4 font stack (modern serif). Compact top navbar with brand + page links; small masthead on the home page and a slim page header on interior pages — no street address in the header.

## Output

- `index.html`, `rules.html`, `documents.html`, `unit-finder.html` + `style.css` at root
- `images/` directory for hero, logo, pool/beach photos (placehold if real assets unavailable)
- Deploy to any static host — no server runtime needed
