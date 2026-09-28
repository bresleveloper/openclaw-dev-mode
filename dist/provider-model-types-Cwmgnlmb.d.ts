import "./types.openclaw-BGrO5JfP.js";
//#region src/plugin-sdk/provider-model-types.d.ts
/** Private selected-request facts; omission means the host cannot establish applicability. */
type ProviderFastModePolicyContext = {
  provider: string;
  modelId: string;
  api?: string;
  baseUrl?: string;
  authMode?: string;
  runtimeId?: string;
  modelParams?: Record<string, unknown>;
  params?: Record<string, unknown>;
  requestCapabilities: {
    endpointClass: string;
    allowsAnthropicServiceTier: boolean;
  };
};
/** A concrete provider route. Order expresses provider default, never credential precedence. */
type ProviderModelRouteAuthRequirement = "api-key" | "subscription";
type ProviderRouteOverridePresence = "none" | "present";
type ProviderModelRouteRuntimePolicy = {
  /** Agent runtime ids that can reproduce this route without losing transport behavior. */
  compatibleIds: readonly string[];
};
/** Provider-owned default for one resolved inference route; never an authored config setting. */
type ProviderToolSearchPolicyContext = {
  provider: string;
  modelId: string;
  api: string;
  baseUrl?: string;
};
//#endregion
export { ProviderToolSearchPolicyContext as a, ProviderRouteOverridePresence as i, ProviderModelRouteAuthRequirement as n, ProviderModelRouteRuntimePolicy as r, ProviderFastModePolicyContext as t };