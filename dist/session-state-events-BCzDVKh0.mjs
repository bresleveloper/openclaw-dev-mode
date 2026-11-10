import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { i as executeSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { n as captureOpenClawStateReadWorkerContext, r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { v as SESSION_WATCH_PROVENANCE_AMBIENT_GROUP, y as SESSION_WATCH_PROVENANCE_EXPLICIT } from "./openclaw-state-db-fast-path-D43QiPc4.mjs";
import { r as buildAgentMainSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CSDERtm3.mjs";
import { i as openOpenClawStateDatabase } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-Bzw_c0pA.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { n as assertSessionEntryCurrentAdmission } from "./session-entry-current-admission-DvCCyjlG.mjs";
import { i as prepareSystemEventStorePath, t as captureSystemEventStoreCurrentCheck } from "./system-event-ownership-DAgHWXZ1.mjs";
import { n as preparePhysicalSessionStorePath, r as prepareSessionWatcherStorePaths } from "./session-store-path-BQkYPc4_.mjs";
import { t as classifySessionKind } from "./classify-session-kind-BBHw4D98.mjs";
import { l as rowToSessionStateEvent, t as getSessionStateKysely } from "./session-state-events.kernel-CcXwdtfX.mjs";
import { n as sessionStateWatchAgentId, t as isSessionStateWatchAddress } from "./session-state-events.watch-address-B3UBo-NE.mjs";
import { i as runSessionWatchOperation, n as enqueueSessionStateNotice, r as acknowledgeSessionStateNoticesInWorker } from "./session-state-notices-CICW1sDz.mjs";
import { l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
//#region src/sessions/session-state-events.ambient-read.ts
const log$3 = createSubsystemLogger("sessions/state-events");
const ambientWatchReads = resolveGlobalSingleton(Symbol.for("openclaw.sessionState.ambientWatchReads"), () => ({
	readers: /* @__PURE__ */ new Set(),
	pruning: /* @__PURE__ */ new Map()
}));
function invalidateAmbientWatchReads(source) {
	for (const reader of ambientWatchReads.readers) if (reader.source === source) reader.current = false;
}
/** Pruning can remove watches; newly admitted reads must also remain undisclosable until settlement. */
function beginAmbientWatchPrune(source) {
	ambientWatchReads.pruning.set(source, (ambientWatchReads.pruning.get(source) ?? 0) + 1);
	invalidateAmbientWatchReads(source);
	return () => {
		const pending = ambientWatchReads.pruning.get(source) ?? 0;
		if (pending <= 1) ambientWatchReads.pruning.delete(source);
		else ambientWatchReads.pruning.set(source, pending - 1);
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
				return result?.type === "sessionState.ambientTargets" ? result.targets : [];
			} catch (error) {
				log$3.warn(`failed to list ambient group watch targets: ${String(error)}`);
				return [];
			}
		}
	};
}
//#endregion
//#region src/sessions/session-state-events.prune.ts
const SESSION_STATE_PRUNE_INTERVAL_MS = 36e5;
const log$2 = createSubsystemLogger("sessions/state-events");
let lastPruneAt = 0;
let prunePending;
function reportPruneFailure(error) {
	log$2.warn(`failed to prune session state history: ${String(error)}`);
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
//#region src/sessions/session-state-events.sweep.ts
const log$1 = createSubsystemLogger("sessions/state-events");
/** Re-materialize pending notices after the in-memory queue is lost on restart. */
async function sweepSessionStateWatchNotices(options = {}) {
	try {
		const context = captureOpenClawStateWorkerContext(options);
		const now = options.now ?? Date.now();
		const result = await executeExistingOpenClawStateRead({
			path: context.admission.databasePath,
			env: context.initializationEnvironment
		}, {
			type: "sessionState.pendingNotices",
			input: void 0
		}, { context });
		context.admission.assertCurrent();
		const watchers = /* @__PURE__ */ new Map();
		for (const cursor of result?.type === "sessionState.pendingNotices" ? result.cursors : []) {
			const cursors = watchers.get(cursor.watcherSessionKey) ?? [];
			cursors.push(cursor);
			watchers.set(cursor.watcherSessionKey, cursors);
		}
		const cursors = [];
		for (const [sessionKey, addresses] of watchers) {
			const storePath = await prepareSystemEventStorePath(sessionKey);
			const input = {
				sessionKey,
				env: context.initializationEnvironment,
				storePath: storePath ?? await preparePhysicalSessionStorePath({
					sessionKey,
					env: context.initializationEnvironment
				})
			};
			if (await withSessionEntryReadOnlyInWorker(input, () => context.admission.assertCurrent(), async (read) => read.ok && Boolean(read.value))) cursors.push(...addresses);
		}
		if (cursors.length > 0) await runSessionWatchOperation(context, async (scope) => {
			const notices = await scope.execute({
				type: "sessionState.sweep",
				input: {
					cursors,
					now
				}
			});
			for (const notice of notices) enqueueSessionStateNotice({
				...notice,
				queueOnly: true
			});
		}, () => context.admission.assertCurrent());
		await pruneSessionStateEvents({
			context,
			now,
			force: true
		});
	} catch (error) {
		log$1.warn(`failed to sweep session state notices: ${String(error)}`);
	}
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
/** Ack only the frozen notice watermark; advancing to head would lose an interleaved event. */
function acknowledgeSessionStateNotices(watcherSessionKey, notices, options = {}) {
	return acknowledgeSessionStateNoticesInWorker(watcherSessionKey, notices, enqueueSessionStateNotice, options);
}
/** Reset parent-side assumptions while retaining target history across session incarnations. */
async function handleSessionStateSessionReset(sessionKey, options = {}) {
	try {
		await clearSessionState({
			kind: "reset",
			sessionKey
		}, options);
	} catch (error) {
		log.warn(`failed to reset session state cursors: ${String(error)}`);
	}
}
/** Delete all signal-log and cursor state owned by a deleted session key. */
async function handleSessionStateSessionDeleted(sessionKey, agentId, options = {}) {
	try {
		await clearSessionState({
			kind: "delete",
			sessionKey,
			agentId
		}, options);
	} catch (error) {
		log.warn(`failed to delete session state history: ${String(error)}`);
	}
}
async function clearSessionState(input, options) {
	const context = captureOpenClawStateWorkerContext(options);
	const finish = beginAmbientWatchPrune(context.admission.identity.key);
	try {
		await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
			type: "sessionState.cleanup",
			input
		}), { createAdmission: createSqliteWorkerWriteAdmission(() => context.admission.assertCurrent(), [context.admission.databasePath]) });
	} finally {
		finish();
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
		return await runOpenClawStateWorkerOperation(context, async (scope) => {
			if (!event.watcherStorePaths) {
				preparedWatchers = await prepareSessionWatcherStorePaths(event.watcherSessionKeys, context.initializationEnvironment);
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
		log.warn(`failed to record session state event: ${String(error)}`);
		return;
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
/** @deprecated Retained for prepareWatchedSessionsPrompt; use its async replacement. */
function listAmbientGroupWatchTargets(watcherSessionKey, options = {}) {
	warnPluginSdkDeprecation({
		family: "watched-sessions-prompt",
		method: "prepareWatchedSessionsPrompt",
		replacement: "prepareWatchedSessionsPromptAsync",
		code: "DEP_SESSION_PERSISTENCE"
	});
	try {
		const { db } = openOpenClawStateDatabase(options);
		const rows = executeSqliteQuerySync(db, getSessionStateKysely(db).selectFrom("session_watch_cursors").select("target_session_key").where("watcher_session_key", "=", watcherSessionKey).where("provenance", "=", SESSION_WATCH_PROVENANCE_AMBIENT_GROUP)).rows;
		return new Set(rows.map((row) => row.target_session_key).filter((targetSessionKey) => isSessionStateWatchAddress({
			watcherSessionKey,
			targetSessionKey
		})));
	} catch (error) {
		log.warn(`failed to list ambient group watch targets: ${String(error)}`);
		return /* @__PURE__ */ new Set();
	}
}
async function registerWatch(params, provenance, options) {
	if (params.watcherSessionKey === params.targetSessionKey || !isSessionStateWatchAddress(params)) return false;
	let prepared;
	try {
		const context = captureOpenClawStateWorkerContext(options);
		const isStoreCurrent = captureSystemEventStoreCurrentCheck(params.watcherSessionKey);
		const input = {
			...params,
			targetAgentId: sessionStateWatchAgentId(params.targetSessionKey),
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
export { prepareAmbientGroupWatchTargetsRead as _, handleSessionStateSessionDeleted as a, listSessionStateEventsSince as c, recordSessionHumanDirectMessage as d, recordSessionStateEventAsync as f, sweepSessionStateWatchNotices as g, registerSessionStateWatch as h, getSessionStateVersions as i, recordSessionCompacted as l, registerMainSessionGroupWatch as m, classifySessionStateActor as n, handleSessionStateSessionReset as o, recordSubagentSpawned as p, getSessionStateVersion as r, listAmbientGroupWatchTargets as s, acknowledgeSessionStateNotices as t, recordSessionGoalChanged as u };
