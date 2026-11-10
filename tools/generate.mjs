#!/usr/bin/env node
// One source, two outputs. Both are generated, so they cannot drift.
//   dist/connectx.detail.ts  the drop-in record for the VisionX codebase
//   dist/CONNECTX.md         the same content in plain language, for the MD

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const c = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/connectx.content.json'), 'utf8'));
fs.mkdirSync(path.join(ROOT, 'dist'), { recursive: true });

// ---------------------------------------------------------------- TypeScript
const ts = `// ConnectX product detail record for visionx.software
// Generated from connect-x/content/connectx.content.json. Do not edit by hand.
// Generated ${new Date().toISOString().slice(0, 10)}.
//
// Where this goes: the per-product detail map that /products/:slug merges over
// the catalogue entry. In the published bundle that is the object holding the
// omnireach, omnipost, crawlgpt and resuelto records. Add "connectx" to it.
//
// The fields below that visionx.software already publishes are reproduced byte
// for byte: tagline, description, overview, aiEdge, evaluation, features,
// audience, security, integrations, related, stats and the first three tour
// steps. Everything else is new, and replaces a template fallback.

export interface ProductModule { name: string; summary: string; features: string[] }
export interface ProductProblem { pain: string; outcome: string }
export interface ProductFeature { title: string; text: string }
export interface ProductPlan { name: string; bestFor: string; highlights: string[] }
export interface ProductFaq { q: string; a: string }
export interface ProductUseCase { industry: string; scenario: string }
export interface ProductWalkthroughStep { title: string; detail: string }
export interface ProductTourScreen {
  description: string;
  layout: string;
  heading: string;
  sidebar: string[];
  columns: string[];
  rows: string[][];
  metrics: { label: string; value: string }[];
}
export interface ProductTourStep { title: string; caption: string; screen: ProductTourScreen }

export interface ProductDetail {
  tagline: string;
  description: string;
  overview: string;
  overviewParagraphs: string[];
  problems: ProductProblem[];
  features: ProductFeature[];
  modules: ProductModule[];
  aiEdge: string;
  aiCapabilities: string[];
  tourSteps: ProductTourStep[];
  walkthrough: ProductWalkthroughStep[];
  useCases: ProductUseCase[];
  audience: string[];
  security: string[];
  integrations: string[];
  plans: ProductPlan[];
  faqs: ProductFaq[];
  stats: string[];
  related: string[];
  evaluation: string;
}

export const connectxDetail: ProductDetail = ${JSON.stringify(
  Object.fromEntries(Object.entries(c).filter(([k]) => !['slug', 'name', 'category'].includes(k))),
  null,
  2,
)};

export default connectxDetail;
`;
fs.writeFileSync(path.join(ROOT, 'dist/connectx.detail.ts'), ts);

// ---------------------------------------------------------------- Markdown
const L = [];
const p = (s = '') => L.push(s);

p(`# ${c.name}`);
p();
p(`**${c.tagline}**`);
p();
p(`Category on the site: ${c.category}. Slug: \`${c.slug}\`.`);
p();
p('This is the full content for `https://visionx.software/products/connectx`.');
p('It is generated from one file, so this document and the code record always say the same thing.');
p();
p('## Overview');
p();
for (const para of c.overviewParagraphs) { p(para); p(); }
p('## Problems we solve');
p();
for (const x of c.problems) p(`- **${x.pain}.** ${x.outcome}`);
p();
p(`## What ${c.name} brings to your team`);
p();
for (const m of c.modules) p(`- **${m.name}.** ${m.summary} *(${m.features.join(', ')})*`);
p();
p('## AI inside');
p();
p(c.aiEdge);
p();
for (const a of c.aiCapabilities) p(`- ${a}`);
p();
p(`## Inside ${c.name}: the product tour`);
p();
for (const [i, t] of c.tourSteps.entries()) p(`${i + 1}. **${t.title}.** ${t.caption}`);
p();
p('## How it works: your first week');
p();
for (const [i, w] of c.walkthrough.entries()) p(`${i + 1}. **${w.title}.** ${w.detail}`);
p();
p('## Use cases by industry');
p();
for (const u of c.useCases) p(`- **${u.industry}.** ${u.scenario}`);
p();
p('## Security and compliance');
p();
for (const s of c.security) p(`- ${s}`);
p();
p('## Integrations');
p();
p(c.integrations.join(', ') + '.');
p();
p('## Plans');
p();
for (const pl of c.plans) {
  p(`### ${pl.name}`);
  p();
  p(`*${pl.bestFor}*`);
  p();
  for (const h of pl.highlights) p(`- ${h}`);
  p();
}
p('Pricing on the page stays as published: concurrent-agent licensing, customer-managed deployment, contact sales.');
p();
p('## Frequently asked questions');
p();
for (const f of c.faqs) { p(`**${f.q}**`); p(); p(f.a); p(); }
p('## Plan your deployment');
p();
p(c.evaluation);
p();
p('## Page furniture');
p();
p(`- Hero chips: ${c.stats.join(', ')}`);
p(`- Audience: ${c.audience.join(', ')}`);
p(`- Related products: ${c.related.join(', ')}`);
p();

fs.writeFileSync(path.join(ROOT, 'dist/CONNECTX.md'), L.join('\n'));

const tsSize = fs.statSync(path.join(ROOT, 'dist/connectx.detail.ts')).size;
const mdSize = fs.statSync(path.join(ROOT, 'dist/CONNECTX.md')).size;
console.log(`generated  dist/connectx.detail.ts ${tsSize} bytes   dist/CONNECTX.md ${mdSize} bytes`);
