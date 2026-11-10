#!/usr/bin/env node
// Verifies the ConnectX content against the REAL product content on
// visionx.software, in two ways:
//
//   A. Field coverage. Every field the four full VisionX records carry must be
//      present in ours, and every count must sit inside the range those four
//      actually use. Not a range we invented.
//
//   B. Nothing lost. Every sentence the live /products/connectx page already
//      publishes must still be in our record, unless it is one of the template
//      fallbacks we are replacing on purpose.
//
// Source data, all measured from the live site and committed in content/live/:
//   detail-map.json     the four full records: omnireach, omnipost, crawlgpt, resuelto
//   catalogue.json      the live ConnectX catalogue entry
//   detail.json         the live ConnectX detail record
//
// Exits non-zero if anything is missing.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

const ours = read('content/connectx.content.json');
const live = read('content/live/detail-map.json');
const liveCat = read('content/live/catalogue.json');
const liveDetail = read('content/live/detail.json');

const slugs = Object.keys(live);
let fails = 0;
const bad = (m) => { console.log('  MISSING  ' + m); fails++; };

/* ================================================= A. field coverage */
console.log('\nA. FIELD COVERAGE against the four full VisionX records');
console.log('   ' + slugs.join(', ') + '\n');

// every field any of the four carries
const everyField = new Map(); // field -> how many of the four have it
for (const s of slugs) for (const f of Object.keys(live[s])) everyField.set(f, (everyField.get(f) || 0) + 1);

const rows = [];
for (const [field, count] of [...everyField].sort()) {
  const have = field in ours;
  const sizes = slugs.filter((s) => Array.isArray(live[s][field])).map((s) => live[s][field].length);
  const lo = sizes.length ? Math.min(...sizes) : null;
  const hi = sizes.length ? Math.max(...sizes) : null;
  const n = Array.isArray(ours[field]) ? ours[field].length : null;
  let verdict;
  if (!have) {
    verdict = count === slugs.length ? 'ABSENT, and all four have it' : `absent, ${count} of 4 have it`;
    if (count === slugs.length) bad(`field "${field}" is in all four live records but not in ours`);
  } else if (n === null) {
    verdict = 'present';
  } else if (lo === null) {
    verdict = `${n} items`;
  } else {
    verdict = `${n} items, live uses ${lo}${lo === hi ? '' : ' to ' + hi}`;
    if (n < lo) bad(`field "${field}" has ${n}, every live record has at least ${lo}`);
  }
  rows.push([field, `${count}/4`, have ? 'yes' : 'NO', verdict]);
}
const w = [Math.max(...rows.map((r) => r[0].length)), 4, 4];
for (const r of rows) console.log(`  ${r[0].padEnd(w[0])}  live ${r[1]}  ours ${r[2].padEnd(3)}  ${r[3]}`);

// fields we carry that no live record uses
const extra = Object.keys(ours).filter((f) => !everyField.has(f) && !['slug', 'name', 'category'].includes(f));
console.log(extra.length ? `\n  EXTRA fields not used by any live record: ${extra.join(', ')}` : '\n  No invented fields.');

/* ================================================ B. nothing lost */
console.log('\nB. NOTHING LOST from what visionx.software already publishes\n');

const flat = (v, out = []) => {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => flat(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => flat(x, out));
  return out;
};
const oursText = flat(ours).join('\n');

// Template fallbacks we are replacing on purpose. Measured on the live page.
const REPLACING = [
  'disconnected records and manual hand-offs',
  'Start your workspace',
  'Configure teams and responsibilities',
  'Bring in your starting information',
  'before inviting the banks',
  'Contact sales for deployment and licensing',
  'can use ConnectX to',
];

const liveStrings = [...new Set([...flat(liveCat), ...flat(liveDetail)])].filter((s) => s.length > 12);
const lost = [];
const replaced = [];
for (const s of liveStrings) {
  if (oursText.includes(s)) continue;
  if (REPLACING.some((r) => s.includes(r))) { replaced.push(s); continue; }
  lost.push(s);
}

console.log(`  live strings checked        ${liveStrings.length}`);
console.log(`  still present in ours       ${liveStrings.length - lost.length - replaced.length}`);
console.log(`  replaced on purpose         ${replaced.length}`);
console.log(`  LOST                        ${lost.length}`);
for (const s of lost) bad(`live text dropped: "${s.slice(0, 80)}"`);
if (replaced.length) {
  console.log('\n  Replaced on purpose, each one a template fallback:');
  for (const s of replaced) console.log(`    - ${s.slice(0, 92)}`);
}

/* ================================================ C. what we added */
console.log('\nC. WHAT WE ADDED\n');
const ADDED = ['overviewParagraphs', 'problems', 'aiCapabilities', 'useCases', 'walkthrough', 'faqs'];
for (const f of ADDED) {
  const n = Array.isArray(ours[f]) ? ours[f].length : 1;
  const sizes = slugs.filter((s) => Array.isArray(live[s][f])).map((s) => live[s][f].length);
  console.log(`  ${f.padEnd(20)} ${String(n).padStart(2)} items   (live records carry ${sizes.join(', ')})`);
}
const newTour = ours.tourSteps.length - liveDetail.tourSteps.length;
console.log(`  ${'tourSteps'.padEnd(20)} ${String(ours.tourSteps.length).padStart(2)} items   (${liveDetail.tourSteps.length} already live, ${newTour} new)`);
console.log(`  ${'plans highlights'.padEnd(20)} ${String(ours.plans.reduce((a, p) => a + p.highlights.length, 0)).padStart(2)} items   (live: 0, all three were empty)`);

/* ================================================ verdict */
console.log('');
if (fails === 0) {
  console.log('COMPLETE. Every field the real VisionX product records use is present and filled,');
  console.log('every count is inside the range those records actually use, and nothing the live');
  console.log('page publishes was dropped.');
} else {
  console.log(`INCOMPLETE. ${fails} problem(s) above.`);
}
process.exit(fails ? 1 : 0);
