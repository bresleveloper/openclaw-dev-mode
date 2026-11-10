import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
import { c as hasInterSessionUserProvenance } from "./input-provenance-D1LHo5Qj.mjs";
import { n as projectSessionDisplayMessage } from "./session-display-projection-DDhSj356.mjs";
import { i as sqliteMessageEventWithSeq } from "./session-transcript-entry-message-Q75Efb-t.mjs";
import { r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { t as SessionTranscriptColdError } from "./session-cold-storage-state-CWFSrppd.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { t as readSessionTranscriptWatermark } from "./session-accessor.sqlite-transcript-watermark-CfdOKFaq.mjs";
import { t as captureSessionActorTranscriptRead } from "./session-actor-transcript-read-Wje_m4fK.mjs";
import { a as resolveSessionTranscriptReadTarget } from "./session-accessor.transcript-target-DDngfM5X.mjs";
import { o as readSessionTranscriptBoundedMessageTailPage, s as readSessionTranscriptMessageEventPage } from "./session-accessor.sqlite-active-events-CqOkO0QM.mjs";
import { n as toTranscriptReadScope } from "./session-transcript-read-target-qX7ujxKd.mjs";
//#region src/gateway/session-transcript-title-reader.worker.ts
const EMPTY_SESSION_TITLE_FIELDS = {
	firstUserMessage: null,
	lastMessagePreview: null
};
const SQLITE_TITLE_PROBE_INITIAL_MESSAGES = 20;
const SQLITE_TITLE_PROBE_MAX_MESSAGES = 100;
const SQLITE_TITLE_TAIL_PROBE_MAX_BYTES = 65536;
const sqliteTitleFieldCache = new LruCache(8192);
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
		if (projected?.role === "user" && (includeInterSession || !hasInterSessionUserProvenance(asOptionalRecord(message)))) return projected.text;
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
function readSessionTitleFieldsFromTranscript(input, opts) {
	const read = captureSessionActorTranscriptRead(input);
	const memory = read && captureSessionActorStorageOwner(input, {
		assertCurrent: read.assertCurrent,
		authorize: read.assertCurrent
	});
	if (memory) {
		const key = input.sessionKey ?? memory.owner?.readSessionById(input.sessionId, memory.authority)?.sessionKey;
		const command = {
			type: "session.history.title",
			input: {
				sessionId: input.sessionId,
				includeInterSession: opts?.includeInterSession
			}
		};
		const binding = memory.binding;
		return (binding && binding.actor.target.sessionKey === key ? binding.actor.storage.readCurrent(command, memory.authority) : key ? memory.owner?.readStorage(key, command, memory.authority) : void 0)?.fields ?? { ...EMPTY_SESSION_TITLE_FIELDS };
	}
	const target = resolveSessionTranscriptReadTarget(input);
	try {
		const scope = {
			...toTranscriptReadScope(target),
			...input.env ? { env: input.env } : {}
		};
		const cacheKey = `${target.agentId ?? ""}\0${target.sessionId}\0${target.storePath ?? ""}`;
		const watermark = readSessionTranscriptWatermark(scope);
		if (watermark.maxSeq === null) return { ...EMPTY_SESSION_TITLE_FIELDS };
		const variant = opts?.includeInterSession === true ? "includeInterSession" : "default";
		const entry = sqliteTitleFieldCache.peek(cacheKey);
		const cached = entry?.generation === watermark.generation ? entry : void 0;
		const current = cached?.maxSeq === watermark.maxSeq;
		const cachedTitle = cached?.firstUserMessages[variant];
		if (cached && current && cachedTitle && (cachedTitle.text !== null || cachedTitle.scannedMessages >= Math.min(cached.totalMessages, SQLITE_TITLE_PROBE_MAX_MESSAGES))) {
			sqliteTitleFieldCache.set(cacheKey, cached);
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
		sqliteTitleFieldCache.set(cacheKey, {
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
//#endregion
export { readSessionTitleFieldsFromTranscript };
