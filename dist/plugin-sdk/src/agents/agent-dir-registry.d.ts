/** Register a resolved agent directory for later reverse lookup. */
export declare function registerResolvedAgentDir(params: {
    agentId: string;
    agentDir: string;
    env?: NodeJS.ProcessEnv;
}): void;
/** Resolve the agent id previously registered for an agent directory. */
export declare function resolveRegisteredAgentIdForDir(agentDir: string, env?: NodeJS.ProcessEnv): string | undefined;
