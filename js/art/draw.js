// Procedural pixel art. Every function draws in world px with integer rects,
// and the game scales the whole context, so everything stays chunky and crisp.

import { TILE, COLORS as C, MACHINE } from '../config.js';
import { drawSprite } from './sprites.js';

export function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

// Deterministic per-tile noise so tufts and flowers stay put between frames.
export function hash(x, y) {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

export function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const f = v => Math.max(0, Math.min(255, Math.round(v + amount * 255)));
  return `rgb(${f(n >> 16)}, ${f((n >> 8) & 255)}, ${f(n & 255)})`;
}

function tilesIn(view) {
  return {
    x0: Math.floor(view.x / TILE), y0: Math.floor(view.y / TILE),
    x1: Math.ceil((view.x + view.w) / TILE), y1: Math.ceil((view.y + view.h) / TILE),
  };
}

const FLOWERS = ['#f7f3ea', '#ff9aa8', '#ffd66b'];

export function drawGrass(ctx, view) {
  const { x0, y0, x1, y1 } = tilesIn(view);
  rect(ctx, x0 * TILE, y0 * TILE, (x1 - x0) * TILE, (y1 - y0) * TILE, C.grass);
  for (let ty = y0; ty < y1; ty++) {
    for (let tx = x0; tx < x1; tx++) {
      const r = hash(tx, ty), px = tx * TILE, py = ty * TILE;
      const ox = Math.floor(r * 977) % 11, oy = Math.floor(r * 571) % 11;
      if (r < 0.4) {
        rect(ctx, px + ox, py + oy, 1, 2, C.grassDark);
        rect(ctx, px + ox + 2, py + oy + 1, 1, 2, C.grassDark);
      } else if (r > 0.96) {
        const f = FLOWERS[Math.floor(r * 1000) % 3];
        rect(ctx, px + ox, py + oy, 3, 3, f);
        rect(ctx, px + ox + 1, py + oy + 1, 1, 1, '#f2a93b');
      } else if (r > 0.88) {
        rect(ctx, px + ox, py + oy, 4, 1, C.grassLight);
      }
    }
  }
}

export function drawPath(ctx, p) {
  rect(ctx, p.x, p.y, p.w, p.h, C.sand);
  rect(ctx, p.x, p.y, p.w, 1, C.sandEdge);
  rect(ctx, p.x, p.y + p.h - 1, p.w, 1, C.sandEdge);
  for (let x = p.x + 3; x < p.x + p.w - 2; x += 7) {
    const r = hash(x, p.y);
    if (r < 0.5) rect(ctx, x, p.y + 2 + Math.floor(r * 40) % Math.max(1, p.h - 4), 2, 1, C.sandEdge);
  }
}

export function drawTree(ctx, x, y) {
  rect(ctx, x - 10, y - 2, 20, 4, C.shadow);
  rect(ctx, x - 3, y - 9, 6, 9, C.trunk);
  rect(ctx, x - 3, y - 9, 2, 9, C.trunkDark);
  rect(ctx, x - 11, y - 24, 22, 15, C.leafDark);
  rect(ctx, x - 13, y - 20, 26, 8, C.leafDark);
  rect(ctx, x - 8, y - 29, 16, 6, C.leafDark);
  rect(ctx, x - 10, y - 27, 18, 14, C.leaf);
  rect(ctx, x - 12, y - 21, 22, 6, C.leaf);
  rect(ctx, x - 7, y - 26, 6, 3, C.leafLight);
  rect(ctx, x - 10, y - 21, 3, 2, C.leafLight);
}

