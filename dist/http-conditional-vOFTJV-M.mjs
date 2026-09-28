import { r as splitHttpHeaderValue } from "./http-header-value-Be14tJQx.mjs";
import { parseHttpDateInstant } from "@openclaw/ai/internal/retry-after";
//#region src/gateway/http-conditional.ts
function matchesHttpIfModifiedSince(request, lastModifiedMs, nowMs = Date.now()) {
	const values = request?.headersDistinct["if-modified-since"];
	const value = values?.length === 1 ? values[0] : void 0;
	const since = typeof value === "string" ? parseHttpDateInstant(value, nowMs) : void 0;
	const modifiedSecondMs = Math.floor(lastModifiedMs / 1e3) * 1e3;
	return since !== void 0 && (since.leapSecond ? modifiedSecondMs < since.timestampMs : modifiedSecondMs <= since.timestampMs);
}
function matchesHttpIfNoneMatch(header, etag) {
	const value = Array.isArray(header) ? header.join(",") : header;
	if (!value) return false;
	const expected = etag?.replace(/^W\//u, "");
	return value.trim() === "*" || (splitHttpHeaderValue(value, ",", "opaque-tag")?.some((candidate) => candidate.trim().replace(/^W\//u, "") === expected) ?? false);
}
//#endregion
export { matchesHttpIfNoneMatch as n, matchesHttpIfModifiedSince as t };
