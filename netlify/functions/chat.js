const { buildPrompt, SAVE_LEAD_TOOL, saveLead } = require('./lib/camille');

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

/* OPENAI_MODEL can override the model without a code change (same default as the voice agent) */
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

/* tools: true offers the lead tool, 'none' keeps it declared (a tool reply is in the history) but forces text */
async function generate(messages, tools) {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not set');
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
      ...(tools && {
        tools: [{ type: 'function', function: SAVE_LEAD_TOOL }],
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

    const systemPrompt = buildPrompt('chat') + (leadAlreadySaved ? ALREADY_SAVED : '');
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
        // malformed arguments: saveLead rejects them and the model asks again
      }
      const result = await saveLead(args, { canal: 'chat', transcript });
      leadSaved = result.ok;
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
