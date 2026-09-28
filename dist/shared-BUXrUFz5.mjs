import { P as resolvePositiveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
//#region src/secrets/shared.ts
/** Shared parsing helpers for secrets migration/runtime code. */
/**
* Narrows to strings that contain non-whitespace content.
*/
function isNonEmptyString(value) {
	return typeof value === "string" && value.trim().length > 0;
}
/**
* Parses a simple .env assignment value, stripping one matching quote pair after trimming.
*/
function parseEnvValue(raw) {
	const trimmed = raw.trim();
	if (trimmed.startsWith("\"") && trimmed.endsWith("\"") || trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1);
	return trimmed;
}
/**
* Normalizes numeric config to a positive integer, falling back when the input is not finite.
*/
function normalizePositiveInt(value, fallback) {
	if (typeof value === "number" && Number.isFinite(value)) return Math.max(1, Math.floor(value));
	return Math.max(1, Math.floor(fallback));
}
/**
* Normalizes timer values with the shared timeout coercion rules used by secret providers.
*/
function normalizePositiveTimerMs(value, fallback) {
	return resolvePositiveTimerTimeoutMs(value, fallback);
}
/**
* Splits a dotted config path into non-empty trimmed segments.
*/
function parseDotPath(pathname) {
	return pathname.split(".").map((segment) => segment.trim()).filter((segment) => segment.length > 0);
}
//#endregion
export { parseEnvValue as a, parseDotPath as i, normalizePositiveInt as n, normalizePositiveTimerMs as r, isNonEmptyString as t };
