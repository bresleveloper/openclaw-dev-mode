import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Formats a parsed config issue path into a user-facing dotted path. */
export declare function formatConfigPath(parts: Array<string | number>): string;
/** Resolves a config path against a loose config tree, returning null for invalid traversal. */
export declare function resolveConfigPathTarget(root: unknown, pathLocal: Array<string | number>): unknown;
/**
 * Removes unknown config keys reported by schema validation, except protected migration keys.
 *
 * Doctor skips this while an update is in progress so partially written upgrade state is not
 * stripped before its migration can finish.
 */
export declare function stripUnknownConfigKeys(config: OpenClawConfig): {
    config: OpenClawConfig;
    removed: string[];
};
/** Warns when legacy OpenCode provider overrides shadow the built-in catalog. */
export declare function noteOpencodeProviderOverrides(cfg: OpenClawConfig): void;
/** Collects warnings for agent model shapes that unintentionally drop default fallbacks. */
export declare function collectImplicitFallbackClobberWarnings(cfg: OpenClawConfig): string[];
/** Emits doctor notes for model fallback clobber warnings. */
export declare function noteImplicitFallbackClobberWarnings(cfg: OpenClawConfig): void;
/** Emits a config include warning when an include path escapes the config directory. */
export declare function noteIncludeConfinementWarning(snapshot: {
    path?: string | null;
    issues?: Array<{
        message: string;
    }>;
}): void;