// h: { x, y, w, h, roofH, wallH, color, doorX, doorW } with y at the roof top.
export function drawHouse(ctx, h, t) {
  const { x, y, w, color } = h;
  const bottom = y + h.h, wallTop = bottom - h.wallH;
  const dark = shade(color, -0.18), light = shade(color, 0.14);

  rect(ctx, x + 5, bottom - 2, w, 6, C.shadow);

  // Walls with siding lines and windows boxes, skipping the door
  rect(ctx, x, wallTop, w, h.wallH, C.wall);
  for (let yy = wallTop + 4; yy < bottom - 3; yy += 4) rect(ctx, x, yy, w, 1, C.wallLine);
  rect(ctx, x, bottom - 3, w, 3, C.wallTrim);
  rect(ctx, x, wallTop, 1, h.wallH, C.outline);
  rect(ctx, x + w - 1, wallTop, 1, h.wallH, C.outline);
  for (let wx = x + 8; wx + 12 <= x + w - 6; wx += 22) {
    if (wx + 12 > h.doorX - 6 && wx < h.doorX + h.doorW + 6) continue;
    rect(ctx, wx, wallTop + 8, 12, 10, C.frame);
    rect(ctx, wx + 1, wallTop + 9, 10, 8, C.glass);
    rect(ctx, wx + 1, wallTop + 9, 4, 3, C.glassLight);
    rect(ctx, wx - 1, wallTop + 18, 14, 3, color);
  }

  // Big factory door with a roll-up shutter look
  const dy = bottom - 22;
  rect(ctx, h.doorX - 2, dy - 2, h.doorW + 4, 24, C.outline);
  rect(ctx, h.doorX, dy, h.doorW, 22, C.door);
  for (let yy = dy + 3; yy < bottom - 2; yy += 3) rect(ctx, h.doorX, yy, h.doorW, 1, C.doorDark);
  // Shop sign over the door showing the house's flagship product
  const signX = h.doorX + h.doorW / 2;
  rect(ctx, signX - 12, dy - 17, 24, 14, C.outline);
  rect(ctx, signX - 11, dy - 16, 22, 12, C.wall);
  drawSprite(ctx, h.sprite, h.tint, signX, dy - 6);
  rect(ctx, h.doorX - 3, bottom, h.doorW + 6, 3, C.wallTrim);

  // Roof with overhang and shingle rows
  const rx = x - 5, rw = w + 10;
  rect(ctx, rx, y + h.roofH - 1, rw, 3, C.outline);
  rect(ctx, rx, y, rw, h.roofH, color);
  for (let ry = y + 5; ry < y + h.roofH - 1; ry += 5) {
    rect(ctx, rx, ry, rw, 1, dark);
    for (let sx = rx + ((ry / 5) % 2) * 4; sx < rx + rw; sx += 8) rect(ctx, sx, ry - 4, 1, 4, dark);
  }
  rect(ctx, rx, y, rw, 2, light);

  // Smokestack with drifting puffs
  const cx = x + w - 18, puffs = 3;
  rect(ctx, cx - 1, y - 14, 10, 3, C.steelDark);
  rect(ctx, cx, y - 11, 8, 13, C.steel);
  rect(ctx, cx, y - 6, 8, 2, color);
  for (let i = 0; i < puffs; i++) {
    const p = (t * 0.45 + i / puffs) % 1, r = 3 + p * 5;
    ctx.fillStyle = `rgba(236, 236, 242, ${0.75 * (1 - p)})`;
    ctx.fillRect(Math.round(cx + 4 - r / 2 + Math.sin(p * 6 + i) * 2), Math.round(y - 16 - p * 24), Math.round(r), Math.round(r));
  }
}

// A fenced empty plot for companies you do not own.
export function drawLot(ctx, lot) {
  const { x, y, w, h } = lot;
  rect(ctx, x, y, w, h, '#c9a877');
  for (let px = x; px <= x + w - 2; px += 10) {
    rect(ctx, px, y - 6, 2, 8, C.trunk);
    rect(ctx, px, y + h - 6, 2, 8, C.trunk);
  }
  rect(ctx, x, y - 4, w, 2, C.trunkDark);
  rect(ctx, x, y + h - 4, w, 2, C.trunkDark);
  const sx = x + w / 2;
  rect(ctx, sx - 1, y + h / 2 - 4, 2, 12, C.trunkDark);
  rect(ctx, sx - 10, y + h / 2 - 12, 20, 9, C.trunk);
  rect(ctx, sx - 9, y + h / 2 - 11, 18, 7, C.wall);
}

