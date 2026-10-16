import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { r as normalizeAgentIdStrict } from "./agent-id-D1-Q6vR4.mjs";
//#region src/routing/account-id.ts
const DEFAULT_ACCOUNT_ID = "default";
const ACCOUNT_ID_CACHE_MAX = 512;
const normalizedAccountIdCache = /* @__PURE__ */ new Map();
function normalizeAccountId(value) {
	return normalizeOptionalAccountId(value) ?? "default";
}
function normalizeOptionalAccountId(value) {
	const trimmed = (value ?? "").trim();
	if (!trimmed) return;
	if (normalizedAccountIdCache.has(trimmed)) return normalizedAccountIdCache.get(trimmed);
	const canonical = normalizeAgentIdStrict(trimmed);
	const normalized = canonical.ok && !isBlockedObjectKey(canonical.value) ? canonical.value : void 0;
	normalizedAccountIdCache.set(trimmed, normalized);
	pruneMapToMaxSize(normalizedAccountIdCache, ACCOUNT_ID_CACHE_MAX);
	return normalized;
}
//#endregion
export { normalizeAccountId as n, normalizeOptionalAccountId as r, DEFAULT_ACCOUNT_ID as t };
