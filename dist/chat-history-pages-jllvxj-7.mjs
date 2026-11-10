import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { n as readLegacyCompactionMetrics } from "./legacy-compaction-history-DS8GebGO.mjs";
import { r as getCliSessionBinding } from "./cli-session-binding-Dx1VbkI8.mjs";
import { t as captureSessionActorTranscriptRead } from "./session-actor-transcript-read-Wje_m4fK.mjs";
import { t as resolveCurrentUserProfileDisplay } from "./current-user-profile-display-84IsFWS2.mjs";
import { d as projectForwardedMessages, u as prepareForwardedMessageCronJobNameResolver } from "./chat-display-projection.history-DKYX-kD-.mjs";
import { t as createSessionActorTranscriptReader } from "./session-transcript-memory-reader-Bxdst6P1.mjs";
import { _ as session_transcript_readers_exports, o as readSessionMessageByIdAsync } from "./session-transcript-readers-ChK_-oGN.mjs";
import { t as encodeChatHistoryResponsePage } from "./chat-history-response-page-dk61A4nE.mjs";
import { n as projectChatHistoryWithReplies } from "./chat-history-reply-messages-Cs9kWyEM.mjs";
import { t as readChatHistoryPageKernel } from "./chat-history-page-kernel-A_-EukNB.mjs";
import os from "node:os";
//#region src/gateway/server-methods/chat-history-pages.ts
function prepareChatHistoryParams(input) {
	return getCliSessionBinding(input.entry, "claude-cli")?.sessionId ? {
		...input,
		cliHistoryHomeDir: process.env.HOME || os.homedir()
	} : input;
}
function chatHistoryScope(params) {
	return {
		agentId: params.sessionAgentId,
		sessionId: params.sessionId ?? "",
		sessionKey: params.canonicalKey,
		storePath: params.storePath,
		sessionEntry: params.entry
	};
}
async function readChatHistoryMessageById(input) {
	const scope = chatHistoryScope(input);
	const memory = captureSessionActorTranscriptRead(scope);
	if (memory) {
		const captured = structuredClone(input);
		let result;
		if (getCliSessionBinding(captured.entry, "claude-cli")?.sessionId) {
			const { readProcessHeldCliHistoryMessage } = await import("./cli-session-history.process-held-BbKL5hkR.mjs");
			result = await readProcessHeldCliHistoryMessage(prepareChatHistoryParams(captured), memory);
		} else result = await createSessionActorTranscriptReader(memory).readSessionMessageByIdAsync(scope, captured.messageId, {
			allowResetArchiveFallback: true,
			historyVisibility: { sessionStartedAt: captured.entry?.sessionStartedAt }
		});
		memory.assertCurrent();
		return result;
	}
	if (!getCliSessionBinding(input.entry, "claude-cli")?.sessionId || !input.storePath || input.entry?.incognito || isIncognitoSessionKey(input.canonicalKey)) return readSessionMessageByIdAsync(chatHistoryScope(input), input.messageId, {
		allowResetArchiveFallback: true,
		historyVisibility: { sessionStartedAt: input.entry?.sessionStartedAt }
	});
	const params = prepareChatHistoryParams(input);
	const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-DT3UfXfX.mjs");
	return readSessionHistoryPageInWorker({
		kind: "rpc-message",
		params: {
			...params,
			storePath: input.storePath
		}
	});
}
async function readChatHistoryPage(input, signal) {
	signal?.throwIfAborted();
	const scope = chatHistoryScope(input);
	const memory = captureSessionActorTranscriptRead(scope, signal);
	const binding = getCliSessionBinding(input.entry, "claude-cli");
	const params = prepareChatHistoryParams(memory ? structuredClone(input) : input);
	if (memory) {
		const useCliHistory = Boolean(binding?.sessionId && !params.ignoreCliSessionImports);
		let page;
		if (useCliHistory) {
			const { readProcessHeldCliHistory } = await import("./cli-session-history.process-held-BbKL5hkR.mjs");
			page = await readProcessHeldCliHistory(params, signal, memory);
		} else page = await readChatHistoryPageKernel(params, {
			readers: createSessionActorTranscriptReader(memory),
			readOnly: true,
			resolveCurrentUserProfileDisplay,
			resolveCronJobName: () => void 0
		});
		const refreshed = {
			...page,
			messages: await refreshForwardedLabels(page.messages)
		};
		signal?.throwIfAborted();
		memory.assertCurrent();
		return useCliHistory ? refreshed : encodeChatHistoryResponsePage(refreshed, params);
	}
	if (!params.sessionId || !params.storePath || params.entry?.incognito || isIncognitoSessionKey(params.canonicalKey)) {
		const page = await readChatHistoryPageKernel(params, {
			readers: session_transcript_readers_exports,
			resolveCurrentUserProfileDisplay,
			resolveCronJobName: () => void 0
		});
		return {
			...page,
			messages: await refreshForwardedLabels(page.messages)
		};
	}
	const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-DT3UfXfX.mjs");
	return readSessionHistoryPageInWorker({
		kind: "rpc",
		params: {
			...params,
			compactionMetrics: readLegacyCompactionMetrics(params.entry),
			sessionId: params.sessionId,
			storePath: params.storePath
		}
	}, signal);
}
async function refreshForwardedLabels(messages) {
	return projectChatHistoryWithReplies(messages.filter((message) => asOptionalRecord(message) !== void 0), async (displayMessages) => projectForwardedMessages(displayMessages, await prepareForwardedMessageCronJobNameResolver(displayMessages)));
}
//#endregion
export { readChatHistoryPage as n, readChatHistoryMessageById as t };
