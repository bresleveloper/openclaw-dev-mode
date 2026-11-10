import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import { h as runOutsideOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { i as encodeAgentDatabaseReaderRequest, s as matchesAgentDatabaseReadCandidatePath } from "./agent-database-readers-DSwi8tar.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { o as registerOpenClawAgentDatabaseAsyncResource, s as registerOpenClawAgentDatabaseReadCandidateResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { n as joinOwnedWorkerTasks, r as WorkerTaskError } from "./src-NEpyeLp1.mjs";
import "./worker-task-pool-D6ogd941.mjs";
import { n as runWithSqliteDatabaseAdmissionTurn } from "./sqlite-database-admission-turn-BwijprYk.mjs";
import "./session-key-CSDERtm3.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { a as measureSessionStoreTargetInventoryInputBytes } from "./session-store-read-candidates-CmVF2223.mjs";
import { n as decodeSessionTranscriptWorkerReadError, o as unwrapSessionTranscriptWorkerReply } from "./session-history-worker-errors-D75quOgT.mjs";
import { a as getPendingOpenClawAgentDatabasePreparation } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { n as createSessionTranscriptWorkerLanes } from "./session-transcript-read-pools-DSkIQlUd.mjs";
import path from "node:path";
import { channel } from "node:diagnostics_channel";
//#region src/config/sessions/session-transcript-worker-resources.ts
const historyDatabases = /* @__PURE__ */ new Map();
const historySetTimeout = setTimeout;
const historyClearTimeout = clearTimeout;
const { historyLane, transcriptSearchLane, projectionLane, maintenanceLane, targetDiscoveryLane, costReadLane, costRefreshLane } = createSessionTranscriptWorkerLanes();
const historyWorkerLanes = [
	historyLane,
	transcriptSearchLane,
	projectionLane,
	maintenanceLane,
	targetDiscoveryLane
];
const databaseWorkerLanes = [
	...historyWorkerLanes,
	costReadLane,
	costRefreshLane
];
const memoryPressure = channel("openclaw.memory.critical");
let pressureSubscribed = false;
registerOpenClawStateDatabaseAsyncResource({
	phase: "after-resources",
	async close(identity) {
		if (identity) return;
		await joinOwnedWorkerTasks(databaseWorkerLanes.map(async (lane) => {
			historyClearTimeout(lane.idleTimer);
			lane.idleTimer = void 0;
			await rotateDatabaseWorkers(lane);
		}));
	}
});
function retireIdleDatabaseWorkers() {
	for (const lane of databaseWorkerLanes) {
		if (lane.pending > 0 || lane.rotation || lane.nativeSequence <= lane.retiredSequence) continue;
		historyClearTimeout(lane.idleTimer);
		runInDetachedAsyncContext(() => rotateDatabaseWorkers(lane)).catch((error) => {
			process.emitWarning(`${lane.name} worker retirement failed: ${String(error)}`);
		});
	}
}
function refreshDatabaseWorkerPressureSubscription() {
	const required = databaseWorkerLanes.some((lane) => lane.pending > 0 || lane.rotation !== void 0 || lane.nativeSequence > lane.retiredSequence);
	if (required === pressureSubscribed) return;
	pressureSubscribed = required;
	if (required) memoryPressure.subscribe(retireIdleDatabaseWorkers);
	else memoryPressure.unsubscribe(retireIdleDatabaseWorkers);
}
function pruneHistoryDatabases() {
	for (const [key, resource] of historyDatabases) if (resource.pending === 0 && resource.nativeSequences.size === 0 && resource.hostEffects.size === 0 && resource.cleanups.size === 0 && !resource.closing) {
		resource.unregister();
		historyDatabases.delete(key);
	}
}
function releaseRetiredDatabaseCustody(lane, through) {
	lane.retiredSequence = Math.max(lane.retiredSequence, through);
	for (const resource of historyDatabases.values()) {
		const sequence = resource.nativeSequences.get(lane);
		if (sequence !== void 0 && sequence <= through) resource.nativeSequences.delete(lane);
	}
	pruneHistoryDatabases();
	refreshDatabaseWorkerPressureSubscription();
}
function rotateDatabaseWorkers(lane) {
	const through = lane.nativeSequence;
	const rotation = lane.pool.rotate().then(() => releaseRetiredDatabaseCustody(lane, through));
	lane.rotation = rotation;
	refreshDatabaseWorkerPressureSubscription();
	const finished = () => {
		if (lane.rotation === rotation) {
			lane.rotation = void 0;
			refreshDatabaseWorkerPressureSubscription();
		}
	};
	rotation.then(finished, finished);
	return rotation;
}
function armDatabaseWorkerIdleRetirement(lane) {
	historyClearTimeout(lane.idleTimer);
	refreshDatabaseWorkerPressureSubscription();
	if (lane.nativeSequence <= lane.retiredSequence || lane.pending > 0) return;
	lane.idleTimer = runInDetachedAsyncContext(() => historySetTimeout(() => {
		rotateDatabaseWorkers(lane).catch((error) => {
			process.emitWarning(`${lane.name} worker retirement failed: ${String(error)}`);
		});
	}, 3e5));
	lane.idleTimer.unref();
}
function clearClosedDatabaseCustody(lane, through, databases) {
	for (const database of databases) {
		const resource = historyDatabases.get(JSON.stringify(database));
		const sequence = resource?.nativeSequences.get(lane);
		if (resource && sequence !== void 0 && sequence <= through) resource.nativeSequences.delete(lane);
	}
}
async function closeDatabaseWorkerResource(resource, lane, idle) {
	const pool = historyWorkerLanes.find((candidate) => candidate === lane)?.pool;
	if (!idle || !pool?.canCloseNativeResources()) {
		await rotateDatabaseWorkers(lane);
		return;
	}
	const through = lane.nativeSequence;
	await pool.closeResources(JSON.stringify([{ path: resource.database.path }]));
	const sequence = resource.nativeSequences.get(lane);
	if (sequence !== void 0 && sequence <= through) resource.nativeSequences.delete(lane);
}
/** One worker's eviction requests pool-wide cleanup before releasing database custody. */
async function settleSessionHistoryWorkerEviction(lane, database) {
	const resource = historyDatabases.get(JSON.stringify(database));
	if (resource) await closeDatabaseWorkerResource(resource, lane, lane.pool.getSnapshot().activeTasks === 0);
}
/** Finish admitted usage cleanup while deletion still permits its retained writers to settle. */
async function retireSessionHistoryWorkerDatabases(options) {
	const agentId = normalizeAgentId(options.agentId);
	const paths = [...new Set(options.paths.map((pathname) => path.resolve(pathname)))];
	const selected = [...historyDatabases.values()].filter((resource) => resource.database.agentId === agentId && paths.some((pathname) => resource.matchesPath(pathname)));
	const errors = (await Promise.allSettled(selected.map((resource) => resource.retire()))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (errors.length > 0) throw new AggregateError(errors, "Session database work is still draining");
}
function acquireHistoryDatabaseResource(options) {
	const database = {
		agentId: normalizeAgentId(options.agentId),
		path: resolveOpenClawAgentSqlitePath(options)
	};
	const key = JSON.stringify(database);
	let resource = historyDatabases.get(key);
	let created = false;
	if (resource?.revoked) throw new WorkerTaskError("Session database work is still draining", "unavailable");
	if (!resource) {
		const aliases = /* @__PURE__ */ new Map();
		const owned = {
			database,
			pending: 0,
			revoked: false,
			nativeSequences: /* @__PURE__ */ new Map(),
			hostEffects: /* @__PURE__ */ new Set(),
			cleanups: /* @__PURE__ */ new Set(),
			aborters: /* @__PURE__ */ new Set(),
			unregister: () => {},
			matchesPath: (pathname) => pathname === database.path || aliases.has(pathname),
			retire() {
				revoke();
				return close();
			},
			retainAlias(alias) {
				if (!aliases.has(alias)) aliases.set(alias, runOutsideOpenClawDatabaseMaintenanceScope(() => registerOpenClawAgentDatabaseAsyncResource({
					...database,
					path: alias,
					revoke,
					close
				})));
			}
		};
		const close = () => {
			if (!owned.closing) {
				const idle = owned.pending === 0;
				owned.closing = (async () => {
					await Promise.all([...owned.nativeSequences.keys()].map((lane) => closeDatabaseWorkerResource(owned, lane, idle)));
					await Promise.allSettled(owned.hostEffects);
					for (const cleanup of owned.cleanups) await cleanup.run();
					if (owned.revoked) owned.unregister();
				})().finally(() => {
					owned.closing = void 0;
					pruneHistoryDatabases();
					for (const lane of databaseWorkerLanes) armDatabaseWorkerIdleRetirement(lane);
				});
				owned.closing.catch(() => {});
			}
			return owned.closing;
		};
		const revoke = () => {
			owned.revoked = true;
			for (const abort of owned.aborters) abort();
			close();
		};
		let unregister = registerOpenClawAgentDatabaseAsyncResource({
			...database,
			revoke,
			close
		});
		owned.unregister = () => {
			unregister?.();
			unregister = void 0;
			for (const release of aliases.values()) release();
			aliases.clear();
		};
		resource = owned;
		created = true;
	}
	try {
		for (const requestedPath of options.requestedPaths ?? []) {
			const alias = resolveOpenClawAgentSqlitePath({
				...options,
				path: requestedPath
			});
			if (alias !== database.path) resource.retainAlias(alias);
		}
	} catch (error) {
		if (created) resource.unregister();
		throw error;
	}
	if (created) historyDatabases.set(key, resource);
	return resource;
}
/** Keep captured discovery aliases until the existing history worker retires its readers. */
async function withSessionHistoryWorkerReadCandidates(candidates, operation, lane = historyLane, signal) {
	const capturedCandidates = candidates.map(({ path: requestedPath, physicalPath, scope }) => ({
		path: requestedPath,
		physicalPath,
		scope
	}));
	const selected = capturedCandidates.map(({ physicalPath, scope }) => ({
		path: physicalPath,
		...scope ? { scope } : {}
	}));
	const admissionPaths = capturedCandidates.filter((candidate) => !candidate.scope).map((candidate) => candidate.physicalPath);
	const admissionFamilies = capturedCandidates.filter((candidate) => candidate.scope === "sibling-family").map((candidate) => path.dirname(candidate.physicalPath));
	historyClearTimeout(lane.idleTimer);
	lane.pending++;
	refreshDatabaseWorkerPressureSubscription();
	try {
		let revoked = false;
		let dispatched = false;
		const assertCurrent = () => {
			signal?.throwIfAborted();
			if (revoked) throw new WorkerTaskError("Session target discovery was revoked", "unavailable");
		};
		const releases = [];
		const release = () => {
			for (const unregister of releases.splice(0).toReversed()) unregister();
		};
		const settleCandidates = async () => {
			if (!dispatched) return;
			dispatched = false;
			if (!lane.pool.canCloseNativeResources()) {
				await rotateDatabaseWorkers(lane);
				return;
			}
			const through = lane.nativeSequence;
			const retained = /* @__PURE__ */ new Set();
			for (const resource of historyDatabases.values()) {
				if (resource.revoked || !resource.nativeSequences.has(lane)) continue;
				for (const candidate of capturedCandidates) {
					if (!matchesAgentDatabaseReadCandidatePath({
						...candidate,
						path: candidate.physicalPath
					}, resource.database.path)) continue;
					const alias = candidate.scope ? path.join(path.dirname(candidate.path), path.basename(resource.database.path)) : candidate.path;
					if (alias !== resource.database.path) resource.retainAlias(alias);
					retained.add(resource.database.path);
				}
			}
			await lane.pool.closeResources(encodeAgentDatabaseReaderRequest({
				kind: "close",
				candidates: selected,
				retainedPaths: [...retained],
				deleted: false
			}));
			for (const resource of historyDatabases.values()) {
				const sequence = resource.nativeSequences.get(lane);
				if (sequence !== void 0 && sequence <= through && !retained.has(resource.database.path) && selected.some((candidate) => matchesAgentDatabaseReadCandidatePath(candidate, resource.database.path))) resource.nativeSequences.delete(lane);
			}
			pruneHistoryDatabases();
		};
		const close = async () => {
			await rotateDatabaseWorkers(lane);
			release();
		};
		const retained = /* @__PURE__ */ new Set();
		try {
			for (const candidate of capturedCandidates) for (const pathname of [candidate.path, candidate.physicalPath]) {
				const key = JSON.stringify([pathname, candidate.scope]);
				if (retained.has(key)) continue;
				retained.add(key);
				releases.push(registerOpenClawAgentDatabaseReadCandidateResource({
					path: pathname,
					scope: candidate.scope,
					revoke: () => {
						revoked = true;
					},
					close
				}));
			}
			const runRead = async (input, inputBytes) => {
				for (const physicalPath of admissionPaths) {
					const preparation = getPendingOpenClawAgentDatabasePreparation(physicalPath);
					if (preparation) await racePromiseWithAbortSignal(preparation, signal, (aborted) => aborted.reason);
				}
				const reply = await runWithSqliteDatabaseAdmissionTurn(admissionPaths, () => lane.pool.run(() => {
					assertCurrent();
					dispatched = true;
					lane.nativeSequence++;
					return input;
				}, {
					inputBytes,
					timeoutMs: 6e4,
					signal
				}), admissionFamilies, signal);
				return unwrapSessionTranscriptWorkerReply(reply);
			};
			const readStoreTargetResult = async (request) => {
				const preparedRequest = {
					...request,
					env: captureSessionTranscriptStorageEnvironment(request.env),
					candidates: capturedCandidates
				};
				const result = await runRead({
					kind: "session-store-target",
					request: preparedRequest
				}, JSON.stringify(preparedRequest).length * 2);
				return "readError" in result ? err(decodeSessionTranscriptWorkerReadError(result.readError)) : ok(result);
			};
			return await operation({
				assertCurrent,
				readCombinedTopology: async (request) => {
					const preparedRequest = {
						...request,
						options: {
							...request.options,
							discovery: {
								...request.options.discovery,
								env: captureSessionTranscriptStorageEnvironment(request.options.discovery.env)
							}
						},
						candidates: capturedCandidates
					};
					return await runRead({
						kind: "combined-store-topology",
						request: preparedRequest
					}, JSON.stringify(preparedRequest).length * 2);
				},
				readStoreTargetResult,
				readStoreTarget: async (request) => {
					const read = await readStoreTargetResult(request);
					if (!read.ok) throw read.error;
					return read.value;
				},
				readTargetInventory: async (request) => {
					const preparedRequest = {
						...request,
						env: captureSessionTranscriptStorageEnvironment(request.env),
						candidates: capturedCandidates
					};
					const result = await runRead({
						kind: "session-target-inventory",
						request: preparedRequest
					}, measureSessionStoreTargetInventoryInputBytes(preparedRequest));
					if (result.kind === "session-target-registry-required") await settleCandidates();
					return result;
				}
			});
		} finally {
			try {
				await settleCandidates();
			} finally {
				release();
			}
		}
	} finally {
		lane.pending--;
		armDatabaseWorkerIdleRetirement(lane);
	}
}
//#endregion
export { transcriptSearchLane as _, costRefreshLane as a, maintenanceLane as c, refreshDatabaseWorkerPressureSubscription as d, releaseRetiredDatabaseCustody as f, targetDiscoveryLane as g, settleSessionHistoryWorkerEviction as h, costReadLane as i, projectionLane as l, rotateDatabaseWorkers as m, armDatabaseWorkerIdleRetirement as n, historyClearTimeout as o, retireSessionHistoryWorkerDatabases as p, clearClosedDatabaseCustody as r, historyLane as s, acquireHistoryDatabaseResource as t, pruneHistoryDatabases as u, withSessionHistoryWorkerReadCandidates as v };
