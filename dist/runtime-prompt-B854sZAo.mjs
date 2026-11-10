import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { i as resolveRuntimeOsLabel } from "./os-summary-DH0HB36b.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { r as detectRuntimeShell } from "./shell-utils-bJwhgbCe.mjs";
import { a as prepareActiveNodeContext } from "./active-node-context-DpQMef3G.mjs";
import { t as getMachineDisplayName } from "./machine-name-e279gKlh.mjs";
import { t as resolveSessionGitCoauthorPrompt } from "./git-coauthor-prompt-1BKiEZdL.mjs";
import { t as resolveRuntimeChannelPromptContext } from "./runtime-capabilities-CasEQ37J.mjs";
import { t as buildSystemPromptParams } from "./system-prompt-params-CL2E6h7b.mjs";
import os from "node:os";
//#region src/agents/runtime-prompt.ts
async function resolveAgentRuntimePrompt(params) {
	const channelPromptContext = resolveRuntimeChannelPromptContext({
		cfg: params.config,
		channel: params.channel,
		accountId: params.accountId
	});
	const { runtimeChannel, runtimeCapabilities } = channelPromptContext;
	const defaultModel = resolveDefaultModelForAgent({
		cfg: params.config ?? {},
		agentId: params.agentId
	});
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
			...params.remoteWorkspace ? { preparedRepoRoot: null } : Object.hasOwn(params, "preparedRepoRoot") ? { preparedRepoRoot: params.preparedRepoRoot } : {},
			preparedGitCoauthorPrompt,
			requesterProfileId: params.requesterProfileId,
			runtime: {
				sessionKey: params.sessionKey,
				sessionId: params.sessionId,
				host: params.remoteWorkspace ? "" : await getMachineDisplayName(),
				os: params.remoteWorkspace ? "" : resolveRuntimeOsLabel(),
				arch: params.remoteWorkspace ? "" : os.arch(),
				node: params.remoteWorkspace ? "" : process.version,
				model: params.model,
				defaultModel: `${defaultModel.provider}/${defaultModel.model}`,
				shell: params.remoteWorkspace ? void 0 : detectRuntimeShell(),
				channel: runtimeChannel,
				chatType: params.chatType,
				capabilities: runtimeCapabilities,
				customInlineButtonHint: channelPromptContext.customInlineButtonHint
			}
		}),
		...channelPromptContext
	};
}
//#endregion
export { resolveAgentRuntimePrompt as t };
