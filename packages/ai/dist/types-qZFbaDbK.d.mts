import { TSchema } from "typebox";
//#region packages/llm-core/src/model-data.d.ts
declare const MODEL_DATA_THINKING_FORMATS: readonly ["openai", "openrouter", "deepseek", "together", "qwen", "qwen-chat-template", "zai"];
type ModelDataThinkingFormat = (typeof MODEL_DATA_THINKING_FORMATS)[number];
declare const MODEL_DATA_THINKING_LEVELS: readonly ["off", "minimal", "low", "medium", "high", "xhigh", "max"];
type ModelDataThinkingLevel = (typeof MODEL_DATA_THINKING_LEVELS)[number];
type ModelDataThinkingLevelMap = Partial<Record<ModelDataThinkingLevel, string | null>>;
type ModelDataImageInputConfig = {
  /** Provider-documented maximum encoded image payload size. */
  maxBytes?: number;
  /** Provider-documented maximum accepted input pixels. */
  maxPixels?: number;
  /** Provider-documented maximum accepted width/height in pixels. */
  maxSidePx?: number;
  /** Preferred resize side for the default balanced compression policy. */
  preferredSidePx?: number;
  /** Token accounting style, used as documentation for provider-owned policy. */
  tokenMode?: "tile" | "detail" | "provider";
};
type ModelDataMediaInputConfig = {
  /** Image input limits and accounting hints for this model. */
  image?: ModelDataImageInputConfig;
};
/** Per-million-token rates for separately billed token buckets. */
type ModelDataCostRates = {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
};
type ModelDataRawPricingTier = ModelDataCostRates & {
  /** Half-open prompt-token interval; `[start]` is an open-ended upper tier. */
  range: [number, number] | [number];
};
type ModelRoutingSortConfig = {
  /** The sorting metric: "price", "throughput", "latency". */
  by?: string;
  /** Partitioning strategy: "model" (default) or "none". */
  partition?: string | null;
};
type ModelRoutingMaxPrice = {
  /** Price per million prompt tokens. */
  prompt?: number | string;
  /** Price per million completion tokens. */
  completion?: number | string;
  /** Price per image. */
  image?: number | string;
  /** Price per audio unit. */
  audio?: number | string;
  /** Price per request. */
  request?: number | string;
};
/** Percentile targets in the owning field's throughput or latency units. */
type ModelRoutingPercentiles = {
  p50?: number;
  p75?: number;
  p90?: number;
  p99?: number;
};
//#endregion
//#region packages/llm-core/src/utils/diagnostics.d.ts
interface DiagnosticErrorInfo {
  name?: string;
  message: string;
  stack?: string;
  code?: string | number;
}
interface AssistantMessageDiagnostic {
  type: string;
  timestamp: number;
  error?: DiagnosticErrorInfo;
  details?: Record<string, unknown>;
}
/** True when the provider explicitly refused the request payload. */
declare function isProviderRefusalAssistantError(message: {
  diagnostics?: AssistantMessageDiagnostic[];
} | null | undefined): boolean;
/** Formats arbitrary thrown values into diagnostic-safe text. */
declare function formatThrownValue(value: unknown): string;
/** Extracts serializable diagnostic error fields from Error and non-Error throws. */
declare function extractDiagnosticError(error: unknown): DiagnosticErrorInfo;
/** Creates a timestamped assistant-message diagnostic entry. */
declare function createAssistantMessageDiagnostic(type: string, error: unknown, details?: Record<string, unknown>): AssistantMessageDiagnostic;
/** Appends a diagnostic while preserving existing message diagnostics. */
declare function appendAssistantMessageDiagnostic(message: {
  diagnostics?: AssistantMessageDiagnostic[];
}, diagnostic: AssistantMessageDiagnostic): void;
//#endregion
//#region packages/llm-core/src/types.d.ts
/** Provider API families with first-class request/stream adapters in OpenClaw. */
type KnownApi = "openai-completions" | "mistral-conversations" | "openai-responses" | "azure-openai-responses" | "openai-chatgpt-responses" | "anthropic-messages" | "bedrock-converse-stream" | "google-generative-ai" | "google-vertex";
/** Provider API id; custom providers can use ids outside the built-in set. */
type Api = KnownApi | (string & {});
/** Image-generation API families with first-class adapters in OpenClaw. */
type KnownImagesApi = "openrouter-images";
/** Image API id; custom image providers can use ids outside the built-in set. */
type ImagesApi = KnownImagesApi | (string & {});
/** Provider id used for routing, diagnostics, and config lookups. */
type Provider = string;
/** Image provider ids with first-class adapters in OpenClaw. */
type KnownImagesProvider = "openrouter";
/** Image provider id used for routing, diagnostics, and config lookups. */
type ImagesProvider = string;
/** Normalized reasoning-effort levels shared across provider-specific knobs. */
type ThinkingLevel = Exclude<ModelDataThinkingLevel, "off">;
/** Model thinking setting including explicit disabled state. */
type ModelThinkingLevel = ModelDataThinkingLevel;
/** Provider-specific values for normalized thinking levels. */
type ThinkingLevelMap = ModelDataThinkingLevelMap;
/** Token budgets for each thinking level (token-based providers only) */
interface ThinkingBudgets {
  minimal?: number;
  low?: number;
  medium?: number;
  high?: number;
  max?: number;
}
/** Prompt-cache retention preference shared by providers that expose cache controls. */
type CacheRetention = "none" | "short" | "long";
/** Streaming transport preference for providers that support multiple transports. */
type Transport = "sse" | "websocket" | "websocket-cached" | "auto";
/** Helper for hooks that may be synchronous or asynchronous. */
type MaybePromise<T> = T | Promise<T>;
/** Minimal HTTP response metadata surfaced through provider hooks. */
interface ProviderResponse {
  status: number;
  headers: Record<string, string>;
}
/** Request options shared by text streaming providers. */
interface StreamOptions {
  temperature?: number;
  maxTokens?: number;
  /**
   * Optional JSON Schema for the generated response. Providers that support
   * constrained decoding map it to their native request shape; others ignore it.
   */
  responseFormat?: Record<string, unknown>;
  /**
   * Stop sequences forwarded to providers that support them. Providers map this
   * to their native request field, such as OpenAI `stop` or Anthropic
   * `stop_sequences`.
   */
  stop?: string[];
  signal?: AbortSignal;
  apiKey?: string;
  /**
   * Preferred transport for providers that support multiple transports.
   * Providers that do not support this option ignore it.
   */
  transport?: Transport;
  /**
   * Prompt cache retention preference. Providers map this to their supported values.
   * Default: "short".
   */
  cacheRetention?: CacheRetention;
  /**
   * Optional session identifier for providers that support session-based caching.
   * Providers can use this to enable prompt caching, request routing, or other
   * session-aware features. Ignored by providers that don't support it.
   */
  sessionId?: string;
  /**
   * Opaque per-model-call identifier for provider transport correlation.
   * Providers that do not expose request correlation ignore it.
   */
  requestId?: string;
  /**
   * Optional provider prompt-cache affinity key, distinct from transcript/session identity.
   * Providers that do not support separate cache affinity ignore it.
   */
  promptCacheKey?: string;
  /**
   * Optional callback for inspecting or replacing provider payloads before sending.
   * Return undefined to keep the payload unchanged.
   */
  onPayload?: (payload: unknown, model: Model) => MaybePromise<unknown>;
  /**
   * Optional callback invoked after an HTTP response is received and before
   * its body stream is consumed.
   */
  onResponse?: (response: ProviderResponse, model: Model) => void | Promise<void>;
  /**
   * Observe a live response that accepts user input before generation finishes.
   * `steer` resolves false only when the input was definitely not admitted;
   * admitted input cannot be withdrawn. Providers settle pending submissions
   * before closing the response and call the returned cleanup on closure.
   */
  onActiveResponse?: (control: {
    steer(messages: readonly UserMessage[]): Promise<boolean>;
    /** Read-only after closure: deferred input still needs an explicit continuation request. */
    needsContinuation?: () => boolean;
  }) => (() => void) | void;
  /**
   * The caller can execute completed async calls before generation finishes.
   * Providers advertise async tools only with this host capability; this is
   * independent of parallel execution of an ordinary completed tool batch.
   */
  asyncToolExecution?: boolean;
  /**
   * Optional custom HTTP headers to include in API requests.
   * Merged with provider defaults; can override default headers.
   * Not supported by all providers (e.g., AWS Bedrock uses SDK auth).
   */
  headers?: Record<string, string>;
  /**
   * HTTP request timeout in milliseconds for providers/SDKs that support it.
   * For example, OpenAI and Anthropic SDK clients default to 10 minutes.
   */
  timeoutMs?: number;
  /** @deprecated Ignored by built-in text transports; retries are owned by the host runner. */
  maxRetries?: number;
  /**
   * Maximum delay in milliseconds to wait for a retry when the server requests a long wait.
   * If the server's requested delay exceeds this value, the request fails immediately
   * with an error containing the requested delay, allowing higher-level retry logic
   * to handle it with user visibility.
   * Default: 60000 (60 seconds). Set to 0 to disable the cap.
   */
  maxRetryDelayMs?: number;
  /**
   * Optional metadata to include in API requests.
   * Providers extract the fields they understand and ignore the rest.
   * For example, Anthropic uses `user_id` for abuse tracking and rate limiting.
   */
  metadata?: Record<string, unknown>;
}
type ProviderStreamOptions = StreamOptions & Record<string, unknown>;
/** Request options shared by image-generation providers. */
interface ImagesOptions {
  signal?: AbortSignal;
  apiKey?: string;
  /**
   * Optional callback for inspecting or replacing provider payloads before sending.
   * Return undefined to keep the payload unchanged.
   */
  onPayload?: (payload: unknown, model: ImagesModel) => MaybePromise<unknown>;
  /**
   * Optional callback invoked after an HTTP response is received.
   */
  onResponse?: (response: ProviderResponse, model: ImagesModel) => void | Promise<void>;
  /**
   * Optional custom HTTP headers to include in API requests.
   * Merged with provider defaults; can override default headers.
   */
  headers?: Record<string, string>;
  /**
   * HTTP request timeout in milliseconds for providers/SDKs that support it.
   */
  timeoutMs?: number;
  /**
   * Maximum retry attempts for providers/SDKs that support client-side retries.
   */
  maxRetries?: number;
  /**
   * Maximum delay in milliseconds to wait for a retry when the server requests a long wait.
   * If the server's requested delay exceeds this value, the request fails immediately
   * with an error containing the requested delay, allowing higher-level retry logic
   * to handle it with user visibility.
   * Default: 60000 (60 seconds). Set to 0 to disable the cap.
   */
  maxRetryDelayMs?: number;
  /**
   * Optional metadata to include in API requests.
   * Providers extract the fields they understand and ignore the rest.
   */
  metadata?: Record<string, unknown>;
}
type ProviderImagesOptions = ImagesOptions & Record<string, unknown>;
/** Unified text options used by simple completion helpers. */
interface SimpleStreamOptions extends StreamOptions {
  /** Optional processing tier; only providers supporting these tiers apply it. */
  serviceTier?: "default" | "priority";
  reasoning?: ModelThinkingLevel;
  /** Custom token budgets for thinking levels (token-based providers only) */
  thinkingBudgets?: ThinkingBudgets;
}
type StreamFunction<TApi extends Api = Api, TOptions extends StreamOptions = StreamOptions> = (model: Model<TApi>, context: Context, options?: TOptions) => AssistantMessageEventStreamContract;
type ImagesFunction<TApi extends ImagesApi = ImagesApi, TOptions extends ImagesOptions = ImagesOptions> = (model: ImagesModel<TApi>, context: ImagesContext, options?: TOptions) => Promise<AssistantImages>;
interface TextSignatureV1 {
  v: 1;
  id: string;
  phase?: "commentary" | "final_answer";
}
/** Plain assistant/user text content block. */
interface TextContent {
  type: "text";
  text: string;
  textSignature?: string;
}
/** Provider reasoning/thinking content block, including opaque replay signatures. */
interface ThinkingContent {
  type: "thinking";
  thinking: string;
  thinkingSignature?: string;
  /** When true, the thinking content was redacted by safety filters. The opaque
   *  encrypted payload is stored in `thinkingSignature` so it can be passed back
   *  to the API for multi-turn continuity. */
  redacted?: boolean;
}
/** Opaque provider-owned state that must survive transcript replay without being rendered. */
interface ProviderReplayState {
  v: 1;
  type: string;
  id?: string;
  data: string;
  replayIndex?: number;
  provider: Provider;
  api: Api;
  model: string;
  baseUrlHash?: string;
  sessionHash?: string;
  authProfileHash?: string;
}
/** Base64 image content block with MIME type metadata. */
interface ImageContent {
  type: "image";
  data: string;
  mimeType: string;
}
/** Normalized assistant tool call emitted by providers or repaired from text. */
interface ToolCall {
  /** The provider completed this call and permits generation to continue without its result. */
  async?: true;
  type: "toolCall";
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  thoughtSignature?: string;
  executionMode?: "sequential" | "parallel";
}
/** Normalized token and cost accounting for a provider response. */
interface Usage {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
  /** Whether the provider reported a cache-read/write token split. */
  cacheTelemetry?: {
    state: "available" | "unavailable";
  };
  /** Subset of `cacheWrite` written with 1-hour retention when reported. */
  cacheWrite1h?: number;
  /** Exact context snapshot for the final provider iteration. */
  contextUsage?: {
    state: "available";
    promptTokens: number;
    totalTokens: number;
  } | {
    state: "unavailable";
  };
  totalTokens: number;
  cost: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
    total: number;
    /** Provenance for the recorded total cost; provider-billed totals are authoritative. */
    totalOrigin?: "provider-billed";
  };
}
/** Per-million-token rates for separately billed token buckets. */
type ModelCostRates = ModelDataCostRates;
/** One whole-request tier on the cache-inclusive prompt-token axis. */
type PricingTier = ModelCostRates & {
  /** Half-open prompt-token interval `[start, end)`. */
  range: [number, number];
};
type RawPricingTier = ModelDataRawPricingTier;
/** Normalized pricing used by token accounting and usage summaries. */
type ModelCostConfig = ModelCostRates & {
  tieredPricing?: PricingTier[];
};
type RawModelCostConfig = ModelCostRates & {
  tieredPricing?: RawPricingTier[];
};
/** Normalized assistant stop reasons across text providers. */
type StopReason = "stop" | "length" | "toolUse" | "error" | "aborted";
/** Stable error codes for provider outcomes that cannot be replayed safely. */
declare const PROVIDER_POST_DISPATCH_AMBIGUITY_ERROR_CODE = "PROVIDER_POST_DISPATCH_AMBIGUITY";
declare const PROVIDER_FAILURE_WITH_OUTPUT_ERROR_CODE = "PROVIDER_FAILURE_WITH_OUTPUT";
/** Pre-dispatch argument rejection; callers still enforce output and effect guards. */
declare const MALFORMED_TOOL_CALL_ARGUMENTS_ERROR_CODE = "malformed_tool_call_arguments";
/** User turn in a text-model conversation. */
interface UserMessage {
  role: "user";
  content: string | (TextContent | ImageContent)[];
  timestamp: number;
  /**
   * Marks a user message carrying runtime context. Provider replay policy decides
   * whether the carrier is transient or retained append-only; only retained
   * carriers are stable prompt-cache anchors.
   */
  runtimeContextCarrier?: boolean;
}
/** Assistant turn, including provider identity and final stop state. */
type AssistantDeliveryTtsFacts = {
  tagged: true;
  text?: string;
  directives?: Array<{
    provider?: string;
    values: Record<string, string>;
  }>;
};
interface AssistantMessage {
  role: "assistant";
  content: (TextContent | ThinkingContent | ToolCall)[];
  openclawDelivery?: {
    audioAsVoice?: true;
    /** Exact media directives consumed by the managed-media transcript rewrite owner. */
    mediaUrls?: string[];
    replyToCurrent?: true;
    replyToId?: string;
    /** Provider text phase is unresolved until the assistant turn reaches terminal state. */
    textPhaseRequiresTerminal?: true;
    /** Parsed once at the assistant write boundary; delivery resolves policy from these facts. */
    tts?: AssistantDeliveryTtsFacts;
  };
  api: Api;
  provider: Provider;
  model: string;
  responseModel?: string;
  responseId?: string;
  providerReplay?: ProviderReplayState;
  turnId?: string;
  diagnostics?: AssistantMessageDiagnostic[];
  usage: Usage;
  stopReason: StopReason;
  /** A completed provider response can explicitly request another inference with false. */
  endTurn?: boolean;
  errorMessage?: string;
  errorCode?: string;
  errorType?: string;
  errorBody?: string;
  timestamp: number;
}
/** Tool result turn that answers a prior assistant tool call. */
interface ToolResultMessage<TDetails = unknown> {
  role: "toolResult";
  toolCallId: string;
  toolName: string;
  content: (TextContent | ImageContent)[];
  details?: TDetails;
  isError: boolean;
  timestamp: number;
}
/** Any text-model conversation message supported by LLM core. */
type Message = UserMessage | AssistantMessage | ToolResultMessage;
/** Image request input content accepted by image providers. */
type ImagesInputContent = TextContent | ImageContent;
/** Image response output content returned by image providers. */
type ImagesOutputContent = TextContent | ImageContent;
/** Image-generation request context. */
interface ImagesContext {
  input: ImagesInputContent[];
}
/** Normalized image-generation stop reasons. */
type ImagesStopReason = "stop" | "error" | "aborted";
/** Final image-generation response shape. */
interface AssistantImages {
  api: ImagesApi;
  provider: ImagesProvider;
  model: string;
  output: ImagesOutputContent[];
  responseId?: string;
  usage?: Usage;
  stopReason: ImagesStopReason;
  errorMessage?: string;
  timestamp: number;
}
/** Provider tool declaration with a TypeBox/JSON-schema parameter object. */
interface Tool<TParameters extends TSchema = TSchema> {
  name: string;
  description: string;
  parameters: TParameters;
}
/** Text-model request context shared by provider adapters. */
interface Context {
  systemPrompt?: string;
  messages: Message[];
  tools?: Tool[];
}
/**
 * Event protocol for AssistantMessageEventStream.
 *
 * Streams should emit `start` before partial updates, then terminate with either:
 * - `done` carrying the final successful AssistantMessage, or
 * - `error` carrying the final AssistantMessage with stopReason "error" or "aborted"
 *   and errorMessage.
 */
