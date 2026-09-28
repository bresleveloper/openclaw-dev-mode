import { M as resolveNonNegativeIntegerOption, j as resolveIntegerOption } from "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { m as readNonBlankString } from "./string-coerce-CIXf7egm.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { t as readFileWindowFully } from "./file-read-Csm265gq.mjs";
import { v as materializeSessionArchiveForRead } from "./artifacts-C9weQ_MG.mjs";
import { r as jsonUtf8Bytes } from "./json-utf8-bytes-fm9i4b7G.mjs";
import { u as selectSessionTranscriptActiveEntries } from "./transcript-tree-3xvvNd9-.mjs";
import { t as SessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-CuzwVnKb.mjs";
import { i as readNestedToolActivity } from "./nested-tool-activity-Cz_FrJ3z.mjs";
import { a as resolveSessionTranscriptCandidates, o as resolveSessionTranscriptResetArchiveCandidatesAsync } from "./session-transcript-files.fs-_FnqN2Le.mjs";
import { n as resolveTranscriptPageEnd, t as resolveHistoryAnchorPageRange } from "./transcript-anchor-page-VHli4oQ1.mjs";
import { t as isVisibleTranscriptRecord } from "./transcript-visible-record-DJ7_H34d.mjs";
import { n as projectTranscriptEntryMessage } from "./session-transcript-entry-message-COJ0koI7.mjs";
import { n as createTranscriptDisplaySource, t as createTranscriptDisplayPositionFromActivity } from "./transcript-display-position-BHW0T3ai.mjs";
import fs from "node:fs";
//#region src/gateway/session-transcript-json.ts
/** Reads a nonblank transcript field while preserving its original whitespace. */
function readNonBlankStringPreservingWhitespace(value) {
	return readNonBlankString(value);
}
const TRANSCRIPT_FIELD_REGEX_CACHE = /* @__PURE__ */ new Map();
function getTranscriptFieldRegexes(field) {
	let cached = TRANSCRIPT_FIELD_REGEX_CACHE.get(field);
	if (!cached) {
		const escapedField = escapeRegExp(field);
		cached = {
			stringRe: new RegExp(`"${escapedField}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`),
			nullRe: new RegExp(`"${escapedField}"\\s*:\\s*null`),
			numberRe: new RegExp(`"${escapedField}"\\s*:\\s*(-?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)`)
		};
		TRANSCRIPT_FIELD_REGEX_CACHE.set(field, cached);
	}
	return cached;
}
function extractJsonStringFieldPrefix(prefix, field) {
	const match = getTranscriptFieldRegexes(field).stringRe.exec(prefix);
	if (!match) return;
	try {
		return readNonBlankStringPreservingWhitespace(JSON.parse(`"${match[1]}"`));
	} catch {
		return;
	}
}
function extractJsonNullableStringFieldPrefix(prefix, field) {
	if (getTranscriptFieldRegexes(field).nullRe.test(prefix)) return null;
	return extractJsonStringFieldPrefix(prefix, field);
}
function extractJsonNumberFieldPrefix(prefix, field) {
	const match = getTranscriptFieldRegexes(field).numberRe.exec(prefix);
	if (!match) return;
	const decoded = Number(match[1]);
	return Number.isFinite(decoded) ? decoded : void 0;
}
//#endregion
//#region src/gateway/session-transcript-record-parser.ts
const MAX_TRANSCRIPT_PARSE_LINE_BYTES = 262144;
const OVERSIZED_TRANSCRIPT_METADATA_PREFIX_CHARS = 65536;
const OVERSIZED_TRANSCRIPT_METADATA_SUFFIX_CHARS = 65536;
const MAX_OVERSIZED_TRANSCRIPT_RECOVERY_CANDIDATES = 32;
const TRANSCRIPT_OVERSIZED_MESSAGE_PLACEHOLDER = "[chat.history omitted: message too large]";
function isOversizedTranscriptLine(line) {
	return Buffer.byteLength(line, "utf8") > MAX_TRANSCRIPT_PARSE_LINE_BYTES;
}
function isJsonObjectFieldToken(source, tokenIndex) {
	for (let index = tokenIndex - 1; index >= 0; index--) {
		const char = source.charAt(index);
		if (/\s/.test(char)) continue;
		return char === "{" || char === ",";
	}
	return true;
}
function extractJsonStringFieldWindow(source, field, startIndex = 0, endIndex = source.length) {
	const fieldToken = JSON.stringify(field);
	let searchIndex = startIndex;
	while (searchIndex < endIndex) {
		const tokenIndex = source.indexOf(fieldToken, searchIndex);
		if (tokenIndex < 0 || tokenIndex >= endIndex) return;
		searchIndex = tokenIndex + fieldToken.length;
		if (!isJsonObjectFieldToken(source, tokenIndex)) continue;
		const match = /^\s*:\s*"((?:\\.|[^"\\])*)"/.exec(source.slice(searchIndex, endIndex));
		if (!match) continue;
		try {
			return readNonBlankStringPreservingWhitespace(JSON.parse(`"${match[1]}"`));
		} catch {
			return;
		}
	}
}
function extractJsonStringFieldSuffix(source, field) {
	return extractJsonStringFieldWindow(source, field, Math.max(0, source.length - OVERSIZED_TRANSCRIPT_METADATA_SUFFIX_CHARS));
}
function recoverOversizedMultimodalTranscriptRecord(line, byteLength) {
	const markerPrefix = "__openclaw_omitted_image_";
	if (line.includes(markerPrefix)) return;
	const payloads = [];
	const dataPattern = /"data"\s*:\s*"/g;
	let scannedCandidates = 0;
	for (let dataMatch = dataPattern.exec(line); dataMatch; dataMatch = dataPattern.exec(line)) {
		if (!isJsonObjectFieldToken(line, dataMatch.index)) continue;
		if (++scannedCandidates > MAX_OVERSIZED_TRANSCRIPT_RECOVERY_CANDIDATES) return;
		const start = dataMatch.index + dataMatch[0].length;
		let end = start;
		let padding = 0;
		let valid = true;
		for (; end < line.length && line.charCodeAt(end) !== 34; end++) {
			const code = line.charCodeAt(end);
			if (code === 92) {
				valid = false;
				end++;
				continue;
			}
			if (!valid) continue;
			if (code === 61) {
				if (++padding > 2) valid = false;
			} else if (padding > 0 || ((code | 32) < 97 || (code | 32) > 122) && (code < 48 || code > 57) && code !== 43 && code !== 47) valid = false;
		}
		if (end >= line.length) return;
		dataPattern.lastIndex = end + 1;
		if (!valid || (end - start) % 4 !== 0) continue;
		payloads.push({
			start,
			end,
			marker: `${markerPrefix}${payloads.length}__`,
			bytes: (end - start) * 3 / 4 - padding
		});
	}
	if (payloads.length === 0) return;
	try {
		const parseBoundedRedaction = (selected) => {
			const bytes = selected.reduce((remaining, payload) => remaining - (payload.end - payload.start - payload.marker.length), byteLength);
			if (selected.length === 0 || bytes > 262144) return;
			let cursor = 0;
			const parts = [];
			for (const payload of selected) {
				parts.push(line.slice(cursor, payload.start), payload.marker);
				cursor = payload.end;
			}
			parts.push(line.slice(cursor));
			const markers = new Set(selected.map((payload) => payload.marker));
			const parsed = JSON.parse(parts.join(""), (_key, value) => {
				if (typeof value === "string" && value.startsWith(markerPrefix) && !markers.delete(value)) throw new Error("invalid transcript image recovery marker");
				return value;
			});
			if (markers.size > 0 || !isRecord(parsed)) return;
			return parsed;
		};
		const imageDataOwners = (block) => {
			const source = asOptionalRecord(block.source);
			return source?.type === "base64" ? [block, source] : [block];
		};
		const preview = parseBoundedRedaction(payloads);
		const previewContent = asOptionalRecord(preview?.message)?.content;
		if (!Array.isArray(previewContent)) return;
		const payloadByMarker = new Map(payloads.map((payload) => [payload.marker, payload]));
		const imageMarkers = /* @__PURE__ */ new Set();
		for (const candidate of previewContent) {
			if (!isRecord(candidate) || candidate.type !== "image") continue;
			for (const owner of imageDataOwners(candidate)) {
				if (typeof owner.data !== "string") continue;
				if (!payloadByMarker.has(owner.data) || imageMarkers.has(owner.data)) return;
				imageMarkers.add(owner.data);
			}
		}
		if (imageMarkers.size === 0) return;
		const imagePayloads = payloads.filter((payload) => imageMarkers.has(payload.marker));
		const record = parseBoundedRedaction(imagePayloads);
		const content = asOptionalRecord(record?.message)?.content;
		if (!record || !Array.isArray(content)) return;
		const remaining = new Map(imagePayloads.map((payload) => [payload.marker, payload]));
		for (const block of content) {
			if (!isRecord(block) || block.type !== "image") continue;
			let imageBytes;
			for (const owner of imageDataOwners(block)) {
				if (typeof owner.data !== "string") continue;
				const payload = remaining.get(owner.data);
				if (!payload) return;
				remaining.delete(payload.marker);
				imageBytes ??= payload.bytes;
				delete owner.data;
			}
			if (imageBytes !== void 0) {
				block.omitted = true;
				block.bytes = imageBytes;
			}
		}
		return remaining.size === 0 && jsonUtf8Bytes(record) <= 262144 ? record : void 0;
	} catch {
		return;
	}
}
function parseTranscriptRecord(line) {
	const byteLength = Buffer.byteLength(line, "utf8");
	const oversized = byteLength > MAX_TRANSCRIPT_PARSE_LINE_BYTES;
	const recoveredRecord = oversized ? recoverOversizedMultimodalTranscriptRecord(line, byteLength) : void 0;
	if (!oversized || recoveredRecord) try {
		const record = recoveredRecord ?? JSON.parse(line);
		if (!isRecord(record)) return null;
		const id = readNonBlankStringPreservingWhitespace(record.id);
		return {
			byteLength,
			...id ? { id } : {},
			...recoveredRecord ? { recoveredImageData: true } : {},
			record
		};
	} catch {
		return null;
	}
	const prefix = line.slice(0, OVERSIZED_TRANSCRIPT_METADATA_PREFIX_CHARS);
	const messageMatch = /"message"\s*:/.exec(prefix);
	const recordPrefix = messageMatch ? prefix.slice(0, messageMatch.index) : prefix;
	const id = extractJsonStringFieldPrefix(prefix, "id");
	const parentId = extractJsonNullableStringFieldPrefix(prefix, "parentId");
	const type = extractJsonStringFieldPrefix(prefix, "type");
	const timestamp = extractJsonStringFieldPrefix(recordPrefix, "timestamp") ?? extractJsonNumberFieldPrefix(recordPrefix, "timestamp");
	const role = extractJsonStringFieldPrefix(prefix, "role") ?? "assistant";
	const idempotencyKey = extractJsonStringFieldPrefix(prefix, "idempotencyKey") ?? extractJsonStringFieldSuffix(line, "idempotencyKey");
	const record = {
		...type ? { type } : {},
		...id ? { id } : {},
		...parentId !== void 0 ? { parentId } : {},
		...timestamp !== void 0 ? { timestamp } : {},
		message: {
			role,
			...idempotencyKey ? { idempotencyKey } : {},
			content: [{
				type: "text",
				text: TRANSCRIPT_OVERSIZED_MESSAGE_PLACEHOLDER
			}],
			__openclaw: {
				truncated: true,
				reason: "oversized"
			}
		}
	};
	return {
		byteLength,
		...id ? { id } : {},
		record
	};
}
//#endregion
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
async function* readArchiveLines(filePath, handle) {
	const stream = fs.createReadStream(filePath, {
		fd: handle,
		autoClose: false,
		highWaterMark: ARCHIVE_READ_BYTES
	});
	let offset = 0;
	let length = 0;
	let afterCr = false;
	const fragments = [];
	try {
		for await (const chunk of stream) {
			let start = 0;
			if (afterCr && chunk[0] === 10) {
				start = 1;
				offset++;
			}
			afterCr = false;
			while (start < chunk.length) {
				const lf = chunk.indexOf(10, start);
				const cr = chunk.indexOf(13, start);
				const end = lf < 0 ? cr : cr < 0 ? lf : Math.min(lf, cr);
				if (end < 0) {
					fragments.push(chunk.subarray(start));
					length += chunk.length - start;
					break;
				}
				const last = chunk.subarray(start, end);
				length += last.length;
				yield {
					line: (fragments.length ? Buffer.concat([...fragments, last], length) : last).toString("utf8"),
					offset,
					length
				};
				fragments.length = 0;
				offset += length + 1;
				length = 0;
				start = end + 1;
				if (chunk[end] === 13) {
					if (chunk[start] === 10) {
						start++;
						offset++;
					} else afterCr = start === chunk.length;
				}
			}
		}
		if (length > 0) yield {
			line: Buffer.concat(fragments, length).toString("utf8"),
			offset,
			length
		};
	} finally {
		if (!stream.readableEnded) stream.destroy();
	}
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
async function buildSessionTranscriptIndex(filePath, displaySource, sessionId) {
	const records = [];
	const rawSeqById = /* @__PURE__ */ new Map();
	const handle = await fs.promises.open(filePath, "r");
	try {
		assertArchiveTranscriptSource(filePath, await handle.stat(), displaySource, sessionId);
		for await (const { line, offset, length } of readArchiveLines(filePath, handle)) {
			if (!line.trim()) continue;
			const record = parseTranscriptRecord(line);
			if (record) {
				const rawSeq = records.length + 1;
				const activity = readNestedToolActivity(record.record.message)?.details;
				records.push({
					...record,
					record: archiveNavigationRecord(record.record),
					rawSeq,
					offset,
					length,
					...activity ? { activity: {
						afterEntryId: activity.afterEntryId,
						scopeId: activity.scopeId,
						startOrder: activity.startOrder
					} } : {}
				});
				if (record.id) rawSeqById.set(record.id, rawSeq);
			}
		}
		assertArchiveTranscriptSource(filePath, await handle.stat(), displaySource, sessionId);
	} finally {
		await handle.close();
	}
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
async function readSessionTranscriptIndex(filePath, sessionId) {
	const stat = await fs.promises.stat(filePath).catch(() => null);
	if (!stat?.isFile()) {
		transcriptIndexes.delete(filePath);
		return null;
	}
	const identity = transcriptArtifactDisplaySource(filePath, stat);
	let cached = transcriptIndexes.get(filePath);
	if (cached?.identity !== identity) cached = {
		identity,
		value: buildSessionTranscriptIndex(filePath, identity, sessionId)
	};
	transcriptIndexes.delete(filePath);
	transcriptIndexes.set(filePath, cached);
	pruneMapToMaxSize(transcriptIndexes, MAX_TRANSCRIPT_INDEXES);
	try {
		return await cached.value;
	} catch (error) {
		if (transcriptIndexes.get(filePath) === cached) transcriptIndexes.delete(filePath);
		throw error;
	}
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
async function readRecentTranscriptTailLinesAsync(filePath, opts, displaySource, sessionId) {
	const { maxBytes, maxLines } = normalizeRecentSessionReadOptions(opts);
	const handle = await fs.promises.open(filePath, "r");
	try {
		const stat = await handle.stat();
		assertArchiveTranscriptSource(filePath, stat, displaySource, sessionId);
		const readLen = Math.min(stat.size, maxBytes);
		const readStart = Math.max(0, stat.size - readLen);
		const buffer = Buffer.alloc(readLen);
		const bytesRead = await readFileWindowFully(handle, buffer, readStart);
		assertArchiveTranscriptSource(filePath, await handle.stat(), displaySource, sessionId);
		if (bytesRead <= 0) return [];
		return buffer.toString("utf-8", 0, bytesRead).split(/\r?\n/).slice(readStart > 0 ? 1 : 0).filter((line) => line.trim().length > 0).slice(-maxLines);
	} finally {
		await handle.close();
	}
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
function findExistingTranscriptPath(sessionId, storePath, sessionFile, agentId) {
	return resolveSessionTranscriptCandidates(sessionId, storePath, sessionFile, agentId).find((value) => fs.existsSync(value)) ?? null;
}
/** Reads retained reset archives after the caller has selected its SQLite fallback. */
var ArchivedTranscriptReader = class {
	constructor(scope) {
		this.scope = scope;
	}
	async resolvePath() {
		const archives = await resolveSessionTranscriptResetArchiveCandidatesAsync(this.scope.sessionId, this.scope.storePath, this.scope.sessionFile, this.scope.agentId);
		for (const archivePath of archives) {
			if (!(await fs.promises.stat(archivePath).catch(() => null))?.isFile()) continue;
			try {
				return materializeSessionArchiveForRead(archivePath);
			} catch {
				continue;
			}
		}
		return null;
	}
	async read(opts) {
		if (opts.mode === "recent") {
			const snapshot = await this.readRecentWithStats(opts);
			return {
				messages: snapshot.messages,
				transcriptPath: snapshot.transcriptPath
			};
		}
		const filePath = await this.resolvePath();
		if (!filePath) return { messages: [] };
		const index = await readSessionTranscriptIndex(filePath, this.scope.sessionId);
		return {
			messages: index ? (await readIndexedTranscriptEntries(filePath, index, index.entries, this.scope.sessionId)).flatMap(indexedTranscriptEntryToMessages) : [],
			transcriptPath: filePath
		};
	}
	async readById(messageId) {
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
		if (entry.byteLength > 262144 && (entry.recoveredImageData !== true || jsonUtf8Bytes(entry.record) > 262144)) return {
			oversized: true,
			found: true,
			seq: entry.seq
		};
		return {
			message: indexedTranscriptEntryToMessage(entry),
			seq: entry.seq,
			oversized: false,
			found: true
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
		for (const archivePath of await resolveSessionTranscriptResetArchiveCandidatesAsync(this.scope.sessionId, this.scope.storePath, this.scope.sessionFile, this.scope.agentId)) {
			let filePath;
			try {
				filePath = materializeSessionArchiveForRead(archivePath);
			} catch {
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
async function readRecentSessionSnapshotFromPathAsync(filePath, opts, index, sessionId) {
	if (opts.maxMessages === 0) return {
		messages: [],
		transcriptEvents: []
	};
	return parseRecentTranscriptTailSnapshot(await readRecentTranscriptTailLinesAsync(filePath, opts, index.displaySource, sessionId), opts.maxMessages, index);
}
function indexedTranscriptEntryToMessage(entry) {
	return projectTranscriptEntryMessage(entry.record, entry.seq, entry.transcriptPosition);
}
function indexedTranscriptEntryToMessages(entry) {
	const message = indexedTranscriptEntryToMessage(entry);
	return message ? [message] : [];
}
//#endregion
export { findExistingTranscriptPath as n, isOversizedTranscriptLine as r, ArchivedTranscriptReader as t };
