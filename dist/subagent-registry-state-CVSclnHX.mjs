import { r as getAsyncWorkSignal } from "./async-work-scope-BYeX3gh6.mjs";
import { n as isVitestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import "./env-BBJTTIuE.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { t as SqliteSnapshotCleanupError } from "./sqlite-readonly-location-cleanup-CPS8QEIp.mjs";
import { i as isStateDatabaseReadAdmissionInvalidatedError } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
import { f as openClawStateDatabaseCache, n as captureOpenClawStateDatabaseReadAdmission } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { n as getActiveOpenClawStateDatabaseReadSnapshot, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { i as prepareOpenClawStateReadSource, r as captureOpenClawStateWorkerContext, t as captureOpenClawStateReadContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { t as freezeJsonSnapshot } from "./immutable-data-MyNs7ITg.mjs";
import { n as emitSessionLifecycleEvent } from "./session-lifecycle-events-qdejgRzS.mjs";
import { A as rememberSubagentRunVersion, D as matchesSubagentChildSessionOwner, K as projectSubagentRunForMaintenance, a as loadSubagentRunsForControllerFromSqlite, d as collectSubagentSessionReadKeys, g as copySubagentRunRuntimeOwner, i as loadSubagentRunsForChildSessionFromSqlite, n as loadSubagentMaintenanceRunsFromSqlite, p as resolveControllerSessionKey, q as projectSubagentRunForSessionList, r as loadSubagentRegistryFromSqlite, u as SubagentSessionReadLookup } from "./subagent-registry.store.sqlite-DIYyRjhZ.mjs";
import { i as getSubagentRunsForChildSession, l as immutableSubagentRun, m as subscribeSubagentRunChanges, p as publishSubagentRunChanges, s as getSubagentSessionReadLookup, u as subagentRuns } from "./subagent-registry-memory-guooOkCK.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/subagents/registry/subagent-registry-read-cache.ts
function getSessionListLookup(cache, snapshot) {
	const state = cache.state;
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
/** Selecting a read must not consume another database owner's publication. */
function selectSubagentCacheStateForRead(state, context) {
	const identity = state.retiredPublicationIdentity ?? state.admission?.identity;
	return (context ? !state.retiredPublicationIdentity && matchesSubagentCacheAdmission(state.admission, context.admission) && (state.sourceIdentity === void 0 || state.sourceIdentity === context.admission.identity.key) : !identity || identity === openClawStateDatabaseCache.getKnownOpenClawStateDatabaseIdentity(resolveOpenClawStateSqlitePath())) ? state : {};
}
function rememberSubagentRunsSnapshot(cache, runs, changedRunIds, databasePath) {
	let admission;
	let retiredPublicationIdentity;
	try {
		admission = captureSubagentFactsAdmission(databasePath);
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
	if (previous.pending?.committedRevision !== void 0) previous.pending.committedRevision += 1;
	const snapshot = previous.snapshot;
	if (!changedRunIds) {
		cache.state = {
			snapshot: new Map([...runs].map(([runId, entry]) => [runId, cache.copy(entry)])),
			...owner,
			pending: previous.pending
		};
		return;
	}
	if (!snapshot) {
		const changes = previous.changes ?? /* @__PURE__ */ new Map();
		for (const runId of changedRunIds) {
			const entry = runs.get(runId);
			changes.set(runId, { entry: entry ? cache.copy(entry) : void 0 });
		}
		cache.state = {
			changes,
			...owner,
			pending: previous.pending
		};
		return;
	}
	const lookup = previous.lookup;
	previous.lookup = void 0;
	for (const runId of new Set(changedRunIds)) {
		const entry = runs.get(runId);
		if (entry) snapshot.set(runId, cache.copy(entry));
		else snapshot.delete(runId);
		lookup?.set(runId, snapshot.get(runId));
	}
	cache.state = {
		snapshot,
		...owner,
		pending: previous.pending,
		...lookup ? { lookup } : {}
	};
}
function getPersistedSubagentRunsSnapshot(cache, prepared) {
	let admission;
	if (!cache.load) {
		const context = prepared ?? captureOpenClawStateReadContext();
		context.maintenanceScope?.assertAdmission();
		context.admission.assertCurrent();
		admission = context.admission;
	} else try {
		admission = captureSubagentFactsAdmission();
	} catch (error) {
		if (!isStateDatabaseReadAdmissionInvalidatedError(error)) throw error;
		const state = selectSubagentCacheStateForRead(cache.state);
		return applySubagentRunChanges(new Map(state.snapshot), state.changes);
	}
	if (cache.state.retiredPublicationIdentity || !matchesSubagentCacheAdmission(cache.state.admission, admission) || admission && cache.state.sourceIdentity !== admission.identity.key) {
		if (!prepared) cache.state = {
			admission,
			sourceIdentity: admission?.identity.key
		};
		return null;
	}
	return cache.state.pending ? null : cache.state.snapshot ?? null;
}
function loadPersistedSubagentRunsForRead(cache, prepared) {
	const cached = getPersistedSubagentRunsSnapshot(cache, prepared);
	if (cached) return cached;
	if (!cache.load) throw new Error("Subagent session-list facts must be prepared before synchronous reads");
	const runs = applySubagentRunChanges(cache.load(), cache.state.changes);
	runs.forEach(freezeJsonSnapshot);
	const admission = captureSubagentFactsAdmission();
	cache.state = {
		snapshot: runs,
		admission,
		sourceIdentity: admission?.identity.key
	};
	return runs;
}
function assertSubagentReadContext(context) {
	getAsyncWorkSignal()?.throwIfAborted();
	context.maintenanceScope?.assertAdmission();
	context.admission.assertCurrent();
	if (captureOpenClawStateReadContext().admission.identity.key !== context.admission.identity.key) throw new Error("Subagent registry database changed during preparation");
}
function getSubagentRunsSnapshot(inMemoryRuns, cache, scope) {
	if (shouldReadPersistedSubagentRuns() && !cache.load && !getPersistedSubagentRunsSnapshot(cache, scope?.context)) throw new Error("Subagent session-list facts must be prepared before synchronous reads");
	const merged = /* @__PURE__ */ new Map();
	if (shouldReadPersistedSubagentRuns()) try {
		const cached = scope?.load && !scope.fresh ? getPersistedSubagentRunsSnapshot(cache, scope.context) : null;
		const cachedRows = cached && scope?.selectCached ? indexedSnapshotRows(cached, scope.selectCached(getSessionListLookup(cache, cached))) : cached?.values();
		const persisted = scope?.load ? cachedRows ?? scope.load() : loadPersistedSubagentRunsForRead(cache, scope?.context).values();
		for (const entry of persisted) if (!scope || scope.matches(entry)) merged.set(entry.runId, entry);
	} catch {}
	if (shouldReadPersistedSubagentRuns()) {
		const state = selectSubagentCacheStateForRead(cache.state, scope?.context);
		for (const [runId, { entry }] of state.changes ?? []) if (entry && (!scope || scope.matches(entry))) merged.set(runId, entry);
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
	}, { type: "subagents.sessionList" }, { context });
	if (!reply) return /* @__PURE__ */ new Map();
	if (!reply.ok || reply.type !== "subagents.sessionList") throw new Error("Unexpected compact subagent registry read result");
	if ("unavailable" in reply) {
		const failure = new Error(reply.unavailable.message);
		retainOpenClawStateWorkerErrorPayload(failure, reply.unavailable.error);
		throw new SubagentSessionListUnavailableError(reply.unavailable.message, { cause: hydrateOpenClawStateWorkerError(failure, { includeOrdinary: true }) });
	}
	reply.runs.forEach(freezeJsonSnapshot);
	return reply.runs;
}
async function readFullSubagentRuns(context, scope, options = {}) {
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
	}, options.current ? {
		context,
		current: true
	} : void 0);
	assertSubagentReadContext(context);
	if (!reply) return /* @__PURE__ */ new Map();
	if (!reply.ok || reply.type !== "subagents.runs" || reply.projection === "maintenance") throw new Error("Unexpected subagent registry read result");
	if (options.current && scope.kind === "all" && reply.versions && [...reply.versions].some(([runId, version]) => version !== null && !reply.runs.has(runId))) throw new Error("Canonical subagent restore found an unreadable durable row");
	for (const [runId, entry] of reply.runs) {
		const version = reply.versions?.get(runId);
		if (version) rememberSubagentRunVersion(entry, version);
		immutableSubagentRun(entry);
	}
	return reply.runs;
}
async function prepareSubagentRunsCache(cache, load, prepared) {
	const context = prepared ?? captureOpenClawStateWorkerContext();
	const assertCurrent = () => {
		if (!prepared) {
			assertSubagentReadContext(context);
			return;
		}
		getAsyncWorkSignal()?.throwIfAborted();
		context.maintenanceScope?.assertAdmission();
		context.admission.assertCurrent();
	};
	assertCurrent();
	if (getActiveOpenClawStateDatabaseReadSnapshot({
		path: context.admission.databasePath,
		env: context.environment
	})) {
		const runs = await load(context);
		assertCurrent();
		return runs;
	}
	const callerAbortSignal = getAsyncWorkSignal();
	let retriedCanceledFill = false;
	while (true) {
		assertCurrent();
		let state = cache.state;
		if (!matchesSubagentCacheAdmission(state.admission, context.admission) || state.sourceIdentity !== void 0 && state.sourceIdentity !== context.admission.identity.key) cache.state = state = {
			admission: captureSubagentFactsAdmission(context.admission.databasePath),
			sourceIdentity: context.admission.identity.key
		};
		if (state.snapshot && !state.pending) return state.snapshot;
		if (!state.pending) {
			const sourceIdentity = context.admission.identity.key;
			state.admission = captureSubagentFactsAdmission(context.admission.databasePath);
			state.sourceIdentity = sourceIdentity;
			const fill = {
				ownerAbortSignal: callerAbortSignal,
				promise: Promise.resolve().then(async () => {
					const runs = await load(context);
					try {
						assertCurrent();
					} catch (error) {
						fill.cleanCancellation = fill.ownerAbortSignal?.aborted === true && error === fill.ownerAbortSignal.reason && !(error instanceof AggregateError) && !isStateDatabaseReadAdmissionInvalidatedError(error) && !(error instanceof SqliteSnapshotCleanupError);
						throw error;
					}
					if (cache.state.pending === fill && !cache.state.snapshot) {
						const admission = captureSubagentFactsAdmission(context.admission.databasePath);
						cache.state = sourceIdentity === admission.identity.key ? {
							snapshot: applySubagentRunChanges(runs, cache.state.changes),
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
			assertCurrent();
			retriedCanceledFill = true;
		} finally {
			if (cache.state.pending === fill) cache.state.pending = void 0;
		}
		if (prepared && cache.state.sourceIdentity !== void 0 && cache.state.sourceIdentity !== context.admission.identity.key) throw new Error("Subagent registry database changed during preparation");
	}
}
/** Restore consumes durable rows before another host publication can overtake the accepted read. */
async function consumeFreshSubagentRuns(cache, context, consume) {
	assertSubagentReadContext(context);
	while (cache.state.pending) {
		await cache.state.pending.promise;
		assertSubagentReadContext(context);
	}
	const state = {
		...selectSubagentCacheStateForRead(cache.state, context),
		admission: captureSubagentFactsAdmission(context.admission.databasePath),
		sourceIdentity: context.admission.identity.key
	};
	cache.state = state;
	let result;
	const fill = {
		committedRevision: 0,
		promise: Promise.resolve().then(async () => {
			while (true) {
				assertSubagentReadContext(context);
				const revision = fill.committedRevision;
				const runs = await readFullSubagentRuns(context, { kind: "all" }, { current: true });
				assertSubagentReadContext(context);
				if (cache.state.pending !== fill) throw new Error("Subagent restore lost its accepted read owner");
				if (revision !== fill.committedRevision) continue;
				result = consumeSubagentRuns(runs, () => consume(runs));
				return;
			}
		})
	};
	state.pending = fill;
	try {
		await fill.promise;
		return result;
	} finally {
		if (cache.state.pending === fill) cache.state.pending = void 0;
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
function mergeSelectedFullRuns(cache, inMemoryRuns, persisted, matches, { context, runIds, freshPersisted = false } = {}) {
	const current = context && !freshPersisted ? acceptedFullSnapshot(cache, context) : void 0;
	const merged = /* @__PURE__ */ new Map();
	for (const [runId, entry] of selectedEntries(current ?? persisted, runIds)) if (matches(entry)) merged.set(runId, entry);
	const state = selectSubagentCacheStateForRead(cache.state, context);
	if (context && !freshPersisted && !getActiveOpenClawStateDatabaseReadSnapshot({
		path: context.admission.databasePath,
		env: context.environment
	}) && state.sourceIdentity === context.admission.identity.key && matchesSubagentCacheAdmission(state.admission, context.admission)) for (const [runId, { entry }] of state.changes ? selectedEntries(state.changes, runIds) : []) if (entry && matches(entry)) merged.set(runId, entry);
	else merged.delete(runId);
	for (const [runId, entry] of selectedEntries(inMemoryRuns, runIds)) if (matches(entry)) merged.set(runId, entry);
	else merged.delete(runId);
	return merged;
}
function* selectedEntries(rows, runIds) {
	if (!runIds) {
		yield* rows;
		return;
	}
	for (const runId of runIds) {
		const entry = rows.get(runId);
		if (entry !== void 0) yield [runId, entry];
	}
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
	const { inMemoryRuns, fullCache, compactCache, select, readScope } = params;
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
		if (readScope !== "all") {
			let liveKeys;
			let persistedKeys;
			if ("runIds" in readScope) {
				liveKeys = getSubagentSessionReadLookup(inMemoryRuns).selectRunIds(readScope.runIds);
				persistedKeys = getSessionListLookup(compactCache, compact).selectRunIds(readScope.runIds, liveKeys);
			} else {
				const live = getSubagentSessionReadLookup(inMemoryRuns);
				const durable = getSessionListLookup(compactCache, compact);
				liveKeys = live.selectReadScope(readScope.sessionKeys, durable, readScope.descendants);
				persistedKeys = durable.selectReadScope(readScope.sessionKeys, live, readScope.descendants, liveKeys);
			}
			const snapshot = /* @__PURE__ */ new Map();
			for (const key of /* @__PURE__ */ new Set([...persistedKeys, ...liveKeys])) {
				const live = inMemoryRuns.get(key);
				const entry = live ? projectSubagentRunForSessionList(live) : compact.get(key);
				if (entry) snapshot.set(key, entry);
			}
			return snapshot;
		}
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
				for (const payloadScope of scopes) for (const [runId, entry] of await readFullSubagentRuns(context, payloadScope)) persisted.set(runId, entry);
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
			const full = mergeSelectedFullRuns(fullCache, inMemoryRuns, preparedPayloads, matches, {
				context,
				runIds: new Set(snapshot.keys())
			});
			for (const entry of full.values()) if (inMemoryRuns.get(entry.runId) !== entry) snapshot.set(entry.runId, projectSubagentRunForSessionList(entry));
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
/** The durable basis is fresh worker evidence; live liveness remains parent-owned. */
async function prepareSubagentSessionRunReadSnapshot(params) {
	const { inMemoryRuns, fullCache } = params;
	const context = captureOpenClawStateWorkerContext();
	const signal = getAsyncWorkSignal();
	const roots = Object.freeze([...new Set(params.sessionKeys.map((key) => key.trim()).filter(Boolean))].toSorted());
	const localRuns = () => mergeSelectedFullRuns(fullCache, inMemoryRuns, /* @__PURE__ */ new Map(), () => true, {
		context,
		freshPersisted: true
	});
	const topology = () => [...localRuns().values()].map(({ childSessionKey, requesterSessionKey }) => ({
		childSessionKey,
		requesterSessionKey
	})).toSorted((left, right) => left.childSessionKey.localeCompare(right.childSessionKey) || left.requesterSessionKey.localeCompare(right.requesterSessionKey));
	let disposed = false;
	const assertCurrent = () => {
		if (disposed) throw new Error("Prepared subagent descendant read was released");
		signal?.throwIfAborted();
		assertSubagentReadContext(context);
	};
	let changed = () => {};
	const unsubscribe = subscribeSubagentRunChanges("projection", ({ runIds }) => changed(runIds));
	const dispose = () => {
		disposed = true;
		unsubscribe();
	};
	try {
		for (;;) {
			assertCurrent();
			const publications = [];
			changed = (ids) => publications.push(ids);
			const links = topology();
			const reply = await executeExistingOpenClawStateRead({
				path: context.admission.databasePath,
				env: context.environment
			}, {
				type: "subagents.runs",
				scope: {
					kind: "descendants",
					sessionKeys: roots,
					liveTopology: links
				}
			}, {
				context,
				current: true
			});
			assertCurrent();
			if (reply && (!reply.ok || reply.type !== "subagents.runs" || reply.projection === "maintenance" || !reply.descendantBasis)) throw new Error("Subagent descendant read omitted its durable basis");
			const persisted = reply?.runs ?? /* @__PURE__ */ new Map();
			const physicalIds = new Set(reply?.descendantBasis?.runIds.map((id) => id.trim()));
			const selected = reply?.descendantBasis?.sessionKeys ?? collectSubagentSessionReadKeys(roots, links);
			const relevantEntry = (entry) => Boolean(entry && (selected.has(entry.childSessionKey.trim()) || selected.has(entry.requesterSessionKey)));
			const relevantPublication = (ids) => ids === void 0 || ids.some((id) => physicalIds.has(id.trim()) || relevantEntry(inMemoryRuns.get(id)) || relevantEntry(fullCache.state.snapshot?.get(id)) || relevantEntry(fullCache.state.changes?.get(id)?.entry));
			const relevantLinks = (values) => values.filter(relevantEntry);
			const expectedTopology = JSON.stringify(relevantLinks(links));
			if (publications.some(relevantPublication) || expectedTopology !== JSON.stringify(relevantLinks(topology()))) continue;
			let invalidated = false;
			changed = (ids) => {
				invalidated ||= relevantPublication(ids);
			};
			return {
				basis: Object.freeze({
					databasePath: context.admission.databasePath,
					databaseIdentity: context.admission.identity.key,
					...context.admission.identity.birthtime ? { databaseBirthtime: context.admission.identity.birthtime } : {},
					sessionKeys: roots,
					liveTopology: Object.freeze(links.map((link) => Object.freeze(link))),
					digest: reply?.descendantBasis?.digest ?? null
				}),
				dispose,
				consume(consume) {
					assertCurrent();
					if (invalidated || expectedTopology !== JSON.stringify(relevantLinks(topology()))) return { ready: false };
					return {
						ready: true,
						value: consumeSubagentRuns(mergeSelectedFullRuns(fullCache, inMemoryRuns, persisted, (entry) => selected.has(entry.childSessionKey.trim()), {
							context,
							freshPersisted: true
						}), consume)
					};
				}
			};
		}
	} catch (error) {
		dispose();
		throw error;
	}
}
/** Fresh physical maintenance facts combine with current published resident rows. */
async function prepareSubagentMaintenanceReadSnapshot(inMemoryRuns, cache) {
	const context = shouldReadPersistedSubagentRuns() ? captureOpenClawStateWorkerContext() : void 0;
	const signal = getAsyncWorkSignal();
	let disposed = false;
	const assertCurrent = () => {
		if (disposed) throw new Error("Prepared subagent maintenance read was released");
		signal?.throwIfAborted();
		getAsyncWorkSignal()?.throwIfAborted();
		if (context) assertSubagentReadContext(context);
	};
	const stateForRead = () => context ? selectSubagentCacheStateForRead(cache.state, context) : {};
	const capture = (persisted) => {
		assertCurrent();
		const runs = new Map(persisted);
		for (const [runId, entry] of inMemoryRuns) runs.set(runId, cache.project(entry));
		return runs;
	};
	if (!context) return {
		capture: () => capture(/* @__PURE__ */ new Map()),
		dispose: () => {
			disposed = true;
		}
	};
	let invalidated = false;
	let published = () => {
		invalidated = true;
	};
	const unsubscribe = subscribeSubagentRunChanges("projection", ({ runIds }) => published(runIds));
	const dispose = () => {
		disposed = true;
		unsubscribe();
	};
	try {
		for (;;) {
			assertCurrent();
			invalidated = false;
			const reply = await executeExistingOpenClawStateRead({
				path: context.admission.databasePath,
				env: context.environment
			}, {
				type: "subagents.runs",
				scope: { kind: "maintenance" }
			}, {
				context,
				current: true
			});
			assertCurrent();
			if (reply && (!reply.ok || reply.type !== "subagents.runs" || reply.projection !== "maintenance")) throw new Error("Unexpected subagent maintenance read result");
			if (invalidated) continue;
			const persisted = reply?.runs ?? /* @__PURE__ */ new Map();
			published = (runIds) => {
				const state = stateForRead();
				if (state.sourceIdentity !== context.admission.identity.key) return;
				if (runIds === void 0) {
					const replacement = state.snapshot;
					invalidated ||= !replacement || replacement.size !== persisted.size || [...persisted].some(([runId, entry]) => !isDeepStrictEqual(entry, replacement.get(runId)));
					return;
				}
				invalidated ||= runIds.some((runId) => {
					const change = state.changes?.get(runId);
					const entry = change ? change.entry : state.snapshot?.get(runId);
					return !isDeepStrictEqual(persisted.get(runId), entry);
				});
			};
			return {
				basis: Object.freeze({
					databasePath: context.admission.databasePath,
					databaseIdentity: context.admission.identity.key,
					...context.admission.identity.birthtime ? { databaseBirthtime: context.admission.identity.birthtime } : {},
					digest: reply?.maintenanceDigest ?? null
				}),
				dispose,
				capture() {
					assertCurrent();
					if (invalidated) throw new Error("Subagent maintenance facts changed during preparation");
					return capture(persisted);
				}
			};
		}
	} catch (error) {
		dispose();
		throw error;
	}
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-state.ts
const persistedSubagentRunsReadCache = {
	state: {},
	load: loadSubagentRegistryFromSqlite,
	copy: immutableSubagentRun,
	project: (entry) => entry
};
const persistedSubagentSessionListRunsReadCache = {
	state: {},
	copy: (entry) => freezeJsonSnapshot(projectSubagentRunForSessionList(entry)),
	project: projectSubagentRunForSessionList
};
const persistedSubagentMaintenanceRunsReadCache = {
	state: {},
	load: () => loadSubagentMaintenanceRunsFromSqlite(),
	copy: (entry) => freezeJsonSnapshot(copySubagentRunRuntimeOwner(entry, projectSubagentRunForMaintenance(entry))),
	project: (entry) => entry
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
function rememberPersistedSubagentRunsSnapshot(runs, changedRunIds, databasePath) {
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
	]) rememberSubagentRunsSnapshot(cache, runs, changedRunIds, databasePath);
	return keys;
}
/** Publishes registry rows already committed by a cross-owner shared-state transaction. */
function publishSubagentRunsAfterAtomicStore(runs, changedRunIds, deferredObserverEvents, databasePath) {
	subagentRuns.settleCompletionAuthorities(runs, changedRunIds);
	const keys = rememberPersistedSubagentRunsSnapshot(runs, changedRunIds, databasePath);
	const events = updateCommittedSwarmNotifications(runs, changedRunIds);
	deferredObserverEvents.push(() => {
		publishSubagentRunChanges(keys, changedRunIds, "persistence");
		events.forEach(emitSessionLifecycleEvent);
	});
}
/** Hydration establishes a notification baseline before synchronous ownership observers run. */
function rememberRestoredSubagentRunNotification(entry) {
	const notification = swarmNotification(entry);
	if (notification) committedSwarmNotifications.set(entry.runId, notification);
	else committedSwarmNotifications.delete(entry.runId);
}
/** Existing resident facts, fenced by the physical source rather than a publisher's scope. */
function getSubagentSessionListReadSnapshotIdentity() {
	if (!shouldReadPersistedSubagentRuns()) return subagentRuns;
	return getPersistedSubagentRunsSnapshot(persistedSubagentSessionListRunsReadCache) ?? void 0;
}
/** A long-lived projection retains its source; registry publications still own the facts. */
function createSubagentSessionListReadView(options) {
	const path = options.path ?? resolveOpenClawStateSqlitePath(options.env);
	const source = prepareOpenClawStateReadSource({
		path,
		env: options.env
	});
	const cache = persistedSubagentSessionListRunsReadCache;
	const readPersisted = shouldReadPersistedSubagentRuns();
	const matches = () => true;
	const prepare = (context) => prepareSubagentRunsCache(cache, readCompactSubagentRuns, context);
	return {
		snapshotIdentity() {
			if (!readPersisted) return subagentRuns;
			return getPersistedSubagentRunsSnapshot(cache, source.current()) ?? void 0;
		},
		runs(runIds) {
			if (runIds) {
				const persisted = readPersisted ? getPersistedSubagentRunsSnapshot(cache, source.current()) : void 0;
				const selected = /* @__PURE__ */ new Map();
				for (const runId of runIds) {
					const live = subagentRuns.get(runId);
					const entry = live ? cache.project(live) : persisted?.get(runId);
					if (entry) selected.set(runId, entry);
				}
				return selected;
			}
			return getSubagentRunsSnapshot(subagentRuns, cache, {
				context: readPersisted ? source.current() : void 0,
				matches
			});
		},
		async prepare() {
			if (!readPersisted) return;
			if (getActiveOpenClawStateDatabaseReadSnapshot({
				path,
				env: options.env
			})) throw new Error("Resident subagent preparation cannot adopt a private database snapshot");
			await source.withCurrent(prepare);
		}
	};
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
	committedSwarmNotifications.clear();
	persistedSubagentRunsReadCache.state = {};
	persistedSubagentSessionListRunsReadCache.state = {};
	persistedSubagentMaintenanceRunsReadCache.state = {};
}
/** Consume a canonical worker read without crossing a cache-publication invalidation. */
function consumeFreshSubagentRegistryRows(context, consume) {
	return consumeFreshSubagentRuns(persistedSubagentRunsReadCache, context, consume);
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
		for (const runId of lookup.selectChildren(keys)) {
			const persisted = snapshot.get(runId);
			const live = persisted && subagentRuns.get(persisted.runId);
			const entry = live ? cache.project(live) : persisted;
			if (entry && keys.has(entry.childSessionKey.trim())) selected.set(entry.runId, entry);
		}
	}
	for (const key of keys) for (const entry of getSubagentRunsForChildSession(key)) selected.set(entry.runId, cache.project(entry));
	return selected;
}
function prepareSubagentMaintenanceRunsSnapshotForRead(inMemoryRuns) {
	return prepareSubagentMaintenanceReadSnapshot(inMemoryRuns, persistedSubagentMaintenanceRunsReadCache);
}
function getSubagentMaintenanceRunsSnapshotForRead(inMemoryRuns) {
	return getSubagentRunsSnapshot(inMemoryRuns, persistedSubagentMaintenanceRunsReadCache);
}
/** Hydrate selected payloads, then capture their current graph and raw owners in one frame. */
async function withSubagentRunReadSnapshot(inMemoryRuns, select, consume, readScope) {
	for (;;) {
		const result = (await prepareSubagentRunReadSnapshot({
			inMemoryRuns,
			fullCache: persistedSubagentRunsReadCache,
			compactCache: persistedSubagentSessionListRunsReadCache,
			select,
			readScope
		})).consume(consume);
		if (result.ready) return result.value;
	}
}
function prepareSubagentRunsSnapshotForSessions(inMemoryRuns, sessionKeys) {
	return prepareSubagentSessionRunReadSnapshot({
		inMemoryRuns,
		sessionKeys,
		fullCache: persistedSubagentRunsReadCache
	});
}
async function prepareSubagentRunsSnapshotForRunIds(inMemoryRuns, runIds) {
	const requested = new Set(runIds.map((runId) => runId.trim()));
	const matches = (entry) => requested.has(entry.runId) || Boolean(entry.swarmRunId && requested.has(entry.swarmRunId));
	const prepared = await prepareSubagentRunReadSnapshot({
		inMemoryRuns,
		fullCache: persistedSubagentRunsReadCache,
		compactCache: persistedSubagentSessionListRunsReadCache,
		readScope: { runIds: requested },
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
		const matches = (entry) => keys.has(resolveControllerSessionKey(entry));
		const cache = persistedSubagentSessionListRunsReadCache;
		const cached = shouldReadPersistedSubagentRuns() ? getPersistedSubagentRunsSnapshot(cache) : null;
		if (!cached) {
			if (!shouldReadPersistedSubagentRuns()) return getSubagentRunsSnapshot(inMemoryRuns, cache, { matches });
			throw new Error("Subagent session-list facts must be prepared before synchronous reads");
		}
		const lookup = getSessionListLookup(cache, cached);
		return getSubagentRunsSnapshot(inMemoryRuns, cache, {
			fresh: true,
			load: () => indexedSnapshotRows(cached, lookup.selectControllers(keys)),
			matches
		});
	}
	return getSubagentRunsSnapshot(inMemoryRuns, persistedSubagentSessionListRunsReadCache);
}
/** Exact rows share the owner snapshot while projecting only their complete requester trees. */
function getSubagentSessionListRunsSnapshotForSessions(inMemoryRuns, sessionKeys) {
	if (!sessionKeys.some((key) => key.trim())) return /* @__PURE__ */ new Map();
	const cache = persistedSubagentSessionListRunsReadCache;
	const cached = shouldReadPersistedSubagentRuns() ? getPersistedSubagentRunsSnapshot(cache) : null;
	const indexed = (cached ? getSessionListLookup(cache, cached) : void 0)?.selectSessions(sessionKeys, inMemoryRuns.values());
	const selected = indexed?.sessionKeys ?? collectSubagentSessionReadKeys(sessionKeys, cached?.values() ?? [], inMemoryRuns.values());
	return getSubagentRunsSnapshot(inMemoryRuns, cache, {
		fresh: true,
		load: () => {
			if (cached) return indexed ? indexedSnapshotRows(cached, indexed.cacheKeys) : cached.values();
			throw new Error("Subagent session-list facts must be prepared before synchronous reads");
		},
		matches: (entry) => selected.has(entry.childSessionKey.trim())
	});
}
function getSubagentRunsSnapshotForController(inMemoryRuns, controllerSessionKey) {
	const key = controllerSessionKey.trim();
	if (!key) return /* @__PURE__ */ new Map();
	return getSubagentRunsSnapshot(inMemoryRuns, persistedSubagentRunsReadCache, {
		selectCached: (lookup) => lookup.selectControllers(/* @__PURE__ */ new Set([key])),
		load: () => loadSubagentRunsForControllerFromSqlite(key).map(freezeJsonSnapshot),
		matches: (entry) => resolveControllerSessionKey(entry) === key
	});
}
function getSubagentRunsSnapshotForChildSession(inMemoryRuns, childSessionKey, childAgentId) {
	const key = childSessionKey.trim();
	if (!key) return /* @__PURE__ */ new Map();
	return getSubagentRunsSnapshot(inMemoryRuns, persistedSubagentRunsReadCache, {
		selectCached: (lookup) => lookup.selectChildren(/* @__PURE__ */ new Set([key])),
		load: () => loadSubagentRunsForChildSessionFromSqlite(key).map(freezeJsonSnapshot),
		matches: (entry) => matchesSubagentChildSessionOwner(entry, key, childAgentId)
	});
}
//#endregion
export { publishSubagentRunsAfterAtomicStore as _, getSubagentRunsSnapshotForChildSession as a, assertSubagentReadContext as b, getSubagentSessionListReadSnapshotIdentity as c, getSubagentSessionListRunsSnapshotForSessions as d, prepareOptionalSubagentSessionListReadCache as f, prepareSubagentSessionListReadCache as g, prepareSubagentRunsSnapshotForSessions as h, getSubagentMaintenanceRunsSnapshotForRead as i, getSubagentSessionListRunsSnapshotForChildSessions as l, prepareSubagentRunsSnapshotForRunIds as m, consumeFreshSubagentRegistryRows as n, getSubagentRunsSnapshotForController as o, prepareSubagentMaintenanceRunsSnapshotForRead as p, createSubagentSessionListReadView as r, getSubagentRunsSnapshotForRead as s, clearSubagentRunsReadCacheForTest as t, getSubagentSessionListRunsSnapshotForRead as u, rememberRestoredSubagentRunNotification as v, readFullSubagentRuns as x, withSubagentRunReadSnapshot as y };
