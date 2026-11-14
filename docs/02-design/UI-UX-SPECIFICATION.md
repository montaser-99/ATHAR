# ATHAR — UI/UX Design Specification

> Suggested location: `docs/02-design/UI-UX-SPECIFICATION.md`

**What this document is.** A written implementation specification for designers, front-end developers and UI-implementation agents. It is **not** a Figma file, a rendered prototype, or a set of approved visual assets. No logo file, brand color palette, typeface or illustration set was provided; therefore all visual values below are **proposed design decisions** that need product-owner approval (§14).

**Status labels used throughout**

| Label | Meaning |
| --- | --- |
| **[A]** | Approved in the baseline (*Product & UX Decisions v1.2*), the PRD or the sitemap. |
| **[P]** | Proposed design decision. Not approved. Implement behind tokens so it can change. |
| **[OD]** | Linked open decision (§14 or an inherited PRD/Sitemap decision). |

**Sources.** Baseline v1.2; `PRD.md` v1.0 (IDs `FR-*`, `BR-*`, `OD-*`, `SC-*`); `SITEMAP-USER-FLOWS.md` (IDs `PUB-*`, `AUTH-*`, `MEM-*`, `COM-*`, `ADM-*`, `HLP-*`, `SYS-*`, `F-*`, `AF-*`, `SF-OD-*`).

---

## 1. Design Overview

### 1.1 Design goals

| # | Goal | Basis |
| --- | --- | --- |
| G1 | Make trust legible: every fact shows who vouches for it, when it was checked and how reliable it is. | CD-010, RD-B3 [A] |
| G2 | Keep the three information layers (*From the platform*, *Verified by ATHAR*, *Community experience*) visually distinct and never blended. | RD-B3, CD-210 [A] |
| G3 | Make discovery quick for beginners and low-bandwidth, mid-range mobile users. | §1.4 [A]; mobile-first [P] |
| G4 | Keep personal tracking private, calm and journey-oriented, not a dashboard or feed. | RD-E5, RD-I1 [A] |
| G5 | Keep community participation safe and lightweight: flat group chat with strong safety cues. | CD-110, RD-D6, RD-D7 [A] |
| G6 | Be fully usable in Arabic RTL with accessible contrast and keyboard/screen-reader support. | CD-020, RD-I7 [A] |

### 1.2 Target audience

People interested in digital work in Egypt: trainees of skills initiatives, beginners, freelancers, remote workers and AI-model trainers, plus staff (Content Admins, Moderators, Super Admins). No partnership or endorsement with any initiative is implied anywhere in the UI [A] (RD-J5). Personas are in PRD §4.

### 1.3 Product personality

| Trait | Expression in the UI | Status |
| --- | --- | --- |
| Warm and encouraging | Egyptian colloquial for invitations, encouragement and empty states | [A] RD-I6 |
| Precise and sober | Plain Modern Standard Arabic for statuses, warnings, legal text, moderation notices and errors; no humor in warnings or sanctions | [A] RD-I6 |
| Honest | Visible dates, sources, "not enough reviews yet", approximate currency conversion; no fake activity | [A] |
| Calm | Low visual noise, generous spacing, few animated elements | [P] |
| Legacy-minded | The slogan and supporting message appear in the hero and About, not as decoration everywhere | [A] §1.7 |

### 1.4 UX principles

1. **Evidence before opinion.** Facts and reviews are separated by layout, label and color-independent icons.
2. **Never hide staleness.** *Needs Review* shows its last verified date; nothing is silently removed.
3. **No dark patterns.** No pre-selected deletion choices, no hidden sanctions, no urgency tricks.
4. **Private by default.** Personal areas look and read as private; public surfaces never show private data.
5. **One obvious next step.** Each empty state offers one clear action.
6. **Consistent components.** The same card, chip, label and report action look and behave the same on every screen [A] (CD-020).
7. **Guest-friendly.** Protected actions are visible and explain why sign-in is needed rather than disappearing.

### 1.5 Arabic-first strategy [A]

- All UI text is authored in Arabic first; English appears only for Latin platform and brand names.
- Layouts are designed in RTL first, then verified in dark mode and on small screens. LTR is not a V1 target (no English localization).
- Copy follows the tone rule (RD-I6). Copy not yet approved is marked "suggested copy" (§7, §11).
- Typography is chosen for Arabic readability first (taller line-height, larger minimum size).

### 1.6 RTL requirements [A]

Full RTL layout in every screen, correct bidirectional text for Latin names, URLs and numbers, and mirrored directional icons. Detailed rules are in §4. Setting `dir="rtl"` is necessary but not sufficient; every component must be reviewed for mirroring, alignment and mixed-text behavior (§4.3).

### 1.7 Mobile-first considerations

Mobile layouts are specified first and enhanced upward [P]. The baseline mandates a responsive layout (FR-96), a filter drawer or bottom sheet on mobile (CD-006), and a compact section dropdown on Platform Details (CD-009). Other mobile patterns were left to design (baseline §4.5), so they are [P] here. Chat is full-screen on mobile. No hover-only interactions.

### 1.8 Accessibility requirements [A]

WCAG 2.1 level AA at minimum: contrast, keyboard operation, visible focus, screen-reader labels, correct RTL reading order, in both light and dark modes (RD-I7, FR-97). A formal audit is an external open item (OQ-18). Full requirements are in §10.

---

## 2. Brand Application

### 2.1 What is approved and what is not

| Element | Status | Handling |
| --- | --- | --- |
| Name **ATHAR – أثر** | [A] | Use exactly; Arabic form "أثر" for Arabic UI text, Latin "ATHAR" where Latin is needed (e.g., page title suffix). |
| Slogan "من أثرٍ جئنا، وإلى أثرٍ نمضي." | [A] | Reproduce exactly (including tanwin) in the hero and About; do not abbreviate, paraphrase or colloquialize. |
| Supporting message "ابدأ بخطوات اللي سبقوك، وسيب خطوات يستفيد منها اللي بعدك." | [A] | Reproduce exactly beside the slogan. |
| Approved section copy (Fields, Platforms, Community, Philosophy, Search prompt, Empty results) | [A] | Reproduce exactly; see PRD Appendix A. EF-01 flag on the Community copy stands. |
| Logo mark and wordmark | **Not provided** | No logo is invented. A placeholder slot is specified (§2.2). |
| Color palette, typefaces, illustration style, iconography | **Not provided** | Proposed in §3 and §2.5–2.7 [P]. |

### 2.2 Logo usage requirements

Because no logo asset exists, the spec defines **slots**, not artwork:

| Requirement | Specification |
| --- | --- |
| Slot | One logo slot in the navbar (start edge, i.e., right in RTL), one in the footer, one on auth pages, one in the maintenance/error pages. |
| Placeholder | The text "أثر" in the proposed heading font, labeled `logo-placeholder`, until the approved asset is supplied [P]. |
| Clear space [P] | At least the height of the logo's tallest glyph on every side. |
| Minimum size [P] | Navbar compact state: 24 px height; default: 32 px height. Must remain legible when the navbar shrinks on scroll [A]. |
| Variants needed | Light-surface and dark-surface versions; monochrome version for small sizes. |
| Do not | Stretch, rotate, recolor outside the supplied variants, place on low-contrast backgrounds, or mirror the logo in RTL (logos are not mirrored). |
| Accessible name | `alt`/`aria-label` = "أثر" and the link target is the homepage. |

### 2.3 Brand consistency

- The slogan and supporting message are used as a pair in the hero and on About; the supporting message never appears without context elsewhere as a decorative element.
- Brand color is used for primary actions and key emphasis only. Status colors (success, warning, error, information) are reserved for meaning and never reused as decoration.
- The three information layers use a fixed visual vocabulary (§3.6.19–3.6.20) and are never restyled per page.

### 2.4 Visual tone [P]

Calm, trustworthy and human: warm neutral backgrounds, one confident accent, generous whitespace, rounded but not playful shapes, soft elevation. It must read as an information resource, not a marketplace (no promotional banners, countdowns, "hot deal" styling, or sponsored-looking cards [A] P2).

### 2.5 Iconography direction [P]

- A single outline icon family with consistent stroke width (1.5–2 px at 24 px grid), rounded caps.
- Directional icons mirror in RTL; object icons do not (§4.4).
- Every icon that carries meaning has a text label or an accessible name; status icons always accompany text.
- Icon-only buttons require `aria-label` and a tooltip on hover/focus.

### 2.6 Illustration principles [P]

Illustrations are optional, sparse and used only in empty and onboarding states. They must be abstract or object-based (paths, footsteps/traces, doors, signposts), culturally neutral, not depicting identifiable real people, and not implying real activity (no fake avatars or messages). They must be decorative (`aria-hidden`) and never carry essential information. The "trace/footprint" idea aligns with the name but is a [P] direction, not a requirement.

### 2.7 Image usage

- Platform logos supplied by platforms may appear on cards only when the right to display them is confirmed [L]; otherwise a neutral initial-letter tile is used [P]. (Baseline defines no platform-logo field; treat as [OD] D-05.)
- No stock photography of people.
- Member profile photos appear only on opted-in public profiles (CD-014). Chat messages show **display names only** (RD-D2), so no avatars appear in chat [A].
- All meaningful images have text alternatives; decorative images are hidden from assistive technology.

### 2.8 Empty-state illustration principles [P]

One small abstract illustration (or none), a short colloquial line, and exactly one primary action (§7). Illustrations never imply that a community or review list is busy. The "New community" label is honest and not disguised [A] (RD-D13).

---

## 3. Design System

All tokens in this section are **[P] proposals** unless a baseline element is cited. The contrast ratios were computed with the WCAG 2.1 relative-luminance formula for the proposed values. They must be re-checked if any hex value changes.

### 3.1 Colors

#### 3.1.1 Light theme (default) [A: light is default, dark available — CD-020]

| Token | Role | Value [P] | Notes |
| --- | --- | --- | --- |
| `color-bg` | Page background | `#FAF8F5` | Warm off-white |
| `color-surface` | Cards, inputs, modals | `#FFFFFF` | |
| `color-surface-subtle` | Zones, table stripes, code | `#F3EFE9` | |
| `color-text` | Primary text | `#1C2024` | 15.46:1 on bg |
| `color-text-muted` | Secondary text, captions | `#555B62` | 6.48:1 on bg; 5.99:1 on subtle |
| `color-border` | Decorative dividers | `#D9D4CB` | Decorative only; not for control boundaries |
| `color-border-strong` | Control boundaries (inputs, checkboxes) | `#7A7F86` | 3.80:1 on bg; 4.03:1 on surface (≥ 3:1) |
| `color-primary` | Primary action, links | `#0E6B6F` | White text on it 6.27:1; as text on bg 5.91:1 |
| `color-primary-hover` | Hover | `#0A5559` | White text 8.55:1 |
| `color-primary-active` | Pressed | `#07454A` | |
| `color-primary-soft` | Soft emphasis background | `#E3F1F1` | Primary text on it 5.41:1 |
| `color-secondary` | Accent (highlights, featured marker) | `#9A4A0C` | White text 6.25:1; on bg 5.90:1 |
| `color-success` / `-bg` | Success | `#1B7A43` / `#E6F4EA` | 4.73:1 text on bg-tint; 5.37:1 on surface |
| `color-warning` / `-bg` | Warning, Warning flag, Needs Review | `#7A4F00` / `#FFF4D6` | 6.51:1 text on bg-tint |
| `color-error` / `-bg` | Error, destructive | `#B3261E` / `#FCE8E6` | 5.55:1 text on bg-tint |
| `color-info` / `-bg` | Information | `#1F5FA8` / `#E7F0FB` | 5.60:1 text on bg-tint |
| `color-focus` | Focus ring | `#0B57D0` | 6.02:1 on bg; 6.39:1 on surface |
| `color-overlay` | Modal scrim | `rgba(20,24,28,0.55)` | |

> The focus ring has only 1.02:1 against `color-primary`. On primary-filled controls the ring must be drawn with a 2 px `color-surface` offset gap so it contrasts with the adjacent surface (§3.6.1).

#### 3.1.2 Dark theme [P values; availability is [A]]

| Token | Value [P] | Notes |
| --- | --- | --- |
| `color-bg` | `#121516` | |
| `color-surface` | `#1A1E20` | |
| `color-surface-subtle` | `#22282B` | |
| `color-text` | `#ECEFF1` | 15.89:1 on bg; 14.54:1 on surface |
| `color-text-muted` | `#A9B1B7` | 8.44:1 on bg; 6.87:1 on subtle |
| `color-border` | `#343B3F` | Decorative |
| `color-border-strong` | `#7F888E` | 5.08:1 on bg; 4.65:1 on surface |
| `color-primary` | `#5CC2C7` | 8.73:1 on bg; text on it `#06292B` 7.35:1 |
| `color-primary-soft` | `#14383A` | Primary text on it 6.03:1 |
| `color-secondary` | `#F0A36B` | 8.12:1 on surface |
| `color-success` / `-bg` | `#6FD39A` / `#16301F` | 7.76:1 |
| `color-warning` / `-bg` | `#F2C14E` / `#3A2E0F` | 7.93:1 |
| `color-error` / `-bg` | `#FF8F86` / `#3F1B18` | 6.90:1 |
| `color-info` / `-bg` | `#8DB8F2` / `#16263D` | 7.45:1 |
| `color-focus` | `#8AB4FF` | 8.78:1 on bg |

#### 3.1.3 Interactive states (all components)

| State | Treatment [P] |
| --- | --- |
| Default | Token color for the component |
| Hover (pointer only) | Primary → `primary-hover`; neutral controls → `surface-subtle` background |
| Focus-visible | 2 px `color-focus` outline, 2 px offset; never removed |
| Active/pressed | `primary-active`; neutral → slightly darker subtle |
| Disabled | 40–50% opacity is **not** relied on for meaning; disabled controls keep text legible, are `aria-disabled`/`disabled`, show no hover, and the reason is explained near the control where relevant |
| Selected/current | `primary-soft` background + 2 px indicator at the start edge + `aria-current`/`aria-selected` |
| Error | `color-error` border and message text with an icon |
| Read-only | Surface-subtle background, normal text color, no focus trap |

**Color is never the only signal** (§10): every status color pairs with an icon and text.

### 3.2 Typography

#### 3.2.1 Font recommendations [P]

| Use | Recommendation | Fallback stack |
| --- | --- | --- |
| Arabic UI and body | **IBM Plex Sans Arabic** | `"Noto Sans Arabic", Tahoma, system-ui, sans-serif` |
| Latin (platform and brand names, URLs, numerals in code) | **IBM Plex Sans** (pairs metrically with the Arabic face) | `Inter, system-ui, sans-serif` |
| Monospace (codes, only in admin if needed) | System monospace | |

- Fonts must be **self-hosted** with a `font-display: swap` strategy and Arabic + Latin subsets, so no third-party font request is made on page load. This is consistent with the "no third-party trackers" principle (§8.1) but is a [P] decision [OD D-02].
- Font licensing (open-source licenses such as OFL) must be confirmed before shipping [L].
- Arabic text must never be letter-spaced; `letter-spacing: 0` for Arabic runs; no italics, no faux bold; avoid all-caps tricks (not applicable to Arabic).

#### 3.2.2 Scale (rem, base 16 px) [P]

