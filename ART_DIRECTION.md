# Editorial art programme

The approved ivory/obsidian journal, Cormorant Garamond/Manrope typography and distinct visible artwork remain the baseline.

For each new narrative, plan different scenes for collection, cover and interior placements. Keep the collection image unique even when its full reader is added. Use conservative traditional attributes, clear anatomy and truthful AI/contribution labels. Preserve creator marks. Quarantine rejected candidates outside src/ and dist/.

The Hanuman commission adds three original manuscript-inspired scenes: contemplation before the leap (reader cover), Rama's ring in the Ashoka grove (reader interior), and reporting to Rama (family companion). Built-in Imagegen prompts are recorded in IMAGE_PROMPTS.json. Generated originals remain in the image tool's output directory; optimized project masters are in src/assets/images/.

ARTWORK_LEDGER.json records every source placement, known origin, permission status and review limits. Run `node scripts/update-artwork-ledger.mjs` after asset changes; curated fields are retained. The ledger is offline documentation, not a public gallery or rights certificate. Existing contributed photographs remain unidentified at the owner's request.

Before adding a new asset: verify its source, permission, subject, anatomy, attributes, intended crop, caption and alt text. Review the rendered frame in both themes. Responsive derivatives belong to the same placement; alternate crops do not authorize reuse elsewhere.


## Krishna and Govardhana reader — 11 October 2026

Owner-approved divider update: replace the repeated lattice crosses with a minimal horizontal rule interrupted by a short central bar. The shared divider also updates the Lalita section for consistency. Build, lint, link checks and UI tests passed; affected pages were checked at three widths in both themes (12 browser scenarios).

Owner-approved full reader added in eight chapters, following Bhagavata Purana 10.24–27 with original condensed prose and separate editorial reflection. Two unique AI-generated illustrations bring the artwork ledger to 47 placements. The site now has 20 pages, 18 indexed pages and five full story readers. Collection, Krishna entry, reading path, Sources and story pagination link to the reader. See GOVARDHANA_RESEARCH.md and IMAGE_PROMPTS.json for references and artwork notes.


## Rama’s exile reader — 11 October 2026

Owner-approved eight-chapter reader follows selected Valmiki Ramayana Ayodhya Kanda episodes from the proposed consecration to the first dwelling at Chitrakuta. Two unique built-in Imagegen illustrations; original prompts in IMAGE_PROMPTS.json. Sources, collection, Rama entry, reading path and Hanuman pagination connect to it. Current site: 21 pages, 19 indexed pages, six full readers and 49 unique artwork placements. Research and scope decisions: RAMA_EXILE_RESEARCH.md.


## Devi and Mahishasura reader — 11 October 2026

Owner-approved eight-chapter reader follows Devi Mahatmya 2–4, including the closing hymn and boon. Two unique built-in Imagegen scenes; prompts and review limits preserved. Collection, Durga introduction, reading path, Sources and Govardhana pagination connect to the reader. Current site: 22 pages, 20 indexed pages, seven full story readers and 51 unique artwork placements. Research: DEVI_MAHISHASURA_RESEARCH.md.


## Bhagiratha and the Ganga reader — 11 October 2026

Owner-approved eight-chapter reader follows Valmiki Ramayana Bala Kanda 40–44. Two unique built-in Imagegen paintings; source and interpretation notes remain explicit. Collection, Sources, Shiva entry, reading path and Lalita pagination connect to the reader. All eight collection stories now have full readers. Current site: 23 pages, 21 indexed pages and 53 unique artwork placements. Research and prompts: BHAGIRATHA_GANGA_RESEARCH.md and IMAGE_PROMPTS.json.


## Photographic homepage hero — 11 October 2026

Owner approved a full-screen photographic hero using contributed IMG_9684.JPG. The temple remains unidentified. Imported as home-temple-photograph.webp, with responsive variants up to 2400 pixels and full-cover sizes; original photo remains untouched. Replaced the earlier corridor artwork placement, retaining the one-visible-placement rule and 53 total placements. Centered requested heading and Explore Now button, retained introductory copy and story shortcut, glass navigation overlays the hero. Image scale 1.15 with vertical movement bounded to 24 pixels; interpolation uses an on-demand animation loop, reset offscreen/on resize/in a hidden tab. Fine mouse pointers only; reduced motion and touch receive a still image. Short screens and enlarged text can grow the hero to preserve content. No gyroscope permissions or external services.
