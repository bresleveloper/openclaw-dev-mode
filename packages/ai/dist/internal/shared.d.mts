import { D as Message, G as SimpleStreamOptions, O as Model, Q as ThinkingBudgets, Y as StreamOptions, a as AssistantMessage, et as ThinkingLevel, n as Api } from "../types-qZFbaDbK.mjs";
import { a as readAssistantThinkingAppend } from "../event-stream-CjnIZZst.mjs";
import "../types-DTvddOfm.mjs";
import { t as sanitizeSurrogates } from "../sanitize-unicode-BZiVbGwK.mjs";
import { i as projectProviderError } from "../provider-error-xumb1V3F.mjs";
import { n as createDiagnosticRecord } from "../credential-redaction-BKv49aiv.mjs";
import { n as normalizeStructuredPromptSection, r as sortPromptCacheToolsByName, t as normalizePromptCapabilityIds } from "../prompt-cache-stability-Cwcjv_fx.mjs";
//#region packages/ai/src/providers/simple-options.d.ts
type FirstEventStreamOptions = {
  firstEventTimeoutMs?: number;
  onFirstEventTimeout?: (reason: Error) => void;
};
export declare function buildBaseOptions(model: Model, options?: SimpleStreamOptions, apiKey?: string): StreamOptions & FirstEventStreamOptions & Pick<SimpleStreamOptions, "serviceTier">;
export declare function clampMaxTokensToModel(model: Model, requestedMaxTokens: number): number;
export declare function clampMaxTokensToModel(model: Model, requestedMaxTokens: number | undefined): number | undefined;
export declare function clampReasoning(effort: ThinkingLevel): Exclude<ThinkingLevel, "xhigh">;
export declare function clampReasoning(effort: ThinkingLevel | undefined): Exclude<ThinkingLevel, "xhigh"> | undefined;
export declare function adjustMaxTokensForThinking(baseMaxTokens: number | undefined, modelMaxTokens: number, reasoningLevel: ThinkingLevel, customBudgets?: ThinkingBudgets): {
  maxTokens: number;
  thinkingBudget: number;
};
//#endregion
//#region packages/ai/src/providers/tool-result-text.d.ts
/** Media metadata alone is not an attachment; provider emitters need inline bytes. */
export declare function hasMediaPayload(block: unknown): block is Record<string, unknown> & {
  data: string;
};
/** Image metadata alone is not an attachment; provider emitters need inline bytes. */
export declare function isImageWithMediaPayload<T>(block: T): block is T & {
  type: "image";
  data: string;
};
export declare function describeToolResultMediaPlaceholder(blocks: readonly unknown[]): string | undefined;
export declare function extractToolResultBlockText(block: unknown): string | undefined;
export declare function extractToolResultText(blocks: readonly unknown[], options?: {
  includeStructured?: boolean;
}): string;
type ToolResultMediaSupport = {
  images: boolean;
  audio: boolean;
};
/** Describe media that cannot be represented on the target provider wire. */
export declare function describeUnsupportedToolResultMedia(blocks: readonly unknown[], support: ToolResultMediaSupport): string | undefined;
export declare function formatToolResultText(params: {
  text: string;
  mediaPlaceholder?: string;
  omittedMediaPlaceholder?: string;
  isError: boolean;
}): string;
//#endregion
//#region packages/ai/src/transcript-transform.d.ts
export declare function transformMessages<TApi extends Api>(messages: Message[], model: Model<TApi>, normalizeToolCallId?: (id: string, model: Model<TApi>, source: AssistantMessage) => string): Message[];
//#endregion
//#region packages/ai/src/replay-turn-classification.d.ts
type AssistantTurnLike = {
  role?: unknown;
  stopReason?: unknown;
  content?: unknown;
};
/** Returns true when an assistant turn contains only provider reasoning and blank text. */
export declare function hasOnlyAssistantReasoningContent(message: AssistantTurnLike): boolean;
/** Returns true when a token-limited turn contains only incomplete provider reasoning. */
export declare function isReasoningOnlyLengthAssistantTurn(message: AssistantTurnLike): boolean;
export declare const STREAM_ERROR_FALLBACK_TEXT = "[assistant turn failed before producing content]";
export declare function isStreamErrorFallbackContent(content: unknown): boolean;
export declare const FAILED_ASSISTANT_REPLAY_TEXT = "[This turn failed before it completed. Do not redo its work without confirming with the user first.]";
type FailedAssistantReplay = "keep" | "drop" | "marker";
/** Classify failed source content before model-specific thinking or tool projection. */
export declare function resolveFailedAssistantReplay(message: AssistantTurnLike, options: {
  pairingAware: boolean;
}): FailedAssistantReplay;
//#endregion
//#region packages/ai/src/utils/system-prompt-cache-boundary.d.ts
export declare const SYSTEM_PROMPT_CACHE_BOUNDARY = "\n<!-- OPENCLAW_CACHE_BOUNDARY -->\n";
/** Producer-delimited Runtime facts; instructions must remain outside this region. */
export declare const SYSTEM_PROMPT_RELOCATABLE_BOUNDARY = "\n<!-- OPENCLAW-RELOCATABLE-BOUNDARY -->\n";
export declare const SYSTEM_PROMPT_RELOCATABLE_BOUNDARY_END = "\n<!-- /OPENCLAW-RELOCATABLE-BOUNDARY -->";
export declare function stripSystemPromptCacheBoundary(text: string): string;
/** Reject ambiguous markers from workspace or hook text instead of moving instructions. */
export declare function splitSystemPromptRelocatableBoundary(text: string): {
  remainingPrompt: string;
  relocatable: string;
} | undefined;
export declare function ensureSystemPromptCacheBoundary(systemPrompt: string): string;
export declare function splitSystemPromptCacheBoundary(text: string): {
  stablePrefix: string;
  dynamicSuffix: string;
} | undefined;
/** Keep explicit cache breakpoints while removing relocation metadata. */
export declare function stripSystemPromptRelocatableBoundary(text: string): string;
export declare function prependSystemPromptAdditionAfterCacheBoundary(params: {
  systemPrompt: string;
  systemPromptAddition?: string;
}): string;
//#endregion
//#region packages/ai/src/utils/tls-certificate-errors.d.ts
export type TlsCertificateErrorKind = "certificate_invalid" | "hostname_mismatch";
export type TlsCertificateErrorDetails = {
  kind: TlsCertificateErrorKind;
  code?: string;
  message: string;
};
/** Classify deterministic Node/OpenSSL certificate validation failures. */
export declare function inspectTlsCertificateError(error: unknown): TlsCertificateErrorDetails | null;
//#endregion
//#region packages/ai/src/providers/github-copilot-request-facts.d.ts
/** Request facts shared by Copilot transports; identity headers remain plugin-owned. */
export declare function projectCopilotRequestFacts(messages: readonly {
  role: string;
  content: unknown;
}[], contentMode: "direct" | "nested", hasImages?: boolean): {
  initiator: "user" | "agent";
  hasImages: boolean;
};
//#endregion
export { createDiagnosticRecord, normalizePromptCapabilityIds, normalizeStructuredPromptSection, projectProviderError, readAssistantThinkingAppend, sanitizeSurrogates, sortPromptCacheToolsByName };