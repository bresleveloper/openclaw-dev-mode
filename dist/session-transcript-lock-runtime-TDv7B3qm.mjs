import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { c as withTranscriptWriteLock, l as withTranscriptWriteSequence } from "./session-accessor.sqlite-transcript-write-B1_nzUQQ.mjs";
import { t as assertLegacyTranscriptPreparation } from "./session-transcript-preparation-HBORI9r1.mjs";
import { o as resolveSessionTranscriptRuntimeTarget } from "./session-accessor.transcript-target-DDngfM5X.mjs";
import { t as formatSessionTranscriptMemoryHitKey } from "./session-transcript-memory-hit-DQ5oaXTM.mjs";
//#region src/plugin-sdk/session-transcript-lock-runtime.ts
/** Resolves, locks, and publishes one projected transcript write context. */
async function withProjectedSessionTranscriptWriteLock(params, run, projectContext, mode = "lock") {
	if (mode === "lock") assertLegacyTranscriptPreparation(params);
	const storageTarget = await resolveSessionTranscriptRuntimeTarget(params, params.config);
	const agentId = normalizeAgentId(storageTarget.agentId);
	const target = {
		agentId,
		memoryKey: formatSessionTranscriptMemoryHitKey({
			agentId,
			sessionId: storageTarget.sessionId
		}),
		sessionId: storageTarget.sessionId,
		sessionKey: storageTarget.sessionKey,
		targetKind: "runtime-session"
	};
	const boundScope = {
		...params,
		...storageTarget
	};
	const queuedUpdates = [];
	let callbackClosed = false;
	const whileOpen = (operation) => {
		if (callbackClosed) return Promise.reject(/* @__PURE__ */ new Error("Transcript write context is closed"));
		return operation();
	};
	const guardProjectedContext = (locked) => ({
		publishUpdate: (update) => whileOpen(() => locked.publishUpdate(update)),
		readEvents: () => whileOpen(locked.readEvents),
		readMessageFacts: (query) => whileOpen(() => locked.readMessageFacts(query)),
		replaceEvents: (events) => whileOpen(() => locked.replaceEvents(events)),
		appendMessage: (options) => whileOpen(() => locked.appendMessage(options)),
		appendMessageWithMessageSequence: (options) => whileOpen(() => locked.appendMessageWithMessageSequence(options))
	});
	const runOpen = async (context) => {
		try {
			const result = run(context);
			if (!isPromiseLike(result)) callbackClosed = true;
			return await result;
		} finally {
			callbackClosed = true;
		}
	};
	return await (mode === "sequence" ? withTranscriptWriteSequence : withTranscriptWriteLock)(boundScope, async (locked) => {
		const result = await runOpen(projectContext({
			target,
			readEvents: () => whileOpen(locked.readEvents),
			readMessageFacts: (query) => whileOpen(() => locked.readMessageFacts(query)),
			appendMessage: (options) => whileOpen(() => locked.appendMessage({
				...options,
				...params.config !== void 0 ? { config: params.config } : {}
			})),
			publishUpdate: (update) => whileOpen(async () => {
				queuedUpdates.push(update ? { ...update } : void 0);
			})
		}, guardProjectedContext(locked)));
		for (const update of queuedUpdates) await locked.publishUpdate(update);
		return result;
	});
}
//#endregion
export { withProjectedSessionTranscriptWriteLock as t };
