# ATHAR — Tech Stack and Development Plan

> Suggested location: `docs/04-technical/TECH-STACK-AND-DEVELOPMENT-PLAN.md`
> Companion file: `AGENTS.md` (repository root)

**Status labels (used throughout)**

| Label | Meaning |
| --- | --- |
| **APPROVED** | Explicitly defined in the approved baseline (*Product & UX Decisions v1.2*). |
| **RECOMMENDED** | My professional recommendation, with reasons. Not approved until the product owner signs off. |
| **PROPOSED** | A suggested solution for a detail that has no approved answer; awaiting approval. |
| **OPEN DECISION** | Must be decided by the product owner (listed in §18). |

**Important limitation.** **No technology choice is approved anywhere in the source documents.** The baseline defines product behavior only; every technology below is RECOMMENDED or PROPOSED. Prices are not invented; cost items are categories to verify against current provider pricing. This document builds on the six documents produced earlier in this project (baseline v1.2, `PRD.md`, `SITEMAP-USER-FLOWS.md`, `UI-UX-SPECIFICATION.md`, `SYSTEM-ARCHITECTURE.md`, `DATABASE-API-DESIGN.md`); all were available when this was written, and §20 states how much cross-checking was actually done.

---

# PART A — TECHNOLOGY STACK

## 1. Technical Requirements

Derived from the documents above. "Source" gives the originating decision.

| ID | Requirement | Source |
| --- | --- | --- |
| TR-01 | Arabic-first, fully RTL web UI; responsive (mobile-first); light default + dark; WCAG 2.1 AA | CD-020, RD-I7 |
| TR-02 | Public pages (home, directory, platform details, communities info, About, Help) must be **crawlable and fast**; profiles must not be indexed | RD-F2, §4.1 |
| TR-03 | Modular monolith with strict module boundaries, ports/adapters, domain events, background jobs | Architecture AD-01…AD-05 |
| TR-04 | Relational integrity: uniqueness invariants, partial unique constraints, transactional updates (e.g., review + rating aggregate) | DB design §1, §3, DR-05…DR-07 |
| TR-05 | Server-side authorization on every call; central policy; staff isolation from private data | Architecture §8 |
| TR-06 | Authentication: email+password and Google; email verification; password recovery; session list/revocation; staff TOTP-class 2FA; re-authentication | CD-013, RD-F8 |
| TR-07 | Real-time group chat: server→client delivery to joined members, per-community ordering, moderation controls; **no** typing/presence/reactions/replies | CD-011, CD-203 |
| TR-08 | Arabic + Latin platform search with suggestions; chat search per community; Arabic collation for tie-breaks | RD-A8, RD-D12 |
| TR-09 | Scheduled and long-running jobs: verification due transitions, Featured refresh, grace expiry, retention purges, exports | RD-B4, RD-F4, §8.7 |
| TR-10 | Transactional email only (verification, reset, security, account-status) | CD-119, CD-204 |
| TR-11 | Limited file handling: temporary export archives (7 days) and optional profile photos; **no chat attachments** | RD-F5, CD-014, CD-121 |
| TR-12 | Exchange-rate lookup via a disclosed source (source undecided) | RD-E7, OQ-11 |
| TR-13 | Privacy: no third-party advertising trackers; logs without private content; aggregate-only analytics | §8.1, RD-F10 |
| TR-14 | Backups with restore that re-applies deletions; export/deletion workflows | AD-17, RD-F4 |
| TR-15 | Small team, early-stage budget, pilot of roughly 100–300 members and 30–40 platforms; capacity targets undefined | CD-208, PRD OD-13 |
| TR-16 | AI-assisted development (Codex): conventions that are explicit, typed, testable, and documented | Task brief |

---

## 2. Stack Evaluation

### 2.1 Frontend

| Option | Strengths | Weaknesses | Verdict |
| --- | --- | --- | --- |
| **Next.js (React, App Router)** | Server rendering/static generation for crawlable public pages; React ecosystem for accessible primitives; file-based routing matches the sitemap; strong tooling and AI-agent familiarity; logical-property CSS works well for RTL | Framework surface area and frequent change; server-component mental model; must avoid putting business logic in the web tier (architecture keeps it in the API) | **RECOMMENDED** |
| React + Vite SPA | Simplest mental model; fast dev | Weak SEO for public pages without extra work; slower first load on mid-range devices | Not chosen (TR-02) |
| React Router framework / Remix | Good SSR and forms | Smaller ecosystem and agent familiarity than Next.js | Alternative |
| Astro (+ islands) | Excellent for content pages | Highly interactive member/chat/admin areas fit less naturally | Not chosen |
| SvelteKit / Nuxt | Productive, light | Different language ecosystem; fewer accessible-component libraries; smaller AI-agent training coverage | Not chosen |

**RTL notes:** logical CSS properties; `dir="rtl"` at the root; headless accessible primitives (Radix UI) as the base of the ATHAR component library; CSS variables for the design tokens in the UI specification; Tailwind CSS (logical-utility classes) **or** CSS Modules — *Tailwind RECOMMENDED* for speed and consistent token use; self-hosted fonts (UI spec D-02).

### 2.2 Backend

| Option | Strengths | Weaknesses | Verdict |
| --- | --- | --- | --- |
| **NestJS (Node.js, TypeScript)** | Native module system maps to M-01…M-24; dependency injection supports ports/adapters; guards/interceptors suit the central authorization policy and audit; OpenAPI generation; WebSocket/SSE support; testing utilities | More boilerplate; decorators learning curve; discipline needed to keep domain code framework-free | **RECOMMENDED** |
| Fastify (plain) | Fast, light, schema validation | Module boundaries and DI must be hand-built; more architectural drift risk | Alternative |
| Express (plain) | Ubiquitous | No structure; weaker validation story; highest drift risk | Not chosen |
| Next.js route handlers as the only backend | One codebase/deployable | Long-lived SSE/jobs, module boundaries and worker processes fit poorly; blurs presentation and business layers | Not chosen |
| Django / Rails / Laravel | Mature batteries-included | A second language/skill set; sharing contracts with a TS frontend is harder | Not chosen |

