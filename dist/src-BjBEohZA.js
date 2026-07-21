import "./number-coercion-CJQ8TR--.js";
//#region packages/normalization-core/src/json-coercion.ts
/** Parses JSON without throwing, returning undefined for invalid input. */
function safeParseJson(value) {
	try {
		return JSON.parse(value);
	} catch {
		return;
	}
}
//#endregion
export { safeParseJson as t };
