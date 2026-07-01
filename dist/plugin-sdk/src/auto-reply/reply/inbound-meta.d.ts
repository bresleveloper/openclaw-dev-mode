import type { EnvelopeFormatOptions } from "../envelope.js";
import type { SourceReplyDeliveryMode } from "../get-reply-options.types.js";
import type { TemplateContext } from "../templating.js";
/** Options for building the user-context prefix added to inbound prompts. */
type InboundUserContextPrefixOptions = {
    sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
};
/** Resolves whether inbound context should join directly with the user body. */
export declare function resolveInboundUserContextPromptJoiner(ctx: TemplateContext): " " | undefined;
/** Builds trusted system metadata for the inbound channel and formatting hints. */
export declare function buildInboundMetaSystemPrompt(ctx: TemplateContext, options?: {
    includeFormattingHints?: boolean;
}): string;
/** Builds untrusted inbound context text that prefixes the user-visible body. */
export declare function buildInboundUserContextPrefix(ctx: TemplateContext, envelope?: EnvelopeFormatOptions, options?: InboundUserContextPrefixOptions): string;
export {};
