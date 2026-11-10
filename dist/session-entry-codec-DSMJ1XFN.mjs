import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { Et as _enum, Jn as string, Kt as custom, Lt as boolean, Nt as array, Sn as looseObject, Yt as discriminatedUnion, kt as _null, or as union, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as string$1 } from "./coerce-D2Vs59dx.mjs";
//#region src/config/sessions/version.ts
/** Old transcripts retain their model projection; only new sessions select version 4. */
const CURRENT_SESSION_VERSION = 4;
//#endregion
//#region src/config/sessions/session-entry-codec.ts
const readableContentSchema = union([string(), array(looseObject({ type: string() }))]);
const readableMessageSchema = discriminatedUnion("role", [
	looseObject({
		role: literal("user"),
		content: readableContentSchema
	}),
	looseObject({
		role: literal("assistant"),
		content: readableContentSchema
	}),
	looseObject({
		role: literal("toolResult"),
		toolCallId: string(),
		toolName: string(),
		isError: boolean(),
		content: array(unknown())
	}),
	looseObject({
		role: literal("custom"),
		customType: string(),
		content: readableContentSchema
	}),
	looseObject({
		role: literal("bashExecution"),
		command: string(),
		output: string()
	})
]);
const indexedSessionEntryBaseShape = {
	id: string().min(1),
	parentId: union([string(), _null()]).optional(),
	timestamp: string().optional()
};
const indexedSessionEntrySchema = discriminatedUnion("type", [
	looseObject({
		...indexedSessionEntryBaseShape,
		type: literal("message"),
		message: readableMessageSchema
	}),
	looseObject({
		...indexedSessionEntryBaseShape,
		type: literal("thinking_level_change"),
		thinkingLevel: string().min(1)
	}),
	looseObject({
		...indexedSessionEntryBaseShape,
		type: literal("model_change"),
		provider: string().min(1),
		modelId: string().min(1)
	}),
	looseObject({
		...indexedSessionEntryBaseShape,
		type: literal("compaction"),
		summary: string(),
		firstKeptEntryId: string().min(1),
		tokensBefore: custom((value) => typeof value === "number")
	}),
	looseObject({
		...indexedSessionEntryBaseShape,
		type: literal("reset"),
		reason: string$1().pipe(_enum([
			"new",
			"reset",
			"idle",
			"daily",
			"cron-stale"
		])),
		firstKeptEntryId: string().optional()
	}),
	looseObject({
		...indexedSessionEntryBaseShape,
		type: literal("branch_summary"),
		fromId: string(),
		summary: string()
	}),
	looseObject({
		...indexedSessionEntryBaseShape,
		type: literal("custom"),
		customType: string().min(1)
	}),
	looseObject({
		...indexedSessionEntryBaseShape,
		type: literal("custom_message"),
		customType: string().min(1),
		content: readableContentSchema,
		display: boolean()
	}),
	looseObject({
		...indexedSessionEntryBaseShape,
		type: literal("label"),
		targetId: string().min(1),
		label: string().optional()
	}),
	looseObject({
		...indexedSessionEntryBaseShape,
		type: literal("session_info"),
		name: string().optional()
	})
]);
const sessionEntryTypeSchema = _enum(indexedSessionEntrySchema.options.flatMap((entry) => [...entry.shape.type.values]));
const parentLinkedOpaqueEntrySchema = looseObject({
	type: unknown().optional().refine((type) => type !== "session" && type !== "leaf"),
	id: string().min(1),
	parentId: union([string(), _null()])
});
const opaqueLeafEntrySchema = looseObject({
	type: literal("leaf"),
	id: string().min(1),
	parentId: union([string(), _null()]),
	targetId: union([string(), _null()]),
	appendParentId: union([string(), _null()]).optional(),
	appendMode: literal("side").optional()
});
const sessionHeaderSchema = looseObject({
	type: literal("session"),
	id: string()
});
function findSessionTranscriptHeader(entries) {
	for (const entry of entries) if (sessionHeaderSchema.safeParse(entry).success) return entry;
}
function assertCurrentSessionTranscriptHeader(header) {
	if ((header?.version ?? 1) < 3) throw new Error("Persisted legacy session transcripts require doctor/import migration before runtime use");
}
function isReadableSessionMessage(message) {
	return readableMessageSchema.safeParse(message).success;
}
function isIndexedSessionEntry(entry) {
	return indexedSessionEntrySchema.safeParse(entry).success;
}
function isReadableContent(value) {
	return readableContentSchema.safeParse(value).success;
}
function isReadableLegacySessionEntry(value) {
	const message = isRecord(value) && value.type === "message" ? value.message : void 0;
	return isRecord(value) && sessionEntryTypeSchema.safeParse(value.type).success && (value.type !== "message" || (isRecord(message) && message.role === "hookMessage" ? isReadableContent(message.content) : readableMessageSchema.safeParse(message).success));
}
function normalizePersistedLegacyHookMessage(value) {
	if (!isRecord(value) || value.type !== "message" || !isRecord(value.message)) return value;
	const message = value.message;
	if (message.role !== "custom" || message.customType !== void 0 || !isReadableContent(message.content)) return value;
	return {
		...value,
		message: {
			...message,
			customType: "hook"
		}
	};
}
function parseParentLinkedOpaqueEntry(record) {
	const parsed = parentLinkedOpaqueEntrySchema.safeParse(record);
	return parsed.success ? {
		id: parsed.data.id,
		parentId: parsed.data.parentId
	} : void 0;
}
function parseOpaqueLeafEntry(record) {
	const parsed = opaqueLeafEntrySchema.safeParse(record);
	if (!parsed.success) return;
	const leaf = parsed.data;
	return {
		id: leaf.id,
		parentId: leaf.parentId,
		targetId: leaf.targetId,
		...leaf.appendParentId !== void 0 ? { appendParentId: leaf.appendParentId } : {},
		...leaf.appendMode === "side" ? { appendMode: leaf.appendMode } : {}
	};
}
function classifySessionFileEntry(rawEntry, sourceVersion) {
	const entry = normalizePersistedLegacyHookMessage(rawEntry);
	if (sourceVersion < 3 && isReadableLegacySessionEntry(entry) || isIndexedSessionEntry(entry)) return {
		entry,
		recognized: true
	};
	return {
		entry,
		recognized: false
	};
}
function partitionSessionFileEntries(entries) {
	const fileEntries = [];
	const opaqueEntries = [];
	const fileEntriesByOriginalIndex = [];
	const header = findSessionTranscriptHeader(entries);
	const sourceVersion = header?.version ?? 1;
	let hasHeader = false;
	for (const [originalIndex, rawEntry] of entries.entries()) {
		if (!hasHeader && header !== void 0 && rawEntry === header) {
			fileEntries.push(header);
			fileEntriesByOriginalIndex[originalIndex] = header;
			hasHeader = true;
			continue;
		}
		const { entry, recognized } = classifySessionFileEntry(rawEntry, sourceVersion);
		if (recognized) {
			fileEntries.push(entry);
			fileEntriesByOriginalIndex[originalIndex] = entry;
			continue;
		}
		opaqueEntries.push({
			index: fileEntries.length,
			record: entry
		});
	}
	return {
		fileEntries,
		opaqueEntries,
		fileEntriesByOriginalIndex
	};
}
//#endregion
export { isReadableSessionMessage as a, partitionSessionFileEntries as c, isIndexedSessionEntry as i, CURRENT_SESSION_VERSION as l, classifySessionFileEntry as n, parseOpaqueLeafEntry as o, findSessionTranscriptHeader as r, parseParentLinkedOpaqueEntry as s, assertCurrentSessionTranscriptHeader as t };
