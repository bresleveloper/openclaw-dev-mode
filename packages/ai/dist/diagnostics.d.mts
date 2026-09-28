import { a as ProviderRefusalReview, o as readProviderRefusalReview } from "./index-C25RT6bP.mjs";
import { a as AssistantMessage, dt as DiagnosticErrorInfo, ft as appendAssistantMessageDiagnostic, gt as isProviderRefusalAssistantError, ht as formatThrownValue, mt as extractDiagnosticError, pt as createAssistantMessageDiagnostic, ut as AssistantMessageDiagnostic } from "./types-qZFbaDbK.mjs";
import "./types-DTvddOfm.mjs";
import { n as isResponsesOutputLimitToolCallError } from "./openai-responses-terminal-usage-BNFbvY9f.mjs";
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