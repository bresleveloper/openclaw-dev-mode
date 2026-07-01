export type OAuthRefreshFailureReason = "refresh_token_reused" | "invalid_grant" | "sign_in_again" | "invalid_refresh_token" | "revoked";
type OAuthRefreshFailure = {
    provider: string | null;
    reason: OAuthRefreshFailureReason | null;
};
/** Error type that carries provider and classified OAuth refresh failure reason. */
export declare class OAuthRefreshFailureError extends Error {
    readonly provider: string;
    readonly reason: OAuthRefreshFailureReason | null;
    constructor(params: {
        provider: string;
        message: string;
        cause?: unknown;
    });
}
/** Classify a raw OAuth refresh failure message into a stable reason code. */
export declare function classifyOAuthRefreshFailureReason(message: string): OAuthRefreshFailureReason | null;
/** Classify provider/reason from a user-facing OAuth refresh failure message. */
export declare function classifyOAuthRefreshFailure(message: string): OAuthRefreshFailure | null;
/** Classify provider/reason from the structured OAuth refresh failure error. */
export declare function classifyOAuthRefreshFailureError(err: unknown): OAuthRefreshFailure | null;
/** Build the login command operators should run after OAuth refresh failure. */
export declare function buildOAuthRefreshFailureLoginCommand(provider: string | null | undefined): string;
export {};
