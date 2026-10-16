import { t as resolveDefaultModelForAgent } from "./model-selection-config-DYd_ufXT.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CqBAHB04.mjs";
import "./message-channel-j-k-Nup3.mjs";
import { r as detectRuntimeShell } from "./shell-utils-WeFwTUA7.mjs";
import "./model-selection-C1qxt1eY.mjs";
import { i as resolveRuntimeOsLabel } from "./os-summary-DH0HB36b.mjs";
import { a as prepareActiveNodeContext } from "./active-node-context-DpQMef3G.mjs";
import { i as resolveChannelMessageToolHints, o as resolveChannelReactionGuidance } from "./channel-tools-D2tkbara.mjs";
import { t as collectRuntimeChannelCapabilities } from "./runtime-capabilities-DnDmkbcg.mjs";
import { t as getMachineDisplayName } from "./machine-name-XEOScrzy.mjs";
import { t as resolveSessionGitCoauthorPrompt } from "./git-coauthor-prompt-hoIUHaT4.mjs";
import { t as buildSystemPromptParams } from "./system-prompt-params-CH6jpQWl.mjs";
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
	await prepareActiveNodeContext(params.requesterProfileId);
	const preparedGitCoauthorPrompt = Object.hasOwn(params, "preparedGitCoauthorPrompt") ? params.preparedGitCoauthorPrompt : await resolveSessionGitCoauthorPrompt({
		config: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		...params.sessionId ? { sessionId: params.sessionId } : {}
	});
	return {
		...buildSystemPromptParams({
			config: params.config,
			agentId: params.agentId,
			workspaceDir: params.workspaceDir,
			cwd: params.cwd,
			...Object.hasOwn(params, "preparedRepoRoot") ? { preparedRepoRoot: params.preparedRepoRoot } : {},
			preparedGitCoauthorPrompt,
			requesterProfileId: params.requesterProfileId,
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