type AssistantMessageEvent = {
  type: "start";
  partial: AssistantMessage;
} | {
  type: "text_start";
  contentIndex: number;
  partial: AssistantMessage;
} |
/**
 * Plain text deltas may omit `partial` to avoid retaining one full assistant
 * snapshot per token. Consumers that need current text should replay `delta`
 * from the latest start/end partial checkpoint.
 */
{
  type: "text_delta";
  contentIndex: number;
  delta: string;
  partial?: AssistantMessage;
} | {
  type: "text_end";
  contentIndex: number;
  content: string;
  partial: AssistantMessage;
} | {
  type: "thinking_start";
  contentIndex: number;
  partial: AssistantMessage;
} | {
  type: "thinking_delta";
  contentIndex: number;
  delta: string;
  partial: AssistantMessage;
} | {
  type: "thinking_end";
  contentIndex: number;
  content: string;
  partial: AssistantMessage;
} | {
  type: "toolcall_start";
  contentIndex: number;
  partial: AssistantMessage;
} | {
  type: "toolcall_delta";
  contentIndex: number;
  delta: string;
  partial: AssistantMessage;
} | {
  type: "toolcall_end";
  contentIndex: number;
  toolCall: ToolCall;
  partial: AssistantMessage;
} | {
  type: "done";
  reason: Extract<StopReason, "stop" | "length" | "toolUse">;
  message: AssistantMessage;
} | {
  type: "error";
  reason: Extract<StopReason, "aborted" | "error">;
  error: AssistantMessage;
};
interface AssistantMessageEventStreamContract extends AsyncIterable<AssistantMessageEvent> {
  /** Queue one stream event for consumers. */
  push(event: AssistantMessageEvent): void;
  /** Complete the stream and optionally resolve the final message. */
  end(result?: AssistantMessage): void;
  /** Final assistant message produced by the stream. */
  result(): Promise<AssistantMessage>;
}
/** Read-only stream contract accepted by consumers that do not need to push events. */
interface AssistantMessageEventStreamLike extends AsyncIterable<AssistantMessageEvent> {
  result(): Promise<AssistantMessage>;
}
/**
 * Compatibility settings for OpenAI-compatible completions APIs.
 * Use this to override URL-based auto-detection for custom providers.
 */
