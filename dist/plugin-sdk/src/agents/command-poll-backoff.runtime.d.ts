type PruneStaleCommandPolls = typeof import("./command-poll-backoff.js").pruneStaleCommandPolls;
/** Prune stale command polls using the production backoff implementation. */
export declare function pruneStaleCommandPolls(...args: Parameters<PruneStaleCommandPolls>): ReturnType<PruneStaleCommandPolls>;
export {};
