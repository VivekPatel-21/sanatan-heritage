# Launch configuration

The owner authorized the premium reading improvements and ongoing GitHub main updates on 24 October 2026. The public corrections email is shreembala@gmail.com.

`src/data/site.json` is the central production origin and indexing configuration. The build applies it consistently to canonical URLs, Open Graph/Twitter images and URLs, robots.txt and sitemap.xml. The current origin and crawler restriction are preserved. The hosting audience is configured at the host; robots.txt is not access control.

When the owner supplies a production domain and explicitly requests a public launch:

1. Set `origin` to the HTTPS origin without a trailing slash. The site expects hosting at the domain root.
2. Set `indexable` to true only for the intended public launch.
3. Run build, lint, check, tests and browser checks. Deploy the generated `dist/` through the existing host workflow; uploading source to GitHub alone does not deploy it.
4. Confirm HTTPS, 404 handling, byte-range video delivery, canonical URLs, the sitemap, social previews and actual audience settings on the host.
5. Measure cold-load performance on the deployed domain and real devices. Local lab results do not certify field Core Web Vitals or actual Safari/iOS/Android behavior.

The contact page opens an email draft; it does not claim a message has been submitted. No contact-service subscription is needed. Read-aloud uses optional browser speech; reviewed recorded narration is still dependent on recordings or an available paid generation service. Private PDFs and source-review images must remain outside the tracked/public site.

## Verified private release — 24 October 2026

Published successfully to https://sanatan-heritage.vivopatel1304.chatgpt.site using the existing owner-private audience. Site source commit: f59c796abd08c443faf2c3ec16cc7ed50b408adf. Saved version: appgprj_6ac5cd85e9cc8191924154bf8e6945ce~appgver_479b08f70b548191bf008c6b8d111a1e. Deployment: appgdep_6add73c765cc8191a8733a6c27acbbb9, native status succeeded. GitHub implementation commit: 327524a; completed browser validation: 24b8d92. The deployment archive contains only the verified static build and hosting manifest, with no book scans or private source-review files. This release record is source documentation; it does not change website output.
