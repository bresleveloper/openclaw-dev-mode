import { w as parseStrictPositiveInteger } from "./number-coercion-CuVhdCBs.mjs";
//#region src/cli/parse-timeout.ts
/** Parse a positive millisecond timeout, returning undefined for absent or invalid input. */
function parseTimeoutMs(raw) {
	return parseStrictPositiveInteger(typeof raw === "bigint" ? Number(raw) : raw);
}
function invalidTimeout(flagName, value) {
	const suffix = value ? ` Received: "${value}".` : "";
	return /* @__PURE__ */ new Error(`Invalid ${flagName}. Use a positive millisecond value, e.g. ${flagName} 30000.${suffix}`);
}
/** Parse a positive timeout or return the supplied fallback for missing values. */
function parseTimeoutMsWithFallback(raw, fallbackMs, options = {}) {
	const flagName = options.flagName ?? "--timeout";
	if (raw === void 0 || raw === null) return fallbackMs;
	const value = typeof raw === "string" ? raw.trim() : typeof raw === "number" || typeof raw === "bigint" ? String(raw) : null;
	if (!value) {
		if (options.invalidType === "error") throw invalidTimeout(flagName);
		return fallbackMs;
	}
	const parsed = parseStrictPositiveInteger(value);
	if (parsed === void 0) throw invalidTimeout(flagName, value);
	return parsed;
}
//#endregion
export { parseTimeoutMsWithFallback as n, parseTimeoutMs as t };
