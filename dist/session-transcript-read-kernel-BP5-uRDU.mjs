import { j as resolveIntegerOption } from "./number-coercion-CkhMiRw8.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as executeSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { o as readTranscriptPayload } from "./transcript-payload-Cu49oQKq.mjs";
import { t as MAX_PAYLOAD_BYTES } from "./payload-limits-ChDi8AHf.mjs";
import { n as SessionTranscriptSourceMessageTooLargeError } from "./session-transcript-source-pages-DzseyJB5.mjs";
import { t as isVisibleHistoryNonMessageEvent } from "./session-history-visibility-CUkAHE4T.mjs";
import { r as jsonUtf8Bytes } from "./json-utf8-bytes-C0-PtdPX.mjs";
import { i as sqliteMessageEventWithSeq } from "./session-transcript-entry-message-Q75Efb-t.mjs";
import { t as boundHistoryAnchorPageRange } from "./transcript-anchor-page-CKxnXLW4.mjs";
import { n as SessionTranscriptStorageUnavailableError, t as SessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { t as readRecentTranscriptConversationText } from "./transcript-recent-text-g7xyo8QS.mjs";
import { n as transcriptEventReadBytesSql } from "./session-transcript-read-bytes-D9BDv7Ny.mjs";
import { a as readSnapshotEventRows, t as getActiveTranscriptKysely } from "./session-accessor.sqlite-projection-read-3DYCwfDO.mjs";
import { i as iterateVisibleMessageRange, l as resolveTranscriptBoundaryWindow, u as resolveVisibleMessagePositions } from "./session-accessor.sqlite-reset-window-Cl0GzV50.mjs";
import { n as readSessionTranscriptBoundedMessageTailPageFromProjection } from "./session-accessor.sqlite-active-events-read-AJh0lWpC.mjs";
import { c as projectChatDisplayMessagesWithState, i as isPendingAssistantError, t as createChatHistoryRecoveryProjection } from "./chat-display-projection.core-DdRZ3VIg.mjs";
import { r as dropPreSessionStartAnnouncePairs, s as isPreSessionStartAssistantMessage } from "./chat-display-projection.history-DKYX-kD-.mjs";
import { a as readSessionTranscriptHistoryEventPageFromProjection, f as parseStoredTranscriptEvent, i as readSessionTranscriptHistoryEventLookupFromProjection, l as resolveVisibleHistoryEventCount, m as readTranscriptDisplaySource, n as readSessionTranscriptHistoryAnchorPageFromProjection, o as readTranscriptDisplayDeltaFromProjection, p as positionTranscriptDisplayEvents, r as readSessionTranscriptHistoryEventByIdFromProjection, s as readActiveTranscriptCoordinate, t as readRecentSessionTranscriptHistoryEventsFromProjection } from "./session-accessor.sqlite-history-query-CeElVTvK.mjs";
import { a as readChatHistoryMessageId, c as readChatHistoryRecoveryContext } from "./session-history-tail-C5LEM5f_.mjs";
import { t as ArchivedTranscriptReader } from "./session-transcript-archive-reader-ytVG61Zu.mjs";
import { t as prepareSessionTranscriptSummaryReader } from "./session-transcript-summary-BkZWnghy.mjs";
//#region src/config/sessions/session-accessor.sqlite-history-source.ts
/** Page indexed positions, including hidden controls, without rebuilding a full marker map. */
function readSessionTranscriptSourcePageFromProjection(projection, options) {
	if (options.cursor?.kind === "archive") throw new Error("Archive source cursors require the archive reader");
	const db = getActiveTranscriptKysely(projection.database);
	const sessionId = projection.resolved.sessionId;
	const window = resolveTranscriptBoundaryWindow(projection);
	const activeEventCount = options.cursor?.snapshot.activeEventCount ?? projection.state.activeEventCount;
	const tail = readActiveTranscriptCoordinate(projection, { activePosition: activeEventCount - 1 });
	const snapshot = options.cursor?.snapshot ?? {
		indexedSeq: projection.state.indexedSeq,
		activeEventCount,
		totalMessages: resolveVisibleHistoryEventCount(projection),
		generation: projection.generation,
		tailEventSeq: tail?.event_seq,
		resetSeq: window?.boundarySeq ?? null
	};
	if (options.cursor && (snapshot.generation !== projection.generation || snapshot.indexedSeq > projection.state.indexedSeq || snapshot.tailEventSeq !== tail?.event_seq || snapshot.resetSeq !== (window?.boundarySeq ?? null))) throw new SessionTranscriptProjectionUnavailableError(sessionId, "window-changed");
	if (!options.cursor && snapshot.totalMessages === 0) return {
		events: [],
		snapshot,
		nextCursor: options.includeOffPathMessages ? {
			kind: "off-path",
			position: -1,
			messageSeq: 0,
			snapshot
		} : void 0
	};
	const kept = window?.keptMessagePositions ?? [];
	let cursor = options.cursor ?? {
		kind: kept.length > 0 ? "kept" : "active",
		position: kept.length > 0 ? 0 : window?.boundaryActivePosition ?? 0,
		messageSeq: 0,
		snapshot
	};
	const activeEvents = [];
	const offPathEvents = [];
	let consumed = 0;
	let bytes = 0;
	while (cursor && consumed < 128) {
		const kind = cursor.kind;
		const remaining = 128 - consumed;
		const keptPositions = kind === "kept" ? kept.slice(cursor.position, cursor.position + remaining) : [];
		const active = db.selectFrom("session_transcript_active_events as active").crossJoin("transcript_events as event").whereRef("event.session_id", "=", "active.session_id").whereRef("event.seq", "=", "active.event_seq").select([
			"event.seq",
			"active.active_position as position",
			"active.message_position",
			transcriptEventReadBytesSql("event").as("bytes")
		]).where("active.session_id", "=", sessionId);
		const query = kind === "off-path" ? db.selectFrom("transcript_events as event").select([
			"event.seq",
			"event.seq as position",
			(eb) => eb.val(null).as("message_position"),
			transcriptEventReadBytesSql("event").as("bytes")
		]).where("event.session_id", "=", sessionId).where("event.seq", ">", cursor.position).where("event.seq", "<=", snapshot.indexedSeq).where((eb) => eb.not(eb.exists(eb.selectFrom("session_transcript_active_events as active").select("active.event_seq").whereRef("active.session_id", "=", "event.session_id").whereRef("active.event_seq", "=", "event.seq").where("active.active_position", "<", snapshot.activeEventCount)))).orderBy("event.seq", "asc") : kind === "kept" ? active.where("active.message_position", "in", keptPositions).orderBy("active.message_position", "asc") : active.where("active.active_position", ">=", cursor.position).where("active.active_position", "<", snapshot.activeEventCount).orderBy("active.active_position", "asc");
		const rows = kind === "kept" && keptPositions.length === 0 ? [] : executeSqliteQuerySync(projection.database.db, query.limit(remaining)).rows;
		let admitted = 0;
		for (const row of rows) {
			if (row.bytes + 1 > 8388608) throw new SessionTranscriptSourceMessageTooLargeError();
			if (bytes + row.bytes + 1 > 8388608) break;
			bytes += row.bytes + 1;
			admitted++;
		}
		const selected = rows.slice(0, admitted);
		const payloads = new Map(selected.length === 0 ? [] : readSnapshotEventRows(projection, selected.map((row) => row.seq)).map((row) => [row.seq, parseStoredTranscriptEvent(readTranscriptPayload(row))]));
		let messageSeq = cursor.messageSeq;
		for (const row of selected) {
			const event = payloads.get(row.seq);
			if (kind === "off-path" || row.message_position !== null || isRecord(event) && isVisibleHistoryNonMessageEvent(event)) {
				const entry = {
					event,
					eventSeq: row.seq,
					seq: kind === "off-path" ? row.seq + 1 : ++messageSeq
				};
				(kind === "off-path" ? offPathEvents : activeEvents).push(entry);
			}
		}
		consumed += admitted;
		const last = selected.at(-1);
		const position = kind === "kept" ? cursor.position + (admitted < rows.length ? keptPositions.indexOf(rows[admitted].message_position) : keptPositions.length) : last ? last.position + (kind === "off-path" ? 0 : 1) : cursor.position;
		cursor = {
			kind,
			position,
			messageSeq,
			snapshot
		};
		if (admitted < rows.length) break;
		if (kind === "kept" && position >= kept.length) cursor = {
			kind: "active",
			position: window?.boundaryActivePosition ?? 0,
			snapshot,
			messageSeq
		};
		else if (kind === "active" && (rows.length < remaining || position >= snapshot.activeEventCount)) cursor = options.includeOffPathMessages ? {
			kind: "off-path",
			position: -1,
			snapshot,
			messageSeq
		} : void 0;
		else if (kind === "off-path" && rows.length < remaining) cursor = void 0;
	}
	return {
		events: [...positionTranscriptDisplayEvents(projection, readTranscriptDisplaySource(projection), activeEvents, snapshot.indexedSeq), ...offPathEvents],
		snapshot,
		...cursor ? { nextCursor: cursor } : {}
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
function capAnchorEventsByBytes(events, options) {
	if (options.maxBytes === void 0) return events;
	const anchor = events.findIndex(({ event }) => asOptionalRecord(event)?.id === options.messageId);
	const range = boundHistoryAnchorPageRange({
		readStart: 0,
		endExclusive: events.length,
		hasOverreadContext: false,
		offset: 0
	}, anchor >= 0 ? anchor : options.direction === "newer" ? 0 : events.length - 1, Math.max(1024, Math.floor(options.maxBytes)), (index) => jsonUtf8Bytes(events[index]) + 1);
	return events.slice(range.start, range.endExclusive);
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
		case "recent-text": return readRecentTranscriptConversationText((page) => readSessionTranscriptBoundedMessageTailPageFromProjection(projection, page), selection.options);
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
			const events = capAnchorEventsByBytes(page.events, selection.options);
			return {
				found: true,
				...page.windowReset ? { windowReset: true } : {},
				...page.readWindow ? { readWindow: page.readWindow } : {},
				displaySource: page.displaySource,
				hasOverreadContext: page.hasOverreadContext && events[0] === page.events[0],
				messages: events.map(sqliteMessageEventWithSeq).filter((message) => message !== void 0),
				offset: events.length ? page.totalMessages - events.at(-1).seq : page.offset,
				totalMessages: page.totalMessages,
				transcriptPath: sessionFile
			};
		}
		case "by-id": {
			const event = readSessionTranscriptHistoryEventByIdFromProjection(projection, selection.messageId, selection.options, selection.options?.historyVisibility ? (candidate) => isPreSessionStartAssistantMessage(sqliteMessageEventWithSeq(candidate), selection.options?.historyVisibility?.sessionStartedAt) : void 0);
			return event ? {
				found: true,
				message: sqliteMessageEventWithSeq(event),
				...selection.options?.historyVisibility ? { historyContext: {
					displaySource: event.displayPosition?.source,
					...event.preceding ? { precedingMessage: sqliteMessageEventWithSeq(event.preceding) } : {}
				} } : {},
				oversized: false,
				seq: event.seq,
				...event.serializedBytes !== void 0 ? { serializedBytes: event.serializedBytes } : {}
			} : {
				found: false,
				oversized: false
			};
		}
		case "source": {
			const { events, ...page } = readSessionTranscriptSourcePageFromProjection(projection, selection.options);
			return {
				...page,
				messages: projectSqliteHistoryEvents(events),
				transcriptPath: sessionFile
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
/** Apply display visibility to an exact read without reacquiring its archive generation. */
async function filterSessionMessageHistoryVisibility(selected, scope, messageId, visibility, readers) {
	const { historyContext, ...result } = selected;
	if (!visibility || !result.found) return result;
	if (!dropPreSessionStartAnnouncePairs(historyContext?.precedingMessage === void 0 ? [result.message] : [historyContext.precedingMessage, result.message], visibility.sessionStartedAt).includes(result.message)) return {
		found: false,
		oversized: false,
		historyHidden: true
	};
	if (result.oversized) return {
		found: true,
		oversized: true,
		...result.seq === void 0 ? {} : { seq: result.seq }
	};
	if (isPendingAssistantError(result.message)) {
		const archive = historyContext?.transcriptPath ? new ArchivedTranscriptReader({
			exactArchivePath: historyContext.transcriptPath,
			sessionId: scope.sessionId
		}) : void 0;
		const recoveryReaders = {
			...readers,
			readSessionMessagesAroundIdWithStatsAsync: archive ? (_scope, options) => archive.readAroundId(options) : readers.readSessionMessagesAroundIdWithStatsAsync
		};
		const createRecovery = () => createChatHistoryRecoveryProjection({
			maxChars: MAX_PAYLOAD_BYTES,
			subagentCoordination: readers.subagentCoordination
		});
		const recovery = createRecovery();
		recovery.append([result.message]);
		const context = await readChatHistoryRecoveryContext({
			messages: [result.message],
			createRecovery: () => recovery,
			readers: recoveryReaders,
			readScope: scope,
			displaySource: historyContext?.displaySource,
			maxBytes: MAX_PAYLOAD_BYTES,
			sessionStartedAt: visibility.sessionStartedAt
		});
		const projectedMessage = projectChatDisplayMessagesWithState([result.message, ...context], {
			maxChars: MAX_PAYLOAD_BYTES,
			subagentCoordination: readers.subagentCoordination
		}).messages.find((message) => readChatHistoryMessageId(message) === messageId);
		if (!projectedMessage) return {
			found: false,
			oversized: false,
			historyHidden: true
		};
		return {
			...result,
			message: projectedMessage
		};
	}
	if (visibility.requireVisible) {
		const message = projectChatDisplayMessagesWithState([result.message], {
			maxChars: MAX_PAYLOAD_BYTES,
			includeCommentaryFallbacks: true,
			subagentCoordination: readers.subagentCoordination
		}).messages.find((entry) => readChatHistoryMessageId(entry) === messageId);
		return message ? {
			...result,
			message
		} : {
			found: false,
			oversized: false,
			historyHidden: true
		};
	}
	return result;
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
	async function readSnapshotIfPresent(target, selection, options) {
		try {
			return await access.readSnapshot(target, (projection) => selectSessionTranscriptProjection(projection, selection, target.sessionFile), options);
		} catch (error) {
			if (error instanceof SessionTranscriptStorageUnavailableError && error.reason === "database-missing" && (options === void 0 || options.allowResetArchiveFallback === true) && !options?.readOnly) return;
			throw error;
		}
	}
	async function readSessionMessageCountAsync(scope) {
		return await readSnapshotIfPresent(await access.resolveTarget(scope), { kind: "count" }) ?? 0;
	}
	async function readSessionMessagesWithSourceAsync(scope, opts) {
		const target = await access.resolveTarget(scope);
		if (opts.cursor?.kind === "archive") return archivedTranscriptReader(target).readSourcePage(opts, opts.cursor.snapshot);
		const snapshot = await readSnapshotIfPresent(target, {
			kind: "source",
			options: opts
		}, opts) ?? { messages: [] };
		if (opts.allowResetArchiveFallback === true && !opts.cursor && (snapshot.snapshot?.totalMessages ?? 0) === 0) return archivedTranscriptReader(target).readSourcePage(opts, snapshot.snapshot ?? {
			indexedSeq: -1,
			activeEventCount: 0,
			totalMessages: 0,
			generation: void 0,
			tailEventSeq: void 0,
			resetSeq: null
		});
		return snapshot;
	}
	async function readSessionMessageByIdAsync(scope, messageId, opts) {
		const target = await access.resolveTarget(scope);
		const found = await readSnapshotIfPresent(target, {
			kind: "by-id",
			messageId,
			options: opts
		});
		return filterSessionMessageHistoryVisibility(found?.found ? found : opts?.allowResetArchiveFallback === true && !opts.currentOnly ? await archivedTranscriptReader(target).readById(messageId, opts.historyVisibility) : {
			found: false,
			oversized: false
		}, scope, messageId, opts?.historyVisibility, {
			...reader,
			subagentCoordination: access.subagentCoordination
		});
	}
	/** Read exact membership with current visibility and empty-only archive fallback. */
	async function readSessionMessagesMatchingIdAsync(scope, messageId) {
		const target = await access.resolveTarget(scope);
		const lookup = await access.readSnapshot(target, (projection) => selectSessionTranscriptProjection(projection, {
			kind: "lookup",
			messageId
		}));
		if (lookup.hasDisplayMessages) return lookup.messages;
		return filterSessionMessagesMatchingId(await archivedTranscriptReader(target).readMessageCandidatesById(messageId), messageId);
	}
	async function readMessagePage(scope, selection) {
		const target = await access.resolveTarget(scope);
		const page = await readSnapshotIfPresent(target, selection, selection.options) ?? {
			messages: [],
			totalMessages: 0
		};
		if (!page.windowReset && page.totalMessages === 0 && (selection.kind === "page" || page.messages.length === 0) && selection.options.allowResetArchiveFallback === true) {
			const archive = archivedTranscriptReader(target);
			return selection.kind === "recent" ? archive.readRecentWithStats(selection.options) : archive.readPage(selection.options);
		}
		return {
			...page,
			transcriptPath: target.sessionFile,
			transcriptSource: "active"
		};
	}
	const readRecentSessionMessagesWithStatsAsync = (scope, options) => readMessagePage(scope, {
		kind: "recent",
		options
	});
	const readSessionMessagesPageWithStatsAsync = (scope, options) => readMessagePage(scope, {
		kind: "page",
		options
	});
	/** Reads one message-id-anchored page from a single transcript snapshot. */
	async function readSessionMessagesAroundIdWithStatsAsync(scope, opts) {
		const target = await access.resolveTarget(scope);
		const sessionFile = !scope.sessionFile && scope.sessionEntry?.sessionId && scope.sessionEntry.sessionId !== scope.sessionId ? void 0 : target.sessionFile;
		const page = await readSnapshotIfPresent(target, {
			kind: "around-id",
			options: opts
		}, opts);
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
	const reader = {
		visitSessionMessagesAsync,
		readSessionTranscriptSummaryAsync,
		readSessionMessageCountAsync,
		readSessionMessagesWithSourceAsync,
		readSessionMessageByIdAsync,
		readSessionMessagesMatchingIdAsync,
		readRecentSessionMessagesWithStatsAsync,
		readSessionMessagesPageWithStatsAsync,
		readSessionMessagesAroundIdWithStatsAsync
	};
	return reader;
}
//#endregion
export { filterSessionMessageHistoryVisibility as n, createSessionTranscriptReader as t };
