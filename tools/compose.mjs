#!/usr/bin/env node
// Builds content/connectx.content.json from:
//   content/live/catalogue.json  (what visionx.software already publishes, thin record)
//   content/live/detail.json     (what it already publishes, detail record)
//   content/additions.json       (the fields we wrote)
// Rule: a field that is already live and good is copied byte for byte.
// We only add what is missing, and replace the two fields that are derived badly.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

const cat = read('content/live/catalogue.json');
const live = read('content/live/detail.json');
const add = read('content/additions.json');

// Fields kept exactly as VisionX already publishes them.
const KEEP_FROM_CATALOGUE = ['slug', 'name', 'category', 'tagline', 'description', 'overview', 'aiEdge', 'features', 'workflow', 'audience', 'evaluation'];
const KEEP_FROM_LIVE = ['security', 'integrations', 'related', 'stats'];

const out = {};
for (const k of KEEP_FROM_CATALOGUE) out[k] = cat[k];
for (const k of KEEP_FROM_LIVE) out[k] = live[k];

// Fields we supply because the live record does not have them.
out.overviewParagraphs = add.overviewParagraphs;
out.problems = add.problems;
out.aiCapabilities = add.aiCapabilities;
out.useCases = add.useCases;
out.walkthrough = add.walkthrough;
out.faqs = add.faqs;

// Fields the live record has, but derived badly. Replaced, and the old value kept as evidence.
out.modules = add.modules;              // live: name/summary both copied from features[].text
out.plans = add.plans;                  // live: all three "Contact sales", highlights []

// Tour: the three live steps stay exactly as published, ours are appended.
out.tourSteps = [...live.tourSteps, ...add.extraTourSteps];

const ORDER = ['slug', 'name', 'category', 'tagline', 'description', 'overview', 'overviewParagraphs',
  'problems', 'features', 'modules', 'aiEdge', 'aiCapabilities', 'tourSteps', 'workflow', 'walkthrough',
  'useCases', 'audience', 'security', 'integrations', 'plans', 'faqs', 'stats', 'related', 'evaluation'];
const ordered = {};
for (const k of ORDER) if (k in out) ordered[k] = out[k];

fs.writeFileSync(path.join(ROOT, 'content/connectx.content.json'), JSON.stringify(ordered, null, 2) + '\n');

const replaced = ['modules', 'plans'];
const added = ['overviewParagraphs', 'problems', 'aiCapabilities', 'useCases', 'walkthrough', 'faqs'];
console.log(`composed  fields=${Object.keys(ordered).length}  kept=${KEEP_FROM_CATALOGUE.length + KEEP_FROM_LIVE.length}  added=${added.length}  replaced=${replaced.length}`);
console.log(`  kept     : ${[...KEEP_FROM_CATALOGUE, ...KEEP_FROM_LIVE].join(', ')}`);
console.log(`  added    : ${added.join(', ')}`);
console.log(`  replaced : ${replaced.join(', ')}`);
console.log(`  tourSteps: ${live.tourSteps.length} live + ${add.extraTourSteps.length} new = ${out.tourSteps.length}`);
