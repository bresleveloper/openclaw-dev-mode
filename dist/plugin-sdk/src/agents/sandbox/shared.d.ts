/** Converts an arbitrary session key into a bounded filesystem/container-safe slug. */
export declare function slugifySessionKey(value: string): string;
/** Resolves the per-session sandbox workspace directory under the configured sandbox root. */
export declare function resolveSandboxWorkspaceDir(root: string, sessionKey: string): string;
/** Resolves the registry scope key for session-, agent-, or shared-scope sandbox lifetimes. */
export declare function resolveSandboxScopeKey(scope: "session" | "agent" | "shared", sessionKey: string): string;
/** Extracts the agent id represented by a sandbox scope key, when one exists. */
export declare function resolveSandboxAgentId(scopeKey: string): string | undefined;
