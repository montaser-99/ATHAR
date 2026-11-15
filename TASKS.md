# ATHAR MVP milestones

- [ ] M0 Project Foundation: repository, CI, local environment and empty application boots.
- [ ] M1 Core application foundation: Arabic RTL shell, layouts, navigation and accessible UI foundations.
- [ ] M2 Identity and access: registration, sessions, authorization, profiles and staff access.
- [ ] M3 Platform directory: platform records, taxonomy, browse/search/filter and details.
- [ ] M4 Trust and experiences: fact verification, platform statuses, reviews and ratings.
- [ ] M5 My ATHAR: private favorites, tracking and application records.
- [ ] M6 Communities and moderation core (deferred until the core MVP is stable).
- [ ] M7 Suggestions and notifications.
- [ ] M8 Administration and privacy/data management.
- [ ] M9 Quality and launch gates.

## Foundation checklist

- [x] T0-A Correct the technical plan filename.
- [x] T0-B Correct the two outdated AGENTS.md paths.
- [x] T0-C Add the decisions directory and README.
- [x] T0-D Initialize Git on `main` and add secret/build exclusions.
- [x] T0-E Inspect the intended remote; it is empty and configured as `origin`.
- [x] T0-F Create the documented pnpm workspace, strict TypeScript base and shared tooling config.
- [x] T0-G Create concise continuity files.
- [x] Install and verify the workspace lockfile, lint and typecheck.
- [x] Create the initial foundation commit on `main` and push it to the verified-empty `origin` (commit `9e7f6f043b303441ac68f4c0f1f2850433685eab`).
- [x] T0-03 Add GitHub Actions CI for frozen install, lint, typecheck and build on pushes and pull requests targeting `main`.
- [ ] T0-04 Add the documented local development environment (environment tests and web/API startup pass with the documented sample settings; PostgreSQL/Mailpit Compose validation and runtime verification remain blocked because Docker is unavailable).

CI covers environment configuration tests, lint, typecheck and build. A dependency-audit script is not configured yet.

## First runnable application slice

- [x] T0-06 Set up the strict Next.js App Router shell with Arabic RTL, self-hosted IBM Plex fonts, Tailwind and shared light-theme design tokens.
- [x] Add the responsive ATHAR homepage, API-backed category links, published-platform cards, search entry point and honest unavailable-data states.
- [x] Add the NestJS API shell, Zod-validated environment defaults and `/healthz` process check.
- [x] Add `dev`, `dev:web`, `dev:api`, `build`, `lint` and `typecheck` workspace commands; verify both apps start.
- [ ] T0-05 remaining work: readiness checks, Pino redaction and documented global error envelope.

## M3 database-backed platform directory (in progress)

- [x] Add PostgreSQL/Drizzle schema for platforms, vocabularies, verification facts and sources, links, histories, warnings, and popularity snapshots.
- [x] Generate Drizzle migrations; schema diff reports no remaining schema changes.
- [x] Add safe, repeatable local seed examples as unpublished drafts only.
- [x] Add shared Zod request/response contracts and OpenAPI for directory listing, filter facets, and platform detail routes.
- [x] Implement published-platform listing, normalized Arabic/Latin search, filters, pagination, sorting, and public detail assembly in the API.
- [x] Replace the disconnected directory placeholder with an RTL Next.js directory, multi-select filters, removable filter chips, pagination, detail pages, and loading/empty/error states.
- [x] Refine the public shell, responsive directory cards, grid/list presentation, active filter URLs, and API-backed homepage category/platform sections.
- [x] Hide absent rating/verification metadata instead of implying values, and render recoverable directory/detail API error states.
- [x] Verify homepage RTL and mobile navigation in a browser at desktop and mobile viewports; real directory records remain unverified without PostgreSQL.
- [x] Add API contract and OpenAPI tests; lint, typecheck, and production build pass.
- [x] Add repeatable PostgreSQL integration coverage guarded by an explicit disposable database URL; include published visibility, search, filters, pagination, verified details, and error handling.
- [ ] Apply migrations and run the integration suite against PostgreSQL; do not mark M3 complete until those database checks pass.
- [ ] Populate publishable taxonomy and platform facts through the approved verification workflow; current seed examples stay unpublished.
- [ ] Connect rating aggregates and rating sorting after the review/rating projection exists; do not synthesize ratings.

## PostgreSQL integration readiness (2026-11-15)

- [x] Audit Drizzle schema, migration journal/order, database environment handling, and development seed safety.
- [x] Keep default directory search/listing published-only and exclude suspended/closed platforms unless explicitly filtered by availability.
- [x] Restrict development seeds to `NODE_ENV=development` and loopback PostgreSQL; seed examples remain drafts and inserts are conflict-safe.
- [x] Add database-independent migration-journal, seed-safety, database-error propagation, and generic API error-envelope checks.
- [x] Add repeatable integration coverage that requires a dedicated `*_test` PostgreSQL URL and exercises listing, search, supported filters, pagination, suspended visibility, verified detail sources, and database/API errors.
- [ ] Apply migrations and run the integration suite against a real disposable PostgreSQL database; unavailable in the current environment.
