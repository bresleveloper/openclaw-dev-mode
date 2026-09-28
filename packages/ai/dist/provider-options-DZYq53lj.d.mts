import { Y as StreamOptions } from "./types-qZFbaDbK.mjs";
import { t as OpenAICompletionsToolChoice } from "./openai-tool-projection-793cE3QX.mjs";
import "./types-DTvddOfm.mjs";
import Anthropic from "@anthropic-ai/sdk";
//#region packages/ai/src/providers/openai-reasoning-effort.d.ts
declare const ENABLED_REASONING_EFFORTS: readonly ["minimal", "low", "medium", "high", "xhigh", "max"];
type OpenAIReasoningEffort = "none" | (typeof ENABLED_REASONING_EFFORTS)[number];
type OpenAIApiReasoningEffort = OpenAIReasoningEffort | (string & {});
type OpenAIReasoningModel = {
  provider?: unknown;
  id?: unknown;
  name?: unknown;
  api?: unknown;
  baseUrl?: unknown;
  compat?: unknown;
};
/** Return whether a model is the GPT-5.4 mini family. */
declare function isOpenAIGpt54MiniModel(model: OpenAIReasoningModel): boolean;
/** Return whether a model is the GPT-5.5 family. */
declare function isOpenAIGpt55Model(model: OpenAIReasoningModel): boolean;
/** Return whether a model is the GPT-5.6 family. */
declare function isOpenAIGpt56Model(model: OpenAIReasoningModel): boolean;
/** Return whether a model has a known GPT-6 reasoning and sampling contract. */
declare function isOpenAIGpt6Model(model: OpenAIReasoningModel): boolean;
/** Normalize user-facing reasoning effort names to API effort names. */
declare function normalizeOpenAIReasoningEffort(effort: string): string;
/** Resolve the reasoning efforts accepted by a specific OpenAI-compatible model. */
declare function resolveOpenAISupportedReasoningEfforts(model: OpenAIReasoningModel): readonly OpenAIApiReasoningEffort[];
/** Read a declared or known model contract, leaving unknown compatible models unspecified. */
declare function resolveOpenAIModelReasoningEfforts(model: OpenAIReasoningModel): readonly OpenAIApiReasoningEffort[] | undefined;
/**
 * Return whether a model accepts temperature. GPT-5.6 and known GPT-6 models
 * reject it with a 400; catalog compat can override per model.
 */
