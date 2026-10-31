const { timingSafeEqual } = require('crypto');

/* Server-to-server calls from the voice agent: `Authorization: Bearer <LEAD_API_SECRET>` */
function isAgentRequest(headers) {
  const secret = process.env.LEAD_API_SECRET;
  const header = headers?.authorization;
  if (!secret || !header) return false;
  const given = Buffer.from(header.replace(/^Bearer\s+/i, ''));
  const expected = Buffer.from(secret);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

module.exports = { isAgentRequest };
