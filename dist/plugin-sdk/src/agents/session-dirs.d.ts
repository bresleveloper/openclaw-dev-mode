/** Synchronous variant of per-agent session directory discovery. */
export declare function resolveAgentSessionDirsFromAgentsDirSync(agentsDir: string): string[];
/** Lists per-agent session directories under a state directory. */
export declare function resolveAgentSessionDirs(stateDir: string): Promise<string[]>;