**Language: TypeScript (strict)** everywhere — shared contracts, one skill set, strong typing for Codex-assisted work. **Validation: Zod schemas** in a shared `contracts` package used by API and web; the API validates all inputs at the boundary (also the basis for rejecting unknown properties). **API documentation:** OpenAPI generated from the Zod schemas (RECOMMENDED), kept consistent with `DATABASE-API-DESIGN.md`.

### 2.3 Database

| Option | Strengths | Weaknesses | Verdict |
| --- | --- | --- | --- |
| **PostgreSQL** | Strong transactions; partial unique indexes and CHECK constraints (needed for "one active review/membership", state rules); `NUMERIC` for money; `timestamptz`; built-in full-text search with an **Arabic** text-search configuration; trigram matching (`pg_trgm`) for suggestions; ICU collations for Arabic ordering; `LISTEN/NOTIFY` for light pub/sub; mature managed offerings with point-in-time recovery | Requires index/ query discipline; Arabic search quality needs tuning | **RECOMMENDED** |
| MySQL / MariaDB | Mature | Weaker constraint expressiveness (partial indexes); weaker built-in Arabic FTS | Not chosen |
| SQLite | Zero ops | Concurrent writers/real-time chat and managed backups/restore concerns | Not chosen for production |
| Document stores | Flexible | The model is strongly relational with integrity rules | Not chosen |

**Search suitability (§2.7)** and **managed vs self-hosted** (§7, §8): managed PostgreSQL with automated backups and PITR is RECOMMENDED over self-managing, to protect the restore requirement (TR-14).

### 2.4 ORM / data access

| Option | Strengths | Weaknesses | Verdict |
| --- | --- | --- | --- |
| **Drizzle ORM + drizzle-kit** | SQL-first, TypeScript schema; native partial indexes, CHECK constraints, enums; easy raw SQL for full-text search; lightweight; plain SQL migrations reviewable by humans | Younger ecosystem than Prisma | **RECOMMENDED** |
| Prisma | Excellent DX, mature migrations and tooling | Partial indexes/CHECK/some Postgres features need hand-written SQL; full-text search limited; heavier runtime | Alternative (acceptable) |
| Kysely (query builder) | Typed SQL, minimal abstraction | Schema/migration tooling is separate | Alternative |
| TypeORM / MikroORM | Mature, decorator-based | More magic; weaker type guarantees (TypeORM) | Not chosen |

Mitigation: repositories sit behind ports (architecture §4), so the ORM is replaceable. Raw SQL is allowed inside infrastructure repositories (and must be parameterized).

### 2.5 Authentication

| Option | Strengths | Weaknesses | Verdict |
| --- | --- | --- | --- |
| **Server-side sessions in PostgreSQL + HttpOnly cookies; Argon2id; Google via OpenID Connect client; TOTP for staff** | Exactly matches the Session entity (list, end, password change ends others); instant revocation; no token leakage to JS; fewest moving parts; no vendor; privacy-friendly | Must be implemented carefully (mitigated by vetted libraries and a security test suite) | **RECOMMENDED** |
| JWT access tokens | Stateless | Revocation/session-list requirements conflict; token storage risks | Not chosen as the primary mechanism |
| Auth.js / Better Auth | Faster start | Staff 2FA, lockout rules, dual-address email change and session policy need heavy customization; ties to library evolution | Alternative |
| Managed identity (Auth0, Clerk, Firebase) | Hardened flows | Recurring cost; vendor lock-in; user data held by a third party (privacy/PDPL concerns [L]) | Not chosen |

**Single origin:** serve web and API behind one reverse proxy origin (`/api/*` → API) so cookies are first-party and CORS is unnecessary (§6). **PROPOSED:** staff 2FA method = TOTP authenticator + recovery codes (OPEN DECISION, PRD OD-14).

### 2.6 Real-time communication (approved V1 chat only)

The approved chat is **flat**: no typing indicators, presence, read receipts, reactions or replies. Sending is an ordinary HTTP request; only **server→client delivery** needs a live channel.

| Option | Strengths | Weaknesses | Verdict |
| --- | --- | --- | --- |
| **Server-Sent Events (SSE)** over HTTP + `Last-Event-ID` catch-up | One-directional fits the approved model; simple authentication and authorization per connection; auto-reconnect; works through standard HTTP infrastructure; no extra dependency | Needs proxy settings for streaming; per-browser connection limits on HTTP/1.1 (negligible with HTTP/2 and one open room at a time) | **RECOMMENDED** |
| WebSocket (`ws`/Socket.IO) | Bi-directional | Unneeded for V1 flat chat; more connection state to secure and scale | Future option |
| Short/long polling | Simplest | Latency and load; poor "real-time" feel | Fallback only |
| Managed real-time (Pusher, Ably) | Offloads scaling | Cost, third-party handling of message content (privacy) | Not chosen |

**Fan-out across multiple app instances:** PostgreSQL `LISTEN/NOTIFY` (RECOMMENDED; avoids adding Redis) — notifications carry only identifiers; the instance reloads authorized message data. Resolves DQ-01 as **RECOMMENDED**, final approval pending.

### 2.7 File storage

Needed only for: (a) export archives, deleted after 7 days; (b) optional profile photos. **RECOMMENDED:** an **S3-compatible private object store** behind a `StoragePort`; exports use time-limited access and a lifecycle rule for expiry; photos are served through the API with the visibility check. Chat attachments are **not** supported (CD-121). Provider = OPEN DECISION (cost-sensitive; also data-residency [L]).

### 2.8 Search

| Option | Verdict |
| --- | --- |
| **PostgreSQL full-text search (Arabic configuration) + `pg_trgm` + `unaccent`-style normalization + a small Arabic normalization function** | **RECOMMENDED for V1.** At roughly 30–40 platforms [F] and per-community chat search, database-native search is sufficient, keeps data in one place (privacy, deletion, restore), and removes an operational component. |
| Dedicated engine (Meilisearch, Typesense, OpenSearch) | **Not justified for V1.** Revisit if measured relevance or latency fails (triggers in §17). The `SearchPort` keeps this reversible. |

