// Builds every scene and wires each house door to its factory and back.

import { buildVillage } from './village.js';
import { buildFactory } from './factory.js';

export function buildWorld(summaries) {
  const village = buildVillage(summaries);
  const scenes = { village };
  for (const house of village.houses) {
    const factory = buildFactory(house.summary);
    scenes[factory.id] = factory;
    house.trigger.to = { scene: factory.id, spawn: factory.spawn };
    factory.exitTrigger.to = { scene: village.id, spawn: house.doorSpawn };
  }
  return { scenes, start: village.id };
}
