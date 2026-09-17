// Single source of truth for tunable numbers. Everything else imports from here.

export const TILE = 16;            // world px per tile
export const VIEW_TILES = 18;      // tiles visible across the short side of the screen
export const PLAYER_SPEED = 76;    // world px per second, a brisk walk of ~5 tiles
export const FADE_SECONDS = 0.2;   // door transitions, long enough to read as a cut
export const STORAGE_KEY = 'index-village.dollars.v1';

// SHA-256 of the access password. Only a speed bump: see js/gate.js.
export const GATE_HASH = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';
export const GATE_KEY = 'index-village.unlocked.v1';

export const LABEL_FONT_PX = 11;   // css px, multiplied by devicePixelRatio

export const HOUSE = {
  minW: 7, maxW: 16,     // tiles. A $1/yr stake gets the small cottage, billions get a warehouse
  tilesPerDecade: 1.1,   // extra width per 10x of attributable profit
  cols: 4,  // ten houses fit in three rows
  gapTiles: 4,
};

export const MACHINE = {
  cellW: 144, cellH: 112,   // world px per machine slot, room for three label lines above
  minBody: 22, maxBody: 52, // body width follows log10(units) so a billion cigarettes looms over one RV
  beltSpeed: 22,            // px per second
  // Press cycle in seconds. Bigger output stamps faster, but capped so it stays readable.
  minPeriod: 0.35, maxPeriod: 2.8,
};

export const COLORS = {
  outline: '#23202e',
  shadow: 'rgba(20, 16, 30, 0.2)',
  grass: '#7ccf8a', grassDark: '#5fb574', grassLight: '#9fe0a4',
  sand: '#e8c98f', sandEdge: '#c9a66a',
  leaf: '#4fa35e', leafDark: '#357a48', leafLight: '#7cc97a',
  trunk: '#8a5a3b', trunkDark: '#5a3a26',
  wall: '#dcd6cc', wallLine: '#c3bcb0', wallTrim: '#8f8a84',
  glass: '#8fc6ea', glassLight: '#d8f0ff', frame: '#5d6670',
  door: '#9a6a44', doorDark: '#6e4a2e', knob: '#f2c94c',
  steel: '#4e5a74', steelLight: '#6c7a96', steelDark: '#343c50',
  belt: '#2a2d38', beltLine: '#4a4f60',
  floor: '#c89b6a', floorLine: '#a97d52',
  wallpaper: '#5d7a8c', wallpaperStripe: '#557184',
  lightOn: '#62e27a', lightOff: '#2f5a3a',
  crate: '#b07a48', crateDark: '#7a5230',
  skin: '#f1c59a', hair: '#b4502e', shirt: '#5a7a9a', pants: '#34405a', eye: '#23202e',
  labelBg: 'rgba(22, 20, 34, 0.82)',
  text: '#f7f3ea', textDim: '#b8b3c8', units: '#ffd66b', profit: '#7fe08e', loss: '#ff8a7a',
};
