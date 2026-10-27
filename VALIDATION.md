# Handoff validation — 2026-10-10 UTC

## Production configuration and accessibility — 25 October 2026

The canonical origin is now https://www.shreembala.com (verified apex redirect, Vercel host; owner confirms main auto-deploy). Eleventy renders origin-dependent metadata directly from site.json. Tests verify all 30 canonical/social/schema pages, 1200×630 JPEG previews below 300 KB (maximum 135,448 bytes), manifest/icons, theme metadata, robots and security-header output. No inline event handlers remain.

The new CI-compatible Playwright/axe suite covers 180 page/theme/width combinations plus six search/keyboard tests and six theme-color persistence tests. All page and search tests passed; the six theme tests passed after correcting test setup to avoid resetting storage on reload. No WCAG A/AA axe violations were reported in the tested states. The suite checks actual CSP violation events, image/overflow/caption errors and runtime errors. This is automated coverage, not a human screen-reader or real-device certification.

An actual label-in-name mismatch on the theme toggle was corrected without changing its visible text. Search result counts now update a persistent polite live region, verified for both matching and empty results. Build, lint, static and unit checks pass. Compatible updates resolved the three dependency advisories; the latest npm audit reports zero known vulnerabilities. Current browser traces and reports remain ignored under .qa/.

## Hindi section removal — 24 October 2026

Owner requested removal of the entire Hindi section. Removed its four pages, language links/preference script, Hindi narration branch, language alternatives and translation-specific styling. The current build has 30 routes and 26 English search entries. Existing Sanskrit/Devanagari content and accurate book-edition names remain intact.

Build, HTML/CSS lint, static checks (66 unique image placements), and all four interaction suites pass. Responsive visual review and 36 representative page/theme/viewport checks passed at 375/768/1440px. English read-aloud and live English search passed. The 44-sample video/reading/contact browser suite passed, including checks that all removed Hindi URLs return 404 and no language navigation remains. Removing an empty CSS block after lint produced exactly the same minified bundle as the verified build. No unrelated design changes were made.

## Previous premium-release verification — 24 October 2026

- Node 24.22.1; clean locked dependencies installed. Build succeeds: 34 routes, 29 indexed pages across English/Hindi. HTML/CSS lint passes. Static checks pass with 66 unique narrative image placements, local files/anchors, story citations, metadata, sitemap and search bundles.
- All four interaction suites pass: original UI, reading persistence/migration, video behavior and new backup/speech tests. Import tests verify atomic rejection and preserving existing saved/completed states.
- Targeted browser checks pass: 44 shrine-framing samples through the 12-second loop at 375/768/1440/2560px, no uncovered video edges, real library download/import, invalid-file recovery, Hindi search, contact controls and HTTP video range responses.
- Slow cold-load local lab: 150ms latency, 200kB/s download, reduced motion, widths 375/768/1440. LCP 3012/2976/2996ms; CLS 0.0075/0.0118/0.0076. No MP4 requests in these reduced-motion cases. These are lab observations, not deployed field Core Web Vitals; INP is unmeasured.
- Relevant supplied Skanda Purana pages for the three journal additions were rendered and visually read. Real-device Safari, native 200% browser zoom and assistive-technology certification are not claimed.
- Complete Chrome matrix passed: 34 routes × 3 widths (375/768/1440) × 2 themes = 204 scenarios, with no horizontal overflow, clipped captions, broken images or runtime JavaScript errors. Subsequent checks passed for keyboard menu/focus, persisted reader controls, anchor clearance, actual search results, print output, reduced motion, 720px reflow on every route (a 200%-zoom approximation), and no-JavaScript navigation/story availability. The old preview redirect was explicitly awaited during reflow testing.

## Historical packaging validation

