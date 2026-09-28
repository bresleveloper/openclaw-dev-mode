import { a as getChildLogger, s as resolvePreferredOpenClawTmpDir, t as createSubsystemLogger } from "./subsystem-CxjajkOx.js";
import { a as asNullableRecord, c as isRecord, i as normalizeOptionalString, o as asOptionalObjectRecord, t as normalizeLowercaseStringOrEmpty } from "./string-coerce-Dyy0qgLy.js";
import { g as resolveGlobalSingleton, h as resolveGlobalSet, m as pruneMapToMaxSize } from "./runtime-doctor-migrations-8XPPImoy.js";
import { _ as isMissingPathError, d as resolveStateDir, g as hasErrnoCode } from "./redact-V5IywZh1.js";
import { i as toErrorObject, r as extractErrorCode, t as formatErrorMessage } from "./errors-Dp0Hj51M.js";
import { r as resolvePathViaExistingAncestorSync$1 } from "./types.secrets-CBNculTH.js";
import { n as MAX_TIMER_TIMEOUT_MS } from "./number-coercion-fuMteyiI.js";
import "./fs-safe-defaults-2jt53BPm.js";
import { c as resolveRequiredOsHomeDir, i as sameFileIdentity, n as normalizeWindowsPathPreservingCase, r as sameFileContentsSync, t as isPathInside } from "./utils-CROxhhxU.js";
import { n as createDeferredCore, t as isPromiseLike } from "./promise-like-ByIJ_1fR.js";
import { t as compareValidSemver } from "./semver-Bf9GAGQM.js";
import { createRequire } from "node:module";
import { realpath, stat } from "node:fs/promises";
import "node:util";
import path, { posix } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { AsyncLocalStorage, AsyncResource } from "node:async_hooks";
import fs$1, { chmodSync, closeSync, existsSync, openSync, realpathSync, statSync, unlinkSync, writeFileSync, default as openClawRootFsSync } from "node:fs";
import { copyFileDescriptorSync, readFileWindowFullySync, readFileWindowFullySync as readFileWindowFullySync$1 } from "@openclaw/fs-safe/advanced";
import { normalizeWindowsPathForComparison } from "@openclaw/fs-safe/path";
import os from "node:os";
import { hash, randomUUID } from "node:crypto";
import { performance as performance$1 } from "node:perf_hooks";
import { MessageChannel, getEnvironmentData, isMainThread, setEnvironmentData, threadId } from "node:worker_threads";
import { InsertQueryNode, Kysely, SelectQueryNode, SqliteDialect, sql } from "kysely";
import { sha256FileSync } from "@openclaw/fs-safe/durability";
import { probeTreeClone } from "@openclaw/fs-safe/copy";
resolveGlobalSet(Symbol.for("openclaw.signalExitBarriers"), "close-and-restart");
resolveGlobalSet(Symbol.for("openclaw.signalExitGates"), "close-and-restart");
const activeFinalizers = resolveGlobalSet(Symbol.for("openclaw.signalExitFinalizers"), "close-and-restart");
/** Temporary artifacts remain available until other shutdown owners have drained. */
function registerSignalExitFinalizer(finalizer) {
	activeFinalizers.add(finalizer);
}
//#endregion
//#region node-version.mjs
const NODE_RELEASE_VERSION_RE = /^v?((?:0|[1-9]\d*))\.((?:0|[1-9]\d*))\.((?:0|[1-9]\d*))(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/u;
const NODE_RELEASE_FLOORS = [{
	major: 24,
	minor: 16,
	patch: 0
}, {
	major: 26,
	minor: 1,
	patch: 0
}];
NODE_RELEASE_FLOORS[NODE_RELEASE_FLOORS.length - 1];
`${NODE_RELEASE_FLOORS.map(({ major, minor, patch }, index) => `>=${major}.${minor}.${patch}${index < NODE_RELEASE_FLOORS.length - 1 ? ` <${major + 1}` : ""}`).join(" || ").replaceAll(" || ", ", ").replace(/, ([^,]+)$/, ", or $1")}`;
/** Parses an anchored release SemVer, allowing a leading v and valid build metadata. */
function parseNodeReleaseVersion(value) {
	if (typeof value !== "string") return null;
	const match = NODE_RELEASE_VERSION_RE.exec(value.trim());
	if (!match) return null;
	const version = {
		major: Number(match[1]),
		minor: Number(match[2]),
		patch: Number(match[3])
	};
	return Object.values(version).every(Number.isSafeInteger) ? version : null;
}
function isNodeVersionAtLeast(version, minimum) {
	if (!version) return false;
	if (version.major !== minimum.major) return version.major > minimum.major;
	if (version.minor !== minimum.minor) return version.minor > minimum.minor;
	return version.patch >= minimum.patch;
}
function renderProcessNodeVersionCheck() {
	return `((value) => {
  if (typeof value !== "string") return false;
  const match = new RegExp(${JSON.stringify(NODE_RELEASE_VERSION_RE.source)}, "u").exec(value.trim());
  if (!match) return false;
  const version = { major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3]) };
  if (!Object.values(version).every(Number.isSafeInteger)) return false;
  const floors = ${JSON.stringify(NODE_RELEASE_FLOORS)};
  const minimum = floors.find((floor) => floor.major === version.major);
  const atLeast = (floor) =>
    version.major > floor.major ||
    (version.major === floor.major &&
      (version.minor > floor.minor ||
        (version.minor === floor.minor && version.patch >= floor.patch)));
  return minimum ? atLeast(minimum) : version.major > floors[floors.length - 1].major;
})(process.versions.node)`;
}
renderProcessNodeVersionCheck();
//#endregion
//#region src/infra/kysely-sync-cache-state.ts
const { kyselyByDatabase, queryErrorHandlerByDatabase } = resolveGlobalSingleton(Symbol.for("openclaw.sqliteKyselyCacheState"), () => ({
	kyselyByDatabase: /* @__PURE__ */ new WeakMap(),
	queryErrorHandlerByDatabase: /* @__PURE__ */ new WeakMap()
}));
const statementCacheSymbol = Symbol.for("openclaw.kyselySyncStatementCache");
const statementInvalidationSymbol = Symbol.for("openclaw.kyselySyncStatementInvalidation");
const statementCacheEnabledSymbol = Symbol.for("openclaw.kyselySyncStatementCacheEnabled");
const authorizerActiveSymbol = Symbol.for("openclaw.kyselySyncAuthorizerActive");
const disposeCallbacksSymbol = Symbol.for("openclaw.sqliteDisposeCallbacks");
const statementCacheCapacity = 64;
const statementCacheEntryBytes = 65536;
/** Retire dependent native resources before this connection closes or is replaced. */
function registerNodeSqliteDisposeCallback(db, callback) {
	const owner = db;
	installStatementInvalidation(owner);
	const callbacks = owner[disposeCallbacksSymbol] ??= /* @__PURE__ */ new Set();
	callbacks.add(callback);
	return () => {
		callbacks.delete(callback);
	};
}
function disposeNodeSqliteDependents(owner, reason = "close") {
	for (const callback of owner[disposeCallbacksSymbol] ?? []) callback(reason);
}
/** Register the lifecycle owner's handler for synchronous Kysely query failures. */
function registerNodeSqliteKyselyQueryErrorHandler(db, handler) {
	queryErrorHandlerByDatabase.set(db, handler);
}
/** Drop cached Kysely state for a DatabaseSync. */
function clearNodeSqliteKyselyCacheForDatabase(db) {
	delete db[statementCacheSymbol];
	kyselyByDatabase.delete(db);
	queryErrorHandlerByDatabase.delete(db);
}
function installStatementInvalidation(owner) {
	if (owner[statementInvalidationSymbol]) return;
	if (typeof owner.setAuthorizer === "function") {
		const setAuthorizer = owner.setAuthorizer.bind(owner);
		Object.defineProperty(owner, "setAuthorizer", {
			configurable: true,
			writable: true,
			value(callback) {
				setAuthorizer(callback);
				this[authorizerActiveSymbol] = callback !== null;
				delete this[statementCacheSymbol];
			}
		});
	}
	if (typeof owner.deserialize === "function") {
		const deserialize = owner.deserialize.bind(owner);
		Object.defineProperty(owner, "deserialize", {
			configurable: true,
			writable: true,
			value(...args) {
				disposeNodeSqliteDependents(this, "replace");
				try {
					deserialize(...args);
				} finally {
					delete this[statementCacheSymbol];
				}
			}
		});
	}
	if (typeof owner.close === "function") {
		const close = owner.close.bind(owner);
		Object.defineProperty(owner, "close", {
			configurable: true,
			writable: true,
			value() {
				disposeNodeSqliteDependents(this);
				clearNodeSqliteKyselyCacheForDatabase(this);
				return close();
			}
		});
	}
	if (typeof owner[Symbol.dispose] === "function") {
		const dispose = owner[Symbol.dispose].bind(owner);
		Object.defineProperty(owner, Symbol.dispose, {
			configurable: true,
			writable: true,
			value() {
				disposeNodeSqliteDependents(this);
				clearNodeSqliteKyselyCacheForDatabase(this);
				return dispose();
			}
		});
	}
	Object.defineProperty(owner, statementInvalidationSymbol, {
		configurable: true,
		value: true
	});
}
/**
* Enable bounded statement caching for a lifecycle-owned database that has not
* installed an authorizer before this call.
*/
function enableNodeSqliteKyselyStatementCache(db) {
	const owner = db;
	installStatementInvalidation(owner);
	owner[statementCacheEnabledSymbol] = true;
}
function queryFitsStatementCache(sql, parameters) {
	let bytes = Buffer.byteLength(sql);
	if (bytes > statementCacheEntryBytes) return false;
	for (const parameter of parameters) {
		if (typeof parameter === "string") {
			if (parameter.length > statementCacheEntryBytes - bytes) return false;
			bytes += Buffer.byteLength(parameter);
		} else if (ArrayBuffer.isView(parameter)) bytes += parameter.byteLength;
		if (bytes > statementCacheEntryBytes) return false;
	}
	return true;
}
function executeWithCachedStatement(db, sql, parameters, execute) {
	const owner = db;
	if (!owner[statementCacheEnabledSymbol] || owner[authorizerActiveSymbol] || !queryFitsStatementCache(sql, parameters)) return execute(db.prepare(sql));
	let cache = owner[statementCacheSymbol];
	if (!cache) {
		cache = {
			statements: /* @__PURE__ */ new Map(),
			candidates: /* @__PURE__ */ new Set(),
			active: /* @__PURE__ */ new WeakSet()
		};
		Object.defineProperty(owner, statementCacheSymbol, {
			configurable: true,
			value: cache
		});
	}
	const cached = cache.statements.get(sql);
	let statement;
	if (cached && !cache.active.has(cached)) {
		cache.statements.delete(sql);
		cache.statements.set(sql, cached);
		statement = cached;
	} else {
		statement = db.prepare(sql);
		if (!cached && cache.candidates.delete(sql)) {
			cache.statements.set(sql, statement);
			pruneMapToMaxSize(cache.statements, statementCacheCapacity);
		} else if (!cached) {
			cache.candidates.add(sql);
			if (cache.candidates.size > statementCacheCapacity) {
				const oldestCandidate = cache.candidates.values().next().value;
				if (oldestCandidate !== void 0) cache.candidates.delete(oldestCandidate);
			}
		}
	}
	cache.active.add(statement);
	try {
		return execute(statement);
	} finally {
		cache.active.delete(statement);
	}
}
//#endregion
//#region src/infra/sqlite-reader-lifecycle.ts
const readerOwners = resolveGlobalSingleton(Symbol.for("openclaw.sqliteReaderOwners"), () => new AsyncLocalStorage());
const activeReaders = resolveGlobalSingleton(Symbol.for("openclaw.sqliteActiveReaders"), () => ({
	byDatabase: /* @__PURE__ */ new WeakMap(),
	byPath: /* @__PURE__ */ new Map()
}));
const connections = resolveGlobalSingleton(Symbol.for("openclaw.sqliteReaderConnections"), () => ({
	nextId: 0,
	byDatabase: /* @__PURE__ */ new WeakMap(),
	byPath: /* @__PURE__ */ new Map(),
	finalizer: new FinalizationRegistry((connection) => forgetConnection(connection))
}));
/** The same Windows file can arrive with a namespaced or differently cased path. */
function sqliteReaderDatabasePathKey(databasePath) {
	const resolved = path.resolve(databasePath);
	return process.platform === "win32" ? normalizeWindowsPathForComparison(resolved) : resolved;
}
function boundedOperation(operation) {
	return (operation.trim() || "sqlite reader").slice(0, 120);
}
function captureSqliteReaderOwner() {
	const owner = readerOwners.getStore();
	return owner ? { ...owner } : void 0;
}
function currentOwner(fallbackOperation, capturedOwner) {
	const inherited = capturedOwner ?? readerOwners.getStore();
	return {
		operation: boundedOperation(inherited?.operation ?? fallbackOperation),
		ownerKind: inherited?.ownerKind ?? (isMainThread ? "main" : "worker"),
		...inherited?.actorId !== void 0 ? { actorId: inherited.actorId } : {}
	};
}
function connectionFor(database) {
	let connection = connections.byDatabase.get(database);
	if (!connection) {
		const now = Date.now();
		const location = database.location();
		connection = {
			id: ++connections.nextId,
			path: location ? sqliteReaderDatabasePathKey(location) : void 0,
			database: new WeakRef(database),
			owner: currentOwner("sqlite connection"),
			openedAtMs: now
		};
		connections.byDatabase.set(database, connection);
		if (connection.path) {
			const entries = connections.byPath.get(connection.path) ?? /* @__PURE__ */ new Map();
			entries.set(connection.id, connection);
			connections.byPath.set(connection.path, entries);
		}
		connections.finalizer.register(database, connection, connection);
	}
	return connection;
}
/** Forget observations only; explicit reader custody belongs to its caller. */
function forgetConnection(connection) {
	if (connection.path) {
		const entries = connections.byPath.get(connection.path);
		entries?.delete(connection.id);
		if (entries?.size === 0) connections.byPath.delete(connection.path);
	}
	const database = connection.database.deref();
	if (database && connections.byDatabase.get(database) === connection) connections.byDatabase.delete(database);
	connections.finalizer.unregister(connection);
}
/** Register weak metadata without replacing native methods or acquiring lifecycle custody. */
function registerSqliteReaderConnection(database) {
	if (database.isOpen) connectionFor(database);
}
function retainSqliteReader(database, fallbackOperation, capturedOwner) {
	const connection = connectionFor(database);
	const now = Date.now();
	const reader = {
		...currentOwner(fallbackOperation, capturedOwner),
		kind: "iterator",
		connectionId: connection.id,
		threadId,
		startedAtMs: now,
		lastProgressAtMs: now
	};
	const token = Symbol(reader.operation);
	const databaseReaders = activeReaders.byDatabase.get(database) ?? /* @__PURE__ */ new Map();
	databaseReaders.set(token, reader);
	activeReaders.byDatabase.set(database, databaseReaders);
	const databasePath = connection.path;
	const pathReaders = databasePath ? activeReaders.byPath.get(databasePath) ?? /* @__PURE__ */ new Map() : void 0;
	pathReaders?.set(token, reader);
	if (databasePath && pathReaders) activeReaders.byPath.set(databasePath, pathReaders);
	let released = false;
	return {
		progress() {
			if (!released) reader.lastProgressAtMs = Date.now();
		},
		release() {
			if (released) return;
			released = true;
			databaseReaders.delete(token);
			if (databaseReaders.size === 0) {
				if (activeReaders.byDatabase.get(database) === databaseReaders) activeReaders.byDatabase.delete(database);
			}
			pathReaders?.delete(token);
			if (databasePath && pathReaders?.size === 0 && activeReaders.byPath.get(databasePath) === pathReaders) activeReaders.byPath.delete(databasePath);
		}
	};
}
function diagnostics(readers) {
	const now = Date.now();
	return [...readers].map((reader) => {
		const diagnostic = {
			operation: reader.operation,
			ownerKind: reader.ownerKind,
			kind: reader.kind,
			connectionId: reader.connectionId,
			threadId: reader.threadId,
			ageMs: Math.max(0, now - reader.startedAtMs),
			idleMs: Math.max(0, now - reader.lastProgressAtMs)
		};
		if (reader.actorId !== void 0) diagnostic.actorId = reader.actorId;
		return diagnostic;
	}).toSorted((left, right) => right.ageMs - left.ageMs).slice(0, 8);
}
/** Observed local activity is diagnostic evidence, not proof of which connection owns a WAL lock. */
function readSqliteReaderDiagnosticsForPath(databasePath) {
	const key = sqliteReaderDatabasePathKey(databasePath);
	const entries = connections.byPath.get(key);
	const localConnections = [];
	const now = Date.now();
	for (const connection of entries?.values() ?? []) {
		const database = connection.database.deref();
		if (!database?.isOpen) {
			forgetConnection(connection);
			continue;
		}
		const location = database.location();
		if (!location || sqliteReaderDatabasePathKey(location) !== key) {
			forgetConnection(connection);
			continue;
		}
		const readers = activeReaders.byDatabase.get(database);
		localConnections.push({
			...connection.owner,
			connectionId: connection.id,
			threadId,
			ageMs: Math.max(0, now - connection.openedAtMs),
			transactionOpen: database.isTransaction,
			trackedReaders: readers?.size ?? 0
		});
	}
	const readers = activeReaders.byPath.get(key);
	return {
		scope: "current-thread",
		blockingOwner: "unknown",
		nativeStatements: "unobserved",
		threadId,
		observedAtMs: now,
		connectionCount: localConnections.length,
		readerCount: readers?.size ?? 0,
		connections: localConnections.toSorted((left, right) => right.trackedReaders - left.trackedReaders || Number(right.transactionOpen) - Number(left.transactionOpen)).slice(0, 8),
		activeReaders: diagnostics(readers?.values() ?? [])
	};
}
//#endregion
//#region src/infra/kysely-sync.ts
const nodeVersion = parseNodeReleaseVersion(process.versions.node);
const supportsRepreparedAll = !process.versions.bun && (nodeVersion?.major === 24 && isNodeVersionAtLeast(nodeVersion, {
	major: 24,
	minor: 20,
	patch: 0
}) || isNodeVersionAtLeast(nodeVersion, {
	major: 26,
	minor: 6,
	patch: 0
}));
const compileOnlySqliteDialect = new SqliteDialect({ database: async () => {
	throw new Error("getNodeSqliteKysely() returns a compile-only Kysely facade; use executeSqliteQuerySync() to execute node:sqlite queries.");
} });
function getNodeSqliteKysely(db) {
	const existing = kyselyByDatabase.get(db);
	if (existing) return existing;
	const kysely = new Kysely({ dialect: compileOnlySqliteDialect });
	kyselyByDatabase.set(db, kysely);
	return kysely;
}
function reportNodeSqliteKyselyQueryError(db, error) {
	try {
		queryErrorHandlerByDatabase.get(db)?.(error);
	} catch {}
}
function throwSqliteIteratorCleanupError(error) {
	throw toErrorObject(error, "SQLite iterator cleanup failed");
}
/** Execute a compiled Kysely query synchronously against node:sqlite. */
function executeCompiledSqliteQuerySync(db, compiledQuery, firstRowOnly = false, parameters = compiledQuery.parameters) {
	try {
		const sql = compiledQuery.sql;
		installStatementInvalidation(db);
		return executeWithCachedStatement(db, sql, parameters, (statement) => {
			if (firstRowOnly && SelectQueryNode.is(compiledQuery.query)) {
				const row = statement.get(...parameters);
				return { rows: row === void 0 ? [] : [row] };
			}
			if (SelectQueryNode.is(compiledQuery.query) || statement.columns().length > 0) {
				if (supportsRepreparedAll) return { rows: statement.all(...parameters) };
				const iterator = statement.iterate(...parameters);
				const reader = retainSqliteReader(db, "kysely eager query");
				let cleanupError;
				let failed = false;
				let failure;
				const rows = [];
				try {
					for (const row of iterator) {
						reader.progress();
						rows.push(row);
					}
				} catch (error) {
					failed = true;
					failure = error;
				}
				try {
					iterator.return?.();
				} catch (error) {
					cleanupError = error;
				}
				reader.release();
				if (failed) throw toErrorObject(failure, "SQLite query failed");
				if (cleanupError !== void 0) throw toErrorObject(cleanupError, "SQLite query cleanup failed");
				return { rows };
			}
			statement.setReadBigInts(true);
			let outcome;
			try {
				outcome = statement.run(...parameters);
			} finally {
				statement.setReadBigInts(false);
			}
			const { changes, lastInsertRowid } = outcome;
			const result = {
				numAffectedRows: BigInt(changes),
				rows: []
			};
			if (InsertQueryNode.is(compiledQuery.query) && changes > 0) return {
				...result,
				insertId: BigInt(lastInsertRowid)
			};
			return result;
		});
	} catch (error) {
		reportNodeSqliteKyselyQueryError(db, error);
		throw error;
	}
}
/** Compile and execute a Kysely query synchronously. */
function executeSqliteQuerySync(db, query) {
	return executeCompiledSqliteQuerySync(db, query.compile());
}
/** Compile fixed SQL and fresh bindings without taking ownership of a native statement. */
function compileSqliteQueryBindings(build) {
	const bindings = /* @__PURE__ */ new Map();
	const compiled = build((read) => {
		const marker = Symbol("sqlite-query-parameter");
		bindings.set(marker, read);
		return sql`${marker}`;
	}).compile();
	const readers = compiled.parameters.map((value) => bindings.get(value) ?? (() => value));
	return {
		compiled,
		bind: (params) => readers.map((read) => read(params))
	};
}
/** Compile a fixed query once; bind fresh values through the normal sync executor on each call. */
function prepareSqliteQuerySync(db, build) {
	const { compiled, bind } = compileSqliteQueryBindings(build);
	return (params) => executeCompiledSqliteQuerySync(db, compiled, false, bind(params));
}
/** Compile and lazily iterate a Kysely query synchronously against node:sqlite. */
function iterateSqliteQuerySync(db, query) {
	const owner = captureSqliteReaderOwner();
	return (function* () {
		const compiledQuery = query.compile();
		try {
			const statement = db.prepare(compiledQuery.sql);
			if (!SelectQueryNode.is(compiledQuery.query) && statement.columns().length === 0) return;
			const parameters = compiledQuery.parameters;
			const iterator = statement.iterate(...parameters);
			const reader = retainSqliteReader(db, "kysely iterator", owner);
			let cleanupError;
			let failed = false;
			try {
				for (const row of iterator) {
					reader.progress();
					yield row;
				}
			} catch (error) {
				failed = true;
				throw toErrorObject(error, "SQLite iterator failed");
			} finally {
				try {
					iterator.return?.();
				} catch (error) {
					cleanupError = error;
				}
				reader.release();
				if (!failed && cleanupError !== void 0) throwSqliteIteratorCleanupError(cleanupError);
			}
		} catch (error) {
			reportNodeSqliteKyselyQueryError(db, error);
			throw error;
		}
	})();
}
/** Execute a Kysely query synchronously and return its first row. */
function executeSqliteQueryTakeFirstSync(db, query) {
	return executeCompiledSqliteQuerySync(db, query.compile(), true).rows[0];
}
//#endregion
//#region node-sqlite.mjs
function probeSqlite(DatabaseSync) {
	const result = {
		available: false,
		version: null,
		text: false,
		blob: false,
		json: false
	};
	let database;
	try {
		database = new DatabaseSync(":memory:");
		result.available = true;
		const version = database.prepare("SELECT sqlite_version() AS version").get()?.version;
		result.version = typeof version === "string" ? version : null;
		const text = "a\0b\0";
		const bytes = Buffer.from(text, "utf8");
		const json = JSON.stringify({ value: text });
		database.exec("CREATE TABLE probe (text_value TEXT, blob_value BLOB, json_value TEXT)");
		database.prepare("INSERT INTO probe VALUES (?, ?, ?)").run(text, bytes, json);
		const row = database.prepare("SELECT text_value, blob_value, json_value FROM probe").get();
		result.text = typeof row?.text_value === "string" && row.text_value.length === 4 && Buffer.from(row.text_value, "utf8").equals(bytes);
		result.blob = row?.blob_value instanceof Uint8Array && Buffer.from(row.blob_value).equals(bytes);
		result.json = row?.json_value === json && JSON.parse(row.json_value).value === text;
	} catch (error) {
		result.error = error instanceof Error ? error.message : String(error);
	} finally {
		database?.close();
	}
	return result;
}
function isSqliteWalResetSafeVersion(value) {
	const match = /^(\d+)\.(\d+)\.(\d+)$/u.exec(value.trim());
	if (!match) return false;
	const [major, minor, patch] = match.slice(1).map(Number);
	if (![
		major,
		minor,
		patch
	].every(Number.isSafeInteger)) return false;
	return major > 3 || major === 3 && (minor > 51 || minor === 51 && patch >= 3 || minor === 50 && patch >= 7 || minor === 44 && patch >= 6);
}
`${probeSqlite.toString()}`;
//#endregion
//#region src/infra/bun-sqlite-library.ts
const WORKER_SELECTION_KEY = "openclaw.bunSqliteLibrarySelection";
function probeLibrary(path) {
	const { dlopen, FFIType } = createRequire(import.meta.url)("bun:ffi");
	const library = dlopen(path, {
		sqlite3_libversion: {
			args: [],
			returns: FFIType.cstring
		},
		sqlite3_compileoption_used: {
			args: [FFIType.cstring],
			returns: FFIType.i32
		}
	});
	try {
		return {
			version: String(library.symbols.sqlite3_libversion()),
			extensionLoadingSupported: library.symbols.sqlite3_compileoption_used(Buffer.from("OMIT_LOAD_EXTENSION\0")) === 0
		};
	} finally {
		library.close();
	}
}
function selectLibrary(path) {
	const { Database } = createRequire(import.meta.url)("bun:sqlite");
	Database.setCustomSQLite(path);
}
function createSelector(deps) {
	let selection;
	let failure;
	return (options = {}) => {
		if (failure) throw failure;
		if (selection) return selection;
		const override = options.explicitPath ?? (deps.env.OPENCLAW_SQLITE_LIBRARY?.trim() || void 0);
		if (!deps.isBun || deps.platform !== "darwin") {
			selection = override ? {
				source: "runtime",
				ignoredOverride: "OPENCLAW_SQLITE_LIBRARY requires Bun on macOS"
			} : { source: "runtime" };
			return selection;
		}
		const prefix = deps.env.HOMEBREW_PREFIX?.trim();
		const candidates = override !== void 0 ? [override] : [.../* @__PURE__ */ new Set([
			...prefix ? [posix.join(prefix, "opt/sqlite/lib/libsqlite3.dylib")] : [],
			"/opt/homebrew/opt/sqlite/lib/libsqlite3.dylib",
			"/usr/local/opt/sqlite/lib/libsqlite3.dylib",
			"/opt/local/lib/libsqlite3.dylib"
		])];
		for (const path of candidates) {
			let probe;
			try {
				try {
					probe = deps.probe(path);
				} catch (error) {
					throw deps.exists(path) ? error : new Error("missing file", { cause: error });
				}
				if (!isSqliteWalResetSafeVersion(probe.version)) throw new Error(`SQLite version ${probe.version} below the WAL safety floor`);
				if (!probe.extensionLoadingSupported) throw new Error("built with SQLITE_OMIT_LOAD_EXTENSION");
			} catch (error) {
				if (override === void 0) continue;
				failure = selectionError(path, error);
				throw failure;
			}
			try {
				deps.select(path);
			} catch (error) {
				failure = selectionError(path, error);
				throw failure;
			}
			selection = {
				source: override === void 0 ? "discovered" : "env",
				path,
				version: probe.version,
				extensionLoadingSupported: true
			};
			return selection;
		}
		selection = { source: "runtime" };
		return selection;
	};
}
function selectionError(path, error) {
	return new Error(`Cannot use SQLite library ${path}: ${error instanceof Error ? error.message : String(error)}. Fix or unset OPENCLAW_SQLITE_LIBRARY; install a supported library with brew install sqlite.`, { cause: error });
}
function inheritedSelection() {
	const value = getEnvironmentData(WORKER_SELECTION_KEY);
	if (value === void 0) return;
	if (value !== null && typeof value === "object" && !Array.isArray(value)) {
		const source = "source" in value ? value.source : void 0;
		if (source === "runtime") return { source: "runtime" };
		const path = "path" in value ? value.path : void 0;
		const version = "version" in value ? value.version : void 0;
		const extensionLoadingSupported = "extensionLoadingSupported" in value ? value.extensionLoadingSupported : void 0;
		if ((source === "env" || source === "discovered") && typeof path === "string" && typeof version === "string" && extensionLoadingSupported === true) return {
			source,
			path,
			version,
			extensionLoadingSupported: true
		};
	}
	throw new Error("Invalid inherited SQLite library selection");
}
function createRuntimeSelector() {
	const isBun = Boolean(process.versions.bun);
	const sharedLibrary = isBun && process.platform === "darwin";
	const inherited = sharedLibrary && !isMainThread ? inheritedSelection() : void 0;
	if (inherited) return () => inherited;
	const select = createSelector({
		isBun,
		platform: process.platform,
		env: process.env,
		exists: existsSync,
		probe: probeLibrary,
		select: selectLibrary
	});
	let published = false;
	return (options) => {
		const selection = select(options);
		if (sharedLibrary && isMainThread && !published) {
			setEnvironmentData(WORKER_SELECTION_KEY, Object.freeze({ ...selection }));
			published = true;
		}
		return selection;
	};
}
/** Select once, before any SQLite open; shared across CLI and bundled SDK module graphs. */
function ensureSqliteLibrarySelected(options) {
	const dependencies = options?.internals;
	return (dependencies ? dependencies.selector ??= createSelector(dependencies) : resolveGlobalSingleton(Symbol.for("openclaw.bunSqliteLibrarySelection"), createRuntimeSelector))(options);
}
//#endregion
//#region src/infra/warning-filter.ts
const warningFilterKey = Symbol.for("openclaw.warning-filter");
/** Returns whether a process warning matches a known noisy runtime/dependency warning. */
function shouldIgnoreWarning(warning) {
	if (warning.code === "DEP0040" && warning.message?.includes("punycode")) return true;
	if (warning.code === "DEP0060" && warning.message?.includes("util._extend")) return true;
	if (warning.name === "ExperimentalWarning" && warning.message?.includes("SQLite is an experimental feature")) return true;
	return false;
}
function normalizeWarningArgs(args) {
	const warningArg = args[0];
	const secondArg = args[1];
	const thirdArg = args[2];
	let name;
	let code;
	let message;
	if (warningArg instanceof Error) {
		name = warningArg.name;
		message = warningArg.message;
		code = warningArg.code;
	} else if (typeof warningArg === "string") message = warningArg;
	if (secondArg && typeof secondArg === "object" && !Array.isArray(secondArg)) {
		const options = secondArg;
		if (typeof options.type === "string") name = options.type;
		if (typeof options.code === "string") code = options.code;
	} else {
		if (typeof secondArg === "string") name = secondArg;
		if (typeof thirdArg === "string") code = thirdArg;
	}
	return {
		name,
		code,
		message
	};
}
/** Installs the global process warning filter once for the current JS realm. */
function installProcessWarningFilter() {
	const state = resolveGlobalSingleton(warningFilterKey, () => ({ installed: false }));
	if (state.installed) return;
	const originalEmitWarning = process.emitWarning.bind(process);
	const wrappedEmitWarning = ((...args) => {
		if (shouldIgnoreWarning(normalizeWarningArgs(args))) return;
		if (args[0] instanceof Error && args[1] && typeof args[1] === "object" && !Array.isArray(args[1])) {
			const warning = args[0];
			const emitted = Object.assign(new Error(warning.message), {
				name: warning.name,
				code: warning.code
			});
			process.emit("warning", emitted);
			return;
		}
		Reflect.apply(originalEmitWarning, process, args);
	});
	process.emitWarning = wrappedEmitWarning;
	state.installed = true;
}
//#endregion
//#region src/infra/node-sqlite.ts
const require$1 = createRequire(import.meta.url);
let validatedSqliteModule;
function resolveSqliteFilesystemPath(pathname) {
	if (process.platform !== "win32") return pathname;
	return path.toNamespacedPath(path.resolve(pathname));
}
function resolveNodeSqliteLocation(location) {
	if (location === "" || location === ":memory:" || location.startsWith("file:")) return location;
	return resolveSqliteFilesystemPath(location);
}
/** Preserve native Windows path prefixes before adding SQLite URI parameters. */
function resolveSqliteFileUriPath(pathname, platform) {
	if (platform === "win32") {
		const namespacedPath = path.win32.toNamespacedPath(path.win32.resolve(pathname));
		return `file:${encodeURIComponent(namespacedPath)}`;
	}
	return pathToFileURL(path.resolve(pathname)).href;
}
/** Open an existing writable database without SQLite's create-if-missing flag. */
function resolveExistingSqliteFileUri(pathname, platform = process.platform) {
	return `${resolveSqliteFileUriPath(pathname, platform)}?mode=rw`;
}
function assertSqliteWalResetSafeVersion(version, nodeVersion) {
	if (isSqliteWalResetSafeVersion(version)) return;
	const variables = process.config?.variables;
	const isShared = variables?.node_shared_sqlite === true || variables?.node_shared_sqlite === "true";
	throw new Error(`OpenClaw requires SQLite 3.51.3+, 3.50.7+ within 3.50.x, or 3.44.6+ within 3.44.x for WAL safety; Node ${nodeVersion} ${isShared ? "uses shared system" : "embeds"} SQLite ${version}, which is affected by the upstream WAL-reset database corruption bug. ${isShared ? "Upgrade the system SQLite library to one of those safe versions, or use a Node build embedding a safe version." : "Upgrade to Node 24.16.0+ or 26.1.0+ before retrying."}`);
}
function assertSafeSqliteRuntime(sqlite) {
	if (validatedSqliteModule === sqlite) return;
	const database = new sqlite.DatabaseSync(":memory:");
	try {
		const row = database.prepare("SELECT sqlite_version() AS version").get();
		const version = typeof row?.version === "string" ? row.version : "unknown";
		assertSqliteWalResetSafeVersion(version, process.versions.node);
		compareValidSemver(version, "3.45.0");
		database.prepare("SELECT sqlite_compileoption_used('OMIT_LOAD_EXTENSION') AS omitted").get()?.omitted;
		validatedSqliteModule = sqlite;
	} finally {
		database.close();
	}
}
/** Load node:sqlite after installing the process warning filter. */
function requireNodeSqlite() {
	installProcessWarningFilter();
	try {
		ensureSqliteLibrarySelected();
		const sqlite = require$1("node:sqlite");
		assertSafeSqliteRuntime(sqlite);
		return sqlite;
	} catch (err) {
		const message = formatErrorMessage(err);
		throw new Error(`SQLite support is unavailable or unsafe in this Node runtime. ${message}`, { cause: err });
	}
}
/** Open node:sqlite through OpenClaw's runtime and filesystem-location boundary. */
function openNodeSqliteDatabase(location, options) {
	const sqlite = requireNodeSqlite();
	const resolvedLocation = resolveNodeSqliteLocation(location);
	const database = options === void 0 ? new sqlite.DatabaseSync(resolvedLocation) : new sqlite.DatabaseSync(resolvedLocation, options);
	registerSqliteReaderConnection(database);
	return database;
}
//#endregion
//#region src/infra/sqlite-error-diagnostics.ts
const inspectionOperations = resolveGlobalSingleton(Symbol.for("openclaw.sqliteInspectionOperations"), () => /* @__PURE__ */ new WeakMap());
const nativeOpenFailures = resolveGlobalSingleton(Symbol.for("openclaw.sqliteNativeOpenFailures"), () => /* @__PURE__ */ new WeakSet());
function markSqliteNativeOpenFailure(error) {
	if (error !== null && typeof error === "object") nativeOpenFailures.add(error);
}
/** Record the native effect without changing its error or tagging surrounding authority checks. */
function withSqliteNativeOpen(open) {
	try {
		return open();
	} catch (error) {
		markSqliteNativeOpenFailure(error);
		throw error;
	}
}
function markSqliteInspectionOperation(error, operation) {
	if (error !== null && typeof error === "object" && !inspectionOperations.has(error)) inspectionOperations.set(error, operation);
	return error;
}
function withSqliteInspectionOperation(operation, run) {
	try {
		return run();
	} catch (error) {
		throw markSqliteInspectionOperation(error, operation);
	}
}
const SQLITE_LOCK_ERROR_CODES = /* @__PURE__ */ new Set(["SQLITE_BUSY", "SQLITE_LOCKED"]);
const SQLITE_BUSY_RESULT_CODE = 5;
const SQLITE_LOCKED_RESULT_CODE = 6;
const SQLITE_CORRUPT_RESULT_CODE = 11;
const SQLITE_NOTADB_RESULT_CODE = 26;
const SQLITE_PRIMARY_RESULT_CODE_MASK = 255;
function sqliteErrorCode(error) {
	const code = asOptionalObjectRecord(error)?.code;
	return typeof code === "string" ? code : void 0;
}
function sqliteExtendedResultCode(error) {
	const errcode = asOptionalObjectRecord(error)?.errcode;
	return typeof errcode === "number" && Number.isInteger(errcode) ? errcode : void 0;
}
function sqlitePrimaryResultCode(error) {
	const errcode = sqliteExtendedResultCode(error);
	return errcode === void 0 ? void 0 : errcode & SQLITE_PRIMARY_RESULT_CODE_MASK;
}
function isSqliteLockError(error) {
	const code = sqliteErrorCode(error);
	if (code !== void 0 && SQLITE_LOCK_ERROR_CODES.has(code)) return true;
	const primaryCode = sqlitePrimaryResultCode(error);
	return primaryCode === SQLITE_BUSY_RESULT_CODE || primaryCode === SQLITE_LOCKED_RESULT_CODE;
}
/** Report proven file damage (corrupt page or non-database header), not transient failure. */
function isSqliteCorruptionError(error) {
	const primaryCode = sqlitePrimaryResultCode(error);
	return primaryCode === SQLITE_CORRUPT_RESULT_CODE || primaryCode === SQLITE_NOTADB_RESULT_CODE;
}
//#endregion
//#region src/infra/sqlite-staging-token.ts
const SQLITE_STAGING_TOKEN_FILES = [
	"owner.sqlite",
	"owner.sqlite-journal",
	"owner.sqlite-wal",
	"owner.sqlite-shm"
];
var SqliteStagingRetiredError = class extends Error {
	constructor() {
		super("SQLite snapshot parent retired; aborting snapshot allocation");
	}
};
/** Native transactions fence private staging admission and committed retirement. */
function acquireSqliteStagingToken(directory, mode, options = {}) {
	const location = path.join(directory, SQLITE_STAGING_TOKEN_FILES[0]);
	const readIdentity = (pathname, kind) => {
		const stat = fs$1.lstatSync(pathname, { bigint: true });
		if (!(kind === "directory" ? stat.isDirectory() : stat.isFile()) || process.platform === "win32" && (stat.dev === 0n || stat.ino === 0n)) throw new Error("SQLite staging ownership is unknown");
		return stat;
	};
	const directoryIdentity = readIdentity(directory, "directory");
	const family = SQLITE_STAGING_TOKEN_FILES.map((file) => fs$1.lstatSync(path.join(directory, file), { throwIfNoEntry: false }));
	const existing = family[0];
	if (family.some((file) => file && (!file.isFile() || process.getuid && file.uid !== process.getuid())) || !existing && mode !== "create" && !options.allowMissing) throw new Error("SQLite snapshot token ownership is unknown");
	const existingIdentity = existing ? readIdentity(location, "file") : void 0;
	const db = withSqliteNativeOpen(() => openNodeSqliteDatabase(existing ? resolveExistingSqliteFileUri(location) : location));
	let tokenIdentity;
	const kysely = getNodeSqliteKysely(db);
	const execute = (statement) => executeSqliteQueryTakeFirstSync(db, { compile: () => statement.compile(kysely) });
	let exclusive = mode === "reclaim";
	let retired = false;
	const assertIdentity = () => {
		const currentDirectory = readIdentity(directory, "directory");
		const currentToken = readIdentity(location, "file");
		if (directoryIdentity.dev !== currentDirectory.dev || directoryIdentity.ino !== currentDirectory.ino || tokenIdentity.dev !== currentToken.dev || tokenIdentity.ino !== currentToken.ino) throw new Error("SQLite staging ownership changed before retirement");
	};
	const readVersion = () => {
		const row = execute(sql`PRAGMA user_version`);
		return isRecord(row) ? row.user_version : void 0;
	};
	const beginRetirement = () => {
		assertIdentity();
		if (!db.isOpen) return acquireSqliteStagingToken(directory, "reclaim");
		if (!db.isTransaction || !exclusive) {
			if (db.isTransaction) execute(sql`ROLLBACK`);
			execute(sql`BEGIN EXCLUSIVE`);
			exclusive = true;
		}
		assertIdentity();
		const version = readVersion();
		if (version !== (retired ? 1 : 0)) {
			retired = version === 1;
			throw new SqliteStagingRetiredError();
		}
		return token;
	};
	const release = (retiring = false) => {
		if (!db.isOpen) return;
		if (retiring) {
			beginRetirement();
			if (!retired) execute(sql`PRAGMA user_version=1`);
			execute(sql`COMMIT`);
			retired = true;
		} else if (db.isTransaction) execute(sql`ROLLBACK`);
		db.close();
	};
	const token = Object.assign(release, { beginRetirement });
	try {
		tokenIdentity = existingIdentity ?? readIdentity(location, "file");
		execute(sql`PRAGMA busy_timeout=0`);
		if (mode === "create") execute(sql`BEGIN IMMEDIATE`);
		else if (mode === "reclaim") execute(sql`BEGIN EXCLUSIVE`);
		else {
			execute(sql`BEGIN`);
			execute(sql`SELECT rootpage FROM sqlite_schema LIMIT 1`);
		}
		const journalMode = execute(sql`PRAGMA journal_mode`);
		if (!isRecord(journalMode) || journalMode.journal_mode !== "delete") throw new Error("SQLite snapshot token journal mode is unknown");
		const version = readVersion();
		if (version !== 0 && (mode !== "reclaim" || version !== 1)) throw new SqliteStagingRetiredError();
		retired = version === 1;
		assertIdentity();
		return token;
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
//#region src/infra/sqlite-snapshot-retirement.ts
const SQLITE_SNAPSHOT_PREFIX = "openclaw-sqlite-readonly-v2-";
const suffix = "(?:[A-Za-z0-9]{6}|[\\da-f]{8}-[\\da-f]{4}-[\\da-f]{4}-[\\da-f]{4}-[\\da-f]{12})$";
const SQLITE_SNAPSHOT_LEGACY_MARKER = new RegExp(`^openclaw-sqlite-readonly-[1-9]\\d*-${suffix}`, "u");
const tokenMarker = new RegExp(`^${SQLITE_SNAPSHOT_PREFIX}${suffix}`, "u");
const SQLITE_SNAPSHOT_LEGACY_AGE_MS = 864e5;
const pendingTokenReleases = /* @__PURE__ */ new Map();
function releaseTokens(directory, tokens) {
	const pending = pendingTokenReleases.get(directory) ?? /* @__PURE__ */ new Set();
	const failures = [];
	for (const token of tokens) try {
		token();
		pending.delete(token);
	} catch (error) {
		pending.add(token);
		failures.push(error);
	}
	if (pending.size) pendingTokenReleases.set(directory, pending);
	else pendingTokenReleases.delete(directory);
	if (failures.length) throw new AggregateError(failures, "SQLite snapshot retirement token release failed");
}
/** A failed native close retains its actual handle until retry, even after commit or unlink. */
function drainPendingSqliteSnapshotTokens(directory) {
	releaseTokens(directory, pendingTokenReleases.get(directory) ?? []);
}
const isSqliteSnapshotStagingName = (name) => SQLITE_SNAPSHOT_LEGACY_MARKER.test(name) || tokenMarker.test(name);
function acquireSqliteSnapshotToken(directory, mode) {
	return acquireSqliteStagingToken(directory, mode, { allowMissing: SQLITE_SNAPSHOT_LEGACY_MARKER.test(path.basename(directory)) });
}
/** Hold every nested lifetime before selecting payload; a parent lock alone cannot fence children. */
function beginSqliteSnapshotRetirement(directory, options = {}) {
	drainPendingSqliteSnapshotTokens(directory);
	const tokens = [];
	const payload = [];
	const release = () => releaseTokens(directory, tokens.filter((token) => token !== options.token));
	if (!fs$1.existsSync(directory)) {
		options.token?.();
		return {
			bytes: 0,
			payload,
			release,
			retire: () => {}
		};
	}
	function inspect(current, inheritedCutoff, layout = "", lock = true, parentFenced = false) {
		const stat = fs$1.lstatSync(current);
		if (!stat.isDirectory() || process.getuid && stat.uid !== process.getuid()) throw new Error("Snapshot directory ownership is unknown");
		const legacy = !layout && SQLITE_SNAPSHOT_LEGACY_MARKER.test(path.basename(current));
		const cutoff = options.cutoff !== void 0 && legacy ? Math.min(inheritedCutoff, Date.now() - SQLITE_SNAPSHOT_LEGACY_AGE_MS) : inheritedCutoff;
		if (legacy && lock && options.cutoff !== void 0) inspect(current, cutoff, layout, false);
		if (!layout && lock) {
			const unfinishedAllocation = parentFenced && tokenMarker.test(path.basename(current)) && fs$1.readdirSync(current).length === 0;
			tokens.push(current === directory && options.token ? options.token.beginRetirement() : unfinishedAllocation ? acquireSqliteStagingToken(current, "reclaim", { allowMissing: true }) : acquireSqliteSnapshotToken(current, "reclaim"));
		}
		let bytes = 0;
		let newest = stat.mtimeMs;
		for (const entry of fs$1.readdirSync(current, { withFileTypes: true })) {
			const location = path.join(current, entry.name);
			const item = fs$1.lstatSync(location);
			if (process.getuid && item.uid !== process.getuid()) throw new Error("Snapshot file ownership is unknown");
			if ((!layout || options.cutoff === void 0) && item.isFile() && SQLITE_STAGING_TOKEN_FILES.some((file) => file === entry.name)) continue;
			newest = Math.max(newest, item.mtimeMs);
			if (item.isDirectory()) {
				const nested = isSqliteSnapshotStagingName(entry.name);
				const childLayout = nested ? "" : [layout, entry.name].filter(Boolean).join("/");
				if (options.cutoff !== void 0 && (!nested && ![
					"openclaw",
					"openclaw-state",
					"openclaw-state/state"
				].includes(childLayout) || nested && layout !== "" && layout !== "openclaw")) throw new Error("Unrecognized snapshot directory");
				const allocationParent = layout === "openclaw" ? path.dirname(current) : current;
				const child = inspect(location, cutoff, childLayout, lock, nested && (layout === "" || layout === "openclaw") && isSqliteSnapshotStagingName(path.basename(allocationParent)));
				bytes += child.bytes;
				newest = Math.max(newest, child.newest);
			} else if (options.cutoff === void 0 || item.isFile() && (layout === "openclaw-state/state" ? /^openclaw\.sqlite(?:-wal|-shm|-journal)?$/u.test(entry.name) : !layout && /^(?:first|database\.sqlite(?:\.partial)?(?:-wal|-shm|-journal)?)$/u.test(entry.name))) {
				bytes += item.size;
				if (lock) payload.push(location);
			} else throw new Error("Unrecognized snapshot artifact");
		}
		if (newest >= cutoff) throw new Error(legacy ? "Legacy snapshot contains activity newer than 24 hours" : "Snapshot contains activity within the reclamation grace period");
		return {
			bytes,
			newest
		};
	}
	try {
		const { bytes } = inspect(directory, options.cutoff ?? Number.POSITIVE_INFINITY);
		return {
			bytes,
			payload,
			release,
			retire: () => {
				for (const token of tokens) token(true);
			}
		};
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
//#region src/infra/sqlite-readonly-location-cleanup.ts
var SqliteSnapshotCleanupError = class extends Error {};
const pendingTempDirectoryCleanup = /* @__PURE__ */ new Map();
let cleanupExitHandlerInstalled = false;
const activeSnapshotWork = /* @__PURE__ */ new Map();
let pendingSignalCleanup;
function snapshotDirectory(directory) {
	let owner = pendingTempDirectoryCleanup.get(directory);
	if (!owner) {
		owner = { readers: /* @__PURE__ */ new Set() };
		pendingTempDirectoryCleanup.set(directory, owner);
	}
	return owner;
}
function cleanupSnapshotOperations() {
	pendingSignalCleanup ??= (async () => {
		const directories = pendingTempDirectoryCleanup.keys();
		while (true) {
			while (activeSnapshotWork.size > 0) {
				for (const stop of activeSnapshotWork.values()) stop();
				await Promise.allSettled(activeSnapshotWork.keys());
			}
			const next = directories.next();
			if (next.done) break;
			const directory = next.value;
			await removeTempDirectoryAsync(directory, (error) => emitSnapshotCleanupFailure({
				cleanupRoot: directory,
				operation: "rm",
				code: extractErrorCode(error)
			}));
		}
	})().finally(() => {
		pendingSignalCleanup = void 0;
	});
	return pendingSignalCleanup;
}
/** Join native backup work or a terminated child before removing its private bytes. */
function retainSnapshotWork(work, stop = () => {}) {
	registerSignalExitFinalizer(cleanupSnapshotOperations);
	activeSnapshotWork.set(work, stop);
	const release = () => activeSnapshotWork.delete(work);
	work.then(release, release);
	return work;
}
function registerSnapshotTempDirectory(directory, release) {
	const owner = snapshotDirectory(directory);
	owner.release = release ?? owner.release;
	if (!cleanupExitHandlerInstalled) {
		cleanupExitHandlerInstalled = true;
		process.once("exit", () => {
			for (const stop of activeSnapshotWork.values()) stop();
			if (activeSnapshotWork.size === 0) for (const pendingDir of pendingTempDirectoryCleanup.keys()) removeTempDirectory(pendingDir);
		});
	}
	registerSignalExitFinalizer(cleanupSnapshotOperations);
}
const tempDirectoryRemovalOptions = {
	force: true,
	maxRetries: 3,
	recursive: true,
	retryDelay: 20
};
function emitSnapshotCleanupFailure(report, onCleanupFailure) {
	if (onCleanupFailure) try {
		onCleanupFailure(report);
		return;
	} catch {}
	try {
		getChildLogger({ subsystem: "infra/sqlite-snapshot" }).warn({
			path: report.cleanupRoot,
			operation: report.operation,
			errorCode: report.code
		}, "SQLite read-only snapshot cleanup failed. Check directory permissions and available storage before retrying.");
	} catch {}
}
function assertSnapshotReadersRetired(owner) {
	if (owner?.readers.size) throw new SqliteSnapshotCleanupError("SQLite snapshot still belongs to an active reader");
}
function prepareSnapshotRetirement(directory) {
	drainPendingSqliteSnapshotTokens(directory);
	const owner = pendingTempDirectoryCleanup.get(directory);
	assertSnapshotReadersRetired(owner);
	if (owner?.releaseAsync) throw new SqliteSnapshotCleanupError("SQLite snapshot requires asynchronous cleanup");
	if (owner?.retired || !owner?.release && !fs$1.existsSync(path.join(directory, SQLITE_STAGING_TOKEN_FILES[0]))) return;
	if (owner) owner.retirementStarted = true;
	return beginSqliteSnapshotRetirement(directory, { token: owner?.release });
}
/** Delete in the token process: owner death must stop unlinking when its locks disappear. */
function retireSqliteSnapshotPayload(retirement) {
	for (const file of retirement.payload) fs$1.rmSync(file, tempDirectoryRemovalOptions);
	retirement.retire();
}
function removeTempDirectory(tempDir, onFailure) {
	try {
		const retirement = prepareSnapshotRetirement(tempDir);
		try {
			if (retirement) {
				retireSqliteSnapshotPayload(retirement);
				const owner = snapshotDirectory(tempDir);
				owner.release = void 0;
				owner.retired = true;
			}
			fs$1.rmSync(tempDir, tempDirectoryRemovalOptions);
		} finally {
			retirement?.release();
		}
		pendingTempDirectoryCleanup.delete(tempDir);
		return true;
	} catch (error) {
		onFailure?.(error);
		registerSnapshotTempDirectory(tempDir);
		return false;
	}
}
async function removeTempDirectoryAsync(tempDir, onFailure) {
	try {
		const owner = pendingTempDirectoryCleanup.get(tempDir);
		assertSnapshotReadersRetired(owner);
		if (owner?.releaseAsync) {
			owner.retirementStarted = true;
			await (owner.retiring ??= owner.releaseAsync().then(() => {
				owner.releaseAsync = void 0;
				owner.retired = true;
			}).finally(() => {
				owner.retiring = void 0;
			}));
		}
		const retirement = prepareSnapshotRetirement(tempDir);
		try {
			for (const file of retirement?.payload ?? []) await retainSnapshotWork(fs$1.promises.rm(file, tempDirectoryRemovalOptions));
			if (retirement) {
				retirement.retire();
				const current = snapshotDirectory(tempDir);
				current.release = void 0;
				current.retired = true;
			}
			await retainSnapshotWork(fs$1.promises.rm(tempDir, tempDirectoryRemovalOptions));
		} finally {
			retirement?.release();
		}
		pendingTempDirectoryCleanup.delete(tempDir);
		return true;
	} catch (error) {
		onFailure?.(error);
		registerSnapshotTempDirectory(tempDir);
		return false;
	}
}
function adoptPreparedLocation(location, ownedRoot, requireCleanup = false, onCleanupFailure) {
	const tempDir = ownedRoot ?? path.dirname(location);
	registerSnapshotTempDirectory(tempDir);
	let active = true;
	let pending;
	let reported = false;
	const reportFailure = (error) => {
		if (!requireCleanup && !reported) {
			reported = true;
			emitSnapshotCleanupFailure({
				cleanupRoot: tempDir,
				operation: "rm",
				code: extractErrorCode(error)
			}, onCleanupFailure);
		}
	};
	const complete = (removed) => {
		if (removed) active = false;
		else if (requireCleanup) throw new Error(`SQLite read-only worker snapshot cleanup failed: ${tempDir}`);
		return removed;
	};
	return {
		location,
		cleanupRoot: tempDir,
		cleanup: () => {
			if (pending) return requireCleanup ? complete(false) : false;
			if (!active) return true;
			return complete(removeTempDirectory(tempDir, reportFailure));
		},
		cleanupAsync: () => {
			if (pending) return pending;
			if (!active) return Promise.resolve(true);
			pending = Promise.resolve().then(() => removeTempDirectoryAsync(tempDir, reportFailure)).then(complete).finally(() => {
				pending = void 0;
			});
			return pending;
		}
	};
}
//#endregion
//#region src/infra/private-mode.ts
const CHMOD_UNSUPPORTED_CODES = /* @__PURE__ */ new Set([
	"ENOTSUP",
	"EOPNOTSUPP",
	"EINVAL"
]);
const PRIVATE_PROBE_FILE_MODE = 384;
function hasRestrictivePermissions(target) {
	try {
		return (statSync(target).mode & 63) === 0;
	} catch {
		return false;
	}
}
function filesystemRejectsChmod(target) {
	let probePath;
	try {
		const probeDir = statSync(target).isDirectory() ? target : path.dirname(target);
		probePath = path.join(probeDir, `.openclaw-chmod-probe-${randomUUID()}`);
		writeFileSync(probePath, "", {
			flag: "wx",
			mode: PRIVATE_PROBE_FILE_MODE
		});
	} catch {
		return false;
	}
	try {
		chmodSync(probePath, PRIVATE_PROBE_FILE_MODE);
		return false;
	} catch (err) {
		return err.code === "EPERM";
	} finally {
		try {
			unlinkSync(probePath);
		} catch {}
	}
}
function canIgnorePrivateChmodError(target, code) {
	if (code && CHMOD_UNSUPPORTED_CODES.has(code)) return true;
	if (code === "EROFS") return hasRestrictivePermissions(target);
	if (code !== "EPERM") return false;
	return hasRestrictivePermissions(target) || filesystemRejectsChmod(target);
}
/**
* Applies a private POSIX mode, reporting unsupported filesystems without
* weakening real permission failures.
*/
function applyPrivateModeSync(target, mode) {
	try {
		chmodSync(target, mode);
		return { applied: true };
	} catch (err) {
		if (!canIgnorePrivateChmodError(target, err.code)) throw err;
		return {
			applied: false,
			error: err
		};
	}
}
//#endregion
//#region src/infra/sqlite-handle-lifecycle.ts
/** Idle native connections share one retention window across SQLite owners. */
const SQLITE_IDLE_HANDLE_TTL_MS = 18e5;
//#endregion
//#region src/infra/sqlite-busy-timeout.ts
const lockFailureReportingByDatabase = /* @__PURE__ */ new WeakMap();
function normalizeSqliteNonNegativeInteger(value, label) {
	if (!Number.isInteger(value) || value < 0) throw new Error(`${label} must be a non-negative integer`);
	return value;
}
function readSqliteBusyTimeout(database) {
	const row = database.prepare("PRAGMA busy_timeout").get();
	const value = row?.busy_timeout ?? row?.timeout;
	return typeof value === "bigint" ? Number(value) : Number(value ?? 0);
}
function setSqliteBusyTimeout(database, busyTimeoutMs) {
	const normalizedTimeoutMs = normalizeSqliteNonNegativeInteger(busyTimeoutMs, "busyTimeoutMs");
	database.exec(`PRAGMA busy_timeout = ${normalizedTimeoutMs}`);
}
function shouldReportSqliteLockFailure(database) {
	return lockFailureReportingByDatabase.get(database) !== "suppress";
}
/** Run with a temporary busy policy; restore early when write admission finishes. */
function runWithSqliteBusyTimeout(database, busyTimeoutMs, operation, options = {}) {
	const normalizedTimeoutMs = normalizeSqliteNonNegativeInteger(busyTimeoutMs, "busyTimeoutMs");
	const previousBusyTimeoutMs = readSqliteBusyTimeout(database);
	const previousLockFailureReporting = lockFailureReportingByDatabase.get(database);
	if (options.lockFailureReporting) lockFailureReportingByDatabase.set(database, options.lockFailureReporting);
	if (previousBusyTimeoutMs !== normalizedTimeoutMs) setSqliteBusyTimeout(database, normalizedTimeoutMs);
	const restore = () => {
		if (database.isOpen && previousBusyTimeoutMs !== normalizedTimeoutMs) setSqliteBusyTimeout(database, previousBusyTimeoutMs);
		if (previousLockFailureReporting) lockFailureReportingByDatabase.set(database, previousLockFailureReporting);
		else lockFailureReportingByDatabase.delete(database);
	};
	try {
		return operation(restore);
	} finally {
		restore();
	}
}
//#endregion
//#region src/infra/sqlite-post-commit.ts
const pendingPublications = resolveGlobalSingleton(Symbol.for("openclaw.sqlitePostCommitPublications"), () => /* @__PURE__ */ new WeakMap());
const pendingTransactionState = resolveGlobalSingleton(Symbol.for("openclaw.sqliteTransactionState"), () => /* @__PURE__ */ new WeakMap());
/** A lost transaction invalidates every savepoint's staged state and observers. */
function discardSqliteTransactionState(db, error) {
	pendingPublications.get(db)?.splice(0);
	const rolledBackState = pendingTransactionState.get(db)?.splice(0) ?? [];
	pendingPublications.delete(db);
	pendingTransactionState.delete(db);
	for (const state of rolledBackState.toReversed()) state.rollback(error);
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
		const rolledBackState = transactionState?.splice(stateStart) ?? [];
		for (const state of rolledBackState.toReversed()) state.rollback(error);
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
	const canonical = location === null ? null : normalizeWriteAdmissionLocation(location);
	writeAdmissionLocations.set(database, canonical);
	return canonical;
}
function normalizeWriteAdmissionLocation(location) {
	const normalized = process.platform === "win32" ? normalizeWindowsPathPreservingCase(location) : location;
	return process.platform === "win32" && !path.win32.isAbsolute(normalized) ? location : normalized;
}
/** Locations come from the retained native owner; registration grants no write authority. */
function retainSqliteWriteAdmissionService(nativeLocations, service) {
	const registrations = [...new Set(nativeLocations.map(normalizeWriteAdmissionLocation))].map((location) => {
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
/** Native coordinator waits must keep the same worker's current-authority grants serviceable. */
function sqliteWriteAdmissionServicesForLocation(location) {
	return writeAdmissionServices.get(normalizeWriteAdmissionLocation(location));
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
function slowTransactionHoldThresholdMs(options) {
	return options?.slowTransactionHoldMs ?? DEFAULT_SLOW_TRANSACTION_HOLD_MS;
}
function transactionLogger(options) {
	return options?.logger ?? transactionLog;
}
function logSlowTransactionHold(params) {
	if (params.elapsedMs < slowTransactionHoldThresholdMs(params.options)) return;
	transactionLogger(params.options).warn("slow SQLite transaction hold", {
		async: false,
		...params.options?.databaseLabel ? { database: params.options.databaseLabel } : {},
		elapsedMs: params.elapsedMs,
		isMainThread,
		...params.options?.operationLabel ? { operation: params.options.operationLabel } : {},
		pid: process.pid,
		threadId,
		thresholdMs: slowTransactionHoldThresholdMs(params.options)
	});
}
/** The lifecycle lock precedes BEGIN, so transaction hold diagnostics cannot see this wait. */
function logSlowSqliteCoordinatorWait(elapsedMs, options) {
	if (!isMainThread || elapsedMs <= 100) return;
	transactionLogger(void 0).warn("slow SQLite coordinator lock wait", {
		async: false,
		database: options.databaseLabel,
		elapsedMs,
		isMainThread,
		operation: options.operationLabel,
		pid: process.pid,
		threadId,
		thresholdMs: 100
	});
}
function logSlowTransactionStep(params) {
	if (params.elapsedMs < slowBusyWaitThresholdMs(params.options)) return;
	transactionLogger(params.options).warn("slow SQLite transaction lock wait", {
		async: false,
		...params.options?.busyTimeoutMs !== void 0 ? { busyTimeoutMs: params.options.busyTimeoutMs } : {},
		...params.options?.databaseLabel ? { database: params.options.databaseLabel } : {},
		elapsedMs: params.elapsedMs,
		isMainThread,
		...params.options?.operationLabel ? { operation: params.options.operationLabel } : {},
		pid: process.pid,
		step: params.step,
		threadId,
		...beginAdmissionLogFields(params.beginAdmission)
	});
}
function beginAdmissionLogFields(diagnostics) {
	return diagnostics ? { beginAdmission: {
		nativeAttempts: diagnostics.nativeAttempts,
		nativeMs: diagnostics.nativeMs,
		serviceCalls: diagnostics.serviceCalls,
		serviceMs: diagnostics.serviceMs
	} } : {};
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
			transactionLogger(params.options).warn("SQLite transaction lock wait failed", {
				async: false,
				...params.options?.busyTimeoutMs !== void 0 ? { busyTimeoutMs: params.options.busyTimeoutMs } : {},
				...params.options?.databaseLabel ? { database: params.options.databaseLabel } : {},
				code: sqliteErrorCode(error),
				elapsedMs,
				failureKind: "lock-contention",
				isMainThread,
				...params.options?.operationLabel ? { operation: params.options.operationLabel } : {},
				pid: process.pid,
				...sqliteErrcode !== void 0 ? { sqliteErrcode } : {},
				...sqlitePrimaryCode !== void 0 ? { sqlitePrimaryCode } : {},
				step: params.step,
				threadId,
				...beginAdmissionLogFields(beginAdmission)
			});
		}
		throw error;
	}
}
function beginTransaction(db, options, mode) {
	execTimedTransactionStep({
		db,
		options,
		sql: mode === "immediate" ? "BEGIN IMMEDIATE" : "BEGIN",
		step: "begin"
	});
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
	db[abortedTransactionSymbol] ??= { error };
	discardSqliteTransactionState(db, error);
	clearNodeSqliteKyselyCacheForDatabase(db);
	try {
		db.close();
	} catch {}
}
function abortImmediateTransaction(db, error) {
	if (db[abortedTransactionSymbol]) return;
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
	beginTransaction(db, options, mode);
	const transactionStartedAt = Date.now();
	try {
		const result = operation();
		assertSyncTransactionResult(result);
		assertTransactionUsable(db);
		logSlowTransactionHold({
			elapsedMs: Date.now() - transactionStartedAt,
			options
		});
		if (options?.withCommit) assertSyncTransactionResult(options.withCommit(() => commitImmediateTransaction(db, options)));
		else commitImmediateTransaction(db, options);
		return result;
	} catch (error) {
		abortImmediateTransaction(db, error);
		assertTransactionUsable(db);
		throw error;
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
//#region src/infra/sqlite-coordinator.ts
const SqliteCoordinatorError = resolveGlobalSingleton(Symbol.for("openclaw.sqliteCoordinatorError"), () => class CoordinatorError extends Error {
	constructor(message, cause) {
		super(message);
		this.cause = cause;
		this.name = "SqliteCoordinatorError";
	}
});
function createSqliteLifecycleAggregateError(errors, message, cause) {
	return new AggregateError(errors, message, { cause });
}
/** Keep the first failure as the cause while retaining independent cleanup errors. */
function throwSqliteLifecycleErrors(errors, message) {
	if (errors.length === 1) throw errors[0];
	if (errors.length > 1) throw createSqliteLifecycleAggregateError(errors, message, errors[0]);
}
function runWithSqliteCoordinator(coordinator, operationLabel, operation) {
	let result;
	try {
		result = operation();
		if (result && typeof result.then === "function") throw new SqliteCoordinatorError(`${operationLabel} must remain synchronous`);
	} catch (operationError) {
		let releaseFailed = false;
		let releaseError;
		try {
			coordinator.release();
		} catch (error) {
			releaseFailed = true;
			releaseError = error;
		}
		if (releaseFailed) throw createSqliteLifecycleAggregateError([operationError, releaseError], `${operationLabel} and coordinator release both failed`, operationError);
		throw operationError;
	}
	try {
		coordinator.release();
	} catch (releaseError) {
		throw new SqliteCoordinatorError(`${operationLabel} completed, but releasing its coordinator failed`, releaseError);
	}
	return result;
}
function ensurePrivateSqliteCoordinatorDirectory(directoryPath, coordinatorLabel) {
	try {
		fs$1.mkdirSync(directoryPath, {
			mode: 448,
			recursive: true
		});
	} catch (error) {
		if (error.code !== "EEXIST") throw error;
	}
	const stats = fs$1.lstatSync(directoryPath);
	if (stats.isSymbolicLink() || !stats.isDirectory()) throw new SqliteCoordinatorError(`${coordinatorLabel} directory must be a real directory`);
	const uid = typeof process.getuid === "function" ? process.getuid() : void 0;
	if (uid !== void 0 && stats.uid !== uid) throw new SqliteCoordinatorError(`${coordinatorLabel} directory belongs to another user`);
	if (process.platform !== "win32") {
		if ((stats.mode & 4095) !== 448) applyPrivateModeSync(directoryPath, 448);
		const secured = fs$1.lstatSync(directoryPath);
		if (secured.isSymbolicLink() || !secured.isDirectory() || (secured.mode & 63) !== 0) throw new SqliteCoordinatorError(`${coordinatorLabel} directory permissions are not private`);
	}
}
const coordinatorPool = resolveGlobalSingleton(Symbol.for("openclaw.sqliteCoordinatorPool"), () => ({
	runInCoordinatorPoolContext: AsyncLocalStorage.snapshot(),
	idleCoordinators: /* @__PURE__ */ new Map(),
	failedIdleCloses: /* @__PURE__ */ new Map(),
	exitCloseRegistered: false,
	closeOnExit: closeIdleCoordinatorsOnExit
}), () => closeIdleCoordinatorPool(), "close-only");
const { runInCoordinatorPoolContext, idleCoordinators, failedIdleCloses } = coordinatorPool;
function updateCoordinatorExitClose() {
	const needed = idleCoordinators.size > 0 || failedIdleCloses.size > 0;
	if (needed && !coordinatorPool.exitCloseRegistered) process.once("exit", coordinatorPool.closeOnExit);
	else if (!needed && coordinatorPool.exitCloseRegistered) process.removeListener("exit", coordinatorPool.closeOnExit);
	coordinatorPool.exitCloseRegistered = needed;
}
function takeIdleCoordinator(location) {
	const idle = idleCoordinators.get(location);
	if (idle) {
		idleCoordinators.delete(location);
		clearTimeout(idle.timer);
		updateCoordinatorExitClose();
	}
	return idle;
}
function closeIdleCoordinatorDatabase(database, location) {
	try {
		if (database.isOpen) database.close();
	} finally {
		if (database.isOpen) failedIdleCloses.set(database, location);
		else failedIdleCloses.delete(database);
		updateCoordinatorExitClose();
	}
}
function closeIdleCoordinatorsOnExit() {
	const databases = new Map(failedIdleCloses);
	for (const [location] of idleCoordinators) {
		const idle = takeIdleCoordinator(location);
		if (idle) databases.set(idle.database, location);
	}
	for (const [database, location] of databases) try {
		closeIdleCoordinatorDatabase(database, location);
	} catch {}
}
function closeIdleCoordinatorPool(include = () => true) {
	const databases = new Map([...failedIdleCloses].filter(([, location]) => include(location)));
	for (const [location] of idleCoordinators) {
		if (!include(location)) continue;
		const idle = takeIdleCoordinator(location);
		if (idle) databases.set(idle.database, location);
	}
	const errors = [];
	for (const [database, location] of databases) try {
		closeIdleCoordinatorDatabase(database, location);
	} catch (error) {
		errors.push(error);
	}
	throwSqliteLifecycleErrors(errors, "Idle SQLite coordinator cleanup failed");
}
function readCoordinatorIdentity(location) {
	try {
		const identity = fs$1.lstatSync(location, { bigint: true });
		return identity.isFile() && identity.dev !== 0n && identity.ino !== 0n ? identity : void 0;
	} catch {
		return;
	}
}
function matchesCoordinatorIdentity(left, right) {
	return right !== void 0 && sameFileIdentity(left, right) && left.birthtimeNs === right.birthtimeNs && left.mode === right.mode && left.uid === right.uid && left.gid === right.gid;
}
function retainIdleCoordinator(location, database, identity) {
	const previous = takeIdleCoordinator(location);
	if (previous) closeIdleCoordinatorDatabase(previous.database, location);
	const timer = runInCoordinatorPoolContext(() => setTimeout(() => {
		if (idleCoordinators.get(location)?.timer !== timer) return;
		const idle = takeIdleCoordinator(location);
		if (!idle) return;
		try {
			closeIdleCoordinatorDatabase(idle.database, location);
		} catch (error) {
			process.emitWarning(new SqliteCoordinatorError("Idle SQLite coordinator close failed", error));
		}
	}, SQLITE_IDLE_HANDLE_TTL_MS));
	timer.unref();
	idleCoordinators.set(location, {
		database,
		identity,
		timer
	});
	updateCoordinatorExitClose();
	return true;
}
function tryAcquireSqliteCoordinator(location, mode, options) {
	const busyTimeoutMs = Math.max(0, Math.trunc(options.busyTimeoutMs ?? 0));
	const reusableLocation = location !== "" && location !== ":memory:" && !location.startsWith("file:") ? path.resolve(location) : void 0;
	const poolLocation = reusableLocation && (options.keepAlive || idleCoordinators.has(reusableLocation)) ? reusableLocation : void 0;
	const before = poolLocation ? readCoordinatorIdentity(poolLocation) : void 0;
	const idle = poolLocation ? takeIdleCoordinator(poolLocation) : void 0;
	const reused = idle && matchesCoordinatorIdentity(idle.identity, before) ? idle : void 0;
	if (poolLocation && idle && !reused) closeIdleCoordinatorDatabase(idle.database, poolLocation);
	const database = reused?.database ?? withSqliteNativeOpen(() => openNodeSqliteDatabase(location));
	let identity;
	try {
		const services = mode === "exclusive" ? sqliteWriteAdmissionServicesForLocation(location) : void 0;
		const deadline = performance.now() + busyTimeoutMs;
		for (;;) {
			const attemptTimeout = services ? Math.min(25, Math.max(0, Math.ceil(deadline - performance.now()))) : busyTimeoutMs;
			try {
				database.exec(`PRAGMA busy_timeout = ${attemptTimeout}; PRAGMA journal_mode = MEMORY; ${mode === "exclusive" ? "BEGIN EXCLUSIVE;" : "BEGIN; SELECT rootpage FROM sqlite_schema LIMIT 1;"}`);
				break;
			} catch (error) {
				if (!services || !isSqliteLockError(error) || performance.now() >= deadline) throw error;
				for (const service of services) service();
			}
		}
		if (poolLocation && before) {
			if (matchesCoordinatorIdentity(before, readCoordinatorIdentity(poolLocation))) identity = before;
			else if (reused) throw new SqliteCoordinatorError("SQLite coordinator changed during acquisition");
		}
	} catch (error) {
		if (poolLocation) closeIdleCoordinatorDatabase(database, poolLocation);
		else database.close();
		if (isSqliteLockError(error)) return null;
		throw error;
	}
	let released = false;
	return {
		get closed() {
			return released || !database.isOpen;
		},
		release: (releaseOptions) => {
			if (released || !database.isOpen) return;
			const errors = [];
			if (database.isTransaction) try {
				database.exec("ROLLBACK");
				if (poolLocation && database.isTransaction) throw new SqliteCoordinatorError("SQLite coordinator rollback left its transaction open");
			} catch (error) {
				errors.push(error);
			}
			let retained = false;
			if (errors.length === 0 && options.keepAlive && releaseOptions?.keepAlive !== false && poolLocation && identity && !failedIdleCloses.has(database)) try {
				retained = retainIdleCoordinator(poolLocation, database, identity);
			} catch (error) {
				errors.push(error);
			}
			if (!retained && database.isOpen) try {
				if (poolLocation) closeIdleCoordinatorDatabase(database, poolLocation);
				else database.close();
			} catch (error) {
				errors.push(error);
			}
			released = retained || !database.isOpen;
			if (errors.length === 1) throw errors[0];
			if (errors.length > 1) throw new AggregateError(errors, "SQLite coordinator rollback and close both failed");
		}
	};
}
/** Hold a raw exclusive transaction until release for cross-process coordination. */
function tryAcquireExclusiveSqliteCoordinator(location, options = {}) {
	return tryAcquireSqliteCoordinator(location, "exclusive", options);
}
/** Retain a read lock for a live handle; no rows or journal files are written. */
function tryAcquireSharedSqliteCoordinator(location, options = {}) {
	return tryAcquireSqliteCoordinator(location, "shared", options);
}
//#endregion
//#region src/state/openclaw-quarantine-error.ts
const DATABASE_QUARANTINE_READ_CLEANUP_ERROR_NAME = "OpenClawQuarantineReadCleanupError";
const OpenClawQuarantineReadCleanupError = resolveGlobalSingleton(Symbol.for("openclaw.quarantineReadCleanupError"), () => class QuarantineReadCleanupError extends AggregateError {
	constructor(errors, quarantine) {
		super(errors, "OpenClaw quarantine reader cleanup failed.", { cause: errors[0] });
		this.quarantine = quarantine;
		this.name = DATABASE_QUARANTINE_READ_CLEANUP_ERROR_NAME;
	}
});
//#endregion
//#region src/state/openclaw-state-db-contract.ts
const FIRST_USE_STATE_TABLES = [
	"local_workspace_projections",
	"update_runs",
	"session_repository_workspaces",
	"github_repository_publication_requests",
	"github_publication_session_lifecycles",
	"skill_library_entries",
	"skill_library_revisions",
	"skill_library_events",
	"skill_library_uploads",
	"github_personal_publication_requests",
	"cron_job_runtime_authorities",
	"cron_run_trigger_state_retirements",
	"execution_identity_contexts",
	"mcp_oauth_pending_authorizations",
	"node_worker_launch_containers",
	"node_worker_launch_cleanup",
	"node_worker_launches",
	"node_worker_prepared_workspaces",
	"node_worker_turns",
	"operator_approval_execution_identities",
	"operator_approval_standing_grants",
	"operator_approval_standing_grant_generations",
	"web_push_approval_deliveries",
	"execution_decision_facts",
	"execution_owner_lifecycle_bindings",
	"outbound_message_execution_bindings",
	"outbound_message_progress"
];
const FIRST_USE_STATE_INDEXES = [
	"idx_update_runs_created",
	"idx_update_runs_active",
	"idx_github_repository_publication_shared_request",
	"idx_github_repository_publication_personal_request",
	"idx_github_personal_publication_owner_session",
	"idx_github_personal_publication_pending",
	"idx_node_worker_launches_terminal_completed",
	"idx_node_worker_turns_terminal_completed",
	"idx_node_worker_turns_active_owner",
	"idx_operator_approval_standing_grants_binding",
	"idx_web_push_approval_deliveries_subscription",
	"execution_identity_contexts_run_created_idx",
	"execution_decision_facts_context_occurred_idx",
	"execution_decision_facts_run_occurred_idx",
	"outbound_message_execution_bindings_execution_event_idx",
	"outbound_message_progress_occurred_idx",
	"outbound_message_progress_run_occurred_idx"
];
const LAZY_ADDITIVE_STATE_TABLES = [
	...FIRST_USE_STATE_TABLES,
	"agent_provenance",
	"cron_run_receipts",
	"config_revision_keys",
	"secret_store_entries",
	"projects",
	"worktree_templates",
	"user_preferences",
	"device_pair_setup_completions",
	"github_publication_requests",
	"device_pairing_join_codes",
	"skill_workshop_proposal_events",
	"skill_workshop_collection_reviews",
	"skill_workshop_proposal_rollbacks",
	"skill_workshop_proposals",
	"worker_environment_ssh_fallback_ports",
	"worker_session_placement_moves"
];
const LAZY_ADDITIVE_STATE_INDEXES = [
	...FIRST_USE_STATE_INDEXES,
	"idx_cron_run_receipts_active_job",
	"idx_cron_run_receipts_job_history",
	"idx_github_publication_requests_pending",
	"secret_store_entries_live_idx",
	"idx_skill_workshop_collection_reviews_owner_time"
];
/** Maximum time one synchronous SQLite call may wait for a lock. */
const OPENCLAW_SQLITE_BUSY_TIMEOUT_MS = 5e3;
/** User-facing guide for schema refusals; lives here so error sites avoid import cycles. */
const OPENCLAW_DATABASE_SCHEMA_DOCS_URL = "https://docs.openclaw.ai/reference/database-schemas";
//#endregion
//#region src/infra/git-root.ts
function walkUpFrom(startDir, opts, resolveAtDir) {
	let current = path.resolve(startDir);
	for (let i = 0; opts.maxDepth === void 0 || i < opts.maxDepth; i += 1) {
		const resolved = resolveAtDir(current);
		if (resolved !== null && resolved !== void 0) return resolved;
		const parent = path.dirname(current);
		if (parent === current) break;
		current = parent;
	}
	return null;
}
function resolveGitDirFromMarker(repoRoot) {
	const gitPath = path.join(repoRoot, ".git");
	try {
		const stat = fs$1.statSync(gitPath);
		if (stat.isDirectory()) return gitPath;
		if (!stat.isFile()) return null;
		const match = fs$1.readFileSync(gitPath, "utf-8").match(/gitdir:\s*(.+)/i);
		if (!match?.[1]) return null;
		return path.resolve(repoRoot, match[1].trim());
	} catch {
		return null;
	}
}
function resolveGitHeadPath(startDir, opts = {}) {
	return walkUpFrom(startDir, opts, (repoRoot) => {
		const gitDir = resolveGitDirFromMarker(repoRoot);
		return gitDir ? path.join(gitDir, "HEAD") : null;
	});
}
/** Read at most `limit` bytes from Git or build metadata. */
function readGitMetadataPrefix(filePath, limit = 256) {
	const fd = fs$1.openSync(filePath, "r");
	try {
		const buf = Buffer.alloc(limit);
		const bytesRead = readFileWindowFullySync$1(fd, buf, 0);
		return buf.subarray(0, bytesRead).toString("utf-8");
	} finally {
		fs$1.closeSync(fd);
	}
}
function readGitHead(startDir, opts = {}) {
	const headPath = resolveGitHeadPath(startDir, opts);
	if (!headPath) return;
	const head = fs$1.readFileSync(headPath, "utf-8").trim();
	if (!head.startsWith("ref:")) return {
		headPath,
		ref: null,
		value: head || null
	};
	const ref = head.replace(/^ref:\s*/i, "").trim();
	const refsBase = resolveGitRefsBase(headPath);
	return {
		headPath,
		ref,
		value: readGitRefs(refsBase, [ref]).get(ref) ?? null,
		refsBase
	};
}
function resolveGitRefsBase(headPath) {
	const gitDir = path.dirname(headPath);
	try {
		const commonDir = readGitMetadataPrefix(path.join(gitDir, "commondir")).trim();
		if (commonDir) return path.resolve(gitDir, commonDir);
	} catch (error) {
		if (!isMissingPathError(error)) throw error;
	}
	return gitDir;
}
/** Raw ref contents, sharing one packed inventory across the requested names. */
function readGitRefs(refsBase, refs) {
	const values = new Map(refs.map((ref) => [ref, null]));
	const missing = /* @__PURE__ */ new Set();
	for (const ref of refs) {
		const refPath = resolveRefPath(refsBase, ref);
		if (!refPath) continue;
		try {
			values.set(ref, readGitMetadataPrefix(refPath).trim());
		} catch (error) {
			if (!isMissingPathError(error)) throw error;
			missing.add(ref);
		}
	}
	if (missing.size === 0) return values;
	try {
		const packedRefs = fs$1.readFileSync(path.join(refsBase, "packed-refs"), "utf-8");
		for (const line of packedRefs.split("\n")) {
			if (!line || line.startsWith("#") || line.startsWith("^")) continue;
			const [value, packedRef] = line.trim().split(/\s+/, 2);
			if (packedRef && missing.delete(packedRef)) values.set(packedRef, value ?? null);
		}
	} catch (error) {
		if (!isMissingPathError(error)) throw error;
	}
	return values;
}
/** Safely resolve a Git ref path, rejecting traversal from a crafted HEAD file. */
function resolveRefPath(refsBase, ref) {
	if (!ref.startsWith("refs/")) return null;
	if (path.isAbsolute(ref)) return null;
	if (ref.split(/[/]/).includes("..")) return null;
	const resolved = path.resolve(refsBase, ref);
	const rel = path.relative(refsBase, resolved);
	if (!rel || rel.startsWith("..") || path.isAbsolute(rel)) return null;
	return resolved;
}
//#endregion
//#region src/shared/async-work-scope.ts
const currentWorkScope = resolveGlobalSingleton(Symbol.for("openclaw.asyncWorkScope"), () => new AsyncLocalStorage());
const currentWorkScopeAncestry = resolveGlobalSingleton(Symbol.for("openclaw.asyncWorkScopeAncestry"), () => new AsyncLocalStorage());
const detachedAsyncContext = resolveGlobalSingleton(Symbol.for("openclaw.detachedAsyncContext"), () => new AsyncResource("openclaw.detached-async-context"));
/** Joins cooperating descendants even when their caller returns a cached value first. */
var AsyncWorkScope = class AsyncWorkScope {
	constructor(failures) {
		this.failures = failures;
		this.pending = /* @__PURE__ */ new Set();
		this.controller = new AbortController();
		this.phase = "open";
	}
	get signal() {
		return this.controller.signal;
	}
	get hasPendingWork() {
		return this.pending.size > 0;
	}
	get isClosing() {
		return this.phase !== "open";
	}
	enter(run) {
		const owner = currentWorkScope.getStore();
		const ancestry = currentWorkScopeAncestry.getStore();
		const parent = owner ? ancestry?.scope === owner ? ancestry : { scope: owner } : void 0;
		return currentWorkScopeAncestry.run({
			scope: this,
			parent
		}, () => currentWorkScope.run(this, run));
	}
	/** Enters synchronous work without inspecting or assimilating its return value. */
	run(run) {
		if (this.phase === "closed") throw new Error("Async work scope is closed");
		const operation = createDeferredCore();
		this.pending.add(operation.promise);
		try {
			return this.enter(run);
		} finally {
			operation.resolve();
			this.pending.delete(operation.promise);
		}
	}
	track(run) {
		if (this.phase === "closed") return Promise.reject(/* @__PURE__ */ new Error("Async work scope is closed"));
		const operation = this.registerWork();
		try {
			operation.resolve(this.enter(run));
		} catch (error) {
			operation.reject(error);
		}
		return operation.promise;
	}
	registerWork() {
		const operation = createDeferredCore();
		this.pending.add(operation.promise);
		operation.promise.then(() => this.pending.delete(operation.promise), (error) => {
			this.pending.delete(operation.promise);
			this.failures?.add(error);
		});
		return operation;
	}
	beginClose(reason) {
		if (this.phase !== "open") return;
		this.phase = "closing";
		this.controller.abort(reason);
	}
	/** Starts the next phase in the same continuation that observes settled pending work. */
	runWhenIdle(run) {
		return AsyncWorkScope.runWhenAllIdle(() => [this], () => this.track(run));
	}
	/** Reselects owners so work admitted into a later phase is not mistaken for earlier work. */
	static async runWhenAllIdle(selectScopes, run) {
		let scopes = selectScopes();
		while (scopes.some((scope) => scope.pending.size > 0)) {
			await Promise.allSettled(scopes.flatMap((scope) => Array.from(scope.pending)));
			scopes = selectScopes();
		}
		return run();
	}
	async drain() {
		this.beginClose();
		while (this.pending.size > 0) await Promise.allSettled(this.pending);
		this.phase = "closed";
	}
};
/** Outside a managed scope, the returned promise remains the caller's responsibility. */
async function trackAsyncWork(run) {
	const scope = currentWorkScope.getStore();
	return await (scope ? scope.track(run) : run());
}
/** Runs under the context-free async root initialized before managed work can begin. */
function runInDetachedAsyncContext(run) {
	return detachedAsyncContext.runInAsyncScope(run);
}
//#endregion
//#region src/plugins/host-hook-cleanup-result.ts
/** Merge raw instance outcomes without duplicating their existing host or instance report. */
function appendPluginInstanceCleanupFailures(failures, pluginId, result) {
	for (const error of result.errors) {
		if (failures.some((failure) => failure.pluginId === pluginId && failure.error === error && (failure.hookId === "instance" || result.hostCleanupErrors?.includes(error)))) continue;
		failures.push({
			pluginId,
			hookId: "instance",
			error
		});
	}
}
//#endregion
//#region src/plugins/plugin-cache-artifacts.ts
function createPluginCacheArtifacts() {
	return {
		moduleLoaders: /* @__PURE__ */ new Map(),
		sources: /* @__PURE__ */ new Map(),
		sourceAliases: /* @__PURE__ */ new Map(),
		runtimeRecordRoots: /* @__PURE__ */ new WeakMap()
	};
}
//#endregion
//#region src/plugins/plugin-cache-sdk.ts
/** Derived SDK facts share the plugin cache lifetime; none owns a separate expiry. */
function createPluginCacheSdk() {
	return {
		hosts: /* @__PURE__ */ new Map(),
		contexts: /* @__PURE__ */ new Map(),
		packageNames: /* @__PURE__ */ new Map(),
		packageSearches: /* @__PURE__ */ new Map(),
		argvDirectories: /* @__PURE__ */ new Map(),
		devSourceRoots: /* @__PURE__ */ new Map(),
		runtimeModules: /* @__PURE__ */ new Map(),
		usableDistArtifacts: /* @__PURE__ */ new Map(),
		normalizedJitiAliases: /* @__PURE__ */ new Map(),
		aliasFacts: /* @__PURE__ */ new WeakMap(),
		native: {
			sdkProviders: /* @__PURE__ */ new Map(),
			nextSdkProviderOrder: 0,
			aliases: /* @__PURE__ */ new Map(),
			registeredHosts: /* @__PURE__ */ new Set(),
			hostRoots: /* @__PURE__ */ new Map(),
			nearestPackageRoots: /* @__PURE__ */ new Map(),
			loaderPackageRoots: /* @__PURE__ */ new Map(),
			allowedParentRoots: /* @__PURE__ */ new Map()
		}
	};
}
//#endregion
//#region src/plugins/plugin-instance-invocation.ts
var InvocationFrame = class InvocationFrame {
	constructor(scopes) {
		this.invocation = scopes.invocation;
		this.metadataScope = scopes.metadataScope;
		this.cacheScope = scopes.cacheScope;
	}
	withScopes(scopes) {
		return new InvocationFrame(scopes);
	}
};
/** Copy core scopes through the current owner so runtime-only fields survive. */
function createPluginExecutionFrame(scopes, current) {
	return current ? current.withScopes(scopes) : new InvocationFrame(scopes);
}
const pluginExecutionContext = resolveGlobalSingleton(Symbol.for("openclaw.pluginInstanceInvocation"), () => {
	const frames = new AsyncLocalStorage();
	return {
		invocation: {
			getStore() {
				return frames.getStore()?.invocation;
			},
			run(invocation, run) {
				const current = frames.getStore();
				return frames.run(current?.invocation === invocation ? current : createPluginExecutionFrame({
					...current,
					invocation
				}, current), run);
			},
			exit(run) {
				const current = frames.getStore();
				return current?.invocation ? frames.run(current.withScopes({
					...current,
					invocation: void 0
				}), run) : run();
			}
		},
		getFrame() {
			return frames.getStore();
		},
		runFrame(frame, run) {
			return frames.run(frame, run);
		}
	};
});
pluginExecutionContext.invocation;
const getPluginExecutionFrame = pluginExecutionContext.getFrame;
pluginExecutionContext.runFrame;
//#endregion
//#region src/plugins/plugin-cache.ts
/** Cached diagnostics must not retain the caller through V8's lazy stack frames. */
function materializePluginCacheError(failure) {
	let error = failure;
	const seen = /* @__PURE__ */ new Set();
	while (error instanceof Error && !seen.has(error)) {
		seen.add(error);
		try {
			error.stack = String(error.stack);
		} catch {
			error.stack = "Stack trace unavailable: custom formatter failed";
		}
		error = error.cause;
	}
}
const state = resolveGlobalSingleton(Symbol.for("openclaw.pluginCache"), () => ({
	snapshotOwners: /* @__PURE__ */ new WeakMap(),
	retirements: []
}));
const cacheRetainers = resolveGlobalSingleton(Symbol.for("openclaw.pluginCacheRetainers"), () => /* @__PURE__ */ new WeakMap());
const instanceCacheOwners = resolveGlobalSingleton(Symbol.for("openclaw.pluginInstanceCacheOwners"), () => /* @__PURE__ */ new WeakMap());
/** A retiring inventory releases its own custody; terminal disposal releases every birth cache. */
function releasePluginCacheInstance(instance, cache) {
	const owners = instanceCacheOwners.get(instance);
	if (cache) {
		cache.instances.delete(instance);
		owners?.delete(cache);
	} else {
		for (const owner of owners ?? []) owner.instances.delete(instance);
		owners?.clear();
	}
	if (owners?.size === 0) instanceCacheOwners.delete(instance);
}
function getPluginCacheRetainers(cache) {
	let retained = cacheRetainers.get(cache);
	if (!retained) {
		retained = {
			references: /* @__PURE__ */ new Set(),
			controller: new AbortController(),
			settled: createDeferredCore()
		};
		cacheRetainers.set(cache, retained);
	}
	return retained;
}
function createPluginMetadataCache() {
	return {
		current: {
			snapshot: void 0,
			owner: "operation",
			configFingerprint: void 0,
			agentWorkspaceFingerprint: void 0,
			envFingerprint: void 0,
			defaultDiscoveryCompatible: false,
			compatiblePolicyHashes: void 0,
			compatibleConfigFingerprints: void 0,
			revision: Symbol("plugin-metadata-snapshot"),
			configIdentities: /* @__PURE__ */ new WeakSet()
		},
		snapshots: /* @__PURE__ */ new Map(),
		discovery: /* @__PURE__ */ new Map(),
		sharedDiscovery: /* @__PURE__ */ new Map(),
		projections: /* @__PURE__ */ new WeakMap(),
		projectionSources: /* @__PURE__ */ new WeakMap(),
		completions: /* @__PURE__ */ new WeakMap(),
		indexFacts: /* @__PURE__ */ new WeakMap(),
		providerPolicyOwners: /* @__PURE__ */ new WeakMap(),
		channelAdapters: /* @__PURE__ */ new WeakMap(),
		bundledChannelCatalogs: /* @__PURE__ */ new Map(),
		bundledProviderPolicySurfaces: /* @__PURE__ */ new Map(),
		staticCatalogStates: /* @__PURE__ */ new WeakMap(),
		modelSuppressionResolvers: /* @__PURE__ */ new WeakMap()
	};
}
/** Each inventory owns its acquired facts and reusable load results; publication owns activation. */
function createPluginCache(options = {}) {
	return {
		async [Symbol.asyncDispose]() {
			await retirePluginCache(this);
		},
		kind: options.kind ?? "operation",
		roots: /* @__PURE__ */ new Map(),
		rootAliases: /* @__PURE__ */ new Map(),
		sdk: createPluginCacheSdk(),
		setupModules: /* @__PURE__ */ new Map(),
		instances: /* @__PURE__ */ new Set(),
		metadata: createPluginMetadataCache(),
		installRecords: /* @__PURE__ */ new Map(),
		persistedInstalledIndex: /* @__PURE__ */ new Map(),
		preparedBundledDiscoveryModes: /* @__PURE__ */ new Map(),
		dependencyStatus: /* @__PURE__ */ new WeakMap(),
		...createPluginCacheArtifacts()
	};
}
function getProcessPluginCache() {
	return state.current ??= createPluginCache({ kind: "process" });
}
function getScopedPluginCache() {
	return getPluginExecutionFrame()?.cacheScope?.cache;
}
function getPluginCache() {
	return getScopedPluginCache() ?? getProcessPluginCache();
}
/** Stop new setup calls immediately; the owner awaits in-flight calls and graph cleanup. */
function retirePluginCache(cache, beforeRetire) {
	const retained = getPluginCacheRetainers(cache);
	if (retained.retirement) return retained.retirement;
	const completion = createDeferredCore();
	retained.retirement = completion.promise;
	const trackRetirement = async (run) => {
		const work = new AsyncWorkScope();
		try {
			return await work.track(run);
		} finally {
			await work.run(() => work.drain());
		}
	};
	retained.beginRetirement = (track = trackAsyncWork) => {
		let admitted = false;
		track(() => {
			admitted = true;
			retained.beginRetirement = void 0;
			return beginPluginCacheRetirement(cache, beforeRetire);
		}).then(completion.resolve, (error) => {
			if (admitted) completion.reject(error);
			else retained.beginRetirement?.(trackRetirement);
		});
	};
	retained.controller.abort();
	materializePluginCacheError(retained.controller.signal.reason);
	if (retained.references.size === 0) retained.beginRetirement?.();
	else retained.settled.promise.then(() => {
		retained.beginRetirement?.(trackRetirement);
	});
	return completion.promise;
}
function beginPluginCacheRetirement(cache, beforeRetire) {
	if (cache.retirement) return cache.retirement;
	const retirement = createDeferredCore();
	cache.retirement = retirement.promise;
	const cleanup = async () => {
		beforeRetire?.();
		const registries = cache.retireRegistryLoads?.();
		const resources = /* @__PURE__ */ new Set([...cache.setupModules.values(), ...cache.instances]);
		for (const resource of resources) resource.quiesce();
		const [registry] = await Promise.allSettled([registries]);
		const outcomes = await Promise.allSettled([...resources].map(async (resource) => ({
			resource,
			result: await resource.dispose()
		})));
		cache.setupModules.clear();
		for (const instance of cache.instances) releasePluginCacheInstance(instance, cache);
		const unexpected = [...registry.status === "rejected" ? [registry.reason] : [], ...outcomes.flatMap((result) => result.status === "rejected" ? [result.reason] : [])];
		if (unexpected.length) throw new AggregateError(unexpected, "Plugin cache resources failed to retire");
		const host = registry.status === "fulfilled" ? registry.value : void 0;
		const failures = [...host?.failures ?? []];
		for (const outcome of outcomes) {
			if (outcome.status !== "fulfilled") continue;
			const { resource, result } = outcome.value;
			appendPluginInstanceCleanupFailures(failures, resource.pluginId, result);
		}
		return {
			cleanupCount: host?.cleanupCount ?? 0,
			failures
		};
	};
	cleanup().then(retirement.resolve, retirement.reject);
	return retirement.promise;
}
//#endregion
//#region src/infra/openclaw-root.ts
const CORE_PACKAGE_NAMES = /* @__PURE__ */ new Set(["openclaw"]);
function parsePackageName(raw) {
	const parsed = JSON.parse(raw);
	return typeof parsed.name === "string" ? parsed.name : null;
}
function readPackageNameSync(dir) {
	const packageNameCache = getPluginCache().sdk.packageNames;
	const packageJsonPath = path.join(path.resolve(dir), "package.json");
	if (packageNameCache.has(packageJsonPath)) return packageNameCache.get(packageJsonPath) ?? null;
	try {
		const name = parsePackageName(openClawRootFsSync.readFileSync(packageJsonPath, "utf-8"));
		packageNameCache.set(packageJsonPath, name);
		return name;
	} catch {
		packageNameCache.set(packageJsonPath, null);
		return null;
	}
}
function findPackageRootSync(startDir, maxDepth = 12) {
	for (const current of iterAncestorDirs(startDir, maxDepth)) {
		const name = readPackageNameSync(current);
		if (name && CORE_PACKAGE_NAMES.has(name)) return current;
	}
	return null;
}
function* iterAncestorDirs(startDir, maxDepth) {
	let current = path.resolve(startDir);
	for (let i = 0; i < maxDepth; i += 1) {
		yield current;
		if (path.basename(current) === "node_modules") break;
		const parent = path.dirname(current);
		if (parent === current) break;
		current = parent;
	}
}
function candidateDirsFromArgv1(argv1) {
	const argv1CandidateCache = getPluginCache().sdk.argvDirectories;
	const cacheKey = path.resolve(argv1);
	const cached = argv1CandidateCache.get(cacheKey);
	if (cached) return [...cached];
	const normalized = path.resolve(argv1);
	const candidates = [];
	try {
		const resolved = openClawRootFsSync.realpathSync(normalized);
		if (resolved !== normalized) candidates.push(path.dirname(resolved));
	} catch {}
	candidates.push(path.dirname(normalized));
	const parts = normalized.split(path.sep);
	const binIndex = parts.lastIndexOf(".bin");
	if (binIndex > 0 && parts[binIndex - 1] === "node_modules") {
		const binName = path.basename(normalized);
		const nodeModulesDir = parts.slice(0, binIndex).join(path.sep);
		candidates.push(path.join(nodeModulesDir, binName));
	}
	const deduped = dedupeCandidates(candidates);
	argv1CandidateCache.set(cacheKey, deduped);
	return [...deduped];
}
function resolveOpenClawPackageRootSync(opts) {
	const candidates = buildCandidates(opts);
	const cacheKey = createPackageRootCacheKey(candidates);
	const searches = getPluginCache().sdk.packageSearches;
	const cached = searches.get(cacheKey);
	if (cached?.all) return cached.all[0] ?? null;
	if (cached?.first !== void 0) return cached.first;
	for (const candidate of candidates) {
		const found = findPackageRootSync(candidate);
		if (found) {
			searches.set(cacheKey, { first: found });
			return found;
		}
	}
	searches.set(cacheKey, { first: null });
	return null;
}
function buildCandidates(opts) {
	const candidates = [];
	if (opts.moduleUrl) try {
		candidates.push(path.dirname(fileURLToPath(opts.moduleUrl)));
	} catch {}
	if (opts.argv1) candidates.push(...candidateDirsFromArgv1(opts.argv1));
	if (opts.cwd) candidates.push(opts.cwd);
	return dedupeCandidates(candidates);
}
function dedupeCandidates(candidates) {
	const seen = /* @__PURE__ */ new Set();
	const deduped = [];
	for (const candidate of candidates) {
		const resolved = path.resolve(candidate);
		if (seen.has(resolved)) continue;
		seen.add(resolved);
		deduped.push(resolved);
	}
	return deduped;
}
function createPackageRootCacheKey(candidates) {
	return candidates.join("\0");
}
//#endregion
//#region src/infra/git-commit.ts
const formatCommit = (value) => {
	if (!value) return null;
	const trimmed = value.trim();
	if (!trimmed) return null;
	const match = trimmed.match(/[0-9a-fA-F]{7,40}/);
	if (!match) return null;
	return normalizeLowercaseStringOrEmpty(match[0].slice(0, 7));
};
const cachedGitCommitBySearchDir = /* @__PURE__ */ new Map();
const GIT_COMMIT_CACHE_LIMIT = 256;
const resolveCommitSearchDir = (options) => {
	if (options.cwd) return path.resolve(options.cwd);
	if (options.moduleUrl) try {
		return path.dirname(fileURLToPath(options.moduleUrl));
	} catch {}
	return process.cwd();
};
const cacheGitCommit = (searchDir, commit) => {
	cachedGitCommitBySearchDir.set(searchDir, commit);
	pruneMapToMaxSize(cachedGitCommitBySearchDir, GIT_COMMIT_CACHE_LIMIT);
	return commit;
};
const resolveGitLookupDepth = (searchDir, packageRoot) => {
	if (!packageRoot) return;
	const relative = path.relative(packageRoot, searchDir);
	if (relative.startsWith("..") || path.isAbsolute(relative)) return;
	return (relative ? relative.split(path.sep).filter(Boolean).length : 0) + 1;
};
const readCommitFromGit = (searchDir, packageRoot) => {
	const head = readGitHead(searchDir, { maxDepth: resolveGitLookupDepth(searchDir, packageRoot) });
	return head === void 0 ? void 0 : formatCommit(head.value);
};
const readCommitFromPackageJson = () => {
	try {
		const pkg = createRequire(import.meta.url)("../../package.json");
		return formatCommit(pkg.gitHead ?? pkg.githead ?? null);
	} catch {
		return null;
	}
};
const readCommitProbe = (moduleUrl, candidates, field) => {
	try {
		for (const candidate of candidates) {
			const filePath = fileURLToPath(new URL(candidate, moduleUrl));
			let raw;
			try {
				raw = readGitMetadataPrefix(filePath, 1024);
			} catch (error) {
				if (isMissingPathError(error)) continue;
				return null;
			}
			try {
				const value = asNullableRecord(JSON.parse(raw))?.[field];
				return typeof value === "string" ? formatCommit(value) : null;
			} catch {
				return null;
			}
		}
	} catch {}
};
const readCommitFromBuildInfo = (moduleUrl = import.meta.url) => {
	return readCommitProbe(moduleUrl, ["../build-info.json", "./build-info.json"], "commit") ?? null;
};
const readLoadedCommit = (moduleUrl) => {
	const buildStamp = readCommitProbe(moduleUrl, ["../.buildstamp", "./.buildstamp"], "head");
	const runtimeStamp = readCommitProbe(moduleUrl, ["../.runtime-postbuildstamp", "./.runtime-postbuildstamp"], "head");
	if (buildStamp !== void 0 || runtimeStamp !== void 0) {
		if (buildStamp || runtimeStamp) return buildStamp && buildStamp === runtimeStamp ? buildStamp : null;
		return readCommitFromBuildInfo(moduleUrl);
	}
	return readCommitProbe(moduleUrl, ["../build-info.json", "./build-info.json"], "commit");
};
const resolveCommitHash = (options = {}) => {
	const env = options.env ?? process.env;
	const readers = options.readers ?? {};
	const readGitCommit = readers.readGitCommit ?? readCommitFromGit;
	const envCommit = env.GIT_COMMIT?.trim() || env.GIT_SHA?.trim();
	const normalized = formatCommit(envCommit);
	if (normalized) return normalized;
	const searchDir = resolveCommitSearchDir(options);
	if (cachedGitCommitBySearchDir.has(searchDir)) {
		const cached = cachedGitCommitBySearchDir.get(searchDir) ?? null;
		cachedGitCommitBySearchDir.delete(searchDir);
		cachedGitCommitBySearchDir.set(searchDir, cached);
		return cached;
	}
	const packageRoot = resolveOpenClawPackageRootSync({
		cwd: options.cwd,
		moduleUrl: options.moduleUrl
	});
	try {
		const gitCommit = readGitCommit(searchDir, packageRoot);
		if (gitCommit !== void 0) return cacheGitCommit(searchDir, gitCommit);
	} catch {}
	const buildInfoCommit = readers.readBuildInfoCommit?.() ?? readCommitFromBuildInfo();
	if (buildInfoCommit) return cacheGitCommit(searchDir, buildInfoCommit);
	const pkgCommit = readers.readPackageJsonCommit?.() ?? readCommitFromPackageJson();
	if (pkgCommit) return cacheGitCommit(searchDir, pkgCommit);
	try {
		return cacheGitCommit(searchDir, readGitCommit(searchDir, packageRoot) ?? null);
	} catch {
		return cacheGitCommit(searchDir, null);
	}
};
/** Resolve the commit that produced the loaded artifact, not the checkout's current revision. */
function resolveLoadedCommitHash(options = {}) {
	const moduleUrl = options.moduleUrl ?? import.meta.url;
	const loaded = readLoadedCommit(moduleUrl);
	return loaded === void 0 ? resolveCommitHash({
		moduleUrl,
		...options.env ? { env: options.env } : {}
	}) : loaded;
}
//#endregion
//#region src/version.ts
const CORE_PACKAGE_NAME = "openclaw";
const PACKAGE_JSON_CANDIDATES = [
	"../package.json",
	"../../package.json",
	"../../../package.json",
	"./package.json"
];
const BUILD_INFO_CANDIDATES = [
	"../build-info.json",
	"../../build-info.json",
	"./build-info.json"
];
function readVersionFromJsonCandidates(moduleUrl, candidates, opts = {}) {
	try {
		const require = createRequire(moduleUrl);
		for (const candidate of candidates) try {
			const parsed = require(candidate);
			const version = normalizeOptionalString(parsed.version);
			if (!version) continue;
			if (opts.requirePackageName && parsed.name !== CORE_PACKAGE_NAME) continue;
			return version;
		} catch {}
		return null;
	} catch {
		return null;
	}
}
function readBuildIdFromJsonCandidates(moduleUrl) {
	try {
		const require = createRequire(moduleUrl);
		for (const candidate of BUILD_INFO_CANDIDATES) try {
			const parsed = require(candidate);
			const buildId = normalizeOptionalString(parsed.buildId);
			if (buildId && buildId.length <= 96) return buildId;
		} catch {}
		return null;
	} catch {
		return null;
	}
}
function firstNonEmpty(...values) {
	for (const value of values) {
		const trimmed = normalizeOptionalString(value);
		if (trimmed && trimmed.toLowerCase() !== "undefined" && trimmed.toLowerCase() !== "null") return trimmed;
	}
}
function readVersionFromPackageJsonForModuleUrl(moduleUrl) {
	return readVersionFromJsonCandidates(moduleUrl, PACKAGE_JSON_CANDIDATES, { requirePackageName: true });
}
function readVersionFromBuildInfoForModuleUrl(moduleUrl) {
	return readVersionFromJsonCandidates(moduleUrl, BUILD_INFO_CANDIDATES);
}
function readBuildIdFromBuildInfoForModuleUrl(moduleUrl) {
	return readBuildIdFromJsonCandidates(moduleUrl);
}
function resolveVersionFromModuleUrl(moduleUrl) {
	return readVersionFromBuildInfoForModuleUrl(moduleUrl) || readVersionFromPackageJsonForModuleUrl(moduleUrl);
}
function resolveBinaryVersion(params) {
	return resolveVersionFromModuleUrl(params.moduleUrl) || firstNonEmpty(params.bundledVersion) || params.fallback || "0.0.0";
}
readBuildIdFromBuildInfoForModuleUrl(import.meta.url);
const RUNTIME_SERVICE_COMMIT = resolveLoadedCommitHash({ moduleUrl: import.meta.url });
function resolveRuntimeServiceCommit() {
	return RUNTIME_SERVICE_COMMIT;
}
const VERSION = resolveBinaryVersion({
	moduleUrl: import.meta.url,
	bundledVersion: process.env.OPENCLAW_BUNDLED_VERSION
});
//#endregion
//#region src/infra/startup-maintenance-required.ts
const GATEWAY_STARTUP_MAINTENANCE_REQUIRED_REASON = "gateway.maintenance_required";
const maintenanceReasons = {
	"state-migrations": "state migration",
	"newer-schema": "a newer OpenClaw build",
	"agent-media": "offline media migration",
	"agent-databases-composite-primary-key": "state database schema migration",
	"audit-events-v2": "state database schema migration",
	"legacy-workshop-review-index": "state database schema migration",
	"legacy-cron-run-logs": "cron run history migration",
	"legacy-workspace": "workspace setup state migration",
	"legacy-session-store": "session store migration"
};
var StartupMaintenanceRequiredError = class extends Error {
	constructor(kind, message, options) {
		super(message, options);
		this.kind = kind;
		this.code = GATEWAY_STARTUP_MAINTENANCE_REQUIRED_REASON;
		this.name = "StartupMaintenanceRequiredError";
	}
	get reason() {
		return maintenanceReasons[this.kind];
	}
};
//#endregion
//#region src/infra/sqlite-user-version.ts
const SQLITE_SCHEMA_VERSION_ERROR_NAME = "SqliteSchemaVersionError";
var SqliteSchemaVersionError = class extends StartupMaintenanceRequiredError {
	constructor(message) {
		super("newer-schema", message);
		this.name = SQLITE_SCHEMA_VERSION_ERROR_NAME;
	}
};
function isSqliteSchemaVersionError(error) {
	return error instanceof SqliteSchemaVersionError || error instanceof Error && error.name === SQLITE_SCHEMA_VERSION_ERROR_NAME;
}
function readSqliteUserVersion(db) {
	const row = db.prepare("PRAGMA user_version").get();
	return Number(row?.user_version ?? 0);
}
/**
* Name the refusing build from immutable loaded metadata, plus its install root.
* The path remains actionable when multiple installs share a version or build.
*/
function describeRunningOpenClawBuild() {
	const commit = resolveRuntimeServiceCommit();
	const root = resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url });
	const identity = commit ? `OpenClaw ${VERSION} (${commit})` : `OpenClaw ${VERSION}`;
	return root ? `${identity} installed at ${root}` : identity;
}
function createNewerSqliteSchemaVersionError(databaseLabel, pathname, schemaVersion, supportedVersion) {
	return new SqliteSchemaVersionError(`This OpenClaw build cannot open your existing data.
${databaseLabel} ${pathname} uses newer schema version ${schemaVersion}; this build supports ${supportedVersion}.\nRefused by ${describeRunningOpenClawBuild()}.\nUse a build that supports schema ${schemaVersion} or newer with this state directory. To use an older build, restore your pre-update backup created with openclaw backup create.\nSee ${OPENCLAW_DATABASE_SCHEMA_DOCS_URL}.`);
}
//#endregion
//#region src/infra/state-database-coordinator-delegate.ts
function createCoordinatorDelegate(identity, live, retained, revoke, label) {
	let channel;
	let revoked = false;
	return {
		get port() {
			if (revoked) throw new SqliteCoordinatorError(`${label} is closed`);
			if (!channel) {
				channel = new MessageChannel();
				channel.port1.postMessage({
					...identity,
					live: live.buffer
				});
				channel.port1.unref();
			}
			return channel.port2;
		},
		get closed() {
			return revoked && retained.closed;
		},
		release() {
			if (!revoked) {
				revoked = true;
				revoke();
				channel?.port1.close();
				channel?.port2.close();
			}
			retained.release();
		}
	};
}
const lifecycleScopes = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseLifecycleDelegateScopes"), () => new AsyncLocalStorage());
function acquireDelegatedLifecycleCoordinator(coordinatorPath) {
	const delegate = lifecycleScopes.getStore()?.get(coordinatorPath);
	if (!delegate) return;
	if (!delegate.active) throw new SqliteCoordinatorError("State lifecycle delegate scope is closed");
	delegate.assertCurrent();
	let closed = false;
	return {
		path: coordinatorPath,
		get closed() {
			return closed;
		},
		release() {
			closed = true;
		}
	};
}
//#endregion
//#region src/infra/state-database-coordinator-errors.ts
const StateDatabaseCoordinatorContentionError = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseCoordinatorContentionError"), () => class CoordinatorContentionError extends SqliteCoordinatorError {
	constructor(family) {
		super(`another OpenClaw process owns ${family}`);
		this.family = family;
		this.name = "StateDatabaseCoordinatorContentionError";
	}
});
const StateSchemaMutationConflictError = resolveGlobalSingleton(Symbol.for("openclaw.stateSchemaMutationConflictError"), () => class SchemaMutationConflictError extends SqliteCoordinatorError {
	constructor(databasePath, cause) {
		super(`OpenClaw refused shared state schema mutation at ${databasePath} because another Gateway owns that state directory. Stop that Gateway or perform the update through its managed restart path, then retry.`, cause);
		this.name = "StateSchemaMutationConflictError";
	}
});
//#endregion
//#region packages/normalization-core/src/node-crypto.ts
function sha256Hex(input) {
	return hash("sha256", input, "hex");
}
function sha256HexPrefixCore(input, length) {
	return sha256Hex(input).slice(0, length);
}
//#endregion
//#region src/infra/crypto-digest.ts
/** Matches the streaming helper's symlink-following path contract. */
function sha256FileSync$1(filePath) {
	const descriptor = openSync(filePath, "r");
	try {
		return sha256FileSync(descriptor).digest;
	} finally {
		closeSync(descriptor);
	}
}
//#endregion
//#region src/infra/state-database-coordinator-paths.ts
function resolveCoordinatorIdentityPath(pathname) {
	const normalized = path.resolve(pathname);
	try {
		const resolved = path.resolve(realpathSync.native(normalized));
		if (process.platform !== "win32" || resolved === normalized) return resolved;
	} catch {}
	return resolvePathViaExistingAncestorSync$1(normalized);
}
function resolveLifecycleCoordinatorBase(params) {
	const canonicalDatabasePath = resolveCoordinatorIdentityPath(params.databasePath);
	const canonicalRuntimeDirectory = resolveCoordinatorIdentityPath(params.runtimeDirectory);
	const suffix = params.uid === void 0 ? "openclaw-state-locks" : `openclaw-state-locks-${params.uid}`;
	return {
		directory: path.join(canonicalRuntimeDirectory, suffix),
		databaseHash: sha256HexPrefixCore(canonicalDatabasePath, 8)
	};
}
function buildLifecycleCoordinatorPath(family, base) {
	return path.join(base.directory, `${family}.${base.databaseHash}.lock.sqlite`);
}
function resolveLifecycleCoordinatorPath(family, params) {
	return buildLifecycleCoordinatorPath(family, resolveLifecycleCoordinatorBase(params));
}
//#endregion
//#region src/infra/state-database-coordinator.ts
const { heldCoordinators, sourceReadScopes, canonicalWriteScopes, coordinatorRuntimeDirectories, gatewaySchemaScopes } = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseCoordinator"), () => ({
	heldCoordinators: /* @__PURE__ */ new Map(),
	sourceReadScopes: new AsyncLocalStorage(),
	canonicalWriteScopes: new AsyncLocalStorage(),
	coordinatorRuntimeDirectories: new AsyncLocalStorage(),
	gatewaySchemaScopes: new AsyncLocalStorage()
}));
function resolveStateLifecycleRuntimeDirectory() {
	const captured = coordinatorRuntimeDirectories.getStore();
	if (captured !== void 0) return captured.directory;
	return process.platform === "win32" ? path.join(os.homedir(), "AppData", "Local", "OpenClaw", "locks") : "/tmp";
}
/** Capture the directory owner's retention policy before crossing an async or worker boundary. */
function captureStateDatabaseCoordinatorRuntime() {
	const captured = coordinatorRuntimeDirectories.getStore();
	return captured ? { ...captured } : {
		directory: resolveStateLifecycleRuntimeDirectory(),
		keepAlive: true
	};
}
function withStateDatabaseCoordinatorRuntimeDirectory(runtime, operation) {
	const captured = typeof runtime === "string" ? {
		directory: runtime,
		keepAlive: false
	} : { ...runtime };
	return coordinatorRuntimeDirectories.run(captured, operation);
}
function resolveStateDatabaseCoordinatorPath(params) {
	return resolveLifecycleCoordinatorPath("state-lifecycle", params);
}
function acquireLifecycleCoordinator(family, params, { keepAlive = false, gatewayOwner = false } = {}) {
	const coordinatorPath = params.coordinatorPath ?? resolveLifecycleCoordinatorPath(family, {
		databasePath: params.databasePath,
		runtimeDirectory: params.runtimeDirectory ?? resolveStateLifecycleRuntimeDirectory(),
		uid: params.uid ?? (typeof process.getuid === "function" ? process.getuid() : void 0)
	});
	if (family === "state-lifecycle") {
		const delegate = acquireDelegatedLifecycleCoordinator(coordinatorPath);
		if (delegate) return delegate;
	}
	let held = heldCoordinators.get(coordinatorPath);
	if (held) {
		if (held.references === 0) throw new SqliteCoordinatorError(`${family} coordinator cleanup is pending; retry its close before reacquiring`);
		held.references += 1;
		held.keepAlive &&= keepAlive;
	} else {
		ensurePrivateSqliteCoordinatorDirectory(path.dirname(coordinatorPath), `${family} coordinator`);
		const coordinator = tryAcquireExclusiveSqliteCoordinator(coordinatorPath, {
			busyTimeoutMs: params.busyTimeoutMs,
			keepAlive
		});
		if (!coordinator) throw new StateDatabaseCoordinatorContentionError(family);
		held = {
			coordinator,
			references: 1,
			keepAlive,
			gatewayOwners: 0,
			gatewayDelegates: /* @__PURE__ */ new Set()
		};
		heldCoordinators.set(coordinatorPath, held);
	}
	if (gatewayOwner) held.gatewayOwners += 1;
	const owner = held;
	let relinquished = false;
	let settled = false;
	return {
		path: coordinatorPath,
		get closed() {
			return settled || relinquished && owner.coordinator.closed;
		},
		release: () => {
			if (settled) return;
			if (!relinquished) {
				relinquished = true;
				if (gatewayOwner) {
					owner.gatewayOwners -= 1;
					if (owner.gatewayOwners === 0) for (const delegate of owner.gatewayDelegates) Atomics.store(delegate, 0, 0);
				}
				owner.references -= 1;
			}
			if (owner.references > 0) {
				settled = true;
				return;
			}
			try {
				owner.coordinator.release(owner.keepAlive ? void 0 : { keepAlive: false });
			} catch (error) {
				throw new SqliteCoordinatorError(`failed to release ${family} coordinator`, error);
			} finally {
				if (owner.coordinator.closed) {
					settled = true;
					if (heldCoordinators.get(coordinatorPath) === owner) heldCoordinators.delete(coordinatorPath);
				}
			}
		}
	};
}
function resolveGatewaySchemaFencePath(params) {
	return resolveLifecycleCoordinatorPath("gateway-lifecycle", {
		databasePath: params.databasePath,
		runtimeDirectory: params.runtimeDirectory ?? resolveStateLifecycleRuntimeDirectory(),
		uid: params.uid ?? (typeof process.getuid === "function" ? process.getuid() : void 0)
	});
}
/** The broker owns this pin until backend close acknowledges or worker exit joins. */
function tryCreateGatewaySchemaFenceDelegate(params) {
	if (heldCoordinators.size === 0) return;
	const coordinatorPath = resolveGatewaySchemaFencePath(params);
	const owner = heldCoordinators.get(coordinatorPath);
	if (!owner || owner.gatewayOwners === 0) return;
	const live = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
	const retained = acquireLifecycleCoordinator("gateway-lifecycle", {
		...params,
		coordinatorPath
	});
	Atomics.store(live, 0, 1);
	owner.gatewayDelegates.add(live);
	return createCoordinatorDelegate({
		actorId: params.actorId,
		coordinatorPath
	}, live, retained, () => {
		Atomics.store(live, 0, 0);
		owner.gatewayDelegates.delete(live);
	}, "Gateway schema delegate");
}
/** Each broker job retains its parent's physical lifecycle lease through settlement. */
function tryCreateStateLifecycleDelegate(params) {
	if (heldCoordinators.size === 0) return;
	const coordinatorPath = resolveStateDatabaseCoordinatorPath({
		databasePath: params.databasePath,
		runtimeDirectory: resolveStateLifecycleRuntimeDirectory(),
		uid: typeof process.getuid === "function" ? process.getuid() : void 0
	});
	if (!heldCoordinators.has(coordinatorPath)) return;
	const retained = acquireStateDatabaseCoordinator({ databasePath: params.databasePath });
	const live = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
	Atomics.store(live, 0, 1);
	return createCoordinatorDelegate({
		actorId: params.actorId,
		coordinatorPath
	}, live, retained, () => {
		Atomics.store(live, 0, 0);
	}, "State lifecycle delegate");
}
const shouldKeepStateCoordinatorAlive = (params) => params.keepAlive !== false && params.coordinatorPath === void 0 && params.runtimeDirectory === void 0 && (coordinatorRuntimeDirectories.getStore()?.keepAlive ?? true);
function acquireStateDatabaseCoordinator(params) {
	const keepAlive = shouldKeepStateCoordinatorAlive(params);
	const base = resolveLifecycleCoordinatorBase({
		databasePath: params.databasePath,
		runtimeDirectory: params.runtimeDirectory ?? resolveStateLifecycleRuntimeDirectory(),
		uid: params.uid ?? (typeof process.getuid === "function" ? process.getuid() : void 0)
	});
	const handlesPath = buildLifecycleCoordinatorPath("state-handles", base);
	const writeScope = canonicalWriteScopes.getStore()?.get(handlesPath);
	if (writeScope) {
		if (!writeScope.active) throw new SqliteCoordinatorError("SQLite binding write scope is no longer current");
		writeScope.assertCurrent();
		return acquireLifecycleCoordinator("state-lifecycle", params, { keepAlive: shouldKeepStateCoordinatorAlive(params) });
	} else if (heldCoordinators.has(handlesPath)) throw new StateDatabaseCoordinatorContentionError("state-handles");
	return acquireLifecycleCoordinator("state-lifecycle", {
		...params,
		coordinatorPath: params.coordinatorPath ?? buildLifecycleCoordinatorPath("state-lifecycle", base)
	}, { keepAlive });
}
/** Fence schema mutation against another process's live Gateway owner. */
function withStateSchemaFence(params, operation) {
	const delegatePath = resolveGatewaySchemaFencePath(params);
	const delegate = gatewaySchemaScopes.getStore()?.get(delegatePath);
	if (delegate) {
		if (!delegate.active) throw new SqliteCoordinatorError("Gateway schema delegate scope is closed");
		delegate.assertCurrent();
		return runWithSqliteCoordinator({ release() {} }, "state schema mutation", operation);
	}
	let coordinator;
	try {
		coordinator = acquireLifecycleCoordinator("gateway-lifecycle", {
			...params,
			coordinatorPath: delegatePath,
			busyTimeoutMs: 0
		});
	} catch (error) {
		if (error instanceof StateDatabaseCoordinatorContentionError) throw new StateSchemaMutationConflictError(params.databasePath, error);
		throw error;
	}
	return runWithSqliteCoordinator(coordinator, "state schema mutation", operation);
}
function resolveStateDatabaseHandleReadContext(params) {
	const pathname = params.coordinatorPath ?? resolveLifecycleCoordinatorPath("state-handles", {
		databasePath: params.databasePath,
		runtimeDirectory: params.runtimeDirectory ?? resolveStateLifecycleRuntimeDirectory(),
		uid: params.uid ?? (typeof process.getuid === "function" ? process.getuid() : void 0)
	});
	const writeScope = canonicalWriteScopes.getStore()?.get(pathname);
	if (writeScope) {
		if (!writeScope.active) throw new SqliteCoordinatorError("SQLite binding write scope is no longer current");
		writeScope.assertCurrent();
		return {
			pathname,
			scope: writeScope
		};
	}
	const sourceScope = sourceReadScopes.getStore()?.get(pathname);
	if (sourceScope?.active) {
		sourceScope.assertCurrent();
		return {
			pathname,
			scope: sourceScope
		};
	}
	if (heldCoordinators.has(pathname)) throw new StateDatabaseCoordinatorContentionError("state-handles");
	return {
		pathname,
		scope: void 0
	};
}
/** A live cached connection excludes file publication, not other cached connections. */
function acquireStateDatabaseHandleLease(params) {
	const { pathname, scope } = resolveStateDatabaseHandleReadContext(params);
	if (scope) return scope.pin();
	return withSqliteInspectionOperation("coordinator", () => {
		ensurePrivateSqliteCoordinatorDirectory(path.dirname(pathname), "state-handles coordinator");
		const coordinator = tryAcquireSharedSqliteCoordinator(pathname, {
			busyTimeoutMs: params.busyTimeoutMs,
			keepAlive: shouldKeepStateCoordinatorAlive(params)
		});
		if (!coordinator) throw new StateDatabaseCoordinatorContentionError("state-handles");
		return coordinator;
	});
}
function resolveSourceScopePath(databasePath) {
	return resolveLifecycleCoordinatorPath("state-handles", {
		databasePath,
		runtimeDirectory: resolveStateLifecycleRuntimeDirectory(),
		uid: typeof process.getuid === "function" ? process.getuid() : void 0
	});
}
/** Only a live process-local exclusion owner may copy its already-drained source. */
function hasStateDatabaseSourceExclusion(databasePath) {
	const pathname = resolveSourceScopePath(databasePath);
	const scope = sourceReadScopes.getStore()?.get(pathname);
	if (!scope?.active) return false;
	scope.assertCurrent();
	return true;
}
var OpenClawStateDatabaseSchemaMigrationRequiredError = class extends StartupMaintenanceRequiredError {
	constructor(kind, pathname) {
		super(kind, `OpenClaw state database schema migration required (${kind}) at ${pathname}; run openclaw doctor --fix to migrate it.`);
		this.kind = kind;
		this.pathname = pathname;
		this.name = "OpenClawStateDatabaseSchemaMigrationRequiredError";
	}
};
/** Runtime readers report malformed legacy state without entering repair mode. */
function normalizeOpenClawStateSchemaReadError(error, pathname) {
	if (error instanceof Error && error.message.startsWith(`malformed database schema (idx_skill_workshop_collection_reviews_workspace_time)`)) {
		const required = new OpenClawStateDatabaseSchemaMigrationRequiredError("legacy-workshop-review-index", pathname);
		required.cause = error;
		return required;
	}
	return error;
}
//#endregion
//#region src/infra/gateway-supervision.ts
const GATEWAY_SUPERVISOR_MODE_ENV = "OPENCLAW_SUPERVISOR_MODE";
function isGatewayExternallySupervised(env = process.env) {
	return env[GATEWAY_SUPERVISOR_MODE_ENV]?.trim().toLowerCase() === "external";
}
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
			if (!createDirectory(path.toNamespacedPath(path.resolve(directoryPath)), security)) throw failure(`CreateDirectoryW(${directoryPath})`);
		}),
		file: (filePath) => withPrivateAttributes(false, (security) => {
			const resolved = path.toNamespacedPath(path.resolve(filePath));
			const handle = createFile(resolved, 3221225472, 3, security, 1, 128, null);
			if (handle === null || BigInt.asIntN(64, koffi.address(handle)) === -1n) throw failure(`CreateFileW(${filePath})`);
			try {
				return fs$1.openSync(resolved, fs$1.constants.O_RDWR | (fs$1.constants.O_NOFOLLOW ?? 0));
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
	if (process.platform !== "win32") return fs$1.mkdtempSync(path.join(rootPath, prefix));
	const directoryPath = path.join(rootPath, `${prefix}${randomUUID()}`);
	createPrivateWindowsDirectory(directoryPath);
	return directoryPath;
}
//#endregion
//#region src/state/openclaw-state-db-schema-helpers.ts
function tableHasColumn(db, tableName, columnName) {
	return tableHasColumns(db, tableName, [columnName]);
}
function tableHasColumns(db, tableName, columnNames) {
	const rows = db.prepare(`PRAGMA table_info(${tableName})`).all();
	const existing = new Set(rows.flatMap((row) => typeof row.name === "string" ? [row.name] : []));
	return columnNames.every((columnName) => existing.has(columnName));
}
function tablePrimaryKeyColumns(db, tableName) {
	return db.prepare(`PRAGMA table_info(${tableName})`).all().filter((row) => Number(row.pk ?? 0) > 0 && typeof row.name === "string").toSorted((left, right) => Number(left.pk ?? 0) - Number(right.pk ?? 0)).map((row) => row.name);
}
function tableExists(db, tableName) {
	return executeWithCachedStatement(db, "SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?", [tableName], (statement) => statement.get(tableName))?.ok === 1;
}
function ensureColumn(db, tableName, columnSql) {
	const columnName = columnSql.trim().split(/\s+/, 1)[0];
	if (!columnName || !tableExists(db, tableName) || tableHasColumn(db, tableName, columnName)) return false;
	db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnSql};`);
	return true;
}
//#endregion
//#region packages/normalization-core/src/mountinfo-path.ts
const MOUNT_PATH_OCTAL_ESCAPE_RE = /\\([0-7]{3})/g;
/** Decodes an octal-escaped path field from a Linux procfs mount table. */
function decodeMountInfoPath(value) {
	return value.replace(MOUNT_PATH_OCTAL_ESCAPE_RE, (_match, octal) => String.fromCharCode(Number.parseInt(octal, 8)));
}
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
			observedAtNs: snapshot.observedAtNs
		});
	} catch {}
}
function sqliteFileBytes(pathname) {
	try {
		return fs$1.statSync(pathname).size;
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
/** The maintenance lifecycle owns this checkpoint result and its last observation. */
function createSqliteWalCheckpoint(options, journalSizeLimitBytes) {
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
			health: options.databasePath ? observeSqliteWalCheckpointHealth(options.databasePath, failed) : failed
		};
		if (options.databasePath) notifyCheckpoint(options.databasePath, snapshot);
		options.onCheckpointError?.(error);
	};
	const recordCheckpoint = (mode, row) => {
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
				health: options.databasePath ? observeSqliteWalCheckpointHealth(options.databasePath, observation) : observation
			};
			if (options.databasePath) notifyCheckpoint(options.databasePath, snapshot);
		} catch (error) {
			recordCheckpointError(error, observation);
			return false;
		}
		if (observation.error !== void 0) options.onCheckpointError?.(sizeError);
		if (busy || observation.warning) {
			const label = options.databaseLabel ?? "sqlite database";
			options.onCheckpointError?.(/* @__PURE__ */ new Error(`${label} WAL checkpoint ${mode} ${busy ? "remained busy" : "blocked by a reader"}`));
		}
		return observation.state === "complete";
	};
	return {
		record: recordCheckpoint,
		recordError: recordCheckpointError,
		inspectIdle(row) {
			const { busy, logFrames, checkpointedFrames } = readCheckpointResult(row);
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
//#region src/infra/sqlite-wal-reclamation.ts
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
			const completed = runCheckpoint(options.checkpointMode ?? "TRUNCATE");
			result.checkpointCompleted = completed;
			result.checkpointCalls++;
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
		if (!checkpoint()) return result;
		const before = freePages();
		result.freePagesBefore = before;
		result.remainingFreePages = before;
		if (!Number.isSafeInteger(before) || before <= 0) return result;
		const pages = Math.min(512, before, options.maxPages ?? 512);
		if (!Number.isSafeInteger(pages) || pages <= 0) throw new Error("SQLite page reclamation requires a positive integer page limit");
		const startedAt = performance$1.now();
		let entered = false;
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
		} catch (error) {
			if (entered || !isSqliteLockError(error)) throw error;
			return result;
		} finally {
			result.vacuumMs += performance$1.now() - startedAt;
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
		return fs$1.statSync(pathname, { bigint: true });
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
		descriptors = fs$1.readdirSync(PROC_SELF_FD_PATH);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	}
	const sidecarPaths = [`${databasePath}-wal`, `${databasePath}-shm`];
	for (const descriptorName of descriptors) {
		const descriptorPath = path.join(PROC_SELF_FD_PATH, descriptorName);
		let linkedPath;
		try {
			linkedPath = fs$1.readlinkSync(descriptorPath);
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) continue;
			throw error;
		}
		const sidecarPath = sidecarPaths.find((candidate) => linkedPath === candidate || linkedPath === `${candidate} (deleted)`);
		if (!sidecarPath) continue;
		let descriptor;
		try {
			descriptor = fs$1.fstatSync(Number(descriptorName), { bigint: true });
		} catch (error) {
			if (hasErrnoCode(error, "EBADF") || hasErrnoCode(error, "ENOENT")) continue;
			throw error;
		}
		try {
			if (fs$1.readlinkSync(descriptorPath) !== linkedPath) continue;
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
		fs$1.writeSync(2, `${JSON.stringify({
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
function cancelSqliteWalWriteAdmission(database) {
	admissions.get(database)?.cancel?.();
}
function createSqliteWalMaintenanceScheduler(database, operation, onError) {
	let pending = false;
	return () => {
		const admission = admissions.get(database);
		if (!admission) operation();
		else if (!pending) {
			pending = true;
			admission.admit(operation).catch(onError).finally(() => {
				pending = false;
			});
		}
	};
}
//#endregion
//#region src/infra/sqlite-wal.ts
const DEFAULT_SQLITE_WAL_AUTOCHECKPOINT_PAGES = 1e3;
const DEFAULT_SQLITE_WAL_CHECKPOINT_INTERVAL_MS = 18e5;
const DEFAULT_SQLITE_WAL_JOURNAL_SIZE_LIMIT_BYTES = 67108864;
const LINUX_NFS_SUPER_MAGIC = 26985;
const LINUX_SMB_SUPER_MAGIC = 20859;
const LINUX_CIFS_SUPER_MAGIC = 4283649346;
const LINUX_SMB2_SUPER_MAGIC = 4266872130;
const LINUX_V9FS_SUPER_MAGIC = 16914839;
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
const JOURNAL_MODE_RETRY_INTERVAL_MS = 10;
const JOURNAL_MODE_RETRY_SLEEP = new Int32Array(new SharedArrayBuffer(4));
const log$1 = createSubsystemLogger("infra/sqlite-wal");
const runInSqliteMaintenanceContext = AsyncLocalStorage.snapshot();
function configureSqliteBusyTimeout(db, busyTimeoutMs) {
	const normalizedTimeoutMs = normalizeSqliteNonNegativeInteger(busyTimeoutMs, "busyTimeoutMs");
	db.exec(`PRAGMA busy_timeout = ${normalizedTimeoutMs};`);
	return normalizedTimeoutMs;
}
function enableIncrementalAutoVacuumForFreshDatabase(db) {
	if (db.prepare("PRAGMA page_count").get()?.page_count === 0) db.exec("PRAGMA auto_vacuum = INCREMENTAL;");
}
/**
* Configure lock retry before inspecting or mutating a fresh database header.
* Concurrent first opens can otherwise fail before schema transactions begin.
*/
function configureSqlitePreSchemaPragmas(db, options = {}) {
	if (options.busyTimeoutMs !== void 0) configureSqliteBusyTimeout(db, options.busyTimeoutMs);
	enableIncrementalAutoVacuumForFreshDatabase(db);
}
function findExistingVolumePaths(targetPath) {
	let current = path.resolve(targetPath);
	while (true) {
		let stats;
		try {
			stats = fs$1.statSync(current);
		} catch {
			const parent = path.dirname(current);
			if (parent === current) return null;
			current = parent;
			continue;
		}
		const existingPath = fs$1.realpathSync(current);
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
		const linuxMatch = /^(.+) on (.+) type ([^,\s)]+) \(/.exec(line);
		if (linuxMatch) {
			const source = linuxMatch[1];
			const mountPoint = linuxMatch[2];
			const fsType = linuxMatch[3];
			if (source && mountPoint && fsType) entries.push({
				source,
				mountPoint,
				fsType
			});
			continue;
		}
		const bsdMatch = /^(.+) on (.+) \(([^,\s)]+)/.exec(line);
		if (bsdMatch) {
			const source = bsdMatch[1];
			const mountPoint = bsdMatch[2];
			const fsType = bsdMatch[3];
			if (source && mountPoint && fsType) entries.push({
				source,
				mountPoint,
				fsType
			});
		}
	}
	return entries;
}
function isMountCommandTimeout(error) {
	return error !== null && typeof error === "object" && "code" in error && error.code === "ETIMEDOUT";
}
function readMountEntries() {
	try {
		return {
			ok: true,
			value: parseProcMountInfoEntries(fs$1.readFileSync(PROC_MOUNTINFO_PATH, "utf8"))
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
		return isMountCommandTimeout(error) ? {
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
function resolveMountEntryJournalPolicy(targetPath, mountEntries) {
	const mountEntry = mountEntries.filter((entry) => isPathWithinMount(targetPath, entry.mountPoint)).toSorted((a, b) => b.mountPoint.length - a.mountPoint.length)[0];
	return mountEntry ? resolveMountTypeJournalPolicy(mountEntry) : "wal";
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
			return isWindowsUncPath(path.win32.normalize(fs$1.realpathSync.native(targetPath))) ? "rollback" : "wal";
		} catch {
			return "rollback";
		}
	}
	const checkedPaths = findExistingVolumePaths(targetPath);
	if (!checkedPaths) return "wal";
	const mountLookupPaths = [checkedPaths.originalPath, checkedPaths.canonicalPath];
	if (typeof fs$1.statfsSync !== "function") return combineMountEntryJournalPolicies(mountLookupPaths);
	try {
		const filesystemType = fs$1.statfsSync(checkedPaths.canonicalPath).type;
		if (filesystemType === LINUX_NFS_SUPER_MAGIC || filesystemType === LINUX_SMB_SUPER_MAGIC || filesystemType === LINUX_CIFS_SUPER_MAGIC || filesystemType === LINUX_SMB2_SUPER_MAGIC || filesystemType === LINUX_V9FS_SUPER_MAGIC) return "rollback";
	} catch {
		return combineMountEntryJournalPolicies(mountLookupPaths);
	}
	return combineMountEntryJournalPolicies(mountLookupPaths);
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
				configureSqliteBusyTimeout(db, 0);
				restoreBusyTimeout = true;
			}
			Atomics.wait(JOURNAL_MODE_RETRY_SLEEP, 0, 0, Math.min(JOURNAL_MODE_RETRY_INTERVAL_MS, remainingMs));
		}
	} finally {
		if (restoreBusyTimeout) configureSqliteBusyTimeout(db, retryTimeoutMs);
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
	const busyTimeoutMs = options.busyTimeoutMs === void 0 ? 0 : configureSqliteBusyTimeout(db, options.busyTimeoutMs);
	const autoCheckpointPages = normalizeSqliteNonNegativeInteger(options.autoCheckpointPages ?? DEFAULT_SQLITE_WAL_AUTOCHECKPOINT_PAGES, "autoCheckpointPages");
	const checkpointIntervalMs = normalizeSqliteNonNegativeInteger(options.checkpointIntervalMs ?? DEFAULT_SQLITE_WAL_CHECKPOINT_INTERVAL_MS, "checkpointIntervalMs");
	const timerIntervalMs = Math.min(checkpointIntervalMs, MAX_TIMER_TIMEOUT_MS);
	const checkpointMode = options.checkpointMode ?? "TRUNCATE";
	const periodicCheckpointMode = options.checkpointMode ?? "PASSIVE";
	const journalPolicy = options.databasePath ? resolvePathJournalPolicy(options.databasePath) : "wal";
	if (journalPolicy === "unsupported") refuseUnsupportedFilesystem(options);
	if (journalPolicy === "rollback") {
		requireRollbackJournalMode(db, options);
		return {
			checkpoint: () => true,
			reclaimFreePages: (reclaimOptions = {}) => reclaimSqliteWalFreePages(db, () => true, reclaimOptions),
			close: () => true
		};
	}
	if (!enableWalJournalMode(db, busyTimeoutMs, options)) return {
		checkpoint: () => true,
		reclaimFreePages: (reclaimOptions = {}) => reclaimSqliteWalFreePages(db, () => true, reclaimOptions),
		close: () => true
	};
	enableMacosCheckpointFullfsync(db);
	db.exec(`PRAGMA wal_autocheckpoint = ${autoCheckpointPages};`);
	db.exec(`PRAGMA journal_size_limit = ${DEFAULT_SQLITE_WAL_JOURNAL_SIZE_LIMIT_BYTES};`);
	const tripwireDatabasePath = process.platform === "linux" && options.databasePath && fs$1.existsSync(options.databasePath) ? fs$1.realpathSync.native(options.databasePath) : void 0;
	let invalidated = false;
	let splitBrainDetectionEnabled = Boolean(tripwireDatabasePath);
	let splitBrainDetectionWarningLogged = false;
	const checkpointOwner = createSqliteWalCheckpoint(options, DEFAULT_SQLITE_WAL_JOURNAL_SIZE_LIMIT_BYTES);
	const runCheckpoint = (mode) => {
		try {
			return checkpointOwner.record(mode, db.prepare(`PRAGMA wal_checkpoint(${mode});`).get());
		} catch (error) {
			checkpointOwner.recordError(error);
			return false;
		}
	};
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
	let timer = null;
	const maintain = createSqliteWalMaintenanceScheduler(db, () => {
		if (!timer || invalidated) return;
		runMaintenance(() => {
			const checkpointed = reclaimSqliteWalFreePages(db, runCheckpoint, { checkpointMode: periodicCheckpointMode }).checkpointCompleted;
			if (checkpointed && periodicCheckpointMode === "PASSIVE" && (checkpointOwner.health?.walBytes ?? 0) > DEFAULT_SQLITE_WAL_JOURNAL_SIZE_LIMIT_BYTES) runWithSqliteBusyTimeout(db, 0, () => runCheckpoint("TRUNCATE"));
			return checkpointed;
		});
	}, (error) => checkpointOwner.recordError(error));
	if (timerIntervalMs > 0) {
		timer = runInSqliteMaintenanceContext(() => setInterval(() => {
			if (!timer || invalidated) return;
			if (tripwireDatabasePath && splitBrainDetectionEnabled) {
				let splitBrain;
				try {
					splitBrain = detectSqliteWalSplitBrain(tripwireDatabasePath);
				} catch (error) {
					splitBrainDetectionEnabled = false;
					if (!splitBrainDetectionWarningLogged) {
						splitBrainDetectionWarningLogged = true;
						log$1.warn("SQLite WAL split-brain detection disabled", {
							databaseLabel: options.databaseLabel,
							databasePath: tripwireDatabasePath,
							error: error instanceof Error ? error.message : String(error)
						});
					}
				}
				if (splitBrain) {
					invalidated = true;
					if (timer) {
						clearInterval(timer);
						timer = null;
					}
					terminateForSqliteWalSplitBrain(splitBrain, options.databaseLabel);
				}
			}
			maintain();
		}, timerIntervalMs));
		timer.unref?.();
	}
	return {
		get health() {
			return checkpointOwner.health;
		},
		checkpoint,
		reclaimFreePages,
		inspectIdle: () => runMaintenance(() => checkpointOwner.inspectIdle(db.prepare("PRAGMA wal_checkpoint(PASSIVE);").get())) ? "healthy" : "retire",
		close: (closeOptions) => {
			clearInterval(timer ?? void 0);
			timer = null;
			cancelSqliteWalWriteAdmission(db);
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
const SNAPSHOT_RETRY_BASE_MS = 10;
const SNAPSHOT_RETRY_MAX_MS = 80;
function snapshotRetryDelayMs(attempt) {
	if (attempt + 1 >= 10) return 0;
	return Math.min(SNAPSHOT_RETRY_MAX_MS, SNAPSHOT_RETRY_BASE_MS * 2 ** attempt);
}
function waitForSnapshotRetrySync(attempt) {
	const delayMs = snapshotRetryDelayMs(attempt);
	if (delayMs > 0) Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delayMs);
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
function sqliteSnapshotStagingError(tempDir, cause, allocation = false) {
	markSqliteInspectionOperation(cause, "snapshot");
	for (let depth = 0, error = cause; depth < 8 && error instanceof Error; depth += 1) {
		const { code, errcode, path: errorPath } = error;
		if (allocation || ["ENOSPC", "EDQUOT"].includes(code ?? "") || typeof errcode === "number" && [
			13,
			778,
			1034,
			1290
		].includes(errcode) || `${errorPath ?? ""}${path.sep}`.startsWith(`${tempDir}${path.sep}`)) {
			const message = `${cause instanceof Error ? cause.message : String(cause)}${typeof errcode === "number" ? ` (SQLite errcode=${errcode})` : ""}; snapshot staging root ${allocation ? tempDir : path.dirname(tempDir)}: free disk space/quota or set XDG_CACHE_HOME to a writable filesystem`;
			return new Error(message, { cause });
		}
		error = error.cause;
	}
	return cause;
}
function createSqliteSnapshotStagingDirectorySync(root = resolvePrivateSqliteSnapshotStagingRoot(), allowLegacyWorker = false) {
	const owned = createSqliteSnapshotStagingTokenSync(root, allowLegacyWorker);
	registerSnapshotTempDirectory(owned.directory, owned.release);
	return owned.directory;
}
/** Token workers remove disposable payload under their own native retirement fences. */
function createSqliteSnapshotStagingTokenSync(root = resolvePrivateSqliteSnapshotStagingRoot(), allowLegacyWorker = false) {
	const parentDirectory = stagingParent(root);
	const parent = parentDirectory ? acquireSqliteSnapshotToken(parentDirectory, "read") : void 0;
	let directory;
	try {
		directory = createPrivateSqliteTempDirectorySync(root, allowLegacyWorker ? `openclaw-sqlite-readonly-${process.pid}-` : SQLITE_SNAPSHOT_PREFIX);
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
//#endregion
//#region src/infra/sqlite-snapshot-wal-prefix.ts
const WAL_HEADER_BYTES = 32;
const COPY_BUFFER_BYTES = 1048576;
function readWalGeneration(descriptor) {
	const header = Buffer.alloc(WAL_HEADER_BYTES);
	if (readFileWindowFullySync(descriptor, header, 0) !== header.length) return;
	const magic = header.readUInt32BE(0);
	return magic === 931071618 || magic === 931071619 ? header : void 0;
}
function matchesCapturedWalPrefix(source, destination, bytes) {
	const copy = fs$1.openSync(destination, "r");
	try {
		const stat = fs$1.fstatSync(copy);
		if (!stat.isFile() || stat.size !== bytes) return false;
		const sourceBuffer = Buffer.allocUnsafe(Math.min(COPY_BUFFER_BYTES, bytes));
		const copyBuffer = Buffer.allocUnsafe(sourceBuffer.length);
		for (let position = 0; position < bytes; position += sourceBuffer.length) {
			const length = Math.min(sourceBuffer.length, bytes - position);
			const sourceWindow = sourceBuffer.subarray(0, length);
			const copyWindow = copyBuffer.subarray(0, length);
			if (readFileWindowFullySync(source, sourceWindow, position) !== length || readFileWindowFullySync(copy, copyWindow, position) !== length || !sourceWindow.equals(copyWindow)) return false;
		}
		return true;
	} finally {
		fs$1.closeSync(copy);
	}
}
/** Preserve source coordination bytes while SQLite interprets a bounded private WAL. */
function copySqliteWalPrefixSync(source, destination, copyMain, verifyMainCopy) {
	const generation = readWalGeneration(source);
	if (!generation) return;
	copyMain();
	const walBytes = fs$1.fstatSync(source).size;
	if (!Number.isSafeInteger(walBytes) || walBytes < generation.length) return false;
	const target = fs$1.openSync(destination, "wx", 384);
	try {
		const buffer = Buffer.allocUnsafe(Math.min(COPY_BUFFER_BYTES, walBytes));
		for (let position = 0; position < walBytes;) {
			const window = buffer.subarray(0, Math.min(buffer.length, walBytes - position));
			if (readFileWindowFullySync(source, window, position) !== window.length) return false;
			if (position === 0 && !window.subarray(0, generation.length).equals(generation)) return false;
			for (let offset = 0; offset < window.length;) {
				const written = fs$1.writeSync(target, window, offset, window.length - offset, position + offset);
				if (written <= 0) throw new Error("SQLite WAL snapshot write made no progress");
				offset += written;
			}
			position += window.length;
		}
		fs$1.fsyncSync(target);
	} finally {
		fs$1.closeSync(target);
	}
	return verifyMainCopy() && matchesCapturedWalPrefix(source, destination, walBytes) && readWalGeneration(source)?.equals(generation) === true;
}
//#endregion
//#region src/infra/sqlite-source-handle.ts
function withSqliteSourceHandle(pathname, operation) {
	return runWithSqliteCoordinator(acquireStateDatabaseHandleLease({
		databasePath: pathname,
		busyTimeoutMs: 0
	}), "SQLite source read", operation);
}
//#endregion
//#region src/infra/sqlite-readonly-location.ts
const SQLITE_HEADER_BYTES = 20;
const SQLITE_JOURNAL_MAGIC = Buffer.from([
	217,
	213,
	5,
	249,
	32,
	161,
	99,
	215
]);
var SqliteSourceChangedError = class extends Error {};
function statIfPresent(pathname) {
	try {
		return fs$1.statSync(pathname, { bigint: true });
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
}
function readSourceSidecars(pathname) {
	return {
		journal: Boolean(statIfPresent(`${pathname}-journal`)),
		shm: Boolean(statIfPresent(`${pathname}-shm`)),
		wal: Boolean(statIfPresent(`${pathname}-wal`))
	};
}
function sameSidecars(left, right) {
	return left.journal === right.journal && left.shm === right.shm && left.wal === right.wal;
}
function openPinnedFile(pathname) {
	let descriptor;
	try {
		descriptor = fs$1.openSync(pathname, "r");
	} catch (error) {
		if (error.code === "ENOENT") throw new SqliteSourceChangedError(`SQLite source disappeared: ${pathname}`);
		throw error;
	}
	try {
		const identity = fs$1.fstatSync(descriptor, { bigint: true });
		const current = statIfPresent(pathname);
		if (!identity.isFile() || !current?.isFile() || !sameFileIdentity(identity, current)) throw new SqliteSourceChangedError(`SQLite source changed while opening: ${pathname}`);
		return {
			descriptor,
			identity,
			pathname
		};
	} catch (error) {
		fs$1.closeSync(descriptor);
		throw error;
	}
}
function readSourceJournalMode(pathname) {
	const source = openPinnedFile(pathname);
	try {
		const header = Buffer.alloc(SQLITE_HEADER_BYTES);
		const bytesRead = fs$1.readSync(source.descriptor, header, 0, header.length, 0);
		const confirmedHeader = Buffer.alloc(SQLITE_HEADER_BYTES);
		const confirmedBytesRead = fs$1.readSync(source.descriptor, confirmedHeader, 0, confirmedHeader.length, 0);
		assertPinnedIdentityUnchanged(source);
		if (bytesRead === 0 && confirmedBytesRead === 0) return "empty";
		if (bytesRead !== header.length || confirmedBytesRead !== confirmedHeader.length || !header.equals(confirmedHeader) || header.subarray(0, 16).toString("utf8") !== "SQLite format 3\0") return "unknown";
		return header[18] === 2 || header[19] === 2 ? "wal" : "rollback";
	} finally {
		fs$1.closeSync(source.descriptor);
	}
}
function assertPinnedIdentityUnchanged(file) {
	const opened = fs$1.fstatSync(file.descriptor, { bigint: true });
	const current = statIfPresent(file.pathname);
	if (!opened.isFile() || !current?.isFile() || !sameFileIdentity(file.identity, opened) || !sameFileIdentity(file.identity, current)) throw new SqliteSourceChangedError(`SQLite source changed while copying: ${file.pathname}`);
}
function copyPinnedFile(source, targetPath) {
	let target;
	try {
		target = fs$1.openSync(targetPath, "wx", 384);
		copyFileDescriptorSync(source.descriptor, target);
		fs$1.fsyncSync(target);
		assertPinnedIdentityUnchanged(source);
	} finally {
		if (target !== void 0) fs$1.closeSync(target);
	}
}
function copySourceFile(sourcePath, targetPath) {
	const source = openPinnedFile(sourcePath);
	try {
		copyPinnedFile(source, targetPath);
	} finally {
		fs$1.closeSync(source.descriptor);
	}
}
function sourceMatchesCopy(sourcePath, copyPath) {
	const source = openPinnedFile(sourcePath);
	let copy;
	try {
		copy = fs$1.openSync(copyPath, "r");
		if (!fs$1.fstatSync(copy).isFile()) return false;
		const equal = sameFileContentsSync(source.descriptor, copy);
		assertPinnedIdentityUnchanged(source);
		return equal;
	} finally {
		try {
			if (copy !== void 0) fs$1.closeSync(copy);
		} finally {
			fs$1.closeSync(source.descriptor);
		}
	}
}
function assertExpectedSidecars(pathname, expected) {
	if (!sameSidecars(readSourceSidecars(pathname), expected)) throw new SqliteSourceChangedError(`SQLite journal state changed while copying: ${pathname}`);
}
function replaceFile(sourcePath, targetPath) {
	fs$1.rmSync(targetPath, { force: true });
	fs$1.renameSync(sourcePath, targetPath);
}
function rollbackJournalReferencesSuperJournal(journalPath) {
	const descriptor = fs$1.openSync(journalPath, "r");
	try {
		const size = fs$1.fstatSync(descriptor).size;
		if (size < 16) return false;
		const trailer = Buffer.allocUnsafe(16);
		if (fs$1.readSync(descriptor, trailer, 0, trailer.length, size - trailer.length) !== trailer.length) return false;
		const nameBytes = trailer.readUInt32BE(0);
		return nameBytes > 0 && nameBytes <= size - 20 && trailer.subarray(8).equals(SQLITE_JOURNAL_MAGIC);
	} finally {
		fs$1.closeSync(descriptor);
	}
}
function recoverPrivateJournalCopy(snapshotPath) {
	if (rollbackJournalReferencesSuperJournal(`${snapshotPath}-journal`)) throw new Error(`SQLite hot rollback journal references a super-journal and cannot be recovered privately: ${snapshotPath}`);
	const snapshot = openNodeSqliteDatabase(snapshotPath);
	try {
		snapshot.exec("PRAGMA busy_timeout = 30000; PRAGMA trusted_schema = OFF;");
		snapshot.prepare("PRAGMA schema_version;").get();
	} finally {
		snapshot.close();
	}
	fs$1.rmSync(`${snapshotPath}-journal`, { force: true });
	const descriptor = fs$1.openSync(snapshotPath, "r+");
	try {
		fs$1.fsyncSync(descriptor);
	} finally {
		fs$1.closeSync(descriptor);
	}
}
function publishPreparedCopy(directory) {
	const location = path.join(directory, "database.sqlite");
	for (const suffix of [
		"-wal",
		"-shm",
		"-journal",
		""
	]) {
		const staged = `${location}.partial${suffix}`;
		if (fs$1.existsSync(staged)) fs$1.renameSync(staged, `${location}${suffix}`);
	}
	return adoptPreparedLocation(location, directory);
}
function createStableReadOnlyCopyInTempDirectory(pathname, journalMode, existingTempDir, stagingRoot = existingTempDir ? path.dirname(existingTempDir) : resolvePrivateSqliteSnapshotStagingRoot()) {
	let tempDir = existingTempDir;
	try {
		tempDir ??= createSqliteSnapshotStagingDirectorySync(stagingRoot);
		const snapshotPath = path.join(tempDir, "database.sqlite.partial");
		const firstPath = path.join(tempDir, "first");
		if (process.platform !== "win32") fs$1.chmodSync(tempDir, 448);
		if (readSourceJournalMode(pathname) !== journalMode) throw new SqliteSourceChangedError(`SQLite journal mode changed before copying: ${pathname}`);
		const sidecars = readSourceSidecars(pathname);
		let copiedWalPrefix = false;
		if (journalMode === "wal" && sidecars.wal && !sidecars.journal) {
			const wal = openPinnedFile(`${pathname}-wal`);
			try {
				const copied = copySqliteWalPrefixSync(wal.descriptor, `${snapshotPath}-wal`, () => copySourceFile(pathname, snapshotPath), () => sourceMatchesCopy(pathname, snapshotPath));
				assertPinnedIdentityUnchanged(wal);
				if (copied === false) throw new SqliteSourceChangedError(`SQLite WAL generation changed while copying: ${pathname}`);
				copiedWalPrefix = copied === true;
			} finally {
				fs$1.closeSync(wal.descriptor);
			}
		}
		const sidecarSuffixes = [...sidecars.journal ? ["-journal"] : [], ...sidecars.wal ? ["-wal"] : []];
		if (copiedWalPrefix) assertExpectedSidecars(pathname, sidecars);
		else if (sidecarSuffixes.length > 0) {
			for (const suffix of sidecarSuffixes) copySourceFile(`${pathname}${suffix}`, `${snapshotPath}${suffix}`);
			copySourceFile(pathname, snapshotPath);
			for (const suffix of sidecarSuffixes) if (!sourceMatchesCopy(`${pathname}${suffix}`, `${snapshotPath}${suffix}`)) throw new SqliteSourceChangedError(`SQLite ${suffix === "-wal" ? "WAL" : "rollback journal"} changed while copying: ${pathname}`);
			assertExpectedSidecars(pathname, sidecars);
		} else {
			copySourceFile(pathname, firstPath);
			assertExpectedSidecars(pathname, sidecars);
			const mainUnchanged = sourceMatchesCopy(pathname, firstPath);
			assertExpectedSidecars(pathname, sidecars);
			if (!mainUnchanged) throw new SqliteSourceChangedError(`SQLite main database changed while copying: ${pathname}`);
			replaceFile(firstPath, snapshotPath);
		}
		if (readSourceJournalMode(pathname) !== journalMode) throw new SqliteSourceChangedError(`SQLite journal mode changed while copying: ${pathname}`);
		if (sidecars.journal) recoverPrivateJournalCopy(snapshotPath);
		return publishPreparedCopy(tempDir);
	} catch (error) {
		if (tempDir && existingTempDir === void 0) removeTempDirectory(tempDir);
		throw sqliteSnapshotStagingError(tempDir ?? stagingRoot, error, !tempDir);
	}
}
function prepareReadOnlySourceSyncInProcess(pathname, stagingRoot) {
	const canonicalPath = fs$1.realpathSync.native(pathname);
	let lastChange;
	for (let attempt = 0; attempt < 10; attempt += 1) try {
		return createStableReadOnlyCopyInTempDirectory(canonicalPath, readSourceJournalMode(canonicalPath), void 0, stagingRoot);
	} catch (error) {
		if (!(error instanceof SqliteSourceChangedError)) throw error;
		lastChange = error;
		waitForSnapshotRetrySync(attempt);
	}
	throw new SqliteSourceChangedError(`SQLite source did not stabilize after 10 read-only inspection attempts (the database may be under concurrent write activity): ${canonicalPath}. Wait a moment for write activity to settle, then retry the inspection`, { cause: lastChange });
}
function prepareSqliteReadOnlyLocationSyncInProcess(pathname, stagingRoot) {
	return withSqliteSourceHandle(pathname, () => prepareReadOnlySourceSyncInProcess(pathname, stagingRoot));
}
//#endregion
//#region src/infra/sqlite-worker-identity.ts
function existingIdentity(file, canonicalFile, canonicalPath) {
	if (!file.isFile()) throw new Error("SQLite worker database path must identify a regular file");
	if (file.dev !== canonicalFile.dev || file.ino !== canonicalFile.ino) throw new Error("SQLite database pathname changed during admission");
	return {
		key: `file:${file.dev}:${file.ino}`,
		canonicalPath
	};
}
/** Inspect a native-owner path without replacing its diagnostic for a non-file target. */
function inspectDatabasePathIdentitySync(databasePath) {
	const resolvedPath = path.resolve(databasePath);
	let file;
	try {
		file = statSync(resolvedPath, { bigint: true });
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
	}
	if (file) {
		if (!file.isFile()) return;
		const canonicalPath = realpathSync(resolvedPath);
		return existingIdentity(file, statSync(canonicalPath, { bigint: true }), canonicalPath);
	}
	const missing = [];
	let ancestor = resolvedPath;
	while (true) try {
		const canonicalPath = path.join(realpathSync(ancestor), ...missing);
		return {
			key: `path:${canonicalPath}`,
			canonicalPath
		};
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
		missing.unshift(path.basename(ancestor));
		const parent = path.dirname(ancestor);
		if (parent === ancestor) throw error;
		ancestor = parent;
	}
}
/** Capture identity before yielding; worker admission requires a regular file or absent path. */
function readDatabasePathIdentitySync(databasePath) {
	const identity = inspectDatabasePathIdentitySync(databasePath);
	if (!identity) throw new Error("SQLite worker database path must identify a regular file");
	return identity;
}
async function readDatabasePathIdentity(databasePath) {
	const file = await stat(databasePath, { bigint: true }).catch((error) => {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	});
	if (file) {
		const canonicalPath = await realpath(databasePath);
		return existingIdentity(file, await stat(canonicalPath, { bigint: true }), canonicalPath);
	}
	const missing = [];
	let ancestor = databasePath;
	while (true) try {
		const canonicalPath = path.join(await realpath(ancestor), ...missing);
		return {
			key: `path:${canonicalPath}`,
			canonicalPath
		};
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
		missing.unshift(path.basename(ancestor));
		const parent = path.dirname(ancestor);
		if (parent === ancestor) throw error;
		ancestor = parent;
	}
}
function assertExistingDatabaseIdentity(databasePath, expected) {
	const file = statSync(databasePath, { bigint: true });
	if (!file.isFile() || `file:${file.dev}:${file.ino}` !== expected) throw new Error("SQLite database file identity changed before existing-only open");
}
resolveGlobalSingleton(Symbol.for("openclaw.sqliteSnapshotFlights"), () => /* @__PURE__ */ new Map());
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
	const fd = fs$1.openSync(pathname, "r");
	try {
		const before = fs$1.fstatSync(fd, { bigint: true });
		assertRegularFile(before);
		const { sha256 } = hashFileDescriptorSync(fd);
		const after = fs$1.fstatSync(fd, { bigint: true });
		const current = fs$1.statSync(pathname, { bigint: true });
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
		fs$1.closeSync(fd);
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
function parseFileFingerprint(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("SQLite file fingerprint must be an object");
	const fingerprint = value;
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
	const value = JSON.parse(serialized);
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("SQLite file generation must be an object");
	const generation = value;
	return {
		database: parseFileFingerprint(generation.database),
		...generation.journal === void 0 ? {} : { journal: parseFileFingerprint(generation.journal) },
		...generation.wal === void 0 ? {} : { wal: parseFileFingerprint(generation.wal) }
	};
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
function runSqliteIntegrityOperationSync(operation) {
	let step = operation.next();
	while (!step.done) {
		try {
			runSqliteIntegrityCheckSync(step.value);
		} catch (error) {
			step = operation.throw(error);
			continue;
		}
		step = operation.next();
	}
	return step.value;
}
const MAX_REPORTED_FOREIGN_KEY_VIOLATIONS = 5;
var SqliteRepairableForeignKeyError = class extends Error {
	constructor(databaseLabel, orphanCount) {
		super(`SQLite foreign_key_check failed for ${databaseLabel}: repairable task_delivery_state.task_id references task_runs.task_id cascade-owned orphans (${orphanCount} rows). Run openclaw doctor --fix to preserve and repair these rows before retrying.`);
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
function assertSqliteIntegrity(database, databaseLabel, check = "integrity_check") {
	const integrityCheck = runSqliteCheck(database, databaseLabel, check);
	runSqliteForeignKeyCheck(database, databaseLabel);
	return { integrityCheck };
}
/** Require table and associated index consistency before trusting indexed reads. */
function assertSqliteTableIntegrity(database, databaseLabel, tableName) {
	runSqliteCheck(database, `${databaseLabel} table ${tableName}`, "integrity_check", tableName);
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
	throw createSqliteIntegrityError(`SQLite ${pragma} failed for ${databaseLabel}: ${results.map((result) => String(result)).join("; ") || "no result"}`);
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
//#region src/state/openclaw-state-db-async-lifecycle.ts
const STATE_DATABASE_READ_ADMISSION_INVALIDATED = "STATE_DATABASE_READ_ADMISSION_INVALIDATED";
var StateDatabaseReadAdmissionInvalidatedError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.code = STATE_DATABASE_READ_ADMISSION_INVALIDATED;
	}
};
const maintenanceResources = resolveGlobalSingleton(Symbol.for("openclaw.databaseMaintenanceResources"), () => ({
	current: new AsyncLocalStorage(),
	claims: /* @__PURE__ */ new WeakMap(),
	parents: /* @__PURE__ */ new WeakMap()
}));
function getOpenClawDatabaseMaintenanceScope() {
	return maintenanceResources.current.getStore()?.scope;
}
function isOpenClawDatabaseMaintenanceResourceOwned(resource, scope) {
	return maintenanceResources.claims.get(resource)?.scope === scope;
}
/** A cached handle used by an independent caller remains with the ordinary cache owner. */
function observeOpenClawDatabaseMaintenanceResource(resource) {
	if (!resource) return;
	const claim = maintenanceResources.claims.get(resource);
	const current = getOpenClawDatabaseMaintenanceScope();
	if (!claim) return;
	const owner = commonMaintenanceAncestor(claim.scope, current);
	if (owner === claim.scope) return;
	claim.release();
	maintenanceResources.claims.delete(resource);
	if (owner) owner.own(resource, claim.phase, claim.close);
}
function commonMaintenanceAncestor(owner, scope) {
	const ancestors = /* @__PURE__ */ new Set();
	for (let current = owner; current; current = maintenanceResources.parents.get(current)) ancestors.add(current);
	for (let current = scope; current; current = maintenanceResources.parents.get(current)) if (ancestors.has(current)) return current;
}
/** The cache owns physical identity and admission across drainage and file exclusion. */
function createOpenClawStateDatabaseAsyncLifecycle() {
	const resources = /* @__PURE__ */ new Set();
	const records = /* @__PURE__ */ new Map();
	const seals = /* @__PURE__ */ new Set();
	const attempts = /* @__PURE__ */ new Map();
	let tail = Promise.resolve();
	const known = (pathname) => {
		const resolvedPath = path.resolve(pathname);
		return [...records.values()].find((record) => record.paths.has(resolvedPath));
	};
	const overlaps = (left, right) => left.identity.key === right.identity.key || [...left.paths].some((pathname) => right.paths.has(pathname));
	const isSealed = (record) => [...seals].some((held) => held.record === void 0 || overlaps(held.record, record));
	const assertOpen = (record) => {
		if (isSealed(record)) throw new StateDatabaseReadAdmissionInvalidatedError("OpenClaw state database read admission is closed");
	};
	const findPhysicalRecord = (identity) => {
		const record = records.get(identity.key);
		if (!record || !identity.key.startsWith("file:") || record.paths.has(identity.canonicalPath) || isSealed(record)) return record;
		if ([...record.paths].some((pathname) => inspectDatabasePathIdentitySync(pathname)?.key === identity.key)) return record;
		invalidate(record);
		forget(record);
	};
	const resolve = (pathname, preparedIdentity) => {
		const resolvedPath = path.resolve(pathname);
		const cached = known(resolvedPath);
		if (cached && (!preparedIdentity || cached.identity.key === preparedIdentity.key)) return !preparedIdentity && cached.identity.key.startsWith("path:") ? resolve(resolvedPath, readDatabasePathIdentitySync(resolvedPath)) : cached;
		const identity = preparedIdentity ?? readDatabasePathIdentitySync(resolvedPath);
		let record = findPhysicalRecord(identity);
		if (!record && identity.key.startsWith("file:")) {
			record = [...records.values()].find((candidate) => {
				if (!candidate.identity.key.startsWith("path:")) return false;
				try {
					return readDatabasePathIdentitySync(candidate.identity.canonicalPath).key === identity.key;
				} catch {
					return false;
				}
			});
			if (record) {
				records.delete(record.identity.key);
				record.identity = identity;
				records.set(identity.key, record);
			}
		}
		if (!record) {
			record = {
				identity,
				paths: /* @__PURE__ */ new Set(),
				generation: {}
			};
			records.set(identity.key, record);
		}
		record.paths.add(resolvedPath).add(identity.canonicalPath);
		return record;
	};
	const resolveForNative = (pathname) => {
		const cached = known(pathname);
		if (cached) return cached;
		const identity = inspectDatabasePathIdentitySync(pathname);
		return identity ? resolve(pathname, identity) : void 0;
	};
	const invalidate = (record) => {
		for (const current of record ? [record] : records.values()) current.generation = {};
	};
	const seal = (record) => {
		invalidate(record);
		const held = { record };
		seals.add(held);
		return held;
	};
	const forget = (record) => {
		if (!isSealed(record) && records.get(record.identity.key) === record) records.delete(record.identity.key);
	};
	return {
		identity(pathname) {
			return known(pathname)?.identity ?? inspectDatabasePathIdentitySync(pathname);
		},
		knownIdentity(pathname) {
			return known(pathname)?.identity;
		},
		publish(pathname) {
			const resolvedPath = path.resolve(pathname);
			const identity = readDatabasePathIdentitySync(resolvedPath);
			const previous = known(resolvedPath);
			let record = findPhysicalRecord(identity);
			if (previous && previous.identity.key !== identity.key) {
				if (previous.identity.key.startsWith("path:") && !record) {
					records.delete(previous.identity.key);
					previous.identity = identity;
					records.set(identity.key, previous);
					record = previous;
				} else {
					invalidate(previous);
					forget(previous);
				}
			}
			if (!record) record = resolve(resolvedPath, identity);
			record.paths.add(resolvedPath).add(identity.canonicalPath);
			return identity;
		},
		invalidate(pathname) {
			if (pathname === void 0) invalidate();
			else {
				const record = known(pathname);
				if (record) invalidate(record);
			}
		},
		register(resource) {
			resources.add(resource);
			for (const attempt of attempts.values()) attempt.queue?.add(resource);
			return () => {
				resources.delete(resource);
			};
		},
		capture(pathname) {
			const databasePath = path.resolve(pathname);
			const record = resolve(databasePath);
			assertOpen(record);
			const generation = record.generation;
			return {
				databasePath,
				get identity() {
					return record.identity;
				},
				assertCurrent() {
					assertOpen(record);
					if (records.get(record.identity.key) !== record || record.generation !== generation) throw new StateDatabaseReadAdmissionInvalidatedError("OpenClaw state database read admission changed");
				}
			};
		},
		holdExclusion(pathname) {
			const record = resolve(pathname);
			const held = seal(record);
			return () => {
				seals.delete(held);
				for (const current of records.values()) if (overlaps(record, current)) forget(current);
			};
		},
		close(pathname, retireNative) {
			const record = pathname === void 0 ? void 0 : resolveForNative(pathname);
			if (pathname !== void 0 && !record) return Promise.resolve(retireNative());
			let attempt = attempts.get(record);
			if (attempt?.pending) return attempt.pending;
			if (!attempt) {
				attempt = {
					seal: seal(record),
					retained: /* @__PURE__ */ new Set()
				};
				attempts.set(record, attempt);
			}
			const current = attempt;
			const pending = tail.then(async () => {
				const closing = /* @__PURE__ */ new Set([...resources, ...current.retained]);
				for (const entry of attempts.values()) for (const resource of entry.retained) closing.add(resource);
				current.queue = closing;
				const errors = [];
				while (current.queue.size) {
					const ordinary = [...current.queue].filter((resource) => resource.phase !== "after-resources");
					if (!ordinary.length && errors.length) {
						for (const resource of current.queue) current.retained.add(resource);
						break;
					}
					const batch = ordinary.length ? ordinary : [...current.queue];
					for (const resource of batch) current.queue.delete(resource);
					await Promise.all(batch.map(async (resource) => {
						try {
							await resource.close(record?.identity);
							current.retained.delete(resource);
						} catch (error) {
							current.retained.add(resource);
							errors.push(error);
						}
					}));
				}
				if (errors.length === 1) throw errors[0];
				if (errors.length > 1) throw createSqliteLifecycleAggregateError(errors, "OpenClaw state resource drainage failed", errors[0]);
				const retired = retireNative(record?.identity);
				attempts.delete(record);
				seals.delete(current.seal);
				if (record === void 0) {
					for (const [key, entry] of attempts) if (!entry.pending) {
						attempts.delete(key);
						seals.delete(entry.seal);
					}
					for (const entry of records.values()) forget(entry);
				} else forget(record);
				return retired;
			}).finally(() => {
				current.queue = void 0;
			});
			current.pending = pending;
			tail = pending.then(() => void 0, () => void 0);
			pending.catch(() => {
				current.pending = void 0;
			});
			return pending;
		}
	};
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
//#region src/state/openclaw-state-db.paths.ts
function existingPathOrUndefined(pathname) {
	try {
		statSync(pathname);
		return pathname;
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	}
}
/** Resolve the directory that contains the shared state SQLite file. */
function resolveOpenClawStateSqliteDir(env = process.env) {
	return path.join(resolveStateDir(env), "state");
}
/** Resolve the shared state SQLite file path. */
function resolveOpenClawStateSqlitePath(env = process.env) {
	return path.join(resolveStateDir(env), "state", "openclaw.sqlite");
}
/** Resolve the state owner directory for a canonical or explicit shared database path. */
function resolveOpenClawStateDirForDatabasePath(databasePath) {
	const databaseDir = path.dirname(path.resolve(databasePath));
	return path.basename(databaseDir) === "state" ? path.dirname(databaseDir) : databaseDir;
}
/** Resolve the durable registry form for one agent database path. */
function resolveOpenClawAgentDatabaseStoredPath(registryDatabasePath, agentDatabasePath) {
	const rawStateDir = resolveOpenClawStateDirForDatabasePath(registryDatabasePath);
	const stateDir = process.platform === "win32" ? normalizeWindowsPathPreservingCase(rawStateDir) : rawStateDir;
	const absolutePath = path.resolve(agentDatabasePath);
	const comparisonPath = process.platform === "win32" ? normalizeWindowsPathPreservingCase(absolutePath) : absolutePath;
	if (!path.isAbsolute(stateDir) || !path.isAbsolute(comparisonPath)) return absolutePath;
	const relativePath = path.relative(stateDir, comparisonPath);
	if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) return absolutePath;
	const rawPrefix = [stateDir, path.toNamespacedPath(stateDir)].map((root) => `${root}${root.endsWith(path.sep) ? "" : path.sep}`).find((prefix) => agentDatabasePath.startsWith(prefix));
	return path.isAbsolute(agentDatabasePath) && rawPrefix !== void 0 ? agentDatabasePath.slice(rawPrefix.length) : relativePath;
}
function describeAgentPathMigration(summary) {
	const { relativized, reanchored, deleted } = summary;
	if (relativized === 0 && reanchored.length === 0 && deleted.length === 0) return [];
	const decisions = reanchored.length + deleted.length;
	const counts = [
		`${relativized} relativized`,
		reanchored.length > 0 && `${reanchored.length} re-anchored`,
		deleted.length > 0 && `${deleted.length} removed`
	].filter(Boolean);
	return [
		`Migrated agent database registry paths to state-relative storage${decisions > 0 ? ` (${counts.join(", ")})` : ""}`,
		...reanchored.map((registeredPath) => `Re-anchored agent database registry path ${registeredPath} to the current state directory`),
		...deleted.map((registeredPath) => `Removed duplicate agent database registry path ${registeredPath}`)
	];
}
function warnAgentPathMigration(log, summary, databasePath) {
	if (summary.reanchored.length === 0 && summary.deleted.length === 0) return;
	log.warn("agent database registry rows re-anchored or removed during v9 migration", {
		reanchored: summary.reanchored,
		deleted: summary.deleted,
		path: databasePath
	});
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
function resolveQuarantineStorePath(env) {
	return path.join(resolveOpenClawStateSqliteDir(env), "openclaw-quarantine.sqlite");
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
/** Reject a known state quarantine while retaining best-effort metadata admission. */
function assertOpenClawStateDatabaseNotQuarantined(pathname, env, onNativeCleanupFailure) {
	let quarantineFailure;
	try {
		quarantineFailure = readOpenClawDatabaseQuarantineFailure("state", pathname, { env });
	} catch (error) {
		if (!(error instanceof OpenClawQuarantineReadCleanupError)) throw error;
		onNativeCleanupFailure?.(error);
		return;
	}
	if (quarantineFailure?.cause instanceof OpenClawQuarantineReadCleanupError) onNativeCleanupFailure?.(quarantineFailure.cause);
	if (quarantineFailure) throw quarantineFailure;
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
	const retain = (database, readOnly = false) => {
		const scope = getOpenClawDatabaseMaintenanceScope();
		scope?.assertAdmission();
		operations.assertOpen(database.path);
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
			retainFailedClose: () => operations.retainFailed(database)
		});
		scope?.own(reference, "shared-references", () => reference.release());
		return reference;
	};
	const findReadDatabase = (pathname) => {
		getOpenClawDatabaseMaintenanceScope()?.assertAdmission();
		operations.assertOpen(pathname);
		const database = state.cachedDatabases.get(path.resolve(pathname));
		return database?.db.isOpen ? database : void 0;
	};
	const retainReadReference = (database) => {
		const reference = retain(database, true);
		const assertCurrent = () => {
			if (state.cachedDatabases.get(database.path) !== database || !database.db.isOpen) throw new Error("Shared-state read lost its original native owner");
		};
		return {
			assertCurrent,
			observe() {
				assertCurrent();
				observeOpenClawDatabaseMaintenanceResource(database.db);
			},
			release() {
				reference.release();
				operations.touch(database);
			}
		};
	};
	return {
		retain: (database) => retain(database),
		retainForIndependentRead(pathname) {
			const database = findReadDatabase(pathname);
			return database ? retainReadReference(database) : void 0;
		},
		borrowForRead(pathname) {
			const database = findReadDatabase(pathname);
			if (!database) return;
			if (database.db.isTransaction) throw new Error("Asynchronous shared-state reads cannot run inside a native transaction");
			return {
				database,
				...retainReadReference(database)
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
	return { release() {
		if (released || owner.cleanupComplete) {
			released = true;
			return;
		}
		owner.references.delete(reference);
		if (owner.retirement && !owner.retirement.isCurrent()) {
			owner.retirement = void 0;
			owner.retiring = false;
		}
		if (params.retirement?.isCurrent() && !owner.retirement?.ordinary) owner.retirement = params.retirement;
		if (owner.references.size > 0 || !owner.retirement) {
			released = true;
			return;
		}
		owner.retiring = true;
		try {
			owner.retirement.retire();
		} catch (error) {
			params.retainFailedClose();
			throw error;
		}
		owner.retirement = void 0;
		released = true;
	} };
}
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
		const timer = runInSqliteMaintenanceContext(() => setTimeout(() => {
			idleTimers.delete(database.db);
			try {
				if (database.db.isOpen && (database.db.isTransaction || borrowers.get(database.db)?.references.size || idleReferences.get(database.db)?.size)) {
					touch(database);
					return;
				}
				retire(database, false, {
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
//#region src/state/openclaw-state-db-handle.ts
const handleLeases = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseHandleLeases"), () => /* @__PURE__ */ new WeakMap());
function openTrackedStateDatabase(pathname, options) {
	const result = openTrackedStateDatabaseResult(pathname, options);
	if (result.status === "unavailable") throw result.error;
	return result.database;
}
/** Only native open failure with a released lease is an ordinary read failure. */
function openTrackedStateDatabaseResult(pathname, options) {
	const lease = acquireStateDatabaseHandleLease({
		databasePath: pathname,
		busyTimeoutMs: 0
	});
	try {
		if (options?.expectedIdentity !== void 0) assertExistingDatabaseIdentity(pathname, options.expectedIdentity);
		const location = options?.existingOnly || options?.expectedIdentity !== void 0 ? resolveExistingSqliteFileUri(pathname) : pathname;
		const nativeOptions = options?.readOnly ? {
			readOnly: true,
			timeout: options.timeout
		} : { enableForeignKeyConstraints: options?.enableForeignKeyConstraints };
		const database = withSqliteNativeOpen(() => openNodeSqliteDatabase(location, nativeOptions));
		handleLeases.set(database, lease);
		return {
			status: "available",
			database
		};
	} catch (error) {
		lease.release();
		return {
			status: "unavailable",
			error
		};
	}
}
function closeTrackedStateDatabase(database) {
	try {
		if (database.isOpen) database.close();
	} finally {
		if (!database.isOpen) {
			handleLeases.get(database)?.release();
			handleLeases.delete(database);
		}
	}
}
//#endregion
//#region src/infra/sqlite-schema-sql.ts
const TABLE_CONSTRAINT_KEYWORDS = /* @__PURE__ */ new Set([
	"CHECK",
	"FOREIGN",
	"PRIMARY",
	"UNIQUE"
]);
/** Select canonical DDL without opening a database or changing its installation lifecycle. */
function extractSqliteTableSchema(schema, table, options = {}) {
	const start = schema.indexOf(`CREATE TABLE IF NOT EXISTS ${table} (`);
	const endMarker = options.endMarker ?? "\n) STRICT;";
	const end = schema.indexOf(endMarker, start);
	if (start < 0 || end < start) throw new Error(options.errorMessage ?? `Canonical schema markers are missing for ${table}`);
	return schema.slice(start, end + (options.includeEndMarker === false ? 0 : endMarker.length));
}
function readTableConstraintKeyword(sql, first) {
	let token = first;
	if (token.keyword === "CONSTRAINT") {
		const name = readSqlToken(sql, token.end);
		token = name ? readSqlToken(sql, name.end) : null;
	}
	return token?.keyword && TABLE_CONSTRAINT_KEYWORDS.has(token.keyword) ? token.keyword : null;
}
function readSqlToken(sql, start) {
	let index = start;
	while (index < sql.length && /\s/u.test(sql[index] ?? "")) index += 1;
	const char = sql[index];
	if (!char) return null;
	if (char === "\"" || char === "`") {
		const end = skipSqlQuoted(sql, index, char);
		return {
			end,
			keyword: null,
			raw: sql.slice(index, end)
		};
	}
	if (char === "[") {
		const end = skipSqlQuoted(sql, index, char);
		return {
			end,
			keyword: null,
			raw: sql.slice(index, end)
		};
	}
	let end = index;
	while (end < sql.length && !/[\s(,]/u.test(sql[end] ?? "")) end += 1;
	const raw = sql.slice(index, end);
	return {
		end,
		keyword: raw.toUpperCase(),
		raw
	};
}
function normalizeSqlIdentifier(identifier) {
	if (identifier.startsWith("\"") && identifier.endsWith("\"")) return identifier.slice(1, -1).replaceAll("\"\"", "\"").toLowerCase();
	if (identifier.startsWith("`") && identifier.endsWith("`")) return identifier.slice(1, -1).replaceAll("``", "`").toLowerCase();
	if (identifier.startsWith("[") && identifier.endsWith("]")) return identifier.slice(1, -1).toLowerCase();
	return identifier.toLowerCase();
}
function normalizeSchemaSql(sql) {
	if (sql === null) return null;
	return normalizeSqlWhitespace(sql).replace(/;\s*$/u, "").trim().replace(/^(CREATE (?:TABLE|VIRTUAL TABLE|UNIQUE INDEX|INDEX|TRIGGER)) IF NOT EXISTS /iu, "$1 ");
}
function splitSqlList(sql) {
	const items = [];
	let depth = 0;
	let start = 0;
	let index = 0;
	while (index < sql.length) {
		const next = skipSqlQuotedOrComment(sql, index);
		if (next !== index) {
			index = next;
			continue;
		}
		const char = sql[index];
		if (char === "(") depth += 1;
		else if (char === ")") depth -= 1;
		else if (char === "," && depth === 0) {
			items.push(sql.slice(start, index));
			start = index + 1;
		}
		index += 1;
	}
	items.push(sql.slice(start));
	return items;
}
function findSqlCharacter(sql, character) {
	let index = 0;
	while (index < sql.length) {
		const next = skipSqlQuotedOrComment(sql, index);
		if (next !== index) {
			index = next;
			continue;
		}
		if (sql[index] === character) return index;
		index += 1;
	}
	return -1;
}
function findSqlClosingParenthesis(sql, open) {
	let depth = 0;
	let index = open;
	while (index < sql.length) {
		const next = skipSqlQuotedOrComment(sql, index);
		if (next !== index) {
			index = next;
			continue;
		}
		const char = sql[index];
		if (char === "(") depth += 1;
		else if (char === ")") {
			depth -= 1;
			if (depth === 0) return index;
		}
		index += 1;
	}
	throw new Error("SQLite schema contains an unterminated table definition.");
}
function normalizeSqlWhitespace(sql) {
	let normalized = "";
	let pendingSpace = false;
	const segments = /[^\s'"`[/-]+|\s+|./gsu;
	let segment;
	while (segment = segments.exec(sql)) {
		const index = segment.index;
		const char = segment[0][0] ?? "";
		const quoted = skipSqlQuoted(sql, index, char);
		if (quoted !== index) {
			if (pendingSpace && normalized.length > 0) normalized += " ";
			normalized += sql.slice(index, quoted);
			pendingSpace = false;
			segments.lastIndex = quoted;
			continue;
		}
		const comment = skipSqlComment(sql, index);
		if (comment !== index) {
			pendingSpace = true;
			segments.lastIndex = comment;
			continue;
		}
		if (/\s/u.test(char)) pendingSpace = true;
		else {
			if (pendingSpace && normalized.length > 0) normalized += " ";
			normalized += segment[0];
			pendingSpace = false;
		}
	}
	return normalized.trim();
}
function quoteSqliteIdentifier(identifier) {
	return `"${identifier.replaceAll("\"", "\"\"")}"`;
}
function skipSqlQuotedOrComment(sql, index) {
	const quoted = skipSqlQuoted(sql, index, sql[index] ?? "");
	return quoted !== index ? quoted : skipSqlComment(sql, index);
}
function skipSqlQuoted(sql, index, quote) {
	if (quote !== "'" && quote !== "\"" && quote !== "`" && quote !== "[") return index;
	const closingQuote = quote === "[" ? "]" : quote;
	let cursor = index + 1;
	while (cursor < sql.length) {
		if (sql[cursor] !== closingQuote) {
			cursor += 1;
			continue;
		}
		if (quote !== "[" && sql[cursor + 1] === closingQuote) {
			cursor += 2;
			continue;
		}
		return cursor + 1;
	}
	return sql.length;
}
function skipSqlComment(sql, index) {
	if (sql.startsWith("--", index)) {
		const newline = sql.indexOf("\n", index + 2);
		return newline === -1 ? sql.length : newline + 1;
	}
	if (sql.startsWith("/*", index)) {
		const close = sql.indexOf("*/", index + 2);
		return close === -1 ? sql.length : close + 2;
	}
	return index;
}
//#endregion
//#region src/infra/sqlite-schema-contract-assembly.ts
function createSqliteTableContract(tableName, table, tableList, indexes, triggers) {
	const normalizedTriggers = triggers.map((trigger) => ({
		name: trigger.name,
		sql: normalizeSchemaSql(trigger.sql)
	}));
	const normalizedTableSql = table.sql?.startsWith("CREATE TABLE ") ? null : normalizeSchemaSql(table.sql);
	const isVirtualTable = normalizedTableSql !== null && /^CREATE VIRTUAL TABLE /iu.test(normalizedTableSql);
	return {
		definition: isVirtualTable ? null : parseTableDefinition(table.sql, tableName),
		indexes,
		strict: tableList.strict,
		triggers: normalizedTriggers,
		virtualTableSql: isVirtualTable ? normalizedTableSql : null,
		withoutRowid: tableList.wr
	};
}
function createSqliteIndexContract(index, schemaSql, rows) {
	const terms = rows.map(({ cid, coll, desc, key, name, seqno }) => ({
		coll,
		desc,
		key,
		kind: sqliteIndexTermKind(cid),
		name,
		seqno
	}));
	return {
		name: index.name.startsWith("sqlite_autoindex_") ? null : index.name,
		origin: index.origin,
		partial: index.partial,
		sql: normalizeSchemaSql(schemaSql),
		terms,
		unique: index.unique
	};
}
function sqliteIndexTermKind(cid) {
	return cid === -2 ? "expression" : cid === -1 ? "rowid" : "column";
}
function parseTableDefinition(sql, tableName) {
	if (sql === null) throw new Error(`Could not inspect SQLite table definition for ${tableName}.`);
	const open = findSqlCharacter(sql, "(");
	if (open === -1) throw new Error(`SQLite table ${tableName} has no column definition.`);
	const close = findSqlClosingParenthesis(sql, open);
	const columns = /* @__PURE__ */ new Map();
	const constraints = [];
	for (const rawDefinition of splitSqlList(sql.slice(open + 1, close))) {
		const definition = normalizeSqlWhitespace(rawDefinition);
		if (!definition) continue;
		const token = readSqlToken(definition, 0);
		if (!token) throw new Error(`SQLite table ${tableName} contains an unreadable definition.`);
		if (readTableConstraintKeyword(definition, token)) {
			constraints.push(definition);
			continue;
		}
		const columnName = normalizeSqlIdentifier(token.raw);
		if (columns.has(columnName)) throw new Error(`SQLite table ${tableName} contains duplicate column ${columnName}.`);
		columns.set(columnName, definition);
	}
	return {
		columns: new Map([...columns].toSorted(([left], [right]) => left.localeCompare(right))),
		constraints: constraints.toSorted()
	};
}
//#endregion
//#region src/infra/sqlite-schema-issues.ts
function defaultIssueMessage(code, objectName) {
	const tableName = objectName.split(".", 1)[0];
	switch (code) {
		case "missing-table": return `missing table ${objectName}`;
		case "missing-column":
		case "unexpected-column":
		case "column-definition-drift": return `column definitions differ for ${tableName}`;
		case "table-constraint-drift": return `table constraints differ for ${objectName}`;
		case "table-definition-drift": return `table definition differs for ${objectName}`;
		case "missing-or-drifted-index": return `missing or drifted index ${objectName}`;
		case "unexpected-unique-index": return `unexpected unique index ${objectName}`;
		case "missing-or-drifted-trigger": return `missing or drifted trigger ${objectName}`;
		case "unexpected-trigger": return `unexpected trigger ${objectName}`;
		case "virtual-table-definition-drift": return `virtual table definition differs for ${objectName}`;
		case "table-options-drift": return `table options differ for ${objectName}`;
	}
	throw new Error("Unsupported SQLite schema issue code", { cause: code });
}
function createSqliteSchemaIssue(code, objectName, message) {
	return {
		code,
		objectName,
		message: message ?? defaultIssueMessage(code, objectName)
	};
}
function legacySqliteSchemaIssueMessages(issues) {
	const isColumnIssue = (issue) => issue.code === "column-definition-drift" || issue.code === "missing-column" || issue.code === "unexpected-column";
	const columnIssueTables = new Set(issues.filter(isColumnIssue).map((issue) => issue.objectName.split(".", 1)[0]));
	return [...new Set(issues.filter((issue) => issue.code !== "table-constraint-drift" || !columnIssueTables.has(issue.objectName)).map((issue) => issue.message))];
}
function throwSqliteSchemaMismatches(databaseLabel, mismatches) {
	const shown = mismatches.slice(0, 8);
	if (mismatches.length > shown.length) shown.push(`${mismatches.length - shown.length} additional mismatch(es)`);
	throw new Error(`SQLite schema is incomplete or noncanonical for ${databaseLabel}: ${shown.join("; ")}; run openclaw doctor --fix to repair it.`);
}
//#endregion
//#region src/infra/sqlite-schema-contract.ts
const schemaContractCache = /* @__PURE__ */ new Map();
/** Reuse actual table facts only within one unchanged read transaction on this connection. */
function createSqliteTableContractReader(database) {
	const tables = /* @__PURE__ */ new Map();
	return (tableName) => {
		if (!tables.has(tableName)) tables.set(tableName, collectSqliteTableContract(database, tableName));
		return tables.get(tableName);
	};
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
	const expected = getSqliteSchemaContract(schemaSql);
	const allowedMissingTables = new Set(compatibility.allowedMissingTables ?? []);
	const allowedMissingIndexes = new Set(compatibility.allowedMissingIndexes ?? []);
	const issues = [];
	const add = (code, objectName, message) => {
		issues.push(createSqliteSchemaIssue(code, objectName, message));
	};
	for (const [tableName, expectedTable] of expected) {
		const actualTable = readTable ? readTable(tableName) : collectSqliteTableContract(database, tableName);
		if (!actualTable) {
			if (allowedMissingTables.has(tableName)) continue;
			add("missing-table", tableName);
			continue;
		}
		issues.push(...compareTableDefinitions(tableName, actualTable.definition, expectedTable.definition, compatibility, !allowedMissingTables.has(tableName)));
		const actualIndexFingerprints = new Set(actualTable.indexes.map((index) => JSON.stringify(index)));
		const expectedIndexFingerprints = /* @__PURE__ */ new Set();
		for (const expectedIndex of expectedTable.indexes) {
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
			if (!actualTable.triggers.some((actualTrigger) => isEqualTrigger(actualTrigger, expectedTrigger))) add("missing-or-drifted-trigger", expectedTrigger.name);
		}
		for (const triggerGroup of optionalCanonicalTriggerGroups) {
			const isPresent = actualTable.triggers.some((actualTrigger) => triggerGroup.triggers.some((canonicalTrigger) => actualTrigger.name === canonicalTrigger.name));
			if (triggerGroup.optional && !isPresent) continue;
			for (const canonicalTrigger of triggerGroup.triggers) if (!actualTable.triggers.some((actualTrigger) => isEqualTrigger(actualTrigger, canonicalTrigger))) add("missing-or-drifted-trigger", canonicalTrigger.name);
		}
		for (const actualTrigger of actualTable.triggers) if (!expectedTable.triggers.some((expectedTrigger) => isEqualTrigger(actualTrigger, expectedTrigger)) && !optionalCanonicalTriggers.some((canonicalTrigger) => isEqualTrigger(actualTrigger, canonicalTrigger))) add("unexpected-trigger", actualTrigger.name);
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
	const index = database.prepare(`PRAGMA main.index_list(${quoteSqliteIdentifier(row.tbl_name)})`).all()?.find((candidate) => candidate.name === indexName);
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
	let expected = schemaContractCache.get(schemaSql);
	if (!expected) {
		expected = buildSqliteSchemaContract(schemaSql);
		schemaContractCache.set(schemaSql, expected);
	}
	return expected;
}
function collectCanonicalSqliteFacts(database) {
	const tableOptions = database.prepare("PRAGMA table_list").all();
	if (tableOptions.some((row) => {
		const name = row.name.toLowerCase();
		return name === "pragma_index_list" || name === "pragma_index_xinfo";
	})) return;
	const indexes = database.prepare(`
    SELECT CAST(t.rowid AS TEXT) AS table_id, i.seq AS index_seq,
      i.name, i.origin, i.partial, i."unique", d.sql
    FROM sqlite_schema AS t
    CROSS JOIN pragma_index_list(t.name) AS i
    LEFT JOIN sqlite_schema AS d ON d.type = 'index' AND d.name = i.name
    WHERE t.type = 'table' AND t.name NOT LIKE 'sqlite_%'
  `).all();
	const terms = database.prepare(`
    SELECT CAST(t.rowid AS TEXT) AS table_id, i.seq AS index_seq,
      x.seqno, x.cid, x.name, x."desc", x.coll, x."key"
    FROM sqlite_schema AS t
    CROSS JOIN pragma_index_list(t.name) AS i
    CROSS JOIN pragma_index_xinfo(i.name) AS x
    WHERE t.type = 'table' AND t.name NOT LIKE 'sqlite_%'
    ORDER BY t.rowid, i.seq, x.seqno
  `).all();
	const triggers = database.prepare(`
    SELECT tbl_name, name, sql FROM sqlite_schema WHERE type = 'trigger' ORDER BY tbl_name, name
  `).all();
	return {
		tableOptions,
		indexes: groupCanonicalRows(indexes, (row) => row.table_id),
		terms: groupCanonicalRows(terms, (row) => row.table_id),
		triggers: groupCanonicalRows(triggers, (row) => row.tbl_name)
	};
}
function groupCanonicalRows(rows, key) {
	const groups = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const name = key(row);
		const group = groups.get(name);
		if (group) group.push(row);
		else groups.set(name, [row]);
	}
	return groups;
}
function buildSqliteSchemaContract(schemaSql) {
	const database = openNodeSqliteDatabase(":memory:");
	try {
		database.exec(schemaSql);
		const rows = database.prepare(`
          SELECT CAST(rowid AS TEXT) AS table_id, name, sql
          FROM sqlite_schema
          WHERE type = 'table'
            AND name NOT LIKE 'sqlite_%'
          ORDER BY name
        `).all();
		if (rows.length === 0) return /* @__PURE__ */ new Map();
		const facts = collectCanonicalSqliteFacts(database);
		if (!facts) return new Map(rows.map((table) => [table.name, collectSqliteTableContractFromRow(database, table.name, table)]));
		return new Map(rows.map((table) => {
			const tableList = facts.tableOptions.find((entry) => entry.name === table.name);
			if (!tableList) throw new Error(`Could not inspect SQLite table options for ${table.name}.`);
			const termsByIndex = groupCanonicalRows(facts.terms.get(table.table_id) ?? [], (term) => term.index_seq);
			const indexes = (facts.indexes.get(table.table_id) ?? []).map((index) => createSqliteIndexContract(index, index.sql, termsByIndex.get(index.index_seq) ?? [])).toSorted(compareJson);
			return [table.name, createSqliteTableContract(table.name, table, tableList, indexes, facts.triggers.get(table.name) ?? [])];
		}));
	} finally {
		database.close();
	}
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
function collectSqliteTableContract(database, tableName) {
	const table = executeWithCachedStatement(database, "SELECT name, sql FROM sqlite_schema WHERE type = 'table' AND name = ?", [tableName], (statement) => statement.get(tableName));
	if (!table) return;
	return collectSqliteTableContractFromRow(database, tableName, table);
}
function collectSqliteTableContractFromRow(database, tableName, table) {
	const quotedTable = quoteSqliteIdentifier(tableName);
	const tableList = database.prepare(`PRAGMA table_list(${quotedTable})`).all().find((entry) => entry.name === tableName);
	if (!tableList) throw new Error(`Could not inspect SQLite table options for ${tableName}.`);
	return createSqliteTableContract(tableName, table, tableList, database.prepare(`PRAGMA index_list(${quotedTable})`).all().map((index) => collectSqliteIndexContract(database, index)).toSorted(compareJson), executeWithCachedStatement(database, `
          SELECT name, sql
          FROM sqlite_schema
          WHERE type = 'trigger' AND tbl_name = ?
          ORDER BY name
        `, [tableName], (statement) => statement.all(tableName)));
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
	const row = executeWithCachedStatement(database, "SELECT sql FROM sqlite_schema WHERE type = 'index' AND name = ?", [index.name], (statement) => statement.get(index.name));
	const terms = database.prepare(`PRAGMA index_xinfo(${quoteSqliteIdentifier(index.name)})`).all();
	return createSqliteIndexContract(index, typeof row?.sql === "string" ? row.sql : null, terms);
}
function isEqualTrigger(left, right) {
	return left.name === right.name && left.sql === right.sql;
}
function compareJson(left, right) {
	return JSON.stringify(left).localeCompare(JSON.stringify(right));
}
function readSqliteSchemaCookie(database) {
	return database.prepare("PRAGMA schema_version").get()?.schema_version;
}
//#endregion
//#region src/state/openclaw-state-db-schema-version.ts
const CONTENT_VERSION_KEY = "state.schema.contentVersion";
const contentVersionQueries = /* @__PURE__ */ new WeakMap();
/** Content and its marker commit together, even while older readers retain their version floor. */
function readStateSchemaContentVersion(db) {
	const published = readSqliteUserVersion(db);
	if (!tableExists(db, "config_machine_state")) return published;
	let query = contentVersionQueries.get(db);
	if (!query) {
		query = prepareSqliteQuerySync(db, () => getNodeSqliteKysely(db).selectFrom("config_machine_state").select("value_json").where("state_key", "=", CONTENT_VERSION_KEY));
		contentVersionQueries.set(db, query);
	}
	const row = query().rows[0];
	if (!row) return published;
	const contentVersion = JSON.parse(row.value_json);
	if (typeof contentVersion !== "number" || !Number.isSafeInteger(contentVersion) || contentVersion < 0) throw new Error(`Invalid shared state schema content version in ${CONTENT_VERSION_KEY}.`);
	return Math.max(published, contentVersion);
}
/** Cold migration planning checks physical content; admission still uses the recorded version. */
function readStateSchemaMigrationVersion(db) {
	const version = readStateSchemaContentVersion(db);
	if (version !== 16) return version;
	const reviewWorkspace = tableHasColumn(db, "skill_workshop_collection_reviews", "workspace_dir");
	const proposalWorkspace = tableHasColumn(db, "skill_workshop_proposals", "workspace_dir");
	const releasedClaim = tableHasColumn(db, "skill_workshop_proposals", "claim_released_time");
	if (!reviewWorkspace && !proposalWorkspace && !releasedClaim) return version;
	const missingAttribution = reviewWorkspace && !proposalWorkspace;
	const issues = collectSqliteSchemaIssues(db, `
    CREATE TABLE skill_workshop_collection_reviews (
      review_id TEXT NOT NULL PRIMARY KEY,
      ${reviewWorkspace ? "workspace_dir" : "owner_agent_id"} TEXT NOT NULL,
      backup_id TEXT NOT NULL,
      create_time INTEGER NOT NULL,
      kept_names_json TEXT NOT NULL,
      written_names_json TEXT NOT NULL,
      dropped_json TEXT NOT NULL
    ) STRICT;
    CREATE TABLE skill_workshop_proposals (
      proposal_id TEXT NOT NULL PRIMARY KEY,
      record_json TEXT NOT NULL,
      owner_agent_id TEXT,
      ${proposalWorkspace ? "workspace_dir TEXT NOT NULL," : ""}
      kind TEXT NOT NULL CHECK (kind IN ('create', 'update')),
      status TEXT NOT NULL CHECK (status IN ('pending', 'applied', 'rejected', 'quarantined', 'stale')),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      draft_hash TEXT NOT NULL,
      origin_agent_id TEXT,
      origin_session_key TEXT,
      origin_run_id TEXT,
      origin_message_id TEXT,
      applied_at TEXT,
      rejected_at TEXT,
      quarantined_at TEXT,
      stale_at TEXT,
      status_reason TEXT
      ${releasedClaim ? ", claim_released_time INTEGER" : ""}
    ) STRICT;
  `, {
		allowedMissingTables: ["skill_workshop_collection_reviews"],
		allowedColumnDefinitions: {
			"skill_workshop_collection_reviews.workspace_dir": ["workspace_dir TEXT NOT NULL DEFAULT ''"],
			"skill_workshop_proposals.workspace_dir": ["workspace_dir TEXT NOT NULL DEFAULT ''"]
		}
	});
	if (!missingAttribution && issues.length === 0) return 15;
	throw new Error("Unrecognized Skill Workshop ownership schema; cannot apply the schema 16 migration.");
}
function assertSupportedStateSchemaVersion(db, pathname) {
	try {
		const userVersion = readSqliteUserVersion(db);
		const contentVersion = userVersion > 18 ? userVersion : readStateSchemaContentVersion(db);
		if (contentVersion > 18) throw createNewerSqliteSchemaVersionError("OpenClaw state database", pathname, contentVersion, 18);
		return userVersion;
	} catch (error) {
		throw normalizeOpenClawStateSchemaReadError(error, pathname);
	}
}
//#endregion
//#region src/state/openclaw-state-db-runtime-failure.ts
/** Runtime validation uses the cache's existing handles, version counters, and terminal latch. */
function createOpenClawStateDatabaseRuntimeFailureOwner(owner) {
	const readDataVersion = (database) => {
		let statement = owner.statements.get(database);
		if (!statement) {
			statement = database.db.prepare("PRAGMA data_version");
			owner.statements.set(database, statement);
		}
		const row = statement.get();
		if (typeof row?.data_version !== "number") throw new Error("SQLite did not return a numeric PRAGMA data_version");
		return row.data_version;
	};
	return {
		closeTerminalFailure(pathname, error) {
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
		recordPublishedVersion: (database) => {
			owner.dataVersions.set(database.db, readDataVersion(database));
		},
		get: (pathname) => {
			const resolvedPath = path.resolve(pathname);
			const latched = owner.latch.get(resolvedPath);
			if (latched) return latched;
			const cached = owner.cachedDatabases.get(resolvedPath);
			if (!cached?.db.isOpen) return;
			try {
				const dataVersion = readDataVersion(cached);
				if (owner.dataVersions.get(cached.db) === dataVersion) return;
				assertSupportedStateSchemaVersion(cached.db, resolvedPath);
				owner.dataVersions.set(cached.db, dataVersion);
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
function getExistingOpenClawStateSchemaPath() {
	const scope = schemaPolicies.scopes.getStore();
	if (scope && !scope.active) throw new Error("Existing shared-state schema admission has ended.");
	return scope?.path;
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
	cachedDataVersionStatements: /* @__PURE__ */ new WeakMap(),
	cachedDataVersions: /* @__PURE__ */ new WeakMap(),
	databaseIdentities: /* @__PURE__ */ new WeakMap(),
	borrowers: /* @__PURE__ */ new WeakMap(),
	databaseLifecycleListeners: /* @__PURE__ */ new Set(),
	terminalOpenLatch: createSqliteTerminalOpenLatch({ closeByPath: (pathname, error) => runtimeFailures.closeTerminalFailure(pathname, error) }),
	asyncResources: createOpenClawStateDatabaseAsyncLifecycle()
}), () => closeOpenClawStateDatabaseAsync());
const { cachedDatabases, retainedDatabaseHandles, idleTimers, idleReferences, cachedDataVersionStatements, cachedDataVersions, databaseIdentities, borrowers, databaseLifecycleListeners, terminalOpenLatch, asyncResources } = stateDatabaseLifecycle;
const { touch: touchStateDatabase, retain: retainOpenClawStateDatabaseForIdle } = createStateDatabaseIdleRetirement(stateDatabaseLifecycle, retireOpenClawStateDatabaseHandle);
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
	statements: cachedDataVersionStatements,
	dataVersions: cachedDataVersions,
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
	getOpenClawDatabaseMaintenanceScope()?.own(database.db, "shared-handles", () => {
		if (cachedDatabases.get(database.path) === database || retainedDatabaseHandles.get(database.db) === database) retireOpenClawStateDatabaseHandle(database, false);
	});
}
function closeUnpublishedOpenClawStateDatabaseHandle(database) {
	const errors = closeOpenClawStateDatabaseHandle(database);
	if (retainedDatabaseHandles.get(database.db) === database) ownMaintenanceStateDatabaseHandle(database);
	return errors;
}
/** Retain one exact canonical native owner; only the final reference retires its handle. */
const { retain: retainOpenClawStateDatabase, borrowForRead: borrowOpenClawStateDatabaseForAsyncRead, retainForIndependentRead: retainOpenClawStateDatabaseForIndependentRead } = createStateDatabaseRetainer(stateDatabaseLifecycle, {
	assertOpen(pathname) {
		assertOpenClawStateDatabaseOpenAllowed(pathname);
		assertExistingOpenClawStateSchemaCacheAdmission(pathname, stateDatabaseLifecycle);
	},
	capture: (pathname) => asyncResources.capture(pathname),
	retire: retireOpenClawStateDatabaseHandle,
	retainFailed: retainStateDatabaseClose,
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
function publishOpenClawStateDatabase(database) {
	const { db, path: pathname } = database;
	const identity = asyncResources.publish(pathname);
	databaseIdentities.set(db, identity);
	runtimeFailures.recordPublishedVersion(database);
	cachedDatabases.set(pathname, database);
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
function getCachedOpenClawStateDatabase(pathname) {
	getOpenClawDatabaseMaintenanceScope()?.assertAdmission();
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
async function getOpenClawStateDatabaseTerminalFailureAsync(context) {
	context.admission.assertCurrent();
	const failure = await terminalOpenLatch.getAsync(context.admission.databasePath, async (_path, generation) => {
		const { inspectOpenClawStateDatabase } = await import("./openclaw-state-worker-store-wruYP7oz.js");
		const matches = await inspectOpenClawStateDatabase(context, {
			type: "database.generationMatches",
			input: { generation }
		});
		if (matches === void 0) throw new Error("Recorded shared-state database generation is unavailable");
		return matches;
	});
	context.admission.assertCurrent();
	return failure;
}
/** Reject shared-state access after a process-local terminal failure. */
function assertOpenClawStateDatabaseOpenAllowed(pathname) {
	const identity = asyncResources.identity(pathname);
	const terminalFailure = terminalOpenLatch.get(pathname);
	if (terminalFailure) throw terminalFailure;
	const resolvedPath = path.resolve(pathname);
	for (const database of retainedDatabaseHandles.values()) if (borrowers.get(database.db)?.retiring && (database.path === resolvedPath || identity !== void 0 && databaseIdentities.get(database.db)?.key === identity.key)) throw new Error(`OpenClaw state database native borrower cleanup is pending: ${pathname}`);
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
	assertOpenClawStateDatabaseNotQuarantined(pathname, env, onNativeCleanupFailure);
}
/** Explicit retirement can checkpoint WAL and must join the lifecycle writer gate. */
function retireOpenClawStateDatabaseHandle(database, retireAdmission = true, options) {
	assertStateDatabaseBorrowersReleased(borrowers.get(database.db), database.path);
	const borrowedOwner = borrowers.get(database.db);
	const { busyTimeoutMs = OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, ...closeOptions } = options ?? {};
	const coordinator = borrowedOwner?.closeCoordinator ?? acquireStateDatabaseCoordinator({
		databasePath: database.path,
		busyTimeoutMs,
		keepAlive: false
	});
	if (borrowedOwner) borrowedOwner.closeCoordinator = coordinator;
	try {
		runWithSqliteCoordinator(coordinator, "state database retirement", () => {
			const wasCached = cachedDatabases.get(database.path)?.db === database.db;
			if (retireAdmission) asyncResources.invalidate(database.path);
			const errors = closeOpenClawStateDatabaseHandle(database, closeOptions);
			if (wasCached && retireAdmission) try {
				notifyOpenClawStateDatabaseClosed(database);
			} catch (error) {
				errors.push(error);
			}
			throwSqliteLifecycleErrors(errors, `OpenClaw state database cleanup failed for ${database.path}.`);
		});
	} catch (error) {
		if (borrowedOwner) retainStateDatabaseClose(database);
		throw error;
	} finally {
		if (borrowedOwner && coordinator.closed) borrowedOwner.closeCoordinator = void 0;
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
	admission.assertCurrent();
	asyncResources.publish(admission.databasePath);
	admission.assertCurrent();
}
/** Orderly lifecycle close; synchronous close remains native/exit cleanup only. */
async function closeOpenClawStateDatabaseAsync(options) {
	await asyncResources.close(void 0, () => retireOpenClawStateDatabaseHandles(void 0, options));
}
/** Test whether a cached shared state database handle is still open, optionally at one path. */
function isOpenClawStateDatabaseOpen(pathname) {
	if (pathname !== void 0) return cachedDatabases.get(path.resolve(pathname))?.db.isOpen === true;
	return Array.from(cachedDatabases.values()).some((database) => database.db.isOpen);
}
/** Close shared state handles and clear terminal failure latches for test isolation. */
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
	getOpenClawStateDatabaseIfOpenAtPath,
	getKnownOpenClawStateDatabaseIdentity: asyncResources.knownIdentity,
	isOpenClawStateDatabaseOpen,
	publishOpenClawStateDatabase,
	recordOpenClawStateDatabaseOpenFailure,
	recordOpenClawStateDatabaseLifecycleOpenError,
	touchStateDatabase
};
//#endregion
export { runInSqliteMaintenanceContext as $, removeTempDirectory as $t, existingPathOrUndefined as A, FIRST_USE_STATE_TABLES as At, assertSqliteTableIntegrity as B, logSlowSqliteCoordinatorWait as Bt, readSqliteSchemaCookie as C, SqliteSchemaVersionError as Ct, openTrackedStateDatabase as D, VERSION as Dt, splitSqlList as E, StartupMaintenanceRequiredError as Et, warnAgentPathMigration as F, SqliteCoordinatorError as Ft, readDatabasePathIdentity as G, normalizeSqliteNonNegativeInteger as Gt, runSqliteIntegrityOperationSync as H, runSqliteDeferredTransactionSync as Ht, StateDatabaseReadAdmissionInvalidatedError as I, createSqliteLifecycleAggregateError as It, acquireSqliteSnapshotReadToken as J, setSqliteBusyTimeout as Jt, readDatabasePathIdentitySync as K, readSqliteBusyTimeout as Kt, getOpenClawDatabaseMaintenanceScope as L, runWithSqliteCoordinator as Lt, resolveOpenClawStateDirForDatabasePath as M, LAZY_ADDITIVE_STATE_TABLES as Mt, resolveOpenClawStateSqliteDir as N, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS as Nt, openTrackedStateDatabaseResult as O, runInDetachedAsyncContext as Ot, resolveOpenClawStateSqlitePath as P, DATABASE_QUARANTINE_READ_CLEANUP_ERROR_NAME as Pt, registerSqliteCacheExitClose as Q, adoptPreparedLocation as Qt, observeOpenClawDatabaseMaintenanceResource as R, throwSqliteLifecycleErrors as Rt, getCanonicalSqliteTableNames as S, StateSchemaMutationConflictError as St, quoteSqliteIdentifier as T, readSqliteUserVersion as Tt, sqliteIntegrityCheckSteps as U, runSqliteImmediateTransactionSync as Ut, isTerminalSqliteIntegrityError as V, retainSqliteWriteAdmissionService as Vt, assertExistingDatabaseIdentity as W, withSqlitePostCommitPublications as Wt, configureSqliteConnectionPragmas as X, applyPrivateModeSync as Xt, createSqliteSnapshotStagingDirectorySync as Y, SQLITE_IDLE_HANDLE_TTL_MS as Yt, configureSqlitePreSchemaPragmas as Z, SqliteSnapshotCleanupError as Zt, assertSqliteSchemaTablesPresent as _, withStateDatabaseCoordinatorRuntimeDirectory as _t, recordOpenClawStateDatabaseOpenFailure as a, ensureSqliteLibrarySelected as an, tableHasColumn as at, createSqliteTableContractReader as b, sha256Hex as bt, retainOpenClawStateDatabaseForIdle as c, executeSqliteQueryTakeFirstSync as cn, OpenClawStateDatabaseSchemaMigrationRequiredError as ct, recordExistingOpenClawStateSchemaDatabase as d, enableNodeSqliteKyselyStatementCache as dn, captureStateDatabaseCoordinatorRuntime as dt, isSqliteLockError as en, createSqliteWalReclamationResult as et, CONTENT_VERSION_KEY as f, executeWithCachedStatement as fn, hasStateDatabaseSourceExclusion as ft, assertSqliteSchemaContains as g, tryCreateStateLifecycleDelegate as gt, readStateSchemaMigrationVersion as h, tryCreateGatewaySchemaFenceDelegate as ht, publishOpenClawStateDatabaseWorkerAdmission as i, resolveExistingSqliteFileUri as in, tableExists as it, resolveOpenClawAgentDatabaseStoredPath as j, LAZY_ADDITIVE_STATE_INDEXES as jt, describeAgentPathMigration as k, FIRST_USE_STATE_INDEXES as kt, getExistingOpenClawStateSchemaPath as l, getNodeSqliteKysely as ln, normalizeOpenClawStateSchemaReadError as lt, readStateSchemaContentVersion as m, resolveStateLifecycleRuntimeDirectory as mt, getOpenClawStateDatabaseTerminalFailureAsync as n, withSqliteNativeOpen as nn, normalizeSqliteNumber as nt, registerOpenClawStateDatabaseAsyncResource as o, compileSqliteQueryBindings as on, tablePrimaryKeyColumns as ot, assertSupportedStateSchemaVersion as p, registerNodeSqliteDisposeCallback as pn, resolveStateDatabaseCoordinatorPath as pt, prepareSqliteReadOnlyLocationSyncInProcess as q, runWithSqliteBusyTimeout as qt, openClawStateDatabaseCache as r, openNodeSqliteDatabase as rn, ensureColumn as rt, registerOpenClawStateDatabaseLifecycleListener as s, executeSqliteQuerySync as sn, isGatewayExternallySupervised as st, captureOpenClawStateDatabaseReadAdmission as t, markSqliteNativeOpenFailure as tn, coerceRequiredSqliteNumber as tt, isExistingOpenClawStateSchema as u, iterateSqliteQuerySync as un, acquireStateDatabaseCoordinator as ut, collectSqliteNamedIndexContract as v, withStateSchemaFence as vt, extractSqliteTableSchema as w, isSqliteSchemaVersionError as wt, getCanonicalSqliteNamedIndexContracts as x, StateDatabaseCoordinatorContentionError as xt, collectSqliteSchemaIssues as y, sha256FileSync$1 as yt, assertSqliteIntegrity as z, assertTransactionUsable as zt };
