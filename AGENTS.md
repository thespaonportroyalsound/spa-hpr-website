# AGENTS.md — The Spa on Port Royal Sound, HPR (spa-hpr-site)

Static community website for "The Spa" — the official source of truth for rules, pricing, and info. Must be easily scraped by search engines and AI/voice assistants so residents and renters get accurate answers online.

## Workflow

`index.html` and `style.css` are the source of truth — edit them directly. No spec files, no generation step, no build tools.

To change the site: edit the HTML/CSS in place and verify by opening `index.html` in a browser.

## Hard constraints

- **Vanilla HTML + CSS only.** No framework, no build step, no package manager, no npm scripts. If you reach for a tool, stop.
- **Single-page layout** with sticky nav and section anchors.
- **Public information only.** Do not add private resident-only content.

## Audience & UX

- Older users — large readable type, clear language, no clever/hidden UI.
- Must work on phones, laptops, and tablets (responsive).
- Non-profit community association: simple and lightweight over flashy. Prefer clarity and fast load over visual richness.
- Optimize for scrapability: semantic HTML, descriptive headings, plain-text rules so search/AI/voice tools can extract answers directly.

## Design

Coastal palette: navy `#1B4F72`, teal `#2E86C1`, sand `#F5E6CC`. Lato font stack.

## Output

- `index.html` + `style.css` at root
- `images/` directory for hero, logo, pool/beach photos (placehold if real assets unavailable)
- Deploy to any static host — no server runtime needed
