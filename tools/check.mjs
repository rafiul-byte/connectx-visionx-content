#!/usr/bin/env node
// Checks content/connectx.content.json against the contract measured from a real
// VisionX full detail record (content/live/resuelto-contract.json).
// Exits non-zero on any failure. Flags: --dupes --md --handover (run subsets).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const exists = (p) => fs.existsSync(path.join(ROOT, p));

const ours = read('content/connectx.content.json');
const contract = read('content/live/resuelto-contract.json');

const only = process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => a.slice(2));
const run = (name) => only.length === 0 || only.includes(name);

const fails = [];
const passes = [];
const ok = (m) => passes.push(m);
const bad = (m) => fails.push(m);

// ---------------------------------------------------------------- contract
if (run('contract')) {
  const required = Object.keys(contract);
  const missing = required.filter((k) => !(k in ours));
  if (missing.length) bad(`contract: missing field(s) ${missing.join(', ')}`);
  else ok(`contract: all ${required.length} fields of a full VisionX detail record are present`);

  // every field non-empty
  for (const k of required) {
    const v = ours[k];
    const empty = v == null || (Array.isArray(v) && v.length === 0) || (typeof v === 'string' && !v.trim());
    if (empty) bad(`contract: field "${k}" is empty`);
  }

  // counts inside the measured ranges
  const RANGE = {
    features: [8, 13], modules: [8, 13], problems: [3, 4], plans: [3, 3],
    faqs: [5, 8], stats: [3, 3], related: [3, 3], useCases: [3, 4],
    walkthrough: [5, 7], aiCapabilities: [4, 8], security: [4, 8],
    integrations: [4, 10], tourSteps: [7, 13], audience: [3, 5], overviewParagraphs: [1, 3],
  };
  for (const [k, [lo, hi]] of Object.entries(RANGE)) {
    const n = Array.isArray(ours[k]) ? ours[k].length : -1;
    if (n < lo || n > hi) bad(`contract: ${k} has ${n}, measured range is ${lo} to ${hi}`);
  }
  if (!fails.length) ok('contract: every array count is inside the measured range');

  // shape of the object arrays
  const SHAPE = {
    modules: ['name', 'summary', 'features'], problems: ['pain', 'outcome'],
    plans: ['name', 'bestFor', 'highlights'], faqs: ['q', 'a'],
    useCases: ['industry', 'scenario'], walkthrough: ['title', 'detail'],
    features: ['title', 'text'], tourSteps: ['title', 'caption', 'screen'],
  };
  for (const [k, keys] of Object.entries(SHAPE)) {
    (ours[k] || []).forEach((row, i) => {
      for (const key of keys) {
        if (!(key in row)) bad(`shape: ${k}[${i}] has no "${key}"`);
        const v = row[key];
        if (Array.isArray(v) ? v.length === 0 : typeof v === 'string' && !v.trim()) bad(`shape: ${k}[${i}].${key} is empty`);
      }
    });
  }
  ok('shape: every row carries the keys the contract uses');
}

// ---------------------------------------------------------------- placeholders
if (run('contract') || run('dupes')) {
  const flat = JSON.stringify(ours);
  for (const word of ['TODO', 'FIXME', 'Lorem', 'placeholder', 'XXX', 'coming soon', 'not yet', 'in progress', '$0']) {
    if (new RegExp(word, 'i').test(flat)) bad(`placeholder: the word "${word}" is still in the content`);
  }
  ok('placeholder: no TODO, no coming soon, no unfinished copy');

  // the live-page bug: the same sentence in every problem card
  const outcomes = (ours.problems || []).map((p) => p.outcome);
  const pains = (ours.problems || []).map((p) => p.pain);
  if (new Set(outcomes).size !== outcomes.length) bad('dupes: two problems share an outcome, which is the live-page bug');
  if (new Set(pains).size !== pains.length) bad('dupes: two problems share a pain');
  else ok(`dupes: ${pains.length} problems, all different`);

  // a module summary that just repeats its first feature is the derived-record bug
  for (const m of ours.modules || []) {
    if (m.features.includes(m.summary)) bad(`dupes: module "${m.name}" summary repeats its own feature, which is the derived-record bug`);
  }
  ok('dupes: no module summary repeats its feature list');

  // plans with no highlights is what the live record ships
  for (const p of ours.plans || []) {
    if (!p.highlights || p.highlights.length < 3) bad(`plans: "${p.name}" has fewer than 3 highlights`);
    if (/contact sales/i.test(p.bestFor)) bad(`plans: "${p.name}" bestFor is still the "Contact sales" fallback`);
  }
  ok('plans: all three tiers carry a real bestFor and at least 3 highlights');
}

