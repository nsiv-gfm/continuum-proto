# GFM Cohort Prototype — Local + Vercel Deploy

This is a Vite + React + Tailwind app wired to your prototype component. It includes lightweight shadcn-style UI components to satisfy imports like `@/components/ui/button`.

## Run locally
```bash
npm install
npm run dev
```
Open the printed local URL (usually http://localhost:5173).

## Deploy to Vercel (recommended)
**Prereqs**
- Git + GitHub account
- Vercel account (https://vercel.com) connected to GitHub

**1) Initialize a Git repo and push to GitHub**
```bash
git init
printf "node_modules\n.next\ndist\n.DS_Store\n" >> .gitignore
git add -A
git commit -m "Initial commit: GFM Cohort Prototype local + Vercel"

# Option A: with GitHub CLI (easiest)
# gh repo create gfm-cohort-prototype --source=. --public --push --remote=origin

# Option B: manually create an empty repo on github.com, then:
git branch -M main
git remote add origin https://github.com/<your-username>/gfm-cohort-prototype.git
git push -u origin main
```

**2) Import into Vercel**
- Go to **Vercel → Add New → Project → Import Git Repository** and select your repo
- Framework preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`
- Deploy → you’ll get a Preview URL
- Promote to production or push/merge to `main` to update the Production URL

**SPA routing (already configured)**
This repo includes `vercel.json` with:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```
This ensures client-side routes resolve to the SPA entry.

**Environment variables (if you add any)**
Vercel Project → Settings → Environment Variables → add keys → redeploy.

## Notes
- Dependencies: `react`, `react-dom`, `framer-motion`, `lucide-react`
- Tailwind is preconfigured in `tailwind.config.js` + `postcss.config.js`
- Minimal UI components live in `src/components/ui/`

## Structure
```
/src
  /components/ui        # lightweight shadcn-style components
  gfm_cohort_prototype_smorgasbord_storyboard_app.jsx
  main.jsx
  index.css
index.html
vite.config.js
vercel.json
```

## Next steps
- Commit your own component/style tweaks
- Push to GitHub → Vercel auto-builds every push
- Share the Preview URL for quick feedback
```
