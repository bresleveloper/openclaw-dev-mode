import type { ChannelAccountSnapshot } from "./plugins/types.core.js";
declare const CREDENTIAL_STATUS_KEYS: readonly ["tokenStatus", "botTokenStatus", "appTokenStatus", "signingSecretStatus", "userTokenStatus"];
type CredentialStatusKey = (typeof CREDENTIAL_STATUS_KEYS)[number];
/**
 * Infers whether any known credential status makes an account configured.
 *
 * Status commands need this metadata for "configured but unavailable" accounts without reading
 * raw credentials from runtime-only helpers.
 */
export declare function resolveConfiguredFromCredentialStatuses(account: unknown): boolean | undefined;
/** Infers configured state only from the credential status keys required by a channel. */
export declare function resolveConfiguredFromRequiredCredentialStatuses(account: unknown, requiredKeys: CredentialStatusKey[]): boolean | undefined;
/** Returns true when a credential exists but cannot be resolved at status-render time. */
export declare function hasConfiguredUnavailableCredentialStatus(account: unknown): boolean;
/** Returns true when account data contains a resolved credential value or available status. */
export declare function hasResolvedCredentialValue(account: unknown): boolean;
/** Projects credential source/status metadata while omitting raw credential values. */
export declare function projectCredentialSnapshotFields(account: unknown): Pick<Partial<ChannelAccountSnapshot>, "tokenSource" | "botTokenSource" | "appTokenSource" | "signingSecretSource" | "tokenStatus" | "botTokenStatus" | "appTokenStatus" | "signingSecretStatus" | "userTokenStatus">;
/**
 * Projects status-safe account fields for read-only channel/account snapshots.
 *
 * This is the boundary between runtime account objects and status renderers; keep it explicit so
 * new channel fields do not accidentally expose webhook URLs, public keys, or raw credentials.
 */
export declare function projectSafeChannelAccountSnapshotFields(account: unknown): Partial<ChannelAccountSnapshot>;
export {};
