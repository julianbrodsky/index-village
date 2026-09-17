// Boot: ask for fund dollars, build the world from them, run the game.

import { summarizeFund, fmtProfit } from './econ.js';
import { buildWorld } from './world/world.js';
import { showSetup } from './setup.js';
import { createGame } from './game.js';
import { bindPointer } from './input.js';

const canvas = document.getElementById('game');
const hud = { place: document.getElementById('place'), total: document.getElementById('total') };
const game = createGame(canvas, hud);
bindPointer(canvas);

function start(dollars) {
  const summaries = summarizeFund(dollars);
  hud.total.textContent = fmtProfit(summaries.reduce((sum, s) => sum + s.profit, 0));
  game.load(buildWorld(summaries), new URLSearchParams(location.search).get('scene'));
  game.setPaused(false);
}

function openSetup() {
  game.setPaused(true);
  showSetup(start);
}

document.getElementById('edit').addEventListener('click', openSetup);
openSetup();
