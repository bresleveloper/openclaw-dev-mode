import type { QueueDropPolicy, QueueMode } from "./types.js";
/** Normalizes user-entered queue mode aliases from directives/config. */
export declare function normalizeQueueMode(raw?: string): QueueMode | undefined;
/** Normalizes persisted legacy queue mode aliases into current queue modes. */
export declare function normalizePersistedQueueMode(raw?: string): QueueMode | undefined;
/** Normalizes queue drop policy aliases from directives/config. */
export declare function normalizeQueueDropPolicy(raw?: string): QueueDropPolicy | undefined;
