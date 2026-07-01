/**
 * Retention and clock controls for realtime voice turn context tracking.
 */
export type RealtimeVoiceTurnContextTrackerOptions = {
    limit?: number;
    ignoredContextTtlMs?: number;
    now?: () => number;
    deferUntilAudio?: boolean;
};
/**
 * Mutable handle for a single realtime voice turn and caller-owned per-turn metadata.
 */
export type RealtimeVoiceTurnContextHandle<TContext, TExtra extends object = Record<never, never>> = TExtra & {
    id: string;
    context: TContext;
    hasAudio: boolean;
    closed: boolean;
    startedAt: number;
    lastAudioAt?: number;
};
type RealtimeVoiceTurnContextOpenArgs<TExtra extends object> = keyof TExtra extends never ? [extra?: TExtra] : [extra: TExtra];
/**
 * Tracks which realtime voice turn context should be attached to the next audio-bearing response.
 */
export type RealtimeVoiceTurnContextTracker<TContext, TExtra extends object = Record<never, never>> = {
    open(context: TContext, ...extra: RealtimeVoiceTurnContextOpenArgs<TExtra>): RealtimeVoiceTurnContextHandle<TContext, TExtra>;
    markAudio(handle: RealtimeVoiceTurnContextHandle<TContext, TExtra>): void;
    close(handle: RealtimeVoiceTurnContextHandle<TContext, TExtra>): void;
    consumeAudioContext(): TContext | undefined;
    peekAudioTurn(): RealtimeVoiceTurnContextHandle<TContext, TExtra> | undefined;
    hasAudioContext(): boolean;
    rememberIgnoredContext(context: TContext | undefined): void;
    consumeIgnoredContext(): TContext | undefined;
    size(): number;
    clear(): void;
};
export declare function createRealtimeVoiceTurnContextTracker<TContext, TExtra extends object = Record<never, never>>(options?: RealtimeVoiceTurnContextTrackerOptions): RealtimeVoiceTurnContextTracker<TContext, TExtra>;
export {};
