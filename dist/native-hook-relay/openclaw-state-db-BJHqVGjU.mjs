import { C as resolveConfigIncludeWritePath, H as parseSecretRef, O as hasErrnoCode, S as readConfigIncludeFileWithGuards, T as parseJsonWithJson5Fallback, W as DEFAULT_SECRET_PROVIDER_ALIAS, _ as resolveStateDir, b as resolveProfileStateDir, d as resolveConfigPath, h as resolveIncludeRoots, it as truncateUtf16Safe, j as resolveIdentityPathViaExistingAncestorSync, lt as extractErrorCode, nt as pruneMapToMaxSize, r as redactSensitiveText, st as collectErrorGraphCandidates, w as resolveConfigIncludes, x as hashConfigIncludeRaw, z as resolveConfigEnvVars } from "./redact-tYkqLD33.mjs";
import { B as resolveGlobalSingleton, D as resolveNonNegativeIntegerOption, F as normalizeOptionalString, G as isRecord, I as readStringValue, P as normalizeOptionalLowercaseString, R as resolveGlobalMap, S as asSafeIntegerInRange, U as asOptionalRecord, V as asNullableRecord, c as expandHomePrefix, f as resolveUserPath, g as MAX_DATE_TIMESTAMP_MS, u as resolveRequiredHomeDir, v as asFiniteNumber, x as asPositiveSafeInteger } from "./utils-c2rFzEZe.mjs";
import { S as isSqliteLockError, _ as LAZY_ADDITIVE_STATE_INDEXES, a as StartupMaintenanceRequiredError, b as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, c as executeWithCachedStatement, g as FIRST_USE_STATE_TABLES, h as FIRST_USE_STATE_INDEXES, i as readSqliteUserVersion, m as DOCTOR_OWNED_STATE_TABLES, r as isSqliteSchemaVersionError, s as enableNodeSqliteKyselyStatementCache, v as LAZY_ADDITIVE_STATE_TABLES, x as isSqliteCorruptionError } from "./sqlite-user-version-Cr9fhNQ-.mjs";
import "./src-Dpfm4nnc.mjs";
import { A as retainSnapshotTempDirectory, B as withArtifactPreservingStateReads, C as normalizeAgentId, G as getStateDatabaseSchemaLease, H as assertStateDatabaseAccessAllowed, J as StateDatabaseReadAdmissionInvalidatedError, K as withStateDatabaseColdAdmission, R as artifactPreservingReads, S as resolveOpenClawAgentSqlitePath, V as acquireStateDatabaseSchemaLease, Z as allowsMaintenanceLiveAuthorityReads, et as getOpenClawDatabaseMaintenanceScope, j as retainSnapshotWork, n as hydrateOpenClawStateWorkerError, nt as observeOpenClawDatabaseMaintenanceResource, p as runScopedSqliteReadOnlyOperation, q as applyPrivateModeSync, r as retainOpenClawStateWorkerErrorPayload, x as resolveIncognitoOpenClawAgentSqlitePath, z as isArtifactPreservingStateRead } from "./sqlite-snapshot-staging-owner-ctWsxzq7.mjs";
import { o as isTruthyEnvValue } from "./host-env-security-CLHI3kIs.mjs";
import { t as createSubsystemLogger } from "./subsystem-Y9GXTYwe.mjs";
import { t as formatErrorMessage } from "./errors-CvkendJg.mjs";
import { d as assertSyncTransactionResult, f as isPostgresSqlConnection, k as runInDetachedAsyncContext, l as readDatabasePathIdentitySync, m as VERSION, p as sqlPublicationAnchor, s as readDatabaseIdentityBirthtime, t as assertExistingDatabaseIdentity, u as assertPostgresTransactionUsable } from "./sqlite-worker-identity-BvirgyPs.mjs";
import { n as createDeferredCore, t as isPromiseLike } from "./promise-like-ByIJ_1fR.mjs";
import { a as resolveOpenClawStateDirForDatabasePath, c as resolveQuarantineStorePath, i as resolveOpenClawAgentDatabaseStoredPath, l as warnAgentPathMigration, n as existingPathOrUndefined, o as resolveOpenClawStateSqliteDir, r as resolveDatabasePath, s as resolveOpenClawStateSqlitePath, t as describeAgentPathMigration } from "./openclaw-state-db.paths-DGDQTHyE.mjs";
import { $ as quoteSqliteIdentifier, A as deferSqlitePostCommitPublication, B as runWithSqliteCleanup, C as resolveSqliteDatabaseFilePath, F as OpenClawStateExternalOwnershipError, H as OPENCLAW_STATE_SCHEMA_SQL, I as OpenClawStateOwnershipError, K as extractSqliteTableSchema, L as OpenClawStateOwnershipMetadataError, N as stageSqliteTransactionState, P as withSqlitePostCommitPublications, Q as normalizeSqlWhitespace, R as SqliteCoordinatorError, U as createSqliteIndexContract, V as throwSqliteLifecycleErrors, W as createSqliteTableContract, X as normalizeSchemaSql, Z as normalizeSqlIdentifier, at as SQLITE_EXPECTED_SCHEMA_CONTRACTS_KEY, c as getSqliteDatabaseAdmission, et as readSqlToken, lt as ensureSqliteLibrarySelected, m as invalidateLocalSqliteSchemaAdmissions, o as finishSqliteDatabaseWrite, pt as captureSqliteReaderOwner, t as beginSqliteDatabaseWrite, tt as splitSqlList, ut as getSqliteRuntimeCapabilities, v as publishSqliteDatabaseAdmission, y as publishSqliteDatabaseSchemaChange, z as createSqliteLifecycleAggregateError } from "./sqlite-database-admission-BHBZtMyW.mjs";
import { D as getNodeSqliteKysely, E as executeSqliteQueryTakeFirstSync, O as iterateSqliteQuerySync, S as runSqliteSchemaReadSnapshotSync, T as executeSqliteQuerySync, a as runWithSqliteBusyTimeout, b as captureSqliteSchemaFacts, f as resolveImmutableSqliteFileUri, g as invalidateSqliteSchemaFacts, h as getAdmittedSqliteSchemaFacts, k as prepareSqliteQuerySync, l as openNodeSqliteDatabase, n as normalizeOpenClawStateSchemaReadError, o as setSqliteBusyTimeout, t as OpenClawStateDatabaseSchemaMigrationRequiredError, w as createSqliteQueryCache, y as runSqliteReadOperationSync } from "./openclaw-state-db-schema-migration-required-DX3ZK7SD.mjs";
import { A as assertEngineStoreExecutionAllowed, C as admitPostgresCapabilities, D as verifyAndRecordPostgresSchema, E as readPostgresSchema, O as verifyPostgresSchema, S as requireNativeDatabaseFile, T as postgresSchemaSql, _ as createSqliteSchemaIssue, a as classifySqliteTableReadError, b as admitPostgresPhysicalFacts, c as tableExists, d as createStateSchemaAdmission, f as getStateRuntimeSchemaAdmission, g as SqliteSchemaMismatchError, h as publishStateSchemaVersionAdmission, i as readStateSchemaContentVersion, k as assertPostgresCatalog, l as tableHasColumn, m as publishStateRuntimeSchemaAdmission, n as admitStateSchemaFacts, o as ensureColumn, p as getStateSchemaVersionAdmission, r as assertSupportedStateSchemaVersion, s as readTableColumns$1, t as CONTENT_VERSION_KEY, u as tablePrimaryKeyColumns, v as legacySqliteSchemaIssueMessages, w as postgresSchemaMetadataSql, x as getPostgresPhysicalFacts, y as throwSqliteSchemaMismatches } from "./openclaw-state-db-schema-version-PFalGklL.mjs";
import { t as sha256Base64Url } from "./crypto-digest-DqNCiRzt.mjs";
import { $ as prepareSqliteDatabaseDirectory, A as recordExistingOpenClawStateSchemaDatabase, B as resolveSqliteDatabaseFilePaths, C as openTrackedStateDatabase, F as prepareSqliteReadOnlyLocationSync, G as registerSqliteCacheExitClose, H as acquireSqliteSnapshotReadToken, I as startSqliteReadOnlyLocationAsync, K as createSqliteWalReclamationResult, L as withSqliteSnapshotWorker, M as SQLITE_IDLE_HANDLE_TTL_MS, N as openSqliteReadOnlyDatabase, P as prepareSqliteReadOnlyLocationAwaited, Q as runSqliteSingleStatementSync, R as isUpdateRehearsalPrivateDatabase, S as invalidateOpenClawStateRuntimeIntegrity, T as readTrackedStateDatabaseIdentity, U as configureSqliteConnectionPragmas, V as prepareSqliteReadOnlyLocationFromOwnedDatabase, W as configureSqlitePreSchemaPragmas, X as runSqliteImmediateTransactionSync, Y as runSqliteDeferredTransactionSync, Z as runSqliteReadSnapshotSync, _ as requireOpenClawStateDatabaseIdentity, at as applyConfigEnvVars, b as assertOpenClawStateRuntimeIntegrity, f as openClawStateDatabaseCache, g as registerOpenClawStateDatabaseLifecycleListener, h as registerOpenClawStateDatabaseAsyncResource, i as captureOpenClawStateIntegrityAdmission, it as isTerminalSqliteIntegrityError, j as isGatewayExternallySupervised, k as isExistingOpenClawStateSchema, m as recordOpenClawStateDatabaseOpenFailure, n as borrowOpenClawStateDatabaseForAsyncRead, nt as normalizeSqliteNumber, ot as cloneEnvWithPlatformSemantics, q as assertTransactionUsable, r as captureOpenClawStateDatabaseReadAdmission, rt as assertSqliteIntegrity, tt as coerceRequiredSqliteNumber, w as openTrackedStateDatabaseResult, x as assertStateDatabaseIntegrityOnce, y as retainOpenClawStateDatabaseForIndependentRead, z as quarantineOrphanedSqliteSidecars } from "./openclaw-state-db-cache-CRSDAqPM.mjs";
import "./fs-safe-JcIGlJ4o.mjs";
import { A as StateDatabaseAdmissionPendingError, D as flatMapRetainedOperation, K as boolean, L as recordWorkerMessage, M as StateDatabaseOfflineMaintenanceError, O as mapRetainedOperation, Q as object, T as createRetainedOperation, U as _enum, X as looseObject, Y as literal, Z as number, _ as resolveStateReadWorkerCount, a as deferSqliteWorkerCommitReceipt, b as captureRetainedNativeWorkerSource, et as string, k as GatewayStateOwnerContentionError, n as createOwnedWorkerTaskPool, nt as unknown, p as SqliteWorkerError, q as custom, s as requestSqliteWorkerSchemaMaintenance, u as currentSqliteWorkerOperationAdmission, v as WorkerTaskError, y as DEFAULT_WORKER_PENDING_BYTES, z as captureRuntimeWorkerSource } from "./worker-task-pool-Cn7mBBG4.mjs";
import { r as resolveRuntimeWorkerThreadExecArgv } from "./runtime-worker-url-BOuHXXbo.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-C6BkyDvx.mjs";
import { t as captureOpenClawStateReadWorkerContext } from "./openclaw-state-worker-context-DQIyBJNl.mjs";
import { a as captureSqliteWorkerWalMaintenanceSuspension, i as acquireSqliteDatabaseAdmissionTurn, o as getSqliteWorkerExistingDatabaseIdentity, s as getSqliteWorkerStateIntegrityAdmission } from "./openclaw-state-worker-store-DmmHJeXQ.mjs";
import "./command-format-UoyM2uu9.mjs";
import fsSync, { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import "@openclaw/fs-safe/advanced";
import { AsyncLocalStorage } from "node:async_hooks";
import os from "node:os";
import { channel } from "node:diagnostics_channel";
import "node:perf_hooks";
import { MessageChannel, Worker, getEnvironmentData, isMainThread, receiveMessageOnPort, setEnvironmentData, threadId } from "node:worker_threads";
import "node:fs/promises";
import { isDeepStrictEqual } from "node:util";
import { parse } from "semver";
import JSON5 from "json5";
import "@openclaw/fs-safe/durability";
import { isProxy } from "node:util/types";
//#region packages/normalization-core/src/json-coercion.ts
/** Parses JSON without throwing, returning undefined for invalid input. */
function safeParseJson(value) {
	try {
		return JSON.parse(value);
	} catch {
		return;
	}
}
/** Parses JSON into a non-array record, returning undefined for every other result. */
function safeParseJsonRecord(value) {
	return /^[\t\n\r ]*\{/.test(value) ? asOptionalRecord(safeParseJson(value)) : void 0;
}
//#endregion
//#region src/config/resolution-facts.ts
const configResolutionFacts = /* @__PURE__ */ new WeakMap();
const envSecretRefsByFacts = /* @__PURE__ */ new WeakMap();
function createConfigResolutionFacts(warnings, pendingEnvSecretRefs = /* @__PURE__ */ new Map(), envProvider = DEFAULT_SECRET_PROVIDER_ALIAS, resolvedEnvSecretRefs = /* @__PURE__ */ new Map()) {
	const facts = new Set(warnings.map(({ configPath }) => configPath));
	const provider = envProvider?.trim() || "default";
	if (pendingEnvSecretRefs.size > 0 || resolvedEnvSecretRefs.size > 0) {
		const envSecretRefs = /* @__PURE__ */ new Map();
		for (const [state, refs] of [["pending", pendingEnvSecretRefs], ["resolved", resolvedEnvSecretRefs]]) for (const [path, id] of refs) envSecretRefs.set(path, {
			ref: {
				source: "env",
				provider,
				id
			},
			state
		});
		envSecretRefsByFacts.set(facts, envSecretRefs);
	}
	return facts;
}
function setConfigResolutionFacts(target, facts) {
	if (!target || typeof target !== "object") return;
	if (facts === null) {
		configResolutionFacts.delete(target);
		return;
	}
	configResolutionFacts.set(target, facts);
}
function getConfigResolutionFacts(target) {
	return target && typeof target === "object" ? configResolutionFacts.get(target) ?? null : null;
}
function copyConfigResolutionFacts(source, target) {
	setConfigResolutionFacts(target, getConfigResolutionFacts(source));
}
function cloneConfigWithResolutionFacts(value) {
	const cloned = structuredClone(value);
	copyConfigResolutionFacts(value, cloned);
	return cloned;
}
function copyConfigResolutionFactsExcept(source, target, paths) {
	const facts = getConfigResolutionFacts(source);
	if (facts === null) {
		setConfigResolutionFacts(target, null);
		return;
	}
	const envSecretRefs = envSecretRefsByFacts.get(facts);
	if (!paths.some((path) => facts.has(path) || envSecretRefs?.has(path) === true)) {
		setConfigResolutionFacts(target, facts);
		return;
	}
	const remaining = new Set(facts);
	paths.forEach((path) => remaining.delete(path));
	if (envSecretRefs) {
		const remainingEnvSecretRefs = new Map(envSecretRefs);
		paths.forEach((path) => remainingEnvSecretRefs.delete(path));
		if (remainingEnvSecretRefs.size > 0) envSecretRefsByFacts.set(remaining, remainingEnvSecretRefs);
	}
	setConfigResolutionFacts(target, remaining);
}
function hasUnresolvedConfigPath(target, path) {
	return getConfigResolutionFacts(target)?.has(path) === true;
}
/** Returns only a still-pending reference recorded from the authored config source. */
function getAuthoredConfigSecretRef(target, path) {
	const facts = getConfigResolutionFacts(target);
	const fact = facts ? envSecretRefsByFacts.get(facts)?.get(path) : void 0;
	return fact?.state === "pending" ? fact.ref : null;
}
/** Returns the env source of a value that config substitution already materialized. */
function getResolvedConfigEnvSecretRef(target, path) {
	const facts = getConfigResolutionFacts(target);
	const fact = facts ? envSecretRefsByFacts.get(facts)?.get(path) : void 0;
	return fact?.state === "resolved" ? fact.ref : null;
}
/** Reads inline references from authored facts and structured references from their values. */
function resolveConfigSecretRef(params) {
	return typeof params.value === "string" && getConfigResolutionFacts(params.config) !== null ? getAuthoredConfigSecretRef(params.config, params.path) ?? (params.includeResolved ? getResolvedConfigEnvSecretRef(params.config, params.path) : null) : parseSecretRef(params.value, params.defaults);
}
//#endregion
//#region src/config/io.read-helpers.ts
function coerceConfig(value) {
	return asOptionalRecord(value) ?? {};
}
function normalizeConfigIoDeps(overrides = {}) {
	const env = overrides.env ?? process.env;
	return {
		fs: overrides.fs ?? fsSync,
		json5: overrides.json5 ?? JSON5,
		env,
		lowerPrecedenceEnv: overrides.lowerPrecedenceEnv ?? {},
		homedir: overrides.homedir ?? (() => resolveRequiredHomeDir(env, os.homedir)),
		configPath: overrides.configPath ?? "",
		logger: overrides.logger ?? console,
		measure: overrides.measure ?? (async (_name, run) => await run()),
		suppressFutureVersionWarning: overrides.suppressFutureVersionWarning ?? (isTruthyEnvValue(env.OPENCLAW_UPDATE_IN_PROGRESS) || isTruthyEnvValue(env.OPENCLAW_UPDATE_POST_CORE)),
		observe: overrides.observe ?? true
	};
}
function parseConfigJson5(raw, json5 = JSON5) {
	try {
		return {
			ok: true,
			parsed: parseJsonWithJson5Fallback(raw, json5)
		};
	} catch (err) {
		return {
			ok: false,
			error: String(err)
		};
	}
}
function resolveConfigIncludesForRead(parsed, configPath, deps, includeFileHashesForWrite, includeFileTargetsForWrite, includeFilePathsForWatch, onIncludeResolved) {
	const allowedRoots = resolveIncludeRoots(deps.env, deps.homedir);
	const recordIncludeWatchPath = (resolvedPath) => {
		includeFilePathsForWatch?.add(path.normalize(resolvedPath));
	};
	const recordIncludeTarget = (resolvedPath, canonicalPath) => {
		if (!includeFileTargetsForWrite) return;
		const normalizedPath = path.normalize(resolvedPath);
		try {
			includeFileTargetsForWrite[normalizedPath] = path.normalize(canonicalPath ?? resolveConfigIncludeWritePath({
				configPath,
				includePath: resolvedPath,
				allowedRoots
			}));
		} catch {}
	};
	return resolveConfigIncludes(parsed, configPath, {
		readFile: (candidate) => deps.fs.readFileSync(candidate, "utf-8"),
		onLexicalPath: recordIncludeWatchPath,
		onIncludeResolved,
		readFileWithGuards: ({ includePath, resolvedPath, rootRealDir }) => {
			try {
				const raw = readConfigIncludeFileWithGuards({
					includePath,
					resolvedPath,
					rootRealDir,
					ioFs: deps.fs,
					onResolvedPath: (canonicalPath) => {
						recordIncludeWatchPath(canonicalPath);
						recordIncludeTarget(resolvedPath, canonicalPath);
					}
				});
				if (includeFileHashesForWrite) includeFileHashesForWrite[path.normalize(resolvedPath)] = hashConfigIncludeRaw(raw);
				return raw;
			} catch (error) {
				const missing = collectErrorGraphCandidates(error, (current) => [current.cause]).some((candidate) => extractErrorCode(candidate) === "ENOENT");
				if (includeFileHashesForWrite && missing) includeFileHashesForWrite[path.normalize(resolvedPath)] = hashConfigIncludeRaw(null);
				if (missing) recordIncludeTarget(resolvedPath);
				throw error;
			}
		},
		parseJson: (raw) => deps.json5.parse(raw)
	}, { allowedRoots });
}
function resolveConfigForRead(resolvedIncludes, env, lowerPrecedenceEnv = {}) {
	if (resolvedIncludes && typeof resolvedIncludes === "object" && "env" in resolvedIncludes) applyConfigEnvVars(resolvedIncludes, env, { lowerPrecedenceEnv });
	const envWarnings = [];
	const pendingEnvSecretRefs = /* @__PURE__ */ new Map();
	const resolvedEnvSecretRefs = /* @__PURE__ */ new Map();
	const resolvedConfigRaw = resolveConfigEnvVars(resolvedIncludes, env, {
		onMissing: (warning) => envWarnings.push(warning),
		onPendingEnvSecretRef: (id, configPath) => pendingEnvSecretRefs.set(configPath, id),
		onResolvedEnvSecretRef: (id, configPath) => resolvedEnvSecretRefs.set(configPath, id)
	});
	return {
		resolvedConfigRaw,
		envSnapshotForRestore: cloneEnvWithPlatformSemantics(env),
		envWarnings,
		resolutionFacts: createConfigResolutionFacts(envWarnings, pendingEnvSecretRefs, coerceConfig(resolvedConfigRaw).secrets?.defaults?.env, resolvedEnvSecretRefs)
	};
}
//#endregion
//#region src/shared/immutable-data.ts
const deeplyFrozenPlainData = /* @__PURE__ */ new WeakSet();
function isPlainDataObject(value) {
	if (isProxy(value)) return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === null || prototype === Object.prototype || Array.isArray(value) && prototype === Array.prototype;
}
function inspectPlainData(value, freeze, requireFrozen = true) {
	if (!value || typeof value !== "object") return typeof value !== "function";
	if (deeplyFrozenPlainData.has(value)) return true;
	if (!freeze && requireFrozen && (isProxy(value) || !Object.isFrozen(value))) return false;
	let plain = true;
	const inspected = /* @__PURE__ */ new Set();
	const pending = [value];
	while (pending.length) {
		const candidate = pending.pop();
		if (inspected.has(candidate)) continue;
		if (!isPlainDataObject(candidate)) {
			if (!freeze) return false;
			plain = false;
			continue;
		}
		if (!freeze && requireFrozen && !Object.isFrozen(candidate)) return false;
		inspected.add(candidate);
		for (const key of Reflect.ownKeys(candidate)) {
			const descriptor = Object.getOwnPropertyDescriptor(candidate, key);
			const member = descriptor.value;
			if (!("value" in descriptor) || typeof member === "function") {
				if (!freeze) return false;
				plain = false;
				continue;
			}
			if (member && typeof member === "object" && !deeplyFrozenPlainData.has(member)) pending.push(member);
		}
		if (freeze) Object.freeze(candidate);
	}
	if (plain && (freeze || requireFrozen)) for (const candidate of inspected) deeplyFrozenPlainData.add(candidate);
	return plain;
}
/** Immutable graphs keep their classification for exactly as long as their objects live. */
function isDeeplyFrozenPlainData(value) {
	return inspectPlainData(value, false);
}
/** Freeze an owner's cloned JSON snapshot without executing opaque members. */
function freezeJsonSnapshot(value) {
	inspectPlainData(value, true);
	return value;
}
//#endregion
//#region src/config/runtime-config-publication.ts
/** The runtime config owner publishes identity facts before notifying consumers. */
const runtimeConfigPublication = {};
//#endregion
//#region src/infra/database-engine/observation.ts
const channels = {
	statement: channel("openclaw.database.statement"),
	request: channel("openclaw.database.request")
};
const observedConnections = /* @__PURE__ */ new WeakSet();
function normalizeSql(engine, sql) {
	let normalized = "";
	for (let i = 0; i < sql.length;) {
		const rest = sql.slice(i);
		if (rest.startsWith("/*")) {
			let depth = 1;
			i += 2;
			while (i < sql.length && depth) if (sql.startsWith("/*", i)) {
				depth++;
				i += 2;
			} else if (sql.startsWith("*/", i)) {
				depth--;
				i += 2;
			} else i++;
			normalized += " ";
			continue;
		}
		const comment = /^--[^\r\n]*/.exec(rest)?.[0];
		const literal = (engine === "postgres" ? /^[eE]'(?:\\[\s\S]|''|[^'\\])*(?:'|$)/.exec(rest)?.[0] : void 0) ?? /^(?:[uU]&)?'(?:''|[^'])*(?:'|$)/.exec(rest)?.[0];
		const dollar = /^\$(?:[A-Za-z_][\w]*)?\$/.exec(rest)?.[0];
		const identifier = /^(?:"(?:""|[^"])*"|`(?:``|[^`])*`|\[[^\]]*\])/.exec(rest)?.[0];
		const number = !/[\w$]/.test(sql[i - 1] ?? "") ? /^(?:0x[\da-f]+|\d+(?:\.\d*)?(?:e[+-]?\d+)?)(?!\w)/i.exec(rest)?.[0] : void 0;
		if (dollar) {
			const end = sql.indexOf(dollar, i + dollar.length);
			i = end < 0 ? sql.length : end + dollar.length;
			normalized += "?";
		} else if (comment || literal || identifier || number) {
			const token = comment ?? literal ?? identifier ?? number ?? "";
			i += token.length;
			normalized += comment ? " " : identifier ? token : "?";
		} else normalized += sql[i++];
	}
	return normalized.replace(/\s+/g, " ").trim();
}
function observeDatabaseOperation(engine, kind, sql, operation) {
	const target = channels[kind];
	if (!target.hasSubscribers) return operation();
	const started = performance.now();
	let outcome = "error";
	try {
		const result = operation();
		outcome = "ok";
		return result;
	} finally {
		const durationMs = performance.now() - started;
		target.publish({
			engine,
			sql: sql === void 0 ? void 0 : normalizeSql(engine, sql),
			threadId,
			outcome,
			durationMs
		});
	}
}
function observeConnection(db) {
	if (observedConnections.has(db)) return db;
	observedConnections.add(db);
	const exec = db.exec.bind(db);
	const prepare = db.prepare.bind(db);
	db.exec = (sql) => observeDatabaseOperation("sqlite", "statement", sql, () => exec(sql));
	db.prepare = (sql) => {
		const statement = prepare(sql);
		for (const key of [
			"get",
			"all",
			"run"
		]) {
			const execute = statement[key].bind(statement);
			Object.defineProperty(statement, key, {
				configurable: true,
				writable: true,
				value: (...parameters) => observeDatabaseOperation("sqlite", "statement", sql, () => execute(...parameters))
			});
		}
		const iterate = statement.iterate.bind(statement);
		statement.iterate = (...parameters) => {
			const iterator = iterate(...parameters);
			if (!channels.statement.hasSubscribers) return iterator;
			let durationMs = 0;
			let executed = false;
			let finished = false;
			const finish = (outcome) => {
				if (finished) return;
				finished = true;
				if (executed) channels.statement.publish({
					engine: "sqlite",
					sql: normalizeSql("sqlite", sql),
					threadId,
					outcome,
					durationMs
				});
			};
			const step = (operation) => {
				if (finished) return operation();
				const started = performance.now();
				try {
					const result = operation();
					durationMs += performance.now() - started;
					if (result.done) finish("ok");
					return result;
				} catch (error) {
					durationMs += performance.now() - started;
					finish("error");
					throw error;
				}
			};
			const observed = {
				next: (...args) => {
					executed = true;
					return step(() => iterator.next(...args));
				},
				return: (value) => step(() => iterator.return?.(value) ?? {
					done: true,
					value
				}),
				[Symbol.iterator]() {
					return this;
				}
			};
			Object.setPrototypeOf(observed, Object.getPrototypeOf(iterator));
			return observed;
		};
		return statement;
	};
	return db;
}
//#endregion
//#region src/infra/database-engine/policy.ts
const POSTGRES_CONNECT_TIMEOUT_MS = 6e4;
const POSTGRES_LOCK_TIMEOUT_MS = 6e4;
const POSTGRES_STATEMENT_TIMEOUT_MS = 9e4;
//#endregion
//#region src/infra/postgres-sync/protocol.ts
/** Rewrite anonymous bindings without changing quoted SQL, comments, or escaped ?? operators. */
function rewritePostgresPlaceholders(sql) {
	let result = "";
	let parameter = 0;
	let statementStart = true;
	for (let i = 0; i < sql.length;) {
		const rest = sql.slice(i);
		const quoted = /^(?:[eE]'(?:\\[\s\S]|''|[^'\\])*'|'(?:''|[^'])*'|"(?:""|[^"])*"|`(?:``|[^`])*`|\[[^\]]*\]|--[^\n]*(?:\n|$))/.exec(rest);
		const dollar = /^\$(?:[A-Za-z_][A-Za-z_0-9]*)?\$/.exec(rest)?.[0];
		if (rest.startsWith("/*")) {
			let end = i + 2;
			let depth = 1;
			while (end < sql.length && depth > 0) if (sql.startsWith("/*", end)) {
				depth++;
				end += 2;
			} else if (sql.startsWith("*/", end)) {
				depth--;
				end += 2;
			} else end++;
			result += sql.slice(i, end);
			i = end;
		} else if (dollar) {
			const end = sql.indexOf(dollar, i + dollar.length);
			const next = end < 0 ? sql.length : end + dollar.length;
			result += sql.slice(i, next);
			i = next;
			statementStart = false;
		} else if (quoted) {
			result += quoted[0];
			i += quoted[0].length;
			if (!quoted[0].startsWith("--")) statementStart = false;
		} else {
			if (statementStart && /^pragma\b/i.test(rest)) throw new Error("The experimental PostgreSQL engine does not support PRAGMA statements");
			const character = sql.charAt(i);
			if (character === "?" && sql[i + 1] === "?") {
				result += "?";
				i += 2;
			} else if (character === "?") {
				result += `$${++parameter}`;
				i++;
			} else {
				result += character;
				i++;
			}
			if (character === ";") statementStart = true;
			else if (!/\s/.test(character)) statementStart = false;
		}
	}
	return result;
}
function validatePostgresBindings(parameters) {
	for (const value of parameters) if (value !== null && typeof value !== "string" && typeof value !== "number" && typeof value !== "bigint" && !ArrayBuffer.isView(value)) throw new TypeError("SQL bindings must be null, numbers, bigints, strings, or ArrayBuffer views");
}
function decodePostgresRows(result, readBigInts) {
	return result.rows.map((row) => Object.fromEntries(result.fields.map((field) => {
		const value = row[field.name];
		let decoded;
		if (value === null) decoded = null;
		else if (field.dataTypeID === 20) {
			if (typeof value !== "string") throw new TypeError("PostgreSQL int8 results must be text");
			const integer = BigInt(value);
			if (readBigInts) decoded = integer;
			else {
				const number = Number(integer);
				if (!Number.isSafeInteger(number)) throw new RangeError(`PostgreSQL int8 ${integer} cannot be represented safely as a number`);
				decoded = number;
			}
		} else if (value instanceof Uint8Array) decoded = new Uint8Array(value);
		else if (typeof value === "boolean") decoded = Number(value);
		else if (typeof value === "string" || typeof value === "number" || typeof value === "bigint") decoded = value;
		else throw new TypeError(`Unsupported PostgreSQL result type for column ${field.name}`);
		return [field.name, decoded];
	})));
}
function isPostgresConnectionError(sqlState) {
	return !sqlState || sqlState.startsWith("08") || /^57P0[123]$/.test(sqlState);
}
function decodePostgresError(data) {
	const cause = Object.assign(new Error(data.message), data);
	const constraint = {
		"23505": [2067, "UNIQUE"],
		"23503": [787, "FOREIGN KEY"],
		"23502": [1299, "NOT NULL"],
		"23514": [275, "CHECK"]
	}[data.code ?? ""];
	return constraint ? Object.assign(new Error(`${constraint[1]} constraint failed: ${data.constraint ?? data.column ?? "unknown"}`, { cause }), {
		code: "ERR_SQLITE_ERROR",
		errcode: constraint[0]
	}) : cause;
}
//#endregion
//#region src/infra/postgres-sync/transaction.ts
function assertPostgresOperationCurrent() {
	const scope = currentSqliteWorkerOperationAdmission.getStore();
	if (scope && (!scope.active || scope.owner.refusal)) throw scope.owner.refusal ?? /* @__PURE__ */ new Error("PostgreSQL worker operation is no longer active");
}
function runPostgresTransactionSync(db, operation, options, readOnly = false, reserved = false) {
	assertPostgresTransactionUsable(db);
	assertPostgresOperationCurrent();
	return withSqlitePostCommitPublications(sqlPublicationAnchor(db), () => {
		const nested = db.isTransaction && !reserved;
		try {
			if (nested) db.exec("SAVEPOINT openclaw_tx_nested");
			else if (!db.isTransaction) db.exec(readOnly ? "BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY" : `BEGIN ISOLATION LEVEL READ COMMITTED; SELECT pg_advisory_xact_lock(${db.advisoryLockKey})`);
			const result = operation();
			assertSyncTransactionResult(result);
			assertPostgresTransactionUsable(db);
			if (nested) db.exec("RELEASE SAVEPOINT openclaw_tx_nested");
			else {
				const scope = currentSqliteWorkerOperationAdmission.getStore();
				if (!readOnly && scope?.active) deferSqliteWorkerCommitReceipt(sqlPublicationAnchor(db), {});
				const commit = () => {
					assertPostgresOperationCurrent();
					db.exec(readOnly ? "ROLLBACK" : "COMMIT");
				};
				if (options?.withCommit) assertSyncTransactionResult(options.withCommit(commit));
				else commit();
			}
			return result;
		} catch (error) {
			try {
				if (nested) {
					db.exec("ROLLBACK TO SAVEPOINT openclaw_tx_nested");
					db.exec("RELEASE SAVEPOINT openclaw_tx_nested");
				} else if (db.isTransaction) db.exec("ROLLBACK");
			} catch {
				try {
					db.close();
				} catch {}
			}
			throw error;
		}
	});
}
//#endregion
//#region src/infra/postgres-sync/connection.ts
var PostgresSyncConnection = class {
	constructor(url, schema, anchor, storeId, options) {
		this.schema = schema;
		this.anchor = anchor;
		this.isOpen = true;
		this.isTransaction = false;
		this.control = new Int32Array(new SharedArrayBuffer(8));
		this.requestId = 0;
		this.outcomeUnknown = true;
		this.mainThread = threadId === 0;
		assertEngineStoreExecutionAllowed();
		Object.defineProperty(this, Symbol.for("openclaw.postgres-sync-connection"), { value: true });
		this.advisoryLockKey = createHash("sha256").update(storeId).digest().readBigInt64BE();
		const { port1, port2 } = new MessageChannel();
		this.port = port1;
		const workerUrl = resolveRuntimeProcessEntrypointUrl("postgresBridge");
		this.worker = new Worker(workerUrl, {
			workerData: {
				port: port2,
				signal: this.control.buffer,
				url,
				schema,
				connectTimeoutMs: POSTGRES_CONNECT_TIMEOUT_MS,
				lockTimeoutMs: options?.lockTimeoutMs ?? 6e4,
				statementTimeoutMs: options?.statementTimeoutMs ?? 9e4
			},
			transferList: [port2],
			execArgv: resolveRuntimeWorkerThreadExecArgv(workerUrl)
		});
		this.worker.on("error", () => this.loseConnection());
		this.worker.unref();
		this.port.unref();
		try {
			this.request({ operation: "connect" });
		} catch (error) {
			this.isOpen = false;
			this.port.close();
			this.worker.terminate();
			throw error;
		}
	}
	runTransaction(operation, options, ...modes) {
		return runPostgresTransactionSync(this, operation, options, ...modes);
	}
	loseConnection() {
		if (!this.failure && this.outcomeUnknown) {
			beginSqliteDatabaseWrite(sqlPublicationAnchor(this));
			finishSqliteDatabaseWrite(sqlPublicationAnchor(this));
		}
		this.failure ??= this.outcomeUnknown ? new SqliteWorkerError("PostgreSQL connection lost; outcome unknown", "outcome-unknown") : /* @__PURE__ */ new Error("PostgreSQL connection lost; transaction rolled back");
		this.isOpen = false;
		this.isTransaction = false;
		this.port.close();
		this.worker.terminate();
		return this.failure;
	}
	assertOpen() {
		if (this.failure) throw this.failure;
		if (!this.isOpen) throw new Error("PostgreSQL connection is closed");
	}
	request(request, outcomeUnknown = true) {
		if (this.mainThread && request.operation !== "close") assertEngineStoreExecutionAllowed();
		this.assertOpen();
		this.outcomeUnknown = outcomeUnknown;
		const id = ++this.requestId;
		if (id > 2147483647) throw this.loseConnection();
		const deadline = performance.now() + 12e4;
		this.port.postMessage({
			...request,
			id
		}, []);
		recordWorkerMessage("sqlite_request", "to_worker");
		let observed;
		while ((observed = Atomics.load(this.control, 0)) !== id) {
			const remaining = deadline - performance.now();
			if (remaining <= 0) throw this.loseConnection();
			Atomics.wait(this.control, 0, observed, remaining);
		}
		const reply = receiveMessageOnPort(this.port)?.message;
		if (reply) recordWorkerMessage("sqlite_reply", "from_worker");
		if (!reply || reply.id !== id) throw this.loseConnection();
		if ("error" in reply) {
			if (request.operation === "connect") throw decodePostgresError(reply.error);
			if (isPostgresConnectionError(reply.error.code)) throw this.loseConnection();
			if (request.operation === "query" && /^\s*COMMIT\b/i.test(request.sql)) this.isTransaction = false;
			throw decodePostgresError(reply.error);
		}
		return reply.result;
	}
	query(sql, parameters = [], readBigInts = false) {
		return observeDatabaseOperation("postgres", "statement", sql, () => this.execute(sql, parameters, readBigInts));
	}
	execute(sql, parameters, readBigInts) {
		this.assertOpen();
		validatePostgresBindings(parameters);
		const rewrittenSql = rewritePostgresPlaceholders(sql);
		const wasTransaction = this.isTransaction;
		if (/^\s*BEGIN\b/i.test(sql)) this.isTransaction = true;
		const result = this.request({
			operation: "query",
			sql: rewrittenSql,
			parameters
		}, !wasTransaction || /^\s*COMMIT\b/i.test(sql));
		if (/^\s*(?:COMMIT|ROLLBACK)\s*;?\s*$/i.test(sql)) {
			this.isTransaction = false;
			if (/^\s*COMMIT\b/i.test(sql) && result.command !== "COMMIT") throw new Error("PostgreSQL transaction rolled back instead of committing");
		}
		const autocommitWrite = !wasTransaction && /^(?:INSERT|UPDATE|DELETE|MERGE|CREATE|ALTER|DROP|TRUNCATE|COMMENT|GRANT|REVOKE)$/.test(result.command ?? "");
		if (result.command === "COMMIT" || autocommitWrite) withSqlitePostCommitPublications(sqlPublicationAnchor(this), () => {
			beginSqliteDatabaseWrite(sqlPublicationAnchor(this));
			finishSqliteDatabaseWrite(sqlPublicationAnchor(this));
			if (autocommitWrite && currentSqliteWorkerOperationAdmission.getStore()?.active) deferSqliteWorkerCommitReceipt(sqlPublicationAnchor(this), {});
		});
		this.outcomeUnknown = !this.isTransaction;
		return {
			rows: decodePostgresRows(result, readBigInts),
			rowCount: result.rowCount,
			columns: result.fields.map(({ name }) => ({ name }))
		};
	}
	exec(sql) {
		this.query(sql);
	}
	prepare(sql) {
		this.assertOpen();
		rewritePostgresPlaceholders(sql);
		let readBigInts = false;
		let columns = [];
		const execute = (parameters) => {
			const result = this.query(sql, parameters, readBigInts);
			columns = result.columns;
			return result;
		};
		return {
			get: (...parameters) => execute(parameters).rows[0],
			all: (...parameters) => execute(parameters).rows,
			iterate: (...parameters) => execute(parameters).rows[Symbol.iterator](),
			run: (...parameters) => ({
				changes: execute(parameters).rowCount,
				lastInsertRowid: 0
			}),
			columns: () => columns,
			setReadBigInts: (enabled) => {
				readBigInts = enabled;
			}
		};
	}
	close() {
		if (!this.isOpen) return;
		try {
			this.request({ operation: "close" });
			if (Atomics.wait(this.control, 1, 0, 12e4) === "timed-out") throw this.loseConnection();
		} finally {
			this.isOpen = false;
			this.isTransaction = false;
			this.port.close();
		}
	}
};
//#endregion
//#region src/infra/database-engine/adapters.ts
function classifyError(error) {
	if (!(error instanceof Error)) return "other";
	if (("code" in error ? error.code : void 0) === "outcome-unknown") return "outcome-unknown";
	if (/connection.*lost/i.test(error.message)) return "connection-lost";
	if (/constraint/i.test(error.message)) return "constraint";
	if (/locked|busy|lock timeout/i.test(error.message)) return "busy";
	return "other";
}
const databaseEngineAdapters = {
	sqlite: {
		id: "sqlite",
		openConnection: ({ anchor }) => observeConnection(anchor),
		kysely: getNodeSqliteKysely,
		transactions: {
			write: runSqliteImmediateTransactionSync,
			read: runSqliteDeferredTransactionSync
		},
		capabilities: {
			fullText: "fts5",
			vector: "sqlite-vec"
		},
		schema: {
			bootstrap: (store) => store.openSqlite(),
			migrate: (store) => store.openSqlite()
		},
		classifyError
	},
	postgres: {
		id: "postgres",
		openConnection: (store) => {
			if (!store.input || !store.storeId || !store.namespace) throw new Error("PostgreSQL store is not admitted");
			try {
				return new PostgresSyncConnection(store.input.connection, store.namespace, store.anchor, store.storeId, {
					lockTimeoutMs: POSTGRES_LOCK_TIMEOUT_MS,
					statementTimeoutMs: POSTGRES_STATEMENT_TIMEOUT_MS
				});
			} catch (error) {
				const code = error instanceof Error && "code" in error && typeof error.code === "string" ? `${error.code}: ` : "";
				const reason = redactSensitiveText(`${code}${error instanceof Error ? error.message : String(error)}`.replaceAll(store.input.connection, "[REDACTED]"), { mode: "tools" });
				throw new Error(`Cannot open PostgreSQL connection: ${reason}; verify database.postgres.connection and server availability.`, { cause: error });
			}
		},
		kysely: getNodeSqliteKysely,
		transactions: {
			write: runSqliteImmediateTransactionSync,
			read: runSqliteReadSnapshotSync
		},
		capabilities: {
			fullText: "tsvector",
			vector: null
		},
		schema: {
			bootstrap: (store, db) => {
				if (!store.schema.postgres) throw new Error("Store has no PostgreSQL schema");
				db.exec(postgresSchemaSql(store.schema));
				db.prepare("INSERT INTO openclaw_schema_meta (store, version, store_id) VALUES (?, ?, ?)").run(store.schema.id, store.schema.version, store.storeId);
			},
			migrate: (store, from, db) => {
				if (from > store.schema.version) throw new Error(`PostgreSQL ${store.schema.id} schema ${from} is newer than this build (expected ${store.schema.version}); use a compatible binary, or reverse-port with a compatible binary before downgrading.`);
				for (let version = from + 1; version <= store.schema.version; version++) {
					const migration = store.schema.postgresMigrations?.find((step) => step.version === version);
					if (!migration) throw new Error(`Missing PostgreSQL ${store.schema.id} migration to version ${version}; use a compatible binary or restore a matching backup.`);
					verifyPostgresSchema(db, store.namespace, {
						...store.schema,
						version: version - 1,
						postgres: migration.fromSchema.postgres,
						postgresFragments: migration.fromSchema.postgresFragments
					}, readPostgresSchema(db, store.namespace, store.schema.id));
					db.exec(migration.sql);
					db.prepare("UPDATE openclaw_schema_meta SET version = ? WHERE store = ?").run(version, store.schema.id);
					verifyAndRecordPostgresSchema(db, store.namespace, {
						...store.schema,
						version,
						postgres: migration.schema.postgres,
						postgresFragments: migration.schema.postgresFragments
					});
				}
			}
		},
		classifyError
	}
};
//#endregion
//#region src/infra/database-engine/open.ts
const admissionKey = {
	name: "database.engine",
	read: (value) => {
		if (!value || typeof value !== "object" || !("engine" in value)) return;
		if (value.engine === "sqlite") return { engine: "sqlite" };
		if (value.engine === "postgres" && "storeId" in value && typeof value.storeId === "string" && "namespace" in value && typeof value.namespace === "string" && "version" in value && typeof value.version === "number") return {
			engine: "postgres",
			storeId: value.storeId,
			namespace: value.namespace,
			version: value.version
		};
	}
};
function readEngineAnchor(db, projection = "identity", requireTable = false) {
	try {
		return projection === "schema" ? [db.prepare("SELECT schema FROM openclaw_engine_anchor LIMIT 1").get()] : db.prepare("SELECT store_id, engine, schema FROM openclaw_engine_anchor").all();
	} catch (error) {
		if (requireTable || !(error instanceof Error) || error.message !== "no such table: openclaw_engine_anchor") throw error;
		return;
	}
}
function refusePostgresAnchor(db) {
	const rows = readEngineAnchor(db, "schema");
	if (rows) throw new Error(`This store lives in PostgreSQL schema ${String(rows[0]?.schema ?? "unknown")}; set database.engine to postgres and configure database.postgres.connection.`);
}
/** Reuses the physical SQLite admission exchange across worker handles and idle reopen. */
function openEngineStore(ref) {
	const { anchor, schema } = ref;
	observeConnection(anchor);
	const postgres = ref.input !== void 0 && schema.postgres !== void 0;
	const known = getSqliteDatabaseAdmission(anchor, admissionKey);
	if (!postgres) {
		if (known?.engine === "postgres") throw new Error(`This store lives in PostgreSQL schema ${known.namespace}; set database.engine to postgres and configure database.postgres.connection.`);
		if (!known && ref.inspectSqlite().hasEngineAnchor) refusePostgresAnchor(anchor);
		ref.prepareAnchor();
		databaseEngineAdapters.sqlite.schema.bootstrap({
			...ref,
			input: ref.input
		}, anchor);
		publishSqliteDatabaseAdmission(anchor, admissionKey, { engine: "sqlite" });
		return databaseEngineAdapters.sqlite.openConnection({
			...ref,
			input: ref.input
		});
	}
	if (known?.engine === "sqlite") throw new Error(`Existing SQLite ${schema.id} data cannot switch engines; stop the Gateway and use openclaw database port for a supported store family before changing database.engine.`);
	ref.prepareAnchor();
	const identity = known?.engine === "postgres" ? known : runSqliteImmediateTransactionSync(anchor, () => {
		const inspection = ref.inspectSqlite();
		if (inspection.hasExistingData) throw new Error(`Existing SQLite ${schema.id} data cannot switch engines; stop the Gateway and use openclaw database port for a supported store family before changing database.engine.`);
		if (!inspection.hasEngineAnchor && ref.existingOnly) throw new Error("Missing PostgreSQL anchor; restore the matching PostgreSQL schema and anchor.");
		if (!inspection.hasEngineAnchor) anchor.exec("CREATE TABLE IF NOT EXISTS openclaw_engine_anchor (store_id TEXT NOT NULL, engine TEXT NOT NULL CHECK (engine = 'postgres'), schema TEXT NOT NULL)");
		const rows = readEngineAnchor(anchor, "identity", true) ?? [];
		if (rows.length > 1 || inspection.hasEngineAnchor && rows.length === 0) throw new Error("Invalid engine anchor: expected exactly one identity. Restore a matching backup.");
		const row = rows[0];
		if (row) {
			if (typeof row.store_id !== "string" || row.engine !== "postgres" || typeof row.schema !== "string") throw new Error("Invalid PostgreSQL anchor identity. Restore a matching backup.");
			return {
				storeId: row.store_id,
				namespace: row.schema
			};
		}
		const storeId = randomUUID();
		const namespace = `${ref.input.schemaPrefix}_${schema.id}_${storeId.replaceAll("-", "").slice(0, 16)}`;
		anchor.prepare("INSERT INTO openclaw_engine_anchor (store_id, engine, schema) VALUES (?, 'postgres', ?)").run(storeId, namespace);
		return {
			storeId,
			namespace
		};
	});
	const store = {
		...ref,
		input: ref.input,
		...identity
	};
	const adapter = databaseEngineAdapters.postgres;
	const db = adapter.openConnection(store);
	const admit = (fresh) => {
		admitPostgresPhysicalFacts({
			anchor,
			db,
			namespace: identity.namespace,
			storeId: identity.storeId,
			store: schema.id,
			version: schema.version,
			schema,
			recordSchema: fresh
		});
		ref.admitPostgres?.(db, fresh);
	};
	try {
		if (!known || known.engine === "postgres" && known.version !== schema.version) {
			admitPostgresCapabilities(db);
			db.runTransaction(() => {
				const fresh = !db.prepare("SELECT 1 FROM pg_catalog.pg_namespace WHERE nspname = ?").get(identity.namespace);
				if (fresh && !ref.existingOnly) {
					db.exec(`CREATE SCHEMA IF NOT EXISTS "${identity.namespace.replaceAll("\"", "\"\"")}"`);
					db.exec(postgresSchemaMetadataSql);
				}
				let meta;
				try {
					meta = db.prepare("SELECT version, store_id FROM openclaw_schema_meta WHERE store = ?").get(schema.id);
				} catch (cause) {
					throw new Error("Missing PostgreSQL metadata; use the matching OpenClaw version or restore the matching PostgreSQL schema and anchor.", { cause });
				}
				if (!meta) {
					if (ref.existingOnly || !fresh) throw new Error("Missing PostgreSQL metadata; restore the matching PostgreSQL schema and anchor.");
					adapter.schema.bootstrap(store, db);
				} else {
					if (meta.store_id !== identity.storeId) throw new Error(`PostgreSQL database identity mismatch: expected ${identity.storeId}, found ${String(meta.store_id)}. Restore the matching anchor and PostgreSQL backup.`);
					if (meta.version !== schema.version) {
						invalidateLocalSqliteSchemaAdmissions(db);
						stageSqliteTransactionState(db, {
							stage: () => {},
							rollback: () => {},
							commit: () => publishSqliteDatabaseSchemaChange(db),
							invalidate: () => publishSqliteDatabaseSchemaChange(db)
						});
						adapter.schema.migrate(store, Number(meta.version), db);
					}
				}
				admit(!meta);
			});
		} else admit(false);
		if (!known || known.engine === "postgres" && known.version !== schema.version) publishSqliteDatabaseAdmission(anchor, admissionKey, {
			engine: "postgres",
			...identity,
			version: schema.version
		});
		return db;
	} catch (error) {
		if (ref.closeOnFailure) return ref.closeOnFailure(db, error);
		db.close();
		throw error;
	}
}
//#endregion
//#region src/infra/update-run-timeouts.ts
/** Shared legacy-reader grace and inactive update reconciliation threshold. */
const ABANDONED_UPDATE_RUN_MS = 18e5;
//#endregion
//#region src/state/openclaw-state-schema-publication.ts
const TERMINAL_GRACE_MS = 3e5;
/** Only the 2026.9.2 release line reopens the ledger without the transaction fence. */
function isUnfencedUpdateDriver(version) {
	const parsed = typeof version === "string" ? parse(version) : null;
	return parsed !== null && `${parsed.major}.${parsed.minor}.${parsed.patch}` === "2026.9.2";
}
/** Every unfenced driver must clear its own deadline; a newer run cannot hide an older one. */
function readStateSchemaPublicationBlocker(db, nowMs = Date.now()) {
	if (!tableExists(db, "update_runs")) return;
	const rows = executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("update_runs").select([
		"run_id",
		"before_json",
		"status",
		"updated_at_ms",
		"finished_at_ms"
	]).where((eb) => eb.or([eb.and([eb("status", "=", "running"), eb("updated_at_ms", ">=", nowMs - ABANDONED_UPDATE_RUN_MS)]), eb.and([eb("status", "!=", "running"), eb.or([eb("finished_at_ms", ">", nowMs - TERMINAL_GRACE_MS), eb("finished_at_ms", "is", null)])])])).orderBy("run_id")).rows;
	let blocker;
	for (const row of rows) {
		const before = JSON.parse(row.before_json);
		if (!isRecord(before) || typeof before.version !== "string" || !isUnfencedUpdateDriver(before.version)) continue;
		const deadline = row.status === "running" ? row.updated_at_ms + ABANDONED_UPDATE_RUN_MS + 1 : row.finished_at_ms === null ? null : row.finished_at_ms + TERMINAL_GRACE_MS;
		if (!blocker || deadline === null || blocker.publishAfterMs !== null && deadline > blocker.publishAfterMs) blocker = {
			runId: row.run_id,
			updaterVersion: before.version,
			publishAfterMs: deadline
		};
	}
	return blocker;
}
/** Called inside the schema write transaction, after all content migrations succeed. */
function resolveStateSchemaVersionToPublish(db) {
	const published = readSqliteUserVersion(db);
	if (published >= 22 || !readStateSchemaPublicationBlocker(db)) return 22;
	if (!tableExists(db, "config_machine_state")) throw new Error("Shared state schema publication cannot be deferred without config_machine_state.");
	writeStateSchemaContentVersion(db);
	invalidateSqliteSchemaFacts(db);
	return published;
}
/** Persist the content marker inside the schema owner's transaction. */
function writeStateSchemaContentVersion(db) {
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("config_machine_state").values({
		state_key: CONTENT_VERSION_KEY,
		value_json: String(22),
		updated_at_ms: Date.now()
	}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
		value_json: String(22),
		updated_at_ms: Date.now()
	}).where("config_machine_state.value_json", "!=", String(22))));
}
//#endregion
//#region src/state/postgres-schema.generated/runtime.ts
const statePostgresRuntime = {
	eagerSql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"acp_replay_events\" (\n  \"session_id\" text COLLATE \"C\" NOT NULL,\n  \"seq\" bigint NOT NULL,\n  \"at\" bigint NOT NULL,\n  \"session_key\" text COLLATE \"C\" NOT NULL,\n  \"run_id\" text COLLATE \"C\",\n  \"update_json\" text COLLATE \"C\" NOT NULL,\n  \"estimated_bytes\" bigint NOT NULL DEFAULT 0,\n  PRIMARY KEY (\"session_id\", \"seq\")\n);\n\nCREATE TABLE \"acp_replay_sessions\" (\n  \"session_id\" text COLLATE \"C\" NOT NULL,\n  \"session_key\" text COLLATE \"C\" NOT NULL,\n  \"cwd\" text COLLATE \"C\" NOT NULL,\n  \"complete\" bigint NOT NULL,\n  \"created_at\" bigint NOT NULL,\n  \"updated_at\" bigint NOT NULL,\n  \"next_seq\" bigint NOT NULL,\n  \"estimated_bytes\" bigint NOT NULL DEFAULT 0,\n  PRIMARY KEY (\"session_id\")\n);\n\nCREATE TABLE \"acp_sessions\" (\n  \"session_key\" text COLLATE \"C\" NOT NULL,\n  \"session_id\" text COLLATE \"C\",\n  \"backend\" text COLLATE \"C\" NOT NULL,\n  \"agent\" text COLLATE \"C\" NOT NULL,\n  \"runtime_session_name\" text COLLATE \"C\" NOT NULL,\n  \"identity_json\" text COLLATE \"C\",\n  \"resume_agent_session_id\" text COLLATE \"C\",\n  \"resume_acpx_session_id\" text COLLATE \"C\",\n  \"mode\" text COLLATE \"C\" NOT NULL,\n  \"runtime_options_json\" text COLLATE \"C\",\n  \"cwd\" text COLLATE \"C\",\n  \"state\" text COLLATE \"C\" NOT NULL,\n  \"last_activity_at\" bigint NOT NULL,\n  \"last_error\" text COLLATE \"C\",\n  \"updated_at\" bigint NOT NULL,\n  PRIMARY KEY (\"session_key\")\n);\n\nCREATE TABLE \"agent_database_leases\" (\n  \"lease_id\" text COLLATE \"C\" NOT NULL,\n  \"agent_id\" text COLLATE \"C\" NOT NULL,\n  \"path\" text COLLATE \"C\" NOT NULL,\n  \"owner_pid\" bigint NOT NULL,\n  \"owner_start_time\" bigint,\n  \"opened_at\" bigint NOT NULL,\n  \"provenance\" text COLLATE \"C\",\n  PRIMARY KEY (\"lease_id\")\n);\n\nCREATE TABLE \"agent_databases\" (\n  \"agent_id\" text COLLATE \"C\" NOT NULL,\n  \"path\" text COLLATE \"C\" NOT NULL,\n  \"schema_version\" bigint NOT NULL,\n  \"last_seen_at\" bigint NOT NULL,\n  \"size_bytes\" bigint,\n  PRIMARY KEY (\"agent_id\", \"path\")\n);\n\nCREATE TABLE \"agent_deletion_journal\" (\n  \"agent_id\" text COLLATE \"C\" NOT NULL,\n  \"operation_id\" text COLLATE \"C\" NOT NULL DEFAULT '',\n  \"phase\" text COLLATE \"C\",\n  \"agent_dir\" text COLLATE \"C\" NOT NULL,\n  \"workspace_dir\" text COLLATE \"C\" NOT NULL,\n  \"sessions_dir\" text COLLATE \"C\" NOT NULL,\n  \"database_paths_json\" text COLLATE \"C\" NOT NULL DEFAULT '[]',\n  \"cleanup_paths_json\" text COLLATE \"C\" NOT NULL DEFAULT '[]',\n  \"created_at\" bigint NOT NULL,\n  \"cleanup_completed\" bigint NOT NULL DEFAULT 0,\n  \"delete_files\" bigint NOT NULL DEFAULT 1,\n  PRIMARY KEY (\"agent_id\")\n);\n\nCREATE TABLE \"apns_registration_tombstones\" (\n  \"node_id\" text COLLATE \"C\" NOT NULL,\n  \"deleted_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"node_id\")\n);\n\nCREATE TABLE \"apns_registrations\" (\n  \"node_id\" text COLLATE \"C\" NOT NULL,\n  \"transport\" text COLLATE \"C\" NOT NULL,\n  \"token\" text COLLATE \"C\",\n  \"relay_handle\" text COLLATE \"C\",\n  \"send_grant\" text COLLATE \"C\",\n  \"installation_id\" text COLLATE \"C\",\n  \"relay_origin\" text COLLATE \"C\",\n  \"topic\" text COLLATE \"C\" NOT NULL,\n  \"environment\" text COLLATE \"C\" NOT NULL,\n  \"distribution\" text COLLATE \"C\",\n  \"token_debug_suffix\" text COLLATE \"C\",\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"node_id\")\n);\n\nCREATE TABLE \"audit_events\" (\n  \"sequence\" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,\n  \"event_id\" text COLLATE \"C\" NOT NULL,\n  \"source_id\" text COLLATE \"C\" NOT NULL,\n  \"schema_version\" bigint NOT NULL DEFAULT 1,\n  \"source_sequence\" bigint NOT NULL,\n  \"occurred_at\" bigint NOT NULL,\n  \"kind\" text COLLATE \"C\" NOT NULL,\n  \"action\" text COLLATE \"C\" NOT NULL,\n  \"status\" text COLLATE \"C\" NOT NULL,\n  \"error_code\" text COLLATE \"C\",\n  \"actor_type\" text COLLATE \"C\" NOT NULL,\n  \"actor_id\" text COLLATE \"C\" NOT NULL,\n  \"agent_id\" text COLLATE \"C\",\n  \"session_key\" text COLLATE \"C\",\n  \"session_id\" text COLLATE \"C\",\n  \"run_id\" text COLLATE \"C\",\n  \"tool_call_id\" text COLLATE \"C\",\n  \"tool_name\" text COLLATE \"C\",\n  \"direction\" text COLLATE \"C\",\n  \"channel\" text COLLATE \"C\",\n  \"conversation_kind\" text COLLATE \"C\",\n  \"message_outcome\" text COLLATE \"C\",\n  \"reason_code\" text COLLATE \"C\",\n  \"delivery_kind\" text COLLATE \"C\",\n  \"failure_stage\" text COLLATE \"C\",\n  \"duration_ms\" bigint,\n  \"result_count\" bigint,\n  \"account_ref\" text COLLATE \"C\",\n  \"conversation_ref\" text COLLATE \"C\",\n  \"message_ref\" text COLLATE \"C\",\n  \"target_ref\" text COLLATE \"C\",\n  PRIMARY KEY (\"sequence\"),\n  UNIQUE (\"event_id\"),\n  UNIQUE (\"source_id\")\n);\n\nCREATE TABLE \"audit_identity_keys\" (\n  \"id\" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,\n  \"key_id\" text COLLATE \"C\" NOT NULL,\n  \"key\" bytea NOT NULL,\n  \"created_at\" bigint NOT NULL,\n  PRIMARY KEY (\"id\"),\n  CHECK ((\"id\" = 1))\n);\n\nCREATE TABLE \"backup_runs\" (\n  \"id\" text COLLATE \"C\" NOT NULL,\n  \"created_at\" bigint NOT NULL,\n  \"archive_path\" text COLLATE \"C\" NOT NULL,\n  \"status\" text COLLATE \"C\" NOT NULL,\n  \"manifest_json\" text COLLATE \"C\" NOT NULL,\n  PRIMARY KEY (\"id\")\n);\n\nCREATE TABLE \"capture_blobs\" (\n  \"blob_id\" text COLLATE \"C\" NOT NULL,\n  \"content_type\" text COLLATE \"C\",\n  \"encoding\" text COLLATE \"C\" NOT NULL,\n  \"size_bytes\" bigint NOT NULL,\n  \"sha256\" text COLLATE \"C\" NOT NULL,\n  \"data\" bytea NOT NULL,\n  \"created_at\" bigint NOT NULL,\n  PRIMARY KEY (\"blob_id\")\n);\n\nCREATE TABLE \"capture_events\" (\n  \"id\" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,\n  \"session_id\" text COLLATE \"C\" NOT NULL,\n  \"ts\" bigint NOT NULL,\n  \"source_scope\" text COLLATE \"C\" NOT NULL,\n  \"source_process\" text COLLATE \"C\" NOT NULL,\n  \"protocol\" text COLLATE \"C\" NOT NULL,\n  \"direction\" text COLLATE \"C\" NOT NULL,\n  \"kind\" text COLLATE \"C\" NOT NULL,\n  \"flow_id\" text COLLATE \"C\" NOT NULL,\n  \"method\" text COLLATE \"C\",\n  \"host\" text COLLATE \"C\",\n  \"path\" text COLLATE \"C\",\n  \"status\" bigint,\n  \"close_code\" bigint,\n  \"content_type\" text COLLATE \"C\",\n  \"headers_json\" text COLLATE \"C\",\n  \"data_text\" text COLLATE \"C\",\n  \"data_blob_id\" text COLLATE \"C\",\n  \"data_sha256\" text COLLATE \"C\",\n  \"error_text\" text COLLATE \"C\",\n  \"meta_json\" text COLLATE \"C\",\n  PRIMARY KEY (\"id\")\n);\n\nCREATE TABLE \"capture_sessions\" (\n  \"id\" text COLLATE \"C\" NOT NULL,\n  \"started_at\" bigint NOT NULL,\n  \"ended_at\" bigint,\n  \"mode\" text COLLATE \"C\" NOT NULL,\n  \"source_scope\" text COLLATE \"C\" NOT NULL,\n  \"source_process\" text COLLATE \"C\" NOT NULL,\n  \"proxy_url\" text COLLATE \"C\",\n  PRIMARY KEY (\"id\")\n);\n\nCREATE TABLE \"channel_ingress_events\" (\n  \"queue_name\" text COLLATE \"C\" NOT NULL,\n  \"event_id\" text COLLATE \"C\" NOT NULL,\n  \"channel_id\" text COLLATE \"C\" NOT NULL,\n  \"account_id\" text COLLATE \"C\" NOT NULL,\n  \"status\" text COLLATE \"C\" NOT NULL,\n  \"lane_key\" text COLLATE \"C\",\n  \"payload_json\" text COLLATE \"C\" NOT NULL,\n  \"metadata_json\" text COLLATE \"C\",\n  \"received_at\" bigint NOT NULL,\n  \"updated_at\" bigint NOT NULL,\n  \"claim_token\" text COLLATE \"C\",\n  \"claim_owner\" text COLLATE \"C\",\n  \"claimed_at\" bigint,\n  \"attempts\" bigint NOT NULL DEFAULT 0,\n  \"last_attempt_at\" bigint,\n  \"last_error\" text COLLATE \"C\",\n  \"failed_reason\" text COLLATE \"C\",\n  \"failed_at\" bigint,\n  \"completed_at\" bigint,\n  \"completed_metadata_json\" text COLLATE \"C\",\n  PRIMARY KEY (\"queue_name\", \"event_id\")\n);\n\nCREATE TABLE \"channel_pairing_allow_entries\" (\n  \"channel_key\" text COLLATE \"C\" NOT NULL,\n  \"account_id\" text COLLATE \"C\" NOT NULL,\n  \"entry\" text COLLATE \"C\" NOT NULL,\n  \"sort_order\" bigint NOT NULL,\n  \"updated_at\" bigint NOT NULL,\n  PRIMARY KEY (\"channel_key\", \"account_id\", \"entry\")\n);\n\nCREATE TABLE \"channel_pairing_requests\" (\n  \"channel_key\" text COLLATE \"C\" NOT NULL,\n  \"account_id\" text COLLATE \"C\" NOT NULL,\n  \"request_id\" text COLLATE \"C\" NOT NULL,\n  \"code\" text COLLATE \"C\" NOT NULL,\n  \"created_at\" text COLLATE \"C\" NOT NULL,\n  \"last_seen_at\" text COLLATE \"C\" NOT NULL,\n  \"meta_json\" text COLLATE \"C\",\n  PRIMARY KEY (\"channel_key\", \"account_id\", \"request_id\")\n);\n\nCREATE TABLE \"claw_cron_refs\" (\n  \"agent_id\" text COLLATE \"C\" NOT NULL,\n  \"manifest_id\" text COLLATE \"C\" NOT NULL,\n  \"schema_version\" text COLLATE \"C\" NOT NULL,\n  \"declaration_key\" text COLLATE \"C\" NOT NULL,\n  \"scheduler_job_id\" text COLLATE \"C\",\n  \"status\" text COLLATE \"C\" NOT NULL,\n  \"job_json\" text COLLATE \"C\" NOT NULL,\n  \"error\" text COLLATE \"C\",\n  \"created_at_ms\" bigint NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"agent_id\", \"manifest_id\"),\n  UNIQUE (\"declaration_key\"),\n  UNIQUE (\"scheduler_job_id\")\n);\n\nCREATE TABLE \"claw_installs\" (\n  \"agent_id\" text COLLATE \"C\" NOT NULL,\n  \"schema_version\" text COLLATE \"C\" NOT NULL,\n  \"source_kind\" text COLLATE \"C\" NOT NULL,\n  \"claw_name\" text COLLATE \"C\" NOT NULL,\n  \"claw_version\" text COLLATE \"C\" NOT NULL,\n  \"package_root\" text COLLATE \"C\" NOT NULL,\n  \"manifest_path\" text COLLATE \"C\" NOT NULL,\n  \"integrity_kind\" text COLLATE \"C\" NOT NULL,\n  \"integrity\" text COLLATE \"C\" NOT NULL,\n  \"source_byte_length\" bigint NOT NULL,\n  \"manifest_schema_version\" bigint NOT NULL,\n  \"plan_integrity\" text COLLATE \"C\" NOT NULL,\n  \"workspace\" text COLLATE \"C\" NOT NULL,\n  \"agent_config_digest\" text COLLATE \"C\" NOT NULL,\n  \"agent_owned_paths_json\" text COLLATE \"C\" NOT NULL,\n  \"bootstrap_source_path\" text COLLATE \"C\",\n  \"bootstrap_content_digest\" text COLLATE \"C\",\n  \"status\" text COLLATE \"C\" NOT NULL,\n  \"added_at_ms\" bigint NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"agent_id\"),\n  CHECK ((\"status\" IN ('pending', 'workspace_ready', 'config_committed', 'complete', 'partial'))),\n  UNIQUE (\"workspace\")\n);\n\nCREATE TABLE \"claw_mcp_server_refs\" (\n  \"agent_id\" text COLLATE \"C\" NOT NULL,\n  \"name\" text COLLATE \"C\" NOT NULL,\n  \"schema_version\" text COLLATE \"C\" NOT NULL,\n  \"config_digest\" text COLLATE \"C\" NOT NULL,\n  \"relationship\" text COLLATE \"C\" NOT NULL,\n  \"origin\" text COLLATE \"C\" NOT NULL,\n  \"independent_owner\" bigint NOT NULL DEFAULT 0,\n  \"status\" text COLLATE \"C\" NOT NULL,\n  \"error\" text COLLATE \"C\",\n  \"created_at_ms\" bigint NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"agent_id\", \"name\"),\n  CHECK ((\"relationship\" IN ('managed', 'referenced'))),\n  CHECK ((\"origin\" IN ('claw-introduced', 'pre-existing'))),\n  CHECK ((\"independent_owner\" IN (0, 1)))\n);\n\nCREATE TABLE \"claw_package_refs\" (\n  \"agent_id\" text COLLATE \"C\" NOT NULL,\n  \"package_kind\" text COLLATE \"C\" NOT NULL,\n  \"package_source\" text COLLATE \"C\" NOT NULL,\n  \"package_ref\" text COLLATE \"C\" NOT NULL,\n  \"package_version\" text COLLATE \"C\" NOT NULL,\n  \"package_integrity\" text COLLATE \"C\" NOT NULL,\n  \"schema_version\" text COLLATE \"C\" NOT NULL,\n  \"claw_name\" text COLLATE \"C\" NOT NULL,\n  \"package_status\" text COLLATE \"C\" NOT NULL,\n  \"relationship\" text COLLATE \"C\" NOT NULL,\n  \"origin\" text COLLATE \"C\" NOT NULL,\n  \"independent_owner\" bigint NOT NULL,\n  \"extension_id\" text COLLATE \"C\",\n  \"extension_format\" text COLLATE \"C\",\n  \"extension_detected_format\" text COLLATE \"C\",\n  \"extension_mapped_json\" text COLLATE \"C\",\n  \"extension_unavailable_json\" text COLLATE \"C\",\n  \"extension_adapter_identity\" text COLLATE \"C\",\n  \"installed_at_ms\" bigint NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"agent_id\", \"package_kind\", \"package_source\", \"package_ref\", \"package_version\"),\n  CHECK ((\"relationship\" IN ('managed', 'referenced'))),\n  CHECK ((\"origin\" IN ('claw-introduced', 'pre-existing'))),\n  CHECK ((\"independent_owner\" IN (0, 1)))\n);\n\nCREATE TABLE \"claw_workspace_files\" (\n  \"agent_id\" text COLLATE \"C\" NOT NULL,\n  \"target_path\" text COLLATE \"C\" NOT NULL,\n  \"schema_version\" text COLLATE \"C\" NOT NULL,\n  \"workspace\" text COLLATE \"C\" NOT NULL,\n  \"source_path\" text COLLATE \"C\" NOT NULL,\n  \"content_digest\" text COLLATE \"C\" NOT NULL,\n  \"status\" text COLLATE \"C\" NOT NULL,\n  \"created_at_ms\" bigint NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"agent_id\", \"target_path\")\n);\n\nCREATE TABLE \"clawhub_promotion_claims\" (\n  \"slug\" text COLLATE \"C\" NOT NULL,\n  \"provider\" text COLLATE \"C\",\n  \"model_keys_json\" text COLLATE \"C\" NOT NULL,\n  \"ends_at_ms\" bigint NOT NULL,\n  \"claimed_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"slug\")\n);\n\nCREATE TABLE \"config_health_entries\" (\n  \"config_path\" text COLLATE \"C\" NOT NULL,\n  \"last_known_good_json\" text COLLATE \"C\",\n  \"last_promoted_good_json\" text COLLATE \"C\",\n  \"last_observed_suspicious_signature\" text COLLATE \"C\",\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"config_path\")\n);\n\nCREATE TABLE \"config_machine_state\" (\n  \"state_key\" text COLLATE \"C\" NOT NULL,\n  \"value_json\" text COLLATE \"C\" NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"state_key\")\n);\n\nCREATE TABLE \"cron_job_scratch\" (\n  \"store_key\" text COLLATE \"C\" NOT NULL,\n  \"job_id\" text COLLATE \"C\" NOT NULL,\n  \"content\" text COLLATE \"C\",\n  \"revision\" bigint NOT NULL,\n  \"source_sha256\" text COLLATE \"C\",\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"store_key\", \"job_id\"),\n  CHECK ((\"revision\" >= 1)),\n  CHECK (\"content\" IS NULL OR (octet_length(convert_to(\"content\", 'UTF8')) <= 262144))\n);\n\nCREATE TABLE \"cron_jobs\" (\n  \"store_key\" text COLLATE \"C\" NOT NULL,\n  \"job_id\" text COLLATE \"C\" NOT NULL,\n  \"declaration_key\" text COLLATE \"C\",\n  \"owner_agent_id\" text COLLATE \"C\",\n  \"name\" text COLLATE \"C\" NOT NULL,\n  \"description\" text COLLATE \"C\",\n  \"enabled\" bigint NOT NULL,\n  \"agent_id\" text COLLATE \"C\",\n  \"payload_kind\" text COLLATE \"C\" NOT NULL,\n  \"job_json\" text COLLATE \"C\" NOT NULL,\n  \"grant_definition_revision\" text COLLATE \"C\",\n  \"grant_definition_generation\" bigint,\n  \"grant_definition_updated_at\" bigint,\n  \"state_json\" text COLLATE \"C\" NOT NULL DEFAULT '{}',\n  \"runtime_updated_at_ms\" bigint,\n  \"schedule_identity\" text COLLATE \"C\",\n  \"sort_order\" bigint NOT NULL DEFAULT 0,\n  \"updated_at\" bigint NOT NULL,\n  PRIMARY KEY (\"store_key\", \"job_id\")\n);\n\nCREATE TABLE \"current_conversation_bindings\" (\n  \"binding_key\" text COLLATE \"C\" NOT NULL,\n  \"binding_id\" text COLLATE \"C\" NOT NULL,\n  \"target_session_key\" text COLLATE \"C\" NOT NULL,\n  \"channel\" text COLLATE \"C\" NOT NULL,\n  \"account_id\" text COLLATE \"C\" NOT NULL,\n  \"conversation_kind\" text COLLATE \"C\" NOT NULL,\n  \"parent_conversation_id\" text COLLATE \"C\",\n  \"conversation_id\" text COLLATE \"C\" NOT NULL,\n  \"target_kind\" text COLLATE \"C\" NOT NULL,\n  \"status\" text COLLATE \"C\" NOT NULL,\n  \"bound_at\" bigint NOT NULL,\n  \"expires_at\" bigint,\n  \"metadata_json\" text COLLATE \"C\",\n  \"record_json\" text COLLATE \"C\" NOT NULL,\n  \"updated_at\" bigint NOT NULL,\n  PRIMARY KEY (\"binding_key\")\n);\n\nCREATE TABLE \"delivery_queue_entries\" (\n  \"queue_name\" text COLLATE \"C\" NOT NULL,\n  \"id\" text COLLATE \"C\" NOT NULL,\n  \"status\" text COLLATE \"C\" NOT NULL,\n  \"entry_kind\" text COLLATE \"C\",\n  \"session_key\" text COLLATE \"C\",\n  \"channel\" text COLLATE \"C\",\n  \"target\" text COLLATE \"C\",\n  \"account_id\" text COLLATE \"C\",\n  \"retry_count\" bigint NOT NULL DEFAULT 0,\n  \"last_attempt_at\" bigint,\n  \"last_error\" text COLLATE \"C\",\n  \"recovery_state\" text COLLATE \"C\",\n  \"platform_send_started_at\" bigint,\n  \"entry_json\" text COLLATE \"C\" NOT NULL,\n  \"retention_id_prefix\" text COLLATE \"C\",\n  \"retention_max_age_ms\" bigint,\n  \"retention_max_entries\" bigint,\n  \"enqueued_at\" bigint NOT NULL,\n  \"updated_at\" bigint NOT NULL,\n  \"failed_at\" bigint,\n  PRIMARY KEY (\"queue_name\", \"id\")\n);\n\nCREATE TABLE \"device_auth_tokens\" (\n  \"device_id\" text COLLATE \"C\" NOT NULL,\n  \"role\" text COLLATE \"C\" NOT NULL,\n  \"token\" text COLLATE \"C\" NOT NULL,\n  \"scopes_json\" text COLLATE \"C\" NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"device_id\", \"role\")\n);\n\nCREATE TABLE \"device_bootstrap_tokens\" (\n  \"token_key\" text COLLATE \"C\" NOT NULL,\n  \"token\" text COLLATE \"C\" NOT NULL,\n  \"setup_id\" text COLLATE \"C\",\n  \"ts\" bigint NOT NULL,\n  \"device_id\" text COLLATE \"C\",\n  \"public_key\" text COLLATE \"C\",\n  \"profile_json\" text COLLATE \"C\",\n  \"redeemed_profile_json\" text COLLATE \"C\",\n  \"pending_profile_json\" text COLLATE \"C\",\n  \"issued_at_ms\" bigint NOT NULL,\n  \"last_used_at_ms\" bigint,\n  PRIMARY KEY (\"token_key\")\n);\n\nCREATE TABLE \"device_identities\" (\n  \"identity_key\" text COLLATE \"C\" NOT NULL,\n  \"device_id\" text COLLATE \"C\" NOT NULL,\n  \"public_key_pem\" text COLLATE \"C\" NOT NULL,\n  \"private_key_pem\" text COLLATE \"C\" NOT NULL,\n  \"created_at_ms\" bigint NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"identity_key\")\n);\n\nCREATE TABLE \"device_pairing_paired\" (\n  \"device_id\" text COLLATE \"C\" NOT NULL,\n  \"public_key\" text COLLATE \"C\" NOT NULL,\n  \"display_name\" text COLLATE \"C\",\n  \"operator_label\" text COLLATE \"C\",\n  \"platform\" text COLLATE \"C\",\n  \"device_family\" text COLLATE \"C\",\n  \"client_id\" text COLLATE \"C\",\n  \"client_mode\" text COLLATE \"C\",\n  \"browser_origin\" text COLLATE \"C\",\n  \"role\" text COLLATE \"C\",\n  \"roles_json\" text COLLATE \"C\",\n  \"scopes_json\" text COLLATE \"C\",\n  \"approved_scopes_json\" text COLLATE \"C\",\n  \"remote_ip\" text COLLATE \"C\",\n  \"tokens_json\" text COLLATE \"C\",\n  \"approved_via\" text COLLATE \"C\",\n  \"node_surface_json\" text COLLATE \"C\",\n  \"pending_node_surface_json\" text COLLATE \"C\",\n  \"created_at_ms\" bigint NOT NULL,\n  \"approved_at_ms\" bigint NOT NULL,\n  \"last_seen_at_ms\" bigint,\n  \"last_seen_reason\" text COLLATE \"C\",\n  PRIMARY KEY (\"device_id\")\n);\n\nCREATE TABLE \"device_pairing_pending\" (\n  \"request_id\" text COLLATE \"C\" NOT NULL,\n  \"device_id\" text COLLATE \"C\" NOT NULL,\n  \"public_key\" text COLLATE \"C\" NOT NULL,\n  \"display_name\" text COLLATE \"C\",\n  \"platform\" text COLLATE \"C\",\n  \"device_family\" text COLLATE \"C\",\n  \"client_id\" text COLLATE \"C\",\n  \"client_mode\" text COLLATE \"C\",\n  \"browser_origin\" text COLLATE \"C\",\n  \"role\" text COLLATE \"C\",\n  \"roles_json\" text COLLATE \"C\",\n  \"scopes_json\" text COLLATE \"C\",\n  \"remote_ip\" text COLLATE \"C\",\n  \"silent\" bigint,\n  \"is_repair\" bigint,\n  \"ts\" bigint NOT NULL,\n  \"refreshed_at_ms\" bigint,\n  PRIMARY KEY (\"request_id\")\n);\n\nCREATE TABLE \"diagnostic_events\" (\n  \"scope\" text COLLATE \"C\" NOT NULL,\n  \"event_key\" text COLLATE \"C\" NOT NULL,\n  \"payload_json\" text COLLATE \"C\" NOT NULL,\n  \"created_at\" bigint NOT NULL,\n  \"sequence\" bigint NOT NULL DEFAULT 0,\n  PRIMARY KEY (\"scope\", \"event_key\")\n);\n\nCREATE TABLE \"exec_approvals_config\" (\n  \"config_key\" text COLLATE \"C\" NOT NULL,\n  \"raw_json\" text COLLATE \"C\" NOT NULL,\n  \"socket_path\" text COLLATE \"C\",\n  \"has_socket_token\" bigint NOT NULL,\n  \"default_security\" text COLLATE \"C\",\n  \"default_ask\" text COLLATE \"C\",\n  \"default_ask_fallback\" text COLLATE \"C\",\n  \"auto_allow_skills\" bigint,\n  \"agent_count\" bigint NOT NULL,\n  \"allowlist_count\" bigint NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"config_key\")\n);\n\nCREATE TABLE \"flow_runs\" (\n  \"flow_id\" text COLLATE \"C\" NOT NULL,\n  \"shape\" text COLLATE \"C\",\n  \"sync_mode\" text COLLATE \"C\" NOT NULL DEFAULT 'managed',\n  \"owner_key\" text COLLATE \"C\" NOT NULL,\n  \"requester_origin_json\" text COLLATE \"C\",\n  \"controller_id\" text COLLATE \"C\",\n  \"revision\" bigint NOT NULL DEFAULT 0,\n  \"status\" text COLLATE \"C\" NOT NULL,\n  \"notify_policy\" text COLLATE \"C\" NOT NULL,\n  \"goal\" text COLLATE \"C\" NOT NULL,\n  \"current_step\" text COLLATE \"C\",\n  \"blocked_task_id\" text COLLATE \"C\",\n  \"blocked_summary\" text COLLATE \"C\",\n  \"state_json\" text COLLATE \"C\",\n  \"wait_json\" text COLLATE \"C\",\n  \"cancel_requested_at\" bigint,\n  \"created_at\" bigint NOT NULL,\n  \"updated_at\" bigint NOT NULL,\n  \"ended_at\" bigint,\n  PRIMARY KEY (\"flow_id\")\n);\n\nCREATE TABLE \"gateway_boot_lifecycle\" (\n  \"boot_id\" text COLLATE \"C\" NOT NULL,\n  \"pid\" bigint NOT NULL,\n  \"started_at_ms\" bigint NOT NULL,\n  \"completed_at_ms\" bigint,\n  \"outcome\" text COLLATE \"C\",\n  \"startup_reason\" text COLLATE \"C\",\n  \"reason\" text COLLATE \"C\",\n  PRIMARY KEY (\"boot_id\")\n);\n\nCREATE TABLE \"gateway_origin_device_tokens\" (\n  \"gateway_scope\" text COLLATE \"C\" NOT NULL,\n  \"device_id\" text COLLATE \"C\" NOT NULL,\n  \"role\" text COLLATE \"C\" NOT NULL,\n  \"token\" text COLLATE \"C\" NOT NULL,\n  \"scopes_json\" text COLLATE \"C\" NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"gateway_scope\", \"device_id\", \"role\")\n);\n\nCREATE TABLE \"gateway_restart_handoff\" (\n  \"handoff_key\" text COLLATE \"C\" NOT NULL,\n  \"kind\" text COLLATE \"C\" NOT NULL,\n  \"version\" bigint NOT NULL,\n  \"intent_id\" text COLLATE \"C\" NOT NULL,\n  \"pid\" bigint NOT NULL,\n  \"process_instance_id\" text COLLATE \"C\",\n  \"created_at\" bigint NOT NULL,\n  \"expires_at\" bigint NOT NULL,\n  \"reason\" text COLLATE \"C\",\n  \"restart_trace_started_at\" bigint,\n  \"restart_trace_last_at\" bigint,\n  \"source\" text COLLATE \"C\" NOT NULL,\n  \"restart_kind\" text COLLATE \"C\" NOT NULL,\n  \"supervisor_mode\" text COLLATE \"C\" NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"handoff_key\")\n);\n\nCREATE TABLE \"gateway_restart_intent\" (\n  \"intent_key\" text COLLATE \"C\" NOT NULL,\n  \"kind\" text COLLATE \"C\" NOT NULL,\n  \"pid\" bigint NOT NULL,\n  \"created_at\" bigint NOT NULL,\n  \"reason\" text COLLATE \"C\",\n  \"force\" bigint,\n  \"wait_ms\" bigint,\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"intent_key\")\n);\n\nCREATE TABLE \"gateway_restart_sentinel\" (\n  \"sentinel_key\" text COLLATE \"C\" NOT NULL,\n  \"version\" bigint NOT NULL,\n  \"kind\" text COLLATE \"C\" NOT NULL,\n  \"status\" text COLLATE \"C\" NOT NULL,\n  \"ts\" bigint NOT NULL,\n  \"session_key\" text COLLATE \"C\",\n  \"thread_id\" text COLLATE \"C\",\n  \"delivery_channel\" text COLLATE \"C\",\n  \"delivery_to\" text COLLATE \"C\",\n  \"delivery_account_id\" text COLLATE \"C\",\n  \"message\" text COLLATE \"C\",\n  \"continuation_json\" text COLLATE \"C\",\n  \"doctor_hint\" text COLLATE \"C\",\n  \"stats_json\" text COLLATE \"C\",\n  \"payload_json\" text COLLATE \"C\" NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"sentinel_key\")\n);\n\nCREATE TABLE \"macos_port_guardian_records\" (\n  \"pid\" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,\n  \"port\" bigint NOT NULL,\n  \"command\" text COLLATE \"C\" NOT NULL,\n  \"mode\" text COLLATE \"C\" NOT NULL,\n  \"timestamp\" double precision NOT NULL,\n  PRIMARY KEY (\"pid\")\n);\n\nCREATE TABLE \"managed_outgoing_image_records\" (\n  \"attachment_id\" text COLLATE \"C\" NOT NULL,\n  \"session_key\" text COLLATE \"C\" NOT NULL,\n  \"agent_id\" text COLLATE \"C\",\n  \"message_id\" text COLLATE \"C\",\n  \"created_at\" text COLLATE \"C\" NOT NULL,\n  \"updated_at\" text COLLATE \"C\",\n  \"retention_class\" text COLLATE \"C\",\n  \"alt\" text COLLATE \"C\" NOT NULL,\n  \"original_media_root\" text COLLATE \"C\" NOT NULL,\n  \"original_media_id\" text COLLATE \"C\" NOT NULL,\n  \"original_media_subdir\" text COLLATE \"C\" NOT NULL,\n  \"original_content_type\" text COLLATE \"C\" NOT NULL,\n  \"original_width\" bigint,\n  \"original_height\" bigint,\n  \"original_size_bytes\" bigint,\n  \"original_filename\" text COLLATE \"C\",\n  \"record_json\" text COLLATE \"C\" NOT NULL,\n  \"cleanup_pending\" bigint NOT NULL DEFAULT 0,\n  PRIMARY KEY (\"attachment_id\"),\n  CHECK ((\"cleanup_pending\" IN (0, 1)))\n);\n\nCREATE TABLE \"mcp_oauth_stores\" (\n  \"store_key\" text COLLATE \"C\" NOT NULL,\n  \"format_version\" bigint NOT NULL,\n  \"store_json\" text COLLATE \"C\" NOT NULL,\n  \"updated_at\" bigint NOT NULL,\n  PRIMARY KEY (\"store_key\"),\n  CHECK ((\"format_version\" = 1))\n);\n\nCREATE TABLE \"meeting_transcript_sessions\" (\n  \"session_id\" text COLLATE \"C\" NOT NULL,\n  \"started_at\" text COLLATE \"C\" NOT NULL,\n  \"selector\" text COLLATE \"C\" NOT NULL,\n  \"export_key\" text COLLATE \"C\" NOT NULL,\n  \"session_slug\" text COLLATE \"C\" NOT NULL,\n  \"provider_id\" text COLLATE \"C\" NOT NULL,\n  \"title\" text COLLATE \"C\",\n  \"source_json\" text COLLATE \"C\" NOT NULL,\n  \"source_account_id\" text COLLATE \"C\",\n  \"source_guild_id\" text COLLATE \"C\",\n  \"source_channel_id\" text COLLATE \"C\",\n  \"source_meeting_url\" text COLLATE \"C\",\n  \"source_thread_ts\" text COLLATE \"C\",\n  \"source_file_id\" text COLLATE \"C\",\n  \"stopped_at\" text COLLATE \"C\",\n  \"metadata_json\" text COLLATE \"C\",\n  \"metadata_agent_id\" text COLLATE \"C\",\n  \"export_manifest_json\" text COLLATE \"C\" NOT NULL DEFAULT '{}',\n  \"export_pending_json\" text COLLATE \"C\" NOT NULL DEFAULT '[]',\n  \"next_utterance_seq\" bigint NOT NULL DEFAULT 0,\n  \"created_at_ms\" bigint NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"session_id\", \"started_at\"),\n  CHECK ((\"next_utterance_seq\" >= 0)),\n  CHECK ((\"created_at_ms\" >= 0)),\n  CHECK ((\"updated_at_ms\" >= 0)),\n  UNIQUE (\"selector\")\n);\n\nCREATE TABLE \"meeting_transcript_summaries\" (\n  \"session_id\" text COLLATE \"C\" NOT NULL,\n  \"session_started_at\" text COLLATE \"C\" NOT NULL,\n  \"generated_at\" text COLLATE \"C\",\n  \"summary_json\" text COLLATE \"C\",\n  \"overview\" text COLLATE \"C\",\n  \"markdown\" text COLLATE \"C\",\n  \"utterance_count\" bigint NOT NULL,\n  PRIMARY KEY (\"session_id\", \"session_started_at\"),\n  CHECK ((\"utterance_count\" >= 0)),\n  CHECK (\"summary_json\" IS NOT NULL OR \"markdown\" IS NOT NULL)\n);\n\nCREATE TABLE \"meeting_transcript_utterances\" (\n  \"session_id\" text COLLATE \"C\" NOT NULL,\n  \"session_started_at\" text COLLATE \"C\" NOT NULL,\n  \"sequence\" bigint NOT NULL,\n  \"utterance_id\" text COLLATE \"C\",\n  \"started_at\" text COLLATE \"C\",\n  \"ended_at\" text COLLATE \"C\",\n  \"speaker_id\" text COLLATE \"C\",\n  \"speaker_label\" text COLLATE \"C\",\n  \"text\" text COLLATE \"C\" NOT NULL,\n  \"final\" bigint,\n  \"metadata_json\" text COLLATE \"C\",\n  PRIMARY KEY (\"session_id\", \"session_started_at\", \"sequence\"),\n  CHECK ((\"sequence\" >= 0)),\n  CHECK ((\"final\" IN (0, 1)))\n);\n\nCREATE TABLE \"migration_runs\" (\n  \"id\" text COLLATE \"C\" NOT NULL,\n  \"started_at\" bigint NOT NULL,\n  \"finished_at\" bigint,\n  \"status\" text COLLATE \"C\" NOT NULL,\n  \"report_json\" text COLLATE \"C\" NOT NULL,\n  PRIMARY KEY (\"id\")\n);\n\nCREATE TABLE \"migration_sources\" (\n  \"source_key\" text COLLATE \"C\" NOT NULL,\n  \"migration_kind\" text COLLATE \"C\" NOT NULL,\n  \"source_path\" text COLLATE \"C\" NOT NULL,\n  \"target_table\" text COLLATE \"C\" NOT NULL,\n  \"source_sha256\" text COLLATE \"C\",\n  \"source_size_bytes\" bigint,\n  \"source_record_count\" bigint,\n  \"last_run_id\" text COLLATE \"C\" NOT NULL,\n  \"status\" text COLLATE \"C\" NOT NULL,\n  \"imported_at\" bigint NOT NULL,\n  \"removed_source\" bigint NOT NULL DEFAULT 0,\n  \"report_json\" text COLLATE \"C\" NOT NULL,\n  PRIMARY KEY (\"source_key\")\n);\n\nCREATE TABLE \"native_hook_relay_bridges\" (\n  \"relay_id\" text COLLATE \"C\" NOT NULL,\n  \"pid\" bigint NOT NULL,\n  \"hostname\" text COLLATE \"C\" NOT NULL,\n  \"port\" bigint NOT NULL,\n  \"token\" text COLLATE \"C\" NOT NULL,\n  \"expires_at_ms\" bigint NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"relay_id\")\n);\n\nCREATE TABLE \"official_external_plugin_catalog_snapshots\" (\n  \"feed_url\" text COLLATE \"C\" NOT NULL,\n  \"body\" text COLLATE \"C\" NOT NULL,\n  \"status\" bigint NOT NULL,\n  \"etag\" text COLLATE \"C\",\n  \"last_modified\" text COLLATE \"C\",\n  \"checksum\" text COLLATE \"C\" NOT NULL,\n  \"saved_at\" text COLLATE \"C\" NOT NULL,\n  \"trust_mode\" text COLLATE \"C\",\n  \"trust_key_id\" text COLLATE \"C\",\n  \"trust_signature_count\" bigint,\n  \"trust_threshold\" bigint,\n  \"trust_verified_at\" text COLLATE \"C\",\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"feed_url\")\n);\n\nCREATE TABLE \"operator_approvals\" (\n  \"cursor_id\" bigint NOT NULL,\n  \"approval_id\" text COLLATE \"C\" NOT NULL,\n  \"resolution_ref\" text COLLATE \"C\" NOT NULL,\n  \"kind\" text COLLATE \"C\" NOT NULL,\n  \"status\" text COLLATE \"C\" NOT NULL,\n  \"presentation_json\" text COLLATE \"C\" NOT NULL,\n  \"requested_by_device_id\" text COLLATE \"C\",\n  \"requested_by_client_id\" text COLLATE \"C\",\n  \"requested_by_device_token_auth\" bigint NOT NULL DEFAULT 0,\n  \"reviewer_device_ids_json\" text COLLATE \"C\" NOT NULL,\n  \"source_agent_id\" text COLLATE \"C\",\n  \"source_session_key\" text COLLATE \"C\",\n  \"source_session_id\" text COLLATE \"C\",\n  \"source_run_id\" text COLLATE \"C\",\n  \"source_tool_call_id\" text COLLATE \"C\",\n  \"source_tool_name\" text COLLATE \"C\",\n  \"audience_session_keys_json\" text COLLATE \"C\" NOT NULL,\n  \"runtime_epoch\" text COLLATE \"C\" NOT NULL,\n  \"created_at_ms\" bigint NOT NULL,\n  \"expires_at_ms\" bigint NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  \"decision\" text COLLATE \"C\",\n  \"terminal_reason\" text COLLATE \"C\",\n  \"resolved_at_ms\" bigint,\n  \"resolver_kind\" text COLLATE \"C\",\n  \"resolver_id\" text COLLATE \"C\",\n  \"consumed_at_ms\" bigint,\n  \"consumed_by\" text COLLATE \"C\",\n  PRIMARY KEY (\"approval_id\"),\n  CHECK ((char_length(\"approval_id\") > 0) AND (\"approval_id\" NOT IN ('.', '..'))),\n  CHECK ((char_length(\"resolution_ref\") = 43) AND (\"resolution_ref\" COLLATE \"C\" !~ '\\A.*[^A-Za-z0-9_-].*\\Z')),\n  CHECK ((\"kind\" IN ('exec', 'plugin', 'system-agent'))),\n  CHECK ((\"status\" IN ('pending', 'allowed', 'denied', 'expired', 'cancelled'))),\n  CHECK ((\"decision\" IN ('allow-once', 'allow-always', 'deny'))),\n  CHECK ((\"terminal_reason\" IN ('user', 'timeout', 'malformed-verdict', 'no-route', 'run-aborted', 'gateway-restart', 'storage-corrupt'))),\n  CHECK ((\"resolver_kind\" IN ('device', 'channel', 'runtime', 'system'))),\n  CHECK ((\"expires_at_ms\" >= \"created_at_ms\")),\n  CHECK ((\"updated_at_ms\" >= \"created_at_ms\")),\n  CHECK (\"resolved_at_ms\" IS NULL OR (\"resolved_at_ms\" >= \"created_at_ms\")),\n  CHECK (\"resolved_at_ms\" IS NULL OR (\"resolved_at_ms\" <= \"updated_at_ms\")),\n  CHECK (\"consumed_at_ms\" IS NULL OR (\"consumed_at_ms\" >= \"resolved_at_ms\")),\n  CHECK (\"consumed_at_ms\" IS NULL OR (\"consumed_at_ms\" <= \"updated_at_ms\")),\n  CHECK ((\"requested_by_device_token_auth\" IN (0, 1))),\n  CHECK (((\"status\" = 'pending') AND \"decision\" IS NULL AND \"terminal_reason\" IS NULL AND \"resolved_at_ms\" IS NULL AND \"resolver_kind\" IS NULL AND \"resolver_id\" IS NULL AND \"consumed_at_ms\" IS NULL AND \"consumed_by\" IS NULL) OR ((\"status\" = 'allowed') AND (\"decision\" IN ('allow-once', 'allow-always')) AND (\"terminal_reason\" = 'user') AND \"resolved_at_ms\" IS NOT NULL AND \"resolver_kind\" IS NOT NULL) OR ((\"status\" = 'denied') AND (\"decision\" = 'deny') AND (\"terminal_reason\" IN ('user', 'malformed-verdict', 'no-route', 'storage-corrupt')) AND \"resolved_at_ms\" IS NOT NULL AND \"resolver_kind\" IS NOT NULL AND \"consumed_at_ms\" IS NULL AND \"consumed_by\" IS NULL) OR ((\"status\" = 'expired') AND (\"decision\" = 'deny') AND (\"terminal_reason\" = 'timeout') AND \"resolved_at_ms\" IS NOT NULL AND \"resolver_kind\" IS NOT NULL AND \"consumed_at_ms\" IS NULL AND \"consumed_by\" IS NULL) OR ((\"status\" = 'cancelled') AND (\"decision\" = 'deny') AND (\"terminal_reason\" IN ('run-aborted', 'gateway-restart')) AND \"resolved_at_ms\" IS NOT NULL AND \"resolver_kind\" IS NOT NULL AND \"consumed_at_ms\" IS NULL AND \"consumed_by\" IS NULL)),\n  CHECK ((\"consumed_at_ms\" IS NULL AND \"consumed_by\" IS NULL) OR ((\"status\" = 'allowed') AND (\"decision\" = 'allow-once') AND \"consumed_at_ms\" IS NOT NULL AND \"consumed_by\" IS NOT NULL))\n);\n\nCREATE TABLE \"outbound_media_provenance\" (\n  \"realpath\" text COLLATE \"C\" NOT NULL,\n  \"kind\" text COLLATE \"C\" NOT NULL,\n  \"version\" bigint NOT NULL,\n  \"sha256\" text COLLATE \"C\" NOT NULL,\n  \"size_bytes\" bigint NOT NULL,\n  \"created_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"realpath\")\n);\n\nCREATE TABLE \"plugin_binding_approvals\" (\n  \"plugin_root\" text COLLATE \"C\" NOT NULL,\n  \"channel\" text COLLATE \"C\" NOT NULL,\n  \"account_id\" text COLLATE \"C\" NOT NULL,\n  \"plugin_id\" text COLLATE \"C\" NOT NULL,\n  \"plugin_name\" text COLLATE \"C\",\n  \"approved_at\" bigint NOT NULL,\n  PRIMARY KEY (\"plugin_root\", \"channel\", \"account_id\")\n);\n\nCREATE TABLE \"plugin_blob_entries\" (\n  \"plugin_id\" text COLLATE \"C\" NOT NULL,\n  \"namespace\" text COLLATE \"C\" NOT NULL,\n  \"entry_key\" text COLLATE \"C\" NOT NULL,\n  \"metadata_json\" text COLLATE \"C\" NOT NULL,\n  \"blob\" bytea NOT NULL,\n  \"created_at\" bigint NOT NULL,\n  \"expires_at\" bigint,\n  PRIMARY KEY (\"plugin_id\", \"namespace\", \"entry_key\")\n);\n\nCREATE TABLE \"plugin_state_entries\" (\n  \"plugin_id\" text COLLATE \"C\" NOT NULL,\n  \"namespace\" text COLLATE \"C\" NOT NULL,\n  \"entry_key\" text COLLATE \"C\" NOT NULL,\n  \"value_json\" text COLLATE \"C\" NOT NULL,\n  \"created_at\" bigint NOT NULL,\n  \"expires_at\" bigint,\n  PRIMARY KEY (\"plugin_id\", \"namespace\", \"entry_key\")\n);\n\nCREATE TABLE \"sandbox_registry_entries\" (\n  \"registry_kind\" text COLLATE \"C\" NOT NULL,\n  \"container_name\" text COLLATE \"C\" NOT NULL,\n  \"session_key\" text COLLATE \"C\",\n  \"backend_id\" text COLLATE \"C\",\n  \"runtime_label\" text COLLATE \"C\",\n  \"image\" text COLLATE \"C\",\n  \"created_at_ms\" bigint,\n  \"last_used_at_ms\" bigint,\n  \"config_label_kind\" text COLLATE \"C\",\n  \"config_hash\" text COLLATE \"C\",\n  \"cdp_port\" bigint,\n  \"no_vnc_port\" bigint,\n  \"entry_json\" text COLLATE \"C\" NOT NULL,\n  \"updated_at\" bigint NOT NULL,\n  PRIMARY KEY (\"registry_kind\", \"container_name\")\n);\n\nCREATE TABLE \"schema_meta\" (\n  \"meta_key\" text COLLATE \"C\" NOT NULL,\n  \"role\" text COLLATE \"C\" NOT NULL,\n  \"schema_version\" bigint NOT NULL,\n  \"agent_id\" text COLLATE \"C\",\n  \"app_version\" text COLLATE \"C\",\n  \"created_at\" bigint NOT NULL,\n  \"updated_at\" bigint NOT NULL,\n  PRIMARY KEY (\"meta_key\")\n);\n\nCREATE TABLE \"session_groups\" (\n  \"name\" text COLLATE \"C\" NOT NULL,\n  \"position\" bigint NOT NULL,\n  \"created_at\" bigint NOT NULL,\n  \"cwd\" text COLLATE \"C\",\n  \"worktree\" bigint,\n  PRIMARY KEY (\"name\")\n);\n\nCREATE TABLE \"session_state_events\" (\n  \"sequence\" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,\n  \"dedupe_key\" text COLLATE \"C\",\n  \"session_key\" text COLLATE \"C\" NOT NULL,\n  \"session_id\" text COLLATE \"C\",\n  \"agent_id\" text COLLATE \"C\" NOT NULL,\n  \"kind\" text COLLATE \"C\" NOT NULL,\n  \"actor_type\" text COLLATE \"C\" NOT NULL,\n  \"actor_id\" text COLLATE \"C\",\n  \"run_id\" text COLLATE \"C\",\n  \"occurred_at\" bigint NOT NULL,\n  \"summary\" text COLLATE \"C\" NOT NULL,\n  \"payload_json\" text COLLATE \"C\",\n  PRIMARY KEY (\"sequence\"),\n  UNIQUE (\"dedupe_key\")\n);\n\nCREATE TABLE \"session_state_heads\" (\n  \"session_key\" text COLLATE \"C\" NOT NULL,\n  \"agent_id\" text COLLATE \"C\" NOT NULL,\n  \"last_sequence\" bigint NOT NULL,\n  \"pruned_max_sequence\" bigint NOT NULL DEFAULT 0,\n  \"updated_at\" bigint NOT NULL,\n  PRIMARY KEY (\"session_key\", \"agent_id\")\n);\n\nCREATE TABLE \"session_upstream_links\" (\n  \"session_key\" text COLLATE \"C\" NOT NULL,\n  \"agent_id\" text COLLATE \"C\" NOT NULL,\n  \"catalog_id\" text COLLATE \"C\" NOT NULL,\n  \"host_id\" text COLLATE \"C\" NOT NULL,\n  \"thread_id\" text COLLATE \"C\" NOT NULL,\n  \"upstream_kind\" text COLLATE \"C\" NOT NULL,\n  \"upstream_ref_json\" text COLLATE \"C\",\n  \"last_marker_json\" text COLLATE \"C\",\n  \"last_scanned_at\" bigint,\n  \"created_at\" bigint NOT NULL,\n  \"updated_at\" bigint NOT NULL,\n  PRIMARY KEY (\"session_key\", \"agent_id\")\n);\n\nCREATE TABLE \"session_watch_cursors\" (\n  \"watcher_session_key\" text COLLATE \"C\" NOT NULL,\n  \"watcher_store_path\" text COLLATE \"C\",\n  \"target_session_key\" text COLLATE \"C\" NOT NULL,\n  \"last_seen_sequence\" bigint NOT NULL DEFAULT 0,\n  \"notified_sequence\" bigint NOT NULL DEFAULT 0,\n  \"material_sequence\" bigint NOT NULL DEFAULT 0,\n  \"provenance\" text COLLATE \"C\" NOT NULL DEFAULT 'explicit',\n  \"updated_at\" bigint NOT NULL,\n  PRIMARY KEY (\"watcher_session_key\", \"target_session_key\"),\n  CHECK ((\"provenance\" IN ('explicit', 'ambient-group')))\n);\n\nCREATE TABLE \"skill_upload_chunks\" (\n  \"upload_id\" text COLLATE \"C\" NOT NULL,\n  \"byte_offset\" bigint NOT NULL,\n  \"size_bytes\" bigint NOT NULL,\n  \"chunk_blob\" bytea NOT NULL,\n  PRIMARY KEY (\"upload_id\", \"byte_offset\"),\n  CHECK ((\"byte_offset\" >= 0)),\n  CHECK ((\"size_bytes\" > 0)),\n  CHECK ((octet_length(\"chunk_blob\") = \"size_bytes\"))\n);\n\nCREATE TABLE \"skill_uploads\" (\n  \"upload_id\" text COLLATE \"C\" NOT NULL,\n  \"kind\" text COLLATE \"C\" NOT NULL,\n  \"slug\" text COLLATE \"C\" NOT NULL,\n  \"force\" bigint NOT NULL,\n  \"size_bytes\" bigint NOT NULL,\n  \"sha256\" text COLLATE \"C\",\n  \"actual_sha256\" text COLLATE \"C\",\n  \"received_bytes\" bigint NOT NULL,\n  \"archive_blob\" bytea NOT NULL,\n  \"created_at\" bigint NOT NULL,\n  \"expires_at\" bigint NOT NULL,\n  \"committed\" bigint NOT NULL,\n  \"committed_at\" bigint,\n  \"idempotency_key_hash\" text COLLATE \"C\",\n  PRIMARY KEY (\"upload_id\"),\n  UNIQUE (\"idempotency_key_hash\")\n);\n\nCREATE TABLE \"skill_usage\" (\n  \"skill_file\" text COLLATE \"C\" NOT NULL,\n  \"skill_key\" text COLLATE \"C\" NOT NULL,\n  \"skill_name\" text COLLATE \"C\" NOT NULL,\n  \"skill_source\" text COLLATE \"C\" NOT NULL,\n  \"first_used_at_ms\" bigint NOT NULL,\n  \"last_used_at_ms\" bigint NOT NULL,\n  \"use_count\" bigint NOT NULL,\n  \"last_agent_id\" text COLLATE \"C\",\n  PRIMARY KEY (\"skill_file\")\n);\n\nCREATE TABLE \"state_leases\" (\n  \"scope\" text COLLATE \"C\" NOT NULL,\n  \"lease_key\" text COLLATE \"C\" NOT NULL,\n  \"owner\" text COLLATE \"C\" NOT NULL,\n  \"expires_at\" bigint,\n  \"heartbeat_at\" bigint,\n  \"payload_json\" text COLLATE \"C\",\n  \"created_at\" bigint NOT NULL,\n  \"updated_at\" bigint NOT NULL,\n  PRIMARY KEY (\"scope\", \"lease_key\")\n);\n\nCREATE TABLE \"subagent_runs\" (\n  \"run_id\" text COLLATE \"C\" NOT NULL,\n  \"child_session_key\" text COLLATE \"C\" NOT NULL,\n  \"controller_session_key\" text COLLATE \"C\",\n  \"controller_store_path\" text COLLATE \"C\",\n  \"requester_session_key\" text COLLATE \"C\" NOT NULL,\n  \"requester_store_path\" text COLLATE \"C\",\n  \"created_at\" bigint NOT NULL,\n  \"payload_json\" text COLLATE \"C\" NOT NULL DEFAULT '{}',\n  PRIMARY KEY (\"run_id\")\n);\n\nCREATE TABLE \"task_delivery_state\" (\n  \"task_id\" text COLLATE \"C\" NOT NULL,\n  \"requester_origin_json\" text COLLATE \"C\",\n  \"last_notified_event_at\" bigint,\n  PRIMARY KEY (\"task_id\")\n);\n\nCREATE TABLE \"task_runs\" (\n  \"task_id\" text COLLATE \"C\" NOT NULL,\n  \"runtime\" text COLLATE \"C\" NOT NULL,\n  \"task_kind\" text COLLATE \"C\",\n  \"source_id\" text COLLATE \"C\",\n  \"requester_session_key\" text COLLATE \"C\",\n  \"owner_key\" text COLLATE \"C\" NOT NULL,\n  \"scope_kind\" text COLLATE \"C\" NOT NULL,\n  \"child_session_key\" text COLLATE \"C\",\n  \"parent_flow_id\" text COLLATE \"C\",\n  \"parent_task_id\" text COLLATE \"C\",\n  \"agent_id\" text COLLATE \"C\",\n  \"requester_agent_id\" text COLLATE \"C\",\n  \"run_id\" text COLLATE \"C\",\n  \"execution_owner_host\" text COLLATE \"C\",\n  \"execution_owner_pid\" bigint,\n  \"execution_owner_start_identity\" bigint,\n  \"label\" text COLLATE \"C\",\n  \"task\" text COLLATE \"C\" NOT NULL,\n  \"status\" text COLLATE \"C\" NOT NULL,\n  \"delivery_status\" text COLLATE \"C\" NOT NULL,\n  \"notify_policy\" text COLLATE \"C\" NOT NULL,\n  \"created_at\" bigint NOT NULL,\n  \"started_at\" bigint,\n  \"ended_at\" bigint,\n  \"last_event_at\" bigint,\n  \"cleanup_after\" bigint,\n  \"tool_use_count\" bigint,\n  \"last_tool_name\" text COLLATE \"C\",\n  \"error\" text COLLATE \"C\",\n  \"progress_summary\" text COLLATE \"C\",\n  \"terminal_summary\" text COLLATE \"C\",\n  \"terminal_outcome\" text COLLATE \"C\",\n  \"detail_json\" text COLLATE \"C\",\n  PRIMARY KEY (\"task_id\")\n);\n\nCREATE TABLE \"web_push_subscriptions\" (\n  \"endpoint_hash\" text COLLATE \"C\" NOT NULL,\n  \"subscription_id\" text COLLATE \"C\" NOT NULL,\n  \"endpoint\" text COLLATE \"C\" NOT NULL,\n  \"p256dh\" text COLLATE \"C\" NOT NULL,\n  \"auth\" text COLLATE \"C\" NOT NULL,\n  \"device_id\" text COLLATE \"C\",\n  \"user_profile_id\" text COLLATE \"C\",\n  \"preferences_json\" text COLLATE \"C\",\n  \"created_at_ms\" bigint NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"endpoint_hash\"),\n  UNIQUE (\"subscription_id\")\n);\n\nCREATE TABLE \"worker_environment_credentials\" (\n  \"environment_id\" text COLLATE \"C\" NOT NULL,\n  \"credential_hash\" text COLLATE \"C\" NOT NULL,\n  \"bundle_hash\" text COLLATE \"C\" NOT NULL,\n  \"session_id\" text COLLATE \"C\",\n  \"rpc_set_version\" bigint NOT NULL,\n  \"owner_epoch\" bigint NOT NULL,\n  \"expires_at_ms\" bigint NOT NULL,\n  \"delivered_at_ms\" bigint,\n  PRIMARY KEY (\"environment_id\"),\n  CHECK ((\"rpc_set_version\" >= 1)),\n  CHECK ((\"owner_epoch\" >= 0)),\n  CHECK ((\"expires_at_ms\" >= 0)),\n  CHECK ((\"delivered_at_ms\" >= 0)),\n  UNIQUE (\"credential_hash\")\n);\n\nCREATE TABLE \"worker_environments\" (\n  \"environment_id\" text COLLATE \"C\" NOT NULL,\n  \"provider_id\" text COLLATE \"C\" NOT NULL,\n  \"profile_id\" text COLLATE \"C\" NOT NULL,\n  \"profile_snapshot_json\" text COLLATE \"C\" NOT NULL,\n  \"last_activated_at_ms\" bigint,\n  \"preparation_key\" text COLLATE \"C\",\n  \"preparation_purpose\" text COLLATE \"C\",\n  \"preparation_demand_at_ms\" bigint,\n  \"preparation_expires_at_ms\" bigint,\n  \"preparation_consumed_at_ms\" bigint,\n  \"provision_operation_id\" text COLLATE \"C\" NOT NULL,\n  \"lease_id\" text COLLATE \"C\",\n  \"node_setup_id\" text COLLATE \"C\",\n  \"node_device_id\" text COLLATE \"C\",\n  \"ssh_host\" text COLLATE \"C\",\n  \"ssh_port\" bigint,\n  \"ssh_user\" text COLLATE \"C\",\n  \"ssh_host_key\" text COLLATE \"C\",\n  \"ssh_key_ref_json\" text COLLATE \"C\",\n  \"desktop_json\" text COLLATE \"C\",\n  \"state\" text COLLATE \"C\" NOT NULL,\n  \"bootstrap_bundle_hash\" text COLLATE \"C\",\n  \"bootstrap_openclaw_version\" text COLLATE \"C\",\n  \"bootstrap_protocol_features_json\" text COLLATE \"C\",\n  \"bootstrap_install_kind\" text COLLATE \"C\",\n  \"owner_epoch\" bigint NOT NULL DEFAULT 0,\n  \"teardown_terminal_state\" text COLLATE \"C\",\n  \"attached_session_ids_json\" text COLLATE \"C\" NOT NULL DEFAULT '[]',\n  \"created_at_ms\" bigint NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  \"state_changed_at_ms\" bigint NOT NULL,\n  \"idle_since_at_ms\" bigint,\n  \"destroy_requested_at_ms\" bigint,\n  \"last_error\" text COLLATE \"C\",\n  \"shared_host\" bigint,\n  PRIMARY KEY (\"environment_id\"),\n  CHECK ((\"preparation_key\" IS NULL AND \"preparation_demand_at_ms\" IS NULL AND \"preparation_expires_at_ms\" IS NULL AND \"preparation_consumed_at_ms\" IS NULL) OR (\"preparation_key\" IS NOT NULL AND (char_length(\"preparation_key\") = 64) AND (\"preparation_key\" COLLATE \"C\" !~ '\\A.*[^0-9a-f].*\\Z') AND \"preparation_demand_at_ms\" IS NOT NULL AND (\"preparation_demand_at_ms\" BETWEEN 0 AND 9007199254740991) AND \"preparation_expires_at_ms\" IS NOT NULL AND (\"preparation_expires_at_ms\" > \"preparation_demand_at_ms\") AND (\"preparation_expires_at_ms\" <= 9007199254740991) AND (\"preparation_consumed_at_ms\" IS NULL OR ((\"preparation_consumed_at_ms\" >= \"preparation_demand_at_ms\") AND (\"preparation_consumed_at_ms\" < \"preparation_expires_at_ms\"))))),\n  CHECK (\"ssh_port\" IS NULL OR ((\"ssh_port\" >= 1) AND (\"ssh_port\" <= 65535))),\n  CHECK ((\"state\" IN ('requested', 'provisioning', 'bootstrapping', 'ready', 'attached', 'idle', 'draining', 'destroying', 'destroyed', 'failed', 'orphaned'))),\n  CHECK ((\"owner_epoch\" >= 0)),\n  CHECK ((\"teardown_terminal_state\" IN ('destroyed', 'failed'))),\n  UNIQUE (\"provision_operation_id\")\n);\n\nCREATE TABLE \"worker_inference_turns\" (\n  \"session_id\" text COLLATE \"C\" NOT NULL,\n  \"run_epoch\" bigint NOT NULL,\n  \"run_id\" text COLLATE \"C\" NOT NULL,\n  \"turn_id\" text COLLATE \"C\" NOT NULL,\n  \"environment_id\" text COLLATE \"C\" NOT NULL,\n  \"request_hash\" text COLLATE \"C\" NOT NULL,\n  \"state\" text COLLATE \"C\" NOT NULL,\n  \"terminal_json\" text COLLATE \"C\",\n  \"created_at_ms\" bigint NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"session_id\", \"run_epoch\", \"run_id\", \"turn_id\"),\n  CHECK ((\"run_epoch\" >= 0)),\n  CHECK ((\"state\" IN ('pending', 'terminal'))),\n  CHECK ((\"created_at_ms\" >= 0)),\n  CHECK ((\"updated_at_ms\" >= 0)),\n  CHECK (((\"state\" = 'pending') AND \"terminal_json\" IS NULL) OR ((\"state\" = 'terminal') AND \"terminal_json\" IS NOT NULL))\n);\n\nCREATE TABLE \"worker_session_placements\" (\n  \"session_id\" text COLLATE \"C\" NOT NULL,\n  \"agent_id\" text COLLATE \"C\" NOT NULL,\n  \"session_key\" text COLLATE \"C\" NOT NULL,\n  \"execution_mode\" text COLLATE \"C\",\n  \"state\" text COLLATE \"C\" NOT NULL,\n  \"environment_id\" text COLLATE \"C\",\n  \"transition_generation\" bigint NOT NULL DEFAULT 0,\n  \"active_owner_epoch\" bigint,\n  \"workspace_base_manifest_ref\" text COLLATE \"C\",\n  \"remote_workspace_dir\" text COLLATE \"C\",\n  \"worker_bundle_hash\" text COLLATE \"C\",\n  \"last_transcript_ack_cursor\" bigint,\n  \"last_live_event_ack_cursor\" bigint,\n  \"recovery_error\" text COLLATE \"C\",\n  \"turn_claim_owner\" text COLLATE \"C\",\n  \"turn_claim_id\" text COLLATE \"C\",\n  \"turn_claim_run_id\" text COLLATE \"C\",\n  \"turn_claim_generation\" bigint,\n  \"turn_claim_owner_epoch\" bigint,\n  \"created_at_ms\" bigint NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  \"state_changed_at_ms\" bigint NOT NULL,\n  \"terminal_reason\" text COLLATE \"C\",\n  \"terminal_at_ms\" bigint,\n  PRIMARY KEY (\"session_id\"),\n  CHECK ((\"execution_mode\" IN ('worker-turn', 'remote-exec'))),\n  CHECK ((\"state\" IN ('local', 'requested', 'provisioning', 'syncing', 'starting', 'active', 'draining', 'reconciling', 'reclaimed', 'failed'))),\n  CHECK ((\"transition_generation\" >= 0)),\n  CHECK (\"active_owner_epoch\" IS NULL OR (\"active_owner_epoch\" >= 1)),\n  CHECK (\"last_transcript_ack_cursor\" IS NULL OR (\"last_transcript_ack_cursor\" >= 0)),\n  CHECK (\"last_live_event_ack_cursor\" IS NULL OR (\"last_live_event_ack_cursor\" >= 0)),\n  CHECK ((\"turn_claim_owner\" IN ('local', 'worker'))),\n  CHECK (\"turn_claim_generation\" IS NULL OR (\"turn_claim_generation\" >= 0)),\n  CHECK (\"turn_claim_owner_epoch\" IS NULL OR (\"turn_claim_owner_epoch\" >= 1)),\n  CHECK (((\"state\" IN ('local', 'requested')) AND \"environment_id\" IS NULL AND \"active_owner_epoch\" IS NULL AND \"workspace_base_manifest_ref\" IS NULL AND \"remote_workspace_dir\" IS NULL AND \"worker_bundle_hash\" IS NULL AND \"last_transcript_ack_cursor\" IS NULL AND \"last_live_event_ack_cursor\" IS NULL AND \"recovery_error\" IS NULL) OR (\"state\" IS NOT DISTINCT FROM 'provisioning' AND \"active_owner_epoch\" IS NULL AND \"workspace_base_manifest_ref\" IS NULL AND \"remote_workspace_dir\" IS NULL AND \"worker_bundle_hash\" IS NULL AND \"last_transcript_ack_cursor\" IS NULL AND \"last_live_event_ack_cursor\" IS NULL AND \"recovery_error\" IS NULL) OR (\"state\" IS NOT DISTINCT FROM 'syncing' AND \"environment_id\" IS NOT NULL AND \"active_owner_epoch\" IS NULL AND \"workspace_base_manifest_ref\" IS NULL AND \"remote_workspace_dir\" IS NULL AND \"worker_bundle_hash\" IS NOT NULL AND \"last_transcript_ack_cursor\" IS NULL AND \"last_live_event_ack_cursor\" IS NULL AND \"recovery_error\" IS NULL) OR (\"state\" IS NOT DISTINCT FROM 'starting' AND \"environment_id\" IS NOT NULL AND \"active_owner_epoch\" IS NULL AND \"workspace_base_manifest_ref\" IS NOT NULL AND \"remote_workspace_dir\" IS NOT NULL AND \"worker_bundle_hash\" IS NOT NULL AND \"last_transcript_ack_cursor\" IS NULL AND \"last_live_event_ack_cursor\" IS NULL AND \"recovery_error\" IS NULL) OR ((\"state\" IN ('active', 'draining', 'reconciling')) AND \"environment_id\" IS NOT NULL AND \"active_owner_epoch\" IS NOT NULL AND \"workspace_base_manifest_ref\" IS NOT NULL AND \"remote_workspace_dir\" IS NOT NULL AND \"worker_bundle_hash\" IS NOT NULL AND \"recovery_error\" IS NULL) OR (\"state\" IS NOT DISTINCT FROM 'reclaimed' AND \"environment_id\" IS NOT NULL AND \"active_owner_epoch\" IS NOT NULL AND \"workspace_base_manifest_ref\" IS NOT NULL AND \"remote_workspace_dir\" IS NOT NULL AND \"worker_bundle_hash\" IS NOT NULL AND \"recovery_error\" IS NULL AND \"turn_claim_owner\" IS NULL AND \"turn_claim_id\" IS NULL AND \"turn_claim_run_id\" IS NULL AND \"turn_claim_generation\" IS NULL AND \"turn_claim_owner_epoch\" IS NULL) OR (\"state\" IS NOT DISTINCT FROM 'failed' AND \"recovery_error\" IS NOT NULL)),\n  CHECK ((\"turn_claim_owner\" IS NULL AND \"turn_claim_id\" IS NULL AND \"turn_claim_run_id\" IS NULL AND \"turn_claim_generation\" IS NULL AND \"turn_claim_owner_epoch\" IS NULL) OR (\"turn_claim_owner\" IS NOT DISTINCT FROM 'local' AND \"turn_claim_id\" IS NOT NULL AND \"turn_claim_run_id\" IS NOT NULL AND \"turn_claim_generation\" IS NOT NULL AND \"turn_claim_owner_epoch\" IS NULL) OR (\"turn_claim_owner\" IS NOT DISTINCT FROM 'worker' AND \"turn_claim_id\" IS NOT NULL AND \"turn_claim_run_id\" IS NOT NULL AND \"turn_claim_generation\" IS NOT NULL AND \"turn_claim_owner_epoch\" IS NOT NULL)),\n  CHECK (\"turn_claim_owner\" IS NULL OR (\"turn_claim_owner\" IS NOT DISTINCT FROM 'local' AND ((\"state\" IN ('local', 'requested', 'failed')) OR ((\"state\" IN ('active', 'draining')) AND \"execution_mode\" IS NOT DISTINCT FROM 'remote-exec'))) OR (\"turn_claim_owner\" IS NOT DISTINCT FROM 'worker' AND (\"state\" IN ('active', 'draining')) AND (\"execution_mode\" IS NULL OR \"execution_mode\" IS NOT DISTINCT FROM 'worker-turn') AND \"turn_claim_owner_epoch\" IS NOT DISTINCT FROM \"active_owner_epoch\"))\n);\n\nCREATE TABLE \"worker_session_tool_operations\" (\n  \"source_session_id\" text COLLATE \"C\" NOT NULL,\n  \"source_claim_id\" text COLLATE \"C\" NOT NULL,\n  \"tool_call_id\" text COLLATE \"C\" NOT NULL,\n  \"tool_name\" text COLLATE \"C\" NOT NULL,\n  \"request_digest\" text COLLATE \"C\" NOT NULL,\n  \"operation_seed\" text COLLATE \"C\" NOT NULL,\n  \"status\" text COLLATE \"C\" NOT NULL,\n  \"child_session_key\" text COLLATE \"C\",\n  \"result_json\" text COLLATE \"C\",\n  \"gateway_instance_id\" text COLLATE \"C\" NOT NULL,\n  \"created_at_ms\" bigint NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"source_session_id\", \"source_claim_id\", \"tool_call_id\"),\n  CHECK ((\"tool_name\" IN ('sessions_spawn', 'sessions_send'))),\n  CHECK ((\"status\" IN ('running', 'succeeded', 'failed', 'unknown')))\n);\n\nCREATE TABLE \"worker_transcript_commit_heads\" (\n  \"session_id\" text COLLATE \"C\" NOT NULL,\n  \"run_epoch\" bigint NOT NULL,\n  \"environment_id\" text COLLATE \"C\" NOT NULL,\n  \"next_seq\" bigint NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"session_id\", \"run_epoch\"),\n  CHECK ((\"run_epoch\" >= 0)),\n  CHECK ((\"next_seq\" >= 1)),\n  CHECK ((\"updated_at_ms\" >= 0))\n);\n\nCREATE TABLE \"worker_transcript_commits\" (\n  \"session_id\" text COLLATE \"C\" NOT NULL,\n  \"run_epoch\" bigint NOT NULL,\n  \"seq\" bigint NOT NULL,\n  \"request_hash\" text COLLATE \"C\" NOT NULL,\n  \"state\" text COLLATE \"C\" NOT NULL,\n  \"result_json\" text COLLATE \"C\",\n  \"created_at_ms\" bigint NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"session_id\", \"run_epoch\", \"seq\"),\n  CHECK ((\"run_epoch\" >= 0)),\n  CHECK ((\"seq\" >= 1)),\n  CHECK ((\"state\" IN ('pending', 'terminal'))),\n  CHECK ((\"created_at_ms\" >= 0)),\n  CHECK ((\"updated_at_ms\" >= 0)),\n  CHECK (((\"state\" = 'pending') AND \"result_json\" IS NULL) OR ((\"state\" = 'terminal') AND \"result_json\" IS NOT NULL))\n);\n\nCREATE TABLE \"worker_turn_tool_authorities\" (\n  \"session_id\" text COLLATE \"C\" NOT NULL,\n  \"environment_id\" text COLLATE \"C\" NOT NULL,\n  \"owner_epoch\" bigint NOT NULL,\n  \"placement_generation\" bigint NOT NULL,\n  \"claim_id\" text COLLATE \"C\" NOT NULL,\n  \"run_id\" text COLLATE \"C\" NOT NULL,\n  \"tool_names_json\" text COLLATE \"C\" NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"session_id\"),\n  CHECK ((\"owner_epoch\" >= 1)),\n  CHECK ((\"placement_generation\" >= 0))\n);\n\nCREATE TABLE \"worker_workspace_pending_results\" (\n  \"session_id\" text COLLATE \"C\" NOT NULL,\n  \"environment_id\" text COLLATE \"C\" NOT NULL,\n  \"owner_epoch\" bigint NOT NULL,\n  \"placement_generation\" bigint NOT NULL,\n  \"claim_id\" text COLLATE \"C\" NOT NULL,\n  \"run_id\" text COLLATE \"C\" NOT NULL,\n  \"gateway_instance_id\" text COLLATE \"C\" NOT NULL,\n  \"recovery_requested_at_ms\" bigint,\n  \"workspace_accepted_at_ms\" bigint,\n  \"staged_result_ref\" text COLLATE \"C\",\n  \"repository_workspace_id\" text COLLATE \"C\",\n  \"created_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"session_id\"),\n  CHECK ((\"owner_epoch\" >= 1)),\n  CHECK ((\"placement_generation\" >= 0))\n);\n\nCREATE TABLE \"worker_workspace_reconciliations\" (\n  \"session_id\" text COLLATE \"C\" NOT NULL,\n  \"environment_id\" text COLLATE \"C\" NOT NULL,\n  \"owner_epoch\" bigint NOT NULL,\n  \"placement_generation\" bigint NOT NULL,\n  \"base_manifest_ref\" text COLLATE \"C\" NOT NULL,\n  \"current_manifest_ref\" text COLLATE \"C\" NOT NULL,\n  \"plan_json\" text COLLATE \"C\" NOT NULL,\n  \"base_pack\" bytea NOT NULL,\n  \"created_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"session_id\"),\n  CHECK ((\"owner_epoch\" >= 1)),\n  CHECK ((\"placement_generation\" >= 0)),\n  CHECK ((octet_length(\"base_pack\") <= 268435456))\n);\n\nCREATE TABLE \"workspace_generated_bootstrap_hashes\" (\n  \"workspace_key\" text COLLATE \"C\" NOT NULL,\n  \"filename\" text COLLATE \"C\" NOT NULL,\n  \"sha256\" text COLLATE \"C\" NOT NULL,\n  PRIMARY KEY (\"workspace_key\", \"filename\")\n);\n\nCREATE TABLE \"workspace_path_aliases\" (\n  \"alias_key\" text COLLATE \"C\" NOT NULL,\n  \"alias_path\" text COLLATE \"C\" NOT NULL,\n  \"workspace_key\" text COLLATE \"C\" NOT NULL,\n  \"workspace_path\" text COLLATE \"C\" NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"alias_key\")\n);\n\nCREATE TABLE \"workspace_setup_state\" (\n  \"workspace_key\" text COLLATE \"C\" NOT NULL,\n  \"workspace_path\" text COLLATE \"C\",\n  \"version\" bigint,\n  \"bootstrap_seeded_at\" text COLLATE \"C\",\n  \"setup_completed_at\" text COLLATE \"C\",\n  \"updated_at\" bigint,\n  \"attested_at_ms\" bigint,\n  \"attestation_updated_at_ms\" bigint,\n  PRIMARY KEY (\"workspace_key\"),\n  CHECK (\"version\" IS NULL OR \"workspace_path\" IS NOT NULL)\n);\n\nCREATE TABLE \"worktree_provisioned_file_chunks\" (\n  \"worktree_id\" text COLLATE \"C\" NOT NULL,\n  \"path\" text COLLATE \"C\" NOT NULL,\n  \"chunk_index\" bigint NOT NULL,\n  \"data\" bytea NOT NULL,\n  PRIMARY KEY (\"worktree_id\", \"path\", \"chunk_index\"),\n  CHECK ((\"chunk_index\" >= 0))\n);\n\nCREATE TABLE \"worktrees\" (\n  \"id\" text COLLATE \"C\" NOT NULL,\n  \"repo_fingerprint\" text COLLATE \"C\" NOT NULL,\n  \"repo_root\" text COLLATE \"C\" NOT NULL,\n  \"path\" text COLLATE \"C\" NOT NULL,\n  \"branch\" text COLLATE \"C\" NOT NULL,\n  \"base_ref\" text COLLATE \"C\" NOT NULL,\n  \"owner_kind\" text COLLATE \"C\" NOT NULL,\n  \"owner_id\" text COLLATE \"C\",\n  \"snapshot_ref\" text COLLATE \"C\",\n  \"provisioned_paths_json\" text COLLATE \"C\",\n  \"created_at\" bigint NOT NULL,\n  \"last_active_at\" bigint NOT NULL,\n  \"removed_at\" bigint,\n  \"run_end_cleanup_json\" text COLLATE \"C\",\n  \"gc_protection_json\" text COLLATE \"C\",\n  PRIMARY KEY (\"id\"),\n  CHECK ((\"owner_kind\" IN ('manual', 'workboard', 'session')))\n);\n\nCREATE INDEX \"idx_acp_replay_events_session_seq\" ON \"acp_replay_events\" ((\"session_id\") ASC NULLS FIRST, (\"seq\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_acp_replay_sessions_key_updated\" ON \"acp_replay_sessions\" ((\"session_key\") ASC NULLS FIRST, (\"complete\") ASC NULLS FIRST, (\"updated_at\") DESC NULLS LAST, (\"session_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_acp_replay_sessions_updated\" ON \"acp_replay_sessions\" ((\"updated_at\") DESC NULLS LAST, (\"session_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_acp_sessions_agent_activity\" ON \"acp_sessions\" ((\"agent\") ASC NULLS FIRST, (\"last_activity_at\") DESC NULLS LAST, (\"session_key\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_acp_sessions_resume_acpx\" ON \"acp_sessions\" ((\"resume_acpx_session_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_acp_sessions_resume_agent\" ON \"acp_sessions\" ((\"resume_agent_session_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_acp_sessions_state_activity\" ON \"acp_sessions\" ((\"state\") ASC NULLS FIRST, (\"last_activity_at\") DESC NULLS LAST, (\"session_key\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_apns_registrations_updated\" ON \"apns_registrations\" ((\"updated_at_ms\") DESC NULLS LAST, (\"node_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_audit_events_agent_sequence\" ON \"audit_events\" ((\"agent_id\") ASC NULLS FIRST, (\"sequence\") DESC NULLS LAST);\n\nCREATE INDEX \"idx_audit_events_channel_sequence\" ON \"audit_events\" ((\"channel\") ASC NULLS FIRST, (\"sequence\") DESC NULLS LAST);\n\nCREATE INDEX \"idx_audit_events_direction_sequence\" ON \"audit_events\" ((\"direction\") ASC NULLS FIRST, (\"sequence\") DESC NULLS LAST);\n\nCREATE INDEX \"idx_audit_events_kind_sequence\" ON \"audit_events\" ((\"kind\") ASC NULLS FIRST, (\"sequence\") DESC NULLS LAST);\n\nCREATE INDEX \"idx_audit_events_run_sequence\" ON \"audit_events\" ((\"run_id\") ASC NULLS FIRST, (\"sequence\") DESC NULLS LAST);\n\nCREATE INDEX \"idx_audit_events_session_sequence\" ON \"audit_events\" ((\"session_key\") ASC NULLS FIRST, (\"sequence\") DESC NULLS LAST);\n\nCREATE INDEX \"idx_audit_events_status_sequence\" ON \"audit_events\" ((\"status\") ASC NULLS FIRST, (\"sequence\") DESC NULLS LAST);\n\nCREATE INDEX \"idx_audit_events_time\" ON \"audit_events\" ((\"occurred_at\") DESC NULLS LAST, (\"sequence\") DESC NULLS LAST);\n\nCREATE INDEX \"idx_backup_runs_created\" ON \"backup_runs\" ((\"created_at\") DESC NULLS LAST, (\"id\") ASC NULLS FIRST);\n\nCREATE INDEX \"capture_events_flow_idx\" ON \"capture_events\" ((\"flow_id\") ASC NULLS FIRST, (\"ts\") ASC NULLS FIRST);\n\nCREATE INDEX \"capture_events_session_ts_idx\" ON \"capture_events\" ((\"session_id\") ASC NULLS FIRST, (\"ts\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_channel_ingress_claims\" ON \"channel_ingress_events\" ((\"queue_name\") ASC NULLS FIRST, (\"status\") ASC NULLS FIRST, (\"claimed_at\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_channel_ingress_lane\" ON \"channel_ingress_events\" ((\"queue_name\") ASC NULLS FIRST, (\"status\") ASC NULLS FIRST, (\"lane_key\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_channel_ingress_pending\" ON \"channel_ingress_events\" ((\"queue_name\") ASC NULLS FIRST, (\"status\") ASC NULLS FIRST, (\"received_at\") ASC NULLS FIRST, (\"event_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_channel_pairing_allow_account\" ON \"channel_pairing_allow_entries\" ((\"channel_key\") ASC NULLS FIRST, (\"account_id\") ASC NULLS FIRST, (\"sort_order\") ASC NULLS FIRST, (\"entry\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_channel_pairing_requests_code\" ON \"channel_pairing_requests\" ((\"channel_key\") ASC NULLS FIRST, (\"code\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_channel_pairing_requests_created\" ON \"channel_pairing_requests\" ((\"channel_key\") ASC NULLS FIRST, (\"created_at\") ASC NULLS FIRST, (\"request_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_cron_job_scratch_store_updated\" ON \"cron_job_scratch\" ((\"store_key\") ASC NULLS FIRST, (\"updated_at_ms\") DESC NULLS LAST, (\"job_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_cron_jobs_store_order\" ON \"cron_jobs\" ((\"store_key\") ASC NULLS FIRST, (\"sort_order\") ASC NULLS FIRST, (\"updated_at\") ASC NULLS FIRST, (\"job_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_current_conversation_bindings_conversation\" ON \"current_conversation_bindings\" ((\"channel\") ASC NULLS FIRST, (\"account_id\") ASC NULLS FIRST, (\"conversation_kind\") ASC NULLS FIRST, (\"conversation_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_current_conversation_bindings_expires\" ON \"current_conversation_bindings\" ((\"expires_at\") ASC NULLS FIRST, (\"binding_key\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_current_conversation_bindings_target\" ON \"current_conversation_bindings\" ((\"target_session_key\") ASC NULLS FIRST, (\"updated_at\") DESC NULLS LAST, (\"binding_key\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_delivery_queue_bounded_retention\" ON \"delivery_queue_entries\" ((\"queue_name\") ASC NULLS FIRST, (\"retention_id_prefix\") ASC NULLS FIRST, (\"enqueued_at\") DESC NULLS LAST, (\"id\") DESC NULLS LAST) WHERE (\"status\" IN ('completed', 'failed')) AND (\"recovery_state\" = 'completed_bounded') AND \"retention_id_prefix\" IS NOT NULL;\n\nCREATE INDEX \"idx_delivery_queue_failed\" ON \"delivery_queue_entries\" ((\"status\") ASC NULLS FIRST, (\"queue_name\") ASC NULLS FIRST, (\"failed_at\") ASC NULLS FIRST, (\"id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_delivery_queue_pending\" ON \"delivery_queue_entries\" ((\"queue_name\") ASC NULLS FIRST, (\"status\") ASC NULLS FIRST, (\"enqueued_at\") ASC NULLS FIRST, (\"id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_delivery_queue_session\" ON \"delivery_queue_entries\" ((\"queue_name\") ASC NULLS FIRST, (\"status\") ASC NULLS FIRST, (\"session_key\") ASC NULLS FIRST, (\"enqueued_at\") ASC NULLS FIRST, (\"id\") ASC NULLS FIRST) WHERE \"session_key\" IS NOT NULL;\n\nCREATE INDEX \"idx_delivery_queue_target\" ON \"delivery_queue_entries\" ((\"queue_name\") ASC NULLS FIRST, (\"status\") ASC NULLS FIRST, (\"channel\") ASC NULLS FIRST, (\"target\") ASC NULLS FIRST, (\"enqueued_at\") ASC NULLS FIRST, (\"id\") ASC NULLS FIRST) WHERE \"channel\" IS NOT NULL AND \"target\" IS NOT NULL;\n\nCREATE INDEX \"idx_device_auth_tokens_updated\" ON \"device_auth_tokens\" ((\"updated_at_ms\") DESC NULLS LAST, (\"device_id\") ASC NULLS FIRST, (\"role\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_device_bootstrap_tokens_ts\" ON \"device_bootstrap_tokens\" ((\"ts\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_device_identities_device\" ON \"device_identities\" ((\"device_id\") ASC NULLS FIRST, (\"updated_at_ms\") DESC NULLS LAST);\n\nCREATE INDEX \"idx_device_pairing_paired_approved\" ON \"device_pairing_paired\" ((\"approved_at_ms\") DESC NULLS LAST, (\"device_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_device_pairing_pending_device\" ON \"device_pairing_pending\" ((\"device_id\") ASC NULLS FIRST, (\"ts\") DESC NULLS LAST);\n\nCREATE INDEX \"idx_diagnostic_events_scope_sequence\" ON \"diagnostic_events\" ((\"scope\") ASC NULLS FIRST, (\"sequence\") ASC NULLS FIRST, (\"event_key\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_flow_runs_owner_key\" ON \"flow_runs\" ((\"owner_key\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_flow_runs_status\" ON \"flow_runs\" ((\"status\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_flow_runs_updated_at\" ON \"flow_runs\" ((\"updated_at\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_gateway_boot_lifecycle_started\" ON \"gateway_boot_lifecycle\" ((\"started_at_ms\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_gateway_restart_handoff_expiry\" ON \"gateway_restart_handoff\" ((\"expires_at\") ASC NULLS FIRST, (\"pid\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_gateway_restart_sentinel_ts\" ON \"gateway_restart_sentinel\" ((\"ts\") DESC NULLS LAST, (\"sentinel_key\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_macos_port_guardian_records_port\" ON \"macos_port_guardian_records\" ((\"port\") ASC NULLS FIRST, (\"timestamp\") DESC NULLS LAST);\n\nCREATE INDEX \"idx_managed_outgoing_images_agent_message\" ON \"managed_outgoing_image_records\" ((\"session_key\") ASC NULLS FIRST, (\"agent_id\") ASC NULLS FIRST, (\"message_id\") ASC NULLS FIRST, (\"attachment_id\") ASC NULLS FIRST) WHERE \"message_id\" IS NOT NULL;\n\nCREATE INDEX \"idx_managed_outgoing_images_agent_session\" ON \"managed_outgoing_image_records\" ((\"session_key\") ASC NULLS FIRST, (\"agent_id\") ASC NULLS FIRST, (\"created_at\") DESC NULLS LAST, (\"attachment_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_managed_outgoing_images_message\" ON \"managed_outgoing_image_records\" ((\"session_key\") ASC NULLS FIRST, (\"message_id\") ASC NULLS FIRST, (\"attachment_id\") ASC NULLS FIRST) WHERE \"message_id\" IS NOT NULL;\n\nCREATE INDEX \"idx_managed_outgoing_images_session\" ON \"managed_outgoing_image_records\" ((\"session_key\") ASC NULLS FIRST, (\"created_at\") DESC NULLS LAST, (\"attachment_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_meeting_transcript_sessions_account\" ON \"meeting_transcript_sessions\" ((\"source_account_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_meeting_transcript_sessions_agent\" ON \"meeting_transcript_sessions\" ((\"metadata_agent_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_meeting_transcript_sessions_export_key\" ON \"meeting_transcript_sessions\" ((\"export_key\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_meeting_transcript_sessions_id\" ON \"meeting_transcript_sessions\" ((\"session_id\") ASC NULLS FIRST, (\"started_at\") DESC NULLS LAST);\n\nCREATE INDEX \"idx_meeting_transcript_sessions_slug\" ON \"meeting_transcript_sessions\" ((\"session_slug\") ASC NULLS FIRST, (\"started_at\") DESC NULLS LAST);\n\nCREATE INDEX \"idx_meeting_transcript_sessions_source\" ON \"meeting_transcript_sessions\" ((\"provider_id\") ASC NULLS FIRST, (\"source_account_id\") ASC NULLS FIRST, (\"source_guild_id\") ASC NULLS FIRST, (\"source_channel_id\") ASC NULLS FIRST, (\"source_meeting_url\") ASC NULLS FIRST, (\"source_thread_ts\") ASC NULLS FIRST, (\"source_file_id\") ASC NULLS FIRST, (\"stopped_at\") DESC NULLS LAST, (\"started_at\") DESC NULLS LAST, (\"session_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_meeting_transcript_sessions_started\" ON \"meeting_transcript_sessions\" ((\"started_at\") DESC NULLS LAST, (\"session_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_meeting_transcript_utterances_id\" ON \"meeting_transcript_utterances\" ((\"session_id\") ASC NULLS FIRST, (\"session_started_at\") ASC NULLS FIRST, (\"utterance_id\") ASC NULLS FIRST) WHERE \"utterance_id\" IS NOT NULL;\n\nCREATE INDEX \"idx_migration_runs_started\" ON \"migration_runs\" ((\"started_at\") DESC NULLS LAST, (\"id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_migration_sources_path\" ON \"migration_sources\" ((\"source_path\") ASC NULLS FIRST, (\"migration_kind\") ASC NULLS FIRST, (\"target_table\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_migration_sources_run\" ON \"migration_sources\" ((\"last_run_id\") ASC NULLS FIRST, (\"source_path\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_native_hook_relay_bridges_expires\" ON \"native_hook_relay_bridges\" ((\"expires_at_ms\") ASC NULLS FIRST, (\"relay_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_official_external_plugin_catalog_snapshots_updated\" ON \"official_external_plugin_catalog_snapshots\" ((\"updated_at_ms\") DESC NULLS LAST, (\"feed_url\") ASC NULLS FIRST);\n\nCREATE UNIQUE INDEX \"idx_operator_approvals_cursor_id\" ON \"operator_approvals\" ((\"cursor_id\") ASC NULLS FIRST);\n\nCREATE UNIQUE INDEX \"idx_operator_approvals_resolution_ref\" ON \"operator_approvals\" ((\"resolution_ref\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_operator_approvals_resolved\" ON \"operator_approvals\" ((\"resolved_at_ms\") ASC NULLS FIRST, (\"approval_id\") ASC NULLS FIRST) WHERE \"resolved_at_ms\" IS NOT NULL;\n\nCREATE INDEX \"idx_operator_approvals_runtime_pending\" ON \"operator_approvals\" ((\"runtime_epoch\") ASC NULLS FIRST, (\"approval_id\") ASC NULLS FIRST) WHERE (\"status\" = 'pending');\n\nCREATE INDEX \"idx_operator_approvals_source_run_resolved\" ON \"operator_approvals\" ((\"source_run_id\") ASC NULLS FIRST, (\"resolved_at_ms\") ASC NULLS FIRST, (\"approval_id\") ASC NULLS FIRST) WHERE \"source_run_id\" IS NOT NULL AND \"resolved_at_ms\" IS NOT NULL;\n\nCREATE INDEX \"idx_operator_approvals_source_session_created\" ON \"operator_approvals\" ((\"source_session_key\") ASC NULLS FIRST, (\"created_at_ms\") DESC NULLS LAST, (\"approval_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_operator_approvals_status_expiry\" ON \"operator_approvals\" ((\"status\") ASC NULLS FIRST, (\"expires_at_ms\") ASC NULLS FIRST, (\"approval_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_plugin_binding_approvals_plugin\" ON \"plugin_binding_approvals\" ((\"plugin_id\") ASC NULLS FIRST, (\"approved_at\") DESC NULLS LAST);\n\nCREATE INDEX \"idx_plugin_blob_expiry\" ON \"plugin_blob_entries\" ((\"expires_at\") ASC NULLS FIRST) WHERE \"expires_at\" IS NOT NULL;\n\nCREATE INDEX \"idx_plugin_blob_listing\" ON \"plugin_blob_entries\" ((\"plugin_id\") ASC NULLS FIRST, (\"namespace\") ASC NULLS FIRST, (\"created_at\") ASC NULLS FIRST, (\"entry_key\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_plugin_state_expiry\" ON \"plugin_state_entries\" ((\"expires_at\") ASC NULLS FIRST) WHERE \"expires_at\" IS NOT NULL;\n\nCREATE INDEX \"idx_plugin_state_listing\" ON \"plugin_state_entries\" ((\"plugin_id\") ASC NULLS FIRST, (\"namespace\") ASC NULLS FIRST, (\"created_at\") ASC NULLS FIRST, (\"entry_key\") ASC NULLS FIRST, (\"expires_at\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_sandbox_registry_last_used\" ON \"sandbox_registry_entries\" ((\"registry_kind\") ASC NULLS FIRST, (\"last_used_at_ms\") DESC NULLS LAST, (\"container_name\") ASC NULLS FIRST) WHERE \"last_used_at_ms\" IS NOT NULL;\n\nCREATE INDEX \"idx_sandbox_registry_session\" ON \"sandbox_registry_entries\" ((\"registry_kind\") ASC NULLS FIRST, (\"session_key\") ASC NULLS FIRST, (\"last_used_at_ms\") DESC NULLS LAST, (\"container_name\") ASC NULLS FIRST) WHERE \"session_key\" IS NOT NULL;\n\nCREATE INDEX \"idx_sandbox_registry_updated\" ON \"sandbox_registry_entries\" ((\"registry_kind\") ASC NULLS FIRST, (\"updated_at\") DESC NULLS LAST, (\"container_name\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_session_state_events_session_sequence\" ON \"session_state_events\" ((\"session_key\") ASC NULLS FIRST, (\"sequence\") DESC NULLS LAST);\n\nCREATE INDEX \"idx_session_state_events_time\" ON \"session_state_events\" ((\"occurred_at\") DESC NULLS LAST, (\"sequence\") DESC NULLS LAST);\n\nCREATE INDEX \"idx_session_upstream_links_catalog_id\" ON \"session_upstream_links\" ((\"catalog_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_session_watch_cursors_target\" ON \"session_watch_cursors\" ((\"target_session_key\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_skill_uploads_expiry\" ON \"skill_uploads\" ((\"expires_at\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_skill_uploads_idempotency\" ON \"skill_uploads\" ((\"idempotency_key_hash\") ASC NULLS FIRST) WHERE \"idempotency_key_hash\" IS NOT NULL;\n\nCREATE INDEX \"idx_skill_usage_key\" ON \"skill_usage\" ((\"skill_key\") ASC NULLS FIRST, (\"skill_file\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_state_leases_expiry\" ON \"state_leases\" ((\"expires_at\") ASC NULLS FIRST, (\"scope\") ASC NULLS FIRST, (\"lease_key\") ASC NULLS FIRST) WHERE \"expires_at\" IS NOT NULL;\n\nCREATE INDEX \"idx_state_leases_owner\" ON \"state_leases\" ((\"owner\") ASC NULLS FIRST, (\"updated_at\") DESC NULLS LAST);\n\nCREATE INDEX \"idx_subagent_runs_child_session_key\" ON \"subagent_runs\" ((\"child_session_key\") ASC NULLS FIRST, (\"created_at\") DESC NULLS LAST, (\"run_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_subagent_runs_controller_session_key\" ON \"subagent_runs\" ((\"controller_session_key\") ASC NULLS FIRST, (\"created_at\") DESC NULLS LAST, (\"run_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_subagent_runs_requester_session_key\" ON \"subagent_runs\" ((\"requester_session_key\") ASC NULLS FIRST, (\"created_at\") DESC NULLS LAST, (\"run_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_task_runs_child_session_key\" ON \"task_runs\" ((\"child_session_key\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_task_runs_cleanup_after\" ON \"task_runs\" ((\"cleanup_after\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_task_runs_last_event_at\" ON \"task_runs\" ((\"last_event_at\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_task_runs_owner_key\" ON \"task_runs\" ((\"owner_key\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_task_runs_parent_flow_id\" ON \"task_runs\" ((\"parent_flow_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_task_runs_requester_session_key\" ON \"task_runs\" ((\"requester_session_key\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_task_runs_run_id\" ON \"task_runs\" ((\"run_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_task_runs_runtime_ended\" ON \"task_runs\" ((\"runtime\") ASC NULLS FIRST, (\"ended_at\") ASC NULLS FIRST, (\"created_at\") ASC NULLS FIRST, (\"task_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_task_runs_runtime_source_ended\" ON \"task_runs\" ((\"runtime\") ASC NULLS FIRST, (\"source_id\") ASC NULLS FIRST, (\"ended_at\") ASC NULLS FIRST, (\"created_at\") ASC NULLS FIRST, (\"task_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_task_runs_runtime_status\" ON \"task_runs\" ((\"runtime\") ASC NULLS FIRST, (\"status\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_task_runs_status\" ON \"task_runs\" ((\"status\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_web_push_subscriptions_updated\" ON \"web_push_subscriptions\" ((\"updated_at_ms\") DESC NULLS LAST, (\"subscription_id\") ASC NULLS FIRST);\n\nCREATE UNIQUE INDEX \"idx_worker_environments_provider_lease\" ON \"worker_environments\" ((\"provider_id\") ASC NULLS FIRST, (\"lease_id\") ASC NULLS FIRST) WHERE \"lease_id\" IS NOT NULL;\n\nCREATE INDEX \"idx_worker_environments_terminal_changed\" ON \"worker_environments\" ((\"state_changed_at_ms\") ASC NULLS FIRST, (\"environment_id\") ASC NULLS FIRST);\n\nCREATE UNIQUE INDEX \"idx_worker_inference_turns_pending_run\" ON \"worker_inference_turns\" ((\"session_id\") ASC NULLS FIRST, (\"run_epoch\") ASC NULLS FIRST, (\"run_id\") ASC NULLS FIRST) WHERE (\"state\" = 'pending');\n\nCREATE INDEX \"idx_worker_session_placements_environment\" ON \"worker_session_placements\" ((\"environment_id\") ASC NULLS FIRST) WHERE \"environment_id\" IS NOT NULL;\n\nCREATE INDEX \"idx_worker_session_placements_reconcile\" ON \"worker_session_placements\" ((\"updated_at_ms\") ASC NULLS FIRST, (\"session_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_worker_session_placements_session_key\" ON \"worker_session_placements\" ((\"agent_id\") ASC NULLS FIRST, (\"session_key\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_workspace_path_aliases_workspace\" ON \"workspace_path_aliases\" ((\"workspace_key\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_workspace_setup_state_path\" ON \"workspace_setup_state\" ((\"workspace_path\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_worktrees_removed_at\" ON \"worktrees\" ((\"removed_at\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_worktrees_repo_fingerprint\" ON \"worktrees\" ((\"repo_fingerprint\") ASC NULLS FIRST);\n\nALTER TABLE \"acp_replay_events\" ADD FOREIGN KEY (\"session_id\") REFERENCES \"acp_replay_sessions\" (\"session_id\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n\nALTER TABLE \"capture_events\" ADD FOREIGN KEY (\"data_blob_id\") REFERENCES \"capture_blobs\" (\"blob_id\") ON UPDATE NO ACTION ON DELETE SET NULL NOT DEFERRABLE;\n\nALTER TABLE \"capture_events\" ADD FOREIGN KEY (\"session_id\") REFERENCES \"capture_sessions\" (\"id\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n\nALTER TABLE \"meeting_transcript_summaries\" ADD FOREIGN KEY (\"session_id\", \"session_started_at\") REFERENCES \"meeting_transcript_sessions\" (\"session_id\", \"started_at\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n\nALTER TABLE \"meeting_transcript_utterances\" ADD FOREIGN KEY (\"session_id\", \"session_started_at\") REFERENCES \"meeting_transcript_sessions\" (\"session_id\", \"started_at\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n\nALTER TABLE \"migration_sources\" ADD FOREIGN KEY (\"last_run_id\") REFERENCES \"migration_runs\" (\"id\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n\nALTER TABLE \"skill_upload_chunks\" ADD FOREIGN KEY (\"upload_id\") REFERENCES \"skill_uploads\" (\"upload_id\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n\nALTER TABLE \"task_delivery_state\" ADD FOREIGN KEY (\"task_id\") REFERENCES \"task_runs\" (\"task_id\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n\nALTER TABLE \"worker_environment_credentials\" ADD FOREIGN KEY (\"environment_id\") REFERENCES \"worker_environments\" (\"environment_id\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n\nALTER TABLE \"worker_inference_turns\" ADD FOREIGN KEY (\"environment_id\") REFERENCES \"worker_environments\" (\"environment_id\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n\nALTER TABLE \"worker_session_tool_operations\" ADD FOREIGN KEY (\"source_session_id\") REFERENCES \"worker_session_placements\" (\"session_id\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n\nALTER TABLE \"worker_transcript_commits\" ADD FOREIGN KEY (\"session_id\", \"run_epoch\") REFERENCES \"worker_transcript_commit_heads\" (\"session_id\", \"run_epoch\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n\nALTER TABLE \"worker_turn_tool_authorities\" ADD FOREIGN KEY (\"session_id\") REFERENCES \"worker_session_placements\" (\"session_id\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n\nALTER TABLE \"worker_workspace_pending_results\" ADD FOREIGN KEY (\"session_id\") REFERENCES \"worker_session_placements\" (\"session_id\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n\nALTER TABLE \"worker_workspace_reconciliations\" ADD FOREIGN KEY (\"session_id\") REFERENCES \"worker_session_placements\" (\"session_id\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n\nALTER TABLE \"workspace_generated_bootstrap_hashes\" ADD FOREIGN KEY (\"workspace_key\") REFERENCES \"workspace_setup_state\" (\"workspace_key\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n",
	fragments: [
		{
			id: "user_profiles",
			tables: [
				"user_profiles",
				"user_profile_emails",
				"user_profile_identities"
			],
			indexes: [
				"idx_user_profile_emails_profile_id",
				"idx_user_profile_identities_profile_id",
				"idx_user_profile_identities_authorization"
			],
			dependencies: [],
			activation: "first-use",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"user_profile_emails\" (\n  \"email\" text COLLATE \"C\" NOT NULL,\n  \"profile_id\" text COLLATE \"C\" NOT NULL,\n  \"binding_id\" text COLLATE \"C\",\n  \"created_at\" bigint NOT NULL,\n  PRIMARY KEY (\"email\")\n);\n\nCREATE TABLE \"user_profile_identities\" (\n  \"provider\" text COLLATE \"C\" NOT NULL,\n  \"subject\" text COLLATE \"C\" NOT NULL,\n  \"profile_id\" text COLLATE \"C\" NOT NULL,\n  \"canonical_login\" text COLLATE \"C\",\n  \"created_at\" bigint NOT NULL,\n  \"authorization_id\" text COLLATE \"C\",\n  \"authorization_basis_json\" text COLLATE \"C\",\n  PRIMARY KEY (\"provider\", \"subject\")\n);\n\nCREATE TABLE \"user_profiles\" (\n  \"id\" text COLLATE \"C\" NOT NULL,\n  \"display_name\" text COLLATE \"C\",\n  \"primary_github_account_id\" bigint,\n  \"avatar\" bytea,\n  \"avatar_mime\" text COLLATE \"C\",\n  \"avatar_sha256\" text COLLATE \"C\",\n  \"merged_into\" text COLLATE \"C\",\n  \"role\" text COLLATE \"C\",\n  \"created_at\" bigint NOT NULL,\n  \"updated_at\" bigint NOT NULL,\n  PRIMARY KEY (\"id\")\n);\n\nCREATE INDEX \"idx_user_profile_emails_profile_id\" ON \"user_profile_emails\" ((\"profile_id\") ASC NULLS FIRST);\n\nCREATE UNIQUE INDEX \"idx_user_profile_identities_authorization\" ON \"user_profile_identities\" ((\"authorization_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_user_profile_identities_profile_id\" ON \"user_profile_identities\" ((\"profile_id\") ASC NULLS FIRST);\n"
		},
		{
			id: "skill_library_entries",
			tables: [
				"skill_library_entries",
				"skill_library_revisions",
				"skill_library_events",
				"skill_library_uploads"
			],
			indexes: [],
			dependencies: [],
			activation: "first-use",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"skill_library_entries\" (\n  \"skill_id\" text COLLATE \"C\" NOT NULL,\n  \"owner_profile_id\" text COLLATE \"C\",\n  \"author_profile_id\" text COLLATE \"C\" NOT NULL,\n  \"slug\" text COLLATE \"C\" NOT NULL,\n  \"current_revision\" text COLLATE \"C\" NOT NULL,\n  \"shared\" bigint NOT NULL,\n  \"enabled\" bigint NOT NULL,\n  \"removed\" bigint NOT NULL,\n  \"created_at\" bigint NOT NULL,\n  \"updated_at\" bigint NOT NULL,\n  PRIMARY KEY (\"skill_id\")\n);\n\nCREATE TABLE \"skill_library_events\" (\n  \"event_id\" text COLLATE \"C\" NOT NULL,\n  \"skill_id\" text COLLATE \"C\" NOT NULL,\n  \"revision\" text COLLATE \"C\" NOT NULL,\n  \"action\" text COLLATE \"C\" NOT NULL,\n  \"actor_profile_id\" text COLLATE \"C\" NOT NULL,\n  \"created_at\" bigint NOT NULL,\n  PRIMARY KEY (\"event_id\")\n);\n\nCREATE TABLE \"skill_library_revisions\" (\n  \"skill_id\" text COLLATE \"C\" NOT NULL,\n  \"revision\" text COLLATE \"C\" NOT NULL,\n  \"description\" text COLLATE \"C\" NOT NULL,\n  \"files_json\" text COLLATE \"C\" NOT NULL,\n  \"created_at\" bigint NOT NULL,\n  PRIMARY KEY (\"skill_id\", \"revision\")\n);\n\nCREATE TABLE \"skill_library_uploads\" (\n  \"upload_id\" text COLLATE \"C\" NOT NULL,\n  \"owner_profile_id\" text COLLATE \"C\" NOT NULL,\n  \"slug\" text COLLATE \"C\" NOT NULL,\n  \"size_bytes\" bigint NOT NULL,\n  \"sha256\" text COLLATE \"C\" NOT NULL,\n  \"archive_blob\" bytea NOT NULL,\n  \"expires_at\" bigint NOT NULL,\n  \"published_skill_id\" text COLLATE \"C\",\n  PRIMARY KEY (\"upload_id\")\n);\n"
		},
		{
			id: "operator_approval_standing_grants",
			tables: ["operator_approval_standing_grants", "operator_approval_standing_grant_generations"],
			indexes: ["idx_operator_approval_standing_grants_binding"],
			dependencies: [],
			activation: "first-use",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"operator_approval_standing_grant_generations\" (\n  \"grant_id\" text COLLATE \"C\" NOT NULL,\n  \"job_definition_generation\" bigint NOT NULL,\n  PRIMARY KEY (\"grant_id\"),\n  CHECK ((\"job_definition_generation\" >= 1))\n);\n\nCREATE TABLE \"operator_approval_standing_grants\" (\n  \"grant_id\" text COLLATE \"C\" NOT NULL,\n  \"minted_by_approval_id\" text COLLATE \"C\" NOT NULL,\n  \"agent_id\" text COLLATE \"C\" NOT NULL,\n  \"cron_job_id\" text COLLATE \"C\" NOT NULL,\n  \"job_config_revision\" text COLLATE \"C\" NOT NULL,\n  \"operation_binding\" text COLLATE \"C\" NOT NULL,\n  \"created_at_ms\" bigint NOT NULL,\n  \"expires_at_ms\" bigint,\n  \"revoked_at_ms\" bigint,\n  \"revoked_by\" text COLLATE \"C\",\n  \"last_used_at_ms\" bigint,\n  \"use_count\" bigint NOT NULL DEFAULT 0,\n  PRIMARY KEY (\"grant_id\"),\n  CHECK ((char_length(\"grant_id\") > 0)),\n  CHECK ((char_length(\"agent_id\") > 0)),\n  CHECK ((char_length(\"cron_job_id\") > 0)),\n  CHECK ((char_length(\"job_config_revision\") > 0)),\n  CHECK ((char_length(\"operation_binding\") > 0)),\n  CHECK (\"expires_at_ms\" IS NULL OR (\"expires_at_ms\" >= \"created_at_ms\"))\n);\n\nCREATE INDEX \"idx_operator_approval_standing_grants_binding\" ON \"operator_approval_standing_grants\" ((\"agent_id\") ASC NULLS FIRST, (\"cron_job_id\") ASC NULLS FIRST, (\"operation_binding\") ASC NULLS FIRST, (\"created_at_ms\") DESC NULLS LAST);\n\nALTER TABLE \"operator_approval_standing_grant_generations\" ADD FOREIGN KEY (\"grant_id\") REFERENCES \"operator_approval_standing_grants\" (\"grant_id\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n\nALTER TABLE \"operator_approval_standing_grants\" ADD FOREIGN KEY (\"minted_by_approval_id\") REFERENCES \"operator_approvals\" (\"approval_id\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n"
		},
		{
			id: "worker_environment_session_attachments",
			tables: ["worker_environment_session_attachments"],
			indexes: ["worker_environment_session_attachments_session_key"],
			dependencies: [],
			activation: "first-use",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"worker_environment_session_attachments\" (\n  \"session_id\" text COLLATE \"C\" NOT NULL,\n  \"session_key\" text COLLATE \"C\" NOT NULL,\n  \"agent_id\" text COLLATE \"C\" NOT NULL,\n  \"session_lifecycle_revision\" text COLLATE \"C\",\n  \"environment_id\" text COLLATE \"C\" NOT NULL,\n  \"generation\" bigint NOT NULL,\n  \"created_at_ms\" bigint NOT NULL,\n  \"last_used_at_ms\" bigint NOT NULL,\n  \"closed_at_ms\" bigint,\n  PRIMARY KEY (\"session_id\"),\n  CHECK ((\"generation\" >= 1)),\n  UNIQUE (\"environment_id\")\n);\n\nCREATE INDEX \"worker_environment_session_attachments_session_key\" ON \"worker_environment_session_attachments\" ((\"agent_id\") ASC NULLS FIRST, (\"session_key\") ASC NULLS FIRST);\n\nALTER TABLE \"worker_environment_session_attachments\" ADD FOREIGN KEY (\"environment_id\") REFERENCES \"worker_environments\" (\"environment_id\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n"
		},
		{
			id: "user_background_images",
			tables: ["user_background_images"],
			indexes: [],
			dependencies: ["user_profiles"],
			activation: "first-use",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"user_background_images\" (\n  \"profile_id\" text COLLATE \"C\" NOT NULL,\n  \"asset_id\" text COLLATE \"C\" NOT NULL,\n  \"image\" bytea NOT NULL,\n  \"width\" bigint NOT NULL,\n  \"height\" bigint NOT NULL,\n  PRIMARY KEY (\"profile_id\"),\n  CHECK ((octet_length(\"image\") BETWEEN 1 AND 2097152)),\n  CHECK ((\"width\" BETWEEN 1 AND 2560)),\n  CHECK ((\"height\" BETWEEN 1 AND 2560)),\n  UNIQUE (\"asset_id\")\n);\n\nALTER TABLE \"user_background_images\" ADD FOREIGN KEY (\"profile_id\") REFERENCES \"user_profiles\" (\"id\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n"
		},
		{
			id: "local_workspace_projections",
			tables: ["local_workspace_projections"],
			indexes: [],
			dependencies: [],
			activation: "first-use",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"local_workspace_projections\" (\n  \"worktree_id\" text COLLATE \"C\" NOT NULL,\n  \"agent_id\" text COLLATE \"C\" NOT NULL,\n  \"session_key\" text COLLATE \"C\" NOT NULL,\n  \"session_id\" text COLLATE \"C\" NOT NULL,\n  \"lifecycle_revision\" text COLLATE \"C\",\n  \"projection_path\" text COLLATE \"C\" NOT NULL,\n  \"base_commit\" text COLLATE \"C\" NOT NULL,\n  \"source_paths_json\" text COLLATE \"C\" NOT NULL,\n  \"baseline_json\" text COLLATE \"C\",\n  \"baseline_ref\" text COLLATE \"C\",\n  \"pending_ref\" text COLLATE \"C\",\n  \"pending_target\" text COLLATE \"C\",\n  \"paused_runtimes_json\" text COLLATE \"C\",\n  \"journal_json\" text COLLATE \"C\",\n  \"journal_pack\" bytea,\n  \"revision\" bigint NOT NULL DEFAULT 0,\n  \"created_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"worktree_id\"),\n  CHECK ((\"pending_target\" IN ('canonical', 'projection'))),\n  CHECK (\"journal_pack\" IS NULL OR (octet_length(\"journal_pack\") <= 268435456)),\n  CHECK ((\"revision\" >= 0)),\n  CHECK (((\"baseline_json\" IS NULL) = (\"baseline_ref\" IS NULL))),\n  CHECK (((\"journal_json\" IS NULL) = (\"journal_pack\" IS NULL))),\n  UNIQUE (\"projection_path\")\n);\n"
		},
		{
			id: "update_runs",
			tables: ["update_runs"],
			indexes: ["idx_update_runs_created", "idx_update_runs_active"],
			dependencies: [],
			activation: "first-use",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"update_runs\" (\n  \"run_id\" text COLLATE \"C\" NOT NULL,\n  \"created_at_ms\" bigint NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  \"trigger\" text COLLATE \"C\" NOT NULL,\n  \"phase\" text COLLATE \"C\" NOT NULL,\n  \"status\" text COLLATE \"C\" NOT NULL,\n  \"reason\" text COLLATE \"C\",\n  \"origin_json\" text COLLATE \"C\" NOT NULL,\n  \"target_json\" text COLLATE \"C\" NOT NULL,\n  \"before_json\" text COLLATE \"C\" NOT NULL,\n  \"after_json\" text COLLATE \"C\" NOT NULL,\n  \"steps_json\" text COLLATE \"C\" NOT NULL,\n  \"verification_json\" text COLLATE \"C\" NOT NULL,\n  \"repair_json\" text COLLATE \"C\" NOT NULL,\n  \"confirmed_at_ms\" bigint,\n  \"finished_at_ms\" bigint,\n  \"downtime_ms\" bigint,\n  PRIMARY KEY (\"run_id\"),\n  CHECK ((\"trigger\" IN ('chat', 'control-ui', 'cli', 'campaign', 'mac-app', 'api'))),\n  CHECK ((\"phase\" IN ('requested', 'staging', 'validating', 'repairing', 'activating', 'restarting', 'verifying', 'finished'))),\n  CHECK ((\"status\" IN ('running', 'succeeded', 'failed', 'rolled-back', 'skipped'))),\n  CHECK ((octet_length(convert_to(\"origin_json\", 'UTF8')) <= 16384)),\n  CHECK ((octet_length(convert_to(\"target_json\", 'UTF8')) <= 16384)),\n  CHECK ((octet_length(convert_to(\"before_json\", 'UTF8')) <= 16384)),\n  CHECK ((octet_length(convert_to(\"after_json\", 'UTF8')) <= 16384)),\n  CHECK ((octet_length(convert_to(\"steps_json\", 'UTF8')) <= 16384)),\n  CHECK ((octet_length(convert_to(\"verification_json\", 'UTF8')) <= 16384)),\n  CHECK ((octet_length(convert_to(\"repair_json\", 'UTF8')) <= 16384)),\n  CHECK (((\"status\" = 'running') AND (\"phase\" != 'finished') AND \"finished_at_ms\" IS NULL) OR ((\"status\" != 'running') AND (\"phase\" = 'finished') AND \"finished_at_ms\" IS NOT NULL))\n);\n\nCREATE INDEX \"idx_update_runs_active\" ON \"update_runs\" ((\"status\") ASC NULLS FIRST, (\"created_at_ms\") DESC NULLS LAST, (\"run_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_update_runs_created\" ON \"update_runs\" ((\"created_at_ms\") DESC NULLS LAST, (\"run_id\") ASC NULLS FIRST);\n"
		},
		{
			id: "session_repository_workspaces",
			tables: ["session_repository_workspaces"],
			indexes: [],
			dependencies: [],
			activation: "first-use",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"session_repository_workspaces\" (\n  \"workspace_id\" text COLLATE \"C\" NOT NULL,\n  \"agent_id\" text COLLATE \"C\" NOT NULL,\n  \"session_key\" text COLLATE \"C\" NOT NULL,\n  \"url\" text COLLATE \"C\" NOT NULL,\n  \"requested_ref\" text COLLATE \"C\",\n  \"run_setup_script\" bigint NOT NULL DEFAULT 0,\n  \"base_commit\" text COLLATE \"C\",\n  \"base_manifest_hash\" text COLLATE \"C\",\n  \"branch\" text COLLATE \"C\" NOT NULL,\n  \"checkpoint_ref\" text COLLATE \"C\",\n  \"manifest_hash\" text COLLATE \"C\",\n  \"revision\" bigint NOT NULL,\n  \"created_at_ms\" bigint NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"workspace_id\"),\n  CHECK ((char_length(\"workspace_id\") = 36)),\n  CHECK ((char_length(\"agent_id\") BETWEEN 1 AND 128)),\n  CHECK ((char_length(\"session_key\") BETWEEN 1 AND 1024)),\n  CHECK ((char_length(\"url\") BETWEEN 1 AND 4096)),\n  CHECK (\"requested_ref\" IS NULL OR (char_length(\"requested_ref\") BETWEEN 1 AND 1024)),\n  CHECK ((\"run_setup_script\" IN (0, 1))),\n  CHECK (\"base_commit\" IS NULL OR (char_length(\"base_commit\") IN (40, 64))),\n  CHECK ((char_length(\"branch\") BETWEEN 1 AND 256)),\n  CHECK ((\"revision\" >= 0)),\n  CHECK (\"base_manifest_hash\" IS NULL OR \"base_commit\" IS NOT NULL),\n  CHECK ((\"checkpoint_ref\" IS NULL AND \"manifest_hash\" IS NULL) OR (\"checkpoint_ref\" IS NOT NULL AND \"manifest_hash\" IS NOT NULL AND \"base_manifest_hash\" IS NOT NULL)),\n  UNIQUE (\"agent_id\", \"session_key\")\n);\n"
		},
		{
			id: "github_repository_publication_requests",
			tables: ["github_repository_publication_requests"],
			indexes: ["idx_github_repository_publication_shared_request", "idx_github_repository_publication_personal_request"],
			dependencies: [],
			activation: "first-use",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"github_repository_publication_requests\" (\n  \"request_id\" text COLLATE \"C\" NOT NULL,\n  \"owner_profile_id\" text COLLATE \"C\",\n  \"connection_generation\" text COLLATE \"C\",\n  \"idempotency_key\" text COLLATE \"C\" NOT NULL,\n  \"request_digest\" text COLLATE \"C\" NOT NULL,\n  \"session_id\" text COLLATE \"C\" NOT NULL,\n  \"session_lifecycle_revision\" text COLLATE \"C\",\n  \"requester_authority_json\" text COLLATE \"C\",\n  \"session_key\" text COLLATE \"C\" NOT NULL,\n  \"agent_id\" text COLLATE \"C\" NOT NULL,\n  \"workspace_id\" text COLLATE \"C\" NOT NULL,\n  \"checkpoint_ref\" text COLLATE \"C\",\n  \"checkpoint_digest\" text COLLATE \"C\",\n  \"claim_id\" text COLLATE \"C\",\n  \"run_id\" text COLLATE \"C\",\n  \"environment_id\" text COLLATE \"C\",\n  \"owner_epoch\" bigint,\n  \"placement_generation\" bigint,\n  \"identity_source\" text COLLATE \"C\" NOT NULL,\n  \"identity_profile_id\" text COLLATE \"C\",\n  \"identity_account_id\" bigint NOT NULL,\n  \"identity_login\" text COLLATE \"C\" NOT NULL,\n  \"title\" text COLLATE \"C\",\n  \"body\" text COLLATE \"C\",\n  \"status\" text COLLATE \"C\" NOT NULL,\n  \"gateway_instance_id\" text COLLATE \"C\",\n  \"execution_id\" text COLLATE \"C\",\n  \"last_effect\" text COLLATE \"C\",\n  \"effect_state\" text COLLATE \"C\",\n  \"push_repository\" text COLLATE \"C\",\n  \"repository\" text COLLATE \"C\",\n  \"branch\" text COLLATE \"C\" NOT NULL,\n  \"base_branch\" text COLLATE \"C\",\n  \"source_head_commit\" text COLLATE \"C\",\n  \"source_index_tree\" text COLLATE \"C\",\n  \"workspace_tree\" text COLLATE \"C\",\n  \"previous_head_commit\" text COLLATE \"C\",\n  \"pushed_head_commit\" text COLLATE \"C\",\n  \"head_commit\" text COLLATE \"C\",\n  \"pull_request_url\" text COLLATE \"C\",\n  \"error_code\" text COLLATE \"C\",\n  \"next_action\" text COLLATE \"C\",\n  \"created_at_ms\" bigint NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  \"reported_at_ms\" bigint,\n  PRIMARY KEY (\"request_id\"),\n  CHECK ((\"identity_source\" IN ('system-detected', 'system-configured', 'agent-override', 'personal'))),\n  CHECK ((\"status\" IN ('requested', 'publishing', 'needs_confirmation', 'published', 'failed'))),\n  CHECK ((\"last_effect\" IN ('push', 'pull_request'))),\n  CHECK ((\"effect_state\" IN ('dispatched', 'observed'))),\n  CHECK (((\"identity_source\" = 'personal') AND \"owner_profile_id\" IS NOT NULL AND \"connection_generation\" IS NOT NULL) OR ((\"identity_source\" <> 'personal') AND \"owner_profile_id\" IS NULL AND \"connection_generation\" IS NULL)),\n  CHECK ((\"checkpoint_ref\" IS NULL AND \"checkpoint_digest\" IS NULL) OR (\"checkpoint_ref\" IS NOT NULL AND \"checkpoint_digest\" IS NOT NULL)),\n  CHECK ((\"last_effect\" IS NULL AND \"effect_state\" IS NULL) OR (\"last_effect\" IS NOT NULL AND \"effect_state\" IS NOT NULL))\n);\n\nCREATE UNIQUE INDEX \"idx_github_repository_publication_personal_request\" ON \"github_repository_publication_requests\" ((\"owner_profile_id\") ASC NULLS FIRST, (\"session_id\") ASC NULLS FIRST, (\"idempotency_key\") ASC NULLS FIRST) WHERE \"owner_profile_id\" IS NOT NULL;\n\nCREATE UNIQUE INDEX \"idx_github_repository_publication_shared_request\" ON \"github_repository_publication_requests\" ((\"session_id\") ASC NULLS FIRST, (\"idempotency_key\") ASC NULLS FIRST) WHERE \"owner_profile_id\" IS NULL;\n"
		},
		{
			id: "github_publication_session_lifecycles",
			tables: ["github_publication_session_lifecycles"],
			indexes: [],
			dependencies: [],
			activation: "first-use",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"github_publication_session_lifecycles\" (\n  \"publication_kind\" text COLLATE \"C\" NOT NULL,\n  \"request_id\" text COLLATE \"C\" NOT NULL,\n  \"lifecycle_revision\" text COLLATE \"C\",\n  \"requester_authority_json\" text COLLATE \"C\",\n  PRIMARY KEY (\"publication_kind\", \"request_id\"),\n  CHECK ((\"publication_kind\" IN ('shared', 'personal')))\n);\n"
		},
		{
			id: "github_personal_publication_requests",
			tables: ["github_personal_publication_requests"],
			indexes: ["idx_github_personal_publication_owner_session", "idx_github_personal_publication_pending"],
			dependencies: [],
			activation: "first-use",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"github_personal_publication_requests\" (\n  \"request_id\" text COLLATE \"C\" NOT NULL,\n  \"owner_profile_id\" text COLLATE \"C\" NOT NULL,\n  \"connection_generation\" text COLLATE \"C\" NOT NULL,\n  \"idempotency_key\" text COLLATE \"C\" NOT NULL,\n  \"request_digest\" text COLLATE \"C\" NOT NULL,\n  \"session_id\" text COLLATE \"C\" NOT NULL,\n  \"session_key\" text COLLATE \"C\" NOT NULL,\n  \"agent_id\" text COLLATE \"C\" NOT NULL,\n  \"worktree_id\" text COLLATE \"C\" NOT NULL,\n  \"repository_fingerprint\" text COLLATE \"C\" NOT NULL,\n  \"identity_source\" text COLLATE \"C\" NOT NULL,\n  \"identity_profile_id\" text COLLATE \"C\" NOT NULL,\n  \"identity_account_id\" bigint NOT NULL,\n  \"identity_login\" text COLLATE \"C\" NOT NULL,\n  \"title\" text COLLATE \"C\",\n  \"body\" text COLLATE \"C\",\n  \"status\" text COLLATE \"C\" NOT NULL,\n  \"gateway_instance_id\" text COLLATE \"C\",\n  \"execution_id\" text COLLATE \"C\",\n  \"last_effect\" text COLLATE \"C\",\n  \"effect_state\" text COLLATE \"C\",\n  \"push_repository\" text COLLATE \"C\" NOT NULL,\n  \"repository\" text COLLATE \"C\" NOT NULL,\n  \"branch\" text COLLATE \"C\" NOT NULL,\n  \"base_branch\" text COLLATE \"C\" NOT NULL,\n  \"source_head_commit\" text COLLATE \"C\" NOT NULL,\n  \"source_index_tree\" text COLLATE \"C\" NOT NULL,\n  \"workspace_tree\" text COLLATE \"C\" NOT NULL,\n  \"head_commit\" text COLLATE \"C\",\n  \"pull_request_url\" text COLLATE \"C\",\n  \"error_code\" text COLLATE \"C\",\n  \"next_action\" text COLLATE \"C\",\n  \"created_at_ms\" bigint NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  \"reported_at_ms\" bigint,\n  PRIMARY KEY (\"request_id\"),\n  CHECK ((char_length(\"request_id\") = 36)),\n  CHECK ((char_length(\"owner_profile_id\") BETWEEN 1 AND 128)),\n  CHECK ((char_length(\"connection_generation\") = 36)),\n  CHECK ((char_length(\"idempotency_key\") BETWEEN 1 AND 128)),\n  CHECK ((char_length(\"request_digest\") = 64)),\n  CHECK ((char_length(\"session_id\") BETWEEN 1 AND 128)),\n  CHECK ((char_length(\"session_key\") BETWEEN 1 AND 1024)),\n  CHECK ((char_length(\"agent_id\") BETWEEN 1 AND 128)),\n  CHECK ((char_length(\"worktree_id\") BETWEEN 1 AND 128)),\n  CHECK ((char_length(\"repository_fingerprint\") BETWEEN 1 AND 256)),\n  CHECK ((\"identity_source\" = 'personal')),\n  CHECK ((char_length(\"identity_profile_id\") = 36)),\n  CHECK ((\"identity_account_id\" >= 1)),\n  CHECK ((char_length(\"identity_login\") BETWEEN 1 AND 39)),\n  CHECK (\"title\" IS NULL OR (char_length(\"title\") BETWEEN 1 AND 256)),\n  CHECK (\"body\" IS NULL OR (char_length(\"body\") BETWEEN 1 AND 8192)),\n  CHECK ((\"status\" IN ('requested', 'publishing', 'needs_confirmation', 'published', 'failed'))),\n  CHECK (\"gateway_instance_id\" IS NULL OR (char_length(\"gateway_instance_id\") BETWEEN 1 AND 128)),\n  CHECK (\"execution_id\" IS NULL OR (char_length(\"execution_id\") = 36)),\n  CHECK (\"last_effect\" IS NULL OR (\"last_effect\" IN ('push', 'pull_request'))),\n  CHECK (\"effect_state\" IS NULL OR (\"effect_state\" IN ('dispatched', 'observed'))),\n  CHECK ((char_length(\"push_repository\") BETWEEN 3 AND 256)),\n  CHECK ((char_length(\"repository\") BETWEEN 3 AND 256)),\n  CHECK ((char_length(\"branch\") BETWEEN 1 AND 256)),\n  CHECK ((char_length(\"base_branch\") BETWEEN 1 AND 256)),\n  CHECK ((char_length(\"source_head_commit\") IN (40, 64))),\n  CHECK ((char_length(\"source_index_tree\") IN (40, 64))),\n  CHECK ((char_length(\"workspace_tree\") IN (40, 64))),\n  CHECK (\"head_commit\" IS NULL OR (char_length(\"head_commit\") IN (40, 64))),\n  CHECK (\"pull_request_url\" IS NULL OR (char_length(\"pull_request_url\") BETWEEN 1 AND 2048)),\n  CHECK (\"error_code\" IS NULL OR (char_length(\"error_code\") BETWEEN 1 AND 64)),\n  CHECK (\"next_action\" IS NULL OR (char_length(\"next_action\") BETWEEN 1 AND 1024)),\n  CHECK ((\"created_at_ms\" >= 0)),\n  CHECK ((\"updated_at_ms\" >= \"created_at_ms\")),\n  CHECK (((\"status\" = 'publishing') AND \"gateway_instance_id\" IS NOT NULL AND \"execution_id\" IS NOT NULL) OR (\"status\" <> 'publishing')),\n  CHECK ((\"last_effect\" IS NULL AND \"effect_state\" IS NULL) OR (\"last_effect\" IS NOT NULL AND \"effect_state\" IS NOT NULL)),\n  CHECK (((\"status\" = 'published') AND \"pull_request_url\" IS NOT NULL AND \"head_commit\" IS NOT NULL AND \"error_code\" IS NULL AND \"next_action\" IS NULL) OR ((\"status\" = 'failed') AND \"error_code\" IS NOT NULL AND \"next_action\" IS NOT NULL) OR ((\"status\" IN ('requested', 'publishing', 'needs_confirmation')) AND \"error_code\" IS NULL AND \"next_action\" IS NULL)),\n  UNIQUE (\"owner_profile_id\", \"session_id\", \"idempotency_key\")\n);\n\nCREATE INDEX \"idx_github_personal_publication_owner_session\" ON \"github_personal_publication_requests\" ((\"owner_profile_id\") ASC NULLS FIRST, (\"session_id\") ASC NULLS FIRST, (\"created_at_ms\") ASC NULLS FIRST);\n\nCREATE INDEX \"idx_github_personal_publication_pending\" ON \"github_personal_publication_requests\" ((\"status\") ASC NULLS FIRST, (\"updated_at_ms\") ASC NULLS FIRST, (\"request_id\") ASC NULLS FIRST);\n"
		},
		{
			id: "cron_job_runtime_authorities",
			tables: ["cron_job_runtime_authorities"],
			indexes: [],
			dependencies: [],
			activation: "first-use",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"cron_job_runtime_authorities\" (\n  \"store_key\" text COLLATE \"C\" NOT NULL,\n  \"job_id\" text COLLATE \"C\" NOT NULL,\n  \"authority_json\" text COLLATE \"C\",\n  \"authority_input_fingerprint\" text COLLATE \"C\",\n  \"recovery_required\" bigint NOT NULL,\n  PRIMARY KEY (\"store_key\", \"job_id\"),\n  CHECK ((\"recovery_required\" IN (0, 1))),\n  CHECK (((\"recovery_required\" = 0) AND \"authority_json\" IS NOT NULL AND \"authority_input_fingerprint\" IS NOT NULL) OR ((\"recovery_required\" = 1) AND \"authority_json\" IS NULL AND \"authority_input_fingerprint\" IS NULL))\n);\n\nALTER TABLE \"cron_job_runtime_authorities\" ADD FOREIGN KEY (\"store_key\", \"job_id\") REFERENCES \"cron_jobs\" (\"store_key\", \"job_id\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n"
		},
		{
			id: "cron_run_trigger_state_retirements",
			tables: ["cron_run_trigger_state_retirements"],
			indexes: [],
			dependencies: ["cron_run_receipts"],
			activation: "first-use",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"cron_run_trigger_state_retirements\" (\n  \"receipt_id\" text COLLATE \"C\" NOT NULL,\n  PRIMARY KEY (\"receipt_id\")\n);\n\nALTER TABLE \"cron_run_trigger_state_retirements\" ADD FOREIGN KEY (\"receipt_id\") REFERENCES \"cron_run_receipts\" (\"receipt_id\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n"
		},
		{
			id: "execution_identity_contexts",
			tables: ["execution_identity_contexts"],
			indexes: ["execution_identity_contexts_run_created_idx"],
			dependencies: [],
			activation: "first-use",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"execution_identity_contexts\" (\n  \"context_id\" text COLLATE \"C\" NOT NULL,\n  \"execution_id\" text COLLATE \"C\" NOT NULL,\n  \"run_id\" text COLLATE \"C\" NOT NULL,\n  \"created_at\" bigint NOT NULL,\n  \"coverage_state\" text COLLATE \"C\" NOT NULL,\n  \"context_bytes\" bigint NOT NULL,\n  \"context_json\" text COLLATE \"C\" NOT NULL,\n  PRIMARY KEY (\"context_id\"),\n  CHECK ((char_length(\"context_id\") BETWEEN 1 AND 256)),\n  CHECK ((char_length(\"execution_id\") BETWEEN 1 AND 256)),\n  CHECK ((char_length(\"run_id\") BETWEEN 1 AND 256)),\n  CHECK ((\"created_at\" >= 0)),\n  CHECK ((\"coverage_state\" IN ('attribution-only', 'unattributed', 'unknown', 'unsupported'))),\n  CHECK ((\"context_bytes\" BETWEEN 1 AND 16384)),\n  CHECK ((char_length(\"context_json\") > 0)),\n  UNIQUE (\"execution_id\"),\n  UNIQUE (\"created_at\", \"context_id\")\n);\n\nCREATE INDEX \"execution_identity_contexts_run_created_idx\" ON \"execution_identity_contexts\" ((\"run_id\") ASC NULLS FIRST, (\"created_at\") ASC NULLS FIRST, (\"execution_id\") ASC NULLS FIRST);\n"
		},
		{
			id: "mcp_oauth_pending_authorizations",
			tables: ["mcp_oauth_pending_authorizations"],
			indexes: [],
			dependencies: [],
			activation: "first-use",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"mcp_oauth_pending_authorizations\" (\n  \"state\" text COLLATE \"C\" NOT NULL,\n  \"store_key\" text COLLATE \"C\" NOT NULL,\n  \"create_time\" bigint NOT NULL,\n  PRIMARY KEY (\"state\")\n);\n"
		},
		{
			id: "node_worker_launch_containers",
			tables: ["node_worker_launch_containers"],
			indexes: [],
			dependencies: [],
			activation: "first-use",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"node_worker_launch_containers\" (\n  \"launch_id\" text COLLATE \"C\" NOT NULL,\n  \"container_json\" text COLLATE \"C\",\n  PRIMARY KEY (\"launch_id\")\n);\n"
		},
		{
			id: "node_worker_launch_boots",
			tables: ["node_worker_launch_boots"],
			indexes: [],
			dependencies: ["node_worker_launches"],
			activation: "first-use",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"node_worker_launch_boots\" (\n  \"launch_id\" text COLLATE \"C\" NOT NULL,\n  \"boot_id\" text COLLATE \"C\",\n  PRIMARY KEY (\"launch_id\"),\n  CHECK (\"boot_id\" IS NULL OR (char_length(\"boot_id\") BETWEEN 1 AND 128))\n);\n\nALTER TABLE \"node_worker_launch_boots\" ADD FOREIGN KEY (\"launch_id\") REFERENCES \"node_worker_launches\" (\"launch_id\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n"
		},
		{
			id: "node_worker_launch_cleanup",
			tables: ["node_worker_launch_cleanup"],
			indexes: [],
			dependencies: ["node_worker_launches"],
			activation: "first-use",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"node_worker_launch_cleanup\" (\n  \"launch_id\" text COLLATE \"C\" NOT NULL,\n  \"cleanup_mode\" text COLLATE \"C\" NOT NULL,\n  \"lineage_settled\" bigint,\n  PRIMARY KEY (\"launch_id\"),\n  CHECK ((\"cleanup_mode\" IN ('process-group', 'owned-anchor'))),\n  CHECK (\"lineage_settled\" IS NULL OR (\"lineage_settled\" = 1))\n);\n\nALTER TABLE \"node_worker_launch_cleanup\" ADD FOREIGN KEY (\"launch_id\") REFERENCES \"node_worker_launches\" (\"launch_id\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n"
		},
		{
			id: "node_worker_launch_process_scopes",
			tables: ["node_worker_launch_process_scopes"],
			indexes: [],
			dependencies: ["node_worker_launches"],
			activation: "first-use",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"node_worker_launch_process_scopes\" (\n  \"launch_id\" text COLLATE \"C\" NOT NULL,\n  \"scope_kind\" text COLLATE \"C\" NOT NULL,\n  \"descendants_reaped\" bigint,\n  PRIMARY KEY (\"launch_id\"),\n  CHECK ((\"scope_kind\" = 'linux-subreaper')),\n  CHECK (\"descendants_reaped\" IS NULL OR (\"descendants_reaped\" = 1))\n);\n\nALTER TABLE \"node_worker_launch_process_scopes\" ADD FOREIGN KEY (\"launch_id\") REFERENCES \"node_worker_launches\" (\"launch_id\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n"
		},
		{
			id: "node_worker_launches",
			tables: ["node_worker_launches"],
			indexes: ["idx_node_worker_launches_terminal_completed"],
			dependencies: [],
			activation: "first-use",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"node_worker_launches\" (\n  \"launch_id\" text COLLATE \"C\" NOT NULL,\n  \"plan_hash\" text COLLATE \"C\" NOT NULL,\n  \"gateway_namespace\" text COLLATE \"C\" NOT NULL,\n  \"environment_id\" text COLLATE \"C\" NOT NULL,\n  \"session_id\" text COLLATE \"C\" NOT NULL,\n  \"owner_epoch\" bigint NOT NULL,\n  \"placement_generation\" bigint NOT NULL,\n  \"run_id\" text COLLATE \"C\" NOT NULL,\n  \"state\" text COLLATE \"C\" NOT NULL,\n  \"supervisor_pid\" bigint NOT NULL,\n  \"supervisor_start_time\" bigint NOT NULL,\n  \"worker_pid\" bigint,\n  \"worker_start_time\" bigint,\n  \"result_json\" text COLLATE \"C\",\n  \"error_text\" text COLLATE \"C\",\n  \"completed_at_ms\" bigint,\n  \"created_at_ms\" bigint NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"launch_id\"),\n  CHECK ((char_length(\"launch_id\") BETWEEN 1 AND 256) AND (\"launch_id\" IS NOT NULL OR NULL)),\n  CHECK ((char_length(\"plan_hash\") = 64) AND (\"plan_hash\" COLLATE \"C\" !~ '\\A.*[^0-9a-f].*\\Z')),\n  CHECK ((char_length(\"gateway_namespace\") BETWEEN 1 AND 128) AND (\"gateway_namespace\" COLLATE \"C\" !~ '\\A.*[^A-Za-z0-9._-].*\\Z') AND (\"gateway_namespace\" COLLATE \"C\" ~ '\\A[A-Za-z0-9].*\\Z')),\n  CHECK ((char_length(\"environment_id\") BETWEEN 1 AND 256) AND (\"environment_id\" IS NOT NULL OR NULL)),\n  CHECK ((char_length(\"session_id\") BETWEEN 1 AND 256) AND (\"session_id\" IS NOT NULL OR NULL)),\n  CHECK ((\"owner_epoch\" BETWEEN 1 AND 9007199254740991)),\n  CHECK ((\"placement_generation\" BETWEEN 0 AND 9007199254740991)),\n  CHECK ((char_length(\"run_id\") BETWEEN 1 AND 256) AND (\"run_id\" IS NOT NULL OR NULL)),\n  CHECK ((\"state\" IN ('pending', 'running', 'completed', 'failed', 'interrupted', 'cancelled'))),\n  CHECK ((\"supervisor_pid\" BETWEEN 1 AND 2147483647)),\n  CHECK ((\"supervisor_start_time\" BETWEEN 0 AND 9007199254740991)),\n  CHECK (\"worker_pid\" IS NULL OR (\"worker_pid\" BETWEEN 1 AND 2147483647)),\n  CHECK (\"worker_start_time\" IS NULL OR (\"worker_start_time\" BETWEEN 0 AND 9007199254740991)),\n  CHECK (\"result_json\" IS NULL OR ((octet_length(convert_to(\"result_json\", 'UTF8')) BETWEEN 1 AND 65536) AND (\"result_json\" IS NOT NULL OR NULL) AND (\"result_json\" IS JSON))),\n  CHECK (\"error_text\" IS NULL OR ((octet_length(convert_to(\"error_text\", 'UTF8')) BETWEEN 1 AND 4096) AND (\"error_text\" IS NOT NULL OR NULL) AND (strpos(\"error_text\", '\n') = 0) AND (strpos(\"error_text\", '\r') = 0))),\n  CHECK (\"completed_at_ms\" IS NULL OR (\"completed_at_ms\" BETWEEN 0 AND 9007199254740991)),\n  CHECK ((\"created_at_ms\" BETWEEN 0 AND 9007199254740991)),\n  CHECK ((\"updated_at_ms\" BETWEEN \"created_at_ms\" AND 9007199254740991)),\n  CHECK (((\"worker_pid\" IS NULL) = (\"worker_start_time\" IS NULL))),\n  CHECK (((\"state\" = 'pending') AND \"worker_pid\" IS NULL AND \"result_json\" IS NULL AND \"error_text\" IS NULL AND \"completed_at_ms\" IS NULL) OR ((\"state\" = 'running') AND \"worker_pid\" IS NOT NULL AND \"result_json\" IS NULL AND \"error_text\" IS NULL AND \"completed_at_ms\" IS NULL) OR ((\"state\" = 'completed') AND \"result_json\" IS NOT NULL AND \"error_text\" IS NULL AND (\"completed_at_ms\" BETWEEN \"created_at_ms\" AND \"updated_at_ms\")) OR ((\"state\" IN ('failed', 'interrupted', 'cancelled')) AND \"result_json\" IS NULL AND \"error_text\" IS NOT NULL AND (\"completed_at_ms\" BETWEEN \"created_at_ms\" AND \"updated_at_ms\")))\n);\n\nCREATE INDEX \"idx_node_worker_launches_terminal_completed\" ON \"node_worker_launches\" ((\"completed_at_ms\") ASC NULLS FIRST, (\"launch_id\") ASC NULLS FIRST) WHERE \"completed_at_ms\" IS NOT NULL;\n"
		},
		{
			id: "node_worker_prepared_workspaces",
			tables: ["node_worker_prepared_workspaces"],
			indexes: [],
			dependencies: [],
			activation: "first-use",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"node_worker_prepared_workspaces\" (\n  \"preparation_key\" text COLLATE \"C\" NOT NULL,\n  \"cache_key\" text COLLATE \"C\" NOT NULL,\n  \"gateway_namespace\" text COLLATE \"C\" NOT NULL,\n  \"workspace_dir\" text COLLATE \"C\" NOT NULL,\n  \"home_dir\" text COLLATE \"C\" NOT NULL,\n  \"source_manifest_ref\" text COLLATE \"C\" NOT NULL,\n  \"prepared_manifest_ref\" text COLLATE \"C\" NOT NULL,\n  \"state\" text COLLATE \"C\" NOT NULL,\n  \"environment_id\" text COLLATE \"C\" NOT NULL,\n  \"session_id\" text COLLATE \"C\",\n  \"session_key\" text COLLATE \"C\",\n  \"owner_epoch\" bigint,\n  \"created_at_ms\" bigint NOT NULL,\n  \"bound_at_ms\" bigint,\n  \"retired_at_ms\" bigint,\n  PRIMARY KEY (\"preparation_key\"),\n  CHECK ((char_length(\"preparation_key\") = 64) AND (\"preparation_key\" COLLATE \"C\" !~ '\\A.*[^0-9a-f].*\\Z')),\n  CHECK ((char_length(\"cache_key\") = 64) AND (\"cache_key\" COLLATE \"C\" !~ '\\A.*[^0-9a-f].*\\Z')),\n  CHECK ((char_length(\"gateway_namespace\") > 0)),\n  CHECK ((char_length(\"workspace_dir\") > 0)),\n  CHECK ((char_length(\"home_dir\") > 0)),\n  CHECK ((char_length(\"source_manifest_ref\") = 71) AND (substr(\"source_manifest_ref\", 1, 7) = 'sha256:') AND (substr(\"source_manifest_ref\", 8) COLLATE \"C\" !~ '\\A.*[^0-9a-f].*\\Z')),\n  CHECK ((char_length(\"prepared_manifest_ref\") = 71) AND (substr(\"prepared_manifest_ref\", 1, 7) = 'sha256:') AND (substr(\"prepared_manifest_ref\", 8) COLLATE \"C\" !~ '\\A.*[^0-9a-f].*\\Z')),\n  CHECK ((\"state\" IN ('available', 'bound', 'retiring', 'retired'))),\n  CHECK ((char_length(\"environment_id\") > 0)),\n  CHECK ((\"owner_epoch\" BETWEEN 1 AND 9007199254740991)),\n  CHECK ((\"created_at_ms\" BETWEEN 0 AND 9007199254740991)),\n  CHECK ((\"bound_at_ms\" BETWEEN \"created_at_ms\" AND 9007199254740991)),\n  CHECK ((\"retired_at_ms\" BETWEEN coalesce(\"bound_at_ms\", \"created_at_ms\") AND 9007199254740991)),\n  CHECK ((\"session_id\" IS NULL AND \"session_key\" IS NULL AND \"owner_epoch\" IS NULL AND \"bound_at_ms\" IS NULL) OR (\"session_id\" IS NOT NULL AND (char_length(\"session_id\") > 0) AND \"session_key\" IS NOT NULL AND (char_length(\"session_key\") > 0) AND \"owner_epoch\" IS NOT NULL AND \"bound_at_ms\" IS NOT NULL)),\n  CHECK (((\"state\" = 'available') AND \"bound_at_ms\" IS NULL AND \"retired_at_ms\" IS NULL) OR ((\"state\" = 'bound') AND \"bound_at_ms\" IS NOT NULL AND \"retired_at_ms\" IS NULL) OR ((\"state\" = 'retiring') AND \"retired_at_ms\" IS NULL) OR ((\"state\" = 'retired') AND \"retired_at_ms\" IS NOT NULL)),\n  UNIQUE (\"workspace_dir\")\n);\n"
		},
		{
			id: "node_worker_turns",
			tables: ["node_worker_turns"],
			indexes: ["idx_node_worker_turns_terminal_completed", "idx_node_worker_turns_active_owner"],
			dependencies: ["node_worker_launches"],
			activation: "first-use",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"node_worker_turns\" (\n  \"turn_id\" text COLLATE \"C\" NOT NULL,\n  \"owner_launch_id\" text COLLATE \"C\" NOT NULL,\n  \"plan_hash\" text COLLATE \"C\" NOT NULL,\n  \"run_id\" text COLLATE \"C\" NOT NULL,\n  \"state\" text COLLATE \"C\" NOT NULL,\n  \"result_json\" text COLLATE \"C\",\n  \"error_text\" text COLLATE \"C\",\n  \"completed_at_ms\" bigint,\n  \"created_at_ms\" bigint NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"turn_id\"),\n  CHECK ((char_length(\"turn_id\") BETWEEN 1 AND 256) AND (\"turn_id\" IS NOT NULL OR NULL)),\n  CHECK ((char_length(\"plan_hash\") = 64) AND (\"plan_hash\" COLLATE \"C\" !~ '\\A.*[^0-9a-f].*\\Z')),\n  CHECK ((char_length(\"run_id\") BETWEEN 1 AND 256) AND (\"run_id\" IS NOT NULL OR NULL)),\n  CHECK ((\"state\" IN ('running', 'completed', 'failed', 'interrupted', 'cancelled'))),\n  CHECK (\"result_json\" IS NULL OR ((octet_length(convert_to(\"result_json\", 'UTF8')) BETWEEN 1 AND 65536) AND (\"result_json\" IS NOT NULL OR NULL) AND (\"result_json\" IS JSON))),\n  CHECK (\"error_text\" IS NULL OR ((octet_length(convert_to(\"error_text\", 'UTF8')) BETWEEN 1 AND 4096) AND (\"error_text\" IS NOT NULL OR NULL) AND (strpos(\"error_text\", '\n') = 0) AND (strpos(\"error_text\", '\r') = 0))),\n  CHECK (\"completed_at_ms\" IS NULL OR (\"completed_at_ms\" BETWEEN 0 AND 9007199254740991)),\n  CHECK ((\"created_at_ms\" BETWEEN 0 AND 9007199254740991)),\n  CHECK ((\"updated_at_ms\" BETWEEN \"created_at_ms\" AND 9007199254740991)),\n  CHECK (((\"state\" = 'running') AND \"result_json\" IS NULL AND \"error_text\" IS NULL AND \"completed_at_ms\" IS NULL) OR ((\"state\" = 'completed') AND \"result_json\" IS NOT NULL AND \"error_text\" IS NULL AND (\"completed_at_ms\" BETWEEN \"created_at_ms\" AND \"updated_at_ms\")) OR ((\"state\" IN ('failed', 'interrupted', 'cancelled')) AND \"result_json\" IS NULL AND \"error_text\" IS NOT NULL AND (\"completed_at_ms\" BETWEEN \"created_at_ms\" AND \"updated_at_ms\")))\n);\n\nCREATE UNIQUE INDEX \"idx_node_worker_turns_active_owner\" ON \"node_worker_turns\" ((\"owner_launch_id\") ASC NULLS FIRST) WHERE (\"state\" = 'running');\n\nCREATE INDEX \"idx_node_worker_turns_terminal_completed\" ON \"node_worker_turns\" ((\"completed_at_ms\") ASC NULLS FIRST, (\"turn_id\") ASC NULLS FIRST) WHERE \"completed_at_ms\" IS NOT NULL;\n\nALTER TABLE \"node_worker_turns\" ADD FOREIGN KEY (\"owner_launch_id\") REFERENCES \"node_worker_launches\" (\"launch_id\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n"
		},
		{
			id: "operator_approval_execution_identities",
			tables: ["operator_approval_execution_identities"],
			indexes: [],
			dependencies: [],
			activation: "first-use",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"operator_approval_execution_identities\" (\n  \"approval_id\" text COLLATE \"C\" NOT NULL,\n  \"source_context_id\" text COLLATE \"C\" NOT NULL,\n  \"source_execution_id\" text COLLATE \"C\" NOT NULL,\n  PRIMARY KEY (\"approval_id\"),\n  CHECK ((char_length(\"source_context_id\") BETWEEN 1 AND 256) AND (\"source_context_id\" = btrim(\"source_context_id\"))),\n  CHECK ((char_length(\"source_execution_id\") BETWEEN 1 AND 256) AND (\"source_execution_id\" = btrim(\"source_execution_id\")))\n);\n\nALTER TABLE \"operator_approval_execution_identities\" ADD FOREIGN KEY (\"approval_id\") REFERENCES \"operator_approvals\" (\"approval_id\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n"
		},
		{
			id: "web_push_approval_deliveries",
			tables: ["web_push_approval_deliveries"],
			indexes: ["idx_web_push_approval_deliveries_subscription"],
			dependencies: [],
			activation: "first-use",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"web_push_approval_deliveries\" (\n  \"approval_id\" text COLLATE \"C\" NOT NULL,\n  \"subscription_id\" text COLLATE \"C\" NOT NULL,\n  \"device_id\" text COLLATE \"C\" NOT NULL,\n  \"user_profile_id\" text COLLATE \"C\",\n  \"prepared_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"approval_id\", \"subscription_id\")\n);\n\nCREATE INDEX \"idx_web_push_approval_deliveries_subscription\" ON \"web_push_approval_deliveries\" ((\"subscription_id\") ASC NULLS FIRST, (\"approval_id\") ASC NULLS FIRST);\n\nALTER TABLE \"web_push_approval_deliveries\" ADD FOREIGN KEY (\"subscription_id\") REFERENCES \"web_push_subscriptions\" (\"subscription_id\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n\nALTER TABLE \"web_push_approval_deliveries\" ADD FOREIGN KEY (\"approval_id\") REFERENCES \"operator_approvals\" (\"approval_id\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n"
		},
		{
			id: "execution_decision_facts",
			tables: ["execution_decision_facts"],
			indexes: [
				"execution_decision_facts_cursor_id_idx",
				"execution_decision_facts_context_occurred_idx",
				"execution_decision_facts_run_occurred_idx"
			],
			dependencies: [],
			activation: "first-use",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"execution_decision_facts\" (\n  \"cursor_id\" bigint NOT NULL,\n  \"receipt_id\" text COLLATE \"C\" NOT NULL,\n  \"context_id\" text COLLATE \"C\" NOT NULL,\n  \"execution_id\" text COLLATE \"C\" NOT NULL,\n  \"run_id\" text COLLATE \"C\" NOT NULL,\n  \"action_id\" text COLLATE \"C\",\n  \"action_family\" text COLLATE \"C\" NOT NULL,\n  \"decision_outcome\" text COLLATE \"C\" NOT NULL,\n  \"coverage_state\" text COLLATE \"C\" NOT NULL,\n  \"reason_code\" text COLLATE \"C\" NOT NULL,\n  \"owner\" text COLLATE \"C\" NOT NULL,\n  \"source_ref\" text COLLATE \"C\" NOT NULL,\n  \"occurred_at\" bigint NOT NULL,\n  \"receipt_bytes\" bigint NOT NULL,\n  \"receipt_json\" text COLLATE \"C\" NOT NULL,\n  PRIMARY KEY (\"receipt_id\"),\n  CHECK ((char_length(\"receipt_id\") BETWEEN 1 AND 256)),\n  CHECK ((char_length(\"context_id\") BETWEEN 1 AND 256)),\n  CHECK ((char_length(\"execution_id\") BETWEEN 1 AND 256)),\n  CHECK ((char_length(\"run_id\") BETWEEN 1 AND 256)),\n  CHECK (\"action_id\" IS NULL OR (char_length(\"action_id\") BETWEEN 1 AND 256)),\n  CHECK ((char_length(\"action_family\") BETWEEN 1 AND 256)),\n  CHECK ((\"decision_outcome\" IN ('allowed', 'denied', 'not-applicable', 'unknown'))),\n  CHECK ((\"coverage_state\" IN ('enforced', 'attribution-only', 'unattributed', 'unknown', 'unsupported'))),\n  CHECK ((char_length(\"reason_code\") BETWEEN 1 AND 256)),\n  CHECK ((char_length(\"owner\") BETWEEN 1 AND 256)),\n  CHECK ((char_length(\"source_ref\") BETWEEN 1 AND 256)),\n  CHECK ((\"occurred_at\" >= 0)),\n  CHECK ((\"receipt_bytes\" BETWEEN 1 AND 16384)),\n  CHECK ((char_length(\"receipt_json\") > 0)),\n  UNIQUE (\"occurred_at\", \"receipt_id\")\n);\n\nCREATE INDEX \"execution_decision_facts_context_occurred_idx\" ON \"execution_decision_facts\" ((\"context_id\") ASC NULLS FIRST, (\"occurred_at\") ASC NULLS FIRST, (\"receipt_id\") ASC NULLS FIRST);\n\nCREATE UNIQUE INDEX \"execution_decision_facts_cursor_id_idx\" ON \"execution_decision_facts\" ((\"cursor_id\") ASC NULLS FIRST);\n\nCREATE INDEX \"execution_decision_facts_run_occurred_idx\" ON \"execution_decision_facts\" ((\"run_id\") ASC NULLS FIRST, (\"occurred_at\") ASC NULLS FIRST, (\"receipt_id\") ASC NULLS FIRST);\n"
		},
		{
			id: "execution_owner_lifecycle_bindings",
			tables: ["execution_owner_lifecycle_bindings"],
			indexes: [],
			dependencies: [],
			activation: "first-use",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"execution_owner_lifecycle_bindings\" (\n  \"owner_kind\" text COLLATE \"C\" NOT NULL,\n  \"owner_id\" text COLLATE \"C\" NOT NULL,\n  \"context_id\" text COLLATE \"C\" NOT NULL,\n  \"execution_id\" text COLLATE \"C\" NOT NULL,\n  PRIMARY KEY (\"owner_kind\", \"owner_id\")\n);\n"
		},
		{
			id: "outbound_message_execution_bindings",
			tables: ["outbound_message_execution_bindings"],
			indexes: ["outbound_message_execution_bindings_execution_event_idx"],
			dependencies: [],
			activation: "first-use",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"outbound_message_execution_bindings\" (\n  \"event_id\" text COLLATE \"C\" NOT NULL,\n  \"context_id\" text COLLATE \"C\" NOT NULL,\n  \"execution_id\" text COLLATE \"C\" NOT NULL,\n  \"run_id\" text COLLATE \"C\" NOT NULL,\n  PRIMARY KEY (\"event_id\"),\n  CHECK ((char_length(\"context_id\") BETWEEN 1 AND 256)),\n  CHECK ((char_length(\"execution_id\") BETWEEN 1 AND 256)),\n  CHECK ((char_length(\"run_id\") BETWEEN 1 AND 256))\n);\n\nCREATE INDEX \"outbound_message_execution_bindings_execution_event_idx\" ON \"outbound_message_execution_bindings\" ((\"context_id\") ASC NULLS FIRST, (\"execution_id\") ASC NULLS FIRST, (\"run_id\") ASC NULLS FIRST, (\"event_id\") ASC NULLS FIRST);\n\nALTER TABLE \"outbound_message_execution_bindings\" ADD FOREIGN KEY (\"event_id\") REFERENCES \"audit_events\" (\"event_id\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n"
		},
		{
			id: "outbound_message_progress",
			tables: ["outbound_message_progress"],
			indexes: ["outbound_message_progress_occurred_idx", "outbound_message_progress_run_occurred_idx"],
			dependencies: [],
			activation: "first-use",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"outbound_message_progress\" (\n  \"sequence\" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,\n  \"progress_id\" text COLLATE \"C\" NOT NULL,\n  \"source_id\" text COLLATE \"C\" NOT NULL,\n  \"source_sequence\" bigint NOT NULL,\n  \"schema_version\" bigint NOT NULL,\n  \"occurred_at\" bigint NOT NULL,\n  \"action\" text COLLATE \"C\" NOT NULL,\n  \"outcome\" text COLLATE \"C\" NOT NULL,\n  \"actor_type\" text COLLATE \"C\" NOT NULL,\n  \"actor_id\" text COLLATE \"C\" NOT NULL,\n  \"agent_id\" text COLLATE \"C\",\n  \"run_id\" text COLLATE \"C\",\n  \"context_id\" text COLLATE \"C\",\n  \"execution_id\" text COLLATE \"C\",\n  \"channel\" text COLLATE \"C\" NOT NULL,\n  \"conversation_kind\" text COLLATE \"C\" NOT NULL,\n  \"duration_ms\" bigint,\n  \"account_ref\" text COLLATE \"C\",\n  \"conversation_ref\" text COLLATE \"C\",\n  \"target_ref\" text COLLATE \"C\",\n  PRIMARY KEY (\"sequence\"),\n  CHECK ((char_length(\"progress_id\") BETWEEN 1 AND 256)),\n  CHECK ((char_length(\"source_id\") BETWEEN 1 AND 512)),\n  CHECK ((\"source_sequence\" >= 1)),\n  CHECK ((\"schema_version\" = 1)),\n  CHECK ((\"occurred_at\" >= 0)),\n  CHECK ((\"action\" IN ('message.outbound.queued', 'message.outbound.platform-started'))),\n  CHECK ((\"outcome\" IN ('queued', 'platform_started'))),\n  CHECK ((\"actor_type\" IN ('agent', 'system'))),\n  CHECK ((char_length(\"actor_id\") BETWEEN 1 AND 256)),\n  CHECK (\"agent_id\" IS NULL OR (char_length(\"agent_id\") BETWEEN 1 AND 256)),\n  CHECK (\"run_id\" IS NULL OR (char_length(\"run_id\") BETWEEN 1 AND 256)),\n  CHECK ((char_length(\"channel\") BETWEEN 1 AND 256)),\n  CHECK ((\"conversation_kind\" IN ('direct', 'group', 'channel', 'unknown'))),\n  CHECK (\"duration_ms\" IS NULL OR (\"duration_ms\" >= 0)),\n  UNIQUE (\"progress_id\"),\n  UNIQUE (\"source_id\"),\n  UNIQUE (\"occurred_at\", \"progress_id\")\n);\n\nCREATE INDEX \"outbound_message_progress_occurred_idx\" ON \"outbound_message_progress\" ((\"occurred_at\") ASC NULLS FIRST, (\"sequence\") ASC NULLS FIRST);\n\nCREATE INDEX \"outbound_message_progress_run_occurred_idx\" ON \"outbound_message_progress\" ((\"run_id\") ASC NULLS FIRST, (\"occurred_at\") ASC NULLS FIRST, (\"sequence\") ASC NULLS FIRST);\n"
		},
		{
			id: "agent_provenance",
			tables: ["agent_provenance"],
			indexes: [],
			dependencies: [],
			activation: "version-additive",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"agent_provenance\" (\n  \"agent_id\" text COLLATE \"C\" NOT NULL,\n  \"created_via\" text COLLATE \"C\" NOT NULL,\n  \"creator_agent_id\" text COLLATE \"C\",\n  \"created_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"agent_id\"),\n  CHECK ((\"created_via\" IN ('operator', 'agent', 'claw')))\n);\n"
		},
		{
			id: "cron_run_receipts",
			tables: ["cron_run_receipts"],
			indexes: [
				"cron_run_receipts_cursor_id_idx",
				"idx_cron_run_receipts_active_job",
				"idx_cron_run_receipts_job_history"
			],
			dependencies: [],
			activation: "version-additive",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"cron_run_receipts\" (\n  \"cursor_id\" bigint NOT NULL,\n  \"receipt_id\" text COLLATE \"C\" NOT NULL,\n  \"store_key\" text COLLATE \"C\" NOT NULL,\n  \"job_id\" text COLLATE \"C\" NOT NULL,\n  \"config_revision\" text COLLATE \"C\" NOT NULL,\n  \"agent_id\" text COLLATE \"C\" NOT NULL,\n  \"request_run_id\" text COLLATE \"C\",\n  \"delivery_attempt_state\" text COLLATE \"C\" NOT NULL DEFAULT 'unknown',\n  \"status\" text COLLATE \"C\" NOT NULL,\n  \"owner_pid\" bigint NOT NULL,\n  \"owner_start_time\" bigint,\n  \"started_at_ms\" bigint NOT NULL,\n  \"finished_at_ms\" bigint,\n  \"error_text\" text COLLATE \"C\",\n  PRIMARY KEY (\"receipt_id\"),\n  CHECK ((\"delivery_attempt_state\" IN ('unknown', 'not-started', 'started'))),\n  CHECK ((\"status\" IN ('running', 'ok', 'error', 'skipped', 'interrupted', 'superseded'))),\n  CHECK (((\"status\" = 'running') AND \"finished_at_ms\" IS NULL) OR ((\"status\" != 'running') AND \"finished_at_ms\" IS NOT NULL))\n);\n\nCREATE UNIQUE INDEX \"cron_run_receipts_cursor_id_idx\" ON \"cron_run_receipts\" ((\"cursor_id\") ASC NULLS FIRST);\n\nCREATE UNIQUE INDEX \"idx_cron_run_receipts_active_job\" ON \"cron_run_receipts\" ((\"store_key\") ASC NULLS FIRST, (\"job_id\") ASC NULLS FIRST) WHERE (\"status\" = 'running');\n\nCREATE INDEX \"idx_cron_run_receipts_job_history\" ON \"cron_run_receipts\" ((\"store_key\") ASC NULLS FIRST, (\"job_id\") ASC NULLS FIRST, (\"started_at_ms\") DESC NULLS LAST, (\"receipt_id\") DESC NULLS LAST);\n"
		},
		{
			id: "config_revision_keys",
			tables: ["config_revision_keys"],
			indexes: [],
			dependencies: [],
			activation: "version-additive",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"config_revision_keys\" (\n  \"id\" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,\n  \"hmac_key\" bytea NOT NULL,\n  PRIMARY KEY (\"id\"),\n  CHECK ((\"id\" = 1)),\n  CHECK ((octet_length(\"hmac_key\") = 32))\n);\n"
		},
		{
			id: "secret_store_entries",
			tables: ["secret_store_entries"],
			indexes: ["secret_store_entries_live_idx"],
			dependencies: [],
			activation: "version-additive",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"secret_store_entries\" (\n  \"scope_kind\" text COLLATE \"C\" NOT NULL,\n  \"scope_id\" text COLLATE \"C\" NOT NULL,\n  \"name\" text COLLATE \"C\" NOT NULL,\n  \"value\" text COLLATE \"C\" NOT NULL,\n  \"kind\" text COLLATE \"C\" NOT NULL,\n  \"created_at_ms\" bigint NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  \"updated_by\" text COLLATE \"C\",\n  \"deleted_at_ms\" bigint,\n  \"allowed_hosts\" text COLLATE \"C\",\n  PRIMARY KEY (\"scope_kind\", \"scope_id\", \"name\"),\n  CHECK ((\"scope_kind\" IN ('team', 'identity'))),\n  CHECK ((\"kind\" IN ('secret', 'env'))),\n  CHECK ((\"created_at_ms\" >= 0)),\n  CHECK ((\"updated_at_ms\" >= 0)),\n  CHECK (((\"scope_kind\" = 'team') AND (\"scope_id\" = '')) OR ((\"scope_kind\" = 'identity') AND (char_length(\"scope_id\") > 0)))\n);\n\nCREATE INDEX \"secret_store_entries_live_idx\" ON \"secret_store_entries\" ((\"scope_kind\") ASC NULLS FIRST, (\"scope_id\") ASC NULLS FIRST, (\"name\") ASC NULLS FIRST) WHERE \"deleted_at_ms\" IS NULL;\n"
		},
		{
			id: "projects",
			tables: ["projects"],
			indexes: [],
			dependencies: [],
			activation: "version-additive",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"projects\" (\n  \"id\" text COLLATE \"C\" NOT NULL,\n  \"display_name\" text COLLATE \"C\" NOT NULL,\n  \"repo_root\" text COLLATE \"C\" NOT NULL,\n  \"origin_url\" text COLLATE \"C\",\n  \"source\" text COLLATE \"C\" NOT NULL,\n  \"created_at_ms\" bigint NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"id\"),\n  CHECK ((\"source\" IN ('registered', 'cloned')))\n);\n"
		},
		{
			id: "worktree_templates",
			tables: ["worktree_templates"],
			indexes: [],
			dependencies: [],
			activation: "version-additive",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"worktree_templates\" (\n  \"cache_key\" text COLLATE \"C\" NOT NULL,\n  \"id\" text COLLATE \"C\" NOT NULL,\n  \"repo_root\" text COLLATE \"C\" NOT NULL,\n  \"common_dir\" text COLLATE \"C\" NOT NULL,\n  \"worktree_root\" text COLLATE \"C\" NOT NULL,\n  \"path\" text COLLATE \"C\" NOT NULL,\n  \"backend\" text COLLATE \"C\" NOT NULL,\n  \"source_commit\" text COLLATE \"C\" NOT NULL,\n  \"content_key\" text COLLATE \"C\" NOT NULL,\n  \"status\" text COLLATE \"C\" NOT NULL,\n  \"created_at\" bigint NOT NULL,\n  \"last_used_at\" bigint NOT NULL,\n  PRIMARY KEY (\"cache_key\"),\n  CHECK ((\"status\" IN ('preparing', 'ready'))),\n  UNIQUE (\"id\")\n);\n"
		},
		{
			id: "user_preferences",
			tables: ["user_preferences"],
			indexes: [],
			dependencies: [],
			activation: "version-additive",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"user_preferences\" (\n  \"profile_id\" text COLLATE \"C\" NOT NULL,\n  \"pref_key\" text COLLATE \"C\" NOT NULL,\n  \"value_json\" text COLLATE \"C\" NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"profile_id\", \"pref_key\")\n);\n"
		},
		{
			id: "device_pair_setup_completions",
			tables: ["device_pair_setup_completions"],
			indexes: [],
			dependencies: [],
			activation: "version-additive",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"device_pair_setup_completions\" (\n  \"setup_id\" text COLLATE \"C\" NOT NULL,\n  \"device_id\" text COLLATE \"C\" NOT NULL,\n  \"device_name\" text COLLATE \"C\",\n  \"access\" text COLLATE \"C\" NOT NULL,\n  \"completed_at_ms\" bigint NOT NULL,\n  \"delivery_state\" text COLLATE \"C\" NOT NULL,\n  \"retain_until_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"setup_id\"),\n  CHECK ((\"delivery_state\" IN ('uncertain', 'confirmed')))\n);\n"
		},
		{
			id: "github_publication_requests",
			tables: ["github_publication_requests"],
			indexes: ["idx_github_publication_requests_pending"],
			dependencies: [],
			activation: "version-additive",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"github_publication_requests\" (\n  \"request_id\" text COLLATE \"C\" NOT NULL,\n  \"idempotency_key\" text COLLATE \"C\" NOT NULL,\n  \"request_digest\" text COLLATE \"C\" NOT NULL,\n  \"session_id\" text COLLATE \"C\" NOT NULL,\n  \"session_key\" text COLLATE \"C\" NOT NULL,\n  \"agent_id\" text COLLATE \"C\" NOT NULL,\n  \"worktree_id\" text COLLATE \"C\" NOT NULL,\n  \"repository_fingerprint\" text COLLATE \"C\" NOT NULL,\n  \"claim_id\" text COLLATE \"C\",\n  \"run_id\" text COLLATE \"C\",\n  \"environment_id\" text COLLATE \"C\",\n  \"owner_epoch\" bigint,\n  \"placement_generation\" bigint,\n  \"identity_source\" text COLLATE \"C\" NOT NULL,\n  \"identity_profile_id\" text COLLATE \"C\",\n  \"identity_account_id\" bigint NOT NULL,\n  \"identity_login\" text COLLATE \"C\" NOT NULL,\n  \"title\" text COLLATE \"C\",\n  \"body\" text COLLATE \"C\",\n  \"status\" text COLLATE \"C\" NOT NULL,\n  \"gateway_instance_id\" text COLLATE \"C\",\n  \"repository\" text COLLATE \"C\",\n  \"branch\" text COLLATE \"C\" NOT NULL,\n  \"base_branch\" text COLLATE \"C\",\n  \"source_head_commit\" text COLLATE \"C\",\n  \"source_index_tree\" text COLLATE \"C\",\n  \"workspace_tree\" text COLLATE \"C\",\n  \"head_commit\" text COLLATE \"C\",\n  \"pull_request_url\" text COLLATE \"C\",\n  \"error_code\" text COLLATE \"C\",\n  \"next_action\" text COLLATE \"C\",\n  \"created_at_ms\" bigint NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  \"reported_at_ms\" bigint,\n  PRIMARY KEY (\"request_id\"),\n  CHECK (\"owner_epoch\" IS NULL OR (\"owner_epoch\" >= 1)),\n  CHECK (\"placement_generation\" IS NULL OR (\"placement_generation\" >= 0)),\n  CHECK ((\"identity_source\" IN ('system-detected', 'system-configured', 'agent-override'))),\n  CHECK ((\"identity_account_id\" >= 1)),\n  CHECK ((\"status\" IN ('requested', 'publishing', 'published', 'failed'))),\n  CHECK ((\"claim_id\" IS NULL AND \"run_id\" IS NULL AND \"environment_id\" IS NULL AND \"owner_epoch\" IS NULL AND \"placement_generation\" IS NULL) OR (\"claim_id\" IS NOT NULL AND \"run_id\" IS NOT NULL AND \"placement_generation\" IS NOT NULL AND ((\"environment_id\" IS NULL AND \"owner_epoch\" IS NULL) OR (\"environment_id\" IS NOT NULL AND \"owner_epoch\" IS NOT NULL)))),\n  CHECK ((\"identity_source\" IS NOT DISTINCT FROM 'system-detected' AND \"identity_profile_id\" IS NULL) OR ((\"identity_source\" IN ('system-configured', 'agent-override')) AND \"identity_profile_id\" IS NOT NULL)),\n  CHECK ((\"source_head_commit\" IS NULL AND \"source_index_tree\" IS NULL AND \"workspace_tree\" IS NULL) OR (\"source_head_commit\" IS NOT NULL AND \"workspace_tree\" IS NOT NULL)),\n  CHECK ((\"status\" IS NOT DISTINCT FROM 'published' AND \"pull_request_url\" IS NOT NULL AND \"error_code\" IS NULL AND \"next_action\" IS NULL) OR (\"status\" IS NOT DISTINCT FROM 'failed' AND \"pull_request_url\" IS NULL AND \"error_code\" IS NOT NULL AND \"next_action\" IS NOT NULL) OR ((\"status\" IN ('requested', 'publishing')) AND \"pull_request_url\" IS NULL AND \"error_code\" IS NULL AND \"next_action\" IS NULL)),\n  UNIQUE (\"session_id\", \"idempotency_key\")\n);\n\nCREATE INDEX \"idx_github_publication_requests_pending\" ON \"github_publication_requests\" ((\"status\") ASC NULLS FIRST, (\"updated_at_ms\") ASC NULLS FIRST, (\"request_id\") ASC NULLS FIRST);\n"
		},
		{
			id: "device_pairing_join_codes",
			tables: ["device_pairing_join_codes"],
			indexes: [],
			dependencies: [],
			activation: "version-additive",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"device_pairing_join_codes\" (\n  \"shortcode\" text COLLATE \"C\",\n  \"payload_json\" text COLLATE \"C\",\n  \"created_at_ms\" bigint,\n  \"expires_at_ms\" bigint\n);\n"
		},
		{
			id: "skill_workshop_changes",
			tables: ["skill_workshop_changes"],
			indexes: ["skill_workshop_changes_cursor_id_idx", "idx_skill_workshop_changes_agent_time"],
			dependencies: [],
			activation: "version-additive",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"skill_workshop_changes\" (\n  \"cursor_id\" bigint NOT NULL,\n  \"change_id\" text COLLATE \"C\" NOT NULL,\n  \"agent_id\" text COLLATE \"C\" NOT NULL,\n  \"skill_name\" text COLLATE \"C\" NOT NULL,\n  \"action\" text COLLATE \"C\" NOT NULL,\n  \"actor\" text COLLATE \"C\" NOT NULL,\n  \"summary\" text COLLATE \"C\" NOT NULL,\n  \"version_id\" text COLLATE \"C\",\n  \"session_key\" text COLLATE \"C\",\n  \"run_id\" text COLLATE \"C\",\n  \"created_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"change_id\"),\n  CHECK ((\"action\" IN ('create', 'patch', 'write_file', 'remove_file', 'archive', 'restore'))),\n  CHECK ((\"actor\" IN ('agent', 'review', 'curator', 'user')))\n);\n\nCREATE INDEX \"idx_skill_workshop_changes_agent_time\" ON \"skill_workshop_changes\" ((\"agent_id\") ASC NULLS FIRST, (\"created_at_ms\") ASC NULLS FIRST);\n\nCREATE UNIQUE INDEX \"skill_workshop_changes_cursor_id_idx\" ON \"skill_workshop_changes\" ((\"cursor_id\") ASC NULLS FIRST);\n"
		},
		{
			id: "worker_environment_ssh_fallback_ports",
			tables: ["worker_environment_ssh_fallback_ports"],
			indexes: [],
			dependencies: [],
			activation: "version-additive",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"worker_environment_ssh_fallback_ports\" (\n  \"environment_id\" text COLLATE \"C\" NOT NULL,\n  \"position\" bigint NOT NULL,\n  \"port\" bigint NOT NULL,\n  PRIMARY KEY (\"environment_id\", \"position\"),\n  CHECK ((\"position\" >= 0) AND (\"position\" <= 9)),\n  CHECK ((\"port\" >= 1) AND (\"port\" <= 65535)),\n  UNIQUE (\"environment_id\", \"port\")\n);\n\nALTER TABLE \"worker_environment_ssh_fallback_ports\" ADD FOREIGN KEY (\"environment_id\") REFERENCES \"worker_environments\" (\"environment_id\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n"
		},
		{
			id: "worker_session_placement_moves",
			tables: ["worker_session_placement_moves"],
			indexes: [],
			dependencies: [],
			activation: "version-additive",
			sql: "-- Generated runtime DDL; the owner supplies search_path and the transaction.\n\nCREATE TABLE \"worker_session_placement_moves\" (\n  \"operation_id\" text COLLATE \"C\" NOT NULL,\n  \"session_id\" text COLLATE \"C\" NOT NULL,\n  \"source_generation\" bigint NOT NULL,\n  \"source_environment_id\" text COLLATE \"C\" NOT NULL,\n  \"source_owner_epoch\" bigint NOT NULL,\n  \"target_kind\" text COLLATE \"C\" NOT NULL,\n  \"target_id\" text COLLATE \"C\",\n  \"target_machine_class\" text COLLATE \"C\",\n  \"target_os\" text COLLATE \"C\",\n  \"abandon_source\" bigint,\n  \"last_error\" text COLLATE \"C\",\n  \"created_at_ms\" bigint NOT NULL,\n  \"updated_at_ms\" bigint NOT NULL,\n  PRIMARY KEY (\"operation_id\"),\n  CHECK ((\"source_generation\" >= 0)),\n  CHECK ((char_length(\"source_environment_id\") BETWEEN 1 AND 256) AND (\"source_environment_id\" = btrim(\"source_environment_id\"))),\n  CHECK ((\"source_owner_epoch\" >= 1)),\n  CHECK ((\"target_kind\" IN ('gateway', 'profile', 'device'))),\n  CHECK ((\"target_kind\" IS NOT DISTINCT FROM 'gateway' AND \"target_id\" IS NULL) OR ((\"target_kind\" IN ('profile', 'device')) AND \"target_id\" IS NOT NULL AND (char_length(\"target_id\") BETWEEN 1 AND 256) AND (\"target_id\" = btrim(\"target_id\")))),\n  UNIQUE (\"session_id\")\n);\n\nALTER TABLE \"worker_session_placement_moves\" ADD FOREIGN KEY (\"session_id\") REFERENCES \"worker_session_placements\" (\"session_id\") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;\n"
		}
	],
	expectedCatalog: [
		{
			table: "acp_replay_events",
			kind: "table",
			value: null
		},
		{
			table: "acp_replay_events",
			kind: "column",
			value: {
				name: "session_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "acp_replay_events",
			kind: "column",
			value: {
				name: "seq",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "acp_replay_events",
			kind: "column",
			value: {
				name: "at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "acp_replay_events",
			kind: "column",
			value: {
				name: "session_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "acp_replay_events",
			kind: "column",
			value: {
				name: "run_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "acp_replay_events",
			kind: "column",
			value: {
				name: "update_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "acp_replay_events",
			kind: "column",
			value: {
				name: "estimated_bytes",
				type: "bigint",
				nullable: false,
				identity: false,
				default: "0",
				position: 7
			}
		},
		{
			table: "acp_replay_events",
			kind: "primaryKey",
			value: ["session_id", "seq"]
		},
		{
			table: "acp_replay_events",
			kind: "foreignKey",
			value: {
				columns: ["session_id"],
				target: "acp_replay_sessions",
				targetColumns: ["session_id"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "acp_replay_events",
			kind: "indexes",
			value: 2
		},
		{
			table: "acp_replay_events",
			kind: "checks",
			value: 0
		},
		{
			table: "acp_replay_sessions",
			kind: "table",
			value: null
		},
		{
			table: "acp_replay_sessions",
			kind: "column",
			value: {
				name: "session_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "acp_replay_sessions",
			kind: "column",
			value: {
				name: "session_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "acp_replay_sessions",
			kind: "column",
			value: {
				name: "cwd",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "acp_replay_sessions",
			kind: "column",
			value: {
				name: "complete",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "acp_replay_sessions",
			kind: "column",
			value: {
				name: "created_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "acp_replay_sessions",
			kind: "column",
			value: {
				name: "updated_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "acp_replay_sessions",
			kind: "column",
			value: {
				name: "next_seq",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "acp_replay_sessions",
			kind: "column",
			value: {
				name: "estimated_bytes",
				type: "bigint",
				nullable: false,
				identity: false,
				default: "0",
				position: 8
			}
		},
		{
			table: "acp_replay_sessions",
			kind: "primaryKey",
			value: ["session_id"]
		},
		{
			table: "acp_replay_sessions",
			kind: "indexes",
			value: 3
		},
		{
			table: "acp_replay_sessions",
			kind: "checks",
			value: 0
		},
		{
			table: "acp_sessions",
			kind: "table",
			value: null
		},
		{
			table: "acp_sessions",
			kind: "column",
			value: {
				name: "session_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "acp_sessions",
			kind: "column",
			value: {
				name: "session_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "acp_sessions",
			kind: "column",
			value: {
				name: "backend",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "acp_sessions",
			kind: "column",
			value: {
				name: "agent",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "acp_sessions",
			kind: "column",
			value: {
				name: "runtime_session_name",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "acp_sessions",
			kind: "column",
			value: {
				name: "identity_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "acp_sessions",
			kind: "column",
			value: {
				name: "resume_agent_session_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "acp_sessions",
			kind: "column",
			value: {
				name: "resume_acpx_session_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "acp_sessions",
			kind: "column",
			value: {
				name: "mode",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "acp_sessions",
			kind: "column",
			value: {
				name: "runtime_options_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "acp_sessions",
			kind: "column",
			value: {
				name: "cwd",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "acp_sessions",
			kind: "column",
			value: {
				name: "state",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "acp_sessions",
			kind: "column",
			value: {
				name: "last_activity_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "acp_sessions",
			kind: "column",
			value: {
				name: "last_error",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "acp_sessions",
			kind: "column",
			value: {
				name: "updated_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 15
			}
		},
		{
			table: "acp_sessions",
			kind: "primaryKey",
			value: ["session_key"]
		},
		{
			table: "acp_sessions",
			kind: "indexes",
			value: 5
		},
		{
			table: "acp_sessions",
			kind: "checks",
			value: 0
		},
		{
			table: "agent_database_leases",
			kind: "table",
			value: null
		},
		{
			table: "agent_database_leases",
			kind: "column",
			value: {
				name: "lease_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "agent_database_leases",
			kind: "column",
			value: {
				name: "agent_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "agent_database_leases",
			kind: "column",
			value: {
				name: "path",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "agent_database_leases",
			kind: "column",
			value: {
				name: "owner_pid",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "agent_database_leases",
			kind: "column",
			value: {
				name: "owner_start_time",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "agent_database_leases",
			kind: "column",
			value: {
				name: "opened_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "agent_database_leases",
			kind: "column",
			value: {
				name: "provenance",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "agent_database_leases",
			kind: "primaryKey",
			value: ["lease_id"]
		},
		{
			table: "agent_database_leases",
			kind: "indexes",
			value: 1
		},
		{
			table: "agent_database_leases",
			kind: "checks",
			value: 0
		},
		{
			table: "agent_databases",
			kind: "table",
			value: null
		},
		{
			table: "agent_databases",
			kind: "column",
			value: {
				name: "agent_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "agent_databases",
			kind: "column",
			value: {
				name: "path",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "agent_databases",
			kind: "column",
			value: {
				name: "schema_version",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "agent_databases",
			kind: "column",
			value: {
				name: "last_seen_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "agent_databases",
			kind: "column",
			value: {
				name: "size_bytes",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "agent_databases",
			kind: "primaryKey",
			value: ["agent_id", "path"]
		},
		{
			table: "agent_databases",
			kind: "indexes",
			value: 1
		},
		{
			table: "agent_databases",
			kind: "checks",
			value: 0
		},
		{
			table: "agent_deletion_journal",
			kind: "table",
			value: null
		},
		{
			table: "agent_deletion_journal",
			kind: "column",
			value: {
				name: "agent_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "agent_deletion_journal",
			kind: "column",
			value: {
				name: "operation_id",
				type: "text",
				nullable: false,
				identity: false,
				default: "''",
				position: 2
			}
		},
		{
			table: "agent_deletion_journal",
			kind: "column",
			value: {
				name: "phase",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "agent_deletion_journal",
			kind: "column",
			value: {
				name: "agent_dir",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "agent_deletion_journal",
			kind: "column",
			value: {
				name: "workspace_dir",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "agent_deletion_journal",
			kind: "column",
			value: {
				name: "sessions_dir",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "agent_deletion_journal",
			kind: "column",
			value: {
				name: "database_paths_json",
				type: "text",
				nullable: false,
				identity: false,
				default: "'[]'",
				position: 7
			}
		},
		{
			table: "agent_deletion_journal",
			kind: "column",
			value: {
				name: "cleanup_paths_json",
				type: "text",
				nullable: false,
				identity: false,
				default: "'[]'",
				position: 8
			}
		},
		{
			table: "agent_deletion_journal",
			kind: "column",
			value: {
				name: "created_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "agent_deletion_journal",
			kind: "column",
			value: {
				name: "cleanup_completed",
				type: "bigint",
				nullable: false,
				identity: false,
				default: "0",
				position: 10
			}
		},
		{
			table: "agent_deletion_journal",
			kind: "column",
			value: {
				name: "delete_files",
				type: "bigint",
				nullable: false,
				identity: false,
				default: "1",
				position: 11
			}
		},
		{
			table: "agent_deletion_journal",
			kind: "primaryKey",
			value: ["agent_id"]
		},
		{
			table: "agent_deletion_journal",
			kind: "indexes",
			value: 1
		},
		{
			table: "agent_deletion_journal",
			kind: "checks",
			value: 0
		},
		{
			table: "agent_provenance",
			kind: "table",
			value: null
		},
		{
			table: "agent_provenance",
			kind: "column",
			value: {
				name: "agent_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "agent_provenance",
			kind: "column",
			value: {
				name: "created_via",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "agent_provenance",
			kind: "column",
			value: {
				name: "creator_agent_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "agent_provenance",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "agent_provenance",
			kind: "primaryKey",
			value: ["agent_id"]
		},
		{
			table: "agent_provenance",
			kind: "indexes",
			value: 1
		},
		{
			table: "agent_provenance",
			kind: "checks",
			value: 1
		},
		{
			table: "apns_registration_tombstones",
			kind: "table",
			value: null
		},
		{
			table: "apns_registration_tombstones",
			kind: "column",
			value: {
				name: "node_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "apns_registration_tombstones",
			kind: "column",
			value: {
				name: "deleted_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "apns_registration_tombstones",
			kind: "primaryKey",
			value: ["node_id"]
		},
		{
			table: "apns_registration_tombstones",
			kind: "indexes",
			value: 1
		},
		{
			table: "apns_registration_tombstones",
			kind: "checks",
			value: 0
		},
		{
			table: "apns_registrations",
			kind: "table",
			value: null
		},
		{
			table: "apns_registrations",
			kind: "column",
			value: {
				name: "node_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "apns_registrations",
			kind: "column",
			value: {
				name: "transport",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "apns_registrations",
			kind: "column",
			value: {
				name: "token",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "apns_registrations",
			kind: "column",
			value: {
				name: "relay_handle",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "apns_registrations",
			kind: "column",
			value: {
				name: "send_grant",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "apns_registrations",
			kind: "column",
			value: {
				name: "installation_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "apns_registrations",
			kind: "column",
			value: {
				name: "relay_origin",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "apns_registrations",
			kind: "column",
			value: {
				name: "topic",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "apns_registrations",
			kind: "column",
			value: {
				name: "environment",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "apns_registrations",
			kind: "column",
			value: {
				name: "distribution",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "apns_registrations",
			kind: "column",
			value: {
				name: "token_debug_suffix",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "apns_registrations",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "apns_registrations",
			kind: "primaryKey",
			value: ["node_id"]
		},
		{
			table: "apns_registrations",
			kind: "indexes",
			value: 2
		},
		{
			table: "apns_registrations",
			kind: "checks",
			value: 0
		},
		{
			table: "audit_events",
			kind: "table",
			value: null
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "sequence",
				type: "bigint",
				nullable: false,
				identity: true,
				default: null,
				position: 1
			}
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "event_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "source_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "schema_version",
				type: "bigint",
				nullable: false,
				identity: false,
				default: "1",
				position: 4
			}
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "source_sequence",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "occurred_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "kind",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "action",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "status",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "error_code",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "actor_type",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "actor_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "agent_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "session_key",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "session_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 15
			}
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "run_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 16
			}
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "tool_call_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 17
			}
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "tool_name",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 18
			}
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "direction",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 19
			}
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "channel",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 20
			}
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "conversation_kind",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 21
			}
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "message_outcome",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 22
			}
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "reason_code",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 23
			}
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "delivery_kind",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 24
			}
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "failure_stage",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 25
			}
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "duration_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 26
			}
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "result_count",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 27
			}
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "account_ref",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 28
			}
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "conversation_ref",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 29
			}
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "message_ref",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 30
			}
		},
		{
			table: "audit_events",
			kind: "column",
			value: {
				name: "target_ref",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 31
			}
		},
		{
			table: "audit_events",
			kind: "primaryKey",
			value: ["sequence"]
		},
		{
			table: "audit_events",
			kind: "unique",
			value: ["event_id"]
		},
		{
			table: "audit_events",
			kind: "unique",
			value: ["source_id"]
		},
		{
			table: "audit_events",
			kind: "indexes",
			value: 11
		},
		{
			table: "audit_events",
			kind: "checks",
			value: 0
		},
		{
			table: "audit_identity_keys",
			kind: "table",
			value: null
		},
		{
			table: "audit_identity_keys",
			kind: "column",
			value: {
				name: "id",
				type: "bigint",
				nullable: false,
				identity: true,
				default: null,
				position: 1
			}
		},
		{
			table: "audit_identity_keys",
			kind: "column",
			value: {
				name: "key_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "audit_identity_keys",
			kind: "column",
			value: {
				name: "key",
				type: "bytea",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "audit_identity_keys",
			kind: "column",
			value: {
				name: "created_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "audit_identity_keys",
			kind: "primaryKey",
			value: ["id"]
		},
		{
			table: "audit_identity_keys",
			kind: "indexes",
			value: 1
		},
		{
			table: "audit_identity_keys",
			kind: "checks",
			value: 1
		},
		{
			table: "backup_runs",
			kind: "table",
			value: null
		},
		{
			table: "backup_runs",
			kind: "column",
			value: {
				name: "id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "backup_runs",
			kind: "column",
			value: {
				name: "created_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "backup_runs",
			kind: "column",
			value: {
				name: "archive_path",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "backup_runs",
			kind: "column",
			value: {
				name: "status",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "backup_runs",
			kind: "column",
			value: {
				name: "manifest_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "backup_runs",
			kind: "primaryKey",
			value: ["id"]
		},
		{
			table: "backup_runs",
			kind: "indexes",
			value: 2
		},
		{
			table: "backup_runs",
			kind: "checks",
			value: 0
		},
		{
			table: "capture_blobs",
			kind: "table",
			value: null
		},
		{
			table: "capture_blobs",
			kind: "column",
			value: {
				name: "blob_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "capture_blobs",
			kind: "column",
			value: {
				name: "content_type",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "capture_blobs",
			kind: "column",
			value: {
				name: "encoding",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "capture_blobs",
			kind: "column",
			value: {
				name: "size_bytes",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "capture_blobs",
			kind: "column",
			value: {
				name: "sha256",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "capture_blobs",
			kind: "column",
			value: {
				name: "data",
				type: "bytea",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "capture_blobs",
			kind: "column",
			value: {
				name: "created_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "capture_blobs",
			kind: "primaryKey",
			value: ["blob_id"]
		},
		{
			table: "capture_blobs",
			kind: "indexes",
			value: 1
		},
		{
			table: "capture_blobs",
			kind: "checks",
			value: 0
		},
		{
			table: "capture_events",
			kind: "table",
			value: null
		},
		{
			table: "capture_events",
			kind: "column",
			value: {
				name: "id",
				type: "bigint",
				nullable: false,
				identity: true,
				default: null,
				position: 1
			}
		},
		{
			table: "capture_events",
			kind: "column",
			value: {
				name: "session_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "capture_events",
			kind: "column",
			value: {
				name: "ts",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "capture_events",
			kind: "column",
			value: {
				name: "source_scope",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "capture_events",
			kind: "column",
			value: {
				name: "source_process",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "capture_events",
			kind: "column",
			value: {
				name: "protocol",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "capture_events",
			kind: "column",
			value: {
				name: "direction",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "capture_events",
			kind: "column",
			value: {
				name: "kind",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "capture_events",
			kind: "column",
			value: {
				name: "flow_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "capture_events",
			kind: "column",
			value: {
				name: "method",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "capture_events",
			kind: "column",
			value: {
				name: "host",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "capture_events",
			kind: "column",
			value: {
				name: "path",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "capture_events",
			kind: "column",
			value: {
				name: "status",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "capture_events",
			kind: "column",
			value: {
				name: "close_code",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "capture_events",
			kind: "column",
			value: {
				name: "content_type",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 15
			}
		},
		{
			table: "capture_events",
			kind: "column",
			value: {
				name: "headers_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 16
			}
		},
		{
			table: "capture_events",
			kind: "column",
			value: {
				name: "data_text",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 17
			}
		},
		{
			table: "capture_events",
			kind: "column",
			value: {
				name: "data_blob_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 18
			}
		},
		{
			table: "capture_events",
			kind: "column",
			value: {
				name: "data_sha256",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 19
			}
		},
		{
			table: "capture_events",
			kind: "column",
			value: {
				name: "error_text",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 20
			}
		},
		{
			table: "capture_events",
			kind: "column",
			value: {
				name: "meta_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 21
			}
		},
		{
			table: "capture_events",
			kind: "primaryKey",
			value: ["id"]
		},
		{
			table: "capture_events",
			kind: "foreignKey",
			value: {
				columns: ["data_blob_id"],
				target: "capture_blobs",
				targetColumns: ["blob_id"],
				onUpdate: "NO ACTION",
				onDelete: "SET NULL",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "capture_events",
			kind: "foreignKey",
			value: {
				columns: ["session_id"],
				target: "capture_sessions",
				targetColumns: ["id"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "capture_events",
			kind: "indexes",
			value: 3
		},
		{
			table: "capture_events",
			kind: "checks",
			value: 0
		},
		{
			table: "capture_sessions",
			kind: "table",
			value: null
		},
		{
			table: "capture_sessions",
			kind: "column",
			value: {
				name: "id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "capture_sessions",
			kind: "column",
			value: {
				name: "started_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "capture_sessions",
			kind: "column",
			value: {
				name: "ended_at",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "capture_sessions",
			kind: "column",
			value: {
				name: "mode",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "capture_sessions",
			kind: "column",
			value: {
				name: "source_scope",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "capture_sessions",
			kind: "column",
			value: {
				name: "source_process",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "capture_sessions",
			kind: "column",
			value: {
				name: "proxy_url",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "capture_sessions",
			kind: "primaryKey",
			value: ["id"]
		},
		{
			table: "capture_sessions",
			kind: "indexes",
			value: 1
		},
		{
			table: "capture_sessions",
			kind: "checks",
			value: 0
		},
		{
			table: "channel_ingress_events",
			kind: "table",
			value: null
		},
		{
			table: "channel_ingress_events",
			kind: "column",
			value: {
				name: "queue_name",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "channel_ingress_events",
			kind: "column",
			value: {
				name: "event_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "channel_ingress_events",
			kind: "column",
			value: {
				name: "channel_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "channel_ingress_events",
			kind: "column",
			value: {
				name: "account_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "channel_ingress_events",
			kind: "column",
			value: {
				name: "status",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "channel_ingress_events",
			kind: "column",
			value: {
				name: "lane_key",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "channel_ingress_events",
			kind: "column",
			value: {
				name: "payload_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "channel_ingress_events",
			kind: "column",
			value: {
				name: "metadata_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "channel_ingress_events",
			kind: "column",
			value: {
				name: "received_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "channel_ingress_events",
			kind: "column",
			value: {
				name: "updated_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "channel_ingress_events",
			kind: "column",
			value: {
				name: "claim_token",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "channel_ingress_events",
			kind: "column",
			value: {
				name: "claim_owner",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "channel_ingress_events",
			kind: "column",
			value: {
				name: "claimed_at",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "channel_ingress_events",
			kind: "column",
			value: {
				name: "attempts",
				type: "bigint",
				nullable: false,
				identity: false,
				default: "0",
				position: 14
			}
		},
		{
			table: "channel_ingress_events",
			kind: "column",
			value: {
				name: "last_attempt_at",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 15
			}
		},
		{
			table: "channel_ingress_events",
			kind: "column",
			value: {
				name: "last_error",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 16
			}
		},
		{
			table: "channel_ingress_events",
			kind: "column",
			value: {
				name: "failed_reason",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 17
			}
		},
		{
			table: "channel_ingress_events",
			kind: "column",
			value: {
				name: "failed_at",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 18
			}
		},
		{
			table: "channel_ingress_events",
			kind: "column",
			value: {
				name: "completed_at",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 19
			}
		},
		{
			table: "channel_ingress_events",
			kind: "column",
			value: {
				name: "completed_metadata_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 20
			}
		},
		{
			table: "channel_ingress_events",
			kind: "primaryKey",
			value: ["queue_name", "event_id"]
		},
		{
			table: "channel_ingress_events",
			kind: "indexes",
			value: 4
		},
		{
			table: "channel_ingress_events",
			kind: "checks",
			value: 0
		},
		{
			table: "channel_pairing_allow_entries",
			kind: "table",
			value: null
		},
		{
			table: "channel_pairing_allow_entries",
			kind: "column",
			value: {
				name: "channel_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "channel_pairing_allow_entries",
			kind: "column",
			value: {
				name: "account_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "channel_pairing_allow_entries",
			kind: "column",
			value: {
				name: "entry",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "channel_pairing_allow_entries",
			kind: "column",
			value: {
				name: "sort_order",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "channel_pairing_allow_entries",
			kind: "column",
			value: {
				name: "updated_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "channel_pairing_allow_entries",
			kind: "primaryKey",
			value: [
				"channel_key",
				"account_id",
				"entry"
			]
		},
		{
			table: "channel_pairing_allow_entries",
			kind: "indexes",
			value: 2
		},
		{
			table: "channel_pairing_allow_entries",
			kind: "checks",
			value: 0
		},
		{
			table: "channel_pairing_requests",
			kind: "table",
			value: null
		},
		{
			table: "channel_pairing_requests",
			kind: "column",
			value: {
				name: "channel_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "channel_pairing_requests",
			kind: "column",
			value: {
				name: "account_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "channel_pairing_requests",
			kind: "column",
			value: {
				name: "request_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "channel_pairing_requests",
			kind: "column",
			value: {
				name: "code",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "channel_pairing_requests",
			kind: "column",
			value: {
				name: "created_at",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "channel_pairing_requests",
			kind: "column",
			value: {
				name: "last_seen_at",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "channel_pairing_requests",
			kind: "column",
			value: {
				name: "meta_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "channel_pairing_requests",
			kind: "primaryKey",
			value: [
				"channel_key",
				"account_id",
				"request_id"
			]
		},
		{
			table: "channel_pairing_requests",
			kind: "indexes",
			value: 3
		},
		{
			table: "channel_pairing_requests",
			kind: "checks",
			value: 0
		},
		{
			table: "claw_cron_refs",
			kind: "table",
			value: null
		},
		{
			table: "claw_cron_refs",
			kind: "column",
			value: {
				name: "agent_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "claw_cron_refs",
			kind: "column",
			value: {
				name: "manifest_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "claw_cron_refs",
			kind: "column",
			value: {
				name: "schema_version",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "claw_cron_refs",
			kind: "column",
			value: {
				name: "declaration_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "claw_cron_refs",
			kind: "column",
			value: {
				name: "scheduler_job_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "claw_cron_refs",
			kind: "column",
			value: {
				name: "status",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "claw_cron_refs",
			kind: "column",
			value: {
				name: "job_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "claw_cron_refs",
			kind: "column",
			value: {
				name: "error",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "claw_cron_refs",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "claw_cron_refs",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "claw_cron_refs",
			kind: "primaryKey",
			value: ["agent_id", "manifest_id"]
		},
		{
			table: "claw_cron_refs",
			kind: "unique",
			value: ["declaration_key"]
		},
		{
			table: "claw_cron_refs",
			kind: "unique",
			value: ["scheduler_job_id"]
		},
		{
			table: "claw_cron_refs",
			kind: "indexes",
			value: 3
		},
		{
			table: "claw_cron_refs",
			kind: "checks",
			value: 0
		},
		{
			table: "claw_installs",
			kind: "table",
			value: null
		},
		{
			table: "claw_installs",
			kind: "column",
			value: {
				name: "agent_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "claw_installs",
			kind: "column",
			value: {
				name: "schema_version",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "claw_installs",
			kind: "column",
			value: {
				name: "source_kind",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "claw_installs",
			kind: "column",
			value: {
				name: "claw_name",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "claw_installs",
			kind: "column",
			value: {
				name: "claw_version",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "claw_installs",
			kind: "column",
			value: {
				name: "package_root",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "claw_installs",
			kind: "column",
			value: {
				name: "manifest_path",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "claw_installs",
			kind: "column",
			value: {
				name: "integrity_kind",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "claw_installs",
			kind: "column",
			value: {
				name: "integrity",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "claw_installs",
			kind: "column",
			value: {
				name: "source_byte_length",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "claw_installs",
			kind: "column",
			value: {
				name: "manifest_schema_version",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "claw_installs",
			kind: "column",
			value: {
				name: "plan_integrity",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "claw_installs",
			kind: "column",
			value: {
				name: "workspace",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "claw_installs",
			kind: "column",
			value: {
				name: "agent_config_digest",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "claw_installs",
			kind: "column",
			value: {
				name: "agent_owned_paths_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 15
			}
		},
		{
			table: "claw_installs",
			kind: "column",
			value: {
				name: "bootstrap_source_path",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 16
			}
		},
		{
			table: "claw_installs",
			kind: "column",
			value: {
				name: "bootstrap_content_digest",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 17
			}
		},
		{
			table: "claw_installs",
			kind: "column",
			value: {
				name: "status",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 18
			}
		},
		{
			table: "claw_installs",
			kind: "column",
			value: {
				name: "added_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 19
			}
		},
		{
			table: "claw_installs",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 20
			}
		},
		{
			table: "claw_installs",
			kind: "primaryKey",
			value: ["agent_id"]
		},
		{
			table: "claw_installs",
			kind: "unique",
			value: ["workspace"]
		},
		{
			table: "claw_installs",
			kind: "indexes",
			value: 2
		},
		{
			table: "claw_installs",
			kind: "checks",
			value: 1
		},
		{
			table: "claw_mcp_server_refs",
			kind: "table",
			value: null
		},
		{
			table: "claw_mcp_server_refs",
			kind: "column",
			value: {
				name: "agent_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "claw_mcp_server_refs",
			kind: "column",
			value: {
				name: "name",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "claw_mcp_server_refs",
			kind: "column",
			value: {
				name: "schema_version",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "claw_mcp_server_refs",
			kind: "column",
			value: {
				name: "config_digest",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "claw_mcp_server_refs",
			kind: "column",
			value: {
				name: "relationship",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "claw_mcp_server_refs",
			kind: "column",
			value: {
				name: "origin",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "claw_mcp_server_refs",
			kind: "column",
			value: {
				name: "independent_owner",
				type: "bigint",
				nullable: false,
				identity: false,
				default: "0",
				position: 7
			}
		},
		{
			table: "claw_mcp_server_refs",
			kind: "column",
			value: {
				name: "status",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "claw_mcp_server_refs",
			kind: "column",
			value: {
				name: "error",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "claw_mcp_server_refs",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "claw_mcp_server_refs",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "claw_mcp_server_refs",
			kind: "primaryKey",
			value: ["agent_id", "name"]
		},
		{
			table: "claw_mcp_server_refs",
			kind: "indexes",
			value: 1
		},
		{
			table: "claw_mcp_server_refs",
			kind: "checks",
			value: 3
		},
		{
			table: "claw_package_refs",
			kind: "table",
			value: null
		},
		{
			table: "claw_package_refs",
			kind: "column",
			value: {
				name: "agent_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "claw_package_refs",
			kind: "column",
			value: {
				name: "package_kind",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "claw_package_refs",
			kind: "column",
			value: {
				name: "package_source",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "claw_package_refs",
			kind: "column",
			value: {
				name: "package_ref",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "claw_package_refs",
			kind: "column",
			value: {
				name: "package_version",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "claw_package_refs",
			kind: "column",
			value: {
				name: "package_integrity",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "claw_package_refs",
			kind: "column",
			value: {
				name: "schema_version",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "claw_package_refs",
			kind: "column",
			value: {
				name: "claw_name",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "claw_package_refs",
			kind: "column",
			value: {
				name: "package_status",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "claw_package_refs",
			kind: "column",
			value: {
				name: "relationship",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "claw_package_refs",
			kind: "column",
			value: {
				name: "origin",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "claw_package_refs",
			kind: "column",
			value: {
				name: "independent_owner",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "claw_package_refs",
			kind: "column",
			value: {
				name: "extension_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "claw_package_refs",
			kind: "column",
			value: {
				name: "extension_format",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "claw_package_refs",
			kind: "column",
			value: {
				name: "extension_detected_format",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 15
			}
		},
		{
			table: "claw_package_refs",
			kind: "column",
			value: {
				name: "extension_mapped_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 16
			}
		},
		{
			table: "claw_package_refs",
			kind: "column",
			value: {
				name: "extension_unavailable_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 17
			}
		},
		{
			table: "claw_package_refs",
			kind: "column",
			value: {
				name: "extension_adapter_identity",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 18
			}
		},
		{
			table: "claw_package_refs",
			kind: "column",
			value: {
				name: "installed_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 19
			}
		},
		{
			table: "claw_package_refs",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 20
			}
		},
		{
			table: "claw_package_refs",
			kind: "primaryKey",
			value: [
				"agent_id",
				"package_kind",
				"package_source",
				"package_ref",
				"package_version"
			]
		},
		{
			table: "claw_package_refs",
			kind: "indexes",
			value: 1
		},
		{
			table: "claw_package_refs",
			kind: "checks",
			value: 3
		},
		{
			table: "claw_workspace_files",
			kind: "table",
			value: null
		},
		{
			table: "claw_workspace_files",
			kind: "column",
			value: {
				name: "agent_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "claw_workspace_files",
			kind: "column",
			value: {
				name: "target_path",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "claw_workspace_files",
			kind: "column",
			value: {
				name: "schema_version",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "claw_workspace_files",
			kind: "column",
			value: {
				name: "workspace",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "claw_workspace_files",
			kind: "column",
			value: {
				name: "source_path",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "claw_workspace_files",
			kind: "column",
			value: {
				name: "content_digest",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "claw_workspace_files",
			kind: "column",
			value: {
				name: "status",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "claw_workspace_files",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "claw_workspace_files",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "claw_workspace_files",
			kind: "primaryKey",
			value: ["agent_id", "target_path"]
		},
		{
			table: "claw_workspace_files",
			kind: "indexes",
			value: 1
		},
		{
			table: "claw_workspace_files",
			kind: "checks",
			value: 0
		},
		{
			table: "clawhub_promotion_claims",
			kind: "table",
			value: null
		},
		{
			table: "clawhub_promotion_claims",
			kind: "column",
			value: {
				name: "slug",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "clawhub_promotion_claims",
			kind: "column",
			value: {
				name: "provider",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "clawhub_promotion_claims",
			kind: "column",
			value: {
				name: "model_keys_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "clawhub_promotion_claims",
			kind: "column",
			value: {
				name: "ends_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "clawhub_promotion_claims",
			kind: "column",
			value: {
				name: "claimed_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "clawhub_promotion_claims",
			kind: "primaryKey",
			value: ["slug"]
		},
		{
			table: "clawhub_promotion_claims",
			kind: "indexes",
			value: 1
		},
		{
			table: "clawhub_promotion_claims",
			kind: "checks",
			value: 0
		},
		{
			table: "config_health_entries",
			kind: "table",
			value: null
		},
		{
			table: "config_health_entries",
			kind: "column",
			value: {
				name: "config_path",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "config_health_entries",
			kind: "column",
			value: {
				name: "last_known_good_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "config_health_entries",
			kind: "column",
			value: {
				name: "last_promoted_good_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "config_health_entries",
			kind: "column",
			value: {
				name: "last_observed_suspicious_signature",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "config_health_entries",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "config_health_entries",
			kind: "primaryKey",
			value: ["config_path"]
		},
		{
			table: "config_health_entries",
			kind: "indexes",
			value: 1
		},
		{
			table: "config_health_entries",
			kind: "checks",
			value: 0
		},
		{
			table: "config_machine_state",
			kind: "table",
			value: null
		},
		{
			table: "config_machine_state",
			kind: "column",
			value: {
				name: "state_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "config_machine_state",
			kind: "column",
			value: {
				name: "value_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "config_machine_state",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "config_machine_state",
			kind: "primaryKey",
			value: ["state_key"]
		},
		{
			table: "config_machine_state",
			kind: "indexes",
			value: 1
		},
		{
			table: "config_machine_state",
			kind: "checks",
			value: 0
		},
		{
			table: "config_revision_keys",
			kind: "table",
			value: null
		},
		{
			table: "config_revision_keys",
			kind: "column",
			value: {
				name: "id",
				type: "bigint",
				nullable: false,
				identity: true,
				default: null,
				position: 1
			}
		},
		{
			table: "config_revision_keys",
			kind: "column",
			value: {
				name: "hmac_key",
				type: "bytea",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "config_revision_keys",
			kind: "primaryKey",
			value: ["id"]
		},
		{
			table: "config_revision_keys",
			kind: "indexes",
			value: 1
		},
		{
			table: "config_revision_keys",
			kind: "checks",
			value: 2
		},
		{
			table: "cron_job_runtime_authorities",
			kind: "table",
			value: null
		},
		{
			table: "cron_job_runtime_authorities",
			kind: "column",
			value: {
				name: "store_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "cron_job_runtime_authorities",
			kind: "column",
			value: {
				name: "job_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "cron_job_runtime_authorities",
			kind: "column",
			value: {
				name: "authority_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "cron_job_runtime_authorities",
			kind: "column",
			value: {
				name: "authority_input_fingerprint",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "cron_job_runtime_authorities",
			kind: "column",
			value: {
				name: "recovery_required",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "cron_job_runtime_authorities",
			kind: "primaryKey",
			value: ["store_key", "job_id"]
		},
		{
			table: "cron_job_runtime_authorities",
			kind: "foreignKey",
			value: {
				columns: ["store_key", "job_id"],
				target: "cron_jobs",
				targetColumns: ["store_key", "job_id"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "cron_job_runtime_authorities",
			kind: "indexes",
			value: 1
		},
		{
			table: "cron_job_runtime_authorities",
			kind: "checks",
			value: 2
		},
		{
			table: "cron_job_scratch",
			kind: "table",
			value: null
		},
		{
			table: "cron_job_scratch",
			kind: "column",
			value: {
				name: "store_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "cron_job_scratch",
			kind: "column",
			value: {
				name: "job_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "cron_job_scratch",
			kind: "column",
			value: {
				name: "content",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "cron_job_scratch",
			kind: "column",
			value: {
				name: "revision",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "cron_job_scratch",
			kind: "column",
			value: {
				name: "source_sha256",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "cron_job_scratch",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "cron_job_scratch",
			kind: "primaryKey",
			value: ["store_key", "job_id"]
		},
		{
			table: "cron_job_scratch",
			kind: "indexes",
			value: 2
		},
		{
			table: "cron_job_scratch",
			kind: "checks",
			value: 2
		},
		{
			table: "cron_jobs",
			kind: "table",
			value: null
		},
		{
			table: "cron_jobs",
			kind: "column",
			value: {
				name: "store_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "cron_jobs",
			kind: "column",
			value: {
				name: "job_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "cron_jobs",
			kind: "column",
			value: {
				name: "declaration_key",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "cron_jobs",
			kind: "column",
			value: {
				name: "owner_agent_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "cron_jobs",
			kind: "column",
			value: {
				name: "name",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "cron_jobs",
			kind: "column",
			value: {
				name: "description",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "cron_jobs",
			kind: "column",
			value: {
				name: "enabled",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "cron_jobs",
			kind: "column",
			value: {
				name: "agent_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "cron_jobs",
			kind: "column",
			value: {
				name: "payload_kind",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "cron_jobs",
			kind: "column",
			value: {
				name: "job_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "cron_jobs",
			kind: "column",
			value: {
				name: "grant_definition_revision",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "cron_jobs",
			kind: "column",
			value: {
				name: "grant_definition_generation",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "cron_jobs",
			kind: "column",
			value: {
				name: "grant_definition_updated_at",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "cron_jobs",
			kind: "column",
			value: {
				name: "state_json",
				type: "text",
				nullable: false,
				identity: false,
				default: "'{}'",
				position: 14
			}
		},
		{
			table: "cron_jobs",
			kind: "column",
			value: {
				name: "runtime_updated_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 15
			}
		},
		{
			table: "cron_jobs",
			kind: "column",
			value: {
				name: "schedule_identity",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 16
			}
		},
		{
			table: "cron_jobs",
			kind: "column",
			value: {
				name: "sort_order",
				type: "bigint",
				nullable: false,
				identity: false,
				default: "0",
				position: 17
			}
		},
		{
			table: "cron_jobs",
			kind: "column",
			value: {
				name: "updated_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 18
			}
		},
		{
			table: "cron_jobs",
			kind: "primaryKey",
			value: ["store_key", "job_id"]
		},
		{
			table: "cron_jobs",
			kind: "indexes",
			value: 2
		},
		{
			table: "cron_jobs",
			kind: "checks",
			value: 0
		},
		{
			table: "cron_run_receipts",
			kind: "table",
			value: null
		},
		{
			table: "cron_run_receipts",
			kind: "column",
			value: {
				name: "cursor_id",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "cron_run_receipts",
			kind: "column",
			value: {
				name: "receipt_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "cron_run_receipts",
			kind: "column",
			value: {
				name: "store_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "cron_run_receipts",
			kind: "column",
			value: {
				name: "job_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "cron_run_receipts",
			kind: "column",
			value: {
				name: "config_revision",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "cron_run_receipts",
			kind: "column",
			value: {
				name: "agent_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "cron_run_receipts",
			kind: "column",
			value: {
				name: "request_run_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "cron_run_receipts",
			kind: "column",
			value: {
				name: "delivery_attempt_state",
				type: "text",
				nullable: false,
				identity: false,
				default: "'unknown'",
				position: 8
			}
		},
		{
			table: "cron_run_receipts",
			kind: "column",
			value: {
				name: "status",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "cron_run_receipts",
			kind: "column",
			value: {
				name: "owner_pid",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "cron_run_receipts",
			kind: "column",
			value: {
				name: "owner_start_time",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "cron_run_receipts",
			kind: "column",
			value: {
				name: "started_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "cron_run_receipts",
			kind: "column",
			value: {
				name: "finished_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "cron_run_receipts",
			kind: "column",
			value: {
				name: "error_text",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "cron_run_receipts",
			kind: "primaryKey",
			value: ["receipt_id"]
		},
		{
			table: "cron_run_receipts",
			kind: "indexes",
			value: 4
		},
		{
			table: "cron_run_receipts",
			kind: "checks",
			value: 3
		},
		{
			table: "cron_run_trigger_state_retirements",
			kind: "table",
			value: null
		},
		{
			table: "cron_run_trigger_state_retirements",
			kind: "column",
			value: {
				name: "receipt_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "cron_run_trigger_state_retirements",
			kind: "primaryKey",
			value: ["receipt_id"]
		},
		{
			table: "cron_run_trigger_state_retirements",
			kind: "foreignKey",
			value: {
				columns: ["receipt_id"],
				target: "cron_run_receipts",
				targetColumns: ["receipt_id"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "cron_run_trigger_state_retirements",
			kind: "indexes",
			value: 1
		},
		{
			table: "cron_run_trigger_state_retirements",
			kind: "checks",
			value: 0
		},
		{
			table: "current_conversation_bindings",
			kind: "table",
			value: null
		},
		{
			table: "current_conversation_bindings",
			kind: "column",
			value: {
				name: "binding_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "current_conversation_bindings",
			kind: "column",
			value: {
				name: "binding_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "current_conversation_bindings",
			kind: "column",
			value: {
				name: "target_session_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "current_conversation_bindings",
			kind: "column",
			value: {
				name: "channel",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "current_conversation_bindings",
			kind: "column",
			value: {
				name: "account_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "current_conversation_bindings",
			kind: "column",
			value: {
				name: "conversation_kind",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "current_conversation_bindings",
			kind: "column",
			value: {
				name: "parent_conversation_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "current_conversation_bindings",
			kind: "column",
			value: {
				name: "conversation_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "current_conversation_bindings",
			kind: "column",
			value: {
				name: "target_kind",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "current_conversation_bindings",
			kind: "column",
			value: {
				name: "status",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "current_conversation_bindings",
			kind: "column",
			value: {
				name: "bound_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "current_conversation_bindings",
			kind: "column",
			value: {
				name: "expires_at",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "current_conversation_bindings",
			kind: "column",
			value: {
				name: "metadata_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "current_conversation_bindings",
			kind: "column",
			value: {
				name: "record_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "current_conversation_bindings",
			kind: "column",
			value: {
				name: "updated_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 15
			}
		},
		{
			table: "current_conversation_bindings",
			kind: "primaryKey",
			value: ["binding_key"]
		},
		{
			table: "current_conversation_bindings",
			kind: "indexes",
			value: 4
		},
		{
			table: "current_conversation_bindings",
			kind: "checks",
			value: 0
		},
		{
			table: "delivery_queue_entries",
			kind: "table",
			value: null
		},
		{
			table: "delivery_queue_entries",
			kind: "column",
			value: {
				name: "queue_name",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "delivery_queue_entries",
			kind: "column",
			value: {
				name: "id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "delivery_queue_entries",
			kind: "column",
			value: {
				name: "status",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "delivery_queue_entries",
			kind: "column",
			value: {
				name: "entry_kind",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "delivery_queue_entries",
			kind: "column",
			value: {
				name: "session_key",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "delivery_queue_entries",
			kind: "column",
			value: {
				name: "channel",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "delivery_queue_entries",
			kind: "column",
			value: {
				name: "target",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "delivery_queue_entries",
			kind: "column",
			value: {
				name: "account_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "delivery_queue_entries",
			kind: "column",
			value: {
				name: "retry_count",
				type: "bigint",
				nullable: false,
				identity: false,
				default: "0",
				position: 9
			}
		},
		{
			table: "delivery_queue_entries",
			kind: "column",
			value: {
				name: "last_attempt_at",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "delivery_queue_entries",
			kind: "column",
			value: {
				name: "last_error",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "delivery_queue_entries",
			kind: "column",
			value: {
				name: "recovery_state",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "delivery_queue_entries",
			kind: "column",
			value: {
				name: "platform_send_started_at",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "delivery_queue_entries",
			kind: "column",
			value: {
				name: "entry_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "delivery_queue_entries",
			kind: "column",
			value: {
				name: "retention_id_prefix",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 15
			}
		},
		{
			table: "delivery_queue_entries",
			kind: "column",
			value: {
				name: "retention_max_age_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 16
			}
		},
		{
			table: "delivery_queue_entries",
			kind: "column",
			value: {
				name: "retention_max_entries",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 17
			}
		},
		{
			table: "delivery_queue_entries",
			kind: "column",
			value: {
				name: "enqueued_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 18
			}
		},
		{
			table: "delivery_queue_entries",
			kind: "column",
			value: {
				name: "updated_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 19
			}
		},
		{
			table: "delivery_queue_entries",
			kind: "column",
			value: {
				name: "failed_at",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 20
			}
		},
		{
			table: "delivery_queue_entries",
			kind: "primaryKey",
			value: ["queue_name", "id"]
		},
		{
			table: "delivery_queue_entries",
			kind: "indexes",
			value: 6
		},
		{
			table: "delivery_queue_entries",
			kind: "checks",
			value: 0
		},
		{
			table: "device_auth_tokens",
			kind: "table",
			value: null
		},
		{
			table: "device_auth_tokens",
			kind: "column",
			value: {
				name: "device_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "device_auth_tokens",
			kind: "column",
			value: {
				name: "role",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "device_auth_tokens",
			kind: "column",
			value: {
				name: "token",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "device_auth_tokens",
			kind: "column",
			value: {
				name: "scopes_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "device_auth_tokens",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "device_auth_tokens",
			kind: "primaryKey",
			value: ["device_id", "role"]
		},
		{
			table: "device_auth_tokens",
			kind: "indexes",
			value: 2
		},
		{
			table: "device_auth_tokens",
			kind: "checks",
			value: 0
		},
		{
			table: "device_bootstrap_tokens",
			kind: "table",
			value: null
		},
		{
			table: "device_bootstrap_tokens",
			kind: "column",
			value: {
				name: "token_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "device_bootstrap_tokens",
			kind: "column",
			value: {
				name: "token",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "device_bootstrap_tokens",
			kind: "column",
			value: {
				name: "setup_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "device_bootstrap_tokens",
			kind: "column",
			value: {
				name: "ts",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "device_bootstrap_tokens",
			kind: "column",
			value: {
				name: "device_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "device_bootstrap_tokens",
			kind: "column",
			value: {
				name: "public_key",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "device_bootstrap_tokens",
			kind: "column",
			value: {
				name: "profile_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "device_bootstrap_tokens",
			kind: "column",
			value: {
				name: "redeemed_profile_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "device_bootstrap_tokens",
			kind: "column",
			value: {
				name: "pending_profile_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "device_bootstrap_tokens",
			kind: "column",
			value: {
				name: "issued_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "device_bootstrap_tokens",
			kind: "column",
			value: {
				name: "last_used_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "device_bootstrap_tokens",
			kind: "primaryKey",
			value: ["token_key"]
		},
		{
			table: "device_bootstrap_tokens",
			kind: "indexes",
			value: 2
		},
		{
			table: "device_bootstrap_tokens",
			kind: "checks",
			value: 0
		},
		{
			table: "device_identities",
			kind: "table",
			value: null
		},
		{
			table: "device_identities",
			kind: "column",
			value: {
				name: "identity_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "device_identities",
			kind: "column",
			value: {
				name: "device_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "device_identities",
			kind: "column",
			value: {
				name: "public_key_pem",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "device_identities",
			kind: "column",
			value: {
				name: "private_key_pem",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "device_identities",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "device_identities",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "device_identities",
			kind: "primaryKey",
			value: ["identity_key"]
		},
		{
			table: "device_identities",
			kind: "indexes",
			value: 2
		},
		{
			table: "device_identities",
			kind: "checks",
			value: 0
		},
		{
			table: "device_pair_setup_completions",
			kind: "table",
			value: null
		},
		{
			table: "device_pair_setup_completions",
			kind: "column",
			value: {
				name: "setup_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "device_pair_setup_completions",
			kind: "column",
			value: {
				name: "device_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "device_pair_setup_completions",
			kind: "column",
			value: {
				name: "device_name",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "device_pair_setup_completions",
			kind: "column",
			value: {
				name: "access",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "device_pair_setup_completions",
			kind: "column",
			value: {
				name: "completed_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "device_pair_setup_completions",
			kind: "column",
			value: {
				name: "delivery_state",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "device_pair_setup_completions",
			kind: "column",
			value: {
				name: "retain_until_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "device_pair_setup_completions",
			kind: "primaryKey",
			value: ["setup_id"]
		},
		{
			table: "device_pair_setup_completions",
			kind: "indexes",
			value: 1
		},
		{
			table: "device_pair_setup_completions",
			kind: "checks",
			value: 1
		},
		{
			table: "device_pairing_join_codes",
			kind: "table",
			value: null
		},
		{
			table: "device_pairing_join_codes",
			kind: "column",
			value: {
				name: "shortcode",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "device_pairing_join_codes",
			kind: "column",
			value: {
				name: "payload_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "device_pairing_join_codes",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "device_pairing_join_codes",
			kind: "column",
			value: {
				name: "expires_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "device_pairing_join_codes",
			kind: "indexes",
			value: 0
		},
		{
			table: "device_pairing_join_codes",
			kind: "checks",
			value: 0
		},
		{
			table: "device_pairing_paired",
			kind: "table",
			value: null
		},
		{
			table: "device_pairing_paired",
			kind: "column",
			value: {
				name: "device_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "device_pairing_paired",
			kind: "column",
			value: {
				name: "public_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "device_pairing_paired",
			kind: "column",
			value: {
				name: "display_name",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "device_pairing_paired",
			kind: "column",
			value: {
				name: "operator_label",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "device_pairing_paired",
			kind: "column",
			value: {
				name: "platform",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "device_pairing_paired",
			kind: "column",
			value: {
				name: "device_family",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "device_pairing_paired",
			kind: "column",
			value: {
				name: "client_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "device_pairing_paired",
			kind: "column",
			value: {
				name: "client_mode",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "device_pairing_paired",
			kind: "column",
			value: {
				name: "browser_origin",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "device_pairing_paired",
			kind: "column",
			value: {
				name: "role",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "device_pairing_paired",
			kind: "column",
			value: {
				name: "roles_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "device_pairing_paired",
			kind: "column",
			value: {
				name: "scopes_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "device_pairing_paired",
			kind: "column",
			value: {
				name: "approved_scopes_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "device_pairing_paired",
			kind: "column",
			value: {
				name: "remote_ip",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "device_pairing_paired",
			kind: "column",
			value: {
				name: "tokens_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 15
			}
		},
		{
			table: "device_pairing_paired",
			kind: "column",
			value: {
				name: "approved_via",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 16
			}
		},
		{
			table: "device_pairing_paired",
			kind: "column",
			value: {
				name: "node_surface_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 17
			}
		},
		{
			table: "device_pairing_paired",
			kind: "column",
			value: {
				name: "pending_node_surface_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 18
			}
		},
		{
			table: "device_pairing_paired",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 19
			}
		},
		{
			table: "device_pairing_paired",
			kind: "column",
			value: {
				name: "approved_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 20
			}
		},
		{
			table: "device_pairing_paired",
			kind: "column",
			value: {
				name: "last_seen_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 21
			}
		},
		{
			table: "device_pairing_paired",
			kind: "column",
			value: {
				name: "last_seen_reason",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 22
			}
		},
		{
			table: "device_pairing_paired",
			kind: "primaryKey",
			value: ["device_id"]
		},
		{
			table: "device_pairing_paired",
			kind: "indexes",
			value: 2
		},
		{
			table: "device_pairing_paired",
			kind: "checks",
			value: 0
		},
		{
			table: "device_pairing_pending",
			kind: "table",
			value: null
		},
		{
			table: "device_pairing_pending",
			kind: "column",
			value: {
				name: "request_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "device_pairing_pending",
			kind: "column",
			value: {
				name: "device_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "device_pairing_pending",
			kind: "column",
			value: {
				name: "public_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "device_pairing_pending",
			kind: "column",
			value: {
				name: "display_name",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "device_pairing_pending",
			kind: "column",
			value: {
				name: "platform",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "device_pairing_pending",
			kind: "column",
			value: {
				name: "device_family",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "device_pairing_pending",
			kind: "column",
			value: {
				name: "client_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "device_pairing_pending",
			kind: "column",
			value: {
				name: "client_mode",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "device_pairing_pending",
			kind: "column",
			value: {
				name: "browser_origin",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "device_pairing_pending",
			kind: "column",
			value: {
				name: "role",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "device_pairing_pending",
			kind: "column",
			value: {
				name: "roles_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "device_pairing_pending",
			kind: "column",
			value: {
				name: "scopes_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "device_pairing_pending",
			kind: "column",
			value: {
				name: "remote_ip",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "device_pairing_pending",
			kind: "column",
			value: {
				name: "silent",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "device_pairing_pending",
			kind: "column",
			value: {
				name: "is_repair",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 15
			}
		},
		{
			table: "device_pairing_pending",
			kind: "column",
			value: {
				name: "ts",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 16
			}
		},
		{
			table: "device_pairing_pending",
			kind: "column",
			value: {
				name: "refreshed_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 17
			}
		},
		{
			table: "device_pairing_pending",
			kind: "primaryKey",
			value: ["request_id"]
		},
		{
			table: "device_pairing_pending",
			kind: "indexes",
			value: 2
		},
		{
			table: "device_pairing_pending",
			kind: "checks",
			value: 0
		},
		{
			table: "diagnostic_events",
			kind: "table",
			value: null
		},
		{
			table: "diagnostic_events",
			kind: "column",
			value: {
				name: "scope",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "diagnostic_events",
			kind: "column",
			value: {
				name: "event_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "diagnostic_events",
			kind: "column",
			value: {
				name: "payload_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "diagnostic_events",
			kind: "column",
			value: {
				name: "created_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "diagnostic_events",
			kind: "column",
			value: {
				name: "sequence",
				type: "bigint",
				nullable: false,
				identity: false,
				default: "0",
				position: 5
			}
		},
		{
			table: "diagnostic_events",
			kind: "primaryKey",
			value: ["scope", "event_key"]
		},
		{
			table: "diagnostic_events",
			kind: "indexes",
			value: 2
		},
		{
			table: "diagnostic_events",
			kind: "checks",
			value: 0
		},
		{
			table: "exec_approvals_config",
			kind: "table",
			value: null
		},
		{
			table: "exec_approvals_config",
			kind: "column",
			value: {
				name: "config_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "exec_approvals_config",
			kind: "column",
			value: {
				name: "raw_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "exec_approvals_config",
			kind: "column",
			value: {
				name: "socket_path",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "exec_approvals_config",
			kind: "column",
			value: {
				name: "has_socket_token",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "exec_approvals_config",
			kind: "column",
			value: {
				name: "default_security",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "exec_approvals_config",
			kind: "column",
			value: {
				name: "default_ask",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "exec_approvals_config",
			kind: "column",
			value: {
				name: "default_ask_fallback",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "exec_approvals_config",
			kind: "column",
			value: {
				name: "auto_allow_skills",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "exec_approvals_config",
			kind: "column",
			value: {
				name: "agent_count",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "exec_approvals_config",
			kind: "column",
			value: {
				name: "allowlist_count",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "exec_approvals_config",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "exec_approvals_config",
			kind: "primaryKey",
			value: ["config_key"]
		},
		{
			table: "exec_approvals_config",
			kind: "indexes",
			value: 1
		},
		{
			table: "exec_approvals_config",
			kind: "checks",
			value: 0
		},
		{
			table: "execution_decision_facts",
			kind: "table",
			value: null
		},
		{
			table: "execution_decision_facts",
			kind: "column",
			value: {
				name: "cursor_id",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "execution_decision_facts",
			kind: "column",
			value: {
				name: "receipt_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "execution_decision_facts",
			kind: "column",
			value: {
				name: "context_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "execution_decision_facts",
			kind: "column",
			value: {
				name: "execution_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "execution_decision_facts",
			kind: "column",
			value: {
				name: "run_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "execution_decision_facts",
			kind: "column",
			value: {
				name: "action_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "execution_decision_facts",
			kind: "column",
			value: {
				name: "action_family",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "execution_decision_facts",
			kind: "column",
			value: {
				name: "decision_outcome",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "execution_decision_facts",
			kind: "column",
			value: {
				name: "coverage_state",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "execution_decision_facts",
			kind: "column",
			value: {
				name: "reason_code",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "execution_decision_facts",
			kind: "column",
			value: {
				name: "owner",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "execution_decision_facts",
			kind: "column",
			value: {
				name: "source_ref",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "execution_decision_facts",
			kind: "column",
			value: {
				name: "occurred_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "execution_decision_facts",
			kind: "column",
			value: {
				name: "receipt_bytes",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "execution_decision_facts",
			kind: "column",
			value: {
				name: "receipt_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 15
			}
		},
		{
			table: "execution_decision_facts",
			kind: "primaryKey",
			value: ["receipt_id"]
		},
		{
			table: "execution_decision_facts",
			kind: "unique",
			value: ["occurred_at", "receipt_id"]
		},
		{
			table: "execution_decision_facts",
			kind: "indexes",
			value: 5
		},
		{
			table: "execution_decision_facts",
			kind: "checks",
			value: 14
		},
		{
			table: "execution_identity_contexts",
			kind: "table",
			value: null
		},
		{
			table: "execution_identity_contexts",
			kind: "column",
			value: {
				name: "context_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "execution_identity_contexts",
			kind: "column",
			value: {
				name: "execution_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "execution_identity_contexts",
			kind: "column",
			value: {
				name: "run_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "execution_identity_contexts",
			kind: "column",
			value: {
				name: "created_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "execution_identity_contexts",
			kind: "column",
			value: {
				name: "coverage_state",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "execution_identity_contexts",
			kind: "column",
			value: {
				name: "context_bytes",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "execution_identity_contexts",
			kind: "column",
			value: {
				name: "context_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "execution_identity_contexts",
			kind: "primaryKey",
			value: ["context_id"]
		},
		{
			table: "execution_identity_contexts",
			kind: "unique",
			value: ["execution_id"]
		},
		{
			table: "execution_identity_contexts",
			kind: "unique",
			value: ["created_at", "context_id"]
		},
		{
			table: "execution_identity_contexts",
			kind: "indexes",
			value: 4
		},
		{
			table: "execution_identity_contexts",
			kind: "checks",
			value: 7
		},
		{
			table: "execution_owner_lifecycle_bindings",
			kind: "table",
			value: null
		},
		{
			table: "execution_owner_lifecycle_bindings",
			kind: "column",
			value: {
				name: "owner_kind",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "execution_owner_lifecycle_bindings",
			kind: "column",
			value: {
				name: "owner_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "execution_owner_lifecycle_bindings",
			kind: "column",
			value: {
				name: "context_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "execution_owner_lifecycle_bindings",
			kind: "column",
			value: {
				name: "execution_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "execution_owner_lifecycle_bindings",
			kind: "primaryKey",
			value: ["owner_kind", "owner_id"]
		},
		{
			table: "execution_owner_lifecycle_bindings",
			kind: "indexes",
			value: 1
		},
		{
			table: "execution_owner_lifecycle_bindings",
			kind: "checks",
			value: 0
		},
		{
			table: "flow_runs",
			kind: "table",
			value: null
		},
		{
			table: "flow_runs",
			kind: "column",
			value: {
				name: "flow_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "flow_runs",
			kind: "column",
			value: {
				name: "shape",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "flow_runs",
			kind: "column",
			value: {
				name: "sync_mode",
				type: "text",
				nullable: false,
				identity: false,
				default: "'managed'",
				position: 3
			}
		},
		{
			table: "flow_runs",
			kind: "column",
			value: {
				name: "owner_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "flow_runs",
			kind: "column",
			value: {
				name: "requester_origin_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "flow_runs",
			kind: "column",
			value: {
				name: "controller_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "flow_runs",
			kind: "column",
			value: {
				name: "revision",
				type: "bigint",
				nullable: false,
				identity: false,
				default: "0",
				position: 7
			}
		},
		{
			table: "flow_runs",
			kind: "column",
			value: {
				name: "status",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "flow_runs",
			kind: "column",
			value: {
				name: "notify_policy",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "flow_runs",
			kind: "column",
			value: {
				name: "goal",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "flow_runs",
			kind: "column",
			value: {
				name: "current_step",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "flow_runs",
			kind: "column",
			value: {
				name: "blocked_task_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "flow_runs",
			kind: "column",
			value: {
				name: "blocked_summary",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "flow_runs",
			kind: "column",
			value: {
				name: "state_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "flow_runs",
			kind: "column",
			value: {
				name: "wait_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 15
			}
		},
		{
			table: "flow_runs",
			kind: "column",
			value: {
				name: "cancel_requested_at",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 16
			}
		},
		{
			table: "flow_runs",
			kind: "column",
			value: {
				name: "created_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 17
			}
		},
		{
			table: "flow_runs",
			kind: "column",
			value: {
				name: "updated_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 18
			}
		},
		{
			table: "flow_runs",
			kind: "column",
			value: {
				name: "ended_at",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 19
			}
		},
		{
			table: "flow_runs",
			kind: "primaryKey",
			value: ["flow_id"]
		},
		{
			table: "flow_runs",
			kind: "indexes",
			value: 4
		},
		{
			table: "flow_runs",
			kind: "checks",
			value: 0
		},
		{
			table: "gateway_boot_lifecycle",
			kind: "table",
			value: null
		},
		{
			table: "gateway_boot_lifecycle",
			kind: "column",
			value: {
				name: "boot_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "gateway_boot_lifecycle",
			kind: "column",
			value: {
				name: "pid",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "gateway_boot_lifecycle",
			kind: "column",
			value: {
				name: "started_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "gateway_boot_lifecycle",
			kind: "column",
			value: {
				name: "completed_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "gateway_boot_lifecycle",
			kind: "column",
			value: {
				name: "outcome",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "gateway_boot_lifecycle",
			kind: "column",
			value: {
				name: "startup_reason",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "gateway_boot_lifecycle",
			kind: "column",
			value: {
				name: "reason",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "gateway_boot_lifecycle",
			kind: "primaryKey",
			value: ["boot_id"]
		},
		{
			table: "gateway_boot_lifecycle",
			kind: "indexes",
			value: 2
		},
		{
			table: "gateway_boot_lifecycle",
			kind: "checks",
			value: 0
		},
		{
			table: "gateway_origin_device_tokens",
			kind: "table",
			value: null
		},
		{
			table: "gateway_origin_device_tokens",
			kind: "column",
			value: {
				name: "gateway_scope",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "gateway_origin_device_tokens",
			kind: "column",
			value: {
				name: "device_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "gateway_origin_device_tokens",
			kind: "column",
			value: {
				name: "role",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "gateway_origin_device_tokens",
			kind: "column",
			value: {
				name: "token",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "gateway_origin_device_tokens",
			kind: "column",
			value: {
				name: "scopes_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "gateway_origin_device_tokens",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "gateway_origin_device_tokens",
			kind: "primaryKey",
			value: [
				"gateway_scope",
				"device_id",
				"role"
			]
		},
		{
			table: "gateway_origin_device_tokens",
			kind: "indexes",
			value: 1
		},
		{
			table: "gateway_origin_device_tokens",
			kind: "checks",
			value: 0
		},
		{
			table: "gateway_restart_handoff",
			kind: "table",
			value: null
		},
		{
			table: "gateway_restart_handoff",
			kind: "column",
			value: {
				name: "handoff_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "gateway_restart_handoff",
			kind: "column",
			value: {
				name: "kind",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "gateway_restart_handoff",
			kind: "column",
			value: {
				name: "version",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "gateway_restart_handoff",
			kind: "column",
			value: {
				name: "intent_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "gateway_restart_handoff",
			kind: "column",
			value: {
				name: "pid",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "gateway_restart_handoff",
			kind: "column",
			value: {
				name: "process_instance_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "gateway_restart_handoff",
			kind: "column",
			value: {
				name: "created_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "gateway_restart_handoff",
			kind: "column",
			value: {
				name: "expires_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "gateway_restart_handoff",
			kind: "column",
			value: {
				name: "reason",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "gateway_restart_handoff",
			kind: "column",
			value: {
				name: "restart_trace_started_at",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "gateway_restart_handoff",
			kind: "column",
			value: {
				name: "restart_trace_last_at",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "gateway_restart_handoff",
			kind: "column",
			value: {
				name: "source",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "gateway_restart_handoff",
			kind: "column",
			value: {
				name: "restart_kind",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "gateway_restart_handoff",
			kind: "column",
			value: {
				name: "supervisor_mode",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "gateway_restart_handoff",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 15
			}
		},
		{
			table: "gateway_restart_handoff",
			kind: "primaryKey",
			value: ["handoff_key"]
		},
		{
			table: "gateway_restart_handoff",
			kind: "indexes",
			value: 2
		},
		{
			table: "gateway_restart_handoff",
			kind: "checks",
			value: 0
		},
		{
			table: "gateway_restart_intent",
			kind: "table",
			value: null
		},
		{
			table: "gateway_restart_intent",
			kind: "column",
			value: {
				name: "intent_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "gateway_restart_intent",
			kind: "column",
			value: {
				name: "kind",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "gateway_restart_intent",
			kind: "column",
			value: {
				name: "pid",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "gateway_restart_intent",
			kind: "column",
			value: {
				name: "created_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "gateway_restart_intent",
			kind: "column",
			value: {
				name: "reason",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "gateway_restart_intent",
			kind: "column",
			value: {
				name: "force",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "gateway_restart_intent",
			kind: "column",
			value: {
				name: "wait_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "gateway_restart_intent",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "gateway_restart_intent",
			kind: "primaryKey",
			value: ["intent_key"]
		},
		{
			table: "gateway_restart_intent",
			kind: "indexes",
			value: 1
		},
		{
			table: "gateway_restart_intent",
			kind: "checks",
			value: 0
		},
		{
			table: "gateway_restart_sentinel",
			kind: "table",
			value: null
		},
		{
			table: "gateway_restart_sentinel",
			kind: "column",
			value: {
				name: "sentinel_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "gateway_restart_sentinel",
			kind: "column",
			value: {
				name: "version",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "gateway_restart_sentinel",
			kind: "column",
			value: {
				name: "kind",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "gateway_restart_sentinel",
			kind: "column",
			value: {
				name: "status",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "gateway_restart_sentinel",
			kind: "column",
			value: {
				name: "ts",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "gateway_restart_sentinel",
			kind: "column",
			value: {
				name: "session_key",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "gateway_restart_sentinel",
			kind: "column",
			value: {
				name: "thread_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "gateway_restart_sentinel",
			kind: "column",
			value: {
				name: "delivery_channel",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "gateway_restart_sentinel",
			kind: "column",
			value: {
				name: "delivery_to",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "gateway_restart_sentinel",
			kind: "column",
			value: {
				name: "delivery_account_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "gateway_restart_sentinel",
			kind: "column",
			value: {
				name: "message",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "gateway_restart_sentinel",
			kind: "column",
			value: {
				name: "continuation_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "gateway_restart_sentinel",
			kind: "column",
			value: {
				name: "doctor_hint",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "gateway_restart_sentinel",
			kind: "column",
			value: {
				name: "stats_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "gateway_restart_sentinel",
			kind: "column",
			value: {
				name: "payload_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 15
			}
		},
		{
			table: "gateway_restart_sentinel",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 16
			}
		},
		{
			table: "gateway_restart_sentinel",
			kind: "primaryKey",
			value: ["sentinel_key"]
		},
		{
			table: "gateway_restart_sentinel",
			kind: "indexes",
			value: 2
		},
		{
			table: "gateway_restart_sentinel",
			kind: "checks",
			value: 0
		},
		{
			table: "github_personal_publication_requests",
			kind: "table",
			value: null
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "request_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "owner_profile_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "connection_generation",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "idempotency_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "request_digest",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "session_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "session_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "agent_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "worktree_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "repository_fingerprint",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "identity_source",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "identity_profile_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "identity_account_id",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "identity_login",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "title",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 15
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "body",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 16
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "status",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 17
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "gateway_instance_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 18
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "execution_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 19
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "last_effect",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 20
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "effect_state",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 21
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "push_repository",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 22
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "repository",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 23
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "branch",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 24
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "base_branch",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 25
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "source_head_commit",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 26
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "source_index_tree",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 27
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "workspace_tree",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 28
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "head_commit",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 29
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "pull_request_url",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 30
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "error_code",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 31
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "next_action",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 32
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 33
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 34
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "column",
			value: {
				name: "reported_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 35
			}
		},
		{
			table: "github_personal_publication_requests",
			kind: "primaryKey",
			value: ["request_id"]
		},
		{
			table: "github_personal_publication_requests",
			kind: "unique",
			value: [
				"owner_profile_id",
				"session_id",
				"idempotency_key"
			]
		},
		{
			table: "github_personal_publication_requests",
			kind: "indexes",
			value: 4
		},
		{
			table: "github_personal_publication_requests",
			kind: "checks",
			value: 37
		},
		{
			table: "github_publication_requests",
			kind: "table",
			value: null
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "request_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "idempotency_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "request_digest",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "session_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "session_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "agent_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "worktree_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "repository_fingerprint",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "claim_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "run_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "environment_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "owner_epoch",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "placement_generation",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "identity_source",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "identity_profile_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 15
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "identity_account_id",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 16
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "identity_login",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 17
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "title",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 18
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "body",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 19
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "status",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 20
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "gateway_instance_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 21
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "repository",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 22
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "branch",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 23
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "base_branch",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 24
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "source_head_commit",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 25
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "source_index_tree",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 26
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "workspace_tree",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 27
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "head_commit",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 28
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "pull_request_url",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 29
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "error_code",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 30
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "next_action",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 31
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 32
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 33
			}
		},
		{
			table: "github_publication_requests",
			kind: "column",
			value: {
				name: "reported_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 34
			}
		},
		{
			table: "github_publication_requests",
			kind: "primaryKey",
			value: ["request_id"]
		},
		{
			table: "github_publication_requests",
			kind: "unique",
			value: ["session_id", "idempotency_key"]
		},
		{
			table: "github_publication_requests",
			kind: "indexes",
			value: 3
		},
		{
			table: "github_publication_requests",
			kind: "checks",
			value: 9
		},
		{
			table: "github_publication_session_lifecycles",
			kind: "table",
			value: null
		},
		{
			table: "github_publication_session_lifecycles",
			kind: "column",
			value: {
				name: "publication_kind",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "github_publication_session_lifecycles",
			kind: "column",
			value: {
				name: "request_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "github_publication_session_lifecycles",
			kind: "column",
			value: {
				name: "lifecycle_revision",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "github_publication_session_lifecycles",
			kind: "column",
			value: {
				name: "requester_authority_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "github_publication_session_lifecycles",
			kind: "primaryKey",
			value: ["publication_kind", "request_id"]
		},
		{
			table: "github_publication_session_lifecycles",
			kind: "indexes",
			value: 1
		},
		{
			table: "github_publication_session_lifecycles",
			kind: "checks",
			value: 1
		},
		{
			table: "github_repository_publication_requests",
			kind: "table",
			value: null
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "request_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "owner_profile_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "connection_generation",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "idempotency_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "request_digest",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "session_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "session_lifecycle_revision",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "requester_authority_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "session_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "agent_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "workspace_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "checkpoint_ref",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "checkpoint_digest",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "claim_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "run_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 15
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "environment_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 16
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "owner_epoch",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 17
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "placement_generation",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 18
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "identity_source",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 19
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "identity_profile_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 20
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "identity_account_id",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 21
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "identity_login",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 22
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "title",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 23
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "body",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 24
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "status",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 25
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "gateway_instance_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 26
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "execution_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 27
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "last_effect",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 28
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "effect_state",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 29
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "push_repository",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 30
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "repository",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 31
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "branch",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 32
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "base_branch",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 33
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "source_head_commit",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 34
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "source_index_tree",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 35
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "workspace_tree",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 36
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "previous_head_commit",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 37
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "pushed_head_commit",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 38
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "head_commit",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 39
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "pull_request_url",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 40
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "error_code",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 41
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "next_action",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 42
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 43
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 44
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "column",
			value: {
				name: "reported_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 45
			}
		},
		{
			table: "github_repository_publication_requests",
			kind: "primaryKey",
			value: ["request_id"]
		},
		{
			table: "github_repository_publication_requests",
			kind: "indexes",
			value: 3
		},
		{
			table: "github_repository_publication_requests",
			kind: "checks",
			value: 7
		},
		{
			table: "local_workspace_projections",
			kind: "table",
			value: null
		},
		{
			table: "local_workspace_projections",
			kind: "column",
			value: {
				name: "worktree_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "local_workspace_projections",
			kind: "column",
			value: {
				name: "agent_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "local_workspace_projections",
			kind: "column",
			value: {
				name: "session_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "local_workspace_projections",
			kind: "column",
			value: {
				name: "session_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "local_workspace_projections",
			kind: "column",
			value: {
				name: "lifecycle_revision",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "local_workspace_projections",
			kind: "column",
			value: {
				name: "projection_path",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "local_workspace_projections",
			kind: "column",
			value: {
				name: "base_commit",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "local_workspace_projections",
			kind: "column",
			value: {
				name: "source_paths_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "local_workspace_projections",
			kind: "column",
			value: {
				name: "baseline_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "local_workspace_projections",
			kind: "column",
			value: {
				name: "baseline_ref",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "local_workspace_projections",
			kind: "column",
			value: {
				name: "pending_ref",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "local_workspace_projections",
			kind: "column",
			value: {
				name: "pending_target",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "local_workspace_projections",
			kind: "column",
			value: {
				name: "paused_runtimes_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "local_workspace_projections",
			kind: "column",
			value: {
				name: "journal_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "local_workspace_projections",
			kind: "column",
			value: {
				name: "journal_pack",
				type: "bytea",
				nullable: true,
				identity: false,
				default: null,
				position: 15
			}
		},
		{
			table: "local_workspace_projections",
			kind: "column",
			value: {
				name: "revision",
				type: "bigint",
				nullable: false,
				identity: false,
				default: "0",
				position: 16
			}
		},
		{
			table: "local_workspace_projections",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 17
			}
		},
		{
			table: "local_workspace_projections",
			kind: "primaryKey",
			value: ["worktree_id"]
		},
		{
			table: "local_workspace_projections",
			kind: "unique",
			value: ["projection_path"]
		},
		{
			table: "local_workspace_projections",
			kind: "indexes",
			value: 2
		},
		{
			table: "local_workspace_projections",
			kind: "checks",
			value: 5
		},
		{
			table: "macos_port_guardian_records",
			kind: "table",
			value: null
		},
		{
			table: "macos_port_guardian_records",
			kind: "column",
			value: {
				name: "pid",
				type: "bigint",
				nullable: false,
				identity: true,
				default: null,
				position: 1
			}
		},
		{
			table: "macos_port_guardian_records",
			kind: "column",
			value: {
				name: "port",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "macos_port_guardian_records",
			kind: "column",
			value: {
				name: "command",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "macos_port_guardian_records",
			kind: "column",
			value: {
				name: "mode",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "macos_port_guardian_records",
			kind: "column",
			value: {
				name: "timestamp",
				type: "double precision",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "macos_port_guardian_records",
			kind: "primaryKey",
			value: ["pid"]
		},
		{
			table: "macos_port_guardian_records",
			kind: "indexes",
			value: 2
		},
		{
			table: "macos_port_guardian_records",
			kind: "checks",
			value: 0
		},
		{
			table: "managed_outgoing_image_records",
			kind: "table",
			value: null
		},
		{
			table: "managed_outgoing_image_records",
			kind: "column",
			value: {
				name: "attachment_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "managed_outgoing_image_records",
			kind: "column",
			value: {
				name: "session_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "managed_outgoing_image_records",
			kind: "column",
			value: {
				name: "agent_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "managed_outgoing_image_records",
			kind: "column",
			value: {
				name: "message_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "managed_outgoing_image_records",
			kind: "column",
			value: {
				name: "created_at",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "managed_outgoing_image_records",
			kind: "column",
			value: {
				name: "updated_at",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "managed_outgoing_image_records",
			kind: "column",
			value: {
				name: "retention_class",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "managed_outgoing_image_records",
			kind: "column",
			value: {
				name: "alt",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "managed_outgoing_image_records",
			kind: "column",
			value: {
				name: "original_media_root",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "managed_outgoing_image_records",
			kind: "column",
			value: {
				name: "original_media_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "managed_outgoing_image_records",
			kind: "column",
			value: {
				name: "original_media_subdir",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "managed_outgoing_image_records",
			kind: "column",
			value: {
				name: "original_content_type",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "managed_outgoing_image_records",
			kind: "column",
			value: {
				name: "original_width",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "managed_outgoing_image_records",
			kind: "column",
			value: {
				name: "original_height",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "managed_outgoing_image_records",
			kind: "column",
			value: {
				name: "original_size_bytes",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 15
			}
		},
		{
			table: "managed_outgoing_image_records",
			kind: "column",
			value: {
				name: "original_filename",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 16
			}
		},
		{
			table: "managed_outgoing_image_records",
			kind: "column",
			value: {
				name: "record_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 17
			}
		},
		{
			table: "managed_outgoing_image_records",
			kind: "column",
			value: {
				name: "cleanup_pending",
				type: "bigint",
				nullable: false,
				identity: false,
				default: "0",
				position: 18
			}
		},
		{
			table: "managed_outgoing_image_records",
			kind: "primaryKey",
			value: ["attachment_id"]
		},
		{
			table: "managed_outgoing_image_records",
			kind: "indexes",
			value: 5
		},
		{
			table: "managed_outgoing_image_records",
			kind: "checks",
			value: 1
		},
		{
			table: "mcp_oauth_pending_authorizations",
			kind: "table",
			value: null
		},
		{
			table: "mcp_oauth_pending_authorizations",
			kind: "column",
			value: {
				name: "state",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "mcp_oauth_pending_authorizations",
			kind: "column",
			value: {
				name: "store_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "mcp_oauth_pending_authorizations",
			kind: "column",
			value: {
				name: "create_time",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "mcp_oauth_pending_authorizations",
			kind: "primaryKey",
			value: ["state"]
		},
		{
			table: "mcp_oauth_pending_authorizations",
			kind: "indexes",
			value: 1
		},
		{
			table: "mcp_oauth_pending_authorizations",
			kind: "checks",
			value: 0
		},
		{
			table: "mcp_oauth_stores",
			kind: "table",
			value: null
		},
		{
			table: "mcp_oauth_stores",
			kind: "column",
			value: {
				name: "store_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "mcp_oauth_stores",
			kind: "column",
			value: {
				name: "format_version",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "mcp_oauth_stores",
			kind: "column",
			value: {
				name: "store_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "mcp_oauth_stores",
			kind: "column",
			value: {
				name: "updated_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "mcp_oauth_stores",
			kind: "primaryKey",
			value: ["store_key"]
		},
		{
			table: "mcp_oauth_stores",
			kind: "indexes",
			value: 1
		},
		{
			table: "mcp_oauth_stores",
			kind: "checks",
			value: 1
		},
		{
			table: "meeting_transcript_sessions",
			kind: "table",
			value: null
		},
		{
			table: "meeting_transcript_sessions",
			kind: "column",
			value: {
				name: "session_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "meeting_transcript_sessions",
			kind: "column",
			value: {
				name: "started_at",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "meeting_transcript_sessions",
			kind: "column",
			value: {
				name: "selector",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "meeting_transcript_sessions",
			kind: "column",
			value: {
				name: "export_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "meeting_transcript_sessions",
			kind: "column",
			value: {
				name: "session_slug",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "meeting_transcript_sessions",
			kind: "column",
			value: {
				name: "provider_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "meeting_transcript_sessions",
			kind: "column",
			value: {
				name: "title",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "meeting_transcript_sessions",
			kind: "column",
			value: {
				name: "source_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "meeting_transcript_sessions",
			kind: "column",
			value: {
				name: "source_account_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "meeting_transcript_sessions",
			kind: "column",
			value: {
				name: "source_guild_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "meeting_transcript_sessions",
			kind: "column",
			value: {
				name: "source_channel_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "meeting_transcript_sessions",
			kind: "column",
			value: {
				name: "source_meeting_url",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "meeting_transcript_sessions",
			kind: "column",
			value: {
				name: "source_thread_ts",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "meeting_transcript_sessions",
			kind: "column",
			value: {
				name: "source_file_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "meeting_transcript_sessions",
			kind: "column",
			value: {
				name: "stopped_at",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 15
			}
		},
		{
			table: "meeting_transcript_sessions",
			kind: "column",
			value: {
				name: "metadata_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 16
			}
		},
		{
			table: "meeting_transcript_sessions",
			kind: "column",
			value: {
				name: "metadata_agent_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 17
			}
		},
		{
			table: "meeting_transcript_sessions",
			kind: "column",
			value: {
				name: "export_manifest_json",
				type: "text",
				nullable: false,
				identity: false,
				default: "'{}'",
				position: 18
			}
		},
		{
			table: "meeting_transcript_sessions",
			kind: "column",
			value: {
				name: "export_pending_json",
				type: "text",
				nullable: false,
				identity: false,
				default: "'[]'",
				position: 19
			}
		},
		{
			table: "meeting_transcript_sessions",
			kind: "column",
			value: {
				name: "next_utterance_seq",
				type: "bigint",
				nullable: false,
				identity: false,
				default: "0",
				position: 20
			}
		},
		{
			table: "meeting_transcript_sessions",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 21
			}
		},
		{
			table: "meeting_transcript_sessions",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 22
			}
		},
		{
			table: "meeting_transcript_sessions",
			kind: "primaryKey",
			value: ["session_id", "started_at"]
		},
		{
			table: "meeting_transcript_sessions",
			kind: "unique",
			value: ["selector"]
		},
		{
			table: "meeting_transcript_sessions",
			kind: "indexes",
			value: 9
		},
		{
			table: "meeting_transcript_sessions",
			kind: "checks",
			value: 3
		},
		{
			table: "meeting_transcript_summaries",
			kind: "table",
			value: null
		},
		{
			table: "meeting_transcript_summaries",
			kind: "column",
			value: {
				name: "session_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "meeting_transcript_summaries",
			kind: "column",
			value: {
				name: "session_started_at",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "meeting_transcript_summaries",
			kind: "column",
			value: {
				name: "generated_at",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "meeting_transcript_summaries",
			kind: "column",
			value: {
				name: "summary_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "meeting_transcript_summaries",
			kind: "column",
			value: {
				name: "overview",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "meeting_transcript_summaries",
			kind: "column",
			value: {
				name: "markdown",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "meeting_transcript_summaries",
			kind: "column",
			value: {
				name: "utterance_count",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "meeting_transcript_summaries",
			kind: "primaryKey",
			value: ["session_id", "session_started_at"]
		},
		{
			table: "meeting_transcript_summaries",
			kind: "foreignKey",
			value: {
				columns: ["session_id", "session_started_at"],
				target: "meeting_transcript_sessions",
				targetColumns: ["session_id", "started_at"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "meeting_transcript_summaries",
			kind: "indexes",
			value: 1
		},
		{
			table: "meeting_transcript_summaries",
			kind: "checks",
			value: 2
		},
		{
			table: "meeting_transcript_utterances",
			kind: "table",
			value: null
		},
		{
			table: "meeting_transcript_utterances",
			kind: "column",
			value: {
				name: "session_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "meeting_transcript_utterances",
			kind: "column",
			value: {
				name: "session_started_at",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "meeting_transcript_utterances",
			kind: "column",
			value: {
				name: "sequence",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "meeting_transcript_utterances",
			kind: "column",
			value: {
				name: "utterance_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "meeting_transcript_utterances",
			kind: "column",
			value: {
				name: "started_at",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "meeting_transcript_utterances",
			kind: "column",
			value: {
				name: "ended_at",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "meeting_transcript_utterances",
			kind: "column",
			value: {
				name: "speaker_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "meeting_transcript_utterances",
			kind: "column",
			value: {
				name: "speaker_label",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "meeting_transcript_utterances",
			kind: "column",
			value: {
				name: "text",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "meeting_transcript_utterances",
			kind: "column",
			value: {
				name: "final",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "meeting_transcript_utterances",
			kind: "column",
			value: {
				name: "metadata_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "meeting_transcript_utterances",
			kind: "primaryKey",
			value: [
				"session_id",
				"session_started_at",
				"sequence"
			]
		},
		{
			table: "meeting_transcript_utterances",
			kind: "foreignKey",
			value: {
				columns: ["session_id", "session_started_at"],
				target: "meeting_transcript_sessions",
				targetColumns: ["session_id", "started_at"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "meeting_transcript_utterances",
			kind: "indexes",
			value: 2
		},
		{
			table: "meeting_transcript_utterances",
			kind: "checks",
			value: 2
		},
		{
			table: "migration_runs",
			kind: "table",
			value: null
		},
		{
			table: "migration_runs",
			kind: "column",
			value: {
				name: "id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "migration_runs",
			kind: "column",
			value: {
				name: "started_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "migration_runs",
			kind: "column",
			value: {
				name: "finished_at",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "migration_runs",
			kind: "column",
			value: {
				name: "status",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "migration_runs",
			kind: "column",
			value: {
				name: "report_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "migration_runs",
			kind: "primaryKey",
			value: ["id"]
		},
		{
			table: "migration_runs",
			kind: "indexes",
			value: 2
		},
		{
			table: "migration_runs",
			kind: "checks",
			value: 0
		},
		{
			table: "migration_sources",
			kind: "table",
			value: null
		},
		{
			table: "migration_sources",
			kind: "column",
			value: {
				name: "source_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "migration_sources",
			kind: "column",
			value: {
				name: "migration_kind",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "migration_sources",
			kind: "column",
			value: {
				name: "source_path",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "migration_sources",
			kind: "column",
			value: {
				name: "target_table",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "migration_sources",
			kind: "column",
			value: {
				name: "source_sha256",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "migration_sources",
			kind: "column",
			value: {
				name: "source_size_bytes",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "migration_sources",
			kind: "column",
			value: {
				name: "source_record_count",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "migration_sources",
			kind: "column",
			value: {
				name: "last_run_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "migration_sources",
			kind: "column",
			value: {
				name: "status",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "migration_sources",
			kind: "column",
			value: {
				name: "imported_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "migration_sources",
			kind: "column",
			value: {
				name: "removed_source",
				type: "bigint",
				nullable: false,
				identity: false,
				default: "0",
				position: 11
			}
		},
		{
			table: "migration_sources",
			kind: "column",
			value: {
				name: "report_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "migration_sources",
			kind: "primaryKey",
			value: ["source_key"]
		},
		{
			table: "migration_sources",
			kind: "foreignKey",
			value: {
				columns: ["last_run_id"],
				target: "migration_runs",
				targetColumns: ["id"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "migration_sources",
			kind: "indexes",
			value: 3
		},
		{
			table: "migration_sources",
			kind: "checks",
			value: 0
		},
		{
			table: "native_hook_relay_bridges",
			kind: "table",
			value: null
		},
		{
			table: "native_hook_relay_bridges",
			kind: "column",
			value: {
				name: "relay_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "native_hook_relay_bridges",
			kind: "column",
			value: {
				name: "pid",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "native_hook_relay_bridges",
			kind: "column",
			value: {
				name: "hostname",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "native_hook_relay_bridges",
			kind: "column",
			value: {
				name: "port",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "native_hook_relay_bridges",
			kind: "column",
			value: {
				name: "token",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "native_hook_relay_bridges",
			kind: "column",
			value: {
				name: "expires_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "native_hook_relay_bridges",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "native_hook_relay_bridges",
			kind: "primaryKey",
			value: ["relay_id"]
		},
		{
			table: "native_hook_relay_bridges",
			kind: "indexes",
			value: 2
		},
		{
			table: "native_hook_relay_bridges",
			kind: "checks",
			value: 0
		},
		{
			table: "node_worker_launch_boots",
			kind: "table",
			value: null
		},
		{
			table: "node_worker_launch_boots",
			kind: "column",
			value: {
				name: "launch_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "node_worker_launch_boots",
			kind: "column",
			value: {
				name: "boot_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "node_worker_launch_boots",
			kind: "primaryKey",
			value: ["launch_id"]
		},
		{
			table: "node_worker_launch_boots",
			kind: "foreignKey",
			value: {
				columns: ["launch_id"],
				target: "node_worker_launches",
				targetColumns: ["launch_id"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "node_worker_launch_boots",
			kind: "indexes",
			value: 1
		},
		{
			table: "node_worker_launch_boots",
			kind: "checks",
			value: 1
		},
		{
			table: "node_worker_launch_cleanup",
			kind: "table",
			value: null
		},
		{
			table: "node_worker_launch_cleanup",
			kind: "column",
			value: {
				name: "launch_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "node_worker_launch_cleanup",
			kind: "column",
			value: {
				name: "cleanup_mode",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "node_worker_launch_cleanup",
			kind: "column",
			value: {
				name: "lineage_settled",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "node_worker_launch_cleanup",
			kind: "primaryKey",
			value: ["launch_id"]
		},
		{
			table: "node_worker_launch_cleanup",
			kind: "foreignKey",
			value: {
				columns: ["launch_id"],
				target: "node_worker_launches",
				targetColumns: ["launch_id"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "node_worker_launch_cleanup",
			kind: "indexes",
			value: 1
		},
		{
			table: "node_worker_launch_cleanup",
			kind: "checks",
			value: 2
		},
		{
			table: "node_worker_launch_containers",
			kind: "table",
			value: null
		},
		{
			table: "node_worker_launch_containers",
			kind: "column",
			value: {
				name: "launch_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "node_worker_launch_containers",
			kind: "column",
			value: {
				name: "container_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "node_worker_launch_containers",
			kind: "primaryKey",
			value: ["launch_id"]
		},
		{
			table: "node_worker_launch_containers",
			kind: "indexes",
			value: 1
		},
		{
			table: "node_worker_launch_containers",
			kind: "checks",
			value: 0
		},
		{
			table: "node_worker_launch_process_scopes",
			kind: "table",
			value: null
		},
		{
			table: "node_worker_launch_process_scopes",
			kind: "column",
			value: {
				name: "launch_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "node_worker_launch_process_scopes",
			kind: "column",
			value: {
				name: "scope_kind",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "node_worker_launch_process_scopes",
			kind: "column",
			value: {
				name: "descendants_reaped",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "node_worker_launch_process_scopes",
			kind: "primaryKey",
			value: ["launch_id"]
		},
		{
			table: "node_worker_launch_process_scopes",
			kind: "foreignKey",
			value: {
				columns: ["launch_id"],
				target: "node_worker_launches",
				targetColumns: ["launch_id"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "node_worker_launch_process_scopes",
			kind: "indexes",
			value: 1
		},
		{
			table: "node_worker_launch_process_scopes",
			kind: "checks",
			value: 2
		},
		{
			table: "node_worker_launches",
			kind: "table",
			value: null
		},
		{
			table: "node_worker_launches",
			kind: "column",
			value: {
				name: "launch_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "node_worker_launches",
			kind: "column",
			value: {
				name: "plan_hash",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "node_worker_launches",
			kind: "column",
			value: {
				name: "gateway_namespace",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "node_worker_launches",
			kind: "column",
			value: {
				name: "environment_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "node_worker_launches",
			kind: "column",
			value: {
				name: "session_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "node_worker_launches",
			kind: "column",
			value: {
				name: "owner_epoch",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "node_worker_launches",
			kind: "column",
			value: {
				name: "placement_generation",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "node_worker_launches",
			kind: "column",
			value: {
				name: "run_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "node_worker_launches",
			kind: "column",
			value: {
				name: "state",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "node_worker_launches",
			kind: "column",
			value: {
				name: "supervisor_pid",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "node_worker_launches",
			kind: "column",
			value: {
				name: "supervisor_start_time",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "node_worker_launches",
			kind: "column",
			value: {
				name: "worker_pid",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "node_worker_launches",
			kind: "column",
			value: {
				name: "worker_start_time",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "node_worker_launches",
			kind: "column",
			value: {
				name: "result_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "node_worker_launches",
			kind: "column",
			value: {
				name: "error_text",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 15
			}
		},
		{
			table: "node_worker_launches",
			kind: "column",
			value: {
				name: "completed_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 16
			}
		},
		{
			table: "node_worker_launches",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 17
			}
		},
		{
			table: "node_worker_launches",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 18
			}
		},
		{
			table: "node_worker_launches",
			kind: "primaryKey",
			value: ["launch_id"]
		},
		{
			table: "node_worker_launches",
			kind: "indexes",
			value: 2
		},
		{
			table: "node_worker_launches",
			kind: "checks",
			value: 20
		},
		{
			table: "node_worker_prepared_workspaces",
			kind: "table",
			value: null
		},
		{
			table: "node_worker_prepared_workspaces",
			kind: "column",
			value: {
				name: "preparation_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "node_worker_prepared_workspaces",
			kind: "column",
			value: {
				name: "cache_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "node_worker_prepared_workspaces",
			kind: "column",
			value: {
				name: "gateway_namespace",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "node_worker_prepared_workspaces",
			kind: "column",
			value: {
				name: "workspace_dir",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "node_worker_prepared_workspaces",
			kind: "column",
			value: {
				name: "home_dir",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "node_worker_prepared_workspaces",
			kind: "column",
			value: {
				name: "source_manifest_ref",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "node_worker_prepared_workspaces",
			kind: "column",
			value: {
				name: "prepared_manifest_ref",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "node_worker_prepared_workspaces",
			kind: "column",
			value: {
				name: "state",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "node_worker_prepared_workspaces",
			kind: "column",
			value: {
				name: "environment_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "node_worker_prepared_workspaces",
			kind: "column",
			value: {
				name: "session_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "node_worker_prepared_workspaces",
			kind: "column",
			value: {
				name: "session_key",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "node_worker_prepared_workspaces",
			kind: "column",
			value: {
				name: "owner_epoch",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "node_worker_prepared_workspaces",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "node_worker_prepared_workspaces",
			kind: "column",
			value: {
				name: "bound_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "node_worker_prepared_workspaces",
			kind: "column",
			value: {
				name: "retired_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 15
			}
		},
		{
			table: "node_worker_prepared_workspaces",
			kind: "primaryKey",
			value: ["preparation_key"]
		},
		{
			table: "node_worker_prepared_workspaces",
			kind: "unique",
			value: ["workspace_dir"]
		},
		{
			table: "node_worker_prepared_workspaces",
			kind: "indexes",
			value: 2
		},
		{
			table: "node_worker_prepared_workspaces",
			kind: "checks",
			value: 15
		},
		{
			table: "node_worker_turns",
			kind: "table",
			value: null
		},
		{
			table: "node_worker_turns",
			kind: "column",
			value: {
				name: "turn_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "node_worker_turns",
			kind: "column",
			value: {
				name: "owner_launch_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "node_worker_turns",
			kind: "column",
			value: {
				name: "plan_hash",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "node_worker_turns",
			kind: "column",
			value: {
				name: "run_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "node_worker_turns",
			kind: "column",
			value: {
				name: "state",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "node_worker_turns",
			kind: "column",
			value: {
				name: "result_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "node_worker_turns",
			kind: "column",
			value: {
				name: "error_text",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "node_worker_turns",
			kind: "column",
			value: {
				name: "completed_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "node_worker_turns",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "node_worker_turns",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "node_worker_turns",
			kind: "primaryKey",
			value: ["turn_id"]
		},
		{
			table: "node_worker_turns",
			kind: "foreignKey",
			value: {
				columns: ["owner_launch_id"],
				target: "node_worker_launches",
				targetColumns: ["launch_id"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "node_worker_turns",
			kind: "indexes",
			value: 3
		},
		{
			table: "node_worker_turns",
			kind: "checks",
			value: 10
		},
		{
			table: "official_external_plugin_catalog_snapshots",
			kind: "table",
			value: null
		},
		{
			table: "official_external_plugin_catalog_snapshots",
			kind: "column",
			value: {
				name: "feed_url",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "official_external_plugin_catalog_snapshots",
			kind: "column",
			value: {
				name: "body",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "official_external_plugin_catalog_snapshots",
			kind: "column",
			value: {
				name: "status",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "official_external_plugin_catalog_snapshots",
			kind: "column",
			value: {
				name: "etag",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "official_external_plugin_catalog_snapshots",
			kind: "column",
			value: {
				name: "last_modified",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "official_external_plugin_catalog_snapshots",
			kind: "column",
			value: {
				name: "checksum",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "official_external_plugin_catalog_snapshots",
			kind: "column",
			value: {
				name: "saved_at",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "official_external_plugin_catalog_snapshots",
			kind: "column",
			value: {
				name: "trust_mode",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "official_external_plugin_catalog_snapshots",
			kind: "column",
			value: {
				name: "trust_key_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "official_external_plugin_catalog_snapshots",
			kind: "column",
			value: {
				name: "trust_signature_count",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "official_external_plugin_catalog_snapshots",
			kind: "column",
			value: {
				name: "trust_threshold",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "official_external_plugin_catalog_snapshots",
			kind: "column",
			value: {
				name: "trust_verified_at",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "official_external_plugin_catalog_snapshots",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "official_external_plugin_catalog_snapshots",
			kind: "primaryKey",
			value: ["feed_url"]
		},
		{
			table: "official_external_plugin_catalog_snapshots",
			kind: "indexes",
			value: 2
		},
		{
			table: "official_external_plugin_catalog_snapshots",
			kind: "checks",
			value: 0
		},
		{
			table: "operator_approval_execution_identities",
			kind: "table",
			value: null
		},
		{
			table: "operator_approval_execution_identities",
			kind: "column",
			value: {
				name: "approval_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "operator_approval_execution_identities",
			kind: "column",
			value: {
				name: "source_context_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "operator_approval_execution_identities",
			kind: "column",
			value: {
				name: "source_execution_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "operator_approval_execution_identities",
			kind: "primaryKey",
			value: ["approval_id"]
		},
		{
			table: "operator_approval_execution_identities",
			kind: "foreignKey",
			value: {
				columns: ["approval_id"],
				target: "operator_approvals",
				targetColumns: ["approval_id"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "operator_approval_execution_identities",
			kind: "indexes",
			value: 1
		},
		{
			table: "operator_approval_execution_identities",
			kind: "checks",
			value: 2
		},
		{
			table: "operator_approval_standing_grant_generations",
			kind: "table",
			value: null
		},
		{
			table: "operator_approval_standing_grant_generations",
			kind: "column",
			value: {
				name: "grant_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "operator_approval_standing_grant_generations",
			kind: "column",
			value: {
				name: "job_definition_generation",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "operator_approval_standing_grant_generations",
			kind: "primaryKey",
			value: ["grant_id"]
		},
		{
			table: "operator_approval_standing_grant_generations",
			kind: "foreignKey",
			value: {
				columns: ["grant_id"],
				target: "operator_approval_standing_grants",
				targetColumns: ["grant_id"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "operator_approval_standing_grant_generations",
			kind: "indexes",
			value: 1
		},
		{
			table: "operator_approval_standing_grant_generations",
			kind: "checks",
			value: 1
		},
		{
			table: "operator_approval_standing_grants",
			kind: "table",
			value: null
		},
		{
			table: "operator_approval_standing_grants",
			kind: "column",
			value: {
				name: "grant_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "operator_approval_standing_grants",
			kind: "column",
			value: {
				name: "minted_by_approval_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "operator_approval_standing_grants",
			kind: "column",
			value: {
				name: "agent_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "operator_approval_standing_grants",
			kind: "column",
			value: {
				name: "cron_job_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "operator_approval_standing_grants",
			kind: "column",
			value: {
				name: "job_config_revision",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "operator_approval_standing_grants",
			kind: "column",
			value: {
				name: "operation_binding",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "operator_approval_standing_grants",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "operator_approval_standing_grants",
			kind: "column",
			value: {
				name: "expires_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "operator_approval_standing_grants",
			kind: "column",
			value: {
				name: "revoked_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "operator_approval_standing_grants",
			kind: "column",
			value: {
				name: "revoked_by",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "operator_approval_standing_grants",
			kind: "column",
			value: {
				name: "last_used_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "operator_approval_standing_grants",
			kind: "column",
			value: {
				name: "use_count",
				type: "bigint",
				nullable: false,
				identity: false,
				default: "0",
				position: 12
			}
		},
		{
			table: "operator_approval_standing_grants",
			kind: "primaryKey",
			value: ["grant_id"]
		},
		{
			table: "operator_approval_standing_grants",
			kind: "foreignKey",
			value: {
				columns: ["minted_by_approval_id"],
				target: "operator_approvals",
				targetColumns: ["approval_id"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "operator_approval_standing_grants",
			kind: "indexes",
			value: 2
		},
		{
			table: "operator_approval_standing_grants",
			kind: "checks",
			value: 6
		},
		{
			table: "operator_approvals",
			kind: "table",
			value: null
		},
		{
			table: "operator_approvals",
			kind: "column",
			value: {
				name: "cursor_id",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "operator_approvals",
			kind: "column",
			value: {
				name: "approval_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "operator_approvals",
			kind: "column",
			value: {
				name: "resolution_ref",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "operator_approvals",
			kind: "column",
			value: {
				name: "kind",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "operator_approvals",
			kind: "column",
			value: {
				name: "status",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "operator_approvals",
			kind: "column",
			value: {
				name: "presentation_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "operator_approvals",
			kind: "column",
			value: {
				name: "requested_by_device_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "operator_approvals",
			kind: "column",
			value: {
				name: "requested_by_client_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "operator_approvals",
			kind: "column",
			value: {
				name: "requested_by_device_token_auth",
				type: "bigint",
				nullable: false,
				identity: false,
				default: "0",
				position: 9
			}
		},
		{
			table: "operator_approvals",
			kind: "column",
			value: {
				name: "reviewer_device_ids_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "operator_approvals",
			kind: "column",
			value: {
				name: "source_agent_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "operator_approvals",
			kind: "column",
			value: {
				name: "source_session_key",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "operator_approvals",
			kind: "column",
			value: {
				name: "source_session_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "operator_approvals",
			kind: "column",
			value: {
				name: "source_run_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "operator_approvals",
			kind: "column",
			value: {
				name: "source_tool_call_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 15
			}
		},
		{
			table: "operator_approvals",
			kind: "column",
			value: {
				name: "source_tool_name",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 16
			}
		},
		{
			table: "operator_approvals",
			kind: "column",
			value: {
				name: "audience_session_keys_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 17
			}
		},
		{
			table: "operator_approvals",
			kind: "column",
			value: {
				name: "runtime_epoch",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 18
			}
		},
		{
			table: "operator_approvals",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 19
			}
		},
		{
			table: "operator_approvals",
			kind: "column",
			value: {
				name: "expires_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 20
			}
		},
		{
			table: "operator_approvals",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 21
			}
		},
		{
			table: "operator_approvals",
			kind: "column",
			value: {
				name: "decision",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 22
			}
		},
		{
			table: "operator_approvals",
			kind: "column",
			value: {
				name: "terminal_reason",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 23
			}
		},
		{
			table: "operator_approvals",
			kind: "column",
			value: {
				name: "resolved_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 24
			}
		},
		{
			table: "operator_approvals",
			kind: "column",
			value: {
				name: "resolver_kind",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 25
			}
		},
		{
			table: "operator_approvals",
			kind: "column",
			value: {
				name: "resolver_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 26
			}
		},
		{
			table: "operator_approvals",
			kind: "column",
			value: {
				name: "consumed_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 27
			}
		},
		{
			table: "operator_approvals",
			kind: "column",
			value: {
				name: "consumed_by",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 28
			}
		},
		{
			table: "operator_approvals",
			kind: "primaryKey",
			value: ["approval_id"]
		},
		{
			table: "operator_approvals",
			kind: "indexes",
			value: 8
		},
		{
			table: "operator_approvals",
			kind: "checks",
			value: 16
		},
		{
			table: "outbound_media_provenance",
			kind: "table",
			value: null
		},
		{
			table: "outbound_media_provenance",
			kind: "column",
			value: {
				name: "realpath",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "outbound_media_provenance",
			kind: "column",
			value: {
				name: "kind",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "outbound_media_provenance",
			kind: "column",
			value: {
				name: "version",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "outbound_media_provenance",
			kind: "column",
			value: {
				name: "sha256",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "outbound_media_provenance",
			kind: "column",
			value: {
				name: "size_bytes",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "outbound_media_provenance",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "outbound_media_provenance",
			kind: "primaryKey",
			value: ["realpath"]
		},
		{
			table: "outbound_media_provenance",
			kind: "indexes",
			value: 1
		},
		{
			table: "outbound_media_provenance",
			kind: "checks",
			value: 0
		},
		{
			table: "outbound_message_execution_bindings",
			kind: "table",
			value: null
		},
		{
			table: "outbound_message_execution_bindings",
			kind: "column",
			value: {
				name: "event_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "outbound_message_execution_bindings",
			kind: "column",
			value: {
				name: "context_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "outbound_message_execution_bindings",
			kind: "column",
			value: {
				name: "execution_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "outbound_message_execution_bindings",
			kind: "column",
			value: {
				name: "run_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "outbound_message_execution_bindings",
			kind: "primaryKey",
			value: ["event_id"]
		},
		{
			table: "outbound_message_execution_bindings",
			kind: "foreignKey",
			value: {
				columns: ["event_id"],
				target: "audit_events",
				targetColumns: ["event_id"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "outbound_message_execution_bindings",
			kind: "indexes",
			value: 2
		},
		{
			table: "outbound_message_execution_bindings",
			kind: "checks",
			value: 3
		},
		{
			table: "outbound_message_progress",
			kind: "table",
			value: null
		},
		{
			table: "outbound_message_progress",
			kind: "column",
			value: {
				name: "sequence",
				type: "bigint",
				nullable: false,
				identity: true,
				default: null,
				position: 1
			}
		},
		{
			table: "outbound_message_progress",
			kind: "column",
			value: {
				name: "progress_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "outbound_message_progress",
			kind: "column",
			value: {
				name: "source_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "outbound_message_progress",
			kind: "column",
			value: {
				name: "source_sequence",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "outbound_message_progress",
			kind: "column",
			value: {
				name: "schema_version",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "outbound_message_progress",
			kind: "column",
			value: {
				name: "occurred_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "outbound_message_progress",
			kind: "column",
			value: {
				name: "action",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "outbound_message_progress",
			kind: "column",
			value: {
				name: "outcome",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "outbound_message_progress",
			kind: "column",
			value: {
				name: "actor_type",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "outbound_message_progress",
			kind: "column",
			value: {
				name: "actor_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "outbound_message_progress",
			kind: "column",
			value: {
				name: "agent_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "outbound_message_progress",
			kind: "column",
			value: {
				name: "run_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "outbound_message_progress",
			kind: "column",
			value: {
				name: "context_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "outbound_message_progress",
			kind: "column",
			value: {
				name: "execution_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "outbound_message_progress",
			kind: "column",
			value: {
				name: "channel",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 15
			}
		},
		{
			table: "outbound_message_progress",
			kind: "column",
			value: {
				name: "conversation_kind",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 16
			}
		},
		{
			table: "outbound_message_progress",
			kind: "column",
			value: {
				name: "duration_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 17
			}
		},
		{
			table: "outbound_message_progress",
			kind: "column",
			value: {
				name: "account_ref",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 18
			}
		},
		{
			table: "outbound_message_progress",
			kind: "column",
			value: {
				name: "conversation_ref",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 19
			}
		},
		{
			table: "outbound_message_progress",
			kind: "column",
			value: {
				name: "target_ref",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 20
			}
		},
		{
			table: "outbound_message_progress",
			kind: "primaryKey",
			value: ["sequence"]
		},
		{
			table: "outbound_message_progress",
			kind: "unique",
			value: ["progress_id"]
		},
		{
			table: "outbound_message_progress",
			kind: "unique",
			value: ["source_id"]
		},
		{
			table: "outbound_message_progress",
			kind: "unique",
			value: ["occurred_at", "progress_id"]
		},
		{
			table: "outbound_message_progress",
			kind: "indexes",
			value: 6
		},
		{
			table: "outbound_message_progress",
			kind: "checks",
			value: 14
		},
		{
			table: "plugin_binding_approvals",
			kind: "table",
			value: null
		},
		{
			table: "plugin_binding_approvals",
			kind: "column",
			value: {
				name: "plugin_root",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "plugin_binding_approvals",
			kind: "column",
			value: {
				name: "channel",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "plugin_binding_approvals",
			kind: "column",
			value: {
				name: "account_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "plugin_binding_approvals",
			kind: "column",
			value: {
				name: "plugin_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "plugin_binding_approvals",
			kind: "column",
			value: {
				name: "plugin_name",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "plugin_binding_approvals",
			kind: "column",
			value: {
				name: "approved_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "plugin_binding_approvals",
			kind: "primaryKey",
			value: [
				"plugin_root",
				"channel",
				"account_id"
			]
		},
		{
			table: "plugin_binding_approvals",
			kind: "indexes",
			value: 2
		},
		{
			table: "plugin_binding_approvals",
			kind: "checks",
			value: 0
		},
		{
			table: "plugin_blob_entries",
			kind: "table",
			value: null
		},
		{
			table: "plugin_blob_entries",
			kind: "column",
			value: {
				name: "plugin_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "plugin_blob_entries",
			kind: "column",
			value: {
				name: "namespace",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "plugin_blob_entries",
			kind: "column",
			value: {
				name: "entry_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "plugin_blob_entries",
			kind: "column",
			value: {
				name: "metadata_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "plugin_blob_entries",
			kind: "column",
			value: {
				name: "blob",
				type: "bytea",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "plugin_blob_entries",
			kind: "column",
			value: {
				name: "created_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "plugin_blob_entries",
			kind: "column",
			value: {
				name: "expires_at",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "plugin_blob_entries",
			kind: "primaryKey",
			value: [
				"plugin_id",
				"namespace",
				"entry_key"
			]
		},
		{
			table: "plugin_blob_entries",
			kind: "indexes",
			value: 3
		},
		{
			table: "plugin_blob_entries",
			kind: "checks",
			value: 0
		},
		{
			table: "plugin_state_entries",
			kind: "table",
			value: null
		},
		{
			table: "plugin_state_entries",
			kind: "column",
			value: {
				name: "plugin_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "plugin_state_entries",
			kind: "column",
			value: {
				name: "namespace",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "plugin_state_entries",
			kind: "column",
			value: {
				name: "entry_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "plugin_state_entries",
			kind: "column",
			value: {
				name: "value_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "plugin_state_entries",
			kind: "column",
			value: {
				name: "created_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "plugin_state_entries",
			kind: "column",
			value: {
				name: "expires_at",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "plugin_state_entries",
			kind: "primaryKey",
			value: [
				"plugin_id",
				"namespace",
				"entry_key"
			]
		},
		{
			table: "plugin_state_entries",
			kind: "indexes",
			value: 3
		},
		{
			table: "plugin_state_entries",
			kind: "checks",
			value: 0
		},
		{
			table: "projects",
			kind: "table",
			value: null
		},
		{
			table: "projects",
			kind: "column",
			value: {
				name: "id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "projects",
			kind: "column",
			value: {
				name: "display_name",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "projects",
			kind: "column",
			value: {
				name: "repo_root",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "projects",
			kind: "column",
			value: {
				name: "origin_url",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "projects",
			kind: "column",
			value: {
				name: "source",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "projects",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "projects",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "projects",
			kind: "primaryKey",
			value: ["id"]
		},
		{
			table: "projects",
			kind: "indexes",
			value: 1
		},
		{
			table: "projects",
			kind: "checks",
			value: 1
		},
		{
			table: "sandbox_registry_entries",
			kind: "table",
			value: null
		},
		{
			table: "sandbox_registry_entries",
			kind: "column",
			value: {
				name: "registry_kind",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "sandbox_registry_entries",
			kind: "column",
			value: {
				name: "container_name",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "sandbox_registry_entries",
			kind: "column",
			value: {
				name: "session_key",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "sandbox_registry_entries",
			kind: "column",
			value: {
				name: "backend_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "sandbox_registry_entries",
			kind: "column",
			value: {
				name: "runtime_label",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "sandbox_registry_entries",
			kind: "column",
			value: {
				name: "image",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "sandbox_registry_entries",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "sandbox_registry_entries",
			kind: "column",
			value: {
				name: "last_used_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "sandbox_registry_entries",
			kind: "column",
			value: {
				name: "config_label_kind",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "sandbox_registry_entries",
			kind: "column",
			value: {
				name: "config_hash",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "sandbox_registry_entries",
			kind: "column",
			value: {
				name: "cdp_port",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "sandbox_registry_entries",
			kind: "column",
			value: {
				name: "no_vnc_port",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "sandbox_registry_entries",
			kind: "column",
			value: {
				name: "entry_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "sandbox_registry_entries",
			kind: "column",
			value: {
				name: "updated_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "sandbox_registry_entries",
			kind: "primaryKey",
			value: ["registry_kind", "container_name"]
		},
		{
			table: "sandbox_registry_entries",
			kind: "indexes",
			value: 4
		},
		{
			table: "sandbox_registry_entries",
			kind: "checks",
			value: 0
		},
		{
			table: "schema_meta",
			kind: "table",
			value: null
		},
		{
			table: "schema_meta",
			kind: "column",
			value: {
				name: "meta_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "schema_meta",
			kind: "column",
			value: {
				name: "role",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "schema_meta",
			kind: "column",
			value: {
				name: "schema_version",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "schema_meta",
			kind: "column",
			value: {
				name: "agent_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "schema_meta",
			kind: "column",
			value: {
				name: "app_version",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "schema_meta",
			kind: "column",
			value: {
				name: "created_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "schema_meta",
			kind: "column",
			value: {
				name: "updated_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "schema_meta",
			kind: "primaryKey",
			value: ["meta_key"]
		},
		{
			table: "schema_meta",
			kind: "indexes",
			value: 1
		},
		{
			table: "schema_meta",
			kind: "checks",
			value: 0
		},
		{
			table: "secret_store_entries",
			kind: "table",
			value: null
		},
		{
			table: "secret_store_entries",
			kind: "column",
			value: {
				name: "scope_kind",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "secret_store_entries",
			kind: "column",
			value: {
				name: "scope_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "secret_store_entries",
			kind: "column",
			value: {
				name: "name",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "secret_store_entries",
			kind: "column",
			value: {
				name: "value",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "secret_store_entries",
			kind: "column",
			value: {
				name: "kind",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "secret_store_entries",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "secret_store_entries",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "secret_store_entries",
			kind: "column",
			value: {
				name: "updated_by",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "secret_store_entries",
			kind: "column",
			value: {
				name: "deleted_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "secret_store_entries",
			kind: "column",
			value: {
				name: "allowed_hosts",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "secret_store_entries",
			kind: "primaryKey",
			value: [
				"scope_kind",
				"scope_id",
				"name"
			]
		},
		{
			table: "secret_store_entries",
			kind: "indexes",
			value: 2
		},
		{
			table: "secret_store_entries",
			kind: "checks",
			value: 5
		},
		{
			table: "session_groups",
			kind: "table",
			value: null
		},
		{
			table: "session_groups",
			kind: "column",
			value: {
				name: "name",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "session_groups",
			kind: "column",
			value: {
				name: "position",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "session_groups",
			kind: "column",
			value: {
				name: "created_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "session_groups",
			kind: "column",
			value: {
				name: "cwd",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "session_groups",
			kind: "column",
			value: {
				name: "worktree",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "session_groups",
			kind: "primaryKey",
			value: ["name"]
		},
		{
			table: "session_groups",
			kind: "indexes",
			value: 1
		},
		{
			table: "session_groups",
			kind: "checks",
			value: 0
		},
		{
			table: "session_repository_workspaces",
			kind: "table",
			value: null
		},
		{
			table: "session_repository_workspaces",
			kind: "column",
			value: {
				name: "workspace_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "session_repository_workspaces",
			kind: "column",
			value: {
				name: "agent_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "session_repository_workspaces",
			kind: "column",
			value: {
				name: "session_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "session_repository_workspaces",
			kind: "column",
			value: {
				name: "url",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "session_repository_workspaces",
			kind: "column",
			value: {
				name: "requested_ref",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "session_repository_workspaces",
			kind: "column",
			value: {
				name: "run_setup_script",
				type: "bigint",
				nullable: false,
				identity: false,
				default: "0",
				position: 6
			}
		},
		{
			table: "session_repository_workspaces",
			kind: "column",
			value: {
				name: "base_commit",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "session_repository_workspaces",
			kind: "column",
			value: {
				name: "base_manifest_hash",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "session_repository_workspaces",
			kind: "column",
			value: {
				name: "branch",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "session_repository_workspaces",
			kind: "column",
			value: {
				name: "checkpoint_ref",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "session_repository_workspaces",
			kind: "column",
			value: {
				name: "manifest_hash",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "session_repository_workspaces",
			kind: "column",
			value: {
				name: "revision",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "session_repository_workspaces",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "session_repository_workspaces",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "session_repository_workspaces",
			kind: "primaryKey",
			value: ["workspace_id"]
		},
		{
			table: "session_repository_workspaces",
			kind: "unique",
			value: ["agent_id", "session_key"]
		},
		{
			table: "session_repository_workspaces",
			kind: "indexes",
			value: 2
		},
		{
			table: "session_repository_workspaces",
			kind: "checks",
			value: 11
		},
		{
			table: "session_state_events",
			kind: "table",
			value: null
		},
		{
			table: "session_state_events",
			kind: "column",
			value: {
				name: "sequence",
				type: "bigint",
				nullable: false,
				identity: true,
				default: null,
				position: 1
			}
		},
		{
			table: "session_state_events",
			kind: "column",
			value: {
				name: "dedupe_key",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "session_state_events",
			kind: "column",
			value: {
				name: "session_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "session_state_events",
			kind: "column",
			value: {
				name: "session_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "session_state_events",
			kind: "column",
			value: {
				name: "agent_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "session_state_events",
			kind: "column",
			value: {
				name: "kind",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "session_state_events",
			kind: "column",
			value: {
				name: "actor_type",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "session_state_events",
			kind: "column",
			value: {
				name: "actor_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "session_state_events",
			kind: "column",
			value: {
				name: "run_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "session_state_events",
			kind: "column",
			value: {
				name: "occurred_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "session_state_events",
			kind: "column",
			value: {
				name: "summary",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "session_state_events",
			kind: "column",
			value: {
				name: "payload_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "session_state_events",
			kind: "primaryKey",
			value: ["sequence"]
		},
		{
			table: "session_state_events",
			kind: "unique",
			value: ["dedupe_key"]
		},
		{
			table: "session_state_events",
			kind: "indexes",
			value: 4
		},
		{
			table: "session_state_events",
			kind: "checks",
			value: 0
		},
		{
			table: "session_state_heads",
			kind: "table",
			value: null
		},
		{
			table: "session_state_heads",
			kind: "column",
			value: {
				name: "session_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "session_state_heads",
			kind: "column",
			value: {
				name: "agent_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "session_state_heads",
			kind: "column",
			value: {
				name: "last_sequence",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "session_state_heads",
			kind: "column",
			value: {
				name: "pruned_max_sequence",
				type: "bigint",
				nullable: false,
				identity: false,
				default: "0",
				position: 4
			}
		},
		{
			table: "session_state_heads",
			kind: "column",
			value: {
				name: "updated_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "session_state_heads",
			kind: "primaryKey",
			value: ["session_key", "agent_id"]
		},
		{
			table: "session_state_heads",
			kind: "indexes",
			value: 1
		},
		{
			table: "session_state_heads",
			kind: "checks",
			value: 0
		},
		{
			table: "session_upstream_links",
			kind: "table",
			value: null
		},
		{
			table: "session_upstream_links",
			kind: "column",
			value: {
				name: "session_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "session_upstream_links",
			kind: "column",
			value: {
				name: "agent_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "session_upstream_links",
			kind: "column",
			value: {
				name: "catalog_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "session_upstream_links",
			kind: "column",
			value: {
				name: "host_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "session_upstream_links",
			kind: "column",
			value: {
				name: "thread_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "session_upstream_links",
			kind: "column",
			value: {
				name: "upstream_kind",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "session_upstream_links",
			kind: "column",
			value: {
				name: "upstream_ref_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "session_upstream_links",
			kind: "column",
			value: {
				name: "last_marker_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "session_upstream_links",
			kind: "column",
			value: {
				name: "last_scanned_at",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "session_upstream_links",
			kind: "column",
			value: {
				name: "created_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "session_upstream_links",
			kind: "column",
			value: {
				name: "updated_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "session_upstream_links",
			kind: "primaryKey",
			value: ["session_key", "agent_id"]
		},
		{
			table: "session_upstream_links",
			kind: "indexes",
			value: 2
		},
		{
			table: "session_upstream_links",
			kind: "checks",
			value: 0
		},
		{
			table: "session_watch_cursors",
			kind: "table",
			value: null
		},
		{
			table: "session_watch_cursors",
			kind: "column",
			value: {
				name: "watcher_session_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "session_watch_cursors",
			kind: "column",
			value: {
				name: "watcher_store_path",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "session_watch_cursors",
			kind: "column",
			value: {
				name: "target_session_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "session_watch_cursors",
			kind: "column",
			value: {
				name: "last_seen_sequence",
				type: "bigint",
				nullable: false,
				identity: false,
				default: "0",
				position: 4
			}
		},
		{
			table: "session_watch_cursors",
			kind: "column",
			value: {
				name: "notified_sequence",
				type: "bigint",
				nullable: false,
				identity: false,
				default: "0",
				position: 5
			}
		},
		{
			table: "session_watch_cursors",
			kind: "column",
			value: {
				name: "material_sequence",
				type: "bigint",
				nullable: false,
				identity: false,
				default: "0",
				position: 6
			}
		},
		{
			table: "session_watch_cursors",
			kind: "column",
			value: {
				name: "provenance",
				type: "text",
				nullable: false,
				identity: false,
				default: "'explicit'",
				position: 7
			}
		},
		{
			table: "session_watch_cursors",
			kind: "column",
			value: {
				name: "updated_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "session_watch_cursors",
			kind: "primaryKey",
			value: ["watcher_session_key", "target_session_key"]
		},
		{
			table: "session_watch_cursors",
			kind: "indexes",
			value: 2
		},
		{
			table: "session_watch_cursors",
			kind: "checks",
			value: 1
		},
		{
			table: "skill_library_entries",
			kind: "table",
			value: null
		},
		{
			table: "skill_library_entries",
			kind: "column",
			value: {
				name: "skill_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "skill_library_entries",
			kind: "column",
			value: {
				name: "owner_profile_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "skill_library_entries",
			kind: "column",
			value: {
				name: "author_profile_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "skill_library_entries",
			kind: "column",
			value: {
				name: "slug",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "skill_library_entries",
			kind: "column",
			value: {
				name: "current_revision",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "skill_library_entries",
			kind: "column",
			value: {
				name: "shared",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "skill_library_entries",
			kind: "column",
			value: {
				name: "enabled",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "skill_library_entries",
			kind: "column",
			value: {
				name: "removed",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "skill_library_entries",
			kind: "column",
			value: {
				name: "created_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "skill_library_entries",
			kind: "column",
			value: {
				name: "updated_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "skill_library_entries",
			kind: "primaryKey",
			value: ["skill_id"]
		},
		{
			table: "skill_library_entries",
			kind: "indexes",
			value: 1
		},
		{
			table: "skill_library_entries",
			kind: "checks",
			value: 0
		},
		{
			table: "skill_library_events",
			kind: "table",
			value: null
		},
		{
			table: "skill_library_events",
			kind: "column",
			value: {
				name: "event_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "skill_library_events",
			kind: "column",
			value: {
				name: "skill_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "skill_library_events",
			kind: "column",
			value: {
				name: "revision",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "skill_library_events",
			kind: "column",
			value: {
				name: "action",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "skill_library_events",
			kind: "column",
			value: {
				name: "actor_profile_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "skill_library_events",
			kind: "column",
			value: {
				name: "created_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "skill_library_events",
			kind: "primaryKey",
			value: ["event_id"]
		},
		{
			table: "skill_library_events",
			kind: "indexes",
			value: 1
		},
		{
			table: "skill_library_events",
			kind: "checks",
			value: 0
		},
		{
			table: "skill_library_revisions",
			kind: "table",
			value: null
		},
		{
			table: "skill_library_revisions",
			kind: "column",
			value: {
				name: "skill_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "skill_library_revisions",
			kind: "column",
			value: {
				name: "revision",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "skill_library_revisions",
			kind: "column",
			value: {
				name: "description",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "skill_library_revisions",
			kind: "column",
			value: {
				name: "files_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "skill_library_revisions",
			kind: "column",
			value: {
				name: "created_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "skill_library_revisions",
			kind: "primaryKey",
			value: ["skill_id", "revision"]
		},
		{
			table: "skill_library_revisions",
			kind: "indexes",
			value: 1
		},
		{
			table: "skill_library_revisions",
			kind: "checks",
			value: 0
		},
		{
			table: "skill_library_uploads",
			kind: "table",
			value: null
		},
		{
			table: "skill_library_uploads",
			kind: "column",
			value: {
				name: "upload_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "skill_library_uploads",
			kind: "column",
			value: {
				name: "owner_profile_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "skill_library_uploads",
			kind: "column",
			value: {
				name: "slug",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "skill_library_uploads",
			kind: "column",
			value: {
				name: "size_bytes",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "skill_library_uploads",
			kind: "column",
			value: {
				name: "sha256",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "skill_library_uploads",
			kind: "column",
			value: {
				name: "archive_blob",
				type: "bytea",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "skill_library_uploads",
			kind: "column",
			value: {
				name: "expires_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "skill_library_uploads",
			kind: "column",
			value: {
				name: "published_skill_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "skill_library_uploads",
			kind: "primaryKey",
			value: ["upload_id"]
		},
		{
			table: "skill_library_uploads",
			kind: "indexes",
			value: 1
		},
		{
			table: "skill_library_uploads",
			kind: "checks",
			value: 0
		},
		{
			table: "skill_upload_chunks",
			kind: "table",
			value: null
		},
		{
			table: "skill_upload_chunks",
			kind: "column",
			value: {
				name: "upload_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "skill_upload_chunks",
			kind: "column",
			value: {
				name: "byte_offset",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "skill_upload_chunks",
			kind: "column",
			value: {
				name: "size_bytes",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "skill_upload_chunks",
			kind: "column",
			value: {
				name: "chunk_blob",
				type: "bytea",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "skill_upload_chunks",
			kind: "primaryKey",
			value: ["upload_id", "byte_offset"]
		},
		{
			table: "skill_upload_chunks",
			kind: "foreignKey",
			value: {
				columns: ["upload_id"],
				target: "skill_uploads",
				targetColumns: ["upload_id"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "skill_upload_chunks",
			kind: "indexes",
			value: 1
		},
		{
			table: "skill_upload_chunks",
			kind: "checks",
			value: 3
		},
		{
			table: "skill_uploads",
			kind: "table",
			value: null
		},
		{
			table: "skill_uploads",
			kind: "column",
			value: {
				name: "upload_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "skill_uploads",
			kind: "column",
			value: {
				name: "kind",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "skill_uploads",
			kind: "column",
			value: {
				name: "slug",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "skill_uploads",
			kind: "column",
			value: {
				name: "force",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "skill_uploads",
			kind: "column",
			value: {
				name: "size_bytes",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "skill_uploads",
			kind: "column",
			value: {
				name: "sha256",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "skill_uploads",
			kind: "column",
			value: {
				name: "actual_sha256",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "skill_uploads",
			kind: "column",
			value: {
				name: "received_bytes",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "skill_uploads",
			kind: "column",
			value: {
				name: "archive_blob",
				type: "bytea",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "skill_uploads",
			kind: "column",
			value: {
				name: "created_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "skill_uploads",
			kind: "column",
			value: {
				name: "expires_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "skill_uploads",
			kind: "column",
			value: {
				name: "committed",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "skill_uploads",
			kind: "column",
			value: {
				name: "committed_at",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "skill_uploads",
			kind: "column",
			value: {
				name: "idempotency_key_hash",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "skill_uploads",
			kind: "primaryKey",
			value: ["upload_id"]
		},
		{
			table: "skill_uploads",
			kind: "unique",
			value: ["idempotency_key_hash"]
		},
		{
			table: "skill_uploads",
			kind: "indexes",
			value: 4
		},
		{
			table: "skill_uploads",
			kind: "checks",
			value: 0
		},
		{
			table: "skill_usage",
			kind: "table",
			value: null
		},
		{
			table: "skill_usage",
			kind: "column",
			value: {
				name: "skill_file",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "skill_usage",
			kind: "column",
			value: {
				name: "skill_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "skill_usage",
			kind: "column",
			value: {
				name: "skill_name",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "skill_usage",
			kind: "column",
			value: {
				name: "skill_source",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "skill_usage",
			kind: "column",
			value: {
				name: "first_used_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "skill_usage",
			kind: "column",
			value: {
				name: "last_used_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "skill_usage",
			kind: "column",
			value: {
				name: "use_count",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "skill_usage",
			kind: "column",
			value: {
				name: "last_agent_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "skill_usage",
			kind: "primaryKey",
			value: ["skill_file"]
		},
		{
			table: "skill_usage",
			kind: "indexes",
			value: 2
		},
		{
			table: "skill_usage",
			kind: "checks",
			value: 0
		},
		{
			table: "skill_workshop_changes",
			kind: "table",
			value: null
		},
		{
			table: "skill_workshop_changes",
			kind: "column",
			value: {
				name: "cursor_id",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "skill_workshop_changes",
			kind: "column",
			value: {
				name: "change_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "skill_workshop_changes",
			kind: "column",
			value: {
				name: "agent_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "skill_workshop_changes",
			kind: "column",
			value: {
				name: "skill_name",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "skill_workshop_changes",
			kind: "column",
			value: {
				name: "action",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "skill_workshop_changes",
			kind: "column",
			value: {
				name: "actor",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "skill_workshop_changes",
			kind: "column",
			value: {
				name: "summary",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "skill_workshop_changes",
			kind: "column",
			value: {
				name: "version_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "skill_workshop_changes",
			kind: "column",
			value: {
				name: "session_key",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "skill_workshop_changes",
			kind: "column",
			value: {
				name: "run_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "skill_workshop_changes",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "skill_workshop_changes",
			kind: "primaryKey",
			value: ["change_id"]
		},
		{
			table: "skill_workshop_changes",
			kind: "indexes",
			value: 3
		},
		{
			table: "skill_workshop_changes",
			kind: "checks",
			value: 2
		},
		{
			table: "state_leases",
			kind: "table",
			value: null
		},
		{
			table: "state_leases",
			kind: "column",
			value: {
				name: "scope",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "state_leases",
			kind: "column",
			value: {
				name: "lease_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "state_leases",
			kind: "column",
			value: {
				name: "owner",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "state_leases",
			kind: "column",
			value: {
				name: "expires_at",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "state_leases",
			kind: "column",
			value: {
				name: "heartbeat_at",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "state_leases",
			kind: "column",
			value: {
				name: "payload_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "state_leases",
			kind: "column",
			value: {
				name: "created_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "state_leases",
			kind: "column",
			value: {
				name: "updated_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "state_leases",
			kind: "primaryKey",
			value: ["scope", "lease_key"]
		},
		{
			table: "state_leases",
			kind: "indexes",
			value: 3
		},
		{
			table: "state_leases",
			kind: "checks",
			value: 0
		},
		{
			table: "subagent_runs",
			kind: "table",
			value: null
		},
		{
			table: "subagent_runs",
			kind: "column",
			value: {
				name: "run_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "subagent_runs",
			kind: "column",
			value: {
				name: "child_session_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "subagent_runs",
			kind: "column",
			value: {
				name: "controller_session_key",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "subagent_runs",
			kind: "column",
			value: {
				name: "controller_store_path",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "subagent_runs",
			kind: "column",
			value: {
				name: "requester_session_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "subagent_runs",
			kind: "column",
			value: {
				name: "requester_store_path",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "subagent_runs",
			kind: "column",
			value: {
				name: "created_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "subagent_runs",
			kind: "column",
			value: {
				name: "payload_json",
				type: "text",
				nullable: false,
				identity: false,
				default: "'{}'",
				position: 8
			}
		},
		{
			table: "subagent_runs",
			kind: "primaryKey",
			value: ["run_id"]
		},
		{
			table: "subagent_runs",
			kind: "indexes",
			value: 4
		},
		{
			table: "subagent_runs",
			kind: "checks",
			value: 0
		},
		{
			table: "task_delivery_state",
			kind: "table",
			value: null
		},
		{
			table: "task_delivery_state",
			kind: "column",
			value: {
				name: "task_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "task_delivery_state",
			kind: "column",
			value: {
				name: "requester_origin_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "task_delivery_state",
			kind: "column",
			value: {
				name: "last_notified_event_at",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "task_delivery_state",
			kind: "primaryKey",
			value: ["task_id"]
		},
		{
			table: "task_delivery_state",
			kind: "foreignKey",
			value: {
				columns: ["task_id"],
				target: "task_runs",
				targetColumns: ["task_id"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "task_delivery_state",
			kind: "indexes",
			value: 1
		},
		{
			table: "task_delivery_state",
			kind: "checks",
			value: 0
		},
		{
			table: "task_runs",
			kind: "table",
			value: null
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "task_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "runtime",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "task_kind",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "source_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "requester_session_key",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "owner_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "scope_kind",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "child_session_key",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "parent_flow_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "parent_task_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "agent_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "requester_agent_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "run_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "execution_owner_host",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "execution_owner_pid",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 15
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "execution_owner_start_identity",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 16
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "label",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 17
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "task",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 18
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "status",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 19
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "delivery_status",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 20
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "notify_policy",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 21
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "created_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 22
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "started_at",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 23
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "ended_at",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 24
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "last_event_at",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 25
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "cleanup_after",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 26
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "tool_use_count",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 27
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "last_tool_name",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 28
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "error",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 29
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "progress_summary",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 30
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "terminal_summary",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 31
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "terminal_outcome",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 32
			}
		},
		{
			table: "task_runs",
			kind: "column",
			value: {
				name: "detail_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 33
			}
		},
		{
			table: "task_runs",
			kind: "primaryKey",
			value: ["task_id"]
		},
		{
			table: "task_runs",
			kind: "indexes",
			value: 12
		},
		{
			table: "task_runs",
			kind: "checks",
			value: 0
		},
		{
			table: "update_runs",
			kind: "table",
			value: null
		},
		{
			table: "update_runs",
			kind: "column",
			value: {
				name: "run_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "update_runs",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "update_runs",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "update_runs",
			kind: "column",
			value: {
				name: "trigger",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "update_runs",
			kind: "column",
			value: {
				name: "phase",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "update_runs",
			kind: "column",
			value: {
				name: "status",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "update_runs",
			kind: "column",
			value: {
				name: "reason",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "update_runs",
			kind: "column",
			value: {
				name: "origin_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "update_runs",
			kind: "column",
			value: {
				name: "target_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "update_runs",
			kind: "column",
			value: {
				name: "before_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "update_runs",
			kind: "column",
			value: {
				name: "after_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "update_runs",
			kind: "column",
			value: {
				name: "steps_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "update_runs",
			kind: "column",
			value: {
				name: "verification_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "update_runs",
			kind: "column",
			value: {
				name: "repair_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "update_runs",
			kind: "column",
			value: {
				name: "confirmed_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 15
			}
		},
		{
			table: "update_runs",
			kind: "column",
			value: {
				name: "finished_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 16
			}
		},
		{
			table: "update_runs",
			kind: "column",
			value: {
				name: "downtime_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 17
			}
		},
		{
			table: "update_runs",
			kind: "primaryKey",
			value: ["run_id"]
		},
		{
			table: "update_runs",
			kind: "indexes",
			value: 3
		},
		{
			table: "update_runs",
			kind: "checks",
			value: 11
		},
		{
			table: "user_background_images",
			kind: "table",
			value: null
		},
		{
			table: "user_background_images",
			kind: "column",
			value: {
				name: "profile_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "user_background_images",
			kind: "column",
			value: {
				name: "asset_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "user_background_images",
			kind: "column",
			value: {
				name: "image",
				type: "bytea",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "user_background_images",
			kind: "column",
			value: {
				name: "width",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "user_background_images",
			kind: "column",
			value: {
				name: "height",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "user_background_images",
			kind: "primaryKey",
			value: ["profile_id"]
		},
		{
			table: "user_background_images",
			kind: "unique",
			value: ["asset_id"]
		},
		{
			table: "user_background_images",
			kind: "foreignKey",
			value: {
				columns: ["profile_id"],
				target: "user_profiles",
				targetColumns: ["id"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "user_background_images",
			kind: "indexes",
			value: 2
		},
		{
			table: "user_background_images",
			kind: "checks",
			value: 3
		},
		{
			table: "user_preferences",
			kind: "table",
			value: null
		},
		{
			table: "user_preferences",
			kind: "column",
			value: {
				name: "profile_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "user_preferences",
			kind: "column",
			value: {
				name: "pref_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "user_preferences",
			kind: "column",
			value: {
				name: "value_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "user_preferences",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "user_preferences",
			kind: "primaryKey",
			value: ["profile_id", "pref_key"]
		},
		{
			table: "user_preferences",
			kind: "indexes",
			value: 1
		},
		{
			table: "user_preferences",
			kind: "checks",
			value: 0
		},
		{
			table: "user_profile_emails",
			kind: "table",
			value: null
		},
		{
			table: "user_profile_emails",
			kind: "column",
			value: {
				name: "email",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "user_profile_emails",
			kind: "column",
			value: {
				name: "profile_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "user_profile_emails",
			kind: "column",
			value: {
				name: "binding_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "user_profile_emails",
			kind: "column",
			value: {
				name: "created_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "user_profile_emails",
			kind: "primaryKey",
			value: ["email"]
		},
		{
			table: "user_profile_emails",
			kind: "indexes",
			value: 2
		},
		{
			table: "user_profile_emails",
			kind: "checks",
			value: 0
		},
		{
			table: "user_profile_identities",
			kind: "table",
			value: null
		},
		{
			table: "user_profile_identities",
			kind: "column",
			value: {
				name: "provider",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "user_profile_identities",
			kind: "column",
			value: {
				name: "subject",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "user_profile_identities",
			kind: "column",
			value: {
				name: "profile_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "user_profile_identities",
			kind: "column",
			value: {
				name: "canonical_login",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "user_profile_identities",
			kind: "column",
			value: {
				name: "created_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "user_profile_identities",
			kind: "column",
			value: {
				name: "authorization_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "user_profile_identities",
			kind: "column",
			value: {
				name: "authorization_basis_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "user_profile_identities",
			kind: "primaryKey",
			value: ["provider", "subject"]
		},
		{
			table: "user_profile_identities",
			kind: "indexes",
			value: 3
		},
		{
			table: "user_profile_identities",
			kind: "checks",
			value: 0
		},
		{
			table: "user_profiles",
			kind: "table",
			value: null
		},
		{
			table: "user_profiles",
			kind: "column",
			value: {
				name: "id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "user_profiles",
			kind: "column",
			value: {
				name: "display_name",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "user_profiles",
			kind: "column",
			value: {
				name: "primary_github_account_id",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "user_profiles",
			kind: "column",
			value: {
				name: "avatar",
				type: "bytea",
				nullable: true,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "user_profiles",
			kind: "column",
			value: {
				name: "avatar_mime",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "user_profiles",
			kind: "column",
			value: {
				name: "avatar_sha256",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "user_profiles",
			kind: "column",
			value: {
				name: "merged_into",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "user_profiles",
			kind: "column",
			value: {
				name: "role",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "user_profiles",
			kind: "column",
			value: {
				name: "created_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "user_profiles",
			kind: "column",
			value: {
				name: "updated_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "user_profiles",
			kind: "primaryKey",
			value: ["id"]
		},
		{
			table: "user_profiles",
			kind: "indexes",
			value: 1
		},
		{
			table: "user_profiles",
			kind: "checks",
			value: 0
		},
		{
			table: "web_push_approval_deliveries",
			kind: "table",
			value: null
		},
		{
			table: "web_push_approval_deliveries",
			kind: "column",
			value: {
				name: "approval_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "web_push_approval_deliveries",
			kind: "column",
			value: {
				name: "subscription_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "web_push_approval_deliveries",
			kind: "column",
			value: {
				name: "device_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "web_push_approval_deliveries",
			kind: "column",
			value: {
				name: "user_profile_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "web_push_approval_deliveries",
			kind: "column",
			value: {
				name: "prepared_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "web_push_approval_deliveries",
			kind: "primaryKey",
			value: ["approval_id", "subscription_id"]
		},
		{
			table: "web_push_approval_deliveries",
			kind: "foreignKey",
			value: {
				columns: ["subscription_id"],
				target: "web_push_subscriptions",
				targetColumns: ["subscription_id"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "web_push_approval_deliveries",
			kind: "foreignKey",
			value: {
				columns: ["approval_id"],
				target: "operator_approvals",
				targetColumns: ["approval_id"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "web_push_approval_deliveries",
			kind: "indexes",
			value: 2
		},
		{
			table: "web_push_approval_deliveries",
			kind: "checks",
			value: 0
		},
		{
			table: "web_push_subscriptions",
			kind: "table",
			value: null
		},
		{
			table: "web_push_subscriptions",
			kind: "column",
			value: {
				name: "endpoint_hash",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "web_push_subscriptions",
			kind: "column",
			value: {
				name: "subscription_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "web_push_subscriptions",
			kind: "column",
			value: {
				name: "endpoint",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "web_push_subscriptions",
			kind: "column",
			value: {
				name: "p256dh",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "web_push_subscriptions",
			kind: "column",
			value: {
				name: "auth",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "web_push_subscriptions",
			kind: "column",
			value: {
				name: "device_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "web_push_subscriptions",
			kind: "column",
			value: {
				name: "user_profile_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "web_push_subscriptions",
			kind: "column",
			value: {
				name: "preferences_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "web_push_subscriptions",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "web_push_subscriptions",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "web_push_subscriptions",
			kind: "primaryKey",
			value: ["endpoint_hash"]
		},
		{
			table: "web_push_subscriptions",
			kind: "unique",
			value: ["subscription_id"]
		},
		{
			table: "web_push_subscriptions",
			kind: "indexes",
			value: 3
		},
		{
			table: "web_push_subscriptions",
			kind: "checks",
			value: 0
		},
		{
			table: "worker_environment_credentials",
			kind: "table",
			value: null
		},
		{
			table: "worker_environment_credentials",
			kind: "column",
			value: {
				name: "environment_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "worker_environment_credentials",
			kind: "column",
			value: {
				name: "credential_hash",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "worker_environment_credentials",
			kind: "column",
			value: {
				name: "bundle_hash",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "worker_environment_credentials",
			kind: "column",
			value: {
				name: "session_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "worker_environment_credentials",
			kind: "column",
			value: {
				name: "rpc_set_version",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "worker_environment_credentials",
			kind: "column",
			value: {
				name: "owner_epoch",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "worker_environment_credentials",
			kind: "column",
			value: {
				name: "expires_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "worker_environment_credentials",
			kind: "column",
			value: {
				name: "delivered_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "worker_environment_credentials",
			kind: "primaryKey",
			value: ["environment_id"]
		},
		{
			table: "worker_environment_credentials",
			kind: "unique",
			value: ["credential_hash"]
		},
		{
			table: "worker_environment_credentials",
			kind: "foreignKey",
			value: {
				columns: ["environment_id"],
				target: "worker_environments",
				targetColumns: ["environment_id"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "worker_environment_credentials",
			kind: "indexes",
			value: 2
		},
		{
			table: "worker_environment_credentials",
			kind: "checks",
			value: 4
		},
		{
			table: "worker_environment_session_attachments",
			kind: "table",
			value: null
		},
		{
			table: "worker_environment_session_attachments",
			kind: "column",
			value: {
				name: "session_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "worker_environment_session_attachments",
			kind: "column",
			value: {
				name: "session_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "worker_environment_session_attachments",
			kind: "column",
			value: {
				name: "agent_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "worker_environment_session_attachments",
			kind: "column",
			value: {
				name: "session_lifecycle_revision",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "worker_environment_session_attachments",
			kind: "column",
			value: {
				name: "environment_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "worker_environment_session_attachments",
			kind: "column",
			value: {
				name: "generation",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "worker_environment_session_attachments",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "worker_environment_session_attachments",
			kind: "column",
			value: {
				name: "last_used_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "worker_environment_session_attachments",
			kind: "column",
			value: {
				name: "closed_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "worker_environment_session_attachments",
			kind: "primaryKey",
			value: ["session_id"]
		},
		{
			table: "worker_environment_session_attachments",
			kind: "unique",
			value: ["environment_id"]
		},
		{
			table: "worker_environment_session_attachments",
			kind: "foreignKey",
			value: {
				columns: ["environment_id"],
				target: "worker_environments",
				targetColumns: ["environment_id"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "worker_environment_session_attachments",
			kind: "indexes",
			value: 3
		},
		{
			table: "worker_environment_session_attachments",
			kind: "checks",
			value: 1
		},
		{
			table: "worker_environment_ssh_fallback_ports",
			kind: "table",
			value: null
		},
		{
			table: "worker_environment_ssh_fallback_ports",
			kind: "column",
			value: {
				name: "environment_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "worker_environment_ssh_fallback_ports",
			kind: "column",
			value: {
				name: "position",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "worker_environment_ssh_fallback_ports",
			kind: "column",
			value: {
				name: "port",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "worker_environment_ssh_fallback_ports",
			kind: "primaryKey",
			value: ["environment_id", "position"]
		},
		{
			table: "worker_environment_ssh_fallback_ports",
			kind: "unique",
			value: ["environment_id", "port"]
		},
		{
			table: "worker_environment_ssh_fallback_ports",
			kind: "foreignKey",
			value: {
				columns: ["environment_id"],
				target: "worker_environments",
				targetColumns: ["environment_id"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "worker_environment_ssh_fallback_ports",
			kind: "indexes",
			value: 2
		},
		{
			table: "worker_environment_ssh_fallback_ports",
			kind: "checks",
			value: 2
		},
		{
			table: "worker_environments",
			kind: "table",
			value: null
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "environment_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "provider_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "profile_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "profile_snapshot_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "last_activated_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "preparation_key",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "preparation_purpose",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "preparation_demand_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "preparation_expires_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "preparation_consumed_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "provision_operation_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "lease_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "node_setup_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "node_device_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "ssh_host",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 15
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "ssh_port",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 16
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "ssh_user",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 17
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "ssh_host_key",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 18
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "ssh_key_ref_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 19
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "desktop_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 20
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "state",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 21
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "bootstrap_bundle_hash",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 22
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "bootstrap_openclaw_version",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 23
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "bootstrap_protocol_features_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 24
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "bootstrap_install_kind",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 25
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "owner_epoch",
				type: "bigint",
				nullable: false,
				identity: false,
				default: "0",
				position: 26
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "teardown_terminal_state",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 27
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "attached_session_ids_json",
				type: "text",
				nullable: false,
				identity: false,
				default: "'[]'",
				position: 28
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 29
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 30
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "state_changed_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 31
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "idle_since_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 32
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "destroy_requested_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 33
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "last_error",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 34
			}
		},
		{
			table: "worker_environments",
			kind: "column",
			value: {
				name: "shared_host",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 35
			}
		},
		{
			table: "worker_environments",
			kind: "primaryKey",
			value: ["environment_id"]
		},
		{
			table: "worker_environments",
			kind: "unique",
			value: ["provision_operation_id"]
		},
		{
			table: "worker_environments",
			kind: "indexes",
			value: 4
		},
		{
			table: "worker_environments",
			kind: "checks",
			value: 5
		},
		{
			table: "worker_inference_turns",
			kind: "table",
			value: null
		},
		{
			table: "worker_inference_turns",
			kind: "column",
			value: {
				name: "session_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "worker_inference_turns",
			kind: "column",
			value: {
				name: "run_epoch",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "worker_inference_turns",
			kind: "column",
			value: {
				name: "run_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "worker_inference_turns",
			kind: "column",
			value: {
				name: "turn_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "worker_inference_turns",
			kind: "column",
			value: {
				name: "environment_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "worker_inference_turns",
			kind: "column",
			value: {
				name: "request_hash",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "worker_inference_turns",
			kind: "column",
			value: {
				name: "state",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "worker_inference_turns",
			kind: "column",
			value: {
				name: "terminal_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "worker_inference_turns",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "worker_inference_turns",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "worker_inference_turns",
			kind: "primaryKey",
			value: [
				"session_id",
				"run_epoch",
				"run_id",
				"turn_id"
			]
		},
		{
			table: "worker_inference_turns",
			kind: "foreignKey",
			value: {
				columns: ["environment_id"],
				target: "worker_environments",
				targetColumns: ["environment_id"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "worker_inference_turns",
			kind: "indexes",
			value: 2
		},
		{
			table: "worker_inference_turns",
			kind: "checks",
			value: 5
		},
		{
			table: "worker_session_placement_moves",
			kind: "table",
			value: null
		},
		{
			table: "worker_session_placement_moves",
			kind: "column",
			value: {
				name: "operation_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "worker_session_placement_moves",
			kind: "column",
			value: {
				name: "session_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "worker_session_placement_moves",
			kind: "column",
			value: {
				name: "source_generation",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "worker_session_placement_moves",
			kind: "column",
			value: {
				name: "source_environment_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "worker_session_placement_moves",
			kind: "column",
			value: {
				name: "source_owner_epoch",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "worker_session_placement_moves",
			kind: "column",
			value: {
				name: "target_kind",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "worker_session_placement_moves",
			kind: "column",
			value: {
				name: "target_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "worker_session_placement_moves",
			kind: "column",
			value: {
				name: "target_machine_class",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "worker_session_placement_moves",
			kind: "column",
			value: {
				name: "target_os",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "worker_session_placement_moves",
			kind: "column",
			value: {
				name: "abandon_source",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "worker_session_placement_moves",
			kind: "column",
			value: {
				name: "last_error",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "worker_session_placement_moves",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "worker_session_placement_moves",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "worker_session_placement_moves",
			kind: "primaryKey",
			value: ["operation_id"]
		},
		{
			table: "worker_session_placement_moves",
			kind: "unique",
			value: ["session_id"]
		},
		{
			table: "worker_session_placement_moves",
			kind: "foreignKey",
			value: {
				columns: ["session_id"],
				target: "worker_session_placements",
				targetColumns: ["session_id"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "worker_session_placement_moves",
			kind: "indexes",
			value: 2
		},
		{
			table: "worker_session_placement_moves",
			kind: "checks",
			value: 5
		},
		{
			table: "worker_session_placements",
			kind: "table",
			value: null
		},
		{
			table: "worker_session_placements",
			kind: "column",
			value: {
				name: "session_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "worker_session_placements",
			kind: "column",
			value: {
				name: "agent_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "worker_session_placements",
			kind: "column",
			value: {
				name: "session_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "worker_session_placements",
			kind: "column",
			value: {
				name: "execution_mode",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "worker_session_placements",
			kind: "column",
			value: {
				name: "state",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "worker_session_placements",
			kind: "column",
			value: {
				name: "environment_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "worker_session_placements",
			kind: "column",
			value: {
				name: "transition_generation",
				type: "bigint",
				nullable: false,
				identity: false,
				default: "0",
				position: 7
			}
		},
		{
			table: "worker_session_placements",
			kind: "column",
			value: {
				name: "active_owner_epoch",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "worker_session_placements",
			kind: "column",
			value: {
				name: "workspace_base_manifest_ref",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "worker_session_placements",
			kind: "column",
			value: {
				name: "remote_workspace_dir",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "worker_session_placements",
			kind: "column",
			value: {
				name: "worker_bundle_hash",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "worker_session_placements",
			kind: "column",
			value: {
				name: "last_transcript_ack_cursor",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "worker_session_placements",
			kind: "column",
			value: {
				name: "last_live_event_ack_cursor",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "worker_session_placements",
			kind: "column",
			value: {
				name: "recovery_error",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "worker_session_placements",
			kind: "column",
			value: {
				name: "turn_claim_owner",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 15
			}
		},
		{
			table: "worker_session_placements",
			kind: "column",
			value: {
				name: "turn_claim_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 16
			}
		},
		{
			table: "worker_session_placements",
			kind: "column",
			value: {
				name: "turn_claim_run_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 17
			}
		},
		{
			table: "worker_session_placements",
			kind: "column",
			value: {
				name: "turn_claim_generation",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 18
			}
		},
		{
			table: "worker_session_placements",
			kind: "column",
			value: {
				name: "turn_claim_owner_epoch",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 19
			}
		},
		{
			table: "worker_session_placements",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 20
			}
		},
		{
			table: "worker_session_placements",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 21
			}
		},
		{
			table: "worker_session_placements",
			kind: "column",
			value: {
				name: "state_changed_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 22
			}
		},
		{
			table: "worker_session_placements",
			kind: "column",
			value: {
				name: "terminal_reason",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 23
			}
		},
		{
			table: "worker_session_placements",
			kind: "column",
			value: {
				name: "terminal_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 24
			}
		},
		{
			table: "worker_session_placements",
			kind: "primaryKey",
			value: ["session_id"]
		},
		{
			table: "worker_session_placements",
			kind: "indexes",
			value: 4
		},
		{
			table: "worker_session_placements",
			kind: "checks",
			value: 12
		},
		{
			table: "worker_session_tool_operations",
			kind: "table",
			value: null
		},
		{
			table: "worker_session_tool_operations",
			kind: "column",
			value: {
				name: "source_session_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "worker_session_tool_operations",
			kind: "column",
			value: {
				name: "source_claim_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "worker_session_tool_operations",
			kind: "column",
			value: {
				name: "tool_call_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "worker_session_tool_operations",
			kind: "column",
			value: {
				name: "tool_name",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "worker_session_tool_operations",
			kind: "column",
			value: {
				name: "request_digest",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "worker_session_tool_operations",
			kind: "column",
			value: {
				name: "operation_seed",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "worker_session_tool_operations",
			kind: "column",
			value: {
				name: "status",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "worker_session_tool_operations",
			kind: "column",
			value: {
				name: "child_session_key",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "worker_session_tool_operations",
			kind: "column",
			value: {
				name: "result_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "worker_session_tool_operations",
			kind: "column",
			value: {
				name: "gateway_instance_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "worker_session_tool_operations",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "worker_session_tool_operations",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "worker_session_tool_operations",
			kind: "primaryKey",
			value: [
				"source_session_id",
				"source_claim_id",
				"tool_call_id"
			]
		},
		{
			table: "worker_session_tool_operations",
			kind: "foreignKey",
			value: {
				columns: ["source_session_id"],
				target: "worker_session_placements",
				targetColumns: ["session_id"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "worker_session_tool_operations",
			kind: "indexes",
			value: 1
		},
		{
			table: "worker_session_tool_operations",
			kind: "checks",
			value: 2
		},
		{
			table: "worker_transcript_commit_heads",
			kind: "table",
			value: null
		},
		{
			table: "worker_transcript_commit_heads",
			kind: "column",
			value: {
				name: "session_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "worker_transcript_commit_heads",
			kind: "column",
			value: {
				name: "run_epoch",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "worker_transcript_commit_heads",
			kind: "column",
			value: {
				name: "environment_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "worker_transcript_commit_heads",
			kind: "column",
			value: {
				name: "next_seq",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "worker_transcript_commit_heads",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "worker_transcript_commit_heads",
			kind: "primaryKey",
			value: ["session_id", "run_epoch"]
		},
		{
			table: "worker_transcript_commit_heads",
			kind: "indexes",
			value: 1
		},
		{
			table: "worker_transcript_commit_heads",
			kind: "checks",
			value: 3
		},
		{
			table: "worker_transcript_commits",
			kind: "table",
			value: null
		},
		{
			table: "worker_transcript_commits",
			kind: "column",
			value: {
				name: "session_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "worker_transcript_commits",
			kind: "column",
			value: {
				name: "run_epoch",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "worker_transcript_commits",
			kind: "column",
			value: {
				name: "seq",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "worker_transcript_commits",
			kind: "column",
			value: {
				name: "request_hash",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "worker_transcript_commits",
			kind: "column",
			value: {
				name: "state",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "worker_transcript_commits",
			kind: "column",
			value: {
				name: "result_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "worker_transcript_commits",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "worker_transcript_commits",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "worker_transcript_commits",
			kind: "primaryKey",
			value: [
				"session_id",
				"run_epoch",
				"seq"
			]
		},
		{
			table: "worker_transcript_commits",
			kind: "foreignKey",
			value: {
				columns: ["session_id", "run_epoch"],
				target: "worker_transcript_commit_heads",
				targetColumns: ["session_id", "run_epoch"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "worker_transcript_commits",
			kind: "indexes",
			value: 1
		},
		{
			table: "worker_transcript_commits",
			kind: "checks",
			value: 6
		},
		{
			table: "worker_turn_tool_authorities",
			kind: "table",
			value: null
		},
		{
			table: "worker_turn_tool_authorities",
			kind: "column",
			value: {
				name: "session_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "worker_turn_tool_authorities",
			kind: "column",
			value: {
				name: "environment_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "worker_turn_tool_authorities",
			kind: "column",
			value: {
				name: "owner_epoch",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "worker_turn_tool_authorities",
			kind: "column",
			value: {
				name: "placement_generation",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "worker_turn_tool_authorities",
			kind: "column",
			value: {
				name: "claim_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "worker_turn_tool_authorities",
			kind: "column",
			value: {
				name: "run_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "worker_turn_tool_authorities",
			kind: "column",
			value: {
				name: "tool_names_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "worker_turn_tool_authorities",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "worker_turn_tool_authorities",
			kind: "primaryKey",
			value: ["session_id"]
		},
		{
			table: "worker_turn_tool_authorities",
			kind: "foreignKey",
			value: {
				columns: ["session_id"],
				target: "worker_session_placements",
				targetColumns: ["session_id"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "worker_turn_tool_authorities",
			kind: "indexes",
			value: 1
		},
		{
			table: "worker_turn_tool_authorities",
			kind: "checks",
			value: 2
		},
		{
			table: "worker_workspace_pending_results",
			kind: "table",
			value: null
		},
		{
			table: "worker_workspace_pending_results",
			kind: "column",
			value: {
				name: "session_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "worker_workspace_pending_results",
			kind: "column",
			value: {
				name: "environment_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "worker_workspace_pending_results",
			kind: "column",
			value: {
				name: "owner_epoch",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "worker_workspace_pending_results",
			kind: "column",
			value: {
				name: "placement_generation",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "worker_workspace_pending_results",
			kind: "column",
			value: {
				name: "claim_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "worker_workspace_pending_results",
			kind: "column",
			value: {
				name: "run_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "worker_workspace_pending_results",
			kind: "column",
			value: {
				name: "gateway_instance_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "worker_workspace_pending_results",
			kind: "column",
			value: {
				name: "recovery_requested_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "worker_workspace_pending_results",
			kind: "column",
			value: {
				name: "workspace_accepted_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "worker_workspace_pending_results",
			kind: "column",
			value: {
				name: "staged_result_ref",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "worker_workspace_pending_results",
			kind: "column",
			value: {
				name: "repository_workspace_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "worker_workspace_pending_results",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "worker_workspace_pending_results",
			kind: "primaryKey",
			value: ["session_id"]
		},
		{
			table: "worker_workspace_pending_results",
			kind: "foreignKey",
			value: {
				columns: ["session_id"],
				target: "worker_session_placements",
				targetColumns: ["session_id"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "worker_workspace_pending_results",
			kind: "indexes",
			value: 1
		},
		{
			table: "worker_workspace_pending_results",
			kind: "checks",
			value: 2
		},
		{
			table: "worker_workspace_reconciliations",
			kind: "table",
			value: null
		},
		{
			table: "worker_workspace_reconciliations",
			kind: "column",
			value: {
				name: "session_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "worker_workspace_reconciliations",
			kind: "column",
			value: {
				name: "environment_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "worker_workspace_reconciliations",
			kind: "column",
			value: {
				name: "owner_epoch",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "worker_workspace_reconciliations",
			kind: "column",
			value: {
				name: "placement_generation",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "worker_workspace_reconciliations",
			kind: "column",
			value: {
				name: "base_manifest_ref",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "worker_workspace_reconciliations",
			kind: "column",
			value: {
				name: "current_manifest_ref",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "worker_workspace_reconciliations",
			kind: "column",
			value: {
				name: "plan_json",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "worker_workspace_reconciliations",
			kind: "column",
			value: {
				name: "base_pack",
				type: "bytea",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "worker_workspace_reconciliations",
			kind: "column",
			value: {
				name: "created_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "worker_workspace_reconciliations",
			kind: "primaryKey",
			value: ["session_id"]
		},
		{
			table: "worker_workspace_reconciliations",
			kind: "foreignKey",
			value: {
				columns: ["session_id"],
				target: "worker_session_placements",
				targetColumns: ["session_id"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "worker_workspace_reconciliations",
			kind: "indexes",
			value: 1
		},
		{
			table: "worker_workspace_reconciliations",
			kind: "checks",
			value: 3
		},
		{
			table: "workspace_generated_bootstrap_hashes",
			kind: "table",
			value: null
		},
		{
			table: "workspace_generated_bootstrap_hashes",
			kind: "column",
			value: {
				name: "workspace_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "workspace_generated_bootstrap_hashes",
			kind: "column",
			value: {
				name: "filename",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "workspace_generated_bootstrap_hashes",
			kind: "column",
			value: {
				name: "sha256",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "workspace_generated_bootstrap_hashes",
			kind: "primaryKey",
			value: ["workspace_key", "filename"]
		},
		{
			table: "workspace_generated_bootstrap_hashes",
			kind: "foreignKey",
			value: {
				columns: ["workspace_key"],
				target: "workspace_setup_state",
				targetColumns: ["workspace_key"],
				onUpdate: "NO ACTION",
				onDelete: "CASCADE",
				deferrable: false,
				deferred: false
			}
		},
		{
			table: "workspace_generated_bootstrap_hashes",
			kind: "indexes",
			value: 1
		},
		{
			table: "workspace_generated_bootstrap_hashes",
			kind: "checks",
			value: 0
		},
		{
			table: "workspace_path_aliases",
			kind: "table",
			value: null
		},
		{
			table: "workspace_path_aliases",
			kind: "column",
			value: {
				name: "alias_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "workspace_path_aliases",
			kind: "column",
			value: {
				name: "alias_path",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "workspace_path_aliases",
			kind: "column",
			value: {
				name: "workspace_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "workspace_path_aliases",
			kind: "column",
			value: {
				name: "workspace_path",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "workspace_path_aliases",
			kind: "column",
			value: {
				name: "updated_at_ms",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "workspace_path_aliases",
			kind: "primaryKey",
			value: ["alias_key"]
		},
		{
			table: "workspace_path_aliases",
			kind: "indexes",
			value: 2
		},
		{
			table: "workspace_path_aliases",
			kind: "checks",
			value: 0
		},
		{
			table: "workspace_setup_state",
			kind: "table",
			value: null
		},
		{
			table: "workspace_setup_state",
			kind: "column",
			value: {
				name: "workspace_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "workspace_setup_state",
			kind: "column",
			value: {
				name: "workspace_path",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "workspace_setup_state",
			kind: "column",
			value: {
				name: "version",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "workspace_setup_state",
			kind: "column",
			value: {
				name: "bootstrap_seeded_at",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "workspace_setup_state",
			kind: "column",
			value: {
				name: "setup_completed_at",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "workspace_setup_state",
			kind: "column",
			value: {
				name: "updated_at",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "workspace_setup_state",
			kind: "column",
			value: {
				name: "attested_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "workspace_setup_state",
			kind: "column",
			value: {
				name: "attestation_updated_at_ms",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "workspace_setup_state",
			kind: "primaryKey",
			value: ["workspace_key"]
		},
		{
			table: "workspace_setup_state",
			kind: "indexes",
			value: 2
		},
		{
			table: "workspace_setup_state",
			kind: "checks",
			value: 1
		},
		{
			table: "worktree_provisioned_file_chunks",
			kind: "table",
			value: null
		},
		{
			table: "worktree_provisioned_file_chunks",
			kind: "column",
			value: {
				name: "worktree_id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "worktree_provisioned_file_chunks",
			kind: "column",
			value: {
				name: "path",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "worktree_provisioned_file_chunks",
			kind: "column",
			value: {
				name: "chunk_index",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "worktree_provisioned_file_chunks",
			kind: "column",
			value: {
				name: "data",
				type: "bytea",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "worktree_provisioned_file_chunks",
			kind: "primaryKey",
			value: [
				"worktree_id",
				"path",
				"chunk_index"
			]
		},
		{
			table: "worktree_provisioned_file_chunks",
			kind: "indexes",
			value: 1
		},
		{
			table: "worktree_provisioned_file_chunks",
			kind: "checks",
			value: 1
		},
		{
			table: "worktree_templates",
			kind: "table",
			value: null
		},
		{
			table: "worktree_templates",
			kind: "column",
			value: {
				name: "cache_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "worktree_templates",
			kind: "column",
			value: {
				name: "id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "worktree_templates",
			kind: "column",
			value: {
				name: "repo_root",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "worktree_templates",
			kind: "column",
			value: {
				name: "common_dir",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "worktree_templates",
			kind: "column",
			value: {
				name: "worktree_root",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "worktree_templates",
			kind: "column",
			value: {
				name: "path",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "worktree_templates",
			kind: "column",
			value: {
				name: "backend",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "worktree_templates",
			kind: "column",
			value: {
				name: "source_commit",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "worktree_templates",
			kind: "column",
			value: {
				name: "content_key",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "worktree_templates",
			kind: "column",
			value: {
				name: "status",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "worktree_templates",
			kind: "column",
			value: {
				name: "created_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "worktree_templates",
			kind: "column",
			value: {
				name: "last_used_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "worktree_templates",
			kind: "primaryKey",
			value: ["cache_key"]
		},
		{
			table: "worktree_templates",
			kind: "unique",
			value: ["id"]
		},
		{
			table: "worktree_templates",
			kind: "indexes",
			value: 2
		},
		{
			table: "worktree_templates",
			kind: "checks",
			value: 1
		},
		{
			table: "worktrees",
			kind: "table",
			value: null
		},
		{
			table: "worktrees",
			kind: "column",
			value: {
				name: "id",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 1
			}
		},
		{
			table: "worktrees",
			kind: "column",
			value: {
				name: "repo_fingerprint",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 2
			}
		},
		{
			table: "worktrees",
			kind: "column",
			value: {
				name: "repo_root",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 3
			}
		},
		{
			table: "worktrees",
			kind: "column",
			value: {
				name: "path",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 4
			}
		},
		{
			table: "worktrees",
			kind: "column",
			value: {
				name: "branch",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 5
			}
		},
		{
			table: "worktrees",
			kind: "column",
			value: {
				name: "base_ref",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 6
			}
		},
		{
			table: "worktrees",
			kind: "column",
			value: {
				name: "owner_kind",
				type: "text",
				nullable: false,
				identity: false,
				default: null,
				position: 7
			}
		},
		{
			table: "worktrees",
			kind: "column",
			value: {
				name: "owner_id",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 8
			}
		},
		{
			table: "worktrees",
			kind: "column",
			value: {
				name: "snapshot_ref",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 9
			}
		},
		{
			table: "worktrees",
			kind: "column",
			value: {
				name: "provisioned_paths_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 10
			}
		},
		{
			table: "worktrees",
			kind: "column",
			value: {
				name: "created_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 11
			}
		},
		{
			table: "worktrees",
			kind: "column",
			value: {
				name: "last_active_at",
				type: "bigint",
				nullable: false,
				identity: false,
				default: null,
				position: 12
			}
		},
		{
			table: "worktrees",
			kind: "column",
			value: {
				name: "removed_at",
				type: "bigint",
				nullable: true,
				identity: false,
				default: null,
				position: 13
			}
		},
		{
			table: "worktrees",
			kind: "column",
			value: {
				name: "run_end_cleanup_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 14
			}
		},
		{
			table: "worktrees",
			kind: "column",
			value: {
				name: "gc_protection_json",
				type: "text",
				nullable: true,
				identity: false,
				default: null,
				position: 15
			}
		},
		{
			table: "worktrees",
			kind: "primaryKey",
			value: ["id"]
		},
		{
			table: "worktrees",
			kind: "indexes",
			value: 3
		},
		{
			table: "worktrees",
			kind: "checks",
			value: 1
		}
	]
};
//#endregion
//#region src/state/openclaw-state-db-engine.ts
const recovery = "Use the matching OpenClaw version or restore the matching PostgreSQL schema and anchor.";
function isStatePostgres() {
	return false;
}
function inspectStateSqlite(db) {
	const facts = getAdmittedSqliteSchemaFacts(db) ?? captureSqliteSchemaFacts(db);
	return {
		hasEngineAnchor: facts.tables.has("openclaw_engine_anchor"),
		hasExistingData: [
			...facts.tables,
			...facts.views,
			...facts.triggers.keys()
		].some((name) => name !== "openclaw_engine_anchor" && !name.startsWith("sqlite_"))
	};
}
function admitStatePostgres(db, fresh) {
	if (!fresh && getStateRuntimeSchemaAdmission(db)?.startupReady) return;
	const facts = getPostgresPhysicalFacts(db);
	if (!facts) throw new Error(`Missing PostgreSQL state admission. ${recovery}`);
	const tables = new Set(facts.catalog.filter((fact) => fact.kind === "table").map((fact) => fact.table));
	const absent = new Set(statePostgresRuntime.fragments.flatMap((fragment) => fragment.tables.some((table) => tables.has(table)) ? [] : fragment.tables));
	assertPostgresCatalog(facts.catalog.filter((fact) => !fact.kind.endsWith("Definition") && fact.table !== "openclaw_schema_meta"), statePostgresRuntime.expectedCatalog.filter((fact) => !absent.has(fact.table)));
	if (fresh) {
		const now = Date.now();
		db.prepare(`INSERT INTO schema_meta
        (meta_key, role, schema_version, agent_id, app_version, created_at, updated_at)
        VALUES ('primary', 'global', ?, NULL, ?, ?, ?)`).run(22, VERSION, now, now);
		writeStateSchemaContentVersion(db);
	}
	const meta = db.prepare("SELECT schema_version, role, agent_id FROM schema_meta WHERE meta_key = 'primary'").get();
	const content = db.prepare("SELECT value_json FROM config_machine_state WHERE state_key = 'state.schema.contentVersion'").get();
	if (meta?.schema_version !== 22 || meta.role !== "global" || meta.agent_id !== null || content?.value_json !== String(22)) throw new Error(`PostgreSQL state metadata mismatch. ${recovery}`);
	publishStateSchemaVersionAdmission(db, {
		userVersion: facts.version,
		contentVersion: facts.version
	});
	publishStateRuntimeSchemaAdmission(db, true);
}
const stateEngineSchema = {
	id: "state",
	version: 22,
	sqlite: "",
	postgres: statePostgresRuntime.eagerSql,
	postgresFragments: statePostgresRuntime.fragments.map((fragment) => {
		const { activation } = fragment;
		if (activation !== "first-use" && activation !== "version-additive") throw new Error(`Unknown PostgreSQL state fragment activation: ${activation}`);
		return {
			id: fragment.id,
			tables: fragment.tables,
			sql: fragment.sql,
			dependencies: fragment.dependencies,
			activation
		};
	})
};
function ensureStatePostgresFragment(db, table) {
	const facts = getPostgresPhysicalFacts(db);
	if (!facts) throw new Error(`Missing PostgreSQL state admission. ${recovery}`);
	const fragment = statePostgresRuntime.fragments.find((item) => item.tables.includes(table));
	if (!fragment) throw new Error(`No PostgreSQL state fragment owns ${table}`);
	if (fragment.tables.every((name) => facts.catalog.some((fact) => fact.kind === "table" && fact.table === name))) return;
	for (const id of fragment.dependencies) {
		const dependency = statePostgresRuntime.fragments.find((item) => item.id === id);
		if (!dependency) throw new Error(`Unknown state fragment dependency ${id}`);
		ensureStatePostgresFragment(db, dependency.tables[0]);
	}
	if (!stageSqliteTransactionState(db, {
		stage: () => {},
		rollback: () => {},
		commit: () => publishSqliteDatabaseSchemaChange(db),
		invalidate: () => publishSqliteDatabaseSchemaChange(db)
	})) throw new Error("PostgreSQL state fragments require the owner's transaction");
	invalidateLocalSqliteSchemaAdmissions(db);
	db.exec(fragment.sql);
	admitPostgresPhysicalFacts({
		anchor: db.anchor,
		db,
		namespace: facts.namespace,
		storeId: facts.storeId,
		store: facts.store,
		version: facts.version,
		schema: stateEngineSchema,
		recordSchema: true
	});
	admitStatePostgres(db, false);
}
//#endregion
//#region src/infra/sqlite-schema-contract.ts
function expectedSchemaContracts() {
	return resolveGlobalSingleton(Symbol.for(SQLITE_EXPECTED_SCHEMA_CONTRACTS_KEY), () => {
		const runtime = {
			executable: process.execPath,
			nodeVersion: process.versions.node,
			bunVersion: process.versions.bun,
			library: ensureSqliteLibrarySelected()
		};
		const inherited = getEnvironmentData(SQLITE_EXPECTED_SCHEMA_CONTRACTS_KEY);
		const cache = inherited?.pid === process.pid && isDeepStrictEqual(inherited.runtime, runtime) && inherited.contracts instanceof Map ? inherited : {
			pid: process.pid,
			runtime,
			contracts: /* @__PURE__ */ new Map()
		};
		setEnvironmentData(SQLITE_EXPECTED_SCHEMA_CONTRACTS_KEY, cache);
		return cache.contracts;
	});
}
/** Reuse actual table facts only within one unchanged read transaction on this connection. */
function createSqliteTableContractReader(database) {
	let tables;
	return (tableName) => (tables ??= collectSqliteSchemaContract(database)).get(tableName);
}
/**
* Require every object from one committed schema while allowing unrelated
* tables and indexes that do not replace a canonical object.
*/
function assertSqliteSchemaContains(database, databaseLabel, schemaSql, compatibility = {}, readTable) {
	const issues = collectSqliteSchemaIssues(database, schemaSql, compatibility, readTable);
	if (issues.length > 0) throwSqliteSchemaMismatches(databaseLabel, legacySqliteSchemaIssueMessages(issues));
}
/** Collect stable, machine-readable differences from one committed schema. */
function collectSqliteSchemaIssues(database, schemaSql, compatibility = {}, readTable) {
	return runSqliteSchemaReadSnapshotSync(database, () => collectSqliteSchemaIssuesInSnapshot(database, schemaSql, compatibility, readTable));
}
function collectSqliteSchemaIssuesInSnapshot(database, schemaSql, compatibility, readTable) {
	const expected = getSqliteSchemaContract(schemaSql);
	const readActualTable = readTable ?? createSqliteTableContractReader(database);
	const excludedTables = new Set(compatibility.excludedTables ?? []);
	const excludedIndexes = new Set(compatibility.excludedIndexes ?? []);
	const allowedMissingTables = new Set(compatibility.allowedMissingTables ?? []);
	const allowedMissingIndexes = new Set(compatibility.allowedMissingIndexes ?? []);
	const issues = [];
	const add = (code, objectName, message) => {
		issues.push(createSqliteSchemaIssue(code, objectName, message));
	};
	for (const [tableName, expectedTable] of expected) {
		if (excludedTables.has(tableName)) continue;
		const actualTable = readActualTable(tableName);
		if (!actualTable) {
			if (allowedMissingTables.has(tableName)) continue;
			add("missing-table", tableName);
			continue;
		}
		issues.push(...compareTableDefinitions(tableName, actualTable.definition, expectedTable.definition, compatibility, !allowedMissingTables.has(tableName)));
		const actualIndexFingerprints = new Set(actualTable.indexes.map((index) => JSON.stringify(index)));
		const expectedIndexFingerprints = /* @__PURE__ */ new Set();
		for (const expectedIndex of expectedTable.indexes) {
			if (expectedIndex.name !== null && excludedIndexes.has(expectedIndex.name)) continue;
			const fingerprint = JSON.stringify(expectedIndex);
			expectedIndexFingerprints.add(fingerprint);
			if (!actualIndexFingerprints.has(fingerprint)) {
				const objectName = expectedIndex.name ?? tableName;
				if (expectedIndex.name && allowedMissingIndexes.has(expectedIndex.name) && !database.prepare("SELECT 1 FROM main.sqlite_schema WHERE type = 'index' AND name = ? COLLATE NOCASE LIMIT 1").get(expectedIndex.name)) continue;
				add("missing-or-drifted-index", objectName, `missing or drifted index ${expectedIndex.name ?? `on ${tableName}`}`);
			}
		}
		for (const actualIndex of actualTable.indexes) if (actualIndex.unique === 1 && !expectedIndexFingerprints.has(JSON.stringify(actualIndex))) add("unexpected-unique-index", actualIndex.name ?? tableName, `unexpected unique index ${actualIndex.name ?? `on ${tableName}`}`);
		const optionalCanonicalTriggerGroups = collectOptionalCanonicalTriggerGroups(database, compatibility, tableName);
		const optionalCanonicalTriggers = optionalCanonicalTriggerGroups.flatMap((group) => group.triggers);
		const allowedMissingCanonicalTriggers = optionalCanonicalTriggerGroups.filter((group) => group.optional).flatMap((group) => group.triggers);
		for (const expectedTrigger of expectedTable.triggers) {
			if (allowedMissingCanonicalTriggers.some((canonicalTrigger) => canonicalTrigger.name === expectedTrigger.name)) continue;
			if (!containsTrigger(actualTable.triggers, expectedTrigger)) add("missing-or-drifted-trigger", expectedTrigger.name);
		}
		for (const triggerGroup of optionalCanonicalTriggerGroups) {
			const isPresent = actualTable.triggers.some((actualTrigger) => triggerGroup.triggers.some((canonicalTrigger) => actualTrigger.name === canonicalTrigger.name));
			if (triggerGroup.optional && !isPresent) continue;
			for (const canonicalTrigger of triggerGroup.triggers) if (!containsTrigger(actualTable.triggers, canonicalTrigger)) add("missing-or-drifted-trigger", canonicalTrigger.name);
		}
		for (const actualTrigger of actualTable.triggers) if (!containsTrigger(expectedTable.triggers, actualTrigger) && !containsTrigger(optionalCanonicalTriggers, actualTrigger)) add("unexpected-trigger", actualTrigger.name);
		if (actualTable.virtualTableSql !== expectedTable.virtualTableSql) add("virtual-table-definition-drift", tableName);
		if (actualTable.strict !== expectedTable.strict || actualTable.withoutRowid !== expectedTable.withoutRowid) add("table-options-drift", tableName);
	}
	return issues;
}
/** Require stable canonical tables before a version-specific additive migration. */
function assertSqliteSchemaTablesPresent(database, databaseLabel, schemaSql, options = {}) {
	const allowedMissingTables = new Set(options.allowedMissingTables ?? []);
	const requiredTables = getCanonicalSqliteTableNames(schemaSql).filter((tableName) => !allowedMissingTables.has(tableName));
	const missingTables = [];
	const batchSize = 500;
	for (let offset = 0; offset < requiredTables.length; offset += batchSize) {
		const tables = requiredTables.slice(offset, offset + batchSize);
		const expected = tables.map((_table, ordinal) => `(${ordinal}, ?)`).join(", ");
		const present = database.prepare(`WITH expected(ordinal, name) AS (VALUES ${expected})
         SELECT ordinal FROM expected
         WHERE EXISTS (
           SELECT 1 FROM main.sqlite_schema
           WHERE type = 'table' AND name = expected.name LIMIT 1
         )`).all(...tables);
		const presentOrdinals = new Set(present.map((row) => row.ordinal));
		for (const [ordinal, tableName] of tables.entries()) if (!presentOrdinals.has(ordinal)) missingTables.push(`missing table ${tableName}`);
	}
	if (missingTables.length > 0) throwSqliteSchemaMismatches(databaseLabel, missingTables);
}
/** Return every explicit named index owned by one committed schema. */
function getCanonicalSqliteNamedIndexContracts(schemaSql) {
	const schema = getSqliteSchemaContract(schemaSql);
	const indexes = [];
	for (const [tableName, table] of schema) for (const fingerprint of table.indexes) {
		if (fingerprint.name === null || fingerprint.sql === null || fingerprint.origin !== "c") continue;
		indexes.push({
			definition: readCanonicalIndexDefinition(fingerprint),
			fingerprint,
			name: fingerprint.name,
			tableName,
			unique: fingerprint.unique === 1
		});
	}
	return indexes;
}
/** Return every table owned by one committed schema. */
function getCanonicalSqliteTableNames(schemaSql) {
	return [...getSqliteSchemaContract(schemaSql).keys()];
}
/** Inspect one explicit main-schema index using the canonical schema fingerprint shape. */
function collectSqliteNamedIndexContract(database, indexName) {
	const row = database.prepare(`
      SELECT tbl_name FROM (
        SELECT name, sql, tbl_name FROM main.sqlite_schema WHERE type = 'index' AND name = ?
      )
    `).get(indexName);
	if (!row || typeof row.tbl_name !== "string") return;
	const index = database.prepare(`PRAGMA main.index_list(${quoteSqliteIdentifier(row.tbl_name)})`).all().find((candidate) => candidate.name === indexName);
	return index ? collectSqliteIndexContract(database, index) : void 0;
}
function collectOptionalCanonicalTriggerGroups(database, compatibility, tableName) {
	return (compatibility.optionalCanonicalTriggerGroups ?? []).filter((group) => group.tableName === tableName).map((group) => ({
		optional: !group.optionalWhenTableMissing || !database.prepare("SELECT 1 FROM main.sqlite_schema WHERE type = 'table' AND name = ? LIMIT 1").get(group.optionalWhenTableMissing),
		triggers: group.triggers.map((trigger) => ({
			name: trigger.name,
			sql: normalizeOptionalCanonicalTriggerSql(trigger.sql)
		}))
	}));
}
function normalizeOptionalCanonicalTriggerSql(sql) {
	return normalizeSchemaSql(sql)?.replace(/^(CREATE TRIGGER) main\./iu, "$1 ") ?? null;
}
function getSqliteSchemaContract(schemaSql) {
	const schemaContractCache = expectedSchemaContracts();
	let expected = schemaContractCache.get(schemaSql);
	if (!expected) {
		expected = buildSqliteSchemaContract(schemaSql);
		schemaContractCache.set(schemaSql, expected);
	}
	return expected;
}
function collectSqliteSchemaFacts(database) {
	const tableOptions = database.prepare("PRAGMA table_list").all();
	if (tableOptions.some((row) => {
		const name = row.name.toLowerCase();
		return name === "pragma_index_list" || name === "pragma_index_xinfo";
	})) return;
	const indexes = database.prepare(`
    SELECT t.name AS table_name, i.seq AS index_seq,
      i.name, i.origin, i.partial, i."unique", d.sql
    FROM main.sqlite_schema AS t
    CROSS JOIN pragma_index_list(t.name, 'main') AS i
    LEFT JOIN main.sqlite_schema AS d ON d.type = 'index' AND d.name = i.name
    WHERE t.type = 'table' AND t.name NOT LIKE 'sqlite_%'
  `).all();
	const terms = database.prepare(`
    SELECT t.name AS table_name, i.seq AS index_seq,
      x.seqno, x.cid, x.name, x."desc", x.coll, x."key"
    FROM main.sqlite_schema AS t
    CROSS JOIN pragma_index_list(t.name, 'main') AS i
    CROSS JOIN pragma_index_xinfo(i.name, 'main') AS x
    WHERE t.type = 'table' AND t.name NOT LIKE 'sqlite_%'
    ORDER BY t.name, i.seq, x.seqno
  `).all();
	const triggers = database.prepare(`
    SELECT tbl_name, name, sql FROM main.sqlite_schema WHERE type = 'trigger' ORDER BY tbl_name, name
  `).all();
	return {
		tableOptions,
		indexes: groupCanonicalRows(indexes, (row) => row.table_name),
		terms: groupCanonicalRows(terms, (row) => row.table_name),
		triggers: groupCanonicalRows(triggers, (row) => row.tbl_name)
	};
}
function groupCanonicalRows(rows, key) {
	const groups = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const name = key(row);
		const group = groups.get(name) ?? [];
		group.push(row);
		groups.set(name, group);
	}
	return groups;
}
function buildSqliteSchemaContract(schemaSql) {
	const database = openNodeSqliteDatabase(":memory:");
	try {
		database.exec(schemaSql);
		return collectSqliteSchemaContract(database);
	} finally {
		database.close();
	}
}
function collectSqliteSchemaContract(database) {
	const rows = database.prepare(`
        SELECT name, sql, tbl_name
        FROM main.sqlite_schema
        WHERE type = 'table'
          AND name NOT LIKE 'sqlite_%'
        ORDER BY name
      `).all();
	if (rows.length === 0) return /* @__PURE__ */ new Map();
	const facts = collectSqliteSchemaFacts(database);
	return new Map(rows.map((table) => [table.name, collectSqliteTableContractFromRow(database, table, facts)]));
}
function readCanonicalIndexDefinition(index) {
	if (index.name === null || index.sql === null) throw new Error("Canonical SQLite named index is missing its schema definition.");
	const prefix = (index.unique === 1 ? /^CREATE\s+UNIQUE\s+INDEX\s+/iu : /^CREATE\s+INDEX\s+/iu).exec(index.sql);
	if (!prefix) throw new Error(`Canonical SQLite index ${index.name} has an unreadable definition.`);
	const name = readSqlToken(index.sql, prefix[0].length);
	if (!name || normalizeSqlIdentifier(name.raw) !== index.name.toLowerCase()) throw new Error(`Canonical SQLite index ${index.name} has an unexpected schema name.`);
	const definition = index.sql.slice(name.end).trim();
	if (!/^ON\s+/iu.test(definition)) throw new Error(`Canonical SQLite index ${index.name} has an unreadable target.`);
	return definition;
}
function collectSqliteTableContractFromRow(database, table, facts) {
	const tableName = table.name;
	const quotedTable = facts ? void 0 : quoteSqliteIdentifier(tableName);
	const tableList = (facts?.tableOptions ?? database.prepare(`PRAGMA main.table_list(${quotedTable})`).all()).find((entry) => entry.schema === "main" && entry.name === tableName);
	if (!tableList) throw new Error(`Could not inspect SQLite table options for ${tableName}.`);
	let indexes;
	if (facts) {
		const termsByIndex = groupCanonicalRows(facts.terms.get(tableName) ?? [], (term) => term.index_seq);
		indexes = (facts.indexes.get(tableName) ?? []).map((index) => createSqliteIndexContract(index, index.sql, termsByIndex.get(index.index_seq) ?? []));
	} else indexes = database.prepare(`PRAGMA main.index_list(${quotedTable})`).all().map((index) => collectSqliteIndexContract(database, index));
	indexes = indexes.toSorted(compareJson);
	const triggers = facts ? facts.triggers.get(tableName) ?? [] : executeWithCachedStatement(database, `
          SELECT name, sql
          FROM main.sqlite_schema
          WHERE type = 'trigger' AND tbl_name = ?
          ORDER BY name
        `, [tableName], (statement) => statement.all(tableName));
	return createSqliteTableContract(tableName, table, tableList, indexes, triggers);
}
function compareTableDefinitions(tableName, actual, expected, compatibility, allowCompatibleAdditiveColumns) {
	const issues = [];
	const add = (code, objectName) => {
		issues.push(createSqliteSchemaIssue(code, objectName));
	};
	if (!actual || !expected) {
		if (actual !== expected) add("table-definition-drift", tableName);
		return issues;
	}
	const allowedMissingColumns = new Set(compatibility.allowedMissingColumns ?? []);
	for (const [columnName, definition] of actual.columns) if (!expected.columns.has(columnName)) {
		if (allowCompatibleAdditiveColumns && compatibility.allowCompatibleAdditiveColumns && isCompatibleAdditiveColumnDefinition(definition)) continue;
		add("unexpected-column", `${tableName}.${columnName}`);
	}
	for (const [columnName, expectedDefinition] of expected.columns) {
		const objectName = `${tableName}.${columnName}`;
		const actualDefinition = actual.columns.get(columnName);
		if (actualDefinition === void 0) {
			if (!allowedMissingColumns.has(objectName)) add("missing-column", objectName);
			continue;
		}
		if (actualDefinition === expectedDefinition) continue;
		if (!(compatibility.allowedColumnDefinitions?.[objectName] ?? []).some((definition) => normalizeSqlWhitespace(definition) === actualDefinition)) add("column-definition-drift", objectName);
	}
	if (JSON.stringify(actual.constraints) !== JSON.stringify(expected.constraints)) add("table-constraint-drift", tableName);
	return issues;
}
const SQLITE_STRICT_DATATYPES = /* @__PURE__ */ new Set([
	"ANY",
	"BLOB",
	"INT",
	"INTEGER",
	"REAL",
	"TEXT"
]);
function isCompatibleAdditiveColumnDefinition(definition) {
	const name = readSqlToken(definition, 0);
	const type = name ? readSqlToken(definition, name.end) : null;
	return Boolean(type?.keyword && SQLITE_STRICT_DATATYPES.has(type.keyword) && definition.slice(type.end).trim().length === 0);
}
function collectSqliteIndexContract(database, index) {
	const row = executeWithCachedStatement(database, "SELECT sql FROM main.sqlite_schema WHERE type = 'index' AND name = ?", [index.name], (statement) => statement.get(index.name));
	const terms = database.prepare(`PRAGMA main.index_xinfo(${quoteSqliteIdentifier(index.name)})`).all();
	return createSqliteIndexContract(index, typeof row?.sql === "string" ? row.sql : null, terms);
}
function containsTrigger(triggers, expected) {
	return triggers.some((trigger) => trigger.name === expected.name && trigger.sql === expected.sql);
}
function compareJson(left, right) {
	return JSON.stringify(left).localeCompare(JSON.stringify(right));
}
function readSqliteSchemaCookie(database) {
	return database.prepare("PRAGMA schema_version").get()?.schema_version;
}
//#endregion
//#region packages/gateway-protocol/src/failover-reasons.ts
const FAILOVER_REASONS = [
	"auth",
	"auth_permanent",
	"format",
	"rate_limit",
	"overloaded",
	"billing",
	"server_error",
	"timeout",
	"tls_certificate",
	"context_overflow",
	"model_not_found",
	"session_expired",
	"empty_response",
	"no_error_details",
	"unclassified",
	"unknown"
];
//#endregion
//#region src/cron/completion-status.ts
/** Resolves authored completion from an admitted job, or legacy completion from stored facts. */
function resolveCronCompletionStatus(params) {
	if (params.status === "error" || params.status === "skipped") return "failed";
	if (params.status !== "ok") return "unknown";
	if (params.requiredDelivery === void 0) return params.delivered === true || params.deliveryStatus === "delivered" || params.deliveryStatus === "not-requested" ? "succeeded" : "unknown";
	if (!params.requiredDelivery || params.deliveryStatus === "delivered" || params.deliveryStatus === "not-delivered" && params.deliverySuppressionReason !== void 0) return "succeeded";
	return params.deliveryStatus === "not-delivered" ? "failed" : "unknown";
}
const CRON_TIMEOUT_ERROR_PREFIXES = [
	"cron: job execution timed out",
	"cron: isolated agent setup timed out before runner start",
	"cron: isolated agent run stalled before execution start"
];
/** Recognizes watchdog timeouts without loading agent or execution-phase runtime. */
function isCronTimeoutErrorText(error) {
	return typeof error === "string" && CRON_TIMEOUT_ERROR_PREFIXES.some((prefix) => error === prefix || error.startsWith(`${prefix} `));
}
//#endregion
//#region src/cron/run-diagnostics-normalize.ts
const MAX_ENTRIES = 10;
const MAX_ENTRY_CHARS = 1e3;
const MAX_SUMMARY_CHARS = 2e3;
function normalizeSeverity(value) {
	return value === "info" || value === "warn" || value === "error" ? value : "error";
}
function normalizeSource(value) {
	switch (value) {
		case "cron-preflight":
		case "cron-setup":
		case "model-preflight":
		case "agent-run":
		case "tool":
		case "exec":
		case "delivery": return value;
		default: return "agent-run";
	}
}
function normalizeTimestamp$1(value, nowMs) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : nowMs();
}
function normalizeDiagnosticMessage(value, redactText) {
	if (typeof value !== "string") return {};
	const normalized = normalizeOptionalString(value);
	if (!normalized) return {};
	const redacted = redactText(normalized);
	if (redacted.length <= MAX_ENTRY_CHARS) return { message: redacted };
	return {
		message: `${truncateUtf16Safe(redacted, 999)}…`,
		truncated: true
	};
}
function normalizeCronRunDiagnosticSummary(value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) return;
	if (normalized.length <= MAX_SUMMARY_CHARS) return normalized;
	return `${truncateUtf16Safe(normalized, 1999)}…`;
}
/** Normalizes stored cron diagnostic payloads into bounded entries. */
function normalizeCronRunDiagnosticsCore(value, opts) {
	if (!value || typeof value !== "object") return;
	const record = value;
	const nowMs = opts?.nowMs ?? Date.now;
	const redactText = opts?.redactText ?? ((text) => text);
	const entriesRaw = Array.isArray(record.entries) ? record.entries : [];
	const entries = [];
	for (const item of entriesRaw) {
		if (!item || typeof item !== "object") continue;
		const entry = item;
		const normalized = normalizeDiagnosticMessage(entry.message, redactText);
		if (!normalized.message) continue;
		entries.push({
			ts: normalizeTimestamp$1(entry.ts, nowMs),
			source: normalizeSource(entry.source),
			severity: normalizeSeverity(entry.severity),
			message: normalized.message,
			...typeof entry.toolName === "string" && entry.toolName.trim() ? { toolName: entry.toolName.trim() } : {},
			...typeof entry.exitCode === "number" && Number.isFinite(entry.exitCode) ? { exitCode: entry.exitCode } : entry.exitCode === null ? { exitCode: null } : {},
			...entry.truncated === true || normalized.truncated ? { truncated: true } : {}
		});
		if (entries.length > MAX_ENTRIES) entries.shift();
	}
	const summary = normalizeCronRunDiagnosticSummary(typeof record.summary === "string" ? redactText(record.summary) : void 0);
	if (entries.length === 0 && !summary) return;
	return {
		...summary ? { summary } : {},
		entries
	};
}
//#endregion
//#region src/cron/run-history-detail.ts
/** Read-side cron codec between cron history detail and the stable run-history wire shape.
* Deliberately free of agent/runtime imports so history reads stay dependency-light;
* the event->entry write codec lives in run-event-codec.ts. */
const CRON_RUN_DETAIL_KIND = "cron-run";
const cronRunStatusSchema = _enum([
	"ok",
	"error",
	"skipped"
]);
const cronCompletionStatusSchema = _enum([
	"succeeded",
	"failed",
	"unknown"
]);
const cronDeliveryStatusSchema = _enum([
	"delivered",
	"not-delivered",
	"unknown",
	"not-requested"
]);
const optionalCronStringSchema = string().optional().catch(void 0);
const optionalNonBlankCronStringSchema = string().refine((value) => value.trim().length > 0).optional().catch(void 0);
const optionalCronTimestampSchema = unknown().optional().transform((value) => normalizeTimestamp(value));
const optionalCronNonnegativeIntegerSchema = unknown().optional().transform((value) => asSafeIntegerInRange(value, { min: 0 }));
const cronUsageSchema = object({
	input_tokens: optionalCronNonnegativeIntegerSchema,
	output_tokens: optionalCronNonnegativeIntegerSchema,
	total_tokens: optionalCronNonnegativeIntegerSchema,
	cache_read_tokens: optionalCronNonnegativeIntegerSchema,
	cache_write_tokens: optionalCronNonnegativeIntegerSchema
}).transform((usage) => Object.values(usage).some((tokenCount) => tokenCount !== void 0) ? usage : void 0).optional().catch(void 0);
const cronFailureNotificationDeliverySchema = looseObject({
	status: cronDeliveryStatusSchema,
	delivered: boolean().optional().catch(void 0),
	error: optionalCronStringSchema
}).transform(({ status, delivered, error }) => ({
	status,
	...delivered !== void 0 ? { delivered } : {},
	...error !== void 0 ? { error } : {}
})).optional().catch(void 0);
const cronRunLogEntrySchema = looseObject({
	action: literal("finished"),
	jobId: string().refine((value) => value.trim().length > 0),
	ts: unknown().transform((value) => normalizeTimestamp(value)).pipe(number()),
	status: cronRunStatusSchema.optional().catch(void 0),
	completionStatus: cronCompletionStatusSchema.optional().catch(void 0),
	error: optionalCronStringSchema,
	errorReason: _enum(FAILOVER_REASONS).optional().catch(void 0),
	summary: optionalCronStringSchema,
	runId: optionalNonBlankCronStringSchema,
	diagnostics: unknown().optional(),
	runAtMs: optionalCronTimestampSchema,
	durationMs: optionalCronNonnegativeIntegerSchema,
	nextRunAtMs: optionalCronTimestampSchema,
	triggerFired: unknown().optional().transform((value) => value === true ? true : void 0),
	model: optionalNonBlankCronStringSchema,
	provider: optionalNonBlankCronStringSchema,
	usage: cronUsageSchema,
	delivered: boolean().optional().catch(void 0),
	deliveryStatus: cronDeliveryStatusSchema.optional().catch(void 0),
	deliveryError: optionalCronStringSchema,
	deliverySuppressionReason: _enum([
		"empty",
		"silent",
		"heartbeat",
		"channel_transform"
	]).optional().catch(void 0),
	failureNotificationDelivery: cronFailureNotificationDeliverySchema,
	delivery: custom(isJsonObject).optional().catch(void 0),
	sessionId: optionalNonBlankCronStringSchema,
	sessionKey: optionalNonBlankCronStringSchema
});
function isJsonValue(value) {
	const pending = [value];
	while (pending.length > 0) {
		const current = pending.pop();
		if (current === null || typeof current === "string" || typeof current === "boolean" || typeof current === "number") continue;
		if (!Array.isArray(current) && !isRecord(current)) return false;
		for (const child of Object.values(current)) pending.push(child);
	}
	return true;
}
/** Native JSON parsing keeps released scalar/null and numeric-overflow semantics. */
function parseCronRunDetailJson(serialized) {
	const value = safeParseJson(serialized);
	return isJsonValue(value) ? value : void 0;
}
function toJsonValue(value) {
	const serialized = JSON.stringify(value);
	return serialized === void 0 ? void 0 : parseCronRunDetailJson(serialized);
}
function isJsonObject(value) {
	return isRecord(value);
}
function normalizeTimestamp(value) {
	return asSafeIntegerInRange(value, {
		min: 0,
		max: MAX_DATE_TIMESTAMP_MS
	});
}
/** Parses stored or migrated cron history while preserving the stable wire shape. */
function parseCronRunLogEntryObject(obj, opts) {
	const jobId = normalizeOptionalString(opts?.jobId);
	const parsed = cronRunLogEntrySchema.safeParse(obj);
	if (!parsed.success) return null;
	const entryObj = parsed.data;
	if (jobId && entryObj.jobId !== jobId) return null;
	return {
		ts: entryObj.ts,
		jobId: entryObj.jobId,
		action: "finished",
		status: entryObj.status,
		completionStatus: entryObj.completionStatus ?? resolveCronCompletionStatus({
			status: entryObj.status,
			delivered: entryObj.delivered,
			deliveryStatus: entryObj.deliveryStatus
		}),
		error: entryObj.error,
		errorReason: entryObj.errorReason,
		summary: entryObj.summary,
		runId: entryObj.runId,
		diagnostics: normalizeCronRunDiagnosticsCore(entryObj.diagnostics),
		runAtMs: entryObj.runAtMs,
		durationMs: entryObj.durationMs,
		nextRunAtMs: entryObj.nextRunAtMs,
		triggerFired: entryObj.triggerFired,
		model: entryObj.model,
		provider: entryObj.provider,
		usage: entryObj.usage,
		delivered: entryObj.delivered,
		deliveryStatus: entryObj.deliveryStatus,
		deliveryError: entryObj.deliveryError,
		deliverySuppressionReason: entryObj.deliverySuppressionReason,
		failureNotificationDelivery: entryObj.failureNotificationDelivery,
		delivery: entryObj.delivery,
		sessionId: entryObj.sessionId,
		sessionKey: entryObj.sessionKey
	};
}
/** Encodes Cron-owned outcome fields for retained history. */
function cronRunLogEntryToDetail(entry, options) {
	return toJsonValue({
		kind: CRON_RUN_DETAIL_KIND,
		status: entry.status,
		completionStatus: entry.completionStatus,
		error: entry.error ?? null,
		summary: entry.summary ?? null,
		storeKey: options.storeKey,
		errorReason: entry.errorReason,
		diagnostics: entry.diagnostics,
		delivered: entry.delivered,
		deliveryStatus: entry.deliveryStatus,
		deliveryError: entry.deliveryError,
		deliverySuppressionReason: entry.deliverySuppressionReason,
		failureNotificationDelivery: entry.failureNotificationDelivery,
		delivery: entry.delivery,
		sessionId: entry.sessionId,
		runId: entry.runId,
		runAtMs: entry.runAtMs,
		durationMs: entry.durationMs,
		nextRunAtMs: entry.nextRunAtMs,
		triggerFired: entry.triggerFired,
		triggerStateChanged: options.triggerEval?.fired === true ? options.triggerEval.stateChanged : void 0,
		triggerState: options.triggerEval?.fired === true && options.triggerEval.stateChanged ? options.triggerEval.state : void 0,
		scriptStateChanged: options.scriptResult?.scriptStateChanged === true ? true : void 0,
		scriptState: options.scriptResult?.scriptStateChanged === true ? options.scriptResult.scriptState : void 0,
		model: entry.model,
		provider: entry.provider,
		usage: entry.usage
	}) ?? { kind: CRON_RUN_DETAIL_KIND };
}
/** Preserves the released history row status vocabulary. */
function cronRunStorageStatus(entry) {
	if (entry.status === "ok") return (entry.completionStatus ?? resolveCronCompletionStatus({
		status: entry.status,
		delivered: entry.delivered,
		deliveryStatus: entry.deliveryStatus
	})) === "succeeded" ? "succeeded" : "failed";
	return entry.status === "error" && isCronTimeoutErrorText(entry.error) ? "timed_out" : "failed";
}
//#endregion
//#region src/infra/state-migrations.cron-run-logs.ts
const CRON_RUN_LOG_TASK_IMPORT_MIGRATION_ID = "state:cron-run-logs-to-task-runs:v1";
const CRON_RUN_LOG_IMPORT_BATCH_SIZE = 500;
function hasLegacyCronRunLogs(db) {
	const schema = getAdmittedSqliteSchemaFacts(db);
	if (schema) return schema.tables.has("cron_run_logs");
	return Boolean(db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'cron_run_logs' LIMIT 1").get());
}
function collectMirroredTasks(db) {
	const rows = db.prepare(`SELECT source_id, ended_at, detail_json
       FROM task_runs
       WHERE runtime = 'cron' AND source_id IS NOT NULL AND detail_json IS NOT NULL`).all();
	const bySource = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const detail = row.detail_json ? safeParseJsonRecord(row.detail_json) : void 0;
		if (!row.source_id || detail?.kind !== "cron-run") continue;
		const identities = bySource.get(row.source_id) ?? [];
		identities.push({
			endedAt: normalizeSqliteNumber(row.ended_at) ?? null,
			...typeof detail.runId === "string" && detail.runId ? { runId: detail.runId } : {}
		});
		bySource.set(row.source_id, identities);
	}
	return bySource;
}
function hasMirroredIdentity(identities, runId, endedAt) {
	return identities.some((identity) => runId && identity.runId ? identity.runId === runId : identity.endedAt === endedAt);
}
function integerToBoolean(value) {
	return value === null || value === void 0 ? void 0 : coerceRequiredSqliteNumber(value) !== 0;
}
/** Legacy rows trust write-time errorReason and diagnostic redaction without recomputation. */
function parseLegacyRow(row) {
	const parsed = parseCronRunLogEntryObject(safeParseJson(row.entry_json ?? ""), { jobId: row.job_id });
	if (!parsed) return null;
	return {
		...parsed,
		ts: normalizeSqliteNumber(row.ts) ?? parsed.ts,
		jobId: row.job_id,
		status: row.status ?? parsed.status,
		error: row.error ?? parsed.error,
		summary: row.summary ?? parsed.summary,
		delivered: integerToBoolean(row.delivered) ?? parsed.delivered,
		deliveryStatus: row.delivery_status ?? parsed.deliveryStatus,
		deliveryError: row.delivery_error ?? parsed.deliveryError,
		sessionId: row.session_id ?? parsed.sessionId,
		sessionKey: row.session_key ?? parsed.sessionKey,
		runId: row.run_id ?? parsed.runId,
		runAtMs: normalizeSqliteNumber(row.run_at_ms ?? null) ?? parsed.runAtMs,
		durationMs: normalizeSqliteNumber(row.duration_ms ?? null) ?? parsed.durationMs,
		nextRunAtMs: normalizeSqliteNumber(row.next_run_at_ms ?? null) ?? parsed.nextRunAtMs,
		model: row.model ?? parsed.model,
		provider: row.provider ?? parsed.provider
	};
}
/** Runs inside the state schema transaction and removes the retired table after import. */
function migrateLegacyCronRunLogsToTaskRuns(db) {
	if (!hasLegacyCronRunLogs(db)) return {
		imported: 0,
		alreadyMirrored: 0,
		malformed: 0,
		skipped: true
	};
	const mirrored = collectMirroredTasks(db);
	const ordinals = /* @__PURE__ */ new Map();
	const insert = db.prepare(`
    INSERT INTO task_runs (
      task_id, runtime, task_kind, source_id, requester_session_key, owner_key, scope_kind,
      child_session_key, parent_flow_id, parent_task_id, agent_id, requester_agent_id, run_id,
      label, task, status, delivery_status, notify_policy, created_at, started_at, ended_at,
      last_event_at, cleanup_after, error, progress_summary, terminal_summary, terminal_outcome,
      detail_json
    ) VALUES (
      @task_id, 'cron', NULL, @source_id, '', '', 'system', @child_session_key, NULL, NULL,
      NULL, NULL, @run_id, NULL, @task, @status, 'not_applicable', 'silent', @created_at,
      @started_at, @ended_at, @ended_at, NULL, @error, NULL, @terminal_summary,
      @terminal_outcome, @detail_json
    )
  `);
	let imported = 0;
	let alreadyMirrored = 0;
	let malformed = 0;
	let offset = 0;
	while (true) {
		const rows = db.prepare(`SELECT * FROM cron_run_logs
         ORDER BY job_id, ts, store_key, seq
         LIMIT ? OFFSET ?`).all(CRON_RUN_LOG_IMPORT_BATCH_SIZE, offset);
		if (rows.length === 0) break;
		offset += rows.length;
		for (const row of rows) {
			const entry = parseLegacyRow(row);
			if (!entry) {
				malformed++;
				continue;
			}
			const key = `${entry.jobId}\0${entry.ts}`;
			const ordinal = (ordinals.get(key) ?? 0) + 1;
			ordinals.set(key, ordinal);
			if (hasMirroredIdentity(mirrored.get(entry.jobId) ?? [], entry.runId, entry.ts)) {
				alreadyMirrored++;
				continue;
			}
			const taskId = `cron-runlog-import:${entry.jobId}:${entry.ts}:${ordinal}`;
			const status = cronRunStorageStatus(entry);
			insert.run({
				task_id: taskId,
				source_id: entry.jobId,
				child_session_key: entry.sessionKey?.trim() || null,
				run_id: taskId,
				task: entry.jobId,
				status,
				created_at: entry.runAtMs ?? entry.ts,
				started_at: entry.runAtMs ?? null,
				ended_at: entry.ts,
				error: entry.error ?? null,
				terminal_summary: entry.summary ?? null,
				terminal_outcome: status === "succeeded" ? "succeeded" : null,
				detail_json: JSON.stringify(cronRunLogEntryToDetail(entry, { storeKey: row.store_key }))
			});
			imported++;
		}
	}
	db.exec(`
    DROP INDEX IF EXISTS idx_cron_run_logs_store_ts;
    DROP INDEX IF EXISTS idx_cron_run_logs_job_status;
    DROP INDEX IF EXISTS idx_cron_run_logs_delivery;
    DROP TABLE cron_run_logs;
  `);
	const result = {
		imported,
		alreadyMirrored,
		malformed,
		skipped: false
	};
	const now = Date.now();
	db.prepare(`INSERT INTO migration_runs (id, started_at, finished_at, status, report_json)
     VALUES (?, ?, ?, 'completed', ?)
     ON CONFLICT(id) DO UPDATE SET
       finished_at = excluded.finished_at,
       status = excluded.status,
       report_json = excluded.report_json`).run(CRON_RUN_LOG_TASK_IMPORT_MIGRATION_ID, now, now, JSON.stringify(result));
	return result;
}
//#endregion
//#region src/state/openclaw-state-db-cron-delivery-migration.ts
/** Absence of old delivery evidence cannot prove that a completion was never sent. */
function migrateCronDeliveryAttemptState(db, previousVersion) {
	return previousVersion < 20 && tableExists(db, "cron_run_receipts") ? ensureColumn(db, "cron_run_receipts", "delivery_attempt_state TEXT NOT NULL DEFAULT 'unknown' CHECK (delivery_attempt_state IN ('unknown', 'not-started', 'started'))") : false;
}
//#endregion
//#region src/infra/sqlite-audit-record.kernel.ts
const LEGACY_AUDIT_SEQUENCE_BASE = Number.MIN_SAFE_INTEGER;
function getAuditRecordKysely(database) {
	return getNodeSqliteKysely(database);
}
function parseAuditRecord(row) {
	return {
		key: row.event_key,
		value: JSON.parse(row.payload_json),
		createdAt: row.created_at,
		sequence: row.sequence
	};
}
function readAuditWriteState(params) {
	const row = executeSqliteQueryTakeFirstSync(params.database, getAuditRecordKysely(params.database).selectFrom("diagnostic_events").select((eb) => [
		eb.fn.max("sequence").filterWhere("sequence", params.legacy ? "<" : ">=", 0).as("sequence"),
		eb.fn.countAll().as("count"),
		eb.fn.countAll().filterWhere("event_key", "=", params.key ?? "").as("keyCount")
	]).where("scope", "=", params.scope));
	const next = (row?.sequence ?? (params.legacy ? LEGACY_AUDIT_SEQUENCE_BASE : 0)) + 1;
	if (!Number.isSafeInteger(next) || params.legacy && next >= 0) throw new Error(`Audit sequence exhausted for scope ${params.scope}`);
	return {
		nextSequence: next,
		count: coerceRequiredSqliteNumber(row?.count ?? 0),
		keyExists: coerceRequiredSqliteNumber(row?.keyCount ?? 0) > 0
	};
}
function pruneAuditRecords(params) {
	const overflow = params.count - params.maxEntries;
	if (overflow <= 0) return;
	const protectedKey = params.protectedKey;
	const baseCandidates = getAuditRecordKysely(params.database).selectFrom("diagnostic_events").select("event_key").where("scope", "=", params.scope);
	const candidates = (protectedKey === void 0 ? baseCandidates : baseCandidates.where("event_key", "!=", protectedKey)).orderBy("sequence", "asc").limit(overflow);
	executeSqliteQuerySync(params.database, getAuditRecordKysely(params.database).deleteFrom("diagnostic_events").where("scope", "=", params.scope).where("event_key", "in", candidates));
}
function prepareSqliteAuditRecord(scope, record) {
	const payloadJson = JSON.stringify(record.value);
	if (payloadJson === void 0) throw new Error(`Audit record ${scope}/${record.key} is not JSON-serializable`);
	return {
		event_key: record.key,
		payload_json: payloadJson,
		created_at: record.createdAt
	};
}
function createAuditRecordInsert(database) {
	return prepareSqliteQuerySync(database, (parameter) => getAuditRecordKysely(database).insertInto("diagnostic_events").values({
		scope: parameter((record) => record.scope),
		event_key: parameter((record) => record.event_key),
		payload_json: parameter((record) => record.payload_json),
		created_at: parameter((record) => record.created_at),
		sequence: parameter((record) => record.sequence)
	}).onConflict((conflict) => conflict.columns(["scope", "event_key"]).doNothing()));
}
const auditRecordInsert = createSqliteQueryCache(createAuditRecordInsert);
/** Connection-bound operations; mutation callers retain the complete transaction. */
function createSqliteAuditRecordKernel(database, options) {
	const scope = options.scope;
	const maxEntries = options.maxEntries;
	const prune = (count, protectedKey) => pruneAuditRecords({
		database,
		scope,
		maxEntries,
		count,
		protectedKey
	});
	const selectEntries = () => getAuditRecordKysely(database).selectFrom("diagnostic_events").select([
		"event_key",
		"payload_json",
		"created_at",
		"sequence"
	]).where("scope", "=", scope);
	function insertRecord(record) {
		return Number(auditRecordInsert(database)({
			...record,
			scope
		}).numAffectedRows ?? 0);
	}
	function upsertPreparedRecord(record) {
		const state = readAuditWriteState({
			database,
			scope,
			legacy: false,
			key: record.event_key
		});
		executeSqliteQuerySync(database, getAuditRecordKysely(database).insertInto("diagnostic_events").values({
			scope,
			event_key: record.event_key,
			payload_json: record.payload_json,
			created_at: record.created_at,
			sequence: state.nextSequence
		}).onConflict((conflict) => conflict.columns(["scope", "event_key"]).doUpdateSet({
			payload_json: record.payload_json,
			created_at: record.created_at
		})));
		prune(state.count + (state.keyExists ? 0 : 1), record.event_key);
	}
	function deleteRecord(key) {
		executeSqliteQuerySync(database, getAuditRecordKysely(database).deleteFrom("diagnostic_events").where("scope", "=", scope).where("event_key", "=", key));
	}
	return {
		register(record) {
			const state = readAuditWriteState({
				database,
				scope,
				legacy: false
			});
			const inserted = insertRecord({
				...record,
				sequence: state.nextSequence
			});
			prune(state.count + inserted, record.event_key);
		},
		upsert: upsertPreparedRecord,
		delete: deleteRecord,
		compareAndSet(key, expectedPayloadJson, record) {
			if ((executeSqliteQueryTakeFirstSync(database, getAuditRecordKysely(database).selectFrom("diagnostic_events").select("payload_json").where("scope", "=", scope).where("event_key", "=", key))?.payload_json ?? null) !== expectedPayloadJson) return false;
			if (record) upsertPreparedRecord(record);
			else deleteRecord(key);
			return true;
		},
		registerLegacyMany(records) {
			const state = readAuditWriteState({
				database,
				scope,
				legacy: true
			});
			let sequence = state.nextSequence;
			let count = state.count;
			for (const record of records) {
				count += insertRecord({
					...record,
					sequence
				});
				sequence += 1;
			}
			prune(count);
		},
		entries() {
			return executeSqliteQuerySync(database, selectEntries().orderBy("sequence", "asc")).rows.map((row) => {
				const { sequence: _sequence, ...entry } = parseAuditRecord(row);
				return entry;
			});
		},
		latest(params) {
			const baseQuery = selectEntries();
			const query = params.beforeSequence === void 0 ? baseQuery : baseQuery.where("sequence", "<", params.beforeSequence);
			return executeSqliteQuerySync(database, query.orderBy("sequence", "desc").limit(params.limit)).rows.map((row) => parseAuditRecord(row));
		}
	};
}
//#endregion
//#region src/state/openclaw-state-db-additive-columns.ts
const lazyColumns = [
	[
		"agent_deletion_journal",
		"phase",
		"TEXT",
		true
	],
	[
		"agent_database_leases",
		"provenance",
		"TEXT",
		true
	],
	[
		"user_profile_identities",
		"authorization_id",
		"TEXT"
	],
	[
		"user_profile_identities",
		"authorization_basis_json",
		"TEXT"
	],
	[
		"claw_installs",
		"bootstrap_content_digest",
		"TEXT"
	],
	[
		"claw_installs",
		"bootstrap_source_path",
		"TEXT"
	],
	[
		"worker_environments",
		"desktop_json",
		"TEXT"
	],
	[
		"worker_environments",
		"bootstrap_install_kind",
		"TEXT"
	],
	[
		"worker_environments",
		"preparation_purpose",
		"TEXT"
	],
	[
		"claw_package_refs",
		"extension_adapter_identity",
		"TEXT"
	],
	[
		"claw_package_refs",
		"extension_detected_format",
		"TEXT"
	],
	[
		"claw_package_refs",
		"extension_format",
		"TEXT"
	],
	[
		"claw_package_refs",
		"extension_id",
		"TEXT"
	],
	[
		"claw_package_refs",
		"extension_mapped_json",
		"TEXT"
	],
	[
		"claw_package_refs",
		"extension_unavailable_json",
		"TEXT"
	],
	[
		"worker_environments",
		"shared_host",
		"INTEGER"
	],
	[
		"worker_environments",
		"node_setup_id",
		"TEXT"
	],
	[
		"worker_environments",
		"node_device_id",
		"TEXT"
	],
	[
		"worker_session_placements",
		"terminal_reason",
		"TEXT"
	],
	[
		"worker_session_placements",
		"terminal_at_ms",
		"INTEGER"
	],
	[
		"worker_workspace_pending_results",
		"repository_workspace_id",
		"TEXT",
		true
	],
	[
		"worker_session_placement_moves",
		"abandon_source",
		"INTEGER",
		true
	],
	[
		"worker_session_placement_moves",
		"target_machine_class",
		"TEXT",
		true
	],
	[
		"worker_session_placement_moves",
		"target_os",
		"TEXT",
		true
	],
	[
		"worktrees",
		"run_end_cleanup_json",
		"TEXT"
	],
	[
		"worktrees",
		"gc_protection_json",
		"TEXT"
	],
	[
		"device_bootstrap_tokens",
		"setup_id",
		"TEXT",
		true
	],
	[
		"session_groups",
		"cwd",
		"TEXT",
		true
	],
	[
		"session_groups",
		"worktree",
		"INTEGER",
		true
	],
	[
		"secret_store_entries",
		"allowed_hosts",
		"TEXT"
	],
	[
		"web_push_subscriptions",
		"device_id",
		"TEXT",
		true
	],
	[
		"web_push_subscriptions",
		"user_profile_id",
		"TEXT",
		true
	],
	[
		"web_push_subscriptions",
		"preferences_json",
		"TEXT",
		true
	],
	[
		"task_runs",
		"execution_owner_host",
		"TEXT",
		true
	],
	[
		"task_runs",
		"execution_owner_pid",
		"INTEGER",
		true
	],
	[
		"task_runs",
		"execution_owner_start_identity",
		"INTEGER",
		true
	],
	[
		"session_watch_cursors",
		"watcher_store_path",
		"TEXT",
		true
	],
	[
		"subagent_runs",
		"requester_store_path",
		"TEXT",
		true
	],
	[
		"subagent_runs",
		"controller_store_path",
		"TEXT",
		true
	],
	[
		"cron_jobs",
		"grant_definition_revision",
		"TEXT"
	],
	[
		"cron_jobs",
		"grant_definition_generation",
		"INTEGER"
	],
	[
		"cron_jobs",
		"grant_definition_updated_at",
		"INTEGER"
	]
];
function lazyColumnDefinitions(firstUseOnly) {
	return lazyColumns.filter((definition) => firstUseOnly === void 0 || Boolean(definition[3]) === firstUseOnly).map(([tableName, columnName, dataType]) => ({
		columnName,
		dataType,
		tableName
	}));
}
const CLAW_LAZY_ADDITIVE_STATE_COLUMN_DEFINITIONS = lazyColumnDefinitions();
const CLAW_STARTUP_ADDITIVE_STATE_COLUMN_DEFINITIONS = lazyColumnDefinitions(false);
const CLAW_FIRST_USE_ADDITIVE_STATE_COLUMN_DEFINITIONS = lazyColumnDefinitions(true);
const ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS = {
	packageUpdatedAt: [["claw_package_refs", "updated_at_ms INTEGER NOT NULL DEFAULT 0"]],
	packageIntegrity: [["claw_package_refs", "package_integrity TEXT NOT NULL DEFAULT 'sha256:0000000000000000000000000000000000000000000000000000000000000000'"]],
	diagnosticSequence: [["diagnostic_events", "sequence INTEGER NOT NULL DEFAULT 0"]],
	cronRunLogs: [
		["worktrees", "provisioned_paths_json TEXT"],
		["apns_registrations", "relay_origin TEXT"],
		["device_pairing_pending", "refreshed_at_ms INTEGER"],
		["device_pairing_pending", "browser_origin TEXT"],
		["device_pairing_paired", "approved_via TEXT"],
		["device_pairing_paired", "browser_origin TEXT"],
		["device_pairing_paired", "operator_label TEXT"],
		["device_pairing_paired", "node_surface_json TEXT"],
		["device_pairing_paired", "pending_node_surface_json TEXT"],
		["cron_run_logs", "status TEXT"],
		["cron_run_logs", "error TEXT"],
		["cron_run_logs", "summary TEXT"],
		["cron_run_logs", "diagnostics_summary TEXT"],
		["cron_run_logs", "delivery_status TEXT"],
		["cron_run_logs", "delivery_error TEXT"],
		["cron_run_logs", "delivered INTEGER"],
		["cron_run_logs", "session_id TEXT"],
		["cron_run_logs", "session_key TEXT"],
		["cron_run_logs", "run_id TEXT"],
		["cron_run_logs", "run_at_ms INTEGER"],
		["cron_run_logs", "duration_ms INTEGER"],
		["cron_run_logs", "next_run_at_ms INTEGER"],
		["cron_run_logs", "model TEXT"],
		["cron_run_logs", "provider TEXT"],
		["cron_run_logs", "total_tokens INTEGER"],
		["cron_run_logs", "entry_json TEXT NOT NULL DEFAULT '{}'"],
		["cron_run_logs", "created_at INTEGER NOT NULL DEFAULT 0"]
	],
	acpReplay: [["acp_replay_events", "estimated_bytes INTEGER NOT NULL DEFAULT 0"], ["acp_replay_sessions", "estimated_bytes INTEGER NOT NULL DEFAULT 0"]],
	cronJobs: [
		["cron_jobs", "description TEXT"],
		["cron_jobs", "declaration_key TEXT"],
		["cron_jobs", "owner_agent_id TEXT"],
		["cron_jobs", "name TEXT NOT NULL DEFAULT ''"],
		["cron_jobs", "enabled INTEGER NOT NULL DEFAULT 1"],
		["cron_jobs", "agent_id TEXT"],
		["cron_jobs", "payload_kind TEXT NOT NULL DEFAULT 'message'"],
		["cron_jobs", "state_json TEXT NOT NULL DEFAULT '{}'"],
		["cron_jobs", "runtime_updated_at_ms INTEGER"],
		["cron_jobs", "schedule_identity TEXT"],
		["cron_jobs", "sort_order INTEGER NOT NULL DEFAULT 0"]
	],
	deliveryQueue: [
		["sandbox_registry_entries", "session_key TEXT"],
		["sandbox_registry_entries", "backend_id TEXT"],
		["sandbox_registry_entries", "runtime_label TEXT"],
		["sandbox_registry_entries", "image TEXT"],
		["sandbox_registry_entries", "created_at_ms INTEGER"],
		["sandbox_registry_entries", "last_used_at_ms INTEGER"],
		["sandbox_registry_entries", "config_label_kind TEXT"],
		["sandbox_registry_entries", "config_hash TEXT"],
		["sandbox_registry_entries", "cdp_port INTEGER"],
		["sandbox_registry_entries", "no_vnc_port INTEGER"],
		["delivery_queue_entries", "entry_kind TEXT"],
		["delivery_queue_entries", "session_key TEXT"],
		["delivery_queue_entries", "channel TEXT"],
		["delivery_queue_entries", "target TEXT"],
		["delivery_queue_entries", "account_id TEXT"],
		["delivery_queue_entries", "retry_count INTEGER NOT NULL DEFAULT 0"],
		["delivery_queue_entries", "last_attempt_at INTEGER"],
		["delivery_queue_entries", "last_error TEXT"],
		["delivery_queue_entries", "recovery_state TEXT"],
		["delivery_queue_entries", "platform_send_started_at INTEGER"]
	],
	originalMediaRoot: [["managed_outgoing_image_records", "original_media_root TEXT NOT NULL DEFAULT ''"]],
	beforeTaskAttribution: [
		["managed_outgoing_image_records", "agent_id TEXT"],
		["managed_outgoing_image_records", "cleanup_pending INTEGER NOT NULL DEFAULT 0 CHECK (cleanup_pending IN (0, 1))"],
		["current_conversation_bindings", "conversation_kind TEXT NOT NULL DEFAULT 'channel'"],
		["device_bootstrap_tokens", "pending_profile_json TEXT"],
		["gateway_restart_handoff", "restart_trace_started_at INTEGER"],
		["gateway_restart_handoff", "restart_trace_last_at INTEGER"],
		["gateway_restart_intent", "reason TEXT"],
		["gateway_restart_sentinel", "delivery_channel TEXT"],
		["gateway_restart_sentinel", "delivery_to TEXT"],
		["gateway_restart_sentinel", "delivery_account_id TEXT"],
		["gateway_restart_sentinel", "message TEXT"],
		["gateway_restart_sentinel", "continuation_json TEXT"],
		["gateway_restart_sentinel", "doctor_hint TEXT"],
		["gateway_restart_sentinel", "stats_json TEXT"],
		["gateway_boot_lifecycle", "startup_reason TEXT"],
		["official_external_plugin_catalog_snapshots", "trust_mode TEXT"],
		["official_external_plugin_catalog_snapshots", "trust_key_id TEXT"],
		["official_external_plugin_catalog_snapshots", "trust_signature_count INTEGER"],
		["official_external_plugin_catalog_snapshots", "trust_threshold INTEGER"],
		["official_external_plugin_catalog_snapshots", "trust_verified_at TEXT"]
	],
	taskRequester: [["task_runs", "requester_agent_id TEXT"]],
	taskRunDetails: [
		["task_runs", "tool_use_count INTEGER"],
		["task_runs", "last_tool_name TEXT"],
		["task_runs", "detail_json TEXT"]
	],
	workerEnvironments: [
		["worker_environments", "bootstrap_bundle_hash TEXT"],
		["worker_environments", "bootstrap_openclaw_version TEXT"],
		["worker_environments", "bootstrap_protocol_features_json TEXT"],
		["worker_environments", "bootstrap_install_kind TEXT"],
		["worker_environments", "owner_epoch INTEGER NOT NULL DEFAULT 0 CHECK (owner_epoch >= 0)"],
		["worker_environments", "ssh_host_key TEXT"],
		["worker_workspace_pending_results", "staged_result_ref TEXT"],
		["worker_environments", "teardown_terminal_state TEXT CHECK (teardown_terminal_state IN ('destroyed', 'failed'))"]
	]
};
//#endregion
//#region src/acp/event-ledger-bytes.ts
/** Retained UTF-8 text footprint, including the existing fixed allowance per row. */
function estimateAcpSessionRowBytes(params) {
	return Buffer.byteLength(params.sessionId, "utf8") + Buffer.byteLength(params.sessionKey, "utf8") + Buffer.byteLength(params.cwd, "utf8") + 32;
}
function estimateAcpEventRowBytes(params) {
	return Buffer.byteLength(params.sessionId, "utf8") + Buffer.byteLength(params.sessionKey, "utf8") + Buffer.byteLength(params.runId ?? "", "utf8") + Buffer.byteLength(params.updateJson, "utf8") + 32;
}
//#endregion
//#region src/infra/approval-resolution-ref.ts
/** Build the full SHA-256 base64url locator used only when a transport cannot carry the exact id. */
function buildApprovalResolutionRef(params) {
	return sha256Base64Url(`${params.approvalKind}\0${params.approvalId}`);
}
//#endregion
//#region src/infra/json-object-members.ts
/** Read JSON object members without normalizing number spelling or compound values. */
function readJsonObjectMembers(json) {
	JSON.parse(json);
	const tokens = json.match(/"(?:[^"\\]|\\[\s\S])*"|[{}[\],:]|[^\s{}[\],:]+/gu) ?? [];
	const members = /* @__PURE__ */ new Map();
	if (tokens[0] !== "{") return members;
	for (let i = 1;;) {
		const keyToken = tokens[i];
		if (keyToken === void 0 || keyToken === "}") break;
		const key = JSON.parse(keyToken);
		i += 2;
		const start = i;
		let depth = 0;
		do {
			const token = tokens[i++];
			if (token === "{" || token === "[") depth++;
			else if (token === "}" || token === "]") depth--;
		} while (depth > 0);
		if (typeof key === "string" && !members.has(key)) members.set(key, tokens.slice(start, i).join(""));
		if (tokens[i] === ",") i++;
	}
	return members;
}
//#endregion
//#region src/infra/delivery-queue-retention-columns.ts
/** Match the historical SQLite policy predicate, including its scalar coercions. */
function deriveDeliveryQueueRetentionColumns(id, entryJson) {
	const absent = {
		retention_id_prefix: null,
		retention_max_age_ms: null,
		retention_max_entries: null
	};
	try {
		const policy = readJsonObjectMembers(entryJson).get("completionRetention");
		if (!policy?.startsWith("{")) return absent;
		const fields = readJsonObjectMembers(policy);
		const prefixJson = fields.get("idPrefix");
		const parsedPrefix = prefixJson?.startsWith("\"") ? JSON.parse(prefixJson) : prefixJson?.startsWith("[") || prefixJson?.startsWith("{") ? prefixJson : void 0;
		const prefix = typeof parsedPrefix === "string" ? parsedPrefix : void 0;
		const integer = (raw) => {
			const value = raw === "true" ? 1 : raw && /^-?\d+$/u.test(raw) ? Number(raw) : NaN;
			return Number.isSafeInteger(value) && value >= 1 ? value : void 0;
		};
		const age = integer(fields.get("maxAgeMs"));
		const count = integer(fields.get("maxEntries"));
		return prefix && !prefix.includes("\0") && id.startsWith(prefix) && age !== void 0 && count !== void 0 ? {
			retention_id_prefix: prefix,
			retention_max_age_ms: age,
			retention_max_entries: count
		} : absent;
	} catch {
		return absent;
	}
}
resolveGlobalSingleton(Symbol.for("openclaw.outboundDeliveryEnqueued"), () => /* @__PURE__ */ new Set());
//#endregion
//#region src/infra/delivery-queue-sqlite-bound.ts
const COMPLETED_TOMBSTONE_RETENTION_MS = 2592e6;
function boundedDeliveryReceipts(db) {
	return getNodeSqliteKysely(db).selectFrom("delivery_queue_entries").select([
		"queue_name",
		"id",
		"enqueued_at",
		"retention_id_prefix as id_prefix",
		"retention_max_age_ms as max_age_ms",
		"retention_max_entries as max_entries"
	]).where("status", "in", ["completed", "failed"]).where("recovery_state", "=", "completed_bounded").where("retention_id_prefix", "is not", null);
}
/** Prunes bounded receipts globally or for one exact producer namespace. */
function pruneDeliveryQueueTombstones(db, now, prefix) {
	let policies = boundedDeliveryReceipts(db);
	if (prefix) policies = policies.where("queue_name", "=", prefix.queueName).where("retention_id_prefix", "=", prefix.idPrefix);
	const queueDb = getNodeSqliteKysely(db);
	const result = executeSqliteQuerySync(db, queueDb.with("policies", () => policies).with("ranked", (qb) => qb.selectFrom("policies").selectAll().select((eb) => eb.fn.agg("row_number", []).over((window) => window.partitionBy(["queue_name", "id_prefix"]).orderBy("enqueued_at", "desc").orderBy("id", "desc")).as("retention_rank"))).deleteFrom("delivery_queue_entries").where((eb) => eb(eb.refTuple("queue_name", "id"), "in", eb.selectFrom("ranked").select(["queue_name", "id"]).where((ranked) => ranked.or([ranked("enqueued_at", "<", ranked(ranked.val(now), "-", ranked.ref("max_age_ms"))), ranked("retention_rank", ">", ranked.ref("max_entries"))])).$asTuple("queue_name", "id"))));
	const ordinaryPruned = prefix ? false : pruneOrdinaryDeliveryReceipts(db, now);
	return (result.numAffectedRows ?? 0n) > 0n || ordinaryPruned;
}
function pruneOrdinaryDeliveryReceipts(db, now) {
	return (executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("delivery_queue_entries").where("status", "=", "completed").where("enqueued_at", "<", now - COMPLETED_TOMBSTONE_RETENTION_MS).where((eb) => eb.or([eb("recovery_state", "is", null), eb("recovery_state", "not in", ["completed_permanent", "completed_bounded"])]))).numAffectedRows ?? 0n) > 0n;
}
createSqliteQueryCache(() => ({}));
createSqliteQueryCache(() => ({}));
//#endregion
//#region src/infra/delivery-queue-sqlite.types.ts
/** Parse only the shipped completion-retention shape for one exact producer ID. */
function parseDeliveryQueueCompletionRetention(value, id) {
	if (value === "permanent") return value;
	const retention = asNullableRecord(value);
	if (!retention) return;
	const idPrefix = typeof retention.idPrefix === "string" ? retention.idPrefix : "";
	const maxAgeMs = asPositiveSafeInteger(retention.maxAgeMs);
	const maxEntries = asPositiveSafeInteger(retention.maxEntries);
	if (!idPrefix || !id.startsWith(idPrefix) || maxAgeMs === void 0 || maxEntries === void 0) return;
	return {
		idPrefix,
		maxAgeMs,
		maxEntries
	};
}
const finite = (value) => typeof value === "number" && Number.isFinite(value);
/** Recover only authored or shipped producer ownership from a failed entry. */
function inferDeliveryQueueFailureRetention(entry, id, queueName, legacyAmbiguousSendEvidence = false) {
	const explicit = parseDeliveryQueueCompletionRetention(entry.completionRetention, id) ?? parseDeliveryQueueCompletionRetention(entry.failureRetention, id);
	if (explicit) return explicit;
	const fence = asNullableRecord(asNullableRecord(entry.terminalPolicy)?.fence);
	if (fence?.kind === "none") return;
	const fenced = fence?.kind === "permanent" ? "permanent" : parseDeliveryQueueCompletionRetention(fence, id);
	if (fenced) return fenced;
	const durable = queueName === "outbound-preparing-v1" || queueName === "outbound-legacy-preparing-v1" || queueName === "outbound-prepared-migration-v1" || entry.retainOnFailure === true || asNullableRecord(entry.deliveryCompletion) !== null || queueName === "session" && finite(entry.availableAt);
	const ambiguous = legacyAmbiguousSendEvidence && (typeof entry.platformSendAttemptId === "string" && entry.platformSendAttemptId.length > 0 || finite(entry.platformSendStartedAt) || entry.recoveryState === "send_attempt_started" || entry.recoveryState === "unknown_after_send" || queueName === "session" && (finite(entry.deliveryStartedAt) || typeof entry.settlementOutcome === "string" && entry.settlementOutcome.length > 0 || finite(entry.acknowledgedAt)));
	return durable || ambiguous ? "permanent" : void 0;
}
/** Strip a terminal queue row to the producer policy needed for admission. */
function projectDeliveryQueueTerminalEntry(entry, terminalAt, terminal, completionRetention) {
	const retryCount = Number.isSafeInteger(entry.retryCount) && entry.retryCount >= 0 ? entry.retryCount : 0;
	const recoveryState = completionRetention === "permanent" ? "completed_permanent" : completionRetention ? "completed_bounded" : void 0;
	return {
		id: entry.id,
		enqueuedAt: terminalAt,
		retryCount,
		...terminal === "completed" ? { acknowledgedAt: terminalAt } : { failedAt: terminalAt },
		...completionRetention ? { completionRetention } : {},
		...recoveryState ? { recoveryState } : {}
	};
}
//#endregion
//#region src/state/openclaw-state-db-delivery-queue-backfill.ts
function nonNegativeSafeInteger(value) {
	const number = typeof value === "bigint" ? Number(value) : value;
	return typeof number === "number" && Number.isSafeInteger(number) && number >= 0 ? number : void 0;
}
/** Compact every preexisting failed row without inferring replay or owner policy. */
function compactLegacyDeliveryQueueFailures(db) {
	const migrationNow = Date.now();
	const retainPending = db.prepare(`UPDATE delivery_queue_entries SET entry_json = @entryJson,
      retention_id_prefix = @retention_id_prefix, retention_max_age_ms = @retention_max_age_ms,
      retention_max_entries = @retention_max_entries
      WHERE queue_name = @queueName AND id = @id AND status = 'pending' AND entry_json = @previousJson`);
	const select = db.prepare(`SELECT queue_name, id, status, retry_count, entry_json, updated_at, failed_at, recovery_state
       FROM delivery_queue_entries WHERE status IN ('pending', 'failed')`);
	select.setReadBigInts(true);
	const rows = select.all();
	const remove = db.prepare(`DELETE FROM delivery_queue_entries WHERE queue_name = ? AND id = ? AND status = 'failed'`);
	const compact = db.prepare(`UPDATE delivery_queue_entries
        SET entry_kind = NULL, session_key = NULL, channel = NULL, target = NULL,
            account_id = NULL, retry_count = @retryCount, last_attempt_at = NULL,
            last_error = NULL, platform_send_started_at = NULL, entry_json = @entryJson,
            retention_id_prefix = @retention_id_prefix, retention_max_age_ms = @retention_max_age_ms,
            retention_max_entries = @retention_max_entries,
            enqueued_at = @failedAt, failed_at = @failedAt, recovery_state = @recoveryState
      WHERE queue_name = @queueName AND id = @id AND status = 'failed'`);
	for (const row of rows) {
		if (row.recovery_state === "settlement_pending") continue;
		const parsedEntry = safeParseJsonRecord(String(row.entry_json));
		const entry = parsedEntry ?? {};
		const queueName = String(row.queue_name);
		const id = String(row.id);
		if (row.status === "pending") {
			if (entry.retainOnFailure !== true && inferDeliveryQueueFailureRetention(entry, id, queueName, true)) {
				const entryJson = JSON.stringify({
					...entry,
					retainOnFailure: true
				});
				retainPending.run({
					entryJson,
					queueName,
					id,
					previousJson: String(row.entry_json),
					...deriveDeliveryQueueRetentionColumns(id, entryJson)
				});
			}
			continue;
		}
		const failedAt = nonNegativeSafeInteger(row.failed_at) ?? nonNegativeSafeInteger(row.updated_at) ?? migrationNow;
		const retryCount = Math.max(nonNegativeSafeInteger(row.retry_count) ?? 0, nonNegativeSafeInteger(entry.retryCount) ?? 0);
		const retention = parsedEntry ? inferDeliveryQueueFailureRetention(entry, id, queueName, true) : "permanent";
		if (!retention) {
			remove.run(queueName, id);
			continue;
		}
		const failedEntry = projectDeliveryQueueTerminalEntry({
			id,
			retryCount
		}, failedAt, "failed", retention);
		const entryJson = JSON.stringify(failedEntry);
		compact.run({
			retryCount,
			entryJson,
			...deriveDeliveryQueueRetentionColumns(id, entryJson),
			failedAt,
			recoveryState: failedEntry.recoveryState ?? null,
			queueName,
			id
		});
	}
	pruneDeliveryQueueTombstones(db, migrationNow);
}
//#endregion
//#region src/state/openclaw-state-db-operator-approval-migration.ts
function tableSql$1(db) {
	const schema = getAdmittedSqliteSchemaFacts(db);
	if (schema) return schema.tableSql.get("operator_approvals") ?? void 0;
	const row = db.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'operator_approvals'").get();
	return typeof row?.sql === "string" ? row.sql : void 0;
}
function hasCanonicalOperatorApprovalKinds(db) {
	if (!tableExists(db, "operator_approvals")) return true;
	return /kind\s+text\s+not\s+null\s+check\s*\(\s*kind\s+in\s*\(\s*'exec'\s*,\s*'plugin'\s*,\s*'system-agent'\s*\)\s*\)/.test(tableSql$1(db)?.toLowerCase() ?? "");
}
function assertCanonicalOperatorApprovalKinds(db, pathname) {
	if (!hasCanonicalOperatorApprovalKinds(db)) throw new SqliteSchemaMismatchError(`OpenClaw state database ${pathname} has a legacy operator approval schema; run openclaw doctor --fix to migrate it.`);
}
function isCanonicalOperatorApprovalKind(value) {
	return value === "exec" || value === "plugin" || value === "system-agent";
}
//#endregion
//#region src/state/openclaw-state-db-legacy-backfills.ts
function ensureOperatorApprovalResolutionRefs(db) {
	if (!tableExists(db, "operator_approvals")) return;
	runSqliteImmediateTransactionSync(db, () => {
		ensureColumn(db, "operator_approvals", "resolution_ref TEXT");
		const rows = db.prepare("SELECT approval_id, kind, resolution_ref FROM operator_approvals").all();
		const update = db.prepare("UPDATE operator_approvals SET resolution_ref = ? WHERE approval_id = ?");
		for (const row of rows) {
			if (typeof row.approval_id !== "string" || !isCanonicalOperatorApprovalKind(row.kind)) throw new Error("operator approval row cannot be assigned a transport reference");
			const resolutionRef = buildApprovalResolutionRef({
				approvalId: row.approval_id,
				approvalKind: row.kind
			});
			if (row.resolution_ref !== resolutionRef) update.run(resolutionRef, row.approval_id);
		}
		if (db.prepare(`SELECT canonical.approval_id
         FROM operator_approvals AS canonical
         JOIN operator_approvals AS referenced
           ON canonical.approval_id = referenced.resolution_ref
         WHERE canonical.approval_id <> referenced.approval_id
         LIMIT 1`).get()) throw new Error("operator approval ids conflict with durable transport references");
		db.exec(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_operator_approvals_resolution_ref
        ON operator_approvals(resolution_ref);
    `);
	});
}
function nullableTextValue(record, key) {
	if (!record || !Object.hasOwn(record, key)) return;
	const value = record[key];
	return typeof value === "string" || value === null ? value : void 0;
}
/** Promote shipped retained results before runtime hydrates canonical subagent state. */
function repairLegacySubagentRetainedResults(db) {
	if (!tableExists(db, "subagent_runs")) return;
	const repair = () => {
		const hasLegacyPendingPayload = tableHasColumn(db, "subagent_runs", "pending_final_delivery_payload_json");
		const rows = db.prepare(hasLegacyPendingPayload ? "SELECT run_id, payload_json, pending_final_delivery_payload_json FROM subagent_runs" : "SELECT run_id, payload_json FROM subagent_runs").all();
		const updateRun = db.prepare(`UPDATE subagent_runs
          SET payload_json = ?
        WHERE run_id = ?`);
		for (const row of rows) {
			const stored = safeParseJsonRecord(row.payload_json) ?? null;
			const parent = stored ? asNullableRecord(stored.parentCompletion) : null;
			const payload = parent?.completionTarget === "parent" ? parent : stored;
			const completion = payload ? asNullableRecord(payload.completion) : null;
			if (!payload || !completion) continue;
			const delivery = asNullableRecord(payload.delivery);
			const deliveryPayload = delivery ? asNullableRecord(delivery.payload) : null;
			const pendingPayload = row.pending_final_delivery_payload_json ? safeParseJsonRecord(row.pending_final_delivery_payload_json) ?? null : null;
			if (!Boolean(deliveryPayload && (Object.hasOwn(deliveryPayload, "frozenResultText") || Object.hasOwn(deliveryPayload, "fallbackFrozenResultText")) || pendingPayload && (Object.hasOwn(pendingPayload, "frozenResultText") || Object.hasOwn(pendingPayload, "fallbackFrozenResultText")))) continue;
			const legacyPrimary = nullableTextValue(deliveryPayload, "frozenResultText") ?? nullableTextValue(pendingPayload, "frozenResultText");
			const legacyFallback = nullableTextValue(deliveryPayload, "fallbackFrozenResultText") ?? nullableTextValue(pendingPayload, "fallbackFrozenResultText");
			if (nullableTextValue(completion, "resultText") == null && legacyPrimary !== void 0) completion.resultText = legacyPrimary;
			if (nullableTextValue(completion, "fallbackResultText") == null && legacyFallback !== void 0) completion.fallbackResultText = legacyFallback;
			delete deliveryPayload?.frozenResultText;
			delete deliveryPayload?.fallbackFrozenResultText;
			updateRun.run(JSON.stringify(stored), row.run_id);
		}
	};
	if (db.isTransaction) {
		repair();
		return;
	}
	runSqliteImmediateTransactionSync(db, repair);
}
/** Canonicalize shipped subagent rows whose pause/kill owner only wrote root terminal fields. */
function repairLegacySubagentExecutionPayloads(db) {
	if (!tableExists(db, "subagent_runs")) return;
	db.exec(`
    UPDATE subagent_runs
    SET payload_json = json_remove(
      CASE
        WHEN json_extract(payload_json, '$.pauseReason') = 'sessions_yield'
          AND json_extract(payload_json, '$.execution.status') <> 'terminal'
          AND json_type(payload_json, '$.endedAt') IN ('integer', 'real')
        THEN json_remove(json_set(
          payload_json,
          '$.execution.status', 'terminal',
          '$.execution.endedAt', json_extract(payload_json, '$.endedAt')
        ), '$.execution.outcome')
        WHEN (json_type(payload_json, '$.killReconciliation') = 'object'
          OR json_extract(payload_json, '$.endedReason') = 'subagent-killed')
          AND json_extract(payload_json, '$.execution.status') <> 'terminal'
          AND json_type(payload_json, '$.endedAt') IN ('integer', 'real')
          AND json_type(payload_json, '$.outcome') = 'object'
        THEN json_set(
          payload_json,
          '$.execution.status', 'terminal',
          '$.execution.endedAt', json_extract(payload_json, '$.endedAt'),
          '$.execution.outcome', json_extract(payload_json, '$.outcome')
        )
        ELSE payload_json
      END,
      '$.startedAt', '$.endedAt', '$.outcome'
    )
    WHERE json_valid(payload_json)
      AND (json_type(payload_json, '$.startedAt') IS NOT NULL
        OR json_type(payload_json, '$.endedAt') IS NOT NULL
        OR json_type(payload_json, '$.outcome') IS NOT NULL);
  `);
}
function backfillAcpReplayEstimatedBytes(db, columnsAdded = false) {
	if (!tableExists(db, "acp_replay_events") || !tableHasColumn(db, "acp_replay_events", "estimated_bytes")) return;
	const completionKey = "state.repair.acpReplayUtf8Accounting";
	const completionDb = tableExists(db, "config_machine_state") ? getNodeSqliteKysely(db) : void 0;
	if (!columnsAdded && completionDb && executeSqliteQueryTakeFirstSync(db, completionDb.selectFrom("config_machine_state").select("state_key").where("state_key", "=", completionKey))) return;
	const replayDb = getNodeSqliteKysely(db);
	const updateEvent = db.prepare("UPDATE acp_replay_events SET estimated_bytes = ? WHERE session_id = ? AND seq = ?");
	for (const row of iterateSqliteQuerySync(db, replayDb.selectFrom("acp_replay_events").select([
		"session_id",
		"seq",
		"session_key",
		"run_id",
		"update_json",
		"estimated_bytes"
	]))) {
		const expected = estimateAcpEventRowBytes({
			sessionId: row.session_id,
			sessionKey: row.session_key,
			runId: row.run_id,
			updateJson: row.update_json
		});
		if (coerceRequiredSqliteNumber(row.estimated_bytes) !== expected) updateEvent.run(expected, row.session_id, row.seq);
	}
	const updateSession = db.prepare("UPDATE acp_replay_sessions SET estimated_bytes = ? WHERE session_id = ?");
	for (const row of iterateSqliteQuerySync(db, replayDb.selectFrom("acp_replay_sessions as s").select([
		"s.session_id",
		"s.session_key",
		"s.cwd",
		"s.estimated_bytes"
	]).select((eb) => eb.fn.coalesce(eb.selectFrom("acp_replay_events as e").select((events) => events.fn.sum("e.estimated_bytes").as("total")).whereRef("e.session_id", "=", "s.session_id"), eb.val(0)).as("event_bytes")))) {
		const expected = estimateAcpSessionRowBytes({
			sessionId: row.session_id,
			sessionKey: row.session_key,
			cwd: row.cwd
		}) + coerceRequiredSqliteNumber(row.event_bytes);
		if (coerceRequiredSqliteNumber(row.estimated_bytes) !== expected) updateSession.run(expected, row.session_id);
	}
	if (completionDb) executeSqliteQuerySync(db, completionDb.insertInto("config_machine_state").values({
		state_key: completionKey,
		value_json: "true",
		updated_at_ms: Date.now()
	}).onConflict((conflict) => conflict.column("state_key").doNothing()));
}
function backfillCronRunLogEntryJson(db) {
	if (!tableExists(db, "cron_run_logs") || !tableHasColumn(db, "cron_run_logs", "entry_json")) return;
	const rows = db.prepare(`SELECT store_key, job_id, seq, ts
         FROM cron_run_logs
        WHERE entry_json = '{}'`).all();
	if (rows.length === 0) return;
	const update = db.prepare(`UPDATE cron_run_logs
        SET entry_json = ?
      WHERE store_key = ? AND job_id = ? AND seq = ?`);
	for (const row of rows) update.run(JSON.stringify({
		ts: coerceRequiredSqliteNumber(row.ts),
		jobId: row.job_id,
		action: "finished"
	}), row.store_key, row.job_id, row.seq);
}
function textField(record, key) {
	const value = record?.[key];
	return typeof value === "string" && value.trim() ? value : null;
}
function backfillCronJobsFromJobJson(db) {
	if (!tableExists(db, "cron_jobs") || !tableHasColumn(db, "cron_jobs", "job_json") || !tableHasColumn(db, "cron_jobs", "payload_kind")) return;
	const rows = db.prepare(`SELECT store_key, job_id, job_json, updated_at
         FROM cron_jobs
        WHERE payload_kind = 'message'
           OR name = ''`).all();
	if (rows.length === 0) return;
	const update = db.prepare(`UPDATE cron_jobs
        SET name = ?,
            enabled = ?,
            agent_id = ?,
            payload_kind = ?,
            runtime_updated_at_ms = ?
      WHERE store_key = ?
        AND job_id = ?`);
	for (const row of rows) {
		const job = safeParseJsonRecord(row.job_json) ?? null;
		if (!job) continue;
		const schedule = asNullableRecord(job.schedule);
		const payload = asNullableRecord(job.payload);
		const scheduleKind = textField(schedule, "kind");
		const payloadKind = textField(payload, "kind");
		const isAt = scheduleKind === "at" && textField(schedule, "at");
		const isEvery = scheduleKind === "every" && asFiniteNumber(schedule?.everyMs) != null;
		const isCron = scheduleKind === "cron" && textField(schedule, "expr");
		const isSystemEvent = payloadKind === "systemEvent" && textField(payload, "text");
		const isAgentTurn = payloadKind === "agentTurn" && textField(payload, "message");
		if (!schedule || !payload || !isAt && !isEvery && !isCron || !isSystemEvent && !isAgentTurn) continue;
		update.run(textField(job, "name") ?? row.job_id, job.enabled === false ? 0 : 1, textField(job, "agentId"), payloadKind, asFiniteNumber(job.updatedAtMs) ?? (coerceRequiredSqliteNumber(row.updated_at) || 0), row.store_key, row.job_id);
	}
}
function backfillDeliveryQueueEntriesFromEntryJson(db) {
	if (!tableExists(db, "delivery_queue_entries") || !tableHasColumn(db, "delivery_queue_entries", "entry_json") || !tableHasColumn(db, "delivery_queue_entries", "retry_count")) return;
	compactLegacyDeliveryQueueFailures(db);
	const rows = db.prepare(`SELECT queue_name, id, entry_json
         FROM delivery_queue_entries
        WHERE status = 'pending'
          AND (retry_count = 0
            OR last_attempt_at IS NULL
            OR last_error IS NULL
            OR recovery_state IS NULL
            OR platform_send_started_at IS NULL
            OR entry_kind IS NULL
            OR session_key IS NULL
            OR channel IS NULL
            OR target IS NULL
            OR account_id IS NULL)`).all();
	if (rows.length === 0) return;
	const update = db.prepare(`UPDATE delivery_queue_entries
        SET entry_kind = COALESCE(?, entry_kind),
            session_key = COALESCE(?, session_key),
            channel = COALESCE(?, channel),
            target = COALESCE(?, target),
            account_id = COALESCE(?, account_id),
            retry_count = ?,
            last_attempt_at = COALESCE(?, last_attempt_at),
            last_error = COALESCE(?, last_error),
            recovery_state = COALESCE(?, recovery_state),
            platform_send_started_at = COALESCE(?, platform_send_started_at)
      WHERE queue_name = ?
        AND id = ?`);
	for (const row of rows) {
		const entry = safeParseJsonRecord(row.entry_json) ?? null;
		if (!entry) continue;
		const session = asNullableRecord(entry.session);
		const route = asNullableRecord(entry.route);
		const deliveryContext = asNullableRecord(entry.deliveryContext);
		update.run(textField(entry, "kind"), textField(entry, "sessionKey") ?? textField(session, "key"), textField(entry, "channel") ?? textField(route, "channel") ?? textField(deliveryContext, "channel"), textField(entry, "to") ?? textField(route, "to") ?? textField(deliveryContext, "to"), textField(entry, "accountId") ?? textField(route, "accountId") ?? textField(deliveryContext, "accountId"), asSafeIntegerInRange(entry.retryCount, { min: 0 }) ?? 0, asSafeIntegerInRange(entry.lastAttemptAt, { min: 0 }) ?? null, textField(entry, "lastError"), textField(entry, "recoveryState"), asSafeIntegerInRange(entry.platformSendStartedAt, { min: 0 }) ?? null, row.queue_name, row.id);
	}
}
//#endregion
//#region src/state/openclaw-state-db-schema-v13-widerow.ts
const FAILURE_DESTINATION_COLUMNS = [
	["failure_delivery_mode", "mode"],
	["failure_delivery_channel", "channel"],
	["failure_delivery_to", "to"],
	["failure_delivery_account_id", "accountId"]
];
function reprojectLegacyCronJson(db) {
	const projectionColumns = FAILURE_DESTINATION_COLUMNS.map(([columnName]) => tableHasColumn(db, "cron_jobs", columnName) ? quoteSqliteIdentifier(columnName) : `NULL AS ${quoteSqliteIdentifier(columnName)}`);
	const lastRunStatus = tableHasColumn(db, "cron_jobs", "last_run_status") ? "last_run_status" : "NULL AS last_run_status";
	const rows = db.prepare(`SELECT store_key, job_id, enabled, job_json, state_json, ${lastRunStatus}, ${projectionColumns.join(", ")}
         FROM cron_jobs`).all();
	const update = db.prepare("UPDATE cron_jobs SET job_json = ?, state_json = ? WHERE store_key = ? AND job_id = ?");
	for (const row of rows) {
		if (typeof row.store_key !== "string" || typeof row.job_id !== "string" || typeof row.job_json !== "string" || typeof row.state_json !== "string") throw new Error("OpenClaw v12 cron job row is not canonical");
		const job = asNullableRecord(safeParseJson(row.job_json));
		const state = asNullableRecord(safeParseJson(row.state_json));
		if (!job || !state) continue;
		let changed = false;
		const delivery = asNullableRecord(job.delivery);
		const destination = asNullableRecord(delivery?.failureDestination);
		if ((!Object.hasOwn(job, "delivery") || delivery !== null) && (!delivery || !Object.hasOwn(delivery, "failureDestination") || destination !== null)) {
			const nextDelivery = delivery ?? {};
			const nextDestination = destination ?? {};
			for (const [columnName, fieldName] of FAILURE_DESTINATION_COLUMNS) {
				const value = row[columnName];
				if (typeof value !== "string" || Object.hasOwn(nextDestination, fieldName)) continue;
				nextDestination[fieldName] = value === "" ? null : value;
				changed = true;
			}
			if (changed) {
				nextDelivery.failureDestination = nextDestination;
				job.delivery = nextDelivery;
			}
		}
		if (typeof job.enabled !== "boolean") {
			job.enabled = row.enabled !== 0;
			changed = true;
		}
		const hasLegacyStatus = Object.hasOwn(state, "lastStatus");
		if (!Object.hasOwn(state, "lastRunStatus") && (hasLegacyStatus || typeof row.last_run_status === "string")) {
			state.lastRunStatus = hasLegacyStatus ? state.lastStatus : row.last_run_status;
			changed = true;
		}
		if (changed) update.run(JSON.stringify(job), JSON.stringify(state), row.store_key, row.job_id);
	}
}
function rebuildJsonCanonicalTable(db, tableName) {
	const migrationTable = `${tableName}_migration_v13`;
	if (tableExists(db, migrationTable)) throw new Error(`OpenClaw v13 migration table already exists: ${migrationTable}`);
	const migrationSchema = extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, tableName, { errorMessage: `Canonical ${tableName} schema block is missing` }).replace(`CREATE TABLE IF NOT EXISTS ${tableName} (`, `CREATE TABLE ${migrationTable} (`);
	db.exec(migrationSchema);
	const columns = db.prepare(`PRAGMA table_xinfo(${migrationTable})`).all().flatMap((column) => column.hidden === 0 && typeof column.name === "string" ? [column.name] : []);
	const projection = columns.map((columnName) => {
		return CLAW_LAZY_ADDITIVE_STATE_COLUMN_DEFINITIONS.some((column) => column.tableName === tableName && column.columnName === columnName) && !tableHasColumn(db, tableName, columnName) ? "NULL" : quoteSqliteIdentifier(columnName);
	});
	db.exec(`INSERT INTO ${migrationTable} (${columns.map(quoteSqliteIdentifier).join(", ")}) SELECT ${projection.join(", ")} FROM ${tableName};`);
	db.exec(`DROP TABLE ${tableName};`);
	db.exec(`ALTER TABLE ${migrationTable} RENAME TO ${tableName};`);
}
/** Fold obsolete physical projections into canonical JSON before removing their columns. */
function migrateJsonCanonicalWideRowsV13(db, previousVersion) {
	if (previousVersion >= 13) return false;
	let migrated = false;
	if (tableExists(db, "cron_jobs") && tableHasColumn(db, "cron_jobs", "schedule_kind")) {
		reprojectLegacyCronJson(db);
		rebuildJsonCanonicalTable(db, "cron_jobs");
		migrated = true;
	}
	const hasSetupState = tableExists(db, "workspace_setup_state");
	const hasAttestations = tableExists(db, "workspace_attestations");
	if (hasSetupState && !tableHasColumn(db, "workspace_setup_state", "attested_at_ms")) {
		db.exec("ALTER TABLE workspace_setup_state ADD COLUMN attested_at_ms INTEGER;");
		db.exec("ALTER TABLE workspace_setup_state ADD COLUMN attestation_updated_at_ms INTEGER;");
		rebuildJsonCanonicalTable(db, "workspace_setup_state");
		migrated = true;
	}
	if (hasAttestations) {
		db.exec(`
      UPDATE workspace_setup_state
         SET attested_at_ms = (
               SELECT attested_at_ms FROM workspace_attestations
                WHERE workspace_attestations.workspace_key = workspace_setup_state.workspace_key
             ),
             attestation_updated_at_ms = (
               SELECT updated_at_ms FROM workspace_attestations
                WHERE workspace_attestations.workspace_key = workspace_setup_state.workspace_key
             )
       WHERE workspace_key IN (SELECT workspace_key FROM workspace_attestations);
    `);
		const workspacePath = tableExists(db, "workspace_path_aliases") ? `(SELECT alias.workspace_path FROM workspace_path_aliases alias
           WHERE alias.workspace_key = a.workspace_key LIMIT 1)` : "NULL";
		db.exec(`
      INSERT INTO workspace_setup_state (
        workspace_key, workspace_path, attested_at_ms, attestation_updated_at_ms
      )
      SELECT a.workspace_key,
             ${workspacePath},
             a.attested_at_ms,
             a.updated_at_ms
        FROM workspace_attestations a
       WHERE a.workspace_key NOT IN (SELECT workspace_key FROM workspace_setup_state);
    `);
		db.exec("DROP TABLE workspace_attestations;");
		migrated = true;
	}
	if ((hasSetupState || hasAttestations) && tableExists(db, "workspace_generated_bootstrap_hashes")) {
		rebuildJsonCanonicalTable(db, "workspace_generated_bootstrap_hashes");
		db.exec(`
      DELETE FROM workspace_generated_bootstrap_hashes
       WHERE workspace_key NOT IN (SELECT workspace_key FROM workspace_setup_state);
    `);
	}
	for (const [tableName, jsonColumn, stateKey] of [[
		"auth_profile_stores",
		"store_json",
		"authProfiles.store"
	], [
		"auth_profile_state",
		"state_json",
		"authProfiles.state"
	]]) {
		if (!tableExists(db, tableName)) continue;
		db.prepare(`INSERT INTO config_machine_state (state_key, value_json, updated_at_ms)
       SELECT ?, ${jsonColumn}, updated_at FROM ${tableName} WHERE store_key = 'shared'
       ON CONFLICT(state_key) DO NOTHING`).run(stateKey);
		db.exec(`DROP TABLE ${tableName};`);
		migrated = true;
	}
	if (tableExists(db, "installed_plugin_index")) {
		const row = db.prepare("SELECT * FROM installed_plugin_index WHERE index_key = 'installed-plugin-index'").get();
		if (row) {
			const installRecords = asNullableRecord(safeParseJson(String(row.install_records_json)));
			const plugins = safeParseJson(String(row.plugins_json));
			const diagnostics = safeParseJson(String(row.diagnostics_json));
			if (!installRecords || !Array.isArray(plugins) || !Array.isArray(diagnostics)) {
				const scope = "plugins.installedIndex.quarantine";
				const message = `Preserved invalid legacy installed_plugin_index row in diagnostic_events (${scope}). Run openclaw doctor --fix or openclaw plugins registry --refresh to repair the plugin index; inspect the preserved row if install records need recovery.`;
				createSqliteAuditRecordKernel(db, {
					scope,
					maxEntries: Number.MAX_SAFE_INTEGER
				}).register(prepareSqliteAuditRecord(scope, {
					key: createHash("sha256").update(JSON.stringify(row)).digest("hex"),
					value: {
						level: "warn",
						message,
						raw: row
					},
					createdAt: Date.now()
				}));
				deferSqlitePostCommitPublication(db, () => createSubsystemLogger("state/db").warn(message));
			}
			const index = {
				version: Number(row.version),
				...typeof row.warning === "string" && row.warning ? { warning: row.warning } : {},
				hostContractVersion: row.host_contract_version,
				compatRegistryVersion: row.compat_registry_version,
				migrationVersion: Number(row.migration_version),
				policyHash: row.policy_hash,
				generatedAtMs: Number(row.generated_at_ms),
				...typeof row.workspace_dir === "string" ? { workspaceDir: row.workspace_dir } : {},
				...typeof row.refresh_reason === "string" && row.refresh_reason ? { refreshReason: row.refresh_reason } : {},
				installRecords,
				plugins,
				diagnostics
			};
			db.prepare(`INSERT INTO config_machine_state (state_key, value_json, updated_at_ms)
         VALUES (?, ?, ?) ON CONFLICT(state_key) DO NOTHING`).run("plugins.installedIndex", JSON.stringify({
				revision: Number(row.updated_at_ms),
				index
			}), Number(row.updated_at_ms));
		}
		db.exec("DROP TABLE installed_plugin_index;");
		migrated = true;
	}
	if (tableExists(db, "subagent_runs") && tableHasColumn(db, "subagent_runs", "task")) {
		repairLegacySubagentRetainedResults(db);
		rebuildJsonCanonicalTable(db, "subagent_runs");
		migrated = true;
	}
	return migrated;
}
//#endregion
//#region src/state/openclaw-state-db-schema-v21-columns.ts
/** Complete the derived projection before any writer or column-only reader runs. */
function migratePredicateColumnsV21(db, previousVersion) {
	if (previousVersion >= 21) return false;
	let changed = false;
	const text = (column, path) => `CASE WHEN json_valid(${column}) THEN CASE WHEN json_type(${column}, '${path}') = 'text' THEN json_extract(${column}, '${path}') END END`;
	if (tableExists(db, "meeting_transcript_sessions")) {
		const source = [
			"accountId",
			"guildId",
			"channelId",
			"meetingUrl",
			"threadTs",
			"fileId"
		];
		const columns = [
			"source_account_id",
			"source_guild_id",
			"source_channel_id",
			"source_meeting_url",
			"source_thread_ts",
			"source_file_id"
		];
		for (const column of [...columns, "metadata_agent_id"]) changed = ensureColumn(db, "meeting_transcript_sessions", `${column} TEXT`) || changed;
		db.exec(`UPDATE meeting_transcript_sessions SET
      ${columns.map((column, i) => `${column} = ${text("source_json", `$.${source[i]}`)}`).join(",")},
      metadata_agent_id = ${text("metadata_json", "$.agentId")}`);
	}
	if (tableExists(db, "meeting_transcript_summaries")) {
		changed = ensureColumn(db, "meeting_transcript_summaries", "overview TEXT") || changed;
		db.exec(`UPDATE meeting_transcript_summaries SET overview = ${text("summary_json", "$.overview")}`);
	}
	if (tableExists(db, "delivery_queue_entries")) {
		changed = ensureColumn(db, "delivery_queue_entries", "retention_id_prefix TEXT") || changed;
		changed = ensureColumn(db, "delivery_queue_entries", "retention_max_age_ms INTEGER") || changed;
		changed = ensureColumn(db, "delivery_queue_entries", "retention_max_entries INTEGER") || changed;
		db.exec(`UPDATE delivery_queue_entries SET
      (retention_id_prefix, retention_max_age_ms, retention_max_entries) = (
        SELECT id_prefix, max_age_ms, max_entries FROM (
          SELECT json_extract(entry_json, '$.completionRetention.idPrefix') id_prefix,
            json_extract(entry_json, '$.completionRetention.maxAgeMs') max_age_ms,
            json_extract(entry_json, '$.completionRetention.maxEntries') max_entries
          WHERE json_valid(entry_json)
            AND json_type(entry_json, '$.completionRetention') = 'object'
        ) WHERE typeof(id_prefix) = 'text' AND id_prefix <> ''
          AND substr(id, 1, length(id_prefix)) = id_prefix
          AND typeof(max_age_ms) = 'integer' AND max_age_ms BETWEEN 1 AND 9007199254740991
          AND typeof(max_entries) = 'integer' AND max_entries BETWEEN 1 AND 9007199254740991
      )`);
	}
	return changed;
}
//#endregion
//#region src/state/openclaw-state-db-schema-v22-columns.ts
const STATE_CURSOR_TABLES_V22 = [
	"operator_approvals",
	"cron_run_receipts",
	"execution_decision_facts",
	"skill_workshop_changes"
];
/** The schema owner holds the migration transaction with foreign keys disabled. */
function migratePortableIdentityColumnsV22(db, previousVersion) {
	if (previousVersion >= 22) return false;
	let changed = false;
	const schema = getAdmittedSqliteSchemaFacts(db) ?? captureSqliteSchemaFacts(db);
	for (const table of STATE_CURSOR_TABLES_V22) {
		if (!tableExists(db, table) || tableHasColumn(db, table, "cursor_id")) continue;
		const create = schema.tableSql.get(table);
		if (typeof create !== "string") throw new Error(`Missing v22 cursor migration schema: ${table}`);
		const temporary = quoteSqliteIdentifier(`${table}_migration_v22`);
		const name = quoteSqliteIdentifier(table);
		const columns = [...readTableColumns$1(db, table)].map(quoteSqliteIdentifier).join(", ");
		db.exec(`CREATE TABLE ${temporary} (cursor_id INTEGER NOT NULL, ${create.slice(create.indexOf("(") + 1)};
      INSERT INTO ${temporary} (rowid, ${columns}, cursor_id) SELECT rowid, ${columns}, rowid FROM ${name} ORDER BY rowid;
      DROP TABLE ${name};
      ALTER TABLE ${temporary} RENAME TO ${name};`);
		for (const object of [...schema.indexDefinitions.values(), ...schema.triggers.values()]) if (object.table === table && typeof object.sql === "string") db.exec(object.sql);
		changed = true;
	}
	if (tableExists(db, "acp_sessions")) {
		changed = ensureColumn(db, "acp_sessions", "resume_agent_session_id TEXT") || changed;
		changed = ensureColumn(db, "acp_sessions", "resume_acpx_session_id TEXT") || changed;
		const identity = "CASE WHEN json_valid(identity_json) THEN identity_json END";
		const whitespace = "char(9,10,11,12,13,32,160,5760,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8232,8233,8239,8287,12288,65279)";
		db.exec(`UPDATE acp_sessions SET
      resume_agent_session_id = CASE WHEN json_type(${identity}, '$.agentSessionId') = 'text'
        THEN trim(json_extract(${identity}, '$.agentSessionId'), ${whitespace}) END,
      resume_acpx_session_id = CASE WHEN json_type(${identity}, '$.acpxSessionId') = 'text'
        THEN trim(json_extract(${identity}, '$.acpxSessionId'), ${whitespace}) END;
      DROP INDEX IF EXISTS idx_acp_sessions_resume_agent;
      DROP INDEX IF EXISTS idx_acp_sessions_resume_acpx;`);
	}
	return changed;
}
//#endregion
//#region src/infra/state-database-maintenance.ts
const StateSchemaMutationConflictError = resolveGlobalSingleton(Symbol.for("openclaw.stateSchemaMutationConflictError"), () => class SchemaMutationConflictError extends Error {
	constructor(databasePath, cause) {
		super(`OpenClaw refused shared state schema mutation at ${databasePath} because another Gateway owns that state directory. Stop that Gateway or perform the update through its managed restart path, then retry.`, { cause });
		this.name = "StateSchemaMutationConflictError";
	}
});
/** Ordinary transactions use SQLite; schema changes retain the installation's process owner. */
function withStateDatabaseSchemaMaintenance({ databasePath, busyTimeoutMs }, operation) {
	if (requestSqliteWorkerSchemaMaintenance(databasePath)) return operation();
	const canonical = resolveIdentityPathViaExistingAncestorSync(databasePath);
	const inherited = getStateDatabaseSchemaLease(canonical);
	if (inherited) {
		inherited.assertCurrent();
		return operation();
	}
	let lease;
	try {
		lease = acquireStateDatabaseSchemaLease(canonical, { busyTimeoutMs });
	} catch (error) {
		if (error instanceof GatewayStateOwnerContentionError) throw new StateSchemaMutationConflictError(canonical, error);
		throw error;
	}
	return runWithSqliteCleanup(lease, "state schema mutation", () => lease.run(operation));
}
//#endregion
//#region src/state/openclaw-state-ownership.ts
const STATE_SUPERVISION_KEY = "gateway.supervision";
const MAX_OWNERSHIP_TIMESTAMP_MS = 864e13;
const MANAGER_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/u;
const ownershipAdmission = {
	name: "state.external-ownership",
	read(value) {
		if (value === null) return null;
		if (isRecord(value) && value.version === 1 && value.mode === "external" && typeof value.managerId === "string" && typeof value.claimedAt === "number") return {
			version: 1,
			mode: "external",
			managerId: value.managerId,
			claimedAt: value.claimedAt
		};
	}
};
function isOpenClawStateWriteContentionError(error) {
	return error instanceof GatewayStateOwnerContentionError || error instanceof StateSchemaMutationConflictError || isSqliteLockError(error);
}
function parseExternalOwnership(valueJson, databasePath) {
	let value;
	try {
		value = JSON.parse(valueJson);
	} catch {
		throw new OpenClawStateOwnershipMetadataError(databasePath, "reserved value is not valid JSON");
	}
	const record = isRecord(value) ? value : void 0;
	const keys = record ? Object.keys(record).toSorted().join(",") : "";
	const managerId = record?.managerId;
	const claimedAt = record?.claimedAt;
	if (keys !== "claimedAt,managerId,mode,version" || record?.version !== 1 || record?.mode !== "external" || typeof managerId !== "string" || !MANAGER_ID_PATTERN.test(managerId) || typeof claimedAt !== "number" || !Number.isSafeInteger(claimedAt) || claimedAt < 0 || claimedAt > MAX_OWNERSHIP_TIMESTAMP_MS) throw new OpenClawStateOwnershipMetadataError(databasePath, "reserved value does not match the version 1 external ownership contract");
	return {
		version: 1,
		mode: "external",
		managerId,
		claimedAt
	};
}
/** Inspect the reserved ownership row without entering the shared-state lifecycle. */
function inspectOpenClawStateOwnershipFromDatabase(database, databasePath, configMachineStateTableReady = false) {
	try {
		if (!configMachineStateTableReady && !tableExists(database, "config_machine_state")) return null;
		const ownershipSql = configMachineStateTableReady || isPostgresSqlConnection(database) ? "SELECT value_json FROM config_machine_state WHERE state_key = ? LIMIT 1" : "SELECT value_json FROM config_machine_state NOT INDEXED WHERE state_key = ? LIMIT 1";
		const row = database.prepare(ownershipSql).get(STATE_SUPERVISION_KEY);
		if (!row) return null;
		if (typeof row.value_json !== "string") throw new OpenClawStateOwnershipMetadataError(databasePath, "reserved value is not text");
		return parseExternalOwnership(row.value_json, databasePath);
	} catch (error) {
		throw normalizeOpenClawStateSchemaReadError(error, databasePath);
	}
}
function assertOwnershipAllowsWrite(status, databasePath, env) {
	if (status && !isGatewayExternallySupervised(env)) throw new OpenClawStateExternalOwnershipError(databasePath, status.managerId);
}
/** Fence shared-state writes once an external manager has claimed ownership. */
function assertOpenClawStateWriteAllowed(options) {
	const resolvedPath = path.resolve(options.databasePath);
	assertStateDatabaseAccessAllowed(resolvedPath);
	let status = options.inspectOwnership ? void 0 : getSqliteDatabaseAdmission(options.database, ownershipAdmission);
	if (status === void 0) {
		const inspected = inspectOpenClawStateOwnershipFromDatabase(options.database, resolvedPath, options.schemaReady);
		status = options.inspectOwnership ? void 0 : getSqliteDatabaseAdmission(options.database, ownershipAdmission);
		if (status === void 0) {
			status = inspected;
			publishSqliteDatabaseAdmission(options.database, ownershipAdmission, status);
		}
	}
	assertOwnershipAllowsWrite(status, resolvedPath, options.env ?? process.env);
}
//#endregion
//#region src/state/openclaw-state-schema-compatibility.ts
const CLAW_LAZY_ADDITIVE_STATE_COLUMNS = CLAW_LAZY_ADDITIVE_STATE_COLUMN_DEFINITIONS.map(({ columnName, tableName }) => `${tableName}.${columnName}`);
const CLAW_FIRST_USE_ADDITIVE_STATE_COLUMNS = CLAW_FIRST_USE_ADDITIVE_STATE_COLUMN_DEFINITIONS.map(({ columnName, tableName }) => `${tableName}.${columnName}`);
new Set(CLAW_FIRST_USE_ADDITIVE_STATE_COLUMNS);
[...CLAW_STARTUP_ADDITIVE_STATE_COLUMN_DEFINITIONS.map(({ columnName, tableName }) => `${tableName}.${columnName}`), ...Object.values(ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS).flat().map(([tableName, definition]) => `${tableName}.${definition.split(" ", 1)[0]}`)];
const CLAW_STARTUP_ADDITIVE_STATE_TABLES = ["worker_session_tool_operations", "worker_turn_tool_authorities"];
new Set(CLAW_STARTUP_ADDITIVE_STATE_TABLES);
const CLAW_READONLY_OPTIONAL_STATE_INDEXES = [
	"idx_meeting_transcript_utterances_id",
	"idx_operator_approvals_source_run_resolved",
	"idx_task_runs_requester_session_key",
	"idx_worker_session_placements_environment"
];
const runtimeSchemaCache = /* @__PURE__ */ new Map();
/** Project canonical SQL to the tables the shared runtime may create during this open. */
function getOpenClawStateRuntimeSchema(options) {
	const { includeVersionLazyAdditiveTables, includeAgentDeletionJournal = true } = options;
	const key = `${includeVersionLazyAdditiveTables}:${includeAgentDeletionJournal}`;
	const cached = runtimeSchemaCache.get(key);
	if (cached !== void 0) return cached;
	let schema = OPENCLAW_STATE_SCHEMA_SQL;
	const omittedTables = [...includeVersionLazyAdditiveTables ? FIRST_USE_STATE_TABLES : LAZY_ADDITIVE_STATE_TABLES, ...includeAgentDeletionJournal ? [] : DOCTOR_OWNED_STATE_TABLES];
	const omittedIndexes = includeVersionLazyAdditiveTables ? FIRST_USE_STATE_INDEXES : LAZY_ADDITIVE_STATE_INDEXES;
	for (const tableName of omittedTables) schema = schema.replace(extractSqliteTableSchema(schema, tableName, { errorMessage: `lazy additive state schema block is missing for ${tableName}` }), "");
	for (const indexName of omittedIndexes) {
		const plainStart = schema.indexOf(`CREATE INDEX IF NOT EXISTS ${indexName}`);
		const uniqueStart = schema.indexOf(`CREATE UNIQUE INDEX IF NOT EXISTS ${indexName}`);
		const start = plainStart >= 0 ? plainStart : uniqueStart;
		const end = start >= 0 ? schema.indexOf(";", start) : -1;
		if (start < 0 || end < 0) throw new Error(`lazy additive state schema index is missing for ${indexName}`);
		schema = `${schema.slice(0, start)}${schema.slice(end + 1)}`;
	}
	runtimeSchemaCache.set(key, schema);
	return schema;
}
const STATE_PERSISTENT_SCHEMA_COMPATIBILITY = {
	allowCompatibleAdditiveColumns: true,
	allowedMissingTables: DOCTOR_OWNED_STATE_TABLES,
	allowedMissingColumns: CLAW_FIRST_USE_ADDITIVE_STATE_COLUMNS,
	allowedColumnDefinitions: {
		"diagnostic_events.sequence": ["sequence INTEGER NOT NULL DEFAULT 0"],
		"claw_package_refs.package_integrity": ["package_integrity TEXT NOT NULL DEFAULT 'sha256:0000000000000000000000000000000000000000000000000000000000000000'"],
		"claw_package_refs.updated_at_ms": ["updated_at_ms INTEGER NOT NULL DEFAULT 0"],
		"cron_jobs.enabled": ["enabled INTEGER NOT NULL DEFAULT 1"],
		"cron_jobs.name": ["name TEXT NOT NULL DEFAULT ''"],
		"cron_jobs.payload_kind": ["payload_kind TEXT NOT NULL DEFAULT 'message'"],
		"current_conversation_bindings.conversation_kind": ["conversation_kind TEXT NOT NULL DEFAULT 'channel'"],
		"operator_approvals.resolution_ref": ["resolution_ref TEXT"],
		"worker_environments.desktop_json": ["desktop_json TEXT"],
		"worker_environments.bootstrap_install_kind": ["bootstrap_install_kind TEXT"],
		"worker_environments.shared_host": ["shared_host INTEGER CHECK (shared_host IN (0, 1))"],
		"worker_environments.node_setup_id": ["node_setup_id TEXT"],
		"worker_environments.node_device_id": ["node_device_id TEXT"],
		"worker_session_placements.terminal_reason": ["terminal_reason TEXT"],
		"worker_session_placements.terminal_at_ms": ["terminal_at_ms INTEGER"]
	}
};
const STATE_RUNTIME_SCHEMA_COMPATIBILITY = {
	...STATE_PERSISTENT_SCHEMA_COMPATIBILITY,
	excludedTables: LAZY_ADDITIVE_STATE_TABLES,
	excludedIndexes: LAZY_ADDITIVE_STATE_INDEXES
};
const OPENCLAW_STATE_MAINTENANCE_SCHEMA_COMPATIBILITY = {
	...STATE_PERSISTENT_SCHEMA_COMPATIBILITY,
	allowedMissingTables: [
		...LAZY_ADDITIVE_STATE_TABLES,
		...CLAW_STARTUP_ADDITIVE_STATE_TABLES,
		...DOCTOR_OWNED_STATE_TABLES
	],
	allowedMissingIndexes: CLAW_READONLY_OPTIONAL_STATE_INDEXES,
	allowedMissingColumns: CLAW_LAZY_ADDITIVE_STATE_COLUMNS
};
//#endregion
//#region src/state/openclaw-update-schema-refusal.ts
/** An unfenced updater needs a manual update when safe publication deferral is unavailable. */
var UpdateSchemaRefusalError = class extends Error {
	constructor(databases, updaterVersion, options) {
		const { targetVersion } = options;
		const commands = options.recovery?.commands ?? [
			"openclaw gateway stop",
			`npm install -g openclaw@${targetVersion} --allow-scripts=openclaw`,
			"openclaw doctor --fix",
			"openclaw gateway start"
		];
		const reason = options.cause === void 0 ? "" : ` Deferral failed: ${formatErrorMessage(options.cause).slice(0, 600)}.`;
		const summary = `Doctor refused update-time schema repair driven by OpenClaw ${updaterVersion}: this updater reopens the ledger with old code after migration, and version publication could not be deferred safely.`;
		const unchanged = `${databases.map((database) => `${database.kind} database ${database.path}: on-disk schema ${database.foundVersion}, this build's schema ${database.supportedVersion}.`).join(" ")}${reason} The blocked schema change was not applied.`;
		super(options.recovery ? `${summary} ${unchanged}\n${options.recovery.message}` : [
			summary,
			unchanged,
			"Let the updater restore the previous package and exit. Then use an independent shell with the original service account, package prefix, profile, and state/config overrides.",
			`Manual update: ${commands.join(" && ")}.`,
			`Use the package manager that owns this install (pnpm: pnpm add -g --allow-build=openclaw openclaw@${targetVersion}; Bun: bun add -g --trust openclaw@${targetVersion}). On npm 11.15 and earlier, omit --allow-scripts=openclaw.`
		].join("\n"), options);
		this.databases = databases;
		this.updaterVersion = updaterVersion;
		this.code = "update-schema-bump-unfenced";
		this.name = "UpdateSchemaRefusalError";
		this.targetVersion = targetVersion;
		this.commands = commands;
	}
};
//#endregion
//#region src/state/openclaw-state-db-maintenance.ts
const STATE_V6_ADDITIVE_TABLES = [
	"gateway_origin_device_tokens",
	...LAZY_ADDITIVE_STATE_TABLES,
	"worker_session_tool_operations",
	"worker_turn_tool_authorities"
];
const STATE_V5_ADDITIVE_TABLES = [
	"agent_database_leases",
	"agent_deletion_journal",
	"claw_cron_refs",
	"claw_installs",
	"claw_mcp_server_refs",
	"claw_package_refs",
	"claw_workspace_files",
	"config_machine_state",
	"cron_job_scratch",
	"meeting_transcript_sessions",
	"meeting_transcript_summaries",
	"meeting_transcript_utterances",
	"outbound_media_provenance",
	"worker_environment_credentials",
	"worker_transcript_commit_heads",
	"worker_transcript_commits",
	...STATE_V6_ADDITIVE_TABLES
];
const STATE_MIGRATION_VERSIONS = [
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15,
	16,
	17,
	18,
	19,
	20,
	21
];
/** Require canonical shared-state ownership without requiring the latest schema. */
function assertOpenClawStateDatabaseOwner(database, options) {
	const admitted = getStateSchemaVersionAdmission(database);
	if (admitted && getStateRuntimeSchemaAdmission(database)) return { schema_version: admitted.userVersion };
	const hasMetadataTable = tableExists(database, "schema_meta");
	let metadata;
	try {
		metadata = hasMetadataTable ? database.prepare("SELECT role, schema_version FROM schema_meta WHERE meta_key = 'primary' LIMIT 1").get() : void 0;
	} catch (error) {
		throw classifySqliteTableReadError(database, "schema_meta", [
			"meta_key",
			"role",
			"schema_version"
		], error);
	}
	if (metadata?.role !== "global") {
		const role = typeof metadata?.role === "string" ? metadata.role : "missing";
		throw new SqliteSchemaMismatchError(`OpenClaw state database ${options.pathname} has schema role ${role}; expected global. Run openclaw doctor --fix to inspect and repair its ownership.`);
	}
	return metadata;
}
/** Require the canonical shared-state owner and schema before offline file maintenance. */
function assertOpenClawStateDatabaseForMaintenance(database, options, readTable) {
	if (isPostgresSqlConnection(database)) requireNativeDatabaseFile("postgres", "repair");
	const userVersion = assertSupportedStateSchemaVersion(database, options.pathname, options.schemaVersions);
	if ((options.schemaVersions?.contentVersion ?? readStateSchemaContentVersion(database)) !== 22) throw new SqliteSchemaMismatchError(`OpenClaw state database ${options.pathname} uses schema version ${userVersion}; run openclaw doctor --fix before compacting it.`);
	const metadata = assertOpenClawStateDatabaseOwner(database, options);
	if (metadata?.schema_version !== userVersion) {
		const schemaVersion = typeof metadata?.schema_version === "number" ? metadata.schema_version : "invalid";
		throw new SqliteSchemaMismatchError(`OpenClaw state database ${options.pathname} metadata schema version ${schemaVersion} does not match ${userVersion}; run openclaw doctor --fix before compacting it.`);
	}
	assertSqliteSchemaContains(database, options.pathname, OPENCLAW_STATE_SCHEMA_SQL, OPENCLAW_STATE_MAINTENANCE_SCHEMA_COMPATIBILITY, readTable);
}
function assertOpenClawStateDatabaseVersionForMigration(database, options) {
	const userVersion = readSqliteUserVersion(database);
	if (readStateSchemaContentVersion(database) !== options.version) throw new SqliteSchemaMismatchError(`OpenClaw state database ${options.pathname} uses schema version ${userVersion}; expected ${options.version} before migrating it.`);
	const metadata = assertOpenClawStateDatabaseOwner(database, options);
	if (metadata?.schema_version !== userVersion) {
		const schemaVersion = typeof metadata?.schema_version === "number" ? metadata.schema_version : "invalid";
		throw new SqliteSchemaMismatchError(`OpenClaw state database ${options.pathname} metadata schema version ${schemaVersion} does not match ${userVersion}; repair the ownership metadata before migrating it.`);
	}
	assertSqliteSchemaTablesPresent(database, options.pathname, OPENCLAW_STATE_SCHEMA_SQL, { allowedMissingTables: [...options.version === 5 ? STATE_V5_ADDITIVE_TABLES : options.version < 13 ? STATE_V6_ADDITIVE_TABLES : LAZY_ADDITIVE_STATE_TABLES, ...DOCTOR_OWNED_STATE_TABLES] });
}
/** Keep historical migration gates beside their version-specific ownership assertions. */
const openClawStateMigrationAssertions = new Map(STATE_MIGRATION_VERSIONS.map((version) => [version, (database, options) => assertOpenClawStateDatabaseVersionForMigration(database, {
	...options,
	version
})]));
function markCurrentStateSchemaVersion(db, options = {}) {
	if (!tableExists(db, "audit_events")) return;
	const version = resolveStateSchemaVersionToPublish(db);
	db.exec(`PRAGMA user_version = ${version};`);
	publishStateSchemaVersionAdmission(db, {
		userVersion: version,
		contentVersion: 22
	});
	if (tableExists(db, "schema_meta") && [
		"meta_key",
		"schema_version",
		"updated_at"
	].every((column) => tableHasColumn(db, "schema_meta", column))) {
		const now = Date.now();
		if (options.createMetadataIfMissing) {
			db.prepare(`INSERT INTO schema_meta (
           meta_key, role, schema_version, agent_id, app_version, created_at, updated_at
         ) VALUES ('primary', 'global', ?, NULL, NULL, ?, ?)
         ON CONFLICT(meta_key) DO UPDATE SET
           schema_version = excluded.schema_version,
           updated_at = excluded.updated_at`).run(version, now, now);
			return;
		}
		db.prepare("UPDATE schema_meta SET schema_version = ?, updated_at = ? WHERE meta_key = 'primary'").run(version, now);
	}
}
/** Historical jobs lost the creator's origin; preserve attribution without guessing authority. */
function migrateCronCreatorNamespaces(db, previousVersion) {
	if (previousVersion >= 14 || !tableExists(db, "cron_jobs")) return false;
	db.exec(`
    UPDATE cron_jobs
       SET job_json = json_set(job_json, '$.createdActor.source', 'unknown')
     WHERE json_valid(job_json)
       AND json_extract(job_json, '$.createdActor.type') = 'human';
  `);
	return true;
}
/** Keep opaque plugin targets independent of agent identity without rewriting binding records. */
function migrateConversationBindingTargets(db, previousVersion) {
	if (previousVersion >= 15) return false;
	const columns = ["target_agent_id", "target_session_id"].filter((column) => tableHasColumn(db, "current_conversation_bindings", column));
	if (columns.length === 0) return false;
	db.exec("DROP INDEX IF EXISTS idx_current_conversation_bindings_target;");
	for (const column of columns) db.exec(`ALTER TABLE current_conversation_bindings DROP COLUMN ${column};`);
	return true;
}
/** Add preparation and activation facts without rebuilding the referenced environment table. */
function migratePreparedWorkerOwnership(db, previousVersion) {
	if (previousVersion >= 17 || !tableExists(db, "worker_environments")) return false;
	const start = OPENCLAW_STATE_SCHEMA_SQL.indexOf("CREATE TABLE IF NOT EXISTS worker_environments (");
	const end = OPENCLAW_STATE_SCHEMA_SQL.indexOf("\n) STRICT;", start);
	if (start < 0 || end < start) throw new Error("OpenClaw worker environment schema marker is missing.");
	const columns = splitSqlList(OPENCLAW_STATE_SCHEMA_SQL.slice(start + 48, end)).map((column) => column.trim()).filter((column) => column.startsWith("last_activated_at_ms ") || column.startsWith("preparation_"));
	let changed = false;
	for (const column of columns) changed = ensureColumn(db, "worker_environments", column) || changed;
	return changed;
}
/** Historical publication rows retain unknown requesters; first use still owns absent tables. */
function migrateGitHubPublicationRequesterAuthority(db, previousVersion) {
	if (previousVersion >= 18) return false;
	let changed = false;
	for (const table of ["github_publication_session_lifecycles", "github_repository_publication_requests"]) if (tableExists(db, table)) changed = ensureColumn(db, table, "requester_authority_json TEXT") || changed;
	return changed;
}
const statePredicateColumnMigration = {
	version: 21,
	tables: [
		"meeting_transcript_sessions",
		"meeting_transcript_summaries",
		"delivery_queue_entries"
	],
	columns: [
		...[
			"source_account_id",
			"source_guild_id",
			"source_channel_id",
			"source_meeting_url",
			"source_thread_ts",
			"source_file_id",
			"metadata_agent_id"
		].map((column) => `meeting_transcript_sessions.${column}`),
		"meeting_transcript_summaries.overview",
		"delivery_queue_entries.retention_id_prefix",
		"delivery_queue_entries.retention_max_age_ms",
		"delivery_queue_entries.retention_max_entries"
	],
	migrate: migratePredicateColumnsV21,
	applied: "Derived meeting transcript selectors and bounded delivery retention columns (v21)"
};
const statePortableIdentityMigration = {
	version: 22,
	tables: ["acp_sessions", ...STATE_CURSOR_TABLES_V22],
	columns: [
		"acp_sessions.resume_agent_session_id",
		"acp_sessions.resume_acpx_session_id",
		...STATE_CURSOR_TABLES_V22.map((table) => `${table}.cursor_id`)
	],
	migrate: migratePortableIdentityColumnsV22,
	applied: "Promoted portable ACP resume keys and cursor identities (v22)"
};
/** Version-gated column and row migrations, oldest first; each runs inside the caller's schema transaction. */
const versionedStateMigrations = [
	statePortableIdentityMigration,
	{
		migrate: migrateJsonCanonicalWideRowsV13,
		applied: "Consolidated shared state tables (v13)"
	},
	{
		migrate: migrateCronCreatorNamespaces,
		applied: "Qualified historical cron creator attribution as unknown (v14)"
	},
	{
		migrate: migrateConversationBindingTargets,
		applied: "Removed redundant conversation binding target projections (v15)"
	},
	{
		migrate: migratePreparedWorkerOwnership,
		applied: "Recorded prepared worker ownership and one-use lifecycle (v17)"
	},
	{
		migrate: migrateGitHubPublicationRequesterAuthority,
		applied: "Added original requester authority to GitHub publication receipts (v18)"
	},
	{
		migrate: migrateCronDeliveryAttemptState,
		applied: "Recorded cron completion delivery attempt uncertainty (v20)"
	}
];
/** Recent version migrations own only their tables; Doctor owns unrelated historical repair. */
function migrateBoundedStateSchema(db, previousVersion, options = {}) {
	const pending = [statePredicateColumnMigration, statePortableIdentityMigration].filter(({ version }) => version > previousVersion);
	if (previousVersion >= 22 || pending.length !== 22 - previousVersion) return;
	const tables = new Set(pending.flatMap((migration) => migration.tables));
	const indexes = getCanonicalSqliteNamedIndexContracts(OPENCLAW_STATE_SCHEMA_SQL).filter((index) => tables.has(index.tableName));
	if (!options.versionMigrationOnly && (tableExists(db, "cron_run_logs") || collectSqliteSchemaIssues(db, "\n\nCREATE TABLE IF NOT EXISTS mcp_oauth_stores (\n  store_key TEXT NOT NULL PRIMARY KEY,\n  format_version INTEGER NOT NULL CHECK (format_version = 1),\n  store_json TEXT NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS mcp_oauth_pending_authorizations (\n  state TEXT NOT NULL PRIMARY KEY,\n  store_key TEXT NOT NULL,\n  create_time INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS diagnostic_events (\n  scope TEXT NOT NULL,\n  event_key TEXT NOT NULL,\n  payload_json TEXT NOT NULL,\n  created_at INTEGER NOT NULL,\n  sequence INTEGER NOT NULL DEFAULT 0,\n  PRIMARY KEY (scope, event_key)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_diagnostic_events_scope_sequence\n  ON diagnostic_events(scope, sequence, event_key);\n\nCREATE TABLE IF NOT EXISTS skill_usage (\n  skill_file TEXT NOT NULL PRIMARY KEY,\n  skill_key TEXT NOT NULL,\n  skill_name TEXT NOT NULL,\n  skill_source TEXT NOT NULL,\n  first_used_at_ms INTEGER NOT NULL,\n  last_used_at_ms INTEGER NOT NULL,\n  use_count INTEGER NOT NULL,\n  last_agent_id TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_skill_usage_key\n  ON skill_usage(skill_key, skill_file);\n\n-- Profile-owned skill library: additive, absent until first publication/import.\nCREATE TABLE IF NOT EXISTS skill_library_entries (\n  skill_id TEXT NOT NULL PRIMARY KEY,\n  owner_profile_id TEXT,\n  author_profile_id TEXT NOT NULL,\n  slug TEXT NOT NULL,\n  current_revision TEXT NOT NULL,\n  shared INT NOT NULL,\n  enabled INT NOT NULL,\n  removed INT NOT NULL,\n  created_at INT NOT NULL,\n  updated_at INT NOT NULL\n) STRICT;\nCREATE TABLE IF NOT EXISTS skill_library_revisions (\n  skill_id TEXT NOT NULL,\n  revision TEXT NOT NULL,\n  description TEXT NOT NULL,\n  files_json TEXT NOT NULL,\n  created_at INT NOT NULL,\n  PRIMARY KEY (skill_id, revision)\n) STRICT;\nCREATE TABLE IF NOT EXISTS skill_library_events (\n  event_id TEXT NOT NULL PRIMARY KEY,\n  skill_id TEXT NOT NULL,\n  revision TEXT NOT NULL,\n  action TEXT NOT NULL,\n  actor_profile_id TEXT NOT NULL,\n  created_at INT NOT NULL\n) STRICT;\nCREATE TABLE IF NOT EXISTS skill_library_uploads (\n  upload_id TEXT NOT NULL PRIMARY KEY,\n  owner_profile_id TEXT NOT NULL,\n  slug TEXT NOT NULL,\n  size_bytes INT NOT NULL,\n  sha256 TEXT NOT NULL,\n  archive_blob BLOB NOT NULL,\n  expires_at INT NOT NULL,\n  published_skill_id TEXT\n) STRICT;\n-- End profile-owned skill library.\n\nCREATE TABLE IF NOT EXISTS skill_workshop_changes (\n  cursor_id INTEGER NOT NULL,\n  change_id TEXT NOT NULL PRIMARY KEY,\n  agent_id TEXT NOT NULL,\n  skill_name TEXT NOT NULL,\n  action TEXT NOT NULL CHECK (action IN ('create', 'patch', 'write_file', 'remove_file', 'archive', 'restore')),\n  actor TEXT NOT NULL CHECK (actor IN ('agent', 'review', 'curator', 'user')),\n  summary TEXT NOT NULL,\n  version_id TEXT,\n  session_key TEXT,\n  run_id TEXT,\n  created_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE UNIQUE INDEX IF NOT EXISTS skill_workshop_changes_cursor_id_idx\n  ON skill_workshop_changes(cursor_id);\n\nCREATE INDEX IF NOT EXISTS idx_skill_workshop_changes_agent_time\n  ON skill_workshop_changes(agent_id, created_at_ms);\n\nCREATE TABLE IF NOT EXISTS audit_events (\n  sequence INTEGER PRIMARY KEY AUTOINCREMENT,\n  event_id TEXT NOT NULL UNIQUE,\n  source_id TEXT NOT NULL UNIQUE,\n  schema_version INTEGER NOT NULL DEFAULT 1,\n  source_sequence INTEGER NOT NULL,\n  occurred_at INTEGER NOT NULL,\n  kind TEXT NOT NULL,\n  action TEXT NOT NULL,\n  status TEXT NOT NULL,\n  error_code TEXT,\n  actor_type TEXT NOT NULL,\n  actor_id TEXT NOT NULL,\n  agent_id TEXT,\n  session_key TEXT,\n  session_id TEXT,\n  run_id TEXT,\n  tool_call_id TEXT,\n  tool_name TEXT,\n  direction TEXT,\n  channel TEXT,\n  conversation_kind TEXT,\n  message_outcome TEXT,\n  reason_code TEXT,\n  delivery_kind TEXT,\n  failure_stage TEXT,\n  duration_ms INTEGER,\n  result_count INTEGER,\n  account_ref TEXT,\n  conversation_ref TEXT,\n  message_ref TEXT,\n  target_ref TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_time\n  ON audit_events(occurred_at DESC, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_agent_sequence\n  ON audit_events(agent_id, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_session_sequence\n  ON audit_events(session_key, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_run_sequence\n  ON audit_events(run_id, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_kind_sequence\n  ON audit_events(kind, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_status_sequence\n  ON audit_events(status, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_channel_sequence\n  ON audit_events(channel, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_direction_sequence\n  ON audit_events(direction, sequence DESC);\n\nCREATE TABLE IF NOT EXISTS outbound_message_execution_bindings (\n  event_id TEXT NOT NULL PRIMARY KEY,\n  context_id TEXT NOT NULL CHECK (length(context_id) BETWEEN 1 AND 256),\n  execution_id TEXT NOT NULL CHECK (length(execution_id) BETWEEN 1 AND 256),\n  run_id TEXT NOT NULL CHECK (length(run_id) BETWEEN 1 AND 256),\n  FOREIGN KEY (event_id) REFERENCES audit_events(event_id) ON DELETE CASCADE\n) STRICT;\nCREATE INDEX IF NOT EXISTS outbound_message_execution_bindings_execution_event_idx\n  ON outbound_message_execution_bindings (context_id, execution_id, run_id, event_id);\n\nCREATE TABLE IF NOT EXISTS outbound_message_progress (\n  sequence INTEGER PRIMARY KEY AUTOINCREMENT,\n  progress_id TEXT NOT NULL UNIQUE CHECK (length(progress_id) BETWEEN 1 AND 256),\n  source_id TEXT NOT NULL UNIQUE CHECK (length(source_id) BETWEEN 1 AND 512),\n  source_sequence INTEGER NOT NULL CHECK (source_sequence >= 1),\n  schema_version INTEGER NOT NULL CHECK (schema_version = 1),\n  occurred_at INTEGER NOT NULL CHECK (occurred_at >= 0),\n  action TEXT NOT NULL CHECK (\n    action IN ('message.outbound.queued', 'message.outbound.platform-started')\n  ),\n  outcome TEXT NOT NULL CHECK (outcome IN ('queued', 'platform_started')),\n  actor_type TEXT NOT NULL CHECK (actor_type IN ('agent', 'system')),\n  actor_id TEXT NOT NULL CHECK (length(actor_id) BETWEEN 1 AND 256),\n  agent_id TEXT CHECK (agent_id IS NULL OR length(agent_id) BETWEEN 1 AND 256),\n  run_id TEXT CHECK (run_id IS NULL OR length(run_id) BETWEEN 1 AND 256),\n  context_id TEXT,\n  execution_id TEXT,\n  channel TEXT NOT NULL CHECK (length(channel) BETWEEN 1 AND 256),\n  conversation_kind TEXT NOT NULL CHECK (\n    conversation_kind IN ('direct', 'group', 'channel', 'unknown')\n  ),\n  duration_ms INTEGER CHECK (duration_ms IS NULL OR duration_ms >= 0),\n  account_ref TEXT,\n  conversation_ref TEXT,\n  target_ref TEXT,\n  UNIQUE (occurred_at, progress_id)\n) STRICT;\nCREATE INDEX IF NOT EXISTS outbound_message_progress_occurred_idx\n  ON outbound_message_progress (occurred_at, sequence);\nCREATE INDEX IF NOT EXISTS outbound_message_progress_run_occurred_idx\n  ON outbound_message_progress (run_id, occurred_at, sequence);\n\nCREATE TABLE IF NOT EXISTS audit_identity_keys (\n  id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),\n  key_id TEXT NOT NULL,\n  key BLOB NOT NULL,\n  created_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS config_revision_keys (\n  id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),\n  hmac_key BLOB NOT NULL CHECK (length(hmac_key) = 32)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS execution_identity_contexts (\n  context_id TEXT NOT NULL PRIMARY KEY CHECK (length(context_id) BETWEEN 1 AND 256),\n  execution_id TEXT NOT NULL UNIQUE CHECK (length(execution_id) BETWEEN 1 AND 256),\n  run_id TEXT NOT NULL CHECK (length(run_id) BETWEEN 1 AND 256),\n  created_at INTEGER NOT NULL CHECK (created_at >= 0),\n  coverage_state TEXT NOT NULL CHECK (\n    coverage_state IN ('attribution-only', 'unattributed', 'unknown', 'unsupported')\n  ),\n  context_bytes INTEGER NOT NULL CHECK (context_bytes BETWEEN 1 AND 16384),\n  context_json TEXT NOT NULL CHECK (length(context_json) > 0),\n  UNIQUE (created_at, context_id)\n) STRICT;\nCREATE INDEX IF NOT EXISTS execution_identity_contexts_run_created_idx\n  ON execution_identity_contexts (run_id, created_at, execution_id);\n\nCREATE TABLE IF NOT EXISTS execution_decision_facts (\n  cursor_id INTEGER NOT NULL,\n  receipt_id TEXT NOT NULL PRIMARY KEY CHECK (length(receipt_id) BETWEEN 1 AND 256),\n  context_id TEXT NOT NULL CHECK (length(context_id) BETWEEN 1 AND 256),\n  execution_id TEXT NOT NULL CHECK (length(execution_id) BETWEEN 1 AND 256),\n  run_id TEXT NOT NULL CHECK (length(run_id) BETWEEN 1 AND 256),\n  action_id TEXT CHECK (action_id IS NULL OR length(action_id) BETWEEN 1 AND 256),\n  action_family TEXT NOT NULL CHECK (length(action_family) BETWEEN 1 AND 256),\n  decision_outcome TEXT NOT NULL CHECK (\n    decision_outcome IN ('allowed', 'denied', 'not-applicable', 'unknown')\n  ),\n  coverage_state TEXT NOT NULL CHECK (\n    coverage_state IN ('enforced', 'attribution-only', 'unattributed', 'unknown', 'unsupported')\n  ),\n  reason_code TEXT NOT NULL CHECK (length(reason_code) BETWEEN 1 AND 256),\n  owner TEXT NOT NULL CHECK (length(owner) BETWEEN 1 AND 256),\n  source_ref TEXT NOT NULL CHECK (length(source_ref) BETWEEN 1 AND 256),\n  occurred_at INTEGER NOT NULL CHECK (occurred_at >= 0),\n  receipt_bytes INTEGER NOT NULL CHECK (receipt_bytes BETWEEN 1 AND 16384),\n  receipt_json TEXT NOT NULL CHECK (length(receipt_json) > 0),\n  UNIQUE (occurred_at, receipt_id)\n) STRICT;\nCREATE UNIQUE INDEX IF NOT EXISTS execution_decision_facts_cursor_id_idx\n  ON execution_decision_facts(cursor_id);\n\nCREATE INDEX IF NOT EXISTS execution_decision_facts_context_occurred_idx\n  ON execution_decision_facts (context_id, occurred_at, receipt_id);\nCREATE INDEX IF NOT EXISTS execution_decision_facts_run_occurred_idx\n  ON execution_decision_facts (run_id, occurred_at, receipt_id);\n\n-- Exact admission identity stays separate from owner-native lifecycle rows so\n-- older readers retain byte-compatible cron/task/flow table definitions.\nCREATE TABLE IF NOT EXISTS execution_owner_lifecycle_bindings (\n  owner_kind TEXT NOT NULL,\n  owner_id TEXT NOT NULL,\n  context_id TEXT NOT NULL,\n  execution_id TEXT NOT NULL,\n  PRIMARY KEY (owner_kind, owner_id)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS session_state_events (\n  sequence INTEGER PRIMARY KEY AUTOINCREMENT,\n  dedupe_key TEXT UNIQUE,\n  session_key TEXT NOT NULL,\n  session_id TEXT,\n  agent_id TEXT NOT NULL,\n  kind TEXT NOT NULL,\n  actor_type TEXT NOT NULL,\n  actor_id TEXT,\n  run_id TEXT,\n  occurred_at INTEGER NOT NULL,\n  summary TEXT NOT NULL,\n  payload_json TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_session_state_events_session_sequence\n  ON session_state_events(session_key, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_session_state_events_time\n  ON session_state_events(occurred_at DESC, sequence DESC);\n\nCREATE TABLE IF NOT EXISTS session_state_heads (\n  session_key TEXT NOT NULL,\n  agent_id TEXT NOT NULL,\n  last_sequence INTEGER NOT NULL,\n  pruned_max_sequence INTEGER NOT NULL DEFAULT 0,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (session_key, agent_id)\n) STRICT;\n\n-- Notifiable watcher identity is the bare session key, matching the process-local\n-- system-event queue it feeds. Provenance distinguishes explicit immediate-wake\n-- watches from ambient queue-only group watches. Other bare keys\n-- (session.scope=\"global\") are ambiguous across agents and excluded until watcher\n-- identity is agent-scoped end-to-end.\nCREATE TABLE IF NOT EXISTS session_watch_cursors (\n  watcher_session_key TEXT NOT NULL,\n  watcher_store_path TEXT,\n  target_session_key TEXT NOT NULL,\n  last_seen_sequence INTEGER NOT NULL DEFAULT 0,\n  notified_sequence INTEGER NOT NULL DEFAULT 0,\n  material_sequence INTEGER NOT NULL DEFAULT 0,\n  provenance TEXT NOT NULL DEFAULT 'explicit' CHECK (provenance IN ('explicit', 'ambient-group')),\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (watcher_session_key, target_session_key)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_session_watch_cursors_target\n  ON session_watch_cursors(target_session_key);\n\nCREATE TABLE IF NOT EXISTS session_upstream_links (\n  session_key TEXT NOT NULL,\n  agent_id TEXT NOT NULL,\n  catalog_id TEXT NOT NULL,\n  host_id TEXT NOT NULL,\n  thread_id TEXT NOT NULL,\n  upstream_kind TEXT NOT NULL,\n  upstream_ref_json TEXT,\n  last_marker_json TEXT,\n  last_scanned_at INTEGER,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  -- (session_key, agent_id) composite identity: under session.scope=\"global\" agents\n  -- share bare keys; a key-only row would let one agent overwrite another's upstream.\n  PRIMARY KEY (session_key, agent_id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_session_upstream_links_catalog_id\n  ON session_upstream_links(catalog_id);\n\nCREATE TABLE IF NOT EXISTS state_leases (\n  scope TEXT NOT NULL,\n  lease_key TEXT NOT NULL,\n  owner TEXT NOT NULL,\n  expires_at INTEGER,\n  heartbeat_at INTEGER,\n  payload_json TEXT,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (scope, lease_key)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_state_leases_expiry\n  ON state_leases(expires_at, scope, lease_key)\n  WHERE expires_at IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_state_leases_owner\n  ON state_leases(owner, updated_at DESC);\n\nCREATE TABLE IF NOT EXISTS exec_approvals_config (\n  config_key TEXT NOT NULL PRIMARY KEY,\n  raw_json TEXT NOT NULL,\n  socket_path TEXT,\n  has_socket_token INTEGER NOT NULL,\n  default_security TEXT,\n  default_ask TEXT,\n  default_ask_fallback TEXT,\n  auto_allow_skills INTEGER,\n  agent_count INTEGER NOT NULL,\n  allowlist_count INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS operator_approvals (\n  cursor_id INTEGER NOT NULL,\n  approval_id TEXT NOT NULL PRIMARY KEY CHECK (\n    length(approval_id) > 0 AND approval_id NOT IN ('.', '..')\n  ),\n  resolution_ref TEXT NOT NULL CHECK (\n    length(resolution_ref) = 43 AND resolution_ref NOT GLOB '*[^A-Za-z0-9_-]*'\n  ),\n  kind TEXT NOT NULL CHECK (kind IN ('exec', 'plugin', 'system-agent')),\n  status TEXT NOT NULL CHECK (status IN ('pending', 'allowed', 'denied', 'expired', 'cancelled')),\n  presentation_json TEXT NOT NULL,\n  requested_by_device_id TEXT,\n  requested_by_client_id TEXT,\n  requested_by_device_token_auth INTEGER NOT NULL DEFAULT 0,\n  reviewer_device_ids_json TEXT NOT NULL,\n  source_agent_id TEXT,\n  source_session_key TEXT,\n  source_session_id TEXT,\n  source_run_id TEXT,\n  source_tool_call_id TEXT,\n  source_tool_name TEXT,\n  audience_session_keys_json TEXT NOT NULL,\n  runtime_epoch TEXT NOT NULL,\n  created_at_ms INTEGER NOT NULL,\n  expires_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  decision TEXT CHECK (decision IN ('allow-once', 'allow-always', 'deny')),\n  terminal_reason TEXT CHECK (\n    terminal_reason IN (\n      'user',\n      'timeout',\n      'malformed-verdict',\n      'no-route',\n      'run-aborted',\n      'gateway-restart',\n      'storage-corrupt'\n    )\n  ),\n  resolved_at_ms INTEGER,\n  resolver_kind TEXT CHECK (resolver_kind IN ('device', 'channel', 'runtime', 'system')),\n  resolver_id TEXT,\n  consumed_at_ms INTEGER,\n  consumed_by TEXT,\n  CHECK (expires_at_ms >= created_at_ms),\n  CHECK (updated_at_ms >= created_at_ms),\n  CHECK (resolved_at_ms IS NULL OR resolved_at_ms >= created_at_ms),\n  CHECK (resolved_at_ms IS NULL OR resolved_at_ms <= updated_at_ms),\n  CHECK (consumed_at_ms IS NULL OR consumed_at_ms >= resolved_at_ms),\n  CHECK (consumed_at_ms IS NULL OR consumed_at_ms <= updated_at_ms),\n  CHECK (requested_by_device_token_auth IN (0, 1)),\n  CHECK (\n    (\n      status = 'pending'\n      AND decision IS NULL\n      AND terminal_reason IS NULL\n      AND resolved_at_ms IS NULL\n      AND resolver_kind IS NULL\n      AND resolver_id IS NULL\n      AND consumed_at_ms IS NULL\n      AND consumed_by IS NULL\n    )\n    OR (\n      status = 'allowed'\n      AND decision IN ('allow-once', 'allow-always')\n      AND terminal_reason = 'user'\n      AND resolved_at_ms IS NOT NULL\n      AND resolver_kind IS NOT NULL\n    )\n    OR (\n      status = 'denied'\n      AND decision = 'deny'\n      AND terminal_reason IN ('user', 'malformed-verdict', 'no-route', 'storage-corrupt')\n      AND resolved_at_ms IS NOT NULL\n      AND resolver_kind IS NOT NULL\n      AND consumed_at_ms IS NULL\n      AND consumed_by IS NULL\n    )\n    OR (\n      status = 'expired'\n      AND decision = 'deny'\n      AND terminal_reason = 'timeout'\n      AND resolved_at_ms IS NOT NULL\n      AND resolver_kind IS NOT NULL\n      AND consumed_at_ms IS NULL\n      AND consumed_by IS NULL\n    )\n    OR (\n      status = 'cancelled'\n      AND decision = 'deny'\n      AND terminal_reason IN ('run-aborted', 'gateway-restart')\n      AND resolved_at_ms IS NOT NULL\n      AND resolver_kind IS NOT NULL\n      AND consumed_at_ms IS NULL\n      AND consumed_by IS NULL\n    )\n  ),\n  CHECK (\n    (consumed_at_ms IS NULL AND consumed_by IS NULL)\n    OR (\n      status = 'allowed'\n      AND decision = 'allow-once'\n      AND consumed_at_ms IS NOT NULL\n      AND consumed_by IS NOT NULL\n    )\n  )\n) STRICT;\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_operator_approvals_cursor_id\n  ON operator_approvals(cursor_id);\n\nCREATE INDEX IF NOT EXISTS idx_operator_approvals_status_expiry\n  ON operator_approvals(status, expires_at_ms, approval_id);\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_operator_approvals_resolution_ref\n  ON operator_approvals(resolution_ref);\n\nCREATE INDEX IF NOT EXISTS idx_operator_approvals_source_session_created\n  ON operator_approvals(source_session_key, created_at_ms DESC, approval_id);\n\nCREATE INDEX IF NOT EXISTS idx_operator_approvals_source_run_resolved\n  ON operator_approvals(source_run_id, resolved_at_ms, approval_id)\n  WHERE source_run_id IS NOT NULL AND resolved_at_ms IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_operator_approvals_resolved\n  ON operator_approvals(resolved_at_ms, approval_id)\n  WHERE resolved_at_ms IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_operator_approvals_runtime_pending\n  ON operator_approvals(runtime_epoch, approval_id)\n  WHERE status = 'pending';\n\nCREATE TABLE IF NOT EXISTS operator_approval_execution_identities (\n  approval_id TEXT NOT NULL PRIMARY KEY\n    REFERENCES operator_approvals(approval_id) ON DELETE CASCADE,\n  source_context_id TEXT NOT NULL CHECK (\n    length(source_context_id) BETWEEN 1 AND 256 AND source_context_id = trim(source_context_id)\n  ),\n  source_execution_id TEXT NOT NULL CHECK (\n    length(source_execution_id) BETWEEN 1 AND 256 AND source_execution_id = trim(source_execution_id)\n  )\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS operator_approval_standing_grants (\n  grant_id TEXT NOT NULL PRIMARY KEY CHECK (length(grant_id) > 0),\n  minted_by_approval_id TEXT NOT NULL\n    REFERENCES operator_approvals(approval_id) ON DELETE CASCADE,\n  agent_id TEXT NOT NULL CHECK (length(agent_id) > 0),\n  cron_job_id TEXT NOT NULL CHECK (length(cron_job_id) > 0),\n  job_config_revision TEXT NOT NULL CHECK (length(job_config_revision) > 0),\n  operation_binding TEXT NOT NULL CHECK (length(operation_binding) > 0),\n  created_at_ms INTEGER NOT NULL,\n  expires_at_ms INTEGER CHECK (expires_at_ms IS NULL OR expires_at_ms >= created_at_ms),\n  revoked_at_ms INTEGER,\n  revoked_by TEXT,\n  last_used_at_ms INTEGER,\n  use_count INTEGER NOT NULL DEFAULT 0\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_operator_approval_standing_grants_binding\n  ON operator_approval_standing_grants(agent_id, cron_job_id, operation_binding, created_at_ms DESC);\n\nCREATE TABLE IF NOT EXISTS operator_approval_standing_grant_generations (\n  grant_id TEXT NOT NULL PRIMARY KEY\n    REFERENCES operator_approval_standing_grants(grant_id) ON DELETE CASCADE,\n  job_definition_generation INTEGER NOT NULL CHECK (job_definition_generation >= 1)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS schema_meta (\n  meta_key TEXT NOT NULL PRIMARY KEY,\n  role TEXT NOT NULL,\n  schema_version INTEGER NOT NULL,\n  agent_id TEXT,\n  app_version TEXT,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS config_machine_state (\n  state_key TEXT NOT NULL PRIMARY KEY,\n  value_json TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS device_pairing_pending (\n  request_id TEXT NOT NULL PRIMARY KEY,\n  device_id TEXT NOT NULL,\n  public_key TEXT NOT NULL,\n  display_name TEXT,\n  platform TEXT,\n  device_family TEXT,\n  client_id TEXT,\n  client_mode TEXT,\n  browser_origin TEXT,\n  role TEXT,\n  roles_json TEXT,\n  scopes_json TEXT,\n  remote_ip TEXT,\n  silent INTEGER,\n  is_repair INTEGER,\n  ts INTEGER NOT NULL,\n  refreshed_at_ms INTEGER\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_device_pairing_pending_device\n  ON device_pairing_pending(device_id, ts DESC);\n\nCREATE TABLE IF NOT EXISTS device_pairing_paired (\n  device_id TEXT NOT NULL PRIMARY KEY,\n  public_key TEXT NOT NULL,\n  display_name TEXT,\n  operator_label TEXT,\n  platform TEXT,\n  device_family TEXT,\n  client_id TEXT,\n  client_mode TEXT,\n  browser_origin TEXT,\n  role TEXT,\n  roles_json TEXT,\n  scopes_json TEXT,\n  approved_scopes_json TEXT,\n  remote_ip TEXT,\n  tokens_json TEXT,\n  approved_via TEXT,\n  node_surface_json TEXT,\n  pending_node_surface_json TEXT,\n  created_at_ms INTEGER NOT NULL,\n  approved_at_ms INTEGER NOT NULL,\n  last_seen_at_ms INTEGER,\n  last_seen_reason TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_device_pairing_paired_approved\n  ON device_pairing_paired(approved_at_ms DESC, device_id);\n\nCREATE TABLE IF NOT EXISTS device_bootstrap_tokens (\n  token_key TEXT NOT NULL PRIMARY KEY,\n  token TEXT NOT NULL,\n  setup_id TEXT,\n  ts INTEGER NOT NULL,\n  device_id TEXT,\n  public_key TEXT,\n  profile_json TEXT,\n  redeemed_profile_json TEXT,\n  pending_profile_json TEXT,\n  issued_at_ms INTEGER NOT NULL,\n  last_used_at_ms INTEGER\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_device_bootstrap_tokens_ts\n  ON device_bootstrap_tokens(ts);\n\n-- Terminal outcome of a redeemed setup credential. The bootstrap row is deleted\n-- on redemption, so this is the only durable proof a setup code succeeded; the\n-- presenting client reconciles it when the completion broadcast is missed.\n-- Non-secret only: never the bootstrap token or anything derived from it.\n-- Bounded by retention to a handful of live rows, so the primary key is the\n-- only access path worth having.\nCREATE TABLE IF NOT EXISTS device_pair_setup_completions (\n  setup_id TEXT NOT NULL PRIMARY KEY,\n  device_id TEXT NOT NULL,\n  device_name TEXT,\n  access TEXT NOT NULL,\n  completed_at_ms INTEGER NOT NULL,\n  delivery_state TEXT NOT NULL CHECK (delivery_state IN ('uncertain', 'confirmed')),\n  retain_until_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS device_pairing_join_codes (\n  shortcode TEXT,\n  payload_json TEXT,\n  created_at_ms INTEGER,\n  expires_at_ms INTEGER\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS device_identities (\n  identity_key TEXT NOT NULL PRIMARY KEY,\n  device_id TEXT NOT NULL,\n  public_key_pem TEXT NOT NULL,\n  private_key_pem TEXT NOT NULL,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_device_identities_device\n  ON device_identities(device_id, updated_at_ms DESC);\n\nCREATE TABLE IF NOT EXISTS device_auth_tokens (\n  device_id TEXT NOT NULL,\n  role TEXT NOT NULL,\n  token TEXT NOT NULL,\n  scopes_json TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (device_id, role)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_device_auth_tokens_updated\n  ON device_auth_tokens(updated_at_ms DESC, device_id, role);\n\nCREATE TABLE IF NOT EXISTS gateway_origin_device_tokens (\n  gateway_scope TEXT NOT NULL,\n  device_id TEXT NOT NULL,\n  role TEXT NOT NULL,\n  token TEXT NOT NULL,\n  scopes_json TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (gateway_scope, device_id, role)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS macos_port_guardian_records (\n  pid INTEGER NOT NULL PRIMARY KEY,\n  port INTEGER NOT NULL,\n  command TEXT NOT NULL,\n  mode TEXT NOT NULL,\n  timestamp REAL NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_macos_port_guardian_records_port\n  ON macos_port_guardian_records(port, timestamp DESC);\n\nCREATE TABLE IF NOT EXISTS workspace_setup_state (\n  workspace_key TEXT NOT NULL PRIMARY KEY,\n  -- NULL only for attestation-only rows whose legacy source never recorded a\n  -- path (orphan hashed-key attestations); setup rows always carry one.\n  workspace_path TEXT,\n  -- NULL setup columns mean an attestation-only row: replaceWorkspaceAttestation\n  -- may record hashes before any setup milestone exists for the workspace.\n  version INTEGER,\n  bootstrap_seeded_at TEXT,\n  setup_completed_at TEXT,\n  updated_at INTEGER,\n  attested_at_ms INTEGER,\n  attestation_updated_at_ms INTEGER,\n  CHECK (version IS NULL OR workspace_path IS NOT NULL)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_workspace_setup_state_path\n  ON workspace_setup_state(workspace_path);\n\nCREATE TABLE IF NOT EXISTS workspace_path_aliases (\n  alias_key TEXT NOT NULL PRIMARY KEY,\n  alias_path TEXT NOT NULL,\n  workspace_key TEXT NOT NULL,\n  workspace_path TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_workspace_path_aliases_workspace\n  ON workspace_path_aliases(workspace_key);\n\n\n\nCREATE TABLE IF NOT EXISTS workspace_generated_bootstrap_hashes (\n  workspace_key TEXT NOT NULL,\n  filename TEXT NOT NULL,\n  sha256 TEXT NOT NULL,\n  PRIMARY KEY (workspace_key, filename),\n  FOREIGN KEY (workspace_key) REFERENCES workspace_setup_state(workspace_key) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS native_hook_relay_bridges (\n  relay_id TEXT NOT NULL PRIMARY KEY,\n  pid INTEGER NOT NULL,\n  hostname TEXT NOT NULL,\n  port INTEGER NOT NULL,\n  token TEXT NOT NULL,\n  expires_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_native_hook_relay_bridges_expires\n  ON native_hook_relay_bridges(expires_at_ms, relay_id);\n\nCREATE TABLE IF NOT EXISTS managed_outgoing_image_records (\n  attachment_id TEXT NOT NULL PRIMARY KEY,\n  session_key TEXT NOT NULL,\n  agent_id TEXT,\n  message_id TEXT,\n  created_at TEXT NOT NULL,\n  updated_at TEXT,\n  retention_class TEXT,\n  alt TEXT NOT NULL,\n  original_media_root TEXT NOT NULL,\n  original_media_id TEXT NOT NULL,\n  original_media_subdir TEXT NOT NULL,\n  original_content_type TEXT NOT NULL,\n  original_width INTEGER,\n  original_height INTEGER,\n  original_size_bytes INTEGER,\n  original_filename TEXT,\n  record_json TEXT NOT NULL,\n  cleanup_pending INTEGER NOT NULL DEFAULT 0 CHECK (cleanup_pending IN (0, 1))\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_session\n  ON managed_outgoing_image_records(session_key, created_at DESC, attachment_id);\n\nCREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_message\n  ON managed_outgoing_image_records(session_key, message_id, attachment_id)\n  WHERE message_id IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_agent_session\n  ON managed_outgoing_image_records(session_key, agent_id, created_at DESC, attachment_id);\n\nCREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_agent_message\n  ON managed_outgoing_image_records(session_key, agent_id, message_id, attachment_id)\n  WHERE message_id IS NOT NULL;\n\nCREATE TABLE IF NOT EXISTS channel_pairing_requests (\n  channel_key TEXT NOT NULL,\n  account_id TEXT NOT NULL,\n  request_id TEXT NOT NULL,\n  code TEXT NOT NULL,\n  created_at TEXT NOT NULL,\n  last_seen_at TEXT NOT NULL,\n  meta_json TEXT,\n  PRIMARY KEY (channel_key, account_id, request_id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_channel_pairing_requests_code\n  ON channel_pairing_requests(channel_key, code);\n\nCREATE INDEX IF NOT EXISTS idx_channel_pairing_requests_created\n  ON channel_pairing_requests(channel_key, created_at, request_id);\n\nCREATE TABLE IF NOT EXISTS channel_pairing_allow_entries (\n  channel_key TEXT NOT NULL,\n  account_id TEXT NOT NULL,\n  entry TEXT NOT NULL,\n  sort_order INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (channel_key, account_id, entry)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_channel_pairing_allow_account\n  ON channel_pairing_allow_entries(channel_key, account_id, sort_order, entry);\n\nCREATE TABLE IF NOT EXISTS web_push_subscriptions (\n  endpoint_hash TEXT NOT NULL PRIMARY KEY,\n  subscription_id TEXT NOT NULL UNIQUE,\n  endpoint TEXT NOT NULL,\n  p256dh TEXT NOT NULL,\n  auth TEXT NOT NULL,\n  device_id TEXT,\n  user_profile_id TEXT,\n  preferences_json TEXT,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_web_push_subscriptions_updated\n  ON web_push_subscriptions(updated_at_ms DESC, subscription_id);\n\nCREATE TABLE IF NOT EXISTS web_push_approval_deliveries (\n  approval_id TEXT NOT NULL\n    REFERENCES operator_approvals(approval_id) ON DELETE CASCADE,\n  subscription_id TEXT NOT NULL\n    REFERENCES web_push_subscriptions(subscription_id) ON DELETE CASCADE,\n  device_id TEXT NOT NULL,\n  user_profile_id TEXT,\n  prepared_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (approval_id, subscription_id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_web_push_approval_deliveries_subscription\n  ON web_push_approval_deliveries(subscription_id, approval_id);\n\nCREATE TABLE IF NOT EXISTS apns_registrations (\n  node_id TEXT NOT NULL PRIMARY KEY,\n  transport TEXT NOT NULL,\n  token TEXT,\n  relay_handle TEXT,\n  send_grant TEXT,\n  installation_id TEXT,\n  relay_origin TEXT,\n  topic TEXT NOT NULL,\n  environment TEXT NOT NULL,\n  distribution TEXT,\n  token_debug_suffix TEXT,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_apns_registrations_updated\n  ON apns_registrations(updated_at_ms DESC, node_id);\n\nCREATE TABLE IF NOT EXISTS apns_registration_tombstones (\n  node_id TEXT NOT NULL PRIMARY KEY,\n  deleted_at_ms INTEGER NOT NULL\n) STRICT;\n\n-- Node-host-owned launch journal. The descriptor and its credential remain\n-- process memory only; this table records bounded supervision facts.\nCREATE TABLE IF NOT EXISTS node_worker_launches (\n  launch_id TEXT NOT NULL PRIMARY KEY\n    CHECK (length(launch_id) BETWEEN 1 AND 256 AND instr(launch_id, char(0)) = 0),\n  plan_hash TEXT NOT NULL\n    CHECK (length(plan_hash) = 64 AND plan_hash NOT GLOB '*[^0-9a-f]*'),\n  gateway_namespace TEXT NOT NULL\n    CHECK (\n      length(gateway_namespace) BETWEEN 1 AND 128\n      AND gateway_namespace NOT GLOB '*[^A-Za-z0-9._-]*'\n      AND gateway_namespace GLOB '[A-Za-z0-9]*'\n    ),\n  environment_id TEXT NOT NULL\n    CHECK (length(environment_id) BETWEEN 1 AND 256 AND instr(environment_id, char(0)) = 0),\n  session_id TEXT NOT NULL\n    CHECK (length(session_id) BETWEEN 1 AND 256 AND instr(session_id, char(0)) = 0),\n  owner_epoch INTEGER NOT NULL CHECK (owner_epoch BETWEEN 1 AND 9007199254740991),\n  placement_generation INTEGER NOT NULL\n    CHECK (placement_generation BETWEEN 0 AND 9007199254740991),\n  run_id TEXT NOT NULL\n    CHECK (length(run_id) BETWEEN 1 AND 256 AND instr(run_id, char(0)) = 0),\n  state TEXT NOT NULL\n    CHECK (state IN ('pending', 'running', 'completed', 'failed', 'interrupted', 'cancelled')),\n  supervisor_pid INTEGER NOT NULL CHECK (supervisor_pid BETWEEN 1 AND 2147483647),\n  supervisor_start_time INTEGER NOT NULL\n    CHECK (supervisor_start_time BETWEEN 0 AND 9007199254740991),\n  worker_pid INTEGER CHECK (worker_pid IS NULL OR worker_pid BETWEEN 1 AND 2147483647),\n  worker_start_time INTEGER CHECK (\n    worker_start_time IS NULL OR worker_start_time BETWEEN 0 AND 9007199254740991\n  ),\n  result_json TEXT CHECK (\n    result_json IS NULL\n    OR (\n      length(CAST(result_json AS BLOB)) BETWEEN 1 AND 65536\n      AND instr(result_json, char(0)) = 0\n      AND json_valid(result_json)\n    )\n  ),\n  error_text TEXT CHECK (\n    error_text IS NULL\n    OR (\n      length(CAST(error_text AS BLOB)) BETWEEN 1 AND 4096\n      AND instr(error_text, char(0)) = 0\n      AND instr(error_text, char(10)) = 0\n      AND instr(error_text, char(13)) = 0\n    )\n  ),\n  completed_at_ms INTEGER CHECK (\n    completed_at_ms IS NULL OR completed_at_ms BETWEEN 0 AND 9007199254740991\n  ),\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms BETWEEN 0 AND 9007199254740991),\n  updated_at_ms INTEGER NOT NULL CHECK (\n    updated_at_ms BETWEEN created_at_ms AND 9007199254740991\n  ),\n  CHECK ((worker_pid IS NULL) = (worker_start_time IS NULL)),\n  CHECK (\n    (state = 'pending'\n      AND worker_pid IS NULL AND result_json IS NULL AND error_text IS NULL\n      AND completed_at_ms IS NULL)\n    OR\n    (state = 'running'\n      AND worker_pid IS NOT NULL AND result_json IS NULL AND error_text IS NULL\n      AND completed_at_ms IS NULL)\n    OR\n    (state = 'completed'\n      AND result_json IS NOT NULL AND error_text IS NULL\n      AND completed_at_ms BETWEEN created_at_ms AND updated_at_ms)\n    OR\n    (state IN ('failed', 'interrupted', 'cancelled')\n      AND result_json IS NULL AND error_text IS NOT NULL\n      AND completed_at_ms BETWEEN created_at_ms AND updated_at_ms)\n  )\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_node_worker_launches_terminal_completed\n  ON node_worker_launches(completed_at_ms, launch_id)\n  WHERE completed_at_ms IS NOT NULL;\n\nCREATE TABLE IF NOT EXISTS node_worker_launch_boots (\n  launch_id TEXT NOT NULL PRIMARY KEY\n    REFERENCES node_worker_launches(launch_id) ON DELETE CASCADE,\n  boot_id TEXT CHECK (boot_id IS NULL OR length(boot_id) BETWEEN 1 AND 128)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS node_worker_launch_containers (\n  launch_id TEXT PRIMARY KEY,\n  container_json TEXT\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS node_worker_launch_cleanup (\n  launch_id TEXT NOT NULL PRIMARY KEY\n    REFERENCES node_worker_launches(launch_id) ON DELETE CASCADE,\n  cleanup_mode TEXT NOT NULL CHECK (cleanup_mode IN ('process-group', 'owned-anchor')),\n  lineage_settled INTEGER CHECK (lineage_settled IS NULL OR lineage_settled = 1)\n) STRICT;\n\n-- Older readers retain owned-anchor custody: lineage EOF is not this certificate.\nCREATE TABLE IF NOT EXISTS node_worker_launch_process_scopes (\n  launch_id TEXT NOT NULL PRIMARY KEY\n    REFERENCES node_worker_launches(launch_id) ON DELETE CASCADE,\n  scope_kind TEXT NOT NULL CHECK (scope_kind = 'linux-subreaper'),\n  descendants_reaped INTEGER CHECK (descendants_reaped IS NULL OR descendants_reaped = 1)\n) STRICT;\n\n-- Turn receipts have a shorter lifetime than their physical worker owner.\n-- Keeping the launch running preserves capacity and predecessor cleanup semantics.\nCREATE TABLE IF NOT EXISTS node_worker_turns (\n  turn_id TEXT NOT NULL PRIMARY KEY\n    CHECK (length(turn_id) BETWEEN 1 AND 256 AND instr(turn_id, char(0)) = 0),\n  owner_launch_id TEXT NOT NULL\n    REFERENCES node_worker_launches(launch_id) ON DELETE CASCADE,\n  plan_hash TEXT NOT NULL\n    CHECK (length(plan_hash) = 64 AND plan_hash NOT GLOB '*[^0-9a-f]*'),\n  run_id TEXT NOT NULL\n    CHECK (length(run_id) BETWEEN 1 AND 256 AND instr(run_id, char(0)) = 0),\n  state TEXT NOT NULL\n    CHECK (state IN ('running', 'completed', 'failed', 'interrupted', 'cancelled')),\n  result_json TEXT CHECK (\n    result_json IS NULL\n    OR (\n      length(CAST(result_json AS BLOB)) BETWEEN 1 AND 65536\n      AND instr(result_json, char(0)) = 0\n      AND json_valid(result_json)\n    )\n  ),\n  error_text TEXT CHECK (\n    error_text IS NULL\n    OR (\n      length(CAST(error_text AS BLOB)) BETWEEN 1 AND 4096\n      AND instr(error_text, char(0)) = 0\n      AND instr(error_text, char(10)) = 0\n      AND instr(error_text, char(13)) = 0\n    )\n  ),\n  completed_at_ms INTEGER CHECK (\n    completed_at_ms IS NULL OR completed_at_ms BETWEEN 0 AND 9007199254740991\n  ),\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms BETWEEN 0 AND 9007199254740991),\n  updated_at_ms INTEGER NOT NULL CHECK (\n    updated_at_ms BETWEEN created_at_ms AND 9007199254740991\n  ),\n  CHECK (\n    (state = 'running'\n      AND result_json IS NULL AND error_text IS NULL AND completed_at_ms IS NULL)\n    OR\n    (state = 'completed'\n      AND result_json IS NOT NULL AND error_text IS NULL\n      AND completed_at_ms BETWEEN created_at_ms AND updated_at_ms)\n    OR\n    (state IN ('failed', 'interrupted', 'cancelled')\n      AND result_json IS NULL AND error_text IS NOT NULL\n      AND completed_at_ms BETWEEN created_at_ms AND updated_at_ms)\n  )\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_node_worker_turns_terminal_completed\n  ON node_worker_turns(completed_at_ms, turn_id)\n  WHERE completed_at_ms IS NOT NULL;\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_node_worker_turns_active_owner\n  ON node_worker_turns(owner_launch_id)\n  WHERE state = 'running';\n\nCREATE TABLE IF NOT EXISTS config_health_entries (\n  config_path TEXT NOT NULL PRIMARY KEY,\n  last_known_good_json TEXT,\n  last_promoted_good_json TEXT,\n  last_observed_suspicious_signature TEXT,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS clawhub_promotion_claims (\n  slug TEXT NOT NULL PRIMARY KEY,\n  provider TEXT,\n  model_keys_json TEXT NOT NULL,\n  ends_at_ms INTEGER NOT NULL,\n  claimed_at_ms INTEGER NOT NULL\n) STRICT;\n\n\n\nCREATE TABLE IF NOT EXISTS official_external_plugin_catalog_snapshots (\n  feed_url TEXT NOT NULL PRIMARY KEY,\n  body TEXT NOT NULL,\n  status INTEGER NOT NULL,\n  etag TEXT,\n  last_modified TEXT,\n  checksum TEXT NOT NULL,\n  saved_at TEXT NOT NULL,\n  trust_mode TEXT,\n  trust_key_id TEXT,\n  trust_signature_count INTEGER,\n  trust_threshold INTEGER,\n  trust_verified_at TEXT,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_official_external_plugin_catalog_snapshots_updated\n  ON official_external_plugin_catalog_snapshots(updated_at_ms DESC, feed_url);\n\nCREATE TABLE IF NOT EXISTS update_runs (\n  run_id TEXT PRIMARY KEY NOT NULL,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  trigger TEXT NOT NULL CHECK (trigger IN ('chat', 'control-ui', 'cli', 'campaign', 'mac-app', 'api')),\n  phase TEXT NOT NULL CHECK (phase IN ('requested', 'staging', 'validating', 'repairing', 'activating', 'restarting', 'verifying', 'finished')),\n  status TEXT NOT NULL CHECK (status IN ('running', 'succeeded', 'failed', 'rolled-back', 'skipped')),\n  reason TEXT,\n  origin_json TEXT NOT NULL CHECK (length(CAST(origin_json AS BLOB)) <= 16384),\n  target_json TEXT NOT NULL CHECK (length(CAST(target_json AS BLOB)) <= 16384),\n  before_json TEXT NOT NULL CHECK (length(CAST(before_json AS BLOB)) <= 16384),\n  after_json TEXT NOT NULL CHECK (length(CAST(after_json AS BLOB)) <= 16384),\n  steps_json TEXT NOT NULL CHECK (length(CAST(steps_json AS BLOB)) <= 16384),\n  verification_json TEXT NOT NULL CHECK (length(CAST(verification_json AS BLOB)) <= 16384),\n  repair_json TEXT NOT NULL CHECK (length(CAST(repair_json AS BLOB)) <= 16384),\n  confirmed_at_ms INTEGER,\n  finished_at_ms INTEGER,\n  downtime_ms INTEGER,\n  CHECK ((status = 'running' AND phase != 'finished' AND finished_at_ms IS NULL) OR\n    (status != 'running' AND phase = 'finished' AND finished_at_ms IS NOT NULL))\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_update_runs_created\n  ON update_runs(created_at_ms DESC, run_id);\nCREATE INDEX IF NOT EXISTS idx_update_runs_active\n  ON update_runs(status, created_at_ms DESC, run_id);\n\nCREATE TABLE IF NOT EXISTS gateway_restart_sentinel (\n  sentinel_key TEXT NOT NULL PRIMARY KEY,\n  version INTEGER NOT NULL,\n  kind TEXT NOT NULL,\n  status TEXT NOT NULL,\n  ts INTEGER NOT NULL,\n  session_key TEXT,\n  thread_id TEXT,\n  delivery_channel TEXT,\n  delivery_to TEXT,\n  delivery_account_id TEXT,\n  message TEXT,\n  continuation_json TEXT,\n  doctor_hint TEXT,\n  stats_json TEXT,\n  payload_json TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_gateway_restart_sentinel_ts\n  ON gateway_restart_sentinel(ts DESC, sentinel_key);\n\nCREATE TABLE IF NOT EXISTS gateway_restart_intent (\n  intent_key TEXT NOT NULL PRIMARY KEY,\n  kind TEXT NOT NULL,\n  pid INTEGER NOT NULL,\n  created_at INTEGER NOT NULL,\n  reason TEXT,\n  force INTEGER,\n  wait_ms INTEGER,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS gateway_restart_handoff (\n  handoff_key TEXT NOT NULL PRIMARY KEY,\n  kind TEXT NOT NULL,\n  version INTEGER NOT NULL,\n  intent_id TEXT NOT NULL,\n  pid INTEGER NOT NULL,\n  process_instance_id TEXT,\n  created_at INTEGER NOT NULL,\n  expires_at INTEGER NOT NULL,\n  reason TEXT,\n  restart_trace_started_at INTEGER,\n  restart_trace_last_at INTEGER,\n  source TEXT NOT NULL,\n  restart_kind TEXT NOT NULL,\n  supervisor_mode TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_gateway_restart_handoff_expiry\n  ON gateway_restart_handoff(expires_at, pid);\n\nCREATE TABLE IF NOT EXISTS gateway_boot_lifecycle (\n  boot_id TEXT NOT NULL PRIMARY KEY,\n  pid INTEGER NOT NULL,\n  started_at_ms INTEGER NOT NULL,\n  completed_at_ms INTEGER,\n  outcome TEXT,\n  startup_reason TEXT,\n  reason TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_gateway_boot_lifecycle_started\n  ON gateway_boot_lifecycle(started_at_ms);\n\nCREATE TABLE IF NOT EXISTS acp_sessions (\n  session_key TEXT NOT NULL PRIMARY KEY,\n  session_id TEXT,\n  backend TEXT NOT NULL,\n  agent TEXT NOT NULL,\n  runtime_session_name TEXT NOT NULL,\n  identity_json TEXT,\n  resume_agent_session_id TEXT,\n  resume_acpx_session_id TEXT,\n  mode TEXT NOT NULL,\n  runtime_options_json TEXT,\n  cwd TEXT,\n  state TEXT NOT NULL,\n  last_activity_at INTEGER NOT NULL,\n  last_error TEXT,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_acp_sessions_state_activity\n  ON acp_sessions(state, last_activity_at DESC, session_key);\n\nCREATE INDEX IF NOT EXISTS idx_acp_sessions_agent_activity\n  ON acp_sessions(agent, last_activity_at DESC, session_key);\n\nCREATE INDEX IF NOT EXISTS idx_acp_sessions_resume_agent\n  ON acp_sessions(resume_agent_session_id);\n\nCREATE INDEX IF NOT EXISTS idx_acp_sessions_resume_acpx\n  ON acp_sessions(resume_acpx_session_id);\n\nCREATE TABLE IF NOT EXISTS acp_replay_sessions (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  session_key TEXT NOT NULL,\n  cwd TEXT NOT NULL,\n  complete INTEGER NOT NULL,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  next_seq INTEGER NOT NULL,\n  -- Running estimate of this session's ledger footprint (row overhead plus\n  -- all event rows), maintained at insert/trim so budget checks never scan\n  -- acp_replay_events (#100622).\n  estimated_bytes INTEGER NOT NULL DEFAULT 0\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_acp_replay_sessions_key_updated\n  ON acp_replay_sessions(session_key, complete, updated_at DESC, session_id);\n\nCREATE INDEX IF NOT EXISTS idx_acp_replay_sessions_updated\n  ON acp_replay_sessions(updated_at DESC, session_id);\n\nCREATE TABLE IF NOT EXISTS acp_replay_events (\n  session_id TEXT NOT NULL,\n  seq INTEGER NOT NULL,\n  at INTEGER NOT NULL,\n  session_key TEXT NOT NULL,\n  run_id TEXT,\n  update_json TEXT NOT NULL,\n  estimated_bytes INTEGER NOT NULL DEFAULT 0,\n  PRIMARY KEY (session_id, seq),\n  FOREIGN KEY (session_id) REFERENCES acp_replay_sessions(session_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_acp_replay_events_session_seq\n  ON acp_replay_events(session_id, seq);\n\nCREATE TABLE IF NOT EXISTS agent_databases (\n  agent_id TEXT NOT NULL,\n  path TEXT NOT NULL,\n  schema_version INTEGER NOT NULL,\n  last_seen_at INTEGER NOT NULL,\n  size_bytes INTEGER,\n  PRIMARY KEY (agent_id, path)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS agent_deletion_journal (\n  agent_id TEXT PRIMARY KEY,\n  operation_id TEXT NOT NULL DEFAULT '',\n  phase TEXT,\n  agent_dir TEXT NOT NULL,\n  workspace_dir TEXT NOT NULL,\n  sessions_dir TEXT NOT NULL,\n  database_paths_json TEXT NOT NULL DEFAULT '[]',\n  cleanup_paths_json TEXT NOT NULL DEFAULT '[]',\n  created_at INTEGER NOT NULL,\n  cleanup_completed INTEGER NOT NULL DEFAULT 0,\n  delete_files INTEGER NOT NULL DEFAULT 1\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS agent_provenance (\n  agent_id TEXT PRIMARY KEY,\n  created_via TEXT NOT NULL CHECK (created_via IN ('operator', 'agent', 'claw')),\n  creator_agent_id TEXT,\n  created_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS agent_database_leases (\n  lease_id TEXT PRIMARY KEY,\n  agent_id TEXT NOT NULL,\n  path TEXT NOT NULL,\n  owner_pid INTEGER NOT NULL,\n  owner_start_time INTEGER,\n  opened_at INTEGER NOT NULL,\n  provenance TEXT\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS plugin_state_entries (\n  plugin_id TEXT NOT NULL,\n  namespace TEXT NOT NULL,\n  entry_key TEXT NOT NULL,\n  value_json TEXT NOT NULL,\n  created_at INTEGER NOT NULL,\n  expires_at INTEGER,\n  PRIMARY KEY (plugin_id, namespace, entry_key)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_plugin_state_expiry\n  ON plugin_state_entries(expires_at)\n  WHERE expires_at IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_plugin_state_listing\n  ON plugin_state_entries(plugin_id, namespace, created_at, entry_key, expires_at);\n\nCREATE TABLE IF NOT EXISTS channel_ingress_events (\n  queue_name TEXT NOT NULL,\n  event_id TEXT NOT NULL,\n  channel_id TEXT NOT NULL,\n  account_id TEXT NOT NULL,\n  status TEXT NOT NULL,\n  lane_key TEXT,\n  payload_json TEXT NOT NULL,\n  metadata_json TEXT,\n  received_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  claim_token TEXT,\n  claim_owner TEXT,\n  claimed_at INTEGER,\n  attempts INTEGER NOT NULL DEFAULT 0,\n  last_attempt_at INTEGER,\n  last_error TEXT,\n  failed_reason TEXT,\n  failed_at INTEGER,\n  completed_at INTEGER,\n  completed_metadata_json TEXT,\n  PRIMARY KEY (queue_name, event_id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_channel_ingress_pending\n  ON channel_ingress_events(queue_name, status, received_at, event_id);\n\nCREATE INDEX IF NOT EXISTS idx_channel_ingress_claims\n  ON channel_ingress_events(queue_name, status, claimed_at);\n\nCREATE INDEX IF NOT EXISTS idx_channel_ingress_lane\n  ON channel_ingress_events(queue_name, status, lane_key);\n\nCREATE TABLE IF NOT EXISTS plugin_blob_entries (\n  plugin_id TEXT NOT NULL,\n  namespace TEXT NOT NULL,\n  entry_key TEXT NOT NULL,\n  metadata_json TEXT NOT NULL,\n  blob BLOB NOT NULL,\n  created_at INTEGER NOT NULL,\n  expires_at INTEGER,\n  PRIMARY KEY (plugin_id, namespace, entry_key)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_plugin_blob_expiry\n  ON plugin_blob_entries(expires_at)\n  WHERE expires_at IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_plugin_blob_listing\n  ON plugin_blob_entries(plugin_id, namespace, created_at, entry_key);\n\nCREATE TABLE IF NOT EXISTS skill_uploads (\n  upload_id TEXT NOT NULL PRIMARY KEY,\n  kind TEXT NOT NULL,\n  slug TEXT NOT NULL,\n  force INTEGER NOT NULL,\n  size_bytes INTEGER NOT NULL,\n  sha256 TEXT,\n  actual_sha256 TEXT,\n  received_bytes INTEGER NOT NULL,\n  archive_blob BLOB NOT NULL,\n  created_at INTEGER NOT NULL,\n  expires_at INTEGER NOT NULL,\n  committed INTEGER NOT NULL,\n  committed_at INTEGER,\n  idempotency_key_hash TEXT UNIQUE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_skill_uploads_expiry\n  ON skill_uploads(expires_at);\n\nCREATE INDEX IF NOT EXISTS idx_skill_uploads_idempotency\n  ON skill_uploads(idempotency_key_hash)\n  WHERE idempotency_key_hash IS NOT NULL;\n\nCREATE TABLE IF NOT EXISTS skill_upload_chunks (\n  upload_id TEXT NOT NULL,\n  byte_offset INTEGER NOT NULL CHECK (byte_offset >= 0),\n  size_bytes INTEGER NOT NULL CHECK (size_bytes > 0),\n  chunk_blob BLOB NOT NULL,\n  PRIMARY KEY (upload_id, byte_offset),\n  FOREIGN KEY (upload_id) REFERENCES skill_uploads(upload_id) ON DELETE CASCADE,\n  CHECK (length(chunk_blob) = size_bytes)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS capture_sessions (\n  id TEXT NOT NULL PRIMARY KEY,\n  started_at INTEGER NOT NULL,\n  ended_at INTEGER,\n  mode TEXT NOT NULL,\n  source_scope TEXT NOT NULL,\n  source_process TEXT NOT NULL,\n  proxy_url TEXT\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS capture_blobs (\n  blob_id TEXT NOT NULL PRIMARY KEY,\n  content_type TEXT,\n  encoding TEXT NOT NULL,\n  size_bytes INTEGER NOT NULL,\n  sha256 TEXT NOT NULL,\n  data BLOB NOT NULL,\n  created_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS capture_events (\n  id INTEGER NOT NULL PRIMARY KEY,\n  session_id TEXT NOT NULL,\n  ts INTEGER NOT NULL,\n  source_scope TEXT NOT NULL,\n  source_process TEXT NOT NULL,\n  protocol TEXT NOT NULL,\n  direction TEXT NOT NULL,\n  kind TEXT NOT NULL,\n  flow_id TEXT NOT NULL,\n  method TEXT,\n  host TEXT,\n  path TEXT,\n  status INTEGER,\n  close_code INTEGER,\n  content_type TEXT,\n  headers_json TEXT,\n  data_text TEXT,\n  data_blob_id TEXT,\n  data_sha256 TEXT,\n  error_text TEXT,\n  meta_json TEXT,\n  FOREIGN KEY (session_id) REFERENCES capture_sessions(id) ON DELETE CASCADE,\n  FOREIGN KEY (data_blob_id) REFERENCES capture_blobs(blob_id) ON DELETE SET NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS capture_events_session_ts_idx\n  ON capture_events(session_id, ts);\n\nCREATE INDEX IF NOT EXISTS capture_events_flow_idx\n  ON capture_events(flow_id, ts);\n\nCREATE TABLE IF NOT EXISTS sandbox_registry_entries (\n  registry_kind TEXT NOT NULL,\n  container_name TEXT NOT NULL,\n  session_key TEXT,\n  backend_id TEXT,\n  runtime_label TEXT,\n  image TEXT,\n  created_at_ms INTEGER,\n  last_used_at_ms INTEGER,\n  config_label_kind TEXT,\n  config_hash TEXT,\n  cdp_port INTEGER,\n  no_vnc_port INTEGER,\n  entry_json TEXT NOT NULL,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (registry_kind, container_name)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_sandbox_registry_updated\n  ON sandbox_registry_entries(registry_kind, updated_at DESC, container_name);\n\nCREATE INDEX IF NOT EXISTS idx_sandbox_registry_session\n  ON sandbox_registry_entries(registry_kind, session_key, last_used_at_ms DESC, container_name)\n  WHERE session_key IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_sandbox_registry_last_used\n  ON sandbox_registry_entries(registry_kind, last_used_at_ms DESC, container_name)\n  WHERE last_used_at_ms IS NOT NULL;\n\nCREATE TABLE IF NOT EXISTS cron_jobs (\n  store_key TEXT NOT NULL,\n  job_id TEXT NOT NULL,\n  declaration_key TEXT,\n  owner_agent_id TEXT,\n  name TEXT NOT NULL,\n  description TEXT,\n  enabled INTEGER NOT NULL,\n  agent_id TEXT,\n  payload_kind TEXT NOT NULL,\n  job_json TEXT NOT NULL,\n  grant_definition_revision TEXT,\n  grant_definition_generation INTEGER,\n  grant_definition_updated_at INTEGER,\n  state_json TEXT NOT NULL DEFAULT '{}',\n  runtime_updated_at_ms INTEGER,\n  schedule_identity TEXT,\n  sort_order INTEGER NOT NULL DEFAULT 0,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (store_key, job_id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_cron_jobs_store_order\n  ON cron_jobs(store_key, sort_order ASC, updated_at ASC, job_id);\n\n-- One owner-native receipt is also the durable execution fence. Receipts\n-- survive job deletion so operators can distinguish a run from log inference.\nCREATE TABLE IF NOT EXISTS cron_run_receipts (\n  cursor_id INTEGER NOT NULL,\n  receipt_id TEXT PRIMARY KEY,\n  store_key TEXT NOT NULL,\n  job_id TEXT NOT NULL,\n  config_revision TEXT NOT NULL,\n  agent_id TEXT NOT NULL,\n  request_run_id TEXT,\n  delivery_attempt_state TEXT NOT NULL DEFAULT 'unknown' CHECK (delivery_attempt_state IN ('unknown', 'not-started', 'started')),\n  status TEXT NOT NULL,\n  owner_pid INTEGER NOT NULL,\n  owner_start_time INTEGER,\n  started_at_ms INTEGER NOT NULL,\n  finished_at_ms INTEGER,\n  error_text TEXT,\n  CHECK (status IN ('running', 'ok', 'error', 'skipped', 'interrupted', 'superseded')),\n  CHECK (\n    (status = 'running' AND finished_at_ms IS NULL)\n    OR\n    (status != 'running' AND finished_at_ms IS NOT NULL)\n  )\n) STRICT;\n\nCREATE UNIQUE INDEX IF NOT EXISTS cron_run_receipts_cursor_id_idx\n  ON cron_run_receipts(cursor_id);\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_cron_run_receipts_active_job\n  ON cron_run_receipts(store_key, job_id)\n  WHERE status = 'running';\n\nCREATE INDEX IF NOT EXISTS idx_cron_run_receipts_job_history\n  ON cron_run_receipts(store_key, job_id, started_at_ms DESC, receipt_id DESC);\n\n-- Retirement follows the receipt's retention without changing its released shape.\nCREATE TABLE IF NOT EXISTS cron_run_trigger_state_retirements (\n  receipt_id TEXT PRIMARY KEY\n    REFERENCES cron_run_receipts(receipt_id) ON DELETE CASCADE\n) STRICT;\n\n-- Runtime-private authority is independent of job_json so downgraded writers\n-- can rewrite recognized job config without erasing or silently widening it.\nCREATE TABLE IF NOT EXISTS cron_job_runtime_authorities (\n  store_key TEXT NOT NULL,\n  job_id TEXT NOT NULL,\n  authority_json TEXT,\n  authority_input_fingerprint TEXT,\n  recovery_required INTEGER NOT NULL,\n  PRIMARY KEY (store_key, job_id),\n  FOREIGN KEY (store_key, job_id)\n    REFERENCES cron_jobs(store_key, job_id) ON DELETE CASCADE,\n  CHECK (recovery_required IN (0, 1)),\n  CHECK (\n    (recovery_required = 0 AND authority_json IS NOT NULL AND authority_input_fingerprint IS NOT NULL)\n    OR\n    (recovery_required = 1 AND authority_json IS NULL AND authority_input_fingerprint IS NULL)\n  )\n) STRICT;\n\n-- Scratch is separate from cron_jobs so scheduler state writes and downgraded\n-- full-row replacement preserve it. New builds prune rows explicitly on job removal.\n-- content NULL is a tombstone: it keeps the revision lineage monotonic across\n-- unset/recreate so stale compare-and-swap writes cannot resurrect old content.\nCREATE TABLE IF NOT EXISTS cron_job_scratch (\n  store_key TEXT NOT NULL,\n  job_id TEXT NOT NULL,\n  content TEXT,\n  revision INTEGER NOT NULL,\n  source_sha256 TEXT,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (store_key, job_id),\n  CHECK (revision >= 1),\n  CHECK (content IS NULL OR length(CAST(content AS BLOB)) <= 262144)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_cron_job_scratch_store_updated\n  ON cron_job_scratch(store_key, updated_at_ms DESC, job_id);\n\nCREATE TABLE IF NOT EXISTS delivery_queue_entries (\n  queue_name TEXT NOT NULL,\n  id TEXT NOT NULL,\n  status TEXT NOT NULL,\n  entry_kind TEXT,\n  session_key TEXT,\n  channel TEXT,\n  target TEXT,\n  account_id TEXT,\n  retry_count INTEGER NOT NULL DEFAULT 0,\n  last_attempt_at INTEGER,\n  last_error TEXT,\n  recovery_state TEXT,\n  platform_send_started_at INTEGER,\n  entry_json TEXT NOT NULL,\n  retention_id_prefix TEXT,\n  retention_max_age_ms INTEGER,\n  retention_max_entries INTEGER,\n  enqueued_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  failed_at INTEGER,\n  PRIMARY KEY (queue_name, id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_delivery_queue_pending\n  ON delivery_queue_entries(queue_name, status, enqueued_at, id);\n\nCREATE INDEX IF NOT EXISTS idx_delivery_queue_failed\n  ON delivery_queue_entries(status, queue_name, failed_at, id);\n\nCREATE INDEX IF NOT EXISTS idx_delivery_queue_session\n  ON delivery_queue_entries(queue_name, status, session_key, enqueued_at, id)\n  WHERE session_key IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_delivery_queue_target\n  ON delivery_queue_entries(queue_name, status, channel, target, enqueued_at, id)\n  WHERE channel IS NOT NULL AND target IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_delivery_queue_bounded_retention\n  ON delivery_queue_entries(queue_name, retention_id_prefix, enqueued_at DESC, id DESC)\n  WHERE status IN ('completed', 'failed') AND recovery_state = 'completed_bounded'\n    AND retention_id_prefix IS NOT NULL;\n\nCREATE TABLE IF NOT EXISTS task_runs (\n  task_id TEXT NOT NULL PRIMARY KEY,\n  runtime TEXT NOT NULL,\n  task_kind TEXT,\n  source_id TEXT,\n  requester_session_key TEXT,\n  owner_key TEXT NOT NULL,\n  scope_kind TEXT NOT NULL,\n  child_session_key TEXT,\n  parent_flow_id TEXT,\n  parent_task_id TEXT,\n  agent_id TEXT,\n  requester_agent_id TEXT,\n  run_id TEXT,\n  execution_owner_host TEXT,\n  execution_owner_pid INTEGER,\n  execution_owner_start_identity INTEGER,\n  label TEXT,\n  task TEXT NOT NULL,\n  status TEXT NOT NULL,\n  delivery_status TEXT NOT NULL,\n  notify_policy TEXT NOT NULL,\n  created_at INTEGER NOT NULL,\n  started_at INTEGER,\n  ended_at INTEGER,\n  last_event_at INTEGER,\n  cleanup_after INTEGER,\n  tool_use_count INTEGER,\n  last_tool_name TEXT,\n  error TEXT,\n  progress_summary TEXT,\n  terminal_summary TEXT,\n  terminal_outcome TEXT,\n  detail_json TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_task_runs_run_id ON task_runs(run_id);\nCREATE INDEX IF NOT EXISTS idx_task_runs_status ON task_runs(status);\nCREATE INDEX IF NOT EXISTS idx_task_runs_runtime_status ON task_runs(runtime, status);\nCREATE INDEX IF NOT EXISTS idx_task_runs_cleanup_after ON task_runs(cleanup_after);\nCREATE INDEX IF NOT EXISTS idx_task_runs_last_event_at ON task_runs(last_event_at);\nCREATE INDEX IF NOT EXISTS idx_task_runs_owner_key ON task_runs(owner_key);\nCREATE INDEX IF NOT EXISTS idx_task_runs_parent_flow_id ON task_runs(parent_flow_id);\nCREATE INDEX IF NOT EXISTS idx_task_runs_child_session_key ON task_runs(child_session_key);\nCREATE INDEX IF NOT EXISTS idx_task_runs_requester_session_key ON task_runs(requester_session_key);\nCREATE INDEX IF NOT EXISTS idx_task_runs_runtime_source_ended\n  ON task_runs(runtime, source_id, ended_at, created_at, task_id);\nCREATE INDEX IF NOT EXISTS idx_task_runs_runtime_ended\n  ON task_runs(runtime, ended_at, created_at, task_id);\n\nCREATE TABLE IF NOT EXISTS subagent_runs (\n  run_id TEXT NOT NULL PRIMARY KEY,\n  child_session_key TEXT NOT NULL,\n  controller_session_key TEXT,\n  controller_store_path TEXT,\n  requester_session_key TEXT NOT NULL,\n  requester_store_path TEXT,\n  created_at INTEGER NOT NULL,\n  payload_json TEXT NOT NULL DEFAULT '{}'\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_subagent_runs_child_session_key\n  ON subagent_runs(child_session_key, created_at DESC, run_id);\nCREATE INDEX IF NOT EXISTS idx_subagent_runs_requester_session_key\n  ON subagent_runs(requester_session_key, created_at DESC, run_id);\nCREATE INDEX IF NOT EXISTS idx_subagent_runs_controller_session_key\n  ON subagent_runs(controller_session_key, created_at DESC, run_id);\n\nCREATE TABLE IF NOT EXISTS current_conversation_bindings (\n  binding_key TEXT NOT NULL PRIMARY KEY,\n  binding_id TEXT NOT NULL,\n  target_session_key TEXT NOT NULL,\n  channel TEXT NOT NULL,\n  account_id TEXT NOT NULL,\n  conversation_kind TEXT NOT NULL,\n  parent_conversation_id TEXT,\n  conversation_id TEXT NOT NULL,\n  target_kind TEXT NOT NULL,\n  status TEXT NOT NULL,\n  bound_at INTEGER NOT NULL,\n  expires_at INTEGER,\n  metadata_json TEXT,\n  record_json TEXT NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_current_conversation_bindings_target\n  ON current_conversation_bindings(target_session_key, updated_at DESC, binding_key);\nCREATE INDEX IF NOT EXISTS idx_current_conversation_bindings_conversation\n  ON current_conversation_bindings(channel, account_id, conversation_kind, conversation_id);\nCREATE INDEX IF NOT EXISTS idx_current_conversation_bindings_expires\n  ON current_conversation_bindings(expires_at, binding_key);\n\nCREATE TABLE IF NOT EXISTS plugin_binding_approvals (\n  plugin_root TEXT NOT NULL,\n  channel TEXT NOT NULL,\n  account_id TEXT NOT NULL,\n  plugin_id TEXT NOT NULL,\n  plugin_name TEXT,\n  approved_at INTEGER NOT NULL,\n  PRIMARY KEY (plugin_root, channel, account_id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_plugin_binding_approvals_plugin\n  ON plugin_binding_approvals(plugin_id, approved_at DESC);\n\nCREATE TABLE IF NOT EXISTS task_delivery_state (\n  task_id TEXT NOT NULL PRIMARY KEY,\n  requester_origin_json TEXT,\n  last_notified_event_at INTEGER,\n  FOREIGN KEY (task_id) REFERENCES task_runs(task_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS flow_runs (\n  flow_id TEXT NOT NULL PRIMARY KEY,\n  shape TEXT,\n  sync_mode TEXT NOT NULL DEFAULT 'managed',\n  owner_key TEXT NOT NULL,\n  requester_origin_json TEXT,\n  controller_id TEXT,\n  revision INTEGER NOT NULL DEFAULT 0,\n  status TEXT NOT NULL,\n  notify_policy TEXT NOT NULL,\n  goal TEXT NOT NULL,\n  current_step TEXT,\n  blocked_task_id TEXT,\n  blocked_summary TEXT,\n  state_json TEXT,\n  wait_json TEXT,\n  cancel_requested_at INTEGER,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  ended_at INTEGER\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_flow_runs_status ON flow_runs(status);\nCREATE INDEX IF NOT EXISTS idx_flow_runs_owner_key ON flow_runs(owner_key);\nCREATE INDEX IF NOT EXISTS idx_flow_runs_updated_at ON flow_runs(updated_at);\n\n-- Durable meeting-capture sessions are gateway-global rather than agent-session\n-- transcripts. JSON/JSONL files are doctor import inputs or explicit CLI exports.\nCREATE TABLE IF NOT EXISTS meeting_transcript_sessions (\n  session_id TEXT NOT NULL,\n  started_at TEXT NOT NULL,\n  selector TEXT NOT NULL UNIQUE,\n  export_key TEXT NOT NULL,\n  session_slug TEXT NOT NULL,\n  provider_id TEXT NOT NULL,\n  title TEXT,\n  source_json TEXT NOT NULL,\n  source_account_id TEXT,\n  source_guild_id TEXT,\n  source_channel_id TEXT,\n  source_meeting_url TEXT,\n  source_thread_ts TEXT,\n  source_file_id TEXT,\n  stopped_at TEXT,\n  metadata_json TEXT,\n  metadata_agent_id TEXT,\n  export_manifest_json TEXT NOT NULL DEFAULT '{}',\n  export_pending_json TEXT NOT NULL DEFAULT '[]',\n  next_utterance_seq INTEGER NOT NULL DEFAULT 0 CHECK (next_utterance_seq >= 0),\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),\n  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),\n  PRIMARY KEY (session_id, started_at)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_started\n  ON meeting_transcript_sessions(started_at DESC, session_id);\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_id\n  ON meeting_transcript_sessions(session_id, started_at DESC);\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_slug\n  ON meeting_transcript_sessions(session_slug, started_at DESC);\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_export_key\n  ON meeting_transcript_sessions(export_key);\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_source\n  ON meeting_transcript_sessions(provider_id, source_account_id, source_guild_id,\n    source_channel_id, source_meeting_url, source_thread_ts, source_file_id,\n    stopped_at DESC, started_at DESC, session_id);\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_account\n  ON meeting_transcript_sessions(source_account_id);\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_agent\n  ON meeting_transcript_sessions(metadata_agent_id);\n\nCREATE TABLE IF NOT EXISTS meeting_transcript_utterances (\n  session_id TEXT NOT NULL,\n  session_started_at TEXT NOT NULL,\n  sequence INTEGER NOT NULL CHECK (sequence >= 0),\n  utterance_id TEXT,\n  started_at TEXT,\n  ended_at TEXT,\n  speaker_id TEXT,\n  speaker_label TEXT,\n  text TEXT NOT NULL,\n  final INTEGER CHECK (final IN (0, 1)),\n  metadata_json TEXT,\n  PRIMARY KEY (session_id, session_started_at, sequence),\n  FOREIGN KEY (session_id, session_started_at)\n    REFERENCES meeting_transcript_sessions(session_id, started_at)\n    ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_utterances_id\n  ON meeting_transcript_utterances(session_id, session_started_at, utterance_id)\n  WHERE utterance_id IS NOT NULL;\n\nCREATE TABLE IF NOT EXISTS meeting_transcript_summaries (\n  session_id TEXT NOT NULL,\n  session_started_at TEXT NOT NULL,\n  generated_at TEXT,\n  summary_json TEXT,\n  overview TEXT,\n  markdown TEXT,\n  utterance_count INTEGER NOT NULL CHECK (utterance_count >= 0),\n  PRIMARY KEY (session_id, session_started_at),\n  FOREIGN KEY (session_id, session_started_at)\n    REFERENCES meeting_transcript_sessions(session_id, started_at)\n    ON DELETE CASCADE,\n  CHECK (summary_json IS NOT NULL OR markdown IS NOT NULL)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS migration_runs (\n  id TEXT NOT NULL PRIMARY KEY,\n  started_at INTEGER NOT NULL,\n  finished_at INTEGER,\n  status TEXT NOT NULL,\n  report_json TEXT NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_migration_runs_started\n  ON migration_runs(started_at DESC, id);\n\nCREATE TABLE IF NOT EXISTS migration_sources (\n  source_key TEXT NOT NULL PRIMARY KEY,\n  migration_kind TEXT NOT NULL,\n  source_path TEXT NOT NULL,\n  target_table TEXT NOT NULL,\n  source_sha256 TEXT,\n  source_size_bytes INTEGER,\n  source_record_count INTEGER,\n  last_run_id TEXT NOT NULL,\n  status TEXT NOT NULL,\n  imported_at INTEGER NOT NULL,\n  removed_source INTEGER NOT NULL DEFAULT 0,\n  report_json TEXT NOT NULL,\n  FOREIGN KEY (last_run_id) REFERENCES migration_runs(id) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_migration_sources_path\n  ON migration_sources(source_path, migration_kind, target_table);\n\nCREATE INDEX IF NOT EXISTS idx_migration_sources_run\n  ON migration_sources(last_run_id, source_path);\n\nCREATE TABLE IF NOT EXISTS backup_runs (\n  id TEXT NOT NULL PRIMARY KEY,\n  created_at INTEGER NOT NULL,\n  archive_path TEXT NOT NULL,\n  status TEXT NOT NULL,\n  manifest_json TEXT NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_backup_runs_created\n  ON backup_runs(created_at DESC, id);\n\nCREATE TABLE IF NOT EXISTS worktrees (\n  id TEXT NOT NULL PRIMARY KEY,\n  repo_fingerprint TEXT NOT NULL,\n  repo_root TEXT NOT NULL,\n  path TEXT NOT NULL,\n  branch TEXT NOT NULL,\n  base_ref TEXT NOT NULL,\n  owner_kind TEXT NOT NULL CHECK (owner_kind IN ('manual', 'workboard', 'session')),\n  owner_id TEXT,\n  snapshot_ref TEXT,\n  provisioned_paths_json TEXT,\n  created_at INTEGER NOT NULL,\n  last_active_at INTEGER NOT NULL,\n  removed_at INTEGER,\n  run_end_cleanup_json TEXT,\n  gc_protection_json TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_worktrees_repo_fingerprint\n  ON worktrees(repo_fingerprint);\n\nCREATE INDEX IF NOT EXISTS idx_worktrees_removed_at\n  ON worktrees(removed_at);\n\nCREATE TABLE IF NOT EXISTS worktree_provisioned_file_chunks (\n  worktree_id TEXT NOT NULL,\n  path TEXT NOT NULL,\n  chunk_index INTEGER NOT NULL CHECK (chunk_index >= 0),\n  data BLOB NOT NULL,\n  PRIMARY KEY (worktree_id, path, chunk_index)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS worktree_templates (\n  cache_key TEXT NOT NULL PRIMARY KEY,\n  id TEXT NOT NULL UNIQUE,\n  repo_root TEXT NOT NULL,\n  common_dir TEXT NOT NULL,\n  worktree_root TEXT NOT NULL,\n  path TEXT NOT NULL,\n  backend TEXT NOT NULL,\n  source_commit TEXT NOT NULL,\n  content_key TEXT NOT NULL,\n  status TEXT NOT NULL CHECK (status IN ('preparing', 'ready')),\n  created_at INTEGER NOT NULL,\n  last_used_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS projects (\n  id TEXT NOT NULL PRIMARY KEY,\n  display_name TEXT NOT NULL,\n  repo_root TEXT NOT NULL,\n  origin_url TEXT,\n  source TEXT NOT NULL CHECK (source IN ('registered', 'cloned')),\n  created_at_ms INT NOT NULL,\n  updated_at_ms INT NOT NULL\n) STRICT;\n\n-- One explicitly retained, normalized private background per durable profile.\nCREATE TABLE IF NOT EXISTS user_background_images (\n  profile_id TEXT NOT NULL PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,\n  asset_id TEXT NOT NULL UNIQUE,\n  image BLOB NOT NULL CHECK (length(image) BETWEEN 1 AND 2097152),\n  width INTEGER NOT NULL CHECK (width BETWEEN 1 AND 2560),\n  height INTEGER NOT NULL CHECK (height BETWEEN 1 AND 2560)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS user_preferences (\n  profile_id TEXT NOT NULL,\n  pref_key TEXT NOT NULL,\n  value_json TEXT NOT NULL,\n  updated_at_ms INT NOT NULL,\n  PRIMARY KEY (profile_id, pref_key)\n) STRICT;\n\n-- Gateway-owned custom session group catalog (names + display order).\n-- Membership stays on each session entry's category field; this table only\n-- owns which groups exist and how operator UIs order them.\nCREATE TABLE IF NOT EXISTS session_groups (\n  name TEXT NOT NULL PRIMARY KEY,\n  position INTEGER NOT NULL,\n  created_at INTEGER NOT NULL,\n  cwd TEXT,\n  worktree INTEGER\n) STRICT;\n\n-- Gateway-owned durable cloud worker lifecycle. Provider-specific execution\n-- stays in plugins; this table records only core reconciliation facts.\nCREATE TABLE IF NOT EXISTS worker_environments (\n  environment_id TEXT NOT NULL PRIMARY KEY,\n  provider_id TEXT NOT NULL,\n  profile_id TEXT NOT NULL,\n  profile_snapshot_json TEXT NOT NULL,\n  last_activated_at_ms INTEGER,\n  preparation_key TEXT,\n  preparation_purpose TEXT,\n  preparation_demand_at_ms INTEGER,\n  preparation_expires_at_ms INTEGER,\n  preparation_consumed_at_ms INTEGER CHECK (\n    (preparation_key IS NULL AND preparation_demand_at_ms IS NULL\n      AND preparation_expires_at_ms IS NULL AND preparation_consumed_at_ms IS NULL)\n    OR\n    (preparation_key IS NOT NULL AND length(preparation_key) = 64\n      AND preparation_key NOT GLOB '*[^0-9a-f]*'\n      AND preparation_demand_at_ms IS NOT NULL\n      AND preparation_demand_at_ms BETWEEN 0 AND 9007199254740991\n      AND preparation_expires_at_ms IS NOT NULL\n      AND preparation_expires_at_ms > preparation_demand_at_ms\n      AND preparation_expires_at_ms <= 9007199254740991\n      AND (preparation_consumed_at_ms IS NULL\n        OR (preparation_consumed_at_ms >= preparation_demand_at_ms\n          AND preparation_consumed_at_ms < preparation_expires_at_ms)))\n  ),\n  provision_operation_id TEXT NOT NULL UNIQUE,\n  lease_id TEXT,\n  node_setup_id TEXT,\n  node_device_id TEXT,\n  ssh_host TEXT,\n  ssh_port INTEGER CHECK (ssh_port IS NULL OR (ssh_port >= 1 AND ssh_port <= 65535)),\n  ssh_user TEXT,\n  ssh_host_key TEXT,\n  ssh_key_ref_json TEXT,\n  desktop_json TEXT,\n  state TEXT NOT NULL CHECK (\n    state IN (\n      'requested',\n      'provisioning',\n      'bootstrapping',\n      'ready',\n      'attached',\n      'idle',\n      'draining',\n      'destroying',\n      'destroyed',\n      'failed',\n      'orphaned'\n    )\n  ),\n  bootstrap_bundle_hash TEXT,\n  bootstrap_openclaw_version TEXT,\n  bootstrap_protocol_features_json TEXT,\n  bootstrap_install_kind TEXT,\n  owner_epoch INTEGER NOT NULL DEFAULT 0 CHECK (owner_epoch >= 0),\n  teardown_terminal_state TEXT CHECK (teardown_terminal_state IN ('destroyed', 'failed')),\n  attached_session_ids_json TEXT NOT NULL DEFAULT '[]',\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  state_changed_at_ms INTEGER NOT NULL,\n  idle_since_at_ms INTEGER,\n  destroy_requested_at_ms INTEGER,\n  last_error TEXT,\n  shared_host INTEGER\n) STRICT;\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_worker_environments_provider_lease\n  ON worker_environments(provider_id, lease_id)\n  WHERE lease_id IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_worker_environments_terminal_changed\n  ON worker_environments(state_changed_at_ms, environment_id);\n\n-- A dedicated node registers its fixed build paths before ready, then binds\n-- them once. The environment belongs to the Gateway's separate database.\nCREATE TABLE IF NOT EXISTS node_worker_prepared_workspaces (\n  preparation_key TEXT NOT NULL PRIMARY KEY CHECK (\n    length(preparation_key) = 64 AND preparation_key NOT GLOB '*[^0-9a-f]*'\n  ),\n  cache_key TEXT NOT NULL CHECK (\n    length(cache_key) = 64 AND cache_key NOT GLOB '*[^0-9a-f]*'\n  ),\n  gateway_namespace TEXT NOT NULL CHECK (length(gateway_namespace) > 0),\n  workspace_dir TEXT NOT NULL UNIQUE CHECK (length(workspace_dir) > 0),\n  home_dir TEXT NOT NULL CHECK (length(home_dir) > 0),\n  source_manifest_ref TEXT NOT NULL CHECK (\n    length(source_manifest_ref) = 71 AND substr(source_manifest_ref, 1, 7) = 'sha256:'\n      AND substr(source_manifest_ref, 8) NOT GLOB '*[^0-9a-f]*'\n  ),\n  prepared_manifest_ref TEXT NOT NULL CHECK (\n    length(prepared_manifest_ref) = 71 AND substr(prepared_manifest_ref, 1, 7) = 'sha256:'\n      AND substr(prepared_manifest_ref, 8) NOT GLOB '*[^0-9a-f]*'\n  ),\n  state TEXT NOT NULL CHECK (state IN ('available', 'bound', 'retiring', 'retired')),\n  environment_id TEXT NOT NULL CHECK (length(environment_id) > 0),\n  session_id TEXT,\n  session_key TEXT,\n  owner_epoch INTEGER CHECK (owner_epoch BETWEEN 1 AND 9007199254740991),\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms BETWEEN 0 AND 9007199254740991),\n  bound_at_ms INTEGER CHECK (bound_at_ms BETWEEN created_at_ms AND 9007199254740991),\n  retired_at_ms INTEGER CHECK (\n    retired_at_ms BETWEEN coalesce(bound_at_ms, created_at_ms) AND 9007199254740991\n  ),\n  CHECK (\n    (session_id IS NULL AND session_key IS NULL AND owner_epoch IS NULL AND bound_at_ms IS NULL)\n    OR\n    (session_id IS NOT NULL AND length(session_id) > 0\n      AND session_key IS NOT NULL AND length(session_key) > 0\n      AND owner_epoch IS NOT NULL AND bound_at_ms IS NOT NULL)\n  ),\n  CHECK (\n    (state = 'available' AND bound_at_ms IS NULL AND retired_at_ms IS NULL)\n    OR (state = 'bound' AND bound_at_ms IS NOT NULL AND retired_at_ms IS NULL)\n    OR (state = 'retiring' AND retired_at_ms IS NULL)\n    OR (state = 'retired' AND retired_at_ms IS NOT NULL)\n  )\n) STRICT;\n\n-- Provider-advertised fallback ports preserve stable retry order separately\n-- from the downgrade-sensitive canonical worker environment row.\nCREATE TABLE IF NOT EXISTS worker_environment_ssh_fallback_ports (\n  environment_id TEXT NOT NULL,\n  position INTEGER NOT NULL CHECK (position >= 0 AND position <= 9),\n  port INTEGER NOT NULL CHECK (port >= 1 AND port <= 65535),\n  PRIMARY KEY (environment_id, position),\n  UNIQUE (environment_id, port),\n  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE\n) STRICT;\n\n-- Logical sessions own repository intent and accepted artifact references,\n-- independently of the worker or rotating transcript session id.\nCREATE TABLE IF NOT EXISTS session_repository_workspaces (\n  workspace_id TEXT NOT NULL PRIMARY KEY CHECK (length(workspace_id) = 36),\n  agent_id TEXT NOT NULL CHECK (length(agent_id) BETWEEN 1 AND 128),\n  session_key TEXT NOT NULL CHECK (length(session_key) BETWEEN 1 AND 1024),\n  url TEXT NOT NULL CHECK (length(url) BETWEEN 1 AND 4096),\n  requested_ref TEXT CHECK (requested_ref IS NULL OR length(requested_ref) BETWEEN 1 AND 1024),\n  run_setup_script INTEGER NOT NULL DEFAULT 0 CHECK (run_setup_script IN (0, 1)),\n  base_commit TEXT CHECK (base_commit IS NULL OR length(base_commit) IN (40, 64)),\n  base_manifest_hash TEXT,\n  branch TEXT NOT NULL CHECK (length(branch) BETWEEN 1 AND 256),\n  checkpoint_ref TEXT,\n  manifest_hash TEXT,\n  revision INTEGER NOT NULL CHECK (revision >= 0),\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  UNIQUE (agent_id, session_key),\n  CHECK (base_manifest_hash IS NULL OR base_commit IS NOT NULL),\n  CHECK ((checkpoint_ref IS NULL AND manifest_hash IS NULL)\n    OR (checkpoint_ref IS NOT NULL AND manifest_hash IS NOT NULL AND base_manifest_hash IS NOT NULL))\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS github_repository_publication_requests (\n  request_id TEXT NOT NULL PRIMARY KEY,\n  owner_profile_id TEXT,\n  connection_generation TEXT,\n  idempotency_key TEXT NOT NULL,\n  request_digest TEXT NOT NULL,\n  session_id TEXT NOT NULL,\n  session_lifecycle_revision TEXT,\n  requester_authority_json TEXT,\n  session_key TEXT NOT NULL,\n  agent_id TEXT NOT NULL,\n  workspace_id TEXT NOT NULL,\n  checkpoint_ref TEXT,\n  checkpoint_digest TEXT,\n  claim_id TEXT,\n  run_id TEXT,\n  environment_id TEXT,\n  owner_epoch INTEGER,\n  placement_generation INTEGER,\n  identity_source TEXT NOT NULL CHECK (identity_source IN ('system-detected', 'system-configured', 'agent-override', 'personal')),\n  identity_profile_id TEXT,\n  identity_account_id INTEGER NOT NULL,\n  identity_login TEXT NOT NULL,\n  title TEXT,\n  body TEXT,\n  status TEXT NOT NULL CHECK (status IN ('requested', 'publishing', 'needs_confirmation', 'published', 'failed')),\n  gateway_instance_id TEXT,\n  execution_id TEXT,\n  last_effect TEXT CHECK (last_effect IN ('push', 'pull_request')),\n  effect_state TEXT CHECK (effect_state IN ('dispatched', 'observed')),\n  push_repository TEXT,\n  repository TEXT,\n  branch TEXT NOT NULL,\n  base_branch TEXT,\n  source_head_commit TEXT,\n  source_index_tree TEXT,\n  workspace_tree TEXT,\n  previous_head_commit TEXT,\n  pushed_head_commit TEXT,\n  head_commit TEXT,\n  pull_request_url TEXT,\n  error_code TEXT,\n  next_action TEXT,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  reported_at_ms INTEGER,\n  CHECK ((identity_source = 'personal' AND owner_profile_id IS NOT NULL AND connection_generation IS NOT NULL)\n    OR (identity_source <> 'personal' AND owner_profile_id IS NULL AND connection_generation IS NULL)),\n  CHECK ((checkpoint_ref IS NULL AND checkpoint_digest IS NULL) OR (checkpoint_ref IS NOT NULL AND checkpoint_digest IS NOT NULL)),\n  CHECK ((last_effect IS NULL AND effect_state IS NULL) OR (last_effect IS NOT NULL AND effect_state IS NOT NULL))\n) STRICT;\nCREATE UNIQUE INDEX IF NOT EXISTS idx_github_repository_publication_shared_request\n  ON github_repository_publication_requests(session_id, idempotency_key) WHERE owner_profile_id IS NULL;\nCREATE UNIQUE INDEX IF NOT EXISTS idx_github_repository_publication_personal_request\n  ON github_repository_publication_requests(owner_profile_id, session_id, idempotency_key) WHERE owner_profile_id IS NOT NULL;\n\n-- Session placement lives in the shared state database so local admission,\n-- worker admission, and environment attachment use one durable authority.\nCREATE TABLE IF NOT EXISTS worker_session_placements (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  agent_id TEXT NOT NULL,\n  session_key TEXT NOT NULL,\n  execution_mode TEXT CHECK (execution_mode IN ('worker-turn', 'remote-exec')),\n  state TEXT NOT NULL CHECK (\n    state IN (\n      'local',\n      'requested',\n      'provisioning',\n      'syncing',\n      'starting',\n      'active',\n      'draining',\n      'reconciling',\n      'reclaimed',\n      'failed'\n    )\n  ),\n  environment_id TEXT,\n  transition_generation INTEGER NOT NULL DEFAULT 0 CHECK (transition_generation >= 0),\n  active_owner_epoch INTEGER CHECK (active_owner_epoch IS NULL OR active_owner_epoch >= 1),\n  workspace_base_manifest_ref TEXT,\n  remote_workspace_dir TEXT,\n  worker_bundle_hash TEXT,\n  last_transcript_ack_cursor INTEGER CHECK (\n    last_transcript_ack_cursor IS NULL OR last_transcript_ack_cursor >= 0\n  ),\n  last_live_event_ack_cursor INTEGER CHECK (\n    last_live_event_ack_cursor IS NULL OR last_live_event_ack_cursor >= 0\n  ),\n  recovery_error TEXT,\n  turn_claim_owner TEXT CHECK (turn_claim_owner IN ('local', 'worker')),\n  turn_claim_id TEXT,\n  turn_claim_run_id TEXT,\n  turn_claim_generation INTEGER CHECK (\n    turn_claim_generation IS NULL OR turn_claim_generation >= 0\n  ),\n  turn_claim_owner_epoch INTEGER CHECK (\n    turn_claim_owner_epoch IS NULL OR turn_claim_owner_epoch >= 1\n  ),\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  state_changed_at_ms INTEGER NOT NULL,\n  terminal_reason TEXT,\n  terminal_at_ms INTEGER,\n  CHECK (\n    (state IN ('local', 'requested')\n      AND environment_id IS NULL AND active_owner_epoch IS NULL\n      AND workspace_base_manifest_ref IS NULL AND remote_workspace_dir IS NULL\n      AND worker_bundle_hash IS NULL\n      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL\n      AND recovery_error IS NULL)\n    OR\n    (state IS 'provisioning'\n      AND active_owner_epoch IS NULL\n      AND workspace_base_manifest_ref IS NULL AND remote_workspace_dir IS NULL\n      AND worker_bundle_hash IS NULL\n      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL\n      AND recovery_error IS NULL)\n    OR\n    (state IS 'syncing'\n      AND environment_id IS NOT NULL AND active_owner_epoch IS NULL\n      AND workspace_base_manifest_ref IS NULL AND remote_workspace_dir IS NULL\n      AND worker_bundle_hash IS NOT NULL\n      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL\n      AND recovery_error IS NULL)\n    OR\n    (state IS 'starting'\n      AND environment_id IS NOT NULL AND active_owner_epoch IS NULL\n      AND workspace_base_manifest_ref IS NOT NULL AND remote_workspace_dir IS NOT NULL\n      AND worker_bundle_hash IS NOT NULL\n      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL\n      AND recovery_error IS NULL)\n    OR\n    (state IN ('active', 'draining', 'reconciling')\n      AND environment_id IS NOT NULL AND active_owner_epoch IS NOT NULL\n      AND workspace_base_manifest_ref IS NOT NULL AND remote_workspace_dir IS NOT NULL\n      AND worker_bundle_hash IS NOT NULL AND recovery_error IS NULL)\n    OR\n    (state IS 'reclaimed'\n      AND environment_id IS NOT NULL AND active_owner_epoch IS NOT NULL\n      AND workspace_base_manifest_ref IS NOT NULL AND remote_workspace_dir IS NOT NULL\n      AND worker_bundle_hash IS NOT NULL AND recovery_error IS NULL\n      AND turn_claim_owner IS NULL AND turn_claim_id IS NULL AND turn_claim_run_id IS NULL\n      AND turn_claim_generation IS NULL AND turn_claim_owner_epoch IS NULL)\n    OR\n    (state IS 'failed' AND recovery_error IS NOT NULL)\n  ),\n  CHECK (\n    (turn_claim_owner IS NULL AND turn_claim_id IS NULL AND turn_claim_run_id IS NULL\n      AND turn_claim_generation IS NULL AND turn_claim_owner_epoch IS NULL)\n    OR\n    (turn_claim_owner IS 'local' AND turn_claim_id IS NOT NULL\n      AND turn_claim_run_id IS NOT NULL AND turn_claim_generation IS NOT NULL\n      AND turn_claim_owner_epoch IS NULL)\n    OR\n    (turn_claim_owner IS 'worker' AND turn_claim_id IS NOT NULL\n      AND turn_claim_run_id IS NOT NULL AND turn_claim_generation IS NOT NULL\n      AND turn_claim_owner_epoch IS NOT NULL)\n  ),\n  CHECK (\n    turn_claim_owner IS NULL\n    OR\n    (turn_claim_owner IS 'local' AND (\n      state IN ('local', 'requested', 'failed')\n      OR (state IN ('active', 'draining') AND execution_mode IS 'remote-exec')\n    ))\n    OR\n    (turn_claim_owner IS 'worker' AND state IN ('active', 'draining')\n      AND (execution_mode IS NULL OR execution_mode IS 'worker-turn')\n      AND turn_claim_owner_epoch IS active_owner_epoch)\n  )\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_worker_session_placements_session_key\n  ON worker_session_placements(agent_id, session_key);\n\nCREATE INDEX IF NOT EXISTS idx_worker_session_placements_reconcile\n  ON worker_session_placements(updated_at_ms, session_id);\n\nCREATE INDEX IF NOT EXISTS idx_worker_session_placements_environment\n  ON worker_session_placements(environment_id)\n  WHERE environment_id IS NOT NULL;\n\n-- Planned placement moves retain their exact source CAS and bounded target\n-- without widening the stable placement-state vocabulary. The opaque operation\n-- id fences stale asynchronous completion; it is correlation, never authority.\nCREATE TABLE IF NOT EXISTS worker_session_placement_moves (\n  operation_id TEXT NOT NULL PRIMARY KEY,\n  session_id TEXT NOT NULL UNIQUE\n    REFERENCES worker_session_placements(session_id) ON DELETE CASCADE,\n  source_generation INTEGER NOT NULL CHECK (source_generation >= 0),\n  source_environment_id TEXT NOT NULL CHECK (\n    length(source_environment_id) BETWEEN 1 AND 256\n    AND source_environment_id = trim(source_environment_id)\n  ),\n  source_owner_epoch INTEGER NOT NULL CHECK (source_owner_epoch >= 1),\n  target_kind TEXT NOT NULL CHECK (target_kind IN ('gateway', 'profile', 'device')),\n  target_id TEXT,\n  -- Keep these nullable columns constraint-free so lazy ALTER TABLE produces the\n  -- same shape as fresh databases; placement-move code validates their values.\n  target_machine_class TEXT,\n  target_os TEXT,\n  -- Explicit source abandonment is a durable operator decision. Keep the bit\n  -- bare and nullable so same-version older readers can safely omit it.\n  abandon_source INTEGER,\n  last_error TEXT,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  CHECK (\n    (target_kind IS 'gateway' AND target_id IS NULL)\n    OR\n    (target_kind IN ('profile', 'device')\n      AND target_id IS NOT NULL\n      AND length(target_id) BETWEEN 1 AND 256\n      AND target_id = trim(target_id))\n  )\n) STRICT;\n\n-- Worker-visible session RPC authority is persisted against the exact turn\n-- claim. The launch descriptor is informative only; Gateway dispatch always\n-- revalidates this record and the live placement claim before executing.\nCREATE TABLE IF NOT EXISTS worker_turn_tool_authorities (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  environment_id TEXT NOT NULL,\n  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 1),\n  placement_generation INTEGER NOT NULL CHECK (placement_generation >= 0),\n  claim_id TEXT NOT NULL,\n  run_id TEXT NOT NULL,\n  tool_names_json TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  FOREIGN KEY (session_id) REFERENCES worker_session_placements(session_id) ON DELETE CASCADE\n) STRICT;\n\n-- Tool-call ids are idempotency keys only within one exact source turn claim.\n-- A running operation from another Gateway instance is ambiguous and is never\n-- replayed. A persisted random seed separates durable downstream identities\n-- from Gateway authentication keys and survives ordinary process restarts.\nCREATE TABLE IF NOT EXISTS worker_session_tool_operations (\n  source_session_id TEXT NOT NULL,\n  source_claim_id TEXT NOT NULL,\n  tool_call_id TEXT NOT NULL,\n  tool_name TEXT NOT NULL CHECK (tool_name IN ('sessions_spawn', 'sessions_send')),\n  request_digest TEXT NOT NULL,\n  operation_seed TEXT NOT NULL,\n  status TEXT NOT NULL CHECK (status IN ('running', 'succeeded', 'failed', 'unknown')),\n  child_session_key TEXT,\n  result_json TEXT,\n  gateway_instance_id TEXT NOT NULL,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (source_session_id, source_claim_id, tool_call_id),\n  FOREIGN KEY (source_session_id)\n    REFERENCES worker_session_placements(session_id) ON DELETE CASCADE\n) STRICT;\n\n-- Local sandbox execution is a projection of a session-owned managed worktree.\n-- No cascade: an older binary must not discard pending edits with a session row.\nCREATE TABLE IF NOT EXISTS local_workspace_projections (\n  worktree_id TEXT NOT NULL PRIMARY KEY,\n  agent_id TEXT NOT NULL,\n  session_key TEXT NOT NULL,\n  session_id TEXT NOT NULL,\n  lifecycle_revision TEXT,\n  projection_path TEXT NOT NULL UNIQUE,\n  base_commit TEXT NOT NULL,\n  source_paths_json TEXT NOT NULL,\n  baseline_json TEXT,\n  baseline_ref TEXT,\n  pending_ref TEXT,\n  pending_target TEXT CHECK (pending_target IN ('canonical', 'projection')),\n  paused_runtimes_json TEXT,\n  journal_json TEXT,\n  journal_pack BLOB CHECK (journal_pack IS NULL OR length(journal_pack) <= 268435456),\n  revision INTEGER NOT NULL DEFAULT 0 CHECK (revision >= 0),\n  created_at_ms INTEGER NOT NULL,\n  CHECK ((baseline_json IS NULL) = (baseline_ref IS NULL)),\n  CHECK ((journal_json IS NULL) = (journal_pack IS NULL))\n) STRICT;\n\n-- A reconciliation journal is written before managed-worktree mutation. The\n-- bounded Git base snapshot repairs any subset left by an interrupted apply.\nCREATE TABLE IF NOT EXISTS worker_workspace_reconciliations (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  environment_id TEXT NOT NULL,\n  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 1),\n  placement_generation INTEGER NOT NULL CHECK (placement_generation >= 0),\n  base_manifest_ref TEXT NOT NULL,\n  current_manifest_ref TEXT NOT NULL,\n  plan_json TEXT NOT NULL,\n  base_pack BLOB NOT NULL CHECK (length(base_pack) <= 268435456),\n  created_at_ms INTEGER NOT NULL,\n  FOREIGN KEY (session_id) REFERENCES worker_session_placements(session_id) ON DELETE CASCADE\n) STRICT;\n\n-- A completed remote turn is fenced from stale-claim teardown until its\n-- workspace result is durably reconciled into the managed worktree.\nCREATE TABLE IF NOT EXISTS worker_workspace_pending_results (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  environment_id TEXT NOT NULL,\n  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 1),\n  placement_generation INTEGER NOT NULL CHECK (placement_generation >= 0),\n  claim_id TEXT NOT NULL,\n  run_id TEXT NOT NULL,\n  gateway_instance_id TEXT NOT NULL,\n  recovery_requested_at_ms INTEGER,\n  workspace_accepted_at_ms INTEGER,\n  staged_result_ref TEXT,\n  repository_workspace_id TEXT,\n  created_at_ms INTEGER NOT NULL,\n  FOREIGN KEY (session_id) REFERENCES worker_session_placements(session_id) ON DELETE CASCADE\n) STRICT;\n\n-- GitHub publication intent records the authoritative session worktree. Cloud\n-- requests execute only after the exact turn claim's result is accepted locally.\n-- Secrets stay in the effective Gateway-owned GitHub profile and never enter\n-- this row or the worker protocol.\nCREATE TABLE IF NOT EXISTS github_publication_requests (\n  request_id TEXT NOT NULL PRIMARY KEY,\n  idempotency_key TEXT NOT NULL,\n  request_digest TEXT NOT NULL,\n  session_id TEXT NOT NULL,\n  session_key TEXT NOT NULL,\n  agent_id TEXT NOT NULL,\n  worktree_id TEXT NOT NULL,\n  repository_fingerprint TEXT NOT NULL,\n  claim_id TEXT,\n  run_id TEXT,\n  environment_id TEXT,\n  owner_epoch INTEGER CHECK (owner_epoch IS NULL OR owner_epoch >= 1),\n  placement_generation INTEGER CHECK (\n    placement_generation IS NULL OR placement_generation >= 0\n  ),\n  identity_source TEXT NOT NULL CHECK (\n    identity_source IN ('system-detected', 'system-configured', 'agent-override')\n  ),\n  identity_profile_id TEXT,\n  identity_account_id INTEGER NOT NULL CHECK (identity_account_id >= 1),\n  identity_login TEXT NOT NULL,\n  title TEXT,\n  body TEXT,\n  status TEXT NOT NULL CHECK (\n    status IN ('requested', 'publishing', 'published', 'failed')\n  ),\n  gateway_instance_id TEXT,\n  repository TEXT,\n  branch TEXT NOT NULL,\n  base_branch TEXT,\n  source_head_commit TEXT,\n  source_index_tree TEXT,\n  workspace_tree TEXT,\n  head_commit TEXT,\n  pull_request_url TEXT,\n  error_code TEXT,\n  next_action TEXT,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  reported_at_ms INTEGER,\n  UNIQUE (session_id, idempotency_key),\n  CHECK (\n    (claim_id IS NULL AND run_id IS NULL AND environment_id IS NULL\n      AND owner_epoch IS NULL AND placement_generation IS NULL)\n    OR\n    (claim_id IS NOT NULL AND run_id IS NOT NULL AND placement_generation IS NOT NULL\n      AND ((environment_id IS NULL AND owner_epoch IS NULL)\n        OR (environment_id IS NOT NULL AND owner_epoch IS NOT NULL)))\n  ),\n  CHECK (\n    (identity_source IS 'system-detected' AND identity_profile_id IS NULL)\n    OR\n    (identity_source IN ('system-configured', 'agent-override')\n      AND identity_profile_id IS NOT NULL)\n  ),\n  CHECK (\n    (source_head_commit IS NULL AND source_index_tree IS NULL AND workspace_tree IS NULL)\n    OR\n    (source_head_commit IS NOT NULL AND workspace_tree IS NOT NULL)\n  ),\n  CHECK (\n    (status IS 'published' AND pull_request_url IS NOT NULL AND error_code IS NULL\n      AND next_action IS NULL)\n    OR\n    (status IS 'failed' AND pull_request_url IS NULL AND error_code IS NOT NULL\n      AND next_action IS NOT NULL)\n    OR\n    (status IN ('requested', 'publishing') AND pull_request_url IS NULL\n      AND error_code IS NULL AND next_action IS NULL)\n  )\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_github_publication_requests_pending\n  ON github_publication_requests(status, updated_at_ms, request_id);\n\n-- Personal requests cannot be interpreted or resumed by older shared publishers.\nCREATE TABLE IF NOT EXISTS github_personal_publication_requests (\n  request_id TEXT NOT NULL PRIMARY KEY CHECK (length(request_id) = 36),\n  owner_profile_id TEXT NOT NULL CHECK (length(owner_profile_id) BETWEEN 1 AND 128),\n  connection_generation TEXT NOT NULL CHECK (length(connection_generation) = 36),\n  idempotency_key TEXT NOT NULL CHECK (length(idempotency_key) BETWEEN 1 AND 128),\n  request_digest TEXT NOT NULL CHECK (length(request_digest) = 64),\n  session_id TEXT NOT NULL CHECK (length(session_id) BETWEEN 1 AND 128),\n  session_key TEXT NOT NULL CHECK (length(session_key) BETWEEN 1 AND 1024),\n  agent_id TEXT NOT NULL CHECK (length(agent_id) BETWEEN 1 AND 128),\n  worktree_id TEXT NOT NULL CHECK (length(worktree_id) BETWEEN 1 AND 128),\n  repository_fingerprint TEXT NOT NULL CHECK (length(repository_fingerprint) BETWEEN 1 AND 256),\n  identity_source TEXT NOT NULL CHECK (identity_source = 'personal'),\n  identity_profile_id TEXT NOT NULL CHECK (length(identity_profile_id) = 36),\n  identity_account_id INTEGER NOT NULL CHECK (identity_account_id >= 1),\n  identity_login TEXT NOT NULL CHECK (length(identity_login) BETWEEN 1 AND 39),\n  title TEXT CHECK (title IS NULL OR length(title) BETWEEN 1 AND 256),\n  body TEXT CHECK (body IS NULL OR length(body) BETWEEN 1 AND 8192),\n  status TEXT NOT NULL CHECK (status IN ('requested', 'publishing', 'needs_confirmation', 'published', 'failed')),\n  gateway_instance_id TEXT CHECK (gateway_instance_id IS NULL OR length(gateway_instance_id) BETWEEN 1 AND 128),\n  execution_id TEXT CHECK (execution_id IS NULL OR length(execution_id) = 36),\n  last_effect TEXT CHECK (last_effect IS NULL OR last_effect IN ('push', 'pull_request')),\n  effect_state TEXT CHECK (effect_state IS NULL OR effect_state IN ('dispatched', 'observed')),\n  push_repository TEXT NOT NULL CHECK (length(push_repository) BETWEEN 3 AND 256),\n  repository TEXT NOT NULL CHECK (length(repository) BETWEEN 3 AND 256),\n  branch TEXT NOT NULL CHECK (length(branch) BETWEEN 1 AND 256),\n  base_branch TEXT NOT NULL CHECK (length(base_branch) BETWEEN 1 AND 256),\n  source_head_commit TEXT NOT NULL CHECK (length(source_head_commit) IN (40, 64)),\n  source_index_tree TEXT NOT NULL CHECK (length(source_index_tree) IN (40, 64)),\n  workspace_tree TEXT NOT NULL CHECK (length(workspace_tree) IN (40, 64)),\n  head_commit TEXT CHECK (head_commit IS NULL OR length(head_commit) IN (40, 64)),\n  pull_request_url TEXT CHECK (pull_request_url IS NULL OR length(pull_request_url) BETWEEN 1 AND 2048),\n  error_code TEXT CHECK (error_code IS NULL OR length(error_code) BETWEEN 1 AND 64),\n  next_action TEXT CHECK (next_action IS NULL OR length(next_action) BETWEEN 1 AND 1024),\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),\n  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= created_at_ms),\n  reported_at_ms INTEGER,\n  UNIQUE (owner_profile_id, session_id, idempotency_key),\n  CHECK ((status = 'publishing' AND gateway_instance_id IS NOT NULL AND execution_id IS NOT NULL) OR status <> 'publishing'),\n  CHECK ((last_effect IS NULL AND effect_state IS NULL) OR (last_effect IS NOT NULL AND effect_state IS NOT NULL)),\n  CHECK ((status = 'published' AND pull_request_url IS NOT NULL AND head_commit IS NOT NULL AND error_code IS NULL AND next_action IS NULL)\n    OR (status = 'failed' AND error_code IS NOT NULL AND next_action IS NOT NULL)\n    OR (status IN ('requested', 'publishing', 'needs_confirmation') AND error_code IS NULL AND next_action IS NULL))\n) STRICT;\nCREATE INDEX IF NOT EXISTS idx_github_personal_publication_owner_session\n  ON github_personal_publication_requests(owner_profile_id, session_id, created_at_ms);\nCREATE INDEX IF NOT EXISTS idx_github_personal_publication_pending\n  ON github_personal_publication_requests(status, updated_at_ms, request_id);\n\n-- Older readers validate both local receipt tables exactly. Their immutable\n-- lifecycle binding stays in a first-use companion so those schemas remain readable.\nCREATE TABLE IF NOT EXISTS github_publication_session_lifecycles (\n  publication_kind TEXT NOT NULL CHECK (publication_kind IN ('shared', 'personal')),\n  request_id TEXT NOT NULL,\n  lifecycle_revision TEXT,\n  requester_authority_json TEXT,\n  PRIMARY KEY (publication_kind, request_id)\n) STRICT;\n\n-- One active, opaque admission credential per worker environment. Plaintext\n-- may be retried until delivery acknowledgement but never enters durable state.\nCREATE TABLE IF NOT EXISTS worker_environment_credentials (\n  environment_id TEXT NOT NULL PRIMARY KEY,\n  credential_hash TEXT NOT NULL UNIQUE,\n  bundle_hash TEXT NOT NULL,\n  session_id TEXT,\n  rpc_set_version INTEGER NOT NULL CHECK (rpc_set_version >= 1),\n  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 0),\n  expires_at_ms INTEGER NOT NULL CHECK (expires_at_ms >= 0),\n  delivered_at_ms INTEGER CHECK (delivered_at_ms >= 0),\n  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE\n) STRICT;\n\n-- One durable sequence cursor per attached session owner epoch. The environment\n-- binding prevents independent workers with coincident epochs from sharing replay state.\nCREATE TABLE IF NOT EXISTS worker_transcript_commit_heads (\n  session_id TEXT NOT NULL,\n  run_epoch INTEGER NOT NULL CHECK (run_epoch >= 0),\n  environment_id TEXT NOT NULL,\n  next_seq INTEGER NOT NULL CHECK (next_seq >= 1),\n  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),\n  PRIMARY KEY (session_id, run_epoch)\n) STRICT;\n\n-- Pending rows preserve a claimed request across gateway restarts. Terminal rows\n-- cache the exact result returned for deterministic at-least-once replay.\nCREATE TABLE IF NOT EXISTS worker_transcript_commits (\n  session_id TEXT NOT NULL,\n  run_epoch INTEGER NOT NULL CHECK (run_epoch >= 0),\n  seq INTEGER NOT NULL CHECK (seq >= 1),\n  request_hash TEXT NOT NULL,\n  state TEXT NOT NULL CHECK (state IN ('pending', 'terminal')),\n  result_json TEXT,\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),\n  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),\n  PRIMARY KEY (session_id, run_epoch, seq),\n  FOREIGN KEY (session_id, run_epoch)\n    REFERENCES worker_transcript_commit_heads(session_id, run_epoch)\n    ON DELETE CASCADE,\n  CHECK (\n    (state = 'pending' AND result_json IS NULL) OR\n    (state = 'terminal' AND result_json IS NOT NULL)\n  )\n) STRICT;\n\n-- Pending rows preserve a claimed inference turn across gateway restarts.\n-- Terminal rows cache the exact outcome returned for deterministic replay.\nCREATE TABLE IF NOT EXISTS worker_inference_turns (\n  session_id TEXT NOT NULL,\n  run_epoch INTEGER NOT NULL CHECK (run_epoch >= 0),\n  run_id TEXT NOT NULL,\n  turn_id TEXT NOT NULL,\n  environment_id TEXT NOT NULL,\n  request_hash TEXT NOT NULL,\n  state TEXT NOT NULL CHECK (state IN ('pending', 'terminal')),\n  terminal_json TEXT,\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),\n  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),\n  PRIMARY KEY (session_id, run_epoch, run_id, turn_id),\n  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE,\n  CHECK (\n    (state = 'pending' AND terminal_json IS NULL) OR\n    (state = 'terminal' AND terminal_json IS NOT NULL)\n  )\n) STRICT;\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_worker_inference_turns_pending_run\n  ON worker_inference_turns(session_id, run_epoch, run_id)\n  WHERE state = 'pending';\n\nCREATE TABLE IF NOT EXISTS claw_installs (\n  agent_id TEXT NOT NULL PRIMARY KEY,\n  schema_version TEXT NOT NULL,\n  source_kind TEXT NOT NULL,\n  claw_name TEXT NOT NULL,\n  claw_version TEXT NOT NULL,\n  package_root TEXT NOT NULL,\n  manifest_path TEXT NOT NULL,\n  integrity_kind TEXT NOT NULL,\n  integrity TEXT NOT NULL,\n  source_byte_length INTEGER NOT NULL,\n  manifest_schema_version INTEGER NOT NULL,\n  plan_integrity TEXT NOT NULL,\n  workspace TEXT NOT NULL UNIQUE,\n  agent_config_digest TEXT NOT NULL,\n  agent_owned_paths_json TEXT NOT NULL,\n  bootstrap_source_path TEXT,\n  bootstrap_content_digest TEXT,\n  status TEXT NOT NULL CHECK (\n    status IN ('pending', 'workspace_ready', 'config_committed', 'complete', 'partial')\n  ),\n  added_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS claw_workspace_files (\n  agent_id TEXT NOT NULL,\n  target_path TEXT NOT NULL,\n  schema_version TEXT NOT NULL,\n  workspace TEXT NOT NULL,\n  source_path TEXT NOT NULL,\n  content_digest TEXT NOT NULL,\n  status TEXT NOT NULL,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (agent_id, target_path)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS claw_package_refs (\n  agent_id TEXT NOT NULL,\n  package_kind TEXT NOT NULL,\n  package_source TEXT NOT NULL,\n  package_ref TEXT NOT NULL,\n  package_version TEXT NOT NULL,\n  package_integrity TEXT NOT NULL,\n  schema_version TEXT NOT NULL,\n  claw_name TEXT NOT NULL,\n  package_status TEXT NOT NULL,\n  relationship TEXT NOT NULL CHECK (relationship IN ('managed', 'referenced')),\n  origin TEXT NOT NULL CHECK (origin IN ('claw-introduced', 'pre-existing')),\n  independent_owner INTEGER NOT NULL CHECK (independent_owner IN (0, 1)),\n  extension_id TEXT,\n  extension_format TEXT,\n  extension_detected_format TEXT,\n  extension_mapped_json TEXT,\n  extension_unavailable_json TEXT,\n  extension_adapter_identity TEXT,\n  installed_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (agent_id, package_kind, package_source, package_ref, package_version)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS claw_cron_refs (\n  agent_id TEXT NOT NULL,\n  manifest_id TEXT NOT NULL,\n  schema_version TEXT NOT NULL,\n  declaration_key TEXT NOT NULL UNIQUE,\n  scheduler_job_id TEXT UNIQUE,\n  status TEXT NOT NULL,\n  job_json TEXT NOT NULL,\n  error TEXT,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (agent_id, manifest_id)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS claw_mcp_server_refs (\n  agent_id TEXT NOT NULL,\n  name TEXT NOT NULL,\n  schema_version TEXT NOT NULL,\n  config_digest TEXT NOT NULL,\n  relationship TEXT NOT NULL CHECK (relationship IN ('managed', 'referenced')),\n  origin TEXT NOT NULL CHECK (origin IN ('claw-introduced', 'pre-existing')),\n  independent_owner INTEGER NOT NULL DEFAULT 0 CHECK (independent_owner IN (0, 1)),\n  status TEXT NOT NULL,\n  error TEXT,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (agent_id, name)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS user_profile_identities (\n  provider TEXT NOT NULL,\n  subject TEXT NOT NULL,\n  profile_id TEXT NOT NULL,\n  canonical_login TEXT,\n  created_at INTEGER NOT NULL,\n  authorization_id TEXT,\n  authorization_basis_json TEXT,\n  PRIMARY KEY (provider, subject)\n) STRICT;\nCREATE INDEX IF NOT EXISTS idx_user_profile_identities_profile_id\n  ON user_profile_identities(profile_id);\nCREATE UNIQUE INDEX IF NOT EXISTS idx_user_profile_identities_authorization\n  ON user_profile_identities(authorization_id);\n\nCREATE TABLE IF NOT EXISTS outbound_media_provenance (\n  realpath TEXT NOT NULL PRIMARY KEY,\n  kind TEXT NOT NULL,\n  version INTEGER NOT NULL,\n  sha256 TEXT NOT NULL,\n  size_bytes INTEGER NOT NULL,\n  created_at_ms INTEGER NOT NULL\n) STRICT;\n\n-- scope_id is non-null because SQLite treats NULLs as distinct in unique indexes/PKs,\n-- which would allow duplicate team rows. This PK also avoids a rebuild for identity scope.\nCREATE TABLE IF NOT EXISTS secret_store_entries (\n  scope_kind TEXT NOT NULL CHECK (scope_kind IN ('team', 'identity')),\n  scope_id TEXT NOT NULL,\n  name TEXT NOT NULL,\n  value TEXT NOT NULL,\n  kind TEXT NOT NULL CHECK (kind IN ('secret', 'env')),\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),\n  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),\n  updated_by TEXT,\n  deleted_at_ms INTEGER,\n  allowed_hosts TEXT,\n  CHECK ((scope_kind = 'team' AND scope_id = '') OR (scope_kind = 'identity' AND length(scope_id) > 0)),\n  PRIMARY KEY (scope_kind, scope_id, name)\n) STRICT;\nCREATE INDEX IF NOT EXISTS secret_store_entries_live_idx\n  ON secret_store_entries (scope_kind, scope_id, name) WHERE deleted_at_ms IS NULL;\n", {
		...STATE_RUNTIME_SCHEMA_COMPATIBILITY,
		allowedMissingColumns: [...STATE_RUNTIME_SCHEMA_COMPATIBILITY.allowedMissingColumns ?? [], ...pending.flatMap((migration) => migration.columns)],
		allowedMissingIndexes: [...STATE_RUNTIME_SCHEMA_COMPATIBILITY.allowedMissingIndexes ?? [], ...indexes.map((index) => index.name)],
		excludedIndexes: [
			...STATE_RUNTIME_SCHEMA_COMPATIBILITY.excludedIndexes ?? [],
			"idx_acp_sessions_resume_agent",
			"idx_acp_sessions_resume_acpx"
		]
	}).length > 0)) return;
	const changes = [];
	for (const migration of pending) {
		migration.migrate(db, previousVersion);
		changes.push(migration.applied);
	}
	for (const index of indexes) if (tableExists(db, index.tableName)) {
		const create = index.unique ? "CREATE UNIQUE INDEX" : "CREATE INDEX";
		db.exec(`${create} IF NOT EXISTS ${index.name} ${index.definition};`);
	}
	return changes;
}
function runStateSchemaMigrationTransaction(db, pathname, migrate, transactionOptions, prepareSchema) {
	const foreignKeysWereEnabled = Number(db.prepare("PRAGMA foreign_keys").get()?.foreign_keys) === 1;
	if (foreignKeysWereEnabled) db.exec("PRAGMA foreign_keys = OFF;");
	try {
		return runSqliteImmediateTransactionSync(db, () => {
			prepareSchema?.();
			const publishedVersion = readSqliteUserVersion(db);
			const blocker = publishedVersion < 22 ? readStateSchemaPublicationBlocker(db) : void 0;
			if (!blocker) return migrate();
			try {
				if (!tableExists(db, "config_machine_state")) throw new Error("Shared state schema publication requires config_machine_state.");
				return migrate();
			} catch (cause) {
				if (cause instanceof OpenClawStateOwnershipError) throw cause;
				throw new UpdateSchemaRefusalError([{
					kind: "state",
					path: pathname,
					foundVersion: publishedVersion,
					supportedVersion: 22
				}], blocker.updaterVersion, {
					targetVersion: VERSION,
					cause
				});
			}
		}, transactionOptions);
	} finally {
		if (foreignKeysWereEnabled && db.isOpen) db.exec("PRAGMA foreign_keys = ON;");
	}
}
function writeCurrentStateSchemaMetadata(db, now) {
	const kysely = getNodeSqliteKysely(db);
	const schemaVersion = resolveStateSchemaVersionToPublish(db);
	db.exec(`PRAGMA user_version = ${schemaVersion};`);
	publishStateSchemaVersionAdmission(db, {
		userVersion: schemaVersion,
		contentVersion: 22
	});
	executeSqliteQuerySync(db, kysely.insertInto("schema_meta").values({
		meta_key: "primary",
		role: "global",
		schema_version: schemaVersion,
		agent_id: null,
		app_version: VERSION,
		created_at: now,
		updated_at: now
	}).onConflict((conflict) => conflict.column("meta_key").doUpdateSet({
		role: "global",
		schema_version: schemaVersion,
		agent_id: null,
		app_version: VERSION,
		updated_at: now
	}).where((eb) => eb.or([
		eb("schema_meta.schema_version", "!=", schemaVersion),
		eb("schema_meta.app_version", "is not", VERSION),
		eb("schema_meta.role", "!=", "global")
	]))));
}
function executeCanonicalStateSchema(database, options) {
	database.exec(getOpenClawStateRuntimeSchema({
		...options,
		includeAgentDeletionJournal: options.includeAgentDeletionJournal ?? tableExists(database, "agent_deletion_journal")
	}));
}
//#endregion
//#region src/state/openclaw-state-db-audit-migration.ts
const AUDIT_EVENT_STATE_SCHEMA_VERSION = 2;
const CANONICAL_AUDIT_TABLES = ["audit_events", "audit_identity_keys"].map((name) => ({
	name,
	sql: normalizeSchemaSql(extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, name))
}));
const AUDIT_EVENT_LEGACY_COLUMNS = [
	"sequence",
	"event_id",
	"source_id",
	"source_sequence",
	"occurred_at",
	"kind",
	"action",
	"status",
	"error_code",
	"actor_type",
	"actor_id",
	"agent_id",
	"session_key",
	"session_id",
	"run_id",
	"tool_call_id",
	"tool_name"
];
const AUDIT_EVENT_V2_COLUMNS = [
	...AUDIT_EVENT_LEGACY_COLUMNS.flatMap((column) => column === "source_id" ? [column, "schema_version"] : [column]),
	"direction",
	"channel",
	"conversation_kind",
	"message_outcome",
	"reason_code",
	"delivery_kind",
	"failure_stage",
	"duration_ms",
	"result_count",
	"account_ref",
	"conversation_ref",
	"message_ref",
	"target_ref"
];
function tableColumnInfo(db, tableName) {
	return db.prepare(`PRAGMA table_info(${tableName})`).all();
}
function tableHasExactColumns(db, tableName, expected) {
	const names = tableColumnInfo(db, tableName).map((column) => column.name);
	return names.length === expected.length && names.every((name, index) => name === expected[index]);
}
function tableHasRequiredColumns(db, tableName, required) {
	const columns = new Map(tableColumnInfo(db, tableName).map((column) => [column.name, column]));
	return required.every((name) => Number(columns.get(name)?.notnull ?? 0) === 1);
}
function tableSql(db, tableName) {
	const row = db.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName);
	return typeof row?.sql === "string" ? row.sql : void 0;
}
function tableHasUniqueColumn(db, tableName, columnName) {
	return db.prepare(`PRAGMA index_list(${tableName})`).all().some((index) => {
		if (Number(index.unique ?? 0) !== 1 || typeof index.name !== "string") return false;
		const escaped = index.name.replaceAll("'", "''");
		const columns = db.prepare(`PRAGMA index_info('${escaped}')`).all();
		return columns.length === 1 && columns[0]?.name === columnName;
	});
}
function hasCanonicalAuditEventTable(db, expectedColumns, requiredColumns) {
	const sql = tableSql(db, "audit_events")?.toLowerCase();
	return tableHasExactColumns(db, "audit_events", expectedColumns) && tablePrimaryKeyColumns(db, "audit_events").join(",") === "sequence" && tableHasRequiredColumns(db, "audit_events", requiredColumns) && typeof sql === "string" && /\bsequence\s+integer\s+primary\s+key\s+autoincrement\b/.test(sql) && tableHasUniqueColumn(db, "audit_events", "event_id") && tableHasUniqueColumn(db, "audit_events", "source_id");
}
function hasCanonicalAuditIdentityKeyTable(db) {
	if (!tableExists(db, "audit_identity_keys")) return false;
	const sql = tableSql(db, "audit_identity_keys")?.toLowerCase();
	return tableHasExactColumns(db, "audit_identity_keys", [
		"id",
		"key_id",
		"key",
		"created_at"
	]) && tablePrimaryKeyColumns(db, "audit_identity_keys").join(",") === "id" && tableHasRequiredColumns(db, "audit_identity_keys", [
		"id",
		"key_id",
		"key",
		"created_at"
	]) && typeof sql === "string" && /\bcheck\s*\(\s*id\s*=\s*1\s*\)/.test(sql);
}
function hasCanonicalAuditEventsSchema(db) {
	const schema = getAdmittedSqliteSchemaFacts(db);
	if (schema && CANONICAL_AUDIT_TABLES.every(({ name, sql }) => normalizeSchemaSql(schema.tableSql.get(name) ?? null) === sql)) return true;
	if (!tableExists(db, "audit_events")) return readSqliteUserVersion(db) < AUDIT_EVENT_STATE_SCHEMA_VERSION && !tableExists(db, "audit_identity_keys");
	return hasCanonicalAuditEventTable(db, AUDIT_EVENT_V2_COLUMNS, [
		"event_id",
		"source_id",
		"schema_version",
		"source_sequence",
		"occurred_at",
		"kind",
		"action",
		"status",
		"actor_type",
		"actor_id"
	]) && hasCanonicalAuditIdentityKeyTable(db);
}
function canRepairLegacyAuditEventsSchema(db) {
	if (!tableExists(db, "audit_events") || tableExists(db, "audit_events_migration_new") || tableHasColumn(db, "audit_events", "schema_version")) return false;
	return (!tableExists(db, "audit_identity_keys") || hasCanonicalAuditIdentityKeyTable(db)) && hasCanonicalAuditEventTable(db, AUDIT_EVENT_LEGACY_COLUMNS, [
		"event_id",
		"source_id",
		"source_sequence",
		"occurred_at",
		"kind",
		"action",
		"status",
		"actor_type",
		"actor_id",
		"agent_id",
		"run_id"
	]);
}
//#endregion
//#region src/state/openclaw-state-db-schema-v12-foldin.ts
const FOLDED_SINGLETON_STATE_TABLES_V12 = [
	"skill_curator_state",
	"update_check_state",
	"clawhub_promotions_feed_state",
	"model_catalog_remote",
	"voicewake_triggers",
	"voicewake_routing_routes",
	"voicewake_routing_config",
	"onboarding_recommendations",
	"cron_store_epochs",
	"tui_last_sessions",
	"sidebar_sections",
	"node_host_config",
	"web_push_vapid_keys"
];
/** Preserve the table's original catalog SQL for fresh creation and historical migration. */
function createStateConfigMachineTable(db) {
	db.exec(`
    CREATE TABLE IF NOT EXISTS config_machine_state (
      state_key TEXT NOT NULL PRIMARY KEY,
      value_json TEXT NOT NULL,
      updated_at_ms INTEGER NOT NULL
    ) STRICT;
  `);
}
function migrateSingletonStateFoldInV12(db, previousVersion) {
	if (previousVersion >= 12) return false;
	createStateConfigMachineTable(db);
	const importState = db.prepare("INSERT INTO config_machine_state (state_key, value_json, updated_at_ms) VALUES (?, ?, ?) ON CONFLICT(state_key) DO NOTHING");
	if (tableExists(db, "update_check_state")) {
		const row = db.prepare("SELECT * FROM update_check_state WHERE state_key = 'default'").get();
		if (row) importState.run("update.checkState", JSON.stringify({
			lastCheckedAt: row.last_checked_at ?? void 0,
			lastNotifiedVersion: row.last_notified_version ?? void 0,
			lastNotifiedTag: row.last_notified_tag ?? void 0,
			lastAvailableVersion: row.last_available_version ?? void 0,
			lastAvailableTag: row.last_available_tag ?? void 0,
			autoInstallId: row.auto_install_id ?? void 0,
			autoFirstSeenVersion: row.auto_first_seen_version ?? void 0,
			autoFirstSeenTag: row.auto_first_seen_tag ?? void 0,
			autoFirstSeenAt: row.auto_first_seen_at ?? void 0,
			autoLastAttemptVersion: row.auto_last_attempt_version ?? void 0,
			autoLastAttemptAt: row.auto_last_attempt_at ?? void 0,
			autoLastSuccessVersion: row.auto_last_success_version ?? void 0,
			autoLastSuccessAt: row.auto_last_success_at ?? void 0
		}), Number(row.updated_at_ms));
	}
	if (tableExists(db, "voicewake_triggers")) {
		const rows = db.prepare("SELECT trigger, updated_at_ms FROM voicewake_triggers WHERE config_key = 'default' ORDER BY position").all();
		if (rows.length > 0) importState.run("voicewake.triggers", JSON.stringify(rows.map((row) => row.trigger)), Math.max(...rows.map((row) => Number(row.updated_at_ms))));
	}
	if (tableExists(db, "voicewake_routing_config")) {
		const config = db.prepare("SELECT * FROM voicewake_routing_config WHERE config_key = 'default'").get();
		if (config) {
			const routes = tableExists(db, "voicewake_routing_routes") ? db.prepare("SELECT trigger, target_mode, target_agent_id, target_session_key FROM voicewake_routing_routes WHERE config_key = 'default' ORDER BY position").all() : [];
			const targetFromColumns = (mode, agentId, sessionKey) => mode === "agent" && typeof agentId === "string" && agentId ? { agentId } : mode === "session" && typeof sessionKey === "string" && sessionKey ? { sessionKey } : { mode: "current" };
			importState.run("voicewake.routing", JSON.stringify({
				version: 1,
				defaultTarget: targetFromColumns(config.default_target_mode, config.default_target_agent_id, config.default_target_session_key),
				routes: routes.map((route) => ({
					trigger: route.trigger,
					target: targetFromColumns(route.target_mode, route.target_agent_id, route.target_session_key)
				})),
				updatedAtMs: config.updated_at_ms
			}), Number(config.updated_at_ms));
		}
	}
	if (tableExists(db, "onboarding_recommendations")) {
		const rows = db.prepare("SELECT * FROM onboarding_recommendations").all();
		for (const row of rows) importState.run(`onboarding.recommendations.${String(row.config_key)}`, JSON.stringify({
			inventoryHash: row.inventory_hash,
			matches: JSON.parse(String(row.matches_json)),
			offeredAt: row.offered_at_ms,
			acceptedAt: row.accepted_at_ms,
			updatedAt: row.updated_at_ms
		}), Number(row.updated_at_ms));
	}
	if (tableExists(db, "sidebar_sections")) {
		const sections = db.prepare("SELECT section_id FROM sidebar_sections ORDER BY position, section_id").all();
		if (sections.length > 0) importState.run("sidebar.sectionOrder", JSON.stringify(sections.map((section) => section.section_id)), Date.now());
	}
	if (tableExists(db, "node_host_config")) {
		const nodeHost = db.prepare("SELECT * FROM node_host_config WHERE config_key = 'current'").get();
		if (nodeHost) {
			const gateway = {
				host: nodeHost.gateway_host ?? void 0,
				port: nodeHost.gateway_port ?? void 0,
				tls: nodeHost.gateway_tls == null ? void 0 : nodeHost.gateway_tls === 1,
				tlsFingerprint: nodeHost.gateway_tls_fingerprint ?? void 0,
				contextPath: nodeHost.gateway_context_path ?? void 0,
				cloudflareAccess: nodeHost.gateway_cloudflare_access_json == null ? void 0 : JSON.parse(String(nodeHost.gateway_cloudflare_access_json))
			};
			importState.run("nodeHost.config", JSON.stringify({
				version: nodeHost.version,
				nodeId: nodeHost.node_id,
				...nodeHost.display_name == null ? {} : { displayName: nodeHost.display_name },
				gateway: Object.values(gateway).some((value) => value !== void 0) ? gateway : void 0,
				installedAppsSharing: nodeHost.installed_apps_sharing === 1
			}), Number(nodeHost.updated_at_ms));
		}
	}
	if (tableExists(db, "web_push_vapid_keys")) {
		const vapidKeys = db.prepare("SELECT * FROM web_push_vapid_keys WHERE key_id = 'default'").get();
		if (vapidKeys) importState.run("webPush.vapidKeys", JSON.stringify({
			publicKey: vapidKeys.public_key,
			privateKey: vapidKeys.private_key,
			subject: vapidKeys.subject
		}), Number(vapidKeys.updated_at_ms));
	}
	let dropped = false;
	for (const tableName of FOLDED_SINGLETON_STATE_TABLES_V12) if (tableExists(db, tableName)) {
		db.exec(`DROP TABLE IF EXISTS ${tableName};`);
		dropped = true;
	}
	return dropped;
}
//#endregion
//#region src/state/session-watch-cursor-provenance.ts
const SESSION_WATCH_PROVENANCE_EXPLICIT = "explicit";
const SESSION_WATCH_PROVENANCE_AMBIENT_GROUP = "ambient-group";
//#endregion
//#region src/state/openclaw-state-db-session-watch-migration.ts
const LEGACY_AMBIENT_GROUP_WATCH_MARKER_PREFIX = "ambient-group-watch:";
const LEGACY_AMBIENT_GROUP_WATCH_MARKER_END = "ambient-group-watch;";
const SESSION_WATCH_PROVENANCE_COLUMN_SQL = `provenance TEXT NOT NULL DEFAULT '${SESSION_WATCH_PROVENANCE_EXPLICIT}' CHECK (provenance IN ('${SESSION_WATCH_PROVENANCE_EXPLICIT}', '${SESSION_WATCH_PROVENANCE_AMBIENT_GROUP}'))`;
function getSessionWatchCursorKysely(db) {
	return getNodeSqliteKysely(db);
}
function decodeLegacyAmbientWatchMarkerKey(markerKey) {
	const encoded = markerKey.slice(20);
	if (!encoded || encoded.length % 2 !== 0 || !/^[0-9a-f]+$/.test(encoded)) return;
	try {
		return new TextDecoder("utf-8", {
			fatal: true,
			ignoreBOM: true
		}).decode(Buffer.from(encoded, "hex"));
	} catch {
		return;
	}
}
function migrateSessionWatchCursorProvenance(db) {
	if (!tableExists(db, "session_watch_cursors")) return {
		addedColumn: false,
		migratedAmbientWatches: 0,
		removedLegacySentinels: 0
	};
	const addedColumn = ensureColumn(db, "session_watch_cursors", SESSION_WATCH_PROVENANCE_COLUMN_SQL);
	const kysely = getSessionWatchCursorKysely(db);
	const legacyMarkers = executeSqliteQuerySync(db, kysely.selectFrom("session_watch_cursors").select([
		"watcher_session_key",
		"target_session_key",
		"updated_at"
	]).where("watcher_session_key", ">=", LEGACY_AMBIENT_GROUP_WATCH_MARKER_PREFIX).where("watcher_session_key", "<", LEGACY_AMBIENT_GROUP_WATCH_MARKER_END)).rows;
	let migratedAmbientWatches = 0;
	for (const marker of legacyMarkers) {
		const watcherSessionKey = decodeLegacyAmbientWatchMarkerKey(marker.watcher_session_key);
		if (watcherSessionKey) {
			const watch = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("session_watch_cursors").select("updated_at").where("watcher_session_key", "=", watcherSessionKey).where("target_session_key", "=", marker.target_session_key));
			if (watch) {
				const promoted = executeSqliteQuerySync(db, kysely.updateTable("session_watch_cursors").set({
					provenance: SESSION_WATCH_PROVENANCE_AMBIENT_GROUP,
					updated_at: Math.max(watch.updated_at, marker.updated_at)
				}).where("watcher_session_key", "=", watcherSessionKey).where("target_session_key", "=", marker.target_session_key));
				migratedAmbientWatches += Number(promoted.numAffectedRows ?? 0n);
			}
		}
		executeSqliteQuerySync(db, kysely.deleteFrom("session_watch_cursors").where("watcher_session_key", "=", marker.watcher_session_key).where("target_session_key", "=", marker.target_session_key));
	}
	return {
		addedColumn,
		migratedAmbientWatches,
		removedLegacySentinels: legacyMarkers.length
	};
}
//#endregion
//#region src/state/openclaw-state-db-table-retirements.ts
const stateDbLog$3 = createSubsystemLogger("state/db");
const logRetiredStateTableMigration = (message) => stateDbLog$3.info(message);
const RETIRED_DEAD_STATE_TABLES_V10 = [
	"agent_model_catalogs",
	"android_notification_recent_packages",
	"command_log_entries",
	"diagnostic_stability_bundles",
	"media_blobs",
	"model_capability_cache"
];
const RETIRED_COMMITMENTS_COLUMNS_SQL = `
  id TEXT NOT NULL PRIMARY KEY,
  agent_id TEXT NOT NULL,
  session_key TEXT NOT NULL,
  channel TEXT NOT NULL,
  account_id TEXT,
  recipient_id TEXT,
  thread_id TEXT,
  sender_id TEXT,
  kind TEXT NOT NULL,
  sensitivity TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL,
  reason TEXT NOT NULL,
  suggested_text TEXT NOT NULL,
  dedupe_key TEXT NOT NULL,
  confidence REAL NOT NULL,
  due_earliest_ms INTEGER NOT NULL,
  due_latest_ms INTEGER NOT NULL,
  due_timezone TEXT NOT NULL,
  source_message_id TEXT,
  source_run_id TEXT,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  attempts INTEGER NOT NULL,
  last_attempt_at_ms INTEGER,
  sent_at_ms INTEGER,
  dismissed_at_ms INTEGER,
  snoozed_until_ms INTEGER,
  expired_at_ms INTEGER,
  record_json TEXT NOT NULL
`;
const RETIRED_COMMITMENTS_BASE_INDEXES_SQL = `CREATE INDEX idx_commitments_scope_due
  ON commitments(agent_id, session_key, status, due_earliest_ms, due_latest_ms);
CREATE INDEX idx_commitments_status_due
  ON commitments(status, due_earliest_ms, due_latest_ms);
CREATE INDEX idx_commitments_scope_dedupe
  ON commitments(agent_id, session_key, channel, dedupe_key, status);`;
const RETIRED_COMMITMENTS_SCHEMA_SQL = `
CREATE TABLE commitments (${RETIRED_COMMITMENTS_COLUMNS_SQL.slice(1, -1)}
) STRICT;
${RETIRED_COMMITMENTS_BASE_INDEXES_SQL}
CREATE INDEX idx_commitments_agent_due
  ON commitments(agent_id, status, due_earliest_ms, due_latest_ms, session_key);
CREATE INDEX idx_commitments_agent_sent
  ON commitments(agent_id, status, sent_at_ms, session_key);
`;
const SHIPPED_RETIRED_COMMITMENTS_SCHEMA_SQL = `
CREATE TABLE commitments (${RETIRED_COMMITMENTS_COLUMNS_SQL.slice(1, -1)}
);
${RETIRED_COMMITMENTS_BASE_INDEXES_SQL}
`;
const RETIRED_COMMITMENTS_ADDITIVE_COLUMNS = [
	"commitments.account_id",
	"commitments.recipient_id",
	"commitments.thread_id",
	"commitments.sender_id",
	"commitments.kind",
	"commitments.sensitivity",
	"commitments.source",
	"commitments.reason",
	"commitments.suggested_text",
	"commitments.dedupe_key",
	"commitments.confidence",
	"commitments.due_timezone",
	"commitments.source_message_id",
	"commitments.source_run_id",
	"commitments.created_at_ms",
	"commitments.attempts",
	"commitments.last_attempt_at_ms",
	"commitments.sent_at_ms",
	"commitments.dismissed_at_ms",
	"commitments.snoozed_until_ms",
	"commitments.expired_at_ms"
];
function deriveRetiredCommitmentsContract() {
	const indexFingerprints = new Map(getCanonicalSqliteNamedIndexContracts(RETIRED_COMMITMENTS_SCHEMA_SQL).map(({ fingerprint, name }) => [name, JSON.stringify(fingerprint)]));
	return {
		indexFingerprints,
		compatibility: {
			allowedColumnDefinitions: {
				"commitments.attempts": ["attempts INTEGER NOT NULL DEFAULT 0"],
				"commitments.confidence": ["confidence REAL NOT NULL DEFAULT 0"],
				"commitments.created_at_ms": ["created_at_ms INTEGER NOT NULL DEFAULT 0"],
				"commitments.dedupe_key": ["dedupe_key TEXT NOT NULL DEFAULT ''"],
				"commitments.due_timezone": ["due_timezone TEXT NOT NULL DEFAULT 'UTC'"],
				"commitments.kind": ["kind TEXT NOT NULL DEFAULT 'followup'"],
				"commitments.reason": ["reason TEXT NOT NULL DEFAULT ''"],
				"commitments.sensitivity": ["sensitivity TEXT NOT NULL DEFAULT 'normal'"],
				"commitments.source": ["source TEXT NOT NULL DEFAULT 'unknown'"],
				"commitments.suggested_text": ["suggested_text TEXT NOT NULL DEFAULT ''"]
			},
			allowedMissingColumns: RETIRED_COMMITMENTS_ADDITIVE_COLUMNS,
			allowedMissingIndexes: [...indexFingerprints.keys()]
		}
	};
}
function hasSupportedRetiredCommitmentsSchema(db, schemaSql, { compatibility, indexFingerprints }) {
	if (collectSqliteSchemaIssues(db, schemaSql, compatibility).length > 0) return false;
	return db.prepare(`SELECT type, name
           FROM sqlite_schema
          WHERE type IN ('index', 'trigger')
            AND tbl_name = 'commitments'
            AND sql IS NOT NULL
          ORDER BY type, name`).all().every((object) => object.type === "index" && JSON.stringify(collectSqliteNamedIndexContract(db, object.name)) === indexFingerprints.get(object.name));
}
function assertRecognizedRetiredCommitmentsSchema(db) {
	if (hasRecognizedRetiredCommitmentsSchema(db)) return;
	assertSqliteSchemaContains(db, "retired OpenClaw commitments schema", RETIRED_COMMITMENTS_SCHEMA_SQL, deriveRetiredCommitmentsContract().compatibility);
	throw new Error("Retired OpenClaw commitments schema has unsupported additional indexes; refusing destructive migration.");
}
function hasRecognizedRetiredCommitmentsSchema(db) {
	const contract = deriveRetiredCommitmentsContract();
	return hasSupportedRetiredCommitmentsSchema(db, RETIRED_COMMITMENTS_SCHEMA_SQL, contract) || hasSupportedRetiredCommitmentsSchema(db, SHIPPED_RETIRED_COMMITMENTS_SCHEMA_SQL, contract);
}
function assertNoRetiredCommitmentsForeignKeys(db) {
	const tables = db.prepare(`SELECT name
         FROM sqlite_schema
        WHERE type = 'table' AND name <> 'commitments'
        ORDER BY name`).all();
	for (const table of tables) if (db.prepare(`PRAGMA foreign_key_list(${quoteSqliteIdentifier(table.name)})`).all().some((foreignKey) => typeof foreignKey.table === "string" && foreignKey.table.toLowerCase() === "commitments")) throw new Error(`Retired OpenClaw commitments schema is referenced by table ${table.name}; refusing destructive migration.`);
}
function collectRetainedSchemaSql(db) {
	return new Map(db.prepare(`SELECT type, name, sql
             FROM sqlite_schema
            WHERE type IN ('trigger', 'view')
              AND tbl_name <> 'commitments'
              AND sql IS NOT NULL
            ORDER BY type, name`).all().map((object) => [`${object.type}:${object.name}`, object.sql]));
}
function assertNoRetiredCommitmentsSchemaDependencies(db) {
	const probeTable = "__openclaw_retired_commitments_probe";
	if (tableExists(db, probeTable)) throw new Error(`OpenClaw state database already contains ${probeTable}; refusing destructive migration.`);
	const before = collectRetainedSchemaSql(db);
	const savepoint = "openclaw_probe_commitments_dependencies";
	db.exec(`SAVEPOINT ${savepoint};`);
	let changedObject;
	try {
		db.exec(`ALTER TABLE commitments RENAME TO ${quoteSqliteIdentifier(probeTable)};`);
		const after = collectRetainedSchemaSql(db);
		changedObject = [...before].find(([object, sql]) => after.get(object) !== sql)?.[0];
	} catch (error) {
		db.exec(`ROLLBACK TO ${savepoint}; RELEASE ${savepoint};`);
		throw new Error("Could not prove retained SQLite views and triggers independent of commitments; refusing destructive migration.", { cause: error });
	}
	db.exec(`ROLLBACK TO ${savepoint}; RELEASE ${savepoint};`);
	if (changedObject) {
		const [type, name] = changedObject.split(":", 2);
		throw new Error(`Retired OpenClaw commitments schema is referenced by ${type} ${name}; refusing destructive migration.`);
	}
}
function assertVirtualTablesUsable(db, phase) {
	const virtualTables = db.prepare(`SELECT name
         FROM sqlite_schema
        WHERE type = 'table' AND lower(sql) LIKE 'create virtual table%'
        ORDER BY name`).all();
	for (const table of virtualTables) try {
		db.prepare(`SELECT * FROM ${quoteSqliteIdentifier(table.name)} LIMIT 1`).all();
	} catch (error) {
		throw new Error(`SQLite virtual table ${table.name} is unusable ${phase} commitments retirement.`, { cause: error });
	}
}
function migrateRetiredCommitmentsSchema(db, previousVersion) {
	if (previousVersion >= 7) return false;
	if (!tableExists(db, "commitments")) return false;
	assertRecognizedRetiredCommitmentsSchema(db);
	assertNoRetiredCommitmentsForeignKeys(db);
	assertNoRetiredCommitmentsSchemaDependencies(db);
	assertVirtualTablesUsable(db, "before");
	const savepoint = "openclaw_retire_commitments_v7";
	db.exec(`SAVEPOINT ${savepoint};`);
	try {
		db.exec("DROP TABLE commitments;");
		assertVirtualTablesUsable(db, "after");
		db.exec(`RELEASE ${savepoint};`);
		return true;
	} catch (error) {
		db.exec(`ROLLBACK TO ${savepoint}; RELEASE ${savepoint};`);
		throw error;
	}
}
function migrateRetiredDeadStateTablesV10(db, previousVersion) {
	if (previousVersion >= 10) return false;
	let dropped = false;
	for (const tableName of RETIRED_DEAD_STATE_TABLES_V10) if (tableExists(db, tableName)) {
		db.exec(`DROP TABLE IF EXISTS ${tableName};`);
		dropped = true;
	}
	return dropped;
}
const RETIRED_SKILL_CURATOR_TABLES_V11 = ["skill_lifecycle", "skill_workshop_proposal_origin_runs"];
function migrateRetiredSkillCuratorTablesV11(db, previousVersion) {
	if (previousVersion >= 11) return false;
	const retiredTables = RETIRED_SKILL_CURATOR_TABLES_V11.filter((table) => tableExists(db, table));
	if (retiredTables.length === 0) return false;
	if (retiredTables.includes("skill_lifecycle")) {
		const archivedCount = Number(db.prepare("SELECT COUNT(*) AS archived_count FROM skill_lifecycle WHERE state = 'archived'").get()?.archived_count);
		if (archivedCount > 0) stateDbLog$3.info(`${archivedCount} previously archived workshop skills are live again; archive any you no longer want`);
	}
	for (const table of retiredTables) db.exec(`DROP TABLE IF EXISTS ${table};`);
	return true;
}
/**
* Runs every retired-table migration in schema order and names what it changed.
* Both the repair path and the ordinary open path go through here so the order
* and the operator-visible labels cannot drift apart.
*/
function runRetiredStateTableMigrations(db, previousVersion) {
	const applied = [];
	if (migrateRetiredCommitmentsSchema(db, previousVersion)) applied.push("Discarded retired shared-state commitments rows, table, and indexes");
	if (migrateRetiredDeadStateTablesV10(db, previousVersion)) applied.push("Retired six dead shared-state tables (v10)");
	if (migrateRetiredSkillCuratorTablesV11(db, previousVersion)) applied.push("Retired legacy skill curator lifecycle and proposal origin-run tables");
	return applied;
}
[...FOLDED_SINGLETON_STATE_TABLES_V12], [...STATE_CURSOR_TABLES_V22], OPENCLAW_STATE_SCHEMA_SQL.split("\n").flatMap((line) => {
	const table = /^CREATE TABLE IF NOT EXISTS (\w+) \(/u.exec(line)?.[1];
	return table ? [table] : [];
});
function dropLegacyStateTables(db) {
	const transientHistoryTable = ["database", "verifications"].join("_");
	db.exec(`DROP TABLE IF EXISTS ${transientHistoryTable};`);
	db.exec("DROP TABLE IF EXISTS node_pairing_pending; DROP TABLE IF EXISTS node_pairing_paired;");
}
function migrateWorkerPlacementExecutionModeSchema(db, previousVersion) {
	if (previousVersion >= 8 || !tableExists(db, "worker_session_placements")) return false;
	for (const definition of [
		"execution_mode TEXT",
		"terminal_reason TEXT",
		"terminal_at_ms INTEGER"
	]) ensureColumn(db, "worker_session_placements", definition);
	const placementSchema = extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, "worker_session_placements", { errorMessage: "Canonical worker placement schema block is missing" });
	const canonical = openNodeSqliteDatabase(":memory:");
	let canonicalColumns;
	try {
		canonical.exec(placementSchema);
		canonicalColumns = canonical.prepare("PRAGMA table_xinfo(worker_session_placements)").all().filter((column) => column.hidden === 0).map((column) => column.name);
	} finally {
		canonical.close();
	}
	const currentColumns = db.prepare("PRAGMA table_xinfo(worker_session_placements)").all().filter((column) => column.hidden === 0).map((column) => column.name);
	const expected = new Set(canonicalColumns);
	if (currentColumns.length !== canonicalColumns.length || currentColumns.some((column) => !expected.has(column))) throw new Error("OpenClaw v7 worker placement columns are not canonical");
	if (db.prepare(`SELECT type, name
         FROM sqlite_schema
        WHERE tbl_name = 'worker_session_placements'
          AND type IN ('index', 'trigger')
          AND sql IS NOT NULL
          AND name NOT IN (
            'idx_worker_session_placements_session_key',
            'idx_worker_session_placements_reconcile',
            'idx_worker_session_placements_environment'
          )`).all().length > 0) throw new Error("OpenClaw v7 worker placement schema has unsupported attached objects");
	const migrationTable = "worker_session_placements_migration_v8";
	if (tableExists(db, migrationTable)) throw new Error(`OpenClaw worker placement migration table already exists: ${migrationTable}`);
	const migrationSchema = placementSchema.replace("CREATE TABLE IF NOT EXISTS worker_session_placements", `CREATE TABLE ${migrationTable}`);
	const columns = canonicalColumns.map(quoteSqliteIdentifier).join(", ");
	db.exec(migrationSchema);
	db.exec(`INSERT INTO ${migrationTable} (${columns}) SELECT ${columns} FROM worker_session_placements;`);
	db.exec("DROP TABLE worker_session_placements;");
	db.exec(`ALTER TABLE ${migrationTable} RENAME TO worker_session_placements;`);
	return true;
}
function isDefaultAgentDatabasePath(pathname, agentId) {
	const agentDir = path.dirname(pathname);
	const agentIdDir = path.dirname(agentDir);
	return path.basename(pathname) === "openclaw-agent.sqlite" && path.basename(agentDir) === "agent" && path.basename(agentIdDir) === agentId && path.basename(path.dirname(agentIdDir)) === "agents";
}
function migrateAgentDatabaseRelativePaths(db, previousVersion, databasePath) {
	if (previousVersion >= 9 || !tableExists(db, "agent_databases")) return {
		relativized: 0,
		reanchored: [],
		deleted: [],
		preserved: 0
	};
	const rows = db.prepare("SELECT agent_id, path FROM agent_databases").all();
	const updatePath = db.prepare("UPDATE agent_databases SET path = ? WHERE agent_id = ? AND path = ?");
	const deletePath = db.prepare("DELETE FROM agent_databases WHERE agent_id = ? AND path = ?");
	const hasPath = db.prepare("SELECT 1 FROM agent_databases WHERE agent_id = ? AND path = ? LIMIT 1");
	const retainNewerFacts = db.prepare(`
    UPDATE agent_databases AS canonical
       SET schema_version = source.schema_version,
           last_seen_at = source.last_seen_at,
           size_bytes = source.size_bytes
      FROM agent_databases AS source
     WHERE canonical.agent_id = ? AND canonical.path = ?
       AND source.agent_id = canonical.agent_id AND source.path = ?
       AND source.last_seen_at > canonical.last_seen_at
  `);
	let relativized = 0;
	const reanchored = [];
	const deleted = [];
	for (const row of rows) {
		const agentId = row.agent_id;
		const registeredPath = row.path;
		if (typeof agentId !== "string" || typeof registeredPath !== "string") throw new Error("OpenClaw v8 agent database registry paths are not canonical");
		if (!path.isAbsolute(registeredPath)) continue;
		const storedPath = resolveOpenClawAgentDatabaseStoredPath(databasePath, registeredPath);
		if (!path.isAbsolute(storedPath)) {
			if (hasPath.get(agentId, storedPath)) {
				retainNewerFacts.run(agentId, storedPath, registeredPath);
				deletePath.run(agentId, registeredPath);
				deleted.push(registeredPath);
			} else {
				updatePath.run(storedPath, agentId, registeredPath);
				relativized += 1;
			}
		}
	}
	const stateDir = resolveOpenClawStateDirForDatabasePath(databasePath);
	for (const row of rows) {
		const agentId = row.agent_id;
		const registeredPath = row.path;
		if (typeof agentId !== "string" || typeof registeredPath !== "string" || !path.isAbsolute(registeredPath) || !path.isAbsolute(resolveOpenClawAgentDatabaseStoredPath(databasePath, registeredPath))) continue;
		if (isDefaultAgentDatabasePath(path.resolve(registeredPath), agentId)) {
			const counterpartAbsolute = path.join(stateDir, "agents", agentId, "agent", "openclaw-agent.sqlite");
			const counterpartStored = resolveOpenClawAgentDatabaseStoredPath(databasePath, counterpartAbsolute);
			if (hasPath.get(agentId, counterpartStored)) {
				deletePath.run(agentId, registeredPath);
				deleted.push(registeredPath);
			} else if (existsSync(counterpartAbsolute)) {
				updatePath.run(counterpartStored, agentId, registeredPath);
				reanchored.push(registeredPath);
			}
		}
	}
	return {
		relativized,
		reanchored,
		deleted,
		preserved: rows.length - relativized - reanchored.length - deleted.length
	};
}
function assertCanonicalAgentDatabasesPrimaryKey(db, pathname) {
	if (!tableExists(db, "agent_databases")) return;
	const primaryKey = tablePrimaryKeyColumns(db, "agent_databases");
	if (primaryKey.length !== 2 || primaryKey[0] !== "agent_id" || primaryKey[1] !== "path") throw new SqliteSchemaMismatchError(`OpenClaw state database ${pathname} has an unsupported agent database registry schema. Upgrades from pre-July-2026 state are no longer migrated; restore a backup produced by a July 2026 or newer release before retrying.`);
}
function repairLegacyGatewayRestartHandoffsForStrictMigration(db) {
	if (!tableExists(db, "gateway_restart_handoff")) return;
	db.prepare("DELETE FROM gateway_restart_handoff WHERE expires_at <= ?").run(Date.now());
	db.exec(`
    UPDATE gateway_restart_handoff
    SET
      restart_trace_started_at = CASE
        WHEN typeof(restart_trace_started_at) = 'real'
          THEN CAST(restart_trace_started_at AS INTEGER)
        ELSE restart_trace_started_at
      END,
      restart_trace_last_at = CASE
        WHEN typeof(restart_trace_last_at) = 'real'
          THEN CAST(restart_trace_last_at AS INTEGER)
        ELSE restart_trace_last_at
      END
    WHERE typeof(restart_trace_started_at) = 'real'
       OR typeof(restart_trace_last_at) = 'real';
  `);
}
function assertCanonicalStateSchemaShape(db, pathname) {
	assertCanonicalOperatorApprovalKinds(db, pathname);
	assertCanonicalAgentDatabasesPrimaryKey(db, pathname);
	if (!hasCanonicalAuditEventsSchema(db)) {
		if (canRepairLegacyAuditEventsSchema(db)) throw new OpenClawStateDatabaseSchemaMigrationRequiredError("audit-events-v2", pathname);
		throw new SqliteSchemaMismatchError(`OpenClaw state database ${pathname} has a noncanonical audit event schema that cannot be repaired automatically; restore the canonical audit_events shape before retrying.`);
	}
}
//#endregion
//#region src/state/openclaw-state-db-fast-path.ts
function assertCurrentStateRuntimeSchema(database, pathname, readTable = createSqliteTableContractReader(database)) {
	assertCanonicalStateSchemaShape(database, pathname);
	assertOpenClawStateDatabaseForMaintenance(database, { pathname }, readTable);
	assertSqliteSchemaContains(database, pathname, OPENCLAW_STATE_SCHEMA_SQL, STATE_RUNTIME_SCHEMA_COMPATIBILITY, readTable);
}
/** Catalog presence is enough to refuse retired history without reading or rewriting its rows. */
function assertNoLegacyStateRuntimeRepair(database, pathname) {
	if (hasLegacyCronRunLogs(database)) throw new OpenClawStateDatabaseSchemaMigrationRequiredError("legacy-cron-run-logs", pathname);
}
function isOpenClawStateSchemaFastPathEligible(database, pathname, integrity) {
	const admitted = getStateRuntimeSchemaAdmission(database);
	if (admitted) return admitted.startupReady;
	let publishIntegrity;
	const eligible = withSqlitePostCommitPublications(database, () => runSqliteDeferredTransactionSync(database, () => {
		const userVersion = assertSupportedStateSchemaVersion(database, pathname);
		if (readStateSchemaContentVersion(database) !== 22) return false;
		const schemaVersion = readSqliteSchemaCookie(database);
		if (typeof schemaVersion !== "number") throw new Error(`Shared-state database ${pathname} schema version is unavailable.`);
		assertCurrentStateRuntimeSchema(database, pathname, createSqliteTableContractReader(database));
		assertNoLegacyStateRuntimeRepair(database, pathname);
		publishIntegrity = assertOpenClawStateRuntimeIntegrity(database, pathname, {
			schemaVersion,
			userVersion
		}, integrity);
		return true;
	}, { operationLabel: "state.admission.fast-path" }));
	publishIntegrity?.();
	if (eligible) publishStateRuntimeSchemaAdmission(database, true);
	return eligible;
}
//#endregion
//#region src/state/openclaw-state-db-existing-schema.ts
/** Metadata is validated with the physical database's first runtime admission. */
function assertExistingOpenClawStateRuntimeMetadata(database, pathname) {
	if (getStateRuntimeSchemaAdmission(database)) {
		const version = getStateSchemaVersionAdmission(database)?.userVersion;
		if (version !== void 0) return version;
	}
	const version = assertSupportedStateSchemaVersion(database, pathname);
	if (readStateSchemaContentVersion(database) !== 22) throw new Error(`Existing shared-state database ${pathname} requires schema migration by its owning installation; run openclaw doctor --fix there before using it.`);
	let metadata;
	try {
		metadata = executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).selectFrom("schema_meta").select(["role", "schema_version"]).where("meta_key", "=", "primary").limit(1));
	} catch (error) {
		throw classifySqliteTableReadError(database, "schema_meta", [
			"meta_key",
			"role",
			"schema_version"
		], error);
	}
	if (metadata?.role !== "global" || metadata.schema_version !== version) throw new Error(`Existing shared-state database ${pathname} has inconsistent ownership or schema metadata.`);
	return version;
}
/** Validate an existing runtime schema without applying repairs. */
function assertExistingOpenClawStateRuntimeSchema(database, pathname, integrity, integrityPolicy) {
	const admitted = getStateRuntimeSchemaAdmission(database) ? getAdmittedSqliteSchemaFacts(database) : void 0;
	if (admitted) {
		assertOpenClawStateRuntimeIntegrity(database, pathname, admitted, integrity, integrityPolicy)?.();
		return;
	}
	let publishIntegrity;
	runSqliteDeferredTransactionSync(database, () => {
		const userVersion = assertExistingOpenClawStateRuntimeMetadata(database, pathname);
		const currentCookie = readSqliteSchemaCookie(database);
		if (typeof currentCookie !== "number") throw new Error(`Existing shared-state database ${pathname} schema version is unavailable.`);
		publishIntegrity = assertOpenClawStateRuntimeIntegrity(database, pathname, {
			schemaVersion: currentCookie,
			userVersion
		}, integrity, integrityPolicy);
		assertCurrentStateRuntimeSchema(database, pathname, createSqliteTableContractReader(database));
		assertNoLegacyStateRuntimeRepair(database, pathname);
	}, { operationLabel: "state.admission.existing-schema" });
	publishIntegrity?.();
	publishStateRuntimeSchemaAdmission(database, true);
}
//#endregion
//#region src/state/openclaw-state-db-read-schema.ts
function assertStateReadSchemaForPolicy(database, pathname, existingSchema, integrityPolicy, readContentVersionRow) {
	if (isPostgresSqlConnection(database)) {
		if (integrityPolicy !== void 0) requireNativeDatabaseFile("postgres", "integrity");
		assertSupportedStateSchemaVersion(database, pathname, void 0, readContentVersionRow);
		return;
	}
	if (existingSchema) assertExistingOpenClawStateRuntimeSchema(database, pathname, getSqliteWorkerStateIntegrityAdmission(), integrityPolicy);
	else assertSupportedStateSchemaVersion(database, pathname, void 0, readContentVersionRow);
}
//#endregion
//#region src/state/openclaw-state-db-read-connection.ts
const retainedReaders = /* @__PURE__ */ new Map();
const corruptedReaders = /* @__PURE__ */ new WeakSet();
let unregisterExitClose;
function retireReader(reader) {
	if (retainedReaders.get(reader.identity.key) !== reader) return;
	clearTimeout(reader.idleTimer);
	reader.retiring = true;
	reader.connection.close();
	retainedReaders.delete(reader.identity.key);
	if (!retainedReaders.size) {
		unregisterExitClose?.();
		unregisterExitClose = void 0;
	}
}
function scheduleReaderRetirement(reader) {
	if (!getSqliteRuntimeCapabilities().explicitSqliteCloseReleasesNativeResources || retainedReaders.get(reader.identity.key) !== reader) return;
	clearTimeout(reader.idleTimer);
	reader.idleTimer = runInDetachedAsyncContext(() => setTimeout(() => {
		try {
			retireReader(reader);
		} catch (error) {
			process.emitWarning(`Idle shared-state reader cleanup failed: ${String(error)}`);
			scheduleReaderRetirement(reader);
		}
	}, SQLITE_IDLE_HANDLE_TTL_MS));
	reader.idleTimer.unref?.();
}
/** The host joins this receipt before allowing replacement or deletion of live state. */
function closeRetainedOpenClawStateReadConnections(identity) {
	const errors = [];
	for (const reader of retainedReaders.values()) if (identity === void 0 || reader.identity.key === identity) try {
		retireReader(reader);
	} catch (error) {
		errors.push(error);
	}
	throwSqliteLifecycleErrors(errors, "Retained shared-state reader cleanup failed.");
}
function borrowStateReadConnection(pathname, expectedIdentity) {
	if (isStatePostgres()) return openStateReadConnectionResult(pathname, pathname, expectedIdentity, void 0, true);
	isExistingOpenClawStateSchema(pathname);
	const identity = readDatabasePathIdentitySync(pathname);
	if (expectedIdentity !== void 0) assertExistingDatabaseIdentity(pathname, expectedIdentity);
	for (const previous of retainedReaders.values()) if (previous.identity.canonicalPath === identity.canonicalPath && previous.identity.key !== identity.key) retireReader(previous);
	if (!identity.key.startsWith("file:")) return openStateReadConnectionResult(pathname, pathname, expectedIdentity);
	let reader = retainedReaders.get(identity.key);
	if (reader?.retiring || reader && !reader.connection.database.db.isOpen) {
		retireReader(reader);
		reader = void 0;
	}
	if (reader?.borrowed) return openStateReadConnectionResult(pathname, pathname, identity.key);
	if (!reader) {
		const opening = openStateReadConnectionResult(pathname, pathname, identity.key);
		if (opening.status === "unavailable") return opening;
		reader = {
			connection: opening.value,
			identity,
			retiring: false,
			borrowed: false
		};
		retainedReaders.set(identity.key, reader);
		unregisterExitClose ??= registerSqliteCacheExitClose(closeRetainedOpenClawStateReadConnections);
	}
	const retained = reader;
	observeOpenClawDatabaseMaintenanceResource(retained);
	retained.borrowed = true;
	clearTimeout(retained.idleTimer);
	return {
		status: "available",
		value: {
			database: {
				db: retained.connection.database.db,
				path: pathname
			},
			close(keep) {
				retained.borrowed = false;
				if (keep && retained.connection.database.db.isOpen && !retained.connection.database.db.isTransaction) scheduleReaderRetirement(retained);
				else retireReader(retained);
				return true;
			}
		}
	};
}
var SnapshotCleanupIncompleteError = class extends Error {};
function assertStateReadSchema(database, pathname, integrityPolicy) {
	assertStateReadSchemaForPolicy(database, pathname, isExistingOpenClawStateSchema(pathname, database), integrityPolicy);
}
function withOpenClawStateReadOnlyLocation(operation, pathname, source, openStateSchemaReadAdmission, expectedIdentity, snapshotRoot, retainConnection = false, readContentVersionRow) {
	const result = readOpenClawStateReadOnlyLocation(operation, pathname, source, openStateSchemaReadAdmission, expectedIdentity, snapshotRoot, retainConnection, readContentVersionRow);
	if (result.status === "unavailable") throw result.error;
	return result.value;
}
/** Return a failed read only after its native reader and admission have settled. */
function readOpenClawStateReadOnlyLocation(operation, pathname, source, openStateSchemaReadAdmission, expectedIdentity, snapshotRoot, retainConnection = false, readContentVersionRow) {
	const opening = retainConnection && source === pathname && !snapshotRoot ? borrowStateReadConnection(pathname, expectedIdentity) : openStateReadConnectionResult(pathname, source, expectedIdentity, snapshotRoot, true);
	if (opening.status === "unavailable") return opening;
	const opened = opening.value;
	const errors = [];
	let closeAdmission;
	let result;
	try {
		if (openStateSchemaReadAdmission) {
			if (isPostgresSqlConnection(opened.database.db)) requireNativeDatabaseFile("postgres", "repair");
			closeAdmission = openStateSchemaReadAdmission(opened.database.db);
		}
		const existingSchema = isExistingOpenClawStateSchema(pathname, opened.database.db);
		try {
			const read = () => runSqliteReadOperationSync(opened.database.db, () => {
				admitStateSchemaFacts(opened.database.db, pathname);
				assertStateReadSchemaForPolicy(opened.database.db, pathname, existingSchema, void 0, readContentVersionRow);
				return operation(opened.database);
			});
			result = {
				status: "available",
				value: isPostgresSqlConnection(opened.database.db) ? opened.database.db.runTransaction(read, void 0, true) : read()
			};
		} catch (error) {
			if (!isPostgresSqlConnection(opened.database.db) && isSqliteCorruptionError(error)) {
				invalidateOpenClawStateRuntimeIntegrity(opened.database.db);
				corruptedReaders.add(opened.database.db);
			}
			result = {
				status: "unavailable",
				error
			};
		}
		const location = typeof source === "string" ? source : source.location;
		if (result.status === "available" && location === pathname && isPromiseLike(result.value)) throw new SqliteCoordinatorError("SQLite source read must remain synchronous");
		assertTransactionUsable(opened.database.db);
	} catch (error) {
		errors.push(error);
	}
	try {
		closeAdmission?.();
	} catch (error) {
		errors.push(error);
	}
	try {
		const allowDeferredSnapshotCleanup = typeof source !== "string" && errors.length === 0 && result?.status === "available" && !getSqliteRuntimeCapabilities().explicitSqliteCloseReleasesNativeResources;
		if (!opened.close(errors.length === 0 && result?.status === "available" && !corruptedReaders.has(opened.database.db)) && !allowDeferredSnapshotCleanup) throw new SnapshotCleanupIncompleteError("Shared-state snapshot cleanup is incomplete.");
	} catch (error) {
		errors.push(error);
	}
	if (errors.length) {
		if (result?.status === "unavailable" && !errors.includes(result.error)) errors.unshift(result.error);
		throwSqliteLifecycleErrors(errors, "Shared-state read and reader cleanup failed.");
	}
	return result;
}
function openOpenClawStateReadOnlyLocation(pathname, source) {
	const connection = openOpenClawStateReadConnection(pathname, source);
	try {
		runSqliteReadOperationSync(connection.database.db, () => {
			admitStateSchemaFacts(connection.database.db, pathname);
			assertStateReadSchema(connection.database.db, pathname);
		});
	} catch (error) {
		try {
			connection.close();
		} catch (cleanupError) {
			throwSqliteLifecycleErrors([error, cleanupError], "Shared-state reader admission and cleanup failed.");
		}
		throw error;
	}
	return connection;
}
/** Own one native reader; callers retain their runtime or maintenance schema policy. */
function openOpenClawStateReadConnection(pathname, source, expectedIdentity, snapshotRoot) {
	const result = openStateReadConnectionResult(pathname, source, expectedIdentity, snapshotRoot);
	if (result.status === "unavailable") throw result.error;
	return result.value;
}
function openStateReadConnectionResult(pathname, source, expectedIdentity, snapshotRoot, checkSchemaPolicy = false) {
	const snapshot = typeof source === "string" ? void 0 : source;
	const location = typeof source === "string" ? source : source.location;
	const physicalLocation = resolveSqliteDatabaseFilePath(location);
	const options = {
		readOnly: true,
		timeout: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS
	};
	let releaseToken;
	const cleanupFailedOpen = (error) => {
		const errors = [error];
		try {
			releaseToken?.();
		} catch (cleanupError) {
			errors.push(cleanupError);
		}
		try {
			if (snapshot && !snapshot.cleanup()) errors.push(new SnapshotCleanupIncompleteError("Shared-state snapshot cleanup is incomplete."));
		} catch (cleanupError) {
			errors.push(cleanupError);
		}
		if (errors.length > 1) throw createSqliteLifecycleAggregateError(errors, "Shared-state reader open and cleanup failed.", error);
	};
	let native;
	try {
		if (isStatePostgres()) {
			if (source !== pathname || snapshotRoot);
			if (checkSchemaPolicy) isExistingOpenClawStateSchema(pathname);
		}
		if (expectedIdentity !== void 0) assertExistingDatabaseIdentity(physicalLocation, expectedIdentity);
		releaseToken = snapshotRoot ? acquireSqliteSnapshotReadToken(snapshotRoot) : void 0;
		if (checkSchemaPolicy) isExistingOpenClawStateSchema(pathname);
		if (location === pathname) native = openTrackedStateDatabaseResult(pathname, options);
		else try {
			native = {
				status: "available",
				database: openNodeSqliteDatabase(location, options)
			};
		} catch (error) {
			native = {
				status: "unavailable",
				error
			};
		}
	} catch (error) {
		cleanupFailedOpen(error);
		throw error;
	}
	if (native.status === "unavailable") {
		cleanupFailedOpen(native.error);
		return native;
	}
	const db = native.database;
	let closed = false;
	let closing = false;
	const database = {
		db,
		path: pathname,
		afterClose: () => {
			releaseToken?.();
			if (snapshot && !snapshot.cleanup()) throw new SnapshotCleanupIncompleteError("Shared-state snapshot cleanup is incomplete.");
		}
	};
	const connection = {
		database: {
			db,
			path: pathname
		},
		snapshotSource: snapshot ? { retain() {
			const assertCurrent = () => {
				if (closing || closed) throw new Error("Shared-state snapshot source is closing or closed");
			};
			assertCurrent();
			return {
				location: snapshot.location,
				cleanupRoot: snapshot.cleanupRoot,
				assertCurrent,
				release: retainSnapshotTempDirectory(snapshot.cleanupRoot ?? path.dirname(snapshot.location))
			};
		} } : void 0,
		close() {
			if (closed) return false;
			closing = true;
			const errors = openClawStateDatabaseCache.closeOpenClawStateDatabaseHandle(database);
			if (errors.length === 1 && errors[0] instanceof SnapshotCleanupIncompleteError) return false;
			throwSqliteLifecycleErrors(errors, "Shared-state reader cleanup failed.");
			closed = true;
			return true;
		}
	};
	try {
		enableNodeSqliteKyselyStatementCache(db);
		if (expectedIdentity !== void 0) assertExistingDatabaseIdentity(physicalLocation, expectedIdentity);
	} catch (error) {
		try {
			if (!connection.close()) throw new SnapshotCleanupIncompleteError("Shared-state snapshot cleanup is incomplete.");
		} catch (cleanupError) {
			throw createSqliteLifecycleAggregateError([error, cleanupError], "Shared-state reader identity and cleanup failed.", error);
		}
		throw error;
	}
	return {
		status: "available",
		value: connection
	};
}
//#endregion
//#region src/state/openclaw-state-db-transaction.ts
const managedStateTransactions = resolveGlobalSingleton(Symbol.for("openclaw.managedStateTransactions"), () => /* @__PURE__ */ new WeakSet());
/** Only the synchronous transaction owner may lend its uncommitted authority rows. */
function isManagedStateTransaction(database) {
	return database.isTransaction && managedStateTransactions.has(database);
}
function runManagedStateTransaction(database, operation, options) {
	if (database.isTransaction && !managedStateTransactions.has(database)) throw new Error("Cannot join an unmanaged shared-state transaction; enter through runOpenClawStateWriteTransaction before BEGIN.");
	const transaction = () => withSqlitePostCommitPublications(database, () => {
		const outer = !database.isTransaction;
		if (outer) managedStateTransactions.add(database);
		try {
			return options.singleStatement ? runSqliteSingleStatementSync(database, operation) : runSqliteImmediateTransactionSync(database, operation, options);
		} finally {
			if (outer) managedStateTransactions.delete(database);
		}
	});
	return options.busyTimeoutMs === void 0 || isPostgresSqlConnection(database) ? transaction() : runWithSqliteBusyTimeout(database, options.busyTimeoutMs, transaction);
}
//#endregion
//#region src/state/openclaw-state-db-readonly-reuse.ts
const maintenanceReaders = /* @__PURE__ */ new WeakMap();
/** Mutable maintenance owns this live reader until drainage; each guard queries current rows. */
function withMaintenanceOpenClawStateDatabaseReadOnly(operation, pathname) {
	const scope = getOpenClawDatabaseMaintenanceScope();
	if (!scope || !allowsMaintenanceLiveAuthorityReads(scope, pathname)) return { reused: false };
	scope.assertReadAdmission();
	let readers = maintenanceReaders.get(scope);
	if (!readers) {
		readers = /* @__PURE__ */ new Map();
		maintenanceReaders.set(scope, readers);
	}
	let reader = readers.get(pathname);
	if (!reader) {
		const admission = captureOpenClawStateDatabaseReadAdmission(pathname);
		assertExistingDatabaseIdentity(pathname, admission.identity.key, admission.identity.birthtime);
		const connection = openOpenClawStateReadOnlyLocation(pathname, pathname);
		let closed = false;
		const close = () => {
			if (closed) return;
			if (!connection.close()) throw new Error("Maintenance authority reader cleanup is incomplete");
			closed = true;
			readers.delete(pathname);
			unregister();
		};
		const unregister = registerOpenClawStateDatabaseAsyncResource({ async close(identity) {
			if (!identity || identity.key === admission.identity.key || identity.canonicalPath === admission.identity.canonicalPath) close();
		} });
		scope.own(connection, "shared-handles", close);
		reader = { read(readOperation) {
			admission.assertCurrent();
			assertExistingDatabaseIdentity(pathname, admission.identity.key, admission.identity.birthtime);
			const value = runSqliteReadOperationSync(connection.database.db, () => {
				assertStateReadSchema(connection.database.db, pathname);
				return readOperation(connection.database);
			});
			if (isPromiseLike(value)) throw new SqliteCoordinatorError("SQLite maintenance authority read must remain synchronous");
			return value;
		} };
		readers.set(pathname, reader);
	}
	return {
		reused: true,
		value: reader.read(operation)
	};
}
/** Current-authority guards can borrow their writer; discovery sees committed rows. */
function withCachedOpenClawStateDatabaseReadOnly(operation, pathname, currentAuthority) {
	return openClawStateDatabaseCache.withCachedOpenClawStateDatabase(pathname, { readOnly: true }, (opened) => {
		if (!opened.db.isOpen) return { reused: false };
		const ownedTransaction = currentAuthority && isManagedStateTransaction(opened.db);
		if (opened.db.isTransaction && !ownedTransaction) return { reused: false };
		try {
			if (isExistingOpenClawStateSchema(pathname, opened.db)) assertStateReadSchema(opened.db, pathname);
			observeOpenClawDatabaseMaintenanceResource(opened.db);
			const value = operation(opened);
			if (ownedTransaction && isPromiseLike(value)) throw new SqliteCoordinatorError("SQLite current-authority read must remain synchronous");
			return {
				reused: true,
				value
			};
		} catch (error) {
			openClawStateDatabaseCache.evictOpenClawStateDatabaseAfterCorruption(opened, error);
			throw error;
		}
	}) ?? { reused: false };
}
/** A native read borrow can avoid copying only while its original physical path still matches. */
function canReadWarmNativeSourceIndependently(database, pathname, admittedIdentity) {
	const identity = requireOpenClawStateDatabaseIdentity(database);
	if (identity.key !== admittedIdentity) return false;
	try {
		assertExistingDatabaseIdentity(pathname, identity.key);
		return true;
	} catch {
		return false;
	}
}
//#endregion
//#region src/state/openclaw-state-read-pool.ts
function stateReadPools(state) {
	return [state.pool, state.awaitedPool].filter((pool) => pool !== void 0);
}
function createStateReadPool(workerUrl, nativeSource) {
	ensureSqliteLibrarySelected();
	return createOwnedWorkerTaskPool({
		workerUrl,
		workerOptions: { resourceLimits: { maxOldGenerationSizeMb: 512 } },
		maxWorkers: resolveStateReadWorkerCount(),
		idleTimeoutMs: SQLITE_IDLE_HANDLE_TTL_MS,
		burstIdleTimeoutMs: 3e4,
		maxPendingTasks: 128,
		maxPendingBytes: DEFAULT_WORKER_PENDING_BYTES
	}, nativeSource ? {
		retainedTransport: true,
		nativeSource,
		databaseAccess: "read-only"
	} : { databaseAccess: "read-only" });
}
function closeReadResources(pool, key) {
	return getSqliteRuntimeCapabilities().explicitSqliteCloseReleasesNativeResources ? pool.closeResources(key) : pool.rotate();
}
/** The same task/close contract; promise-only callers do not synchronously service it. */
function startReadTask(selection, input, options) {
	if (selection.retained) return selection.pool.startTask(input, options);
	const task = selection.pool.runTask(input, options);
	const result = createRetainedOperation(() => {});
	task.result.then(result.resolve, result.reject);
	return {
		...result.operation,
		release(closeOptions) {
			const closed = createRetainedOperation(() => {});
			task.close(closeOptions).then(closed.resolve, closed.reject);
			return closed.operation;
		}
	};
}
//#endregion
//#region src/state/openclaw-state-read-request.ts
function stringBytes(values) {
	return values.reduce((bytes, value) => bytes + Buffer.byteLength(value ?? "", "utf8"), 0);
}
function commandBytes(value) {
	if (typeof value === "string") return Buffer.byteLength(JSON.stringify(value), "utf8");
	if (typeof value === "number" || typeof value === "bigint") return 8;
	if (typeof value === "boolean") return 1;
	if (value === null || value === void 0) return 0;
	if (Array.isArray(value)) return value.reduce((bytes, entry) => bytes + 8 + commandBytes(entry), 0);
	return Object.entries(value).reduce((bytes, [key, entry]) => bytes + Buffer.byteLength(key, "utf8") + 8 + commandBytes(entry), 0);
}
function requestBytes(request) {
	return commandBytes(request.command) + stringBytes([
		...Object.entries(request.context.environment).flatMap(([key, value]) => [key, value]),
		request.context.existingSchemaPath,
		request.databasePath,
		request.location,
		request.expectedIdentity,
		request.snapshotRoot
	]);
}
//#endregion
//#region src/state/openclaw-state-read-worker.ts
function decodeOpenClawStateReadReply(reply) {
	if (reply.ok) return { value: reply };
	const error = new Error(reply.message);
	retainOpenClawStateWorkerErrorPayload(error, reply.error);
	return {
		error: hydrateOpenClawStateWorkerError(error, { includeOrdinary: true }),
		sourceAdmitted: reply.sourceAdmitted === true
	};
}
async function closeReadPool(state) {
	if (state.closing) return await state.closing;
	const pools = stateReadPools(state);
	if (!pools.length) return;
	const closing = (async () => {
		const results = await Promise.allSettled(pools.map(async (pool) => {
			await closeReadResources(pool);
			await pool.close();
		}));
		throwSqliteLifecycleErrors(results.flatMap((result) => result.status === "rejected" ? [result.reason] : []), "Shared-state reader pools cleanup failed");
		state.pool = void 0;
		state.awaitedPool = void 0;
	})();
	state.closing = closing;
	try {
		await closing;
	} finally {
		state.closing = void 0;
	}
}
function readRuntimes() {
	return resolveGlobalSingleton(Symbol.for("openclaw.stateReadWorkers"), () => {
		const sources = /* @__PURE__ */ new Map();
		registerOpenClawStateDatabaseAsyncResource({
			phase: "after-resources",
			async close(identity) {
				const results = await Promise.allSettled([...sources.values()].map(async (state) => {
					if (identity) {
						const resources = await Promise.allSettled(stateReadPools(state).map((pool) => closeReadResources(pool, identity.key)));
						throwSqliteLifecycleErrors(resources.flatMap((result) => result.status === "rejected" ? [result.reason] : []), "Shared-state reader resources cleanup failed");
					} else await closeReadPool(state);
				}));
				throwSqliteLifecycleErrors(results.flatMap((result) => result.status === "rejected" ? [result.reason] : []), "Shared-state reader source cleanup failed");
			}
		});
		registerOpenClawStateDatabaseLifecycleListener((event) => {
			if (event.kind !== "opened" && event.identity) {
				const identity = event.identity;
				for (const state of sources.values()) Promise.allSettled(stateReadPools(state).map((pool) => closeReadResources(pool, identity.key))).then((results) => throwSqliteLifecycleErrors(results.flatMap((result) => result.status === "rejected" ? [result.reason] : []), "Shared-state reader invalidation failed")).catch((error) => {
					process.emitWarning(`Shared-state reader invalidation failed: ${String(error)}`);
				});
			}
		});
		return sources;
	});
}
function readPool(state, admitted, awaitedOnly) {
	if (state.sealed && !admitted || state.closing) throw new WorkerTaskError("Shared-state readers are closing", "unavailable");
	const retained = !awaitedOnly || state.pool !== void 0;
	const key = retained ? "pool" : "awaitedPool";
	if (!state[key]) state[key] = createStateReadPool(state.workerUrl, retained ? state.nativeSource : void 0);
	return {
		pool: state[key],
		retained
	};
}
/** Capture the execution source before snapshot preparation yields. */
function captureOpenClawStateReadSource() {
	const captured = captureRuntimeWorkerSource(resolveRuntimeProcessEntrypointUrl("stateRead"));
	const nativeSource = captureRetainedNativeWorkerSource({ runtimeGeneration: captured.runtimeGeneration });
	const sources = readRuntimes();
	let runtime = sources.get(nativeSource);
	if (!runtime) {
		const created = {
			nativeSource,
			workerUrl: captured.moduleUrl,
			operations: /* @__PURE__ */ new Set(),
			servicing: false,
			sealed: false
		};
		nativeSource.retain(created, () => {
			created.sealed = true;
			if (!created.stopping) created.stopping = Promise.resolve().then(async () => {
				const results = await Promise.allSettled([...created.operations].map((operation) => Promise.resolve().then(() => operation.close())));
				throwSqliteLifecycleErrors(results.flatMap((result) => result.status === "rejected" ? [result.reason] : []), "Shared-state reader source cleanup failed");
				await closeReadPool(created);
				sources.delete(nativeSource);
			}).finally(() => {
				created.stopping = void 0;
			});
			return created.stopping;
		});
		sources.set(nativeSource, created);
		runtime = created;
	}
	const state = runtime;
	const admitted = /* @__PURE__ */ new Set();
	return {
		createTransport: (command, onChunk, onChunkAsync, awaitedOnly = false) => createReadTransport(command, state, () => admitted.size > 0, onChunk, onChunkAsync, awaitedOnly),
		own(service, close) {
			if (state.sealed || state.closing) throw new WorkerTaskError("Shared-state readers are closing", "unavailable");
			const inContext = AsyncLocalStorage.snapshot();
			const operation = {
				service: () => inContext(service),
				close: () => inContext(close)
			};
			state.operations.add(operation);
			admitted.add(operation);
			return () => {
				state.operations.delete(operation);
				admitted.delete(operation);
			};
		},
		service() {
			if (state.servicing) return;
			state.servicing = true;
			const errors = [];
			try {
				const operations = Array.from(state.operations);
				for (const operation of operations) if (state.operations.has(operation)) try {
					operation.service();
				} catch (error) {
					errors.push(error);
				}
			} finally {
				state.servicing = false;
			}
			throwSqliteLifecycleErrors(errors, "Shared-state reader source cleanup failed");
		}
	};
}
function createReadTransport(command, state, ownsAdmission, onChunk, onChunkAsync, awaitedOnly = false) {
	const capturedCommand = structuredClone(command);
	const tasks = /* @__PURE__ */ new Map();
	let closed = false;
	let closing;
	let pendingChunks = 0;
	const startCloseTask = (task) => {
		try {
			return mapRetainedOperation(task.release(tasks.get(task)?.retire ? { retire: true } : void 0), () => {
				tasks.delete(task);
			});
		} catch (error) {
			const completion = createRetainedOperation(() => {});
			completion.reject(error);
			return completion.operation;
		}
	};
	const startRun = (context, location, checkFreshAdmission, readCommand, authority, expectedIdentity, snapshotRoot) => {
		const inContext = AsyncLocalStorage.snapshot();
		let task;
		let releaseAdmission;
		let retireAfterRead = false;
		const cleanup = { retire: true };
		const completion = createRetainedOperation(() => inContext(service));
		function service() {
			if (!task || completion.operation.read().status !== "pending") return;
			let outcome;
			try {
				task.service();
				const read = task.read();
				if (read.status === "pending") return;
				if (read.status === "rejected") throw read.error;
				const reply = read.value;
				cleanup.retire = retireAfterRead || Boolean(reply.nativeCleanupFailure);
				outcome = decodeOpenClawStateReadReply(reply);
			} catch (error) {
				outcome = { error };
			}
			releaseAdmission?.();
			releaseAdmission = void 0;
			cleanup.retire ||= "error" in outcome;
			completion.resolve(outcome);
		}
		try {
			if (closed) throw new WorkerTaskError("Shared-state read transport is closed", "unavailable");
			const request = {
				context: {
					environment: { ...context.environment },
					existingSchemaPath: context.existingSchemaPath,
					stateIntegrity: context.stateIntegrity
				},
				databasePath: context.admission.databasePath,
				location,
				checkFreshAdmission,
				expectedIdentity,
				snapshotRoot,
				command: { ...readCommand }
			};
			const pool = readPool(state, ownsAdmission(), awaitedOnly);
			retireAfterRead = !pool.retained && !context.maintenanceScope && readCommand.type !== "admit";
			task = startReadTask(pool, () => {
				const turn = acquireSqliteDatabaseAdmissionTurn(resolveSqliteDatabaseFilePath(location));
				if (!turn) {
					authority.assertCurrent();
					return request;
				}
				return turn.then((release) => {
					releaseAdmission = release;
					try {
						authority.assertCurrent();
						return request;
					} catch (error) {
						releaseAdmission();
						releaseAdmission = void 0;
						throw error;
					}
				});
			}, {
				signal: authority.signal,
				inputBytes: requestBytes(request),
				diagnosticOperation: readCommand.type,
				...onChunkAsync ? { async onRequest(value, { signal: taskSignal }) {
					authority.assertCurrent();
					const signal = AbortSignal.any([authority.signal, taskSignal]);
					signal.throwIfAborted();
					pendingChunks += 1;
					try {
						await onChunkAsync(value, signal);
						signal.throwIfAborted();
						authority.assertCurrent();
						return {
							input: null,
							timeoutMs: 3e5
						};
					} finally {
						pendingChunks -= 1;
						closing?.service();
					}
				} } : onChunk ? { onRequestSync(value) {
					authority.assertCurrent();
					onChunk(value);
					return {
						input: null,
						timeoutMs: 3e5
					};
				} } : {}
			});
			tasks.set(task, cleanup);
			task.result.then(() => completion.operation.service(), () => completion.operation.service());
			completion.operation.service();
		} catch (error) {
			releaseAdmission?.();
			releaseAdmission = void 0;
			completion.reject(error);
		}
		return {
			task,
			operation: completion.operation
		};
	};
	const startValidateFresh = (context, authority) => {
		const run = startRun(context, context.admission.databasePath, true, { type: "admit" }, authority);
		return flatMapRetainedOperation(run.operation, (read) => {
			if ("error" in read) throw read.error;
			authority.assertCurrent();
			if (!run.task) throw new Error("Shared-state admission completed without its retained task");
			return startCloseTask(run.task);
		});
	};
	const startRead = (source, authority) => startRun(source.context, source.location, source.checkFreshAdmission, capturedCommand, authority, source.expectedIdentity, source.snapshotRoot).operation;
	const startClose = () => {
		closed = true;
		if (closing) return closing;
		const releases = [...tasks.keys()].map(startCloseTask);
		const inContext = AsyncLocalStorage.snapshot();
		const completion = createRetainedOperation(() => inContext(service));
		closing = completion.operation;
		function service() {
			if (completion.operation.read().status !== "pending") return;
			const errors = [];
			let pending = pendingChunks > 0;
			for (const release of releases) {
				release.service();
				const outcome = release.read();
				pending ||= outcome.status === "pending";
				if (outcome.status === "rejected") errors.push(outcome.error);
			}
			if (pending) return;
			closing = void 0;
			try {
				throwSqliteLifecycleErrors(errors, "Shared-state reader task cleanup failed");
				completion.resolve(void 0);
			} catch (error) {
				completion.reject(error);
			}
		}
		for (const release of releases) release.result.then(() => completion.operation.service(), () => completion.operation.service());
		completion.operation.service();
		return completion.operation;
	};
	return {
		startValidateFresh,
		startRead,
		startClose
	};
}
//#endregion
//#region src/state/openclaw-state-read-operation.ts
/** Owns query admission and release together, so a later reader can release an earlier slot. */
function startOpenClawStateReadOperation(command, selection) {
	const { pathname, snapshot, scopes, context, preserveArtifacts, preferIndependentWarmRead, controller, signal, receipt } = selection;
	const resume = AsyncLocalStorage.snapshot();
	const result = createDeferredCore();
	result.promise.catch(() => void 0);
	let outcome = { status: "pending" };
	let source;
	let transport;
	let unregisterSource;
	let unregister;
	let borrowed;
	let prepared;
	let preparation;
	let preparationClose;
	let startPreparedCleanup;
	let releasePreparedSource;
	let expectedIdentity;
	let expectedSourceIdentity;
	let awaitedOnly = selection.snapshotPreparation === "awaited";
	let producerSettled = false;
	let value;
	const errors = [];
	const acceptanceErrors = [];
	let producerStep;
	let cleanupStep;
	let cleanupAttempt;
	let transportStopped = false;
	let cleaned = false;
	let servicing = false;
	const assertReadLifetime = () => {
		signal.throwIfAborted();
		context.maintenanceScope?.assertAdmission();
		context.admission.assertCurrent();
		snapshot?.assertCurrent?.();
		borrowed?.assertCurrent();
		if (expectedIdentity !== void 0) assertExistingDatabaseIdentity(pathname, expectedIdentity);
		if (expectedSourceIdentity) assertExistingDatabaseIdentity(pathname, expectedSourceIdentity.key, expectedSourceIdentity.birthtime);
		if (scopes.some((scope) => !scope.active)) throw new Error("Shared-state read scope is closed");
	};
	const authority = {
		signal,
		assertCurrent() {
			assertReadLifetime();
			openClawStateDatabaseCache.assertOpenClawStateDatabaseOpenAllowed(pathname, "cached-read");
		}
	};
	function settle(cleanupErrors = []) {
		if (outcome.status !== "pending") return;
		try {
			throwSqliteLifecycleErrors([
				...errors,
				...[...new Set(acceptanceErrors)].filter((error) => !errors.includes(error)),
				...cleanupErrors
			], "Shared-state read and cleanup failed");
			outcome = {
				status: "fulfilled",
				value
			};
			result.resolve(value);
		} catch (error) {
			let mapped;
			try {
				mapped = selection.mapError ? selection.mapError(error, receipt.phase) : error;
			} catch (mappingError) {
				mapped = mappingError;
			}
			outcome = {
				status: "rejected",
				error: mapped
			};
			result.reject(mapped);
		}
	}
	function finishCleanup(error) {
		const attempt = cleanupAttempt;
		cleanupAttempt = void 0;
		cleanupStep = void 0;
		if (error) attempt?.reject(error.error);
		else attempt?.resolve();
		if (producerSettled) settle(error ? [error.error] : []);
	}
	function release() {
		borrowed?.release();
		borrowed = void 0;
		snapshot?.release?.();
		cleaned = true;
		unregister?.();
		for (const scope of scopes) scope.resources.delete(resource);
		unregisterSource?.();
		finishCleanup();
	}
	function acceptCleanup(success) {
		if (!success) throw new Error(`Shared-state read snapshot cleanup failed: ${prepared?.cleanupRoot ?? pathname}`);
		prepared = void 0;
		startPreparedCleanup = void 0;
		closePreparation();
	}
	function startPreparationClose() {
		if (!preparation) return;
		if (!preparationClose || preparationClose.read().status === "rejected") {
			preparationClose = preparation.startClose();
			preparationClose.result.then(service, service);
		}
		return preparationClose;
	}
	function closePreparation() {
		const closing = startPreparationClose();
		if (!closing) {
			release();
			return;
		}
		waitRetained("cleanup", closing, () => {
			preparation = void 0;
			preparationClose = void 0;
			release();
		});
	}
	function cleanupPrepared() {
		if (!prepared) {
			closePreparation();
			return;
		}
		releasePreparedSource?.();
		if (startPreparedCleanup) waitRetained("cleanup", startPreparedCleanup(), acceptCleanup);
		else {
			const pending = prepared.cleanupAsync();
			cleanupStep = void 0;
			waitAwaited(pending, acceptCleanup, finishCleanup);
		}
	}
	function waitProducer() {
		cleanupStep = () => {
			if (!producerSettled) {
				if (signal.aborted) {
					const closing = startPreparationClose();
					closing?.service();
					const joined = closing?.read();
					if (joined?.status === "rejected") throw joined.error;
				}
				return false;
			}
			cleanupStep = void 0;
			cleanupPrepared();
			return true;
		};
	}
	function cleanup() {
		if (cleaned) return Promise.resolve();
		if (cleanupAttempt) return cleanupAttempt.promise;
		const attempt = createDeferredCore();
		attempt.promise.catch(() => void 0);
		cleanupAttempt = attempt;
		try {
			if (!transportStopped && transport) waitRetained("cleanup", transport.startClose(), () => {
				transportStopped = true;
				waitProducer();
			});
			else waitProducer();
		} catch (error) {
			finishCleanup({ error });
		}
		service();
		return attempt.promise;
	}
	function finishProducer(error) {
		producerStep = void 0;
		producerSettled = true;
		if (error) errors.push(error.error);
		cleanup();
	}
	function service() {
		if (servicing) return;
		servicing = true;
		try {
			resume(() => {
				let changed;
				do {
					try {
						changed = producerStep?.() ?? false;
					} catch (error) {
						finishProducer({ error });
						changed = true;
					}
					try {
						changed = (cleanupStep?.() ?? false) || changed;
					} catch (error) {
						finishCleanup({ error });
						changed = true;
					}
				} while (changed);
			});
		} finally {
			servicing = false;
		}
	}
	function waitRetained(lane, operation, accept) {
		const step = () => {
			operation.service();
			const next = operation.read();
			if (next.status === "pending") return false;
			if (lane === "producer") producerStep = void 0;
			else cleanupStep = void 0;
			if (next.status === "rejected") throw next.error;
			accept(next.value);
			return true;
		};
		if (lane === "producer") producerStep = step;
		else cleanupStep = step;
		operation.result.then(service, service);
	}
	function waitAwaited(pending, accept, fail) {
		pending.then((next) => resume(() => {
			try {
				accept(next);
			} catch (error) {
				fail({ error });
			}
			service();
		}), (error) => resume(() => {
			fail({ error });
			service();
		}));
	}
	function query() {
		if (!snapshot && !prepared || snapshot?.cleanClose) expectedIdentity = context.admission.identity.key;
		if (prepared) {
			authority.assertCurrent();
			releasePreparedSource = retainSnapshotTempDirectory(prepared.cleanupRoot ?? path.dirname(prepared.location));
		}
		receipt.phase = command.type === "admit" ? "before-read" : "unobserved";
		if (!transport) throw new Error("Shared-state read transport is unavailable");
		waitRetained("producer", transport.startRead({
			context,
			location: snapshot?.cleanClose ? resolveImmutableSqliteFileUri(snapshot.location) : prepared?.location ?? snapshot?.location ?? pathname,
			checkFreshAdmission: !borrowed,
			expectedIdentity,
			snapshotRoot: prepared?.cleanupRoot ?? snapshot?.cleanupRoot
		}, authority), acceptReadOutcome);
	}
	function consumeReadOutcome(readOutcome) {
		const admitted = "error" in readOutcome ? readOutcome.sourceAdmitted : readOutcome.value.type === "admit" ? void 0 : readOutcome.value.sourceAdmitted;
		if (admitted === true) receipt.phase = "read";
		else if (admitted === false && receipt.phase !== "read") receipt.phase = "before-read";
		try {
			authority.assertCurrent();
			if (admitted) borrowed?.observe();
		} catch (error) {
			if (!("error" in readOutcome)) throw error;
			acceptanceErrors.push(error);
		}
		if ("error" in readOutcome) throw readOutcome.error;
		return readOutcome.value;
	}
	function acceptReadOutcome(readOutcome) {
		value = consumeReadOutcome(readOutcome);
		finishProducer();
	}
	const resource = { close() {
		controller.abort(/* @__PURE__ */ new Error("Shared-state read admission closed"));
		return resume(cleanup);
	} };
	try {
		source = captureOpenClawStateReadSource();
		transport = source.createTransport(command, selection.onChunk, selection.onChunkAsync, awaitedOnly);
		unregister = registerOpenClawStateDatabaseAsyncResource({ async close(identity) {
			if (!identity || identity.key === context.admission.identity.key || identity.canonicalPath === context.admission.identity.canonicalPath) await resource.close();
		} });
		context.maintenanceScope?.own(resource, "shared-resources", () => resource.close());
		for (const scope of scopes) scope.resources.add(resource);
		unregisterSource = source.own(service, () => resource.close());
		assertReadLifetime();
		if (snapshot) openClawStateDatabaseCache.assertOpenClawStateDatabaseOpenAllowed(pathname, "cached-read");
		if (command.type === "admit") query();
		else {
			const native = !snapshot && preserveArtifacts ? borrowOpenClawStateDatabaseForAsyncRead(pathname, "cached-read") : void 0;
			borrowed = native ?? (!snapshot && !preserveArtifacts ? retainOpenClawStateDatabaseForIndependentRead(pathname, "cached-read") : void 0);
			const independentWarmSource = native && preferIndependentWarmRead && canReadWarmNativeSourceIndependently(native.database, pathname, context.admission.identity.key);
			if (!snapshot && !borrowed && !existingPathOrUndefined(pathname)) finishProducer();
			else if (native && !independentWarmSource) {
				if (isPostgresSqlConnection(native.database.db)) requireNativeDatabaseFile("postgres", "file-snapshot");
				awaitedOnly = true;
				waitAwaited(prepareSqliteReadOnlyLocationFromOwnedDatabase(native.database.db, authority.assertCurrent, authority.signal, "async"), (location) => {
					prepared = location;
					query();
				}, finishProducer);
			} else if (!snapshot && preserveArtifacts && !independentWarmSource) {
				const sourceIdentity = { key: context.admission.identity.key };
				expectedSourceIdentity = sourceIdentity;
				authority.assertCurrent();
				if (selection.snapshotPreparation === "awaited" && command.type === "plugins.metadata.read" && context.maintenanceScope?.ownsSchemaMaintenance !== true && !getStateDatabaseSchemaLease(pathname)) {
					const capturedCommand = structuredClone(command);
					receipt.phase = "unobserved";
					waitAwaited(withSqliteSnapshotWorker(signal, (worker, stagingRoot) => {
						authority.assertCurrent();
						return runScopedSqliteReadOnlyOperation(worker, pathname, {
							type: "stateSnapshot.read",
							input: {
								stagingRoot,
								expectedSourceIdentity: sourceIdentity,
								command: capturedCommand,
								context: {
									environment: context.environment,
									existingSchemaPath: context.existingSchemaPath
								}
							}
						}, {
							source: "canonical",
							expectedIdentity: sourceIdentity.key,
							env: context.environment,
							signal
						}).then((reply) => consumeReadOutcome(decodeOpenClawStateReadReply(reply)));
					}), (reply) => {
						value = reply;
						finishProducer();
					}, finishProducer);
				} else waitRetained("producer", transport.startValidateFresh(context, authority), () => {
					authority.assertCurrent();
					if (selection.snapshotPreparation === "awaited") {
						waitAwaited(prepareSqliteReadOnlyLocationAwaited(pathname, {
							signal: authority.signal,
							expectedSourceIdentity: sourceIdentity
						}), (location) => {
							prepared = location;
							query();
						}, finishProducer);
						return;
					}
					preparation = startSqliteReadOnlyLocationAsync(pathname, {
						preserveSourceArtifacts: preserveArtifacts,
						signal: authority.signal,
						expectedSourceIdentity
					});
					waitRetained("producer", preparation, (location) => {
						prepared = location;
						startPreparedCleanup = () => location.startCleanup();
						query();
					});
				});
				awaitedOnly ||= selection.snapshotPreparation === "awaited";
			} else query();
		}
	} catch (error) {
		finishProducer({ error });
	}
	service();
	return awaitedOnly ? {
		kind: "awaited-only",
		result: result.promise
	} : {
		kind: "retained",
		operation: {
			result: result.promise,
			read: () => outcome,
			service() {
				source?.service();
				service();
			}
		}
	};
}
//#endregion
//#region src/state/openclaw-state-read-scope.ts
/** Closing retains custody for accepted readers, but never admits a new reader. */
function assertRetainedReadScopeAdmission(pathname, scopes) {
	if (scopes.some((scope) => scope?.path === pathname && (!scope.active || scope.work.isClosing))) throw new StateDatabaseReadAdmissionInvalidatedError("Shared-state read scope is closing or closed; retry the operation in a current scope.");
}
//#endregion
//#region src/state/openclaw-state-db-readonly.ts
const disposableStateReads = resolveGlobalSingleton(Symbol.for("openclaw.disposableStateReads"), () => new AsyncLocalStorage());
const stateSnapshotReads = resolveGlobalSingleton(Symbol.for("openclaw.stateSnapshotReads"), () => new AsyncLocalStorage());
/** Stable identity and private bytes for reads within the enclosing snapshot scope. */
function getActiveOpenClawStateDatabaseReadSnapshot(options = {}) {
	const current = stateSnapshotReads.getStore();
	return current?.path === resolveReadOnlyPath(options) ? current : void 0;
}
function requiresArtifactPreservingSnapshot(pathname) {
	const required = isArtifactPreservingStateRead("shared", pathname) && !isUpdateRehearsalPrivateDatabase(pathname, process.env) && !disposableStateReads.getStore()?.some((scope) => scope.active && scope.path === pathname);
	if (required);
	return required;
}
const synchronousReadSnapshots = resolveGlobalSingleton(Symbol.for("openclaw.synchronousStateReadSnapshots"), () => ({ current: void 0 }));
function resolveReadOnlyPath(options) {
	const pathname = resolveDatabasePath(options);
	assertRetainedReadScopeAdmission(pathname, [stateSnapshotReads.getStore(), ...disposableStateReads.getStore() ?? []]);
	isExistingOpenClawStateSchema(pathname);
	return pathname;
}
function withOpenClawStateDatabaseReadOnlyIfOpen(operation, pathname, currentAuthority = false) {
	const snapshot = stateSnapshotReads.getStore();
	if (snapshot?.active && snapshot.path === pathname) {
		openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, snapshot.env);
		return {
			reused: true,
			value: withOpenClawStateReadOnlyLocation(operation, pathname, snapshot.cleanClose ? resolveImmutableSqliteFileUri(snapshot.location) : snapshot.location)
		};
	}
	if (isArtifactPreservingStateRead("agent", pathname) && (requiresArtifactPreservingSnapshot(pathname) || isUpdateRehearsalPrivateDatabase(pathname, process.env))) return { reused: false };
	if (isStatePostgres() && !currentAuthority) return { reused: false };
	return withCachedOpenClawStateDatabaseReadOnly(operation, pathname, currentAuthority || synchronousReadSnapshots.currentAuthorityPath === pathname);
}
function withFreshOpenClawStateDatabaseReadOnly(operation, options, pathname) {
	const env = options.env ?? process.env;
	openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, env);
	if (synchronousReadSnapshots.currentAuthorityPath === pathname) {
		const maintained = withMaintenanceOpenClawStateDatabaseReadOnly(operation, pathname);
		if (maintained.reused) return maintained.value;
	}
	const readers = synchronousReadSnapshots.current;
	if (readers && requiresArtifactPreservingSnapshot(pathname)) {
		let opened = readers.get(pathname);
		if (!opened) {
			opened = openOpenClawStateReadOnlyLocation(pathname, prepareSqliteReadOnlyLocationSync(pathname));
			readers.set(pathname, opened);
		}
		assertStateReadSchema(opened.database.db, pathname);
		const result = operation(opened.database);
		if (isPromiseLike(result)) throw new SqliteCoordinatorError("SQLite metadata snapshot read must remain synchronous");
		return result;
	}
	return withOpenClawStateReadOnlyLocation(operation, pathname, (requiresArtifactPreservingSnapshot(pathname) ? prepareSqliteReadOnlyLocationSync(pathname) : void 0) ?? pathname, void 0, void 0, void 0, !isMainThread && !getOpenClawDatabaseMaintenanceScope());
}
/** Read existing shared state while preserving non-missing filesystem failures. */
function withExistingOpenClawStateDatabaseReadOnly(operation, options = {}) {
	const pathname = resolveReadOnlyPath(options);
	if (synchronousReadSnapshots.current?.has(pathname)) return withFreshOpenClawStateDatabaseReadOnly(operation, options, pathname);
	const reused = withOpenClawStateDatabaseReadOnlyIfOpen(operation, pathname);
	if (reused.reused) return reused.value;
	const existingPath = existingPathOrUndefined(pathname);
	return existingPath === void 0 ? void 0 : withFreshOpenClawStateDatabaseReadOnly(operation, options, existingPath);
}
function isStateReadReply(reply, type) {
	return reply.ok && reply.type === type;
}
/** Fixed reads observe committed state unless their owner explicitly selected a snapshot. */
function executeExistingOpenClawStateRead(options, command, readOptions = {}) {
	const type = command.type;
	const { context, current, live, mapError } = readOptions;
	const receipt = { phase: "before-read" };
	let completion;
	try {
		context?.admission.assertCurrent();
		const execute = () => startRetainedOpenClawStateRead(options, command, receipt, readOptions);
		const read = live ? () => artifactPreservingReads.run(false, () => stateSnapshotReads.exit(execute)) : current ? () => stateSnapshotReads.exit(execute) : execute;
		completion = context?.runInCapturedSchemaScope ? context.runInCapturedSchemaScope(read) : read();
	} catch (error) {
		throw mapError ? mapError(error, receipt.phase) : error;
	}
	return (completion.kind === "retained" ? completion.operation.result : completion.result).then((reply) => {
		if (!reply || isStateReadReply(reply, type)) return reply;
		throw new Error(`Unexpected shared-state read reply for ${type}`);
	});
}
function startRetainedOpenClawStateRead(options, command, receipt, { context: capturedContext, signal, current, live, mapError, preferIndependentWarmRead, snapshotPreparation, onChunk, onChunkAsync }) {
	const currentRead = current || live;
	const pathname = resolveReadOnlyPath(options);
	const inherited = stateSnapshotReads.getStore();
	const snapshot = inherited?.active && inherited.path === pathname ? inherited : void 0;
	const scopes = [...snapshot ? [snapshot] : [], ...(disposableStateReads.getStore() ?? []).filter((scope) => scope.active && scope.path === pathname)];
	const env = snapshot?.env ?? options.env;
	const context = capturedContext ?? captureOpenClawStateReadWorkerContext({
		path: pathname,
		env
	});
	if (capturedContext) {
		if (context.admission.databasePath !== pathname) throw new Error("Shared-state read context does not match its selected source");
		context.maintenanceScope?.assertAdmission();
		context.admission.assertCurrent();
	}
	const preserveArtifacts = requiresArtifactPreservingSnapshot(pathname);
	const controller = new AbortController();
	const readSignal = signal ? AbortSignal.any([signal, controller.signal]) : controller.signal;
	const run = () => {
		const inheritedSource = currentRead ? void 0 : synchronousReadSnapshots.current?.get(pathname)?.snapshotSource?.retain();
		return startOpenClawStateReadOperation(command, {
			pathname,
			snapshot: inheritedSource ?? snapshot,
			scopes,
			context,
			preserveArtifacts,
			preferIndependentWarmRead,
			snapshotPreparation,
			onChunk,
			onChunkAsync,
			controller,
			signal: readSignal,
			receipt,
			mapError
		});
	};
	const tracked = scopes.reduceRight((operation, scope) => () => scope.work.run(() => {
		const completion = operation();
		const result = completion.kind === "retained" ? completion.operation.result : completion.result;
		scope.work.track(() => result).catch(() => void 0);
		return completion;
	}), run);
	const maintenance = context.maintenanceScope;
	let completion;
	if (maintenance) maintenance.run(() => {
		const accepted = tracked();
		completion = accepted;
		return accepted.kind === "retained" ? accepted.operation.result : accepted.result;
	});
	else completion = tracked();
	if (!completion) throw new Error("Shared-state read maintenance scope did not start its operation");
	const result = completion.kind === "retained" ? completion.operation.result : completion.result;
	retainSnapshotWork(result, () => controller.abort(/* @__PURE__ */ new Error("Shared-state read admission closed")));
	return completion;
}
/** Read existing shared state without creating or updating its SQLite sidecars. */
function withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(operation, options = {}, openStateSchemaReadAdmission) {
	if (openStateSchemaReadAdmission) return withExistingOpenClawStateDatabaseCurrentReadOnly(operation, options, openStateSchemaReadAdmission);
	return withArtifactPreservingStateReads(() => withExistingOpenClawStateDatabaseReadOnly(operation, options));
}
/** Publication guards need current rows, never an inherited discovery snapshot. */
function withExistingOpenClawStateDatabaseCurrentReadOnly(operation, options = {}, openStateSchemaReadAdmission) {
	const pathname = resolveReadOnlyPath(options);
	return stateSnapshotReads.exit(() => {
		if (!openStateSchemaReadAdmission) {
			const reused = withOpenClawStateDatabaseReadOnlyIfOpen(operation, pathname, true);
			if (reused.reused) return reused.value;
		}
		if (existingPathOrUndefined(pathname) === void 0) return;
		openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, options.env ?? process.env);
		const directRead = (isStatePostgres() || options.allowNativeRead) && !isArtifactPreservingStateRead() && !openStateSchemaReadAdmission;
		if (!directRead);
		return withOpenClawStateReadOnlyLocation(operation, pathname, directRead ? pathname : prepareSqliteReadOnlyLocationSync(pathname), openStateSchemaReadAdmission);
	});
}
//#endregion
//#region src/config/model-policy-allowlist-migration.ts
/** A per-agent policy replaces inherited defaults only when it owns `allow`. */
function hasExplicitModelPolicyAllow(value) {
	return isRecord(value) && Object.hasOwn(value, "allow");
}
Object.freeze([
	"activity",
	"agents",
	"ai-agents",
	"appearance",
	"approve",
	"apps",
	"ask",
	"automation",
	"automations",
	"channels",
	"chat",
	"communications",
	"config",
	"cron",
	"custodian",
	"dashboard",
	"dashboards",
	"debug",
	"focus",
	"infrastructure",
	"lobsterdex",
	"logs",
	"mcp",
	"meetings",
	"memory-import",
	"model-providers",
	"model-setup",
	"new",
	"nodes",
	"plugin",
	"plugins",
	"portals",
	"profile",
	"sessions",
	"settings",
	"share",
	"skills",
	"systems",
	"terminal",
	"usage",
	"workboard",
	"worktrees"
]);
//#endregion
//#region src/routing/session-key.ts
/** Legacy on-disk identity used only by doctor/migration and their fixtures. */
const LEGACY_IMPLICIT_AGENT_ID = "main";
resolveGlobalMap(Symbol.for("openclaw.agentDirPreparedPaths"), (paths) => {
	for (const prepared of paths.values()) prepared.close();
	paths.clear();
}, "shared-state");
//#endregion
//#region src/agents/agent-roster.ts
function collectAgentEntries(cfg, withSource, limit) {
	const roster = readAgentRosterProperty(cfg);
	if (roster?.kind === "entries" && isRecord(roster.value)) {
		const result = [];
		for (const id in roster.value) {
			if (!Object.hasOwn(roster.value, id)) continue;
			const entry = roster.value[id];
			if (isRecord(entry)) {
				const projected = {
					...entry,
					id
				};
				result.push(withSource ? {
					entry: projected,
					source: {
						kind: "entries",
						key: id
					}
				} : projected);
				if (result.length === limit) break;
			}
		}
		return result;
	}
	if (roster?.kind !== "list" || !Array.isArray(roster.value)) return [];
	const listed = [];
	roster.value.some((entry, index) => {
		if (entry !== null && typeof entry === "object") listed.push({
			entry,
			source: {
				kind: "list",
				index
			}
		});
		return listed.length === limit;
	});
	return withSource ? listed : listed.map(({ entry }) => entry);
}
/** Lists valid configured agent entries from config. */
function listAgentEntriesWithSource(cfg) {
	return collectAgentEntries(cfg, true);
}
/** Lists valid configured agent entries from either supported representation. */
function listAgentEntries(cfg) {
	return collectAgentEntries(cfg, false);
}
/** Reads the explicitly owned raw roster without normalizing malformed values. */
function readAgentRosterProperty(raw) {
	if (!isRecord(raw)) return;
	const agents = raw.agents;
	if (!isRecord(agents)) return;
	for (const kind of ["entries", "list"]) {
		const value = agents[kind];
		if (Object.hasOwn(agents, kind) && value !== void 0) return {
			kind,
			value
		};
	}
}
/** True when raw config explicitly owns either supported roster representation. */
function hasAgentRosterProperty(raw) {
	return readAgentRosterProperty(raw) !== void 0;
}
/** Lists unique configured agent ids. */
function listAgentIds(cfg) {
	const agents = listAgentEntries(cfg);
	if (agents.length === 0 && !hasAgentRosterProperty(cfg)) return [LEGACY_IMPLICIT_AGENT_ID];
	return [...new Set(agents.map((entry) => normalizeAgentId(entry?.id)))];
}
function tryResolveSoleAgentId(cfg) {
	const agents = collectAgentEntries(cfg, false, 2);
	if (agents.length === 0) {
		if (!hasAgentRosterProperty(cfg)) return LEGACY_IMPLICIT_AGENT_ID;
		return;
	}
	return agents.length === 1 ? normalizeAgentId(agents[0].id) : void 0;
}
function tryResolveRawLegacyDefaultAgentId(cfg) {
	if (cfg.agents?.ownership === "explicit") return;
	const marked = collectAgentEntries(cfg, false).filter((entry) => entry.default === true);
	return marked.length === 1 ? normalizeAgentId(marked[0].id) : void 0;
}
/** @deprecated Use tryResolveSoleAgentId; accepts raw shipped markers only for input compatibility. */
function tryResolveDefaultAgentId(cfg) {
	return tryResolveRawLegacyDefaultAgentId(cfg) ?? tryResolveSoleAgentId(cfg);
}
/** Preserves legacy data locators independently of the configured runtime owner. */
function tryResolveLegacyDataOwner(cfg) {
	return tryResolveDefaultAgentId(cfg);
}
//#endregion
//#region src/agents/workspace-default-path.ts
function resolveDefaultAgentWorkspaceDir(env = process.env, homedir = os.homedir) {
	const workspaceDir = env.OPENCLAW_WORKSPACE_DIR?.trim();
	if (workspaceDir) return path.resolve(workspaceDir);
	if (env.OPENCLAW_STATE_DIR?.trim()) return path.join(resolveStateDir(env, homedir), "workspace");
	const home = resolveRequiredHomeDir(env, homedir);
	const profile = env.OPENCLAW_PROFILE?.trim();
	if (profile && normalizeOptionalLowercaseString(profile) !== "default") return path.join(resolveProfileStateDir(profile, env, homedir), "workspace");
	return path.join(home, ".openclaw", "workspace");
}
resolveDefaultAgentWorkspaceDir();
//#endregion
//#region src/agents/agent-scope-config.ts
/** Resolves configured agent ids, directories, workspaces, and merged agent defaults. */
/** Strip null bytes from paths to prevent ENOTDIR errors. */
function stripNullBytes(s) {
	return s.replaceAll("\0", "");
}
let activeAgentRosterFactsBatch;
const agentRosterFacts = /* @__PURE__ */ new WeakMap();
function readAgentRosterFacts(cfg) {
	if (void 0 === cfg) return activeAgentRosterFactsBatch.facts;
	const current = runtimeConfigPublication.current;
	const publication = current?.config === cfg ? current.revision : void 0;
	if (publication === void 0 && !isDeeplyFrozenPlainData(cfg)) return;
	let cached = agentRosterFacts.get(cfg);
	if (!cached || cached.publication !== publication) {
		cached = {
			publication,
			facts: {}
		};
		agentRosterFacts.set(cfg, cached);
	}
	return cached.facts;
}
/** Preserves legacy data locators independently of the configured runtime owner. */
function tryResolveLegacyDataOwnerAgentId(cfg) {
	const facts = readAgentRosterFacts(cfg);
	if (facts?.legacyDataOwnerAgentId) return facts.legacyDataOwnerAgentId.value;
	const value = tryResolveLegacyDataOwner(cfg);
	if (facts) facts.legacyDataOwnerAgentId = { value };
	return value;
}
function resolveAgentEntry(cfg, agentId) {
	const id = normalizeAgentId(agentId);
	const facts = readAgentRosterFacts(cfg);
	if (facts) {
		const found = (facts.entryByNormalizedId ??= buildAgentEntryIndex(cfg)).get(id);
		return found ? found.clone ? { ...found.entry } : found.entry : void 0;
	}
	const roster = readAgentRosterProperty(cfg);
	if (roster?.kind === "entries" && isRecord(roster.value)) {
		const entries = roster.value;
		for (const key in entries) {
			if (!Object.hasOwn(entries, key)) continue;
			const entry = entries[key];
			if (isRecord(entry) && normalizeAgentId(key) === id) return {
				...entry,
				id: key
			};
		}
		return;
	}
	if (roster?.kind === "list" && Array.isArray(roster.value)) return roster.value.find((entry) => entry !== null && typeof entry === "object" && normalizeAgentId(entry.id) === id);
}
/**
* First-match index over the projected roster for batch point lookups.
*
* Keyed entries must stay clone-on-read (callers may mutate the returned
* entry); list entries keep the original object, matching the direct
* traversal semantics of `resolveAgentEntry` outside a batch.
*/
function buildAgentEntryIndex(cfg) {
	const index = /* @__PURE__ */ new Map();
	for (const { entry, source } of listAgentEntriesWithSource(cfg)) {
		const normalizedId = normalizeAgentId(entry?.id);
		if (!index.has(normalizedId)) index.set(normalizedId, {
			clone: source.kind === "entries",
			entry
		});
	}
	return index;
}
/** Resolves merged config for one agent id. */
function resolveAgentConfig(cfg, agentId) {
	const id = normalizeAgentId(agentId);
	const entry = resolveAgentEntry(cfg, id) ?? (!hasAgentRosterProperty(cfg) && id === "main" ? { id } : void 0);
	if (!entry) return;
	const agentDefaults = cfg.agents?.defaults;
	return {
		name: readStringValue(entry.name),
		workspace: readStringValue(entry.workspace),
		agentDir: readStringValue(entry.agentDir),
		model: typeof entry.model === "string" || entry.model && typeof entry.model === "object" ? entry.model : void 0,
		...entry.models ? { models: entry.models } : {},
		...entry.params ? { params: entry.params } : {},
		...entry.runtime ? { runtime: entry.runtime } : {},
		...hasExplicitModelPolicyAllow(entry.modelPolicy) ? { modelPolicy: entry.modelPolicy } : {},
		utilityModel: readStringValue(entry.utilityModel),
		decisionModel: readStringValue(entry.decisionModel),
		thinkingDefault: entry.thinkingDefault,
		verboseDefault: entry.verboseDefault ?? agentDefaults?.verboseDefault,
		toolProgressDetail: entry.toolProgressDetail ?? agentDefaults?.toolProgressDetail,
		reasoningDefault: entry.reasoningDefault,
		fastModeDefault: entry.fastModeDefault ?? agentDefaults?.fastModeDefault,
		contextInjection: entry.contextInjection,
		bootstrapMaxChars: entry.bootstrapMaxChars,
		bootstrapTotalMaxChars: entry.bootstrapTotalMaxChars,
		experimental: typeof entry.experimental === "object" && entry.experimental ? {
			...agentDefaults?.experimental,
			...entry.experimental
		} : agentDefaults?.experimental,
		skills: Array.isArray(entry.skills) ? entry.skills : void 0,
		memory: entry.memory,
		humanDelay: entry.humanDelay,
		typingMode: entry.typingMode ?? agentDefaults?.typingMode,
		tts: entry.tts,
		contextLimits: typeof entry.contextLimits === "object" && entry.contextLimits ? {
			...agentDefaults?.contextLimits,
			...entry.contextLimits
		} : agentDefaults?.contextLimits,
		heartbeat: entry.heartbeat,
		identity: entry.identity,
		groupChat: entry.groupChat,
		subagents: typeof entry.subagents === "object" && entry.subagents ? entry.subagents : void 0,
		embeddedAgent: typeof entry.embeddedAgent === "object" && entry.embeddedAgent ? entry.embeddedAgent : void 0,
		sandbox: entry.sandbox,
		tools: entry.tools
	};
}
function resolveAgentWorkspaceDir(cfg, agentId, env = process.env) {
	const id = normalizeAgentId(agentId);
	const configured = resolveAgentConfig(cfg, id)?.workspace?.trim();
	if (configured) return stripNullBytes(resolveUserPath(configured, env));
	const inheritedWorkspaceAgentId = tryResolveLegacyDataOwnerAgentId(cfg);
	const fallback = cfg.agents?.defaults?.workspace?.trim();
	if (inheritedWorkspaceAgentId && id === inheritedWorkspaceAgentId) {
		if (fallback) return stripNullBytes(resolveUserPath(fallback, env));
		return stripNullBytes(resolveDefaultAgentWorkspaceDir(env));
	}
	if (fallback) return stripNullBytes(path.join(resolveUserPath(fallback, env), id));
	const stateDir = resolveStateDir(env);
	return stripNullBytes(path.join(stateDir, `workspace-${id}`));
}
function resolveEffectiveAgentDir(cfg, agentId, deps) {
	const id = normalizeAgentId(agentId);
	const configured = resolveAgentConfig(cfg, id)?.agentDir?.trim();
	const env = deps?.env ?? process.env;
	return configured ? resolveUserPath(configured, env, deps?.homedir) : path.join(resolveStateDir(env, deps?.homedir), "agents", id, "agent");
}
function resolveConcreteSessionStorePath(storePath) {
	const trimmed = storePath?.trim();
	if (!trimmed || trimmed === "(multiple)" || trimmed.includes("{agentId}")) return;
	return trimmed;
}
/** Resolves only the legacy unsuffixed target, without reading ownership state. */
function resolveUnsuffixedSqliteTargetFromSessionStorePath(storePath) {
	const concrete = resolveConcreteSessionStorePath(storePath);
	if (!concrete) throw new Error("Session storage requires a concrete store path");
	const resolved = path.resolve(concrete);
	if (resolved.endsWith(".sqlite")) {
		const agentId = resolveAgentIdFromSqliteDatabasePath(resolved);
		return {
			path: resolved,
			...agentId ? { agentId } : { shared: true }
		};
	}
	const sessionsDir = path.dirname(resolved);
	if (path.basename(resolved) !== "sessions.json") {
		const sqliteBaseName = path.basename(resolved, path.extname(resolved)) || "openclaw-agent";
		return { path: path.join(sessionsDir, `${sqliteBaseName}.sqlite`) };
	}
	if (path.basename(sessionsDir) !== "sessions") return { path: path.join(sessionsDir, "openclaw-agent.sqlite") };
	const agentDir = path.dirname(sessionsDir);
	if (path.basename(path.dirname(agentDir)) !== "agents") return { path: path.join(sessionsDir, "openclaw-agent.sqlite") };
	return {
		agentId: normalizeAgentId(path.basename(agentDir)),
		path: path.join(agentDir, "agent", "openclaw-agent.sqlite")
	};
}
/** List inspection candidates without opening stores or assigning writable ownership. */
function listSqliteTargetCandidatePathsForSessionStorePath(storePath, agentId) {
	const unsuffixedTarget = resolveUnsuffixedSqliteTargetFromSessionStorePath(storePath);
	if (unsuffixedTarget.agentId || unsuffixedTarget.shared) return [unsuffixedTarget.path];
	const directory = path.dirname(unsuffixedTarget.path);
	const baseName = path.basename(unsuffixedTarget.path, ".sqlite");
	const prefix = agentId ? `${baseName}.${normalizeAgentId(agentId)}` : void 0;
	const candidateNames = /* @__PURE__ */ new Set([path.basename(unsuffixedTarget.path)]);
	try {
		for (const fileName of readdirSync(directory)) {
			const databaseName = fileName.replace(/-(?:wal|shm|journal)$/u, "");
			if (databaseName.startsWith(`${baseName}.`) && databaseName.endsWith(".sqlite") && (!prefix || parseSqliteTargetSuffixIndex(databaseName, prefix) !== void 0)) candidateNames.add(databaseName);
		}
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
	}
	return [...candidateNames].map((fileName) => path.join(directory, fileName));
}
function parseSqliteTargetSuffixIndex(fileName, prefix) {
	if (fileName === `${prefix}.sqlite`) return 1;
	if (!fileName.startsWith(`${prefix}.`) || !fileName.endsWith(".sqlite")) return;
	const rawValue = fileName.slice(prefix.length + 1, -7);
	if (!/^[1-9]\d*$/.test(rawValue)) return;
	const value = Number(rawValue);
	return Number.isSafeInteger(value) && value >= 2 && String(value) === rawValue ? value : void 0;
}
/** Extracts the agent id from the canonical per-agent SQLite database path. */
function resolveAgentIdFromSqliteDatabasePath(databasePath) {
	if (path.basename(databasePath) !== "openclaw-agent.sqlite") return;
	const agentDbDir = path.dirname(databasePath);
	if (path.basename(agentDbDir) !== "agent") return;
	const agentDir = path.dirname(agentDbDir);
	if (path.basename(path.dirname(agentDir)) !== "agents") return;
	return normalizeAgentId(path.basename(agentDir));
}
//#endregion
//#region src/config/sessions/paths.ts
function resolveSessionTranscriptsDirForAgent(agentId, env = process.env, homedir = () => resolveRequiredHomeDir(env, os.homedir)) {
	if (!agentId?.trim()) throw new Error("Session storage path requires an explicit agent id.");
	const root = resolveStateDir(env, homedir);
	const id = normalizeAgentId(agentId);
	return path.join(root, "agents", id, "sessions");
}
var SessionStoreAgentIdRequiredError = class extends Error {
	constructor() {
		super("Session store path requires an explicit agent id.");
		this.name = "SessionStoreAgentIdRequiredError";
	}
};
/** Resolves fixed literal paths without an owner; derived or templated paths require agentId. */
function resolveSessionStorePathCore(store, opts) {
	const env = opts?.env ?? process.env;
	const homedir = () => resolveRequiredHomeDir(env, os.homedir);
	if (!store) {
		if (!opts?.agentId?.trim()) throw new SessionStoreAgentIdRequiredError();
		const agentId = normalizeAgentId(opts.agentId);
		return path.join(resolveSessionTranscriptsDirForAgent(agentId, env, homedir), "sessions.json");
	}
	let expandedStore = store;
	if (expandedStore.includes("{agentId}")) {
		if (!opts?.agentId?.trim()) throw new SessionStoreAgentIdRequiredError();
		const agentId = normalizeAgentId(opts.agentId);
		expandedStore = expandedStore.replaceAll("{agentId}", agentId);
	}
	if (expandedStore.startsWith("~")) expandedStore = expandHomePrefix(expandedStore, {
		home: resolveRequiredHomeDir(env, homedir),
		env,
		homedir
	});
	return path.isAbsolute(expandedStore) ? path.resolve(expandedStore) : path.resolve(resolveStateDir(env, homedir), expandedStore);
}
//#endregion
//#region src/config/sessions/targets-configured-agents.ts
/** Lists agent ids whose session stores should be considered configured. */
function listConfiguredSessionStoreAgentIds(cfg) {
	const ids = new Set(listAgentIds(cfg).map((agentId) => normalizeAgentId(agentId)));
	const addAcpAgentId = (agentId) => {
		const raw = agentId?.trim() ?? "";
		if (!raw || raw === "*") return;
		ids.add(normalizeAgentId(raw));
	};
	addAcpAgentId(cfg.acp?.defaultAgent);
	for (const agentId of cfg.acp?.allowedAgents ?? []) addAcpAgentId(agentId);
	for (const agent of listAgentEntries(cfg)) if (agent.runtime?.type === "acp") addAcpAgentId(agent.runtime.acp?.agent ?? agent.id);
	return [...ids];
}
//#endregion
//#region src/config/agent-store-source.ts
/** Inspect authored SQLite locators without runtime config, plugin loading, or state access. */
function readAgentStorePathsFromConfig(env, stateDir) {
	const readEnv = cloneEnvWithPlatformSemantics(env);
	readEnv.OPENCLAW_STATE_DIR = stateDir;
	const configPath = resolveConfigPath(readEnv, stateDir);
	let raw = "{}";
	try {
		raw = fsSync.readFileSync(configPath, "utf8");
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
	}
	const parsed = parseConfigJson5(raw);
	if (!parsed.ok) throw new Error(`Cannot parse agent storage configuration at ${configPath}.`);
	const deps = normalizeConfigIoDeps({
		env: readEnv,
		configPath,
		observe: false
	});
	const source = resolveConfigIncludesForRead(parsed.parsed, configPath, deps);
	if (!isRecord(source) || ["agents", "session"].some((key) => source[key] !== void 0 && !isRecord(source[key]))) throw new Error(`Invalid agent storage configuration at ${configPath}.`);
	const roster = readAgentRosterProperty(source);
	const hasValidStorageLocator = (entry) => isRecord(entry) && (entry.agentDir === void 0 || typeof entry.agentDir === "string");
	if (roster && (roster.kind === "entries" ? !isRecord(roster.value) || Object.values(roster.value).some((entry) => !hasValidStorageLocator(entry)) : !Array.isArray(roster.value) || roster.value.some((entry) => !hasValidStorageLocator(entry) || typeof entry.id !== "string"))) throw new Error(`Invalid agent roster at ${configPath}.`);
	if (isRecord(source.session) && source.session.store !== void 0 && typeof source.session.store !== "string") throw new Error(`Invalid session storage configuration at ${configPath}.`);
	const resolved = resolveConfigForRead(source, readEnv);
	if (resolved.envWarnings.some((warning) => warning.configPath === "session.store" || warning.configPath.endsWith(".agentDir") || warning.configPath.startsWith("agents.list[") && warning.configPath.endsWith(".id") || warning.configPath === "acp.defaultAgent" || warning.configPath.startsWith("acp.allowedAgents") || warning.configPath.endsWith(".runtime.type") || warning.configPath.endsWith(".runtime.acp.agent"))) throw new Error(`Unresolved environment reference in agent storage configuration at ${configPath}.`);
	const config = coerceConfig(resolved.resolvedConfigRaw);
	const agentIds = listAgentIds(config);
	const paths = new Set(agentIds.map((agentId) => path.join(resolveEffectiveAgentDir(config, agentId, { env: readEnv }), "openclaw-agent.sqlite")));
	const stores = new Set(listConfiguredSessionStoreAgentIds(config).map((agentId) => resolveSessionStorePathCore(config.session?.store, {
		agentId,
		env: readEnv
	})));
	for (const store of stores) for (const candidate of listSqliteTargetCandidatePathsForSessionStorePath(store)) paths.add(candidate);
	for (const directory of [readEnv.OPENCLAW_AGENT_DIR, readEnv.PI_CODING_AGENT_DIR]) if (directory?.trim()) paths.add(path.join(resolveUserPath(directory, readEnv), "openclaw-agent.sqlite"));
	return [...paths];
}
//#endregion
//#region src/state/openclaw-agent-db-discovery-paths.ts
/** Recovery also inventories disk collisions at the reserved incognito filename. */
function resolveOpenClawAgentDatabaseDiscoveryPaths(params) {
	return [resolveOpenClawAgentSqlitePath(params), resolveIncognitoOpenClawAgentSqlitePath(params)].map((pathname) => path.join(params.agentDir, path.basename(pathname)));
}
//#endregion
//#region src/state/openclaw-state-db-initialization.ts
/** Capture deletion-history evidence before a native open can create the shared database. */
function prepareStateDatabaseInitialization(pathname, env, initializationAgentPaths = []) {
	try {
		if (resolveSqliteDatabaseFilePaths(resolveQuarantineStorePath(env)).some((file) => fsSync.lstatSync(file, { throwIfNoEntry: false }))) return { kind: "existing" };
		const stateDir = resolveOpenClawStateDirForDatabasePath(pathname);
		const candidates = /* @__PURE__ */ new Set([...initializationAgentPaths, ...readAgentStorePathsFromConfig(env, stateDir)]);
		const agentsDir = path.join(stateDir, "agents");
		if (fsSync.lstatSync(agentsDir, { throwIfNoEntry: false })?.isSymbolicLink()) return { kind: "unavailable" };
		let entries = [];
		try {
			entries = fsSync.readdirSync(agentsDir, { withFileTypes: true });
		} catch (error) {
			if (!hasErrnoCode(error, "ENOENT")) throw error;
		}
		for (const entry of entries) {
			if (!entry.isDirectory() && !entry.isSymbolicLink()) continue;
			const agentDir = path.join(agentsDir, entry.name, "agent");
			if (entry.isSymbolicLink() || fsSync.lstatSync(agentDir, { throwIfNoEntry: false })?.isSymbolicLink()) return { kind: "unavailable" };
			for (const candidate of resolveOpenClawAgentDatabaseDiscoveryPaths({
				agentDir,
				agentId: entry.name,
				env
			})) candidates.add(candidate);
		}
		for (const candidate of candidates) {
			const family = resolveSqliteDatabaseFilePaths(candidate);
			const main = fsSync.lstatSync(candidate, { throwIfNoEntry: false });
			if (main && (!main.isFile() || main.size > 0) || family.slice(1).some((file) => fsSync.lstatSync(file, { throwIfNoEntry: false }))) return { kind: "existing" };
		}
		if (resolveSqliteDatabaseFilePaths(pathname).some((file) => fsSync.lstatSync(file, { throwIfNoEntry: false }))) return {
			kind: "existing",
			nativeBootstrapEligible: true
		};
		return { kind: "fresh" };
	} catch {
		return { kind: "unavailable" };
	}
}
//#endregion
//#region src/infra/dedupe.ts
/** Creates a bounded in-memory dedupe cache with optional TTL expiry. */
function createDedupeCache(options) {
	const ttlMs = resolveNonNegativeIntegerOption(options.ttlMs, 0);
	const maxSize = resolveNonNegativeIntegerOption(options.maxSize, 0);
	const cache = /* @__PURE__ */ new Map();
	let oldestRecordedAt = Number.POSITIVE_INFINITY;
	let newestRecordedAt = Number.NEGATIVE_INFINITY;
	let timestampsOrdered = true;
	const prune = (now) => {
		const cutoff = ttlMs > 0 ? now - ttlMs : void 0;
		if (cutoff !== void 0 && cutoff >= oldestRecordedAt) {
			oldestRecordedAt = Number.POSITIVE_INFINITY;
			for (const [entryKey, entry] of cache) if (entry.recordedAt <= cutoff) cache.delete(entryKey);
			else if (entry.recordedAt < oldestRecordedAt) {
				oldestRecordedAt = entry.recordedAt;
				if (timestampsOrdered) break;
			}
		}
		if (maxSize <= 0) {
			cache.clear();
			oldestRecordedAt = Number.POSITIVE_INFINITY;
			return;
		}
		pruneMapToMaxSize(cache, maxSize);
	};
	const hasUnexpired = (key, now, touchOnRead) => {
		const existing = cache.get(key);
		if (!existing) return false;
		if (ttlMs > 0 && now - existing.recordedAt >= ttlMs) {
			cache.delete(key);
			return false;
		}
		if (touchOnRead) {
			existing.recordedAt = now;
			cache.delete(key);
			cache.set(key, existing);
		}
		return true;
	};
	return {
		check: (key, now, ownerToken) => {
			if (!key) return false;
			const checkedAt = now ?? Date.now();
			if (ttlMs > 0) {
				if (checkedAt < oldestRecordedAt) oldestRecordedAt = checkedAt;
				if (timestampsOrdered) {
					timestampsOrdered = checkedAt >= newestRecordedAt;
					newestRecordedAt = checkedAt;
				}
			}
			if (hasUnexpired(key, checkedAt, true)) return true;
			cache.set(key, {
				recordedAt: checkedAt,
				...ownerToken ? { ownerToken } : {}
			});
			prune(checkedAt);
			return false;
		},
		peek: (key, now = Date.now()) => {
			if (!key) return false;
			return hasUnexpired(key, now, false);
		},
		delete: (key, ownerToken) => {
			if (!key) return;
			if (ownerToken && cache.get(key)?.ownerToken !== ownerToken) return;
			cache.delete(key);
		},
		clear: () => {
			cache.clear();
			oldestRecordedAt = Number.POSITIVE_INFINITY;
			newestRecordedAt = Number.NEGATIVE_INFINITY;
			timestampsOrdered = true;
		},
		size: () => cache.size
	};
}
//#endregion
//#region src/state/openclaw-state-db-permissions.ts
const OPENCLAW_STATE_DIR_MODE = 448;
const OPENCLAW_STATE_FILE_MODE = 384;
const stateDbLog$2 = createSubsystemLogger("state/db");
/** Targets already warned about, so chmod-less filesystems warn once per path. */
const chmodWarnedTargets = createDedupeCache({
	ttlMs: 0,
	maxSize: 4096
});
function bestEffortChmodSync(target, mode) {
	const result = applyPrivateModeSync(target, mode);
	if (result.applied || chmodWarnedTargets.check(target)) return;
	stateDbLog$2.warn(`skipped permission hardening for ${target}: ${String(result.error)}`);
}
function ensureOpenClawStatePermissions(pathname, env, options = {}) {
	const dir = path.dirname(pathname);
	const defaultDir = resolveOpenClawStateSqliteDir(env);
	const isDefaultStateDatabase = path.resolve(pathname) === path.resolve(resolveOpenClawStateSqlitePath(env));
	if (isDefaultStateDatabase && dir !== defaultDir) throw new Error(`OpenClaw state database path resolved outside its state dir: ${pathname}`);
	const dirExisted = existsSync(dir);
	if (options.createDirectory) mkdirSync(dir, {
		recursive: true,
		mode: OPENCLAW_STATE_DIR_MODE
	});
	if (isDefaultStateDatabase || !dirExisted) bestEffortChmodSync(dir, OPENCLAW_STATE_DIR_MODE);
	for (const candidate of resolveSqliteDatabaseFilePaths(pathname)) if (existsSync(candidate)) try {
		bestEffortChmodSync(candidate, OPENCLAW_STATE_FILE_MODE);
	} catch (error) {
		if (candidate === pathname || !hasErrnoCode(error, "ENOENT")) throw error;
	}
}
//#endregion
//#region src/state/openclaw-state-db-open.ts
const stateDbLog$1 = createSubsystemLogger("state/db");
function assertStateDatabaseIntegrityBeforeMutation(database, pathname) {
	if (getStateRuntimeSchemaAdmission(database)) return;
	const contentVersion = readStateSchemaContentVersion(database);
	if (contentVersion === 22) return;
	const hasApplicationSchema = database.prepare("SELECT 1 FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' LIMIT 1").get();
	if (contentVersion === 0 && hasApplicationSchema || contentVersion > 0 && contentVersion < 22) stateDbLog$1.info("state database schema migration pending; verifying integrity first", {
		fromVersion: contentVersion,
		path: pathname,
		toVersion: 22
	});
	assertStateDatabaseIntegrityOnce(database, pathname);
}
function openUnpublishedStateDatabase(params) {
	const open = (schemaOwned) => {
		const existingIdentity = getSqliteWorkerExistingDatabaseIdentity(params.pathname);
		const original = params.existingSchema || existingIdentity ? statSync(params.pathname, { bigint: true }) : statSync(params.pathname, {
			bigint: true,
			throwIfNoEntry: false
		});
		if (existingIdentity && (!original || `file:${original.dev}:${original.ino}` !== existingIdentity)) throw new Error("SQLite database file identity changed before existing-only open");
		if (!original && !schemaOwned) return withStateDatabaseSchemaMaintenance({
			databasePath: params.pathname,
			busyTimeoutMs: params.busyTimeoutMs
		}, () => open(true));
		if (original && !original.isFile()) throw new Error(`Existing shared-state database must be a regular file: ${params.pathname}`);
		const initialization = prepareStateDatabaseInitialization(params.pathname, params.env, params.initializationAgentPaths);
		if (!original) {
			quarantineOrphanedSqliteSidecars(params.pathname);
			ensureOpenClawStatePermissions(params.pathname, params.env, { createDirectory: true });
			prepareSqliteDatabaseDirectory(params.pathname);
		}
		return openNativeStateDatabase(params, initialization, original);
	};
	return open(false);
}
function openNativeStateDatabase(params, initialization, original) {
	const { busyTimeoutMs, lockFailureReporting } = params;
	const assertSameFile = () => {
		if (original) {
			const current = statSync(params.pathname, { bigint: true });
			if (!current.isFile() || current.dev !== original.dev || current.ino !== original.ino || readDatabaseIdentityBirthtime(current) !== readDatabaseIdentityBirthtime(original)) throw new Error(`Existing shared-state database generation changed: ${params.pathname}`);
		}
	};
	const db = openTrackedStateDatabase(params.pathname, {
		existingOnly: original !== void 0,
		expectedIdentity: original ? `file:${original.dev}:${original.ino}` : void 0
	});
	let walMaintenance;
	let selected = db;
	let sqlite;
	try {
		assertSameFile();
		enableNodeSqliteKyselyStatementCache(db);
		setSqliteBusyTimeout(db, busyTimeoutMs);
		admitStateSchemaFacts(db, params.pathname);
		selected = openEngineStore({
			anchor: db,
			schema: stateEngineSchema,
			input: void 0,
			existingOnly: params.existingSchema,
			inspectSqlite: () => inspectStateSqlite(db),
			prepareAnchor: () => {},
			admitPostgres: admitStatePostgres,
			closeOnFailure: (connection, error) => {
				selected = connection;
				throw error;
			},
			openSqlite: () => {
				assertOpenClawStateWriteAllowed({
					database: db,
					databasePath: params.pathname,
					env: params.env
				});
				if (params.existingSchema) {
					assertSameFile();
					params.ensureSchema(db, initialization);
					assertSameFile();
					sqlite = {
						db,
						path: params.pathname,
						walMaintenance: {
							checkpoint: () => false,
							stop: async () => {},
							close: () => true,
							reclaimFreePages: createSqliteWalReclamationResult
						}
					};
					return;
				}
				ensureOpenClawStatePermissions(params.pathname, params.env);
				const maintenance = runWithSqliteBusyTimeout(db, busyTimeoutMs, () => {
					assertSupportedStateSchemaVersion(db, params.pathname);
					assertStateDatabaseIntegrityBeforeMutation(db, params.pathname);
					configureSqlitePreSchemaPragmas(db, { busyTimeoutMs });
					walMaintenance = configureSqliteConnectionPragmas(db, {
						busyTimeoutMs,
						databaseLabel: "openclaw-state",
						databasePath: params.pathname,
						onCheckpointError: (error) => stateDbLog$1.warn("Shared-state WAL maintenance failed", {
							error: formatErrorMessage(error),
							path: params.pathname,
							checkpoint: walMaintenance?.health
						}),
						runMaintenance: (operation) => {
							try {
								assertStateDatabaseAccessAllowed(params.pathname);
							} catch (error) {
								if (!(error instanceof StateDatabaseAdmissionPendingError) && !(error instanceof StateDatabaseOfflineMaintenanceError)) throw error;
								stateDbLog$1.debug("Shared-state WAL maintenance deferred during offline maintenance", { path: params.pathname });
								return false;
							}
							return operation();
						},
						isScheduledMaintenanceSuspended: captureSqliteWorkerWalMaintenanceSuspension(),
						foreignKeys: true,
						synchronous: "NORMAL"
					});
					params.ensureSchema(db, initialization);
					return walMaintenance;
				}, { lockFailureReporting });
				ensureOpenClawStatePermissions(params.pathname, params.env);
				assertSameFile();
				sqlite = {
					db,
					path: params.pathname,
					walMaintenance: maintenance
				};
			}
		});
		if (sqlite) return sqlite;
		assertOpenClawStateWriteAllowed({
			database: selected,
			databasePath: params.pathname,
			env: params.env
		});
		return {
			db: selected,
			path: params.pathname,
			walMaintenance: {
				checkpoint: () => false,
				stop: async () => {},
				close: () => true,
				reclaimFreePages: createSqliteWalReclamationResult
			}
		};
	} catch (error) {
		const errors = openClawStateDatabaseCache.closeUnpublishedOpenClawStateDatabaseHandle({
			db: selected,
			path: params.pathname,
			walMaintenance
		});
		if (error instanceof Error && (isSqliteSchemaVersionError(error) || isTerminalSqliteIntegrityError(error))) params.recordOpenFailure(params.pathname, error);
		if (errors.length > 0) throw createSqliteLifecycleAggregateError([error, ...errors], `OpenClaw state database acquisition and cleanup failed for ${params.pathname}.`, error);
		throw error;
	}
}
//#endregion
//#region src/infra/sqlite-index-schema.ts
const SQLITE_IDENTIFIER_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/u;
/**
* Restore every named index when SQLite's IF NOT EXISTS semantics preserve a
* same-name definition that no longer matches the committed schema.
*/
function repairCanonicalSqliteIndexes(db, databaseLabel, schemaSql, options = {}) {
	const indexes = getCanonicalSqliteNamedIndexContracts(schemaSql);
	const indexesByTable = /* @__PURE__ */ new Map();
	for (const index of indexes) {
		assertSqliteIdentifier(index.name);
		assertSqliteIdentifier(index.tableName);
		const tableIndexes = indexesByTable.get(index.tableName) ?? [];
		tableIndexes.push(index);
		indexesByTable.set(index.tableName, tableIndexes);
	}
	const repairIndexes = /* @__PURE__ */ new Set();
	runSqliteSchemaReadSnapshotSync(db, () => {
		const readTable = createSqliteTableContractReader(db);
		for (const tableName of getCanonicalSqliteTableNames(schemaSql)) {
			assertSqliteIdentifier(tableName);
			const table = readTable(tableName);
			if (!table) continue;
			const tableIndexes = indexesByTable.get(tableName) ?? [];
			const canonicalIndexNames = new Set(tableIndexes.map((index) => index.name));
			const actualIndexes = table.indexes;
			const unexpected = actualIndexes.find((index) => index.unique === 1 && index.origin === "c" && index.name !== null && !canonicalIndexNames.has(index.name));
			if (unexpected) throw new Error(`SQLite schema is incomplete or noncanonical for ${databaseLabel}: unexpected unique index ${unexpected.name}`);
			for (const index of tableIndexes) {
				const actual = actualIndexes.find((candidate) => candidate.name === index.name);
				if (JSON.stringify(actual) !== JSON.stringify(index.fingerprint)) repairIndexes.add(index);
			}
		}
		if (options.verifyPhysicalIntegrity !== false) assertSqliteIntegrity(db, databaseLabel);
	});
	if (repairIndexes.size === 0) return [];
	const savepoint = "repair_canonical_indexes";
	let activeIndex;
	db.exec(`SAVEPOINT ${savepoint};`);
	try {
		for (const index of repairIndexes) {
			activeIndex = index;
			db.exec("SAVEPOINT repair_canonical_index;");
			try {
				db.exec(`DROP INDEX IF EXISTS main.${index.name};`);
				assertSqliteIdentifier(index.name);
				const create = index.unique ? "CREATE UNIQUE INDEX" : "CREATE INDEX";
				db.exec(`${create} main.${index.name} ${index.definition};`);
			} catch (error) {
				db.exec("ROLLBACK TO SAVEPOINT repair_canonical_index;");
				if (options.allowMissingColumns && isMissingColumnError(error)) {
					repairIndexes.delete(index);
					continue;
				}
				throw error;
			} finally {
				db.exec("RELEASE SAVEPOINT repair_canonical_index;");
			}
		}
		if (repairIndexes.size === 0) {
			db.exec(`RELEASE SAVEPOINT ${savepoint};`);
			return [];
		}
		assertSqliteIntegrity(db, databaseLabel);
		options.validateAfterRepair?.();
		db.exec(`RELEASE SAVEPOINT ${savepoint};`);
	} catch (error) {
		try {
			db.exec(`ROLLBACK TO SAVEPOINT ${savepoint};`);
		} finally {
			db.exec(`RELEASE SAVEPOINT ${savepoint};`);
		}
		if (error instanceof Error && isTerminalSqliteIntegrityError(error)) throw error;
		const detail = error instanceof Error ? error.message : String(error);
		throw new Error(`SQLite canonical index ${activeIndex?.name ?? "repair"} failed for ${databaseLabel}: ${detail}`, { cause: error });
	}
	return [...repairIndexes].map((index) => index.name).toSorted();
}
function assertSqliteIdentifier(identifier) {
	if (!SQLITE_IDENTIFIER_PATTERN.test(identifier)) throw new Error(`invalid SQLite identifier: ${identifier}`);
}
function isMissingColumnError(error) {
	return error instanceof Error && error.code === "ERR_SQLITE_ERROR" && /^no such column:/iu.test(error.message);
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
function readMainTableList(db, options = {}) {
	return db.prepare("PRAGMA table_list").all().filter((row) => row.schema === "main" && typeof row.name === "string" && (options.includeInternal === true || !row.name.startsWith("sqlite_")));
}
/** Canonical bootstrap needs no legacy rebuild when every ordinary table is already STRICT. */
function hasNonStrictSqliteTables(db) {
	return readMainTableList(db).some((row) => row.type === "table" && Number(row.strict) !== 1);
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
	for (const type of ["trigger", "view"]) for (const object of preservedObjects) if (object.type === type) db.exec(`DROP ${type.toUpperCase()} ${quoteSqliteIdentifier(object.name)};`);
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
//#endregion
//#region src/state/agent-deletion-journal-history.ts
function hasPreJournalStateSchema(database) {
	if (isPostgresSqlConnection(database)) return false;
	if (readStateSchemaContentVersion(database) !== 1 || tableExists(database, "config_machine_state") || tableExists(database, "agent_database_leases") || !tableExists(database, "agent_databases") || !tableExists(database, "migration_sources")) return false;
	const db = getNodeSqliteKysely(database);
	const metadata = executeSqliteQueryTakeFirstSync(database, db.selectFrom("schema_meta").selectAll().where("meta_key", "=", "primary"));
	return metadata?.role === "global" && metadata.schema_version === 1 && metadata.agent_id === null && !executeSqliteQueryTakeFirstSync(database, db.selectFrom("migration_sources").select("source_key").where("target_table", "=", "agent_deletion_journal").limit(1));
}
//#endregion
//#region src/infra/sqlite-schema-ensure.ts
/** Install missing additive objects using the connection's admitted schema lifecycle. */
function createSqliteSchemaEnsurer(schemaSql, objects) {
	const present = (database) => {
		const facts = getAdmittedSqliteSchemaFacts(database);
		return facts !== void 0 && objects.tables.every((table) => facts.tables.has(table)) && (objects.indexes?.every((index) => facts.indexes.has(index)) ?? true);
	};
	return (database) => {
		if (isPostgresSqlConnection(database)) requireNativeDatabaseFile("postgres", "repair");
		runSqliteReadOperationSync(database, () => {
			if (present(database)) return;
			const install = () => {
				if (!present(database)) database.exec(schemaSql());
			};
			if (database.isTransaction) install();
			else runSqliteImmediateTransactionSync(database, install);
		});
	};
}
//#endregion
//#region src/state/openclaw-state-feature-schema.ts
const featureLocalSql = {
	user_profiles: `
CREATE TABLE IF NOT EXISTS user_profiles (
  id TEXT NOT NULL PRIMARY KEY,
  display_name TEXT,
  primary_github_account_id INTEGER,
  avatar BLOB,
  avatar_mime TEXT,
  avatar_sha256 TEXT,
  merged_into TEXT,
  role TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS user_profile_emails (
  email TEXT NOT NULL PRIMARY KEY,
  profile_id TEXT NOT NULL,
  binding_id TEXT,
  created_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_user_profile_emails_profile_id
  ON user_profile_emails(profile_id);

${extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, "user_profile_identities")}
`,
	operator_approval_standing_grants: `
CREATE TABLE IF NOT EXISTS operator_approval_standing_grants (
  grant_id TEXT NOT NULL PRIMARY KEY CHECK (length(grant_id) > 0),
  minted_by_approval_id TEXT NOT NULL
    REFERENCES operator_approvals(approval_id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL CHECK (length(agent_id) > 0),
  cron_job_id TEXT NOT NULL CHECK (length(cron_job_id) > 0),
  job_config_revision TEXT NOT NULL CHECK (length(job_config_revision) > 0),
  operation_binding TEXT NOT NULL CHECK (length(operation_binding) > 0),
  created_at_ms INTEGER NOT NULL,
  expires_at_ms INTEGER CHECK (expires_at_ms IS NULL OR expires_at_ms >= created_at_ms),
  revoked_at_ms INTEGER,
  revoked_by TEXT,
  last_used_at_ms INTEGER,
  use_count INTEGER NOT NULL DEFAULT 0
) STRICT;

CREATE INDEX IF NOT EXISTS idx_operator_approval_standing_grants_binding
  ON operator_approval_standing_grants(agent_id, cron_job_id, operation_binding, created_at_ms DESC);

CREATE TABLE IF NOT EXISTS operator_approval_standing_grant_generations (
  grant_id TEXT NOT NULL PRIMARY KEY
    REFERENCES operator_approval_standing_grants(grant_id) ON DELETE CASCADE,
  job_definition_generation INTEGER NOT NULL CHECK (job_definition_generation >= 1)
) STRICT;
`,
	operator_approval_execution_identities: `
CREATE TABLE IF NOT EXISTS operator_approval_execution_identities (
  approval_id TEXT NOT NULL PRIMARY KEY
    REFERENCES operator_approvals(approval_id) ON DELETE CASCADE,
  source_context_id TEXT NOT NULL CHECK (
    length(source_context_id) BETWEEN 1 AND 256 AND source_context_id = trim(source_context_id)
  ),
  source_execution_id TEXT NOT NULL CHECK (
    length(source_execution_id) BETWEEN 1 AND 256 AND source_execution_id = trim(source_execution_id)
  )
) STRICT;
`,
	worker_environment_ssh_fallback_ports: `
CREATE TABLE IF NOT EXISTS worker_environment_ssh_fallback_ports (
  environment_id TEXT NOT NULL,
  position INTEGER NOT NULL CHECK (position >= 0 AND position <= 9),
  port INTEGER NOT NULL CHECK (port >= 1 AND port <= 65535),
  PRIMARY KEY (environment_id, position),
  UNIQUE (environment_id, port),
  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE
) STRICT;
`,
	worker_environment_session_attachments: `
CREATE TABLE IF NOT EXISTS worker_environment_session_attachments (
  session_id TEXT PRIMARY KEY,
  session_key TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  session_lifecycle_revision TEXT,
  environment_id TEXT NOT NULL UNIQUE,
  generation INTEGER NOT NULL CHECK (generation >= 1),
  created_at_ms INTEGER NOT NULL,
  last_used_at_ms INTEGER NOT NULL,
  closed_at_ms INTEGER,
  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE
) STRICT;
CREATE INDEX IF NOT EXISTS worker_environment_session_attachments_session_key
ON worker_environment_session_attachments(agent_id, session_key);
`
};
function getOpenClawStateFeatureSchemaSql(table, options) {
	if (options === void 0 && featureLocalSql[table]) return featureLocalSql[table];
	if (table === "skill_library_entries" && options === void 0) return extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, table, {
		endMarker: "-- End profile-owned skill library.",
		includeEndMarker: false,
		errorMessage: "Canonical skill library schema missing."
	});
	return extractSqliteTableSchema(table === "user_profile_emails" ? featureLocalSql.user_profiles : OPENCLAW_STATE_SCHEMA_SQL, table, options);
}
//#endregion
//#region src/state/openclaw-state-db-schema-additive.ts
const tableEnsurers = /* @__PURE__ */ new Map();
function ensureTable(database, table, options) {
	if (isPostgresSqlConnection(database)) return ensureStatePostgresFragment(database, table);
	let ensure = tableEnsurers.get(table);
	if (!ensure) {
		const schema = getOpenClawStateFeatureSchemaSql(table, options);
		ensure = createSqliteSchemaEnsurer(() => schema, {
			tables: getCanonicalSqliteTableNames(schema),
			indexes: getCanonicalSqliteNamedIndexContracts(schema).map(({ name }) => name)
		});
		tableEnsurers.set(table, ensure);
	}
	ensure(database);
}
function ensureWorkerSessionToolStateSchema(db) {
	ensureTable(db, "worker_turn_tool_authorities");
	ensureTable(db, "worker_session_tool_operations");
}
/**
* Add the feature-owned first-use columns that a STRICT rebuild cannot skip.
*
* These columns normally stay absent until their owning feature first writes
* them, and the persistent schema contract accepts that shape. The STRICT
* table rebuild is the one caller that cannot: it recreates each table from
* canonical SQL, which already declares these columns, so a database missing
* them fails the canonical column check and rolls the entire repair back.
* Ensuring them immediately before that rebuild matches the shape the rebuild
* produces anyway, and stays scoped to databases old enough to need it.
*/
function ensureFirstUseAdditiveStateColumnsForStrictMigration(db) {
	for (const { columnName, dataType, tableName } of CLAW_FIRST_USE_ADDITIVE_STATE_COLUMN_DEFINITIONS) ensureColumn(db, tableName, `${columnName} ${dataType}`);
}
function ensureColumns(db, definitions) {
	const added = [];
	for (const [tableName, definition] of definitions) {
		const columnName = definition.trim().split(/\s+/, 1)[0];
		if (columnName && ensureColumn(db, tableName, definition)) added.push({
			tableName,
			columnName
		});
	}
	return added;
}
/** Runtime pairs new columns with their transforms; full historical repair stays explicit. */
function ensureAdditiveStateColumns(db, scope) {
	const repairHistoricalRows = scope === "repair";
	ensureWorkerSessionToolStateSchema(db);
	for (const { columnName, dataType, tableName } of CLAW_STARTUP_ADDITIVE_STATE_COLUMN_DEFINITIONS) ensureColumn(db, tableName, `${columnName} ${dataType}`);
	if (ensureColumn(db, ...ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.packageUpdatedAt[0])) db.exec("UPDATE claw_package_refs SET updated_at_ms = installed_at_ms;");
	ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.packageIntegrity);
	const addedDiagnosticEventSequence = ensureColumn(db, ...ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.diagnosticSequence[0]);
	if (addedDiagnosticEventSequence) db.exec(`
      WITH ranked AS (
        SELECT
          rowid AS event_rowid,
          ROW_NUMBER() OVER (
            PARTITION BY scope
            ORDER BY created_at ASC, rowid ASC
          ) AS sequence
        FROM diagnostic_events
      )
      UPDATE diagnostic_events
      SET sequence = (
        SELECT ranked.sequence
        FROM ranked
        WHERE ranked.event_rowid = diagnostic_events.rowid
      );
    `);
	if (addedDiagnosticEventSequence || repairHistoricalRows) db.exec("DROP INDEX IF EXISTS idx_diagnostic_events_scope_created;");
	const addedCronLogColumns = ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.cronRunLogs);
	if (repairHistoricalRows || addedCronLogColumns.some(({ tableName }) => tableName === "cron_run_logs")) backfillCronRunLogEntryJson(db);
	const addedAcpReplayColumns = ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.acpReplay).length > 0;
	if (addedAcpReplayColumns || repairHistoricalRows) backfillAcpReplayEstimatedBytes(db, addedAcpReplayColumns);
	const addedCronJobColumns = ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.cronJobs);
	if (repairHistoricalRows || addedCronJobColumns.some(({ columnName }) => [
		"name",
		"enabled",
		"agent_id",
		"payload_kind",
		"runtime_updated_at_ms"
	].includes(columnName))) backfillCronJobsFromJobJson(db);
	const addedDeliveryColumns = ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.deliveryQueue);
	if (repairHistoricalRows || addedDeliveryColumns.some(({ tableName }) => tableName === "delivery_queue_entries")) backfillDeliveryQueueEntriesFromEntryJson(db);
	ensureColumn(db, ...ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.originalMediaRoot[0]);
	ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.beforeTaskAttribution);
	ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.taskRequester);
	ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.taskRunDetails);
	if (repairHistoricalRows) {
		repairLegacySubagentExecutionPayloads(db);
		repairLegacySubagentRetainedResults(db);
	}
	ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.workerEnvironments);
	if (repairHistoricalRows || !tableHasColumn(db, "operator_approvals", "resolution_ref")) ensureOperatorApprovalResolutionRefs(db);
}
//#endregion
//#region src/state/openclaw-state-db-startup-checkpoint.ts
const NATIVE_STARTUP_BOOTSTRAP_OBJECTS = /* @__PURE__ */ new Set([
	"table:device_auth_tokens",
	"index:idx_device_auth_tokens_updated",
	"table:device_identities",
	"index:idx_device_identities_device",
	"table:exec_approvals_config",
	"table:macos_port_guardian_records",
	"index:idx_macos_port_guardian_records_port",
	"table:schema_meta",
	"table:state_leases",
	"index:idx_state_leases_expiry",
	"index:idx_state_leases_owner"
]);
createStateSchemaAdmission("state.startup-checkpoint", (value) => value === true ? true : void 0);
function isUninitializedNativeStartupDatabase(db) {
	const schema = getAdmittedSqliteSchemaFacts(db);
	if ((getStateSchemaVersionAdmission(db)?.userVersion ?? schema?.userVersion ?? readSqliteUserVersion(db)) !== 0) return false;
	const objects = schema ? [
		...[...schema.tables].map((name) => ({
			type: "table",
			name
		})),
		...[...schema.indexes].map((name) => ({
			type: "index",
			name
		})),
		...[...schema.views].map((name) => ({
			type: "view",
			name
		})),
		...[...schema.triggers.keys()].map((name) => ({
			type: "trigger",
			name
		}))
	].filter(({ name }) => !name.startsWith("sqlite_")) : db.prepare("SELECT type, name FROM sqlite_schema WHERE name NOT LIKE 'sqlite_%'").all();
	if (objects.some(({ type, name }) => typeof type !== "string" || typeof name !== "string" || !NATIVE_STARTUP_BOOTSTRAP_OBJECTS.has(`${type}:${name}`))) return false;
	const tableNames = new Set(objects.filter(({ type }) => type === "table").map(({ name }) => name));
	if (tableNames.has("schema_meta") && db.prepare("SELECT 1 FROM schema_meta LIMIT 1").get()) return false;
	return !(tableNames.has("state_leases") && db.prepare("SELECT 1 FROM state_leases LIMIT 1").get());
}
//#endregion
//#region src/state/openclaw-state-db-schema-runtime.ts
const stateDbLog = createSubsystemLogger("state/db");
/** Runtime converges schema; historical row repair belongs to explicit Doctor maintenance. */
function ensureOpenClawStateRuntimeSchema(db, pathname, env, initialization, busyTimeoutMs = OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, initializeNativeOnly = false) {
	const integrity = getSqliteWorkerStateIntegrityAdmission() ?? (isMainThread ? captureOpenClawStateIntegrityAdmission(pathname) : void 0);
	if (isExistingOpenClawStateSchema(pathname, db)) {
		assertExistingOpenClawStateRuntimeSchema(db, pathname, integrity);
		assertOpenClawStateWriteAllowed({
			database: db,
			databasePath: pathname,
			env
		});
		return [];
	}
	try {
		if (isOpenClawStateSchemaFastPathEligible(db, pathname, integrity)) {
			assertOpenClawStateWriteAllowed({
				database: db,
				databasePath: pathname,
				env
			});
			return [];
		}
	} catch (error) {
		if (!db.isOpen || error instanceof StartupMaintenanceRequiredError) throw error;
	}
	return withStateDatabaseSchemaMaintenance({
		databasePath: pathname,
		busyTimeoutMs
	}, () => {
		const now = Date.now();
		const retiredTableChanges = [];
		let runtimeReady = false;
		const applied = runStateSchemaMigrationTransaction(db, pathname, () => {
			assertOpenClawStateWriteAllowed({
				database: db,
				databasePath: pathname,
				env
			});
			assertSupportedStateSchemaVersion(db, pathname);
			if (initializeNativeOnly && !isUninitializedNativeStartupDatabase(db)) return [];
			const previousVersion = readStateSchemaContentVersion(db);
			const schema = getAdmittedSqliteSchemaFacts(db);
			if (previousVersion === 0 && schema?.tables.size === 0 && schema.views.size === 0) {
				createStateConfigMachineTable(db);
				executeCanonicalStateSchema(db, {
					includeVersionLazyAdditiveTables: true,
					includeAgentDeletionJournal: initialization.kind === "fresh" || initialization.nativeBootstrapEligible === true
				});
				writeCurrentStateSchemaMetadata(db, now);
				runtimeReady = true;
				return [];
			}
			if (previousVersion === 22) {
				assertNoLegacyStateRuntimeRepair(db, pathname);
				assertStateDatabaseIntegrityOnce(db, pathname);
				const indexes = repairCanonicalSqliteIndexes(db, pathname, OPENCLAW_STATE_SCHEMA_SQL, {
					verifyPhysicalIntegrity: false,
					allowMissingColumns: true,
					validateAfterRepair: () => {
						assertCanonicalStateSchemaShape(db, pathname);
						assertOpenClawStateDatabaseForMaintenance(db, { pathname });
					}
				});
				ensureAdditiveStateColumns(db, "runtime");
				assertCurrentStateRuntimeSchema(db, pathname);
				writeCurrentStateSchemaMetadata(db, now);
				runtimeReady = true;
				return indexes.length > 0 ? [`Rebuilt canonical shared-state SQLite indexes (${indexes.length})`] : [];
			}
			openClawStateMigrationAssertions.get(previousVersion)?.(db, { pathname });
			assertStateDatabaseIntegrityOnce(db, pathname);
			const boundedChanges = migrateBoundedStateSchema(db, previousVersion);
			if (boundedChanges) {
				writeCurrentStateSchemaMetadata(db, now);
				assertCurrentStateRuntimeSchema(db, pathname);
				runtimeReady = true;
				return boundedChanges;
			}
			const includeAgentDeletionJournal = tableExists(db, "agent_deletion_journal") || hasPreJournalStateSchema(db) || (initialization.kind === "fresh" || initialization.nativeBootstrapEligible === true) && isUninitializedNativeStartupDatabase(db);
			dropLegacyStateTables(db);
			const changes = runRetiredStateTableMigrations(db, previousVersion);
			retiredTableChanges.push(...changes);
			if (migrateSingletonStateFoldInV12(db, previousVersion)) changes.push("Folded singleton state tables into config_machine_state (v12)");
			if (migrateWorkerPlacementExecutionModeSchema(db, previousVersion)) changes.push("Migrated cloud worker placements to execution modes");
			const pathMigration = migrateAgentDatabaseRelativePaths(db, previousVersion, pathname);
			changes.push(...describeAgentPathMigration(pathMigration));
			if (migratePredicateColumnsV21(db, previousVersion)) changes.push("Derived meeting transcript selectors and bounded delivery retention columns (v21)");
			ensureAdditiveStateColumns(db, previousVersion < 20 ? "repair" : "runtime");
			for (const migration of versionedStateMigrations) if (migration.migrate(db, previousVersion)) changes.push(migration.applied);
			migrateSessionWatchCursorProvenance(db);
			assertCanonicalStateSchemaShape(db, pathname);
			executeCanonicalStateSchema(db, {
				includeVersionLazyAdditiveTables: true,
				includeAgentDeletionJournal
			});
			migrateLegacyCronRunLogsToTaskRuns(db);
			if (previousVersion < 3 && hasNonStrictSqliteTables(db)) {
				repairLegacyGatewayRestartHandoffsForStrictMigration(db);
				ensureFirstUseAdditiveStateColumnsForStrictMigration(db);
				const strict = migrateSqliteSchemaToStrictInTransaction(db, getOpenClawStateRuntimeSchema({
					includeVersionLazyAdditiveTables: true,
					includeAgentDeletionJournal
				}), { databaseLabel: pathname });
				if (strict.migratedTables.length > 0) changes.push(`Migrated shared state tables to SQLite STRICT typing (${strict.migratedTables.length})`);
			}
			repairCanonicalSqliteIndexes(db, pathname, OPENCLAW_STATE_SCHEMA_SQL, { verifyPhysicalIntegrity: false });
			writeCurrentStateSchemaMetadata(db, now);
			assertOpenClawStateDatabaseForMaintenance(db, { pathname });
			runtimeReady = true;
			warnAgentPathMigration(stateDbLog, pathMigration, pathname);
			return changes;
		}, {
			busyTimeoutMs,
			databaseLabel: pathname,
			operationLabel: "state.schema.ensure"
		});
		if (runtimeReady) publishStateRuntimeSchemaAdmission(db, true);
		retiredTableChanges.forEach(logRetiredStateTableMigration);
		return applied;
	});
}
//#endregion
//#region src/state/openclaw-state-db.ts
/** Reject a fresh shared-state open after known corruption until repair clears it. */
function assertOpenClawStateDatabaseFreshOpenAllowed(options = {}) {
	const env = options.env ?? process.env;
	openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(resolveDatabasePath(options), env);
}
const deferredStateDatabases = /* @__PURE__ */ new WeakSet();
function readPublishedStateSchemaVersion(database) {
	const admitted = getStateSchemaVersionAdmission(database);
	if (admitted) return admitted.userVersion;
	if (isPostgresSqlConnection(database)) requireNativeDatabaseFile("postgres", "repair");
	return readSqliteUserVersion(database);
}
function readOnlyStateDatabase(database, close) {
	return {
		...database,
		walMaintenance: {
			checkpoint: () => false,
			stop: async () => {},
			reclaimFreePages: createSqliteWalReclamationResult,
			close
		}
	};
}
function openOpenClawStateDatabaseWithBusyTimeout(options = {}, busyTimeoutMs = OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, lockFailureReporting = "report", remainingColdAdmissionTimeout) {
	getOpenClawDatabaseMaintenanceScope()?.assertAdmission();
	const env = options.env ?? process.env;
	const pathname = options.database?.path ?? resolveDatabasePath(options);
	if (isArtifactPreservingStateRead("agent", pathname)) {
		assertOpenClawStateDatabaseFreshOpenAllowed(options);
		const db = openSqliteReadOnlyDatabase(pathname, { timeout: busyTimeoutMs });
		assertSupportedStateSchemaVersion(db, pathname);
		return readOnlyStateDatabase({
			db,
			path: pathname
		}, () => {
			db.close();
			return true;
		});
	}
	const existingSchema = !options.database && isExistingOpenClawStateSchema(pathname);
	const cached = options.database ?? openClawStateDatabaseCache.getCachedOpenClawStateDatabase(pathname);
	if (cached && (options.database || cached.db.isOpen)) {
		if (!options.database) openClawStateDatabaseCache.assertOpenClawStateDatabaseOpenAllowed(pathname);
		assertStateDatabaseSchemaAdmission(cached);
		assertOpenClawStateWriteAllowed({
			database: cached.db,
			databasePath: pathname,
			env,
			schemaReady: openClawStateDatabaseCache.isOpenClawStateDatabaseSchemaReady(cached)
		});
		observeOpenClawDatabaseMaintenanceResource(cached.db);
		if (options.database) openClawStateDatabaseCache.touchStateDatabase(cached);
		else if (!existingSchema && deferredStateDatabases.has(cached.db)) {
			reconcileOpenClawStateSchemaPublication(options);
			if (getStateSchemaVersionAdmission(cached.db)?.userVersion === 22) deferredStateDatabases.delete(cached.db);
		}
		return cached;
	}
	let unpublished;
	try {
		const open = (remaining) => {
			getOpenClawDatabaseMaintenanceScope()?.assertAdmission();
			openClawStateDatabaseCache.assertOpenClawStateDatabaseOpenAllowed(pathname);
			assertOpenClawStateDatabaseFreshOpenAllowed(options);
			if (cached) openClawStateDatabaseCache.closeStaleCachedOpenClawStateDatabase(cached);
			return openUnpublishedStateDatabase({
				pathname,
				env,
				busyTimeoutMs: remaining(),
				lockFailureReporting,
				existingSchema,
				initializationAgentPaths: options.initializationAgentPaths,
				ensureSchema: (database, initialization) => ensureOpenClawStateRuntimeSchema(database, pathname, env, initialization, remaining()),
				recordOpenFailure: recordOpenClawStateDatabaseOpenFailure
			});
		};
		unpublished = remainingColdAdmissionTimeout ? open(remainingColdAdmissionTimeout) : withStateDatabaseColdAdmission({
			databasePath: pathname,
			busyTimeoutMs
		}, open);
		if (!isPostgresSqlConnection(unpublished.db)) setSqliteBusyTimeout(unpublished.db, busyTimeoutMs);
	} catch (error) {
		if (lockFailureReporting === "report" || !isOpenClawStateWriteContentionError(error)) openClawStateDatabaseCache.recordOpenClawStateDatabaseLifecycleOpenError(pathname, error);
		if (unpublished) {
			const errors = openClawStateDatabaseCache.closeUnpublishedOpenClawStateDatabaseHandle(unpublished);
			if (errors.length > 0) throw createSqliteLifecycleAggregateError([error, ...errors], `Fresh OpenClaw state database open failed releasing access and closing its unpublished handle for ${pathname}.`, error);
		}
		throw error;
	}
	if (existingSchema) recordExistingOpenClawStateSchemaDatabase(unpublished.db, pathname);
	const database = openClawStateDatabaseCache.publishOpenClawStateDatabase(unpublished, env);
	try {
		if (!existingSchema && readPublishedStateSchemaVersion(database.db) < 22) {
			deferredStateDatabases.add(database.db);
			reconcileOpenClawStateSchemaPublication(options);
		}
		return database;
	} catch (error) {
		if (database.db.isOpen && !isPostgresSqlConnection(database.db)) setSqliteBusyTimeout(database.db, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);
		throw error;
	}
}
function openOpenClawStateDatabase(options = {}) {
	return openOpenClawStateDatabaseWithBusyTimeout(options);
}
/** The Gateway watcher also publishes without requiring a new physical database open. */
function reconcileOpenClawStateSchemaPublication(options = {}) {
	if (isExistingOpenClawStateSchema(options.database?.path ?? resolveDatabasePath(options))) return;
	const pending = withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		if (readPublishedStateSchemaVersion(db) >= 22 || readStateSchemaContentVersion(db) < 22) return;
		if (isPostgresSqlConnection(db)) requireNativeDatabaseFile("postgres", "repair");
		return { blocker: readStateSchemaPublicationBlocker(db) };
	}, options);
	if (!pending || pending.blocker) return pending?.blocker;
	const pathname = resolveDatabasePath(options);
	try {
		return withStateDatabaseSchemaMaintenance({ databasePath: pathname }, () => runOpenClawStateWriteTransaction(({ db }) => {
			if (isPostgresSqlConnection(db)) requireNativeDatabaseFile("postgres", "repair");
			const blocker = readStateSchemaPublicationBlocker(db);
			if (blocker) return blocker;
			assertOpenClawStateDatabaseForMaintenance(db, { pathname });
			markCurrentStateSchemaVersion(db);
		}, options, { operationLabel: "state.schema.publish" }));
	} catch (error) {
		if (error instanceof StateSchemaMutationConflictError) return;
		throw error;
	}
}
/** Run an admitted shared-state write; complete single statements may use autocommit. */
function runOpenClawStateWriteTransaction(operation, options = {}, transactionOptions = {}) {
	if (isArtifactPreservingStateRead("agent", options.database?.path ?? resolveDatabasePath(options))) throw new Error("Programming error: shared-state write during artifact-preserving inspection.");
	getOpenClawDatabaseMaintenanceScope()?.assertAdmission();
	const existing = options.database ?? getOpenClawStateDatabaseIfOpen(options);
	if (existing) {
		isExistingOpenClawStateSchema(existing.path, existing.db);
		if (options.database) assertStateDatabaseAccessAllowed(existing.path);
	}
	let database = existing;
	let callbackEntered = false;
	let committed;
	const execute = (remaining) => {
		const acquired = database ?? openOpenClawStateDatabaseWithBusyTimeout(options, 5e3, "report", remaining);
		database = acquired;
		return {
			database: acquired,
			value: runManagedStateTransaction(acquired.db, () => {
				assertStateDatabaseSchemaAdmission(acquired);
				if (!options.database) getOpenClawStateDatabaseIfOpen(options);
				assertOpenClawStateWriteAllowed({
					database: acquired.db,
					databasePath: acquired.path,
					env: options.env ?? process.env,
					schemaReady: openClawStateDatabaseCache.isOpenClawStateDatabaseSchemaReady(acquired)
				});
				observeOpenClawDatabaseMaintenanceResource(acquired.db);
				if (options.database) openClawStateDatabaseCache.touchStateDatabase(acquired);
				callbackEntered = true;
				return operation(acquired);
			}, {
				databaseLabel: acquired.path,
				...transactionOptions,
				...remaining ? { busyTimeoutMs: remaining() } : {},
				operationLabel: transactionOptions.operationLabel ?? captureSqliteReaderOwner()?.operation ?? "state.write"
			})
		};
	};
	try {
		committed = existing ? execute() : withStateDatabaseColdAdmission({
			databasePath: resolveDatabasePath(options),
			busyTimeoutMs: transactionOptions.busyTimeoutMs ?? 5e3,
			canRetry() {
				if (callbackEntered || database && (!database.db.isOpen || database.db.isTransaction)) return false;
				if (database) assertTransactionUsable(database.db);
				return true;
			}
		}, execute);
	} catch (error) {
		if (database) openClawStateDatabaseCache.evictOpenClawStateDatabaseAfterCorruption(database, error);
		throw error;
	}
	try {
		if (!isExistingOpenClawStateSchema(committed.database.path, committed.database.db)) ensureOpenClawStatePermissions(committed.database.path, options.env ?? process.env);
	} catch {}
	return committed.value;
}
/**
* Return a shared state handle this process already holds open, if any.
*
* Read-only callers use this to avoid opening a connection per call; it never
* creates, repairs, or registers a handle.
*/
function getOpenClawStateDatabaseIfOpen(options = {}) {
	const pathname = resolveDatabasePath(options);
	isExistingOpenClawStateSchema(pathname);
	const cached = openClawStateDatabaseCache.getCachedOpenClawStateDatabase(pathname);
	if (cached?.db.isOpen) isExistingOpenClawStateSchema(cached.path, cached.db);
	return cached?.db.isOpen ? cached : void 0;
}
function assertStateDatabaseSchemaAdmission(database) {
	if (isExistingOpenClawStateSchema(database.path, database.db)) {
		const location = readTrackedStateDatabaseIdentity(database.db)?.canonicalPath;
		if (!location) throw new Error("Existing shared-state schema admission requires a filesystem-backed database.");
		if (!isExistingOpenClawStateSchema(location, database.db)) throw new Error("Existing shared-state schema admission requires its selected physical database.");
		if (isPostgresSqlConnection(database.db)) {
			assertSupportedStateSchemaVersion(database.db, database.path);
			return;
		}
		assertExistingOpenClawStateRuntimeSchema(database.db, database.path);
	}
}
//#endregion
export { hasUnresolvedConfigPath as _, listAgentIds as a, safeParseJson as b, withExistingOpenClawStateDatabaseArtifactPreservingReadOnly as c, isDeeplyFrozenPlainData as d, resolveConfigForRead as f, getConfigResolutionFacts as g, getAuthoredConfigSecretRef as h, resolveAgentWorkspaceDir as i, withExistingOpenClawStateDatabaseReadOnly as l, copyConfigResolutionFactsExcept as m, runOpenClawStateWriteTransaction as n, executeExistingOpenClawStateRead as o, cloneConfigWithResolutionFacts as p, migrateSqliteSchemaToStrict as r, getActiveOpenClawStateDatabaseReadSnapshot as s, openOpenClawStateDatabase as t, freezeJsonSnapshot as u, resolveConfigSecretRef as v, setConfigResolutionFacts as y };
