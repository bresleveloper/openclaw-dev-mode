import { a as normalizeFastMode } from "./string-coerce-1VuiLaaR.mjs";
import { normalizeOpenAIServiceTier, resolveOpenAIResponsesPayloadPolicy } from "@openclaw/ai/internal/openai-responses-payload-policy";
//#region src/llm/providers/openai-fast-mode.ts
function normalizeOpenAIFastMode(value) {
	if (typeof value === "function") return normalizeOpenAIFastMode(value());
	const fastMode = normalizeFastMode(value);
	return fastMode === "auto" ? void 0 : fastMode;
}
function supportsOpenAIResponsesFastMode(model) {
	return model.provider === "openai" && (model.api === "openai-responses" || model.api === "openai-chatgpt-responses" || model.api === "azure-openai-responses") && resolveOpenAIResponsesPayloadPolicy(model, { storeMode: "disable" }).allowsServiceTier;
}
//#endregion
export { normalizeOpenAIServiceTier as n, supportsOpenAIResponsesFastMode as r, normalizeOpenAIFastMode as t };