| Token | Size / line-height | Weight | Use |
| --- | --- | --- | --- |
| `type-display` | 2.5rem / 1.4 | 700 | Homepage hero slogan (desktop) |
| `type-h1` | 2rem / 1.4 | 700 | Page title |
| `type-h2` | 1.5rem / 1.5 | 700 | Section title |
| `type-h3` | 1.25rem / 1.5 | 600 | Card title, subsection |
| `type-h4` | 1.125rem / 1.6 | 600 | Small headings, table headers |
| `type-body` | 1rem / 1.75 | 400 | Body text (Arabic line-height is deliberately taller) |
| `type-body-sm` | 0.875rem / 1.7 | 400 | Dense lists, secondary text |
| `type-label` | 0.875rem / 1.5 | 600 | Form labels, chips, buttons |
| `type-caption` | 0.8125rem / 1.6 | 400 | Captions, metadata, timestamps (never below 13 px) |
| `type-number` | inherits, `font-variant-numeric: tabular-nums` | 500 | Ratings, counts, amounts |

Mobile steps: `display` 1.875rem, `h1` 1.625rem, `h2` 1.375rem. Body never drops below 16 px on mobile (prevents browser zoom on inputs).

#### 3.2.3 Readability requirements

- Comfortable measure: reading text blocks max about 65–75 characters (≈ 40rem) [P].
- Paragraph spacing at least 0.75× body size; text must reflow at 200% zoom and with user text-spacing overrides (WCAG 1.4.12).
- Avoid justified Arabic text (uneven spacing). Use start alignment.
- Quote/long-text areas (reviews, chat) use `type-body`.
- Truncation: avoid mid-word truncation; use line clamping with an accessible "more" control for long reviews [P].

### 3.3 Spacing [P]

4 px base unit. Tokens: `space-0` 0, `space-1` 4, `space-2` 8, `space-3` 12, `space-4` 16, `space-5` 24, `space-6` 32, `space-7` 48, `space-8` 64, `space-9` 96.

| Context | Rule |
| --- | --- |
| Inline gap between icon and text | `space-2` |
| Form field vertical gap | `space-4`; label-to-field `space-2` |
| Card padding | `space-4` (mobile), `space-5` (desktop) |
| Section vertical rhythm | `space-7` (mobile), `space-8` (desktop) |
| Page side padding | `space-4` (mobile), `space-5` (tablet), container-centered on desktop |
| Touch-target gap | At least `space-2` between adjacent targets |

Use logical properties (`margin-inline-start`, `padding-inline-end`, `inset-inline-start`) exclusively for horizontal spacing so layouts mirror correctly (§4).

### 3.4 Layout

#### 3.4.1 Containers and widths [P]

| Token | Value | Use |
| --- | --- | --- |
| `container-reading` | 40rem (640 px) | Long text: About, Guidelines, Privacy, Terms, Help entries |
| `container-content` | 75rem (1200 px) | Standard page content |
| `container-wide` | 90rem (1440 px) | Admin tables and wide dashboards |
| Page side gutter | 16 px mobile / 24 px tablet / 32 px desktop | |

#### 3.4.2 Grid

12-column grid on desktop (gap 24 px), 8 on tablet (gap 16 px), 4 on mobile (gap 16 px). Directory cards: 1 column (list or small mobile), 2 columns (large mobile/tablet), 3 columns (desktop), 4 columns (wide desktop) in grid view [P]. Columns flow from the right in RTL.

#### 3.4.3 Breakpoints [P] (none approved)

| Name | Range | Typical device |
| --- | --- | --- |
| `bp-xs` | 0–479 px | Small mobile |
| `bp-sm` | 480–767 px | Large mobile |
| `bp-md` | 768–1023 px | Tablet |
| `bp-lg` | 1024–1439 px | Desktop |
| `bp-xl` | ≥ 1440 px | Wide desktop |

#### 3.4.4 Header behavior [A: sticky, shrinks on scroll — CD-004]

- Navbar is sticky at the top. Default height 72 px (desktop) / 64 px (mobile); shrunk state 56 px / 52 px [P]. Shrink triggers after a small scroll (≈ 24 px) with a short transition; with `prefers-reduced-motion` the change is instant.
- In the shrunk state the logo scales down and secondary text hides; search and the member controls stay.
- The sticky header must not cover focus targets: `scroll-padding-top` equals the shrunk header height.

#### 3.4.5 Sidebar behavior

| Context | Desktop | Mobile |
| --- | --- | --- |
| Platform Details sections [A CD-009] | Sticky sidebar at the start edge (right in RTL), 16–18 rem wide, scroll-spy highlights the current section | Compact dropdown at the top (a sticky selector) |
| Directory filters [A CD-006] | Sidebar at the start edge | Drawer or bottom sheet with an "Apply"/"Show results (n)" action [P] |
| My ATHAR / Settings section nav | Start-edge vertical nav | Horizontal scrollable tabs or a dropdown [P] |
| Admin | Collapsible start-edge side navigation | Off-canvas drawer |

### 3.5 Elevation, radius, motion [P]

| Token | Value |
| --- | --- |
| `radius-sm / md / lg / full` | 6 / 10 / 16 / 9999 px |
| `shadow-1` | `0 1px 2px rgba(20,24,28,.08)` (cards at rest) |
| `shadow-2` | `0 4px 16px rgba(20,24,28,.12)` (menus, sticky header shadow) |
| `shadow-3` | `0 12px 32px rgba(20,24,28,.18)` (modals) |
| `motion-fast / base / slow` | 120 / 200 / 320 ms, ease-out |
| Reduced motion | When `prefers-reduced-motion: reduce`, replace transitions with instant changes; no parallax; no auto-playing animation |

In dark theme elevation is conveyed by lighter surfaces (`surface` → `surface-subtle`), not stronger shadows.

### 3.6 Components

Common rules for **every** component: logical CSS properties only; works in light and dark; minimum 44×44 px touch target for interactive controls on touch screens (36 px height allowed for dense admin tables on desktop only); visible focus per §3.1.3; no information by color alone; accessible name present; state set covers default, hover (pointer), focus-visible, active, disabled, loading and error where applicable.

#### 3.6.1 Buttons

| Aspect | Specification |
| --- | --- |
| Purpose | Trigger an action. One primary button per view region. |
| Variants | `primary` (filled), `secondary` (outline), `tertiary` (text), `destructive` (error color; used only for irreversible actions), `icon-only`, `link-button` |
| Sizes | `sm` 36 px (dense desktop/admin only), `md` 44 px (default), `lg` 52 px (hero, auth) |
| States | Default, hover, focus-visible (ring with 2 px surface gap on filled variants), active, disabled, **loading** (spinner replaces icon, label stays, `aria-busy`, clicks blocked to prevent duplicate submission) |
| Interaction | Activates on click/Enter/Space; loading state prevents double submit (§8); destructive actions require confirmation (modal) unless reversible with undo |
| Accessibility | Native `<button>`; icon-only buttons need `aria-label`; do not use disabled buttons as the only explanation of why an action is unavailable (show helper text); directional icons mirror in RTL |

#### 3.6.2 Inputs (text, email, password, number, date)

| Aspect | Specification |
| --- | --- |
| Purpose | Single-line data entry |
| Variants | Default, with leading icon, with trailing action (show/hide password), with unit/currency prefix, read-only |
| Sizes | `md` 44 px, `lg` 52 px |
| States | Default, hover, focus, filled, disabled, read-only, error, success (only where validation is meaningful) |
| Interaction | Visible persistent label above the field (placeholder never replaces the label); helper text below; inline error below the field on blur and on submit; password field has a show/hide toggle |
| Accessibility | `<label for>`; `aria-describedby` links helper and error; `aria-invalid` on error; `autocomplete` attributes (email, new-password, current-password); email/password/URL/number fields use `dir="ltr"` with start alignment for content, labels remain RTL; numeric inputs use `inputmode` appropriate to the field |

#### 3.6.3 Textareas

| Aspect | Specification |
| --- | --- |
| Purpose | Multi-line text (review comments, notes, appeals, evidence, contact message) |
| Variants | Default, with character counter (only where the baseline sets a limit, e.g. chat 2,000 characters), auto-grow (chat composer) |
| Sizes | Min 3 rows (forms); composer 1–6 rows auto-grow |
| States | As inputs, plus counter-warning near the limit |
| Interaction | Counter shows "n / 2000" and announces only at thresholds (not on every keystroke) |
| Accessibility | Same as inputs; counter is `aria-live="polite"` on threshold change only; `dir="auto"` for user text so mixed Arabic/Latin start correctly |

#### 3.6.4 Selects

| Aspect | Specification |
| --- | --- |
| Purpose | Choose one value from a short list (state, reason, currency, payment status, experience type) |
| Variants | Native `<select>` (default on mobile), custom listbox (desktop, when search inside is needed e.g. currency) |
| Sizes | `md`, `lg` |
| States | Default, hover, focus, open, disabled, error |
| Interaction | Native on touch devices; custom listbox supports type-ahead; chevron mirrors position (at the end edge) |
| Accessibility | Native semantics preferred; custom listbox follows the ARIA combobox/listbox pattern with arrow keys, Home/End, Escape |

Experience type in the review form (four values) is presented as a **radio group** (not a select) so all options are visible [P].

#### 3.6.5 Dropdowns and menus

| Aspect | Specification |
| --- | --- |
| Purpose | Profile menu, sort menu, row actions, section dropdown on mobile |
| Variants | Action menu, navigation menu, selection menu (sort) |
| Sizes | Min width 12 rem; items 44 px tall |
| States | Item default, hover, focus, selected (`aria-checked`/`aria-current`), disabled |
| Interaction | Opens on click/Enter; closes on Escape, outside click, selection; arrow-key navigation; opens from the start edge in RTL |
| Accessibility | `aria-haspopup`, `aria-expanded`; focus returns to the trigger on close; menus are not hover-only |

#### 3.6.6 Tabs

| Aspect | Specification |
| --- | --- |
| Purpose | Switch between sibling views (e.g., Settings sections on mobile, review filters, admin queues) |
| Variants | Underline tabs, pill tabs; scrollable on small screens |
| Sizes | 44 px height |
| States | Default, hover, focus, selected, disabled; badge count optional |
| Interaction | Left/Right arrow keys move focus (mirrored visual order in RTL: the DOM order is logical and arrows follow visual direction); Home/End |
| Accessibility | `role="tablist/tab/tabpanel"`, `aria-selected`, `aria-controls`; scrollable tab bars show a fade at the overflow edge and keep the selected tab in view |

#### 3.6.7 Cards

| Aspect | Specification |
| --- | --- |
| Purpose | Group related content: platform, community, review, suggestion |
| Variants | `card-default`, `card-interactive` (whole card is a link), `card-compact` (list view), `card-warning` (carries Warning flag) |
| Sizes | Fluid within grid; min width 16 rem |
| States | Default, hover (shadow-2), focus-visible, selected (compare), loading skeleton |
| Interaction | Interactive cards have one main link (the title); secondary actions (Favorite, Compare) are separate buttons that do not trigger the main link |
| Accessibility | Do not nest interactive elements inside a single anchor; card title is a heading at the right level; selected state announced via `aria-pressed` on the Compare button |

#### 3.6.8 Badges and chips

| Aspect | Specification |
| --- | --- |
| Purpose | Compact labels: status, counts, filters, tags |
| Variants | `badge-status` (icon + text), `badge-count`, `chip-filter` (removable), `chip-choice` (selectable), `badge-role` (staff role in chat) |
| Sizes | `sm` 24 px (non-interactive), `md` 32 px (visual) with 44 px hit area for interactive chips |
| States | Default, hover, focus, selected, disabled; removable chips show a remove button |
| Interaction | Filter chips remove on click/Delete; unread count badge caps at "9+" [A RD-G2] |
| Accessibility | Remove button `aria-label` includes the filter name; counts use text, not color alone |

#### 3.6.9 Tooltips

| Aspect | Specification |
| --- | --- |
| Purpose | Short supplementary explanation (icon meaning, "how ratings work" teaser) |
| Variants | Tooltip (non-interactive, text only), popover (interactive, for definitions with links) |
| States | Hidden, visible (on hover and on focus), dismissible with Escape |
| Interaction | Appears after 300 ms hover or immediately on keyboard focus; never contains essential information; touch devices open popovers on tap |
| Accessibility | `role="tooltip"` with `aria-describedby`; content reachable without hover; persistent until dismissed (WCAG 1.4.13) |

#### 3.6.10 Modals (dialogs)

| Aspect | Specification |
| --- | --- |
| Purpose | Confirmations and short focused tasks (confirm delete review, leave community, external-link notice, join panel) |
| Variants | `dialog-confirm`, `dialog-form` (short), `dialog-notice` (leaving ATHAR) |
| Sizes | `sm` 24 rem, `md` 32 rem; full-screen sheet on `bp-xs` for forms |
| States | Closed, open, submitting, error |
| Interaction | Opens centered with scrim; focus moves to the heading/first field; Escape and a close button dismiss (except while submitting); destructive confirmation names the object ("حذف تقييمك لمنصة …") |
| Accessibility | `role="dialog"`, `aria-modal`, labelled by heading; focus trap; focus returns to the trigger; background inert; scroll locked |

Long forms (review, suggestions, appeals) are **pages** per the sitemap routes (SF-OD-06), not modals [P].

#### 3.6.11 Drawers and bottom sheets

| Aspect | Specification |
| --- | --- |
| Purpose | Mobile filters [A CD-006], mobile navigation, admin off-canvas navigation |
| Variants | Start-edge drawer (navigation), bottom sheet (filters, sort) |
| Sizes | Drawer 85% width, max 22 rem; bottom sheet up to 85% height |
| States | Closed, open, dragging (optional), loading content |
| Interaction | Opens with a visible control; closes via Escape, close button, scrim tap; filter sheet has a sticky footer: "عرض النتائج (n)" and "مسح الكل" [P]; no swipe-only dismissal |
| Accessibility | Same as modals; the drawer slides from the **start** edge (right in RTL), reduced-motion safe |

#### 3.6.12 Toasts

| Aspect | Specification |
| --- | --- |
| Purpose | Transient success or neutral confirmation ("تم الحفظ") |
| Variants | `toast-success`, `toast-info`; errors that need action use inline alerts, not toasts |
| States | Entering, visible (5–8 s, pausable on hover/focus), dismissed |
| Interaction | Appears at the bottom, centered; optional single "تراجع" action where an undo exists; never the only record of an important outcome |
| Accessibility | `role="status"` (polite); not removed while focused; does not steal focus; errors are not auto-dismissed |

#### 3.6.13 Alerts and banners

| Aspect | Specification |
| --- | --- |
| Purpose | Persistent messages: Warning flag, connection lost, read-only/locked community, Suspended-or-closed platform, restricted account |
| Variants | `alert-info`, `alert-success`, `alert-warning`, `alert-error`; `banner-platform-warning`; `banner-system` |
| States | Visible, dismissible (only non-critical), collapsed |
| Interaction | Inline near the affected content; critical banners are not dismissible; includes a text action if there is a next step |
| Accessibility | `role="alert"` for errors that appear dynamically, `role="status"` for non-urgent; each variant has an icon and a heading/lead word, not color alone |

#### 3.6.14 Tables