- Repository source was clean at cd04b377ded488ed6077e6f59c09a6b3eac94094. Every tracked file was copied byte-for-byte, including 194 dist/ files. No website edits, GitHub writes or deployment were made for this task.
- npm run lint passed: 14 HTML pages and stylesheet validation.
- npm run check passed: 14 pages, 42 unique visible image placements, internal files/fragments, metadata/images, eight card citations, sitemap and search bundle.
- npm test passed: menu keyboard focus, persisted theme, glossary definitions/focus, reading progress, both directory searches and category filter.
- Archive creation checks CRC integrity, the six required documents and exclusion of .git and node_modules. INVENTORY.csv and SHA256SUMS.txt allow byte-level verification after extraction.
- The fresh handoff environment has not been browser-rendered or freshly npm-installed here. Existing build output is included and build instructions are provided. No rendered visual QA, Lighthouse audit or complete religious-content audit is claimed.

Extracted project can be rebuilt with npm ci && npm run build. Build output need not be byte-identical across future tool/runtime versions; the snapshot checksums identify the delivered baseline.

## Bhagiratha and the Ganga — 11 October 2026

- Final build passed: 23 pages, 21 indexed by Pagefind; 53 unique visible artwork placements.
- HTML and stylesheet lint passed. Site check passed local files/fragments, metadata/images, all eight card citations, sitemap and search bundle. Interface tests passed.
- Chrome rendered all 23 routes at 375, 768 and 1440 CSS pixels in both themes: 138 scenarios, no horizontal overflow, clipped captions, broken images or runtime errors.
- Six focused Bhagiratha scenarios passed chapter count, anchor clearance/current chapter, persisted text size and bookmark/resume. Live Bhagiratha search found the full reader.
- Mobile and desktop hero previews and the dark-mode interior were visually inspected. The two original paintings were visually checked for anatomy and scene coherence.
- Shared keyboard menu/focus, reduced motion, reduced transparency, no-JavaScript content/navigation and 720 CSS-pixel reflow on every route passed. Reflow approximates 200% zoom from a 1440-pixel viewport; native browser zoom, screen-reader audit and specialist iconography review remain unverified.
- Temporary browser scripts, screenshots and reports are under ignored `.qa/`. An initial missing `#ramayana` destination was corrected to the existing `#epics` anchor before the final checks.

## Photographic homepage hero — 11 October 2026

- Final build, HTML/stylesheet lint, site checks and interface tests passed. Site remains at 23 pages and 53 unique visible image placements; the new photograph replaces the former hero artwork placement.
- Final Chrome browser run: 138 layouts (23 routes, three widths, both themes), no overflow, clipped captions, broken images or runtime errors. Shared keyboard, motion/transparency fallbacks, search, no-JavaScript content and 720 CSS-pixel reflow passed.
- Six focused hero layouts checked viewport coverage, header clearance, centered actions and horizontal reflow. Desktop/light and mobile/dark previews were visually inspected after the final alignment fix.
- Real mouse interaction verified opposite vertical directions and background edge coverage. Reduced-motion changes, emulated touch, offscreen reset and no-JavaScript navigation/hero links passed. Enlarged text at 200% and a short 720×450 viewport retained the action within the hero without horizontal overflow.
- Photo derivatives reach 2400 pixels; largest built WebP is approximately 447 KB. Hero is eager/high priority with full-cover responsive sizes. No performance-score or native-device gyroscope claim.
- Native browser zoom, real-device touch and screen-reader audit remain unverified. Focused script and screenshots: ignored `.qa/check-home-hero.mjs` and `.qa/hero-new-*`.

## Repository connection — 13 October 2026

- Fresh build passed: 23 pages, 21 search-indexed pages. HTML and CSS lint, site checks (53 unique visible images, files/fragments, metadata, citations, sitemap/search) and interface tests passed.
- Fresh rendered Chrome run passed 138 scenarios across all 23 pages at 375, 768 and 1440 CSS pixels in both themes. No overflow, clipped captions, broken images or JavaScript runtime errors. Shared keyboard/focus, reduced motion/transparency, no-JavaScript navigation, search and 720 CSS-pixel reflow checks passed.
- Staged-file audit checked paths and common credential signatures; no private reference directories, uploads, books, credentials, dependencies, hosting metadata, generated output or QA artifacts were staged. This scan does not constitute a guarantee against every possible secret format.
- Native browser zoom, screen-reader and specialist iconography audits remain unverified. Existing GitHub history is the new branch's ancestry; no force-push or deployment is part of this task.

