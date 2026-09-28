import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { resolveOpenAIResponsesPayloadPolicy } from "@openclaw/ai/internal/openai-responses-payload-policy";
//#region src/llm/providers/openai-fast-mode.ts
function normalizeOpenAIServiceTier(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	return normalized === "auto" || normalized === "default" || normalized === "flex" || normalized === "priority" ? normalized : void 0;
}
function supportsOpenAIResponsesFastMode(model) {
	return model.provider === "openai" && (model.api === "openai-responses" || model.api === "openai-chatgpt-responses" || model.api === "azure-openai-responses") && resolveOpenAIResponsesPayloadPolicy(model, { storeMode: "disable" }).allowsServiceTier;
}
//#endregion
//#region src/llm/providers/minimax-fast-mode.ts
const MINIMAX_FAST_MODEL_IDS = /* @__PURE__ */ new Map([["MiniMax-M2.7", "MiniMax-M2.7-highspeed"]]);
function resolveMinimaxFastModelId(model) {
	return model.api === "anthropic-messages" && (model.provider === "minimax" || model.provider === "minimax-portal") ? MINIMAX_FAST_MODEL_IDS.get(model.id.trim()) : void 0;
}
//#endregion
export { normalizeOpenAIServiceTier as n, supportsOpenAIResponsesFastMode as r, resolveMinimaxFastModelId as t };
