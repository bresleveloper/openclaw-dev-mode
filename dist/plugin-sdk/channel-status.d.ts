import { r as ChannelAccountSnapshot } from "../types.core-Bra2QBA5.js";
import { t as PAIRING_APPROVED_MESSAGE } from "../pairing-message-CFs8lRw3.js";
import { a as buildProbeChannelStatusSummary, f as createDefaultChannelRuntimeState, i as buildComputedAccountStatusSnapshot, l as collectStatusIssuesFromLastError, r as buildBaseChannelStatusSummary, s as buildTokenChannelStatusSummary } from "../status-helpers-C9eMxomT.js";
//#region src/channels/account-snapshot-fields.d.ts
declare const CREDENTIAL_STATUS_KEYS: readonly ["tokenStatus", "botTokenStatus", "appTokenStatus", "signingSecretStatus", "userTokenStatus"];
type CredentialStatusKey = (typeof CREDENTIAL_STATUS_KEYS)[number];
declare const CREDENTIAL_SOURCE_KEYS: readonly ["tokenSource", "botTokenSource", "appTokenSource", "signingSecretSource", "userTokenSource", "credentialSource", "secretSource"];
type CredentialSnapshotFields = Pick<Partial<ChannelAccountSnapshot>, CredentialStatusKey | (typeof CREDENTIAL_SOURCE_KEYS)[number]>;
/** Status inspection must not redeem credentials to detect configured-but-unavailable accounts. */
export declare function resolveConfiguredFromCredentialStatuses(account: unknown): boolean | undefined;
/** Infers configured state only from the credential status keys required by a channel. */
export declare function resolveConfiguredFromRequiredCredentialStatuses(account: unknown, requiredKeys: CredentialStatusKey[]): boolean | undefined;
/** Projects credential source/status metadata while omitting raw credential values. */
export declare function projectCredentialSnapshotFields(account: unknown): CredentialSnapshotFields;
//#endregion
export { PAIRING_APPROVED_MESSAGE, buildBaseChannelStatusSummary, buildComputedAccountStatusSnapshot, buildProbeChannelStatusSummary, buildTokenChannelStatusSummary, collectStatusIssuesFromLastError, createDefaultChannelRuntimeState };