import { r as __exportAll } from "./rolldown-runtime-Dr7-SnC6.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
import { i as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { r as jsonUtf8Bytes } from "./json-utf8-bytes-fm9i4b7G.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-WjVavOYj.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { a as prepareSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { o as waitForSessionTranscriptProjection } from "./session-transcript-reconcile-DP2BCaGd.mjs";
import { r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { n as readRestoredSessionTranscript } from "./session-cold-storage-read-CfuaO6_K.mjs";
import { t as readSessionTranscriptBoundedMessageTailPageFromProjection } from "./session-accessor.sqlite-active-events-read-D0muOl2F.mjs";
import { t as withCurrentProjectionSnapshot } from "./session-accessor.sqlite-active-projection-D8MomqVO.mjs";
import { u as readSessionTranscriptVisibleMessageDeltaCore } from "./session-accessor.sqlite-active-events-urwlgpH5.mjs";
import { t as readSessionTranscriptWatermark } from "./session-accessor.sqlite-transcript-watermark-D3Is2Kik.mjs";
import { t as bindSessionTranscriptStoreScope } from "./session-accessor.transcript-target-CAOPCw68.mjs";
import { t as streamSessionTranscriptLines } from "./transcript-stream-BZxQozgQ.mjs";
import { t as readSessionTranscriptAccountingFromProjection } from "./session-transcript-accounting-CMV4FjUj.mjs";
import { t as attachOpenClawTranscriptMeta } from "./session-transcript-entry-message-DRffdoS3.mjs";
import { i as resolveSessionTranscriptCandidates } from "./session-transcript-files.fs-CdF7y2ZY.mjs";
import "./session-transcript-archive-reader-kezABdD2.mjs";
import { t as createSessionTranscriptReader } from "./session-transcript-read-kernel-CycNXxcw.mjs";
import { n as toTranscriptReadScope, t as resolveTranscriptReadTarget } from "./session-transcript-read-target-wXFZrZ00.mjs";
import { n as createSessionTranscriptUsageAccumulator } from "./session-transcript-derived-readers-B5MmwB8i.mjs";
import fs from "node:fs";
//#region src/gateway/session-utils.fs.ts
function capArrayByJsonBytes(items, maxBytes, byteLength = jsonUtf8Bytes) {
	if (items.length === 0) return {
		items,
		bytes: 2
	};
	const parts = items.map(byteLength);
	let bytes = 2 + parts.reduce((a, b) => a + b, 0) + (items.length - 1);
	let start = 0;
	while (bytes > maxBytes && start < items.length - 1) {
		bytes -= expectDefined(parts[start], "parts entry at start") + 1;
		start += 1;
	}
	return {
		items: start > 0 ? items.slice(start) : items,
		bytes
	};
}
async function readLatestSessionUsageFromTranscriptFileAsync(sessionId, storePath, sessionFile, agentId) {
	const filePath = resolveSessionTranscriptCandidates(sessionId, storePath, sessionFile, agentId).find((value) => fs.existsSync(value));
	if (!filePath) return null;
	try {
		if ((await fs.promises.stat(filePath)).size === 0) return null;
		const usageAccumulator = createSessionTranscriptUsageAccumulator("artifact");
		for await (const line of streamSessionTranscriptLines(filePath)) {
			if (Buffer.byteLength(line, "utf8") > 262144) continue;
			let normalizedMessage;
			try {
				const record = asOptionalRecord(JSON.parse(line));
				const message = asOptionalRecord(record?.message);
				if (!record || !message) continue;
				const usage = asOptionalRecord(message.usage) ?? asOptionalRecord(record.usage);
				normalizedMessage = {
					...message,
					...typeof message.provider !== "string" && typeof record.provider === "string" ? { provider: record.provider } : {},
					...typeof message.model !== "string" && typeof record.model === "string" ? { model: record.model } : {},
					...usage ? { usage } : {}
				};
			} catch {
				continue;
			}
			usageAccumulator.add(normalizedMessage);
		}
		return usageAccumulator.finish();
	} catch {
		return null;
	}
}
//#endregion
//#region src/gateway/session-transcript-readers.ts
var session_transcript_readers_exports = /* @__PURE__ */ __exportAll({
	attachOpenClawTranscriptMeta: () => attachOpenClawTranscriptMeta,
	capArrayByJsonBytes: () => capArrayByJsonBytes,
	readRecentSessionMessagesWithStatsAsync: () => readRecentSessionMessagesWithStatsAsync,
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
	readSessionTranscriptSummaryAsync: () => readSessionTranscriptSummaryAsync,
	readSessionTranscriptVisibleMessageDeltaCore: () => readSessionTranscriptVisibleMessageDeltaCore,
	readSessionTranscriptWatermarkAsync: () => readSessionTranscriptWatermarkAsync
});
const sessionTranscriptReader = createSessionTranscriptReader({
	resolveTarget: resolveTranscriptReadTarget,
	readSnapshot: async (target, read, options) => {
		const scope = toTranscriptReadScope(target);
		return readRestoredSessionTranscript(scope, () => withCurrentProjectionSnapshot(scope, read, options), options);
	}
});
function usesProcessHeldTranscript(scope) {
	return Boolean(isIncognitoSessionKey(scope.sessionKey) || scope.storePath && isIncognitoOpenClawAgentSqlitePath(scope.storePath, {
		agentId: scope.agentId ?? resolveAgentIdFromSessionKey(scope.sessionKey),
		env: scope.env
	}));
}
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
async function readSessionMessagesAsync(...args) {
	return (await readSessionMessagesWithSourceAsync(...args)).messages;
}
function createHistoryPageReader(readLocal, readWorker) {
	return async (scope, inputOptions, signal) => {
		signal?.throwIfAborted();
		const target = captureHistoryReadScope(scope);
		const options = structuredClone(inputOptions);
		if (usesProcessHeldTranscript(target)) {
			const result = await readLocal(target, options);
			signal?.throwIfAborted();
			return result;
		}
		const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-C_HMG5HH.mjs");
		signal?.throwIfAborted();
		const result = await readWorker(readSessionHistoryPageInWorker, target, options, signal);
		signal?.throwIfAborted();
		return result;
	};
}
const readSessionMessagesWithSourceAsync = createHistoryPageReader(sessionTranscriptReader.readSessionMessagesWithSourceAsync, (read, target, options) => read({
	kind: "source-messages",
	params: {
		target,
		options
	}
}));
const readSessionTranscriptAccountingAsync = createHistoryPageReader(async (target, options) => withCurrentProjectionSnapshot(target, (projection) => readSessionTranscriptAccountingFromProjection(projection, options)), (read, target, options, signal) => read({
	kind: "active-accounting",
	params: {
		target,
		options
	}
}, signal));
const readSessionTranscriptBoundedMessageTailPageAsync = createHistoryPageReader(async (target, options) => withCurrentProjectionSnapshot(target, (projection) => readSessionTranscriptBoundedMessageTailPageFromProjection(projection, options), options), (read, target, options) => read({
	kind: "bounded-tail",
	params: {
		target,
		options
	}
}));
const readRecentSessionMessagesWithStatsAsync = createHistoryPageReader(sessionTranscriptReader.readRecentSessionMessagesWithStatsAsync, (read, target, options) => read({
	kind: "recent-page",
	params: {
		target,
		options
	}
}));
const readSessionMessagesPageWithStatsAsync = createHistoryPageReader(sessionTranscriptReader.readSessionMessagesPageWithStatsAsync, (read, target, options) => read({
	kind: "message-page",
	params: {
		target,
		options
	}
}));
const readSessionMessagesAroundIdWithStatsAsync = createHistoryPageReader(sessionTranscriptReader.readSessionMessagesAroundIdWithStatsAsync, (read, target, options) => read({
	kind: "around-id",
	params: {
		target,
		options
	}
}));
async function readSessionTranscriptSummaryAsync(scope, inputQuery) {
	const target = captureHistoryReadScope(scope);
	const query = structuredClone(inputQuery);
	if (usesProcessHeldTranscript(target)) return sessionTranscriptReader.readSessionTranscriptSummaryAsync(target, query);
	const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-C_HMG5HH.mjs");
	return readSessionHistoryPageInWorker({
		kind: "summary",
		params: {
			target,
			query
		}
	});
}
async function readSessionArtifacts(scope, inputQuery) {
	const target = captureHistoryReadScope(scope);
	const query = structuredClone(inputQuery);
	if (usesProcessHeldTranscript(target)) {
		const { selectSessionArtifacts } = await import("./session-artifact-read-DaAPMdpM.mjs");
		return selectSessionArtifacts(target, query, sessionTranscriptReader);
	}
	const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-C_HMG5HH.mjs");
	return readSessionHistoryPageInWorker({
		kind: "artifacts",
		params: {
			target,
			query
		}
	});
}
async function readSessionMessageByIdAsync(scope, messageId, options) {
	const target = captureHistoryReadScope(scope);
	if (usesProcessHeldTranscript(target)) return sessionTranscriptReader.readSessionMessageByIdAsync(target, messageId, options);
	const capturedOptions = options ? { ...options } : void 0;
	const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-C_HMG5HH.mjs");
	return readSessionHistoryPageInWorker({
		kind: "message-by-id",
		params: {
			target,
			messageId,
			options: capturedOptions
		}
	});
}
async function readSessionTranscriptWatermarkAsync(scope) {
	const target = {
		...scope,
		env: captureSessionTranscriptStorageEnvironment(scope.env ?? process.env)
	};
	if (usesProcessHeldTranscript(target)) return readSessionTranscriptWatermark(target);
	const { withSessionHistoryWorkerDatabase } = await import("./session-transcript-worker-runtime-B8OoZ7G5.mjs");
	return withSessionHistoryWorkerDatabase(toDatabaseOptions(await prepareSqliteTranscriptReadScope(target)), (owner) => owner.readWatermark({ scope: target }));
}
/** Keep exact membership and its full-history validation in the admitted history worker. */
const readSessionMessagesMatchingIdAsync = createHistoryPageReader(sessionTranscriptReader.readSessionMessagesMatchingIdAsync, (read, target, messageId) => read({
	kind: "message-lookup",
	params: {
		target,
		messageId
	}
}));
/** Counts display messages asynchronously through the reader seam. */
async function readSessionMessageCountAsync(scope) {
	const target = captureHistoryReadScope(scope);
	const inProcess = usesProcessHeldTranscript(target);
	const readCount = async () => {
		if (inProcess) return sessionTranscriptReader.readSessionMessageCountAsync(target);
		const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-C_HMG5HH.mjs");
		return readSessionHistoryPageInWorker({
			kind: "message-count",
			params: { target }
		});
	};
	try {
		return await readCount();
	} catch (error) {
		if (!isSessionTranscriptProjectionUnavailableError(error)) throw error;
		await waitForSessionTranscriptProjection(target);
		return await readCount();
	}
}
async function readSessionReactionsAsync(scope) {
	const target = captureHistoryReadScope(scope);
	if (usesProcessHeldTranscript(target)) {
		const { listSessionReactions } = await import("./session-reaction-store-Bs_sNCDb.mjs");
		if (!target.sessionKey) throw new Error("Reaction reads require a session key");
		return listSessionReactions({
			...target,
			sessionKey: target.sessionKey
		}, { sessionId: target.sessionId });
	}
	const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-C_HMG5HH.mjs");
	return readSessionHistoryPageInWorker({
		kind: "reactions",
		params: { target }
	});
}
async function readSessionConversationBindingAsync(scope, conversationRef) {
	const target = captureHistoryReadScope(scope);
	const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-C_HMG5HH.mjs");
	return readSessionHistoryPageInWorker({
		kind: "conversation-binding",
		params: {
			target,
			conversationRef
		}
	});
}
//#endregion
export { capArrayByJsonBytes as _, readSessionMessageCountAsync as a, readSessionMessagesMatchingIdAsync as c, readSessionReactionsAsync as d, readSessionTranscriptAccountingAsync as f, session_transcript_readers_exports as g, readSessionTranscriptWatermarkAsync as h, readSessionMessageByIdAsync as i, readSessionMessagesPageWithStatsAsync as l, readSessionTranscriptSummaryAsync as m, readSessionArtifacts as n, readSessionMessagesAroundIdWithStatsAsync as o, readSessionTranscriptBoundedMessageTailPageAsync as p, readSessionConversationBindingAsync as r, readSessionMessagesAsync as s, readRecentSessionMessagesWithStatsAsync as t, readSessionMessagesWithSourceAsync as u, readLatestSessionUsageFromTranscriptFileAsync as v };