interface OpenAICompletionsCompat {
  /** Whether the provider supports the `store` field. Default: auto-detected from URL. */
  supportsStore?: boolean;
  /** Whether the provider supports the `developer` role (vs `system`). Default: auto-detected from URL. */
  supportsDeveloperRole?: boolean;
  /** Whether the provider supports `reasoning_effort`. Default: auto-detected from URL. */
  supportsReasoningEffort?: boolean;
  /** Provider-native reasoning efforts accepted by the model. Overrides known model defaults. */
  supportedReasoningEfforts?: string[];
  /** Per-level reasoning effort overrides, e.g. map "off" to "low" for models that cannot disable thinking. */
  reasoningEffortMap?: Record<string, string>;
  /** Whether the provider supports `stream_options: { include_usage: true }` for token usage in streaming responses. Default: true. */
  supportsUsageInStreaming?: boolean;
  /** Which field to use for max tokens. Default: auto-detected from URL. */
  maxTokensField?: "max_completion_tokens" | "max_tokens";
  /** Whether tool results require the `name` field. Default: auto-detected from URL. */
  requiresToolResultName?: boolean;
  /** Whether a user message after tool results requires an assistant message in between. Default: auto-detected from URL. */
  requiresAssistantAfterToolResult?: boolean;
  /** Whether thinking blocks must be converted to text blocks with <thinking> delimiters. Default: auto-detected from URL. */
  requiresThinkingAsText?: boolean;
  /** Whether all replayed assistant messages must include an empty reasoning_content field when reasoning is enabled. Default: auto-detected from URL. */
  requiresReasoningContentOnAssistantMessages?: boolean;
  /** Format for reasoning/thinking parameter. "openai" uses reasoning_effort, "openrouter" uses reasoning: { effort }, "deepseek" uses thinking: { type } plus reasoning_effort, "together" uses reasoning: { enabled } plus reasoning_effort when supported, "zai" uses top-level enable_thinking: boolean, "qwen" uses top-level enable_thinking: boolean, and "qwen-chat-template" uses chat_template_kwargs.enable_thinking. Default: "openai". */
  thinkingFormat?: ModelDataThinkingFormat;
  /** OpenRouter-specific routing preferences. Only used when baseUrl points to OpenRouter. */
  openRouterRouting?: OpenRouterRouting;
  /** Vercel AI Gateway routing preferences. Only used when baseUrl points to Vercel AI Gateway. */
  vercelGatewayRouting?: VercelGatewayRouting;
  /** Whether z.ai supports top-level `tool_stream: true` for streaming tool call deltas. Default: false. */
  zaiToolStream?: boolean;
  /** Whether the provider supports the `strict` field in tool definitions. Default: true. */
  supportsStrictMode?: boolean;
  /** Whether the provider supports JSON Schema through `response_format`. Default: false for unknown compatible endpoints. */
  supportsJsonSchemaResponseFormat?: boolean;
  /** Cache control convention for prompt caching. "anthropic" applies Anthropic-style `cache_control` markers to the system prompt, last tool definition, and last user/assistant text content. */
  cacheControlFormat?: "anthropic";
  /** Whether to send known session-affinity headers (`session_id`, `x-client-request-id`, `x-session-affinity`) from `options.sessionId` when caching is enabled. Default: false. */
  sendSessionAffinityHeaders?: boolean;
  /** Whether the provider supports OpenAI-style `prompt_cache_key`. Default: false for third-party completions providers. */
  supportsPromptCacheKey?: boolean;
  /** Whether the provider supports long prompt cache retention (`prompt_cache_retention: "24h"` or Anthropic-style `cache_control.ttl: "1h"`, depending on format). Default: true. */
  supportsLongCacheRetention?: boolean;
}
/** Compatibility settings for OpenAI Responses APIs. */
interface OpenAIResponsesCompat {
  /** Whether a compatible provider accepts the `strict` tool field. Default: auto-detected from the endpoint. */
  supportsStrictMode?: boolean;
  /** Whether the provider supports the `developer` role (vs `system`). Default: true. */
  supportsDeveloperRole?: boolean;
  /** Whether to send reasoning effort settings. Defaults to the model's known capabilities. */
  supportsReasoningEffort?: boolean;
  /** Provider-native reasoning efforts accepted by the model. Overrides known model defaults. */
  supportedReasoningEfforts?: string[];
  /** Per-level reasoning effort overrides, e.g. map "off" to "low" for models that cannot disable thinking. */
  reasoningEffortMap?: Record<string, string>;
  /** Whether the model accepts the `temperature` parameter. Default: true. */
  supportsTemperature?: boolean;
  /** Whether to send the OpenAI `session_id` cache-affinity header from `options.sessionId` when caching is enabled. Default: true. */
  sendSessionIdHeader?: boolean;
  /** Whether the provider supports `prompt_cache_retention: "24h"`. Default: true. */
  supportsLongCacheRetention?: boolean;
  /** Whether the provider honors top-level `instructions`. Defaults to true only for verified native routes (OpenAI, xAI); every other route defaults to false and embeds the system prompt in `input` unless set true here after verifying against that endpoint. */
  supportsInstructions?: boolean;
  /**
   * Explicit opt-in for HTTP continuation (client-side delta + `previous_response_id`)
   * on a custom/proxy OpenAI-Responses-compatible endpoint. A native `api.openai.com`
   * connection is eligible by default; a custom endpoint carries no trust signal of
   * its own, so this is the only path to eligibility there — set it once you've
   * verified the backend correctly resolves `previous_response_id` and persists
   * `store: true` turns. Default: false.
   */
  supportsResponsesContinuation?: boolean;
}
/** Compatibility settings for Anthropic Messages-compatible APIs. */
interface AnthropicMessagesCompat {
  /**
   * Whether the provider accepts per-tool `eager_input_streaming`.
   * When false, the Anthropic provider omits `tools[].eager_input_streaming`
   * and sends the legacy `fine-grained-tool-streaming-2025-05-14` beta header
   * for tool-enabled requests.
   * Default: true.
   */
  supportsEagerToolInputStreaming?: boolean;
  /** Whether the provider supports Anthropic long cache retention (`cache_control.ttl: "1h"`). Default: true. */
  supportsLongCacheRetention?: boolean;
  /**
   * Whether to send the `x-session-affinity` header from `options.sessionId`
   * when caching is enabled. Required for providers like Fireworks that use
   * session affinity for prompt cache routing (requests to the same replica
   * maximize cache hits).
   * Default: false.
   */
  sendSessionAffinityHeaders?: boolean;
  /**
   * Whether the provider supports Anthropic-style `cache_control` markers on
   * tool definitions. When false, `cache_control` is omitted from tool params.
   * Some Anthropic-compatible providers (e.g., Fireworks) do not support this
   * field on tools and may reject or ignore it.
   * Default: true.
   */
  supportsCacheControlOnTools?: boolean;
  /** Whether empty thinking signatures can be replayed as native thinking blocks. Default: false. */
  allowEmptySignature?: boolean;
}
/**
 * OpenRouter provider routing preferences.
 * Controls which upstream providers OpenRouter routes requests to.
 * Sent as the `provider` field in the OpenRouter API request body.
 * Own member declarations preserve existing module-augmentation semantics.
 * @see https://openrouter.ai/docs/guides/routing/provider-selection
 */
