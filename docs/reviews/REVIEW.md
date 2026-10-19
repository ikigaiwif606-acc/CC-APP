# SYNC Wellness Club — Browser Review

**Date:** 2 October 2026
**Target:** https://sync-wellness.vercel.app
**Build verified:** sha256 of `index.html`, `app.js`, `portal.js`, `i18n.js`, `design.css`, `journey.css`, `portal.css` — deployed output matches local source exactly, so all findings below apply to what is live.

## Scope

This review deliberately covers the gap the project README names as outstanding:

> "No pixel rendering, physical-device testing, screen-reader testing, or visual animation inspection was performed. Visual QA remains pending."

It therefore targets **rendered layout, CJK typography, measured contrast, and keyboard behaviour** rather than repeating the existing Happy DOM transaction audits.

**Method.** Driven through a real browser (Aside CLI, Playwright-compatible REPL). Desktop passes ran against the live deployment. Responsive and language passes ran against a byte-identical copy served locally inside a same-origin iframe, which permits true CSS media-query widths and direct DOM measurement. All three roles were exercised: member, owner/admin, and front desk.

**Not covered:** real-device testing, screen-reader testing, and the booking/transaction logic already covered by the existing Happy DOM audits (the booking dialog was confirmed to render and price correctly in a real browser).

---

## 1. Staff workspace breaks on every phone — HIGH

The admin and front-desk screens force **horizontal page scrolling** at all widths below roughly 700px (English) and 600px (繁體中文).

Measured document overflow beyond the viewport (`#admin-members` and `#admin-schedule` behaved identically):

| Width | 320 | 360 | 375 | 390 | 414 | 430 | 480 | 600 | 700 |
|---|---|---|---|---|---|---|---|---|---|
| **English** | +357px | +317 | +302 | +287 | +263 | +247 | +197 | +77 | ok |
| **繁體中文** | +209px | +169 | +154 | +139 | +115 | +99 | +49 | ok | ok |

Visible consequences: the staff nav strip is sliced mid-item, leaving **Orders & passes**, **Points & rewards** and **Settings** unreachable, and the member search field is cut off. Front-desk staff working from a phone is the most likely real-world use of this screen.

### Root cause

`portal.css:18` — at `@media(max-width:800px)` the layout stacks to `grid-template-columns:1fr`, but `.staff-sidebar` never receives `min-width:0`. A grid item defaults to `min-width:auto`, so it cannot shrink below the min-content width of its horizontal nav (661px); `.staff-content` then stretches to match.

`.staff-content` already sets `min-width:0`; the sidebar was missed.

### Fix (verified in-browser)

```css
@media(max-width:800px){ .staff-sidebar{ min-width:0 } }
```

With this applied, measured document overflow becomes **0 at every width from 320px to 600px**, and the nav strip begins scrolling horizontally — which its existing `overflow-x:auto` already intended.

---

## 2. "Account" nav item clipped at ≤360px — MEDIUM

The member bottom nav holds 358px of content inside a container measuring 286px (at 320px viewport) and 326px (at 360px). With `overflow-x:visible` and no page-level scroll, the fifth item is simply cut off.

| Viewport | Account link right edge | Visible |
|---|---|---|
| 320px | 375px | no |
| 360px | 375px | no |
| 375px | 375px | yes (zero margin) |
| 390px | 375px | yes |

360px covers a large share of Android devices. At 375px the item fits with *exactly* zero margin against the viewport edge.

This is a **layout defect, not a dead route** — the avatar button (`JL`, `data-action="profile"`) still navigates to `#account`. Severity is bounded accordingly.

---

## 3. Dialogs do not restore focus on close — MEDIUM (accessibility)

What works: focus moves correctly *into* the dialog on open, `Escape` closes it, and `aria-labelledby` → `#modal-title` resolves properly.

What fails: after close, `document.activeElement` is `BODY` rather than the element that opened the dialog. Keyboard and screen-reader users lose their position and are returned to the top of the document.

The prior audit verified title *association*, which is a different property from focus return.

---

