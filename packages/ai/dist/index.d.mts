import { a as resolveClaudeFable5ModelIdentity, c as resolveClaudeNativeThinkingLevelMap, d as supportsClaudeNativeMaxEffort, f as supportsClaudeNativeXhighEffort, i as requiresClaudeMandatoryAdaptiveThinking, l as resolveClaudeSonnet5ModelIdentity, n as CLAUDE_SONNET_5_THINKING_PROFILE, o as resolveClaudeModelIdentity, r as requiresClaudeDefaultSampling, s as resolveClaudeMythos5ModelIdentity, t as CLAUDE_FABLE_5_THINKING_PROFILE, u as supportsClaudeAdaptiveThinking } from "./index-BoTnz8cv.mjs";
import { a as extractDiagnosticError, i as createAssistantMessageDiagnostic, n as DiagnosticErrorInfo, o as formatThrownValue, r as appendAssistantMessageDiagnostic, t as AssistantMessageDiagnostic } from "./diagnostics-BaTA9eVl.mjs";
import { $ as VercelGatewayRouting, A as OpenRouterRouting, B as TextContent, C as KnownImagesProvider, D as ModelThinkingLevel, E as Model, F as SimpleStreamOptions, G as ThinkingLevelMap, H as ThinkingBudgets, I as StopReason, J as ToolResultMessage, K as Tool, L as StreamFn, M as ProviderImagesOptions, N as ProviderResponse, O as OpenAICompletionsCompat, P as ProviderStreamOptions, Q as ValidateToolArgumentsFn, R as StreamFunction, S as KnownImagesApi, T as Message, U as ThinkingContent, V as TextSignatureV1, W as ThinkingLevel, X as Usage, Y as Transport, Z as UserMessage, _ as ImagesOptions, a as AssistantMessageEvent, b as ImagesStopReason, c as CacheRetention, d as ImageContent, f as ImagesApi, g as ImagesModel, h as ImagesInputContent, i as AssistantMessage, j as Provider, k as OpenAIResponsesCompat, l as CompleteSimpleFn, m as ImagesFunction, n as Api, o as AssistantMessageEventStreamContract, p as ImagesContext, q as ToolCall, r as AssistantImages, s as AssistantMessageEventStreamLike, t as AnthropicMessagesCompat, u as Context, v as ImagesOutputContent, w as MaybePromise, x as KnownApi, y as ImagesProvider, z as StreamOptions } from "./types-DRgdPqaZ.mjs";
import { n as EventStream, r as createAssistantMessageEventStream, t as AssistantMessageEventStream } from "./event-stream-0nZeBKl2.mjs";
import { n as validateToolCall, t as validateToolArguments } from "./validation-BDMWOr8d.mjs";
import { a as RegisteredApiProvider, i as ApiStreamSimpleFunction, n as ApiRegistry, o as createApiRegistry, r as ApiStreamFunction, t as ApiProvider } from "./api-registry-BXYnCOIR.mjs";

