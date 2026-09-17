// Batch 2: index ranks 10 to 60, skipping the ones batch 1 already covers.
// Compact lines: [name, unit, perYear, profitPerUnit, sprite, tint?, plural?]
// See js/data/companies.js for the formats and the accuracy bar.

export default {
  MU: [
    ['DRAM & HBM memory', 'module', 1.0e9, 25, 'chip'],
    ['NAND flash storage', 'drive', 3.0e8, 8, 'disk'],
  ],
  JPM: [
    ['Card & merchant payments', 'payment', 9.0e10, 0.12, 'card'],
    ['Deposit accounts held', 'account-year', 8.0e7, 120, 'bill'],
    ['Loans & mortgages made', 'loan', 4.0e6, 900, 'key'],
  ],
  AMD: [
    ['Data center AI chips', 'chip', 1.0e7, 900, 'gpu'],
    ['Ryzen PC processors', 'chip', 5.0e7, 60, 'chip'],
    ['Console & graphics chips', 'chip', 4.0e7, 15, 'controller'],
  ],
  WMT: [
    ['Checkouts rung up', 'checkout', 1.0e10, 0.35, 'cart'],
    ['Online orders delivered', 'order', 2.0e9, 0.5, 'box'],
    ['Prescriptions filled', 'prescription', 3.0e8, 1.5, 'pills'],
  ],
  V: [
    ['Payments processed', 'payment', 2.4e11, 0.09, 'card'],
    ['Cards in circulation', 'card-year', 4.6e9, 4, 'card'],
  ],
  XOM: [
    ['Oil & gas produced', 'barrel', 1.6e9, 10, 'barrel'],
    ['Fuel sold at stations', 'gallon', 6.0e10, 0.05, 'fuel'],
    ['Plastic & chemical pellets', 'ton', 2.5e7, 90, 'flask'],
  ],
  JNJ: [
    ['Prescription medicine doses', 'dose', 3.0e9, 12, 'pills'],
    ['Surgical devices & implants', 'device', 2.0e8, 40, 'heart'],
  ],
  INTC: [
    ['PC & server processors', 'chip', 2.0e8, 45, 'chip'],
    // The foundry business still loses money on every wafer it runs
    ['Foundry wafers for others', 'wafer', 1.5e6, -400, 'disk'],
  ],
  MA: [
    ['Payments processed', 'payment', 1.6e11, 0.1, 'card'],
    ['Cards in circulation', 'card-year', 3.5e9, 4, 'card'],
  ],
  ABBV: [
    ['Humira & Skyrizi doses', 'dose', 6.0e7, 400, 'syringe'],
    ['Botox treatments', 'treatment', 2.0e7, 250, 'syringe'],
    ['Everyday pills & tablets', 'pill', 5.0e9, 0.5, 'pills'],
  ],
  ORCL: [
    ['Cloud database hours', 'VM-hour', 3.0e10, 0.25, 'server'],
    ['Software licenses & support', 'license-year', 4.0e5, 20000, 'app'],
  ],
  CSCO: [
    ['Switches & routers', 'device', 2.0e7, 900, 'router'],
    ['Security subscriptions', 'sub-year', 1.0e7, 300, 'shield'],
  ],
  PLTR: [
    ['Government & company deployments', 'deployment', 1.2e4, 120000, 'app'],
  ],
  CVX: [
    ['Oil & gas produced', 'barrel', 1.2e9, 12, 'barrel'],
    ['Fuel sold at stations', 'gallon', 2.5e10, 0.05, 'fuel'],
  ],
  BAC: [
    ['Card & debit payments', 'payment', 6.0e10, 0.1, 'card'],
    ['Deposit accounts held', 'account-year', 7.0e7, 110, 'bill'],
    ['Mortgages & loans made', 'loan', 2.0e6, 1200, 'key'],
  ],
  COST: [
    ['Warehouse checkouts', 'checkout', 3.5e9, 1.4, 'cart'],
    ['Memberships', 'member-year', 1.4e8, 35, 'card'],
    ['Food court meals', 'meal', 2.0e8, 0.2, 'burger'],
  ],
  KO: [
    ['Drinks served', 'serving', 8.0e11, 0.015, 'soda'],
    ['Cases shipped to bottlers', 'case', 1.2e10, 0.9, 'bottle'],
  ],
  DELL: [
    ['PCs & laptops', 'PC', 4.0e7, 50, 'laptop'],
    ['AI & rack servers', 'server', 3.0e6, 1500, 'server'],
  ],
  CAT: [
    ['Excavators & dozers', 'machine', 3.0e5, 25000, 'truck'],
    ['Engines & generator sets', 'engine', 2.5e5, 9000, 'engine'],
    ['Replacement parts', 'part', 1.0e8, 25, 'gear'],
  ],
  MRK: [
    ['Keytruda cancer doses', 'dose', 1.2e7, 1800, 'syringe'],
    ['Gardasil & other vaccines', 'dose', 2.0e8, 25, 'syringe'],
    ['Animal health treatments', 'dose', 2.0e9, 0.3, 'pills'],
  ],
  PG: [
    ['Laundry & cleaning packs', 'pack', 4.0e9, 1.2, 'bottle'],
    ['Diapers, wipes & tissue', 'pack', 1.5e9, 1.5, 'roll'],
    ['Razors & grooming items', 'item', 1.5e9, 1.2, 'lipstick'],
  ],
  UNH: [
    ['Health plan members', 'member-year', 5.0e7, 150, 'card'],
    ['Optum Rx prescriptions', 'prescription', 1.6e9, 3.5, 'pills'],
    ['Optum Health visits', 'visit', 1.0e8, 10, 'clipboard'],
  ],
  LRCX: [
    ['Etch & deposition tools', 'tool', 3.0e3, 2.0e6, 'robot'],
    ['Service & spare parts', 'part', 2.0e6, 900, 'gear'],
  ],
  AMAT: [
    ['Chipmaking tools', 'tool', 1.0e4, 1.4e6, 'robot'],
    ['Service contracts', 'contract-year', 2.0e4, 60000, 'gear'],
  ],
  GE: [
    ['Jet engines shipped', 'engine', 3.0e3, 1.5e6, 'engine'],
    ['Engine overhauls & parts', 'service', 1.0e4, 900000, 'gear'],
  ],
  MS: [
    ['Client accounts managed', 'account-year', 1.5e7, 900, 'chart'],
    ['Trades & deals executed', 'trade', 5.0e8, 3, 'coin'],
  ],
  NFLX: [
    ['Subscriptions', 'sub-year', 3.1e8, 35, 'tv'],
    ['Hours streamed', 'hour', 2.0e11, 0.05, 'play'],
  ],
  PANW: [
    ['Firewalls & security subs', 'sub-year', 8.0e5, 3000, 'shield'],
  ],
  HD: [
    ['Store & pro checkouts', 'checkout', 1.8e9, 11, 'cart'],
    ['Lumber & appliance orders', 'order', 1.0e8, 40, 'lumber'],
  ],
  PM: [
    ['Marlboro & intl cigarettes', 'cigarette', 6.1e11, 0.017, 'cigarette'],
    ['IQOS heated sticks', 'stick', 1.5e11, 0.035, 'heatstick', '#2f8fb0'],
    ['ZYN nicotine pouches', 'can', 8.0e8, 1.5, 'tin', '#3b8fd6'],
  ],
  GS: [
    ['Deals & trades executed', 'trade', 3.0e8, 10, 'coin'],
    ['Client assets managed', 'client-year', 5.0e6, 1500, 'chart'],
  ],
  WFC: [
    ['Deposit accounts held', 'account-year', 6.0e7, 100, 'bill'],
    ['Mortgages & auto loans', 'loan', 2.5e6, 1000, 'key'],
    ['Card payments', 'payment', 3.0e10, 0.1, 'card'],
  ],
  RTX: [
    ['Jet engines & spares', 'engine', 1.5e4, 250000, 'engine'],
    ['Missiles & air defense', 'missile', 2.0e4, 90000, 'missile'],
    ['Avionics & cabin systems', 'system', 5.0e5, 2000, 'app'],
  ],
  CRWD: [
    ['Endpoint security seats', 'seat-year', 3.0e7, 25, 'shield'],
  ],
  ANET: [
    ['Data center switches', 'switch', 1.5e6, 3000, 'router'],
  ],
  GEV: [
    ['Gas & steam turbines', 'turbine', 400, 4.0e6, 'engine'],
    ['Wind turbines', 'turbine', 2.0e3, 100000, 'fan'],
    ['Grid & transformer gear', 'unit', 5.0e4, 9000, 'bolt'],
  ],
  TMO: [
    ['Lab instruments', 'instrument', 3.0e5, 12000, 'flask'],
    ['Reagents & consumables', 'kit', 5.0e8, 8, 'flask'],
    ['Clinical trials run', 'trial', 3.0e3, 300000, 'clipboard'],
  ],
  TXN: [
    ['Analog & embedded chips', 'chip', 4.0e10, 0.15, 'chip'],
  ],
  SNDK: [
    ['Flash memory drives', 'drive', 2.5e8, 10, 'disk'],
  ],
  IBM: [
    ['Software & AI subscriptions', 'sub-year', 1.0e6, 15000, 'app'],
    ['Mainframes & servers', 'system', 2.5e4, 200000, 'server'],
    ['Consulting engagements', 'engagement', 5.0e4, 40000, 'clipboard'],
  ],
  C: [
    ['Card payments', 'payment', 4.0e10, 0.1, 'card'],
    ['Cross-border transfers', 'transfer', 1.0e9, 2, 'bill'],
  ],
  KLAC: [
    ['Chip inspection tools', 'tool', 4.0e3, 1.6e6, 'search'],
  ],
  MRVL: [
    ['Data center & optical chips', 'chip', 3.0e8, 10, 'chip'],
  ],
  LIN: [
    ['Industrial gas delivered', 'ton', 1.5e8, 60, 'flask'],
    ['On-site gas plants run', 'plant-year', 600, 3.0e6, 'pipe'],
  ],
  AXP: [
    ['Card payments', 'payment', 1.2e10, 0.7, 'card'],
    ['Card memberships', 'card-year', 1.5e8, 60, 'card'],
  ],
  AMGN: [
    ['Biologic injections', 'dose', 5.0e7, 180, 'syringe'],
    ['Pills & tablets', 'pill', 2.0e9, 1.2, 'pills'],
  ],
  QCOM: [
    ['Snapdragon phone chips', 'chip', 9.0e8, 9, 'chip'],
    ['Patent royalties collected', 'device', 1.5e9, 2, 'coin'],
  ],
  VZ: [
    ['Phone lines served', 'line-year', 1.4e8, 140, 'phone'],
    ['Home internet lines', 'line-year', 1.2e7, 200, 'router'],
  ],
  CRM: [
    ['CRM software seats', 'seat-year', 1.5e8, 60, 'app'],
    ['AI agent subscriptions', 'sub-year', 2.0e6, 900, 'robot'],
  ],
  APH: [
    ['Connectors & cables', 'connector', 2.0e10, 0.2, 'router'],
  ],
};
