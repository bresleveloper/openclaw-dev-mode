import { type SessionFilePathOptions } from "./paths.js";
import { type SessionEntry, type SessionScope } from "./types.js";
type SessionLifecycleEntry = Pick<SessionEntry, "sessionId" | "sessionFile" | "sessionStartedAt" | "lastInteractionAt" | "updatedAt">;
type TerminalMainSessionTranscriptRegistryParams = {
    entry: SessionEntry | undefined;
    sessionScope?: SessionScope;
    sessionKey?: string;
    agentId: string;
    mainKey?: string;
    storePath?: string;
};
type TerminalMainSessionTranscriptRegistryCheck = {
    sessionId: string;
    registryTimestampMs: number;
};
/** Reads session start time from a transcript header when store metadata is missing. */
export declare function readSessionHeaderStartedAtMs(params: {
    entry: SessionLifecycleEntry | undefined;
    agentId?: string;
    storePath?: string;
    pathOptions?: SessionFilePathOptions;
}): number | undefined;
export declare function resolveSessionLifecycleTimestamps(params: {
    entry: SessionLifecycleEntry | undefined;
    agentId?: string;
    storePath?: string;
    pathOptions?: SessionFilePathOptions;
}): {
    sessionStartedAt?: number;
    lastInteractionAt?: number;
};
export declare function resolveTerminalMainSessionTranscriptRegistryCheck(params: TerminalMainSessionTranscriptRegistryParams): TerminalMainSessionTranscriptRegistryCheck | undefined;
export declare function hasTerminalMainSessionTranscriptNewerThanRegistrySync(params: TerminalMainSessionTranscriptRegistryParams): boolean;
export declare function hasTerminalMainSessionTranscriptNewerThanRegistry(params: TerminalMainSessionTranscriptRegistryParams): Promise<boolean>;
export {};
