import { t as applyModelCompatPatch } from "./provider-model-compat-DQ2tKK7m.mjs";
import "./provider-model-shared-CgZ78XZA.mjs";
//#region extensions/xai/model-compat.ts
const XAI_TOOL_SCHEMA_PROFILE = "xai";
const HTML_ENTITY_TOOL_CALL_ARGUMENTS_ENCODING = "html-entities";
function applyXaiModelCompat(model) {
	return applyModelCompatPatch(model, {
		toolSchemaProfile: "xai",
		unsupportedToolSchemaKeywords: ["minContains", "maxContains"],
		toolCallArgumentsEncoding: HTML_ENTITY_TOOL_CALL_ARGUMENTS_ENCODING
	});
}
//#endregion
export { XAI_TOOL_SCHEMA_PROFILE as n, applyXaiModelCompat as r, HTML_ENTITY_TOOL_CALL_ARGUMENTS_ENCODING as t };
