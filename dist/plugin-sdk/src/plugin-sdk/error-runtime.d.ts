/** Stable error code for subagent APIs called outside an authenticated gateway request. */
export declare const SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_CODE = "OPENCLAW_SUBAGENT_RUNTIME_REQUEST_SCOPE";
/** Default message paired with `SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_CODE`. */
export declare const SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_MESSAGE = "Plugin runtime subagent methods are only available during a gateway request.";
/** Error thrown when request-scoped plugin runtime APIs are used outside their scope. */
export declare class RequestScopedSubagentRuntimeError extends Error {
    code: string;
    constructor(message?: string);
}
export { collectErrorGraphCandidates, extractErrorCode, formatErrorMessage, formatUncaughtError, readErrorName, } from "../infra/errors.js";
export { isApprovalNotFoundError } from "../infra/approval-errors.ts";
