import "./config-contracts-CY87ANNp.js";
//#region src/infra/error-diagnostics.d.ts
/** Attach operator diagnostics; callers must mask opaque credentials before attachment. */
declare function attachErrorDiagnostic<T extends object>(error: T, diagnostic: string): T;
/** Terminal display only. Never classify this text or use it to decide retries. */
declare function formatErrorMessageForDisplay(error: unknown, message?: string): string;
//#endregion
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
export { attachErrorDiagnostic as a, isApprovalNotFoundError as i, SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_CODE as n, formatErrorMessageForDisplay as o, SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_MESSAGE as r, RequestScopedSubagentRuntimeError as t };