Requirements to test: Arabic letter-variant normalization (alef forms, taa marbuta/ha, yaa/alef-maqsura), diacritics, Arabic-Indic vs Western digits, mixed-script names, prefix suggestions, Arabic collation tie-breaks.

### 2.9 Caching

Not justified for V1. Use HTTP caching headers and Next.js revalidation for public pages; short in-process caches for configuration. **No Redis/distributed cache** until measurements demand it (§17).

### 2.10 Background jobs

**RECOMMENDED:** a PostgreSQL-backed job queue (e.g., pg-boss) in a separate **worker process** from the same codebase — one datastore, transactional enqueue (supports the outbox pattern), no Redis. Alternative: BullMQ (needs Redis).

### 2.11 Testing

| Layer | Tool (RECOMMENDED) |
| --- | --- |
| Unit and component | Vitest (+ Testing Library for UI components) |
| API/integration | Vitest + Supertest against the Nest application with a **real PostgreSQL** (disposable container); no mocked database |
| Contract | OpenAPI/Zod schema validation of responses against `packages/contracts` |
| End-to-end | Playwright (Arabic/RTL, mobile and desktop viewports, Chromium plus one more engine) |
| Accessibility | `axe-core` via Playwright + manual screen-reader checks |
| Load | k6 (basic smoke at launch scale) |
| Security | Dependency audit/OSV scanning, static analysis (CodeQL or Semgrep) in CI, OWASP ZAP baseline against staging |

### 2.12 Deployment

| Option | Strengths | Weaknesses | Verdict |
| --- | --- | --- | --- |
| **Containers (Docker) on a simple PaaS or a single VM with Docker Compose + reverse proxy; managed PostgreSQL** | Portable, cheap to start, easy rollback (previous image), matches single-origin proxy and SSE needs | Some ops responsibility on a VM; PaaS vendor choice | **RECOMMENDED**, host = OPEN DECISION |
| Serverless/edge for the API | Scales to zero | Poor fit for SSE, jobs, and DB connections | Not chosen |
| Kubernetes | Powerful | Unjustified complexity | Not chosen |

Hosting region is constrained by data-protection analysis (cross-border transfer, OQ-01 [L]) and user latency; decision deferred to the owner with counsel.

### 2.13 Monitoring

**RECOMMENDED:** structured JSON logging (`pino`) with redaction; an error tracker (Sentry or the Sentry-compatible self-hosted GlitchTip) configured to **strip personal data and message content**; uptime/health checks; basic host/DB metrics from the provider; OpenTelemetry-compatible instrumentation hooks (no full metrics stack until needed). Alerting for job lag, failed deletion/export workflows, and error spikes.

---

## 3. Final Recommended Stack

**All entries are RECOMMENDED unless stated otherwise; none is approved.** "Cost" uses categories only.

| Area | Choice | Why / requirement | Main trade-offs | Cost implication | Alternatives |
| --- | --- | --- | --- | --- | --- |
| Language | TypeScript (strict) | One language, shared contracts, strong typing for agents (TR-16) | Build tooling | None | JavaScript, Kotlin/Go (rejected) |
| Frontend | Next.js (React) + Tailwind + Radix primitives + React Hook Form + Zod + TanStack Query | SEO/SSR for public pages (TR-02), RTL, accessible components (TR-01), forms | Framework churn; server-component discipline | Free OSS | Vite SPA, Remix, SvelteKit |
| Backend | NestJS (Node.js LTS) | Module system = architecture modules (TR-03); guards for policy (TR-05); OpenAPI | Boilerplate | Free OSS | Fastify, Express |
| Validation/contracts | Zod + generated OpenAPI | One source of truth for web/API; rejects unknown properties | Schema discipline | Free | class-validator |
| Database | PostgreSQL (managed, backups + PITR) | Integrity, constraints, FTS, collations (TR-04, TR-08) | Needs DBA-level care for indexes | Managed DB is the largest fixed cost category | MySQL (rejected) |
| Data access | Drizzle ORM + drizzle-kit migrations (SQL-first) | Partial indexes, CHECKs, raw SQL where needed | Younger ecosystem | Free | Prisma, Kysely |
| Authentication | Custom sessions in Postgres, HttpOnly cookies, Argon2id, OIDC client (Google), TOTP for staff | Matches the Session model (TR-06) | Security-critical code to own | Free | Auth.js, managed identity |
| Real-time | SSE + `LISTEN/NOTIFY` | Minimum for flat chat (TR-07) | One-way only (adequate for V1) | None extra | WebSocket, managed service |
| Jobs | PostgreSQL-backed queue + worker process | TR-09, no Redis | Throughput ceiling | None extra | BullMQ + Redis |
| Search | PostgreSQL FTS + trigram | TR-08 at V1 scale | Relevance tuning for Arabic | None extra | Typesense/Meilisearch |
| Caching | HTTP/ISR only | Not justified | — | None | Redis |
| File storage | S3-compatible private object store | Exports and photos only (TR-11) | Provider choice | Low, usage-based category | Local volume |
| Email | SMTP/API adapter to a transactional email service (provider OPEN) | Essential emails only (TR-10) | Deliverability setup (SPF, DKIM, DMARC) | Low category | Self-hosted SMTP (not recommended) |
| Password breach check | k-anonymity range lookup (PROPOSED) or local dataset | RD-F8 | External dependency vs maintenance | Free/low | Local list only |
| Signup challenge | Self-hosted proof-of-work challenge (PROPOSED), escalate to a third-party CAPTCHA only if abuse demands | RD-F9 and no third-party trackers | Weaker than commercial CAPTCHA | Free | Turnstile, hCaptcha |
| Monorepo | pnpm workspaces (+ Turborepo only when needed) | Shared packages, one CI | Tooling learning | Free | Polyrepo |
| Testing | Vitest, Testing Library, Supertest, Playwright, axe-core, k6 | §2.11 | — | Free | Jest |
| CI/CD | GitHub Actions | Code host integration with Codex | Vendor coupling | Free tier + usage | GitLab CI |
| Containers | Docker (single image per process: web, api, worker) | Portability, rollback | — | Free | Buildpacks |
| Reverse proxy | Provider-managed TLS or Caddy | Single origin, HTTP/2, SSE settings | — | Free | Nginx |
| Observability | pino + Sentry-compatible tracker + uptime checks | §2.13 | Scrubbing discipline | Free tier / low | Full APM |

