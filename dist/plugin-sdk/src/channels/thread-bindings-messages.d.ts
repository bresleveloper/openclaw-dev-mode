/** Formats thread-binding timeout durations for compact user-facing messages. */
export declare function formatThreadBindingDurationLabel(durationMs: number): string;
/** Builds the native thread name for a focused thread-bound session. */
export declare function resolveThreadBindingThreadName(params: {
    agentId?: string;
    label?: string;
}): string;
/** Builds the system-prefixed intro text posted when a thread binding becomes active. */
export declare function resolveThreadBindingIntroText(params: {
    agentId?: string;
    label?: string;
    idleTimeoutMs?: number;
    maxAgeMs?: number;
    sessionCwd?: string;
    sessionDetails?: string[];
}): string;
/** Builds the system-prefixed farewell text posted when a thread binding ends. */
export declare function resolveThreadBindingFarewellText(params: {
    reason?: string;
    farewellText?: string;
    idleTimeoutMs: number;
    maxAgeMs: number;
}): string;
