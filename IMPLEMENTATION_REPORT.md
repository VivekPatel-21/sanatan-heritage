# Sanatan Heritage implementation · 10 October 2026

The owner approved implementation after requesting a project review. The existing static Eleventy architecture, warm ivory/obsidian editions, self-hosted typography, content and unique artwork policy are preserved. Changes are local; deployment and privacy remain owner decisions.

## Ten improvements implemented

| Improvement | Delivered behavior and benefit | Difficulty |
|---|---|---|
| Welcoming discovery doorways | Homepage entry points lead to journeys, festivals and family reading, helping new visitors choose a useful starting point. | Low |
| Connected heritage explorer | Four curated journeys connect stories, divine forms, texts, glossary terms and references. A selector narrows the journeys without hiding content when JavaScript is unavailable. | Medium |
| Full Hanuman reader | Eight illustrated chapters follow the Sundara Kanda from crossing to return; the collection now has four complete readers and four clearly marked previews. | High: editorial research and artwork |
| Personal reading tools | Text size, current-chapter highlighting, an explicit bookmark, resume and clear controls make long readers easier to use. Preferences stay on the current device. | Medium |
| Different tellings | Sources compares distinct accounts of Kama’s restoration and Halahala, supporting cultural literacy without merging traditions. | Medium: source comparison |
| Sanskrit listening and discovery | Glossary terms provide approximate browser speech and contextual search links. Sanskrit/Hindi voices are preferred; unavailable voices produce a readable fallback. | Medium; reviewed audio would need a speaker |
| Festival dossiers | Maha Shivaratri, Navaratri and Hanuman Jayanti connect customs, regional differences, stories and reflection. No fabricated exact festival dates. | Medium: cultural research |
| Sacred places journal | Varanasi and Rameswaram entries distinguish geographical facts and sacred traditions, with official references. Contributed photographs remain unidentified as requested. | Medium |
| Family reading companion | Two short adaptations and conversation questions support shared reading. Print styles provide a lighter, readable companion from either theme. | Medium |
| Editorial art programme | Three unique Hanuman illustrations add story scenes. Prompt records and a 45-placement provenance ledger support consistent future commissions and honest attribution. | High: visual/editorial review |

## Review findings corrected

- Sources footer references could resolve to a protocol-relative URL or the wrong page anchor; references now normalize to the Sources page and checks reject protocol-relative links.
- Low-contrast focus borders now use the theme’s accessible accent. Reading progress is visible above the header.
- Fixed image heights and legacy flex figure layouts could clip captions or push content beyond mobile/tablet screens. Figures now flow with captions below the artwork, including Lalita’s story feature.
- Scripture overlays obscured artwork; original content remains in readable surrounding text.
- Deity index links stayed visible after their entries were filtered out; both now follow the query.
- Story metadata is shared, including consistent reading times and complete-versus-preview destinations. Story filters have combination, empty-state and reset-focus coverage.
- Responsive image sizes now reflect their actual component widths, with a 960px derivative between smaller and larger assets. Intrinsic sizes, eager heroes, lazy lower images and reduced-motion handling are retained.
- Preview serving is confined to `dist/`, and validation supports Python executable discovery. The documented Node versions match installed package requirements.
- Dark-mode print variables and lazy-image loading during print QA are corrected.

## Verification

Build generates 19 HTML pages, 17 searchable pages and 45 unique visible image placements. Required checks include HTMLHint, Stylelint, internal links/anchors, metadata, image dimensions/srcsets, citations, search output and interaction tests. The expanded interaction suite covers menu keyboard behavior, theme, glossary, progress, directory filters, story filter combinations/reset, explorer, reader storage, query initialization and pronunciation playback/fallback.

All required checks passed. Rendered Chrome QA passed 375, 768 and 1440 CSS-pixel viewports in both themes (114 route/theme/viewport combinations), plus 720px reflow for every route as an approximation of 200% zoom from a 1440px viewport. No horizontal overflow, clipped captions, broken images or uncaught page errors remained. Live Pagefind search, mobile Escape, bookmark persistence, filtering, no-JavaScript navigation/content and reduced motion passed. Results and screenshots are in ignored `.qa/`. The family print PDF was rendered and visually inspected: two readable A4 pages, including its illustration, with a light palette even when printing from dark mode. Native browser zoom, physical devices, screen readers and a specialist Sanskrit/iconography review are not claimed.

## Subsequent color refinement

At the owner's request, the light palette now uses richer parchment and the dark palette uses lighter midnight-blue surfaces. Selected sections, reading tools and reflection panels introduce sage/forest, indigo and clay. This is a color refinement: typography, layout, content, imagery and behavior remain unchanged. The navigation's existing glass surface is tinted to match. Screen-only section colors preserve the print edition. Calculated contrast for primary/muted text and terracotta/gold/indigo accents on all six surface tokens is at least 4.68:1 in both themes. The rebuilt color edition passed lint, site checks, interaction tests and all 114 rendered browser scenarios; representative screenshots and the two-page print edition were visually inspected.

## Approved visual finishing

The owner approved six further refinements after accepting the richer colors:

1. Navigation floats within a rounded, finely bordered glass panel; theme-aware tint and a soft shadow preserve readable contrast.
2. The reading toolbar uses a rounded glass surface, grouped text controls and more breathing room. Solid surfaces are the baseline; supported browsers add blur. Reduced transparency restores opaque surfaces.
3. Artwork receives fine inset edges, narrow mat-like framing and softer shadows. Captions stay outside the image. Sanskrit deity labels retain their larger serif treatment.
4. Small CSS diamond-lattice dividers appear at three selected section transitions. They are decorative architecture-inspired geometry, carry no sacred meaning and add no assets or script dependencies.
5. Buttons lift gently; selected editorial links animate an underline; theme surfaces transition briefly. Reduced motion removes transitions and button lift. Artwork hover scaling is removed to keep the frames steady.
6. Major headings have more space, chapter numbers use restrained rules and tabular numerals, and caption metadata shares consistent typography.

