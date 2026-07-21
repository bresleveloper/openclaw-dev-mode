import { E as Model, F as SimpleStreamOptions, H as ThinkingBudgets, T as Message, W as ThinkingLevel, i as AssistantMessage, n as Api, z as StreamOptions } from "../types-DRgdPqaZ.mjs";
import { t as sanitizeSurrogates } from "../sanitize-unicode-BZiVbGwK.mjs";

//#region packages/ai/src/providers/simple-options.d.ts
type FirstEventStreamOptions = {
  firstEventTimeoutMs?: number;
  onFirstEventTimeout?: (reason: Error) => void;
};
declare function buildBaseOptions(model: Model, options?: SimpleStreamOptions, apiKey?: string): StreamOptions & FirstEventStreamOptions;
declare function clampReasoning(effort: ThinkingLevel | undefined): Exclude<ThinkingLevel, "xhigh"> | undefined;
declare function adjustMaxTokensForThinking(baseMaxTokens: number | undefined, modelMaxTokens: number, reasoningLevel: ThinkingLevel, customBudgets?: ThinkingBudgets): {
  maxTokens: number;
  thinkingBudget: number;
};
//#endregion
//#region packages/ai/src/providers/tool-result-text.d.ts
declare function describeToolResultMediaPlaceholder(blocks: readonly unknown[]): string | undefined;
declare function extractToolResultBlockText(block: unknown): string | undefined;
declare function extractToolResultText(blocks: readonly unknown[]): string;
//#endregion
//#region packages/ai/src/providers/transform-messages.d.ts
/**
 * Normalize tool call ID for cross-provider compatibility.
 * OpenAI Responses API generates IDs that are 450+ chars with special characters like `|`.
 * Anthropic APIs require IDs matching ^[a-zA-Z0-9_-]+$ (max 64 chars).
 */
declare function transformMessages<TApi extends Api>(messages: Message[], model: Model<TApi>, normalizeToolCallId?: (id: string, model: Model<TApi>, source: AssistantMessage) => string): Message[];
//#endregion
//#region packages/ai/src/utils/prompt-cache-stability.d.ts
/** Normalize structured prompt text before hashing or snapshot comparison. */
declare function normalizeStructuredPromptSection(text: string): string;
/** Normalize, de-dupe, and sort capability ids for stable prompt payloads. */
declare function normalizePromptCapabilityIds(capabilities: ReadonlyArray<string>): string[];
//#endregion
//#region packages/ai/src/utils/system-prompt-cache-boundary.d.ts
declare const SYSTEM_PROMPT_CACHE_BOUNDARY = "\n<!-- OPENCLAW_CACHE_BOUNDARY -->\n";
declare function stripSystemPromptCacheBoundary(text: string): string;
declare function ensureSystemPromptCacheBoundary(systemPrompt: string): string;
declare function splitSystemPromptCacheBoundary(text: string): {
  stablePrefix: string;
  dynamicSuffix: string;
} | undefined;
declare function prependSystemPromptAdditionAfterCacheBoundary(params: {
  systemPrompt: string;
  systemPromptAddition?: string;
}): string;
//#endregion
export { SYSTEM_PROMPT_CACHE_BOUNDARY, adjustMaxTokensForThinking, buildBaseOptions, clampReasoning, describeToolResultMediaPlaceholder, ensureSystemPromptCacheBoundary, extractToolResultBlockText, extractToolResultText, normalizePromptCapabilityIds, normalizeStructuredPromptSection, prependSystemPromptAdditionAfterCacheBoundary, sanitizeSurrogates, splitSystemPromptCacheBoundary, stripSystemPromptCacheBoundary, transformMessages };