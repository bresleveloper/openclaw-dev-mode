import { f as ModelProviderConfig } from "./types.models-Nc1Z-tAz.js";
import { $t as ProviderThinkingProfile, wt as ProviderDefaultThinkingPolicyContext } from "./plugin-entry-DpILbQ7M.js";
//#region extensions/google/provider-policy.d.ts
type GoogleApiCarrier = {
  api?: string | null;
};
type GoogleProviderConfigLike = GoogleApiCarrier & {
  baseUrl?: string | null;
  models?: ReadonlyArray<GoogleApiCarrier | null | undefined> | null;
};
declare const DEFAULT_GOOGLE_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
declare function isGoogleVertexHostname(hostname: string): boolean;
declare function isGoogleVertexBaseUrl(baseUrl?: string | null): boolean;
declare function normalizeGoogleApiBaseUrl(baseUrl?: string): string;
declare function isGoogleGenerativeAiApi(api?: string | null): boolean;
declare function normalizeGoogleGenerativeAiBaseUrl(baseUrl?: string): string | undefined;
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
declare function resolveGoogleThinkingProfile({
  modelId,
  reasoning
}: ProviderDefaultThinkingPolicyContext): ProviderThinkingProfile | undefined;
//#endregion
export { normalizeGoogleApiBaseUrl as a, resolveGoogleGenerativeAiApiOrigin as c, shouldNormalizeGoogleGenerativeAiProviderConfig as d, shouldNormalizeGoogleProviderConfig as f, isGoogleVertexHostname as i, resolveGoogleGenerativeAiTransport as l, isGoogleGenerativeAiApi as n, normalizeGoogleGenerativeAiBaseUrl as o, isGoogleVertexBaseUrl as r, normalizeGoogleProviderConfig as s, DEFAULT_GOOGLE_API_BASE_URL as t, resolveGoogleThinkingProfile as u };