# AGENTS.md — ATHAR repository instructions

You are working on **ATHAR (أثر)**, an Arabic-first, Egypt-first platform for discovering digital work platforms, evaluating them through verified facts and real experiences, tracking a personal journey, and sharing knowledge. These rules apply to every task. If anything here conflicts with an approved product decision, the **approved baseline wins**; if you are unsure, **stop and ask**.

## 1. Read before you code (in this order)

1. `docs/01-product/PRODUCT-UX-DECISIONS.md` — *ATHAR Product & UX Decisions v1.2 — Approved Baseline* (**source of truth**)
2. `docs/01-product/PRD.md` — requirements, business rules, open decisions (`OD-xx`), source conflicts (`SC-xx`)
3. `docs/02-design/SITEMAP-USER-FLOWS.md` — pages, navigation, flows
4. `docs/02-design/UI-UX-SPECIFICATION.md` — screens, components, states, RTL, approved copy
5. `docs/03-architecture/SYSTEM-ARCHITECTURE.md` — modules `M-01…M-24`, boundaries, events
6. `docs/04-technical/DATABASE-API-DESIGN.md` — entities, constraints, endpoints, error model
7. `docs/04-technical/TECH-STACK-AND-DEVELOPMENT-PLAN.md` — stack, standards, task list (`Txx-yy`), definition of done
8. `docs/decisions/` — recorded owner decisions that supersede the above

Read only the sections relevant to your task, but always read the baseline sections it touches. Find your task ID in the plan (§11) and follow its acceptance criteria.

## 2. Scope rules

- Implement **V1 only**. Do **not** add: AI agents, direct messages, followers, stories/reels, feeds, public Q&A lists, chat replies/reactions/mentions/threads/read receipts/typing indicators, chat images or attachments, push notifications, ordinary activity emails, platform or earnings integrations, live opportunity feeds, courses, user-created communities, member 2FA, English localization, country expansion, paid ranking/placement, or data sale. No tables, endpoints or UI for them.
- ATHAR is not a marketplace, recruitment platform or conventional social network. Never imply a partnership or endorsement (DEPI, Digital Egypt Pioneers or any platform).
- Never invent product decisions, numbers, permissions or workflows. Numeric values marked [F] are configuration (`ConfigSetting`), never hard-coded.

## 3. Open decisions and conflicts

- If a decision is open (`OD-xx`, `DQ-xx`, `AO-xx`, `TO-xx`) or a baseline conflict (`SC-xx`) affects your task: implement the **documented default behind a configuration flag**, or stop and ask. **Do not guess.** Record the question in your PR description (and in `docs/decisions/` if the owner answers).
- Approved decisions only change with the owner's explicit approval; then update the affected documents, contracts and tests in the same change.

## 4. Non-negotiable product rules

- Keep three information layers separate: *From the platform*, *Verified by ATHAR*, *Community experience*. Reviews never change verification status. Never label a platform fraudulent from reviews alone; the system never generates the words "fraud" or "scam". Do not use the word "official" for platform information.
- Platform status model: five availability states + an independent Warning flag; platforms are **never deleted**.
- Reviews: one per author per platform; only "Worked on the platform" reviews are qualifying; headline rating only with ≥ 3 qualifying reviews (configurable).
- Tracking statuses (six) and application states (ten) as documented; Favorites and tracking are **independent**.
- Chat is flat text and links only, members-only; guests never see messages anywhere.
- Earnings, applications and tracking are **never** visible to staff or the public.
- Reproduce approved Arabic copy **exactly** (slogan, supporting message, section copy, zero-result copy). Other Arabic copy is "suggested" until approved.

## 5. Architecture and stack

- Follow the documented stack (status: RECOMMENDED unless `docs/decisions/` says approved): TypeScript, Next.js web, NestJS API (modular monolith) + worker, PostgreSQL, Drizzle, Zod contracts, session cookies. Do not swap technologies or add services (Redis, search engine, message broker, third-party trackers) without owner approval.
- **Module boundaries:** a module may use another only through its `index.ts` public interface or published events. No cross-module table access. Domain code is framework-free. The web app contains **no business rules**.
- Follow `DATABASE-API-DESIGN.md` for entities, constraints, endpoints and error codes; keep `packages/contracts` in sync. Reject unknown request properties.
- Avoid new dependencies. If one is truly needed, state why, check its license and maintenance, and flag it in the PR.

## 6. Security and privacy (server-side, always)

- Validate **all** input on the server (Zod). Enforce authorization on the server via the central policy; never trust the client. Derive ownership from the session, never from request data.
- Parameterized queries only. Render user content as text; no `dangerouslySetInnerHTML` for user content.
- Never hard-code secrets or put them in logs, tests, fixtures or client code; use the env schema and `.env.example`.
- Never log message/review/note bodies, earnings, credentials, tokens or emails. Keep staff away from private journey data by construction.
- Privileged actions write an audit entry in the same transaction. Sensitive actions require re-authentication; staff require 2FA.

## 7. Arabic-first and RTL

- UI text is Arabic. Use logical CSS properties (`inline-start/end`, never physical left/right). Isolate Latin names, URLs and numbers inside Arabic text. Mirror directional icons only. Test in RTL, mobile and desktop, light and dark.
- Meet WCAG 2.1 AA: keyboard operation, visible focus, labels, contrast, no color-only meaning, reduced motion.

## 8. How to work

1. Work on **one bounded task** (one module where possible). Inspect existing code, tests and conventions first.
2. Write tests for the behavior you implement — including authorization, validation and error paths — then **run** lint, typecheck and the relevant tests.
3. Keep changes small and reviewable. Follow Conventional Commits and the PR template.
4. Update documentation/contracts when (and only when) an approved decision changes.

Commands (confirm in the repo scripts; if a script is missing, say so rather than inventing one):
`pnpm install` · `pnpm lint` · `pnpm typecheck` · `pnpm test` · `pnpm test:api` · `pnpm test:e2e` · `pnpm db:migrate` · `pnpm dev`

## 9. Reporting — be honest

End every task with:
- **Done:** what is implemented and how it was verified (commands run and their results).
- **Changed files:** list with one line each.
- **Not done / partial:** anything incomplete, skipped, or unverified.
- **Open questions:** decisions you did not make and the default you used.
Never claim a feature is complete without verification evidence.

## 10. Definition of done (task)

Acceptance criteria met · tests written and passing · lint and typecheck clean · server-side validation and authorization in place · no new unapproved dependency · no secrets · documentation updated if an approved decision changed · open decisions recorded.
