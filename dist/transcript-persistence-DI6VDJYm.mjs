import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as classifyAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-CgoAW2Q7.mjs";
import { p as persistSessionTranscriptTurn } from "./session-accessor-C05KQ5A3.mjs";
import "./agent-run-terminal-outcome-Dto4EMdr.mjs";
import { h as normalizeInputProvenance } from "./input-provenance-C4tQegGN.mjs";
import { o as preparePersistedUserTurnMessageForTranscriptWrite } from "./user-turn-transcript.metadata-BY4PdwgQ.mjs";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-Ce7FXvzS.mjs";
import { i as buildPersistedUserTurnMessage } from "./user-turn-transcript.message-DpTCMkgY.mjs";
import "./user-turn-transcript-D66nAouM.mjs";
import { t as projectAgentHarnessTranscriptMessageForDisplay } from "./transcript-visibility-Cb9_qxek.mjs";
import { r as buildUsageWithNoCost } from "./stream-message-shared-CYuIJ_XF.mjs";
//#region src/agents/command/transcript-persistence.ts
/** Persists CLI and ACP command fallbacks through the shared transcript owner. */
const ACP_TRANSCRIPT_USAGE = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0,
	totalTokens: 0,
	cost: {
		input: 0,
		output: 0,
		cacheRead: 0,
		cacheWrite: 0,
		total: 0
	}
};
const CLI_TRANSCRIPT_UNAVAILABLE_USAGE = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0,
	total: 0,
	contextUsage: { state: "unavailable" }
};
function resolveCliTranscriptUsage(usage) {
	if (!usage) return CLI_TRANSCRIPT_UNAVAILABLE_USAGE;
	if (usage.contextUsage) return usage;
	const promptTokens = (usage.input ?? 0) + (usage.cacheRead ?? 0) + (usage.cacheWrite ?? 0);
	return {
		...usage,
		contextUsage: promptTokens > 0 ? {
			state: "available",
			promptTokens,
			totalTokens: promptTokens + (usage.output ?? 0)
		} : { state: "unavailable" }
	};
}
function resolveTranscriptUsage(usage) {
	if (!usage) return ACP_TRANSCRIPT_USAGE;
	const resolved = buildUsageWithNoCost({
		input: usage.input,
		output: usage.output,
		cacheRead: usage.cacheRead,
		cacheWrite: usage.cacheWrite,
		totalTokens: usage.total
	});
	return usage.contextUsage ? {
		...resolved,
		contextUsage: usage.contextUsage
	} : resolved;
}
async function persistTextTurnTranscript(params) {
	const promptText = params.transcriptBody ?? params.body;
	const replyText = params.skipAssistantTurn === true ? "" : params.finalText;
	const userMessage = params.userMessage ?? await params.userTurnTranscriptRecorder?.resolveMessage() ?? (promptText ? buildPersistedUserTurnMessage({
		text: promptText,
		timestamp: Date.now(),
		provenance: params.inputProvenance
	}) : void 0);
	if (!userMessage && !replyText) return {
		kind: "persisted",
		sessionEntry: params.sessionEntry
	};
	const inputProvenance = params.inputProvenance ?? normalizeInputProvenance(userMessage?.provenance);
	const messages = [];
	if (userMessage) messages.push({
		message: userMessage,
		eventId: params.userTurnTranscriptRecorder?.getAdmissionReceipt()?.entryId,
		idempotencyLookup: "scan",
		prepareMessageAfterIdempotencyCheck: (message) => {
			const prepared = preparePersistedUserTurnMessageForTranscriptWrite(message, {
				agentId: params.sessionAgentId,
				sessionKey: params.sessionKey,
				beforeMessageWrite: runAgentHarnessBeforeMessageWriteHook
			});
			return prepared ? projectAgentHarnessTranscriptMessageForDisplay({
				hidden: false,
				inputProvenance,
				message: prepared
			}) : void 0;
		}
	});
	if (replyText) {
		const prepareAssistantTranscriptMessage = params.prepareAssistantTranscriptMessage;
		messages.push({
			idempotencyLookup: "scan-assistant",
			message: {
				role: "assistant",
				...params.assistantIdempotencyKey ? { idempotencyKey: params.assistantIdempotencyKey } : {},
				content: [{
					type: "text",
					text: replyText
				}],
				api: params.assistant.api,
				provider: params.assistant.provider,
				model: params.assistant.model,
				usage: resolveTranscriptUsage(params.assistant.usage),
				stopReason: params.assistant.stopReason,
				timestamp: Date.now()
			},
			prepareMessageAfterIdempotencyCheck: (message) => {
				const assistant = message;
				return projectAgentHarnessTranscriptMessageForDisplay({
					hidden: false,
					inputProvenance,
					message: prepareAssistantTranscriptMessage ? prepareAssistantTranscriptMessage(assistant, replyText) : assistant
				});
			}
		});
	}
	const turn = await persistSessionTranscriptTurn({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		sessionFile: params.sessionFile,
		sessionEntry: params.sessionEntry,
		sessionStore: params.sessionStore,
		storePath: params.storePath,
		agentId: params.sessionAgentId,
		threadId: params.threadId
	}, {
		config: params.config,
		cwd: params.sessionCwd,
		messages,
		publishWhen: "always",
		touchSessionEntry: true,
		updateMode: "file-only",
		expectedSessionId: params.expectedSessionId ?? (params.sessionStore && params.storePath ? params.sessionId : void 0)
	});
	if (turn.rejectedReason === "session-rebound") return {
		kind: "session-rebound",
		sessionEntry: void 0
	};
	const persistedUser = turn.messages.find((entry) => asOptionalRecord(entry.message)?.role === "user");
	if (persistedUser) params.userTurnTranscriptRecorder?.markRuntimePersisted(persistedUser.message, persistedUser.anchor, { appended: persistedUser.appended });
	const assistantTranscript = turn.messages.find((entry) => asOptionalRecord(entry.message)?.role === "assistant");
	return {
		kind: "persisted",
		sessionEntry: turn.sessionEntry,
		...assistantTranscript ? { assistantTranscript } : {}
	};
}
function resolveCliTranscriptReplyText(result) {
	const visibleText = result.meta.finalAssistantVisibleText?.trim();
	if (visibleText) return visibleText;
	return (result.payloads ?? []).filter((payload) => !payload.isError && !payload.isReasoning).map((payload) => payload.text?.trim() ?? "").filter(Boolean).join("\n\n");
}
async function persistAcpTurnTranscript(params) {
	const outcome = classifyAgentRunTerminalOutcome(params.terminalOutcome);
	return await persistTextTurnTranscript({
		...params,
		...params.userInput ? { userMessage: buildPersistedUserTurnMessage(params.userInput) } : {},
		assistant: {
			api: "openai-responses",
			provider: "openclaw",
			model: "acp-runtime",
			stopReason: outcome === "success" ? "stop" : outcome === "failure" ? "error" : "aborted"
		}
	});
}
async function persistCliTurnTranscript(params) {
	const { result, skipUserTurn: requestedSkipUserTurn, ...transcript } = params;
	const replyText = resolveCliTranscriptReplyText(result);
	const provider = result.meta.agentMeta?.provider?.trim() ?? "cli";
	const model = result.meta.agentMeta?.model?.trim() ?? "default";
	const skipUserTurn = requestedSkipUserTurn === true;
	return await persistTextTurnTranscript({
		...transcript,
		body: skipUserTurn ? "" : transcript.body,
		transcriptBody: skipUserTurn ? void 0 : transcript.transcriptBody,
		userMessage: skipUserTurn ? void 0 : transcript.userMessage,
		finalText: replyText,
		assistant: {
			api: "cli",
			provider,
			model,
			stopReason: "stop",
			usage: resolveCliTranscriptUsage(result.meta.agentMeta?.lastCallUsage)
		}
	});
}
//#endregion
export { persistCliTurnTranscript as n, resolveCliTranscriptReplyText as r, persistAcpTurnTranscript as t };
