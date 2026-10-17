import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as normalizeSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { _ as SESSION_WATCH_PROVENANCE_EXPLICIT, g as SESSION_WATCH_PROVENANCE_AMBIENT_GROUP } from "./openclaw-state-db-fast-path-CPAamWzU.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { n as captureOpenClawStateReadWorkerContext, r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { n as buildAgentMainSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { l as resolveAgentIdFromSessionKey, w as isSubagentSessionKey } from "./session-key-C09ow4h0.mjs";
import { l as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-CsIRv3py.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { n as assertSessionEntryCurrentAdmission, t as assertSessionEntriesCurrentAdmission } from "./session-entry-current-admission-Cvdu1qxp.mjs";
import { p as requestSessionEventWake } from "./heartbeat-wake-ba6LAy2M.mjs";
import { i as prepareSystemEventStorePath, t as captureSystemEventStoreCurrentCheck } from "./system-event-ownership-BkQcgSZJ.mjs";
import { i as enqueueSystemEvent } from "./system-events-BD0JkU8V.mjs";
import { f as captureSessionWatcherStorePaths, m as prepareSessionWatcherStorePaths, p as preparePhysicalSessionStorePath } from "./session-transcript-worker-runtime-CTwaPfeT.mjs";
import { o as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { t as classifySessionKind } from "./classify-session-kind-CT3WV_2y.mjs";
import { i as isNotifiableWatcherKey, l as recordSessionStateEventInDatabase, r as isAmbientGroupWatchCursor, t as getSessionStateKysely, u as rowToSessionStateEvent } from "./session-state-events.kernel-CXzdFJ4D.mjs";
import { t as deleteSessionUpstreamLink } from "./session-upstream-links-BUvTYp9x.mjs";
//#region src/sessions/session-state-events.ambient-read.ts
const log$2 = createSubsystemLogger("sessions/state-events");
const ambientWatchReads = resolveGlobalSingleton(Symbol.for("openclaw.sessionState.ambientWatchReads"), () => ({
	readers: /* @__PURE__ */ new Set(),
	pruning: /* @__PURE__ */ new Set()
}));
function invalidateAmbientWatchReads(source) {
	for (const reader of ambientWatchReads.readers) if (reader.source === source) reader.current = false;
}
/** Pruning can remove watches; newly admitted reads must also remain undisclosable until settlement. */
function beginAmbientWatchPrune(source) {
	ambientWatchReads.pruning.add(source);
	invalidateAmbientWatchReads(source);
	return () => {
		ambientWatchReads.pruning.delete(source);
	};
}
/** List durable ambient-group targets owned by one watcher; failures grant nothing. */
function prepareAmbientGroupWatchTargetsRead(watcherSessionKey, options = {}) {
	const context = captureOpenClawStateReadWorkerContext(options);
	const captured = {
		path: context.admission.databasePath,
		env: context.environment
	};
	const scope = {
		source: context.admission.identity.key,
		current: !ambientWatchReads.pruning.has(context.admission.identity.key)
	};
	ambientWatchReads.readers.add(scope);
	return {
		assertCurrent: () => context.admission.assertCurrent(),
		isCurrent: () => scope.current,
		release: () => {
			scope.current = false;
			ambientWatchReads.readers.delete(scope);
		},
		async read() {
			if (!scope.current) return [];
			try {
				const result = await executeExistingOpenClawStateRead(captured, {
					type: "sessionState.ambientTargets",
					input: { watcherSessionKey }
				}, {
					context,
					current: true
				});
				context.admission.assertCurrent();
				if (result && !result.ok) throw new Error(result.message);
				return result?.type === "sessionState.ambientTargets" ? result.targets : [];
			} catch (error) {
				log$2.warn(`failed to list ambient group watch targets: ${String(error)}`);
				return [];
			}
		}
	};
}
//#endregion
//#region src/sessions/session-state-events.prune.ts
const SESSION_STATE_PRUNE_INTERVAL_MS = 36e5;
const log$1 = createSubsystemLogger("sessions/state-events");
let lastPruneAt = 0;
let prunePending;
function reportPruneFailure(error) {
	try {
		log$1.warn(`failed to prune session state history: ${String(error)}`);
	} catch {}
}
/** Join explicit sweeps; periodic producers coalesce within the existing retention window. */
async function pruneSessionStateEvents(options = {}) {
	const now = options.now ?? Date.now();
	if (!options.force && (prunePending || now - lastPruneAt <= SESSION_STATE_PRUNE_INTERVAL_MS)) return;
	try {
		const context = options.context ?? captureOpenClawStateWorkerContext(options);
		for (let pending = prunePending; pending; pending = prunePending) await pending;
		const finishPrune = beginAmbientWatchPrune(context.admission.identity.key);
		prunePending = Promise.resolve().then(() => options.execute ? options.execute() : runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
			type: "sessionState.prune",
			input: { now }
		}), { createAdmission: createSqliteWorkerWriteAdmission(() => context.admission.assertCurrent(), [context.admission.databasePath]) })).then(() => {
			lastPruneAt = Math.max(lastPruneAt, now);
		}).catch(reportPruneFailure).finally(() => {
			finishPrune();
			prunePending = void 0;
		});
		await prunePending;
	} catch (error) {
		reportPruneFailure(error);
	}
}
//#endregion
//#region src/sessions/session-state-notices.ts
/** Stale-state notice text, coalescing keys, and watcher eligibility. */
const SESSION_STATE_CONTEXT_PREFIX = "session-state:";
const SESSION_STATE_WAKE_COALESCE_MS = 2e4;
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
function enqueueSessionStateNotice(params) {
	enqueueSystemEvent(sessionStateNoticeText(params.targetSessionKey, params.lastSeenSequence), {
		sessionKey: params.watcherSessionKey,
		sessionStorePath: params.watcherStorePath ?? null,
		contextKey: `${SESSION_STATE_CONTEXT_PREFIX}${Buffer.from(params.targetSessionKey, "utf8").toString("hex")}`,
		...params.queueOnly ? { replace: true } : {}
	});
	if (params.queueOnly || isSubagentSessionKey(params.watcherSessionKey)) return;
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
//#region src/sessions/session-state-events.ts
/** Best-effort durable signal log for session state changes. */
const log = createSubsystemLogger("sessions/state-events");
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
		pruneSessionStateEvents({
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
async function getSessionStateVersion(sessionKey, agentId, options = {}) {
	return (await getSessionStateVersions([{
		sessionKey,
		agentId
	}], options))[agentId]?.[sessionKey] ?? 0;
}
/** Batch durable signal-log heads for session-list enrichment, keyed agent → session key. */
async function getSessionStateVersions(refs, options = {}) {
	if (refs.length === 0) return {};
	try {
		const context = captureOpenClawStateReadWorkerContext(options);
		const result = await executeExistingOpenClawStateRead(options, {
			type: "sessionState.versions",
			input: refs
		}, { context });
		context.admission.assertCurrent();
		if (result && !result.ok) throw new Error(result.message);
		return result?.type === "sessionState.versions" ? result.versions : {};
	} catch (error) {
		log.warn(`failed to read session state versions: ${String(error)}`);
		return {};
	}
}
/** List retained signal-log events after a version without advancing watcher cursors. */
async function listSessionStateEventsSince(sessionKey, agentId, afterSequence, limit = 200, options = {}) {
	try {
		const context = captureOpenClawStateReadWorkerContext(options);
		const result = await executeExistingOpenClawStateRead(options, {
			type: "sessionState.events",
			input: {
				sessionKey,
				agentId,
				afterSequence,
				limit
			}
		}, { context });
		context.admission.assertCurrent();
		if (result && !result.ok) throw new Error(result.message);
		if (result?.type === "sessionState.events") return result.page;
	} catch (error) {
		log.warn(`failed to list session state events: ${String(error)}`);
	}
	return {
		events: [],
		truncated: false,
		earliestAvailableSequence: 0,
		historyGap: false
	};
}
function runSessionWatchOperation(context, operation, assertCurrent, sessionEntriesCurrent) {
	return runOpenClawStateWorkerOperation(context, operation, {
		assertCurrent,
		createAdmission: () => ({
			nativeLocations: [context.admission.databasePath],
			admission: createSqliteWorkerOperationAdmission((request, grant) => {
				if (request.stage !== "prepare" && request.stage !== "transaction" && request.stage !== "commit") throw new Error("Session watch operation requires worker admission");
				context.admission.assertCurrent();
				assertSessionEntriesCurrentAdmission(request, sessionEntriesCurrent);
				assertCurrent();
				grant();
			})
		})
	});
}
/** Ack only the frozen notice watermark; advancing to head would lose an interleaved event. */
async function acknowledgeSessionStateNotices(watcherSessionKey, notices, options = {}) {
	try {
		const context = captureOpenClawStateWorkerContext(options);
		const now = options.now ?? Date.now();
		const isStoreCurrent = captureSystemEventStoreCurrentCheck(watcherSessionKey);
		const cursors = [...new Map(notices.filter((notice) => isStoreCurrent(notice.watcherStorePath)).map((notice) => [notice.targetSessionKey, { ...notice }])).values()];
		const assertCurrent = () => {
			options.assertCurrent?.();
			for (const cursor of cursors) if (!isStoreCurrent(cursor.watcherStorePath)) throw new Error("Session watch acknowledgment lost its system-event store");
		};
		await runSessionWatchOperation(context, async (scope) => {
			if (cursors.length === 0) return;
			const followups = await scope.execute({
				type: "sessionState.acknowledge",
				input: {
					watcherSessionKey,
					cursors,
					now,
					sessionEntryCurrentSources: options.sessionEntriesCurrent?.sources
				}
			});
			for (const followup of followups) enqueueSessionStateNotice(followup);
		}, assertCurrent, options.sessionEntriesCurrent);
	} catch (error) {
		log.warn(`failed to acknowledge session state notices: ${String(error)}`);
	}
}
/** Reset parent-side assumptions while retaining target history across session incarnations. */
function handleSessionStateSessionReset(sessionKey, options = {}) {
	try {
		invalidateAmbientWatchReads(captureOpenClawStateReadWorkerContext(options).admission.identity.key);
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
		invalidateAmbientWatchReads(captureOpenClawStateReadWorkerContext(options).admission.identity.key);
		runOpenClawStateWriteTransaction(({ db }) => {
			const kysely = getSessionStateKysely(db);
			for (const table of ["session_state_events", "session_state_heads"]) executeSqliteQuerySync(db, kysely.deleteFrom(table).where("session_key", "=", sessionKey).where("agent_id", "=", agentId));
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
async function sweepSessionStateWatchNotices(options = {}) {
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
		await pruneSessionStateEvents({
			...options,
			now,
			force: true
		});
	} catch (error) {
		log.warn(`failed to sweep session state notices: ${String(error)}`);
	}
}
/** Record one successful compaction from the two concrete v1 owners. */
function recordSessionCompacted(params) {
	if (!params.sessionKey) return;
	return recordSessionStateEventAsync({
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		agentId: params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey),
		kind: "compacted",
		actorType: "system",
		runId: params.runId,
		dedupeKey: `compacted:${params.operationId}`,
		summary: "session compacted"
	}).then(() => {});
}
/** Async producers settle the existing worker's event, notices, and bounded maintenance together. */
async function recordSessionStateEventAsync(input, options = {}) {
	const sessionEntryCurrent = options.sessionEntryCurrent;
	let watcherPaths;
	try {
		const context = options.context ?? captureOpenClawStateWorkerContext(options);
		const now = options.now ?? Date.now();
		const event = structuredClone(input);
		const expectedUpstream = options.expectedUpstream && structuredClone(options.expectedUpstream);
		const acpControl = options.acpControl && structuredClone(options.acpControl);
		let preparedWatchers;
		const assertCurrent = () => {
			options.assertCurrent?.();
			preparedWatchers?.assertCurrent();
		};
		if (!event.watcherStorePaths) watcherPaths = Promise.allSettled([prepareSessionWatcherStorePaths(event.watcherSessionKeys, context.initializationEnvironment)]);
		const preparedPaths = watcherPaths;
		return await runOpenClawStateWorkerOperation(context, async (scope) => {
			if (preparedPaths) {
				const result = (await preparedPaths)[0];
				if (result.status === "rejected") throw result.reason;
				preparedWatchers = result.value;
				event.watcherStorePaths = preparedWatchers.paths;
			}
			const recorded = await scope.execute({
				type: "sessionState.record",
				input: {
					event,
					now,
					onlyIfWatched: options.onlyIfWatched,
					expectedUpstream,
					acpControl,
					sessionEntryCurrentSource: sessionEntryCurrent?.source
				}
			});
			for (const notice of recorded.notices) enqueueSessionStateNotice(notice);
			if (recorded.row) await pruneSessionStateEvents({
				context,
				now,
				execute: () => scope.execute({
					type: "sessionState.prune",
					input: {
						now,
						sessionEntryCurrentSource: sessionEntryCurrent?.source
					}
				})
			});
			return recorded.row ? rowToSessionStateEvent(recorded.row) : void 0;
		}, {
			assertCurrent,
			createAdmission: () => ({
				nativeLocations: [context.admission.databasePath],
				admission: createSqliteWorkerOperationAdmission((request, grant) => {
					if (request.stage !== "transaction" && request.stage !== "commit") throw new Error("Session signal mutation requires transaction admission");
					context.admission.assertCurrent();
					assertCurrent();
					assertSessionEntryCurrentAdmission(request, sessionEntryCurrent);
					grant();
				})
			})
		});
	} catch (error) {
		try {
			log.warn(`failed to record session state event: ${String(error)}`);
		} catch {}
		return;
	} finally {
		await watcherPaths;
	}
}
/** Record a persisted goal mutation using lineage already available at the session-store seam. */
async function recordSessionGoalChanged(params) {
	const watcherSessionKey = params.entry.spawnedBy ?? params.entry.parentSessionKey;
	await recordSessionStateEventAsync({
		sessionKey: params.sessionKey,
		sessionId: params.entry.sessionId,
		agentId: params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey),
		kind: "goal_changed",
		actorType: params.actor?.type ?? "system",
		...params.actor?.id ? { actorId: params.actor.id } : {},
		summary: params.summary,
		...watcherSessionKey ? { watcherSessionKeys: [watcherSessionKey] } : {}
	});
}
/** Released synchronous SDK compatibility; runtime prompt preparation uses worker reads. */
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
async function registerWatch(params, provenance, options) {
	if (params.watcherSessionKey === params.targetSessionKey || !isNotifiableWatcherKey(params.watcherSessionKey)) return false;
	let prepared;
	try {
		const context = captureOpenClawStateWorkerContext(options);
		const isStoreCurrent = captureSystemEventStoreCurrentCheck(params.watcherSessionKey);
		const input = {
			...params,
			targetAgentId: params.targetAgentId ?? resolveAgentIdFromSessionKey(params.targetSessionKey),
			provenance,
			now: options.now ?? Date.now()
		};
		const watcherStorePath = await (prepareSystemEventStorePath(input.watcherSessionKey) ?? preparePhysicalSessionStorePath({
			sessionKey: input.watcherSessionKey,
			env: context.initializationEnvironment
		}));
		context.admission.assertCurrent();
		prepared = await options.prepareCurrent?.();
		const caller = prepared ?? options;
		context.admission.assertCurrent();
		const assertCurrent = () => {
			caller.assertCurrent?.();
			if (!isStoreCurrent(watcherStorePath)) throw new Error("Session watch registration lost its system-event store");
		};
		return await runSessionWatchOperation(context, async (scope) => {
			const registered = await scope.execute({
				type: "sessionState.registerWatch",
				input: {
					...input,
					watcherStorePath,
					sessionEntryCurrentSources: caller.sessionEntriesCurrent?.sources
				}
			});
			assertCurrent();
			return registered;
		}, assertCurrent, caller.sessionEntriesCurrent);
	} catch (error) {
		log.warn(`failed to register session state watch: ${String(error)}`);
		return false;
	} finally {
		prepared?.release();
	}
}
/** Register an explicit watcher (e.g. a sessions_send coordinator) for a target session. */
function registerSessionStateWatch(params, options = {}) {
	return registerWatch(params, SESSION_WATCH_PROVENANCE_EXPLICIT, options);
}
/** Register the agent's main session to observe one routed group session. */
async function registerMainSessionGroupWatch(params, options = {}) {
	if (params.isSystemEvent || classifySessionStateActor(params).actorType !== "human" || classifySessionKind(params.sessionKey, params.entry) !== "group") return false;
	return registerWatch({
		watcherSessionKey: buildAgentMainSessionKey({
			agentId: params.agentId,
			mainKey: params.mainKey
		}),
		targetSessionKey: params.sessionKey,
		targetAgentId: params.agentId
	}, SESSION_WATCH_PROVENANCE_AMBIENT_GROUP, {
		...options,
		assertCurrent: () => {
			params.signal?.throwIfAborted();
			options.assertCurrent?.();
		}
	});
}
async function recordSessionHumanDirectMessage(params, options = {}) {
	const watcherSessionKey = params.entry?.spawnedBy ?? params.entry?.parentSessionKey;
	if (params.actor.actorType !== "human") return;
	return recordSessionStateEventAsync({
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
	}, {
		...options,
		onlyIfWatched: !watcherSessionKey
	});
}
/** Seed the parent cursor at the child-spawn version. */
async function recordSubagentSpawned(params) {
	await recordSessionStateEventAsync({
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
//#endregion
export { sweepSessionStateWatchNotices as _, handleSessionStateSessionDeleted as a, prepareAmbientGroupWatchTargetsRead as b, listSessionStateEventsSince as c, recordSessionHumanDirectMessage as d, recordSessionStateEvent as f, registerSessionStateWatch as g, registerMainSessionGroupWatch as h, getSessionStateVersions as i, recordSessionCompacted as l, recordSubagentSpawned as m, classifySessionStateActor as n, handleSessionStateSessionReset as o, recordSessionStateEventAsync as p, getSessionStateVersion as r, listAmbientGroupWatchTargets as s, acknowledgeSessionStateNotices as t, recordSessionGoalChanged as u, decodeSessionStateNoticeContextKey as v, enqueueSessionStateNotice as y };
