/** Structured error reason used while gateway startup sidecars are still initializing. */
export declare const GATEWAY_STARTUP_UNAVAILABLE_REASON = "startup-sidecars";
/** Internal close cause that distinguishes startup retry closes from generic disconnects. */
export declare const GATEWAY_STARTUP_PENDING_CLOSE_CAUSE = "startup-sidecars-pending";
/** WebSocket close code for temporary gateway unavailability. */
export declare const GATEWAY_STARTUP_CLOSE_CODE = 1013;
/** Human-readable WebSocket close reason for temporary gateway startup unavailability. */
export declare const GATEWAY_STARTUP_CLOSE_REASON = "gateway starting";
/** Default retry-after hint sent with startup-unavailable handshake errors. */
export declare const GATEWAY_STARTUP_RETRY_AFTER_MS = 500;
/** Details payload attached to retryable startup-unavailable gateway errors. */
export type GatewayStartupUnavailableDetails = {
    reason: typeof GATEWAY_STARTUP_UNAVAILABLE_REASON;
};
/** Builds the canonical startup-unavailable details payload. */
export declare function gatewayStartupUnavailableDetails(): GatewayStartupUnavailableDetails;
/** Detects the structured retryable error emitted while startup sidecars are pending. */
export declare function isRetryableGatewayStartupUnavailableError(error: unknown): boolean;
/** Resolves a bounded retry-after delay from a startup-unavailable error. */
export declare function resolveGatewayStartupRetryAfterMs(error: unknown): number | null;
