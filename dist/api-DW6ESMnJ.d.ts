import { Fl as ProviderContext, Gt as OpenClawPluginApi, Il as ProviderModel, Ll as ProviderStreamOptions, Zb as ProviderPlugin, xx as ProviderWrapStreamFnContext$1 } from "./config-contracts-hzlacViZ.js";
import { d as ModelProviderConfig, r as OpenClawConfig } from "./types.openclaw-D8uW-XQA.js";
import { f as ModelRequestHeaders, o as Context, p as ModelThinkingLevel, v as SimpleStreamOptions } from "./types-B1zI2CfC.js";
import "./index-DU_vyQtb.js";
import { h as StreamFn } from "./types-Bjy6vVru.js";
import { n as ProviderRequestTransportOverrides } from "./provider-request-config.types-BDimJcpZ.js";
import "./provider-model-types-DGw4ZQp7.js";
import { _ as PinnedDispatcherPolicy } from "./web-media-B8Te5SZ2.js";
import "./provider-model-shared-OQQj5XdR.js";
import { t as resolveProviderHttpRequestConfig } from "./provider-http-BIH03nQe.js";
import "./provider-onboard-BitR1dNE.js";
import "@openclaw/ai";
import "@openclaw/ai/internal/runtime";
import "@openclaw/ai/internal/shared";
import "@openclaw/ai/internal/openai";
import { isGoogleGemini3FlashModel, isGoogleGemini3ProModel, isGoogleGemini3ThinkingLevelModel } from "@openclaw/ai/internal/google-model-family";
import "@openclaw/ai/internal/anthropic";
import { GoogleVideoSlots } from "@openclaw/ai/transports";
import "@openclaw/ai/internal/google";
declare function normalizeGooglePreviewModelId(id: string): string;
declare function normalizeAntigravityPreviewModelId(id: string): string;
declare function parseGeminiAuth(apiKey: string): {
  headers: Record<string, string>;
};
type GoogleResearchAuthContext = {
  api: OpenClawPluginApi;
  agentId: string;
  signal: AbortSignal;
  assertCurrent: () => void;
};
type GoogleResearchHandle = {
  interactionId: string;
  profileId: string;
};
type GoogleResearchInput = {
  action: "describe";
} | {
  action: "start";
  question: string;
  output?: string;
  asOf?: string;
  profileId: string;
} | {
  action: "poll" | "cancel";
  handle: GoogleResearchHandle;
};
type GoogleResearchContext = GoogleResearchAuthContext & {
  /** Provider owner binds the selected credential before any HTTP effect. */
  prepareAccount: (identity: string) => Promise<void>;
  /** Record an accepted native handle before normalizing or publishing its report. */
  recordReceipt: (handle: GoogleResearchHandle) => Promise<void>;
};
type GoogleResearchCitation = {
  url: string;
  title?: string;
  /** UTF-8 byte offsets into report, not JavaScript string indices or source excerpts. */
  startByte?: number;
  endByte?: number;
};
type GoogleResearchSnapshot = {
  state: "running" | "completed" | "partial" | "failed" | "cancelled" | "blocked" | "indeterminate";
  handle: GoogleResearchHandle;
  report?: string;
  citations: GoogleResearchCitation[];
  usageTokens?: number;
  reason?: string;
  retryAfterMs?: number;
};
declare const googleResearchDescriptor: {
  version: number;
  kind: string;
  provider: string;
  agent: string;
  authModes: string[];
  citationEvidence: string;
  storageRequired: boolean;
  hardBudgets: {
    model: boolean;
    search: boolean;
    tokens: boolean;
  };
  idempotentStart: boolean;
};
/** No original provider/network error is retained: it may contain credentials or private traces. */
declare class GoogleResearchError extends Error {
  readonly state: "blocked" | "failed" | "indeterminate";
  readonly handle?: GoogleResearchHandle | undefined;
  readonly retryAfterMs?: number | undefined;
  readonly httpStatus?: number | undefined;
  constructor(message: string, state: "blocked" | "failed" | "indeterminate", handle?: GoogleResearchHandle | undefined, retryAfterMs?: number | undefined, httpStatus?: number | undefined);
}
declare function executeGoogleResearch(input: GoogleResearchInput, context: GoogleResearchContext): Promise<typeof googleResearchDescriptor | GoogleResearchSnapshot>;
declare const GOOGLE_GEMINI_DEFAULT_MODEL = "google/gemini-4-argon";
declare function applyGoogleGeminiModelDefault(cfg: OpenClawConfig): {
  next: OpenClawConfig;
  changed: boolean;
};
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
type GoogleThinkingLevel = "MINIMAL" | "LOW" | "MEDIUM" | "HIGH";
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
type GoogleThinkingInputLevel = ModelThinkingLevel | "adaptive";
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
declare function isGoogleThinkingRequiredModel(modelId: string): boolean;
/**
 * Maps legacy numeric/semantic thinking input onto Gemini 3 and 4's provider enum.
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
type ProviderWrapStreamFnContext = ProviderWrapStreamFnContext$1;
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
declare function createGoogleThinkingPayloadWrapper(baseStreamFn: StreamFn | undefined, thinkingLevel?: GoogleThinkingInputLevel): StreamFn;
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
declare function createGoogleThinkingStreamWrapper(ctx: ProviderWrapStreamFnContext): NonNullable<ProviderWrapStreamFnContext["streamFn"]>;
type CanonicalGoogleTransportApi = "google-generative-ai" | "google-vertex";
type GoogleTransportApi = CanonicalGoogleTransportApi | "openclaw-google-generative-ai-transport";
type GoogleTransportModel = ProviderModel<GoogleTransportApi> & {
  headers?: ModelRequestHeaders;
  provider: string;
};
type GoogleTransportOptions = SimpleStreamOptions & ProviderStreamOptions & {
  cachedContent?: string;
  topP?: number;
  seed?: number;
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
declare function buildGoogleGenerativeAiParams(model: GoogleTransportModel, context: Context | ProviderContext, options?: GoogleTransportOptions, videoSlots?: GoogleVideoSlots): GoogleGenerateContentRequest;
declare function createGoogleGenerativeAiTransportStreamFn(): StreamFn;
declare const DEFAULT_GOOGLE_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
declare function isGoogleVertexHostname(hostname: string): boolean;
declare function isGoogleVertexBaseUrl(baseUrl?: string | null): boolean;
declare function normalizeGoogleApiBaseUrl(baseUrl?: string): string;
declare function isGoogleGenerativeAiApi(api?: string | null): boolean;
declare function normalizeGoogleGenerativeAiBaseUrl(baseUrl?: string): string | undefined;
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
declare function buildGoogleGeminiCliProvider(): ProviderPlugin;
declare function buildGoogleProvider(): ProviderPlugin;
declare function resolveGoogleGenerativeAiHttpRequestConfig(params: {
  apiKey: string;
  baseUrl?: string;
  headers?: Parameters<typeof resolveProviderHttpRequestConfig>[0]["headers"];
  request?: ProviderRequestTransportOverrides & {
    allowPrivateNetwork?: boolean;
  };
  capability: "image" | "audio" | "video" | "other";
  transport: "http" | "media-understanding";
}): {
  baseUrl: string;
  allowPrivateNetwork: boolean;
  headers: Headers;
  dispatcherPolicy?: PinnedDispatcherPolicy;
};
export { GoogleResearchContext as A, sanitizeGoogleThinkingPayload as C, isGoogleGemini3ThinkingLevelModel as D, isGoogleGemini3ProModel as E, parseGeminiAuth as F, normalizeAntigravityPreviewModelId as I, normalizeGooglePreviewModelId as L, GoogleResearchHandle as M, GoogleResearchSnapshot as N, GOOGLE_GEMINI_DEFAULT_MODEL as O, executeGoogleResearch as P, resolveGoogleGemini3ThinkingLevel as S, isGoogleGemini3FlashModel as T, createGoogleThinkingPayloadWrapper as _, resolveGoogleGenerativeAiApiOrigin as a, GoogleThinkingLevel as b, shouldNormalizeGoogleProviderConfig as c, isGoogleVertexBaseUrl as d, isGoogleVertexHostname as f, createGoogleGenerativeAiTransportStreamFn as g, buildGoogleGenerativeAiParams as h, normalizeGoogleProviderConfig as i, GoogleResearchError as j, applyGoogleGeminiModelDefault as k, DEFAULT_GOOGLE_API_BASE_URL as l, normalizeGoogleGenerativeAiBaseUrl as m, buildGoogleProvider as n, resolveGoogleGenerativeAiTransport as o, normalizeGoogleApiBaseUrl as p, buildGoogleGeminiCliProvider as r, shouldNormalizeGoogleGenerativeAiProviderConfig as s, resolveGoogleGenerativeAiHttpRequestConfig as t, isGoogleGenerativeAiApi as u, createGoogleThinkingStreamWrapper as v, stripInvalidGoogleThinkingBudget as w, isGoogleThinkingRequiredModel as x, GoogleThinkingInputLevel as y };