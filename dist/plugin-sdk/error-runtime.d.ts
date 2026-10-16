import { s as PlatformMessageNotDispatchedError } from "../deliver-types-Qc6HS898.js";
import { a as toErrorObject, i as readErrorName, n as collectErrorGraphCandidates, o as toStringifiedError, r as extractErrorCode, t as coerceErrorMessage } from "../error-coercion-BcU5CC86.js";
import { n as formatUncaughtError, t as formatErrorMessage } from "../errors-CfgKklp4.js";
//#region src/infra/error-diagnostics.d.ts
/** Attach operator diagnostics; callers must mask opaque credentials before attachment. */
export declare function attachErrorDiagnostic<T extends object>(error: T, diagnostic: string): T;
/** Terminal display only. Never classify this text or use it to decide retries. */
export declare function formatErrorMessageForDisplay(error: unknown, message?: string): string;
//#endregion
//#region src/infra/approval-errors.d.ts
/**
 * Detects approval-not-found failures across gateway error shapes.
 * Kept broad enough for legacy message-only errors emitted before structured codes.
 */
export declare function isApprovalNotFoundError(err: unknown): boolean;
//#endregion
//#region src/plugin-sdk/error-runtime.d.ts
/** Stable error code for subagent APIs called outside an authenticated gateway request. */
export declare const SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_CODE = "OPENCLAW_SUBAGENT_RUNTIME_REQUEST_SCOPE";
/** Default message paired with `SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_CODE`. */
export declare const SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_MESSAGE = "Plugin runtime subagent methods are only available during a gateway request.";
/** Error thrown when request-scoped plugin runtime APIs are used outside their scope. */
export declare class RequestScopedSubagentRuntimeError extends Error {
  code: string;
  constructor(message?: string);
}
//#endregion
export { PlatformMessageNotDispatchedError, coerceErrorMessage, collectErrorGraphCandidates, extractErrorCode, formatErrorMessage, formatUncaughtError, readErrorName, toErrorObject, toStringifiedError };