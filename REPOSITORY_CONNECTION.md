# GitHub connection — 13 October 2026

The owner requested connecting this local project to `VivekPatel-21/sanatan-heritage`, preserving local work and GitHub history, and opening a pull request.

The extracted project had no `.git` directory. GitHub's default branch was `main`, at `caa8726008cdbad7e5a5766f5e086d7d13ff1888`. Its history includes the earlier illustrated stories, source references, asset pipeline and editorial design refinements. The archived Site history recorded in REPOSITORY_HISTORY.txt is a separate historical summary, not a recovered Git object database.

Branch: `codex/local-site-and-handoff-2026-10-13`. The fetched GitHub `main` commit is the branch's starting point. Initialising Git and reading its index did not check out or overwrite local website files. The latest local source, required website images/fonts/licenses, project configuration, research/provenance files and handoff Markdown documents are included.

Private reference books, original uploads, rejected/reference assets, credentials, hosting/session metadata, dependency/cache folders, QA output and archive inventories are excluded. Previously tracked `dist/` and root `pagefind/` output are removed from the new commit's index only; local build files remain on disk and existing commits retain their history. Run `npm ci` and `npm run build` to regenerate the website.

The pull request includes the eight full readers, related reading journeys and companions, reader/accessibility improvements, approved colours/glass polish, and contributed-photo homepage with restrained cursor motion. It does not merge the pull request or deploy the website.

On 13 October, build, lint, site and interface checks passed, followed by 138 rendered browser scenarios. See VALIDATION.md for coverage and limits. Command-line Git has no saved GitHub login on this machine; immutable Git objects and the branch commit are published using the owner's connected GitHub account, then fetched into the local checkout. The remote tree is checked against the local staged Git tree before publication. Future command-line pushes require the owner's usual Git authentication.
