// The ten largest S&P 500 companies, their market caps, and major product lines.
//
// Figures are ballpark 2025 numbers rounded hard. The game only needs the right
// order of magnitude, so do not burn time refining them.
//
// Company fields:
//   marketCap      USD. Your slice of the company is your fund dollars times
//                  its index weight (marketCap / INDEX_MARKET_CAP), divided by
//                  marketCap, which is simply dollars / INDEX_MARKET_CAP.
//
// Line fields:
//   name           machine label
//   unit, units    singular, and plural when it is not just unit + 's'
//   perYear        units the whole company makes in a year
//   profitPerUnit  rough USD operating profit per unit, can be negative
//   sprite, tint   icon key in js/art/sprites.js, tint recolours its X pixels
//   via            look-through stake: { name, stake } where stake is the
//                  fraction of that company the parent owns

import { BERKSHIRE } from './berkshire.js';

// Total S&P 500 market cap. Ignores float adjustment, which is fine at this precision.
export const INDEX_MARKET_CAP = 6.0e13;

export const COMPANIES = [
  {
    ticker: 'NVDA', name: 'Nvidia', color: '#6fae2e', marketCap: 4.5e12,
    lines: [
      // ~$180B data center revenue at roughly $30K a GPU, ~60% operating margin
      { name: 'Data center AI GPUs', unit: 'GPU', perYear: 6.0e6, profitPerUnit: 18000, sprite: 'gpu' },
      { name: 'GeForce gaming GPUs', unit: 'card', perYear: 3.0e7, profitPerUnit: 150, sprite: 'gpu' },
    ],
  },
  {
    ticker: 'AAPL', name: 'Apple', color: '#8e98a8', marketCap: 4.0e12,
    lines: [
      { name: 'iPhones', unit: 'iPhone', perYear: 2.3e8, profitPerUnit: 260, sprite: 'phone' },
      { name: 'Macs', unit: 'Mac', perYear: 2.4e7, profitPerUnit: 300, sprite: 'laptop' },
      { name: 'iPads', unit: 'iPad', perYear: 5.5e7, profitPerUnit: 120, sprite: 'tablet' },
      { name: 'AirPods & wearables', unit: 'device', perYear: 1.0e8, profitPerUnit: 40, sprite: 'earbuds' },
      { name: 'Paid subscriptions', unit: 'sub-year', perYear: 1.1e9, profitPerUnit: 65, sprite: 'card', tint: '#8e98a8' },
    ],
  },
  {
    ticker: 'MSFT', name: 'Microsoft', color: '#2f7fd0', marketCap: 3.8e12,
    lines: [
      { name: 'Azure VM-hours', unit: 'VM-hour', perYear: 5.0e10, profitPerUnit: 0.7, sprite: 'server' },
      { name: 'Microsoft 365 seats', unit: 'seat-year', perYear: 4.3e8, profitPerUnit: 60, sprite: 'card', tint: '#d9532b' },
      { name: 'Windows PC licenses', unit: 'license', perYear: 2.5e8, profitPerUnit: 20, sprite: 'laptop' },
      { name: 'Game Pass subscribers', unit: 'sub-year', perYear: 3.4e7, profitPerUnit: 30, sprite: 'card', tint: '#3f9a3a' },
    ],
  },
  {
    ticker: 'GOOGL', name: 'Alphabet', color: '#e0a82e', marketCap: 3.5e12,
    lines: [
      // ~14B searches a day
      { name: 'Google searches', unit: 'search', units: 'searches', perYear: 5.0e12, profitPerUnit: 0.015, sprite: 'search' },
      { name: 'YouTube watch hours', unit: 'hour', perYear: 3.6e11, profitPerUnit: 0.04, sprite: 'play', tint: '#d23b2e' },
      { name: 'Google Cloud VM-hours', unit: 'VM-hour', perYear: 2.0e10, profitPerUnit: 0.5, sprite: 'server' },
      // Waymo still loses money on every ride
      { name: 'Waymo rides', unit: 'ride', perYear: 1.5e7, profitPerUnit: -30, sprite: 'car', tint: '#e8e8ee' },
    ],
  },
  {
    ticker: 'AMZN', name: 'Amazon', color: '#e07a2c', marketCap: 2.4e12,
    lines: [
      { name: 'Packages delivered', unit: 'package', perYear: 9.0e9, profitPerUnit: 2, sprite: 'box' },
      { name: 'AWS instance-hours', unit: 'instance-hour', perYear: 1.0e11, profitPerUnit: 0.45, sprite: 'server' },
      { name: 'Sponsored ad clicks', unit: 'click', perYear: 5.0e10, profitPerUnit: 0.8, sprite: 'search' },
    ],
  },
  {
    ticker: 'META', name: 'Meta', color: '#3b6fd6', marketCap: 1.8e12,
    lines: [
      { name: 'Daily users served', unit: 'user-year', perYear: 3.5e9, profitPerUnit: 22, sprite: 'user', tint: '#3b6fd6' },
      // Reality Labs loses ~$18B a year, spread over the devices it ships
      { name: 'Ray-Ban glasses & Quests', unit: 'device', perYear: 5.0e6, profitPerUnit: -3600, sprite: 'glasses' },
    ],
  },
  {
    ticker: 'AVGO', name: 'Broadcom', color: '#c8423a', marketCap: 1.6e12,
    lines: [
      { name: 'Custom AI accelerators', unit: 'chip', perYear: 2.5e6, profitPerUnit: 5000, sprite: 'chip', tint: '#c8423a' },
      { name: 'Wi-Fi & broadband chips', unit: 'chip', perYear: 1.0e9, profitPerUnit: 1, sprite: 'chip', tint: '#4b8fd6' },
      { name: 'VMware core licenses', unit: 'core-year', perYear: 2.0e8, profitPerUnit: 100, sprite: 'server' },
    ],
  },
  {
    ticker: 'TSLA', name: 'Tesla', color: '#b5343a', marketCap: 1.4e12,
    lines: [
      { name: 'Cars delivered', unit: 'car', perYear: 1.6e6, profitPerUnit: 3000, sprite: 'car', tint: '#c8423a' },
      { name: 'Megapack storage', unit: 'MWh', units: 'MWh', perYear: 4.6e4, profitPerUnit: 40000, sprite: 'megapack' },
    ],
  },
  BERKSHIRE,
  {
    ticker: 'LLY', name: 'Eli Lilly', color: '#d2334a', marketCap: 1.0e12,
    lines: [
      { name: 'Mounjaro & Zepbound pens', unit: 'pen', perYear: 1.4e8, profitPerUnit: 110, sprite: 'pen', tint: '#8a5bb0' },
      { name: 'Humalog insulin pens', unit: 'pen', perYear: 2.0e8, profitPerUnit: 3, sprite: 'pen', tint: '#d9912b' },
      { name: 'Verzenio tablets', unit: 'tablet', perYear: 2.2e7, profitPerUnit: 150, sprite: 'pills' },
    ],
  },
];
