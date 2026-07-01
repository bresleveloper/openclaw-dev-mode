/** Returns a number only when the input is already finite. */
export declare function asFiniteNumber(value: unknown): number | undefined;
/** Returns a finite number only when it satisfies the supplied inclusive/exclusive bounds. */
export declare function asFiniteNumberInRange(value: unknown, range: {
    min?: number;
    max?: number;
    minExclusive?: boolean;
    maxExclusive?: boolean;
}): number | undefined;
/** Returns a safe integer only when it satisfies the supplied inclusive bounds. */
export declare function asSafeIntegerInRange(value: unknown, range: {
    min?: number;
    max?: number;
}): number | undefined;
/** Parses finite numbers from number values or strict numeric string tokens. */
export declare function parseFiniteNumber(value: unknown): number | undefined;
/** Parses only safe integer numbers or base-10 integer strings. */
export declare function parseStrictInteger(value: unknown): number | undefined;
/** Parses only finite decimal/scientific string tokens, rejecting partial numbers. */
export declare function parseStrictFiniteNumber(value: unknown): number | undefined;
/** Returns positive safe integers without string coercion. */
export declare function asPositiveSafeInteger(value: unknown): number | undefined;
/** Conservative upper bound for Node timer delays. */
export declare const MAX_TIMER_TIMEOUT_MS = 2147000000;
/** Timer bound expressed in whole seconds for env/config inputs. */
export declare const MAX_TIMER_TIMEOUT_SECONDS: number;
/** Largest timestamp accepted by JavaScript Date. */
export declare const MAX_DATE_TIMESTAMP_MS = 8640000000000000;
/** Fallback ISO value for invalid timestamp inputs. */
export declare const UNIX_EPOCH_ISO_STRING = "1970-01-01T00:00:00.000Z";
/** Returns a Date-valid millisecond timestamp. */
export declare function asDateTimestampMs(value: unknown): number | undefined;
/** Checks whether a Date-valid timestamp is after the supplied/current time. */
export declare function isFutureDateTimestampMs(value: unknown, opts?: {
    nowMs?: number;
}): value is number;
/** Converts Date-valid millisecond timestamps to ISO strings. */
export declare function timestampMsToIsoString(value: unknown): string | undefined;
/** Resolves a Date-valid timestamp with a Date-valid fallback. */
export declare function resolveDateTimestampMs(value: unknown, fallbackValue?: unknown): number;
/** Resolves a Date-valid timestamp to ISO, falling back to Unix epoch if needed. */
export declare function resolveTimestampMsToIsoString(value: unknown, fallbackValue?: unknown): string;
/** Formats Date-valid timestamps for filenames by replacing colon separators. */
export declare function timestampMsToIsoFileStamp(value: unknown, fallbackValue?: unknown): string;
/** Clamps finite millisecond values into the Node-safe timer range. */
export declare function clampTimerTimeoutMs(valueMs: unknown, minMs?: number): number | undefined;
/** Clamps positive finite millisecond values into the Node-safe timer range. */
export declare function clampPositiveTimerTimeoutMs(valueMs: unknown): number | undefined;
/** Resolves a positive timer timeout or falls back through safe timer clamping. */
export declare function resolvePositiveTimerTimeoutMs(valueMs: unknown, fallbackMs: number): number;
/** Resolves arbitrary timeout input with fallback and minimum timer bounds. */
export declare function resolveTimerTimeoutMs(valueMs: unknown, fallbackMs: number, minMs?: number): number;
/** Adds grace time to a finite timeout and clamps the result to Node-safe bounds. */
export declare function addTimerTimeoutGraceMs(timeoutMs: unknown, graceMs?: number): number | undefined;
/** Converts finite positive seconds to Node-safe milliseconds. */
export declare function finiteSecondsToTimerSafeMilliseconds(value: unknown, opts?: {
    floorSeconds?: boolean;
}): number | undefined;
/** Resolves an integer option from finite numeric input or fallback, then clamps bounds. */
export declare function resolveIntegerOption(value: unknown, fallback: number, range?: {
    min?: number;
    max?: number;
}): number;
/** Resolves an optional integer option, returning undefined for non-finite input. */
export declare function resolveOptionalIntegerOption(value: unknown, range?: {
    min?: number;
    max?: number;
}): number | undefined;
/** Resolves an integer option with a non-negative lower bound. */
export declare function resolveNonNegativeIntegerOption(value: unknown, fallback: number): number;
/** Parses strict positive integer values from numbers or strings. */
export declare function parseStrictPositiveInteger(value: unknown): number | undefined;
/** Parses strict non-negative integer values from numbers or strings. */
export declare function parseStrictNonNegativeInteger(value: unknown): number | undefined;
/** Converts strict positive seconds to safe millisecond counts. */
export declare function positiveSecondsToSafeMilliseconds(value: unknown): number | undefined;
/** Converts strict non-negative seconds to safe millisecond counts. */
export declare function nonNegativeSecondsToSafeMilliseconds(value: unknown): number | undefined;
/** Resolves an absolute expiration timestamp from a positive duration in milliseconds. */
export declare function resolveExpiresAtMsFromDurationMs(value: unknown, opts?: {
    nowMs?: number;
    bufferMs?: number;
    minRemainingMs?: number;
}): number | undefined;
/** Resolves an absolute expiration timestamp from a positive duration in seconds. */
export declare function resolveExpiresAtMsFromDurationSeconds(value: unknown, opts?: {
    nowMs?: number;
    bufferMs?: number;
    minRemainingMs?: number;
}): number | undefined;
/** Resolves an absolute expiration timestamp from Unix epoch seconds. */
export declare function resolveExpiresAtMsFromEpochSeconds(value: unknown, opts?: {
    bufferMs?: number;
    maxMs?: number;
}): number | undefined;
/** Resolves expiration input that may be relative seconds, epoch seconds, or epoch milliseconds. */
export declare function resolveExpiresAtMsFromDurationOrEpoch(value: unknown, opts?: {
    nowMs?: number;
    relativeSecondsThreshold?: number;
    absoluteMillisecondsThreshold?: number;
}): number | undefined;
