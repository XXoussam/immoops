const { runTool } = require('./lib/camille');
const { isAgentRequest } = require('./lib/agent-auth');

/*
 * Runs one of Camille's tools for the LiveKit voice agent, with the same code as the chat.
 * Server-to-server only: requires `Authorization: Bearer <LEAD_API_SECRET>`.
 * POST JSON: { name, arguments, transcript? }
 * Response: the tool's result, { ok: true, ... } or { ok: false, error } (error is an instruction for the model).
 */
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: '' };
  }
  if (!isAgentRequest(event.headers)) {
    return { statusCode: 401, body: JSON.stringify({ ok: false, error: 'unauthorized' }) };
  }

  try {
    const { name, arguments: args = {}, transcript = '' } = JSON.parse(event.body || '{}');
    const result = await runTool(name, args, { canal: 'appel', transcript: String(transcript).slice(0, 20000) });
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    };
  } catch (err) {
    console.error('agent-tool fn error', err);
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: 'Erreur serveur' }) };
  }
};
