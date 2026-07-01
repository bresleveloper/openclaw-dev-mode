import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Clear cached manifest suppression resolver state for tests and metadata lifecycle resets. */
export declare function clearModelSuppressionResolverCacheForTest(): void;
/** Return true when plugin manifest metadata suppresses a built-in model entry. */
export declare function shouldSuppressBuiltInModelFromManifest(params: {
    provider?: string | null;
    id?: string | null;
    baseUrl?: string | null;
    config?: OpenClawConfig;
    workspaceDir?: string;
}): boolean;
/** Return true when any built-in suppression rule applies to a model entry. */
export declare function shouldSuppressBuiltInModel(params: {
    provider?: string | null;
    id?: string | null;
    baseUrl?: string | null;
    config?: OpenClawConfig;
    workspaceDir?: string;
}): boolean;
/**
 * Return true only for unconditional manifest suppressions.
 * Inline model entries may override conditional suppressions, but not absolute
 * provider capability blocks.
 */
export declare function shouldUnconditionallySuppress(params: {
    provider?: string | null;
    id?: string | null;
    config?: OpenClawConfig;
    workspaceDir?: string;
}): boolean;
/** Resolve the user-facing suppression error message for a built-in model. */
export declare function buildSuppressedBuiltInModelError(params: {
    provider?: string | null;
    id?: string | null;
    baseUrl?: string | null;
    config?: OpenClawConfig;
    workspaceDir?: string;
}): string | undefined;
/** Build a reusable suppression predicate for repeated catalog filtering. */
export declare function buildShouldSuppressBuiltInModel(params: {
    config?: OpenClawConfig;
    workspaceDir?: string;
}): (input: {
    provider?: string | null;
    id?: string | null;
    baseUrl?: string | null;
}) => boolean;