export function drawPlayer(ctx, p) {
  const x = Math.round(p.x), y = Math.round(p.y);
  const step = p.moving ? (Math.floor(p.animT * 8) % 2 ? 1 : -1) : 0;
  const bob = p.moving && step > 0 ? 1 : 0;
  rect(ctx, x - 5, y - 2, 10, 3, C.shadow);
  rect(ctx, x - 4, y - 6 - (step > 0 ? 1 : 0), 3, 6, C.pants);
  rect(ctx, x + 1, y - 6 - (step < 0 ? 1 : 0), 3, 6, C.pants);
  const by = y - bob;
  rect(ctx, x - 5, by - 13, 10, 8, C.shirt);
  rect(ctx, x - 7, by - 12, 2, 5, C.shirt);
  rect(ctx, x + 5, by - 12, 2, 5, C.shirt);
  rect(ctx, x - 7, by - 7, 2, 2, C.skin);
  rect(ctx, x + 5, by - 7, 2, 2, C.skin);
  rect(ctx, x - 5, by - 21, 10, 8, C.skin);
  rect(ctx, x - 6, by - 24, 12, 4, C.hair);
  rect(ctx, x - 4, by - 25, 3, 1, C.hair);
  rect(ctx, x + 1, by - 26, 3, 2, C.hair);
  if (p.dir === 'up') rect(ctx, x - 6, by - 21, 12, 7, C.hair);
  if (p.dir === 'down') {
    rect(ctx, x - 6, by - 21, 2, 4, C.hair);
    rect(ctx, x + 4, by - 21, 2, 4, C.hair);
    rect(ctx, x - 3, by - 18, 1, 2, C.eye);
    rect(ctx, x + 2, by - 18, 1, 2, C.eye);
  }
  if (p.dir === 'left' || p.dir === 'right') {
    const back = p.dir === 'left' ? x + 2 : x - 6;
    rect(ctx, back, by - 21, 4, 6, C.hair);
    rect(ctx, p.dir === 'left' ? x - 4 : x + 3, by - 18, 1, 2, C.eye);
  }
}

// Interior shell: plank floor, wallpapered top wall with windows, dark edges.
export function drawRoom(ctx, room, view) {
  const { w, h, wallH } = room;
  rect(ctx, 0, 0, w, h, C.floor);
  for (let y = wallH; y < h; y += 8) {
    rect(ctx, 0, y, w, 1, C.floorLine);
    for (let x = (y / 8) % 2 ? 0 : 20; x < w; x += 40) rect(ctx, x, y, 1, 8, C.floorLine);
  }
  rect(ctx, 0, 0, w, wallH, C.wallpaper);
  for (let x = 6; x < w; x += 12) rect(ctx, x, 0, 4, wallH, C.wallpaperStripe);
  for (let x = 40; x + 20 < w - 30; x += 72) {
    rect(ctx, x, 8, 20, 16, C.frame);
    rect(ctx, x + 1, 9, 18, 14, C.glass);
    rect(ctx, x + 1, 9, 7, 5, C.glassLight);
  }
  rect(ctx, 0, wallH - 4, w, 4, C.doorDark);
  rect(ctx, 0, 0, 8, h, C.outline);
  rect(ctx, w - 8, 0, 8, h, C.outline);
  rect(ctx, 0, h - 8, w, 8, C.outline);
  const m = room.exit;
  rect(ctx, m.x - 4, h - 10, m.w + 8, 10, C.floor);
  rect(ctx, m.x, h - 12, m.w, 8, '#b5423a');
  rect(ctx, m.x + 2, h - 10, m.w - 4, 1, '#e07a6a');
}

