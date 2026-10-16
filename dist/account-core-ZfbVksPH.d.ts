import "./config-Dpca5-xX.js";
import "./account-helpers-zvHwiq3T.js";
import "./utils-DhaCU8ER.js";
//#region src/plugin-sdk/account-configured-ids.d.ts
/** List normalized configured account ids from a raw channel account record map. */
declare function listConfiguredAccountIds(params: {
  accounts: Record<string, unknown> | undefined;
  normalizeAccountId: (accountId: string) => string;
}): string[];
//#endregion
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
export { listConfiguredAccountIds as n, resolveAccountWithDefaultFallback as t };