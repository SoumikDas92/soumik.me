# soumik.me

Personal portfolio of Soumik Das — a static site (HTML/CSS/JS, no build step).

## Structure

```
public/            ← the actual website (what gets deployed)
  index.html
  style.css
  script.js
wrangler.jsonc     ← Cloudflare Workers deploy configuration
package.json       ← helper scripts
```

## Deploying

The site deploys to **Cloudflare Workers** as a static-assets site:

```bash
npm install        # once, to get wrangler
npm run preview    # serve locally via wrangler dev
npm run deploy     # deploy to Cloudflare
```

Connected to Git? Pushes to `main` trigger an automatic deploy via Cloudflare
Workers Builds — no manual commands needed. Only the `public/` folder is uploaded.

## Updating the portfolio

- Edit `public/content.js` to add projects, timeline entries, learning notes, and real contact URLs. Empty contact fields are displayed as “Not listed.”
- Edit `public/index.html` for the introduction, skills, and education. The project archive stays empty until real projects are added.
- The arm inspector is built from procedural Three.js geometry in `public/lab.js`. Its dependencies load only when the inspector opens; the hero uses compressed concept artwork. Three.js and Space Grotesk are vendored with their licenses.
- No contact backend is configured. The site does not simulate message submission.
