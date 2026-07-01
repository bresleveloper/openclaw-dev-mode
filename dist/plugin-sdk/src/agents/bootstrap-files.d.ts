import type { AgentContextInjection } from "../config/types.agent-defaults.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { EmbeddedContextFile } from "./embedded-agent-helpers.js";
import { type WorkspaceBootstrapFile } from "./workspace.js";
export type BootstrapContextMode = "full" | "lightweight";
type BootstrapContextRunKind = "default" | "heartbeat" | "cron";
export declare const FULL_BOOTSTRAP_COMPLETED_CUSTOM_TYPE = "openclaw:bootstrap-context:full";
/** Clears the per-process bootstrap warning dedupe cache for isolated tests. */
export declare function resetBootstrapWarningCacheForTest(): void;
/** Resolves the effective bootstrap injection mode for a session agent. */
export declare function resolveContextInjectionMode(config?: OpenClawConfig, agentId?: string | null): AgentContextInjection;
/** Checks whether the session transcript still has a valid full-bootstrap marker. */
export declare function hasCompletedBootstrapTurn(sessionFile: string): Promise<boolean>;
/** Builds a session-scoped warning sink that dedupes repeated bootstrap warnings. */
export declare function makeBootstrapWarn(params: {
    sessionLabel: string;
    workspaceDir?: string;
    warn?: (message: string) => void;
}): ((message: string) => void) | undefined;
/** Resolves hook-adjusted, session-filtered bootstrap files for a run. */
export declare function resolveBootstrapFilesForRun(params: {
    workspaceDir: string;
    config?: OpenClawConfig;
    sessionKey?: string;
    sessionId?: string;
    agentId?: string;
    warn?: (message: string) => void;
    contextMode?: BootstrapContextMode;
    runKind?: BootstrapContextRunKind;
}): Promise<WorkspaceBootstrapFile[]>;
/** Resolves both raw bootstrap metadata and bounded context files for a run. */
export declare function resolveBootstrapContextForRun(params: {
    workspaceDir: string;
    config?: OpenClawConfig;
    sessionKey?: string;
    sessionId?: string;
    agentId?: string;
    warn?: (message: string) => void;
    contextMode?: BootstrapContextMode;
    runKind?: BootstrapContextRunKind;
}): Promise<{
    bootstrapFiles: WorkspaceBootstrapFile[];
    contextFiles: EmbeddedContextFile[];
}>;
/** Builds bounded context files from already-resolved bootstrap file metadata. */
export declare function buildBootstrapContextForFiles(bootstrapFiles: WorkspaceBootstrapFile[], params: {
    config?: OpenClawConfig;
    agentId?: string | null;
    warn?: (message: string) => void;
}): EmbeddedContextFile[];
export {};
