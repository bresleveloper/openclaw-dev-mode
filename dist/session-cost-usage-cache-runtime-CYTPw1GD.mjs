import { d as toErrorObject, r as collectErrorGraphCandidates } from "./error-coercion-BwMr25F8.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as getAsyncWorkSignal, s as trackAsyncWork } from "./async-work-scope-BH2yUdBz.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as isAbortError } from "./abort-signal-C9DFO3n5.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as resolveOpenClawAgentSqlitePath, r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { h as getAgentDeletionDatabaseCleanup } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { r as WorkerTaskError } from "./src-NEpyeLp1.mjs";
import "./worker-task-pool-D6ogd941.mjs";
import { n as runWithSqliteDatabaseAdmissionTurn } from "./sqlite-database-admission-turn-BwijprYk.mjs";
import "./session-key-CSDERtm3.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { p as withSqliteWorkerCleanupFailure } from "./sqlite-worker-store-Bzw_c0pA.mjs";
import "./openclaw-agent-db-_fC-kf1x.mjs";
import { r as listDurableSqliteTargetPathsForSessionStorePath } from "./session-sqlite-target-DJQA0Ssz.mjs";
import { o as resolveSessionStorePathForScope } from "./session-store-path-BQkYPc4_.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-CkjJ0jcJ.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { n as resolveSqliteReadScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { i as UsageCostWorkerReplyError } from "./session-transcript-read-pools-DSkIQlUd.mjs";
import { a as costRefreshLane, d as refreshDatabaseWorkerPressureSubscription, f as releaseRetiredDatabaseCustody, i as costReadLane, m as rotateDatabaseWorkers, n as armDatabaseWorkerIdleRetirement, o as historyClearTimeout, r as clearClosedDatabaseCustody, t as acquireHistoryDatabaseResource, u as pruneHistoryDatabases } from "./session-transcript-worker-resources-D1956Oac.mjs";
import { r as publishSessionCostUsageUpdated } from "./session-cost-usage-events-BxUvxfAU.mjs";
import { n as prepareModelPricingContext } from "./pricing-Cw2OErus.mjs";
import { s as resolveModelCostConfigFingerprint, t as captureModelCostPricing } from "./usage-format-DT58obO2.mjs";
import { t as observeAgentRunActivity } from "./agent-run-activity-w99ALh1H.mjs";
import { a as needsUsageCostEstimate, o as parseUsageCostTranscriptRecord, r as applyUsageCostEstimate } from "./session-cost-usage-rollup-scan-C-xPJUWE.mjs";
import { a as isSessionActorUsageRefreshRunning, i as prepareSessionCostUsageRefreshLock, o as runSessionActorUsage, r as isSessionCostUsageRefreshRunning, t as openUsageCostRefreshFailures } from "./session-cost-usage-refresh-health-i-ZqKyXu.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/session-cost-usage-pricing-context.ts
async function resolveUsageCostPricingFingerprint(config, agentDir) {
	await prepareModelPricingContext(config);
	return resolveModelCostConfigFingerprint(config, agentDir);
}
async function prepareUsageCostPricing(config, agentDir) {
	await prepareModelPricingContext(config);
	return captureModelCostPricing(config, agentDir);
}
function createUsageCostResolver(params, pricing) {
	let capturedPricing = pricing;
	const cache = /* @__PURE__ */ new Map();
	return ({ provider, model }) => {
		const key = `${provider ?? ""}\0${model ?? ""}`;
		if (cache.has(key)) return cache.get(key);
		capturedPricing ??= captureModelCostPricing(params?.config, params?.agentDir);
		const cost = capturedPricing.resolve(provider, model);
		cache.set(key, cost);
		return cost;
	};
}
/** Diagnostic readers prepare only when a record actually needs an estimate. */
async function parseUsageCostTranscriptEntryAsync(parsed, resolveCost, config) {
	const entry = parseUsageCostTranscriptRecord(parsed);
	if (!needsUsageCostEstimate(entry)) return entry;
	await prepareModelPricingContext(config);
	return applyUsageCostEstimate(entry, resolveCost);
}
//#endregion
//#region src/infra/session-cost-usage-worker-scope.ts
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
				const reply = await runWithSqliteDatabaseAdmissionTurn([...resources].filter(({ database }) => !isIncognitoOpenClawAgentSqlitePath(database.path, {
					agentId: database.agentId,
					env: input.location.env
				})).map((resource) => resource.database.path), () => lane.pool.run(() => {
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
				}));
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
//#endregion
//#region src/infra/session-cost-usage-worker-runtime.ts
const USAGE_COST_WORKER_TIMEOUT_MS = 3e5;
const logger$1 = createSubsystemLogger("usage-cost-cache");
function prepareUsageCostWorker(params) {
	const signal = getAsyncWorkSignal();
	const authority = {
		assertCurrent: () => signal?.throwIfAborted(),
		authorize() {}
	};
	let memory;
	for (const scope of [{
		...params,
		storePath: params.storePath ?? params.databasePath
	}, ...(params.sessionFiles ?? []).flatMap((file) => {
		const marker = parseSqliteSessionFileMarker(file);
		return marker ? [{
			...marker,
			env: params.env
		}] : [];
	})]) {
		memory = captureSessionActorStorageOwner(scope, authority);
		if (memory) break;
	}
	if (memory) {
		const env = cloneEnvWithPlatformSemantics(params.env ?? process.env);
		env.OPENCLAW_STATE_DIR = resolveStateDir(env);
		return {
			location: {
				agentId: memory.agentId,
				databasePath: memory.path,
				storePath: memory.path,
				env: { ...env }
			},
			config: params.config,
			agentDir: params.agentDir ?? resolveAgentDir(params.config ?? {}, memory.agentId),
			databases: [],
			stores: [],
			archiveStorePaths: [],
			sessionActor: memory.binding,
			memory
		};
	}
	const agentId = normalizeAgentId(params.agentId);
	const env = cloneEnvWithPlatformSemantics(params.env ?? process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const storePath = resolveSessionStorePathForScope({
		agentId,
		env,
		storePath: params.storePath ?? (params.sessionsDir ? path.join(params.sessionsDir, "sessions.json") : void 0)
	}, params.config);
	const databasePath = resolveOpenClawAgentSqlitePath({
		agentId,
		env,
		path: params.databasePath
	});
	const databases = /* @__PURE__ */ new Map();
	const add = (options) => {
		const prepared = {
			...options,
			env,
			path: resolveOpenClawAgentSqlitePath(options)
		};
		databases.set(JSON.stringify([prepared.agentId, prepared.path]), prepared);
	};
	add({
		agentId,
		path: databasePath,
		env
	});
	const archiveStorePaths = listDurableSqliteTargetPathsForSessionStorePath(storePath);
	const targets = [{
		agentId,
		storePath
	}, ...archiveStorePaths.map((targetPath) => ({
		agentId,
		storePath: targetPath
	}))];
	for (const file of params.sessionFiles ?? []) {
		const marker = parseSqliteSessionFileMarker(file);
		if (marker) targets.push(marker);
	}
	const seen = /* @__PURE__ */ new Set();
	const stores = /* @__PURE__ */ new Map();
	for (const target of targets) {
		const key = JSON.stringify([target.agentId, target.storePath]);
		if (seen.has(key)) continue;
		seen.add(key);
		const options = toDatabaseOptions(resolveSqliteReadScope({
			...target,
			env
		}));
		const database = {
			agentId: options.agentId,
			path: resolveOpenClawAgentSqlitePath(options)
		};
		add(options);
		stores.set(key, {
			agentId: target.agentId,
			storePath: target.storePath,
			database
		});
		stores.set(JSON.stringify([target.agentId, database.path]), {
			agentId: target.agentId,
			storePath: database.path,
			database
		});
	}
	return {
		location: {
			agentId,
			databasePath,
			storePath,
			env: {
				...env,
				OPENCLAW_STATE_DIR: env.OPENCLAW_STATE_DIR
			}
		},
		config: params.config,
		agentDir: params.agentDir ?? resolveAgentDir(params.config ?? {}, agentId),
		databases: [...databases.values()],
		stores: [...stores.values()],
		archiveStorePaths
	};
}
function resolveUsageCostWorkerDayBucket(dayBucket) {
	return dayBucket ? { ...dayBucket } : {
		mode: "time-zone",
		timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
	};
}
function restoreWorkerFailure(error, hostErrors) {
	const restoredOrigins = /* @__PURE__ */ new Set();
	let result = error;
	for (const current of collectErrorGraphCandidates(error, (entry) => entry instanceof Error ? [entry.cause, ...entry instanceof AggregateError ? entry.errors : []] : [])) if (current instanceof UsageCostWorkerReplyError) {
		const failure = current.failure;
		const remote = new Error(failure.message);
		if (failure.error) retainOpenClawStateWorkerErrorPayload(remote, failure.error);
		let restored = hydrateOpenClawStateWorkerError(remote, { includeOrdinary: true });
		if (failure.hostOrigin !== void 0 && hostErrors.has(failure.hostOrigin)) {
			restoredOrigins.add(failure.hostOrigin);
			const original = hostErrors.get(failure.hostOrigin);
			restored = failure.hostFailureOnly ? original : withSqliteWorkerCleanupFailure(toErrorObject(original, "Usage cache host effect failed"), restored);
		}
		result = current === error ? restored : withSqliteWorkerCleanupFailure(toErrorObject(restored, "Usage cost worker failed"), result);
	}
	for (const [origin, failure] of hostErrors) if (!restoredOrigins.has(origin)) result = withSqliteWorkerCleanupFailure(toErrorObject(failure, "Usage cache host effect failed"), result);
	return result;
}
async function runUsageCostWorker(prepared, operation) {
	if (prepared.memory) {
		const pricing = operation.kind === "refresh" ? await prepareUsageCostPricing(prepared.config, prepared.agentDir) : void 0;
		const request = operation.kind === "refresh" ? {
			...operation,
			pricingFingerprint: pricing.fingerprint()
		} : operation;
		return runSessionActorUsage(prepared.memory, request, createUsageCostResolver(prepared, pricing));
	}
	return runPreparedUsageCostWorker(prepared, operation);
}
async function runPreparedUsageCostWorker(prepared, operation) {
	const location = structuredClone(prepared.location);
	const archiveStorePaths = [...prepared.archiveStorePaths];
	const stores = structuredClone(prepared.stores);
	const capturedOperation = structuredClone(operation);
	const signal = getAsyncWorkSignal();
	return withSessionCostUsageWorkerDatabases(prepared.databases, async (scope) => {
		const assertCurrent = () => {
			scope.assertCurrent();
			signal?.throwIfAborted();
		};
		const pruneRows = [];
		const lock = capturedOperation.kind === "refresh" ? prepareSessionCostUsageRefreshLock(location.agentId, location.databasePath, {
			env: location.env,
			assertCurrent
		}) : void 0;
		if (lock) scope.retainCleanup(lock.release);
		const requireLock = (action) => {
			if (!lock) throw new Error(`Usage report cannot ${action}`);
			return lock;
		};
		if (lock) {
			if (!await lock.acquire()) return { kind: "busy" };
		}
		assertCurrent();
		let workerOperation;
		let resolveCost;
		if (capturedOperation.kind === "refresh") {
			const pricing = await prepareUsageCostPricing(prepared.config, prepared.agentDir);
			workerOperation = {
				...capturedOperation,
				pricingFingerprint: pricing.fingerprint()
			};
			resolveCost = createUsageCostResolver(prepared, pricing);
		} else {
			workerOperation = capturedOperation;
			resolveCost = createUsageCostResolver(prepared);
		}
		const failures = openUsageCostRefreshFailures(location.env);
		const failureKey = (sessionFile) => JSON.stringify([location.databasePath, sessionFile]);
		let activeSessionFile;
		const hostErrors = /* @__PURE__ */ new Map();
		let errorSequence = 0;
		try {
			const failureEntries = lock ? await failures.entries().catch((error) => {
				logger$1.warn("Could not read usage refresh failure history", { error });
				return [];
			}) : [];
			const failedKeys = new Set(failureEntries.map((entry) => entry.key));
			const result = await scope.run({
				kind: "usage-cost",
				location,
				operation: workerOperation,
				databases: [],
				stores,
				archiveStorePaths
			}, {
				signal,
				beforeDispatch: assertCurrent,
				inputBytes: 2 * JSON.stringify({
					location,
					operation: workerOperation,
					archiveStorePaths,
					stores
				}).length,
				timeoutMs: USAGE_COST_WORKER_TIMEOUT_MS,
				onRequest: async (value, context) => {
					let reply;
					try {
						const assertRequestCurrent = () => {
							assertCurrent();
							context.signal.throwIfAborted();
						};
						assertRequestCurrent();
						if (!isRecord(value) || typeof value.kind !== "string") throw new Error("Invalid usage worker host request");
						const request = value;
						let output = void 0;
						switch (request.kind) {
							case "refresh-session":
								requireLock("refresh sessions");
								activeSessionFile = request.input.sessionFile;
								break;
							case "pricing":
								output = request.input.map(resolveCost);
								break;
							case "prune-row":
								requireLock("prune cache rows");
								pruneRows.push({
									key: request.input.key,
									valueJson: request.input.value,
									updatedAt: request.input.updatedAt
								});
								break;
							case "prune":
								await requireLock("prune cache rows").pruneRows(pruneRows, context.signal);
								pruneRows.length = 0;
								break;
							case "write":
								output = await requireLock("write cache rows").writeRollup({
									rollupId: request.input.key,
									valueJson: request.input.value,
									blob: request.input.blob,
									updatedAt: request.input.updatedAt,
									partitions: request.input.partitions,
									removedDates: request.input.removedDates,
									replacePartitions: request.input.replacePartitions
								}, context.signal);
								if (output && failedKeys.has(failureKey(request.input.key))) await failures.delete(failureKey(request.input.key), {
									assertCurrent: assertRequestCurrent,
									signal: context.signal
								}).catch((error) => {
									logger$1.warn("Could not clear usage refresh failure fact", { error });
								});
								activeSessionFile = void 0;
								break;
							default: throw new Error("Unknown usage worker host request");
						}
						assertRequestCurrent();
						reply = {
							ok: true,
							value: output
						};
					} catch (error) {
						const origin = ++errorSequence;
						hostErrors.set(origin, error);
						reply = {
							ok: false,
							origin,
							message: toErrorObject(error, "Usage host effect failed").message
						};
					}
					return {
						input: reply,
						timeoutMs: USAGE_COST_WORKER_TIMEOUT_MS
					};
				}
			});
			assertCurrent();
			return result;
		} catch (error) {
			let failure = restoreWorkerFailure(error, hostErrors);
			if (activeSessionFile && !signal?.aborted) try {
				await failures.register(failureKey(activeSessionFile), {
					agentId: location.agentId,
					sessionFile: activeSessionFile,
					failedAt: Date.now(),
					reason: "Usage refresh failed; cached totals may be incomplete. Check Gateway logs."
				}, { assertCurrent });
			} catch (healthError) {
				failure = withSqliteWorkerCleanupFailure(toErrorObject(failure, "Usage refresh failed"), healthError);
			}
			throw failure;
		}
	});
}
//#endregion
//#region src/infra/session-cost-usage-aggregation.ts
async function refreshCostUsageCacheForAgent(params) {
	const prepared = prepareUsageCostWorker(params);
	const agentId = normalizeAgentId(params.agentId);
	try {
		const result = await runUsageCostWorker(prepared, {
			kind: "refresh",
			maxFiles: params.maxFiles,
			sessionsDir: params.sessionsDir,
			sessionFiles: params.sessionFiles,
			startMs: params.startMs,
			rebuildRows: params.rebuildRows
		});
		if (result.kind === "busy") return "busy";
		if (result.kind !== "refresh") throw new Error("Invalid usage refresh worker result");
		if (result.changed) publishSessionCostUsageUpdated(agentId);
		if (result.remainingFiles?.length) params.onRemaining?.(result.remainingFiles);
		return "refreshed";
	} catch (error) {
		if (!getAsyncWorkSignal()?.aborted) publishSessionCostUsageUpdated(agentId, true);
		throw error;
	}
}
//#endregion
//#region src/infra/session-cost-usage-cache-runtime.ts
const USAGE_COST_REFRESH_RETRY_MIN_MS = 50;
const USAGE_COST_PUBLICATION_QUIET_MS = 3e4;
const USAGE_COST_PUBLICATION_MAX_WAIT_MS = 3e5;
const USAGE_COST_REFRESH_BATCH_SIZE = 50;
const USAGE_COST_REFRESH_RETRY_MAX_MS = 5e3;
const logger = createSubsystemLogger("usage-cost-cache");
const usageCostRefreshes = /* @__PURE__ */ new Map();
function isUsageCostRefreshQueued(databasePath) {
	return usageCostRefreshes.get(getAsyncWorkSignal())?.has(databasePath) === true;
}
async function flushPendingUsageCostRefresh(prepared, sessionFiles, maxPublicationWaitMs = Infinity) {
	const signal = getAsyncWorkSignal();
	signal?.throwIfAborted();
	const key = prepared.location.databasePath;
	const pending = [];
	for (const refreshes of usageCostRefreshes.values()) {
		const state = refreshes.get(key);
		if (!state) continue;
		for (const file of sessionFiles ?? state.dirtySessionFiles) {
			if (!state.fullRefreshRequested && state.runningSessionFiles !== "all" && !state.runningSessionFiles.has(file) && !state.pendingSessionFiles.has(file)) continue;
			let completion = state.readingSessionFiles.get(file);
			if (!completion) {
				completion = createDeferredCore();
				state.readingSessionFiles.set(file, completion);
			}
			if (state.runningSessionFiles === "all" || !state.runningSessionFiles.has(file)) state.pendingSessionFiles.set(file, null);
			pending.push(completion.promise);
		}
		state.resume?.();
	}
	if (pending.length === 0) return;
	const waiting = new AbortController();
	const stopWaiting = () => waiting.abort();
	signal?.addEventListener("abort", stopWaiting, { once: true });
	try {
		await Promise.race([Promise.all(pending), waitForUsageCostRefresh(waiting.signal, maxPublicationWaitMs)]);
		signal?.throwIfAborted();
	} finally {
		signal?.removeEventListener("abort", stopWaiting);
		stopWaiting();
	}
}
async function loadCostUsageSummary(params) {
	const now = Date.now();
	const defaultStart = new Date(now);
	defaultStart.setDate(defaultStart.getDate() - 29);
	return loadAggregateCostUsageSummary({
		...params,
		startMs: params.startMs ?? defaultStart.getTime(),
		endMs: params.endMs ?? now
	}, true);
}
async function loadCostUsageSummaryFromCache(params) {
	return loadAggregateCostUsageSummary(params, false);
}
async function loadAggregateCostUsageSummary(params, refreshFirst) {
	const prepared = prepareUsageCostWorker(params);
	const { databasePath, storePath } = prepared.location;
	await flushPendingUsageCostRefresh(prepared);
	const refresh = refreshFirst ? await refreshCostUsageCacheForAgent({
		config: params.config,
		agentId: params.agentId,
		agentDir: prepared.agentDir,
		databasePath,
		storePath,
		sessionActor: prepared.sessionActor
	}) : void 0;
	const result = await runUsageCostWorker(prepared, {
		pricingFingerprint: await resolveUsageCostPricingFingerprint(prepared.config, prepared.agentDir),
		startMs: params.startMs,
		endMs: params.endMs,
		dayBucket: resolveUsageCostWorkerDayBucket(params.dayBucket),
		kind: "summary"
	});
	if (result.kind !== "summary" || !result.summary.cacheStatus) throw new Error("Usage worker returned an invalid aggregate summary");
	const { summary, invalidRows } = result;
	const cacheStatus = result.summary.cacheStatus;
	if (refreshFirst ? invalidRows.length > 0 : params.requestRefresh !== false && cacheStatus.staleFiles > 0) requestCostUsageCacheRefresh({
		config: params.config,
		agentId: params.agentId,
		storePath,
		rebuildRows: invalidRows,
		sessionActor: prepared.sessionActor
	});
	if (refresh === "busy" || isUsageCostRefreshQueued(databasePath) || (prepared.memory ? isSessionActorUsageRefreshRunning(prepared.memory) : await isSessionCostUsageRefreshRunning(params.agentId, databasePath))) cacheStatus.status = "refreshing";
	summary.updatedAt = Date.now();
	return summary;
}
async function loadSessionCostSummariesFromCache(params) {
	const result = await loadSessionCostResultFromCache(params);
	if (result.kind !== "sessions") throw new Error("Usage worker returned an invalid session summary");
	return {
		summaries: result.summaries,
		cacheStatus: result.cacheStatus,
		remainingReportBytes: result.remainingReportBytes
	};
}
function loadSessionCostResultFromCache(params) {
	return loadCapturedSessionCostSummariesFromCache(params, prepareUsageCostWorker({
		...params,
		sessionFiles: params.sessions.map((session) => session.sessionFile)
	}));
}
async function loadCapturedSessionCostSummariesFromCache(params, prepared) {
	const { databasePath, storePath } = prepared.location;
	await flushPendingUsageCostRefresh(prepared, params.sessions.map((session) => session.sessionFile), params.maxPublicationWaitMs);
	const result = await runUsageCostWorker(prepared, {
		kind: "sessions",
		pricingFingerprint: await resolveUsageCostPricingFingerprint(prepared.config, prepared.agentDir),
		sessions: params.sessions,
		startMs: params.startMs,
		endMs: params.endMs,
		includeUntimestamped: params.includeUntimestamped,
		reportBudgetBytes: params.reportBudgetBytes,
		dayBucket: resolveUsageCostWorkerDayBucket(params.dayBucket)
	});
	if (result.kind !== "sessions") throw new Error("Usage worker returned an invalid session summary");
	const { cacheStatus, staleSessionFiles } = result;
	const refreshRequested = params.requestRefresh !== false && staleSessionFiles.length > 0;
	if (refreshRequested) requestCostUsageCacheRefresh({
		config: params.config,
		agentId: params.agentId,
		storePath,
		sessionFiles: staleSessionFiles,
		rebuildRows: result.invalidRows,
		databasePath,
		env: prepared.location.env,
		sessionActor: prepared.sessionActor
	});
	if (staleSessionFiles.length > 0 && (refreshRequested || (prepared.memory ? isSessionActorUsageRefreshRunning(prepared.memory) : await isSessionCostUsageRefreshRunning(params.agentId, databasePath)))) {
		cacheStatus.status = "refreshing";
		for (const summary of result.summaries) if (summary?.staleSince !== void 0) summary.refreshing = true;
	}
	return result;
}
function requestCostUsageCacheRefresh(params) {
	const scopeSignal = getAsyncWorkSignal();
	if (scopeSignal?.aborted) return;
	const databasePath = params.sessionActor?.path ?? resolveOpenClawAgentSqlitePath({
		agentId: normalizeAgentId(params.agentId),
		path: params.databasePath,
		env: params.env
	});
	if (getAgentDeletionDatabaseCleanup({
		agentId: params.agentId,
		path: databasePath,
		env: params.env
	})?.ownsDatabase) return;
	const queueKey = databasePath;
	const refreshes = usageCostRefreshes.get(scopeSignal) ?? /* @__PURE__ */ new Map();
	const existing = refreshes.get(queueKey);
	if (existing) {
		mergeUsageCostRefreshRequest(existing, params);
		existing.resume?.();
		return;
	}
	const state = {
		agentId: params.agentId,
		config: params.config,
		databasePath,
		queueKey,
		env: params.env,
		sessionActor: params.sessionActor,
		fullRefreshRequested: false,
		pendingSessionFiles: /* @__PURE__ */ new Map(),
		pendingRebuildRows: /* @__PURE__ */ new Map(),
		storePath: params.storePath,
		dirtySessionFiles: /* @__PURE__ */ new Set(),
		readingSessionFiles: /* @__PURE__ */ new Map(),
		runningSessionFiles: /* @__PURE__ */ new Set(),
		agentBusy: false,
		idleAt: performance.now()
	};
	mergeUsageCostRefreshRequest(state, params);
	usageCostRefreshes.set(scopeSignal, refreshes);
	refreshes.set(queueKey, state);
	trackAsyncWork(() => runQueuedUsageCostRefresh(state, refreshes, scopeSignal));
}
function mergeUsageCostRefreshRequest(state, params) {
	state.config = params.config ?? state.config;
	state.agentId = params.agentId;
	state.storePath = params.storePath;
	for (const row of params.rebuildRows ?? []) {
		state.pendingRebuildRows.set(row.key, row);
		state.pendingSessionFiles.set(row.key, null);
	}
	if (!params.sessionFiles) {
		state.fullRefreshRequested = true;
		return;
	}
	const now = performance.now();
	for (const sessionFile of params.sessionFiles) {
		if (params.coalesce) state.dirtySessionFiles.add(sessionFile);
		const pending = state.pendingSessionFiles.get(sessionFile);
		state.pendingSessionFiles.set(sessionFile, params.coalesce && pending !== null ? {
			firstAt: pending?.firstAt ?? now,
			lastAt: now
		} : null);
	}
}
function usageCostRefreshDelay(state, now, file) {
	if (file === void 0 && (state.readingSessionFiles.size > 0 || state.fullRefreshRequested) || file !== void 0 && state.readingSessionFiles.has(file)) return 0;
	const delays = file === void 0 ? state.pendingSessionFiles.entries() : [[file, state.pendingSessionFiles.get(file)]];
	let delay = Infinity;
	for (const [pendingFile, pending] of delays) {
		if (state.agentBusy && state.dirtySessionFiles.has(pendingFile)) continue;
		if (!pending) return 0;
		delay = Math.min(delay, Math.min(pending.firstAt + USAGE_COST_PUBLICATION_MAX_WAIT_MS, Math.max(pending.lastAt, state.idleAt) + USAGE_COST_PUBLICATION_QUIET_MS) - now);
	}
	return Math.max(0, delay);
}
function waitForUsageCostRefresh(signal, delayMs, state) {
	return new Promise((resolve) => {
		const timer = Number.isFinite(delayMs) ? setTimeout(finish, delayMs) : void 0;
		timer?.unref?.();
		function finish() {
			clearTimeout(timer);
			signal?.removeEventListener("abort", finish);
			if (state) state.resume = void 0;
			resolve();
		}
		if (state) state.resume = finish;
		signal?.addEventListener("abort", finish, { once: true });
		if (signal?.aborted) finish();
	});
}
async function runQueuedUsageCostRefresh(state, refreshes, signal) {
	let busyRetryDelayMs = USAGE_COST_REFRESH_RETRY_MIN_MS;
	let retryAt = 0;
	let recoveredPartialFailure = false;
	const offActivity = observeAgentRunActivity(state.agentId, (busy) => {
		state.agentBusy = busy;
		if (!busy) state.idleAt = performance.now();
		state.resume?.();
	});
	try {
		do {
			await waitForUsageCostRefresh(signal, Math.max(retryAt - performance.now(), usageCostRefreshDelay(state, performance.now())), state);
			if (signal?.aborted) return;
			if (performance.now() < retryAt || usageCostRefreshDelay(state, performance.now()) > 0) continue;
			let partialBatch = false;
			try {
				if (state.fullRefreshRequested || state.pendingSessionFiles.size > 0) {
					const priorityFiles = [...state.readingSessionFiles.keys()];
					const fullRefreshRequested = state.fullRefreshRequested && priorityFiles.length === 0;
					partialBatch = !fullRefreshRequested;
					const sessionFiles = [];
					if (fullRefreshRequested) {
						for (const file of state.pendingSessionFiles.keys()) if (!state.dirtySessionFiles.has(file)) state.pendingSessionFiles.delete(file);
					} else for (const file of priorityFiles.length ? priorityFiles : state.pendingSessionFiles.keys()) {
						if (usageCostRefreshDelay(state, performance.now(), file) > 0) continue;
						sessionFiles.push(file);
						state.pendingSessionFiles.delete(file);
						if (sessionFiles.length === USAGE_COST_REFRESH_BATCH_SIZE) break;
					}
					const rebuildRows = [...state.pendingRebuildRows.values()];
					if (fullRefreshRequested) state.fullRefreshRequested = false;
					state.runningSessionFiles = fullRefreshRequested ? "all" : new Set(sessionFiles);
					const remainingRollupIds = /* @__PURE__ */ new Set();
					const result = await refreshCostUsageCacheForAgent({
						config: state.config,
						agentId: state.agentId,
						databasePath: state.databasePath,
						storePath: state.storePath,
						sessionFiles: fullRefreshRequested ? void 0 : sessionFiles,
						maxFiles: USAGE_COST_REFRESH_BATCH_SIZE,
						onRemaining: (files) => {
							for (const { sessionFile, rollupId } of files) {
								remainingRollupIds.add(rollupId);
								state.pendingSessionFiles.set(sessionFile, null);
								if (state.pendingRebuildRows.has(rollupId)) state.pendingSessionFiles.set(rollupId, null);
							}
						},
						rebuildRows,
						env: state.env,
						sessionActor: state.sessionActor
					});
					if (signal?.aborted) return;
					if (result === "busy") {
						if (fullRefreshRequested) state.fullRefreshRequested = true;
						else state.pendingSessionFiles = new Map([...sessionFiles.map((file) => [file, null]), ...state.pendingSessionFiles]);
						retryAt = performance.now() + busyRetryDelayMs;
						busyRetryDelayMs = Math.min(busyRetryDelayMs * 2, USAGE_COST_REFRESH_RETRY_MAX_MS);
						continue;
					}
					for (const row of rebuildRows) if ((fullRefreshRequested || sessionFiles.includes(row.key)) && !remainingRollupIds.has(row.key) && state.pendingRebuildRows.get(row.key) === row) state.pendingRebuildRows.delete(row.key);
					for (const file of sessionFiles) if (!state.pendingSessionFiles.has(file)) {
						state.dirtySessionFiles.delete(file);
						state.readingSessionFiles.get(file)?.resolve();
						state.readingSessionFiles.delete(file);
					}
					state.runningSessionFiles = /* @__PURE__ */ new Set();
					busyRetryDelayMs = USAGE_COST_REFRESH_RETRY_MIN_MS;
				}
			} catch (error) {
				if (signal?.aborted && !(error instanceof AggregateError) && isAbortError(error)) {
					logger.debug("background refresh cancelled during shutdown");
					return;
				}
				logger.warn(`background refresh failed: ${formatErrorMessage(error)}`, { error });
				if (signal?.aborted || !partialBatch || recoveredPartialFailure) return;
				recoveredPartialFailure = true;
				state.fullRefreshRequested = true;
				for (const file of state.readingSessionFiles.keys()) state.pendingSessionFiles.set(file, null);
			}
		} while (state.fullRefreshRequested || state.pendingSessionFiles.size > 0);
	} finally {
		offActivity();
		for (const completion of state.readingSessionFiles.values()) completion.reject(/* @__PURE__ */ new Error("Usage refresh ended before the requested session was refreshed"));
		refreshes.delete(state.queueKey);
		if (refreshes.size === 0) usageCostRefreshes.delete(signal);
	}
}
//#endregion
export { refreshCostUsageCacheForAgent as a, runUsageCostWorker as c, resolveUsageCostPricingFingerprint as d, requestCostUsageCacheRefresh as i, createUsageCostResolver as l, loadCostUsageSummaryFromCache as n, prepareUsageCostWorker as o, loadSessionCostSummariesFromCache as r, resolveUsageCostWorkerDayBucket as s, loadCostUsageSummary as t, parseUsageCostTranscriptEntryAsync as u };
