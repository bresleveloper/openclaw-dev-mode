import { i as DOUBAO_MODEL_CATALOG, n as DOUBAO_CODING_BASE_URL, r as DOUBAO_CODING_MODEL_CATALOG, t as DOUBAO_BASE_URL } from "./.setup/models-CT4qD0X8.mjs";
import { applyModelCompatPatch } from "openclaw/plugin-sdk/provider-model-shared";
import { uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/volcengine/api.ts
const VOLCENGINE_UNSUPPORTED_TOOL_SCHEMA_KEYWORDS = [
	"minLength",
	"maxLength",
	"minItems",
	"maxItems",
	"minContains",
	"maxContains"
];
function applyVolcengineToolSchemaCompat(model) {
	const existing = model.compat?.unsupportedToolSchemaKeywords;
	const merged = uniqueStrings([...existing ?? [], ...VOLCENGINE_UNSUPPORTED_TOOL_SCHEMA_KEYWORDS]);
	return applyModelCompatPatch(model, { unsupportedToolSchemaKeywords: existing?.length === merged.length && existing.every((value, index) => value === merged[index]) ? existing : merged });
}
export { DOUBAO_BASE_URL, DOUBAO_CODING_BASE_URL, DOUBAO_CODING_MODEL_CATALOG, DOUBAO_MODEL_CATALOG, VOLCENGINE_UNSUPPORTED_TOOL_SCHEMA_KEYWORDS, applyVolcengineToolSchemaCompat };
