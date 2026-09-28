import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { Et as _enum, Fn as object, Jn as string, Kt as custom, Lt as boolean, Nt as array, Sn as looseObject, Yt as discriminatedUnion, kt as _null, or as union, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as string$1 } from "./coerce-D2Vs59dx.mjs";
import { c as prepareSqliteQueryTakeFirstSync, i as getNodeSqliteKysely, r as executeSqliteQueryTakeFirstSync, s as prepareSqliteQuerySync, u as sql } from "./kysely-sync-Bn6Qrpbz.mjs";
import { l as supportsNodeSqliteJsonb } from "./node-sqlite-BO6jRFcG.mjs";
import { t as resolveZstdCodec } from "./zstd-codec-C-vEb3Qf.mjs";
import { n as SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY, t as DEFAULT_MISSING_TOOL_RESULT_TEXT } from "./tool-result-pairing-Bky0eubt.mjs";
import { t as MODEL_CONTEXT_PRIVATE_METADATA_KEYS } from "./model-context-message-BQc0E7_M.mjs";
import { a as readSessionTranscriptRunId } from "./transcript-events-DukKauix.mjs";
//#region src/config/sessions/version.ts
/** Old transcripts retain their model projection; only new sessions select version 4. */
const CURRENT_SESSION_VERSION = 4;
//#endregion
//#region src/config/sessions/session-entry-codec.ts
const sessionEntryTypeSchema = _enum([
	"message",
	"thinking_level_change",
	"model_change",
	"compaction",
	"reset",
	"branch_summary",
	"custom",
	"custom_message",
	"label",
	"session_info"
]);
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
function isSessionEntryType(type) {
	return sessionEntryTypeSchema.safeParse(type).success;
}
function isIndexedSessionEntry(entry) {
	return indexedSessionEntrySchema.safeParse(entry).success;
}
function isReadableContent(value) {
	return readableContentSchema.safeParse(value).success;
}
function isReadableMessage(value) {
	return readableMessageSchema.safeParse(value).success;
}
function isReadableLegacySessionEntry(value) {
	const message = isRecord(value) && value.type === "message" ? value.message : void 0;
	return isRecord(value) && isSessionEntryType(value.type) && (value.type !== "message" || (isRecord(message) && message.role === "hookMessage" ? isReadableContent(message.content) : isReadableMessage(message)));
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
//#region src/config/sessions/session-model-context-projection.ts
/** Exclude storage-only fields in SQLite, before a row's JSON crosses into JavaScript. */
function projectModelContextEventSql(event, omitCheckpoint, toolResultOmission) {
	const paths = MODEL_CONTEXT_PRIVATE_METADATA_KEYS.map((key) => `$.message.__openclaw.${key}`);
	const projected = sql`json_remove(${event}, ${sql.join(paths)})`;
	const modelEvent = sql`CASE WHEN json_extract(${event}, '$.message.role') = 'toolResult'
    THEN json_remove(${projected}, '$.message.details') ELSE ${projected} END`;
	const boundedEvent = toolResultOmission ? sql`CASE WHEN ${toolResultOmission} IS NOT NULL AND json_extract(${event}, '$.message.role') = 'toolResult'
      THEN json_set(${modelEvent}, '$.message.content', json_array(json_object('type', 'text', 'text', ${toolResultOmission}))) ELSE ${modelEvent} END` : modelEvent;
	return sql`CASE WHEN ${omitCheckpoint} = 1
    THEN json_remove(${boundedEvent}, '$.message.providerReplay') ELSE ${boundedEvent} END`;
}
function pickJsonObject(value, keys) {
	return sql`(SELECT json_group_object(key, CASE type
    WHEN 'object' THEN json(value) WHEN 'array' THEN json(value)
    WHEN 'true' THEN json('true') WHEN 'false' THEN json('false')
    ELSE value END) FROM json_each(${value}) WHERE key IN (${sql.join(keys)}))`;
}
function contentPropertySql(event, property) {
	return sql`CASE WHEN typeof(key) = 'integer' AND key < 8
    THEN json_extract(${event}, fullkey || ${`.${property}`})
    ELSE json_extract(value, ${`$.${property}`}) END`;
}
const TRANSCRIPT_NAVIGATION_KEYS = [
	"type",
	"id",
	"parentId",
	"targetId",
	"appendParentId",
	"appendMode"
];
const MODEL_CONTEXT_NAVIGATION_KEYS = [
	...TRANSCRIPT_NAVIGATION_KEYS,
	"timestamp",
	"version",
	"cwd",
	"firstKeptEntryId",
	"reason",
	"tokensBefore",
	"thinkingLevel",
	"provider",
	"modelId",
	"fromId",
	"customType",
	"display",
	"label",
	"name"
];
function jsonMemberValue(alias) {
	const type = sql.ref(`${alias}.type`);
	const value = sql.ref(`${alias}.value`);
	return sql`CASE ${type}
    WHEN 'object' THEN json(${value})
    WHEN 'array' THEN json(${value})
    WHEN 'true' THEN json('true') WHEN 'false' THEN json('false')
    ELSE ${value} END`;
}
/** Stored navigation serves SQL's first-key lookup and JavaScript's last-key parse. */
function projectTranscriptPayloadNavigationSql(event) {
	const internal = pickJsonObject(sql.ref("message_member.value"), [
		"runId",
		"steerTargetRunId",
		"contextFreeCommand"
	]);
	const message = sql`(SELECT json_group_object(message_member.key,
    CASE WHEN message_member.key = '__openclaw' AND message_member.type = 'object'
      THEN json(${internal}) ELSE ${jsonMemberValue("message_member")} END)
    FROM json_each(root_member.value) AS message_member
    WHERE message_member.key IN ('role', 'idempotencyKey', 'provenance', 'excludeFromContext', '__openclaw'))`;
	return sql`(SELECT json_group_object(root_member.key,
    CASE WHEN root_member.key = 'message' AND root_member.type = 'object'
      THEN json(${message}) ELSE ${jsonMemberValue("root_member")} END)
    FROM json_each(${event}) AS root_member
    WHERE root_member.key IN (${sql.join([...MODEL_CONTEXT_NAVIGATION_KEYS, "message"])}))`;
}
/** Cursor resolution needs only tree facts, even when a row has an opaque body. */
function projectTranscriptNavigationSql(event) {
	return pickJsonObject(event, TRANSCRIPT_NAVIGATION_KEYS);
}
/** Reset boundaries select ancestry and replay roles without loading message bodies. */
function projectResetBoundaryNavigationSql(event) {
	const entry = pickJsonObject(event, [
		...TRANSCRIPT_NAVIGATION_KEYS,
		"timestamp",
		"firstKeptEntryId",
		"customType",
		"display"
	]);
	return sql`CASE WHEN json_valid(${event}) THEN
    CASE WHEN json_type(${event}) = 'object' THEN
      json_set(${entry}, '$.message', json_object('role', json_extract(${event}, '$.message.role')))
    ELSE ${event} END
    ELSE ${event} END`;
}
/** Lightweight tree/state records; these never serve as persisted transcript evidence. */
function projectModelContextNavigationSql(event) {
	const entry = pickJsonObject(event, MODEL_CONTEXT_NAVIGATION_KEYS);
	const messageFacts = pickJsonObject(supportsNodeSqliteJsonb() ? sql`jsonb_extract(${event}, '$.message')` : sql`json_extract(${event}, '$.message')`, [
		"role",
		"provider",
		"model",
		"timestamp",
		"excludeFromContext",
		"toolCallId",
		"toolUseId",
		"tool_call_id",
		"tool_use_id",
		"callId",
		"call_id",
		"toolName",
		"isError",
		"stopReason",
		"customType",
		"display"
	]);
	const calls = sql`(SELECT json_group_array(json_object(
    'type', ${contentPropertySql(event, "type")}, 'id', ${contentPropertySql(event, "id")},
    'name', ${contentPropertySql(event, "name")}))
    FROM json_each(${event}, '$.message.content') WHERE type = 'object'
    AND ${contentPropertySql(event, "type")} IN ('toolCall', 'toolUse', 'functionCall'))`;
	const synthetic = sql`COALESCE(json_extract(${event}, ${`$.message.details.${SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY}`}), 0) = 1 OR EXISTS (
    SELECT 1 FROM json_each(${event}, '$.message.content') WHERE type = 'object'
    AND ${contentPropertySql(event, "type")} = 'text' AND ${contentPropertySql(event, "text")} = ${DEFAULT_MISSING_TOOL_RESULT_TEXT})`;
	return sql`CASE json_extract(${event}, '$.type')
    WHEN 'message' THEN json_set(${entry}, '$.message', json_set(${messageFacts},
      '$.content', json(${calls}), '$.command', '', '$.output', '',
      '$.providerReplay', json_object('type', json_extract(${event}, '$.message.providerReplay.type')),
      '$.details', json_object(${SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY}, json(CASE WHEN (${synthetic}) THEN 'true' ELSE 'false' END))))
    WHEN 'custom_message' THEN json_set(${entry}, '$.content', json('[]'))
    WHEN 'compaction' THEN json_set(${entry}, '$.summary', '')
    WHEN 'branch_summary' THEN json_set(${entry}, '$.summary', '')
    ELSE ${entry} END`;
}
//#endregion
//#region src/config/sessions/session-transcript-report-facts.ts
const canonicalEntryShape = {
	id: string().min(1),
	parentId: union([string(), _null()]).optional(),
	timestamp: string().optional(),
	appendMode: unknown().optional()
};
const canonicalFactsSchema = object({
	kind: literal("canonical"),
	hasParentId: boolean(),
	entry: discriminatedUnion("type", [
		object({
			...canonicalEntryShape,
			type: literal("message"),
			assistantResponseId: string().optional(),
			assistantRunId: string().optional()
		}),
		object({
			...canonicalEntryShape,
			type: literal("custom_message"),
			customType: string().min(1)
		}),
		object({
			...canonicalEntryShape,
			type: literal("label"),
			targetId: string().min(1),
			label: string().optional()
		}),
		object({
			...canonicalEntryShape,
			type: _enum([
				"thinking_level_change",
				"model_change",
				"compaction",
				"reset",
				"branch_summary",
				"custom",
				"session_info"
			])
		})
	])
}).refine(({ entry, hasParentId }) => hasParentId === (entry.parentId !== void 0));
/** Classify the original parsed row; callers retain the current-header guard. */
function projectSessionTranscriptReportFacts(raw) {
	const { entry, recognized } = classifySessionFileEntry(raw, 3);
	if (!recognized || entry.type === "session") {
		const leaf = parseOpaqueLeafEntry(raw);
		if (leaf) return {
			kind: "leaf",
			entry: leaf
		};
		const link = parseParentLinkedOpaqueEntry(raw);
		return link ? {
			kind: "link",
			...link
		} : { kind: "ignored" };
	}
	const common = {
		id: entry.id,
		parentId: entry.parentId,
		timestamp: entry.timestamp,
		appendMode: entry.appendMode
	};
	const hasParentId = Object.hasOwn(entry, "parentId");
	if (entry.type === "label") return {
		kind: "canonical",
		hasParentId,
		entry: {
			...common,
			type: entry.type,
			targetId: entry.targetId,
			label: entry.label
		}
	};
	if (entry.type === "custom_message") return {
		kind: "canonical",
		hasParentId,
		entry: {
			...common,
			type: entry.type,
			customType: entry.customType
		}
	};
	if (entry.type === "message") return {
		kind: "canonical",
		hasParentId,
		entry: {
			...common,
			type: entry.type,
			...entry.message.role === "assistant" ? {
				assistantRunId: readSessionTranscriptRunId(entry.message),
				...typeof entry.message.responseId === "string" ? { assistantResponseId: entry.message.responseId } : {}
			} : {}
		}
	};
	return {
		kind: "canonical",
		hasParentId,
		entry: {
			...common,
			type: entry.type
		}
	};
}
/** Validate stored facts without reclassifying a synthetic message body. */
function decodeSessionTranscriptReportFacts(value) {
	if (!isRecord(value)) return;
	switch (value.kind) {
		case "canonical": {
			const parsed = canonicalFactsSchema.safeParse(value);
			return parsed.success ? parsed.data : void 0;
		}
		case "leaf": {
			if (!isRecord(value.entry)) return;
			const entry = parseOpaqueLeafEntry({
				...value.entry,
				type: "leaf"
			});
			return entry ? {
				kind: "leaf",
				entry
			} : void 0;
		}
		case "link": {
			const entry = parseParentLinkedOpaqueEntry(value);
			return entry ? {
				kind: "link",
				...entry
			} : void 0;
		}
		case "ignored": return { kind: "ignored" };
		default: return;
	}
}
//#endregion
//#region src/config/sessions/transcript-payload.ts
const MAX_COMPRESSED_EVENT_BYTES = 4194304;
const MAX_NAVIGATION_BYTES = 16384;
const MIN_COMPRESS_BYTES = 1024;
const DECODE_FUNCTION = "openclaw_transcript_payload_decode";
const registeredDecoders = /* @__PURE__ */ new WeakSet();
const storageEncodings = /* @__PURE__ */ new WeakMap();
const utf8Decoder = new TextDecoder("utf-8", {
	fatal: true,
	ignoreBOM: true
});
/** Physical payload writes participate in the transcript owner's admitted transaction. */
function createTranscriptEventInserter(database, sessionId) {
	const insert = prepareSqliteQuerySync(database, (parameter) => getNodeSqliteKysely(database).insertInto("transcript_events").values({
		session_id: sessionId,
		seq: parameter((row) => row.seq),
		event_json: parameter((row) => row.event_json),
		event_zstd: parameter((row) => row.event_zstd),
		event_utf8_bytes: parameter((row) => row.event_utf8_bytes),
		navigation_json: parameter((row) => row.navigation_json),
		created_at: parameter((row) => row.createdAt)
	}));
	return (row) => {
		const prepared = row.preparedPayload;
		const payload = prepared?.eventJson === row.eventJson && prepared.storageEncoding === readTranscriptStorageEncoding(database) ? prepared.payload : prepareTranscriptPayload(database, row.eventJson, row.parsedEvent);
		return insert({
			...row,
			...payload
		});
	};
}
function createTranscriptPayloadUpdater(database, sessionId) {
	return prepareSqliteQuerySync(database, (parameter) => getNodeSqliteKysely(database).updateTable("transcript_events").set({
		event_json: parameter((row) => row.event_json),
		event_zstd: parameter((row) => row.event_zstd),
		event_utf8_bytes: parameter((row) => row.event_utf8_bytes),
		navigation_json: parameter((row) => row.navigation_json)
	}).where("session_id", "=", sessionId).where("seq", "=", parameter((row) => row.seq)));
}
function readTranscriptStorageEncoding(database) {
	let encoding = storageEncodings.get(database);
	if (encoding === void 0) {
		const db = getNodeSqliteKysely(database);
		encoding = executeSqliteQueryTakeFirstSync(database, db.selectFrom("pragma_encoding").select("encoding"))?.encoding;
		if (encoding === void 0) throw new Error("SQLite did not report its transcript storage encoding");
		storageEncodings.set(database, encoding);
	}
	return encoding;
}
/** Prepared bytes grant no write authority and must match the eventual envelope and encoding. */
function prepareTranscriptPayloadForReuse(database, eventJson, parsedEvent) {
	return {
		eventJson,
		storageEncoding: readTranscriptStorageEncoding(database),
		payload: prepareTranscriptPayload(database, eventJson, parsedEvent)
	};
}
function navigationProjection(event, report, originalEvent) {
	return sql`CASE WHEN json_valid(${originalEvent}) AND json_valid(${report}) THEN CASE
    WHEN json_type(${event}) != 'object'
      OR coalesce(json_type(${event}, '$.message'), 'null') NOT IN ('object', 'null') THEN NULL
    ELSE json_object('version', 1,
      'report', json(${report}),
      'navigation', json(${projectTranscriptPayloadNavigationSql(event)}),
      'reset', json(${projectResetBoundaryNavigationSql(originalEvent)}),
      'model', json(${projectModelContextNavigationSql(event)}),
      'modelBytes', octet_length(${projectModelContextEventSql(event, sql.lit(0))}),
      'modelWithoutCheckpointBytes', octet_length(${projectModelContextEventSql(event, sql.lit(1))}),
      'withoutCustomDataBytes', octet_length(json_remove(${event}, '$.data')))
    END ELSE NULL END`;
}
const navigationReaders = /* @__PURE__ */ new WeakMap();
function readNavigation(database, input) {
	let read = navigationReaders.get(database);
	if (!read) {
		read = prepareSqliteQueryTakeFirstSync(database, (parameter) => {
			const db = getNodeSqliteKysely(database);
			const source = db.selectFrom(db.selectNoFrom([parameter((value) => value.eventJson).as("event_json"), parameter((value) => value.reportJson).as("report_json")]).as("input")).select(["input.event_json", "input.report_json"]).select((eb) => supportsNodeSqliteJsonb() ? sql`CASE WHEN json_valid(${eb.ref("input.event_json")})
                  THEN jsonb(${eb.ref("input.event_json")}) ELSE ${eb.ref("input.event_json")} END`.as("event_projection") : eb.ref("input.event_json").as("event_projection"));
			const admitted = sql`CASE WHEN json_valid(metadata.navigation_json)
          AND octet_length(metadata.navigation_json) <= ${MAX_NAVIGATION_BYTES}
          THEN metadata.navigation_json ELSE NULL END`;
			return db.with((cte) => cte("source").materialized(), () => source).with((cte) => cte("metadata").materialized(), (cteDb) => cteDb.selectFrom("source").select((eb) => navigationProjection(eb.ref("source.event_projection"), eb.ref("source.report_json"), eb.ref("source.event_json")).as("navigation_json"))).selectFrom("metadata").select(admitted.as("navigation_json"));
		});
		navigationReaders.set(database, read);
	}
	const navigation = read(input)?.navigation_json ?? null;
	return navigation !== null && Buffer.byteLength(navigation, "utf8") <= MAX_NAVIGATION_BYTES ? navigation : null;
}
/** Prepare canonical UTF-8 bytes and native query metadata before publishing a transcript row. */
function prepareTranscriptPayload(database, eventJson, parsedEvent) {
	const rawBytes = Buffer.byteLength(eventJson, "utf8");
	const utf8 = readTranscriptStorageEncoding(database) === "UTF-8";
	const identity = {
		event_json: eventJson,
		event_zstd: null,
		event_utf8_bytes: utf8 ? rawBytes : null,
		navigation_json: null
	};
	if (!utf8 || rawBytes > 4194304 || eventJson.includes("\\u") || eventJson.includes("\0")) return identity;
	const codec = resolveZstdCodec();
	if (!codec || rawBytes < MIN_COMPRESS_BYTES) return identity;
	const bytes = Buffer.from(eventJson, "utf8");
	if (utf8Decoder.decode(bytes) !== eventJson) return identity;
	const compressed = codec.compress(bytes, 1, true);
	const maximumStoredBytes = rawBytes - Math.max(64, Math.ceil(rawBytes / 10));
	if (compressed.byteLength > maximumStoredBytes) return identity;
	let reportJson;
	try {
		const raw = parsedEvent === void 0 ? JSON.parse(eventJson) : parsedEvent;
		if (findSessionTranscriptHeader([raw])) return identity;
		reportJson = JSON.stringify(projectSessionTranscriptReportFacts(raw));
	} catch {
		return identity;
	}
	const navigation = readNavigation(database, {
		eventJson,
		reportJson
	});
	if (navigation === null || compressed.byteLength + Buffer.byteLength(navigation, "utf8") > maximumStoredBytes) return identity;
	return {
		...identity,
		event_json: null,
		event_zstd: compressed,
		navigation_json: navigation
	};
}
function registerDecoder(database) {
	if (registeredDecoders.has(database)) return;
	database.function(DECODE_FUNCTION, {
		deterministic: true,
		directOnly: true
	}, (bytes, rawBytes) => {
		if (!(bytes instanceof Uint8Array) || bytes.byteLength === 0 || bytes.byteLength > 4194304 || typeof rawBytes !== "number" || !Number.isSafeInteger(rawBytes) || rawBytes < 1 || rawBytes > 4194304) throw new Error("Invalid compressed transcript payload bounds");
		const codec = resolveZstdCodec();
		if (!codec) throw new Error("Cannot decode compressed transcript payload: this runtime lacks zstd support");
		const decoded = codec.decompress(bytes, rawBytes);
		if (decoded.byteLength !== rawBytes) throw new Error("Compressed transcript payload length does not match its recorded UTF-8 size");
		return utf8Decoder.decode(decoded);
	});
	registeredDecoders.add(database);
}
/** Only selected bodies decode; identity TEXT remains inside SQLite for native repairs. */
function transcriptEventJsonSql(database, alias = "transcript_events") {
	registerDecoder(database);
	const identity = sql.ref(`${alias}.event_json`);
	const compressed = sql.ref(`${alias}.event_zstd`);
	const bytes = sql.ref(`${alias}.event_utf8_bytes`);
	const decode = getNodeSqliteKysely(database).fn(DECODE_FUNCTION, [compressed, bytes]);
	return sql`coalesce(${identity}, ${decode})`;
}
function transcriptEventNavigationSql(alias = "transcript_events") {
	return storedProjectionSql("navigation", sql.ref(`${alias}.event_json`), alias);
}
function storedProjectionSql(field, fallback, alias) {
	const metadata = sql.ref(`${alias}.navigation_json`);
	return sql`CASE WHEN ${metadata} IS NULL THEN ${fallback}
    ELSE json_extract(${metadata}, ${`$.${field}`}) END`;
}
function transcriptEventResetNavigationSql(alias = "transcript_events") {
	return storedProjectionSql("reset", projectResetBoundaryNavigationSql(sql.ref(`${alias}.event_json`)), alias);
}
function transcriptEventModelNavigationSql(alias = "transcript_events") {
	return storedProjectionSql("model", projectModelContextNavigationSql(sql.ref(`${alias}.event_json`)), alias);
}
/** Model admission retains projected byte costs, which can be much smaller than canonical JSON. */
function transcriptEventModelBytesSql(omitCheckpoint, alias = "transcript_events") {
	const metadata = sql.ref(`${alias}.navigation_json`);
	const identity = sql.ref(`${alias}.event_json`);
	return sql`CASE WHEN ${metadata} IS NULL
    THEN octet_length(${projectModelContextEventSql(identity, omitCheckpoint)})
    ELSE json_extract(${metadata}, CASE WHEN ${omitCheckpoint} = 1
      THEN '$.modelWithoutCheckpointBytes' ELSE '$.modelBytes' END) END`;
}
/** Suffix admission can retain opaque custom data without charging or decoding its body. */
function transcriptEventWithoutCustomDataBytesSql(alias = "transcript_events") {
	const metadata = sql.ref(`${alias}.navigation_json`);
	const identity = sql.ref(`${alias}.event_json`);
	return sql`CASE WHEN ${metadata} IS NULL
    THEN octet_length(json_remove(${identity}, '$.data'))
    ELSE json_extract(${metadata}, '$.withoutCustomDataBytes') END`;
}
function transcriptEventUtf8BytesSql(alias = "transcript_events") {
	return sql.ref(`${alias}.event_utf8_bytes`);
}
//#endregion
export { parseParentLinkedOpaqueEntry as C, parseOpaqueLeafEntry as S, CURRENT_SESSION_VERSION as T, projectTranscriptNavigationSql as _, prepareTranscriptPayloadForReuse as a, findSessionTranscriptHeader as b, transcriptEventModelBytesSql as c, transcriptEventResetNavigationSql as d, transcriptEventUtf8BytesSql as f, projectModelContextEventSql as g, projectSessionTranscriptReportFacts as h, prepareTranscriptPayload as i, transcriptEventModelNavigationSql as l, decodeSessionTranscriptReportFacts as m, createTranscriptEventInserter as n, readTranscriptStorageEncoding as o, transcriptEventWithoutCustomDataBytesSql as p, createTranscriptPayloadUpdater as r, transcriptEventJsonSql as s, MAX_COMPRESSED_EVENT_BYTES as t, transcriptEventNavigationSql as u, assertCurrentSessionTranscriptHeader as v, partitionSessionFileEntries as w, isIndexedSessionEntry as x, classifySessionFileEntry as y };
