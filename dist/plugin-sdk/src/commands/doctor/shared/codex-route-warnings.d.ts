import type { SessionEntry } from "../../../config/sessions/types.js";
import type { OpenClawConfig } from "../../../config/types.openclaw.js";
export type DisabledCodexPluginRouteIssue = {
    /** Config path that selects a model requiring the Codex plugin runtime. */
    path: string;
    /** Original model reference from config. */
    modelRef: string;
    /** Canonical OpenAI model reference that should remain after migration. */
    canonicalModel: string;
    /** True when global/plugin allow policy blocks auto-enabling the Codex plugin. */
    blockedOutsideEntry: boolean;
};
type SessionRouteRepairResult = {
    changed: boolean;
    sessionKeys: string[];
};
type CodexSessionRouteRepairSummary = {
    scannedStores: number;
    repairedStores: number;
    repairedSessions: number;
    warnings: string[];
    changes: string[];
};
/** Find Codex-routed model refs that require the Codex plugin while it is disabled. */
export declare function collectDisabledCodexPluginRouteIssues(cfg: OpenClawConfig): DisabledCodexPluginRouteIssue[];
/** Collect doctor warnings for legacy Codex model refs, runtime pins, and compaction overrides. */
export declare function collectCodexRouteWarnings(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
}): string[];
/** Rewrite legacy Codex config routes to OpenAI refs and explicit runtime policy when allowed. */
export declare function maybeRepairCodexRoutes(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    shouldRepair: boolean;
    codexRuntimeReady?: boolean;
}): {
    cfg: OpenClawConfig;
    warnings: string[];
    changes: string[];
};
/** Rewrite stale Codex model/provider/session runtime fields inside one session store object. */
export declare function repairCodexSessionStoreRoutes(params: {
    store: Record<string, SessionEntry>;
    now?: number;
}): SessionRouteRepairResult;
/** Scan or repair all configured agent session stores that still contain legacy Codex routes. */
export declare function maybeRepairCodexSessionRoutes(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    shouldRepair: boolean;
    codexRuntimeReady?: boolean;
}): Promise<CodexSessionRouteRepairSummary>;
export {};
