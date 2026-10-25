# Launch configuration

The owner authorized the premium reading improvements and ongoing GitHub main updates on 24 October 2026. The public corrections email is shreembala@gmail.com.

`src/data/site.json` is the central production origin and indexing configuration. The build applies it consistently to canonical URLs, Open Graph/Twitter images and URLs, language alternatives, robots.txt and sitemap.xml. The current origin and crawler restriction are preserved. The hosting audience is configured at the host; robots.txt is not access control.

When the owner supplies a production domain and explicitly requests a public launch:

1. Set `origin` to the HTTPS origin without a trailing slash. The site expects hosting at the domain root.
2. Set `indexable` to true only for the intended public launch.
3. Run build, lint, check, tests and browser checks. Deploy the generated `dist/` through the existing host workflow; uploading source to GitHub alone does not deploy it.
4. Confirm HTTPS, 404 handling, byte-range video delivery, canonical URLs, the sitemap, social previews and actual audience settings on the host.
5. Measure cold-load performance on the deployed domain and real devices. Local lab results do not certify field Core Web Vitals or actual Safari/iOS/Android behavior.

The contact page opens an email draft; it does not claim a message has been submitted. No contact-service subscription is needed. Read-aloud uses optional browser speech; reviewed recorded narration is still dependent on recordings or an available paid generation service. Hindi is a condensed editorial adaptation, pending fluent independent editorial review. Private PDFs and source-review images must remain outside the tracked/public site.
