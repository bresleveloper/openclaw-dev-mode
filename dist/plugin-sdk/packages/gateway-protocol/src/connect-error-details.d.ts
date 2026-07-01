/** Structured connect-error codes carried in gateway error `details.code`. */
export declare const ConnectErrorDetailCodes: {
    readonly AUTH_REQUIRED: "AUTH_REQUIRED";
    readonly AUTH_UNAUTHORIZED: "AUTH_UNAUTHORIZED";
    readonly AUTH_TOKEN_MISSING: "AUTH_TOKEN_MISSING";
    readonly AUTH_TOKEN_MISMATCH: "AUTH_TOKEN_MISMATCH";
    readonly AUTH_TOKEN_NOT_CONFIGURED: "AUTH_TOKEN_NOT_CONFIGURED";
    readonly AUTH_PASSWORD_MISSING: "AUTH_PASSWORD_MISSING";
    readonly AUTH_PASSWORD_MISMATCH: "AUTH_PASSWORD_MISMATCH";
    readonly AUTH_PASSWORD_NOT_CONFIGURED: "AUTH_PASSWORD_NOT_CONFIGURED";
    readonly AUTH_BOOTSTRAP_TOKEN_INVALID: "AUTH_BOOTSTRAP_TOKEN_INVALID";
    readonly AUTH_DEVICE_TOKEN_MISMATCH: "AUTH_DEVICE_TOKEN_MISMATCH";
    readonly AUTH_SCOPE_MISMATCH: "AUTH_SCOPE_MISMATCH";
    readonly AUTH_RATE_LIMITED: "AUTH_RATE_LIMITED";
    readonly AUTH_TAILSCALE_IDENTITY_MISSING: "AUTH_TAILSCALE_IDENTITY_MISSING";
    readonly AUTH_TAILSCALE_PROXY_MISSING: "AUTH_TAILSCALE_PROXY_MISSING";
    readonly AUTH_TAILSCALE_WHOIS_FAILED: "AUTH_TAILSCALE_WHOIS_FAILED";
    readonly AUTH_TAILSCALE_IDENTITY_MISMATCH: "AUTH_TAILSCALE_IDENTITY_MISMATCH";
    readonly CONTROL_UI_ORIGIN_NOT_ALLOWED: "CONTROL_UI_ORIGIN_NOT_ALLOWED";
    readonly PROTOCOL_MISMATCH: "PROTOCOL_MISMATCH";
    readonly CONTROL_UI_DEVICE_IDENTITY_REQUIRED: "CONTROL_UI_DEVICE_IDENTITY_REQUIRED";
    readonly DEVICE_IDENTITY_REQUIRED: "DEVICE_IDENTITY_REQUIRED";
    readonly DEVICE_AUTH_INVALID: "DEVICE_AUTH_INVALID";
    readonly DEVICE_AUTH_DEVICE_ID_MISMATCH: "DEVICE_AUTH_DEVICE_ID_MISMATCH";
    readonly DEVICE_AUTH_SIGNATURE_EXPIRED: "DEVICE_AUTH_SIGNATURE_EXPIRED";
    readonly DEVICE_AUTH_NONCE_REQUIRED: "DEVICE_AUTH_NONCE_REQUIRED";
    readonly DEVICE_AUTH_NONCE_MISMATCH: "DEVICE_AUTH_NONCE_MISMATCH";
    readonly DEVICE_AUTH_SIGNATURE_INVALID: "DEVICE_AUTH_SIGNATURE_INVALID";
    readonly DEVICE_AUTH_PUBLIC_KEY_INVALID: "DEVICE_AUTH_PUBLIC_KEY_INVALID";
    readonly PAIRING_REQUIRED: "PAIRING_REQUIRED";
    readonly CLIENT_VERSION_MISMATCH: "CLIENT_VERSION_MISMATCH";
};
export type ConnectErrorDetailCode = (typeof ConnectErrorDetailCodes)[keyof typeof ConnectErrorDetailCodes];
/** Pairing-specific reasons clients can display and use for reconnect policy. */
export declare const ConnectPairingRequiredReasons: {
    readonly NOT_PAIRED: "not-paired";
    readonly ROLE_UPGRADE: "role-upgrade";
    readonly SCOPE_UPGRADE: "scope-upgrade";
    readonly METADATA_UPGRADE: "metadata-upgrade";
};
export type ConnectPairingRequiredReason = (typeof ConnectPairingRequiredReasons)[keyof typeof ConnectPairingRequiredReasons];
/** Suggested client-side recovery action for structured connect errors. */
export type ConnectRecoveryNextStep = "retry_with_device_token" | "update_auth_configuration" | "update_auth_credentials" | "wait_then_retry" | "review_auth_configuration";
/** Optional retry guidance extracted from gateway connect-error details. */
export type ConnectErrorRecoveryAdvice = {
    canRetryWithDeviceToken?: boolean;
    recommendedNextStep?: ConnectRecoveryNextStep;
};
/** Full structured details for pairing-required connect failures. */
export type PairingConnectErrorDetails = {
    code: typeof ConnectErrorDetailCodes.PAIRING_REQUIRED;
    reason?: ConnectPairingRequiredReason;
    requestId?: string;
    remediationHint?: string;
    recommendedNextStep?: ConnectRecoveryNextStep;
    retryable?: boolean;
    pauseReconnect?: boolean;
    deviceId?: string;
    requestedRole?: string;
    requestedScopes?: string[];
    approvedRoles?: string[];
    approvedScopes?: string[];
};
/** Compact pairing-required subset used by reconnect/status surfaces. */
export type ConnectPairingRequiredDetails = Pick<PairingConnectErrorDetails, "reason" | "requestId">;
/** Maps internal auth failure reasons to public connect-error detail codes. */
export declare function resolveAuthConnectErrorDetailCode(reason: string | undefined): ConnectErrorDetailCode;
/** Maps device-auth verifier reasons to public connect-error detail codes. */
export declare function resolveDeviceAuthConnectErrorDetailCode(reason: string | undefined): ConnectErrorDetailCode;
/** Reads a non-empty detail code from an untrusted error details payload. */
export declare function readConnectErrorDetailCode(details: unknown): string | null;
/** Extracts normalized retry advice from untrusted connect-error details. */
export declare function readConnectErrorRecoveryAdvice(details: unknown): ConnectErrorRecoveryAdvice;
/** Normalizes pairing request ids before echoing them in close reasons or UI text. */
export declare function normalizePairingConnectRequestId(value: unknown): string | undefined;
/** Human-readable requirement summary for a pairing-required reason. */
export declare function describePairingConnectRequirement(reason: ConnectPairingRequiredReason | undefined): string;
/** Builds the gateway close/error message for a pairing-required connect failure. */
export declare function buildPairingConnectErrorMessage(reason: ConnectPairingRequiredReason | undefined): string;
/** Short user-facing recovery title for pairing-required connect failures. */
export declare function buildPairingConnectRecoveryTitle(reason: ConnectPairingRequiredReason | undefined): string;
/** Builds sanitized structured details for a pairing-required connect failure. */
export declare function buildPairingConnectErrorDetails(params: {
    reason: ConnectPairingRequiredReason | undefined;
    requestId?: string;
    remediationHint?: string;
    recommendedNextStep?: ConnectRecoveryNextStep;
    retryable?: boolean;
    pauseReconnect?: boolean;
    deviceId?: string;
    requestedRole?: string;
    requestedScopes?: string[];
    approvedRoles?: string[];
    approvedScopes?: string[];
}): PairingConnectErrorDetails;
/** Builds a sanitized close reason string for WebSocket pairing rejections. */
export declare function buildPairingConnectCloseReason(params: {
    reason: ConnectPairingRequiredReason | undefined;
    requestId?: string;
}): string;
/** Reads and backfills pairing-required details from an untrusted details object. */
export declare function readPairingConnectErrorDetails(details: unknown): PairingConnectErrorDetails | null;
/** Parses legacy/string-only pairing-required messages into structured details. */
export declare function readConnectPairingRequiredMessage(message: string | null | undefined): ConnectPairingRequiredDetails | null;
/** Formats pairing-required details into the canonical user-facing message. */
export declare function formatConnectPairingRequiredMessage(details: unknown): string;
/** Formats connect errors using structured details before falling back to raw messages. */
export declare function formatConnectErrorMessage(params: {
    message?: string;
    details?: unknown;
}): string;
