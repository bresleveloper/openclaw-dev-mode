//#region extensions/kimi-coding/provider-policy-api.ts
const KIMI_K3_1_MODEL_IDS = ["k3.1-pro", "k3.1-pro-highspeed"];
const KIMI_K3_MODEL_IDS = [
	"k3",
	"k3-256k",
	"kimi-k3",
	...KIMI_K3_1_MODEL_IDS
];
const KIMI_K3_LEGACY_MODEL_IDS = ["k3[1m]"];
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
	const normalized = modelId.trim().toLowerCase();
	return KIMI_K3_MODEL_IDS.includes(normalized) || KIMI_K3_LEGACY_MODEL_IDS.includes(normalized);
}
/** Kimi Code K3.1 Pro models, whose backend rejects disabled thinking. */
function isKimiK31ModelId(modelId) {
	const normalized = modelId.trim().toLowerCase();
	return KIMI_K3_1_MODEL_IDS.some((id) => id === normalized);
}
function resolveThinkingProfile({ modelId }) {
	if (isKimiK3ModelId(modelId)) return {
		levels: isKimiK31ModelId(modelId) ? KIMI_K3_THINKING_LEVELS.filter(({ id }) => id !== "off") : KIMI_K3_THINKING_LEVELS,
		defaultLevel: modelId.trim().toLowerCase() === "kimi-k3" ? "off" : "high",
		preserveWhenCatalogReasoningFalse: true
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
//#endregion
export { KIMI_K3_MODEL_IDS, KIMI_K3_THINKING_EFFORTS, isKimiK31ModelId, isKimiK3ModelId, resolveThinkingProfile };
