/**
 * Ensures runtime plugins required by selected native harnesses are installed.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
/** Ensures the plugin that owns the selected harness runtime is loaded before harness selection. */
export declare function ensureSelectedAgentHarnessPlugin(params: {
    provider: string;
    modelId: string;
    config?: OpenClawConfig;
    agentId?: string;
    sessionKey?: string;
    agentHarnessRuntimeOverride?: string;
    workspaceDir: string;
}): Promise<void>;
