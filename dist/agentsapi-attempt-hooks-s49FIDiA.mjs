import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { t as buildAgentHookContextChannelFields } from "./hook-agent-context-C9bjjC7S.mjs";
import { r as runAgentEndSideEffectsAsync, t as awaitAgentEndSideEffects } from "./agent-end-side-effects-qwj0xulU.mjs";
import { o as runAgentHarnessLlmOutputHook } from "./lifecycle-hook-helpers-BAkeSLPH.mjs";
import { r as buildEmbeddedForegroundPromptContext } from "./attempt-tool-run-context-B4q5w5uB.mjs";
import "./agent-harness-runtime-k_z2ig1L.mjs";
//#region extensions/agentsapi/agentsapi-attempt-hooks.ts
function createAgentsApiAttemptHooks(params, agentId, startedAtMs) {
	const contextWindow = {
		contextTokenBudget: params.contextWindowInfo?.tokens ?? params.contextTokenBudget,
		contextWindowSource: params.contextWindowInfo?.source,
		contextWindowReferenceTokens: params.contextWindowInfo?.referenceTokens
	};
	const hookContext = {
		runId: params.runId,
		config: params.config,
		agentId,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		workspaceDir: params.workspaceDir,
		modelProviderId: params.provider,
		modelId: params.model.id,
		trigger: params.trigger,
		inputProvenance: params.inputProvenance,
		...buildAgentHookContextChannelFields(params),
		channelContext: params.channelContext,
		...contextWindow
	};
	return {
		hookContext,
		complete
	};
	async function complete(result) {
		const terminal = result.terminal;
		runAgentHarnessLlmOutputHook({
			event: {
				runId: params.runId,
				sessionId: params.sessionId,
				provider: params.provider,
				model: params.model.id,
				resolvedRef: `${params.provider}/${params.model.id}`,
				harnessId: "agentsapi",
				prompt: params.prompt,
				...contextWindow,
				assistantTexts: result.assistantTexts,
				lastAssistant: result.lastAssistant,
				usage: result.attemptUsage
			},
			ctx: hookContext
		});
		const agentEnd = {
			event: {
				runId: params.runId,
				messages: result.messagesSnapshot,
				success: terminal.kind === "ok",
				error: terminal.kind === "failed" ? formatErrorMessage(terminal.error) : void 0,
				durationMs: Date.now() - startedAtMs
			},
			ctx: {
				...hookContext,
				foregroundPromptContext: buildEmbeddedForegroundPromptContext({
					...params,
					agentId
				}, params.agentDir ?? resolveAgentDir(params.config ?? {}, agentId)),
				skillWorkshopAvailable: false,
				compacted: false
			}
		};
		if (!params.messageChannel && !params.messageProvider) await awaitAgentEndSideEffects(agentEnd);
		else await runAgentEndSideEffectsAsync(agentEnd);
	}
}
//#endregion
export { createAgentsApiAttemptHooks as t };
