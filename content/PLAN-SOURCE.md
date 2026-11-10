# Where this content came from

Every capability named on the ConnectX product page traces to one of two
documents:

| Document | What it is |
|---|---|
| The CCaaS compliance matrix | 239 numbered requirements in twelve sections, A.01 to A.12 |
| The ten month delivery plan | 396 person-days, three people, ten months, and what is demonstrable at each point |

**Neither is in this repository, and that is deliberate.** They are the bank's
own tender documents. This repository is public.

`tools/verify-against-plan.mjs` reads them from `content/plan/` and proves
every capability the page names against one of the two. It refuses a capability
that is in neither, and it fails on delivery status appearing in the copy,
because a product page describes the product and not the state of a build.

The check runs where the documents are. Its last run:

```
TRUE TO THE PLAN. 30 capabilities trace to the matrix or the plan,
nothing is invented, and the page carries no delivery status.
```

The twelve sections the content is organised against:

```
A.01 General platform              A.07 Reporting, WFM, dialler, wallboards
A.02 SIP and telecom               A.08 Digital channels and chatbot
A.03 ACD, CTI and routing          A.09 Knowledge base
A.04 Agent and supervisor desktop  A.10 Integration and compliance
A.05 IVR and self-service          A.11 Licensing, training, support
A.06 Recording and quality         A.12 Administration and security
```
