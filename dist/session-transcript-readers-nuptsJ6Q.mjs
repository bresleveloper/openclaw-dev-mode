import { r as __exportAll } from "./rolldown-runtime-Dr7-SnC6.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { o as waitForSessionTranscriptProjection } from "./session-transcript-reconcile-Cef06Gbk.mjs";
import { r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-CuzwVnKb.mjs";
import { t as withCurrentProjectionSnapshot } from "./session-accessor.sqlite-active-projection-D-WNA1Ka.mjs";
import { n as readRestoredSessionTranscript } from "./session-cold-storage-read-DL7Zd4dS.mjs";
import { d as visitSessionTranscriptMessageEvents, u as readSessionTranscriptVisibleMessageDeltaCore } from "./session-accessor.sqlite-active-events-Cnt-hBim.mjs";
import { t as attachOpenClawTranscriptMeta } from "./session-transcript-entry-message-COJ0koI7.mjs";
import { t as capArrayByJsonBytes } from "./session-utils.fs-B4keyzHX.mjs";
import { n as toTranscriptReadScope, t as resolveTranscriptReadTarget } from "./session-transcript-read-target-EurQ_dzR.mjs";
import { n as readSessionTranscriptHistoryEventCount } from "./session-accessor.sqlite-history-events-CxKlqhz3.mjs";
import { t as createSessionTranscriptReader } from "./session-transcript-read-kernel-AGigGycL.mjs";
//#region src/gateway/session-transcript-readers.ts
var session_transcript_readers_exports = /* @__PURE__ */ __exportAll({
	attachOpenClawTranscriptMeta: () => attachOpenClawTranscriptMeta,
	capArrayByJsonBytes: () => capArrayByJsonBytes,
	readRecentSessionMessagesWithStatsAsync: () => readRecentSessionMessagesWithStatsAsync,
	readSessionMessageByIdAsync: () => readSessionMessageByIdAsync,
	readSessionMessageCountAsync: () => readSessionMessageCountAsync,
	readSessionMessagesAroundIdWithStatsAsync: () => readSessionMessagesAroundIdWithStatsAsync,
	readSessionMessagesAsync: () => readSessionMessagesAsync,
	readSessionMessagesMatchingIdAsync: () => readSessionMessagesMatchingIdAsync,
	readSessionMessagesPageWithStatsAsync: () => readSessionMessagesPageWithStatsAsync,
	readSessionMessagesWithSourceAsync: () => readSessionMessagesWithSourceAsync,
	readSessionTranscriptVisibleMessageDeltaCore: () => readSessionTranscriptVisibleMessageDeltaCore,
	visitSessionMessagesAsync: () => visitSessionMessagesAsync
});
const sessionTranscriptReader = createSessionTranscriptReader({
	resolveTarget: resolveTranscriptReadTarget,
	readSnapshot: async (target, read, options) => {
		const scope = toTranscriptReadScope(target);
		return readRestoredSessionTranscript(scope, () => withCurrentProjectionSnapshot(scope, read, options), options);
	}
});
const { readSessionMessagesAsync, readSessionMessagesWithSourceAsync, readSessionMessageByIdAsync, readRecentSessionMessagesWithStatsAsync, readSessionMessagesPageWithStatsAsync, readSessionMessagesAroundIdWithStatsAsync } = sessionTranscriptReader;
/** Keep exact membership and its full-history validation in the admitted history worker. */
async function readSessionMessagesMatchingIdAsync(scope, messageId) {
	if (isIncognitoSessionKey(scope.sessionKey) || scope.storePath && isIncognitoOpenClawAgentSqlitePath(scope.storePath, {
		agentId: scope.agentId ?? resolveAgentIdFromSessionKey(scope.sessionKey),
		env: scope.env
	})) return sessionTranscriptReader.readSessionMessagesMatchingIdAsync(scope, messageId);
	const { bindSessionTranscriptStoreScope } = await import("./session-accessor.transcript-target-1t3qtM9O.mjs");
	const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-CJUmmPMK.mjs");
	const target = bindSessionTranscriptStoreScope(scope);
	return readSessionHistoryPageInWorker({
		kind: "message-lookup",
		params: {
			target: {
				agentId: target.agentId,
				sessionId: target.sessionId,
				sessionKey: target.sessionKey,
				storePath: target.storePath,
				sessionEntry: target.sessionEntry ? { sessionId: target.sessionEntry.sessionId } : void 0
			},
			messageId
		}
	});
}
/** Visits raw message payloads within the SQLite read snapshot. */
async function visitSessionMessagesAsync(scope, visit) {
	const transcriptScope = toTranscriptReadScope(await resolveTranscriptReadTarget(scope));
	return readRestoredSessionTranscript(transcriptScope, () => {
		let count = 0;
		visitSessionTranscriptMessageEvents(transcriptScope, (entry) => {
			const message = asOptionalRecord(entry.event)?.message;
			if (message !== void 0) {
				visit(message, entry.seq);
				count += 1;
			}
		});
		return count;
	});
}
/** Counts display messages asynchronously through the reader seam. */
async function readSessionMessageCountAsync(scope) {
	const target = await resolveTranscriptReadTarget(scope);
	const transcriptScope = toTranscriptReadScope(target);
	const readCount = () => readRestoredSessionTranscript(transcriptScope, () => readSessionTranscriptHistoryEventCount(transcriptScope));
	try {
		return await readCount();
	} catch (error) {
		if (!isSessionTranscriptProjectionUnavailableError(error)) throw error;
		await waitForSessionTranscriptProjection(transcriptScope);
		return await readCount();
	}
}
//#endregion
export { readSessionMessagesAsync as a, readSessionMessagesWithSourceAsync as c, readSessionMessagesAroundIdWithStatsAsync as i, session_transcript_readers_exports as l, readSessionMessageByIdAsync as n, readSessionMessagesMatchingIdAsync as o, readSessionMessageCountAsync as r, readSessionMessagesPageWithStatsAsync as s, readRecentSessionMessagesWithStatsAsync as t, visitSessionMessagesAsync as u };
