// build.mjs
import esbuild from "esbuild";
import fs from "fs";
import path from "path";

const outDir = "dist";
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

// Write entry point
fs.writeFileSync("src/entry.jsx", `
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
createRoot(document.getElementById("root")).render(React.createElement(App));
`);

try {
  await esbuild.build({
    entryPoints: ["src/entry.jsx"],
    bundle: true,
    minify: true,
    format: "iife",
    jsx: "transform",
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    define: { "process.env.NODE_ENV": '"production"' },
    outfile: path.join(outDir, "bundle.js"),
  });

  const js = fs.readFileSync(path.join(outDir, "bundle.js"), "utf8");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ServiceLog — Fleet Maintenance Tracker</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚙</text></svg>" />
</head>
<body>
  <div id="root"></div>
  <script>${js}</script>
</body>
</html>`;

  fs.writeFileSync(path.join(outDir, "index.html"), html);
  fs.unlinkSync(path.join(outDir, "bundle.js"));
  console.log("Built dist/index.html (" + (html.length / 1024).toFixed(1) + " KB)");
} catch (err) {
  console.error("Build failed:", err.message);
  process.exit(1);
}
