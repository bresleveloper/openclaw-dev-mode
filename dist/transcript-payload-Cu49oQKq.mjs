import { r as isPostgresSqlConnection } from "./sql-connection-DmQzXTVz.mjs";
import { i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { u as supportsNodeSqliteJsonb } from "./node-sqlite-CYaq-2Hb.mjs";
import { l as prepareSqliteQuerySync, n as createSqliteQueryCache, o as getNodeSqliteKysely, p as sql, u as prepareSqliteQueryTakeFirstSync } from "./kysely-sync-9fPQaMlh.mjs";
import { t as resolveZstdCodec } from "./zstd-codec-C-vEb3Qf.mjs";
import { c as jsonOrderedArray, d as jsonPickObject, g as jsonValid, h as jsonType, i as jsonArrayValue, m as jsonSetPath, p as jsonRemovePaths, s as jsonObjectValue, t as jsonArrayElements, u as jsonPathValue } from "./json-values-BQ6WshKk.mjs";
import { r as findSessionTranscriptHeader } from "./session-entry-codec-DSMJ1XFN.mjs";
import { n as SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY, t as LEGACY_MISSING_TOOL_RESULT_TEXT } from "./tool-result-pairing-B20tITEh.mjs";
import { t as MODEL_CONTEXT_PRIVATE_METADATA_KEYS } from "./model-context-message-CFPsc6fp.mjs";
import { a as TRANSCRIPT_NAVIGATION_KEYS, i as MODEL_MESSAGE_NAVIGATION_KEYS, n as projectSessionTranscriptReportFacts, r as MODEL_CONTEXT_NAVIGATION_KEYS } from "./session-transcript-report-facts-CJXa6teM.mjs";
//#region src/config/sessions/session-model-context-projection.ts
/** Exclude storage-only fields in SQLite, before a row's JSON crosses into JavaScript. */
function projectModelContextEventSql(db, event, omitCheckpoint, toolResultOmission, role = jsonPathValue(db, event, sql.lit("$.message.role"))) {
	const paths = MODEL_CONTEXT_PRIVATE_METADATA_KEYS.map((key) => `$.message.__openclaw.${key}`);
	const projected = jsonRemovePaths(db, event, paths.map((path) => sql.val(path)));
	const modelEvent = sql`CASE WHEN ${role} = 'toolResult'
    THEN ${jsonRemovePaths(db, projected, [sql.lit("$.message.details")])} ELSE ${projected} END`;
	const boundedEvent = toolResultOmission ? sql`CASE WHEN ${toolResultOmission} IS NOT NULL AND ${role} = 'toolResult'
      THEN ${jsonSetPath(db, modelEvent, sql.lit("$.message.content"), jsonArrayValue(db, [jsonObjectValue(db, {
		type: sql.lit("text"),
		text: toolResultOmission
	})]), true)} ELSE ${modelEvent} END` : modelEvent;
	return sql`CASE WHEN ${omitCheckpoint} = 1
    THEN ${jsonRemovePaths(db, boundedEvent, [sql.lit("$.message.providerReplay")])} ELSE ${boundedEvent} END`;
}
function contentPropertySql(event, property) {
	return sql`CASE WHEN typeof(key) = 'integer' AND key < 8
    THEN json_extract(${event}, fullkey || ${`.${property}`})
    ELSE json_extract(value, ${`$.${property}`}) END`;
}
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
function projectTranscriptPayloadNavigationSql(db, event) {
	const memberValue = sql.ref("message_member.value");
	const internal = jsonPickObject(db, memberValue, [
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
function projectTranscriptNavigationSql(db, event) {
	return jsonPickObject(db, event, TRANSCRIPT_NAVIGATION_KEYS);
}
/** Reset boundaries select ancestry and replay roles without loading message bodies. */
function projectResetBoundaryNavigationSql(db, event) {
	const entry = jsonPickObject(db, event, [
		...TRANSCRIPT_NAVIGATION_KEYS,
		"timestamp",
		"firstKeptEntryId",
		"customType",
		"display"
	]);
	return sql`CASE WHEN ${jsonValid(db, event)} THEN
    CASE WHEN ${jsonType(db, event)} = 'object' THEN
      ${jsonSetPath(db, entry, sql.lit("$.message"), jsonObjectValue(db, { role: jsonPathValue(db, event, sql.lit("$.message.role")) }), true)}
    ELSE ${event} END
    ELSE ${event} END`;
}
function systemUpdateKindSql(db, event) {
	return sql`CASE
    WHEN ${jsonPathValue(db, event, sql.lit("$.customType"))} = 'openclaw.system-update'
      AND ${jsonPathValue(db, event, sql.lit("$.details.kind"))} IN ('prompt-update', 'runtime-context')
    THEN ${jsonPathValue(db, event, sql.lit("$.details.kind"))} ELSE NULL END`;
}
/** Lightweight tree/state records; these never serve as persisted transcript evidence. */
function projectModelContextNavigationSql(db, event, entryType = jsonPathValue(db, event, sql.lit("$.type"))) {
	if (isPostgresSqlConnection(db)) return postgresModelNavigationSql(db, event, entryType);
	const entry = jsonPickObject(db, event, MODEL_CONTEXT_NAVIGATION_KEYS);
	const message = supportsNodeSqliteJsonb() ? sql`jsonb_extract(${event}, '$.message')` : sql`json_extract(${event}, '$.message')`;
	const messageFacts = jsonPickObject(db, message, MODEL_MESSAGE_NAVIGATION_KEYS);
	const messageOperatorKind = systemUpdateKindSql(db, message);
	const entryOperatorKind = systemUpdateKindSql(db, event);
	const customMessage = sql`json_set(${entry}, '$.content', json('[]'))`;
	const calls = sql`(SELECT json_group_array(json_object(
    'type', ${contentPropertySql(event, "type")}, 'id', ${contentPropertySql(event, "id")},
    'name', ${contentPropertySql(event, "name")}))
    FROM json_each(${event}, '$.message.content') WHERE type = 'object'
    AND ${contentPropertySql(event, "type")} IN ('toolCall', 'toolUse', 'functionCall'))`;
	const synthetic = sql`COALESCE(json_extract(${event}, ${`$.message.details.${SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY}`}), 0) = 1 OR EXISTS (
    SELECT 1 FROM json_each(${event}, '$.message.content') WHERE type = 'object'
    AND ${contentPropertySql(event, "type")} = 'text' AND ${contentPropertySql(event, "text")} = ${LEGACY_MISSING_TOOL_RESULT_TEXT})`;
	return sql`CASE ${entryType}
    WHEN 'message' THEN json_set(${entry}, '$.message', json_set(${messageFacts},
      '$.content', json(${calls}), '$.command', '', '$.output', '',
      '$.providerReplay', json_object('type', json_extract(${event}, '$.message.providerReplay.type')),
      '$.details', json_patch(json_object(${SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY}, json(CASE WHEN (${synthetic}) THEN 'true' ELSE 'false' END)),
        CASE WHEN ${messageOperatorKind} IS NULL THEN json('{}') ELSE json_object('kind', ${messageOperatorKind}) END)))
    WHEN 'custom_message' THEN CASE WHEN ${entryOperatorKind} IS NULL THEN ${customMessage}
      ELSE json_set(${customMessage}, '$.details', json_object('kind', ${entryOperatorKind})) END
    WHEN 'custom' THEN CASE WHEN ${jsonPathValue(db, event, sql.lit("$.customType"))} = 'openclaw.system-prompt'
      THEN json_set(${entry}, '$.data', json_object('restart', json(CASE
        WHEN json_type(${event}, '$.data.restart') = 'true' THEN 'true' ELSE 'false' END)))
      ELSE ${entry} END
    WHEN 'compaction' THEN json_set(${entry}, '$.summary', '')
    WHEN 'branch_summary' THEN json_set(${entry}, '$.summary', '')
    ELSE ${entry} END`;
}
function postgresModelNavigationSql(db, event, entryType) {
	const get = (path) => jsonPathValue(db, event, sql.lit(path));
	const entry = jsonPickObject(db, event, MODEL_CONTEXT_NAVIGATION_KEYS);
	const message = jsonPathValue(db, event, sql.lit("$.message"), "json");
	const content = jsonPathValue(db, event, sql.lit("$.message.content"), "json");
	const elements = jsonArrayElements(db, sql`CASE WHEN ${jsonType(db, content)} = 'array' THEN ${content} ELSE '[]' END`);
	const value = sql.ref("value");
	const property = (key) => jsonPathValue(db, value, sql.lit(`$.${key}`));
	const calls = sql`(SELECT ${jsonOrderedArray(db, jsonObjectValue(db, {
		type: property("type"),
		id: property("id"),
		name: property("name")
	}), [])}
    FROM ${elements} WHERE ${jsonType(db, value)} = 'object'
    AND ${property("type")} IN ('toolCall', 'toolUse', 'functionCall'))`;
	const synthetic = sql`coalesce(${jsonPathValue(db, event, sql.lit(`$.message.details.${SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY}`), "json")}, 'false') IN ('true', '1') OR EXISTS (
    SELECT 1 FROM ${elements} WHERE ${property("type")} = 'text' AND ${property("text")} = ${LEGACY_MISSING_TOOL_RESULT_TEXT})`;
	const kind = systemUpdateKindSql(db, message);
	const missing = { [SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY]: synthetic };
	let projectedMessage = jsonPickObject(db, message, MODEL_MESSAGE_NAVIGATION_KEYS);
	for (const [path, replacement, json] of [
		[
			"content",
			calls,
			true
		],
		[
			"command",
			sql.lit(""),
			false
		],
		[
			"output",
			sql.lit(""),
			false
		],
		[
			"providerReplay",
			jsonObjectValue(db, { type: get("$.message.providerReplay.type") }),
			true
		],
		[
			"details",
			sql`CASE WHEN ${kind} IS NULL THEN ${jsonObjectValue(db, missing)} ELSE ${jsonObjectValue(db, {
				...missing,
				kind
			})} END`,
			true
		]
	]) projectedMessage = jsonSetPath(db, projectedMessage, sql.lit(`$.${path}`), replacement, json);
	const custom = jsonSetPath(db, entry, sql.lit("$.content"), sql.lit("[]"), true);
	const customKind = systemUpdateKindSql(db, event);
	return sql`CASE ${entryType}
    WHEN 'message' THEN ${jsonSetPath(db, entry, sql.lit("$.message"), projectedMessage, true)}
    WHEN 'custom_message' THEN CASE WHEN ${customKind} IS NULL THEN ${custom}
      ELSE ${jsonSetPath(db, custom, sql.lit("$.details"), jsonObjectValue(db, { kind: customKind }), true)} END
    WHEN 'custom' THEN CASE WHEN ${get("$.customType")} = 'openclaw.system-prompt'
      THEN ${jsonSetPath(db, entry, sql.lit("$.data"), jsonObjectValue(db, { restart: sql`coalesce(${jsonPathValue(db, event, sql.lit("$.data.restart"), "json")}, 'false') = 'true'` }), true)}
      ELSE ${entry} END
    WHEN 'compaction' THEN ${jsonSetPath(db, entry, sql.lit("$.summary"), sql.lit(""))}
    WHEN 'branch_summary' THEN ${jsonSetPath(db, entry, sql.lit("$.summary"), sql.lit(""))}
    ELSE ${entry} END`;
}
//#endregion
//#region src/state/json-predicate-fields.ts
/** Select raw root members without constructing objects for opaque JSON bodies. */
function scanJsonObjectFields(json, fields) {
	const first = /* @__PURE__ */ new Map();
	const last = /* @__PURE__ */ new Map();
	const wanted = new Set(fields);
	let offset = 0;
	let maximumDepth = 0;
	const whitespace = /[\t\n\r ]*/y;
	const number = /-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?/y;
	const stringPart = /["\\\u0000-\u001f]/g;
	function fail() {
		throw new SyntaxError("Invalid JSON predicate source");
	}
	const skipWhitespace = () => {
		whitespace.lastIndex = offset;
		whitespace.exec(json);
		offset = whitespace.lastIndex;
	};
	const string = () => {
		if (json[offset++] !== "\"") fail();
		while (offset < json.length) {
			stringPart.lastIndex = offset;
			const match = stringPart.exec(json);
			if (!match) fail();
			offset = stringPart.lastIndex;
			if (match[0] === "\"") return;
			if (match[0] !== "\\") fail();
			const escape = json[offset++];
			if (escape === "u") {
				if (!/^[0-9a-fA-F]{4}$/.test(json.slice(offset, offset + 4))) fail();
				offset += 4;
			} else if (escape === void 0 || !"\"\\/bfnrt".includes(escape)) fail();
		}
		fail();
	};
	const value = (depth) => {
		skipWhitespace();
		const start = json[offset];
		maximumDepth = Math.max(maximumDepth, depth + (start === "{" || start === "[" ? 1 : 0));
		if (start === "\"") {
			string();
			return "string";
		}
		if (start === "{" || start === "[") {
			const object = start === "{";
			const close = object ? "}" : "]";
			offset++;
			skipWhitespace();
			if (json[offset] === close) {
				offset++;
				return object ? "object" : "array";
			}
			while (offset < json.length) {
				let key;
				if (object) {
					const keyStart = offset;
					string();
					if (depth === 0) key = JSON.parse(json.slice(keyStart, offset));
					skipWhitespace();
					if (json[offset++] !== ":") fail();
				}
				skipWhitespace();
				const tokenStart = offset;
				const kind = value(depth + 1);
				if (key !== void 0) {
					const nul = key.indexOf("\0");
					const firstKey = nul < 0 ? key : key.slice(0, nul);
					const keepFirst = wanted.has(firstKey) && !first.has(firstKey);
					const keepLast = wanted.has(key);
					if (keepFirst || keepLast) {
						const token = {
							kind,
							text: json.slice(tokenStart, offset)
						};
						if (keepFirst) first.set(firstKey, token);
						if (keepLast) last.set(key, token);
					}
				}
				skipWhitespace();
				const separator = json[offset++];
				if (separator === close) return object ? "object" : "array";
				if (separator !== ",") fail();
				skipWhitespace();
			}
			fail();
		}
		const literal = start === "t" ? "true" : start === "f" ? "false" : start === "n" ? "null" : void 0;
		if (literal && json.startsWith(literal, offset)) {
			offset += literal.length;
			return literal === "null" ? "null" : "boolean";
		}
		number.lastIndex = offset;
		if (!number.test(json)) fail();
		offset = number.lastIndex;
		return "number";
	};
	try {
		value(0);
		skipWhitespace();
		if (offset !== json.length && json[offset] !== "\0") fail();
		return {
			valid: true,
			maximumDepth,
			first,
			last
		};
	} catch {
		return {
			valid: false,
			maximumDepth,
			first: /* @__PURE__ */ new Map(),
			last: /* @__PURE__ */ new Map()
		};
	}
}
function readJsonPredicateScalar(token) {
	if (!token || token.kind === "object" || token.kind === "array") return;
	return JSON.parse(token.text);
}
//#endregion
//#region src/config/sessions/transcript-predicate-fields.ts
const eventTypes = /* @__PURE__ */ new Set([
	"session",
	"message",
	"reset",
	"compaction",
	"custom_message",
	"custom"
]);
const customTypes = /* @__PURE__ */ new Set(["openclaw.runtime-context", "openclaw.cache-ttl"]);
const messageRoles = /* @__PURE__ */ new Set([
	"user",
	"assistant",
	"toolResult",
	"system"
]);
function discriminator(token, values) {
	const value = readJsonPredicateScalar(token);
	return typeof value === "string" && values.has(value) ? value : null;
}
/** Query-only discriminators preserve SQLite's first member and legacy JS's last member. */
function deriveTranscriptPredicateFields(eventJson) {
	const fields = scanJsonObjectFields(eventJson, [
		"type",
		"customType",
		"display",
		"message"
	]);
	if (!fields.valid || fields.maximumDepth > 1e3) return {
		navigation_type: null,
		navigation_custom_type: null,
		navigation_display: 0,
		message_role: null,
		navigation_last_type: null,
		navigation_last_custom_type: null,
		navigation_valid: 0
	};
	const message = fields.first.get("message");
	const role = message?.kind === "object" ? scanJsonObjectFields(message.text, ["role"]).first.get("role") : void 0;
	return {
		navigation_type: discriminator(fields.first.get("type"), eventTypes),
		navigation_custom_type: discriminator(fields.first.get("customType"), customTypes),
		navigation_display: readJsonPredicateScalar(fields.first.get("display")) === true ? 1 : 0,
		message_role: discriminator(role, messageRoles),
		navigation_last_type: discriminator(fields.last.get("type"), eventTypes),
		navigation_last_custom_type: discriminator(fields.last.get("customType"), customTypes),
		navigation_valid: 1
	};
}
/** Corrupt navigation must fail a selected read instead of becoming an empty result. */
function assertTranscriptNavigationValid(valid) {
	if (valid === 0) throw new Error("malformed JSON in transcript navigation; run openclaw doctor to inspect the agent database");
}
//#endregion
//#region src/config/sessions/transcript-payload.ts
const MAX_COMPRESSED_EVENT_BYTES = 4194304;
const MAX_NAVIGATION_BYTES = 16384;
const MIN_COMPRESS_BYTES = 1024;
const DECODE_FUNCTION = "openclaw_transcript_payload_decode";
const registeredDecoders = /* @__PURE__ */ new WeakSet();
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
		navigation_type: parameter((row) => row.navigation_type),
		navigation_custom_type: parameter((row) => row.navigation_custom_type),
		navigation_display: parameter((row) => row.navigation_display),
		message_role: parameter((row) => row.message_role),
		navigation_last_type: parameter((row) => row.navigation_last_type),
		navigation_last_custom_type: parameter((row) => row.navigation_last_custom_type),
		navigation_valid: parameter((row) => row.navigation_valid),
		created_at: parameter((row) => row.createdAt)
	}));
	return (row) => {
		const prepared = row.preparedPayload;
		const payload = prepared?.eventJson === row.eventJson && prepared.storageEncoding === readTranscriptStorageEncoding(database) && (!isPostgresSqlConnection(database) || prepared.payload.event_zstd === null) ? prepared.payload : prepareTranscriptPayload(database, row.eventJson, row.parsedEvent);
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
		navigation_json: parameter((row) => row.navigation_json),
		navigation_type: parameter((row) => row.navigation_type),
		navigation_custom_type: parameter((row) => row.navigation_custom_type),
		navigation_display: parameter((row) => row.navigation_display),
		message_role: parameter((row) => row.message_role),
		navigation_last_type: parameter((row) => row.navigation_last_type),
		navigation_last_custom_type: parameter((row) => row.navigation_last_custom_type),
		navigation_valid: parameter((row) => row.navigation_valid)
	}).where("session_id", "=", sessionId).where("seq", "=", parameter((row) => row.seq)));
}
function readTranscriptStorageEncoding(database) {
	if (isPostgresSqlConnection(database)) return "UTF-8";
	const facts = getAdmittedSqliteSchemaFacts(database);
	if (!facts) throw new Error("Transcript payload preparation requires admitted SQLite schema facts");
	return facts.textEncoding;
}
/** Matches stored transcript byte accounting, including the exported JSONL newline. */
function transcriptSerializedBytes(database, eventJson) {
	const encoding = readTranscriptStorageEncoding(database) === "UTF-8" ? "utf8" : "utf16le";
	return Buffer.byteLength(eventJson, encoding) + 1;
}
/** Prepared bytes grant no write authority and must match the eventual envelope and encoding. */
function prepareTranscriptPayloadForReuse(database, eventJson, parsedEvent) {
	const storageEncoding = readTranscriptStorageEncoding(database);
	return {
		eventJson,
		storageEncoding,
		payload: prepareTranscriptPayload(database, eventJson, parsedEvent, storageEncoding)
	};
}
function navigationProjection(database, event, report, originalEvent) {
	return sql`CASE WHEN json_valid(${originalEvent}) AND json_valid(${report}) THEN CASE
    WHEN json_type(${event}) != 'object'
      OR coalesce(json_type(${event}, '$.message'), 'null') NOT IN ('object', 'null') THEN NULL
    ELSE json_object('version', 1,
      'report', json(${report}),
      'navigation', json(${projectTranscriptPayloadNavigationSql(database, event)}),
      'reset', json(${projectResetBoundaryNavigationSql(database, originalEvent)}),
      'model', json(${projectModelContextNavigationSql(database, event)}),
      'modelBytes', octet_length(${projectModelContextEventSql(database, event, sql.lit(0))}),
      'modelWithoutCheckpointBytes', octet_length(${projectModelContextEventSql(database, event, sql.lit(1))}),
      'withoutCustomDataBytes', octet_length(json_remove(${event}, '$.data')))
    END ELSE NULL END`;
}
const navigationReader = createSqliteQueryCache((database) => prepareSqliteQueryTakeFirstSync(database, (parameter) => {
	const db = getNodeSqliteKysely(database);
	const source = db.selectFrom(db.selectNoFrom([parameter((value) => value.eventJson).as("event_json"), parameter((value) => value.reportJson).as("report_json")]).as("input")).select(["input.event_json", "input.report_json"]).select((eb) => supportsNodeSqliteJsonb() ? sql`CASE WHEN json_valid(${eb.ref("input.event_json")})
                  THEN jsonb(${eb.ref("input.event_json")}) ELSE ${eb.ref("input.event_json")} END`.as("event_projection") : eb.ref("input.event_json").as("event_projection"));
	const admitted = sql`CASE WHEN json_valid(metadata.navigation_json)
          AND octet_length(metadata.navigation_json) <= ${MAX_NAVIGATION_BYTES}
          THEN metadata.navigation_json ELSE NULL END`;
	return db.with((cte) => cte("source").notMaterialized(), () => source).with((cte) => cte("metadata").materialized(), (cteDb) => cteDb.selectFrom("source").select((eb) => navigationProjection(database, eb.ref("source.event_projection"), eb.ref("source.report_json"), eb.ref("source.event_json")).as("navigation_json"))).selectFrom("metadata").select(admitted.as("navigation_json"));
}));
function readNavigation(database, input) {
	const navigation = navigationReader(database)(input)?.navigation_json ?? null;
	return navigation !== null && Buffer.byteLength(navigation, "utf8") <= MAX_NAVIGATION_BYTES ? navigation : null;
}
/** Prepare canonical UTF-8 bytes and native query metadata before publishing a transcript row. */
function prepareTranscriptPayload(database, eventJson, parsedEvent, storageEncoding = readTranscriptStorageEncoding(database)) {
	const rawBytes = Buffer.byteLength(eventJson, "utf8");
	const utf8 = storageEncoding === "UTF-8";
	const identity = {
		...deriveTranscriptPredicateFields(eventJson),
		event_json: eventJson,
		event_zstd: null,
		event_utf8_bytes: utf8 ? rawBytes : null,
		navigation_json: null
	};
	if (isPostgresSqlConnection(database)) return identity;
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
	}, decodeCompressedTranscriptPayload);
	registeredDecoders.add(database);
}
function decodeCompressedTranscriptPayload(bytes, rawBytes) {
	if (!(bytes instanceof Uint8Array) || bytes.byteLength === 0 || bytes.byteLength > 4194304 || typeof rawBytes !== "number" || !Number.isSafeInteger(rawBytes) || rawBytes < 1 || rawBytes > 4194304) throw new Error("Invalid compressed transcript payload bounds");
	const codec = resolveZstdCodec();
	if (!codec) throw new Error("Cannot decode compressed transcript payload: this runtime lacks zstd support");
	const decoded = codec.decompress(bytes, rawBytes);
	if (decoded.byteLength !== rawBytes) throw new Error("Compressed transcript payload length does not match its recorded UTF-8 size");
	return utf8Decoder.decode(decoded);
}
/** Decode selected rows without copying expanded payloads back through SQLite. */
function readTranscriptPayload(row) {
	return row.event_json ?? decodeCompressedTranscriptPayload(row.event_zstd, row.event_utf8_bytes);
}
/** Only selected bodies decode; identity TEXT remains inside SQLite for native repairs. */
function transcriptEventJsonSql(database, alias = "transcript_events") {
	if (isPostgresSqlConnection(database)) return sql.ref(`${alias}.event_json`);
	registerDecoder(database);
	const identity = sql.ref(`${alias}.event_json`);
	const compressed = sql.ref(`${alias}.event_zstd`);
	const bytes = sql.ref(`${alias}.event_utf8_bytes`);
	const decode = getNodeSqliteKysely(database).fn(DECODE_FUNCTION, [compressed, bytes]);
	return sql`coalesce(${identity}, ${decode})`;
}
function transcriptEventNavigationSql(database, alias = "transcript_events") {
	return storedProjectionSql(database, "navigation", sql.ref(`${alias}.event_json`), alias);
}
function transcriptEventRunIdSql(database, alias = "transcript_events") {
	return jsonPathValue(database, transcriptEventNavigationSql(database, alias), sql.lit("$.message.__openclaw.runId"));
}
function storedProjectionSql(database, field, fallback, alias) {
	const metadata = sql.ref(`${alias}.navigation_json`);
	return sql`CASE WHEN ${metadata} IS NULL THEN ${fallback}
    ELSE ${jsonPathValue(database, metadata, sql.val(`$.${field}`), "json")} END`;
}
function transcriptEventResetNavigationSql(database, alias = "transcript_events") {
	return storedProjectionSql(database, "reset", projectResetBoundaryNavigationSql(database, sql.ref(`${alias}.event_json`)), alias);
}
function transcriptEventModelNavigationSql(database, alias = "transcript_events", entryType) {
	return storedProjectionSql(database, "model", projectModelContextNavigationSql(database, sql.ref(`${alias}.event_json`), entryType), alias);
}
/** Model admission retains projected byte costs, which can be much smaller than canonical JSON. */
function transcriptEventModelBytesSql(database, omitCheckpoint, alias = "transcript_events") {
	const metadata = sql.ref(`${alias}.navigation_json`);
	const identity = sql.ref(`${alias}.event_json`);
	return sql`CASE WHEN ${metadata} IS NULL
    THEN octet_length(${projectModelContextEventSql(database, identity, omitCheckpoint)})
    ELSE ${jsonPathValue(database, metadata, sql`CASE WHEN ${omitCheckpoint} = 1
      THEN '$.modelWithoutCheckpointBytes' ELSE '$.modelBytes' END`, "number")} END`;
}
/** Suffix admission can retain opaque custom data without charging or decoding its body. */
function transcriptEventWithoutCustomDataBytesSql(database, alias = "transcript_events") {
	const metadata = sql.ref(`${alias}.navigation_json`);
	const identity = sql.ref(`${alias}.event_json`);
	return sql`CASE WHEN ${metadata} IS NULL
    THEN octet_length(${jsonRemovePaths(database, identity, [sql.lit("$.data")])})
    ELSE ${jsonPathValue(database, metadata, sql.lit("$.withoutCustomDataBytes"), "number")} END`;
}
function transcriptEventUtf8BytesSql(alias = "transcript_events") {
	return sql.ref(`${alias}.event_utf8_bytes`);
}
//#endregion
export { projectTranscriptNavigationSql as S, assertTranscriptNavigationValid as _, prepareTranscriptPayloadForReuse as a, scanJsonObjectFields as b, transcriptEventJsonSql as c, transcriptEventNavigationSql as d, transcriptEventResetNavigationSql as f, transcriptSerializedBytes as g, transcriptEventWithoutCustomDataBytesSql as h, prepareTranscriptPayload as i, transcriptEventModelBytesSql as l, transcriptEventUtf8BytesSql as m, createTranscriptEventInserter as n, readTranscriptPayload as o, transcriptEventRunIdSql as p, createTranscriptPayloadUpdater as r, readTranscriptStorageEncoding as s, MAX_COMPRESSED_EVENT_BYTES as t, transcriptEventModelNavigationSql as u, deriveTranscriptPredicateFields as v, projectModelContextEventSql as x, readJsonPredicateScalar as y };
