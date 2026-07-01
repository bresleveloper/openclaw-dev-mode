import { n as normalizeChatType } from "./chat-type-B6XXSSnm.js";
import { i as OpenClawConfig } from "./types.openclaw-R57aE8ho.js";
import { t as createAccountActionGate } from "./account-action-gate-D0GCq_WL.js";
import { a as listCombinedAccountIds, c as resolveMergedAccountConfig, i as hasConfiguredAccountValue, n as describeAccountSnapshot, o as mergeAccountConfig, s as resolveListedDefaultAccountId, t as createAccountListHelpers } from "./account-helpers-c_WrKZGn.js";
import { n as resolveNormalizedAccountEntry, t as resolveAccountEntry } from "./account-lookup-AwHuXBzh.js";
import { n as normalizeAccountId, r as normalizeOptionalAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-Dh6XMgGH.js";
import { l as normalizeE164, p as resolveUserPath, u as pathExists } from "./utils-CR2kVvQb.js";
import { t as listConfiguredAccountIds } from "./account-configured-ids-4opiay54.js";

//#region src/plugin-sdk/account-core.d.ts
/** Resolve an account by id, then fall back to the default account when the primary lacks credentials. */
declare function resolveAccountWithDefaultFallback<TAccount>(params: {
  accountId?: string | null;
  normalizeAccountId: (accountId?: string | null) => string;
  resolvePrimary: (accountId: string) => TAccount;
  hasCredential: (account: TAccount) => boolean;
  resolveDefaultAccountId: () => string;
}): TAccount;
//#endregion
export { DEFAULT_ACCOUNT_ID, type OpenClawConfig, createAccountActionGate, createAccountListHelpers, describeAccountSnapshot, hasConfiguredAccountValue, listCombinedAccountIds, listConfiguredAccountIds, mergeAccountConfig, normalizeAccountId, normalizeChatType, normalizeE164, normalizeOptionalAccountId, pathExists, resolveAccountEntry, resolveAccountWithDefaultFallback, resolveListedDefaultAccountId, resolveMergedAccountConfig, resolveNormalizedAccountEntry, resolveUserPath };