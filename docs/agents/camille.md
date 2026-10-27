# Camille — one AI agent for chat and calls

Camille is the assistant behind both floating bubbles on the site. She presents ImmoOps to
real-estate professionals and, with their consent, collects their details so Oussama can
follow up. One prompt and one lead pipeline serve both channels:

| | Chat bubble | Call bubble |
|---|---|---|
| Runs in | `netlify/functions/chat.js` (Gemini) | LiveKit agent `immoops-ines` (outside this repo) |
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
| `LIVEKIT_AGENT_NAME` | token | optional, defaults to `immoops-ines` |

## Wiring the LiveKit voice agent

The agent needs two env vars: `IMMOOPS_SITE_URL` (e.g. `https://immoops.com`) and
`LEAD_API_SECRET` (same value as on Netlify). Then, in the agent code:

```python
SITE_URL = os.environ["IMMOOPS_SITE_URL"].rstrip("/")
LEAD_API_SECRET = os.environ["LEAD_API_SECRET"]


async def load_camille_prompt() -> str:
    """Camille's shared instructions, as maintained in the immoops repo."""
    async with httpx.AsyncClient(timeout=5.0) as client:
        resp = await client.get(f"{SITE_URL}/.netlify/functions/agent-prompt", params={"canal": "appel"})
        resp.raise_for_status()
        return resp.text


class Camille(Agent):
    def __init__(self, instructions: str) -> None:
        super().__init__(instructions=instructions)

    @function_tool
    async def enregistrer_lead(
        self,
        context: RunContext,
        nom: str,
        besoin: str,
        consentement: bool,
        email: str | None = None,
        telephone: str | None = None,
        agence: str | None = None,
    ):
        """Enregistre les coordonnées d'un visiteur qui accepte explicitement d'être
        recontacté par ImmoOps. Nécessite au moins un email ou un téléphone.

        Args:
            nom: nom du visiteur
            besoin: le besoin exprimé, résumé en une phrase
            consentement: true uniquement si le visiteur a explicitement accepté d'être recontacté
            email: email du visiteur, confirmé en l'épelant
            telephone: téléphone du visiteur, confirmé chiffre par chiffre
            agence: nom de l'agence ou du réseau, et ville si connue
        """
        payload = {
            "nom": nom, "besoin": besoin, "consentement": consentement,
            "email": email or "", "telephone": telephone or "", "agence": agence or "",
        }
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.post(
                    f"{SITE_URL}/.netlify/functions/lead",
                    headers={"Authorization": f"Bearer {LEAD_API_SECRET}"},
                    json=payload,
                )
                result = resp.json()
        except Exception as e:
            logger.warning(f"lead not saved: {e}")
            return "Enregistrement indisponible : propose au visiteur de réserver lui-même un créneau sur le site."
        if result.get("ok"):
            return "Coordonnées enregistrées. Dis au visiteur qu'Oussama le recontacte très vite."
        return result.get("error", "Enregistrement indisponible.")


async def entrypoint(ctx: JobContext):
    instructions = await load_camille_prompt()
    session = AgentSession(...)  # unchanged: STT / LLM / TTS / VAD
    await session.start(agent=Camille(instructions), room=ctx.room)
    await ctx.connect()
```

The lead endpoint also accepts an optional `transcript` string, stored in ChatSessions with
the lead, if you want the call transcript saved alongside it.

## Call length

Web calls are capped at 30 seconds (`CALL_TIME_LIMIT_MS` in `src/hooks/useVoiceDemo.ts`, and
`CALL_LIMIT_S` in `src/components/layout/AgentBubbles.tsx` for the on-screen timer) to limit
API spend. That is too short for Camille to present ImmoOps *and* take a name, agency and
phone number; raise both once she collects leads by phone.
