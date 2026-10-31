const { runTool } = require('./lib/camille');
const { isAgentRequest } = require('./lib/agent-auth');

/*
 * LEGACY: lead intake for voice agents deployed before agent-tool.js. Same as
 * POST agent-tool { name: 'enregistrer_lead', arguments }. Delete once the LiveKit agent
 * running agent-config/agent-tool is deployed.
 * POST JSON: { nom, email, telephone, agence, besoin, consentement, transcript? }
 */
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: '' };
  }
  if (!isAgentRequest(event.headers)) {
    return { statusCode: 401, body: JSON.stringify({ ok: false, error: 'unauthorized' }) };
  }

  try {
    const { transcript = '', ...args } = JSON.parse(event.body || '{}');
    const result = await runTool('enregistrer_lead', args, { canal: 'appel', transcript: String(transcript).slice(0, 20000) });
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
