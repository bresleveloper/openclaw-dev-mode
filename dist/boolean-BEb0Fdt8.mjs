import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
//#region src/utils/boolean.ts
const DEFAULT_TRUTHY = [
	"true",
	"1",
	"yes",
	"on"
];
const DEFAULT_FALSY = [
	"false",
	"0",
	"no",
	"off"
];
/** Returns only real boolean values and leaves boolean-like strings for explicit parsing. */
function asBoolean(value) {
	return typeof value === "boolean" ? value : void 0;
}
/** Parses booleans and configured string literals, returning undefined for ambiguous input. */
function parseBooleanValue(value, options = {}) {
	const booleanValue = asBoolean(value);
	if (booleanValue !== void 0) return booleanValue;
	const normalized = normalizeOptionalLowercaseString(value);
	if (!normalized) return;
	if ((options.truthy ?? DEFAULT_TRUTHY).includes(normalized)) return true;
	if ((options.falsy ?? DEFAULT_FALSY).includes(normalized)) return false;
}
//#endregion
export { parseBooleanValue as n, asBoolean as t };
