import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginManifestRecord } from "../plugins/manifest-registry.js";
import type { PluginOrigin } from "../plugins/plugin-origin.types.js";
import type { ResolverContext, SecretDefaults } from "./runtime-shared.js";
import type { SecretTargetRegistryEntry } from "./target-registry-types.js";
type UnsupportedSecretRefConfigCandidate = {
    path: string;
    value: unknown;
};
type BundledChannelContractApi = {
    collectRuntimeConfigAssignments?: (params: {
        config: OpenClawConfig;
        defaults: SecretDefaults | undefined;
        context: ResolverContext;
    }) => void;
    secretTargetRegistryEntries?: readonly SecretTargetRegistryEntry[];
    unsupportedSecretRefSurfacePatterns?: readonly string[];
    collectUnsupportedSecretRefConfigCandidates?: (raw: Record<string, unknown>) => UnsupportedSecretRefConfigCandidate[];
};
export type BundledChannelSecretContractApi = Pick<BundledChannelContractApi, "collectRuntimeConfigAssignments" | "secretTargetRegistryEntries">;
/** Loads a bundled channel secret contract from its public artifact bundle. */
export declare function loadBundledChannelSecretContractApi(channelId: string): BundledChannelSecretContractApi | undefined;
/** Loads the first channel secret contract for a channel, preferring bundled metadata. */
/** Loads a channel secret contract API for a channel id and current plugin origin policy. */
export declare function loadChannelSecretContractApi(params: {
    channelId: string;
    config: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    loadablePluginOrigins?: ReadonlyMap<string, PluginOrigin>;
}): BundledChannelSecretContractApi | undefined;
/** Loads a channel secret contract directly from a manifest record. */
export declare function loadChannelSecretContractApiForRecord(record: PluginManifestRecord): BundledChannelSecretContractApi | undefined;
export type BundledChannelSecurityContractApi = Pick<BundledChannelContractApi, "unsupportedSecretRefSurfacePatterns" | "collectUnsupportedSecretRefConfigCandidates">;
/** Loads bundled channel security metadata used to reject unsupported SecretRef surfaces. */
export declare function loadBundledChannelSecurityContractApi(channelId: string): BundledChannelSecurityContractApi | undefined;
export {};
