import { type SessionEntry } from "../../config/sessions/types.js";
import type { AgentCommandOpts } from "./types.js";
/** Parameters for merging and persisting a session entry update. */
type PersistSessionEntryParams = {
    sessionStore: Record<string, SessionEntry>;
    sessionKey: string;
    storePath: string;
    entry: SessionEntry;
    clearedFields?: string[];
    preserveTranscriptMarkerUpdatedAt?: boolean;
    shouldPersist?: (entry: SessionEntry | undefined) => boolean;
};
export declare function persistSessionEntry(params: PersistSessionEntryParams): Promise<SessionEntry | undefined>;
/** Prepends hidden internal event context unless the body already carries it. */
export declare function prependInternalEventContext(body: string, events: AgentCommandOpts["internalEvents"]): string;
/** Resolves the prompt body submitted to ACP runtimes. */
export declare function resolveAcpPromptBody(body: string, events: AgentCommandOpts["internalEvents"]): string;
/** Resolves the body stored in transcripts after internal event rendering. */
export declare function resolveInternalEventTranscriptBody(body: string, events: AgentCommandOpts["internalEvents"]): string;
export {};
