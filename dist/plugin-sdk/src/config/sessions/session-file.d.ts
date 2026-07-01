import type { ResolvedSessionMaintenanceConfig } from "./store-maintenance.js";
import type { SessionEntry } from "./types.js";
/** Resolves a transcript file path and persists it into the session store when needed. */
export declare function resolveAndPersistSessionFile(params: {
    sessionId: string;
    sessionKey: string;
    sessionStore: Record<string, SessionEntry>;
    storePath: string;
    sessionEntry?: SessionEntry;
    agentId?: string;
    sessionsDir?: string;
    fallbackSessionFile?: string;
    activeSessionKey?: string;
    maintenanceConfig?: ResolvedSessionMaintenanceConfig;
}): Promise<{
    sessionFile: string;
    sessionEntry: SessionEntry;
}>;
