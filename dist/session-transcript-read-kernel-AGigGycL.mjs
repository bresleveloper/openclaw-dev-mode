import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as projectTranscriptEntryMessage } from "./session-transcript-entry-message-COJ0koI7.mjs";
import { t as ArchivedTranscriptReader } from "./session-transcript-archive-reader-DWPfUfwT.mjs";
import { a as readSessionTranscriptHistoryEventPageFromProjection, i as readSessionTranscriptHistoryEventLookupFromProjection, n as readSessionTranscriptHistoryAnchorPageFromProjection, o as readSessionTranscriptHistoryEventsFromProjection, r as readSessionTranscriptHistoryEventByIdFromProjection, t as readRecentSessionTranscriptHistoryEventsFromProjection } from "./session-accessor.sqlite-history-query-Be6-ei7a.mjs";
//#region src/gateway/session-transcript-read-kernel.ts
function archivedTranscriptReader(target) {
	return new ArchivedTranscriptReader({
		agentId: target.agentId,
		sessionId: target.sessionId,
		storePath: target.storePath
	});
}
function projectSqliteHistoryEvents(entries) {
	const messages = [];
	for (const entry of entries) {
		const message = projectTranscriptEntryMessage(entry.event, entry.seq, entry.displayPosition);
		if (message) messages.push(message);
	}
	return messages;
}
function normalizeRecentSqliteReadOptions(opts) {
	const maxMessages = Math.max(0, Math.floor(opts?.maxMessages ?? 0));
	const maxBytes = typeof opts?.maxBytes === "number" && Number.isFinite(opts.maxBytes) ? Math.max(1024, Math.floor(opts.maxBytes)) : 8388608;
	const defaultMaxLines = maxMessages * 20 + 20;
	return {
		maxMessages,
		maxBytes,
		maxLines: typeof opts?.maxLines === "number" && Number.isFinite(opts.maxLines) ? Math.max(maxMessages, Math.floor(opts.maxLines)) : defaultMaxLines,
		captureReadWindow: opts?.captureReadWindow,
		expectedReadWindow: opts?.expectedReadWindow,
		readOnly: opts?.readOnly
	};
}
function readRecentSqliteMessageRecords(projection, opts) {
	const normalized = normalizeRecentSqliteReadOptions(opts);
	const page = readRecentSessionTranscriptHistoryEventsFromProjection(projection, normalized);
	return {
		...Object.hasOwn(page, "activeLeafEntryId") ? { activeLeafEntryId: page.activeLeafEntryId } : {},
		...page.deltaCursor ? { deltaCursor: page.deltaCursor } : {},
		displaySource: page.displaySource,
		...page.readWindow ? { readWindow: page.readWindow } : {},
		messages: projectSqliteHistoryEvents(page.events),
		totalMessages: page.totalMessages
	};
}
/** Share pagination and archive policy while the caller owns acquisition and restoration. */
function createSessionTranscriptReader(access) {
	/** Reads display messages asynchronously through the reader seam. */
	async function readSessionMessagesAsync(scope, opts) {
		return (await readSessionMessagesWithSourceAsync(scope, opts)).messages;
	}
	/** Reads display messages with source metadata through the reader seam. */
	async function readSessionMessagesWithSourceAsync(scope, opts) {
		const target = await access.resolveTarget(scope);
		const messages = await access.readSnapshot(target, (projection) => opts.mode === "recent" ? readRecentSqliteMessageRecords(projection, opts).messages : projectSqliteHistoryEvents(readSessionTranscriptHistoryEventsFromProjection(projection)), opts);
		if (messages.length === 0 && opts.allowResetArchiveFallback === true) return await archivedTranscriptReader(target).read(opts);
		return {
			messages,
			transcriptPath: target.sessionFile
		};
	}
	/** Finds one display message by transcript id through the reader seam. */
	async function readSessionMessageByIdAsync(scope, messageId, opts) {
		const target = await access.resolveTarget(scope);
		const foundEvent = await access.readSnapshot(target, (projection) => readSessionTranscriptHistoryEventByIdFromProjection(projection, messageId, opts));
		if (foundEvent) return {
			found: true,
			message: projectTranscriptEntryMessage(foundEvent.event, foundEvent.seq, foundEvent.displayPosition),
			oversized: false,
			seq: foundEvent.seq,
			...foundEvent.serializedBytes !== void 0 ? { serializedBytes: foundEvent.serializedBytes } : {}
		};
		if (opts?.allowResetArchiveFallback === true && !opts.currentOnly) return await archivedTranscriptReader(target).readById(messageId);
		return {
			found: false,
			oversized: false
		};
	}
	/** Read exact membership while retaining full-history validity and empty-only archive fallback. */
	async function readSessionMessagesMatchingIdAsync(scope, messageId) {
		const target = await access.resolveTarget(scope);
		const lookup = await access.readSnapshot(target, (projection) => readSessionTranscriptHistoryEventLookupFromProjection(projection, messageId));
		return (lookup.hasDisplayMessages ? projectSqliteHistoryEvents(lookup.events) : await archivedTranscriptReader(target).readMessageCandidatesById(messageId)).filter((message) => asOptionalRecord(asOptionalRecord(message)?.["__openclaw"])?.id === messageId);
	}
	/** Reads recent messages with total-count metadata asynchronously through the reader seam. */
	async function readRecentSessionMessagesWithStatsAsync(scope, opts) {
		const target = await access.resolveTarget(scope);
		const { activeLeafEntryId, deltaCursor, displaySource, readWindow, messages, totalMessages } = await access.readSnapshot(target, (projection) => readRecentSqliteMessageRecords(projection, opts), opts);
		if (totalMessages === 0 && messages.length === 0 && opts.allowResetArchiveFallback === true) return await archivedTranscriptReader(target).readRecentWithStats(opts);
		return {
			...activeLeafEntryId !== void 0 ? { activeLeafEntryId } : {},
			...deltaCursor ? { deltaCursor } : {},
			displaySource,
			...readWindow ? { readWindow } : {},
			messages,
			totalMessages,
			transcriptPath: target.sessionFile,
			transcriptSource: "active"
		};
	}
	/** Reads one offset page with total-count metadata through the reader seam. */
	async function readSessionMessagesPageWithStatsAsync(scope, opts) {
		const target = await access.resolveTarget(scope);
		const page = await access.readSnapshot(target, (projection) => readSessionTranscriptHistoryEventPageFromProjection(projection, opts), opts);
		if (page.totalMessages === 0 && opts.allowResetArchiveFallback === true) return await archivedTranscriptReader(target).readPage(opts);
		return {
			...Object.hasOwn(page, "activeLeafEntryId") ? { activeLeafEntryId: page.activeLeafEntryId } : {},
			...page.olderOffset !== void 0 ? { olderOffset: page.olderOffset } : {},
			...page.deltaCursor ? { deltaCursor: page.deltaCursor } : {},
			...page.omittedOversized ? { omittedOversized: true } : {},
			messages: projectSqliteHistoryEvents(page.events),
			displaySource: page.displaySource,
			...page.readWindow ? { readWindow: page.readWindow } : {},
			totalMessages: page.totalMessages,
			transcriptPath: target.sessionFile,
			transcriptSource: "active"
		};
	}
	/** Reads one message-id-anchored page from a single transcript snapshot. */
	async function readSessionMessagesAroundIdWithStatsAsync(scope, opts) {
		const target = await access.resolveTarget(scope);
		const sessionFile = !scope.sessionFile && scope.sessionEntry?.sessionId && scope.sessionEntry.sessionId !== scope.sessionId ? void 0 : target.sessionFile;
		const page = await access.readSnapshot(target, (projection) => readSessionTranscriptHistoryAnchorPageFromProjection(projection, opts), opts);
		if (!page.found) {
			if (opts.allowResetArchiveFallback === true) return await new ArchivedTranscriptReader({
				agentId: target.agentId,
				sessionFile,
				sessionId: target.sessionId,
				storePath: target.storePath
			}).readAroundId(opts);
			return {
				found: false,
				hasOverreadContext: false,
				messages: [],
				offset: 0,
				totalMessages: page.totalMessages,
				transcriptPath: target.sessionFile
			};
		}
		return {
			found: true,
			displaySource: page.displaySource,
			hasOverreadContext: page.hasOverreadContext,
			messages: page.events.flatMap((entry) => {
				const message = projectTranscriptEntryMessage(entry.event, entry.seq, entry.displayPosition);
				return message === void 0 ? [] : [message];
			}),
			offset: page.offset,
			totalMessages: page.totalMessages,
			transcriptPath: target.sessionFile
		};
	}
	return {
		readSessionMessagesAsync,
		readSessionMessagesWithSourceAsync,
		readSessionMessageByIdAsync,
		readSessionMessagesMatchingIdAsync,
		readRecentSessionMessagesWithStatsAsync,
		readSessionMessagesPageWithStatsAsync,
		readSessionMessagesAroundIdWithStatsAsync
	};
}
//#endregion
export { createSessionTranscriptReader as t };
