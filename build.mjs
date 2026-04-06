// build.mjs
// Bundles src/App.jsx into a single self-contained dist/index.html
// Usage: node build.mjs           (one-time build)
//        node build.mjs --watch   (rebuild on file change)

import esbuild from "esbuild";
import fs from "fs";
import path from "path";

const watch = process.argv.includes("--watch");
const outDir = "dist";
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const entryPoint = "src/entry.jsx";

// Write a minimal entry file that mounts the app
fs.writeFileSync(entryPoint, `
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
createRoot(document.getElementById("root")).render(React.createElement(App));
`);

const buildOptions = {
  entryPoints: [entryPoint],
  bundle: true,
  minify: true,
  format: "iife",
  jsx: "transform",
  jsxFactory: "React.createElement",
  jsxFragment: "React.Fragment",
  external: [],
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  write: false, // we'll inline the output
};

async function build() {
  try {
    const result = await esbuild.build(buildOptions);
    const js = result.outputFiles[0].text;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ServiceLog — Fleet Maintenance Tracker</title>
  <meta name="description" content="Track vehicle and equipment service history for your fleet." />
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚙</text></svg>" />
</head>
<body>
  <div id="root"></div>
  <script>${js}</script>
</body>
</html>`;

    fs.writeFileSync(path.join(outDir, "index.html"), html);
    console.log(`✓ Built dist/index.html (${(html.length / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.error("Build failed:", err.message);
    process.exit(1);
  }
}

if (watch) {
  const ctx = await esbuild.context({ ...buildOptions, write: false });
  await ctx.watch();
  console.log("Watching for changes...");
  // Rebuild on change
  const { default: chokidar } = await import("chokidar").catch(() => ({ default: null }));
  if (chokidar) {
    chokidar.watch("src/**/*.jsx").on("change", () => {
      build();
    });
  } else {
    // Fallback: just build once
    await build();
  }
} else {
  await build();
}
