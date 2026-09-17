// The loop: input, collision, door triggers, fades, camera, and drawing.
// Knows scenes only through the contract documented in CLAUDE.md.

import { TILE, VIEW_TILES, PLAYER_SPEED, FADE_SECONDS, LABEL_FONT_PX, COLORS as C } from './config.js';
import { drawPlayer } from './art/draw.js';
import { readInput, setPlayerScreen, clearInput } from './input.js';

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const overlaps = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

export function createGame(canvas, hud) {
  const ctx = canvas.getContext('2d');
  const player = { x: 0, y: 0, dir: 'down', moving: false, animT: 0 };
  const playerProp = { sortY: 0, draw: c => drawPlayer(c, player) };
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
    scene = world.scenes[id];
    player.x = spawn.x;
    player.y = spawn.y;
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
    player.animT += dt;
    player.dir = Math.abs(v.x) > Math.abs(v.y) ? (v.x < 0 ? 'left' : 'right') : (v.y < 0 ? 'up' : 'down');
    move(v.x * PLAYER_SPEED * dt, v.y * PLAYER_SPEED * dt);
    const hit = scene.triggers.find(t => t.to && overlaps(feet(), t));
    if (hit) fade = { t: 0, to: hit.to };
  }

  function render() {
    const vw = canvas.width / zoom, vh = canvas.height / zoom;
    const camX = scene.w <= vw ? (scene.w - vw) / 2 : clamp(player.x - vw / 2, 0, scene.w - vw);
    const camY = scene.h <= vh ? (scene.h - vh) / 2 : clamp(player.y - 12 - vh / 2, 0, scene.h - vh);
    const ox = Math.round(camX * zoom), oy = Math.round(camY * zoom);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = C.outline;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(zoom, 0, 0, zoom, -ox, -oy);
    ctx.imageSmoothingEnabled = false;

    scene.ground(ctx, { x: camX, y: camY, w: vw, h: vh });
    playerProp.sortY = player.y;
    const drawables = [...scene.props, playerProp].sort((a, b) => a.sortY - b.sortY);
    for (const d of drawables) d.draw?.(ctx, time);

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
    ctx.font = `600 ${fs}px ui-monospace, Menlo, Consolas, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (const p of scene.props) {
      for (const lb of p.labels || []) {
        const sx = lb.x * zoom - ox, sy = lb.y * zoom - oy;
        const bw = Math.max(...lb.lines.map(l => ctx.measureText(l.text).width)) + pad * 2;
        const bh = lb.lines.length * lh + pad * 2 - (lh - fs);
        const top = sy - bh;
        if (sx + bw / 2 < 0 || sx - bw / 2 > canvas.width || sy < 0 || top > canvas.height) continue;
        ctx.fillStyle = C.labelBg;
        ctx.fillRect(Math.round(sx - bw / 2), Math.round(top), Math.round(bw), Math.round(bh));
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
      const id = world.scenes[startId] ? startId : world.start;
      enter(id, world.scenes[id].spawn);
    },
    setPaused(value) { paused = value; clearInput(); },
  };
}
