//#region packages/normalization-core/src/record-coerce.ts
/** Type guard for non-array object records at browser-safe boundaries. */
function isRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
/** Coerces object-like values to records, falling back to an empty record. */
function asRecord(value) {
	return typeof value === "object" && value !== null ? value : {};
}
/** Reads a field only when it exists as a string. */
function readStringField(record, key) {
	const value = record?.[key];
	return typeof value === "string" ? value : void 0;
}
/** Returns a non-array record or undefined. */
function asOptionalRecord(value) {
	return isRecord(value) ? value : void 0;
}
/** Returns a non-array record or a fresh ordinary empty record. */
function asNonArrayRecord(value) {
	return asOptionalRecord(value) ?? {};
}
/** Returns a non-array record or null. */
function asNullableRecord(value) {
	return isRecord(value) ? value : null;
}
/** Returns any object-backed record, including arrays, or undefined. */
function asOptionalObjectRecord(value) {
	return value && typeof value === "object" ? value : void 0;
}
/** Returns any object-backed record, including arrays, or null. */
function asNullableObjectRecord(value) {
	return value && typeof value === "object" ? value : null;
}
/** Checks that every enumerable own value in a non-array record is a string. */
function isStringRecord(value) {
	return isRecord(value) && Object.values(value).every((entry) => typeof entry === "string");
}
/** Retains string-valued own enumerable entries from a non-array record. */
function filterStringRecord(value) {
	if (!isRecord(value)) return;
	const entries = Object.entries(value).filter((entry) => typeof entry[1] === "string");
	return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
//#endregion
export { asOptionalRecord as a, isRecord as c, asOptionalObjectRecord as i, isStringRecord as l, asNullableObjectRecord as n, asRecord as o, asNullableRecord as r, filterStringRecord as s, asNonArrayRecord as t, readStringField as u };
