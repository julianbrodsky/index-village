// One house interior: a machine per product line, laid out in a grid.

import { MACHINE, COLORS as C } from '../config.js';
import { drawRoom, drawMachine } from '../art/draw.js';
import { fmtUnits, fmtProfit, fmtPct, fmtMoney } from '../econ.js';

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const WALL_H = 40, SIDE = 24;

function makeMachine(entry, company, cx, cy) {
  const { line, units, profit } = entry;
  // log10 so a billion cigarettes looms over a single RV without leaving the cell
  const s = Math.log10(units + 1);
  const bw = Math.round(clamp(MACHINE.minBody + s * 3, MACHINE.minBody, MACHINE.maxBody));
  const bh = Math.round(clamp(20 + s * 2, 20, 40));
  const m = {
    x: cx + 8, y: cy + MACHINE.cellH - 18, bw, bh,
    beltLen: MACHINE.cellW - bw - 36,
    period: clamp(MACHINE.maxPeriod - s * 0.25, MACHINE.minPeriod, MACHINE.maxPeriod),
    clock: Math.random() * 3, stamped: -1, items: [], stacked: 0,
    color: company.color, sprite: line.sprite, tint: line.tint,
  };

  const lines = [{ text: line.name, color: C.text }];
  if (line.via) lines.push({ text: `via ${+(line.via.stake * 100).toFixed(2)}% of ${line.via.name}`, color: C.textDim });
  lines.push({ text: fmtUnits(line, units), color: C.units });
  lines.push({ text: fmtProfit(profit), color: profit < 0 ? C.loss : C.profit });

  return {
    sortY: m.y,
    draw: ctx => drawMachine(ctx, m),
    labels: [{ x: cx + MACHINE.cellW / 2, y: m.y - bh - 26, lines }],
    solid: { x: m.x, y: m.y - 8, w: bw + m.beltLen + 16, h: 8 },
    update(dt) {
      m.clock += dt;
      // An item leaves the body each time the press head bottoms out (15% into the cycle)
      const stamp = Math.floor(m.clock / m.period - 0.15);
      if (stamp > m.stamped) {
        if (units > 0 && m.stamped >= 0) m.items.push({ x: 2 });
        m.stamped = stamp;
      }
      for (const it of m.items) it.x += MACHINE.beltSpeed * dt;
      while (m.items.length && m.items[0].x > m.beltLen + 4) {
        m.items.shift();
        m.stacked++;
      }
    },
  };
}

export function buildFactory(summary) {
  const { company } = summary;
  const n = company.lines.length;
  const cols = Math.min(n, Math.ceil(Math.sqrt(n * 1.6)));
  const rows = Math.ceil(n / cols);
  const w = cols * MACHINE.cellW + SIDE * 2;
  const h = WALL_H + 24 + rows * MACHINE.cellH + 40;
  const exit = { x: w / 2 - 12, w: 24 };

  const machines = summary.lines.map((entry, i) => makeMachine(
    entry, company,
    SIDE + (i % cols) * MACHINE.cellW,
    WALL_H + 24 + Math.floor(i / cols) * MACHINE.cellH,
  ));

  const sign = {
    sortY: -1,
    labels: [
      { x: w / 2, y: WALL_H - 6, lines: [
        { text: `${company.name} works`, color: C.text },
        { text: `${fmtMoney(summary.invested)} of your fund, ${fmtPct(summary.fraction)} of the company`, color: C.textDim },
        { text: fmtProfit(summary.profit), color: summary.profit < 0 ? C.loss : C.profit },
      ] },
      { x: w / 2, y: h - 14, lines: [{ text: 'exit', color: C.textDim }] },
    ],
  };

  const room = { w, h, wallH: WALL_H, exit };
  const exitTrigger = { x: exit.x, y: h - 12, w: exit.w, h: 4, to: null };
  return {
    id: `factory:${company.ticker}`, title: `${company.name} works`, w, h,
    props: [sign, ...machines],
    solids: [
      { x: 0, y: 0, w, h: WALL_H }, { x: 0, y: 0, w: 8, h },
      { x: w - 8, y: 0, w: 8, h }, { x: 0, y: h - 8, w, h: 8 },
      ...machines.map(m => m.solid),
    ],
    exitTrigger, triggers: [exitTrigger],
    spawn: { x: w / 2, y: h - 30 },
    ground: (ctx, view) => drawRoom(ctx, room, view),
  };
}
