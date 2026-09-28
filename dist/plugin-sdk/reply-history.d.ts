import { n as HistoryMediaEntry, t as HistoryEntry } from "../history.types-gAzBXfec.js";
//#region src/auto-reply/reply/history-limit.d.ts
export declare const DEFAULT_GROUP_HISTORY_LIMIT = 50;
//#endregion
//#region src/auto-reply/reply/history.d.ts
export declare const HISTORY_CONTEXT_MARKER = "[Chat messages since your last reply - for context]";
/**
 * Evict oldest keys from a history map when it exceeds MAX_HISTORY_KEYS.
 * Uses Map's insertion order for LRU-like behavior.
 */
export declare function evictOldHistoryKeys<T>(historyMap: Map<string, T[]>, maxKeys?: number): void;
/** Wraps previous chat history and the current message in the prompt context marker format. */
export declare function buildHistoryContext(params: {
  historyText: string;
  currentMessage: string;
  lineBreak?: string;
  historyKind?: "pending" | "recent";
}): string;
declare function recordChannelHistoryEntryIfEnabled<T extends HistoryEntry>(params: {
  historyMap: Map<string, T[]>;
  historyKey: string;
  entry?: T | null;
  limit: number;
}): T[];
/**
 * @deprecated Plugin message-turn code should use `createChannelHistoryWindow(...).record(...)`.
 * This helper remains for core internals and older plugin compatibility.
 */
export declare const recordPendingHistoryEntryIfEnabled: typeof recordChannelHistoryEntryIfEnabled;
type MaybePromise$1<T> = T | Promise<T>;
/** Filters history media to local image entries safe to re-attach to prompt context. */
export declare function normalizeHistoryMediaEntries(params: {
  media?: readonly HistoryMediaEntry[] | null;
  limit?: number;
  messageId?: string;
}): HistoryMediaEntry[];
declare function recordChannelHistoryEntryWithMedia<T extends HistoryEntry>(params: {
  historyMap: Map<string, T[]>;
  historyKey: string;
  entry?: T | null;
  limit: number;
  media?: readonly HistoryMediaEntry[] | null | (() => MaybePromise$1<readonly HistoryMediaEntry[] | null | undefined>);
  mediaLimit?: number;
  messageId?: string;
  shouldRecord?: () => boolean;
}): Promise<T[]>;
/**
 * @deprecated Plugin message-turn code should use
 * `createChannelHistoryWindow(...).recordWithMedia(...)`.
 */
export declare const recordPendingHistoryEntryWithMedia: typeof recordChannelHistoryEntryWithMedia;
declare function buildChannelPendingHistoryContext(params: {
  historyMap: Map<string, HistoryEntry[]>;
  historyKey: string;
  limit: number;
  currentMessage: string;
  formatEntry: (entry: HistoryEntry) => string;
  lineBreak?: string;
}): string;
/**
 * @deprecated Plugin message-turn code should use
 * `createChannelHistoryWindow(...).buildPendingContext(...)`.
 */
export declare const buildPendingHistoryContextFromMap: typeof buildChannelPendingHistoryContext;
declare function buildChannelInboundHistory<T extends HistoryEntry>(params: {
  historyMap: Map<string, T[]>;
  historyKey: string;
  limit: number;
}): HistoryEntry[] | undefined;
/**
 * @deprecated Plugin message-turn code should use
 * `createChannelHistoryWindow(...).buildInboundHistory(...)`.
 */
export declare const buildInboundHistoryFromMap: typeof buildChannelInboundHistory;
/** Builds structured inbound history entries from an existing window. */
export declare function buildInboundHistoryFromEntries(params: {
  entries: readonly HistoryEntry[];
  limit: number;
}): HistoryEntry[] | undefined;
/**
 * @deprecated Prefer `buildHistoryContextFromEntries(...)` for existing entry
 * arrays, or `createChannelHistoryWindow(...)` when working from a history map.
 * This helper remains for older plugin compatibility.
 */
export declare function buildHistoryContextFromMap(params: {
  historyMap: Map<string, HistoryEntry[]>;
  historyKey: string;
  limit: number;
  entry?: HistoryEntry;
  currentMessage: string;
  formatEntry: (entry: HistoryEntry) => string;
  lineBreak?: string;
  excludeLast?: boolean;
}): string;
declare function clearChannelHistoryIfEnabled(params: {
  historyMap: Map<string, HistoryEntry[]>;
  historyKey: string;
  limit: number;
}): void;
/**
 * @deprecated Plugin message-turn code should use `createChannelHistoryWindow(...).clear(...)`.
 * This helper remains for core internals and older plugin compatibility.
 */
export declare const clearHistoryEntriesIfEnabled: typeof clearChannelHistoryIfEnabled;
/** Builds prompt text from already-recorded history entries. */
export declare function buildHistoryContextFromEntries(params: {
  entries: HistoryEntry[];
  currentMessage: string;
  formatEntry: (entry: HistoryEntry) => string;
  lineBreak?: string;
  excludeLast?: boolean;
  historyKind?: "pending" | "recent";
}): string;
//#endregion
//#region src/channels/turn/history-window.d.ts
type MaybePromise<T> = T | Promise<T>;
/** Windowed channel history facade used by turn adapters to record and render recent context. */
type ChannelHistoryWindow<T extends HistoryEntry = HistoryEntry> = {
  record: (params: {
    historyKey: string;
    entry?: T | null;
    limit: number;
  }) => T[];
  recordWithMedia: (params: {
    historyKey: string;
    entry?: T | null;
    limit: number;
    media?: readonly HistoryMediaEntry[] | null | (() => MaybePromise<readonly HistoryMediaEntry[] | null | undefined>);
    mediaLimit?: number;
    messageId?: string;
    shouldRecord?: () => boolean;
  }) => Promise<T[]>;
  buildPendingContext: (params: {
    historyKey: string;
    limit: number;
    currentMessage: string;
    formatEntry: (entry: T) => string;
    lineBreak?: string;
  }) => string;
  buildInboundHistory: (params: {
    historyKey: string;
    limit: number;
  }) => HistoryEntry[] | undefined;
  clear: (params: {
    historyKey: string;
    limit: number;
  }) => void;
};
/** Creates a bounded channel history window over a caller-owned history map. */
export declare function createChannelHistoryWindow<T extends HistoryEntry = HistoryEntry>(params: {
  historyMap: Map<string, T[]>;
}): ChannelHistoryWindow<T>;
//#endregion
export type { ChannelHistoryWindow, HistoryEntry, HistoryMediaEntry };