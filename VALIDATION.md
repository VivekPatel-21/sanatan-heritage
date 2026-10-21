# Handoff validation — 2026-10-10 UTC

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
