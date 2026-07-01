import { type OpenClawConfig } from "./config-utils.js";
import { type MemoryReadResult } from "./read-file-shared.js";
/** Read a validated memory markdown file from workspace or configured extra paths. */
export declare function readMemoryFile(params: {
    workspaceDir: string;
    extraPaths?: string[];
    relPath: string;
    from?: number;
    lines?: number;
    defaultLines?: number;
    maxChars?: number;
}): Promise<MemoryReadResult>;
/** Resolve agent memory config and read one memory file for that agent. */
export declare function readAgentMemoryFile(params: {
    cfg: OpenClawConfig;
    agentId: string;
    relPath: string;
    from?: number;
    lines?: number;
}): Promise<MemoryReadResult>;
