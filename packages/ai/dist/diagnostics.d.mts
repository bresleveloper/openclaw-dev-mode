import { a as ProviderRefusalReview, o as readProviderRefusalReview } from "./index-D27wAoOr.mjs";
import { At as extractDiagnosticError, Dt as DiagnosticErrorInfo, Et as AssistantMessageDiagnostic, Mt as isProviderRefusalAssistantError, Ot as appendAssistantMessageDiagnostic, a as AssistantMessage, jt as formatThrownValue, kt as createAssistantMessageDiagnostic } from "./types-DvzmWW8J.mjs";
import "./types-UlNana-2.mjs";
import { n as isResponsesOutputLimitToolCallError } from "./openai-responses-terminal-usage-CempLedn.mjs";
import { n as ProviderErrorRedactor, r as configureProviderErrorRedactor } from "./provider-error-xumb1V3F.mjs";
import { r as projectDiagnosticValue, t as DiagnosticProjectionPolicy } from "./credential-redaction-BKv49aiv.mjs";
import { n as formatModelTransportDebugUrl, r as emitModelTransportDebug, t as formatModelTransportDebugBaseUrl } from "./model-transport-url-C5f59L3Y.mjs";
//#region packages/ai/src/transports/openai-responses-stream-errors.d.ts
/** Resume only a response that could not have completed tools or exposed visible output. */
export declare function resolveResponsesOutputIdentityRetry(message: Pick<AssistantMessage, "errorCode"> & Partial<Pick<AssistantMessage, "stopReason" | "errorBody" | "content">>): "retry" | "stop" | undefined;
//#endregion
//#region packages/ai/src/utils/retryable-network-errors.d.ts
export declare const WEBSOCKET_NON_RETRYABLE_CLOSE_ERROR_CODE = "ERR_WEBSOCKET_NON_RETRYABLE_CLOSE";
export declare function hasRetryableConnectionErrorCode(message: string): boolean;
/** Returns true when any nested error proves a transient network failure. */
export declare function isTransientNetworkError(err: unknown): boolean;
//#endregion
export { AssistantMessageDiagnostic, DiagnosticErrorInfo, type DiagnosticProjectionPolicy, type ProviderErrorRedactor, type ProviderRefusalReview, appendAssistantMessageDiagnostic, configureProviderErrorRedactor, createAssistantMessageDiagnostic, emitModelTransportDebug, extractDiagnosticError, formatModelTransportDebugBaseUrl, formatModelTransportDebugUrl, formatThrownValue, isProviderRefusalAssistantError, isResponsesOutputLimitToolCallError, projectDiagnosticValue, readProviderRefusalReview };