import { M as resolveNonNegativeIntegerOption, j as resolveIntegerOption } from "./number-coercion-CkhMiRw8.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { u as selectSessionTranscriptActiveEntries } from "./transcript-tree-D61jhi_i.mjs";
import { n as SessionTranscriptSourceMessageTooLargeError, t as SOURCE_PAGE_MAX_BYTES } from "./session-transcript-source-pages-DzseyJB5.mjs";
import { r as jsonUtf8Bytes } from "./json-utf8-bytes-C0-PtdPX.mjs";
import { a as readNestedToolActivity } from "./nested-tool-activity-Da7SpARz.mjs";
import { n as isVisibleTranscriptRecord } from "./transcript-visible-record-CmGktXrb.mjs";
import { n as projectTranscriptEntryMessage } from "./session-transcript-entry-message-Q75Efb-t.mjs";
import { n as resolveHistoryAnchorPageRange, r as resolveTranscriptPageEnd } from "./transcript-anchor-page-CKxnXLW4.mjs";
import { n as createTranscriptDisplaySource, t as createTranscriptDisplayPositionFromActivity } from "./transcript-display-position-BHW0T3ai.mjs";
import { t as SessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { n as materializeSessionArchiveForRead } from "./archive-compression-wxOTBVKt.mjs";
import { s as isPreSessionStartAssistantMessage } from "./chat-display-projection.history-DKYX-kD-.mjs";
import { a as resolveSessionTranscriptResetArchiveCandidatesAsync } from "./session-transcript-files.fs-tRCRA3R9.mjs";
import { n as parseTranscriptRecord } from "./session-transcript-record-parser-CPEdg9T5.mjs";
import fs from "node:fs";
import { readFileWindowFully } from "@openclaw/fs-safe/advanced";
//#region src/gateway/session-transcript-index.fs.ts
const transcriptIndexes = /* @__PURE__ */ new Map();
const MAX_TRANSCRIPT_INDEXES = 256;
const ARCHIVE_READ_BYTES = 65536;
const ARCHIVE_BATCH_BYTES = 1048576;
function transcriptArtifactDisplaySource(filePath, stat) {
	const identity = `${stat.dev}:${stat.ino}:${stat.ctimeMs}:${stat.mtimeMs}:${stat.size}`;
	return createTranscriptDisplaySource([
		"archive",
		filePath,
		identity
	]);
}
function assertArchiveTranscriptSource(filePath, stat, displaySource, sessionId) {
	if (transcriptArtifactDisplaySource(filePath, stat) !== displaySource) throw new SessionTranscriptProjectionUnavailableError(sessionId);
}
function selectArchiveTranscriptEntries(records, failClosedOnInvalidLeafControl = false) {
	const entries = selectSessionTranscriptActiveEntries({
		entries: records,
		recordOf: (entry) => entry.record,
		failClosedOnInvalidLeafControl
	});
	const boundaryIndex = entries.findLastIndex(({ record }) => {
		return record.type === "compaction" || record.type === "reset";
	});
	if (boundaryIndex < 0 || entries[boundaryIndex]?.record.type !== "reset") return entries;
	const firstKeptEntryId = entries[boundaryIndex]?.record.firstKeptEntryId;
	const firstKeptIndex = typeof firstKeptEntryId === "string" ? entries.findIndex((entry, index) => index < boundaryIndex && entry.id === firstKeptEntryId) : -1;
	return [...firstKeptIndex < 0 ? [] : entries.slice(firstKeptIndex, boundaryIndex).filter(({ record }) => {
		const role = asOptionalRecord(record.message)?.role;
		return role === "user" || role === "assistant";
	}), ...entries.slice(boundaryIndex)];
}
function archiveNavigationRecord(record) {
	const navigation = {};
	for (const key of [
		"id",
		"type",
		"parentId",
		"targetId",
		"appendParentId",
		"appendMode",
		"firstKeptEntryId"
	]) if (Object.hasOwn(record, key)) {
		const value = record[key];
		navigation[key] = typeof value === "string" || value === null ? value : false;
	}
	const role = asOptionalRecord(record.message)?.role;
	navigation.message = record.message ? { role: role === "user" || role === "assistant" ? role : void 0 } : false;
	if (record.type === "custom_message") {
		navigation.display = record.display === true;
		navigation.customType = record.customType;
	}
	return navigation;
}
function appendArchiveNavigationRecord(state) {
	const line = Buffer.concat(state.fragments, state.length).toString("utf8");
	const record = line.trim() ? parseTranscriptRecord(line) : null;
	if (!record) return;
	const rawSeq = state.records.length + 1;
	const activity = readNestedToolActivity(record.record.message)?.details;
	state.records.push({
		...record,
		record: archiveNavigationRecord(record.record),
		rawSeq,
		offset: state.lineOffset,
		length: state.length,
		...activity ? { activity: {
			afterEntryId: activity.afterEntryId,
			scopeId: activity.scopeId,
			startOrder: activity.startOrder
		} } : {}
	});
	if (record.id) state.rawSeqById.set(record.id, rawSeq);
}
function finishSessionTranscriptIndex({ records, rawSeqById }, displaySource) {
	const entries = selectArchiveTranscriptEntries(records).filter((entry) => isVisibleTranscriptRecord(entry.record)).map((entry, index) => ({
		id: entry.id,
		rawId: typeof entry.record.id === "string" ? entry.record.id : void 0,
		offset: entry.offset,
		length: entry.length,
		seq: index + 1,
		transcriptPosition: createTranscriptDisplayPositionFromActivity(displaySource, entry.rawSeq, entry.activity, (id) => rawSeqById.get(id))
	}));
	return {
		entries,
		byId: new Map(entries.flatMap((entry) => entry.id ? [[entry.id, entry]] : [])),
		displaySource
	};
}
function assertSourceLineBound(length) {
	if (length > 8388608) throw new SessionTranscriptSourceMessageTooLargeError();
}
async function prepareTranscriptIndexStep(filePath, cached, sessionId, bounded) {
	const state = cached.preparation;
	const handle = await fs.promises.open(filePath, "r");
	try {
		assertArchiveTranscriptSource(filePath, await handle.stat(), cached.identity, sessionId);
		let bytes = bounded ? state.length : 0;
		let lines = 0;
		scan: while (state.offset < cached.size && lines < 128) {
			const remaining = SOURCE_PAGE_MAX_BYTES - bytes;
			if (remaining <= 0 && (!bounded || state.length < 8388608)) break;
			const length = Math.min(ARCHIVE_READ_BYTES, Math.max(1, remaining), cached.size - state.offset);
			const chunk = Buffer.allocUnsafe(length);
			if (await readFileWindowFully(handle, chunk, state.offset) !== length) throw new SessionTranscriptProjectionUnavailableError(sessionId);
			bytes += length;
			let start = 0;
			if (state.afterCr) {
				if (chunk[0] === 10) {
					start++;
					state.offset++;
					state.lineOffset++;
				}
				state.afterCr = false;
			}
			while (start < chunk.length && lines < 128) {
				const lf = chunk.indexOf(10, start);
				const cr = chunk.indexOf(13, start);
				const end = lf < 0 ? cr : cr < 0 ? lf : Math.min(lf, cr);
				const fragmentEnd = end < 0 ? chunk.length : end;
				const fragment = chunk.subarray(start, fragmentEnd);
				cached.largestLine = Math.max(cached.largestLine, state.length + fragment.length);
				if (bounded && cached.largestLine > 8388608) break scan;
				state.fragments.push(fragment);
				state.length += fragment.length;
				state.offset += fragment.length;
				if (end < 0) break;
				appendArchiveNavigationRecord(state);
				lines++;
				state.fragments = [];
				state.length = 0;
				state.offset++;
				start = end + 1;
				state.afterCr = chunk[end] === 13;
				if (state.afterCr && start < chunk.length) {
					if (chunk[start] === 10) {
						start++;
						state.offset++;
					}
					state.afterCr = false;
				}
				state.lineOffset = state.offset;
			}
		}
		if (state.offset === cached.size) {
			if (state.length > 0) appendArchiveNavigationRecord(state);
			cached.value = finishSessionTranscriptIndex(state, cached.identity);
			cached.preparation = void 0;
		}
		assertArchiveTranscriptSource(filePath, await handle.stat(), cached.identity, sessionId);
	} finally {
		await handle.close();
	}
}
function advanceTranscriptIndex(filePath, cached, sessionId, bounded) {
	return cached.pending ??= prepareTranscriptIndexStep(filePath, cached, sessionId, bounded).catch((error) => {
		if (transcriptIndexes.get(filePath) === cached) transcriptIndexes.delete(filePath);
		throw error;
	}).finally(() => {
		cached.pending = void 0;
	});
}
/** Read selected payloads in bounded asynchronous batches; the cache owns no payload objects. */
async function readIndexedTranscriptEntries(filePath, index, selected, sessionId) {
	const handle = await fs.promises.open(filePath, "r");
	try {
		assertArchiveTranscriptSource(filePath, await handle.stat(), index.displaySource, sessionId);
		const physical = selected.map((entry, order) => ({
			entry,
			order
		})).toSorted((left, right) => left.entry.offset - right.entry.offset);
		const result = [];
		for (let start = 0; start < physical.length;) {
			const first = physical[start].entry;
			let end = start + 1;
			let byteEnd = first.offset + first.length;
			while (end < physical.length) {
				const next = physical[end].entry;
				if (next.offset + next.length - first.offset > ARCHIVE_BATCH_BYTES) break;
				byteEnd = Math.max(byteEnd, next.offset + next.length);
				end++;
			}
			const buffer = Buffer.allocUnsafe(byteEnd - first.offset);
			if (await readFileWindowFully(handle, buffer, first.offset) !== buffer.length) throw new SessionTranscriptProjectionUnavailableError(sessionId);
			for (let position = start; position < end; position++) {
				const { entry, order } = physical[position];
				const relative = entry.offset - first.offset;
				const parsed = parseTranscriptRecord(buffer.toString("utf8", relative, relative + entry.length));
				if (!parsed) throw new SessionTranscriptProjectionUnavailableError(sessionId);
				result[order] = {
					...entry,
					...parsed
				};
			}
			start = end;
		}
		assertArchiveTranscriptSource(filePath, await handle.stat(), index.displaySource, sessionId);
		return result;
	} finally {
		await handle.close();
	}
}
async function acquireTranscriptIndex(filePath) {
	const stat = await fs.promises.stat(filePath).catch(() => null);
	if (!stat?.isFile()) {
		transcriptIndexes.delete(filePath);
		return null;
	}
	const identity = transcriptArtifactDisplaySource(filePath, stat);
	let cached = transcriptIndexes.get(filePath);
	if (cached?.identity !== identity) cached = {
		identity,
		size: stat.size,
		largestLine: 0,
		preparation: {
			offset: 0,
			lineOffset: 0,
			length: 0,
			afterCr: false,
			fragments: [],
			records: [],
			rawSeqById: /* @__PURE__ */ new Map()
		}
	};
	transcriptIndexes.delete(filePath);
	transcriptIndexes.set(filePath, cached);
	pruneMapToMaxSize(transcriptIndexes, MAX_TRANSCRIPT_INDEXES);
	return cached;
}
/** One source call prepares at most one page; pending callers never join an unbounded reader. */
async function prepareSessionTranscriptIndex(filePath, sessionId) {
	const cached = await acquireTranscriptIndex(filePath);
	if (!cached) return null;
	try {
		assertSourceLineBound(cached.largestLine);
		if (cached.pending) return { displaySource: cached.identity };
		if (cached.value) return {
			displaySource: cached.identity,
			index: cached.value
		};
		await advanceTranscriptIndex(filePath, cached, sessionId, true);
		assertSourceLineBound(cached.largestLine);
		return { displaySource: cached.identity };
	} catch (error) {
		if (!cached.value && !cached.pending && transcriptIndexes.get(filePath) === cached) transcriptIndexes.delete(filePath);
		throw error;
	}
}
async function readSessionTranscriptIndex(filePath, sessionId) {
	const cached = await acquireTranscriptIndex(filePath);
	if (!cached) return null;
	while (!cached.value || cached.pending) await advanceTranscriptIndex(filePath, cached, sessionId, false);
	return cached.value;
}
//#endregion
//#region src/gateway/session-transcript-archive-reader.ts
const RECENT_SESSION_MESSAGES_DEFAULT_MAX_BYTES = 8388608;
function normalizeRecentSessionReadOptions(opts) {
	const maxMessages = resolveNonNegativeIntegerOption(opts?.maxMessages, 0);
	return {
		maxMessages,
		maxBytes: resolveIntegerOption(opts?.maxBytes, RECENT_SESSION_MESSAGES_DEFAULT_MAX_BYTES, { min: 1024 }),
		maxLines: resolveIntegerOption(opts?.maxLines, maxMessages * 20 + 20, { min: maxMessages })
	};
}
async function readRecentSessionSnapshotFromPathAsync(filePath, opts, index, sessionId) {
	if (opts.maxMessages === 0) return {
		messages: [],
		transcriptEvents: []
	};
	const { maxBytes, maxLines } = opts;
	const handle = await fs.promises.open(filePath, "r");
	let lines;
	try {
		const stat = await handle.stat();
		assertArchiveTranscriptSource(filePath, stat, index.displaySource, sessionId);
		const readLen = Math.min(stat.size, maxBytes);
		const readStart = Math.max(0, stat.size - readLen);
		const buffer = Buffer.alloc(readLen);
		const bytesRead = await readFileWindowFully(handle, buffer, readStart);
		assertArchiveTranscriptSource(filePath, await handle.stat(), index.displaySource, sessionId);
		if (bytesRead <= 0) return {
			messages: [],
			transcriptEvents: []
		};
		lines = buffer.toString("utf-8", 0, bytesRead).split(/\r?\n/).slice(readStart > 0 ? 1 : 0).filter((line) => line.trim().length > 0).slice(-maxLines);
	} finally {
		await handle.close();
	}
	return parseRecentTranscriptTailSnapshot(lines, opts.maxMessages, index);
}
function parseRecentTranscriptTailSnapshot(lines, maxMessages, index) {
	const selected = selectArchiveTranscriptEntries(lines.flatMap((line) => {
		const entry = parseTranscriptRecord(line);
		return entry ? [entry] : [];
	}), true);
	const recent = selected.filter((entry) => isVisibleTranscriptRecord(entry.record)).slice(-maxMessages);
	const firstSeq = Math.max(1, index.entries.length - recent.length + 1);
	return {
		messages: recent.flatMap((entry, offset) => {
			const indexed = entry.id ? index.byId.get(entry.id) : void 0;
			const message = projectTranscriptEntryMessage(entry.record, indexed?.seq ?? firstSeq + offset, indexed?.transcriptPosition);
			return message ? [message] : [];
		}),
		transcriptEvents: selected.map((entry) => entry.record)
	};
}
/** Reads retained reset archives after the caller has selected its SQLite fallback. */
var ArchivedTranscriptReader = class {
	constructor(scope) {
		this.scope = scope;
	}
	async resolvePath() {
		if (this.scope.exactArchivePath) {
			const exactPath = this.scope.exactArchivePath;
			if ((await fs.promises.stat(exactPath).catch(() => null))?.isFile()) return await materializeSessionArchiveForRead(exactPath);
			return null;
		}
		const archives = await resolveSessionTranscriptResetArchiveCandidatesAsync(this.scope.sessionId, this.scope.storePath, this.scope.sessionFile, this.scope.agentId);
		for (const archivePath of archives) {
			if (!(await fs.promises.stat(archivePath).catch(() => null))?.isFile()) continue;
			try {
				return await materializeSessionArchiveForRead(archivePath);
			} catch (error) {
				if (hasErrnoCode(error, "ERR_BUFFER_TOO_LARGE")) throw error;
				continue;
			}
		}
		return null;
	}
	async readSourcePage(opts, snapshot) {
		const cursor = opts.cursor?.kind === "archive" ? opts.cursor : void 0;
		const filePath = cursor?.path ?? await this.resolvePath();
		const nextBranch = opts.includeOffPathMessages && snapshot.indexedSeq >= 0 ? {
			kind: "off-path",
			snapshot,
			position: -1,
			messageSeq: snapshot.totalMessages
		} : void 0;
		if (!filePath) return {
			messages: [],
			nextCursor: nextBranch
		};
		const prepared = await prepareSessionTranscriptIndex(filePath, this.scope.sessionId);
		if (cursor && prepared?.displaySource !== cursor.source) throw new Error("Transcript archive changed during source pagination; retry the read");
		const start = cursor?.position ?? 0;
		if (prepared && !prepared.index) return {
			messages: [],
			transcriptPath: filePath,
			nextCursor: {
				kind: "archive",
				snapshot,
				position: start,
				messageSeq: 0,
				path: filePath,
				source: prepared.displaySource
			}
		};
		const index = prepared?.index;
		let end = start;
		let bytes = 0;
		if (index) while (end < index.entries.length && end - start < 128) {
			const size = index.entries[end].length;
			if (bytes + size > 8388608) break;
			bytes += size;
			end++;
		}
		return {
			messages: index ? (await readIndexedTranscriptEntries(filePath, index, index.entries.slice(start, end), this.scope.sessionId)).flatMap(indexedTranscriptEntryToMessages) : [],
			transcriptPath: filePath,
			nextCursor: index && end < index.entries.length ? {
				kind: "archive",
				snapshot,
				position: end,
				messageSeq: 0,
				path: filePath,
				source: index.displaySource
			} : nextBranch
		};
	}
	async readById(messageId, historyVisibility) {
		const filePath = await this.resolvePath();
		if (!filePath) return {
			oversized: false,
			found: false
		};
		const index = await readSessionTranscriptIndex(filePath, this.scope.sessionId);
		const selected = index?.byId.get(messageId);
		if (!index || !selected) return {
			oversized: false,
			found: false
		};
		const [entry] = await readIndexedTranscriptEntries(filePath, index, [selected], this.scope.sessionId);
		if (!entry) return {
			oversized: false,
			found: false
		};
		const oversized = entry.byteLength > 262144 && (entry.recoveredImageData !== true || jsonUtf8Bytes(entry.record) > 262144);
		if (oversized && !historyVisibility) return {
			oversized: true,
			found: true,
			seq: entry.seq
		};
		const message = indexedTranscriptEntryToMessage(entry);
		const preceding = historyVisibility && isPreSessionStartAssistantMessage(message, historyVisibility.sessionStartedAt) ? index.entries[entry.seq - 2] : void 0;
		const previous = preceding ? (await readIndexedTranscriptEntries(filePath, index, [preceding], this.scope.sessionId))[0] : void 0;
		return {
			message,
			seq: entry.seq,
			oversized,
			found: true,
			...historyVisibility ? { historyContext: {
				transcriptPath: filePath,
				displaySource: index.displaySource,
				...previous ? { precedingMessage: indexedTranscriptEntryToMessage(previous) } : {}
			} } : {}
		};
	}
	async readMessageCandidatesById(messageId) {
		const filePath = await this.resolvePath();
		if (!filePath) return [];
		const index = await readSessionTranscriptIndex(filePath, this.scope.sessionId);
		if (!index) return [];
		return (await readIndexedTranscriptEntries(filePath, index, index.entries.filter((entry) => entry.rawId === void 0 || entry.rawId === messageId), this.scope.sessionId)).flatMap(indexedTranscriptEntryToMessages);
	}
	async readRecentWithStats(opts) {
		const filePath = await this.resolvePath();
		if (!filePath) return {
			messages: [],
			totalMessages: 0
		};
		const transcriptIndex = await readSessionTranscriptIndex(filePath, this.scope.sessionId);
		const totalMessages = transcriptIndex?.entries.length ?? 0;
		const normalized = normalizeRecentSessionReadOptions(opts);
		const snapshot = !transcriptIndex ? {
			messages: [],
			transcriptEvents: []
		} : await readRecentSessionSnapshotFromPathAsync(filePath, normalized, transcriptIndex, this.scope.sessionId);
		return {
			displaySource: transcriptIndex?.displaySource,
			messages: snapshot.messages,
			transcriptEvents: snapshot.transcriptEvents,
			totalMessages,
			transcriptPath: filePath,
			transcriptSource: "reset-archive"
		};
	}
	async readPage(opts) {
		const filePath = await this.resolvePath();
		if (!filePath) return {
			messages: [],
			totalMessages: 0
		};
		const index = await readSessionTranscriptIndex(filePath, this.scope.sessionId);
		if (!index) return {
			messages: [],
			totalMessages: 0,
			transcriptPath: filePath
		};
		const totalMessages = index.entries.length;
		const endExclusive = resolveTranscriptPageEnd(totalMessages, opts);
		let snapshot;
		if (opts.recentAtHead && endExclusive === totalMessages) snapshot = await readRecentSessionSnapshotFromPathAsync(filePath, normalizeRecentSessionReadOptions(opts.recentAtHead), index, this.scope.sessionId);
		else {
			const start = Math.max(0, endExclusive - resolveNonNegativeIntegerOption(opts.maxMessages, 0));
			const entries = await readIndexedTranscriptEntries(filePath, index, index.entries.slice(start, endExclusive), this.scope.sessionId);
			snapshot = {
				messages: entries.flatMap(indexedTranscriptEntryToMessages),
				transcriptEvents: entries.map((entry) => entry.record)
			};
		}
		return {
			displaySource: index.displaySource,
			messages: snapshot.messages,
			transcriptEvents: snapshot.transcriptEvents,
			totalMessages,
			transcriptPath: filePath,
			transcriptSource: "reset-archive"
		};
	}
	async readAroundId(opts) {
		let displaySource;
		const candidates = this.scope.exactArchivePath ? [this.scope.exactArchivePath] : await resolveSessionTranscriptResetArchiveCandidatesAsync(this.scope.sessionId, this.scope.storePath, this.scope.sessionFile, this.scope.agentId);
		for (const archivePath of candidates) {
			let filePath;
			try {
				filePath = await materializeSessionArchiveForRead(archivePath);
			} catch (error) {
				if (hasErrnoCode(error, "ERR_BUFFER_TOO_LARGE")) throw error;
				continue;
			}
			const index = await readSessionTranscriptIndex(filePath, this.scope.sessionId);
			if (!index) continue;
			displaySource ??= index.displaySource;
			const anchorIndex = index.entries.findIndex((entry) => entry.id === opts.messageId);
			if (anchorIndex < 0) continue;
			const range = resolveHistoryAnchorPageRange(index.entries.length, anchorIndex, opts);
			const entries = await readIndexedTranscriptEntries(filePath, index, index.entries.slice(range.readStart, range.endExclusive), this.scope.sessionId);
			return {
				displaySource: index.displaySource,
				found: true,
				hasOverreadContext: range.hasOverreadContext,
				messages: entries.flatMap(indexedTranscriptEntryToMessages),
				offset: range.offset,
				totalMessages: index.entries.length,
				transcriptPath: filePath,
				transcriptSource: "reset-archive"
			};
		}
		return {
			displaySource,
			found: false,
			hasOverreadContext: false,
			messages: [],
			offset: 0,
			totalMessages: 0
		};
	}
};
function indexedTranscriptEntryToMessage(entry) {
	return projectTranscriptEntryMessage(entry.record, entry.seq, entry.transcriptPosition);
}
function indexedTranscriptEntryToMessages(entry) {
	const message = indexedTranscriptEntryToMessage(entry);
	return message ? [message] : [];
}
//#endregion
export { ArchivedTranscriptReader as t };
