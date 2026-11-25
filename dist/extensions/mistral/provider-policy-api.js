import { t as openclaw_plugin_default } from "./.setup/openclaw.plugin-DHgrttkQ.mjs";
// extensions/mistral/provider-policy-api.ts
const MISTRAL_SMALL_LATEST_ID = "mistral-small-latest";
const MISTRAL_SMALL_4_ID = "mistral-small-2603";
const MISTRAL_MEDIUM_3_5_ID = "mistral-medium-3-5";
const REASONING_EFFORT_MAPS = new Map(openclaw_plugin_default.modelCatalog.providers.mistral.models.flatMap((row) => {
	if (!row.thinkingLevelMap) return [];
	const { max, ...levels } = row.thinkingLevelMap;
	return [[row.id, {
		...levels,
		adaptive: "high",
		max
	}]];
}));
function resolveMistralReasoningEffortMap(modelId) {
	return modelId === void 0 ? void 0 : REASONING_EFFORT_MAPS.get(modelId);
}
export { MISTRAL_MEDIUM_3_5_ID, MISTRAL_SMALL_4_ID, MISTRAL_SMALL_LATEST_ID, resolveMistralReasoningEffortMap };
