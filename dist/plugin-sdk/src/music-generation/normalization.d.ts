import type { MusicGenerationIgnoredOverride, MusicGenerationNormalization, MusicGenerationOutputFormat, MusicGenerationProvider, MusicGenerationSourceImage } from "./types.js";
/**
 * Request normalization for music generation.
 *
 * Providers advertise per-mode and per-model support; this module removes
 * unsupported caller overrides and records any duration coercion for metadata.
 */
type ResolvedMusicGenerationOverrides = {
    lyrics?: string;
    instrumental?: boolean;
    durationSeconds?: number;
    format?: MusicGenerationOutputFormat;
    ignoredOverrides: MusicGenerationIgnoredOverride[];
    normalization?: MusicGenerationNormalization;
};
/** Sanitize caller overrides against provider capabilities before invoking a provider. */
export declare function resolveMusicGenerationOverrides(params: {
    provider: MusicGenerationProvider;
    model: string;
    lyrics?: string;
    instrumental?: boolean;
    durationSeconds?: number;
    format?: MusicGenerationOutputFormat;
    inputImages?: MusicGenerationSourceImage[];
}): ResolvedMusicGenerationOverrides;
export {};
