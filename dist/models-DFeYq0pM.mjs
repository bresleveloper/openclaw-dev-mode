import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
//#region extensions/openrouter/models.ts
const OPENROUTER_MISTRAL_MODEL_PREFIXES = [
	"mistralai/",
	"mistral/",
	"mistral-",
	"codestral-",
	"devstral-",
	"ministral-",
	"mixtral-",
	"pixtral-",
	"voxtral-"
];
const OPENROUTER_MODEL_PREFIX = "openrouter/";
const OPENROUTER_SHORT_TO_API_MODEL_ID = /* @__PURE__ */ new Map([["deepseek-v4-flash", "deepseek/deepseek-v4-flash"], ["deepseek-v4-pro", "deepseek/deepseek-v4-pro"]]);
function normalizeOpenRouterModelFamilyId(modelId) {
	if (typeof modelId !== "string") return;
	return normalizeLowercaseStringOrEmpty(modelId).replace(/^openrouter\//, "").replace(/^~/, "");
}
function normalizeOpenRouterApiModelId(modelId) {
	if (typeof modelId !== "string") return;
	const normalized = normalizeLowercaseStringOrEmpty(modelId);
	if (!normalized.startsWith(OPENROUTER_MODEL_PREFIX)) return normalized;
	const unprefixed = normalized.slice(11);
	const shortExpanded = OPENROUTER_SHORT_TO_API_MODEL_ID.get(unprefixed);
	if (shortExpanded) return shortExpanded;
	return unprefixed.includes("/") ? unprefixed : normalized;
}
function isOpenRouterMistralModelId(modelId) {
	const normalized = normalizeOpenRouterModelFamilyId(modelId);
	return Boolean(normalized && OPENROUTER_MISTRAL_MODEL_PREFIXES.some((prefix) => normalized.startsWith(prefix)));
}
function isOpenRouterDeepSeekV4ModelId(modelId) {
	return /^deepseek\/deepseek-v4-(?:flash|pro)(?:-\d{4,8})?(?::[^/]*)?$/.test(normalizeOpenRouterModelFamilyId(modelId) ?? "");
}
//#endregion
export { normalizeOpenRouterModelFamilyId as i, isOpenRouterMistralModelId as n, normalizeOpenRouterApiModelId as r, isOpenRouterDeepSeekV4ModelId as t };
