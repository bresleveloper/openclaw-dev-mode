import { O as hasErrnoCode, R as containsEnvVarReference, _ as resolveStateDir, j as resolveIdentityPathViaExistingAncestorSync, ot as coerceErrorMessage } from "./redact-tYkqLD33.mjs";
import { B as resolveGlobalSingleton, G as isRecord, L as readGlobalSingleton, _ as MAX_TIMER_TIMEOUT_MS, d as resolveRequiredOsHomeDir, h as isAbortError, i as isPathInside } from "./utils-c2rFzEZe.mjs";
import { D as sqliteExtendedResultCode, E as sqliteErrorCode, O as sqlitePrimaryResultCode, S as isSqliteLockError, f as registerNodeSqliteDisposeCallback, k as withSqliteNativeOpen, o as clearNodeSqliteKyselyCacheForDatabase, p as registerNodeSqliteKyselyQueryErrorHandler, r as isSqliteSchemaVersionError, w as markSqliteInspectionOperation, x as isSqliteCorruptionError, y as OPENCLAW_DATABASE_SCHEMA_DOCS_URL } from "./sqlite-user-version-Cr9fhNQ-.mjs";
import { t as mergeProcessEnv } from "./process-env-BNjOnVtu.mjs";
import { $ as getOpenClawDatabaseMaintenanceResourceScope, A as retainSnapshotTempDirectory, D as registerSnapshotTempDirectory, E as registerRetainedSnapshotTempDirectory, H as assertStateDatabaseAccessAllowed, J as StateDatabaseReadAdmissionInvalidatedError, N as SQLITE_SNAPSHOT_PREFIX, O as removeTempDirectory, P as acquireSqliteSnapshotToken, R as artifactPreservingReads, T as adoptPreparedLocation, U as assertStateDatabaseReadAllowed, X as isStateDatabaseReadAdmissionInvalidatedError, Y as createOpenClawStateDatabaseAsyncLifecycle, _ as markPrivateDirectoryCreationRefused, c as OpenClawQuarantineReadCleanupError, d as isSqliteInspectionDeadlineOwnedByCaller, et as getOpenClawDatabaseMaintenanceScope, f as resolveSqliteInspectionSignal, g as isPrivateDirectoryCreationRefused, h as runSqliteReadOnlyWorkerSync, j as retainSnapshotWork, k as removeTempDirectoryAsync, l as captureSqliteReadOnlyWorkerLaunch, m as runSqliteReadOnlyWorker, nt as observeOpenClawDatabaseMaintenanceResource, s as markOpenClawStateDatabaseFailure, t as captureSqliteSnapshotStagingOwner, tt as isOpenClawDatabaseMaintenanceResourceOwned, u as createScopedSqliteReadOnlyWorker, w as SqliteSnapshotCleanupError, z as isArtifactPreservingStateRead } from "./sqlite-snapshot-staging-owner-ctWsxzq7.mjs";
import { a as expandEnvNormalizationKeys, c as resolveEnvNormalizationKeys, d as normalizeFsSafeNativeEnv, l as clearFsSafeEnvFallback, n as isDangerousHostEnvVarName, r as normalizeEnvVarKey, s as normalizeZaiEnv, t as isDangerousHostEnvOverrideVarName, u as fsSafeEnvInput } from "./host-env-security-CLHI3kIs.mjs";
import { a as resolvePreferredOpenClawTmpDir, t as createSubsystemLogger } from "./subsystem-Y9GXTYwe.mjs";
import { t as formatErrorMessage } from "./errors-CvkendJg.mjs";
import { A as materializeErrorStack, D as AsyncWorkScope, O as runOutsideAsyncWorkScope, a as normalizeDatabasePath, f as isPostgresSqlConnection, k as runInDetachedAsyncContext, l as readDatabasePathIdentitySync, o as readDatabaseFileIdentity, p as sqlPublicationAnchor, t as assertExistingDatabaseIdentity, u as assertPostgresTransactionUsable } from "./sqlite-worker-identity-BvirgyPs.mjs";
import { n as createDeferredCore, t as isPromiseLike } from "./promise-like-ByIJ_1fR.mjs";
import { c as resolveQuarantineStorePath, r as resolveDatabasePath, s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DGDQTHyE.mjs";
import { D as revokeSqliteDatabaseAdmissionsForPath, E as revokeSqliteDatabaseAdmissions, J as findSqlClosingParenthesis, M as prepareSqliteTransactionCommit, N as stageSqliteTransactionState, P as withSqlitePostCommitPublications, V as throwSqliteLifecycleErrors, X as normalizeSchemaSql, _ as prepareSqliteDatabaseCleanClose, b as readSqliteDatabaseWriteRevision, c as getSqliteDatabaseAdmission, h as onSqliteDatabaseWriteSettled, ht as readSqliteReaderDiagnosticsForPath, j as discardSqliteTransactionState, mt as currentSqliteOperationTiming, pt as captureSqliteReaderOwner, s as getOrLoadSqliteDatabaseAdmissionForPath, v as publishSqliteDatabaseAdmission, vt as sqliteReaderDatabasePathKey, x as recordSqliteDatabaseIntegrity, z as createSqliteLifecycleAggregateError } from "./sqlite-database-admission-BHBZtMyW.mjs";
import { a as runWithSqliteBusyTimeout, b as captureSqliteSchemaFacts, d as resolveExistingSqliteFileUri, h as getAdmittedSqliteSchemaFacts, i as readSqliteBusyTimeout, l as openNodeSqliteDatabase, m as admitSqliteSchema, o as setSqliteBusyTimeout, p as resolveSqliteFilesystemPath, r as normalizeSqliteNonNegativeInteger, s as shouldReportSqliteLockFailure, u as requireNodeSqlite, v as registerSqliteSchemaMutationListener, y as runSqliteReadOperationSync } from "./openclaw-state-db-schema-migration-required-DX3ZK7SD.mjs";
import { i as normalizeLegacyDotBetaVersion, t as compareOpenClawSemver } from "./semver-aYpwYdrQ.mjs";
import { f as getStateRuntimeSchemaAdmission, r as assertSupportedStateSchemaVersion, x as getPostgresPhysicalFacts } from "./openclaw-state-db-schema-version-PFalGklL.mjs";
import { n as sha256FileSync$1 } from "./crypto-digest-DqNCiRzt.mjs";
import "./fs-safe-JcIGlJ4o.mjs";
import { D as flatMapRetainedOperation, O as mapRetainedOperation, R as runWithMainThreadTask, T as createRetainedOperation, i as createSqliteWorkerOperationAdmission } from "./worker-task-pool-Cn7mBBG4.mjs";
import fsSync, { existsSync, realpathSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { createDirectorySync, sameFileIdentity } from "@openclaw/fs-safe/advanced";
import { FsSafeError } from "@openclaw/fs-safe/errors";
import { AsyncLocalStorage } from "node:async_hooks";
import { performance as performance$1 } from "node:perf_hooks";
import { isMainThread, threadId } from "node:worker_threads";
import "node:fs/promises";
import { parse } from "semver";
import "@openclaw/fs-safe/durability";
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
//#region src/infra/sqlite-snapshot-file.ts
function sameFileStatFingerprint(left, right) {
	return sameFileIdentity(left, right) && left.size === right.size;
}
//#endregion
//#region src/infra/sqlite-file-generation.ts
function sameFileFingerprint(left, right) {
	return left.dev === right.dev && left.ino === right.ino && sameFileStatFingerprint(left, right) && left.sha256 === right.sha256;
}
function sameOptionalFileFingerprint(left, right) {
	return left === void 0 ? right === void 0 : right !== void 0 && sameFileFingerprint(left, right);
}
function sameSqliteFileGeneration(left, right) {
	return sameFileFingerprint(left.database, right.database) && sameOptionalFileFingerprint(left.journal, right.journal) && sameOptionalFileFingerprint(left.wal?.size === 0n ? void 0 : left.wal, right.wal?.size === 0n ? void 0 : right.wal);
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
		if (ROLLBACK_FILESYSTEM_MAGIC.has(fsSync.statfsSync(checkedPaths.canonicalPath).type)) return "rollback";
	} catch {}
	return combineMountEntryJournalPolicies(mountLookupPaths);
}
//#endregion
//#region src/infra/sqlite-transaction.ts
const DEFAULT_SLOW_BUSY_WAIT_MS = 1e3;
const DEFAULT_SLOW_TRANSACTION_HOLD_MS = 1e3;
const abortedTransactionSymbol = Symbol.for("openclaw.sqliteAbortedTransaction");
function assertTransactionUsable(db) {
	if (isPostgresSqlConnection(db)) {
		assertPostgresTransactionUsable(db);
		return;
	}
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
		callbackKind: "application-transaction",
		...transactionDiagnosticLabels(params.db, params.options),
		elapsedMs: params.elapsedMs,
		phases: {
			prepareMs: params.prepareMs,
			beginMs: params.beginMs,
			sqlMs: Math.max(0, params.elapsedMs - params.hostAdmissionWaitMs - params.databaseAdmissionWaitMs - params.commitMs),
			hostAdmissionWaitMs: params.hostAdmissionWaitMs,
			databaseAdmissionWaitMs: params.databaseAdmissionWaitMs,
			commitMs: params.commitMs
		},
		isMainThread,
		mode: params.mode,
		pid: process.pid,
		threadId,
		thresholdMs: params.options?.slowTransactionHoldMs ?? DEFAULT_SLOW_TRANSACTION_HOLD_MS
	});
}
function logTransactionStep(params, failure) {
	try {
		if (!failure && params.elapsedMs < slowBusyWaitThresholdMs(params.options)) return;
		const sqliteErrcode = failure ? sqliteExtendedResultCode(failure.error) : void 0;
		const sqlitePrimaryCode = failure ? sqlitePrimaryResultCode(failure.error) : void 0;
		(params.options?.logger ?? transactionLog).warn(failure ? "SQLite transaction lock wait failed" : "slow SQLite transaction step", {
			async: false,
			...params.options?.busyTimeoutMs !== void 0 ? { busyTimeoutMs: params.options.busyTimeoutMs } : {},
			...transactionDiagnosticLabels(params.db, params.options),
			...failure ? { code: sqliteErrorCode(failure.error) } : {},
			elapsedMs: params.elapsedMs,
			...failure ? { failureKind: "lock-contention" } : {},
			isMainThread,
			pid: process.pid,
			...sqliteErrcode !== void 0 ? { sqliteErrcode } : {},
			...sqlitePrimaryCode !== void 0 ? { sqlitePrimaryCode } : {},
			step: params.step,
			threadId,
			...params.beginAdmission ? { beginAdmission: { ...params.beginAdmission } } : {}
		});
	} catch {}
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
		logTransactionStep({
			beginAdmission,
			db: params.db,
			elapsedMs,
			options: params.options,
			step: params.step
		});
		return elapsedMs;
	} catch (error) {
		const elapsedMs = Date.now() - startedAt;
		if (isSqliteLockError(error) && shouldReportSqliteLockFailure(params.db) && !(params.step === "begin" && params.options?.beginLockFailureReporting === "suppress")) logTransactionStep({
			beginAdmission,
			db: params.db,
			elapsedMs,
			options: params.options,
			step: params.step
		}, { error });
		throw error;
	}
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
		discardSqliteTransactionState(db, error, "rolled-back");
		return;
	}
	try {
		db.exec("ROLLBACK");
	} catch {
		discardUnsafeConnection(db, error);
	}
}
function runSqliteTransactionSync(db, operation, mode, options) {
	if (db.isTransaction) {
		db.exec("SAVEPOINT openclaw_tx_nested");
		try {
			const result = runSqliteReadOperationSync(db, operation);
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
	const timing = currentSqliteOperationTiming();
	const prepareMs = timing ? Date.now() - timing.preparedAtMs : void 0;
	const beginMs = execTimedTransactionStep({
		db,
		options,
		sql: mode === "immediate" ? "BEGIN IMMEDIATE" : "BEGIN",
		step: "begin"
	});
	if (timing) timing.transactions.count += 1;
	return settleSqliteTransactionSync(db, operation, mode, beginMs, prepareMs, options);
}
function settleSqliteTransactionSync(db, operation, mode, beginMs, prepareMs, options, reservedSourceFence = false) {
	const timing = currentSqliteOperationTiming();
	const transactionStartedAt = Date.now();
	const admissionWaitBefore = timing?.hostAdmissionWaitMs ?? 0;
	const databaseAdmissionWaitBefore = timing?.databaseAdmissionWaitMs ?? 0;
	let commitMs = 0;
	const commit = () => {
		const startedAt = Date.now();
		const databaseAdmissionWaitBeforeCommit = timing?.databaseAdmissionWaitMs ?? 0;
		try {
			prepareSqliteTransactionCommit(db);
			execTimedTransactionStep({
				db,
				options,
				sql: "COMMIT",
				step: "commit"
			});
		} finally {
			commitMs += Date.now() - startedAt - ((timing?.databaseAdmissionWaitMs ?? 0) - databaseAdmissionWaitBeforeCommit);
		}
	};
	let commitStarted = false;
	try {
		const result = reservedSourceFence ? operation() : runSqliteReadOperationSync(db, operation);
		assertSyncTransactionResult(result);
		assertTransactionUsable(db);
		commitStarted = true;
		if (options?.withCommit) assertSyncTransactionResult(options.withCommit(commit));
		else commit();
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
				options,
				prepareMs,
				beginMs,
				hostAdmissionWaitMs: (timing?.hostAdmissionWaitMs ?? 0) - admissionWaitBefore,
				databaseAdmissionWaitMs: (timing?.databaseAdmissionWaitMs ?? 0) - databaseAdmissionWaitBefore,
				commitMs
			});
		} catch {} finally {
			if (timing) timing.preparedAtMs = Date.now();
		}
	}
}
/** Run synchronous reads against one deferred SQLite snapshot. */
function runSqliteDeferredTransactionSync(db, operation, options) {
	if (isPostgresSqlConnection(db)) return db.runTransaction(operation, options);
	assertTransactionUsable(db);
	return withSqlitePostCommitPublications(db, () => runSqliteTransactionSync(db, operation, "deferred", options));
}
/** Read-only composition reuses the caller's snapshot and rollback owner. */
function runSqliteReadSnapshotSync(db, operation, options) {
	if (isPostgresSqlConnection(db)) {
		assertPostgresTransactionUsable(db);
		if (db.isTransaction) {
			const result = operation();
			assertSyncTransactionResult(result);
			assertPostgresTransactionUsable(db);
			return result;
		}
		return db.runTransaction(operation, options, true);
	}
	assertTransactionUsable(db);
	if (!db.isTransaction) return runSqliteDeferredTransactionSync(db, operation, options);
	const result = runSqliteReadOperationSync(db, operation);
	assertSyncTransactionResult(result);
	assertTransactionUsable(db);
	return result;
}
function runSqliteImmediateTransactionSync(db, operation, options) {
	if (isPostgresSqlConnection(db)) return db.runTransaction(operation, options);
	assertTransactionUsable(db);
	return withSqlitePostCommitPublications(db, () => runSqliteTransactionSync(db, operation, "immediate", options));
}
function runSqliteSingleStatementSync(db, statement) {
	if (isPostgresSqlConnection(db)) return db.runTransaction(statement);
	assertTransactionUsable(db);
	return withSqlitePostCommitPublications(db, () => {
		if (db.isTransaction) return runSqliteTransactionSync(db, statement, "immediate");
		const result = runSqliteReadOperationSync(db, statement);
		assertSyncTransactionResult(result);
		return result;
	});
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
		if (allowClosedDescriptor && hasErrnoCode(error, "EBADF") || hasErrnoCode(error, "ENOENT")) return;
		throw error;
	}
}
function isSqliteWalSidecarSplitBrain(descriptor, target) {
	return descriptor.nlink === 0n || !target || descriptor.dev !== target.dev || descriptor.ino !== target.ino;
}
function detectSqliteWalSplitBrain(databasePath) {
	const descriptors = readUnlessMissing(() => fsSync.readdirSync(PROC_SELF_FD_PATH));
	const sidecarPaths = [`${databasePath}-wal`, `${databasePath}-shm`];
	for (const descriptorName of descriptors ?? []) {
		const descriptorPath = path.join(PROC_SELF_FD_PATH, descriptorName);
		const linkedPath = readUnlessMissing(() => fsSync.readlinkSync(descriptorPath));
		if (linkedPath === void 0) continue;
		const sidecarPath = sidecarPaths.find((candidate) => linkedPath === candidate || linkedPath === `${candidate} (deleted)`);
		if (!sidecarPath) continue;
		const descriptor = readUnlessMissing(() => fsSync.fstatSync(Number(descriptorName), { bigint: true }), true);
		if (descriptor === void 0 || readUnlessMissing(() => fsSync.readlinkSync(descriptorPath)) !== linkedPath) continue;
		const target = readUnlessMissing(() => fsSync.statSync(sidecarPath, { bigint: true }));
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
//#region src/infra/sqlite-wal-write-admission.ts
const admissions = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWalWriteAdmissions"), () => /* @__PURE__ */ new WeakMap());
/** A worker-maintained writer never checkpoints inline; its maintenance owner ticks instead. */
function registerSqliteWalWorkerMaintenance(database, execute, cancel) {
	database.exec("PRAGMA wal_autocheckpoint = 0;");
	const stopCheckpointTick = admissions.get(database)?.stopCheckpointTick;
	admissions.set(database, {
		execute,
		cancel
	});
	stopCheckpointTick?.();
}
function isSqliteWalWorkerMaintained(database) {
	return admissions.get(database)?.execute !== void 0;
}
function cancelSqliteWalWriteAdmission(database) {
	return admissions.get(database)?.cancel?.();
}
function createSqliteWalMaintenanceScheduler(database, operation, prepare, observe, onError, pageBudget, stopCheckpointTick) {
	const existingAdmission = admissions.get(database);
	admissions.set(database, {
		...existingAdmission,
		stopCheckpointTick
	});
	let pending;
	return () => {
		if (!pending) {
			const run = async () => {
				let remaining = pageBudget();
				let continuation = false;
				while (true) {
					const request = prepare(remaining);
					if (!request || remaining === 0 && admissions.get(database)?.execute) return;
					request.continuation = continuation;
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
					continuation = true;
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
			const { allocateWorkerOwnedSqliteSnapshotDirectory } = await import("./sqlite-snapshot-staging-allocation-DvAoZW_B.mjs");
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
		if (fsSync.existsSync(staged)) fsSync.renameSync(staged, `${location}${suffix}`);
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
//#endregion
//#region src/infra/sqlite-files.ts
/** SQLite main database plus every journal-mode sidecar that can contain database pages. */
const SQLITE_DATABASE_FILE_SUFFIXES = [
	"",
	"-wal",
	"-shm",
	"-journal"
];
SQLITE_DATABASE_FILE_SUFFIXES.slice(1);
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
	const candidates = fsSync.readdirSync(directory, { withFileTypes: true }).filter((entry) => entry.isFile() && entry.name.startsWith(prefix)).map((entry) => path.join(directory, entry.name)).filter((candidate) => fsSync.statSync(candidate).size === sourceSize);
	if (candidates.length === 0) return;
	const sourceHash = sha256FileSync$1(sourcePath);
	for (const candidate of candidates) if (sha256FileSync$1(candidate) === sourceHash) return candidate;
}
function copyOrphanedSidecar(sourcePath, epochMs) {
	const basePath = `${sourcePath}.orphaned-${epochMs}`;
	for (let suffix = 0;; suffix += 1) {
		const candidate = suffix === 0 ? basePath : `${basePath}-${suffix}`;
		try {
			fsSync.copyFileSync(sourcePath, candidate, fsSync.constants.COPYFILE_EXCL);
			return candidate;
		} catch (error) {
			if (error.code !== "EEXIST") throw error;
		}
	}
}
/** Preserve durable orphan sidecars before SQLite creates a replacement main database. */
function quarantineOrphanedSqliteSidecars(pathname) {
	if (fsSync.existsSync(pathname)) return;
	const sidecars = [{
		path: `${pathname}-wal`,
		minimumBytes: SQLITE_WAL_HEADER_BYTES
	}, {
		path: `${pathname}-journal`,
		minimumBytes: 0
	}].flatMap((sidecar) => {
		const stat = fsSync.statSync(sidecar.path, { throwIfNoEntry: false });
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
			if (directory) await fsSync.promises.rm(directory, {
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
function readQuarantineSchemaVersion(database, storePath, fresh = false) {
	const admitted = fresh ? void 0 : getSqliteDatabaseAdmission(database, quarantineSchemaAdmission);
	if (admitted) return admitted.version;
	const userVersion = database.prepare("PRAGMA user_version").get()?.user_version;
	if (typeof userVersion !== "number" || !Number.isInteger(userVersion)) throw new Error(`OpenClaw quarantine store ${storePath} has an invalid schema version.`);
	if (userVersion > OPENCLAW_QUARANTINE_SCHEMA_VERSION) throw new Error(`OpenClaw quarantine store ${storePath} uses newer schema version ${userVersion}.`);
	if (userVersion !== 0) publishSqliteDatabaseAdmission(database, quarantineSchemaAdmission, { version: userVersion });
	return userVersion;
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
	const resolved = resolveDatabasePath({ path: pathname });
	try {
		return normalizeDatabasePath(realpathSync.native(resolved));
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
					const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-CllwUHVK.mjs");
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
//#region \0@oxc-project+runtime@0.152.0/helpers/esm/usingCtx.js
function _usingCtx() {
	var r = "function" == typeof SuppressedError ? SuppressedError : function(r, e) {
		var n = Error();
		return n.name = "SuppressedError", n.error = r, n.suppressed = e, n;
	}, e = {}, n = [];
	function using(r, e) {
		if (null != e) {
			if (Object(e) !== e) throw new TypeError("using declarations can only be used with objects, functions, null, or undefined.");
			if (r) var o = e[Symbol.asyncDispose || Symbol["for"]("Symbol.asyncDispose")];
			if (void 0 === o && (o = e[Symbol.dispose || Symbol["for"]("Symbol.dispose")], r)) var t = o;
			if ("function" != typeof o) throw new TypeError("Object is not disposable.");
			t && (o = function o() {
				try {
					t.call(e);
				} catch (r) {
					return Promise.reject(r);
				}
			}), n.push({
				v: e,
				d: o,
				a: r
			});
		} else r && n.push({
			d: e,
			a: r
		});
		return e;
	}
	return {
		e,
		u: using.bind(null, !1),
		a: using.bind(null, !0),
		d: function d() {
			var o, t = this.e, s = 0;
			function next() {
				for (; o = n.pop();) try {
					if (!o.a && 1 === s) return s = 0, n.push(o), Promise.resolve().then(next);
					if (o.d) {
						var r = o.d.call(o.v);
						if (o.a) return s |= 2, Promise.resolve(r).then(next, err);
					} else s |= 1;
				} catch (r) {
					return err(r);
				}
				if (1 === s) return t !== e ? Promise.reject(t) : Promise.resolve();
				if (t !== e) throw t;
			}
			function err(n) {
				return t = t !== e ? new r(n, t) : n, next();
			}
			return next();
		}
	};
}
//#endregion
//#region src/state/openclaw-state-db-handle.ts
const identities = resolveGlobalSingleton(Symbol.for("openclaw.stateNativeIdentities"), () => /* @__PURE__ */ new WeakMap());
/** Physical identity admitted by the native opener, never a later pathname observation. */
function readTrackedStateDatabaseIdentity(database) {
	return identities.get(sqlPublicationAnchor(database));
}
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
		const openingIdentity = readDatabasePathIdentitySync(pathname);
		const database = withSqliteNativeOpen(() => openNodeSqliteDatabase(location, nativeOptions));
		try {
			assertStateDatabaseAccessAllowed(pathname);
			if (openingIdentity.key.startsWith("file:")) assertExistingDatabaseIdentity(pathname, openingIdentity.key, openingIdentity.birthtime);
			const identity = openingIdentity.key.startsWith("file:") ? openingIdentity : readDatabasePathIdentitySync(pathname);
			if (identity.key.startsWith("file:")) {
				identities.set(database, identity);
				const unregister = registerNodeSqliteDisposeCallback(database, () => {
					identities.delete(database);
					unregister();
				});
			}
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
/** Finish all native close stages even when a previous stage failed. */
function closeStateDatabaseHandle(database, options) {
	try {
		var _usingCtx$1 = _usingCtx();
		const errors = [];
		if (isPostgresSqlConnection(database.db)) {
			for (const connection of [database.db, database.db.anchor]) {
				if (connection === database.db.anchor && database.db.isOpen) break;
				try {
					if (connection.isOpen) connection.close();
				} catch (error) {
					errors.push(error);
				}
			}
			let cleanupPending = database.db.isOpen || database.db.anchor.isOpen;
			if (!cleanupPending) try {
				database.afterClose?.();
			} catch (error) {
				errors.push(error);
				cleanupPending = true;
			}
			return {
				errors,
				cleanupPending
			};
		}
		const seal = _usingCtx$1.u(prepareSqliteDatabaseCleanClose(database.db));
		const delegated = isSqliteWalWorkerMaintained(database.db);
		const priorCheckpointError = database.walMaintenance?.health?.state === "error";
		let checkpointed = false;
		try {
			checkpointed = database.walMaintenance?.close(options) === true && options?.checkpointMode !== "PASSIVE";
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
		if (errors.length === 0 && !cleanupPending && options?.checkpointMode !== "PASSIVE" && (checkpointed || delegated && !priorCheckpointError)) seal.publish();
		return {
			errors,
			cleanupPending
		};
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
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
//#endregion
export { prepareSqliteDatabaseDirectory as $, recordExistingOpenClawStateSchemaDatabase as A, resolveSqliteDatabaseFilePaths as B, openTrackedStateDatabase as C, captureOpenClawStateWorkerContextWithAdmission as D, captureOpenClawStateReadWorkerContextWithAdmission as E, prepareSqliteReadOnlyLocationSync as F, registerSqliteCacheExitClose as G, acquireSqliteSnapshotReadToken as H, startSqliteReadOnlyLocationAsync as I, retainSqliteWriteAdmissionService as J, createSqliteWalReclamationResult as K, withSqliteSnapshotWorker as L, SQLITE_IDLE_HANDLE_TTL_MS as M, openSqliteReadOnlyDatabase as N, getExistingOpenClawStateSchemaPath as O, prepareSqliteReadOnlyLocationAwaited as P, runSqliteSingleStatementSync as Q, isUpdateRehearsalPrivateDatabase as R, invalidateOpenClawStateRuntimeIntegrity as S, readTrackedStateDatabaseIdentity as T, configureSqliteConnectionPragmas as U, prepareSqliteReadOnlyLocationFromOwnedDatabase as V, configureSqlitePreSchemaPragmas as W, runSqliteImmediateTransactionSync as X, runSqliteDeferredTransactionSync as Y, runSqliteReadSnapshotSync as Z, requireOpenClawStateDatabaseIdentity as _, clearOpenClawStateDatabaseOpenFailure as a, applyConfigEnvVars as at, assertOpenClawStateRuntimeIntegrity as b, closeOpenClawStateDatabaseByPath as c, isOpenClawStateDatabaseOpen as d, decodeMountInfoPath as et, openClawStateDatabaseCache as f, registerOpenClawStateDatabaseLifecycleListener as g, registerOpenClawStateDatabaseAsyncResource as h, captureOpenClawStateIntegrityAdmission as i, isTerminalSqliteIntegrityError as it, isGatewayExternallySupervised as j, isExistingOpenClawStateSchema as k, closeOpenClawStateDatabaseForTest as l, recordOpenClawStateDatabaseOpenFailure as m, borrowOpenClawStateDatabaseForAsyncRead as n, normalizeSqliteNumber as nt, closeOpenClawStateDatabase as o, cloneEnvWithPlatformSemantics as ot, publishOpenClawStateDatabaseWorkerAdmission as p, assertTransactionUsable as q, captureOpenClawStateDatabaseReadAdmission as r, assertSqliteIntegrity as rt, closeOpenClawStateDatabaseAsync as s, compareOpenClawVersions as st, assertPublishedOpenClawStateDatabaseLifecycle as t, coerceRequiredSqliteNumber as tt, getOpenClawStateDatabaseTerminalFailureAsync as u, retainOpenClawStateDatabaseForIdle as v, openTrackedStateDatabaseResult as w, assertStateDatabaseIntegrityOnce as x, retainOpenClawStateDatabaseForIndependentRead as y, quarantineOrphanedSqliteSidecars as z };
