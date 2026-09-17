// Boot: ask for fund dollars, build the world from them, run the game.

import { summarizeFund, fmtProfit } from './econ.js';
import { buildWorld } from './world/world.js';
import { showSetup } from './setup.js';
import { createGame } from './game.js';
import { bindPointer } from './input.js';
import { requireGate } from './gate.js';

const canvas = document.getElementById('game');
const hud = { place: document.getElementById('place'), total: document.getElementById('total') };
const game = createGame(canvas, hud);
bindPointer(canvas);

function start(dollars) {
  const summaries = summarizeFund(dollars);
  hud.total.textContent = fmtProfit(summaries.reduce((sum, s) => sum + s.profit, 0));
  const world = buildWorld(summaries);
  game.load(world, new URLSearchParams(location.search).get('scene'));
  fillJumpMenu(world);
  game.setPaused(false);
}

// Every house is one pick away, which matters when there are hundreds of them
function fillJumpMenu(world) {
  const jump = document.getElementById('jump');
  const houses = [...world.houses].sort((a, b) => a.summary.company.name.localeCompare(b.summary.company.name));
  jump.replaceChildren(new Option('Jump to a company', ''),
    ...houses.map((h, i) => new Option(`${h.summary.company.name} (${h.summary.company.ticker})`, i)));
  jump.onchange = () => {
    const house = houses[jump.value];
    if (house) game.teleport('village', house.doorSpawn);
    jump.value = '';
    jump.blur(); // hand the arrow keys back to walking
  };
}

function openSetup() {
  game.setPaused(true);
  showSetup(start);
}

document.getElementById('edit').addEventListener('click', openSetup);
await requireGate();
openSetup();
