/**
 * Strips OpenClaw-injected inbound metadata blocks from a user-role message
 * text before it is displayed in any UI surface (TUI, webchat, macOS app) or
 * replayed as historical context to the model.
 *
 * Background: `buildInboundUserContextPrefix` in `inbound-meta.ts` prepends
 * structured metadata blocks (Conversation info, Sender info, reply context,
 * etc.) directly to the stored user message content so the LLM can access
 * them. These blocks are current-turn AI-facing context only and must never
 * surface in user-visible chat history or accumulate in historical prompt
 * replay.
 *
 * Also strips the timestamp prefix injected by `injectTimestamp` so UI surfaces
 * do not show AI-facing envelope metadata as user text.
 */
/** Fast check for whether text contains any inbound metadata sentinel. */
export declare function hasInboundMetadataSentinel(text: string): boolean;
/**
 * Remove all injected inbound metadata prefix blocks from `text`.
 *
 * Each block has the shape:
 *
 * ```
 * <sentinel-line>
 * ```json
 * { … }
 * ```
 * ```
 *
 * Returns the original string reference unchanged when no metadata is present
 * (fast path — zero allocation).
 */
/** Strips all injected inbound metadata blocks from user-visible text. */
export declare function stripInboundMetadata(text: string): string;
/** Strips only leading inbound metadata blocks while preserving later user text. */
export declare function stripLeadingInboundMetadata(text: string): string;
/** Extracts the sender label from injected inbound metadata when present. */
export declare function extractInboundSenderLabel(text: string): string | null;
