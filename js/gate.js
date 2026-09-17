// Password screen shown before anything else.
// This is a speed bump, not security. GitHub Pages is static, so the hash and
// the whole game ship to every visitor, and anyone reading the source can skip
// it. Storing a hash just keeps the password out of plain sight.

import { GATE_HASH, GATE_KEY } from './config.js';

async function sha256(text) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export function requireGate() {
  const root = document.getElementById('gate');
  try {
    if (localStorage.getItem(GATE_KEY) === GATE_HASH) { root.hidden = true; return Promise.resolve(); }
  } catch { /* storage blocked, just ask */ }

  const form = root.querySelector('form');
  const input = form.querySelector('#password');
  const err = form.querySelector('.err');
  root.hidden = false;
  input.focus();

  return new Promise(resolve => {
    form.onsubmit = async e => {
      e.preventDefault();
      if (await sha256(input.value) !== GATE_HASH) {
        err.textContent = 'Wrong password';
        input.select();
        return;
      }
      try { localStorage.setItem(GATE_KEY, GATE_HASH); } catch { /* ask again next visit */ }
      root.hidden = true;
      resolve();
    };
  });
}
