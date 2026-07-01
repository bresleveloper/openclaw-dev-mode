import { type SessionEntry } from "../../config/sessions.js";
import { type AbortCutoff } from "./abort-cutoff.js";
import type { CommandHandler } from "./commands-types.js";
type CommandParams = Parameters<CommandHandler>[0];
type PersistSessionEntryParams = Pick<CommandParams, "sessionEntry" | "sessionStore" | "sessionKey" | "storePath">;
/** Resolves a command target entry through canonical and legacy session keys. */
export declare function resolveCommandSessionEntryForKey(store: Record<string, SessionEntry> | undefined, sessionKey: string | undefined): {
    entry?: SessionEntry;
    key?: string;
};
export declare function persistSessionEntry(params: PersistSessionEntryParams): Promise<boolean>;
export declare function persistAbortTargetEntry(params: {
    entry?: SessionEntry;
    key?: string;
    sessionStore?: Record<string, SessionEntry>;
    storePath?: string;
    abortCutoff?: AbortCutoff;
}): Promise<boolean>;
export {};
