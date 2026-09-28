import { META_MODEL_CATALOG } from "./models.js";
//#region extensions/meta/thinking.ts
const META_REASONING_MODEL_IDS = new Set(META_MODEL_CATALOG.filter((model) => model.reasoning).map((model) => model.id.toLowerCase()));
const META_THINKING_PROFILE = {
	levels: [
		"off",
		"minimal",
		"low",
		"medium",
		"high",
		"xhigh"
	].map((id) => ({ id })),
	defaultLevel: "high"
};
function resolveMetaThinkingProfile(context) {
	return context.reasoning ?? META_REASONING_MODEL_IDS.has(context.modelId.toLowerCase()) ? META_THINKING_PROFILE : void 0;
}
//#endregion
export { resolveMetaThinkingProfile };
