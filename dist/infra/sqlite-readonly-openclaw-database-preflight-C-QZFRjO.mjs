import { P as resolveUserPath, mt as sanitizeForLog, ot as toStringifiedError, pt as resolveGlobalSingleton, t as createSubsystemLogger, y as resolveStateDir } from "./sqlite-readonly-subsystem-DxzYbxOQ.mjs";
import { $ as isValidAgentId, G as normalizeOpenClawStateSchemaReadError, Q as resolveOpenClawAgentSqlitePath, X as isSameOpenClawAgentDatabasePath, Y as isPersistentOpenClawAgentDatabasePath, _ as sqliteInspectionTimeoutError, d as isSqliteInspectionDeadlineOwnedByCaller, et as normalizeAgentId, f as readSqliteInspectionBudget, n as hydrateOpenClawStateWorkerError, p as resolveSqliteInspectionSignal, q as createOpenClawAgentDatabasePathMatcher, r as retainOpenClawStateWorkerErrorPayload, v as withSqliteReadOnlyWorkerScope } from "./sqlite-readonly-sqlite-snapshot-staging-owner-DzwQ_rDP.mjs";
import { $ as OPENCLAW_STATE_MAINTENANCE_SCHEMA_COMPATIBILITY, B as readRetainedAgentDeletionsFromDatabase, Ct as formatCliCommand, H as resolveOpenClawAgentDatabaseDiscoveryPaths, O as agentDatabaseValidationKey, Q as openClawStateMigrationAssertions, R as readAgentDatabaseDeletionSnapshot, U as listConfiguredSessionStoreAgentIds, X as assertOpenClawStateDatabaseForMaintenance, Z as assertOpenClawStateDatabaseOwner, _ as canIsolateAgentDatabase, at as readAgentDatabasePreflightTargets, b as createAgentDatabaseInspectionRefusal, ct as adoptSqliteSchemaContracts, dt as createSqliteTableContractReader, et as STATE_RUNTIME_SCHEMA_COMPATIBILITY, ft as getCanonicalSqliteTableNames, g as restoreNativeErrorResponse, it as readStateSchemaPublicationBlocker, lt as captureSqliteSchemaContracts, nt as isOpenClawStateStartupRepairableSchemaIssue, q as getActiveOpenClawStateDatabaseReadSnapshot, rt as inspectOpenClawStateOwnershipFromDatabase, st as assertCanonicalStateSchemaShape, tt as isOpenClawStateFirstUseSchemaIssue, ut as collectSqliteSchemaIssues, vt as resolveUnsuffixedSqliteTargetFromSessionStorePath, x as inspectAgentDatabaseAdmission, z as readAgentDeletionRecoveryHoldsInWorker } from "./sqlite-readonly-openclaw-agent-db-DnbjFHbu.mjs";
import "./sqlite-readonly-worker-task-pool-CUbFmrb9.mjs";
import { dt as isPathInside, lt as hasNodeErrorCode, n as createRetryRunner, o as toRetryError } from "./sqlite-readonly-runtime-process-manifest-B1faCUt1.mjs";
import { Ft as OPENCLAW_STATE_SCHEMA_SQL, Ht as createDeferredCore, It as OPENCLAW_AGENT_SCHEMA_SQL, On as throwSqliteLifecycleErrors, Y as clearNodeSqliteKyselyCacheForDatabase, _t as readSqliteDatabaseCleanClose, at as getOrLoadSqliteDatabaseAdmissionForPath, pt as prepareSqliteDatabaseAdmission, s as openNodeSqliteDatabase, u as resolveImmutableSqliteFileUri } from "./sqlite-readonly-sqlite-busy-timeout-CPLgQzS6.mjs";
import { I as assertSqliteIntegrity, K as getStateRuntimeSchemaAdmission, S as _usingCtx, W as readStateSchemaContentVersion } from "./sqlite-readonly-openclaw-state-db-cache-CRy98JJU.mjs";
import "./sqlite-readonly-schemas-CYdKD5YK.mjs";
import { t as formatErrorMessage } from "./sqlite-readonly-errors-CyzrIIqN.mjs";
import { d as SQLITE_SIDECAR_SUFFIXES, n as prepareSqliteReadOnlyLocation, p as resolveSqliteDatabaseFilePaths } from "./sqlite-readonly-sqlite-snapshot-source-CcYaV2mA.mjs";
import { A as resolveRuntimeProcessEntrypointUrl, Bn as withArtifactPreservingStateReads, Dt as SqliteSchemaVersionError, Ft as runSqliteDeferredTransactionSync, Gt as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, Kt as agentSchemaMetadataKey, Wt as OPENCLAW_DATABASE_SCHEMA_DOCS_URL, bn as deferSqliteSnapshotCleanupAfterRead, et as resolveOpenClawStateSqlitePath, j as resolveRuntimeWorkerArgv, jt as readSqliteUserVersion, kt as describeRunningOpenClawBuild, pt as readSqliteWriterAppVersion, tn as SqliteSchemaMismatchError, vn as SqliteSnapshotCleanupError, zn as isArtifactPreservingStateRead } from "./sqlite-readonly-location.worker.js";
import { r as readSqliteIntegrityFileIdentity } from "./sqlite-readonly-sqlite-file-generation-B2tri0d6.mjs";
import { n as resolveConfiguredAgentDatabaseCandidatePaths, t as isConfiguredAgentDatabaseTarget } from "./sqlite-readonly-targets-BpdpdqZe.mjs";
import "./sqlite-readonly-openclaw-agent-execution-ChldG4wv.mjs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import fs, { realpathSync, statSync } from "node:fs";
import "node:fs/promises";
import { availableParallelism } from "node:os";
import { AsyncLocalStorage } from "node:async_hooks";
import { fork } from "node:child_process";
//#region src/agents/session-dirs.ts
function mapAgentSessionDirs(agentsDir, entries, includeDirName) {
	return entries.filter((entry) => entry.isDirectory() && (includeDirName?.(entry.name) ?? true)).map((entry) => path.join(agentsDir, entry.name, "sessions")).toSorted((a, b) => a.localeCompare(b));
}
function resolveAgentSessionDirsFromAgentsDirSync(agentsDir, includeDirName) {
	let entries;
	try {
		entries = fs.readdirSync(agentsDir, { withFileTypes: true });
	} catch (err) {
		if (err.code === "ENOENT") return [];
		throw err;
	}
	return mapAgentSessionDirs(agentsDir, entries, includeDirName);
}
//#endregion
//#region src/infra/retry-attempt-errors.ts
const retryAttemptErrors = /* @__PURE__ */ new WeakMap();
function recordRetryAttemptErrors(error, attemptErrors) {
	retryAttemptErrors.set(error, [...attemptErrors]);
}
function getRetryAttemptErrors(err) {
	return err !== null && (typeof err === "object" || typeof err === "function") ? retryAttemptErrors.get(err) : void 0;
}
//#endregion
//#region src/infra/secure-random.ts
/** Returns a cryptographically secure fraction in the range [0, 1). */
function generateSecureFraction() {
	return randomBytes(4).readUInt32BE(0) / 4294967296;
}
//#endregion
//#region src/infra/retry.ts
function createRetryFailure(rawAttemptErrors) {
	const attemptErrors = rawAttemptErrors.flatMap((err) => getRetryAttemptErrors(err) ?? [err]);
	const failure = toRetryError(attemptErrors.at(-1) ?? /* @__PURE__ */ new Error("Retry failed"), "Non-Error thrown");
	if (attemptErrors.length > 1) recordRetryAttemptErrors(failure, attemptErrors);
	return failure;
}
createRetryRunner({
	random: generateSecureFraction,
	createFailure: createRetryFailure
});
new AsyncLocalStorage();
createSubsystemLogger("state/agent-admission");
const startupAdmission = new AsyncLocalStorage();
function getAgentDatabaseStartupAdmission() {
	const scope = startupAdmission.getStore();
	return scope?.isStopped ? void 0 : scope;
}
//#endregion
//#region src/state/openclaw-agent-schema-inspection-response.ts
function restoreAgentSchemaInspectionError(value) {
	const error = restoreNativeErrorResponse(value);
	if (value.stateError) retainOpenClawStateWorkerErrorPayload(error, value.stateError);
	const restored = hydrateOpenClawStateWorkerError(error);
	restored.message = value.message;
	return restored;
}
//#endregion
//#region src/state/openclaw-agent-schema-inspection-worker.ts
function retireReader(reader) {
	if (reader.retired) return;
	reader.retired = true;
	if (reader.child.connected) reader.child.send({ type: "close" }, (error) => {
		if (error) reader.child.kill("SIGKILL");
	});
}
/** One scheduler slot reuses imports and canonical schema contracts, never database reads. */
function createAgentSchemaInspectionWorker() {
	let reader;
	let disposed = false;
	let busy = false;
	let processCount = 0;
	let inspectionCount = 0;
	let snapshotCount = 0;
	let sequence = 0;
	const startReader = (timeoutMs) => {
		const entry = resolveRuntimeProcessEntrypointUrl("agentSchemaInspection");
		const child = fork(entry, [], {
			execArgv: resolveRuntimeWorkerArgv(entry).slice(0, -1),
			serialization: "advanced",
			stdio: [
				"ignore",
				"ignore",
				"ignore",
				"ipc"
			]
		});
		processCount += 1;
		const closed = createDeferredCore();
		const started = {
			child,
			closed: closed.promise,
			retired: false,
			closeBudgetMs: timeoutMs
		};
		child.on("error", (error) => {
			started.failure ??= error;
			retireReader(started);
		});
		child.once("close", () => {
			started.retired = true;
			closed.resolve();
		});
		return started;
	};
	const operations = { inspect: async (request, callerSignal, snapshotPath) => {
		const { input, kind } = request;
		const signal = resolveSqliteInspectionSignal(callerSignal);
		signal?.throwIfAborted();
		if (disposed || busy) throw new Error(disposed ? "Agent schema inspection worker is closed" : "Agent schema inspection worker is busy");
		busy = true;
		try {
			if (kind !== "state" && !snapshotPath && input.requireStartupMigrationReadiness && readSqliteDatabaseCleanClose(input.pathname)) {
				const validation = getOrLoadSqliteDatabaseAdmissionForPath(input.pathname, agentDatabaseValidationKey, () => void 0);
				const metadata = getOrLoadSqliteDatabaseAdmissionForPath(input.pathname, agentSchemaMetadataKey, () => void 0);
				if (validation?.schema?.facts.userVersion === input.supportedVersion && Atomics.load(new Int32Array(validation.valid), 0) === 1 && Atomics.load(new Int32Array(validation.schema.valid), 0) === 1 && prepareSqliteDatabaseAdmission(input.pathname) === `${validation.identity}:${validation.birthtime}` && metadata?.agentId === validation.agentId && (input.agentId === void 0 || input.agentId === validation.agentId) && metadata.role === "agent" && metadata.schemaVersion === input.supportedVersion) return {
					version: input.supportedVersion,
					integrityGateOutcome: "cached",
					agentSchemaMeta: metadata
				};
			}
			if (kind === "agent" && input.requireStartupMigrationReadiness) getCanonicalSqliteTableNames(OPENCLAW_AGENT_SCHEMA_SQL);
			const snapshot = snapshotPath ? {
				pathname: snapshotPath,
				identity: readSqliteIntegrityFileIdentity(snapshotPath)
			} : void 0;
			if (reader?.retired) {
				await reader.closed;
				reader = void 0;
			}
			signal?.throwIfAborted();
			if (disposed) throw new Error("Agent schema inspection worker is closed");
			const { timeoutMs, size } = readSqliteInspectionBudget(input.requireStartupMigrationReadiness ? "startup readiness" : "schema inspection", input.pathname);
			const active = reader ??= startReader(timeoutMs);
			active.closeBudgetMs = timeoutMs;
			const requestId = ++sequence;
			const response = createDeferredCore();
			let failure;
			const kill = () => {
				active.retired = true;
				active.child.kill("SIGKILL");
			};
			const onAbort = () => {
				failure = toStringifiedError(signal?.reason);
				kill();
			};
			const onMessage = (message) => {
				if (failure) return;
				if (message.requestId !== requestId) {
					failure = /* @__PURE__ */ new Error("Invalid agent schema inspection response");
					kill();
				} else if (!message.ok) {
					failure = restoreAgentSchemaInspectionError(message.error);
					retireReader(active);
				} else {
					if (kind === "state") {
						const stateInspection = message.stateInspection;
						if (stateInspection === null) {
							response.resolve(null);
							return;
						}
						if (stateInspection === void 0) {
							failure = /* @__PURE__ */ new Error("Invalid state schema inspection response");
							kill();
							return;
						}
						response.resolve({
							...stateInspection,
							schemaContracts: message.schemaContracts,
							inspectionErrors: stateInspection.inspectionErrors.map(restoreAgentSchemaInspectionError)
						});
						return;
					}
					const inspection = message.inspection;
					response.resolve(inspection ? {
						...inspection,
						failure: inspection.failure ? restoreAgentSchemaInspectionError(inspection.failure) : void 0
					} : null);
				}
			};
			const onClose = (code, exitSignal) => {
				response.reject(signal?.aborted ? toStringifiedError(signal.reason) : failure ?? active.failure ?? (exitSignal === "SIGKILL" ? sqliteInspectionTimeoutError("schema inspection", input.pathname, timeoutMs, size) : /* @__PURE__ */ new Error(`Agent schema inspection exited ${code} without a completed result`)));
			};
			const timeout = isSqliteInspectionDeadlineOwnedByCaller() ? void 0 : setTimeout(() => {
				failure ??= sqliteInspectionTimeoutError("schema inspection", input.pathname, timeoutMs, size);
				kill();
			}, timeoutMs);
			timeout?.unref();
			active.child.on("message", onMessage);
			active.child.once("close", onClose);
			signal?.addEventListener("abort", onAbort, { once: true });
			try {
				active.child.send({
					type: kind === "state" ? "inspect-state" : "inspect",
					requestId,
					input: {
						...input,
						..."env" in input && input.env ? { env: { ...input.env } } : {}
					},
					snapshot
				}, (error) => {
					if (error) {
						failure ??= error;
						kill();
					}
				});
				const result = await response.promise;
				if (signal?.aborted) {
					kill();
					await active.closed;
					throw toStringifiedError(signal.reason);
				}
				if (snapshot) readSqliteIntegrityFileIdentity(snapshot.pathname, snapshot.identity);
				if (result) {
					inspectionCount += 1;
					snapshotCount += snapshot ? 1 : 0;
				}
				return result;
			} finally {
				clearTimeout(timeout);
				active.child.off("message", onMessage);
				active.child.off("close", onClose);
				signal?.removeEventListener("abort", onAbort);
			}
		} finally {
			busy = false;
		}
	} };
	return {
		get processCount() {
			return processCount;
		},
		get inspectionCount() {
			return inspectionCount;
		},
		get snapshotCount() {
			return snapshotCount;
		},
		inspect: async (input, callerSignal, snapshotPath) => {
			const result = await operations.inspect({
				kind: "agent",
				input
			}, callerSignal, snapshotPath);
			if (result && "schemas" in result) throw new Error("Unexpected state schema inspection result");
			return result;
		},
		inspectState: async (input, callerSignal, snapshotPath) => {
			const result = await operations.inspect({
				kind: "state",
				input
			}, callerSignal, snapshotPath);
			if (result && !("schemas" in result)) throw new Error("Unexpected agent schema inspection result");
			return result;
		},
		async [Symbol.asyncDispose]() {
			disposed = true;
			if (!reader) return;
			const closing = reader;
			const timeout = setTimeout(() => closing.child.kill("SIGKILL"), closing.closeBudgetMs);
			timeout.unref();
			try {
				retireReader(closing);
				await closing.closed;
			} finally {
				clearTimeout(timeout);
			}
		}
	};
}
//#endregion
//#region src/state/openclaw-database-preflight-agent-scheduler.ts
const AGENT_DATABASE_STARTUP_WAIT_MS = 5e3;
async function preflightAgentDatabasesBounded(targets, inspect, result, signal, startup) {
	const inspectedAgentPaths = /* @__PURE__ */ new Set();
	const inspectedAgentTargets = /* @__PURE__ */ new Set();
	const claimAgentTarget = (realPath, agentId) => {
		const inspectionKey = `${realPath}\0${agentId ?? ""}`;
		if (inspectedAgentTargets.has(inspectionKey) || agentId === void 0 && inspectedAgentPaths.has(realPath)) return false;
		inspectedAgentPaths.add(realPath);
		inspectedAgentTargets.add(inspectionKey);
		return true;
	};
	const inspections = [];
	const failures = /* @__PURE__ */ new Map();
	let nextInspectionIndex = 0;
	const readers = [];
	const foreground = createDeferredCore();
	const completions = targets.map(() => createDeferredCore());
	for (const completion of completions) completion.promise.catch(() => {});
	const deferred = /* @__PURE__ */ new Set();
	const concurrency = Math.min(2, availableParallelism(), targets.length);
	let deferredRefusals = [];
	const inspectionSignal = startup ? signal ? AbortSignal.any([startup.signal, signal]) : startup.signal : resolveSqliteInspectionSignal(signal);
	const deadlineOwnedByCaller = startup !== void 0 || isSqliteInspectionDeadlineOwnedByCaller();
	const settleForeground = () => {
		if (!startup || deferred.size === 0 || deferredRefusals.length > 0 || failures.size > 0) return;
		if (targets.some((_, index) => inspections[index] === void 0 && !deferred.has(index))) return;
		try {
			deferredRefusals = startup.defer([...deferred].map((index) => ({
				target: targets[index],
				result: completions[index].promise
			})), "Inspection and writable admission continue after the Gateway listener binds.");
			foreground.resolve();
		} catch (error) {
			foreground.reject(error);
		}
	};
	const worker = async () => {
		try {
			var _usingCtx$2 = _usingCtx();
			const reader = _usingCtx$2.a(createAgentSchemaInspectionWorker());
			readers.push(reader);
			while (true) {
				if (inspectionSignal?.aborted || failures.size > 0) return;
				const index = nextInspectionIndex;
				if (index >= targets.length) return;
				nextInspectionIndex += 1;
				const target = targets[index];
				if (target === void 0) continue;
				const inspection = {
					incompatible: [],
					indeterminate: []
				};
				try {
					const disposition = await inspect(target, inspection, claimAgentTarget, (input, requestSignal, snapshot) => reader.inspect(input, inspectionSignal ?? requestSignal, snapshot));
					inspections[index] = inspection;
					completions[index].resolve(inspection);
					if (disposition === "defer" && startup?.canDefer(target)) deferred.add(index);
				} catch (error) {
					failures.set(index, error);
					completions[index].reject(error);
					return;
				} finally {
					settleForeground();
				}
			}
		} catch (_) {
			_usingCtx$2.e = _;
		} finally {
			await _usingCtx$2.d();
		}
	};
	const completed = Promise.all(Array.from({ length: concurrency }, () => withSqliteReadOnlyWorkerScope(worker, {
		signal: inspectionSignal ?? new AbortController().signal,
		deadlineOwnedByCaller
	}))).finally(() => {
		for (let index = 0; index < targets.length; index += 1) if (inspections[index] === void 0) completions[index].reject(inspectionSignal?.reason ?? failures.values().next().value ?? /* @__PURE__ */ new Error("Inspection cancelled"));
	});
	startup?.track(completed);
	const timer = startup && setTimeout(() => {
		if (failures.size > 0 || inspectionSignal?.aborted) return;
		targets.forEach((target, index) => {
			if (inspections[index] === void 0 && startup.canDefer(target)) deferred.add(index);
		});
		settleForeground();
	}, AGENT_DATABASE_STARTUP_WAIT_MS);
	timer?.unref();
	try {
		await (startup ? Promise.race([completed, foreground.promise]) : completed);
	} finally {
		clearTimeout(timer);
	}
	for (let index = 0; index < targets.length; index += 1) if (failures.has(index) && (!deferred.has(index) || deferredRefusals.length === 0)) throw failures.get(index);
	inspectionSignal?.throwIfAborted();
	for (const [index, inspection] of inspections.entries()) {
		if (inspection === void 0 || deferred.has(index)) continue;
		result.incompatible.push(...inspection.incompatible);
		result.indeterminate.push(...inspection.indeterminate);
		if (inspection.agentRefusals?.length) (result.agentRefusals ??= []).push(...inspection.agentRefusals);
		if (inspection.pendingMigrations?.length) (result.pendingMigrations ??= []).push(...inspection.pendingMigrations);
	}
	if (deferredRefusals.length) (result.agentRefusals ??= []).push(...deferredRefusals);
	return {
		schemaProcessCount: readers.reduce((count, reader) => count + reader.processCount, 0),
		schemaInspectionCount: readers.reduce((count, reader) => count + reader.inspectionCount, 0),
		schemaSnapshotCount: readers.reduce((count, reader) => count + reader.snapshotCount, 0)
	};
}
//#endregion
//#region src/state/openclaw-database-preflight-cleanup.ts
/** Failed retirement keeps its existing snapshot owner and cannot admit more schemas. */
async function cleanupOpenClawStatePreflight(options) {
	const cleanupErrors = [];
	if (options.database) {
		try {
			options.closeAdmission?.();
		} catch (error) {
			cleanupErrors.push(error);
		}
		try {
			clearNodeSqliteKyselyCacheForDatabase(options.database);
			options.database.close();
		} catch (error) {
			cleanupErrors.push(error);
		}
	}
	try {
		if (options.snapshot && !await options.snapshot.cleanupAsync()) cleanupErrors.push(new SqliteSnapshotCleanupError(`SQLite read-only worker snapshot cleanup failed: ${options.snapshot.location}`));
	} catch (error) {
		if (options.inspectionErrors.length > 0 || cleanupErrors.length > 0 || !deferSqliteSnapshotCleanupAfterRead(error, options.snapshot?.cleanupRoot)) cleanupErrors.push(error);
	}
	if (cleanupErrors.length > 0) throwSqliteLifecycleErrors([...options.inspectionErrors, ...cleanupErrors], "State database schema inspection cleanup failed");
}
//#endregion
//#region src/state/agent-deletion-discovery.ts
/** Recorded surviving owners can share retained files; directory-name inference cannot. */
function createAgentDatabaseDeletionClassifier(params) {
	const artifactDirectories = params.artifactDirectories;
	const journal = params.retainedDeletions;
	const known = journal.status === "present" ? journal : journal.status === "unavailable" ? journal.known : void 0;
	const entries = known?.entries ?? [];
	const unknown = journal.status === "unavailable" ? "unavailable" : void 0;
	const samePath = createOpenClawAgentDatabasePathMatcher();
	const recorded = artifactDirectories ?? [...params.configuredAgentDatabaseTargets, ...params.registeredAgentDatabases];
	const heldPaths = !known ? [] : artifactDirectories ? known.held.flatMap((entry) => {
		const defaultDirectory = path.dirname(resolveOpenClawAgentSqlitePath({
			agentId: entry.agentId,
			env: params.env
		}));
		const recordedDirectory = path.dirname(entry.path);
		const canonicalAgentFile = path.basename(entry.path) === "openclaw-agent.sqlite";
		const directories = [{
			agentId: entry.agentId,
			path: defaultDirectory
		}, ...artifactDirectories.filter((directory) => normalizeAgentId(directory.agentId) === entry.agentId || canonicalAgentFile && samePath(directory.path, recordedDirectory))];
		if (canonicalAgentFile && [params.env.OPENCLAW_AGENT_DIR, params.env.PI_CODING_AGENT_DIR].some((directory) => directory?.trim() && samePath(resolveUserPath(directory, params.env), recordedDirectory)) || canonicalAgentFile && path.basename(recordedDirectory) === "agent" && samePath(path.dirname(path.dirname(recordedDirectory)), path.dirname(path.dirname(defaultDirectory)))) directories.push({
			agentId: entry.agentId,
			path: recordedDirectory
		});
		return directories;
	}) : known.held;
	return (pathname, agentId) => {
		let logicalTargets = [];
		if (!artifactDirectories && agentId !== void 0) {
			const ownerId = normalizeAgentId(agentId);
			logicalTargets = params.configuredAgentDatabaseTargets.filter((target) => normalizeAgentId(target.agentId) === ownerId);
			if (logicalTargets.length === 0) logicalTargets = [...params.registeredAgentDatabases.filter((target) => normalizeAgentId(target.agentId) === ownerId), {
				agentId: ownerId,
				path: resolveUnsuffixedSqliteTargetFromSessionStorePath(pathname).path
			}];
		}
		if (heldPaths.some((entry) => artifactDirectories && entry.agentId === agentId || samePath(entry.path, pathname) || logicalTargets.some((target) => samePath(target.path, entry.path)))) return "held";
		const deletion = entries.find((entry) => entry.agentId === agentId || (artifactDirectories ? [entry.agentDir] : entry.databasePaths).some((file) => samePath(file, pathname)));
		if (!deletion) return unknown;
		const surviving = recorded.some((target) => !entries.some((entry) => entry.agentId === normalizeAgentId(target.agentId)) && samePath(target.path, pathname) && (artifactDirectories !== void 0 || isPersistentOpenClawAgentDatabasePath(target.path, params.env) && (params.configuredAgentDatabaseTargets.includes(target) || isPathInside(fs.realpathSync.native(resolveStateDir(params.env)), fs.realpathSync.native(target.path)))));
		return agentId === deletion.agentId || !surviving ? deletion : unknown;
	};
}
[
	{
		directory: "logs",
		basename: "config-audit.jsonl"
	},
	{
		directory: "audit",
		basename: "system-agent.jsonl"
	},
	{
		directory: "audit",
		basename: "crestodian.jsonl"
	}
].map(({ directory, basename }) => {
	const escaped = basename.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
	return {
		directory,
		pattern: new RegExp(`^(?:${escaped}|\\.${escaped}\\.doctor-importing(?:\\.(?:[2-9]|[1-9][0-9]+))?|${escaped}\\.migrated(?:\\.(?:[2-9]|[1-9][0-9]+))?\\.raw(?:\\.doctor-scrub-(?:progress|restore|staging))?)$`, "u")
	};
});
//#endregion
//#region src/infra/backup-volatile-filter.ts
const SQLITE_MEMORY_TRANSIENT_PATH_PATTERN = /(?:^|\/)(?:[^/]+\.sqlite\.(?:generation-(?:lock|writer)|reindex-lock)\.sqlite|[^/]+\.sqlite\.(?:backup|memory-reindex|tmp)-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:-wal|-shm|-journal)?$/iu;
function normalizePosix(input) {
	if (!input) return input;
	return path.posix.normalize(input.replaceAll("\\", "/"));
}
function isTransientSqliteBackupPath(filePath) {
	const normalizedPath = normalizePosix(filePath);
	return SQLITE_MEMORY_TRANSIENT_PATH_PATTERN.test(normalizedPath);
}
//#endregion
//#region src/infra/state-migrations.media-persistence-targets.ts
/** Discover maintenance targets without mutating the registry or creating stores. */
function discoverAgentDatabaseMigrationTargets(params) {
	const warnings = [];
	const externalWarnings = [];
	const deletionJournal = params.deletionJournal ?? readAgentDatabaseDeletionSnapshot(params.env)?.retainedDeletions ?? {
		status: "unavailable",
		cause: "missing",
		reason: "shared state database missing"
	};
	const knownDeletions = deletionJournal.status === "present" ? deletionJournal : deletionJournal.status === "unavailable" ? deletionJournal.known : void 0;
	const retainedDeletions = knownDeletions?.entries ?? [];
	const classifyDeletion = createAgentDatabaseDeletionClassifier({
		...params,
		retainedDeletions: deletionJournal
	});
	const failures = [];
	const registryRemovals = [];
	const sourceIdentities = /* @__PURE__ */ new Map();
	const failure = (pathname, reason) => {
		warnings.push(reason);
		failures.push({
			path: pathname,
			reason
		});
	};
	const discard = (candidate, change) => {
		if (candidate.source === "registry" && deletionJournal.status !== "unavailable" && classifyDeletion(candidate.path) !== "held") registryRemovals.push({
			agentId: candidate.agentId,
			path: candidate.path,
			change
		});
	};
	const candidates = [
		...params.configuredAgentDatabaseTargets.map((target) => ({
			...target,
			source: "configured"
		})),
		...params.registeredAgentDatabases.map((entry) => ({
			...entry,
			source: "registry"
		})),
		...retainedDeletions.flatMap((entry) => {
			const recordedPaths = new Set(entry.databasePaths);
			return entry.databasePaths.filter((pathname) => !SQLITE_SIDECAR_SUFFIXES.some((suffix) => pathname.endsWith(suffix) && recordedPaths.has(pathname.slice(0, -suffix.length)))).map((pathname) => ({
				agentId: entry.agentId,
				path: pathname,
				source: "disk"
			}));
		}),
		...(knownDeletions?.held ?? []).map((target) => ({
			agentId: target.agentId,
			path: target.path,
			source: "deletion"
		}))
	];
	const activeStateDir = resolveStateDir(params.env);
	const agentsDir = path.join(activeStateDir, "agents");
	try {
		for (const sessionsDir of resolveAgentSessionDirsFromAgentsDirSync(agentsDir)) {
			const agentDir = path.dirname(sessionsDir);
			const databaseDir = path.join(agentDir, "agent");
			const agentId = normalizeAgentId(path.basename(agentDir));
			for (const pathname of resolveOpenClawAgentDatabaseDiscoveryPaths({
				agentDir: databaseDir,
				agentId,
				env: params.env
			})) candidates.push({
				agentId,
				path: pathname,
				source: "disk"
			});
		}
	} catch (error) {
		failure(agentsDir, `Could not enumerate agent databases under ${agentsDir}: ${String(error)}`);
	}
	let activeStateDirRealPath;
	try {
		activeStateDirRealPath = fs.realpathSync.native(activeStateDir);
	} catch (error) {
		if (!hasNodeErrorCode(error, "ENOENT")) failure(activeStateDir, `Could not resolve active state directory ${activeStateDir}: ${String(error)}`);
	}
	const configuredPathMatcher = createOpenClawAgentDatabasePathMatcher();
	const targets = [];
	const pendingDeletionTargets = [];
	const retainedTargets = [];
	const unverifiedTargets = [];
	const seenTargets = /* @__PURE__ */ new Set();
	for (const candidate of candidates) {
		const pathname = candidate.path;
		if (isTransientSqliteBackupPath(pathname)) continue;
		if (!isPersistentOpenClawAgentDatabasePath(pathname, params.env)) {
			discard(candidate, `Removed archived or transient agent database registry entry ${pathname}.`);
			continue;
		}
		let realPath;
		try {
			realPath = fs.realpathSync.native(pathname);
		} catch (error) {
			if (!hasNodeErrorCode(error, "ENOENT")) failure(pathname, `Could not resolve agent database ${pathname}: ${String(error)}`);
		}
		sourceIdentities.set(pathname, { realPath });
		const deletion = classifyDeletion(pathname, candidate.agentId);
		const isConfiguredPath = realPath !== void 0 && params.configuredAgentDatabaseTargets.some((configuredTarget) => {
			if (normalizeAgentId(configuredTarget.agentId) !== normalizeAgentId(candidate.agentId)) return false;
			try {
				return configuredPathMatcher(pathname, configuredTarget.path);
			} catch {
				return false;
			}
		});
		const isInsideActiveStateDir = Boolean(realPath && activeStateDirRealPath && (realPath === activeStateDirRealPath || isPathInside(activeStateDirRealPath, realPath)));
		if (realPath && !isInsideActiveStateDir && !isConfiguredPath && !deletion) {
			discard(candidate);
			const warning = `Skipped foreign agent database ${sanitizeForLog(pathname)}; it is outside the active state directory and is not a configured session store.`;
			warnings.push(warning);
			externalWarnings.push(warning);
			continue;
		}
		let stat;
		try {
			stat = fs.statSync(pathname, { bigint: true });
		} catch (error) {
			if (!hasNodeErrorCode(error, "ENOENT")) {
				failure(pathname, `Could not inspect ${candidate.source === "registry" ? "registered " : ""}agent database ${pathname}: ${String(error)}`);
				continue;
			}
		}
		if (!stat?.isFile()) {
			if (deletionJournal.status === "unavailable") try {
				if (resolveSqliteDatabaseFilePaths(pathname).some((file) => fs.lstatSync(file, { throwIfNoEntry: false }))) failure(pathname, `Could not verify held database ${pathname}: SQLite family artifacts remain without a regular main database. Restore the matching main database before reconstructing deletion history.`);
			} catch (error) {
				failure(pathname, `Could not inspect held database family ${pathname}: ${String(error)}`);
			}
			discard(candidate, `Removed missing agent database registry entry ${pathname}.`);
			if (candidate.source === "registry") warnings.push(`Skipped missing registered agent database ${pathname}.`);
			continue;
		}
		if (!realPath) {
			discard(candidate);
			failure(pathname, `Skipped agent database ${pathname}; its filesystem boundary is unresolved.`);
			continue;
		}
		const targetIdentity = typeof deletion === "string" ? JSON.stringify([normalizeAgentId(candidate.agentId), pathname]) : `${stat.dev}:${stat.ino}`;
		if (seenTargets.has(targetIdentity)) continue;
		if (deletion) {
			if (classifyDeletion(pathname)) {
				seenTargets.add(targetIdentity);
				if (typeof deletion === "string") unverifiedTargets.push({
					...candidate,
					realPath
				});
				else {
					const target = {
						...candidate,
						agentId: deletion.agentId,
						realPath
					};
					if (!deletion.cleanupCompleted && !deletion.manualClawRemoval) pendingDeletionTargets.push(target);
					else retainedTargets.push(target);
				}
				if (typeof deletion === "string" || deletion.cleanupCompleted || deletion.manualClawRemoval) warnings.push(`Held agent ${sanitizeForLog(typeof deletion === "string" ? candidate.agentId : deletion.agentId)} database ${sanitizeForLog(pathname)} (${typeof deletion === "string" ? deletion === "held" ? "deletion journal reconstructed" : "deletion journal unavailable" : "retained-by-deletion"}); run ${formatCliCommand("openclaw doctor --fix", params.env)} to inspect restoration.`);
			}
			continue;
		}
		seenTargets.add(targetIdentity);
		targets.push({
			...candidate,
			path: pathname,
			realPath
		});
	}
	if (unverifiedTargets.length > 0) warnings.push(`Agent deletion journal ${deletionJournal.status === "unavailable" ? "missing" : "reconstructed"}; ${unverifiedTargets.length} store${unverifiedTargets.length === 1 ? "" : "s"} held back. Run ${formatCliCommand("openclaw doctor --fix", params.env)} to record recovery, then restore or delete each held agent explicitly.`);
	return {
		targets,
		pendingDeletionTargets,
		schemaTargets: [...targets, ...pendingDeletionTargets],
		retainedTargets,
		unverifiedTargets,
		deletionJournal,
		registryRemovals,
		warnings,
		externalWarnings,
		failures,
		sourceIdentities
	};
}
//#endregion
//#region src/state/openclaw-database-preflight-targets.ts
function inspectDatabaseCandidatePresence(databasePath) {
	try {
		statSync(databasePath);
		return { status: "present" };
	} catch (error) {
		return hasNodeErrorCode(error, "ENOENT") ? { status: "absent" } : {
			status: "indeterminate",
			reason: formatErrorMessage(error)
		};
	}
}
/** An inspected custom path supplies recovery ownership, never migration admission. */
function recordAgentDatabaseRecoveryInspection(prepared, pathname, realPath, inspection) {
	const metadata = inspection.agentSchemaMeta;
	if (inspection.failure || inspection.reason || metadata?.role !== "agent" || !metadata.agentId || !isValidAgentId(metadata.agentId)) prepared?.discovery.failures.push({
		path: pathname,
		reason: "Could not verify the owner of a held custom session store."
	});
	else prepared?.discovery.unverifiedTargets.push({
		agentId: normalizeAgentId(metadata.agentId),
		path: pathname,
		realPath,
		source: "configured"
	});
}
/** Select read-only inspection targets from the captured shared-state ownership facts. */
function collectAgentDatabasePreflightTargets(options) {
	const { registeredDatabases, deletionJournal, purpose } = options;
	const retainedDeletions = deletionJournal.status === "present" ? deletionJournal.entries : [];
	let agentTargets = registeredDatabases;
	let configuredTargets = [];
	const retainedAgentIds = new Set(retainedDeletions.filter((deletion) => deletion.cleanupCompleted || deletion.manualClawRemoval).map((deletion) => deletion.agentId));
	const retainedPaths = /* @__PURE__ */ new Set();
	const failures = [];
	let preparedDiscovery;
	if (options.configuredAgentDatabaseTargets !== void 0) configuredTargets = typeof options.configuredAgentDatabaseTargets === "function" ? options.configuredAgentDatabaseTargets(registeredDatabases) : options.configuredAgentDatabaseTargets;
	if (purpose === "maintenance" && options.configuredAgentDatabaseTargets !== void 0) {
		const discovery = discoverAgentDatabaseMigrationTargets({
			env: options.env,
			configuredAgentDatabaseTargets: configuredTargets,
			registeredAgentDatabases: registeredDatabases,
			deletionJournal
		});
		preparedDiscovery = {
			stateDir: resolveStateDir(options.env),
			configuredAgentDatabaseTargets: configuredTargets,
			registeredAgentDatabases: registeredDatabases,
			discovery
		};
		agentTargets = discovery.schemaTargets;
		for (const retained of [...discovery.retainedTargets, ...discovery.unverifiedTargets]) retainedPaths.add(retained.realPath);
		failures.push(...discovery.failures);
	}
	const candidates = [
		...configuredTargets,
		...agentTargets,
		...options.configuredAgentDatabaseTargets !== void 0 ? registeredDatabases.filter((database) => isPersistentOpenClawAgentDatabasePath(database.path, options.env)) : [],
		...(options.configuredAgentDatabaseCandidatePaths ?? []).map((candidatePath) => ({
			agentId: options.inspectCandidateOwners ? resolveUnsuffixedSqliteTargetFromSessionStorePath(candidatePath).agentId : void 0,
			path: candidatePath
		}))
	];
	const samePath = createOpenClawAgentDatabasePathMatcher();
	const retained = [...retainedPaths];
	const classifyDeletion = createAgentDatabaseDeletionClassifier({
		env: options.env,
		retainedDeletions: deletionJournal,
		configuredAgentDatabaseTargets: configuredTargets,
		registeredAgentDatabases: registeredDatabases
	});
	return {
		configuredTargets,
		candidates: purpose === "runtime" ? candidates.filter((row) => typeof classifyDeletion(row.path, row.agentId) !== "object") : deletionJournal.status === "unavailable" ? preparedDiscovery && options.onAgentDatabaseDiscovery ? (options.configuredAgentDatabaseCandidatePaths ?? []).filter((pathname) => !retained.some((candidate) => samePath(candidate, pathname))).map((pathname) => ({
			agentId: void 0,
			path: pathname,
			holdForDeletionRecovery: true
		})) : [] : candidates.filter((row) => {
			if (deletionJournal.status === "present" && deletionJournal.held.some((target) => samePath(target.path, row.path))) return options.inspectHeldAgentDatabaseTargets?.some((target) => target.agentId === row.agentId && samePath(target.path, row.path)) === true;
			return row.agentId === void 0 || !retainedAgentIds.has(row.agentId);
		}),
		isRetainedPath: (pathname) => purpose === "runtime" ? typeof classifyDeletion(pathname) === "object" : retained.some((candidate) => samePath(candidate, pathname)),
		failures,
		preparedDiscovery
	};
}
//#endregion
//#region src/state/openclaw-database-preflight.messages.ts
/** Fatal refusal when persisted schemas were written by a newer build. */
var OpenClawDatabaseSchemaPreflightError = class extends SqliteSchemaVersionError {
	constructor(incompatibleDatabases, options = {}) {
		const operation = options.operation ?? "gateway-startup";
		super(formatIncompatibleDatabaseSchemas(incompatibleDatabases, operation));
		this.incompatibleDatabases = incompatibleDatabases;
		this.name = "OpenClawDatabaseSchemaPreflightError";
	}
};
function formatIncompatibleDatabase(database) {
	const agent = database.agentId ? ` for agent ${database.agentId}` : "";
	return `${database.kind} database${agent} ${database.path} uses schema ${database.foundVersion}; this build supports ${database.supportedVersion}; writer build ${database.writerAppVersion ?? "unknown"}.`;
}
function formatIncompatibleDatabaseSchemas(incompatibleDatabases, operation) {
	return `${operation === "doctor" ? "Doctor refused to continue" : operation === "gateway-restart" ? "Gateway refused restart" : "Gateway refused startup"} because ${incompatibleDatabases.length} OpenClaw database schema(s) are newer than this build. ${incompatibleDatabases.map(formatIncompatibleDatabase).join(" ")} Refused by ${describeRunningOpenClawBuild()}. Run a build at least as new as the writer that supports these schemas, or stop the service and restore your pre-upgrade backup created with openclaw backup create. See ${OPENCLAW_DATABASE_SCHEMA_DOCS_URL}.`;
}
function describeDeferredStateSchemaPublication(blocker, databasePath, foundVersion, contentVersion) {
	return {
		kind: "state",
		path: databasePath,
		foundVersion,
		contentVersion,
		...blocker ? {
			runId: blocker.runId,
			publishAfterMs: blocker.publishAfterMs
		} : {},
		message: blocker ? `Schema content applied; version publication deferred until update run ${blocker.runId} finishes and its five-minute grace expires (or the running driver is abandoned for 30 minutes).` : "Schema content applied; version publication will complete on the next writable database open."
	};
}
//#endregion
//#region src/state/openclaw-database-verify.ts
const log = createSubsystemLogger("state/database-verify");
const integrityCheckQueues = resolveGlobalSingleton(Symbol.for("openclaw.databaseIntegrityChecks"), () => /* @__PURE__ */ new Map());
function integrityCheckQueue(env) {
	const key = path.resolve(resolveOpenClawStateSqlitePath(env));
	let queue = integrityCheckQueues.get(key);
	if (!queue) {
		queue = {
			paths: /* @__PURE__ */ new Map(),
			releases: /* @__PURE__ */ new Set()
		};
		integrityCheckQueues.set(key, queue);
	}
	return queue;
}
function enqueueCheck(queue, pathname, request) {
	if (request.check === "full" || queue.paths.get(pathname)?.check !== "full") {
		const previous = queue.paths.get(pathname);
		queue.paths.set(pathname, request);
		if (previous) releaseCheck(queue, previous);
	} else releaseCheck(queue, request);
}
function releaseCheck(queue, request) {
	const release = request.release;
	request.release = void 0;
	if (!release) return;
	const pending = release().catch((error) => {
		log.error("database integrity verification cleanup failed", { error: String(error) });
	});
	queue.releases.add(pending);
	pending.finally(() => queue.releases.delete(pending));
}
/** Admitted opens queue work; only the listening Gateway starts the verifier. */
function requestOpenClawAgentDatabaseIntegrityCheck(options) {
	const queue = integrityCheckQueue(options.env);
	enqueueCheck(queue, path.resolve(options.path), {
		check: options.check,
		proof: options.proof,
		release: options.release
	});
	queue.wake?.();
}
//#endregion
//#region src/state/openclaw-state-schema-inspection.ts
function deduplicateSchemaIssues(issues) {
	return [...new Map(issues.map((issue) => [`${issue.code}\0${issue.objectName}`, issue])).values()];
}
function inspectCurrentStateStartupSchema(database, databasePath, foundVersion) {
	const metadata = assertOpenClawStateDatabaseOwner(database, { pathname: databasePath });
	if (metadata?.schema_version !== foundVersion) throw new SqliteSchemaMismatchError(`OpenClaw state database ${databasePath} metadata schema version ${typeof metadata?.schema_version === "number" ? metadata.schema_version : "invalid"} does not match ${foundVersion}.`);
	const readTable = createSqliteTableContractReader(database);
	const issues = deduplicateSchemaIssues([...collectSqliteSchemaIssues(database, OPENCLAW_STATE_SCHEMA_SQL, OPENCLAW_STATE_MAINTENANCE_SCHEMA_COMPATIBILITY, readTable), ...collectSqliteSchemaIssues(database, OPENCLAW_STATE_SCHEMA_SQL, STATE_RUNTIME_SCHEMA_COMPATIBILITY, readTable)]);
	return {
		blockingIssues: issues.filter((issue) => !isOpenClawStateStartupRepairableSchemaIssue(issue) && !isOpenClawStateFirstUseSchemaIssue(issue)),
		startupRepairableIssues: issues.filter(isOpenClawStateStartupRepairableSchemaIssue)
	};
}
//#endregion
//#region src/state/openclaw-state-schema-preflight.ts
const canonicalStateInspectionSchemas = [OPENCLAW_STATE_SCHEMA_SQL];
/** Only trusted canonical definitions enter the expected-contract cache, never observed schemas. */
function captureStateSchemaInspectionContracts() {
	return captureSqliteSchemaContracts(canonicalStateInspectionSchemas);
}
/** Boot/Doctor and restart readers inspect the same captured bytes under their existing owner. */
function inspectStateDatabaseSchema(database, input) {
	const { pathname, supportedVersion } = input;
	const schemas = {
		incompatible: [],
		indeterminate: []
	};
	const inspection = {
		schemas,
		inspectionErrors: []
	};
	const cleanClose = input.purpose === "runtime" && readSqliteDatabaseCleanClose(pathname) && getStateRuntimeSchemaAdmission(database)?.startupReady === true;
	try {
		const stateVersion = readSqliteUserVersion(database);
		const contentVersion = stateVersion > supportedVersion ? stateVersion : readStateSchemaContentVersion(database, stateVersion);
		if (contentVersion > supportedVersion) {
			const writerAppVersion = readSqliteWriterAppVersion(database);
			schemas.incompatible.push({
				kind: "state",
				path: pathname,
				foundVersion: contentVersion,
				supportedVersion,
				...writerAppVersion ? { writerAppVersion } : {}
			});
			if (contentVersion > 22) return inspection;
		}
		const migrationVersion = stateVersion > supportedVersion ? readStateSchemaContentVersion(database, stateVersion) : contentVersion;
		if (migrationVersion < supportedVersion) schemas.pendingMigrations = [{
			kind: "state",
			path: pathname,
			foundVersion: stateVersion,
			supportedVersion
		}];
		if (stateVersion < contentVersion && migrationVersion === contentVersion) schemas.deferredSchemaPublications = [describeDeferredStateSchemaPublication(readStateSchemaPublicationBlocker(database), pathname, stateVersion, contentVersion)];
		if (!cleanClose && input.requireStartupMigrationReadiness && contentVersion <= 22) {
			assertSqliteIntegrity(database, pathname);
			assertCanonicalStateSchemaShape(database, pathname);
			inspectOpenClawStateOwnershipFromDatabase(database, pathname);
			if (migrationVersion === 22) {
				const { blockingIssues } = inspectCurrentStateStartupSchema(database, pathname, stateVersion);
				if (blockingIssues.length > 0) throw new SqliteSchemaMismatchError(`OpenClaw state database ${pathname} requires repair: ${blockingIssues.map((issue) => issue.message).join("; ")}; run openclaw doctor --fix.`);
			} else openClawStateMigrationAssertions.get(migrationVersion)?.(database, { pathname });
		} else if (!cleanClose && input.verifyCurrentSchemaShape && migrationVersion === 22) try {
			assertOpenClawStateDatabaseForMaintenance(database, {
				pathname,
				schemaVersions: {
					userVersion: stateVersion,
					contentVersion: migrationVersion
				}
			});
		} catch (error) {
			inspection.inspectionErrors.push(error);
			schemas.indeterminate.push({
				kind: "state",
				path: pathname,
				reason: formatErrorMessage(error)
			});
		}
		if (input.scope === "state") return inspection;
		try {
			inspection.registeredDatabases = readAgentDatabasePreflightTargets(database, pathname);
			inspection.deletionJournal = readRetainedAgentDeletionsFromDatabase(database, pathname, input.purpose);
		} catch (error) {
			inspection.inspectionErrors.push(error);
			schemas.indeterminate.push({
				kind: "state",
				path: pathname,
				reason: `agent database registry query failed: ${formatErrorMessage(error)}`
			});
		}
		return inspection;
	} catch (error) {
		if (input.requireStartupMigrationReadiness) throw error;
		const failure = normalizeOpenClawStateSchemaReadError(error, pathname);
		inspection.inspectionErrors.push(failure);
		schemas.indeterminate.push({
			kind: "state",
			path: pathname,
			reason: formatErrorMessage(failure)
		});
		return inspection;
	}
}
//#endregion
//#region src/state/openclaw-database-preflight.ts
const indeterminateCauses = /* @__PURE__ */ new WeakMap();
var AgentDatabaseRecoveryHeldError = class extends Error {};
/** Read schema headers and optionally verify current schema shape without repairing it. */
async function preflightOpenClawDatabaseSchemas(inputOptions, purpose = "maintenance") {
	const options = isArtifactPreservingStateRead("agent") ? {
		...inputOptions,
		preserveSourceArtifacts: true
	} : inputOptions;
	options.signal?.throwIfAborted();
	const supportedVersions = options.supportedVersions ?? {
		state: 22,
		agent: 27
	};
	const result = {
		incompatible: [],
		indeterminate: []
	};
	const startup = options.requireStartupMigrationReadiness ? getAgentDatabaseStartupAdmission() : void 0;
	const admissionConfig = options.agentAdmissionConfig;
	const admittedAgentIds = new Set(admissionConfig ? listConfiguredSessionStoreAgentIds(admissionConfig) : []);
	const scheduling = startup?.scheduling(options.env, admissionConfig ? options.configuredAgentDatabaseCandidatePaths ?? resolveConfiguredAgentDatabaseCandidatePaths(admissionConfig, { env: options.env }) : [], admittedAgentIds);
	const prepareSchemaHeader = startup?.prepareSchemaHeaders(options.env);
	const preparedStartup = options.reuseStartupSchemaPreparation && !options.requireStartupMigrationReadiness && !options.verifyCurrentSchemaShape && !options.openStateSchemaReadAdmission ? getAgentDatabaseStartupAdmission() : void 0;
	const assertPreparedStateSchema = preparedStartup?.takePreparedStateSchema(options.env);
	const readPreparedSchemaHeader = preparedStartup?.takePreparedSchemaHeaders(options.env);
	const refusalOwner = startup ?? preparedStartup;
	const priorRefusals = refusalOwner?.captureRefusals(options.env);
	const statePath = path.resolve(resolveOpenClawStateSqlitePath(options.env));
	let registeredDatabases = [];
	let deletionJournal = {
		status: "unavailable",
		cause: "missing",
		reason: "shared state database missing"
	};
	let stateDatabase;
	let closeStateSchemaReadAdmission;
	let stateSnapshot;
	const stateInspectionErrors = [];
	const statePresence = inspectDatabaseCandidatePresence(statePath);
	if (statePresence.status === "indeterminate") {
		result.indeterminate.push({
			kind: "state",
			path: statePath,
			reason: statePresence.reason
		});
		return result;
	}
	try {
		if (statePresence.status === "present") try {
			var _usingCtx$1 = _usingCtx();
			const activeSnapshot = getActiveOpenClawStateDatabaseReadSnapshot({ env: options.env });
			const assertStateSource = activeSnapshot ? void 0 : assertPreparedStateSchema;
			const cleanClose = purpose === "runtime" && readSqliteDatabaseCleanClose(statePath);
			let stateLocation = activeSnapshot?.location ?? (cleanClose || assertStateSource ? statePath : void 0);
			options.signal?.throwIfAborted();
			const input = {
				pathname: statePath,
				supportedVersion: supportedVersions.state,
				requireStartupMigrationReadiness: options.requireStartupMigrationReadiness,
				verifyCurrentSchemaShape: options.verifyCurrentSchemaShape,
				scope: options.scope,
				purpose
			};
			const inspectSource = stateLocation === void 0 && options.preserveSourceArtifacts === false;
			const reader = _usingCtx$1.a(!assertStateSource && (purpose === "runtime" || inspectSource) && !options.requireStartupMigrationReadiness && !options.openStateSchemaReadAdmission ? createAgentSchemaInspectionWorker() : void 0);
			if (reader) input.schemaContracts = captureStateSchemaInspectionContracts();
			let inspection = reader && inspectSource ? await reader.inspectState(input, options.signal) : null;
			if (!inspection) {
				if (stateLocation === void 0) {
					stateSnapshot = await prepareSqliteReadOnlyLocation(realpathSync.native(statePath), {
						preserveSourceArtifacts: options.preserveSourceArtifacts ?? true,
						allowLiveOwner: options.preserveSourceArtifacts !== false,
						signal: options.signal,
						requireCleanup: true
					});
					stateLocation = stateSnapshot.location;
				}
				options.signal?.throwIfAborted();
				if (reader) inspection = await reader.inspectState(input, options.signal, stateLocation);
				else {
					stateDatabase = openNodeSqliteDatabase(cleanClose ? resolveImmutableSqliteFileUri(stateLocation) : stateLocation, { readOnly: true });
					closeStateSchemaReadAdmission = options.openStateSchemaReadAdmission?.(stateDatabase);
					stateDatabase.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
					const admittedDatabase = stateDatabase;
					assertStateSource?.();
					inspection = assertStateSource ? runSqliteDeferredTransactionSync(admittedDatabase, () => inspectStateDatabaseSchema(admittedDatabase, input), { operationLabel: "state.startup-prepared-schema" }) : inspectStateDatabaseSchema(stateDatabase, input);
					assertStateSource?.();
				}
			}
			if (!inspection) throw new Error("Missing state schema inspection result");
			adoptSqliteSchemaContracts(inspection.schemaContracts ?? []);
			Object.assign(result, inspection.schemas);
			stateInspectionErrors.push(...inspection.inspectionErrors);
			if (startup && inspection.inspectionErrors.length === 0 && inspection.schemas.incompatible.length === 0 && inspection.schemas.indeterminate.length === 0 && !inspection.schemas.pendingMigrations?.length) startup.recordStateSchemaPreparation(options.env);
			if (options.scope === "state" || !inspection.deletionJournal) return result;
			registeredDatabases = inspection.registeredDatabases ?? [];
			deletionJournal = inspection.deletionJournal;
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			await _usingCtx$1.d();
		}
	} catch (error) {
		const failure = normalizeOpenClawStateSchemaReadError(error, statePath);
		stateInspectionErrors.push(failure);
		if (options.signal?.aborted || options.requireStartupMigrationReadiness) throw failure;
		const row = {
			kind: "state",
			path: statePath,
			reason: formatErrorMessage(failure)
		};
		indeterminateCauses.set(row, failure);
		result.indeterminate.push(row);
		return result;
	} finally {
		await cleanupOpenClawStatePreflight({
			database: stateDatabase,
			closeAdmission: closeStateSchemaReadAdmission,
			snapshot: stateSnapshot,
			inspectionErrors: stateInspectionErrors
		});
	}
	if (options.scope === "state") return result;
	const { candidates, configuredTargets, isRetainedPath, failures, preparedDiscovery } = collectAgentDatabasePreflightTargets({
		...options,
		registeredDatabases,
		deletionJournal,
		purpose,
		inspectCandidateOwners: Boolean(options.requireStartupMigrationReadiness || options.agentAdmissionConfig)
	});
	const recordRecoveryFailure = (pathname, reason) => {
		preparedDiscovery?.discovery.failures.push({
			path: pathname,
			reason
		});
	};
	for (const failure of failures) result.indeterminate.push({
		kind: "agent",
		...failure
	});
	const admissionTargets = admissionConfig && (purpose === "runtime" || options.requireStartupMigrationReadiness || options.reuseStartupSchemaPreparation) ? [...configuredTargets, ...(options.configuredAgentDatabaseCandidatePaths ?? resolveConfiguredAgentDatabaseCandidatePaths(admissionConfig, { env: options.env })).map((pathname) => ({ path: pathname }))] : void 0;
	const recordInspectionFailure = (row, inspection, error) => {
		if (startup?.recordInspectionFailure(row, inspection, error)) return true;
		if (!admissionTargets || !admissionConfig || options.requireStartupMigrationReadiness || !row.agentId || !canIsolateAgentDatabase(admissionConfig, row.agentId)) return false;
		(inspection.agentRefusals ??= []).push(createAgentDatabaseInspectionRefusal({
			agentId: row.agentId,
			paths: [row.path],
			reason: formatErrorMessage(error),
			cause: error
		}));
		return true;
	};
	const skipped = /* @__PURE__ */ new Set();
	let recoveryHolds;
	const inspectionTargets = candidates.filter((row) => {
		if (!admissionTargets || isConfiguredAgentDatabaseTarget(admissionTargets, row.agentId, row.path)) return true;
		if (options.requireStartupMigrationReadiness && !skipped.has(row.path)) {
			createSubsystemLogger("state/agent-admission").warn(`Skipped ${path.basename(row.path)}: database is not a configured target; run openclaw doctor to inspect retained data.`);
			skipped.add(row.path);
		}
		return false;
	}).map((row) => Object.assign({}, row, { presence: inspectDatabaseCandidatePresence(row.path) })).filter((row) => row.presence.status !== "absent");
	if (options.requireStartupMigrationReadiness && inspectionTargets.length === 0) getCanonicalSqliteTableNames(OPENCLAW_AGENT_SCHEMA_SQL);
	const stats = await preflightAgentDatabasesBounded(inspectionTargets, async (row, inspection, claimAgentTarget, inspectSchema) => {
		const agentPath = row.path;
		if (refusalOwner?.reuseRefusal(row, inspection, priorRefusals)) return;
		const { presence } = row;
		if (presence.status === "indeterminate") {
			if (row.holdForDeletionRecovery) {
				recordRecoveryFailure(agentPath, presence.reason);
				return;
			}
			if (!recordInspectionFailure(row, inspection, new Error(presence.reason))) inspection.indeterminate.push({
				kind: "agent",
				path: agentPath,
				reason: presence.reason
			});
			return;
		}
		let agentSnapshot;
		let readSucceeded = false;
		try {
			const realAgentPath = realpathSync.native(agentPath);
			if (row.agentId === void 0 && isRetainedPath(realAgentPath)) return;
			if (!claimAgentTarget(realAgentPath, row.agentId)) return;
			let schemaInspection = readPreparedSchemaHeader?.(realAgentPath, supportedVersions.agent) ?? null;
			const recordPreparedSchemaHeader = prepareSchemaHeader?.(realAgentPath);
			const inspectOwnership = row.holdForDeletionRecovery || row.agentId !== void 0 && admittedAgentIds.has(row.agentId);
			const schemaInput = {
				pathname: realAgentPath,
				agentId: row.agentId,
				supportedVersion: supportedVersions.agent,
				inspectOwnership,
				verifyCurrentSchemaShape: row.holdForDeletionRecovery ? false : options.verifyCurrentSchemaShape,
				requireStartupMigrationReadiness: row.holdForDeletionRecovery ? false : options.requireStartupMigrationReadiness,
				deferRuntimeIntegrity: purpose === "runtime" && options.preserveSourceArtifacts !== true && scheduling?.canDefer(row)
			};
			if (!schemaInspection && (options.preserveSourceArtifacts !== true || purpose === "runtime" && readSqliteDatabaseCleanClose(realAgentPath))) schemaInspection = await inspectSchema(schemaInput, options.signal);
			if (!schemaInspection) {
				agentSnapshot = await prepareSqliteReadOnlyLocation(realAgentPath, {
					preserveSourceArtifacts: options.preserveSourceArtifacts ?? true,
					allowLiveOwner: options.preserveSourceArtifacts !== false,
					signal: options.signal,
					requireCleanup: true
				});
				options.signal?.throwIfAborted();
				schemaInspection = await inspectSchema(schemaInput, options.signal, agentSnapshot.location);
			}
			if (!schemaInspection) throw new Error(`Agent database inspection returned no result: ${agentPath}`);
			readSucceeded = !schemaInspection.failure && !schemaInspection.reason;
			const { version: agentVersion, writerAppVersion, agentSchemaMeta } = schemaInspection;
			if (row.holdForDeletionRecovery) {
				recordAgentDatabaseRecoveryInspection(preparedDiscovery, agentPath, realAgentPath, schemaInspection);
				return;
			}
			if (agentVersion < supportedVersions.agent && purpose === "runtime" && row.agentId && (await (recoveryHolds ??= withArtifactPreservingStateReads(() => readAgentDeletionRecoveryHoldsInWorker({ env: options.env })))).some((held) => held.agentId === row.agentId && isSameOpenClawAgentDatabasePath(held.path, realAgentPath))) {
				const cause = new AgentDatabaseRecoveryHeldError(`Agent ${row.agentId} database is held for deletion recovery at schema ${agentVersion}; migration to schema ${supportedVersions.agent} requires Doctor.`);
				const refusal = createAgentDatabaseInspectionRefusal({
					agentId: row.agentId,
					paths: [agentPath],
					reason: cause.message,
					cause
				});
				(inspection.agentRefusals ??= []).push(refusal);
				createSubsystemLogger("state/agent-admission").warn(`${refusal.reason} ${refusal.repairHint}`);
				return;
			}
			if (agentVersion <= supportedVersions.agent && inspectOwnership && row.agentId) {
				const refusal = inspectAgentDatabaseAdmission({
					agentId: row.agentId,
					path: agentPath,
					metadata: agentSchemaMeta ?? null
				});
				if (refusal) {
					(inspection.agentRefusals ??= []).push(refusal);
					return;
				}
			}
			if (agentVersion < supportedVersions.agent) (inspection.pendingMigrations ??= []).push({
				kind: "agent",
				path: agentPath,
				...row.agentId !== void 0 ? { agentId: row.agentId } : {},
				foundVersion: agentVersion,
				supportedVersion: supportedVersions.agent
			});
			if (schemaInspection.failure && !schemaInspection.reason) throw schemaInspection.failure;
			if (schemaInspection?.reason) {
				if (startup || admissionTargets && !options.requireStartupMigrationReadiness) throw schemaInspection.failure ?? new Error(schemaInspection.reason);
				const failure = {
					kind: "agent",
					path: agentPath,
					reason: schemaInspection.reason,
					...options.requireStartupMigrationReadiness ? { agentId: row.agentId } : {}
				};
				if (schemaInspection.failure) indeterminateCauses.set(failure, schemaInspection.failure);
				inspection.indeterminate.push(failure);
				return;
			}
			if (agentVersion > supportedVersions.agent) {
				const incompatible = {
					kind: "agent",
					path: agentPath,
					...row.agentId !== void 0 ? { agentId: row.agentId } : {},
					foundVersion: agentVersion,
					supportedVersion: supportedVersions.agent,
					...writerAppVersion ? { writerAppVersion } : {}
				};
				if (!admissionTargets || !admissionConfig || !row.agentId || !canIsolateAgentDatabase(admissionConfig, row.agentId) || !recordInspectionFailure(row, inspection, new OpenClawDatabaseSchemaPreflightError([incompatible]))) inspection.incompatible.push(incompatible);
			}
			if (schemaInspection.integrityGateOutcome === "cached" && !readSqliteDatabaseCleanClose(agentPath)) requestOpenClawAgentDatabaseIntegrityCheck({
				check: "quick",
				path: agentPath,
				env: options.env ?? process.env
			});
			recordPreparedSchemaHeader?.(schemaInspection);
			return schemaInspection.preparationPending ? "defer" : void 0;
		} catch (error) {
			if (options.signal?.aborted) throw error;
			if (row.holdForDeletionRecovery) {
				recordRecoveryFailure(agentPath, formatErrorMessage(error));
				return;
			}
			if (recordInspectionFailure(row, inspection, error)) return;
			if (options.requireStartupMigrationReadiness) throw error;
			const failure = {
				kind: "agent",
				path: agentPath,
				reason: formatErrorMessage(error)
			};
			indeterminateCauses.set(failure, error);
			inspection.indeterminate.push(failure);
		} finally {
			if (agentSnapshot) {
				let failure;
				try {
					if (!await agentSnapshot.cleanupAsync()) failure = { error: /* @__PURE__ */ new Error(`SQLite read-only worker snapshot cleanup failed: ${agentSnapshot.location}`) };
				} catch (error) {
					if (!readSucceeded || !deferSqliteSnapshotCleanupAfterRead(error, agentSnapshot.cleanupRoot)) failure = { error };
				}
				if (failure && !recordInspectionFailure(row, inspection, failure.error)) {
					if (row.holdForDeletionRecovery) recordRecoveryFailure(agentPath, formatErrorMessage(failure.error));
					else inspection.indeterminate.push({
						kind: "agent",
						path: agentPath,
						reason: formatErrorMessage(failure.error)
					});
				}
			}
		}
	}, result, options.signal, scheduling);
	if (preparedDiscovery) options.onAgentDatabaseDiscovery?.(preparedDiscovery);
	options.onAgentInspection?.(stats);
	return result;
}
//#endregion
export { preflightOpenClawDatabaseSchemas };
