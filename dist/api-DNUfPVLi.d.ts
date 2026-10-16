import { co as ModelProviderConfig, go as Context, ra as StreamFn, ro as OpenClawConfig, xo as SimpleStreamOptions, ya as ProviderRequestTransportOverrides } from "./agent-scope-Dajnzfj6.js";
import { a as ProviderStreamOptions, c as ProviderPlugin, f as PinnedDispatcherPolicy, i as ProviderModel, l as ProviderWrapStreamFnContext$1, o as VideoContent, r as ProviderContext } from "./channel-core-Dw23qZdV.js";
import "./provider-model-shared-bEafUrqd.js";
import "@openclaw/ai/internal/runtime";
import "@openclaw/ai/internal/shared";
import { isGoogleGemini3FlashModel, isGoogleGemini3ProModel, isGoogleGemini3ThinkingLevelModel } from "@openclaw/ai/internal/google-model-family";
import "@openclaw/ai/internal/anthropic";
import "@openclaw/ai/transports";
//#region packages/model-catalog-core/src/provider-model-id-normalize.d.ts
declare function normalizeGooglePreviewModelId(id: string): string;
declare function normalizeAntigravityPreviewModelId(id: string): string;
//#endregion
//#region extensions/google/gemini-auth.d.ts
declare function parseGeminiAuth(apiKey: string): {
  headers: Record<string, string>;
};
//#endregion
//#region extensions/google/onboard.d.ts
declare const GOOGLE_GEMINI_DEFAULT_MODEL = "google/gemini-3.1-pro-preview";
declare function applyGoogleGeminiModelDefault(cfg: OpenClawConfig): {
  next: OpenClawConfig;
  changed: boolean;
};
//#endregion
//#region src/llm/providers/stream-wrappers/google-thinking-payload.d.ts
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
type GoogleThinkingLevel = "MINIMAL" | "LOW" | "MEDIUM" | "HIGH";
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
type GoogleThinkingInputLevel = "off" | "minimal" | "low" | "medium" | "adaptive" | "high" | "max" | "xhigh";
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
declare function isGoogleThinkingRequiredModel(modelId: string): boolean;
/**
 * Maps legacy numeric/semantic thinking input onto Gemini 3's provider enum.
 * @deprecated Google provider-owned stream helper; do not use from third-party plugins.
 */
declare function resolveGoogleGemini3ThinkingLevel(params: {
  modelId?: string;
  thinkingLevel?: GoogleThinkingInputLevel;
  thinkingBudget?: number;
}): GoogleThinkingLevel | undefined;
/**
 * Removes `thinkingBudget=0` only for Gemini models that reject disabled thinking.
 * @deprecated Google provider-owned stream helper; do not use from third-party plugins.
 */
declare function stripInvalidGoogleThinkingBudget(params: {
  thinkingConfig: Record<string, unknown>;
  modelId?: string;
}): boolean;
/**
 * Normalizes Google thinking config across SDK payload shapes before provider transport.
 * @deprecated Google provider-owned stream helper; do not use from third-party plugins.
 */
