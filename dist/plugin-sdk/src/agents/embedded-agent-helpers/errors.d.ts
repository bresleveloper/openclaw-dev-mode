import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { AssistantMessage } from "../../llm/types.js";
export { extractLeadingHttpStatus, formatRawAssistantErrorForUi, isCloudflareOrHtmlErrorPage, isGenericProviderInternalError, parseApiErrorInfo, } from "../../shared/assistant-error-format.js";
import type { FailoverReason } from "./types.js";
export { BILLING_ERROR_USER_MESSAGE, formatBillingErrorMessage, formatRateLimitOrOverloadedErrorCopy, getApiErrorPayloadFingerprint, isRawApiErrorPayload, sanitizeUserFacingText, } from "./sanitize-user-facing-text.js";
export { isAuthErrorMessage, isAuthPermanentErrorMessage, isBillingErrorMessage, isOverloadedErrorMessage, isRateLimitErrorMessage, isServerErrorMessage, isTimeoutErrorMessage, } from "./failover-matches.js";
export declare const GENERIC_ASSISTANT_ERROR_TEXT = "LLM request failed.";
/** Detect provider errors that require reasoning to stay enabled. */
export declare function isReasoningConstraintErrorMessage(raw: string): boolean;
/** Detect explicit context-window overflow without confusing TPM rate limits. */
export declare function isContextOverflowError(errorMessage?: string): boolean;
export declare function isLikelyContextOverflowError(errorMessage?: string): boolean;
export declare function isCompactionFailureError(errorMessage?: string): boolean;
export declare function extractObservedOverflowTokenCount(errorMessage?: string): number | undefined;
export type FailoverSignal = {
    status?: number;
    code?: string;
    errorType?: string;
    message?: string;
    provider?: string;
    details?: readonly string[];
};
export type FailoverClassification = {
    kind: "reason";
    reason: FailoverReason;
} | {
    kind: "context_overflow";
};
export declare function extractFailoverSignalDetails(...values: unknown[]): string[] | undefined;
export type ProviderRuntimeFailureKind = "auth_scope" | "auth_refresh" | "refresh_timeout" | "refresh_contention" | "callback_timeout" | "callback_validation" | "auth_html"
/** Plain provider HTTP 401 auth failure that should not leak raw text to chat users. */
 | "auth_invalid_token" | "upstream_html" | "proxy" | "rate_limit" | "dns" | "timeout" | "model_not_found" | "schema" | "sandbox_blocked" | "replay_invalid" | "empty_response" | "no_error_details" | "unclassified" | "unknown";
export declare function inferSignalStatus(signal: FailoverSignal): number | undefined;
export declare function isUnclassifiedNoBodyHttpSignal(signal: FailoverSignal): boolean;
export declare function isTransientHttpError(raw: string): boolean;
export declare function classifyFailoverReasonFromHttpStatus(status: number | undefined, message?: string, opts?: {
    provider?: string;
}): FailoverReason | null;
export declare function isGenericUnknownStreamErrorMessage(raw: string): boolean;
export declare function classifyFailoverSignal(signal: FailoverSignal): FailoverClassification | null;
export declare function classifyProviderRuntimeFailureKind(signal: FailoverSignal | string): ProviderRuntimeFailureKind;
export declare function classifyAssistantFailoverReason(msg: AssistantMessage | undefined, opts?: {
    provider?: string;
}): FailoverReason | null;
export declare function formatAssistantErrorText(msg: AssistantMessage, opts?: {
    cfg?: OpenClawConfig;
    sessionKey?: string;
    provider?: string;
    model?: string;
    /** Credential auth mode (e.g. "oauth", "token", "api_key", "aws-sdk").
     * When "oauth" or "token", billing copy omits API-key language (#80877). */
    authMode?: string;
}): string | undefined;
export declare function isRawAssistantErrorPassthrough(params: {
    friendlyError?: string;
    rawError?: string;
}): boolean;
export declare function formatUserFacingAssistantErrorText(msg: AssistantMessage, opts?: {
    cfg?: OpenClawConfig;
    sessionKey?: string;
    provider?: string;
    model?: string;
    /** Credential auth mode for billing copy (#80877). */
    authMode?: string;
}): string;
export declare function isRateLimitAssistantError(msg: AssistantMessage | undefined): boolean;
export declare function isMissingToolCallInputError(raw: string): boolean;
export declare function isBillingAssistantError(msg: AssistantMessage | undefined): boolean;
export declare function parseImageDimensionError(raw: string): {
    maxDimensionPx?: number;
    messageIndex?: number;
    contentIndex?: number;
    raw: string;
} | null;
export declare function isImageDimensionErrorMessage(raw: string): boolean;
export declare function parseImageSizeError(raw: string): {
    maxMb?: number;
    raw: string;
} | null;
export declare function isImageSizeError(errorMessage?: string): boolean;
export declare function isCloudCodeAssistFormatError(raw: string): boolean;
export declare function isAuthAssistantError(msg: AssistantMessage | undefined): boolean;
export declare function classifyFailoverReason(raw: string, opts?: {
    provider?: string;
}): FailoverReason | null;
export declare function isFailoverErrorMessage(raw: string, opts?: {
    provider?: string;
}): boolean;
export declare function isFailoverAssistantError(msg: AssistantMessage | undefined): boolean;
