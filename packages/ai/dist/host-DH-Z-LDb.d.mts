import "./index-C25RT6bP.mjs";
import { O as Model, d as Context, n as Api, q as StreamFn } from "./types-qZFbaDbK.mjs";
import { n as ApiRegistry } from "./api-registry-C2T3lTV7.mjs";
//#region packages/ai/src/host.d.ts
/** Provider capability facts needed by the package-owned transports. */
interface AiProviderRequestCapabilities {
  endpointClass: string;
  knownProviderFamily: string;
  supportsNativeStreamingUsageCompat: boolean;
  supportsOpenAICompletionsStreamingUsageCompat: boolean;
  usesExplicitProxyLikeEndpoint: boolean;
  allowsAnthropicServiceTier: boolean;
}
/** Transport-safe provider policy input kept independent of OpenClaw config types. */
interface AiProviderRequestPolicyInput {
  provider?: string;
  api?: string;
  baseUrl?: string;
  capability?: "llm" | "audio" | "image" | "video" | "other";
  transport?: "stream" | "websocket" | "http" | "media-understanding";
  modelId?: string | null;
  compat?: unknown;
  model?: object;
}
/** Context shared by plugin-owned provider stream hooks. */
interface AiProviderStreamHookContext {
  config?: unknown;
  agentDir?: string;
  workspaceDir?: string;
  provider: string;
  modelId: string;
  model: Model;
  /** Wire-format API before simple completion projects an internal transport alias. */
  sourceApi?: Api;
}
/** Narrow plugin-runtime port used by package-owned transports. */
interface AiTransportPluginHost {
  resolveProviderStream(this: void, params: {
    provider: string;
    config?: unknown;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    allowRuntimePluginLoad?: boolean;
    context: AiProviderStreamHookContext;
  }): StreamFn | undefined;
  resolveTransportTurnState(this: void, params: {
    provider: string;
    modelId?: string | null;
    config?: unknown;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    allowRuntimePluginLoad?: boolean;
    context: {
      provider: string;
      modelId: string;
      model?: Model;
      sessionId?: string;
      turnId: string;
      attempt: number;
      transport: "stream" | "websocket";
    };
  }): {
    headers?: Record<string, string>;
    metadata?: Record<string, string>;
    websocket?: {
      headers?: Record<string, string>;
      degradeCooldownMs?: number;
    };
  } | undefined;
  wrapSimpleCompletionStream(this: void, params: {
    provider: string;
    config?: unknown;
    context: AiProviderStreamHookContext & {
      streamFn: StreamFn;
    };
  }): StreamFn | undefined;
  createAnthropicVertexStream(this: void, model: Pick<Model, "baseUrl">, env?: NodeJS.ProcessEnv): StreamFn;
}
/** Host-owned transcript normalization contract used immediately before provider projection. */
type AiTransformTransportMessages = (messages: Context["messages"], model: Model, normalizeToolCallId?: (id: string, targetModel: Model, source: {
  provider: string;
  api: Api;
  model: string;
}) => string, options?: {
  normalizeSameModelToolCallIds?: boolean;
  preserveCrossModelToolCallThoughtSignature?: boolean;
  preserveUnframedToolResults?: boolean;
}) => Context["messages"];
/** Strict-tool policy inputs for OpenAI-compatible routes. */
interface OpenAIStrictToolSettingOptions {
  transport?: "stream" | "websocket";
  supportsStrictMode?: boolean;
}
type AiInlineTextBlock = {
  type: "text";
  text: string;
};
type AiInlineImageBlock = {
  type: "image";
  data: string;
  mimeType: string;
};
type AiInlineContentBlock = AiInlineTextBlock | AiInlineImageBlock;
type AnthropicInlineContentNormalizer = (content: readonly AiInlineContentBlock[]) => Promise<AiInlineContentBlock[]>;
/** Narrow host ports consumed by the built-in provider adapters. */
interface AiTransportHost {
  /** Retains accepted lifecycle work after its caller observes cancellation. */
  observePendingProviderWork?: (pending: Promise<unknown>) => void;
  /**
   * Builds a policy-guarded fetch for one model request.
   * Returning undefined keeps the provider SDK's default fetch.
   */
  buildModelFetch(model: Model, timeoutMs?: number, options?: {
    sanitizeSse?: boolean;
  }): typeof fetch | undefined;
  /** Resolves host-owned process-local secret sentinel substrings immediately before egress. */
  resolveSecretSentinel(value: string): string;
  /** Resolves visible headers and host-private request overrides before plugin handoff. */
  unwrapModelTransportSentinels?<T extends Model>(model: T, boundary: string): T;
  /** Redacts model-visible tool results without treating ordinary source assignments as secrets. */
  redactModelVisibleSecrets<T>(value: T): T;
  /** Redacts secret-bearing text in tool payload strings. */
  redactToolPayloadText(text: string): string;
  /** Normalizes Anthropic inline image blocks before provider payload construction. */
  normalizeAnthropicInlineContentBlocks?: AnthropicInlineContentNormalizer;
  /**
   * Resolves the host strict-tool default for OpenAI-compatible routes.
   * undefined lets the request omit the strict flag entirely.
   */
  resolveOpenAIStrictToolSetting(model: Pick<Model, "provider" | "api" | "baseUrl" | "id"> & {
    compat?: unknown;
  }, options?: OpenAIStrictToolSettingOptions): boolean | undefined;
  /** Provider-plugin operations required by the generic package transports. */
  plugin: AiTransportPluginHost;
  /** Builds provider-owned Copilot compatibility headers for one message turn. */
  buildCopilotDynamicHeaders(messages: Context["messages"]): Record<string, string>;
  /** Resolves provider capability flags used by payload compatibility policy. */
  resolveProviderRequestCapabilities(input: AiProviderRequestPolicyInput): AiProviderRequestCapabilities;
  /** Merges host-owned provider request headers and attribution policy. */
  resolveProviderRequestHeaders(input: {
    provider?: string;
    api?: string;
    baseUrl?: string;
    providerHeaders?: Record<string, string>;
    callerHeaders?: Record<string, string>;
    precedence?: "caller-wins" | "defaults-win";
    model?: object;
  }): Record<string, string> | undefined;
  /** Returns the host-configured request timeout attached to a model. */
  resolveModelRequestTimeoutMs(model: Model): number | undefined;
  /** Reports whether the model carries host-managed proxy, TLS, or local-service state. */
  requiresManagedTransport(model: Model): boolean;
  /** Copies host-owned managed-transport state onto a projected model. */
  inheritManagedTransport(source: Model, target: Model): Model;
  /** Applies host-owned transcript replay and pairing rules. */
  transformTransportMessages: AiTransformTransportMessages;
  /** Registers a custom transport API with the host's stream error bridge. */
  registerCustomApi(registry: ApiRegistry, api: Api, streamFn: StreamFn): boolean;
  /**
   * Emits one transport diagnostic; build runs only when the host logs it and
   * may return null to suppress the entry (e.g. de-duplication).
   */
  logDebug(subsystem: string, build: () => {
    message: string;
    data?: Record<string, unknown>;
  } | null): void;
  /** Emits an informational transport diagnostic through the host logger. */
  logInfo(subsystem: string, message: string, data?: Record<string, unknown>): void;
  /** Emits a warning through the host logger. */
  logWarn(subsystem: string, message: string, data?: Record<string, unknown>): void;
}
type ActiveAiTransportHost = Omit<AiTransportHost, "normalizeAnthropicInlineContentBlocks"> & {
  normalizeAnthropicInlineContentBlocks: AnthropicInlineContentNormalizer;
};
/** Installs host implementations for the transport policy ports. */
declare function configureAiTransportHost(host: Partial<AiTransportHost>): void;
/** Returns the active transport host (inert defaults unless configured). */
declare function getAiTransportHost(): ActiveAiTransportHost;
/** Resolves sentinel substrings in custom headers at a no-fetch adapter boundary. */
declare function resolveAiTransportHeaderSentinels(headers: Record<string, string> | undefined): Record<string, string> | undefined;
//#endregion
export { AiProviderRequestPolicyInput as a, AiTransportHost as c, configureAiTransportHost as d, getAiTransportHost as f, AiProviderRequestCapabilities as i, AiTransportPluginHost as l, AiInlineImageBlock as n, AiProviderStreamHookContext as o, resolveAiTransportHeaderSentinels as p, AiInlineTextBlock as r, AiTransformTransportMessages as s, AiInlineContentBlock as t, OpenAIStrictToolSettingOptions as u };