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
