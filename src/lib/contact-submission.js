import { SERVICES, PROPERTY_TYPES, CITIES } from './contact-form-options.js';

const DEFAULT_TO = 'info@abovebeyondhomesolutions.com';
const DEFAULT_FROM = 'Website Contact Form <forms@abovebeyondhomesolutions.com>';

const LIMITS = {
  name: 100,
  email: 254,
  phone: 30,
  details: 2000,
  page: 200,
};

const json = (body, status) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });

// Control characters get folded to spaces so nothing odd lands in the email
// or in whatever parses it downstream. Newlines survive only when asked for.
function stripControls(value, keepNewlines) {
  let out = '';
  for (const ch of value) {
    const code = ch.codePointAt(0);
    if (code === 10 && keepNewlines) {
      out += ch;
    } else if (code < 32 || code === 127) {
      out += ' ';
    } else {
      out += ch;
    }
  }
  return out;
}

function clean(value, max) {
  if (typeof value !== 'string') return '';
  return stripControls(value, false).replace(/\s+/g, ' ').trim().slice(0, max);
}

// Same idea, but the details box keeps its paragraph breaks.
function cleanMultiline(value, max) {
  if (typeof value !== 'string') return '';
  return stripControls(value.replace(/\r\n/g, '\n'), true)
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, max);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Accepts what people actually type. Returns a stable E.164 string for the
// intake workflow plus a readable version for whoever opens the email.
function normalizePhone(raw) {
  const digits = raw.replace(/\D/g, '');
  const local =
    digits.length === 11 && digits.startsWith('1')
      ? digits.slice(1)
      : digits.length === 10
      ? digits
      : null;
  if (!local) return null;
  return {
    e164: `+1${local}`,
    display: `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`,
  };
}

async function readFields(request) {
  const type = (request.headers.get('content-type') || '').toLowerCase();
  if (type.includes('application/json')) {
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
    return body;
  }
  if (type.includes('application/x-www-form-urlencoded') || type.includes('multipart/form-data')) {
    return Object.fromEntries(await request.formData());
  }
  return null;
}

export function validate(raw) {
  const errors = {};

  const name = clean(raw.name, LIMITS.name);
  if (name.length < 2) errors.name = 'Please enter your name.';

  const phoneRaw = clean(raw.phone, LIMITS.phone);
  const phone = phoneRaw ? normalizePhone(phoneRaw) : null;
  if (!phone) errors.phone = 'Please enter a 10-digit phone number.';

  const email = clean(raw.email, LIMITS.email);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = 'That email address does not look right.';
  }

  const service = clean(raw.service, 120);
  if (!SERVICES.includes(service)) errors.service = 'Please choose a service.';

  const propertyType = clean(raw.propertyType, 120);
  if (!PROPERTY_TYPES.includes(propertyType)) {
    errors.propertyType = 'Please choose a property type.';
  }

  const city = clean(raw.city, 120);
  if (!CITIES.includes(city)) errors.city = 'Please choose a city.';

  const details = cleanMultiline(raw.details, LIMITS.details);
  const page = clean(raw.page, LIMITS.page);

  if (Object.keys(errors).length > 0) return { errors };

  return {
    submission: {
      name,
      phone: phone.e164,
      phoneDisplay: phone.display,
      email: email || null,
      service,
      propertyType,
      city,
      details: details || null,
      page: page || null,
      submittedAt: new Date().toISOString(),
    },
  };
}

