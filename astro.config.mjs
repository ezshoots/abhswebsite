import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import compress from "astro-compress";
import sitemap from "@astrojs/sitemap";
import fs from 'node:fs';
import { execSync } from 'node:child_process';

// Sitemap <lastmod>: blog posts use frontmatter (updatedDate, else publishDate);
// other routes use the last git commit that touched the page file. Skipped when
// git history is unavailable or shallow, so we never emit a misleading date.
const blogLastmod = {};
for (const f of fs.readdirSync('src/content/blog')) {
  if (!f.endsWith('.md')) continue;
  const src = fs.readFileSync(`src/content/blog/${f}`, 'utf8');
  const m = src.match(/^updatedDate:\s*"([^"]+)"/m) || src.match(/^publishDate:\s*"([^"]+)"/m);
  if (m) blogLastmod[`/blog/${f.replace(/\.md$/, '')}/`] = new Date(m[1].replace(' ', 'T'));
}
let gitUsable = false;
try { gitUsable = Number(execSync('git rev-list --count HEAD', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()) > 1; } catch { gitUsable = false; }
function gitLastmod(route) {
  if (!gitUsable) return undefined;
  const base = route === '/' ? 'src/pages/index' : `src/pages${route.replace(/\/$/, '')}`;
  const file = [`${base}.astro`, `${base}/index.astro`].find((c) => fs.existsSync(c));
  if (!file) return undefined;
  try {
    const out = execSync(`git log -1 --format=%cI -- "${file}"`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    return out ? new Date(out) : undefined;
  } catch { return undefined; }
}

// https://astro.build/config
export default defineConfig({
  site: 'https://abovebeyondhomesolutions.com',
  output: 'static',
  // Astro 7 defaults to 'jsx', which drops the line break between text and an
  // inline tag ("By <span>" renders "ByAbove"). true keeps the v6 behavior.
  compressHTML: true,
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    compress(),
    sitemap({
      serialize(item) {
        const route = new URL(item.url).pathname;
        const d = blogLastmod[route] ?? gitLastmod(route);
        if (d && !Number.isNaN(d.getTime())) item.lastmod = d.toISOString();
        return item;
      },
    }),
  ],
});
