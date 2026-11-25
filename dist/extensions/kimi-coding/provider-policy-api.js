import { t as openclaw_plugin_default } from "./.setup/openclaw.plugin-IIHLKnoD.mjs";
// extensions/kimi-coding/provider-policy-api.ts
const MODELS = openclaw_plugin_default.modelCatalog.providers.kimi.models;
const KIMI_K3_MODEL_IDS = /* @__PURE__ */ new Set([
	...MODELS.flatMap((row) => row.compat?.supportedReasoningEfforts ? [row.id] : []),
	"kimi-k3",
	"k3[1m]"
]);
const KIMI_CODE_ENABLED_ONLY_MODEL_IDS = /* @__PURE__ */ new Set([
	...MODELS.flatMap((row) => row.thinkingLevelMap && "off" in row.thinkingLevelMap && row.thinkingLevelMap.off === null ? [row.id] : []),
	"kimi-for-coding",
	"kimi-for-coding-highspeed",
	"kimi-code",
	"k2p5"
]);
const KIMI_K3_THINKING_EFFORTS = {
	minimal: "low",
	low: "low",
	medium: "high",
	high: "high",
	xhigh: "max",
	max: "max"
};
const KIMI_K3_THINKING_LEVELS = [
	{ id: "off" },
	{ id: "minimal" },
	{ id: "low" },
	{ id: "medium" },
	{ id: "high" },
	{ id: "adaptive" },
	{ id: "xhigh" },
	{ id: "max" }
];
function isKimiK3ModelId(modelId) {
	return KIMI_K3_MODEL_IDS.has(modelId.trim().toLowerCase());
}
/** Kimi Code models whose backend cannot honor disabled thinking. */
function isKimiCodeEnabledOnlyModelId(modelId) {
	return KIMI_CODE_ENABLED_ONLY_MODEL_IDS.has(modelId.trim().toLowerCase());
}
function resolveThinkingProfile({ modelId }) {
	if (isKimiK3ModelId(modelId)) return {
		levels: isKimiCodeEnabledOnlyModelId(modelId) ? KIMI_K3_THINKING_LEVELS.filter(({ id }) => id !== "off") : KIMI_K3_THINKING_LEVELS,
		defaultLevel: modelId.trim().toLowerCase() === "kimi-k3" ? "off" : "high",
		preserveWhenCatalogReasoningFalse: true
	};
	if (isKimiCodeEnabledOnlyModelId(modelId)) return {
		levels: [{
			id: "low",
			label: "on"
		}],
		defaultLevel: "low"
	};
	return {
		levels: [{
			id: "off",
			label: "off"
		}, {
			id: "low",
			label: "on"
		}],
		defaultLevel: "off"
	};
}
export { KIMI_K3_THINKING_EFFORTS, isKimiCodeEnabledOnlyModelId, isKimiK3ModelId, resolveThinkingProfile };
