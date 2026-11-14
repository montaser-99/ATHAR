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
- [ ] T0-04 Add the documented local development environment (Docker Compose remains pending because Docker is unavailable here).

CI currently covers the available lint, typecheck and build scripts. No test or dependency-audit script is configured yet.

## First runnable application slice

- [x] T0-06 Set up the strict Next.js App Router shell with Arabic RTL, self-hosted IBM Plex fonts, Tailwind and shared light-theme design tokens.
- [x] Add the responsive ATHAR homepage, category examples, search layout and explicit unconnected directory empty state.
- [x] Add the NestJS API shell, Zod-validated environment defaults and `/healthz` process check.
- [x] Add `dev`, `dev:web`, `dev:api`, `build`, `lint` and `typecheck` workspace commands; verify both apps start.
- [ ] T0-05 remaining work: readiness checks, Pino redaction and documented global error envelope.
