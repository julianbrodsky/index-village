// Ownership math and number formatting. Pure functions, no DOM.

import { COMPANIES, INDEX_MARKET_CAP } from './data/companies.js';

// A cap-weighted fund puts dollars * weight into each company, where weight is
// marketCap / INDEX_MARKET_CAP. Your fraction of every company is therefore the
// same number: dollars / INDEX_MARKET_CAP.
export function summarize(company, dollars) {
  const fraction = dollars > 0 ? dollars / INDEX_MARKET_CAP : 0;
  const invested = fraction * company.marketCap;
  const lines = company.lines.map(line => {
    const units = line.perYear * fraction * (line.via ? line.via.stake : 1);
    return { line, units, profit: units * line.profitPerUnit };
  });
  const profit = lines.reduce((sum, l) => sum + l.profit, 0);
  return { company, invested, fraction, lines, profit };
}

export const summarizeFund = dollars => COMPANIES.map(c => summarize(c, dollars));

function plural(line) {
  if (line.units) return line.units;
  return line.unit.endsWith('y') ? line.unit.slice(0, -1) + 'ies' : line.unit + 's';
}

export function fmtCount(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 10) return Math.round(n).toLocaleString('en-US');
  return n.toFixed(1);
}

// Tiny stakes produce less than one unit a year, so flip to "1 every N yrs".
export function fmtUnits(line, n) {
  if (n <= 0) return `no ${plural(line)} yet`;
  if (n >= 1) return `${fmtCount(n)} ${n < 1.05 ? line.unit : plural(line)} / yr`;
  return `1 ${line.unit} every ${fmtCount(1 / n)} yrs`;
}

export function fmtMoney(n) {
  const sign = n < 0 ? '-' : '';
  const a = Math.abs(n);
  if (a >= 1e9) return `${sign}$${(a / 1e9).toFixed(2)}B`;
  if (a >= 1e6) return `${sign}$${(a / 1e6).toFixed(2)}M`;
  if (a >= 1e4) return `${sign}$${(a / 1e3).toFixed(1)}K`;
  if (a >= 1) return `${sign}$${a.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `${sign}${(a * 100).toFixed(a >= 0.01 ? 1 : 3)}¢`;
}

export function fmtProfit(n) {
  return `~${fmtMoney(Math.abs(n))} ${n < 0 ? "loss" : "profit"} / yr`;
}

export function fmtPct(fraction) {
  const p = fraction * 100;
  if (p >= 0.01) return p.toFixed(4) + '%';
  if (p >= 0.000001) return p.toFixed(8) + '%';
  return p.toExponential(2) + '%';
}
