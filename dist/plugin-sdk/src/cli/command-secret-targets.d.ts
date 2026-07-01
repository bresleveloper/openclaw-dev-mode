import type { OpenClawConfig } from "../config/types.openclaw.js";
type CommandSecretTargetScope = {
    targetIds: Set<string>;
    allowedPaths?: Set<string>;
    forcedActivePaths?: Set<string>;
    optionalActivePaths?: Set<string>;
};
/** Return channel secret targets, optionally narrowed to one channel account subtree. */
export declare function getScopedChannelsCommandSecretTargets(params: {
    config: OpenClawConfig;
    channel?: string | null;
    accountId?: string | null;
}): {
    targetIds: Set<string>;
    allowedPaths?: Set<string>;
};
/** Secret targets needed by QR remote pairing flows. */
export declare function getQrRemoteCommandSecretTargetIds(): Set<string>;
/** All registered channel secret targets, regardless of current config. */
export declare function getChannelsCommandSecretTargetIds(): Set<string>;
/** Channel secret targets contributed by channels currently present in config/read-only plugins. */
export declare function getConfiguredChannelsCommandSecretTargetIds(config: OpenClawConfig, env?: NodeJS.ProcessEnv): Set<string>;
/** Model-provider credential targets used by commands that can touch provider config. */
export declare function getModelsCommandSecretTargetIds(): Set<string>;
/** Credential targets required by memory embedding flows. */
export declare function getMemoryEmbeddingCommandSecretTargetIds(): Set<string>;
/** Credential targets required by text-to-speech flows. */
export declare function getTtsCommandSecretTargetIds(): Set<string>;
/** Agent runtime credential targets, optionally including all channel credential targets. */
export declare function getAgentRuntimeCommandSecretTargetIds(params?: {
    includeChannelTargets?: boolean;
}): Set<string>;
/** Static web-fetch capability targets plus plugin-provided web-fetch credential targets. */
export declare function getCapabilityWebFetchCommandSecretTargetIds(): Set<string>;
/** Web-fetch target scope for selected/auto-detected providers and configured fallback paths. */
export declare function getCapabilityWebFetchCommandSecretTargets(config: OpenClawConfig, options?: {
    providerId?: string | null;
}): CommandSecretTargetScope;
/** Static web-search capability targets plus plugin-provided web-search credential targets. */
export declare function getCapabilityWebSearchCommandSecretTargetIds(): Set<string>;
/** Web-search target scope for selected/auto-detected providers and configured fallback paths. */
export declare function getCapabilityWebSearchCommandSecretTargets(config: OpenClawConfig, options?: {
    providerId?: string | null;
}): CommandSecretTargetScope;
/** Status command targets; channel targets can be limited to configured channel plugins. */
export declare function getStatusCommandSecretTargetIds(config?: OpenClawConfig, env?: NodeJS.ProcessEnv, options?: {
    includeChannelTargets?: boolean;
}): Set<string>;
/** Secret targets that the security audit command is allowed to inspect. */
export declare function getSecurityAuditCommandSecretTargetIds(): Set<string>;
export {};
