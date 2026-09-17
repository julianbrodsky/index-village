// The loop: input, collision, door triggers, fades, camera, and drawing.
// Knows scenes only through the contract documented in CLAUDE.md.

import { TILE, VIEW_TILES, PLAYER_SPEED, RUN_MULTIPLIER, FADE_SECONDS, LABEL_FONT_PX, COLORS as C } from './config.js';
import { drawPlayer } from './art/draw.js';
import { readInput, isRunning, setPlayerScreen, clearInput } from './input.js';

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const overlaps = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

export function createGame(canvas, hud) {
  const ctx = canvas.getContext('2d');
  const player = { x: 0, y: 0, dir: 'down', moving: false, animT: 0 };
  let world = null, scene = null, fade = null, paused = true;
  let dpr = 1, zoom = 3, time = 0, last = performance.now();

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = Math.round(innerWidth * dpr);
    canvas.height = Math.round(innerHeight * dpr);
    // Integer zoom keeps every world pixel an exact square of device pixels
    zoom = Math.max(2, Math.round(Math.min(canvas.width, canvas.height) / (VIEW_TILES * TILE)));
  }
  addEventListener('resize', resize);
  resize();

  function enter(id, spawn) {
    scene = world.scene(id);
    // Props never move, so sort once per scene instead of every frame
    scene.sorted ??= [...scene.props].sort((a, b) => a.sortY - b.sortY);
    ({ x: player.x, y: player.y } = spawn ?? scene.spawn);
    hud.place.textContent = scene.title;
  }

  // The foot box is what collides, so heads can overlap walls and roofs in 3/4 view.
  const feet = () => ({ x: player.x - 4, y: player.y - 4, w: 8, h: 4 });

  function move(dx, dy) {
    if (dx) {
      player.x += dx;
      for (const s of scene.solids) if (overlaps(feet(), s)) player.x = dx > 0 ? s.x - 4 : s.x + s.w + 4;
    }
    if (dy) {
      player.y += dy;
      for (const s of scene.solids) if (overlaps(feet(), s)) player.y = dy > 0 ? s.y : s.y + s.h + 4;
    }
  }

  function update(dt) {
    time += dt;
    for (const p of scene.props) p.update?.(dt);
    if (fade) {
      fade.t += dt;
      if (!fade.switched && fade.t >= FADE_SECONDS) { enter(fade.to.scene, fade.to.spawn); fade.switched = true; }
      if (fade.t >= FADE_SECONDS * 2) fade = null;
      player.moving = false;
      return;
    }
    const v = paused ? { x: 0, y: 0 } : readInput();
    player.moving = v.x !== 0 || v.y !== 0;
    if (!player.moving) return;
    player.animT += dt * (isRunning() ? 1.6 : 1);
    player.dir = Math.abs(v.x) > Math.abs(v.y) ? (v.x < 0 ? 'left' : 'right') : (v.y < 0 ? 'up' : 'down');
    const speed = PLAYER_SPEED * (isRunning() ? RUN_MULTIPLIER : 1) * dt;
    move(v.x * speed, v.y * speed);
    const hit = scene.triggers.find(t => t.to && overlaps(feet(), t));
    if (hit) fade = { t: 0, to: hit.to };
  }

  function render() {
    const vw = canvas.width / zoom, vh = canvas.height / zoom;
    const camX = scene.w <= vw ? (scene.w - vw) / 2 : clamp(player.x - vw / 2, 0, scene.w - vw);
    const camY = scene.h <= vh ? (scene.h - vh) / 2 : clamp(player.y - 12 - vh / 2, 0, scene.h - vh);
    const ox = Math.round(camX * zoom), oy = Math.round(camY * zoom);
    const view = { x: camX, y: camY, w: vw, h: vh };

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = C.outline;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(zoom, 0, 0, zoom, -ox, -oy);
    ctx.imageSmoothingEnabled = false;

    scene.ground(ctx, view);
    // Walk the pre-sorted props, slotting the player in by feet y and skipping
    // anything whose bounds are off screen. This is what keeps 500 houses cheap.
    let playerDrawn = false;
    for (const p of scene.sorted) {
      if (!playerDrawn && p.sortY > player.y) { drawPlayer(ctx, player); playerDrawn = true; }
      if (p.draw && (!p.bounds || overlaps(p.bounds, view))) p.draw(ctx, time);
    }
    if (!playerDrawn) drawPlayer(ctx, player);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    drawLabels(ox, oy);

    if (fade) {
      const a = fade.t < FADE_SECONDS ? fade.t / FADE_SECONDS : 1 - (fade.t - FADE_SECONDS) / FADE_SECONDS;
      ctx.fillStyle = `rgba(20, 16, 30, ${clamp(a, 0, 1)})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    setPlayerScreen((player.x * zoom - ox) / dpr, ((player.y - 12) * zoom - oy) / dpr);
  }

  // Labels live in screen space so text stays sharp and readable at any zoom.
  function drawLabels(ox, oy) {
    const fs = Math.round(LABEL_FONT_PX * dpr), lh = Math.round(fs * 1.3), pad = Math.round(4 * dpr);
    const margin = 400 * dpr; // generous, labels are never wider or taller than this
    ctx.font = `600 ${fs}px ui-monospace, Menlo, Consolas, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (const p of scene.sorted) {
      for (const lb of p.labels || []) {
        const sx = lb.x * zoom - ox, sy = lb.y * zoom - oy;
        if (sy < 0 || sy - margin > canvas.height || sx < -margin || sx - margin > canvas.width) continue;
        // measureText is the slow part, so widths are cached until the font size changes
        if (lb.fs !== fs) {
          lb.fs = fs;
          lb.bw = Math.max(...lb.lines.map(l => ctx.measureText(l.text).width)) + pad * 2;
        }
        const bh = lb.lines.length * lh + pad * 2 - (lh - fs);
        const top = sy - bh;
        ctx.fillStyle = C.labelBg;
        ctx.fillRect(Math.round(sx - lb.bw / 2), Math.round(top), Math.round(lb.bw), Math.round(bh));
        lb.lines.forEach((l, i) => {
          ctx.fillStyle = l.color;
          ctx.fillText(l.text, Math.round(sx), Math.round(top + pad + i * lh));
        });
      }
    }
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (scene) { update(dt); render(); }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  return {
    // startId lets ?scene=factory:MO open straight into a room while testing
    load(newWorld, startId) {
      world = newWorld;
      fade = null;
      enter(startId && world.scene(startId) ? startId : world.start);
    },
    // Fade to any scene, used by the jump menu
    teleport(id, spawn) { fade = { t: 0, to: { scene: id, spawn } }; },
    setPaused(value) { paused = value; clearInput(); },
  };
}
