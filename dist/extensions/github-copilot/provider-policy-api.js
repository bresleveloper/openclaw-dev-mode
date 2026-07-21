import { t as resolveCopilotExtendedThinkingLevels } from "../../model-metadata-Cb1r8fS0.js";
//#region extensions/github-copilot/provider-policy-api.ts
function resolveThinkingProfile(context) {
	if (context.provider.trim().toLowerCase() !== "github-copilot") return null;
	return { levels: [
		{ id: "off" },
		{ id: "minimal" },
		{ id: "low" },
		{ id: "medium" },
		{ id: "high" },
		...resolveCopilotExtendedThinkingLevels(context.modelId, context.compat).map((id) => ({ id }))
	] };
}
//#endregion
export { resolveThinkingProfile };
