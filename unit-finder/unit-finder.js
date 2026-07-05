/* Unit Finder — vanilla JavaScript, no framework, no build step.
 *
 * Layout (top to bottom, single scroll):
 *   1. Search bar  (unit number + Find button + result/error badge)
 *   2. Property overview map  (9 clickable buildings + scenery, 1400x500 SVG)
 *   3. Building detail  (floor-by-floor grid of unit cells with stairs)
 *
 * Single flat file. Top to bottom:
 *   1. Raw data (units, layouts, building metadata, scenery SVG snippets)
 *   2. State
 *   3. Pure helpers (lookups, grid layout math)
 *   4. DOM construction (h() helper + section builders)
 *   5. Targeted update functions
 *   6. Event handlers + scroll
 *   7. mountApp() and DOMContentLoaded
 */
(function () {
  "use strict";

  /* ============================================================
   * 1. RAW DATA
   * The source of truth for what unit maps to what building.
   * Edit in place; this is the only file you need to touch when
   * units change.
   * ============================================================ */

  // 268 raw (unit-number, building-letter) pairs.
  const UNITS = [
    ["3110", "A"], ["3112", "A"], ["3114", "A"], ["3116", "A"], ["3118", "A"], ["3120", "A"], ["3122", "A"], ["3124", "A"], ["3126", "A"], ["3128", "A"], ["3130", "A"], ["3132", "A"],
    ["3210", "A"], ["3212", "A"], ["3214", "A"], ["3216", "A"], ["3218", "A"], ["3220", "A"], ["3222", "A"], ["3224", "A"], ["3226", "A"], ["3228", "A"], ["3230", "A"], ["3232", "A"],
    ["3310", "A"], ["3312", "A"], ["3314", "A"], ["3316", "A"], ["3318", "A"], ["3320", "A"], ["3322", "A"], ["3324", "A"], ["3326", "A"], ["3328", "A"], ["3330", "A"], ["3332", "A"],
    ["3101", "B"], ["3102", "B"], ["3103", "B"], ["3104", "B"], ["3105", "B"], ["3106", "B"], ["3107", "B"], ["3108", "B"],
    ["3201", "B"], ["3202", "B"], ["3203", "B"], ["3204", "B"], ["3205", "B"], ["3206", "B"], ["3207", "B"], ["3208", "B"],
    ["3301", "B"], ["3302", "B"], ["3303", "B"], ["3304", "B"], ["3305", "B"], ["3306", "B"], ["3307", "B"], ["3308", "B"],
    ["3109", "C"], ["3111", "C"], ["3113", "C"], ["3115", "C"], ["3117", "C"], ["3119", "C"], ["3121", "C"], ["3123", "C"], ["3125", "C"], ["3127", "C"], ["3129", "C"], ["3131", "C"],
    ["3209", "C"], ["3211", "C"], ["3213", "C"], ["3215", "C"], ["3217", "C"], ["3219", "C"], ["3221", "C"], ["3223", "C"], ["3225", "C"], ["3227", "C"], ["3229", "C"], ["3231", "C"],
    ["3309", "C"], ["3311", "C"], ["3313", "C"], ["3315", "C"], ["3317", "C"], ["3319", "C"], ["3321", "C"], ["3323", "C"], ["3325", "C"], ["3327", "C"], ["3329", "C"], ["3331", "C"],
    ["3133", "D"], ["3134", "D"], ["3135", "D"], ["3136", "D"], ["3137", "D"], ["3138", "D"],
    ["3233", "D"], ["3234", "D"], ["3235", "D"], ["3236", "D"], ["3237", "D"], ["3238", "D"],
    ["3333", "D"], ["3334", "D"], ["3335", "D"], ["3336", "D"], ["3337", "D"], ["3338", "D"],
    ["2102", "E"], ["2104", "E"], ["2106", "E"], ["2108", "E"], ["2110", "E"], ["2112", "E"], ["2114", "E"], ["2116", "E"], ["2118", "E"],
    ["2202", "E"], ["2204", "E"], ["2206", "E"], ["2208", "E"], ["2210", "E"], ["2212", "E"], ["2214", "E"], ["2216", "E"], ["2218", "E"],
    ["2302", "E"], ["2304", "E"], ["2306", "E"], ["2308", "E"], ["2310", "E"], ["2312", "E"], ["2314", "E"], ["2316", "E"], ["2318", "E"],
    ["2101", "F"], ["2103", "F"], ["2105", "F"], ["2107", "F"], ["2109", "F"], ["2111", "F"], ["2113", "F"], ["2115", "F"], ["2117", "F"],
    ["2201", "F"], ["2203", "F"], ["2205", "F"], ["2207", "F"], ["2209", "F"], ["2211", "F"], ["2213", "F"], ["2215", "F"], ["2217", "F"],
    ["2301", "F"], ["2303", "F"], ["2305", "F"], ["2307", "F"], ["2309", "F"], ["2311", "F"], ["2313", "F"], ["2315", "F"], ["2317", "F"],
    ["2119", "G"], ["2120", "G"], ["2219", "G"], ["2220", "G"], ["2221", "G"], ["2222", "G"], ["2319", "G"], ["2320", "G"], ["2321", "G"], ["2322", "G"],
    ["1102", "H"], ["1104", "H"], ["1106", "H"], ["1108", "H"], ["1110", "H"], ["1112", "H"], ["1114", "H"], ["1116", "H"], ["1118", "H"], ["1120", "H"], ["1122", "H"], ["1124", "H"], ["1126", "H"], ["1128", "H"], ["1130", "H"],
    ["1202", "H"], ["1204", "H"], ["1206", "H"], ["1208", "H"], ["1210", "H"], ["1212", "H"], ["1214", "H"], ["1216", "H"], ["1218", "H"], ["1220", "H"], ["1222", "H"], ["1224", "H"], ["1226", "H"], ["1228", "H"], ["1230", "H"],
    ["1302", "H"], ["1304", "H"], ["1306", "H"], ["1308", "H"], ["1310", "H"], ["1312", "H"], ["1314", "H"], ["1316", "H"], ["1318", "H"], ["1320", "H"], ["1322", "H"], ["1324", "H"], ["1326", "H"], ["1328", "H"], ["1330", "H"],
    ["1101", "I"], ["1103", "I"], ["1105", "I"], ["1107", "I"], ["1109", "I"], ["1111", "I"], ["1113", "I"], ["1115", "I"], ["1117", "I"], ["1119", "I"], ["1121", "I"], ["1123", "I"], ["1125", "I"], ["1127", "I"], ["1129", "I"],
    ["1201", "I"], ["1203", "I"], ["1205", "I"], ["1207", "I"], ["1209", "I"], ["1211", "I"], ["1213", "I"], ["1215", "I"], ["1217", "I"], ["1219", "I"], ["1221", "I"], ["1223", "I"], ["1225", "I"], ["1227", "I"], ["1229", "I"],
    ["1301", "I"], ["1303", "I"], ["1305", "I"], ["1307", "I"], ["1309", "I"], ["1311", "I"], ["1313", "I"], ["1315", "I"], ["1317", "I"], ["1319", "I"], ["1321", "I"], ["1323", "I"], ["1325", "I"], ["1327", "I"], ["1329", "I"]
  ];

  // unit -> building letter lookup.
  const UNIT_BUILDING = (() => {
    const m = {};
    for (const [u, b] of UNITS) m[u] = b;
    return m;
  })();

  // Floor-1 unit order, left to right, for each building.
  const LAYOUTS = {
    A: ["3110", "3112", "3114", "3116", "3118", "3120", "3122", "3124", "3126", "3128", "3130", "3132"],
    B: ["3107", "3105", "3103", "3101", "3102", "3104", "3106", "3108"],
    C: ["3131", "3129", "3127", "3125", "3123", "3121", "3119", "3117", "3115", "3113", "3111", "3109"],
    D: ["3134", "3136", "3138", "3137", "3135", "3133"],
    E: ["2102", "2104", "2106", "2108", "2110", "2112", "2114", "2116", "2118"],
    F: ["2117", "2115", "2113", "2111", "2109", "2107", "2105", "2103", "2101"],
    G: ["2120", "2222", "2221", "2119"],
    H: ["1102", "1104", "1106", "1108", "1110", "1112", "1114", "1116", "1118", "1120", "1122", "1124", "1126", "1128", "1130"],
    I: ["1129", "1127", "1125", "1123", "1121", "1119", "1117", "1115", "1113", "1111", "1109", "1107", "1105", "1103", "1101"]
  };

  // Floor-1 units that face the beach. Same-slot units on floors 2 and 3
  // inherit this property.
  const BEACH_FLOOR_1 = {
    H: new Set(["1102", "1104", "1106"]),
    I: new Set(["1101", "1103", "1105"])
  };

  // Number of floor-1 units to the LEFT of the center stair.  Only H and I
  // have a center stair; for the rest, this is undefined and the building
  // is treated as a simple end-stairs layout.
  const CENTER_STAIR_CONFIG = { H: 9, I: 6 };

  // Building letters in canonical order.
  const BUILDING_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

  // Full names for display.
  const FULL_NAMES = {
    A: "Building A", B: "Building B", C: "Building C", D: "Building D",
    E: "Building E", F: "Building F", G: "Building G", H: "Building H",
    I: "Building I"
  };

  /* ============================================================
   * 2. STATE
   * The single source of truth for the UI.
   * ============================================================ */

  const state = {
    unitInput: "",
    unit: null,
    building: null,
    error: null
  };

  /* ============================================================
   * 3. PURE HELPERS
   * No DOM access. No state mutation. All return values.
   * ============================================================ */

  function buildingOf(unit) {
    return UNIT_BUILDING[unit] || null;
  }

  function isBeachEnd(unit, building) {
    const bf = BEACH_FLOOR_1[building];
    if (!bf) return false;
    const f1 = unit.charAt(0) + "1" + unit.slice(2);
    return bf.has(f1);
  }

  // Given a building, compute the column-ordering metadata for the
  // floor-by-floor grid. Returns:
  //   {
  //     layout1:      [string]      the floor-1 units in left-to-right order
  //     floors:       3
  //     leftStairs:   N             number of left end units (before left stair)
  //     rightStairs:  N             number of right end units (after right stair)
  //     hasCenter:    bool          whether the building has a center stair
  //     leftCount:    N             if center, units left of center stair
  //   }
  function gridLayout(building) {
    const layout1 = LAYOUTS[building];
    const N = layout1.length;
    const bf = BEACH_FLOOR_1[building];
    let leftStairs = 0, rightStairs = 0;
    if (bf) {
      for (const u of layout1) if (bf.has(u)) leftStairs++; else break;
      for (let i = layout1.length - 1; i >= 0; i--) {
        if (bf.has(layout1[i])) rightStairs++; else break;
      }
    }
    const leftCount = CENTER_STAIR_CONFIG[building];
    const hasCenter = leftCount !== undefined && leftCount < N;
    return { layout1, floors: 3, leftStairs, rightStairs, hasCenter, leftCount: leftCount || N };
  }

  /* ============================================================
   * 4. DOM CONSTRUCTION
   * ============================================================ */

  const SVG_NS = "http://www.w3.org/2000/svg";

  // h(tag, attrs, ...children) -> HTMLElement | SVGElement
  function h(tag, attrs, ...children) {
    const isSvg = tag === "svg" || tag === "rect" || tag === "circle" ||
                  tag === "line" || tag === "text" || tag === "polygon" ||
                  tag === "g" || tag === "defs" || tag === "clipPath" ||
                  tag === "path";
    const el = isSvg
      ? document.createElementNS(SVG_NS, tag)
      : document.createElement(tag);

    if (attrs) {
      for (const k in attrs) {
        if (k === "class") {
          el.setAttribute("class", attrs[k]);
        } else if (k === "text" || k === "textContent") {
          el.textContent = attrs[k];
        } else if (k.startsWith("on") && typeof attrs[k] === "function") {
          el.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
        } else {
          el.setAttribute(k, attrs[k]);
        }
      }
    }
    for (const child of children) {
      if (child == null || child === false) continue;
      el.appendChild(typeof child === "string" || typeof child === "number"
        ? document.createTextNode(String(child))
        : child);
    }
    return el;
  }

  // Build the search bar. Returns { rootEl, inputEl, badgeEl }.
  function buildSearchBar() {
    const inputEl = h("input", {
      id: "uf-unit-input",
      class: "uf-search-input",
      type: "text",
      inputMode: "numeric",
      placeholder: "e.g. 3116",
      maxLength: 6,
      autoComplete: "off",
      "aria-label": "Unit number"
    });
    const badgeEl = h("div", {
      class: "uf-result-badge hidden",
      role: "status",
      "aria-live": "polite"
    });

    inputEl.addEventListener("input", (e) => { state.unitInput = e.target.value; });
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); searchUnit(); }
    });

    const rootEl = h("div", { class: "uf-search", role: "search" },
      h("label", { class: "uf-search-label", for: "uf-unit-input" }, "Unit Number"),
      inputEl,
      h("button", { class: "uf-search-button", type: "button",
        onClick: () => searchUnit() }, "Find Unit"),
      badgeEl
    );
    return { rootEl, inputEl, badgeEl };
  }

  // Build the property overview map. Returns { rootEl, tileEls, mapEl }.
  // The map is an inline SVG (1400x500 viewBox) with scenery and 9 building
  // <g> elements.  Scenery positions match images/map-vector.svg.
  function buildOverheadMap() {
    const tileEls = {};
    const buildingGroups = BUILDING_LETTERS.map((letter) => {
      const pos = BUILDING_POS[letter];
      const shape = pos.type === "rect"
        ? h("rect", {
            class: "building", x: pos.x, y: pos.y,
            width: pos.w, height: pos.h, rx: 4
          })
        : h("polygon", { class: "building", points: pos.points, "stroke-linejoin": "round" });
      const labelCx = pos.type === "rect" ? pos.x + pos.w / 2 : polygonCentroid(pos.points).x;
      const labelCy = pos.type === "rect" ? pos.y + pos.h / 2 : polygonCentroid(pos.points).y;
      const groupEl = h("g", {
        id: "bldg-" + letter.toLowerCase(),
        class: "bldg-group",
        role: "button",
        tabIndex: 0,
        "aria-label": FULL_NAMES[letter]
      },
        shape,
        h("text", { class: "label", x: labelCx, y: labelCy }, letter)
      );
      groupEl.dataset.building = letter;
      groupEl.addEventListener("click", () => selectBuilding(letter));
      groupEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectBuilding(letter);
        }
      });
      // Store { group, shape } so updates can toggle the highlight
      // without re-querying the DOM.
      tileEls[letter] = { group: groupEl, shape: shape };
      return groupEl;
    });

    const mapEl = h("svg", {
      class: "uf-overview-svg",
      viewBox: "0 0 1400 500",
      preserveAspectRatio: "xMidYMid meet",
      xmlns: SVG_NS,
      role: "img",
      "aria-label": "Overhead map of The Spa on Port Royal Sound, HPR. Beach on the right, parking on the left. Tap a building to view its floor plan."
    },
      // Scenery (drawn first, behind buildings) — non-beach only.
      // Amenity boxes and their labels (centered in each box).
      // Tennis Courts box: 155-365 wide, 140-360 tall. Center (260, 250).
      h("rect", { class: "tennis-courts", x: 155, y: 140, width: 210, height: 220, rx: 4 }),
      h("text", { class: "amenity-label", x: 260, y: 250 }, "Tennis Courts"),
      // Context box: 460-580 wide, 160-340 tall.
      // Indoor Pool & Fitness centered in top half (center y=205, two lines).
      h("rect", { class: "context-area", x: 460, y: 160, width: 120, height: 180 }),
      h("text", { class: "amenity-label", x: 520, y: 200 }, "Indoor Pool &"),
      h("text", { class: "amenity-label", x: 520, y: 218 }, "Fitness Center"),
      // HOA Office centered in bottom half (center y=295).
      h("text", { class: "amenity-label", x: 520, y: 295 }, "HOA Office"),
      // Family Pool circle: center (740, 250), r=45.
      h("circle", { class: "pool", cx: 740, cy: 250, r: 45 }),
      h("text", { class: "amenity-label", x: 740, y: 250 }, "Family Pool"),
      // Dumpsters along the perimeter. The dumpster SVG (82x72 viewBox) is
      // displayed at 40x35 and centered at the given coordinate via
      // x = cx - 20, y = cy - 17.
      // Three at top right, above the HOA office
      h("image", { class: "map-icon", href: "images/dumpster.drawio.svg",
        x: 450, y: 33, width: 40, height: 35, preserveAspectRatio: "xMidYMid meet" }),
      h("image", { class: "map-icon", href: "images/dumpster.drawio.svg",
        x: 520, y: 33, width: 40, height: 35, preserveAspectRatio: "xMidYMid meet" }),
      h("image", { class: "map-icon", href: "images/dumpster.drawio.svg",
        x: 590, y: 33, width: 40, height: 35, preserveAspectRatio: "xMidYMid meet" }),
      // One above building B (B is at x=400-440, y=140-360). Centered at (420, 100).
      h("image", { class: "map-icon", href: "images/dumpster.drawio.svg",
        x: 400, y: 83, width: 40, height: 35, preserveAspectRatio: "xMidYMid meet" }),
      // Far left, between buildings A (y=60-100) and D (y=180-320). Centered at (110, 130).
      h("image", { class: "map-icon", href: "images/dumpster.drawio.svg",
        x: 90, y: 113, width: 40, height: 35, preserveAspectRatio: "xMidYMid meet" }),
      // Bottom left corner of the map. Centered at (70, 470).
      h("image", { class: "map-icon", href: "images/dumpster.drawio.svg",
        x: 50, y: 453, width: 40, height: 35, preserveAspectRatio: "xMidYMid meet" }),
      // Entry / exit gate on the right edge of building C (C ends at x=380, y=440).
      // The gate SVG (161x91 viewBox) is displayed at 70x40, centered at (380, 480).
      h("image", { class: "map-icon", href: "images/main-gate.drawio.svg",
        x: 345, y: 460, width: 70, height: 40, preserveAspectRatio: "xMidYMid meet" }),
      // Buildings (drawn on top)
      ...buildingGroups
    );

    const rootEl = h("div", { class: "uf-overview-wrap" },
      mapEl,
      h("p", { class: "uf-mobile-hint uf-map-hint" }, "Swipe left/right to pan the property map.")
    );
    return { rootEl, tileEls, mapEl };
  }

  // Polygon centroid (for H and I label placement).
  function polygonCentroid(points) {
    const xs = [], ys = [];
    for (const p of points.split(/\s+/)) {
      const [x, y] = p.split(",").map(Number);
      xs.push(x); ys.push(y);
    }
    const n = xs.length;
    return { x: xs.reduce((a, b) => a + b, 0) / n, y: ys.reduce((a, b) => a + b, 0) / n };
  }

  // Building positions on the overhead map (1400x500 viewBox).
  const BUILDING_POS = {
    A: { type: "rect",   x: 180, y:  60, w: 200, h: 40 },
    B: { type: "rect",   x: 400, y: 140, w:  40, h: 220 },
    C: { type: "rect",   x: 180, y: 400, w: 200, h: 40 },
    D: { type: "rect",   x:  80, y: 180, w:  40, h: 140 },
    E: { type: "rect",   x: 660, y: 110, w: 160, h: 40 },
    F: { type: "rect",   x: 660, y: 350, w: 160, h: 40 },
    G: { type: "rect",   x: 600, y: 180, w:  40, h: 140 },
    H: { type: "polygon", points: "850,130 970,80 1120,80 1120,120 980,120 870,170" },
    I: { type: "polygon", points: "850,370 970,420 1120,420 1120,380 980,380 870,330" }
  };

  // Build the building detail section. Returns refs needed for updates.
  // The grid is CSS-driven (grid-template-columns) so we only need to
  // update the label text and the highlighted unit class.
  function buildBuildingDetail() {
    const labelEl = h("div", { class: "uf-bldg-label" });
    const gridEl = h("div", { class: "uf-building-grid" });

    const rootEl = h("div", { class: "uf-bldg-detail" },
      labelEl, gridEl
    );
    return { rootEl, labelEl, gridEl };
  }

  // Build the placeholder (shown when no building is selected).
  function buildPlaceholder() {
    return h("div", { class: "uf-detail-placeholder" },
      "Enter a unit number above to see its location within the building."
    );
  }

  /* ============================================================
   * 5. TARGETED UPDATE FUNCTIONS
   * ============================================================ */

  function updateSearchBadge(badgeEl) {
    if (state.error) {
      badgeEl.textContent = state.error;
      badgeEl.classList.remove("hidden");
      badgeEl.classList.add("error");
    } else if (state.unit && state.building) {
      badgeEl.textContent = "Unit " + state.unit + " \u2192 " + FULL_NAMES[state.building];
      badgeEl.classList.remove("hidden", "error");
    } else {
      badgeEl.classList.add("hidden");
      badgeEl.classList.remove("error");
      badgeEl.textContent = "";
    }
  }

  function updateOverheadHighlight(tileEls) {
    for (const letter of BUILDING_LETTERS) {
      const t = tileEls[letter];
      if (t && t.shape) t.shape.classList.toggle("highlighted", letter === state.building);
    }
  }

  // Build the grid columns and unit cells for a building. Returns
  // {gridTemplateColumns, cellList} where cellList is the array of
  // .uf-unit-cell elements in row-major order (3 rows x N cols).
  function buildGridCells(building, highlightUnit) {
    const gl = gridLayout(building);
    const { layout1, floors, leftStairs, rightStairs, hasCenter, leftCount } = gl;
    const N = layout1.length;

    // Build the grid-template-columns string.
    // Column order: floor label | [beach-end units] | left stair | [standard]
    //              | [center stair] | [standard] | right stair | [beach-end]
    const cols = ["1.3rem"];
    for (let i = 0; i < leftStairs; i++) cols.push("minmax(2.2rem, 1fr)");
    cols.push("3.2rem");
    for (let i = 0; i < leftCount - leftStairs; i++) cols.push("minmax(2.2rem, 1fr)");
    if (hasCenter) cols.push("3.2rem");
    for (let i = 0; i < (N - leftCount - rightStairs); i++) cols.push("minmax(2.2rem, 1fr)");
    cols.push("3.2rem");
    for (let i = 0; i < rightStairs; i++) cols.push("minmax(2.2rem, 1fr)");

    const leftStairCol = 2 + leftStairs;
    const centerStairCol = hasCenter ? 3 + leftCount : null;
    const rightStairCol = (hasCenter ? 4 : 3) + (N - rightStairs);

    // Compute each unit's column index.
    function unitCol(idx) {
      if (idx < leftStairs) return idx + 2;
      if (hasCenter) {
        if (idx < leftCount) return idx + 3;
        if (idx < N - rightStairs) return idx + 4;
        return idx + 5;
      }
      if (idx < N - rightStairs) return idx + 3;
      return idx + 4;
    }

    const cellList = [];
    for (let f = floors; f >= 1; f--) {
      const rowNum = floors - f + 1;
      // Floor label
      cellList.push(h("div", { class: "uf-floor-label", style: `grid-column: 1; grid-row: ${rowNum};` }, f));
      // Left stair (only on top floor row, since it spans all 3 rows)
      if (f === floors) {
        cellList.push(h("div", {
          class: "uf-stair-cell", style: `grid-column: ${leftStairCol};`,
          "aria-label": "Stairwell"
        }, "Stairs"));
      }
      // Unit cells
      layout1.forEach((unit1, idx) => {
        // Center stair on the top floor row
        if (hasCenter && idx === leftCount && f === floors) {
          cellList.push(h("div", {
            class: "uf-stair-cell", style: `grid-column: ${centerStairCol};`,
            "aria-label": "Stairwell"
          }, "Stairs"));
        }
        // Unit number for this floor: replace middle digit with floor.
        const unitNum = unit1.charAt(0) + f + unit1.slice(2);
        const cell = h("div", {
          class: "uf-unit-cell",
          style: `grid-column: ${unitCol(idx)}; grid-row: ${rowNum};`,
          title: isBeachEnd(unitNum, building) ? unitNum + " \u2014 beach facing" : unitNum
        }, unitNum);
        // Apply beach-stack class and set font size based on unit count.
        if (isBeachEnd(unitNum, building)) cell.classList.add("beach-stack");
        if (N > 12) cell.style.fontSize = ".62rem";
        else if (N > 9) cell.style.fontSize = ".68rem";
        if (unitNum === highlightUnit) cell.classList.add("highlighted");
        cellList.push(cell);
      });
      // Right stair on the top floor row
      if (f === floors) {
        cellList.push(h("div", {
          class: "uf-stair-cell", style: `grid-column: ${rightStairCol};`,
          "aria-label": "Stairwell"
        }, "Stairs"));
      }
    }

    return { gridTemplateColumns: cols.join(" "), cellList };
  }

  function updateBuildingDetail(refs) {
    const wantsPlaceholder = !state.building;
    const currentlyPlaceholder = refs.detailEl.classList.contains("uf-detail-placeholder");

    if (wantsPlaceholder) {
      if (!currentlyPlaceholder) {
        const placeholder = buildPlaceholder();
        refs.detailContainer.replaceChild(placeholder, refs.detailEl);
        refs.detailEl = placeholder;
      }
      return;
    }

    // We want the detail view. If it's currently a placeholder, swap it in.
    if (currentlyPlaceholder) {
      const newDetail = buildBuildingDetail();
      refs.detailContainer.replaceChild(newDetail.rootEl, refs.detailEl);
      refs.detailEl = newDetail.rootEl;
      refs.labelEl = newDetail.labelEl;
      refs.gridEl = newDetail.gridEl;
    }

    const building = state.building;
    refs.labelEl.textContent = FULL_NAMES[building];
    // Rebuild the grid contents (this happens only when the building changes).
    while (refs.gridEl.firstChild) refs.gridEl.removeChild(refs.gridEl.firstChild);
    const { gridTemplateColumns, cellList } = buildGridCells(building, state.unit);
    refs.gridEl.style.gridTemplateColumns = gridTemplateColumns;
    for (const cell of cellList) refs.gridEl.appendChild(cell);
  }

  function scrollToDetail() {
    const el = document.getElementById("uf-detail-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /* ============================================================
   * 6. ACTION FUNCTIONS
   * ============================================================ */

  let _refs = null;

  function selectBuilding(letter) {
    state.unitInput = "";
    state.unit = null;
    state.building = letter;
    state.error = null;
    if (_refs && _refs.inputEl && _refs.inputEl.value !== "") {
      _refs.inputEl.value = "";
    }
    afterStateChange();
  }

  function searchUnit() {
    const raw = (state.unitInput || "").trim();
    if (raw === "") {
      state.unit = null;
      state.building = null;
      state.error = null;
    } else {
      const b = UNIT_BUILDING[raw];
      if (b) {
        state.unit = raw;
        state.building = b;
        state.error = null;
      } else {
        state.unit = null;
        state.building = null;
        state.error = "Unit \"" + raw + "\" not found";
      }
    }
    afterStateChange();
    if (state.unit) scrollToDetail();
  }

  function afterStateChange() {
    updateSearchBadge(_refs.badgeEl);
    updateOverheadHighlight(_refs.tileEls);
    updateBuildingDetail(_refs);
  }

  /* ============================================================
   * 7. MOUNT
   * ============================================================ */

  function mountApp() {
    const appRoot = document.getElementById("app");
    if (!appRoot) return;

    const { rootEl: searchRoot, inputEl, badgeEl } = buildSearchBar();
    const { rootEl: mapRoot, tileEls } = buildOverheadMap();
    const detailContainer = h("div", { class: "uf-detail-container" });
    const initialDetail = buildPlaceholder();
    detailContainer.appendChild(initialDetail);

    appRoot.appendChild(h("div", { class: "uf-app" },
      searchRoot,
      h("section", { class: "uf-section" },
        h("h2", { class: "uf-finder-section-title" }, "Property Overview"),
        mapRoot),
      h("section", { class: "uf-section", id: "uf-detail-section" },
        h("h2", { class: "uf-finder-section-title" }, "Building Detail \u2014 Unit Location"),
        h("p", { class: "uf-mobile-hint uf-detail-hint" }, "Swipe left/right on a floor row to see all units."),
        detailContainer)
    ));

    _refs = {
      inputEl, badgeEl, tileEls,
      detailContainer,
      detailEl: initialDetail,
      labelEl: null, gridEl: null
    };
    afterStateChange();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountApp);
  } else {
    mountApp();
  }
})();
