// Cloudflare Worker entry point (static assets + one API route).
// Static assets are matched and served before this runs, so only /api/contact
// and genuine misses reach here.
import { handleContactRequest } from './lib/contact-submission.js';

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/contact') {
      return handleContactRequest(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
