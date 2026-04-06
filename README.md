# ServiceLog — Fleet Maintenance Tracker

Track vehicle and equipment service history for your entire fleet.

## Local Build

```bash
npm install
npm run build        # outputs dist/index.html
```

Open `dist/index.html` in your browser — no server needed, fully self-contained.

## Deploy to Netlify

**Option A — Drag & Drop (fastest)**
1. Run `npm install && node build.mjs` locally
2. Go to [netlify.com/drop](https://app.netlify.com/drop)
3. Drag the `dist/` folder onto the page

**Option B — Git (auto-deploys on push)**
1. Push this folder to a GitHub repo
2. Connect repo in Netlify → Build settings are already set in `netlify.toml`
3. Every push to `main` rebuilds and deploys automatically

## Data Storage

All data is stored in the browser's `localStorage` under the key `svc_tracker_v1`.
Data persists across sessions on the same device/browser. Not shared across devices.

To back up or migrate data, open DevTools → Application → Local Storage and copy the value.

## File Structure

```
service-tracker/
├── src/
│   └── App.jsx          ← all app code lives here
├── build.mjs            ← esbuild bundler script
├── package.json
├── netlify.toml
└── README.md
```

## Making Changes

Edit `src/App.jsx`, then run `node build.mjs` to rebuild.
The output is always a single `dist/index.html` — no other files needed.
