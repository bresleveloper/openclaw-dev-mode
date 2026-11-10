import { o as getSqliteReadScopeRevision, p as runSqliteReadOperationSync } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as executeSqliteQueryTakeFirstSync, d as sqliteStringSet, i as executeSqliteQuerySync, m as expressionBuilder, n as createSqliteQueryCache, o as getNodeSqliteKysely, p as sql, s as iterateSqliteQuerySync, u as prepareSqliteQueryTakeFirstSync } from "./kysely-sync-9fPQaMlh.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { r as parseSqliteSessionEntryRecord } from "./session-entry-json-iiByG7LE.mjs";
import { t as attachSessionEntrySnapshots } from "./session-entry-snapshot-values-CSxUX6LQ.mjs";
import { n as sessionEntrySnapshotColumnsForKeys } from "./session-entry-snapshots-CwvH1YlE.mjs";
import { c as jsonOrderedArray } from "./json-values-BQ6WshKk.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-B6hhdgLR.mjs";
import { o as resolveDeliveryProvenCanonicalSessionKey, t as collectSessionEntryLookupKeys } from "./store-entry-CUxN9KZj.mjs";
import { t as hasSqliteSessionOwnerColumns } from "./session-accessor.sqlite-owner-projection-BFkJufPp.mjs";
import { n as parseSessionEntryJson, r as selectSessionEntryRows } from "./session-accessor.sqlite-status-B58ALiNV.mjs";
import { _ as validateCanonicalSessionRowEntry, a as canonicalSessionValidationQuery, d as readWithCanonicalSessionAdmission, h as canonicalSessionKeyMigrationRequiredError, r as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-B7chVWi3.mjs";
import { r as readSessionActorTransactionState } from "./session-actor-transaction-BIR0_goz.mjs";
import { n as prepareSqliteSessionParticipantProjection, r as projectSqliteSessionParticipants } from "./session-accessor.sqlite-participant-projection-B8eNZYGT.mjs";
import { toUSVString } from "node:util";
//#region src/config/sessions/session-accessor.sqlite-entry-query.ts
function cacheSessionEntryQuery(database, query) {
	let last;
	return (key) => {
		const revision = getSqliteReadScopeRevision(database);
		if (revision && last?.revision === revision && last.key === key) return last.row && { ...last.row };
		const row = query(key);
		last = revision && getSqliteReadScopeRevision(database) === revision ? {
			key,
			revision,
			row
		} : void 0;
		return row && { ...row };
	};
}
const getExactSessionEntryQueries = createSqliteQueryCache((database) => {
	const rowQueries = /* @__PURE__ */ new Map();
	const canonicalQueries = /* @__PURE__ */ new Map();
	return {
		row: (key, projection = "full") => {
			const shape = `${JSON.stringify(projection)}:${hasSqliteSessionOwnerColumns(database)}`;
			let query = rowQueries.get(shape);
			if (!query) {
				query = cacheSessionEntryQuery(database, prepareSqliteQueryTakeFirstSync(database, (parameter) => selectReadableSessionEntryRows({ db: database }, projection).where("session_key", "=", parameter((value) => value))));
				rowQueries.set(shape, query);
			}
			return query(key);
		},
		canonical: (key, projection, includeOwner = true) => {
			const shape = `${JSON.stringify(projection)}:${includeOwner}:${includeOwner && hasSqliteSessionOwnerColumns(database)}`;
			let query = canonicalQueries.get(shape);
			if (!query) {
				query = cacheSessionEntryQuery(database, prepareSqliteQueryTakeFirstSync(database, (parameter) => canonicalSessionValidationQuery({ db: database }, { metadata: includeOwner }).$if(!includeOwner, (builder) => builder.select("session_nodes.updated_at")).select(sessionEntrySnapshotColumnsForKeys(void 0, projection)).where("session_nodes.session_key", "=", parameter((value) => value))));
				canonicalQueries.set(shape, query);
			}
			return query(key);
		}
	};
});
function selectReadableSessionEntryRows(database, projection) {
	if (projection === "delivery") {
		const deliveryJson = sql`
      CASE WHEN json_valid(entry_json)
        AND json_type(entry_json, '$.sessionId') = 'text'
        AND json_type(entry_json, '$.updatedAt') IN ('integer', 'real')
        AND length(CAST(entry_json AS BLOB)) = length(CAST(printf('%s', entry_json) AS BLOB))
      THEN (SELECT CASE WHEN count(*) = count(DISTINCT key)
        THEN json_group_object(key, json(entry_json -> fullkey)) ELSE entry_json END
        FROM json_each(entry_json) WHERE key IN ('sessionId', 'updatedAt', 'delivery', 'groupId'))
      ELSE entry_json END`.as("entry_json");
		return getNodeSqliteKysely(database.db).selectFrom("session_nodes").select([
			"session_key",
			"current_session_id",
			"updated_at",
			deliveryJson
		]);
	}
	return projection !== "full" ? selectSessionEntryRows(database, projection).select(["current_session_id", "updated_at"]) : getNodeSqliteKysely(database.db).selectFrom("session_nodes").selectAll("session_nodes").select(sessionEntrySnapshotColumnsForKeys(void 0, projection));
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-presence.ts
/** Physical hot rows only; a retained cold archive does not satisfy this probe. */
function hasStoredTranscriptEvents(database, sessionId) {
	return Boolean(executeSqliteQueryTakeFirstSync(database.db, getNodeSqliteKysely(database.db).selectFrom("transcript_events").select("seq").where("session_id", "=", sessionId).limit(1)));
}
//#endregion
//#region src/config/sessions/session-entry-window.types.ts
const sessionEntryWindowColumns = [
	"session_id",
	"session_key",
	"reason",
	"created_at",
	"updated_at",
	"session_entry_provenance",
	"acp_owned",
	"plugin_owner_id",
	"hook_external_content_source",
	"previous_session_id",
	"session_scope",
	"started_at",
	"ended_at",
	"status",
	"chat_type",
	"channel",
	"account_id",
	"model_provider",
	"model",
	"agent_harness_id",
	"parent_session_key",
	"spawned_by",
	"display_name",
	"primary_conversation_id",
	"transcript_observed_at",
	"transcript_updated_at"
];
//#endregion
//#region src/config/sessions/session-accessor.sqlite-provenance.ts
const sessionEntryWindowFactSelections = sessionEntryWindowColumns.map((column) => `session_windows.${column} as window_${column}`);
function selectSessionEntryWindowFacts(database) {
	return getNodeSqliteKysely(database.db).selectFrom("session_windows").select(sessionEntryWindowFactSelections).as("entry_window");
}
/** Detach the scalar LEFT JOIN projection from the canonical node columns. */
function takeSessionEntryWindowFacts(row) {
	const present = row.window_session_id !== null;
	const entries = sessionEntryWindowColumns.map((column) => {
		const alias = `window_${column}`;
		const value = row[alias];
		delete row[alias];
		return [column, value];
	});
	return present ? Object.fromEntries(entries) : null;
}
function bindSessionEntryProvenance(entry) {
	const hookSource = entry.hookExternalContentSource;
	const persistedHookSource = hookSource === "email" ? "webhook" : hookSource;
	return {
		session_entry_provenance: 1,
		acp_owned: entry.acp ? 1 : 0,
		plugin_owner_id: typeof entry.pluginOwnerId === "string" && entry.pluginOwnerId.trim() ? entry.pluginOwnerId.trim() : null,
		hook_external_content_source: persistedHookSource === "gmail" || persistedHookSource === "webhook" ? persistedHookSource : null
	};
}
function prepareSessionEntryWindowRow(params) {
	const db = getNodeSqliteKysely(params.database.db);
	const actor = readSessionActorTransactionState(params.database, { sessionId: params.entry.sessionId });
	const prepared = params.prepared;
	const existingRoot = actor ? actor.window : prepared?.sessionId === params.entry.sessionId ? prepared.row : executeSqliteQueryTakeFirstSync(params.database.db, db.selectFrom("session_windows").select(sessionEntryWindowColumns).where("session_id", "=", params.entry.sessionId));
	const transcriptUpdatedAt = existingRoot && !actor && params.stagedTranscriptUpdatedAt !== void 0 ? Math.max(existingRoot.transcript_updated_at ?? 0, params.stagedTranscriptUpdatedAt) : existingRoot?.transcript_updated_at ?? null;
	let row = {
		...params.boundSessionRow,
		transcript_observed_at: transcriptUpdatedAt ?? params.entry.updatedAt
	};
	if (existingRoot?.session_entry_provenance === 0 && (params.previousEntry?.sessionId === params.entry.sessionId || hasStoredTranscriptEvents(params.database, params.entry.sessionId))) row = {
		...row,
		session_entry_provenance: 0,
		acp_owned: 0,
		plugin_owner_id: null,
		hook_external_content_source: null
	};
	else if (existingRoot?.session_entry_provenance === 1) row = {
		...row,
		acp_owned: existingRoot.acp_owned === 1 ? 1 : row.acp_owned,
		plugin_owner_id: row.plugin_owner_id ?? existingRoot.plugin_owner_id,
		hook_external_content_source: row.hook_external_content_source ?? existingRoot.hook_external_content_source
	};
	const previous = new Map(Object.entries(existingRoot ?? {}));
	return {
		row,
		postimage: {
			...row,
			created_at: existingRoot?.created_at ?? row.created_at,
			session_key: params.retainOwner && existingRoot ? existingRoot.session_key : row.session_key,
			transcript_updated_at: transcriptUpdatedAt
		},
		changed: !existingRoot || Object.entries(row).some(([key, value]) => key !== "created_at" && !(params.retainOwner && key === "session_key") && previous.get(key) !== value)
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-select.ts
/** Single-key and cohort readers share the same row selection and ordering. */
function readSelectedSessionEntryRows(database, selection, projection, validation, options) {
	const key = typeof selection === "string" ? selection : selection.length === 1 ? selection[0] : void 0;
	if (key !== void 0 && projection !== "delivery" && !options?.includeBoardPresence && !options?.includeMembership && !options?.includeWindowFacts && !options?.includeRowTranscriptProjection) {
		const queries = getExactSessionEntryQueries(database.db);
		const row = validation === "canonical" ? queries.canonical(key, projection) : queries.row(key, projection);
		return row ? [row] : [];
	}
	const transcriptQuery = (validation === "canonical" ? canonicalSessionValidationQuery(database, { metadata: true }).select("session_nodes.updated_at").select(sessionEntrySnapshotColumnsForKeys(void 0, projection === "delivery" ? "list" : projection)) : selectReadableSessionEntryRows(database, projection)).$if(options?.includeWindowFacts === true, (builder) => builder.leftJoin(selectSessionEntryWindowFacts(database), "entry_window.window_session_id", "session_nodes.current_session_id").selectAll("entry_window").select((eb) => [eb.selectFrom("transcript_rewrite_watermarks").select("generation").whereRef("session_id", "=", "session_nodes.current_session_id").as("transcript_generation"), eb.fn.coalesce(eb.selectFrom("session_transcript_cold_archives").select("last_seq").whereRef("session_id", "=", "session_nodes.current_session_id"), eb.selectFrom("transcript_events").select((inner) => inner.fn.max("seq").as("max_seq")).whereRef("session_id", "=", "session_nodes.current_session_id")).as("transcript_max_seq")])).$if(options?.includeRowTranscriptProjection === true, (builder) => builder.leftJoin("session_windows as row_transcript_window", "row_transcript_window.session_id", "session_nodes.current_session_id").leftJoin("session_transcript_index_state as row_transcript_index", "row_transcript_index.session_id", "session_nodes.current_session_id").select([
		"row_transcript_window.session_id as row_transcript_window_id",
		"row_transcript_window.row_transcript_json",
		"row_transcript_window.row_transcript_updated_at",
		"row_transcript_window.transcript_updated_at as row_transcript_source_updated_at",
		"row_transcript_index.indexed_seq as row_transcript_indexed_seq"
	]));
	const eb = expressionBuilder();
	const boardQuery = options?.includeBoardPresence ? transcriptQuery.select((tableExists(database.db, "board_widgets") ? eb.exists(eb.selectFrom("board_tabs").select("session_key").whereRef("board_tabs.session_key", "=", "session_nodes.session_key")) : eb.lit(0)).as("board_present")) : transcriptQuery;
	const query = options?.includeMembership ? boardQuery.select((outer) => tableExists(database.db, "session_members") ? outer.selectFrom("session_members").select((builder) => jsonOrderedArray(database.db, builder.ref("identity_id"), [builder.ref("identity_id")]).as("ids")).whereRef("session_members.session_key", "=", "session_nodes.session_key").$asScalar().as("member_ids_json") : outer.val("[]").as("member_ids_json")) : boardQuery;
	const rows = executeSqliteQuerySync(database.db, (typeof selection === "string" ? query.where("session_nodes.session_key", "=", selection) : query.where("session_nodes.session_key", "in", sqliteStringSet(selection))).orderBy("session_nodes.session_key", "asc")).rows;
	return options?.includeWindowFacts ? rows.map((row) => {
		const window = takeSessionEntryWindowFacts(row);
		const { transcript_generation, transcript_max_seq, ...entryRow } = row;
		return {
			...entryRow,
			window,
			transcriptWatermark: {
				sessionId: row.current_session_id,
				generation: transcript_generation ?? null,
				maxSeq: transcript_max_seq ?? null
			}
		};
	}) : rows;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-read.ts
function parseReadableSessionEntryData(database, row, projection) {
	const parsed = projection === "delivery" ? parseSqliteSessionEntryRecord(row) : parseSessionEntryJson(row, projection);
	if (parsed) validateDeliveryCanonicalSessionEntry(row.session_key, parsed);
	if (row.retained_window_id !== void 0) {
		validateCanonicalSessionRowEntry(row, parsed, "read");
		return parsed;
	}
	if (parsed) {
		if (projection === "delivery") {
			const { sessionId, updatedAt, delivery, groupId } = parsed;
			return {
				sessionId,
				updatedAt,
				delivery,
				groupId
			};
		}
		return parsed;
	}
	if (row.entry_json === "{}" ? executeSqliteQueryTakeFirstSync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_windows").select("session_id").where("session_id", "=", row.current_session_id).where("session_key", "=", row.session_key)) : void 0) return null;
	throw canonicalSessionKeyMigrationRequiredError(`invalid persisted session row requires repair for ${row.session_key}`);
}
function validateDeliveryCanonicalSessionEntry(sessionKey, entry) {
	const canonicalKey = resolveDeliveryProvenCanonicalSessionKey(sessionKey, entry);
	if (canonicalKey !== sessionKey) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${canonicalKey}`);
	return entry;
}
/** Decodes a fresh owned entry, including its nested JSON, owner and participant values. */
function parseReadableSqliteSessionEntryRow(database, row, projection = "full") {
	const parsed = parseReadableSessionEntryData(database, row, projection);
	return parsed ? projectSqliteSessionParticipants(database.db, row.session_key, parsed) : null;
}
/** Decode supplied rows in caller order while sharing their lazy participant acquisition. */
function prepareSqliteSessionEntryRowDecoder(database, rows, projection = "full", projectParticipants = true, onParticipantProjectionError) {
	const project = projection === "delivery" || !projectParticipants ? (_key, entry) => entry : prepareSqliteSessionParticipantProjection(database.db, rows.filter((row) => row.entry_json !== "{}").map((row) => row.session_key));
	return (row) => {
		const parsed = parseReadableSessionEntryData(database, row, projection);
		if (!parsed) return null;
		try {
			return project(row.session_key, parsed);
		} catch (error) {
			if (!onParticipantProjectionError) throw error;
			onParticipantProjectionError(row.session_key);
			return parsed;
		}
	};
}
/** Reuse the caller's admitted connection without reopening its read scope. */
function readSessionKeyBySessionIdInDatabase(database, sessionId) {
	const db = getNodeSqliteKysely(database.db);
	return executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select("session_key").where("session_id", "=", sessionId).limit(1))?.session_key;
}
function readSessionEntryRow(database, sessionKey, projection = "full", includeWindowFacts) {
	return scanSessionEntryRows(database, sessionKey, projection, true, includeWindowFacts)?.selected;
}
/** Identity preparation retains normal alias validation without loading participant display data. */
function readSessionEntryIdentity(database, sessionKey) {
	const entry = scanSessionEntryRows(database, sessionKey, "list", false)?.selected?.entry;
	return entry && {
		sessionId: entry.sessionId,
		updatedAt: entry.updatedAt,
		lifecycleRevision: entry.lifecycleRevision
	};
}
/** Read the selected entry and the exact lookup rows in one owner snapshot. */
function readSessionEntryRowScan(database, sessionKey, includeWindowFacts) {
	return scanSessionEntryRows(database, sessionKey, "full", true, includeWindowFacts);
}
function scanSessionEntryRows(database, sessionKey, projection, includeParticipants = true, includeWindowFacts) {
	const actor = readSessionActorTransactionState(database, { sessionKey });
	if (actor) {
		const lookupKeys = collectSessionEntryLookupKeys(sessionKey);
		return {
			lookupKeys,
			rows: lookupKeys.flatMap((key) => {
				const row = actor.entryRows.get(key)?.row;
				return row ? [structuredClone(row)] : [];
			}),
			selected: readExactSessionEntryRow(database, sessionKey, projection, void 0, includeWindowFacts)
		};
	}
	return runSqliteReadOperationSync(database.db, () => {
		assertCanonicalSqliteSessionKeysCurrent(database);
		const lookupKeys = collectSessionEntryLookupKeys(sessionKey);
		if (lookupKeys[0] === void 0) return;
		const rows = readSelectedSessionEntryRows(database, lookupKeys, projection, void 0, includeWindowFacts ? {
			includeWindowFacts,
			includeBoardPresence: true,
			includeMembership: true
		} : void 0);
		let selected;
		for (const row of rows) {
			const entry = includeParticipants ? parseReadableSqliteSessionEntryRow(database, row, projection) : parseReadableSessionEntryData(database, row, projection);
			if (!entry || row.session_key !== sessionKey.trim()) continue;
			selected = {
				entry,
				row
			};
		}
		return {
			lookupKeys,
			rows,
			selected
		};
	});
}
/** Indexed child metadata for the entry reader worker; memory actors read their own state. */
function readSessionChildEntriesInDatabase(database, parentSessionKeys, projection = "full") {
	const parents = typeof parentSessionKeys === "string" ? [parentSessionKeys] : parentSessionKeys;
	if (parents.length === 0) return [];
	const sessionKeys = getNodeSqliteKysely(database.db).selectFrom("session_nodes").select("session_key");
	const childKeys = sessionKeys.where("parent_session_key", "in", parents).union(sessionKeys.where("spawned_by", "in", parents));
	const childRows = executeSqliteQuerySync(database.db, selectReadableSessionEntryRows(database, projection).where("session_key", "in", childKeys).where("session_key", "not in", parents).orderBy("session_key", "asc")).rows.filter((row) => !isInternalSessionEffectsKey(row.session_key));
	const decode = prepareSqliteSessionEntryRowDecoder(database, childRows, projection);
	return childRows.flatMap((row) => {
		const entry = decode(row);
		return entry ? [{
			sessionKey: row.session_key,
			entry
		}] : [];
	});
}
/** Final generation guards reuse an admitted native handle without freshness or schema queries. */
function readSessionEntryGenerationInDatabase(database, sessionKey) {
	const row = getExactSessionEntryQueries(database.db).canonical(sessionKey, "list", false);
	const entry = row && parseReadableSessionEntryData(database, row, "list");
	if (!entry) return;
	const { sessionId, lifecycleRevision, permissionMode, toolOverrides } = entry;
	return {
		sessionId,
		lifecycleRevision,
		permissionMode,
		toolOverrides
	};
}
function readExactSessionEntryRow(database, sessionKey, projection = "full", validation, includeWindowFacts) {
	const actor = readSessionActorTransactionState(database, { sessionKey });
	if (actor) {
		const selected = actor.entryRows.get(sessionKey);
		return selected && {
			row: {
				...structuredClone(selected.row),
				...includeWindowFacts ? {
					window: actor.window ? structuredClone(actor.window) : null,
					member_ids_json: JSON.stringify(actor.hot.members.map((member) => member.identityId)),
					board_present: actor.hasBoard ? 1 : 0,
					transcriptWatermark: {
						sessionId: selected.entry.sessionId,
						...actor.hot.transcript.watermark
					}
				} : {}
			},
			entry: attachSessionEntrySnapshots(structuredClone(selected.entry), {}, projection)
		};
	}
	return runSqliteReadOperationSync(database.db, () => {
		const row = readSelectedSessionEntryRows(database, sessionKey, projection, validation, includeWindowFacts ? {
			includeWindowFacts,
			includeBoardPresence: true,
			includeMembership: true
		} : void 0)[0];
		if (!row) return;
		const entry = parseReadableSqliteSessionEntryRow(database, row, projection);
		return entry ? {
			entry,
			row
		} : void 0;
	});
}
/** Capture exact rows once; failed cohort acquisition retains single-key error isolation. */
function prepareExactSessionEntryRowReads(database, sessionKeys, projection = "full", validation, options) {
	const actor = readSessionActorTransactionState(database);
	if (actor && !options?.includeRowTranscriptProjection && projection !== "delivery" && sessionKeys.every((key) => actor.entryRows.has(key) && (key === actor.hot.target.sessionKey || !actor.entryRows.get(key)))) return (sessionKey) => {
		const selected = readExactSessionEntryRow(database, sessionKey, projection, validation, options?.includeWindowFacts);
		if (selected) {
			if (options?.includeBoardPresence) selected.row.board_present = actor.hasBoard ? 1 : 0;
			if (options?.includeMembership) selected.row.member_ids_json = JSON.stringify(actor.hot.members.map((member) => member.identityId));
		}
		return selected;
	};
	return runSqliteReadOperationSync(database.db, () => {
		const readRows = (selection) => readSelectedSessionEntryRows(database, selection, projection, validation, options);
		let rows;
		try {
			rows = readRows(sessionKeys);
		} catch {
			if (options?.includeBoardPresence || options?.includeMembership || options?.includeWindowFacts || options?.includeRowTranscriptProjection || options?.onParticipantProjectionError || options?.projectParticipants === false) return (sessionKey) => runSqliteReadOperationSync(database.db, () => {
				const row = readRows(sessionKey)[0];
				const entry = row && (options.projectParticipants === false ? parseReadableSessionEntryData(database, row, projection) : prepareSqliteSessionEntryRowDecoder(database, [row], projection === "delivery" ? "list" : projection, true, options.onParticipantProjectionError)(row));
				return row && entry ? {
					entry,
					row
				} : void 0;
			});
			return (sessionKey) => readExactSessionEntryRow(database, sessionKey, projection === "delivery" ? "list" : projection, validation);
		}
		const byKey = new Map(rows.map((row) => [row.session_key, row]));
		const decodeRow = prepareSqliteSessionEntryRowDecoder(database, rows, projection, options?.projectParticipants !== false, options?.onParticipantProjectionError);
		return (sessionKey) => runSqliteReadOperationSync(database.db, () => {
			const row = byKey.get(toUSVString(sessionKey));
			if (!row) return;
			const entry = decodeRow(row);
			return entry ? {
				entry,
				row
			} : void 0;
		});
	});
}
function readExactSessionEntryRowValidated(database, sessionKey, projection = "full") {
	return runSqliteReadOperationSync(database.db, () => {
		assertCanonicalSqliteSessionKeysCurrent(database);
		return readExactSessionEntryRow(database, sessionKey, projection);
	});
}
/** Select a physical row while refusing any other admitted spelling. */
function readSessionEntryTargetRow(database, target, options = {}) {
	return runSqliteReadOperationSync(database.db, () => {
		assertCanonicalSqliteSessionKeysCurrent(database);
		const rows = target.storeKeys.flatMap((key) => {
			const row = readSelectedSessionEntryRows(database, key.trim(), options.projection ?? "full", void 0, options.includeWindowFacts ? {
				includeWindowFacts: true,
				includeMembership: true,
				includeBoardPresence: true
			} : void 0)[0];
			if (!row) return [];
			const entry = parseReadableSqliteSessionEntryRow(database, row, options.projection);
			return entry || options.guardRetainedWindows ? [{
				entry,
				row
			}] : [];
		});
		if (rows.length > 1) throw canonicalSessionKeyMigrationRequiredError(`duplicate rows resolve to canonical session key ${target.canonicalKey}`);
		const selected = rows[0];
		if (selected && selected.row.session_key !== target.canonicalKey && !options.allowCanonicalMove) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${target.canonicalKey}`);
		return selected;
	});
}
/** Only sentinel aliases share a logical identity with a different physical key. */
function readQualifiedSessionEntryRow(database, agentId, sessionKey, options = {}) {
	const parsed = parseAgentSessionKey(sessionKey);
	const sentinel = parsed?.rest ?? sessionKey;
	if (agentId !== database.agentId || parsed && parsed.agentId !== agentId || sentinel !== "global" && sentinel !== "unknown") return readSessionEntryRow(database, sessionKey, options.projection, options.includeWindowFacts);
	return readSessionEntryTargetRow(database, {
		canonicalKey: sessionKey,
		storeKeys: [sentinel, `agent:${agentId}:${sentinel}`]
	}, {
		...options,
		guardRetainedWindows: true
	});
}
const SESSION_ID_TRIM_CHARACTERS = "	\n\v\f\r \xA0            \u2028\u2029  　﻿";
/** Uses the native current-ID and trimmed legacy-ID winner order inside the reader owner. */
function readSessionEntryByIdInDatabase(database, selection) {
	return readWithCanonicalSessionAdmission(database, () => {
		assertCanonicalSqliteSessionKeysCurrent(database);
		const query = getNodeSqliteKysely(database.db).selectFrom("session_nodes").select("session_key").$if(selection.orderBy === "updatedAt", (ordered) => ordered.orderBy("updated_at", "desc")).orderBy("session_key");
		for (const trimLegacyId of selection.orderBy === "updatedAt" ? [true] : [false, true]) {
			const matches = iterateSqliteQuerySync(database.db, trimLegacyId ? query.where((eb) => eb(eb.fn("trim", ["current_session_id", eb.val(SESSION_ID_TRIM_CHARACTERS)]), "=", selection.sessionId)) : query.where("current_session_id", "=", selection.sessionId));
			for (const { session_key: sessionKey } of matches) {
				if (isInternalSessionEffectsKey(sessionKey)) continue;
				const selected = readExactSessionEntryRowValidated(database, sessionKey, selection.projection);
				if (selected) return {
					sessionKey,
					entry: selected.entry
				};
			}
		}
	});
}
//#endregion
export { validateDeliveryCanonicalSessionEntry as _, prepareSqliteSessionEntryRowDecoder as a, sessionEntryWindowColumns as b, readQualifiedSessionEntryRow as c, readSessionEntryGenerationInDatabase as d, readSessionEntryIdentity as f, readSessionKeyBySessionIdInDatabase as g, readSessionEntryTargetRow as h, prepareExactSessionEntryRowReads as i, readSessionChildEntriesInDatabase as l, readSessionEntryRowScan as m, parseReadableSessionEntryData as n, readExactSessionEntryRow as o, readSessionEntryRow as p, parseReadableSqliteSessionEntryRow as r, readExactSessionEntryRowValidated as s, SESSION_ID_TRIM_CHARACTERS as t, readSessionEntryByIdInDatabase as u, bindSessionEntryProvenance as v, hasStoredTranscriptEvents as x, prepareSessionEntryWindowRow as y };
