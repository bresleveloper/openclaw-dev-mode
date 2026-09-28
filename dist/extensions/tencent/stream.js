import { o as TOKENPLAN_PROVIDER_ID, r as TOKENHUB_PROVIDER_ID } from "./.setup/models-CeL6cmHz.mjs";
import { createPayloadPatchStreamWrapper } from "openclaw/plugin-sdk/provider-stream-shared";
//#region extensions/tencent/stream.ts
const TENCENT_PROVIDER_IDS = /* @__PURE__ */ new Set([TOKENHUB_PROVIDER_ID, TOKENPLAN_PROVIDER_ID]);
const TENCENT_TWO_RUNG_EFFORT_MAP = Object.freeze({
	off: "none",
	none: "none",
	minimal: "high",
	low: "high",
	medium: "high",
	high: "high",
	xhigh: "high"
});
const TENCENT_TWO_RUNG_MODEL_IDS = /* @__PURE__ */ new Set(["hy3"]);
function resolveRequestedEffort(thinkingLevel, options) {
	const withEffort = options ?? {};
	const raw = typeof withEffort.reasoningEffort === "string" && withEffort.reasoningEffort || typeof withEffort.reasoning === "string" && withEffort.reasoning || typeof thinkingLevel === "string" && thinkingLevel || void 0;
	return raw ? raw.trim().toLowerCase() : void 0;
}
function mapEffortForTencent(model, effort) {
	if (!effort) return;
	const modelId = model.id;
	if (typeof modelId === "string" && TENCENT_TWO_RUNG_MODEL_IDS.has(modelId)) return TENCENT_TWO_RUNG_EFFORT_MAP[effort];
}
function isTencentCompletionsCall(model) {
	const provider = model.provider;
	const api = model.api;
	return typeof provider === "string" && TENCENT_PROVIDER_IDS.has(provider) && api === "openai-completions";
}
function wrapTencentProviderStream(ctx) {
	return createPayloadPatchStreamWrapper(ctx.streamFn, ({ payload, model, options }) => {
		const mapped = mapEffortForTencent(model, resolveRequestedEffort(ctx.thinkingLevel, options));
		if (mapped === void 0) return;
		if (mapped === "none" || mapped === "off") {
			payload.reasoning_effort = "none";
			return;
		}
		payload.reasoning_effort = mapped;
	}, { shouldPatch: ({ model }) => isTencentCompletionsCall(model) });
}
//#endregion
export { wrapTencentProviderStream };
