import { r as getAsyncWorkSignal } from "./async-work-scope-CWk2dk1h.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { n as isVitestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import "./env-C4a8LL2I.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { t as SqliteSnapshotCleanupError } from "./sqlite-readonly-location-cleanup-uwwsHidB.mjs";
import { o as isStateDatabaseReadAdmissionInvalidatedError } from "./openclaw-state-db-async-lifecycle-C6femVez.mjs";
import { p as openClawStateDatabaseCache, r as captureOpenClawStateDatabaseReadAdmission } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { n as getActiveOpenClawStateDatabaseReadSnapshot, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-DLFiBmPG.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-CG5jL3tH.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-YAl4mP45.mjs";
import { s as normalizeDeliveryContext } from "./delivery-context.shared-CW8dxG7X.mjs";
import { n as emitSessionLifecycleEvent } from "./session-lifecycle-events-DiXxneBV.mjs";
import { M as getSubagentRegistryPublicationRevision, N as publishSubagentRunChanges, O as getSubagentRunsForChildSession, a as isSubagentRunLive, j as subagentRuns, n as hasSubagentRunEnded, o as isSubagentRunQueued, r as isRetainedUnendedSubagentRun } from "./subagent-run-liveness-9vTRtoqd.mjs";
import { C as projectSubagentRunForMaintenance, S as normalizeSubagentRunState, a as loadSubagentRunsForControllerFromSqlite, c as saveSubagentRegistryChangesToSqlite, d as collectSubagentSessionReadKeys, f as bindCapturedSubagentRunRecord, i as loadSubagentRunsForChildSessionFromSqlite, l as saveSubagentRegistryToSqlite, n as loadSubagentMaintenanceRunsFromSqlite, o as loadSubagentRunsForSessionsFromSqlite, r as loadSubagentRegistryFromSqlite, u as SubagentSessionReadLookup, w as projectSubagentRunForSessionList, x as isDeliverySuspended } from "./subagent-registry.store.sqlite-DcyWJbiA.mjs";
import { r as recordLatestSubagentRun, t as compareSubagentRunGeneration } from "./subagent-run-generation-BpwN1g73.mjs";
import { randomUUID } from "node:crypto";
//#region src/agents/subagents/registry/subagent-registry-persistence.ts
const pendingWrites = /* @__PURE__ */ new Set();
/** Synchronous writers invalidate pending row authority before waiting for their write lock. */
function supersedePendingSubagentRegistryWrites(runIds) {
	for (const pending of pendingWrites) for (const runId of runIds ?? pending.runIds) if (pending.runIds.has(runId)) pending.superseded.add(runId);
}
var SubagentRegistryWriteError = class extends Error {
	constructor(outcome, cause) {
		super("Queued subagent registry persistence failed", { cause });
		this.outcome = outcome;
		this.name = "SubagentRegistryWriteError";
	}
};
/** Retains captured rows, original database admission, and publication through actor settlement. */
async function persistSubagentRegistryChangesAsync(runs, changedRunIds, options, publish) {
	const runIds = [...new Set(changedRunIds.map((id) => id.trim()).filter(Boolean))];
	const pending = {
		runIds: new Set(runIds),
		superseded: /* @__PURE__ */ new Set()
	};
	let commitGranted = false;
	let acknowledged = false;
	pendingWrites.add(pending);
	try {
		const snapshot = /* @__PURE__ */ new Map();
		for (const runId of runIds) {
			const entry = runs.get(runId);
			if (entry) snapshot.set(runId, normalizeSubagentRunState(structuredClone(entry)));
		}
		const write = {
			writeId: randomUUID(),
			values: [...snapshot.values()].map(bindCapturedSubagentRunRecord),
			deleteRunIds: runIds.filter((runId) => !snapshot.has(runId))
		};
		const { context } = options;
		const assertDatabase = () => {
			context.admission.assertCurrent();
			if (captureOpenClawStateWorkerContext().admission.identity.key !== context.admission.identity.key) throw new Error("Queued registry write lost its original database");
		};
		const assertCurrent = () => {
			assertDatabase();
			options.assertCurrent?.();
			if (pending.superseded.size > 0) throw new Error("Queued registry write was superseded");
		};
		await runOpenClawStateWorkerOperation(context, async (scope) => {
			if ((await scope.execute({
				type: "subagents.persistChanges",
				input: write
			})).writeId !== write.writeId) throw new Error("Queued registry acknowledgement identifies another write");
			acknowledged = true;
			assertDatabase();
			const currentIds = runIds.filter((runId) => !pending.superseded.has(runId));
			if (currentIds.length > 0) publish(snapshot, currentIds);
		}, {
			assertCurrent,
			createAdmission: () => {
				let phase = "waiting";
				return {
					nativeLocations: [context.admission.databasePath, context.admission.identity.canonicalPath],
					admission: createSqliteWorkerOperationAdmission((request, grant) => {
						if (request.facts !== write.writeId || !(phase === "waiting" && request.stage === "transaction" || phase === "transaction" && request.stage === "commit")) throw new Error("Queued registry write authority requested out of order");
						assertCurrent();
						if (!grant()) throw new Error("Queued registry write authority expired");
						phase = request.stage === "transaction" ? "transaction" : "commit";
						commitGranted = phase === "commit";
					})
				};
			}
		});
	} catch (error) {
		throw new SubagentRegistryWriteError(acknowledged ? "committed" : commitGranted ? "unknown" : "not-committed", error);
	} finally {
		pendingWrites.delete(pending);
	}
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-read-cache.ts
function getSessionListLookup(cache, snapshot = cache.state.snapshot) {
	const state = cache.state;
	if (!snapshot) return;
	if (state.snapshot !== snapshot) return new SubagentSessionReadLookup(snapshot);
	return state.lookup ??= new SubagentSessionReadLookup(snapshot);
}
function indexedSnapshotRows(snapshot, keys) {
	return keys.map((key) => expectDefined(snapshot.get(key), "indexed subagent cache entry"));
}
function shouldReadPersistedSubagentRuns() {
	return !isVitestRuntimeEnv() || process.env.OPENCLAW_TEST_READ_SUBAGENT_RUNS_FROM_SQLITE === "1";
}
function captureSubagentFactsAdmission(databasePath = resolveOpenClawStateSqlitePath()) {
	return captureOpenClawStateDatabaseReadAdmission(databasePath);
}
function matchesSubagentCacheAdmission(previous, current) {
	if (!previous) return true;
	if (!current || previous.identity.key !== current.identity.key) return false;
	try {
		previous.assertCurrent();
		return true;
	} catch {
		return false;
	}
}
function applySubagentRunChanges(runs, changes) {
	for (const [runId, { entry }] of changes ?? []) if (entry) runs.set(runId, entry);
	else runs.delete(runId);
	return runs;
}
function retainUnpublishedSubagentChanges(changes) {
	for (const [runId, change] of changes ?? []) if (change.committed) changes?.delete(runId);
	return changes?.size ? changes : void 0;
}
/** Selecting a read must not consume another database owner's publication. */
function selectSubagentCacheStateForRead(state, context) {
	const identity = state.retiredPublicationIdentity ?? state.admission?.identity;
	return (context ? !state.retiredPublicationIdentity && matchesSubagentCacheAdmission(state.admission, context.admission) && (state.sourceIdentity === void 0 || state.sourceIdentity === context.admission.identity.key) : !identity || identity === openClawStateDatabaseCache.getKnownOpenClawStateDatabaseIdentity(resolveOpenClawStateSqlitePath())) ? state : {};
}
function rememberSubagentRunsSnapshot(cache, runs, changedRunIds, { committed = true, databasePath } = {}) {
	let admission;
	let retiredPublicationIdentity;
	try {
		admission = cache.captureAdmission?.(databasePath);
	} catch (error) {
		if (!isStateDatabaseReadAdmissionInvalidatedError(error)) throw error;
		if (!cache.load) {
			cache.state = {};
			return;
		}
		retiredPublicationIdentity = expectDefined(openClawStateDatabaseCache.getKnownOpenClawStateDatabaseIdentity(databasePath ?? resolveOpenClawStateSqlitePath()), "retired subagent registry publication identity");
	}
	const previous = retiredPublicationIdentity ? (cache.state.retiredPublicationIdentity ?? cache.state.admission?.identity) === retiredPublicationIdentity ? cache.state : {} : !cache.state.retiredPublicationIdentity && matchesSubagentCacheAdmission(cache.state.admission, admission) && (cache.state.sourceIdentity === void 0 || cache.state.sourceIdentity === admission?.identity.key) ? cache.state : {};
	const owner = {
		admission,
		sourceIdentity: admission?.identity.key ?? retiredPublicationIdentity?.key,
		retiredPublicationIdentity
	};
	const snapshot = previous.snapshot;
	if (!changedRunIds) {
		cache.state = {
			snapshot: new Map([...runs].map(([runId, entry]) => [runId, cache.copy(entry)])),
			...!committed ? { replacementPending: true } : {},
			...owner
		};
		return;
	}
	if (!snapshot) {
		const changes = previous.changes ?? /* @__PURE__ */ new Map();
		for (const runId of changedRunIds) {
			const entry = runs.get(runId);
			changes.set(runId, {
				entry: entry ? cache.copy(entry) : void 0,
				committed
			});
		}
		cache.state = {
			changes,
			...owner,
			pending: previous.pending
		};
		return;
	}
	const lookup = previous.lookup;
	const changes = previous.changes ?? /* @__PURE__ */ new Map();
	previous.lookup = void 0;
	for (const runId of new Set(changedRunIds)) {
		const entry = runs.get(runId);
		if (entry) snapshot.set(runId, cache.copy(entry));
		else snapshot.delete(runId);
		if (!committed || previous.replacementPending) changes.set(runId, {
			entry: snapshot.get(runId),
			committed
		});
		else changes.delete(runId);
		lookup?.set(runId, snapshot.get(runId));
	}
	cache.state = {
		snapshot,
		...owner,
		changes: changes.size ? changes : void 0,
		...previous.replacementPending ? { replacementPending: true } : {},
		...lookup ? { lookup } : {}
	};
}
function getPersistedSubagentRunsSnapshot(cache) {
	let admission;
	if (!cache.load) {
		const context = captureOpenClawStateWorkerContext();
		context.maintenanceScope?.assertAdmission();
		context.admission.assertCurrent();
		admission = context.admission;
	} else try {
		admission = cache.captureAdmission?.();
	} catch (error) {
		if (!isStateDatabaseReadAdmissionInvalidatedError(error)) throw error;
		const state = selectSubagentCacheStateForRead(cache.state);
		return applySubagentRunChanges(new Map(state.snapshot), state.changes);
	}
	if (cache.state.retiredPublicationIdentity || !matchesSubagentCacheAdmission(cache.state.admission, admission) || admission && cache.state.sourceIdentity !== admission.identity.key) {
		cache.state = {
			admission,
			sourceIdentity: admission?.identity.key
		};
		return null;
	}
	return cache.state.snapshot ?? null;
}
function loadPersistedSubagentRunsForRead(cache) {
	const cached = getPersistedSubagentRunsSnapshot(cache);
	if (cached) return cached;
	if (!cache.load) throw new Error("Subagent session-list facts must be prepared before synchronous reads");
	const runs = applySubagentRunChanges(cache.load(), cache.state.changes);
	const admission = cache.captureAdmission?.();
	cache.state = {
		snapshot: runs,
		changes: retainUnpublishedSubagentChanges(cache.state.changes),
		admission,
		sourceIdentity: admission?.identity.key
	};
	return runs;
}
function assertSubagentReadContext(context) {
	getAsyncWorkSignal()?.throwIfAborted();
	context.maintenanceScope?.assertAdmission();
	context.admission.assertCurrent();
	if (captureOpenClawStateWorkerContext().admission.identity.key !== context.admission.identity.key) throw new Error("Subagent registry database changed during preparation");
}
function getSubagentRunsSnapshot(inMemoryRuns, cache, scope) {
	if (shouldReadPersistedSubagentRuns() && !cache.load && !getPersistedSubagentRunsSnapshot(cache)) throw new Error("Subagent session-list facts must be prepared before synchronous reads");
	const merged = /* @__PURE__ */ new Map();
	if (shouldReadPersistedSubagentRuns()) try {
		const cached = scope?.load && !scope.fresh ? getPersistedSubagentRunsSnapshot(cache) : null;
		const cachedRows = cached && scope?.selectCached ? indexedSnapshotRows(cached, scope.selectCached(expectDefined(getSessionListLookup(cache, cached), "subagent lookup"))) : cached?.values();
		const persisted = scope?.load ? cachedRows ?? scope.load() : loadPersistedSubagentRunsForRead(cache).values();
		for (const entry of persisted) if (!scope || scope.matches(entry)) merged.set(entry.runId, scope?.load && !scope.borrowPersisted ? structuredClone(entry) : entry);
	} catch {}
	if (shouldReadPersistedSubagentRuns()) {
		const state = selectSubagentCacheStateForRead(cache.state);
		for (const [runId, { entry }] of state.changes ?? []) if (entry && (!scope || scope.matches(entry))) merged.set(runId, scope?.load && !scope.borrowPersisted ? structuredClone(entry) : entry);
		else merged.delete(runId);
	}
	for (const [runId, entry] of inMemoryRuns) if (!scope || scope.matches(entry)) merged.set(runId, cache.project(entry));
	else merged.delete(runId);
	return merged;
}
var SubagentSessionListUnavailableError = class extends Error {};
async function readCompactSubagentRuns(context) {
	const reply = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, { type: "subagents.sessionList" });
	if (!reply) return /* @__PURE__ */ new Map();
	if (!reply.ok || reply.type !== "subagents.sessionList") throw new Error("Unexpected compact subagent registry read result");
	if ("unavailable" in reply) {
		const failure = new Error(reply.unavailable.message);
		retainOpenClawStateWorkerErrorPayload(failure, reply.unavailable.error);
		throw new SubagentSessionListUnavailableError(reply.unavailable.message, { cause: hydrateOpenClawStateWorkerError(failure, { includeOrdinary: true }) });
	}
	return reply.runs;
}
async function readFullSubagentRuns(context, scope) {
	if (scope.kind === "ids" && scope.runIds.length === 0) {
		assertSubagentReadContext(context);
		return /* @__PURE__ */ new Map();
	}
	const reply = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "subagents.runs",
		scope
	});
	assertSubagentReadContext(context);
	if (!reply) return /* @__PURE__ */ new Map();
	if (!reply.ok || reply.type !== "subagents.runs") throw new Error("Unexpected subagent registry read result");
	return reply.runs;
}
async function prepareSubagentRunsCache(cache, load) {
	const context = captureOpenClawStateWorkerContext();
	assertSubagentReadContext(context);
	if (getActiveOpenClawStateDatabaseReadSnapshot()) {
		const runs = await load(context);
		assertSubagentReadContext(context);
		return runs;
	}
	const callerAbortSignal = getAsyncWorkSignal();
	let retriedCanceledFill = false;
	while (true) {
		assertSubagentReadContext(context);
		let state = cache.state;
		if (!matchesSubagentCacheAdmission(state.admission, context.admission) || state.sourceIdentity !== void 0 && state.sourceIdentity !== context.admission.identity.key) cache.state = state = {
			admission: captureSubagentFactsAdmission(context.admission.databasePath),
			sourceIdentity: context.admission.identity.key
		};
		if (state.snapshot) return state.snapshot;
		if (!state.pending) {
			const sourceIdentity = context.admission.identity.key;
			state.admission = captureSubagentFactsAdmission(context.admission.databasePath);
			state.sourceIdentity = sourceIdentity;
			const fill = {
				ownerAbortSignal: callerAbortSignal,
				promise: Promise.resolve().then(async () => {
					const runs = await load(context);
					try {
						assertSubagentReadContext(context);
					} catch (error) {
						fill.cleanCancellation = fill.ownerAbortSignal?.aborted === true && error === fill.ownerAbortSignal.reason && !(error instanceof AggregateError) && !isStateDatabaseReadAdmissionInvalidatedError(error) && !(error instanceof SqliteSnapshotCleanupError);
						throw error;
					}
					if (cache.state.pending === fill) {
						const admission = captureSubagentFactsAdmission(context.admission.databasePath);
						cache.state = sourceIdentity === admission.identity.key ? {
							snapshot: applySubagentRunChanges(runs, cache.state.changes),
							changes: retainUnpublishedSubagentChanges(cache.state.changes),
							admission,
							sourceIdentity
						} : {
							changes: cache.state.changes,
							admission,
							sourceIdentity: admission.identity.key
						};
					}
				})
			};
			state.pending = fill;
		}
		const fill = state.pending;
		try {
			await fill.promise;
		} catch (error) {
			if (!fill.cleanCancellation || fill.ownerAbortSignal === callerAbortSignal || retriedCanceledFill) throw error;
			assertSubagentReadContext(context);
			retriedCanceledFill = true;
		} finally {
			if (cache.state.pending === fill) cache.state.pending = void 0;
		}
	}
}
function acceptedFullSnapshot(cache, context) {
	const state = cache.state;
	return !state.retiredPublicationIdentity && !getActiveOpenClawStateDatabaseReadSnapshot({
		path: context.admission.databasePath,
		env: context.environment
	}) && state.sourceIdentity === context.admission.identity.key && matchesSubagentCacheAdmission(state.admission, context.admission) ? state.snapshot : void 0;
}
function consumeSubagentRuns(runs, consume) {
	getAsyncWorkSignal()?.throwIfAborted();
	const result = consume(runs);
	if (isPromiseLike(result)) {
		Promise.resolve(result).catch(() => {});
		throw new Error("Subagent registry read consumers must remain synchronous");
	}
	return result;
}
function mergeSelectedFullRuns(cache, inMemoryRuns, persisted, matches, { context, fresh = false } = {}) {
	const current = context && !fresh ? acceptedFullSnapshot(cache, context) : void 0;
	const merged = /* @__PURE__ */ new Map();
	for (const [runId, entry] of current ?? persisted) if (matches(entry)) merged.set(runId, current ? structuredClone(entry) : entry);
	const state = selectSubagentCacheStateForRead(cache.state, context);
	if (context && !getActiveOpenClawStateDatabaseReadSnapshot({
		path: context.admission.databasePath,
		env: context.environment
	}) && state.sourceIdentity === context.admission.identity.key && matchesSubagentCacheAdmission(state.admission, context.admission)) {
		if (fresh && state.replacementPending) {
			for (const runId of merged.keys()) if (!state.changes?.get(runId)?.committed) merged.delete(runId);
			for (const [runId, entry] of state.snapshot) if (!state.changes?.get(runId)?.committed && matches(entry)) merged.set(runId, structuredClone(entry));
		}
		for (const [runId, { entry, committed }] of state.changes ?? []) {
			if (fresh && committed) continue;
			if (entry && matches(entry)) merged.set(runId, structuredClone(entry));
			else merged.delete(runId);
		}
	}
	for (const [runId, entry] of inMemoryRuns) if (matches(entry)) merged.set(runId, entry);
	else merged.delete(runId);
	return merged;
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-read-snapshot.ts
function selectionScope(selected) {
	const runIds = new Set(selected.runIds);
	const sessionKeys = new Set(selected.sessionKeys);
	return {
		runIds,
		sessionKeys,
		matches: (entry) => runIds.has(entry.runId) || sessionKeys.has(entry.requesterSessionKey.trim()) || Boolean(entry.controllerSessionKey && sessionKeys.has(entry.controllerSessionKey.trim()))
	};
}
/** Prepare worker payloads; authority and publications are merged in the caller's consuming frame. */
async function prepareSubagentRunReadSnapshot(params) {
	const { inMemoryRuns, fullCache, compactCache, select } = params;
	const requestSignal = getAsyncWorkSignal();
	const privateSnapshot = getActiveOpenClawStateDatabaseReadSnapshot();
	const context = shouldReadPersistedSubagentRuns() ? captureOpenClawStateWorkerContext() : void 0;
	const assertCurrent = () => {
		requestSignal?.throwIfAborted();
		getAsyncWorkSignal()?.throwIfAborted();
		if (getActiveOpenClawStateDatabaseReadSnapshot() !== privateSnapshot) throw new Error("Prepared subagent read left its database snapshot scope");
		if (context) assertSubagentReadContext(context);
	};
	const readCompact = async () => {
		const compact = context ? await prepareSubagentRunsCache(compactCache, readCompactSubagentRuns) : /* @__PURE__ */ new Map();
		assertCurrent();
		return compact;
	};
	const withLiveFacts = (compact) => {
		const snapshot = new Map(compact);
		for (const [runId, entry] of inMemoryRuns) snapshot.set(runId, projectSubagentRunForSessionList(entry));
		return snapshot;
	};
	let compact = await readCompact();
	let selected = select(withLiveFacts(compact));
	let refreshedMissingRows = false;
	for (;;) {
		assertCurrent();
		const preparedCompact = compact;
		const scope = selectionScope(selected);
		let persisted = context ? acceptedFullSnapshot(fullCache, context) : void 0;
		if (!persisted) {
			persisted = /* @__PURE__ */ new Map();
			if (context) {
				const scopes = [{
					kind: "ids",
					runIds: [...scope.runIds]
				}, ...[...scope.sessionKeys].map((sessionKey) => ({
					kind: "session",
					sessionKey
				}))];
				for (const readScope of scopes) for (const [runId, entry] of await readFullSubagentRuns(context, readScope)) persisted.set(runId, entry);
			}
		}
		const preparedPayloads = persisted;
		const captureFrame = (reselect) => {
			assertCurrent();
			const currentFull = context ? acceptedFullSnapshot(fullCache, context) : void 0;
			const currentCompact = context && !privateSnapshot ? getPersistedSubagentRunsSnapshot(compactCache) : preparedCompact;
			if (!currentCompact || currentCompact !== preparedCompact && !currentFull) return;
			const snapshot = withLiveFacts(currentCompact);
			const currentScope = reselect ? selectionScope(select(snapshot)) : scope;
			const matches = (entry) => scope.matches(entry) || currentScope.matches(entry);
			const full = mergeSelectedFullRuns(fullCache, inMemoryRuns, preparedPayloads, matches, { context });
			for (const entry of full.values()) snapshot.set(entry.runId, projectSubagentRunForSessionList(entry));
			const current = select(snapshot);
			const needsHydration = current.sessionKeys.some((key) => !scope.sessionKeys.has(key)) || current.runIds.some((runId) => {
				const entry = snapshot.get(runId);
				return entry && !matches(entry);
			});
			const finalScope = selectionScope(current);
			for (const [runId, entry] of full) if (!finalScope.matches(entry)) full.delete(runId);
			return {
				compact: currentCompact,
				selection: current,
				runs: full,
				needsHydration,
				missingRunIds: current.runIds.filter((runId) => !full.has(runId))
			};
		};
		const prepared = captureFrame(false);
		if (!prepared) {
			compact = await readCompact();
			selected = select(withLiveFacts(compact));
			continue;
		}
		if (prepared.needsHydration) {
			compact = prepared.compact;
			selected = prepared.selection;
			continue;
		}
		if (!refreshedMissingRows && prepared.missingRunIds.length > 0) {
			if (!privateSnapshot) compactCache.state = {};
			compact = await readCompact();
			selected = select(withLiveFacts(compact));
			refreshedMissingRows = true;
			continue;
		}
		const missingRunIds = new Set(prepared.missingRunIds);
		return { consume(consume) {
			const frame = captureFrame(true);
			if (!frame || frame.needsHydration || frame.missingRunIds.some((runId) => !missingRunIds.has(runId))) return { ready: false };
			return {
				ready: true,
				value: consumeSubagentRuns(frame.runs, (runs) => consume(frame.selection, runs))
			};
		} };
	}
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-state.ts
/**
* Subagent registry state persistence bridge.
*
* Merges live runs with retained SQLite rows under the process-local registry owner.
*/
const persistedSubagentRunsReadCache = {
	state: {},
	captureAdmission: captureSubagentFactsAdmission,
	load: loadSubagentRegistryFromSqlite,
	copy: structuredClone,
	project: (entry) => entry
};
const persistedSubagentSessionListRunsReadCache = {
	state: {},
	captureAdmission: captureSubagentFactsAdmission,
	copy: projectSubagentRunForSessionList,
	project: projectSubagentRunForSessionList
};
const persistedSubagentMaintenanceRunsReadCache = {
	state: {},
	load: () => loadSubagentMaintenanceRunsFromSqlite(),
	copy: projectSubagentRunForMaintenance,
	project: projectSubagentRunForMaintenance
};
const committedSwarmNotifications = /* @__PURE__ */ new Map();
function swarmNotification(entry) {
	if (!entry?.collect || !entry.swarmRequesterSessionKey || !entry.requesterAgentId || !entry.groupId) return;
	return {
		event: {
			sessionKey: entry.swarmRequesterSessionKey,
			agentId: entry.requesterAgentId,
			reason: "swarm",
			scope: "runtime"
		},
		signature: JSON.stringify([
			entry.swarmRequesterSessionKey,
			entry.requesterAgentId,
			entry.groupId,
			entry.createdAt,
			entry.childSessionKey,
			entry.execution.status,
			entry.collectorCompletion?.status
		])
	};
}
function updateCommittedSwarmNotifications(runs, changedRunIds) {
	const events = /* @__PURE__ */ new Map();
	const ids = changedRunIds ?? /* @__PURE__ */ new Set([...committedSwarmNotifications.keys(), ...runs.keys()]);
	for (const runId of ids) {
		const previous = committedSwarmNotifications.get(runId);
		const next = swarmNotification(runs.get(runId));
		if (previous?.signature === next?.signature) continue;
		if (next) committedSwarmNotifications.set(runId, next);
		else committedSwarmNotifications.delete(runId);
		for (const notification of [previous, next]) if (notification) {
			const event = notification.event;
			events.set(JSON.stringify([event.sessionKey, event.agentId]), event);
		}
	}
	return [...events.values()];
}
const SUBAGENT_REGISTRY_PERSIST_LISTENERS = /* @__PURE__ */ new Set();
function emitSubagentRegistryPersisted(keys) {
	publishSubagentRunChanges(keys);
	for (const listener of SUBAGENT_REGISTRY_PERSIST_LISTENERS) try {
		listener(keys);
	} catch {}
}
/** Wake process-local readers after a registry mutation, even if persistence failed. */
function onSubagentRegistryPersisted(listener) {
	SUBAGENT_REGISTRY_PERSIST_LISTENERS.add(listener);
	return () => {
		SUBAGENT_REGISTRY_PERSIST_LISTENERS.delete(listener);
	};
}
function rememberPersistedSubagentRunsSnapshot(runs, changedRunIds, publication = {}) {
	const previous = persistedSubagentSessionListRunsReadCache.state.snapshot ?? persistedSubagentRunsReadCache.state.snapshot;
	const keys = previous && changedRunIds?.flatMap((runId) => [previous.get(runId), runs.get(runId)].flatMap((run) => [
		run?.childSessionKey,
		run?.requesterSessionKey,
		run?.controllerSessionKey,
		run?.swarmRequesterSessionKey
	]));
	for (const cache of [
		persistedSubagentRunsReadCache,
		persistedSubagentSessionListRunsReadCache,
		persistedSubagentMaintenanceRunsReadCache
	]) rememberSubagentRunsSnapshot(cache, runs, changedRunIds, publication);
	return keys;
}
/** Publishes registry rows already committed by a cross-owner shared-state transaction. */
function publishSubagentRunsAfterAtomicStore(runs, changedRunIds, deferredObserverEvents) {
	supersedePendingSubagentRegistryWrites(changedRunIds);
	subagentRuns.settleCompletionAuthorities(runs, changedRunIds);
	const keys = rememberPersistedSubagentRunsSnapshot(runs, changedRunIds);
	const events = updateCommittedSwarmNotifications(runs, changedRunIds);
	deferredObserverEvents.push(() => {
		emitSubagentRegistryPersisted(keys);
		events.forEach(emitSessionLifecycleEvent);
	});
}
/** Existing resident facts, fenced by the physical source rather than a publisher's scope. */
function getSubagentSessionListReadSnapshotIdentity() {
	if (!shouldReadPersistedSubagentRuns()) return subagentRuns;
	try {
		return getPersistedSubagentRunsSnapshot(persistedSubagentSessionListRunsReadCache) ?? void 0;
	} catch (error) {
		if (!isStateDatabaseReadAdmissionInvalidatedError(error)) throw error;
		return;
	}
}
async function prepareSubagentSessionListReadCache() {
	if (!shouldReadPersistedSubagentRuns()) return;
	if (getActiveOpenClawStateDatabaseReadSnapshot()) throw new Error("Resident subagent preparation cannot adopt a private database snapshot");
	await prepareSubagentRunsCache(persistedSubagentSessionListRunsReadCache, readCompactSubagentRuns);
}
/** History can omit retained child hints only after a failed query has settled cleanly. */
async function prepareOptionalSubagentSessionListReadCache() {
	if (!shouldReadPersistedSubagentRuns()) return true;
	const context = captureOpenClawStateWorkerContext();
	try {
		await prepareSubagentSessionListReadCache();
		assertSubagentReadContext(context);
		return true;
	} catch (error) {
		if (!(error instanceof SubagentSessionListUnavailableError)) throw error;
		assertSubagentReadContext(context);
		return false;
	}
}
function clearSubagentRunsReadCacheForTest() {
	supersedePendingSubagentRegistryWrites();
	committedSwarmNotifications.clear();
	persistedSubagentRunsReadCache.state = {};
	persistedSubagentSessionListRunsReadCache.state = {};
	persistedSubagentMaintenanceRunsReadCache.state = {};
}
function persistSubagentRuns(runs, changedRunIds, strict) {
	supersedePendingSubagentRegistryWrites(changedRunIds);
	let committed = false;
	try {
		if (changedRunIds) saveSubagentRegistryChangesToSqlite(runs, changedRunIds);
		else saveSubagentRegistryToSqlite(runs);
		committed = true;
	} catch (error) {
		if (strict) throw error;
	}
	if (committed) subagentRuns.settleCompletionAuthorities(runs, changedRunIds);
	const keys = rememberPersistedSubagentRunsSnapshot(runs, changedRunIds, { committed });
	const events = committed ? updateCommittedSwarmNotifications(runs, changedRunIds) : [];
	emitSubagentRegistryPersisted(keys);
	events.forEach(emitSessionLifecycleEvent);
}
function persistSubagentRunsToDisk(runs, changedRunIds) {
	persistSubagentRuns(runs, changedRunIds, false);
}
function persistSubagentRunsToDiskOrThrow(runs, changedRunIds) {
	persistSubagentRuns(runs, changedRunIds, true);
}
function persistSubagentRunsToDiskAsyncOrThrow(runs, changedRunIds, options) {
	return persistSubagentRegistryChangesAsync(runs, changedRunIds, options, (snapshot, runIds) => {
		options.onCommitted?.();
		subagentRuns.settleCompletionAuthorities(snapshot, runIds);
		const keys = rememberPersistedSubagentRunsSnapshot(snapshot, runIds, { databasePath: options.context.admission.databasePath });
		const events = updateCommittedSwarmNotifications(snapshot, runIds);
		emitSubagentRegistryPersisted(keys);
		events.forEach(emitSessionLifecycleEvent);
	});
}
function restoreSubagentRunsFromDisk(params) {
	const restored = loadSubagentRegistryFromSqlite();
	supersedePendingSubagentRegistryWrites();
	const keys = rememberPersistedSubagentRunsSnapshot(restored);
	let added = 0;
	for (const [runId, entry] of restored.entries()) {
		if (!runId || !entry) continue;
		if (params.mergeOnly && params.runs.has(runId)) continue;
		params.runs.set(runId, entry);
		const notification = swarmNotification(entry);
		if (notification) committedSwarmNotifications.set(runId, notification);
		else committedSwarmNotifications.delete(runId);
		subagentRuns.commitOwnership(entry);
		added += 1;
	}
	emitSubagentRegistryPersisted(keys);
	return added;
}
function getSubagentRunsSnapshotForRead(inMemoryRuns) {
	return getSubagentRunsSnapshot(inMemoryRuns, persistedSubagentRunsReadCache);
}
/** All generations of exact children, sharing the existing snapshot and its publication-owned lookup. */
function getSubagentSessionListRunsSnapshotForChildSessions(childSessionKeys) {
	const keys = new Set(childSessionKeys.map((key) => key.trim()).filter(Boolean));
	const selected = /* @__PURE__ */ new Map();
	if (keys.size === 0) return selected;
	const cache = persistedSubagentSessionListRunsReadCache;
	if (shouldReadPersistedSubagentRuns()) {
		const snapshot = loadPersistedSubagentRunsForRead(cache);
		const lookup = getSessionListLookup(cache, snapshot);
		for (const runId of lookup?.selectChildren(keys) ?? []) {
			const persisted = snapshot.get(runId);
			const live = persisted && subagentRuns.get(persisted.runId);
			const entry = live ? cache.project(live) : persisted;
			if (entry && keys.has(entry.childSessionKey.trim())) selected.set(entry.runId, entry);
		}
	}
	for (const key of keys) for (const entry of getSubagentRunsForChildSession(key)) selected.set(entry.runId, cache.project(entry));
	return selected;
}
function getSubagentMaintenanceRunsSnapshotForRead(inMemoryRuns) {
	return getSubagentRunsSnapshot(inMemoryRuns, persistedSubagentMaintenanceRunsReadCache);
}
/** Hydrate selected payloads, then capture their current graph and raw owners in one frame. */
async function withSubagentRunReadSnapshot(inMemoryRuns, select, consume) {
	for (;;) {
		const result = (await prepareSubagentRunReadSnapshot({
			inMemoryRuns,
			fullCache: persistedSubagentRunsReadCache,
			compactCache: persistedSubagentSessionListRunsReadCache,
			select
		})).consume(consume);
		if (result.ready) return result.value;
	}
}
async function prepareSubagentRunsSnapshotForRunIds(inMemoryRuns, runIds) {
	const requested = new Set(runIds.map((runId) => runId.trim()));
	const matches = (entry) => requested.has(entry.runId) || Boolean(entry.swarmRunId && requested.has(entry.swarmRunId));
	const prepared = await prepareSubagentRunReadSnapshot({
		inMemoryRuns,
		fullCache: persistedSubagentRunsReadCache,
		compactCache: persistedSubagentSessionListRunsReadCache,
		select: (snapshot) => ({
			runIds: [...snapshot.values()].filter(matches).map((entry) => entry.runId),
			sessionKeys: []
		})
	});
	return { consume(consume) {
		return prepared.consume((selection, runs) => {
			const selected = /* @__PURE__ */ new Map();
			for (const runId of selection.runIds) {
				const entry = runs.get(runId);
				if (entry) selected.set(runId, entry);
			}
			return consume(selected);
		});
	} };
}
function getSubagentSessionListRunsSnapshotForRead(inMemoryRuns, controllerSessionKeys) {
	if (controllerSessionKeys) {
		const keys = new Set(controllerSessionKeys.map((key) => key.trim()).filter(Boolean));
		if (keys.size === 0) return /* @__PURE__ */ new Map();
		const cache = persistedSubagentSessionListRunsReadCache;
		const cached = shouldReadPersistedSubagentRuns() ? getPersistedSubagentRunsSnapshot(cache) : null;
		const lookup = cached ? getSessionListLookup(cache, cached) : void 0;
		if (!cached || !lookup) {
			if (!shouldReadPersistedSubagentRuns()) return getSubagentRunsSnapshot(inMemoryRuns, cache, { matches: (entry) => keys.has(entry.controllerSessionKey?.trim() || entry.requesterSessionKey) });
			throw new Error("Subagent session-list facts must be prepared before synchronous reads");
		}
		return getSubagentRunsSnapshot(inMemoryRuns, cache, {
			fresh: true,
			load: () => indexedSnapshotRows(cached, lookup.selectControllers(keys)),
			matches: (entry) => keys.has(entry.controllerSessionKey?.trim() || entry.requesterSessionKey)
		});
	}
	return getSubagentRunsSnapshot(inMemoryRuns, persistedSubagentSessionListRunsReadCache);
}
function getSubagentSessionTreeSnapshot(inMemoryRuns, sessionKeys, cache, load) {
	if (!sessionKeys.some((key) => key.trim())) return /* @__PURE__ */ new Map();
	const cached = shouldReadPersistedSubagentRuns() ? getPersistedSubagentRunsSnapshot(cache) : null;
	const indexed = (cached ? getSessionListLookup(cache, cached) : void 0)?.selectSessions(sessionKeys, inMemoryRuns.values());
	let selected = indexed?.sessionKeys ?? collectSubagentSessionReadKeys(sessionKeys, cached?.values() ?? [], inMemoryRuns.values());
	return getSubagentRunsSnapshot(inMemoryRuns, cache, {
		fresh: true,
		borrowPersisted: true,
		load: () => {
			if (cached) return indexed ? indexedSnapshotRows(cached, indexed.cacheKeys) : cached.values();
			if (!load) throw new Error("Subagent session-list facts must be prepared before synchronous reads");
			const snapshot = load();
			if (snapshot.complete) {
				applySubagentRunChanges(snapshot.runs, cache.state.changes);
				const loadedLookup = cache === persistedSubagentSessionListRunsReadCache ? new SubagentSessionReadLookup(snapshot.runs) : void 0;
				const loadedIndex = loadedLookup?.selectSessions(sessionKeys, inMemoryRuns.values());
				snapshot.sessionKeys = loadedIndex?.sessionKeys ?? collectSubagentSessionReadKeys(sessionKeys, snapshot.runs.values(), inMemoryRuns.values());
				const admission = cache.captureAdmission?.();
				cache.state = {
					snapshot: snapshot.runs,
					changes: retainUnpublishedSubagentChanges(cache.state.changes),
					admission,
					sourceIdentity: admission?.identity.key,
					...loadedLookup ? { lookup: loadedLookup } : {}
				};
				if (loadedIndex) {
					selected = snapshot.sessionKeys;
					return indexedSnapshotRows(snapshot.runs, loadedIndex.cacheKeys);
				}
			}
			selected = snapshot.sessionKeys;
			return snapshot.runs.values();
		},
		matches: (entry) => selected.has(entry.childSessionKey.trim())
	});
}
/** Exact rows share the owner snapshot while projecting only their complete requester trees. */
function getSubagentSessionListRunsSnapshotForSessions(inMemoryRuns, sessionKeys) {
	return getSubagentSessionTreeSnapshot(inMemoryRuns, sessionKeys, persistedSubagentSessionListRunsReadCache);
}
/** Settlement reads retain the canonical codec and raw local reservation ownership. */
function getSubagentRunsSnapshotForSessions(inMemoryRuns, sessionKeys) {
	return getSubagentSessionTreeSnapshot(inMemoryRuns, sessionKeys, persistedSubagentRunsReadCache, () => loadSubagentRunsForSessionsFromSqlite(sessionKeys, inMemoryRuns.values(), "full"));
}
function getSubagentRunsSnapshotForController(inMemoryRuns, controllerSessionKey) {
	const key = controllerSessionKey.trim();
	if (!key) return /* @__PURE__ */ new Map();
	return getSubagentRunsSnapshot(inMemoryRuns, persistedSubagentRunsReadCache, {
		selectCached: (lookup) => lookup.selectControllers(/* @__PURE__ */ new Set([key])),
		load: () => loadSubagentRunsForControllerFromSqlite(key),
		matches: (entry) => (entry.controllerSessionKey?.trim() || entry.requesterSessionKey) === key
	});
}
function getSubagentRunsSnapshotForChildSession(inMemoryRuns, childSessionKey) {
	const key = childSessionKey.trim();
	if (!key) return /* @__PURE__ */ new Map();
	return getSubagentRunsSnapshot(inMemoryRuns, persistedSubagentRunsReadCache, {
		selectCached: (lookup) => lookup.selectChildren(/* @__PURE__ */ new Set([key])),
		load: () => loadSubagentRunsForChildSessionFromSqlite(key),
		matches: (entry) => entry.childSessionKey === key
	});
}
/** Merge fresh durable rows with this source's unpublished facts and current live owners. */
function getPreparedSubagentRunsSnapshotForChildSession(inMemoryRuns, childSessionKey, persisted, context) {
	return mergeSelectedFullRuns(persistedSubagentRunsReadCache, inMemoryRuns, new Map(persisted.map((entry) => [entry.runId, structuredClone(entry)])), (entry) => entry.childSessionKey === childSessionKey, {
		context,
		fresh: true
	});
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-queries.ts
function resolveControllerSessionKey(entry) {
	return entry.controllerSessionKey?.trim() || entry.requesterSessionKey;
}
function resolveConcurrencyOwnerSessionKey(entry) {
	return entry.collect ? entry.swarmRequesterSessionKey?.trim() || resolveControllerSessionKey(entry) : resolveControllerSessionKey(entry);
}
function isDeliveryTerminalForRequesterSettle(entry) {
	return isDeliverySuspended(entry) || entry.delivery?.disposition === "delivered" || entry.delivery?.disposition === "intentional_non_delivery" || entry.delivery?.disposition === "permanent_failure";
}
/** Lists requester-owned runs, optionally scoped to the lifetime of a requester run. */
function listRunsForRequesterFromRuns(runs, requesterSessionKey, options) {
	const key = requesterSessionKey.trim();
	if (!key) return [];
	const requesterRunId = options?.requesterRunId?.trim();
	const requesterRun = requesterRunId ? runs.get(requesterRunId) : void 0;
	const requesterRunMatchesScope = requesterRun && requesterRun.childSessionKey === key ? requesterRun : void 0;
	const lowerBound = requesterRunMatchesScope?.execution.startedAt ?? requesterRunMatchesScope?.createdAt;
	const upperBound = requesterRunMatchesScope?.execution.endedAt;
	const results = [];
	for (const entry of runs.values()) if (entry.requesterSessionKey === key && (!options?.requesterAgentId || entry.requesterAgentId === options.requesterAgentId) && (options?.requesterStorePath === void 0 || (entry.requesterStorePath ?? null) === options.requesterStorePath) && (typeof lowerBound !== "number" || entry.createdAt >= lowerBound) && (typeof upperBound !== "number" || entry.createdAt <= upperBound)) results.push(entry);
	return results;
}
function selectConnectedSettledSubagentWave(candidates, settledEntry) {
	const targetIndex = candidates.findIndex((entry) => entry.runId === settledEntry.runId);
	const target = candidates[targetIndex];
	if (!target) return [];
	const sorted = candidates.map((entry, originalIndex) => ({
		entry,
		originalIndex,
		endedAt: typeof entry.execution.endedAt === "number" ? entry.execution.endedAt : Number.MAX_SAFE_INTEGER
	})).toSorted((a, b) => a.entry.createdAt - b.entry.createdAt || a.endedAt - b.endedAt || a.originalIndex - b.originalIndex);
	const first = sorted[0];
	if (!first) return [];
	let componentStart = 0;
	let componentEnd = first.endedAt;
	let containsTarget = first.originalIndex === targetIndex;
	for (let index = 1; index <= sorted.length; index += 1) {
		const next = sorted[index];
		if (!next || next.entry.createdAt > componentEnd) {
			if (containsTarget) return [target, ...sorted.slice(componentStart, index).filter((item) => item.originalIndex !== targetIndex).toSorted((a, b) => a.originalIndex - b.originalIndex).map((item) => item.entry)];
			if (!next) break;
			componentStart = index;
			componentEnd = next.endedAt;
			containsTarget = next.originalIndex === targetIndex;
			continue;
		}
		componentEnd = Math.max(componentEnd, next.endedAt);
		containsTarget ||= next.originalIndex === targetIndex;
	}
	return [];
}
/** Lists runs controlled by the normalized controller session key. */
function listRunsForControllerFromRuns(runs, controllerSessionKey, controllerAgentId) {
	const key = controllerSessionKey.trim();
	const results = [];
	if (!key) return results;
	for (const entry of runs.values()) if (resolveControllerSessionKey(entry) === key && (!controllerAgentId || entry.requesterAgentId === controllerAgentId)) results.push(entry);
	return results;
}
/** Builds a reusable latest-generation lookup from one registry snapshot. */
function buildLatestSubagentRunReadIndexFromRuns(runs) {
	const latestRunByChildSessionKey = /* @__PURE__ */ new Map();
	for (const entry of runs.values()) {
		const childSessionKey = entry.childSessionKey.trim();
		if (!childSessionKey) continue;
		recordLatestSubagentRun(latestRunByChildSessionKey, childSessionKey, entry);
	}
	return { getLatestSubagentRun: (childSessionKey) => latestRunByChildSessionKey.get(childSessionKey.trim()) ?? null };
}
/** Builds a read index from snapshot and optional in-memory runs. */
function buildSubagentRunReadIndexFromRuns(params) {
	const { runs } = params;
	const now = params.now ?? Date.now();
	const inMemoryDisplayByChildSessionKey = /* @__PURE__ */ new Map();
	const runsByChildSessionKey = /* @__PURE__ */ new Map();
	const latestRunsByChildSessionKey = /* @__PURE__ */ new Map();
	const runsByControllerSessionKey = /* @__PURE__ */ new Map();
	const swarmRunsByRequesterSessionKey = /* @__PURE__ */ new Map();
	const latestRunByRequesterAndChildSessionKey = /* @__PURE__ */ new Map();
	const isRetainedReadRun = (entry, clock = now) => {
		if (isRetainedUnendedSubagentRun(entry, clock)) return true;
		if (hasSubagentRunEnded(entry) || entry.execution.status !== "queued") return false;
		const current = inMemoryDisplayByChildSessionKey.get(entry.childSessionKey.trim());
		return current !== void 0 && current.requesterSessionKey === entry.requesterSessionKey && compareSubagentRunGeneration(current, entry) === 0 && isSubagentRunQueued(current);
	};
	for (const entry of params.inMemoryRuns ?? []) {
		const childSessionKey = entry.childSessionKey.trim();
		if (!childSessionKey) continue;
		recordLatestSubagentRun(inMemoryDisplayByChildSessionKey, childSessionKey, entry);
	}
	const retainedReadRuns = /* @__PURE__ */ new Set();
	for (const entry of runs.values()) if (isRetainedReadRun(entry)) retainedReadRuns.add(entry);
	for (const entry of runs.values()) {
		if (entry.collect && entry.groupId && entry.swarmRequesterSessionKey) {
			const requester = entry.swarmRequesterSessionKey;
			const members = swarmRunsByRequesterSessionKey.get(requester) ?? [];
			members.push(entry);
			swarmRunsByRequesterSessionKey.set(requester, members);
		}
		const childSessionKey = entry.childSessionKey.trim();
		const controllerSessionKey = resolveControllerSessionKey(entry);
		if (controllerSessionKey) {
			let controllerRuns = runsByControllerSessionKey.get(controllerSessionKey);
			if (!controllerRuns) {
				controllerRuns = [];
				runsByControllerSessionKey.set(controllerSessionKey, controllerRuns);
			}
			controllerRuns.push(entry);
		}
		if (!childSessionKey) continue;
		recordLatestSubagentRun(latestRunsByChildSessionKey, childSessionKey, entry);
		const requesterSessionKey = entry.requesterSessionKey;
		if (!requesterSessionKey) continue;
		let latestByChild = latestRunByRequesterAndChildSessionKey.get(requesterSessionKey);
		if (!latestByChild) {
			latestByChild = /* @__PURE__ */ new Map();
			latestRunByRequesterAndChildSessionKey.set(requesterSessionKey, latestByChild);
		}
		recordLatestSubagentRun(latestByChild, childSessionKey, entry);
	}
	const inputs = {
		runs,
		inMemoryRuns: [...inMemoryDisplayByChildSessionKey.values()]
	};
	const atTime = (clock, captured) => {
		const activeDescendantCountBySessionKey = /* @__PURE__ */ new Map();
		const pendingDescendantCountBySessionKey = /* @__PURE__ */ new Map();
		const displayByChildSessionKey = /* @__PURE__ */ new Map();
		const getDisplaySubagentRun = (childSessionKey) => {
			const key = childSessionKey.trim();
			if (!key) return null;
			if (displayByChildSessionKey.has(key)) return displayByChildSessionKey.get(key) ?? null;
			const selected = inMemoryDisplayByChildSessionKey.get(key) ?? latestSubagentRun(runsByChildSessionKey.get(key) ?? [], (entry) => captured?.has(entry) ?? isRetainedReadRun(entry, clock)) ?? latestRunsByChildSessionKey.get(key) ?? null;
			displayByChildSessionKey.set(key, selected);
			return selected;
		};
		const forEachDescendantRun = (rootSessionKey, visitor) => {
			const root = rootSessionKey.trim();
			if (!root) return;
			const pending = [root];
			const visited = /* @__PURE__ */ new Set([root]);
			for (const requester of pending) for (const [childSessionKey, entry] of latestRunByRequesterAndChildSessionKey.get(requester) ?? []) {
				if (latestRunsByChildSessionKey.get(childSessionKey) !== entry) continue;
				if (visitor(entry) === true) return;
				if (visited.has(childSessionKey)) continue;
				visited.add(childSessionKey);
				pending.push(childSessionKey);
			}
		};
		const countActiveDescendantRuns = (rootSessionKey) => {
			const root = rootSessionKey.trim();
			if (!root) return 0;
			if (activeDescendantCountBySessionKey.has(root)) return activeDescendantCountBySessionKey.get(root) ?? 0;
			let count = 0;
			forEachDescendantRun(root, (entry) => {
				if (isRetainedReadRun(entry, clock)) count += 1;
			});
			activeDescendantCountBySessionKey.set(root, count);
			return count;
		};
		const countPendingDescendantRunsInternal = (rootSessionKey, options) => {
			const excludedRunId = options?.excludeRunId?.trim();
			let count = 0;
			forEachDescendantRun(rootSessionKey, (entry) => {
				if (entry.runId === excludedRunId) return false;
				if (options?.settledBefore !== void 0 && hasSubagentRunEnded(entry) && entry.execution.endedAt < options.settledBefore) return false;
				if (hasSubagentRunEnded(entry) ? typeof entry.cleanupCompletedAt !== "number" && !(options?.treatSuspendedDeliveryAsSettled === true && isDeliveryTerminalForRequesterSettle(entry)) : isRetainedReadRun(entry, clock)) {
					count += 1;
					if (options?.stopAtFirst === true) return true;
				}
				return false;
			});
			return count;
		};
		const countPendingDescendantRuns = (rootSessionKey) => {
			const root = rootSessionKey.trim();
			if (!root) return 0;
			if (pendingDescendantCountBySessionKey.has(root)) return pendingDescendantCountBySessionKey.get(root) ?? 0;
			const count = countPendingDescendantRunsInternal(root);
			pendingDescendantCountBySessionKey.set(root, count);
			return count;
		};
		const hasDescendantRunAwaitingSettle = (rootSessionKey, excludeRunId, settledBefore) => countPendingDescendantRunsInternal(rootSessionKey, {
			excludeRunId,
			settledBefore,
			treatSuspendedDeliveryAsSettled: true,
			stopAtFirst: true
		}) > 0;
		const listDescendantRunsForRequester = (rootSessionKey) => {
			const descendants = [];
			forEachDescendantRun(rootSessionKey, (entry) => {
				descendants.push(entry);
			});
			return descendants;
		};
		return {
			inputs,
			atTime,
			getDisplaySubagentRun,
			latestRunsByChildSessionKey,
			runsByChildSessionKey,
			countActiveDescendantRuns,
			countPendingDescendantRuns,
			hasDescendantRunAwaitingSettle,
			listDescendantRunsForRequester,
			runsByControllerSessionKey,
			swarmRunsByRequesterSessionKey
		};
	};
	for (const run of /* @__PURE__ */ new Set([...runs.values(), ...inputs.inMemoryRuns])) {
		const key = run.childSessionKey.trim();
		const candidates = runsByChildSessionKey.get(key) ?? [];
		candidates.push(run);
		runsByChildSessionKey.set(key, candidates);
	}
	runsByChildSessionKey.delete("");
	return atTime(now, retainedReadRuns);
}
/**
* Returns the latest-generation run for a child session.
*
* `matches` narrows the candidates before the generation comparison, so callers
* that own a specific row class (a paused continuation target, say) select the
* newest row of that class rather than the newest row overall. Without it a
* sibling registered at a higher generation hides the row the caller owns.
*/
function getLatestSubagentRunByChildSessionKeyFromRuns(runs, childSessionKey, matches) {
	const key = childSessionKey.trim();
	if (!key) return;
	return latestSubagentRun(runs instanceof Map ? runs.values() : runs, (entry) => entry.childSessionKey === key && (!matches || matches(entry)));
}
function latestSubagentRun(runs, matches) {
	let latest;
	for (const entry of runs) if (matches(entry) && (!latest || compareSubagentRunGeneration(entry, latest) > 0)) latest = entry;
	return latest;
}
/** Returns the preferred run for a child session, active first then latest ended. */
function getSubagentRunByChildSessionKeyFromRuns(runs, childSessionKey) {
	const key = childSessionKey.trim();
	if (!key) return null;
	let latestActive = null;
	let latestEnded = null;
	for (const entry of runs.values()) {
		if (entry.childSessionKey !== key) continue;
		if (isRetainedUnendedSubagentRun(entry)) {
			if (!latestActive || compareSubagentRunGeneration(entry, latestActive) > 0) latestActive = entry;
			continue;
		}
		if (!latestEnded || compareSubagentRunGeneration(entry, latestEnded) > 0) latestEnded = entry;
	}
	return latestActive ?? latestEnded;
}
/** Resolves the requester and delivery origin for the latest child-session run. */
function resolveRequesterForChildSessionFromRuns(runs, childSessionKey) {
	const latest = getLatestSubagentRunByChildSessionKeyFromRuns(runs, childSessionKey);
	if (!latest) return null;
	return {
		requesterSessionKey: latest.requesterSessionKey,
		requesterAgentId: latest.requesterAgentId,
		requesterOrigin: latest.requesterOrigin
	};
}
/** Returns whether post-completion announce should be skipped for a cleaned-up run. */
function shouldIgnorePostCompletionAnnounceForSessionFromRuns(runs, childSessionKey) {
	const latest = getLatestSubagentRunByChildSessionKeyFromRuns(runs, childSessionKey);
	return Boolean(latest && latest.spawnMode !== "session" && typeof latest.execution.endedAt === "number" && typeof latest.cleanupCompletedAt === "number" && latest.cleanupCompletedAt >= latest.execution.endedAt);
}
function listSwarmRunsForGroupFromRuns(runs, groupId, requesterSessionKey, requesterAgentId) {
	const key = groupId.trim();
	const requesterKey = requesterSessionKey?.trim();
	return [...runs.values()].filter((entry) => entry.collect === true && entry.groupId === key && (!requesterKey || (entry.swarmRequesterSessionKey ?? entry.requesterSessionKey) === requesterKey) && (!requesterAgentId || entry.requesterAgentId === requesterAgentId));
}
/** Counts active direct child runs plus completed children that still have pending descendants. */
function countActiveRunsForSessionFromRuns(runs, controllerSessionKey, options) {
	const key = controllerSessionKey.trim();
	if (!key) return 0;
	const readIndex = buildSubagentRunReadIndexFromRuns({ runs });
	const latestByChildSessionKey = /* @__PURE__ */ new Map();
	for (const entry of runs.values()) {
		if (options?.collect !== void 0 && entry.collect === true !== options.collect) continue;
		if (resolveConcurrencyOwnerSessionKey(entry) !== key) continue;
		if (options?.requesterAgentId && entry.requesterAgentId !== options.requesterAgentId) continue;
		recordLatestSubagentRun(latestByChildSessionKey, entry.childSessionKey, entry);
	}
	let count = 0;
	for (const entry of latestByChildSessionKey.values()) {
		if (isRetainedUnendedSubagentRun(entry)) {
			count += 1;
			continue;
		}
		if (readIndex.countPendingDescendantRuns(entry.childSessionKey) > 0) count += 1;
	}
	return count;
}
function scopeRootDescendantsToRequesterAgent(runs, rootSessionKey, requesterAgentId, requesterStorePath) {
	return requesterAgentId || requesterStorePath !== void 0 ? new Map([...runs].filter(([, entry]) => entry.requesterSessionKey !== rootSessionKey || (!requesterAgentId || entry.requesterAgentId === requesterAgentId) && (requesterStorePath === void 0 || (entry.requesterStorePath ?? null) === requesterStorePath))) : runs;
}
/** Counts live descendants under a requester/session tree. */
function countActiveDescendantRunsFromRuns(runs, rootSessionKey, requesterAgentId, requesterStorePath) {
	return buildSubagentRunReadIndexFromRuns({ runs: scopeRootDescendantsToRequesterAgent(runs, rootSessionKey, requesterAgentId, requesterStorePath) }).countActiveDescendantRuns(rootSessionKey);
}
/** Counts descendants that are live or ended but not yet cleaned up. */
function countPendingDescendantRunsFromRuns(runs, rootSessionKey) {
	return buildSubagentRunReadIndexFromRuns({ runs }).countPendingDescendantRuns(rootSessionKey);
}
/**
* True when any descendant below a root session has not reached a terminal
* settle. Differs from the pending count in one way: a run whose final
* delivery was suspended counts as settled — suspension is terminal for
* automatic announce retries, so requester-drain decisions must not wait on it.
*/
function hasDescendantRunAwaitingSettleFromRuns(runs, rootSessionKey, excludeRunId, requesterAgentId, requesterStorePath, settledBefore) {
	return buildSubagentRunReadIndexFromRuns({ runs: scopeRootDescendantsToRequesterAgent(runs, rootSessionKey, requesterAgentId, requesterStorePath) }).hasDescendantRunAwaitingSettle(rootSessionKey, excludeRunId, settledBefore);
}
/** Lists latest descendant runs under a requester/session tree. */
function listDescendantRunsForRequesterFromRuns(runs, rootSessionKey) {
	return buildSubagentRunReadIndexFromRuns({ runs }).listDescendantRunsForRequester(rootSessionKey);
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-read.ts
/**
* Read-only subagent registry accessors.
*
* Combines persisted snapshots with in-memory live runs for UI, announce, control, and recovery paths.
*/
/** Builds the session-list index without hydrating full retained registry payloads. */
function buildSubagentSessionListReadIndex(now = Date.now(), sessionKeys) {
	const runs = sessionKeys ? getSubagentSessionListRunsSnapshotForSessions(subagentRuns, sessionKeys) : getSubagentSessionListRunsSnapshotForRead(subagentRuns);
	return buildSubagentRunReadIndexFromRuns({
		runs,
		inMemoryRuns: sessionKeys ? [...runs.keys()].flatMap((runId) => {
			const current = subagentRuns.get(runId);
			return current ? [current] : [];
		}) : subagentRuns.values(),
		now
	});
}
/** Direct-child discovery needs only its controllers, without building global topology. */
function listSubagentSessionListRunsForControllers(controllerSessionKeys) {
	const runs = getSubagentSessionListRunsSnapshotForRead(subagentRuns, controllerSessionKeys);
	return controllerSessionKeys.flatMap((key) => listRunsForControllerFromRuns(runs, key));
}
function buildLatestSubagentSessionListReadIndex(childSessionKeys) {
	return buildLatestSubagentRunReadIndexFromRuns(getSubagentSessionListRunsSnapshotForChildSessions(childSessionKeys));
}
/** Lists runs controlled by a session key. */
function listSubagentRunsForController(controllerSessionKey, controllerAgentId) {
	return listRunsForControllerFromRuns(getSubagentRunsSnapshotForController(subagentRuns, controllerSessionKey), controllerSessionKey, controllerAgentId);
}
/** Counts active descendant runs for a requester/session tree. */
function countActiveDescendantRuns(rootSessionKey, requesterAgentId, requesterStorePath) {
	return countActiveDescendantRunsFromRuns(getSubagentRunsSnapshotForSessions(subagentRuns, [rootSessionKey]), rootSessionKey, requesterAgentId, requesterStorePath);
}
/** Lists descendant runs under a requester/session tree. */
function listDescendantRunsForRequester(rootSessionKey) {
	return listDescendantRunsForRequesterFromRuns(getSubagentRunsSnapshotForRead(subagentRuns), rootSessionKey);
}
/** Counts pending descendant runs below a requester/session tree. */
function countPendingDescendantRuns(rootSessionKey) {
	return countPendingDescendantRunsFromRuns(getSubagentRunsSnapshotForSessions(subagentRuns, [rootSessionKey]), rootSessionKey);
}
/** True when any descendant run still awaits terminal settle (suspended delivery counts as settled). */
function hasDescendantRunAwaitingSettle(rootSessionKey, excludeRunId, requesterAgentId, requesterStorePath, settledBefore) {
	return hasDescendantRunAwaitingSettleFromRuns(getSubagentRunsSnapshotForSessions(subagentRuns, [rootSessionKey]), rootSessionKey, excludeRunId, requesterAgentId, requesterStorePath, settledBefore);
}
/** Resolves the requester session and normalized origin for a child subagent session. */
function resolveRequesterForChildSession(childSessionKey) {
	const resolved = resolveRequesterForChildSessionFromRuns(getSubagentRunsSnapshotForChildSession(subagentRuns, childSessionKey), childSessionKey);
	if (!resolved) return null;
	return {
		requesterSessionKey: resolved.requesterSessionKey,
		requesterAgentId: resolved.requesterAgentId,
		requesterOrigin: normalizeDeliveryContext(resolved.requesterOrigin)
	};
}
/** True when post-completion announce should be skipped for a child session. */
function shouldIgnorePostCompletionAnnounceForSession(childSessionKey) {
	return shouldIgnorePostCompletionAnnounceForSessionFromRuns(getSubagentRunsSnapshotForChildSession(subagentRuns, childSessionKey), childSessionKey);
}
/** True when the process-local registry still owns an active run for the child session. */
function isSubagentSessionRunActive(childSessionKey) {
	return isSubagentRunLive(getLatestSubagentRunByChildSessionKeyFromRuns(subagentRuns, childSessionKey));
}
/** Lists process-local runs requested by one session key. */
function listSubagentRunsForRequester(requesterSessionKey, options) {
	return listRunsForRequesterFromRuns(subagentRuns, requesterSessionKey, options);
}
/** Whether any current or durable generation still owns this logical task, including waits/recovery. */
function hasSubagentTaskOwner(params) {
	const ownsTask = (entry) => (entry.taskRunId ?? entry.runId) === params.taskRunId && entry.childSessionKey === params.childSessionKey && entry.requesterSessionKey === params.requesterSessionKey;
	for (const entry of getSubagentRunsForChildSession(params.childSessionKey)) if (ownsTask(entry)) return true;
	return loadSubagentRunsForChildSessionFromSqlite(params.childSessionKey).some(ownsTask);
}
/** Returns the preferred child-session run from its scoped readable snapshot. */
function getSubagentRunByChildSessionKey(childSessionKey) {
	const key = childSessionKey.trim();
	if (!key) return null;
	return getSubagentRunByChildSessionKeyFromRuns(getSubagentRunsSnapshotForChildSession(subagentRuns, key), key);
}
/** Returns the most recently created run for a child session from readable registry state. */
function getLatestSubagentRunByChildSessionKey(childSessionKey) {
	const key = childSessionKey.trim();
	if (!key) return null;
	return getLatestSubagentRunByChildSessionKeyFromRuns(getSubagentRunsSnapshotForChildSession(subagentRuns, key), key) ?? null;
}
/**
* Returns the authoritative process-local run for mutation ownership checks.
*
* `matches` restricts the search to a row class the caller owns; see
* `getLatestSubagentRunByChildSessionKeyFromRuns`.
*/
function getLatestLiveSubagentRunByChildSessionKey(childSessionKey, matches) {
	const key = childSessionKey.trim();
	if (!key) return null;
	return getLatestSubagentRunByChildSessionKeyFromRuns(getSubagentRunsForChildSession(key), key, matches) ?? null;
}
/** Consume fresh retained state and the current live overlay in the caller's synchronous phase. */
async function withPreparedLatestSubagentRunByChildSessionKey(childSessionKey, context, consume) {
	const key = childSessionKey.trim();
	const requestSignal = getAsyncWorkSignal();
	const readOptions = {
		path: context.admission.databasePath,
		env: context.environment
	};
	const snapshot = getActiveOpenClawStateDatabaseReadSnapshot(readOptions);
	const assertCurrent = () => {
		requestSignal?.throwIfAborted();
		getAsyncWorkSignal()?.throwIfAborted();
		if (getActiveOpenClawStateDatabaseReadSnapshot(readOptions) !== snapshot) throw new Error("Prepared subagent child-session read left its database snapshot scope");
		context.maintenanceScope?.assertAdmission();
		context.admission.assertCurrent();
	};
	for (;;) {
		assertCurrent();
		const revision = getSubagentRegistryPublicationRevision();
		const reply = key && (!isVitestRuntimeEnv() || process.env.OPENCLAW_TEST_READ_SUBAGENT_RUNS_FROM_SQLITE === "1") ? await executeExistingOpenClawStateRead(readOptions, {
			type: "subagents.forChildSession",
			childSessionKey: key
		}, { context }) : void 0;
		assertCurrent();
		if (revision !== getSubagentRegistryPublicationRevision()) continue;
		if (reply && (!reply.ok || reply.type !== "subagents.forChildSession")) throw new Error("Unexpected subagent child-session read response");
		const persisted = reply?.runs ?? [];
		let active = true;
		try {
			return consume(() => {
				assertCurrent();
				if (!active || revision !== getSubagentRegistryPublicationRevision()) throw new Error("Prepared subagent child-session read is no longer current");
				return key ? getLatestSubagentRunByChildSessionKeyFromRuns(getPreparedSubagentRunsSnapshotForChildSession(subagentRuns, key, persisted, context), key) ?? null : null;
			});
		} finally {
			active = false;
		}
	}
}
//#endregion
export { persistSubagentRunsToDiskAsyncOrThrow as A, clearSubagentRunsReadCacheForTest as C, getSubagentSessionListRunsSnapshotForRead as D, getSubagentSessionListReadSnapshotIdentity as E, publishSubagentRunsAfterAtomicStore as F, restoreSubagentRunsFromDisk as I, withSubagentRunReadSnapshot as L, prepareOptionalSubagentSessionListReadCache as M, prepareSubagentRunsSnapshotForRunIds as N, onSubagentRegistryPersisted as O, prepareSubagentSessionListReadCache as P, SubagentRegistryWriteError as R, selectConnectedSettledSubagentWave as S, getSubagentRunsSnapshotForRead as T, withPreparedLatestSubagentRunByChildSessionKey as _, getLatestLiveSubagentRunByChildSessionKey as a, getLatestSubagentRunByChildSessionKeyFromRuns as b, hasDescendantRunAwaitingSettle as c, listDescendantRunsForRequester as d, listSubagentRunsForController as f, shouldIgnorePostCompletionAnnounceForSession as g, resolveRequesterForChildSession as h, countPendingDescendantRuns as i, persistSubagentRunsToDiskOrThrow as j, persistSubagentRunsToDisk as k, hasSubagentTaskOwner as l, listSubagentSessionListRunsForControllers as m, buildSubagentSessionListReadIndex as n, getLatestSubagentRunByChildSessionKey as o, listSubagentRunsForRequester as p, countActiveDescendantRuns as r, getSubagentRunByChildSessionKey as s, buildLatestSubagentSessionListReadIndex as t, isSubagentSessionRunActive as u, buildSubagentRunReadIndexFromRuns as v, getSubagentMaintenanceRunsSnapshotForRead as w, listSwarmRunsForGroupFromRuns as x, countActiveRunsForSessionFromRuns as y };
