/**
 * Applies internal agent bootstrap hooks before workspace context is injected.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { WorkspaceBootstrapFile } from "./workspace.js";
/** Runs bootstrap hooks and returns the effective bootstrap file list. */
export declare function applyBootstrapHookOverrides(params: {
    files: WorkspaceBootstrapFile[];
    workspaceDir: string;
    config?: OpenClawConfig;
    sessionKey?: string;
    sessionId?: string;
    agentId?: string;
}): Promise<WorkspaceBootstrapFile[]>;
