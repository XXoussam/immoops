/*
 * Check for the Instagram scheduler: are the env vars set and does the token work? Never returns the token.
 * GET with header x-ig-secret: IG_SCHEDULER_SECRET  →  { env, account, scheduled, locks }
 * locks: what ig-publish-background left in Blobs per post id (claimed / sent / verified / not-found), or the Blobs error.
 */
import { getStore } from '@netlify/blobs';
import SCHEDULE from './lib/ig-schedule.json' with { type: 'json' };

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export default async (req) => {
  if (!process.env.IG_SCHEDULER_SECRET || req.headers.get('x-ig-secret') !== process.env.IG_SCHEDULER_SECRET) {
    return new Response('forbidden', { status: 403 });
  }
  const env = Object.fromEntries(['IG_ACCESS_TOKEN', 'IG_USER_ID', 'IG_SCHEDULER_SECRET'].map((k) => [k, !!process.env[k]]));
  const r = await fetch(`https://graph.facebook.com/v27.0/${process.env.IG_USER_ID}?fields=username&access_token=${process.env.IG_ACCESS_TOKEN}`);
  const d = await r.json();
  const account = d.username || `error: ${d.error && d.error.message}`;
  const scheduled = SCHEDULE.filter((p) => Date.parse(p.at) > Date.now()).map((p) => `${p.at} ${p.id}`);
  let locks, blobs;
  try {
    const store = getStore({ name: 'ig-publish', consistency: 'strong' });
    const probe = `${Date.now()}`;  // the same strong write + read the publisher's lock relies on
    await store.setJSON('_health', { probe });
    blobs = (await store.get('_health', { type: 'json' }))?.probe === probe ? 'ok (strong write + read)' : 'MISMATCH';
    const recent = SCHEDULE.filter((p) => Date.parse(p.at) > Date.now() - 2 * 86400 * 1000);
    locks = Object.fromEntries(await Promise.all(recent.map(async (p) => [p.id, await store.get(p.id, { type: 'json' })])));
  } catch (e) {
    blobs = `error: ${e.message}`;
  }
  return json({ env, account, scheduled, blobs, locks });
};
