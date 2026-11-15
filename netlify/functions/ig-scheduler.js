/*
 * Runs every 15 min (netlify.toml). Starts ig-publish-background for each post of lib/ig-schedule.json
 * due in this run's window. Scheduled functions stop after 30 s; a Reel can take minutes to process,
 * so the publishing itself happens in the background function.
 */
const SCHEDULE = require('./lib/ig-schedule.json');

const HALF_WINDOW_MS = 7.5 * 60 * 1000; // runs every 15 min: each post time falls in exactly one run's window

exports.handler = async () => {
  const now = Date.now();
  const due = SCHEDULE.filter((p) => {
    const t = Date.parse(p.at);
    return t >= now - HALF_WINDOW_MS && t < now + HALF_WINDOW_MS;
  });
  for (const p of due) {
    const r = await fetch(`${process.env.URL}/.netlify/functions/ig-publish-background`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-ig-secret': process.env.IG_SCHEDULER_SECRET || '' },
      body: JSON.stringify({ id: p.id }),
    });
    console.log(`ig-scheduler: started ${p.id} (${p.at}) -> ${r.status}`);
  }
  if (!due.length) console.log('ig-scheduler: nothing due');
  return { statusCode: 200 };
};
