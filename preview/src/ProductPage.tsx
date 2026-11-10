// A preview of /products/connectx.
//
// The markup below reproduces the live VisionX product page: the same section
// order, the same wrappers, the same Tailwind utility classes and the same
// token names, read from the live DOM on 10 November 2026 and saved in
// ../../content/live/. The content comes from the one content file, so what is
// read here is exactly what the drop-in record carries.

import { useState } from 'react';
import content from '../../content/connectx.content.json';
import {
  Check, ChevronDown, ChevronRight, ArrowRight, ArrowLeft,
  Maximize2, Menu, Download,
} from 'lucide-react';

type Metric = { label: string; value: string };
type Screen = {
  description: string; layout: string; heading: string;
  sidebar: string[]; columns: string[]; rows: string[][]; metrics: Metric[];
};
type Tour = { title: string; caption: string; screen: Screen };

const c = content;
const tour = c.tourSteps as Tour[];

const TABS = [
  ['Overview', 'overview'], ['Features', 'features'], ['Tour', 'tour'],
  ['Walkthrough', 'walkthrough'], ['Use cases', 'use-cases'], ['Security', 'security'],
  ['Plans', 'plans'], ['FAQ', 'faq'], ['Demo', 'demo'],
] as const;

const BTN = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors h-9 px-4 py-2';
const BTN_PRIMARY = `${BTN} bg-primary text-primary-foreground shadow hover:bg-primary/90`;
const BTN_OUTLINE = `${BTN} border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground`;
const BTN_GHOST = `${BTN} hover:bg-accent hover:text-accent-foreground`;

