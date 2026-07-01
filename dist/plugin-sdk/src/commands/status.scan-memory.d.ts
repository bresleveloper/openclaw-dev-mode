import type { OpenClawConfig } from "../config/types.js";
import type { getAgentLocalStatuses as getAgentLocalStatusesFn } from "./status.agent-local.js";
import { type MemoryPluginStatus, type MemoryStatusSnapshot } from "./status.scan.shared.js";
/** Returns the owning agent database path for built-in memory. */
export declare function resolveDefaultMemoryDatabasePath(agentId: string): string;
/** Resolves memory index/cache status for the current status scan. */
export declare function resolveStatusMemoryStatusSnapshot(params: {
    cfg: OpenClawConfig;
    agentStatus: Awaited<ReturnType<typeof getAgentLocalStatusesFn>>;
    memoryPlugin: MemoryPluginStatus;
    requireDefaultDatabasePath?: (agentId: string) => string;
}): Promise<MemoryStatusSnapshot | null>;
