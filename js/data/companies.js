// Joins the generated index list (js/data/sp500.js) with hand written product
// lines (js/data/lines/batch-*.js). Only companies with lines get a house, so
// batches can land one at a time. The index total always covers all 500, since
// that is what a real fund holds.
//
// A batch file default-exports { TICKER: entry }. An entry is either an array
// of lines, or { name?, color?, lines } to override the listed name or the
// sector colour.
//
// A line is either compact, [name, unit, perYear, profitPerUnit, sprite, tint?, plural?],
// or an object with those same fields spelled out, plus optional via:
//   name           machine label
//   unit, units    singular, and plural when it is not just unit + 's'
//   perYear        units the whole company makes in a year
//   profitPerUnit  rough USD operating profit per unit, can be negative
//   sprite, tint   icon key in js/art/sprites.js, tint recolours its X pixels
//                  (defaults to the company colour)
//   via            look-through stake: { name, stake }, the fraction the parent owns
//
// Figures are ballpark numbers rounded hard. Order of magnitude is the goal.

import { SP500 } from './sp500.js';
import { SECTOR_COLORS } from '../config.js';
import batch01 from './lines/batch-01.js';
import batch02 from './lines/batch-02.js';
import batch03 from './lines/batch-03.js';
import batch04 from './lines/batch-04.js';
import batch05 from './lines/batch-05.js';
import batch06 from './lines/batch-06.js';
import batch07 from './lines/batch-07.js';

const LINES = { ...batch01, ...batch02, ...batch03, ...batch04, ...batch05, ...batch06, ...batch07 };

export const INDEX_MARKET_CAP = SP500.reduce((sum, c) => sum + c[3], 0);

const toLine = l => Array.isArray(l)
  ? { name: l[0], unit: l[1], perYear: l[2], profitPerUnit: l[3], sprite: l[4], tint: l[5] || undefined, units: l[6] }
  : l;

// Houses in a sector share a hue, nudged per ticker so neighbours are not identical.
function colorFor(ticker, sector) {
  const base = parseInt((SECTOR_COLORS[sector] || '#8e98a8').slice(1), 16);
  let h = 0;
  for (const ch of ticker) h = (h * 31 + ch.charCodeAt(0)) | 0;
  const nudge = ((h >>> 0) % 41) - 20;
  const c = v => Math.max(0, Math.min(255, v + nudge)).toString(16).padStart(2, '0');
  return `#${c(base >> 16)}${c((base >> 8) & 255)}${c(base & 255)}`;
}

export const COMPANIES = SP500.filter(([t]) => LINES[t]).map(([ticker, listed, sector, marketCap]) => {
  const entry = Array.isArray(LINES[ticker]) ? { lines: LINES[ticker] } : LINES[ticker];
  return {
    ticker, sector, marketCap,
    name: entry.name ?? listed,
    color: entry.color ?? colorFor(ticker, sector),
    lines: entry.lines.map(toLine),
  };
});
