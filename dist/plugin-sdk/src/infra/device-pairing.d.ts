import { type DeviceBootstrapProfile } from "../shared/device-bootstrap-profile.js";
/** Pending device pairing request awaiting owner approval. */
export type DevicePairingPendingRequest = {
    requestId: string;
    deviceId: string;
    publicKey: string;
    displayName?: string;
    platform?: string;
    deviceFamily?: string;
    clientId?: string;
    clientMode?: string;
    role?: string;
    roles?: string[];
    scopes?: string[];
    remoteIp?: string;
    silent?: boolean;
    isRepair?: boolean;
    ts: number;
};
/** Bearer token issued to one paired device role. */
export type DeviceAuthToken = {
    token: string;
    role: string;
    scopes: string[];
    issuer?: {
        kind: "shared-gateway-auth";
        generation: string;
    };
    createdAtMs: number;
    rotatedAtMs?: number;
    revokedAtMs?: number;
    lastUsedAtMs?: number;
};
/** Redacted token metadata safe for list/status responses. */
export type DeviceAuthTokenSummary = {
    role: string;
    scopes: string[];
    createdAtMs: number;
    rotatedAtMs?: number;
    revokedAtMs?: number;
    lastUsedAtMs?: number;
};
/** Deny reasons returned when rotating an existing paired-device token. */
export type RotateDeviceTokenDenyReason = "unknown-device-or-role" | "missing-approved-scope-baseline" | "scope-outside-approved-baseline" | "caller-missing-scope";
/** Token rotation result with the replacement token entry on success. */
export type RotateDeviceTokenResult = {
    ok: true;
    entry: DeviceAuthToken;
} | {
    ok: false;
    reason: RotateDeviceTokenDenyReason;
    scope?: string;
};
export type RevokeDeviceTokenDenyReason = "unknown-device-or-role" | "caller-missing-scope";
/** Token revocation result with the revoked entry on success. */
export type RevokeDeviceTokenResult = {
    ok: true;
    entry: DeviceAuthToken;
} | {
    ok: false;
    reason: RevokeDeviceTokenDenyReason;
    scope?: string;
};
/** Persisted approved device record, including durable approval and active role tokens. */
export type PairedDevice = {
    deviceId: string;
    publicKey: string;
    displayName?: string;
    platform?: string;
    deviceFamily?: string;
    clientId?: string;
    clientMode?: string;
    role?: string;
    roles?: string[];
    scopes?: string[];
    approvedScopes?: string[];
    remoteIp?: string;
    tokens?: Record<string, DeviceAuthToken>;
    createdAtMs: number;
    approvedAtMs: number;
    lastSeenAtMs?: number;
    lastSeenReason?: string;
};
/** Metadata fields a device may refresh without changing approval or token state. */
export type PairedDeviceMetadataPatch = Pick<PairedDevice, "displayName" | "platform" | "clientId" | "clientMode" | "remoteIp" | "lastSeenAtMs" | "lastSeenReason">;
/** Paired-device access metadata refreshed when an existing device reconnects. */
export type DevicePairingAccessMetadata = Pick<PairedDevice, "displayName" | "remoteIp" | "lastSeenAtMs" | "lastSeenReason">;
/** Combined pending/paired view returned by pairing list APIs. */
export type DevicePairingList = {
    pending: DevicePairingPendingRequest[];
    paired: PairedDevice[];
};
/** Authorization failure categories for owner approval and bootstrap approval flows. */
export type DevicePairingForbiddenReason = "caller-scopes-required" | "caller-missing-scope" | "scope-outside-requested-roles" | "bootstrap-role-not-allowed" | "bootstrap-scope-not-allowed";
/** Structured forbidden result with the missing/disallowed role or scope when known. */
export type DevicePairingForbiddenResult = {
    status: "forbidden";
    reason: DevicePairingForbiddenReason;
    scope?: string;
    role?: string;
};
/** Pairing approval outcome: approved, forbidden with reason, or request not found. */
export type ApproveDevicePairingResult = {
    status: "approved";
    requestId: string;
    device: PairedDevice;
} | DevicePairingForbiddenResult | null;
/** Format a device-pairing authorization failure for CLI/API callers. */
export declare function formatDevicePairingForbiddenMessage(result: DevicePairingForbiddenResult): string;
/** List the durable roles an owner approved for a paired device record. */
export declare function listApprovedPairedDeviceRoles(device: Pick<PairedDevice, "role" | "roles">): string[];
/** List active-token roles, bounded by the durable approved pairing roles. */
export declare function listEffectivePairedDeviceRoles(device: Pick<PairedDevice, "role" | "roles" | "tokens">): string[];
/** Return whether a paired device currently has an active token for one role. */
export declare function hasEffectivePairedDeviceRole(device: Pick<PairedDevice, "role" | "roles" | "tokens">, role: string): boolean;
export declare function listDevicePairing(baseDir?: string): Promise<DevicePairingList>;
/** Return one paired device by normalized device id. */
export declare function getPairedDevice(deviceId: string, baseDir?: string): Promise<PairedDevice | null>;
/** Return one pending pairing request by request id. */
export declare function getPendingDevicePairing(requestId: string, baseDir?: string): Promise<DevicePairingPendingRequest | null>;
/** Create or refresh a pending device pairing request for owner approval. */
export declare function requestDevicePairing(req: Omit<DevicePairingPendingRequest, "requestId" | "ts" | "isRepair">, baseDir?: string): Promise<{
    status: "pending";
    request: DevicePairingPendingRequest;
    created: boolean;
}>;
/** Approve a pending request with optional caller-scope checks for operator grants. */
export declare function approveDevicePairing(requestId: string, baseDir?: string): Promise<ApproveDevicePairingResult>;
export declare function approveDevicePairing(requestId: string, options: {
    callerScopes?: readonly string[];
    accessMetadata?: DevicePairingAccessMetadata;
}, baseDir?: string): Promise<ApproveDevicePairingResult>;
/** Approve a pending request through a bounded bootstrap profile handoff. */
export declare function approveBootstrapDevicePairing(requestId: string, bootstrapProfile: DeviceBootstrapProfile, baseDir?: string): Promise<ApproveDevicePairingResult>;
export declare function approveBootstrapDevicePairing(requestId: string, bootstrapProfile: DeviceBootstrapProfile, options: {
    accessMetadata?: DevicePairingAccessMetadata;
}, baseDir?: string): Promise<ApproveDevicePairingResult>;
/** Reject a pending request and revoke matching bootstrap tokens for that device. */
export declare function rejectDevicePairing(requestId: string, baseDir?: string): Promise<{
    requestId: string;
    deviceId: string;
} | null>;
/** Remove a paired device and any pending repair requests for the same device id. */
export declare function removePairedDevice(deviceId: string, baseDir?: string): Promise<{
    deviceId: string;
} | null>;
/** Remove one approved paired-device role while preserving unrelated role tokens. */
export declare function removePairedDeviceRole(params: {
    deviceId: string;
    role: string;
    baseDir?: string;
}): Promise<{
    deviceId: string;
    role: string;
    removedDevice: boolean;
} | null>;
/** Update non-auth metadata for a paired device presence/status refresh. */
export declare function updatePairedDeviceMetadata(deviceId: string, patch: Partial<PairedDeviceMetadataPatch>, baseDir?: string): Promise<boolean>;
/** Summarize token metadata without exposing bearer token strings. */
export declare function summarizeDeviceTokens(tokens: Record<string, DeviceAuthToken> | undefined): DeviceAuthTokenSummary[] | undefined;
/** Verify a device role token, scope it to the approval baseline, and mark last use. */
export declare function verifyDeviceToken(params: {
    deviceId: string;
    token: string;
    role: string;
    scopes: string[];
    requiredSharedGatewaySessionGeneration?: string;
    baseDir?: string;
}): Promise<{
    ok: boolean;
    reason?: string;
    issuer?: DeviceAuthToken["issuer"];
}>;
/** Return a reusable token for a role or issue one within the approved scope baseline. */
export declare function ensureDeviceToken(params: {
    deviceId: string;
    role: string;
    scopes: string[];
    issuer?: DeviceAuthToken["issuer"];
    baseDir?: string;
}): Promise<DeviceAuthToken | null>;
/** Rotate a role token inside the device's approved scope baseline. */
export declare function rotateDeviceToken(params: {
    deviceId: string;
    role: string;
    scopes?: string[];
    callerScopes?: readonly string[];
    baseDir?: string;
}): Promise<RotateDeviceTokenResult>;
/** Revoke one active role token after optional caller-scope authorization. */
export declare function revokeDeviceToken(params: {
    deviceId: string;
    role: string;
    callerScopes?: readonly string[];
    baseDir?: string;
}): Promise<RevokeDeviceTokenResult>;
