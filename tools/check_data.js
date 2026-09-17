// Sanity check the company data: sprite keys exist, fields look sane, no gaps.
// Run from the repo root: node tools/check_data.js
import { readFileSync } from 'node:fs';
import { COMPANIES, INDEX_MARKET_CAP } from '../js/data/companies.js';
import { SP500 } from '../js/data/sp500.js';

const sprites = new Set([...readFileSync('js/art/sprites.js', 'utf8').matchAll(/^  (\w+): \[/gm)].map(m => m[1]));
const listed = new Set(SP500.map(c => c[0]));
let machines = 0, problems = 0;
const flag = (...m) => { problems++; console.log(' ', ...m); };

for (const c of COMPANIES) {
  if (!c.lines.length) flag(c.ticker, 'has no lines');
  for (const l of c.lines) {
    machines++;
    if (!sprites.has(l.sprite)) flag(c.ticker, 'unknown sprite', l.sprite);
    if (!(l.perYear > 0)) flag(c.ticker, 'bad perYear', l.name);
    if (typeof l.profitPerUnit !== 'number') flag(c.ticker, 'bad profit', l.name);
    if (l.name.length > 30) flag(c.ticker, 'label too long for its cell:', l.name);
  }
}
const covered = new Set(COMPANIES.map(c => c.ticker));
for (const t of covered) if (!listed.has(t)) flag(t, 'has lines but is not in the index list');
console.log(`${COMPANIES.length}/${SP500.length} companies, ${machines} machines, index $${(INDEX_MARKET_CAP / 1e12).toFixed(1)}T, ${problems} problems`);
