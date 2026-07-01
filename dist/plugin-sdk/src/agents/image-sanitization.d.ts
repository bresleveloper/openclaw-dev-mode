/**
 * Resolves image sanitization limits for historical session messages.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
export type ImageSanitizationLimits = {
    maxDimensionPx?: number;
    maxBytes?: number;
};
export declare const DEFAULT_IMAGE_MAX_DIMENSION_PX = 1200;
export declare const DEFAULT_IMAGE_MAX_BYTES: number;
/** Resolve configured image sanitization limits for agent payloads. */
export declare function resolveImageSanitizationLimits(cfg?: OpenClawConfig): ImageSanitizationLimits;
