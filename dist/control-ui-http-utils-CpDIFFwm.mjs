import { i as splitHttpHeaderValue } from "./http-header-value-BM79-5V8.mjs";
//#region src/gateway/http-media-range.ts
const HTTP_TOKEN_PATTERN = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/u;
const HTTP_QVALUE_PATTERN = /^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/u;
const HTTP_OPTIONAL_WHITESPACE_PATTERN = /^[\t ]+|[\t ]+$/gu;
function trimHttpOptionalWhitespace(value) {
	return value.replace(HTTP_OPTIONAL_WHITESPACE_PATTERN, "");
}
function parseParameterValue(value) {
	if (HTTP_TOKEN_PATTERN.test(value)) return value;
	if (value.length < 2 || value[0] !== "\"" || value.at(-1) !== "\"") return null;
	let parsed = "";
	let escaped = false;
	for (let index = 1; index < value.length - 1; index += 1) {
		const character = value[index];
		if (escaped) {
			parsed += character;
			escaped = false;
			continue;
		}
		if (character === "\\") {
			escaped = true;
			continue;
		}
		if (character === "\"") return null;
		parsed += character;
	}
	return escaped ? null : parsed;
}
function parseMediaType(value, allowQuality) {
	const segments = splitHttpHeaderValue(value, ";", "quoted-string");
	if (!segments) return null;
	const [type, subtype, ...extra] = trimHttpOptionalWhitespace(segments.shift() ?? "").toLowerCase().split("/");
	if (extra.length > 0 || !type || !subtype || !HTTP_TOKEN_PATTERN.test(type) || !HTTP_TOKEN_PATTERN.test(subtype)) return null;
	let quality = 1;
	let qualitySeen = false;
	const parameters = /* @__PURE__ */ new Map();
	for (const rawParameter of segments) {
		const parameter = trimHttpOptionalWhitespace(rawParameter);
		if (!parameter) continue;
		const separator = parameter.indexOf("=");
		const name = (separator < 0 ? parameter : parameter.slice(0, separator)).toLowerCase();
		if (!HTTP_TOKEN_PATTERN.test(name)) return null;
		if (separator <= 0) return null;
		const rawValue = parameter.slice(separator + 1);
		if (!rawValue) return null;
		if (name === "q") {
			if (!allowQuality || qualitySeen || !HTTP_QVALUE_PATTERN.test(rawValue)) return null;
			qualitySeen = true;
			quality = Number(rawValue);
			continue;
		}
		const parameterValue = parseParameterValue(rawValue);
		if (parameterValue === null || parameters.has(name)) return null;
		parameters.set(name, name === "charset" ? parameterValue.toLowerCase() : parameterValue);
	}
	return {
		type,
		subtype,
		parameters,
		quality
	};
}
function matchesRepresentation(range, representation, allowWildcards) {
	const exact = range.type === representation.type && range.subtype === representation.subtype;
	const wildcard = allowWildcards && range.subtype === "*" && (range.type === "*" || range.type === representation.type);
	if (!exact && !wildcard) return false;
	for (const [name, value] of range.parameters) if (representation.parameters.get(name) !== value) return false;
	return true;
}
/** Checks the quality of the most specific range matching the offered representation. */
function acceptsMediaType(accept, expectedRepresentation, allowWildcards = true) {
	if (!accept) return false;
	const representation = parseMediaType(expectedRepresentation, false);
	if (!representation) return false;
	const ranges = splitHttpHeaderValue(accept, ",", "quoted-string");
	if (!ranges) return false;
	let bestMediaSpecificity = -1;
	let bestParameterSpecificity = -1;
	let bestQuality = 0;
	for (const range of ranges) {
		const parsedRange = parseMediaType(range, true);
		if (!parsedRange || !matchesRepresentation(parsedRange, representation, allowWildcards)) continue;
		const mediaSpecificity = parsedRange.type === "*" ? 0 : parsedRange.subtype === "*" ? 1 : 2;
		const parameterSpecificity = parsedRange.parameters.size;
		const comparison = mediaSpecificity - bestMediaSpecificity || parameterSpecificity - bestParameterSpecificity;
		if (comparison > 0) {
			bestMediaSpecificity = mediaSpecificity;
			bestParameterSpecificity = parameterSpecificity;
			bestQuality = parsedRange.quality;
		} else if (comparison === 0) bestQuality = Math.max(bestQuality, parsedRange.quality);
	}
	return bestQuality > 0;
}
/** Wildcards cannot opt callers into long-lived streaming responses. */
function hasExplicitAcceptableMediaRange(accept, expectedRepresentation) {
	return acceptsMediaType(accept, expectedRepresentation, false);
}
//#endregion
//#region src/gateway/control-ui-http-utils.ts
function isReadHttpMethod(method) {
	return method === "GET" || method === "HEAD";
}
function acceptsControlUiHtmlResponse(accept) {
	const normalized = accept?.trim();
	if (!normalized) return true;
	return acceptsMediaType(normalized, "text/html; charset=utf-8") || hasExplicitAcceptableMediaRange(normalized, "application/xhtml+xml");
}
function respondPlainText(res, statusCode, body) {
	res.statusCode = statusCode;
	res.setHeader("Content-Type", "text/plain; charset=utf-8");
	if (statusCode !== 204) res.setHeader("Content-Length", String(Buffer.byteLength(body)));
	res.end(body);
}
function respondNotFound(res) {
	respondPlainText(res, 404, "Not Found");
}
//#endregion
export { hasExplicitAcceptableMediaRange as a, respondPlainText as i, isReadHttpMethod as n, respondNotFound as r, acceptsControlUiHtmlResponse as t };
