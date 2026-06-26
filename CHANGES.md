# Spa on Port Royal Sound, HPR — Change Log & Current State

This file documents the current state of the site and recent changes so work can be resumed on another machine.

## Project structure

This is a static, multi-page community website. There is no build step, no framework, and no package manager.

- `index.html` — Home page with welcome intro and key rules at a glance.
- `rules.html` — Full rules & regulations.
- `documents.html` — Governing document links and manager contacts.
- `unit-finder.html` — Interactive unit/building finder with an overhead property map.
- `style.css` — Shared stylesheet for all pages.
- `images/` — SVG images (`hero.svg`, `map-vector.svg`, `pool.svg`, `beach.svg`).
- `AGENTS.md` — Instructions for anyone editing the site.
- `CHANGES.md` — This file.

## Recent changes

### Multi-page site build

- Converted from a single-page layout to a four-page layout.
- Adopted the hunter-green palette: deep green `#1B3A28`, green `#244C34`, moss `#5B7A4B`, cream `#F1E9D2`, paper `#FBF7EC`.
- Added `rules.html`, `documents.html`, and `unit-finder.html`.
- Updated `index.html`, `style.css`, `AGENTS.md`, and `images/hero.svg`.

### Unit Finder improvements

- **Map loading fix:** The overhead map was originally loaded with `fetch('images/map-vector.svg')`. That fails when the page is opened from a `file://` URL, so the SVG content is now inlined directly in `unit-finder.html` and `init()` simply queries the existing SVG element.
- **Amenities added to the overhead map:** tennis courts, HOA office / Indoor Pool & Fitness Center label, Family Pool, Beach Pool, beach, ocean, and a brown pier with a rounded look-out deck.
- **Pool/court redesign:** Pools are now black-outlined, semi-transparent blue circles. Tennis courts are a single large black-outlined, semi-transparent green rectangle labeled “Tennis Courts”.
- **Mobile optimization:** The Unit Finder page is now designed for phone-first use. The search box stacks vertically with full-width touch targets, the wide property map scrolls horizontally at a readable size, and the building-detail floor rows scroll horizontally with larger unit cells. Mobile-only hints guide users to swipe.

### Unit Finder stairwell and beach-facing unit updates

- **Building detail stairwell representation:** Replaced the per-floor `STR` boxes with single tall brown rectangles labeled **"Stairs"** that span all three floors.
- **Endcap stairwells for all buildings:** Every building A–I now shows an identical tall "Stairs" rectangle at each end of the unit grid.
- **H & I center and beach-side stairwells:** Buildings H and I retain their central stairwell and additionally move the stairwell on the beach-facing side so it sits between the beach-facing units and the standard units.
- **Legend and tooltip update:** Changed "Beach-side entry" to **"Beach Facing Units"** in the legend and unit tooltips.
- **Overhead map cleanup:** Removed earlier experimental stairwell markers from the SVG property overview map.

## Notes for resuming work

- Edit HTML and CSS directly. Verify changes by opening the relevant page in a browser.
- `unit-finder.html` contains inline JavaScript at the bottom with the unit-to-building mappings, floor-1 layouts, and stairwell positions.
- `images/map-vector.svg` and the inline SVG inside `unit-finder.html` should be kept in sync. The external SVG file is kept as a standalone asset; the inlined copy is what the page actually renders.
- The site is ready to deploy to any static host.
