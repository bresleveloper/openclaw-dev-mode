import { t as buildConfiguredAgentSystemPrompt } from "./system-prompt-config-CNHjVkfv.mjs";
//#region src/agents/embedded-agent-runner/system-prompt.ts
function buildEmbeddedSystemPrompt(params) {
	const { tools, ...promptParams } = params;
	return buildConfiguredAgentSystemPrompt({
		...promptParams,
		agentId: params.agentId ?? params.runtimeInfo.agentId,
		toolNames: tools.map((tool) => tool.name),
		messageTool: tools.find((tool) => tool.name.trim().toLowerCase() === "message")
	});
}
function applySystemPromptToSession(session, systemPrompt) {
	session.setBaseSystemPrompt(systemPrompt.trim());
}
//#endregion
export { buildEmbeddedSystemPrompt as n, applySystemPromptToSession as t };
