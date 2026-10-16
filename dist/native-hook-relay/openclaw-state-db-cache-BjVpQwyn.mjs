import { s as toErrorObject, t as coerceErrorMessage } from "./error-coercion-DKQY4wyF.mjs";
import { D as isRecord, S as resolveGlobalSingleton, n as MAX_TIMER_TIMEOUT_MS } from "./number-coercion-CmpLVzZ6.mjs";
import { B as markSqliteInspectionOperation, F as OPENCLAW_DATABASE_SCHEMA_DOCS_URL, G as withSqliteNativeOpen, H as sqliteErrorCode, L as isSqliteCorruptionError, R as isSqliteLockError, U as sqliteExtendedResultCode, W as sqlitePrimaryResultCode, m as registerNodeSqliteKyselyQueryErrorHandler, r as isSqliteSchemaVersionError, s as clearNodeSqliteKyselyCacheForDatabase } from "./sqlite-user-version-C7PVO8Wf.mjs";
import { t as mergeProcessEnv } from "./process-env-DlZFJzq6.mjs";
import { m as isAbortError, r as isPathInside, u as resolveRequiredOsHomeDir } from "./utils-BfTq4rUg.mjs";
import { A as hasErrnoCode, B as containsEnvVarReference, N as resolveIdentityPathViaExistingAncestorSync, v as resolveStateDir } from "./redact-TLu2QTmL.mjs";
import { t as formatErrorMessage } from "./errors-BwnhmTMH.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as runOutsideAsyncWorkScope, t as AsyncWorkScope } from "./async-work-scope-6N1oTppj.mjs";
import { c as resolveQuarantineStorePath, s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D1QtF7Ci.mjs";
import { A as quoteSqliteIdentifier, C as readDatabasePathIdentitySync, H as captureSqliteReaderOwner, U as readSqliteReaderDiagnosticsForPath, W as sqliteReaderDatabasePathKey, a as runWithSqliteBusyTimeout, c as openNodeSqliteDatabase, d as resolveSqliteFilesystemPath, f as admitSqliteSchema, g as assertExistingDatabaseIdentity, h as runSqliteReadOperationSync, i as readSqliteBusyTimeout, l as requireNodeSqlite, o as setSqliteBusyTimeout, p as getAdmittedSqliteSchemaFacts, r as normalizeSqliteNonNegativeInteger, s as shouldReportSqliteLockFailure, u as resolveExistingSqliteFileUri, w as extractSqliteTableSchema, y as normalizeDatabasePath } from "./openclaw-state-db-schema-migration-required-DtltEO1E.mjs";
import { i as normalizeLegacyDotBetaVersion, t as compareOpenClawSemver } from "./semver-aYpwYdrQ.mjs";
import { n as assertSupportedStateSchemaVersion } from "./openclaw-state-db-schema-version-CNeUiDjx.mjs";
import { a as expandEnvNormalizationKeys, c as resolveEnvNormalizationKeys, d as normalizeFsSafeNativeEnv, l as clearFsSafeEnvFallback, n as isDangerousHostEnvVarName, r as normalizeEnvVarKey, s as normalizeZaiEnv, t as isDangerousHostEnvOverrideVarName, u as fsSafeEnvInput } from "./host-env-security-Dgi-NhWK.mjs";
import "./fs-safe-JcIGlJ4o.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { $ as isOpenClawDatabaseMaintenanceResourceOwned, D as assertStateDatabaseAccessAllowed, J as isStateDatabaseReadAdmissionInvalidatedError, K as StateDatabaseReadAdmissionInvalidatedError, O as assertStateDatabaseReadAllowed, Q as getOpenClawDatabaseMaintenanceScope, Z as getOpenClawDatabaseMaintenanceResourceScope, a as registerSnapshotTempDirectory, at as createSqliteLifecycleAggregateError, et as observeOpenClawDatabaseMaintenanceResource, h as isSqliteSnapshotStagingName, l as retainSnapshotWork, m as acquireSqliteSnapshotToken, n as adoptPreparedLocation, o as removeTempDirectory, p as SQLITE_SNAPSHOT_PREFIX, q as createOpenClawStateDatabaseAsyncLifecycle, s as removeTempDirectoryAsync, st as throwSqliteLifecycleErrors, t as SqliteSnapshotCleanupError, v as isPrivateDirectoryCreationRefused, w as OpenClawQuarantineReadCleanupError, x as markOpenClawStateDatabaseFailure, y as markPrivateDirectoryCreationRefused } from "./sqlite-readonly-location-cleanup-CmRNKiuM.mjs";
import { a as resolvePreferredOpenClawTmpDir, r as getChildLogger, t as createSubsystemLogger } from "./subsystem-M2sQt_up.mjs";
import { a as matchesAgentDatabaseReadCandidatePath, n as flatMapRetainedOperation, o as registerAgentDatabaseReaderCloser, r as mapRetainedOperation, t as createRetainedOperation } from "./retained-operation-Dsn-U2KQ.mjs";
import { createRequire } from "node:module";
import "node:v8";
import fsSync, { existsSync, realpathSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { sameFileIdentity } from "@openclaw/fs-safe/advanced";
import "@openclaw/fs-safe/errors";
import { AsyncLocalStorage } from "node:async_hooks";
import { performance as performance$1 } from "node:perf_hooks";
import { MessageChannel, isMainThread, receiveMessageOnPort, threadId } from "node:worker_threads";
import "node:fs/promises";
import { parse } from "semver";
import { sha256FileSync } from "@openclaw/fs-safe/durability";
import "node:util/types";
import { setImmediate } from "node:timers/promises";
import { probeTreeClone } from "@openclaw/fs-safe/copy";
//#region src/config/version.ts
/** Parses stable, prerelease, and legacy dot-beta OpenClaw versions. */
function parseOpenClawVersion(raw) {
	if (!raw) return null;
	const normalized = normalizeLegacyDotBetaVersion(raw.trim());
	return parse(normalized);
}
function compareOpenClawVersions(a, b) {
	const parsedA = parseOpenClawVersion(a);
	const parsedB = parseOpenClawVersion(b);
	if (!parsedA || !parsedB) return null;
	return compareOpenClawSemver(parsedA, parsedB);
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
//#region src/infra/sqlite-post-commit.ts
const pendingPublications = resolveGlobalSingleton(Symbol.for("openclaw.sqlitePostCommitPublications"), () => /* @__PURE__ */ new WeakMap());
const pendingTransactionState = resolveGlobalSingleton(Symbol.for("openclaw.sqliteTransactionState"), () => /* @__PURE__ */ new WeakMap());
/** Publications are non-throwing observers, never part of a durable transaction's result. */
function deferSqlitePostCommitPublication(db, publish) {
	const pending = pendingPublications.get(db);
	if (!pending) return false;
	pending.push(publish);
	return true;
}
function rollbackTransactionState(states, error) {
	const failures = [];
	for (const state of states.toReversed()) try {
		state.rollback(error);
	} catch (failure) {
		failures.push(failure);
	}
	if (failures.length > 0) throw createSqliteLifecycleAggregateError([error, ...failures], "SQLite transaction and rollback observers failed", error);
}
/** A lost transaction invalidates every savepoint's staged state and observers. */
function discardSqliteTransactionState(db, error) {
	pendingPublications.get(db)?.splice(0);
	const rolledBackState = pendingTransactionState.get(db)?.splice(0) ?? [];
	pendingPublications.delete(db);
	pendingTransactionState.delete(db);
	rollbackTransactionState(rolledBackState, error);
}
/** Nested rollback restores staged state and discards observers; savepoints wait for outer commit. */
function withSqlitePostCommitPublications(db, transaction) {
	const nested = db.isTransaction;
	const publications = nested ? pendingPublications.get(db) : [];
	const transactionState = nested ? pendingTransactionState.get(db) : [];
	const publicationStart = publications?.length ?? 0;
	const stateStart = transactionState?.length ?? 0;
	if (!nested && publications && transactionState) {
		pendingPublications.set(db, publications);
		pendingTransactionState.set(db, transactionState);
	}
	let result;
	try {
		result = transaction();
	} catch (error) {
		publications?.splice(publicationStart);
		rollbackTransactionState(transactionState?.splice(stateStart) ?? [], error);
		throw error;
	} finally {
		if (!nested) {
			pendingPublications.delete(db);
			pendingTransactionState.delete(db);
		}
	}
	if (!nested) {
		for (const state of transactionState ?? []) state.commit();
		for (const state of transactionState ?? []) state.prepareObservers?.();
		for (const publish of publications ?? []) publish();
	}
	return result;
}
//#endregion
//#region src/infra/file-descriptor.ts
/** Strict field equality; callers own any platform-specific identity tolerance. */
function sameFileMutationFingerprint(left, right) {
	return left.birthtimeNs === right.birthtimeNs && left.ctimeNs === right.ctimeNs && left.dev === right.dev && left.ino === right.ino && left.mtimeNs === right.mtimeNs && left.size === right.size;
}
/** Maps the borrowed-descriptor digest to OpenClaw's persisted artifact fields. */
function hashFileDescriptorSync(fd, maxBytes) {
	const { digest, bytes } = sha256FileSync(fd, { maxBytes });
	return {
		sha256: digest,
		sizeBytes: bytes
	};
}
//#endregion
//#region src/infra/sqlite-file-generation.ts
function assertRegularFile(stat) {
	if (!stat.isFile()) throw new Error("SQLite generation target must be a regular file");
}
function sameFileState(left, right) {
	return sameFileIdentity(left, right) && left.birthtimeNs === right.birthtimeNs && left.ctimeNs === right.ctimeNs && left.mtimeNs === right.mtimeNs && left.size === right.size;
}
function fingerprintFile(pathname) {
	const fd = fsSync.openSync(pathname, "r");
	try {
		const before = fsSync.fstatSync(fd, { bigint: true });
		assertRegularFile(before);
		const { sha256 } = hashFileDescriptorSync(fd);
		const after = fsSync.fstatSync(fd, { bigint: true });
		const current = fsSync.statSync(pathname, { bigint: true });
		if (!sameFileState(before, after) || !sameFileState(after, current)) throw new Error(`SQLite generation target changed while hashing: ${pathname}`);
		return {
			birthtimeNs: after.birthtimeNs,
			ctimeNs: after.ctimeNs,
			dev: after.dev,
			ino: after.ino,
			mtimeNs: after.mtimeNs,
			sha256,
			size: after.size
		};
	} finally {
		fsSync.closeSync(fd);
	}
}
function readOptionalFile(pathname) {
	try {
		return fingerprintFile(pathname);
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
}
function readGeneration(pathname) {
	const database = fingerprintFile(pathname);
	const journal = readOptionalFile(`${pathname}-journal`);
	const wal = readOptionalFile(`${pathname}-wal`);
	return {
		database,
		...journal ? { journal } : {},
		...wal ? { wal } : {}
	};
}
function readStableSqliteFileGeneration(pathname) {
	const first = readGeneration(pathname);
	const second = readGeneration(pathname);
	if (!sameSqliteFileGeneration(first, second)) throw new Error(`SQLite file generation changed while reading: ${pathname}`);
	return second;
}
function sameFileFingerprint(left, right) {
	return sameFileMutationFingerprint(left, right) && left.sha256 === right.sha256;
}
function sameOptionalFileFingerprint(left, right) {
	return left === void 0 ? right === void 0 : right !== void 0 && sameFileFingerprint(left, right);
}
function sameSqliteFileGeneration(left, right) {
	return sameFileFingerprint(left.database, right.database) && sameOptionalFileFingerprint(left.journal, right.journal) && sameOptionalFileFingerprint(left.wal, right.wal);
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
//#region src/infra/sqlite-integrity.ts
/** The gate includes the driver's check, awaited lifetime, and admission revalidation. */
function* sqliteIntegrityCheckSteps(database, databaseLabel, diagnostics, tables) {
	const startedAt = performance$1.now();
	const check = {
		database,
		databaseLabel,
		tables
	};
	if (diagnostics) {
		check.timing = {};
		diagnostics.integrityGateMode = tables ? "tables" : "full";
		delete diagnostics.integrityTableTimings;
		delete diagnostics.integrityTableTotals;
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
			if (check.timing?.tables) {
				diagnostics.integrityTableTotals = {};
				for (const table of check.timing.tables) {
					const total = diagnostics.integrityTableTotals[table.check] ??= {
						tableCount: 0,
						elapsedMs: 0
					};
					total.tableCount += 1;
					total.elapsedMs += table.elapsedMs;
				}
				diagnostics.integrityTableTimings = check.timing.tables.toSorted((left, right) => right.elapsedMs - left.elapsedMs).slice(0, 10);
			}
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
		assertSqliteIntegrity(check.database, check.databaseLabel, "integrity_check", check.tables, timing);
	} finally {
		if (timing) timing.syncElapsedMs = performance$1.now() - startedAt;
	}
}
/** Run the same admission steps synchronously when the caller cannot yield. */
function runSqliteIntegrityOperationSync(operation, beforeResume) {
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
function assertSqliteIntegrity(database, databaseLabel, check = "integrity_check", tables, timing) {
	if (tables) {
		if (timing) timing.tables = [];
		for (const entry of tables) {
			const startedAt = performance$1.now();
			try {
				runSqliteCheck(database, databaseLabel, entry.check, entry.table);
				runSqliteForeignKeyCheck(database, databaseLabel, entry.table);
			} finally {
				timing?.tables?.push({
					...entry,
					elapsedMs: Math.floor(performance$1.now() - startedAt)
				});
			}
		}
		return { integrityCheck: "ok" };
	}
	const integrityCheck = runSqliteCheck(database, databaseLabel, check);
	runSqliteForeignKeyCheck(database, databaseLabel);
	return { integrityCheck };
}
function runSqliteCheck(database, databaseLabel, pragma, tableName) {
	const argument = tableName ? `('${tableName.replaceAll("'", "''")}')` : "";
	let rows;
	try {
		rows = database.prepare(`PRAGMA ${pragma}${argument};`).all();
	} catch (error) {
		throw createSqliteIntegrityError(`SQLite ${pragma} failed for ${databaseLabel}: ${error instanceof Error ? error.message : String(error)}`, error);
	}
	const results = rows.map((row) => row[pragma] ?? Object.values(row)[0]);
	if (results.length === 1 && results[0] === "ok") return "ok";
	throw createSqliteIntegrityError(`SQLite ${pragma} failed for ${databaseLabel}: ${results.map((result) => String(result)).join("; ") || "no result"}. Run openclaw doctor --fix for explicit repair; if repair is refused, preserve the database and WAL and restore a verified backup.`);
}
function runSqliteForeignKeyCheck(database, databaseLabel, table) {
	let violationCount = 0;
	let repairable = true;
	let taskDeliveryForeignKeyId;
	const violations = [];
	try {
		const argument = table ? `('${table.replaceAll("'", "''")}')` : "";
		const statement = database.prepare(`PRAGMA foreign_key_check${argument};`);
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
		throw createSqliteIntegrityError(`SQLite foreign_key_check failed for ${databaseLabel}: ${error instanceof Error ? error.message : String(error)}`, error);
	}
	if (violations.length === 0) return;
	if (repairable) throw new SqliteRepairableForeignKeyError(databaseLabel, violationCount);
	const details = violations.map(formatSqliteForeignKeyViolation);
	if (violationCount > MAX_REPORTED_FOREIGN_KEY_VIOLATIONS) details.push("additional violations omitted");
	throw createSqliteIntegrityError(`SQLite foreign_key_check failed for ${databaseLabel}: ${details.join("; ")}`);
}
function readTaskDeliveryCascadeForeignKeyId(database) {
	const statement = database.prepare("PRAGMA foreign_key_list(task_delivery_state);");
	statement.setReadBigInts(true);
	const foreignKeys = statement.all();
	const taskKey = foreignKeys.find((key) => key.table === "task_runs" && key.from === "task_id" && key.to === "task_id" && key.on_delete === "CASCADE");
	return taskKey && typeof taskKey.id === "bigint" && foreignKeys.filter((key) => key.id === taskKey.id).length === 1 ? taskKey.id : void 0;
}
function createSqliteIntegrityError(message, cause) {
	const error = cause === void 0 ? new Error(message) : new Error(message, { cause });
	error.name = "SqliteIntegrityError";
	return error;
}
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
		return sameSqliteFileGeneration(expected, readStableSqliteFileGeneration(pathname));
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
			for (;;) {
				const failure = failures.get(resolvedPath);
				if (!failure?.generation) return failure?.error;
				const current = await isCurrentGeneration(resolvedPath, failure.generation);
				if (failures.get(resolvedPath) !== failure) continue;
				if (!current) {
					failures.delete(resolvedPath);
					return;
				}
				return failure.error;
			}
		},
		record: (pathname, error, generation) => {
			const resolvedPath = path.resolve(pathname);
			if (generation && !generationMatchesPath(resolvedPath, generation)) return false;
			failures.set(resolvedPath, {
				error,
				...generation ? { generation } : {}
			});
			options.closeByPath(resolvedPath, error);
			if (generation && !generationMatchesPath(resolvedPath, generation)) {
				failures.delete(resolvedPath);
				return false;
			}
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
//#region src/infra/sqlite-transaction.ts
const DEFAULT_SLOW_BUSY_WAIT_MS = 1e3;
const DEFAULT_SLOW_TRANSACTION_HOLD_MS = 1e3;
const abortedTransactionSymbol = Symbol.for("openclaw.sqliteAbortedTransaction");
function assertTransactionUsable(db) {
	const aborted = db[abortedTransactionSymbol];
	if (aborted) throw aborted.error;
}
const transactionLog = createSubsystemLogger("sqlite/transaction");
const writeAdmissionServices = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWriteAdmissionServices"), () => /* @__PURE__ */ new Map());
const writeAdmissionLocations = /* @__PURE__ */ new WeakMap();
function writeAdmissionLocation(database) {
	const cached = writeAdmissionLocations.get(database);
	if (cached !== void 0) return cached;
	const location = database.location();
	const canonical = location === null ? null : normalizeDatabasePath(location);
	writeAdmissionLocations.set(database, canonical);
	return canonical;
}
/** Locations come from the retained native owner; registration grants no write authority. */
function retainSqliteWriteAdmissionService(nativeLocations, service) {
	const registrations = [...new Set(nativeLocations.map(normalizeDatabasePath))].map((location) => {
		const services = writeAdmissionServices.get(location) ?? /* @__PURE__ */ new Set();
		const retained = () => service();
		services.add(retained);
		writeAdmissionServices.set(location, services);
		return {
			location,
			services,
			retained
		};
	});
	return () => {
		for (const { location, services, retained } of registrations) {
			services.delete(retained);
			if (services.size === 0 && writeAdmissionServices.get(location) === services) writeAdmissionServices.delete(location);
		}
	};
}
function execNativeBegin(db, diagnostics) {
	const startedAt = Date.now();
	diagnostics.nativeAttempts += 1;
	try {
		db.exec("BEGIN IMMEDIATE");
	} finally {
		diagnostics.nativeMs += Date.now() - startedAt;
	}
}
function beginImmediateTransaction(db, diagnostics) {
	const location = writeAdmissionServices.size > 0 ? writeAdmissionLocation(db) : null;
	const services = location === null ? void 0 : writeAdmissionServices.get(location);
	if (!services) {
		execNativeBegin(db, diagnostics);
		return;
	}
	const deadline = performance.now() + readSqliteBusyTimeout(db);
	while (true) try {
		runWithSqliteBusyTimeout(db, Math.min(25, Math.max(0, Math.ceil(deadline - performance.now()))), () => execNativeBegin(db, diagnostics));
		return;
	} catch (error) {
		if (!isSqliteLockError(error) || performance.now() >= deadline) throw error;
		for (const service of services) {
			const startedAt = Date.now();
			diagnostics.serviceCalls += 1;
			try {
				service();
			} finally {
				diagnostics.serviceMs += Date.now() - startedAt;
			}
		}
		if (performance.now() >= deadline) throw error;
	}
}
function assertSyncTransactionResult(value) {
	if (isPromiseLike(value)) throw new Error("SQLite write transactions must be synchronous; Promise returns are not supported.");
}
function slowBusyWaitThresholdMs(options) {
	if (options?.busyTimeoutMs === void 0 || options.busyTimeoutMs <= 0) return DEFAULT_SLOW_BUSY_WAIT_MS;
	return Math.min(DEFAULT_SLOW_BUSY_WAIT_MS, options.busyTimeoutMs);
}
function transactionDiagnosticLabels(db, options) {
	let database = options?.databaseLabel;
	if (!database) try {
		database = db ? db.location() ?? ":memory:" : "unavailable";
	} catch {
		database = "unavailable";
	}
	return {
		database,
		operation: options?.operationLabel || captureSqliteReaderOwner()?.operation || "unlabeled",
		...options?.diagnosticContext ? { context: { ...options.diagnosticContext } } : {}
	};
}
function logSlowTransactionHold(params) {
	if (params.elapsedMs < (params.options?.slowTransactionHoldMs ?? DEFAULT_SLOW_TRANSACTION_HOLD_MS)) return;
	(params.options?.logger ?? transactionLog).warn("slow SQLite transaction hold", {
		async: false,
		...transactionDiagnosticLabels(params.db, params.options),
		elapsedMs: params.elapsedMs,
		isMainThread,
		mode: params.mode,
		pid: process.pid,
		threadId,
		thresholdMs: params.options?.slowTransactionHoldMs ?? DEFAULT_SLOW_TRANSACTION_HOLD_MS
	});
}
function logSlowTransactionStep(params) {
	if (params.elapsedMs < slowBusyWaitThresholdMs(params.options)) return;
	(params.options?.logger ?? transactionLog).warn("slow SQLite transaction step", {
		async: false,
		...params.options?.busyTimeoutMs !== void 0 ? { busyTimeoutMs: params.options.busyTimeoutMs } : {},
		...transactionDiagnosticLabels(params.db, params.options),
		elapsedMs: params.elapsedMs,
		isMainThread,
		pid: process.pid,
		step: params.step,
		threadId,
		...params.beginAdmission ? { beginAdmission: { ...params.beginAdmission } } : {}
	});
}
function execTimedTransactionStep(params) {
	const startedAt = Date.now();
	const beginAdmission = params.sql === "BEGIN IMMEDIATE" ? {
		nativeAttempts: 0,
		nativeMs: 0,
		serviceCalls: 0,
		serviceMs: 0
	} : void 0;
	try {
		if (beginAdmission) beginImmediateTransaction(params.db, beginAdmission);
		else params.db.exec(params.sql);
		const elapsedMs = Date.now() - startedAt;
		logSlowTransactionStep({
			beginAdmission,
			db: params.db,
			elapsedMs,
			options: params.options,
			step: params.step
		});
		return elapsedMs;
	} catch (error) {
		const elapsedMs = Date.now() - startedAt;
		if (isSqliteLockError(error) && shouldReportSqliteLockFailure(params.db)) {
			const sqliteErrcode = sqliteExtendedResultCode(error);
			const sqlitePrimaryCode = sqlitePrimaryResultCode(error);
			(params.options?.logger ?? transactionLog).warn("SQLite transaction lock wait failed", {
				async: false,
				...params.options?.busyTimeoutMs !== void 0 ? { busyTimeoutMs: params.options.busyTimeoutMs } : {},
				...transactionDiagnosticLabels(params.db, params.options),
				code: sqliteErrorCode(error),
				elapsedMs,
				failureKind: "lock-contention",
				isMainThread,
				pid: process.pid,
				...sqliteErrcode !== void 0 ? { sqliteErrcode } : {},
				...sqlitePrimaryCode !== void 0 ? { sqlitePrimaryCode } : {},
				step: params.step,
				threadId,
				...beginAdmission ? { beginAdmission: { ...beginAdmission } } : {}
			});
		}
		throw error;
	}
}
function commitImmediateTransaction(db, options) {
	execTimedTransactionStep({
		db,
		options,
		sql: "COMMIT",
		step: "commit"
	});
}
function discardUnsafeConnection(db, error) {
	const aborted = { error };
	db[abortedTransactionSymbol] ??= aborted;
	try {
		discardSqliteTransactionState(db, error);
	} catch (rollbackError) {
		if (db[abortedTransactionSymbol] === aborted) aborted.error = rollbackError;
		throw rollbackError;
	} finally {
		clearNodeSqliteKyselyCacheForDatabase(db);
		try {
			db.close();
		} catch {}
	}
}
function abortImmediateTransaction(db, error, commitStarted) {
	if (db[abortedTransactionSymbol]) return;
	if (!commitStarted && db.isOpen && !db.isTransaction) {
		discardSqliteTransactionState(db, error);
		return;
	}
	try {
		db.exec("ROLLBACK");
	} catch {
		discardUnsafeConnection(db, error);
	}
}
function runSqliteTransactionSync(db, operation, mode, options) {
	assertTransactionUsable(db);
	if (db.isTransaction) {
		db.exec("SAVEPOINT openclaw_tx_nested");
		try {
			const result = operation();
			assertSyncTransactionResult(result);
			assertTransactionUsable(db);
			db.exec("RELEASE SAVEPOINT openclaw_tx_nested");
			return result;
		} catch (error) {
			const failure = db[abortedTransactionSymbol];
			if (failure) throw failure.error;
			try {
				db.exec("ROLLBACK TO SAVEPOINT openclaw_tx_nested");
				db.exec("RELEASE SAVEPOINT openclaw_tx_nested");
			} catch {
				discardUnsafeConnection(db, error);
			}
			throw error;
		}
	}
	execTimedTransactionStep({
		db,
		options,
		sql: mode === "immediate" ? "BEGIN IMMEDIATE" : "BEGIN",
		step: "begin"
	});
	const transactionStartedAt = Date.now();
	let commitStarted = false;
	try {
		const result = operation();
		assertSyncTransactionResult(result);
		assertTransactionUsable(db);
		commitStarted = true;
		if (options?.withCommit) assertSyncTransactionResult(options.withCommit(() => commitImmediateTransaction(db, options)));
		else commitImmediateTransaction(db, options);
		return result;
	} catch (error) {
		abortImmediateTransaction(db, error, commitStarted);
		assertTransactionUsable(db);
		throw error;
	} finally {
		try {
			logSlowTransactionHold({
				db,
				elapsedMs: Date.now() - transactionStartedAt,
				mode,
				options
			});
		} catch {}
	}
}
/** Run synchronous reads against one deferred SQLite snapshot. */
function runSqliteDeferredTransactionSync(db, operation, options) {
	return runSqliteTransactionSync(db, operation, "deferred", options);
}
function runSqliteImmediateTransactionSync(db, operation, options) {
	return runSqliteTransactionSync(db, operation, "immediate", options);
}
//#endregion
//#region src/infra/sqlite-wal-write-admission.ts
const admissions = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWalWriteAdmissions"), () => /* @__PURE__ */ new WeakMap());
/** A worker-maintained writer never checkpoints inline; its maintenance owner ticks instead. */
function registerSqliteWalWorkerMaintenance(database, execute, cancel) {
	const previous = Number(database.prepare("PRAGMA wal_autocheckpoint;").get()?.wal_autocheckpoint ?? 0);
	database.exec("PRAGMA wal_autocheckpoint = 0;");
	admissions.set(database, {
		execute,
		cancel: () => {
			if (previous > 0 && database.isOpen && !database.isTransaction) database.exec(`PRAGMA wal_autocheckpoint = ${previous};`);
			return cancel?.();
		}
	});
}
function cancelSqliteWalWriteAdmission(database) {
	return admissions.get(database)?.cancel?.();
}
function createSqliteWalMaintenanceScheduler(database, operation, prepare, observe, onError, pageBudget) {
	let pending;
	return () => {
		if (!pending) {
			const run = async () => {
				let remaining = pageBudget();
				while (true) {
					const request = prepare(remaining);
					if (!request || remaining === 0 && admissions.get(database)?.execute) return;
					let result;
					const admitted = () => {
						if (prepare(remaining)) result = operation(request);
					};
					const admission = admissions.get(database);
					if (admission?.execute) {
						result = await admission.execute(request);
						if (!prepare(remaining)) return;
						if (result?.checkpoint) observe(result.checkpoint);
					} else if (admission?.admit) await admission.admit(admitted);
					else admitted();
					const reclaimed = result?.reclaimedPages ?? 0;
					remaining -= reclaimed;
					if (reclaimed <= 0 || remaining <= 0) return;
					await setImmediate();
				}
			};
			pending = run().catch((error) => {
				if (prepare(0)) onError(error);
			}).finally(() => {
				pending = void 0;
			});
		}
		return pending;
	};
}
//#endregion
//#region src/infra/gateway-scheduler.ts
const log$4 = createSubsystemLogger("gateway/scheduler");
const hostClock = {
	now: () => Date.now(),
	monotonicNow: () => performance.now(),
	arm: (run, delayMs) => {
		const timer = setTimeout(() => {
			run();
		}, delayMs);
		timer.unref();
		return () => clearTimeout(timer);
	}
};
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
		const atMs = relative ? nowMs + params.delayMs : params.atMs;
		if (!Number.isFinite(atMs) || params.everyMs !== void 0 && (!Number.isFinite(params.everyMs) || params.everyMs <= 0)) throw new Error(`Invalid Gateway schedule: ${params.id}`);
		const cancelled = this.signal.aborted || owner?.signal.aborted === true;
		const previous = cancelled ? void 0 : this.jobs.get(params.id);
		const job = {
			id: params.id,
			run: params.run,
			everyMs: params.everyMs,
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
			const delayMs = Math.min(2147483647, Math.max(0, next - nowMs));
			this.cancelTimer = this.clock.arm(() => generation === this.timerGeneration ? this.wake(nowMs + delayMs) : void 0, delayMs);
		}
	}
	wake(expectedAtMs) {
		this.cancelTimer = void 0;
		if (this.signal.aborted) return;
		const nowMs = this.now();
		const elapsedMs = this.clock.monotonicNow();
		const due = [...this.jobs.values()].filter((job) => !job.running && this.remaining(job, nowMs, elapsedMs) <= 0).toSorted((a, b) => this.remaining(a, nowMs, elapsedMs) - this.remaining(b, nowMs, elapsedMs));
		const started = [];
		if (nowMs - expectedAtMs > 6e4) log$4.debug(`late wake by ${nowMs - expectedAtMs}ms; coalescing ${due.length} due jobs`);
		this.dispatching = true;
		try {
			for (const job of due) {
				if (this.signal.aborted || job.cancelled || job.owner?.signal.aborted || this.jobs.get(job.id) !== job) continue;
				if (job.everyMs === void 0) this.jobs.delete(job.id);
				started.push(this.run(job));
			}
		} finally {
			this.dispatching = false;
			this.arm();
		}
		return Promise.all(started).then(() => void 0);
	}
	run(job) {
		if (job.everyMs === void 0) log$4.debug(`running ${job.id}`);
		else log$4.trace(`running ${job.id}`);
		const done = createDeferredCore();
		const work = new AsyncWorkScope();
		job.running = done.promise;
		this.pending.add(done.promise);
		const finish = () => {
			job.running = void 0;
			this.pending.delete(done.promise);
			if (job.everyMs !== void 0 && !job.cancelled && !this.signal.aborted) {
				job.atMs = this.now() + job.everyMs;
				job.elapsedAtMs = this.clock.monotonicNow() + job.everyMs;
			} else job.owner?.jobs.delete(job);
			done.resolve();
			this.arm();
		};
		let result = void 0;
		try {
			result = job.context(() => work.run(job.run));
		} catch (error) {
			log$4.error(`${job.id} failed: ${String(error)}`);
		}
		if (!result && !work.hasPendingWork) {
			finish();
			return done.promise;
		}
		Promise.resolve(result).catch((error) => log$4.error(`${job.id} failed: ${String(error)}`)).then(() => AsyncWorkScope.runWhenAllIdle(() => [work], () => work.drain())).finally(finish);
		return done.promise;
	}
};
//#endregion
//#region src/infra/sqlite-number.ts
const MAX_SAFE_INTEGER_BIGINT = BigInt(Number.MAX_SAFE_INTEGER);
function coerceRequiredSqliteNumber(value) {
	return typeof value === "bigint" ? Number(value) : value;
}
/** Converts a SQLite number or safely representable bigint column into a JavaScript number. */
function normalizeSqliteNumber(value) {
	if (typeof value === "bigint") {
		if (value > MAX_SAFE_INTEGER_BIGINT || value < -MAX_SAFE_INTEGER_BIGINT) return;
		return Number(value);
	}
	return typeof value === "number" ? value : void 0;
}
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
function sqliteFileBytes(pathname) {
	try {
		return fsSync.statSync(pathname).size;
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return 0;
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
//#region packages/normalization-core/src/mountinfo-path.ts
const MOUNT_PATH_OCTAL_ESCAPE_RE = /\\([0-7]{3})/g;
/** Decodes an octal-escaped path field from a Linux procfs mount table. */
function decodeMountInfoPath(value) {
	return value.replace(MOUNT_PATH_OCTAL_ESCAPE_RE, (_match, octal) => String.fromCharCode(Number.parseInt(octal, 8)));
}
//#endregion
//#region src/infra/sqlite-wal-filesystem.ts
const LINUX_NFS_SUPER_MAGIC = 26985;
const LINUX_SMB_SUPER_MAGIC = 20859;
const LINUX_CIFS_SUPER_MAGIC = 4283649346;
const LINUX_SMB2_SUPER_MAGIC = 4266872130;
const LINUX_V9FS_SUPER_MAGIC = 16914839;
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
const log$3 = createSubsystemLogger("infra/sqlite-wal");
let warnedNoCow = false;
function findExistingVolumePaths(targetPath) {
	let current = path.resolve(targetPath);
	while (true) {
		let stats;
		try {
			stats = fsSync.statSync(current);
		} catch {
			const parent = path.dirname(current);
			if (parent === current) return null;
			current = parent;
			continue;
		}
		const existingPath = fsSync.realpathSync(current);
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
			value: parseProcMountInfoEntries(fsSync.readFileSync(PROC_MOUNTINFO_PATH, "utf8"))
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
		return hasErrnoCode(error, "ETIMEDOUT") ? {
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
	if (normalized.startsWith("nfs") || NETWORK_FILESYSTEM_TYPES.has(normalized)) return "rollback";
	if (CROSS_VM_FILESYSTEM_TYPES.has(normalized) || normalized.startsWith("9p")) return "rollback";
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
		return fsSync.statfsSync(checkedPaths.canonicalPath).type === LINUX_BTRFS_SUPER_MAGIC;
	} catch {
		const mounts = readMountEntries();
		return mounts.ok && findMountEntry(checkedPaths.canonicalPath, mounts.value)?.fsType.toLowerCase() === "btrfs";
	}
}
/** Doctor requires failure to abort publication; never apply attributes to data files. */
function setSqliteDirectoryNoCow(directory) {
	if (!fsSync.statSync(directory).isDirectory()) throw new Error(`SQLite NOCOW target is not a directory: ${directory}`);
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
	if (process.platform !== "linux" || fsSync.existsSync(databasePath)) return;
	try {
		if (isSqlitePathOnBtrfs(databasePath)) setSqliteDirectoryNoCow(path.dirname(databasePath));
	} catch (error) {
		if (!warnedNoCow) {
			warnedNoCow = true;
			log$3.warn("Could not enable SQLite directory NOCOW; continuing with filesystem defaults", {
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
			return isWindowsUncPath(path.win32.normalize(fsSync.realpathSync.native(targetPath))) ? "rollback" : "wal";
		} catch {
			return "rollback";
		}
	}
	const checkedPaths = findExistingVolumePaths(targetPath);
	if (!checkedPaths) return "wal";
	const mountLookupPaths = [checkedPaths.originalPath, checkedPaths.canonicalPath];
	if (typeof fsSync.statfsSync !== "function") return combineMountEntryJournalPolicies(mountLookupPaths);
	try {
		const filesystemType = fsSync.statfsSync(checkedPaths.canonicalPath).type;
		if (filesystemType === LINUX_NFS_SUPER_MAGIC || filesystemType === LINUX_SMB_SUPER_MAGIC || filesystemType === LINUX_CIFS_SUPER_MAGIC || filesystemType === LINUX_SMB2_SUPER_MAGIC || filesystemType === LINUX_V9FS_SUPER_MAGIC) return "rollback";
	} catch {
		return combineMountEntryJournalPolicies(mountLookupPaths);
	}
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
	const freePages = () => {
		const startedAt = performance$1.now();
		try {
			return Number(database.prepare("PRAGMA freelist_count").get()?.freelist_count ?? 0);
		} finally {
			result.queryMs += performance$1.now() - startedAt;
		}
	};
	return runWithSqliteBusyTimeout(database, 0, () => {
		if (!checkpoint() || options.maxPages === 0) return result;
		const before = freePages();
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
		if (checkpoint()) result.remainingFreePages = freePages();
		return result;
	});
}
//#endregion
//#region src/infra/sqlite-wal-split-brain.ts
const PROC_SELF_FD_PATH = "/proc/self/fd";
const SQLITE_WAL_SPLIT_BRAIN_FATAL_MESSAGE = "SQLite WAL sidecar identity mismatch; terminating without SQLite cleanup";
function statSqliteSidecarTarget(pathname) {
	try {
		return fsSync.statSync(pathname, { bigint: true });
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	}
}
function isSqliteWalSidecarSplitBrain(descriptor, target) {
	return descriptor.nlink === 0n || !target || descriptor.dev !== target.dev || descriptor.ino !== target.ino;
}
function detectSqliteWalSplitBrain(databasePath) {
	let descriptors;
	try {
		descriptors = fsSync.readdirSync(PROC_SELF_FD_PATH);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	}
	const sidecarPaths = [`${databasePath}-wal`, `${databasePath}-shm`];
	for (const descriptorName of descriptors) {
		const descriptorPath = path.join(PROC_SELF_FD_PATH, descriptorName);
		let linkedPath;
		try {
			linkedPath = fsSync.readlinkSync(descriptorPath);
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) continue;
			throw error;
		}
		const sidecarPath = sidecarPaths.find((candidate) => linkedPath === candidate || linkedPath === `${candidate} (deleted)`);
		if (!sidecarPath) continue;
		let descriptor;
		try {
			descriptor = fsSync.fstatSync(Number(descriptorName), { bigint: true });
		} catch (error) {
			if (hasErrnoCode(error, "EBADF") || hasErrnoCode(error, "ENOENT")) continue;
			throw error;
		}
		try {
			if (fsSync.readlinkSync(descriptorPath) !== linkedPath) continue;
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) continue;
			throw error;
		}
		const target = statSqliteSidecarTarget(sidecarPath);
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
		fsSync.writeSync(2, `${JSON.stringify({
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
const log$2 = createSubsystemLogger("infra/sqlite-wal");
const maintenanceScheduler = new GatewayScheduler();
let nextMaintenanceId = 0;
const runInSqliteMaintenanceContext = AsyncLocalStorage.snapshot();
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
			db.exec("PRAGMA journal_mode = WAL;");
			const journalMode = readJournalModeResult(db.prepare("PRAGMA journal_mode;").get());
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
	db.exec(`PRAGMA wal_autocheckpoint = ${autoCheckpointPages};`);
	db.exec(`PRAGMA journal_size_limit = ${DEFAULT_SQLITE_WAL_JOURNAL_SIZE_LIMIT_BYTES};`);
	const tripwireDatabasePath = process.platform === "linux" && options.databasePath && fsSync.existsSync(options.databasePath) ? fsSync.realpathSync.native(options.databasePath) : void 0;
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
	const maintainPeriodic = (request, admit) => {
		if (invalidated) return { reclaimedPages: 0 };
		if (request.checkpoint) checkpointOwner.adopt(request.checkpoint);
		let reclaimedPages = 0;
		const quiet = request.maxPages === 0;
		const runTickCheckpoint = (mode) => checkpointOwner.checkpoint(mode, { quiet });
		runMaintenance(() => {
			const reclaimed = reclaimSqliteWalFreePages(db, runTickCheckpoint, {
				checkpointMode: request.checkpointMode,
				maxPages: request.maxPages,
				beforeMutation: () => admit?.("transaction"),
				onCommit: () => admit?.("commit")
			});
			const checkpointed = reclaimed.checkpointCompleted;
			if (checkpointed && reclaimed.freePagesBefore !== null && reclaimed.remainingFreePages !== null) reclaimedPages = Math.min(reclaimed.vacuumPagesRequested, reclaimed.freePagesBefore - reclaimed.remainingFreePages);
			if (checkpointed && request.checkpointMode === "PASSIVE" && (checkpointOwner.health?.walBytes ?? 0) > DEFAULT_SQLITE_WAL_JOURNAL_SIZE_LIMIT_BYTES) {
				admit?.("transaction");
				runWithSqliteBusyTimeout(db, 0, () => runTickCheckpoint("TRUNCATE"));
			}
			return checkpointed;
		});
		return {
			reclaimedPages,
			checkpoint: checkpointOwner.snapshot
		};
	};
	const maintain = createSqliteWalMaintenanceScheduler(db, maintainPeriodic, (maxPages) => timerIntervalMs > 0 && !scope.signal.aborted && !invalidated && !options.isScheduledMaintenanceSuspended?.() ? {
		maxPages,
		checkpointMode: periodicCheckpointMode,
		checkpoint: checkpointOwner.snapshot
	} : void 0, checkpointOwner.adopt, (error) => checkpointOwner.recordError(error), () => {
		const budget = nextPageBudget;
		nextPageBudget = 0;
		return budget;
	});
	if (timerIntervalMs > 0) runInSqliteMaintenanceContext(() => scope.schedule({
		id: `${maintenanceId}:periodic`,
		delayMs: timerIntervalMs,
		everyMs: timerIntervalMs,
		run: () => {
			if (tripwireDatabasePath && splitBrainDetectionEnabled) {
				let splitBrain;
				try {
					splitBrain = detectSqliteWalSplitBrain(tripwireDatabasePath);
				} catch (error) {
					splitBrainDetectionEnabled = false;
					log$2.warn("SQLite WAL split-brain detection disabled", {
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
		}
	}));
	if (checkpointTickMs > 0) runInSqliteMaintenanceContext(() => scope.schedule({
		id: `${maintenanceId}:tick`,
		delayMs: checkpointTickMs,
		everyMs: checkpointTickMs,
		run: maintain
	}));
	const beginClose = () => {
		runInSqliteMaintenanceContext(() => scope.beginClose());
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
				await runInSqliteMaintenanceContext(() => scope.stop());
			}
		},
		close: (closeOptions) => {
			beginClose();
			if (invalidated) return false;
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
//#region src/infra/sqlite-strict.ts
const DEFAULT_STRICT_MIGRATION_BUSY_TIMEOUT_MS = 5e3;
const STRICT_MIGRATION_TABLE_PREFIX = "__openclaw_strict_migration_";
const SQLITE_ROWID_ALIASES = [
	"_rowid_",
	"rowid",
	"oid"
];
function readMainTableList(db) {
	return db.prepare("PRAGMA table_list").all().filter((row) => row.schema === "main" && typeof row.name === "string" && !row.name.startsWith("sqlite_"));
}
function readTableColumns(db, tableName) {
	return db.prepare(`PRAGMA table_xinfo(${quoteSqliteIdentifier(tableName)})`).all();
}
function readVisibleColumns(db, tableName) {
	return readTableColumns(db, tableName).filter((row) => Number(row.hidden ?? 0) === 0).map((row) => {
		if (typeof row.name !== "string" || row.name.length === 0) throw new Error(`SQLite table ${tableName} has an invalid column name`);
		return row.name;
	});
}
function readTableRowidModel(db, tableName, tableRow) {
	if (Number(tableRow.wr ?? 0) === 1) return {
		alias: null,
		storage: "without-rowid"
	};
	const columns = readTableColumns(db, tableName);
	const primaryKeyColumns = columns.filter((column) => Number(column.pk ?? 0) > 0);
	const primaryKeyIndex = db.prepare(`SELECT 1 AS found FROM pragma_index_list(?) WHERE origin = 'pk' LIMIT 1`).get(tableName);
	const primaryKeyType = primaryKeyColumns[0]?.type;
	if (primaryKeyColumns.length === 1 && typeof primaryKeyType === "string" && primaryKeyType.toUpperCase() === "INTEGER" && !primaryKeyIndex) return {
		alias: null,
		storage: "integer-primary-key"
	};
	const declaredNames = new Set(columns.flatMap((column) => typeof column.name === "string" ? [column.name.toLowerCase()] : []));
	const alias = SQLITE_ROWID_ALIASES.find((candidate) => !declaredNames.has(candidate)) ?? null;
	if (!alias) throw new Error(`SQLite table ${tableName} shadows every rowid alias; its implicit rowids cannot be migrated safely`);
	return {
		alias,
		storage: "implicit"
	};
}
function readCanonicalStrictTables(schemaSql) {
	const canonical = openNodeSqliteDatabase(":memory:");
	try {
		canonical.exec(schemaSql);
		const tables = readMainTableList(canonical).filter((row) => row.type === "table");
		const nonStrict = tables.filter((row) => Number(row.strict ?? 0) !== 1).map((row) => row.name);
		if (nonStrict.length > 0) throw new Error(`Canonical SQLite schema contains non-STRICT tables: ${nonStrict.toSorted().join(", ")}`);
		return tables.map((row) => {
			const schemaRow = canonical.prepare("SELECT sql FROM sqlite_schema WHERE type = 'table' AND name = ?").get(row.name);
			if (typeof schemaRow?.sql !== "string") throw new Error(`Canonical SQLite table ${row.name} has no CREATE statement`);
			const rowidModel = readTableRowidModel(canonical, row.name, row);
			return {
				columns: readVisibleColumns(canonical, row.name),
				createSql: schemaRow.sql,
				name: row.name,
				rowidAlias: rowidModel.alias,
				rowidStorage: rowidModel.storage,
				usesAutoincrement: /\bAUTOINCREMENT\b/iu.test(schemaRow.sql)
			};
		}).toSorted((left, right) => left.name.localeCompare(right.name));
	} finally {
		canonical.close();
	}
}
function rewriteCreateTableName(createSql, replacementName) {
	const openingParen = createSql.indexOf("(");
	if (openingParen === -1) throw new Error("Canonical SQLite table CREATE statement has no column list");
	return `CREATE TABLE ${quoteSqliteIdentifier(replacementName)} ${createSql.slice(openingParen)}`;
}
function readPreservedSchemaObjects(db, tableNames) {
	return db.prepare("SELECT type, name, tbl_name, sql FROM sqlite_schema WHERE type IN ('index', 'trigger', 'view')").all().flatMap((row) => {
		if (row.type !== "index" && row.type !== "trigger" && row.type !== "view" || typeof row.name !== "string" || typeof row.tbl_name !== "string" || typeof row.sql !== "string" || row.type === "index" && !tableNames.has(row.tbl_name)) return [];
		return [{
			name: row.name,
			sql: row.sql,
			type: row.type
		}];
	}).toSorted((left, right) => {
		const typeOrder = {
			view: 0,
			index: 1,
			trigger: 2
		};
		return typeOrder[left.type] - typeOrder[right.type] || left.name.localeCompare(right.name);
	});
}
function readAutoincrementHighWater(db, tableName) {
	if (!db.prepare("SELECT 1 AS found FROM sqlite_schema WHERE type = 'table' AND name = 'sqlite_sequence'").get()) return null;
	const row = db.prepare("SELECT CAST(seq AS TEXT) AS seq FROM sqlite_sequence WHERE name = ?").get(tableName);
	if (row === void 0) return null;
	const normalized = typeof row.seq === "string" ? /^(\d+)(?:\.0+)?$/u.exec(row.seq)?.[1] : null;
	if (!normalized) throw new Error(`SQLite table ${tableName} has an invalid AUTOINCREMENT high-water mark (${typeof row.seq}: ${String(row.seq)})`);
	return normalized;
}
function restoreAutoincrementHighWater(db, tableName, previousHighWater) {
	if (previousHighWater === null) return;
	const currentHighWater = readAutoincrementHighWater(db, tableName);
	const restored = currentHighWater === null || BigInt(previousHighWater) > BigInt(currentHighWater) ? previousHighWater : currentHighWater;
	db.prepare("DELETE FROM sqlite_sequence WHERE name = ?").run(tableName);
	db.prepare("INSERT INTO sqlite_sequence (name, seq) VALUES (?, CAST(? AS INTEGER))").run(tableName, restored);
}
function assertMatchingColumns(tableName, currentColumns, canonicalColumns) {
	const current = new Set(currentColumns);
	const canonical = new Set(canonicalColumns);
	const missing = canonicalColumns.filter((column) => !current.has(column));
	const extra = currentColumns.filter((column) => !canonical.has(column));
	if (missing.length === 0 && extra.length === 0) return;
	const details = [missing.length > 0 ? `missing ${missing.join(", ")}` : "", extra.length > 0 ? `extra ${extra.join(", ")}` : ""].filter(Boolean).join("; ");
	throw new Error(`SQLite table ${tableName} does not match its canonical columns (${details})`);
}
function readForeignKeysEnabled(db) {
	const row = db.prepare("PRAGMA foreign_keys").get();
	return Number(row?.foreign_keys ?? 0) === 1;
}
/**
* Rebuild canonical non-STRICT tables inside the caller's transaction.
* Foreign-key enforcement must be disabled before BEGIN; integrity is checked
* before this function returns so any bad row or relationship rolls back.
*/
function migrateSqliteSchemaToStrictInTransaction(db, schemaSql, options = {}) {
	if (!db.isTransaction) throw new Error("SQLite STRICT schema migration requires an active transaction");
	const canonicalTables = readCanonicalStrictTables(schemaSql);
	db.exec(schemaSql);
	const currentTableRows = new Map(readMainTableList(db).filter((row) => row.type === "table").map((row) => [row.name, row]));
	const tablesToMigrate = canonicalTables.filter((table) => Number(currentTableRows.get(table.name)?.strict ?? 0) !== 1);
	if (tablesToMigrate.length === 0) return { migratedTables: [] };
	if (readForeignKeysEnabled(db)) throw new Error("SQLite STRICT schema migration requires foreign_keys=OFF before BEGIN");
	const preservedObjects = readPreservedSchemaObjects(db, new Set(tablesToMigrate.map((table) => table.name)));
	for (const object of preservedObjects) if (object.type === "trigger") db.exec(`DROP TRIGGER ${quoteSqliteIdentifier(object.name)};`);
	for (const object of preservedObjects) if (object.type === "view") db.exec(`DROP VIEW ${quoteSqliteIdentifier(object.name)};`);
	for (const [index, table] of tablesToMigrate.entries()) {
		const migrationTable = `${STRICT_MIGRATION_TABLE_PREFIX}${index}_${table.name}`;
		if (currentTableRows.has(migrationTable)) throw new Error(`SQLite STRICT migration table already exists: ${migrationTable}`);
		const currentColumns = readVisibleColumns(db, table.name);
		assertMatchingColumns(table.name, currentColumns, table.columns);
		const currentTableRow = currentTableRows.get(table.name);
		if (!currentTableRow) throw new Error(`SQLite table ${table.name} disappeared during STRICT migration`);
		const currentRowidModel = readTableRowidModel(db, table.name, currentTableRow);
		if (currentRowidModel.storage !== table.rowidStorage) throw new Error(`SQLite table ${table.name} changes rowid storage from ${currentRowidModel.storage} to ${table.rowidStorage}; refusing an identity-changing STRICT migration`);
		const previousHighWater = table.usesAutoincrement ? readAutoincrementHighWater(db, table.name) : null;
		db.exec(rewriteCreateTableName(table.createSql, migrationTable));
		const columns = table.columns.map(quoteSqliteIdentifier);
		if (table.rowidAlias) columns.unshift(quoteSqliteIdentifier(table.rowidAlias));
		const copyColumns = columns.join(", ");
		try {
			db.exec(`INSERT INTO ${quoteSqliteIdentifier(migrationTable)} (${copyColumns}) SELECT ${copyColumns} FROM ${quoteSqliteIdentifier(table.name)};`);
		} catch (error) {
			throw new Error(`Failed migrating SQLite table ${table.name} to STRICT`, { cause: error });
		}
		db.exec(`DROP TABLE ${quoteSqliteIdentifier(table.name)};`);
		db.exec(`ALTER TABLE ${quoteSqliteIdentifier(migrationTable)} RENAME TO ${quoteSqliteIdentifier(table.name)};`);
		restoreAutoincrementHighWater(db, table.name, previousHighWater);
	}
	db.exec(schemaSql);
	const findObject = db.prepare("SELECT 1 AS found FROM sqlite_schema WHERE type = ? AND name = ? LIMIT 1");
	for (const object of preservedObjects) if (!findObject.get(object.type, object.name)) db.exec(object.sql);
	assertSqliteIntegrity(db, options.databaseLabel ?? "SQLite STRICT schema migration");
	return { migratedTables: tablesToMigrate.map((table) => table.name) };
}
/** Atomically upgrade OpenClaw-owned tables described by a canonical STRICT schema. */
function migrateSqliteSchemaToStrict(db, schemaSql, options = {}) {
	if (db.isTransaction) throw new Error("SQLite STRICT schema migration cannot start inside a transaction");
	const foreignKeysWereEnabled = readForeignKeysEnabled(db);
	if (foreignKeysWereEnabled) db.exec("PRAGMA foreign_keys = OFF;");
	try {
		return runSqliteImmediateTransactionSync(db, () => migrateSqliteSchemaToStrictInTransaction(db, schemaSql, options), {
			busyTimeoutMs: options.busyTimeoutMs ?? DEFAULT_STRICT_MIGRATION_BUSY_TIMEOUT_MS,
			databaseLabel: options.databaseLabel,
			operationLabel: "sqlite.strict-schema-migration"
		});
	} finally {
		if (foreignKeysWereEnabled) db.exec("PRAGMA foreign_keys = ON;");
	}
}
[
	"insert",
	"update",
	"delete"
].map((event) => ({
	name: `memory_index_chunks_revision_after_${event}`,
	sql: `CREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_${event}
    AFTER ${event.toUpperCase()} ON memory_index_chunks
    BEGIN UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1; END;`
}));
//#endregion
//#region src/infra/sqlite-schema-ensure.ts
/** Cache additive DDL only after its owning transaction commits. */
function createSqliteSchemaEnsurer(schemaSql) {
	const committed = /* @__PURE__ */ new WeakSet();
	return {
		recordCommitted(database) {
			committed.add(database);
		},
		ensure(database) {
			if (committed.has(database)) return false;
			const install = () => {
				database.exec(schemaSql());
			};
			if (database.isTransaction) {
				install();
				return true;
			}
			runSqliteImmediateTransactionSync(database, install);
			committed.add(database);
			return false;
		}
	};
}
//#endregion
//#region src/state/openclaw-agent-schema.ts
const OPENCLAW_AGENT_SCHEMA_SQL = "-- Session storage doctrine: session_nodes.entry_json owns hot logical-session facts;\n-- session_entry_snapshots owns keyed cold values. Promoted node columns are query\n-- indexes; session_windows and their children own transcript generations.\n-- Legacy ACP provenance is private import evidence carried with its logical session.\n\nCREATE TABLE IF NOT EXISTS schema_meta (\n  meta_key TEXT NOT NULL PRIMARY KEY,\n  role TEXT NOT NULL,\n  schema_version INTEGER NOT NULL,\n  agent_id TEXT,\n  app_version TEXT,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS session_nodes (\n  session_key TEXT NOT NULL PRIMARY KEY,\n  current_session_id TEXT NOT NULL,\n  entry_json TEXT NOT NULL,\n  snapshot_revision INTEGER NOT NULL DEFAULT 0,\n  legacy_acp_migration_json TEXT,\n  entry_valid INTEGER NOT NULL DEFAULT 0 CHECK (entry_valid IN (-1, 0, 1)),\n  updated_at INTEGER NOT NULL,\n  status TEXT CHECK (status IS NULL OR status IN ('running', 'done', 'failed', 'killed', 'timeout')),\n  created_at INTEGER,\n  created_via TEXT CHECK (created_via IS NULL OR created_via IN ('operator', 'spawn', 'channel', 'cron', 'talk', 'run', 'plugin', 'internal')),\n  created_actor_type TEXT CHECK (created_actor_type IS NULL OR created_actor_type IN ('human', 'agent', 'system')),\n  created_actor_id TEXT,\n  owner_actor_type TEXT,\n  owner_actor_id TEXT,\n  owner_assigned_by_type TEXT,\n  owner_assigned_by_id TEXT,\n  owner_assigned_at INTEGER,\n  project_id TEXT,\n  parent_session_key TEXT,\n  spawned_by TEXT,\n  fork_source_session_key TEXT,\n  fork_source_session_id TEXT,\n  fork_source_entry_id TEXT,\n  label TEXT,\n  display_name TEXT,\n  category TEXT,\n  icon TEXT,\n  pinned_at INTEGER,\n  archived_at INTEGER,\n  last_read_at INTEGER,\n  last_interaction_at INTEGER,\n  last_activity_at INTEGER\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS session_entry_snapshots (\n  session_key TEXT NOT NULL,\n  field TEXT NOT NULL CHECK (field IN ('sessionDiffBaseline', 'skillsSnapshot', 'systemPromptReport')),\n  value_json TEXT NOT NULL,\n  PRIMARY KEY (session_key, field),\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE\n) STRICT, WITHOUT ROWID;\n\nCREATE TRIGGER IF NOT EXISTS session_entry_snapshots_after_insert\nAFTER INSERT ON session_entry_snapshots\nBEGIN\n  UPDATE session_nodes SET snapshot_revision = snapshot_revision + 1\n  WHERE session_key = NEW.session_key;\nEND;\n\nCREATE TRIGGER IF NOT EXISTS session_entry_snapshots_after_update\nAFTER UPDATE OF session_key, field, value_json ON session_entry_snapshots\nWHEN NEW.session_key IS NOT OLD.session_key\n  OR NEW.field IS NOT OLD.field OR NEW.value_json IS NOT OLD.value_json\nBEGIN\n  UPDATE session_nodes SET snapshot_revision = snapshot_revision + 1\n  WHERE session_key IN (OLD.session_key, NEW.session_key);\nEND;\n\nCREATE TRIGGER IF NOT EXISTS session_entry_snapshots_after_delete\nAFTER DELETE ON session_entry_snapshots\nBEGIN\n  UPDATE session_nodes SET snapshot_revision = snapshot_revision + 1\n  WHERE session_key = OLD.session_key;\nEND;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_updated_at\n  ON session_nodes(updated_at DESC, session_key);\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_last_interaction_at\n  ON session_nodes(last_interaction_at DESC, session_key);\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_label\n  ON session_nodes(label, session_key)\n  WHERE label IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_parent_session_key\n  ON session_nodes(parent_session_key, session_key);\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_spawned_by\n  ON session_nodes(spawned_by, session_key);\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_status\n  ON session_nodes(status, session_key)\n  WHERE status IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_archived_at\n  ON session_nodes(archived_at, session_key)\n  WHERE archived_at IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_active\n  ON session_nodes(session_key)\n  WHERE archived_at IS NULL;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_current_session_id\n  ON session_nodes(current_session_id);\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_entry_valid_pending\n  ON session_nodes(session_key)\n  WHERE entry_valid = 0;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_entry_not_valid\n  ON session_nodes(session_key)\n  WHERE entry_valid != 1;\n\nCREATE TABLE IF NOT EXISTS session_participants (\n  session_key TEXT NOT NULL,\n  identity_namespace TEXT NOT NULL,\n  actor_id TEXT NOT NULL,\n  contribution_count INTEGER NOT NULL,\n  first_prompted_at INTEGER,\n  last_prompted_at INTEGER,\n  PRIMARY KEY (session_key, identity_namespace, actor_id),\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS session_key_contract (\n  id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),\n  main_key TEXT NOT NULL,\n  canonical_ready TEXT,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nINSERT OR IGNORE INTO session_key_contract (id, main_key, updated_at) VALUES (1, 'main', 0);\n\nCREATE TRIGGER IF NOT EXISTS session_nodes_entry_valid_after_insert\nAFTER INSERT ON session_nodes\nBEGIN\n  UPDATE session_nodes SET entry_valid = 0 WHERE session_key = NEW.session_key;\nEND;\n\nCREATE TRIGGER IF NOT EXISTS session_nodes_entry_valid_after_entry_update\nAFTER UPDATE OF entry_json ON session_nodes\nBEGIN\n  UPDATE session_nodes SET entry_valid = 0 WHERE session_key = NEW.session_key;\nEND;\n\nCREATE TRIGGER IF NOT EXISTS session_nodes_entry_valid_after_identity_update\nAFTER UPDATE OF current_session_id, updated_at ON session_nodes\nBEGIN\n  UPDATE session_nodes SET entry_valid = 0 WHERE session_key = NEW.session_key;\nEND;\n\nCREATE TABLE IF NOT EXISTS session_windows (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  session_key TEXT NOT NULL,\n  previous_session_id TEXT,\n  reason TEXT CHECK (reason IS NULL OR reason IN ('initial', 'reset', 'rollover', 'fork', 'rewind', 'switch', 'recovery', 'compaction')),\n  session_scope TEXT NOT NULL DEFAULT 'conversation' CHECK (session_scope IN ('conversation', 'shared-main', 'group', 'channel')),\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  transcript_updated_at INTEGER DEFAULT NULL,\n  transcript_observed_at INTEGER DEFAULT NULL,\n  session_entry_provenance INTEGER NOT NULL DEFAULT 0 CHECK (session_entry_provenance IN (0, 1)),\n  acp_owned INTEGER NOT NULL DEFAULT 0 CHECK (acp_owned IN (0, 1)),\n  plugin_owner_id TEXT,\n  hook_external_content_source TEXT CHECK (hook_external_content_source IS NULL OR hook_external_content_source IN ('gmail', 'webhook')),\n  started_at INTEGER,\n  ended_at INTEGER,\n  status TEXT CHECK (status IS NULL OR status IN ('running', 'done', 'failed', 'killed', 'timeout')),\n  chat_type TEXT CHECK (chat_type IS NULL OR chat_type IN ('direct', 'group', 'channel')),\n  channel TEXT,\n  account_id TEXT,\n  primary_conversation_id TEXT,\n  model_provider TEXT,\n  model TEXT,\n  agent_harness_id TEXT,\n  parent_session_key TEXT,\n  spawned_by TEXT,\n  display_name TEXT,\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE,\n  FOREIGN KEY (primary_conversation_id) REFERENCES conversations(conversation_id) ON DELETE SET NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_windows_updated_at\n  ON session_windows(updated_at DESC, session_id);\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_windows_session_key\n  ON session_windows(session_key, updated_at DESC, session_id);\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_windows_created_at\n  ON session_windows(created_at DESC, session_id);\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_windows_conversation\n  ON session_windows(primary_conversation_id, updated_at DESC, session_id)\n  WHERE primary_conversation_id IS NOT NULL;\n\n-- No foreign key: node triggers settle key renames and deletion even while a\n-- maintenance owner has disabled foreign-key enforcement.\nCREATE TABLE IF NOT EXISTS session_canonical_validation_pending (\n  session_key TEXT NOT NULL PRIMARY KEY\n) STRICT;\n\n-- Avoid trigger-local conflict clauses: SQLite inherits the outer writer's\n-- conflict policy, including writers that predate this validation projection.\nCREATE TRIGGER IF NOT EXISTS session_nodes_canonical_pending_after_insert\nAFTER INSERT ON session_nodes\nBEGIN\n  INSERT INTO session_canonical_validation_pending (session_key)\n  SELECT NEW.session_key\n  WHERE NOT EXISTS (\n    SELECT 1 FROM session_canonical_validation_pending WHERE session_key = NEW.session_key\n  );\nEND;\n\nCREATE TRIGGER IF NOT EXISTS session_nodes_canonical_pending_after_update\nAFTER UPDATE OF session_key, current_session_id, entry_json, entry_valid,\n  parent_session_key, spawned_by, fork_source_session_key ON session_nodes\nWHEN OLD.session_key IS NOT NEW.session_key\n  OR OLD.current_session_id IS NOT NEW.current_session_id\n  OR OLD.entry_json IS NOT NEW.entry_json\n  OR OLD.entry_valid IS NOT NEW.entry_valid\n  OR OLD.parent_session_key IS NOT NEW.parent_session_key\n  OR OLD.spawned_by IS NOT NEW.spawned_by\n  OR OLD.fork_source_session_key IS NOT NEW.fork_source_session_key\nBEGIN\n  DELETE FROM session_canonical_validation_pending\n  WHERE session_key = OLD.session_key AND OLD.session_key IS NOT NEW.session_key;\n  INSERT INTO session_canonical_validation_pending (session_key)\n  SELECT NEW.session_key\n  WHERE NOT EXISTS (\n    SELECT 1 FROM session_canonical_validation_pending WHERE session_key = NEW.session_key\n  );\nEND;\n\nCREATE TRIGGER IF NOT EXISTS session_nodes_canonical_pending_after_delete\nAFTER DELETE ON session_nodes\nBEGIN\n  DELETE FROM session_canonical_validation_pending WHERE session_key = OLD.session_key;\nEND;\n\nCREATE TRIGGER IF NOT EXISTS session_windows_canonical_pending_after_insert\nAFTER INSERT ON session_windows\nBEGIN\n  INSERT INTO session_canonical_validation_pending (session_key)\n  SELECT node.session_key FROM session_nodes AS node\n  WHERE node.current_session_id = NEW.session_id\n    AND NOT EXISTS (\n      SELECT 1 FROM session_canonical_validation_pending AS pending\n      WHERE pending.session_key = node.session_key\n    );\nEND;\n\nCREATE TRIGGER IF NOT EXISTS session_windows_canonical_pending_after_update\nAFTER UPDATE OF session_id, session_key ON session_windows\nWHEN OLD.session_id IS NOT NEW.session_id OR OLD.session_key IS NOT NEW.session_key\nBEGIN\n  INSERT INTO session_canonical_validation_pending (session_key)\n  SELECT node.session_key FROM session_nodes AS node\n  WHERE node.current_session_id IN (OLD.session_id, NEW.session_id)\n    AND NOT EXISTS (\n      SELECT 1 FROM session_canonical_validation_pending AS pending\n      WHERE pending.session_key = node.session_key\n    );\nEND;\n\nCREATE TRIGGER IF NOT EXISTS session_windows_canonical_pending_after_delete\nAFTER DELETE ON session_windows\nBEGIN\n  INSERT INTO session_canonical_validation_pending (session_key)\n  SELECT node.session_key FROM session_nodes AS node\n  WHERE node.current_session_id = OLD.session_id\n    AND NOT EXISTS (\n      SELECT 1 FROM session_canonical_validation_pending AS pending\n      WHERE pending.session_key = node.session_key\n    );\nEND;\n\nCREATE TRIGGER IF NOT EXISTS session_key_contract_canonical_pending_after_insert\nAFTER INSERT ON session_key_contract\nBEGIN\n  INSERT INTO session_canonical_validation_pending (session_key)\n  SELECT node.session_key FROM session_nodes AS node\n  WHERE NOT EXISTS (\n    SELECT 1 FROM session_canonical_validation_pending AS pending\n    WHERE pending.session_key = node.session_key\n  );\nEND;\n\nCREATE TRIGGER IF NOT EXISTS session_key_contract_canonical_pending_after_update\nAFTER UPDATE OF main_key ON session_key_contract\nWHEN OLD.main_key IS NOT NEW.main_key\nBEGIN\n  INSERT INTO session_canonical_validation_pending (session_key)\n  SELECT node.session_key FROM session_nodes AS node\n  WHERE NOT EXISTS (\n    SELECT 1 FROM session_canonical_validation_pending AS pending\n    WHERE pending.session_key = node.session_key\n  );\nEND;\n\nCREATE TRIGGER IF NOT EXISTS session_key_contract_canonical_pending_after_delete\nAFTER DELETE ON session_key_contract\nBEGIN\n  INSERT INTO session_canonical_validation_pending (session_key)\n  SELECT node.session_key FROM session_nodes AS node\n  WHERE NOT EXISTS (\n    SELECT 1 FROM session_canonical_validation_pending AS pending\n    WHERE pending.session_key = node.session_key\n  );\nEND;\n\nCREATE TABLE IF NOT EXISTS conversations (\n  conversation_id TEXT NOT NULL PRIMARY KEY,\n  channel TEXT NOT NULL,\n  account_id TEXT NOT NULL,\n  kind TEXT NOT NULL CHECK (kind IN ('direct', 'group', 'channel')),\n  peer_id TEXT NOT NULL,\n  delivery_target TEXT NOT NULL,\n  parent_conversation_id TEXT,\n  thread_id TEXT,\n  native_channel_id TEXT,\n  native_direct_user_id TEXT,\n  label TEXT,\n  metadata_json TEXT,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_conversations_lookup\n  ON conversations(channel, account_id, kind, peer_id, thread_id);\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_agent_conversations_identity\n  ON conversations(\n    channel,\n    account_id,\n    kind,\n    peer_id,\n    IFNULL(parent_conversation_id, ''),\n    IFNULL(thread_id, '')\n  );\n\nCREATE INDEX IF NOT EXISTS idx_agent_conversations_updated\n  ON conversations(updated_at DESC, conversation_id);\n\nCREATE TABLE IF NOT EXISTS conversation_deliveries (\n  operation_id TEXT NOT NULL PRIMARY KEY,\n  operation_kind TEXT NOT NULL CHECK (operation_kind IN ('send', 'turn')),\n  conversation_id TEXT NOT NULL,\n  source_session_key TEXT,\n  message_hash TEXT NOT NULL,\n  status TEXT NOT NULL CHECK (status IN ('created', 'queued', 'sent', 'suppressed', 'rejected', 'unknown', 'replied')),\n  prepared_message_id TEXT,\n  platform_message_id TEXT,\n  queue_id TEXT,\n  rejection_error TEXT,\n  reply_message_id TEXT,\n  reply_to_id TEXT,\n  reply_thread_id TEXT,\n  reply_text TEXT,\n  reply_timestamp INTEGER,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  CHECK (\n    (status = 'rejected' AND rejection_error IS NOT NULL) OR\n    (status != 'rejected' AND rejection_error IS NULL)\n  ),\n  FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_conversation_deliveries_reply\n  ON conversation_deliveries(conversation_id, platform_message_id, prepared_message_id)\n  WHERE status IN ('queued', 'sent', 'replied');\n\nCREATE INDEX IF NOT EXISTS idx_agent_conversation_deliveries_updated\n  ON conversation_deliveries(updated_at DESC, operation_id);\n\nCREATE TABLE IF NOT EXISTS session_conversations (\n  session_id TEXT NOT NULL,\n  conversation_id TEXT NOT NULL,\n  role TEXT NOT NULL DEFAULT 'primary' CHECK (role IN ('primary', 'participant', 'related')),\n  route_context_json TEXT,\n  first_seen_at INTEGER NOT NULL,\n  last_seen_at INTEGER NOT NULL,\n  PRIMARY KEY (session_id, conversation_id, role),\n  FOREIGN KEY (session_id) REFERENCES \"session_windows\"(session_id) ON DELETE CASCADE,\n  FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE\n) STRICT;\n\n-- Older same-version writers preserve the envelope while updating the association.\nCREATE TRIGGER IF NOT EXISTS session_conversations_route_context_invalidate_after_update\nAFTER UPDATE OF role, last_seen_at ON session_conversations\nWHEN NEW.route_context_json IS OLD.route_context_json\nBEGIN\n  UPDATE session_conversations\n  SET route_context_json = NULL\n  WHERE session_id = NEW.session_id\n    AND conversation_id = NEW.conversation_id\n    AND role = NEW.role;\nEND;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_conversations_conversation\n  ON session_conversations(conversation_id, last_seen_at DESC, session_id);\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_agent_session_conversations_primary\n  ON session_conversations(session_id)\n  WHERE role = 'primary';\n\nCREATE TABLE IF NOT EXISTS session_members (\n  session_key TEXT NOT NULL,\n  identity_id TEXT NOT NULL,\n  added_by TEXT NOT NULL,\n  added_at INTEGER NOT NULL,\n  PRIMARY KEY (session_key, identity_id),\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_members_identity\n  ON session_members(identity_id, session_key);\n\nCREATE TABLE IF NOT EXISTS session_suggestions (\n  id TEXT PRIMARY KEY,\n  session_key TEXT NOT NULL,\n  author_id TEXT NOT NULL,\n  author_label TEXT,\n  text TEXT NOT NULL,\n  created_at INTEGER NOT NULL,\n  state TEXT NOT NULL CHECK (state IN ('pending', 'accepted', 'dismissed')),\n  dispatch_token TEXT,\n  dispatch_started_at INTEGER,\n  dispatch_resolution TEXT CHECK (dispatch_resolution IN ('send', 'queue', 'edit', 'dismiss')),\n  CHECK (\n    (dispatch_token IS NULL AND dispatch_started_at IS NULL AND dispatch_resolution IS NULL)\n    OR (dispatch_token IS NOT NULL AND dispatch_started_at IS NOT NULL AND dispatch_resolution IS NOT NULL)\n  ),\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_suggestions_session_state_created\n  ON session_suggestions(session_key, state, created_at, id);\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_suggestions_author_created\n  ON session_suggestions(author_id, created_at, id);\n\nCREATE TABLE IF NOT EXISTS session_reactions (\n  session_key TEXT NOT NULL,\n  session_id TEXT NOT NULL,\n  message_id TEXT NOT NULL,\n  emoji TEXT NOT NULL,\n  identity_id TEXT NOT NULL,\n  identity_label TEXT,\n  created_at INTEGER NOT NULL,\n  PRIMARY KEY (session_key, session_id, message_id, emoji, identity_id),\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_reactions_message\n  ON session_reactions(session_key, session_id, message_id);\n\nCREATE TABLE IF NOT EXISTS board_tabs (\n  session_key TEXT NOT NULL,\n  tab_id TEXT NOT NULL,\n  title TEXT NOT NULL,\n  position INTEGER NOT NULL CHECK (position >= 0),\n  chat_dock TEXT NOT NULL DEFAULT 'right' CHECK (chat_dock IN ('left', 'right', 'bottom', 'hidden')),\n  created_by TEXT NOT NULL CHECK (created_by IN ('user', 'agent')),\n  revision INTEGER NOT NULL CHECK (revision >= 0),\n  PRIMARY KEY (session_key, tab_id),\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS board_widgets (\n  session_key TEXT NOT NULL,\n  name TEXT NOT NULL,\n  tab_id TEXT NOT NULL,\n  title TEXT,\n  content_kind TEXT NOT NULL CHECK (content_kind IN ('html', 'mcp-app', 'plugin')),\n  html BLOB,\n  descriptor_json TEXT,\n  sha256 TEXT NOT NULL,\n  view_generation TEXT,\n  revision INTEGER NOT NULL CHECK (revision >= 1),\n  size_w INTEGER NOT NULL CHECK (size_w BETWEEN 1 AND 12),\n  size_h INTEGER NOT NULL CHECK (size_h BETWEEN 1 AND 20),\n  position INTEGER NOT NULL CHECK (position >= 0),\n  manifest TEXT NOT NULL DEFAULT '{}',\n  grant_state TEXT NOT NULL DEFAULT 'none' CHECK (grant_state IN ('none', 'pending', 'granted', 'rejected')),\n  granted_sha TEXT,\n  created_by TEXT NOT NULL CHECK (created_by IN ('user', 'agent')),\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (session_key, name),\n  FOREIGN KEY (session_key, tab_id) REFERENCES board_tabs(session_key, tab_id) ON DELETE CASCADE,\n  CHECK (\n    (content_kind = 'html' AND html IS NOT NULL AND descriptor_json IS NULL AND view_generation IS NOT NULL) OR\n    (content_kind = 'mcp-app' AND html IS NULL AND descriptor_json IS NOT NULL AND view_generation IS NULL) OR\n    (content_kind = 'plugin' AND html IS NULL AND descriptor_json IS NOT NULL AND view_generation IS NULL)\n  )\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_board_widgets_tab_position\n  ON board_widgets(session_key, tab_id, position);\n\nCREATE TABLE IF NOT EXISTS session_progress_cards (\n  session_key TEXT NOT NULL PRIMARY KEY,\n  markdown TEXT,\n  steps_json TEXT,\n  revision INTEGER NOT NULL,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS heartbeat_outcomes (\n  session_key TEXT NOT NULL PRIMARY KEY,\n  run_session_key TEXT NOT NULL,\n  outcome TEXT NOT NULL CHECK (outcome IN ('progress', 'done', 'blocked', 'needs_attention')),\n  summary TEXT NOT NULL,\n  response_reason TEXT,\n  priority TEXT CHECK (priority IS NULL OR priority IN ('low', 'normal', 'high')),\n  next_check TEXT,\n  task_names_json TEXT,\n  wake_source TEXT,\n  wake_reason TEXT,\n  occurred_at INTEGER NOT NULL,\n  context_run_id TEXT,\n  context_claimed_at INTEGER,\n  updated_at INTEGER NOT NULL,\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS message_tool_run_outcomes (\n  id INTEGER PRIMARY KEY,\n  run_id TEXT NOT NULL,\n  session_key TEXT NOT NULL,\n  agent_id TEXT NOT NULL,\n  provider TEXT NOT NULL,\n  model TEXT NOT NULL,\n  outcome TEXT NOT NULL CHECK (outcome IN ('tool_delivered', 'mute')),\n  run_status TEXT NOT NULL CHECK (run_status IN ('completed', 'errored', 'aborted')),\n  occurred_at INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_message_tool_run_outcomes_occurred\n  ON message_tool_run_outcomes(occurred_at DESC, id DESC);\n\n-- Receipts outlive Goal clear and session reset so a delayed retry cannot recreate a Goal.\n-- They intentionally have no session FK; bounded retention belongs to the operation owner.\nCREATE TABLE IF NOT EXISTS session_goal_operations (\n  session_key TEXT NOT NULL,\n  operation_id TEXT NOT NULL,\n  session_id TEXT NOT NULL,\n  request_fingerprint TEXT NOT NULL,\n  result_json TEXT NOT NULL,\n  expires_at INTEGER NOT NULL,\n  PRIMARY KEY (session_key, operation_id)\n) STRICT;\nCREATE INDEX IF NOT EXISTS idx_agent_session_goal_operations_expiry\n  ON session_goal_operations(expires_at);\n\nCREATE TABLE IF NOT EXISTS transcript_events (\n  session_id TEXT NOT NULL,\n  seq INTEGER NOT NULL,\n  event_json TEXT,\n  created_at INTEGER NOT NULL,\n  event_zstd BLOB,\n  event_utf8_bytes INTEGER CHECK (event_utf8_bytes IS NULL OR event_utf8_bytes >= 0),\n  navigation_json TEXT,\n  PRIMARY KEY (session_id, seq),\n  FOREIGN KEY (session_id) REFERENCES \"session_windows\"(session_id) ON DELETE CASCADE,\n  CHECK (\n    (event_json IS NOT NULL AND event_zstd IS NULL)\n    OR (\n      event_json IS NULL AND event_zstd IS NOT NULL\n      AND event_utf8_bytes IS NOT NULL\n      AND event_utf8_bytes BETWEEN 1 AND 4194304\n      AND length(event_zstd) BETWEEN 1 AND 4194304\n      AND navigation_json IS NOT NULL\n    )\n  ),\n  CHECK (\n    navigation_json IS NULL OR CASE WHEN json_valid(navigation_json) THEN coalesce(\n      octet_length(navigation_json) <= 16384\n      AND json_type(navigation_json, '$.version') = 'integer'\n      AND json_extract(navigation_json, '$.version') = 1\n      AND json_type(navigation_json, '$.report') = 'object'\n      AND json_extract(navigation_json, '$.report.kind') IN ('canonical', 'leaf', 'link', 'ignored')\n      AND json_type(navigation_json, '$.navigation') = 'object'\n      AND json_type(navigation_json, '$.reset') = 'object'\n      AND json_type(navigation_json, '$.model') = 'object'\n      AND json_type(navigation_json, '$.modelBytes') = 'integer'\n      AND json_extract(navigation_json, '$.modelBytes') BETWEEN 0 AND 4194304\n      AND json_type(navigation_json, '$.modelWithoutCheckpointBytes') = 'integer'\n      AND json_extract(navigation_json, '$.modelWithoutCheckpointBytes') BETWEEN 0 AND 4194304\n      AND json_type(navigation_json, '$.withoutCustomDataBytes') = 'integer'\n      AND json_extract(navigation_json, '$.withoutCustomDataBytes') BETWEEN 0 AND 4194304,\n      0) ELSE 0 END\n  )\n) STRICT;\n\n-- Canonical cold-tier owner for reclaimed transcript generations. The derived\n-- .deleted/.reset file may be recreated from this row after a crash.\nCREATE TABLE IF NOT EXISTS session_transcript_archives (\n  session_id TEXT NOT NULL,\n  generation TEXT NOT NULL,\n  session_key TEXT NOT NULL,\n  reason TEXT NOT NULL CHECK (reason IN ('deleted', 'reset')),\n  encoding TEXT NOT NULL CHECK (encoding IN ('identity', 'zstd')),\n  archive_blob BLOB NOT NULL,\n  archive_sha256 TEXT NOT NULL CHECK (length(archive_sha256) = 64),\n  archive_name TEXT NOT NULL UNIQUE,\n  created_at INTEGER NOT NULL,\n  published_at INTEGER,\n  publish_attempts INTEGER NOT NULL DEFAULT 0 CHECK (publish_attempts >= 0),\n  last_publish_attempt_at INTEGER,\n  last_publish_error TEXT,\n  PRIMARY KEY (session_id, generation),\n  CHECK (archive_name NOT LIKE '%/%' AND archive_name NOT LIKE '%\\%')\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_transcript_archives_pending\n  ON session_transcript_archives(created_at, session_id, generation)\n  WHERE published_at IS NULL;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_transcript_archives_retention\n  ON session_transcript_archives(created_at, session_id, generation);\n\nCREATE TABLE IF NOT EXISTS session_transcript_cold_archives (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  generation TEXT NOT NULL,\n  archive_name TEXT NOT NULL UNIQUE,\n  archive_sha256 TEXT NOT NULL CHECK (length(archive_sha256) = 64),\n  event_count INTEGER NOT NULL CHECK (event_count >= 1),\n  raw_bytes INTEGER NOT NULL CHECK (raw_bytes >= 0),\n  archive_bytes INTEGER NOT NULL CHECK (archive_bytes >= 0),\n  last_seq INTEGER NOT NULL,\n  archived_at INTEGER NOT NULL,\n  storage TEXT NOT NULL CHECK (storage IN ('file', 'sqlite')),\n  archive_blob BLOB,\n  FOREIGN KEY (session_id) REFERENCES \"session_windows\"(session_id) ON DELETE CASCADE,\n  CHECK (length(archive_name) > 0 AND archive_name NOT IN ('.', '..') AND archive_name NOT LIKE '%/%' AND archive_name NOT LIKE '%\\%'),\n  CHECK ((storage = 'file' AND archive_blob IS NULL) OR (storage = 'sqlite' AND archive_blob IS NOT NULL))\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS transcript_rewrite_watermarks (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  generation TEXT NOT NULL,\n  updated_at INTEGER NOT NULL,\n  FOREIGN KEY (session_id) REFERENCES \"session_windows\"(session_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS trajectory_runtime_events (\n  session_id TEXT NOT NULL,\n  seq INTEGER NOT NULL,\n  run_id TEXT,\n  event_json TEXT NOT NULL,\n  created_at INTEGER NOT NULL,\n  PRIMARY KEY (session_id, seq),\n  FOREIGN KEY (session_id) REFERENCES \"session_windows\"(session_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_trajectory_runtime_run\n  ON trajectory_runtime_events(session_id, run_id, seq)\n  WHERE run_id IS NOT NULL;\n\nCREATE TABLE IF NOT EXISTS acp_parent_stream_events (\n  session_id TEXT NOT NULL,\n  run_id TEXT NOT NULL,\n  seq INTEGER NOT NULL,\n  event_json TEXT NOT NULL,\n  created_at INTEGER NOT NULL,\n  PRIMARY KEY (session_id, run_id, seq),\n  FOREIGN KEY (session_id) REFERENCES \"session_windows\"(session_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_acp_parent_stream_run\n  ON acp_parent_stream_events(run_id, seq);\n\nCREATE TABLE IF NOT EXISTS transcript_event_identities (\n  session_id TEXT NOT NULL,\n  event_id TEXT NOT NULL,\n  seq INTEGER NOT NULL,\n  event_type TEXT,\n  parent_id TEXT,\n  message_idempotency_key TEXT,\n  created_at INTEGER NOT NULL,\n  PRIMARY KEY (session_id, event_id),\n  FOREIGN KEY (session_id, seq) REFERENCES transcript_events(session_id, seq) ON DELETE CASCADE\n) STRICT;\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_agent_transcript_message_idempotency\n  ON transcript_event_identities(session_id, message_idempotency_key)\n  WHERE message_idempotency_key IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_agent_transcript_event_identity_sequence\n  ON transcript_event_identities(session_id, seq);\n\nCREATE INDEX IF NOT EXISTS idx_agent_transcript_event_parent\n  ON transcript_event_identities(session_id, parent_id)\n  WHERE parent_id IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_agent_transcript_event_sequence\n  ON transcript_event_identities(session_id, event_type, seq DESC);\n\nCREATE TABLE IF NOT EXISTS context_engine_turn_outbox (\n  advancement_key TEXT NOT NULL PRIMARY KEY,\n  engine_id TEXT NOT NULL,\n  owner_plugin_id TEXT,\n  session_id TEXT NOT NULL,\n  payload_json TEXT NOT NULL,\n  attempt_count INTEGER NOT NULL DEFAULT 0,\n  last_attempt_at INTEGER,\n  last_error TEXT,\n  created_at INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_context_engine_turn_outbox_engine\n  ON context_engine_turn_outbox(engine_id, created_at);\n\nCREATE TABLE IF NOT EXISTS cache_entries (\n  scope TEXT NOT NULL,\n  key TEXT NOT NULL,\n  value_json TEXT,\n  blob BLOB,\n  expires_at INTEGER,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (scope, key)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_cache_expiry\n  ON cache_entries(scope, expires_at, key)\n  WHERE expires_at IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_agent_cache_updated\n  ON cache_entries(scope, updated_at DESC, key);\n\nCREATE TABLE IF NOT EXISTS auth_profile_store (\n  store_key TEXT NOT NULL PRIMARY KEY,\n  store_json TEXT NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS auth_profile_state (\n  state_key TEXT NOT NULL PRIMARY KEY,\n  state_json TEXT NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS memory_index_meta (\n  key TEXT PRIMARY KEY,\n  value TEXT NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS memory_index_sources (\n  id INTEGER PRIMARY KEY,\n  path TEXT NOT NULL,\n  source TEXT NOT NULL DEFAULT 'memory',\n  hash TEXT NOT NULL,\n  mtime REAL NOT NULL,\n  size INTEGER NOT NULL,\n  UNIQUE (path, source)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS memory_index_chunks (\n  chunk_rowid INTEGER PRIMARY KEY,\n  id TEXT NOT NULL UNIQUE,\n  path TEXT NOT NULL,\n  source TEXT NOT NULL DEFAULT 'memory',\n  start_line INTEGER NOT NULL,\n  end_line INTEGER NOT NULL,\n  hash TEXT NOT NULL,\n  model TEXT NOT NULL,\n  text TEXT NOT NULL,\n  embedding BLOB NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS memory_index_chunk_recall_metadata (\n  chunk_id TEXT PRIMARY KEY,\n  importance INTEGER CHECK (importance IS NULL OR importance BETWEEN 1 AND 10),\n  triggers TEXT,\n  project_key TEXT,\n  FOREIGN KEY (chunk_id) REFERENCES memory_index_chunks(id) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS memory_index_chunk_provenance (\n  chunk_id TEXT PRIMARY KEY,\n  origin_class TEXT NOT NULL CHECK (origin_class IN ('owner', 'agent', 'untrusted', 'system')),\n  session_kind TEXT NOT NULL CHECK (session_kind IN ('interactive', 'cron', 'heartbeat', 'subagent', 'unknown')),\n  observed_at INTEGER NOT NULL,\n  supersedes_key TEXT,\n  FOREIGN KEY (chunk_id) REFERENCES memory_index_chunks(id) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS memory_entry_origins (\n  entry_key TEXT NOT NULL,\n  agent_id TEXT NOT NULL,\n  session_id TEXT NOT NULL,\n  session_key TEXT,\n  origin_class TEXT NOT NULL CHECK (origin_class IN ('owner', 'agent', 'untrusted', 'system')),\n  observed_at INTEGER NOT NULL,\n  PRIMARY KEY (entry_key, agent_id, session_id)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS memory_session_tombstones (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  agent_id TEXT NOT NULL,\n  reason TEXT NOT NULL,\n  created_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS memory_embedding_cache (\n  provider TEXT NOT NULL,\n  model TEXT NOT NULL,\n  provider_key TEXT NOT NULL,\n  hash TEXT NOT NULL,\n  embedding BLOB NOT NULL,\n  dims INTEGER,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (provider, model, provider_key, hash)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS memory_index_state (\n  id INTEGER PRIMARY KEY CHECK (id = 1),\n  revision INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS standing_intents (\n  intent_key INTEGER PRIMARY KEY,\n  id TEXT NOT NULL UNIQUE,\n  description TEXT NOT NULL,\n  trigger_keywords TEXT NOT NULL,\n  trigger_embedding TEXT,\n  channel_scope TEXT,\n  sender_scope TEXT,\n  creator_sender TEXT CHECK (creator_sender IS NULL OR length(trim(creator_sender)) > 0),\n  status TEXT NOT NULL CHECK (status IN ('pending', 'armed', 'fired', 'done', 'cancelled', 'expired')),\n  expires_at INTEGER NOT NULL,\n  max_fires INTEGER NOT NULL CHECK (max_fires > 0),\n  fire_count INTEGER NOT NULL DEFAULT 0 CHECK (fire_count >= 0),\n  cooldown_seconds INTEGER NOT NULL DEFAULT 86400 CHECK (cooldown_seconds >= 0),\n  last_fired_at INTEGER,\n  created_at INTEGER NOT NULL,\n  source_session_id TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_standing_intents_lifecycle\n  ON standing_intents(status, expires_at, last_fired_at);\n\nCREATE INDEX IF NOT EXISTS idx_standing_intents_scope\n  ON standing_intents(status, channel_scope, sender_scope);\n\nCREATE VIRTUAL TABLE IF NOT EXISTS standing_intents_fts USING fts5(\n  trigger_keywords,\n  content = 'standing_intents',\n  content_rowid = 'intent_key',\n  tokenize = 'unicode61 remove_diacritics 2'\n);\n\nCREATE TRIGGER IF NOT EXISTS standing_intents_fts_after_insert\nAFTER INSERT ON standing_intents\nBEGIN\n  INSERT INTO standing_intents_fts(rowid, trigger_keywords)\n  VALUES (new.intent_key, new.trigger_keywords);\nEND;\n\nCREATE TRIGGER IF NOT EXISTS standing_intents_fts_after_delete\nAFTER DELETE ON standing_intents\nBEGIN\n  INSERT INTO standing_intents_fts(standing_intents_fts, rowid, trigger_keywords)\n  VALUES ('delete', old.intent_key, old.trigger_keywords);\nEND;\n\nCREATE TRIGGER IF NOT EXISTS standing_intents_fts_after_update\nAFTER UPDATE OF trigger_keywords ON standing_intents\nBEGIN\n  INSERT INTO standing_intents_fts(standing_intents_fts, rowid, trigger_keywords)\n  VALUES ('delete', old.intent_key, old.trigger_keywords);\n  INSERT INTO standing_intents_fts(rowid, trigger_keywords)\n  VALUES (new.intent_key, new.trigger_keywords);\nEND;\n\nCREATE TABLE IF NOT EXISTS session_transcript_index_state (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  indexed_seq INTEGER NOT NULL,\n  leaf_event_id TEXT,\n  needs_rebuild INTEGER NOT NULL DEFAULT 0,\n  active_event_count INTEGER NOT NULL DEFAULT 0,\n  active_message_count INTEGER NOT NULL DEFAULT 0,\n  updated_at INTEGER NOT NULL,\n  FOREIGN KEY (session_id) REFERENCES session_windows(session_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS session_transcript_active_events (\n  session_id TEXT NOT NULL,\n  active_position INTEGER NOT NULL CHECK (active_position >= 0),\n  event_seq INTEGER NOT NULL,\n  message_position INTEGER CHECK (message_position IS NULL OR message_position >= 0),\n  context_eligible INTEGER,\n  PRIMARY KEY (session_id, active_position),\n  FOREIGN KEY (session_id, event_seq) REFERENCES transcript_events(session_id, seq) ON DELETE CASCADE\n) STRICT;\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_agent_transcript_active_event_seq\n  ON session_transcript_active_events(session_id, event_seq);\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_agent_transcript_active_messages\n  ON session_transcript_active_events(session_id, message_position)\n  WHERE message_position IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_agent_transcript_context_pending\n  ON session_transcript_active_events(session_id)\n  WHERE context_eligible IS NULL;\n\nCREATE VIRTUAL TABLE IF NOT EXISTS session_transcript_fts USING fts5(\n  text,\n  session_id UNINDEXED,\n  message_id UNINDEXED,\n  role UNINDEXED,\n  timestamp UNINDEXED,\n  tokenize = 'unicode61 remove_diacritics 2'\n);\n\nCREATE TABLE IF NOT EXISTS session_transcript_fts_rows (\n  id INTEGER PRIMARY KEY,\n  session_id TEXT NOT NULL,\n  message_id TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_session_transcript_fts_rows_session_message\n  ON session_transcript_fts_rows(session_id, message_id);\n\nCREATE TRIGGER IF NOT EXISTS session_transcript_fts_rows_after_delete\nAFTER DELETE ON session_transcript_fts_rows\nBEGIN\n  DELETE FROM session_transcript_fts WHERE rowid = OLD.id;\nEND;\n\nINSERT OR IGNORE INTO memory_index_state (id, revision) VALUES (1, 0);\n\nCREATE TRIGGER IF NOT EXISTS memory_index_sources_revision_after_insert\nAFTER INSERT ON memory_index_sources\nBEGIN\n  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;\nEND;\n\nCREATE TRIGGER IF NOT EXISTS memory_index_sources_revision_after_update\nAFTER UPDATE ON memory_index_sources\nBEGIN\n  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;\nEND;\n\nCREATE TRIGGER IF NOT EXISTS memory_index_sources_revision_after_delete\nAFTER DELETE ON memory_index_sources\nBEGIN\n  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;\nEND;\n\nCREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_insert\nAFTER INSERT ON memory_index_chunks\nBEGIN\n  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;\nEND;\n\nCREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_update\nAFTER UPDATE ON memory_index_chunks\nBEGIN\n  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;\nEND;\n\nCREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_delete\nAFTER DELETE ON memory_index_chunks\nBEGIN\n  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;\nEND;\n\nCREATE INDEX IF NOT EXISTS idx_memory_embedding_cache_updated_at\n  ON memory_embedding_cache(updated_at);\n\nCREATE INDEX IF NOT EXISTS idx_memory_index_sources_source\n  ON memory_index_sources(source);\n\nCREATE INDEX IF NOT EXISTS idx_memory_index_chunks_path_source\n  ON memory_index_chunks(path, source);\n\nCREATE INDEX IF NOT EXISTS idx_memory_index_chunks_path\n  ON memory_index_chunks(path);\n\nCREATE INDEX IF NOT EXISTS idx_memory_index_chunks_source\n  ON memory_index_chunks(source);\n\n-- Accepted input stays outside the active transcript until its exact turn owns execution.\nCREATE TABLE IF NOT EXISTS session_pending_inputs (\n  seq INTEGER PRIMARY KEY AUTOINCREMENT,\n  input_id TEXT NOT NULL UNIQUE,\n  session_key TEXT NOT NULL,\n  session_id TEXT NOT NULL,\n  idempotency_key TEXT NOT NULL,\n  run_id TEXT NOT NULL,\n  request_hash TEXT NOT NULL,\n  message_json TEXT NOT NULL,\n  lifecycle_generation TEXT NOT NULL,\n  state TEXT NOT NULL CHECK (state IN ('queued', 'interrupted', 'cancelled')),\n  accepted_at INTEGER NOT NULL,\n  consumed_event_id TEXT,\n  UNIQUE (session_id, idempotency_key),\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE,\n  FOREIGN KEY (session_id) REFERENCES session_windows(session_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_pending_inputs_session\n  ON session_pending_inputs(session_key, session_id, seq DESC);\n\n-- Processing completion is separate from input consumption; neither schedules replay.\nCREATE TABLE IF NOT EXISTS session_input_completions (\n  session_key TEXT NOT NULL,\n  session_id TEXT NOT NULL,\n  idempotency_key TEXT NOT NULL,\n  run_id TEXT NOT NULL,\n  request_hash TEXT NOT NULL,\n  outcome_json TEXT NOT NULL,\n  succeeded INTEGER NOT NULL CHECK (succeeded IN (0, 1)),\n  completed_at INTEGER NOT NULL,\n  PRIMARY KEY (session_id, idempotency_key),\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE,\n  FOREIGN KEY (session_id) REFERENCES session_windows(session_id) ON DELETE CASCADE\n) STRICT;\n";
//#endregion
//#region src/state/openclaw-agent-context-engine-turn-outbox-schema.ts
const CONTEXT_ENGINE_TURN_OUTBOX_TABLE = "context_engine_turn_outbox";
createSqliteSchemaEnsurer(() => extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, CONTEXT_ENGINE_TURN_OUTBOX_TABLE, {
	endMarker: "CREATE TABLE IF NOT EXISTS cache_entries (",
	includeEndMarker: false,
	errorMessage: "OpenClaw context-engine turn outbox schema markers are missing."
})).recordCommitted;
//#endregion
//#region src/state/openclaw-agent-db-additive-columns.ts
const SESSION_OWNER_COLUMN_DEFINITIONS = [
	{
		columnName: "owner_actor_type",
		dataType: "TEXT",
		tableName: "session_nodes"
	},
	{
		columnName: "owner_actor_id",
		dataType: "TEXT",
		tableName: "session_nodes"
	},
	{
		columnName: "owner_assigned_by_type",
		dataType: "TEXT",
		tableName: "session_nodes"
	},
	{
		columnName: "owner_assigned_by_id",
		dataType: "TEXT",
		tableName: "session_nodes"
	},
	{
		columnName: "owner_assigned_at",
		dataType: "INTEGER",
		tableName: "session_nodes"
	}
];
const LEGACY_ACP_MIGRATION_COLUMN_DEFINITION = {
	columnName: "legacy_acp_migration_json",
	dataType: "TEXT",
	tableName: "session_nodes"
};
const CANONICAL_READY_COLUMN_DEFINITION = {
	columnName: "canonical_ready",
	dataType: "TEXT",
	tableName: "session_key_contract"
};
const FIRST_USE_ADDITIVE_AGENT_COLUMN_DEFINITIONS = [
	...SESSION_OWNER_COLUMN_DEFINITIONS,
	LEGACY_ACP_MIGRATION_COLUMN_DEFINITION,
	CANONICAL_READY_COLUMN_DEFINITION
];
//#endregion
//#region src/state/openclaw-agent-board-schema.ts
const OPENCLAW_AGENT_BOARD_SCHEMA_SQL = extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, "board_tabs", {
	endMarker: "CREATE TABLE IF NOT EXISTS session_progress_cards (",
	includeEndMarker: false,
	errorMessage: "OpenClaw agent board schema markers are missing from the canonical schema."
});
const OPENCLAW_AGENT_SCHEMA_WITHOUT_BOARD_SQL = OPENCLAW_AGENT_SCHEMA_SQL.replace(OPENCLAW_AGENT_BOARD_SCHEMA_SQL, "");
const AGENT_PROGRESS_CARD_SCHEMA_SQL = extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_WITHOUT_BOARD_SQL, "session_progress_cards", {
	endMarker: "CREATE TABLE IF NOT EXISTS heartbeat_outcomes (",
	includeEndMarker: false,
	errorMessage: "OpenClaw agent progress-card schema markers are missing."
});
OPENCLAW_AGENT_SCHEMA_WITHOUT_BOARD_SQL.replace(AGENT_PROGRESS_CARD_SCHEMA_SQL, "");
[...FIRST_USE_ADDITIVE_AGENT_COLUMN_DEFINITIONS.map(({ columnName, tableName }) => `${tableName}.${columnName}`)];
resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseSettledReadOpenFailures"), () => /* @__PURE__ */ new WeakSet());
resolveGlobalSingleton(Symbol.for("openclaw.agentCanonicalValidationSchemas"), () => /* @__PURE__ */ new WeakMap());
resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseIdentities"), () => /* @__PURE__ */ new WeakMap());
//#endregion
//#region src/state/openclaw-agent-db-resources.ts
const resources = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseAsyncResources"), () => ({
	active: /* @__PURE__ */ new Set(),
	closing: /* @__PURE__ */ new Map(),
	selections: /* @__PURE__ */ new Map()
}));
registerAgentDatabaseReaderCloser(async (candidates) => {
	const errors = (await Promise.allSettled([.../* @__PURE__ */ new Set([...resources.active, ...resources.closing.keys()])].filter((resource) => candidates.some((candidate) => matchesAgentDatabaseReadCandidatePath(candidate, resource.path))).map((resource) => closeAgentDatabaseResource(resource)))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (errors.length > 0) throw new AggregateError(errors, "Agent database resource cleanup failed");
});
function closeAgentDatabaseResource(resource, onCloseError) {
	if (resource.ownership === "known" && resource.closeSync) {
		resources.closing.set(resource, void 0);
		try {
			resource.revoke();
			resource.closeSync();
			resources.active.delete(resource);
			resources.closing.delete(resource);
			return Promise.resolve();
		} catch (error) {
			if (onCloseError) onCloseError(resource.path, error);
			const failed = Promise.reject(toErrorObject(error, "Agent database cleanup failed"));
			failed.catch(() => {});
			return failed;
		}
	}
	let operation = resources.closing.get(resource);
	if (!operation) {
		operation = Promise.resolve().then(() => resource.close());
		resources.closing.set(resource, operation);
		operation.then(() => {
			resources.active.delete(resource);
			resources.closing.delete(resource);
		}, () => {
			resources.closing.set(resource, void 0);
		}).catch(() => {});
	}
	if (onCloseError) operation.catch((error) => onCloseError(resource.path, error)).catch(() => {});
	resource.revoke();
	return operation;
}
//#endregion
//#region src/state/openclaw-agent-db-validation-cache.ts
const validatedPaths = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseValidatedPaths"), () => /* @__PURE__ */ new Map(), () => clearOpenClawAgentDatabaseValidationCache());
resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseValidationBindings"), () => /* @__PURE__ */ new WeakMap());
function invalidateOpenClawAgentDatabaseValidation(pathname, identity = validatedPaths.get(path.resolve(pathname))?.validation?.identity) {
	const resolved = path.resolve(pathname);
	const paths = /* @__PURE__ */ new Set([resolved]);
	if (identity) {
		for (const [candidate, entry] of validatedPaths) if (entry.validation?.identity === identity) paths.add(candidate);
	}
	for (const candidate of paths) {
		const entry = validatedPaths.get(candidate);
		const validation = entry?.validation;
		if (validation) Atomics.store(new Int32Array(validation.valid), 0, 0);
		validatedPaths.set(candidate, {
			agentId: entry?.agentId,
			validation,
			integrityVerified: false,
			revoked: true
		});
	}
}
function clearOpenClawAgentDatabaseValidationCache(rootPath) {
	for (const pathname of validatedPaths.keys()) if (rootPath === void 0 || isPathInside(rootPath, pathname)) {
		invalidateOpenClawAgentDatabaseValidation(pathname);
		validatedPaths.delete(pathname);
	}
}
//#endregion
//#region src/state/openclaw-quarantine-store.ts
const OPENCLAW_QUARANTINE_SCHEMA_VERSION = 2;
const OPENCLAW_QUARANTINE_BUSY_TIMEOUT_MS = 5e3;
function createOpenClawDatabaseVerificationError(kind, pathname, storedError) {
	const error = /* @__PURE__ */ new Error(`OpenClaw ${kind} database ${pathname} is quarantined after integrity verification failed: ${storedError ?? "unknown integrity error"}. Restore the database from a backup or repair it, then run openclaw doctor --fix to clear the quarantine. See ${OPENCLAW_DATABASE_SCHEMA_DOCS_URL}.`);
	error.name = "SqliteIntegrityError";
	return error;
}
function readQuarantineSchemaVersion(database, storePath) {
	const userVersion = database.prepare("PRAGMA user_version").get()?.user_version;
	if (typeof userVersion !== "number" || !Number.isInteger(userVersion)) throw new Error(`OpenClaw quarantine store ${storePath} has an invalid schema version.`);
	return userVersion;
}
/** Read one authoritative quarantine decision without creating the store. */
function readOpenClawDatabaseQuarantine(pathname, options = {}) {
	const storePath = resolveQuarantineStorePath(options.env ?? process.env);
	if (!existsSync(storePath)) return;
	const database = openNodeSqliteDatabase(storePath);
	let outcome;
	try {
		outcome = { value: readQuarantineDecision(database, pathname, storePath) };
	} catch (error) {
		outcome = { error };
	}
	try {
		database.close();
	} catch (closeError) {
		throw new OpenClawQuarantineReadCleanupError("error" in outcome ? [outcome.error, closeError] : [closeError], "value" in outcome ? outcome.value : void 0);
	}
	if ("error" in outcome) throw outcome.error;
	return outcome.value;
}
function readQuarantineDecision(database, pathname, storePath) {
	database.exec(`PRAGMA busy_timeout = ${OPENCLAW_QUARANTINE_BUSY_TIMEOUT_MS};`);
	const userVersion = readQuarantineSchemaVersion(database, storePath);
	if (userVersion === 0) return;
	if (userVersion > OPENCLAW_QUARANTINE_SCHEMA_VERSION) throw new Error(`OpenClaw quarantine store ${storePath} uses newer schema version ${userVersion}.`);
	const generationColumn = userVersion >= 2 ? ", verified_generation" : "";
	const row = database.prepare(`SELECT kind, reason, quarantined_at${generationColumn} FROM quarantined_databases WHERE path = ? LIMIT 1`).get(path.resolve(pathname));
	if (!row) return;
	if (row.kind !== "agent" && row.kind !== "state" || typeof row.reason !== "string" || typeof row.quarantined_at !== "number" || !Number.isInteger(row.quarantined_at) || row.verified_generation !== void 0 && row.verified_generation !== null && typeof row.verified_generation !== "string") throw new Error(`OpenClaw quarantine store ${storePath} contains an invalid row.`);
	if (typeof row.verified_generation === "string") {
		let verifiedGeneration;
		try {
			verifiedGeneration = parseSqliteFileGeneration(row.verified_generation);
		} catch {
			throw new Error(`OpenClaw quarantine store ${storePath} contains an invalid row.`);
		}
		try {
			const currentGeneration = readStableSqliteFileGeneration(path.resolve(pathname));
			if (!sameSqliteFileGeneration(verifiedGeneration, currentGeneration)) return;
		} catch {
			return;
		}
	}
	return {
		kind: row.kind,
		quarantinedAt: row.quarantined_at,
		reason: row.reason
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
	const failure = createOpenClawDatabaseVerificationError(kind, pathname, quarantine.reason);
	if (cleanupFailure) failure.cause = cleanupFailure;
	return failure;
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
		const scope = admit(pathname, ownership);
		const database = state.cachedDatabases.get(path.resolve(pathname));
		return {
			database: database?.db.isOpen ? database : void 0,
			scope
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
//#region src/infra/sqlite-handle-lifecycle.ts
/** Idle native connections share one retention window across SQLite owners. */
const SQLITE_IDLE_HANDLE_TTL_MS = 18e5;
//#endregion
//#region src/state/openclaw-state-db-cache.idle.ts
const log$1 = createSubsystemLogger("state/db");
/** Schedule native retirement against the canonical cache's handles and borrow pins. */
function createStateDatabaseIdleRetirement({ cachedDatabases, retainedDatabaseHandles, idleTimers, idleReferences, borrowers }, retire) {
	const touch = (database) => {
		if (!(cachedDatabases.get(database.path) === database && database.db.isOpen) && retainedDatabaseHandles.get(database.db) !== database) return;
		const previous = idleTimers.get(database.db);
		if (previous) {
			previous.refresh();
			return;
		}
		const timer = runInSqliteMaintenanceContext(() => setTimeout(() => {
			idleTimers.delete(database.db);
			try {
				if (database.db.isOpen && database.db.isTransaction) touch(database);
				else if (!borrowers.get(database.db)?.references.size && !idleReferences.get(database.db)?.size) retire(database, false, {
					busyTimeoutMs: 0,
					checkpointMode: "PASSIVE"
				});
			} catch (error) {
				log$1.warn("Idle shared-state database cleanup failed", {
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
//#region src/infra/sqlite-worker-contract.ts
const SQLITE_WORKER_MAX_MESSAGE_BYTES = 33554432;
const retainedWorkerErrorCode = Symbol.for("openclaw.sqliteWorkerErrorCode");
const SqliteWorkerAdmissionTimeoutError = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerAdmissionTimeoutError"), () => class AdmissionTimeoutError extends Error {
	constructor() {
		super("SQLite host admission timed out; retry after transaction rollback");
		this.code = "admission-timeout";
		this.name = "SqliteWorkerAdmissionTimeoutError";
	}
});
var SqliteWorkerError = class extends Error {
	constructor(message, code) {
		super(message);
		this.code = code;
		this.name = "SqliteWorkerError";
		Object.defineProperty(this, retainedWorkerErrorCode, { value: code });
	}
};
/** Carry only canonical worker classification through a local cleanup aggregate. */
function retainSqliteWorkerErrorCode(error, source) {
	let code;
	try {
		code = Object.getOwnPropertyDescriptor(source, retainedWorkerErrorCode)?.value;
	} catch {
		return error;
	}
	if (code === "closed" || code === "overloaded" || code === "unavailable" || code === "outcome-unknown") {
		Object.defineProperty(error, retainedWorkerErrorCode, { value: code });
		Object.assign(error, { code });
	}
	return error;
}
//#endregion
//#region src/infra/sqlite-worker-operation-admission.ts
const REQUESTED = 0;
const GRANTED = 1;
const REFUSED = 2;
const TIMED_OUT = 3;
const processMonotonicClock = process.hrtime;
const readMonotonicNs = () => processMonotonicClock.bigint();
resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerOpenRefusedError"), () => class OpenRefusedError extends Error {
	constructor(originalError) {
		super("SQLite worker admission was refused before agent open", { cause: originalError });
		this.originalError = originalError;
		this.name = "SqliteWorkerOpenRefusedError";
	}
});
/** The caller retains real source custody before invoking the synchronous grant. */
function createSqliteWorkerOperationAdmission(admit, attachment) {
	const { port1, port2 } = new MessageChannel();
	if (attachment !== void 0) try {
		port1.postMessage({
			kind: "sqlite-operation-attachment",
			value: attachment
		}, []);
	} catch (error) {
		port1.close();
		port2.close();
		throw error;
	}
	const inOwnerContext = AsyncLocalStorage.snapshot();
	const decisions = /* @__PURE__ */ new Set();
	const cleanupFailures = [];
	let closed = false;
	let observeRequest;
	let failure;
	let committed;
	let settlement;
	let databaseAuthority;
	const waiting = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
	const recordFailure = (error, source) => {
		if (!failure || failure.source === "domain" && source !== "domain") failure = {
			error,
			source
		};
	};
	const refuse = (decision, error, source) => {
		if (Atomics.compareExchange(decision, 0, REQUESTED, REFUSED) === REQUESTED) {
			recordFailure(error, source);
			Atomics.notify(decision, 0);
		} else if (Atomics.load(decision, 0) === GRANTED) cleanupFailures.push(error);
	};
	const receive = (message) => {
		if (isRecord(message) && message.kind === "native-commit") {
			if (!isRecord(message.committed) || settlement) {
				recordFailure(new SqliteWorkerError("SQLite worker commit receipt is invalid", "outcome-unknown"), "protocol");
				return;
			}
			committed = { facts: message.committed.facts };
			return;
		}
		if (isRecord(message) && message.kind === "native-settlement") {
			const value = message.settlement;
			if (!isRecord(value) || value.kind !== "completed" && value.kind !== "unknown" || value.committed !== void 0 && !isRecord(value.committed) || settlement) {
				recordFailure(new SqliteWorkerError("SQLite worker native settlement is invalid", "outcome-unknown"), "protocol");
				return;
			}
			if (isRecord(value.committed)) committed = { facts: value.committed.facts };
			settlement = {
				kind: value.kind,
				...committed ? { committed } : {}
			};
			return;
		}
		if (!isRecord(message) || !(message.decision instanceof SharedArrayBuffer) || message.decision.byteLength !== Int32Array.BYTES_PER_ELEMENT || message.stage !== "open" && message.stage !== "prepare" && message.stage !== "transaction" && message.stage !== "commit") {
			recordFailure(new SqliteWorkerError("SQLite worker admission request is invalid", "unavailable"), "protocol");
			return;
		}
		const decision = new Int32Array(message.decision);
		const expired = () => {
			if (typeof message.deadlineNs === "bigint" && readMonotonicNs() >= message.deadlineNs) {
				if (Atomics.compareExchange(decision, 0, REQUESTED, TIMED_OUT) === REQUESTED) Atomics.notify(decision, 0);
			}
			return Atomics.load(decision, 0) === TIMED_OUT;
		};
		if (expired()) return;
		decisions.add(decision);
		const request = {
			stage: message.stage,
			facts: message.facts
		};
		try {
			inOwnerContext(() => observeRequest?.(request));
		} catch (error) {
			refuse(decision, error, "domain");
			return;
		}
		if (closed) {
			refuse(decision, new SqliteWorkerError("SQLite worker admission is closed", "closed"), "authority");
			return;
		}
		const grant = () => {
			if (closed || expired() || Atomics.load(decision, 0) !== REQUESTED) return false;
			try {
				inOwnerContext(() => databaseAuthority?.assertAccess());
			} catch (error) {
				refuse(decision, error, "authority");
				return false;
			}
			if (expired()) return false;
			const granted = Atomics.compareExchange(decision, 0, REQUESTED, GRANTED) === REQUESTED;
			if (granted) Atomics.notify(decision, 0);
			return granted;
		};
		let source = "authority";
		try {
			inOwnerContext(() => {
				databaseAuthority?.assertRequest?.();
				databaseAuthority?.assertAccess();
			});
			if (request.stage === "prepare" && isRecord(request.facts) && request.facts.kind === "schema-maintenance") {
				const authority = databaseAuthority;
				if (!authority || typeof request.facts.databasePath !== "string" || resolveIdentityPathViaExistingAncestorSync(request.facts.databasePath) !== authority.databasePath) throw new SqliteWorkerError("SQLite schema maintenance target differs from its admitted database", "closed");
				inOwnerContext(() => {
					authority.lease ??= authority.acquireSchema();
					authority.lease.assertCurrent();
					grant();
				});
			} else {
				source = "domain";
				inOwnerContext(admit, request, grant);
			}
		} catch (error) {
			refuse(decision, error, source);
			return;
		} finally {
			decisions.delete(decision);
		}
		if (Atomics.load(decision, 0) === REQUESTED) refuse(decision, new SqliteWorkerError("SQLite worker admission was not granted", "closed"), "domain");
	};
	port1.on("message", receive);
	port1.unref();
	const service = () => {
		for (let queued = receiveMessageOnPort(port1); queued; queued = receiveMessageOnPort(port1)) receive(queued.message);
	};
	return {
		port: port2,
		observeRequests(observer) {
			if (closed || observeRequest) throw new SqliteWorkerError("SQLite request observation is already bound or closed", "closed");
			observeRequest = observer;
		},
		bindDatabaseAuthority(authority) {
			if (closed || databaseAuthority) throw new SqliteWorkerError("SQLite database authority is already bound or closed", "closed");
			databaseAuthority = {
				...authority,
				databasePath: resolveIdentityPathViaExistingAncestorSync(authority.databasePath)
			};
		},
		get failure() {
			return failure?.error;
		},
		get failureSource() {
			return failure?.source;
		},
		get cleanupFailures() {
			return cleanupFailures;
		},
		get committed() {
			service();
			return committed;
		},
		get settlement() {
			return settlement;
		},
		waitForSettlement(deadlineMs) {
			while (true) {
				service();
				if (failure !== void 0) throw toErrorObject(failure.error, "SQLite worker admission failed");
				if (settlement?.kind === "completed") return settlement;
				const remaining = deadlineMs - performance.now();
				if (settlement?.kind === "unknown" || closed || remaining <= 0) throw new SqliteWorkerError("SQLite worker native settlement is unknown", "outcome-unknown");
				Atomics.wait(waiting, 0, 0, Math.min(5, remaining));
			}
		},
		service,
		finish() {
			closed = true;
			service();
			for (const decision of decisions) if (Atomics.load(decision, 0) === REQUESTED) refuse(decision, new SqliteWorkerError("SQLite worker admission is closed", "closed"), "authority");
			port1.close();
			port2.close();
			if (databaseAuthority?.lease) try {
				databaseAuthority.lease.release();
				databaseAuthority.lease = void 0;
			} catch (error) {
				cleanupFailures.push(error);
			}
		}
	};
}
const currentAdmission = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerOperationAdmission"), () => new AsyncLocalStorage());
/** Called on the SQLite worker, after transaction entry and before its row mutation. */
function requestSqliteWorkerOperationAdmission(request, transferList = []) {
	const scope = currentAdmission.getStore();
	if (!scope?.active) throw new SqliteWorkerError("SQLite operation requires its retained admission", "unavailable");
	const decision = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
	const deadlineNs = request.deadlineMs === void 0 ? void 0 : readMonotonicNs() + BigInt(request.deadlineMs) * 1000000n;
	scope.port.postMessage({
		...request,
		decision: decision.buffer,
		deadlineNs
	}, transferList);
	while (Atomics.load(decision, 0) === REQUESTED) {
		const remainingMs = deadlineNs === void 0 ? void 0 : Number(deadlineNs - readMonotonicNs()) / 1e6;
		if (remainingMs !== void 0 && remainingMs <= 0) Atomics.compareExchange(decision, 0, REQUESTED, TIMED_OUT);
		else Atomics.wait(decision, 0, REQUESTED, remainingMs);
	}
	if (Atomics.load(decision, 0) !== GRANTED) {
		const refusal = Atomics.load(decision, 0) === TIMED_OUT ? new SqliteWorkerAdmissionTimeoutError() : new SqliteWorkerError("SQLite transaction admission was refused", "closed");
		scope.owner.refusal = refusal;
		throw refusal;
	}
}
/** Schema work borrows live host authority through the same retained job port. */
function requestSqliteWorkerSchemaMaintenance(databasePath) {
	if (!currentAdmission.getStore()) return false;
	requestSqliteWorkerOperationAdmission({
		stage: "prepare",
		facts: {
			kind: "schema-maintenance",
			databasePath
		}
	});
	return true;
}
//#endregion
//#region src/infra/gateway-supervision.ts
const GATEWAY_SUPERVISOR_MODE_ENV = "OPENCLAW_SUPERVISOR_MODE";
function isGatewayExternallySupervised(env = process.env) {
	return env[GATEWAY_SUPERVISOR_MODE_ENV]?.trim().toLowerCase() === "external";
}
//#endregion
//#region src/state/openclaw-state-db-schema-policy.ts
const schemaPolicies = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseSchemaPolicies"), () => ({
	scopes: new AsyncLocalStorage(),
	existingDatabases: /* @__PURE__ */ new WeakMap()
}));
function canonicalPath(pathname) {
	const resolved = path.resolve(pathname);
	try {
		return realpathSync.native(resolved);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return resolved;
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
	const resolvedPath = path.resolve(pathname);
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
	const requested = path.resolve(pathname);
	let resolved = scope && (scopedPath === requested || scope.canonicalPath === requested) ? scope.canonicalPath : void 0;
	for (const databases of [cache.cachedDatabases, cache.retainedDatabaseHandles]) for (const { db } of databases.values()) {
		const admittedPath = schemaPolicies.existingDatabases.get(db);
		if (admittedPath && db.isOpen) {
			resolved ??= canonicalPath(pathname);
			if (admittedPath === resolved) isExistingOpenClawStateSchema(pathname, db);
		}
	}
}
//#endregion
//#region src/state/openclaw-state-worker-context.capture.ts
/** Capture read authority without constructing a worker environment. */
function captureOpenClawStateReadContextWithAdmission(pathname, captureAdmission) {
	const schema = captureOpenClawStateSchemaReadAdmission(pathname);
	const capturedAdmission = captureAdmission(pathname);
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
		runInCapturedSchemaScope
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
			if (!isMainThread) return;
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
					const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-CYGdaZoK.mjs");
					assertCurrent();
					const result = await runOpenClawStateWorkerOperation(context, (worker) => worker.execute({
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
					assertCurrent();
					return result;
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
//#region src/state/openclaw-state-db-handle.ts
function openTrackedStateDatabase(pathname, options) {
	const result = openTrackedStateDatabaseResult(pathname, options);
	if (result.status === "unavailable") throw result.error;
	return result.database;
}
/** Native open failure is an ordinary read failure; admitted handles retain their own cleanup. */
function openTrackedStateDatabaseResult(pathname, options) {
	assertStateDatabaseAccessAllowed(pathname);
	try {
		if (options?.expectedIdentity !== void 0) assertExistingDatabaseIdentity(pathname, options.expectedIdentity);
		const location = options?.existingOnly || options?.expectedIdentity !== void 0 ? resolveExistingSqliteFileUri(pathname) : pathname;
		const nativeOptions = options?.readOnly ? {
			readOnly: true,
			timeout: options.timeout
		} : { enableForeignKeyConstraints: options?.enableForeignKeyConstraints };
		const database = withSqliteNativeOpen(() => openNodeSqliteDatabase(location, nativeOptions));
		try {
			assertStateDatabaseAccessAllowed(pathname);
		} catch (error) {
			database.close();
			throw error;
		}
		return {
			status: "available",
			database
		};
	} catch (error) {
		return {
			status: "unavailable",
			error
		};
	}
}
function closeTrackedStateDatabase(database) {
	if (database.isOpen) database.close();
}
//#endregion
//#region src/state/openclaw-state-db-runtime-failure.ts
/** Runtime validation uses the cache's existing handles, version counters, and terminal latch. */
function createOpenClawStateDatabaseRuntimeFailureOwner(owner) {
	return {
		closeTerminalFailure(pathname, error) {
			markOpenClawStateDatabaseFailure(error, pathname);
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
		get: (pathname) => {
			const resolvedPath = path.resolve(pathname);
			const latched = owner.latch.get(resolvedPath);
			if (latched) return latched;
			const cached = owner.cachedDatabases.get(resolvedPath);
			if (!cached?.db.isOpen) return;
			try {
				runSqliteReadOperationSync(cached.db, () => {
					const schema = getAdmittedSqliteSchemaFacts(cached.db);
					if (!schema || schema !== cached.schemaFacts) {
						assertSupportedStateSchemaVersion(cached.db, resolvedPath);
						cached.schemaFacts = schema;
					}
				});
				return;
			} catch (error) {
				const failure = error instanceof Error ? error : new Error(String(error));
				if (isSqliteCorruptionError(failure)) {
					owner.evict(cached);
					return;
				}
				if (isSqliteSchemaVersionError(failure)) owner.recordSchemaFailure(resolvedPath, failure);
				return failure;
			}
		}
	};
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
createSubsystemLogger("infra/file-copy");
//#endregion
//#region src/infra/windows-private-directory.ts
const require = createRequire(import.meta.url);
let creators;
function loadPrivatePathCreators() {
	const koffi = require("koffi");
	const kernel32 = koffi.load("kernel32.dll");
	const advapi32 = koffi.load("advapi32.dll");
	const attributes = koffi.struct({
		length: "uint32_t",
		descriptor: "void *",
		inheritHandle: "int32_t"
	});
	const getLastError = kernel32.func("uint32_t __stdcall GetLastError()");
	const getCurrentProcess = kernel32.func("void * __stdcall GetCurrentProcess()");
	const closeHandle = kernel32.func("int32_t __stdcall CloseHandle(void *handle)");
	const localFree = kernel32.func("void * __stdcall LocalFree(void *memory)");
	const openToken = advapi32.func("int32_t __stdcall OpenProcessToken(void *process, uint32_t access, _Out_ void **token)");
	const getTokenInformation = advapi32.func("int32_t __stdcall GetTokenInformation(void *token, int32_t informationClass, _Out_ void *information, uint32_t length, _Out_ uint32_t *required)");
	const convertSid = advapi32.func("int32_t __stdcall ConvertSidToStringSidW(void *sid, _Out_ void **text)");
	const convertDescriptor = advapi32.func("int32_t __stdcall ConvertStringSecurityDescriptorToSecurityDescriptorW(str16 text, uint32_t revision, _Out_ void **descriptor, void *size)");
	const createDirectory = kernel32.func("__stdcall", "CreateDirectoryW", "int32_t", ["str16", koffi.pointer(attributes)]);
	const createFile = kernel32.func("__stdcall", "CreateFileW", "void *", [
		"str16",
		"uint32_t",
		"uint32_t",
		koffi.pointer(attributes),
		"uint32_t",
		"uint32_t",
		"void *"
	]);
	const failure = (operation) => {
		const errorCode = getLastError();
		return Object.assign(/* @__PURE__ */ new Error(`${operation} failed (Win32 error ${errorCode})`), {
			code: errorCode === 80 || errorCode === 183 ? "EEXIST" : "EIO",
			errno: errorCode
		});
	};
	const withPrivateAttributes = (inherit, operation) => {
		const token = [null];
		const sidText = [null];
		const descriptor = [null];
		if (!openToken(getCurrentProcess(), 8, token)) throw failure("OpenProcessToken");
		try {
			const required = [0];
			getTokenInformation(token[0], 1, null, 0, required);
			if (getLastError() !== 122 || required[0] === 0) throw failure("GetTokenInformation(size)");
			const user = Buffer.alloc(required[0]);
			if (!getTokenInformation(token[0], 1, user, user.length, required)) throw failure("GetTokenInformation");
			if (!convertSid(koffi.decode(user, "void *"), sidText)) throw failure("ConvertSidToStringSidW");
			const sid = koffi.decode(sidText[0], "char16_t", -1);
			const flags = inherit ? "OICI" : "";
			const sddl = `O:${sid}D:P(A;${flags};FA;;;${sid})(A;${flags};FA;;;SY)(A;${flags};FA;;;BA)`;
			if (!convertDescriptor(sddl, 1, descriptor, null)) throw failure("ConvertStringSecurityDescriptorToSecurityDescriptorW");
			return operation({
				length: koffi.sizeof(attributes),
				descriptor: descriptor[0],
				inheritHandle: 0
			});
		} finally {
			if (descriptor[0] !== null) localFree(descriptor[0]);
			if (sidText[0] !== null) localFree(sidText[0]);
			closeHandle(token[0]);
		}
	};
	return {
		directory: (directoryPath) => withPrivateAttributes(true, (security) => {
			if (!createDirectory(path.toNamespacedPath(path.resolve(directoryPath)), security)) throw markPrivateDirectoryCreationRefused(failure(`CreateDirectoryW(${directoryPath})`));
		}),
		file: (filePath) => withPrivateAttributes(false, (security) => {
			const resolved = path.toNamespacedPath(path.resolve(filePath));
			const handle = createFile(resolved, 3221225472, 3, security, 1, 128, null);
			if (handle === null || BigInt.asIntN(64, koffi.address(handle)) === -1n) throw failure(`CreateFileW(${filePath})`);
			try {
				return fsSync.openSync(resolved, fsSync.constants.O_RDWR | (fsSync.constants.O_NOFOLLOW ?? 0));
			} finally {
				closeHandle(handle);
			}
		})
	};
}
function createPrivateWindowsDirectory(directoryPath) {
	creators ??= loadPrivatePathCreators();
	creators.directory(directoryPath);
}
//#endregion
//#region src/infra/sqlite-private-directory.ts
function resolvePrivateSqliteSnapshotStagingRoot(env = process.env) {
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
		return fsSync.mkdtempSync(path.join(rootPath, prefix));
	} catch (error) {
		throw markPrivateDirectoryCreationRefused(error);
	}
	const directoryPath = path.join(rootPath, `${prefix}${randomUUID()}`);
	createPrivateWindowsDirectory(directoryPath);
	return directoryPath;
}
//#endregion
//#region src/infra/sqlite-snapshot-policy.ts
function sqliteSnapshotSourceFileSize(pathname) {
	try {
		const stat = fsSync.statSync(pathname);
		return stat.isFile() ? stat.size : 0;
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return 0;
		throw error;
	}
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
		return fsSync.statSync(current).isDirectory() ? current : path.dirname(current);
	} catch {
		const parent = path.dirname(current);
		if (parent === current) return null;
		current = parent;
	}
}
/** Reads available bytes for the volume containing a target path when statfs is available. */
function tryReadDiskSpace(targetPath) {
	if (typeof fsSync.statfsSync !== "function") return null;
	const checkedPath = findExistingDiskSpacePath(targetPath);
	if (!checkedPath) return null;
	try {
		const stats = fsSync.statfsSync(checkedPath);
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
function stagingParent(root) {
	const parent = path.basename(root) === "openclaw" ? path.dirname(root) : root;
	return isSqliteSnapshotStagingName(path.basename(parent)) ? parent : void 0;
}
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
		const liveWal = fsSync.existsSync(`${sourcePath}-wal`) && fsSync.existsSync(`${sourcePath}-shm`);
		capacityDetail = `; estimated ${estimatedBytes} bytes needed; ${availableBytes === void 0 ? "available bytes unknown" : `${availableBytes} bytes available`}; source ${liveWal ? "has live WAL sidecars" : "has no live WAL sidecars"}`;
	} catch {}
	const message = `${cause instanceof Error ? cause.message : String(cause)}${sqliteErrcode !== void 0 ? ` (SQLite errcode=${sqliteErrcode})` : ""}; snapshot staging root ${allocation ? tempDir : path.dirname(tempDir)}${capacityDetail}: ${guidance} or set XDG_CACHE_HOME to a writable filesystem`;
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
			const { allocateWorkerOwnedSqliteSnapshotDirectory } = await import("./sqlite-snapshot-staging-owner-CqBGFmOb.mjs");
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
	const parentDirectory = stagingParent(root);
	let parent;
	try {
		parent = parentDirectory ? acquireSqliteSnapshotToken(parentDirectory, "read") : void 0;
	} catch (error) {
		throw markPrivateDirectoryCreationRefused(error);
	}
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
	} finally {
		parent?.();
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
		if (fsSync.existsSync(staged)) fsSync.renameSync(staged, `${location}${suffix}`);
	}
	return adoptPreparedLocation(location, directory);
}
async function prepareSqliteReadOnlyLocationFromOwnedDatabase(database, assertCurrent, signal, cleanupMode) {
	signal?.throwIfAborted();
	assertCurrent();
	if (!database.isOpen || database.isTransaction) throw new Error("SQLite inspection requires an open owner outside a transaction");
	const directory = await createSqliteSnapshotStagingDirectory(void 0, false, signal, cleanupMode === "async");
	try {
		signal?.throwIfAborted();
		assertCurrent();
		if (!database.isOpen || database.isTransaction) throw new Error("SQLite inspection requires an open owner outside a transaction");
		const location = path.join(directory, "database.sqlite.partial");
		await retainSnapshotWork(backupNodeSqliteDatabase(database, location));
		signal?.throwIfAborted();
		assertCurrent();
		return publishPreparedCopy(directory);
	} catch (error) {
		const errors = [error];
		if (!await removeTempDirectoryAsync(directory, (cleanupError) => errors.push(cleanupError)) && cleanupMode === "async") throw createSqliteLifecycleAggregateError(errors, `Owned SQLite snapshot preparation and cleanup failed: ${coerceErrorMessage(error)}`, error);
		throw error;
	}
}
//#endregion
//#region src/infra/sqlite-snapshot-single-flight.ts
const snapshotFlights = resolveGlobalSingleton(Symbol.for("openclaw.sqliteSnapshotFlights"), () => ({
	unscoped: /* @__PURE__ */ new Map(),
	scoped: /* @__PURE__ */ new WeakMap()
}));
function startCloseProducer(flight) {
	if (flight.producerClose && flight.producerClose.read().status !== "rejected") return flight.producerClose;
	if (flight.startProducerClose) {
		flight.producerClose = flight.startProducerClose();
		flight.producerClose.result.then(() => flight.settled.service(), () => flight.settled.service());
		return flight.producerClose;
	}
	const completion = createRetainedOperation(() => {});
	if (flight.ownedProduction) completion.reject(new SqliteSnapshotCleanupError("SQLite snapshot producer cleanup custody is unavailable"));
	else completion.resolve(void 0);
	return completion.operation;
}
function removeFlight(key, flight) {
	if (flight.flights.get(key) === flight) flight.flights.delete(key);
}
function startReleaseFlight(key, flight) {
	if (flight.leases > 1 || flight.waiters > 0) {
		const retained = createRetainedOperation(() => {});
		flight.leases--;
		retained.resolve(true);
		return retained.operation;
	}
	const cleanup = flight.startCleanup();
	return flatMapRetainedOperation(cleanup, (removed) => {
		if (!removed) return cleanup;
		return mapRetainedOperation(startCloseProducer(flight), () => {
			flight.leases--;
			removeFlight(key, flight);
			return true;
		});
	});
}
function leaseFlight(key, flight, base) {
	flight.leases++;
	let active = true;
	let pending;
	const startCleanup = () => {
		if (pending?.read().status === "pending") return pending;
		let release;
		const retained = createRetainedOperation(() => {
			if (!release || retained.operation.read().status !== "pending") return;
			release.service();
			const outcome = release.read();
			if (outcome.status === "rejected") retained.reject(outcome.error);
			else if (outcome.status === "fulfilled") {
				active = !outcome.value;
				retained.resolve(outcome.value);
			}
		});
		pending = retained.operation;
		if (!active) retained.resolve(true);
		else {
			release = startReleaseFlight(key, flight);
			release.result.then(() => retained.operation.service(), () => retained.operation.service());
			retained.operation.service();
		}
		return retained.operation;
	};
	return {
		location: base.location,
		cleanupRoot: base.cleanupRoot,
		cleanup() {
			if (!active) return true;
			if (pending?.read().status === "pending") return false;
			if (flight.leases > 1 || flight.waiters > 0) {
				flight.leases--;
				active = false;
				return true;
			}
			const cleaned = base.cleanup();
			if (cleaned) {
				flight.leases--;
				active = false;
				removeFlight(key, flight);
			}
			return cleaned;
		},
		cleanupAsync: () => startCleanup().result,
		startCleanup
	};
}
function createFlight(flights, key, producer, ownedProduction) {
	let pendingProducer = producer;
	let servicing = false;
	const settled = createRetainedOperation(() => {
		if (servicing || settled.operation.read().status !== "pending") return;
		servicing = true;
		try {
			if (!flight.production && !flight.outcome) try {
				const startProducer = pendingProducer;
				pendingProducer = void 0;
				if (!startProducer) throw new Error("SQLite snapshot producer has already been consumed");
				const production = startProducer(flight.controller.signal, (error) => {
					flight.cleanupFailure ??= { error };
				});
				flight.production = production.operation;
				flight.startProducerClose = production.startClose;
				flight.production.result.then(() => settled.operation.service(), () => settled.operation.service());
			} catch (error) {
				flight.outcome = { error };
			}
			if (!flight.outcome && flight.production) {
				flight.production.service();
				const produced = flight.production.read();
				if (produced.status === "pending") return;
				if (produced.status === "fulfilled") {
					flight.base = produced.value.base;
					flight.startCleanup = produced.value.startCleanup.bind(produced.value);
					flight.outcome = { value: produced.value.base };
				} else flight.outcome = { error: produced.error };
				flight.production = void 0;
			}
			removeFlight(key, flight);
			for (const waiter of Array.from(flight.listeners)) waiter.service();
			if (flight.waiters > 0 || !flight.outcome) return;
			if ("error" in flight.outcome) settled.reject(flight.outcome.error);
			else if (flight.leases > 0) settled.resolve(flight.outcome.value);
			else {
				if (!flight.cleanup) {
					flight.cleanup = flight.startCleanup();
					flight.cleanup.result.then(() => settled.operation.service(), () => settled.operation.service());
				}
				flight.cleanup.service();
				const removed = flight.cleanup.read();
				if (removed.status === "pending") return;
				if (removed.status === "rejected" || !removed.value) {
					const error = removed.status === "rejected" ? removed.error : /* @__PURE__ */ new Error("SQLite orphan snapshot cleanup did not complete");
					flight.cleanupFailure ??= { error };
					try {
						getChildLogger({ subsystem: "infra/sqlite-snapshot" }).warn({ cleanupRoot: flight.base?.cleanupRoot }, "SQLite orphan snapshot cleanup failed; retained for cleanup retry.");
					} catch {}
					settled.reject(error);
				} else {
					const producerClose = startCloseProducer(flight);
					producerClose.service();
					const joined = producerClose.read();
					if (joined.status === "pending") return;
					if (joined.status === "rejected") {
						flight.cleanupFailure ??= { error: joined.error };
						settled.reject(joined.error);
					} else settled.resolve(flight.outcome.value);
				}
			}
			for (const waiter of Array.from(flight.listeners)) waiter.service();
		} finally {
			servicing = false;
		}
	});
	const flight = {
		flights,
		controller: new AbortController(),
		leases: 0,
		waiters: 0,
		listeners: /* @__PURE__ */ new Set(),
		ownedProduction,
		settled: settled.operation
	};
	retainSnapshotWork(settled.operation.result, () => {
		flight.controller.abort(/* @__PURE__ */ new Error("SQLite snapshot owner stopped"));
		settled.operation.service();
	});
	return flight;
}
function startSnapshotFlight(databasePath, operation, producer, signal, lifecycle, ownedProduction = false) {
	signal?.throwIfAborted();
	const key = `${readDatabasePathIdentitySync(databasePath).key}:${operation}`;
	let flights = snapshotFlights.unscoped;
	if (lifecycle?.scope) {
		const scoped = snapshotFlights.scoped.get(lifecycle.scope);
		if (scoped) flights = scoped;
		else {
			flights = /* @__PURE__ */ new Map();
			snapshotFlights.scoped.set(lifecycle.scope, flights);
		}
	}
	let flight = flights.get(key);
	if (!flight) {
		flight = createFlight(flights, key, producer, ownedProduction);
		flights.set(key, flight);
	}
	const selected = flight;
	lifecycle?.trackProducer?.(selected.settled.result);
	selected.waiters++;
	let waiting = true;
	let servicing = false;
	let closeRequested = false;
	let closed = false;
	let closing;
	const closeReason = /* @__PURE__ */ new Error("SQLite snapshot preparation closed");
	let outcome;
	const retained = createRetainedOperation(() => {
		if (servicing || retained.operation.read().status !== "pending") return;
		servicing = true;
		try {
			if (!outcome && (closeRequested || signal?.aborted)) outcome = { error: signal?.reason instanceof Error ? signal.reason : closeRequested ? closeReason : /* @__PURE__ */ new Error("SQLite snapshot aborted") };
			if (!outcome) {
				selected.settled.service();
				if (!selected.outcome) return;
				outcome = "error" in selected.outcome ? selected.outcome : { value: leaseFlight(key, selected, selected.outcome.value) };
			}
			if (waiting) {
				waiting = false;
				selected.waiters--;
				signal?.removeEventListener("abort", serviceWaiter);
				if (selected.waiters === 0 && selected.leases === 0) {
					removeFlight(key, selected);
					if (!selected.base) selected.controller.abort();
				}
			}
			selected.settled.service();
			if (selected.waiters === 0 && selected.leases === 0 && !lifecycle?.trackProducer) {
				if (selected.settled.read().status === "pending") return;
				if (selected.cleanupFailure) outcome = { error: selected.cleanupFailure.error };
			}
			selected.listeners.delete(retained.operation);
			if ("error" in outcome) retained.reject(outcome.error);
			else retained.resolve(outcome.value);
		} finally {
			servicing = false;
		}
	});
	const serviceWaiter = retained.operation.service.bind(retained.operation);
	selected.listeners.add(retained.operation);
	signal?.addEventListener("abort", serviceWaiter, { once: true });
	queueMicrotask(() => retained.operation.service());
	if (signal?.aborted) retained.operation.service();
	const startClose = () => {
		if (closing?.read().status === "pending") return closing;
		closeRequested = true;
		let leaseClose;
		let producerClose;
		let servicingClose = false;
		const completion = createRetainedOperation(() => {
			if (servicingClose || completion.operation.read().status !== "pending") return;
			servicingClose = true;
			try {
				if (closed) {
					completion.resolve(void 0);
					return;
				}
				retained.operation.service();
				selected.settled.service();
				const alone = selected.waiters === 0 && selected.leases === 0;
				if (!selected.outcome && alone && selected.startProducerClose) {
					if (!producerClose) {
						producerClose = startCloseProducer(selected);
						producerClose.result.then(() => completion.operation.service(), () => completion.operation.service());
					}
					producerClose.service();
					const earlyClose = producerClose.read();
					if (earlyClose.status === "rejected") throw earlyClose.error;
				}
				if (!selected.outcome) return;
				if (outcome && "value" in outcome) {
					if (!leaseClose) {
						leaseClose = outcome.value.startCleanup();
						leaseClose.result.then(() => completion.operation.service(), () => completion.operation.service());
					}
					leaseClose.service();
					const released = leaseClose.read();
					if (released.status === "pending") return;
					if (released.status === "rejected") throw released.error;
					if (!released.value) throw new SqliteSnapshotCleanupError("SQLite snapshot lease cleanup did not complete");
				} else if (!("value" in selected.outcome && (selected.leases > 0 || selected.waiters > 0))) {
					if (!producerClose) {
						producerClose = startCloseProducer(selected);
						producerClose.result.then(() => completion.operation.service(), () => completion.operation.service());
					}
					producerClose.service();
					const joined = producerClose.read();
					if (joined.status === "pending") return;
					if (joined.status === "rejected") throw joined.error;
				}
				closed = true;
				completion.resolve(void 0);
			} catch (error) {
				completion.reject(error);
			} finally {
				servicingClose = false;
			}
		});
		closing = completion.operation;
		retained.operation.result.then(() => completion.operation.service(), () => completion.operation.service());
		selected.settled.result.then(() => completion.operation.service(), () => completion.operation.service());
		completion.operation.service();
		return completion.operation;
	};
	return {
		...retained.operation,
		startClose
	};
}
function startSingleFlightSqliteSnapshot(databasePath, operation, producer, signal, lifecycle) {
	return startSnapshotFlight(databasePath, operation, (flightSignal, recordFailure) => {
		const source = producer(flightSignal, recordFailure);
		const retained = createRetainedOperation(() => {
			source.service();
			const outcome = source.read();
			if (outcome.status === "fulfilled") retained.resolve({
				base: outcome.value,
				startCleanup: () => outcome.value.startCleanup()
			});
			else if (outcome.status === "rejected") retained.reject(outcome.error);
		});
		source.result.then(() => retained.operation.service(), () => retained.operation.service());
		return {
			operation: retained.operation,
			startClose: () => source.startClose()
		};
	}, signal, lifecycle, true);
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
//#endregion
//#region src/state/openclaw-state-db-snapshot-owner.ts
function createOpenClawStateSnapshotOwnerRegistry() {
	const releases = /* @__PURE__ */ new WeakMap();
	return {
		register(database, getCurrent) {
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
			releases.get(database)?.();
			releases.delete(database);
		}
	};
}
const openClawStateSnapshotOwners = resolveGlobalSingleton(Symbol.for("openclaw.stateSnapshotOwners"), createOpenClawStateSnapshotOwnerRegistry);
//#endregion
//#region src/state/openclaw-state-db-cache.ts
const stateDatabaseLifecycle = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseLifecycle"), () => ({
	cachedDatabases: /* @__PURE__ */ new Map(),
	retainedDatabaseHandles: /* @__PURE__ */ new Map(),
	idleTimers: /* @__PURE__ */ new WeakMap(),
	idleReferences: /* @__PURE__ */ new WeakMap(),
	unregisterRetainedExitClose: void 0,
	databaseIdentities: /* @__PURE__ */ new WeakMap(),
	borrowers: /* @__PURE__ */ new WeakMap(),
	databaseLifecycleListeners: /* @__PURE__ */ new Set(),
	terminalOpenLatch: createSqliteTerminalOpenLatch({ closeByPath: (pathname, error) => runtimeFailures.closeTerminalFailure(pathname, error) }),
	asyncResources: createOpenClawStateDatabaseAsyncLifecycle()
}), () => closeOpenClawStateDatabaseAsync());
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
const runtimeFailures = createOpenClawStateDatabaseRuntimeFailureOwner({
	cachedDatabases,
	latch: terminalOpenLatch,
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
	const errors = [];
	openClawStateSnapshotOwners.release(database.db);
	try {
		cancelSqliteWalWriteAdmission(database.db);
		database.walMaintenance?.close(options);
	} catch (error) {
		errors.push(error);
	}
	try {
		clearNodeSqliteKyselyCacheForDatabase(database.db);
	} catch (error) {
		errors.push(error);
	}
	try {
		closeTrackedStateDatabase(database.db);
	} catch (error) {
		errors.push(error);
	}
	let cleanupPending = false;
	if (!database.db.isOpen) try {
		database.afterClose?.();
	} catch (error) {
		errors.push(error);
		cleanupPending = true;
	}
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
	admitSqliteSchema(db);
	const schemaFacts = runSqliteReadOperationSync(db, () => {
		assertSupportedStateSchemaVersion(db, pathname);
		return getAdmittedSqliteSchemaFacts(db);
	});
	const { identity, admission } = asyncResources.publish(pathname);
	databaseIdentities.set(db, identity);
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
	registerNodeSqliteKyselyQueryErrorHandler(db, (error) => {
		if (!db.isTransaction && isSqliteCorruptionError(error)) evictCachedOpenClawStateDatabase(database);
	});
	terminalOpenLatch.clear(pathname);
	return database;
}
function getCachedOpenClawStateDatabase(pathname, options) {
	const maintenance = getOpenClawDatabaseMaintenanceScope();
	if (options?.readOnly) maintenance?.assertReadAdmission();
	else maintenance?.assertAdmission();
	assertExistingOpenClawStateSchemaCacheAdmission(pathname, stateDatabaseLifecycle);
	const runtimeFailure = runtimeFailures.get(pathname);
	if (runtimeFailure) throw runtimeFailure;
	const database = cachedDatabases.get(path.resolve(pathname));
	if (database && borrowers.get(database.db)?.retiring) throw new Error(`OpenClaw state database native borrower cleanup is pending: ${pathname}`);
	if (database) touchStateDatabase(database);
	return database;
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
	return terminalOpenLatch.record(pathname, error, generation);
}
/** Clear a terminal open failure after doctor rewrites the database file. */
function clearOpenClawStateDatabaseOpenFailure(pathname) {
	const resolvedPath = path.resolve(pathname);
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
	const failure = await terminalOpenLatch.getAsync(context.admission.databasePath, async (_path, generation) => {
		const { inspectOpenClawStateDatabaseGeneration } = await import("./openclaw-state-worker-store-CYGdaZoK.mjs");
		const matches = await inspectOpenClawStateDatabaseGeneration(context, generation, signal);
		if (matches === void 0) throw new Error("Recorded shared-state database generation is unavailable");
		return matches;
	});
	context.admission.assertCurrent();
	return failure;
}
/** Reject shared-state access after a process-local terminal failure. */
function assertOpenClawStateDatabaseOpenAllowed(pathname, ownership) {
	if (ownership === "cached-read") assertStateDatabaseReadAllowed(pathname);
	else assertStateDatabaseAccessAllowed(pathname);
	const { identity } = asyncResources.capture(pathname);
	const terminalFailure = terminalOpenLatch.get(pathname);
	if (terminalFailure) throw terminalFailure;
	const resolvedPath = path.resolve(pathname);
	for (const database of retainedDatabaseHandles.values()) if (borrowers.get(database.db)?.retiring && (database.path === resolvedPath || databaseIdentities.get(database.db)?.key === identity.key)) throw new Error(`OpenClaw state database native borrower cleanup is pending: ${pathname}`);
}
function recordOpenClawStateDatabaseLifecycleOpenError(pathname, error) {
	notifyOpenClawStateDatabaseLifecycle({
		kind: "open-error",
		path: path.resolve(pathname),
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
		runtimeFailures.closeTerminalFailure(pathname, quarantineFailure);
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
/** Close one cached shared state database handle by exact pathname. */
function closeOpenClawStateDatabaseByPath(pathname, options) {
	return retireOpenClawStateDatabaseHandles(path.resolve(pathname), options, asyncResources.identity(pathname));
}
/** Close all cached shared state database handles. */
function closeOpenClawStateDatabase(options) {
	retireOpenClawStateDatabaseHandles(void 0, options);
}
/** Register a resource owner before it can admit any shared-state worker opens. */
function registerOpenClawStateDatabaseAsyncResource(resource) {
	return asyncResources.register(resource);
}
/** Capture the canonical read generation before any asynchronous worker admission. */
const captureOpenClawStateDatabaseReadAdmission = asyncResources.capture;
/** Bind worker-created storage to its captured admission without publishing a native handle. */
function publishOpenClawStateDatabaseWorkerAdmission(admission) {
	asyncResources.publish(admission.databasePath);
	admission.assertCurrent();
}
/** Orderly lifecycle close; synchronous close remains native/exit cleanup only. */
async function closeOpenClawStateDatabaseAsync(options) {
	await asyncResources.close(void 0, async () => {
		await stopOpenClawStateDatabaseMaintenance();
		return retireOpenClawStateDatabaseHandles(void 0, options);
	});
}
/** Test whether a cached shared state database handle is still open, optionally at one path. */
function isOpenClawStateDatabaseOpen(pathname) {
	if (pathname !== void 0) return cachedDatabases.get(path.resolve(pathname))?.db.isOpen === true;
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
	getOpenClawStateDatabaseRuntimeFailure: runtimeFailures.get,
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
//#endregion
export { cloneEnvWithPlatformSemantics as $, SQLITE_IDLE_HANDLE_TTL_MS as A, coerceRequiredSqliteNumber as B, recordExistingOpenClawStateSchemaDatabase as C, SQLITE_WORKER_MAX_MESSAGE_BYTES as D, requestSqliteWorkerSchemaMaintenance as E, registerSqliteCacheExitClose as F, runSqliteImmediateTransactionSync as G, assertTransactionUsable as H, runInSqliteMaintenanceContext as I, runSqliteIntegrityOperationSync as J, assertSqliteIntegrity as K, createSqliteWalReclamationResult as L, migrateSqliteSchemaToStrictInTransaction as M, configureSqliteConnectionPragmas as N, SqliteWorkerError as O, configureSqlitePreSchemaPragmas as P, applyConfigEnvVars as Q, prepareSqliteDatabaseDirectory as R, isExistingOpenClawStateSchema as S, createSqliteWorkerOperationAdmission as T, retainSqliteWriteAdmissionService as U, normalizeSqliteNumber as V, runSqliteDeferredTransactionSync as W, deferSqlitePostCommitPublication as X, sqliteIntegrityCheckSteps as Y, withSqlitePostCommitPublications as Z, openTrackedStateDatabase as _, publishOpenClawStateDatabaseWorkerAdmission as a, captureOpenClawStateWorkerContextWithAdmission as b, registerOpenClawStateDatabaseLifecycleListener as c, retainOpenClawStateDatabaseForIndependentRead as d, compareOpenClawVersions as et, startSingleFlightSqliteSnapshot as f, resolvePrivateSqliteSnapshotStagingRoot as g, createSqliteSnapshotStagingDirectorySync as h, openClawStateDatabaseCache as i, migrateSqliteSchemaToStrict as j, retainSqliteWorkerErrorCode as k, requireOpenClawStateDatabaseIdentity as l, acquireSqliteSnapshotReadToken as m, captureOpenClawStateDatabaseReadAdmission as n, recordOpenClawStateDatabaseOpenFailure as o, prepareSqliteReadOnlyLocationFromOwnedDatabase as p, isTerminalSqliteIntegrityError as q, getOpenClawStateDatabaseTerminalFailureAsync as r, registerOpenClawStateDatabaseAsyncResource as s, borrowOpenClawStateDatabaseForAsyncRead as t, retainOpenClawStateDatabaseForIdle as u, openTrackedStateDatabaseResult as v, isGatewayExternallySupervised as w, getExistingOpenClawStateSchemaPath as x, captureOpenClawStateReadWorkerContextWithAdmission as y, decodeMountInfoPath as z };
