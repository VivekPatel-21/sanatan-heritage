# Sanatan Heritage

An illustrated guide to Sanatan Dharma, its divine forms, sacred texts, Sanskrit vocabulary and stories. The collection includes Lalita and Bhandasura, Shiva and Parvati, and Shiva drinks Halahala, with chapter navigation, characters, tradition notes and references collected on a dedicated Sources page.

## Run locally

Install Node.js 22 or newer and Python 3, then run:

```sh
npm ci
npm run build
npm run serve
```

Open http://localhost:8080. Rebuild after editing source files. The site is static: search, filters, theme preferences and glossary cards run in the browser, without a backend.

## Project structure

- `src/*.njk`: page content and metadata, rendered by Eleventy.
- `src/_includes/`: shared layout, header and footer.
- `src/assets/images/`: image masters, including contributed artwork.
- `src/assets/css/` and `src/assets/js/`: readable styles and interactions.
- `src/data/glossary.json`: the single source of definitions for the glossary page and clickable cards.
- `scripts/`: image optimization, minification, search indexing, validation and local serving.
- `dist/`: generated, deployable site. Edit `src/`, not this folder.

The build creates WebP variants without enlarging originals, adds intrinsic dimensions and responsive image markup, minifies HTML/CSS/JS, regenerates the sitemap and builds the Pagefind index. Dependency files in `node_modules/` are ignored by Git. Commit the lockfile and rebuild output with changes.

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

## Hosting

Publish the contents of `dist/` at the domain root on a static host with `404.html` as its error page. The current deployment is private; `robots.txt` discourages indexing. Change the canonical domain in page metadata and the build script if moving hosts, and review indexing settings when changing the site's access policy. Social preview metadata is included, but crawlers may not preview private pages.
