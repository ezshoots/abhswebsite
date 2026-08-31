// Cloudflare Pages Functions entry point for POST /api/contact.
// Inert if the project deploys as a Worker with static assets; src/worker.js
// covers that path instead. Both share the same handler.
import { handleContactRequest } from '../../src/lib/contact-submission.js';

export const onRequestPost = ({ request, env }) => handleContactRequest(request, env);
