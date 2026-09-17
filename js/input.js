// Keyboard (WASD and arrows) plus press and hold on touch, folded into one unit vector.

const DIRS = {
  KeyW: [0, -1], ArrowUp: [0, -1], KeyS: [0, 1], ArrowDown: [0, 1],
  KeyA: [-1, 0], ArrowLeft: [-1, 0], KeyD: [1, 0], ArrowRight: [1, 0],
};

const keys = new Set();
let shift = false;
let pointer = null;
let player = { x: 0, y: 0 };

addEventListener('keydown', e => {
  shift = e.shiftKey;
  if (!DIRS[e.code] || e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
  keys.add(e.code);
  e.preventDefault();
});
addEventListener('keyup', e => { shift = e.shiftKey; keys.delete(e.code); });
addEventListener('blur', () => keys.clear());

// Touch fallback: hold anywhere and the player walks toward your finger.
export function bindPointer(el) {
  el.addEventListener('pointerdown', e => {
    pointer = { x: e.clientX, y: e.clientY };
    el.setPointerCapture(e.pointerId);
  });
  el.addEventListener('pointermove', e => { if (pointer) pointer = { x: e.clientX, y: e.clientY }; });
  const release = () => { pointer = null; };
  el.addEventListener('pointerup', release);
  el.addEventListener('pointercancel', release);
}

export const isRunning = () => shift;

export function setPlayerScreen(x, y) { player = { x, y }; }

export function readInput() {
  let x = 0, y = 0;
  for (const k of keys) { x += DIRS[k][0]; y += DIRS[k][1]; }
  if (pointer && !x && !y) {
    const dx = pointer.x - player.x, dy = pointer.y - player.y;
    if (Math.hypot(dx, dy) > 12) { x = dx; y = dy; }
  }
  const len = Math.hypot(x, y);
  return len ? { x: x / len, y: y / len } : { x: 0, y: 0 };
}

export function clearInput() { keys.clear(); pointer = null; }
