import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { TranscriptSourceProvider } from "./provider-types.js";
/**
 * Transcript source provider registry.
 *
 * Transcript providers are plugin capability providers; this module exposes
 * canonical/alias lookup and keeps direct plugin resolution ahead of map fallback.
 */
/** Normalize transcript source provider ids for registry lookup. */
export declare function normalizeTranscriptSourceProviderId(providerId: string | undefined): string | undefined;
/** List canonical transcript source providers for a config snapshot. */
export declare function listTranscriptSourceProviders(cfg?: OpenClawConfig): TranscriptSourceProvider[];
/** Resolve a transcript provider by canonical id or alias. */
export declare function getTranscriptSourceProvider(providerId: string | undefined, cfg?: OpenClawConfig): TranscriptSourceProvider | undefined;
