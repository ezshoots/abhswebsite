# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the website for **Above and Beyond Home Solutions, LLC**, a home inspection company in Southwest Florida. Built with Astro, Tailwind CSS, and deployed on Cloudflare Pages.

## Commands

```bash
npm run dev       # Start dev server (localhost:4321)
npm run build     # Build for production (outputs to ./dist)
npm run preview   # Preview production build locally
```

Formatting is handled by Prettier with the `prettier-plugin-astro` and `prettier-plugin-tailwindcss` plugins. There are no lint or test commands configured.

## Architecture

**Framework**: Astro (static site generation) with Tailwind CSS for styling and `astro-compress` for production asset compression.

**Routing**: File-based routing in `src/pages/`. Key pages: `index.astro`, `about.astro`, `services.astro`, `blog.astro`, `schedule.astro`, `contact.astro`.

**Layout**: All pages wrap with `src/layouts/Layout.astro`, which includes the `Header`, `Footer`, `BackToTop`, and `Schedulehomebutton` components, and imports all client-side scripts.

**Components** (`src/components/`): Section-level components used within pages (e.g., `Hero.astro`, `Features.astro`, `Testimonials.astro`). Layout sub-components live in `src/components/layout/`.

**Blog System**: Blog posts are Astro Content Collections defined in `src/content/config.js`. Posts live in `src/content/blog/` as `.md` files. The dynamic route `src/pages/blog/[slug].astro` renders individual posts. Blog post frontmatter has a rigid schema — all fields (`draft`, `title`, `snippet`, `image`, `bigImg`, `authorImg`, `publishDate`, `author`, `comments`, `views`, `category`, `tags`, `postDetails`, `quotes`) are required.

**Client-side Scripts** (`src/scripts/`): Vanilla JS modules for sticky header, dropdown nav, dark mode toggling, scroll-to-top, scroll-based menu highlighting, and Swiper.js testimonial carousel. All are imported in `Layout.astro`.

**Dark Mode**: Uses Tailwind's `class` strategy. The `darkMode.js` script toggles the `dark` class on `<html>` and persists preference to `localStorage`.

**Tailwind Config**: Custom breakpoints (sm: 540px, md: 720px, lg: 960px, xl: 1140px, 2xl: 1320px), custom color palette (primary blue `#3758F9`, secondary green `#13C296`), and a `herobg` gradient+image background utility.

## Adding Blog Posts

Create a new `.md` file in `src/content/blog/`. All frontmatter fields in the schema are required. Images go in `public/assets/blog/`. The `postDetails` object contains five paragraphs and two section titles rendered in a fixed layout — this structure cannot be changed without modifying `[slug].astro`.