interface OpenRouterRouting {
  /** Whether to allow backup providers to serve requests. Default: true. */
  allow_fallbacks?: boolean;
  /** Whether to filter providers to only those that support all parameters in the request. Default: false. */
  require_parameters?: boolean;
  /** Data collection setting. "allow" (default): allow providers that may store/train on data. "deny": only use providers that don't collect user data. */
  data_collection?: "deny" | "allow";
  /** Whether to restrict routing to only ZDR (Zero Data Retention) endpoints. */
  zdr?: boolean;
  /** Whether to restrict routing to only models that allow text distillation. */
  enforce_distillable_text?: boolean;
  /** An ordered list of provider names/slugs to try in sequence, falling back to the next if unavailable. */
  order?: string[];
  /** List of provider names/slugs to exclusively allow for this request. */
  only?: string[];
  /** List of provider names/slugs to skip for this request. */
  ignore?: string[];
  /** A list of quantization levels to filter providers by (e.g., ["fp16", "bf16", "fp8", "fp6", "int8", "int4", "fp4", "fp32"]). */
  quantizations?: string[];
  /** Sorting strategy. Can be a string (e.g., "price", "throughput", "latency") or an object with `by` and `partition`. */
  sort?: string | ModelRoutingSortConfig;
  /** Maximum price per million tokens (USD). */
  max_price?: ModelRoutingMaxPrice;
  /** Preferred minimum throughput (tokens/second). Can be a number (applies to p50) or an object with percentile-specific cutoffs. */
  preferred_min_throughput?: number | ModelRoutingPercentiles;
  /** Preferred maximum latency (seconds). Can be a number (applies to p50) or an object with percentile-specific cutoffs. */
  preferred_max_latency?: number | ModelRoutingPercentiles;
}
/**
 * Vercel AI Gateway routing preferences.
 * Controls which upstream providers the gateway routes requests to.
 * @see https://vercel.com/docs/ai-gateway/models-and-providers/provider-options
 */
