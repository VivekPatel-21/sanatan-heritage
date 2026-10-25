# Sanatan Heritage — Codex handoff

Prepared 2026-10-10 UTC. This is a portable snapshot, not a new deployment.

1. Extract the ZIP and open the **sanatan-heritage** folder in Codex or VS Code. `AGENTS.md` must be at the working project root.
2. Read AGENTS.md, PROJECT_CONTEXT.md, DESIGN_SYSTEM.md, FEATURES.md, ROADMAP.md and IDEAS.md. The original README.md remains intact.
3. Use Node.js 22+ and Python 3. Run `npm ci`, `npm run build`, then `npm run serve`. Open http://localhost:8080. Dependency installation needs network access; node_modules is deliberately omitted.
4. Review before modifying. The suggested first prompt is below.

> Read the handoff documents and inspect the current site as an expert frontend developer, UI/UX designer and creative advisor. Preserve the approved content, Cormorant Garamond/Manrope typography, ivory light edition and obsidian-and-gold dark edition, and unique imagery. Audit desktop/mobile, both themes, keyboard accessibility, performance and source consistency. Recommend 10 concrete improvements, prioritise them, and make no website changes until I approve a scope. Report limitations honestly.

## Contents

- Complete tracked repository snapshot: editable source, assets/fonts/licenses, scripts, lockfile, CI and generated dist/ for immediate preview.
- Six requested guidance documents plus conversation decision/excerpt records and availability notes.
- Reference artwork originals, supplied photographs, available project book PDFs and installed Taste Skill reference files. These are working references, **not public website assets**.
- INVENTORY.csv and SHA256SUMS.txt identify every packaged file. REPOSITORY_HISTORY.txt records available commit summaries; `.git` is omitted.

The original full conversation export was unavailable. Conversation records are explicitly partial/reconstructed; they do not pretend to be an original transcript. Some earlier attachments remain unavailable. See conversation/TRANSCRIPT_AVAILABILITY.md and reference-assets/README.md.

Do not publish this ZIP as a website. Deploy only dist/ after explicit approval. Supporting books, private uploads and handoff documentation must stay out of public hosting. `.openai/hosting.json` identifies the existing private ChatGPT Site; it does not register a new Codex project or grant account access.
