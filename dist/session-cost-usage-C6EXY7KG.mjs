import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as collectErrorGraphCandidates, u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { c as trackAsyncWork, r as getAsyncWorkSignal } from "./async-work-scope-BYeX3gh6.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
import { _ as isOpenClawAgentDatabasePathCurrent } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { c as resolveOpenClawAgentSqlitePath, i as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { a as isPrimarySessionTranscriptFileName } from "./artifacts-BvSTVPj-.mjs";
import { m as withSqliteWorkerCleanupFailure } from "./sqlite-worker-store-CsIRv3py.mjs";
import { a as getOpenClawAgentDatabaseIfOpen } from "./openclaw-agent-db-DBug3LUA.mjs";
import { n as prepareModelPricingContext } from "./pricing-Bwenqzdn.mjs";
import { r as listDurableSqliteTargetPathsForSessionStorePath } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { i as sqliteSessionFileMarkerMatchesTarget, n as parseSqliteSessionFileMarker, t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { o as resolveSqliteReadScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { s as createMemoryTranscriptProjectionSource } from "./session-transcript-reconcile-Dv1lK4ND.mjs";
import { _ as resolveSessionStorePathForScope, o as withSessionCostUsageWorkerDatabases, v as UsageCostWorkerReplyError } from "./session-transcript-worker-runtime-EUbUbAQu.mjs";
import { i as listSessionTranscriptInstances } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import { i as stripInboundMetadata } from "./strip-inbound-meta-BWIgBUDF.mjs";
import { E as readTranscriptStatsBatchFromDatabase } from "./session-accessor.sqlite-read-D4vZepQN.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { c as resolveModelCostConfigFingerprint, t as captureModelCostPricing } from "./usage-format-CmKsaFRe.mjs";
import { n as isToolCallContentType } from "./tool-content-SH_V-fgH.mjs";
import { t as stripUserEnvelopeForDisplay } from "./user-envelope-display-PUowpePW.mjs";
import { r as publishSessionCostUsageUpdated } from "./session-cost-usage-events-2-CLnboz.mjs";
import { n as restoreSessionColdTranscript } from "./session-cold-storage-VucmqvVN.mjs";
import { a as readSessionCostUsageRollupBodyInDatabase, o as readSessionCostUsageRollupByteRowsInDatabase } from "./session-cost-usage-cache.kernel-B9i4w4X5.mjs";
import { i as prepareSessionCostUsageRefreshLock, r as isSessionCostUsageRefreshRunning, t as openUsageCostRefreshFailures } from "./session-cost-usage-refresh-health-BezX6CSW.mjs";
import { c as resolveUsageSessionSource, d as needsUsageCostEstimate, f as parseUsageCostTranscriptRecord, i as readTranscriptRecordsBestEffort, l as applyUsageCostEstimate, r as readTranscriptRecords, u as computeUsageTokenTotals } from "./session-cost-usage-collection-Cw03CacJ.mjs";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { setImmediate } from "node:timers/promises";
//#region src/infra/session-cost-usage-incognito.ts
/** Explicit inactive routing; physical identity and cleanup belong to the captured actor. */
function createIncognitoUsageCostAdapter(compute, target, marker) {
	const filePath = formatSqliteSessionFileMarker(marker);
	const sources = /* @__PURE__ */ new Map();
	const assertMarker = (input) => {
		if (!sqliteSessionFileMarkerMatchesTarget(formatSqliteSessionFileMarker(input), marker)) throw new Error("Usage worker requested another incognito session");
	};
	const startedAt = Date.now();
	const lockJson = JSON.stringify({
		pid: process.pid,
		startedAt,
		ownerNonce: randomUUID()
	});
	return {
		filePath,
		assertCurrent: compute.assertCurrent,
		lock: {
			async acquire() {
				const previousRaw = await compute.execute({
					type: "session.compute.usage.refreshLock",
					input: {
						...target,
						request: {}
					}
				});
				return compute.execute({
					type: "session.compute.usage.acquireLock",
					input: {
						...target,
						request: {
							previousRaw,
							previousOwnerIsRunning: previousRaw !== null,
							lockJson,
							startedAt
						}
					}
				});
			},
			writeRollup(request, signal) {
				return compute.execute({
					type: "session.compute.usage.writeRollup",
					input: {
						...target,
						request
					}
				}, signal);
			},
			pruneRows(request, signal) {
				return compute.execute({
					type: "session.compute.usage.prune",
					input: {
						...target,
						request
					}
				}, signal);
			}
		},
		async read(request, signal) {
			switch (request.kind) {
				case "memory-stats": return Promise.all(request.input.map((input) => {
					assertMarker(input);
					return compute.execute({
						type: "session.compute.usage.stats",
						input: {
							...target,
							request: {}
						}
					}, signal);
				}));
				case "memory-cache": return compute.execute({
					type: "session.compute.usage.cache",
					input: {
						...target,
						request: { filePaths: request.input.filePaths ?? [filePath] }
					}
				}, signal);
				case "memory-cache-body": return compute.execute({
					type: "session.compute.usage.cacheBody",
					input: {
						...target,
						request: request.input
					}
				}, signal);
				case "memory-transcript": {
					assertMarker(request.input.marker);
					const key = JSON.stringify(request.input);
					let sourceId = sources.get(key);
					if (!sourceId) {
						sourceId = randomUUID();
						await compute.execute({
							type: "session.compute.source.open",
							input: {
								...target,
								sourceId,
								range: request.input
							}
						}, signal);
						sources.set(key, sourceId);
					}
					return compute.execute({
						type: "session.compute.source.read",
						input: {
							...target,
							sourceId
						}
					}, signal);
				}
				default: throw new Error("Invalid incognito usage read request");
			}
		}
	};
}
//#endregion
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
//#region src/infra/session-cost-usage-worker-runtime.ts
const USAGE_COST_WORKER_TIMEOUT_MS = 3e5;
const logger$1 = createSubsystemLogger("usage-cost-cache");
function prepareUsageCostWorker(params) {
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
	const targets = [{
		agentId,
		storePath
	}, ...listDurableSqliteTargetPathsForSessionStorePath(storePath).map((targetPath) => ({
		agentId,
		storePath: targetPath
	}))];
	for (const file of params.sessionFiles ?? []) {
		const marker = parseSqliteSessionFileMarker(file);
		if (marker) targets.push(marker);
	}
	const seen = /* @__PURE__ */ new Set();
	for (const target of targets) {
		const key = JSON.stringify([target.agentId, target.storePath]);
		if (seen.has(key)) continue;
		seen.add(key);
		add(toDatabaseOptions(resolveSqliteReadScope({
			...target,
			env
		})));
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
		databases: [...databases.values()]
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
async function runUsageCostWorker(prepared, operation, incognito) {
	if (!incognito) return runPreparedUsageCostWorker(prepared, operation);
	const captured = {
		...prepared,
		location: structuredClone(prepared.location),
		databases: structuredClone(prepared.databases)
	};
	const capturedOperation = structuredClone(operation);
	const target = structuredClone(incognito.target);
	const { agentId, databasePath } = captured.location;
	if (agentId !== incognito.actor.agentId || databasePath !== incognito.actor.path || captured.location.storePath !== databasePath || captured.databases.some((entry) => entry.agentId !== agentId || entry.path !== databasePath)) throw new Error("Usage actor does not own the prepared database");
	const marker = {
		agentId,
		storePath: databasePath,
		sessionId: target.sessionId
	};
	if ([...capturedOperation.kind === "sessions" ? capturedOperation.sessions.map((entry) => entry.sessionFile) : "sessionFiles" in capturedOperation ? capturedOperation.sessionFiles ?? [] : [], ...capturedOperation.kind === "refresh" ? capturedOperation.rebuildRows?.map((row) => row.key) ?? [] : []].some((file) => !sqliteSessionFileMarkerMatchesTarget(file, marker))) throw new Error("Usage request contains another incognito session");
	return incognito.actor.sessions.withCompute(incognito.authority, target, (compute) => runPreparedUsageCostWorker(captured, capturedOperation, createIncognitoUsageCostAdapter(compute, target, marker)), getAsyncWorkSignal());
}
async function runPreparedUsageCostWorker(prepared, operation, incognito) {
	const location = structuredClone(prepared.location);
	const capturedOperation = structuredClone(operation);
	const signal = getAsyncWorkSignal();
	return withSessionCostUsageWorkerDatabases(prepared.databases, async (scope) => {
		const bindings = prepared.databases.map((options) => {
			const memory = isIncognitoOpenClawAgentSqlitePath(options.path, options);
			return {
				options,
				memory,
				database: memory && !incognito ? getOpenClawAgentDatabaseIfOpen(options) : void 0,
				identity: memory ? void 0 : fs.statSync(options.path, {
					bigint: true,
					throwIfNoEntry: false
				})
			};
		});
		const cacheBinding = bindings.find((binding) => binding.options.agentId === location.agentId && binding.options.path === location.databasePath);
		if (!cacheBinding) throw new Error("Usage cache database has no captured owner");
		const assertBindingCurrent = (binding, admittedDatabase, execution, opening) => {
			const admittedCache = admittedDatabase && binding === cacheBinding && admittedDatabase.agentId === binding.options.agentId && admittedDatabase.path === binding.options.path && getOpenClawAgentDatabaseIfOpen(binding.options) === admittedDatabase && isOpenClawAgentDatabasePathCurrent(admittedDatabase);
			if (binding.memory) {
				const current = getOpenClawAgentDatabaseIfOpen(binding.options);
				if (!binding.database && current && admittedCache) binding.database = current;
				if (current !== binding.database || binding.database && !binding.database.db.isOpen) throw new Error("Usage memory database changed during worker operation");
				return;
			}
			const current = fs.statSync(binding.options.path, {
				bigint: true,
				throwIfNoEntry: false
			});
			const admittedFile = binding === cacheBinding && execution?.agentId === binding.options.agentId && execution.path === binding.options.path && execution.fileIdentity?.physicalIdentity === (current && `${current.dev}:${current.ino}`);
			if (!binding.identity && current && (admittedCache || admittedFile)) binding.identity = current;
			if (!binding.identity && opening && execution && !execution.fileIdentity) {
				execution.assertCurrent();
				return;
			}
			if (binding.identity ? !current || current.dev !== binding.identity.dev || current.ino !== binding.identity.ino : current !== void 0) throw new Error("Usage database changed during worker operation");
		};
		const assertCurrent = (admittedDatabase, execution, opening) => {
			incognito?.assertCurrent();
			scope.assertCurrent();
			signal?.throwIfAborted();
			if (incognito) return;
			for (const binding of bindings) if (binding !== cacheBinding) assertBindingCurrent(binding);
			assertBindingCurrent(cacheBinding, admittedDatabase, execution, opening);
		};
		const resolveBinding = (target) => {
			const options = toDatabaseOptions(resolveSqliteReadScope({
				...target,
				env: location.env
			}));
			const databasePath = resolveOpenClawAgentSqlitePath(options);
			const binding = bindings.find((entry) => entry.options.agentId === options.agentId && entry.options.path === databasePath);
			if (!binding) throw new Error("Usage worker requested an unowned transcript database");
			return binding;
		};
		const memoryBinding = (target) => {
			const binding = resolveBinding(target);
			if (!binding.memory) throw new Error("Usage worker requested an unowned memory database");
			return binding;
		};
		const sources = /* @__PURE__ */ new Map();
		const pruneRows = [];
		scope.retainCleanup(async () => {
			for (const source of sources.values()) source.clear();
			sources.clear();
			pruneRows.length = 0;
		});
		const hostLock = capturedOperation.kind === "refresh" && !incognito ? prepareSessionCostUsageRefreshLock(location.agentId, location.databasePath, {
			env: location.env,
			assertCurrent
		}) : void 0;
		if (hostLock) scope.retainCleanup(hostLock.release);
		const lock = capturedOperation.kind === "refresh" ? incognito?.lock ?? hostLock : void 0;
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
			const failureEntries = lock && !incognito ? await failures.entries().catch((error) => {
				logger$1.warn("Could not read usage refresh failure history", { error });
				return [];
			}) : [];
			const failedKeys = new Set(failureEntries.map((entry) => entry.key));
			const result = await scope.run({
				kind: "usage-cost",
				location,
				operation: workerOperation,
				databases: [],
				transcriptFiles: incognito ? [incognito.filePath] : void 0
			}, {
				signal,
				beforeDispatch: assertCurrent,
				inputBytes: 2 * JSON.stringify({
					location,
					operation: workerOperation
				}).length,
				timeoutMs: USAGE_COST_WORKER_TIMEOUT_MS,
				onRequest: async (value, context) => {
					const transferList = [];
					let reply;
					try {
						const assertRequestCurrent = () => {
							assertCurrent();
							context.signal.throwIfAborted();
						};
						assertRequestCurrent();
						if (!isRecord(value) || typeof value.kind !== "string") throw new Error("Invalid usage worker host request");
						const request = value;
						if (incognito && request.kind.startsWith("memory-")) {
							const output = await incognito.read(request, context.signal);
							assertRequestCurrent();
							return {
								input: {
									ok: true,
									value: output
								},
								transferList,
								timeoutMs: USAGE_COST_WORKER_TIMEOUT_MS
							};
						}
						let output;
						switch (request.kind) {
							case "refresh-session":
								if (!lock) throw new Error("Usage report cannot refresh sessions");
								activeSessionFile = request.input.sessionFile;
								output = void 0;
								break;
							case "pricing":
								output = request.input.map(resolveCost);
								break;
							case "restore": {
								if (incognito) throw new Error("Incognito transcripts have no cold storage");
								const binding = resolveBinding(request.input);
								await restoreSessionColdTranscript({
									...request.input,
									storePath: binding.options.path,
									env: location.env
								}, assertRequestCurrent, void 0, void 0, context.signal);
								output = void 0;
								break;
							}
							case "memory-instances": {
								const binding = memoryBinding(request.input);
								output = binding.database ? listSessionTranscriptInstances({
									...request.input,
									storePath: binding.options.path,
									env: location.env,
									projection: "list"
								}).map(({ agentId, sessionId, updatedAtMs }) => ({
									agentId,
									sessionId,
									updatedAtMs
								})) : [];
								break;
							}
							case "memory-stats":
								output = request.input.map((marker) => {
									const binding = memoryBinding(marker);
									return binding.database ? readTranscriptStatsBatchFromDatabase(binding.database, [marker.sessionId])[0] : void 0;
								});
								break;
							case "memory-cache": {
								const binding = memoryBinding({
									agentId: location.agentId,
									storePath: location.databasePath
								});
								output = binding.database ? readSessionCostUsageRollupByteRowsInDatabase(binding.database.db, request.input.filePaths) : [];
								for (const row of output) {
									if (!(row.valueJson.buffer instanceof ArrayBuffer)) throw new TypeError("Usage cache row bytes are not transferable");
									transferList.push(row.valueJson.buffer);
								}
								break;
							}
							case "memory-transcript": {
								await setImmediate(void 0, { signal: context.signal });
								assertRequestCurrent();
								const binding = memoryBinding(request.input.marker);
								if (!binding.database) throw new Error("Usage memory transcript is no longer available");
								const key = JSON.stringify(request.input);
								let source = sources.get(key);
								if (!source) {
									source = createMemoryTranscriptProjectionSource(binding.database, binding.options, request.input);
									sources.set(key, source);
								}
								const frame = source.read(request.input.marker.sessionId);
								output = frame;
								if (frame.type === "source-frame") transferList.push(frame.bytes.buffer);
								break;
							}
							case "memory-cache-body": {
								const binding = memoryBinding({
									agentId: location.agentId,
									storePath: location.databasePath
								});
								const row = binding.database ? readSessionCostUsageRollupBodyInDatabase(binding.database.db, request.input) : void 0;
								const blob = row?.blob ? Uint8Array.from(row.blob) : null;
								output = row ? { blob } : void 0;
								if (blob) transferList.push(blob.buffer);
								break;
							}
							case "prune-row":
								if (!lock) throw new Error("Usage report cannot prune cache rows");
								pruneRows.push({
									key: request.input.key,
									valueJson: request.input.value,
									updatedAt: request.input.updatedAt
								});
								output = void 0;
								break;
							case "prune":
								if (!lock) throw new Error("Usage report cannot prune cache rows");
								await lock.pruneRows(pruneRows, context.signal);
								pruneRows.length = 0;
								output = void 0;
								break;
							case "write":
								if (!lock) throw new Error("Usage report cannot write cache rows");
								output = await lock.writeRollup({
									rollupId: request.input.key,
									previousValueJson: request.input.previousValue,
									valueJson: request.input.value,
									blob: request.input.blob,
									updatedAt: request.input.updatedAt
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
						transferList,
						timeoutMs: USAGE_COST_WORKER_TIMEOUT_MS
					};
				}
			});
			assertCurrent();
			return result;
		} catch (error) {
			let failure = restoreWorkerFailure(error, hostErrors);
			if (activeSessionFile && !signal?.aborted && !incognito) try {
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
	const agentId = normalizeAgentId(params.agentId);
	try {
		const result = await runUsageCostWorker(prepareUsageCostWorker(params), {
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
		return "refreshed";
	} catch (error) {
		if (!getAsyncWorkSignal()?.aborted) publishSessionCostUsageUpdated(agentId, true);
		throw error;
	}
}
//#endregion
//#region src/infra/session-cost-usage-cache-runtime.ts
const USAGE_COST_REFRESH_RETRY_MIN_MS = 50;
const USAGE_COST_REFRESH_RETRY_MAX_MS = 5e3;
const logger = createSubsystemLogger("usage-cost-cache");
const usageCostRefreshes = /* @__PURE__ */ new Map();
function isUsageCostRefreshQueued(databasePath) {
	return usageCostRefreshes.get(getAsyncWorkSignal())?.has(databasePath) === true;
}
async function readCostUsageSummaryFromWorker(prepared, params) {
	const result = await runUsageCostWorker(prepared, {
		...params,
		kind: "summary",
		dayBucket: resolveUsageCostWorkerDayBucket(params.dayBucket)
	});
	if (result.kind !== "summary" || !result.summary.cacheStatus) throw new Error("Usage worker returned an invalid aggregate summary");
	return {
		summary: result.summary,
		cacheStatus: result.summary.cacheStatus,
		invalidRows: result.invalidRows
	};
}
async function loadCostUsageSummary(params) {
	const now = Date.now();
	const defaultStart = new Date(now);
	defaultStart.setDate(defaultStart.getDate() - 29);
	const startMs = params.startMs ?? defaultStart.getTime();
	const endMs = params.endMs ?? now;
	const prepared = prepareUsageCostWorker(params);
	const { databasePath, storePath } = prepared.location;
	const result = await refreshCostUsageCacheForAgent({
		config: params.config,
		agentId: params.agentId,
		agentDir: prepared.agentDir,
		databasePath,
		storePath
	});
	const { summary, cacheStatus, invalidRows } = await readCostUsageSummaryFromWorker(prepared, {
		pricingFingerprint: await resolveUsageCostPricingFingerprint(prepared.config, prepared.agentDir),
		startMs,
		endMs,
		dayBucket: params.dayBucket
	});
	if (invalidRows.length > 0) requestCostUsageCacheRefresh({
		config: params.config,
		agentId: params.agentId,
		storePath,
		rebuildRows: invalidRows
	});
	if (result === "busy" || isUsageCostRefreshQueued(databasePath) || await isSessionCostUsageRefreshRunning(params.agentId, databasePath)) cacheStatus.status = "refreshing";
	summary.updatedAt = Date.now();
	return summary;
}
async function loadCostUsageSummaryFromCache(params) {
	const prepared = prepareUsageCostWorker(params);
	const { databasePath, storePath } = prepared.location;
	const request = {
		pricingFingerprint: await resolveUsageCostPricingFingerprint(prepared.config, prepared.agentDir),
		startMs: params.startMs,
		endMs: params.endMs,
		dayBucket: params.dayBucket
	};
	let snapshot = await readCostUsageSummaryFromWorker(prepared, request);
	if (params.requestRefresh !== false && snapshot.cacheStatus.staleFiles > 0) {
		if (params.refreshMode === "sync-when-empty" && snapshot.cacheStatus.cachedFiles === 0) {
			const result = await refreshCostUsageCacheForAgent({
				config: params.config,
				agentId: params.agentId,
				agentDir: prepared.agentDir,
				storePath,
				startMs: params.startMs,
				rebuildRows: snapshot.invalidRows
			});
			snapshot = await readCostUsageSummaryFromWorker(prepared, request);
			if (result === "refreshed" && snapshot.cacheStatus.staleFiles > 0) requestCostUsageCacheRefresh({
				config: params.config,
				agentId: params.agentId,
				storePath,
				rebuildRows: snapshot.invalidRows
			});
		} else requestCostUsageCacheRefresh({
			config: params.config,
			agentId: params.agentId,
			storePath,
			rebuildRows: snapshot.invalidRows
		});
	}
	if (isUsageCostRefreshQueued(databasePath) || await isSessionCostUsageRefreshRunning(params.agentId, databasePath)) snapshot.cacheStatus.status = "refreshing";
	snapshot.summary.updatedAt = Date.now();
	return snapshot.summary;
}
async function loadSessionCostSummariesFromCache(params) {
	const prepared = prepareUsageCostWorker({
		...params,
		sessionFiles: params.sessions.map((session) => session.sessionFile)
	});
	const { databasePath, storePath } = prepared.location;
	const result = await runUsageCostWorker(prepared, {
		kind: "sessions",
		pricingFingerprint: await resolveUsageCostPricingFingerprint(prepared.config, prepared.agentDir),
		sessions: params.sessions,
		startMs: params.startMs,
		endMs: params.endMs,
		includeUntimestamped: params.includeUntimestamped,
		dayBucket: resolveUsageCostWorkerDayBucket(params.dayBucket)
	});
	if (result.kind !== "sessions") throw new Error("Usage worker returned an invalid session summary");
	const { summaries, cacheStatus, staleSessionFiles } = result;
	const refreshRequested = params.requestRefresh !== false && staleSessionFiles.length > 0;
	if (refreshRequested) requestCostUsageCacheRefresh({
		config: params.config,
		agentId: params.agentId,
		storePath,
		sessionFiles: staleSessionFiles,
		rebuildRows: result.invalidRows
	});
	const refreshRunning = await isSessionCostUsageRefreshRunning(params.agentId, databasePath);
	if (staleSessionFiles.length > 0 && (refreshRunning || refreshRequested)) {
		cacheStatus.status = "refreshing";
		for (const summary of summaries) if (summary?.staleSince !== void 0) summary.refreshing = true;
	}
	return {
		summaries,
		cacheStatus
	};
}
function requestCostUsageCacheRefresh(params) {
	const scopeSignal = getAsyncWorkSignal();
	if (scopeSignal?.aborted) return;
	const databasePath = resolveOpenClawAgentSqlitePath({ agentId: normalizeAgentId(params.agentId) });
	const refreshes = usageCostRefreshes.get(scopeSignal) ?? /* @__PURE__ */ new Map();
	const existing = refreshes.get(databasePath);
	if (existing) {
		mergeUsageCostRefreshRequest(existing, params);
		return;
	}
	const state = {
		agentId: params.agentId,
		config: params.config,
		databasePath,
		fullRefreshRequested: false,
		pendingSessionFiles: /* @__PURE__ */ new Set(),
		pendingRebuildRows: /* @__PURE__ */ new Map(),
		storePath: params.storePath
	};
	mergeUsageCostRefreshRequest(state, params);
	usageCostRefreshes.set(scopeSignal, refreshes);
	refreshes.set(databasePath, state);
	trackAsyncWork(() => runQueuedUsageCostRefresh(state, refreshes, scopeSignal));
}
function mergeUsageCostRefreshRequest(state, params) {
	state.config = params.config ?? state.config;
	state.agentId = params.agentId;
	state.storePath = params.storePath;
	for (const row of params.rebuildRows ?? []) state.pendingRebuildRows.set(row.key, row);
	if (!params.sessionFiles) {
		state.fullRefreshRequested = true;
		return;
	}
	for (const sessionFile of params.sessionFiles) state.pendingSessionFiles.add(sessionFile);
}
function waitForUsageCostRefresh(signal, delayMs) {
	return new Promise((resolve) => {
		const timer = setTimeout(finish, delayMs);
		timer.unref?.();
		function finish() {
			clearTimeout(timer);
			signal?.removeEventListener("abort", finish);
			resolve();
		}
		signal?.addEventListener("abort", finish, { once: true });
		if (signal?.aborted) finish();
	});
}
async function runQueuedUsageCostRefresh(state, refreshes, signal) {
	let busyRetryDelayMs = USAGE_COST_REFRESH_RETRY_MIN_MS;
	let retryDelayMs = 0;
	try {
		do {
			await waitForUsageCostRefresh(signal, retryDelayMs);
			if (signal?.aborted) return;
			retryDelayMs = 0;
			try {
				while (state.fullRefreshRequested || state.pendingSessionFiles.size > 0) {
					const fullRefreshRequested = state.fullRefreshRequested;
					const sessionFiles = fullRefreshRequested ? [] : [...state.pendingSessionFiles];
					const rebuildRows = [...state.pendingRebuildRows.values()];
					state.pendingRebuildRows.clear();
					if (!fullRefreshRequested) state.pendingSessionFiles.clear();
					state.fullRefreshRequested = false;
					const result = await refreshCostUsageCacheForAgent({
						config: state.config,
						agentId: state.agentId,
						databasePath: state.databasePath,
						storePath: state.storePath,
						sessionFiles: fullRefreshRequested ? void 0 : sessionFiles,
						rebuildRows
					});
					if (signal?.aborted) return;
					if (result === "busy") {
						for (const row of rebuildRows) if (!state.pendingRebuildRows.has(row.key)) state.pendingRebuildRows.set(row.key, row);
						if (fullRefreshRequested) state.fullRefreshRequested = true;
						else for (const sessionFile of sessionFiles) state.pendingSessionFiles.add(sessionFile);
						retryDelayMs = busyRetryDelayMs;
						busyRetryDelayMs = Math.min(busyRetryDelayMs * 2, USAGE_COST_REFRESH_RETRY_MAX_MS);
						break;
					}
					busyRetryDelayMs = USAGE_COST_REFRESH_RETRY_MIN_MS;
				}
			} catch (error) {
				logger.warn(`background refresh failed: ${formatErrorMessage(error)}`, { error });
				if (signal?.aborted) return;
			}
		} while (state.fullRefreshRequested || state.pendingSessionFiles.size > 0);
	} finally {
		refreshes.delete(state.databasePath);
		if (refreshes.size === 0) usageCostRefreshes.delete(signal);
	}
}
//#endregion
//#region src/infra/session-cost-usage-reporting.ts
const USAGE_COST_DIRECT_REFRESH_RETRY_MS = 25;
async function discoverAllSessions(params) {
	const result = await runUsageCostWorker(prepareUsageCostWorker(params), {
		kind: "inventory",
		minMtimeMs: params.startMs
	});
	if (result.kind !== "inventory") throw new Error("Usage worker returned an invalid session inventory");
	const discovered = /* @__PURE__ */ new Map();
	for (const file of result.files) {
		const { sourcePath: sessionFile, sessionId } = file;
		if (!sessionId) continue;
		const isPrimaryTranscript = file.kind === "sqlite" || isPrimarySessionTranscriptFileName(path.basename(sessionFile));
		const existing = discovered.get(sessionId);
		const existingIsPrimary = existing ? isPrimarySessionTranscriptFileName(path.basename(existing.sessionFile)) : false;
		if (!existing || isPrimaryTranscript && !existingIsPrimary || isPrimaryTranscript === existingIsPrimary && file.mtimeMs >= existing.mtime) discovered.set(sessionId, {
			sessionId,
			sessionFile,
			mtime: file.mtimeMs
		});
	}
	return Array.from(discovered.values()).toSorted((a, b) => b.mtime - a.mtime);
}
async function loadSessionCostSummary(params) {
	const source = await resolveUsageSessionSource(params);
	if (!source) return null;
	const { sessionFile } = source;
	const prepared = prepareUsageCostWorker({
		...params,
		sessionFiles: [sessionFile]
	});
	const inventory = await runUsageCostWorker(prepared, {
		kind: "inventory",
		sessionFiles: [sessionFile]
	});
	if (inventory.kind !== "inventory") throw new Error("Usage worker returned an invalid session inventory");
	if (inventory.files.length === 0) return null;
	while (await refreshCostUsageCacheForAgent({
		config: params.config,
		agentId: params.agentId,
		agentDir: prepared.agentDir,
		databasePath: prepared.location.databasePath,
		sessionFiles: [sessionFile]
	}) === "busy") await new Promise((resolve) => {
		setTimeout(resolve, USAGE_COST_DIRECT_REFRESH_RETRY_MS);
	});
	const result = await runUsageCostWorker(prepared, {
		kind: "sessions",
		pricingFingerprint: await resolveUsageCostPricingFingerprint(prepared.config, prepared.agentDir),
		sessions: [{
			sessionId: params.sessionId,
			sessionFile
		}],
		startMs: params.startMs,
		endMs: params.endMs,
		includeUntimestamped: params.includeUntimestamped,
		dayBucket: resolveUsageCostWorkerDayBucket(params.dayBucket)
	});
	if (result.kind !== "sessions") throw new Error("Usage worker returned an invalid session summary");
	return result.summaries[0] ?? null;
}
async function loadSessionUsageTimeSeries(params) {
	const source = await resolveUsageSessionSource(params);
	if (!source) return null;
	const { sessionFile } = source;
	if (!parseSqliteSessionFileMarker(sessionFile) && !fs.existsSync(sessionFile)) return null;
	if (params.maxPoints !== void 0 && params.maxPoints !== null) {
		if (!Number.isFinite(params.maxPoints) || params.maxPoints <= 0) return {
			sessionId: params.sessionId,
			points: []
		};
	}
	let points = [];
	const agentDir = resolveAgentDir(params.config ?? {}, params.agentId);
	const resolveCost = createUsageCostResolver({
		config: params.config,
		agentDir
	});
	for await (const record of readTranscriptRecords(sessionFile)) {
		const entry = await parseUsageCostTranscriptEntryAsync(record, resolveCost, params.config);
		const timestamp = entry?.timestamp?.getTime();
		if (!entry?.usage || !timestamp) continue;
		const { input, output, cacheRead, cacheWrite, totalTokens } = computeUsageTokenTotals(entry.usage);
		points.push({
			timestamp,
			input,
			output,
			cacheRead,
			cacheWrite,
			totalTokens,
			cost: entry.costTotal ?? 0
		});
	}
	points.sort((a, b) => a.timestamp - b.timestamp);
	const maxPoints = params.maxPoints ?? 100;
	if (points.length > maxPoints) {
		const step = Math.ceil(points.length / maxPoints);
		const downsampled = [];
		let bucket;
		let bucketSize = 0;
		for (const point of points) {
			if (!bucket || bucketSize === step) {
				bucket = {
					timestamp: point.timestamp,
					input: 0,
					output: 0,
					cacheRead: 0,
					cacheWrite: 0,
					totalTokens: 0,
					cost: 0
				};
				downsampled.push(bucket);
				bucketSize = 0;
			}
			bucket.timestamp = point.timestamp;
			bucket.input += point.input;
			bucket.output += point.output;
			bucket.cacheRead += point.cacheRead;
			bucket.cacheWrite += point.cacheWrite;
			bucket.totalTokens += point.totalTokens;
			bucket.cost += point.cost;
			bucketSize += 1;
		}
		points = downsampled;
	}
	let cumulativeTokens = 0;
	let cumulativeCost = 0;
	return {
		sessionId: params.sessionId,
		points: points.map((point) => {
			cumulativeTokens += point.totalTokens;
			cumulativeCost += point.cost;
			return Object.assign(point, {
				cumulativeTokens,
				cumulativeCost
			});
		})
	};
}
async function loadSessionLogs(params) {
	const source = await resolveUsageSessionSource(params);
	if (!source) return null;
	const { sessionFile } = source;
	if (!parseSqliteSessionFileMarker(sessionFile) && !fs.existsSync(sessionFile)) return null;
	const logs = [];
	if (params.limit !== void 0 && params.limit !== null) {
		if (!Number.isFinite(params.limit) || params.limit <= 0) return [];
	}
	const limit = params.limit ?? 50;
	const boundedLimit = Number.isInteger(limit);
	const retentionLimit = limit * 2;
	const agentDir = resolveAgentDir(params.config ?? {}, params.agentId);
	const resolveCost = createUsageCostResolver({
		config: params.config,
		agentDir
	});
	for await (const parsed of readTranscriptRecordsBestEffort(sessionFile)) {
		let role;
		let content;
		try {
			const message = parsed.message;
			if (!message) continue;
			const recordRole = message.role;
			if (recordRole !== "user" && recordRole !== "assistant" && recordRole !== "tool" && recordRole !== "toolResult") continue;
			role = recordRole;
			const contentParts = [];
			const rawToolName = message.toolName ?? message.tool_name ?? message.name ?? message.tool;
			const toolName = normalizeOptionalString(rawToolName);
			if (role === "tool" || role === "toolResult") {
				contentParts.push(`[Tool: ${toolName ?? "tool"}]`);
				contentParts.push("[Tool Result]");
			}
			const rawContent = message.content;
			if (typeof rawContent === "string") contentParts.push(rawContent);
			else if (Array.isArray(rawContent)) {
				const contentText = rawContent.map((block) => {
					if (typeof block === "string") return block;
					const b = block;
					if (b.type === "text" && typeof b.text === "string") return b.text;
					if (isToolCallContentType(normalizeOptionalString(b.type))) return `[Tool: ${typeof b.name === "string" ? b.name : "unknown"}]`;
					if (b.type === "tool_result") return "[Tool Result]";
					return "";
				}).filter(Boolean).join("\n");
				if (contentText) contentParts.push(contentText);
			}
			const rawToolCalls = message.tool_calls ?? message.toolCalls ?? message.function_call ?? message.functionCall;
			const toolCalls = Array.isArray(rawToolCalls) ? rawToolCalls : rawToolCalls ? [rawToolCalls] : [];
			for (const call of toolCalls) {
				const callObj = call;
				const directName = typeof callObj.name === "string" ? callObj.name : void 0;
				const fn = callObj.function;
				const fnName = typeof fn?.name === "string" ? fn.name : void 0;
				const name = directName ?? fnName ?? "unknown";
				contentParts.push(`[Tool: ${name}]`);
			}
			const rawText = contentParts.join("\n");
			content = role === "user" ? stripUserEnvelopeForDisplay(rawText).trim() : stripInboundMetadata(rawText.trim());
			if (!content) continue;
			const maxLen = 2e3;
			if (content.length > maxLen) content = truncateUtf16Safe(content, maxLen) + "…";
		} catch {
			continue;
		}
		const entry = await parseUsageCostTranscriptEntryAsync(parsed, resolveCost, params.config);
		const usage = role === "assistant" ? entry?.usage : void 0;
		logs.push({
			timestamp: entry?.timestamp?.getTime() ?? 0,
			role,
			content,
			tokens: usage ? computeUsageTokenTotals(usage).totalTokens : void 0,
			cost: usage ? entry?.costTotal : void 0
		});
		if (boundedLimit && logs.length > retentionLimit) {
			logs.sort((a, b) => a.timestamp - b.timestamp);
			logs.splice(0, logs.length - limit);
		}
	}
	logs.sort((a, b) => a.timestamp - b.timestamp);
	return logs.length > limit ? logs.slice(-limit) : logs;
}
//#endregion
export { loadCostUsageSummary as a, loadSessionUsageTimeSeries as i, loadSessionCostSummary as n, loadCostUsageSummaryFromCache as o, loadSessionLogs as r, loadSessionCostSummariesFromCache as s, discoverAllSessions as t };
