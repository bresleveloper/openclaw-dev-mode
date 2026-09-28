import { r as ChannelAccountSnapshot } from "./types.core-D1MQo5ra.js";
import "./status-helpers-ux_DmB_T.js";
//#region src/channels/account-snapshot-fields.d.ts
declare const CREDENTIAL_STATUS_KEYS: readonly ["tokenStatus", "botTokenStatus", "appTokenStatus", "signingSecretStatus", "userTokenStatus"];
type CredentialStatusKey = (typeof CREDENTIAL_STATUS_KEYS)[number];
declare const CREDENTIAL_SOURCE_KEYS: readonly ["tokenSource", "botTokenSource", "appTokenSource", "signingSecretSource", "userTokenSource", "credentialSource", "secretSource"];
type CredentialSnapshotFields = Pick<Partial<ChannelAccountSnapshot>, CredentialStatusKey | (typeof CREDENTIAL_SOURCE_KEYS)[number]>;
/**
 * Infers whether any known credential status makes an account configured.
 *
 * Status commands need this metadata for "configured but unavailable" accounts without reading
 * raw credentials from runtime-only helpers.
 */
declare function resolveConfiguredFromCredentialStatuses(account: unknown): boolean | undefined;
/** Infers configured state only from the credential status keys required by a channel. */
declare function resolveConfiguredFromRequiredCredentialStatuses(account: unknown, requiredKeys: CredentialStatusKey[]): boolean | undefined;
/** Projects credential source/status metadata while omitting raw credential values. */
declare function projectCredentialSnapshotFields(account: unknown): CredentialSnapshotFields;
//#endregion
export { resolveConfiguredFromCredentialStatuses as n, resolveConfiguredFromRequiredCredentialStatuses as r, projectCredentialSnapshotFields as t };