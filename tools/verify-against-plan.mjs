#!/usr/bin/env node
// Every capability the content names must be a capability of the product as
// specified. The source of truth is content/plan/:
//
//   requirements-239.txt   the 239 numbered lines of the compliance matrix,
//                          read straight from the tender response document
//   ten-month-plan.txt     the delivery plan: 396 person-days, three people,
//                          ten months, and what is demonstrable at each point
//
// WHY THIS REPLACED THE OTHER CHECKER. An earlier tool compared the content
// against the state of one build and made the page say "Enterprise tier" and
// "scoped in the implementation plan" beside anything not finished yet. That
// was answering the wrong question twice over. Rafiul, twice:
//
//   "ki build korci ki kori nai oita dekle hobe nh full product ki aita
//    dekte hobe"
//   "main pdf and 10 phase full pdf dekle full product brif paiba"
//
// A product page describes the product. What is finished this week is a
// delivery question and belongs in a delivery conversation, not on a page a
// bank reads to find out what it is buying.
//
// So this asks one thing of every capability: is it in the matrix the bank
// itself wrote, or in the plan that answers it? A capability that is in
// neither is invented, and that is the only thing this refuses.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

const MATRIX = read('content/plan/requirements-239.txt');
const PLAN = read('content/plan/ten-month-plan.txt');
const SOURCE = (MATRIX + '\n' + PLAN).toLowerCase();

let fails = 0;
const bad = (m) => { console.log('  FAIL  ' + m); fails++; };

// capability named on the page -> the words that must appear in the tender
// documents for it to be a capability of this product. Several spellings are
// allowed because the matrix writes "dialler" and the page writes "dialer".
const CAPABILITIES = [
  ['Omnichannel: voice, email, chat, web, social', ['omni channel support: voice, email, chat, web']],
  ['500 concurrent agents and 1,000 IVR ports', ['500 concurrent agents and 1000 ivr ports']],
  ['Active-active across two data centres', ['active–active redundancy across data centers', 'two sites, failover']],
  ['Concurrent licensing', ['licensing should be concurrent']],
  ['Drag-and-drop call flow designer', ['drag-and-drop call flow designer', 'drag and drop flow designer']],
  ['SIP over TLS and SRTP media', ['sip and ip-based', 'srtp']],
  ['Skill-based routing and queues', ['skills routing with queues']],
  ['Callback', ['callback']],
  ['WebRTC softphone and hard phones', ['webrtc soft phones and hard phones']],
  ['Existing Cisco and Jabra handsets', ['cisco ip phone 8800 series']],
  ['Hold, transfer and conference', ['transfer', 'conference']],
  ['Screen pop', ['screen pop']],
  ['Wrap-up and reason codes', ['wrap-up and reason codes', 'wrap up code']],
  ['Call and screen recording', ['call and screen recording']],
  ['Recording retention and encryption', ['recording, encryption, retention', 'encryption, retention']],
  ['Listen, whisper and barge in', ['monitor, whisper, barge-in']],
  ['AI quality scoring, sentiment, keyword spotting', ['quality scoring, sentiment, keyword spotting']],
  ['Workforce forecasting, scheduling, adherence', ['forecasting, scheduling, adherence']],
  ['Predictive and preview dialling, 100 campaigns', ['predictive and preview dialling', '100 campaigns']],
  ['Wallboards', ['wallboard']],
  ['Reporting and BI export', ['reporting, dashboards, bi export']],
  ['Knowledge base', ['knowledge base']],
  ['CRM integration', ['crm']],
  ['WhatsApp, Messenger and the other digital channels', ['whatsapp', 'messenger']],
  ['Chatbot in Bangla and English', ['bangla']],
  ['Identity before data', ['tpin', 'whitelist']],
  ['MFA, TLS, SSO, retention', ['tls 1.3, srtp, mfa, sso, retention']],
  ['Monitoring and logging', ['monitoring, logging']],
  ['Administration through web consoles', ['web-based https consoles']],
  ['Hot configuration changes', ['hot configuration changes']],
];