## Typography revision — 20 October 2026

- Build, HTML/CSS lint, site checks and interface tests passed after replacing the active typography. Site remains 23 pages, 21 indexed pages and 53 unique visible images.
- Chrome passed 138 page/width/theme scenarios with no horizontal overflow, clipped captions, broken images or JavaScript runtime errors. Shared keyboard/focus, reduced-motion/transparency, live search, no-JavaScript content and reflow checks passed.
- Eight additional homepage/reader scenarios checked Literata headings and story text, Source Sans 3 body text, and native font loading including Latin diacritics and Devanagari. No failed font requests. Desktop/mobile homepage previews and the story interior were visually inspected.
- Font binaries are valid WOFF2, hosted locally with upstream OFL licenses. FONT_SOURCES.json records source URLs, file sizes and SHA-256 hashes. CSS/preloads use the new families; old font assets are not requested by current styles.
- Native browser zoom, real-device rendering and screen-reader audit remain unverified. Temporary font-loading script and screenshots are under ignored `.qa/`. No commit, push or deployment was performed for this revision.

## Creation cosmology article — 25 October 2026

Production build, HTML/CSS lint, static checks and five interaction/metadata suites passed: 31 pages, 27 search-indexed pages, 68 unique visible image placements. All 198 Playwright/axe checks passed across 375/768/1440 widths in light and dark themes. Targeted article review also passed search discovery, contents-anchor clearance and six-chapter content without JavaScript. Two full-page theme/width renders were visually inspected. Real-device, screen-reader and native browser zoom certification remain outside this automated review.

## Fourteen Lokas and header directory — 25 October 2026

- Production build, HTML/CSS lint, static checks and all five interaction/metadata suites passed: 32 routes, 28 indexed pages and 70 unique visible image placements.
- Initial full Chrome/axe run passed 214 of 216 scenarios and found the leftmost tablet dropdowns outside the viewport. Both leftmost panels were aligned to their left edge. An outside-click test was also corrected to use uncovered page space rather than a heading behind the dropdown.
- After the final CSS fix, lint/static checks and all 12 header keyboard, open-panel accessibility, destination coverage and no-JavaScript scenarios passed across 375/768/1440 widths in both themes. The other 204 page/interaction scenarios had passed in the full run; the final fix only affects open dropdown positioning.
- Six article/theme/width reviews passed with exactly 14 realm entries, two intact illustrations, no horizontal overflow and contents-anchor clearance. Search finds the new guide. Additional 2x CSS zoom reflow passed; this is not native browser zoom certification. Mobile light/desktop dark article renders and mobile/tablet/desktop menu renders were visually reviewed.
- Source Sanskrit/explanation pages were inspected privately. No PDF, scan, QA extract or dependencies are staged. Real-device, assistive-technology and specialist religious review are not claimed.

## Manus and Manvantaras — 25 October 2026

- Production build, HTML/CSS lint, static checks and all five interaction/metadata suites passed: 33 routes and 72 unique visible image placements. Search indexes the new article; social/schema metadata checks pass for all 33 pages.
- Full Chrome/axe suite passed all 222 scenarios across mobile/tablet/desktop widths in light/dark themes. The subsequent no-JavaScript visual check found the fallback header covering content; the final relative-position correction passed all six strengthened fallback navigation/reading scenarios. The final full build’s CSS hash matches the tested bundle. Final lint/static/metadata checks passed again.
- Six new-article width/theme reviews passed with fourteen Manu rows, two intact illustrations, no horizontal overflow, contents-anchor clearance and search discovery. No-JavaScript content/current-Manu highlighting and 2x CSS zoom reflow passed. Mobile light and desktop dark article renders and the complete mobile table were visually inspected.
- Exact supplied Bhagavata passages were rendered and inspected privately. No PDF or private review scan is published. Native browser zoom, real-device, screen-reader and specialist religious review are not claimed.

