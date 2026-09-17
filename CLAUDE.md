# CLAUDE.md

## Project Overview

This is the website for **Above and Beyond Home Solutions, LLC**, a home
inspection company in Southwest Florida. Deployed on Cloudflare Pages.

## Commands

Formatting is handled by Prettier. There are no lint or test commands configured.

## Gotchas

**Blog post frontmatter is rigid.** Every field in the `src/content.config.js`
schema is required: `draft`, `title`, `snippet`, `image`, `bigImg`, `authorImg`,
`publishDate`, `author`, `category`, `tags`, `postDetails`, `quotes`.

Optional fields: `updatedDate` (drives `dateModified` and sitemap lastmod),
`seoTitle` (shorter `<title>` when the headline runs long), and
`externalSource` for press features that point at an outside article.
`externalSource` takes `publisher`, `title`, `url`, and optional `intro` and
`linkText`; it renders a linked callout under the headline, a closing link
after the last paragraph, and a `citation` node in the BlogPosting schema. See
`src/content/blog/redfin-new-construction-upgrades.md`.

**`postDetails` has a fixed shape**: five paragraphs and two section titles,
rendered in a fixed layout by `src/pages/blog/[slug].astro`. The structure
cannot be changed without editing that route.

**Paragraphs cannot contain links or markup.** The route renders every
`postDetails` field as escaped text, so inline HTML shows up literally. Links
need a dedicated frontmatter field and a rendered element in the route.

Blog post images go in `public/assets/blog/`. Existing images are landscape
WebP, either 1200x900 or 1200x634 for `bigImg` and 800x500 for cards.

## Contact form

The contact form lives in `src/components/ContactForm.astro` and renders inside
`Contactsection.astro`, so it appears on both `/contact` and the homepage.

Submissions POST to `/api/contact`, which is served by
`functions/api/contact.js` (Cloudflare Pages Functions, the live path).
`src/worker.js` serves the same route if the project is ever deployed with
`wrangler deploy` instead. Both delegate to `src/lib/contact-submission.js`.

**Dropdown options are validated server-side.** `src/lib/contact-form-options.js`
is the single source of truth for the service and property type lists. The
Astro component renders those `<option>` elements from it and the handler
rejects anything not in it, so edit that file only. City is free text (the same
file supplies `CITY_SUGGESTIONS` for the datalist only, not validation).

**Required environment variables** (Pages project → Settings → Variables and secrets):

- `RESEND_API_KEY` (secret, required). Without it the endpoint returns 502 and
  the form shows a "please call us" message.
- `CONTACT_TO` (optional), defaults to `info@abovebeyondhomesolutions.com`.
- `CONTACT_FROM` (optional), defaults to
  `Website Contact Form <forms@abovebeyondhomesolutions.com>`. Must stay on the
  Resend-verified domain.
