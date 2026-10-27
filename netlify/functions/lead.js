const { timingSafeEqual } = require('crypto');
const { saveLead } = require('./lib/camille');

/*
 * Lead intake for the LiveKit voice agent's enregistrer_lead tool, so calls and chats go through
 * the same pipeline. Server-to-server only: requires `Authorization: Bearer <LEAD_API_SECRET>`.
 * POST JSON: { nom, email, telephone, agence, besoin, consentement, transcript? }
 * Response: { ok: true } or { ok: false, error } (error is an instruction for the agent to relay).
 */
function authorized(header) {
  const secret = process.env.LEAD_API_SECRET;
  if (!secret || !header) return false;
  const given = Buffer.from(header.replace(/^Bearer\s+/i, ''));
  const expected = Buffer.from(secret);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: '' };
  }
  if (!authorized(event.headers?.authorization)) {
    return { statusCode: 401, body: JSON.stringify({ ok: false, error: 'unauthorized' }) };
  }

  try {
    const { transcript = '', ...args } = JSON.parse(event.body || '{}');
    const result = await saveLead(args, { canal: 'appel', transcript: String(transcript).slice(0, 20000) });
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    };
  } catch (err) {
    console.error('lead fn error', err);
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: 'Erreur serveur' }) };
  }
};
