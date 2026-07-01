//#region src/shared/device-bootstrap-profile.d.ts
/** Normalized roles/scopes carried by a bootstrap token during device handoff. */
type DeviceBootstrapProfile = {
  roles: string[];
  scopes: string[];
};
/** Caller-provided bootstrap profile before role/scope normalization and bounding. */
type DeviceBootstrapProfileInput = {
  roles?: readonly string[];
  scopes?: readonly string[];
};
/** Default setup-code/QR bootstrap profile for native onboarding handoff. */
declare const PAIRING_SETUP_BOOTSTRAP_PROFILE: DeviceBootstrapProfile;
/** Normalize caller-provided bootstrap roles/scopes without applying handoff bounds. */
declare function normalizeDeviceBootstrapProfile(input: DeviceBootstrapProfileInput | undefined): DeviceBootstrapProfile;
//#endregion
//#region src/infra/device-pairing.d.ts
/** Pending device pairing request awaiting owner approval. */
type DevicePairingPendingRequest = {
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
type DeviceAuthToken = {
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
/** Persisted approved device record, including durable approval and active role tokens. */
type PairedDevice = {
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
/** Paired-device access metadata refreshed when an existing device reconnects. */
type DevicePairingAccessMetadata = Pick<PairedDevice, "displayName" | "remoteIp" | "lastSeenAtMs" | "lastSeenReason">;
/** Combined pending/paired view returned by pairing list APIs. */
type DevicePairingList = {
  pending: DevicePairingPendingRequest[];
  paired: PairedDevice[];
};
/** Authorization failure categories for owner approval and bootstrap approval flows. */
type DevicePairingForbiddenReason = "caller-scopes-required" | "caller-missing-scope" | "scope-outside-requested-roles" | "bootstrap-role-not-allowed" | "bootstrap-scope-not-allowed";
/** Structured forbidden result with the missing/disallowed role or scope when known. */
type DevicePairingForbiddenResult = {
  status: "forbidden";
  reason: DevicePairingForbiddenReason;
  scope?: string;
  role?: string;
};
/** Pairing approval outcome: approved, forbidden with reason, or request not found. */
type ApproveDevicePairingResult = {
  status: "approved";
  requestId: string;
  device: PairedDevice;
} | DevicePairingForbiddenResult | null;
declare function listDevicePairing(baseDir?: string): Promise<DevicePairingList>;
/** Approve a pending request with optional caller-scope checks for operator grants. */
declare function approveDevicePairing(requestId: string, baseDir?: string): Promise<ApproveDevicePairingResult>;
declare function approveDevicePairing(requestId: string, options: {
  callerScopes?: readonly string[];
  accessMetadata?: DevicePairingAccessMetadata;
}, baseDir?: string): Promise<ApproveDevicePairingResult>;
//#endregion
//#region src/infra/device-bootstrap.d.ts
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
declare function issueDeviceBootstrapToken(params?: {
  baseDir?: string;
  profile?: DeviceBootstrapProfileInput;
  roles?: readonly string[];
  scopes?: readonly string[];
}): Promise<{
  token: string;
  expiresAtMs: number;
}>;
/** Remove every outstanding bootstrap token from the pairing state file. */
declare function clearDeviceBootstrapTokens(params?: {
  baseDir?: string;
}): Promise<{
  removed: number;
}>;
/** Revoke one bootstrap token and return its record for best-effort restore flows. */
declare function revokeDeviceBootstrapToken(params: {
  token: string;
  baseDir?: string;
}): Promise<{
  removed: boolean;
  record?: DeviceBootstrapTokenRecord;
}>;
//#endregion
export { listDevicePairing as a, PAIRING_SETUP_BOOTSTRAP_PROFILE as c, approveDevicePairing as i, normalizeDeviceBootstrapProfile as l, issueDeviceBootstrapToken as n, DeviceBootstrapProfile as o, revokeDeviceBootstrapToken as r, DeviceBootstrapProfileInput as s, clearDeviceBootstrapTokens as t };