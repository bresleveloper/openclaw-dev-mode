import { m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { r as jsonUtf8Bytes } from "./json-utf8-bytes-C0-PtdPX.mjs";
//#region src/gateway/session-transcript-record-parser.ts
const MAX_TRANSCRIPT_PARSE_LINE_BYTES = 262144;
const OVERSIZED_TRANSCRIPT_METADATA_PREFIX_CHARS = 65536;
const OVERSIZED_TRANSCRIPT_METADATA_SUFFIX_CHARS = 65536;
const MAX_OVERSIZED_TRANSCRIPT_RECOVERY_CANDIDATES = 32;
const TRANSCRIPT_OVERSIZED_MESSAGE_PLACEHOLDER = "[chat.history omitted: message too large]";
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
	return readNonBlankString(safeParseJson(`"${match[1]}"`));
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
function isJsonObjectFieldToken(source, tokenIndex) {
	for (let index = tokenIndex - 1; index >= 0; index--) {
		const char = source.charAt(index);
		if (/\s/.test(char)) continue;
		return char === "{" || char === ",";
	}
	return true;
}
function extractJsonStringFieldSuffix(source, field) {
	const fieldToken = JSON.stringify(field);
	let searchIndex = Math.max(0, source.length - OVERSIZED_TRANSCRIPT_METADATA_SUFFIX_CHARS);
	while (searchIndex < source.length) {
		const tokenIndex = source.indexOf(fieldToken, searchIndex);
		if (tokenIndex < 0) return;
		searchIndex = tokenIndex + fieldToken.length;
		if (!isJsonObjectFieldToken(source, tokenIndex)) continue;
		const match = /^\s*:\s*"((?:\\.|[^"\\])*)"/.exec(source.slice(searchIndex));
		if (!match) continue;
		return readNonBlankString(safeParseJson(`"${match[1]}"`));
	}
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
		const id = readNonBlankString(record.id);
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
export { parseTranscriptRecord as n, MAX_TRANSCRIPT_PARSE_LINE_BYTES as t };
