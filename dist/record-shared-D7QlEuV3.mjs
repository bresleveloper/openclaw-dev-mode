//#region scripts/lib/record-shared.mjs
/**
* Return whether a value is a plain non-array object record.
* @param {unknown} value
* @returns {value is Record<string, unknown>}
*/
function isRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
//#endregion
export { isRecord as t };
