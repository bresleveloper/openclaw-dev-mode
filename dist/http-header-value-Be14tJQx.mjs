import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
//#region src/gateway/http-header-value.ts
function getHeader(req, name) {
	const raw = req.headers[normalizeLowercaseStringOrEmpty(name)];
	if (typeof raw === "string") return raw;
	if (Array.isArray(raw)) return raw[0];
}
function getBearerToken(req) {
	const raw = normalizeOptionalString(getHeader(req, "authorization")) ?? "";
	if (!normalizeLowercaseStringOrEmpty(raw).startsWith("bearer ")) return;
	return normalizeOptionalString(raw.slice(7));
}
/** Split only outside quotes; entity-tags keep backslashes literal instead of escaping quotes. */
function splitHttpHeaderValue(value, delimiter, quoteMode) {
	const parts = [];
	let start = 0;
	let quoted = false;
	let escaped = false;
	for (let index = 0; index < value.length; index += 1) {
		const character = value[index];
		if (escaped) escaped = false;
		else if (quoted && quoteMode === "quoted-string" && character === "\\") escaped = true;
		else if (character === "\"") quoted = !quoted;
		else if (!quoted && character === delimiter) {
			parts.push(value.slice(start, index));
			start = index + 1;
		}
	}
	if (quoted || escaped) return null;
	parts.push(value.slice(start));
	return parts;
}
//#endregion
export { getHeader as n, splitHttpHeaderValue as r, getBearerToken as t };