console.log('\nIS EVERY CAPABILITY THE PAGE NAMES IN THE TENDER DOCUMENTS?\n');
for (const [name, needles] of CAPABILITIES) {
  const hit = needles.find((n) => SOURCE.includes(n));
  console.log(`  ${hit ? 'yes' : 'NO '}  ${name}`);
  if (!hit) bad(`"${name}" is on the page and in neither the matrix nor the plan`);
}

/* ---------------------------------------------- nothing invented */
console.log('\nIS ANYTHING ON THE PAGE INVENTED?\n');
const add = JSON.parse(read('content/additions.json'));
const sentences = [];
(function walk(v) {
  if (typeof v === 'string') sentences.push(v);
  else if (Array.isArray(v)) v.forEach(walk);
  else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => { if (k !== '_note') walk(x); });
})(add);

// Words that would be a capability claim with nothing behind it. Each must
// appear in the tender documents, or it is ours and invented.
const WATCH = ['predictive', 'whisper', 'barge', 'recording', 'forecast', 'adherence',
  'wallboard', 'power bi', 'knowledge base', 'softphone', 'conference', 'screen pop',
  'wrap-up', 'callback', 'whatsapp', 'crm', 'drag-and-drop'];
let checked = 0;
for (const w of WATCH) {
  const onPage = sentences.some((s) => s.toLowerCase().includes(w));
  if (!onPage) continue;
  checked++;
  // The matrix writes "soft phones" and "dialler"; the page writes
  // "softphone" and "dialer". Compare with the spaces and hyphens taken out,
  // or the tool reports a capability as invented because of a space.
  const flat = (x) => x.replace(/[\s-]/g, '');
  const inPlan = SOURCE.includes(w) || flat(SOURCE).includes(flat(w))
    || flat(SOURCE).includes(flat(w.replace('dialer', 'dialler')));
  console.log(`  ${inPlan ? 'in the plan' : 'INVENTED  '}  ${w}`);
  if (!inPlan) bad(`the page says "${w}" and the tender documents never do`);
}
console.log(`  ${checked} capability words on the page were checked`);

/* ---------------------------------------------- no build talk */
console.log('\nDOES THE PAGE TALK ABOUT WHAT IS FINISHED YET?\n');
// A product page describes the product. These phrases are delivery status and
// have no business on it, and the last tool put them there.
const BUILD_TALK = ['enterprise tier', 'scoped in the implementation plan',
  'not built', 'roadmap', 'coming soon', 'not yet', 'in progress', 'first release'];
let talk = 0;
for (const b of BUILD_TALK) {
  const hit = sentences.find((s) => s.toLowerCase().includes(b));
  if (hit) { talk++; bad(`delivery status on a product page: "${b}" in: ${hit.slice(0, 80)}`); }
}
if (!talk) console.log('  No. It describes the product, not the state of a build.');

/* ---------------------------------------------- the numbers */
console.log('\nTHE NUMBERS THE PAGE MAY QUOTE\n');
const NUMBERS = [['239 requirements', '239'], ['500 agents', '500 concurrent agents'],
  ['1,000 IVR ports', '1000 ivr ports'], ['ten months', 'ten months'],
  ['396 person-days', '396']];
for (const [label, needle] of NUMBERS) {
  const ok = SOURCE.includes(needle.toLowerCase());
  console.log(`  ${ok ? 'yes' : 'NO '}  ${label}`);
  if (!ok) bad(`${label} is not in the tender documents`);
}

console.log('');
console.log(fails === 0
  ? `TRUE TO THE PLAN. ${CAPABILITIES.length} capabilities trace to the matrix or the plan, nothing is invented, and the page carries no delivery status.`
  : `${fails} problem(s) above.`);
process.exit(fails ? 1 : 0);
