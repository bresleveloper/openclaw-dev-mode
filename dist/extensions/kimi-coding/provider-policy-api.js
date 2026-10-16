//#region extensions/kimi-coding/provider-policy-api.ts
const KIMI_K3_MODEL_IDS = ["k3", "k3-256k"];
const KIMI_K3_LEGACY_MODEL_IDS = ["k3[1m]"];
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
function resolveThinkingProfile({ modelId }) {
	if (isKimiK3ModelId(modelId)) return {
		levels: KIMI_K3_THINKING_LEVELS,
		defaultLevel: "high",
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
export { KIMI_K3_MODEL_IDS, isKimiK3ModelId, resolveThinkingProfile };
