import * as React from "react";

import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon, Robot01Icon, Tick02Icon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";

import {
  AnthropicLogo,
  CohereLogo,
  DeepSeekLogo,
  GeminiLogo,
  GroqLogo,
  MetaLogo,
  MistralLogo,
  OpenAILogo,
  XAILogo,
} from "@/components/ui/message-bubble-utils/logos";

type MessageRole = "user" | "assistant";

type Provider =
  | "openai"
  | "anthropic"
  | "google"
  | "xai"
  | "deepseek"
  | "mistral"
  | "groq"
  | "cohere"
  | "meta";

const PROVIDER_LOGOS: Record<
  Provider,
  React.ComponentType<{ className?: string }>
> = {
  openai: OpenAILogo,
  anthropic: AnthropicLogo,
  google: GeminiLogo,
  xai: XAILogo,
  deepseek: DeepSeekLogo,
  mistral: MistralLogo,
  groq: GroqLogo,
  cohere: CohereLogo,
  meta: MetaLogo,
};

interface AiMessageBubbleProps {
  role: MessageRole;
  content?: string;
  provider?: Provider;
  timestamp?: Date;
  avatar?: React.ReactNode;
  /** Hide the avatar but keep its space, for consecutive messages from the same side */
  showAvatar?: boolean;
  isStreaming?: boolean;
  /** Rendered under the bubble, e.g. a link card */
  attachment?: React.ReactNode;
  copyLabel?: string;
  copiedLabel?: string;
  className?: string;
  children?: React.ReactNode;
}

export function AiMessageBubble({
  role,
  content,
  provider,
  timestamp,
  avatar,
  showAvatar = true,
  isStreaming = false,
  attachment,
  copyLabel = "Copier",
  copiedLabel = "Copié",
  className,
  children,
}: AiMessageBubbleProps) {
  const [copied, setCopied] = React.useState(false);

  const isUser = role === "user";

  const handleCopy = React.useCallback(async () => {
    await navigator.clipboard.writeText(content ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [content]);

  const ProviderLogo = provider ? PROVIDER_LOGOS[provider] : null;

  const defaultAvatar = isUser ? null : (
    <div className="flex size-7 items-center justify-center rounded-full bg-ink text-white">
      {ProviderLogo ? (
        <ProviderLogo className="size-3.5" />
      ) : (
        <HugeiconsIcon icon={Robot01Icon} className="size-3.5" strokeWidth={1.5} />
      )}
    </div>
  );
  const avatarNode = avatar ?? defaultAvatar;
  const isEmpty = !children && !content;

  return (
    <div
      data-slot="ai-message-bubble"
      role="article"
      aria-label={isUser ? "Votre message" : "Réponse de l'IA"}
      className={cn(
        "flex items-end gap-2.5 font-sans",
        isUser && "flex-row-reverse",
        className,
      )}
    >
      {avatarNode && (
        <div className="w-7 shrink-0">{showAvatar && avatarNode}</div>
      )}

      <div
        className={cn(
          "flex min-w-0 max-w-[82%] flex-col gap-1.5",
          isUser ? "items-end" : "items-start",
        )}
      >
        <div
          aria-live={isStreaming ? "polite" : undefined}
          className={cn(
            "px-3.5 py-2.5 text-[14px] leading-relaxed",
            isUser
              ? "rounded-[18px] bg-purple text-white"
              : "rounded-2xl border border-gray-line bg-white text-ink",
          )}
        >
          {children ? (
            <div className="[&_a]:text-purple [&_a]:underline [&_p]:m-0">
              {children}
            </div>
          ) : (
            !isEmpty && <p className="m-0 whitespace-pre-wrap">{content}</p>
          )}
          {isStreaming && (
            isEmpty ? (
              <span className="flex h-[22px] items-center gap-1" aria-label="En train d'écrire">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-1.5 rounded-full bg-ink-body"
                    style={{ animation: `bounce 1.2s ${i * 0.2}s ease-in-out infinite` }}
                  />
                ))}
              </span>
            ) : (
              <span className="ml-1 inline-block h-3.5 w-[2px] animate-pulse bg-current" />
            )
          )}
        </div>

        {attachment}

        {timestamp && (
          <time className="font-mono text-[10px] uppercase tracking-wider text-ink-body">
            {timestamp.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        )}

        {!isUser && !isStreaming && content && (
          <button
            type="button"
            className="flex items-center gap-1 px-0.5 text-[13px] text-ink-body transition-colors hover:text-ink"
            onClick={handleCopy}
          >
            <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} className="size-3.5" strokeWidth={1.5} />
            {copied ? copiedLabel : copyLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export type { AiMessageBubbleProps, MessageRole, Provider };