## Compact logo and expanded festival directory — 25 October 2026

- Production build, HTML/CSS lint, static checks and all five interaction/metadata suites passed: 33 routes and 72 unique visible image placements. All 228 Chrome/axe scenarios passed across 375/768/1440 widths in light and dark themes.
- Festival regression checks passed search, kind filtering, URL restoration, live result status, empty-state reset/focus and source-fragment navigation in all six width/theme projects.
- Targeted rendered review measured both logos at 48px desktop/tablet and 40px mobile with complete contained artwork. All 31 directory entries render; no horizontal overflow. Contents anchors clear the compact header. Six theme/width views, no-JavaScript reading/source navigation and 2x CSS zoom reflow passed. Mobile light top, desktop dark directory and desktop light footer screenshots were visually inspected.
- New festival descriptions were checked against supplied primary-book scans, with exact references on Sources. Private PDFs, page scans and QA outputs are excluded from Git/build publication. Native browser zoom, real-device, screen-reader and specialist ritual review are not claimed.

## Unified festival readings — 25 October 2026

- Final production build, HTML/CSS lint, static checks, metadata checks and all five interaction suites passed. The site remains 33 routes with 72 unique visible image placements; the festival collection remains exactly 31 entries.
- Initial full browser run passed 228 of 234 scenarios and caught an empty-fragment startup error on Festivals. The null-target correction passed all 18 festival layout/accessibility, filter and expanded-reading/legacy-link scenarios across three widths in both themes. The final production build's minified festival script hash matches the tested bundle; final lint/static/metadata checks passed again.
- Additional open-entry review audited Shivaratri, Navaratri, Hanuman Jayanti and Deepavali in all six theme/width layouts: no accessibility violations or horizontal overflow. The separate three-festival collection is absent, each entry has one disclosure, original deep links reveal the correct content and incompatible filters clear. Native no-JavaScript expansion/source navigation and 2x CSS zoom reflow passed.
- Mobile light overview and open Shivaratri/Deepavali readings, plus the desktop dark Deepavali reading, were visually inspected. Source-checked fuller prose uses the same supplied editions with expanded citation ranges where needed. No private scan is published. Native browser zoom, real-device, screen-reader and specialist ritual certification are not claimed.

## Great Rishis — 26 October 2026

- Production build, HTML/CSS lint, static checks and all five interaction/metadata suites passed: 34 routes and 74 unique visible image placements. All 246 Chrome/axe scenarios passed across 375/768/1440 widths in light and dark themes.
- New browser checks passed story→profile→story navigation, Bhrigu→Markandeya family links, Markandeya→Lokas reading and wider-Ramayana labels/links. Existing header tests cover the new public destination.
- Targeted review passed five profiles, two intact illustrations, no horizontal overflow, contents-anchor clearance, search discovery, no-JavaScript story navigation and 2x CSS zoom reflow in six theme/width layouts. Desktop dark full page, mobile light Narada reading and desktop dark Markandeya reading were visually reviewed. Direct mobile Narada fragment clearance was separately checked in the actual viewport; element-capture stitching can include the sticky header and is not used as a clipping verdict.
- Relevant primary pages and both complete illustrations were visually inspected. No private PDF or scan is published. Native browser zoom, real-device, screen-reader and specialist iconographic review are not claimed.

## 26 October 2026 — Kapila and Devahuti
Build, lint, check and npm test passed (35 pages; 77 unique visible narrative image placements). The 258 browser checks covered 375/768/1440 px in light and dark themes; 252 passed in the full run, and the six new walkthroughs passed on a targeted rerun after correcting a case-sensitive test assertion. All new-page layout, image, security and axe checks passed. Additional rendered review at 320/375/720 CSS px found no horizontal overflow; screenshots were inspected at mobile and desktop sizes. CSS zoom applied to the document root produced a misleading overflow signal, so reflow was checked using effective narrow CSS viewports instead. Native browser zoom, real devices and screen-reader interaction remain unverified.
