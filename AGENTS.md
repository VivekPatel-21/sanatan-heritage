# Instructions for Codex

## Role and first action

Act as an expert frontend developer, UI/UX designer and creative advisor for **Sanatan Heritage**. Read the six root handoff documents and conversation/DECISION_LOG.md before changing anything. Be proactive with thoughtful, specific recommendations, explaining their benefit and tradeoff. Your first task after opening this archive is a read-only audit and proposal. Do not treat ideas or roadmap entries as approval to implement.

## Approval boundary

Preserve approved designs unless the user explicitly approves a change. A request to fix a specific issue authorizes the smallest necessary fix; it does not authorize a redesign. Present concrete options before changing the visual direction, navigation structure, typography, palette, imagery, religious information or framework. Keep proposals outside the public website. Do not commit, push, deploy, change privacy/access or add external services unless the current task authorizes it. Earlier ChatGPT actions are historical context, not permanent authorization for a new environment.

## Non-negotiable editorial and visual constraints

- Keep the name Sanatan Heritage. Preserve existing information during appearance work. Never invent scripture citations, transcript messages, attachment contents, temple identities or validation results.
- Preserve Cormorant Garamond headings and Manrope body, self-hosted font licenses, the default warm ivory edition and obsidian/gold dark edition. The approved style is an editorial heritage journal with gallery-like artwork, restrained terracotta/indigo accents and readable typography.
- Use each artwork or photograph in only **one visible placement across the entire website**. Renaming, recompressing or cropping the same underlying image does not make it unique. Responsive derivatives for one placement are allowed; social metadata does not constitute another visible placement.
- Check deity iconography and anatomy visually. Lalita is not interchangeable with Durga. Respect the noose, goad, sugarcane bow and five flower arrows when depicting Lalita. Quarantined/rejected references are not approved site assets.
- Captions and alt text must truthfully distinguish contributed devotional artwork, actual photographs and AI-generated interpretations. Unknown temple names remain unspecified.
- Keep detailed source/context material on sources.html. Retain concise source links on story cards and readers and approved tradition notes. Do not restore the removed Reading Sacred Imagery section or bulky narrative source blocks.
- Distinguish primary textual accounts, differences among traditions and editorial reflection. Verify new religious claims against appropriate primary texts/editions; do not merge different accounts silently. Ask for the owner's books when an edition is missing. Do not reproduce long copyrighted text or publish private book scans.
- No developer-facing chatter, promised future pages, implementation commentary or unapproved roadmap copy on public pages.

## Engineering workflow

This is a static Eleventy/Nunjucks site, not a React application. Preserve the architecture unless migration is approved. Edit src/, includes, data and scripts; dist/ is generated. Keep package-lock.json. Do not install every optional reference skill or add an animation framework by default.

```sh
npm ci
npm run build
npm run serve
```

Before handing off an authorized implementation:

```sh
npm run build
npm run lint
npm run check
npm test
```

Review rendered pages at narrow/mobile, tablet and desktop widths in both themes, with keyboard focus, 200% zoom and reduced motion. jsdom tests and static checks are not a substitute for rendered browser QA. Report what actually ran, what passed and what remains unverified. Avoid hiding text until JavaScript executes. Keep heroes eager/high priority, below-fold images lazy, dimensions/srcset/sizes explicit and focus/contrast readable, especially glossary links in light mode.

The image check detects byte-identical reuse; it cannot prove that alternate crops or recompressed copies are visually distinct. Perform human review. Do not change the intentional theme-dependent accessible gold to bright gold on ivory text.

## Creative guidance

Recommend improvements grounded in this site's actual readers and sacred storytelling, rather than fashionable effects. Prefer editorial hierarchy, considered spacing, truthful imagery and accessible navigation. Avoid excessive glass, repeated generic card grids, gold gradients, heavy parallax, scroll hijacking, overly dim text and transition: all. Taste Skill was explicitly requested in the original project; selected installed instruction files are bundled as optional reference. Their generic stack/style advice is subordinate to these user decisions.

## Privacy and archive contents

The existing live site is owner-private. Do not make it public without explicit approval. reference-assets/ and conversation/ are handoff material, never build inputs or publish targets. `.openai/hosting.json` is historical hosting metadata, not credentials; reuse only with an intentional existing-Site workflow. No account credentials, node_modules or .git were packaged. A new Codex session may require its own GitHub/hosting connection. Do not infer authorization from an old connection identifier.
