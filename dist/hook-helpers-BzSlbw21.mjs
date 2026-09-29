import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { u as cloneHookIsolationValue } from "./hooks-DuXrq03h.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-DlvY8FQy.mjs";
import { et as consumeAdjustedParamsForToolCall } from "./agent-tools.before-tool-call-C2rI0w1x.mjs";
import { r as extractAssistantTranscriptSourceText } from "./chat-message-content-D14VlZZc.mjs";
import { t as applyTranscriptSenderIdentityToWrite } from "./user-turn-transcript.metadata-BY4PdwgQ.mjs";
//#region src/agents/harness/hook-helpers.ts
const log = createSubsystemLogger("agents/harness");
/** Runs best-effort after-tool-call hooks for a completed tool invocation. */
async function runAgentHarnessAfterToolCallHook(params) {
	const adjustedArgs = consumeAdjustedParamsForToolCall(params.toolCallId, params.runId);
	const resolvedArgs = adjustedArgs && typeof adjustedArgs === "object" ? adjustedArgs : params.startArgs;
	const hookRunner = getGlobalHookRunner();
	if (!hookRunner?.hasHooks("after_tool_call")) return;
	try {
		const eventArgs = structuredClone(resolvedArgs);
		const eventResult = cloneHookIsolationValue("after_tool_call", params.result);
		await hookRunner.runAfterToolCall({
			toolName: params.toolName,
			params: eventArgs,
			...params.runId ? { runId: params.runId } : {},
			toolCallId: params.toolCallId,
			...eventResult ? { result: eventResult } : {},
			...params.error ? { error: params.error } : {},
			...params.startedAt != null ? { durationMs: Date.now() - params.startedAt } : {}
		}, {
			toolName: params.toolName,
			...params.agentId ? { agentId: params.agentId } : {},
			...params.sessionId ? { sessionId: params.sessionId } : {},
			...params.sessionKey ? { sessionKey: params.sessionKey } : {},
			...params.runId ? { runId: params.runId } : {},
			...params.channelId ? { channelId: params.channelId } : {},
			toolCallId: params.toolCallId
		});
	} catch (error) {
		log.warn(`after_tool_call hook failed: tool=${params.toolName} error=${String(error)}`);
	}
}
/** Runs before-message-write hooks and returns the possibly rewritten message. */
function runAgentHarnessBeforeMessageWriteHook(params) {
	const sourceText = params.prepareAssistantTranscriptMessage && params.message.role === "assistant" && Reflect.get(params.message, "display") !== false ? extractAssistantTranscriptSourceText(params.message) : void 0;
	const hookRunner = getGlobalHookRunner();
	const message = !params.skipBeforeMessageWriteHooks && hookRunner?.hasHooks("before_message_write") ? applyTranscriptSenderIdentityToWrite(params.message, () => {
		const result = hookRunner.runBeforeMessageWrite({ message: params.message }, {
			agentId: params.agentId,
			sessionKey: params.sessionKey
		});
		return result?.block ? null : result?.message ?? params.message;
	}) ?? null : params.message;
	return message?.role === "assistant" && Reflect.get(message, "display") !== false && sourceText !== void 0 && params.prepareAssistantTranscriptMessage ? params.prepareAssistantTranscriptMessage(message, sourceText) : message;
}
//#endregion
export { runAgentHarnessBeforeMessageWriteHook as n, runAgentHarnessAfterToolCallHook as t };