declare function supportsOpenAITemperature(model: OpenAIReasoningModel): boolean;
/** Return whether a model accepts a requested reasoning effort. */
declare function supportsOpenAIReasoningEffort(model: OpenAIReasoningModel, effort: string): boolean;
/** Read provider mappings without folding provider-native labels. */
declare function resolveOpenAIReasoningEffortMapping(effort: string, mapping: Record<string, string> | undefined): string | undefined;
/** Resolve a requested reasoning effort to the closest value supported by the model. */
declare function resolveOpenAIReasoningEffortForModel(params: {
  model: OpenAIReasoningModel;
  effort: string;
  fallbackMap?: Record<string, string>;
}): OpenAIApiReasoningEffort | undefined;
//#endregion
//#region packages/ai/src/provider-options.d.ts
type OpenAIResponsesCompactionRejection = {
  data: string;
  id?: string;
};
type CodeModeToolSurfaceObservation = {
  beforeToolIdentities: readonly string[];
  afterToolIdentities: readonly string[];
};
type CodeModeToolSurfaceObserver = (observation: CodeModeToolSurfaceObservation) => void;
declare function markStrictReasoningTagText(options: object): void;
declare function isStrictReasoningTagText(options: object | undefined): boolean;
declare const codeModeToolSurfaceObserver: {
  set(options: object, observer: CodeModeToolSurfaceObserver, collector?: CodeModeToolSurfaceObserver): void;
  get(options: object | undefined): CodeModeToolSurfaceObserver | undefined;
  getCollector(options: object | undefined): CodeModeToolSurfaceObserver | undefined;
};
/** Internal output policy for callers that must not recover ambiguous reasoning as visible text. */
declare const reasoningTagTextPolicy: {
  markStrict: typeof markStrictReasoningTagText;
  isStrict: typeof isStrictReasoningTagText;
  copy(source: object | undefined, target: object): void;
};
type AnthropicEffort = "low" | "medium" | "high" | "xhigh" | "max";
type AnthropicThinkingDisplay = "summarized" | "omitted";
type AnthropicContextManagementOptions = {
  anthropicServerCompaction?: boolean;
  anthropicCompactThreshold?: number;
  cacheTtlPruning?: {
    tools?: {
      allow?: string[];
      deny?: string[];
    };
  };
};
/** Provider options shared by the Anthropic provider and canonical transport. */
interface AnthropicOptions extends StreamOptions, AnthropicContextManagementOptions {
  /**
   * Enable extended thinking.
   * For Opus 4.6+ and Sonnet 4.6: uses adaptive thinking (model decides when/how much to think).
   * For older models: uses budget-based thinking with thinkingBudgetTokens.
   */
  thinkingEnabled?: boolean;
  /**
   * Token budget for extended thinking (older models only).
   * Ignored for Opus 4.6+ and Sonnet 4.6, which use adaptive thinking.
   */
  thinkingBudgetTokens?: number;
  /**
   * Effort level for adaptive thinking (Opus 4.6+ and Sonnet 4.6).
   * Controls how much thinking Claude allocates:
   * - "max": Always thinks with no constraints (Opus 4.6 only)
   * - "xhigh": Highest reasoning level (Opus 4.7+)
   * - "high": Always thinks, deep reasoning (default)
   * - "medium": Moderate thinking, may skip for simple queries
   * - "low": Minimal thinking, skips for simple tasks
   * Ignored for older models.
   */
  effort?: AnthropicEffort;
  /**
   * Controls how thinking content is returned in API responses.
   * - "summarized": Thinking blocks contain summarized thinking text (default here).
   * - "omitted": Thinking blocks return an empty thinking field; the encrypted
   *   signature still travels back for multi-turn continuity. Use for faster
   *   time-to-first-text-token when your UI does not surface thinking.
   *
   * Note: Anthropic's API default for Claude Opus 4.7+ and Claude Mythos Preview
   * is "omitted". We default to "summarized" here to keep behavior consistent
   * with older Claude 4 models. Set this explicitly to "omitted" to opt in.
   */
  thinkingDisplay?: AnthropicThinkingDisplay;
  interleavedThinking?: boolean;
  toolChoice?: "auto" | "any" | "none" | {
    type: "tool";
    name: string;
  };
  /**
   * Pre-built Anthropic client instance. When provided, skips internal client
   * construction entirely. Use this to inject alternative SDK clients such as
   * `AnthropicVertex` that shares the same messaging API.
   */
  client?: Anthropic;
}
/** Options shared by the OpenAI Responses and Completions transports. */
type BaseOpenAIStreamOptions = StreamOptions & {
  topP?: number;
  authProfileId?: string;
  firstEventTimeoutMs?: number;
  onFirstEventTimeout?: (reason: Error) => void;
  /** Internal owner notification after a server rejects a persisted compaction checkpoint. */
  onCompactionRejected?: (checkpoint: OpenAIResponsesCompactionRejection) => void;
  openclawCodeModeToolSurface?: boolean;
  openclawCodeModeAllowedHostedToolTypes?: Set<string>;
  frequencyPenalty?: number;
  presencePenalty?: number;
  seed?: number;
};
/** Superset retained under the provider's published compatibility type name. */
type OpenAICompletionsOptions = BaseOpenAIStreamOptions & {
  toolChoice?: OpenAICompletionsToolChoice;
  reasoning?: OpenAIReasoningEffort | "off";
  reasoningEffort?: OpenAIReasoningEffort | "off";
};
//#endregion
export { supportsOpenAITemperature as C, supportsOpenAIReasoningEffort as S, normalizeOpenAIReasoningEffort as _, BaseOpenAIStreamOptions as a, resolveOpenAIReasoningEffortMapping as b, OpenAIResponsesCompactionRejection as c, OpenAIApiReasoningEffort as d, OpenAIReasoningEffort as f, isOpenAIGpt6Model as g, isOpenAIGpt56Model as h, AnthropicThinkingDisplay as i, codeModeToolSurfaceObserver as l, isOpenAIGpt55Model as m, AnthropicEffort as n, CodeModeToolSurfaceObservation as o, isOpenAIGpt54MiniModel as p, AnthropicOptions as r, OpenAICompletionsOptions as s, AnthropicContextManagementOptions as t, reasoningTagTextPolicy as u, resolveOpenAIModelReasoningEfforts as v, resolveOpenAISupportedReasoningEfforts as x, resolveOpenAIReasoningEffortForModel as y };