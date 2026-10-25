# Premium reading update — 24 October 2026

Subsequent owner instruction: removed the entire Hindi section, its language navigation/search/preferences/narration, and Hindi review requirements. English reading, English speech, the video, library tools and sourced journals are retained. The current site has 30 routes; removal validation is recorded in VALIDATION.md.

Delivered the owner-approved improvements while retaining the existing visual identity, typography, imagery policy and static Eleventy architecture:

- Replaced repeated homepage destination copy with a beginner route, family reading and reading-path entry points. Added a three-step beginner journey and quick reading choices in the story collection.
- Added optional chapter read-aloud controls with play/pause/stop, speed, English voice preference, cancellation safety and visible transcripts. Browser speech is labeled synthetic; reviewed recorded narration is not claimed.
- Added a contact/correction page that opens an email draft to shreembala@gmail.com, and a reading/privacy explanation. No inbox backend or unsolicited message sending is involved.
- Added library backup download, validated atomic import/merge and explicit clear-history control. Existing saved/completed entries are preserved on import; unknown pages/chapters and malformed/oversized files are rejected.
- Expanded Shivaratri, Kashi and Rameswaram context using rendered pages from supplied Skanda Purana parts 1, 10 and 8, with detailed references on Sources. No book scans are published.
- Centralized launch origin/indexing configuration for canonical/social metadata, robots and sitemap. Current private audience and crawler restriction are preserved.
- Reframed the golden shrine using measured source keyframes and responsive transform geometry. Selected a clean 12-second loop to avoid the original's severely cropped closing seconds. Video payloads are about 5.35 MB desktop / 2.45 MB mobile; poster compression and preload improve initial loading. Reduced motion/data-saving choices, native no-JS controls, pause and offscreen handling remain.
- Fixed outdated browser assertions for solid reader controls, current story count and current homepage links. Added library/speech regression tests, targeted browser QA and a repeatable local performance measurement script. Local preview supports video byte ranges.

Initial slow-network lab measurements showed substantial video-element layout shifts. Switching reframing to transforms, reserving opening/header/control space and prioritizing the poster reduced CLS to 0.0075/0.0118/0.0076 at 375/768/1440px. LCP was approximately 3.0 seconds under 150ms latency and 200kB/s download with a cold cache and reduced motion. This is a local lab measurement, not field Core Web Vitals; INP was not measured. No video was requested under reduced motion.

All 204 full browser scenarios and subsequent keyboard/search/reflow/no-JavaScript checks pass, alongside automated checks and the 44 targeted shrine-framing samples. See VALIDATION.md for coverage and limits. Implementation is committed on GitHub main in 327524a; validation documentation follows in a separate commit. GitHub main is the required ongoing source destination. The separate Sites source repository preserves the existing private hosting identity.

## Earlier implementation notes

# Reading and discovery update — 21 October 2026

All nine approved priorities are delivered, preserving the approved design, supplied logo and existing narrative prose.

## Delivered

1. Corrected the Places page’s outdated Bhagiratha preview wording and full-story link.
2. Search uses actual page/story titles without repetitive generic subresults.
3. Browser-local reading library: saved stories, resume chapters, bookmarks, explicit completion, filters and removal. Legacy bookmarks migrate; blocked storage has a page-local fallback.
4. Four reading paths show completion, estimated total/remaining time and next unread step, sharing state with readers.
5. All eight readers have connected journeys to divine forms, texts and terms.
6. Glossary expanded from 12 to 18 terms with Devanagari, transliteration, approximate pronunciation and centralized primary-text references for additions.
7. Three unique illustrations added to Places and Festivals with interpretation captions.
8. About & editorial standards explains editions, traditions, artwork, corrections and local preferences.
9. Search, story filters, directories and explorer restore shareable URL query parameters.

The site builds 25 pages with 56 unique narrative artwork placements. The personal library is excluded from search. Reading state stays in the current browser; there are no accounts or cross-device synchronization.

## Verification

Production build, HTML/CSS lint, internal links/fragments, metadata, image uniqueness, story sources and sitemap/search checks passed. Both UI test suites passed, covering persistence, migration, malformed/blocked storage, focus recovery and URL restoration. Real-browser checks verified reader/library/path persistence and actual Hanuman search results. Forty-eight responsive cases across eight affected page types, widths 375/768/1280 and both themes showed no horizontal overflow or broken loaded images. Representative mobile library and dark Places layouts were visually inspected.

## Artwork

Generator: built-in OpenAI image generation. Illustrative interpretations, not historical or architectural documentation. Each has one narrative placement.

- src/assets/images/varanasi-riverfront-journal.webp — Places / Varanasi.
- src/assets/images/rameswaram-corridor-journal.webp — Places / Rameswaram.
- src/assets/images/navaratri-garba-journal.webp — Festivals / Navaratri.

Exact prompts: design-assets/journal-illustration-prompts.json. Provenance: ARTWORK_LEDGER.json. Responsive derivatives use the existing pipeline.

## Remaining proposals

Optional audio narration, six further family adaptations, a location-aware tithi calendar, an interactive sacred-places map and an optional newsletter. Calendar/map/newsletter need separate scope and provider/editorial choices. Continue source review as stories are added.

This task publishes Sites source and the owner-private site; it does not update the separate GitHub repository.


## Additional imagery — 21 October 2026

Added two unique festival illustrations to the remaining text-heavy festival sections, without altering narrative information or the approved design. Saved assets: `src/assets/images/shivaratri-vigil-journal.webp` and `src/assets/images/hanuman-jayanti-reading-journal.webp`. Exact prompts and built-in generator provenance: `design-assets/festival-image-prompts.json`. Captions explicitly identify imagined AI-generated scenes. The festival page now has one distinct image per dossier. No image was reused.

