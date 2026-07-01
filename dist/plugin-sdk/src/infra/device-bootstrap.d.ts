import { type DeviceBootstrapProfile, type DeviceBootstrapProfileInput } from "../shared/device-bootstrap-profile.js";
/** Bootstrap pairing tokens are short-lived bearer credentials for first device auth. */
export declare const DEVICE_BOOTSTRAP_TOKEN_TTL_MS: number;
/** Persisted bootstrap token state, including binding and role/scope redemption progress. */
type DeviceBootstrapTokenRecord = {
    token: string;
    ts: number;
    deviceId?: string;
    publicKey?: string;
    profile?: DeviceBootstrapProfile;
    redeemedProfile?: DeviceBootstrapProfile;
    pendingProfile?: DeviceBootstrapProfile;
    roles?: string[];
    scopes?: string[];
    issuedAtMs: number;
    lastUsedAtMs?: number;
};
/** Issue a short-lived bootstrap token with a bounded role/scope handoff profile. */
export declare function issueDeviceBootstrapToken(params?: {
    baseDir?: string;
    profile?: DeviceBootstrapProfileInput;
    roles?: readonly string[];
    scopes?: readonly string[];
}): Promise<{
    token: string;
    expiresAtMs: number;
}>;
/** Remove every outstanding bootstrap token from the pairing state file. */
export declare function clearDeviceBootstrapTokens(params?: {
    baseDir?: string;
}): Promise<{
    removed: number;
}>;
/** Revoke one bootstrap token and return its record for best-effort restore flows. */
export declare function revokeDeviceBootstrapToken(params: {
    token: string;
    baseDir?: string;
}): Promise<{
    removed: boolean;
    record?: DeviceBootstrapTokenRecord;
}>;
/** Revoke bootstrap tokens that are already bound to a specific device identity. */
export declare function revokeDeviceBootstrapTokensForDevice(params: {
    deviceId: string;
    publicKey: string;
    baseDir?: string;
}): Promise<{
    removed: number;
}>;
/** Restore a previously revoked bootstrap token record after a downstream send failure. */
export declare function restoreDeviceBootstrapToken(params: {
    record: DeviceBootstrapTokenRecord;
    baseDir?: string;
}): Promise<void>;
/** Read the issued profile for a valid token without binding or redeeming it. */
export declare function getDeviceBootstrapTokenProfile(params: {
    token: string;
    baseDir?: string;
}): Promise<DeviceBootstrapProfile | null>;
/** Record that one role/scope leg of a multi-role bootstrap handoff was redeemed. */
export declare function redeemDeviceBootstrapTokenProfile(params: {
    token: string;
    role: string;
    scopes: readonly string[];
    baseDir?: string;
}): Promise<{
    recorded: boolean;
    fullyRedeemed: boolean;
}>;
/** Verify a bootstrap token, bind it to the first device identity, and stage requested scopes. */
export declare function verifyDeviceBootstrapToken(params: {
    token: string;
    deviceId: string;
    publicKey: string;
    role: string;
    scopes: readonly string[];
    baseDir?: string;
}): Promise<{
    ok: true;
} | {
    ok: false;
    reason: string;
}>;
/**
 * Reads the already-bound bootstrap profile for a verified device identity.
 *
 * Call this only after `verifyDeviceBootstrapToken()` has returned `{ ok: true }`
 * for the same `token` / `deviceId` / `publicKey` tuple in the current handshake.
 */
export declare function getBoundDeviceBootstrapProfile(params: {
    token: string;
    deviceId: string;
    publicKey: string;
    baseDir?: string;
}): Promise<DeviceBootstrapProfile | null>;
export {};