/* ------------------------------------------------------------ mock screen */
function MockScreen({ screen }: { screen: Screen }) {
  return (
    <div className="mock-screen min-w-0 overflow-hidden rounded-lg border border-border bg-background">
      <div className="flex h-10 items-center gap-1.5 border-b border-border bg-secondary px-4">
        <span className="h-2 w-2 rounded-full bg-muted-foreground/50" />
        <span className="h-2 w-2 rounded-full bg-accent/60" />
        <span className="h-2 w-2 rounded-full bg-primary/70" />
        <span className="ml-auto text-[10px] text-muted-foreground">{c.name} &middot; Sample workspace</span>
      </div>
      <div className="flex min-h-80">
        <aside className="hidden w-36 shrink-0 border-r border-border bg-card p-3 sm:block">
          <div className="mb-6 flex items-center gap-2 text-sm font-bold">{c.name}</div>
          {screen.sidebar.map((s, i) => (
            <div key={s} className={`mb-2 flex items-start gap-2 rounded-md p-2 text-[10px] ${i === 0 ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>{s}</div>
          ))}
        </aside>
        <div className="min-w-0 flex-1 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold">{screen.heading}</span>
            <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] text-accent">Workspace</span>
          </div>
          <div className="my-5 grid grid-cols-3 gap-2">
            {screen.metrics.map((m) => (
              <div key={m.label} className="rounded-md border border-border bg-card px-3 py-2">
                <p className="text-[10px] text-muted-foreground">{m.label}</p>
                <p className="mt-0.5 text-sm font-semibold text-primary">{m.value}</p>
              </div>
            ))}
          </div>
          <div className="mb-4 grid grid-cols-[1fr_1.3fr] gap-3 border border-border p-3">
            <div className="space-y-2">
              {screen.rows.map((r) => (
                <p key={r[0]} className="truncate text-[11px] text-muted-foreground">{r[0]}</p>
              ))}
            </div>
            <div className="min-w-0 border-l border-border pl-3">
              <p className="truncate text-[11px] font-semibold">{screen.rows[0][0]}</p>
              <p className="mt-1 truncate text-[10px] text-accent">{screen.rows[0][2]}</p>
              <p className="mt-2 truncate text-[10px] text-muted-foreground">{screen.rows[0][1]}</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-md border border-border">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-card text-muted-foreground">
                <tr>{screen.columns.map((col) => <th key={col} className="px-3 py-2 font-medium">{col}</th>)}</tr>
              </thead>
              <tbody>
                {screen.rows.map((r, i) => (
                  <tr key={i} className="border-t border-border">
                    {r.map((cell, j) => (
                      <td key={j} className={`px-3 py-2 ${j === r.length - 1 ? 'text-accent' : ''}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[10px] text-muted-foreground">{screen.description}</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- page */
export default function ProductPage() {
  const [step, setStep] = useState(0);
  const [tab, setTab] = useState(0);
  const [openModule, setOpenModule] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [related, setRelated] = useState(0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ------------------------------------------------------- header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-2 px-3 sm:px-6">
          <a className="flex min-w-0 items-center gap-2" href="#overview">
            <span className="truncate text-base font-bold sm:text-lg">
              visionx<span className="text-primary">.software</span>
            </span>
          </a>
          <nav className="hidden min-w-0 items-center gap-4 text-sm text-muted-foreground xl:ml-6 xl:flex">
            <span className="px-4 py-2 font-semibold uppercase">Products</span>
            {['Company', 'Blog', 'Resources', 'Changelog', 'Contact'].map((x) => (
              <a key={x} className="transition-colors hover:text-foreground" href="#overview">{x}</a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            <button className="hidden h-8 items-center rounded-md border border-input bg-background px-3 text-xs shadow-sm xl:inline-flex">App sign-in</button>
            <a className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground sm:inline-block" href="#demo">Talk to Sales</a>
            <button className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md hover:bg-accent xl:hidden"><Menu className="h-4 w-4" /></button>
          </div>
        </div>
      </header>

      <main>
        {/* ----------------------------------------------------- 0. hero */}
        <section id="overview" className="product-section border-b border-border">
          <div className="mx-auto max-w-7xl px-6 pb-16 pt-10">
            <a className="inline-flex items-center gap-2 text-sm text-muted-foreground" href="#overview">
              <ArrowLeft className="h-4 w-4" /> All products
            </a>
            <div className="mt-9 grid min-w-0 items-center gap-10 lg:grid-cols-2">
              <div>
                <span className="rounded-full border border-border px-3 py-1 text-xs text-accent">{c.category}</span>
                <h1 className="mt-5 break-words text-5xl font-bold md:text-6xl">{c.name}</h1>
                <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-semibold text-primary">Updated November 2026</span>
                  <span>by VisionX Software &middot; v1.0.0</span>
                </p>
                <p className="mt-4 text-2xl font-medium text-accent">{c.tagline}</p>
                <div className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  {c.overviewParagraphs.map((p, i) => <p key={i}>{p}</p>)}
                </div>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a className={BTN_PRIMARY} href="#demo">Request a demo</a>
                  <a className={BTN_OUTLINE} href="#tour">Take the product tour</a>
                  <a className={BTN_GHOST} href="#overview"><Download className="h-4 w-4" /> View brochure</a>
                </div>
              </div>
              <div className="min-w-0">
                <MockScreen screen={tour[0].screen} />
                <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                  {c.stats.map((s) => (
                    <span key={s} className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-accent" />{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ sticky tab bar */}
        <nav className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2">
            {TABS.map(([label, id], i) => (
              <a
                key={id}
                href={`#${id}`}
                className={`inline-flex h-8 shrink-0 items-center justify-center whitespace-nowrap rounded-md px-3 text-xs font-medium transition-colors ${i === 0 ? 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80' : 'hover:bg-accent hover:text-accent-foreground'}`}
              >
                {label}
              </a>
            ))}
          </div>
        </nav>

        {/* ------------------------------------------- 1. problems we solve */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-3xl font-bold">Problems we solve</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {c.problems.map((p) => (
              <div key={p.pain} className="rounded-lg border border-border bg-card p-6">
                <p className="text-sm text-muted-foreground">{p.pain}</p>
                <ArrowRight className="my-3 h-4 w-4 text-primary" />
                <p className="font-medium">{p.outcome}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------- 2. modules */}
        <section id="features" className="product-section border-y border-border bg-card/30">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <p className="text-xs uppercase text-accent">Purpose-built modules</p>
            <h2 className="mt-3 text-3xl font-bold">What {c.name} brings to your team</h2>
            <div className="mt-8 grid items-start gap-5 md:grid-cols-2">
              {c.modules.map((m, i) => (
                <div key={m.name} className="rounded-lg border border-border bg-card px-6">
                  <button
                    onClick={() => setOpenModule(openModule === i ? null : i)}
                    className="flex w-full flex-1 items-start justify-between gap-3 py-6 text-left"
                  >
                    <div className="text-left">
                      <h3 className="text-lg font-bold">{m.name}</h3>
                      <p className="mt-2 text-sm font-normal leading-relaxed text-muted-foreground">{m.summary}</p>
                    </div>
                    <ChevronDown className={`mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform ${openModule === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openModule === i && (
                    <ul className="grid gap-2 pb-6 text-sm">
                      {m.features.map((f) => (
                        <li key={f} className="flex gap-2 text-muted-foreground">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- 3. tour */}
        <section id="tour" className="product-section mx-auto max-w-7xl px-6 py-16">
          <p className="text-xs uppercase text-accent">Interactive product tour</p>
          <h2 className="mt-3 text-3xl font-bold">Inside {c.name}</h2>
          <div className="mt-8">
            <div className="grid min-w-0 gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
              <div>
                <ol className="grid gap-2">
                  {tour.map((t, i) => (
                    <li key={t.title}>
                      <button
                        onClick={() => setStep(i)}
                        className={`inline-flex h-auto w-full items-center justify-start gap-3 whitespace-normal rounded-md px-4 py-3 text-left text-sm font-medium transition-colors ${i === step ? 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80' : 'hover:bg-accent hover:text-accent-foreground'}`}
                      >
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${i === step ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}>{i + 1}</span>
                        <span>{t.title}</span>
                      </button>
                    </li>
                  ))}
                </ol>
                <label className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
                  Autoplay
                  <span className="inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent bg-input shadow-sm">
                    <span className="block h-4 w-4 rounded-full bg-background shadow-lg" />
                  </span>
                </label>
              </div>
              <div className="min-w-0">
                <MockScreen screen={tour[step].screen} />
                <div className="mt-5 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-accent">{step + 1} / {tour.length}</p>
                    <h3 className="mt-2 text-xl font-semibold">{tour[step].title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{tour[step].caption}</p>
                  </div>
                  <button className={`${BTN_OUTLINE} w-9 px-0`}><Maximize2 className="h-4 w-4" /></button>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <button onClick={() => setStep(Math.max(0, step - 1))} className={BTN_OUTLINE}>Back</button>
                  <div className="flex gap-1.5">
                    {tour.map((t, i) => (
                      <button key={t.title} onClick={() => setStep(i)} className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent">
                        <span className={`h-2 w-2 rounded-full ${i === step ? 'bg-primary' : 'bg-muted-foreground/40'}`} />
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setStep(Math.min(tour.length - 1, step + 1))} className={BTN_PRIMARY}>Next</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------- 4. first week */}
        <section id="walkthrough" className="product-section border-y border-border bg-card/30">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <h2 className="text-3xl font-bold">How it works: your first week</h2>
            <ol className="mt-10 max-w-3xl">
              {c.walkthrough.map((w, i) => (
                <li key={w.title} className="relative ml-5 border-l border-border pb-9 pl-10 last:border-l-0">
                  <span className="absolute -left-5 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-background text-sm font-semibold text-primary">{i + 1}</span>
                  <h3 className="text-xl font-semibold">{w.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{w.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------------------------ 5. AI inside */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="mt-4 text-3xl font-bold">AI inside</h2>
          <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">{c.aiEdge}</p>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {c.aiCapabilities.map((a) => (
              <li key={a} className="flex gap-3 text-muted-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{a}
              </li>
            ))}
          </ul>
          <p className="mt-6 border-l-2 border-accent pl-4 text-sm text-muted-foreground">
            Sensitive decisions stay under human approval. AI-generated outputs should be reviewed
            before business, security or compliance decisions.
          </p>
        </section>

        {/* ----------------------------------------------- 6. use cases */}
        <section id="use-cases" className="product-section border-y border-border bg-card/30">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <h2 className="text-3xl font-bold">Use cases by industry</h2>
            <div className="mt-8">
              <div className="inline-flex h-auto w-full flex-wrap items-center justify-start gap-1 rounded-lg bg-transparent p-0 text-muted-foreground">
                {c.useCases.map((u, i) => (
                  <button
                    key={u.industry}
                    onClick={() => setTab(i)}
                    className={`inline-flex items-center justify-center whitespace-normal rounded-md border border-border px-4 py-3 text-left text-sm font-medium transition-all ${i === tab ? 'border-primary bg-background text-primary shadow' : ''}`}
                  >
                    {u.industry}
                  </button>
                ))}
              </div>
              <div className="mt-2 pt-7">
                <h3 className="text-xl font-semibold">{c.useCases[tab].industry}</h3>
                <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">{c.useCases[tab].scenario}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ 7. security */}
        <section id="security" className="product-section mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mt-4 text-3xl font-bold">Security &amp; compliance</h2>
              <ul className="mt-6 space-y-4">
                {c.security.map((s) => (
                  <li key={s} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-bold">Integrations</h2>
              <div className="mt-6 flex flex-wrap gap-3">
                {c.integrations.map((i) => (
                  <span key={i} className="rounded-md border border-border bg-card px-4 py-3 text-sm font-semibold">{i}</span>
                ))}
              </div>
              <h3 className="mt-8 font-semibold">Plan your deployment</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.evaluation}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a className={BTN_OUTLINE} href="#overview">Trust &amp; Security</a>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------- 8. pricing */}
        <section id="plans" className="product-section border-y border-border bg-card/30">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <h2 className="text-3xl font-bold">Pricing</h2>
            <p className="mt-3 text-muted-foreground">
              Concurrent-agent licensing and customer-managed deployment for {c.name}.{' '}
              <a className="text-primary underline" href="#plans">See all pricing</a>
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {c.plans.map((p, i) => (
                <div key={p.name} className="flex flex-col rounded-lg border border-border bg-card p-6">
                  <h3 className="text-xl font-bold">{p.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.bestFor}</p>
                  <p className="mt-6 text-sm font-semibold">{i === 0 ? 'Includes:' : `Everything in ${c.plans[i - 1].name}, plus:`}</p>
                  <ul className="mt-3 flex-1 space-y-2.5 text-sm">
                    {p.highlights.filter((h) => !h.startsWith('Everything in')).map((h) => (
                      <li key={h} className="flex gap-2 text-muted-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{h}
                      </li>
                    ))}
                  </ul>
                  <a className={`${BTN_OUTLINE} mt-6`} href="#demo">Contact sales</a>
                </div>
              ))}
            </div>
            <p className="mt-6 text-muted-foreground">
              Contact sales for {c.name} pricing, concurrent-agent licensing and deployment options.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              AI features use your own Claude or Gemini API key; AI usage is billed by your AI provider.
            </p>
          </div>
        </section>

        {/* -------------------------------------------- 9. early access */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-lg border border-primary/40 bg-card p-8">
            <p className="text-xs uppercase text-accent">Early access program</p>
            <h2 className="mt-3 text-3xl font-bold">Pilot {c.name} with our team</h2>
            <p className="mt-4 max-w-3xl text-muted-foreground">
              We are inviting companies to pilot {c.name}. Early access partners get hands-on
              onboarding help, a direct line to the product team and a say in what we build next.
            </p>
            <a className={`${BTN_PRIMARY} mt-6`} href="#demo">Apply for early access</a>
          </div>
        </section>

        {/* ----------------------------------------------- 10. changelog */}
        <section className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="text-3xl font-bold">What&apos;s new</h2>
          <div className="mt-8 space-y-4">
            <article className="rounded-lg border border-border bg-card p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="font-mono text-sm font-semibold">v1.0.0</span>
                <span className="rounded-full border border-primary/40 px-2.5 py-0.5 text-xs capitalize text-primary">major</span>
                <time className="text-sm text-muted-foreground">November 10, 2026</time>
              </div>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
                <li>{c.name} added to the VisionX product catalog; product version to be confirmed during evaluation</li>
              </ul>
            </article>
          </div>
          <a className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary" href="#overview">
            View full changelog <ArrowRight className="h-4 w-4" />
          </a>
        </section>

        {/* ----------------------------------------------------- 11. FAQ */}
        <section id="faq" className="product-section mx-auto max-w-4xl px-6 py-16">
          <h2 className="text-3xl font-bold">Frequently asked questions</h2>
          <div className="mt-8">
            {c.faqs.map((f, i) => (
              <div key={f.q} className="border-b border-border">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full flex-1 items-center justify-between py-4 text-left text-base font-medium transition-all hover:underline"
                >
                  {f.q}
                  <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <p className="pb-4 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------- 12. demo */}
        <section id="demo" className="product-section border-y border-border bg-card/30">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1fr_1.5fr]">
            <div>
              <p className="text-xs uppercase text-accent">Demo request</p>
              <h2 className="mt-3 text-3xl font-bold">See {c.name} in action.</h2>
              <p className="mt-4 text-muted-foreground">
                Tell us what your team needs. We reply within 1 business day to discuss the right next step.
              </p>
              <a className={`${BTN_OUTLINE} mt-6`} href="#demo">Contact sales <ArrowRight className="h-4 w-4" /></a>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {['Full name *', 'Work email *', 'Company *', 'Job title *', 'Phone (optional)', 'Country *'].map((label) => (
                <div key={label}>
                  <label className="text-sm text-muted-foreground">{label}</label>
                  <div className="mt-2 h-10 rounded-md border border-input bg-background" />
                </div>
              ))}
              <p className="text-xs text-muted-foreground sm:col-span-2">
                The live site renders the shared demo form here. It already lists {c.name} under
                &quot;Products of interest&quot;, so nothing has to change in it.
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------- 13. related */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">Related products</h2>
            <div className="flex gap-2">
              <button onClick={() => setRelated((related + c.related.length - 1) % c.related.length)} className={`${BTN_OUTLINE} w-9 px-0`}><ArrowLeft className="h-4 w-4" /></button>
              <button onClick={() => setRelated((related + 1) % c.related.length)} className={`${BTN_OUTLINE} w-9 px-0`}><ArrowRight className="h-4 w-4" /></button>
            </div>
          </div>
          <a className="mt-6 flex items-start gap-5 rounded-lg border border-border bg-card p-6" href="#overview">
            <div>
              <h3 className="text-xl font-bold capitalize">{c.related[related]}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                A VisionX product listed beside {c.name} on the live page.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm text-primary">
                Explore product <ChevronRight className="h-4 w-4" />
              </span>
            </div>
          </a>
          <p className="mt-3 text-xs text-muted-foreground">{related + 1} / {c.related.length}</p>
        </section>
      </main>

      {/* -------------------------------------------------------- footer */}
      <footer className="border-t border-border">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 text-sm text-muted-foreground md:grid-cols-5">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 font-bold text-foreground">visionx<span className="text-primary">.software</span></div>
            <p className="mt-3">An AI-first software house building independent SaaS products for modern businesses.</p>
          </div>
          <div>
            <div className="mb-3 font-semibold text-foreground">App sign-in</div>
          </div>
          <div className="md:col-span-2">
            <div className="mb-3 font-semibold text-foreground">Products</div>
            <div className="grid grid-cols-2 gap-2">
              {['Humavue', 'PayHub', 'OmniReach', 'OmniPost', 'VisionX', 'Vaulteer', 'Signetum', 'SealVerity', 'Resuelto', 'CrawlGPT', 'Clear Intelligence', 'Fieldora', 'MeetIQ', c.name].map((x) => (
                <span key={x} className={x === c.name ? 'text-primary' : undefined}>{x}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-3 font-semibold text-foreground">Company</div>
            <div className="flex flex-col gap-2">
              {['About VisionX', 'Blog', 'All products', 'Contact sales', 'Brochures', 'Resources', 'Changelog', 'Pricing', 'Trust & Security', 'Comparisons'].map((x) => <span key={x}>{x}</span>)}
            </div>
          </div>
        </div>
        <address className="mx-auto max-w-7xl space-y-1 px-6 pb-6 text-sm not-italic text-muted-foreground">
          <p>VisionX LLC, a Delaware limited liability company</p>
          <p>16192 Coastal Highway, Lewes, Delaware 19958, USA</p>
        </address>
        <div className="border-t border-border">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-6 text-xs text-muted-foreground">
            <span>&copy; 2026 VisionX Software &middot; VisionX LLC, a Delaware limited liability company</span>
            <div className="flex flex-wrap items-center gap-5"><span>Privacy</span><span>Terms</span><span>Cookie settings</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
