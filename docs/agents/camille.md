# Camille — one AI agent for chat and calls

Camille is the assistant behind both floating bubbles on the site. She presents ImmoOps to
real-estate professionals and, with their consent, collects their details so Oussama can
follow up. One prompt and one lead pipeline serve both channels:

| | Chat bubble | Call bubble |
|---|---|---|
| Runs in | `netlify/functions/chat.js` (Gemini) | LiveKit Cloud agent `immoops-camille` (separate project, see below) |
| Prompt | `buildPrompt('chat')` | `GET /.netlify/functions/agent-prompt` |
| Saves leads via | `saveLead()` directly | `POST /.netlify/functions/lead` |

Everything lives in **`netlify/functions/lib/camille.js`**: edit the prompt there and both
channels pick it up after the next deploy (the voice agent re-reads it at the start of every
call, cached 60 s).

Leads go to the **IMMOOPS** Airtable base: table **Leads** (`Source` = `Chatbot` or
`Appel IA`) plus the conversation in **ChatSessions**.

## Netlify environment variables

| Variable | Used by | Value |
|---|---|---|
| `GEMINI_API_KEY` | chat | Gemini API key |
| `AIRTABLE_TOKEN` | chat, lead | Airtable personal access token with `data.records:write` on the IMMOOPS base |
| `LEAD_API_SECRET` | lead | any long random string, shared with the voice agent |
| `LIVEKIT_AGENT_NAME` | token | optional, defaults to `immoops-camille`; must match `AGENT_NAME` in the agent |

## The LiveKit voice agent

Source: the `oussna-voice-ai` project (local folder next to this repo), deployed to LiveKit
Cloud (project `realstate`, region eu-central) with `lk agent deploy`. In `src/agent.py`:

- `AGENT_NAME = "immoops-camille"`: the name `token.js` dispatches.
- At the start of each call it loads Camille's prompt from
  `GET /.netlify/functions/agent-prompt?canal=appel` (fetched while joining the room). If the
  site is unreachable it uses the short `FALLBACK_INSTRUCTIONS` in `src/prompt.py`.
- Its `enregistrer_lead` tool posts to `/.netlify/functions/lead` with
  `Authorization: Bearer <LEAD_API_SECRET>`, along with the call transcript so far.
- Pipeline: Deepgram nova-3 (fr) → gpt-4o-mini → ElevenLabs `eleven_flash_v2_5`, multilingual
  turn detector, preemptive generation, endpointing delay 0.3–1.5 s. The greeting is spoken
  with `session.say()` (no LLM round trip).

LiveKit agent secrets (`lk agent update-secrets`): `OPENAI_API_KEY`, `DEEPGRAM_API_KEY`,
`ELEVEN_API_KEY`, `LEAD_API_SECRET` (same value as on Netlify) and optionally
`IMMOOPS_SITE_URL` (defaults to `https://immoops.com`).

Renaming the agent: deploy the agent first, then the site (or set `LIVEKIT_AGENT_NAME` on
Netlify), otherwise calls dispatch a name no worker answers and show "Camille est indisponible".

## Call length

Web calls have no time limit: the call runs until the visitor hangs up (the on-screen timer
only counts up). Add a cap on the agent side (LiveKit) if API spend becomes a concern.
