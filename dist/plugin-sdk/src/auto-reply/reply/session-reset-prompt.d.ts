import { type BootstrapMode } from "../../agents/bootstrap-mode.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
export declare function resolveBareResetBootstrapFileAccess(params: {
    cfg?: OpenClawConfig;
    agentId?: string;
    sessionKey?: string;
    workspaceDir?: string;
    modelProvider?: string;
    modelId?: string;
}): boolean;
export declare function resolveBareSessionResetPromptState(params: {
    cfg?: OpenClawConfig;
    workspaceDir?: string;
    nowMs?: number;
    isPrimaryRun?: boolean;
    isCanonicalWorkspace?: boolean;
    hasBootstrapFileAccess?: boolean | (() => boolean);
}): Promise<{
    bootstrapMode: BootstrapMode;
    prompt: string;
    shouldPrependStartupContext: boolean;
}>;
/**
 * Build the bare session reset prompt, appending the current date/time so agents
 * know which daily memory files to read during their Session Startup sequence.
 * Without this, agents on /new or /reset guess the date from their training cutoff.
 */
export declare function buildBareSessionResetPrompt(cfg?: OpenClawConfig, nowMs?: number, bootstrapMode?: BootstrapMode): string;
