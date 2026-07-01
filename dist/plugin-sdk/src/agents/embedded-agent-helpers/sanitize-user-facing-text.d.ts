/** Format the billing failure copy with optional provider/model context.
 *
 * When `authMode` is `"oauth"` or `"token"` (i.e. Anthropic Max or a static
 * bearer-token subscription) the user has no API key to top up, so we emit
 * neutral copy that directs them to check their account instead (#80877).
 */
export declare function formatBillingErrorMessage(provider?: string, model?: string, authMode?: string): string;
export declare const BILLING_ERROR_USER_MESSAGE: string;
export declare function formatRateLimitOrOverloadedErrorCopy(raw: string): string | undefined;
export declare function formatTransportErrorCopy(raw: string): string | undefined;
export declare function formatDiskSpaceErrorCopy(raw: string): string | undefined;
export declare function isInvalidStreamingEventOrderError(raw: string): boolean;
export declare function isStreamingJsonParseError(raw: string): boolean;
export declare function getApiErrorPayloadFingerprint(raw?: string): string | null;
export declare function isRawApiErrorPayload(raw?: string): boolean;
export declare function isLikelyHttpErrorText(raw: string): boolean;
export declare function sanitizeUserFacingText(text: unknown, opts?: {
    errorContext?: boolean;
}): string;
