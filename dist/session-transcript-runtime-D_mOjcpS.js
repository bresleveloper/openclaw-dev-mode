import { u as normalizeAgentId } from "./session-key-VWT_xzM9.js";
import { B as resolveSessionTranscriptRuntimeTarget, X as streamSessionTranscriptLines, Y as runSessionTranscriptAppendTransaction, k as publishTranscriptUpdate, n as appendTranscriptMessage, z as resolveSessionTranscriptRuntimeReadTarget } from "./session-accessor-CwhXEUId.js";
import { r as readLatestAssistantTextFromSessionTranscript, t as appendAssistantMessageToSessionTranscript } from "./transcript-B251TSj6.js";
import { t as formatSessionTranscriptMemoryHitKey } from "./session-transcript-memory-hit-BM_9f4ft.js";
//#region src/plugin-sdk/session-transcript-runtime.ts
/**
* Resolves the public identity for a transcript without returning its file path.
*/
async function resolveSessionTranscriptIdentity(params) {
	const target = await resolveSessionTranscriptRuntimeReadTarget(params);
	const agentId = normalizeAgentId(target.agentId);
	return {
		agentId,
		memoryKey: formatSessionTranscriptMemoryHitKey({
			agentId,
			sessionId: target.sessionId
		}),
		sessionId: target.sessionId,
		sessionKey: target.sessionKey
	};
}
/**
* Resolves the public target for transcript operations without exposing the
* current storage path as identity.
*/
async function resolveSessionTranscriptTarget(params) {
	return projectPublicTarget({
		...await resolveSessionTranscriptRuntimeReadTarget(params),
		targetKind: params.sessionFile?.trim() ? "active-session-file" : "runtime-session"
	});
}
/**
* @deprecated Use resolveSessionTranscriptTarget with `{ agentId, sessionKey,
* sessionId }`. This persists an active transcript file target only for legacy
* plugin command calls that still require `sessionFile`.
*/
async function resolveSessionTranscriptLegacyFileTarget(params) {
	const target = await resolveSessionTranscriptRuntimeTarget(params);
	return {
		...projectPublicTarget({
			...target,
			targetKind: params.sessionFile?.trim() ? "active-session-file" : "runtime-session"
		}),
		sessionFile: target.sessionFile
	};
}
/**
* Reads transcript events by public session identity instead of file path.
*/
async function readSessionTranscriptEvents(params) {
	const target = await resolveSessionTranscriptRuntimeReadTarget(params);
	const events = [];
	for await (const line of streamSessionTranscriptLines(target.sessionFile)) try {
		events.push(JSON.parse(line));
	} catch {
		continue;
	}
	return events;
}
/**
* Reads the latest visible assistant text by scoped identity using the
* bounded reverse transcript reader.
*/
async function readLatestAssistantTextByIdentity(params) {
	return await readLatestAssistantTextFromSessionTranscript((await resolveSessionTranscriptRuntimeReadTarget(params)).sessionFile);
}
/**
* Appends a delivery-mirror assistant message through the guarded session
* append facade.
*/
async function appendAssistantMirrorMessageByIdentity(params) {
	return await appendAssistantMessageToSessionTranscript({
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		expectedSessionId: params.sessionId,
		...params.text !== void 0 ? { text: params.text } : {},
		...params.mediaUrls !== void 0 ? { mediaUrls: params.mediaUrls } : {},
		...params.idempotencyKey !== void 0 ? { idempotencyKey: params.idempotencyKey } : {},
		...params.deliveryMirror !== void 0 ? { deliveryMirror: params.deliveryMirror } : {},
		...params.storePath !== void 0 ? { storePath: params.storePath } : {},
		...params.updateMode !== void 0 ? { updateMode: params.updateMode } : {},
		...params.config !== void 0 ? { config: params.config } : {}
	});
}
/**
* Appends a transcript message by scoped transcript target.
*/
async function appendSessionTranscriptMessageByIdentity(params) {
	return await appendTranscriptMessage(params, params);
}
/**
* Publishes a transcript update by scoped transcript target.
*/
async function publishSessionTranscriptUpdateByIdentity(params) {
	const target = await resolveSessionTranscriptRuntimeTarget(params);
	await publishTranscriptUpdate({
		...params,
		sessionFile: target.sessionFile
	}, {
		...params.update,
		agentId: target.agentId,
		sessionKey: target.sessionKey
	});
}
/**
* Runs transcript work under the write lock for the resolved scoped target.
*/
async function withSessionTranscriptWriteLock(params, run) {
	const storageTarget = await resolveSessionTranscriptRuntimeTarget(params);
	const target = projectPublicTarget({
		...storageTarget,
		targetKind: params.sessionFile?.trim() ? "active-session-file" : "runtime-session"
	});
	const boundScope = {
		...params,
		sessionFile: storageTarget.sessionFile
	};
	const queuedUpdates = [];
	const result = await runSessionTranscriptAppendTransaction({
		config: params.config,
		transcriptPath: storageTarget.sessionFile
	}, (transaction) => run({
		target,
		readEvents: () => readSessionTranscriptEvents(boundScope),
		appendMessage: (options) => transaction.appendMessage({
			...options,
			sessionId: params.sessionId
		}),
		publishUpdate: async (update) => {
			queuedUpdates.push(update ? { ...update } : void 0);
		}
	}));
	for (const update of queuedUpdates) await publishSessionTranscriptUpdateByIdentity({
		...boundScope,
		update
	});
	return result;
}
function projectPublicTarget(target) {
	const agentId = normalizeAgentId(target.agentId);
	return {
		agentId,
		memoryKey: formatSessionTranscriptMemoryHitKey({
			agentId,
			sessionId: target.sessionId
		}),
		sessionId: target.sessionId,
		sessionKey: target.sessionKey,
		targetKind: target.targetKind
	};
}
//#endregion
export { readSessionTranscriptEvents as a, resolveSessionTranscriptTarget as c, readLatestAssistantTextByIdentity as i, withSessionTranscriptWriteLock as l, appendSessionTranscriptMessageByIdentity as n, resolveSessionTranscriptIdentity as o, publishSessionTranscriptUpdateByIdentity as r, resolveSessionTranscriptLegacyFileTarget as s, appendAssistantMirrorMessageByIdentity as t };
