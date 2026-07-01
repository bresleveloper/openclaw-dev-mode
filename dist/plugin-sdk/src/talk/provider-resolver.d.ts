/**
 * Realtime voice provider selection and config resolution.
 *
 * This adapter applies the generic capability-provider resolver to Talk
 * providers, including default model injection and per-call config overrides.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { RealtimeVoiceProviderPlugin } from "../plugins/types.js";
import type { RealtimeVoiceProviderConfig } from "./provider-types.js";
/** Resolved realtime voice provider plus provider-normalized config. */
export type ResolvedRealtimeVoiceProvider = {
    provider: RealtimeVoiceProviderPlugin;
    providerConfig: RealtimeVoiceProviderConfig;
};
/** Inputs for resolving a configured or auto-selected realtime voice provider. */
export type ResolveConfiguredRealtimeVoiceProviderParams = {
    configuredProviderId?: string;
    providerConfigs?: Record<string, Record<string, unknown> | undefined>;
    /** Last-mile overrides from a session/client request. */
    providerConfigOverrides?: Record<string, unknown>;
    cfg?: OpenClawConfig;
    /** Alternate config object used by generic provider selection internals. */
    cfgForResolve?: OpenClawConfig;
    /** Test/runtime override for the provider list. */
    providers?: RealtimeVoiceProviderPlugin[];
    /** Model injected before provider-specific resolveConfig runs. */
    defaultModel?: string;
    noRegisteredProviderMessage?: string;
};
/** Resolve the configured realtime voice provider or auto-select the first configured one. */
export declare function resolveConfiguredRealtimeVoiceProvider(params: ResolveConfiguredRealtimeVoiceProviderParams): ResolvedRealtimeVoiceProvider;
