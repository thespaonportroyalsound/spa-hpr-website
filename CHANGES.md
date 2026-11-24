# Spa on Port Royal Sound, HPR — Change Log & Current State

This file documents the current state of the site and recent changes so work can be resumed on another machine.

## Project structure

This is a static, multi-page community website. There is no build step, no framework, and no package manager.

- `index.html` — Home page with welcome intro and key rules at a glance.
- `rules.html` — Full rules & regulations.
- `documents.html` — Governing document links and manager contacts.
- `unit-finder.html` — Interactive unit/building finder with an overhead property map.
- `pest-control.html` — Orkin pest control schedule table with yearly date rollover.
- `style.css` — Shared stylesheet for all pages.
- `images/` — Overhead property map. The static base is a 30KB WebP (`spa-map-base.webp`, exported from the source SVG at 2706×936, 3× the display size). The source files are `theSpa-LabeledSVG.svg` (the export-ready SVG with white background and gray buildings) and `theSpa-LabeledSVG.af` (the Affinity source).
- `images/rasters/` — Raster assets (logos and property photos).
  - `images/rasters/photos/` — 23 real property photos pulled from the previous Wix site's photo carousel, converted to WebP (1920px wide, quality 80). See `carousel-images.txt` for the source-URL to filename mapping with descriptions.
- `AGENTS.md` — Instructions for anyone editing the site.
- `CHANGES.md` — This file.

## Recent changes

### Pest control schedule moved to its own page

- The Pest Control Schedule section moved from the home page to `pest-control.html`, linked as **Pest Control** in the top navbar of every page.
- The new page keeps the month-by-month schedule table (with its automatic year rollover script); the visit day numbers in the date columns are bolded.
- The home page no longer contains the schedule table or its inline script.
- `style.css` gained a `.visually-hidden` utility, used for the schedule table caption.
- Added a pointer to the schedule page in the Documents page's "Community Information & Notices" section.

### Content and link updates

- **Documents & Contact:** all PDF links re-checked against imchhi.com/spa. Only the Community Layout Map had moved — it now points to `a7227c_c512661056f8494283359d2a2e7157b7.pdf`.
- **Home page Internet & TV Service:** now reads "Internet and Cable TV is included with The Spa's association dues," links to Spectrum's home page, and shows a bold **Bulk Account Number:** label with the account number in plain text.
- **Rules page parking table:** the hang tag row is renamed **Contractor Annual Hang Tag** and moved to the bottom of the table.
- **Rules page pools section:** photo caption shortened from "Fish Haul Creek Beach" to "Fish Haul Creek".

### Property photos

- Pulled 23 real property photos from the previous Wix site (`https://www.imchhi.com/spa` photo carousel) and saved them under `images/rasters/photos/` as WebP files (1920px wide, quality 80).
- **Home page masthead:** the SVG `images/hero.svg` is no longer used as the masthead background. The entrance-sign photo (`images/rasters/photos/entrance-sign-flowers.webp`) is now the masthead background, behind the same dark-green gradient overlay. The `og:image` meta tag now points to this photo so social previews show the entrance sign.
- **Home page "The Community" section:** added a 6-tile responsive photo gallery between "Key Rules at a Glance" and the footer, with short captions (Outdoor pool & hot tub, Natural beach on Port Royal Sound, Koi pond & gardens, Condo & villa buildings, Picnic & grilling areas, Entrance, 239 Beach City Road). 3 columns on desktop, 2 on phone.
- **Rules page Pools section:** the two SVG illustrations (`images/pool.svg`, `images/beach.svg`) have been replaced with real photos of the outdoor pool, the natural beach, and the indoor pool. The amenity grid is now 3 columns on desktop, 1 on phone, matching the `repeat(auto-fit, minmax(...))` family used elsewhere.
- See `carousel-images.txt` for the full source-URL to filename mapping with brief descriptions of each photo.

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

### Overhead map moved to a raster image + overlay

The Unit Finder's overhead property map was rewritten to use a high-resolution raster base instead of an inlined SVG. This is much friendlier for downstream tooling (LLMs, image editors, future exports) and the JS file dropped from ~100KB to ~24KB.

- **Source of truth:** `images/theSpa-LabeledSVG.af` (Affinity Designer). Edit the map there and re-export.
- **Vector export:** `images/theSpa-LabeledSVG.svg` — the Affinity export with a white background and light-gray building fills so it stands on its own. Each building has `id="Building-A"` through `id="Building-I"` for tooling.
- **Raster base:** `images/spa-map-base.webp` — 30KB, 2706×936 (3× the display size) so it stays sharp on retina screens. Exported from the SVG via headless Chrome.
- **Interactive overlay:** `unit-finder.js` builds a small inline `<svg class="uf-map-overlay" viewBox="0 0 2706 936">` with one shape per building (7 `<rect>` for A–G, 2 `<polygon>` for the H and I parallelograms). The shapes use the same transform matrices as the source SVG so they sit exactly on top of the buildings in the image. Default fill is transparent; the highlighted building gets a gold fill (`rgba(232,179,57,0.45)`) and a dark-gold border.
- **Layout:** `.uf-map-stage` uses `aspect-ratio: 2706/936` to lock the overlay to the image, so the hit areas stay aligned at any display width.
- **Removed:** `images/map-vector.svg`, `images/hero.svg`, `images/pool.svg`, `images/beach.svg`, `images/dumpster.drawio.svg`, `images/main-gate.drawio.svg` — all no longer referenced by any HTML or JS file.

### Unit Finder stairwell and beach-facing unit updates

- **Building detail stairwell representation:** Replaced the per-floor `STR` boxes with single tall brown rectangles labeled **"Stairs"** that span all three floors.
- **Endcap stairwells for all buildings:** Every building A–I now shows an identical tall "Stairs" rectangle at each end of the unit grid.
- **H & I center and beach-side stairwells:** Buildings H and I retain their central stairwell and additionally move the stairwell on the beach-facing side so it sits between the beach-facing units and the standard units.
- **Legend and tooltip update:** Changed "Beach-side entry" to **"Beach Facing Units"** in the legend and unit tooltips.
- **Overhead map cleanup:** Removed earlier experimental stairwell markers from the SVG property overview map.

## Notes for resuming work

- Edit HTML and CSS directly. Verify changes by opening the relevant page in a browser.
- `unit-finder.html` contains inline JavaScript at the bottom with the unit-to-building mappings, floor-1 layouts, and stairwell positions.
- The overhead map is a WebP (`images/spa-map-base.webp`) with a transparent SVG overlay for click handlers and highlights. To change the map itself, edit `images/theSpa-LabeledSVG.af` in Affinity, re-export to `images/theSpa-LabeledSVG.svg`, and re-render the WebP (e.g. with headless Chrome at 2706×936). The overlay shape data in `unit-finder.js` (`BLDG_SHAPES`) only needs to change if you reposition a building.
- The site is ready to deploy to any static host.