declare function sanitizeGoogleThinkingPayload(params: {
  payload: unknown;
  modelId?: string;
  thinkingLevel?: GoogleThinkingInputLevel;
}): void;
//#endregion
//#region src/plugin-sdk/provider-stream-shared.d.ts
type ProviderWrapStreamFnContext = ProviderWrapStreamFnContext$1;
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
declare function createGoogleThinkingPayloadWrapper(baseStreamFn: StreamFn | undefined, thinkingLevel?: GoogleThinkingInputLevel): StreamFn;
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
declare function createGoogleThinkingStreamWrapper(ctx: ProviderWrapStreamFnContext): NonNullable<ProviderWrapStreamFnContext["streamFn"]>;
//#endregion
//#region extensions/google/transport-stream.d.ts
type CanonicalGoogleTransportApi = "google-generative-ai" | "google-vertex";
type GoogleTransportApi = CanonicalGoogleTransportApi | "openclaw-google-generative-ai-transport";
type GoogleTransportModel = ProviderModel<GoogleTransportApi> & {
  headers?: Record<string, string>;
  provider: string;
};
type GoogleTransportOptions = SimpleStreamOptions & ProviderStreamOptions & {
  cachedContent?: string;
  toolChoice?: "auto" | "none" | "any" | "required" | {
    type: "function";
    function: {
      name: string;
    };
  };
  thinking?: {
    enabled: boolean;
    budgetTokens?: number;
    level?: GoogleThinkingLevel;
  };
};
type GoogleGenerateContentRequest = {
  cachedContent?: string;
  contents: Array<Record<string, unknown>>;
  generationConfig?: Record<string, unknown>;
  systemInstruction?: Record<string, unknown>;
  tools?: Array<Record<string, unknown>>;
  toolConfig?: Record<string, unknown>;
};
type GoogleVideoSlots = Map<Record<string, unknown>, VideoContent>;
declare function buildGoogleGenerativeAiParams(model: GoogleTransportModel, context: Context | ProviderContext, options?: GoogleTransportOptions, videoSlots?: GoogleVideoSlots): GoogleGenerateContentRequest;
declare function createGoogleGenerativeAiTransportStreamFn(): StreamFn;
//#endregion
//#region extensions/google/src/google-api-base-url.d.ts
declare const DEFAULT_GOOGLE_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
declare function isGoogleVertexHostname(hostname: string): boolean;
declare function isGoogleVertexBaseUrl(baseUrl?: string | null): boolean;
declare function normalizeGoogleApiBaseUrl(baseUrl?: string): string;
declare function isGoogleGenerativeAiApi(api?: string | null): boolean;
declare function normalizeGoogleGenerativeAiBaseUrl(baseUrl?: string): string | undefined;
//#endregion
//#region extensions/google/provider-policy.d.ts
type GoogleApiCarrier = {
  api?: string | null;
};
type GoogleProviderConfigLike = GoogleApiCarrier & {
  baseUrl?: string | null;
  models?: ReadonlyArray<GoogleApiCarrier | null | undefined> | null;
};
declare function resolveGoogleGenerativeAiTransport<TApi extends string | null | undefined>(params: {
  provider?: string;
  api: TApi;
  baseUrl?: string;
}): {
  api: TApi | "google-generative-ai" | "google-vertex";
  baseUrl?: string;
};
declare function resolveGoogleGenerativeAiApiOrigin(baseUrl?: string): string;
declare function shouldNormalizeGoogleGenerativeAiProviderConfig(providerKey: string, provider: GoogleProviderConfigLike): boolean;
declare function shouldNormalizeGoogleProviderConfig(providerKey: string, provider: GoogleProviderConfigLike): boolean;
declare function normalizeGoogleProviderConfig(providerKey: string, provider: ModelProviderConfig): ModelProviderConfig;
//#endregion
//#region extensions/google/gemini-cli-provider.d.ts
declare function buildGoogleGeminiCliProvider(): ProviderPlugin;
//#endregion
//#region extensions/google/provider-registration.d.ts
declare function buildGoogleProvider(): ProviderPlugin;
//#endregion
//#region extensions/google/http-request.d.ts
type GoogleGenerativeAiRequestOverrides = ProviderRequestTransportOverrides & {
  allowPrivateNetwork?: boolean;
};
declare function resolveGoogleGenerativeAiHttpRequestConfig(params: {
  apiKey: string;
  baseUrl?: string;
  headers?: Record<string, string>;
  request?: GoogleGenerativeAiRequestOverrides;
  capability: "image" | "audio" | "video";
  transport: "http" | "media-understanding";
}): {
  baseUrl: string;
  allowPrivateNetwork: boolean;
  headers: Headers;
  dispatcherPolicy?: PinnedDispatcherPolicy;
};
//#endregion
export { parseGeminiAuth as A, sanitizeGoogleThinkingPayload as C, isGoogleGemini3ThinkingLevelModel as D, isGoogleGemini3ProModel as E, normalizeGooglePreviewModelId as M, GOOGLE_GEMINI_DEFAULT_MODEL as O, resolveGoogleGemini3ThinkingLevel as S, isGoogleGemini3FlashModel as T, createGoogleThinkingPayloadWrapper as _, resolveGoogleGenerativeAiApiOrigin as a, GoogleThinkingLevel as b, shouldNormalizeGoogleProviderConfig as c, isGoogleVertexBaseUrl as d, isGoogleVertexHostname as f, createGoogleGenerativeAiTransportStreamFn as g, buildGoogleGenerativeAiParams as h, normalizeGoogleProviderConfig as i, normalizeAntigravityPreviewModelId as j, applyGoogleGeminiModelDefault as k, DEFAULT_GOOGLE_API_BASE_URL as l, normalizeGoogleGenerativeAiBaseUrl as m, buildGoogleProvider as n, resolveGoogleGenerativeAiTransport as o, normalizeGoogleApiBaseUrl as p, buildGoogleGeminiCliProvider as r, shouldNormalizeGoogleGenerativeAiProviderConfig as s, resolveGoogleGenerativeAiHttpRequestConfig as t, isGoogleGenerativeAiApi as u, createGoogleThinkingStreamWrapper as v, stripInvalidGoogleThinkingBudget as w, isGoogleThinkingRequiredModel as x, GoogleThinkingInputLevel as y };