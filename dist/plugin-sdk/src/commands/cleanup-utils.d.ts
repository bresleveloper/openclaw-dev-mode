import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { RuntimeEnv } from "../runtime.js";
type RemovalResult = {
    ok: boolean;
    skipped?: boolean;
};
type CleanupResolvedPaths = {
    stateDir: string;
    configPath: string;
    oauthDir: string;
    configInsideState: boolean;
    oauthInsideState: boolean;
};
type RemovalOptions = {
    dryRun?: boolean;
    label?: string;
};
type StateRemovalOptions = {
    dryRun?: boolean;
    preservePaths?: readonly string[];
};
/** Determine which config, credential, and workspace paths cleanup should consider. */
export declare function buildCleanupPlan(params: {
    cfg: OpenClawConfig | undefined;
    stateDir: string;
    configPath: string;
    oauthDir: string;
}): {
    configInsideState: boolean;
    oauthInsideState: boolean;
    workspaceDirs: string[];
};
/** Return true when `child` resolves inside `parent`. */
export declare function isPathWithin(child: string, parent: string): boolean;
/** Remove one path after rejecting empty/root/home targets and honoring dry-run mode. */
export declare function removePath(target: string, runtime: RuntimeEnv, opts?: RemovalOptions): Promise<RemovalResult>;
/** Remove workspace attestation files associated with cleanup-target workspaces. */
export declare function removeWorkspaceAttestationPaths(workspaceDirs: readonly string[], runtime: RuntimeEnv, opts?: RemovalOptions): Promise<void>;
/** Remove state plus config/OAuth paths, preserving selected paths nested inside state. */
export declare function removeStateAndLinkedPaths(cleanup: CleanupResolvedPaths, runtime: RuntimeEnv, opts?: StateRemovalOptions): Promise<void>;
/** Remove all workspace directories selected by the cleanup plan. */
export declare function removeWorkspaceDirs(workspaceDirs: readonly string[], runtime: RuntimeEnv, opts?: {
    dryRun?: boolean;
}): Promise<void>;
/** List per-agent session directories beneath a state directory. */
export declare function listAgentSessionDirs(stateDir: string): Promise<string[]>;
export {};
