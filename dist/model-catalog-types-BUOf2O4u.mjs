import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as MODEL_DATA_THINKING_FORMATS, r as MODEL_DATA_THINKING_LEVELS, t as MODEL_DATA_APIS } from "./model-data-DbiYhCxI.mjs";
//#region packages/model-catalog-core/src/model-catalog-types.ts
/** Supported API protocols for model catalog entries. */
const MODEL_CATALOG_APIS = [...MODEL_DATA_APIS];
/** Supported model thinking/reasoning wire formats. */
const MODEL_CATALOG_THINKING_FORMATS = [...MODEL_DATA_THINKING_FORMATS];
/** Narrow a string to a supported model catalog thinking format. */
function isModelCatalogThinkingFormat(value) {
	return MODEL_CATALOG_THINKING_FORMATS.includes(value);
}
/** Model-level thinking settings carried by provider catalog metadata. */
const MODEL_CATALOG_THINKING_LEVELS = [...MODEL_DATA_THINKING_LEVELS];
const OPENAI_THINKING_APIS = /* @__PURE__ */ new Set([
	"openai-completions",
	"openai-responses",
	"openai-chatgpt-responses",
	"azure-openai-responses"
]);
/** Managed API aliases retain the source adapter's reasoning contract. */
function resolveOpenAIThinkingApi(api) {
	if (typeof api !== "string") return;
	const sourceApi = api.replace(/^openclaw-(.+)-transport$/u, "$1");
	return OPENAI_THINKING_APIS.has(sourceApi) ? sourceApi : void 0;
}
/** Map keys describe logical choices; provider-native values retain their spelling. */
function listMappedModelThinkingLevels(model) {
	const compat = asOptionalRecord(model.compat);
	const efforts = compat?.supportedReasoningEfforts;
	const api = resolveOpenAIThinkingApi(model.api);
	const format = compat?.thinkingFormat;
	if (!api || api === "openai-completions" && (format === "qwen" || format === "qwen-chat-template" || format === "zai") || compat?.supportsReasoningEffort === false || Array.isArray(efforts) && efforts.length === 0) return [];
	const mapping = asOptionalRecord(compat?.reasoningEffortMap);
	const mapped = new Set(Object.entries(mapping ?? {}).flatMap(([level, effort]) => typeof effort === "string" && effort.trim() ? [level.trim().toLowerCase()] : []));
	return MODEL_CATALOG_THINKING_LEVELS.filter((level) => mapped.has(level));
}
//#endregion
export { resolveOpenAIThinkingApi as a, listMappedModelThinkingLevels as i, MODEL_CATALOG_THINKING_LEVELS as n, isModelCatalogThinkingFormat as r, MODEL_CATALOG_APIS as t };
