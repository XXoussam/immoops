# Camille — one AI agent for chat and calls

Camille is the assistant behind both floating bubbles on the site. She presents ImmoOps to
real-estate professionals and, with their consent, collects their details so Oussama can
follow up. One prompt and one lead pipeline serve both channels:

| | Chat bubble | Call bubble |
|---|---|---|
| Runs in | `netlify/functions/chat.js` | LiveKit Cloud agent `immoops-camille` (separate project, see below) |
| Loads Camille via | `agentConfig('chat')` | `GET /.netlify/functions/agent-config?canal=appel` at the start of each call |
| Runs tools via | `runTool()` directly | `POST /.netlify/functions/agent-tool` |

**Camille lives in one place**, `netlify/functions/lib/`:

- `camille.js`: her knowledge and prompt (one prompt, with a short section per channel), her
  tools (`TOOLS`: the definition the model sees and the code that runs it) and the lead pipeline.
  A tool added there is offered on both channels after the next deploy.
- `camille.json`: name, OpenAI model, temperature and the greeting of each channel. The chat
  window reads its greeting from it too (`src/lib/constants.ts`). `OPENAI_MODEL` on Netlify
  overrides the model for both channels.

The voice agent only configures the voice side (speech recognition, ElevenLabs voice, timing);
it re-reads Camille at the start of every call (cached 60 s).

Leads go to the **IMMOOPS** Airtable base: table **Leads** (`Source` = `Chatbot` or
`Appel IA`) plus the conversation in **ChatSessions**.

`agent-prompt.js` and `lead.js` are legacy endpoints kept for voice agents deployed before
`agent-config`/`agent-tool`; delete them once the new agent is live.

## Netlify environment variables

| Variable | Used by | Value |
|---|---|---|
| `OPENAI_API_KEY` | chat | OpenAI API key (the voice agent uses its own copy in LiveKit Cloud secrets) |
| `OPENAI_MODEL` | chat, agent-config | optional, overrides the model in `camille.json` for both channels |
| `AIRTABLE_TOKEN` | chat, agent-tool | Airtable personal access token with `data.records:write` on the IMMOOPS base |
| `LEAD_API_SECRET` | agent-tool | any long random string, shared with the voice agent |
| `LIVEKIT_AGENT_NAME` | token | optional, defaults to `immoops-camille`; must match `AGENT_NAME` in the agent |

## The LiveKit voice agent

Source: the `oussna-voice-ai` project (local folder next to this repo), deployed to LiveKit
Cloud (project `realstate`, region eu-central) with `lk agent deploy`. In `src/agent.py`:

- `AGENT_NAME = "immoops-camille"`: the name `token.js` dispatches.
- At the start of each call it loads Camille from
  `GET /.netlify/functions/agent-config?canal=appel&tags=1` (prompt, model, greeting, tool
  definitions), fetched while joining the room. If the site is unreachable it uses the short
  `fallback_config()` in `src/prompt.py` (no tools: she points to the booking button).
- Each tool call posts `{ name, arguments, transcript }` to `/.netlify/functions/agent-tool` with
  `Authorization: Bearer <LEAD_API_SECRET>`, which runs the same code as the chat.
- Pipeline: Deepgram nova-3 (fr) → OpenAI (model from `camille.json`) → ElevenLabs
  `eleven_v4_turbo` with the Lucie voice, one sentence at a time so emotion tags like
  `[excited]` work (removed from the transcript). Multilingual turn detector, preemptive
  generation, VAD silence 0.35 s, endpointing delay 0.2–1.5 s. The greeting is spoken with
  `session.say()` (no LLM round trip).

LiveKit agent secrets (`lk agent update-secrets`): `OPENAI_API_KEY`, `DEEPGRAM_API_KEY`,
`ELEVEN_API_KEY`, `LEAD_API_SECRET` (same value as on Netlify) and optionally
`IMMOOPS_SITE_URL` (defaults to `https://www.immoops.com`; use the www host, the redirect from
`immoops.com` drops the `Authorization` header).

Deploy order: the site first (the agent needs `agent-config` and `agent-tool`), then the agent.
Renaming the agent: deploy the agent first, then the site (or set `LIVEKIT_AGENT_NAME` on
Netlify), otherwise calls dispatch a name no worker answers and show "Camille est indisponible".

## Call length

Web calls have no time limit: the call runs until the visitor hangs up (the on-screen timer
only counts up). Add a cap on the agent side (LiveKit) if API spend becomes a concern.
