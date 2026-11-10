import { n as __exportAll } from "./openclaw-state-read-rolldown-runtime-rQ84J-ij.mjs";
import { c as coerceErrorMessage, i as readGlobalSingleton, m as toStringifiedError, s as resolveGlobalSingleton } from "./openclaw-state-read-listeners-C6ALBiqg.mjs";
import { L as resolveOpenClawStateSqlitePath, M as resolveDatabasePath, R as resolveQuarantineStorePath, l as runWithMainThreadTask } from "./openclaw-state-read-worker-cpu-DxXDPrAN.mjs";
import { A as revokeSqliteDatabaseAdmissionsForPath, At as normalizeDatabasePath, B as stageSqliteTransactionState, C as readSqliteDatabaseWriteRevision, Dt as assertExistingDatabaseIdentity, J as throwSqliteLifecycleErrors, K as createSqliteLifecycleAggregateError, Pt as readDatabasePathIdentitySync, Z as VERSION, at as materializeErrorStack, c as getSqliteDatabaseAdmission, d as hasPendingSqliteDatabaseSchemaMutation, gt as findSqlClosingParenthesis, h as onSqliteDatabaseWriteSettled, it as runOutsideAsyncWorkScope, jt as readDatabaseFileIdentity, k as revokeSqliteDatabaseAdmissions, rt as AsyncWorkScope, s as getOrLoadSqliteDatabaseAdmissionForPath, v as publishSqliteDatabaseAdmission, vt as normalizeSchemaSql, w as recordSqliteDatabaseIntegrity } from "./openclaw-state-read-sqlite-database-admission-BXby_hL9.mjs";
import { d as isPostgresSqlConnection, i as readSqliteReaderDiagnosticsForPath, s as sqliteReaderDatabasePathKey } from "./openclaw-state-read-sqlite-reader-lifecycle-CGTFS3iz.mjs";
import { a as isRecord } from "./openclaw-state-read-record-coerce-DWp7lFsP.mjs";
import { B as resolveRequiredOsHomeDir, K as containsEnvVarReference, P as isAbortError, W as resolveIdentityPathViaExistingAncestorSync, i as resolvePreferredOpenClawTmpDir, r as getChildLogger, t as createSubsystemLogger, w as resolveStateDir } from "./openclaw-state-read-subsystem-S9LTuPwa.mjs";
import { D as normalizeNullableString, O as normalizeOptionalLowercaseString, l as MAX_TIMER_TIMEOUT_MS } from "./openclaw-state-read-types.secrets-Wz8lmfvB.mjs";
import { C as readSqliteUserVersion, Ct as removeTempDirectoryAsync, D as isSqliteInspectionDeadlineOwnedByCaller, Dt as SQLITE_SNAPSHOT_PREFIX, E as createScopedSqliteReadOnlyWorker, F as isPrivateDirectoryCreationRefused, I as markPrivateDirectoryCreationRefused, M as runSqliteReadOnlyWorkerSync, Mt as isArtifactPreservingStateRead, Ot as acquireSqliteSnapshotToken, S as isSqliteSchemaVersionError, St as removeTempDirectory, T as captureSqliteReadOnlyWorkerLaunch, Tt as retainSnapshotWork, _t as SqliteSnapshotCleanupError, b as createNewerSqliteSchemaVersionError, bt as registerRetainedSnapshotTempDirectory, c as normalizeOpenClawStateSchemaReadError, j as runSqliteReadOnlyWorker, jt as artifactPreservingReads, k as resolveSqliteInspectionSignal, t as captureSqliteSnapshotStagingOwner, v as markOpenClawStateDatabaseFailure, vt as adoptPreparedLocation, w as OpenClawQuarantineReadCleanupError, wt as retainSnapshotTempDirectory, xt as registerSnapshotTempDirectory } from "./openclaw-state-read-sqlite-snapshot-staging-owner-DeVv_bRV.mjs";
import { _ as mapRetainedOperation, g as flatMapRetainedOperation, m as createRetainedOperation } from "./openclaw-state-read-worker-task-pool-CsV_Xz7_.mjs";
import { At as sameFileIdentity, mt as getNativeBinding } from "./openclaw-state-read-bounded-read-CQOkim7o.mjs";
import { a as isPathInside, b as FsSafeError, n as hasNodeErrorCode } from "./openclaw-state-read-path-DKRN8JwZ.mjs";
import { c as openStagedDirectory, h as createDirectorySync } from "./openclaw-state-read-staged-directory-DUrSLJJt.mjs";
import { t as assertAbsolutePathInput } from "./openclaw-state-read-absolute-path-CL3P5BzZ.mjs";
import { t as formatErrorMessage } from "./openclaw-state-read-errors-BV4NDRNo.mjs";
import { t as isPromiseLike } from "./openclaw-state-read-promise-like-D7-l5Fsp.mjs";
import { E as registerNodeSqliteKyselyQueryErrorHandler, T as registerNodeSqliteDisposeCallback, a as getNodeSqliteKysely, c as prepareSqliteQuerySync, i as executeSqliteQueryTakeFirstSync, t as createSqliteQueryCache } from "./openclaw-state-read-kysely-sync-DrKJlREt.mjs";
import { A as requireNodeSqlite, C as isOpenClawDatabaseMaintenanceResourceOwned, I as require_semver, N as resolveSqliteFilesystemPath, S as getOpenClawDatabaseMaintenanceScope, T as observeOpenClawDatabaseMaintenanceResource, _ as createOpenClawStateDatabaseAsyncLifecycle, c as applyPrivateModeSync, g as StateDatabaseReadAdmissionInvalidatedError, k as openNodeSqliteDatabase, m as OPENCLAW_DATABASE_SCHEMA_DOCS_URL, n as assertStateDatabaseAccessAllowed, r as assertStateDatabaseReadAllowed, v as isStateDatabaseReadAdmissionInvalidatedError, x as getOpenClawDatabaseMaintenanceResourceScope } from "./openclaw-state-read-gateway-state-owner-Bj-SghTS.mjs";
import { t as runInDetachedAsyncContext } from "./openclaw-state-read-detached-async-context-BrFwufJ7.mjs";
import { t as createDeferredCore } from "./openclaw-state-read-deferred-D0La5CRk.mjs";
import { C as captureSqliteSchemaFacts, T as schemaAdmission, a as markSqliteInspectionOperation, b as registerSqliteSchemaMutationListener, d as admitSqliteSchema, m as getAdmittedSqliteSchemaFacts, n as isSqliteCorruptionError, r as isSqliteLockError, v as isSqliteSchemaAdmissionCold, x as runSqliteReadOperationSync } from "./openclaw-state-read-sqlite-error-diagnostics-B72btzpi.mjs";
import { o as mergeProcessEnv } from "./openclaw-state-read-pid-alive-BppTQRNj.mjs";
import { r as createSqliteWorkerOperationAdmission } from "./openclaw-state-read-sqlite-worker-operation-admission-we1rdJYO.mjs";
import { a as tableExists, c as SqliteSchemaMismatchError, p as getPostgresPhysicalFacts, t as classifySqliteTableReadError } from "./openclaw-state-read-openclaw-state-db-schema-helpers-Cgf5rJqc.mjs";
import { n as sha256FileSync$1 } from "./openclaw-state-read-file-hash-BfPUyTiL.mjs";
import { i as setSqliteBusyTimeout, r as runWithSqliteBusyTimeout, t as normalizeSqliteNonNegativeInteger } from "./openclaw-state-read-sqlite-busy-timeout-BW3lmGFD.mjs";
import { n as normalizeSqliteNumber, r as readFiniteSqliteNumber } from "./openclaw-state-read-sqlite-number-DZt1m75H.mjs";
import { i as runSqliteImmediateTransactionSync } from "./openclaw-state-read-sqlite-transaction-gPY-7Ojc.mjs";
import { a as readTrackedStateDatabaseIdentity, c as createSqliteWalMaintenanceScheduler, d as registerSqliteWalWorkerMaintenance, l as isSqliteWalWorkerMaintained, s as cancelSqliteWalWriteAdmission, t as closeStateDatabaseHandle } from "./openclaw-state-read-openclaw-state-db-handle-BSLzO3AU.mjs";
import fs, { closeSync, existsSync, mkdirSync, openSync, realpathSync } from "node:fs";
import path from "node:path";
import { isMainThread } from "node:worker_threads";
import { hash, randomUUID } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import "node:fs/promises";
import { performance as performance$1 } from "node:perf_hooks";
//#region src/daemon/constants.ts
const NODE_LAUNCH_AGENT_LABEL = "ai.openclaw.node";
const NODE_SYSTEMD_SERVICE_NAME = "openclaw-node";
const NODE_WINDOWS_TASK_NAME = "OpenClaw Node";
const NODE_SERVICE_MARKER = "openclaw";
const NODE_SERVICE_KIND = "node";
const NODE_WINDOWS_TASK_SCRIPT_NAME = "node.cmd";
function resolveNodeLaunchAgentLabel() {
	return NODE_LAUNCH_AGENT_LABEL;
}
function resolveNodeSystemdServiceName() {
	return NODE_SYSTEMD_SERVICE_NAME;
}
function resolveNodeWindowsTaskName() {
	return NODE_WINDOWS_TASK_NAME;
}
function resolveNodeServiceIdentityEnvironment() {
	return {
		OPENCLAW_LAUNCHD_LABEL: resolveNodeLaunchAgentLabel(),
		OPENCLAW_SYSTEMD_UNIT: resolveNodeSystemdServiceName(),
		OPENCLAW_WINDOWS_TASK_NAME: resolveNodeWindowsTaskName(),
		OPENCLAW_WINDOWS_TASK_HIDDEN_LAUNCHER: "1",
		OPENCLAW_TASK_SCRIPT_NAME: NODE_WINDOWS_TASK_SCRIPT_NAME,
		OPENCLAW_LOG_PREFIX: "node",
		OPENCLAW_SERVICE_MARKER: NODE_SERVICE_MARKER,
		OPENCLAW_SERVICE_KIND: NODE_SERVICE_KIND
	};
}
require_semver();
const schemaPolicies = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseSchemaPolicies"), () => ({
	scopes: new AsyncLocalStorage(),
	existingDatabases: /* @__PURE__ */ new WeakMap()
}));
function canonicalPath(pathname) {
	const resolved = resolveDatabasePath({ path: pathname });
	try {
		return normalizeDatabasePath(realpathSync.native(resolved));
	} catch (error) {
		if (hasNodeErrorCode(error, "ENOENT")) return resolved;
		throw error;
	}
}
function withExistingOpenClawStateSchema(options, run) {
	getExistingOpenClawStateSchemaPath();
	const parent = schemaPolicies.scopes.getStore();
	const scope = {
		path: resolveDatabasePath(options),
		canonicalPath: canonicalPath(options.path),
		active: true
	};
	if (parent && parent.canonicalPath !== scope.canonicalPath) throw new Error("Existing shared-state schema admission cannot change its database path.");
	try {
		const result = schemaPolicies.scopes.run(scope, run);
		if (isPromiseLike(result)) return Promise.resolve(result).finally(() => {
			scope.active = false;
		});
		scope.active = false;
		return result;
	} catch (error) {
		scope.active = false;
		throw error;
	}
}
function assertSchemaScopeActive(scope) {
	if (scope && !scope.active) throw new Error("Existing shared-state schema admission has ended.");
}
function getExistingOpenClawStateSchemaPath() {
	const scope = schemaPolicies.scopes.getStore();
	assertSchemaScopeActive(scope);
	return scope?.path;
}
/** Admit this source once; retained reads only need the original scope's live lifetime. */
function captureOpenClawStateSchemaReadAdmission(pathname) {
	const scope = schemaPolicies.scopes.getStore();
	if (!scope) return;
	isExistingOpenClawStateSchema(pathname);
	return {
		path: scope.path,
		assertCurrent: () => assertSchemaScopeActive(scope)
	};
}
/** Check supplied and cached handles before exposing them to another admission policy. */
function isExistingOpenClawStateSchema(pathname, database) {
	const scopedPath = getExistingOpenClawStateSchemaPath();
	const scope = schemaPolicies.scopes.getStore();
	const admittedPath = database && schemaPolicies.existingDatabases.get(database);
	const resolvedPath = resolveDatabasePath({ path: pathname });
	const existing = scopedPath !== void 0 && (scopedPath === resolvedPath || scope?.canonicalPath === resolvedPath || scope?.canonicalPath === canonicalPath(resolvedPath));
	if (scopedPath && !existing) throw new Error(`Existing shared-state schema admission is bound to ${scopedPath}, not ${pathname}.`);
	if (admittedPath && (!existing || admittedPath !== scope?.canonicalPath)) throw new Error(`Shared-state database ${pathname} was admitted without schema repair; close its existing handle before ordinary admission.`);
	return existing;
}
function recordExistingOpenClawStateSchemaDatabase(database, pathname) {
	const scope = schemaPolicies.scopes.getStore();
	if (!scope || !isExistingOpenClawStateSchema(pathname, database)) throw new Error("Existing shared-state schema admission requires its active path scope.");
	schemaPolicies.existingDatabases.set(database, scope.canonicalPath);
}
/** The cache owns the handle inventory, including owners retained after failed cleanup. */
function assertExistingOpenClawStateSchemaCacheAdmission(pathname, cache) {
	const scopedPath = getExistingOpenClawStateSchemaPath();
	const scope = schemaPolicies.scopes.getStore();
	const requested = resolveDatabasePath({ path: pathname });
	let resolved = scope && (scopedPath === requested || scope.canonicalPath === requested) ? scope.canonicalPath : void 0;
	for (const databases of [cache.cachedDatabases, cache.retainedDatabaseHandles]) for (const { db } of databases.values()) {
		const admittedPath = schemaPolicies.existingDatabases.get(db);
		if (admittedPath && db.isOpen) {
			resolved ??= canonicalPath(pathname);
			if (admittedPath === resolved) isExistingOpenClawStateSchema(pathname, db);
		}
	}
}
function assertOpenClawStateSchemaRepairAllowed(pathname) {
	if (isExistingOpenClawStateSchema(pathname)) throw new Error(`Shared-state schema repair is owned by the existing installation at ${pathname}; update that installation before retrying the managed node.`);
}
//#endregion
//#region src/infra/crypto-digest.ts
function sha256Base64Url(input) {
	return hash("sha256", input, "base64url");
}
/** Matches the streaming helper's symlink-following path contract. */
function sha256FileSync(filePath) {
	const descriptor = openSync(filePath, "r");
	try {
		return sha256FileSync$1(descriptor).digest;
	} finally {
		closeSync(descriptor);
	}
}
//#endregion
//#region src/infra/file-descriptor.ts
/** Strict field equality; callers own any platform-specific identity tolerance. */
function sameFileMutationFingerprint(left, right) {
	return left.birthtimeNs === right.birthtimeNs && left.ctimeNs === right.ctimeNs && left.dev === right.dev && left.ino === right.ino && left.mtimeNs === right.mtimeNs && left.size === right.size;
}
/** Maps the borrowed-descriptor digest to OpenClaw's persisted artifact fields. */
function hashFileDescriptorSync(fd, maxBytes) {
	const { digest, bytes } = sha256FileSync$1(fd, { maxBytes });
	return {
		sha256: digest,
		sizeBytes: bytes
	};
}
//#endregion
//#region src/infra/sqlite-snapshot-file.ts
function assertExpectedContent(actual, expected, filePath) {
	if (actual.sizeBytes !== expected.sizeBytes) throw new Error(`SQLite snapshot size mismatch for ${filePath}: expected ${expected.sizeBytes}, got ${actual.sizeBytes}`);
	if (actual.sha256 !== expected.sha256) throw new Error(`SQLite snapshot hash mismatch for ${filePath}: expected ${expected.sha256}, got ${actual.sha256}`);
}
function assertOpenFileIdentitySync(fileDescriptor, filePath, expectedIdentity) {
	const openedIdentity = fs.fstatSync(fileDescriptor, { bigint: true });
	const currentIdentity = fs.lstatSync(filePath, { bigint: true });
	if (!openedIdentity.isFile() || !currentIdentity.isFile() || !sameFileIdentity(expectedIdentity, openedIdentity) || !sameFileIdentity(expectedIdentity, currentIdentity)) throw new Error(`SQLite snapshot file changed: ${filePath}`);
}
function hashPublishedFileSync(filePath, expectedIdentity) {
	const fileDescriptor = fs.openSync(filePath, "r");
	try {
		assertOpenFileIdentitySync(fileDescriptor, filePath, expectedIdentity);
		const initialStat = fs.fstatSync(fileDescriptor, { bigint: true });
		const content = hashFileDescriptorSync(fileDescriptor);
		const finalStat = fs.fstatSync(fileDescriptor, { bigint: true });
		if (!sameFileMutationFingerprint(initialStat, finalStat)) {
			if (!sameFileStatFingerprint(initialStat, finalStat)) throw new Error(`SQLite snapshot file changed while reading: ${filePath}`);
			assertExpectedContent(hashFileDescriptorSync(fileDescriptor), content, filePath);
		}
		assertOpenFileIdentitySync(fileDescriptor, filePath, expectedIdentity);
		return content;
	} finally {
		fs.closeSync(fileDescriptor);
	}
}
function sameFileStatFingerprint(left, right) {
	return sameFileIdentity(left, right) && left.size === right.size;
}
//#endregion
//#region src/infra/sqlite-file-generation.ts
function readSqliteIntegrityFileIdentity(pathname, expected) {
	const current = fs.statSync(pathname, { bigint: true });
	if (!current.isFile() || expected && !sameFileIdentity(expected, current)) throw new Error(`SQLite source changed during integrity admission: ${pathname}`);
	return {
		dev: current.dev,
		ino: current.ino,
		size: current.size
	};
}
function canRetainDigest(stat, observedAtNs) {
	const cutoff = observedAtNs - 2000000000n;
	return typeof stat.dev === "bigint" && typeof stat.ino === "bigint" && typeof stat.size === "bigint" && stat.dev !== 0n && stat.ino !== 0n && typeof stat.birthtimeNs === "bigint" && typeof stat.mtimeNs === "bigint" && typeof stat.ctimeNs === "bigint" && stat.mtimeNs > 0n && stat.ctimeNs > 0n && stat.mtimeNs < cutoff && stat.ctimeNs < cutoff;
}
function timestampNs(nanoseconds, milliseconds) {
	return nanoseconds ?? (typeof milliseconds === "bigint" ? milliseconds * 1000000n : BigInt(Math.trunc(milliseconds * 1e6)));
}
function fingerprintFile(pathname, verified) {
	const observedAtNs = BigInt(Date.now()) * 1000000n;
	const fd = fs.openSync(pathname, "r");
	try {
		const before = fs.fstatSync(fd, { bigint: true });
		if (!before.isFile()) throw new Error("SQLite generation target must be a regular file");
		const previous = verified.get(pathname);
		if (previous && canRetainDigest(before, observedAtNs) && sameFileMutationFingerprint(previous, before)) {
			const after = fs.fstatSync(fd, { bigint: true });
			const current = fs.statSync(pathname, { bigint: true });
			if (current.isFile() && sameFileMutationFingerprint(before, after) && sameFileMutationFingerprint(after, current)) return previous;
		}
		const { sha256 } = hashPublishedFileSync(fs.realpathSync.native(pathname), before);
		const after = fs.fstatSync(fd, { bigint: true });
		const current = fs.statSync(pathname, { bigint: true });
		if (!sameFileStatFingerprint(before, after) || !sameFileStatFingerprint(after, current)) throw new Error(`SQLite generation target changed while hashing: ${pathname}`);
		const fingerprint = {
			birthtimeNs: timestampNs(after.birthtimeNs, after.birthtimeMs),
			ctimeNs: timestampNs(after.ctimeNs, after.ctimeMs),
			dev: after.dev,
			ino: after.ino,
			mtimeNs: timestampNs(after.mtimeNs, after.mtimeMs),
			sha256,
			size: after.size
		};
		if (canRetainDigest(before, observedAtNs) && sameFileMutationFingerprint(before, after) && sameFileMutationFingerprint(after, current)) verified.set(pathname, fingerprint);
		else verified.delete(pathname);
		return fingerprint;
	} finally {
		fs.closeSync(fd);
	}
}
function readOptionalFile(pathname, verified) {
	try {
		return fingerprintFile(pathname, verified);
	} catch (error) {
		if (error.code === "ENOENT") {
			verified.delete(pathname);
			return;
		}
		throw error;
	}
}
/** One observation owns its digests; every read still checks the complete family. */
function createSqliteFileGenerationReader() {
	const verified = /* @__PURE__ */ new Map();
	return (pathname) => {
		const database = fingerprintFile(pathname, verified);
		const journal = readOptionalFile(`${pathname}-journal`, verified);
		const wal = readOptionalFile(`${pathname}-wal`, verified);
		return {
			database,
			...journal ? { journal } : {},
			...wal ? { wal } : {}
		};
	};
}
/** Raw source reads require an isolated process or a drained database owner. */
function readStableSqliteFileGeneration(pathname, readGeneration = createSqliteFileGenerationReader()) {
	const first = readGeneration(pathname);
	const second = readGeneration(pathname);
	if (!sameSqliteFileGeneration(first, second)) throw new Error(`SQLite file generation changed while reading: ${pathname}`);
	return second;
}
function sameFileFingerprint(left, right) {
	return left.dev === right.dev && left.ino === right.ino && sameFileStatFingerprint(left, right) && left.sha256 === right.sha256;
}
function sameOptionalFileFingerprint(left, right) {
	return left === void 0 ? right === void 0 : right !== void 0 && sameFileFingerprint(left, right);
}
function sameSqliteFileGeneration(left, right) {
	return sameFileFingerprint(left.database, right.database) && sameOptionalFileFingerprint(left.journal, right.journal) && sameOptionalFileFingerprint(left.wal?.size === 0n ? void 0 : left.wal, right.wal?.size === 0n ? void 0 : right.wal);
}
function serializeFileFingerprint(fingerprint) {
	return {
		birthtimeNs: fingerprint.birthtimeNs.toString(),
		ctimeNs: fingerprint.ctimeNs.toString(),
		dev: fingerprint.dev.toString(),
		ino: fingerprint.ino.toString(),
		mtimeNs: fingerprint.mtimeNs.toString(),
		sha256: fingerprint.sha256,
		size: fingerprint.size.toString()
	};
}
function serializeSqliteFileGeneration(generation) {
	return JSON.stringify({
		database: serializeFileFingerprint(generation.database),
		...generation.journal ? { journal: serializeFileFingerprint(generation.journal) } : {},
		...generation.wal ? { wal: serializeFileFingerprint(generation.wal) } : {}
	});
}
function parseFileFingerprint(fingerprint) {
	if (!isRecord(fingerprint)) throw new Error("SQLite file fingerprint must be an object");
	for (const field of [
		"birthtimeNs",
		"ctimeNs",
		"dev",
		"ino",
		"mtimeNs",
		"size"
	]) if (typeof fingerprint[field] !== "string" || !/^-?\d+$/u.test(fingerprint[field])) throw new Error(`SQLite file fingerprint ${field} is invalid`);
	if (typeof fingerprint.sha256 !== "string" || !/^[a-f0-9]{64}$/u.test(fingerprint.sha256)) throw new Error("SQLite file fingerprint sha256 is invalid");
	return {
		birthtimeNs: BigInt(fingerprint.birthtimeNs),
		ctimeNs: BigInt(fingerprint.ctimeNs),
		dev: BigInt(fingerprint.dev),
		ino: BigInt(fingerprint.ino),
		mtimeNs: BigInt(fingerprint.mtimeNs),
		sha256: fingerprint.sha256,
		size: BigInt(fingerprint.size)
	};
}
function parseSqliteFileGeneration(serialized) {
	const generation = JSON.parse(serialized);
	if (!isRecord(generation)) throw new Error("SQLite file generation must be an object");
	return {
		database: parseFileFingerprint(generation.database),
		...generation.journal === void 0 ? {} : { journal: parseFileFingerprint(generation.journal) },
		...generation.wal === void 0 ? {} : { wal: parseFileFingerprint(generation.wal) }
	};
}
//#endregion
//#region src/utils/boolean.ts
const DEFAULT_TRUTHY = [
	"true",
	"1",
	"yes",
	"on"
];
const DEFAULT_FALSY = [
	"false",
	"0",
	"no",
	"off"
];
function asBoolean(value) {
	return typeof value === "boolean" ? value : void 0;
}
function parseBooleanValue(value, options = {}) {
	const booleanValue = asBoolean(value);
	if (booleanValue !== void 0) return booleanValue;
	const normalized = normalizeOptionalLowercaseString(value);
	if (!normalized) return;
	if ((options.truthy ?? DEFAULT_TRUTHY).includes(normalized)) return true;
	if ((options.falsy ?? DEFAULT_FALSY).includes(normalized)) return false;
}
//#endregion
//#region src/infra/sqlite-file-generation-worker.ts
/** Raw descriptor closes must not release a sibling connection's process-wide SQLite locks. */
function readSqliteFileGenerationSync(pathname) {
	return parseSqliteFileGeneration(runSqliteReadOnlyWorkerSync(pathname, void 0, "file-generation"));
}
async function readSqliteFileGeneration(pathname, signal) {
	return parseSqliteFileGeneration(await runSqliteReadOnlyWorker(pathname, {
		mode: "file-generation",
		signal
	}));
}
//#endregion
//#region src/infra/sqlite-integrity.ts
/** The gate includes the driver's check, awaited lifetime, and admission revalidation. */
function* sqliteIntegrityCheckSteps(database, databaseLabel, diagnostics) {
	const startedAt = performance$1.now();
	const check = {
		database,
		databaseLabel
	};
	if (diagnostics) {
		check.timing = {};
		diagnostics.integrityGateMode = "full";
		delete diagnostics.integrityCheckSyncMs;
		delete diagnostics.integrityOutsideCheckMs;
		delete diagnostics.integrityWorkerCheckMs;
		delete diagnostics.integrityWorkerLifetimeMs;
		delete diagnostics.integrityOutsideWorkerMs;
	}
	try {
		yield check;
		if (diagnostics) diagnostics.integrityGateOutcome = "healthy";
	} catch (error) {
		if (diagnostics) diagnostics.integrityGateOutcome = "failed";
		throw error;
	} finally {
		if (diagnostics) {
			diagnostics.integrityGateMs = Math.floor(performance$1.now() - startedAt);
			if (check.timing?.syncElapsedMs !== void 0) {
				diagnostics.integrityCheckSyncMs = Math.floor(check.timing.syncElapsedMs);
				diagnostics.integrityOutsideCheckMs = diagnostics.integrityGateMs - diagnostics.integrityCheckSyncMs;
			}
			if (check.timing?.workerCheckElapsedMs !== void 0) diagnostics.integrityWorkerCheckMs = Math.floor(check.timing.workerCheckElapsedMs);
			if (check.timing?.workerLifetimeElapsedMs !== void 0) {
				diagnostics.integrityWorkerLifetimeMs = Math.floor(check.timing.workerLifetimeElapsedMs);
				diagnostics.integrityOutsideWorkerMs = diagnostics.integrityGateMs - diagnostics.integrityWorkerLifetimeMs;
			}
		}
	}
}
/** Measure only the calling driver's synchronous check, excluding admission and resumption. */
function runSqliteIntegrityCheckSync(check) {
	const timing = check.timing;
	const startedAt = timing ? performance$1.now() : 0;
	try {
		assertSqliteIntegrity(check.database, check.databaseLabel);
	} finally {
		if (timing) timing.syncElapsedMs = performance$1.now() - startedAt;
	}
}
/** Run the same admission steps synchronously when the caller cannot yield. */
function runSqliteIntegrityOperationSync(operation, beforeResume, repairIntegrityError) {
	beforeResume?.();
	let step = operation.next();
	while (!step.done) {
		let failure;
		try {
			runSqliteIntegrityCheckSync(step.value);
		} catch (error) {
			failure = { error };
		}
		beforeResume?.();
		if (failure && repairIntegrityError) {
			const original = failure.error;
			try {
				if (repairIntegrityError(step.value, original)) failure = void 0;
			} catch (repairError) {
				if (original instanceof Error) original.message += ` Startup FTS repair failed: ${String(repairError)}`;
			}
		}
		step = failure ? operation.throw(failure.error) : operation.next();
	}
	return step.value;
}
const MAX_REPORTED_FOREIGN_KEY_VIOLATIONS = 5;
var SqliteRepairableForeignKeyError = class extends Error {
	constructor(databaseLabel, orphanCount) {
		super(`SQLite foreign_key_check failed for ${databaseLabel}: repairable task_delivery_state.task_id references task_runs.task_id cascade-owned orphans (${orphanCount} rows). Run openclaw doctor --fix to migrate this legacy state before retrying.`);
		this.name = "SqliteRepairableForeignKeyError";
		this.repair = {
			kind: "task-delivery-orphans",
			relation: "task_delivery_state.task_id",
			parentTable: "task_runs",
			orphanCount
		};
	}
};
/** Return whether a named integrity failure proves persistent database damage. */
function isTerminalSqliteIntegrityError(error) {
	if (error.name !== "SqliteIntegrityError") return false;
	if (!error.cause) return true;
	return isSqliteCorruptionError(error.cause);
}
/** Require structural, table/index, and referential consistency before trusting a database. */
function assertSqliteIntegrity(database, databaseLabel, options = "integrity_check") {
	const check = typeof options === "string" ? options : "integrity_check";
	const settings = typeof options === "object" ? options : {};
	let staleFts = false;
	try {
		runSqliteCheck(database, databaseLabel, check, void 0, settings.allFindings || settings.ftsSchemas !== void 0);
	} catch (error) {
		if (!settings.ftsSchemas || !(error instanceof SqliteIntegrityError) || !error.findings || !classifySqliteFtsIntegrityFindings(database, error.findings, settings.ftsSchemas)) throw error;
		staleFts = true;
	}
	runSqliteForeignKeyCheck(database, databaseLabel);
	if (check === "integrity_check" && !staleFts) recordSqliteDatabaseIntegrity(database);
	return { integrityCheck: "ok" };
}
/** Only exact, owned FTS definitions may treat their inverted index as derived data. */
function classifySqliteFtsIntegrityFindings(database, findings, schemas) {
	const names = /* @__PURE__ */ new Set();
	for (const finding of findings) {
		if (finding === "ok") continue;
		const match = typeof finding === "string" ? /^malformed inverted index for FTS5 table main\.([A-Za-z_][A-Za-z0-9_]*)$/u.exec(finding) : null;
		if (!match?.[1]) return;
		names.add(match[1]);
	}
	if (names.size === 0) return;
	const definitions = /* @__PURE__ */ new Map();
	for (const schema of schemas) for (const match of schema.matchAll(/CREATE VIRTUAL TABLE (?:IF NOT EXISTS )?([A-Za-z_][A-Za-z0-9_]*) USING fts5\s*\(/gu)) {
		const name = match[1];
		const end = findSqlClosingParenthesis(schema, match.index + match[0].length - 1);
		const variants = definitions.get(name) ?? /* @__PURE__ */ new Set();
		variants.add(normalizeSchemaSql(schema.slice(match.index, end + 1)));
		definitions.set(name, variants);
	}
	const tables = captureSqliteSchemaFacts(database).tableSql;
	for (const name of names) {
		const sql = tables.get(name);
		if (typeof sql !== "string" || !definitions.get(name)?.has(normalizeSchemaSql(sql))) return;
	}
	return [...names].toSorted();
}
/** Reconfirm an advisory failure against the database currently at a closed path. */
function confirmSqliteFileIntegrity(pathname, databaseLabel) {
	for (let attempt = 0; attempt < 3; attempt += 1) {
		let initial;
		let database;
		try {
			initial = readStableSqliteFileGeneration(pathname);
			database = openNodeSqliteDatabase(pathname, { readOnly: true });
		} catch (error) {
			return unboundSqliteIntegrityFailure(error);
		}
		let opened;
		try {
			opened = readStableSqliteFileGeneration(pathname);
		} catch {}
		if (!opened || !sameSqliteFileGeneration(initial, opened)) {
			const closeError = closeSqliteDatabase(database);
			if (closeError) return unboundSqliteIntegrityFailure(closeError);
			continue;
		}
		let confirmation;
		try {
			assertSqliteIntegrity(database, databaseLabel);
			confirmation = { status: "healthy" };
		} catch (error) {
			confirmation = failedSqliteIntegrityConfirmation(error);
		}
		const closeError = closeSqliteDatabase(database);
		if (closeError && confirmation.status === "healthy") confirmation = failedSqliteIntegrityConfirmation(closeError);
		let final;
		try {
			final = readStableSqliteFileGeneration(pathname);
		} catch {
			continue;
		}
		if (!sameSqliteFileGeneration(opened, final)) continue;
		if (confirmation.status === "healthy") return {
			status: "healthy",
			generation: final
		};
		return confirmation.terminal ? {
			...confirmation,
			generation: final,
			terminal: true
		} : {
			...confirmation,
			terminal: false
		};
	}
	return unboundSqliteIntegrityFailure(/* @__PURE__ */ new Error(`SQLite file generation did not stabilize during confirmation: ${pathname}`));
}
function failedSqliteIntegrityConfirmation(error) {
	const normalized = toStringifiedError(error);
	return {
		status: "failed",
		error: normalized,
		terminal: isTerminalSqliteIntegrityError(normalized)
	};
}
function unboundSqliteIntegrityFailure(error) {
	return {
		status: "failed",
		error: toStringifiedError(error),
		terminal: false
	};
}
function closeSqliteDatabase(database) {
	try {
		database.close();
		return;
	} catch (error) {
		return toStringifiedError(error);
	}
}
function readSqliteCheckFindings(database, pragma, tableName, allFindings = false) {
	const argument = tableName ? `('${tableName.replaceAll("'", "''")}')` : allFindings ? "(2147483647)" : "";
	return database.prepare(`PRAGMA ${pragma}${argument};`).all().map((row) => row[pragma] ?? Object.values(row)[0]);
}
function runSqliteCheck(database, databaseLabel, pragma, tableName, allFindings = false) {
	let results;
	try {
		results = readSqliteCheckFindings(database, pragma, tableName, allFindings);
	} catch (error) {
		throw new SqliteIntegrityError(`SQLite ${pragma} failed for ${databaseLabel}: ${error instanceof Error ? error.message : String(error)}`, error);
	}
	if (results.length === 1 && results[0] === "ok") return "ok";
	throw new SqliteIntegrityError(`SQLite ${pragma} failed for ${databaseLabel}: ${results.map((result) => String(result)).join("; ") || "no result"}`, void 0, results);
}
function runSqliteForeignKeyCheck(database, databaseLabel) {
	let violationCount = 0;
	let repairable = true;
	let taskDeliveryForeignKeyId;
	const violations = [];
	try {
		const statement = database.prepare("PRAGMA foreign_key_check;");
		statement.setReadBigInts(true);
		for (const violation of statement.iterate()) {
			violationCount += 1;
			retainSortedForeignKeyViolation(violations, violation);
			if (repairable) {
				if (violation.table === "task_delivery_state" && violation.parent === "task_runs") {
					taskDeliveryForeignKeyId ??= readTaskDeliveryCascadeForeignKeyId(database);
					repairable = violation.fkid === taskDeliveryForeignKeyId;
				} else repairable = false;
			}
		}
	} catch (error) {
		throw new SqliteIntegrityError(`SQLite foreign_key_check failed for ${databaseLabel}: ${error instanceof Error ? error.message : String(error)}`, error);
	}
	if (violations.length === 0) return;
	if (repairable) throw new SqliteRepairableForeignKeyError(databaseLabel, violationCount);
	const details = violations.map(formatSqliteForeignKeyViolation);
	if (violationCount > MAX_REPORTED_FOREIGN_KEY_VIOLATIONS) details.push("additional violations omitted");
	throw new SqliteIntegrityError(`SQLite foreign_key_check failed for ${databaseLabel}: ${details.join("; ")}`);
}
function readTaskDeliveryCascadeForeignKeyId(database) {
	const statement = database.prepare("PRAGMA foreign_key_list(task_delivery_state);");
	statement.setReadBigInts(true);
	const foreignKeys = statement.all();
	const taskKey = foreignKeys.find((key) => key.table === "task_runs" && key.from === "task_id" && key.to === "task_id" && key.on_delete === "CASCADE");
	return taskKey && typeof taskKey.id === "bigint" && foreignKeys.filter((key) => key.id === taskKey.id).length === 1 ? taskKey.id : void 0;
}
var SqliteIntegrityError = class extends Error {
	constructor(message, cause, findings) {
		super(cause === void 0 ? `${message}. Stop the Gateway, run "openclaw doctor --fix" to inspect and repair this database, and restart. Only if Doctor still cannot repair the offline database, preserve the database and WAL and restore a verified backup.` : message, cause === void 0 ? void 0 : { cause });
		this.findings = findings;
		this.name = "SqliteIntegrityError";
	}
};
function retainSortedForeignKeyViolation(retained, violation) {
	retained.push(violation);
	retained.sort(compareSqliteForeignKeyViolations);
	if (retained.length > MAX_REPORTED_FOREIGN_KEY_VIOLATIONS) retained.pop();
}
function compareSqliteForeignKeyViolations(left, right) {
	const tableOrder = Buffer.compare(Buffer.from(left.table), Buffer.from(right.table));
	if (tableOrder !== 0) return tableOrder;
	if (left.rowid === null || right.rowid === null) {
		if (left.rowid !== right.rowid) return left.rowid === null ? -1 : 1;
	} else if (left.rowid !== right.rowid) return left.rowid < right.rowid ? -1 : 1;
	const parentOrder = Buffer.compare(Buffer.from(left.parent), Buffer.from(right.parent));
	if (parentOrder !== 0) return parentOrder;
	if (left.fkid === right.fkid) return 0;
	return left.fkid < right.fkid ? -1 : 1;
}
function formatSqliteForeignKeyViolation(violation) {
	const row = violation.rowid === null ? "row without rowid" : `row ${violation.rowid.toString()}`;
	return `${violation.table} ${row} references ${violation.parent} (foreign key ${violation.fkid.toString()})`;
}
//#endregion
//#region src/infra/sqlite-terminal-open-latch.ts
function generationMatchesPath(pathname, expected) {
	try {
		return sameSqliteFileGeneration(expected, readSqliteFileGenerationSync(pathname));
	} catch {
		return false;
	}
}
/**
* Per-path latch for terminal database-open failures (newer schema, proven
* corruption). Recording quarantines the path: any live handle is closed and
* every later open fails fast until doctor repairs the file and clears it.
*/
function createSqliteTerminalOpenLatch(options) {
	const failures = /* @__PURE__ */ new Map();
	return {
		/** Read the owner's recorded fact without running filesystem or database inspection. */
		peek: (pathname) => failures.get(path.resolve(pathname))?.error,
		get: (pathname) => {
			const resolvedPath = path.resolve(pathname);
			const failure = failures.get(resolvedPath);
			if (!failure) return;
			if (failure.generation && !generationMatchesPath(resolvedPath, failure.generation)) {
				failures.delete(resolvedPath);
				return;
			}
			return failure.error;
		},
		async getAsync(pathname, isCurrentGeneration) {
			const resolvedPath = path.resolve(pathname);
			const failure = failures.get(resolvedPath);
			if (failure?.generation && !await isCurrentGeneration(resolvedPath, failure.generation)) {
				failures.delete(resolvedPath);
				return;
			}
			return failure?.error;
		},
		record: (pathname, error, generation) => {
			const resolvedPath = path.resolve(pathname);
			if (generation && !generationMatchesPath(resolvedPath, generation)) return false;
			failures.set(resolvedPath, {
				error,
				...generation ? { generation } : {}
			});
			options.closeByPath(resolvedPath, error);
			return true;
		},
		clear: (pathname) => {
			failures.delete(path.resolve(pathname));
		},
		clearAll: (rootPath) => {
			for (const pathname of failures.keys()) if (rootPath === void 0 || isPathInside(rootPath, pathname)) failures.delete(pathname);
		}
	};
}
//#endregion
//#region src/infra/gateway-scheduler.ts
const log$3 = createSubsystemLogger("gateway/scheduler");
const hostClock = {
	now: () => Date.now(),
	monotonicNow: () => performance.now(),
	arm: (run, delayMs) => {
		const timer = setTimeout(() => {
			runWithMainThreadTask("scheduler:wake", () => {
				run();
			});
		}, delayMs);
		timer.unref();
		return () => clearTimeout(timer);
	}
};
/** Next maintenance slot on one clock after a run, skipping missed slots without replay. */
function nextMaintenanceSlot(slotMs, clockMs, everyMs) {
	if (slotMs - clockMs > everyMs / 2) return slotMs;
	return slotMs + (Math.floor(Math.max(0, clockMs - slotMs) / everyMs) + 1) * everyMs;
}
/** Owns Gateway wakeups; stores and execution owners retain their deadlines and authority. */
var GatewayScheduler = class {
	constructor(options = {}) {
		this.jobs = /* @__PURE__ */ new Map();
		this.pending = /* @__PURE__ */ new Set();
		this.dispatching = false;
		this.timerGeneration = 0;
		this.controller = new AbortController();
		this.clock = options.clock ?? hostClock;
	}
	get signal() {
		return this.controller.signal;
	}
	now() {
		return this.clock.now();
	}
	get nextWakeAtMs() {
		const nowMs = this.now();
		const elapsedMs = this.clock.monotonicNow();
		let next = null;
		for (const job of this.jobs.values()) {
			if (job.running) continue;
			const atMs = nowMs + this.remaining(job, nowMs, elapsedMs);
			next = next === null ? atMs : Math.min(next, atMs);
		}
		return next;
	}
	/** Closes one owner's timers without retiring siblings or losing in-flight joins. */
	scope() {
		const controller = new AbortController();
		const owner = {
			signal: AbortSignal.any([this.signal, controller.signal]),
			jobs: /* @__PURE__ */ new Set()
		};
		const beginClose = () => {
			controller.abort();
			materializeErrorStack(controller.signal.reason);
			materializeErrorStack(owner.signal.reason);
			for (const job of owner.jobs) this.cancel(job);
		};
		const close = () => {
			beginClose();
			const running = [...owner.jobs].flatMap((job) => job.running ?? []);
			return running.length > 0 ? Promise.all(running).then(() => void 0) : void 0;
		};
		return {
			signal: owner.signal,
			now: () => this.now(),
			schedule: (params) => this.scheduleOwned(params, owner),
			beginClose,
			close,
			stop: async () => {
				await close();
			}
		};
	}
	schedule(params) {
		return this.scheduleOwned(params);
	}
	scheduleOwned(params, owner) {
		const relative = "delayMs" in params;
		const nowMs = this.now();
		const requestedAtMs = relative ? nowMs + params.delayMs : params.atMs;
		const atMs = params.phase === "maintenance" ? Math.max(nowMs, Math.floor(requestedAtMs / 1e4) * 1e4) : requestedAtMs;
		if (!Number.isFinite(atMs) || params.everyMs !== void 0 && (!Number.isFinite(params.everyMs) || params.everyMs <= 0)) throw new Error(`Invalid Gateway schedule: ${params.id}`);
		const cancelled = this.signal.aborted || owner?.signal.aborted === true;
		const previous = cancelled ? void 0 : this.jobs.get(params.id);
		const job = {
			id: params.id,
			diagnosticName: `scheduler:${params.id.startsWith("maintenance:") ? params.id.split(":").slice(0, 3).join(":") : params.id.split(/[:/]/u, 1)[0]}`,
			run: params.run,
			everyMs: params.everyMs,
			phase: params.phase,
			atMs,
			elapsedAtMs: relative || params.everyMs !== void 0 ? this.clock.monotonicNow() + Math.max(0, atMs - nowMs) : void 0,
			context: runOutsideAsyncWorkScope(() => AsyncLocalStorage.snapshot()),
			cancelled,
			owner
		};
		if (params.mode === "earliest" && previous && !previous.running) {
			job.atMs = Math.min(job.atMs, previous.atMs);
			if (previous.elapsedAtMs !== void 0) job.elapsedAtMs = job.elapsedAtMs === void 0 ? previous.elapsedAtMs : Math.min(job.elapsedAtMs, previous.elapsedAtMs);
		}
		const cancel = () => this.cancel(job);
		if (!cancelled) {
			owner?.jobs.add(job);
			this.jobs.set(job.id, job);
			if (previous) this.cancel(previous);
			this.arm();
		}
		return {
			get atMs() {
				return job.atMs;
			},
			cancel,
			stop: async () => {
				cancel();
				await job.running;
			}
		};
	}
	cancel(job) {
		job.cancelled = true;
		if (!job.running) job.owner?.jobs.delete(job);
		if (this.jobs.get(job.id) === job) {
			this.jobs.delete(job.id);
			this.arm();
		}
	}
	beginClose() {
		this.controller.abort();
		materializeErrorStack(this.controller.signal.reason);
		this.timerGeneration += 1;
		this.cancelTimer?.();
		this.cancelTimer = void 0;
		for (const job of this.jobs.values()) this.cancel(job);
		this.jobs.clear();
	}
	async stop() {
		this.beginClose();
		await Promise.all(this.pending);
	}
	remaining(job, nowMs, elapsedMs) {
		const wallDelay = job.atMs - nowMs;
		return job.elapsedAtMs === void 0 ? wallDelay : Math.min(wallDelay, job.elapsedAtMs - elapsedMs);
	}
	arm() {
		if (this.signal.aborted || this.dispatching) return;
		this.cancelTimer?.();
		this.cancelTimer = void 0;
		const generation = ++this.timerGeneration;
		const next = this.nextWakeAtMs;
		if (next !== null) {
			const nowMs = this.now();
			const delayMs = Math.min(2147483647, Math.max(0, Math.ceil(next - nowMs)));
			this.cancelTimer = runInDetachedAsyncContext(() => this.clock.arm(() => generation === this.timerGeneration ? this.wake(nowMs + delayMs) : void 0, delayMs));
		}
	}
	wake(expectedAtMs) {
		this.cancelTimer = void 0;
		if (this.signal.aborted) return;
		const nowMs = this.now();
		const elapsedMs = this.clock.monotonicNow();
		const due = [...this.jobs.values()].filter((job) => !job.running && this.remaining(job, nowMs, elapsedMs) <= 0).toSorted((a, b) => this.remaining(a, nowMs, elapsedMs) - this.remaining(b, nowMs, elapsedMs));
		let started;
		if (nowMs - expectedAtMs > 6e4) log$3.debug(`late wake by ${nowMs - expectedAtMs}ms; coalescing ${due.length} due jobs`);
		this.dispatching = true;
		try {
			for (const job of due) {
				if (this.signal.aborted || job.cancelled || job.owner?.signal.aborted || this.jobs.get(job.id) !== job) continue;
				if (job.everyMs === void 0) this.jobs.delete(job.id);
				const running = this.run(job);
				if (running) (started ??= []).push(running);
			}
		} finally {
			this.dispatching = false;
			this.arm();
		}
		return started ? Promise.all(started).then(() => void 0) : void 0;
	}
	run(job) {
		log$3[job.everyMs === void 0 ? "debug" : "trace"](`running ${job.id}`);
		const done = createDeferredCore();
		const work = new AsyncWorkScope();
		job.running = done.promise;
		this.pending.add(done.promise);
		const finish = () => {
			job.running = void 0;
			this.pending.delete(done.promise);
			if (job.everyMs !== void 0 && !job.cancelled && !this.signal.aborted) {
				if (job.phase === "maintenance") {
					const alignmentMs = job.atMs - Math.floor(job.atMs / 1e4) * 1e4;
					job.atMs -= alignmentMs;
					if (job.elapsedAtMs !== void 0) job.elapsedAtMs -= alignmentMs;
					job.atMs = nextMaintenanceSlot(job.atMs, this.now(), job.everyMs);
					if (job.elapsedAtMs !== void 0) job.elapsedAtMs = nextMaintenanceSlot(job.elapsedAtMs, this.clock.monotonicNow(), job.everyMs);
				} else {
					job.atMs = this.now() + job.everyMs;
					job.elapsedAtMs = this.clock.monotonicNow() + job.everyMs;
				}
			} else job.owner?.jobs.delete(job);
			done.resolve();
			this.arm();
		};
		let result = void 0;
		try {
			result = job.context(() => runWithMainThreadTask(job.diagnosticName, () => work.run(job.run)));
		} catch (error) {
			log$3.error(`${job.id} failed: ${String(error)}`);
		}
		if (!result && !work.hasPendingWork) {
			finish();
			return;
		}
		Promise.resolve(result).catch((error) => log$3.error(`${job.id} failed: ${String(error)}`)).then(() => AsyncWorkScope.runWhenAllIdle(() => [work], () => work.drain())).finally(finish);
		return done.promise;
	}
};
//#endregion
//#region src/infra/sqlite-wal-checkpoint.ts
const checkpointListeners = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWalCheckpointListeners"), () => /* @__PURE__ */ new Set());
/** A relayed worker result adds host observations without claiming visibility into other threads. */
function observeSqliteWalCheckpointHealth(databasePath, health) {
	const { activeReaders: previousReaders, readerDiagnostics: previousDiagnostics, ...observation } = health;
	if (health.state === "complete") return observation;
	const { activeReaders, ...local } = readSqliteReaderDiagnosticsForPath(databasePath);
	return {
		...observation,
		activeReaders: [...(previousReaders ?? []).filter((reader) => reader.threadId !== local.threadId), ...activeReaders].toSorted((left, right) => right.ageMs - left.ageMs).slice(0, 8),
		readerDiagnostics: [...(previousDiagnostics ?? []).filter((diagnostic) => diagnostic.threadId !== local.threadId), local].slice(-8)
	};
}
function notifyCheckpoint(databasePath, snapshot) {
	for (const listener of checkpointListeners) try {
		listener({
			databasePath: sqliteReaderDatabasePathKey(databasePath),
			health: structuredClone(snapshot.health),
			observedAtNs: snapshot.observedAtNs,
			lastCompletedAtNs: snapshot.lastCompletedAtNs
		});
	} catch {}
}
/** Worker result transport relays the recorded fact and returns its enriched diagnostic snapshot. */
function publishSqliteWalCheckpointObservation(databasePath, snapshot) {
	const observed = {
		health: observeSqliteWalCheckpointHealth(databasePath, snapshot.health),
		observedAtNs: snapshot.observedAtNs,
		lastCompletedAtNs: snapshot.lastCompletedAtNs
	};
	notifyCheckpoint(databasePath, observed);
	return observed;
}
function sqliteFileBytes(pathname) {
	try {
		return fs.statSync(pathname).size;
	} catch (error) {
		if (hasNodeErrorCode(error, "ENOENT")) return 0;
		throw error;
	}
}
function readCheckpointResult(row) {
	const [busy, logFrames, checkpointedFrames] = Object.values(row ?? {}).map((value) => normalizeSqliteNumber(typeof value === "number" || typeof value === "bigint" ? value : null));
	if (busy === void 0 || logFrames === void 0 || checkpointedFrames === void 0) throw new Error("SQLite returned an invalid WAL checkpoint result");
	return {
		busy,
		logFrames,
		checkpointedFrames
	};
}
function checkpoint(database, mode) {
	return database.prepare(`PRAGMA wal_checkpoint(${mode});`).get();
}
/** Offline maintenance must stop before compaction or recovery if truncation remains busy. */
var SqliteWalCheckpointBusyError = class extends Error {};
function truncateSqliteWal(database, sqlitePath) {
	const row = checkpoint(database, "TRUNCATE");
	const busy = readFiniteSqliteNumber(row?.busy ?? (row ? Object.values(row)[0] : void 0));
	if (busy === void 0) throw new Error(`SQLite checkpoint returned an invalid result for ${sqlitePath}.`);
	if (busy !== 0) throw new SqliteWalCheckpointBusyError(`SQLite checkpoint remained busy for ${sqlitePath}. Stop OpenClaw and retry.`);
}
/** The maintenance lifecycle owns this checkpoint result and its last observation. */
function createSqliteWalCheckpoint(database, options, journalSizeLimitBytes) {
	let snapshot;
	const checkpointObservation = () => ({
		state: "error",
		observedAtMs: Date.now(),
		walBytes: null,
		databaseBytes: null,
		logFrames: null,
		checkpointedFrames: null,
		lastCompletedAtMs: snapshot?.health.lastCompletedAtMs ?? null,
		consecutiveBlocked: 0,
		warning: true
	});
	const recordCheckpointError = (error, observation = checkpointObservation()) => {
		const failed = {
			...observation,
			observedAtMs: Date.now(),
			state: "error",
			consecutiveBlocked: 0,
			warning: true,
			error: formatErrorMessage(error)
		};
		snapshot = {
			observedAtNs: process.hrtime.bigint(),
			lastCompletedAtNs: snapshot?.lastCompletedAtNs,
			health: options.databasePath ? observeSqliteWalCheckpointHealth(options.databasePath, failed) : failed
		};
		if (options.databasePath) notifyCheckpoint(options.databasePath, snapshot);
		options.onCheckpointError?.(error);
	};
	const recordCheckpoint = (mode, row, quiet) => {
		const observedAtNs = process.hrtime.bigint();
		const observation = checkpointObservation();
		let busy;
		let sizeError;
		try {
			const { busy: busyResult, logFrames, checkpointedFrames } = readCheckpointResult(row);
			busy = busyResult !== 0;
			observation.logFrames = logFrames;
			observation.checkpointedFrames = checkpointedFrames;
			observation.state = busy || checkpointedFrames < logFrames ? "blocked" : "complete";
			if (observation.state === "complete") observation.lastCompletedAtMs = observation.observedAtMs;
			else observation.consecutiveBlocked = (snapshot?.health.consecutiveBlocked ?? 0) + 1;
			if (options.databasePath) try {
				observation.databaseBytes = sqliteFileBytes(options.databasePath);
				observation.walBytes = sqliteFileBytes(`${options.databasePath}-wal`);
			} catch (error) {
				sizeError = error;
				observation.error = formatErrorMessage(error);
			}
			observation.warning = observation.state === "blocked" && (observation.consecutiveBlocked >= 2 || observation.walBytes !== null && observation.databaseBytes !== null && observation.walBytes > Math.max(2 * observation.databaseBytes, journalSizeLimitBytes));
			snapshot = {
				observedAtNs,
				lastCompletedAtNs: observation.state === "complete" ? observedAtNs : snapshot?.lastCompletedAtNs,
				health: options.databasePath ? observeSqliteWalCheckpointHealth(options.databasePath, observation) : observation
			};
			if (options.databasePath) notifyCheckpoint(options.databasePath, snapshot);
		} catch (error) {
			recordCheckpointError(error, observation);
			return false;
		}
		if (observation.error !== void 0) options.onCheckpointError?.(sizeError);
		if ((busy || observation.warning) && !quiet) {
			const label = options.databaseLabel ?? "sqlite database";
			options.onCheckpointError?.(/* @__PURE__ */ new Error(`${label} WAL checkpoint ${mode} ${busy ? "remained busy" : "blocked by a reader"}`));
		}
		return observation.state === "complete";
	};
	return {
		adopt(received) {
			if (snapshot && snapshot.observedAtNs >= received.observedAtNs && (snapshot.lastCompletedAtNs ?? 0n) >= (received.lastCompletedAtNs ?? 0n)) return;
			const completed = (snapshot?.lastCompletedAtNs ?? 0n) > (received.lastCompletedAtNs ?? 0n) ? snapshot : received;
			if (!snapshot || received.observedAtNs > snapshot.observedAtNs) snapshot = structuredClone(received);
			snapshot.lastCompletedAtNs = completed?.lastCompletedAtNs;
			snapshot.health.lastCompletedAtMs = completed?.health.lastCompletedAtMs ?? null;
			if (options.databasePath) {
				snapshot.health = observeSqliteWalCheckpointHealth(options.databasePath, snapshot.health);
				notifyCheckpoint(options.databasePath, snapshot);
			}
		},
		checkpoint(mode, checkpointOptions = {}) {
			try {
				return recordCheckpoint(mode, checkpoint(database, mode), checkpointOptions.quiet === true);
			} catch (error) {
				recordCheckpointError(error);
				return false;
			}
		},
		recordError: recordCheckpointError,
		inspectIdle() {
			const { busy, logFrames, checkpointedFrames } = readCheckpointResult(checkpoint(database, "PASSIVE"));
			return busy === 0 && logFrames >= 0 && checkpointedFrames >= 0 && checkpointedFrames <= logFrames;
		},
		get health() {
			return snapshot ? structuredClone(snapshot.health) : void 0;
		},
		get snapshot() {
			return snapshot ? structuredClone(snapshot) : void 0;
		}
	};
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/copy.js
function firstFailure(current, value) {
	return current ?? { value };
}
function closeDescriptor(fd, failure) {
	try {
		fs.closeSync(fd);
		return failure;
	} catch (error) {
		return firstFailure(failure, error);
	}
}
/** Inspect an existing real directory without creating probe files. */
function probeTreeClone(parentPath) {
	const native = getNativeBinding("probeTreeClone");
	if (!native) return void 0;
	const parent = openStagedDirectory(assertAbsolutePathInput(parentPath));
	let backend;
	let failure;
	try {
		backend = native.probeTreeClone(parent.fd) ?? void 0;
	} catch (error) {
		failure = firstFailure(failure, error);
	}
	failure = closeDescriptor(parent.fd, failure);
	if (failure) throw failure.value;
	return backend;
}
//#endregion
//#region packages/normalization-core/src/mountinfo-path.ts
const MOUNT_PATH_OCTAL_ESCAPE_RE = /\\([0-7]{3})/g;
/** Decodes an octal-escaped path field from a Linux procfs mount table. */
function decodeMountInfoPath(value) {
	return value.replace(MOUNT_PATH_OCTAL_ESCAPE_RE, (_match, octal) => String.fromCharCode(Number.parseInt(octal, 8)));
}
//#endregion
//#region src/infra/sqlite-wal-filesystem.ts
const ROLLBACK_FILESYSTEM_MAGIC = /* @__PURE__ */ new Set([
	26985,
	20859,
	4283649346,
	4266872130,
	16914839
]);
const LINUX_BTRFS_SUPER_MAGIC = 2435016766;
const PROC_MOUNTINFO_PATH = "/proc/self/mountinfo";
const MOUNT_COMMAND_TIMEOUT_MS = 1e3;
const NETWORK_FILESYSTEM_TYPES = /* @__PURE__ */ new Set([
	"cifs",
	"smbfs",
	"smb2",
	"smb3"
]);
const CROSS_VM_FILESYSTEM_TYPES = /* @__PURE__ */ new Set([
	"virtiofs",
	"fuse.virtiofs",
	"9p",
	"9p2000.l"
]);
const log$2 = createSubsystemLogger("infra/sqlite-wal");
let warnedNoCow = false;
function findExistingVolumePaths(targetPath) {
	let current = path.resolve(targetPath);
	while (true) {
		let stats;
		try {
			stats = fs.statSync(current);
		} catch {
			const parent = path.dirname(current);
			if (parent === current) return null;
			current = parent;
			continue;
		}
		const existingPath = fs.realpathSync(current);
		return {
			canonicalPath: stats.isDirectory() ? existingPath : path.dirname(existingPath),
			originalPath: stats.isDirectory() ? current : path.dirname(current)
		};
	}
}
function parseProcMountInfoEntries(contents) {
	const entries = [];
	for (const line of contents.split("\n")) {
		const separator = line.indexOf(" - ");
		if (separator === -1) continue;
		const fields = line.slice(0, separator).split(" ");
		const suffixFields = line.slice(separator + 3).split(" ");
		const mountPoint = fields[4];
		const fsType = suffixFields[0];
		if (mountPoint && fsType) entries.push({
			mountPoint: decodeMountInfoPath(mountPoint),
			fsType,
			...suffixFields[1] ? { source: decodeMountInfoPath(suffixFields[1]) } : {}
		});
	}
	return entries;
}
function parseMountCommandEntries(contents) {
	const entries = [];
	for (const line of contents.split("\n")) {
		const match = /^(.+) on (.+) type ([^,\s)]+) \(/.exec(line) ?? /^(.+) on (.+) \(([^,\s)]+)/.exec(line);
		if (match) {
			const [, source, mountPoint, fsType] = match;
			if (source && mountPoint && fsType) entries.push({
				source,
				mountPoint,
				fsType
			});
		}
	}
	return entries;
}
function readMountEntries() {
	try {
		return {
			ok: true,
			value: parseProcMountInfoEntries(fs.readFileSync(PROC_MOUNTINFO_PATH, "utf8"))
		};
	} catch {}
	try {
		return {
			ok: true,
			value: parseMountCommandEntries(String(process.getBuiltinModule("node:child_process").execFileSync("mount", [], {
				killSignal: "SIGKILL",
				timeout: MOUNT_COMMAND_TIMEOUT_MS
			})))
		};
	} catch (error) {
		return hasNodeErrorCode(error, "ETIMEDOUT") ? {
			ok: false,
			error: "timeout"
		} : {
			ok: true,
			value: []
		};
	}
}
function isPathWithinMount(targetPath, mountPoint) {
	const resolvedTarget = path.resolve(targetPath);
	const resolvedMountPoint = path.resolve(mountPoint);
	return resolvedTarget === resolvedMountPoint || resolvedMountPoint === path.parse(resolvedMountPoint).root || resolvedTarget.startsWith(`${resolvedMountPoint}${path.sep}`);
}
function isSshfsMountSource(source) {
	if (!source) return false;
	const normalized = source.toLowerCase();
	return normalized === "sshfs" || normalized.startsWith("sshfs#") || normalized.startsWith("sshfs@") || /^(?:[^/\s:]+@)?[^/\s:]+:.*/u.test(source);
}
function resolveMountTypeJournalPolicy(entry) {
	const normalized = entry.fsType.toLowerCase();
	if (normalized.startsWith("nfs") || NETWORK_FILESYSTEM_TYPES.has(normalized) || CROSS_VM_FILESYSTEM_TYPES.has(normalized) || normalized.startsWith("9p")) return "rollback";
	if (normalized === "fuse.sshfs") return "unsupported";
	if ((normalized === "macfuse" || normalized === "osxfuse") && isSshfsMountSource(entry.source)) return "unsupported";
	return "wal";
}
function findMountEntry(targetPath, mountEntries) {
	return mountEntries.filter((entry) => isPathWithinMount(targetPath, entry.mountPoint)).toSorted((a, b) => b.mountPoint.length - a.mountPoint.length)[0];
}
function resolveMountEntryJournalPolicy(targetPath, mountEntries) {
	const mountEntry = findMountEntry(targetPath, mountEntries);
	return mountEntry ? resolveMountTypeJournalPolicy(mountEntry) : "wal";
}
/** Classify the physical store location, including a not-yet-created database. */
function isSqlitePathOnBtrfs(targetPath) {
	if (process.platform !== "linux") return false;
	const checkedPaths = findExistingVolumePaths(targetPath);
	if (!checkedPaths) return false;
	try {
		return fs.statfsSync(checkedPaths.canonicalPath).type === LINUX_BTRFS_SUPER_MAGIC;
	} catch {
		const mounts = readMountEntries();
		return mounts.ok && findMountEntry(checkedPaths.canonicalPath, mounts.value)?.fsType.toLowerCase() === "btrfs";
	}
}
/** Doctor requires failure to abort publication; never apply attributes to data files. */
function setSqliteDirectoryNoCow(directory) {
	if (!fs.statSync(directory).isDirectory()) throw new Error(`SQLite NOCOW target is not a directory: ${directory}`);
	const result = process.getBuiltinModule("node:child_process").spawnSync("chattr", ["+C", directory], {
		encoding: "utf8",
		killSignal: "SIGKILL",
		timeout: MOUNT_COMMAND_TIMEOUT_MS,
		maxBuffer: 4096
	});
	if (result.error || result.status !== 0) throw result.error ?? /* @__PURE__ */ new Error(`chattr +C failed: ${result.stderr.trim() || result.signal || result.status}`);
}
/** Called after directory permissions are established, before SQLite creates any files. */
function prepareSqliteDatabaseDirectory(databasePath) {
	if (process.platform !== "linux" || fs.existsSync(databasePath)) return;
	try {
		if (isSqlitePathOnBtrfs(databasePath)) setSqliteDirectoryNoCow(path.dirname(databasePath));
	} catch (error) {
		if (!warnedNoCow) {
			warnedNoCow = true;
			log$2.warn("Could not enable SQLite directory NOCOW; continuing with filesystem defaults", {
				databasePath,
				error: error instanceof Error ? error.message : String(error)
			});
		}
	}
}
function combineMountEntryJournalPolicies(targetPaths) {
	const mountResult = readMountEntries();
	if (!mountResult.ok) {
		const [originalPath, canonicalPath] = targetPaths;
		if (process.platform === "darwin" && originalPath === canonicalPath) try {
			if (probeTreeClone(canonicalPath) === "apfs") return "wal";
		} catch {}
		return "rollback";
	}
	const policies = new Set(targetPaths.map((targetPath) => resolveMountEntryJournalPolicy(targetPath, mountResult.value)));
	if (policies.has("unsupported")) return "unsupported";
	return policies.has("rollback") ? "rollback" : "wal";
}
function isWindowsUncPath(targetPath) {
	return /^\\\\\?\\UNC\\[^\\]+\\[^\\]+/i.test(targetPath) || /^\\\\(?![?.]\\)[^\\]+\\[^\\]+/.test(targetPath);
}
function isWindowsDrivePath(targetPath) {
	return /^[A-Za-z]:[\\/]/.test(targetPath) || /^\\\\\?\\[A-Za-z]:[\\/]/i.test(targetPath);
}
function resolvePathJournalPolicy(targetPath) {
	if (process.platform === "win32") {
		const normalizedTargetPath = path.win32.normalize(targetPath);
		if (isWindowsUncPath(normalizedTargetPath)) return "rollback";
		if (isWindowsDrivePath(normalizedTargetPath)) try {
			return isWindowsUncPath(path.win32.normalize(fs.realpathSync.native(targetPath))) ? "rollback" : "wal";
		} catch {
			return "rollback";
		}
	}
	const checkedPaths = findExistingVolumePaths(targetPath);
	if (!checkedPaths) return "wal";
	const mountLookupPaths = [checkedPaths.originalPath, checkedPaths.canonicalPath];
	if (typeof fs.statfsSync !== "function") return combineMountEntryJournalPolicies(mountLookupPaths);
	try {
		if (ROLLBACK_FILESYSTEM_MAGIC.has(fs.statfsSync(checkedPaths.canonicalPath).type)) return "rollback";
	} catch {}
	return combineMountEntryJournalPolicies(mountLookupPaths);
}
//#endregion
//#region src/infra/sqlite-wal-reclamation.ts
const VACUUM_UNIT_TARGET_MS = 25;
const vacuumPageBudgets = /* @__PURE__ */ new WeakMap();
function createSqliteWalReclamationResult() {
	return {
		checkpointCompleted: false,
		freePagesBefore: null,
		remainingFreePages: null,
		checkpointCalls: 0,
		checkpointIncomplete: 0,
		checkpointMs: 0,
		checkpointMaxMs: 0,
		queryMs: 0,
		vacuumMs: 0,
		vacuumPasses: 0,
		vacuumPagesRequested: 0
	};
}
/** Physical page accounting for both reclamation and its read-only eligibility probe. */
function readSqliteFreePageCount(database, diagnostics) {
	const startedAt = diagnostics ? performance$1.now() : 0;
	try {
		return Number(database.prepare("PRAGMA freelist_count").get()?.freelist_count ?? 0);
	} finally {
		if (diagnostics) diagnostics.queryMs += performance$1.now() - startedAt;
	}
}
/** One online unit never waits for readers or adds vacuum frames behind a blocked checkpoint. */
function reclaimSqliteWalFreePages(database, runCheckpoint, options) {
	const result = createSqliteWalReclamationResult();
	const checkpoint = () => {
		options.beforeMutation?.();
		const startedAt = performance$1.now();
		try {
			const mode = options.checkpointMode ?? "TRUNCATE";
			let completed = runCheckpoint(mode);
			result.checkpointCalls++;
			if (!completed && mode === "TRUNCATE") {
				options.beforeMutation?.();
				completed = runCheckpoint("PASSIVE");
				result.checkpointCalls++;
			}
			result.checkpointCompleted = completed;
			result.checkpointIncomplete += Number(!completed);
			return completed;
		} finally {
			const elapsed = performance$1.now() - startedAt;
			result.checkpointMs += elapsed;
			result.checkpointMaxMs = Math.max(result.checkpointMaxMs, elapsed);
		}
	};
	if (options.maxPages === 0 && options.checkpointMode === "PASSIVE") {
		checkpoint();
		return result;
	}
	return runWithSqliteBusyTimeout(database, 0, () => {
		if (!checkpoint() || options.maxPages === 0) return result;
		const before = readSqliteFreePageCount(database, result);
		result.freePagesBefore = before;
		result.remainingFreePages = before;
		if (!Number.isSafeInteger(before) || before <= 0) return result;
		const pages = Math.min(vacuumPageBudgets.get(database) ?? 8, before, options.maxPages ?? 512);
		if (!Number.isSafeInteger(pages) || pages <= 0) throw new Error("SQLite page reclamation requires a positive integer page limit");
		const startedAt = performance$1.now();
		let entered = false;
		let completed = false;
		try {
			runSqliteImmediateTransactionSync(database, () => {
				entered = true;
				options.beforeMutation?.();
				result.vacuumPasses++;
				result.vacuumPagesRequested += pages;
				database.exec(`PRAGMA incremental_vacuum(${pages});`);
				options.onCommit?.();
			}, {
				busyTimeoutMs: 0,
				operationLabel: "incremental-vacuum"
			});
			completed = true;
		} catch (error) {
			if (entered || !isSqliteLockError(error)) throw error;
			return result;
		} finally {
			const elapsedMs = performance$1.now() - startedAt;
			result.vacuumMs += elapsedMs;
			if (completed) vacuumPageBudgets.set(database, Math.max(1, Math.min(512, pages * 2, Math.floor(pages * VACUUM_UNIT_TARGET_MS / Math.max(elapsedMs, .001)))));
		}
		options.afterCommit?.();
		if (checkpoint()) result.remainingFreePages = readSqliteFreePageCount(database, result);
		return result;
	});
}
//#endregion
//#region src/infra/sqlite-wal-split-brain.ts
const PROC_SELF_FD_PATH = "/proc/self/fd";
const SQLITE_WAL_SPLIT_BRAIN_FATAL_MESSAGE = "SQLite WAL sidecar identity mismatch; terminating without SQLite cleanup";
function readUnlessMissing(read, allowClosedDescriptor = false) {
	try {
		return read();
	} catch (error) {
		if (allowClosedDescriptor && hasNodeErrorCode(error, "EBADF") || hasNodeErrorCode(error, "ENOENT")) return;
		throw error;
	}
}
function isSqliteWalSidecarSplitBrain(descriptor, target) {
	return descriptor.nlink === 0n || !target || descriptor.dev !== target.dev || descriptor.ino !== target.ino;
}
function detectSqliteWalSplitBrain(databasePath) {
	const descriptors = readUnlessMissing(() => fs.readdirSync(PROC_SELF_FD_PATH));
	const sidecarPaths = [`${databasePath}-wal`, `${databasePath}-shm`];
	for (const descriptorName of descriptors ?? []) {
		const descriptorPath = path.join(PROC_SELF_FD_PATH, descriptorName);
		const linkedPath = readUnlessMissing(() => fs.readlinkSync(descriptorPath));
		if (linkedPath === void 0) continue;
		const sidecarPath = sidecarPaths.find((candidate) => linkedPath === candidate || linkedPath === `${candidate} (deleted)`);
		if (!sidecarPath) continue;
		const descriptor = readUnlessMissing(() => fs.fstatSync(Number(descriptorName), { bigint: true }), true);
		if (descriptor === void 0 || readUnlessMissing(() => fs.readlinkSync(descriptorPath)) !== linkedPath) continue;
		const target = readUnlessMissing(() => fs.statSync(sidecarPath, { bigint: true }));
		if (!isSqliteWalSidecarSplitBrain(descriptor, target)) continue;
		return {
			event: "sqlite_wal_sidecar_identity_mismatch",
			databasePath,
			descriptorDevice: descriptor.dev.toString(),
			descriptorInode: descriptor.ino.toString(),
			sidecarPath,
			...target ? {
				targetDevice: target.dev.toString(),
				targetInode: target.ino.toString()
			} : {}
		};
	}
}
function terminateForSqliteWalSplitBrain(splitBrain, databaseLabel) {
	try {
		fs.writeSync(2, `${JSON.stringify({
			level: "fatal",
			subsystem: "infra/sqlite-wal",
			message: SQLITE_WAL_SPLIT_BRAIN_FATAL_MESSAGE,
			...splitBrain,
			databaseLabel,
			pid: process.pid
		})}\n`);
	} catch {}
	try {
		process.kill(process.pid, "SIGKILL");
	} finally {
		process.abort();
	}
}
//#endregion
//#region src/infra/sqlite-wal.ts
const DEFAULT_SQLITE_WAL_AUTOCHECKPOINT_PAGES = 16384;
const DEFAULT_SQLITE_WAL_CHECKPOINT_TICK_MS = 1e4;
const DEFAULT_SQLITE_WAL_CHECKPOINT_INTERVAL_MS = 18e5;
const DEFAULT_SQLITE_WAL_JOURNAL_SIZE_LIMIT_BYTES = 67108864;
const JOURNAL_MODE_RETRY_INTERVAL_MS = 10;
const JOURNAL_MODE_RETRY_SLEEP = new Int32Array(new SharedArrayBuffer(4));
const log$1 = createSubsystemLogger("infra/sqlite-wal");
const maintenanceScheduler = new GatewayScheduler();
let nextMaintenanceId = 0;
const completedCheckpointKey = {
	name: "sqlite-wal-completed-write-revision",
	read: (value) => value instanceof SharedArrayBuffer && value.byteLength === Int32Array.BYTES_PER_ELEMENT ? value : void 0
};
function sharedCompletedCheckpoint(db, writeRevision) {
	let shared = getSqliteDatabaseAdmission(db, completedCheckpointKey);
	if (!shared) {
		shared = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
		Atomics.store(new Int32Array(shared), 0, writeRevision - 1 | 0);
		publishSqliteDatabaseAdmission(db, completedCheckpointKey, shared);
		shared = getSqliteDatabaseAdmission(db, completedCheckpointKey);
	}
	return shared ? new Int32Array(shared) : void 0;
}
function enableIncrementalAutoVacuumForFreshDatabase(db) {
	if (db.prepare("PRAGMA page_count").get()?.page_count === 0) db.exec("PRAGMA auto_vacuum = INCREMENTAL;");
}
/**
* Configure lock retry before inspecting or mutating a fresh database header.
* Concurrent first opens can otherwise fail before schema transactions begin.
*/
function configureSqlitePreSchemaPragmas(db, options = {}) {
	if (options.busyTimeoutMs !== void 0) setSqliteBusyTimeout(db, options.busyTimeoutMs);
	enableIncrementalAutoVacuumForFreshDatabase(db);
}
function readJournalModeResult(row) {
	if (!row || typeof row !== "object") return null;
	const record = row;
	const value = record.journal_mode ?? Object.values(record)[0];
	return typeof value === "string" ? value.toLowerCase() : null;
}
function hasInMemoryMainDatabase(db) {
	return db.prepare("PRAGMA database_list;").all().find((row) => row.name === "main")?.file === "";
}
function requireRollbackJournalMode(db, options) {
	const journalMode = readJournalModeResult(db.prepare("PRAGMA journal_mode = DELETE;").get());
	if (journalMode !== "delete") {
		const label = options.databaseLabel ?? "sqlite database";
		const location = options.databasePath ? ` at ${options.databasePath}` : "";
		throw new Error(`${label}${location} is on a network-backed volume but SQLite kept journal_mode=${journalMode ?? "unknown"}; refusing to continue with WAL on network storage.`);
	}
}
function enableWalJournalMode(db, retryTimeoutMs, options) {
	const deadline = performance$1.now() + retryTimeoutMs;
	let restoreBusyTimeout = false;
	try {
		while (true) try {
			const journalMode = readJournalModeResult(db.prepare("PRAGMA journal_mode = WAL;").get());
			if (journalMode === "wal") return true;
			if (journalMode === "memory" && hasInMemoryMainDatabase(db)) return false;
			const label = options.databaseLabel ?? "sqlite database";
			const location = options.databasePath ? ` at ${options.databasePath}` : "";
			throw new Error(`${label}${location} could not enable WAL; SQLite kept journal_mode=${journalMode ?? "unknown"}.`);
		} catch (error) {
			const remainingMs = Math.max(0, deadline - performance$1.now());
			if (!isSqliteLockError(error) || remainingMs <= 0) throw error;
			if (!restoreBusyTimeout) {
				setSqliteBusyTimeout(db, 0);
				restoreBusyTimeout = true;
			}
			Atomics.wait(JOURNAL_MODE_RETRY_SLEEP, 0, 0, Math.min(JOURNAL_MODE_RETRY_INTERVAL_MS, remainingMs));
		}
	} finally {
		if (restoreBusyTimeout) setSqliteBusyTimeout(db, retryTimeoutMs);
	}
}
function enableMacosCheckpointFullfsync(db) {
	if (process.platform !== "darwin") return;
	try {
		db.exec("PRAGMA checkpoint_fullfsync = 1;");
	} catch {}
}
function refuseUnsupportedFilesystem(options) {
	const label = options.databaseLabel ?? "sqlite database";
	const location = options.databasePath ? ` at ${options.databasePath}` : "";
	throw new Error(`${label}${location} is on SSHFS, which cannot safely coordinate SQLite writes across mounts; refusing to open the database.`);
}
/** Configure safe journaling pragmas and return a handle for checkpoint/close maintenance. */
function configureSqliteWalMaintenance(db, options = {}) {
	const busyTimeoutMs = options.busyTimeoutMs ?? 0;
	if (options.busyTimeoutMs !== void 0) setSqliteBusyTimeout(db, options.busyTimeoutMs);
	const autoCheckpointPages = normalizeSqliteNonNegativeInteger(options.autoCheckpointPages ?? DEFAULT_SQLITE_WAL_AUTOCHECKPOINT_PAGES, "autoCheckpointPages");
	const checkpointIntervalMs = normalizeSqliteNonNegativeInteger(options.checkpointIntervalMs ?? DEFAULT_SQLITE_WAL_CHECKPOINT_INTERVAL_MS, "checkpointIntervalMs");
	const timerIntervalMs = Math.min(checkpointIntervalMs, MAX_TIMER_TIMEOUT_MS);
	const checkpointTickMs = checkpointIntervalMs > DEFAULT_SQLITE_WAL_CHECKPOINT_TICK_MS ? DEFAULT_SQLITE_WAL_CHECKPOINT_TICK_MS : 0;
	const checkpointMode = options.checkpointMode ?? "TRUNCATE";
	const periodicCheckpointMode = options.checkpointMode ?? "PASSIVE";
	const journalPolicy = options.databasePath ? resolvePathJournalPolicy(options.databasePath) : "wal";
	if (journalPolicy === "unsupported") refuseUnsupportedFilesystem(options);
	if (journalPolicy === "rollback") requireRollbackJournalMode(db, options);
	if (journalPolicy === "rollback" || !enableWalJournalMode(db, busyTimeoutMs, options)) return {
		checkpoint: () => true,
		reclaimFreePages: (reclaimOptions = {}) => reclaimSqliteWalFreePages(db, () => true, reclaimOptions),
		stop: async () => {},
		close: () => true
	};
	enableMacosCheckpointFullfsync(db);
	db.exec(`PRAGMA wal_autocheckpoint = ${isSqliteWalWorkerMaintained(db) ? 0 : autoCheckpointPages};`);
	db.exec(`PRAGMA journal_size_limit = ${DEFAULT_SQLITE_WAL_JOURNAL_SIZE_LIMIT_BYTES};`);
	const tripwireDatabasePath = process.platform === "linux" && options.databasePath && fs.existsSync(options.databasePath) ? fs.realpathSync.native(options.databasePath) : void 0;
	let invalidated = false;
	let splitBrainDetectionEnabled = Boolean(tripwireDatabasePath);
	const checkpointOwner = createSqliteWalCheckpoint(db, options, DEFAULT_SQLITE_WAL_JOURNAL_SIZE_LIMIT_BYTES);
	const runCheckpoint = checkpointOwner.checkpoint;
	const runMaintenance = (operation) => {
		if (invalidated) return false;
		try {
			return options.runMaintenance ? options.runMaintenance(operation) : operation();
		} catch (error) {
			checkpointOwner.recordError(error);
			return false;
		}
	};
	const checkpoint = () => runMaintenance(() => runCheckpoint(checkpointMode));
	const reclaimFreePages = (reclaimOptions = {}) => {
		let result;
		let failure;
		runMaintenance(() => {
			try {
				result = reclaimSqliteWalFreePages(db, runCheckpoint, reclaimOptions);
				return result.checkpointCompleted;
			} catch (error) {
				failure = { error };
				throw error;
			}
		});
		if (failure) throw failure.error;
		if (!result) throw new Error("SQLite page reclamation owner is unavailable");
		return {
			...result,
			checkpoint: checkpointOwner.snapshot
		};
	};
	const scope = maintenanceScheduler.scope();
	const maintenanceId = `sqlite-wal:${++nextMaintenanceId}`;
	let nextPageBudget = 0;
	let completedTickRevision;
	const maintainPeriodic = (request, admit, maintain) => {
		if (invalidated) return { reclaimedPages: 0 };
		if (request.checkpoint) checkpointOwner.adopt(request.checkpoint);
		let reclaimedPages = 0;
		const quiet = request.maxPages === 0;
		const checkpointOnly = quiet && request.checkpointMode === "PASSIVE";
		const writeRevision = checkpointOnly ? readSqliteDatabaseWriteRevision(db) : void 0;
		const sharedCompletion = writeRevision === void 0 ? void 0 : sharedCompletedCheckpoint(db, writeRevision);
		const completedBySibling = sharedCompletion !== void 0 && Atomics.load(sharedCompletion, 0) === writeRevision;
		if (writeRevision !== void 0 && (completedBySibling || writeRevision === completedTickRevision && checkpointOwner.health?.state === "complete")) return {
			reclaimedPages: 0,
			checkpoint: checkpointOwner.health?.state === "complete" ? checkpointOwner.snapshot : void 0
		};
		const runTickCheckpoint = (mode) => checkpointOwner.checkpoint(mode, { quiet });
		completedTickRevision = runMaintenance(() => {
			let checkpointed;
			if (checkpointOnly) {
				admit?.("transaction");
				checkpointed = runTickCheckpoint("PASSIVE");
			} else {
				const reclaimed = reclaimSqliteWalFreePages(db, runTickCheckpoint, {
					checkpointMode: request.checkpointMode,
					maxPages: request.maxPages,
					beforeMutation: () => admit?.("transaction"),
					onCommit: () => admit?.("commit")
				});
				checkpointed = reclaimed.checkpointCompleted;
				if (checkpointed && reclaimed.freePagesBefore !== null && reclaimed.remainingFreePages !== null) reclaimedPages = Math.min(reclaimed.vacuumPagesRequested, reclaimed.freePagesBefore - reclaimed.remainingFreePages);
			}
			if (checkpointed && request.checkpointMode === "PASSIVE" && (checkpointOwner.health?.walBytes ?? 0) > DEFAULT_SQLITE_WAL_JOURNAL_SIZE_LIMIT_BYTES) {
				admit?.("transaction");
				runWithSqliteBusyTimeout(db, 0, () => runTickCheckpoint("TRUNCATE"));
			}
			if (checkpointed && request.maxPages > 0 && !request.continuation) try {
				maintain?.();
			} catch (error) {
				if (!isSqliteLockError(error)) throw error;
			}
			return checkpointed;
		}) && checkpointOwner.health?.state === "complete" ? writeRevision : void 0;
		if (sharedCompletion && completedTickRevision !== void 0) Atomics.store(sharedCompletion, 0, completedTickRevision);
		return {
			reclaimedPages,
			checkpoint: checkpointOwner.snapshot
		};
	};
	let stopCheckpointTick;
	const maintain = createSqliteWalMaintenanceScheduler(db, maintainPeriodic, (maxPages) => timerIntervalMs > 0 && !scope.signal.aborted && !invalidated && !options.isScheduledMaintenanceSuspended?.() ? {
		maxPages,
		checkpointMode: periodicCheckpointMode,
		checkpoint: checkpointOwner.snapshot
	} : void 0, checkpointOwner.adopt, (error) => checkpointOwner.recordError(error), () => {
		const budget = nextPageBudget;
		nextPageBudget = 0;
		return budget;
	}, () => stopCheckpointTick?.());
	const schedule = (phase, intervalMs, run) => runInDetachedAsyncContext(() => scope.schedule({
		id: `${maintenanceId}:${phase}`,
		delayMs: intervalMs,
		everyMs: intervalMs,
		run
	}));
	if (timerIntervalMs > 0) schedule("periodic", timerIntervalMs, () => {
		if (tripwireDatabasePath && splitBrainDetectionEnabled) {
			let splitBrain;
			try {
				splitBrain = detectSqliteWalSplitBrain(tripwireDatabasePath);
			} catch (error) {
				splitBrainDetectionEnabled = false;
				log$1.warn("SQLite WAL split-brain detection disabled", {
					databaseLabel: options.databaseLabel,
					databasePath: tripwireDatabasePath,
					error: error instanceof Error ? error.message : String(error)
				});
			}
			if (splitBrain) {
				invalidated = true;
				scope.beginClose();
				terminateForSqliteWalSplitBrain(splitBrain, options.databaseLabel);
			}
		}
		nextPageBudget = 512;
		return maintain();
	});
	if (checkpointTickMs > 0 && !isSqliteWalWorkerMaintained(db)) {
		let stopped = false;
		let tick;
		const cancelTick = () => {
			tick?.cancel();
			tick = void 0;
		};
		const armTick = () => {
			if (!stopped && !tick && !scope.signal.aborted && !invalidated) tick = runInDetachedAsyncContext(() => scope.schedule({
				id: `${maintenanceId}:tick`,
				delayMs: checkpointTickMs,
				run: runTick
			}));
		};
		const runTick = async () => {
			tick = void 0;
			await maintain();
			if (stopped) return;
			const revision = readSqliteDatabaseWriteRevision(db);
			const completed = revision === void 0 ? void 0 : sharedCompletedCheckpoint(db, revision);
			if (completed && Atomics.load(completed, 0) === revision) cancelTick();
			else armTick();
		};
		const unregisterWrites = periodicCheckpointMode === "PASSIVE" ? onSqliteDatabaseWriteSettled(db, armTick) : void 0;
		if (unregisterWrites) {
			stopCheckpointTick = () => {
				stopped = true;
				unregisterWrites();
				cancelTick();
			};
			armTick();
		} else stopCheckpointTick = schedule("tick", checkpointTickMs, maintain).cancel;
	}
	const beginClose = () => {
		stopCheckpointTick?.();
		runInDetachedAsyncContext(() => scope.beginClose());
		return cancelSqliteWalWriteAdmission(db);
	};
	return {
		get health() {
			return checkpointOwner.health;
		},
		checkpoint,
		maintainPeriodic,
		reclaimFreePages,
		inspectIdle: () => runMaintenance(checkpointOwner.inspectIdle) ? "healthy" : "retire",
		stop: async () => {
			try {
				await beginClose();
			} finally {
				await runInDetachedAsyncContext(() => scope.stop());
			}
		},
		close: (closeOptions) => {
			beginClose();
			if (invalidated || isSqliteWalWorkerMaintained(db)) return false;
			return runMaintenance(() => runCheckpoint(closeOptions?.checkpointMode ?? checkpointMode));
		}
	};
}
let lastSqliteExitGroup;
function detachEmptySqliteExitGroup(group) {
	if (group.pending.size > 0) return;
	if (lastSqliteExitGroup === group) lastSqliteExitGroup = void 0;
	process.removeListener("exit", group.dispatch);
}
/**
* Register a best-effort exit-time close for a SQLite handle cache. Returns an
* unregister callback the cache's orderly close path must invoke, so tests and
* runtime shutdowns do not accumulate listeners on shared worker processes.
*/
function registerSqliteCacheExitClose(closeAll) {
	const registration = {
		close: closeAll,
		fired: false
	};
	let group = lastSqliteExitGroup;
	if (!group || process.listeners("exit").at(-1) !== group.dispatch) {
		const pending = /* @__PURE__ */ new Set([registration]);
		const created = {
			pending,
			dispatch: () => {
				const snapshot = [...pending];
				for (const entry of snapshot) {
					if (entry.fired) continue;
					entry.fired = true;
					pending.delete(entry);
					detachEmptySqliteExitGroup(created);
					try {
						entry.close();
					} catch {}
				}
			}
		};
		process.on("exit", created.dispatch);
		lastSqliteExitGroup = group = created;
	} else group.pending.add(registration);
	const owner = group;
	return () => {
		owner.pending.delete(registration);
		detachEmptySqliteExitGroup(owner);
	};
}
/** Configure per-connection SQLite pragmas in the safe lock-retry/WAL order. */
function configureSqliteConnectionPragmas(db, options = {}) {
	const { foreignKeys, synchronous, ...walOptions } = options;
	const maintenance = configureSqliteWalMaintenance(db, walOptions);
	try {
		if (synchronous) db.exec(`PRAGMA synchronous = ${synchronous};`);
		if (foreignKeys) db.exec("PRAGMA foreign_keys = ON;");
		return maintenance;
	} catch (error) {
		try {
			maintenance.close();
		} catch (closeError) {
			throw createSqliteLifecycleAggregateError([error, closeError], "SQLite connection pragma configuration and WAL maintenance cleanup both failed.", error);
		}
		throw error;
	}
}
//#endregion
//#region src/infra/sqlite-backup.ts
async function backupNodeSqliteDatabase(source, targetPath, onProgress) {
	const checkpoint = setInterval(() => {}, 100);
	try {
		const totalPages = await requireNodeSqlite().backup(source, resolveSqliteFilesystemPath(targetPath), { progress: onProgress });
		onProgress?.({
			totalPages,
			remainingPages: 0
		});
		return totalPages;
	} finally {
		clearInterval(checkpoint);
	}
}
//#endregion
//#region src/infra/windows-private-directory.ts
function createPrivateWindowsDirectory(directoryPath) {
	let attempted = false;
	try {
		createDirectorySync(path.resolve(directoryPath), {
			private: true,
			assertBeforeMutation() {
				attempted = true;
			}
		});
	} catch (error) {
		if (!attempted || error instanceof FsSafeError && error.code === "already-exists") throw markPrivateDirectoryCreationRefused(error);
		throw error;
	}
}
//#endregion
//#region src/infra/sqlite-private-directory.ts
function resolvePrivateSqliteSnapshotStagingRoot(env = process.env) {
	const updateTmp = env.OPENCLAW_UPDATE_IN_PROGRESS === "1" ? env.TMPDIR?.trim() : void 0;
	if (updateTmp && path.isAbsolute(updateTmp)) return resolvePreferredOpenClawTmpDir({
		preferredDir: path.join(updateTmp, "openclaw"),
		tmpdir: () => updateTmp
	});
	const appData = process.platform === "win32" ? env.LOCALAPPDATA?.trim() : void 0;
	const defaultRoot = process.platform === "win32" ? "AppData/Local" : ".cache";
	const platformRoot = process.platform === "darwin" ? "Library/Caches" : defaultRoot;
	const cacheRoot = [env.XDG_CACHE_HOME?.trim(), appData].find((root) => root && path.isAbsolute(root)) ?? path.join(resolveRequiredOsHomeDir(env), platformRoot);
	return resolvePreferredOpenClawTmpDir({
		preferredDir: path.join(cacheRoot, "openclaw"),
		tmpdir: () => cacheRoot
	});
}
function createPrivateSqliteTempDirectorySync(rootPath, prefix) {
	if (process.platform !== "win32") try {
		return fs.mkdtempSync(path.join(rootPath, prefix));
	} catch (error) {
		throw markPrivateDirectoryCreationRefused(error);
	}
	const directoryPath = path.join(rootPath, `${prefix}${randomUUID()}`);
	createPrivateWindowsDirectory(directoryPath);
	return directoryPath;
}
//#endregion
//#region src/state/openclaw-agent-db-metadata.ts
const agentSchemaMetadataKey = {
	name: "agent.schema-metadata",
	schemaDependent: true,
	read(value) {
		if (typeof value !== "object" || value === null || !("agentId" in value) || value.agentId !== null && typeof value.agentId !== "string" || !("role" in value) || value.role !== null && typeof value.role !== "string" || !("schemaVersion" in value) || value.schemaVersion !== null && typeof value.schemaVersion !== "number") return;
		return {
			agentId: value.agentId,
			role: value.role,
			schemaVersion: value.schemaVersion
		};
	}
};
function schemaMetadataKey(admissionId) {
	return {
		name: `agent.schema-metadata:${admissionId}`,
		read: agentSchemaMetadataKey.read
	};
}
/** The metadata writer publishes its committed format facts without a readback. */
function publishAgentSchemaMetadata(db, metadata) {
	publishSqliteDatabaseAdmission(db, agentSchemaMetadataKey, metadata);
	const schema = getAdmittedSqliteSchemaFacts(db);
	if (schema) publishSqliteDatabaseAdmission(db, schemaMetadataKey(schema.admissionId), metadata);
}
function readExistingAgentSchemaMeta(db, options) {
	const schema = getAdmittedSqliteSchemaFacts(db);
	const historical = !options?.includeAppVersion && schema && getSqliteDatabaseAdmission(db, schemaMetadataKey(schema.admissionId));
	if (historical) return historical;
	const admitted = !options?.includeAppVersion && (!schema || getSqliteDatabaseAdmission(db, schemaAdmission)?.admissionId === schema.admissionId) ? getSqliteDatabaseAdmission(db, agentSchemaMetadataKey) : void 0;
	if (admitted) {
		if (schema) publishSqliteDatabaseAdmission(db, schemaMetadataKey(schema.admissionId), admitted);
		return admitted;
	}
	if (!tableExists(db, "schema_meta")) return null;
	let row;
	try {
		row = db.prepare(options?.includeAppVersion ? "SELECT role, schema_version, agent_id, app_version FROM schema_meta WHERE meta_key = 'primary'" : "SELECT role, schema_version, agent_id FROM schema_meta WHERE meta_key = 'primary'").get();
	} catch (error) {
		throw classifySqliteTableReadError(db, "schema_meta", [
			"meta_key",
			"role",
			"schema_version",
			"agent_id"
		], error);
	}
	if (!row) return null;
	const metadata = {
		agentId: normalizeNullableString(row.agent_id),
		role: typeof row.role === "string" ? row.role : null,
		schemaVersion: typeof row.schema_version === "number" ? row.schema_version : null
	};
	if (schema && getAdmittedSqliteSchemaFacts(db) === schema && getSqliteDatabaseAdmission(db, schemaAdmission)?.admissionId === schema.admissionId) publishAgentSchemaMetadata(db, metadata);
	return options?.includeAppVersion ? {
		...metadata,
		appVersion: typeof row.app_version === "string" ? row.app_version : null
	} : metadata;
}
//#endregion
//#region src/infra/sqlite-schema-header.ts
function readSqliteWriterAppVersion(database) {
	try {
		const row = executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).selectFrom("schema_meta").select("app_version").where("meta_key", "=", "primary").limit(1));
		return typeof row?.app_version === "string" && row.app_version.length > 0 ? row.app_version : void 0;
	} catch {
		return;
	}
}
//#endregion
//#region src/infra/sqlite-snapshot-policy.ts
function sqliteSnapshotSourceFileSize(pathname) {
	try {
		const stat = fs.statSync(pathname);
		return stat.isFile() ? stat.size : 0;
	} catch (error) {
		if (hasNodeErrorCode(error, "ENOENT")) return 0;
		throw error;
	}
}
function emitSqliteSnapshotTelemetry(fields, error) {
	try {
		getChildLogger({ subsystem: "infra/sqlite-snapshot" }).debug({
			...fields,
			errorCode: error && typeof error === "object" && "code" in error ? String(error.code) : void 0
		}, "SQLite snapshot operation completed.");
	} catch {}
}
//#endregion
//#region src/infra/disk-space.ts
function finiteNonNegativeNumber(value) {
	const numberValue = Number(value);
	return Number.isFinite(numberValue) && numberValue >= 0 ? numberValue : null;
}
function findExistingDiskSpacePath(targetPath) {
	let current = path.resolve(targetPath);
	while (true) try {
		return fs.statSync(current).isDirectory() ? current : path.dirname(current);
	} catch {
		const parent = path.dirname(current);
		if (parent === current) return null;
		current = parent;
	}
}
/** Reads available bytes for the volume containing a target path when statfs is available. */
function tryReadDiskSpace(targetPath) {
	if (typeof fs.statfsSync !== "function") return null;
	const checkedPath = findExistingDiskSpacePath(targetPath);
	if (!checkedPath) return null;
	try {
		const stats = fs.statfsSync(checkedPath);
		const blockSize = finiteNonNegativeNumber(stats.bsize);
		const availableBlocks = finiteNonNegativeNumber(stats.bavail);
		if (blockSize === null || availableBlocks === null) return null;
		const totalBlocks = finiteNonNegativeNumber(stats.blocks);
		return {
			targetPath,
			checkedPath,
			availableBytes: blockSize * availableBlocks,
			totalBytes: totalBlocks === null ? null : blockSize * totalBlocks
		};
	} catch {
		return null;
	}
}
//#endregion
//#region src/infra/sqlite-snapshot-staging.ts
/** A private reader protects its bytes independently of the staging child. */
function acquireSqliteSnapshotReadToken(directory) {
	return acquireSqliteSnapshotToken(directory, "read");
}
function sqliteSnapshotStagingError(tempDir, cause, allocation = false, sourcePath) {
	markSqliteInspectionOperation(cause, "snapshot");
	let destination = allocation;
	let capacity = false;
	let sqliteErrcode;
	for (let depth = 0, error = cause; depth < 8 && error instanceof Error; depth += 1) {
		const { code, errcode, path: errorPath } = error;
		capacity ||= ["ENOSPC", "EDQUOT"].includes(code ?? "") || errcode === 13;
		if (capacity || typeof errcode === "number" && [
			13,
			778,
			1034,
			1290
		].includes(errcode) || `${errorPath ?? ""}${path.sep}`.startsWith(`${tempDir}${path.sep}`)) {
			destination = true;
			if (typeof errcode === "number") sqliteErrcode = errcode;
		}
		error = error.cause;
	}
	if (!destination) return cause;
	const guidance = capacity ? "free disk space/quota" : "check filesystem health and write permissions";
	let capacityDetail = "";
	if (capacity && sourcePath) try {
		const estimatedBytes = sqliteSnapshotSourceFileSize(sourcePath) + sqliteSnapshotSourceFileSize(`${sourcePath}-wal`) + sqliteSnapshotSourceFileSize(`${sourcePath}-journal`);
		const availableBytes = tryReadDiskSpace(tempDir)?.availableBytes;
		const liveWal = fs.existsSync(`${sourcePath}-wal`) && fs.existsSync(`${sourcePath}-shm`);
		capacityDetail = `; estimated ${estimatedBytes} bytes needed; ${availableBytes === void 0 ? "available bytes unknown" : `${availableBytes} bytes available`}; source ${liveWal ? "has live WAL sidecars" : "has no live WAL sidecars"}`;
	} catch {}
	const selector = process.env.OPENCLAW_UPDATE_IN_PROGRESS === "1" ? "TMPDIR" : "XDG_CACHE_HOME";
	const message = `${cause instanceof Error ? cause.message : String(cause)}${sqliteErrcode !== void 0 ? ` (SQLite errcode=${sqliteErrcode})` : ""}; snapshot staging root ${allocation ? tempDir : path.dirname(tempDir)}${capacityDetail}: ${guidance} or set ${selector} to a writable filesystem`;
	const error = new Error(message, { cause });
	return isPrivateDirectoryCreationRefused(cause) ? markPrivateDirectoryCreationRefused(error) : error;
}
async function createSqliteSnapshotStagingDirectory(stagingRoot = resolvePrivateSqliteSnapshotStagingRoot(), allowLegacyWorker = false, signal, asynchronousCleanup = false) {
	signal?.throwIfAborted();
	try {
		return await allocateSqliteSnapshotStagingDirectory(stagingRoot, allowLegacyWorker, signal, asynchronousCleanup);
	} catch (error) {
		if (error instanceof SqliteSnapshotCleanupError || asynchronousCleanup && error instanceof AggregateError) throw error;
		signal?.throwIfAborted();
		markSqliteInspectionOperation(error, "snapshot");
		throw error;
	}
}
async function allocateSqliteSnapshotStagingDirectory(root = resolvePrivateSqliteSnapshotStagingRoot(), allowLegacyWorker = false, signal, asynchronousCleanup = false) {
	signal?.throwIfAborted();
	if (asynchronousCleanup) {
		const controller = new AbortController();
		return retainSnapshotWork((async () => {
			const { allocateWorkerOwnedSqliteSnapshotDirectory } = await import("./openclaw-state-read-sqlite-snapshot-staging-allocation-DEcz-8mU.mjs");
			signal?.throwIfAborted();
			controller.signal.throwIfAborted();
			const owned = await allocateWorkerOwnedSqliteSnapshotDirectory(root, allowLegacyWorker, signal ? AbortSignal.any([signal, controller.signal]) : controller.signal);
			registerSnapshotTempDirectory(owned.directory);
			if (signal?.aborted || controller.signal.aborted) {
				if (!await removeTempDirectoryAsync(owned.directory)) throw new SqliteSnapshotCleanupError(`SQLite snapshot cleanup failed: ${owned.directory}`);
				signal?.throwIfAborted();
				controller.signal.throwIfAborted();
			}
			return owned.directory;
		})(), () => controller.abort(/* @__PURE__ */ new Error("SQLite snapshot allocation stopped")));
	}
	return createSqliteSnapshotStagingDirectorySync(root, allowLegacyWorker);
}
function createSqliteSnapshotStagingDirectorySync(root = resolvePrivateSqliteSnapshotStagingRoot(), allowLegacyWorker = false) {
	const owned = createSqliteSnapshotStagingTokenSync(root, allowLegacyWorker);
	registerSnapshotTempDirectory(owned.directory, owned.release);
	return owned.directory;
}
/** Token workers remove disposable payload under their own native retirement fences. */
function createSqliteSnapshotStagingTokenSync(root = resolvePrivateSqliteSnapshotStagingRoot(), allowLegacyWorker = false) {
	let directory;
	try {
		try {
			directory = createPrivateSqliteTempDirectorySync(root, allowLegacyWorker ? `openclaw-sqlite-readonly-${process.pid}-` : SQLITE_SNAPSHOT_PREFIX);
		} catch (error) {
			throw sqliteSnapshotStagingError(root, error, true);
		}
		return {
			directory,
			release: acquireSqliteSnapshotToken(directory, "create")
		};
	} catch (error) {
		if (directory) removeTempDirectory(directory);
		throw error;
	}
}
Buffer.from([
	217,
	213,
	5,
	249,
	32,
	161,
	99,
	215
]);
function publishPreparedCopy(directory) {
	const location = path.join(directory, "database.sqlite");
	for (const suffix of [
		"-wal",
		"-shm",
		"-journal",
		""
	]) {
		const staged = `${location}.partial${suffix}`;
		if (fs.existsSync(staged)) fs.renameSync(staged, `${location}${suffix}`);
	}
	return adoptPreparedLocation(location, directory);
}
function preparationCleanupError(errors, operation) {
	return createSqliteLifecycleAggregateError(errors, `${operation} and cleanup failed: ${coerceErrorMessage(errors[0])}`, errors[0]);
}
async function prepareSqliteReadOnlyLocationFromOwnedDatabase(database, assertCurrent, signal, cleanupMode) {
	const assertReady = () => {
		signal?.throwIfAborted();
		assertCurrent();
		if (!database.isOpen || database.isTransaction) throw new Error("SQLite inspection requires an open owner outside a transaction");
	};
	assertReady();
	const directory = await createSqliteSnapshotStagingDirectory(void 0, false, signal, cleanupMode === "async");
	try {
		assertReady();
		const location = path.join(directory, "database.sqlite.partial");
		await retainSnapshotWork(backupNodeSqliteDatabase(database, location));
		signal?.throwIfAborted();
		assertCurrent();
		return publishPreparedCopy(directory);
	} catch (error) {
		const errors = [error];
		if (!await removeTempDirectoryAsync(directory, (cleanupError) => errors.push(cleanupError)) && cleanupMode === "async") throw preparationCleanupError(errors, "Owned SQLite snapshot preparation");
		throw error;
	}
}
//#endregion
//#region src/infra/sqlite-snapshot-single-flight.ts
const snapshotFlights = resolveGlobalSingleton(Symbol.for("openclaw.sqliteSnapshotFlights"), () => ({
	unscoped: /* @__PURE__ */ new Map(),
	scoped: /* @__PURE__ */ new WeakMap()
}));
function completed(value) {
	const retained = createRetainedOperation(() => {});
	retained.resolve(value);
	return retained.operation;
}
function serviceWhenSettled(source, service) {
	source.result.then(service, service);
}
function createFlight(flights, key, producer) {
	let source;
	let started = false;
	let servicing = false;
	let cleanup;
	let closing;
	let cleanupFailure;
	const production = createRetainedOperation(() => {
		if (servicing || production.operation.read().status !== "pending") return;
		servicing = true;
		try {
			if (!started) {
				started = true;
				source = producer(flight.controller.signal, (error) => cleanupFailure = error);
				serviceWhenSettled(source.operation, serviceFlight);
			}
			source.operation.service();
			const outcome = source.operation.read();
			if (outcome.status === "fulfilled") production.resolve(outcome.value);
			else if (outcome.status === "rejected") production.reject(outcome.error);
		} catch (error) {
			production.reject(error);
		} finally {
			servicing = false;
		}
	});
	const settled = createRetainedOperation(() => {
		production.operation.service();
		const outcome = production.operation.read();
		if (outcome.status === "pending" || settled.operation.read().status !== "pending") return;
		if (flights.get(key) === flight) flights.delete(key);
		if (outcome.status === "rejected") settled.reject(cleanupFailure ?? outcome.error);
		else if (flight.references > 0) settled.resolve(outcome.value);
		else {
			if (!cleanup) {
				cleanup = releaseSnapshot(flight, outcome.value);
				serviceWhenSettled(cleanup, () => settled.operation.service());
			}
			cleanup.service();
			const removed = cleanup.read();
			if (removed.status === "fulfilled") {
				if (removed.value) settled.resolve(outcome.value);
				else settled.reject(new SqliteSnapshotCleanupError("SQLite orphan snapshot cleanup did not complete"));
			} else if (removed.status === "rejected") settled.reject(removed.error);
		}
	});
	function serviceFlight() {
		production.operation.service();
		for (const service of flight.listeners) service();
		settled.operation.service();
	}
	const flight = {
		controller: new AbortController(),
		references: 0,
		listeners: /* @__PURE__ */ new Set(),
		production: production.operation,
		settled: settled.operation,
		closeProducer() {
			closing ??= source?.startClose?.() ?? completed(void 0);
			return closing;
		}
	};
	retainSnapshotWork(settled.operation.result, () => {
		flight.controller.abort(/* @__PURE__ */ new Error("SQLite snapshot owner stopped"));
		serviceFlight();
	});
	return flight;
}
function releaseSnapshot(flight, base) {
	return flatMapRetainedOperation(base.startCleanup(), (removed) => removed ? mapRetainedOperation(flight.closeProducer(), () => true) : completed(false));
}
function leaseFlight(flight, base) {
	let released = false;
	let cleanup;
	const releaseReference = () => {
		if (!released) {
			released = true;
			flight.references--;
		}
		return flight.references === 0;
	};
	const startCleanup = () => {
		cleanup ??= !released && releaseReference() ? releaseSnapshot(flight, base) : completed(true);
		return cleanup;
	};
	return {
		location: base.location,
		cleanupRoot: base.cleanupRoot,
		cleanup() {
			if (released) {
				const outcome = cleanup?.read();
				return !outcome || outcome.status === "fulfilled" && outcome.value;
			}
			if (flight.references > 1) {
				releaseReference();
				return true;
			}
			const removed = base.cleanup();
			if (removed) releaseReference();
			return removed;
		},
		cleanupAsync: () => startCleanup().result,
		startCleanup
	};
}
function startSnapshotFlight(databasePath, operation, producer, signal, lifecycle) {
	signal?.throwIfAborted();
	const key = `${readDatabasePathIdentitySync(databasePath).key}:${operation}`;
	let flights = snapshotFlights.unscoped;
	if (lifecycle?.scope) {
		let scoped = snapshotFlights.scoped.get(lifecycle.scope);
		if (!scoped) {
			scoped = /* @__PURE__ */ new Map();
			snapshotFlights.scoped.set(lifecycle.scope, scoped);
		}
		flights = scoped;
	}
	let flight = flights.get(key);
	if (!flight) {
		flight = createFlight(flights, key, producer);
		flights.set(key, flight);
	}
	const selected = flight;
	selected.references++;
	lifecycle?.trackProducer?.(selected.settled.result);
	let closed = false;
	let withdrew = false;
	let closing;
	const retained = createRetainedOperation(() => {
		if (retained.operation.read().status !== "pending") return;
		if (closed || signal?.aborted) {
			if (!withdrew) {
				withdrew = true;
				selected.references--;
			}
			if (selected.references === 0) {
				selected.controller.abort(signal?.reason);
				if (flights.get(key) === selected) flights.delete(key);
				if (!lifecycle?.trackProducer) {
					selected.settled.service();
					if (selected.settled.read().status === "pending") return;
				}
			}
			retained.reject(signal?.reason ?? /* @__PURE__ */ new Error("SQLite snapshot preparation closed"));
		} else {
			selected.production.service();
			const outcome = selected.production.read();
			if (outcome.status === "pending") return;
			if (outcome.status === "fulfilled") retained.resolve(leaseFlight(selected, outcome.value));
			else {
				selected.references--;
				retained.reject(outcome.error);
			}
		}
		signal?.removeEventListener("abort", service);
		selected.listeners.delete(service);
		selected.settled.service();
	});
	const service = () => retained.operation.service();
	serviceWhenSettled(selected.settled, service);
	selected.listeners.add(service);
	signal?.addEventListener("abort", service, { once: true });
	queueMicrotask(service);
	return {
		...retained.operation,
		startClose() {
			closed = true;
			retained.operation.service();
			const outcome = retained.operation.read();
			closing ??= outcome.status === "fulfilled" ? mapRetainedOperation(outcome.value.startCleanup(), (removed) => {
				if (!removed) throw new SqliteSnapshotCleanupError("SQLite snapshot lease cleanup did not complete");
			}) : selected.references === 0 ? selected.closeProducer() : completed(void 0);
			return closing;
		}
	};
}
/** Promise-only producers remain on their existing awaited path, never a sync bridge. */
function startAwaitedSnapshotWork(produce) {
	const retained = createRetainedOperation(() => {});
	Promise.resolve().then(produce).then(retained.resolve, retained.reject);
	return retained.operation;
}
async function prepareSingleFlightSqliteSnapshot(databasePath, operation, producer, signal, lifecycle) {
	return startSnapshotFlight(databasePath, operation, (flightSignal, recordFailure) => ({ operation: startAwaitedSnapshotWork(async () => {
		const base = await producer(flightSignal, recordFailure);
		return {
			...base,
			startCleanup: () => startAwaitedSnapshotWork(() => base.cleanupAsync())
		};
	}) }), signal, lifecycle).result;
}
function startSingleFlightSqliteSnapshot(databasePath, operation, producer, signal, lifecycle) {
	return startSnapshotFlight(databasePath, operation, (flightSignal, recordFailure) => {
		const source = producer(flightSignal, recordFailure);
		return {
			operation: source,
			startClose: () => source.startClose()
		};
	}, signal, lifecycle);
}
//#endregion
//#region src/infra/sqlite-live-snapshot.ts
const liveOwners = resolveGlobalSingleton(Symbol.for("openclaw.sqliteLiveSnapshotOwners"), () => /* @__PURE__ */ new Map());
function registerLiveSqliteSnapshotOwner(options) {
	const identity = readDatabasePathIdentitySync(options.databasePath);
	const registration = {
		assertCurrent: options.assertCurrent,
		database: options.database,
		owner: options.owner
	};
	liveOwners.set(identity.key, registration);
	return () => {
		if (liveOwners.get(identity.key) === registration) liveOwners.delete(identity.key);
	};
}
function prepareSqliteSnapshotFromLiveOwner(databasePath, signal) {
	signal?.throwIfAborted();
	const identity = readDatabasePathIdentitySync(databasePath);
	const owner = liveOwners.get(identity.key);
	if (!owner) return;
	owner.assertCurrent();
	return prepareSingleFlightSqliteSnapshot(identity.canonicalPath, `live-owner:${owner.owner}`, async (flightSignal) => {
		const sizes = {
			sourceMainBytes: sqliteSnapshotSourceFileSize(identity.canonicalPath),
			sourceWalBytes: sqliteSnapshotSourceFileSize(`${identity.canonicalPath}-wal`)
		};
		const started = performance.now();
		const report = (outcome, copiedBytes, error) => emitSqliteSnapshotTelemetry({
			...sizes,
			attempt: 1,
			copiedBytes,
			durationMs: Math.max(0, performance.now() - started),
			operation: "online-backup",
			outcome,
			owner: owner.owner,
			waitMs: 0
		}, error);
		try {
			const prepared = await prepareSqliteReadOnlyLocationFromOwnedDatabase(owner.database, owner.assertCurrent, flightSignal);
			report("success", fs.statSync(prepared.location).size);
			return prepared;
		} catch (error) {
			report("error", 0, error);
			throw error;
		}
	}, signal);
}
//#endregion
//#region src/infra/sqlite-files.ts
/** SQLite main database plus every journal-mode sidecar that can contain database pages. */
const SQLITE_DATABASE_FILE_SUFFIXES = [
	"",
	"-wal",
	"-shm",
	"-journal"
];
const SQLITE_SIDECAR_SUFFIXES = SQLITE_DATABASE_FILE_SUFFIXES.slice(1);
const SQLITE_WAL_HEADER_BYTES = 32;
Buffer.from([
	0,
	5,
	22,
	7
]);
const sqliteFilesLog = createSubsystemLogger("state/sqlite");
var SqliteOrphanedSidecarsError = class extends Error {
	constructor(pathname, sidecarPaths, cause) {
		super(`SQLite database is missing at ${pathname}, and orphaned sidecars could not be copied: ${sidecarPaths.join(", ")}. Refusing to open because SQLite could delete orphan WAL or journal state. Preserve the sidecar bytes, restore the main database, and pair it with the matching sidecar before retrying.`, { cause });
		this.name = "SqliteOrphanedSidecarsError";
	}
};
/** Resolves the main database and all possible journal-mode sidecar paths. */
function resolveSqliteDatabaseFilePaths(pathname) {
	return SQLITE_DATABASE_FILE_SUFFIXES.map((suffix) => `${pathname}${suffix}`);
}
function findMatchingOrphanedSidecarCopy(sourcePath, sourceSize) {
	const directory = path.dirname(sourcePath);
	const prefix = `${path.basename(sourcePath)}.orphaned-`;
	const candidates = fs.readdirSync(directory, { withFileTypes: true }).filter((entry) => entry.isFile() && entry.name.startsWith(prefix)).map((entry) => path.join(directory, entry.name)).filter((candidate) => fs.statSync(candidate).size === sourceSize);
	if (candidates.length === 0) return;
	const sourceHash = sha256FileSync(sourcePath);
	for (const candidate of candidates) if (sha256FileSync(candidate) === sourceHash) return candidate;
}
function copyOrphanedSidecar(sourcePath, epochMs) {
	const basePath = `${sourcePath}.orphaned-${epochMs}`;
	for (let suffix = 0;; suffix += 1) {
		const candidate = suffix === 0 ? basePath : `${basePath}-${suffix}`;
		try {
			fs.copyFileSync(sourcePath, candidate, fs.constants.COPYFILE_EXCL);
			return candidate;
		} catch (error) {
			if (error.code !== "EEXIST") throw error;
		}
	}
}
/** Preserve durable orphan sidecars before SQLite creates a replacement main database. */
function quarantineOrphanedSqliteSidecars(pathname) {
	if (fs.existsSync(pathname)) return;
	const sidecars = [{
		path: `${pathname}-wal`,
		minimumBytes: SQLITE_WAL_HEADER_BYTES
	}, {
		path: `${pathname}-journal`,
		minimumBytes: 0
	}].flatMap((sidecar) => {
		const stat = fs.statSync(sidecar.path, { throwIfNoEntry: false });
		return stat?.isFile() === true && stat.size > sidecar.minimumBytes ? [{
			path: sidecar.path,
			size: stat.size
		}] : [];
	});
	if (sidecars.length === 0) return;
	const epochMs = Date.now();
	const copied = [];
	try {
		for (const sidecar of sidecars) {
			if (findMatchingOrphanedSidecarCopy(sidecar.path, sidecar.size)) continue;
			const quarantinePath = copyOrphanedSidecar(sidecar.path, epochMs);
			copied.push({
				quarantinePath,
				sourcePath: sidecar.path
			});
		}
	} catch (error) {
		throw new SqliteOrphanedSidecarsError(pathname, sidecars.map((sidecar) => sidecar.path), error);
	}
	if (copied.length === 0) return;
	const copies = copied.map(({ sourcePath, quarantinePath }) => `${sourcePath} -> ${quarantinePath}`);
	sqliteFilesLog.warn(`SQLite database is missing at ${pathname}; copied orphaned sidecars: ${copies.join(", ")}. Committed frames could not be applied because the main database is missing. The bytes are preserved. Recovery requires restoring the main database and pairing it with the quarantined file.`, {
		databasePath: pathname,
		copiedSidecars: copied
	});
}
//#endregion
//#region src/infra/update-rehearsal-paths.ts
/** Declare the private filesystem namespace shared by every rehearsal child. */
function buildUpdateRehearsalPathEnv(root) {
	return {
		HOME: root,
		USERPROFILE: root,
		TMPDIR: root,
		TMP: root,
		TEMP: root,
		XDG_CONFIG_HOME: path.join(root, "config"),
		XDG_CACHE_HOME: path.join(root, "cache"),
		XDG_DATA_HOME: path.join(root, "data"),
		XDG_STATE_HOME: path.join(root, "state"),
		OPENCLAW_HOME: root,
		OPENCLAW_STATE_DIR: root,
		OPENCLAW_CONFIG_PATH: path.join(root, "openclaw.json"),
		OPENCLAW_WORKSPACE_DIR: path.join(root, "workspace"),
		OPENCLAW_SKIP_CHANNELS: "1",
		OPENCLAW_SKIP_PROVIDERS: "1",
		OPENCLAW_SKIP_CRON: "1",
		OPENCLAW_SKIP_GMAIL_WATCHER: "1",
		OPENCLAW_SKIP_CANVAS_HOST: "1",
		OPENCLAW_SKIP_BROWSER_CONTROL_SERVER: "1",
		OPENCLAW_SKIP_STARTUP_MODEL_PREWARM: "1",
		OPENCLAW_NO_AUTO_UPDATE: "1",
		NODE_DISABLE_COMPILE_CACHE: "1"
	};
}
/** Recognize the complete 9.3+ driver contract; update-in-progress alone is also used by live Doctor. */
function resolveUpdateRehearsalRoot(env) {
	const root = env.OPENCLAW_STATE_DIR;
	if (!root || !path.isAbsolute(root) || !["0", "1"].includes(env.OPENCLAW_UPDATE_IN_PROGRESS ?? "") || Object.entries(buildUpdateRehearsalPathEnv(root)).some(([key, value]) => env[key] !== value) || env.OPENCLAW_SERVICE_REPAIR_POLICY !== "external" || env.OPENCLAW_UPDATE_PARENT_ALLOWS_GATEWAY_SERVICE_REPAIR !== "0" || env.OPENCLAW_UPDATE_PARENT_ALLOWS_GATEWAY_ACTIVATION !== "0" || Boolean(env.OPENCLAW_COMPATIBILITY_HOST_VERSION)) return;
	return path.resolve(root);
}
/** Uncopied absolute locators remain inventory; they cannot grant writes outside the private root. */
function isUpdateRehearsalReadOnlyPath(filePath, env) {
	const root = resolveUpdateRehearsalRoot(env);
	if (!root) return false;
	const resolved = path.resolve(filePath);
	return !isPathInside(root, resolved) || !isPathInside(resolveIdentityPathViaExistingAncestorSync(root), resolveIdentityPathViaExistingAncestorSync(resolved));
}
/** Reuse prepared images only when the entire SQLite family stays in the disposable namespace. */
function isUpdateRehearsalPrivateDatabase(filePath, env) {
	return resolveUpdateRehearsalRoot(env) !== void 0 && resolveSqliteDatabaseFilePaths(filePath).every((file) => !isUpdateRehearsalReadOnlyPath(file, env));
}
//#endregion
//#region src/infra/sqlite-snapshot-source.ts
/** The inspection scope owns private readers until native close and snapshot disposal settle. */
function openSqliteReadOnlyDatabase(pathname, options = {}) {
	const scope = artifactPreservingReads.getStore();
	if (!scope || !isArtifactPreservingStateRead("agent", pathname)) return openNodeSqliteDatabase(pathname, {
		...options,
		readOnly: true
	});
	const snapshot = isUpdateRehearsalPrivateDatabase(pathname, process.env) ? void 0 : prepareSqliteReadOnlyLocationSync(pathname);
	const release = snapshot ? retainSnapshotTempDirectory(snapshot.cleanupRoot ?? path.dirname(snapshot.location)) : void 0;
	const native = {};
	const close = () => {
		native.close?.();
		release?.();
		if (snapshot && !snapshot.cleanup()) throw new SqliteSnapshotCleanupError("SQLite inspection snapshot cleanup failed.");
		scope.readers.delete(close);
	};
	scope.readers.add(close);
	const db = openNodeSqliteDatabase(snapshot?.location ?? pathname, {
		...options,
		readOnly: true
	});
	const dispose = db.close.bind(db);
	native.close = () => {
		if (db.isOpen) dispose();
	};
	db.close = close;
	return db;
}
async function prepareSqliteReadOnlyLocation(pathname, options = {}) {
	const signal = resolveSqliteInspectionSignal(options.signal);
	const preserveSourceArtifacts = options.preserveSourceArtifacts === true || isArtifactPreservingStateRead("agent", pathname);
	try {
		signal?.throwIfAborted();
		if (!preserveSourceArtifacts && options.allowLiveOwner !== false) {
			const owned = prepareSqliteSnapshotFromLiveOwner(pathname, signal);
			if (owned) return await owned;
		}
		return prepareWorkerSnapshot(pathname, {
			...options,
			preserveSourceArtifacts
		}, signal);
	} catch (error) {
		signal?.throwIfAborted();
		throw error;
	}
}
function startSqliteReadOnlyLocationAsync(inputPathname, options = {}) {
	const signal = resolveSqliteInspectionSignal(options.signal);
	signal?.throwIfAborted();
	const pathname = path.resolve(inputPathname);
	const preserveSourceArtifacts = options.preserveSourceArtifacts === true || isArtifactPreservingStateRead("agent", pathname);
	const expectedSourceIdentity = options.expectedSourceIdentity === void 0 ? void 0 : readDatabaseFileIdentity(options.expectedSourceIdentity);
	if (expectedSourceIdentity && !preserveSourceArtifacts) throw new Error("SQLite source identity requires artifact-preserving preparation");
	const requireCleanup = options.signal !== void 0;
	const { env, cwd } = captureSqliteReadOnlyWorkerLaunch();
	const root = resolvePrivateSqliteSnapshotStagingRoot();
	const deadlineOwnedByCaller = isSqliteInspectionDeadlineOwnedByCaller();
	const staging = captureSqliteSnapshotStagingOwner();
	const runInContext = AsyncLocalStorage.snapshot();
	return startSingleFlightSqliteSnapshot(pathname, `${preserveSourceArtifacts ? "worker-sync" : "worker-async"}:${requireCleanup ? "strict" : "best-effort"}:async-token${expectedSourceIdentity ? `:${JSON.stringify(expectedSourceIdentity)}` : ""}`, (flightSignal) => runInContext(() => {
		const task = staging.start({
			type: "prepare",
			root,
			pathname,
			allowLegacyWorker: false,
			preserveSourceArtifacts,
			expectedSourceIdentity,
			deadlineOwnedByCaller,
			launch: {
				env,
				cwd,
				transport: { kind: "native" }
			}
		}, flightSignal);
		return {
			...mapRetainedOperation(task, (reply) => {
				if (reply.type !== "prepared") throw new Error("SQLite snapshot producer returned an allocation without its prepared location");
				return adoptPreparedLocation(reply.location, reply.directory, requireCleanup);
			}),
			startClose: () => task.startClose()
		};
	}), signal, { scope: staging });
}
/** Promise-only reads retain the token in one child, without another worker or broker. */
async function prepareSqliteReadOnlyLocationAwaited(inputPathname, options) {
	const signal = resolveSqliteInspectionSignal(options.signal);
	const pathname = path.resolve(inputPathname);
	const expectedSourceIdentity = readDatabaseFileIdentity(options.expectedSourceIdentity);
	return prepareSingleFlightSqliteSnapshot(pathname, `worker-sync:strict:awaited-token:${JSON.stringify(expectedSourceIdentity)}`, (flightSignal, recordCleanupFailure) => prepareAwaitedWorkerSnapshot(pathname, {
		signal: flightSignal,
		expectedSourceIdentity
	}, recordCleanupFailure), signal);
}
async function prepareAwaitedWorkerSnapshot(pathname, options, recordCleanupFailure) {
	return useAwaitedSnapshotWorker(options.signal, recordCleanupFailure, async (worker, directory) => {
		const location = await worker.run(pathname, {
			mode: "sync",
			stagingRoot: directory,
			expectedSourceIdentity: readDatabaseFileIdentity(options.expectedSourceIdentity),
			signal: options.signal
		});
		if (typeof location !== "string") throw new Error("SQLite snapshot preparation returned an invalid location");
		options.signal.throwIfAborted();
		return adoptPreparedLocation(location, directory, true);
	}, true);
}
/** Keep raw source-file access and token retirement in one isolated native session. */
function withSqliteSnapshotWorker(signal, inspect) {
	return useAwaitedSnapshotWorker(signal, void 0, inspect, false);
}
async function useAwaitedSnapshotWorker(signal, recordCleanupFailure, inspect, retainPrepared) {
	signal.throwIfAborted();
	const launch = captureSqliteReadOnlyWorkerLaunch();
	let worker = createScopedSqliteReadOnlyWorker({
		...launch,
		retainOnOperationError: true
	});
	let directory;
	let retirement;
	const retire = () => {
		if (retirement && retirement.read().status !== "rejected") return retirement;
		const completion = createRetainedOperation(() => {});
		retirement = completion.operation;
		(async () => {
			if (directory) {
				const recover = worker.isRetired();
				if (recover) {
					await worker.close();
					worker = createScopedSqliteReadOnlyWorker(launch);
				}
				await worker.run(directory, { mode: recover ? "staging-reconcile" : "staging-retire" });
			}
			await worker.close();
			await worker.closed;
			if (directory) await fs.promises.rm(directory, {
				recursive: true,
				force: true,
				maxRetries: 3,
				retryDelay: 20
			});
		})().then(completion.resolve, completion.reject);
		return retirement;
	};
	try {
		const allocated = await worker.run(resolvePrivateSqliteSnapshotStagingRoot(), {
			mode: "staging-create",
			signal
		});
		if (typeof allocated !== "string") throw new Error("SQLite snapshot allocation returned an invalid directory");
		directory = allocated;
		registerRetainedSnapshotTempDirectory(directory, retire);
		signal.throwIfAborted();
		const value = await inspect(worker, directory);
		signal.throwIfAborted();
		if (!retainPrepared && !await removeTempDirectoryAsync(directory)) throw new SqliteSnapshotCleanupError(`SQLite snapshot cleanup failed: ${directory}`);
		return value;
	} catch (error) {
		try {
			if (directory) {
				if (!await removeTempDirectoryAsync(directory)) throw new SqliteSnapshotCleanupError(`SQLite snapshot cleanup failed: ${directory}`);
			} else {
				await worker.close();
				await worker.closed;
			}
		} catch (cleanupError) {
			const failure = new AggregateError([error, cleanupError], "SQLite snapshot preparation and cleanup failed");
			recordCleanupFailure?.(failure);
			throw failure;
		}
		throw error;
	}
}
function prepareWorkerSnapshot(pathname, options, signal) {
	signal?.throwIfAborted();
	const requireCleanup = options.requireCleanup ?? options.signal !== void 0;
	return prepareSingleFlightSqliteSnapshot(pathname, `${options.preserveSourceArtifacts ? "worker-sync" : "worker-async"}:${requireCleanup ? "strict" : "best-effort"}:sync-token`, async (flightSignal, recordCleanupFailure) => {
		let stagingRoot;
		try {
			flightSignal.throwIfAborted();
			stagingRoot = await createSqliteSnapshotStagingDirectory(void 0, false, flightSignal);
			flightSignal.throwIfAborted();
			const location = await runSqliteReadOnlyWorker(pathname, {
				mode: options.preserveSourceArtifacts ? "sync" : "async",
				signal: flightSignal,
				stagingRoot
			});
			flightSignal.throwIfAborted();
			return adoptPreparedLocation(location, stagingRoot, requireCleanup);
		} catch (error) {
			if (stagingRoot && !await removeTempDirectoryAsync(stagingRoot)) {
				const failure = new SqliteSnapshotCleanupError(`${coerceErrorMessage(error)}; SQLite snapshot cleanup failed: ${stagingRoot}`, { cause: error });
				recordCleanupFailure?.(failure);
				throw failure;
			}
			if (error instanceof SqliteSnapshotCleanupError) {
				recordCleanupFailure(error);
				throw error;
			}
			flightSignal.throwIfAborted();
			throw error;
		}
	}, signal);
}
function prepareSqliteReadOnlyLocationSync(pathname) {
	const stagingRoot = createSqliteSnapshotStagingDirectorySync();
	try {
		return adoptPreparedLocation(runSqliteReadOnlyWorkerSync(pathname, stagingRoot), stagingRoot);
	} catch (error) {
		if (!removeTempDirectory(stagingRoot)) throw new SqliteSnapshotCleanupError(`${coerceErrorMessage(error)}; SQLite snapshot cleanup failed: ${stagingRoot}`, { cause: error });
		throw error;
	}
}
//#endregion
//#region src/state/openclaw-quarantine-store.ts
const OPENCLAW_QUARANTINE_SCHEMA_VERSION = 2;
const OPENCLAW_QUARANTINE_BUSY_TIMEOUT_MS = 5e3;
const OPENCLAW_QUARANTINE_DIR_MODE = 448;
const OPENCLAW_QUARANTINE_FILE_MODE = 384;
const quarantineSchemaAdmission = {
	name: "openclaw.quarantine.schema",
	schemaDependent: true,
	read(value) {
		if (typeof value !== "object" || value === null || !("version" in value) || typeof value.version !== "number") return;
		return { version: value.version };
	}
};
function quarantineDecisionAdmission(pathname) {
	return {
		name: `openclaw.quarantine.decision:${path.resolve(pathname)}`,
		read: (value) => value === null || isQuarantineDecision(value) ? value : void 0
	};
}
function isQuarantineDecision(value) {
	return isRecord(value) && (value.kind === "agent" || value.kind === "state") && typeof value.reason === "string" && typeof value.quarantinedAt === "number" && (value.verifiedGenerationJson === null || typeof value.verifiedGenerationJson === "string");
}
function configureQuarantineWriter(database, storePath) {
	database.exec(`
    PRAGMA journal_mode = DELETE;
    PRAGMA synchronous = FULL;
  `);
	const userVersion = readQuarantineSchemaVersion(database, storePath);
	if (userVersion === OPENCLAW_QUARANTINE_SCHEMA_VERSION) return;
	if (userVersion === 1) runSqliteImmediateTransactionSync(database, () => database.exec(`
      ALTER TABLE quarantined_databases ADD COLUMN verified_generation TEXT;
      PRAGMA user_version = ${OPENCLAW_QUARANTINE_SCHEMA_VERSION};
    `));
	else if (userVersion !== OPENCLAW_QUARANTINE_SCHEMA_VERSION) runSqliteImmediateTransactionSync(database, () => database.exec(`
    CREATE TABLE IF NOT EXISTS quarantined_databases (
      path TEXT NOT NULL PRIMARY KEY,
      kind TEXT NOT NULL,
      reason TEXT NOT NULL,
      quarantined_at INTEGER NOT NULL,
      writer_app_version TEXT,
      verified_generation TEXT
    ) STRICT;
    PRAGMA user_version = ${OPENCLAW_QUARANTINE_SCHEMA_VERSION};
    `));
	database.exec(`CREATE TABLE IF NOT EXISTS agent_integrity_verifications (
    path TEXT NOT NULL PRIMARY KEY, dev TEXT NOT NULL, ino TEXT NOT NULL,
    app_version TEXT NOT NULL, verified_at INTEGER NOT NULL,
    clean_close INTEGER NOT NULL CHECK (clean_close IN (0, 1))
  ) STRICT;`);
	publishSqliteDatabaseAdmission(database, quarantineSchemaAdmission, { version: OPENCLAW_QUARANTINE_SCHEMA_VERSION });
}
function readQuarantineSchemaVersion(database, storePath, fresh = false) {
	const admitted = fresh ? void 0 : getSqliteDatabaseAdmission(database, quarantineSchemaAdmission);
	if (admitted) return admitted.version;
	const userVersion = database.prepare("PRAGMA user_version").get()?.user_version;
	if (typeof userVersion !== "number" || !Number.isInteger(userVersion)) throw new Error(`OpenClaw quarantine store ${storePath} has an invalid schema version.`);
	if (userVersion > OPENCLAW_QUARANTINE_SCHEMA_VERSION) throw new Error(`OpenClaw quarantine store ${storePath} uses newer schema version ${userVersion}.`);
	if (userVersion !== 0) publishSqliteDatabaseAdmission(database, quarantineSchemaAdmission, { version: userVersion });
	return userVersion;
}
function withQuarantineWriter(env, operation) {
	const storePath = resolveQuarantineStorePath(env);
	const existed = existsSync(storePath);
	const dir = path.dirname(storePath);
	mkdirSync(dir, {
		recursive: true,
		mode: OPENCLAW_QUARANTINE_DIR_MODE
	});
	applyPrivateModeSync(dir, OPENCLAW_QUARANTINE_DIR_MODE);
	const database = openNodeSqliteDatabase(storePath, { timeout: OPENCLAW_QUARANTINE_BUSY_TIMEOUT_MS });
	let completed = false;
	try {
		if (!existed) applyPrivateModeSync(storePath, OPENCLAW_QUARANTINE_FILE_MODE);
		configureQuarantineWriter(database, storePath);
		const result = operation(database);
		completed = true;
		return result;
	} finally {
		if (database.isOpen) database.close();
		if (completed || !existed) applyPrivateModeSync(storePath, OPENCLAW_QUARANTINE_FILE_MODE);
	}
}
/** Its existence preserves prior state ownership even when an external agent is not configured. */
function ensureOpenClawQuarantineStore(env) {
	if (!existsSync(resolveQuarantineStorePath(env))) withQuarantineWriter(env, () => {});
}
/** Runtime guards share the owner's decision; explicit repair may inspect disk. */
function readOpenClawDatabaseQuarantine(pathname, options = {}) {
	const storePath = resolveQuarantineStorePath(options.env ?? process.env);
	const load = () => readPersistedQuarantineDecision(pathname, storePath, options.fresh) ?? null;
	const decision = options.fresh ? load() : getOrLoadSqliteDatabaseAdmissionForPath(storePath, quarantineDecisionAdmission(pathname), load);
	return decision ? resolveQuarantineDecision(decision, pathname, storePath) : void 0;
}
function readPersistedQuarantineDecision(pathname, storePath, fresh = false) {
	if (!existsSync(storePath)) return;
	const database = openSqliteReadOnlyDatabase(storePath, { timeout: OPENCLAW_QUARANTINE_BUSY_TIMEOUT_MS });
	let outcome;
	try {
		outcome = { value: readQuarantineDecision(database, pathname, storePath, fresh) };
	} catch (error) {
		outcome = { error };
	}
	try {
		database.close();
	} catch (closeError) {
		let quarantine;
		let readError = "error" in outcome ? outcome.error : void 0;
		if ("value" in outcome && outcome.value) try {
			quarantine = resolveQuarantineDecision(outcome.value, pathname, storePath);
		} catch (error) {
			readError = error;
		}
		throw new OpenClawQuarantineReadCleanupError(readError === void 0 ? [closeError] : [readError, closeError], quarantine);
	}
	if ("error" in outcome) throw outcome.error;
	return outcome.value;
}
function readQuarantineDecision(database, pathname, storePath, fresh = false) {
	const userVersion = readQuarantineSchemaVersion(database, storePath, fresh);
	if (userVersion === 0) return;
	const generationColumn = userVersion >= 2 ? ", verified_generation" : "";
	const row = database.prepare(`SELECT kind, reason, quarantined_at${generationColumn} FROM quarantined_databases WHERE path = ? LIMIT 1`).get(path.resolve(pathname));
	if (!row) return;
	const verifiedGenerationJson = userVersion >= 2 ? row.verified_generation : void 0;
	if (row.kind !== "agent" && row.kind !== "state" || typeof row.reason !== "string" || typeof row.quarantined_at !== "number" || !Number.isInteger(row.quarantined_at) || verifiedGenerationJson !== void 0 && verifiedGenerationJson !== null && typeof verifiedGenerationJson !== "string") throw new Error(`OpenClaw quarantine store ${storePath} contains an invalid row.`);
	return {
		kind: row.kind,
		quarantinedAt: row.quarantined_at,
		reason: row.reason,
		verifiedGenerationJson: typeof verifiedGenerationJson === "string" ? verifiedGenerationJson : null
	};
}
function resolveQuarantineDecision(decision, pathname, storePath) {
	if (decision.verifiedGenerationJson !== null) {
		let verifiedGeneration;
		try {
			verifiedGeneration = parseSqliteFileGeneration(decision.verifiedGenerationJson);
		} catch {
			throw new Error(`OpenClaw quarantine store ${storePath} contains an invalid row.`);
		}
		try {
			const currentGeneration = readSqliteFileGenerationSync(path.resolve(pathname));
			if (!sameSqliteFileGeneration(verifiedGeneration, currentGeneration)) return;
		} catch {
			return;
		}
	}
	return {
		kind: decision.kind,
		quarantinedAt: decision.quarantinedAt,
		reason: decision.reason
	};
}
/** Runtime opens refuse recorded damage while tolerating a broken quarantine index. */
function readOpenClawDatabaseQuarantineFailure(kind, pathname, options = {}) {
	let quarantine;
	let cleanupFailure;
	try {
		quarantine = readOpenClawDatabaseQuarantine(pathname, options);
	} catch (error) {
		if (!(error instanceof OpenClawQuarantineReadCleanupError)) return;
		if (!error.quarantine) throw error;
		quarantine = error.quarantine;
		cleanupFailure = error;
	}
	if (!quarantine) return;
	const failure = /* @__PURE__ */ new Error(`OpenClaw ${kind} database ${pathname} is quarantined after integrity verification failed: ${quarantine.reason ?? "unknown integrity error"}. Restore the database from a backup or repair it, then run openclaw doctor --fix to clear the quarantine. See ${OPENCLAW_DATABASE_SCHEMA_DOCS_URL}.`);
	failure.name = "SqliteIntegrityError";
	if (cleanupFailure) failure.cause = cleanupFailure;
	return failure;
}
function recordOpenClawDatabaseQuarantine(options) {
	const serializedGeneration = options.generation ? serializeSqliteFileGeneration(options.generation) : null;
	const quarantinedAt = Date.now();
	try {
		const recorded = withQuarantineWriter(options.env ?? process.env, (database) => runSqliteImmediateTransactionSync(database, () => {
			database.prepare(`
              INSERT INTO quarantined_databases (
                path, kind, reason, quarantined_at, writer_app_version, verified_generation
              ) VALUES (?, ?, ?, ?, ?, ?)
              ON CONFLICT(path) DO UPDATE SET
                kind = excluded.kind,
                reason = excluded.reason,
                quarantined_at = excluded.quarantined_at,
                writer_app_version = excluded.writer_app_version,
                verified_generation = excluded.verified_generation
            `).run(path.resolve(options.path), options.kind, options.reason, quarantinedAt, VERSION, serializedGeneration);
			publishSqliteDatabaseAdmission(database, quarantineDecisionAdmission(options.path), {
				kind: options.kind,
				quarantinedAt,
				reason: options.reason,
				verifiedGenerationJson: serializedGeneration
			});
			return true;
		}, {
			databaseLabel: resolveQuarantineStorePath(options.env ?? process.env),
			operationLabel: "quarantine.record"
		}));
		if (recorded) revokeSqliteDatabaseAdmissionsForPath(options.path);
		return recorded;
	} catch {
		return false;
	}
}
//#endregion
//#region src/state/openclaw-state-db-borrow.ts
/** The canonical cache supplies identity and custody; this owner manages its native references. */
function createStateDatabaseRetainer(state, operations) {
	const admit = (pathname, ownership) => {
		const scope = getOpenClawDatabaseMaintenanceScope();
		if (ownership === "cached-read") scope?.assertReadAdmission();
		else scope?.assertAdmission();
		operations.assertOpen(pathname, ownership);
		return scope;
	};
	const retain = (database, scope, readOnly = false) => {
		operations.capture(database.path).assertCurrent();
		if (state.cachedDatabases.get(database.path) !== database || !database.db.isOpen) throw new Error("OpenClaw state database borrow requires its current canonical handle");
		const owner = state.borrowers.get(database.db) ?? {
			references: /* @__PURE__ */ new Set(),
			retiring: false,
			cleanupComplete: false
		};
		if (owner.retiring) throw new Error("OpenClaw state database native owner is retiring");
		if (!readOnly) observeOpenClawDatabaseMaintenanceResource(database.db);
		state.borrowers.set(database.db, owner);
		const isCurrent = () => !scope || isOpenClawDatabaseMaintenanceResourceOwned(database.db, scope);
		const reference = retainStateDatabaseReference({
			owner,
			retirement: readOnly ? void 0 : {
				ordinary: scope === void 0,
				isCurrent,
				retire: () => {
					if (!isCurrent()) {
						owner.retiring = false;
						return;
					}
					operations.retire(database, scope === void 0);
				}
			},
			stopBeforeRetirement: () => database.walMaintenance.stop(),
			retainFailedClose: () => operations.retainFailed(database),
			ownRetirement: (close) => operations.ownRetirement(database, close),
			onIdle: () => operations.touch(database)
		});
		scope?.own(reference, "shared-references", () => reference.releaseAsync());
		return reference;
	};
	const findReadDatabase = (pathname, ownership) => {
		const resolvedPath = resolveDatabasePath({ path: pathname });
		const database = state.cachedDatabases.get(resolvedPath);
		if (!database?.db.isOpen) return {
			database: void 0,
			scope: void 0
		};
		return {
			database,
			scope: admit(resolvedPath, ownership)
		};
	};
	const retainReadReference = (database, scope) => {
		const reference = retain(database, scope, true);
		const assertCurrent = () => {
			if (state.cachedDatabases.get(database.path) !== database || !database.db.isOpen) throw new Error("Shared-state read lost its original native owner");
		};
		return {
			assertCurrent,
			observe() {
				assertCurrent();
				observeOpenClawDatabaseMaintenanceResource(database.db);
			},
			release: () => reference.release()
		};
	};
	return {
		retain: (database) => retain(database, admit(database.path)),
		retainForIndependentRead(pathname, ownership) {
			const { database, scope } = findReadDatabase(pathname, ownership);
			return database ? retainReadReference(database, scope) : void 0;
		},
		borrowForRead(pathname, ownership) {
			const { database, scope } = findReadDatabase(pathname, ownership);
			if (!database) return;
			if (database.db.isTransaction) throw new Error("Asynchronous shared-state reads cannot run inside a native transaction");
			return {
				database,
				...retainReadReference(database, scope)
			};
		}
	};
}
function assertStateDatabaseBorrowersReleased(owner, pathname) {
	if (owner?.references.size) throw new Error(`OpenClaw state database still has active native borrowers: ${pathname}`);
}
/** Preserve the requesting owner's retirement when the last reference is only a read pin. */
function retainStateDatabaseReference(params) {
	const { owner } = params;
	const reference = {};
	owner.references.add(reference);
	let released = false;
	const release = () => {
		if (released || owner.cleanupComplete) {
			released = true;
			return;
		}
		released = true;
		owner.references.delete(reference);
		if (owner.retirement && !owner.retirement.isCurrent()) {
			owner.retirement = void 0;
			owner.asyncRetirement = void 0;
			owner.retiring = false;
		}
		if (params.retirement?.isCurrent() && !owner.retirement?.ordinary) owner.retirement = params.retirement;
		if (owner.references.size > 0) return;
		if (!owner.retirement) {
			params.onIdle();
			return;
		}
		owner.retiring = true;
		if (owner.asyncRetirement) {
			owner.asyncRetirement.start();
			return;
		}
		try {
			owner.retirement.retire();
		} catch (error) {
			released = false;
			params.retainFailedClose();
			throw error;
		}
		owner.retirement = void 0;
		params.onIdle();
	};
	return {
		release,
		async releaseAsync() {
			if (owner.cleanupComplete) return;
			if ((params.retirement?.isCurrent() && !owner.retirement?.ordinary ? params.retirement : owner.retirement)?.isCurrent()) owner.asyncRetirement ??= createAsyncStateDatabaseRetirement(params);
			release();
			await owner.asyncRetirement?.close();
		}
	};
}
function createAsyncStateDatabaseRetirement(params) {
	const { owner } = params;
	const retained = {};
	let pending;
	let unregister;
	const finish = (retirement) => {
		owner.references.delete(retained);
		if (retirement?.isCurrent()) retirement.retire();
		else owner.retiring = false;
		owner.retirement = void 0;
		owner.asyncRetirement = void 0;
		unregister?.();
		unregister = void 0;
		params.onIdle();
	};
	const run = () => {
		if (pending) return pending;
		if (owner.cleanupComplete || owner.references.size > (owner.references.has(retained) ? 1 : 0)) return Promise.resolve();
		if (!owner.retirement?.isCurrent()) {
			finish();
			return Promise.resolve();
		}
		owner.retiring = true;
		owner.references.add(retained);
		unregister ??= params.ownRetirement(close);
		pending = Promise.resolve().then(async () => {
			await params.stopBeforeRetirement();
			finish(owner.retirement);
		}).catch((error) => {
			owner.references.add(retained);
			params.retainFailedClose();
			throw error;
		});
		pending.catch(() => {});
		return pending;
	};
	function close() {
		const attempt = run();
		return attempt.catch((error) => {
			if (pending === attempt) pending = void 0;
			throw error;
		});
	}
	return {
		start: () => void run(),
		close
	};
}
//#endregion
//#region src/state/openclaw-state-db-admission.ts
function getStateSchemaFacts(database) {
	return isPostgresSqlConnection(database) ? getPostgresPhysicalFacts(database) : getAdmittedSqliteSchemaFacts(database);
}
const versionKey = {
	name: "state.schema-version",
	schemaDependent: true,
	read(value) {
		if (typeof value === "object" && value !== null && "userVersion" in value && typeof value.userVersion === "number" && "contentVersion" in value && typeof value.contentVersion === "number") return {
			userVersion: value.userVersion,
			contentVersion: value.contentVersion
		};
	}
};
/** Row-backed metadata is valid only for its admitted schema, even if replacement DDL has the same shape. */
function createStateSchemaAdmission(name, read) {
	const key = {
		name,
		schemaDependent: true,
		read(input) {
			if (typeof input !== "object" || input === null || !("value" in input) || !("admissionId" in input) || typeof input.admissionId !== "string") return;
			const value = read(input.value);
			return value === void 0 ? void 0 : {
				value,
				admissionId: input.admissionId
			};
		}
	};
	return {
		get(database) {
			if (hasPendingSqliteDatabaseSchemaMutation(database)) return;
			const admitted = getSqliteDatabaseAdmission(database, key);
			if (!admitted) return;
			const schema = getStateSchemaFacts(database);
			return admitted.admissionId === schema?.admissionId ? admitted.value : void 0;
		},
		publish(database, value) {
			if (!isPostgresSqlConnection(database) && isSqliteSchemaAdmissionCold(database)) admitSqliteSchema(database);
			const schema = getStateSchemaFacts(database);
			if (!schema || !isPostgresSqlConnection(database) && getSqliteDatabaseAdmission(database, schemaAdmission)?.admissionId !== schema.admissionId) return;
			getStateSchemaVersionAdmission(database);
			const admitted = {
				value,
				admissionId: schema.admissionId
			};
			publishSqliteDatabaseAdmission(database, key, admitted);
		}
	};
}
const runtimeAdmission = createStateSchemaAdmission("state.runtime-schema", (value) => typeof value === "object" && value !== null && "startupReady" in value && typeof value.startupReady === "boolean" ? { startupReady: value.startupReady } : void 0);
const connectionVersions = /* @__PURE__ */ new WeakMap();
function rememberConnectionVersion(database, value) {
	const previous = connectionVersions.get(database);
	const install = (entry) => {
		if (entry) connectionVersions.set(database, entry);
		else connectionVersions.delete(database);
	};
	if (!stageSqliteTransactionState(database, {
		stage: () => install(value),
		commit: () => {},
		rollback: () => install(previous)
	})) install(value);
}
function schemaVersionKey(admissionId) {
	return {
		name: `state.schema-version:${admissionId}`,
		read: versionKey.read
	};
}
function getStateSchemaVersionAdmission(database) {
	const schema = getStateSchemaFacts(database);
	if (!schema) return;
	const retained = connectionVersions.get(database);
	if (retained?.schema === schema) return retained.facts;
	const history = getSqliteDatabaseAdmission(database, schemaVersionKey(schema.admissionId));
	const currentSchema = history ? void 0 : getSqliteDatabaseAdmission(database, schemaAdmission);
	if (!history && !isPostgresSqlConnection(database) && currentSchema?.admissionId !== schema.admissionId) return;
	const facts = history ?? getSqliteDatabaseAdmission(database, versionKey);
	if (facts) {
		rememberConnectionVersion(database, {
			schema,
			facts
		});
		if (!history) publishSqliteDatabaseAdmission(database, schemaVersionKey(schema.admissionId), facts);
	}
	return facts;
}
/** A cold snapshot may discover historical facts without replacing a newer publication. */
function rememberStateSchemaVersionAdmission(database, facts) {
	const schema = getStateSchemaFacts(database);
	if (!schema) return;
	rememberConnectionVersion(database, {
		schema,
		facts
	});
	const current = getSqliteDatabaseAdmission(database, schemaAdmission);
	if (!isPostgresSqlConnection(database) && current?.admissionId !== schema.admissionId) return;
	publishSqliteDatabaseAdmission(database, schemaVersionKey(schema.admissionId), facts);
	publishSqliteDatabaseAdmission(database, versionKey, facts);
}
function publishStateSchemaVersionAdmission(database, facts) {
	publishSqliteDatabaseAdmission(database, versionKey, facts);
	const schema = getStateSchemaFacts(database);
	if (schema) {
		rememberConnectionVersion(database, {
			schema,
			facts
		});
		publishSqliteDatabaseAdmission(database, schemaVersionKey(schema.admissionId), facts);
	} else rememberConnectionVersion(database);
}
/** Runtime shape and integrity are physical-file facts, independent of live write authority. */
function getStateRuntimeSchemaAdmission(database) {
	return runtimeAdmission.get(database);
}
function publishStateRuntimeSchemaAdmission(database, startupReady) {
	runtimeAdmission.publish(database, { startupReady });
}
//#endregion
//#region src/state/openclaw-state-db-schema-version.ts
const CONTENT_VERSION_KEY = "state.schema.contentVersion";
const contentVersionQuery = createSqliteQueryCache((db) => prepareSqliteQuerySync(db, () => getNodeSqliteKysely(db).selectFrom("config_machine_state").select("value_json").where("state_key", "=", CONTENT_VERSION_KEY)));
/** Content and its marker commit together, even while older readers retain their version floor. */
function readStateSchemaContentVersion(db, published, readRow = readStateSchemaContentVersionRow) {
	if (isPostgresSqlConnection(db)) {
		const facts = getStateSchemaVersionAdmission(db);
		if (!facts) throw new Error("Missing PostgreSQL state schema admission; use the matching OpenClaw version or restore the matching PostgreSQL schema and anchor.");
		return Math.max(published ?? facts.userVersion, facts.contentVersion);
	}
	const admitted = getStateSchemaVersionAdmission(db);
	if (admitted) return Math.max(published ?? admitted.userVersion, admitted.contentVersion);
	const version = getAdmittedSqliteSchemaFacts(db)?.userVersion ?? readSqliteUserVersion(db);
	const contentVersion = parseContentVersion(tableExists(db, "config_machine_state") ? readRow(db)?.value_json : void 0);
	rememberStateSchemaVersionAdmission(db, {
		userVersion: version,
		contentVersion
	});
	return Math.max(published ?? version, contentVersion);
}
function readStateSchemaContentVersionRow(db) {
	return contentVersionQuery(db)().rows[0];
}
function parseContentVersion(valueJson) {
	if (valueJson === void 0) return 0;
	let contentVersion;
	try {
		contentVersion = valueJson === null ? null : JSON.parse(valueJson);
	} catch (cause) {
		throw new SqliteSchemaMismatchError(`Invalid shared state schema content version in ${CONTENT_VERSION_KEY}.`, { cause });
	}
	if (typeof contentVersion !== "number" || !Number.isSafeInteger(contentVersion) || contentVersion < 0) throw new SqliteSchemaMismatchError(`Invalid shared state schema content version in ${CONTENT_VERSION_KEY}.`);
	return contentVersion;
}
/** Refuse newer headers before catalog inspection, then share one physical schema capture. */
function admitStateSchemaFacts(database, pathname) {
	if (isPostgresSqlConnection(database)) {
		if (!getPostgresPhysicalFacts(database)) throw new Error("Missing PostgreSQL physical schema admission");
		return;
	}
	try {
		admitSqliteSchema(database, (userVersion) => assertSupportedStateSchemaVersion(database, pathname, {
			userVersion,
			contentVersion: userVersion
		}));
	} catch (error) {
		let version;
		try {
			version = readSqliteUserVersion(database);
		} catch {
			throw normalizeOpenClawStateSchemaReadError(error, pathname);
		}
		if (version > 22) throw createNewerSqliteSchemaVersionError("OpenClaw state database", pathname, version, 22);
		throw normalizeOpenClawStateSchemaReadError(error, pathname);
	}
}
function assertSupportedStateSchemaVersion(db, pathname, prepared, readRow) {
	if (isPostgresSqlConnection(db)) return readStateSchemaContentVersion(db);
	try {
		const userVersion = prepared?.userVersion ?? getStateSchemaVersionAdmission(db)?.userVersion ?? getAdmittedSqliteSchemaFacts(db)?.userVersion ?? readSqliteUserVersion(db);
		const contentVersion = prepared?.contentVersion ?? (userVersion > 22 ? userVersion : readStateSchemaContentVersion(db, userVersion, readRow));
		if (contentVersion > 22) throw createNewerSqliteSchemaVersionError("OpenClaw state database", pathname, contentVersion, 22);
		return userVersion;
	} catch (error) {
		throw normalizeOpenClawStateSchemaReadError(error, pathname);
	}
}
//#endregion
//#region src/state/openclaw-state-db-cache.admission.ts
/** Refresh cached-handle admission and settle failures against its exact native owner. */
function createStateDatabaseCacheAdmission(owner) {
	return {
		initialize(database) {
			const db = database.db;
			if (isPostgresSqlConnection(db)) {
				assertSupportedStateSchemaVersion(db, database.path);
				return getPostgresPhysicalFacts(db);
			}
			admitSqliteSchema(db);
			return runSqliteReadOperationSync(db, () => {
				assertSupportedStateSchemaVersion(db, database.path);
				return getAdmittedSqliteSchemaFacts(db);
			});
		},
		closeTerminalFailure(pathname, error) {
			markOpenClawStateDatabaseFailure(error, pathname);
			revokeSqliteDatabaseAdmissionsForPath(pathname);
			owner.invalidate(pathname);
			const cached = owner.cachedDatabases.get(pathname);
			const errors = [];
			try {
				if (cached) owner.evict(cached);
			} catch (cleanupError) {
				errors.push(cleanupError);
			}
			try {
				owner.notifyTerminalFailure(pathname, error);
			} catch (notificationError) {
				errors.push(notificationError);
			}
			throwSqliteLifecycleErrors(errors, "Terminal shared-state failure cleanup failed");
		},
		read(pathname, operation) {
			const database = owner.cachedDatabases.get(pathname);
			if (!database) return;
			if (!database.db.isOpen) return operation(database);
			const db = database.db;
			if (isPostgresSqlConnection(db)) {
				assertSupportedStateSchemaVersion(db, database.path);
				database.schemaFacts = getPostgresPhysicalFacts(db);
				return operation(database);
			}
			let admitted = false;
			try {
				return runSqliteReadOperationSync(db, () => {
					const facts = getAdmittedSqliteSchemaFacts(db);
					if (!facts || facts !== database.schemaFacts) {
						assertSupportedStateSchemaVersion(db, database.path);
						database.schemaFacts = facts;
					}
					admitted = true;
					return operation(database);
				});
			} catch (error) {
				if (admitted) throw error;
				const failure = error instanceof Error ? error : new Error(String(error));
				if (isSqliteCorruptionError(failure)) {
					owner.evict(database);
					return;
				}
				if (isSqliteSchemaVersionError(failure)) owner.recordSchemaFailure(database.path, failure);
				throw failure;
			}
		}
	};
}
//#endregion
//#region src/infra/sqlite-handle-lifecycle.ts
/** Idle native connections share one retention window across SQLite owners. */
const SQLITE_IDLE_HANDLE_TTL_MS = 18e5;
//#endregion
//#region src/state/openclaw-state-db-cache.idle.ts
const log = createSubsystemLogger("state/db");
/** Schedule native retirement against the canonical cache's handles and borrow pins. */
function createStateDatabaseIdleRetirement({ cachedDatabases, retainedDatabaseHandles, idleTimers, idleReferences, borrowers }, retire) {
	const touch = (database) => {
		if (!(cachedDatabases.get(database.path) === database && database.db.isOpen) && retainedDatabaseHandles.get(database.db) !== database) return;
		const previous = idleTimers.get(database.db);
		if (previous) {
			previous.refresh();
			return;
		}
		const timer = runInDetachedAsyncContext(() => setTimeout(() => {
			idleTimers.delete(database.db);
			try {
				if (database.db.isOpen && database.db.isTransaction) touch(database);
				else if (!borrowers.get(database.db)?.references.size && !idleReferences.get(database.db)?.size) retire(database, false, {
					busyTimeoutMs: 0,
					checkpointMode: "PASSIVE"
				});
			} catch (error) {
				log.warn("Idle shared-state database cleanup failed", {
					path: database.path,
					error
				});
				touch(database);
			}
		}, SQLITE_IDLE_HANDLE_TTL_MS));
		timer.unref();
		idleTimers.set(database.db, timer);
	};
	return {
		touch,
		/** Retained consumers postpone idle eviction without blocking explicit retirement. */
		retain(database) {
			if (cachedDatabases.get(database.path) !== database || !database.db.isOpen || borrowers.get(database.db)?.retiring) throw new Error("OpenClaw state database idle retention requires its current canonical handle");
			const references = idleReferences.get(database.db) ?? /* @__PURE__ */ new Set();
			const reference = {};
			references.add(reference);
			idleReferences.set(database.db, references);
			return () => {
				if (!references.delete(reference)) return;
				if (cachedDatabases.get(database.path) === database && database.db.isOpen) touch(database);
			};
		}
	};
}
//#endregion
//#region src/infra/fs-safe-env.ts
const nativeModeKey = "OPENCLAW_FS_SAFE_NATIVE_MODE";
const legacyModeKeys = ["FS_SAFE_PYTHON_MODE", "OPENCLAW_FS_SAFE_PYTHON_MODE"];
const legacyKeys = [
	...legacyModeKeys,
	"FS_SAFE_PYTHON",
	"OPENCLAW_FS_SAFE_PYTHON",
	"OPENCLAW_PINNED_PYTHON",
	"OPENCLAW_PINNED_WRITE_PYTHON"
];
const fallbacks = /* @__PURE__ */ new WeakMap();
let warned = false;
function nativeModeIsValid(value) {
	const normalized = value?.trim().toLowerCase() ?? "";
	return /^(?:0|false|off|never|1|true|on|auto|required|require)$/u.test(normalized);
}
function currentFallback(env) {
	const fallback = fallbacks.get(env);
	return fallback && env[fallback.key] === fallback.value ? fallback : void 0;
}
/** Read the operator/config inputs without promoting a derived native fallback. */
function fsSafeEnvInput(env) {
	const fallback = currentFallback(env);
	if (!fallback) return env;
	const input = {
		...env,
		[fallback.key]: fallback.previous
	};
	if (!fallback.existed) delete input[fallback.key];
	return input;
}
/** Retire our unchanged projection before an environment owner writes real inputs. */
function clearFsSafeEnvFallback(env) {
	const fallback = currentFallback(env);
	fallbacks.delete(env);
	if (!fallback) return;
	if (!fallback.existed) delete env[fallback.key];
	else env[fallback.key] = fallback.previous;
}
/** Preserve OpenClaw's retired Python mode env contract below both native names. */
function normalizeFsSafeNativeEnv(env = process.env) {
	clearFsSafeEnvFallback(env);
	const configured = legacyKeys.filter((key) => env[key] !== void 0);
	if (configured.length && env === process.env && !warned) {
		warned = true;
		process.emitWarning(`${configured.join(", ")} is deprecated. OpenClaw maps legacy mode values to native mode only when neither FS_SAFE_NATIVE_MODE nor OPENCLAW_FS_SAFE_NATIVE_MODE selects a mode. Replace Python mode variables with native mode variables; interpreter path settings are ignored.`, {
			code: "FS_SAFE_PYTHON_DEPRECATED",
			type: "DeprecationWarning"
		});
	}
	if (nativeModeIsValid(env.FS_SAFE_NATIVE_MODE) || nativeModeIsValid(env[nativeModeKey])) return;
	const value = legacyModeKeys.map((key) => env[key]).find((entry) => entry !== void 0);
	if (value === void 0) return;
	const keys = Object.keys(env);
	const key = !keys.includes(nativeModeKey) && Object.hasOwn(env, nativeModeKey) ? keys.find((candidate) => candidate.toUpperCase() === nativeModeKey) ?? nativeModeKey : nativeModeKey;
	const existed = Object.hasOwn(env, key);
	const previous = env[key];
	env[key] = value;
	fallbacks.set(env, {
		key,
		value,
		previous,
		existed
	});
}
//#endregion
//#region src/infra/env.ts
const ENV_NORMALIZATION_KEY_GROUPS = [["ZAI_API_KEY", "Z_AI_API_KEY"]];
/** Normalizes the legacy Z_AI_API_KEY spelling into the canonical ZAI_API_KEY env var. */
function normalizeZaiEnv(env = process.env) {
	if (!env.ZAI_API_KEY?.trim() && env.Z_AI_API_KEY?.trim()) env.ZAI_API_KEY = env.Z_AI_API_KEY;
}
/** Expands env keys to include aliases that process-wide normalization treats as equivalent. */
function expandEnvNormalizationKeys(keys) {
	const expanded = /* @__PURE__ */ new Set();
	for (const key of keys) for (const normalizedKey of resolveEnvNormalizationKeys(key)) expanded.add(normalizedKey);
	return expanded;
}
/** Resolves one env key to its canonical-first runtime normalization group. */
function resolveEnvNormalizationKeys(key) {
	const normalizedKey = process.platform === "win32" ? key.toUpperCase() : key;
	return ENV_NORMALIZATION_KEY_GROUPS.find((group) => group.some((candidate) => candidate === normalizedKey)) ?? [normalizedKey];
}
/** Interprets common human/operator truthy env strings. */
function isTruthyEnvValue(value) {
	return parseBooleanValue(value) === true;
}
//#endregion
//#region src/infra/host-env-security-policy.json
var host_env_security_policy_default = {
	blockedEverywhereKeys: [
		"NODE_OPTIONS",
		"NODE_PATH",
		"NODE_REDIRECT_WARNINGS",
		"NODE_REPL_EXTERNAL_MODULE",
		"NODE_REPL_HISTORY",
		"NODE_V8_COVERAGE",
		"PYTHONHOME",
		"PYTHONPATH",
		"PERL5LIB",
		"PERL5OPT",
		"RUBYLIB",
		"RUBYOPT",
		"BASHOPTS",
		"BASH_ENV",
		"ENV",
		"KSH_ENV",
		"BROWSER",
		"GIT_ALLOW_PROTOCOL",
		"GIT_EDITOR",
		"GIT_EXTERNAL_DIFF",
		"GIT_DIR",
		"GIT_WORK_TREE",
		"GIT_COMMON_DIR",
		"GIT_EXEC_PATH",
		"GIT_INDEX_FILE",
		"GIT_OBJECT_DIRECTORY",
		"GIT_ALTERNATE_OBJECT_DIRECTORIES",
		"GIT_NAMESPACE",
		"GIT_PROTOCOL_FROM_USER",
		"GIT_SEQUENCE_EDITOR",
		"GIT_TEMPLATE_DIR",
		"GIT_SSL_NO_VERIFY",
		"GIT_SSL_CAINFO",
		"GIT_SSL_CAPATH",
		"CC",
		"CPP",
		"CXX",
		"CXXCPP",
		"CARGO_BUILD_RUSTC",
		"CARGO_BUILD_RUSTC_WRAPPER",
		"CARGO_BUILD_RUSTC_WORKSPACE_WRAPPER",
		"CARGO_BUILD_RUSTDOC",
		"RUSTC",
		"RUSTC_WRAPPER",
		"RUSTC_WORKSPACE_WRAPPER",
		"RUSTDOC",
		"CMAKE_C_COMPILER",
		"CMAKE_CXX_COMPILER",
		"SHELL",
		"SHELLOPTS",
		"PS4",
		"GCONV_PATH",
		"IFS",
		"SSLKEYLOGFILE",
		"JAVA_OPTS",
		"JAVA_TOOL_OPTIONS",
		"_JAVA_OPTIONS",
		"JDK_JAVA_OPTIONS",
		"PYTHONBREAKPOINT",
		"DOTNET_STARTUP_HOOKS",
		"DOTNET_ADDITIONAL_DEPS",
		"FPATH",
		"GLIBC_TUNABLES",
		"MAVEN_OPTS",
		"MAKE",
		"MAKEFLAGS",
		"MFLAGS",
		"SBT_OPTS",
		"GRADLE_OPTS",
		"ANT_OPTS",
		"HGRCPATH",
		"HGEDITOR",
		"HGMERGE",
		"EXINIT",
		"VIMINIT",
		"MYVIMRC",
		"GVIMINIT",
		"LUA_INIT",
		"LUA_INIT_5_1",
		"LUA_INIT_5_2",
		"LUA_INIT_5_3",
		"LUA_INIT_5_4",
		"EMACSLOADPATH",
		"RUBYSHELL",
		"GIT_HOOK_PATH",
		"SVN_EDITOR",
		"SVN_SSH",
		"BZR_EDITOR",
		"BZR_SSH",
		"BZR_PLUGIN_PATH",
		"SUDO_ASKPASS",
		"JULIA_EDITOR",
		"CONFIG_SITE",
		"CONFIG_SHELL",
		"CMAKE_TOOLCHAIN_FILE",
		"CATALINA_OPTS",
		"CORECLR_PROFILER",
		"HELM_PLUGINS",
		"PACKER_PLUGIN_PATH",
		"VAGRANT_VAGRANTFILE",
		"ERL_AFLAGS",
		"ERL_FLAGS",
		"ERL_ZFLAGS",
		"ELIXIR_ERL_OPTIONS",
		"R_ENVIRON",
		"R_PROFILE",
		"R_ENVIRON_USER",
		"R_PROFILE_USER",
		"TCLLIBPATH",
		"HOSTALIASES"
	],
	blockedOverrideOnlyKeys: [
		"HOME",
		"GRADLE_USER_HOME",
		"ZDOTDIR",
		"GIT_DIR",
		"GIT_WORK_TREE",
		"GIT_COMMON_DIR",
		"GIT_INDEX_FILE",
		"GIT_OBJECT_DIRECTORY",
		"GIT_ALTERNATE_OBJECT_DIRECTORIES",
		"GIT_NAMESPACE",
		"GIT_SSH_COMMAND",
		"GIT_SSH",
		"GIT_PROXY_COMMAND",
		"GIT_ASKPASS",
		"GIT_SSL_NO_VERIFY",
		"GIT_SSL_CAINFO",
		"GIT_SSL_CAPATH",
		"SSH_ASKPASS",
		"LESSOPEN",
		"LESSCLOSE",
		"PAGER",
		"MANPAGER",
		"GIT_PAGER",
		"EDITOR",
		"VISUAL",
		"FCEDIT",
		"SUDO_EDITOR",
		"PROMPT_COMMAND",
		"HISTFILE",
		"PERL5DB",
		"PERL5DBCMD",
		"OPENSSL_CONF",
		"OPENSSL_ENGINES",
		"PYTHONSTARTUP",
		"WGETRC",
		"CURL_HOME",
		"CLASSPATH",
		"CFLAGS",
		"CGO_CFLAGS",
		"CGO_LDFLAGS",
		"GOFLAGS",
		"MAKEFLAGS",
		"MFLAGS",
		"CORECLR_PROFILER_PATH",
		"PHPRC",
		"PHP_INI_SCAN_DIR",
		"DENO_DIR",
		"BUN_CONFIG_REGISTRY",
		"YARN_RC_FILENAME",
		"HTTP_PROXY",
		"HTTPS_PROXY",
		"ALL_PROXY",
		"NO_PROXY",
		"NODE_TLS_REJECT_UNAUTHORIZED",
		"NODE_EXTRA_CA_CERTS",
		"SSL_CERT_FILE",
		"SSL_CERT_DIR",
		"REQUESTS_CA_BUNDLE",
		"CURL_CA_BUNDLE",
		"DOCKER_HOST",
		"DOCKER_TLS_VERIFY",
		"DOCKER_CERT_PATH",
		"PIP_INDEX_URL",
		"PIP_PYPI_URL",
		"PIP_EXTRA_INDEX_URL",
		"PIP_CONFIG_FILE",
		"PIP_FIND_LINKS",
		"PIP_TRUSTED_HOST",
		"UV_INDEX",
		"UV_INDEX_URL",
		"UV_PYTHON",
		"UV_EXTRA_INDEX_URL",
		"UV_DEFAULT_INDEX",
		"DOCKER_CONTEXT",
		"LIBRARY_PATH",
		"LDFLAGS",
		"CPATH",
		"C_INCLUDE_PATH",
		"CPLUS_INCLUDE_PATH",
		"OBJC_INCLUDE_PATH",
		"GOPROXY",
		"GONOSUMCHECK",
		"GONOSUMDB",
		"GONOPROXY",
		"GOPRIVATE",
		"GOENV",
		"GOPATH",
		"HGRCPATH",
		"PYTHONUSERBASE",
		"RUSTC_WRAPPER",
		"RUSTFLAGS",
		"RUSTUP_DIST_ROOT",
		"RUSTUP_DIST_SERVER",
		"RUSTUP_HOME",
		"RUSTUP_TOOLCHAIN",
		"RUSTUP_UPDATE_ROOT",
		"CARGO_HOME",
		"VIRTUAL_ENV",
		"LUA_PATH",
		"LUA_CPATH",
		"GEM_HOME",
		"GEM_PATH",
		"BUNDLE_GEMFILE",
		"COMPOSER_HOME",
		"CONDA_DEFAULT_ENV",
		"CONDA_PREFIX",
		"CARGO_BUILD_RUSTC_WRAPPER",
		"XDG_CACHE_HOME",
		"XDG_CONFIG_DIRS",
		"XDG_CONFIG_HOME",
		"XDG_DATA_DIRS",
		"XDG_DATA_HOME",
		"XDG_RUNTIME_DIR",
		"XDG_STATE_HOME",
		"AWS_CONFIG_FILE",
		"KUBECONFIG",
		"GOOGLE_APPLICATION_CREDENTIALS",
		"AWS_SHARED_CREDENTIALS_FILE",
		"AWS_WEB_IDENTITY_TOKEN_FILE",
		"AZURE_AUTH_LOCATION",
		"HELM_HOME",
		"ANSIBLE_CONFIG",
		"ANSIBLE_LIBRARY",
		"ANSIBLE_CALLBACK_PLUGINS",
		"ANSIBLE_COLLECTIONS_PATH",
		"ANSIBLE_CONNECTION_PLUGINS",
		"ANSIBLE_FILTER_PLUGINS",
		"ANSIBLE_INVENTORY_PLUGINS",
		"ANSIBLE_LOOKUP_PLUGINS",
		"ANSIBLE_MODULE_UTILS",
		"ANSIBLE_REMOTE_TEMP",
		"ANSIBLE_ROLES_PATH",
		"ANSIBLE_STRATEGY_PLUGINS",
		"R_LIBS_USER",
		"TF_CLI_CONFIG_FILE",
		"TF_PLUGIN_CACHE_DIR",
		"AMQP_URL",
		"AWS_ACCESS_KEY_ID",
		"AWS_CONTAINER_CREDENTIALS_FULL_URI",
		"AWS_CONTAINER_CREDENTIALS_RELATIVE_URI",
		"AWS_SECRET_ACCESS_KEY",
		"AWS_SECURITY_TOKEN",
		"AWS_SESSION_TOKEN",
		"AZURE_CLIENT_ID",
		"AZURE_CLIENT_SECRET",
		"DATABASE_URL",
		"GH_TOKEN",
		"GITHUB_TOKEN",
		"GITLAB_TOKEN",
		"MONGODB_URI",
		"NODE_AUTH_TOKEN",
		"NPM_TOKEN",
		"REDIS_URL",
		"SSH_AUTH_SOCK",
		"SYSTEMROOT",
		"WINDIR"
	],
	allowedInheritedOverrideOnlyKeys: [
		"ALL_PROXY",
		"AWS_CONFIG_FILE",
		"AWS_SHARED_CREDENTIALS_FILE",
		"AWS_WEB_IDENTITY_TOKEN_FILE",
		"AZURE_AUTH_LOCATION",
		"CURL_CA_BUNDLE",
		"DOCKER_CERT_PATH",
		"DOCKER_CONTEXT",
		"DOCKER_HOST",
		"DOCKER_TLS_VERIFY",
		"GIT_PAGER",
		"GOOGLE_APPLICATION_CREDENTIALS",
		"GRADLE_USER_HOME",
		"HISTFILE",
		"HOME",
		"HTTPS_PROXY",
		"HTTP_PROXY",
		"KUBECONFIG",
		"MANPAGER",
		"NODE_EXTRA_CA_CERTS",
		"NODE_TLS_REJECT_UNAUTHORIZED",
		"NO_PROXY",
		"PAGER",
		"REQUESTS_CA_BUNDLE",
		"RUSTUP_DIST_ROOT",
		"RUSTUP_DIST_SERVER",
		"RUSTUP_HOME",
		"RUSTUP_TOOLCHAIN",
		"RUSTUP_UPDATE_ROOT",
		"SSH_AUTH_SOCK",
		"SSL_CERT_DIR",
		"SSL_CERT_FILE",
		"SYSTEMROOT",
		"WINDIR",
		"XDG_CACHE_HOME",
		"XDG_CONFIG_DIRS",
		"XDG_CONFIG_HOME",
		"XDG_DATA_DIRS",
		"XDG_DATA_HOME",
		"XDG_RUNTIME_DIR",
		"XDG_STATE_HOME",
		"ZDOTDIR"
	],
	blockedOverridePrefixes: [
		"GIT_CONFIG_",
		"NPM_CONFIG_",
		"CARGO_REGISTRIES_",
		"TF_VAR_"
	],
	blockedPrefixes: [
		"DYLD_",
		"LD_",
		"BASH_FUNC_"
	]
};
//#endregion
//#region src/infra/host-env-security-policy.js
function sortUniqueUppercase(values) {
	return Object.freeze(Array.from(new Set(values.map((value) => value.toUpperCase()))).toSorted((left, right) => left < right ? -1 : left > right ? 1 : 0));
}
function derivePolicyArrays(policy) {
	const blockedEverywhereKeys = policy.blockedEverywhereKeys ?? [];
	const blockedOverrideOnlyKeys = policy.blockedOverrideOnlyKeys ?? [];
	const allowedInheritedOverrideOnlyKeys = policy.allowedInheritedOverrideOnlyKeys ?? [];
	const allowedInheritedOverrideOnlyUpper = new Set(allowedInheritedOverrideOnlyKeys.map((value) => value.toUpperCase()));
	const blockedPrefixes = policy.blockedPrefixes ?? [];
	const blockedOverridePrefixes = policy.blockedOverridePrefixes ?? [];
	const blockedInheritedPrefixes = policy.blockedInheritedPrefixes ?? blockedPrefixes;
	return {
		blockedInheritedKeys: sortUniqueUppercase([...blockedEverywhereKeys, ...blockedOverrideOnlyKeys.filter((value) => !allowedInheritedOverrideOnlyUpper.has(value.toUpperCase()))]),
		blockedInheritedPrefixes: sortUniqueUppercase(blockedInheritedPrefixes),
		blockedKeys: sortUniqueUppercase(blockedEverywhereKeys),
		blockedOverrideKeys: sortUniqueUppercase(blockedOverrideOnlyKeys),
		blockedPrefixes: sortUniqueUppercase(blockedPrefixes),
		blockedOverridePrefixes: sortUniqueUppercase(blockedOverridePrefixes)
	};
}
/**
* Normalizes raw host environment policy JSON into immutable lookup arrays.
*/
function loadHostEnvSecurityPolicy(rawPolicy = host_env_security_policy_default) {
	const derived = derivePolicyArrays(rawPolicy);
	return Object.freeze({
		blockedEverywhereKeys: Object.freeze(rawPolicy.blockedEverywhereKeys ?? []),
		blockedOverrideOnlyKeys: Object.freeze(rawPolicy.blockedOverrideOnlyKeys ?? []),
		allowedInheritedOverrideOnlyKeys: Object.freeze(rawPolicy.allowedInheritedOverrideOnlyKeys ?? []),
		blockedInheritedKeys: derived.blockedInheritedKeys,
		blockedInheritedPrefixes: derived.blockedInheritedPrefixes,
		blockedPrefixes: derived.blockedPrefixes,
		blockedOverridePrefixes: derived.blockedOverridePrefixes,
		blockedKeys: derived.blockedKeys,
		blockedOverrideKeys: derived.blockedOverrideKeys
	});
}
/**
* Process-wide host environment security policy derived from generated JSON.
*/
const HOST_ENV_SECURITY_POLICY = loadHostEnvSecurityPolicy();
//#endregion
//#region src/infra/host-env-security.ts
const PORTABLE_ENV_VAR_KEY = /^[A-Za-z_][A-Za-z0-9_]*$/;
const HOST_DANGEROUS_ENV_KEYS = new Set(HOST_ENV_SECURITY_POLICY.blockedKeys);
new Set(HOST_ENV_SECURITY_POLICY.blockedInheritedKeys);
const HOST_DANGEROUS_OVERRIDE_ENV_KEYS = new Set(HOST_ENV_SECURITY_POLICY.blockedOverrideKeys);
[...Object.keys(resolveNodeServiceIdentityEnvironment())];
const CARGO_TARGET_EXECUTABLE_OVERRIDE_ENV_KEY = /^CARGO_TARGET_[A-Z0-9_]+_(?:LINKER|RUNNER)$/;
new AsyncLocalStorage();
function normalizeEnvVarKey(rawKey, options) {
	const key = rawKey.trim();
	if (!key) return null;
	if (options?.portable && !PORTABLE_ENV_VAR_KEY.test(key)) return null;
	return key;
}
function isDangerousHostEnvVarName(rawKey) {
	const upper = normalizeEnvVarKey(rawKey)?.toUpperCase();
	return upper !== void 0 && (HOST_DANGEROUS_ENV_KEYS.has(upper) || HOST_ENV_SECURITY_POLICY.blockedPrefixes.some((prefix) => upper.startsWith(prefix)));
}
function isDangerousHostEnvOverrideVarName(rawKey) {
	const upper = normalizeEnvVarKey(rawKey)?.toUpperCase();
	return upper !== void 0 && (HOST_DANGEROUS_OVERRIDE_ENV_KEYS.has(upper) || CARGO_TARGET_EXECUTABLE_OVERRIDE_ENV_KEY.test(upper) || HOST_ENV_SECURITY_POLICY.blockedOverridePrefixes.some((prefix) => upper.startsWith(prefix)));
}
//#endregion
//#region src/config/config-env-values.ts
/** Returns whether a config-controlled environment entry is safe to apply at runtime. */
function isConfigRuntimeEnvVarAllowed(key, value) {
	const upperKey = key.toUpperCase();
	return Boolean(value.trim()) && upperKey !== "OPENCLAW_ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS" && upperKey !== "OPENCLAW_INCLUDE_ROOTS" && upperKey !== "OPENCLAW_CONFIG_READONLY" && !isDangerousHostEnvVarName(key) && !isDangerousHostEnvOverrideVarName(key) && !containsEnvVarReference(value);
}
/** Collects config env vars safe to inject into runtime process environments. */
function collectConfigRuntimeEnvVars(cfg) {
	const envConfig = cfg?.env;
	if (!envConfig) return {};
	const entries = {};
	const candidates = [...Object.entries(envConfig.vars ?? {}), ...Object.entries(envConfig).filter(([key]) => key !== "shellEnv" && key !== "vars")];
	for (const [rawKey, value] of candidates) {
		if (typeof value !== "string") continue;
		const key = normalizeEnvVarKey(rawKey, { portable: true });
		if (key && isConfigRuntimeEnvVarAllowed(key, value)) entries[key] = value;
	}
	return entries;
}
function findCaseInsensitiveEnvKey(env, key) {
	if (Object.hasOwn(env, key)) return key;
	const upperKey = key.toUpperCase();
	return Object.keys(env).find((candidate) => candidate.toUpperCase() === upperKey);
}
function envSnapshotKey(key) {
	return process.platform === "win32" ? key.toUpperCase() : key;
}
function indexConfigRuntimeEnvValues(entries) {
	const allowedValues = /* @__PURE__ */ new Map();
	for (const [key, value] of Object.entries(entries)) for (const normalizedKey of resolveEnvNormalizationKeys(key)) {
		const values = allowedValues.get(normalizedKey) ?? /* @__PURE__ */ new Set();
		values.add(value);
		allowedValues.set(normalizedKey, values);
	}
	return allowedValues;
}
//#endregion
//#region src/config/config-env-vars.ts
const appliedConfigEnvOwnership = /* @__PURE__ */ new WeakMap();
function resolveAppliedConfigEnvOwnership(env) {
	return {
		...appliedConfigEnvOwnership.get(env),
		...env === process.env ? publishedConfigRuntimeEnvState.ownedEnv : {}
	};
}
new AsyncLocalStorage();
function cloneEnvWithPlatformSemantics(env) {
	let cloned = { ...fsSafeEnvInput(env) };
	if (process.platform === "win32") cloned = new Proxy(cloned, {
		deleteProperty(target, property) {
			if (typeof property !== "string") return Reflect.deleteProperty(target, property);
			const key = findCaseInsensitiveEnvKey(target, property);
			return key ? Reflect.deleteProperty(target, key) : true;
		},
		get(target, property, receiver) {
			if (typeof property !== "string") return Reflect.get(target, property, receiver);
			const key = findCaseInsensitiveEnvKey(target, property);
			return key ? target[key] : Reflect.get(target, property, receiver);
		},
		getOwnPropertyDescriptor(target, property) {
			if (typeof property !== "string") return Reflect.getOwnPropertyDescriptor(target, property);
			const key = findCaseInsensitiveEnvKey(target, property);
			if (!key) return;
			return {
				configurable: true,
				enumerable: true,
				value: target[key],
				writable: true
			};
		},
		has(target, property) {
			return typeof property === "string" ? findCaseInsensitiveEnvKey(target, property) !== void 0 : Reflect.has(target, property);
		},
		set(target, property, value) {
			if (typeof property !== "string") return Reflect.set(target, property, value);
			target[findCaseInsensitiveEnvKey(target, property) ?? property] = value;
			return true;
		}
	});
	appliedConfigEnvOwnership.set(cloned, resolveAppliedConfigEnvOwnership(env));
	normalizeFsSafeNativeEnv(cloned);
	return cloned;
}
let publishedConfigRuntimeEnvState = {
	generation: 0,
	ownedEnv: {},
	sourceConfig: null
};
function collectConfigRuntimeEnvOwnership(sourceConfig, before, after, options = {}) {
	const beforeInput = fsSafeEnvInput(before);
	const afterInput = fsSafeEnvInput(after);
	const ownedEnv = {};
	const replacedLowerPrecedenceKeys = new Set((options.replacedLowerPrecedenceKeys ?? []).map(envSnapshotKey));
	for (const [key, value] of Object.entries(collectConfigRuntimeEnvVars(sourceConfig))) for (const normalizedKey of resolveEnvNormalizationKeys(key)) {
		const afterKey = findCaseInsensitiveEnvKey(afterInput, normalizedKey);
		if (!afterKey || afterInput[afterKey] !== value) continue;
		const beforeKey = findCaseInsensitiveEnvKey(beforeInput, normalizedKey);
		if (beforeKey && beforeInput[beforeKey] === value && !replacedLowerPrecedenceKeys.has(envSnapshotKey(afterKey))) continue;
		ownedEnv[afterKey] = value;
	}
	return ownedEnv;
}
function filterConfigRuntimeEnvOwnership(sourceConfig, env, ownedEnv) {
	const input = fsSafeEnvInput(env);
	const allowedValues = indexConfigRuntimeEnvValues(collectConfigRuntimeEnvVars(sourceConfig));
	const filtered = {};
	for (const [key, value] of Object.entries(ownedEnv)) {
		const normalizedKey = resolveEnvNormalizationKeys(key)[0] ?? key;
		const actualKey = findCaseInsensitiveEnvKey(input, key);
		if (actualKey && input[actualKey] === value && allowedValues.get(normalizedKey)?.has(value)) filtered[actualKey] = value;
	}
	return filtered;
}
/** Applies config env vars to an environment without overwriting existing non-empty values. */
function applyConfigEnvVars(cfg, env = process.env, options = {}) {
	clearFsSafeEnvFallback(env);
	const before = { ...env };
	const previousOwnedEnv = resolveAppliedConfigEnvOwnership(env);
	const entries = collectConfigRuntimeEnvVars(cfg);
	const lowerPrecedenceEntries = Object.entries(options.lowerPrecedenceEnv ?? {});
	const lowerPrecedenceEnv = new Map(lowerPrecedenceEntries.map(([key, value]) => [envSnapshotKey(key), value]));
	const configEnvKeys = expandEnvNormalizationKeys(Object.keys(entries));
	const configValuesByKey = indexConfigRuntimeEnvValues(entries);
	const higherPrecedenceValues = /* @__PURE__ */ new Map();
	for (const key of Object.keys(entries)) {
		const normalizedKeys = resolveEnvNormalizationKeys(key);
		const winningValue = normalizedKeys.map((normalizedKey) => [normalizedKey, env[normalizedKey]]).find(([normalizedKey, currentValue]) => currentValue?.trim() && lowerPrecedenceEnv.get(normalizedKey) !== currentValue && !configValuesByKey.get(normalizedKey)?.has(currentValue))?.[1];
		if (winningValue !== void 0) for (const normalizedKey of normalizedKeys) higherPrecedenceValues.set(normalizedKey, winningValue);
	}
	const replacedLowerPrecedenceKeys = [];
	for (const [key, value] of lowerPrecedenceEntries) if (configEnvKeys.has(envSnapshotKey(key)) && env[key] === value) {
		delete env[key];
		replacedLowerPrecedenceKeys.push(key);
	}
	if (replacedLowerPrecedenceKeys.length > 0) options.onLowerPrecedenceKeysReplaced?.(replacedLowerPrecedenceKeys);
	for (const [key, value] of Object.entries(entries)) {
		const higherPrecedenceValue = higherPrecedenceValues.get(envSnapshotKey(key));
		if (higherPrecedenceValue !== void 0) {
			env[key] = higherPrecedenceValue;
			continue;
		}
		const currentValue = env[key];
		if (currentValue?.trim() && lowerPrecedenceEnv.get(envSnapshotKey(key)) !== currentValue) continue;
		env[key] = value;
	}
	normalizeZaiEnv(env);
	appliedConfigEnvOwnership.set(env, {
		...filterConfigRuntimeEnvOwnership(cfg, env, previousOwnedEnv),
		...collectConfigRuntimeEnvOwnership(cfg, before, env, { replacedLowerPrecedenceKeys })
	});
	normalizeFsSafeNativeEnv(env);
}
//#endregion
//#region src/infra/gateway-supervision.ts
const GATEWAY_SUPERVISOR_MODE_ENV = "OPENCLAW_SUPERVISOR_MODE";
function isGatewayExternallySupervised(env = process.env) {
	return env[GATEWAY_SUPERVISOR_MODE_ENV]?.trim().toLowerCase() === "external";
}
//#endregion
//#region src/state/openclaw-state-worker-context.capture.ts
/** Capture read authority without constructing a worker environment. */
function captureOpenClawStateReadContextWithAdmission(pathname, captureAdmission) {
	const schema = captureOpenClawStateSchemaReadAdmission(pathname);
	const capturedAdmission = captureAdmission(pathname);
	const integrity = capturedAdmission.captureIntegrity?.();
	const assertPublicationCurrent = capturedAdmission.assertCurrent;
	let admission = capturedAdmission;
	let runInCapturedSchemaScope;
	if (schema) {
		const inCapturedScope = AsyncLocalStorage.snapshot();
		admission = {
			databasePath: capturedAdmission.databasePath,
			coordinationKey: capturedAdmission.coordinationKey,
			get identity() {
				return capturedAdmission.identity;
			},
			captureIntegrity: capturedAdmission.captureIntegrity,
			assertCurrent() {
				capturedAdmission.assertCurrent();
				schema.assertCurrent();
			}
		};
		runInCapturedSchemaScope = (operation) => inCapturedScope(() => {
			admission.assertCurrent();
			return operation();
		});
	}
	return {
		maintenanceScope: getOpenClawDatabaseMaintenanceScope(),
		admission,
		assertPublicationCurrent,
		existingSchemaPath: schema?.path,
		stateIntegrity: integrity,
		runInCapturedSchemaScope,
		artifactPreservingReads: isArtifactPreservingStateRead("agent", pathname) || void 0
	};
}
/** Read-only workers need resolved runtime facts, not the initialization environment. */
function captureOpenClawStateReadWorkerContextWithAdmission(options, captureAdmission) {
	const source = options.env ?? process.env;
	const env = process.platform === "win32" ? cloneEnvWithPlatformSemantics(source) : source;
	const environment = {
		OPENCLAW_STATE_DIR: resolveStateDir(env),
		...isGatewayExternallySupervised(env) ? { OPENCLAW_SUPERVISOR_MODE: "external" } : {}
	};
	return {
		...captureOpenClawStateReadContextWithAdmission(options.path ?? resolveOpenClawStateSqlitePath(environment), captureAdmission),
		environment
	};
}
/** Capture host facts before asynchronous work, without opening SQLite. */
function captureOpenClawStateWorkerContextWithAdmission(options, captureAdmission) {
	const context = captureOpenClawStateReadWorkerContextWithAdmission(options, captureAdmission);
	return {
		...context,
		initializationEnvironment: mergeProcessEnv([
			options.env ?? process.env,
			{
				OPENCLAW_STATE_DIR: void 0,
				OPENCLAW_SUPERVISOR_MODE: void 0
			},
			context.environment
		]),
		...options.initializationAgentPaths ? { initializationAgentPaths: options.initializationAgentPaths.map((agentPath) => path.resolve(agentPath)) } : {}
	};
}
//#endregion
//#region src/state/openclaw-state-db-cache.wal.ts
/** Bind periodic maintenance and its observations to the cache's exact native owner. */
function createStateDatabaseWalOwner({ cachedDatabases, retainedDatabaseHandles, databaseIdentities, asyncResources }, retainForIdle, requireIdentity) {
	return {
		ownRetirement(database, close) {
			const identity = requireIdentity(database);
			const resource = { async close(selected) {
				if (!selected || selected.key === identity.key) await close();
			} };
			const unregister = asyncResources.register(resource);
			getOpenClawDatabaseMaintenanceResourceScope(database.db)?.own(resource, "shared-references", () => resource.close());
			return unregister;
		},
		async stop(pathname, identity) {
			const databases = /* @__PURE__ */ new Set([...retainedDatabaseHandles.values(), ...cachedDatabases.values()]);
			await Promise.all([...databases].filter((database) => pathname === void 0 || database.path === pathname || identity !== void 0 && databaseIdentities.get(database.db)?.key === identity.key).flatMap(({ walMaintenance }) => walMaintenance ? [walMaintenance.stop()] : []));
		},
		register(database, identity, admission, env) {
			if (!isMainThread || isPostgresSqlConnection(database.db)) return;
			const capturedContext = captureOpenClawStateWorkerContextWithAdmission({
				path: database.path,
				env
			}, () => admission);
			const controller = new AbortController();
			let pending;
			const cancel = () => {
				controller.abort();
				if (!pending) {
					unregister();
					return;
				}
				return pending.then(() => void 0, () => void 0);
			};
			const unregister = asyncResources.register({ async close(selected) {
				if (selected && selected.key !== identity.key) return;
				cancel();
				await database.walMaintenance.stop();
				unregister();
			} });
			const run = async (request) => {
				const maintenanceScope = getOpenClawDatabaseMaintenanceResourceScope(database.db);
				const context = {
					...capturedContext,
					maintenanceScope
				};
				const assertCurrent = () => {
					controller.signal.throwIfAborted();
					context.admission.assertCurrent();
					maintenanceScope?.assertAdmission();
					if (getOpenClawDatabaseMaintenanceResourceScope(database.db) !== maintenanceScope || cachedDatabases.get(database.path) !== database || !database.db.isOpen) throw new StateDatabaseReadAdmissionInvalidatedError("Shared-state WAL maintenance owner changed");
					assertExistingDatabaseIdentity(database.path, identity.key, identity.birthtime);
				};
				let releaseIdle;
				let operationStarted = false;
				try {
					assertCurrent();
					releaseIdle = retainForIdle(database);
					const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-read-openclaw-state-worker-store-CiPw7-m3.mjs").then((n) => n.n);
					assertCurrent();
					return await runOpenClawStateWorkerOperation(context, (worker) => worker.execute({
						type: "database.walMaintenance",
						input: request
					}, { signal: controller.signal }), {
						existingOnly: true,
						assertCurrent,
						createAdmission: () => ({
							nativeLocations: [database.path, identity.canonicalPath],
							admission: createSqliteWorkerOperationAdmission((_request, grant) => {
								assertCurrent();
								if (!grant()) throw new StateDatabaseReadAdmissionInvalidatedError("Shared-state WAL maintenance authority expired");
								operationStarted = true;
							})
						})
					});
				} catch (error) {
					if (!operationStarted && (isStateDatabaseReadAdmissionInvalidatedError(error) || controller.signal.aborted && isAbortError(error))) return;
					throw error;
				} finally {
					releaseIdle?.();
				}
			};
			registerSqliteWalWorkerMaintenance(database.db, (operation) => {
				if (controller.signal.aborted) return Promise.resolve(void 0);
				const active = run(operation);
				pending = active;
				return active.finally(() => {
					if (pending === active) pending = void 0;
					if (controller.signal.aborted) unregister();
				});
			}, cancel);
		},
		/** Report the last observation without opening or querying SQLite. */
		readHealth() {
			const database = cachedDatabases.get(path.resolve(resolveOpenClawStateSqlitePath()));
			return database?.db.isOpen ? database.walMaintenance.health : void 0;
		}
	};
}
//#endregion
//#region src/state/openclaw-state-db-integrity-admission.ts
const bindings = resolveGlobalSingleton(Symbol.for("openclaw.stateIntegrityBindings"), () => /* @__PURE__ */ new WeakMap());
const integrityKey = {
	name: "state.integrity",
	read: (value) => value === true ? true : void 0
};
function hasStateDatabaseIntegrityAdmission(database) {
	return Boolean(getStateRuntimeSchemaAdmission(database) || getSqliteDatabaseAdmission(database, integrityKey));
}
/** Ordinary opens share physical-file proof; Doctor calls the uncached integrity owner. */
function assertStateDatabaseIntegrityOnce(database, pathname) {
	if (!hasStateDatabaseIntegrityAdmission(database)) {
		assertSqliteIntegrity(database, pathname);
		publishSqliteDatabaseAdmission(database, integrityKey, true);
	}
}
function invalidate(revision) {
	let previous = Atomics.load(revision, 0);
	while (previous >= 0n) {
		const observed = Atomics.compareExchange(revision, 0, previous, previous + 1n);
		if (observed === previous) return;
		previous = observed;
	}
}
/** Corruption observed in an isolate revokes the exact host proof borrowed by its native handle. */
function invalidateOpenClawStateRuntimeIntegrity(database) {
	revokeSqliteDatabaseAdmissions(database);
	const bound = bindings.get(database);
	if (bound) {
		invalidate(new BigInt64Array(bound.revision));
		invalidate(new BigInt64Array(bound.lifetimeRevision));
	}
}
/** Native bindings revoke borrowed proof; the host generation alone owns its lifetime. */
function bind(database, admission) {
	if (bindings.get(database)?.revision === admission.revision) return;
	bindings.get(database)?.release();
	const revision = new BigInt64Array(admission.revision);
	const unobserve = registerSqliteSchemaMutationListener(database, () => invalidate(revision));
	const release = () => {
		unobserve();
		unregister();
	};
	const unregister = registerNodeSqliteDisposeCallback(database, (reason) => {
		if (reason === "replace") {
			invalidate(revision);
			invalidate(new BigInt64Array(admission.lifetime.revision));
		}
		release();
	});
	bindings.set(database, {
		revision: admission.revision,
		lifetimeRevision: admission.lifetime.revision,
		release
	});
}
/** Reuse only completed integrity proof; shape and mutable metadata retain their admission owners. */
function assertOpenClawStateRuntimeIntegrity(database, pathname, schema, admission, policy = "verify") {
	const identity = admission && readTrackedStateDatabaseIdentity(database);
	if (!admission || !identity || !identity.key.startsWith("file:") || identity.key !== admission.identity.key || identity.birthtime !== admission.identity.birthtime) {
		if (policy === "require-proof") throw new Error("Shared-state reader requires current worker integrity proof");
		assertStateDatabaseIntegrityOnce(database, pathname);
		return;
	}
	bind(database, admission);
	const revision = new BigInt64Array(admission.revision);
	const proof = new BigInt64Array(admission.proof);
	const metadata = BigInt.asIntN(64, BigInt(schema.userVersion >>> 0) << 32n | BigInt(schema.schemaVersion >>> 0));
	const observed = Atomics.load(proof, 0);
	if (Atomics.load(revision, 0) === admission.epoch && observed !== -1n) {
		if (observed === metadata && Atomics.load(revision, 0) === admission.epoch && hasStateDatabaseIntegrityAdmission(database)) return;
		invalidate(revision);
	}
	if (policy === "require-proof") throw new Error("Shared-state reader requires current worker integrity proof");
	assertStateDatabaseIntegrityOnce(database, pathname);
	const publish = () => {
		if (Atomics.load(revision, 0) === admission.epoch) Atomics.store(proof, 0, metadata);
	};
	return () => {
		if (database.isTransaction) stageSqliteTransactionState(database, {
			stage() {},
			rollback() {},
			commit: publish
		});
		else publish();
	};
}
//#endregion
//#region src/state/openclaw-state-db-snapshot-owner.ts
function createOpenClawStateSnapshotOwnerRegistry() {
	const releases = /* @__PURE__ */ new WeakMap();
	return {
		register(database, getCurrent) {
			if (isPostgresSqlConnection(database.db)) return;
			releases.set(database.db, registerLiveSqliteSnapshotOwner({
				database: database.db,
				databasePath: database.path,
				owner: "openclaw-state",
				assertCurrent: () => {
					if (getCurrent() !== database || !database.db.isOpen) throw new Error("OpenClaw state snapshot owner is no longer current");
				}
			}));
		},
		release(database) {
			if (isPostgresSqlConnection(database)) return;
			releases.get(database)?.();
			releases.delete(database);
		}
	};
}
const openClawStateSnapshotOwners = resolveGlobalSingleton(Symbol.for("openclaw.stateSnapshotOwners"), createOpenClawStateSnapshotOwnerRegistry);
//#endregion
//#region src/state/openclaw-state-db-cache.ts
var openclaw_state_db_cache_exports = /* @__PURE__ */ __exportAll({
	assertPublishedOpenClawStateDatabaseLifecycle: () => assertPublishedOpenClawStateDatabaseLifecycle,
	borrowOpenClawStateDatabaseForAsyncRead: () => borrowOpenClawStateDatabaseForAsyncRead,
	captureOpenClawStateDatabaseReadAdmission: () => captureOpenClawStateDatabaseReadAdmission,
	captureOpenClawStateIntegrityAdmission: () => captureOpenClawStateIntegrityAdmission,
	clearOpenClawStateDatabaseOpenFailure: () => clearOpenClawStateDatabaseOpenFailure,
	closeOpenClawStateDatabase: () => closeOpenClawStateDatabase,
	closeOpenClawStateDatabaseAsync: () => closeOpenClawStateDatabaseAsync,
	closeOpenClawStateDatabaseByPath: () => closeOpenClawStateDatabaseByPath,
	closeOpenClawStateDatabaseByPathAsync: () => closeOpenClawStateDatabaseByPathAsync,
	closeOpenClawStateDatabaseForTest: () => closeOpenClawStateDatabaseForTest,
	confirmCachedOpenClawStateDatabaseIntegrity: () => confirmCachedOpenClawStateDatabaseIntegrity,
	getOpenClawStateDatabaseTerminalFailureAsync: () => getOpenClawStateDatabaseTerminalFailureAsync,
	isOpenClawStateDatabaseOpen: () => isOpenClawStateDatabaseOpen,
	openClawStateDatabaseCache: () => openClawStateDatabaseCache,
	publishOpenClawStateDatabaseWorkerAdmission: () => publishOpenClawStateDatabaseWorkerAdmission,
	recordOpenClawStateDatabaseOpenFailure: () => recordOpenClawStateDatabaseOpenFailure,
	registerOpenClawStateDatabaseAsyncResource: () => registerOpenClawStateDatabaseAsyncResource,
	registerOpenClawStateDatabaseLifecycleListener: () => registerOpenClawStateDatabaseLifecycleListener,
	requireOpenClawStateDatabaseIdentity: () => requireOpenClawStateDatabaseIdentity,
	retainOpenClawStateDatabaseForIdle: () => retainOpenClawStateDatabaseForIdle,
	retainOpenClawStateDatabaseForIndependentRead: () => retainOpenClawStateDatabaseForIndependentRead
});
const STATE_DATABASE_LIFECYCLE_KEY = Symbol.for("openclaw.stateDatabaseLifecycle");
const stateDatabaseLifecycle = resolveGlobalSingleton(STATE_DATABASE_LIFECYCLE_KEY, () => ({
	cachedDatabases: /* @__PURE__ */ new Map(),
	retainedDatabaseHandles: /* @__PURE__ */ new Map(),
	idleTimers: /* @__PURE__ */ new WeakMap(),
	idleReferences: /* @__PURE__ */ new WeakMap(),
	unregisterRetainedExitClose: void 0,
	databaseIdentities: /* @__PURE__ */ new WeakMap(),
	borrowers: /* @__PURE__ */ new WeakMap(),
	databaseLifecycleListeners: /* @__PURE__ */ new Set(),
	terminalOpenLatch: createSqliteTerminalOpenLatch({ closeByPath: (pathname, error) => cacheAdmission.closeTerminalFailure(pathname, error) }),
	asyncResources: createOpenClawStateDatabaseAsyncLifecycle()
}), () => closeOpenClawStateDatabaseAsync(), "shared-state");
const { cachedDatabases, retainedDatabaseHandles, idleTimers, idleReferences, databaseIdentities, borrowers, databaseLifecycleListeners, terminalOpenLatch, asyncResources } = stateDatabaseLifecycle;
const { touch: touchStateDatabase, retain: retainOpenClawStateDatabaseForIdle } = createStateDatabaseIdleRetirement(stateDatabaseLifecycle, retireOpenClawStateDatabaseHandle);
const { register: registerStateDatabaseWalAdmission, readHealth: readOpenClawStateWalHealth, ownRetirement: ownStateDatabaseRetirement, stop: stopOpenClawStateDatabaseMaintenance } = createStateDatabaseWalOwner(stateDatabaseLifecycle, retainOpenClawStateDatabaseForIdle, requireOpenClawStateDatabaseIdentity);
function notifyOpenClawStateDatabaseLifecycle(event) {
	const notification = event.kind === "open-error" ? {
		...event,
		identity: event.identity ?? asyncResources.knownIdentity(event.path)
	} : event;
	for (const listener of databaseLifecycleListeners) listener(notification);
}
function notifyOpenClawStateDatabaseClosed(database) {
	notifyOpenClawStateDatabaseLifecycle({
		kind: "closed",
		path: database.path,
		identity: requireOpenClawStateDatabaseIdentity(database)
	});
}
function requireOpenClawStateDatabaseIdentity(database) {
	const identity = databaseIdentities.get(database.db);
	if (!identity) throw new Error("Published shared-state owner has no recorded database identity");
	return identity;
}
const cacheAdmission = createStateDatabaseCacheAdmission({
	cachedDatabases,
	evict: evictCachedOpenClawStateDatabase,
	invalidate: (pathname) => asyncResources.invalidate(pathname),
	notifyTerminalFailure: (pathname, error) => notifyOpenClawStateDatabaseLifecycle({
		kind: "terminal-failure",
		path: pathname,
		error,
		identity: asyncResources.knownIdentity(pathname)
	}),
	recordSchemaFailure: (pathname, error) => {
		terminalOpenLatch.record(pathname, error);
		notifyOpenClawStateDatabaseLifecycle({
			kind: "open-error",
			path: pathname,
			error
		});
	}
});
function registerOpenClawStateDatabaseLifecycleListener(listener) {
	databaseLifecycleListeners.add(listener);
	for (const database of cachedDatabases.values()) if (database.db.isOpen) listener({
		kind: "opened",
		database,
		identity: requireOpenClawStateDatabaseIdentity(database)
	});
	return () => databaseLifecycleListeners.delete(listener);
}
function retainStateDatabaseClose(database) {
	retainedDatabaseHandles.set(database.db, database);
	stateDatabaseLifecycle.unregisterRetainedExitClose ??= registerSqliteCacheExitClose(closeOpenClawStateDatabase);
}
function ownMaintenanceStateDatabaseHandle(database) {
	getOpenClawDatabaseMaintenanceScope()?.own(database.db, "shared-handles", async () => {
		const closingScope = getOpenClawDatabaseMaintenanceScope();
		if (!closingScope || !isOpenClawDatabaseMaintenanceResourceOwned(database.db, closingScope)) return;
		if (cachedDatabases.get(database.path) === database || retainedDatabaseHandles.get(database.db) === database) {
			await database.walMaintenance?.stop();
			if (isOpenClawDatabaseMaintenanceResourceOwned(database.db, closingScope) && (cachedDatabases.get(database.path) === database || retainedDatabaseHandles.get(database.db) === database)) retireOpenClawStateDatabaseHandle(database, false);
		}
	});
}
function closeUnpublishedOpenClawStateDatabaseHandle(database) {
	const errors = closeOpenClawStateDatabaseHandle(database);
	if (retainedDatabaseHandles.get(database.db) === database) ownMaintenanceStateDatabaseHandle(database);
	return errors;
}
/** Retain one exact canonical native owner; only the final reference retires its handle. */
const { retain: retainOpenClawStateDatabase, borrowForRead: borrowOpenClawStateDatabaseForAsyncRead, retainForIndependentRead: retainOpenClawStateDatabaseForIndependentRead } = createStateDatabaseRetainer(stateDatabaseLifecycle, {
	assertOpen(pathname, ownership) {
		assertOpenClawStateDatabaseOpenAllowed(pathname, ownership);
		assertExistingOpenClawStateSchemaCacheAdmission(pathname, stateDatabaseLifecycle);
	},
	capture: (pathname) => asyncResources.capture(pathname),
	retire: retireOpenClawStateDatabaseHandle,
	retainFailed: retainStateDatabaseClose,
	ownRetirement: ownStateDatabaseRetirement,
	touch: touchStateDatabase
});
/** Close both physical-handle owners while retaining every cleanup failure. */
function closeOpenClawStateDatabaseHandle(database, options) {
	clearTimeout(idleTimers.get(database.db));
	idleTimers.delete(database.db);
	try {
		assertStateDatabaseBorrowersReleased(borrowers.get(database.db), database.path);
	} catch (error) {
		const owner = borrowers.get(database.db);
		if (owner) {
			owner.retiring = true;
			owner.retirement = {
				ordinary: true,
				isCurrent: () => true,
				retire: () => {
					throwSqliteLifecycleErrors(closeOpenClawStateDatabaseHandle(database, options), `OpenClaw state database cleanup failed for ${database.path}.`);
					owner.cleanupComplete = true;
					borrowers.delete(database.db);
				}
			};
		}
		retainStateDatabaseClose(database);
		return [error];
	}
	idleReferences.delete(database.db);
	openClawStateSnapshotOwners.release(database.db);
	const { errors, cleanupPending } = closeStateDatabaseHandle(database, options);
	if (database.db.isOpen || cleanupPending) retainStateDatabaseClose(database);
	else retainedDatabaseHandles.delete(database.db);
	if (cachedDatabases.get(database.path)?.db === database.db) cachedDatabases.delete(database.path);
	if (retainedDatabaseHandles.size === 0) {
		stateDatabaseLifecycle.unregisterRetainedExitClose?.();
		stateDatabaseLifecycle.unregisterRetainedExitClose = void 0;
	}
	return errors;
}
function evictCachedOpenClawStateDatabase(database) {
	if (!isPostgresSqlConnection(database.db)) invalidateOpenClawStateRuntimeIntegrity(database.db);
	if (cachedDatabases.get(database.path) !== database) return false;
	asyncResources.invalidate(database.path);
	cachedDatabases.delete(database.path);
	notifyOpenClawStateDatabaseClosed(database);
	closeOpenClawStateDatabaseHandle(database, { checkpointMode: "PASSIVE" });
	return true;
}
/** Evict an exact cached shared-state owner after a proven corruption read. */
function evictOpenClawStateDatabaseAfterCorruption(database, error) {
	return isSqliteCorruptionError(error) && evictCachedOpenClawStateDatabase(database);
}
/** Publish a fully opened handle and bind query corruption to its exact cache owner. */
function publishOpenClawStateDatabase(database, env) {
	const { db, path: pathname } = database;
	const schemaFacts = cacheAdmission.initialize(database);
	const { identity, admission } = asyncResources.publish(pathname);
	databaseIdentities.set(db, readTrackedStateDatabaseIdentity(db) ?? identity);
	cachedDatabases.set(pathname, Object.assign(database, { schemaFacts }));
	registerStateDatabaseWalAdmission(database, identity, admission, env);
	touchStateDatabase(database);
	openClawStateSnapshotOwners.register(database, () => cachedDatabases.get(pathname));
	ownMaintenanceStateDatabaseHandle(database);
	notifyOpenClawStateDatabaseLifecycle({
		kind: "opened",
		database,
		identity
	});
	if (!isPostgresSqlConnection(db)) registerNodeSqliteKyselyQueryErrorHandler(db, (error) => {
		if (!db.isTransaction && isSqliteCorruptionError(error)) evictCachedOpenClawStateDatabase(database);
	});
	terminalOpenLatch.clear(pathname);
	return database;
}
function getCachedOpenClawStateDatabase(pathname, options) {
	return withCachedOpenClawStateDatabase(pathname, options, (database) => database);
}
/** Keep the admitted revision live while a synchronous reader consumes its row facts. */
function withCachedOpenClawStateDatabase(pathname, options, operation) {
	const resolvedPath = resolveDatabasePath({ path: pathname });
	const maintenance = getOpenClawDatabaseMaintenanceScope();
	if (options?.readOnly) maintenance?.assertReadAdmission();
	else maintenance?.assertAdmission();
	assertExistingOpenClawStateSchemaCacheAdmission(resolvedPath, stateDatabaseLifecycle);
	const runtimeFailure = terminalOpenLatch.get(resolvedPath);
	if (runtimeFailure) throw runtimeFailure;
	return cacheAdmission.read(resolvedPath, (database) => {
		if (borrowers.get(database.db)?.retiring) throw new Error(`OpenClaw state database native borrower cleanup is pending: ${pathname}`);
		touchStateDatabase(database);
		return operation(database);
	});
}
function getOpenClawStateDatabaseIfOpenAtPath(pathname) {
	const cached = getCachedOpenClawStateDatabase(pathname);
	observeOpenClawDatabaseMaintenanceResource(cached?.db.isOpen ? cached.db : void 0);
	return cached?.db.isOpen ? cached : void 0;
}
/** Remove a closed cached owner while fresh-open access is held. */
function closeStaleCachedOpenClawStateDatabase(database) {
	if (cachedDatabases.get(database.path) !== database) return;
	asyncResources.invalidate(database.path);
	const errors = closeOpenClawStateDatabaseHandle(database);
	notifyOpenClawStateDatabaseClosed(database);
	throwSqliteLifecycleErrors(errors, `Stale OpenClaw state database cleanup failed for ${database.path}.`);
}
/** Latch background verification damage so later opens fail without rescanning. */
function recordOpenClawStateDatabaseOpenFailure(pathname, error, generation) {
	return terminalOpenLatch.record(resolveDatabasePath({ path: pathname }), error, generation);
}
/** Clear a terminal open failure after doctor rewrites the database file. */
function clearOpenClawStateDatabaseOpenFailure(pathname) {
	const resolvedPath = resolveDatabasePath({ path: pathname });
	terminalOpenLatch.clear(resolvedPath);
	asyncResources.invalidate(resolvedPath);
	notifyOpenClawStateDatabaseLifecycle({
		kind: "failure-cleared",
		path: resolvedPath,
		identity: asyncResources.knownIdentity(resolvedPath)
	});
}
/** Validate the canonical terminal fact before acquiring a domain-operation lease. */
async function getOpenClawStateDatabaseTerminalFailureAsync(context, signal) {
	context.admission.assertCurrent();
	const failure = await terminalOpenLatch.getAsync(context.admission.databasePath, async (pathname, generation) => {
		signal?.throwIfAborted();
		context.admission.assertCurrent();
		const current = await readSqliteFileGeneration(pathname, signal);
		signal?.throwIfAborted();
		context.admission.assertCurrent();
		return sameSqliteFileGeneration(generation, current);
	});
	context.admission.assertCurrent();
	return failure;
}
/** Reject shared-state access after a process-local terminal failure. */
function assertOpenClawStateDatabaseOpenAllowed(pathname, ownership) {
	const resolvedPath = resolveDatabasePath({ path: pathname });
	(ownership === "cached-read" ? assertStateDatabaseReadAllowed : assertStateDatabaseAccessAllowed)(pathname);
	const { identity } = asyncResources.capture(resolvedPath);
	const terminalFailure = terminalOpenLatch.get(resolvedPath);
	if (terminalFailure) throw terminalFailure;
	for (const database of retainedDatabaseHandles.values()) if (borrowers.get(database.db)?.retiring && (database.path === resolvedPath || databaseIdentities.get(database.db)?.key === identity.key)) throw new Error(`OpenClaw state database native borrower cleanup is pending: ${pathname}`);
}
function recordOpenClawStateDatabaseLifecycleOpenError(pathname, error) {
	notifyOpenClawStateDatabaseLifecycle({
		kind: "open-error",
		path: resolveDatabasePath({ path: pathname }),
		error
	});
}
/** Reject a fresh shared-state open after known corruption until repair clears it. */
function assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, env, onNativeCleanupFailure) {
	assertOpenClawStateDatabaseOpenAllowed(pathname);
	let quarantineFailure;
	try {
		quarantineFailure = readOpenClawDatabaseQuarantineFailure("state", pathname, { env });
	} catch (error) {
		if (!(error instanceof OpenClawQuarantineReadCleanupError)) throw error;
		onNativeCleanupFailure?.(error);
		return;
	}
	if (quarantineFailure?.cause instanceof OpenClawQuarantineReadCleanupError) onNativeCleanupFailure?.(quarantineFailure.cause);
	if (quarantineFailure) {
		cacheAdmission.closeTerminalFailure(pathname, quarantineFailure);
		throw quarantineFailure;
	}
}
/** SQLite owns checkpoint exclusion; retirement joins the actual native handle. */
function retireOpenClawStateDatabaseHandle(database, retireAdmission = true, options) {
	assertStateDatabaseBorrowersReleased(borrowers.get(database.db), database.path);
	const borrowedOwner = borrowers.get(database.db);
	try {
		const wasCached = cachedDatabases.get(database.path)?.db === database.db;
		if (retireAdmission) asyncResources.invalidate(database.path);
		const errors = closeOpenClawStateDatabaseHandle(database, options);
		if (wasCached && retireAdmission) try {
			notifyOpenClawStateDatabaseClosed(database);
		} catch (error) {
			errors.push(error);
		}
		throwSqliteLifecycleErrors(errors, `OpenClaw state database cleanup failed for ${database.path}.`);
	} catch (error) {
		if (borrowedOwner) retainStateDatabaseClose(database);
		throw error;
	}
	if (borrowedOwner) {
		borrowedOwner.cleanupComplete = true;
		borrowers.delete(database.db);
	}
}
/** Close cached and disposal-only handles, preserving independent cleanup failures. */
function retireOpenClawStateDatabaseHandles(pathname, options, identity) {
	const databases = /* @__PURE__ */ new Set([...retainedDatabaseHandles.values(), ...cachedDatabases.values()]);
	const errors = [];
	let found = false;
	for (const database of databases) {
		if (pathname !== void 0 && database.path !== pathname && (identity === void 0 || databaseIdentities.get(database.db)?.key !== identity.key)) continue;
		found = true;
		try {
			retireOpenClawStateDatabaseHandle(database, true, options);
		} catch (error) {
			errors.push(error);
		}
	}
	throwSqliteLifecycleErrors(errors, "OpenClaw state database cleanup failed.");
	return found;
}
function closeOpenClawStateDatabaseByPath(pathname, options) {
	return retireOpenClawStateDatabaseHandles(resolveDatabasePath({ path: pathname }), options, asyncResources.identity(pathname));
}
function closeOpenClawStateDatabase(options) {
	retireOpenClawStateDatabaseHandles(void 0, options);
}
/** Register a resource owner before it can admit any shared-state worker opens. */
const registerOpenClawStateDatabaseAsyncResource = asyncResources.register;
/** Capture the canonical read generation before any asynchronous worker admission. */
const captureOpenClawStateDatabaseReadAdmission = asyncResources.capture;
const captureOpenClawStateIntegrityAdmission = asyncResources.integrity;
/** Bind worker-created storage to its captured admission without publishing a native handle. */
function publishOpenClawStateDatabaseWorkerAdmission(admission) {
	asyncResources.publish(admission.databasePath);
	admission.assertCurrent();
}
/** Drain worker resources before native checkpoint/close at one exact path. */
function closeOpenClawStateDatabaseByPathAsync(pathname, options) {
	const resolvedPath = resolveDatabasePath({ path: pathname });
	return asyncResources.close(resolvedPath, async (identity) => {
		await stopOpenClawStateDatabaseMaintenance(resolvedPath, identity);
		return retireOpenClawStateDatabaseHandles(resolvedPath, options, identity);
	});
}
/** Orderly lifecycle close; synchronous close remains native/exit cleanup only. */
async function closeOpenClawStateDatabaseAsync(options) {
	await asyncResources.close(void 0, async () => {
		await stopOpenClawStateDatabaseMaintenance();
		return retireOpenClawStateDatabaseHandles(void 0, options);
	});
}
function isOpenClawStateDatabaseOpen(pathname) {
	if (pathname !== void 0) return cachedDatabases.get(resolveDatabasePath({ path: pathname }))?.db.isOpen === true;
	return Array.from(cachedDatabases.values()).some((database) => database.db.isOpen);
}
/**
* Close shared state handles and clear terminal failure latches for test isolation.
* Worker retirement continues after return; await closeOpenClawStateDatabaseAsync()
* before raw SQLite or file access to a database that workers have used.
*/
function closeOpenClawStateDatabaseForTest() {
	closeOpenClawStateDatabase();
	terminalOpenLatch.clearAll();
}
/**
* Owners that register with this cache must serve only the published lifecycle.
* Every runtime chunk shares that lifecycle; only a retired module generation
* (a re-evaluated test graph whose detached work outlived its file) can differ.
*/
function assertPublishedOpenClawStateDatabaseLifecycle() {
	if (readGlobalSingleton(STATE_DATABASE_LIFECYCLE_KEY) !== stateDatabaseLifecycle) throw new Error("OpenClaw state database lifecycle is retired; its owners cannot serve the published lifecycle");
}
/** Process-wide owner for cached shared-state handles and terminal open failures. */
const openClawStateDatabaseCache = {
	assertOpenClawStateDatabaseFreshOpenAllowedAtPath,
	assertOpenClawStateDatabaseOpenAllowed,
	clearOpenClawStateDatabaseOpenFailure,
	closeOpenClawStateDatabase,
	closeOpenClawStateDatabaseByPath,
	closeOpenClawStateDatabaseForTest,
	closeOpenClawStateDatabaseHandle,
	closeUnpublishedOpenClawStateDatabaseHandle,
	closeStaleCachedOpenClawStateDatabase,
	evictCachedOpenClawStateDatabase,
	evictOpenClawStateDatabaseAfterCorruption,
	getCachedOpenClawStateDatabase,
	peekOpenClawStateDatabaseConnection: (pathname) => cachedDatabases.get(resolveDatabasePath({ path: pathname }))?.db,
	withCachedOpenClawStateDatabase,
	getOpenClawStateDatabaseRecordedFailure: terminalOpenLatch.peek,
	getOpenClawStateDatabaseIfOpenAtPath,
	getKnownOpenClawStateDatabaseIdentity: asyncResources.knownIdentity,
	isOpenClawStateDatabaseOpen,
	/** Only the exact published, open owner carries canonical schema readiness. */
	isOpenClawStateDatabaseSchemaReady: (database) => cachedDatabases.get(database.path) === database && database.db.isOpen,
	publishOpenClawStateDatabase,
	recordOpenClawStateDatabaseOpenFailure,
	recordOpenClawStateDatabaseLifecycleOpenError,
	touchStateDatabase
};
/** Reconfirm an advisory worker failure on the live owner connection. */
async function confirmCachedOpenClawStateDatabaseIntegrity(pathname) {
	const resolvedPath = resolveDatabasePath({ path: pathname });
	await closeOpenClawStateDatabaseByPathAsync(resolvedPath);
	return confirmSqliteFileIntegrity(resolvedPath, resolvedPath);
}
//#endregion
export { agentSchemaMetadataKey as $, readStateSchemaContentVersionRow as A, prepareSqliteReadOnlyLocation as B, cloneEnvWithPlatformSemantics as C, getExistingOpenClawStateSchemaPath as Ct, admitStateSchemaFacts as D, CONTENT_VERSION_KEY as E, withExistingOpenClawStateSchema as Et, publishStateSchemaVersionAdmission as F, isUpdateRehearsalPrivateDatabase as G, prepareSqliteReadOnlyLocationSync as H, ensureOpenClawQuarantineStore as I, quarantineOrphanedSqliteSidecars as J, resolveUpdateRehearsalRoot as K, readOpenClawDatabaseQuarantineFailure as L, getStateRuntimeSchemaAdmission as M, getStateSchemaVersionAdmission as N, assertSupportedStateSchemaVersion as O, publishStateRuntimeSchemaAdmission as P, readSqliteWriterAppVersion as Q, recordOpenClawDatabaseQuarantine as R, applyConfigEnvVars as S, assertOpenClawStateSchemaRepairAllowed as St, SQLITE_IDLE_HANDLE_TTL_MS as T, recordExistingOpenClawStateSchemaDatabase as Tt, startSqliteReadOnlyLocationAsync as U, prepareSqliteReadOnlyLocationAwaited as V, withSqliteSnapshotWorker as W, prepareSqliteReadOnlyLocationFromOwnedDatabase as X, resolveSqliteDatabaseFilePaths as Y, acquireSqliteSnapshotReadToken as Z, invalidateOpenClawStateRuntimeIntegrity as _, asBoolean as _t, confirmCachedOpenClawStateDatabaseIntegrity as a, registerSqliteCacheExitClose as at, captureOpenClawStateWorkerContextWithAdmission as b, hashFileDescriptorSync as bt, openclaw_state_db_cache_exports as c, publishSqliteWalCheckpointObservation as ct, registerOpenClawStateDatabaseAsyncResource as d, SqliteRepairableForeignKeyError as dt, publishAgentSchemaMetadata as et, registerOpenClawStateDatabaseLifecycleListener as f, assertSqliteIntegrity as ft, assertStateDatabaseIntegrityOnce as g, sqliteIntegrityCheckSteps as gt, assertOpenClawStateRuntimeIntegrity as h, runSqliteIntegrityOperationSync as ht, captureOpenClawStateIntegrityAdmission as i, configureSqlitePreSchemaPragmas as it, createStateSchemaAdmission as j, readStateSchemaContentVersion as k, publishOpenClawStateDatabaseWorkerAdmission as l, truncateSqliteWal as lt, retainOpenClawStateDatabaseForIndependentRead as m, runSqliteIntegrityCheckSync as mt, borrowOpenClawStateDatabaseForAsyncRead as n, createPrivateSqliteTempDirectorySync as nt, getOpenClawStateDatabaseTerminalFailureAsync as o, createSqliteWalReclamationResult as ot, requireOpenClawStateDatabaseIdentity as p, isTerminalSqliteIntegrityError as pt, SQLITE_SIDECAR_SUFFIXES as q, captureOpenClawStateDatabaseReadAdmission as r, configureSqliteConnectionPragmas as rt, openClawStateDatabaseCache as s, prepareSqliteDatabaseDirectory as st, assertPublishedOpenClawStateDatabaseLifecycle as t, readExistingAgentSchemaMeta as tt, recordOpenClawStateDatabaseOpenFailure as u, createSqliteTerminalOpenLatch as ut, captureOpenClawStateReadContextWithAdmission as v, parseSqliteFileGeneration as vt, isTruthyEnvValue as w, isExistingOpenClawStateSchema as wt, isGatewayExternallySupervised as x, sha256Base64Url as xt, captureOpenClawStateReadWorkerContextWithAdmission as y, readSqliteIntegrityFileIdentity as yt, openSqliteReadOnlyDatabase as z };
