import { r as resolveCopilotThinkingLevelMap } from "./model-metadata-2b9VF8l_.mjs";
//#region extensions/github-copilot/provider-policy-api.ts
function resolveThinkingProfile(context) {
	if (context.provider.trim().toLowerCase() !== "github-copilot") return null;
	const thinkingLevelMap = resolveCopilotThinkingLevelMap(context.modelId, context.compat, context.api);
	return { levels: [
		{ id: "off" },
		{ id: "minimal" },
		{ id: "low" },
		{ id: "medium" },
		{ id: "high" },
		...["xhigh", "max"].filter((id) => thinkingLevelMap?.[id]).map((id) => ({ id }))
	] };
}
//#endregion
export { resolveThinkingProfile as t };
