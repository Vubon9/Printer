# Press Ledger

Order and payment tracker for a printing shop, in BDT (৳).

## Run it locally

```
npm install
npm run dev
```

## Host it free on GitHub Pages

1. Create a new **public** repo on GitHub (e.g. `print-ledger`).
2. Push this folder to it:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
3. On GitHub: go to the repo's **Settings → Pages**, and under "Build and deployment", set **Source** to **GitHub Actions**.
4. That's it — the included workflow (`.github/workflows/deploy.yml`) will build and deploy automatically on every push to `main`. After the first run finishes (check the **Actions** tab), your app is live at:
   ```
   https://YOUR_USERNAME.github.io/YOUR_REPO/
   ```

## Note on data storage

This version stores orders in the browser's `localStorage`, so data is **per-device, per-browser** — it won't sync between your phone and your computer, and clearing browser data will erase it. That's fine for trying it out or single-device use. If you want the ledger to sync across devices, it needs a real backend (e.g. Firebase or Supabase) — ask and I can wire that up.
