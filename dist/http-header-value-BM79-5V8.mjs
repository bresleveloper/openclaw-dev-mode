import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
//#region src/gateway/http-header-value.ts
function firstHeaderValue(value) {
	return Array.isArray(value) ? value[0] : value;
}
function getHeader(req, name) {
	return firstHeaderValue(req.headers[normalizeLowercaseStringOrEmpty(name)]);
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
export { splitHttpHeaderValue as i, getBearerToken as n, getHeader as r, firstHeaderValue as t };
