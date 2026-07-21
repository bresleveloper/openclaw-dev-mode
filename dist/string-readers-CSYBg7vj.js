import { c as normalizeOptionalString, p as readStringValue } from "./string-coerce-DW4mBlAt.js";
//#region src/utils/string-readers.ts
function isStringOption(value, options) {
	return typeof value === "string" && (Array.isArray(options) ? options.includes(value) : options.has(value));
}
function readStringAlias(record, keys) {
	for (const key of keys) {
		const value = readStringValue(record[key]);
		if (value !== void 0) return value;
	}
}
function readTrimmedStringAlias(record, keys) {
	for (const key of keys) {
		const value = normalizeOptionalString(record[key]);
		if (value !== void 0) return value;
	}
}
//#endregion
export { readStringAlias as n, readTrimmedStringAlias as r, isStringOption as t };
