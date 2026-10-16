import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
//#region extensions/openai/codex-model-rows.ts
function readCodexReasoningLevels(row) {
	const record = asOptionalRecord(row);
	const value = record?.supported_reasoning_levels ?? record?.supportedReasoningLevels;
	if (!Array.isArray(value)) return;
	return value.flatMap((entry) => {
		if (typeof entry === "string" && entry.trim().length > 0) return [entry.trim()];
		const effort = asOptionalRecord(entry)?.effort;
		return typeof effort === "string" && effort.trim().length > 0 ? [effort.trim()] : [];
	});
}
function readCodexModelRows(body) {
	const models = asOptionalRecord(body)?.models;
	if (!Array.isArray(models)) throw new Error("OpenAI Codex model discovery response must be { models: [] }");
	return models;
}
function shouldIncludeCodexModelRow(row, readers) {
	const { readLiveModelCatalogStringField, readLiveModelCatalogBooleanField } = readers;
	const visibility = normalizeLowercaseStringOrEmpty(readLiveModelCatalogStringField(row, "visibility") ?? "");
	if (visibility && visibility !== "list") return false;
	return (readLiveModelCatalogBooleanField(row, "show_in_picker") ?? readLiveModelCatalogBooleanField(row, "showInPicker")) !== false;
}
function resolveCodexModelInput(row, fallback) {
	const record = asOptionalRecord(row);
	const rawModalities = [record?.input_modalities, record?.inputModalities].find(Array.isArray)?.filter((entry) => typeof entry === "string") ?? [];
	if (rawModalities.length === 0) return fallback?.input ?? ["text", "image"];
	const modalities = new Set(rawModalities.map((modality) => normalizeLowercaseStringOrEmpty(modality)));
	const input = [
		"text",
		"image",
		"audio",
		"video"
	].filter((modality) => modalities.has(modality) || modality === "image" && modalities.has("vision"));
	return input.length > 0 ? input : fallback?.input ?? ["text", "image"];
}
//#endregion
export { shouldIncludeCodexModelRow as i, readCodexReasoningLevels as n, resolveCodexModelInput as r, readCodexModelRows as t };
