import { T as parseCronRunScopeSuffix } from "./session-key-CSDERtm3.mjs";
import { n as sanitizeForPromptLiteral } from "./sanitize-for-prompt-bzCyHFCH.mjs";
import { SYSTEM_PROMPT_RELOCATABLE_BOUNDARY_END, normalizePromptCapabilityIds } from "@openclaw/ai/internal/shared";
//#region src/agents/system-prompt-runtime.ts
function buildRuntimeLine(runtimeInfo, runtimeChannel, runtimeCapabilities = []) {
	const normalizedRuntimeCapabilities = normalizePromptCapabilityIds(runtimeCapabilities);
	const { baseSessionKey } = parseCronRunScopeSuffix(runtimeInfo?.sessionKey);
	const fields = {
		name: runtimeInfo?.agentName,
		agent: runtimeInfo?.agentId,
		session: baseSessionKey && sanitizeForPromptLiteral(baseSessionKey),
		sessionUrl: runtimeInfo?.sessionUrl && sanitizeForPromptLiteral(runtimeInfo.sessionUrl),
		host: runtimeInfo?.host,
		repo: runtimeInfo?.repoRoot,
		os: runtimeInfo?.os && `${runtimeInfo.os}${runtimeInfo.arch ? ` (${runtimeInfo.arch})` : ""}`,
		arch: runtimeInfo?.os ? void 0 : runtimeInfo?.arch,
		node: runtimeInfo?.node,
		active_node: runtimeInfo?.activeNode && sanitizeForPromptLiteral(runtimeInfo.activeNode),
		active_node_identity: runtimeInfo?.activeNodeIdentity,
		model: runtimeInfo?.model,
		default_model: runtimeInfo?.defaultModel,
		shell: runtimeInfo?.shell,
		channel: runtimeChannel,
		capabilities: runtimeChannel && (normalizedRuntimeCapabilities.join(",") || "none")
	};
	return `Runtime: ${Object.entries(fields).filter(([, value]) => value).map(([key, value]) => `${key}=${value}`).join(" | ")}`;
}
/** Complete only the renderer-owned runtime region with the executing host's facts. */
function completeSystemPromptRuntime(systemPrompt, environment) {
	return systemPrompt.replace(SYSTEM_PROMPT_RELOCATABLE_BOUNDARY_END, () => ` | ${buildRuntimeLine(environment).slice(9)}${SYSTEM_PROMPT_RELOCATABLE_BOUNDARY_END}`);
}
//#endregion
export { completeSystemPromptRuntime as n, buildRuntimeLine as t };