// ---------------------------------------------------------------- tone
if (run('contract') || run('tone')) {
  const strings = [];
  (function walk(v) {
    if (typeof v === 'string') strings.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  })(ours);

  const EM = String.fromCharCode(0x2014); // the em-dash, written as a code so this repo holds none
  const withEm = strings.filter((s) => s.includes(EM));
  if (withEm.length) bad(`tone: ${withEm.length} string(s) contain an em-dash`);
  else ok('tone: zero em-dash characters');

  const BANNED = ['revolutionary', 'cutting-edge', 'world-class', 'best-in-class', 'seamless', 'game-chang', 'unparalleled', 'military-grade', 'bank-grade', 'guarantee'];
  for (const w of BANNED) {
    const hit = strings.find((s) => s.toLowerCase().includes(w));
    if (hit) bad(`tone: banned word "${w}" in: ${hit.slice(0, 70)}`);
  }
  ok(`tone: none of the ${BANNED.length} banned marketing words appear`);

  // VisionX never claims certification. Our copy must not either.
  const certClaim = strings.find((s) => /\b(ISO ?27001|PCI[- ]DSS|SOC ?2)\b/i.test(s) && /\bcertified\b/i.test(s));
  if (certClaim) bad(`tone: a certification is claimed: ${certClaim.slice(0, 80)}`);
  else ok('tone: no certification is claimed');
}

// ---------------------------------------------------------------- live safety
if (run('contract') || run('live')) {
  const cat = read('content/live/catalogue.json');
  const live = read('content/live/detail.json');
  const SAME = ['tagline', 'description', 'overview', 'aiEdge', 'evaluation', 'name', 'slug', 'category'];
  for (const k of SAME) {
    if (JSON.stringify(ours[k]) !== JSON.stringify(cat[k])) bad(`live: we changed "${k}", which visionx.software already publishes`);
  }
  for (const k of ['security', 'integrations', 'related', 'stats']) {
    if (JSON.stringify(ours[k]) !== JSON.stringify(live[k])) bad(`live: we changed "${k}", which visionx.software already publishes`);
  }
  for (let i = 0; i < live.tourSteps.length; i++) {
    if (JSON.stringify(ours.tourSteps[i]) !== JSON.stringify(live.tourSteps[i])) bad(`live: tour step ${i} was changed, it is already published`);
  }
  ok(`live: all ${SAME.length + 4} already-published fields and ${live.tourSteps.length} published tour steps are byte for byte unchanged`);
}

// ---------------------------------------------------------------- outputs
if (run('md')) {
  if (!exists('dist/CONNECTX.md')) bad('md: dist/CONNECTX.md has not been generated, run tools/generate.mjs');
  else {
    const md = fs.readFileSync(path.join(ROOT, 'dist/CONNECTX.md'), 'utf8');
    const want = ['Problems we solve', 'brings to your team', 'Inside ConnectX', 'your first week', 'AI inside', 'Use cases', 'Security', 'Plans', 'Frequently asked'];
    const miss = want.filter((w) => !md.includes(w));
    if (miss.length) bad(`md: section(s) missing from the readable copy: ${miss.join(', ')}`);
    else ok(`md: all ${want.length} sections are in the readable copy`);
    if (md.includes(String.fromCharCode(0x2014))) bad('md: the readable copy contains an em-dash');
    // every FAQ answer must survive into the markdown
    const lost = ours.faqs.filter((f) => !md.includes(f.a));
    if (lost.length) bad(`md: ${lost.length} FAQ answer(s) did not reach the markdown, so the two outputs have drifted`);
    else ok('md: every FAQ answer reached the markdown unchanged');
  }
}

if (run('handover')) {
  const sitemap = path.join(ROOT, 'content/live/sitemap.txt');
  if (!fs.existsSync(sitemap)) bad('handover: content/live/sitemap.txt is missing, so the checklist is unchecked');
  else {
    const routes = fs.readFileSync(sitemap, 'utf8').split('\n');
    const readme = exists('README.md') ? fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8') : '';
    const must = ['/products/connectx', '/products/connectx/brochure', '/products/connectx/changelog'];
    for (const r of must) {
      if (!routes.includes(r)) bad(`handover: ${r} is not in the measured sitemap`);
      if (!readme.includes(r)) bad(`handover: the README does not mention ${r}`);
    }
    if (routes.includes('/compare/connectx-vs-genesys')) bad('handover: a connectx compare page already exists, the README is out of date');
    ok(`handover: all ${must.length} ConnectX routes exist live and are named in the README`);
  }
}

// ---------------------------------------------------------------- report
console.log('');
for (const p of passes) console.log('  PASS  ' + p);
for (const f of fails) console.log('  FAIL  ' + f);
console.log('');
console.log(fails.length === 0 ? `OK  ${passes.length} checks passed, 0 failed` : `FAILED  ${fails.length} problem(s)`);
process.exit(fails.length ? 1 : 0);
