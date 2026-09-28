//#region packages/normalization-core/src/error-coercion.d.ts
/**
 * Normalizes an unknown thrown value into an Error. Non-Error objects become
 * the `cause` and have their enumerable fields copied so structured details
 * (codes, statuses) survive the coercion.
 */
declare function toErrorObject(value: unknown, fallbackMessage: string): Error;
/** Preserves Error values and stringifies every other value into a new Error. */
declare function toStringifiedError(value: unknown): Error;
/** Reads Error messages unchanged and stringifies every other value. */
declare function coerceErrorMessage(value: unknown): string;
/** Renders a non-Error cause as useful text without throwing. */
declare function stringifyNonErrorCause(value: unknown): string;
declare function extractErrorCode(err: unknown): string | undefined;
declare function readErrorName(err: unknown): string;
declare function collectErrorGraphCandidates(err: unknown, resolveNested?: (current: Record<string, unknown>) => Iterable<unknown>): unknown[];
//#endregion
export { stringifyNonErrorCause as a, readErrorName as i, collectErrorGraphCandidates as n, toErrorObject as o, extractErrorCode as r, toStringifiedError as s, coerceErrorMessage as t };