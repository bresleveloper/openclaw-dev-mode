import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { r as detectRuntimeShell } from "./shell-utils-D_gDHHBQ.mjs";
import "./model-selection-CFnUi6iD.mjs";
import { i as resolveRuntimeOsLabel } from "./os-summary-B-12bRQs.mjs";
import { i as prepareActiveNodeContext } from "./active-node-context-Chc0tKJ6.mjs";
import { t as collectRuntimeChannelCapabilities } from "./runtime-capabilities-CJ-I3wZ8.mjs";
import { t as buildSystemPromptParams } from "./system-prompt-params-CQI69lAx.mjs";
import { i as resolveChannelMessageToolHints, o as resolveChannelReactionGuidance } from "./channel-tools-Brx-Bt2o.mjs";
import { t as getMachineDisplayName } from "./machine-name-BYeXMPA1.mjs";
import os from "node:os";
//#region src/agents/runtime-prompt.ts
async function resolveAgentRuntimePrompt(params) {
	const runtimeChannel = normalizeMessageChannel(params.channel);
	const channelPromptContext = {
		cfg: params.config,
		channel: runtimeChannel,
		accountId: params.accountId
	};
	const runtimeCapabilities = collectRuntimeChannelCapabilities(channelPromptContext);
	const reactionGuidance = runtimeChannel && params.config ? resolveChannelReactionGuidance(channelPromptContext) : void 0;
	const messageToolHints = runtimeChannel ? resolveChannelMessageToolHints(channelPromptContext) : void 0;
	const defaultModel = resolveDefaultModelForAgent({
		cfg: params.config ?? {},
		agentId: params.agentId
	});
	const machineName = await getMachineDisplayName();
	await prepareActiveNodeContext();
	return {
		...buildSystemPromptParams({
			config: params.config,
			agentId: params.agentId,
			workspaceDir: params.workspaceDir,
			cwd: params.cwd,
			...Object.hasOwn(params, "preparedRepoRoot") ? { preparedRepoRoot: params.preparedRepoRoot } : {},
			...Object.hasOwn(params, "preparedGitCoauthorPrompt") ? { preparedGitCoauthorPrompt: params.preparedGitCoauthorPrompt } : {},
			runtime: {
				sessionKey: params.sessionKey,
				sessionId: params.sessionId,
				host: machineName,
				os: resolveRuntimeOsLabel(),
				arch: os.arch(),
				node: process.version,
				model: params.model,
				defaultModel: `${defaultModel.provider}/${defaultModel.model}`,
				shell: detectRuntimeShell(),
				channel: runtimeChannel,
				chatType: params.chatType,
				capabilities: runtimeCapabilities
			}
		}),
		runtimeChannel,
		runtimeCapabilities,
		reactionGuidance,
		messageToolHints
	};
}
//#endregion
export { resolveAgentRuntimePrompt as t };
