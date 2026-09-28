//#region src/infra/errors.d.ts
declare function formatErrorMessage(err: unknown): string;
declare function formatUncaughtError(err: unknown): string;
//#endregion
export { formatUncaughtError as n, formatErrorMessage as t };