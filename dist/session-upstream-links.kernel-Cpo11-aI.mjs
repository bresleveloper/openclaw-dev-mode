import "./src-CZ2wJvNB.mjs";
import { t as safeParseJson } from "./json-coercion-C7YSvZ9t.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { t as ensureColumn } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { n as normalizeSqliteNumber } from "./sqlite-number-DM1AypRG.mjs";
import { C as SESSION_WATCH_PROVENANCE_EXPLICIT, S as SESSION_WATCH_PROVENANCE_AMBIENT_GROUP } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
//#region src/sessions/session-state-event-kinds.ts
const SESSION_CREATED_NOTICE_CONTEXT_PREFIX = "session-created:";
const NOTIFY_BY_SESSION_STATE_EVENT_KIND = {
	created: false,
	human_direct_message: true,
	upstream_missing: true,
	adopted: false,
	goal_changed: true,
	run_completed: false,
	run_failed: false,
	child_spawned: false,
	compacted: false
};
//#endregion
//#region src/sessions/session-state-events.kernel.ts
const SESSION_STATE_RETENTION_MS = 2592e6;
const SESSION_STATE_MAX_ROWS = 5e4;
const watcherSchemas = /* @__PURE__ */ new WeakSet();
function ensureWatcherStoreColumn(db) {
	if (watcherSchemas.has(db)) return;
	ensureColumn(db, "session_watch_cursors", "watcher_store_path TEXT");
	deferSqlitePostCommitPublication(db, () => watcherSchemas.add(db));
}
function isNotifiableWatcherKey(watcherSessionKey) {
	return parseAgentSessionKey(watcherSessionKey) != null;
}
function getSessionStateKysely(db) {
	return getNodeSqliteKysely(db);
}
function normalizeOptionalSqliteNumber(value) {
	return value === void 0 ? void 0 : normalizeSqliteNumber(value);
}
function bindSessionStateEvent(input, occurredAt) {
	return {
		dedupe_key: input.dedupeKey ?? null,
		session_key: input.sessionKey,
		session_id: input.sessionId ?? null,
		agent_id: input.agentId,
		kind: input.kind,
		actor_type: input.actorType,
		actor_id: input.actorId ?? null,
		run_id: input.runId ?? null,
		occurred_at: occurredAt,
		summary: input.summary,
		payload_json: input.payload ? JSON.stringify(input.payload) : null
	};
}
function readCursor(db, watcherSessionKey, targetSessionKey) {
	return executeSqliteQueryTakeFirstSync(db, getSessionStateKysely(db).selectFrom("session_watch_cursors").selectAll().where("watcher_session_key", "=", watcherSessionKey).where("target_session_key", "=", targetSessionKey));
}
function readMaterialCursors(db, watcherSessionKeys, targetSessionKey) {
	if (watcherSessionKeys.length <= 1 || watcherSessionKeys.some((key) => !key.isWellFormed())) return;
	const cursors = /* @__PURE__ */ new Map();
	for (let offset = 0; offset < watcherSessionKeys.length; offset += 500) {
		const rows = executeSqliteQuerySync(db, getSessionStateKysely(db).selectFrom("session_watch_cursors").selectAll().where("target_session_key", "=", targetSessionKey).where("watcher_session_key", "in", watcherSessionKeys.slice(offset, offset + 500))).rows;
		for (const row of rows) cursors.set(row.watcher_session_key, row);
	}
	return cursors;
}
function isAmbientGroupWatchCursor(row) {
	return row?.provenance === SESSION_WATCH_PROVENANCE_AMBIENT_GROUP;
}
function upsertSeedCursor(params) {
	ensureWatcherStoreColumn(params.db);
	executeSqliteQuerySync(params.db, getSessionStateKysely(params.db).insertInto("session_watch_cursors").values({
		watcher_session_key: params.watcherSessionKey,
		watcher_store_path: params.watcherStorePath ?? null,
		target_session_key: params.targetSessionKey,
		last_seen_sequence: params.sequence,
		notified_sequence: params.sequence,
		material_sequence: params.sequence,
		provenance: params.provenance ?? "explicit",
		updated_at: params.now
	}).onConflict((conflict) => conflict.columns(["watcher_session_key", "target_session_key"]).doUpdateSet({
		watcher_store_path: params.watcherStorePath ?? null,
		provenance: params.provenance ?? "explicit",
		last_seen_sequence: params.sequence,
		notified_sequence: params.sequence,
		material_sequence: params.sequence,
		updated_at: params.now
	})));
}
function updateMaterialCursor(params) {
	const { current } = params;
	const watcherStorePath = current ? current.watcher_store_path ?? null : params.watcherStorePath ?? null;
	const lastSeen = normalizeOptionalSqliteNumber(current?.last_seen_sequence) ?? 0;
	if (current && params.watcherStorePath !== void 0 && params.watcherStorePath !== watcherStorePath) return {
		lastSeenSequence: lastSeen,
		queueOnly: false,
		watcherStorePath: null
	};
	ensureWatcherStoreColumn(params.db);
	const notified = normalizeOptionalSqliteNumber(current?.notified_sequence) ?? 0;
	const frozenNotified = notified === lastSeen ? params.sequence : notified;
	executeSqliteQuerySync(params.db, getSessionStateKysely(params.db).insertInto("session_watch_cursors").values({
		watcher_session_key: params.watcherSessionKey,
		watcher_store_path: watcherStorePath,
		target_session_key: params.targetSessionKey,
		last_seen_sequence: lastSeen,
		notified_sequence: frozenNotified,
		material_sequence: params.sequence,
		provenance: SESSION_WATCH_PROVENANCE_EXPLICIT,
		updated_at: params.now
	}).onConflict((conflict) => conflict.columns(["watcher_session_key", "target_session_key"]).doUpdateSet({
		notified_sequence: frozenNotified,
		material_sequence: params.sequence,
		updated_at: params.now
	})));
	return {
		lastSeenSequence: lastSeen,
		queueOnly: isAmbientGroupWatchCursor(current),
		watcherStorePath
	};
}
const SESSION_STATE_OCCURRED_AT_MAX_SKEW_MS = 864e5;
function clampSessionStateOccurredAt(value, now) {
	if (typeof value !== "number" || !Number.isFinite(value)) return now;
	return Math.min(Math.max(value, now - SESSION_STATE_OCCURRED_AT_MAX_SKEW_MS), now);
}
/** The caller owns one synchronous transaction for the event, head, and cursors. */
function recordSessionStateEventInDatabase(db, input, now) {
	const occurredAt = clampSessionStateOccurredAt(input.occurredAt, now);
	const notices = [];
	const insert = executeSqliteQuerySync(db, getSessionStateKysely(db).insertInto("session_state_events").values(bindSessionStateEvent(input, occurredAt)).onConflict((conflict) => conflict.column("dedupe_key").doNothing()));
	const insertedSequence = insert.insertId ? Number(insert.insertId) : void 0;
	if (insertedSequence === void 0) {
		if (!input.dedupeKey) return { notices };
		return {
			row: executeSqliteQueryTakeFirstSync(db, getSessionStateKysely(db).selectFrom("session_state_events").selectAll().where("dedupe_key", "=", input.dedupeKey)),
			notices
		};
	}
	executeSqliteQuerySync(db, getSessionStateKysely(db).insertInto("session_state_heads").values({
		session_key: input.sessionKey,
		agent_id: input.agentId,
		last_sequence: insertedSequence,
		updated_at: now
	}).onConflict((conflict) => conflict.columns(["session_key", "agent_id"]).doUpdateSet({
		last_sequence: insertedSequence,
		updated_at: now
	})));
	const registeredWatcherKeys = NOTIFY_BY_SESSION_STATE_EVENT_KIND[input.kind] ? executeSqliteQuerySync(db, getSessionStateKysely(db).selectFrom("session_watch_cursors").select("watcher_session_key").where("target_session_key", "=", input.sessionKey)).rows.map((row) => row.watcher_session_key) : [];
	const watcherSessionKeys = [.../* @__PURE__ */ new Set([...input.watcherSessionKeys ?? [], ...registeredWatcherKeys])].filter((key) => Boolean(key) && isNotifiableWatcherKey(key));
	const cursors = NOTIFY_BY_SESSION_STATE_EVENT_KIND[input.kind] && watcherSessionKeys.length > 1 ? readMaterialCursors(db, watcherSessionKeys.filter((key) => key !== input.actorId), input.sessionKey) : void 0;
	for (const watcherSessionKey of watcherSessionKeys) {
		if (input.kind === "child_spawned") {
			upsertSeedCursor({
				db,
				watcherSessionKey,
				watcherStorePath: input.watcherStorePaths?.[watcherSessionKey],
				targetSessionKey: input.sessionKey,
				sequence: insertedSequence,
				now
			});
			continue;
		}
		if (!NOTIFY_BY_SESSION_STATE_EVENT_KIND[input.kind] || input.actorId === watcherSessionKey) continue;
		const materialCursor = updateMaterialCursor({
			db,
			current: cursors ? cursors.get(watcherSessionKey) : readCursor(db, watcherSessionKey, input.sessionKey),
			watcherSessionKey,
			watcherStorePath: input.watcherStorePaths?.[watcherSessionKey],
			targetSessionKey: input.sessionKey,
			sequence: insertedSequence,
			now
		});
		notices.push({
			watcherSessionKey,
			watcherStorePath: materialCursor.watcherStorePath,
			targetSessionKey: input.sessionKey,
			lastSeenSequence: materialCursor.lastSeenSequence,
			queueOnly: materialCursor.queueOnly
		});
	}
	return {
		row: executeSqliteQueryTakeFirstSync(db, getSessionStateKysely(db).selectFrom("session_state_events").selectAll().where("sequence", "=", insertedSequence)),
		notices
	};
}
/** The caller owns the transaction and schedules retention after notice publication. */
function pruneSessionStateEventsInDatabase(db, now) {
	const kysely = getSessionStateKysely(db);
	const stampPrunedWatermarks = (predicate) => {
		let query = kysely.selectFrom("session_state_events").select(["session_key", "agent_id"]).select((eb) => eb.fn.max("sequence").as("max_sequence")).groupBy(["session_key", "agent_id"]);
		if (predicate.occurredBefore !== void 0) query = query.where("occurred_at", "<", predicate.occurredBefore);
		if (predicate.sequenceAtOrBelow !== void 0) query = query.where("sequence", "<=", predicate.sequenceAtOrBelow);
		const rows = executeSqliteQuerySync(db, query).rows;
		for (let offset = 0; offset < rows.length; offset += 100) {
			const selections = rows.slice(offset, offset + 100).map((row) => kysely.selectNoFrom((eb) => [
				eb.val(row.session_key).as("session_key"),
				eb.val(row.agent_id).as("agent_id"),
				eb.val(normalizeSqliteNumber(row.max_sequence) ?? 0).as("max_sequence")
			]));
			executeSqliteQuerySync(db, kysely.with("pruned", () => selections[0].unionAll(selections.slice(1))).with("watermarks", (qb) => qb.selectFrom("pruned").select(["session_key", "agent_id"]).select((eb) => eb.fn.max("max_sequence").as("max_sequence")).groupBy(["session_key", "agent_id"])).updateTable("session_state_heads").from("watermarks").set((eb) => ({
				pruned_max_sequence: eb.ref("watermarks.max_sequence"),
				updated_at: now
			})).whereRef("session_state_heads.session_key", "=", "watermarks.session_key").whereRef("session_state_heads.agent_id", "=", "watermarks.agent_id").whereRef("session_state_heads.pruned_max_sequence", "<", "watermarks.max_sequence"));
		}
	};
	const retentionCutoff = now - SESSION_STATE_RETENTION_MS;
	stampPrunedWatermarks({ occurredBefore: retentionCutoff });
	executeSqliteQuerySync(db, kysely.deleteFrom("session_state_events").where("occurred_at", "<", retentionCutoff));
	const sequenceCutoff = normalizeOptionalSqliteNumber(executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("session_state_events").select("sequence").orderBy("sequence", "desc").offset(SESSION_STATE_MAX_ROWS).limit(1))?.sequence);
	if (sequenceCutoff !== void 0) {
		stampPrunedWatermarks({ sequenceAtOrBelow: sequenceCutoff });
		executeSqliteQuerySync(db, kysely.deleteFrom("session_state_events").where("sequence", "<=", sequenceCutoff));
	}
	const cursorCutoff = now - SESSION_STATE_RETENTION_MS;
	executeSqliteQuerySync(db, kysely.deleteFrom("session_watch_cursors").where("updated_at", "<", cursorCutoff));
}
//#endregion
//#region src/sessions/session-upstream-links.kernel.ts
function parseJson(value) {
	if (value === null) return null;
	return safeParseJson(value) ?? null;
}
function rowToSessionUpstreamLink(row) {
	return {
		sessionKey: row.session_key,
		agentId: row.agent_id,
		catalogId: row.catalog_id,
		hostId: row.host_id,
		threadId: row.thread_id,
		upstreamKind: row.upstream_kind,
		upstreamRef: parseJson(row.upstream_ref_json),
		marker: parseJson(row.last_marker_json),
		...row.last_scanned_at === null ? {} : { lastScannedAt: normalizeSqliteNumber(row.last_scanned_at) ?? 0 },
		createdAt: normalizeSqliteNumber(row.created_at) ?? 0,
		updatedAt: normalizeSqliteNumber(row.updated_at) ?? 0
	};
}
function listWatchedSessionUpstreamLinksInDatabase(db) {
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("session_upstream_links as links").selectAll("links").where((eb) => eb.exists(eb.selectFrom("session_watch_cursors as cursors").select("cursors.target_session_key").whereRef("cursors.target_session_key", "=", "links.session_key"))).orderBy("links.catalog_id", "asc").orderBy("links.session_key", "asc")).rows.map(rowToSessionUpstreamLink);
}
//#endregion
export { isNotifiableWatcherKey as a, readCursor as c, SESSION_CREATED_NOTICE_CONTEXT_PREFIX as d, isAmbientGroupWatchCursor as i, recordSessionStateEventInDatabase as l, rowToSessionUpstreamLink as n, normalizeOptionalSqliteNumber as o, getSessionStateKysely as r, pruneSessionStateEventsInDatabase as s, listWatchedSessionUpstreamLinksInDatabase as t, upsertSeedCursor as u };
