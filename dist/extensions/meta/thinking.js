import { n as META_MODEL_CATALOG } from "./.setup/provider-catalog-BNTlqvTm.mjs";
//#region extensions/meta/thinking.ts
const META_REASONING_MODELS = new Map(META_MODEL_CATALOG.filter((model) => model.reasoning).map((model) => [model.id.toLowerCase(), model]));
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
const META_MAX_THINKING_PROFILE = {
	...META_THINKING_PROFILE,
	levels: [...META_THINKING_PROFILE.levels, { id: "max" }]
};
function resolveMetaThinkingProfile(context) {
	const catalogModel = META_REASONING_MODELS.get(context.modelId.toLowerCase());
	if (!(context.reasoning ?? catalogModel?.reasoning)) return;
	const efforts = context.compat?.supportedReasoningEfforts ?? catalogModel?.compat.supportedReasoningEfforts;
	return context.thinkingLevelMap?.max !== null && efforts?.includes("max") ? META_MAX_THINKING_PROFILE : META_THINKING_PROFILE;
}
//#endregion
export { resolveMetaThinkingProfile };
