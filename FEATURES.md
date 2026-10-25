# Features and approval status

“Implemented” describes source present in this snapshot. It is not a claim that every browser/device was visually tested. “Proposed” is a wishlist, not permission to build immediately.

| Feature | Status | Notes |
|---|---|---|
| Homepage, introduction, divine forms, sacred texts | Implemented / approved | Existing information preserved through redesign |
| Photographic homepage hero | Implemented / approved | Owner photograph, viewport-height cover, centered copy, gentle mouse parallax and still-image fallbacks |
| Lalita dedicated page | Implemented / approved | Lalita is the Devi overview image; Durga has a separate entry |
| Stories collection | Implemented / approved | Eight cards; every card has a source line to a matching Sources anchor |
| Lalita and Bhandasura | Complete reader / approved | Brahmanda Purana/Lalita Mahatmya reference trail |
| Shiva and Parvati | Complete reader / approved | Shiva Purana account and distinct interpretive notes |
| Shiva drinks Halahala | Complete reader / approved | Bhagavata 8.7 primary, Skanda comparative account |
| Hanuman’s journey to Lanka | Complete reader / approved | Eight chapters, original illustrations and Valmiki Ramayana references |
| Krishna and Govardhana | Complete reader / approved | Eight chapters, two new illustrations and Bhagavata 10.24–27 references |
| Rama’s exile | Complete reader / approved | Eight chapters, two unique illustrations and Valmiki Ramayana references |
| Devi and Mahishasura | Complete reader / approved | Eight chapters, unique artwork and Devi Mahatmya 2–4 references |
| Bhagiratha and the Ganga | Complete reader / approved | Eight chapters, two unique illustrations, sources and reading controls |
| Narrative depth | Implemented in full readers | Reading time, characters, chapters, progress, tradition/interpretation notes, related navigation |
| Sources page | Implemented / approved | Detailed bibliography centralized; small reader/card links retained |
| Reading paths | Implemented / approved | Four curated paths, including Stories of Shiva; check destination maturity |
| Glossary | Implemented / approved | Sanskrit, Devanagari/pronunciation and JSON-backed clickable definitions |
| Directory filters/search | Implemented / approved | Deities and glossary client-side filtering |
| Site-wide search | Implemented / approved | Pagefind static index, generated at build |
| Shared navigation/footer | Implemented / approved | Eleventy/Nunjucks shared templates, mobile menu |
| Light/dark preference | Implemented / approved | localStorage; ivory default, obsidian/gold dark edition |
| Unique image policy | Implemented checks / approved | 53 visible placements recorded; SHA check cannot detect perceptual reuse |
| Responsive asset build | Implemented / approved | Sharp, lazy/eager handling, dimensions, minification |
| Metadata / sitemap / robots / 404 | Implemented / approved | Unique head metadata, OG; private site crawlers may not preview |
| Developer README and CI | Implemented / approved | Setup/contributing, lint/link/interaction checks |
| Hindi and possibly Gujarati | Proposed by owner | No translated edition yet |
| Audio narration | Proposed by owner | No audio assets/player/provider yet |
| Festival and tithi calendar | Proposed by owner | No implementation; calendar/location conventions need agreement |
| Places / tirtha map | Proposed by owner | No map implementation or geodata yet |
| Family companion | Implemented / approved | Two adaptations, discussion questions and browser print styles |
| Story-of-the-week newsletter | Proposed by owner | No backend, signup, email consent or sending service |
| Connected heritage explorer | Implemented / approved | Four curated story/deity/text/term journeys |
| Festival dossiers | Implemented / approved | Three sourced dossiers; no exact-date/tithi calendar |
| Sacred places journal | Implemented / approved | Varanasi and Rameswaram; owner photographs stay unidentified |
| Reader preferences / bookmarks | Implemented / approved | Text size, chapter highlighting and explicit device-local bookmark |
| Approximate pronunciation aid | Implemented / approved | Browser speech with Sanskrit/Hindi voice preference and labeled fallback |
| Different tellings | Implemented / approved | Concise comparisons on Sources; accounts remain distinct |

## Editorial requirements for expansion

New readers need a verified source entry, careful tradition distinctions, unique art, a readable mobile structure and connections back into the collection. Do not claim an exact single number of gods/goddesses without contextualizing scriptural/traditional interpretations. Preserve existing phrasing unless a content correction is approved. Never insert implementation promises or chat instructions into the website.

User-supplied books are reference material. Availability, rights and editions differ; copying a PDF into this private handoff does not license public distribution. The sources.njk content is the current published bibliography, not proof that every uploaded book has been cited or exhaustively reviewed.


## October 21 discovery and reading update

All nine priorities from the owner's review are implemented: corrected Bhagiratha links on Places; explicit search-result titles and one result per page; browser-local reading library; shared reading-path completion and estimated time; connected journeys for all eight stories; an 18-term glossary with six new sourced entries; three unique journal illustrations; About and editorial standards; and shareable search/filter URLs (stories, deity/glossary directories and connected journeys). The site now has 25 routes and 56 narrative image placements, plus shared branding.

Progress is explicit: reading a chapter records a resume point, while the reader chooses when to mark a story/page as read. Existing chapter bookmarks migrate into the library. Storage failures fall back to current-page state with visible feedback; there is no account or cross-device sync. Personal library content is excluded from the search index.


## October 22 — Dhruva and supplied-book source policy

The owner approved one new story and clarified that new information must come only from their supplied books or exact book links, with more unique narrative images. Dhruva’s childhood episode follows the supplied Gita Press Sanskrit–Hindi Bhagavata Purana Volume 1, 4.8–9. Added one reader, one collection card, a centralized source entry and a connected journey. Four distinct commissioned illustrations serve the card, Narada’s guidance, Madhuvana and Vishnu’s appearance. Existing site design is preserved.
