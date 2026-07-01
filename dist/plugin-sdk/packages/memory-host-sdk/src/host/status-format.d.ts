/** Display tone used by memory status renderers. */
export type Tone = "ok" | "warn" | "muted";
/** Resolve vector indexing state from enabled and availability flags. */
export declare function resolveMemoryVectorState(vector: {
    enabled: boolean;
    available?: boolean;
}): {
    tone: Tone;
    state: "ready" | "unavailable" | "disabled" | "unknown";
};
/** Resolve full-text search state from enabled and availability flags. */
export declare function resolveMemoryFtsState(fts: {
    enabled: boolean;
    available: boolean;
}): {
    tone: Tone;
    state: "ready" | "unavailable" | "disabled";
};
/** Format cache state as concise status text with optional entry count. */
export declare function resolveMemoryCacheSummary(cache: {
    enabled: boolean;
    entries?: number;
}): {
    tone: Tone;
    text: string;
};
