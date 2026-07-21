//#region packages/normalization-core/src/error-coercion.d.ts
/**
 * Normalizes an unknown thrown value into an Error. Non-Error objects become
 * the `cause` and have their enumerable fields copied so structured details
 * (codes, statuses) survive the coercion.
 */
declare function toErrorObject(value: unknown, fallbackMessage: string): Error;
//#endregion
export { toErrorObject as t };