// m: { x, y (floor line under the body), bw, bh, beltLen, clock, period, items, color, sprite, tint, stacked }
export function drawMachine(ctx, m) {
  const { x, y, bw, bh, beltLen } = m;
  const top = y - bh, dark = shade(m.color, -0.2);
  rect(ctx, x + 3, y - 2, bw + beltLen + 16, 5, C.shadow);

  // Belt, rollers crawling toward the crate
  const bx = x + bw - 2, by = y - 11;
  rect(ctx, bx, by - 1, beltLen, 8, C.outline);
  rect(ctx, bx, by, beltLen, 6, C.belt);
  const off = Math.floor(m.clock * MACHINE.beltSpeed) % 6;
  for (let i = 6 - off; i < beltLen; i += 6) rect(ctx, bx + i, by, 1, 6, C.beltLine);
  rect(ctx, bx + 4, by + 7, 2, 4, C.steelDark);
  rect(ctx, bx + beltLen - 6, by + 7, 2, 4, C.steelDark);

  // Crate that fills up, then quietly empties so it never overflows the cell
  const kx = bx + beltLen + 1;
  rect(ctx, kx - 1, y - 15, 16, 16, C.outline);
  rect(ctx, kx, y - 14, 14, 14, C.crate);
  rect(ctx, kx, y - 9, 14, 1, C.crateDark);
  rect(ctx, kx, y - 4, 14, 1, C.crateDark);
  if (m.stacked > 0) drawSprite(ctx, m.sprite, m.tint, kx + 7, y - 13);

  for (const it of m.items) drawSprite(ctx, m.sprite, m.tint, bx + it.x, by + 4);

  // Body
  rect(ctx, x - 1, top - 1, bw + 2, bh + 2, C.outline);
  rect(ctx, x, top, bw, 6, C.steelLight);
  rect(ctx, x, top + 6, bw, bh - 6, C.steel);
  rect(ctx, x, top + 10, bw, 3, m.color);
  for (let i = 0; i < 3; i++) {
    const on = (Math.floor(m.clock * 2) + i) % 3 === 0;
    rect(ctx, x + 4 + i * 4, top + 16, 2, 2, on ? C.lightOn : C.lightOff);
  }
  const panelW = Math.min(14, bw - 20);
  if (panelW > 4) {
    rect(ctx, x + bw - panelW - 6, top + 16, panelW, 6, C.outline);
    rect(ctx, x + bw - panelW - 5, top + 17, Math.max(1, (panelW - 2) * ((m.clock / m.period) % 1)), 4, C.lightOn);
  }
  rect(ctx, x + bw - 4, by - 1, 4, 7, C.outline);
  // Nameplate showing what this machine makes, so a sparse belt still reads
  rect(ctx, x + 3, y - 12, 16, 11, C.outline);
  rect(ctx, x + 4, y - 11, 14, 9, C.wall);
  drawSprite(ctx, m.sprite, m.tint, x + 11, y - 2);

  // Press: two columns, a crossbar, and a head that slams once per cycle
  const cycle = (m.clock / m.period) % 1;
  const drop = cycle < 0.15 ? cycle / 0.15 : cycle < 0.35 ? 1 - (cycle - 0.15) / 0.2 : 0;
  const px = x + Math.floor(bw / 2), colTop = top - 18;
  rect(ctx, px - 9, colTop, 3, 18, C.steelDark);
  rect(ctx, px + 6, colTop, 3, 18, C.steelDark);
  rect(ctx, px - 11, colTop - 4, 22, 5, dark);
  const headY = colTop + 2 + Math.round(drop * 11);
  rect(ctx, px - 2, colTop + 1, 4, headY - colTop, C.steelLight);
  rect(ctx, px - 6, headY, 12, 4, m.color);
  rect(ctx, px - 6, headY + 3, 12, 1, C.outline);
}
