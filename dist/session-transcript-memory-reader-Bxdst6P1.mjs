import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { s as readSessionTranscriptRunId } from "./transcript-events-D3brcRJS.mjs";
import { i as buildRunUserTurnIdempotencyKey } from "./user-turn-transcript.metadata-CtXLmxDa.mjs";
import { n as isSubagentSessionFromEntry } from "./subagent-depth-policy-eTFubFiU.mjs";
import { t as createChatHistoryRecoveryProjection } from "./chat-display-projection.core-DdRZ3VIg.mjs";
import { c as isSubagentCoordinationHistoryInput } from "./chat-display-projection.history-DKYX-kD-.mjs";
import { i as prepareSessionHistorySubagentFacts } from "./session-history-delta-visibility-DcmJ_4nD.mjs";
import { n as filterSessionMessageHistoryVisibility } from "./session-transcript-read-kernel-BP5-uRDU.mjs";
//#region src/gateway/session-transcript-memory-reader.ts
/** Adapt the selected actor's history operations to the shared Gateway reader contract. */
function createSessionActorTranscriptReader(memory) {
	const read = async (type, input, missing, signal) => {
		signal?.throwIfAborted();
		const value = memory.missing ? missing : await memory.read(type, structuredClone(input));
		signal?.throwIfAborted();
		memory.assertCurrent();
		return value;
	};
	const sources = /* @__PURE__ */ new Map();
	const runs = /* @__PURE__ */ new Map();
	const subagentCoordination = {
		assertCurrent: memory.assertCurrent,
		isSubagentSession(sessionKey) {
			const hidden = sources.get(sessionKey);
			if (hidden === void 0) throw new Error("Session history source visibility was not prepared");
			return hidden;
		},
		isSubagentRunMessage(runId, seq) {
			if (seq === void 0) return false;
			const hidden = runs.get(runId)?.get(seq);
			if (hidden === void 0) throw new Error("Session history run visibility was not prepared");
			return hidden;
		}
	};
	const prepareVisibility = async (messages) => {
		const requested = prepareSessionHistorySubagentFacts({
			isSubagentSession: () => false,
			isSubagentRunMessage: () => false
		}, (recording) => {
			for (const message of messages) createChatHistoryRecoveryProjection({ subagentCoordination: recording }).append([message]);
		});
		const runIds = [...new Set(requested.runMessages.map(([runId]) => runId))];
		const inputs = runIds.length && !memory.missing ? await memory.read("session.history.visibility-inputs", { runIds }) : [];
		const sourceKeys = new Set(requested.sessions.map(([key]) => key));
		for (const { message } of inputs) isSubagentCoordinationHistoryInput(message, (key) => {
			sourceKeys.add(key);
			return false;
		});
		for (const sessionKey of sourceKeys) if (isSubagentSessionFromEntry(sessionKey, void 0)) {
			sources.set(sessionKey, true);
			sourceKeys.delete(sessionKey);
		}
		if (sourceKeys.size) {
			const [{ readAcpSessionEntryAsync }, { getRuntimeConfig }] = await Promise.all([import("./session-meta-read-DAX9NReb.mjs"), import("./io.runtime.js")]);
			const cfg = getRuntimeConfig();
			await Promise.all([...sourceKeys].map(async (sessionKey) => {
				const source = await readAcpSessionEntryAsync({
					sessionKey,
					cfg,
					env: memory.target.env,
					assertCurrent: memory.assertCurrent
				});
				sources.set(sessionKey, isSubagentSessionFromEntry(sessionKey, source?.entry, source?.acp));
			}));
		}
		for (const [runId, messageSeq] of requested.runMessages) {
			const inputKey = buildRunUserTurnIdempotencyKey(runId);
			const anchor = inputs.find(({ message }) => {
				const metadata = message["__openclaw"];
				return (message.idempotencyKey ?? metadata.idempotencyKey) === inputKey && !metadata.steerTargetRunId;
			});
			const hidden = Boolean(messageSeq !== void 0 && anchor && isSubagentCoordinationHistoryInput(anchor.message, subagentCoordination.isSubagentSession) && !inputs.some(({ seq, message }) => {
				const metadata = message["__openclaw"];
				return seq > anchor.seq && seq <= messageSeq && (metadata.steerTargetRunId === runId || readSessionTranscriptRunId(message) === runId) && !isSubagentCoordinationHistoryInput(message, subagentCoordination.isSubagentSession);
			}));
			let bySequence = runs.get(runId);
			if (!bySequence) {
				bySequence = /* @__PURE__ */ new Map();
				runs.set(runId, bySequence);
			}
			bySequence.set(messageSeq, hidden);
		}
		memory.assertCurrent();
	};
	const readMessages = async (operation) => {
		const value = await operation;
		await prepareVisibility(value.messages);
		return value;
	};
	const reader = {
		subagentCoordination,
		prepareVisibility,
		readSessionMessageCountAsync: () => read("session.history.count", {}, 0),
		readSessionMessagesWithSourceAsync: (_scope, options, signal) => readMessages(read("session.history.source", { options }, { messages: [] }, signal)),
		readRecentSessionMessagesWithStatsAsync: (_scope, options) => readMessages(read("session.history.recent", { options }, {
			messages: [],
			totalMessages: 0
		})),
		readSessionMessagesPageWithStatsAsync: (_scope, options, signal) => readMessages(read("session.history.page", { options }, {
			messages: [],
			totalMessages: 0
		}, signal)),
		readSessionMessagesAroundIdWithStatsAsync: (_scope, options, signal) => readMessages(read("session.history.around-id", { options }, {
			found: false,
			messages: [],
			totalMessages: 0,
			hasOverreadContext: false,
			offset: 0
		}, signal)),
		async readSessionMessageByIdAsync(scope, messageId, options, signal) {
			const captured = options && structuredClone(options);
			const selected = await read("session.history.by-id", {
				messageId,
				options: captured
			}, {
				found: false,
				oversized: false
			}, signal);
			await prepareVisibility([selected.message, selected.historyContext?.precedingMessage].filter((message) => asOptionalRecord(message) !== void 0));
			const value = await filterSessionMessageHistoryVisibility(selected, scope, messageId, captured?.historyVisibility, reader);
			signal?.throwIfAborted();
			memory.assertCurrent();
			return value;
		},
		async readSessionMessagesMatchingIdAsync(_scope, messageId) {
			return (await readMessages(read("session.history.lookup", { messageId }, {
				messages: [],
				hasDisplayMessages: false
			}))).messages;
		},
		async visitSessionMessagesAsync(_scope, visit) {
			let count = 0;
			let offset;
			do {
				const page = await read("session.history.visitor-source", { offset }, { messages: [] });
				for (const { message, seq } of page.messages) {
					memory.assertCurrent();
					visit(message, seq);
					count++;
				}
				offset = page.nextOffset;
			} while (offset !== void 0);
			return count;
		}
	};
	return reader;
}
//#endregion
export { createSessionActorTranscriptReader as t };
