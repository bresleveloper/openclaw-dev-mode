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
function resolveRequestedEffort(thinkingLevel, options) {
	const withEffort = options ?? {};
	const raw = typeof withEffort.reasoningEffort === "string" && withEffort.reasoningEffort || typeof withEffort.reasoning === "string" && withEffort.reasoning || typeof thinkingLevel === "string" && thinkingLevel || void 0;
	return raw ? raw.trim().toLowerCase() : void 0;
}
function wrapTencentProviderStream(ctx) {
	return createPayloadPatchStreamWrapper(ctx.streamFn, ({ payload, options }) => {
		const requested = resolveRequestedEffort(ctx.thinkingLevel, options);
		const mapped = requested && Object.hasOwn(TENCENT_TWO_RUNG_EFFORT_MAP, requested) ? TENCENT_TWO_RUNG_EFFORT_MAP[requested] : void 0;
		if (mapped !== void 0) payload.reasoning_effort = mapped;
	}, { shouldPatch: ({ model }) => TENCENT_PROVIDER_IDS.has(model.provider) && model.api === "openai-completions" && model.id === "hy3" });
}
//#endregion
export { wrapTencentProviderStream };
