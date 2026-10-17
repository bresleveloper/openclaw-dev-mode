import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { l as getMaxChatHistoryMessagesBytes } from "./server-constants-BH_EolwD.mjs";
import "./chat-display-projection.helpers-pbUdgTgb.mjs";
import { s as projectChatDisplayMessagesWithState } from "./chat-display-projection.core-BSNrSH5r.mjs";
import { o as readIncrementalChatHistoryTail, r as readChatHistoryMessageSeq } from "./session-history-tail-B4XoDl5j.mjs";
import path from "node:path";
//#region src/gateway/session-history-snapshot.ts
/** Keep raw scan context inside the worker; only the completed page crosses isolates. */
async function readSessionHistorySnapshotKernel(params, options) {
	let rawMessages;
	let windowReset = false;
	let totalRawMessages;
	let transcriptPath;
	let projected;
	if (typeof params.limit !== "number") {
		const snapshot = await options.readers.readSessionMessagesWithSourceAsync(params.target, {
			mode: "full",
			reason: "session history cursor pagination",
			allowResetArchiveFallback: true,
			readOnly: options.readOnly
		});
		rawMessages = snapshot.messages;
		transcriptPath = snapshot.transcriptPath;
		projected = projectChatDisplayMessagesWithState(rawMessages, {
			subagentCoordination: options.readers.subagentCoordination,
			includeCommentaryFallbacks: true,
			maxChars: params.maxChars ?? 8e3,
			resolveCronJobName: options.resolveCronJobName,
			...options.deferProfileDisplay ? {} : { resolveCurrentUserProfileDisplay: options.resolveCurrentUserProfileDisplay }
		});
	} else {
		const cursorSeq = resolveCursorSeq(params.cursor);
		const tail = await readIncrementalChatHistoryTail({
			entry: params.target.sessionEntry,
			readScope: params.target,
			effectiveMaxChars: params.maxChars ?? 8e3,
			max: params.limit,
			maxBytes: getMaxChatHistoryMessagesBytes(),
			...cursorSeq === void 0 ? {} : { beforeSeq: cursorSeq },
			preserveProjectionContext: true,
			...options
		});
		windowReset = tail.windowReset ?? false;
		projected = tail.projection;
		rawMessages = tail.rawMessages;
		totalRawMessages = tail.readPage.totalMessages;
		transcriptPath = tail.readPage.transcriptPath;
	}
	const rawHistoryMessages = rawMessages.filter(isRecord);
	const history = paginateSessionMessages(projected.messages, params.limit, windowReset ? void 0 : params.cursor);
	if (typeof totalRawMessages === "number" && totalRawMessages > rawMessages.length && (!params.cursor || (readChatHistoryMessageSeq(rawHistoryMessages[0]) ?? 0) > 1)) {
		const firstSeq = readChatHistoryMessageSeq(history.messages[0] ?? rawHistoryMessages[0]);
		history.hasMore = true;
		if (typeof firstSeq === "number") history.nextCursor = String(firstSeq);
	}
	return {
		history: {
			...history,
			...windowReset ? { windowReset: true } : {}
		},
		rawTranscriptSeq: totalRawMessages ?? readChatHistoryMessageSeq(rawHistoryMessages.at(-1)) ?? rawHistoryMessages.length,
		turnBoundaryPending: projected.turnBoundaryPending,
		assistantErrorPending: projected.assistantErrorPending,
		transcriptPath
	};
}
function resolveCursorSeq(cursor) {
	if (!cursor) return;
	const normalized = cursor.startsWith("seq:") ? cursor.slice(4) : cursor;
	if (!/^\d+$/.test(normalized)) return;
	const value = Number(normalized);
	return Number.isSafeInteger(value) && value > 0 ? value : void 0;
}
function buildPaginatedSessionHistory(params) {
	return {
		items: params.messages,
		messages: params.messages,
		hasMore: params.hasMore,
		...params.nextCursor ? { nextCursor: params.nextCursor } : {}
	};
}
function paginateSessionMessages(messages, limit, cursor) {
	const cursorSeq = resolveCursorSeq(cursor);
	let endExclusive = messages.length;
	if (typeof cursorSeq === "number") {
		endExclusive = messages.findIndex((message, index) => {
			const seq = readChatHistoryMessageSeq(message);
			if (typeof seq === "number") return seq >= cursorSeq;
			return index + 1 >= cursorSeq;
		});
		if (endExclusive < 0) endExclusive = messages.length;
	}
	let start = typeof limit === "number" && limit > 0 ? Math.max(0, endExclusive - limit) : 0;
	if (start > 0) {
		const pageSeqs = /* @__PURE__ */ new Set();
		let indexedStart = endExclusive;
		for (let index = start - 1; index >= 0; index--) {
			while (indexedStart > start) {
				const pageSeq = readChatHistoryMessageSeq(messages[--indexedStart]);
				if (pageSeq !== void 0) pageSeqs.add(pageSeq);
			}
			const seq = readChatHistoryMessageSeq(messages[index]);
			if (seq !== void 0 && pageSeqs.has(seq)) start = index;
		}
	}
	const paginatedMessages = messages.slice(start, endExclusive);
	const firstSeq = readChatHistoryMessageSeq(paginatedMessages[0]);
	return buildPaginatedSessionHistory({
		messages: paginatedMessages,
		hasMore: start > 0,
		...start > 0 && typeof firstSeq === "number" ? { nextCursor: String(firstSeq) } : {}
	});
}
/** Retain the actor across lazy adapter loading without expanding shared execution imports. */
function createIncognitoSessionComputeReader(params) {
	const { actor, authority, signal } = params;
	const target = structuredClone(params.target);
	signal?.throwIfAborted();
	return actor.sessions.withCompute(authority, target, async () => {
		const { bindIncognitoSessionComputeReader } = await import("./session-incognito-compute-read-Cyw7bxY-.mjs");
		signal?.throwIfAborted();
		return bindIncognitoSessionComputeReader({
			actor,
			authority,
			target,
			signal
		});
	}, signal);
}
/** Inactive composition: callers retain the actor and supply already-prepared display facts. */
function createIncognitoSessionHistoryReader(params) {
	const { actor, authority, signal, subagentCoordination } = params;
	authority.assertCurrent();
	actor.assertCurrent();
	const { agentId, storePath, ...target } = structuredClone(params.target);
	const capturedStorePath = path.resolve(storePath);
	const claim = actor.sessions.captureCurrent(target.sessionKey);
	const assertCurrent = () => {
		signal?.throwIfAborted();
		actor.assertCurrent();
		authority.assertCurrent();
		claim.assertCurrent();
		subagentCoordination.assertCurrent?.();
	};
	const assertScope = (scope) => {
		assertCurrent();
		if (scope.sessionId !== target.sessionId || scope.sessionKey !== void 0 && scope.sessionKey !== target.sessionKey || scope.agentId !== void 0 && scope.agentId !== agentId || scope.storePath !== void 0 && path.resolve(scope.storePath) !== capturedStorePath || scope.sessionEntry?.sessionId !== void 0 && scope.sessionEntry.sessionId !== target.sessionId) throw new Error("Incognito history request belongs to another session or store");
	};
	const disclose = (value) => {
		assertCurrent();
		claim.authorize(authority, "commit");
		assertCurrent();
		return value;
	};
	const read = async (scope, command) => {
		assertScope(scope);
		return disclose(await actor.sessions.history(authority, command, signal));
	};
	const readers = {
		subagentCoordination,
		readSessionMessageCountAsync: (scope) => read(scope, {
			type: "session.history.count",
			input: target
		}),
		readRecentSessionMessagesWithStatsAsync: (scope, options) => read(scope, {
			type: "session.history.recent",
			input: {
				...target,
				options
			}
		}),
		readSessionMessagesPageWithStatsAsync: (scope, options) => read(scope, {
			type: "session.history.page",
			input: {
				...target,
				options
			}
		}),
		readSessionMessagesAroundIdWithStatsAsync: (scope, options) => read(scope, {
			type: "session.history.around-id",
			input: {
				...target,
				options
			}
		}),
		readSessionMessageByIdAsync: (scope, messageId, options) => read(scope, {
			type: "session.history.by-id",
			input: {
				...target,
				messageId,
				options
			}
		}),
		async readSessionMessagesWithSourceAsync(scope, options) {
			const { messages, offPathMessages, transcriptPath } = await read(scope, {
				type: "session.history.source",
				input: {
					...target,
					options
				}
			});
			return disclose({
				messages: offPathMessages ? [...messages, ...offPathMessages] : messages,
				transcriptPath
			});
		},
		async readSessionMessagesAsync(scope, options) {
			return disclose((await readers.readSessionMessagesWithSourceAsync(scope, options)).messages);
		},
		async readSessionMessagesMatchingIdAsync(scope, messageId) {
			return disclose((await read(scope, {
				type: "session.history.lookup",
				input: {
					...target,
					messageId
				}
			})).messages);
		}
	};
	const options = {
		readers,
		readOnly: true,
		resolveCurrentUserProfileDisplay: params.resolveCurrentUserProfileDisplay,
		resolveCronJobName: params.resolveCronJobName ?? (() => void 0)
	};
	return {
		readers,
		async rpc(request) {
			const captured = structuredClone(request);
			assertScope({
				agentId: captured.sessionAgentId,
				sessionId: captured.sessionId,
				sessionKey: captured.canonicalKey,
				storePath: captured.storePath,
				sessionEntry: captured.entry
			});
			const [{ readChatHistoryPageKernel }, { encodeChatHistoryResponsePage }] = await Promise.all([import("./chat-history-page-kernel-CSHhmCUJ.mjs"), import("./chat-history-response-page-fKVbbSAu.mjs")]);
			const page = await readChatHistoryPageKernel(captured, options);
			return disclose(encodeChatHistoryResponsePage(page, captured));
		},
		async http(request) {
			const captured = structuredClone(request);
			assertScope(captured.target);
			return disclose(await readSessionHistorySnapshotKernel(captured, options));
		}
	};
}
//#endregion
export { resolveCursorSeq as a, readSessionHistorySnapshotKernel as i, createIncognitoSessionComputeReader as n, createIncognitoSessionHistoryReader as r, buildPaginatedSessionHistory as t };
