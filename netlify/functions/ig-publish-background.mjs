/*
 * Publishes one scheduled Instagram Reel (started by ig-scheduler). Background function: up to 15 min.
 * Env: IG_ACCESS_TOKEN, IG_USER_ID, IG_SCHEDULER_SECRET.
 * Trial Reels need Graph API v27 (v21 silently drops trial_params) and no share_to_feed.
 * Functions API v2 (.mjs): strong-consistency Blobs reads need it (the v1 Lambda format has no uncachedEdgeURL,
 * which made the 19 Nov 20:00 run fail before posting).
 * Never throws: Netlify retries failed background runs, and a retry after a publish would post twice.
 * One publish per post id, ever: the first run claims the id in Netlify Blobs (store "ig-publish"); any later run
 * for that id (double trigger, retry, "Run now") is skipped. To publish an id again, delete its key in that store.
 * After the publish request it waits 5 min, then checks the profile and logs VERIFIED / NOT FOUND. It never re-posts.
 */
import { getStore } from '@netlify/blobs';
import SCHEDULE from './lib/ig-schedule.json' with { type: 'json' };

const VERIFY_WAIT_MS = 5 * 60 * 1000;

const API = 'https://graph.facebook.com/v27.0/';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function graph(path, params = {}, method = 'GET') {
  const body = new URLSearchParams({ ...params, access_token: process.env.IG_ACCESS_TOKEN });
  const r = method === 'GET' ? await fetch(`${API}${path}?${body}`) : await fetch(API + path, { method, body });
  const d = await r.json();
  if (d.error) throw new Error(`${method} ${path}: ${d.error.message}`);
  return d;
}

async function alreadyPosted(ig, caption) {
  // a second run for the same post (manual "Run now", double trigger) must not publish it again
  const { data = [] } = await graph(`${ig}/media`, { fields: 'caption,timestamp', limit: '10' });
  const since = Date.now() - 6 * 3600 * 1000;
  return data.some((m) => m.caption === caption && Date.parse(m.timestamp) > since);
}

async function claim(store, id) {
  // two runs started together must not both pass: random delay, write our token, re-read, only the last writer goes on
  await sleep(Math.random() * 15000);
  const seen = await store.get(id, { type: 'json' });
  if (seen) return console.log(`${id}: already claimed ${seen.started} (${seen.status}), skipped`), false;
  const token = `${Date.now()}-${Math.random()}`;
  await store.setJSON(id, { token, started: new Date().toISOString(), status: 'publishing' });
  await sleep(5000);
  const back = await store.get(id, { type: 'json' });
  if (!back || back.token !== token) return console.log(`${id}: claimed by another run, skipped`), false;
  return token;
}

async function publish(p, store) {
  const ig = process.env.IG_USER_ID;
  const base = process.env.URL || 'https://www.immoops.com';
  const token = await claim(store, p.id);
  if (!token) return;
  const mark = (status, extra = {}) => store.setJSON(p.id, { token, started: new Date().toISOString(), status, ...extra });
  if (await alreadyPosted(ig, p.caption)) return mark('already-on-profile'), console.log(`${p.id}: already posted, skipped`);

  const params = { media_type: 'REELS', video_url: `${base}/ig/${p.id}/video.mp4`, cover_url: `${base}/ig/${p.id}/cover.jpg`, caption: p.caption };
  if (p.trial) params.trial_params = JSON.stringify({ graduation_strategy: 'MANUAL' });
  else params.share_to_feed = 'true';
  const { id: container } = await graph(`${ig}/media`, params, 'POST');

  for (let i = 0; ; i++) {
    const { status_code, status } = await graph(container, { fields: 'status_code,status' });
    if (status_code === 'FINISHED') break;
    if (status_code === 'ERROR' || status_code === 'EXPIRED' || i > 84) throw new Error(`container ${container}: ${status}`);  // ~7 min, leaves room for the 5-min check
    await sleep(5000);
  }
  let media;
  try {
    ({ id: media } = await graph(`${ig}/media_publish`, { creation_id: container }, 'POST'));
    console.log(`${p.id}: publish request sent (media ${media}), checking the profile in 5 min`);
  } catch (e) {
    console.log(`${p.id}: publish request failed (${e.message}), NOT retrying; checking the profile in 5 min anyway`);
  }
  await mark('sent', { media: media || null });
  await sleep(VERIFY_WAIT_MS);
  const ok = await alreadyPosted(ig, p.caption);
  const info = media ? await graph(media, { fields: 'permalink,is_shared_to_feed' }).catch(() => ({})) : {};
  await mark(ok ? 'verified' : 'not-found', { media: media || null, permalink: info.permalink || null });
  console.log(`${p.id}: ${ok ? 'VERIFIED on the profile' : 'NOT FOUND on the profile after 5 min (no retry, check by hand)'} ${info.permalink || ''} trial=${!!p.trial} is_shared_to_feed=${info.is_shared_to_feed}`);
  if (p.trial && info.is_shared_to_feed) console.log(`${p.id}: WARNING trial Reel is on the feed, check the profile`);
}

export default async (req) => {
  try {
    if (!process.env.IG_SCHEDULER_SECRET || req.headers.get('x-ig-secret') !== process.env.IG_SCHEDULER_SECRET) {
      return console.log('ig-publish: bad secret');
    }
    const { id } = await req.json().catch(() => ({}));
    const p = SCHEDULE.find((x) => x.id === id);
    if (!p) return console.log(`ig-publish: unknown post ${id}`);
    await publish(p, getStore({ name: 'ig-publish', consistency: 'strong' }));
  } catch (e) {
    console.log(`ig-publish FAILED: ${e.message}`);
  }
};
