import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as unwrapSessionTranscriptWorkerReply, n as encodeSessionTranscriptWorkerError, t as SessionHistoryDeltaPreparationError } from "./session-history-worker-errors-DS6WgDIN.mjs";
import { n as projectTranscriptEntryMessage } from "./session-transcript-entry-message-COJ0koI7.mjs";
import { t as createChatHistoryRecoveryProjection } from "./chat-display-projection.core-x-JzVWZh.mjs";
//#region src/gateway/session-history-delta-visibility.ts
function isAppendOnlySessionHistoryDelta(delta) {
	return delta.kind === "page" && !delta.hasMore && !delta.events.some(({ event }) => {
		const type = asOptionalRecord(event)?.type;
		return type === "reset" || type === "compaction" || type === "leaf";
	});
}
/** Prepare only the visibility decisions requested by this bounded delta's messages. */
function prepareSessionHistoryDelta(delta, resolver) {
	const sessions = /* @__PURE__ */ new Map();
	const runMessages = [];
	const readFact = (lookup, read) => {
		try {
			return read();
		} catch (error) {
			const encoded = encodeSessionTranscriptWorkerError(error);
			if (!encoded) throw error;
			throw new SessionHistoryDeltaPreparationError({
				delta,
				subagentCoordination: {
					sessions: [...sessions],
					runMessages,
					failure: {
						lookup,
						error: encoded
					}
				}
			}, error);
		}
	};
	const recording = {
		assertCurrent: resolver.assertCurrent,
		isSubagentSession(sessionKey) {
			const hidden = readFact({
				kind: "session",
				sessionKey
			}, () => resolver.isSubagentSession(sessionKey));
			sessions.set(sessionKey, hidden);
			return hidden;
		},
		isSubagentRunMessage(runId, messageSeq) {
			const hidden = readFact({
				kind: "run",
				runId,
				messageSeq
			}, () => resolver.isSubagentRunMessage(runId, messageSeq));
			runMessages.push([
				runId,
				messageSeq,
				hidden
			]);
			return hidden;
		}
	};
	if (isAppendOnlySessionHistoryDelta(delta)) for (const row of delta.events) {
		if (row.messageSeq === void 0) continue;
		const message = projectTranscriptEntryMessage(row.event, row.messageSeq, row.displayPosition);
		if (!message) continue;
		createChatHistoryRecoveryProjection({ subagentCoordination: recording }).append([message]);
	}
	return {
		delta,
		subagentCoordination: {
			sessions: [...sessions],
			runMessages
		}
	};
}
function createPreparedSessionHistorySubagentProjection(facts, assertCurrent) {
	const sessions = new Map(facts.sessions);
	const runs = /* @__PURE__ */ new Map();
	for (const [runId, messageSeq, hidden] of facts.runMessages) {
		let messages = runs.get(runId);
		if (!messages) {
			messages = /* @__PURE__ */ new Map();
			runs.set(runId, messages);
		}
		messages.set(messageSeq, hidden);
	}
	const requireFact = (hidden, lookup) => {
		assertCurrent();
		if (hidden === void 0) {
			const failed = facts.failure?.lookup;
			if (facts.failure && (lookup.kind === "session" && failed?.kind === "session" && lookup.sessionKey === failed.sessionKey || lookup.kind === "run" && failed?.kind === "run" && lookup.runId === failed.runId && lookup.messageSeq === failed.messageSeq)) unwrapSessionTranscriptWorkerReply({
				ok: false,
				error: facts.failure.error
			});
			throw new Error("Session history visibility is unavailable; retry the request.");
		}
		return hidden;
	};
	return {
		assertCurrent,
		isSubagentSession: (sessionKey) => requireFact(sessions.get(sessionKey), {
			kind: "session",
			sessionKey
		}),
		isSubagentRunMessage: (runId, messageSeq) => requireFact(runs.get(runId)?.get(messageSeq), {
			kind: "run",
			runId,
			messageSeq
		})
	};
}
//#endregion
export { isAppendOnlySessionHistoryDelta as n, prepareSessionHistoryDelta as r, createPreparedSessionHistorySubagentProjection as t };
