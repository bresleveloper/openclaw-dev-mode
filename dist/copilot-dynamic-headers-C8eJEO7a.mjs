import { projectCopilotRequestFacts } from "@openclaw/ai/internal/shared";
//#region src/agents/copilot-dynamic-headers.ts
/**
* Builds GitHub Copilot provider compatibility headers from message content.
*/
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
const COPILOT_EDITOR_VERSION = "vscode/1.107.0";
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
const COPILOT_USER_AGENT = "GitHubCopilotChat/0.35.0";
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
const COPILOT_EDITOR_PLUGIN_VERSION = "copilot-chat/0.35.0";
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
const COPILOT_GITHUB_API_VERSION = "2025-04-01";
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
const COPILOT_INTEGRATION_ID = "vscode-chat";
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
function buildCopilotIdeHeaders(params = {}) {
	return {
		"Accept-Encoding": "identity",
		"Editor-Version": COPILOT_EDITOR_VERSION,
		"Editor-Plugin-Version": COPILOT_EDITOR_PLUGIN_VERSION,
		"User-Agent": COPILOT_USER_AGENT,
		...params.includeApiVersion ? { "X-Github-Api-Version": COPILOT_GITHUB_API_VERSION } : {}
	};
}
/** Return true when Copilot should receive its vision request header. */
function hasCopilotVisionInput(messages) {
	return projectCopilotRequestFacts(messages, "nested").hasImages;
}
/** Build per-request Copilot headers, including initiator and vision flags. */
function buildCopilotDynamicHeaders(params) {
	return {
		"x-initiator": projectCopilotRequestFacts(params.messages, "nested", params.hasImages).initiator,
		...params.hasImages ? { "Copilot-Vision-Request": "true" } : {}
	};
}
//#endregion
export { COPILOT_USER_AGENT as a, hasCopilotVisionInput as c, COPILOT_INTEGRATION_ID as i, COPILOT_EDITOR_VERSION as n, buildCopilotDynamicHeaders as o, COPILOT_GITHUB_API_VERSION as r, buildCopilotIdeHeaders as s, COPILOT_EDITOR_PLUGIN_VERSION as t };
