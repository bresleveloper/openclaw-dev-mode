import { s as normalizeNullableString } from "./string-coerce-CIXf7egm.mjs";
import "./session-key-CUi_tcgF.mjs";
//#region packages/session-url-contract/src/grammar.ts
const SHORT_SESSION_REF_RE = /^(?:.*-)?([0-9a-f]{8,32})$/iu;
const FIXED_RESERVED_SESSION_RESTS = /* @__PURE__ */ new Set([
	"main",
	"global",
	"boot",
	"sessions"
]);
const SESSION_SLUG_MAX_LENGTH = 48;
function controlUiSessionSlug(displayName) {
	return ((displayName ?? "").toLowerCase().replace(/[^a-z0-9]+/gu, "-").replace(/^-+|-+$/gu, "").match(/^.*[g-z][a-z0-9]*/u)?.[0] ?? "").slice(0, SESSION_SLUG_MAX_LENGTH).replace(/-+$/gu, "");
}
function normalizeControlUiBasePath(basePath) {
	const trimmed = basePath?.trim().replace(/^\/+|\/+$/gu, "") ?? "";
	return trimmed ? `/${trimmed}` : "";
}
function isReservedSessionRest(rest, mainKey) {
	const normalized = rest.toLowerCase();
	const configuredMainKey = normalizeNullableString(mainKey)?.toLowerCase() ?? "main";
	return FIXED_RESERVED_SESSION_RESTS.has(normalized) || normalized === configuredMainKey;
}
function parseShortSessionRef(sessionRef) {
	const shortId = sessionRef.match(SHORT_SESSION_REF_RE)?.[1]?.toLowerCase();
	if (!shortId) return null;
	const slugHint = sessionRef.slice(0, sessionRef.length - shortId.length).replace(/-+$/u, "");
	return slugHint ? {
		shortId,
		slugHint
	} : { shortId };
}
//#endregion
export { parseShortSessionRef as i, isReservedSessionRest as n, normalizeControlUiBasePath as r, controlUiSessionSlug as t };