**Decisions requiring owner approval:** every row above, plus the hosting provider and region, email provider, object-storage provider, error-tracker hosting (hosted vs self-hosted), CAPTCHA approach and staff 2FA method (§18).

---

## 4. Architecture and Project Structure

**RECOMMENDED:** one repository (pnpm monorepo) with three deployable processes built from it — `web`, `api`, `worker` — plus shared packages. The API is a **modular monolith**: one folder per architecture module, each with the five internal layers.

```text
athar/
├─ AGENTS.md                        # Codex/agent instructions (root)
├─ README.md
├─ package.json  pnpm-workspace.yaml  .nvmrc  .editorconfig
├─ .env.example                     # documented, no secrets
├─ docs/
│  ├─ 00-baseline/                  # ATHAR Product & UX Decisions v1.2 (approved)
│  ├─ 01-product/PRD.md
│  ├─ 02-design/{SITEMAP-USER-FLOWS.md, UI-UX-SPECIFICATION.md}
│  ├─ 03-architecture/SYSTEM-ARCHITECTURE.md
│  ├─ 04-technical/DATABASE-API-DESIGN.md
│  ├─ 04-technical/TECH-STACK-AND-DEVELOPMENT-PLAN.md
│  └─ decisions/                    # ADRs and change log for approved decision changes
├─ apps/
│  ├─ web/                          # Next.js (presentation layer only)
│  │  ├─ src/app/                   # routes mirror the sitemap (public, (member), community, admin)
│  │  ├─ src/features/              # feature UI by module (platforms, reviews, chat, my-athar, admin ...)
│  │  ├─ src/lib/                   # API client (typed from contracts), auth helpers, formatters (ar-EG, Latin digits)
│  │  └─ tests/                     # component tests
│  └─ api/
│     ├─ src/
│     │  ├─ main.ts                 # HTTP entry
│     │  ├─ worker.ts               # job worker entry
│     │  ├─ modules/
│     │  │  ├─ identity/            # M-01
│     │  │  ├─ profiles/            # M-02
│     │  │  ├─ directory/           # M-03
│     │  │  ├─ platforms/           # M-04 (+ taxonomy)
│     │  │  ├─ verification/        # M-05
│     │  │  ├─ search/              # M-06
│     │  │  ├─ comparison/          # M-07
│     │  │  ├─ reviews/             # M-08
│     │  │  ├─ ratings/             # M-09
│     │  │  ├─ communities/         # M-10
│     │  │  ├─ membership/          # M-11
│     │  │  ├─ chat/                # M-12
│     │  │  ├─ my-athar/            # M-13
│     │  │  ├─ tracking/            # M-14
│     │  │  ├─ applications/        # M-15
│     │  │  ├─ earnings/            # M-16
│     │  │  ├─ contributions/       # M-17
│     │  │  ├─ notifications/       # M-18
│     │  │  ├─ suggestions/         # M-19
│     │  │  ├─ help/                # M-20
│     │  │  ├─ administration/      # M-21
│     │  │  ├─ moderation/          # M-22
│     │  │  ├─ privacy-data/        # M-23
│     │  │  └─ favorites/           # M-24
│     │  │     # each module: domain/ application/ infrastructure/ http/ events/ index.ts (public interface)
│     │  ├─ platform/               # cross-cutting services P-01..P-09
│     │  │  ├─ authz/  audit/  config/  events/  jobs/  email/  storage/  rate-limit/  observability/  content-safety/
│     │  └─ shared/                 # errors, clock, ids, result types (no business rules)
│     ├─ test/                      # integration/API tests (real PostgreSQL)
│     └─ drizzle.config.ts
├─ packages/
│  ├─ contracts/                    # Zod schemas, API types, error codes, enums (single source for web+api)
│  ├─ ui/                           # design tokens, components (Radix-based), RTL utilities
│  ├─ i18n/                         # Arabic message catalogs (keys feature.component.state)
│  └─ config/                       # shared tsconfig, eslint, prettier, vitest presets
├─ db/
│  ├─ migrations/                   # SQL migrations (reviewed)
│  └─ seed/                         # vocabularies, roles, permissions, config defaults, sample data (dev only)
├─ tests/
│  ├─ e2e/                          # Playwright specs by journey (F-xx flows)
│  └─ load/                         # k6 scripts
├─ infra/
│  ├─ docker/                       # Dockerfiles per process
│  ├─ compose/                      # local + single-VM compose files
│  └─ deploy/                       # deployment and rollback scripts/runbooks
└─ .github/
   ├─ workflows/                    # ci.yml, security.yml, deploy-staging.yml, deploy-production.yml
   ├─ pull_request_template.md
   └─ CODEOWNERS
```

**Boundary rules (enforced by lint/dependency checks in CI).** `modules/<a>` may import another module **only** through `modules/<b>/index.ts` (public interface) or its published events; `domain/` imports nothing from frameworks or infrastructure; `apps/web` imports only `packages/*` and calls the API over HTTP; business rules never live in `apps/web`.

---

## 5. Development Standards

### 5.1 TypeScript conventions
`strict` mode plus `noUncheckedIndexedAccess`; no `any` (use `unknown` + narrowing); explicit return types on exported functions; prefer `type` for data and `interface` for ports; discriminated unions for states; `readonly` by default; no default exports except where the framework requires; money as decimal strings/`NUMERIC` (never floating point); dates as ISO strings/`Date` in UTC.

