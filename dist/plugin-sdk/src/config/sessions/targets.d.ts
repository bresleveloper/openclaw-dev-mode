import type { OpenClawConfig } from "../types.openclaw.js";
/** CLI/session-store target selection options. */
export type SessionStoreSelectionOptions = {
    store?: string;
    agent?: string;
    allAgents?: boolean;
};
/** One session store path paired with its owning agent id. */
export type SessionStoreTarget = {
    agentId: string;
    storePath: string;
};
/** Lists agent ids whose session stores should be considered configured. */
export declare function listConfiguredSessionStoreAgentIds(cfg: OpenClawConfig): string[];
/** Resolves all configured and discoverable agent session stores synchronously. */
export declare function resolveAllAgentSessionStoreTargetsSync(cfg: OpenClawConfig, params?: {
    env?: NodeJS.ProcessEnv;
}): SessionStoreTarget[];
/** Resolves session store targets for one agent, including retired/manual stores. */
export declare function resolveAgentSessionStoreTargetsSync(cfg: OpenClawConfig, agentId: string, params?: {
    env?: NodeJS.ProcessEnv;
}): SessionStoreTarget[];
/** Resolves session store targets from explicit CLI-style selection options. */
export declare function resolveSessionStoreTargets(cfg: OpenClawConfig, opts: SessionStoreSelectionOptions, params?: {
    env?: NodeJS.ProcessEnv;
}): SessionStoreTarget[];
