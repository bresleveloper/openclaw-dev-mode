/** Normalized roles/scopes carried by a bootstrap token during device handoff. */
export type DeviceBootstrapProfile = {
    roles: string[];
    scopes: string[];
};
/** Caller-provided bootstrap profile before role/scope normalization and bounding. */
export type DeviceBootstrapProfileInput = {
    roles?: readonly string[];
    scopes?: readonly string[];
};
/** Operator scopes allowed to cross the short-lived bootstrap handoff boundary. */
export declare const BOOTSTRAP_HANDOFF_OPERATOR_SCOPES: readonly ["operator.approvals", "operator.read", "operator.talk.secrets", "operator.write"];
/** Default setup-code/QR bootstrap profile for native onboarding handoff. */
export declare const PAIRING_SETUP_BOOTSTRAP_PROFILE: DeviceBootstrapProfile;
/** Return whether an input exactly matches the current setup-code bootstrap profile. */
export declare function isPairingSetupBootstrapProfile(input: DeviceBootstrapProfileInput | undefined): boolean;
/** Resolve the subset of requested scopes a bootstrap profile may carry for one role. */
export declare function resolveBootstrapProfileScopesForRole(role: string, scopes: readonly string[]): string[];
/** Resolve bounded bootstrap handoff scopes across a role set. */
export declare function resolveBootstrapProfileScopesForRoles(roles: readonly string[], scopes: readonly string[]): string[];
/** Normalize a requested bootstrap profile and strip scopes outside the handoff allowlist. */
export declare function normalizeDeviceBootstrapHandoffProfile(input: DeviceBootstrapProfileInput | undefined): DeviceBootstrapProfile;
/** Normalize caller-provided bootstrap roles/scopes without applying handoff bounds. */
export declare function normalizeDeviceBootstrapProfile(input: DeviceBootstrapProfileInput | undefined): DeviceBootstrapProfile;
