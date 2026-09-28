import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as withScopedOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-scope-BIEwBWBt.mjs";
import { c as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-yAa3_SVY.mjs";
import { u as readWithCanonicalSessionAdmission } from "./session-canonical-key-BBylVEaq.mjs";
import { n as SessionTranscriptStorageUnavailableError, t as SessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-CuzwVnKb.mjs";
import { i as readCurrentProjectionSnapshot } from "./session-accessor.sqlite-projection-read-CEJGTMGy.mjs";
import { t as buildSessionPreviewItems } from "./session-display-projection-bZOY074i.mjs";
import { t as readRecentSessionTranscriptHistoryEventsFromProjection } from "./session-accessor.sqlite-history-query-Be6-ei7a.mjs";
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
/** Share the same bounded widening for display and canonical model-context previews. */
function readBoundedSessionPreviewItems(maxItems, readPage) {
	let items = [];
	for (const { maxEvents, maxBytes } of previewReadLimits(maxItems)) {
		const page = readPage(maxEvents, maxBytes);
		items = page.items;
		if (items.length >= maxItems || !page.hasOlderEvents) break;
	}
	return items;
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
/** Read the host-prepared target without importing transcript writers or model context. */
function readSessionPreviewItemsReadOnly({ database: databaseTarget, target, env, maxItems, maxChars }) {
	const result = withScopedOpenClawAgentDatabaseReadOnly((database) => readWithCanonicalSessionAdmission(database, () => {
		if (target.entryValidationKey !== void 0) readSessionEntryRow(database, target.entryValidationKey);
		return readBoundedSessionPreviewItems(maxItems, (maxEvents, maxBytes) => {
			const snapshot = readCurrentProjectionSnapshot(database, {
				agentId: target.agentId,
				sessionId: target.sessionId,
				sessionKey: target.sessionKey,
				databaseAgentId: databaseTarget.agentId,
				path: databaseTarget.path
			}, (projection) => readRecentSessionTranscriptHistoryEventsFromProjection(projection, {
				maxBytes,
				maxLines: maxEvents,
				maxMessages: maxEvents
			}));
			if (snapshot.kind === "unavailable") throw new SessionTranscriptProjectionUnavailableError(target.sessionId);
			const page = snapshot.value;
			return {
				items: buildSessionPreviewItems(page.events.map((entry) => asOptionalRecord(entry.event)?.message), maxItems, maxChars),
				hasOlderEvents: page.totalMessages > page.events.length
			};
		});
	}), {
		...databaseTarget,
		...env ? { env } : {}
	});
	if (!result.found) throw new SessionTranscriptStorageUnavailableError();
	return result.value;
}
//#endregion
export { readBoundedSessionPreviewItemsAsync as n, readSessionPreviewItemsReadOnly as r, readBoundedSessionPreviewItems as t };
