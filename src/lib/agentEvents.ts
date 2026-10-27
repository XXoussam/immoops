/* Lets any button on the site open the floating chat / call bubbles (handled in AgentBubbles) */

export type AgentKind = 'chat' | 'phone'

export const OPEN_AGENT_EVENT = 'immoops:open-agent'

export function openAgent(kind: AgentKind) {
  window.dispatchEvent(new CustomEvent<AgentKind>(OPEN_AGENT_EVENT, { detail: kind }))
}