| Aspect | Specification |
| --- | --- |
| Purpose | Admin queues, earnings ledger, applications list, comparison table, audit log |
| Variants | `table-data` (sortable), `table-compare` (sticky first column), `table-ledger`; responsive "stacked cards" form on mobile |
| Sizes | Row 44 px (member), 36–40 px (admin dense) |
| States | Loading skeleton rows, empty, error, row hover/selected, sorted column |
| Interaction | Sort by activating column header buttons; sticky header on desktop; horizontal scroll inside a bordered container with a visible scroll hint where needed; numeric columns use tabular figures and end-aligned in the table's own direction |
| Accessibility | Real `<table>` with `<th scope>`; captions; `aria-sort`; horizontal scroll region is keyboard-focusable; currency cells isolate LTR direction (§4.6) |

#### 3.6.15 Pagination

| Aspect | Specification |
| --- | --- |
| Purpose | Page through directory and admin results [A CD-007] |
| Variants | Numbered with previous/next (desktop); compact "page x of y" with previous/next (mobile) |
| States | Default, current, disabled previous/next at ends, loading |
| Interaction | Changing pages preserves filters and sort and returns focus to the results heading; the URL reflects the page; "previous" points to the **right** in RTL |
| Accessibility | `<nav aria-label="التنقل بين الصفحات">`, `aria-current="page"`, arrows have accessible text |

#### 3.6.16 Search fields

| Aspect | Specification |
| --- | --- |
| Purpose | Hero, navbar and directory search over **platforms only** [A RD-A8]; community search in Browse Communities; chat search inside one community [A RD-D12] |
| Variants | `search-hero` (lg), `search-navbar` (collapsing to an icon on mobile), `search-inline` |
| States | Idle (shows popular work types and categories), typing (grouped suggestions: platforms, work types, payment methods, categories), loading suggestions, no results (approved copy "لسه ملقيناش اللي بتدور عليه، جرّب مجال تاني."), error (typed search still submits) |
| Interaction | Combobox with grouped options; Enter submits free text; selecting a platform opens it, selecting a term opens the directory with it applied; clear button; suggestions never include communities or members |
| Accessibility | ARIA combobox pattern (`aria-expanded`, `aria-activedescendant`), groups labelled, results count announced politely, Escape closes |

#### 3.6.17 Filters

| Aspect | Specification |
| --- | --- |
| Purpose | Narrow directory results [A CD-006] |
| Variants | Sidebar (desktop), bottom sheet or drawer (mobile); filter groups: category, availability in Egypt, opportunity type, payment method, experience level (checkbox groups); active-filter chips; Clear All |
| States | Collapsed/expanded groups, checked, disabled (option with zero results, optional), loading counts |
| Interaction | Multi-select; OR inside a group, AND across groups [A RD-A3]; each change updates the result count; chips are individually removable; selections persist on return from a platform page |
| Accessibility | Each group is a `<fieldset>` with `<legend>`; the count of results is announced politely; mobile sheet has a labelled title and a visible close |

#### 3.6.18 Rating components

| Aspect | Specification |
| --- | --- |
| Purpose | Display and collect star ratings (1–5) |
| Variants | `rating-display` (stars + numeric average + count), `rating-summary` (with breakdown by experience type), `rating-input` (radio group), `rating-empty` |
| Sizes | Display `sm` 16 px stars, `md` 20 px, `lg` 28 px; input stars 40×40 px hit area |
| States | Display: has rating / "Not enough reviews yet"; Input: default, hover, focus, selected, error (rating required), disabled |
| Interaction | Display shows the **real average** and the review count [A RD-A6]; the headline average appears only with at least 3 qualifying reviews [A], otherwise the text "لسه مفيش تقييمات كفاية" (suggested copy) plus the count of all reviews; stars fill starting from the **right** in RTL; the numeric value "4.3" is isolated LTR |
| Accessibility | Display: `role="img"` with `aria-label` ("التقييم 4.3 من 5 بناءً على 12 تقييمًا"); input: `radiogroup` with five radios labelled "1 من 5" … "5 من 5"; never rely on star color alone; half-stars optional [P] |

The headline rating is a **Community experience** signal and is never styled like a verification indicator [A RD-B3].

#### 3.6.19 Platform status indicators

| Aspect | Specification |
| --- | --- |
| Purpose | Show availability for Egyptians and the independent Warning flag [A RD-A2] |
| Variants (availability) | **Available** — success tint + check-circle icon; **Available with restrictions** — info tint + info-note icon (+ restriction note link); **Unavailable** — neutral-strong tint + slash-circle icon; **Suspended or closed** — neutral-strong tint + lock/pause icon; **Not yet confirmed** — neutral outline + question icon. Suggested Arabic labels: متاحة / متاحة بشروط / غير متاحة / متوقفة أو مغلقة / غير مؤكدة بعد |
| Variant (flag) | **Warning / under review** — amber warning tint + triangle icon; a full-width **banner** on Platform Details and comparison, a compact badge on cards. Suggested label: "بلاغات قيد المراجعة" (neutral wording; never "fraud" or "scam") |
| States | Static; the badge on cards is not interactive; the banner may expand to show the dated note |
| Interaction | The availability badge and the Warning flag always render **side by side** when both apply; the Warning flag never replaces availability |
| Accessibility | Icon + text always; `aria-label` includes the full state; amber Warning flag uses a distinct icon from the *Needs Review* verification chip (§3.6.20) |

#### 3.6.20 Verification indicators

| Aspect | Specification |
| --- | --- |
| Purpose | Show the status, date, source and reviewer label of each fact [A CD-010, RD-B1, RD-B3] |
| Variants (status chip) | **Verified** — success tint + shield-check icon; **Needs Review** — amber tint + clock-refresh icon (always with last verified date); **Unconfirmed** — neutral outline + dashed-circle icon. Suggested labels: تم التحقق / بحاجة إلى مراجعة / غير مؤكد |
| Variants (layer label) | **From the platform** — outline chip with building icon ("من المنصة"); **Verified by ATHAR** — primary-soft chip with shield icon ("تم التحقق منه بواسطة أثر"); **Community experience** — secondary-tint chip with people icon ("تجارب المجتمع"). The word "official/رسمي" is not used [A] |
| Fact row anatomy | Fact label → value → status chip → "آخر تحقق: {date}" → source link (title, access date) → "راجعه فريق أثر" (reviewer label) |
| States | Static; the source list expands/collapses; stale items keep their last date visible |
| Accessibility | The status is text, not just an icon; dates are in `<time datetime>`; the layer label is part of the heading/section accessible name |

#### 3.6.21 Navigation elements

| Element | Behavior |
| --- | --- |
| Navbar | Sticky, shrinks on scroll [A]; items in reading order for guests and members (§3 of the sitemap); current item `aria-current="page"` |
| Mobile menu | Menu button opens a start-edge drawer with the same items; search opens full-screen |
| Profile menu | Menu button with display name; items from the sitemap §3.3 |
| Notification bell | Icon button with unread count badge (capped at 9+), opens the list or navigates to `/notifications`; count announced as text |
| Breadcrumbs [P] | `<nav aria-label="مسار الصفحة">`; separators mirrored (›→‹ visually); the current page is plain text |
| Section nav (Platform Details, Settings, My ATHAR) | Vertical list at the start edge, scroll-spy; mobile dropdown/tabs |
| Footer | Six approved links; consistent on all public pages |
| Skip link | First focusable element: "تخطي إلى المحتوى الرئيسي" |

#### 3.6.22 Domain components

| Component | Specification |
| --- | --- |
| `platform-card` | Name (heading), categories, availability badge, Warning badge, headline rating or "not enough reviews", last verification date, Favorite button, Compare checkbox-button. Grid and list variants. Platform logo slot optional [OD D-05]. |
| `review-card` | Display name (link only if the profile is public), experience-type chip, stars, date, "edited" marker, advantages and challenges, text, **"تجربة يرويها المستخدم"** label (suggested copy), Report action. Never styled as verified. |
| `chat-message` | Display name, optional staff role badge, time, text with plain-text links (visible domain, no previews), "edited" marker, placeholders "تم حذف الرسالة" / "أُزيلت بواسطة المشرف" (suggested), Report in the message menu; **no reply, reaction or mention controls** [A]. |
| `chat-composer` | Auto-grow textarea, send button, counter near limit, disabled states (read-only, locked, muted) with reason text. |
| `pinned-bar` | Collapsible bar at the top of chat, up to 5 pins labeled Rules/Resource/Announcement. |
| `tracking-status-chip` | The six statuses: Interested, Account Created, Test Passed, Started Receiving Tasks, Currently Working, Stopped Working; icon + text; never used for application states. |
| `application-state-chip` | The ten application states; guided next-step hint. |
| `safety-notice` | Permanent chat notice (suggested copy in §7); not dismissible. |
| `empty-state` | Illustration (optional), one line, one action. |
| `skeleton-*` | Shape-matched placeholders for cards, rows, messages, sections. |

---

## 4. RTL and Localization

Applying `dir="rtl"` flips block flow and inline alignment, but it does **not** by itself correct icon direction, mixed Arabic/Latin runs, numbers, scroll positions, animations, carousels, charts, or fixed-side positioning. Every item below must be implemented and verified explicitly. Approved: Arabic-first, full RTL, Latin names render correctly inside RTL, no English localization in V1 [A] (CD-020, CD-022, FR-95).

### 4.1 Directionality

- The document root is `lang="ar"` with `dir="rtl"`. Language and direction are set on the root, not per component.
- Use **logical CSS properties** (`inline-start/end`, `block-start/end`, `margin-inline`, `padding-inline`, `border-inline-start`, `inset-inline-start`, `text-align: start`). Physical `left/right` is forbidden for layout, except for the few cases listed in §4.3.
- Where a fragment's language differs (Latin brand name, URL, code), mark it with its own `lang`/`dir` or wrap in a bidi isolate.

### 4.2 Text alignment

| Content | Alignment |
| --- | --- |
| Arabic text | Start (right) |
| User-generated text (reviews, chat, notes) | `dir="auto"` per paragraph so Latin-first text aligns correctly |
| Latin-only fields (email, URL, password) | `dir="ltr"` content, right-aligned in the RTL form so the field aligns with its label [P] |
| Numbers in tables | End-aligned in table direction, tabular figures |
| Headings and buttons | Start; button labels centered inside buttons |
| Justified text | Not used |

### 4.3 Layout mirroring

| Element | RTL behavior |
| --- | --- |
| Navbar order | Logo at the start edge (right), actions at the end edge (left) |
| Sidebars (Platform Details, filters, settings, admin) | At the start edge (right) |
| Drawers | Slide in from the right (start edge) |
| Breadcrumbs | Read right to left; separators mirrored |
| Pagination | "Previous" points right, "Next" points left |
| Carousels, steppers, progress, timelines | Progress runs right to left; first item at the right |
| Star ratings | First star at the right; fill grows leftward |
| Tabs | First tab at the right; arrow keys follow visual direction |
| Tables | First column at the right; sticky first column sticks to the right edge |
| Horizontal scroll containers | Scroll origin at the right edge; verify `scrollLeft` behavior across browsers [P] |
| Sliders/range controls (if any) | Minimum at the right |
| Toast and floating action positions | Anchored with logical inset values; centered by default |
| Animations | Slide-in/out directions mirrored; no left-right assumptions in keyframes |
| Chat | Message list flows top to bottom; each message block aligns to start; the composer's send button is at the **end** edge (left) |
| Directional shadows/gradients | Mirrored (e.g., fade at overflow edge appears on the correct side) |

### 4.4 Icons

| Mirror in RTL | Do **not** mirror |
| --- | --- |
| Back/forward and next/previous arrows, chevrons indicating direction, breadcrumb separators, list-indent, send, external-link arrows, progress/timeline arrows, undo/redo | Logos, checkmarks, plus/close, clock, warning triangle, info, shield, lock, bell, trash, user, globe, phone, camera, media transport (play/pause), star shape, thumbs, language-neutral symbols, numerals |

Icons with text must keep the icon at the **start** edge of the label unless it is a trailing chevron/arrow (end edge). Decide per icon in the icon set; document exceptions in the component README [P].

### 4.5 Mixed Arabic and English text

- Wrap every Latin platform name, brand name, URL and domain inside Arabic text in a bidi isolate (`<bdi>` or `unicode-bidi: isolate`), so adjacent Arabic punctuation does not jump (e.g., "منصة <bdi>Upwork</bdi>.").
- Never concatenate translated strings with variables; use message templates with named placeholders and isolate each placeholder (e.g., "راجعه فريق أثر في {date}").
- URLs and domains render LTR and are never truncated at the start; truncate in the middle with an ellipsis and provide the full value in a tooltip/`title` fallback for sighted keyboard users via focus.
- Latin names in headings and cards use the Latin font; ensure baseline alignment with the Arabic font (adjust `size-adjust`/line-height if needed).
- Quotation marks: use Arabic quotation marks « » or “ ” consistently per style guide [P]; do not mix.
- Chat and review text uses `dir="auto"`; an automatic link detector must keep link text isolated.

### 4.6 Numbers, dates and currency

All three are open as design decisions [OD D-04]; the baseline does not specify digit style, date format or currency formatting. Proposed defaults:

| Topic | Proposal [P] | Reason |
| --- | --- | --- |
| Digits | Western digits (0–9) throughout the UI (ratings, counts, amounts, dates) | Consistency with Latin names, exports (CSV/Excel), and numeric inputs; Arabic-Indic digits can be added later |
| Locale formatting | Use locale-aware formatting with Arabic (Egypt) locale and Latin numbering (e.g., tag `ar-EG-u-nu-latn`) | Arabic month and weekday names with Latin digits |
| Dates | Gregorian, absolute format "12 نوفمبر 2026" for verification dates, source access dates, review dates and status history; relative time ("منذ 3 أيام") only for notifications and chat, with the absolute date available on focus/hover | Verification dates must be unambiguous |
| Date inputs | Native date inputs on mobile; typed field with explicit format hint on desktop; validated ISO value stored | Avoid ambiguity |
| Currency | Amount followed by the ISO code, LTR-isolated: "1,250.00 EGP"; the original currency is always shown for ledger entries; converted summaries show "≈" and the rate details [A RD-E7] | Unambiguous with multiple currencies |
| Percentages and ranges | LTR-isolated ("40%") | Prevents sign/percent flipping |
| Phone numbers | Not collected in V1 (no phone requirement [A]) | — |

### 4.7 Form behavior in RTL

- Labels sit above fields, start-aligned; required/optional markers are text ("(اختياري)"), not an asterisk alone.
- Field order follows reading order (top to bottom, right to left for side-by-side fields).
- Password show/hide toggle sits at the **end** edge inside the field.
- Numeric steppers and currency prefix: the ISO code appears at the end of the amount inside the field's LTR content; the prefix/suffix container is mirrored.
- Auto-complete and browser validation messages follow the document language; custom messages are provided in Arabic.
- Placeholder text is never the only label.

### 4.8 Responsive navigation (RTL)

Mobile drawer slides from the right; the back control icon is the mirrored chevron; horizontally scrolling tabs start at the right; the Platform Details section dropdown opens aligned to the start edge; bottom sheets are direction-neutral but their content is RTL. Swipe gestures, if any, are mirrored and always have an equivalent visible control.

