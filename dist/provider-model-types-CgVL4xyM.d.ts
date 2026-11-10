import { G as ModelApi } from "./types-D7I_F5Ux.js";
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
type ProviderModelRouteSource = {
  api?: ModelApi | null;
  baseUrl?: unknown;
};
/** A concrete provider route. Order expresses provider default, never credential precedence. */
type ProviderModelRouteAuthRequirement = "api-key" | "subscription";
type ProviderRouteOverridePresence = "none" | "present";
type ProviderModelRouteRuntimePolicy = {
  /** Agent runtime ids that can reproduce this route without losing transport behavior. */
  compatibleIds: readonly string[];
};
type ProviderResolveModelRoutesContext = {
  provider: string;
  modelId?: string;
  /** Effective secret-free request behavior for this provider/model pair. */
  requestTransportOverrides?: ProviderRouteOverridePresence;
  configuredModel?: ProviderModelRouteSource;
  configuredProvider?: ProviderModelRouteSource;
  /** Prepared consumer intent; credentials and runtime compatibility remain independently owned. */
  routeIntent?: {
    runtimeId?: string;
    authRequirement?: ProviderModelRouteAuthRequirement;
    source: "explicit" | "inherited";
  };
  /** Environment view; the provider owns interpretation of its variables. */
  env?: Readonly<Record<string, string | undefined>>;
  /** Physical route facts for one logical model; input order is not preference. */
  observedRoutes?: readonly ProviderModelRouteSource[];
};
/** Provider-owned default for one resolved inference route; never an authored config setting. */
type ProviderToolSearchPolicyContext = {
  provider: string;
  modelId: string;
  api: string;
  baseUrl?: string;
};
//#endregion
export { ProviderResolveModelRoutesContext as a, ProviderModelRouteSource as i, ProviderModelRouteAuthRequirement as n, ProviderRouteOverridePresence as o, ProviderModelRouteRuntimePolicy as r, ProviderToolSearchPolicyContext as s, ProviderFastModePolicyContext as t };