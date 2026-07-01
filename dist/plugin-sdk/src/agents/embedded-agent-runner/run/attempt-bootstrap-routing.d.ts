/**
 * Resolves bootstrap context targets for one embedded-agent attempt.
 */
import type { BootstrapMode } from "../../bootstrap-mode.js";
import { type WorkspaceBootstrapFile } from "../../workspace.js";
/** Inputs that decide whether this attempt should inject workspace bootstrap context. */
type AttemptBootstrapRoutingInput = {
    workspaceBootstrapPending: boolean;
    bootstrapContextRunKind?: "default" | "heartbeat" | "cron";
    trigger?: string;
    sessionKey?: string;
    isPrimaryRun: boolean;
    isCanonicalWorkspace?: boolean;
    effectiveWorkspace: string;
    resolvedWorkspace: string;
    hasBootstrapFileAccess: boolean;
};
/** Bootstrap placement decision consumed by system/runtime context assembly. */
type AttemptBootstrapRouting = {
    bootstrapMode: BootstrapMode;
    includeBootstrapInSystemContext: boolean;
    includeBootstrapInRuntimeContext: boolean;
};
type AttemptWorkspaceBootstrapRoutingInput = Omit<AttemptBootstrapRoutingInput, "workspaceBootstrapPending"> & {
    isWorkspaceBootstrapPending: (workspaceDir: string) => Promise<boolean>;
    bootstrapFiles?: readonly WorkspaceBootstrapFile[];
};
/**
 * Resolves workspace bootstrap routing after checking pending state and
 * hook-provided bootstrap files. Hook content counts as both pending bootstrap
 * and file access so generated bootstrap text follows the same route as disk
 * bootstrap content.
 */
export declare function resolveAttemptWorkspaceBootstrapRouting(params: AttemptWorkspaceBootstrapRoutingInput): Promise<AttemptBootstrapRouting>;
export {};
