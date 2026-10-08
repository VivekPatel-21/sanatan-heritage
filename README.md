# Sanatan Heritage

An illustrated guide to Sanatan Dharma, its divine forms, sacred literature and stories. The site uses plain HTML, CSS and JavaScript, with a generated Pagefind search index.

## Pages

- Home, Understanding Sanatan Dharma, Gods & Goddesses, Sacred Texts & Scriptures
- Story collection: six short previews and two complete retellings: Lalita and Bhandasura, and Shiva and Parvati
- Lalita Tripurasundari introduction
- Sources & References, with a unique source entry linked from every story card
- Reading paths: Start here, Stories of courage, Enter the Ramayana
- Sanskrit glossary, with Devanagari, transliteration and approximate pronunciation
- Site-wide search and a custom 404 page

## Local development

Requires Node.js and Python 3.

```sh
npm ci
npm run build
npm run serve
```

Open http://localhost:8080. In the Sites checkout, HTML and static output live in `dist/`. In the GitHub mirror they live at the repository root; the build and serve scripts support both layouts. Edit the HTML, then rebuild after content changes. The build refreshes `sitemap.xml` and the Pagefind index. The generated `dist/pagefind/` files must accompany a static deployment; search requires HTTP serving rather than opening files directly.

## Editorial conventions

Keep narrative paragraphs short and pair them with relevant images. Identify previews as previews. Preserve differences between scriptural narratives and commentary. Source details belong on `sources.html`; story cards link to their specific entry. Link the first useful occurrence of glossary terms, avoiding repeated links. Keep project plans and messages to the site owner out of visitor copy.

The complete stories include estimated reading time (approximately 200 words per minute), a character box, a tradition note, and previous/next links that clearly identify preview destinations. Curated paths contain only existing pages and episodes.

## Images

Story scenes: `bhagiratha-ganga.webp`, `hanuman-lanka.webp`, and three Shiva–Parvati illustrations. Several remaining cards intentionally use deity portraits rather than episode scenes; their alt text identifies them accordingly. Lalita artwork and its visible attribution marks are preserved. AI-generated illustrations are labeled on the site. `og.png` is the branded sharing card; Lalita detail pages use their own primary devotional artwork in metadata.

## Hosting and discovery

Production origin: https://sanatan-heritage.vivopatel1304.chatgpt.site

The site remains owner-private. `robots.txt` disallows crawling while it is private. Open Graph/X metadata and the sitemap are prepared, but social-media crawlers and public search engines cannot read an authenticated private site. If the owner chooses public access, deliberately update the robots policy and review canonical/preview URLs. Do not change sharing automatically. `404.html` is intended for static hosts that support custom not-found pages.

The Sites manifest is `.openai/hosting.json`. The GitHub mirror contains the same deployable files at the repository root, with developer files under `scripts/`. Do not include credentials, uploaded reference books or `node_modules` in version control. The existing GitHub `temple.webp` asset corresponds to the Sites `temple.png` image.

## Extending the collection

For each new story, add a stable card ID, source entry, matching artwork, and metadata. Rebuild the search index and sitemap. Add full-story navigation only to available stories or clearly labeled previews. At about fifteen content pages, introduce shared header/footer templates to reduce repeated edits. Translation, audio, calendar, places, family printables and newsletter features are separate additions, not advertised as available on the site.
