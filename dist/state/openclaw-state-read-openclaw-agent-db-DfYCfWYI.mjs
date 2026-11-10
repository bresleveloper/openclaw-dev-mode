import { i as readGlobalSingleton, m as toStringifiedError, o as resolveGlobalSet, s as resolveGlobalSingleton } from "./openclaw-state-read-listeners-C6ALBiqg.mjs";
import { L as resolveOpenClawStateSqlitePath, N as resolveOpenClawAgentDatabaseStoredPath, P as resolveOpenClawRegisteredAgentDatabasePath, d as resolveRuntimeProcessEntrypointUrl, h as SqliteWorkerOpenRefusedError } from "./openclaw-state-read-worker-cpu-DxXDPrAN.mjs";
import { B as stageSqliteTransactionState, Dt as assertExistingDatabaseIdentity, Ft as resolveDatabasePathKey, Pt as readDatabasePathIdentitySync, V as withSqlitePostCommitPublications, X as OPENCLAW_AGENT_SCHEMA_SQL, l as getSqliteDatabaseAdmissionIdentityForPath, mt as extractSqliteTableSchema, ut as hasPendingAgentStartupColumns, x as readSqliteDatabaseIntegrityVerification, xt as quoteSqliteIdentifier } from "./openclaw-state-read-sqlite-database-admission-BXby_hL9.mjs";
import { d as isPostgresSqlConnection } from "./openclaw-state-read-sqlite-reader-lifecycle-CGTFS3iz.mjs";
import { a as isRecord, r as asOptionalRecord } from "./openclaw-state-read-record-coerce-DWp7lFsP.mjs";
import { W as resolveIdentityPathViaExistingAncestorSync, t as createSubsystemLogger, w as resolveStateDir } from "./openclaw-state-read-subsystem-S9LTuPwa.mjs";
import { k as normalizeOptionalString } from "./openclaw-state-read-types.secrets-Wz8lmfvB.mjs";
import { C as readSqliteUserVersion, D as isSqliteInspectionDeadlineOwnedByCaller, G as assertAgentDeletionCleanupAliases, H as registerOpenClawAgentDatabaseAsyncResource, J as getAgentDeletionDatabaseCleanup, K as assertAgentDeletionDatabaseCleanupAccess, Mt as isArtifactPreservingStateRead, N as sqliteInspectionTimeoutError, O as readSqliteInspectionBudget, S as isSqliteSchemaVersionError, U as registerOpenClawAgentDatabaseSyncResource, Y as registerAgentDeletionDatabaseCleanup, at as registerAgentCreationClaimHandle, dt as isIncognitoOpenClawAgentSqlitePath, ft as isPersistentOpenClawAgentDatabasePath, gt as resolveOpenClawAgentSqlitePath, it as captureAgentCreationClaim, k as resolveSqliteInspectionSignal, nt as assertAgentCreationClaimAliases, pt as isSameOpenClawAgentDatabasePath, rt as assertAgentCreationClaimCurrent, st as reserveAgentCreationClaimAdmission, tt as assertAgentCreationClaimAccess, z as assertAgentDatabaseResourceAdmission } from "./openclaw-state-read-sqlite-snapshot-staging-owner-DeVv_bRV.mjs";
import { n as safeParseJsonRecord } from "./openclaw-state-read-json-coercion-CYFfIS_L.mjs";
import { t as sha256Hex } from "./openclaw-state-read-node-crypto-D_-P4MKR.mjs";
import { x as isDeletedAgentDatabasePath } from "./openclaw-state-read-worker-task-pool-CsV_Xz7_.mjs";
import { i as racePromiseWithAbortSignal } from "./openclaw-state-read-runtime-process-manifest-DvMn2cl1.mjs";
import { C as cloneEnvWithPlatformSemantics, J as quarantineOrphanedSqliteSidecars, L as readOpenClawDatabaseQuarantineFailure, T as SQLITE_IDLE_HANDLE_TTL_MS, Y as resolveSqliteDatabaseFilePaths, at as registerSqliteCacheExitClose, ft as assertSqliteIntegrity, gt as sqliteIntegrityCheckSteps, ht as runSqliteIntegrityOperationSync, it as configureSqlitePreSchemaPragmas, mt as runSqliteIntegrityCheckSync, ot as createSqliteWalReclamationResult, p as requireOpenClawStateDatabaseIdentity, pt as isTerminalSqliteIntegrityError, rt as configureSqliteConnectionPragmas, st as prepareSqliteDatabaseDirectory, tt as readExistingAgentSchemaMeta, x as isGatewayExternallySupervised, yt as readSqliteIntegrityFileIdentity, z as openSqliteReadOnlyDatabase } from "./openclaw-state-read-openclaw-state-db-cache-CpHXuPkl.mjs";
import { C as enableNodeSqliteKyselyStatementCache, a as getNodeSqliteKysely, c as prepareSqliteQuerySync, f as sql, l as prepareSqliteQueryTakeFirstSync, p as expressionBuilder, r as executeSqliteQuerySync, t as createSqliteQueryCache, u as sqliteStringSet } from "./openclaw-state-read-kysely-sync-DrKJlREt.mjs";
import { F as supportsNodeSqliteJsonb, P as supportsNodeSqliteExtensionLoading, S as getOpenClawDatabaseMaintenanceScope, T as observeOpenClawDatabaseMaintenanceResource, h as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, j as resolveExistingSqliteFileUri, k as openNodeSqliteDatabase } from "./openclaw-state-read-gateway-state-owner-Bj-SghTS.mjs";
import { t as runInDetachedAsyncContext } from "./openclaw-state-read-detached-async-context-BrFwufJ7.mjs";
import { t as createDeferredCore } from "./openclaw-state-read-deferred-D0La5CRk.mjs";
import { _ as invalidateSqliteSchemaFacts, d as admitSqliteSchema, l as sqlitePrimaryResultCode, m as getAdmittedSqliteSchemaFacts, v as isSqliteSchemaAdmissionCold, w as readSqliteTextEncoding, x as runSqliteReadOperationSync } from "./openclaw-state-read-sqlite-error-diagnostics-B72btzpi.mjs";
import { a as boolean, c as literal, f as object, g as string$1, i as array, l as looseObject, n as _enum, o as custom, r as _null, s as discriminatedUnion, t as ZodString, v as union, x as _coercedString, y as unknown } from "./openclaw-state-read-schemas-D2seJkFD.mjs";
import { r as createSqliteWorkerOperationAdmission, s as requestSqliteWorkerOperationAdmission } from "./openclaw-state-read-sqlite-worker-operation-admission-we1rdJYO.mjs";
import { a as tableExists, c as SqliteSchemaMismatchError } from "./openclaw-state-read-openclaw-state-db-schema-helpers-Cgf5rJqc.mjs";
import { a as runtimeProcessEntrypoints } from "./openclaw-state-read-runtime-binary-LcE5xcaN.mjs";
import { r as resolveRuntimeWorkerUrl, t as resolveRuntimeWorkerArgv } from "./openclaw-state-read-runtime-worker-url-slDwpD7p.mjs";
import { i as setSqliteBusyTimeout } from "./openclaw-state-read-sqlite-busy-timeout-BW3lmGFD.mjs";
import { n as normalizeAgentId } from "./openclaw-state-read-agent-id-BoCs9aqI.mjs";
import { $ as migrateCanonicalSessionWriterValidation, A as sessionEntrySnapshotsSchemaSql, At as setOpenClawAgentDatabaseValidation, B as migrateSessionCreatorNamespaces, Bt as migrateMemoryIndexStorage, C as hasPendingCurrentVersionAgentDatabaseMigration, Ct as getOpenClawAgentDatabaseValidationForTransfer, D as repairAndAssertOpenClawAgentV14SchemaForMigration, E as migratedSessionColumn, Et as invalidateOpenClawAgentDatabaseValidation, F as assertSupportedAgentMigrationSchemas, Ft as canonicalSessionValidationSchemaSql, G as parseSqliteSessionEntryRecord, H as migrateSessionTranscriptGenerations, Ht as ensureMemoryChunkProvenance, I as backfillSessionConversations, It as classifyOpenClawAgentDatabaseReadError, J as assertExistingAgentSchemaOwner, K as assertCanonicalAgentPersistenceVersion, L as ensureSessionAdditiveColumns, Lt as recordOpenClawAgentDatabaseReadOpenFailure, M as migrateSessionParticipantsSchema, Mt as loadOpenClawAgentCanonicalValidationReceipt, N as migrateOutboxEnqueueSequenceInTransaction, Nt as adoptCanonicalSessionValidationSchema, O as withLegacyAgentStorageSchema, Ot as publishOpenClawAgentDatabaseSchema, P as migrateAgentJsonPredicatesInTransaction, Pt as assertCanonicalSessionValidationSchema, Q as ensureLegacySessionEntryValidityTriggers, R as ensureSessionEntryValidityProjection, Rt as ensureOpenClawAgentBoardSchemaInTransaction, S as getOpenClawAgentMigrationSchema, St as getOpenClawAgentDatabaseValidation, T as migrateRetiredAgentStateLeaseSchema, Tt as hasRevokedOpenClawAgentDatabaseValidation, U as readSqliteTableColumns, V as migrateSessionTranscriptActiveProjection, Vt as ensureMemoryRecallMetadataSchema, X as hasAgentDatabaseApplicationSchema, Y as assertSupportedAgentSchemaVersion, Z as persistAgentSchemaMetadata, _ as assertOpenClawAgentCurrentRuntimeSchema, a as closeOpenClawAgentDatabaseByPathAsync, at as hasAgentDatabaseMaintenanceAuthority, b as ensureSessionReactionsSchemaInTransaction, ct as renewAgentDatabaseMaintenanceAuthorityIfPresent, d as registerAgentDatabaseHandle, dt as assertAgentDatabaseAdmitted, et as seedCanonicalSessionValidationPending, f as retainAgentDatabase, g as assertAgentSchemaVersion, h as startAgentDatabaseOpenTiming, i as closeMaintenanceAgentDatabase, it as claimOpenClawAgentDatabaseLease, j as withoutSessionEntrySnapshotsSchema, k as migrateDeployedTranscriptFtsRowsInTransaction, l as recordOpenClawAgentDatabaseOpenFailure, lt as agentDatabaseAdmissionProvenanceRefusal, m as revokePendingAgentDatabaseOpen, n as cache, nt as assertAgentDatabaseMaintenanceAuthorityIfPresent, o as closeOpenClawAgentDatabases, ot as recordOpenClawAgentDatabaseAdmission, p as retainFailedAgentDatabaseClose, q as assertCurrentAgentSchemaMetadata, r as closeCachedOpenClawAgentDatabase, rt as assertOpenClawAgentDatabaseLease, s as createAgentDatabaseScopeOwnedClose, st as releaseOpenClawAgentDatabaseLease, t as runOpenClawAgentWorkerWrite, tt as assertAgentDatabaseMaintenanceAuthority, u as refreshAgentDatabaseIdleTimer, v as assertOpenClawAgentSchemaContains, vt as adoptOpenClawAgentDatabaseSchema, w as hasPendingMemoryChunkMetadataMigration, wt as hasOpenClawAgentCanonicalValidation, x as finishAgentSchemaMigration, xt as captureOpenClawAgentDatabaseAliasPublication, y as ensureSessionKeyContractSchemaInTransaction, yt as adoptOpenClawAgentDatabaseValidation, z as migrateConversationDeliveryTargetColumn, zt as migrateMemoryIndexSourcesIdentity } from "./openclaw-state-read-openclaw-agent-write-admission-D5Qp4bnz.mjs";
import { a as runSqliteReadSnapshotSync, i as runSqliteImmediateTransactionSync } from "./openclaw-state-read-sqlite-transaction-gPY-7Ojc.mjs";
import { d as registerSqliteWalWorkerMaintenance, u as registerDeferredSqliteWalWriteAdmission } from "./openclaw-state-read-openclaw-state-db-handle-BSLzO3AU.mjs";
import { pt as assertSqliteSchemaContains } from "./openclaw-state-read.worker.js";
import { c as verifyAndRepairCanonicalSqliteIndexSteps, o as migrateSqliteSchemaToStrictInTransaction, r as runOpenClawStateWriteTransaction, s as repairCanonicalSqliteIndexes } from "./openclaw-state-read-openclaw-state-db-Dhtiiltk.mjs";
import "./openclaw-state-read-session-key-CJdIm256.mjs";
import { C as readOpenClawAgentDatabaseIdentity, S as isOpenClawAgentDatabasePathCurrent, b as createOpenClawAgentDatabaseClaim, f as emitOpenClawAgentDatabaseRegistryChange, h as recordOpenClawAgentDatabaseRegistryMutation, p as hasRegisteredOpenClawAgentDatabasePath, r as prepareAgentDeletionPathFence, t as assertAgentDeletionPathFence, w as registerOpenClawAgentDatabaseIdentity, x as findOpenClawAgentDatabaseIdentity, y as assertOpenClawAgentDatabaseIdentity } from "./openclaw-state-read-agent-deletion-journal-kOb8UH8S.mjs";
import fs, { chmodSync, existsSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
import { isMainThread } from "node:worker_threads";
import { isDeepStrictEqual } from "node:util";
import { AsyncLocalStorage } from "node:async_hooks";
import { fork, spawnSync } from "node:child_process";
import { performance as performance$1 } from "node:perf_hooks";
import zlib from "node:zlib";
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/classic/coerce.js
function string(params) {
	return _coercedString(ZodString, params);
}
//#endregion
//#region src/state/openclaw-agent-db-registry.ts
function resolveRegisteredAgentDatabaseStoredPath(database, params) {
	const storedPath = resolveOpenClawAgentDatabaseStoredPath(database.path, params.path);
	if (params.path !== resolveIdentityPathViaExistingAncestorSync(params.path)) return storedPath;
	const db = getNodeSqliteKysely(database.db);
	const { rows } = executeSqliteQuerySync(database.db, db.selectFrom("agent_databases").select("path").where("agent_id", "=", params.agentId));
	return rows.some((row) => row.path === storedPath) ? storedPath : rows.find((row) => isSameOpenClawAgentDatabasePath(resolveOpenClawRegisteredAgentDatabasePath(database.path, row.path), params.path))?.path ?? storedPath;
}
function registerOpenClawAgentDatabase(params, observer) {
	if (!isPersistentOpenClawAgentDatabasePath(params.path, params.env)) {
		if (params.admittedDb) setOpenClawAgentDatabaseValidation({
			...params,
			db: params.admittedDb
		});
		return;
	}
	const deletionFence = prepareAgentDeletionPathFence({
		agentId: params.agentId,
		path: params.path
	}, { env: params.env });
	let sizeBytes = null;
	try {
		sizeBytes = statSync(params.path).size;
	} catch {
		sizeBytes = null;
	}
	const lastSeenAt = Date.now();
	observer?.starting?.();
	runOpenClawStateWriteTransaction((database) => {
		assertAgentDeletionPathFence(database, deletionFence);
		const storedPath = resolveRegisteredAgentDatabaseStoredPath(database, params);
		const db = getNodeSqliteKysely(database.db);
		executeSqliteQuerySync(database.db, db.insertInto("agent_databases").values({
			agent_id: params.agentId,
			path: storedPath,
			schema_version: params.schemaVersion ?? 27,
			last_seen_at: lastSeenAt,
			size_bytes: sizeBytes
		}).onConflict((conflict) => conflict.columns(["agent_id", "path"]).doUpdateSet({
			schema_version: params.schemaVersion ?? 27,
			last_seen_at: lastSeenAt,
			size_bytes: sizeBytes
		})));
		recordOpenClawAgentDatabaseRegistryMutation(database, "upsert", [params]);
		const onCommitted = observer?.committed;
		if (onCommitted) {
			const receipt = Object.freeze({
				agentId: params.agentId,
				agentPath: params.path,
				stateDatabasePath: database.path,
				stateDatabaseIdentity: requireOpenClawStateDatabaseIdentity(database).key
			});
			if (!stageSqliteTransactionState(database.db, {
				stage() {},
				rollback() {},
				commit: () => onCommitted(receipt)
			})) throw new Error("Agent registration requires its canonical transaction publication scope");
		}
		emitOpenClawAgentDatabaseRegistryChange(params.agentId, database.db);
	}, {
		env: params.env,
		initializationAgentPaths: [params.path]
	});
	if (params.admittedDb) {
		const database = {
			...params,
			db: params.admittedDb
		};
		if (!adoptOpenClawAgentDatabaseSchema(database)) setOpenClawAgentDatabaseValidation(database);
	} else invalidateOpenClawAgentDatabaseValidation(params.path);
}
//#endregion
//#region src/infra/native-error-response.ts
function restoreNativeErrorResponse(value) {
	const cause = value.cause ? Object.assign(new Error(value.cause.message), value.cause) : void 0;
	return Object.assign(new Error(value.message, cause ? { cause } : void 0), {
		name: value.name,
		code: value.code,
		errcode: value.errcode
	});
}
//#endregion
//#region src/infra/sqlite-integrity-worker-error.ts
var SqliteIntegrityWorkerInterruptedError = class extends Error {
	constructor(signal, lastObservedPhase) {
		super(`SQLite integrity check stopped by ${signal} before completion (lastObservedPhase=${lastObservedPhase})`);
		this.signal = signal;
		this.name = "SqliteIntegrityWorkerInterruptedError";
	}
};
//#endregion
//#region src/infra/sqlite-integrity-worker.ts
const integrityScope = new AsyncLocalStorage();
const log$1 = createSubsystemLogger("state/sqlite");
async function closeIntegrityProcess(worker) {
	if (!worker.retired) {
		worker.retired = true;
		if (worker.child.connected) worker.child.send({ type: "close" }, (error) => {
			if (error) worker.child.kill("SIGKILL");
		});
	}
	const timeout = setTimeout(() => worker.child.kill("SIGKILL"), worker.closeBudgetMs);
	timeout.unref();
	try {
		await worker.closed;
	} finally {
		clearTimeout(timeout);
	}
}
/** The caller retains its owning lease or private snapshot until the native reader closes. */
function assertSqliteIntegrityInWorker(pathname, busyTimeoutMs, callerSignal, databaseLabel = pathname, timing) {
	const scope = integrityScope.getStore();
	const run = async (heldScope) => assertSqliteIntegrityWithProcess(pathname, busyTimeoutMs, callerSignal, databaseLabel, timing, heldScope);
	if (!scope) return run();
	if (!scope.accepting) return Promise.reject(/* @__PURE__ */ new Error("SQLite integrity maintenance scope is closed"));
	const pending = scope.queue.tail.then(async () => {
		try {
			if (scope.queue.process?.retired) await scope.queue.process.closed;
			await run(scope);
		} catch (error) {
			if (scope.queue.process) await closeIntegrityProcess(scope.queue.process);
			throw error;
		}
	});
	scope.queue.tail = pending.catch(() => void 0);
	scope.pending.add(pending);
	pending.finally(() => scope.pending.delete(pending)).catch(() => void 0);
	return pending;
}
function assertSqliteIntegrityWithProcess(pathname, busyTimeoutMs, callerSignal, databaseLabel, timing, scope) {
	const signal = resolveSqliteInspectionSignal(callerSignal) ?? callerSignal;
	if (timing) {
		delete timing.workerCheckElapsedMs;
		delete timing.workerLifetimeElapsedMs;
	}
	signal.throwIfAborted();
	scope?.assertCurrent();
	const identity = readSqliteIntegrityFileIdentity(pathname);
	const { timeoutMs, size } = readSqliteInspectionBudget("integrity check", databaseLabel, identity.size);
	const startedAt = performance$1.now();
	let active = scope?.queue.process;
	if (!active || active.retired) {
		const entry = resolveRuntimeProcessEntrypointUrl("sqliteIntegrity");
		const child = fork(entry, [], {
			execArgv: resolveRuntimeWorkerArgv(entry).slice(0, -1),
			serialization: "advanced",
			stdio: [
				"ignore",
				"ignore",
				"ignore",
				"ipc"
			],
			timeout: scope || isSqliteInspectionDeadlineOwnedByCaller() ? void 0 : timeoutMs,
			killSignal: "SIGKILL",
			...scope ? {} : { signal }
		});
		const { promise: closed, resolve: onClosed } = createDeferredCore();
		active = {
			child,
			closed,
			retired: false,
			closeBudgetMs: timeoutMs
		};
		const launched = active;
		child.on("error", (error) => {
			launched.failure = toStringifiedError(error);
			launched.retired = true;
			child.kill("SIGKILL");
		});
		child.once("close", () => {
			launched.retired = true;
			onClosed();
		});
		if (scope) scope.queue.process = active;
	}
	active.closeBudgetMs = timeoutMs;
	const reader = active;
	const worker = reader.child;
	return new Promise((resolve, reject) => {
		let result;
		let failure;
		let lastObservedPhase = "starting";
		let timeout;
		const heartbeat = setInterval(() => {
			log$1.info(`SQLite integrity check still running: ${databaseLabel} (${size}, ${Math.floor((performance$1.now() - startedAt) / 1e3)}s elapsed, phase=${lastObservedPhase}).`);
		}, 1e4);
		heartbeat.unref();
		const deadlineError = () => {
			const error = sqliteInspectionTimeoutError("integrity check", databaseLabel, timeoutMs, size);
			error.message += ` (lastObservedPhase=${lastObservedPhase})`;
			return error;
		};
		const kill = () => {
			reader.retired = true;
			worker.kill("SIGKILL");
		};
		const onAbort = () => {
			failure = toStringifiedError(signal.reason);
			kill();
		};
		const finish = (code, closeSignal) => {
			clearTimeout(timeout);
			clearInterval(heartbeat);
			signal.removeEventListener("abort", onAbort);
			worker.off("message", onMessage);
			worker.off("close", finish);
			if (timing) {
				timing.workerLifetimeElapsedMs = performance$1.now() - startedAt;
				const checkElapsedMs = result?.checkElapsedMs;
				if (typeof checkElapsedMs === "number" && Number.isFinite(checkElapsedMs) && checkElapsedMs >= 0) timing.workerCheckElapsedMs = checkElapsedMs;
			}
			try {
				signal.throwIfAborted();
				scope?.assertCurrent();
				const workerFailure = failure ?? reader.failure;
				if (workerFailure) throw workerFailure;
				if (worker.killed && closeSignal === "SIGKILL") throw deadlineError();
				if (code !== 0 || !result) {
					if (!result && closeSignal) throw new SqliteIntegrityWorkerInterruptedError(closeSignal, lastObservedPhase);
					throw new Error(`SQLite integrity worker exited ${code} without a completed check (lastObservedPhase=${lastObservedPhase})`);
				}
				readSqliteIntegrityFileIdentity(pathname, identity);
				if (!result.ok) throw restoreNativeErrorResponse(result.error);
				resolve();
			} catch (error) {
				if (scope && !reader.retired) {
					kill();
					reader.closed.then(() => reject(toStringifiedError(error)));
				} else reject(toStringifiedError(error));
			}
		};
		const onMessage = (message) => {
			if ("type" in message && message.type === "phase") {
				if (!result && (message.phase === "opening" || message.phase === "checking" || message.phase === "closing")) lastObservedPhase = message.phase;
			} else if ("ok" in message) {
				result = message;
				lastObservedPhase = "result-received";
				if (scope) {
					if (message.ok && !reader.retired && !failure && !reader.failure) finish(0, null);
					else reader.retired = true;
				}
			}
		};
		worker.on("message", onMessage);
		worker.once("close", finish);
		if (scope) {
			signal.addEventListener("abort", onAbort, { once: true });
			if (!isSqliteInspectionDeadlineOwnedByCaller()) {
				timeout = setTimeout(() => {
					if (!result || result.ok) failure ??= reader.failure ?? deadlineError();
					kill();
				}, timeoutMs);
				timeout.unref();
			}
		}
		if (!signal.aborted) worker.send({
			pathname,
			databaseLabel,
			identity,
			busyTimeoutMs,
			...scope ? { reuse: true } : {}
		}, (error) => {
			if (error) {
				failure = error;
				kill();
			}
		});
		else if (scope) onAbort();
	});
}
//#endregion
//#region src/state/openclaw-agent-db-terminal.ts
function terminalLatch() {
	return readGlobalSingleton(Symbol.for("openclaw.agentDatabaseLifecycle"))?.terminal;
}
/** Read the existing damage latch without acquiring the writable database lifecycle. */
function assertAgentDatabaseTerminalOpenAllowed(pathname) {
	const failure = terminalLatch()?.get(pathname);
	if (failure) throw failure;
}
/** Only latched integrity failures need a fresh native check after external repair. */
function revalidateAgentDatabaseTerminalOpen(pathname) {
	const latch = terminalLatch();
	const failure = latch?.peek(pathname);
	if (latch && failure?.name === "SqliteIntegrityError") {
		const workerUrl = resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.databaseVerify);
		const child = spawnSync(process.execPath, [
			...resolveRuntimeWorkerArgv(workerUrl),
			"--openclaw-database-verify-sync",
			pathname
		], {
			timeout: readSqliteInspectionBudget("integrity check", pathname).timeoutMs,
			killSignal: "SIGKILL",
			stdio: "ignore"
		});
		if (child.error || child.status !== 0) throw failure;
		latch.clear(pathname);
	}
	assertAgentDatabaseTerminalOpenAllowed(pathname);
}
async function revalidateAgentDatabaseTerminalOpenAsync(pathname, assertCurrent, signal = new AbortController().signal) {
	const latch = terminalLatch();
	const failure = latch?.peek(pathname);
	if (latch && failure?.name === "SqliteIntegrityError") {
		await assertSqliteIntegrityInWorker(pathname, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, signal);
		assertCurrent?.();
		if (latch.peek(pathname) === failure) latch.clear(pathname);
	}
	assertCurrent?.();
	assertAgentDatabaseTerminalOpenAllowed(pathname);
}
//#endregion
//#region src/state/openclaw-agent-db-worker-admission.ts
/** The existing executor owns cold admission; the native callback retains the SDK handle contract. */
async function withWorkerAdmission(options, assertCurrent, signal, run, borrowedExecution) {
	const pathname = resolveOpenClawAgentSqlitePath(options);
	assertAgentCreationClaimCurrent(options);
	assertAgentCreationClaimAliases(options);
	const creationClaim = captureAgentCreationClaim(options);
	const admittedIdentity = borrowedExecution ? getSqliteDatabaseAdmissionIdentityForPath(pathname) : void 0;
	const identity = admittedIdentity ? {
		...admittedIdentity,
		canonicalPath: resolveDatabasePathKey(pathname)
	} : readDatabasePathIdentitySync(pathname);
	const agentId = normalizeAgentId(options.agentId);
	if (borrowedExecution) {
		borrowedExecution.assertCurrent();
		if (borrowedExecution.agentId !== agentId || borrowedExecution.path !== pathname) throw new Error("Agent worker admission differs from its captured execution");
	}
	let publishAlias = identity.canonicalPath !== pathname ? captureOpenClawAgentDatabaseAliasPublication({
		agentId,
		path: pathname
	}) : void 0;
	const completion = createDeferredCore();
	let revoked = false;
	let releaseExecution;
	const assertAdmission = () => {
		if (revoked) throw new Error("Agent database admission closed during worker preparation");
		assertCurrent?.();
		borrowedExecution?.assertCurrent();
		creationClaim?.assertCurrent();
		signal?.throwIfAborted();
	};
	const unregister = registerOpenClawAgentDatabaseAsyncResource({
		agentId,
		path: pathname,
		revoke: () => {
			revoked = true;
		},
		close: () => completion.promise
	}, options);
	try {
		const owner = await import("./openclaw-state-read-openclaw-agent-execution-CyGFpcXz.mjs");
		assertAdmission();
		if (!owner.supportsOpenClawAgentDatabaseExecution(options)) return await run("native");
		let execution;
		if (borrowedExecution) execution = borrowedExecution;
		else {
			const captured = owner.captureOpenClawAgentDatabaseExecution(options, identity.key.startsWith("file:") ? { expectedIdentity: {
				kind: "file",
				physicalIdentity: identity.key.slice(5),
				nativeLocation: identity.canonicalPath,
				birthtime: identity.birthtime
			} } : {});
			execution = captured;
			releaseExecution = () => captured.release();
		}
		const source = {
			assertCurrent: assertAdmission,
			createAdmission: (binding) => () => ({
				nativeLocations: binding.nativeLocations,
				admission: createSqliteWorkerOperationAdmission((request, grant) => {
					binding.authorize(request);
					assertAdmission();
					if (publishAlias && request.stage === "prepare" && isRecord(request.facts) && request.facts.kind === "agent-validation-start") publishAlias = captureOpenClawAgentDatabaseAliasPublication({
						agentId,
						path: pathname
					});
					if (!grant()) throw new Error("Agent database preparation lost its admission");
				}, binding.attachment)
			})
		};
		await runOpenClawAgentWorkerWrite(options, () => execution.prepare(source, signal));
		assertAdmission();
		publishAlias?.(execution.captureGenerationClaim().identity, getOpenClawAgentDatabaseValidationForTransfer({
			agentId,
			path: identity.canonicalPath
		}));
		return await run("worker");
	} finally {
		try {
			await releaseExecution?.();
		} finally {
			unregister();
			completion.resolve();
		}
	}
}
//#endregion
//#region src/state/openclaw-agent-db-admission.ts
/** Refusal must unwind ownership without entering corruption repair or changing its caller error. */
function assertAgentDatabaseOpenAuthority(operation, assertCurrent) {
	try {
		assertCurrent?.();
	} catch (error) {
		const refusal = new Error("Agent database open authority was refused", { cause: error });
		try {
			operation.throw(refusal);
		} catch (cleanupError) {
			if (cleanupError !== refusal) throw new AggregateError([error, cleanupError], `Agent database authority and cleanup failed: ${cleanupError instanceof Error ? cleanupError.message : String(cleanupError)}`, { cause: cleanupError });
		}
		throw error;
	}
}
function assertAgentDatabaseOperationCurrent(database, options, pending, assertCurrent) {
	pending.controller.signal.throwIfAborted();
	assertAgentDatabaseAdmitted(database.agentId, { env: options.env });
	if (cache.databases.get(pending.path) !== database || !database.db.isOpen) throw new Error(`Agent database closed before its admitted operation: ${pending.path}`);
	assertAgentDeletionDatabaseCleanupAccess(database, options);
	assertAgentCreationClaimAccess(database, options);
	assertCurrent?.();
}
function assertAgentDatabaseWriteAllowed(pathname) {
	if (path.basename(pathname) === "incognito-openclaw-agent.sqlite") throw new Error("Incognito sessions use the memory session actor, not a SQLite database.");
	if (isArtifactPreservingStateRead("agent", pathname)) throw new Error("Programming error: writable agent database open during read-only inspection.");
}
/** Bind admission drivers to the canonical private database-open generator. */
function createOpenClawAgentDatabaseAdmissionOwner(openSteps) {
	/** Open or return a cached per-agent database after schema and owner validation. */
	function openOpenClawAgentDatabase(options, preparedLease, registrationObserver) {
		return openAgentDatabase(options, preparedLease, registrationObserver);
	}
	function openAgentDatabase(options, preparedLease, registrationObserver, repairAdmission) {
		assertAgentDatabaseWriteAllowed(resolveOpenClawAgentSqlitePath(options));
		const run = () => {
			const steps = openSteps(options, void 0, preparedLease, registrationObserver, repairAdmission);
			const assertCurrent = () => {
				repairAdmission?.assertCurrent?.();
				if (preparedLease && !isMainThread) requestSqliteWorkerOperationAdmission({
					stage: "prepare",
					facts: {
						kind: "agent-open-resume",
						lease: preparedLease.receipt
					}
				});
			};
			const repair = preparedLease?.startupRepair;
			return runSqliteIntegrityOperationSync(steps, () => assertAgentDatabaseOpenAuthority(steps, assertCurrent), repair && !isMainThread ? (check, error) => repair(check, error, assertCurrent) : void 0);
		};
		const scope = getOpenClawDatabaseMaintenanceScope();
		return scope ? scope.run(run) : run();
	}
	function runOpenClawAgentWriteTransaction(operation, options, transactionOptions = {}) {
		const { repairAdmission, ...writeOptions } = transactionOptions;
		const database = openAgentDatabase(options, void 0, void 0, repairAdmission);
		const deletionCommit = getAgentDeletionDatabaseCleanup(options)?.withCommit;
		const withCommit = repairAdmission ? (commit) => {
			repairAdmission.assertCurrent?.();
			if (repairAdmission.expectedIdentity) assertOpenClawAgentDatabaseIdentity(database, repairAdmission.expectedIdentity);
			if (deletionCommit) deletionCommit(commit);
			else commit();
		} : deletionCommit;
		return withSqlitePostCommitPublications(database.db, () => runSqliteImmediateTransactionSync(database.db, () => {
			assertAgentDeletionDatabaseCleanupAccess(database, options);
			assertAgentCreationClaimAccess(database, options);
			return operation(database);
		}, {
			busyTimeoutMs: writeOptions.busyTimeoutMs ?? 5e3,
			databaseLabel: database.path,
			...writeOptions,
			operationLabel: writeOptions.operationLabel ?? "agent.write",
			withCommit
		}));
	}
	/** Released SDK guards may read SQLite; preserve their native open and integrity-resume checkpoints. */
	function withOpenClawAgentDatabaseAsync(inputOptions, operation, assertCurrent, signal) {
		const run = () => runAgentDatabaseAsync(inputOptions, operation, assertCurrent, signal, "native");
		const scope = getOpenClawDatabaseMaintenanceScope();
		return scope ? scope.run(run) : run();
	}
	/** Runtime authority runs in worker grants: same-owner row predicates belong in the worker. */
	function withOpenClawAgentDatabaseRuntime(inputOptions, operation, assertCurrent, signal) {
		const run = () => runAgentDatabaseAsync(inputOptions, operation, assertCurrent, signal);
		const scope = getOpenClawDatabaseMaintenanceScope();
		return scope ? scope.run(run) : run();
	}
	/** Core callers retain their original creating reference through native handle admission. */
	function withOpenClawAgentDatabaseRuntimeFromExecution(inputOptions, execution, operation, assertCurrent, signal) {
		const agentId = normalizeAgentId(inputOptions.agentId);
		const pathname = resolveOpenClawAgentSqlitePath({
			...inputOptions,
			agentId
		});
		const assertExecutionCurrent = () => {
			execution.assertCurrent();
			if (execution.agentId !== agentId || execution.path !== pathname) throw new Error("Agent runtime admission differs from its captured execution");
			assertCurrent?.();
		};
		const run = () => runAgentDatabaseAsync(inputOptions, operation, assertExecutionCurrent, signal, void 0, execution);
		const scope = getOpenClawDatabaseMaintenanceScope();
		return scope ? scope.run(run) : run();
	}
	async function runAgentDatabaseAsync(inputOptions, operation, assertCurrent, signal, prepared, execution) {
		signal?.throwIfAborted();
		assertCurrent?.();
		const options = {
			...inputOptions,
			env: cloneEnvWithPlatformSemantics(inputOptions.env ?? process.env)
		};
		const agentId = normalizeAgentId(options.agentId);
		const pathname = resolveOpenClawAgentSqlitePath({
			...options,
			agentId
		});
		assertAgentDatabaseWriteAllowed(pathname);
		options.env.OPENCLAW_STATE_DIR = resolveStateDir(options.env);
		options.path = pathname;
		if (cache.terminal.peek(pathname)) await revalidateAgentDatabaseTerminalOpenAsync(pathname, assertCurrent, signal);
		const cached = cache.databases.get(pathname);
		const schema = getOpenClawAgentDatabaseValidationForTransfer({
			agentId,
			path: pathname
		})?.schema;
		if (!prepared && isMainThread && (!cached?.db.isOpen || !schema || Atomics.load(new Int32Array(schema.valid), 0) !== 1) && !cache.pending.has(pathname)) return withWorkerAdmission(options, assertCurrent, signal, (preparation) => runAgentDatabaseAsync(options, operation, assertCurrent, signal, preparation, execution), execution);
		const existing = cache.pending.get(pathname);
		if (existing?.agentId !== void 0 && existing.agentId !== agentId) throw new Error(`Agent database ${pathname} is opening for ${existing.agentId}`);
		if (existing?.controller.signal.aborted) return existing.promise.then(() => runAgentDatabaseAsync(options, operation, assertCurrent, signal, prepared, execution), () => runAgentDatabaseAsync(options, operation, assertCurrent, signal, prepared, execution));
		const pending = existing ?? startOpenClawAgentDatabaseAdmission(options, agentId, pathname, assertCurrent, prepared === "worker");
		pending.operations += 1;
		return racePromiseWithAbortSignal(pending.promise, signal).then((database) => {
			signal?.throwIfAborted();
			assertAgentDatabaseOperationCurrent(database, options, pending, assertCurrent);
			observeOpenClawDatabaseMaintenanceResource(database.db);
			return operation(database);
		}).finally(() => {
			pending.operations -= 1;
			if (!pending.operations) {
				if (!pending.releaseBorrow) pending.controller.abort(/* @__PURE__ */ new Error("Agent database admission has no waiting callers"));
				pending.releaseBorrow?.();
			}
		});
	}
	/** Run on a Worker to keep its same-connection integrity check outside the parent writer. */
	function withOpenClawAgentDatabaseAdmission(inputOptions, withAdmission, operation) {
		const run = () => runAgentDatabaseAdmission(inputOptions, withAdmission, operation);
		const scope = getOpenClawDatabaseMaintenanceScope();
		return scope ? scope.run(() => scope.track(run())) : run();
	}
	async function runAgentDatabaseAdmission(inputOptions, withAdmission, operation) {
		const options = {
			...inputOptions,
			env: cloneEnvWithPlatformSemantics(inputOptions.env ?? process.env)
		};
		const agentId = normalizeAgentId(options.agentId);
		const pathname = resolveOpenClawAgentSqlitePath({
			...options,
			agentId
		});
		assertAgentDatabaseWriteAllowed(pathname);
		if (cache.terminal.peek(pathname)) await revalidateAgentDatabaseTerminalOpenAsync(pathname);
		const existing = cache.pending.get(pathname);
		if (existing) {
			if (existing.agentId !== agentId) throw new Error(`Agent database ${pathname} is opening for ${existing.agentId}`);
			try {
				await existing.promise;
			} catch (error) {
				if (!existing.controller.signal.aborted) throw error;
			}
			return withOpenClawAgentDatabaseAdmission(options, withAdmission, operation);
		}
		const admission = createOpenClawAgentDatabaseAdmission(agentId, pathname);
		const { pending } = admission;
		pending.promise.catch(() => {});
		pending.operations += 1;
		const steps = openSteps(options, pending);
		let check;
		let failure;
		let suspended = false;
		try {
			while (true) {
				const outcome = await withAdmission(async (assertCurrent, validation, integrityRevoked) => {
					suspended = false;
					assertAgentDatabaseOpenAuthority(steps, () => {
						assertCurrent();
						assertOpenClawAgentDatabaseAdmissionCurrent(options, pending);
					});
					pending.validation = validation;
					pending.integrityRevoked = integrityRevoked;
					const step = failure ? steps.throw(failure.error) : steps.next();
					if (!step.done) {
						suspended = true;
						return {
							done: false,
							check: step.value
						};
					}
					pending.releaseBorrow = retainAgentDatabase(step.value.db);
					admission.complete(step.value);
					const assertOperationCurrent = () => assertAgentDatabaseOperationCurrent(step.value, options, pending, assertCurrent);
					assertOperationCurrent();
					const flushMaintenance = isMainThread ? void 0 : registerDeferredSqliteWalWriteAdmission(step.value.db);
					flushMaintenance?.(assertOperationCurrent);
					const result = await operation(step.value);
					flushMaintenance?.(assertOperationCurrent);
					return {
						done: true,
						result
					};
				});
				if (outcome.done) return outcome.result;
				check = outcome.check;
				failure = void 0;
				try {
					pending.controller.signal.throwIfAborted();
					runSqliteIntegrityCheckSync(check);
				} catch (error) {
					failure = { error };
				}
			}
		} catch (error) {
			const failures = [error];
			if (suspended) {
				const cancellation = new Error(`Agent database admission failed: ${pathname}`, { cause: error });
				try {
					steps.throw(cancellation);
				} catch (cleanupError) {
					if (cleanupError !== cancellation) failures.push(cleanupError);
				}
			}
			const terminalFailure = failures.length === 1 ? error : new AggregateError(failures, "Agent database admission and cleanup failed", { cause: error });
			admission.fail(terminalFailure);
			throw terminalFailure;
		} finally {
			pending.operations -= 1;
			if (!pending.operations) pending.releaseBorrow?.();
		}
	}
	function createOpenClawAgentDatabaseAdmission(agentId, pathname) {
		assertAgentDatabaseResourceAdmission({
			agentId,
			path: pathname
		});
		const completion = createDeferredCore();
		const pending = {
			agentId,
			path: pathname,
			controller: new AbortController(),
			promise: completion.promise,
			operations: 0
		};
		cache.pending.set(pathname, pending);
		cache.activePending.add(pending);
		const retire = () => {
			if (cache.pending.get(pathname) === pending) cache.pending.delete(pathname);
			cache.activePending.delete(pending);
		};
		return {
			pending,
			complete: (database) => {
				retire();
				if (pending.controller.signal.aborted || cache.databases.get(pathname) !== database || !database.db.isOpen) {
					const error = pending.controller.signal.reason ?? /* @__PURE__ */ new Error(`Agent database closed before admission completed: ${pathname}`);
					completion.reject(error);
					throw error;
				}
				completion.resolve(database);
			},
			fail: (error) => {
				retire();
				completion.reject(error);
			}
		};
	}
	function assertOpenClawAgentDatabaseAdmissionCurrent(options, pending) {
		const pathname = pending.path;
		pending.controller.signal.throwIfAborted();
		assertAgentDatabaseAdmitted(pending.agentId, { env: options.env });
		if (cache.pending.get(pathname) !== pending) throw new Error(`Agent database open was replaced: ${pathname}`);
		assertAgentCreationClaimCurrent(options);
		getAgentDeletionDatabaseCleanup(options)?.assertCurrent();
		pending.assertHeld?.();
	}
	function startOpenClawAgentDatabaseAdmission(options, agentId, pathname, assertCurrent, workerPrepared = false) {
		const admission = createOpenClawAgentDatabaseAdmission(agentId, pathname);
		const { pending } = admission;
		pending.workerPrepared = workerPrepared;
		const operation = openSteps(options, pending);
		(async () => {
			assertAgentDatabaseOpenAuthority(operation, assertCurrent);
			let step = operation.next();
			while (!step.done) {
				let failure;
				let failed = false;
				try {
					await assertSqliteIntegrityInWorker(pathname, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, pending.controller.signal, void 0, step.value.timing);
				} catch (error) {
					failure = error;
					failed = true;
				}
				assertAgentDatabaseOpenAuthority(operation, () => {
					assertOpenClawAgentDatabaseAdmissionCurrent(options, pending);
					assertCurrent?.();
				});
				step = failed ? operation.throw(failure) : operation.next();
			}
			pending.releaseBorrow = retainAgentDatabase(step.value.db);
			return step.value;
		})().then(admission.complete, admission.fail).catch(admission.fail);
		return pending;
	}
	return {
		openOpenClawAgentDatabase,
		runOpenClawAgentWriteTransaction,
		withOpenClawAgentDatabaseAsync,
		withOpenClawAgentDatabaseRuntime,
		withOpenClawAgentDatabaseRuntimeFromExecution,
		withOpenClawAgentDatabaseAdmission
	};
}
//#endregion
//#region src/state/openclaw-agent-db-permissions.ts
const OPENCLAW_AGENT_DB_DIR_MODE = 448;
const OPENCLAW_AGENT_DB_FILE_MODE = 384;
function ensureMode(target, mode) {
	if (process.platform === "win32" || (statSync(target).mode & 4095) !== mode) chmodSync(target, mode);
}
function ensureOpenClawAgentDatabasePermissions(pathname, options) {
	const dir = path.dirname(pathname);
	const defaultPath = resolveOpenClawAgentSqlitePath({
		agentId: options.agentId,
		env: options.env
	});
	const isDefaultAgentDatabase = path.resolve(pathname) === path.resolve(defaultPath);
	const dirExisted = existsSync(dir);
	mkdirSync(dir, {
		recursive: true,
		mode: OPENCLAW_AGENT_DB_DIR_MODE
	});
	if (isDefaultAgentDatabase || !dirExisted) ensureMode(dir, OPENCLAW_AGENT_DB_DIR_MODE);
	for (const candidate of resolveSqliteDatabaseFilePaths(pathname)) try {
		ensureMode(candidate, OPENCLAW_AGENT_DB_FILE_MODE);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
}
//#endregion
//#region src/state/openclaw-agent-db-readonly-open.ts
function readOpenClawAgentDatabase(database, operation) {
	try {
		return {
			found: true,
			value: operation(database)
		};
	} catch (error) {
		throw sqlitePrimaryResultCode(error) === 1 ? classifyOpenClawAgentDatabaseReadError(database.db, error) : error;
	}
}
function hasAdmittedAgentReadOnlySchema(database) {
	const userVersion = assertSupportedAgentSchemaVersion(database.db, database.path);
	const schemaMeta = readExistingAgentSchemaMeta(database.db);
	assertCanonicalAgentPersistenceVersion(database.db, database.path, userVersion);
	if (!schemaMeta) return false;
	assertExistingAgentSchemaOwner(schemaMeta, database.agentId, database.path);
	assertCanonicalSessionValidationSchema(database.db);
	return true;
}
/** Admit ownership and consume its rows in the same freshly pinned snapshot. */
function readOpenClawAgentDatabaseSnapshot(database, operation) {
	return {
		found: true,
		value: runSqliteReadSnapshotSync(database.db, () => readOpenClawAgentDatabase(database, operation).value)
	};
}
/** Fresh-only callers do not need the writable runtime's process-held connection cache. */
function withFreshOpenClawAgentDatabaseReadOnly(operation, options, behavior = {}) {
	const opened = openOpenClawAgentDatabaseReadOnly(options, behavior);
	if (!opened.found) return opened;
	try {
		return behavior.snapshot ? readOpenClawAgentDatabaseSnapshot(opened.database, operation) : readOpenClawAgentDatabase(opened.database, operation);
	} finally {
		opened.database.close();
	}
}
/** Open one existing agent database without creating, registering, migrating, or adopting it. */
function openOpenClawAgentDatabaseReadOnly(options, behavior = {}) {
	const agentId = normalizeAgentId(options.agentId);
	const pathname = resolveOpenClawAgentSqlitePath({
		...options,
		agentId
	});
	if (isIncognitoOpenClawAgentSqlitePath(pathname, {
		agentId,
		env: options.env
	})) return {
		found: false,
		reason: "database-missing"
	};
	if (isDeletedAgentDatabasePath(pathname) || !fs.existsSync(pathname)) return {
		found: false,
		reason: "database-missing"
	};
	revalidateAgentDatabaseTerminalOpen(pathname);
	const persistedQuarantine = readOpenClawDatabaseQuarantineFailure("agent", pathname, { env: options.env });
	if (persistedQuarantine) {
		recordOpenClawAgentDatabaseReadOpenFailure(persistedQuarantine);
		throw persistedQuarantine;
	}
	let db;
	try {
		db = openSqliteReadOnlyDatabase(pathname, {
			timeout: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
			...behavior.allowExtension ? { allowExtension: true } : {}
		});
	} catch (error) {
		recordOpenClawAgentDatabaseReadOpenFailure(error);
		throw error;
	}
	let closed = false;
	let unregister;
	const close = () => {
		if (closed) return;
		if (db.isOpen) db.close();
		closed = true;
		unregister?.();
		unregister = void 0;
	};
	try {
		enableNodeSqliteKyselyStatementCache(db);
		registerOpenClawAgentDatabaseIdentity(db);
		const privatePath = isArtifactPreservingStateRead("agent", pathname) ? db.location() : void 0;
		const database = {
			agentId,
			db,
			path: privatePath ?? pathname,
			close
		};
		if (!(adoptOpenClawAgentDatabaseSchema(database) || runSqliteReadOperationSync(db, () => {
			admitSqliteSchema(db);
			if (!hasAdmittedAgentReadOnlySchema(database)) return false;
			const schema = getAdmittedSqliteSchemaFacts(database.db);
			if (schema && hasPendingAgentStartupColumns(schema.tableSql)) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${database.path} requires writable startup admission before session reads; restart the Gateway or run openclaw doctor --fix.`);
			return true;
		}))) {
			close();
			return {
				found: false,
				reason: "schema-missing"
			};
		}
		if (!isMainThread) {
			loadOpenClawAgentCanonicalValidationReceipt(database);
			hasOpenClawAgentCanonicalValidation(database);
		}
		if (behavior.lifecycle === "agent") unregister = registerOpenClawAgentDatabaseSyncResource({
			agentId,
			path: pathname,
			revoke: close,
			close
		});
		return {
			found: true,
			database
		};
	} catch (error) {
		close();
		recordOpenClawAgentDatabaseReadOpenFailure(error);
		throw error;
	}
}
//#endregion
//#region src/state/openclaw-agent-db-readonly-scope.ts
const readOnlyScope = new AsyncLocalStorage();
const log = createSubsystemLogger("state/agent-db");
const retainedScopes = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseReadOnlyScopes"), () => ({
	paths: /* @__PURE__ */ new Map(),
	active: /* @__PURE__ */ new Set()
}));
/** One retained connection, revoked by its caller, database lifecycle, or idle expiry. */
var OpenClawAgentDatabaseReadOnlyScope = class {
	constructor(cached = false) {
		this.cached = cached;
		this.borrowers = 0;
	}
	get hasRetainedConnection() {
		return this.database !== void 0;
	}
	invalidateProjection(databaseIdentity, invalidate) {
		if (this.database && findOpenClawAgentDatabaseIdentity(this.database)?.identity === databaseIdentity) invalidate(this.database.db);
	}
	closeIfIdle() {
		if (this.borrowers === 0 && (!this.database?.db.isOpen || !this.database.db.isTransaction)) this.discardConnection();
	}
	close() {
		clearTimeout(this.idleTimer);
		this.idleTimer = void 0;
		this.database?.close();
		this.database = void 0;
		this.borrowers = 0;
		if (this.target && retainedScopes.paths.get(this.target.path) === this) retainedScopes.paths.delete(this.target.path);
		this.target = void 0;
		this.unregisterResource?.();
		this.unregisterResource = void 0;
		retainedScopes.active.delete(this);
		if (retainedScopes.active.size === 0) {
			retainedScopes.unregisterExit?.();
			retainedScopes.unregisterExit = void 0;
		}
	}
	discardConnection() {
		const target = this.target;
		this.close();
		if (!this.cached) this.target = target;
	}
	touch() {
		if (!this.database) return;
		if (this.idleTimer) {
			this.idleTimer.refresh();
			return;
		}
		this.idleTimer = runInDetachedAsyncContext(() => setTimeout(() => {
			this.idleTimer = void 0;
			try {
				this.closeIfIdle();
			} catch (error) {
				log.warn("Idle agent read-only database cleanup failed", {
					path: this.database?.path,
					error
				});
			} finally {
				this.touch();
			}
		}, SQLITE_IDLE_HANDLE_TTL_MS));
		this.idleTimer.unref();
	}
	run(target, operation) {
		if (this.target?.agentId !== target.agentId || this.target.path !== target.path) this.close();
		this.target = target;
		return readOnlyScope.run(this, operation);
	}
	matches(agentId, pathname) {
		return this.target?.agentId === agentId && this.target.path === pathname;
	}
	acquire(options) {
		const finish = (database) => {
			const requestedAgentId = normalizeAgentId(options.agentId);
			if (database.agentId !== requestedAgentId) throw new Error(`OpenClaw agent database ${database.path} belongs to agent ${database.agentId}; requested agent ${requestedAgentId}.`);
			observeOpenClawDatabaseMaintenanceResource(this.unregisterResource);
			this.touch();
			return {
				found: true,
				database
			};
		};
		if (this.database && !isOpenClawAgentDatabasePathCurrent(this.database)) this.discardConnection();
		if (this.database) assertAgentDatabaseTerminalOpenAllowed(this.database.path);
		if (!this.database) {
			const opened = openOpenClawAgentDatabaseReadOnly(options);
			if (!opened.found) {
				this.discardConnection();
				return opened;
			}
			this.database = opened.database;
			this.target = {
				...this.target,
				agentId: this.database.agentId,
				path: this.database.path
			};
			try {
				this.unregisterResource = registerOpenClawAgentDatabaseSyncResource({
					agentId: this.target.agentId,
					path: this.target.path,
					revoke: () => this.close(),
					close: () => this.close()
				});
				retainedScopes.active.add(this);
				if (this.cached) retainedScopes.paths.set(this.database.path, this);
				retainedScopes.unregisterExit ??= registerSqliteCacheExitClose(() => {
					for (const scope of retainedScopes.active) scope.close();
				});
			} catch (error) {
				this.discardConnection();
				throw error;
			}
		}
		const database = this.database;
		const validation = this.target?.validation;
		if (validation && !adoptOpenClawAgentDatabaseValidation(database, validation)) throw new Error("Session reader validation does not match its current physical owner");
		return finish(database);
	}
	releaseBorrow(database) {
		if (this.database !== database) return;
		this.borrowers--;
		if (this.cached && this.borrowers === 0 && this.database && (!this.database.db.isOpen || this.database.db.isTransaction)) this.discardConnection();
		else this.touch();
	}
	retain(options) {
		const opened = this.database?.db.isOpen && this.database.db.isTransaction ? openOpenClawAgentDatabaseReadOnly(options) : this.acquire(options);
		if (!opened.found) return opened;
		const { database } = opened;
		const shared = database === this.database;
		if (shared) this.borrowers++;
		return {
			found: true,
			database,
			claim: createOpenClawAgentDatabaseClaim(database, () => {
				if (shared) this.releaseBorrow(database);
				else database.close();
			})
		};
	}
	read(operation, options, behavior = {}) {
		if (this.database?.db.isOpen && this.database.db.isTransaction) return withFreshOpenClawAgentDatabaseReadOnly(operation, options, behavior);
		const opened = this.acquire(options);
		if (!opened.found) return opened;
		const { database } = opened;
		this.borrowers++;
		try {
			return behavior.snapshot ? readOpenClawAgentDatabaseSnapshot(database, operation) : runSqliteReadOperationSync(database.db, () => readOpenClawAgentDatabase(database, operation));
		} catch (error) {
			if (this.cached && this.borrowers === 1) this.discardConnection();
			throw error;
		} finally {
			this.releaseBorrow(database);
		}
	}
};
function cachedScope(options) {
	let scope = retainedScopes.paths.get(options.path);
	if (!scope) {
		scope = new OpenClawAgentDatabaseReadOnlyScope(true);
		scope.run(options, () => {});
		retainedScopes.paths.set(options.path, scope);
	}
	return scope;
}
/** Writable admission retires an idle reader before opening the same physical file. */
function closeIdleOpenClawAgentDatabaseReadOnly(pathname) {
	retainedScopes.paths.get(pathname)?.closeIfIdle();
}
/** Reuse the caller's matching read scope, or this thread's idle-expiring reader. */
function withScopedOpenClawAgentDatabaseReadOnly(operation, options, behavior = {}) {
	if (behavior.allowExtension) return withFreshOpenClawAgentDatabaseReadOnly(operation, options, behavior);
	const scope = readOnlyScope.getStore();
	return (scope?.matches(options.agentId, options.path) ? scope : cachedScope(options)).read(operation, options, behavior);
}
//#endregion
//#region src/infra/zstd-codec.ts
let resolvedCodec;
/** Resolve the process runtime once; persisted readers must reject unsupported compressed data. */
function resolveZstdCodec() {
	if (resolvedCodec !== void 0) return resolvedCodec;
	if (typeof zlib.zstdCompressSync !== "function" || typeof zlib.zstdDecompressSync !== "function") {
		resolvedCodec = null;
		return resolvedCodec;
	}
	const compress = zlib.zstdCompressSync.bind(zlib);
	const decompress = zlib.zstdDecompressSync.bind(zlib);
	resolvedCodec = {
		compress: (data, level, checksum) => {
			if (level === void 0 && checksum === void 0) return compress(data);
			return compress(data, { params: {
				...level === void 0 ? {} : { [zlib.constants.ZSTD_c_compressionLevel]: level },
				...checksum === void 0 ? {} : { [zlib.constants.ZSTD_c_checksumFlag]: checksum }
			} });
		},
		decompress: (data, maxOutputLength) => decompress(data, maxOutputLength === void 0 ? void 0 : { maxOutputLength })
	};
	return resolvedCodec;
}
//#endregion
//#region src/infra/session-cost-usage-rollup-codec.ts
const USAGE_COST_ROLLUP_FORMAT_VERSION = 1;
const USAGE_COST_ROLLUP_SCOPE = "session-cost-usage-rollup-v3";
const zstd = resolveZstdCodec();
function encodeUsageCostRollup(entry) {
	const json = JSON.stringify(entry.rollup);
	const raw = Buffer.from(json, "utf8");
	const compressed = raw.byteLength >= 1024 ? zstd?.compress(raw, 1) : void 0;
	const useCompressed = compressed !== void 0 && compressed.byteLength < raw.byteLength;
	const bytes = useCompressed ? compressed : raw;
	const envelope = {
		version: entry.version,
		pricingFingerprint: entry.pricingFingerprint,
		checkpoint: entry.checkpoint,
		scannedAt: entry.scannedAt,
		parsedRecords: entry.parsedRecords,
		countedRecords: entry.countedRecords,
		format: USAGE_COST_ROLLUP_FORMAT_VERSION,
		body: {
			encoding: useCompressed ? "zstd" : "identity",
			bytes: raw.byteLength,
			storedBytes: bytes.byteLength,
			utf16Length: json.length,
			sha256: sha256Hex(raw)
		}
	};
	return {
		valueJson: JSON.stringify(envelope),
		blob: Uint8Array.from(bytes)
	};
}
//#endregion
//#region src/infra/session-cost-usage-cache-migration.ts
const PREVIOUS_SCOPE = "session-cost-usage-rollup-v2";
/** Migration-only reader for the version-6 complete-JSON representation. */
function decodePreviousRollup(valueJson) {
	const value = safeParseJsonRecord(valueJson ?? "");
	if (!value || value.version !== 6 || typeof value.pricingFingerprint !== "string" || !isRecord(value.checkpoint) || value.checkpoint.kind !== "jsonl" && value.checkpoint.kind !== "sqlite" || typeof value.scannedAt !== "number" || typeof value.parsedRecords !== "number" || typeof value.countedRecords !== "number" || !isRecord(value.rollup) || !isRecord(value.rollup.buckets) || !isRecord(value.rollup.untimestamped)) return;
	return value;
}
/** Caller owns the migration transaction; retain at most one complete report body at a time. */
function migrateSessionCostUsageRollupStorage(db, renewAuthority) {
	const cache = getNodeSqliteKysely(db);
	let afterKey;
	for (;;) {
		renewAuthority?.();
		let query = cache.selectFrom("cache_entries").select([
			"key",
			"value_json",
			"updated_at"
		]).where("scope", "=", PREVIOUS_SCOPE).orderBy("key", "asc").limit(1);
		if (afterKey !== void 0) query = query.where("key", ">", afterKey);
		const row = executeSqliteQuerySync(db, query).rows[0];
		if (!row) break;
		afterKey = row.key;
		const entry = decodePreviousRollup(row.value_json);
		if (entry) {
			const encoded = encodeUsageCostRollup(entry);
			executeSqliteQuerySync(db, cache.insertInto("cache_entries").values({
				scope: USAGE_COST_ROLLUP_SCOPE,
				key: row.key,
				value_json: encoded.valueJson,
				blob: encoded.blob,
				updated_at: row.updated_at,
				expires_at: null
			}).onConflict((conflict) => conflict.columns(["scope", "key"]).doNothing()));
		}
		executeSqliteQuerySync(db, cache.deleteFrom("cache_entries").where("scope", "=", PREVIOUS_SCOPE).where("key", "=", row.key));
	}
}
//#endregion
//#region src/state/openclaw-agent-db-session-provenance.ts
function backfillTranscriptMutationWatermarks(db) {
	if (!tableExists(db, "transcript_events")) return;
	db.exec(`
    UPDATE sessions
    SET
      transcript_updated_at = COALESCE(
        transcript_updated_at,
        (SELECT MAX(transcript_events.created_at)
         FROM transcript_events
         WHERE transcript_events.session_id = sessions.session_id)
      ),
      transcript_observed_at = COALESCE(transcript_observed_at, updated_at)
    WHERE EXISTS (
      SELECT 1 FROM transcript_events
      WHERE transcript_events.session_id = sessions.session_id
    );
  `);
}
//#endregion
//#region src/state/openclaw-agent-db-legacy-schema.ts
function migrateOpenClawAgentSchema(db) {
	if (readSqliteUserVersion(db) >= 27) return;
	const columns = readSqliteTableColumns(db, "sessions");
	if (!columns) return;
	for (const [name, definition] of Object.entries({
		transcript_updated_at: "INTEGER DEFAULT NULL",
		transcript_observed_at: "INTEGER DEFAULT NULL",
		session_entry_provenance: "INTEGER NOT NULL DEFAULT 0 CHECK (session_entry_provenance IN (0, 1))",
		acp_owned: "INTEGER NOT NULL DEFAULT 0 CHECK (acp_owned IN (0, 1))",
		plugin_owner_id: "TEXT",
		hook_external_content_source: "TEXT CHECK (hook_external_content_source IS NULL OR hook_external_content_source IN ('gmail', 'webhook'))"
	})) if (!columns.has(name)) db.exec(`ALTER TABLE sessions ADD COLUMN ${name} ${definition};`);
	backfillTranscriptMutationWatermarks(db);
}
//#endregion
//#region src/state/openclaw-agent-db-session-nodes-migration.ts
const SESSION_NODE_SCHEMA_VERSION = 14;
function jsonText(path) {
	return `CASE
    WHEN json_valid(entry_json) AND json_type(entry_json, '${path}') = 'text'
    THEN NULLIF(trim(CAST(json_extract(entry_json, '${path}') AS TEXT)), '')
    ELSE NULL
  END`;
}
function jsonNumber(path) {
	return `CASE
    WHEN json_valid(entry_json) AND json_type(entry_json, '${path}') IN ('integer', 'real')
    THEN CAST(json_extract(entry_json, '${path}') AS INTEGER)
    ELSE NULL
  END`;
}
function createSessionNodes(db) {
	db.exec(`
    CREATE TABLE IF NOT EXISTS session_nodes (
      session_key TEXT NOT NULL PRIMARY KEY,
      current_session_id TEXT NOT NULL,
      entry_json TEXT NOT NULL,
      updated_at INTEGER NOT NULL,
      status TEXT CHECK (status IS NULL OR status IN ('running', 'done', 'failed', 'killed', 'timeout')),
      created_at INTEGER,
      created_via TEXT CHECK (created_via IS NULL OR created_via IN ('operator', 'spawn', 'channel', 'cron', 'talk', 'run', 'plugin', 'internal')),
      created_actor_type TEXT CHECK (created_actor_type IS NULL OR created_actor_type IN ('human', 'agent', 'system')),
      created_actor_id TEXT,
      parent_session_key TEXT,
      spawned_by TEXT,
      fork_source_session_key TEXT,
      fork_source_session_id TEXT,
      fork_source_entry_id TEXT,
      label TEXT,
      display_name TEXT,
      category TEXT,
      icon TEXT,
      pinned_at INTEGER,
      archived_at INTEGER,
      last_read_at INTEGER,
      last_interaction_at INTEGER,
      last_activity_at INTEGER
    ) STRICT;
  `);
}
/** Live entries take precedence over routes, then retained generations. */
function backfillSessionNodes(db) {
	const entryColumns = readSqliteTableColumns(db, "session_entries");
	const routeColumns = readSqliteTableColumns(db, "session_routes");
	if (entryColumns) {
		const status = migratedSessionColumn(entryColumns, "status", "NULL");
		db.exec(`INSERT OR REPLACE INTO session_nodes (
        session_key, current_session_id, entry_json, updated_at, status,
        created_at, created_via, created_actor_type, created_actor_id,
        parent_session_key, spawned_by, fork_source_session_key,
        fork_source_session_id, fork_source_entry_id, label, display_name,
        category, icon, pinned_at, archived_at, last_read_at,
        last_interaction_at, last_activity_at
      ) SELECT
        session_key,
        session_id,
        entry_json,
        updated_at,
        ${status},
        ${jsonNumber("$.createdAt")},
        CASE
          WHEN json_valid(entry_json)
            AND json_extract(entry_json, '$.createdVia') IN
              ('operator', 'spawn', 'channel', 'cron', 'talk', 'run', 'plugin', 'internal')
          THEN json_extract(entry_json, '$.createdVia')
          ELSE NULL
        END,
        CASE
          WHEN json_valid(entry_json)
            AND json_extract(entry_json, '$.createdActor.type') IN ('human', 'agent', 'system')
          THEN json_extract(entry_json, '$.createdActor.type')
          WHEN ${jsonText("$.createdBy.id")} IS NOT NULL THEN 'human'
          ELSE NULL
        END,
        COALESCE(${jsonText("$.createdActor.id")}, ${jsonText("$.createdBy.id")}),
        COALESCE(${jsonText("$.parentSessionKey")}, ${jsonText("$.spawnedBy")}),
        ${jsonText("$.spawnedBy")},
        ${jsonText("$.forkSource.sessionKey")},
        ${jsonText("$.forkSource.sessionId")},
        ${jsonText("$.forkSource.entryId")},
        ${jsonText("$.label")},
        ${jsonText("$.displayName")},
        ${jsonText("$.category")},
        NULL,
        ${jsonNumber("$.pinnedAt")},
        ${jsonNumber("$.archivedAt")},
        ${jsonNumber("$.lastReadAt")},
        ${jsonNumber("$.lastInteractionAt")},
        ${jsonNumber("$.lastActivityAt")}
      FROM session_entries;`);
	}
	if (routeColumns) db.exec(`INSERT OR IGNORE INTO session_nodes
      (session_key, current_session_id, entry_json, updated_at)
      SELECT session_key, session_id, '{}', updated_at FROM session_routes;`);
	db.exec(`INSERT OR IGNORE INTO session_nodes
    (session_key, current_session_id, entry_json, updated_at)
    SELECT session_key, session_id, '{}', updated_at FROM sessions;`);
}
/** Project the legacy window owner with the migration's entry/route precedence. */
function createLegacySessionWindowSelect(db) {
	const columns = readSqliteTableColumns(db, "sessions");
	if (!columns) return;
	const entryColumns = readSqliteTableColumns(db, "session_entries");
	const routeColumns = readSqliteTableColumns(db, "session_routes");
	const ownerValue = (table, column) => `(SELECT candidate.${column}
        FROM ${table} AS candidate
        INNER JOIN session_windows AS owner_window ON owner_window.session_id = candidate.session_id
        WHERE candidate.session_id = session_windows.session_id
        ORDER BY CASE WHEN candidate.session_key = owner_window.session_key THEN 0 ELSE 1 END,
                 candidate.updated_at DESC,
                 candidate.session_key ASC
        LIMIT 1)`;
	const entryOwner = entryColumns ? ownerValue("session_entries", "session_key") : "NULL";
	const routeOwner = routeColumns ? ownerValue("session_routes", "session_key") : "NULL";
	const currentEntryJson = entryColumns ? ownerValue("session_entries", "entry_json") : "NULL";
	return {
		columns: `session_id, session_key, previous_session_id, reason, session_scope,
      created_at, updated_at, transcript_updated_at, transcript_observed_at,
      session_entry_provenance, acp_owned, plugin_owner_id,
      hook_external_content_source, started_at, ended_at, status, chat_type,
      channel, account_id, primary_conversation_id, model_provider, model,
      agent_harness_id, parent_session_key, spawned_by, display_name`,
		sql: `SELECT
      session_id,
      COALESCE(${entryOwner}, ${routeOwner}, session_key),
      CASE
        WHEN json_valid(${currentEntryJson})
        THEN NULLIF(trim(CAST(json_extract(${currentEntryJson}, '$.previousSessionId') AS TEXT)), '')
        ELSE NULL
      END,
      NULL,
      ${migratedSessionColumn(columns, "session_scope", "'conversation'")},
      created_at,
      updated_at,
      ${migratedSessionColumn(columns, "transcript_updated_at", "NULL")},
      ${migratedSessionColumn(columns, "transcript_observed_at", "NULL")},
      ${migratedSessionColumn(columns, "session_entry_provenance", "0")},
      ${migratedSessionColumn(columns, "acp_owned", "0")},
      ${migratedSessionColumn(columns, "plugin_owner_id", "NULL")},
      ${migratedSessionColumn(columns, "hook_external_content_source", "NULL")},
      ${migratedSessionColumn(columns, "started_at", "NULL")},
      ${migratedSessionColumn(columns, "ended_at", "NULL")},
      ${migratedSessionColumn(columns, "status", "NULL")},
      ${migratedSessionColumn(columns, "chat_type", "NULL")},
      ${migratedSessionColumn(columns, "channel", "NULL")},
      ${migratedSessionColumn(columns, "account_id", "NULL")},
      ${migratedSessionColumn(columns, "primary_conversation_id", "NULL")},
      ${migratedSessionColumn(columns, "model_provider", "NULL")},
      ${migratedSessionColumn(columns, "model", "NULL")},
      ${migratedSessionColumn(columns, "agent_harness_id", "NULL")},
      ${migratedSessionColumn(columns, "parent_session_key", "NULL")},
      ${migratedSessionColumn(columns, "spawned_by", "NULL")},
      ${migratedSessionColumn(columns, "display_name", "NULL")}
    FROM session_windows`
	};
}
function migrateSessionWindows(db) {
	const projection = createLegacySessionWindowSelect(db);
	if (!projection) return;
	db.exec("ALTER TABLE sessions RENAME TO session_windows;");
	db.exec(`
    DROP TABLE IF EXISTS session_windows_new;
    CREATE TABLE session_windows_new (
      session_id TEXT NOT NULL PRIMARY KEY,
      session_key TEXT NOT NULL,
      previous_session_id TEXT,
      reason TEXT CHECK (reason IS NULL OR reason IN ('initial', 'reset', 'rollover', 'fork', 'rewind', 'switch', 'recovery', 'compaction')),
      session_scope TEXT NOT NULL DEFAULT 'conversation' CHECK (session_scope IN ('conversation', 'shared-main', 'group', 'channel')),
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      transcript_updated_at INTEGER DEFAULT NULL,
      transcript_observed_at INTEGER DEFAULT NULL,
      session_entry_provenance INTEGER NOT NULL DEFAULT 0 CHECK (session_entry_provenance IN (0, 1)),
      acp_owned INTEGER NOT NULL DEFAULT 0 CHECK (acp_owned IN (0, 1)),
      plugin_owner_id TEXT,
      hook_external_content_source TEXT CHECK (hook_external_content_source IS NULL OR hook_external_content_source IN ('gmail', 'webhook')),
      started_at INTEGER,
      ended_at INTEGER,
      status TEXT CHECK (status IS NULL OR status IN ('running', 'done', 'failed', 'killed', 'timeout')),
      chat_type TEXT CHECK (chat_type IS NULL OR chat_type IN ('direct', 'group', 'channel')),
      channel TEXT,
      account_id TEXT,
      primary_conversation_id TEXT,
      model_provider TEXT,
      model TEXT,
      agent_harness_id TEXT,
      parent_session_key TEXT,
      spawned_by TEXT,
      display_name TEXT,
      FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE,
      FOREIGN KEY (primary_conversation_id) REFERENCES conversations(conversation_id) ON DELETE SET NULL
    ) STRICT;
    INSERT INTO session_windows_new (${projection.columns})
    ${projection.sql};
    DROP TABLE session_windows;
    ALTER TABLE session_windows_new RENAME TO session_windows;
  `);
}
function renameTranscriptRewriteWatermarks(db) {
	if (readSqliteTableColumns(db, "session_transcript_generations") && !readSqliteTableColumns(db, "transcript_rewrite_watermarks")) db.exec("ALTER TABLE session_transcript_generations RENAME TO transcript_rewrite_watermarks;");
}
function rebuildBoardTabs(db) {
	if (!readSqliteTableColumns(db, "board_tabs")) return;
	if (readSqliteTableColumns(db, "board_widgets")) db.exec(`
      DELETE FROM board_widgets
      WHERE NOT EXISTS (
        SELECT 1 FROM session_nodes WHERE session_nodes.session_key = board_widgets.session_key
      );
    `);
	db.exec(`
    DROP TABLE IF EXISTS board_tabs_new;
    CREATE TABLE board_tabs_new (
      session_key TEXT NOT NULL,
      tab_id TEXT NOT NULL,
      title TEXT NOT NULL,
      position INTEGER NOT NULL CHECK (position >= 0),
      chat_dock TEXT NOT NULL DEFAULT 'right' CHECK (chat_dock IN ('left', 'right', 'bottom', 'hidden')),
      created_by TEXT NOT NULL CHECK (created_by IN ('user', 'agent')),
      revision INTEGER NOT NULL CHECK (revision >= 0),
      PRIMARY KEY (session_key, tab_id),
      FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
    ) STRICT;
    INSERT INTO board_tabs_new (
      session_key, tab_id, title, position, chat_dock, created_by, revision
    )
    SELECT b.session_key, b.tab_id, b.title, b.position, b.chat_dock, b.created_by, b.revision
    FROM board_tabs AS b
    INNER JOIN session_nodes AS n ON n.session_key = b.session_key;
    DROP TABLE board_tabs;
    ALTER TABLE board_tabs_new RENAME TO board_tabs;
  `);
}
function rebuildHeartbeatOutcomes(db) {
	const columns = readSqliteTableColumns(db, "heartbeat_outcomes");
	if (!columns) return;
	db.exec(`
    DROP TABLE IF EXISTS heartbeat_outcomes_new;
    CREATE TABLE heartbeat_outcomes_new (
      session_key TEXT NOT NULL PRIMARY KEY,
      run_session_key TEXT NOT NULL,
      outcome TEXT NOT NULL CHECK (outcome IN ('progress', 'done', 'blocked', 'needs_attention')),
      summary TEXT NOT NULL,
      response_reason TEXT,
      priority TEXT CHECK (priority IS NULL OR priority IN ('low', 'normal', 'high')),
      next_check TEXT,
      task_names_json TEXT,
      wake_source TEXT,
      wake_reason TEXT,
      occurred_at INTEGER NOT NULL,
      context_run_id TEXT,
      context_claimed_at INTEGER,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
    ) STRICT;
    INSERT INTO heartbeat_outcomes_new (
      session_key, run_session_key, outcome, summary, response_reason, priority,
      next_check, task_names_json, wake_source, wake_reason, occurred_at,
      context_run_id, context_claimed_at, updated_at
    )
    SELECT
      h.session_key,
      h.run_session_key,
      h.outcome,
      h.summary,
      ${migratedSessionColumn(columns, "response_reason", "NULL")},
      ${migratedSessionColumn(columns, "priority", "NULL")},
      ${migratedSessionColumn(columns, "next_check", "NULL")},
      ${migratedSessionColumn(columns, "task_names_json", "NULL")},
      ${migratedSessionColumn(columns, "wake_source", "NULL")},
      ${migratedSessionColumn(columns, "wake_reason", "NULL")},
      h.occurred_at,
      ${migratedSessionColumn(columns, "context_run_id", "NULL")},
      ${migratedSessionColumn(columns, "context_claimed_at", "NULL")},
      h.updated_at
    FROM heartbeat_outcomes AS h
    INNER JOIN session_nodes AS n ON n.session_key = h.session_key;
    DROP TABLE heartbeat_outcomes;
    ALTER TABLE heartbeat_outcomes_new RENAME TO heartbeat_outcomes;
  `);
}
function rebuildSessionMembers(db) {
	if (!readSqliteTableColumns(db, "session_members")) return;
	db.exec(`
    DROP TABLE IF EXISTS session_members_new;
    CREATE TABLE session_members_new (
      session_key TEXT NOT NULL,
      identity_id TEXT NOT NULL,
      added_by TEXT NOT NULL,
      added_at INTEGER NOT NULL,
      PRIMARY KEY (session_key, identity_id),
      FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
    ) STRICT;
    INSERT INTO session_members_new (session_key, identity_id, added_by, added_at)
    SELECT m.session_key, m.identity_id, m.added_by, m.added_at
    FROM session_members AS m
    INNER JOIN session_nodes AS n ON n.session_key = m.session_key;
    DROP TABLE session_members;
    ALTER TABLE session_members_new RENAME TO session_members;
  `);
}
function rebuildTranscriptIndexState(db) {
	const columns = readSqliteTableColumns(db, "session_transcript_index_state");
	if (!columns) return;
	db.exec(`
    DROP TABLE IF EXISTS session_transcript_index_state_new;
    CREATE TABLE session_transcript_index_state_new (
      session_id TEXT NOT NULL PRIMARY KEY,
      indexed_seq INTEGER NOT NULL,
      leaf_event_id TEXT,
      needs_rebuild INTEGER NOT NULL DEFAULT 0,
      active_event_count INTEGER NOT NULL DEFAULT 0,
      active_message_count INTEGER NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (session_id) REFERENCES session_windows(session_id) ON DELETE CASCADE
    ) STRICT;
    INSERT INTO session_transcript_index_state_new (
      session_id, indexed_seq, leaf_event_id, needs_rebuild,
      active_event_count, active_message_count, updated_at
    )
    SELECT
      i.session_id,
      i.indexed_seq,
      ${migratedSessionColumn(columns, "leaf_event_id", "NULL")},
      ${migratedSessionColumn(columns, "needs_rebuild", "0")},
      ${migratedSessionColumn(columns, "active_event_count", "0")},
      ${migratedSessionColumn(columns, "active_message_count", "0")},
      i.updated_at
    FROM session_transcript_index_state AS i
    INNER JOIN session_windows AS w ON w.session_id = i.session_id;
    DROP TABLE session_transcript_index_state;
    ALTER TABLE session_transcript_index_state_new RENAME TO session_transcript_index_state;
  `);
}
/** Replace split entry/route roots with logical nodes and generation windows. */
function migrateSessionNodesAndWindows(db, previousVersion) {
	if (previousVersion >= SESSION_NODE_SCHEMA_VERSION || !readSqliteTableColumns(db, "sessions")) return;
	createSessionNodes(db);
	backfillSessionNodes(db);
	migrateSessionWindows(db);
	renameTranscriptRewriteWatermarks(db);
	rebuildBoardTabs(db);
	rebuildHeartbeatOutcomes(db);
	rebuildSessionMembers(db);
	rebuildTranscriptIndexState(db);
	db.exec(`
    DROP TABLE IF EXISTS session_routes;
    DROP TABLE IF EXISTS session_entries;
  `);
}
//#endregion
//#region src/config/sessions/session-entry-snapshot-values.ts
const sessionEntrySnapshotColumnsDefinition = [
	["sessionDiffBaseline", "session_diff_baseline_json"],
	["skillsSnapshot", "skills_snapshot_json"],
	["systemPromptReport", "system_prompt_report_json"]
];
function attachSessionEntrySnapshots(entry, row, projection = "full") {
	for (const [field, alias] of sessionEntrySnapshotColumnsDefinition) {
		if (projection !== "full" && (projection === "list" || !projection.includes(field))) {
			Reflect.deleteProperty(entry, field);
			continue;
		}
		const valueJson = row[alias];
		if (valueJson != null) {
			const value = JSON.parse(valueJson);
			Object.assign(entry, { [field]: value });
		}
	}
	return entry;
}
//#endregion
//#region src/config/sessions/session-entry-snapshots.ts
/** One statement owns hot and cold facts; JSON remains opaque to SQLite's depth limit. */
function sessionEntrySnapshotColumnsForKeys(keys, projection = "full") {
	const selectedKeys = keys === void 0 ? void 0 : sqliteStringSet(keys);
	const eb = expressionBuilder();
	return sessionEntrySnapshotColumnsDefinition.filter(([field]) => projection === "full" || projection !== "list" && projection.includes(field)).map(([field, alias]) => {
		const snapshot = eb.selectFrom("session_entry_snapshots").select("value_json").whereRef("session_entry_snapshots.session_key", "=", "session_nodes.session_key").where("field", "=", field);
		return (selectedKeys === void 0 ? snapshot : eb.case().when("session_nodes.session_key", "in", selectedKeys).then(snapshot).end()).as(alias);
	});
}
const sessionEntrySnapshotColumns = sessionEntrySnapshotColumnsForKeys();
function splitSessionEntrySnapshots(entry, mode = "complete") {
	const { sessionDiffBaseline, skillsSnapshot, systemPromptReport, ...hot } = entry;
	const values = {
		sessionDiffBaseline,
		skillsSnapshot,
		systemPromptReport
	};
	const snapshotsChanged = mode === "complete" || sessionEntrySnapshotColumnsDefinition.some(([field]) => values[field] !== mode.previousEntry?.[field] && !isDeepStrictEqual(values[field], mode.previousEntry?.[field]));
	const snapshots = [];
	for (const [field] of snapshotsChanged ? sessionEntrySnapshotColumnsDefinition : []) {
		const valueJson = JSON.stringify(values[field]);
		if (valueJson !== void 0) snapshots.push({
			field,
			valueJson
		});
	}
	const snapshotsRemoved = mode === "complete" || snapshotsChanged && sessionEntrySnapshotColumnsDefinition.some(([field]) => mode.previousEntry?.[field] !== void 0 && !snapshots.some((snapshot) => snapshot.field === field));
	return {
		entryJson: JSON.stringify(hot),
		snapshots,
		snapshotsChanged,
		snapshotsRemoved
	};
}
//#endregion
//#region src/state/openclaw-agent-session-snapshots-migration.ts
/** The existing schema owner holds maintenance authority and the outer write transaction. */
function migrateSessionEntrySnapshotsInTransaction(database) {
	database.exec("ALTER TABLE session_nodes ADD COLUMN snapshot_revision INTEGER NOT NULL DEFAULT 0");
	database.exec(sessionEntrySnapshotsSchemaSql(OPENCLAW_AGENT_SCHEMA_SQL));
	const db = getNodeSqliteKysely(database);
	const select = db.selectFrom("session_nodes").select([
		"session_key",
		"current_session_id",
		"updated_at",
		"entry_json"
	]).orderBy("session_key").limit(64);
	const selectAfter = prepareSqliteQuerySync(database, (parameter) => select.where("session_key", ">", parameter((key) => key)));
	const insert = prepareSqliteQuerySync(database, (parameter) => db.insertInto("session_entry_snapshots").values({
		session_key: parameter((row) => row.sessionKey),
		field: parameter((row) => row.field),
		value_json: parameter((row) => row.valueJson)
	}));
	const update = prepareSqliteQuerySync(database, (parameter) => db.updateTable("session_nodes").set({ entry_json: parameter((row) => row.entryJson) }).where("session_key", "=", parameter((row) => row.sessionKey)));
	const markValid = prepareSqliteQuerySync(database, (parameter) => db.updateTable("session_nodes").set({ entry_valid: 1 }).where("session_key", "=", parameter((key) => key)));
	let after;
	while (true) {
		const { rows } = after === void 0 ? executeSqliteQuerySync(database, select) : selectAfter(after);
		if (rows.length === 0) return;
		renewAgentDatabaseMaintenanceAuthorityIfPresent();
		for (const row of rows) {
			if (typeof row.session_key !== "string" || typeof row.current_session_id !== "string" || typeof row.updated_at !== "number" || typeof row.entry_json !== "string") throw new Error("Unreadable session row during snapshot migration");
			after = row.session_key;
			const entry = parseSqliteSessionEntryRecord({
				current_session_id: row.current_session_id,
				updated_at: row.updated_at,
				entry_json: row.entry_json
			});
			if (!entry) continue;
			const { entryJson, snapshots } = splitSessionEntrySnapshots(entry);
			if (snapshots.length === 0) continue;
			for (const snapshot of snapshots) insert({
				sessionKey: row.session_key,
				...snapshot
			});
			update({
				entryJson,
				sessionKey: row.session_key
			});
			markValid(row.session_key);
		}
	}
}
//#endregion
//#region src/infra/database-engine/json-values.ts
function jsonArrayValue(db, values) {
	return sql`${sql.raw(isPostgresSqlConnection(db) ? "json_build_array" : "json_array")}(${sql.join(values)})`;
}
function jsonObjectValue(db, fields) {
	return sql`${sql.raw(isPostgresSqlConnection(db) ? "json_build_object" : "json_object")}(${sql.join(Object.entries(fields).flatMap(([key, value]) => [sql.lit(key), value]))})`;
}
/** JSON-valued inputs remain JSON instead of becoming quoted strings. */
function jsonOrderedArray(db, value, orderBy) {
	const postgres = isPostgresSqlConnection(db);
	let aggregate = expressionBuilder().fn.agg(postgres ? "json_agg" : "json_group_array", [value]);
	for (const key of orderBy) aggregate = aggregate.orderBy(key, (order) => order.asc().nullsFirst());
	return postgres ? sql`coalesce(${aggregate}::text, '[]')` : aggregate;
}
/** Expand a caller-owned string map without changing JSON values into quoted text. */
function jsonObjectTextEntries(db, value) {
	const postgres = isPostgresSqlConnection(db);
	return getNodeSqliteKysely(db).fn(postgres ? "json_each_text" : "json_each", [postgres ? sql`${value}::json` : sql.val(value)]);
}
function jsonKeyPath(key) {
	return `$.${/^[A-Za-z_][A-Za-z0-9_]*$/u.test(key) ? key : JSON.stringify(key)}`;
}
function jsonExtractText(db, value, key) {
	const eb = expressionBuilder();
	return isPostgresSqlConnection(db) ? eb.fn("json_extract_path_text", [sql`${value}::json`, eb.val(key)]) : eb.fn("json_extract", [value, eb.val(jsonKeyPath(key))]);
}
function jsonOrderedTextArray(db, value, orderBy) {
	return isPostgresSqlConnection(db) ? sql`coalesce(array_to_json(array_agg(${value} order by ${orderBy}))::text, '[]')` : expressionBuilder().fn("json_group_array", [value]);
}
function jsonRemoveKey(db, value, key) {
	if (isPostgresSqlConnection(db)) return sql`(${value}::jsonb - ${key}::text)::text`;
	return expressionBuilder().fn("json_remove", [value, expressionBuilder().val(jsonKeyPath(key))]);
}
/** SQLite JSON paths at these boundaries name object keys, including nested keys. */
function objectPath(path) {
	return sql`string_to_array(substr(${path}, 3), '.')`;
}
function jsonPathValue(db, value, path, kind = "text") {
	if (!isPostgresSqlConnection(db)) return sql`json_extract(${value}, ${path})`;
	const extracted = sql`(${value}::jsonb ${sql.raw(kind === "json" ? "#>" : "#>>")} ${objectPath(path)})`;
	return sql`${extracted}${sql.raw(kind === "number" ? "::double precision" : kind === "json" ? "::text" : "")}`;
}
function jsonValid(db, value) {
	return isPostgresSqlConnection(db) ? sql`pg_input_is_valid(${value}, 'json')` : sql`json_valid(${value})`;
}
function jsonType(db, value) {
	return isPostgresSqlConnection(db) ? sql`jsonb_typeof(${value}::jsonb)` : sql`json_type(${value})`;
}
function jsonRemovePaths(db, value, paths) {
	if (!isPostgresSqlConnection(db)) return sql`json_remove(${value}, ${sql.join(paths)})`;
	let result = sql`${value}::jsonb`;
	for (const path of paths) result = sql`(${result} #- ${objectPath(path)})`;
	return sql`${result}::text`;
}
/** Set text/null, or a JSON-producing expression when json is true. */
function jsonSetPath(db, value, path, replacement, json = false) {
	if (!isPostgresSqlConnection(db)) return sql`json_set(${value}, ${path}, ${replacement})`;
	const next = json ? sql`${replacement}::jsonb` : sql`to_jsonb(${replacement}::text)`;
	return sql`jsonb_set(${value}::jsonb, ${objectPath(path)}, coalesce(${next}, 'null'::jsonb))::text`;
}
function jsonArrayElements(db, value) {
	return sql`${sql.raw(isPostgresSqlConnection(db) ? "jsonb_array_elements" : "json_each")}(${value}${sql.raw(isPostgresSqlConnection(db) ? "::jsonb" : "")})`;
}
function jsonPickObject(db, value, keys) {
	return isPostgresSqlConnection(db) ? sql`(SELECT coalesce(jsonb_object_agg(key, value), '{}'::jsonb)::text
        FROM jsonb_each(CASE WHEN jsonb_typeof(${value}::jsonb) = 'object' THEN ${value}::jsonb ELSE '{}'::jsonb END)
        WHERE key IN (${sql.join(keys)}))` : sql`(SELECT json_group_object(key, CASE type
    WHEN 'object' THEN json(value) WHEN 'array' THEN json(value)
    WHEN 'true' THEN json('true') WHEN 'false' THEN json('false')
    ELSE value END) FROM json_each(${value}) WHERE key IN (${sql.join(keys)}))`;
}
//#endregion
//#region src/config/sessions/session-entry-codec.ts
const readableContentSchema = union([string$1(), array(looseObject({ type: string$1() }))]);
const readableMessageSchema = discriminatedUnion("role", [
	looseObject({
		role: literal("user"),
		content: readableContentSchema
	}),
	looseObject({
		role: literal("assistant"),
		content: readableContentSchema
	}),
	looseObject({
		role: literal("toolResult"),
		toolCallId: string$1(),
		toolName: string$1(),
		isError: boolean(),
		content: array(unknown())
	}),
	looseObject({
		role: literal("custom"),
		customType: string$1(),
		content: readableContentSchema
	}),
	looseObject({
		role: literal("bashExecution"),
		command: string$1(),
		output: string$1()
	})
]);
const indexedSessionEntryBaseShape = {
	id: string$1().min(1),
	parentId: union([string$1(), _null()]).optional(),
	timestamp: string$1().optional()
};
const indexedSessionEntrySchema = discriminatedUnion("type", [
	looseObject({
		...indexedSessionEntryBaseShape,
		type: literal("message"),
		message: readableMessageSchema
	}),
	looseObject({
		...indexedSessionEntryBaseShape,
		type: literal("thinking_level_change"),
		thinkingLevel: string$1().min(1)
	}),
	looseObject({
		...indexedSessionEntryBaseShape,
		type: literal("model_change"),
		provider: string$1().min(1),
		modelId: string$1().min(1)
	}),
	looseObject({
		...indexedSessionEntryBaseShape,
		type: literal("compaction"),
		summary: string$1(),
		firstKeptEntryId: string$1().min(1),
		tokensBefore: custom((value) => typeof value === "number")
	}),
	looseObject({
		...indexedSessionEntryBaseShape,
		type: literal("reset"),
		reason: string().pipe(_enum([
			"new",
			"reset",
			"idle",
			"daily",
			"cron-stale"
		])),
		firstKeptEntryId: string$1().optional()
	}),
	looseObject({
		...indexedSessionEntryBaseShape,
		type: literal("branch_summary"),
		fromId: string$1(),
		summary: string$1()
	}),
	looseObject({
		...indexedSessionEntryBaseShape,
		type: literal("custom"),
		customType: string$1().min(1)
	}),
	looseObject({
		...indexedSessionEntryBaseShape,
		type: literal("custom_message"),
		customType: string$1().min(1),
		content: readableContentSchema,
		display: boolean()
	}),
	looseObject({
		...indexedSessionEntryBaseShape,
		type: literal("label"),
		targetId: string$1().min(1),
		label: string$1().optional()
	}),
	looseObject({
		...indexedSessionEntryBaseShape,
		type: literal("session_info"),
		name: string$1().optional()
	})
]);
const sessionEntryTypeSchema = _enum(indexedSessionEntrySchema.options.flatMap((entry) => [...entry.shape.type.values]));
const parentLinkedOpaqueEntrySchema = looseObject({
	type: unknown().optional().refine((type) => type !== "session" && type !== "leaf"),
	id: string$1().min(1),
	parentId: union([string$1(), _null()])
});
const opaqueLeafEntrySchema = looseObject({
	type: literal("leaf"),
	id: string$1().min(1),
	parentId: union([string$1(), _null()]),
	targetId: union([string$1(), _null()]),
	appendParentId: union([string$1(), _null()]).optional(),
	appendMode: literal("side").optional()
});
const sessionHeaderSchema = looseObject({
	type: literal("session"),
	id: string$1()
});
function findSessionTranscriptHeader(entries) {
	for (const entry of entries) if (sessionHeaderSchema.safeParse(entry).success) return entry;
}
function isIndexedSessionEntry(entry) {
	return indexedSessionEntrySchema.safeParse(entry).success;
}
function isReadableContent(value) {
	return readableContentSchema.safeParse(value).success;
}
function isReadableLegacySessionEntry(value) {
	const message = isRecord(value) && value.type === "message" ? value.message : void 0;
	return isRecord(value) && sessionEntryTypeSchema.safeParse(value.type).success && (value.type !== "message" || (isRecord(message) && message.role === "hookMessage" ? isReadableContent(message.content) : readableMessageSchema.safeParse(message).success));
}
function normalizePersistedLegacyHookMessage(value) {
	if (!isRecord(value) || value.type !== "message" || !isRecord(value.message)) return value;
	const message = value.message;
	if (message.role !== "custom" || message.customType !== void 0 || !isReadableContent(message.content)) return value;
	return {
		...value,
		message: {
			...message,
			customType: "hook"
		}
	};
}
function parseParentLinkedOpaqueEntry(record) {
	const parsed = parentLinkedOpaqueEntrySchema.safeParse(record);
	return parsed.success ? {
		id: parsed.data.id,
		parentId: parsed.data.parentId
	} : void 0;
}
function parseOpaqueLeafEntry(record) {
	const parsed = opaqueLeafEntrySchema.safeParse(record);
	if (!parsed.success) return;
	const leaf = parsed.data;
	return {
		id: leaf.id,
		parentId: leaf.parentId,
		targetId: leaf.targetId,
		...leaf.appendParentId !== void 0 ? { appendParentId: leaf.appendParentId } : {},
		...leaf.appendMode === "side" ? { appendMode: leaf.appendMode } : {}
	};
}
function classifySessionFileEntry(rawEntry, sourceVersion) {
	const entry = normalizePersistedLegacyHookMessage(rawEntry);
	if (sourceVersion < 3 && isReadableLegacySessionEntry(entry) || isIndexedSessionEntry(entry)) return {
		entry,
		recognized: true
	};
	return {
		entry,
		recognized: false
	};
}
//#endregion
//#region packages/agent-core/src/harness/session/tool-result-pairing.ts
const SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY = "openclawSyntheticMissingToolResult";
const LEGACY_MISSING_TOOL_RESULT_TEXT = "[openclaw] missing tool result in session history; inserted synthetic error result for transcript repair.";
//#endregion
//#region src/shared/model-context-message.ts
const MODEL_CONTEXT_PRIVATE_METADATA_KEYS = ["upstreamUserText"];
//#endregion
//#region src/config/sessions/session-model-context-navigation.ts
const TRANSCRIPT_NAVIGATION_KEYS = [
	"type",
	"id",
	"parentId",
	"targetId",
	"appendParentId",
	"appendMode"
];
const MODEL_CONTEXT_NAVIGATION_KEYS = [
	...TRANSCRIPT_NAVIGATION_KEYS,
	"timestamp",
	"version",
	"cwd",
	"firstKeptEntryId",
	"reason",
	"tokensBefore",
	"thinkingLevel",
	"provider",
	"modelId",
	"fromId",
	"customType",
	"display",
	"excludeFromContext",
	"label",
	"name"
];
const MODEL_MESSAGE_NAVIGATION_KEYS = [
	"role",
	"provider",
	"model",
	"timestamp",
	"excludeFromContext",
	"toolCallId",
	"toolUseId",
	"tool_call_id",
	"tool_use_id",
	"callId",
	"call_id",
	"toolName",
	"isError",
	"stopReason",
	"customType",
	"display"
];
//#endregion
//#region src/config/sessions/session-model-context-projection.ts
/** Exclude storage-only fields in SQLite, before a row's JSON crosses into JavaScript. */
function projectModelContextEventSql(db, event, omitCheckpoint, toolResultOmission, role = jsonPathValue(db, event, sql.lit("$.message.role"))) {
	const projected = jsonRemovePaths(db, event, MODEL_CONTEXT_PRIVATE_METADATA_KEYS.map((key) => `$.message.__openclaw.${key}`).map((path) => sql.val(path)));
	const modelEvent = sql`CASE WHEN ${role} = 'toolResult'
    THEN ${jsonRemovePaths(db, projected, [sql.lit("$.message.details")])} ELSE ${projected} END`;
	const boundedEvent = toolResultOmission ? sql`CASE WHEN ${toolResultOmission} IS NOT NULL AND ${role} = 'toolResult'
      THEN ${jsonSetPath(db, modelEvent, sql.lit("$.message.content"), jsonArrayValue(db, [jsonObjectValue(db, {
		type: sql.lit("text"),
		text: toolResultOmission
	})]), true)} ELSE ${modelEvent} END` : modelEvent;
	return sql`CASE WHEN ${omitCheckpoint} = 1
    THEN ${jsonRemovePaths(db, boundedEvent, [sql.lit("$.message.providerReplay")])} ELSE ${boundedEvent} END`;
}
function contentPropertySql(event, property) {
	return sql`CASE WHEN typeof(key) = 'integer' AND key < 8
    THEN json_extract(${event}, fullkey || ${`.${property}`})
    ELSE json_extract(value, ${`$.${property}`}) END`;
}
function jsonMemberValue(alias) {
	const type = sql.ref(`${alias}.type`);
	const value = sql.ref(`${alias}.value`);
	return sql`CASE ${type}
    WHEN 'object' THEN json(${value})
    WHEN 'array' THEN json(${value})
    WHEN 'true' THEN json('true') WHEN 'false' THEN json('false')
    ELSE ${value} END`;
}
/** Stored navigation serves SQL's first-key lookup and JavaScript's last-key parse. */
function projectTranscriptPayloadNavigationSql(db, event) {
	const internal = jsonPickObject(db, sql.ref("message_member.value"), [
		"runId",
		"steerTargetRunId",
		"contextFreeCommand"
	]);
	const message = sql`(SELECT json_group_object(message_member.key,
    CASE WHEN message_member.key = '__openclaw' AND message_member.type = 'object'
      THEN json(${internal}) ELSE ${jsonMemberValue("message_member")} END)
    FROM json_each(root_member.value) AS message_member
    WHERE message_member.key IN ('role', 'idempotencyKey', 'provenance', 'excludeFromContext', '__openclaw'))`;
	return sql`(SELECT json_group_object(root_member.key,
    CASE WHEN root_member.key = 'message' AND root_member.type = 'object'
      THEN json(${message}) ELSE ${jsonMemberValue("root_member")} END)
    FROM json_each(${event}) AS root_member
    WHERE root_member.key IN (${sql.join([...MODEL_CONTEXT_NAVIGATION_KEYS, "message"])}))`;
}
/** Reset boundaries select ancestry and replay roles without loading message bodies. */
function projectResetBoundaryNavigationSql(db, event) {
	const entry = jsonPickObject(db, event, [
		...TRANSCRIPT_NAVIGATION_KEYS,
		"timestamp",
		"firstKeptEntryId",
		"customType",
		"display"
	]);
	return sql`CASE WHEN ${jsonValid(db, event)} THEN
    CASE WHEN ${jsonType(db, event)} = 'object' THEN
      ${jsonSetPath(db, entry, sql.lit("$.message"), jsonObjectValue(db, { role: jsonPathValue(db, event, sql.lit("$.message.role")) }), true)}
    ELSE ${event} END
    ELSE ${event} END`;
}
function systemUpdateKindSql(db, event) {
	return sql`CASE
    WHEN ${jsonPathValue(db, event, sql.lit("$.customType"))} = 'openclaw.system-update'
      AND ${jsonPathValue(db, event, sql.lit("$.details.kind"))} IN ('prompt-update', 'runtime-context')
    THEN ${jsonPathValue(db, event, sql.lit("$.details.kind"))} ELSE NULL END`;
}
/** Lightweight tree/state records; these never serve as persisted transcript evidence. */
function projectModelContextNavigationSql(db, event, entryType = jsonPathValue(db, event, sql.lit("$.type"))) {
	if (isPostgresSqlConnection(db)) return postgresModelNavigationSql(db, event, entryType);
	const entry = jsonPickObject(db, event, MODEL_CONTEXT_NAVIGATION_KEYS);
	const message = supportsNodeSqliteJsonb() ? sql`jsonb_extract(${event}, '$.message')` : sql`json_extract(${event}, '$.message')`;
	const messageFacts = jsonPickObject(db, message, MODEL_MESSAGE_NAVIGATION_KEYS);
	const messageOperatorKind = systemUpdateKindSql(db, message);
	const entryOperatorKind = systemUpdateKindSql(db, event);
	const customMessage = sql`json_set(${entry}, '$.content', json('[]'))`;
	const calls = sql`(SELECT json_group_array(json_object(
    'type', ${contentPropertySql(event, "type")}, 'id', ${contentPropertySql(event, "id")},
    'name', ${contentPropertySql(event, "name")}))
    FROM json_each(${event}, '$.message.content') WHERE type = 'object'
    AND ${contentPropertySql(event, "type")} IN ('toolCall', 'toolUse', 'functionCall'))`;
	const synthetic = sql`COALESCE(json_extract(${event}, ${`$.message.details.${SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY}`}), 0) = 1 OR EXISTS (
    SELECT 1 FROM json_each(${event}, '$.message.content') WHERE type = 'object'
    AND ${contentPropertySql(event, "type")} = 'text' AND ${contentPropertySql(event, "text")} = ${LEGACY_MISSING_TOOL_RESULT_TEXT})`;
	return sql`CASE ${entryType}
    WHEN 'message' THEN json_set(${entry}, '$.message', json_set(${messageFacts},
      '$.content', json(${calls}), '$.command', '', '$.output', '',
      '$.providerReplay', json_object('type', json_extract(${event}, '$.message.providerReplay.type')),
      '$.details', json_patch(json_object(${SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY}, json(CASE WHEN (${synthetic}) THEN 'true' ELSE 'false' END)),
        CASE WHEN ${messageOperatorKind} IS NULL THEN json('{}') ELSE json_object('kind', ${messageOperatorKind}) END)))
    WHEN 'custom_message' THEN CASE WHEN ${entryOperatorKind} IS NULL THEN ${customMessage}
      ELSE json_set(${customMessage}, '$.details', json_object('kind', ${entryOperatorKind})) END
    WHEN 'custom' THEN CASE WHEN ${jsonPathValue(db, event, sql.lit("$.customType"))} = 'openclaw.system-prompt'
      THEN json_set(${entry}, '$.data', json_object('restart', json(CASE
        WHEN json_type(${event}, '$.data.restart') = 'true' THEN 'true' ELSE 'false' END)))
      ELSE ${entry} END
    WHEN 'compaction' THEN json_set(${entry}, '$.summary', '')
    WHEN 'branch_summary' THEN json_set(${entry}, '$.summary', '')
    ELSE ${entry} END`;
}
function postgresModelNavigationSql(db, event, entryType) {
	const get = (path) => jsonPathValue(db, event, sql.lit(path));
	const entry = jsonPickObject(db, event, MODEL_CONTEXT_NAVIGATION_KEYS);
	const message = jsonPathValue(db, event, sql.lit("$.message"), "json");
	const content = jsonPathValue(db, event, sql.lit("$.message.content"), "json");
	const elements = jsonArrayElements(db, sql`CASE WHEN ${jsonType(db, content)} = 'array' THEN ${content} ELSE '[]' END`);
	const value = sql.ref("value");
	const property = (key) => jsonPathValue(db, value, sql.lit(`$.${key}`));
	const calls = sql`(SELECT ${jsonOrderedArray(db, jsonObjectValue(db, {
		type: property("type"),
		id: property("id"),
		name: property("name")
	}), [])}
    FROM ${elements} WHERE ${jsonType(db, value)} = 'object'
    AND ${property("type")} IN ('toolCall', 'toolUse', 'functionCall'))`;
	const synthetic = sql`coalesce(${jsonPathValue(db, event, sql.lit(`$.message.details.${SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY}`), "json")}, 'false') IN ('true', '1') OR EXISTS (
    SELECT 1 FROM ${elements} WHERE ${property("type")} = 'text' AND ${property("text")} = ${LEGACY_MISSING_TOOL_RESULT_TEXT})`;
	const kind = systemUpdateKindSql(db, message);
	const missing = { [SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY]: synthetic };
	let projectedMessage = jsonPickObject(db, message, MODEL_MESSAGE_NAVIGATION_KEYS);
	for (const [path, replacement, json] of [
		[
			"content",
			calls,
			true
		],
		[
			"command",
			sql.lit(""),
			false
		],
		[
			"output",
			sql.lit(""),
			false
		],
		[
			"providerReplay",
			jsonObjectValue(db, { type: get("$.message.providerReplay.type") }),
			true
		],
		[
			"details",
			sql`CASE WHEN ${kind} IS NULL THEN ${jsonObjectValue(db, missing)} ELSE ${jsonObjectValue(db, {
				...missing,
				kind
			})} END`,
			true
		]
	]) projectedMessage = jsonSetPath(db, projectedMessage, sql.lit(`$.${path}`), replacement, json);
	const custom = jsonSetPath(db, entry, sql.lit("$.content"), sql.lit("[]"), true);
	const customKind = systemUpdateKindSql(db, event);
	return sql`CASE ${entryType}
    WHEN 'message' THEN ${jsonSetPath(db, entry, sql.lit("$.message"), projectedMessage, true)}
    WHEN 'custom_message' THEN CASE WHEN ${customKind} IS NULL THEN ${custom}
      ELSE ${jsonSetPath(db, custom, sql.lit("$.details"), jsonObjectValue(db, { kind: customKind }), true)} END
    WHEN 'custom' THEN CASE WHEN ${get("$.customType")} = 'openclaw.system-prompt'
      THEN ${jsonSetPath(db, entry, sql.lit("$.data"), jsonObjectValue(db, { restart: sql`coalesce(${jsonPathValue(db, event, sql.lit("$.data.restart"), "json")}, 'false') = 'true'` }), true)}
      ELSE ${entry} END
    WHEN 'compaction' THEN ${jsonSetPath(db, entry, sql.lit("$.summary"), sql.lit(""))}
    WHEN 'branch_summary' THEN ${jsonSetPath(db, entry, sql.lit("$.summary"), sql.lit(""))}
    ELSE ${entry} END`;
}
//#endregion
//#region src/sessions/transcript-events.ts
function readSessionTranscriptRunId(message) {
	return isRecord(message) ? normalizeOptionalString((asOptionalRecord(message["__openclaw"]) ?? {}).runId) : void 0;
}
resolveGlobalSet(Symbol.for("openclaw.sessionTranscriptListeners"), "close-and-restart");
resolveGlobalSet(Symbol.for("openclaw.internalSessionTranscriptListeners"), "close-and-restart");
resolveGlobalSingleton(Symbol.for("openclaw.sessionTranscriptUpdateState"), () => ({ version: 0 }));
//#endregion
//#region src/config/sessions/session-transcript-report-facts.ts
const canonicalEntryShape = {
	id: string$1().min(1),
	parentId: union([string$1(), _null()]).optional(),
	timestamp: string$1().optional(),
	appendMode: unknown().optional()
};
object({
	kind: literal("canonical"),
	hasParentId: boolean(),
	entry: discriminatedUnion("type", [
		object({
			...canonicalEntryShape,
			type: literal("message"),
			assistantResponseId: string$1().optional(),
			assistantRunId: string$1().optional()
		}),
		object({
			...canonicalEntryShape,
			type: literal("custom_message"),
			customType: string$1().min(1)
		}),
		object({
			...canonicalEntryShape,
			type: literal("label"),
			targetId: string$1().min(1),
			label: string$1().optional()
		}),
		object({
			...canonicalEntryShape,
			type: _enum([
				"thinking_level_change",
				"model_change",
				"compaction",
				"reset",
				"branch_summary",
				"custom",
				"session_info"
			])
		})
	])
}).refine(({ entry, hasParentId }) => hasParentId === (entry.parentId !== void 0));
/** Classify the original parsed row; callers retain the current-header guard. */
function projectSessionTranscriptReportFacts(raw) {
	const { entry, recognized } = classifySessionFileEntry(raw, 3);
	if (!recognized || entry.type === "session") {
		const leaf = parseOpaqueLeafEntry(raw);
		if (leaf) return {
			kind: "leaf",
			entry: leaf
		};
		const link = parseParentLinkedOpaqueEntry(raw);
		return link ? {
			kind: "link",
			...link
		} : { kind: "ignored" };
	}
	const common = {
		id: entry.id,
		parentId: entry.parentId,
		timestamp: entry.timestamp,
		appendMode: entry.appendMode
	};
	const hasParentId = Object.hasOwn(entry, "parentId");
	if (entry.type === "label") return {
		kind: "canonical",
		hasParentId,
		entry: {
			...common,
			type: entry.type,
			targetId: entry.targetId,
			label: entry.label
		}
	};
	if (entry.type === "custom_message") return {
		kind: "canonical",
		hasParentId,
		entry: {
			...common,
			type: entry.type,
			customType: entry.customType
		}
	};
	if (entry.type === "message") return {
		kind: "canonical",
		hasParentId,
		entry: {
			...common,
			type: entry.type,
			...entry.message.role === "assistant" ? {
				assistantRunId: readSessionTranscriptRunId(entry.message),
				...typeof entry.message.responseId === "string" ? { assistantResponseId: entry.message.responseId } : {}
			} : {}
		}
	};
	return {
		kind: "canonical",
		hasParentId,
		entry: {
			...common,
			type: entry.type
		}
	};
}
//#endregion
//#region src/state/json-predicate-fields.ts
/** Select raw root members without constructing objects for opaque JSON bodies. */
function scanJsonObjectFields(json, fields) {
	const first = /* @__PURE__ */ new Map();
	const last = /* @__PURE__ */ new Map();
	const wanted = new Set(fields);
	let offset = 0;
	let maximumDepth = 0;
	const whitespace = /[\t\n\r ]*/y;
	const number = /-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?/y;
	const stringPart = /["\\\u0000-\u001f]/g;
	function fail() {
		throw new SyntaxError("Invalid JSON predicate source");
	}
	const skipWhitespace = () => {
		whitespace.lastIndex = offset;
		whitespace.exec(json);
		offset = whitespace.lastIndex;
	};
	const string = () => {
		if (json[offset++] !== "\"") fail();
		while (offset < json.length) {
			stringPart.lastIndex = offset;
			const match = stringPart.exec(json);
			if (!match) fail();
			offset = stringPart.lastIndex;
			if (match[0] === "\"") return;
			if (match[0] !== "\\") fail();
			const escape = json[offset++];
			if (escape === "u") {
				if (!/^[0-9a-fA-F]{4}$/.test(json.slice(offset, offset + 4))) fail();
				offset += 4;
			} else if (escape === void 0 || !"\"\\/bfnrt".includes(escape)) fail();
		}
		fail();
	};
	const value = (depth) => {
		skipWhitespace();
		const start = json[offset];
		maximumDepth = Math.max(maximumDepth, depth + (start === "{" || start === "[" ? 1 : 0));
		if (start === "\"") {
			string();
			return "string";
		}
		if (start === "{" || start === "[") {
			const object = start === "{";
			const close = object ? "}" : "]";
			offset++;
			skipWhitespace();
			if (json[offset] === close) {
				offset++;
				return object ? "object" : "array";
			}
			while (offset < json.length) {
				let key;
				if (object) {
					const keyStart = offset;
					string();
					if (depth === 0) key = JSON.parse(json.slice(keyStart, offset));
					skipWhitespace();
					if (json[offset++] !== ":") fail();
				}
				skipWhitespace();
				const tokenStart = offset;
				const kind = value(depth + 1);
				if (key !== void 0) {
					const nul = key.indexOf("\0");
					const firstKey = nul < 0 ? key : key.slice(0, nul);
					const keepFirst = wanted.has(firstKey) && !first.has(firstKey);
					const keepLast = wanted.has(key);
					if (keepFirst || keepLast) {
						const token = {
							kind,
							text: json.slice(tokenStart, offset)
						};
						if (keepFirst) first.set(firstKey, token);
						if (keepLast) last.set(key, token);
					}
				}
				skipWhitespace();
				const separator = json[offset++];
				if (separator === close) return object ? "object" : "array";
				if (separator !== ",") fail();
				skipWhitespace();
			}
			fail();
		}
		const literal = start === "t" ? "true" : start === "f" ? "false" : start === "n" ? "null" : void 0;
		if (literal && json.startsWith(literal, offset)) {
			offset += literal.length;
			return literal === "null" ? "null" : "boolean";
		}
		number.lastIndex = offset;
		if (!number.test(json)) fail();
		offset = number.lastIndex;
		return "number";
	};
	try {
		value(0);
		skipWhitespace();
		if (offset !== json.length && json[offset] !== "\0") fail();
		return {
			valid: true,
			maximumDepth,
			first,
			last
		};
	} catch {
		return {
			valid: false,
			maximumDepth,
			first: /* @__PURE__ */ new Map(),
			last: /* @__PURE__ */ new Map()
		};
	}
}
function readJsonPredicateScalar(token) {
	if (!token || token.kind === "object" || token.kind === "array") return;
	return JSON.parse(token.text);
}
//#endregion
//#region src/config/sessions/transcript-predicate-fields.ts
const eventTypes = /* @__PURE__ */ new Set([
	"session",
	"message",
	"reset",
	"compaction",
	"custom_message",
	"custom"
]);
const customTypes = /* @__PURE__ */ new Set(["openclaw.runtime-context", "openclaw.cache-ttl"]);
const messageRoles = /* @__PURE__ */ new Set([
	"user",
	"assistant",
	"toolResult",
	"system"
]);
function discriminator(token, values) {
	const value = readJsonPredicateScalar(token);
	return typeof value === "string" && values.has(value) ? value : null;
}
/** Query-only discriminators preserve SQLite's first member and legacy JS's last member. */
function deriveTranscriptPredicateFields(eventJson) {
	const fields = scanJsonObjectFields(eventJson, [
		"type",
		"customType",
		"display",
		"message"
	]);
	if (!fields.valid || fields.maximumDepth > 1e3) return {
		navigation_type: null,
		navigation_custom_type: null,
		navigation_display: 0,
		message_role: null,
		navigation_last_type: null,
		navigation_last_custom_type: null,
		navigation_valid: 0
	};
	const message = fields.first.get("message");
	const role = message?.kind === "object" ? scanJsonObjectFields(message.text, ["role"]).first.get("role") : void 0;
	return {
		navigation_type: discriminator(fields.first.get("type"), eventTypes),
		navigation_custom_type: discriminator(fields.first.get("customType"), customTypes),
		navigation_display: readJsonPredicateScalar(fields.first.get("display")) === true ? 1 : 0,
		message_role: discriminator(role, messageRoles),
		navigation_last_type: discriminator(fields.last.get("type"), eventTypes),
		navigation_last_custom_type: discriminator(fields.last.get("customType"), customTypes),
		navigation_valid: 1
	};
}
const MAX_NAVIGATION_BYTES = 16384;
const MIN_COMPRESS_BYTES = 1024;
const utf8Decoder = new TextDecoder("utf-8", {
	fatal: true,
	ignoreBOM: true
});
function readTranscriptStorageEncoding(database) {
	if (isPostgresSqlConnection(database)) return "UTF-8";
	const facts = getAdmittedSqliteSchemaFacts(database);
	if (!facts) throw new Error("Transcript payload preparation requires admitted SQLite schema facts");
	return facts.textEncoding;
}
function navigationProjection(database, event, report, originalEvent) {
	return sql`CASE WHEN json_valid(${originalEvent}) AND json_valid(${report}) THEN CASE
    WHEN json_type(${event}) != 'object'
      OR coalesce(json_type(${event}, '$.message'), 'null') NOT IN ('object', 'null') THEN NULL
    ELSE json_object('version', 1,
      'report', json(${report}),
      'navigation', json(${projectTranscriptPayloadNavigationSql(database, event)}),
      'reset', json(${projectResetBoundaryNavigationSql(database, originalEvent)}),
      'model', json(${projectModelContextNavigationSql(database, event)}),
      'modelBytes', octet_length(${projectModelContextEventSql(database, event, sql.lit(0))}),
      'modelWithoutCheckpointBytes', octet_length(${projectModelContextEventSql(database, event, sql.lit(1))}),
      'withoutCustomDataBytes', octet_length(json_remove(${event}, '$.data')))
    END ELSE NULL END`;
}
const navigationReader = createSqliteQueryCache((database) => prepareSqliteQueryTakeFirstSync(database, (parameter) => {
	const db = getNodeSqliteKysely(database);
	const source = db.selectFrom(db.selectNoFrom([parameter((value) => value.eventJson).as("event_json"), parameter((value) => value.reportJson).as("report_json")]).as("input")).select(["input.event_json", "input.report_json"]).select((eb) => supportsNodeSqliteJsonb() ? sql`CASE WHEN json_valid(${eb.ref("input.event_json")})
                  THEN jsonb(${eb.ref("input.event_json")}) ELSE ${eb.ref("input.event_json")} END`.as("event_projection") : eb.ref("input.event_json").as("event_projection"));
	const admitted = sql`CASE WHEN json_valid(metadata.navigation_json)
          AND octet_length(metadata.navigation_json) <= ${MAX_NAVIGATION_BYTES}
          THEN metadata.navigation_json ELSE NULL END`;
	return db.with((cte) => cte("source").notMaterialized(), () => source).with((cte) => cte("metadata").materialized(), (cteDb) => cteDb.selectFrom("source").select((eb) => navigationProjection(database, eb.ref("source.event_projection"), eb.ref("source.report_json"), eb.ref("source.event_json")).as("navigation_json"))).selectFrom("metadata").select(admitted.as("navigation_json"));
}));
function readNavigation(database, input) {
	const navigation = navigationReader(database)(input)?.navigation_json ?? null;
	return navigation !== null && Buffer.byteLength(navigation, "utf8") <= MAX_NAVIGATION_BYTES ? navigation : null;
}
/** Prepare canonical UTF-8 bytes and native query metadata before publishing a transcript row. */
function prepareTranscriptPayload(database, eventJson, parsedEvent, storageEncoding = readTranscriptStorageEncoding(database)) {
	const rawBytes = Buffer.byteLength(eventJson, "utf8");
	const utf8 = storageEncoding === "UTF-8";
	const identity = {
		...deriveTranscriptPredicateFields(eventJson),
		event_json: eventJson,
		event_zstd: null,
		event_utf8_bytes: utf8 ? rawBytes : null,
		navigation_json: null
	};
	if (isPostgresSqlConnection(database)) return identity;
	if (!utf8 || rawBytes > 4194304 || eventJson.includes("\\u") || eventJson.includes("\0")) return identity;
	const codec = resolveZstdCodec();
	if (!codec || rawBytes < MIN_COMPRESS_BYTES) return identity;
	const bytes = Buffer.from(eventJson, "utf8");
	if (utf8Decoder.decode(bytes) !== eventJson) return identity;
	const compressed = codec.compress(bytes, 1, true);
	const maximumStoredBytes = rawBytes - Math.max(64, Math.ceil(rawBytes / 10));
	if (compressed.byteLength > maximumStoredBytes) return identity;
	let reportJson;
	try {
		const raw = parsedEvent === void 0 ? JSON.parse(eventJson) : parsedEvent;
		if (findSessionTranscriptHeader([raw])) return identity;
		reportJson = JSON.stringify(projectSessionTranscriptReportFacts(raw));
	} catch {
		return identity;
	}
	const navigation = readNavigation(database, {
		eventJson,
		reportJson
	});
	if (navigation === null || compressed.byteLength + Buffer.byteLength(navigation, "utf8") > maximumStoredBytes) return identity;
	return {
		...identity,
		event_json: null,
		event_zstd: compressed,
		navigation_json: navigation
	};
}
//#endregion
//#region src/state/openclaw-agent-transcript-payload-migration.ts
const MIGRATION_TABLE = "transcript_events_payload_migration";
const KNOWN_CHILDREN = /* @__PURE__ */ new Set(["transcript_event_identities", "session_transcript_active_events"]);
function assertTranscriptRebuildInputs(database) {
	assertSqliteSchemaContains(database, "transcript payload migration", extractSqliteTableSchema(withLegacyAgentStorageSchema(OPENCLAW_AGENT_SCHEMA_SQL), "transcript_events"));
	const columns = database.prepare("PRAGMA table_xinfo(transcript_events)").all();
	const expectedColumns = /* @__PURE__ */ new Set([
		"session_id",
		"seq",
		"event_json",
		"created_at"
	]);
	if (columns.length !== expectedColumns.size || columns.some((column) => typeof column.name !== "string" || !expectedColumns.has(column.name))) throw new Error("Transcript payload migration cannot discard unknown columns");
	if (database.prepare(`SELECT name FROM sqlite_schema
      WHERE (type IN ('trigger', 'index') AND tbl_name = 'transcript_events' AND sql IS NOT NULL)
         OR (type IN ('view', 'trigger') AND sql LIKE '%transcript_events%')`).all().length > 0) throw new Error("Transcript payload migration cannot rebuild unknown indexes, views, or triggers");
	if (database.prepare("SELECT 1 FROM sqlite_schema WHERE name = ?").get(MIGRATION_TABLE)) throw new Error("Transcript payload migration table already exists");
	for (const table of database.prepare("SELECT name FROM sqlite_schema WHERE type = 'table'").all()) {
		if (typeof table.name !== "string") throw new Error("Invalid table name during transcript payload migration");
		if (KNOWN_CHILDREN.has(table.name)) continue;
		if (database.prepare(`PRAGMA foreign_key_list(${quoteSqliteIdentifier(table.name)})`).all().some((key) => key.table === "transcript_events")) throw new Error("Transcript payload migration cannot rebuild an unknown foreign-key target");
	}
}
/** Convert original bytes under the admitted agent migration; never hydrate oversized identity rows. */
function migrateTranscriptPayloadStorageInTransaction(database) {
	if (!database.isTransaction || database.prepare("PRAGMA foreign_keys").get()?.foreign_keys !== 0) throw new Error("Transcript payload migration requires an admitted transaction with foreign keys off");
	assertTranscriptRebuildInputs(database);
	const utf8 = readSqliteTextEncoding(database) === "UTF-8";
	const decoder = new TextDecoder("utf-8", {
		fatal: true,
		ignoreBOM: true
	});
	const codec = resolveZstdCodec();
	database.exec(extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, "transcript_events").replace("IF NOT EXISTS transcript_events", MIGRATION_TABLE));
	const copyIdentity = database.prepare(`
    INSERT INTO ${MIGRATION_TABLE}
      (rowid, session_id, seq, event_json, created_at, event_zstd, event_utf8_bytes, navigation_json)
    SELECT rowid, session_id, seq, event_json, created_at, NULL,
           CASE WHEN ? THEN octet_length(event_json) ELSE NULL END, ?
    FROM transcript_events WHERE rowid = ?`);
	const copyCompressed = database.prepare(`
    INSERT INTO ${MIGRATION_TABLE}
      (rowid, session_id, seq, event_json, created_at, event_zstd, event_utf8_bytes, navigation_json)
    SELECT rowid, session_id, seq, NULL, created_at, ?, ?, ?
    FROM transcript_events WHERE rowid = ?`);
	copyIdentity.setReadBigInts(true);
	copyCompressed.setReadBigInts(true);
	const readBytes = database.prepare("SELECT CAST(event_json AS BLOB) AS bytes FROM transcript_events WHERE rowid = ?");
	const metadata = database.prepare("SELECT rowid AS storage_rowid, octet_length(event_json) AS bytes FROM transcript_events ORDER BY rowid");
	metadata.setReadBigInts(true);
	let renewedAt = performance.now();
	for (const row of metadata.iterate()) {
		if (performance.now() - renewedAt >= 1e3) {
			renewAgentDatabaseMaintenanceAuthorityIfPresent();
			renewedAt = performance.now();
		}
		if (typeof row.storage_rowid !== "bigint" || typeof row.bytes !== "bigint") throw new Error("Invalid transcript storage identity during migration");
		let navigation = null;
		let copied = false;
		if (utf8 && row.bytes <= BigInt(4194304)) {
			const bytes = readBytes.get(row.storage_rowid)?.bytes;
			if (!(bytes instanceof Uint8Array)) throw new Error("Transcript payload disappeared during migration");
			let text;
			try {
				text = decoder.decode(bytes);
			} catch {}
			if (text !== void 0) {
				const payload = prepareTranscriptPayload(database, text, void 0, "UTF-8");
				navigation = payload.navigation_json;
				if (payload.event_zstd !== null) {
					if (!codec || payload.event_utf8_bytes === null || !codec.decompress(payload.event_zstd, payload.event_utf8_bytes).equals(bytes)) throw new Error("Transcript compression did not preserve canonical bytes");
					const result = copyCompressed.run(payload.event_zstd, payload.event_utf8_bytes, navigation, row.storage_rowid);
					if (Number(result.changes) !== 1) throw new Error("Transcript payload disappeared before migration publication");
					copied = true;
				}
			}
		}
		if (!copied && Number(copyIdentity.run(utf8 ? 1 : 0, navigation, row.storage_rowid).changes) !== 1) throw new Error("Transcript identity payload disappeared before migration publication");
	}
	renewAgentDatabaseMaintenanceAuthorityIfPresent();
	database.exec(`DROP TABLE transcript_events;
    ALTER TABLE ${MIGRATION_TABLE} RENAME TO transcript_events;`);
}
//#endregion
//#region src/state/openclaw-agent-db-schema.ts
const agentDbLog = createSubsystemLogger("state/agent-db");
function resolveAgentDatabaseIntegrityGateReason(database, proof) {
	if (proof.integrityRevoked) return "stale-lease-full";
	if (hasRevokedOpenClawAgentDatabaseValidation(database.path, proof.validation)) return "revoked";
	return proof.reuseIntegrity ? "no-proof" : "lease-class";
}
function migrateMemoryChunkMetadataSchema(db) {
	ensureMemoryRecallMetadataSchema(db);
	ensureMemoryChunkProvenance(db);
}
function* agentDatabaseIntegrityBeforeMutationSteps(database, agentId, pathname, diagnostics, verification, reuseRuntimeIntegrity = false, admittedSchema = false) {
	if (reuseRuntimeIntegrity && admittedSchema) {
		if (diagnostics) diagnostics.integrityGateOutcome = "cached";
		return false;
	}
	setSqliteBusyTimeout(database, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);
	const userVersion = getAdmittedSqliteSchemaFacts(database)?.userVersion ?? readSqliteUserVersion(database);
	const hasApplicationSchema = userVersion === 0 && hasAgentDatabaseApplicationSchema(database);
	const migrationPending = userVersion === 0 && hasApplicationSchema || userVersion > 0 && userVersion < 27;
	if (migrationPending) agentDbLog.info("agent database schema migration pending; verifying integrity first", {
		fromVersion: userVersion,
		path: pathname,
		toVersion: 27
	});
	const hasPendingCurrentVersionMigration = userVersion === 27 && hasPendingCurrentVersionAgentDatabaseMigration(database);
	const startedAt = performance.now();
	if (diagnostics?.integrityGateReason === "stale-lease-full" && diagnostics.because) agentDbLog.info(`agent database integrityGateReason=stale-lease-full because=${diagnostics.because}`, {
		agentId,
		path: pathname,
		...diagnostics
	});
	if (userVersion === 27 && !hasPendingCurrentVersionMigration) {
		const rebuiltIndexes = yield* verifyAndRepairCanonicalSqliteIndexSteps(database, pathname, OPENCLAW_AGENT_SCHEMA_SQL, {
			allowMissingColumns: true,
			validateAfterRepair: () => assertOpenClawAgentCurrentRuntimeSchema(database, {
				agentId,
				pathname
			}),
			diagnostics,
			reuseIntegrity: reuseRuntimeIntegrity || verification !== void 0 && !migrationPending && !hasPendingCurrentVersionMigration
		});
		if (rebuiltIndexes.length > 0) agentDbLog.warn(`Rebuilt canonical agent SQLite indexes for ${agentId} (${pathname}): ${rebuiltIndexes.join(", ")}`, {
			agentId,
			path: pathname,
			indexes: rebuiltIndexes,
			elapsedMs: Math.floor(performance.now() - startedAt)
		});
		assertOpenClawAgentCurrentRuntimeSchema(database, {
			agentId,
			pathname
		});
	} else if (userVersion === 0 && !hasApplicationSchema && database.prepare("PRAGMA page_count").get()?.page_count === 0) assertSqliteIntegrity(database, pathname);
	else yield* sqliteIntegrityCheckSteps(database, pathname, diagnostics);
	return hasPendingCurrentVersionMigration;
}
function migrateAgentStorageInTransaction(db, schemaSql, previousVersion, warnings) {
	renewAgentDatabaseMaintenanceAuthorityIfPresent();
	if (previousVersion === 22) migrateDeployedTranscriptFtsRowsInTransaction(db, schemaSql);
	else if (db.prepare("SELECT 1 FROM sqlite_schema WHERE name = ?").get("session_transcript_fts_rows")) throw new Error("Transcript FTS row map already exists before the schema-23 storage migration.");
	renewAgentDatabaseMaintenanceAuthorityIfPresent();
	migrateTranscriptPayloadStorageInTransaction(db);
	renewAgentDatabaseMaintenanceAuthorityIfPresent();
	migrateMemoryIndexStorage(db, {
		renewAuthority: renewAgentDatabaseMaintenanceAuthorityIfPresent,
		onWarning: (warning) => warnings.push(warning)
	});
	renewAgentDatabaseMaintenanceAuthorityIfPresent();
	migrateSessionCostUsageRollupStorage(db, renewAgentDatabaseMaintenanceAuthorityIfPresent);
	renewAgentDatabaseMaintenanceAuthorityIfPresent();
	db.exec(schemaSql);
	if (previousVersion !== 22) db.exec(`
    INSERT INTO session_transcript_fts_rows (id, session_id, message_id)
    SELECT rowid, session_id, message_id FROM session_transcript_fts;
  `);
}
function ensureAgentSchema(db, agentId, pathname, targetVersion = 27, withMutation = (run) => run(), onMigrationWarning, versionMigrationOnly = false) {
	const warnings = [];
	const schemaSql = getOpenClawAgentMigrationSchema(targetVersion);
	db.exec("PRAGMA foreign_keys = OFF; PRAGMA legacy_alter_table = OFF;");
	let created = false;
	try {
		const mutate = () => {
			invalidateSqliteSchemaFacts(db);
			const metadata = readExistingAgentSchemaMeta(db);
			assertExistingAgentSchemaOwner(metadata, agentId, pathname);
			const previousVersion = assertSupportedAgentSchemaVersion(db, pathname);
			const isEmptyDatabase = previousVersion === 0 && !hasAgentDatabaseApplicationSchema(db);
			const schemaMigration = previousVersion < targetVersion && (previousVersion > 0 || metadata !== null);
			const identityMigration = targetVersion >= 18 && schemaMigration;
			if (identityMigration && metadata?.schemaVersion !== previousVersion) throw new Error(`Agent schema markers disagree for ${pathname}; repair ownership metadata before migration.`);
			if (previousVersion > targetVersion) throw new Error(`OpenClaw agent database ${pathname} uses schema version ${previousVersion}; expected at most ${targetVersion} for this migration.`);
			if (!isEmptyDatabase && previousVersion < targetVersion) assertSupportedAgentMigrationSchemas(db, pathname, previousVersion);
			const assertMigration = () => {
				if (!schemaMigration) return;
				if (identityMigration) assertAgentDatabaseMaintenanceAuthority();
				getOpenClawDatabaseMaintenanceScope()?.assertAgentSchemaMigration({
					agentId,
					path: pathname,
					foundVersion: previousVersion,
					supportedVersion: targetVersion
				});
			};
			assertMigration();
			if (isEmptyDatabase && targetVersion === 27) {
				db.exec(schemaSql);
				db.exec(`PRAGMA user_version = ${targetVersion};`);
				persistAgentSchemaMetadata(db, agentId, targetVersion);
				created = true;
				return;
			}
			const requiresCanonicalWriterMigration = !isEmptyDatabase && previousVersion < 25 && targetVersion >= 25;
			const requiresStorageMigration = !isEmptyDatabase && previousVersion < 23 && targetVersion >= 23;
			const requiresSnapshotMigration = !isEmptyDatabase && previousVersion < 24 && targetVersion >= 24;
			const storageSchemaSql = requiresSnapshotMigration ? withoutSessionEntrySnapshotsSchema(schemaSql) : schemaSql;
			const migrationSchemaSql = requiresStorageMigration ? withLegacyAgentStorageSchema(storageSchemaSql, previousVersion) : storageSchemaSql;
			const finishStorageMigration = () => {
				if (requiresStorageMigration) migrateAgentStorageInTransaction(db, storageSchemaSql, previousVersion, warnings);
				if (requiresSnapshotMigration) migrateSessionEntrySnapshotsInTransaction(db);
				if (requiresCanonicalWriterMigration) migrateCanonicalSessionWriterValidation(db);
				if (!isEmptyDatabase && previousVersion < 26 && targetVersion >= 26) migrateAgentJsonPredicatesInTransaction(db);
				if (previousVersion < 27 && targetVersion >= 27) {
					const elapsedMs = migrateOutboxEnqueueSequenceInTransaction(db);
					if (elapsedMs !== null) agentDbLog.info("agent outbox enqueue sequence rebuilt", {
						agentId,
						pathname,
						elapsedMs
					});
				}
				if (previousVersion < 25) repairCanonicalSqliteIndexes(db, pathname, schemaSql, { verifyPhysicalIntegrity: false });
				finishAgentSchemaMigration(db, agentId, pathname, targetVersion, schemaSql, identityMigration, assertMigration);
			};
			if (previousVersion >= 25 && previousVersion < targetVersion) {
				assertAgentSchemaVersion(db, {
					agentId,
					pathname,
					version: previousVersion
				}, getOpenClawAgentMigrationSchema(previousVersion));
				if (!versionMigrationOnly) ensureSessionAdditiveColumns(db);
				finishStorageMigration();
				return;
			}
			if (previousVersion < targetVersion && previousVersion >= 20 && previousVersion < 25 && targetVersion >= 21) {
				if (previousVersion >= 21) {
					migrateRetiredAgentStateLeaseSchema(db, pathname, targetVersion);
					ensureSessionAdditiveColumns(db);
					ensureSessionEntryValidityProjection(db);
					ensureLegacySessionEntryValidityTriggers(db);
					ensureSessionKeyContractSchemaInTransaction(db);
					if (hasPendingMemoryChunkMetadataMigration(db)) migrateMemoryChunkMetadataSchema(db);
				}
				const previousSchema = getOpenClawAgentMigrationSchema(previousVersion);
				repairCanonicalSqliteIndexes(db, pathname, previousSchema, { verifyPhysicalIntegrity: false });
				assertAgentSchemaVersion(db, {
					agentId,
					pathname,
					version: previousVersion
				}, previousSchema);
				if (previousVersion < 21) {
					db.exec(canonicalSessionValidationSchemaSql(migrationSchemaSql));
					if (!requiresCanonicalWriterMigration) seedCanonicalSessionValidationPending(db);
				}
				finishStorageMigration();
				return;
			}
			if (previousVersion === 17) {
				ensureSessionAdditiveColumns(db);
				ensureLegacySessionEntryValidityTriggers(db);
				assertSqliteIntegrity(db, pathname);
				migrateMemoryChunkMetadataSchema(db);
				assertOpenClawAgentSchemaContains(db, pathname, getOpenClawAgentMigrationSchema(previousVersion), "legacy", true);
			}
			migrateRetiredAgentStateLeaseSchema(db, pathname, targetVersion);
			if (previousVersion === targetVersion) {
				ensureSessionAdditiveColumns(db);
				ensureSessionEntryValidityProjection(db);
				ensureSessionKeyContractSchemaInTransaction(db);
				ensureSessionReactionsSchemaInTransaction(db);
				if (hasPendingMemoryChunkMetadataMigration(db)) {
					migrateMemoryChunkMetadataSchema(db);
					db.exec(schemaSql);
				}
				repairCanonicalSqliteIndexes(db, pathname, schemaSql, { verifyPhysicalIntegrity: false });
				persistAgentSchemaMetadata(db, agentId, targetVersion);
				assertAgentSchemaVersion(db, {
					agentId,
					pathname,
					version: targetVersion
				}, schemaSql);
				assertAgentDatabaseMaintenanceAuthorityIfPresent();
				return;
			} else if (previousVersion === 14) repairAndAssertOpenClawAgentV14SchemaForMigration(db, {
				agentId,
				pathname
			});
			renewAgentDatabaseMaintenanceAuthorityIfPresent();
			migrateMemoryIndexSourcesIdentity(db);
			migrateOpenClawAgentSchema(db);
			migrateConversationDeliveryTargetColumn(db);
			if (previousVersion < 11) backfillSessionConversations(db);
			migrateSessionNodesAndWindows(db, previousVersion);
			renewAgentDatabaseMaintenanceAuthorityIfPresent();
			ensureSessionAdditiveColumns(db);
			if (targetVersion >= 18 && previousVersion < 18) migrateSessionParticipantsSchema(db, pathname);
			if (targetVersion >= 19) migrateSessionCreatorNamespaces(db, previousVersion);
			ensureSessionEntryValidityProjection(db);
			renewAgentDatabaseMaintenanceAuthorityIfPresent();
			db.exec(migrationSchemaSql);
			if (previousVersion !== 17) migrateMemoryChunkMetadataSchema(db);
			if (previousVersion < targetVersion) ensureOpenClawAgentBoardSchemaInTransaction(db);
			migrateSessionTranscriptGenerations(db, previousVersion);
			migrateSessionTranscriptActiveProjection(db, previousVersion);
			if (previousVersion < 11) migrateSqliteSchemaToStrictInTransaction(db, migrationSchemaSql, { databaseLabel: pathname });
			if (previousVersion < 21 && targetVersion >= 21 && !requiresCanonicalWriterMigration) seedCanonicalSessionValidationPending(db);
			finishStorageMigration();
		};
		runSqliteImmediateTransactionSync(db, () => withMutation(mutate), {
			databaseLabel: pathname,
			operationLabel: "agent.schema.ensure",
			withCommit: withMutation
		});
	} finally {
		if (db.isOpen) db.exec("PRAGMA foreign_keys = ON;");
	}
	if (created && (isSqliteSchemaAdmissionCold(db) || getAdmittedSqliteSchemaFacts(db))) {
		admitSqliteSchema(db);
		adoptCanonicalSessionValidationSchema(db);
	}
	for (const warning of warnings) {
		const message = `Agent ${agentId}: ${warning}`;
		agentDbLog.warn(message);
		onMigrationWarning?.(message);
	}
}
//#endregion
//#region src/state/openclaw-agent-db.wal.ts
/** Keep the published timer's exact native owner pinned through worker settlement. */
function registerOpenClawAgentWalMaintenance(database, env) {
	const options = {
		agentId: database.agentId,
		path: database.path,
		env
	};
	const identity = readOpenClawAgentDatabaseIdentity(database);
	const expectedIdentity = {
		kind: "file",
		physicalIdentity: identity.identity,
		birthtime: identity.birthtime,
		nativeLocation: identity.filename
	};
	const controller = new AbortController();
	let pending;
	let unregister;
	const cancel = () => {
		controller.abort();
	};
	const assertCurrent = () => {
		controller.signal.throwIfAborted();
		if (cache.databases.get(database.path) !== database || !database.db.isOpen) throw new Error("Agent WAL maintenance owner changed");
	};
	registerSqliteWalWorkerMaintenance(database.db, async (request) => {
		if (controller.signal.aborted) return;
		const release = retainAgentDatabase(database.db);
		const active = runOpenClawAgentWorkerWrite(options, async () => {
			assertCurrent();
			unregister = registerOpenClawAgentDatabaseAsyncResource({
				...options,
				revoke: cancel,
				async close() {
					cancel();
					await pending?.catch(() => {});
				}
			});
			const { captureOpenClawAgentDatabaseExecution } = await import("./openclaw-state-read-openclaw-agent-execution-CyGFpcXz.mjs");
			assertCurrent();
			const execution = captureOpenClawAgentDatabaseExecution(options, { expectedIdentity });
			try {
				const result = await execution.runExisting({
					assertCurrent,
					createAdmission: (binding) => () => ({
						nativeLocations: binding.nativeLocations,
						admission: createSqliteWorkerOperationAdmission((authority, grant) => {
							binding.authorize(authority);
							assertCurrent();
							if (!grant()) throw new Error("Agent WAL maintenance authority expired");
						}, binding.attachment)
					})
				}, (worker) => worker.execute({
					type: "database.walMaintenance",
					input: request
				}));
				assertCurrent();
				execution.assertCurrent();
				return result;
			} finally {
				await execution.release();
			}
		}, void 0, controller.signal);
		pending = active;
		try {
			return await active;
		} finally {
			release();
			pending = void 0;
			unregister?.();
			unregister = void 0;
		}
	}, cancel);
}
//#endregion
//#region src/state/openclaw-agent-db.ts
/** Drain the live owner before reconfirming an advisory failure in a native child. */
async function confirmOpenClawAgentDatabaseIntegrity(pathname, lifetime) {
	const resolvedPath = path.resolve(pathname);
	await closeOpenClawAgentDatabaseByPathAsync(resolvedPath);
	invalidateOpenClawAgentDatabaseValidation(resolvedPath);
	const { confirmDatabaseVerifyWorker } = await import("./openclaw-state-read-openclaw-database-verify.impl-BIdFbU3v.mjs");
	return confirmDatabaseVerifyWorker({
		path: resolvedPath,
		kind: "agent",
		label: resolvedPath
	}, lifetime);
}
const { openOpenClawAgentDatabase, runOpenClawAgentWriteTransaction, withOpenClawAgentDatabaseAsync, withOpenClawAgentDatabaseRuntime, withOpenClawAgentDatabaseRuntimeFromExecution, withOpenClawAgentDatabaseAdmission } = createOpenClawAgentDatabaseAdmissionOwner(openOpenClawAgentDatabaseSteps);
function* openOpenClawAgentDatabaseSteps(options, pending, preparedLease, registrationObserver, repairAdmission) {
	const agentId = normalizeAgentId(options.agentId);
	assertAgentDatabaseAdmitted(agentId, { env: options.env });
	const databaseOptions = {
		...options,
		agentId
	};
	const pathname = resolveOpenClawAgentSqlitePath(databaseOptions);
	const assertCurrent = (database) => {
		repairAdmission?.assertCurrent?.();
		if (repairAdmission?.expectedIdentity) {
			if (database) assertOpenClawAgentDatabaseIdentity(database, repairAdmission.expectedIdentity);
			else assertExistingDatabaseIdentity(pathname, repairAdmission.expectedIdentity.key, repairAdmission.expectedIdentity.birthtime);
		}
	};
	assertCurrent();
	assertAgentCreationClaimCurrent(databaseOptions);
	getAgentDeletionDatabaseCleanup(databaseOptions)?.assertCurrent();
	const opened = getOpenClawAgentDatabaseIfOpen(databaseOptions);
	if (opened) {
		assertCurrent(opened);
		if (preparedLease) throw new Error("A prepared Worker lease cannot adopt an existing agent database handle");
		if (pending?.workerPrepared) adoptOpenClawAgentDatabaseSchema(opened, true, true);
		return opened;
	}
	assertAgentDatabaseResourceAdmission({
		agentId,
		path: pathname
	});
	if (!pending) revokePendingAgentDatabaseOpen(pathname);
	const cached = cache.databases.get(pathname);
	const allowExtension = !process.permission && supportsNodeSqliteExtensionLoading();
	if (!repairAdmission?.expectedIdentity) quarantineOrphanedSqliteSidecars(pathname);
	revalidateAgentDatabaseTerminalOpen(pathname);
	const persistedFailure = readOpenClawDatabaseQuarantineFailure("agent", pathname, { env: databaseOptions.env });
	if (persistedFailure) {
		recordOpenClawAgentDatabaseOpenFailure(pathname, persistedFailure);
		throw persistedFailure;
	}
	if (cached) {
		closeCachedOpenClawAgentDatabase(cached);
		cache.databases.delete(pathname);
		cache.failures.delete(pathname);
	}
	const leaseEnvironment = {
		...options.env ?? process.env,
		OPENCLAW_STATE_DIR: resolveStateDir(options.env ?? process.env),
		...isGatewayExternallySupervised(options.env ?? process.env) ? { OPENCLAW_SUPERVISOR_MODE: "external" } : {}
	};
	if (preparedLease && (preparedLease.receipt.agentId !== agentId || preparedLease.receipt.path !== pathname)) throw new Error("Prepared agent database lease belongs to another store");
	let reuseIntegrity = false;
	let integrityRevoked = false;
	const diagnostics = {};
	const validation = pending?.validation ?? preparedLease?.validation;
	const captureVerification = (runtimeIntegrityAllowed, invalidated, because) => {
		reuseIntegrity = runtimeIntegrityAllowed;
		integrityRevoked = invalidated || preparedLease?.integrityRevoked === true || pending?.integrityRevoked === true;
		diagnostics.because = invalidated ? because : void 0;
		if (invalidated && validation) Atomics.store(new Int32Array(validation.valid), 0, 0);
	};
	const releaseOptions = {
		env: leaseEnvironment,
		initializationAgentPaths: [pathname]
	};
	assertCurrent();
	const leaseId = preparedLease ? preparedLease.claim(captureVerification) : claimOpenClawAgentDatabaseLease({
		agentId,
		path: pathname,
		env: leaseEnvironment
	}, void 0, captureVerification);
	if (pending) pending.assertHeld = () => assertOpenClawAgentDatabaseLease(leaseId, {
		agentId,
		path: pathname,
		env: leaseEnvironment
	});
	const finishPhase = startAgentDatabaseOpenTiming(agentId, pathname, pending ? "async" : "sync", diagnostics);
	let openedDb;
	let openedDatabase;
	let openedWalMaintenance;
	let releaseCreationAdmission;
	try {
		assertCurrent();
		if (!repairAdmission?.expectedIdentity) {
			ensureOpenClawAgentDatabasePermissions(pathname, databaseOptions);
			prepareSqliteDatabaseDirectory(pathname);
		}
		closeIdleOpenClawAgentDatabaseReadOnly(pathname);
		const db = openNodeSqliteDatabase(repairAdmission?.expectedIdentity ? resolveExistingSqliteFileUri(pathname) : pathname, { allowExtension });
		openedDb = db;
		registerOpenClawAgentDatabaseIdentity(db, resolveOpenClawStateSqlitePath(leaseEnvironment));
		assertCurrent({
			db,
			path: pathname
		});
		if (repairAdmission?.expectedIdentity) ensureOpenClawAgentDatabasePermissions(pathname, databaseOptions);
		db.enableLoadExtension(false);
		enableNodeSqliteKyselyStatementCache(db);
		if (preparedLease) db.exec("PRAGMA temp_store = FILE");
		finishPhase("open");
		const validationDatabase = {
			db,
			path: pathname,
			agentId
		};
		if (validation) adoptOpenClawAgentDatabaseValidation(validationDatabase, validation);
		let isValidatedReopen = Boolean(getOpenClawAgentDatabaseValidation(validationDatabase));
		const reuseAdmittedIntegrity = isValidatedReopen || reuseIntegrity || pending?.workerPrepared === true && !integrityRevoked;
		let reusedSchema = false;
		let walMaintenance;
		try {
			setSqliteBusyTimeout(db, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);
			reusedSchema = adoptOpenClawAgentDatabaseSchema(validationDatabase, reuseAdmittedIntegrity, pending?.workerPrepared);
			if (!reusedSchema) admitSqliteSchema(db, (userVersion) => {
				assertSupportedAgentSchemaVersion(db, pathname, userVersion);
			});
			const existingSchema = readExistingAgentSchemaMeta(db);
			assertExistingAgentSchemaOwner(existingSchema, agentId, pathname);
			if (reusedSchema) assertCurrentAgentSchemaMetadata(existingSchema, agentId, pathname);
			if (pending) releaseCreationAdmission = reserveAgentCreationClaimAdmission(pending, databaseOptions, async () => {
				await closeOpenClawAgentDatabaseByPathAsync(pathname, agentId);
			});
			if (preparedLease && !isMainThread) requestSqliteWorkerOperationAdmission({
				stage: "prepare",
				facts: {
					kind: "agent-validation-start",
					lease: preparedLease.receipt
				}
			});
			diagnostics.integrityGateReason = resolveAgentDatabaseIntegrityGateReason(validationDatabase, {
				validation,
				integrityRevoked,
				reuseIntegrity
			});
			diagnostics.because ??= integrityRevoked ? agentDatabaseAdmissionProvenanceRefusal(preparedLease?.provenance, pathname) : void 0;
			let verification;
			if (diagnostics.integrityGateReason === "revoked" || diagnostics.integrityGateReason === "stale-lease-full") {
				isValidatedReopen = false;
				reusedSchema = false;
			} else if (reuseIntegrity) verification = readSqliteDatabaseIntegrityVerification(db);
			const requiresCurrentVersionConvergence = yield* agentDatabaseIntegrityBeforeMutationSteps(db, agentId, pathname, diagnostics, verification, isValidatedReopen && reuseAdmittedIntegrity, reusedSchema);
			assertCurrent(validationDatabase);
			if (!diagnostics.integrityGateOutcome || diagnostics.integrityGateOutcome === "cached") delete diagnostics.integrityGateReason;
			if (isValidatedReopen && (!existingSchema || requiresCurrentVersionConvergence)) {
				invalidateOpenClawAgentDatabaseValidation(pathname);
				isValidatedReopen = false;
			}
			assertCanonicalAgentPersistenceVersion(db, pathname);
			finishPhase("validation");
			configureSqlitePreSchemaPragmas(db, { busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS });
			walMaintenance = configureSqliteConnectionPragmas(db, {
				busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
				autoCheckpointPages: 0,
				databaseLabel: `openclaw-agent:${agentId}`,
				databasePath: pathname,
				foreignKeys: true,
				synchronous: "NORMAL"
			});
			openedWalMaintenance = walMaintenance;
			finishPhase("configuration");
			assertCurrent(validationDatabase);
			if (!isValidatedReopen) ensureAgentSchema(db, agentId, pathname);
			finishPhase("schema");
		} catch (err) {
			if (diagnostics.integrityGateOutcome === "failed") finishPhase("validation");
			openedWalMaintenance?.close();
			if (db.isOpen) db.close();
			const current = cache.databases.get(pathname);
			if (!current || current.db === db) invalidateOpenClawAgentDatabaseValidation(pathname);
			if (err instanceof Error && (isSqliteSchemaVersionError(err) || isTerminalSqliteIntegrityError(err))) recordOpenClawAgentDatabaseOpenFailure(pathname, err);
			throw err;
		}
		assertCurrent({
			db,
			path: pathname
		});
		ensureOpenClawAgentDatabasePermissions(pathname, databaseOptions);
		if (!reusedSchema) {
			admitSqliteSchema(db);
			assertCanonicalSessionValidationSchema(db);
		}
		const database = {
			agentId,
			db,
			path: pathname,
			walMaintenance
		};
		openedDatabase = database;
		if (hasAgentDatabaseMaintenanceAuthority()) throw new Error("Agent database maintenance is in progress; retry after openclaw doctor --fix completes.");
		registerAgentDeletionDatabaseCleanup(database, databaseOptions)?.registerClose(createAgentDatabaseScopeOwnedClose(database, "Agent deletion cleanup"));
		registerAgentCreationClaimHandle(database, databaseOptions)?.registerClose(createAgentDatabaseScopeOwnedClose(database, "Agent creation claim"));
		if (!isValidatedReopen || !hasRegisteredOpenClawAgentDatabasePath(database, { env: options.env })) {
			assertCurrent(database);
			registerOpenClawAgentDatabase({
				agentId,
				path: pathname,
				env: options.env,
				admittedDb: db
			}, registrationObserver);
		} else if (!reusedSchema) publishOpenClawAgentDatabaseSchema(database);
		cache.terminal.clear(pathname);
		cache.unregisterExitClose ??= registerSqliteCacheExitClose(closeOpenClawAgentDatabases);
		finishPhase("registration");
		registerAgentDatabaseHandle(database, leaseId, leaseEnvironment);
		assertCurrent(database);
		recordOpenClawAgentDatabaseAdmission(leaseId, {
			agentId,
			path: pathname,
			env: leaseEnvironment
		});
		refreshAgentDatabaseIdleTimer(database);
		if (isMainThread) registerOpenClawAgentWalMaintenance(database, leaseEnvironment);
		getOpenClawDatabaseMaintenanceScope()?.own(database.db, "agent-handles", () => closeMaintenanceAgentDatabase(database));
		releaseCreationAdmission?.();
		return database;
	} catch (error) {
		const deferLeaseRelease = preparedLease !== void 0 && !isMainThread && error instanceof SqliteWorkerOpenRefusedError;
		let closeError;
		if (openedDatabase) try {
			closeCachedOpenClawAgentDatabase(openedDatabase);
		} catch (caught) {
			closeError = caught;
		}
		if (openedDb?.isOpen) {
			const successor = cache.databases.get(pathname);
			if (pending && successor && successor.db !== openedDb) {
				const retainedDb = openedDb;
				retainFailedAgentDatabaseClose(agentId, pathname, () => {
					openedWalMaintenance?.close();
					if (retainedDb.isOpen) retainedDb.close();
					releaseOpenClawAgentDatabaseLease(leaseId, releaseOptions);
				});
				throw error;
			}
			invalidateOpenClawAgentDatabaseValidation(pathname);
			const retainedDatabase = openedDatabase ?? {
				agentId,
				db: openedDb,
				path: pathname,
				walMaintenance: openedWalMaintenance ?? {
					checkpoint: () => false,
					stop: async () => {},
					reclaimFreePages: createSqliteWalReclamationResult,
					close: () => false
				}
			};
			cache.databases.set(pathname, retainedDatabase);
			refreshAgentDatabaseIdleTimer(retainedDatabase);
			cache.leases.set(pathname, {
				leaseId,
				env: leaseEnvironment
			});
			cache.failures.set(pathname, closeError ?? error);
			getOpenClawDatabaseMaintenanceScope()?.own(retainedDatabase.db, "agent-handles", () => closeMaintenanceAgentDatabase(retainedDatabase));
			cache.unregisterExitClose ??= registerSqliteCacheExitClose(closeOpenClawAgentDatabases);
		} else if (!deferLeaseRelease) {
			const closeOutcome = error instanceof SqliteWorkerOpenRefusedError ? "read-only" : void 0;
			try {
				releaseOpenClawAgentDatabaseLease(leaseId, releaseOptions, closeOutcome);
			} catch (releaseError) {
				retainFailedAgentDatabaseClose(agentId, pathname, () => releaseOpenClawAgentDatabaseLease(leaseId, releaseOptions, closeOutcome));
				throw releaseError;
			}
		}
		throw closeError ?? error;
	}
}
/** Return the matching live cache entry without materializing a database. */
function getOpenClawAgentDatabaseIfOpen(options) {
	const agentId = normalizeAgentId(options.agentId);
	assertAgentDatabaseAdmitted(agentId, { env: options.env });
	const pathname = resolveOpenClawAgentSqlitePath({
		...options,
		agentId
	});
	const database = cache.databases.get(pathname);
	if (!database?.db.isOpen) {
		assertAgentDeletionCleanupAliases(options, isSameOpenClawAgentDatabasePath);
		assertAgentCreationClaimAliases(options);
		return;
	}
	if (cache.failures.has(pathname)) throw cache.failures.get(pathname);
	if (database.agentId !== agentId) throw new Error(`OpenClaw agent database ${pathname} is already open for agent ${database.agentId}; requested agent ${agentId}.`);
	assertAgentDeletionDatabaseCleanupAccess(database, options);
	assertAgentCreationClaimAccess(database, options);
	observeOpenClawDatabaseMaintenanceResource(database.db);
	refreshAgentDatabaseIdleTimer(database);
	return database;
}
//#endregion
export { jsonOrderedTextArray as a, sessionEntrySnapshotColumnsForKeys as c, withScopedOpenClawAgentDatabaseReadOnly as d, readOpenClawAgentDatabase as f, restoreNativeErrorResponse as h, jsonObjectTextEntries as i, attachSessionEntrySnapshots as l, withFreshOpenClawAgentDatabaseReadOnly as m, getOpenClawAgentDatabaseIfOpen as n, jsonRemoveKey as o, readOpenClawAgentDatabaseSnapshot as p, jsonExtractText as r, sessionEntrySnapshotColumns as s, confirmOpenClawAgentDatabaseIntegrity as t, OpenClawAgentDatabaseReadOnlyScope as u };
