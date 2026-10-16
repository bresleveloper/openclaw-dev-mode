import { j as resolveIntegerOption } from "./number-coercion-CuVhdCBs.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as jsonUtf8Bytes } from "./json-utf8-bytes-fm9i4b7G.mjs";
import { n as SessionTranscriptStorageUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { a as iterateVisibleMessageRange, d as resolveVisibleMessagePositions } from "./session-accessor.sqlite-reset-window-BfaTzfLM.mjs";
import { a as readSessionTranscriptHistoryEventLookupFromProjection, c as readTranscriptDisplayDeltaFromProjection, i as readSessionTranscriptHistoryEventByIdFromProjection, n as readRecentSessionTranscriptHistoryEventsFromProjection, o as readSessionTranscriptHistoryEventPageFromProjection, r as readSessionTranscriptHistoryAnchorPageFromProjection, s as readSessionTranscriptHistoryEventsFromProjection, t as readOffPathSessionTranscriptEventsFromProjection, u as resolveVisibleHistoryEventCount } from "./session-accessor.sqlite-history-query-B5DhrWSf.mjs";
import { i as sqliteMessageEventWithSeq } from "./session-transcript-entry-message-DRffdoS3.mjs";
import { t as ArchivedTranscriptReader } from "./session-transcript-archive-reader-kezABdD2.mjs";
//#region src/gateway/session-transcript-summary.ts
/** Load domain policy before opening the snapshot; only compact facts cross the worker boundary. */
async function prepareSessionTranscriptSummaryReader(query) {
	if (query.kind === "recovery-checkpoint") {
		const { selectMainSessionRecoveryCheckpoint } = await import("./main-session-recovery-checkpoint-CUZAtY-o.mjs");
		return (visit) => ({
			kind: "recovery-checkpoint",
			checkpoint: selectMainSessionRecoveryCheckpoint(visit)
		});
	}
	if (query.kind === "mcp-app") {
		const { selectMcpAppReconstructionData } = await import("./mcp-app-transcript-BBbH7G40.mjs");
		return (visit) => ({
			kind: "mcp-app",
			data: selectMcpAppReconstructionData(visit, query.lookup)
		});
	}
	const { createSessionTranscriptUsageAccumulator } = await import("./session-transcript-derived-readers-DCOg-8GY.mjs");
	return (visit) => {
		const usage = createSessionTranscriptUsageAccumulator();
		visit(usage.add);
		return {
			kind: "usage",
			usage: usage.finish()
		};
	};
}
//#endregion
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
		const message = sqliteMessageEventWithSeq(entry);
		if (message) messages.push(message);
	}
	return messages;
}
function capAnchorEventsByBytes(events, maxBytes) {
	if (maxBytes === void 0) return events;
	const limit = Math.max(1024, Math.floor(maxBytes));
	let bytes = 2;
	let start = events.length;
	while (start > 0) {
		const eventBytes = jsonUtf8Bytes(events[start - 1]);
		const separatorBytes = start === events.length ? 0 : 1;
		if (bytes + separatorBytes + eventBytes > limit) break;
		bytes += separatorBytes + eventBytes;
		start -= 1;
	}
	return events.slice(start);
}
function readRecentSqliteMessageRecords(projection, opts) {
	const maxMessages = Math.max(0, Math.floor(opts?.maxMessages ?? 0));
	const page = readRecentSessionTranscriptHistoryEventsFromProjection(projection, {
		maxMessages,
		maxBytes: resolveIntegerOption(opts?.maxBytes, 8388608, { min: 1024 }),
		maxLines: resolveIntegerOption(opts?.maxLines, maxMessages * 20 + 20, { min: maxMessages }),
		captureReadWindow: opts?.captureReadWindow,
		expectedReadWindow: opts?.expectedReadWindow
	});
	return {
		...page.activeLeafEntryId !== void 0 ? { activeLeafEntryId: page.activeLeafEntryId } : {},
		...page.deltaCursor ? { deltaCursor: page.deltaCursor } : {},
		displaySource: page.displaySource,
		...page.readWindow ? { readWindow: page.readWindow } : {},
		...page.windowReset ? { windowReset: true } : {},
		messages: projectSqliteHistoryEvents(page.events),
		totalMessages: page.totalMessages
	};
}
function filterSessionMessagesMatchingId(messages, messageId) {
	return messages.filter((message) => asOptionalRecord(asOptionalRecord(message)?.["__openclaw"])?.id === messageId);
}
function selectSessionTranscriptProjection(projection, selection, sessionFile) {
	switch (selection.kind) {
		case "delta": return readTranscriptDisplayDeltaFromProjection(projection, selection.options);
		case "count": return resolveVisibleHistoryEventCount(projection);
		case "recent": return {
			...readRecentSqliteMessageRecords(projection, selection.options),
			transcriptPath: sessionFile,
			transcriptSource: "active"
		};
		case "page": {
			const page = readSessionTranscriptHistoryEventPageFromProjection(projection, selection.options);
			return {
				...Object.hasOwn(page, "activeLeafEntryId") ? { activeLeafEntryId: page.activeLeafEntryId } : {},
				...page.olderOffset !== void 0 ? { olderOffset: page.olderOffset } : {},
				...page.deltaCursor ? { deltaCursor: page.deltaCursor } : {},
				...page.omittedOversized ? { omittedOversized: true } : {},
				messages: projectSqliteHistoryEvents(page.events),
				displaySource: page.displaySource,
				...page.readWindow ? { readWindow: page.readWindow } : {},
				...page.windowReset ? { windowReset: true } : {},
				totalMessages: page.totalMessages,
				transcriptPath: sessionFile,
				transcriptSource: "active"
			};
		}
		case "around-id": {
			const page = readSessionTranscriptHistoryAnchorPageFromProjection(projection, selection.options);
			if (!page.found) return {
				found: false,
				hasOverreadContext: false,
				messages: [],
				offset: 0,
				totalMessages: page.totalMessages,
				transcriptPath: sessionFile
			};
			return {
				found: true,
				...page.windowReset ? { windowReset: true } : {},
				...page.readWindow ? { readWindow: page.readWindow } : {},
				displaySource: page.displaySource,
				hasOverreadContext: page.hasOverreadContext,
				messages: capAnchorEventsByBytes(page.events, selection.options.maxBytes).map(sqliteMessageEventWithSeq).filter((message) => message !== void 0),
				offset: page.offset,
				totalMessages: page.totalMessages,
				transcriptPath: sessionFile
			};
		}
		case "by-id": {
			const event = readSessionTranscriptHistoryEventByIdFromProjection(projection, selection.messageId, selection.options);
			return event ? {
				found: true,
				message: sqliteMessageEventWithSeq(event),
				oversized: false,
				seq: event.seq,
				...event.serializedBytes !== void 0 ? { serializedBytes: event.serializedBytes } : {}
			} : {
				found: false,
				oversized: false
			};
		}
		case "source": {
			const opts = selection.options;
			return {
				messages: opts.mode === "recent" ? readRecentSqliteMessageRecords(projection, opts).messages : projectSqliteHistoryEvents(readSessionTranscriptHistoryEventsFromProjection(projection)),
				transcriptPath: sessionFile,
				...opts.mode === "full" && opts.includeOffPathMessages ? { offPathMessages: projectSqliteHistoryEvents(readOffPathSessionTranscriptEventsFromProjection(projection)) } : {}
			};
		}
		case "lookup": {
			const lookup = readSessionTranscriptHistoryEventLookupFromProjection(projection, selection.messageId);
			return {
				hasDisplayMessages: lookup.hasDisplayMessages,
				messages: filterSessionMessagesMatchingId(projectSqliteHistoryEvents(lookup.events), selection.messageId)
			};
		}
	}
	throw new Error("Unsupported transcript history selection");
}
function visitProjectionMessages(projection, visit) {
	let count = 0;
	const visible = resolveVisibleMessagePositions(projection);
	for (const entry of iterateVisibleMessageRange(projection, 0, visible.total)) {
		const message = asOptionalRecord(entry.event)?.message;
		if (message !== void 0) {
			visit(message, entry.seq);
			count += 1;
		}
	}
	return count;
}
/** Share pagination and archive policy while the caller owns acquisition and restoration. */
function createSessionTranscriptReader(access) {
	async function visitSessionMessagesAsync(scope, visit) {
		const target = await access.resolveTarget(scope);
		return access.readSnapshot(target, (projection) => visitProjectionMessages(projection, visit));
	}
	async function readSessionTranscriptSummaryAsync(scope, query) {
		const select = await prepareSessionTranscriptSummaryReader(query);
		const target = await access.resolveTarget(scope);
		return access.readSnapshot(target, (projection) => select((visit) => {
			visitProjectionMessages(projection, visit);
		}));
	}
	async function readSnapshotIfPresent(target, read, options) {
		try {
			return await access.readSnapshot(target, read, options);
		} catch (error) {
			if (error instanceof SessionTranscriptStorageUnavailableError && error.reason === "database-missing" && (options === void 0 || options.allowResetArchiveFallback === true) && !options?.readOnly) return;
			throw error;
		}
	}
	async function readSessionMessageCountAsync(scope) {
		return await readSnapshotIfPresent(await access.resolveTarget(scope), (projection) => selectSessionTranscriptProjection(projection, { kind: "count" })) ?? 0;
	}
	async function readSessionMessagesAsync(scope, opts) {
		return (await readSessionMessagesWithSourceAsync(scope, opts)).messages;
	}
	async function readSessionMessagesWithSourceAsync(scope, opts) {
		const target = await access.resolveTarget(scope);
		const snapshot = await readSnapshotIfPresent(target, (projection) => selectSessionTranscriptProjection(projection, {
			kind: "source",
			options: opts
		}, target.sessionFile), opts) ?? {
			messages: [],
			offPathMessages: []
		};
		const result = snapshot.messages.length === 0 && opts.allowResetArchiveFallback === true ? await archivedTranscriptReader(target).read(opts) : {
			messages: snapshot.messages,
			transcriptPath: target.sessionFile
		};
		return snapshot.offPathMessages ? {
			...result,
			messages: [...result.messages, ...snapshot.offPathMessages]
		} : result;
	}
	async function readSessionMessageByIdAsync(scope, messageId, opts) {
		const target = await access.resolveTarget(scope);
		const found = await readSnapshotIfPresent(target, (projection) => selectSessionTranscriptProjection(projection, {
			kind: "by-id",
			messageId,
			options: opts
		}));
		if (found?.found) return found;
		if (opts?.allowResetArchiveFallback === true && !opts.currentOnly) return await archivedTranscriptReader(target).readById(messageId);
		return {
			found: false,
			oversized: false
		};
	}
	/** Read exact membership while retaining full-history validity and empty-only archive fallback. */
	async function readSessionMessagesMatchingIdAsync(scope, messageId) {
		const target = await access.resolveTarget(scope);
		const lookup = await access.readSnapshot(target, (projection) => selectSessionTranscriptProjection(projection, {
			kind: "lookup",
			messageId
		}));
		if (lookup.hasDisplayMessages) return lookup.messages;
		return filterSessionMessagesMatchingId(await archivedTranscriptReader(target).readMessageCandidatesById(messageId), messageId);
	}
	async function readRecentSessionMessagesWithStatsAsync(scope, opts) {
		const target = await access.resolveTarget(scope);
		const page = await readSnapshotIfPresent(target, (projection) => selectSessionTranscriptProjection(projection, {
			kind: "recent",
			options: opts
		}, target.sessionFile), opts) ?? {
			messages: [],
			totalMessages: 0
		};
		if (!page.windowReset && page.totalMessages === 0 && page.messages.length === 0 && opts.allowResetArchiveFallback === true) return await archivedTranscriptReader(target).readRecentWithStats(opts);
		return {
			...page,
			transcriptPath: target.sessionFile,
			transcriptSource: "active"
		};
	}
	async function readSessionMessagesPageWithStatsAsync(scope, opts) {
		const target = await access.resolveTarget(scope);
		const page = await readSnapshotIfPresent(target, (projection) => selectSessionTranscriptProjection(projection, {
			kind: "page",
			options: opts
		}, target.sessionFile), opts);
		if ((!page || page.totalMessages === 0 && !page.windowReset) && opts.allowResetArchiveFallback === true) return await archivedTranscriptReader(target).readPage(opts);
		if (!page) return {
			messages: [],
			totalMessages: 0,
			transcriptPath: target.sessionFile,
			transcriptSource: "active"
		};
		return page;
	}
	/** Reads one message-id-anchored page from a single transcript snapshot. */
	async function readSessionMessagesAroundIdWithStatsAsync(scope, opts) {
		const target = await access.resolveTarget(scope);
		const sessionFile = !scope.sessionFile && scope.sessionEntry?.sessionId && scope.sessionEntry.sessionId !== scope.sessionId ? void 0 : target.sessionFile;
		const page = await readSnapshotIfPresent(target, (projection) => selectSessionTranscriptProjection(projection, {
			kind: "around-id",
			options: opts
		}, target.sessionFile), opts);
		if (!page?.found) {
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
				totalMessages: page?.totalMessages ?? 0,
				transcriptPath: target.sessionFile
			};
		}
		return page;
	}
	return {
		visitSessionMessagesAsync,
		readSessionTranscriptSummaryAsync,
		readSessionMessageCountAsync,
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
export { selectSessionTranscriptProjection as n, createSessionTranscriptReader as t };
