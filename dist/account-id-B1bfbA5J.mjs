import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
//#region src/routing/account-id.ts
const DEFAULT_ACCOUNT_ID = "default";
const VALID_ID_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/i;
const INVALID_CHARS_RE = /[^a-z0-9_-]+/g;
const LEADING_DASH_RE = /^-+/;
const TRAILING_DASH_RE = /-+$/;
const ACCOUNT_ID_CACHE_MAX = 512;
const normalizedAccountIdCache = /* @__PURE__ */ new Map();
function canonicalizeAccountId(value) {
	const normalized = normalizeLowercaseStringOrEmpty(value);
	if (VALID_ID_RE.test(value)) return normalized;
	return normalized.replace(INVALID_CHARS_RE, "-").replace(LEADING_DASH_RE, "").replace(TRAILING_DASH_RE, "").slice(0, 64);
}
function normalizeCanonicalAccountId(value) {
	const canonical = canonicalizeAccountId(value);
	if (!canonical || isBlockedObjectKey(canonical)) return;
	return canonical;
}
function resolveCachedCanonicalAccountId(value) {
	if (normalizedAccountIdCache.has(value)) return normalizedAccountIdCache.get(value);
	const normalized = normalizeCanonicalAccountId(value);
	normalizedAccountIdCache.set(value, normalized);
	pruneMapToMaxSize(normalizedAccountIdCache, ACCOUNT_ID_CACHE_MAX);
	return normalized;
}
function normalizeAccountId(value) {
	const trimmed = (value ?? "").trim();
	if (!trimmed) return DEFAULT_ACCOUNT_ID;
	return resolveCachedCanonicalAccountId(trimmed) ?? "default";
}
function normalizeOptionalAccountId(value) {
	const trimmed = (value ?? "").trim();
	if (!trimmed) return;
	return resolveCachedCanonicalAccountId(trimmed);
}
//#endregion
export { normalizeAccountId as n, normalizeOptionalAccountId as r, DEFAULT_ACCOUNT_ID as t };
