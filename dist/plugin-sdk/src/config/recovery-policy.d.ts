import type { ConfigFileSnapshot, ConfigValidationIssue } from "./types.openclaw.js";
/** Return true for plugin validation issues caused by missing compiled runtime output. */
export declare function isPluginPackagingRuntimeOutputIssue(issue: ConfigValidationIssue): boolean;
/**
 * Return true when an invalid config snapshot is blocked only by plugin packaging fallout.
 * This lets callers show plugin repair hints instead of treating user config as corrupted.
 */
export declare function isPluginPackagingRuntimeOutputInvalidConfigSnapshot(snapshot: Pick<ConfigFileSnapshot, "valid" | "issues" | "legacyIssues"> & Partial<Pick<ConfigFileSnapshot, "warnings">>): boolean;
/**
 * Return true when an invalid config snapshot is scoped entirely to stale plugin refs.
 * Whole-file recovery is skipped for these snapshots so plugin cleanup can preserve user config.
 */
export declare function isPluginLocalInvalidConfigSnapshot(snapshot: Pick<ConfigFileSnapshot, "valid" | "issues" | "legacyIssues">): boolean;
/**
 * Decide whether whole-file last-known-good recovery is appropriate for an invalid snapshot.
 * Plugin-local failures stay on the current file so targeted plugin cleanup can run.
 */
export declare function shouldAttemptLastKnownGoodRecovery(snapshot: Pick<ConfigFileSnapshot, "valid" | "issues" | "legacyIssues">): boolean;
