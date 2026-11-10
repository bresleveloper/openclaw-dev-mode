import "./utils-gjJ-tD2q.mjs";
import "./session-key-CSDERtm3.mjs";
import "./account-lookup-Dm5zJglt.mjs";
import "./account-helpers-Bj9HVUkM.mjs";
//#region src/plugin-sdk/account-core.ts
/** Resolve an account by id, then fall back to the default account when the primary lacks credentials. */
function resolveAccountWithDefaultFallback(params) {
	const hasExplicitAccountId = Boolean(params.accountId?.trim());
	const normalizedAccountId = params.normalizeAccountId(params.accountId);
	const primary = params.resolvePrimary(normalizedAccountId);
	if (hasExplicitAccountId || params.hasCredential(primary)) return primary;
	const fallbackId = params.resolveDefaultAccountId();
	if (fallbackId === normalizedAccountId) return primary;
	const fallback = params.resolvePrimary(fallbackId);
	if (!params.hasCredential(fallback)) return primary;
	return fallback;
}
//#endregion
export { resolveAccountWithDefaultFallback as t };
