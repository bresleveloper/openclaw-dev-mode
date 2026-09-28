import { n as isXaiXhighModelId, t as isXaiFrontierModelId } from "./model-id-BpefGMul.mjs";
import { r as applyXaiModelCompat } from "./model-compat-DJMBHfe0.mjs";
import { n as supportsXaiPromptCacheKey } from "./provider-routing-CM5xf7if.mjs";
//#region extensions/xai/runtime-model-compat.ts
const XAI_UNSUPPORTED_REASONING_EFFORTS = {
	off: null,
	minimal: null,
	low: null,
	medium: null,
	high: null,
	xhigh: null
};
const XAI_REASONING_EFFORTS = {
	off: null,
	minimal: "low",
	low: "low",
	medium: "medium",
	high: "high",
	xhigh: "high"
};
const XAI_SUPPORTED_REASONING_EFFORTS = [
	"low",
	"medium",
	"high"
];
function isGrok43Model(id) {
	return id === "grok-latest" || id === "grok-4.3" || id.startsWith("grok-4.3-");
}
function applyXaiRuntimeModelCompat(model) {
	const withCompat = applyXaiModelCompat(model);
	const id = typeof withCompat.id === "string" ? withCompat.id.trim().toLowerCase() : "";
	const supportsReasoningEffort = withCompat.reasoning === true && (isGrok43Model(id) || isXaiFrontierModelId(id));
	const existingCompat = withCompat.compat && typeof withCompat.compat === "object" ? { ...withCompat.compat } : {};
	if (supportsXaiPromptCacheKey(withCompat)) {
		existingCompat.supportsPromptCacheKey ??= true;
		existingCompat.supportsLongCacheRetention ??= false;
	}
	return {
		...withCompat,
		compat: {
			...existingCompat,
			supportsReasoningEffort,
			...supportsReasoningEffort ? { supportedReasoningEfforts: [
				...isGrok43Model(id) ? ["none"] : [],
				...XAI_SUPPORTED_REASONING_EFFORTS,
				...isXaiXhighModelId(id) ? ["xhigh"] : []
			] } : {}
		},
		thinkingLevelMap: {
			...withCompat.thinkingLevelMap,
			...supportsReasoningEffort ? XAI_REASONING_EFFORTS : XAI_UNSUPPORTED_REASONING_EFFORTS,
			...supportsReasoningEffort && isGrok43Model(id) ? { off: "none" } : {},
			...supportsReasoningEffort && isXaiXhighModelId(id) ? { xhigh: "xhigh" } : {}
		}
	};
}
//#endregion
export { applyXaiRuntimeModelCompat as t };
