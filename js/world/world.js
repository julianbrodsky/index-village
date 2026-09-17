// Wires village doors to factory scenes and back. Factories are built on first
// entry and then cached, so 500 companies cost nothing until you visit one.

import { buildVillage } from './village.js';
import { buildFactory } from './factory.js';

export function buildWorld(summaries) {
  const village = buildVillage(summaries);
  const built = new Map([[village.id, village]]);
  const doors = new Map();
  for (const house of village.houses) {
    const id = `factory:${house.summary.company.ticker}`;
    doors.set(id, house);
    house.trigger.to = { scene: id };
  }

  return {
    start: village.id,
    houses: village.houses,
    scene(id) {
      if (!built.has(id) && doors.has(id)) {
        const house = doors.get(id);
        const factory = buildFactory(house.summary);
        factory.exitTrigger.to = { scene: village.id, spawn: house.doorSpawn };
        built.set(id, factory);
      }
      return built.get(id);
    },
  };
}