### 4.9 RTL verification (required checks)

Switch OS/browser language and font fallbacks; check Android and iOS system fonts, long Arabic strings (+40% expansion not required but test long words), mixed content, forms with browser autofill, printing/PDF of exports (Arabic text opens correctly in CSV/Excel [A RD-E8]), and screen readers in Arabic.

---

## 5. Global Layouts

Layout regions are named by **logical** position: *start* = right in RTL, *end* = left. Breakpoints are the proposed `bp-*` values (§3.4.3).

### 5.1 Public pages layout (PUB-*, HLP-*, AUTH-*)

| Region | Content | Behavior |
| --- | --- | --- |
| Skip link | "تخطي إلى المحتوى الرئيسي" | First focusable element |
| Header | Sticky navbar [A]: logo (start), Platforms, Communities, About, Help, search, Sign in / Sign up (end) | Shrinks on scroll [A]; collapses to a menu button below `bp-md` |
| Breadcrumbs [P] | On Platform Details and Community pages only | Hidden on Home |
| Main | `container-content` (or `container-reading` for text pages); sections separated by `space-7/8` | Landmark `<main id>` |
| Aside | Sidebar for filters (directory) or sections (Platform Details) | Start edge on `bp-lg+`, drawer/dropdown below |
| Footer | Six approved links + brand line | Same on every public page |

### 5.2 Authenticated user pages layout (MEM-*)

| Region | Content | Behavior |
| --- | --- | --- |
| Header | Navbar for members: logo, Platforms, Communities, My ATHAR, bell, profile menu [A] | Sticky/shrinking |
| Section navigation | My ATHAR sections: Platforms, Applications, Earnings, Contributions, Communities, Settings (+ Favorites provisional) | Start-edge vertical nav on `bp-lg+`; scrollable tabs/dropdown below |
| Main | Personal content on `container-content`; calm layout, no ads or promotional panels | Private-area cue (a small lock indicator in the page title area) [P] |
| Footer | Same as public | |

The private-area cue reassures members that this content is not public; it is decorative plus text ("خاص بك").

### 5.3 Community pages layout (PUB-05, PUB-06, COM-01)

| Page | Layout |
| --- | --- |
| PUB-05 Browse Communities | Public layout; search field + sort control at the top; card grid |
| PUB-06 Community Information | Public layout; header card with name, platform link, member count, activity indicator, Join; rules summary; no messages |
| COM-01 Chat Room | **Immersive layout**: slim header (community name, member count, pinned-bar toggle, search, leave/overflow menu), pinned bar (collapsible), message list (scrollable region), safety notice (always visible), composer (sticky at the bottom). On mobile it is full-screen with a back chevron; on desktop it sits inside `container-content` with a fixed-height chat panel [P]. Footer hidden on mobile. |

### 5.4 Administrative pages layout (ADM-*)

| Region | Content | Behavior |
| --- | --- | --- |
| Header | Compact admin header: logo, current role badge, notification/alerts, profile | Distinct accent strip to avoid confusion with the public site [P] |
| Side navigation | Role-filtered items (only what the role may use) [A] | Collapsible at `bp-lg+`; off-canvas below |
| Main | `container-wide`; page title, filters toolbar, data table or queue + detail panel | Tables dense (36–40 px rows); sticky headers |
| Detail panel | Opens at the end side on `bp-xl`, full page below | |
| Footer | Minimal | |

### 5.5 Mobile layouts [P beyond the approved items]

- Single column; side padding 16 px; sticky compact header (52–64 px).
- Primary navigation in a start-edge drawer; search in a full-screen layer.
- Filters in a bottom sheet [A]; Platform Details sections in a sticky dropdown [A].
- Chat full-screen; composer pinned above the keyboard; the safety notice is collapsed to one line with an expand control but stays present.
- Tables become stacked cards.
- Bottom tab bar is **not** introduced (it would add a navigation pattern outside the approved top-level items) [OD D-06].

---

## 6. Screen-by-Screen Specifications

**Conventions.** Each screen table follows the same fields. Routes are the sitemap's suggested paths (SITEMAP A-01). "Layout" refers to §5. All screens inherit §3 components, §4 RTL rules, §7 states and §10 accessibility; only screen-specific points are listed. Screens marked *provisional* depend on an open decision. Suggested Arabic copy is marked "(suggested)" and is not approved.

### 6.1 Public screens

#### PUB-01 — Landing page (Home)

| Field | Specification |
| --- | --- |
| Purpose | Introduce ATHAR and start discovery [A CD-004] |
| User roles | Guest, member |
| Route | `/` |
| Layout structure | Public layout (§5.1); full-width sections on `container-content` |
| Header content | Sticky navbar [A]; for members: bell + profile menu |
| Main content | In order [A §10.1]: (1) **Hero** — slogan "من أثرٍ جئنا، وإلى أثرٍ نمضي." as H1, the supporting message, `search-hero` with the prompt "بتدور على بداية جديدة؟"; (2) **Digital Work Categories** — approved Fields copy + category tiles; (3) **Featured Platforms** — approved Platforms copy + up to ~6 `platform-card`s; (4) **Active Communities** — approved Community copy + 3–6 community cards (name, description, member count, activity indicator, Join/Open), **no message text, authors or previews**; (5) **User Journey** — static explainer of the stages (discover, understand, prepare, start, share; names are placeholders to be written in tone); (6) **Short About** — approved Philosophy copy + link to About; (7) Footer |
| Sidebar / navigation | None |
| Main components | `search-hero`, category tile, `platform-card`, community card, `empty-state` (when a pool is empty: fewer cards), footer |
| User actions | Search; open category/platform/community; Join (guest → sign-in); Sign up from the journey section |
| Interaction behavior | Navbar shrinks on scroll; featured cards refresh daily server-side (no carousel autoplay); signed-in members see the compact "Continue your journey" card (or starting-points card) in place of User Journey; community cards show "Open" for joined communities |
| Validation rules | None. Zero-result search uses the approved copy |
| Responsive behavior | `bp-xs`: single column, tiles 2-up, community cards stacked; `bp-md`: 2-up grids; `bp-lg+`: 3-up; hero search full width; no horizontal carousels required |
| Accessibility | One H1 (slogan); each section has an H2; tiles and cards are single links; no auto-advancing content; the aggregate community line (if shown above its threshold of 20 [F]) is plain text |
| Related flows | F-01, F-03, F-13 |
| Related PRD | FR-HOME-001, FR-DIR-002, FR-COM-001 |

#### PUB-02 — Platform Directory

| Field | Specification |
| --- | --- |
| Purpose | Search, filter, sort and browse platforms [A CD-005 to CD-007] |
| User roles | Guest, member |
| Route | `/platforms` (state in query: search term, filters, sort, view, page) |
| Layout structure | Public layout with start-edge filter sidebar (desktop) |
| Header content | Page title with approved Platforms copy as intro; `search-inline`; result count |
| Main content | Toolbar (result count, sort menu, grid/list toggle, filter button on mobile), active-filter chips + Clear All, results (`platform-card` grid or compact list), pagination, **compare tray** (sticky bar: selected platforms, "قارن" button, max 3) |
| Sidebar / navigation | Filter panel: category, availability in Egypt, opportunity type, payment method, experience level (§3.6.17) |
| Main components | `search-inline`, filters, chips, `platform-card`, sort menu, pagination, compare tray, skeleton cards |
| User actions | Search, filter, sort, switch view, paginate, Favorite, select for compare, open platform |
| Interaction behavior | Default sort Popularity (Relevance with a search term) [A RD-A5]; Suspended-or-closed platforms hidden by default, shown when that availability state is selected [A RD-A4]; filter changes update URL and count; selections persist on return from a platform page [A RD-A3]; selecting a 4th compare item shows an inline message |
| Validation rules | None (filters are controlled vocabularies) |
| Responsive behavior | Sidebar → bottom sheet/drawer below `bp-lg` with sticky "عرض النتائج (n)"; grid columns 1/2/3/4 by breakpoint; compare tray becomes a bottom bar |
| Accessibility | Results region has a live count update; filter groups are fieldsets; pagination returns focus to the results heading; compare tray is a labelled region |
| Related flows | F-02, F-03, F-04, F-06, F-27 |
| Related PRD | FR-DIR-001, FR-SRCH-001, FR-FILT-001, FR-CMP-001 |

**PUB-02-S — Search results (state of PUB-02).** The search term appears as a removable chip "بحث: {term}"; sort shows Relevance; matches by name, category, work type, payment method; community results never appear. Zero results: the approved copy "لسه ملقيناش اللي بتدور عليه، جرّب مجال تاني." in an `empty-state` with a "مسح الفلاتر" action and, for members, an optional link to *Suggest a platform* (MEM-12) [P, REC from sitemap].

**PUB-02-F — Filtered results (state of PUB-02).** Active chips list each selected option; result count reflects OR-within/AND-across logic; "مسح الكل" clears all; when no platform matches, the same empty state appears with the active chips preserved.

#### PUB-03 — Platform Comparison

| Field | Specification |
| --- | --- |
| Purpose | Compare up to three platforms [A CD-008] |
| User roles | Guest, member |
| Route | `/compare?platforms={a},{b},{c}` |
| Layout structure | Public layout, `container-wide` table |
| Header content | Title, count "n من 3", "إضافة منصة" action |
| Main content | `table-compare`: header cells with platform name, availability badge, Warning flag (banner chip), headline rating; rows (each fact with status chip + date): availability, work types, payment methods, requirements, experience level, advantages and challenges. **Layer labels** on row groups; if "advantages and challenges" derive from reviews they are labelled *Community experience* [OD D-08, PRD OD-15] |
| Sidebar / navigation | None |
| Main components | `table-compare`, `platform-status`, verification chips, remove button, `empty-state` |
| User actions | Add/remove platform; open a platform |
| Interaction behavior | Sticky first column (fact labels at the right) and sticky header; platforms removable; a missing fact shows "غير موثّق بعد" (suggested) |
| Validation rules | Maximum 3 platforms; fewer than 2 prompts adding another |
| Responsive behavior | Below `bp-md`: table scrolls horizontally inside a focusable container with sticky first column, or switches to per-fact stacked blocks [P] |
| Accessibility | Real table with `scope`; the status is text; the scroll container has an accessible name and keyboard focus |
| Related flows | F-06 |
| Related PRD | FR-CMP-001 |

#### PUB-04 — Platform Details

| Field | Specification |
| --- | --- |
| Purpose | Show verified facts, sources, status and community experience [A CD-009] |
| User roles | Guest, member (actions need an account) |
| Route | `/platforms/{slug}` (sections as in-page anchors) |
| Layout structure | Public layout with start-edge section sidebar (desktop) / sticky dropdown (mobile) [A] |
| Header content | Platform name (H1), logo slot, availability badge, Warning flag (if set), platform-level "آخر تحقق" date, headline rating (community signal), "راجعه فريق أثر" + date, action bar: Favorite, Compare, Write review, Suggest edit, Report, Open community (plus provisional "Track" [SF-OD-07]) |
| Main content | **Warning banner** (if flag set) under the header. Ten sections [A: ten; contents proposed, OD D-09 / PRD OD-07]: 1 Overview and identity; 2 Availability in Egypt; 3 Eligibility and requirements; 4 Registration and application steps; 5 Tests and acceptance; 6 Work types and experience level; 7 Payment methods and withdrawal; 8 Links and sources (links *from the platform*); **9 Community experience**; 10 Update history and status history. Sections 1–8 and 10: fact rows with layer label, status chip, verification date, sources, reviewer label [A RD-B3]. Section 9: `rating-summary` (headline rating or "not enough reviews", breakdown by the four experience types), review filter by experience type, `review-card` list, "اكتب تجربتك" CTA |
| Sidebar / navigation | Ten-section list with scroll-spy; link "كيف يعمل التحقق؟" to HLP-06 |
| Main components | `platform-status`, `verification-*`, `layer-label`, `rating-*`, `review-card`, `alert-*`, `table` for history |
| User actions | Navigate sections; Favorite; Compare; Write review; Suggest edit (per fact); Report; Open community; filter reviews; expand sources |
| Interaction behavior | Suspended-or-closed shows its state and keeps the community link; a section without data says "لم يتم توثيق هذا القسم بعد" (suggested); *Needs Review* facts show the last verified date; Warning banner is non-dismissible; the update history shows what changed and when (no contributor identity) |
| Validation rules | None on this page; the word "official/رسمي" is not used; "fraud/scam" text is never generated |
| Responsive behavior | `bp-lg+`: sidebar + content; below: sticky section dropdown under the header, action bar collapses into a primary action (Favorite) + overflow menu |
| Accessibility | One H1; sections are `<section>` with headings; sidebar is a labelled `<nav>` with `aria-current`; status and layer are text; review filter is a radio group |
| Related flows | F-05, F-06, F-12, F-19, F-23, F-27 |
| Related PRD | FR-PLAT-001, FR-SRC-001, FR-VER-001, FR-STAT-001, FR-XP-001, FR-RAT-001 |

#### PUB-05 — Browse Communities (Community directory)

| Field | Specification |
| --- | --- |
| Purpose | Discover communities [A CD-118] |
| User roles | Guest, member |
| Route | `/communities` |
| Layout structure | Public layout |
| Header content | Title with approved Community copy; `search-inline` ("ابحث باسم المجتمع أو المنصة", suggested placeholder); sort menu |
| Main content | Community cards: name, description, member count, activity indicator, "مجتمع جديد" label where applicable [A], Join/Open |
| Sidebar / navigation | None |
| Main components | `search-inline`, sort menu (activity default, newest, member count), community card, pagination or "load more" [P] |
| User actions | Search; sort; open a community; Join (guest → sign-in) |
| Interaction behavior | No message previews anywhere; EF-01: no copy implies a public Q&A list; empty search → "مفيش مجتمعات مطابقة للبحث" (suggested) |
| Validation rules | None |
| Responsive behavior | Cards 1/2/3 columns |
| Accessibility | Search results count announced; cards are single links; Join is a separate button |
| Related flows | F-13 |
| Related PRD | FR-COM-001 |

#### PUB-06 — Community Information (Community details)

| Field | Specification |
| --- | --- |
| Purpose | Show public community info and the join gate [A CD-105] |
| User roles | Guest, member |
| Route | `/communities/{slug}` |
| Layout structure | Public layout, header card + content |
| Header content | Name, link to the platform page, member count, activity indicator, state banner (Read-only/locked/Archived; Suspended-or-closed platform), primary button (Join / Open / Sign in to join) |
| Main content | Description; **rules summary** (public field); "كيف نتعامل هنا" links to Guidelines (HLP-05); the **join panel** (appears on Join): states that chat history is visible to new members, shows the safety notice, Confirm / Cancel. **No messages, authors or previews** |
| Sidebar / navigation | Breadcrumbs: Home › Communities › Name |
| Main components | Header card, `alert-info` banners, join `dialog`, `safety-notice` |
| User actions | Join, Open, go to the platform, read Guidelines |
| Interaction behavior | Join is immediate on confirm, no approval; joining a Read-only community is allowed and posting disabled; guest Join → sign-in and return; a joined member sees Open |
| Validation rules | Email-verification gating is provisional (PRD OD-02); the UI shows no gate unless that decision changes |
| Responsive behavior | Header card stacks; the join panel is a full-screen sheet on `bp-xs` |
| Accessibility | Dialog pattern for the join panel; the primary button's name includes the community name |
| Related flows | F-13, F-30 |
| Related PRD | FR-COM-001, FR-MEM-001 |

