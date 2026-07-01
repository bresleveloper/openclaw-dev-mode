import { a as formatErrorMessage, i as extractErrorCode, l as readErrorName, n as collectErrorGraphCandidates, o as formatUncaughtError } from "./errors-BICDLNaN.js";

//#region src/infra/approval-errors.d.ts
/**
 * Detects approval-not-found failures across gateway error shapes.
 * Kept broad enough for legacy message-only errors emitted before structured codes.
 */
declare function isApprovalNotFoundError(err: unknown): boolean;
//#endregion
//#region src/plugin-sdk/error-runtime.d.ts
/** Stable error code for subagent APIs called outside an authenticated gateway request. */
declare const SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_CODE = "OPENCLAW_SUBAGENT_RUNTIME_REQUEST_SCOPE";
/** Default message paired with `SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_CODE`. */
declare const SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_MESSAGE = "Plugin runtime subagent methods are only available during a gateway request.";
/** Error thrown when request-scoped plugin runtime APIs are used outside their scope. */
declare class RequestScopedSubagentRuntimeError extends Error {
  code: string;
  constructor(message?: string);
}
//#endregion
export { RequestScopedSubagentRuntimeError, SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_CODE, SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_MESSAGE, collectErrorGraphCandidates, extractErrorCode, formatErrorMessage, formatUncaughtError, isApprovalNotFoundError, readErrorName };