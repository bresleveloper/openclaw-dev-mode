/**
 * CLI turn compaction lifecycle.
 *
 * This module decides when CLI-backed sessions need context compaction, chooses
 * native harness or context-engine compaction, and records resulting session state.
 */
import type { SessionEntry } from "../../config/sessions/types.js";
import type { AgentCompactionMode } from "../../config/types.agent-defaults.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ContextEngine } from "../../context-engine/types.js";
import type { SkillSnapshot } from "../../skills/types.js";
import { resolveCliBackendConfig as resolveCliBackendConfigImpl } from "../cli-backends.js";
import { buildEmbeddedCompactionRuntimeContext } from "../embedded-agent-runner/compaction-runtime-context.js";
import { runContextEngineMaintenance as runContextEngineMaintenanceImpl } from "../embedded-agent-runner/context-engine-maintenance.js";
import { shouldPreemptivelyCompactBeforePrompt as shouldPreemptivelyCompactBeforePromptImpl } from "../embedded-agent-runner/run/preemptive-compaction.js";
import { resolveLiveToolResultMaxChars as resolveLiveToolResultMaxCharsImpl } from "../embedded-agent-runner/tool-result-truncation.js";
import { maybeCompactAgentHarnessSession as maybeCompactAgentHarnessSessionImpl } from "../harness/compaction.js";
import { ensureSelectedAgentHarnessPlugin as ensureSelectedAgentHarnessPluginImpl } from "../harness/runtime-plugin.js";
import { SessionManager } from "../sessions/session-manager.js";
import { clearCliSessionInStore as clearCliSessionInStoreImpl, recordCliCompactionInStore as recordCliCompactionInStoreImpl } from "./session-store.js";
type SessionManagerLike = ReturnType<typeof SessionManager.open>;
type SettingsManagerLike = {
    getCompactionReserveTokens: () => number;
    getCompactionKeepRecentTokens: () => number;
    applyOverrides: (overrides: {
        compaction: {
            reserveTokens?: number;
            keepRecentTokens?: number;
        };
    }) => void;
    setCompactionEnabled?: (enabled: boolean) => void;
};
type CliCompactionDeps = {
    openSessionManager: (sessionFile: string) => SessionManagerLike;
    ensureContextEnginesInitialized: () => void;
    resolveContextEngine: (cfg: OpenClawConfig) => Promise<ContextEngine>;
    createPreparedEmbeddedAgentSettingsManager: (params: {
        cwd: string;
        agentDir: string;
        cfg?: OpenClawConfig;
        contextTokenBudget?: number;
    }) => SettingsManagerLike | Promise<SettingsManagerLike>;
    applyAgentAutoCompactionGuard: (params: {
        settingsManager: SettingsManagerLike;
        contextEngineInfo?: ContextEngine["info"];
        compactionMode?: AgentCompactionMode;
    }) => unknown;
    shouldPreemptivelyCompactBeforePrompt: typeof shouldPreemptivelyCompactBeforePromptImpl;
    resolveLiveToolResultMaxChars: typeof resolveLiveToolResultMaxCharsImpl;
    runContextEngineMaintenance: typeof runContextEngineMaintenanceImpl;
    ensureSelectedAgentHarnessPlugin: typeof ensureSelectedAgentHarnessPluginImpl;
    maybeCompactAgentHarnessSession: typeof maybeCompactAgentHarnessSessionImpl;
    clearCliSessionInStore: typeof clearCliSessionInStoreImpl;
    resolveCliBackendConfig: typeof resolveCliBackendConfigImpl;
    recordCliCompactionInStore: typeof recordCliCompactionInStoreImpl;
};
declare const cliCompactionDeps: CliCompactionDeps;
/** Overrides CLI compaction dependencies for focused tests. */
export declare function setCliCompactionTestDeps(overrides: Partial<typeof cliCompactionDeps>): void;
/** Restores production CLI compaction dependencies after tests. */
export declare function resetCliCompactionTestDeps(): void;
/** Runs pre-turn compaction for a CLI session and returns the updated session entry. */
export declare function runCliTurnCompactionLifecycle(params: {
    cfg: OpenClawConfig;
    sessionId: string;
    sessionKey: string;
    sessionEntry: SessionEntry | undefined;
    sessionStore?: Record<string, SessionEntry>;
    storePath?: string;
    sessionAgentId: string;
    workspaceDir: string;
    cwd?: string;
    agentDir: string;
    provider: string;
    model: string;
    skillsSnapshot?: SkillSnapshot;
    messageChannel?: string;
    agentAccountId?: string;
    senderIsOwner?: boolean;
    thinkLevel?: Parameters<typeof buildEmbeddedCompactionRuntimeContext>[0]["thinkLevel"];
    extraSystemPrompt?: string;
}): Promise<SessionEntry | undefined>;
export {};