#### PUB-07 — User profile (public)

| Field | Specification |
| --- | --- |
| Purpose | Opt-in, link-only, unlisted public profile [A CD-014, RD-F2] |
| User roles | Guest, member (visible only when the owner opted in) |
| Route | `/profiles/{id}` (SF-OD-03) |
| Layout structure | Public layout, `container-reading` |
| Header content | Display name; photo (if shown); bio |
| Main content | Only the fields the owner enabled: governorate, interests, experience level; statistics limited to reviews written, accepted contributions, member-since (month and year); joined communities only if opted in; reviews/contributions list if enabled. **Never** earnings, applications or tracking [A] |
| Sidebar / navigation | None |
| Main components | Profile header, stat list, `review-card` list, `empty-state` |
| User actions | Open a listed review's platform; Report account |
| Interaction behavior | When first made public only display name and bio show; no follow/message controls (V1 has none); the page is `noindex`; a private or non-existent profile shows a neutral "هذا الملف غير متاح" without revealing which [P] |
| Validation rules | None |
| Responsive behavior | Single column |
| Accessibility | Profile photo has empty `alt` if decorative or the display name as alt; stats are a description list |
| Related flows | F-20 |
| Related PRD | FR-PROF-001 |

#### PUB-08 — About ATHAR

| Field | Specification |
| --- | --- |
| Purpose | Story, mission and vision, how ATHAR helps, principles, contact, policy links [A CD-018] |
| User roles | Guest, member |
| Route | `/about` |
| Layout structure | Public layout, `container-reading` |
| Header content | Slogan and supporting message; page title |
| Main content | Story; mission and vision (text pending, OD D-10 / PRD OD-12); how ATHAR helps; principles (free core, no paid ranking, no selling data, evidence over opinion, privacy by default); the approved Philosophy copy; contact and links to Privacy, Terms, Guidelines, How Verification Works. No claim of partnership with any initiative [A RD-J5] |
| Sidebar / navigation | Optional in-page anchors |
| Main components | Headings, `link-button`s, footer |
| User actions | Read; follow links |
| Interaction behavior | None |
| Validation rules | None |
| Responsive behavior | Single column |
| Accessibility | Heading hierarchy; readable measure |
| Related flows | F-01 |
| Related PRD | FR-HELP-001 |

### 6.2 Authentication screens

#### AUTH-01a — Registration (Sign up)

| Field | Specification |
| --- | --- |
| Purpose | Create an account [A CD-013] |
| User roles | Guest |
| Route | `/signup` |
| Layout structure | Auth layout: centered card, logo slot, `container-reading` narrow |
| Header content | Title "إنشاء حساب" (suggested); one-line value statement |
| Main content | "المتابعة بحساب Google" button; divider; fields: display name (3–30 characters; helper: "مش لازم تكتب اسمك الحقيقي"), email, password (at least 10 characters, breached-password check, no composition rules), signup challenge, checkbox "أوافق على الشروط وسياسة الخصوصية" with links (HLP-04, HLP-03). **No phone field. Age field: not shown (PRD OD-03 undefined)** |
| Sidebar / navigation | Link "عندي حساب بالفعل" → sign in |
| Main components | Inputs, password field, challenge, checkbox, buttons, `alert-error` |
| User actions | Submit; Google; go to sign in |
| Interaction behavior | Inline validation on blur and submit; submit button loading state; success → AUTH-02 pending; returns to the triggering page afterwards |
| Validation rules | Display name 3–30 characters, not derived from the email, no reserved words (ATHAR, Admin, Moderator, staff impersonation) [A RD-F3]; password rule [A RD-F8]; disposable emails blocked [A RD-F9]; terms acceptance required and recorded |
| Responsive behavior | Card full width on `bp-xs` |
| Accessibility | Labels; error summary at the top focusable on submit; `autocomplete` values; the challenge has an accessible alternative |
| Related flows | F-07, AF-05 |
| Related PRD | FR-ACC-001 |

#### AUTH-01b — Login (Sign in)

| Field | Specification |
| --- | --- |
| Purpose | Access an account |
| User roles | Guest |
| Route | `/login` |
| Layout structure | Auth layout |
| Header content | "تسجيل الدخول" (suggested) |
| Main content | Google button; email; password with show/hide; "نسيت كلمة المرور؟" link; submit; link to sign up |
| Sidebar / navigation | None |
| Main components | Inputs, buttons, `alert-error` |
| User actions | Sign in; Google; recover password |
| Interaction behavior | Success returns to the page that triggered sign-in, else My ATHAR [A]; suspended accounts land on MEM-15; staff continue to two-factor |
| Validation rules | Generic credential error (no hint which field is wrong) [P]; temporary lockout message after repeated failures [A RD-F8] |
| Responsive behavior | As AUTH-01a |
| Accessibility | Error announced via `role="alert"`; focus moves to the first error |
| Related flows | AF-01 |
| Related PRD | FR-ACC-001, FR-ACC-002 |

#### AUTH-02 — Email verification

| Field | Specification |
| --- | --- |
| Purpose | Confirm email; states: pending, verified, link expired |
| User roles | Member, guest with link |
| Route | `/verify-email` |
| Layout structure | Auth layout |
| Header content | State title |
| Main content | *Pending*: "راجع بريدك" message + "إعادة إرسال" (with cooldown message); *Verified*: success + "متابعة"; *Link expired*: error + resend |
| Sidebar / navigation | None |
| Main components | `alert-*`, buttons |
| User actions | Resend; continue |
| Interaction behavior | Returns to the page that required verification |
| Validation rules | Resend limited by abuse rules (no number invented) |
| Responsive behavior | Centered card |
| Accessibility | State change announced politely |
| Related flows | AF-05, F-07, F-12 |
| Related PRD | FR-ACC-001 |

#### AUTH-03 — Password recovery

| Field | Specification |
| --- | --- |
| Purpose | Reset a password; states: request, sent, reset, success, link expired [A §4.4] |
| User roles | Guest |
| Route | `/forgot-password`, `/reset-password` |
| Layout structure | Auth layout |
| Header content | State title |
| Main content | Request: email field; Sent: neutral confirmation (does not confirm whether the account exists [P]); Reset: new password (≥ 10 characters, breached check) + confirmation; Success: link to sign in; Expired: new request |
| Sidebar / navigation | Back to sign in |
| Main components | Inputs, buttons, alerts |
| User actions | Request, set password, sign in |
| Interaction behavior | After success other sessions end and a confirmation email is sent [A] |
| Validation rules | As password rules |
| Responsive behavior | Centered card |
| Accessibility | As AUTH-01a |
| Related flows | AF-03 |
| Related PRD | FR-ACC-001, FR-ACC-002 |

### 6.3 Personal workspace screens (members)

All MEM screens use the authenticated layout (§5.2), require sign-in (redirect to AUTH-01 and back), show only the member's own data, and are never exposed to staff [A RD-F10].

#### MEM-01 — My ATHAR (including first-time onboarding)

| Field | Specification |
| --- | --- |
| Purpose | Personal journey home; default landing after sign-in [A CD-015, RD-E5] |
| User roles | Member |
| Route | `/my` |
| Layout structure | Authenticated layout; two-column on desktop (main + side summary), single column on mobile |
| Header content | Welcome with the display name (suggested copy: "أهلاً {name}") |
| Main content | (1) "كمّل رحلتك" card: most recently updated platform and its next step; (2) platforms being followed (up to 6, with status chips); (3) recent activity (own updates; important updates on saved/tracked platforms); (4) up to 3 rule-based suggested next steps using only the member's own data; (5) dismissible, gentle prompt to share an experience when a platform is Currently Working or Stopped Working and has no review. **No KPIs, charts, earnings figures, feeds or content from other members** [A] |
| Sidebar / navigation | Section nav: Platforms, Applications, Earnings, Contributions, Communities, Settings (+ Favorites, provisional) |
| Main components | Journey card, `tracking-status-chip`, activity list, suggestion cards, dismissible prompt |
| User actions | Continue; open platform; act on a suggestion; dismiss the prompt |
| Interaction behavior | **First-time variant (onboarding):** three starting-point cards — explore fields, see featured platforms, join the General community (opt-in) [A RD-E5, RD-D13]; no wizard [A]; dismissible |
| Validation rules | None |
| Responsive behavior | Side summary moves below the main column on `bp-md-` |
| Accessibility | Cards are labelled regions; the prompt is dismissible via keyboard; the dismiss action is announced |
| Related flows | F-08, F-09 |
| Related PRD | FR-MYA-001 |

#### MEM-02 — My Platforms

| Field | Specification |
| --- | --- |
| Purpose | Track one entry per platform with six statuses [A CD-015, RD-E1] |
| User roles | Member |
| Route | `/my/platforms` |
| Layout structure | Authenticated layout |
| Header content | Title, "إضافة منصة" button |
| Main content | Status tabs [P] (All + the six statuses: Interested, Account Created, Test Passed, Started Receiving Tasks, Currently Working, Stopped Working); entry list: platform name, status chip, last update date, note indicator; entry detail: status history (dated), private notes, links to the platform, its community and the member's review |
| Sidebar / navigation | Section nav |
| Main components | Tabs, `tracking-status-chip`, status select, notes textarea, history list, `empty-state` |
| User actions | Add platform (search among published platforms), change status, add note, open platform/community/review, remove entry |
| Interaction behavior | One entry per platform (adding an existing one opens it); each status change is stamped with the date; after the first add, offer once to join the community; removal asks for confirmation; Favorites and tracking are independent [A CD-205] |
| Validation rules | Only the six statuses; notes private |
| Responsive behavior | Table → stacked cards |
| Accessibility | Status change uses a labelled select; history is a list with `<time>` |
| Related flows | F-09, F-10 |
| Related PRD | FR-MYP-001 |

#### MEM-03 — My Applications

| Field | Specification |
| --- | --- |
| Purpose | Manual application records and states [A RD-E3] |
| User roles | Member |
| Route | `/my/applications` |
| Layout structure | Authenticated layout |
| Header content | Title, "إضافة طلب", Export menu (CSV, Excel) |
| Main content | List/table: platform, state chip (Planned, Submitted, Assessment pending, Test passed, Test failed, Waitlisted, Accepted, Rejected, Started work, Withdrawn), dates, link to previous attempt (reapply chain); detail with timestamped history |
| Sidebar / navigation | Section nav |
| Main components | `table-data`, `application-state-chip`, select, history list, export menu |
| User actions | Add; change state (any state allowed, with a "next step suggested" hint); Reapply; export |
| Interaction behavior | At *Test passed* or *Started work*, a non-blocking prompt offers a one-tap update of the platform status in My Platforms; the member confirms or declines; nothing updates automatically [A]; export asks for a recent sign-in confirmation |
| Validation rules | Required: platform and state; no state-order enforcement |
| Responsive behavior | Table → stacked cards |
| Accessibility | Hint text associated with the state select; the one-tap prompt is a polite alert with a clear Decline |
| Related flows | F-10 |
| Related PRD | FR-APP-001 |

#### MEM-04 — My Earnings

| Field | Specification |
| --- | --- |
| Purpose | Manual private earnings ledger [A RD-E6 to RD-E8] |
| User roles | Member |
| Route | `/my/earnings` |
| Layout structure | Authenticated layout |
| Header content | Title, display-currency select, "إضافة دخل", Export menu |
| Main content | `alert-info`: no tax or financial advice [A]; summaries grouped by **original currency** and payment status; converted summaries marked "≈" with a rate popover (rate, rate date, source); ledger table: date, platform, amount + ISO currency (LTR), payment status (Pending, Available in platform balance, Withdrawal requested, Received, Failed or disputed), note |
| Sidebar / navigation | Section nav |
| Main components | `table-ledger`, summary cards, select, rate popover, `alert-info` |
| User actions | Add/edit entry; set display currency; Recalculate a locked rate; enter own rate or actual received amount; export |
| Interaction behavior | Original amounts never overwritten; a rate locks on first use; with no disclosed rate for a date, the amount shows as its own subtotal and is not converted [A RD-E7]; no charts or trend graphics (calm, honest) |
| Validation rules | Required: amount, currency, date, payment status; platform and note optional |
| Responsive behavior | Table → stacked cards; summaries stack |
| Accessibility | Currency values are isolated LTR with the ISO code read as text; the "≈" has a text equivalent "تقريبًا" |
| Related flows | F-11 |
| Related PRD | FR-ERN-001 |

#### MEM-05 — My Contributions

| Field | Specification |
| --- | --- |
| Purpose | Reviews, edit suggestions, new-platform suggestions and their statuses [A §4.2] |
| User roles | Member |
| Route | `/my/contributions` |
| Layout structure | Authenticated layout |
| Header content | Title; buttons "اقترح منصة" (MEM-12) |
| Main content | Tabs: Reviews / Edit suggestions / New-platform suggestions; rows with platform, date, status chip (Pending, Accepted, Rejected + reason; or published/declined) |
| Sidebar / navigation | Section nav |
| Main components | Tabs, list rows, status chips, `empty-state` |
| User actions | Open item; edit/delete review; withdraw a pending suggestion |
| Interaction behavior | Rejections always show their reason; a "more information requested" note appears inside Pending |
| Validation rules | None |
| Responsive behavior | Stacked rows |
| Accessibility | Status chips as text |
| Related flows | F-12, F-18, F-19 |
| Related PRD | FR-CON-001 |

#### MEM-06 — My Communities

| Field | Specification |
| --- | --- |
| Purpose | Joined communities [A FR-43] |
| User roles | Member |
| Route | `/my/communities` |
| Layout structure | Authenticated layout |
| Header content | Title |
| Main content | List of joined communities: name, platform, member count, state; "فتح" and "مغادرة" actions; empty state → Browse Communities |
| Sidebar / navigation | Section nav |
| Main components | Community row, confirm dialog |
| User actions | Open chat; Leave |
| Interaction behavior | Leave asks for confirmation and states that access to history ends |
| Validation rules | None |
| Responsive behavior | Stacked rows |
| Accessibility | Each button names the community |
| Related flows | F-13, F-30 |
| Related PRD | FR-MEM-001 |

#### MEM-09 — Favorites *(provisional, PRD OD-01)*

| Field | Specification |
| --- | --- |
| Purpose | Personal saved list of platforms [A CD-205] |
| User roles | Member |
| Route | `/my/favorites` (provisional) |
| Layout structure | Authenticated layout |
| Header content | Title "المفضلة" (suggested) |
| Main content | `platform-card` (compact) list; empty state → directory |
| Sidebar / navigation | Section nav (provisional entry) |
| Main components | `platform-card`, `empty-state` |
| User actions | Open platform; remove favorite |
| Interaction behavior | Removing a favorite never changes My Platforms [A] |
| Validation rules | None |
| Responsive behavior | 1–3 columns |
| Accessibility | Remove has the platform name in its label |
| Related flows | F-27 |
| Related PRD | FR-FAV-001 |

#### MEM-07 — Notifications

