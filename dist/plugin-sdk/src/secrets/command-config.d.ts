/** Collects and analyzes command-scoped secret assignments from OpenClaw config. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
/** One resolved SecretRef value ready to inject into a command-scoped config view. */
/** One command config path whose value can be resolved from a SecretRef. */
export type CommandSecretAssignment = {
    path: string;
    pathSegments: string[];
    value: unknown;
};
/** Resolved command assignments plus non-fatal diagnostics. */
export type ResolveAssignmentsFromSnapshotResult = {
    assignments: CommandSecretAssignment[];
    diagnostics: string[];
};
/** Active or inactive command target that could not be materialized. */
export type UnresolvedCommandSecretAssignment = {
    path: string;
    pathSegments: string[];
};
/** Full command assignment analysis before unresolved active refs are rejected. */
export type AnalyzeAssignmentsFromSnapshotResult = {
    assignments: CommandSecretAssignment[];
    diagnostics: string[];
    unresolved: UnresolvedCommandSecretAssignment[];
    inactive: UnresolvedCommandSecretAssignment[];
};
/**
 * Compares source SecretRefs with the active resolved snapshot for command-time assignments.
 */
/** Analyzes command secret assignments without mutating the source config. */
export declare function analyzeCommandSecretAssignmentsFromSnapshot(params: {
    sourceConfig: OpenClawConfig;
    resolvedConfig: OpenClawConfig;
    targetIds: ReadonlySet<string>;
    inactiveRefPaths?: ReadonlySet<string>;
    allowedPaths?: ReadonlySet<string>;
}): AnalyzeAssignmentsFromSnapshotResult;
/**
 * Returns resolved command assignments and throws when an active required ref is unresolved.
 */
export declare function collectCommandSecretAssignmentsFromSnapshot(params: {
    sourceConfig: OpenClawConfig;
    resolvedConfig: OpenClawConfig;
    commandName: string;
    targetIds: ReadonlySet<string>;
    inactiveRefPaths?: ReadonlySet<string>;
    allowedPaths?: ReadonlySet<string>;
}): ResolveAssignmentsFromSnapshotResult;
