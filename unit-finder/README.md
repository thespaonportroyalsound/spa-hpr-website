# Unit Finder

The interactive unit and building finder for The Spa on Port Royal Sound, HPR.

## Stack

- **Vanilla JavaScript** (ES6, no framework, no build step)
- **No dependencies** — no `node_modules`, no `package.json`, no `npm install`
- Loads as a single `<script src="unit-finder/unit-finder.js">` tag in `unit-finder.html`

## Files

```
unit-finder/
├── unit-finder.js                  the app (single flat file)
├── public/css/
│   └── unit-finder.css             page-specific styles
└── README.md                       this file
```

The `unit-finder.js` file is structured top-to-bottom:
1. Raw data (units, layouts, building metadata, positions)
2. State
3. Pure helpers (lookups, position math, caption)
4. DOM construction (`h()` helper + section builders)
5. Targeted update functions
6. Action functions
7. Mount

## Editing

To change a unit → building mapping, edit the `UNITS` constant at the top of `unit-finder.js`. To change a building's position on the overhead map, edit the `BUILDING_POSITIONS` constant. To change the look (colors, spacing, font sizes), edit `public/css/unit-finder.css`. That's it.

No build step. Just edit and refresh the browser.

## Deployment

Static files. Deploy `unit-finder.html` and the `unit-finder/` directory to any static host.
