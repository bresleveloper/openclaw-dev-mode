import { n as safeParseJsonRecord } from "./json-coercion-C7YSvZ9t.mjs";
import { n as buildAgentMainSessionKey } from "./session-key-CUi_tcgF.mjs";
import { S as isSubagentSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { n as normalizeSqliteNumber } from "./sqlite-number-DM1AypRG.mjs";
import { C as SESSION_WATCH_PROVENANCE_EXPLICIT, S as SESSION_WATCH_PROVENANCE_AMBIENT_GROUP } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { i as runOpenClawStateWorkerOperation, t as executeOpenClawStateWorker } from "./openclaw-state-worker-store-YAl4mP45.mjs";
import { p as requestSessionEventWake } from "./heartbeat-wake-bWS25cgK.mjs";
import { n as isSystemEventStoreCurrent } from "./system-event-ownership-CHVGbaAW.mjs";
import { i as enqueueSystemEvent } from "./system-events-ANKIkU0W.mjs";
import { S as captureSessionWatcherStorePaths, l as loadSessionEntryReadOnly, w as resolvePhysicalSessionStorePath } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { t as classifySessionKind } from "./classify-session-kind-BOSciWMV.mjs";
import { a as isNotifiableWatcherKey, c as readCursor, i as isAmbientGroupWatchCursor, l as recordSessionStateEventInDatabase, n as rowToSessionUpstreamLink, o as normalizeOptionalSqliteNumber, r as getSessionStateKysely, s as pruneSessionStateEventsInDatabase, u as upsertSeedCursor } from "./session-upstream-links.kernel-Cpo11-aI.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/sessions/session-state-notices.ts
/** Stale-state notice text, coalescing keys, and watcher eligibility. */
const SESSION_STATE_CONTEXT_PREFIX = "session-state:";
const SESSION_STATE_WAKE_COALESCE_MS = 2e4;
function encodeNoticeTarget(sessionKey) {
	return Buffer.from(sessionKey, "utf8").toString("hex");
}
function decodeSessionStateNoticeContextKey(contextKey) {
	if (!contextKey.startsWith(SESSION_STATE_CONTEXT_PREFIX)) return;
	const encoded = contextKey.slice(14);
	if (!encoded || encoded.length % 2 !== 0 || !/^[0-9a-f]+$/.test(encoded)) return;
	try {
		return new TextDecoder("utf-8", {
			fatal: true,
			ignoreBOM: true
		}).decode(Buffer.from(encoded, "hex"));
	} catch {
		return;
	}
}
function sessionStateNoticeText(targetSessionKey, lastSeenSequence) {
	return `Session "${targetSessionKey}" changed (other actor). Reconcile before acting: session_status sessionKey "${targetSessionKey}" changesSince ${lastSeenSequence}.`;
}
function shouldWakeWatcher(watcherSessionKey) {
	return !isSubagentSessionKey(watcherSessionKey);
}
function enqueueSessionStateNotice(params) {
	enqueueSystemEvent(sessionStateNoticeText(params.targetSessionKey, params.lastSeenSequence), {
		sessionKey: params.watcherSessionKey,
		sessionStorePath: params.watcherStorePath ?? null,
		contextKey: `${SESSION_STATE_CONTEXT_PREFIX}${encodeNoticeTarget(params.targetSessionKey)}`,
		...params.queueOnly ? { replace: true } : {}
	});
	if (params.queueOnly) return;
	if (!shouldWakeWatcher(params.watcherSessionKey)) return;
	requestSessionEventWake({
		source: "session-state",
		intent: "immediate",
		reason: `session-state:${params.targetSessionKey}`,
		sessionKey: params.watcherSessionKey,
		sessionStorePath: params.watcherStorePath ?? null,
		coalesceMs: SESSION_STATE_WAKE_COALESCE_MS
	});
}
//#endregion
//#region src/sessions/session-upstream-links.ts
const log$1 = createSubsystemLogger("sessions/upstream-links");
function getSessionUpstreamKysely(db) {
	return getNodeSqliteKysely(db);
}
function upsertSessionUpstreamLink(input, options = {}) {
	const now = options.now ?? Date.now();
	try {
		return runOpenClawStateWriteTransaction(({ db }) => {
			options.assertCommitAllowed?.();
			const written = executeSqliteQuerySync(db, getSessionUpstreamKysely(db).insertInto("session_upstream_links").values({
				session_key: input.sessionKey,
				agent_id: input.agentId,
				catalog_id: input.catalogId,
				host_id: input.hostId,
				thread_id: input.threadId,
				upstream_kind: input.upstreamKind,
				upstream_ref_json: JSON.stringify(input.upstreamRef),
				last_marker_json: JSON.stringify(input.marker),
				last_scanned_at: null,
				created_at: now,
				updated_at: now
			}).onConflict((conflict) => options.ifAbsent ? conflict.columns(["session_key", "agent_id"]).doNothing() : conflict.columns(["session_key", "agent_id"]).doUpdateSet((eb) => {
				const sourceChanged = eb.or([
					eb("session_upstream_links.thread_id", "!=", eb.ref("excluded.thread_id")),
					eb("session_upstream_links.host_id", "!=", eb.ref("excluded.host_id")),
					eb("session_upstream_links.upstream_kind", "!=", eb.ref("excluded.upstream_kind")),
					eb("session_upstream_links.upstream_ref_json", "!=", eb.ref("excluded.upstream_ref_json"))
				]);
				return {
					agent_id: input.agentId,
					catalog_id: input.catalogId,
					host_id: input.hostId,
					thread_id: input.threadId,
					upstream_kind: input.upstreamKind,
					upstream_ref_json: JSON.stringify(input.upstreamRef),
					last_marker_json: eb.case().when(sourceChanged).then(JSON.stringify(input.marker)).else(eb.ref("session_upstream_links.last_marker_json")).end(),
					last_scanned_at: eb.case().when(sourceChanged).then(null).else(eb.ref("session_upstream_links.last_scanned_at")).end(),
					updated_at: now
				};
			}))).numAffectedRows === 1n;
			options.assertCommitAllowed?.();
			return written;
		}, options);
	} catch (error) {
		if (options.ifAbsent) throw error;
		log$1.warn(`failed to upsert session upstream link: ${String(error)}`);
		return false;
	}
}
function readSessionUpstreamLink(sessionKey, agentId, options = {}) {
	try {
		const { db } = openOpenClawStateDatabase(options);
		const row = executeSqliteQuerySync(db, getSessionUpstreamKysely(db).selectFrom("session_upstream_links").selectAll().where("session_key", "=", sessionKey).where("agent_id", "=", agentId)).rows[0];
		return row ? rowToSessionUpstreamLink(row) : void 0;
	} catch (error) {
		log$1.warn(`failed to read session upstream link: ${String(error)}`);
		return;
	}
}
function updateSessionUpstreamLinkMarker(sessionKey, agentId, marker, options = {}) {
	const now = options.now ?? Date.now();
	try {
		let updated = false;
		runOpenClawStateWriteTransaction(({ db }) => {
			let query = getSessionUpstreamKysely(db).updateTable("session_upstream_links").set({
				last_marker_json: JSON.stringify(marker),
				last_scanned_at: now,
				updated_at: now
			}).where("session_key", "=", sessionKey).where("agent_id", "=", agentId);
			if (options.expectedUpdatedAt !== void 0) query = query.where("updated_at", "=", options.expectedUpdatedAt);
			updated = executeSqliteQuerySync(db, query).numAffectedRows === 1n;
		}, options);
		return updated;
	} catch (error) {
		log$1.warn(`failed to update session upstream marker: ${String(error)}`);
		return false;
	}
}
function deleteSessionUpstreamLink(sessionKey, agentId, options = {}) {
	try {
		return runOpenClawStateWriteTransaction(({ db }) => {
			options.assertCommitAllowed?.();
			const kysely = getSessionUpstreamKysely(db);
			if (options.expected) {
				const row = executeSqliteQuerySync(db, kysely.selectFrom("session_upstream_links").selectAll().where("session_key", "=", sessionKey).where("agent_id", "=", agentId)).rows[0];
				if (!row) return "absent";
				if (!isDeepStrictEqual(rowToSessionUpstreamLink(row), options.expected)) return "changed";
			}
			executeSqliteQuerySync(db, kysely.deleteFrom("session_upstream_links").where("session_key", "=", sessionKey).where("agent_id", "=", agentId));
			options.assertCommitAllowed?.();
			return "deleted";
		}, options);
	} catch (error) {
		if (options.expected) throw error;
		log$1.warn(`failed to delete session upstream link: ${String(error)}`);
		return;
	}
}
async function listWatchedSessionUpstreamLinks(options = {}) {
	const grouped = /* @__PURE__ */ new Map();
	try {
		const links = await executeOpenClawStateWorker(captureOpenClawStateWorkerContext(options), {
			type: "sessionUpstream.listWatched",
			input: void 0
		});
		const keyCounts = /* @__PURE__ */ new Map();
		for (const link of links) keyCounts.set(link.sessionKey, (keyCounts.get(link.sessionKey) ?? 0) + 1);
		for (const link of links) {
			if ((keyCounts.get(link.sessionKey) ?? 0) > 1) {
				log$1.warn(`skipping ambiguous upstream links for ${link.sessionKey}: multiple agents adopt the same key`);
				continue;
			}
			const catalogLinks = grouped.get(link.catalogId) ?? [];
			catalogLinks.push(link);
			grouped.set(link.catalogId, catalogLinks);
		}
	} catch (error) {
		log$1.warn(`failed to list watched session upstream links: ${String(error)}`);
	}
	return grouped;
}
//#endregion
//#region src/sessions/session-state-events.ts
/** Best-effort durable signal log for session state changes. */
const SESSION_STATE_PRUNE_INTERVAL_MS = 36e5;
const log = createSubsystemLogger("sessions/state-events");
let lastPruneAt = 0;
let prunePending = false;
function rowToSessionStateEvent(row) {
	const payload = row.payload_json ? safeParseJsonRecord(row.payload_json) : void 0;
	return {
		sequence: normalizeSqliteNumber(row.sequence) ?? 0,
		sessionKey: row.session_key,
		...row.session_id ? { sessionId: row.session_id } : {},
		agentId: row.agent_id,
		kind: row.kind,
		actorType: row.actor_type,
		...row.actor_id ? { actorId: row.actor_id } : {},
		...row.run_id ? { runId: row.run_id } : {},
		occurredAt: normalizeSqliteNumber(row.occurred_at) ?? 0,
		summary: row.summary,
		...payload ? { payload } : {}
	};
}
/** Classify the actor once at producer boundaries; missing provenance is interactive human input. */
function classifySessionStateActor(opts) {
	if (opts.inputProvenance?.kind === "inter_session") return {
		actorType: "agent",
		...opts.inputProvenance.sourceSessionKey ? { actorId: opts.inputProvenance.sourceSessionKey } : {}
	};
	if (opts.inputProvenance?.kind === "internal_system" || (opts.internalEvents?.length ?? 0) > 0 || opts.sessionEffects === "internal") return { actorType: "system" };
	return {
		actorType: "human",
		...opts.humanActorId ? { actorId: opts.humanActorId } : {}
	};
}
/** Append a signal-log event without allowing signaling failure to fail the originating action. */
function recordSessionStateEvent(input, options = {}) {
	const now = options.now ?? Date.now();
	try {
		const ownedInput = {
			...input,
			watcherStorePaths: input.watcherStorePaths ?? captureSessionWatcherStorePaths(input.watcherSessionKeys, options.env)
		};
		const result = runOpenClawStateWriteTransaction(({ db }) => recordSessionStateEventInDatabase(db, ownedInput, now), options);
		for (const notice of result.notices) enqueueSessionStateNotice(notice);
		if (!prunePending && now - lastPruneAt > SESSION_STATE_PRUNE_INTERVAL_MS) pruneSessionStateEvents({
			...options,
			now
		});
		return result.row ? rowToSessionStateEvent(result.row) : void 0;
	} catch (error) {
		log.warn(`failed to record session state event: ${String(error)}`);
		return;
	}
}
/** Return the durable signal-log head for one session; degrades to 0 on read failure. */
function getSessionStateVersion(sessionKey, agentId, options = {}) {
	try {
		const { db } = openOpenClawStateDatabase(options);
		const row = executeSqliteQueryTakeFirstSync(db, getSessionStateKysely(db).selectFrom("session_state_heads").select("last_sequence").where("session_key", "=", sessionKey).where("agent_id", "=", agentId));
		return normalizeOptionalSqliteNumber(row?.last_sequence) ?? 0;
	} catch (error) {
		log.warn(`failed to read session state version: ${String(error)}`);
		return 0;
	}
}
/** Batch durable signal-log heads for session-list enrichment, keyed agent → session key. */
function getSessionStateVersions(refs, options = {}) {
	const keys = [...new Set(refs.map((ref) => ref.sessionKey).filter(Boolean))];
	if (keys.length === 0) return {};
	const byAgent = {};
	try {
		const { db } = openOpenClawStateDatabase(options);
		for (let offset = 0; offset < keys.length; offset += 500) {
			const rows = executeSqliteQuerySync(db, getSessionStateKysely(db).selectFrom("session_state_heads").select([
				"session_key",
				"agent_id",
				"last_sequence"
			]).where("session_key", "in", keys.slice(offset, offset + 500))).rows;
			for (const row of rows) (byAgent[row.agent_id] ??= {})[row.session_key] = normalizeSqliteNumber(row.last_sequence) ?? 0;
		}
	} catch (error) {
		log.warn(`failed to read session state versions: ${String(error)}`);
	}
	return byAgent;
}
/** List retained signal-log events after a version without advancing watcher cursors. */
function listSessionStateEventsSince(sessionKey, agentId, afterSequence, limit = 200, options = {}) {
	try {
		const boundedLimit = Math.max(1, Math.min(200, Math.floor(limit)));
		const { db } = openOpenClawStateDatabase(options);
		const kysely = getSessionStateKysely(db);
		const rows = executeSqliteQuerySync(db, kysely.selectFrom("session_state_events").selectAll().where("session_key", "=", sessionKey).where("agent_id", "=", agentId).where("sequence", ">", afterSequence).orderBy("sequence", "asc").limit(boundedLimit + 1)).rows;
		const earliest = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("session_state_events").select((eb) => eb.fn.min("sequence").as("sequence")).where("session_key", "=", sessionKey).where("agent_id", "=", agentId));
		const headRow = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("session_state_heads").select(["last_sequence", "pruned_max_sequence"]).where("session_key", "=", sessionKey).where("agent_id", "=", agentId));
		const head = normalizeOptionalSqliteNumber(headRow?.last_sequence) ?? 0;
		const prunedMax = normalizeOptionalSqliteNumber(headRow?.pruned_max_sequence) ?? 0;
		const earliestAvailableSequence = normalizeOptionalSqliteNumber(earliest?.sequence) ?? (head > 0 ? head + 1 : 0);
		return {
			events: rows.slice(0, boundedLimit).map(rowToSessionStateEvent),
			truncated: rows.length > boundedLimit,
			earliestAvailableSequence,
			historyGap: afterSequence < prunedMax
		};
	} catch (error) {
		log.warn(`failed to list session state events: ${String(error)}`);
		return {
			events: [],
			truncated: false,
			earliestAvailableSequence: 0,
			historyGap: false
		};
	}
}
/** Ack only the frozen notice watermark; advancing to head would lose an interleaved event. */
function acknowledgeSessionStateNotices(watcherSessionKey, targetSessionKeys, options = {}) {
	const now = options.now ?? Date.now();
	const followups = [];
	try {
		runOpenClawStateWriteTransaction(({ db }) => {
			for (const targetSessionKey of new Set(targetSessionKeys)) {
				const row = readCursor(db, watcherSessionKey, targetSessionKey);
				if (!row || !isSystemEventStoreCurrent(watcherSessionKey, row.watcher_store_path ?? null)) continue;
				const notified = normalizeSqliteNumber(row.notified_sequence) ?? 0;
				const material = normalizeSqliteNumber(row.material_sequence) ?? 0;
				const nextNotified = material > notified ? material : notified;
				executeSqliteQuerySync(db, getSessionStateKysely(db).updateTable("session_watch_cursors").set({
					last_seen_sequence: notified,
					notified_sequence: nextNotified,
					updated_at: now
				}).where("watcher_session_key", "=", watcherSessionKey).where("target_session_key", "=", targetSessionKey));
				if (material > notified) followups.push({
					watcherSessionKey,
					watcherStorePath: row.watcher_store_path ?? null,
					targetSessionKey,
					lastSeenSequence: notified,
					queueOnly: isAmbientGroupWatchCursor(row)
				});
			}
		}, options);
		for (const followup of followups) enqueueSessionStateNotice(followup);
	} catch (error) {
		log.warn(`failed to acknowledge session state notices: ${String(error)}`);
	}
}
/** Reset parent-side assumptions while retaining target history across session incarnations. */
function handleSessionStateSessionReset(sessionKey, options = {}) {
	try {
		runOpenClawStateWriteTransaction(({ db }) => {
			executeSqliteQuerySync(db, getSessionStateKysely(db).deleteFrom("session_watch_cursors").where("watcher_session_key", "=", sessionKey));
		}, options);
	} catch (error) {
		log.warn(`failed to reset session state cursors: ${String(error)}`);
	}
}
/** Delete all signal-log and cursor state owned by a deleted session key. */
function handleSessionStateSessionDeleted(sessionKey, agentId, options = {}) {
	deleteSessionUpstreamLink(sessionKey, agentId, options);
	try {
		runOpenClawStateWriteTransaction(({ db }) => {
			const kysely = getSessionStateKysely(db);
			executeSqliteQuerySync(db, kysely.deleteFrom("session_state_events").where("session_key", "=", sessionKey).where("agent_id", "=", agentId));
			executeSqliteQuerySync(db, kysely.deleteFrom("session_state_heads").where("session_key", "=", sessionKey).where("agent_id", "=", agentId));
			executeSqliteQuerySync(db, kysely.deleteFrom("session_watch_cursors").where((eb) => eb.or([eb("watcher_session_key", "=", sessionKey), eb("target_session_key", "=", sessionKey)])));
		}, options);
	} catch (error) {
		log.warn(`failed to delete session state history: ${String(error)}`);
	}
}
function sessionExists(sessionKey, env) {
	try {
		return Boolean(loadSessionEntryReadOnly({
			sessionKey,
			clone: false,
			env
		}));
	} catch {
		return false;
	}
}
/** Re-materialize pending notices after the in-memory queue is lost on restart. */
function sweepSessionStateWatchNotices(options = {}) {
	const now = options.now ?? Date.now();
	try {
		const { db } = openOpenClawStateDatabase(options);
		const pendingRows = executeSqliteQuerySync(db, getSessionStateKysely(db).selectFrom("session_watch_cursors").selectAll().whereRef("material_sequence", ">", "last_seen_sequence")).rows.filter((row) => sessionExists(row.watcher_session_key, options.env));
		runOpenClawStateWriteTransaction(({ db: writeDb }) => {
			for (const row of pendingRows) executeSqliteQuerySync(writeDb, getSessionStateKysely(writeDb).updateTable("session_watch_cursors").set({
				notified_sequence: row.material_sequence,
				updated_at: now
			}).where("watcher_session_key", "=", row.watcher_session_key).where("target_session_key", "=", row.target_session_key));
		}, options);
		for (const row of pendingRows) enqueueSessionStateNotice({
			watcherSessionKey: row.watcher_session_key,
			watcherStorePath: row.watcher_store_path ?? null,
			targetSessionKey: row.target_session_key,
			lastSeenSequence: normalizeSqliteNumber(row.last_seen_sequence) ?? 0,
			queueOnly: isAmbientGroupWatchCursor(row)
		});
		pruneSessionStateEvents({
			...options,
			now
		});
	} catch (error) {
		log.warn(`failed to sweep session state notices: ${String(error)}`);
	}
}
/** Enforce bounded retained history without regressing durable per-session heads. */
function pruneSessionStateEvents(options = {}) {
	const now = options.now ?? Date.now();
	try {
		runOpenClawStateWriteTransaction(({ db }) => pruneSessionStateEventsInDatabase(db, now), options);
		lastPruneAt = now;
	} catch (error) {
		log.warn(`failed to prune session state history: ${String(error)}`);
	}
}
/** Record one successful compaction from the two concrete v1 owners. */
function recordSessionCompacted(params) {
	if (!params.sessionKey) return;
	recordSessionStateEvent({
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		agentId: params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey),
		kind: "compacted",
		actorType: "system",
		runId: params.runId,
		dedupeKey: `compacted:${params.operationId}`,
		summary: "session compacted"
	});
}
/** Record a persisted goal mutation using lineage already available at the session-store seam. */
async function recordSessionGoalChanged(params) {
	try {
		const context = captureOpenClawStateWorkerContext();
		const now = Date.now();
		const watcherSessionKey = params.entry.spawnedBy ?? params.entry.parentSessionKey;
		const input = {
			sessionKey: params.sessionKey,
			sessionId: params.entry.sessionId,
			agentId: params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey),
			kind: "goal_changed",
			actorType: params.actor?.type ?? "system",
			...params.actor?.id ? { actorId: params.actor.id } : {},
			summary: params.summary,
			...watcherSessionKey ? { watcherSessionKeys: [watcherSessionKey] } : {},
			watcherStorePaths: captureSessionWatcherStorePaths(watcherSessionKey ? [watcherSessionKey] : [])
		};
		await runOpenClawStateWorkerOperation(context, async (scope) => {
			const notices = await scope.execute({
				type: "sessionState.recordGoalChange",
				input: {
					event: input,
					now
				}
			});
			for (const notice of notices) enqueueSessionStateNotice(notice);
			if (!prunePending && now - lastPruneAt > SESSION_STATE_PRUNE_INTERVAL_MS) {
				prunePending = true;
				try {
					await scope.execute({
						type: "sessionState.prune",
						input: { now }
					});
					lastPruneAt = Math.max(lastPruneAt, now);
				} catch (error) {
					log.warn(`failed to prune session state history: ${String(error)}`);
				} finally {
					prunePending = false;
				}
			}
		});
	} catch (error) {
		try {
			log.warn(`failed to record session state event: ${String(error)}`);
		} catch {}
	}
}
/** True when any seeded or explicitly registered watcher cursor targets this session. */
function hasSessionStateWatchers(targetSessionKey, options = {}) {
	try {
		const { db } = openOpenClawStateDatabase(options);
		return executeSqliteQueryTakeFirstSync(db, getSessionStateKysely(db).selectFrom("session_watch_cursors").select("watcher_session_key").where("target_session_key", "=", targetSessionKey).limit(1)) !== void 0;
	} catch (error) {
		log.warn(`failed to probe session state watchers: ${String(error)}`);
		return false;
	}
}
/** List durable ambient-group targets owned by one watcher; failures grant nothing. */
function listAmbientGroupWatchTargets(watcherSessionKey, options = {}) {
	try {
		const { db } = openOpenClawStateDatabase(options);
		const rows = executeSqliteQuerySync(db, getSessionStateKysely(db).selectFrom("session_watch_cursors").select("target_session_key").where("watcher_session_key", "=", watcherSessionKey).where("provenance", "=", SESSION_WATCH_PROVENANCE_AMBIENT_GROUP)).rows;
		return new Set(rows.map((row) => row.target_session_key));
	} catch (error) {
		log.warn(`failed to list ambient group watch targets: ${String(error)}`);
		return /* @__PURE__ */ new Set();
	}
}
/** Register an explicit watcher (e.g. a sessions_send coordinator) for a target session. */
function registerSessionStateWatch(params, options = {}) {
	if (params.watcherSessionKey === params.targetSessionKey || !isNotifiableWatcherKey(params.watcherSessionKey)) return false;
	const now = options.now ?? Date.now();
	try {
		const watcherStorePath = resolvePhysicalSessionStorePath({
			sessionKey: params.watcherSessionKey,
			env: options.env
		});
		let registered = false;
		runOpenClawStateWriteTransaction(({ db }) => {
			const existing = readCursor(db, params.watcherSessionKey, params.targetSessionKey);
			if (existing?.watcher_store_path === watcherStorePath) {
				if (existing.provenance !== "explicit") executeSqliteQuerySync(db, getSessionStateKysely(db).updateTable("session_watch_cursors").set({ provenance: SESSION_WATCH_PROVENANCE_EXPLICIT }).where("watcher_session_key", "=", params.watcherSessionKey).where("target_session_key", "=", params.targetSessionKey));
				registered = true;
				return;
			}
			const agentId = params.targetAgentId ?? resolveAgentIdFromSessionKey(params.targetSessionKey);
			const head = executeSqliteQueryTakeFirstSync(db, getSessionStateKysely(db).selectFrom("session_state_heads").select("last_sequence").where("session_key", "=", params.targetSessionKey).where("agent_id", "=", agentId));
			upsertSeedCursor({
				db,
				watcherSessionKey: params.watcherSessionKey,
				watcherStorePath,
				targetSessionKey: params.targetSessionKey,
				sequence: normalizeOptionalSqliteNumber(head?.last_sequence) ?? 0,
				now
			});
			registered = true;
		}, options);
		return registered;
	} catch (error) {
		log.warn(`failed to register session state watch: ${String(error)}`);
		return false;
	}
}
/** Register the agent's main session to observe one routed group session. */
function registerMainSessionGroupWatch(params, options = {}) {
	if (classifySessionKind(params.sessionKey, params.entry) !== "group") return false;
	const watcherSessionKey = buildAgentMainSessionKey({
		agentId: params.agentId,
		mainKey: params.mainKey
	});
	if (params.sessionKey === watcherSessionKey) return false;
	const now = options.now ?? Date.now();
	try {
		const watcherStorePath = resolvePhysicalSessionStorePath({
			sessionKey: watcherSessionKey,
			env: options.env
		});
		const { db: readDb } = openOpenClawStateDatabase(options);
		if (readCursor(readDb, watcherSessionKey, params.sessionKey)?.watcher_store_path === watcherStorePath) return true;
		let registered = false;
		runOpenClawStateWriteTransaction(({ db }) => {
			if (readCursor(db, watcherSessionKey, params.sessionKey)?.watcher_store_path === watcherStorePath) {
				registered = true;
				return;
			}
			const head = executeSqliteQueryTakeFirstSync(db, getSessionStateKysely(db).selectFrom("session_state_heads").select("last_sequence").where("session_key", "=", params.sessionKey).where("agent_id", "=", params.agentId));
			const sequence = normalizeOptionalSqliteNumber(head?.last_sequence) ?? 0;
			upsertSeedCursor({
				db,
				watcherSessionKey,
				watcherStorePath,
				targetSessionKey: params.sessionKey,
				sequence,
				now,
				provenance: SESSION_WATCH_PROVENANCE_AMBIENT_GROUP
			});
			registered = true;
		}, options);
		return registered;
	} catch (error) {
		log.warn(`failed to register ambient group watch: ${String(error)}`);
		return false;
	}
}
function recordSessionHumanDirectMessage(params, options = {}) {
	const watcherSessionKey = params.entry?.spawnedBy ?? params.entry?.parentSessionKey;
	if (params.actor.actorType !== "human") return;
	if (!watcherSessionKey && !hasSessionStateWatchers(params.sessionKey, options)) return;
	return recordSessionStateEvent({
		sessionKey: params.sessionKey,
		sessionId: params.entry?.sessionId,
		agentId: params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey),
		kind: "human_direct_message",
		actorType: "human",
		...params.actor.actorId ? { actorId: params.actor.actorId } : {},
		runId: params.runId,
		...params.dedupeKey ? { dedupeKey: params.dedupeKey } : {},
		summary: `human message via ${params.channel?.trim() || "unknown"}`,
		payload: params.payload,
		...params.occurredAt === void 0 ? {} : { occurredAt: params.occurredAt },
		...watcherSessionKey ? { watcherSessionKeys: [watcherSessionKey] } : {}
	}, options);
}
/** Seed the parent cursor at the child-spawn version. */
function recordSubagentSpawned(params) {
	recordSessionStateEvent({
		sessionKey: params.childSessionKey,
		agentId: params.agentId,
		kind: "child_spawned",
		actorType: "agent",
		actorId: params.requesterSessionKey,
		runId: params.childRunId,
		dedupeKey: `child-spawned:${params.childRunId}`,
		summary: "child session spawned",
		watcherSessionKeys: [params.requesterSessionKey]
	});
}
const SUBAGENT_TERMINAL_SUMMARY = {
	ok: "child run completed",
	error: "child run failed",
	timeout: "child run timed out",
	cancelled: "child run cancelled"
};
/** Project an already-normalized subagent terminal outcome into the signal log. */
function recordSubagentTerminalState(params) {
	recordSessionStateEvent({
		sessionKey: params.childSessionKey,
		agentId: resolveAgentIdFromSessionKey(params.childSessionKey),
		kind: params.outcomeStatus === "ok" ? "run_completed" : "run_failed",
		actorType: "system",
		runId: params.runId,
		dedupeKey: `run-terminal:${params.runId}`,
		summary: SUBAGENT_TERMINAL_SUMMARY[params.outcomeStatus],
		...params.outcomeStatus === "ok" ? {} : { payload: { outcome: params.outcomeStatus } },
		watcherSessionKeys: [params.requesterSessionKey]
	});
}
//#endregion
export { decodeSessionStateNoticeContextKey as C, upsertSessionUpstreamLink as S, sweepSessionStateWatchNotices as _, handleSessionStateSessionDeleted as a, readSessionUpstreamLink as b, listSessionStateEventsSince as c, recordSessionHumanDirectMessage as d, recordSessionStateEvent as f, registerSessionStateWatch as g, registerMainSessionGroupWatch as h, getSessionStateVersions as i, recordSessionCompacted as l, recordSubagentTerminalState as m, classifySessionStateActor as n, handleSessionStateSessionReset as o, recordSubagentSpawned as p, getSessionStateVersion as r, listAmbientGroupWatchTargets as s, acknowledgeSessionStateNotices as t, recordSessionGoalChanged as u, deleteSessionUpstreamLink as v, updateSessionUpstreamLinkMarker as x, listWatchedSessionUpstreamLinks as y };
