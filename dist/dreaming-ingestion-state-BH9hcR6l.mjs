import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
//#region extensions/memory-core/src/dreaming-ingestion-state.ts
const DAILY_MEMORY_FILENAME_RE = /^(\d{4}-\d{2}-\d{2})(?:-[^/]+)?\.md$/i;
function parseDailyMemoryFileName(fileName) {
	const day = fileName.match(DAILY_MEMORY_FILENAME_RE)?.[1];
	return day ? {
		fileName,
		day,
		canonical: fileName.toLowerCase() === `${day}.md`
	} : null;
}
function compareDailyMemoryFilesByNewestDay(left, right) {
	const dayOrder = right.day.localeCompare(left.day);
	if (dayOrder !== 0) return dayOrder;
	if (left.canonical !== right.canonical) return left.canonical ? -1 : 1;
	return left.fileName.localeCompare(right.fileName);
}
const MEMORY_DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const SESSION_INGESTION_MAX_TRACKED_MESSAGES_PER_SESSION = 4096;
function normalizeMemoryDay(value) {
	if (typeof value !== "string") return;
	const day = value.trim();
	return MEMORY_DAY_RE.test(day) ? day : void 0;
}
function normalizeDailyIngestionState(raw) {
	const record = asNullableRecord(raw);
	const filesRaw = asNullableRecord(record?.files);
	if (!filesRaw) return {
		version: 1,
		files: {}
	};
	const files = {};
	for (const [key, value] of Object.entries(filesRaw)) {
		const file = asNullableRecord(value);
		if (!file || typeof key !== "string" || key.trim().length === 0) continue;
		const mtimeMs = Number(file.mtimeMs);
		const size = Number(file.size);
		if (!Number.isFinite(mtimeMs) || mtimeMs < 0 || !Number.isFinite(size) || size < 0) continue;
		const lastDreamingDayIngested = normalizeMemoryDay(file.lastDreamingDayIngested);
		files[key] = {
			mtimeMs: Math.floor(mtimeMs),
			size: Math.floor(size),
			...lastDreamingDayIngested ? { lastDreamingDayIngested } : {}
		};
	}
	return {
		version: 1,
		files
	};
}
function normalizeSessionIngestionState(raw) {
	const record = asNullableRecord(raw);
	const filesRaw = asNullableRecord(record?.files);
	const files = {};
	if (filesRaw) for (const [key, value] of Object.entries(filesRaw)) {
		const file = asNullableRecord(value);
		if (!file || key.trim().length === 0) continue;
		const mtimeMs = Number(file.mtimeMs);
		const size = Number(file.size);
		if (!Number.isFinite(mtimeMs) || mtimeMs < 0 || !Number.isFinite(size) || size < 0) continue;
		const lineCountRaw = Number(file.lineCount);
		const lastContentLineRaw = Number(file.lastContentLine);
		const lineCount = Number.isFinite(lineCountRaw) && lineCountRaw >= 0 ? Math.floor(lineCountRaw) : 0;
		const lastContentLine = Number.isFinite(lastContentLineRaw) && lastContentLineRaw >= 0 ? Math.floor(lastContentLineRaw) : 0;
		files[key] = {
			mtimeMs: Math.floor(mtimeMs),
			size: Math.floor(size),
			contentHash: typeof file.contentHash === "string" ? file.contentHash.trim() : "",
			lineCount,
			lastContentLine: Math.min(lineCount, lastContentLine),
			...typeof file.excludedReason === "string" && file.excludedReason.trim() ? { excludedReason: file.excludedReason.trim() } : {}
		};
	}
	const seenMessagesRaw = asNullableRecord(record?.seenMessages);
	const seenMessages = {};
	if (seenMessagesRaw) for (const [scope, value] of Object.entries(seenMessagesRaw)) {
		if (scope.trim().length === 0 || !Array.isArray(value)) continue;
		const unique = normalizeStringEntries([...new Set(value.filter((entry) => typeof entry === "string"))]).slice(-4096);
		if (unique.length > 0) seenMessages[scope] = unique;
	}
	return {
		version: 3,
		files,
		seenMessages
	};
}
//#endregion
export { normalizeMemoryDay as a, normalizeDailyIngestionState as i, SESSION_INGESTION_MAX_TRACKED_MESSAGES_PER_SESSION as n, normalizeSessionIngestionState as o, compareDailyMemoryFilesByNewestDay as r, parseDailyMemoryFileName as s, DAILY_MEMORY_FILENAME_RE as t };
