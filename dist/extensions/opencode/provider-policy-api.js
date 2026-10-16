import { resolveClaudeThinkingProfile } from "openclaw/plugin-sdk/claude-model-runtime";
import { resolveEffortThinkingProfile } from "openclaw/plugin-sdk/provider-thinking-runtime";
//#region extensions/opencode/provider-policy-api.ts
const FIXED_REASONING_PROFILE = {
	levels: [{
		id: "off",
		label: "always on"
	}],
	defaultLevel: "off"
};
function resolveThinkingProfile(params) {
	const modelId = params.modelId.trim().toLowerCase();
	if (modelId.startsWith("claude-")) return resolveClaudeThinkingProfile(modelId);
	const effortProfile = resolveEffortThinkingProfile(params.compat?.supportedReasoningEfforts);
	if (effortProfile) return effortProfile;
	return params.reasoning === true && params.api !== "anthropic-messages" ? FIXED_REASONING_PROFILE : void 0;
}
//#endregion
export { resolveThinkingProfile };
