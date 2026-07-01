import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { RealtimeVoiceProviderPlugin } from "../plugins/types.js";
import type { RealtimeVoiceProviderId } from "./provider-types.js";
/**
 * Normalizes realtime voice provider ids so direct ids and aliases compare through one registry key.
 */
export declare function normalizeRealtimeVoiceProviderId(providerId: string | undefined): RealtimeVoiceProviderId | undefined;
/**
 * Lists canonical realtime voice provider plugins in registry order.
 */
export declare function listRealtimeVoiceProviders(cfg?: OpenClawConfig): RealtimeVoiceProviderPlugin[];
/**
 * Resolves a realtime voice provider by canonical id or declared alias.
 */
export declare function getRealtimeVoiceProvider(providerId: string | undefined, cfg?: OpenClawConfig): RealtimeVoiceProviderPlugin | undefined;
/**
 * Converts a realtime voice provider id or alias into the canonical provider id when known.
 */
export declare function canonicalizeRealtimeVoiceProviderId(providerId: string | undefined, cfg?: OpenClawConfig): RealtimeVoiceProviderId | undefined;
