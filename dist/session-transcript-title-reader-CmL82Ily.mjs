import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { a as resolveOpenClawAgentSqlitePath, r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { g as toDatabaseOptions, p as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { r as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-Cef06Gbk.mjs";
import { t as SessionTranscriptColdError } from "./session-cold-storage-state-BcO2Rrog.mjs";
import { r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-CuzwVnKb.mjs";
import { r as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-Crjo4FKU.mjs";
import { l as readSessionTranscriptWatermark } from "./session-accessor-C05KQ5A3.mjs";
import { t as prepareSessionTranscriptReadTargetCore } from "./session-accessor.transcript-read-target-Cotag45I.mjs";
import { r as resolveSessionTranscriptReadTarget } from "./session-accessor.transcript-target-CV-eEST-.mjs";
import { c as readSessionTranscriptMessageEventPage, s as readSessionTranscriptBoundedMessageTailPage } from "./session-accessor.sqlite-active-events-Cnt-hBim.mjs";
import { c as hasInterSessionUserProvenance } from "./input-provenance-C4tQegGN.mjs";
import { i as sqliteMessageEventWithSeq } from "./session-transcript-entry-message-COJ0koI7.mjs";
import { n as toTranscriptReadScope } from "./session-transcript-read-target-EurQ_dzR.mjs";
import { n as projectSessionDisplayMessage } from "./session-display-projection-bZOY074i.mjs";
//#region src/gateway/session-transcript-title-reader.ts
const EMPTY_SESSION_TITLE_FIELDS = {
	firstUserMessage: null,
	lastMessagePreview: null
};
const SQLITE_TITLE_PROBE_INITIAL_MESSAGES = 20;
const SQLITE_TITLE_PROBE_MAX_MESSAGES = 100;
const SQLITE_TITLE_TAIL_PROBE_MAX_BYTES = 65536;
const SQLITE_TITLE_FIELD_CACHE_MAX_ENTRIES = 8192;
const sqliteTitleFieldCache = /* @__PURE__ */ new Map();
function sqliteTitleFieldCacheKey(target) {
	return `${target.agentId ?? ""}\0${target.sessionId}\0${target.storePath ?? ""}`;
}
function setSqliteTitleFieldCache(key, entry) {
	sqliteTitleFieldCache.delete(key);
	sqliteTitleFieldCache.set(key, entry);
	pruneMapToMaxSize(sqliteTitleFieldCache, SQLITE_TITLE_FIELD_CACHE_MAX_ENTRIES);
}
function readSqliteTitleProbeRange(scope, totalMessages, start, endExclusive, readOnly) {
	const end = Math.min(totalMessages, endExclusive);
	const boundedStart = Math.min(Math.max(0, start), end);
	if (boundedStart === end) return [];
	return readSessionTranscriptMessageEventPage(scope, {
		maxMessages: end - boundedStart,
		offset: boundedStart,
		offsetFrom: "start",
		...readOnly ? { readOnly } : {}
	}).events;
}
function findFirstTitleUserText(entries, includeInterSession) {
	for (const entry of entries) {
		const message = sqliteMessageEventWithSeq(entry);
		const projected = projectSessionDisplayMessage(message);
		if (projected?.role === "user" && (includeInterSession || !hasInterSessionUserProvenance(message))) return projected.text;
	}
	return null;
}
function findLastMessageText(entries) {
	let text = null;
	entries.findLast((entry) => {
		const message = sqliteMessageEventWithSeq(entry);
		text = projectSessionDisplayMessage(message, { flattenMarkdown: true })?.text ?? null;
		return text !== null;
	});
	return text;
}
function readSqliteTitleTailProbe(scope, maxMessages, offset, readOnly) {
	const page = readSessionTranscriptBoundedMessageTailPage(scope, {
		maxMessages,
		maxBytes: SQLITE_TITLE_TAIL_PROBE_MAX_BYTES,
		offset,
		...readOnly ? { readOnly } : {}
	});
	let text = findLastMessageText(page.newestContiguousEventCount ? page.events.slice(-page.newestContiguousEventCount) : []);
	if (text === null && page.newestContiguousEventCount < page.scannedMessages) text = findLastMessageText(readSessionTranscriptMessageEventPage(scope, {
		maxMessages,
		offset,
		...readOnly ? { readOnly } : {}
	}).events);
	return {
		text,
		totalMessages: page.totalMessages,
		generation: page.snapshot.generation ?? null,
		maxSeq: page.snapshot.indexedSeq,
		boundarySeq: page.snapshot.boundarySeq
	};
}
function copySessionTitleText(text) {
	return text === null ? null : Buffer.from(text, "utf16le").toString("utf16le");
}
function hydrateSqliteTitleFields(target, opts) {
	try {
		const scope = toTranscriptReadScope(target);
		const cacheKey = sqliteTitleFieldCacheKey(target);
		const watermark = readSessionTranscriptWatermark(scope);
		if (watermark.maxSeq === null) return { ...EMPTY_SESSION_TITLE_FIELDS };
		const variant = opts?.includeInterSession === true ? "includeInterSession" : "default";
		const entry = sqliteTitleFieldCache.get(cacheKey);
		const cached = entry?.generation === watermark.generation ? entry : void 0;
		const current = cached?.maxSeq === watermark.maxSeq;
		const cachedTitle = cached?.firstUserMessages[variant];
		if (cached && current && cachedTitle && (cachedTitle.text !== null || cachedTitle.scannedMessages >= Math.min(cached.totalMessages, SQLITE_TITLE_PROBE_MAX_MESSAGES))) {
			setSqliteTitleFieldCache(cacheKey, cached);
			return {
				firstUserMessage: cachedTitle.text,
				lastMessagePreview: cached.lastMessagePreview
			};
		}
		const tail = current ? {
			text: cached.lastMessagePreview,
			totalMessages: cached.totalMessages,
			generation: cached.generation,
			maxSeq: cached.maxSeq,
			boundarySeq: cached.boundarySeq
		} : readSqliteTitleTailProbe(scope, SQLITE_TITLE_PROBE_INITIAL_MESSAGES, 0, opts?.readOnly);
		let lastText = tail.text;
		if (!current && !lastText && tail.totalMessages > SQLITE_TITLE_PROBE_INITIAL_MESSAGES) lastText = readSqliteTitleTailProbe(scope, 80, SQLITE_TITLE_PROBE_INITIAL_MESSAGES, opts?.readOnly).text;
		const firstUserMessages = cached?.generation === tail.generation && cached.boundarySeq === tail.boundarySeq ? cached.firstUserMessages : {};
		const head = firstUserMessages[variant];
		let firstText = head?.text ?? null;
		let scannedMessages = head?.scannedMessages ?? 0;
		for (const limit of [SQLITE_TITLE_PROBE_INITIAL_MESSAGES, SQLITE_TITLE_PROBE_MAX_MESSAGES]) {
			const end = Math.min(tail.totalMessages, limit);
			if (!firstText && scannedMessages < end) {
				firstText = findFirstTitleUserText(readSqliteTitleProbeRange(scope, tail.totalMessages, scannedMessages, end, opts?.readOnly), opts?.includeInterSession === true);
				scannedMessages = end;
			}
		}
		const fields = {
			firstUserMessage: copySessionTitleText(firstText),
			lastMessagePreview: copySessionTitleText(lastText)
		};
		firstUserMessages[variant] = {
			text: fields.firstUserMessage,
			scannedMessages
		};
		setSqliteTitleFieldCache(cacheKey, {
			generation: tail.generation,
			maxSeq: tail.maxSeq,
			boundarySeq: tail.boundarySeq,
			totalMessages: tail.totalMessages,
			firstUserMessages,
			lastMessagePreview: fields.lastMessagePreview
		});
		return { ...fields };
	} catch (error) {
		if (opts?.readOnly && isSessionTranscriptProjectionUnavailableError(error)) throw error;
		if (!isSessionTranscriptProjectionUnavailableError(error) && !(error instanceof SessionTranscriptColdError)) throw error;
		return { ...EMPTY_SESSION_TITLE_FIELDS };
	}
}
/** Reads title and preview text from one transcript. */
function readSessionTitleFieldsFromTranscript(scope, opts) {
	return hydrateSqliteTitleFields(resolveSessionTranscriptReadTarget(scope), opts);
}
/** Reuse the bounded title cache in the existing history worker without transporting session metadata. */
async function readSessionTitleFieldsFromTranscriptAsync(scope, opts) {
	const target = prepareSessionTranscriptReadTargetCore(scope);
	const readScope = {
		agentId: target.agentId,
		sessionId: scope.sessionId,
		sessionKey: target.sessionKey,
		storePath: target.storePath,
		...scope.env ? { env: scope.env } : {},
		...scope.sessionEntry ? { sessionEntry: { sessionId: scope.sessionEntry.sessionId } } : {}
	};
	const resolved = resolveSqliteTranscriptReadScope(readScope);
	const options = toDatabaseOptions(resolved);
	const databasePath = resolveOpenClawAgentSqlitePath(options);
	if (isIncognitoOpenClawAgentSqlitePath(databasePath, options)) return readSessionTitleFieldsFromTranscript(readScope, opts);
	const admission = resolveSessionTranscriptReadFence(resolved);
	const { withSessionHistoryWorkerDatabase } = await import("./session-transcript-worker-runtime-BO51kpzN.mjs");
	try {
		return await withSessionHistoryWorkerDatabase(options, (owner) => owner.readTitleFields({
			scope: {
				...readScope,
				storePath: databasePath
			},
			...opts?.includeInterSession ? { includeInterSession: true } : {},
			...admission ? { admission: { ...admission } } : {}
		}));
	} catch (error) {
		if (isSessionTranscriptProjectionUnavailableError(error)) {
			startSessionTranscriptIndexReconcile({
				...options,
				preferredSessionId: resolved.sessionId
			});
			return { ...EMPTY_SESSION_TITLE_FIELDS };
		}
		throw error;
	}
}
//#endregion
export { readSessionTitleFieldsFromTranscriptAsync as n, readSessionTitleFieldsFromTranscript as t };
