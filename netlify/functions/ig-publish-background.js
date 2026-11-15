/*
 * Publishes one scheduled Instagram Reel (started by ig-scheduler). Background function: up to 15 min.
 * Env: IG_ACCESS_TOKEN, IG_USER_ID, IG_SCHEDULER_SECRET.
 * Trial Reels need Graph API v27 (v21 silently drops trial_params) and no share_to_feed.
 * Never throws: Netlify retries failed background runs, and a retry after a publish would post twice.
 */
const SCHEDULE = require('./lib/ig-schedule.json');

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

async function publish(p) {
  const ig = process.env.IG_USER_ID;
  const base = process.env.URL;
  if (await alreadyPosted(ig, p.caption)) return console.log(`${p.id}: already posted, skipped`);

  const params = { media_type: 'REELS', video_url: `${base}/ig/${p.id}/video.mp4`, cover_url: `${base}/ig/${p.id}/cover.jpg`, caption: p.caption };
  if (p.trial) params.trial_params = JSON.stringify({ graduation_strategy: 'MANUAL' });
  else params.share_to_feed = 'true';
  const { id: container } = await graph(`${ig}/media`, params, 'POST');

  for (let i = 0; ; i++) {
    const { status_code, status } = await graph(container, { fields: 'status_code,status' });
    if (status_code === 'FINISHED') break;
    if (status_code === 'ERROR' || status_code === 'EXPIRED' || i > 150) throw new Error(`container ${container}: ${status}`);
    await sleep(5000);
  }
  const { id: media } = await graph(`${ig}/media_publish`, { creation_id: container }, 'POST');
  const info = await graph(media, { fields: 'permalink,is_shared_to_feed' });
  console.log(`${p.id}: PUBLISHED ${info.permalink} trial=${!!p.trial} is_shared_to_feed=${info.is_shared_to_feed}`);
  if (p.trial && info.is_shared_to_feed) console.log(`${p.id}: WARNING trial Reel is on the feed, check the profile`);
}

exports.handler = async (event) => {
  try {
    if (!process.env.IG_SCHEDULER_SECRET || event.headers['x-ig-secret'] !== process.env.IG_SCHEDULER_SECRET) {
      return console.log('ig-publish: bad secret');
    }
    const { id } = JSON.parse(event.body || '{}');
    const p = SCHEDULE.find((x) => x.id === id);
    if (!p) return console.log(`ig-publish: unknown post ${id}`);
    await publish(p);
  } catch (e) {
    console.log(`ig-publish FAILED: ${e.message}`);
  }
};
