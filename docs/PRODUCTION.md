# Production: shreembala.com

The owner confirmed on 25 October 2026 that Vercel deploys this repository's main branch automatically. The apex redirects to https://www.shreembala.com, which is the canonical origin in src/data/site.json. The separate ChatGPT Site remains owner-private; it is not the public hosting target.

## One origin, generated during rendering

Eleventy reads site.json through scripts/site-config.mjs. Canonical/social URLs and JSON-LD are rendered from that data, not corrected by a post-build origin patch. Changing site.origin once updates page metadata, structured data, robots, sitemap and release metadata. Front matter only identifies image sources; the build generates 1200×630 JPEG social derivatives under assets/social, each below a tested 300 KB budget. This is an engineering budget, not a guaranteed WhatsApp preview or an asserted platform limit. Public crawler access and cache behavior still matter.

## Deployment and headers

vercel.json declares npm ci, npm run build and dist output, plus the security headers. The build derives a portable dist/_headers from that same configuration. The preview server applies those headers so browser tests exercise the actual policy. Pagefind requires WebAssembly permission; dynamic positioning and its UI require inline styles. Inline executable scripts and event handlers are not allowed by the policy. JSON-LD contains no invented publication dates or review credentials.

Vercel's existing Git integration publishes main. GitHub CI now runs build/lint/static/unit checks plus Chromium/axe across 375/768/1440px in both themes, retaining failure traces/reports. After successful CI, verify-production waits for the exact commit in the live release.json, then checks the origin, security headers, structured data and social JPEG. No Vercel token is needed for this public verification. The Vercel integration is the deployer; CI verifies it. Requiring CI completion before production publication remains a Vercel/project protection setting and is not implied by this workflow.

## Public asset permissions

The owner reports that some contributed assets still need permission checks. ASSET_RIGHTS_REVIEW.csv records existing provenance and a place to record evidence; it does not claim the unknown permissions are cleared. Identify the outstanding files and supply permission/credit evidence, or approve replacements. Existing scripture scans remain outside the public build and repository.

## Separate follow-up work

Large legacy CSS extraction and moving historical handoff documents are maintenance changes, separate from these production fixes. Preserve the current cascade and approved appearance when tackling them. Recorded audio/further family adaptations remain dependent on reviewed recordings and the owner's source books. No Hindi section is being reintroduced.

References: [Vercel project configuration](https://vercel.com/docs/project-configuration/vercel-json), [Playwright CI](https://playwright.dev/docs/ci), [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing).
