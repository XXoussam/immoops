/*
 * Check for the Instagram scheduler: are the env vars set and does the token work? Never returns the token.
 * GET with header x-ig-secret: IG_SCHEDULER_SECRET  →  { env, account, scheduled }
 */
const SCHEDULE = require('./lib/ig-schedule.json');

exports.handler = async (event) => {
  if (!process.env.IG_SCHEDULER_SECRET || event.headers['x-ig-secret'] !== process.env.IG_SCHEDULER_SECRET) {
    return { statusCode: 403, body: 'forbidden' };
  }
  const env = Object.fromEntries(['IG_ACCESS_TOKEN', 'IG_USER_ID', 'IG_SCHEDULER_SECRET'].map((k) => [k, !!process.env[k]]));
  const r = await fetch(`https://graph.facebook.com/v27.0/${process.env.IG_USER_ID}?fields=username&access_token=${process.env.IG_ACCESS_TOKEN}`);
  const d = await r.json();
  const account = d.username || `error: ${d.error && d.error.message}`;
  const scheduled = SCHEDULE.filter((p) => Date.parse(p.at) > Date.now()).map((p) => `${p.at} ${p.id}`);
  return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ env, account, scheduled }) };
};
