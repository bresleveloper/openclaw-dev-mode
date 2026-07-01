/** Random byte length for base64url device/node/bootstrap bearer tokens. */
export declare const PAIRING_TOKEN_BYTES = 32;
/** Generate a URL-safe bearer token for pairing and bootstrap flows. */
export declare function generatePairingToken(): string;
/** Verify nonblank pairing tokens with constant-time secret comparison. */
export declare function verifyPairingToken(provided: string, expected: string): boolean;
