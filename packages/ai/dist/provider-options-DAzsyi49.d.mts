import { nt as StreamOptions } from "./types-CVYzKrMl.mjs";
import "./types-CBJthzJX.mjs";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { ResponseCreateParamsStreaming } from "openai/resources/responses/responses.js";
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
/** Apply the native Chat Completions tool contract after callers qualify the endpoint and model ID. */
declare function applyOpenAICompletionsToolReasoning(payload: Record<string, unknown>, model: {
  id: string;
  name?: string;
}): void;
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
//#region packages/ai/src/providers/openai-tool-projection.d.ts
type OpenAIToolDescriptor = {
  readonly name?: unknown;
  readonly description?: unknown;
  readonly parameters: unknown;
};
type OpenAIProjectedTool = {
  readonly toolIndex: number;
  readonly name: string;
  readonly description?: string;
  readonly parameters: Record<string, unknown>;
};
type OpenAIToolProjectionDiagnostic = {
  readonly toolIndex: number;
  readonly toolName?: string;
  readonly violations: readonly string[];
};
type OpenAIToolProjection = {
  readonly inputToolCount: number;
  readonly tools: readonly OpenAIProjectedTool[];
  readonly diagnostics: readonly OpenAIToolProjectionDiagnostic[];
};
type OpenAIResponsesToolChoice = ResponseCreateParamsStreaming["tool_choice"];
type OpenAICompletionsSdkToolChoice = OpenAI.Chat.Completions.ChatCompletionCreateParamsStreaming["tool_choice"];
type OpenAICompletionsToolChoice = Exclude<OpenAICompletionsSdkToolChoice, {
  type: "custom";
}>;
/** Snapshots direct/custom tool descriptors before OpenAI payload construction. */
declare function projectOpenAITools(tools: readonly OpenAIToolDescriptor[]): OpenAIToolProjection;
/** Keeps Responses tool choices aligned with surviving function schemas. */
declare function reconcileOpenAIResponsesToolChoice(choice: OpenAIResponsesToolChoice, projection: OpenAIToolProjection): OpenAIResponsesToolChoice | undefined;
/** Keeps Chat Completions tool choices aligned with surviving function schemas. */
declare function reconcileOpenAICompletionsToolChoice(choice: OpenAICompletionsSdkToolChoice, projection: OpenAIToolProjection): OpenAICompletionsSdkToolChoice | undefined;
//#endregion
//#region packages/ai/src/provider-options.d.ts
/** Identity of a provider compaction checkpoint the server rejected on replay. */
type CompactionReplayRejection = {
  data: string;
  id?: string;
};
/** @deprecated Use CompactionReplayRejection. */
type OpenAIResponsesCompactionRejection = CompactionReplayRejection;
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
/** The caller supplies a captured wire prefix; transport repair must retain its late tool results. */
declare const preparedRequestSuffix: {
  mark(context: object, toolCallIds: ReadonlySet<string>): void;
  has(context: object): boolean;
  toolCallId(context: object, id: string, normalized: string): string;
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
  /** Internal owner notification after Anthropic rejects a replayed compaction checkpoint. */
  onCompactionRejected?: (checkpoint: CompactionReplayRejection) => void;
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
  onCompactionRejected?: (checkpoint: CompactionReplayRejection) => void;
  openclawCodeModeToolSurface?: boolean;
  openclawCodeModeAllowedHostedToolTypes?: Set<string>;
  frequencyPenalty?: number;
  presencePenalty?: number;
  seed?: number;
};
/** Superset retained under the provider's published compatibility type name. */
type OpenAICompletionsOptions = BaseOpenAIStreamOptions & {
  streaming?: boolean;
  toolChoice?: OpenAICompletionsToolChoice;
  reasoning?: OpenAIReasoningEffort | "off";
  reasoningEffort?: OpenAIReasoningEffort | "off";
};
//#endregion
export { supportsOpenAIReasoningEffort as A, isOpenAIGpt56Model as C, resolveOpenAIReasoningEffortForModel as D, resolveOpenAIModelReasoningEfforts as E, resolveOpenAIReasoningEffortMapping as O, isOpenAIGpt55Model as S, normalizeOpenAIReasoningEffort as T, reconcileOpenAIResponsesToolChoice as _, BaseOpenAIStreamOptions as a, applyOpenAICompletionsToolReasoning as b, OpenAICompletionsOptions as c, preparedRequestSuffix as d, reasoningTagTextPolicy as f, reconcileOpenAICompletionsToolChoice as g, projectOpenAITools as h, AnthropicThinkingDisplay as i, supportsOpenAITemperature as j, resolveOpenAISupportedReasoningEfforts as k, OpenAIResponsesCompactionRejection as l, OpenAIToolProjection as m, AnthropicEffort as n, CodeModeToolSurfaceObservation as o, OpenAICompletionsToolChoice as p, AnthropicOptions as r, CompactionReplayRejection as s, AnthropicContextManagementOptions as t, codeModeToolSurfaceObserver as u, OpenAIApiReasoningEffort as v, isOpenAIGpt6Model as w, isOpenAIGpt54MiniModel as x, OpenAIReasoningEffort as y };