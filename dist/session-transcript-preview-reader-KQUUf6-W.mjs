import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as withScopedOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-scope-DUxQ_9sC.mjs";
import { t as buildSessionPreviewItems } from "./session-display-projection-DDhSj356.mjs";
import { n as SessionTranscriptStorageUnavailableError, t as SessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { d as readWithCanonicalSessionAdmission } from "./session-canonical-key-B7chVWi3.mjs";
import { p as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { i as readCurrentProjectionSnapshot } from "./session-accessor.sqlite-projection-read-3DYCwfDO.mjs";
import { t as readRecentSessionTranscriptHistoryEventsFromProjection } from "./session-accessor.sqlite-history-query-CeElVTvK.mjs";
//#region src/gateway/session-transcript-preview-reader.ts
function previewReadLimits(maxItems) {
	const initialMaxEvents = Math.min(256, Math.max(64, Math.ceil(maxItems) * 4));
	return [{
		maxEvents: initialMaxEvents,
		maxBytes: 1048576
	}, {
		maxEvents: Math.min(2048, Math.max(1024, initialMaxEvents * 8, Math.ceil(maxItems))),
		maxBytes: 8388608
	}];
}
async function readBoundedSessionPreviewItemsAsync(maxItems, readPage) {
	let items = [];
	for (const { maxEvents, maxBytes } of previewReadLimits(maxItems)) {
		const page = await readPage(maxEvents, maxBytes);
		items = page.items;
		if (items.length >= maxItems || !page.hasOlderEvents) break;
	}
	return items;
}
/** Native and worker display reads share widening, projection, and the older-page boundary. */
function readSessionDisplayPreviewItems(maxItems, maxChars, readPage) {
	let items = [];
	for (const { maxEvents, maxBytes } of previewReadLimits(maxItems)) {
		const page = readPage({
			maxBytes,
			maxLines: maxEvents,
			maxMessages: maxEvents
		});
		items = buildSessionPreviewItems(page.events.map((entry) => asOptionalRecord(entry.event)?.message), maxItems, maxChars);
		const hasOlderEvents = page.totalMessages > page.events.length;
		if (items.length >= maxItems || !hasOlderEvents) break;
	}
	return items;
}
/** Read the host-prepared target without importing transcript writers or model context. */
function readSessionPreviewItemsReadOnly({ database: databaseTarget, target, env, maxItems, maxChars }, retainedDatabase) {
	const read = (database) => readWithCanonicalSessionAdmission(database, () => {
		if (target.entryValidationKey !== void 0) readSessionEntryRow(database, target.entryValidationKey);
		return readSessionDisplayPreviewItems(maxItems, maxChars, (options) => {
			const snapshot = readCurrentProjectionSnapshot(database, {
				agentId: target.agentId,
				sessionId: target.sessionId,
				sessionKey: target.sessionKey,
				databaseAgentId: databaseTarget.agentId,
				path: databaseTarget.path
			}, (projection) => readRecentSessionTranscriptHistoryEventsFromProjection(projection, options));
			if (snapshot.kind === "unavailable") throw new SessionTranscriptProjectionUnavailableError(target.sessionId);
			return snapshot.value;
		});
	});
	if (retainedDatabase) return read(retainedDatabase);
	const result = withScopedOpenClawAgentDatabaseReadOnly(read, {
		...databaseTarget,
		...env ? { env } : {}
	});
	if (!result.found) throw new SessionTranscriptStorageUnavailableError();
	return result.value;
}
//#endregion
export { readSessionPreviewItemsReadOnly as n, readBoundedSessionPreviewItemsAsync as t };
