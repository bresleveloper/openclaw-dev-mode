import { At as DiagnosticErrorInfo, Ft as formatThrownValue, It as isProviderRefusalAssistantError, Lt as readProviderRefusalReview, Mt as appendAssistantMessageDiagnostic, Nt as createAssistantMessageDiagnostic, Pt as extractDiagnosticError, Rt as recordSuppressedReasoning, a as AssistantMessage, jt as ProviderRefusalReview, kt as AssistantMessageDiagnostic } from "./types-B1ZIh9Ch.mjs";
import "./types-CeCl7cJZ.mjs";
import { r as isResponsesOutputLimitToolCallError } from "./openai-responses-terminal-usage-C4OrCx69.mjs";
import { n as ProviderErrorRedactor, r as configureProviderErrorRedactor } from "./provider-error-DZMru0Jv.mjs";
import { r as projectDiagnosticValue, t as DiagnosticProjectionPolicy } from "./credential-redaction-BNv5SWQz.mjs";
import { i as emitModelTransportError, n as formatModelTransportDebugUrl, r as emitModelTransportDebug, t as formatModelTransportDebugBaseUrl } from "./model-transport-url-Dad-sfx2.mjs";
/** Resume only a response that could not have completed tools or exposed visible output. */
export declare function resolveResponsesOutputIdentityRetry(message: Pick<AssistantMessage, "errorCode"> & Partial<Pick<AssistantMessage, "stopReason" | "errorBody" | "content">>): "retry" | "stop" | undefined;
export declare const WEBSOCKET_NON_RETRYABLE_CLOSE_ERROR_CODE = "ERR_WEBSOCKET_NON_RETRYABLE_CLOSE";
export declare function hasRetryableConnectionErrorCode(message: string): boolean;
/** Returns true when any nested error proves a transient network failure. */
export declare function isTransientNetworkError(err: unknown): boolean;
export { AssistantMessageDiagnostic, DiagnosticErrorInfo, type DiagnosticProjectionPolicy, type ProviderErrorRedactor, ProviderRefusalReview, appendAssistantMessageDiagnostic, configureProviderErrorRedactor, createAssistantMessageDiagnostic, emitModelTransportDebug, emitModelTransportError, extractDiagnosticError, formatModelTransportDebugBaseUrl, formatModelTransportDebugUrl, formatThrownValue, isProviderRefusalAssistantError, isResponsesOutputLimitToolCallError, projectDiagnosticValue, readProviderRefusalReview, recordSuppressedReasoning };