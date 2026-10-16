import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as encodeSessionTranscriptWorkerError, o as unwrapSessionTranscriptWorkerReply, t as SessionHistoryDeltaPreparationError } from "./session-history-worker-errors-NH8_8u1W.mjs";
import { n as projectTranscriptEntryMessage } from "./session-transcript-entry-message-DRffdoS3.mjs";
import { n as createSubagentCoordinationHistoryProjection } from "./chat-display-projection.history-C7mOEuaq.mjs";
import { t as createChatHistoryRecoveryProjection } from "./chat-display-projection.core-BSNrSH5r.mjs";
//#region src/gateway/session-history-delta-visibility.ts
function isAppendOnlySessionHistoryDelta(delta) {
	return delta.kind === "page" && !delta.hasMore && !delta.events.some(({ event }) => {
		const type = asOptionalRecord(event)?.type;
		return type === "reset" || type === "compaction" || type === "leaf";
	});
}
/** Inline projection asks at most one source or run question, without transferring message bodies. */
function readSessionHistorySubagentLookup(message) {
	let lookup;
	createSubagentCoordinationHistoryProjection({
		isSubagentSession: (sessionKey) => {
			lookup = {
				kind: "session",
				sessionKey
			};
			return false;
		},
		isSubagentRunMessage: (runId, messageSeq) => {
			lookup = {
				kind: "run",
				runId,
				messageSeq
			};
			return false;
		}
	})([message]);
	return lookup;
}
function prepareSessionHistorySubagentFacts(resolver, project, onFailure) {
	const sessions = /* @__PURE__ */ new Map();
	const runMessages = [];
	const readFact = (lookup, read) => {
		try {
			return read();
		} catch (error) {
			const encoded = encodeSessionTranscriptWorkerError(error);
			if (!encoded || !onFailure) throw error;
			return onFailure({
				sessions: [...sessions],
				runMessages,
				failure: {
					lookup,
					error: encoded
				}
			}, error);
		}
	};
	project({
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
	});
	return {
		sessions: [...sessions],
		runMessages
	};
}
/** Prepare only the visibility decisions requested by this bounded delta's messages. */
function prepareSessionHistoryDelta(delta, resolver) {
	return {
		delta,
		subagentCoordination: prepareSessionHistorySubagentFacts(resolver, (recording) => {
			if (!isAppendOnlySessionHistoryDelta(delta)) return;
			for (const row of delta.events) {
				if (row.messageSeq === void 0) continue;
				const message = projectTranscriptEntryMessage(row.event, row.messageSeq, row.displayPosition);
				if (message) createChatHistoryRecoveryProjection({ subagentCoordination: recording }).append([message]);
			}
		}, (facts, error) => {
			throw new SessionHistoryDeltaPreparationError({
				delta,
				subagentCoordination: facts
			}, error);
		})
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
export { readSessionHistorySubagentLookup as a, prepareSessionHistorySubagentFacts as i, isAppendOnlySessionHistoryDelta as n, prepareSessionHistoryDelta as r, createPreparedSessionHistorySubagentProjection as t };
