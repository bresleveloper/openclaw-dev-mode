import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginOrigin } from "../plugins/plugin-origin.types.js";
import type { ResolverContext, SecretDefaults } from "./runtime-shared.js";
/** Collects SecretRef assignments declared by active channel/plugin channel contracts. */
export declare function collectChannelConfigAssignments(params: {
    config: OpenClawConfig;
    /** Defaults from the source config, used before assignment writes mutate config. */
    defaults: SecretDefaults | undefined;
    context: ResolverContext;
    /** Optional installed plugin roots for external channel contract loading. */
    loadablePluginOrigins?: ReadonlyMap<string, PluginOrigin>;
}): void;
