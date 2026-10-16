import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
//#region extensions/browser/src/browser/form-fields.ts
const DEFAULT_FILL_FIELD_TYPE = "text";
const FIELD_ENTRY_KEYS = /* @__PURE__ */ new Set([
	"ref",
	"type",
	"value"
]);
function normalizeBrowserFormFieldValue(value) {
	return typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? value : void 0;
}
function normalizeBrowserFormField(record, index) {
	const prefix = `fields[${index}]`;
	const ref = normalizeOptionalString(record.ref);
	if (!ref) throw new Error(`${prefix} must include ref`);
	for (const key of Object.keys(record)) if (!FIELD_ENTRY_KEYS.has(key)) throw new Error(`${prefix} unsupported field key "${key}"; supported keys are ref, type, value`);
	const type = normalizeOptionalString(record.type) ?? "text";
	if (record.value === void 0 || record.value === null) return {
		ref,
		type
	};
	const value = normalizeBrowserFormFieldValue(record.value);
	if (value === void 0) throw new Error(`${prefix} value must be a string, number, boolean, or null`);
	return {
		ref,
		type,
		value
	};
}
/** Normalize form field descriptors and preserve the failing entry index. */
function normalizeBrowserFormFields(entries) {
	return entries.map((field, index) => {
		if (!isRecord(field)) throw new Error(`fields[${index}] must be an object`);
		return normalizeBrowserFormField(field, index);
	});
}
//#endregion
export { normalizeBrowserFormFields as n, DEFAULT_FILL_FIELD_TYPE as t };
