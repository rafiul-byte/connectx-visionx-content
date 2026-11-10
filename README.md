# ConnectX product content for visionx.software

Product content for `https://visionx.software/products/connectx`, plus a
drop-in record a developer can paste into the site and a preview anyone can
open in a browser.

**Nothing here changes the site.** One file is handed over. One person decides
whether to use it.

---

## The product

ConnectX is an AI contact centre platform for banks. Telephony, IVR,
self-service, routing, the agent desktop, supervisor tooling, recording,
omnichannel, reporting, workforce management and outbound dialling ship as one
platform, with one admin console and one database, and the AI agent sits in the
core rather than in front of it.

Nine modules, one licence:

```
01 AI Virtual Agent        02 IVR & Self-Service     03 ACD & Routing
04 Agent Desktop & CTI     05 Supervisor & Quality   06 Omnichannel & Knowledge
07 Reporting & Wallboards  08 Workforce & Dialer     09 Platform & Security
```

It answers in Bangla and English, and in the two mixed in one conversation. It
answers only from approved content and connected systems. It checks identity
against a five-tier policy your risk team reads and edits as a table, and hands
the conversation to an agent with full context when a request is sensitive.

Deployment is customer-managed, on infrastructure the bank controls.

---

## What to copy

```
dist/connectx.detail.ts
```

One file. It exports `connectxDetail`, typed, and it type-checks under
`--strict`.

**Where it goes:** the per-product detail map that `/products/:slug` merges
over the catalogue entry. In the published bundle that is the object holding
the `omnireach`, `omnipost`, `crawlgpt` and `resuelto` records. Add a
`connectx` key to it with this record.

No other site change is needed. Checked against the live sitemap:

| Place | State |
|---|---|
| `/products/connectx` | live, renders from the record |
| `/products/connectx/brochure` | live |
| `/products/connectx/changelog` | live, v1.0.0 |
| Footer Products column | already lists ConnectX |
| Demo form, "Products of interest" | already lists ConnectX |
| `/products` listing and home grid | already include it |
| `/compare/connectx-vs-...` | does not exist. Optional, and a separate decision |

---

## What is in the record

| Field | Where it came from |
|---|---|
| `tagline` `description` `overview` `aiEdge` `evaluation` `features` `workflow` `audience` | copied byte for byte from the live catalogue entry |
| `security` `integrations` `related` `stats` | copied byte for byte from the live detail record |
| `tourSteps[0..2]` | the three published tour steps, unchanged |
| `overviewParagraphs` `problems` `aiCapabilities` `useCases` `walkthrough` `faqs` | written for this record |
| `modules` `plans` | written for this record |
| `tourSteps[3..6]` | written for this record: identity policy, service level, omnichannel queue, value board |

**Nothing the live page already publishes was changed.** `tools/check.mjs`
proves it and fails the build on any edit to those fields.

---

## To read it without code

```
dist/CONNECTX.md
```

The same content in plain language. It is generated from the same file as the
TypeScript, so the two cannot disagree.

## To see it

```bash
cd preview
npm install
npm run build
npm run preview
```

Then open `http://localhost:4317`.

The preview uses VisionX's own colour tokens, fonts and section order, read
from the live site. **It is not pixel-identical**, because VisionX's own
components are not published. It is here so the content and the order can be
read and approved, which is what is being approved.

---

## To change the content

Edit `content/additions.json`, then:

```bash
node tools/compose.mjs              # merge the live fields with ours
node tools/generate.mjs             # write the TypeScript and the markdown
node tools/check.mjs                # contract, tone, duplicates, live safety
node tools/verify-against-live.mjs  # completeness against the real records
cd preview && npm run build
```

`tools/check.mjs` fails on a missing field, an empty value, a count outside the
range the real VisionX records use, a duplicated problem, a plan with no
highlights, an em-dash, a banned marketing word, a claimed certification, or
any edit to a field visionx.software already publishes.

`tools/verify-against-live.mjs` compares the record against the four full
VisionX records (omnireach, omnipost, crawlgpt, resuelto) field by field, and
against the live ConnectX page string by string. It fails if a field those four
all carry is missing, if a count falls below what every one of them uses, or if
a sentence the live page publishes was dropped.

Two fields are absent on purpose:

| Field | Why |
|---|---|
| `plansUrl` | points at a product's own app domain, for example `omnireach.xyz/pricing`. ConnectX has no app subdomain |
| `resources` | brochure, video and tour files on that same app domain. The ConnectX brochure already lives at `/products/connectx/brochure` |

Only 1 of the 4 live records uses either one.

---

## Two notes for the reviewer

1. **Category reads "Collaboration".** A contact centre platform under
   Collaboration is odd, but the site taxonomy is not ours to change, so the
   record leaves it alone.
2. **The AI note says "Connect your own Claude or Gemini API key in Settings
   and pay your provider directly."** That is the VisionX house line, already
   live. For a customer-managed bank deployment it may need a different
   sentence. The record leaves it exactly as published.

---

ConnectX is a product of SmartData Technologies Limited, a Lavisho Group
company, Dhaka. visionx.software is operated by VisionX LLC.