function buildEmail(s) {
  const rows = [
    ['Name', s.name],
    ['Phone', s.phoneDisplay],
    ['Email', s.email || 'not provided'],
    ['Service requested', s.service],
    ['Property type', s.propertyType],
    ['City', s.city],
  ];

  const text = [
    'New request from the website contact form.',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    'Details:',
    s.details || 'none provided',
    '',
    `Submitted: ${s.submittedAt}`,
    `Page: ${s.page || 'unknown'}`,
    '',
    'Machine-readable copy:',
    JSON.stringify(s, null, 2),
  ].join('\n');

  const html = `
<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#111928;">
  <h2 style="margin:0 0 16px;font-size:18px;">New request from the website contact form</h2>
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:560px;">
    ${rows
      .map(
        ([label, value]) => `<tr>
      <td style="padding:8px 12px;border:1px solid #E5E7EB;background:#F3F4F6;font-weight:bold;width:180px;">${escapeHtml(
        label
      )}</td>
      <td style="padding:8px 12px;border:1px solid #E5E7EB;">${escapeHtml(value)}</td>
    </tr>`
      )
      .join('\n    ')}
    <tr>
      <td style="padding:8px 12px;border:1px solid #E5E7EB;background:#F3F4F6;font-weight:bold;vertical-align:top;">Details</td>
      <td style="padding:8px 12px;border:1px solid #E5E7EB;white-space:pre-wrap;">${escapeHtml(
        s.details || 'none provided'
      )}</td>
    </tr>
  </table>
  <p style="margin:16px 0 4px;font-size:12px;color:#637381;">
    Submitted ${escapeHtml(s.submittedAt)} from ${escapeHtml(s.page || 'unknown page')}.
  </p>
  <pre style="margin:12px 0 0;padding:12px;background:#F3F4F6;border:1px solid #E5E7EB;font-size:12px;white-space:pre-wrap;">${escapeHtml(
    JSON.stringify(s, null, 2)
  )}</pre>
</div>`.trim();

  return { text, html };
}

async function sendViaResend(submission, env) {
  const key = env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not configured');

  const { text, html } = buildEmail(submission);
  const payload = {
    from: env.CONTACT_FROM || DEFAULT_FROM,
    to: [env.CONTACT_TO || DEFAULT_TO],
    subject: `New inspection request: ${submission.name} (${submission.city})`,
    text,
    html,
  };
  if (submission.email) payload.reply_to = submission.email;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${key}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Resend responded ${res.status}: ${detail.slice(0, 500)}`);
  }
}

// A plain form post (JavaScript disabled) sends Accept: text/html. Those get a
// readable page instead of a wall of JSON.
function wantsHtml(request) {
  return (request.headers.get('accept') || '').includes('text/html');
}

function htmlPage(request, heading, body, status) {
  const back = new URL(request.url).origin + '/contact';
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>${escapeHtml(heading)}</title></head>
<body style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:80px auto;padding:0 24px;color:#111928;line-height:1.6;">
<h1 style="font-size:24px;">${escapeHtml(heading)}</h1>
${body}
<p><a href="${escapeHtml(back)}" style="color:#3758F9;">Back to the contact page</a></p>
</body></html>`,
    {
      status,
      headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
    }
  );
}

export async function handleContactRequest(request, env) {
  if (request.method !== 'POST') {
    return json({ ok: false, error: 'Method not allowed' }, 405);
  }

  let raw;
  try {
    raw = await readFields(request);
  } catch {
    raw = null;
  }
  if (!raw) return json({ ok: false, error: 'Could not read the submission.' }, 400);

  const html = wantsHtml(request);

  // Honeypot: a real person never fills this in, so accept and drop silently.
  if (clean(raw.company_website, 100)) {
    return html
      ? htmlPage(request, 'Thanks, we got your request', '<p>We will be in touch shortly.</p>', 200)
      : json({ ok: true }, 200);
  }

  const { errors, submission } = validate(raw);
  if (errors) {
    if (!html) return json({ ok: false, errors }, 422);
    const list = Object.values(errors)
      .map((message) => `<li>${escapeHtml(message)}</li>`)
      .join('');
    return htmlPage(request, 'Please check a few fields', `<ul>${list}</ul>`, 422);
  }

  const failure =
    'We could not send your request right now. Please call (239) 416-3505 and we will take care of you.';

  try {
    await sendViaResend(submission, env);
  } catch (err) {
    console.error('contact form send failed', err);
    return html
      ? htmlPage(request, 'Something went wrong', `<p>${escapeHtml(failure)}</p>`, 502)
      : json({ ok: false, error: failure }, 502);
  }

  return html
    ? htmlPage(
        request,
        'Thanks, we got your request',
        `<p>We will reach out to ${escapeHtml(submission.name)} at ${escapeHtml(
          submission.phoneDisplay
        )} shortly.</p>`,
        200
      )
    : json({ ok: true }, 200);
}
