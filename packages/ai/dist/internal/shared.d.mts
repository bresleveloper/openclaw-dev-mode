import { O as Message, a as AssistantMessage, ct as ThinkingBudgets, d as Context, k as Model, n as Api, tt as SimpleStreamOptions, ut as ThinkingLevel, z as PreparedSystemPrompt } from "../types-B1ZIh9Ch.mjs";
import "../index-94l3uJ39.mjs";
import { a as readAssistantThinkingAppend } from "../event-stream-MivcTu-M.mjs";
import "../types-CeCl7cJZ.mjs";
import { d as ProviderStreamOptions } from "../provider-types-CNnxVhQE.mjs";
import { f as preparedRequestSuffix } from "../provider-options-BOGPCBFr.mjs";
import { serializeModelRequestBody } from "./model-request-body.mjs";
import { r as matchesContextOverflowMessage, t as sanitizeSurrogates } from "../sanitize-unicode-Ba_nhygY.mjs";
import { i as projectProviderError } from "../provider-error-DZMru0Jv.mjs";
import { h as iterateSseFrames } from "../transport-stream-shared-CJrl4Yd5.mjs";
import { i as projectPreparedDiagnosticValue, n as isCredentialFieldName } from "../credential-redaction-BNv5SWQz.mjs";
import { n as normalizeStructuredPromptSection, r as sortPromptCacheToolsByName, t as normalizePromptCapabilityIds } from "../prompt-cache-stability-xNfkD-3g.mjs";
type FirstEventStreamOptions = {
  firstEventTimeoutMs?: number;
  onFirstEventTimeout?: (reason: Error) => void;
};
export declare function buildBaseOptions(model: Model, options?: SimpleStreamOptions & ProviderStreamOptions, apiKey?: string): ProviderStreamOptions & FirstEventStreamOptions & Pick<SimpleStreamOptions, "serviceTier">;
export declare function clampMaxTokensToModel(model: Model, requestedMaxTokens: number): number;
export declare function clampMaxTokensToModel(model: Model, requestedMaxTokens: number | undefined): number | undefined;
export declare function clampReasoning(effort: ThinkingLevel): Exclude<ThinkingLevel, "xhigh">;
export declare function clampReasoning(effort: ThinkingLevel | undefined): Exclude<ThinkingLevel, "xhigh"> | undefined;
export declare function adjustMaxTokensForThinking(baseMaxTokens: number | undefined, modelMaxTokens: number, reasoningLevel: ThinkingLevel, customBudgets?: ThinkingBudgets): {
  maxTokens: number;
  thinkingBudget: number;
};
export declare function describeToolResultMediaPlaceholder(blocks: readonly unknown[]): string | undefined;
export declare function extractToolResultBlockText(block: unknown): string | undefined;
export declare function extractToolResultText(blocks: readonly unknown[], options?: {
  includeStructured?: boolean;
}): string;
/** Describe media that cannot be represented on the target provider wire. */
export declare function describeUnsupportedToolResultMedia(blocks: readonly unknown[], support: {
  images: boolean;
  audio: boolean;
}): string | undefined;
export declare function formatToolResultText(params: {
  text: string;
  mediaPlaceholder?: string;
  omittedMediaPlaceholder?: string;
  isError: boolean;
}): string;
/** Media metadata alone is not an attachment; provider emitters need inline bytes. */
export declare function hasMediaPayload(block: unknown): block is Record<string, unknown> & {
  data: string;
};
/** Image metadata alone is not an attachment; provider emitters need inline bytes. */
export declare function isImageWithMediaPayload<T>(block: T): block is T & {
  type: "image";
  data: string;
};
export declare function transformMessages<TApi extends Api>(messages: Message[], model: Model<TApi>, normalizeToolCallId?: (id: string, model: Model<TApi>, source: AssistantMessage) => string): Message[];
type AssistantTurnLike = {
  role?: unknown;
  stopReason?: unknown;
  errorCode?: unknown;
  content?: unknown;
};
/** Returns true when an assistant turn contains only provider reasoning and blank text. */
export declare function hasOnlyAssistantReasoningContent(message: AssistantTurnLike): boolean;
/** Returns true when a token-limited turn contains only incomplete provider reasoning. */
export declare function isReasoningOnlyLengthAssistantTurn(message: AssistantTurnLike): boolean;
export declare const STREAM_ERROR_FALLBACK_TEXT = "[assistant turn failed before producing content]";
export declare function isStreamErrorFallbackContent(content: unknown): boolean;
export declare const FAILED_ASSISTANT_REPLAY_TEXT = "[This turn failed before it completed. Do not redo its work without confirming with the user first.]";
/** Classify failed source content before model-specific thinking or tool projection. */
export declare function resolveFailedAssistantReplay(message: AssistantTurnLike, options: {
  pairingAware: boolean;
}): "keep" | "drop" | "marker";
export declare const SYSTEM_PROMPT_CACHE_BOUNDARY = "\n<!-- OPENCLAW_CACHE_BOUNDARY -->\n";
/** Producer-delimited Runtime facts; instructions must remain outside this region. */
export declare const SYSTEM_PROMPT_RELOCATABLE_BOUNDARY = "\n<!-- OPENCLAW-RELOCATABLE-BOUNDARY -->\n";
export declare const SYSTEM_PROMPT_RELOCATABLE_BOUNDARY_END = "\n<!-- /OPENCLAW-RELOCATABLE-BOUNDARY -->";
/** Carry this fact with its session; interleaved sessions cannot evict a live revision. */
export declare function prepareSystemPrompt(text: string, previous?: PreparedSystemPrompt): PreparedSystemPrompt;
/** A stream's boundary transform carries the revision it actually passes downstream. */
export declare function createSystemPromptCacheBoundaryStripper(): <T extends Pick<Context, "systemPrompt" | "preparedSystemPrompt">>(context: T) => T;
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
/** Keep the stripped prompt's separator in wire text while marking its stable prefix. */
export declare function splitSystemPromptCacheBoundaryForWire(text: string): {
  stablePrefix: string;
  dynamicSuffix: string;
} | undefined;
/** Keep explicit cache breakpoints while removing relocation metadata. */
export declare function stripSystemPromptRelocatableBoundary(text: string): string;
export declare function prependSystemPromptAdditionAfterCacheBoundary(params: {
  systemPrompt: string;
  systemPromptAddition?: string;
}): string;
/** Request facts shared by Copilot transports; identity headers remain plugin-owned. */
export declare function projectCopilotRequestFacts(messages: readonly {
  role: string;
  content: unknown;
  runtimeContext?: unknown;
  runtimeContextCarrier?: unknown;
}[], contentMode: "direct" | "nested", hasImages?: boolean): {
  initiator: "user" | "agent";
  hasImages: boolean;
};
export { isCredentialFieldName, iterateSseFrames, matchesContextOverflowMessage, normalizePromptCapabilityIds, normalizeStructuredPromptSection, preparedRequestSuffix, projectPreparedDiagnosticValue, projectProviderError, readAssistantThinkingAppend, sanitizeSurrogates, serializeModelRequestBody, sortPromptCacheToolsByName };