import { HugeiconsIcon } from '@hugeicons/react'
import {
  AiBrain01Icon,
  ChatGptIcon,
  ClaudeIcon,
  DeepseekIcon,
  GoogleGeminiIcon,
  GrokIcon,
  MetaIcon,
  MistralIcon,
} from '@hugeicons/core-free-icons'

type LogoProps = { className?: string }

/* HugeIcons has no Groq or Cohere mark, so those two use a generic AI icon */
const logo = (icon: typeof ChatGptIcon) =>
  function Logo({ className }: LogoProps) {
    return <HugeiconsIcon icon={icon} className={className} strokeWidth={1.5} />
  }

export const OpenAILogo = logo(ChatGptIcon)
export const AnthropicLogo = logo(ClaudeIcon)
export const GeminiLogo = logo(GoogleGeminiIcon)
export const XAILogo = logo(GrokIcon)
export const DeepSeekLogo = logo(DeepseekIcon)
export const MistralLogo = logo(MistralIcon)
export const GroqLogo = logo(AiBrain01Icon)
export const CohereLogo = logo(AiBrain01Icon)
export const MetaLogo = logo(MetaIcon)
