const { buildPrompt } = require('./lib/camille');

/* Camille's instructions as plain text, for the LiveKit voice agent to load at the start of each call.
   GET /.netlify/functions/agent-prompt?canal=appel  (canal defaults to "appel") */
exports.handler = async (event) => {
  const canal = event.queryStringParameters?.canal === 'chat' ? 'chat' : 'appel';
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=60',
    },
    body: buildPrompt(canal),
  };
};
