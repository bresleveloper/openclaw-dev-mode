import { D as resolveIntegerOption$1, O as resolveNonNegativeIntegerOption$1 } from "./number-coercion-CJQ8TR--.js";
//#region src/infra/numeric-options.ts
/** Resolve a non-negative integer option or return the fallback. */
function resolveNonNegativeIntegerOption(value, fallback) {
	return resolveNonNegativeIntegerOption$1(value, fallback);
}
/** Resolve an integer option with a minimum bound or return the fallback. */
function resolveIntegerOption(value, fallback, params) {
	return resolveIntegerOption$1(value, fallback, params);
}
//#endregion
export { resolveNonNegativeIntegerOption as n, resolveIntegerOption as t };
