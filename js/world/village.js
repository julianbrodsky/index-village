// The outdoor scene: one house per company in a grid, paths, a ring of trees.

import { TILE as T, HOUSE, COLORS as C } from '../config.js';
import { drawGrass, drawPath, drawTree, drawHouse, drawLot } from '../art/draw.js';
import { fmtMoney, fmtProfit } from '../econ.js';

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// House size grows with log10 of attributable profit, so $10 and $10M both read.
function measure(summary) {
  if (summary.invested <= 0) return { summary, lot: true, w: 6 * T, h: 4 * T };
  const s = Math.log10(Math.max(0, summary.profit) + 1);
  const wT = clamp(Math.round(HOUSE.minW + s * HOUSE.tilesPerDecade), HOUSE.minW, HOUSE.maxW);
  const wallH = (s >= 6 ? 4 : 3) * T;
  const roofH = clamp(Math.round(wT * 0.3), 2, 5) * T;
  return { summary, lot: false, w: wT * T, wallH, roofH, h: wallH + roofH };
}

export function buildVillage(summaries) {
  const sorted = [...summaries].sort((a, b) => (b.invested > 0) - (a.invested > 0) || b.profit - a.profit);
  const plots = sorted.map(measure);
  // Roughly square once the village outgrows HOUSE.cols, so no house is a marathon away
  const cols = Math.min(Math.max(HOUSE.cols, Math.ceil(Math.sqrt(plots.length))), plots.length);
  const rows = Math.ceil(plots.length / cols);
  const colW = Math.max(...plots.map(p => p.w)) + HOUSE.gapTiles * T;
  const rowH = Math.max(...plots.map(p => p.h)) + 6 * T; // headroom for smoke and labels
  const margin = 3 * T;
  const w = margin * 2 + cols * colW, h = margin * 2 + rows * rowH;

  const paths = [], props = [], triggers = [], houses = [];
  const solids = [
    { x: 0, y: 0, w, h: 2 * T }, { x: 0, y: h - T, w, h: T },
    { x: 0, y: 0, w: 1.5 * T, h }, { x: w - 1.5 * T, y: 0, w: 1.5 * T, h },
  ];

  for (let r = 0; r < rows; r++) {
    const pathY = margin + (r + 1) * rowH - 2 * T;
    paths.push({ x: margin, y: pathY, w: w - margin * 2, h: T + 4 });
    if (r > 0) for (let c = 1; c < cols; c++) {
      paths.push({ x: margin + c * colW - 10, y: pathY - rowH, w: 20, h: rowH });
    }
  }

  plots.forEach((p, i) => {
    const c = i % cols, r = Math.floor(i / cols);
    const cellX = margin + c * colW, bottom = margin + (r + 1) * rowH - 3 * T;
    const x = Math.round(cellX + (colW - p.w) / 2), y = bottom - p.h;
    const { company } = p.summary;
    const title = { text: `${company.name} (${company.ticker})`, color: C.text };

    if (p.lot) {
      const lot = { x, y, w: p.w, h: p.h };
      props.push({
        sortY: y, draw: ctx => drawLot(ctx, lot), bounds: { x, y: y - 40, w: p.w, h: p.h + 40 },
        labels: [{ x: x + p.w / 2, y: y - 8, lines: [title, { text: 'Not owned yet', color: C.textDim }] }],
      });
      return;
    }

    const house = { x, y, w: p.w, h: p.h, wallH: p.wallH, roofH: p.roofH, color: company.color, doorW: 22,
      sprite: company.lines[0].sprite, tint: company.lines[0].tint ?? company.color };
    house.doorX = Math.round(x + p.w / 2 - house.doorW / 2);
    paths.push({ x: house.doorX - 3, y: bottom, w: house.doorW + 6, h: T });
    props.push({
      sortY: bottom, draw: (ctx, t) => drawHouse(ctx, house, t),
      bounds: { x: x - 6, y: y - 50, w: p.w + 12, h: p.h + 60 },
      labels: [{ x: x + p.w / 2, y: y - 4, lines: [
        title,
        { text: `${fmtMoney(p.summary.invested)} of your fund`, color: C.textDim },
        { text: fmtProfit(p.summary.profit), color: p.summary.profit < 0 ? C.loss : C.profit },
      ] }],
    });
    solids.push({ x, y: bottom - p.wallH, w: p.w, h: p.wallH });
    // Wider than the door so walking up roughly in front still gets you in
    const trigger = { x: house.doorX - 8, y: bottom - 2, w: house.doorW + 16, h: 6, to: null };
    triggers.push(trigger);
    houses.push({ summary: p.summary, trigger, doorSpawn: { x: house.doorX + house.doorW / 2, y: bottom + 14 } });
  });

  // Tree ring around the edge. Only trunks are solid, so canopies can overlap you.
  const trees = [];
  for (let x = T; x < w; x += 26) trees.push([x, 2 * T], [x + 13, h - 4]);
  for (let y = 3 * T; y < h - T; y += 26) trees.push([T, y], [w - T, y]);
  for (const [tx, ty] of trees) {
    props.push({ sortY: ty, draw: ctx => drawTree(ctx, tx, ty), bounds: { x: tx - 14, y: ty - 30, w: 28, h: 34 } });
    solids.push({ x: tx - 4, y: ty - 5, w: 8, h: 5 });
  }

  return {
    id: 'village', title: 'The village', w, h, houses, props, solids, triggers,
    spawn: houses[0]?.doorSpawn ?? { x: w / 2, y: margin + rowH - 2 * T + 12 },
    ground(ctx, view) {
      drawGrass(ctx, view);
      for (const p of paths) {
        if (p.x < view.x + view.w && p.x + p.w > view.x && p.y < view.y + view.h && p.y + p.h > view.y) drawPath(ctx, p);
      }
    },
  };
}
