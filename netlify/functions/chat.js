const { agentConfig, runTool } = require('./lib/camille');

const ALREADY_SAVED = `

# État de la conversation
Les coordonnées du visiteur sont déjà enregistrées : ne les redemande pas.`;

const MAX_MESSAGES = 30;
const MAX_CHARS = 2000;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

/* Camille's prompt, model and tools for the chat: the same agent as the call bubble (lib/camille.js) */
const CAMILLE = agentConfig('chat');

/* tools: true offers Camille's tools, 'none' keeps them declared (a tool reply is in the history) but forces text */
async function generate(messages, tools) {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not set');
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: CAMILLE.model,
      messages,
      temperature: CAMILLE.temperature,
      max_tokens: 1024,
      ...(tools && {
        tools: CAMILLE.tools.map((fn) => ({ type: 'function', function: fn })),
        tool_choice: tools === 'none' ? 'none' : 'auto',
      }),
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // e.g. 401 invalid key, 404 model not found, 429 quota or rate limit
    throw new Error(`OpenAI ${res.status} ${data.error?.code ?? ''}: ${data.error?.message ?? 'no details'}`);
  }
  return data;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const leadAlreadySaved = body.leadSaved === true;

    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'messages requis' }) };
    }

    const messages = body.messages
      .slice(-MAX_MESSAGES)
      .map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content ?? '').slice(0, MAX_CHARS) }));

    const systemPrompt = CAMILLE.instructions + (leadAlreadySaved ? ALREADY_SAVED : '');
    const conversation = [{ role: 'system', content: systemPrompt }, ...messages];

    let reply = '';
    let leadSaved = false;
    // at most one tool round-trip, then the model must answer in text
    for (let round = 0; round < 2 && !reply; round++) {
      const tools = leadAlreadySaved ? false : round === 0 ? true : 'none';
      const data = await generate(conversation, tools);
      const message = data.choices?.[0]?.message ?? {};
      const call = message.tool_calls?.[0];

      if (!call) {
        reply = message.content ?? '';
        if (!reply) console.error('chat fn: empty reply from OpenAI', data.choices?.[0]?.finish_reason);
        break;
      }
      const transcript = messages
        .map((m) => `${m.role === 'assistant' ? 'Assistant' : 'Client'}: ${m.content}`)
        .join('\n');
      let args = {};
      try {
        args = JSON.parse(call.function.arguments || '{}');
      } catch {
        // malformed arguments: the tool rejects them and the model asks again
      }
      const result = await runTool(call.function.name, args, { canal: 'chat', transcript });
      if (call.function.name === 'enregistrer_lead' && result.ok) leadSaved = true;
      // answer only the first call: the others are dropped from the assistant turn
      conversation.push({ role: 'assistant', content: message.content ?? null, tool_calls: [call] });
      conversation.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(result) });
    }

    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: reply || "Désolée, je n'ai pas pu répondre. Veuillez réessayer.", leadSaved }),
    };
  } catch (err) {
    console.error('chat fn error', err);
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: 'Erreur serveur' }),
    };
  }
};
