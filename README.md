# Junheng Li · Personal website

An English-language, research-focused personal website, published at **https://li-junheng.github.io/**.

## Local preview

Serve this directory with any static HTTP server, for example:

```sh
python3 -m http.server 4173
```

Open `http://localhost:4173`. No package installation or build step is required.

## Editing

- `index.html`: page structure, English fallback content, publication and project links.
- `styles.css`: responsive layout, colors, and typography.
- `app.js`: accessible research-theme tabs, scroll reveals, reading progress, and active section navigation.
- `motion.css`: staggered entrances, graph signal paths, diagram tracing, workflow sequencing, scroll transitions, and hover effects.
- `assets/`: local fonts, favicon, and social sharing image.

The site respects the operating system's reduced-motion preference. Content remains readable without JavaScript. No analytics, accounts, or server-side code are required.

Supporting text uses a minimum CSS size of 13px, with body copy at 16–17px. Diagram captions live in HTML so they do not shrink with the SVG illustrations. The research workflow animation pauses outside the viewport, in a hidden tab, and when reduced motion is requested.

## Deployment

GitHub Pages publishes the root directory of the `main` branch. The `.nojekyll` file keeps the site buildless. Commits to `main` trigger the Pages deployment.

Publications are identified as preprints. DeepGraph is identified as a team project, and its star count is a conservative snapshot of 1,000+ from October 2026.

## Typography

The site uses locally hosted Source Serif 4 for editorial headings and Inter for body text and interface elements. Both are under the SIL Open Font License; their license texts are included in `assets/fonts/`. No external font service is required.
