/**
 * Races a promise against an AbortSignal while preserving normal promise
 * settlement. Abort wins immediately and rejected non-Error payloads are
 * normalized so callers can safely log/inspect them as Error objects.
 */
export declare function abortable<T>(signal: AbortSignal, promise: Promise<T>): Promise<T>;
