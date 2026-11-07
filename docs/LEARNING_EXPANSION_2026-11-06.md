# Sanatan Heritage learning expansion — November 6, 2026

## Implemented on GitHub main

The approved museum visual system, existing religious narratives, narrative artwork and architecture remain intact.

- Eight source-guided cross-link sections: Scriptures, Deities, Avatars, Great Rishis, Philosophy, Fourteen Lokas, Manus/Manvantaras and Mahapuranas.
- Four additional reading paths: four Upanishadic dialogues, cosmology and time, Vishnu's manifestations and the Goddess in separately named texts. Eight reading paths total.
- Twelve additional Sanskrit terms (41 total) with five topic filters, URL-shareable selection, accessible native controls and source-note links.
- Source bibliography anchor repairs for avatars, mahapuranas and philosophy; an additional glossary source section; easier fallback navigation on the search page.
- Responsive study-card styles and a new regression test included in the existing GitHub CI test script.

## Editorial guardrails

Existing owner-supplied and previously reviewed editions are used rather than importing new claims from internet summaries. Relevant internal source dossiers are docs/LOKAS_SOURCE_REVIEW.md, docs/MANVANTARA_SOURCE_REVIEW.md, docs/RISHIS_SOURCE_REVIEW.md and docs/PHILOSOPHY_GUIDE_SOURCE_REVIEW.md. These additions are brief editorial paraphrases, not copied translation paragraphs. Devi Mahatmya in Markandeya Purana remains distinct from Lalita Mahatmya in Brahmanda Purana. Glossary pronunciations are approximate. No source PDFs were published and no new images were reused.

## Verification and remaining production responsibilities

Automated build, lint, site checks, unit tests and browser tests are configured in .github/workflows/check.yml and must pass. A commit alone does not mean those checks are complete. The already-configured Google Analytics ID is not proof of incoming traffic or tracking without account/property confirmation. Production performance, physical mobile Safari, real screen readers and artwork permissions require separate verification. Reviewed recorded narration, a tithi calendar, location map and newsletter remain separate projects with data-service or permission dependencies; they have not been silently activated.

## Development note

All changes are authored in src/, data, CSS and scripts. dist/ is generated; no need to commit build artifacts. Existing static Eleventy/Nunjucks stack and public canonical https://www.shreembala.com are preserved.