| Field | Specification |
| --- | --- |
| Purpose | Full notification list behind the bell [A CD-016] |
| User roles | Member |
| Route | `/notifications` |
| Layout structure | Authenticated layout, `container-reading` |
| Header content | Title; "تعليم الكل كمقروء" |
| Main content | Newest first; similar items grouped; unread marker (dot + text for assistive tech); triggers: suggestion outcomes (N-01, N-02), moderation (N-03, N-05), report reviewed (N-04), platform updates (N-06), admin notices (N-07), export/deletion (N-08) |
| Sidebar / navigation | None |
| Main components | Notification row, group header, `empty-state` ("مفيش جديد") |
| User actions | Open item (marks read); mark one/all read |
| Interaction behavior | Content removed → an explanation instead of a dead link; no notification per chat message [A]; unread count capped at 9+ |
| Validation rules | None |
| Responsive behavior | Single column |
| Accessibility | Unread state is text; live region only for new items while the page is open, polite |
| Related flows | F-31 |
| Related PRD | FR-NOT-001 |

#### MEM-08 — Account Settings (including Privacy settings)

| Field | Specification |
| --- | --- |
| Purpose | Profile, privacy, security, currency, notifications, export, deletion, reports and appeals [A §4.2, RD-F7] |
| User roles | Member |
| Route | `/settings`, `/settings/{section}` |
| Layout structure | Authenticated layout with start-edge section nav |
| Header content | Title and section title |
| Main content | See sections table below |
| Sidebar / navigation | Profile, Privacy, Security and sessions, Display currency, Notifications, Data export, Account deletion, Reports and appeals |
| Main components | Forms, toggles (switches), session list, `dialog-confirm`, `alert-*` |
| User actions | Save per section; end sessions; request export; request deletion |
| Interaction behavior | Each section saves independently with a success toast; sensitive sections (export, deletion, email/password) ask for re-confirmation of sign-in |
| Validation rules | Display name 3–30 characters, changeable once per 30 days [F]; others per section |
| Responsive behavior | Section nav becomes a dropdown/scrollable tabs below `bp-lg` |
| Accessibility | Each switch has a visible label and state text; destructive area visually separated and labelled |
| Related flows | F-20, F-21, F-22, AF-01 |
| Related PRD | FR-PRIV-001, FR-PROF-001, FR-ACC-002, FR-DEXP-001, FR-DEL-001 |

**MEM-08 sections**

| Section | Content and rules |
| --- | --- |
| Profile | Display name; photo; bio; optional fields (governorate, interests, experience level) — all optional [A CD-116] |
| **Privacy (MEM-08-P)** | Profile public/private (default private); per-field show/hide; joined-communities visibility (hidden by default); show reviews and contributions on profile; helper text: "عند جعل الملف عامًا يظهر الاسم والنبذة فقط"; a live "preview as public" link to PUB-07 [P]; note that earnings, applications and tracking are never public |
| Security and sessions | Change password (ends other sessions); change email (confirmed at both addresses); active sessions list with "إنهاء الجلسة"; security emails explanation |
| Display currency | Select display currency (summaries only) |
| Notifications | Switch for platform-update notifications (N-06); a read-only list of notices that cannot be disabled (account, moderation, security) |
| Data export | Request (after confirmation); status (requested, ready 7 days); one request per 24 hours |
| Account deletion | Re-enter password; **required choice with no pre-selection** (delete reviews and messages / keep as "عضو سابق"); confirmation email; 14-day grace; "deletion pending" state with cancel-by-sign-in note |
| Reports and appeals | List of the member's reports and appeals with status; link to MEM-14 where an appeal is allowed |

#### MEM-10 — Write / edit review

| Field | Specification |
| --- | --- |
| Purpose | Submit or edit the member's one review per platform [A CD-101] |
| User roles | Verified member |
| Route | `/platforms/{slug}/review` |
| Layout structure | Authenticated layout, `container-reading` |
| Header content | "تجربتك مع {platform}" (suggested) and the Latin platform name isolated |
| Main content | Star rating (required); experience type radio group (required): Worked on the platform / Accepted but did not start work / Registered or explored only / Applied but failed the acceptance test or was rejected; advantages, challenges, comments (optional); confirmation checkbox: no affiliation and no compensation; link to Guidelines |
| Sidebar / navigation | Back to the platform |
| Main components | `rating-input`, radio group, textareas, checkbox, buttons |
| User actions | Submit; save edits; delete review |
| Interaction behavior | Publishes immediately after automated checks; blocked content shows which rule applied; edit mode if a review exists ("تعديل تجربتك"); delete via confirm dialog; the form states that the headline rating counts only "Worked on the platform" reviews [P helper text] |
| Validation rules | Rating and experience type required; affiliation confirmation required [A RD-C1]; no referral links/contact details/confidential task content; daily limit message [A RD-C3] |
| Responsive behavior | Single column |
| Accessibility | Radio group legend; error summary; the stars are radios |
| Related flows | F-12 |
| Related PRD | FR-REV-001, FR-RAT-001 |

#### MEM-11 — Suggest an edit (Submit correction)

| Field | Specification |
| --- | --- |
| Purpose | Propose a correction to a fact item [A CD-113] |
| User roles | Verified member |
| Route | `/platforms/{slug}/suggest-edit` |
| Layout structure | Authenticated layout, `container-reading` |
| Header content | Platform name and the selected fact label |
| Main content | Fact item (pre-selected when opened from a fact), current value (read-only), proposed value, evidence (link or description; required for substantive changes), "type of change" hint |
| Sidebar / navigation | Back to the platform |
| Main components | Select/readonly field, textareas, helper text, buttons |
| User actions | Submit; cancel |
| Interaction behavior | Evidence label changes to "مطلوب" when the change is substantive (availability state, or a Class 1/2 fact) and "اختياري" for minor observations; on success the item appears in My Contributions as Pending; no file attachments |
| Validation rules | Evidence required for substantive changes [A FR-30]; proposed value required |
| Responsive behavior | Single column |
| Accessibility | The required/optional change announced politely |
| Related flows | F-19 |
| Related PRD | FR-COR-001 |

#### MEM-12 — Suggest a platform

| Field | Specification |
| --- | --- |
| Purpose | Propose a new platform [A CD-107] |
| User roles | Verified member |
| Route | `/suggest-platform` |
| Layout structure | Authenticated layout, `container-reading` |
| Header content | Title and a note that admins verify independently before publication |
| Main content | Name or website (at least one), basic information (what it does, how it pays — free text); duplicate check result panel |
| Sidebar / navigation | Back to My Contributions |
| Main components | Inputs, textarea, `alert-info`, buttons |
| User actions | Submit |
| Interaction behavior | Duplicate found → shows the existing platform with a link; success → Pending in My Contributions; no official source required [A] |
| Validation rules | Name or website required; spam/duplicate detection [A RD-F9] |
| Responsive behavior | Single column |
| Accessibility | Duplicate result is a polite status |
| Related flows | F-18 |
| Related PRD | FR-SUG-001 |

#### MEM-13 — Report form

| Field | Specification |
| --- | --- |
| Purpose | Report a message, review, platform page or account [A CD-108] |
| User roles | Member (verified-email gating provisional, PRD OD-04) |
| Route | `/report?target={type}:{id}` |
| Layout structure | Dialog or page [OD SF-OD-06] |
| Header content | "إبلاغ عن {item type}" (suggested) |
| Main content | Reason radios: spam or promotion, suspected scam, harassment or abuse, confidential content, personal information, inaccurate information, other; optional note; reassurance text that the reporter will be told the report was reviewed without details |
| Sidebar / navigation | None |
| Main components | Radio group, textarea, buttons |
| User actions | Submit; cancel |
| Interaction behavior | Success toast; no action details revealed |
| Validation rules | Reason required |
| Responsive behavior | Full-screen sheet on `bp-xs` |
| Accessibility | Radio legend; focus returns to the origin item |
| Related flows | F-23 |
| Related PRD | FR-RPT-001 |

#### MEM-14 — Appeal form

| Field | Specification |
| --- | --- |
| Purpose | Appeal a moderation action [A RD-D10] |
| User roles | Affected user (including suspended users) |
| Route | `/appeals/{action-id}` |
| Layout structure | Authenticated or restricted layout, `container-reading` |
| Header content | Summary of the action and reason (as the user was told) |
| Main content | Explanation textarea; deadline info (14 days [F]); one-appeal-per-action note |
| Sidebar / navigation | None |
| Main components | Textarea, `alert-info`, buttons |
| User actions | Submit |
| Interaction behavior | After submission the page shows "تم استلام الاستئناف" (suggested) and the expected outcome notice path |
| Validation rules | Explanation required; blocked if the window passed or an appeal exists |
| Responsive behavior | Single column |
| Accessibility | As forms |
| Related flows | F-24 |
| Related PRD | FR-APL-001 |

#### MEM-15 — Restricted-account notice

| Field | Specification |
| --- | --- |
| Purpose | Explain a suspension and offer the appeal path [A §4.2] |
| User roles | Suspended member |
| Route | `/restricted` |
| Layout structure | Auth layout |
| Header content | "تم تعليق حسابك" (suggested; plain MSA) |
| Main content | Reason given, effective date, appeal button, sign out |
| Sidebar / navigation | None |
| Main components | `alert-warning`, buttons |
| User actions | Appeal; sign out |
| Interaction behavior | No other member features are reachable |
| Validation rules | None |
| Responsive behavior | Centered card |
| Accessibility | Heading + alert role |
| Related flows | F-24, AF-01 |
| Related PRD | FR-MOD-001, FR-APL-001 |

### 6.4 Community chat screen

#### COM-01 — Community Chat Room

| Field | Specification |
| --- | --- |
| Purpose | Flat group chat for joined members [A CD-011, CD-110, CD-203] |
| User roles | Joined members (moderation roles through their own tools) |
| Route | `/communities/{slug}/chat` |
| Layout structure | Immersive chat layout (§5.3) |
| Header content | Community name, platform link, member count, pinned-bar toggle, search button, overflow menu (Leave, Guidelines) |
| Main content | `pinned-bar` (≤ 5 pins; "ابدأ من هنا" system pin first for platform communities); message list; `safety-notice` (permanent; suggested copy: "لا تشارك كلمات المرور أو الرموز، ولا تدفع مقابل القبول."); connection banner; composer |
| Sidebar / navigation | Search panel (slides from the end edge): query field, results with author display name and date, open in context |
| Main components | `chat-message`, `chat-composer`, `pinned-bar`, search panel, `alert-*`, link-leaving `dialog-notice` |
| User actions | Read; send text/links; edit/delete own message; report any message; search; leave |
| Interaction behavior | Real-time messages; auto-scroll only when the user is at the bottom, otherwise a "رسائل جديدة ↓" jump control appears [P]; edited marker; deleted/removed placeholders; links shown as plain text with a visible domain, no previews, opening a leaving-ATHAR notice; **no reply, reaction, mention, thread, read receipt or typing indicator** [A]; slow mode shows a countdown; Read-only/locked disables the composer with a reason; muted users see the reason and the appeal path |
| Validation rules | 2,000-character limit [F]; rate limit 10/min [F]; duplicate blocked; links blocked in the first 24 hours after joining [F]; URL shorteners, group-invite links, blocklisted domains blocked; phone numbers/handles held for review |
| Responsive behavior | Full-screen on mobile with the composer above the keyboard; search opens as a full-screen layer; the pinned bar collapses to one line |
| Accessibility | Message list is a `role="log"` region with polite announcements throttled (not per message for fast streams); composer labelled; message actions via a menu button reachable by keyboard; unread-jump control is a button; connection status is a polite alert |
| Related flows | F-14, F-15, F-16, F-17, F-23, F-30 |
| Related PRD | FR-CHAT-001, FR-CHS-001, FR-MSG-001, FR-MOD-001 |

### 6.5 Help and legal screens

#### HLP-01 — Help Center & FAQ

| Field | Specification |
| --- | --- |
| Purpose | Searchable answers [A CD-114] |
| User roles | Guest, member |
| Route | `/help` |
| Layout structure | Public layout, `container-reading` |
| Header content | Title, `search-inline` ("ابحث في المساعدة", suggested) |
| Main content | Topic groups (signup, statuses, ratings, "How ratings work", privacy, reporting, deletion, export); accordion entries; "تواصل معنا" link |
| Sidebar / navigation | Topic anchors |
| Main components | `search-inline`, accordion, `empty-state` |
| User actions | Search; expand; contact |
| Interaction behavior | No match → empty state with Contact link; deep links open the entry |
| Validation rules | None |
| Responsive behavior | Single column |
| Accessibility | Accordion buttons with `aria-expanded`; search results count announced |
| Related flows | F-01, AF-03 |
| Related PRD | FR-HELP-001 |

#### HLP-02 — Contact

| Field | Specification |
| --- | --- |
| Purpose | Support, legal/takedown notices, reporting issues [A §4.1] |
| User roles | Guest, member |
| Route | `/contact` |
| Layout structure | Public layout, `container-reading` |
| Header content | Title and the stated response target (2 business days [F]) |
| Main content | Topic select (support, legal or takedown notice, report an issue); email (prefilled if signed in); message. The exact fields are not defined in the baseline [OD D-07] |
| Sidebar / navigation | None |
| Main components | Select, input, textarea, buttons |
| User actions | Submit |
| Interaction behavior | Success confirmation with the response target; takedown requests are routed for Content Admin handling [L] |
| Validation rules | Topic, email, message required [P] |
| Responsive behavior | Single column |
| Accessibility | As forms |
| Related flows | F-01 |
| Related PRD | FR-HELP-001 |

#### HLP-03 / HLP-04 / HLP-05 — Privacy Policy, Terms of Use, Community & Content Guidelines

| Field | Specification |
| --- | --- |
| Purpose | Standalone legal and rules pages [A RD-I4]; legal text drafted with counsel [L] |
| User roles | Guest, member |
| Routes | `/privacy`, `/terms`, `/guidelines` |
| Layout structure | Public layout, `container-reading` with an in-page table of contents |
| Header content | Title, "آخر تحديث" date |
| Main content | Long-form text in plain Modern Standard Arabic (no colloquial) [A RD-I6]; Guidelines cover chat, reviews and suggestions |
| Sidebar / navigation | In-page table of contents (sticky on desktop) |
| Main components | Headings, lists, anchor links |
| User actions | Read; follow links |
| Interaction behavior | Anchor links update focus; printing styles remove navigation |
| Validation rules | None |
| Responsive behavior | Table of contents collapses into a dropdown |
| Accessibility | Logical headings; readable measure |
| Related flows | F-07, F-12, F-23 |
| Related PRD | FR-HELP-001 |

#### HLP-06 — How Verification Works

| Field | Specification |
| --- | --- |
| Purpose | Explain statuses, intervals, sources and Warnings [A §4.1] |
| User roles | Guest, member |
| Route | `/how-verification-works` |
| Layout structure | Public layout, `container-reading` |
| Header content | Title |
| Main content | The three information layers; the three statuses (Verified, Needs Review, Unconfirmed) with the same chips as the product; review intervals; source standards; the Warning flag and neutral wording; the statement that negative reviews alone never establish fraud |
| Sidebar / navigation | In-page anchors |
| Main components | Verification chips, `layer-label`, table of intervals |
| User actions | Read |
| Interaction behavior | Linked from labels on PUB-04 |
| Validation rules | Intervals shown are labelled "قيم مبدئية قابلة للمراجعة" (suggested) because they are pilot settings [F] |
| Responsive behavior | Single column |
| Accessibility | Chips presented as text with definitions |
| Related flows | F-05 |
| Related PRD | FR-VER-001, FR-SRC-001, FR-STAT-001 |