### 5.2 Naming
Files `kebab-case.ts`; classes/types `PascalCase`; functions/variables `camelCase`; constants `UPPER_SNAKE_CASE`; DB tables/columns `snake_case`; JSON/API fields `snake_case` (matches the API contract); enums lowercase `snake_case` values; React components `PascalCase`; hooks `useThing`; message keys `feature.component.state`; test files `*.spec.ts`; module event names past tense (`ReviewPublished`).

### 5.3 Folder organization
Per module: `domain/` (entities, value objects, rules, events), `application/` (use cases, ports, DTO mapping), `infrastructure/` (repositories, adapters), `http/` (controllers, request/response schemas). Cross-module calls only through `index.ts`.

### 5.4 Error handling
A single `AppError` hierarchy with stable `code` values from `packages/contracts` (the error model in `DATABASE-API-DESIGN.md` §11). Domain code throws typed errors; one global filter maps to the response envelope; unknown errors → `INTERNAL_ERROR` with `request_id`, never leaking details. The web app maps `code` → Arabic message catalog; no raw server text is shown as-is except the documented Arabic `message` fallback.

### 5.5 Validation
Zod at every boundary (HTTP, jobs, events, config). Unknown properties rejected. Domain invariants re-checked inside use cases. Database constraints are the last line of defense (unique, partial unique, CHECK, FK).

### 5.6 Logging
`pino` JSON logs with `request_id`, module, and event name; **redaction list** for passwords, tokens, cookies, emails, message/review/note bodies, earnings. Log levels by environment. No `console.log` in committed code.

