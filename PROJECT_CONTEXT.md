# Project context

## Purpose and audience

Sanatan Heritage is an illustrated, thoughtful introduction to Sanatan Dharma: foundational understanding, divine forms, sacred texts, Sanskrit vocabulary and accessible narratives. The owner supplies stories, books and optional photographs/art. Readers should feel they are exploring a cultural journal and visual collection, not confronting a wall of book text. The desired path is introduction → interest/topic/deity/text → curated story → further reading.

## Snapshot and destinations

- Source checkout HEAD: `cd04b377ded488ed6077e6f59c09a6b3eac94094` (clean at packaging).
- GitHub repository: https://github.com/VivekPatel-21/sanatan-heritage
- Last recorded GitHub main snapshot: `caa8726008cdbad7e5a5766f5e086d7d13ff1888`. The Site checkout and GitHub have independently recorded commits; do not assume their hashes should match. Verify remote state in the new environment before pushing.
- Existing private preview: https://sanatan-heritage.vivopatel1304.chatgpt.site
- Hosting manifest targets dist/. It identifies an existing private Site and should not be copied into a new hosting project blindly.
- Original local checkout `/workspace/sites/sanatan-heritage` is historical; all archive-relative paths work from the extracted root.

No website modifications or new deployment were made for this handoff. All repository files are copied byte-for-byte, including generated output.

## Architecture

Eleventy 3 + Nunjucks shared layout/header/footer, plain CSS/JavaScript, JSON glossary definitions, static Pagefind search. Node >=22 and Python 3. The lockfile is authoritative. No server, authentication, payment, newsletter backend or translation service.

| Location | Purpose |
|---|---|
| src/*.njk | Page content and metadata |
| src/_includes/ | Shared layout, header and footer |
| src/assets/css/style.css | Semantic tokens, themes, responsive page/component styling |
| src/assets/js/ | Theme, menu, glossary, directory filters, stories and search |
| src/assets/images/ | Website image masters |
| src/assets/fonts/ | Cormorant Garamond, Manrope, font licenses |
| src/data/glossary.json | Single glossary definition data source |
| scripts/build.mjs | Eleventy, responsive image generation, minification, sitemap, Pagefind |
| scripts/check-site.py | Internal links/anchors, metadata, images and source checks |
| scripts/test-ui.mjs | jsdom interaction checks |
| .github/workflows/check.yml | Build, lint, static checks and UI interaction CI |
| dist/ | Generated deployable static site, bundled for preview |
| reference-assets/ | Offline-only research and art originals; not site content |

Sharp generates responsive WebP sizes 480, 768, 1200 and original capped at 1600 without upscaling, at quality 82/effort 5. Build adds dimensions and responsive markup. HTML/CSS/JS are minified; Pagefind is generated. Hero images are eager/high priority; other images are lazy.

## Current pages

14 routes: index.html, understanding.html, deities.html, scriptures.html, stories.html, lalita.html, lalita-bhandasura.html, shiva-parvati.html, shiva-halahala.html, sources.html, reading-paths.html, glossary.html, search.html, 404.html.

The collection has eight story cards. Three have complete narratives: Lalita and Bhandasura, Shiva and Parvati, Shiva drinks Halahala. Other cards are previews or collection entries, not evidence of a finished full reader.

## Owner collaboration

The owner likes reviewing pages sequentially, expects suggestions as pages grow, and often supplies optional visual material. Their repeated instruction is to retain information when redesigning. They asked for more sophisticated frontend craft after earlier versions felt generic. Current premium editorial design was approved; it is the migration baseline, not a suggestion to replace it.

The newest handoff instruction adds an explicit approval boundary: Codex should proactively recommend improvements while preserving approved designs until permission is given. First audit, then agree a scope.

## Limits of this record

The exact original conversation export and many early assistant responses are unavailable. Decision notes combine visible user history, current source, previous-session continuity notes and a labelled retrieval summary. They are not a complete transcript. Some uploads have been recovered; others remain unidentified/unavailable. Refer to the availability documents rather than inferring missing pages, sources or approval.


## October 22 — Dhruva and supplied-book source policy

The owner approved one new story and clarified that new information must come only from their supplied books or exact book links, with more unique narrative images. Dhruva’s childhood episode follows the supplied Gita Press Sanskrit–Hindi Bhagavata Purana Volume 1, 4.8–9. Added one reader, one collection card, a centralized source entry and a connected journey. Four distinct commissioned illustrations serve the card, Narada’s guidance, Madhuvana and Vishnu’s appearance. Existing site design is preserved.


## Current homepage — October 23
The owner approved the Ambaji film museum layout as index.html. It is no longer an isolated preview. Homepage CSS/JS: src/assets/css/home-museum.css and src/assets/js/home-museum.js. The old museum-preview.html route redirects to /. Original homepage source remains recoverable in Git history.
