import { r as __exportAll } from "./rolldown-runtime-Dr7-SnC6.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { r as collectSessionTranscriptMessages } from "./session-transcript-source-pages-DzseyJB5.mjs";
import { t as attachOpenClawTranscriptMeta } from "./session-transcript-entry-message-Q75Efb-t.mjs";
import { r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { c as waitForSessionTranscriptProjection } from "./session-transcript-reconcile-BkwlDaaD.mjs";
import { t as captureSessionActorTranscriptRead } from "./session-actor-transcript-read-Wje_m4fK.mjs";
import { t as bindSessionTranscriptStoreScope } from "./session-accessor.transcript-target-DDngfM5X.mjs";
import "./session-accessor.sqlite-active-events-CqOkO0QM.mjs";
import { t as aggregateSessionTranscriptUsage } from "./session-transcript-derived-readers-BsCqBl32.mjs";
import { t as createSessionActorTranscriptReader } from "./session-transcript-memory-reader-Bxdst6P1.mjs";
import { t as capArrayByJsonBytes } from "./session-utils.fs-BfASFo7x.mjs";
//#region src/gateway/session-transcript-readers.ts
var session_transcript_readers_exports = /* @__PURE__ */ __exportAll({
	attachOpenClawTranscriptMeta: () => attachOpenClawTranscriptMeta,
	capArrayByJsonBytes: () => capArrayByJsonBytes,
	readRecentSessionConversationTextAsync: () => readRecentSessionConversationTextAsync,
	readRecentSessionMessagesWithStatsAsync: () => readRecentSessionMessagesWithStatsAsync,
	readRecentSessionUsageFromTranscriptAsync: () => readRecentSessionUsageFromTranscriptAsync,
	readSessionArtifacts: () => readSessionArtifacts,
	readSessionConversationBindingAsync: () => readSessionConversationBindingAsync,
	readSessionMessageByIdAsync: () => readSessionMessageByIdAsync,
	readSessionMessageCountAsync: () => readSessionMessageCountAsync,
	readSessionMessagesAroundIdWithStatsAsync: () => readSessionMessagesAroundIdWithStatsAsync,
	readSessionMessagesAsync: () => readSessionMessagesAsync,
	readSessionMessagesMatchingIdAsync: () => readSessionMessagesMatchingIdAsync,
	readSessionMessagesPageWithStatsAsync: () => readSessionMessagesPageWithStatsAsync,
	readSessionMessagesWithSourceAsync: () => readSessionMessagesWithSourceAsync,
	readSessionReactionsAsync: () => readSessionReactionsAsync,
	readSessionTranscriptAccountingAsync: () => readSessionTranscriptAccountingAsync,
	readSessionTranscriptBoundedMessageTailPageAsync: () => readSessionTranscriptBoundedMessageTailPageAsync,
	readSessionTranscriptSummaryAsync: () => readSessionTranscriptSummaryAsync
});
function captureHistoryReadScope(scope) {
	const target = bindSessionTranscriptStoreScope(scope);
	return {
		agentId: target.agentId,
		sessionId: target.sessionId,
		sessionKey: target.sessionKey,
		storePath: target.storePath,
		...target.sessionFile ? { sessionFile: target.sessionFile } : {},
		sessionEntry: target.sessionEntry ? { sessionId: target.sessionEntry.sessionId } : void 0,
		env: captureSessionTranscriptStorageEnvironment(target.env ?? process.env)
	};
}
async function readSessionMessagesAsync(scope, options) {
	if (options.mode === "recent") return (await readRecentSessionMessagesWithStatsAsync(scope, options)).messages;
	return collectSessionTranscriptMessages(readSessionMessagesWithSourceAsync, scope, options);
}
function createHistoryPageReader(readActor, readWorker) {
	return async (scope, inputOptions, signal) => {
		signal?.throwIfAborted();
		const options = structuredClone(inputOptions);
		const memory = captureSessionActorTranscriptRead(scope, signal);
		if (memory) return readActor(createSessionActorTranscriptReader(memory), scope, options, signal);
		const target = captureHistoryReadScope(scope);
		const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-DT3UfXfX.mjs");
		signal?.throwIfAborted();
		const result = await readWorker(readSessionHistoryPageInWorker, target, options, signal);
		signal?.throwIfAborted();
		return result;
	};
}
const readSessionMessagesWithSourceAsync = createHistoryPageReader((reader, scope, options, signal) => reader.readSessionMessagesWithSourceAsync(scope, options, signal), (read, target, options, signal) => read({
	kind: "source-messages",
	params: {
		target,
		options
	}
}, signal));
async function readSessionTranscriptAccountingAsync(scope, options, signal) {
	const captured = structuredClone(options);
	const memory = captureSessionActorTranscriptRead(scope, signal);
	if (memory) return memory.read("session.history.accounting", { options: captured });
	const target = captureHistoryReadScope(scope);
	const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-DT3UfXfX.mjs");
	return readSessionHistoryPageInWorker({
		kind: "active-accounting",
		params: {
			target,
			options: captured
		}
	}, signal);
}
async function readSessionTranscriptBoundedMessageTailPageAsync(scope, options, signal) {
	const captured = structuredClone(options);
	const memory = captureSessionActorTranscriptRead(scope, signal);
	if (memory) return memory.read("session.history.bounded-tail", { options: captured });
	const target = captureHistoryReadScope(scope);
	const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-DT3UfXfX.mjs");
	return readSessionHistoryPageInWorker({
		kind: "bounded-tail",
		params: {
			target,
			options: captured
		}
	}, signal);
}
async function readRecentSessionConversationTextAsync(scope, options, signal) {
	signal?.throwIfAborted();
	const captured = structuredClone(options);
	const memory = captureSessionActorTranscriptRead(scope, signal);
	if (memory) {
		const result = memory.missing ? [] : await memory.read("session.history.recent-text", { options: captured });
		memory.assertCurrent();
		return result;
	}
	const target = captureHistoryReadScope(scope);
	const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-DT3UfXfX.mjs");
	return readSessionHistoryPageInWorker({
		kind: "recent-text",
		params: {
			target,
			options: captured
		}
	}, signal);
}
const readRecentSessionMessagesWithStatsAsync = createHistoryPageReader((reader, scope, options) => reader.readRecentSessionMessagesWithStatsAsync(scope, options), (read, target, options) => read({
	kind: "recent-page",
	params: {
		target,
		options
	}
}));
const readRecentSessionUsage = createHistoryPageReader(async (reader, target, maxBytes) => aggregateSessionTranscriptUsage((await reader.readRecentSessionMessagesWithStatsAsync(target, {
	maxBytes,
	maxLines: 1e3,
	maxMessages: 1e3
})).messages), async (read, target, maxBytes) => read({
	kind: "recent-usage",
	params: {
		target,
		maxBytes
	}
}));
/** Prepare bounded usage in the history owner before rendering a status response. */
async function readRecentSessionUsageFromTranscriptAsync(scope, maxBytes) {
	return readRecentSessionUsage(scope, Math.max(1024, Math.floor(Number.isFinite(maxBytes) ? maxBytes : 8388608)));
}
const readSessionMessagesPageWithStatsAsync = createHistoryPageReader((reader, scope, options, signal) => reader.readSessionMessagesPageWithStatsAsync(scope, options, signal), (read, target, options, signal) => read({
	kind: "message-page",
	params: {
		target,
		options
	}
}, signal));
const readSessionMessagesAroundIdWithStatsAsync = createHistoryPageReader((reader, scope, options, signal) => reader.readSessionMessagesAroundIdWithStatsAsync(scope, options, signal), (read, target, options, signal) => read({
	kind: "around-id",
	params: {
		target,
		options
	}
}, signal));
async function readSessionTranscriptSummaryAsync(scope, inputQuery) {
	const query = structuredClone(inputQuery);
	const memory = captureSessionActorTranscriptRead(scope);
	if (memory) {
		const { prepareSessionTranscriptSummaryReader } = await import("./session-transcript-summary-Dz9tp_UA.mjs");
		const select = await prepareSessionTranscriptSummaryReader(query);
		const messages = [];
		await createSessionActorTranscriptReader(memory).visitSessionMessagesAsync(scope, (message) => messages.push(message));
		return select((visit) => messages.forEach(visit));
	}
	const target = captureHistoryReadScope(scope);
	const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-DT3UfXfX.mjs");
	return readSessionHistoryPageInWorker({
		kind: "summary",
		params: {
			target,
			query
		}
	});
}
async function readSessionArtifacts(scope, inputQuery) {
	const query = structuredClone(inputQuery);
	const memory = captureSessionActorTranscriptRead(scope);
	if (memory) {
		const { selectSessionArtifacts } = await import("./session-artifact-read-be5ys4WR.mjs");
		return selectSessionArtifacts(scope, query, createSessionActorTranscriptReader(memory));
	}
	const target = captureHistoryReadScope(scope);
	const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-DT3UfXfX.mjs");
	return readSessionHistoryPageInWorker({
		kind: "artifacts",
		params: {
			target,
			query
		}
	});
}
async function readSessionMessageByIdAsync(scope, messageId, options, signal) {
	signal?.throwIfAborted();
	const capturedOptions = options ? structuredClone(options) : void 0;
	const memory = captureSessionActorTranscriptRead(scope, signal);
	if (memory) return createSessionActorTranscriptReader(memory).readSessionMessageByIdAsync(scope, messageId, capturedOptions, signal);
	const target = captureHistoryReadScope(scope);
	const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-DT3UfXfX.mjs");
	return readSessionHistoryPageInWorker({
		kind: "message-by-id",
		params: {
			target,
			messageId,
			options: capturedOptions
		}
	}, signal);
}
/** Keep exact membership and selected payload reads in the owning history backend. */
const readSessionMessagesMatchingIdAsync = createHistoryPageReader((reader, scope, messageId) => reader.readSessionMessagesMatchingIdAsync(scope, messageId), (read, target, messageId) => read({
	kind: "message-lookup",
	params: {
		target,
		messageId
	}
}));
async function readSessionMessageCountAsync(scope) {
	const memory = captureSessionActorTranscriptRead(scope);
	if (memory) return createSessionActorTranscriptReader(memory).readSessionMessageCountAsync(scope);
	const target = captureHistoryReadScope(scope);
	const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-DT3UfXfX.mjs");
	const readCount = () => readSessionHistoryPageInWorker({
		kind: "message-count",
		params: { target }
	});
	try {
		return await readCount();
	} catch (error) {
		if (!isSessionTranscriptProjectionUnavailableError(error)) throw error;
		await waitForSessionTranscriptProjection(target);
		return await readCount();
	}
}
async function readSessionReactionsAsync(scope) {
	const memory = captureSessionActorTranscriptRead(scope);
	if (memory) return await withSessionActorStorage(memory.target, {
		lifetime: {
			assertCurrent: memory.assertCurrent,
			assertReadable: memory.assertCurrent
		},
		authority: {
			assertCurrent: memory.assertCurrent,
			authorize: memory.assertCurrent
		}
	}, (binding) => binding.actor.storage.read({
		type: "session.reactions.read",
		input: { sessionId: scope.sessionId }
	}, binding.authority)) ?? {};
	const target = captureHistoryReadScope(scope);
	const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-DT3UfXfX.mjs");
	return readSessionHistoryPageInWorker({
		kind: "reactions",
		params: { target }
	});
}
async function readSessionConversationBindingAsync(scope, conversationRef) {
	const memory = captureSessionActorTranscriptRead(scope);
	if (memory) {
		const { readConversation } = await import("./conversation-registry-hwY47sH9.mjs");
		const conversation = await readConversation({
			agentId: memory.target.agentId,
			storePath: memory.target.storePath,
			env: memory.target.env
		}, conversationRef);
		if (!conversation) return null;
		const { channel, accountId, target, threadId, nativeChannelId } = conversation;
		return {
			channel,
			accountId,
			target,
			threadId,
			nativeChannelId
		};
	}
	const target = captureHistoryReadScope(scope);
	const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-DT3UfXfX.mjs");
	return readSessionHistoryPageInWorker({
		kind: "conversation-binding",
		params: {
			target,
			conversationRef
		}
	});
}
//#endregion
export { session_transcript_readers_exports as _, readSessionConversationBindingAsync as a, readSessionMessagesAroundIdWithStatsAsync as c, readSessionMessagesPageWithStatsAsync as d, readSessionMessagesWithSourceAsync as f, readSessionTranscriptSummaryAsync as g, readSessionTranscriptBoundedMessageTailPageAsync as h, readSessionArtifacts as i, readSessionMessagesAsync as l, readSessionTranscriptAccountingAsync as m, readRecentSessionMessagesWithStatsAsync as n, readSessionMessageByIdAsync as o, readSessionReactionsAsync as p, readRecentSessionUsageFromTranscriptAsync as r, readSessionMessageCountAsync as s, readRecentSessionConversationTextAsync as t, readSessionMessagesMatchingIdAsync as u };