## 4. Text contrast below WCAG AA 4.5:1 — MEDIUM

| Text | Measured | Required | Location |
|---|---|---|---|
| `.empty` placeholder (12px) | 3.57 | 4.5 | Book, Account |
| Inactive service toggle, "Contrast Therapy" (13px) | 3.82 | 4.5 | Book |
| `.eyebrow` kicker (11px) | 3.98 | 4.5 | Membership |

`.empty` is `#7a887f` in `styles.css`. A darker token already exists in the codebase — `--muted:#53685d` (`design.css:2`) — and clears the threshold.

> **Measurement caveat.** Text sitting on gradient, image, or glass backgrounds was **excluded from measurement**, because effective contrast there cannot be derived reliably from computed styles. The membership card and hero are therefore **unverified, not passing**. The README's existing "selected text/background colour pairs measured above 4.5:1" claim overstates coverage on this same axis.

---

## 5. Membership card content clipped at 320px — LOW/MEDIUM

Inside the card's `overflow:hidden` container, several elements extend past the viewport and are visually truncated:

- `Plus` tier label — cut mid-word
- `SYNC MEMBERSHIP` — truncated
- `YOUR SPACE. YOUR PACE.` — reaches 351px in a 320px viewport
- "View benefits →" — arrow sliced by the card edge

No horizontal scroll results (the parent clips), so this is purely a visual truncation issue.

---

## 6. Tap targets 36–40px — LOW

| Control | Height |
|---|---|
| Avatar (JL) | 39px |
| Language toggle | 40px |
| Points history | 36px |
| View benefits | 36px |
| Team sign in / Sign out | 37px |

These **pass** WCAG 2.5.8 AA (24×24px minimum) but fall short of Apple HIG's 44pt recommendation.

**Documentation drift:** the README states "larger tap targets were added from code review." Several controls remain in the 36–40px range.

---

## 7. Minor observations

- **Front desk at `#admin-settings`** correctly renders the Overview content (route guard works), but the URL hash remains `#admin-settings`, so the address no longer reflects the view.
- **Demo credentials are misleading.** `admin@sync.demo` and `frontdesk@sync.demo` do not select a role — the **Staff role dropdown** does, and any valid email with an 8+ character password is accepted. Worth stating explicitly when sharing the demo, or testers will assume the email determines access.
- **Possible dead CSS (unverified).** `.member-card` in `styles.css` still carries `animation:float 7s ease-in-out infinite`, despite the README stating continuous float was removed. `design.css` loads later and `.premium-card` appears to be the live component, so this is likely stale rather than a live defect.

---

## What held up well

- **Zero console errors and zero page errors** across all three roles, every route, and both languages.
- **No secrets and no network calls.** Static analysis found no API keys, tokens, or outbound `fetch`/XHR — genuinely client-side, with nothing leaking from a public deployment.
- **Permission gating is correct and layered.** Verified in the browser, not just in code:
  - Buttons hidden at render (`portal.js:66`, `:68`, `:70`)
  - Form-open guarded (`portal.js:82`)
  - Submit guarded (`portal.js:111`)

  Front desk showed 5 nav items (no Settings), no "Issue passes" on Orders, and no "Adjust points" on Points — exactly as documented. Admin showed all 6 and both privileged actions.
- **Route guards work.** Logged-out users land on the login page with the member nav correctly hidden.
- **`prefers-reduced-motion`** is present in all 8 stylesheets.
- **Global `:focus-visible`** outline is defined (`3px solid #4b6675`, 4px offset).
- **繁體中文 renders cleanly at 375px** — all five nav items fit, dates localise correctly (`2026年11月21日`), no overflow.

---

## Suggested order of work

1. **Fix 1** — one line, verified, unblocks all staff use on phones.
2. **Fix 3** — store the trigger element before opening a dialog and restore focus on close.
3. **Fix 4** — swap the three low-contrast colours for `--muted:#53685d`.
4. **Fix 2** — add `overflow-x:auto` to the member nav, or tighten padding so five items fit at 320px.
5. Items 5–7 as cosmetic/documentation cleanup.
