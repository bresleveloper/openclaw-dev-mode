import { u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as runInDetachedAsyncContext } from "./async-work-scope-BYeX3gh6.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-DoBSDhBS.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { r as ensureSqliteLibrarySelected, t as captureSqliteWorkerClosePolicy } from "./bun-sqlite-library-CBSPJxTD.mjs";
import { n as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { m as runOutsideOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { n as joinOwnedWorkerTasks, r as WorkerTaskError } from "./src-WCJCjrey.mjs";
import { n as createOwnedWorkerTaskPool, t as WorkerTaskPool } from "./worker-task-pool-iI3pfrsK.mjs";
import { c as matchesAgentDatabaseReadCandidatePath } from "./agent-database-readers-DAuOtcuZ.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { a as registerOpenClawAgentDatabaseAsyncResource, o as registerOpenClawAgentDatabaseReadCandidateResource } from "./openclaw-agent-db-resources-x2MmUEok.mjs";
import { t as SQLITE_IDLE_HANDLE_TTL_MS } from "./sqlite-handle-lifecycle-dWd9h3ii.mjs";
import { M as parseAgentSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
import { c as resolveOpenClawAgentSqlitePath, i as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { a as resolveExplicitSessionStorePathForScope, l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { m as withSqliteWorkerCleanupFailure } from "./sqlite-worker-store-CsIRv3py.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./io-B0OAIqw3.mjs";
import "./openclaw-agent-db-DBug3LUA.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-WjVavOYj.mjs";
import { a as publishSystemEventStoreResolver, i as prepareSystemEventStorePath, n as getSystemEventStorePath, t as captureSystemEventStoreCurrentCheck } from "./system-event-ownership-BkQcgSZJ.mjs";
import { i as prepareSqliteTargetFromSessionStorePath, l as measureSessionStoreTargetInventoryInputBytes, o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { s as resolveSqliteScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { c as loadSessionEntryReadOnlyInScope } from "./session-accessor.sqlite-exact-read-JW6IveXD.mjs";
import { a as sessionHistoryCleanupError, n as decodeSessionTranscriptWorkerReadError, o as unwrapSessionTranscriptWorkerReply } from "./session-history-worker-errors-NH8_8u1W.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { channel } from "node:diagnostics_channel";
//#region src/infra/session-cost-usage-worker.types.ts
/** Retain the domain failure while the pool proves native retirement. */
var UsageCostWorkerReplyError = class extends Error {
	constructor(failure) {
		super(failure.message);
		this.failure = failure;
		this.name = "UsageCostWorkerReplyError";
	}
};
//#endregion
//#region src/config/sessions/session-store-path.ts
function resolvePhysicalSessionStorePath(scope, cfg) {
	const agentId = scope.agentId ?? resolveAgentIdFromSessionKey(scope.sessionKey);
	return resolveIdentityPathViaExistingAncestorSync(resolveSqliteTargetFromSessionStorePath(resolveSessionStorePathForScope(scope, cfg), {
		...scope,
		agentId
	}).path);
}
/** Prepare ownership in the read worker before resolving the physical path identity. */
async function preparePhysicalSessionStorePath(scope, cfg) {
	const agentId = scope.agentId ?? resolveAgentIdFromSessionKey(scope.sessionKey);
	const target = await prepareSqliteTargetFromSessionStorePath(resolveSessionStorePathForScope(scope, cfg), {
		agentId,
		env: scope.env
	});
	return resolveIdentityPathViaExistingAncestorSync(target.path);
}
function publishSystemEventStoreConfig(cfg) {
	const env = { ...process.env };
	const paths = /* @__PURE__ */ new Map();
	const resolve = (sessionKey, owner) => {
		const agentId = resolveAgentIdFromSessionKey(sessionKey, owner);
		const scope = {
			sessionKey,
			agentId,
			env
		};
		return {
			scope,
			key: JSON.stringify([agentId, resolveSessionStorePathForScope(scope, cfg)])
		};
	};
	publishSystemEventStoreResolver((sessionKey, owner) => {
		const { scope, key } = resolve(sessionKey, owner);
		if (!paths.has(key)) paths.set(key, resolvePhysicalSessionStorePath(scope, cfg));
		return paths.get(key);
	}, async (sessionKey, owner) => {
		const { scope, key } = resolve(sessionKey, owner);
		if (!paths.has(key)) {
			const prepared = await preparePhysicalSessionStorePath(scope, cfg);
			if (!paths.has(key)) paths.set(key, prepared);
		}
		return paths.get(key);
	});
}
function captureSessionWatcherStorePaths(keys = [], env) {
	return Object.fromEntries(keys.filter((key) => parseAgentSessionKey(key) != null).map((sessionKey) => [sessionKey, getSystemEventStorePath(sessionKey) ?? resolvePhysicalSessionStorePath({
		sessionKey,
		env
	})]));
}
/** Prepare exact watcher stores and retain their owner checks through worker admission. */
async function prepareSessionWatcherStorePaths(keys = [], env) {
	const checks = [];
	const results = await Promise.allSettled(keys.filter((key) => parseAgentSessionKey(key) != null).map(async (sessionKey) => {
		const isStoreCurrent = captureSystemEventStoreCurrentCheck(sessionKey);
		const pathname = await (prepareSystemEventStorePath(sessionKey) ?? preparePhysicalSessionStorePath({
			sessionKey,
			env
		}));
		const check = () => {
			if (!isStoreCurrent(pathname)) throw new Error("Session signal lost its watcher store");
		};
		check();
		checks.push(check);
		return [sessionKey, pathname];
	}));
	return {
		paths: Object.fromEntries(results.map((result) => {
			if (result.status === "rejected") throw result.reason;
			return result.value;
		})),
		assertCurrent() {
			for (const check of checks) check();
		}
	};
}
function resolveSessionStorePathForScope(scope, config) {
	const explicitStorePath = resolveExplicitSessionStorePathForScope(scope);
	if (explicitStorePath) return explicitStorePath;
	const agentId = scope.agentId ?? resolveAgentIdFromSessionKey(scope.sessionKey);
	return resolveSessionStorePathCore((config ?? getRuntimeConfig()).session?.store, {
		agentId,
		env: scope.env
	});
}
//#endregion
//#region src/config/sessions/session-transcript-worker-readers.ts
function assertResultKind(value, kind, expected) {
	if (typeof value === "boolean" || Array.isArray(value) || value.kind !== kind) throw new Error(`Session history worker returned another result instead of ${expected}`);
}
/** Decode domain results; database custody remains with the enclosing history owner. */
function createSessionHistoryWorkerReaders(runRequest) {
	function reader(kind, expected, prepare, project) {
		return async (input, signal) => runRequest(() => prepare(input), JSON.stringify(input).length * 2, (value) => {
			assertResultKind(value, kind, expected);
			return project(value);
		}, signal);
	}
	return {
		readRuntimeTarget: reader("session-runtime-target", "runtime transcript target", (input) => ({
			kind: "session-runtime-target",
			...input
		}), (value) => value.target),
		readConversations: reader("conversation-rows", "conversations", (input) => ({
			kind: "conversation-rows",
			...input
		}), (value) => value.rows),
		prewarm: reader("prewarm", "prewarm acknowledgement", (input) => ({
			kind: "prewarm",
			...input
		}), () => void 0),
		readPendingArchives: reader("session-pending-archives", "pending archives", (input) => ({
			kind: "session-pending-archives",
			...input
		}), (value) => value.pending),
		readLifecycleArtifactPlan: reader("lifecycle-artifact-plan", "lifecycle artifact plan", (input) => ({
			kind: "lifecycle-artifact-plan",
			...input
		}), (value) => value),
		readMemorySessionTargets: reader("memory-session-targets", "memory session targets", (input) => ({
			kind: "memory-session-targets",
			...input,
			params: {
				...input.params,
				env: captureSessionTranscriptStorageEnvironment(input.params.env)
			}
		}), (value) => value.targets),
		readArchiveInventory: reader("session-archive-inventory", "archive inventory", (input) => ({
			kind: "session-archive-inventory",
			...input,
			env: captureSessionTranscriptStorageEnvironment(input.env ?? process.env)
		}), (value) => value.archives),
		readCorpusInventory: reader("session-corpus-inventory", "corpus inventory", (input) => ({
			kind: "session-corpus-inventory",
			...input,
			scope: {
				...input.scope,
				env: captureSessionTranscriptStorageEnvironment(input.scope.env)
			}
		}), (value) => value.entries),
		readArchivePresence: reader("session-archive-presence", "archive presence", (input) => ({
			kind: "session-archive-presence",
			...input
		}), (value) => value.registered),
		findTranscriptEvent: reader("transcript-match", "a transcript match", (request) => ({
			kind: "transcript-match",
			request
		}), (value) => value.result),
		readHistoricalEvictionCandidates: reader("historical-eviction-candidates", "eviction candidates", (input) => ({
			kind: "historical-eviction-candidates",
			...input
		}), (value) => {
			if (!("sessionIds" in value)) throw new Error("Session history worker returned archived instead of historical candidates");
			return value.sessionIds;
		}),
		readArchivedEvictionCandidates: reader("historical-eviction-candidates", "archived eviction candidates", (input) => ({
			kind: "historical-eviction-candidates",
			...input
		}), (value) => {
			if (!("batch" in value)) throw new Error("Session history worker returned historical instead of archived candidates");
			return value.batch;
		}),
		readArchivePruning: reader("session-archive-pruning", "archive pruning", (input) => ({
			kind: "session-archive-pruning",
			...input
		}), (value) => value.result),
		readColdMetadata: reader("cold-metadata", "cold metadata", (input) => ({
			kind: "cold-metadata",
			...input
		}), (value) => value),
		readColdStorageInventory: reader("cold-storage-inventory", "cold storage inventory", (input) => ({
			kind: "cold-storage-inventory",
			...input
		}), (value) => value),
		searchTranscripts: reader("transcript-search", "search", (params) => ({
			kind: "transcript-search",
			params
		}), (value) => value.result),
		readPreview: reader("session-preview", "a preview", (input) => ({
			kind: "session-preview",
			...input
		}), (value) => value.items),
		readTitleFields: reader("session-title-fields", "title fields", (input) => ({
			kind: "session-title-fields",
			...input
		}), (value) => value.fields),
		readWatermark: reader("transcript-watermark", "a transcript watermark", (input) => ({
			kind: "transcript-watermark",
			...input
		}), (value) => value.watermark),
		readActivitySummarySource: reader("session-activity-summary-source", "an Activity recap source", (input) => ({
			kind: "session-activity-summary-source",
			...input
		}), (value) => value.source),
		readRowBackfill: reader("session-row-backfill", "transcript fields", (params) => ({
			kind: "session-row-backfill",
			params
		}), (value) => value.fields),
		run: async (prepare, inputBytes) => await runRequest(prepare, inputBytes, (value) => {
			if (typeof value === "boolean" || Array.isArray(value) || value.kind !== "active-accounting" && value.kind !== "bounded-tail" && value.kind !== "reactions" && value.kind !== "conversation-binding" && value.kind !== "transcript-binding" && value.kind !== "artifacts" && value.kind !== "summary" && value.kind !== "message-page" && value.kind !== "around-id" && value.kind !== "source-messages" && value.kind !== "recent-page" && value.kind !== "rpc" && value.kind !== "http" && value.kind !== "delta" && value.kind !== "inline-visibility" && value.kind !== "recent" && value.kind !== "message-by-id" && value.kind !== "message-count" && value.kind !== "message-lookup") throw new Error("Session history worker returned metadata instead of history");
			return value;
		}),
		readTranscript: async (input, signal) => {
			const events = [];
			let parts = [];
			let text;
			const receiveChunk = (value) => {
				if (!isRecord(value) || value.kind !== "transcript-hydration-chunk" || typeof value.encoding !== "string" || !Array.isArray(value.frames)) throw new Error("Session history worker returned an invalid transcript chunk");
				if (!text) text = {
					encoding: value.encoding,
					decoder: new TextDecoder(value.encoding, { ignoreBOM: true })
				};
				else if (text.encoding !== value.encoding) throw new Error("Session history worker changed transcript encoding during transfer");
				for (const frame of value.frames) {
					if (!isRecord(frame) || !(frame.data instanceof Uint8Array) || typeof frame.endOfEvent !== "boolean") throw new Error("Session history worker returned an invalid transcript frame");
					parts.push(text.decoder.decode(frame.data, { stream: !frame.endOfEvent }));
					if (frame.endOfEvent) {
						events.push(JSON.parse(parts.join("")));
						parts = [];
					}
				}
			};
			return await runRequest(() => ({
				kind: "transcript-hydration",
				...input
			}), JSON.stringify(input).length * 2, (value) => {
				if (typeof value === "boolean" || Array.isArray(value) || value.kind !== "full" && value.kind !== "bounded") throw new Error("Session history worker returned another result instead of a transcript");
				if (value.kind === "bounded") return value;
				if (parts.length !== 0 || events.length !== value.eventCount) throw new Error("Session history worker returned an incomplete transcript");
				return {
					kind: "full",
					snapshot: {
						events,
						version: value.version
					}
				};
			}, signal, input.limits ? void 0 : receiveChunk);
		},
		readMaintenance: reader("transcript-maintenance", "transcript maintenance facts", (input) => ({
			kind: "transcript-maintenance",
			...input
		}), (value) => value),
		readCurrentTurnEntry: reader("current-turn-entry", "a current-turn entry", (input) => ({
			kind: "current-turn-entry",
			...input
		}), (value) => value),
		readRecentActiveEvents: reader("recent-active-events", "recent active events", (input) => ({
			kind: "recent-active-events",
			...input
		}), (value) => value.events),
		readLatestActiveMessage: reader("latest-active-message", "the latest active message", (input) => ({
			kind: "latest-active-message",
			...input
		}), (value) => value.message),
		readUsageCache: reader("usage-refresh-lock", "usage cache", (input) => ({
			kind: "usage-cache",
			...input
		}), (value) => value),
		readMembershipFacts: reader("session-membership-facts", "membership facts", (input) => ({
			kind: "session-membership-facts",
			...input
		}), (value) => value),
		readMembers: async (input) => await runRequest(() => ({
			kind: "session-members",
			...input
		}), JSON.stringify(input).length * 2, (value) => {
			if (!Array.isArray(value)) throw new Error("Session history worker returned another result instead of members");
			return value;
		}),
		readSuggestions: reader("session-suggestions", "suggestions", (input) => ({
			kind: "session-suggestions",
			...input
		}), (value) => value.suggestions),
		readExactEntries: async (input, signal) => {
			const captured = {
				...input,
				env: captureSessionTranscriptStorageEnvironment(input.env)
			};
			return runRequest(() => ({
				kind: "session-exact-entries",
				...captured
			}), JSON.stringify(captured).length * 2, (value) => {
				assertResultKind(value, "session-exact-entries", "exact entries");
				return value;
			}, signal);
		},
		readRowFacts: async (input) => {
			if (input.sessionKeys.length > 64) throw new Error(`Session row facts support at most 64 keys`);
			const captured = {
				env: { ...input.env },
				sessionKeys: [...input.sessionKeys],
				continuation: input.continuation ? { ...input.continuation } : void 0
			};
			return await runRequest(() => ({
				kind: "session-row-facts",
				...captured
			}), JSON.stringify(captured).length * 2, (value) => {
				assertResultKind(value, "session-row-facts", "row facts");
				return value;
			});
		},
		readProgressCard: reader("session-progress-card", "a progress card", (input) => ({
			kind: "session-progress-card",
			...input
		}), (value) => value.card),
		readPendingInputHistory: reader("session-pending-input-history", "pending input history", (input) => ({
			kind: "session-pending-input-history",
			...input
		}), (value) => value.snapshot),
		readPendingInputReceipts: reader("session-pending-input-receipts", "pending input receipts", (input) => ({
			kind: "session-pending-input-receipts",
			...input
		}), (value) => value.receipts),
		readPendingInputSource: reader("session-pending-input-source", "a submitted input source", (input) => ({
			kind: "session-pending-input-source",
			...input
		}), (value) => value.snapshot),
		readConversationDelivery: reader("conversation-delivery", "a conversation delivery receipt", (input) => ({
			kind: "conversation-delivery",
			...input
		}), (value) => value.record),
		readGoalOperationReceipt: reader("goal-operation-receipt", "a Goal operation receipt", (input) => ({
			kind: "goal-operation-receipt",
			...input
		}), (value) => value.result),
		readEntryResult: reader("session-entry-read", "an entry", (input) => ({
			kind: "session-entry-read",
			...input
		}), (value) => value.readError ? err(decodeSessionTranscriptWorkerReadError(value.readError)) : ok(value.entry)),
		readEntryCurrent: reader("session-entry-current", "entry currency facts", (input) => ({
			kind: "session-entry-current",
			...input
		}), (value) => value.entry),
		readDiagnosticText: reader("session-diagnostic-text", "diagnostic text", (input) => ({
			kind: "session-diagnostic-text",
			...input
		}), (value) => value.text),
		readEntries: async (scope, continuation) => runRequest(() => ({
			kind: "session-entry-list",
			scope,
			continuation
		}), JSON.stringify({
			scope,
			continuation
		}).length * 2, (value) => {
			assertResultKind(value, "session-entry-list", "entries");
			return value.entries;
		}),
		readStoreSummary: reader("session-store-summary", "a store summary", (input) => ({
			kind: "session-store-summary",
			...input
		}), (value) => value.summary),
		readIdentityEvidence: reader("session-identity-evidence", "identity evidence", (input) => ({
			kind: "session-identity-evidence",
			...input
		}), (value) => value.evidence),
		readProjectionStatus: async (input, signal) => await runRequest(() => ({
			kind: "projection-status",
			...input
		}), JSON.stringify(input).length * 2, (value) => {
			if (typeof value !== "boolean") throw new Error("Session history worker returned history instead of projection status");
			return value;
		}, signal),
		readEntryPresence: async (scope) => await runRequest(() => ({
			kind: "session-row-presence",
			scope
		}), JSON.stringify(scope).length * 2, (value) => {
			if (typeof value !== "boolean") throw new Error("Session history worker returned history instead of metadata presence");
			return value;
		})
	};
}
//#endregion
//#region src/config/sessions/session-transcript-worker-resources.ts
const workerUrl = resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sessionTranscript);
function createHistoryPool() {
	let generation;
	const pool = createOwnedWorkerTaskPool({
		workerUrl,
		workerOptions: { resourceLimits: { maxOldGenerationSizeMb: 512 } },
		maxWorkers: 1,
		idleTimeoutMs: 0,
		prepareWorker: () => {
			ensureSqliteLibrarySelected();
			const current = { canCloseNativeResources: captureSqliteWorkerClosePolicy() };
			generation = current;
			return {
				options: {},
				async releaseResources() {
					if (generation === current) generation = void 0;
				}
			};
		},
		onRetirementFailure() {
			generation = void 0;
		}
	});
	return {
		...pool,
		canCloseNativeResources: () => generation?.canCloseNativeResources === true,
		rotate() {
			generation = void 0;
			return pool.rotate();
		}
	};
}
function createUsageCostPool() {
	return new WorkerTaskPool({
		workerUrl,
		workerOptions: { resourceLimits: { maxOldGenerationSizeMb: 512 } },
		maxWorkers: 1,
		idleTimeoutMs: 0,
		prepareWorker: () => {
			ensureSqliteLibrarySelected();
			return { options: {} };
		},
		validateResult(reply) {
			if (!reply.ok) throw new UsageCostWorkerReplyError(reply.error);
		}
	});
}
const historyDatabases = /* @__PURE__ */ new Map();
const historySetTimeout = setTimeout;
const historyClearTimeout = clearTimeout;
let historyGeneration = 0;
function createDatabaseWorkerLane(name, pool) {
	return {
		name,
		pool,
		nativeSequence: 0,
		retiredSequence: 0,
		pending: 0
	};
}
const historyLane = createDatabaseWorkerLane("Session history", createHistoryPool());
const projectionLane = createDatabaseWorkerLane("Session projection", createHistoryPool());
const maintenanceLane = createDatabaseWorkerLane("Session maintenance", createHistoryPool());
const costReadLane = createDatabaseWorkerLane("Session usage read", createUsageCostPool());
const costRefreshLane = createDatabaseWorkerLane("Session usage refresh", createUsageCostPool());
const historyWorkerLanes = [
	historyLane,
	projectionLane,
	maintenanceLane
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
	}, SQLITE_IDLE_HANDLE_TTL_MS));
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
	try {
		await pool.closeResources(JSON.stringify([{ path: resource.database.path }]));
	} catch (error) {
		try {
			await rotateDatabaseWorkers(lane);
		} catch (retirementError) {
			throw sessionHistoryCleanupError(error, retirementError, "worker retirement");
		}
		throw error;
	}
	const sequence = resource.nativeSequences.get(lane);
	if (sequence !== void 0 && sequence <= through) resource.nativeSequences.delete(lane);
}
function acquireHistoryDatabaseResource(options) {
	const database = {
		agentId: normalizeAgentId(options.agentId),
		path: resolveOpenClawAgentSqlitePath(options)
	};
	const key = JSON.stringify(database);
	let resource = historyDatabases.get(key);
	let created = false;
	if (!resource || resource.revoked) {
		const aliases = /* @__PURE__ */ new Map();
		const owned = {
			database,
			generation: ++historyGeneration,
			pending: 0,
			revoked: false,
			nativeSequences: /* @__PURE__ */ new Map(),
			hostEffects: /* @__PURE__ */ new Set(),
			cleanups: /* @__PURE__ */ new Set(),
			aborters: /* @__PURE__ */ new Set(),
			unregister: () => {},
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
		if (options.requestedPath !== void 0) {
			const alias = resolveOpenClawAgentSqlitePath({
				...options,
				path: options.requestedPath
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
async function withSessionHistoryWorkerReadCandidates(candidates, operation, lane = historyLane) {
	const capturedCandidates = candidates.map(({ path, physicalPath, scope }) => ({
		path,
		physicalPath,
		scope
	}));
	const selected = capturedCandidates.map(({ physicalPath, scope }) => ({
		path: physicalPath,
		...scope ? { scope } : {}
	}));
	historyClearTimeout(lane.idleTimer);
	lane.pending++;
	refreshDatabaseWorkerPressureSubscription();
	try {
		let revoked = false;
		let closing;
		let nativeCleanupPending = false;
		let candidateCleanupPending = false;
		let dispatched = false;
		let discoveryFailed = false;
		let outcome;
		const assertCurrent = () => {
			if (revoked) throw new WorkerTaskError("Session target discovery was revoked", "unavailable");
		};
		const releases = [];
		const release = () => {
			for (const unregister of releases.toReversed()) unregister();
		};
		const retire = () => {
			closing ??= (async () => {
				nativeCleanupPending = true;
				try {
					await rotateDatabaseWorkers(lane);
					nativeCleanupPending = false;
				} finally {
					closing = void 0;
				}
			})();
			return closing;
		};
		const settleCandidates = async () => {
			if (discoveryFailed || !lane.pool.canCloseNativeResources()) {
				await retire();
				return;
			}
			const through = lane.nativeSequence;
			candidateCleanupPending = true;
			try {
				await lane.pool.closeResources(JSON.stringify(selected));
				candidateCleanupPending = false;
				for (const resource of historyDatabases.values()) {
					const sequence = resource.nativeSequences.get(lane);
					if (sequence !== void 0 && sequence <= through && selected.some((candidate) => matchesAgentDatabaseReadCandidatePath(candidate, resource.database.path))) resource.nativeSequences.delete(lane);
				}
				pruneHistoryDatabases();
			} catch (error) {
				try {
					await retire();
					candidateCleanupPending = false;
				} catch (retirementError) {
					throw sessionHistoryCleanupError(error, retirementError, "worker retirement");
				}
				throw error;
			}
		};
		const close = async () => {
			await retire();
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
			assertCurrent();
			const readStoreTargetResult = async (request) => {
				const preparedRequest = {
					...request,
					env: captureSessionTranscriptStorageEnvironment(request.env),
					candidates: capturedCandidates
				};
				const reply = await lane.pool.run(() => {
					assertCurrent();
					dispatched = true;
					lane.nativeSequence++;
					return {
						kind: "session-store-target",
						request: preparedRequest
					};
				}, {
					inputBytes: JSON.stringify(preparedRequest).length * 2,
					timeoutMs: 6e4
				});
				const result = unwrapSessionTranscriptWorkerReply(reply);
				if (typeof result === "boolean" || Array.isArray(result) || result.kind !== "session-store-target" && result.kind !== "session-target-registry-required") throw new Error("Session history worker returned another result instead of store target");
				assertCurrent();
				discoveryFailed ||= "readError" in result;
				return "readError" in result ? err(decodeSessionTranscriptWorkerReadError(result.readError)) : ok(result);
			};
			const value = await operation({
				assertCurrent,
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
					const reply = await lane.pool.run(() => {
						assertCurrent();
						dispatched = true;
						lane.nativeSequence++;
						return {
							kind: "session-target-inventory",
							request: preparedRequest
						};
					}, {
						inputBytes: measureSessionStoreTargetInventoryInputBytes(preparedRequest),
						timeoutMs: 6e4
					});
					const result = unwrapSessionTranscriptWorkerReply(reply);
					if (typeof result === "boolean" || Array.isArray(result) || result.kind !== "session-target-inventory" && result.kind !== "session-target-registry-required") throw new Error("Session history worker returned another result instead of target inventory");
					if (result.kind === "session-target-inventory") discoveryFailed ||= result.agents.some(({ result: inventory }) => !inventory.available && inventory.reason !== "database-missing");
					if (result.kind === "session-target-registry-required") {
						discoveryFailed ||= result.readFailed === true;
						await settleCandidates();
					}
					assertCurrent();
					return result;
				}
			});
			assertCurrent();
			outcome = { value };
		} catch (error) {
			outcome = { error };
		}
		if (dispatched) try {
			if ("error" in outcome) await retire();
			else await settleCandidates();
		} catch (cleanupError) {
			outcome = { error: "error" in outcome ? sessionHistoryCleanupError(outcome.error, cleanupError, "worker retirement") : cleanupError };
		}
		if (!nativeCleanupPending && !candidateCleanupPending) release();
		if ("error" in outcome) throw outcome.error;
		assertCurrent();
		return outcome.value;
	} finally {
		lane.pending--;
		armDatabaseWorkerIdleRetirement(lane);
	}
}
//#endregion
//#region src/config/sessions/session-transcript-worker-runtime.ts
const log = createSubsystemLogger("sessions/history-worker");
const historyPrewarms = /* @__PURE__ */ new WeakMap();
function isSessionHistoryWorkerCold() {
	return historyLane.pending === 0 && historyLane.nativeSequence <= historyLane.retiredSequence;
}
/** Reuse normal reader custody; repeated warmups never refresh the idle deadline. */
async function prewarmSessionHistoryWorker(options) {
	try {
		const resource = acquireHistoryDatabaseResource(options);
		const existing = historyPrewarms.get(resource);
		if (existing && (existing.pending || !historyLane.rotation && existing.retiredSequence === historyLane.retiredSequence && resource.nativeSequences.has(historyLane))) return await existing.promise;
		const completion = createDeferredCore();
		const prewarm = {
			promise: completion.promise,
			pending: true,
			retiredSequence: historyLane.retiredSequence
		};
		historyPrewarms.set(resource, prewarm);
		withSessionHistoryWorkerDatabase(options, (owner) => owner.prewarm({ env: captureSessionTranscriptStorageEnvironment(options.env ?? process.env) })).then(() => {
			prewarm.pending = false;
			completion.resolve();
		}, (error) => {
			historyPrewarms.delete(resource);
			log.debug(`Session history worker prewarm failed: ${String(error)}`);
			completion.resolve();
		});
		await completion.promise;
	} catch (error) {
		log.debug(`Session history worker prewarm failed: ${String(error)}`);
	}
}
/** Capture the exact metadata owner before initial-writer admission can wait. */
function prepareSessionEntryPresenceRead(input) {
	const env = { ...input.env ?? process.env };
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const storePath = resolveSessionStorePathForScope({
		...input,
		env
	});
	const resolved = resolveSqliteScope({
		...input,
		storePath,
		env
	});
	const options = toDatabaseOptions(resolved);
	const databasePath = resolveOpenClawAgentSqlitePath(options);
	const scope = {
		agentId: resolved.agentId,
		sessionKey: resolved.sessionKey,
		storePath: databasePath,
		databaseAgentId: options.agentId,
		env
	};
	const incognito = isIncognitoOpenClawAgentSqlitePath(databasePath, options);
	return {
		sessionKey: resolved.sessionKey,
		storePath,
		read: incognito ? async () => loadSessionEntryReadOnlyInScope({
			...scope,
			projection: "list"
		}) !== void 0 : async () => await withSessionHistoryWorkerDatabase(options, async (owner) => await owner.readEntryPresence(scope))
	};
}
/** Single and batch reads synchronously retain the same lane-aware database owner. */
function retainSessionHistoryWorkerDatabase(options, lane = historyLane) {
	const owned = acquireHistoryDatabaseResource(options);
	const { database } = owned;
	let entryReadSource;
	const assertCurrent = () => {
		if (owned.revoked) throw new WorkerTaskError("Session history database read was revoked", "unavailable");
		if (entryReadSource) assertExistingDatabaseIdentity(database.path, `file:${entryReadSource.databaseIdentity}`, entryReadSource.databaseBirthtime);
	};
	historyClearTimeout(lane.idleTimer);
	lane.pending++;
	owned.pending++;
	refreshDatabaseWorkerPressureSubscription();
	let countsReleased = false;
	let releaseFinished = false;
	const releaseCleanup = { run: async () => release() };
	const release = () => {
		if (releaseFinished) return;
		owned.cleanups.add(releaseCleanup);
		if (!countsReleased) {
			countsReleased = true;
			owned.pending--;
			lane.pending--;
		}
		try {
			armDatabaseWorkerIdleRetirement(lane);
			owned.cleanups.delete(releaseCleanup);
			pruneHistoryDatabases();
			releaseFinished = true;
		} catch (error) {
			owned.cleanups.add(releaseCleanup);
			throw error;
		}
	};
	try {
		assertCurrent();
		const runRequest = async (prepare, inputBytes, receive, signal, onRequest) => {
			assertCurrent();
			const deadline = performance.now() + 6e4;
			let sequence = 0;
			let executionRetired = false;
			try {
				const reply = await lane.pool.run(() => {
					assertCurrent();
					const input = prepare();
					assertCurrent();
					sequence = ++lane.nativeSequence;
					owned.nativeSequences.set(lane, sequence);
					return {
						...input,
						database
					};
				}, {
					inputBytes,
					timeoutMs: 6e4,
					signal,
					onRequest: onRequest ? async (value, context) => {
						context.signal.throwIfAborted();
						assertCurrent();
						onRequest(value);
						assertCurrent();
						const remaining = deadline - performance.now();
						if (remaining <= 0) throw new WorkerTaskError("worker task timed out", "timeout");
						return {
							input: null,
							timeoutMs: remaining
						};
					} : void 0,
					onExecutionSettled: ({ retired }) => {
						if (retired) {
							executionRetired = true;
							releaseRetiredDatabaseCustody(lane, sequence);
						}
					}
				});
				const received = unwrapSessionTranscriptWorkerReply(reply);
				if (typeof received !== "boolean" && !Array.isArray(received) && (received.kind === "session-entry-read" || received.kind === "session-entry-current" || received.kind === "session-runtime-target" || received.kind === "session-diagnostic-text") && received.source) {
					const source = received.source;
					if (source.agentId !== database.agentId || source.path !== database.path || entryReadSource && (entryReadSource.databaseIdentity !== source.databaseIdentity || entryReadSource.databaseBirthtime !== source.databaseBirthtime)) throw new Error("Session entry read changed its retained physical owner");
					entryReadSource = source;
				}
				const value = receive(received);
				if (reply.ok && reply.closedHistoryDatabase) clearClosedDatabaseCustody(lane, sequence, [reply.closedHistoryDatabase]);
				assertCurrent();
				return value;
			} catch (error) {
				if (sequence > 0 && !executionRetired) try {
					await rotateDatabaseWorkers(lane);
				} catch (cleanupError) {
					throw sessionHistoryCleanupError(error, cleanupError, "worker retirement");
				}
				throw error;
			}
		};
		return {
			owner: {
				generation: owned.generation,
				assertCurrent,
				...createSessionHistoryWorkerReaders(runRequest)
			},
			release
		};
	} catch (error) {
		try {
			release();
		} catch (cleanupError) {
			throw new AggregateError([error, cleanupError], "Session history reader admission cleanup failed", { cause: cleanupError });
		}
		throw error;
	}
}
/** Capture every selected store before yielding; a closed target cannot join a later generation. */
async function withSessionHistoryWorkerDatabases(options, operation, lane = historyLane) {
	const retained = [];
	let outcome;
	try {
		for (const target of options) retained.push(retainSessionHistoryWorkerDatabase(target, lane));
		const value = await operation(retained.map(({ owner }) => owner));
		for (const { owner } of retained) owner.assertCurrent();
		outcome = { value };
	} catch (error) {
		outcome = { error };
	}
	const cleanupErrors = [];
	for (const retainedRead of retained.toReversed()) try {
		retainedRead.release();
	} catch (error) {
		cleanupErrors.push(error);
	}
	if (cleanupErrors.length > 0) throw new AggregateError([..."error" in outcome ? [outcome.error] : [], ...cleanupErrors], "Session history read scope cleanup failed", { cause: "error" in outcome ? outcome.error : cleanupErrors[0] });
	if ("error" in outcome) throw outcome.error;
	return outcome.value;
}
/** Single-target callers retain the same batch admission and revocation boundary. */
function withSessionHistoryWorkerDatabase(options, operation, lane = historyLane) {
	return withSessionHistoryWorkerDatabases([options], (owners) => operation(expectDefined(owners[0], "retained session history reader")), lane);
}
/** Usage reads retain every physical store while compute and its admitted host effects settle. */
async function withSessionCostUsageWorkerDatabases(options, operation) {
	if (options.length === 0) throw new Error("Usage cost work requires its database owners");
	const resources = /* @__PURE__ */ new Set();
	try {
		for (const databaseOptions of options) {
			const resource = acquireHistoryDatabaseResource(databaseOptions);
			if (!resources.has(resource)) {
				resources.add(resource);
				resource.pending++;
			}
		}
	} catch (error) {
		for (const resource of resources) resource.pending--;
		pruneHistoryDatabases();
		throw error;
	}
	const pending = /* @__PURE__ */ new Set();
	const cleanups = /* @__PURE__ */ new Set();
	const lanes = /* @__PURE__ */ new Map();
	let phase = "open";
	const assertCurrent = () => {
		if (phase === "closed" || [...resources].some((resource) => resource.revoked)) throw new WorkerTaskError("Session usage database work was revoked", "unavailable");
	};
	const settle = async () => {
		while (pending.size > 0) await Promise.allSettled(pending);
		for (const [lane, custody] of lanes) {
			if (custody.nativeThrough > lane.retiredSequence) await lane.rotation;
			if (custody.failedThrough > lane.retiredSequence) await rotateDatabaseWorkers(lane);
		}
	};
	const retainCleanup = (close) => {
		if (phase === "closed") throw new WorkerTaskError("Session usage database scope is closed", "unavailable");
		const runInContext = AsyncLocalStorage.snapshot();
		let released = false;
		let closing;
		const release = () => {
			released = true;
			cleanups.delete(cleanup);
			for (const resource of resources) resource.cleanups.delete(cleanup);
			pruneHistoryDatabases();
		};
		const cleanup = { run: () => {
			if (released) return Promise.resolve();
			closing ??= (async () => {
				await settle();
				await runInContext(close);
				release();
			})().catch((error) => {
				closing = void 0;
				throw error;
			});
			return closing;
		} };
		cleanups.add(cleanup);
		for (const resource of resources) resource.cleanups.add(cleanup);
		return release;
	};
	const run = (input, runOptions) => {
		assertCurrent();
		if (phase !== "open") throw new WorkerTaskError("Session usage database scope is closing", "unavailable");
		const lane = input.operation.kind === "refresh" ? costRefreshLane : costReadLane;
		const custody = lanes.get(lane) ?? {
			nativeThrough: 0,
			failedThrough: 0
		};
		lanes.set(lane, custody);
		const controller = new AbortController();
		const signal = runOptions.signal ? AbortSignal.any([controller.signal, runOptions.signal]) : controller.signal;
		const abort = () => controller.abort(new WorkerTaskError("Session usage database work was revoked", "unavailable"));
		for (const resource of resources) resource.aborters.add(abort);
		historyClearTimeout(lane.idleTimer);
		lane.pending++;
		refreshDatabaseWorkerPressureSubscription();
		const hostEffects = /* @__PURE__ */ new Set();
		const onRequest = runOptions.onRequest;
		let sequence = 0;
		let executionSettled = false;
		const task = (async () => {
			try {
				const reply = await lane.pool.run(() => {
					assertCurrent();
					signal.throwIfAborted();
					runOptions.beforeDispatch?.();
					sequence = ++lane.nativeSequence;
					custody.nativeThrough = sequence;
					for (const resource of resources) resource.nativeSequences.set(lane, sequence);
					return {
						...input,
						databases: [...resources].map((resource) => resource.database)
					};
				}, {
					...runOptions,
					signal,
					onExecutionSettled: ({ retired }) => {
						executionSettled = true;
						if (retired && sequence > 0) releaseRetiredDatabaseCustody(lane, sequence);
					},
					onRequest: onRequest ? (value, context) => {
						const effect = createDeferredCore();
						hostEffects.add(effect.promise);
						for (const resource of resources) resource.hostEffects.add(effect.promise);
						const releaseEffect = () => {
							hostEffects.delete(effect.promise);
							for (const resource of resources) resource.hostEffects.delete(effect.promise);
						};
						effect.promise.then(releaseEffect, releaseEffect);
						try {
							assertCurrent();
							context.signal.throwIfAborted();
							effect.resolve(onRequest(value, context));
						} catch (error) {
							effect.reject(error);
						}
						return effect.promise;
					} : void 0
				});
				if (!reply.ok) throw new UsageCostWorkerReplyError(reply.error);
				clearClosedDatabaseCustody(lane, sequence, reply.closedDatabases);
				signal.throwIfAborted();
				assertCurrent();
				return reply.value;
			} catch (error) {
				if (sequence > 0 && !executionSettled) {
					custody.failedThrough = Math.max(custody.failedThrough, sequence);
					try {
						await rotateDatabaseWorkers(lane);
					} catch (cleanupError) {
						throw withSqliteWorkerCleanupFailure(toErrorObject(error, "Usage cost worker failed"), cleanupError);
					}
				}
				throw error;
			} finally {
				await Promise.allSettled(hostEffects);
				for (const resource of resources) resource.aborters.delete(abort);
				lane.pending--;
				pruneHistoryDatabases();
				armDatabaseWorkerIdleRetirement(lane);
			}
		})();
		pending.add(task);
		task.then(() => pending.delete(task), () => pending.delete(task));
		return task;
	};
	let result;
	try {
		assertCurrent();
		const value = await operation({
			assertCurrent,
			run,
			retainCleanup
		});
		assertCurrent();
		result = {
			ok: true,
			value
		};
	} catch (error) {
		result = {
			ok: false,
			error
		};
	}
	phase = "closing";
	try {
		await settle();
		for (const cleanup of cleanups) await cleanup.run();
		if (result.ok) assertCurrent();
	} catch (cleanupError) {
		throw result.ok ? cleanupError : withSqliteWorkerCleanupFailure(toErrorObject(result.error, "Usage cost operation failed"), cleanupError);
	} finally {
		phase = "closed";
		for (const resource of resources) resource.pending--;
		pruneHistoryDatabases();
		for (const lane of lanes.keys()) armDatabaseWorkerIdleRetirement(lane);
	}
	if (!result.ok) throw result.error;
	return result.value;
}
/** Process-held sources exchange bounded pages without reopening their memory database. */
async function runProcessHeldHistoryTask(params, onRequest, signal) {
	historyLane.pending++;
	historyClearTimeout(historyLane.idleTimer);
	historyLane.idleTimer = void 0;
	refreshDatabaseWorkerPressureSubscription();
	let sequence = 0;
	let executionRetired = false;
	try {
		await historyLane.rotation;
		const value = unwrapSessionTranscriptWorkerReply(await historyLane.pool.run(() => {
			sequence = ++historyLane.nativeSequence;
			return {
				kind: "cli-process-history",
				params
			};
		}, {
			inputBytes: params.cliHistoryRedaction?.retainedBytes,
			timeoutMs: 6e4,
			onRequest,
			signal,
			onExecutionSettled: ({ retired }) => {
				if (retired) {
					executionRetired = true;
					releaseRetiredDatabaseCustody(historyLane, sequence);
				}
			}
		}));
		if (typeof value === "boolean" || Array.isArray(value) || value.kind !== "rpc") throw new Error("Unexpected process-held history reply");
		return value.page;
	} catch (error) {
		if (sequence > 0 && !executionRetired) try {
			await rotateDatabaseWorkers(historyLane);
		} catch (cleanupError) {
			throw sessionHistoryCleanupError(error, cleanupError, "worker retirement");
		}
		throw error;
	} finally {
		historyLane.pending--;
		armDatabaseWorkerIdleRetirement(historyLane);
	}
}
//#endregion
export { resolveSessionStorePathForScope as _, runProcessHeldHistoryTask as a, withSessionHistoryWorkerDatabases as c, withSessionHistoryWorkerReadCandidates as d, captureSessionWatcherStorePaths as f, resolvePhysicalSessionStorePath as g, publishSystemEventStoreConfig as h, retainSessionHistoryWorkerDatabase as i, maintenanceLane as l, prepareSessionWatcherStorePaths as m, prepareSessionEntryPresenceRead as n, withSessionCostUsageWorkerDatabases as o, preparePhysicalSessionStorePath as p, prewarmSessionHistoryWorker as r, withSessionHistoryWorkerDatabase as s, isSessionHistoryWorkerCold as t, projectionLane as u, UsageCostWorkerReplyError as v };
