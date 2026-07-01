import type { OpenClawConfig } from "./types.js";
type DuplicateAgentDir = {
    agentDir: string;
    agentIds: string[];
};
/** Error thrown when multiple configured agents resolve to the same state directory. */
export declare class DuplicateAgentDirError extends Error {
    readonly duplicates: DuplicateAgentDir[];
    constructor(duplicates: DuplicateAgentDir[]);
}
/** Finds agent ids whose effective agentDir would share auth/session state. */
export declare function findDuplicateAgentDirs(cfg: OpenClawConfig, deps?: {
    env?: NodeJS.ProcessEnv;
    homedir?: () => string;
}): DuplicateAgentDir[];
/** Formats duplicate agentDir conflicts with the remediation operators should take. */
export declare function formatDuplicateAgentDirError(dups: DuplicateAgentDir[]): string;
export {};
