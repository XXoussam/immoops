const { agentConfig } = require('./lib/camille');

/* Camille for one channel (prompt, model, greeting, tool definitions), loaded by the LiveKit voice
   agent at the start of each call. GET /.netlify/functions/agent-config?canal=appel  (default)
   &tags=1 when the call voice understands emotion tags like [excited] */
exports.handler = async (event) => {
  const canal = event.queryStringParameters?.canal === 'chat' ? 'chat' : 'appel';
  const tags = event.queryStringParameters?.tags === '1';
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=60',
    },
    body: JSON.stringify(agentConfig(canal, { tags })),
  };
};
