import { o as ProviderRefusalReview, s as readProviderRefusalReview } from "./index-DSprYWaz.mjs";
import { At as extractDiagnosticError, Dt as DiagnosticErrorInfo, Et as AssistantMessageDiagnostic, Mt as isProviderRefusalAssistantError, Ot as appendAssistantMessageDiagnostic, a as AssistantMessage, jt as formatThrownValue, kt as createAssistantMessageDiagnostic } from "./types-CVYzKrMl.mjs";
import "./types-CBJthzJX.mjs";
import { n as isResponsesOutputLimitToolCallError } from "./openai-responses-terminal-usage-CpVjkqn-.mjs";
import { n as ProviderErrorRedactor, r as configureProviderErrorRedactor } from "./provider-error-CnaWYTRY.mjs";
import { i as projectDiagnosticValue, t as DiagnosticProjectionPolicy } from "./credential-redaction-XvsPf7Yi.mjs";
import { i as emitModelTransportError, n as formatModelTransportDebugUrl, r as emitModelTransportDebug, t as formatModelTransportDebugBaseUrl } from "./model-transport-url-BrsjjdjR.mjs";
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
export { AssistantMessageDiagnostic, DiagnosticErrorInfo, type DiagnosticProjectionPolicy, type ProviderErrorRedactor, type ProviderRefusalReview, appendAssistantMessageDiagnostic, configureProviderErrorRedactor, createAssistantMessageDiagnostic, emitModelTransportDebug, emitModelTransportError, extractDiagnosticError, formatModelTransportDebugBaseUrl, formatModelTransportDebugUrl, formatThrownValue, isProviderRefusalAssistantError, isResponsesOutputLimitToolCallError, projectDiagnosticValue, readProviderRefusalReview };