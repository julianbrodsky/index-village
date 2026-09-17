# Index Village

A top down pixel village for an S&P 500 index fund. You enter the dollars you
hold, the ten largest companies each get a house, and inside each house
machines stamp out the slice of that company's real products your dollars
account for. Forked from share-village, which asks for per-stock share counts.
Ownership is dollars / INDEX_MARKET_CAP for every company. Plain static files, no build, no deps.

Run locally (ES modules need http, not file://):

    python3 -m http.server 8321

Bump the port if the browser pane serves stale modules.

## Map of the code

| File | Owns |
| --- | --- |
| `js/config.js` | Every tunable number and colour. Change feel here first. |
| `js/data/companies.js` | Index total cap, the top 10, market caps, product lines. |
| `js/data/berkshire.js` | Berkshire's lines (subsidiaries plus look-through stakes). |
| `js/econ.js` | Pure math and formatting: ownership, attributable units, profit. No DOM. |
| `js/gate.js` | Password screen. A speed bump only, the hash ships to the browser. |
| `js/setup.js` | The fund dollars screen, and localStorage for the amount. |
| `js/input.js` | WASD / arrows / pointer into one direction vector. |
| `js/art/sprites.js` | Product icons as character grids plus a palette. |
| `js/art/draw.js` | Procedural pixel art: grass, paths, trees, houses, machines, player. |
| `js/world/village.js` | Builds the outdoor scene from the summaries. |
| `js/world/factory.js` | Builds one house interior with a machine per product line. |
| `js/world/world.js` | Wires village doors to factory scenes and back. |
| `js/game.js` | Loop, camera, collision, triggers, fade, labels, HUD text. |
| `js/main.js` | Boot: setup screen, then build the world and run the game. |

## The scene contract

Every scene builder returns the same shape, and `game.js` knows nothing else:

    { id, title, w, h, spawn: {x, y},
      ground(ctx, view),          // draws floor under everything
      props: [{ sortY, draw?(ctx, t), update?(dt), labels? }],
      solids: [{x, y, w, h}],     // collision, world px
      triggers: [{x, y, w, h, to: {scene, spawn}}] }

`labels` is `[{x, y, lines: [{text, color}]}]`, anchored bottom centre in world px. They are
drawn in screen space after the world so text stays crisp at any zoom.

Positions are world pixels, `TILE` (16) per tile. A prop's `sortY` is the y of
its feet; props and the player are drawn in `sortY` order, which is what lets
you walk behind a roof.

## Common changes

- **Add a company:** append to `COMPANIES` in `js/data/companies.js`. The setup
  form, village, and factory all derive from that list.
- **Add a product line:** add an entry to that company's `lines`. If it needs a
  new icon, add a grid to `SPRITES` in `js/art/sprites.js`. `X` pixels take the
  line's `tint`.
- **Resize buildings:** `HOUSE` and `MACHINE` in `js/config.js`. Sizes grow with
  log10 of attributable profit (houses) and units (machines).

## Rules

- No em dashes or en dashes anywhere.
- Figures are deliberately rough. Order of magnitude is the goal.