Navigation height is measured so chapter anchors clear the floating panel, including wrapped tablet navigation. Reader highlighting accounts for the new panel offset so it selects the chapter reached through its anchor. The changes preserve approved colors, content, images, static architecture and print styling. Primary source changes are in `src/assets/css/style.css`, `src/assets/js/site.js` and `src/assets/js/reader.js`; rendered checks in `scripts/test-browser.mjs` cover the glass and solid fallback, anchor clearance, active chapter and reduced-motion button behavior.

Build, lint, link/image checks and interaction tests passed. The 114 rendered route/theme/viewport cases and 720px reflow checks passed, with no runtime errors or caption clipping. Glass rendering, reduced-transparency fallback, keyboard outlines, theme controls and reduced-motion hover behavior were exercised. The final active-chapter adjustment received a focused six-case browser check across both themes and all three viewport sizes. Screenshots were inspected, and the print companion remains two readable pages. Native browser zoom and screen-reader verification remain outside the checks claimed here.

## Content and artwork boundaries

Detailed references remain on Sources. `HANUMAN_RESEARCH.md` and `CONTENT_RESEARCH.md` record research separately from public copy. Primary textual accounts, regional practice and editorial reflections are distinguished. Private handoff books and conversations remain outside `dist/`.

Browser speech is a temporary listening aid, not reviewed Sanskrit recitation. Festival dossiers are not a location-dependent tithi calendar. The places journal is not an interactive map. Translation, recorded narration, the remaining full readers and a newsletter remain separate future work; the current ten improvements do not imply those services exist.

Generated scene prompts and provenance are recorded in `IMAGE_PROMPTS.json`, `ART_DIRECTION.md` and `ARTWORK_LEDGER.json`. Assistant visual inspection checked the new scenes and anatomy; this does not certify specialist iconography or redistribution rights for older contributions. Temple identities remain unspecified at the owner’s request.


## Krishna and Govardhana reader — 11 October 2026

Owner-approved full reader added in eight chapters, following Bhagavata Purana 10.24–27 with original condensed prose and separate editorial reflection. Two unique AI-generated illustrations bring the artwork ledger to 47 placements. The site now has 20 pages, 18 indexed pages and five full story readers. Collection, Krishna entry, reading path, Sources and story pagination link to the reader. See GOVARDHANA_RESEARCH.md and IMAGE_PROMPTS.json for references and artwork notes.


## Rama’s exile reader — 11 October 2026

Owner-approved eight-chapter reader follows selected Valmiki Ramayana Ayodhya Kanda episodes from the proposed consecration to the first dwelling at Chitrakuta. Two unique built-in Imagegen illustrations; original prompts in IMAGE_PROMPTS.json. Sources, collection, Rama entry, reading path and Hanuman pagination connect to it. Current site: 21 pages, 19 indexed pages, six full readers and 49 unique artwork placements. Research and scope decisions: RAMA_EXILE_RESEARCH.md.


## Devi and Mahishasura reader — 11 October 2026

Owner-approved eight-chapter reader follows Devi Mahatmya 2–4, including the closing hymn and boon. Two unique built-in Imagegen scenes; prompts and review limits preserved. Collection, Durga introduction, reading path, Sources and Govardhana pagination connect to the reader. Current site: 22 pages, 20 indexed pages, seven full story readers and 51 unique artwork placements. Research: DEVI_MAHISHASURA_RESEARCH.md.


## Bhagiratha and the Ganga reader — 11 October 2026

Owner-approved eight-chapter reader follows Valmiki Ramayana Bala Kanda 40–44. Two unique built-in Imagegen paintings; source and interpretation notes remain explicit. Collection, Sources, Shiva entry, reading path and Lalita pagination connect to the reader. All eight collection stories now have full readers. Current site: 23 pages, 21 indexed pages and 53 unique artwork placements. Research and prompts: BHAGIRATHA_GANGA_RESEARCH.md and IMAGE_PROMPTS.json.


## Photographic homepage hero — 11 October 2026

Owner approved a full-screen photographic hero using contributed IMG_9684.JPG. The temple remains unidentified. Imported as home-temple-photograph.webp, with responsive variants up to 2400 pixels and full-cover sizes; original photo remains untouched. Replaced the earlier corridor artwork placement, retaining the one-visible-placement rule and 53 total placements. Centered requested heading and Explore Now button, retained introductory copy and story shortcut, glass navigation overlays the hero. Image scale 1.15 with vertical movement bounded to 24 pixels; interpolation uses an on-demand animation loop, reset offscreen/on resize/in a hidden tab. Fine mouse pointers only; reduced motion and touch receive a still image. Short screens and enlarged text can grow the hero to preserve content. No gyroscope permissions or external services.


## Typography revision — 20 October 2026

The owner explicitly requested replacing every existing font and moving away from a generic/template impression. Literata now supplies headings and story prose; Source Sans 3 supplies explanatory text, menus, controls and captions. Noto Serif Devanagari supplies existing Sanskrit/Hindi labels. Heading weight, tracking, optical sizing, mobile scale and reading rhythm were retuned; repeated heading emphasis is upright rather than italic. Colours, images, narrative content and existing navigation are retained.

Fonts are unmodified WOFF2 subsets downloaded from Google Fonts, hosted locally and accompanied by upstream SIL OFL licenses. FONT_SOURCES.json records URLs, byte sizes and hashes. No runtime font-service requests are introduced. Previous font binaries are retained as unused historical assets; current CSS and preloads do not reference them. No commit, push, deployment or new-page work is included in this change.
