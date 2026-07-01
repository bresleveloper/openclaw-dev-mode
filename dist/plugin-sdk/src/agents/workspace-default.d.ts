/** Resolve the default agent workspace directory from env/profile/home state. */
export declare function resolveDefaultAgentWorkspaceDir(env?: NodeJS.ProcessEnv, homedir?: () => string): string;
/** Default agent workspace directory for the current process environment. */
export declare const DEFAULT_AGENT_WORKSPACE_DIR: string;
