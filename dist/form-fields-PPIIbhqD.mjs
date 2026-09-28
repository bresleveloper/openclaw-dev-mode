import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
//#region extensions/browser/src/browser/form-fields.ts
/**
* Browser form field normalization.
*
* Converts model/client fill field payloads into the compact field shape used
* by Playwright and Chrome MCP fill actions.
*/
/** Default field type for fill actions when no type is provided. */
const DEFAULT_FILL_FIELD_TYPE = "text";
/** Keys accepted in one fill field entry. */
const FIELD_ENTRY_KEYS = /* @__PURE__ */ new Set([
	"ref",
	"type",
	"value"
]);
function normalizeBrowserFormFieldRef(value) {
	return normalizeOptionalString(value) ?? "";
}
function normalizeBrowserFormFieldType(value) {
	return (normalizeOptionalString(value) ?? "") || "text";
}
/** Normalize a form field value to the types accepted by fill actions. */
function normalizeBrowserFormFieldValue(value) {
	return typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? value : void 0;
}
function normalizeBrowserFormField(record, index) {
	const prefix = `fields[${index}]`;
	const ref = normalizeBrowserFormFieldRef(record.ref);
	if (!ref) throw new Error(`${prefix} must include ref`);
	for (const key of Object.keys(record)) if (!FIELD_ENTRY_KEYS.has(key)) throw new Error(`${prefix} unsupported field key "${key}"; supported keys are ref, type, value`);
	const type = normalizeBrowserFormFieldType(record.type);
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
export { normalizeBrowserFormFields as i, normalizeBrowserFormField as n, normalizeBrowserFormFieldValue as r, DEFAULT_FILL_FIELD_TYPE as t };
