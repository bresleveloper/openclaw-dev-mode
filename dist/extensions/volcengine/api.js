import { i as DOUBAO_MODEL_CATALOG, n as DOUBAO_CODING_BASE_URL, r as DOUBAO_CODING_MODEL_CATALOG, t as DOUBAO_BASE_URL } from "./.setup/models-BWaO4fQH.mjs";
import { applyModelCompatPatch } from "openclaw/plugin-sdk/provider-model-shared";
import { uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/volcengine/api.ts
const VOLCENGINE_UNSUPPORTED_TOOL_SCHEMA_KEYWORDS = [
	"minLength",
	"maxLength",
	"minItems",
	"maxItems",
	"minContains",
	"maxContains"
];
function mergeUnsupportedToolSchemaKeywords(existing) {
	const merged = uniqueStrings([...existing ?? [], ...VOLCENGINE_UNSUPPORTED_TOOL_SCHEMA_KEYWORDS]);
	return existing?.length === merged.length && existing.every((value, index) => value === merged[index]) ? existing : merged;
}
function applyVolcengineToolSchemaCompat(model) {
	return applyModelCompatPatch(model, { unsupportedToolSchemaKeywords: mergeUnsupportedToolSchemaKeywords(model.compat?.unsupportedToolSchemaKeywords) });
}
//#endregion
export { DOUBAO_BASE_URL, DOUBAO_CODING_BASE_URL, DOUBAO_CODING_MODEL_CATALOG, DOUBAO_MODEL_CATALOG, VOLCENGINE_UNSUPPORTED_TOOL_SCHEMA_KEYWORDS, applyVolcengineToolSchemaCompat };
