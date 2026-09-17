// Product icons as character grids. One char per pixel, '.' is transparent,
// 'X' takes the product line's tint. Grids are cached to canvases on first use.

const PALETTE = {
  k: '#23202e', w: '#f4efe3', o: '#e08a3c', r: '#c8423a', R: '#8e2a26',
  g: '#5aa05a', b: '#4b8fd6', y: '#f2c94c', s: '#9aa3ad', S: '#5d6670',
  n: '#8a5a3b', N: '#5a3a26', c: '#7fd6e0', e: '#3a3a44', t: '#d9c9a3',
};

const SPRITES = {
  cigarette: ['kkkkkkkkkk', 'kwwwwwwook', 'kkkkkkkkkk'],
  cigar: ['kkkkkkkkk.', 'kNnnnnnyNk', 'kkkkkkkkk.'],
  heatstick: ['kkkkkkk', 'kXXXwwk', 'kkkkkkk'],
  ecig: ['.kkkkkkkk.', 'kSSSSSScck', 'kSSSSSSSSk', '.kkkkkkkk.'],
  tin: ['.kkkkkk.', 'kXXXXXXk', 'kXwwwwXk', 'kXXXXXXk', '.kSSSSk.'],
  container: ['kkkkkkkkkkkk', 'kXXXXXXXXXXk', 'kXkXkXkXkXXk', 'kXXXXXXXXXXk', 'kkkkkkkkkkkk', '.ee......ee.'],
  hopper: ['kkkkkkkkkkkk', 'kXXXXXXXXXXk', 'kXXXXXXXXXXk', '.kXXXXXXXXk.', '..kkk..kkk..', '..e......e..'],
  tankcar: ['.kkkkkkkkkk.', 'kXXXXXXXXXXk', 'kXwwwwwwwwXk', 'kXXXXXXXXXXk', '.kkkkkkkkkk.', '..e......e..'],
  lumber: ['kkkkkkkkkkkk', 'knnnnNnnnnnk', 'kNNNNkNNNNNk', 'knnnnnnNnnnk', 'kkkkkkkkkkkk'],
  car: ['..kkkkk...', '.kXcccXk..', 'kXXXXXXXXk', 'kXXXXXXXXk', 'kkekkkkekk', '..e....e..'],
  card: ['kkkkkkkkkk', 'kXXXXXXXXk', 'kwwwwwwwwk', 'kwkkwwwwwk', 'kwwwwkkkwk', 'kkkkkkkkkk'],
  pills: ['.kkkkk.', '.kwwwk.', 'kkkkkkk', 'koooook', 'kowwwok', 'kowrwok', 'kowwwok', 'kkkkkkk'],
  clipboard: ['.kkkkkk.', 'kwwkkwwk', 'kwwrrwwk', 'kwrrrrwk', 'kwwrrwwk', 'kwkkkkwk', 'kkkkkkkk'],
  policy: ['kkkkkk..', 'kwwwwkk.', 'kwkkwwwk', 'kwwwwwwk', 'kwkkkkwk', 'kwwwwbbk', 'kwwwwbbk', 'kkkkkkkk'],
  bolt: ['...kkkk', '..kyyk.', '.kyyk..', 'kyyyyyk', '..kyyk.', '.kyyk..', '.kyk...', '.kk....'],
  house: ['....k....', '...kRk...', '..kRRRk..', '.kRRRRRk.', 'kkkkkkkkk', '.ktttttk.', '.ktntbtk.', '.kkkkkkk.'],
  rv: ['kkkkkkkkkk..', 'kwwwwwwwwwk.', 'kwbbwwwbbwkk', 'kwwwwwwwwwwk', 'kXXXXXXXXXXk', 'kkekkkkkkekk', '..e......e..'],
  fuel: ['..kkk...', '.kk.kkkk', 'kXXXXXXk', 'kXwwwwXk', 'kXwkkwXk', 'kXwwwwXk', 'kXXXXXXk', 'kkkkkkkk'],
  battery: ['..k..', 'kkkkk', 'kyyyk', 'kyyyk', 'kyyyk', 'keeek', 'keeek', 'kkkkk'],
  candy: ['kkkkkkkkkk', 'kwwwwwwwwk', 'kwNNNNNNwk', 'kwNnNnNNwk', 'kwNNNNNNwk', 'kwwwwwwwwk', 'kkkkkkkkkk'],
  blizzard: ['..kkkk..', '.kwNwwk.', 'kwwwwNwk', 'kkkkkkkk', '.kXXXXk.', '.kXwwXk.', '.kXXXXk.', '..kkkk..'],
  shirt: ['.kkk..kkk.', 'kwwwkkwwwk', 'kwwwwwwwwk', '.kkwwwwkk.', '..kwwwwk..', '..kwwwwk..', '..kkkkkk..'],
  paint: ['.kkkkkk.', 'kSSSSSSk', 'kkkkkkkk', 'kXXXXXXk', 'kXwwwwXk', 'kXwXXwXk', 'kXwwwwXk', 'kkkkkkkk'],
  shoe: ['....kkk....', '...kXXXk...', '..kXwXwXkk.', '.kXXXXXXXXk', 'kwwwwwwwwwk', 'kkkkkkkkkkk'],
  phone: ['kkkkkk', 'keeeek', 'kcccck', 'kcbbck', 'kcccck', 'kcccck', 'keeeek', 'kkkkkk'],
  soda: ['.kkk.', '.kRk.', '.kRk.', 'kRRRk', 'kwwwk', 'kRRRk', 'kRRRk', 'kkkkk'],
  barrel: ['.kkkkkk.', 'kXXXXXXk', 'kkkkkkkk', 'kXwwXXXk', 'kXXXXXXk', 'kkkkkkkk', 'kXXXXXXk', '.kkkkkk.'],
  ketchup: ['..kk..', '..kk..', '.kwwk.', 'kRRRRk', 'kRwwRk', 'kRgwRk', 'kRRRRk', 'kkkkkk'],
  gpu: ['kkkkkkkkkkkk', 'kSSSSSSSSSSk', 'kSkkkSSkkkSk', 'kSkekSSkekSk', 'kkkkkkkkkkkk', '.yyyyyyy....'],
  chip: ['k.k.k.k.', 'kkkkkkkk', 'keeeeeek', 'keXXXXek', 'keXXXXek', 'keeeeeek', 'kkkkkkkk', 'k.k.k.k.'],
  laptop: ['..kkkkkkk..', '..kccccck..', '..kccccck..', '..kkkkkkk..', 'kkkkkkkkkkk', 'kSSSSSSSSSk', 'kkkkkkkkkkk'],
  tablet: ['kkkkkkkk', 'keeeeeek', 'kcccccck', 'kcccccck', 'kcccccck', 'kcccccck', 'keeeeeek', 'kkkkkkkk'],
  earbuds: ['kkk...kkk', 'kwwk.kwwk', 'kwwk.kwwk', '.kwk.kwk.', '.kwk.kwk.', '.kk...kk.'],
  server: ['kkkkkkkkkk', 'kSSSSSSgSk', 'kkkkkkkkkk', 'kSSSSSSgSk', 'kkkkkkkkkk', 'kSSSSSSbSk', 'kkkkkkkkkk'],
  search: ['..kkkk...', '.kwccck..', 'kwccccck.', 'kcccccck.', 'kcccccck.', '.kcccck..', '..kkkkkk.', '......kkk'],
  play: ['kkkkkkkkkk', 'kXXXwXXXXk', 'kXXXwwXXXk', 'kXXXwwwXXk', 'kXXXwwXXXk', 'kXXXwXXXXk', 'kkkkkkkkkk'],
  glasses: ['kkkkk.kkkkk', 'keeekkkeeek', 'keeek.keeek', '.kkk...kkk.'],
  pen: ['kkkkkkkkkk..', 'kXXXXwwwwkkk', 'kkkkkkkkkk..'],
  megapack: ['kkkkkkkkkk', 'kwwwwwwwwk', 'kwkwkwkwwk', 'kwkwkwkwwk', 'kwwwwwwwwk', 'kwwwwrwwwk', 'kkkkkkkkkk'],
  user: ['..kkk..', '.kXXXk.', '.kXXXk.', '..kkk..', '.kXXXk.', 'kXXXXXk', 'kkkkkkk'],
  coin: ['..kkkk..', '.kyyyyk.', 'kyyooyyk', 'kyoyyyyk', 'kyyooyyk', 'kyyyyoyk', '.kyooyk.', '..kkkk..'],
  bill: ['kkkkkkkkkkk', 'kgggggggggk', 'kggggwggggk', 'kgggwwwgggk', 'kggggwggggk', 'kgggggggggk', 'kkkkkkkkkkk'],
  building: ['kkkkkkkk', 'kXXXXXXk', 'kcXcXcXk', 'kXXXXXXk', 'kcXcXcXk', 'kXXXXXXk', 'kcXcXcXk', 'kXXkkXXk', 'kkkkkkkk'],
  shield: ['kkkkkkkk', 'kXXXXXXk', 'kXXwwXXk', 'kXwwwwXk', 'kXXwwXXk', '.kXXXXk.', '..kXXk..', '...kk...'],
  truck: ['kkkkkkk.....', 'kXXXXXXkkk..', 'kXXXXXXkcck.', 'kXXXXXXkccck', 'kXXXXXXkkkkk', 'kkekkkkkkekk', '..e......e..'],
  plane: ['.....kk.....', '.....kwk....', 'kkkkkkwkkkkk', 'kwwwwwwwwwwk', 'kkkkkwwkkkkk', '....kwwk....', '...kkkkkk...'],
  engine: ['..kkkkkk..', '.kSSSSSSk.', 'kSeeeeeSSk', 'kSeSSSeSSk', 'kSeeeeeSSk', '.kSSSSSSk.', '..kkkkkk..'],
  gear: ['...kkk...', '.k.kSk.k.', '.kkSSSkk.', 'kkSSkSSkk', 'kSSk.kSSk', 'kkSSkSSkk', '.kkSSSkk.', '.k.kSk.k.', '...kkk...'],
  flame: ['...k...', '..kok..', '.kook..', '.koook.', 'kooyook', 'koyyyok', 'koyyyok', '.koook.', '..kkk..'],
  drop: ['...k...', '..kbk..', '..kbk..', '.kbbbk.', 'kbbwbbk', 'kbwbbbk', 'kbbbbbk', '.kbbbk.', '..kkk..'],
  pipe: ['kkkk....kkkk', 'kSSk....kSSk', 'kSSkkkkkkSSk', 'kSSSSSSSSSSk', 'kSSkkkkkkSSk', 'kkkk....kkkk'],
  tower: ['....k....', '...kSk...', '..k.S.k..', '....S....', '...kSk...', '...S.S...', '..kS.Sk..', '..S...S..', '.kS...Sk.', 'kkkkkkkkk'],
  tv: ['kkkkkkkkkkk', 'kccccccccck', 'kcwccccccck', 'kccccccccck', 'kccccccccck', 'kkkkkkkkkkk', '....kkk....', '..kkkkkkk..'],
  ticket: ['kkkkkkkkkkk', 'kXXXXkXXXXk', 'kXwwwkXwXXk', 'kXXXXkXXXXk', 'kXwwwkXwXXk', 'kkkkkkkkkkk'],
  ship: ['....kk......', '....kXk.....', '..kkkkkkkk..', '..kwcwcwck..', 'kkkkkkkkkkkk', 'kbbbbbbbbbk.', '.kkkkkkkkk..'],
  bed: ['kk.......kk', 'kwkkkkkkkwk', 'kwwwXXXXXwk', 'kwwwXXXXXwk', 'kkkkkkkkkkk', 'k.........k'],
  burger: ['.kkkkkkk.', 'koooooook', 'kgggggggk', 'kRRRRRRRk', 'kyyyyyyyk', 'koooooook', '.kkkkkkk.'],
  cup: ['.kkkkkk.', 'kwwwwwwk', 'kkkkkkkk', '.kXXXXk.', '.kwwwwk.', '.kXXXXk.', '.kXXXXk.', '..kkkk..'],
  cart: ['k.........', 'kk........', '.kkkkkkkkk', '.kXwXwXwXk', '.kXXXXXXk.', '..kkkkkkk.', '...k...k..', '..eee.eee.'],
  bag: ['..kkkk..', '.k....k.', 'kkkkkkkk', 'kXXXXXXk', 'kXXXXXXk', 'kXXwwXXk', 'kXXXXXXk', 'kkkkkkkk'],
  syringe: ['k.kkkkkkk...', 'kkkwwwccckkk', 'k.kkkkkkk...'],
  heart: ['.kk...kk.', 'kRRk.kRRk', 'kRwRkRRRk', 'kRRRRRRRk', '.kRRRRRk.', '..kRRRk..', '...kRk...', '....k....'],
  flask: ['..kkkk..', '..kwwk..', '..kwwk..', '.kwwwwk.', 'kwwwwwwk', 'kXXXXXXk', 'kXXXXXXk', 'kkkkkkkk'],
  tooth: ['.kk..kk.', 'kwwkkwwk', 'kwwwwwwk', 'kwwwwwwk', '.kwwwwk.', '.kwkkwk.', '.kk..kk.'],
  ingot: ['..kkkkkk..', '.kXwXXXXk.', 'kXXXXXXXXk', 'kkkkkkkkkk'],
  sack: ['.k.kk.k.', '..kkkk..', '.kttttk.', 'kttttttk', 'kttXXttk', 'kttXXttk', 'kttttttk', '.kkkkkk.'],
  tool: ['kkkkk.....', 'kSSSkkkkkk', 'kSSSknnnnk', 'kkkkkkkkkk'],
  fan: ['kkkkkkkkk', 'kSSSSSSSk', 'kSkkkkkSk', 'kSkwewkSk', 'kSkewekSk', 'kSkkkkkSk', 'kSSSSSSSk', 'kkkkkkkkk'],
  solar: ['kkkkkkkkkkk', 'kbkbkbkbkbk', 'kkkkkkkkkkk', 'kbkbkbkbkbk', 'kkkkkkkkkkk', '....k.k....', '...kk.kk...'],
  controller: ['.kkkkkkkkk.', 'kSSSSSSSSSk', 'kSeSSSSSrSk', 'keeeSSSbSgk', 'kSeSSSSSySk', 'kkkk...kkkk'],
  lipstick: ['..k..', '.kRk.', '.kRk.', 'kRRRk', 'kkkkk', 'kyyyk', 'kyyyk', 'kyyyk', 'kkkkk'],
  bottle: ['.kkk.', '.kXk.', '.kXk.', 'kXXXk', 'kXXXk', 'kwwwk', 'kwXwk', 'kXXXk', 'kXXXk', 'kkkkk'],
  can: ['.kkkkk.', 'kSSSSSk', 'kXXXXXk', 'kXwwwXk', 'kXwwwXk', 'kXXXXXk', 'kSSSSSk', '.kkkkk.'],
  meat: ['..kkkkk..', '.kRRRRRk.', 'kRRwRRRRk', 'kRRRRRwRk', '.kRRRRRkk', '..kkkkkwk'],
  cereal: ['kkkkkkk', 'kXXXXXk', 'kXyyyXk', 'kXyoyXk', 'kXyyyXk', 'kXXXXXk', 'kXwwwXk', 'kXXXXXk', 'kkkkkkk'],
  key: ['.kkk.......', 'kyyykkkkkkk', 'kykyyyyyyyk', 'kyyykkykyk.', '.kkk..k.k..'],
  chart: ['kkkkkkkkk', 'kwwwwwwwk', 'kwwwwwgwk', 'kwwwwggwk', 'kwbwwggwk', 'kwbwrggwk', 'kwbwrggwk', 'kkkkkkkkk'],
  app: ['kkkkkkkkkk', 'kXXXXXXXXk', 'kkkkkkkkkk', 'kwwwwwwwwk', 'kwkkkwwwwk', 'kwwwwkkkwk', 'kwkkwwwwwk', 'kkkkkkkkkk'],
  router: ['.k......k.', '.k......k.', 'kkkkkkkkkk', 'kSSSSSSSSk', 'kSgSgSgSSk', 'kkkkkkkkkk'],
  robot: ['.....kkk.', '....kXXk.', '...kXkk..', '..kXk....', '.kXk.....', 'kXk......', 'kkkk.....', 'kSSSk....', 'kkkkkk...'],
  missile: ['..kk........', '.kSSkkkkkkk.', 'kwSSSSSSSSrk', '.kSSkkkkkkk.', '..kk........'],
  roll: ['.kkkkkk.', 'kwwwwwwk', 'kwwkkwwk', 'kwwkkwwk', 'kwwwwwwk', 'kwwwwwwk', '.kkkkkk.'],
  disk: ['kkkkkkkkkk', 'kSSSSSSSSk', 'kSkkkkSSSk', 'kSkeekSSSk', 'kSkkkkSSgk', 'kSSSSSSSSk', 'kkkkkkkkkk'],
  pizza: ['kkkkkkkkk', 'kyyyyyyyk', '.kyRyyRk.', '.kyyyyyk.', '..kyRyk..', '..kyyyk..', '...kyk...', '....k....'],
  dice: ['kkkkkkk', 'kwwwwwk', 'kwkwwwk', 'kwwkwwk', 'kwwwkwk', 'kwwwwwk', 'kkkkkkk'],
  tree: ['...kk...', '..kggk..', '.kggggk.', 'kgggggk.', '..knnk..', '..knnk..', '..kkkk..'],
  box: ['kkkkkkkk', 'knnnnnnk', 'kNNNNNNk', 'knnnnnnk', 'kkkkkkkk'],
};

const cache = new Map();

function build(name, tint) {
  const grid = SPRITES[name] || SPRITES.box;
  const c = document.createElement('canvas');
  c.width = Math.max(...grid.map(row => row.length));
  c.height = grid.length;
  const g = c.getContext('2d');
  grid.forEach((row, y) => [...row].forEach((ch, x) => {
    const color = ch === 'X' ? (tint || '#888') : PALETTE[ch];
    if (!color) return;
    g.fillStyle = color;
    g.fillRect(x, y, 1, 1);
  }));
  return c;
}

// Anchored at bottom centre so items sit on a belt regardless of height.
export function drawSprite(ctx, name, tint, cx, bottom) {
  const key = name + tint;
  if (!cache.has(key)) cache.set(key, build(name, tint));
  const c = cache.get(key);
  ctx.drawImage(c, Math.round(cx - c.width / 2), Math.round(bottom - c.height));
}
