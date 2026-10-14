# Sanatan Heritage

An illustrated guide to Sanatan Dharma, its divine forms, sacred texts, Sanskrit vocabulary and stories. The collection includes Lalita and Bhandasura, Shiva and Parvati, and Shiva drinks Halahala, with chapter navigation, characters, tradition notes and references collected on a dedicated Sources page.

## Run locally

Install Node.js 22.22.2+, 24.15.0+, or 26+, and Python 3 for validation, then run:

```sh
npm ci
npm run build
npm run serve
```

Open http://localhost:8080. Rebuild after editing source files. The site is static: search, filters, theme preferences and glossary cards run in the browser, without a backend.

The Node preview server serves only `dist/`. All eight collection stories now have full illustrated readers, including Bhagiratha and the Ganga. Connected journeys, three festival dossiers, a sacred places journal and a printable family companion offer further ways to explore. Reader bookmarks and text size are saved on the current device. Glossary listening uses clearly labeled approximate browser speech; voice availability varies by device.

## Project structure

- `src/*.njk`: page content and metadata, rendered by Eleventy.
- `src/_includes/`: shared layout, header and footer.
- `src/assets/images/`: image masters, including contributed artwork.
- `src/assets/css/` and `src/assets/js/`: readable styles and interactions.
- `src/data/glossary.json`: the single source of definitions for the glossary page and clickable cards.
- `scripts/`: image optimization, minification, search indexing, validation and local serving.
- `dist/`: generated, deployable site. Edit `src/`, not this folder.

The build creates WebP variants without enlarging originals, adds intrinsic dimensions and responsive image markup, minifies HTML/CSS/JS, regenerates the sitemap and builds the Pagefind index. Dependency files in `node_modules/` are ignored by Git. Commit the lockfile and rebuild output with changes.

## Visual system

`src/assets/css/style.css` starts with semantic tokens for the ivory light edition and dark edition, shared spacing, the heading scale, borders and motion. Cormorant Garamond and Manrope are self-hosted. Artwork uses square gallery frames with fine inset edges, soft shadows and captions below the image. Floating navigation and rounded reading controls use restrained glass with opaque and reduced-transparency fallbacks. Sparse CSS geometry marks selected section transitions. Button elevation, link underlines and theme transitions respect reduced motion; text remains visible without JavaScript. Hero images load eagerly at high priority; images below the cover load lazily.

The owner-requested color refinement adds warmer parchment in light mode and lighter midnight-blue surfaces in dark mode. Sage/forest, indigo and clay section backgrounds add variety; theme-aware terracotta and antique gold remain readable. Colored section treatments apply to screens, preserving the light print edition.

## Contribute

Use a feature branch and a pull request. Follow the existing visual style, use descriptive image alt text, give each page a unique title and description, and link story references to entries in `sources.html`. Preserve distinctions between textual sources and interpretations in different traditions. Use artwork you have permission to share and record its provenance in Sources. Avoid publishing full copyrighted book scans or private account credentials.

Add pages as `.njk` files with the existing front matter and shared layout. Add images under `src/assets/images/`; use their `/assets/images/` paths in page content. Add a source entry and related story navigation for each new narrative. Menus and footers are edited once in the shared includes.

Use each photograph or artwork in only one visible placement across the site. Responsive sizes of that placement are generated automatically; do not create renamed copies or alternate crops to reuse it elsewhere. The site check rejects byte-identical image reuse. Review subjects visually as well, especially deity iconography. Captions distinguish contributed devotional artwork, temple photographs and AI-generated illustrations.

Contributed image masters: `temple-photograph.webp` comes from IMG_4273.JPG; `temple-shikhara.webp` from IMG_3634.JPG; `lalita-lotus-contributed.webp` from IMG_3594.JPG; and `lalita-kameshvara-contributed.webp` from IMG_3632.JPG. These were supplied by the site owner. Temple identities are left unspecified pending confirmation.

Before committing, run:

```sh
npm run build
npm run lint
npm run check
npm test
```

GitHub Actions repeats these checks on pushes and pull requests: HTML/CSS linting, internal file and anchor checks, metadata and image checks, source citations, and keyboard/interaction tests. Review the resulting pages on narrow and wide screens before merging.

Optional rendered QA: with Playwright and Chrome available, run `node scripts/test-browser.mjs` while the preview server is running. `SANATAN_PLAYWRIGHT_PATH` may point to an installed Playwright module. Screenshots, browser results and a print PDF are written under ignored `.qa/`. `SANATAN_PYTHON` can select a Python executable for `npm run check`.

See `IMPLEMENTATION_REPORT.md` for current changes and verification limits; `ART_DIRECTION.md`, `IMAGE_PROMPTS.json` and `ARTWORK_LEDGER.json` document artwork outside the public build. Shared story metadata and discovery links live in `src/data/stories.json` and `journeys.json`.

## Hosting

Publish the contents of `dist/` at the domain root on a static host with `404.html` as its error page. The current deployment is private; `robots.txt` discourages indexing. Change the canonical domain in page metadata and the build script if moving hosts, and review indexing settings when changing the site's access policy. Social preview metadata is included, but crawlers may not preview private pages.


## Krishna and Govardhana reader — 11 October 2026

Owner-approved full reader added in eight chapters, following Bhagavata Purana 10.24–27 with original condensed prose and separate editorial reflection. Two unique AI-generated illustrations bring the artwork ledger to 47 placements. The site now has 20 pages, 18 indexed pages and five full story readers. Collection, Krishna entry, reading path, Sources and story pagination link to the reader. See GOVARDHANA_RESEARCH.md and IMAGE_PROMPTS.json for references and artwork notes.


## Rama’s exile reader — 11 October 2026

Owner-approved eight-chapter reader follows selected Valmiki Ramayana Ayodhya Kanda episodes from the proposed consecration to the first dwelling at Chitrakuta. Two unique built-in Imagegen illustrations; original prompts in IMAGE_PROMPTS.json. Sources, collection, Rama entry, reading path and Hanuman pagination connect to it. Current site: 21 pages, 19 indexed pages, six full readers and 49 unique artwork placements. Research and scope decisions: RAMA_EXILE_RESEARCH.md.


## Devi and Mahishasura reader — 11 October 2026

Owner-approved eight-chapter reader follows Devi Mahatmya 2–4, including the closing hymn and boon. Two unique built-in Imagegen scenes; prompts and review limits preserved. Collection, Durga introduction, reading path, Sources and Govardhana pagination connect to the reader. Current site: 22 pages, 20 indexed pages, seven full story readers and 51 unique artwork placements. Research: DEVI_MAHISHASURA_RESEARCH.md.
