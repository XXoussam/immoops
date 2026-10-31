/*
 * Voice notes in the chat bubble: turns the visitor's recording into text (OpenAI speech to text),
 * which the chat then sends to Camille like a typed message.
 * POST JSON: { audio: base64, mime: 'audio/webm' | 'audio/mp4' | ... }  →  { text }
 * OPENAI_TRANSCRIBE_MODEL can override the model.
 */
const MODEL = process.env.OPENAI_TRANSCRIBE_MODEL || 'gpt-4o-mini-transcribe';
const MAX_BYTES = 4 * 1024 * 1024; // ~4 MB: well over a minute of compressed speech, under Netlify's 6 MB body limit

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

/* vocabulary hints so names and trade words come out right */
const PROMPT = "Message vocal d'un visiteur du site ImmoOps à Camille, l'assistante IA. Agence immobilière, mandats, prospects, relances, CRM, n8n, Oussama.";

const EXTENSIONS = { 'audio/webm': 'webm', 'audio/ogg': 'ogg', 'audio/mp4': 'mp4', 'audio/mpeg': 'mp3', 'audio/wav': 'wav', 'audio/x-m4a': 'm4a' };

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: '' };

  try {
    const { audio, mime = 'audio/webm' } = JSON.parse(event.body || '{}');
    const type = String(mime).split(';')[0];
    const ext = EXTENSIONS[type];
    if (!audio || !ext) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'audio requis' }) };
    }
    const bytes = Buffer.from(audio, 'base64');
    if (bytes.length > MAX_BYTES) {
      return { statusCode: 413, headers: CORS, body: JSON.stringify({ error: 'note vocale trop longue' }) };
    }
    if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not set');

    const form = new FormData();
    form.append('file', new Blob([bytes], { type }), `note.${ext}`);
    form.append('model', MODEL);
    form.append('prompt', PROMPT);
    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: form,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`OpenAI ${res.status} ${data.error?.code ?? ''}: ${data.error?.message ?? 'no details'}`);

    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: String(data.text ?? '').trim() }),
    };
  } catch (err) {
    console.error('transcribe fn error', err);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Erreur serveur' }) };
  }
};
