const { buildPrompt } = require('./lib/camille');

/* Camille's instructions as plain text, for the LiveKit voice agent to load at the start of each call.
   GET /.netlify/functions/agent-prompt?canal=appel  (canal defaults to "appel")
   &tags=1 when the agent's voice understands emotion tags like [excited] */
exports.handler = async (event) => {
  const canal = event.queryStringParameters?.canal === 'chat' ? 'chat' : 'appel';
  const tags = event.queryStringParameters?.tags === '1';
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=60',
    },
    body: buildPrompt(canal, { tags }),
  };
};
