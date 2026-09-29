import { l as getMaxChatHistoryMessagesBytes } from "./server-constants-Dx_kHnY5.mjs";
import "./chat-display-projection.helpers-BloZC0RQ.mjs";
import { o as projectChatDisplayMessagesWithState } from "./chat-display-projection.core-x-JzVWZh.mjs";
import { i as readChatHistoryMessageSeq, o as readIncrementalChatHistoryTail } from "./session-history-tail-Ve6Mx3al.mjs";
//#region src/gateway/session-history-snapshot.ts
/** Keep raw scan context inside the worker; only the completed page crosses isolates. */
async function readSessionHistorySnapshotKernel(params, options) {
	let rawMessages;
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
		projected = tail.projection;
		rawMessages = tail.rawMessages;
		totalRawMessages = tail.readPage.totalMessages;
		transcriptPath = tail.readPage.transcriptPath;
	}
	const rawHistoryMessages = toSessionHistoryMessages(rawMessages);
	const history = paginateSessionMessages(projected.messages, params.limit, params.cursor);
	if (typeof totalRawMessages === "number" && totalRawMessages > rawMessages.length && (!params.cursor || (readChatHistoryMessageSeq(rawHistoryMessages[0]) ?? 0) > 1)) {
		const firstSeq = readChatHistoryMessageSeq(history.messages[0] ?? rawHistoryMessages[0]);
		history.hasMore = true;
		if (typeof firstSeq === "number") history.nextCursor = String(firstSeq);
	}
	return {
		history,
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
function toSessionHistoryMessages(messages) {
	return messages.filter((message) => Boolean(message) && typeof message === "object" && !Array.isArray(message));
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
//#endregion
export { readSessionHistorySnapshotKernel as n, resolveCursorSeq as r, buildPaginatedSessionHistory as t };
