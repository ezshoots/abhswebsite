# CLAUDE.md

## Project Overview

This is the website for **Above and Beyond Home Solutions, LLC**, a home
inspection company in Southwest Florida. Deployed on Cloudflare Pages.

## Commands

Formatting is handled by Prettier. There are no lint or test commands configured.

## Gotchas

**Blog post frontmatter is rigid.** Every field in the `src/content/config.js`
schema is required: `draft`, `title`, `snippet`, `image`, `bigImg`, `authorImg`,
`publishDate`, `author`, `comments`, `views`, `category`, `tags`, `postDetails`,
`quotes`.

**`postDetails` has a fixed shape**: five paragraphs and two section titles,
rendered in a fixed layout by `src/pages/blog/[slug].astro`. The structure
cannot be changed without editing that route.

Blog post images go in `public/assets/blog/`.
