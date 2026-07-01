import type { SubagentLifecycleHookRunner } from "../plugins/hooks.js";
export { SUBAGENT_SPAWN_ACCEPTED_NOTE, SUBAGENT_SPAWN_SESSION_ACCEPTED_NOTE, } from "./subagent-spawn-accepted-note.js";
import { callGateway, dispatchGatewayMethodInProcess, forkSessionEntryFromParent, getRuntimeConfig, hasInProcessGatewayContext, ensureContextEnginesInitialized, resolveContextEngine, updateSessionStore } from "./subagent-spawn.runtime.js";
import type { SpawnSubagentContextMode, SpawnSubagentMode, SpawnSubagentSandboxMode } from "./subagent-spawn.types.js";
export { SUBAGENT_SPAWN_CONTEXT_MODES, SUBAGENT_SPAWN_MODES, SUBAGENT_SPAWN_SANDBOX_MODES, } from "./subagent-spawn.types.js";
export type { SpawnSubagentContextMode, SpawnSubagentMode, SpawnSubagentSandboxMode, } from "./subagent-spawn.types.js";
type SubagentSpawnDeps = {
    callGateway: typeof callGateway;
    dispatchGatewayMethodInProcess: typeof dispatchGatewayMethodInProcess;
    forkSessionEntryFromParent: typeof forkSessionEntryFromParent;
    getGlobalHookRunner: () => SubagentLifecycleHookRunner | null;
    getRuntimeConfig: typeof getRuntimeConfig;
    hasInProcessGatewayContext: typeof hasInProcessGatewayContext;
    ensureContextEnginesInitialized: typeof ensureContextEnginesInitialized;
    resolveContextEngine: typeof resolveContextEngine;
    updateSessionStore: typeof updateSessionStore;
};
export type SpawnSubagentParams = {
    task: string;
    label?: string;
    agentId?: string;
    model?: string;
    taskName?: string;
    thinking?: string;
    cwd?: string;
    runTimeoutSeconds?: number;
    thread?: boolean;
    mode?: SpawnSubagentMode;
    cleanup?: "delete" | "keep";
    sandbox?: SpawnSubagentSandboxMode;
    context?: SpawnSubagentContextMode;
    lightContext?: boolean;
    expectsCompletionMessage?: boolean;
    attachments?: Array<{
        name: string;
        content: string;
        encoding?: "utf8" | "base64";
        mimeType?: string;
    }>;
    attachMountPath?: string;
};
export type SpawnSubagentContext = {
    agentSessionKey?: string;
    /** Separate key used only for completion routing, not sandbox policy. */
    completionOwnerKey?: string;
    agentChannel?: string;
    agentAccountId?: string;
    agentTo?: string;
    agentThreadId?: string | number;
    agentGroupId?: string | null;
    agentGroupChannel?: string | null;
    agentGroupSpace?: string | null;
    agentMemberRoleIds?: string[];
    requesterAgentIdOverride?: string;
    /** Explicit workspace directory for subagent to inherit (optional). */
    workspaceDir?: string;
    inheritedToolAllowlist?: string[];
    inheritedToolDenylist?: string[];
};
export type SpawnSubagentResult = {
    status: "accepted" | "forbidden" | "error";
    childSessionKey?: string;
    runId?: string;
    mode?: SpawnSubagentMode;
    taskName?: string;
    note?: string;
    /** Fully resolved model ref applied to the spawned child session. */
    resolvedModel?: string;
    /** Provider prefix parsed from resolvedModel when the ref includes one. */
    resolvedProvider?: string;
    modelApplied?: boolean;
    error?: string;
    attachments?: {
        count: number;
        totalBytes: number;
        files: Array<{
            name: string;
            bytes: number;
            sha256: string;
        }>;
        relDir: string;
    };
};
export { splitModelRef } from "./subagent-spawn-plan.js";
export declare function spawnSubagentDirect(params: SpawnSubagentParams, ctx: SpawnSubagentContext): Promise<SpawnSubagentResult>;
export declare const testing: {
    setDepsForTest(overrides?: Partial<SubagentSpawnDeps>): void;
};
export { testing as __testing };