interface VercelGatewayRouting {
  /** List of provider slugs to exclusively use for this request (e.g., ["bedrock", "anthropic"]). */
  only?: string[];
  /** List of provider slugs to try in order (e.g., ["anthropic", "openai"]). */
  order?: string[];
}
interface Model<TApi extends Api = Api> {
  id: string;
  name: string;
  api: TApi;
  provider: Provider;
  baseUrl: string;
  reasoning: boolean;
  /**
   * Maps OpenClaw thinking levels to provider/model-specific values.
   * Missing keys use provider defaults. null marks a level as unsupported.
   */
  thinkingLevelMap?: ThinkingLevelMap;
  input: ("text" | "image")[];
  cost: RawModelCostConfig;
  contextWindow?: number;
  /**
   * Optional effective runtime cap used for compaction/session budgeting.
   * Keeps provider/native contextWindow metadata intact while allowing a
   * smaller practical window.
   */
  contextTokens?: number;
  maxTokens: number;
  /** Provider-specific request/runtime parameters passed through to provider plugins. */
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  /** Sends runtime credentials as Authorization: Bearer instead of provider-specific key headers. */
  authHeader?: boolean;
  /** Compatibility overrides for OpenAI-compatible APIs. If not set, auto-detected from baseUrl. */
  compat?: TApi extends "openai-completions" ? OpenAICompletionsCompat : TApi extends "openai-responses" | "azure-openai-responses" | "openai-chatgpt-responses" | "openai-codex-responses" ? OpenAIResponsesCompat : TApi extends "anthropic-messages" ? AnthropicMessagesCompat : never;
  /** Provider-documented media input limits used by attachment preprocessing. */
  mediaInput?: ModelDataMediaInputConfig;
}
interface ImagesModel<TApi extends ImagesApi = ImagesApi> extends Omit<Model, "api" | "provider" | "reasoning" | "contextWindow" | "maxTokens" | "compat"> {
  api: TApi;
  provider: ImagesProvider;
  output: ("text" | "image")[];
}
type StreamFn = (model: Model, context: Context, options?: SimpleStreamOptions) => AssistantMessageEventStreamLike | Promise<AssistantMessageEventStreamLike>;
type CompleteSimpleFn = (model: Model, context: Pick<Context, "systemPrompt" | "messages">, options?: SimpleStreamOptions) => Promise<AssistantMessage>;
type ValidateToolArgumentsFn = (tool: Tool, toolCall: ToolCall) => unknown;
//#endregion
export { ThinkingContent as $, ModelCostRates as A, ProviderReplayState as B, KnownImagesApi as C, Message as D, MaybePromise as E, PROVIDER_FAILURE_WITH_OUTPUT_ERROR_CODE as F, SimpleStreamOptions as G, ProviderStreamOptions as H, PROVIDER_POST_DISPATCH_AMBIGUITY_ERROR_CODE as I, StreamFunction as J, StopReason as K, PricingTier as L, OpenAICompletionsCompat as M, OpenAIResponsesCompat as N, Model as O, OpenRouterRouting as P, ThinkingBudgets as Q, Provider as R, KnownApi as S, MALFORMED_TOOL_CALL_ARGUMENTS_ERROR_CODE as T, RawModelCostConfig as U, ProviderResponse as V, RawPricingTier as W, TextContent as X, StreamOptions as Y, TextSignatureV1 as Z, ImagesModel as _, ModelDataThinkingFormat as _t, AssistantMessage as a, Transport as at, ImagesProvider as b, AssistantMessageEventStreamLike as c, ValidateToolArgumentsFn as ct, Context as d, DiagnosticErrorInfo as dt, ThinkingLevel as et, ImageContent as f, appendAssistantMessageDiagnostic as ft, ImagesInputContent as g, isProviderRefusalAssistantError as gt, ImagesFunction as h, formatThrownValue as ht, AssistantImages as i, ToolResultMessage as it, ModelThinkingLevel as j, ModelCostConfig as k, CacheRetention as l, VercelGatewayRouting as lt, ImagesContext as m, extractDiagnosticError as mt, Api as n, Tool as nt, AssistantMessageEvent as o, Usage as ot, ImagesApi as p, createAssistantMessageDiagnostic as pt, StreamFn as q, AssistantDeliveryTtsFacts as r, ToolCall as rt, AssistantMessageEventStreamContract as s, UserMessage as st, AnthropicMessagesCompat as t, ThinkingLevelMap as tt, CompleteSimpleFn as u, AssistantMessageDiagnostic as ut, ImagesOptions as v, KnownImagesProvider as w, ImagesStopReason as x, ImagesOutputContent as y, ProviderImagesOptions as z };