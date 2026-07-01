import { i as OpenClawConfig } from "../types.openclaw-DlpCUWMr.js";
import { Tl as PluginWebFetchProviderEntry, jl as WebFetchProviderToolDefinition } from "../types-BVLQjFJF.js";
import { n as RuntimeWebFetchMetadata } from "../command-secret-gateway-d7G7jcmR.js";

//#region src/web-fetch/runtime.d.ts
type ResolveWebFetchDefinitionParams = {
  config?: OpenClawConfig;
  sandboxed?: boolean;
  runtimeWebFetch?: RuntimeWebFetchMetadata;
  providerId?: string;
  preferRuntimeProviders?: boolean;
};
/** Reports whether a web_fetch provider has usable credentials. */
declare function isWebFetchProviderConfigured(params: {
  provider: Pick<PluginWebFetchProviderEntry, "envVars" | "getConfiguredCredentialFallback" | "getConfiguredCredentialValue" | "getCredentialValue" | "requiresCredential">;
  config?: OpenClawConfig;
}): boolean;
/** Lists web_fetch providers available to runtime selection. */
declare function listWebFetchProviders(params?: {
  config?: OpenClawConfig;
}): PluginWebFetchProviderEntry[];
/** Resolves the executable web_fetch provider tool definition. */
declare function resolveWebFetchDefinition(options?: ResolveWebFetchDefinitionParams): {
  provider: PluginWebFetchProviderEntry;
  definition: WebFetchProviderToolDefinition;
} | null;
//#endregion
export { isWebFetchProviderConfigured, listWebFetchProviders, resolveWebFetchDefinition };