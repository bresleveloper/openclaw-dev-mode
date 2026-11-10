import "./number-coercion-CkhMiRw8.mjs";
import { d as normalizeStringEntries } from "./string-normalization-D6DKCpwE.mjs";
//#region src/secrets/shared.ts
/** Shared parsing helpers for secrets migration/runtime code. */
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
* Splits a dotted config path into non-empty trimmed segments.
*/
function parseDotPath(pathname) {
	return normalizeStringEntries(pathname.split("."));
}
//#endregion
export { parseDotPath as n, parseEnvValue as r, normalizePositiveInt as t };
