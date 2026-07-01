import type { ModelProviderConfig } from "../config/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type PluginManifestRegistry } from "./manifest-registry.js";
import type { ProviderApplyConfigDefaultsContext, ProviderNormalizeConfigContext, ProviderResolveConfigApiKeyContext } from "./provider-config-context.types.js";
import type { ProviderDefaultThinkingPolicyContext, ProviderThinkingProfile } from "./provider-thinking.types.js";
/** Provider policy hooks loaded from bundled plugin public artifacts. */
export type BundledProviderPolicySurface = {
    normalizeConfig?: (ctx: ProviderNormalizeConfigContext) => ModelProviderConfig | null | undefined;
    applyConfigDefaults?: (ctx: ProviderApplyConfigDefaultsContext) => OpenClawConfig | null | undefined;
    resolveConfigApiKey?: (ctx: ProviderResolveConfigApiKeyContext) => string | null | undefined;
    resolveThinkingProfile?: (ctx: ProviderDefaultThinkingPolicyContext) => ProviderThinkingProfile | null | undefined;
};
/** Resolves provider policy hooks for a bundled provider or its owning plugin. */
export declare function resolveBundledProviderPolicySurface(providerId: string, options?: {
    manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
}): BundledProviderPolicySurface | null;