Imagery validation: production build, lint, link/image uniqueness checks and both UI suites passed after the build completed. Browser review confirmed loaded images, captions and natural proportions in light/dark presentation, with responsive overflow checks at mobile/tablet/desktop widths. Total: 58 unique narrative image placements.


## Dhruva reader — October 22

New ninth story: Dhruva’s childhood journey, based solely on the owner-supplied Gita Press Sanskrit–Hindi Bhagavata Purana Volume 1, 4.8–9. Sources centralize chapter/verse ranges and the exact supplied link. The reader labels its limited childhood scope and original condensed English prose, with a separate editorial reflection. No other edition or web summary supplies narrative information.

Four unique built-in OpenAI generated images: src/assets/images/dhruva-card.webp (collection only), dhruva-narada.webp (reader hero), dhruva-madhuvana.webp and dhruva-vishnu.webp (reader chapters). Exact prompts: design-assets/dhruva-image-prompts.json. Source audit: design-assets/dhruva-source-review.md. All artwork has truthful captions and was visually inspected for composition and anatomy; no specialist review is claimed. Existing visual system retained. Story catalog, collection filters, search, sitemap, reading library, incoming story navigation and connected explorer are integrated.

Dhruva verification: production build, HTML/CSS lint, local links/fragments, metadata/images, nine card citations, sitemap/search and both interaction suites passed. Browser checks covered the reader at 375/768/1280 widths in both actual themes: no horizontal overflow or broken loaded images. Save/bookmark state appeared correctly in the library. The desktop opening was visually inspected. No comprehensive accessibility certification or new 200% browser zoom/reduced-motion emulation is claimed. Current site: 26 pages, nine readers and 62 unique narrative artwork placements.


## Museum homepage preview — October 22

Added museum-preview.html as a separate noindex review page. The existing index.njk, other page content, fonts and original CSS bundle remain unchanged. Isolated preview CSS supplies an obsidian/gold temple opening, three staggered illustrated doorways, Journeys of Devotion collection, existing introductory/divine/scripture information and further-reading links. All links point to implemented pages. No framework migration or new factual religious material. The draft is excluded from Pagefind and sitemap and has no main-navigation entry.

Four original built-in OpenAI generated assets are saved under src/assets/images/: museum-temple-opening.webp, museum-vishnu-gallery.webp, museum-story-grove.webp and museum-scripture-study.webp. Exact prompts: design-assets/museum-preview-prompts.json. Captions explicitly distinguish imagined architecture, devotional sculpture, cultural illustration and still life. Visual review checked complete subjects, Vishnu’s four hands/attributes and visible human anatomy. No historical-object identity is claimed.

Validation: production build, HTML/CSS lint, internal files/fragments, metadata/image uniqueness, story citations, search/sitemap and both UI suites passed. Final scoped CSS was regenerated through the same CleanCSS pipeline after small visual corrections. Browser QA covered 375/640/768/1280 widths in both themes, with no overflow/broken loaded images. Desktop opening/gallery and narrow mobile opening visually reviewed. Mobile menu keyboard activation and Escape dismissal passed. The existing homepage source was verified unchanged. No comprehensive accessibility certification or new true browser 200% zoom/reduced-motion emulation is claimed; reduced motion disables the new animation in source.

Current site: 27 HTML routes including the isolated preview, 66 unique narrative image placements. This preview is not approval to replace the live homepage.


## Interactive exhibition prototype — October 22

The owner approved the three-part animated exhibition after supplying a video reference. Only museum-preview.html changes; the main homepage remains intact. The opening now has three coordinated camera/model/text states, shifting lighting, halo illumination, chapter indicators, previous/next and keyboard navigation. Desktop scroll uses a naturally pinned stage without capturing wheel events; mobile and reduced-motion use direct controls. A skip link exits immediately. There is no auto-advancing text; continuous ambient model motion can be paused.

The exhibit uses an original stylized procedural architectural model, not the photographic hero masquerading as 3D. Geometry includes the platform, stepped entrance, lathed pillars, sanctuary, tiered towers and geometric wall niches. It is clearly labelled an imagined architectural interpretation, not an identified real temple or historical reconstruction. No new religious account was added.

Self-hosted Three.js and GSAP are restricted to the preview page; no framework migration, CDN runtime or access changes. The GPU renderer has a software Canvas painter fallback using the same projected 3D geometry and lighting. If modules/canvas are unavailable, the original still illustration remains with functional text/navigation. Context loss restores that still. Rendering pauses when offscreen or hidden, device pixel ratio is capped and software rendering is throttled.

Browser QA limitation: the managed review browser has WebGL explicitly disabled. GPU material/shadow appearance cannot be certified here. Actual 3D viewpoint changes, chapter transitions, keyboard controls, pause/resume, skip behavior and eight responsive/theme combinations were reviewed with the software renderer. The GPU path uses the same geometry and pose sequence but needs confirmation on a WebGL-capable device. The model is a stylized prototype rather than a photorealistic sculptural asset.

Added regression coverage for chapter boundaries, keyboard focus, pause, runtime reduced-motion changes and the non-WebGL fallback. Existing UI, reading-state and static checks remain required. No comprehensive accessibility or true 200% browser zoom certification is claimed.

Final verification: full production rebuild, HTML/CSS lint, link/metadata/image checks and all three interaction suites passed after the final changes. Source index.njk remains byte-identical to the approved homepage. Preview stays noindex and excluded from search/sitemap. Eight browser width/theme cases rendered the software 3D model without overflow or broken images; GPU rendering remains unverified because WebGL is disabled in the review browser.
