import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { n as resolveEffectiveToolFsWorkspaceOnly } from "./tool-fs-policy-C65zBDHN.mjs";
import { n as isRestartEnabled } from "./commands.flags-DCgrWS7a.mjs";
import { t as shouldHandleTextCommands } from "./commands-text-routing-C0zJ6oP2.mjs";
import { r as buildTtsSystemPromptHint } from "./tts-settings-D0coreBP.mjs";
import { n as buildAgentSystemPrompt } from "./system-prompt-BDZF44Ov.mjs";
import { d as resolveMainSessionDelegationMode } from "./watched-sessions-prompt-BLCfWONY.mjs";
import { n as resolveNativeCommandsEnabled } from "./commands-ChveDd3R.mjs";
//#region src/agents/system-prompt-config.ts
/**
* Config-aware system prompt builder.
*
* This module gathers agent/config knobs before rendering the canonical system
* prompt so callers do not duplicate owner, TTS, alias, memory, or FS policy.
*/
function buildModelAliasLines(owner) {
	if (!owner) return [];
	return (owner.configuredModelAliases ?? []).toSorted((a, b) => a.alias.localeCompare(b.alias)).map(({ alias, provider, model }) => `- ${alias}: ${provider}/${model}`);
}
/** Builds the agent system prompt after applying config-derived prompt fields. */
function buildConfiguredAgentSystemPrompt(params) {
	const { config, tools, agentId: explicitAgentId, preparedModelRuntime, preparedTtsPreferences, ...renderParams } = params;
	const agentId = explicitAgentId ?? (tools ? params.runtimeInfo?.agentId : void 0);
	if (tools) {
		renderParams.toolNames = tools.map((tool) => tool.name);
		renderParams.messageTool = tools.find((tool) => tool.name.trim().toLowerCase() === "message");
	}
	if (!config) return buildAgentSystemPrompt(renderParams);
	const channel = normalizeOptionalLowercaseString(renderParams.runtimeInfo?.channel) ?? "";
	const includeFullSections = renderParams.promptMode !== "minimal" && renderParams.promptMode !== "none";
	return buildAgentSystemPrompt({
		...renderParams,
		reasoningCommandsEnabled: shouldHandleTextCommands({
			cfg: config,
			surface: channel
		}) || resolveNativeCommandsEnabled({
			providerId: channel,
			providerSetting: config.channels?.[channel]?.commands?.native,
			globalSetting: config.commands?.native,
			config
		}),
		restartCommandsEnabled: isRestartEnabled(config),
		ownerDisplay: "raw",
		ownerDisplaySecret: void 0,
		subagentDelegationMode: resolveMainSessionDelegationMode({
			config,
			agentId,
			sessionKey: renderParams.runtimeInfo?.sessionKey
		}),
		ttsHint: includeFullSections ? buildTtsSystemPromptHint(config, agentId, {
			preparedTtsPreferences,
			messageToolOnly: renderParams.sourceReplyDeliveryMode === "message_tool_only"
		}) : void 0,
		modelAliasLines: includeFullSections ? buildModelAliasLines(preparedModelRuntime) : [],
		memoryCitationsMode: config.memory?.citations,
		fsWorkspaceOnly: resolveEffectiveToolFsWorkspaceOnly({
			cfg: config,
			agentId
		})
	});
}
//#endregion
export { buildConfiguredAgentSystemPrompt as t };