### 6.6 Administrative screens

**Shared admin pattern** (applies to every ADM screen unless stated): admin layout (§5.4) with role-filtered side navigation; page header with title and role-specific filters; a queue/table on `container-wide`; a detail view opens in a side panel (`bp-xl`) or a full page (below); bulk actions are not provided except where noted; every state-changing action requires a **reason code** where the baseline demands one and shows a confirmation; sensitive actions ask for re-authentication [A RD-H4]; successful actions appear in the audit log (no UI to edit it); the dense table rows are 36–40 px; empty, loading and error states follow §7; keyboard operation for all queue actions; breadcrumbs `الإدارة › {page}`. Only the role-permitted controls are rendered (not merely disabled) [A §4.5]. Staff are shown to members as "ATHAR Moderation" [A RD-H6].

| ID / Name | Roles | Route | Main content and components | User actions and interaction | Validation rules | Flows / PRD |
| --- | --- | --- | --- | --- | --- | --- |
| **ADM-01** Admin Overview | MOD, CA, SA | `/admin` | Role-specific cards: queue counts by severity/age, due and overdue fact items, alerts (review-surge alerts: 10 or more reviews in 24 hours or most from accounts under 7 days old [F]), Warnings nearing the 60-day limit, pending second-approval requests; provisional "Help and support" area (SF-OD-01) | Open a queue/alert; filters by role | None | F-25, F-26 / FR-ADM-001, FR-ADM-004 |
| **ADM-02** Platform Management | CA, SA | `/admin/platforms` | Platform table (name, availability state, Warning flag, last verification, Featured status); editor: identity, vocabulary values, availability (restriction note when *Available with restrictions*), publish, Featured picks (re-confirm ≤ 30 days), Warning/Suspended requests | Create/edit/publish; request second approval; pick Featured; merge duplicates (SA) | Restriction note mandatory; two-person rule for Warning/Suspended/Featured-availability changes [A RD-B9]; unpublish rights undefined (PRD OD-09) | F-26, F-29 / FR-ADM-002, FR-STAT-001 |
| **ADM-03** Category Management | CA, SA | `/admin/vocabularies` | Tabs for the five vocabularies (category, work type, opportunity type, experience level, payment method); value list with usage counts | Add, edit, retire values | Keep opportunity type and experience level to about six values each [A RD-A1] | F-26 / FR-ADM-002 |
| **ADM-04** Information Verification | CA, SA | `/admin/verification` | Fact-item queue (due, overdue, Needs Review, Warning items at 14 days); item detail: sources (title, link, access date), status, verification date, next due, reviewer, history | Verify; set status; add/edit sources; request/approve second approver | Cannot verify one's own entry [A]; user reports alone cannot make an item Verified [A RD-B6]; no screenshot publication | F-26 / FR-VER-001, FR-SRC-001 |
| **ADM-05** Edit Suggestions Review | CA, SA | `/admin/suggestions` | Tabs: Edit suggestions, New-platform submissions; detail: fact item, proposed value, evidence, duplicates | Accept, reject (reason required), request more information (note inside Pending) | Rejection requires a reason; status Verified only if evidence meets source standards, otherwise Unconfirmed | F-28 / FR-COR-001, FR-SUG-001 |
| **ADM-06** Ratings and Reviews Management | CA, SA; MOD (hold only) | `/admin/reviews` | Review queue; detail with versions (internal history), reports, author experience type, review content, alerts | Hold; remove; restore; ask author to edit (reason code; moderators cannot rewrite text) | Reason code mandatory; MOD sees Hold only (authority conflict PRD SC-06) | F-25 / FR-REV-001, FR-MOD-001 |
| **ADM-07** Community Management | MOD, SA; CA view only | `/admin/communities` | Community list; editor: description, rules summary, pins (≤ 5 with Rules/Resource/Announcement labels), state (Open/Read-only/Archived), domain blocklist, slow-mode | Edit; pin/unpin; lock; maintain blocklist; archive (SA) | Max 5 pins; archive SA only; pins labelled | F-25 / FR-COM-001, FR-CHAT-001, FR-MOD-001 |
| **ADM-08** Reports and Moderation | MOD, CA, SA | `/admin/moderation` | Queues (messages and accounts → MOD; reviews and platform information → CA; all → SA) sorted by severity then age; report detail with context; action ladder; appeals tab | Dismiss; warn; hold/remove; mute 1 hour–7 days; restrict up to 30 days; recommend suspension/ban (MOD); suspend/ban (SA); decide appeals | Reason code + internal note mandatory; appeal decided by someone other than the original decider; response targets 24 h / 72 h [F] | F-25, F-24 / FR-RPT-001, FR-MOD-001, FR-APL-001 |
| **ADM-09** User and Role Management | SA | `/admin/users` | Account list with minimum necessary data (email visible to SA only); roles; data-export/deletion request queue | Grant roles; suspend/ban; process data requests | Re-authentication for role changes, bans, bulk deletions, data requests [A RD-H4]; no one can grant their own role; **no view of any member's earnings, applications, notes or tracking** | F-21, F-22 / FR-ADM-001 |
| **ADM-10** Analytics and Settings | SA full; CA, MOD own analytics | `/admin/settings` | Aggregates (small groups suppressed [A §8.6]); thresholds and settings; Help Center content and legal pages (provisional location, SF-OD-01) | View aggregates; edit thresholds and content | Thresholds are pilot settings [F]; legal pages drafted with counsel [L] | / FR-ADM-004, FR-HELP-001 |
| **ADM-11** Audit Log | SA all; CA, MOD own | `/admin/audit` | Read-only table: who, what, when, before/after, reason | Filter, search, export view (SA) [P] | Immutable; retained 24 months [L][F] | / FR-ADM-004 |

### 6.7 System pages and states

| ID | Page / state | Content (suggested copy marked) | Behavior |
| --- | --- | --- | --- |
| SYS-01 | 404 Not found | "الصفحة دي مش موجودة" (suggested; neutral MSA alternative acceptable) + search + links to Home and Platforms | Used for unknown paths and (provisionally) unpublished platforms |
| SYS-02 | 403 No access | "لا تملك صلاحية الوصول إلى هذه الصفحة." | Offers a way back to the user's start page |
| SYS-03 | Generic error | "حدث خطأ غير متوقع. حاول مرة أخرى." | Retry + Home |
| SYS-04 | Maintenance | "الموقع في صيانة مؤقتة. نعود قريبًا." | No navigation; logo only |
| SYS-05 | Session expired | "انتهت جلستك. سجّل الدخول للمتابعة." | Returns to the same page after sign-in |
| SYS-06 | Deletion pending | State within MEM-08: scheduled date and "تسجيل الدخول يلغي الحذف" (suggested) | Shown during the 14-day grace period |
| SYS-07 | Export ready | State within MEM-08 and notification: "ملف بياناتك جاهز للتحميل لمدة 7 أيام." | Download button; expiry date |

All system pages use the auth/minimal layout, one H1, and a primary action.

---

## 7. Important UI States

### 7.1 State catalog

| State | Treatment | Applies to |
| --- | --- | --- |
| **Loading** | Immediate shape-matched skeleton (no spinner-only pages); spinner inside buttons; `aria-busy` on the region; announce completion politely for long loads | Lists, details, chat history, forms submit |
| **Skeleton** | Neutral blocks at the component's final size; no shimmer under reduced motion; max 3 s before an error/slow-network message appears | Cards, rows, sections, messages |
| **Empty** | `empty-state`: optional illustration, one short colloquial line, one action | Directory, favorites, tracking, chat, contributions |
| **Error** | Inline `alert-error` with a precise MSA message and a retry action; the rest of the page remains usable; never blame the user | Any fetch/submit |
| **Success** | Toast for lightweight outcomes; inline success panel for multi-step outcomes (signup, export request) | Saves, submissions |
| **Disabled** | Control remains visible with a reason nearby ("الكتابة متوقفة مؤقتًا في هذا المجتمع") | Composer, buttons |
| **Read-only** | Surface-subtle, no focus ring on non-interactive text, label "للعرض فقط"; used for Read-only/locked communities and archived content | Communities, current-value fields |
| **Unauthorized** | Guest: sign-in prompt in place (not a dead end); signed-in without role: SYS-02 | Protected actions/pages |
| **Not found** | SYS-01; removed content from a notification explains the removal | Pages, notification targets |
| **Offline / connection failure** | Banner "انقطع الاتصال. بنحاول نتصل تاني تلقائيًا." (suggested); chat retries automatically; failed messages show Retry; forms keep input | Chat, all submissions |
| **Restricted** | Muted: composer disabled with reason and appeal link; suspended: MEM-15 | Chat, account |
| **Held for review** | Held messages show "الرسالة قيد المراجعة" to the author only (suggested) | Chat |
| **Stale** | *Needs Review* fact keeps its content with the chip and last verified date | Platform facts |
| **Warning flag** | Persistent banner with neutral text | Platform pages, comparison |

### 7.2 Suggested Arabic copy (not approved; subject to OQ-17)

| Context | Suggested Arabic | Register |
| --- | --- | --- |
| Zero-result search (approved) | لسه ملقيناش اللي بتدور عليه، جرّب مجال تاني. | Colloquial [A] |
| Empty favorites | لسه مفيش منصات في المفضلة. ابدأ باستكشاف المنصات وضيف اللي يعجبك. | Colloquial |
| Empty My Platforms | ابدأ رحلتك: ضيف أول منصة وسجّل خطوتك. | Colloquial |
| Empty chat | المجتمع لسه هادي. ابدأ إنت الكلام. | Colloquial |
| Empty notifications | مفيش جديد دلوقتي. | Colloquial |
| Not enough reviews | لسه مفيش تقييمات كفاية | Colloquial |
| Generic fetch error | تعذّر تحميل البيانات. تحقّق من اتصالك بالإنترنت ثم أعد المحاولة. | MSA |
| Submission failed | تعذّر إرسال النموذج. لم تُفقد بياناتك، حاول مرة أخرى. | MSA |
| Connection lost (chat) | انقطع الاتصال. نحاول إعادة الاتصال تلقائيًا. | MSA |
| Link-leaving notice | أنت على وشك مغادرة أثر إلى موقع خارجي. لا نتحكم في محتواه. | MSA |
| Held message | رسالتك قيد المراجعة قبل ظهورها. | MSA |
| Moderation notice | تمت إزالة رسالتك لمخالفتها إرشادات المجتمع. يمكنك تقديم استئناف خلال 14 يومًا. | MSA |
| Warning banner | بلاغات قيد المراجعة بخصوص هذه المنصة. راجع تاريخ آخر تحديث والمصادر. | MSA |
| Needs Review | بحاجة إلى مراجعة — آخر تحقق: {التاريخ} | MSA |

---

## 8. Forms and Validation

### 8.1 General form rules

| Rule | Specification |
| --- | --- |
| Labels | Always visible, above the field. Required fields are those the baseline marks required; optional fields are marked "(اختياري)" in text. No asterisk-only convention. |
| Inline validation | On blur for format errors; on submit for required fields; never validate while the user is still typing the first time; fix-state re-validates live |
| Errors | Below the field, with an icon, in MSA, specific and actionable ("كلمة المرور لا تقل عن 10 أحرف"); an **error summary** at the top lists all errors with anchors on submit and receives focus |
| Submission feedback | Button enters loading; on success show a toast or a success panel; on failure keep all input and show an inline `alert-error` with Retry |
| Duplicate submission prevention | Disable the submit control and set `aria-busy` while pending; ignore repeated Enter presses; the server also enforces idempotency where the baseline needs one-per-user rules (e.g., one review per platform) |
| Unsaved changes | Leaving a dirty form asks for confirmation [P] |
| Accessibility | One `<form>` per task; `autocomplete`; error messages linked via `aria-describedby`; focus management after submit; grouped options use `fieldset/legend`; touch targets ≥ 44 px |
| Business rules | Only the rules in the baseline are enforced in the UI; any other limit is an open decision |

### 8.2 Form catalog

| Form | Required | Optional | Validation (from the baseline) |
| --- | --- | --- | --- |
| Sign up (AUTH-01a) | Display name, email, password, terms acceptance, challenge | — | Display name 3–30 chars, not derived from email, no reserved words; password ≥ 10 chars and not known-breached; no phone; age field pending (OD-03) |
| Sign in (AUTH-01b) | Email, password | — | Lockout after repeated failures (value not specified) |
| Password reset (AUTH-03) | Email / new password | — | Password rule as above |
| Review (MEM-10) | Rating, experience type, affiliation confirmation | Advantages, challenges, comments | One review per platform; automated content checks; daily limit of 5 [F] |
| Suggest edit (MEM-11) | Fact item, proposed value; evidence if substantive | Evidence if minor | Substantive = availability state or Class 1/2 fact |
| Suggest platform (MEM-12) | Name or website | Basic information | Duplicate check |
| Report (MEM-13) | Reason | Note | — |
| Appeal (MEM-14) | Explanation | — | Within 14 days [F]; one per action |
| Application (MEM-03) | Platform, state | Notes | Any state allowed |
| Earnings (MEM-04) | Amount, currency, date, payment status | Platform, note | Original amount never overwritten |
| My Platforms (MEM-02) | Platform, status | Note | One entry per platform |
| Profile (MEM-08) | — (nothing required at registration) | Photo, bio, governorate, interests, experience level | Display name rules; once per 30 days [F] |
| Account deletion (MEM-08) | Password; explicit choice for reviews and messages | — | No pre-selected choice |
| Contact (HLP-02) | Topic, email, message (proposed) | — | Fields pending [OD D-07] |
| Chat composer (COM-01) | Text | — | ≤ 2,000 chars [F]; link/contact rules |
| Admin: platform, fact item, suggestion decision, moderation action | Per §6.6 | Internal notes | Reason codes and rejection reasons mandatory |

---

## 9. Responsive Design

Breakpoints are proposed [P] (§3.4.3). Behavior is specified for each range.

| Aspect | Small mobile (`xs`, <480) | Large mobile (`sm`, 480–767) | Tablet (`md`, 768–1023) | Desktop (`lg`, 1024–1439) | Wide desktop (`xl`, ≥1440) |
| --- | --- | --- | --- | --- | --- |
| Columns | 4 | 4 | 8 | 12 | 12 (max container 1200; admin 1440) |
| Navbar | Collapsed (menu button, search icon) | Same | Collapsed or condensed | Full navbar | Full |
| Directory filters | Bottom sheet | Bottom sheet | Drawer | Sidebar | Sidebar |
| Directory grid | 1 col | 2 col | 2 col | 3 col | 4 col |
| Platform Details sections | Sticky dropdown | Sticky dropdown | Sticky dropdown | Sidebar | Sidebar |
| Compare | Stacked per fact or scroll with sticky label column | Scroll | Table | Table | Table |
| My ATHAR | 1 col | 1 col | 2 col | 2–3 col | 3 col |
| Settings nav | Dropdown | Tabs | Tabs | Sidebar | Sidebar |
| Chat | Full-screen | Full-screen | Panel with side search | Panel with side search | Panel with side search |
| Admin | Off-canvas nav; stacked cards | Same | Collapsed nav; table | Side nav; table | Side nav; table + detail panel |
| Modals | Full-screen sheets | Sheets | Centered | Centered | Centered |
| Typography | Mobile scale | Mobile scale | Desktop scale | Desktop scale | Desktop scale |

