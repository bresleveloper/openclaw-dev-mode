/** Provider request error classes that get a specialized user-facing reply. */
export type ProviderRequestErrorCode = "provider_conversation_state_error" | "provider_internal_error" | "provider_rate_limit_or_quota_error";
/** Structured provider error classification for reply failure handling. */
export type ProviderRequestErrorClassification = {
    code: ProviderRequestErrorCode;
    userMessage: string;
    technicalMessage: string;
};
/** User-facing copy for provider-side broken conversation state. */
export declare const PROVIDER_CONVERSATION_STATE_ERROR_USER_MESSAGE = "\u26A0\uFE0F The model provider rejected the conversation state. Please try again, or use /new to start a fresh session.";
export declare const PROVIDER_RATE_LIMIT_OR_QUOTA_ERROR_USER_MESSAGE = "\u26A0\uFE0F The model provider returned HTTP 429 before replying. This can mean rate limiting, exhausted quota, or an account balance/billing issue. Check the selected provider/model, API key, and provider billing/quota dashboard, then try again.";
export declare const PROVIDER_INTERNAL_ERROR_USER_MESSAGE = "\u26A0\uFE0F The model provider returned a temporary internal error before replying. Try again in a moment, or switch to another model if it keeps happening.";
/** Classifies provider request failures that are actionable for users. */
export declare function classifyProviderRequestError(err: unknown): ProviderRequestErrorClassification | undefined;
/** Detects provider errors that indicate invalid conversation/tool turn state. */
export declare function isProviderConversationStateErrorMessage(message: string): boolean;