//#region packages/ai/src/host.d.ts
/** Strict-tool policy inputs for OpenAI-compatible routes. */
interface OpenAIStrictToolSettingOptions {
  transport?: "stream" | "websocket";
  supportsStrictMode?: boolean;
}
/** Narrow host ports consumed by the built-in provider adapters. */
interface AiTransportHost {
  /**
   * Builds a policy-guarded fetch for one model request.
   * Returning undefined keeps the provider SDK's default fetch.
   */
  buildModelFetch(model: Model, timeoutMs?: number, options?: {
    sanitizeSse?: boolean;
  }): typeof fetch | undefined;
  /** Resolves host-owned process-local secret sentinel substrings immediately before egress. */
  resolveSecretSentinel(value: string): string;
  /** Redacts secrets inside structured tool-result payloads. */
  redactSecrets<T>(value: T): T;
  /** Redacts secret-bearing text in tool payload strings. */
  redactToolPayloadText(text: string): string;
  /**
   * Resolves the host strict-tool default for OpenAI-compatible routes.
   * undefined lets the request omit the strict flag entirely.
   */
  resolveOpenAIStrictToolSetting(model: Pick<Model, "provider" | "api" | "baseUrl" | "id"> & {
    compat?: unknown;
  }, options?: OpenAIStrictToolSettingOptions): boolean | undefined;
  /**
   * Emits one transport diagnostic; build runs only when the host logs it and
   * may return null to suppress the entry (e.g. de-duplication).
   */
  logDebug(subsystem: string, build: () => {
    message: string;
    data?: Record<string, unknown>;
  } | null): void;
}
/** Installs host implementations for the transport policy ports. */
declare function configureAiTransportHost(host: Partial<AiTransportHost>): void;
/** Returns the active transport host (inert defaults unless configured). */
declare function getAiTransportHost(): AiTransportHost;
/** Resolves sentinel substrings in custom headers at a no-fetch adapter boundary. */
declare function resolveAiTransportHeaderSentinels(headers: Record<string, string> | undefined): Record<string, string> | undefined;
//#endregion
//#region packages/ai/src/stream.d.ts
/** Creates an isolated LLM runtime backed by the supplied provider registry. */
declare function createLlmRuntime(registry?: ApiRegistry): {
  registry: {
    registerApiProvider: <TApi extends Api, TOptions extends StreamOptions>(provider: ApiProvider<TApi, TOptions>, sourceId?: string) => void;
    getApiProvider: (api: Api) => RegisteredApiProvider | undefined;
    getApiProviders: () => RegisteredApiProvider[];
    unregisterApiProviders: (sourceId: string) => void;
    clearApiProviders: () => void;
  };
  stream: <TApi extends Api>(model: Model<TApi>, context: Context, options?: ProviderStreamOptions) => AssistantMessageEventStreamContract;
  complete: <TApi extends Api>(model: Model<TApi>, context: Context, options?: ProviderStreamOptions) => Promise<AssistantMessage>;
  streamSimple: <TApi extends Api>(model: Model<TApi>, context: Context, options?: SimpleStreamOptions) => AssistantMessageEventStreamContract;
  completeSimple: <TApi extends Api>(model: Model<TApi>, context: Context, options?: SimpleStreamOptions) => Promise<AssistantMessage>;
};
type LlmRuntime = ReturnType<typeof createLlmRuntime>;
//#endregion
export { AiTransportHost, AnthropicMessagesCompat, Api, ApiProvider, ApiRegistry, ApiStreamFunction, ApiStreamSimpleFunction, AssistantImages, AssistantMessage, AssistantMessageDiagnostic, AssistantMessageEvent, AssistantMessageEventStream, AssistantMessageEventStreamContract, AssistantMessageEventStreamLike, CLAUDE_FABLE_5_THINKING_PROFILE, CLAUDE_SONNET_5_THINKING_PROFILE, CacheRetention, CompleteSimpleFn, Context, DiagnosticErrorInfo, EventStream, ImageContent, ImagesApi, ImagesContext, ImagesFunction, ImagesInputContent, ImagesModel, ImagesOptions, ImagesOutputContent, ImagesProvider, ImagesStopReason, KnownApi, KnownImagesApi, KnownImagesProvider, LlmRuntime, MaybePromise, Message, Model, ModelThinkingLevel, OpenAICompletionsCompat, OpenAIResponsesCompat, OpenAIStrictToolSettingOptions, OpenRouterRouting, Provider, ProviderImagesOptions, ProviderResponse, ProviderStreamOptions, RegisteredApiProvider, SimpleStreamOptions, StopReason, StreamFn, StreamFunction, StreamOptions, TextContent, TextSignatureV1, ThinkingBudgets, ThinkingContent, ThinkingLevel, ThinkingLevelMap, Tool, ToolCall, ToolResultMessage, Transport, Usage, UserMessage, ValidateToolArgumentsFn, VercelGatewayRouting, appendAssistantMessageDiagnostic, configureAiTransportHost, createApiRegistry, createAssistantMessageDiagnostic, createAssistantMessageEventStream, createLlmRuntime, extractDiagnosticError, formatThrownValue, getAiTransportHost, requiresClaudeDefaultSampling, requiresClaudeMandatoryAdaptiveThinking, resolveAiTransportHeaderSentinels, resolveClaudeFable5ModelIdentity, resolveClaudeModelIdentity, resolveClaudeMythos5ModelIdentity, resolveClaudeNativeThinkingLevelMap, resolveClaudeSonnet5ModelIdentity, supportsClaudeAdaptiveThinking, supportsClaudeNativeMaxEffort, supportsClaudeNativeXhighEffort, validateToolArguments, validateToolCall };