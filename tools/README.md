# tools

## og-image-source.html

Source for `public/og-image.png` — the social share card that renders when the
site is linked on LinkedIn, WhatsApp, Slack, or Twitter.

It is plain HTML sized to exactly 1200 x 630 (the ratio those platforms crop to;
the previous card was square and got sliced). Regenerate after changing any
headline claim or metric, or the card will drift out of sync with the site the
way the last one did.

```bash
# with the gstack browse tool
browse viewport 1200x630
browse load-html tools/og-image-source.html
browse screenshot --viewport public/og-image.png
```

Keep it under ~300 KB. Some scrapers skip larger images; the card it replaced
was 1.87 MB.
