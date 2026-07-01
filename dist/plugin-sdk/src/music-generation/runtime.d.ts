import type { OpenClawConfig } from "../config/types.openclaw.js";
import { getProviderEnvVars } from "../secrets/provider-env-vars.js";
import { getMusicGenerationProvider, listMusicGenerationProviders } from "./provider-registry.js";
import type { GenerateMusicParams, GenerateMusicRuntimeResult } from "./runtime-types.js";
/**
 * Music generation runtime orchestration.
 *
 * The runtime resolves provider/model candidates, applies capability-based
 * normalization, invokes providers, and records fallback attempts consistently
 * with other media generation capabilities.
 */
declare const log: import("../logging/subsystem.js").SubsystemLogger;
/** Injectable dependencies used by tests and alternate runtime hosts. */
export type MusicGenerationRuntimeDeps = {
    getProvider?: typeof getMusicGenerationProvider;
    listProviders?: typeof listMusicGenerationProviders;
    getProviderEnvVars?: typeof getProviderEnvVars;
    log?: Pick<typeof log, "debug">;
};
export type { GenerateMusicParams, GenerateMusicRuntimeResult } from "./runtime-types.js";
/** List runtime-visible music generation providers for a config snapshot. */
export declare function listRuntimeMusicGenerationProviders(params?: {
    config?: OpenClawConfig;
}, deps?: MusicGenerationRuntimeDeps): import("./types.js").MusicGenerationProvider[];
/** Generate music with provider fallback and capability-aware request normalization. */
export declare function generateMusic(params: GenerateMusicParams, deps?: MusicGenerationRuntimeDeps): Promise<GenerateMusicRuntimeResult>;
