import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { a as iterateSqliteQuerySync, i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, s as prepareSqliteQuerySync, u as sql } from "./kysely-sync-Bn6Qrpbz.mjs";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DM1AypRG.mjs";
import { t as SessionMetadataUnavailableError } from "./session-metadata-unavailable-error-DwD7IuoE.mjs";
import { a as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { l as openOpenClawAgentDatabase } from "./openclaw-agent-db-CaQAStOA.mjs";
import { _ as projectTranscriptNavigationSql, d as transcriptEventResetNavigationSql, s as transcriptEventJsonSql, u as transcriptEventNavigationSql } from "./transcript-payload-qsg5dB6v.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { a as getSessionKysely, g as toDatabaseOptions, p as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { f as selectSessionTranscriptTreePathNodes, l as scanSessionTranscriptTree, n as isSessionTranscriptLeafControl, o as parseSessionTranscriptTreeEntry } from "./transcript-tree-3xvvNd9-.mjs";
import { t as transcriptEventReadBytesSql } from "./session-transcript-read-bytes-jHOoqdX_.mjs";
import { n as assertSessionTranscriptHot } from "./session-cold-storage-state-BcO2Rrog.mjs";
import { c as readTranscriptMutationStateInTransaction, o as readTranscriptContextVersionInTransaction } from "./session-accessor.sqlite-transcript-state-BGrlGphn.mjs";
import { t as readSessionStateDeleteSnapshot } from "./session-accessor.sqlite-delete-snapshot-CZiiDjVP.mjs";
import { n as SessionTranscriptStorageUnavailableError } from "./session-transcript-projection-error-CuzwVnKb.mjs";
import { i as resolveSqliteSessionTranscriptReadFence, n as resolveSessionTranscriptQuestionAnswer } from "./session-transcript-read-fence-Crjo4FKU.mjs";
import { c as isTranscriptOnlyOpenClawAssistantModel } from "./transcript-only-openclaw-assistant-CVgy4bjA.mjs";
import { n as readRestoredSessionTranscript, t as readHotSessionTranscriptSnapshot } from "./session-cold-storage-read-BK-Qc6S7.mjs";
import { s as readAssistantTextBlocksForPhase, t as extractAssistantPhaseText } from "./chat-message-content-D14VlZZc.mjs";
import { t as createTextPartCodeRegionResolver } from "./code-regions-NxEObIZm.mjs";
import { o as trimTextPreservingCode } from "./text-projection-DLGaFuGQ.mjs";
import { o as stripInlineDirectivePartsForDelivery, t as parseInlineDirectiveParts } from "./directive-tags-D9uZSb5h.mjs";
import { n as extractTtsDirectiveParts } from "./directive-facts-C2V6h8RE.mjs";
import { toUSVString } from "node:util";
import { Buffer } from "node:buffer";
//#region src/infra/sqlite-jsonl-budget.ts
var SqliteJsonlReadBudgetExceededError = class extends Error {};
/** Admit a filtered JSONL source inside the caller's payload-read transaction. */
function assertSqliteJsonlReadBudget(database, source, budget, label, options = {}) {
	const db = getNodeSqliteKysely(database);
	const rejectOverflow = (bytes) => {
		if (bytes > budget) throw new SqliteJsonlReadBudgetExceededError(`${label} is too large to export (at least ${bytes} bytes; limit ${budget})`);
	};
	const sizes = iterateSqliteQuerySync(database, db.selectFrom(source).select((eb) => [
		eb.fn("octet_length", ["event_json"]).as("bytes"),
		(options.hasExactUtf8Bytes ? eb.ref("event_utf8_bytes") : eb.val(null)).as("utf8_bytes"),
		eb.selectFrom("pragma_encoding").select("encoding").as("encoding")
	]).$if(options.maxRows !== void 0, (query) => query.limit(options.maxRows + 1)));
	let rowCount = 0;
	let bytes = 0;
	let separator = 0;
	let knownBytes = 0;
	let separators = 0;
	let unknownRows = 0;
	for (const row of sizes) {
		rowCount += 1;
		if (options.maxRows !== void 0 && rowCount > options.maxRows) throw new SqliteJsonlReadBudgetExceededError(`${label} has too many rows to export (at least ${rowCount}; limit ${options.maxRows})`);
		const exact = row.utf8_bytes ?? (row.encoding === "UTF-8" ? row.bytes : null);
		if (exact === null && row.bytes === null) throw new Error(`${label} has a transcript row without byte metadata or identity text`);
		if (exact !== null) knownBytes += exact;
		else unknownRows += 1;
		bytes += (exact ?? Math.ceil(row.bytes / 2)) + separator;
		separators += separator;
		rejectOverflow(bytes);
		separator = options.separatorBytes ?? 1;
	}
	if (unknownRows === 0) return;
	bytes = knownBytes + separators;
	const unknown = db.selectFrom(source).select("event_json").$if(options.hasExactUtf8Bytes === true, (query) => query.where("event_utf8_bytes", "is", null));
	for (const row of iterateSqliteQuerySync(database, unknown)) {
		if (row.event_json === null) throw new Error(`${label} has a transcript row without identity text`);
		bytes += Buffer.byteLength(row.event_json, "utf8");
		rejectOverflow(bytes);
	}
}
//#endregion
//#region src/config/sessions/transcript-visible-events.ts
/** Selects the active visible branch while preserving original transcript sequence numbers. */
function selectVisibleTranscriptEventEntries(events) {
	const tree = scanSessionTranscriptTree(events);
	const visiblePath = selectSessionTranscriptTreePathNodes(tree, tree.leafId);
	if (visiblePath.length > 0) return visiblePath.map((node) => ({
		event: node.entry,
		parentId: node.parentId,
		seq: node.index + 1
	}));
	return tree.hasLeafControl ? [] : events.map((event, index) => ({
		event,
		parentId: null,
		seq: index + 1
	}));
}
/** Selects only events on the active visible transcript branch. */
function selectVisibleTranscriptEvents(events) {
	return selectVisibleTranscriptEventEntries(events).map((entry) => entry.event);
}
/** Resolves the parent id that the next active transcript append should use. */
function resolveVisibleTranscriptAppendParentId(events) {
	return scanSessionTranscriptTree(events).appendParentId;
}
/** Checks membership in the normalized selected path, not raw storage ancestry. */
function isTranscriptEntryOnVisiblePath(events, entryId) {
	const tree = scanSessionTranscriptTree(events);
	return selectSessionTranscriptTreePathNodes(tree, tree.leafId).some((node) => node.id === entryId);
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-parent.ts
/** Resolves the effective parent for a transcript message append inside the write transaction. */
const REALTIME_VOICE_PROVENANCE = {
	kind: "realtime_voice",
	sourceChannel: "talk"
};
const PREPARED_ASSISTANT_MAX_NEWER_MESSAGES = 256;
const PREPARED_ASSISTANT_MAX_NEWER_BYTES = 1048576;
const PREPARED_ASSISTANT_MAX_ANCESTORS = 4096;
/** Validates a prepared assistant from bounded indexed message metadata. */
function canRebasePreparedAssistantInTransaction(database, sessionId, preparedParentId, admittedUserId) {
	const tailId = readActiveTranscriptAppendParentId(database, sessionId);
	if (tailId !== preparedParentId) {
		if (tailId === null || !transcriptEntryIsAncestor(database, sessionId, tailId, preparedParentId)) return false;
	}
	if (admittedUserId && tailId !== admittedUserId && (tailId === null || !transcriptEntryIsAncestor(database, sessionId, tailId, admittedUserId))) return false;
	const db = getSessionKysely(database.db);
	const preparedParent = preparedParentId === null ? void 0 : executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_event_identities").select("seq").where("session_id", "=", sessionId).where("event_id", "=", preparedParentId).limit(1));
	if (preparedParentId !== null && !preparedParent) return false;
	const admitted = admittedUserId ? admittedUserId === preparedParentId ? preparedParent : readTranscriptIdentityInTransaction(database, sessionId, admittedUserId) : void 0;
	if (admittedUserId && !admitted) return false;
	const newerMessageMetadata = Array.from(iterateSqliteQuerySync(database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "identity.session_id").onRef("event.seq", "=", "identity.seq")).select([
		"identity.event_id",
		"identity.seq",
		transcriptEventReadBytesSql("event").as("serialized_bytes")
	]).where("identity.session_id", "=", sessionId).where("identity.event_type", "=", "message").where("identity.seq", ">", preparedParent?.seq ?? -1).orderBy("identity.seq", "asc").limit(257)));
	if (newerMessageMetadata.length > PREPARED_ASSISTANT_MAX_NEWER_MESSAGES || newerMessageMetadata.reduce((sum, row) => sum + row.serialized_bytes, 0) > PREPARED_ASSISTANT_MAX_NEWER_BYTES) return false;
	const admittedIsNewer = admitted !== void 0 && admitted.seq > (preparedParent?.seq ?? -1);
	if (admittedIsNewer && !newerMessageMetadata.some((row) => row.event_id === admittedUserId)) return false;
	if (newerMessageMetadata.length === 0) return !admittedIsNewer;
	return Array.from(iterateSqliteQuerySync(database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "identity.session_id").onRef("event.seq", "=", "identity.seq")).leftJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).leftJoin("transcript_rewrite_watermarks as rewrite", (join) => join.onRef("rewrite.session_id", "=", "identity.session_id")).select([
		"identity.event_id",
		"identity.seq",
		"identity.parent_id",
		"active.message_position",
		"rewrite.generation",
		sql`json_extract(${transcriptEventNavigationSql("event")}, '$.message.role')`.as("message_role"),
		sql`json_type(${transcriptEventNavigationSql("event")}, '$.message.excludeFromContext') = 'true'
            AND json_type(${transcriptEventNavigationSql("event")}, '$.message.__openclaw.contextFreeCommand') = 'true'`.as("context_free_command"),
		sql`json_extract(${transcriptEventNavigationSql("event")}, '$.message.provenance.kind')`.as("provenance_kind"),
		sql`json_extract(${transcriptEventNavigationSql("event")}, '$.message.provenance.sourceChannel')`.as("provenance_source_channel")
	]).where("identity.session_id", "=", sessionId).where("identity.seq", ">=", newerMessageMetadata[0].seq).where("identity.seq", "<=", newerMessageMetadata.at(-1).seq).where("identity.event_type", "=", "message").orderBy("identity.seq", "asc").limit(PREPARED_ASSISTANT_MAX_NEWER_MESSAGES))).every((row) => {
		if (row.message_role !== "user" || row.event_id === admittedUserId || row.context_free_command === 1) return true;
		if (row.provenance_kind === REALTIME_VOICE_PROVENANCE.kind && row.provenance_source_channel === REALTIME_VOICE_PROVENANCE.sourceChannel) return true;
		const answer = resolveSessionTranscriptQuestionAnswer(database, sessionId, row.event_id, admittedUserId);
		return answer !== void 0 && answer.rawSeq === row.seq && answer.effectiveParentId === row.parent_id && answer.activeMessagePosition === row.message_position && answer.generation === row.generation;
	});
}
function resolveTranscriptEventAppendParent(database, sessionId, event, options) {
	if (options.appendIntent !== "active-branch" || !event || typeof event !== "object" || Array.isArray(event) || !("parentId" in event)) return event;
	const parentId = event.parentId;
	if (parentId !== null && typeof parentId !== "string") return event;
	const effectiveParentId = resolveTranscriptMessageAppendParent(database, sessionId, {
		appendIntent: "active-branch",
		parentId
	});
	return effectiveParentId === parentId ? event : {
		...event,
		parentId: effectiveParentId
	};
}
function resolveTranscriptMessageAppendParent(database, sessionId, options) {
	const tailId = readActiveTranscriptAppendParentId(database, sessionId);
	if (options.parentId === void 0) return tailId;
	if (options.appendIntent !== "active-branch" || tailId === options.parentId || tailId === null) return options.parentId;
	return transcriptEntryIsAncestor(database, sessionId, tailId, options.parentId) ? tailId : options.parentId;
}
/** Checks the durable tree directly when the materialized active-path projection is dirty. */
function isTranscriptEntryOnActivePathInTransaction(database, sessionId, entryId) {
	return isTranscriptEntryOnVisiblePath(readTranscriptNavigationEvents(database, sessionId), entryId);
}
function transcriptEntryIsAncestor(database, sessionId, leafId, candidateId) {
	const db = getSessionKysely(database.db);
	return executeSqliteQueryTakeFirstSync(database.db, db.withRecursive("transcript_ancestors", (query) => query.selectFrom("transcript_event_identities").select(["parent_id", sql`1`.as("depth")]).where("session_id", "=", sessionId).where("event_id", "=", leafId).unionAll(query.selectFrom("transcript_event_identities as ti").innerJoin("transcript_ancestors as ancestor", "ti.event_id", "ancestor.parent_id").select(["ti.parent_id", sql`ancestor.depth + 1`.as("depth")]).where("ti.session_id", "=", sessionId).where("ancestor.depth", "<", PREPARED_ASSISTANT_MAX_ANCESTORS))).selectFrom("transcript_ancestors").select("parent_id").where("parent_id", candidateId === null ? "is" : "=", candidateId).limit(1))?.parent_id === candidateId;
}
function readActiveTranscriptAppendParentId(database, sessionId) {
	const db = getSessionKysely(database.db);
	const latest = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_event_identities as ti").innerJoin("transcript_events as te", (join) => join.onRef("te.session_id", "=", "ti.session_id").onRef("te.seq", "=", "ti.seq")).select(["ti.event_type", projectTranscriptNavigationSql(transcriptEventNavigationSql("te")).as("event_json")]).where("ti.session_id", "=", sessionId).orderBy("ti.seq", "desc").limit(1));
	const resolveFromNavigation = () => resolveVisibleTranscriptAppendParentId(readTranscriptNavigationEvents(database, sessionId));
	if (!latest) {
		const current = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_transcript_index_state as state").innerJoin("transcript_rewrite_watermarks as rewrite", "rewrite.session_id", "state.session_id").select("state.leaf_event_id").where("state.session_id", "=", sessionId).where("state.needs_rebuild", "=", 0).where("state.indexed_seq", "=", db.selectFrom("transcript_events").select("seq").where("session_id", "=", sessionId).orderBy("seq", "desc").limit(1)).where((eb) => eb.not(eb.exists(eb.selectFrom("session_transcript_active_events").select("session_id").where("session_id", "=", sessionId).where("context_eligible", "is", null)))));
		return current ? current.leaf_event_id : resolveFromNavigation();
	}
	try {
		const event = JSON.parse(latest.event_json);
		const treeEntry = parseSessionTranscriptTreeEntry(event);
		if (!treeEntry) return resolveFromNavigation();
		if (latest.event_type !== "leaf") return treeEntry.appendParentId;
		const leafReferencesKnown = treeEntry.leafId !== void 0 && transcriptTreeReferenceExists(database, sessionId, treeEntry.leafId) && transcriptTreeReferenceExists(database, sessionId, treeEntry.appendParentId);
		if (isSessionTranscriptLeafControl(event) && leafReferencesKnown) return treeEntry.appendParentId;
	} catch {}
	return resolveFromNavigation();
}
function readTranscriptNavigationEvents(database, sessionId) {
	const db = getSessionKysely(database.db);
	return Array.from(iterateSqliteQuerySync(database.db, db.selectFrom("transcript_events").select(projectTranscriptNavigationSql(transcriptEventNavigationSql()).as("event_json")).where("session_id", "=", sessionId).orderBy("seq", "asc")), (row) => JSON.parse(row.event_json));
}
function readTranscriptIdentityInTransaction(database, sessionId, eventId) {
	const db = getSessionKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_event_identities").select([
		"event_id",
		"parent_id",
		"seq"
	]).where("session_id", "=", sessionId).where("event_id", "=", eventId).limit(1));
	return row ? {
		eventId: row.event_id,
		parentId: row.parent_id,
		seq: row.seq
	} : void 0;
}
function transcriptTreeReferenceExists(database, sessionId, eventId) {
	return eventId === null || readTranscriptIdentityInTransaction(database, sessionId, eventId) !== void 0;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-stats.ts
function sqliteTranscriptJsonlByteSize() {
	return sql`COALESCE(SUM(${transcriptEventReadBytesSql()}), 0)
    + CASE WHEN COUNT(*) > 0 THEN COUNT(*) - 1 ELSE 0 END`.as("size_bytes");
}
function createTranscriptStatsQuery(database) {
	const db = getSessionKysely(database.db);
	return prepareSqliteQuerySync(database.db, (parameter) => db.selectFrom(db.selectFrom("transcript_events").select((eb) => [
		eb.fn.count("seq").as("event_count"),
		eb.fn.max("seq").as("max_seq"),
		sqliteTranscriptJsonlByteSize()
	]).where("session_id", "=", parameter((sessionId) => sessionId)).as("events")).leftJoin("session_transcript_cold_archives as cold", (join) => join.on("cold.session_id", "=", parameter((sessionId) => sessionId))).leftJoin("session_windows as session", (join) => join.on("session.session_id", "=", parameter((sessionId) => sessionId))).select([
		"events.event_count",
		"events.max_seq",
		"events.size_bytes",
		"cold.event_count as cold_event_count",
		"cold.last_seq as cold_last_seq",
		"cold.raw_bytes as cold_raw_bytes",
		"session.transcript_observed_at",
		"session.transcript_updated_at"
	]));
}
const transcriptStatsQueries = /* @__PURE__ */ new WeakMap();
/** Reads transcript freshness and byte size without materializing event rows. */
function readTranscriptStatsFromDatabase(database, sessionId) {
	return runSqliteDeferredTransactionSync(database.db, () => {
		let query = transcriptStatsQueries.get(database.db);
		if (!query) {
			query = createTranscriptStatsQuery(database);
			transcriptStatsQueries.set(database.db, query);
		}
		const row = query(sessionId).rows[0];
		return {
			eventCount: row?.cold_event_count ?? row?.event_count ?? 0,
			...row?.transcript_updated_at !== null && row?.transcript_updated_at !== void 0 ? { lastMutationAtMs: row.transcript_updated_at } : {},
			...row?.transcript_observed_at !== null && row?.transcript_observed_at !== void 0 ? { lastObservedMutationAtMs: row.transcript_observed_at } : {},
			maxSeq: row?.cold_last_seq ?? row?.max_seq ?? 0,
			sizeBytes: row?.cold_raw_bytes ?? row?.size_bytes ?? 0
		};
	}, { operationLabel: "session transcript stats" });
}
function readTranscriptStatsChunkFromDatabase(database, sessionIds) {
	const db = getSessionKysely(database.db);
	return runSqliteDeferredTransactionSync(database.db, () => {
		const stats = new Map(sessionIds.map((sessionId) => [sessionId, {
			eventCount: 0,
			maxSeq: 0,
			sizeBytes: 0
		}]));
		for (const row of executeSqliteQuerySync(database.db, db.selectFrom("transcript_events").select((eb) => [
			"session_id",
			eb.fn.count("seq").as("event_count"),
			eb.fn.max("seq").as("max_seq"),
			sqliteTranscriptJsonlByteSize()
		]).where("session_id", "in", sessionIds).groupBy("session_id")).rows) stats.set(row.session_id, {
			eventCount: row.event_count,
			maxSeq: row.max_seq ?? 0,
			sizeBytes: row.size_bytes
		});
		for (const row of executeSqliteQuerySync(database.db, db.selectFrom("session_windows").select([
			"session_id",
			"transcript_updated_at",
			"transcript_observed_at"
		]).where("session_id", "in", sessionIds)).rows) {
			const value = stats.get(row.session_id);
			if (row.transcript_updated_at !== null) value.lastMutationAtMs = row.transcript_updated_at;
			if (row.transcript_observed_at !== null) value.lastObservedMutationAtMs = row.transcript_observed_at;
		}
		for (const row of executeSqliteQuerySync(database.db, db.selectFrom("session_transcript_cold_archives").select([
			"session_id",
			"event_count",
			"last_seq",
			"raw_bytes"
		]).where("session_id", "in", sessionIds)).rows) {
			const value = stats.get(row.session_id);
			value.eventCount = row.event_count;
			value.maxSeq = row.last_seq;
			value.sizeBytes = row.raw_bytes;
		}
		return stats;
	}, { operationLabel: "session transcript stats" });
}
const SQLITE_TRANSCRIPT_STATS_POINT_QUERY_LIMIT = 10;
const SQLITE_TRANSCRIPT_STATS_QUERY_CHUNK_SIZE = 400;
/** Read ordered stats on one supplied connection, preserving duplicate and missing session IDs. */
function readTranscriptStatsBatchFromDatabase(database, sessionIds) {
	if (sessionIds.length <= SQLITE_TRANSCRIPT_STATS_POINT_QUERY_LIMIT) return sessionIds.map((sessionId) => readTranscriptStatsFromDatabase(database, sessionId));
	const uniqueIds = [...new Set(sessionIds.map((sessionId) => toUSVString(sessionId)))];
	const stats = /* @__PURE__ */ new Map();
	for (let offset = 0; offset < uniqueIds.length; offset += SQLITE_TRANSCRIPT_STATS_QUERY_CHUNK_SIZE) {
		const chunk = uniqueIds.slice(offset, offset + SQLITE_TRANSCRIPT_STATS_QUERY_CHUNK_SIZE);
		if (chunk.length <= SQLITE_TRANSCRIPT_STATS_POINT_QUERY_LIMIT) for (const sessionId of chunk) stats.set(sessionId, readTranscriptStatsFromDatabase(database, sessionId));
		else for (const [sessionId, value] of readTranscriptStatsChunkFromDatabase(database, chunk)) stats.set(sessionId, value);
	}
	return sessionIds.map((sessionId) => ({ ...stats.get(toUSVString(sessionId)) }));
}
//#endregion
//#region src/config/sessions/transcript-assistant-delivery.ts
/** Record display ownership without rewriting bytes used by runtime transcript identity. */
function recordAssistantManagedMediaUrls(message, urls) {
	const mediaUrls = Array.from(new Set(urls?.map((url) => url.trim()).filter(Boolean) ?? []));
	if (message.role === "assistant" && mediaUrls.length > 0) Object.assign(message, { openclawDelivery: {
		...isRecord(message.openclawDelivery) ? message.openclawDelivery : {},
		mediaUrls
	} });
	return message;
}
function mergeTtsFacts(current, next) {
	return {
		tagged: true,
		...(current?.text ?? next.text) != null ? { text: current?.text ?? next.text } : {},
		...current?.directives || next.directives ? { directives: [...current?.directives ?? [], ...next.directives ?? []] } : {}
	};
}
/** Strips final-answer directives in place so live state and persisted bytes stay identical. */
function applyAssistantDeliveryDirectives(message, options) {
	if (message.role !== "assistant" || !Array.isArray(message.content)) return message;
	const finalBlocks = readAssistantTextBlocksForPhase(message, "final_answer");
	const blocks = finalBlocks.length ? finalBlocks : readAssistantTextBlocksForPhase(message);
	const original = blocks.map((block) => block.text);
	const parsed = parseInlineDirectiveParts(original);
	const stripped = stripInlineDirectivePartsForDelivery(parsed.map((part) => part.text));
	const tts = extractTtsDirectiveParts(stripped.map((part) => part.text));
	const codeRegions = blocks.length > 1 ? createTextPartCodeRegionResolver(tts.map((part) => part.cleanedText)) : void 0;
	let facts;
	for (const [index, block] of blocks.entries()) {
		const reply = expectDefined(parsed[index], "parsed assistant part");
		const speech = expectDefined(tts[index], "prepared assistant speech part");
		const hasDeliveryFacts = reply.hasAudioTag || reply.hasReplyTag || Boolean(speech.facts);
		if (speech.cleanedText === original[index] && !hasDeliveryFacts) continue;
		block.text = speech.facts ? trimTextPreservingCode(speech.cleanedText, "both", codeRegions?.(index)) : speech.cleanedText;
		if (!hasDeliveryFacts) continue;
		facts ??= {};
		Object.assign(facts, {
			...reply.audioAsVoice ? { audioAsVoice: true } : {},
			...reply.replyToCurrent ? { replyToCurrent: true } : {},
			...reply.replyToExplicitId ? { replyToId: reply.replyToExplicitId } : {},
			...speech.facts ? { tts: mergeTtsFacts(facts.tts, speech.facts) } : {}
		});
	}
	if (facts) {
		const mergedFacts = {
			...isRecord(message.openclawDelivery) ? message.openclawDelivery : void 0,
			...facts
		};
		if (facts.replyToId) delete mergedFacts.replyToCurrent;
		else if (facts.replyToCurrent) delete mergedFacts.replyToId;
		Object.assign(message, { openclawDelivery: mergedFacts });
	}
	return recordAssistantManagedMediaUrls(message, options?.managedMediaUrls);
}
/** Decode only persisted delivery facts; transcript records cannot supply runtime authority. */
function readAssistantDeliveryFacts(value) {
	if (!isRecord(value)) return;
	const facts = {};
	if (value.audioAsVoice === true) facts.audioAsVoice = true;
	if (typeof value.replyToId === "string" && value.replyToId.trim()) facts.replyToId = value.replyToId;
	else if (value.replyToCurrent === true) facts.replyToCurrent = true;
	if (Array.isArray(value.mediaUrls)) {
		const mediaUrls = value.mediaUrls.filter((url) => typeof url === "string" && url.trim().length > 0);
		if (mediaUrls.length) facts.mediaUrls = mediaUrls;
	}
	if (value.textPhaseRequiresTerminal === true) facts.textPhaseRequiresTerminal = true;
	if (isRecord(value.tts) && value.tts.tagged === true) {
		const tts = { tagged: true };
		if (typeof value.tts.text === "string") tts.text = value.tts.text;
		if (Array.isArray(value.tts.directives)) tts.directives = value.tts.directives.flatMap((directive) => {
			if (!isRecord(directive) || !isRecord(directive.values)) return [];
			const entries = Object.entries(directive.values);
			if (!entries.every((entry) => typeof entry[1] === "string")) return [];
			const values = Object.fromEntries(entries);
			return [{
				...typeof directive.provider === "string" ? { provider: directive.provider } : {},
				values
			}];
		});
		facts.tts = tts;
	}
	return Object.keys(facts).length ? facts : void 0;
}
/** SQLite and retained JSONL readers expose the same authored text and delivery facts. */
function projectAssistantTranscriptText(message, id) {
	if (!isRecord(message) || message.role !== "assistant") return;
	const text = extractAssistantPhaseText(message);
	if (!text?.trim()) return;
	const openclawDelivery = readAssistantDeliveryFacts(message.openclawDelivery);
	return {
		...typeof id === "string" && id ? { id } : {},
		text,
		...typeof message.timestamp === "number" && Number.isFinite(message.timestamp) ? { timestamp: message.timestamp } : {},
		...openclawDelivery ? { openclawDelivery } : {}
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-read.ts
function createTranscriptIdentityReader(database, sessionId) {
	const read = prepareSqliteQuerySync(database.db, (parameter) => getSessionKysely(database.db).selectFrom("transcript_event_identities").select([
		"event_id",
		"parent_id",
		"seq"
	]).where("session_id", "=", sessionId).where("event_id", "=", parameter((eventId) => eventId)));
	return (eventId) => readHotSessionTranscriptSnapshot(database, sessionId, "identity", () => {
		const row = read(eventId).rows[0];
		return row ? {
			eventId: row.event_id,
			parentId: row.parent_id,
			seq: row.seq
		} : void 0;
	});
}
function readTranscriptIdentityByEventId(database, sessionId, eventId) {
	return createTranscriptIdentityReader(database, sessionId)(eventId);
}
/** Loads raw transcript events from the additive SQLite transcript store. */
async function loadTranscriptEvents(scope) {
	return readRestoredSessionTranscript(scope, () => loadTranscriptEventsSync(scope));
}
/** Loads raw transcript events synchronously from the additive SQLite transcript store. */
function loadTranscriptEventsSync(scope) {
	return loadTranscriptReadSnapshotSync(scope).events;
}
/** Snapshot export payloads and their identity without opening the writable lifecycle. */
function readTranscriptExportSnapshotReadOnlySync(scope) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const result = withOpenClawAgentDatabaseReadOnly((database) => runSqliteDeferredTransactionSync(database.db, () => {
		const fence = resolveSqliteSessionTranscriptReadFence({
			database,
			...resolved
		});
		const sessionKey = resolved.sessionKey ?? executeSqliteQueryTakeFirstSync(database.db, getSessionKysely(database.db).selectFrom("session_windows").select("session_key").where("session_id", "=", resolved.sessionId).limit(1))?.session_key;
		return {
			events: loadTranscriptEventsFromDatabase(database, resolved.sessionId, {
				beforeEventSeq: fence?.beforeRawSeq,
				maxEventBytes: scope.maxEventBytes
			}),
			stats: readTranscriptStatsFromDatabase(database, resolved.sessionId),
			sessionKey
		};
	}, { operationLabel: "session transcript export snapshot" }), toDatabaseOptions(resolved));
	return result.found ? result.value : void 0;
}
/** Pair loaded bytes with the watermark that also fences opaque navigation edits. */
function loadTranscriptReadSnapshotSync(scope, options = {}) {
	const resolved = options.resolvedScope ?? resolveSqliteTranscriptReadScope(scope);
	const read = (database) => runSqliteDeferredTransactionSync(database.db, () => {
		const fence = resolveSqliteSessionTranscriptReadFence({
			database,
			...resolved
		});
		return {
			events: loadTranscriptEventsFromDatabase(database, resolved.sessionId, {
				beforeEventSeq: fence?.beforeRawSeq,
				maxEventBytes: scope.maxEventBytes
			}),
			version: readTranscriptContextVersionInTransaction(database, resolved.sessionId)
		};
	}, {
		databaseLabel: database.path,
		operationLabel: "session transcript fenced read"
	});
	const databaseOptions = toDatabaseOptions(resolved);
	if (!options.readOnly) return read(openOpenClawAgentDatabase(databaseOptions));
	const result = withOpenClawAgentDatabaseReadOnly(read, databaseOptions);
	if (!result.found) throw new SessionTranscriptStorageUnavailableError(result.reason);
	return result.value;
}
/** Reads a complete maintenance transcript and its lifecycle snapshot from one transaction. */
function inspectTranscriptEventsSync(scope) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	return runSqliteDeferredTransactionSync(database.db, () => ({
		events: readTranscriptSnapshot(database, resolved.sessionId).events,
		snapshot: readSessionStateDeleteSnapshot(database.db, resolved.sessionId)
	}), {
		databaseLabel: database.path,
		operationLabel: "session transcript inspection"
	});
}
/** Validates a prepared assistant using indexed identities and returns its exact mutation fence. */
function validatePreparedAssistantAppendSync(scope, preparedParentId, admittedUserId) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	return runSqliteDeferredTransactionSync(database.db, () => canRebasePreparedAssistantInTransaction(database, resolved.sessionId, preparedParentId, admittedUserId) ? readTranscriptMutationStateInTransaction(database, resolved.sessionId).updatedAt : void 0, {
		databaseLabel: database.path,
		operationLabel: "prepared assistant validation"
	});
}
/** Loads only the first transcript row for header metadata hot paths. */
function loadTranscriptHeaderSync(scope) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	return readTranscriptHeaderFromDatabase(openOpenClawAgentDatabase(toDatabaseOptions(resolved)), resolved.sessionId);
}
function readTranscriptHeaderFromDatabase(database, sessionId) {
	return readHotSessionTranscriptSnapshot(database, sessionId, "header", () => {
		const db = getSessionKysely(database.db);
		const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select(transcriptEventJsonSql(database.db).as("event_json")).where("session_id", "=", sessionId).orderBy("seq", "asc").limit(1));
		return row ? JSON.parse(row.event_json) : void 0;
	});
}
/** Loads a bounded newest tail in storage order for hot-path accounting. */
function loadTranscriptTailEventsSync(scope, maxEvents) {
	const limit = Number.isFinite(maxEvents) ? Math.max(0, Math.floor(maxEvents)) : 0;
	if (limit === 0) return [];
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	return readHotSessionTranscriptSnapshot(database, resolved.sessionId, "tail", () => {
		const db = getSessionKysely(database.db);
		return executeSqliteQuerySync(database.db, db.selectFrom("transcript_events").select(transcriptEventJsonSql(database.db).as("event_json")).where("session_id", "=", resolved.sessionId).orderBy("seq", "desc").limit(limit)).rows.toReversed().map((row) => JSON.parse(row.event_json));
	});
}
/** Loads additive transcript rows after one durable sequence checkpoint. */
function loadTranscriptEventRowsAfterSeqSync(scope, afterSeq, throughSeq) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	return readHotSessionTranscriptSnapshot(database, resolved.sessionId, "incremental", () => {
		let query = getSessionKysely(database.db).selectFrom("transcript_events").select([transcriptEventJsonSql(database.db).as("event_json"), "seq"]).where("session_id", "=", resolved.sessionId).where("seq", ">", afterSeq);
		if (throughSeq !== void 0) query = query.where("seq", "<=", throughSeq);
		return executeSqliteQuerySync(database.db, query.orderBy("seq", "asc")).rows.map((row) => ({
			event: JSON.parse(row.event_json),
			seq: coerceRequiredSqliteNumber(row.seq)
		}));
	});
}
/** Reads one checkpoint row so incremental consumers can reject transcript rewrites. */
function readTranscriptEventAtSeqSync(scope, seq) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	return readHotSessionTranscriptSnapshot(database, resolved.sessionId, "checkpoint", () => {
		return readTranscriptEventAtSeqInTransaction(database, resolved.sessionId, seq);
	});
}
/** Reads one raw row within the caller's already validated transcript snapshot. */
function readTranscriptEventAtSeqInTransaction(database, sessionId, seq) {
	const row = executeSqliteQueryTakeFirstSync(database.db, getSessionKysely(database.db).selectFrom("transcript_events").select([transcriptEventJsonSql(database.db).as("event_json"), "seq"]).where("session_id", "=", sessionId).where("seq", "=", seq));
	return row ? {
		event: JSON.parse(row.event_json),
		seq: coerceRequiredSqliteNumber(row.seq)
	} : void 0;
}
/** Select the same fenced rows for synchronous materialization and worker transfer. */
function prepareTranscriptEventReadQuery(database, sessionId, options = {}) {
	const { beforeEventSeq, maxEventBytes } = options;
	const db = getSessionKysely(database.db);
	if (maxEventBytes !== void 0 && Number.isFinite(maxEventBytes) && maxEventBytes >= 0) assertSqliteJsonlReadBudget(database.db, db.selectFrom("transcript_events").select(["event_json", "event_utf8_bytes"]).where("session_id", "=", sessionId).$if(beforeEventSeq !== void 0, (query) => query.where("seq", "<", beforeEventSeq)).as("events"), Math.floor(maxEventBytes), "Trajectory transcript store", { hasExactUtf8Bytes: true });
	return db.selectFrom("transcript_events").where("session_id", "=", sessionId).$if(beforeEventSeq !== void 0, (query) => query.where("seq", "<", beforeEventSeq));
}
function loadTranscriptEventsFromDatabase(database, sessionId, options = {}) {
	return readHotSessionTranscriptSnapshot(database, sessionId, "events", () => {
		const rows = iterateSqliteQuerySync(database.db, prepareTranscriptEventReadQuery(database, sessionId, options).select([options.projection === "reset-boundary" ? transcriptEventResetNavigationSql().as("event_json") : transcriptEventJsonSql(database.db).as("event_json")]).orderBy("seq", "asc"));
		return Array.from(rows, (row) => JSON.parse(row.event_json));
	});
}
function readTranscriptSnapshot(database, sessionId) {
	const rows = readTranscriptEventRows(database, sessionId);
	return {
		events: rows.map((row) => JSON.parse(row.eventJson)),
		rows
	};
}
/** Reads canonical transcript text without parsing JSON for snapshot comparison. */
function readTranscriptEventRows(database, sessionId, options = {}) {
	return readHotSessionTranscriptSnapshot(database, sessionId, "raw rows", () => {
		const db = getSessionKysely(database.db);
		return executeSqliteQuerySync(database.db, db.selectFrom("transcript_events").select([transcriptEventJsonSql(database.db).as("event_json"), "seq"]).where("session_id", "=", sessionId).$if(options.afterSeq !== void 0, (query) => query.where("seq", ">", options.afterSeq)).orderBy("seq", "asc")).rows.map((row) => ({
			eventJson: row.event_json,
			seq: coerceRequiredSqliteNumber(row.seq)
		}));
	});
}
/** Reads exact transcript storage rows for guarded doctor rewrites. */
function readTranscriptStorageRows(database, sessionId) {
	return readHotSessionTranscriptSnapshot(database, sessionId, "storage rows", () => {
		const db = getSessionKysely(database.db);
		return executeSqliteQuerySync(database.db, db.selectFrom("transcript_events").select([
			"created_at",
			transcriptEventJsonSql(database.db).as("event_json"),
			"seq"
		]).where("session_id", "=", sessionId).orderBy("seq", "asc")).rows.map((row) => ({
			createdAt: coerceRequiredSqliteNumber(row.created_at),
			eventJson: row.event_json,
			seq: coerceRequiredSqliteNumber(row.seq)
		}));
	});
}
/** Reads transcript freshness and byte size without materializing event rows. */
function readTranscriptStatsSync(scope) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	return readTranscriptStatsFromDatabase(openOpenClawAgentDatabase(toDatabaseOptions(resolved)), resolved.sessionId);
}
/** Read transcript stats in database groups without joining the writable lifecycle. */
function readTranscriptStatsBatchReadOnlySync(scopes) {
	const results = scopes.map(() => null);
	const targetCache = /* @__PURE__ */ new Map();
	const groups = /* @__PURE__ */ new Map();
	for (const [index, scope] of scopes.entries()) {
		const resolved = resolveSqliteTranscriptReadScope(scope, targetCache);
		const options = toDatabaseOptions(resolved);
		const pathname = resolveOpenClawAgentSqlitePath(options);
		const key = `${options.agentId}\0${pathname}`;
		const group = groups.get(key) ?? {
			options,
			items: []
		};
		group.items.push({
			index,
			sessionId: resolved.sessionId
		});
		groups.set(key, group);
	}
	for (const group of groups.values()) try {
		const read = withOpenClawAgentDatabaseReadOnly((database) => readTranscriptStatsBatchFromDatabase(database, group.items.map((item) => item.sessionId)), group.options);
		if (read.found) for (const [index, item] of group.items.entries()) results[item.index] = read.value[index];
	} catch (error) {
		if (!(error instanceof SessionMetadataUnavailableError)) throw error;
	}
	return results;
}
/** Reads the latest visible assistant text from SQLite transcript rows in reverse order. */
function loadLatestAssistantText(scope, options = {}) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	return runSqliteDeferredTransactionSync(database.db, () => {
		assertSessionTranscriptHot(database.db, resolved.sessionId);
		const db = getSessionKysely(database.db);
		const beforeEventSeq = resolveSqliteSessionTranscriptReadFence({
			database,
			...resolved
		})?.beforeRawSeq;
		const rows = iterateSqliteQuerySync(database.db, db.selectFrom("transcript_events as te").innerJoin("transcript_event_identities as ti", (join) => join.onRef("ti.session_id", "=", "te.session_id").onRef("ti.seq", "=", "te.seq")).select(transcriptEventJsonSql(database.db, "te").as("event_json")).where("te.session_id", "=", resolved.sessionId).where("ti.event_type", "=", "message").$if(beforeEventSeq !== void 0, (query) => query.where("ti.seq", "<", beforeEventSeq)).orderBy("ti.seq", "desc"));
		for (const row of rows) {
			const latest = parseLatestAssistantMessageEvent(row.event_json, options);
			if (!latest) continue;
			const text = projectAssistantTranscriptText(latest.message, latest.id);
			if (text) return text;
		}
	}, {
		databaseLabel: database.path,
		operationLabel: "latest assistant fenced read"
	});
}
function parseLatestAssistantMessageEvent(raw, options = {}) {
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return;
	}
	const message = parsed.message;
	if (!message || message.role !== "assistant") return;
	if (!options.includeTranscriptOnlyOpenClawAssistant && isTranscriptOnlyOpenClawAssistantModel(message.provider, message.model)) return;
	return {
		...typeof parsed.id === "string" && parsed.id.trim() ? { id: parsed.id } : {},
		message
	};
}
/** Checks physical message history without loading payloads covered by the identity index. */
async function hasSessionTranscriptMessage(scope) {
	return readRestoredSessionTranscript(scope, () => {
		const resolved = resolveSqliteTranscriptReadScope(scope);
		const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
		const db = getSessionKysely(database.db);
		return runSqliteDeferredTransactionSync(database.db, () => {
			assertSessionTranscriptHot(database.db, resolved.sessionId);
			if (executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_event_identities").select("seq").where("session_id", "=", resolved.sessionId).where("event_type", "=", "message").limit(1))) return true;
			const classified = db.selectFrom("transcript_event_identities").select("seq").where("session_id", "=", resolved.sessionId).where("event_type", "is not", null);
			return findTranscriptEventInRows(iterateSqliteQuerySync(database.db, db.selectFrom("transcript_events").select(transcriptEventNavigationSql().as("event_json")).where("session_id", "=", resolved.sessionId).where("seq", "not in", classified).orderBy("seq", "desc")), (event) => typeof event === "object" && event !== null && "type" in event && event.type === "message") !== void 0;
		}, {
			databaseLabel: database.path,
			operationLabel: "session transcript presence"
		});
	});
}
/** Finds the newest transcript record accepted by the matcher without parsing older rows. */
async function findTranscriptEvent(scope, match) {
	return readRestoredSessionTranscript(scope, () => {
		const resolved = resolveSqliteTranscriptReadScope(scope);
		return findTranscriptEventInDatabase(openOpenClawAgentDatabase(toDatabaseOptions(resolved)), resolved.sessionId, match);
	});
}
function findTranscriptEventInDatabase(database, sessionId, match) {
	return readHotSessionTranscriptSnapshot(database, sessionId, "match", () => {
		const db = getSessionKysely(database.db);
		return findTranscriptEventInRows(iterateSqliteQuerySync(database.db, db.selectFrom("transcript_events").select(transcriptEventJsonSql(database.db).as("event_json")).where("session_id", "=", sessionId).orderBy("seq", "desc")), match);
	});
}
function findTranscriptEventInRows(rows, match) {
	for (const row of rows) try {
		const event = JSON.parse(row.event_json);
		if (match(event)) return { event };
	} catch {}
}
function readTranscriptEventMessage(event) {
	if (!event || typeof event !== "object" || Array.isArray(event)) return;
	const message = event.message;
	return message && typeof message === "object" && !Array.isArray(message) ? message : void 0;
}
function readTranscriptEventId(event) {
	if (!event || typeof event !== "object" || Array.isArray(event)) return;
	const id = event.id;
	return typeof id === "string" && id.trim() ? id : void 0;
}
function readEventTimestamp(event) {
	if (!isRecord(event)) return;
	const value = event.timestamp;
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value !== "string" || !value.trim()) return;
	const parsed = Date.parse(value);
	return Number.isFinite(parsed) ? parsed : void 0;
}
//#endregion
export { projectAssistantTranscriptText as A, readTranscriptIdentityByEventId as C, readTranscriptStorageRows as D, readTranscriptStatsSync as E, resolveTranscriptMessageAppendParent as F, selectVisibleTranscriptEventEntries as I, selectVisibleTranscriptEvents as L, readTranscriptStatsBatchFromDatabase as M, isTranscriptEntryOnActivePathInTransaction as N, validatePreparedAssistantAppendSync as O, resolveTranscriptEventAppendParent as P, SqliteJsonlReadBudgetExceededError as R, readTranscriptHeaderFromDatabase as S, readTranscriptStatsBatchReadOnlySync as T, readTranscriptEventAtSeqSync as _, inspectTranscriptEventsSync as a, readTranscriptEventRows as b, loadTranscriptEvents as c, loadTranscriptHeaderSync as d, loadTranscriptReadSnapshotSync as f, readTranscriptEventAtSeqInTransaction as g, readEventTimestamp as h, hasSessionTranscriptMessage as i, recordAssistantManagedMediaUrls as j, applyAssistantDeliveryDirectives as k, loadTranscriptEventsFromDatabase as l, prepareTranscriptEventReadQuery as m, findTranscriptEvent as n, loadLatestAssistantText as o, loadTranscriptTailEventsSync as p, findTranscriptEventInDatabase as r, loadTranscriptEventRowsAfterSeqSync as s, createTranscriptIdentityReader as t, loadTranscriptEventsSync as u, readTranscriptEventId as v, readTranscriptSnapshot as w, readTranscriptExportSnapshotReadOnlySync as x, readTranscriptEventMessage as y, assertSqliteJsonlReadBudget as z };
