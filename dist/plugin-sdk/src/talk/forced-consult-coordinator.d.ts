/** Timer abstraction used so tests can inject deterministic fake timers. */
export type RealtimeVoiceForcedConsultTimer = {
    clear(): void;
};
/** Coordinator tuning and injectable clock/timer/matcher hooks. */
export type RealtimeVoiceForcedConsultCoordinatorOptions = {
    limit?: number;
    /** Window for matching late native consults to forced consult handles. */
    nativeDedupeMs?: number;
    now?: () => number;
    setTimer?: (fn: () => void, ms: number) => RealtimeVoiceForcedConsultTimer;
    questionsMatch?: (left: string | undefined, right: string | undefined) => boolean;
};
/** Stable handle for one forced consult lifecycle. */
export type RealtimeVoiceForcedConsultHandle<TContext = unknown> = {
    id: string;
    question: string;
    context?: TContext;
};
/** Classification of a native provider consult relative to forced consult state. */
export type RealtimeVoiceForcedConsultNativeMatch<TContext = unknown> = {
    kind: "none";
    question?: string;
} | {
    kind: "pending";
    question?: string;
    handle: RealtimeVoiceForcedConsultHandle<TContext>;
} | {
    kind: "in_flight";
    question?: string;
    handle: RealtimeVoiceForcedConsultHandle<TContext>;
} | {
    kind: "already_delivered";
    question?: string;
    handle: RealtimeVoiceForcedConsultHandle<TContext>;
};
export type RealtimeVoiceForcedConsultNativeRecentOptions = {
    /** Treat native calls without readable questions as recent generic consults. */
    allowUnknownQuestion?: boolean;
};
/** Public state machine for forced/native consult dedupe in a voice session. */
export type RealtimeVoiceForcedConsultCoordinator<TContext = unknown> = {
    prepare(question: string, options?: {
        context?: TContext;
        id?: string;
    }): RealtimeVoiceForcedConsultHandle<TContext> | undefined;
    schedule(handle: RealtimeVoiceForcedConsultHandle<TContext>, delayMs: number, run: (handle: RealtimeVoiceForcedConsultHandle<TContext>) => void): void;
    clearPending(): void;
    consumePending(question?: string): RealtimeVoiceForcedConsultHandle<TContext> | undefined;
    cancelPending(handle: RealtimeVoiceForcedConsultHandle<TContext>): void;
    recordNativeConsult(args: unknown, nativeCallId?: string): RealtimeVoiceForcedConsultNativeMatch<TContext>;
    markStarted(handle: RealtimeVoiceForcedConsultHandle<TContext>): void;
    markDelivered(handle: RealtimeVoiceForcedConsultHandle<TContext>): void;
    markCancelled(handle: RealtimeVoiceForcedConsultHandle<TContext>): void;
    isCancelled(handle: RealtimeVoiceForcedConsultHandle<TContext>): boolean;
    nativeCallIds(handle: RealtimeVoiceForcedConsultHandle<TContext>): readonly string[];
    handles(): readonly RealtimeVoiceForcedConsultHandle<TContext>[];
    rememberQuestion(handle: RealtimeVoiceForcedConsultHandle<TContext>, question: string): void;
    findRecent(question: string): RealtimeVoiceForcedConsultHandle<TContext> | undefined;
    hasRecent(question: string): boolean;
    hasRecentNativeConsult(question: string, options?: RealtimeVoiceForcedConsultNativeRecentOptions): boolean;
    remove(handle: RealtimeVoiceForcedConsultHandle<TContext>): void;
    clear(): void;
};
/** Create an in-memory forced-consult coordinator for one realtime session. */
export declare function createRealtimeVoiceForcedConsultCoordinator<TContext = unknown>(options?: RealtimeVoiceForcedConsultCoordinatorOptions): RealtimeVoiceForcedConsultCoordinator<TContext>;
