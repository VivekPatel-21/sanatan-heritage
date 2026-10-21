# Approved design system

## Identity

Preserve the **obsidian-and-gold** identity: dark mode uses #0d0d0d and antique gold #d4af37; the approved default light edition uses warm ivory with darker accessible gold. The owner-approved 20 October 2026 revision uses Literata for headings and story prose, Source Sans 3 for body/interface text, and Noto Serif Devanagari for Sanskrit/Hindi labels. This is a two-theme identity; do not change default to dark just because obsidian is named in the handoff request.

The authoritative implementation is src/assets/css/style.css. This specification records the shipped design, not the user's earlier sample CSS verbatim.

## Semantic colour tokens

| Token | Light (default) | Dark |
|---|---|---|
| --bg-page | #faf8f3 | #0d0d0d |
| --bg-surface | #fffdf9 | #141414 |
| --bg-panel | #f0ece3 | #1c1b19 |
| --text-primary | #39332f | #f4f1ea |
| --text-muted | #6d645c | #b7b0a4 |
| --accent-terracotta | #954632 | #dda58e |
| --accent-gold | #806322 | #d4af37 |
| --accent-gold-hover | #69501c | #e6c555 |
| --accent-indigo | #424653 | #aeb6ce |
| --border-subtle | #d9d2c6 | #37342e |
| --button-text | #fffdf9 | #0d0d0d |
| --border-glass | rgb(57 51 47 / 12%) | rgb(255 255 255 / 8%) |
| --border-gold-subtle | rgb(128 99 34 / 25%) | rgb(212 175 55 / 25%) |
| --nav-glass | rgb(250 248 243 / 94%) | rgb(13 13 13 / 94%) |

Light shadow: `0 18px 48px -22px rgb(73 53 31 / 25%)`; dark shadow: `0 20px 48px -18px rgb(0 0 0 / 65%)`. Use depth sparingly. Legacy aliases (ivory/ink/muted/gold/etc.) map to semantic variables for existing components; do not hard-code an inverse palette into sections.

## Type and rhythm

| Element | Scale |
|---|---|
| h1 | clamp(2.5rem, 4.7vw, 5rem) |
| h2 | clamp(2rem, 3.2vw, 3.25rem) |
| h3 | clamp(1.5rem, 2.1vw, 2.1rem) |
| h4 / h5 / h6 | 1.75 / 1.5 / 1.25rem |
| Heading default | Literata, weight 400, line-height about 1.25; upright emphasis |
| Body default | Source Sans 3, 1.0625rem, 1.75 line-height |
| Reader | About 1.0625rem / 1.95 desktop; 1rem / 1.9 mobile |

Fonts are local WOFF2 with font-display swap and optical sizing. Literata and Source Sans 3 include normal/italic variable weights 200–900, Latin and extended-Latin subsets. Noto Serif Devanagari covers Devanagari at weights 400–600. Two regular Latin files are preloaded; other subsets/styles load on demand. Keep the three upstream OFL licenses and FONT_SOURCES.json. Gujarati coverage is not claimed.

Spacing scale: 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6rem. Gutter clamp(1.25rem,4vw,4rem), section spacing clamp(3.75rem,7vw,7rem), max page 82rem, content 74rem, reader 65ch. Art has square gallery frames; control corners 3px.

## Composition and components

- Image-led asymmetrical split hero with a protected readable text column. Preserve image/text alignment; the owner previously reported the homepage art dropping beneath the copy unexpectedly.
- Quiet editorial rules, generous spacing, mixed-scale collection composition rather than one uniform grid everywhere.
- Museum-like captions identify subjects and provenance. Images support narrative comprehension, not random atmosphere. Artwork never repeats across visible pages.
- Navigation alone uses restrained glass (16px blur, solid fallback); content surfaces remain calm and clear.
- Story reader has chapters, readable body column, progress, character box, interpretation distinctions and related/previous-next navigation.
- Sources remain centralized; compact links give readers traceability without interrupting every chapter.

## Motion and responsive behaviour

Timing tokens 180ms and 420ms; easing cubic-bezier(.16,1,.3,1). Hover image zoom about 1.03 with 600ms transform transition. Artwork entrance about 650ms, 12px movement, opacity .65→1. Text stays visible without JS. Reduced-motion preferences disable unnecessary movement. Animate named properties, never transition: all. Do not add heavy parallax or scroll hijacking.

Current responsive rules include 1280, 1100, 760 and 420px with some legacy contexts around 950/680px. Grid and clamp() provide fluid scaling. Test actual layouts instead of treating breakpoint numbers as visual evidence. Progress/header/dialog layers use z-index 40/50/60.

## Quality standard and known limits

Maintain semantic landmarks, skip link, truthful alt text, intrinsic image dimensions, theme contrast, keyboard focus, accessible glossary interactions and a usable mobile menu. Previously invisible light-mode glossary terms were fixed: explicitly regression-check them.

The previous implementation reported automated build/lint/link/interaction checks and static cascade/contrast checks, including 375/768/1440px scenarios. **Rendered browser visual QA was unavailable.** This archive does not certify a visual or Lighthouse audit. CSS retains earlier structural rules beneath the current token-led system; broad cleanup requires careful regression review and an approved scope.

## Approaches declined/refined

No generic text-only 90vh centred hero, indiscriminate glass panels, repeated art, oversaturated orange/yellow, low-contrast light text on ivory, gold gradients by default, heavy parallax, masonry that disrupts story reading order, or framework migration solely for fashion. Earlier sample snippets were inspiration; their placeholder URLs, rewritten hero copy and transition: all were not adopted as requirements.
