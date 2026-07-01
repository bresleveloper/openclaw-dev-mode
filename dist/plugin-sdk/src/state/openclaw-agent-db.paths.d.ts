/**
 * Path helpers for per-agent SQLite state.
 *
 * Agent databases live beside the shared state database root so each agent can
 * own private runtime tables while the shared registry can still discover them.
 */
/** Inputs for resolving one agent SQLite path or directory. */
export type OpenClawAgentSqlitePathOptions = {
    agentId: string;
    env?: NodeJS.ProcessEnv;
    path?: string;
};
/** Resolve the SQLite file for one normalized agent id. */
export declare function resolveOpenClawAgentSqlitePath(options: OpenClawAgentSqlitePathOptions): string;
