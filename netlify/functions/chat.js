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

async function generate(systemPrompt, contents, withTools) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        ...(withTools && { tools: [{ functionDeclarations: [SAVE_LEAD_TOOL] }] }),
        generationConfig: { temperature: 0.7, maxOutputTokens: 600 },
      }),
    }
  );
  return res.json();
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

    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
    const systemPrompt = buildPrompt('chat') + (leadAlreadySaved ? ALREADY_SAVED : '');

    let reply = '';
    let leadSaved = false;
    // at most one tool round-trip, then the model must answer in text
    for (let round = 0; round < 2 && !reply; round++) {
      const data = await generate(systemPrompt, contents, !leadAlreadySaved && round === 0);
      const parts = data.candidates?.[0]?.content?.parts ?? [];
      const call = parts.find((p) => p.functionCall)?.functionCall;

      if (!call) {
        reply = parts.map((p) => p.text).filter(Boolean).join('');
        break;
      }
      const transcript = messages
        .map((m) => `${m.role === 'assistant' ? 'Assistant' : 'Client'}: ${m.content}`)
        .join('\n');
      const result = await saveLead(call.args, { canal: 'chat', transcript });
      leadSaved = result.ok;
      contents.push({ role: 'model', parts });
      contents.push({ role: 'user', parts: [{ functionResponse: { name: call.name, response: result } }] });
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
