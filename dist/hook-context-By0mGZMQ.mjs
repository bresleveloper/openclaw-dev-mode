import { n as buildAgentHookContextIdentityFields } from "./hook-agent-context-Bx9S6KFK.mjs";
import { n as assertMemoryAudienceSession, t as assertMemoryAudienceCurrent } from "./memory-audience-1w812bVn.mjs";
//#region src/agents/harness/hook-context.ts
/** Builds the sparse hook context object passed to agent harness plugin hooks. */
function buildAgentHookContext(params) {
	const { memoryAudience } = params;
	if (memoryAudience) assertMemoryAudienceSession(memoryAudience, params.sessionKey);
	return {
		...params.runId ? { runId: params.runId } : {},
		...params.trace ? { trace: params.trace } : {},
		...params.jobId ? { jobId: params.jobId } : {},
		...params.agentId ? { agentId: params.agentId } : {},
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		...params.sessionId ? { sessionId: params.sessionId } : {},
		...memoryAudience ? {
			memoryAudience,
			assertMemoryAudienceCurrent: () => assertMemoryAudienceCurrent(memoryAudience)
		} : {},
		...params.sandboxed !== void 0 ? { sandboxed: params.sandboxed } : {},
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
		...params.modelProviderId ? { modelProviderId: params.modelProviderId } : {},
		...params.modelId ? { modelId: params.modelId } : {},
		...params.messageProvider ? { messageProvider: params.messageProvider } : {},
		...params.accountId ? { accountId: params.accountId } : {},
		...params.channel ? { channel: params.channel } : {},
		...params.trigger ? { trigger: params.trigger } : {},
		...params.inputProvenance ? { inputProvenance: params.inputProvenance } : {},
		...params.channelId ? { channelId: params.channelId } : {},
		...params.contextTokenBudget ? { contextTokenBudget: params.contextTokenBudget } : {},
		...params.contextWindowSource ? { contextWindowSource: params.contextWindowSource } : {},
		...params.contextWindowReferenceTokens ? { contextWindowReferenceTokens: params.contextWindowReferenceTokens } : {},
		...buildAgentHookContextIdentityFields({
			trigger: params.trigger,
			senderId: params.senderId,
			chatId: params.chatId,
			channelContext: params.channelContext
		})
	};
}
//#endregion
export { buildAgentHookContext as t };