### 5.7 API contracts
Contracts live in `packages/contracts` and are the source of both validation and OpenAPI. `DATABASE-API-DESIGN.md` is the specification; any deviation requires a documented decision. Breaking changes require a new version (`/v1` → `/v2`). API mounted at `/api/v1/...` behind the single-origin proxy (the document's `/v1` paths are relative to `/api`).

### 5.8 Formatting and linting
Prettier (single configuration); ESLint with `typescript-eslint`, import-boundary rule, accessibility plugin for JSX, no-restricted-imports for module boundaries and forbidden dependencies; CSS: logical properties only (a lint rule flags `left/right/margin-left/…`); `pre-commit`: lint-staged (format + lint changed files); CI runs full lint, typecheck, tests.

### 5.9 Environment variables and secrets
Variables are declared and validated in one Zod schema per app at startup (fail fast). `.env.example` documents every variable without values; real `.env` files are git-ignored. Secrets live in the host's secret store or CI secrets — never in code, images, logs, or client bundles. Only variables prefixed for the browser are exposed to the web client, and none contains a secret. Production secrets are rotated on staff changes and after any suspected leak.

### 5.10 Git conventions
Trunk-based development: short-lived branches from `main` (`feat/…`, `fix/…`, `docs/…`, `chore/…`); **Conventional Commits** (`feat(reviews): …`); small commits; no force-push to `main`; squash-merge with a clear message.

### 5.11 Pull requests and review
A PR must: reference the task ID and the governing document sections; stay within one bounded task; include tests; pass CI (lint, typecheck, unit, integration, e2e subset, accessibility smoke, dependency/security scans); list changed files and any open decisions; include migration notes when the schema changes; update docs if an approved decision changed. At least one human review is required; **security-, privacy-, authorization-, migration- and data-lifecycle-related changes require explicit careful human review** (CODEOWNERS). No self-merge of Codex-authored changes without human approval.

---

## 6. Security Baseline

| Area | Implementation expectation |
| --- | --- |
| **Authentication** | Server-side sessions in PostgreSQL; random high-entropy session secrets stored hashed; cookies `HttpOnly; Secure; SameSite=Lax` with `__Host-` prefix where applicable; session rotation on sign-in and privilege change; idle and absolute lifetimes configurable (OPEN DECISION values); staff require TOTP (PROPOSED) and recovery codes; re-authentication window for sensitive actions |
| **Authorization** | Central policy service called by every controller/use case; deny by default; ownership derived from the session; staff isolation by construction (no code path to private-journey data for staff); policy tests as table-driven matrix from PRD §5.3 |
| **Password handling** | Argon2id with tuned parameters; minimum 10 characters; breached-password check; no composition rules; constant-time comparison; generic failure messages; lockout with temporary duration (value OPEN) |
| **Session management** | List/end sessions; password change/reset ends other sessions; logout invalidates server-side; security emails for new device, email change, deletion request |
| **Input validation** | Zod at all boundaries; reject unknown properties; length limits; Unicode normalization for comparison; URL scheme allow-list |
| **SQL injection** | Parameterized queries only; raw SQL confined to infrastructure with bound parameters; no string-built queries; search input escaped for the search function |
| **XSS** | React escaping by default; **no `dangerouslySetInnerHTML` for user content**; user text rendered as text; links shown as plain text with visible domain and a leaving-ATHAR interstitial; strict Content-Security-Policy (no inline scripts, nonce-based where needed); sanitize any rich managed content (Help/legal pages) at write time |
| **CSRF** | Same-origin deployment with SameSite cookies **plus** Origin/Fetch-Metadata checks or anti-CSRF tokens on state-changing requests |
| **Rate limiting** | PostgreSQL-backed or in-process limiter behind a `RateLimitPort`, per account and per client address; classes per `DATABASE-API-DESIGN.md` §15; values from `ConfigSetting`; for multiple instances use the shared (database-backed) store |
| **Secrets** | See §5.9; secret scanning in CI; no secrets in client bundles or logs |
| **CORS** | Single origin → CORS disabled by default; if a separate origin is ever needed, an explicit allow-list without wildcards when credentials are used |
| **Secure headers** | `Strict-Transport-Security`, `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (minimal), frame protection via CSP `frame-ancestors 'none'`; `Cache-Control: no-store` on private responses; `noindex` on public-profile responses |
| **Data protection** | TLS everywhere; encryption at rest via the managed database/object store; least-privilege database roles (the app role cannot alter schema; migrations use a separate role); no production data in lower environments; logs and error tracking scrubbed |
| **Backup** | Managed automated backups with point-in-time recovery; periodic restore drill before launch (gate); **deletion ledger re-applied after any restore**; backups of deleted-account data cleared within the 90-day window |
| **Audit logs** | Append-only `AuditEntry` written in the same transaction as the action; database role for the app has no UPDATE/DELETE privilege on the audit table (enforced in migrations); retention 24 months [L][F] |
| **Dependency hygiene** | Lockfile committed; automated dependency updates reviewed; vulnerability scan in CI; minimal dependency policy (§13) |
| **Independent review** | An independent security review is a launch gate (§13.2 of the baseline) |

---

## 7. Deployment Plan

| Topic | Plan |
| --- | --- |
| **Local development** | `pnpm install`; `docker compose` for PostgreSQL (and a local mail catcher); `pnpm dev` runs web, api, worker; seed script loads vocabularies, roles, permissions, config defaults and synthetic sample platforms; no production data |
| **Development environment** | Optional shared dev deployment from `main` with synthetic data only |
| **Staging** | **Justified** once the pilot begins and for migration/rollback rehearsal: same topology as production, smaller, synthetic or anonymized-from-scratch data only; used for e2e, accessibility, ZAP baseline, load smoke, restore drill. May be started on demand to save cost (OPEN DECISION) |
| **Production** | Containers for `web`, `api`, `worker`; reverse proxy with automatic TLS and HTTP/2; single origin; proxy configured for long-lived SSE (no response buffering, idle timeout above the heartbeat interval); managed PostgreSQL; private object storage; transactional email adapter; error tracker; uptime checks |
| **Database deployment** | Managed PostgreSQL (single primary; automated backups; PITR); connection pooling sized to instance count; separate roles for app and migrations; required extensions (trigram, `unaccent`-style normalization if available) verified on the chosen provider **before** committing to it |
| **Migrations** | SQL migrations in `db/migrations`, reviewed by a human; applied by a dedicated deploy step **before** the new application version starts; **expand/contract** pattern (additive first, destructive later) so the previous version keeps working during rollback; every migration has a tested rollback or a documented forward-fix plan |
| **Environment configuration** | One validated variable schema per app; separate secrets per environment; feature behaviors that are open decisions are policy settings in `ConfigSetting`, not code branches |
| **Backups** | Automated daily (provider) plus PITR; restore tested in staging before launch and periodically afterwards; export archives and temp files excluded; deletion ledger included |
| **Rollback** | Deploy by immutable image tag; rollback = redeploy the previous tag (forward-compatible migrations keep this safe); data rollback only via PITR as a last resort, followed by ledger re-application |
| **CI/CD** | Pull request: lint, typecheck, unit, integration (real DB), contract, e2e subset, accessibility smoke, security scans. `main`: build images, deploy to staging, run e2e; production deploy requires manual approval and a migration check |
| **Monitoring** | Uptime and health endpoints (`/healthz` for liveness, `/readyz` including DB), error tracking, structured logs, job-queue lag and failure alerts, verification-overdue and moderation-response backlogs as operational views; on-call is the owner/maintainer during pilot (OPEN DECISION: who and how) |

---

## 8. Cost-Aware Infrastructure

No exact prices are given; every item must be verified against the chosen provider's current pricing.

| Category | Required for V1 | Optional | Future scaling (only on evidence) |
| --- | --- | --- | --- |
| Compute | One small container host (PaaS service or a single VM) running web, api, worker (can share one host initially) | Separate worker process on its own instance; always-on staging | More api/web replicas; separate worker pool; extract real-time (§17) |
| Database | Managed PostgreSQL, smallest tier with automated backups and PITR | Read replica; higher storage | Larger instance; replica for read-heavy projections |
| Storage | Small private object store (exports 7-day lifecycle, profile photos) | CDN for static assets | — |
| Email | Transactional email service (low volume) | Dedicated sending domain reputation tools | Higher plan if volume grows |
| Domain/DNS/TLS | Domain, DNS, managed TLS | — | — |
| Monitoring | Free-tier error tracking, uptime checks, provider metrics | Hosted log retention, extended APM | Full metrics stack |
| CI/CD | GitHub Actions free/low usage | Larger runners | — |
| Security | Dependency/SAST scans (free tiers), ZAP baseline | Independent security review (budget item — required by the launch gate) | WAF if attacks justify |
| Search | None extra (PostgreSQL) | — | Dedicated engine if relevance/latency fails |
| Cache/queue | None extra (PostgreSQL) | — | Redis if measured need |
| Legal/compliance | Counsel review (not infrastructure but required by gates) | — | — |

**Budget-conscious starting option (RECOMMENDED):** one PaaS or VM host + managed PostgreSQL (smallest backed-up tier) + object storage + transactional email + free-tier error tracking/uptime checks. The largest fixed costs are normally the managed database and the independent security review/legal review; both are launch gates, not optional.

---

# PART B — IMPLEMENTATION ROADMAP

## 9. Development Strategy

1. **Vertical, small, testable milestones.** Each milestone ends with a working, tested slice that follows the architecture's dependency order (`SYSTEM-ARCHITECTURE.md` §13.3), not "all modules at once".
2. **Contract-first.** For each feature: confirm the requirement (PRD/baseline) → confirm the API and data contract (`DATABASE-API-DESIGN.md`) → write failing tests → implement → verify.
3. **Server first, UI second** within a feature when practical, so authorization and rules are testable before screens exist; UI follows `UI-UX-SPECIFICATION.md`.
4. **Policy parameters for open decisions.** Where a decision is open (e.g., verified email for chat), implement a configuration flag with the documented default, never a hard-coded guess.
5. **Task size.** Each task fits one focused Codex session (a bounded change in one module plus tests) and one human review.
6. **No dates and no capacity assumptions.** Milestones are ordered; durations depend on team size, which is unknown.
7. **Incremental safety.** Every milestone keeps `main` deployable to staging; migrations are expand/contract.

---

## 10. Milestone Breakdown

### 10.1 Sequence adjustments (required by architectural dependencies)

The requested order is kept, with these deliberate adjustments:

| Adjustment | Reason |
| --- | --- |
| **Admin shell, audit log, configuration and roles move into M2** (full administration stays in M8) | Platform data cannot be created without staff roles, 2FA and an audit trail; M3 needs minimal platform management |
| **Minimal platform management and taxonomy admin move into M3** | Directory needs data and the vocabularies it filters on |
| **Verification management moves into M4** | Verification is part of "Trust"; the public page needs it |
| **Core moderation (reports, sanctions, appeals, blocklist, content-safety) moves into M6**, not M8 | Chat must not launch without reporting and moderation (RD-D8…D10, launch gate) |
| **Help/static pages (read side) are built in M3**; admin editing in M8 | Cheap, needed for footer/legal links early |
| **Notifications come in M7**, but moderation/suggestion modules **emit events from M6/M7** | Matches the architecture (events first, consumers later) |
| **Privacy and Data Management (export, deletion, retention) is built in M8** | It needs participation contracts from every data-owning module |
| Data migration in M9 means **seed/import tooling** | There is no legacy data in the sources |

### 10.2 Milestones overview

| ID | Milestone | Modules | Depends on | Exit (summary; details in §12) |
| --- | --- | --- | --- | --- |
| M0 | Project Foundation | — | — | Repo, CI, local env, docs in place; empty app boots |
| M1 | Core Application Foundation | UI, layouts, navigation | M0 | RTL shell and component library pass a11y/RTL checks |
| M2 | Identity and Access | M-01, M-02, P-01…P-04, admin shell | M1 | Sign-up/in, sessions, roles, 2FA, policy tests |
| M3 | Platform Directory | M-03, M-04 (core), M-06, M-07, M-20 (read) | M2 | Browse, search, filter, details, comparison on seeded data |
| M4 | Trust and Experiences | M-05, M-04 (status), M-08, M-09 | M3 | Verification, statuses, Warnings, reviews, ratings correct |
| M5 | My ATHAR | M-13…M-17, M-24 | M2, M3 | Private journey with ownership/privacy tests |
| M6 | Communities and Moderation core | M-10, M-11, M-12, M-22 | M2, M3, M4 | Flat chat with safety, reports, sanctions, appeals |
| M7 | Suggestions and Notifications | M-19, M-18 | M4, M6 | Suggestions/corrections and in-app notifications |
| M8 | Administration and Privacy | M-21, M-23, M-20 (admin) | M2…M7 | Full admin, export, deletion, retention |
| M9 | Quality and Launch | all | M0…M8 | Gates met; pilot ready |

---

## 11. Sprint Breakdown (Tasks)

**Columns.** *Dep* = dependencies; *Out* = expected output; *AC* = acceptance criteria; *Tests* = testing requirements; *Pri* = priority (H high, M medium). Every task also requires: lint/typecheck pass, no secrets, documentation updated if a decision changed (§14). "Docs" abbreviations: **PRD**, **SF** (sitemap/flows), **UI**, **ARCH**, **DB** (`DATABASE-API-DESIGN.md`).

### M0 — Project Foundation

| ID | Title and description | Dep | Out | AC | Tests | Pri |
| --- | --- | --- | --- | --- | --- | --- |
| T0-01 | Repository setup: pnpm workspace, tsconfig (strict), Prettier, ESLint presets in `packages/config` | — | Monorepo skeleton | `pnpm lint`, `pnpm typecheck` pass on empty packages | CI dry run | H |
| T0-02 | Documentation integration: place docs in `docs/` per §4, add `AGENTS.md`, `docs/decisions/` and a documentation index | T0-01 | Docs tree | All six documents + baseline present; index links resolve | Link check in CI | H |
| T0-03 | CI pipeline (GitHub Actions): lint, typecheck, unit, build, dependency scan | T0-01 | `ci.yml` | PR fails on lint/type/test errors | Intentional-failure check | H |
| T0-04 | Local environment: Docker Compose (PostgreSQL, mail catcher), `.env.example`, Zod env schema per app | T0-01 | `compose/`, env schemas | `pnpm dev` boots with documented variables; missing variable fails fast | Env schema unit tests | H |
| T0-05 | API skeleton (NestJS): health/ready endpoints, config validation, pino logging with redaction, global error filter and envelope | T0-04 | `apps/api` | `/healthz`, `/readyz` respond; errors follow DB §11 shape; secrets absent from logs | Unit + API tests | H |
| T0-06 | Web skeleton (Next.js): RTL root (`lang="ar" dir="rtl"`), self-hosted font loading, placeholder pages | T0-01 | `apps/web` | Pages render RTL; no third-party font requests | Playwright smoke | H |
| T0-07 | `packages/contracts`: error codes, envelope types, pagination types, Zod helpers | T0-01 | Package | Types consumed by api and web | Unit tests | H |
| T0-08 | Database tooling: Drizzle config, migration runner, test-database harness (disposable PostgreSQL), baseline migration | T0-04 | `db/`, harness | `pnpm db:migrate` and test DB reset work | Migration smoke test | H |
| T0-09 | Repo hygiene: Husky + lint-staged, PR template, CODEOWNERS, Conventional Commits check | T0-01 | `.github/` | Commit/PR rules enforced | Hook tests | M |
| T0-10 | Module-boundary lint rule: modules import only other modules' `index.ts`; domain framework-free | T0-05 | ESLint rule | Violating import fails lint | Rule fixtures | H |

### M1 — Core Application Foundation

| ID | Title and description | Dep | Out | AC | Tests | Pri |
| --- | --- | --- | --- | --- | --- | --- |
| T1-01 | Design tokens and themes (UI §3): CSS variables for light/dark, spacing, type, radius, motion | T0-06 | `packages/ui` tokens | Tokens match UI spec; dark theme switchable; proposals flagged for approval | Visual snapshot, contrast script | H |
| T1-02 | RTL foundations: logical-CSS lint rule, bidi helpers (`<bdi>` wrapper), number/date/currency formatters (UI §4.6 proposals) | T1-01 | `packages/ui`, `packages/i18n` | Latin names isolated; formatters unit-tested; physical left/right flagged | Unit tests; RTL e2e | H |
| T1-03 | Core form components: Button, Input, Textarea, Select, Radio group, Checkbox, Switch with all states | T1-01 | Components | States per UI §3.6; labels and error wiring accessible | Component + axe tests | H |
| T1-04 | Feedback components: Alert/Banner, Toast, Badge/Chip, Skeleton, EmptyState | T1-01 | Components | Variants and states per UI | Component + axe | H |
| T1-05 | Overlay components: Modal, Drawer/BottomSheet, Tooltip, Dropdown menu, Tabs | T1-01 | Components | Focus trap/return, Escape, RTL slide direction | Component + keyboard tests | H |
| T1-06 | Data components: Table (sortable, stacked on mobile), Pagination, Search combobox shell | T1-03 | Components | Per UI; pagination arrows mirrored | Component tests | M |
| T1-07 | Global layouts: public, member, chat shell, admin shell; sticky shrinking navbar; footer | T1-05 | Layouts | Navbar shrinks; skip link; layouts per UI §5 | Playwright viewport tests | H |
| T1-08 | Navigation: guest/member navbars, mobile drawer, profile menu (placeholder auth), breadcrumbs | T1-07 | Navigation | Items per SF §3; keyboard accessible | e2e + axe | H |
| T1-09 | System pages: 404, 403, error, maintenance, session expired; global error boundary | T1-07 | Pages | Copy as suggested in UI §6.7; retry/Home actions | e2e | M |
| T1-10 | API client in web: typed from contracts, error-code → Arabic message mapping, request-id surfacing | T0-07 | `lib/api` | Known codes map to messages; unknown code safe | Unit tests | H |
| T1-11 | Accessibility/RTL CI checks: axe in Playwright, RTL screenshot baseline for core components | T1-03 | CI job | Fails on new violations | CI | M |

### M2 — Identity and Access

| ID | Title and description | Dep | Out | AC | Tests | Pri |
| --- | --- | --- | --- | --- | --- | --- |
| T2-01 | Migrations: accounts, credentials, external links, sessions, tokens, terms acceptance, security events, roles, role assignments (DB §3.1) | T0-08 | Migrations | Constraints per DB (unique email, etc.) | Migration + constraint tests | H |
| T2-02 | Password policy service: Argon2id hashing, length ≥ 10, breached-password port + adapter (OPEN: source) | T2-01 | Service | Weak/breached rejected; adapter failure behavior documented | Unit tests | H |
| T2-03 | Sign-up use case and `EP-AUTH-01` (display-name rules, terms acceptance, challenge port) | T2-02 | Endpoint | Per DB §10.1; no phone/age fields | API tests incl. validation | H |
| T2-04 | Session management: cookie sessions, rotation, `EP-AUTH-03/05`, lockout and rate limits, `EP-AUTH-11` | T2-03 | Endpoints | Lockout works; cookies flagged correctly; generic failure messages | API + security tests | H |
| T2-05 | Email gateway port + adapter + Arabic RTL templates (verification, reset, security, account-status) | T2-01 | `platform/email` | Plain MSA templates; no activity emails possible | Template snapshot tests | H |
| T2-06 | Email verification and resend (`EP-AUTH-06/07`) | T2-05 | Endpoints | Single-use token, expiry | API tests | H |
| T2-07 | Password recovery and change (`EP-AUTH-08/09/15`) | T2-05 | Endpoints | No account enumeration; other sessions ended | API tests | H |
| T2-08 | Google sign-in via OIDC client (`EP-AUTH-02`); links to same verified email | T2-04 | Endpoint | Assertion verified server-side; terms required for new | Integration with stubbed provider | H |
| T2-09 | Central authorization policy (P-01): principal context, role/ownership/account-state checks, policy parameters (verified-email gates default per CD-206) | T2-04 | `platform/authz` | Deny by default; matrix from PRD §5.3 as data | Table-driven policy tests | H |
| T2-10 | Profiles module (M-02): profile creation, visibility, display-name rules, `EP-USR-01…04` | T2-09 | Module | Private by default; public view only enabled fields | API tests; privacy tests | H |
| T2-11 | Account security: sessions list/end, email change (both addresses), re-authentication (`EP-AUTH-10,12…14,16,17`) | T2-07 | Endpoints | Password change ends other sessions; RA enforced | API tests | H |
| T2-12 | Staff roles: role assignment, TOTP enrol/verify, recovery codes (`EP-AUTH-04/18`); OPEN DECISION recorded | T2-09 | Module | Staff cannot act without 2FA; no self-grant | API + security tests | H |
| T2-13 | Audit log service (append-only, DB role without UPDATE/DELETE) and configuration service (`ConfigSetting`) | T2-01 | `platform/audit`, `platform/config` | Audit written in the same transaction | Integration tests; privilege test | H |
| T2-14 | Rate-limit port with database-backed store; policies for sign-up, sign-in, resend, recovery | T2-04 | `platform/rate-limit` | Limits configurable; 429 with `Retry-After` | API tests | H |
| T2-15 | Web: sign-up, login, recovery, verification pages; protected-route redirects with return (SF AF-04) | T1-08, T2-04 | Pages | UI spec AUTH-01…03; errors inline; no age field | e2e + axe | H |
| T2-16 | Web: Settings (profile, privacy, security/sessions) | T2-10, T2-11 | Pages | UI MEM-08 sections; deletion area placeholder | e2e | M |
| T2-17 | Admin shell: role-filtered navigation, 403 handling, staff login with 2FA step | T2-12, T1-07 | Admin shell | Only permitted items rendered | e2e | H |
| T2-18 | Authorization/ownership regression suite (guest, member, MV, MOD, CA, SA) | T2-09 | Test suite | Suite runs in CI and is extended by later milestones | Matrix tests | H |
