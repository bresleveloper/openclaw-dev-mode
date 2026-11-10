//#region packages/normalization-core/src/record-coerce.ts
/** Type guard for non-array object records at browser-safe boundaries. */
function isRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
/** Coerces object-like values to records, falling back to an empty record. */
function asRecord(value) {
	return asOptionalObjectRecord(value) ?? {};
}
/** Returns a non-array record or undefined. */
function asOptionalRecord(value) {
	return isRecord(value) ? value : void 0;
}
/** Returns a non-array record or null. */
function asNullableRecord(value) {
	return isRecord(value) ? value : null;
}
/** Returns any object-backed record, including arrays, or undefined. */
function asOptionalObjectRecord(value) {
	return value && typeof value === "object" ? value : void 0;
}
//#endregion
export { isRecord as a, asRecord as i, asOptionalObjectRecord as n, asOptionalRecord as r, asNullableRecord as t };
