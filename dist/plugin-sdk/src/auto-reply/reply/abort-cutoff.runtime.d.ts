import type { SessionEntry } from "../../config/sessions/types.js";
/** Clears abort cutoff state in memory and persisted session storage. */
export declare function clearAbortCutoffInSessionRuntime(params: {
    sessionEntry?: SessionEntry;
    sessionStore?: Record<string, SessionEntry>;
    sessionKey?: string;
    storePath?: string;
}): Promise<boolean>;
