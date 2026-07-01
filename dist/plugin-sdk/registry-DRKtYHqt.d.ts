import { _n as AcpRuntime } from "./types.openclaw-R57aE8ho.js";

//#region packages/acp-core/src/runtime/errors.d.ts
declare const ACP_ERROR_CODES: readonly ["ACP_BACKEND_MISSING", "ACP_BACKEND_UNAVAILABLE", "ACP_BACKEND_UNSUPPORTED_CONTROL", "ACP_DISPATCH_DISABLED", "ACP_INVALID_RUNTIME_OPTION", "ACP_SESSION_INIT_FAILED", "ACP_TURN_FAILED"];
type AcpRuntimeErrorCode = (typeof ACP_ERROR_CODES)[number];
/** Error type used at ACP runtime boundaries so callers can preserve structured failure codes. */
declare class AcpRuntimeError extends Error {
  readonly code: AcpRuntimeErrorCode;
  /**
   * Backend-specific structured failure code (e.g. acpx "SESSION_RESUME_REQUIRED"),
   * preserved so recovery decisions key on the failure kind rather than parsing
   * the human-readable message.
   */
  readonly detailCode?: string;
  readonly cause?: unknown;
  constructor(code: AcpRuntimeErrorCode, message: string, options?: {
    cause?: unknown;
    detailCode?: string;
  });
}
/** Recognizes local and cross-realm ACP runtime errors by their stable error code. */
declare function isAcpRuntimeError(value: unknown): value is AcpRuntimeError;
//#endregion
//#region src/acp/runtime/registry.d.ts
/** Registered ACP backend with optional health probe used for auto-selection. */
type AcpRuntimeBackend = {
  id: string;
  runtime: AcpRuntime;
  healthy?: () => boolean;
};
/** Registers or replaces an ACP runtime backend by normalized id. */
declare function registerAcpRuntimeBackend(backend: AcpRuntimeBackend): void;
/** Removes a registered ACP runtime backend by id. */
declare function unregisterAcpRuntimeBackend(id: string): void;
/** Resolves a backend by id, or the first healthy backend when no id is supplied. */
declare function getAcpRuntimeBackend(id?: string): AcpRuntimeBackend | null;
/** Resolves a healthy backend or throws a typed ACP runtime error. */
declare function requireAcpRuntimeBackend(id?: string): AcpRuntimeBackend;
//#endregion
export { unregisterAcpRuntimeBackend as a, isAcpRuntimeError as c, requireAcpRuntimeBackend as i, getAcpRuntimeBackend as n, AcpRuntimeError as o, registerAcpRuntimeBackend as r, AcpRuntimeErrorCode as s, AcpRuntimeBackend as t };