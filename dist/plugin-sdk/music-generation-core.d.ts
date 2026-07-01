import { i as OpenClawConfig } from "./types.openclaw-R57aE8ho.js";
import { s as AuthProfileStore } from "./types-nLOnyeRM.js";
import { v as MusicGenerationProviderPlugin } from "./types-CXLy55Xw.js";
import { t as FallbackAttempt } from "./model-fallback.types-B1mOnouf.js";
import { n as createSubsystemLogger } from "./subsystem-Boo2DQIV.js";
import { n as getProviderEnvVars } from "./provider-env-vars-hRQuBoEz.js";
import { c as MusicGenerationProvider, d as MusicGenerationResult, f as MusicGenerationSourceImage, l as MusicGenerationProviderCapabilities, s as MusicGenerationOutputFormat, t as GeneratedMusicAsset, u as MusicGenerationRequest } from "./types-BvsXIKP5.js";
import { n as isFailoverError, t as describeFailoverError } from "./failover-error-DHkhp1Yg.js";
import { n as resolveAgentModelPrimaryValue, t as resolveAgentModelFallbackValues } from "./model-input-CkMbo366.js";

//#region src/music-generation/model-ref.d.ts
/**
 * Model reference parsing for music generation.
 *
 * Music generation uses the same provider/model ref grammar as other media
 * capabilities, but keeps this wrapper for a dedicated capability boundary.
 */
/** Parse a music generation model ref into provider and model ids. */
declare function parseMusicGenerationModelRef(raw: string | undefined): {
  provider: string;
  model: string;
} | null;
//#endregion
//#region src/music-generation/provider-registry.d.ts
/** List canonical music generation providers available for the current config. */
declare function listMusicGenerationProviders(cfg?: OpenClawConfig): MusicGenerationProviderPlugin[];
/** Resolve a music generation provider by canonical id or alias. */
declare function getMusicGenerationProvider(providerId: string | undefined, cfg?: OpenClawConfig): MusicGenerationProviderPlugin | undefined;
//#endregion
export { type AuthProfileStore, type FallbackAttempt, type GeneratedMusicAsset, type MusicGenerationOutputFormat, type MusicGenerationProvider, type MusicGenerationProviderCapabilities, type MusicGenerationProviderPlugin, type MusicGenerationRequest, type MusicGenerationResult, type MusicGenerationSourceImage, type OpenClawConfig, createSubsystemLogger, describeFailoverError, getMusicGenerationProvider, getProviderEnvVars, isFailoverError, listMusicGenerationProviders, parseMusicGenerationModelRef, resolveAgentModelFallbackValues, resolveAgentModelPrimaryValue };