Rules for all sizes: no horizontal page scroll; content reflows at 200% zoom and 400% for single-column; orientation not locked; touch targets ≥ 44 px; tables scroll within their own container; test on low-end Android devices and slow connections (performance targets pending, PRD OD-13).

---

## 10. Accessibility

Target: **WCAG 2.1 AA minimum** in both themes [A RD-I7]. Formal audit pending [A OQ-18].

| Area | Requirement |
| --- | --- |
| Keyboard navigation | Every function reachable and operable by keyboard; logical order follows RTL visual order; no keyboard traps except modal focus traps that release on close; skip link; roving tabindex for tabs/menus/listboxes; shortcuts (if any) are disable-able |
| Focus visibility | 2 px `color-focus` outline with 2 px offset on all focusable elements; never `outline: none` without a replacement; the sticky header never hides focused elements (`scroll-padding`) |
| Semantic structure | Landmarks (`header`, `nav`, `main`, `aside`, `footer`); one H1; headings in order; lists are lists; tables are tables with captions/headers; `<time datetime>` for dates; buttons vs links used correctly |
| Screen readers | Arabic language declared; correct names, roles, states; dynamic updates in appropriate live regions; chat log announces new messages politely without flooding; status chips read as text; star ratings have text equivalents; decorative images hidden |
| Contrast | Text ≥ 4.5:1 (≥ 3:1 for large text); UI components and control boundaries ≥ 3:1; focus ring ≥ 3:1; proposed tokens meet these (§3.1) but must be re-verified after any change; contrast checked for every status pair in both themes |
| Form labels | Persistent visible labels; instructions before the field; errors associated; required/optional in text |
| Touch targets | ≥ 44×44 px with ≥ 8 px spacing on touch; dense admin 36 px only for pointer devices |
| Reduced motion | Respect `prefers-reduced-motion`; no autoplay; no parallax; essential motion replaced by instant state change |
| Color independence | Status, validation and verification never rely on color alone |
| Accessible error messages | Specific, programmatically associated, announced with `role="alert"` on submit; focus moves to the error summary; never time-limited |
| Time limits | Toasts pausable and non-critical; session expiry warned in advance where feasible [P] |
| Zoom/reflow | No loss of content or function at 200% text zoom; 320 CSS px reflow |
| Language | Latin names isolated with the right `lang` so screen readers switch voices |
| Authentication | Password managers and paste allowed; the signup challenge has an accessible alternative |

---

## 11. UX Writing

### 11.1 Tone of voice [A RD-I6]

| Context | Register |
| --- | --- |
| Invitations, encouragement, onboarding, empty states | Warm Egyptian colloquial, short, friendly, second person singular |
| Legal text, security messages, verification statuses, moderation notices, precise errors, emails | Plain Modern Standard Arabic; neutral; no humor |
| Slogan | Approved MSA form only, unchanged |
| Sanctions and warnings | MSA only; no colloquial humor |

### 11.2 Arabic writing style [P]

Short sentences; active voice; consistent terms (the glossary terms: منصة, مجتمع, تقييم, تحقق, طلب, دخل); avoid transliterated English where an Arabic term is established; platform names stay in Latin; keep a term list with the editorial reviewer [OD D-11 / OQ-17]; never use "رسمي/official" for platform information [A]; address the user in a respectful, non-patronizing way; do not use exclamation marks in errors.

### 11.3 Message principles

| Type | Principles | Example (suggested) |
| --- | --- | --- |
| **Error** | Say what happened, why if known, and what to do; never blame; keep input | "تعذّر الحفظ. تحقّق من اتصالك ثم أعد المحاولة." |
| **Success** | Short, specific, past tense; no over-celebration | "تم حفظ التغييرات." |
| **Empty** | Colloquial, honest (no fake activity), one action | "لسه مفيش تجارب هنا. شارك تجربتك لو جرّبت المنصة دي." |
| **Confirmation (destructive)** | Name the object and the consequence; neutral verbs; cancel is the default focus | "حذف تقييمك لمنصة {Name}؟ سيختفي من الصفحة ومن حساب التقييم فورًا." |
| **Moderation** | State the reason and the appeal path; no accusation beyond the rule | "تمت إزالة المحتوى لمخالفته الإرشادات. يمكنك الاستئناف خلال 14 يومًا." |
| **Warning flag** | Neutral wording; never "fraud/scam"; point to sources and dates | "بلاغات قيد المراجعة بخصوص هذه المنصة." |
| **Privacy** | Explain effect plainly; never nudge toward public | "ملفك خاص حاليًا. عند جعله عامًا يظهر الاسم والنبذة فقط." |

---

## 12. Design Tokens and Component Naming

### 12.1 Token naming convention [P]

`category-role-variant-state`, kebab-case, with a **semantic layer** on top of a **primitive layer**: primitives (`palette-teal-600`) are never used in components; components use semantic tokens (`color-primary`).

| Group | Tokens (examples) |
| --- | --- |
| Color | `color-bg`, `color-surface`, `color-surface-subtle`, `color-text`, `color-text-muted`, `color-border`, `color-border-strong`, `color-primary`, `color-primary-hover`, `color-primary-active`, `color-primary-soft`, `color-secondary`, `color-success`, `color-success-bg`, `color-warning`, `color-warning-bg`, `color-error`, `color-error-bg`, `color-info`, `color-info-bg`, `color-focus`, `color-overlay` |
| Status | `status-availability-available`, `-restricted`, `-unavailable`, `-closed`, `-unconfirmed`; `status-flag-warning`; `status-verification-verified`, `-needs-review`, `-unconfirmed`; `status-layer-platform`, `-athar`, `-community` |
| Typography | `font-family-ar`, `font-family-latin`, `type-display`, `type-h1`…`type-h4`, `type-body`, `type-body-sm`, `type-label`, `type-caption`, `type-number` |
| Spacing | `space-0`…`space-9` |
| Radius | `radius-sm/md/lg/full` |
| Elevation | `shadow-1/2/3` |
| Motion | `motion-fast/base/slow`, `motion-reduced` |
| Layout | `container-reading/content/wide`, `bp-xs/sm/md/lg/xl`, `grid-gap-*`, `header-height`, `header-height-shrunk` |
| Z-index | `z-header`, `z-dropdown`, `z-drawer`, `z-modal`, `z-toast` |

### 12.2 Component naming [P]

| Rule | Example |
| --- | --- |
| PascalCase components, kebab-case CSS | `PlatformCard`, `.platform-card` |
| Variant and state as props/modifiers | `Button variant="primary" size="md" loading` |
| Domain prefixes for ATHAR concepts | `PlatformStatusBadge`, `VerificationChip`, `LayerLabel`, `RatingDisplay`, `RatingInput`, `ReviewCard`, `ChatMessage`, `ChatComposer`, `PinnedBar`, `TrackingStatusChip`, `ApplicationStateChip`, `SafetyNotice`, `EmptyState` |
| Tokens never hard-coded in components | Use `var(--color-primary)` |
| Logical props names | `inlineStart`, `inlineEnd`, not `left/right` |
| Test identifiers | `data-testid="platform-card"` for QA |
| Message keys | `feature.component.state` (e.g., `chat.composer.held`) |

---

## 13. Design QA Checklist

Use this list to validate an implementation. "Pass" means verified in light and dark, RTL, mobile and desktop.

**Brand and identity**
- [ ] The slogan and supporting message are reproduced exactly (including tanwin) and unchanged.
- [ ] Approved copy blocks (Fields, Platforms, Community, Philosophy, search prompt, zero-result copy) are exact.
- [ ] A logo placeholder is used until the approved asset exists; no invented logo/palette is presented as approved.

**Trust model**
- [ ] The three information layers use distinct labels and are never merged.
- [ ] The word "official/رسمي" is not used for platform information.
- [ ] Every fact shows status, verification date, source and reviewer label.
- [ ] *Needs Review* shows the last verified date.
- [ ] Reviews are labeled as user-reported experience, never "verified".
- [ ] The headline rating shows only with at least 3 qualifying reviews; otherwise "not enough reviews" plus the total count.
- [ ] The Warning flag is a separate banner coexisting with availability; no "fraud/scam" text.

**Community and privacy**
- [ ] Guests never see chat messages anywhere (homepage, cards, search, notifications).
- [ ] Chat has no reply, reaction, mention, thread, read receipt, typing indicator, image or attachment control.
- [ ] Messages show display names only; no avatars in chat.
- [ ] Chat links are plain text with a visible domain and a leaving-ATHAR notice; the safety notice is permanent.
- [ ] My ATHAR shows no KPIs, charts, earnings figures or feeds.
- [ ] Earnings, applications and tracking never appear publicly or in admin screens.
- [ ] The deletion choice has no pre-selected option.

**RTL**
- [ ] Layout uses logical properties; sidebars, drawers, breadcrumbs, pagination, tabs, stars and carousels mirror correctly.
- [ ] Directional icons mirror; object icons do not.
- [ ] Latin names, URLs, amounts and numbers are isolated and do not scramble punctuation.
- [ ] Email/URL/password inputs behave LTR inside the RTL form; user text uses `dir="auto"`.
- [ ] Horizontal scroll containers start at the right edge.
- [ ] Arabic text in CSV/Excel exports opens correctly.

**Components and states**
- [ ] Every component shows default, hover, focus-visible, active, disabled, loading and error where applicable.
- [ ] Loading skeletons match final shapes; empty states offer one action; errors offer retry and keep input.
- [ ] Buttons prevent duplicate submission.
- [ ] Toasts do not carry critical information.

**Accessibility**
- [ ] Text contrast ≥ 4.5:1, UI components ≥ 3:1 in both themes (re-computed if tokens changed).
- [ ] Focus ring visible everywhere and not hidden by the sticky header.
- [ ] Touch targets ≥ 44 px.
- [ ] Reduced motion respected; no autoplay.
- [ ] Forms have labels, an error summary and linked messages.
- [ ] Screen-reader pass in Arabic on key flows (directory, platform page, review, chat).

**Responsive**
- [ ] No horizontal page scroll at 320 px; content reflows at 200% zoom.
- [ ] Filters become a bottom sheet/drawer; Platform Details sections become a dropdown on mobile.
- [ ] Chat is full-screen on mobile with the composer above the keyboard.

**Routing and states**
- [ ] Protected pages redirect to sign-in and return; non-staff admin URLs show SYS-02.
- [ ] A non-member opening the chat URL lands on the community information page.
- [ ] Suspended-or-closed platforms remain reachable; their community stays Open with a banner.

---

## 14. Open Design Decisions

Inherited decisions keep their PRD/Sitemap IDs. New design-specific ones are numbered D-##.

| ID | Decision needed | Why it matters | Provisional handling |
| --- | --- | --- | --- |
| D-01 | **Brand palette, logo, typefaces, illustration style and icon set were not provided.** Approve or replace the proposals in §2–§3 | All visuals | Tokens are proposals; implement via tokens so replacement is cheap |
| D-02 | Font hosting and licensing (self-host vs third-party); confirm open-source license terms [L] | Privacy and performance | Self-host (proposed) |
| D-03 | Breakpoints and container widths | Layout | Proposed values in §3.4 |
| D-04 | Digit style (Western vs Arabic-Indic), date format, currency format | RTL consistency, exports | Western digits, Gregorian dates, ISO currency code (proposed) |
| D-05 | Platform logo images on cards (rights, source, fallback) [L] | Cards | Neutral initial-letter tile |
| D-06 | Mobile navigation pattern beyond the approved items (bottom tab bar vs drawer) | Mobile UX | Drawer only |
| D-07 | Contact form fields and response channel details | HLP-02 | Topic, email, message |
| D-08 | Source and labeling of "advantages and challenges" in the comparison (PRD OD-15) | Layer integrity | Label as Community experience if derived from reviews |
| D-09 | The contents and order of the ten Platform Details sections (PRD OD-07) | PUB-04 and navigation | Proposed mapping in PUB-04 |
| D-10 | Mission statement and About copy (PRD OD-12) | PUB-08 | Use the vision text |
| D-11 | Approved Arabic terminology and copy for all states beyond the zero-result search (OQ-17, EF-01) | UX writing | Suggested copy in §7 and §11 |
| D-12 | Dark theme default behavior (system preference vs manual) and toggle location | Theming | Light default [A]; follow system preference unless the user chooses [P]; toggle in the profile menu and a footer control |
| D-13 | Stage names and illustration for the static User Journey explainer | PUB-01 | Placeholder stage names (discover, understand, prepare, start, share) |
| D-14 | Favorites placement and label (PRD OD-01) | Navigation | MEM-09 within My ATHAR |
| D-15 | How a member adds a platform to My Platforms (Sitemap SF-OD-07) | MEM-02, PUB-04 | "Add platform" in MEM-02 + provisional "Track" action |
| D-16 | Whether join/chat requires a verified email (PRD OD-02) | AUTH, PUB-06, COM-01 | No gate (CD-206) |
| D-17 | Age field at signup (PRD OD-03) | AUTH-01a | Not shown |
| D-18 | Whether reporting requires a verified email (PRD OD-04) | MEM-13 | Signed-in members |
| D-19 | Presentation of review, report and appeal forms (page vs dialog; SF-OD-06) | Forms | Routes exist; presentation flexible |
| D-20 | Notification bell dropdown preview (REC in the sitemap) vs direct navigation | Navigation | Direct navigation to MEM-07 |
| D-21 | Admin location of Help Center content editor and support inbox (SF-OD-01) | Admin | ADM-10 provisional area |
| D-22 | Public-profile identifier format and shape of the "not available" state (SF-OD-03) | PUB-07 | Opaque ID, neutral not-available page |
| D-23 | Behavior and wording when a platform is merged or unpublished (SF-OD-02, PRD OD-09) | PUB-04 | SYS-01 for unpublished URLs |
| D-24 | Numeric performance/availability targets for UI (PRD OD-13) | Skeleton timing, retries | Qualitative only |

---

## Final Quality Check

| Check | Result |
| --- | --- |
| All sitemap screens covered | PUB-01…08, AUTH-01…03, MEM-01…15 (incl. MEM-08 sections), COM-01, HLP-01…06, ADM-01…11, SYS-01…07 are specified; search-results and filtered-results appear as states of PUB-02 |
| Major flows represented | F-01…F-31 and AF-01…AF-05 map to screens through "Related flows" |
| RTL explicitly described | §4 plus component notes and the §13 checklist |
| Components have defined states | §3.6, with domain components in §3.6.22 |
| Approved identity not replaced | Name, slogan, supporting message and approved copy reproduced unchanged; logo and palette flagged as not provided |
| Proposed vs approved distinguished | [A] / [P] labels and the §14 list |
| No invented business rules | Validation rules are quoted from the baseline; all others are marked [P] or open |
| Known limitation | No Figma file or rendered prototype exists; contrast values apply only to the proposed hex values |

*End of document.*
