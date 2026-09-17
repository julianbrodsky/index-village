// Fund entry screen: one dollar amount. Persists in localStorage so a reload skips retyping.

import { STORAGE_KEY } from './config.js';
import { summarizeFund, fmtMoney, fmtProfit } from './econ.js';

function loadDollars() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? ''; } catch { return ''; }
}

function saveDollars(dollars) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(dollars)); } catch { /* private mode, fine */ }
}

export function showSetup(onDone) {
  const root = document.getElementById('setup');
  const form = root.querySelector('form');
  const input = form.querySelector('#dollars');
  const est = form.querySelector('.est');
  if (input.value === '') input.value = loadDollars();

  const refresh = () => {
    const dollars = parseFloat(input.value) || 0;
    const summaries = summarizeFund(dollars);
    est.textContent = dollars > 0
      ? `Top 10 slice: ${fmtMoney(summaries.reduce((s, x) => s + x.invested, 0))}, ${fmtProfit(summaries.reduce((s, x) => s + x.profit, 0))}`
      : '';
  };
  input.oninput = refresh;
  refresh();

  form.onsubmit = e => {
    e.preventDefault();
    const dollars = Math.max(0, parseFloat(input.value) || 0);
    saveDollars(dollars);
    root.hidden = true;
    onDone(dollars);
  };
  root.hidden = false;
  input.focus();
}
