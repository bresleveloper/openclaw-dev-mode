import { t as __commonJSMin } from "./sqlite-readonly-rolldown-runtime-XITHOX9H.mjs";
import { A as normalizeWindowsPathPreservingCase, I as isMissingPathError, at as toErrorObject, c as notifyListeners, gt as normalizeLowercaseStringOrEmpty, k as escapeRegExp, l as registerListener, m as pruneMapToMaxSize, pt as resolveGlobalSingleton, t as createSubsystemLogger, u as getPluginExecutionFrame, wt as isRecord, xt as asNullableRecord, yt as normalizeOptionalString } from "./sqlite-readonly-subsystem-DxzYbxOQ.mjs";
import { lt as hasNodeErrorCode, mt as normalizeWindowsPathForComparison } from "./sqlite-readonly-runtime-process-manifest-B1faCUt1.mjs";
import { n as readFileDescriptorBoundedSync } from "./sqlite-readonly-bounded-read-BfWjRyKI.mjs";
import { t as formatErrorMessage } from "./sqlite-readonly-errors-CyzrIIqN.mjs";
import { createRequire } from "node:module";
import path, { posix } from "node:path";
import { createHash, randomUUID } from "node:crypto";
import fs, { existsSync, fstatSync, readdirSync, realpathSync, statSync, default as openClawRootFsSync } from "node:fs";
import { realpath, stat } from "node:fs/promises";
import { getEnvironmentData, isMainThread, setEnvironmentData, threadId } from "node:worker_threads";
import { isDeepStrictEqual, toUSVString } from "node:util";
import { AsyncLocalStorage, AsyncResource } from "node:async_hooks";
import { fileURLToPath, pathToFileURL } from "node:url";
import { isUtf8 } from "node:buffer";
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/positional-read.js
const MAX_READ_BYTES = 2147483647;
function validateWindow(buffer, position) {
	if (!Number.isSafeInteger(position) || position < 0 || !Number.isSafeInteger(position + buffer.length)) throw new RangeError("read position and window end must be non-negative safe integers");
}
/** Synchronous positional read; neither variant advances or closes its descriptor. */
function readFileWindowFullySync(fd, buffer, position) {
	validateWindow(buffer, position);
	let total = 0;
	while (total < buffer.length) {
		const bytesRead = fs.readSync(fd, buffer, total, Math.min(buffer.length - total, MAX_READ_BYTES), position + total);
		if (bytesRead === 0) break;
		total += bytesRead;
	}
	return total;
}
//#endregion
//#region packages/normalization-core/src/promise-like.ts
/** Canonical thenable guard; use instead of local isPromiseLike copies. */
function isPromiseLike(value) {
	if (value === null || typeof value !== "object" && typeof value !== "function") return false;
	try {
		return typeof value.then === "function";
	} catch {
		return false;
	}
}
//#endregion
//#region src/infra/sqlite-lifecycle-errors.ts
var OpenClawStateOwnershipError = class extends Error {};
var OpenClawStateOwnershipMetadataError = class extends OpenClawStateOwnershipError {
	constructor(databasePath, message) {
		super(`OpenClaw shared state ownership metadata is invalid at ${databasePath}: ${message}. Repair it with OPENCLAW_SUPERVISOR_MODE=external openclaw database ownership claim --manager <manager-id>.`);
		this.databasePath = databasePath;
		this.name = "OpenClawStateOwnershipMetadataError";
	}
};
var OpenClawStateExternalOwnershipError = class extends OpenClawStateOwnershipError {
	constructor(databasePath, managerId) {
		super(`OpenClaw shared state database ${databasePath} is externally supervised by ${managerId}. Use that external supervisor with OPENCLAW_SUPERVISOR_MODE=external for writable operations.`);
		this.databasePath = databasePath;
		this.managerId = managerId;
		this.name = "OpenClawStateExternalOwnershipError";
	}
};
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
/** Settle a synchronous SQLite operation and preserve both operation and cleanup failures. */
function runWithSqliteCleanup(resource, operationLabel, operation) {
	let result;
	try {
		result = operation();
		if (isPromiseLike(result)) throw new SqliteCoordinatorError(`${operationLabel} must remain synchronous`);
	} catch (operationError) {
		try {
			resource.release();
		} catch (releaseError) {
			throw createSqliteLifecycleAggregateError([operationError, releaseError], `${operationLabel} and resource release both failed`, operationError);
		}
		throw operationError;
	}
	try {
		resource.release();
	} catch (releaseError) {
		throw new SqliteCoordinatorError(`${operationLabel} completed, but releasing its resource failed`, releaseError);
	}
	return result;
}
//#endregion
//#region src/infra/sql-connection.ts
const abortedTransactionSymbol = Symbol.for("openclaw.sqliteAbortedTransaction");
function assertPostgresTransactionUsable(db) {
	const aborted = db[abortedTransactionSymbol];
	if (aborted) throw aborted.error;
}
function assertSyncTransactionResult(value) {
	if (isPromiseLike(value)) throw new Error("SQLite write transactions must be synchronous; Promise returns are not supported.");
}
const postgresConnectionBrand = Symbol.for("openclaw.postgres-sync-connection");
function isPostgresSqlConnection(db) {
	return postgresConnectionBrand in db && db[postgresConnectionBrand] === true;
}
/** Publications and receipts must key on the store anchor for every engine. */
function sqlPublicationAnchor(db) {
	return isPostgresSqlConnection(db) ? db.anchor : db;
}
//#endregion
//#region src/infra/sqlite-database-admission-key.ts
const SQLITE_DATABASE_ADMISSIONS_KEY = "openclaw.sqliteDatabaseAdmissions.v1";
//#endregion
//#region src/infra/sqlite-worker-identity.ts
const useDatabaseBirthtime = process.platform !== "linux" && process.platform !== "android";
function databaseFileIdentityKey(file) {
	return `${file.dev}:${file.ino}`;
}
function readDatabaseIdentityBirthtime(file) {
	return useDatabaseBirthtime ? file.birthtimeNs.toString() : "0";
}
/** Native SQLite namespaces are filesystem locators, not distinct database owners. */
function normalizeDatabasePath(location) {
	const normalized = process.platform === "win32" ? normalizeWindowsPathPreservingCase(location) : location;
	return process.platform === "win32" && !/^(?:[a-z]:[\\/]|[\\/]{2})/iu.test(normalized) ? location : normalized;
}
function readDatabaseFileIdentity(value) {
	if (!value || typeof value !== "object" || Array.isArray(value) || !("key" in value) || typeof value.key !== "string" || !/^file:(?:0|[1-9]\d{0,19}):(?:0|[1-9]\d{0,19})$/.test(value.key) || "birthtime" in value && value.birthtime !== void 0 && (typeof value.birthtime !== "string" || !/^-?(?:0|[1-9]\d{0,29})$/.test(value.birthtime))) throw new Error("SQLite snapshot requires a captured physical file identity");
	return {
		key: value.key,
		..."birthtime" in value && typeof value.birthtime === "string" ? { birthtime: value.birthtime } : {}
	};
}
function assertDatabaseFileIdentity(file, expected) {
	if (!file.isFile() || `file:${databaseFileIdentityKey(file)}` !== expected.key || expected.birthtime !== void 0 && readDatabaseIdentityBirthtime(file) !== expected.birthtime) throw new Error("SQLite database file identity changed before existing-only open");
}
function existingIdentity(file, canonicalFile, canonicalPath) {
	if (!file.isFile()) throw new Error("SQLite worker database path must identify a regular file");
	if (file.dev !== canonicalFile.dev || file.ino !== canonicalFile.ino || readDatabaseIdentityBirthtime(file) !== readDatabaseIdentityBirthtime(canonicalFile)) throw new Error("SQLite database pathname changed during admission");
	return {
		key: `file:${databaseFileIdentityKey(file)}`,
		canonicalPath: normalizeDatabasePath(canonicalPath),
		birthtime: readDatabaseIdentityBirthtime(file)
	};
}
function missingAncestorParent(ancestor, missing, error) {
	if (!hasNodeErrorCode(error, "ENOENT")) throw error;
	missing.unshift(path.basename(ancestor));
	const parent = path.dirname(ancestor);
	if (parent === ancestor) throw error;
	return parent;
}
/** In-process owner key only; never rewrite a configured or persisted database locator. */
function resolveDatabasePathKey(databasePath) {
	let ancestor = path.resolve(databasePath);
	const missing = [];
	while (true) try {
		return normalizeDatabasePath(path.join(realpathSync.native(ancestor), ...missing));
	} catch (error) {
		ancestor = missingAncestorParent(ancestor, missing, error);
	}
}
/** Inspect a native-owner path without replacing its diagnostic for a non-file target. */
function inspectDatabasePathIdentitySync(databasePath) {
	const resolvedPath = path.resolve(databasePath);
	let file;
	try {
		file = statSync(resolvedPath, { bigint: true });
	} catch (error) {
		if (!hasNodeErrorCode(error, "ENOENT")) throw error;
	}
	if (file) {
		if (!file.isFile()) return;
		const canonicalPath = resolveDatabasePathKey(resolvedPath);
		return existingIdentity(file, statSync(canonicalPath, { bigint: true }), canonicalPath);
	}
	const canonicalPath = resolveDatabasePathKey(resolvedPath);
	return {
		key: `path:${canonicalPath}`,
		canonicalPath
	};
}
/** Capture identity before yielding; worker admission requires a regular file or absent path. */
function readDatabasePathIdentitySync(databasePath) {
	const identity = inspectDatabasePathIdentitySync(databasePath);
	if (!identity) throw new Error("SQLite worker database path must identify a regular file");
	return identity;
}
/** Inspect retained aliases only while binding a newly observed database path. */
function findChangedDatabasePaths(paths, observed) {
	return [...paths].filter((pathname) => inspectDatabasePathIdentitySync(pathname)?.key !== observed.key);
}
async function readDatabasePathIdentity(databasePath) {
	const file = await stat(databasePath, { bigint: true }).catch((error) => {
		if (hasNodeErrorCode(error, "ENOENT")) return;
		throw error;
	});
	if (file) try {
		const canonicalPath = await realpath(databasePath);
		return existingIdentity(file, await stat(canonicalPath, { bigint: true }), canonicalPath);
	} catch (error) {
		if (hasNodeErrorCode(error, "ENOENT")) throw new Error("SQLite database pathname changed during admission", { cause: error });
		throw error;
	}
	const missing = [];
	let ancestor = databasePath;
	while (true) try {
		const canonicalPath = normalizeDatabasePath(path.join(await realpath(ancestor), ...missing));
		return {
			key: `path:${canonicalPath}`,
			canonicalPath
		};
	} catch (error) {
		ancestor = missingAncestorParent(ancestor, missing, error);
	}
}
function assertExistingDatabaseIdentity(databasePath, expected, expectedBirthtime) {
	assertDatabaseFileIdentity(statSync(databasePath, { bigint: true }), {
		key: expected,
		birthtime: expectedBirthtime
	});
}
function isSoleDatabaseFileDescriptor(descriptor, file) {
	if (process.platform !== "linux") return false;
	try {
		for (const name of readdirSync("/proc/self/fd")) {
			if (!/^\d+$/u.test(name) || Number(name) === descriptor) continue;
			try {
				const other = fstatSync(Number(name), { bigint: true });
				if (other.dev === file.dev && other.ino === file.ino) return false;
			} catch (error) {
				if (!hasNodeErrorCode(error, "EBADF")) return false;
			}
		}
		return true;
	} catch {
		return false;
	}
}
//#endregion
//#region src/infra/sqlite-database-admission-record.ts
function readSqliteDatabaseAdmissionIdentity(file) {
	return `${file.dev}:${file.ino}:${readDatabaseIdentityBirthtime(file)}`;
}
const SqliteDatabaseGenerationSlot = {
	schemaRevision: 0,
	factRevision: 1,
	publicationRevision: 2,
	retired: 3,
	writeRevision: 4,
	hostRevision: 5,
	unscopedWriteRevision: 6,
	writeScopeRevision: 7,
	sealPresent: 8
};
const SQLITE_DATABASE_GENERATION_LENGTH = Object.keys(SqliteDatabaseGenerationSlot).length;
function readSqliteDatabaseAdmissions(value) {
	return Array.isArray(value) ? value : void 0;
}
function isSqliteDatabaseAdmissionRetired(record) {
	return readSqliteDatabaseGeneration(record, "retired") !== 0;
}
function isSqliteDatabaseAdmissionFactCurrent(record, fact) {
	return !isSqliteDatabaseAdmissionRetired(record) && Atomics.load(new Int32Array(fact.current), 0) === 1 && fact.revision === readSqliteDatabaseFactRevision(record, fact.schemaDependent);
}
function hasSqliteDatabaseSchemaAdmission(record) {
	const fact = record?.facts.get("sqlite-schema");
	return Boolean(record && fact && isSqliteDatabaseAdmissionFactCurrent(record, fact));
}
function readSqliteDatabaseFactRevision(record, schemaDependent) {
	return readSqliteDatabaseGeneration(record, schemaDependent ? "schemaRevision" : "factRevision");
}
function readSqliteDatabaseGeneration(record, slot) {
	return Atomics.load(new Int32Array(record.generation), SqliteDatabaseGenerationSlot[slot]);
}
function advanceSqliteDatabaseGeneration(record, slot) {
	return Atomics.add(new Int32Array(record.generation), SqliteDatabaseGenerationSlot[slot], 1);
}
function publishSqliteDatabaseFact(record, key, value, revision, publication) {
	if (revision !== readSqliteDatabaseFactRevision(record, key.schemaDependent)) return false;
	if (key.writer === "host") advanceSqliteDatabaseGeneration(record, "hostRevision");
	const previous = record.facts.get(key.name);
	if (previous) Atomics.store(new Int32Array(previous.current), 0, 0);
	const current = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
	Atomics.store(new Int32Array(current), 0, 1);
	record.facts.set(key.name, {
		value,
		revision,
		schemaDependent: key.schemaDependent === true,
		publication,
		current
	});
	advanceSqliteDatabaseGeneration(record, "publicationRevision");
	return true;
}
function createSqliteDatabaseAdmissionCursor() {
	return {
		revision: -1,
		records: /* @__PURE__ */ new WeakMap()
	};
}
function changedAdmissionEntries(current, previous) {
	const changed = /* @__PURE__ */ new Map();
	for (const [key, value] of current) if (previous.get(key) !== value) changed.set(key, value);
	return changed;
}
var SqliteDatabaseAdmissionRegistry = class {
	constructor() {
		this.records = /* @__PURE__ */ new Map();
		this.locations = /* @__PURE__ */ new Map();
		this.published = /* @__PURE__ */ new Map();
		this.descriptors = /* @__PURE__ */ new Map();
		this.revision = 0;
	}
	changeReferences(record, change) {
		let references = record.references.get(threadId);
		if (!references) {
			references = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
			record.references.set(threadId, references);
		}
		if (Atomics.add(new Int32Array(references), 0, change) + change !== (change === 1 ? 1 : 0)) return false;
		if (change === -1) this.retireUnreferenced(record);
		this.publish(record);
		return true;
	}
	retireUnreferenced(record) {
		if (threadId !== 0 || [...record.references.values()].some((references) => Atomics.load(new Int32Array(references), 0) > 0)) return;
		Atomics.compareExchange(new Int32Array(record.generation), SqliteDatabaseGenerationSlot.retired, 0, 2);
		record.facts.clear();
		record.writeScopes.clear();
	}
	releaseWorker(owner) {
		for (const record of this.records.values()) {
			const references = owner > 0 ? record.references.get(owner) : void 0;
			if (!references) continue;
			const priorReferences = Atomics.exchange(new Int32Array(references), 0, -1);
			this.retireUnreferenced(record);
			if (priorReferences <= 0) continue;
			advanceSqliteDatabaseGeneration(record, "writeRevision");
			advanceSqliteDatabaseGeneration(record, "unscopedWriteRevision");
		}
		this.publish();
	}
	observeLocation(location, identity) {
		this.locations.set(normalizeDatabasePath(path.resolve(location)), identity);
	}
	forLocation(location) {
		const identity = this.locations.get(normalizeDatabasePath(path.resolve(location)));
		const record = identity === void 0 ? void 0 : this.records.get(identity);
		return record && !isSqliteDatabaseAdmissionRetired(record) ? record : void 0;
	}
	hasSchemaAdmissionForIdentity(physicalIdentity) {
		if (!physicalIdentity.key.startsWith("file:") || physicalIdentity.birthtime === void 0) return false;
		const key = `${physicalIdentity.key.slice(5)}:${physicalIdentity.birthtime}`;
		return hasSqliteDatabaseSchemaAdmission(this.records.get(key));
	}
	forget(identity) {
		this.records.delete(identity);
		this.published.delete(identity);
		for (const [location, observed] of this.locations) if (observed === identity) this.locations.delete(location);
	}
	retainDescriptor(location, descriptor, opened) {
		const record = {
			identity: readSqliteDatabaseAdmissionIdentity(opened),
			physicalIdentity: {
				key: `file:${opened.dev}:${opened.ino}`,
				birthtime: readDatabaseIdentityBirthtime(opened)
			},
			location,
			descriptor,
			descriptorOwner: 0,
			generationId: randomUUID(),
			generation: new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * SQLITE_DATABASE_GENERATION_LENGTH),
			writeScopes: /* @__PURE__ */ new Map(),
			writeScopeRevision: 0,
			references: /* @__PURE__ */ new Map(),
			facts: /* @__PURE__ */ new Map()
		};
		this.records.set(record.identity, record);
		this.descriptors.set(record.identity, descriptor);
		this.observeLocation(location, record.identity);
		this.publish(record);
		return record;
	}
	/** Only the joined lifecycle owner may release a retained descriptor. */
	retireDescriptor(identity, options) {
		const record = this.records.get(identity);
		const descriptor = this.descriptors.get(identity) ?? record?.descriptor;
		if (descriptor === void 0) return false;
		const file = fs.fstatSync(descriptor, { bigint: true });
		if (file.nlink > 1n || options.requireSoleDescriptor && !isSoleDatabaseFileDescriptor(descriptor, file)) return false;
		if (record) Atomics.store(new Int32Array(record.generation), SqliteDatabaseGenerationSlot.retired, 1);
		fs.closeSync(descriptor);
		this.descriptors.delete(identity);
		this.forget(identity);
		this.publish();
		return true;
	}
	publish(record) {
		if (record && this.records.get(record.identity) !== record) return;
		for (const current of this.records.values()) {
			if (isSqliteDatabaseAdmissionRetired(current)) {
				if (readSqliteDatabaseGeneration(current, "retired") === 1) this.descriptors.delete(current.identity);
				this.forget(current.identity);
				continue;
			}
			if (record && current !== record) continue;
			let changed = current === record;
			for (const [owner, references] of current.references) if (Atomics.load(new Int32Array(references), 0) < 0) {
				current.references.delete(owner);
				changed = true;
			}
			for (const [key, revision] of current.writeScopes) if (Atomics.load(revision.state, 1) !== 0) {
				current.writeScopes.delete(key);
				changed = true;
			}
			if (!changed) continue;
			if (threadId === 0) current.writeScopeRevision = readSqliteDatabaseGeneration(current, "writeScopeRevision");
			this.published.set(current.identity, {
				...current,
				facts: new Map(current.facts),
				writeScopes: new Map(current.writeScopes),
				references: new Map(current.references),
				hostRevision: threadId === 0 ? readSqliteDatabaseGeneration(current, "hostRevision") : current.hostRevision
			});
		}
		this.revision++;
		setEnvironmentData(SQLITE_DATABASE_ADMISSIONS_KEY, [...this.published.values()]);
	}
	capture(cursor, identities) {
		if (!identities && !cursor) this.publish();
		if (!identities && cursor?.revision === this.revision) return [];
		const records = identities ? [...identities].flatMap((identity) => {
			const record = this.published.get(identity);
			return record && !isSqliteDatabaseAdmissionRetired(record) ? [record] : [];
		}) : [...this.published.values()];
		if (!cursor) return records;
		if (!identities) cursor.revision = this.revision;
		return records.flatMap((record) => {
			const previous = cursor.records.get(record.generation);
			if (previous === record) return [];
			cursor.records.set(record.generation, record);
			return [previous ? {
				...record,
				facts: changedAdmissionEntries(record.facts, previous.facts),
				writeScopes: changedAdmissionEntries(record.writeScopes, previous.writeScopes),
				references: changedAdmissionEntries(record.references, previous.references)
			} : record];
		});
	}
	install(admissions) {
		for (const incoming of admissions) {
			let record = this.records.get(incoming.identity);
			if (incoming.descriptorOwner !== 0 || isSqliteDatabaseAdmissionRetired(incoming)) {
				if (record && isSqliteDatabaseAdmissionRetired(record)) this.publish(record);
				continue;
			}
			let changed = false;
			if (record && isSqliteDatabaseAdmissionRetired(record)) record = void 0;
			if (!record) {
				record = {
					...incoming,
					hostRevision: void 0
				};
				this.records.set(incoming.identity, record);
				this.observeLocation(incoming.location, incoming.identity);
				changed = true;
			} else if (record.generationId !== incoming.generationId) continue;
			for (const [key, fact] of incoming.facts) if (isSqliteDatabaseAdmissionFactCurrent(incoming, fact) && record.facts.get(key)?.publication !== fact.publication) {
				record.facts.set(key, fact);
				changed = true;
			}
			for (const [key, revision] of incoming.writeScopes) {
				if (Atomics.load(revision.state, 1) !== 0) continue;
				const previous = record.writeScopes.get(key);
				if (previous?.identity === revision.identity || threadId === 0 && previous && Atomics.load(previous.state, 1) === 0) continue;
				if (threadId === 0) advanceSqliteDatabaseGeneration(record, "writeScopeRevision");
				record.writeScopes.set(key, revision);
				changed = true;
			}
			const writeScopeRevision = readSqliteDatabaseGeneration(record, "writeScopeRevision");
			if (threadId === 0 || incoming.writeScopeRevision === writeScopeRevision) {
				changed ||= record.writeScopeRevision !== writeScopeRevision;
				record.writeScopeRevision = writeScopeRevision;
			}
			for (const [owner, references] of incoming.references) if (!record.references.has(owner) && Atomics.load(new Int32Array(references), 0) >= 0) {
				record.references.set(owner, references);
				changed = true;
			}
			if (threadId !== 0 && incoming.hostRevision !== void 0 && incoming.hostRevision !== record.hostRevision && incoming.hostRevision === readSqliteDatabaseGeneration(record, "hostRevision")) {
				record.hostRevision = incoming.hostRevision;
				changed = true;
			}
			this.retireUnreferenced(record);
			if (changed || isSqliteDatabaseAdmissionRetired(record)) this.publish(record);
		}
	}
};
//#endregion
//#region src/infra/sqlite-native-admission.ts
const state$3 = resolveGlobalSingleton(Symbol.for("openclaw.sqliteNativeAdmissions"), () => ({ operations: /* @__PURE__ */ new WeakMap() }));
function getSqliteNativeAdmissionFacts(database) {
	return state$3.operations.get(database)?.facts;
}
/** Callback-local facts may describe an implicit statement transaction that can still abort. */
function beginSqliteDatabaseAdmissionOperation(database) {
	const current = state$3.operations.get(database) ?? {
		depth: 0,
		facts: /* @__PURE__ */ new Map()
	};
	current.depth += 1;
	state$3.operations.set(database, current);
	return () => {
		current.depth -= 1;
		if (current.depth === 0) state$3.operations.delete(database);
	};
}
//#endregion
//#region src/infra/sqlite-database-admission-read.ts
/** Admission lookups consume the owning registry and transaction-local state. */
function createSqliteDatabaseAdmissionReader(owner) {
	const { state, admission, pathAdmission, exchange, publishFact } = owner;
	function getSqliteDatabaseAdmission(database, key, options = {}) {
		const anchor = sqlPublicationAnchor(database);
		if (!anchor.isOpen || state.suspended.has(anchor)) return;
		const record = admission(anchor, options.existingOnly !== true && !database.isTransaction);
		if (!record) return;
		const local = (isPostgresSqlConnection(database) ? void 0 : getSqliteNativeAdmissionFacts(database))?.get(key.name) ?? state.local.get(anchor)?.get(key.name);
		if (local && local.revision === readSqliteDatabaseFactRevision(record, local.schemaDependent) && (!local.schemaDependent || local.ddlRevision === (state.ddlRevisions.get(anchor) ?? 0))) return key.read(local.value);
		if (key.schemaDependent && state.schemaDirty.has(anchor)) return;
		if (state.rolledBack.has(anchor)) {
			if (database.isTransaction) return;
			state.rolledBack.delete(anchor);
		}
		let fact = record.facts.get(key.name);
		if (!fact || !isSqliteDatabaseAdmissionFactCurrent(record, fact)) {
			if (key.writer === "host") {
				if (database.isTransaction || threadId === 0 || record.hostRevision === readSqliteDatabaseGeneration(record, "hostRevision")) return;
				exchange(record);
				fact = record.facts.get(key.name);
				return fact && isSqliteDatabaseAdmissionFactCurrent(record, fact) ? key.read(fact.value) : void 0;
			}
			const revision = readSqliteDatabaseGeneration(record, "publicationRevision");
			const misses = state.misses.get(record) ?? /* @__PURE__ */ new Map();
			state.misses.set(record, misses);
			if (!database.isTransaction && misses.get(key.name) !== revision) {
				exchange(record);
				fact = record.facts.get(key.name);
				misses.set(key.name, readSqliteDatabaseGeneration(record, "publicationRevision"));
			}
		}
		return fact && isSqliteDatabaseAdmissionFactCurrent(record, fact) ? key.read(fact.value) : void 0;
	}
	function getOrLoadSqliteDatabaseAdmissionForPath(location, key, load) {
		const record = pathAdmission(location);
		const fact = record?.facts.get(key.name);
		const cached = record && fact && isSqliteDatabaseAdmissionFactCurrent(record, fact) ? key.read(fact.value) : void 0;
		if (cached !== void 0) return cached;
		const generation = record ? readSqliteDatabaseFactRevision(record, key.schemaDependent) : void 0;
		const value = load();
		if (record && generation !== void 0 && value !== void 0) publishFact(record, key, value, generation);
		return value;
	}
	return {
		getSqliteDatabaseAdmission,
		getOrLoadSqliteDatabaseAdmissionForPath
	};
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
	if (char === "\"" || char === "`" || char === "[") {
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
	for (const index of unquotedSqlIndexes(sql, 0)) {
		const char = sql[index];
		if (char === "(") depth += 1;
		else if (char === ")") depth -= 1;
		else if (char === "," && depth === 0) {
			items.push(sql.slice(start, index));
			start = index + 1;
		}
	}
	items.push(sql.slice(start));
	return items;
}
function findSqlCharacter(sql, character) {
	for (const index of unquotedSqlIndexes(sql, 0)) if (sql[index] === character) return index;
	return -1;
}
/** Match SQL keywords without treating quoted payloads, identifiers or comments as code. */
function hasUnquotedSqlKeyword(sql, keywords) {
	const starts = /* @__PURE__ */ new Set();
	for (const match of sql.matchAll(keywords)) starts.add(match.index);
	if (starts.size === 0) return false;
	for (const index of unquotedSqlIndexes(sql, 0)) if (starts.has(index)) return true;
	return false;
}
function findSqlClosingParenthesis(sql, open) {
	let depth = 0;
	for (const index of unquotedSqlIndexes(sql, open)) {
		const char = sql[index];
		if (char === "(") depth += 1;
		else if (char === ")") {
			depth -= 1;
			if (depth === 0) return index;
		}
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
		let text = segment[0];
		if (quoted !== index) {
			text = sql.slice(index, quoted);
			segments.lastIndex = quoted;
		} else {
			const comment = skipSqlComment(sql, index);
			if (comment !== index) {
				pendingSpace = true;
				segments.lastIndex = comment;
				continue;
			}
			if (/\s/u.test(char)) {
				pendingSpace = true;
				continue;
			}
		}
		if (pendingSpace && normalized.length > 0) normalized += " ";
		normalized += text;
		pendingSpace = false;
	}
	return normalized.trim();
}
function quoteSqliteIdentifier(identifier) {
	return `"${identifier.replaceAll("\"", "\"\"")}"`;
}
function* unquotedSqlIndexes(sql, start) {
	let index = start;
	while (index < sql.length) {
		const quoted = skipSqlQuoted(sql, index, sql[index] ?? "");
		const next = quoted !== index ? quoted : skipSqlComment(sql, index);
		if (next !== index) index = next;
		else {
			yield index;
			index += 1;
		}
	}
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
		definition: isVirtualTable ? null : parseSqliteTableDefinition(table.sql, tableName),
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
		kind: cid === -2 ? "expression" : cid === -1 ? "rowid" : "column",
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
function parseSqliteTableDefinition(sql, tableName) {
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
const STARTUP_ADDITIVE_AGENT_COLUMN_DEFINITIONS = [
	{
		tableName: "session_pending_inputs",
		columnName: "consumed_event_id",
		dataType: "TEXT"
	},
	{
		tableName: "session_transcript_active_events",
		columnName: "context_eligible",
		dataType: "INTEGER"
	},
	{
		tableName: "session_nodes",
		columnName: "project_id",
		dataType: "TEXT"
	},
	{
		tableName: "session_windows",
		columnName: "row_transcript_json",
		dataType: "TEXT"
	},
	{
		tableName: "session_windows",
		columnName: "row_transcript_updated_at",
		dataType: "INTEGER"
	},
	{
		tableName: "session_conversations",
		columnName: "route_context_json",
		dataType: "TEXT"
	}
];
/** Missing feature-local tables stay absent; existing tables must satisfy this build's readers. */
function hasPendingAgentStartupColumns(tableSql) {
	const columns = /* @__PURE__ */ new Map();
	return STARTUP_ADDITIVE_AGENT_COLUMN_DEFINITIONS.some(({ tableName, columnName }) => {
		if (!tableSql.has(tableName)) return false;
		const sql = tableSql.get(tableName);
		if (!sql) return true;
		let parsed = columns.get(tableName);
		if (!parsed) {
			parsed = parseSqliteTableDefinition(sql, tableName).columns;
			columns.set(tableName, parsed);
		}
		return !parsed.has(columnName);
	});
}
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
function readGitMetadataFile(filePath, limit = 1048576) {
	const fd = fs.openSync(filePath, fs.constants.O_RDONLY | (fs.constants.O_NONBLOCK ?? 0));
	try {
		const stat = fs.fstatSync(fd);
		if (!stat.isFile() || stat.size > limit) throw new Error("Git metadata is not a bounded regular file");
		const bytes = readFileDescriptorBoundedSync(fd, Math.min(stat.size, limit));
		if (bytes.length !== stat.size) throw new Error("Git metadata changed during its read");
		return bytes;
	} finally {
		fs.closeSync(fd);
	}
}
function readGitDirectoryPointerTarget(filePath, prefix = "") {
	const bytes = readGitMetadataFile(filePath);
	const raw = bytes.toString("utf8").replace(/[\r\n]+$/u, "");
	if (!isUtf8(bytes) || !raw.startsWith(prefix) || raw.length === prefix.length || raw.includes("\0")) throw new Error("Git directory pointer is incomplete or malformed");
	const target = raw.slice(prefix.length);
	return path.isAbsolute(target) ? target : `${path.dirname(filePath)}${path.sep}${target}`;
}
function readGitDirectoryPointer(filePath, prefix = "") {
	return fs.realpathSync.native(readGitDirectoryPointerTarget(filePath, prefix));
}
function resolveGitDirFromMarker(repoRoot) {
	const gitPath = path.join(repoRoot, ".git");
	try {
		const stat = fs.statSync(gitPath);
		if (stat.isDirectory()) return gitPath;
		if (!stat.isFile()) return null;
		return readGitDirectoryPointer(gitPath, "gitdir: ");
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
	const fd = fs.openSync(filePath, fs.constants.O_RDONLY | (fs.constants.O_NONBLOCK ?? 0));
	try {
		if (!fs.fstatSync(fd).isFile()) throw new Error("Git metadata is not a regular file");
		const buf = Buffer.alloc(limit);
		const bytesRead = readFileWindowFullySync(fd, buf, 0);
		return buf.subarray(0, bytesRead).toString("utf-8");
	} finally {
		fs.closeSync(fd);
	}
}
function readGitHead(startDir, opts = {}) {
	const headPath = resolveGitHeadPath(startDir, opts);
	if (!headPath) return;
	const head = readGitMetadataFile(headPath).toString("utf8").trim();
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
	const marker = path.join(gitDir, "commondir");
	try {
		return readGitDirectoryPointer(marker);
	} catch (error) {
		if (!isMissingPathError(error) || fs.lstatSync(marker, { throwIfNoEntry: false })) throw error;
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
		const packedRefs = readGitMetadataFile(path.join(refsBase, "packed-refs"), Number.MAX_SAFE_INTEGER).toString("utf8");
		const records = new RegExp(`^(?![#^])[^\\S\\r\\n]*(\\S+)[^\\S\\r\\n]+(${[...missing].map(escapeRegExp).join("|")})(?=\\s|$)`, "gm");
		for (const [, value, packedRef] of packedRefs.matchAll(records)) if (missing.delete(packedRef)) values.set(packedRef, value);
	} catch (error) {
		if (!isMissingPathError(error)) throw error;
	}
	return values;
}
/** Safely resolve a Git ref path, rejecting traversal from a crafted HEAD file. */
function resolveRefPath(refsBase, ref) {
	if (!ref.startsWith("refs/")) return null;
	if (ref.split(/[/]/).includes("..")) return null;
	const resolved = path.resolve(refsBase, ref);
	const rel = path.relative(refsBase, resolved);
	if (!rel || rel.startsWith("..") || path.isAbsolute(rel)) return null;
	return resolved;
}
//#endregion
//#region src/infra/lru-cache.ts
/** Process-local LRU storage; callers own freshness and lifecycle. */
var LruCache = class {
	#maxEntries;
	#maxBytes;
	#sizeOf;
	#entries = /* @__PURE__ */ new Map();
	#bytes = 0;
	constructor(maxEntries, options) {
		this.#maxEntries = Number.isFinite(maxEntries) && maxEntries > 0 ? Math.max(1, Math.floor(maxEntries)) : 1;
		this.#maxBytes = options?.maxBytes ?? Number.POSITIVE_INFINITY;
		this.#sizeOf = options?.sizeOf;
	}
	get size() {
		return this.#entries.size;
	}
	clear() {
		this.#entries.clear();
		this.#bytes = 0;
	}
	keys() {
		return this.#entries.keys();
	}
	delete(cacheKey) {
		if (!this.#entries.has(cacheKey)) return false;
		this.#bytes -= this.#sizeOf?.(this.#entries.get(cacheKey)) ?? 0;
		return this.#entries.delete(cacheKey);
	}
	deleteValue(value) {
		for (const [key, entry] of this.#entries) if (entry === value) this.delete(key);
	}
	/** Reads without promoting a value whose revalidation is still pending. */
	peek(cacheKey) {
		return this.#entries.get(cacheKey);
	}
	/** Returns a cached value and refreshes its recency when present. */
	get(cacheKey) {
		if (!this.#entries.has(cacheKey)) return;
		const cached = this.#entries.get(cacheKey);
		this.#entries.delete(cacheKey);
		this.#entries.set(cacheKey, cached);
		return cached;
	}
	/** Stores a value as the newest entry and evicts oldest entries past capacity. */
	set(cacheKey, value) {
		this.delete(cacheKey);
		this.#entries.set(cacheKey, value);
		this.#bytes += this.#sizeOf?.(value) ?? 0;
		for (const key of this.#entries.keys()) {
			if (this.#entries.size <= this.#maxEntries && this.#bytes <= this.#maxBytes) break;
			this.delete(key);
		}
	}
};
//#endregion
//#region src/infra/error-graph-internal.ts
/** Retained errors must not keep callers alive through V8's lazy stack frames. */
function materializeErrorStack(failure) {
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
//#endregion
//#region src/shared/detached-async-context.ts
const asyncHooks = typeof process === "undefined" ? void 0 : process.getBuiltinModule("node:async_hooks");
const detachedAsyncContext = asyncHooks ? resolveGlobalSingleton(Symbol.for("openclaw.detachedAsyncContext"), () => new asyncHooks.AsyncResource("openclaw.detached-async-context")) : void 0;
/** Runs under the context-free async root initialized before managed work can begin. */
function runInDetachedAsyncContext(run) {
	return detachedAsyncContext ? detachedAsyncContext.runInAsyncScope(run) : run();
}
//#endregion
//#region src/shared/deferred.ts
const promiseWithResolvers = Promise;
function createDeferredCore() {
	return promiseWithResolvers.withResolvers();
}
//#endregion
//#region src/shared/async-work-scope.ts
const currentWorkScope = resolveGlobalSingleton(Symbol.for("openclaw.asyncWorkScope"), () => new AsyncLocalStorage());
const currentWorkScopeAncestry = resolveGlobalSingleton(Symbol.for("openclaw.asyncWorkScopeAncestry"), () => new AsyncLocalStorage());
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
		return new AsyncResource("OpenClawAsyncWorkScope").runInAsyncScope(() => {
			currentWorkScope.enterWith(this);
			currentWorkScopeAncestry.enterWith({
				scope: this,
				parent
			});
			return run();
		});
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
		const operation = createDeferredCore();
		this.pending.add(operation.promise);
		operation.promise.then(() => this.pending.delete(operation.promise), (error) => {
			this.pending.delete(operation.promise);
			this.failures?.add(error);
		});
		try {
			operation.resolve(this.enter(run));
		} catch (error) {
			operation.reject(error);
		}
		return operation.promise;
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
/** Starts work its caller does not own, so the caller's scope neither waits for it nor closes under it. */
function runOutsideAsyncWorkScope(run) {
	return currentWorkScope.exit(() => currentWorkScopeAncestry.exit(run));
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
			parents: /* @__PURE__ */ new Map(),
			aliases: /* @__PURE__ */ new Map(),
			registeredHosts: /* @__PURE__ */ new Set(),
			hostRoots: /* @__PURE__ */ new Map(),
			nearestPackageRoots: /* @__PURE__ */ new Map(),
			loaderPackageRoots: /* @__PURE__ */ new Map(),
			allowedParentRoots: /* @__PURE__ */ new Map()
		}
	};
}
resolveGlobalSingleton(Symbol.for("openclaw.pluginSourceRecoveryUnavailableError"), () => class SourceRecoveryUnavailableError extends Error {
	constructor(cause) {
		super("Captured plugin source is missing; its previous code cannot be recovered.", { cause });
		this.name = "PluginSourceRecoveryUnavailableError";
	}
});
const PluginInstanceDrainTimeoutError = resolveGlobalSingleton(Symbol.for("openclaw.pluginInstanceDrainTimeoutError"), () => class DrainTimeoutError extends Error {
	constructor(message, settled, options, forcedRetirement) {
		super(message, options);
		this.settled = settled;
		this.forcedRetirement = forcedRetirement;
		this.name = "PluginInstanceDrainTimeoutError";
	}
});
//#endregion
//#region src/plugins/plugin-cache.ts
const state$2 = resolveGlobalSingleton(Symbol.for("openclaw.pluginCache"), () => ({
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
		bundledProviderPolicySurfaces: /* @__PURE__ */ new WeakMap(),
		staticCatalogStates: /* @__PURE__ */ new WeakMap(),
		modelSuppressionResolvers: /* @__PURE__ */ new WeakMap(),
		mcpAuthDeclarations: /* @__PURE__ */ new WeakMap()
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
		moduleLoaders: /* @__PURE__ */ new Map(),
		sources: /* @__PURE__ */ new Map(),
		sourceAliases: /* @__PURE__ */ new Map(),
		runtimeRecordRoots: /* @__PURE__ */ new WeakMap()
	};
}
function getProcessPluginCache() {
	return state$2.current ??= createPluginCache({ kind: "process" });
}
function getScopedPluginCache() {
	return getPluginExecutionFrame()?.cacheScope?.cache;
}
function getPluginCache() {
	return getScopedPluginCache() ?? getProcessPluginCache();
}
/** Stop new setup calls immediately; the owner awaits in-flight calls and graph cleanup. */
function retirePluginCache(cache, beforeRetire, options) {
	const retained = getPluginCacheRetainers(cache);
	if (retained.retirement) return retained.retirement;
	const completion = createDeferredCore();
	retained.retirement = completion.promise;
	const retire = async () => {
		if (retained.references.size) await retained.settled.promise;
		const work = new AsyncWorkScope();
		try {
			return await work.track(() => beginPluginCacheRetirement(cache, beforeRetire, options));
		} finally {
			await work.drain();
		}
	};
	retained.controller.abort();
	materializeErrorStack(retained.controller.signal.reason);
	runOutsideAsyncWorkScope(retire).then(completion.resolve, completion.reject);
	return completion.promise;
}
function beginPluginCacheRetirement(cache, beforeRetire, options) {
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
			result: await resource.dispose(void 0, options)
		})));
		const nativeAdmissions = cache.sourceAdmissions;
		if (nativeAdmissions) {
			const pending = outcomes.flatMap((outcome) => outcome.status === "fulfilled" ? outcome.value.result.errors.flatMap((error) => error instanceof PluginInstanceDrainTimeoutError ? [error.settled] : []) : []);
			if (pending.length > 0) Promise.allSettled(pending).then(() => nativeAdmissions.dispose()).catch((error) => process.emitWarning(`Plugin native capture cleanup failed: ${String(error)}`));
			else await nativeAdmissions.dispose();
		}
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
	for (const current of iterAncestorDirs(startDir, maxDepth)) if (readPackageNameSync(current) === "openclaw") return current;
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
	const normalized = cacheKey;
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
function preparePackageRootSearch(opts, preserveInventory) {
	const candidates = buildCandidates(opts);
	const cacheKey = candidates.join("\0");
	const searches = getPluginCache().sdk.packageSearches;
	const cached = searches.get(cacheKey);
	return {
		candidates,
		first: cached?.all ? cached.all[0] ?? null : cached?.first,
		complete(first) {
			searches.set(cacheKey, preserveInventory ? {
				...searches.get(cacheKey),
				first
			} : { first });
			return first;
		}
	};
}
function resolveOpenClawPackageRootSync(opts) {
	const search = preparePackageRootSearch(opts, false);
	if (search.first !== void 0) return search.first;
	for (const candidate of search.candidates) {
		const found = findPackageRootSync(candidate);
		if (found) return search.complete(found);
	}
	return search.complete(null);
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
	return [...new Set(candidates.map((candidate) => path.resolve(candidate)))];
}
//#endregion
//#region src/infra/git-commit.ts
const formatCommit = (value) => {
	const match = value?.match(/[0-9a-fA-F]{7,40}/);
	return match ? normalizeLowercaseStringOrEmpty(match[0].slice(0, 7)) : null;
};
const cachedGitCommitBySearchDir = new LruCache(256);
const resolveCommitSearchDir = (options) => {
	if (options.cwd) return path.resolve(options.cwd);
	if (options.moduleUrl) try {
		return path.dirname(fileURLToPath(options.moduleUrl));
	} catch {}
	return process.cwd();
};
const cacheGitCommit = (searchDir, commit) => {
	cachedGitCommitBySearchDir.set(searchDir, commit);
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
	const cached = cachedGitCommitBySearchDir.get(searchDir);
	if (cached !== void 0) return cached;
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
//#region src/state/openclaw-agent-schema.ts
const OPENCLAW_AGENT_SCHEMA_SQL = "-- Session storage doctrine: session_nodes.entry_json owns hot logical-session facts;\n-- session_entry_snapshots owns keyed cold values. Promoted node columns are query\n-- indexes; session_windows and their children own transcript generations.\n-- Legacy ACP provenance is private import evidence carried with its logical session.\n\nCREATE TABLE IF NOT EXISTS schema_meta (\n  meta_key TEXT NOT NULL PRIMARY KEY,\n  role TEXT NOT NULL,\n  schema_version INTEGER NOT NULL,\n  agent_id TEXT,\n  app_version TEXT,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS session_nodes (\n  session_key TEXT NOT NULL PRIMARY KEY,\n  current_session_id TEXT NOT NULL,\n  entry_json TEXT NOT NULL,\n  session_started_at INTEGER,\n  has_optional_references INTEGER NOT NULL DEFAULT 0,\n  snapshot_revision INTEGER NOT NULL DEFAULT 0,\n  legacy_acp_migration_json TEXT,\n  entry_valid INTEGER NOT NULL DEFAULT 0 CHECK (entry_valid IN (-1, 0, 1)),\n  updated_at INTEGER NOT NULL,\n  status TEXT CHECK (status IS NULL OR status IN ('running', 'done', 'failed', 'killed', 'timeout')),\n  created_at INTEGER,\n  created_via TEXT CHECK (created_via IS NULL OR created_via IN ('operator', 'spawn', 'channel', 'cron', 'talk', 'run', 'plugin', 'internal')),\n  created_actor_type TEXT CHECK (created_actor_type IS NULL OR created_actor_type IN ('human', 'agent', 'system')),\n  created_actor_id TEXT,\n  owner_actor_type TEXT,\n  owner_actor_id TEXT,\n  owner_assigned_by_type TEXT,\n  owner_assigned_by_id TEXT,\n  owner_assigned_at INTEGER,\n  project_id TEXT,\n  parent_session_key TEXT,\n  spawned_by TEXT,\n  fork_source_session_key TEXT,\n  fork_source_session_id TEXT,\n  fork_source_entry_id TEXT,\n  label TEXT,\n  display_name TEXT,\n  category TEXT,\n  icon TEXT,\n  pinned_at INTEGER,\n  archived_at INTEGER,\n  last_read_at INTEGER,\n  last_interaction_at INTEGER,\n  last_activity_at INTEGER\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS session_entry_snapshots (\n  session_key TEXT NOT NULL,\n  field TEXT NOT NULL CHECK (field IN ('sessionDiffBaseline', 'skillsSnapshot', 'systemPromptReport')),\n  value_json TEXT NOT NULL,\n  PRIMARY KEY (session_key, field),\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE\n) STRICT, WITHOUT ROWID;\n\nCREATE TRIGGER IF NOT EXISTS session_entry_snapshots_after_insert\nAFTER INSERT ON session_entry_snapshots\nBEGIN\n  UPDATE session_nodes SET snapshot_revision = snapshot_revision + 1\n  WHERE session_key = NEW.session_key;\nEND;\n\nCREATE TRIGGER IF NOT EXISTS session_entry_snapshots_after_update\nAFTER UPDATE OF session_key, field, value_json ON session_entry_snapshots\nWHEN NEW.session_key IS NOT OLD.session_key\n  OR NEW.field IS NOT OLD.field OR NEW.value_json IS NOT OLD.value_json\nBEGIN\n  UPDATE session_nodes SET snapshot_revision = snapshot_revision + 1\n  WHERE session_key IN (OLD.session_key, NEW.session_key);\nEND;\n\nCREATE TRIGGER IF NOT EXISTS session_entry_snapshots_after_delete\nAFTER DELETE ON session_entry_snapshots\nBEGIN\n  UPDATE session_nodes SET snapshot_revision = snapshot_revision + 1\n  WHERE session_key = OLD.session_key;\nEND;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_updated_at\n  ON session_nodes(updated_at DESC, session_key);\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_last_interaction_at\n  ON session_nodes(last_interaction_at DESC, session_key);\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_label\n  ON session_nodes(label, session_key)\n  WHERE label IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_parent_session_key\n  ON session_nodes(parent_session_key, session_key);\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_spawned_by\n  ON session_nodes(spawned_by, session_key);\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_status\n  ON session_nodes(status, session_key)\n  WHERE status IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_archived_at\n  ON session_nodes(archived_at, session_key)\n  WHERE archived_at IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_active\n  ON session_nodes(session_key)\n  WHERE archived_at IS NULL;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_current_session_id\n  ON session_nodes(current_session_id);\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_entry_valid_pending\n  ON session_nodes(session_key)\n  WHERE entry_valid = 0;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_nodes_entry_not_valid\n  ON session_nodes(session_key)\n  WHERE entry_valid != 1;\n\nCREATE TABLE IF NOT EXISTS session_participants (\n  session_key TEXT NOT NULL,\n  identity_namespace TEXT NOT NULL,\n  actor_id TEXT NOT NULL,\n  contribution_count INTEGER NOT NULL,\n  first_prompted_at INTEGER,\n  last_prompted_at INTEGER,\n  PRIMARY KEY (session_key, identity_namespace, actor_id),\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS session_key_contract (\n  id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),\n  main_key TEXT NOT NULL,\n  canonical_ready TEXT,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nINSERT OR IGNORE INTO session_key_contract (id, main_key, updated_at) VALUES (1, 'main', 0);\n\nCREATE TABLE IF NOT EXISTS session_windows (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  session_key TEXT NOT NULL,\n  previous_session_id TEXT,\n  reason TEXT CHECK (reason IS NULL OR reason IN ('initial', 'reset', 'rollover', 'fork', 'rewind', 'switch', 'recovery', 'compaction')),\n  session_scope TEXT NOT NULL DEFAULT 'conversation' CHECK (session_scope IN ('conversation', 'shared-main', 'group', 'channel')),\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  transcript_updated_at INTEGER DEFAULT NULL,\n  row_transcript_json TEXT,\n  row_transcript_updated_at INTEGER,\n  transcript_observed_at INTEGER DEFAULT NULL,\n  session_entry_provenance INTEGER NOT NULL DEFAULT 0 CHECK (session_entry_provenance IN (0, 1)),\n  acp_owned INTEGER NOT NULL DEFAULT 0 CHECK (acp_owned IN (0, 1)),\n  plugin_owner_id TEXT,\n  hook_external_content_source TEXT CHECK (hook_external_content_source IS NULL OR hook_external_content_source IN ('gmail', 'webhook')),\n  started_at INTEGER,\n  ended_at INTEGER,\n  status TEXT CHECK (status IS NULL OR status IN ('running', 'done', 'failed', 'killed', 'timeout')),\n  chat_type TEXT CHECK (chat_type IS NULL OR chat_type IN ('direct', 'group', 'channel')),\n  channel TEXT,\n  account_id TEXT,\n  primary_conversation_id TEXT,\n  model_provider TEXT,\n  model TEXT,\n  agent_harness_id TEXT,\n  parent_session_key TEXT,\n  spawned_by TEXT,\n  display_name TEXT,\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE,\n  FOREIGN KEY (primary_conversation_id) REFERENCES conversations(conversation_id) ON DELETE SET NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_windows_updated_at\n  ON session_windows(updated_at DESC, session_id);\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_windows_session_key\n  ON session_windows(session_key, updated_at DESC, session_id);\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_windows_created_at\n  ON session_windows(created_at DESC, session_id);\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_windows_conversation\n  ON session_windows(primary_conversation_id, updated_at DESC, session_id)\n  WHERE primary_conversation_id IS NOT NULL;\n\n-- Offline imports and repairs queue explicit work; admission also settles keys\n-- removed during repair, so the queue deliberately has no node foreign key.\nCREATE TABLE IF NOT EXISTS session_canonical_validation_pending (\n  session_key TEXT NOT NULL PRIMARY KEY\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS conversations (\n  conversation_id TEXT NOT NULL PRIMARY KEY,\n  channel TEXT NOT NULL,\n  account_id TEXT NOT NULL,\n  kind TEXT NOT NULL CHECK (kind IN ('direct', 'group', 'channel')),\n  peer_id TEXT NOT NULL,\n  delivery_target TEXT NOT NULL,\n  parent_conversation_id TEXT,\n  thread_id TEXT,\n  native_channel_id TEXT,\n  native_direct_user_id TEXT,\n  label TEXT,\n  metadata_json TEXT,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_conversations_lookup\n  ON conversations(channel, account_id, kind, peer_id, thread_id);\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_agent_conversations_identity\n  ON conversations(\n    channel,\n    account_id,\n    kind,\n    peer_id,\n    IFNULL(parent_conversation_id, ''),\n    IFNULL(thread_id, '')\n  );\n\nCREATE INDEX IF NOT EXISTS idx_agent_conversations_updated\n  ON conversations(updated_at DESC, conversation_id);\n\nCREATE TABLE IF NOT EXISTS conversation_deliveries (\n  operation_id TEXT NOT NULL PRIMARY KEY,\n  operation_kind TEXT NOT NULL CHECK (operation_kind IN ('send', 'turn')),\n  conversation_id TEXT NOT NULL,\n  source_session_key TEXT,\n  message_hash TEXT NOT NULL,\n  status TEXT NOT NULL CHECK (status IN ('created', 'queued', 'sent', 'suppressed', 'rejected', 'unknown', 'replied')),\n  prepared_message_id TEXT,\n  platform_message_id TEXT,\n  queue_id TEXT,\n  rejection_error TEXT,\n  reply_message_id TEXT,\n  reply_to_id TEXT,\n  reply_thread_id TEXT,\n  reply_text TEXT,\n  reply_timestamp INTEGER,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  CHECK (\n    (status = 'rejected' AND rejection_error IS NOT NULL) OR\n    (status != 'rejected' AND rejection_error IS NULL)\n  ),\n  FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_conversation_deliveries_reply\n  ON conversation_deliveries(conversation_id, platform_message_id, prepared_message_id)\n  WHERE status IN ('queued', 'sent', 'replied');\n\nCREATE INDEX IF NOT EXISTS idx_agent_conversation_deliveries_updated\n  ON conversation_deliveries(updated_at DESC, operation_id);\n\nCREATE TABLE IF NOT EXISTS session_conversations (\n  session_id TEXT NOT NULL,\n  conversation_id TEXT NOT NULL,\n  role TEXT NOT NULL DEFAULT 'primary' CHECK (role IN ('primary', 'participant', 'related')),\n  route_context_json TEXT,\n  first_seen_at INTEGER NOT NULL,\n  last_seen_at INTEGER NOT NULL,\n  PRIMARY KEY (session_id, conversation_id, role),\n  FOREIGN KEY (session_id) REFERENCES \"session_windows\"(session_id) ON DELETE CASCADE,\n  FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE\n) STRICT;\n\n-- Older same-version writers preserve the envelope while updating the association.\nCREATE TRIGGER IF NOT EXISTS session_conversations_route_context_invalidate_after_update\nAFTER UPDATE OF role, last_seen_at ON session_conversations\nWHEN NEW.route_context_json IS OLD.route_context_json\nBEGIN\n  UPDATE session_conversations\n  SET route_context_json = NULL\n  WHERE session_id = NEW.session_id\n    AND conversation_id = NEW.conversation_id\n    AND role = NEW.role;\nEND;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_conversations_conversation\n  ON session_conversations(conversation_id, last_seen_at DESC, session_id);\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_agent_session_conversations_primary\n  ON session_conversations(session_id)\n  WHERE role = 'primary';\n\nCREATE TABLE IF NOT EXISTS session_members (\n  session_key TEXT NOT NULL,\n  identity_id TEXT NOT NULL,\n  added_by TEXT NOT NULL,\n  added_at INTEGER NOT NULL,\n  PRIMARY KEY (session_key, identity_id),\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_members_identity\n  ON session_members(identity_id, session_key);\n\nCREATE TABLE IF NOT EXISTS session_suggestions (\n  id TEXT PRIMARY KEY,\n  session_key TEXT NOT NULL,\n  author_id TEXT NOT NULL,\n  author_label TEXT,\n  text TEXT NOT NULL,\n  created_at INTEGER NOT NULL,\n  state TEXT NOT NULL CHECK (state IN ('pending', 'accepted', 'dismissed')),\n  dispatch_token TEXT,\n  dispatch_started_at INTEGER,\n  dispatch_resolution TEXT CHECK (dispatch_resolution IN ('send', 'queue', 'edit', 'dismiss')),\n  CHECK (\n    (dispatch_token IS NULL AND dispatch_started_at IS NULL AND dispatch_resolution IS NULL)\n    OR (dispatch_token IS NOT NULL AND dispatch_started_at IS NOT NULL AND dispatch_resolution IS NOT NULL)\n  ),\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_suggestions_session_state_created\n  ON session_suggestions(session_key, state, created_at, id);\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_suggestions_author_created\n  ON session_suggestions(author_id, created_at, id);\n\nCREATE TABLE IF NOT EXISTS session_reactions (\n  session_key TEXT NOT NULL,\n  session_id TEXT NOT NULL,\n  message_id TEXT NOT NULL,\n  emoji TEXT NOT NULL,\n  identity_id TEXT NOT NULL,\n  identity_label TEXT,\n  created_at INTEGER NOT NULL,\n  PRIMARY KEY (session_key, session_id, message_id, emoji, identity_id),\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_reactions_message\n  ON session_reactions(session_key, session_id, message_id);\n\nCREATE TABLE IF NOT EXISTS board_tabs (\n  session_key TEXT NOT NULL,\n  tab_id TEXT NOT NULL,\n  title TEXT NOT NULL,\n  position INTEGER NOT NULL CHECK (position >= 0),\n  chat_dock TEXT NOT NULL DEFAULT 'right' CHECK (chat_dock IN ('left', 'right', 'bottom', 'hidden')),\n  created_by TEXT NOT NULL CHECK (created_by IN ('user', 'agent')),\n  revision INTEGER NOT NULL CHECK (revision >= 0),\n  PRIMARY KEY (session_key, tab_id),\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS board_widgets (\n  session_key TEXT NOT NULL,\n  name TEXT NOT NULL,\n  tab_id TEXT NOT NULL,\n  title TEXT,\n  content_kind TEXT NOT NULL CHECK (content_kind IN ('html', 'mcp-app', 'plugin')),\n  html BLOB,\n  descriptor_json TEXT,\n  sha256 TEXT NOT NULL,\n  view_generation TEXT,\n  revision INTEGER NOT NULL CHECK (revision >= 1),\n  size_w INTEGER NOT NULL CHECK (size_w BETWEEN 1 AND 12),\n  size_h INTEGER NOT NULL CHECK (size_h BETWEEN 1 AND 20),\n  position INTEGER NOT NULL CHECK (position >= 0),\n  manifest TEXT NOT NULL DEFAULT '{}',\n  grant_state TEXT NOT NULL DEFAULT 'none' CHECK (grant_state IN ('none', 'pending', 'granted', 'rejected')),\n  granted_sha TEXT,\n  created_by TEXT NOT NULL CHECK (created_by IN ('user', 'agent')),\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (session_key, name),\n  FOREIGN KEY (session_key, tab_id) REFERENCES board_tabs(session_key, tab_id) ON DELETE CASCADE,\n  CHECK (\n    (content_kind = 'html' AND html IS NOT NULL AND descriptor_json IS NULL AND view_generation IS NOT NULL) OR\n    (content_kind = 'mcp-app' AND html IS NULL AND descriptor_json IS NOT NULL AND view_generation IS NULL) OR\n    (content_kind = 'plugin' AND html IS NULL AND descriptor_json IS NOT NULL AND view_generation IS NULL)\n  )\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_board_widgets_tab_position\n  ON board_widgets(session_key, tab_id, position);\n\nCREATE TABLE IF NOT EXISTS session_progress_cards (\n  session_key TEXT NOT NULL PRIMARY KEY,\n  markdown TEXT,\n  steps_json TEXT,\n  revision INTEGER NOT NULL,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS heartbeat_outcomes (\n  session_key TEXT NOT NULL PRIMARY KEY,\n  run_session_key TEXT NOT NULL,\n  outcome TEXT NOT NULL CHECK (outcome IN ('progress', 'done', 'blocked', 'needs_attention')),\n  summary TEXT NOT NULL,\n  response_reason TEXT,\n  priority TEXT CHECK (priority IS NULL OR priority IN ('low', 'normal', 'high')),\n  next_check TEXT,\n  task_names_json TEXT,\n  wake_source TEXT,\n  wake_reason TEXT,\n  occurred_at INTEGER NOT NULL,\n  context_run_id TEXT,\n  context_claimed_at INTEGER,\n  updated_at INTEGER NOT NULL,\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS message_tool_run_outcomes (\n  id INTEGER PRIMARY KEY,\n  run_id TEXT NOT NULL,\n  session_key TEXT NOT NULL,\n  agent_id TEXT NOT NULL,\n  provider TEXT NOT NULL,\n  model TEXT NOT NULL,\n  outcome TEXT NOT NULL CHECK (outcome IN ('tool_delivered', 'mute')),\n  run_status TEXT NOT NULL CHECK (run_status IN ('completed', 'errored', 'aborted')),\n  occurred_at INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_message_tool_run_outcomes_occurred\n  ON message_tool_run_outcomes(occurred_at DESC, id DESC);\n\n-- Receipts outlive Goal clear and session reset so a delayed retry cannot recreate a Goal.\n-- They intentionally have no session FK; bounded retention belongs to the operation owner.\nCREATE TABLE IF NOT EXISTS session_goal_operations (\n  session_key TEXT NOT NULL,\n  operation_id TEXT NOT NULL,\n  session_id TEXT NOT NULL,\n  request_fingerprint TEXT NOT NULL,\n  result_json TEXT NOT NULL,\n  expires_at INTEGER NOT NULL,\n  PRIMARY KEY (session_key, operation_id)\n) STRICT;\nCREATE INDEX IF NOT EXISTS idx_agent_session_goal_operations_expiry\n  ON session_goal_operations(expires_at);\n\nCREATE TABLE IF NOT EXISTS transcript_events (\n  session_id TEXT NOT NULL,\n  seq INTEGER NOT NULL,\n  event_json TEXT,\n  created_at INTEGER NOT NULL,\n  event_zstd BLOB,\n  event_utf8_bytes INTEGER CHECK (event_utf8_bytes IS NULL OR event_utf8_bytes >= 0),\n  navigation_json TEXT,\n  navigation_type TEXT,\n  navigation_custom_type TEXT,\n  navigation_display INTEGER NOT NULL DEFAULT 0,\n  message_role TEXT,\n  navigation_last_type TEXT,\n  navigation_last_custom_type TEXT,\n  navigation_valid INTEGER NOT NULL DEFAULT 1,\n  PRIMARY KEY (session_id, seq),\n  FOREIGN KEY (session_id) REFERENCES \"session_windows\"(session_id) ON DELETE CASCADE,\n  CHECK (\n    (event_json IS NOT NULL AND event_zstd IS NULL)\n    OR (\n      event_json IS NULL AND event_zstd IS NOT NULL\n      AND event_utf8_bytes IS NOT NULL\n      AND event_utf8_bytes BETWEEN 1 AND 4194304\n      AND length(event_zstd) BETWEEN 1 AND 4194304\n      AND navigation_json IS NOT NULL\n    )\n  ),\n  CHECK (\n    navigation_json IS NULL OR CASE WHEN json_valid(navigation_json) THEN coalesce(\n      octet_length(navigation_json) <= 16384\n      AND json_type(navigation_json, '$.version') = 'integer'\n      AND json_extract(navigation_json, '$.version') = 1\n      AND json_type(navigation_json, '$.report') = 'object'\n      AND json_extract(navigation_json, '$.report.kind') IN ('canonical', 'leaf', 'link', 'ignored')\n      AND json_type(navigation_json, '$.navigation') = 'object'\n      AND json_type(navigation_json, '$.reset') = 'object'\n      AND json_type(navigation_json, '$.model') = 'object'\n      AND json_type(navigation_json, '$.modelBytes') = 'integer'\n      AND json_extract(navigation_json, '$.modelBytes') BETWEEN 0 AND 4194304\n      AND json_type(navigation_json, '$.modelWithoutCheckpointBytes') = 'integer'\n      AND json_extract(navigation_json, '$.modelWithoutCheckpointBytes') BETWEEN 0 AND 4194304\n      AND json_type(navigation_json, '$.withoutCustomDataBytes') = 'integer'\n      AND json_extract(navigation_json, '$.withoutCustomDataBytes') BETWEEN 0 AND 4194304,\n      0) ELSE 0 END\n  )\n) STRICT;\n\n-- Canonical cold-tier owner for reclaimed transcript generations. The derived\n-- .deleted/.reset file may be recreated from this row after a crash.\nCREATE TABLE IF NOT EXISTS session_transcript_archives (\n  session_id TEXT NOT NULL,\n  generation TEXT NOT NULL,\n  session_key TEXT NOT NULL,\n  reason TEXT NOT NULL CHECK (reason IN ('deleted', 'reset')),\n  encoding TEXT NOT NULL CHECK (encoding IN ('identity', 'zstd')),\n  archive_blob BLOB NOT NULL,\n  archive_sha256 TEXT NOT NULL CHECK (length(archive_sha256) = 64),\n  archive_name TEXT NOT NULL UNIQUE,\n  created_at INTEGER NOT NULL,\n  published_at INTEGER,\n  publish_attempts INTEGER NOT NULL DEFAULT 0 CHECK (publish_attempts >= 0),\n  last_publish_attempt_at INTEGER,\n  last_publish_error TEXT,\n  PRIMARY KEY (session_id, generation),\n  CHECK (archive_name NOT LIKE '%/%' AND archive_name NOT LIKE '%\\%')\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_transcript_archives_pending\n  ON session_transcript_archives(created_at, session_id, generation)\n  WHERE published_at IS NULL;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_transcript_archives_retention\n  ON session_transcript_archives(created_at, session_id, generation);\n\nCREATE TABLE IF NOT EXISTS session_transcript_cold_archives (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  generation TEXT NOT NULL,\n  archive_name TEXT NOT NULL UNIQUE,\n  archive_sha256 TEXT NOT NULL CHECK (length(archive_sha256) = 64),\n  event_count INTEGER NOT NULL CHECK (event_count >= 1),\n  raw_bytes INTEGER NOT NULL CHECK (raw_bytes >= 0),\n  archive_bytes INTEGER NOT NULL CHECK (archive_bytes >= 0),\n  last_seq INTEGER NOT NULL,\n  archived_at INTEGER NOT NULL,\n  storage TEXT NOT NULL CHECK (storage IN ('file', 'sqlite')),\n  archive_blob BLOB,\n  FOREIGN KEY (session_id) REFERENCES \"session_windows\"(session_id) ON DELETE CASCADE,\n  CHECK (length(archive_name) > 0 AND archive_name NOT IN ('.', '..') AND archive_name NOT LIKE '%/%' AND archive_name NOT LIKE '%\\%'),\n  CHECK ((storage = 'file' AND archive_blob IS NULL) OR (storage = 'sqlite' AND archive_blob IS NOT NULL))\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS transcript_rewrite_watermarks (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  generation TEXT NOT NULL,\n  updated_at INTEGER NOT NULL,\n  FOREIGN KEY (session_id) REFERENCES \"session_windows\"(session_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS trajectory_runtime_events (\n  session_id TEXT NOT NULL,\n  seq INTEGER NOT NULL,\n  run_id TEXT,\n  event_json TEXT NOT NULL,\n  created_at INTEGER NOT NULL,\n  PRIMARY KEY (session_id, seq),\n  FOREIGN KEY (session_id) REFERENCES \"session_windows\"(session_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_trajectory_runtime_run\n  ON trajectory_runtime_events(session_id, run_id, created_at, octet_length(event_json));\n\nCREATE TABLE IF NOT EXISTS acp_parent_stream_events (\n  session_id TEXT NOT NULL,\n  run_id TEXT NOT NULL,\n  seq INTEGER NOT NULL,\n  event_json TEXT NOT NULL,\n  created_at INTEGER NOT NULL,\n  PRIMARY KEY (session_id, run_id, seq),\n  FOREIGN KEY (session_id) REFERENCES \"session_windows\"(session_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_acp_parent_stream_run\n  ON acp_parent_stream_events(run_id, seq);\n\nCREATE TABLE IF NOT EXISTS transcript_event_identities (\n  session_id TEXT NOT NULL,\n  event_id TEXT NOT NULL,\n  seq INTEGER NOT NULL,\n  event_type TEXT,\n  parent_id TEXT,\n  message_idempotency_key TEXT,\n  created_at INTEGER NOT NULL,\n  PRIMARY KEY (session_id, event_id),\n  FOREIGN KEY (session_id, seq) REFERENCES transcript_events(session_id, seq) ON DELETE CASCADE\n) STRICT;\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_agent_transcript_message_idempotency\n  ON transcript_event_identities(session_id, message_idempotency_key)\n  WHERE message_idempotency_key IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_agent_transcript_event_identity_sequence\n  ON transcript_event_identities(session_id, seq);\n\nCREATE INDEX IF NOT EXISTS idx_agent_transcript_event_parent\n  ON transcript_event_identities(session_id, parent_id)\n  WHERE parent_id IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_agent_transcript_event_sequence\n  ON transcript_event_identities(session_id, event_type, seq DESC);\n\nCREATE TABLE IF NOT EXISTS context_engine_turn_outbox (\n  enqueue_sequence INTEGER PRIMARY KEY,\n  advancement_key TEXT NOT NULL UNIQUE,\n  engine_id TEXT NOT NULL,\n  owner_plugin_id TEXT,\n  session_id TEXT NOT NULL,\n  payload_json TEXT NOT NULL,\n  payload_state TEXT,\n  attempt_count INTEGER NOT NULL DEFAULT 0,\n  last_attempt_at INTEGER,\n  last_error TEXT,\n  created_at INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_context_engine_turn_outbox_engine\n  ON context_engine_turn_outbox(engine_id, created_at);\n\nCREATE TABLE IF NOT EXISTS cache_entries (\n  scope TEXT NOT NULL,\n  key TEXT NOT NULL,\n  value_json TEXT,\n  blob BLOB,\n  expires_at INTEGER,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (scope, key)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_cache_expiry\n  ON cache_entries(scope, expires_at, key)\n  WHERE expires_at IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_agent_cache_updated\n  ON cache_entries(scope, updated_at DESC, key);\n\nCREATE INDEX IF NOT EXISTS idx_agent_voice_session_open_scope\n  ON cache_entries(CASE WHEN json_valid(value_json) THEN json_extract(value_json, '$.agentId') END,\n    CASE WHEN json_valid(value_json) THEN json_extract(value_json, '$.sessionKey') END, CASE WHEN json_valid(value_json) THEN json_extract(value_json, '$.origin') END)\n  WHERE scope = 'talk-client-voice-sessions'\n    AND CASE WHEN json_valid(value_json) THEN json_extract(value_json, '$.status') END = 'open';\n\nCREATE INDEX IF NOT EXISTS idx_agent_voice_session_open_updated\n  ON cache_entries(scope, updated_at)\n  WHERE scope = 'talk-client-voice-sessions'\n    AND CASE WHEN json_valid(value_json) THEN json_extract(value_json, '$.status') END = 'open';\n\nCREATE TABLE IF NOT EXISTS auth_profile_store (\n  store_key TEXT NOT NULL PRIMARY KEY,\n  store_json TEXT NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS auth_profile_state (\n  state_key TEXT NOT NULL PRIMARY KEY,\n  state_json TEXT NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS memory_index_meta (\n  key TEXT PRIMARY KEY,\n  value TEXT NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS memory_index_sources (\n  id INTEGER PRIMARY KEY,\n  path TEXT NOT NULL,\n  source TEXT NOT NULL DEFAULT 'memory',\n  hash TEXT NOT NULL,\n  mtime REAL NOT NULL,\n  size INTEGER NOT NULL,\n  UNIQUE (path, source)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS memory_index_chunks (\n  chunk_rowid INTEGER PRIMARY KEY,\n  id TEXT NOT NULL UNIQUE,\n  path TEXT NOT NULL,\n  source TEXT NOT NULL DEFAULT 'memory',\n  start_line INTEGER NOT NULL,\n  end_line INTEGER NOT NULL,\n  hash TEXT NOT NULL,\n  model TEXT NOT NULL,\n  text TEXT NOT NULL,\n  embedding BLOB NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS memory_index_chunk_recall_metadata (\n  chunk_id TEXT PRIMARY KEY,\n  importance INTEGER CHECK (importance IS NULL OR importance BETWEEN 1 AND 10),\n  triggers TEXT,\n  project_key TEXT,\n  FOREIGN KEY (chunk_id) REFERENCES memory_index_chunks(id) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS memory_index_chunk_provenance (\n  chunk_id TEXT PRIMARY KEY,\n  origin_class TEXT NOT NULL CHECK (origin_class IN ('owner', 'agent', 'untrusted', 'system')),\n  session_kind TEXT NOT NULL CHECK (session_kind IN ('interactive', 'cron', 'heartbeat', 'subagent', 'unknown')),\n  observed_at INTEGER NOT NULL,\n  supersedes_key TEXT,\n  FOREIGN KEY (chunk_id) REFERENCES memory_index_chunks(id) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS memory_entry_origins (\n  entry_key TEXT NOT NULL,\n  agent_id TEXT NOT NULL,\n  session_id TEXT NOT NULL,\n  session_key TEXT,\n  origin_class TEXT NOT NULL CHECK (origin_class IN ('owner', 'agent', 'untrusted', 'system')),\n  observed_at INTEGER NOT NULL,\n  PRIMARY KEY (entry_key, agent_id, session_id)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS memory_session_tombstones (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  agent_id TEXT NOT NULL,\n  reason TEXT NOT NULL,\n  created_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS memory_embedding_cache (\n  provider TEXT NOT NULL,\n  model TEXT NOT NULL,\n  provider_key TEXT NOT NULL,\n  hash TEXT NOT NULL,\n  embedding BLOB NOT NULL,\n  dims INTEGER,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (provider, model, provider_key, hash)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS memory_index_state (\n  id INTEGER PRIMARY KEY CHECK (id = 1),\n  revision INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS standing_intents (\n  intent_key INTEGER PRIMARY KEY,\n  id TEXT NOT NULL UNIQUE,\n  description TEXT NOT NULL,\n  trigger_keywords TEXT NOT NULL,\n  trigger_embedding TEXT,\n  channel_scope TEXT,\n  sender_scope TEXT,\n  creator_sender TEXT CHECK (creator_sender IS NULL OR length(trim(creator_sender)) > 0),\n  status TEXT NOT NULL CHECK (status IN ('pending', 'armed', 'fired', 'done', 'cancelled', 'expired')),\n  expires_at INTEGER NOT NULL,\n  max_fires INTEGER NOT NULL CHECK (max_fires > 0),\n  fire_count INTEGER NOT NULL DEFAULT 0 CHECK (fire_count >= 0),\n  cooldown_seconds INTEGER NOT NULL DEFAULT 86400 CHECK (cooldown_seconds >= 0),\n  last_fired_at INTEGER,\n  created_at INTEGER NOT NULL,\n  source_session_id TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_standing_intents_lifecycle\n  ON standing_intents(status, expires_at, last_fired_at);\n\nCREATE INDEX IF NOT EXISTS idx_standing_intents_scope\n  ON standing_intents(status, channel_scope, sender_scope);\n\nCREATE VIRTUAL TABLE IF NOT EXISTS standing_intents_fts USING fts5(\n  trigger_keywords,\n  content = 'standing_intents',\n  content_rowid = 'intent_key',\n  tokenize = 'unicode61 remove_diacritics 2'\n);\n\nCREATE TRIGGER IF NOT EXISTS standing_intents_fts_after_insert\nAFTER INSERT ON standing_intents\nBEGIN\n  INSERT INTO standing_intents_fts(rowid, trigger_keywords)\n  VALUES (new.intent_key, new.trigger_keywords);\nEND;\n\nCREATE TRIGGER IF NOT EXISTS standing_intents_fts_after_delete\nAFTER DELETE ON standing_intents\nBEGIN\n  INSERT INTO standing_intents_fts(standing_intents_fts, rowid, trigger_keywords)\n  VALUES ('delete', old.intent_key, old.trigger_keywords);\nEND;\n\nCREATE TRIGGER IF NOT EXISTS standing_intents_fts_after_update\nAFTER UPDATE OF trigger_keywords ON standing_intents\nBEGIN\n  INSERT INTO standing_intents_fts(standing_intents_fts, rowid, trigger_keywords)\n  VALUES ('delete', old.intent_key, old.trigger_keywords);\n  INSERT INTO standing_intents_fts(rowid, trigger_keywords)\n  VALUES (new.intent_key, new.trigger_keywords);\nEND;\n\nCREATE TABLE IF NOT EXISTS session_transcript_index_state (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  indexed_seq INTEGER NOT NULL,\n  leaf_event_id TEXT,\n  needs_rebuild INTEGER NOT NULL DEFAULT 0,\n  active_event_count INTEGER NOT NULL DEFAULT 0,\n  active_message_count INTEGER NOT NULL DEFAULT 0,\n  updated_at INTEGER NOT NULL,\n  FOREIGN KEY (session_id) REFERENCES session_windows(session_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS session_transcript_active_events (\n  session_id TEXT NOT NULL,\n  active_position INTEGER NOT NULL CHECK (active_position >= 0),\n  event_seq INTEGER NOT NULL,\n  message_position INTEGER CHECK (message_position IS NULL OR message_position >= 0),\n  context_eligible INTEGER,\n  PRIMARY KEY (session_id, active_position),\n  FOREIGN KEY (session_id, event_seq) REFERENCES transcript_events(session_id, seq) ON DELETE CASCADE\n) STRICT;\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_agent_transcript_active_event_seq\n  ON session_transcript_active_events(session_id, event_seq);\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_agent_transcript_active_messages\n  ON session_transcript_active_events(session_id, message_position)\n  WHERE message_position IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_agent_transcript_context_pending\n  ON session_transcript_active_events(session_id)\n  WHERE context_eligible IS NULL;\n\nCREATE VIRTUAL TABLE IF NOT EXISTS session_transcript_fts USING fts5(\n  text,\n  session_id UNINDEXED,\n  message_id UNINDEXED,\n  role UNINDEXED,\n  timestamp UNINDEXED,\n  tokenize = 'unicode61 remove_diacritics 2'\n);\n\nCREATE TABLE IF NOT EXISTS session_transcript_fts_rows (\n  id INTEGER PRIMARY KEY,\n  session_id TEXT NOT NULL,\n  message_id TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_session_transcript_fts_rows_session_message\n  ON session_transcript_fts_rows(session_id, message_id);\n\nCREATE TRIGGER IF NOT EXISTS session_transcript_fts_rows_after_delete\nAFTER DELETE ON session_transcript_fts_rows\nBEGIN\n  DELETE FROM session_transcript_fts WHERE rowid = OLD.id;\nEND;\n\nINSERT OR IGNORE INTO memory_index_state (id, revision) VALUES (1, 0);\n\nCREATE TRIGGER IF NOT EXISTS memory_index_sources_revision_after_insert\nAFTER INSERT ON memory_index_sources\nBEGIN\n  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;\nEND;\n\nCREATE TRIGGER IF NOT EXISTS memory_index_sources_revision_after_update\nAFTER UPDATE ON memory_index_sources\nBEGIN\n  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;\nEND;\n\nCREATE TRIGGER IF NOT EXISTS memory_index_sources_revision_after_delete\nAFTER DELETE ON memory_index_sources\nBEGIN\n  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;\nEND;\n\nCREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_insert\nAFTER INSERT ON memory_index_chunks\nBEGIN\n  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;\nEND;\n\nCREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_update\nAFTER UPDATE ON memory_index_chunks\nBEGIN\n  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;\nEND;\n\nCREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_delete\nAFTER DELETE ON memory_index_chunks\nBEGIN\n  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;\nEND;\n\nCREATE INDEX IF NOT EXISTS idx_memory_embedding_cache_updated_at\n  ON memory_embedding_cache(updated_at);\n\nCREATE INDEX IF NOT EXISTS idx_memory_index_sources_source\n  ON memory_index_sources(source);\n\nCREATE INDEX IF NOT EXISTS idx_memory_index_chunks_path_source\n  ON memory_index_chunks(path, source);\n\nCREATE INDEX IF NOT EXISTS idx_memory_index_chunks_source\n  ON memory_index_chunks(source);\n\n-- Accepted input stays outside the active transcript until its exact turn owns execution.\nCREATE TABLE IF NOT EXISTS session_pending_inputs (\n  seq INTEGER PRIMARY KEY AUTOINCREMENT,\n  input_id TEXT NOT NULL UNIQUE,\n  session_key TEXT NOT NULL,\n  session_id TEXT NOT NULL,\n  idempotency_key TEXT NOT NULL,\n  run_id TEXT NOT NULL,\n  request_hash TEXT NOT NULL,\n  message_json TEXT NOT NULL,\n  lifecycle_generation TEXT NOT NULL,\n  state TEXT NOT NULL CHECK (state IN ('queued', 'interrupted', 'cancelled')),\n  accepted_at INTEGER NOT NULL,\n  consumed_event_id TEXT,\n  UNIQUE (session_id, idempotency_key),\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE,\n  FOREIGN KEY (session_id) REFERENCES session_windows(session_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_agent_session_pending_inputs_session\n  ON session_pending_inputs(session_key, session_id, seq DESC);\n\n-- Processing completion is separate from input consumption; neither schedules replay.\nCREATE TABLE IF NOT EXISTS session_input_completions (\n  session_key TEXT NOT NULL,\n  session_id TEXT NOT NULL,\n  idempotency_key TEXT NOT NULL,\n  run_id TEXT NOT NULL,\n  request_hash TEXT NOT NULL,\n  outcome_json TEXT NOT NULL,\n  succeeded INTEGER NOT NULL CHECK (succeeded IN (0, 1)),\n  completed_at INTEGER NOT NULL,\n  PRIMARY KEY (session_id, idempotency_key),\n  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE,\n  FOREIGN KEY (session_id) REFERENCES session_windows(session_id) ON DELETE CASCADE\n) STRICT;\n";
//#endregion
//#region src/state/openclaw-state-schema.ts
const OPENCLAW_STATE_SCHEMA_SQL = "\n\nCREATE TABLE IF NOT EXISTS mcp_oauth_stores (\n  store_key TEXT NOT NULL PRIMARY KEY,\n  format_version INTEGER NOT NULL CHECK (format_version = 1),\n  store_json TEXT NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS mcp_oauth_pending_authorizations (\n  state TEXT NOT NULL PRIMARY KEY,\n  store_key TEXT NOT NULL,\n  create_time INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS diagnostic_events (\n  scope TEXT NOT NULL,\n  event_key TEXT NOT NULL,\n  payload_json TEXT NOT NULL,\n  created_at INTEGER NOT NULL,\n  sequence INTEGER NOT NULL DEFAULT 0,\n  PRIMARY KEY (scope, event_key)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_diagnostic_events_scope_sequence\n  ON diagnostic_events(scope, sequence, event_key);\n\nCREATE TABLE IF NOT EXISTS skill_usage (\n  skill_file TEXT NOT NULL PRIMARY KEY,\n  skill_key TEXT NOT NULL,\n  skill_name TEXT NOT NULL,\n  skill_source TEXT NOT NULL,\n  first_used_at_ms INTEGER NOT NULL,\n  last_used_at_ms INTEGER NOT NULL,\n  use_count INTEGER NOT NULL,\n  last_agent_id TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_skill_usage_key\n  ON skill_usage(skill_key, skill_file);\n\n-- Profile-owned skill library: additive, absent until first publication/import.\nCREATE TABLE IF NOT EXISTS skill_library_entries (\n  skill_id TEXT NOT NULL PRIMARY KEY,\n  owner_profile_id TEXT,\n  author_profile_id TEXT NOT NULL,\n  slug TEXT NOT NULL,\n  current_revision TEXT NOT NULL,\n  shared INT NOT NULL,\n  enabled INT NOT NULL,\n  removed INT NOT NULL,\n  created_at INT NOT NULL,\n  updated_at INT NOT NULL\n) STRICT;\nCREATE TABLE IF NOT EXISTS skill_library_revisions (\n  skill_id TEXT NOT NULL,\n  revision TEXT NOT NULL,\n  description TEXT NOT NULL,\n  files_json TEXT NOT NULL,\n  created_at INT NOT NULL,\n  PRIMARY KEY (skill_id, revision)\n) STRICT;\nCREATE TABLE IF NOT EXISTS skill_library_events (\n  event_id TEXT NOT NULL PRIMARY KEY,\n  skill_id TEXT NOT NULL,\n  revision TEXT NOT NULL,\n  action TEXT NOT NULL,\n  actor_profile_id TEXT NOT NULL,\n  created_at INT NOT NULL\n) STRICT;\nCREATE TABLE IF NOT EXISTS skill_library_uploads (\n  upload_id TEXT NOT NULL PRIMARY KEY,\n  owner_profile_id TEXT NOT NULL,\n  slug TEXT NOT NULL,\n  size_bytes INT NOT NULL,\n  sha256 TEXT NOT NULL,\n  archive_blob BLOB NOT NULL,\n  expires_at INT NOT NULL,\n  published_skill_id TEXT\n) STRICT;\n-- End profile-owned skill library.\n\nCREATE TABLE IF NOT EXISTS skill_workshop_changes (\n  cursor_id INTEGER NOT NULL,\n  change_id TEXT NOT NULL PRIMARY KEY,\n  agent_id TEXT NOT NULL,\n  skill_name TEXT NOT NULL,\n  action TEXT NOT NULL CHECK (action IN ('create', 'patch', 'write_file', 'remove_file', 'archive', 'restore')),\n  actor TEXT NOT NULL CHECK (actor IN ('agent', 'review', 'curator', 'user')),\n  summary TEXT NOT NULL,\n  version_id TEXT,\n  session_key TEXT,\n  run_id TEXT,\n  created_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE UNIQUE INDEX IF NOT EXISTS skill_workshop_changes_cursor_id_idx\n  ON skill_workshop_changes(cursor_id);\n\nCREATE INDEX IF NOT EXISTS idx_skill_workshop_changes_agent_time\n  ON skill_workshop_changes(agent_id, created_at_ms);\n\nCREATE TABLE IF NOT EXISTS audit_events (\n  sequence INTEGER PRIMARY KEY AUTOINCREMENT,\n  event_id TEXT NOT NULL UNIQUE,\n  source_id TEXT NOT NULL UNIQUE,\n  schema_version INTEGER NOT NULL DEFAULT 1,\n  source_sequence INTEGER NOT NULL,\n  occurred_at INTEGER NOT NULL,\n  kind TEXT NOT NULL,\n  action TEXT NOT NULL,\n  status TEXT NOT NULL,\n  error_code TEXT,\n  actor_type TEXT NOT NULL,\n  actor_id TEXT NOT NULL,\n  agent_id TEXT,\n  session_key TEXT,\n  session_id TEXT,\n  run_id TEXT,\n  tool_call_id TEXT,\n  tool_name TEXT,\n  direction TEXT,\n  channel TEXT,\n  conversation_kind TEXT,\n  message_outcome TEXT,\n  reason_code TEXT,\n  delivery_kind TEXT,\n  failure_stage TEXT,\n  duration_ms INTEGER,\n  result_count INTEGER,\n  account_ref TEXT,\n  conversation_ref TEXT,\n  message_ref TEXT,\n  target_ref TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_time\n  ON audit_events(occurred_at DESC, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_agent_sequence\n  ON audit_events(agent_id, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_session_sequence\n  ON audit_events(session_key, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_run_sequence\n  ON audit_events(run_id, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_kind_sequence\n  ON audit_events(kind, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_status_sequence\n  ON audit_events(status, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_channel_sequence\n  ON audit_events(channel, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_direction_sequence\n  ON audit_events(direction, sequence DESC);\n\nCREATE TABLE IF NOT EXISTS outbound_message_execution_bindings (\n  event_id TEXT NOT NULL PRIMARY KEY,\n  context_id TEXT NOT NULL CHECK (length(context_id) BETWEEN 1 AND 256),\n  execution_id TEXT NOT NULL CHECK (length(execution_id) BETWEEN 1 AND 256),\n  run_id TEXT NOT NULL CHECK (length(run_id) BETWEEN 1 AND 256),\n  FOREIGN KEY (event_id) REFERENCES audit_events(event_id) ON DELETE CASCADE\n) STRICT;\nCREATE INDEX IF NOT EXISTS outbound_message_execution_bindings_execution_event_idx\n  ON outbound_message_execution_bindings (context_id, execution_id, run_id, event_id);\n\nCREATE TABLE IF NOT EXISTS outbound_message_progress (\n  sequence INTEGER PRIMARY KEY AUTOINCREMENT,\n  progress_id TEXT NOT NULL UNIQUE CHECK (length(progress_id) BETWEEN 1 AND 256),\n  source_id TEXT NOT NULL UNIQUE CHECK (length(source_id) BETWEEN 1 AND 512),\n  source_sequence INTEGER NOT NULL CHECK (source_sequence >= 1),\n  schema_version INTEGER NOT NULL CHECK (schema_version = 1),\n  occurred_at INTEGER NOT NULL CHECK (occurred_at >= 0),\n  action TEXT NOT NULL CHECK (\n    action IN ('message.outbound.queued', 'message.outbound.platform-started')\n  ),\n  outcome TEXT NOT NULL CHECK (outcome IN ('queued', 'platform_started')),\n  actor_type TEXT NOT NULL CHECK (actor_type IN ('agent', 'system')),\n  actor_id TEXT NOT NULL CHECK (length(actor_id) BETWEEN 1 AND 256),\n  agent_id TEXT CHECK (agent_id IS NULL OR length(agent_id) BETWEEN 1 AND 256),\n  run_id TEXT CHECK (run_id IS NULL OR length(run_id) BETWEEN 1 AND 256),\n  context_id TEXT,\n  execution_id TEXT,\n  channel TEXT NOT NULL CHECK (length(channel) BETWEEN 1 AND 256),\n  conversation_kind TEXT NOT NULL CHECK (\n    conversation_kind IN ('direct', 'group', 'channel', 'unknown')\n  ),\n  duration_ms INTEGER CHECK (duration_ms IS NULL OR duration_ms >= 0),\n  account_ref TEXT,\n  conversation_ref TEXT,\n  target_ref TEXT,\n  UNIQUE (occurred_at, progress_id)\n) STRICT;\nCREATE INDEX IF NOT EXISTS outbound_message_progress_occurred_idx\n  ON outbound_message_progress (occurred_at, sequence);\nCREATE INDEX IF NOT EXISTS outbound_message_progress_run_occurred_idx\n  ON outbound_message_progress (run_id, occurred_at, sequence);\n\nCREATE TABLE IF NOT EXISTS audit_identity_keys (\n  id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),\n  key_id TEXT NOT NULL,\n  key BLOB NOT NULL,\n  created_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS config_revision_keys (\n  id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),\n  hmac_key BLOB NOT NULL CHECK (length(hmac_key) = 32)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS execution_identity_contexts (\n  context_id TEXT NOT NULL PRIMARY KEY CHECK (length(context_id) BETWEEN 1 AND 256),\n  execution_id TEXT NOT NULL UNIQUE CHECK (length(execution_id) BETWEEN 1 AND 256),\n  run_id TEXT NOT NULL CHECK (length(run_id) BETWEEN 1 AND 256),\n  created_at INTEGER NOT NULL CHECK (created_at >= 0),\n  coverage_state TEXT NOT NULL CHECK (\n    coverage_state IN ('attribution-only', 'unattributed', 'unknown', 'unsupported')\n  ),\n  context_bytes INTEGER NOT NULL CHECK (context_bytes BETWEEN 1 AND 16384),\n  context_json TEXT NOT NULL CHECK (length(context_json) > 0),\n  UNIQUE (created_at, context_id)\n) STRICT;\nCREATE INDEX IF NOT EXISTS execution_identity_contexts_run_created_idx\n  ON execution_identity_contexts (run_id, created_at, execution_id);\n\nCREATE TABLE IF NOT EXISTS execution_decision_facts (\n  cursor_id INTEGER NOT NULL,\n  receipt_id TEXT NOT NULL PRIMARY KEY CHECK (length(receipt_id) BETWEEN 1 AND 256),\n  context_id TEXT NOT NULL CHECK (length(context_id) BETWEEN 1 AND 256),\n  execution_id TEXT NOT NULL CHECK (length(execution_id) BETWEEN 1 AND 256),\n  run_id TEXT NOT NULL CHECK (length(run_id) BETWEEN 1 AND 256),\n  action_id TEXT CHECK (action_id IS NULL OR length(action_id) BETWEEN 1 AND 256),\n  action_family TEXT NOT NULL CHECK (length(action_family) BETWEEN 1 AND 256),\n  decision_outcome TEXT NOT NULL CHECK (\n    decision_outcome IN ('allowed', 'denied', 'not-applicable', 'unknown')\n  ),\n  coverage_state TEXT NOT NULL CHECK (\n    coverage_state IN ('enforced', 'attribution-only', 'unattributed', 'unknown', 'unsupported')\n  ),\n  reason_code TEXT NOT NULL CHECK (length(reason_code) BETWEEN 1 AND 256),\n  owner TEXT NOT NULL CHECK (length(owner) BETWEEN 1 AND 256),\n  source_ref TEXT NOT NULL CHECK (length(source_ref) BETWEEN 1 AND 256),\n  occurred_at INTEGER NOT NULL CHECK (occurred_at >= 0),\n  receipt_bytes INTEGER NOT NULL CHECK (receipt_bytes BETWEEN 1 AND 16384),\n  receipt_json TEXT NOT NULL CHECK (length(receipt_json) > 0),\n  UNIQUE (occurred_at, receipt_id)\n) STRICT;\nCREATE UNIQUE INDEX IF NOT EXISTS execution_decision_facts_cursor_id_idx\n  ON execution_decision_facts(cursor_id);\n\nCREATE INDEX IF NOT EXISTS execution_decision_facts_context_occurred_idx\n  ON execution_decision_facts (context_id, occurred_at, receipt_id);\nCREATE INDEX IF NOT EXISTS execution_decision_facts_run_occurred_idx\n  ON execution_decision_facts (run_id, occurred_at, receipt_id);\n\n-- Exact admission identity stays separate from owner-native lifecycle rows so\n-- older readers retain byte-compatible cron/task/flow table definitions.\nCREATE TABLE IF NOT EXISTS execution_owner_lifecycle_bindings (\n  owner_kind TEXT NOT NULL,\n  owner_id TEXT NOT NULL,\n  context_id TEXT NOT NULL,\n  execution_id TEXT NOT NULL,\n  PRIMARY KEY (owner_kind, owner_id)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS session_state_events (\n  sequence INTEGER PRIMARY KEY AUTOINCREMENT,\n  dedupe_key TEXT UNIQUE,\n  session_key TEXT NOT NULL,\n  session_id TEXT,\n  agent_id TEXT NOT NULL,\n  kind TEXT NOT NULL,\n  actor_type TEXT NOT NULL,\n  actor_id TEXT,\n  run_id TEXT,\n  occurred_at INTEGER NOT NULL,\n  summary TEXT NOT NULL,\n  payload_json TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_session_state_events_session_sequence\n  ON session_state_events(session_key, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_session_state_events_time\n  ON session_state_events(occurred_at DESC, sequence DESC);\n\nCREATE TABLE IF NOT EXISTS session_state_heads (\n  session_key TEXT NOT NULL,\n  agent_id TEXT NOT NULL,\n  last_sequence INTEGER NOT NULL,\n  pruned_max_sequence INTEGER NOT NULL DEFAULT 0,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (session_key, agent_id)\n) STRICT;\n\n-- Notifiable watcher identity is the bare session key, matching the process-local\n-- system-event queue it feeds. Provenance distinguishes explicit immediate-wake\n-- watches from ambient queue-only group watches. Other bare keys\n-- (session.scope=\"global\") are ambiguous across agents and excluded until watcher\n-- identity is agent-scoped end-to-end.\nCREATE TABLE IF NOT EXISTS session_watch_cursors (\n  watcher_session_key TEXT NOT NULL,\n  watcher_store_path TEXT,\n  target_session_key TEXT NOT NULL,\n  last_seen_sequence INTEGER NOT NULL DEFAULT 0,\n  notified_sequence INTEGER NOT NULL DEFAULT 0,\n  material_sequence INTEGER NOT NULL DEFAULT 0,\n  provenance TEXT NOT NULL DEFAULT 'explicit' CHECK (provenance IN ('explicit', 'ambient-group')),\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (watcher_session_key, target_session_key)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_session_watch_cursors_target\n  ON session_watch_cursors(target_session_key);\n\nCREATE TABLE IF NOT EXISTS session_upstream_links (\n  session_key TEXT NOT NULL,\n  agent_id TEXT NOT NULL,\n  catalog_id TEXT NOT NULL,\n  host_id TEXT NOT NULL,\n  thread_id TEXT NOT NULL,\n  upstream_kind TEXT NOT NULL,\n  upstream_ref_json TEXT,\n  last_marker_json TEXT,\n  last_scanned_at INTEGER,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  -- (session_key, agent_id) composite identity: under session.scope=\"global\" agents\n  -- share bare keys; a key-only row would let one agent overwrite another's upstream.\n  PRIMARY KEY (session_key, agent_id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_session_upstream_links_catalog_id\n  ON session_upstream_links(catalog_id);\n\nCREATE TABLE IF NOT EXISTS state_leases (\n  scope TEXT NOT NULL,\n  lease_key TEXT NOT NULL,\n  owner TEXT NOT NULL,\n  expires_at INTEGER,\n  heartbeat_at INTEGER,\n  payload_json TEXT,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (scope, lease_key)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_state_leases_expiry\n  ON state_leases(expires_at, scope, lease_key)\n  WHERE expires_at IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_state_leases_owner\n  ON state_leases(owner, updated_at DESC);\n\nCREATE TABLE IF NOT EXISTS exec_approvals_config (\n  config_key TEXT NOT NULL PRIMARY KEY,\n  raw_json TEXT NOT NULL,\n  socket_path TEXT,\n  has_socket_token INTEGER NOT NULL,\n  default_security TEXT,\n  default_ask TEXT,\n  default_ask_fallback TEXT,\n  auto_allow_skills INTEGER,\n  agent_count INTEGER NOT NULL,\n  allowlist_count INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS operator_approvals (\n  cursor_id INTEGER NOT NULL,\n  approval_id TEXT NOT NULL PRIMARY KEY CHECK (\n    length(approval_id) > 0 AND approval_id NOT IN ('.', '..')\n  ),\n  resolution_ref TEXT NOT NULL CHECK (\n    length(resolution_ref) = 43 AND resolution_ref NOT GLOB '*[^A-Za-z0-9_-]*'\n  ),\n  kind TEXT NOT NULL CHECK (kind IN ('exec', 'plugin', 'system-agent')),\n  status TEXT NOT NULL CHECK (status IN ('pending', 'allowed', 'denied', 'expired', 'cancelled')),\n  presentation_json TEXT NOT NULL,\n  requested_by_device_id TEXT,\n  requested_by_client_id TEXT,\n  requested_by_device_token_auth INTEGER NOT NULL DEFAULT 0,\n  reviewer_device_ids_json TEXT NOT NULL,\n  source_agent_id TEXT,\n  source_session_key TEXT,\n  source_session_id TEXT,\n  source_run_id TEXT,\n  source_tool_call_id TEXT,\n  source_tool_name TEXT,\n  audience_session_keys_json TEXT NOT NULL,\n  runtime_epoch TEXT NOT NULL,\n  created_at_ms INTEGER NOT NULL,\n  expires_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  decision TEXT CHECK (decision IN ('allow-once', 'allow-always', 'deny')),\n  terminal_reason TEXT CHECK (\n    terminal_reason IN (\n      'user',\n      'timeout',\n      'malformed-verdict',\n      'no-route',\n      'run-aborted',\n      'gateway-restart',\n      'storage-corrupt'\n    )\n  ),\n  resolved_at_ms INTEGER,\n  resolver_kind TEXT CHECK (resolver_kind IN ('device', 'channel', 'runtime', 'system')),\n  resolver_id TEXT,\n  consumed_at_ms INTEGER,\n  consumed_by TEXT,\n  CHECK (expires_at_ms >= created_at_ms),\n  CHECK (updated_at_ms >= created_at_ms),\n  CHECK (resolved_at_ms IS NULL OR resolved_at_ms >= created_at_ms),\n  CHECK (resolved_at_ms IS NULL OR resolved_at_ms <= updated_at_ms),\n  CHECK (consumed_at_ms IS NULL OR consumed_at_ms >= resolved_at_ms),\n  CHECK (consumed_at_ms IS NULL OR consumed_at_ms <= updated_at_ms),\n  CHECK (requested_by_device_token_auth IN (0, 1)),\n  CHECK (\n    (\n      status = 'pending'\n      AND decision IS NULL\n      AND terminal_reason IS NULL\n      AND resolved_at_ms IS NULL\n      AND resolver_kind IS NULL\n      AND resolver_id IS NULL\n      AND consumed_at_ms IS NULL\n      AND consumed_by IS NULL\n    )\n    OR (\n      status = 'allowed'\n      AND decision IN ('allow-once', 'allow-always')\n      AND terminal_reason = 'user'\n      AND resolved_at_ms IS NOT NULL\n      AND resolver_kind IS NOT NULL\n    )\n    OR (\n      status = 'denied'\n      AND decision = 'deny'\n      AND terminal_reason IN ('user', 'malformed-verdict', 'no-route', 'storage-corrupt')\n      AND resolved_at_ms IS NOT NULL\n      AND resolver_kind IS NOT NULL\n      AND consumed_at_ms IS NULL\n      AND consumed_by IS NULL\n    )\n    OR (\n      status = 'expired'\n      AND decision = 'deny'\n      AND terminal_reason = 'timeout'\n      AND resolved_at_ms IS NOT NULL\n      AND resolver_kind IS NOT NULL\n      AND consumed_at_ms IS NULL\n      AND consumed_by IS NULL\n    )\n    OR (\n      status = 'cancelled'\n      AND decision = 'deny'\n      AND terminal_reason IN ('run-aborted', 'gateway-restart')\n      AND resolved_at_ms IS NOT NULL\n      AND resolver_kind IS NOT NULL\n      AND consumed_at_ms IS NULL\n      AND consumed_by IS NULL\n    )\n  ),\n  CHECK (\n    (consumed_at_ms IS NULL AND consumed_by IS NULL)\n    OR (\n      status = 'allowed'\n      AND decision = 'allow-once'\n      AND consumed_at_ms IS NOT NULL\n      AND consumed_by IS NOT NULL\n    )\n  )\n) STRICT;\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_operator_approvals_cursor_id\n  ON operator_approvals(cursor_id);\n\nCREATE INDEX IF NOT EXISTS idx_operator_approvals_status_expiry\n  ON operator_approvals(status, expires_at_ms, approval_id);\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_operator_approvals_resolution_ref\n  ON operator_approvals(resolution_ref);\n\nCREATE INDEX IF NOT EXISTS idx_operator_approvals_source_session_created\n  ON operator_approvals(source_session_key, created_at_ms DESC, approval_id);\n\nCREATE INDEX IF NOT EXISTS idx_operator_approvals_source_run_resolved\n  ON operator_approvals(source_run_id, resolved_at_ms, approval_id)\n  WHERE source_run_id IS NOT NULL AND resolved_at_ms IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_operator_approvals_resolved\n  ON operator_approvals(resolved_at_ms, approval_id)\n  WHERE resolved_at_ms IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_operator_approvals_runtime_pending\n  ON operator_approvals(runtime_epoch, approval_id)\n  WHERE status = 'pending';\n\nCREATE TABLE IF NOT EXISTS operator_approval_execution_identities (\n  approval_id TEXT NOT NULL PRIMARY KEY\n    REFERENCES operator_approvals(approval_id) ON DELETE CASCADE,\n  source_context_id TEXT NOT NULL CHECK (\n    length(source_context_id) BETWEEN 1 AND 256 AND source_context_id = trim(source_context_id)\n  ),\n  source_execution_id TEXT NOT NULL CHECK (\n    length(source_execution_id) BETWEEN 1 AND 256 AND source_execution_id = trim(source_execution_id)\n  )\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS operator_approval_standing_grants (\n  grant_id TEXT NOT NULL PRIMARY KEY CHECK (length(grant_id) > 0),\n  minted_by_approval_id TEXT NOT NULL\n    REFERENCES operator_approvals(approval_id) ON DELETE CASCADE,\n  agent_id TEXT NOT NULL CHECK (length(agent_id) > 0),\n  cron_job_id TEXT NOT NULL CHECK (length(cron_job_id) > 0),\n  job_config_revision TEXT NOT NULL CHECK (length(job_config_revision) > 0),\n  operation_binding TEXT NOT NULL CHECK (length(operation_binding) > 0),\n  created_at_ms INTEGER NOT NULL,\n  expires_at_ms INTEGER CHECK (expires_at_ms IS NULL OR expires_at_ms >= created_at_ms),\n  revoked_at_ms INTEGER,\n  revoked_by TEXT,\n  last_used_at_ms INTEGER,\n  use_count INTEGER NOT NULL DEFAULT 0\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_operator_approval_standing_grants_binding\n  ON operator_approval_standing_grants(agent_id, cron_job_id, operation_binding, created_at_ms DESC);\n\nCREATE TABLE IF NOT EXISTS operator_approval_standing_grant_generations (\n  grant_id TEXT NOT NULL PRIMARY KEY\n    REFERENCES operator_approval_standing_grants(grant_id) ON DELETE CASCADE,\n  job_definition_generation INTEGER NOT NULL CHECK (job_definition_generation >= 1)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS schema_meta (\n  meta_key TEXT NOT NULL PRIMARY KEY,\n  role TEXT NOT NULL,\n  schema_version INTEGER NOT NULL,\n  agent_id TEXT,\n  app_version TEXT,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS config_machine_state (\n  state_key TEXT NOT NULL PRIMARY KEY,\n  value_json TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS device_pairing_pending (\n  request_id TEXT NOT NULL PRIMARY KEY,\n  device_id TEXT NOT NULL,\n  public_key TEXT NOT NULL,\n  display_name TEXT,\n  platform TEXT,\n  device_family TEXT,\n  client_id TEXT,\n  client_mode TEXT,\n  browser_origin TEXT,\n  role TEXT,\n  roles_json TEXT,\n  scopes_json TEXT,\n  remote_ip TEXT,\n  silent INTEGER,\n  is_repair INTEGER,\n  ts INTEGER NOT NULL,\n  refreshed_at_ms INTEGER\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_device_pairing_pending_device\n  ON device_pairing_pending(device_id, ts DESC);\n\nCREATE TABLE IF NOT EXISTS device_pairing_paired (\n  device_id TEXT NOT NULL PRIMARY KEY,\n  public_key TEXT NOT NULL,\n  display_name TEXT,\n  operator_label TEXT,\n  platform TEXT,\n  device_family TEXT,\n  client_id TEXT,\n  client_mode TEXT,\n  browser_origin TEXT,\n  role TEXT,\n  roles_json TEXT,\n  scopes_json TEXT,\n  approved_scopes_json TEXT,\n  remote_ip TEXT,\n  tokens_json TEXT,\n  approved_via TEXT,\n  node_surface_json TEXT,\n  pending_node_surface_json TEXT,\n  created_at_ms INTEGER NOT NULL,\n  approved_at_ms INTEGER NOT NULL,\n  last_seen_at_ms INTEGER,\n  last_seen_reason TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_device_pairing_paired_approved\n  ON device_pairing_paired(approved_at_ms DESC, device_id);\n\nCREATE TABLE IF NOT EXISTS device_bootstrap_tokens (\n  token_key TEXT NOT NULL PRIMARY KEY,\n  token TEXT NOT NULL,\n  setup_id TEXT,\n  ts INTEGER NOT NULL,\n  device_id TEXT,\n  public_key TEXT,\n  profile_json TEXT,\n  redeemed_profile_json TEXT,\n  pending_profile_json TEXT,\n  issued_at_ms INTEGER NOT NULL,\n  last_used_at_ms INTEGER\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_device_bootstrap_tokens_ts\n  ON device_bootstrap_tokens(ts);\n\n-- Terminal outcome of a redeemed setup credential. The bootstrap row is deleted\n-- on redemption, so this is the only durable proof a setup code succeeded; the\n-- presenting client reconciles it when the completion broadcast is missed.\n-- Non-secret only: never the bootstrap token or anything derived from it.\n-- Bounded by retention to a handful of live rows, so the primary key is the\n-- only access path worth having.\nCREATE TABLE IF NOT EXISTS device_pair_setup_completions (\n  setup_id TEXT NOT NULL PRIMARY KEY,\n  device_id TEXT NOT NULL,\n  device_name TEXT,\n  access TEXT NOT NULL,\n  completed_at_ms INTEGER NOT NULL,\n  delivery_state TEXT NOT NULL CHECK (delivery_state IN ('uncertain', 'confirmed')),\n  retain_until_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS device_pairing_join_codes (\n  shortcode TEXT,\n  payload_json TEXT,\n  created_at_ms INTEGER,\n  expires_at_ms INTEGER\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS device_identities (\n  identity_key TEXT NOT NULL PRIMARY KEY,\n  device_id TEXT NOT NULL,\n  public_key_pem TEXT NOT NULL,\n  private_key_pem TEXT NOT NULL,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_device_identities_device\n  ON device_identities(device_id, updated_at_ms DESC);\n\nCREATE TABLE IF NOT EXISTS device_auth_tokens (\n  device_id TEXT NOT NULL,\n  role TEXT NOT NULL,\n  token TEXT NOT NULL,\n  scopes_json TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (device_id, role)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_device_auth_tokens_updated\n  ON device_auth_tokens(updated_at_ms DESC, device_id, role);\n\nCREATE TABLE IF NOT EXISTS gateway_origin_device_tokens (\n  gateway_scope TEXT NOT NULL,\n  device_id TEXT NOT NULL,\n  role TEXT NOT NULL,\n  token TEXT NOT NULL,\n  scopes_json TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (gateway_scope, device_id, role)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS macos_port_guardian_records (\n  pid INTEGER NOT NULL PRIMARY KEY,\n  port INTEGER NOT NULL,\n  command TEXT NOT NULL,\n  mode TEXT NOT NULL,\n  timestamp REAL NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_macos_port_guardian_records_port\n  ON macos_port_guardian_records(port, timestamp DESC);\n\nCREATE TABLE IF NOT EXISTS workspace_setup_state (\n  workspace_key TEXT NOT NULL PRIMARY KEY,\n  -- NULL only for attestation-only rows whose legacy source never recorded a\n  -- path (orphan hashed-key attestations); setup rows always carry one.\n  workspace_path TEXT,\n  -- NULL setup columns mean an attestation-only row: replaceWorkspaceAttestation\n  -- may record hashes before any setup milestone exists for the workspace.\n  version INTEGER,\n  bootstrap_seeded_at TEXT,\n  setup_completed_at TEXT,\n  updated_at INTEGER,\n  attested_at_ms INTEGER,\n  attestation_updated_at_ms INTEGER,\n  CHECK (version IS NULL OR workspace_path IS NOT NULL)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_workspace_setup_state_path\n  ON workspace_setup_state(workspace_path);\n\nCREATE TABLE IF NOT EXISTS workspace_path_aliases (\n  alias_key TEXT NOT NULL PRIMARY KEY,\n  alias_path TEXT NOT NULL,\n  workspace_key TEXT NOT NULL,\n  workspace_path TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_workspace_path_aliases_workspace\n  ON workspace_path_aliases(workspace_key);\n\n\n\nCREATE TABLE IF NOT EXISTS workspace_generated_bootstrap_hashes (\n  workspace_key TEXT NOT NULL,\n  filename TEXT NOT NULL,\n  sha256 TEXT NOT NULL,\n  PRIMARY KEY (workspace_key, filename),\n  FOREIGN KEY (workspace_key) REFERENCES workspace_setup_state(workspace_key) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS native_hook_relay_bridges (\n  relay_id TEXT NOT NULL PRIMARY KEY,\n  pid INTEGER NOT NULL,\n  hostname TEXT NOT NULL,\n  port INTEGER NOT NULL,\n  token TEXT NOT NULL,\n  expires_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_native_hook_relay_bridges_expires\n  ON native_hook_relay_bridges(expires_at_ms, relay_id);\n\nCREATE TABLE IF NOT EXISTS managed_outgoing_image_records (\n  attachment_id TEXT NOT NULL PRIMARY KEY,\n  session_key TEXT NOT NULL,\n  agent_id TEXT,\n  message_id TEXT,\n  created_at TEXT NOT NULL,\n  updated_at TEXT,\n  retention_class TEXT,\n  alt TEXT NOT NULL,\n  original_media_root TEXT NOT NULL,\n  original_media_id TEXT NOT NULL,\n  original_media_subdir TEXT NOT NULL,\n  original_content_type TEXT NOT NULL,\n  original_width INTEGER,\n  original_height INTEGER,\n  original_size_bytes INTEGER,\n  original_filename TEXT,\n  record_json TEXT NOT NULL,\n  cleanup_pending INTEGER NOT NULL DEFAULT 0 CHECK (cleanup_pending IN (0, 1))\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_session\n  ON managed_outgoing_image_records(session_key, created_at DESC, attachment_id);\n\nCREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_message\n  ON managed_outgoing_image_records(session_key, message_id, attachment_id)\n  WHERE message_id IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_agent_session\n  ON managed_outgoing_image_records(session_key, agent_id, created_at DESC, attachment_id);\n\nCREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_agent_message\n  ON managed_outgoing_image_records(session_key, agent_id, message_id, attachment_id)\n  WHERE message_id IS NOT NULL;\n\nCREATE TABLE IF NOT EXISTS channel_pairing_requests (\n  channel_key TEXT NOT NULL,\n  account_id TEXT NOT NULL,\n  request_id TEXT NOT NULL,\n  code TEXT NOT NULL,\n  created_at TEXT NOT NULL,\n  last_seen_at TEXT NOT NULL,\n  meta_json TEXT,\n  PRIMARY KEY (channel_key, account_id, request_id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_channel_pairing_requests_code\n  ON channel_pairing_requests(channel_key, code);\n\nCREATE INDEX IF NOT EXISTS idx_channel_pairing_requests_created\n  ON channel_pairing_requests(channel_key, created_at, request_id);\n\nCREATE TABLE IF NOT EXISTS channel_pairing_allow_entries (\n  channel_key TEXT NOT NULL,\n  account_id TEXT NOT NULL,\n  entry TEXT NOT NULL,\n  sort_order INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (channel_key, account_id, entry)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_channel_pairing_allow_account\n  ON channel_pairing_allow_entries(channel_key, account_id, sort_order, entry);\n\nCREATE TABLE IF NOT EXISTS web_push_subscriptions (\n  endpoint_hash TEXT NOT NULL PRIMARY KEY,\n  subscription_id TEXT NOT NULL UNIQUE,\n  endpoint TEXT NOT NULL,\n  p256dh TEXT NOT NULL,\n  auth TEXT NOT NULL,\n  device_id TEXT,\n  user_profile_id TEXT,\n  preferences_json TEXT,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_web_push_subscriptions_updated\n  ON web_push_subscriptions(updated_at_ms DESC, subscription_id);\n\nCREATE TABLE IF NOT EXISTS web_push_approval_deliveries (\n  approval_id TEXT NOT NULL\n    REFERENCES operator_approvals(approval_id) ON DELETE CASCADE,\n  subscription_id TEXT NOT NULL\n    REFERENCES web_push_subscriptions(subscription_id) ON DELETE CASCADE,\n  device_id TEXT NOT NULL,\n  user_profile_id TEXT,\n  prepared_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (approval_id, subscription_id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_web_push_approval_deliveries_subscription\n  ON web_push_approval_deliveries(subscription_id, approval_id);\n\nCREATE TABLE IF NOT EXISTS apns_registrations (\n  node_id TEXT NOT NULL PRIMARY KEY,\n  transport TEXT NOT NULL,\n  token TEXT,\n  relay_handle TEXT,\n  send_grant TEXT,\n  installation_id TEXT,\n  relay_origin TEXT,\n  topic TEXT NOT NULL,\n  environment TEXT NOT NULL,\n  distribution TEXT,\n  token_debug_suffix TEXT,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_apns_registrations_updated\n  ON apns_registrations(updated_at_ms DESC, node_id);\n\nCREATE TABLE IF NOT EXISTS apns_registration_tombstones (\n  node_id TEXT NOT NULL PRIMARY KEY,\n  deleted_at_ms INTEGER NOT NULL\n) STRICT;\n\n-- Node-host-owned launch journal. The descriptor and its credential remain\n-- process memory only; this table records bounded supervision facts.\nCREATE TABLE IF NOT EXISTS node_worker_launches (\n  launch_id TEXT NOT NULL PRIMARY KEY\n    CHECK (length(launch_id) BETWEEN 1 AND 256 AND instr(launch_id, char(0)) = 0),\n  plan_hash TEXT NOT NULL\n    CHECK (length(plan_hash) = 64 AND plan_hash NOT GLOB '*[^0-9a-f]*'),\n  gateway_namespace TEXT NOT NULL\n    CHECK (\n      length(gateway_namespace) BETWEEN 1 AND 128\n      AND gateway_namespace NOT GLOB '*[^A-Za-z0-9._-]*'\n      AND gateway_namespace GLOB '[A-Za-z0-9]*'\n    ),\n  environment_id TEXT NOT NULL\n    CHECK (length(environment_id) BETWEEN 1 AND 256 AND instr(environment_id, char(0)) = 0),\n  session_id TEXT NOT NULL\n    CHECK (length(session_id) BETWEEN 1 AND 256 AND instr(session_id, char(0)) = 0),\n  owner_epoch INTEGER NOT NULL CHECK (owner_epoch BETWEEN 1 AND 9007199254740991),\n  placement_generation INTEGER NOT NULL\n    CHECK (placement_generation BETWEEN 0 AND 9007199254740991),\n  run_id TEXT NOT NULL\n    CHECK (length(run_id) BETWEEN 1 AND 256 AND instr(run_id, char(0)) = 0),\n  state TEXT NOT NULL\n    CHECK (state IN ('pending', 'running', 'completed', 'failed', 'interrupted', 'cancelled')),\n  supervisor_pid INTEGER NOT NULL CHECK (supervisor_pid BETWEEN 1 AND 2147483647),\n  supervisor_start_time INTEGER NOT NULL\n    CHECK (supervisor_start_time BETWEEN 0 AND 9007199254740991),\n  worker_pid INTEGER CHECK (worker_pid IS NULL OR worker_pid BETWEEN 1 AND 2147483647),\n  worker_start_time INTEGER CHECK (\n    worker_start_time IS NULL OR worker_start_time BETWEEN 0 AND 9007199254740991\n  ),\n  result_json TEXT CHECK (\n    result_json IS NULL\n    OR (\n      length(CAST(result_json AS BLOB)) BETWEEN 1 AND 65536\n      AND instr(result_json, char(0)) = 0\n      AND json_valid(result_json)\n    )\n  ),\n  error_text TEXT CHECK (\n    error_text IS NULL\n    OR (\n      length(CAST(error_text AS BLOB)) BETWEEN 1 AND 4096\n      AND instr(error_text, char(0)) = 0\n      AND instr(error_text, char(10)) = 0\n      AND instr(error_text, char(13)) = 0\n    )\n  ),\n  completed_at_ms INTEGER CHECK (\n    completed_at_ms IS NULL OR completed_at_ms BETWEEN 0 AND 9007199254740991\n  ),\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms BETWEEN 0 AND 9007199254740991),\n  updated_at_ms INTEGER NOT NULL CHECK (\n    updated_at_ms BETWEEN created_at_ms AND 9007199254740991\n  ),\n  CHECK ((worker_pid IS NULL) = (worker_start_time IS NULL)),\n  CHECK (\n    (state = 'pending'\n      AND worker_pid IS NULL AND result_json IS NULL AND error_text IS NULL\n      AND completed_at_ms IS NULL)\n    OR\n    (state = 'running'\n      AND worker_pid IS NOT NULL AND result_json IS NULL AND error_text IS NULL\n      AND completed_at_ms IS NULL)\n    OR\n    (state = 'completed'\n      AND result_json IS NOT NULL AND error_text IS NULL\n      AND completed_at_ms BETWEEN created_at_ms AND updated_at_ms)\n    OR\n    (state IN ('failed', 'interrupted', 'cancelled')\n      AND result_json IS NULL AND error_text IS NOT NULL\n      AND completed_at_ms BETWEEN created_at_ms AND updated_at_ms)\n  )\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_node_worker_launches_terminal_completed\n  ON node_worker_launches(completed_at_ms, launch_id)\n  WHERE completed_at_ms IS NOT NULL;\n\nCREATE TABLE IF NOT EXISTS node_worker_launch_boots (\n  launch_id TEXT NOT NULL PRIMARY KEY\n    REFERENCES node_worker_launches(launch_id) ON DELETE CASCADE,\n  boot_id TEXT CHECK (boot_id IS NULL OR length(boot_id) BETWEEN 1 AND 128)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS node_worker_launch_containers (\n  launch_id TEXT PRIMARY KEY,\n  container_json TEXT\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS node_worker_launch_cleanup (\n  launch_id TEXT NOT NULL PRIMARY KEY\n    REFERENCES node_worker_launches(launch_id) ON DELETE CASCADE,\n  cleanup_mode TEXT NOT NULL CHECK (cleanup_mode IN ('process-group', 'owned-anchor')),\n  lineage_settled INTEGER CHECK (lineage_settled IS NULL OR lineage_settled = 1)\n) STRICT;\n\n-- Older readers retain owned-anchor custody: lineage EOF is not this certificate.\nCREATE TABLE IF NOT EXISTS node_worker_launch_process_scopes (\n  launch_id TEXT NOT NULL PRIMARY KEY\n    REFERENCES node_worker_launches(launch_id) ON DELETE CASCADE,\n  scope_kind TEXT NOT NULL CHECK (scope_kind = 'linux-subreaper'),\n  descendants_reaped INTEGER CHECK (descendants_reaped IS NULL OR descendants_reaped = 1)\n) STRICT;\n\n-- Turn receipts have a shorter lifetime than their physical worker owner.\n-- Keeping the launch running preserves capacity and predecessor cleanup semantics.\nCREATE TABLE IF NOT EXISTS node_worker_turns (\n  turn_id TEXT NOT NULL PRIMARY KEY\n    CHECK (length(turn_id) BETWEEN 1 AND 256 AND instr(turn_id, char(0)) = 0),\n  owner_launch_id TEXT NOT NULL\n    REFERENCES node_worker_launches(launch_id) ON DELETE CASCADE,\n  plan_hash TEXT NOT NULL\n    CHECK (length(plan_hash) = 64 AND plan_hash NOT GLOB '*[^0-9a-f]*'),\n  run_id TEXT NOT NULL\n    CHECK (length(run_id) BETWEEN 1 AND 256 AND instr(run_id, char(0)) = 0),\n  state TEXT NOT NULL\n    CHECK (state IN ('running', 'completed', 'failed', 'interrupted', 'cancelled')),\n  result_json TEXT CHECK (\n    result_json IS NULL\n    OR (\n      length(CAST(result_json AS BLOB)) BETWEEN 1 AND 65536\n      AND instr(result_json, char(0)) = 0\n      AND json_valid(result_json)\n    )\n  ),\n  error_text TEXT CHECK (\n    error_text IS NULL\n    OR (\n      length(CAST(error_text AS BLOB)) BETWEEN 1 AND 4096\n      AND instr(error_text, char(0)) = 0\n      AND instr(error_text, char(10)) = 0\n      AND instr(error_text, char(13)) = 0\n    )\n  ),\n  completed_at_ms INTEGER CHECK (\n    completed_at_ms IS NULL OR completed_at_ms BETWEEN 0 AND 9007199254740991\n  ),\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms BETWEEN 0 AND 9007199254740991),\n  updated_at_ms INTEGER NOT NULL CHECK (\n    updated_at_ms BETWEEN created_at_ms AND 9007199254740991\n  ),\n  CHECK (\n    (state = 'running'\n      AND result_json IS NULL AND error_text IS NULL AND completed_at_ms IS NULL)\n    OR\n    (state = 'completed'\n      AND result_json IS NOT NULL AND error_text IS NULL\n      AND completed_at_ms BETWEEN created_at_ms AND updated_at_ms)\n    OR\n    (state IN ('failed', 'interrupted', 'cancelled')\n      AND result_json IS NULL AND error_text IS NOT NULL\n      AND completed_at_ms BETWEEN created_at_ms AND updated_at_ms)\n  )\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_node_worker_turns_terminal_completed\n  ON node_worker_turns(completed_at_ms, turn_id)\n  WHERE completed_at_ms IS NOT NULL;\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_node_worker_turns_active_owner\n  ON node_worker_turns(owner_launch_id)\n  WHERE state = 'running';\n\nCREATE TABLE IF NOT EXISTS config_health_entries (\n  config_path TEXT NOT NULL PRIMARY KEY,\n  last_known_good_json TEXT,\n  last_promoted_good_json TEXT,\n  last_observed_suspicious_signature TEXT,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS clawhub_promotion_claims (\n  slug TEXT NOT NULL PRIMARY KEY,\n  provider TEXT,\n  model_keys_json TEXT NOT NULL,\n  ends_at_ms INTEGER NOT NULL,\n  claimed_at_ms INTEGER NOT NULL\n) STRICT;\n\n\n\nCREATE TABLE IF NOT EXISTS official_external_plugin_catalog_snapshots (\n  feed_url TEXT NOT NULL PRIMARY KEY,\n  body TEXT NOT NULL,\n  status INTEGER NOT NULL,\n  etag TEXT,\n  last_modified TEXT,\n  checksum TEXT NOT NULL,\n  saved_at TEXT NOT NULL,\n  trust_mode TEXT,\n  trust_key_id TEXT,\n  trust_signature_count INTEGER,\n  trust_threshold INTEGER,\n  trust_verified_at TEXT,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_official_external_plugin_catalog_snapshots_updated\n  ON official_external_plugin_catalog_snapshots(updated_at_ms DESC, feed_url);\n\nCREATE TABLE IF NOT EXISTS update_runs (\n  run_id TEXT PRIMARY KEY NOT NULL,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  trigger TEXT NOT NULL CHECK (trigger IN ('chat', 'control-ui', 'cli', 'campaign', 'mac-app', 'api')),\n  phase TEXT NOT NULL CHECK (phase IN ('requested', 'staging', 'validating', 'repairing', 'activating', 'restarting', 'verifying', 'finished')),\n  status TEXT NOT NULL CHECK (status IN ('running', 'succeeded', 'failed', 'rolled-back', 'skipped')),\n  reason TEXT,\n  origin_json TEXT NOT NULL CHECK (length(CAST(origin_json AS BLOB)) <= 16384),\n  target_json TEXT NOT NULL CHECK (length(CAST(target_json AS BLOB)) <= 16384),\n  before_json TEXT NOT NULL CHECK (length(CAST(before_json AS BLOB)) <= 16384),\n  after_json TEXT NOT NULL CHECK (length(CAST(after_json AS BLOB)) <= 16384),\n  steps_json TEXT NOT NULL CHECK (length(CAST(steps_json AS BLOB)) <= 16384),\n  verification_json TEXT NOT NULL CHECK (length(CAST(verification_json AS BLOB)) <= 16384),\n  repair_json TEXT NOT NULL CHECK (length(CAST(repair_json AS BLOB)) <= 16384),\n  confirmed_at_ms INTEGER,\n  finished_at_ms INTEGER,\n  downtime_ms INTEGER,\n  CHECK ((status = 'running' AND phase != 'finished' AND finished_at_ms IS NULL) OR\n    (status != 'running' AND phase = 'finished' AND finished_at_ms IS NOT NULL))\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_update_runs_created\n  ON update_runs(created_at_ms DESC, run_id);\nCREATE INDEX IF NOT EXISTS idx_update_runs_active\n  ON update_runs(status, created_at_ms DESC, run_id);\n\nCREATE TABLE IF NOT EXISTS gateway_restart_sentinel (\n  sentinel_key TEXT NOT NULL PRIMARY KEY,\n  version INTEGER NOT NULL,\n  kind TEXT NOT NULL,\n  status TEXT NOT NULL,\n  ts INTEGER NOT NULL,\n  session_key TEXT,\n  thread_id TEXT,\n  delivery_channel TEXT,\n  delivery_to TEXT,\n  delivery_account_id TEXT,\n  message TEXT,\n  continuation_json TEXT,\n  doctor_hint TEXT,\n  stats_json TEXT,\n  payload_json TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_gateway_restart_sentinel_ts\n  ON gateway_restart_sentinel(ts DESC, sentinel_key);\n\nCREATE TABLE IF NOT EXISTS gateway_restart_intent (\n  intent_key TEXT NOT NULL PRIMARY KEY,\n  kind TEXT NOT NULL,\n  pid INTEGER NOT NULL,\n  created_at INTEGER NOT NULL,\n  reason TEXT,\n  force INTEGER,\n  wait_ms INTEGER,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS gateway_restart_handoff (\n  handoff_key TEXT NOT NULL PRIMARY KEY,\n  kind TEXT NOT NULL,\n  version INTEGER NOT NULL,\n  intent_id TEXT NOT NULL,\n  pid INTEGER NOT NULL,\n  process_instance_id TEXT,\n  created_at INTEGER NOT NULL,\n  expires_at INTEGER NOT NULL,\n  reason TEXT,\n  restart_trace_started_at INTEGER,\n  restart_trace_last_at INTEGER,\n  source TEXT NOT NULL,\n  restart_kind TEXT NOT NULL,\n  supervisor_mode TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_gateway_restart_handoff_expiry\n  ON gateway_restart_handoff(expires_at, pid);\n\nCREATE TABLE IF NOT EXISTS gateway_boot_lifecycle (\n  boot_id TEXT NOT NULL PRIMARY KEY,\n  pid INTEGER NOT NULL,\n  started_at_ms INTEGER NOT NULL,\n  completed_at_ms INTEGER,\n  outcome TEXT,\n  startup_reason TEXT,\n  reason TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_gateway_boot_lifecycle_started\n  ON gateway_boot_lifecycle(started_at_ms);\n\nCREATE TABLE IF NOT EXISTS acp_sessions (\n  session_key TEXT NOT NULL PRIMARY KEY,\n  session_id TEXT,\n  backend TEXT NOT NULL,\n  agent TEXT NOT NULL,\n  runtime_session_name TEXT NOT NULL,\n  identity_json TEXT,\n  resume_agent_session_id TEXT,\n  resume_acpx_session_id TEXT,\n  mode TEXT NOT NULL,\n  runtime_options_json TEXT,\n  cwd TEXT,\n  state TEXT NOT NULL,\n  last_activity_at INTEGER NOT NULL,\n  last_error TEXT,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_acp_sessions_state_activity\n  ON acp_sessions(state, last_activity_at DESC, session_key);\n\nCREATE INDEX IF NOT EXISTS idx_acp_sessions_agent_activity\n  ON acp_sessions(agent, last_activity_at DESC, session_key);\n\nCREATE INDEX IF NOT EXISTS idx_acp_sessions_resume_agent\n  ON acp_sessions(resume_agent_session_id);\n\nCREATE INDEX IF NOT EXISTS idx_acp_sessions_resume_acpx\n  ON acp_sessions(resume_acpx_session_id);\n\nCREATE TABLE IF NOT EXISTS acp_replay_sessions (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  session_key TEXT NOT NULL,\n  cwd TEXT NOT NULL,\n  complete INTEGER NOT NULL,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  next_seq INTEGER NOT NULL,\n  -- Running estimate of this session's ledger footprint (row overhead plus\n  -- all event rows), maintained at insert/trim so budget checks never scan\n  -- acp_replay_events (#100622).\n  estimated_bytes INTEGER NOT NULL DEFAULT 0\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_acp_replay_sessions_key_updated\n  ON acp_replay_sessions(session_key, complete, updated_at DESC, session_id);\n\nCREATE INDEX IF NOT EXISTS idx_acp_replay_sessions_updated\n  ON acp_replay_sessions(updated_at DESC, session_id);\n\nCREATE TABLE IF NOT EXISTS acp_replay_events (\n  session_id TEXT NOT NULL,\n  seq INTEGER NOT NULL,\n  at INTEGER NOT NULL,\n  session_key TEXT NOT NULL,\n  run_id TEXT,\n  update_json TEXT NOT NULL,\n  estimated_bytes INTEGER NOT NULL DEFAULT 0,\n  PRIMARY KEY (session_id, seq),\n  FOREIGN KEY (session_id) REFERENCES acp_replay_sessions(session_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_acp_replay_events_session_seq\n  ON acp_replay_events(session_id, seq);\n\nCREATE TABLE IF NOT EXISTS agent_databases (\n  agent_id TEXT NOT NULL,\n  path TEXT NOT NULL,\n  schema_version INTEGER NOT NULL,\n  last_seen_at INTEGER NOT NULL,\n  size_bytes INTEGER,\n  PRIMARY KEY (agent_id, path)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS agent_deletion_journal (\n  agent_id TEXT PRIMARY KEY,\n  operation_id TEXT NOT NULL DEFAULT '',\n  phase TEXT,\n  agent_dir TEXT NOT NULL,\n  workspace_dir TEXT NOT NULL,\n  sessions_dir TEXT NOT NULL,\n  database_paths_json TEXT NOT NULL DEFAULT '[]',\n  cleanup_paths_json TEXT NOT NULL DEFAULT '[]',\n  created_at INTEGER NOT NULL,\n  cleanup_completed INTEGER NOT NULL DEFAULT 0,\n  delete_files INTEGER NOT NULL DEFAULT 1\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS agent_provenance (\n  agent_id TEXT PRIMARY KEY,\n  created_via TEXT NOT NULL CHECK (created_via IN ('operator', 'agent', 'claw')),\n  creator_agent_id TEXT,\n  created_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS agent_database_leases (\n  lease_id TEXT PRIMARY KEY,\n  agent_id TEXT NOT NULL,\n  path TEXT NOT NULL,\n  owner_pid INTEGER NOT NULL,\n  owner_start_time INTEGER,\n  opened_at INTEGER NOT NULL,\n  provenance TEXT\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS plugin_state_entries (\n  plugin_id TEXT NOT NULL,\n  namespace TEXT NOT NULL,\n  entry_key TEXT NOT NULL,\n  value_json TEXT NOT NULL,\n  created_at INTEGER NOT NULL,\n  expires_at INTEGER,\n  PRIMARY KEY (plugin_id, namespace, entry_key)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_plugin_state_expiry\n  ON plugin_state_entries(expires_at)\n  WHERE expires_at IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_plugin_state_listing\n  ON plugin_state_entries(plugin_id, namespace, created_at, entry_key, expires_at);\n\nCREATE TABLE IF NOT EXISTS channel_ingress_events (\n  queue_name TEXT NOT NULL,\n  event_id TEXT NOT NULL,\n  channel_id TEXT NOT NULL,\n  account_id TEXT NOT NULL,\n  status TEXT NOT NULL,\n  lane_key TEXT,\n  payload_json TEXT NOT NULL,\n  metadata_json TEXT,\n  received_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  claim_token TEXT,\n  claim_owner TEXT,\n  claimed_at INTEGER,\n  attempts INTEGER NOT NULL DEFAULT 0,\n  last_attempt_at INTEGER,\n  last_error TEXT,\n  failed_reason TEXT,\n  failed_at INTEGER,\n  completed_at INTEGER,\n  completed_metadata_json TEXT,\n  PRIMARY KEY (queue_name, event_id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_channel_ingress_pending\n  ON channel_ingress_events(queue_name, status, received_at, event_id);\n\nCREATE INDEX IF NOT EXISTS idx_channel_ingress_claims\n  ON channel_ingress_events(queue_name, status, claimed_at);\n\nCREATE INDEX IF NOT EXISTS idx_channel_ingress_lane\n  ON channel_ingress_events(queue_name, status, lane_key);\n\nCREATE TABLE IF NOT EXISTS plugin_blob_entries (\n  plugin_id TEXT NOT NULL,\n  namespace TEXT NOT NULL,\n  entry_key TEXT NOT NULL,\n  metadata_json TEXT NOT NULL,\n  blob BLOB NOT NULL,\n  created_at INTEGER NOT NULL,\n  expires_at INTEGER,\n  PRIMARY KEY (plugin_id, namespace, entry_key)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_plugin_blob_expiry\n  ON plugin_blob_entries(expires_at)\n  WHERE expires_at IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_plugin_blob_listing\n  ON plugin_blob_entries(plugin_id, namespace, created_at, entry_key);\n\nCREATE TABLE IF NOT EXISTS skill_uploads (\n  upload_id TEXT NOT NULL PRIMARY KEY,\n  kind TEXT NOT NULL,\n  slug TEXT NOT NULL,\n  force INTEGER NOT NULL,\n  size_bytes INTEGER NOT NULL,\n  sha256 TEXT,\n  actual_sha256 TEXT,\n  received_bytes INTEGER NOT NULL,\n  archive_blob BLOB NOT NULL,\n  created_at INTEGER NOT NULL,\n  expires_at INTEGER NOT NULL,\n  committed INTEGER NOT NULL,\n  committed_at INTEGER,\n  idempotency_key_hash TEXT UNIQUE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_skill_uploads_expiry\n  ON skill_uploads(expires_at);\n\nCREATE INDEX IF NOT EXISTS idx_skill_uploads_idempotency\n  ON skill_uploads(idempotency_key_hash)\n  WHERE idempotency_key_hash IS NOT NULL;\n\nCREATE TABLE IF NOT EXISTS skill_upload_chunks (\n  upload_id TEXT NOT NULL,\n  byte_offset INTEGER NOT NULL CHECK (byte_offset >= 0),\n  size_bytes INTEGER NOT NULL CHECK (size_bytes > 0),\n  chunk_blob BLOB NOT NULL,\n  PRIMARY KEY (upload_id, byte_offset),\n  FOREIGN KEY (upload_id) REFERENCES skill_uploads(upload_id) ON DELETE CASCADE,\n  CHECK (length(chunk_blob) = size_bytes)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS capture_sessions (\n  id TEXT NOT NULL PRIMARY KEY,\n  started_at INTEGER NOT NULL,\n  ended_at INTEGER,\n  mode TEXT NOT NULL,\n  source_scope TEXT NOT NULL,\n  source_process TEXT NOT NULL,\n  proxy_url TEXT\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS capture_blobs (\n  blob_id TEXT NOT NULL PRIMARY KEY,\n  content_type TEXT,\n  encoding TEXT NOT NULL,\n  size_bytes INTEGER NOT NULL,\n  sha256 TEXT NOT NULL,\n  data BLOB NOT NULL,\n  created_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS capture_events (\n  id INTEGER NOT NULL PRIMARY KEY,\n  session_id TEXT NOT NULL,\n  ts INTEGER NOT NULL,\n  source_scope TEXT NOT NULL,\n  source_process TEXT NOT NULL,\n  protocol TEXT NOT NULL,\n  direction TEXT NOT NULL,\n  kind TEXT NOT NULL,\n  flow_id TEXT NOT NULL,\n  method TEXT,\n  host TEXT,\n  path TEXT,\n  status INTEGER,\n  close_code INTEGER,\n  content_type TEXT,\n  headers_json TEXT,\n  data_text TEXT,\n  data_blob_id TEXT,\n  data_sha256 TEXT,\n  error_text TEXT,\n  meta_json TEXT,\n  FOREIGN KEY (session_id) REFERENCES capture_sessions(id) ON DELETE CASCADE,\n  FOREIGN KEY (data_blob_id) REFERENCES capture_blobs(blob_id) ON DELETE SET NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS capture_events_session_ts_idx\n  ON capture_events(session_id, ts);\n\nCREATE INDEX IF NOT EXISTS capture_events_flow_idx\n  ON capture_events(flow_id, ts);\n\nCREATE TABLE IF NOT EXISTS sandbox_registry_entries (\n  registry_kind TEXT NOT NULL,\n  container_name TEXT NOT NULL,\n  session_key TEXT,\n  backend_id TEXT,\n  runtime_label TEXT,\n  image TEXT,\n  created_at_ms INTEGER,\n  last_used_at_ms INTEGER,\n  config_label_kind TEXT,\n  config_hash TEXT,\n  cdp_port INTEGER,\n  no_vnc_port INTEGER,\n  entry_json TEXT NOT NULL,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (registry_kind, container_name)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_sandbox_registry_updated\n  ON sandbox_registry_entries(registry_kind, updated_at DESC, container_name);\n\nCREATE INDEX IF NOT EXISTS idx_sandbox_registry_session\n  ON sandbox_registry_entries(registry_kind, session_key, last_used_at_ms DESC, container_name)\n  WHERE session_key IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_sandbox_registry_last_used\n  ON sandbox_registry_entries(registry_kind, last_used_at_ms DESC, container_name)\n  WHERE last_used_at_ms IS NOT NULL;\n\nCREATE TABLE IF NOT EXISTS cron_jobs (\n  store_key TEXT NOT NULL,\n  job_id TEXT NOT NULL,\n  declaration_key TEXT,\n  owner_agent_id TEXT,\n  name TEXT NOT NULL,\n  description TEXT,\n  enabled INTEGER NOT NULL,\n  agent_id TEXT,\n  payload_kind TEXT NOT NULL,\n  job_json TEXT NOT NULL,\n  grant_definition_revision TEXT,\n  grant_definition_generation INTEGER,\n  grant_definition_updated_at INTEGER,\n  state_json TEXT NOT NULL DEFAULT '{}',\n  runtime_updated_at_ms INTEGER,\n  schedule_identity TEXT,\n  sort_order INTEGER NOT NULL DEFAULT 0,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (store_key, job_id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_cron_jobs_store_order\n  ON cron_jobs(store_key, sort_order ASC, updated_at ASC, job_id);\n\n-- One owner-native receipt is also the durable execution fence. Receipts\n-- survive job deletion so operators can distinguish a run from log inference.\nCREATE TABLE IF NOT EXISTS cron_run_receipts (\n  cursor_id INTEGER NOT NULL,\n  receipt_id TEXT PRIMARY KEY,\n  store_key TEXT NOT NULL,\n  job_id TEXT NOT NULL,\n  config_revision TEXT NOT NULL,\n  agent_id TEXT NOT NULL,\n  request_run_id TEXT,\n  delivery_attempt_state TEXT NOT NULL DEFAULT 'unknown' CHECK (delivery_attempt_state IN ('unknown', 'not-started', 'started')),\n  status TEXT NOT NULL,\n  owner_pid INTEGER NOT NULL,\n  owner_start_time INTEGER,\n  started_at_ms INTEGER NOT NULL,\n  finished_at_ms INTEGER,\n  error_text TEXT,\n  CHECK (status IN ('running', 'ok', 'error', 'skipped', 'interrupted', 'superseded')),\n  CHECK (\n    (status = 'running' AND finished_at_ms IS NULL)\n    OR\n    (status != 'running' AND finished_at_ms IS NOT NULL)\n  )\n) STRICT;\n\nCREATE UNIQUE INDEX IF NOT EXISTS cron_run_receipts_cursor_id_idx\n  ON cron_run_receipts(cursor_id);\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_cron_run_receipts_active_job\n  ON cron_run_receipts(store_key, job_id)\n  WHERE status = 'running';\n\nCREATE INDEX IF NOT EXISTS idx_cron_run_receipts_job_history\n  ON cron_run_receipts(store_key, job_id, started_at_ms DESC, receipt_id DESC);\n\n-- Retirement follows the receipt's retention without changing its released shape.\nCREATE TABLE IF NOT EXISTS cron_run_trigger_state_retirements (\n  receipt_id TEXT PRIMARY KEY\n    REFERENCES cron_run_receipts(receipt_id) ON DELETE CASCADE\n) STRICT;\n\n-- Runtime-private authority is independent of job_json so downgraded writers\n-- can rewrite recognized job config without erasing or silently widening it.\nCREATE TABLE IF NOT EXISTS cron_job_runtime_authorities (\n  store_key TEXT NOT NULL,\n  job_id TEXT NOT NULL,\n  authority_json TEXT,\n  authority_input_fingerprint TEXT,\n  recovery_required INTEGER NOT NULL,\n  PRIMARY KEY (store_key, job_id),\n  FOREIGN KEY (store_key, job_id)\n    REFERENCES cron_jobs(store_key, job_id) ON DELETE CASCADE,\n  CHECK (recovery_required IN (0, 1)),\n  CHECK (\n    (recovery_required = 0 AND authority_json IS NOT NULL AND authority_input_fingerprint IS NOT NULL)\n    OR\n    (recovery_required = 1 AND authority_json IS NULL AND authority_input_fingerprint IS NULL)\n  )\n) STRICT;\n\n-- Scratch is separate from cron_jobs so scheduler state writes and downgraded\n-- full-row replacement preserve it. New builds prune rows explicitly on job removal.\n-- content NULL is a tombstone: it keeps the revision lineage monotonic across\n-- unset/recreate so stale compare-and-swap writes cannot resurrect old content.\nCREATE TABLE IF NOT EXISTS cron_job_scratch (\n  store_key TEXT NOT NULL,\n  job_id TEXT NOT NULL,\n  content TEXT,\n  revision INTEGER NOT NULL,\n  source_sha256 TEXT,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (store_key, job_id),\n  CHECK (revision >= 1),\n  CHECK (content IS NULL OR length(CAST(content AS BLOB)) <= 262144)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_cron_job_scratch_store_updated\n  ON cron_job_scratch(store_key, updated_at_ms DESC, job_id);\n\nCREATE TABLE IF NOT EXISTS delivery_queue_entries (\n  queue_name TEXT NOT NULL,\n  id TEXT NOT NULL,\n  status TEXT NOT NULL,\n  entry_kind TEXT,\n  session_key TEXT,\n  channel TEXT,\n  target TEXT,\n  account_id TEXT,\n  retry_count INTEGER NOT NULL DEFAULT 0,\n  last_attempt_at INTEGER,\n  last_error TEXT,\n  recovery_state TEXT,\n  platform_send_started_at INTEGER,\n  entry_json TEXT NOT NULL,\n  retention_id_prefix TEXT,\n  retention_max_age_ms INTEGER,\n  retention_max_entries INTEGER,\n  enqueued_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  failed_at INTEGER,\n  PRIMARY KEY (queue_name, id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_delivery_queue_pending\n  ON delivery_queue_entries(queue_name, status, enqueued_at, id);\n\nCREATE INDEX IF NOT EXISTS idx_delivery_queue_failed\n  ON delivery_queue_entries(status, queue_name, failed_at, id);\n\nCREATE INDEX IF NOT EXISTS idx_delivery_queue_session\n  ON delivery_queue_entries(queue_name, status, session_key, enqueued_at, id)\n  WHERE session_key IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_delivery_queue_target\n  ON delivery_queue_entries(queue_name, status, channel, target, enqueued_at, id)\n  WHERE channel IS NOT NULL AND target IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_delivery_queue_bounded_retention\n  ON delivery_queue_entries(queue_name, retention_id_prefix, enqueued_at DESC, id DESC)\n  WHERE status IN ('completed', 'failed') AND recovery_state = 'completed_bounded'\n    AND retention_id_prefix IS NOT NULL;\n\nCREATE TABLE IF NOT EXISTS task_runs (\n  task_id TEXT NOT NULL PRIMARY KEY,\n  runtime TEXT NOT NULL,\n  task_kind TEXT,\n  source_id TEXT,\n  requester_session_key TEXT,\n  owner_key TEXT NOT NULL,\n  scope_kind TEXT NOT NULL,\n  child_session_key TEXT,\n  parent_flow_id TEXT,\n  parent_task_id TEXT,\n  agent_id TEXT,\n  requester_agent_id TEXT,\n  run_id TEXT,\n  execution_owner_host TEXT,\n  execution_owner_pid INTEGER,\n  execution_owner_start_identity INTEGER,\n  label TEXT,\n  task TEXT NOT NULL,\n  status TEXT NOT NULL,\n  delivery_status TEXT NOT NULL,\n  notify_policy TEXT NOT NULL,\n  created_at INTEGER NOT NULL,\n  started_at INTEGER,\n  ended_at INTEGER,\n  last_event_at INTEGER,\n  cleanup_after INTEGER,\n  tool_use_count INTEGER,\n  last_tool_name TEXT,\n  error TEXT,\n  progress_summary TEXT,\n  terminal_summary TEXT,\n  terminal_outcome TEXT,\n  detail_json TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_task_runs_run_id ON task_runs(run_id);\nCREATE INDEX IF NOT EXISTS idx_task_runs_status ON task_runs(status);\nCREATE INDEX IF NOT EXISTS idx_task_runs_runtime_status ON task_runs(runtime, status);\nCREATE INDEX IF NOT EXISTS idx_task_runs_cleanup_after ON task_runs(cleanup_after);\nCREATE INDEX IF NOT EXISTS idx_task_runs_last_event_at ON task_runs(last_event_at);\nCREATE INDEX IF NOT EXISTS idx_task_runs_owner_key ON task_runs(owner_key);\nCREATE INDEX IF NOT EXISTS idx_task_runs_parent_flow_id ON task_runs(parent_flow_id);\nCREATE INDEX IF NOT EXISTS idx_task_runs_child_session_key ON task_runs(child_session_key);\nCREATE INDEX IF NOT EXISTS idx_task_runs_requester_session_key ON task_runs(requester_session_key);\nCREATE INDEX IF NOT EXISTS idx_task_runs_runtime_source_ended\n  ON task_runs(runtime, source_id, ended_at, created_at, task_id);\nCREATE INDEX IF NOT EXISTS idx_task_runs_runtime_ended\n  ON task_runs(runtime, ended_at, created_at, task_id);\n\nCREATE TABLE IF NOT EXISTS subagent_runs (\n  run_id TEXT NOT NULL PRIMARY KEY,\n  child_session_key TEXT NOT NULL,\n  controller_session_key TEXT,\n  controller_store_path TEXT,\n  requester_session_key TEXT NOT NULL,\n  requester_store_path TEXT,\n  created_at INTEGER NOT NULL,\n  payload_json TEXT NOT NULL DEFAULT '{}'\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_subagent_runs_child_session_key\n  ON subagent_runs(child_session_key, created_at DESC, run_id);\nCREATE INDEX IF NOT EXISTS idx_subagent_runs_requester_session_key\n  ON subagent_runs(requester_session_key, created_at DESC, run_id);\nCREATE INDEX IF NOT EXISTS idx_subagent_runs_controller_session_key\n  ON subagent_runs(controller_session_key, created_at DESC, run_id);\n\nCREATE TABLE IF NOT EXISTS current_conversation_bindings (\n  binding_key TEXT NOT NULL PRIMARY KEY,\n  binding_id TEXT NOT NULL,\n  target_session_key TEXT NOT NULL,\n  channel TEXT NOT NULL,\n  account_id TEXT NOT NULL,\n  conversation_kind TEXT NOT NULL,\n  parent_conversation_id TEXT,\n  conversation_id TEXT NOT NULL,\n  target_kind TEXT NOT NULL,\n  status TEXT NOT NULL,\n  bound_at INTEGER NOT NULL,\n  expires_at INTEGER,\n  metadata_json TEXT,\n  record_json TEXT NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_current_conversation_bindings_target\n  ON current_conversation_bindings(target_session_key, updated_at DESC, binding_key);\nCREATE INDEX IF NOT EXISTS idx_current_conversation_bindings_conversation\n  ON current_conversation_bindings(channel, account_id, conversation_kind, conversation_id);\nCREATE INDEX IF NOT EXISTS idx_current_conversation_bindings_expires\n  ON current_conversation_bindings(expires_at, binding_key);\n\nCREATE TABLE IF NOT EXISTS plugin_binding_approvals (\n  plugin_root TEXT NOT NULL,\n  channel TEXT NOT NULL,\n  account_id TEXT NOT NULL,\n  plugin_id TEXT NOT NULL,\n  plugin_name TEXT,\n  approved_at INTEGER NOT NULL,\n  PRIMARY KEY (plugin_root, channel, account_id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_plugin_binding_approvals_plugin\n  ON plugin_binding_approvals(plugin_id, approved_at DESC);\n\nCREATE TABLE IF NOT EXISTS task_delivery_state (\n  task_id TEXT NOT NULL PRIMARY KEY,\n  requester_origin_json TEXT,\n  last_notified_event_at INTEGER,\n  FOREIGN KEY (task_id) REFERENCES task_runs(task_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS flow_runs (\n  flow_id TEXT NOT NULL PRIMARY KEY,\n  shape TEXT,\n  sync_mode TEXT NOT NULL DEFAULT 'managed',\n  owner_key TEXT NOT NULL,\n  requester_origin_json TEXT,\n  controller_id TEXT,\n  revision INTEGER NOT NULL DEFAULT 0,\n  status TEXT NOT NULL,\n  notify_policy TEXT NOT NULL,\n  goal TEXT NOT NULL,\n  current_step TEXT,\n  blocked_task_id TEXT,\n  blocked_summary TEXT,\n  state_json TEXT,\n  wait_json TEXT,\n  cancel_requested_at INTEGER,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  ended_at INTEGER\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_flow_runs_status ON flow_runs(status);\nCREATE INDEX IF NOT EXISTS idx_flow_runs_owner_key ON flow_runs(owner_key);\nCREATE INDEX IF NOT EXISTS idx_flow_runs_updated_at ON flow_runs(updated_at);\n\n-- Durable meeting-capture sessions are gateway-global rather than agent-session\n-- transcripts. JSON/JSONL files are doctor import inputs or explicit CLI exports.\nCREATE TABLE IF NOT EXISTS meeting_transcript_sessions (\n  session_id TEXT NOT NULL,\n  started_at TEXT NOT NULL,\n  selector TEXT NOT NULL UNIQUE,\n  export_key TEXT NOT NULL,\n  session_slug TEXT NOT NULL,\n  provider_id TEXT NOT NULL,\n  title TEXT,\n  source_json TEXT NOT NULL,\n  source_account_id TEXT,\n  source_guild_id TEXT,\n  source_channel_id TEXT,\n  source_meeting_url TEXT,\n  source_thread_ts TEXT,\n  source_file_id TEXT,\n  stopped_at TEXT,\n  metadata_json TEXT,\n  metadata_agent_id TEXT,\n  export_manifest_json TEXT NOT NULL DEFAULT '{}',\n  export_pending_json TEXT NOT NULL DEFAULT '[]',\n  next_utterance_seq INTEGER NOT NULL DEFAULT 0 CHECK (next_utterance_seq >= 0),\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),\n  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),\n  PRIMARY KEY (session_id, started_at)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_started\n  ON meeting_transcript_sessions(started_at DESC, session_id);\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_id\n  ON meeting_transcript_sessions(session_id, started_at DESC);\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_slug\n  ON meeting_transcript_sessions(session_slug, started_at DESC);\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_export_key\n  ON meeting_transcript_sessions(export_key);\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_source\n  ON meeting_transcript_sessions(provider_id, source_account_id, source_guild_id,\n    source_channel_id, source_meeting_url, source_thread_ts, source_file_id,\n    stopped_at DESC, started_at DESC, session_id);\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_account\n  ON meeting_transcript_sessions(source_account_id);\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_agent\n  ON meeting_transcript_sessions(metadata_agent_id);\n\nCREATE TABLE IF NOT EXISTS meeting_transcript_utterances (\n  session_id TEXT NOT NULL,\n  session_started_at TEXT NOT NULL,\n  sequence INTEGER NOT NULL CHECK (sequence >= 0),\n  utterance_id TEXT,\n  started_at TEXT,\n  ended_at TEXT,\n  speaker_id TEXT,\n  speaker_label TEXT,\n  text TEXT NOT NULL,\n  final INTEGER CHECK (final IN (0, 1)),\n  metadata_json TEXT,\n  PRIMARY KEY (session_id, session_started_at, sequence),\n  FOREIGN KEY (session_id, session_started_at)\n    REFERENCES meeting_transcript_sessions(session_id, started_at)\n    ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_utterances_id\n  ON meeting_transcript_utterances(session_id, session_started_at, utterance_id)\n  WHERE utterance_id IS NOT NULL;\n\nCREATE TABLE IF NOT EXISTS meeting_transcript_summaries (\n  session_id TEXT NOT NULL,\n  session_started_at TEXT NOT NULL,\n  generated_at TEXT,\n  summary_json TEXT,\n  overview TEXT,\n  markdown TEXT,\n  utterance_count INTEGER NOT NULL CHECK (utterance_count >= 0),\n  PRIMARY KEY (session_id, session_started_at),\n  FOREIGN KEY (session_id, session_started_at)\n    REFERENCES meeting_transcript_sessions(session_id, started_at)\n    ON DELETE CASCADE,\n  CHECK (summary_json IS NOT NULL OR markdown IS NOT NULL)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS migration_runs (\n  id TEXT NOT NULL PRIMARY KEY,\n  started_at INTEGER NOT NULL,\n  finished_at INTEGER,\n  status TEXT NOT NULL,\n  report_json TEXT NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_migration_runs_started\n  ON migration_runs(started_at DESC, id);\n\nCREATE TABLE IF NOT EXISTS migration_sources (\n  source_key TEXT NOT NULL PRIMARY KEY,\n  migration_kind TEXT NOT NULL,\n  source_path TEXT NOT NULL,\n  target_table TEXT NOT NULL,\n  source_sha256 TEXT,\n  source_size_bytes INTEGER,\n  source_record_count INTEGER,\n  last_run_id TEXT NOT NULL,\n  status TEXT NOT NULL,\n  imported_at INTEGER NOT NULL,\n  removed_source INTEGER NOT NULL DEFAULT 0,\n  report_json TEXT NOT NULL,\n  FOREIGN KEY (last_run_id) REFERENCES migration_runs(id) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_migration_sources_path\n  ON migration_sources(source_path, migration_kind, target_table);\n\nCREATE INDEX IF NOT EXISTS idx_migration_sources_run\n  ON migration_sources(last_run_id, source_path);\n\nCREATE TABLE IF NOT EXISTS backup_runs (\n  id TEXT NOT NULL PRIMARY KEY,\n  created_at INTEGER NOT NULL,\n  archive_path TEXT NOT NULL,\n  status TEXT NOT NULL,\n  manifest_json TEXT NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_backup_runs_created\n  ON backup_runs(created_at DESC, id);\n\nCREATE TABLE IF NOT EXISTS worktrees (\n  id TEXT NOT NULL PRIMARY KEY,\n  repo_fingerprint TEXT NOT NULL,\n  repo_root TEXT NOT NULL,\n  path TEXT NOT NULL,\n  branch TEXT NOT NULL,\n  base_ref TEXT NOT NULL,\n  owner_kind TEXT NOT NULL CHECK (owner_kind IN ('manual', 'workboard', 'session')),\n  owner_id TEXT,\n  snapshot_ref TEXT,\n  provisioned_paths_json TEXT,\n  created_at INTEGER NOT NULL,\n  last_active_at INTEGER NOT NULL,\n  removed_at INTEGER,\n  run_end_cleanup_json TEXT,\n  gc_protection_json TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_worktrees_repo_fingerprint\n  ON worktrees(repo_fingerprint);\n\nCREATE INDEX IF NOT EXISTS idx_worktrees_removed_at\n  ON worktrees(removed_at);\n\nCREATE TABLE IF NOT EXISTS worktree_provisioned_file_chunks (\n  worktree_id TEXT NOT NULL,\n  path TEXT NOT NULL,\n  chunk_index INTEGER NOT NULL CHECK (chunk_index >= 0),\n  data BLOB NOT NULL,\n  PRIMARY KEY (worktree_id, path, chunk_index)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS worktree_templates (\n  cache_key TEXT NOT NULL PRIMARY KEY,\n  id TEXT NOT NULL UNIQUE,\n  repo_root TEXT NOT NULL,\n  common_dir TEXT NOT NULL,\n  worktree_root TEXT NOT NULL,\n  path TEXT NOT NULL,\n  backend TEXT NOT NULL,\n  source_commit TEXT NOT NULL,\n  content_key TEXT NOT NULL,\n  status TEXT NOT NULL CHECK (status IN ('preparing', 'ready')),\n  created_at INTEGER NOT NULL,\n  last_used_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS projects (\n  id TEXT NOT NULL PRIMARY KEY,\n  display_name TEXT NOT NULL,\n  repo_root TEXT NOT NULL,\n  origin_url TEXT,\n  source TEXT NOT NULL CHECK (source IN ('registered', 'cloned')),\n  created_at_ms INT NOT NULL,\n  updated_at_ms INT NOT NULL\n) STRICT;\n\n-- One explicitly retained, normalized private background per durable profile.\nCREATE TABLE IF NOT EXISTS user_background_images (\n  profile_id TEXT NOT NULL PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,\n  asset_id TEXT NOT NULL UNIQUE,\n  image BLOB NOT NULL CHECK (length(image) BETWEEN 1 AND 2097152),\n  width INTEGER NOT NULL CHECK (width BETWEEN 1 AND 2560),\n  height INTEGER NOT NULL CHECK (height BETWEEN 1 AND 2560)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS user_preferences (\n  profile_id TEXT NOT NULL,\n  pref_key TEXT NOT NULL,\n  value_json TEXT NOT NULL,\n  updated_at_ms INT NOT NULL,\n  PRIMARY KEY (profile_id, pref_key)\n) STRICT;\n\n-- Gateway-owned custom session group catalog (names + display order).\n-- Membership stays on each session entry's category field; this table only\n-- owns which groups exist and how operator UIs order them.\nCREATE TABLE IF NOT EXISTS session_groups (\n  name TEXT NOT NULL PRIMARY KEY,\n  position INTEGER NOT NULL,\n  created_at INTEGER NOT NULL,\n  cwd TEXT,\n  worktree INTEGER\n) STRICT;\n\n-- Gateway-owned durable cloud worker lifecycle. Provider-specific execution\n-- stays in plugins; this table records only core reconciliation facts.\nCREATE TABLE IF NOT EXISTS worker_environments (\n  environment_id TEXT NOT NULL PRIMARY KEY,\n  provider_id TEXT NOT NULL,\n  profile_id TEXT NOT NULL,\n  profile_snapshot_json TEXT NOT NULL,\n  last_activated_at_ms INTEGER,\n  preparation_key TEXT,\n  preparation_purpose TEXT,\n  preparation_demand_at_ms INTEGER,\n  preparation_expires_at_ms INTEGER,\n  preparation_consumed_at_ms INTEGER CHECK (\n    (preparation_key IS NULL AND preparation_demand_at_ms IS NULL\n      AND preparation_expires_at_ms IS NULL AND preparation_consumed_at_ms IS NULL)\n    OR\n    (preparation_key IS NOT NULL AND length(preparation_key) = 64\n      AND preparation_key NOT GLOB '*[^0-9a-f]*'\n      AND preparation_demand_at_ms IS NOT NULL\n      AND preparation_demand_at_ms BETWEEN 0 AND 9007199254740991\n      AND preparation_expires_at_ms IS NOT NULL\n      AND preparation_expires_at_ms > preparation_demand_at_ms\n      AND preparation_expires_at_ms <= 9007199254740991\n      AND (preparation_consumed_at_ms IS NULL\n        OR (preparation_consumed_at_ms >= preparation_demand_at_ms\n          AND preparation_consumed_at_ms < preparation_expires_at_ms)))\n  ),\n  provision_operation_id TEXT NOT NULL UNIQUE,\n  lease_id TEXT,\n  node_setup_id TEXT,\n  node_device_id TEXT,\n  ssh_host TEXT,\n  ssh_port INTEGER CHECK (ssh_port IS NULL OR (ssh_port >= 1 AND ssh_port <= 65535)),\n  ssh_user TEXT,\n  ssh_host_key TEXT,\n  ssh_key_ref_json TEXT,\n  desktop_json TEXT,\n  state TEXT NOT NULL CHECK (\n    state IN (\n      'requested',\n      'provisioning',\n      'bootstrapping',\n      'ready',\n      'attached',\n      'idle',\n      'draining',\n      'destroying',\n      'destroyed',\n      'failed',\n      'orphaned'\n    )\n  ),\n  bootstrap_bundle_hash TEXT,\n  bootstrap_openclaw_version TEXT,\n  bootstrap_protocol_features_json TEXT,\n  bootstrap_install_kind TEXT,\n  owner_epoch INTEGER NOT NULL DEFAULT 0 CHECK (owner_epoch >= 0),\n  teardown_terminal_state TEXT CHECK (teardown_terminal_state IN ('destroyed', 'failed')),\n  attached_session_ids_json TEXT NOT NULL DEFAULT '[]',\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  state_changed_at_ms INTEGER NOT NULL,\n  idle_since_at_ms INTEGER,\n  destroy_requested_at_ms INTEGER,\n  last_error TEXT,\n  shared_host INTEGER\n) STRICT;\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_worker_environments_provider_lease\n  ON worker_environments(provider_id, lease_id)\n  WHERE lease_id IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_worker_environments_terminal_changed\n  ON worker_environments(state_changed_at_ms, environment_id);\n\n-- A dedicated node registers its fixed build paths before ready, then binds\n-- them once. The environment belongs to the Gateway's separate database.\nCREATE TABLE IF NOT EXISTS node_worker_prepared_workspaces (\n  preparation_key TEXT NOT NULL PRIMARY KEY CHECK (\n    length(preparation_key) = 64 AND preparation_key NOT GLOB '*[^0-9a-f]*'\n  ),\n  cache_key TEXT NOT NULL CHECK (\n    length(cache_key) = 64 AND cache_key NOT GLOB '*[^0-9a-f]*'\n  ),\n  gateway_namespace TEXT NOT NULL CHECK (length(gateway_namespace) > 0),\n  workspace_dir TEXT NOT NULL UNIQUE CHECK (length(workspace_dir) > 0),\n  home_dir TEXT NOT NULL CHECK (length(home_dir) > 0),\n  source_manifest_ref TEXT NOT NULL CHECK (\n    length(source_manifest_ref) = 71 AND substr(source_manifest_ref, 1, 7) = 'sha256:'\n      AND substr(source_manifest_ref, 8) NOT GLOB '*[^0-9a-f]*'\n  ),\n  prepared_manifest_ref TEXT NOT NULL CHECK (\n    length(prepared_manifest_ref) = 71 AND substr(prepared_manifest_ref, 1, 7) = 'sha256:'\n      AND substr(prepared_manifest_ref, 8) NOT GLOB '*[^0-9a-f]*'\n  ),\n  state TEXT NOT NULL CHECK (state IN ('available', 'bound', 'retiring', 'retired')),\n  environment_id TEXT NOT NULL CHECK (length(environment_id) > 0),\n  session_id TEXT,\n  session_key TEXT,\n  owner_epoch INTEGER CHECK (owner_epoch BETWEEN 1 AND 9007199254740991),\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms BETWEEN 0 AND 9007199254740991),\n  bound_at_ms INTEGER CHECK (bound_at_ms BETWEEN created_at_ms AND 9007199254740991),\n  retired_at_ms INTEGER CHECK (\n    retired_at_ms BETWEEN coalesce(bound_at_ms, created_at_ms) AND 9007199254740991\n  ),\n  CHECK (\n    (session_id IS NULL AND session_key IS NULL AND owner_epoch IS NULL AND bound_at_ms IS NULL)\n    OR\n    (session_id IS NOT NULL AND length(session_id) > 0\n      AND session_key IS NOT NULL AND length(session_key) > 0\n      AND owner_epoch IS NOT NULL AND bound_at_ms IS NOT NULL)\n  ),\n  CHECK (\n    (state = 'available' AND bound_at_ms IS NULL AND retired_at_ms IS NULL)\n    OR (state = 'bound' AND bound_at_ms IS NOT NULL AND retired_at_ms IS NULL)\n    OR (state = 'retiring' AND retired_at_ms IS NULL)\n    OR (state = 'retired' AND retired_at_ms IS NOT NULL)\n  )\n) STRICT;\n\n-- Provider-advertised fallback ports preserve stable retry order separately\n-- from the downgrade-sensitive canonical worker environment row.\nCREATE TABLE IF NOT EXISTS worker_environment_ssh_fallback_ports (\n  environment_id TEXT NOT NULL,\n  position INTEGER NOT NULL CHECK (position >= 0 AND position <= 9),\n  port INTEGER NOT NULL CHECK (port >= 1 AND port <= 65535),\n  PRIMARY KEY (environment_id, position),\n  UNIQUE (environment_id, port),\n  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE\n) STRICT;\n\n-- Logical sessions own repository intent and accepted artifact references,\n-- independently of the worker or rotating transcript session id.\nCREATE TABLE IF NOT EXISTS session_repository_workspaces (\n  workspace_id TEXT NOT NULL PRIMARY KEY CHECK (length(workspace_id) = 36),\n  agent_id TEXT NOT NULL CHECK (length(agent_id) BETWEEN 1 AND 128),\n  session_key TEXT NOT NULL CHECK (length(session_key) BETWEEN 1 AND 1024),\n  url TEXT NOT NULL CHECK (length(url) BETWEEN 1 AND 4096),\n  requested_ref TEXT CHECK (requested_ref IS NULL OR length(requested_ref) BETWEEN 1 AND 1024),\n  run_setup_script INTEGER NOT NULL DEFAULT 0 CHECK (run_setup_script IN (0, 1)),\n  base_commit TEXT CHECK (base_commit IS NULL OR length(base_commit) IN (40, 64)),\n  base_manifest_hash TEXT,\n  branch TEXT NOT NULL CHECK (length(branch) BETWEEN 1 AND 256),\n  checkpoint_ref TEXT,\n  manifest_hash TEXT,\n  revision INTEGER NOT NULL CHECK (revision >= 0),\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  UNIQUE (agent_id, session_key),\n  CHECK (base_manifest_hash IS NULL OR base_commit IS NOT NULL),\n  CHECK ((checkpoint_ref IS NULL AND manifest_hash IS NULL)\n    OR (checkpoint_ref IS NOT NULL AND manifest_hash IS NOT NULL AND base_manifest_hash IS NOT NULL))\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS github_repository_publication_requests (\n  request_id TEXT NOT NULL PRIMARY KEY,\n  owner_profile_id TEXT,\n  connection_generation TEXT,\n  idempotency_key TEXT NOT NULL,\n  request_digest TEXT NOT NULL,\n  session_id TEXT NOT NULL,\n  session_lifecycle_revision TEXT,\n  requester_authority_json TEXT,\n  session_key TEXT NOT NULL,\n  agent_id TEXT NOT NULL,\n  workspace_id TEXT NOT NULL,\n  checkpoint_ref TEXT,\n  checkpoint_digest TEXT,\n  claim_id TEXT,\n  run_id TEXT,\n  environment_id TEXT,\n  owner_epoch INTEGER,\n  placement_generation INTEGER,\n  identity_source TEXT NOT NULL CHECK (identity_source IN ('system-detected', 'system-configured', 'agent-override', 'personal')),\n  identity_profile_id TEXT,\n  identity_account_id INTEGER NOT NULL,\n  identity_login TEXT NOT NULL,\n  title TEXT,\n  body TEXT,\n  status TEXT NOT NULL CHECK (status IN ('requested', 'publishing', 'needs_confirmation', 'published', 'failed')),\n  gateway_instance_id TEXT,\n  execution_id TEXT,\n  last_effect TEXT CHECK (last_effect IN ('push', 'pull_request')),\n  effect_state TEXT CHECK (effect_state IN ('dispatched', 'observed')),\n  push_repository TEXT,\n  repository TEXT,\n  branch TEXT NOT NULL,\n  base_branch TEXT,\n  source_head_commit TEXT,\n  source_index_tree TEXT,\n  workspace_tree TEXT,\n  previous_head_commit TEXT,\n  pushed_head_commit TEXT,\n  head_commit TEXT,\n  pull_request_url TEXT,\n  error_code TEXT,\n  next_action TEXT,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  reported_at_ms INTEGER,\n  CHECK ((identity_source = 'personal' AND owner_profile_id IS NOT NULL AND connection_generation IS NOT NULL)\n    OR (identity_source <> 'personal' AND owner_profile_id IS NULL AND connection_generation IS NULL)),\n  CHECK ((checkpoint_ref IS NULL AND checkpoint_digest IS NULL) OR (checkpoint_ref IS NOT NULL AND checkpoint_digest IS NOT NULL)),\n  CHECK ((last_effect IS NULL AND effect_state IS NULL) OR (last_effect IS NOT NULL AND effect_state IS NOT NULL))\n) STRICT;\nCREATE UNIQUE INDEX IF NOT EXISTS idx_github_repository_publication_shared_request\n  ON github_repository_publication_requests(session_id, idempotency_key) WHERE owner_profile_id IS NULL;\nCREATE UNIQUE INDEX IF NOT EXISTS idx_github_repository_publication_personal_request\n  ON github_repository_publication_requests(owner_profile_id, session_id, idempotency_key) WHERE owner_profile_id IS NOT NULL;\n\n-- Session placement lives in the shared state database so local admission,\n-- worker admission, and environment attachment use one durable authority.\nCREATE TABLE IF NOT EXISTS worker_session_placements (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  agent_id TEXT NOT NULL,\n  session_key TEXT NOT NULL,\n  execution_mode TEXT CHECK (execution_mode IN ('worker-turn', 'remote-exec')),\n  state TEXT NOT NULL CHECK (\n    state IN (\n      'local',\n      'requested',\n      'provisioning',\n      'syncing',\n      'starting',\n      'active',\n      'draining',\n      'reconciling',\n      'reclaimed',\n      'failed'\n    )\n  ),\n  environment_id TEXT,\n  transition_generation INTEGER NOT NULL DEFAULT 0 CHECK (transition_generation >= 0),\n  active_owner_epoch INTEGER CHECK (active_owner_epoch IS NULL OR active_owner_epoch >= 1),\n  workspace_base_manifest_ref TEXT,\n  remote_workspace_dir TEXT,\n  worker_bundle_hash TEXT,\n  last_transcript_ack_cursor INTEGER CHECK (\n    last_transcript_ack_cursor IS NULL OR last_transcript_ack_cursor >= 0\n  ),\n  last_live_event_ack_cursor INTEGER CHECK (\n    last_live_event_ack_cursor IS NULL OR last_live_event_ack_cursor >= 0\n  ),\n  recovery_error TEXT,\n  turn_claim_owner TEXT CHECK (turn_claim_owner IN ('local', 'worker')),\n  turn_claim_id TEXT,\n  turn_claim_run_id TEXT,\n  turn_claim_generation INTEGER CHECK (\n    turn_claim_generation IS NULL OR turn_claim_generation >= 0\n  ),\n  turn_claim_owner_epoch INTEGER CHECK (\n    turn_claim_owner_epoch IS NULL OR turn_claim_owner_epoch >= 1\n  ),\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  state_changed_at_ms INTEGER NOT NULL,\n  terminal_reason TEXT,\n  terminal_at_ms INTEGER,\n  CHECK (\n    (state IN ('local', 'requested')\n      AND environment_id IS NULL AND active_owner_epoch IS NULL\n      AND workspace_base_manifest_ref IS NULL AND remote_workspace_dir IS NULL\n      AND worker_bundle_hash IS NULL\n      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL\n      AND recovery_error IS NULL)\n    OR\n    (state IS 'provisioning'\n      AND active_owner_epoch IS NULL\n      AND workspace_base_manifest_ref IS NULL AND remote_workspace_dir IS NULL\n      AND worker_bundle_hash IS NULL\n      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL\n      AND recovery_error IS NULL)\n    OR\n    (state IS 'syncing'\n      AND environment_id IS NOT NULL AND active_owner_epoch IS NULL\n      AND workspace_base_manifest_ref IS NULL AND remote_workspace_dir IS NULL\n      AND worker_bundle_hash IS NOT NULL\n      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL\n      AND recovery_error IS NULL)\n    OR\n    (state IS 'starting'\n      AND environment_id IS NOT NULL AND active_owner_epoch IS NULL\n      AND workspace_base_manifest_ref IS NOT NULL AND remote_workspace_dir IS NOT NULL\n      AND worker_bundle_hash IS NOT NULL\n      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL\n      AND recovery_error IS NULL)\n    OR\n    (state IN ('active', 'draining', 'reconciling')\n      AND environment_id IS NOT NULL AND active_owner_epoch IS NOT NULL\n      AND workspace_base_manifest_ref IS NOT NULL AND remote_workspace_dir IS NOT NULL\n      AND worker_bundle_hash IS NOT NULL AND recovery_error IS NULL)\n    OR\n    (state IS 'reclaimed'\n      AND environment_id IS NOT NULL AND active_owner_epoch IS NOT NULL\n      AND workspace_base_manifest_ref IS NOT NULL AND remote_workspace_dir IS NOT NULL\n      AND worker_bundle_hash IS NOT NULL AND recovery_error IS NULL\n      AND turn_claim_owner IS NULL AND turn_claim_id IS NULL AND turn_claim_run_id IS NULL\n      AND turn_claim_generation IS NULL AND turn_claim_owner_epoch IS NULL)\n    OR\n    (state IS 'failed' AND recovery_error IS NOT NULL)\n  ),\n  CHECK (\n    (turn_claim_owner IS NULL AND turn_claim_id IS NULL AND turn_claim_run_id IS NULL\n      AND turn_claim_generation IS NULL AND turn_claim_owner_epoch IS NULL)\n    OR\n    (turn_claim_owner IS 'local' AND turn_claim_id IS NOT NULL\n      AND turn_claim_run_id IS NOT NULL AND turn_claim_generation IS NOT NULL\n      AND turn_claim_owner_epoch IS NULL)\n    OR\n    (turn_claim_owner IS 'worker' AND turn_claim_id IS NOT NULL\n      AND turn_claim_run_id IS NOT NULL AND turn_claim_generation IS NOT NULL\n      AND turn_claim_owner_epoch IS NOT NULL)\n  ),\n  CHECK (\n    turn_claim_owner IS NULL\n    OR\n    (turn_claim_owner IS 'local' AND (\n      state IN ('local', 'requested', 'failed')\n      OR (state IN ('active', 'draining') AND execution_mode IS 'remote-exec')\n    ))\n    OR\n    (turn_claim_owner IS 'worker' AND state IN ('active', 'draining')\n      AND (execution_mode IS NULL OR execution_mode IS 'worker-turn')\n      AND turn_claim_owner_epoch IS active_owner_epoch)\n  )\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_worker_session_placements_session_key\n  ON worker_session_placements(agent_id, session_key);\n\nCREATE INDEX IF NOT EXISTS idx_worker_session_placements_reconcile\n  ON worker_session_placements(updated_at_ms, session_id);\n\nCREATE INDEX IF NOT EXISTS idx_worker_session_placements_environment\n  ON worker_session_placements(environment_id)\n  WHERE environment_id IS NOT NULL;\n\n-- Planned placement moves retain their exact source CAS and bounded target\n-- without widening the stable placement-state vocabulary. The opaque operation\n-- id fences stale asynchronous completion; it is correlation, never authority.\nCREATE TABLE IF NOT EXISTS worker_session_placement_moves (\n  operation_id TEXT NOT NULL PRIMARY KEY,\n  session_id TEXT NOT NULL UNIQUE\n    REFERENCES worker_session_placements(session_id) ON DELETE CASCADE,\n  source_generation INTEGER NOT NULL CHECK (source_generation >= 0),\n  source_environment_id TEXT NOT NULL CHECK (\n    length(source_environment_id) BETWEEN 1 AND 256\n    AND source_environment_id = trim(source_environment_id)\n  ),\n  source_owner_epoch INTEGER NOT NULL CHECK (source_owner_epoch >= 1),\n  target_kind TEXT NOT NULL CHECK (target_kind IN ('gateway', 'profile', 'device')),\n  target_id TEXT,\n  -- Keep these nullable columns constraint-free so lazy ALTER TABLE produces the\n  -- same shape as fresh databases; placement-move code validates their values.\n  target_machine_class TEXT,\n  target_os TEXT,\n  -- Explicit source abandonment is a durable operator decision. Keep the bit\n  -- bare and nullable so same-version older readers can safely omit it.\n  abandon_source INTEGER,\n  last_error TEXT,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  CHECK (\n    (target_kind IS 'gateway' AND target_id IS NULL)\n    OR\n    (target_kind IN ('profile', 'device')\n      AND target_id IS NOT NULL\n      AND length(target_id) BETWEEN 1 AND 256\n      AND target_id = trim(target_id))\n  )\n) STRICT;\n\n-- Worker-visible session RPC authority is persisted against the exact turn\n-- claim. The launch descriptor is informative only; Gateway dispatch always\n-- revalidates this record and the live placement claim before executing.\nCREATE TABLE IF NOT EXISTS worker_turn_tool_authorities (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  environment_id TEXT NOT NULL,\n  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 1),\n  placement_generation INTEGER NOT NULL CHECK (placement_generation >= 0),\n  claim_id TEXT NOT NULL,\n  run_id TEXT NOT NULL,\n  tool_names_json TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  FOREIGN KEY (session_id) REFERENCES worker_session_placements(session_id) ON DELETE CASCADE\n) STRICT;\n\n-- Tool-call ids are idempotency keys only within one exact source turn claim.\n-- A running operation from another Gateway instance is ambiguous and is never\n-- replayed. A persisted random seed separates durable downstream identities\n-- from Gateway authentication keys and survives ordinary process restarts.\nCREATE TABLE IF NOT EXISTS worker_session_tool_operations (\n  source_session_id TEXT NOT NULL,\n  source_claim_id TEXT NOT NULL,\n  tool_call_id TEXT NOT NULL,\n  tool_name TEXT NOT NULL CHECK (tool_name IN ('sessions_spawn', 'sessions_send')),\n  request_digest TEXT NOT NULL,\n  operation_seed TEXT NOT NULL,\n  status TEXT NOT NULL CHECK (status IN ('running', 'succeeded', 'failed', 'unknown')),\n  child_session_key TEXT,\n  result_json TEXT,\n  gateway_instance_id TEXT NOT NULL,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (source_session_id, source_claim_id, tool_call_id),\n  FOREIGN KEY (source_session_id)\n    REFERENCES worker_session_placements(session_id) ON DELETE CASCADE\n) STRICT;\n\n-- Local sandbox execution is a projection of a session-owned managed worktree.\n-- No cascade: an older binary must not discard pending edits with a session row.\nCREATE TABLE IF NOT EXISTS local_workspace_projections (\n  worktree_id TEXT NOT NULL PRIMARY KEY,\n  agent_id TEXT NOT NULL,\n  session_key TEXT NOT NULL,\n  session_id TEXT NOT NULL,\n  lifecycle_revision TEXT,\n  projection_path TEXT NOT NULL UNIQUE,\n  base_commit TEXT NOT NULL,\n  source_paths_json TEXT NOT NULL,\n  baseline_json TEXT,\n  baseline_ref TEXT,\n  pending_ref TEXT,\n  pending_target TEXT CHECK (pending_target IN ('canonical', 'projection')),\n  paused_runtimes_json TEXT,\n  journal_json TEXT,\n  journal_pack BLOB CHECK (journal_pack IS NULL OR length(journal_pack) <= 268435456),\n  revision INTEGER NOT NULL DEFAULT 0 CHECK (revision >= 0),\n  created_at_ms INTEGER NOT NULL,\n  CHECK ((baseline_json IS NULL) = (baseline_ref IS NULL)),\n  CHECK ((journal_json IS NULL) = (journal_pack IS NULL))\n) STRICT;\n\n-- A reconciliation journal is written before managed-worktree mutation. The\n-- bounded Git base snapshot repairs any subset left by an interrupted apply.\nCREATE TABLE IF NOT EXISTS worker_workspace_reconciliations (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  environment_id TEXT NOT NULL,\n  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 1),\n  placement_generation INTEGER NOT NULL CHECK (placement_generation >= 0),\n  base_manifest_ref TEXT NOT NULL,\n  current_manifest_ref TEXT NOT NULL,\n  plan_json TEXT NOT NULL,\n  base_pack BLOB NOT NULL CHECK (length(base_pack) <= 268435456),\n  created_at_ms INTEGER NOT NULL,\n  FOREIGN KEY (session_id) REFERENCES worker_session_placements(session_id) ON DELETE CASCADE\n) STRICT;\n\n-- A completed remote turn is fenced from stale-claim teardown until its\n-- workspace result is durably reconciled into the managed worktree.\nCREATE TABLE IF NOT EXISTS worker_workspace_pending_results (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  environment_id TEXT NOT NULL,\n  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 1),\n  placement_generation INTEGER NOT NULL CHECK (placement_generation >= 0),\n  claim_id TEXT NOT NULL,\n  run_id TEXT NOT NULL,\n  gateway_instance_id TEXT NOT NULL,\n  recovery_requested_at_ms INTEGER,\n  workspace_accepted_at_ms INTEGER,\n  staged_result_ref TEXT,\n  repository_workspace_id TEXT,\n  created_at_ms INTEGER NOT NULL,\n  FOREIGN KEY (session_id) REFERENCES worker_session_placements(session_id) ON DELETE CASCADE\n) STRICT;\n\n-- GitHub publication intent records the authoritative session worktree. Cloud\n-- requests execute only after the exact turn claim's result is accepted locally.\n-- Secrets stay in the effective Gateway-owned GitHub profile and never enter\n-- this row or the worker protocol.\nCREATE TABLE IF NOT EXISTS github_publication_requests (\n  request_id TEXT NOT NULL PRIMARY KEY,\n  idempotency_key TEXT NOT NULL,\n  request_digest TEXT NOT NULL,\n  session_id TEXT NOT NULL,\n  session_key TEXT NOT NULL,\n  agent_id TEXT NOT NULL,\n  worktree_id TEXT NOT NULL,\n  repository_fingerprint TEXT NOT NULL,\n  claim_id TEXT,\n  run_id TEXT,\n  environment_id TEXT,\n  owner_epoch INTEGER CHECK (owner_epoch IS NULL OR owner_epoch >= 1),\n  placement_generation INTEGER CHECK (\n    placement_generation IS NULL OR placement_generation >= 0\n  ),\n  identity_source TEXT NOT NULL CHECK (\n    identity_source IN ('system-detected', 'system-configured', 'agent-override')\n  ),\n  identity_profile_id TEXT,\n  identity_account_id INTEGER NOT NULL CHECK (identity_account_id >= 1),\n  identity_login TEXT NOT NULL,\n  title TEXT,\n  body TEXT,\n  status TEXT NOT NULL CHECK (\n    status IN ('requested', 'publishing', 'published', 'failed')\n  ),\n  gateway_instance_id TEXT,\n  repository TEXT,\n  branch TEXT NOT NULL,\n  base_branch TEXT,\n  source_head_commit TEXT,\n  source_index_tree TEXT,\n  workspace_tree TEXT,\n  head_commit TEXT,\n  pull_request_url TEXT,\n  error_code TEXT,\n  next_action TEXT,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  reported_at_ms INTEGER,\n  UNIQUE (session_id, idempotency_key),\n  CHECK (\n    (claim_id IS NULL AND run_id IS NULL AND environment_id IS NULL\n      AND owner_epoch IS NULL AND placement_generation IS NULL)\n    OR\n    (claim_id IS NOT NULL AND run_id IS NOT NULL AND placement_generation IS NOT NULL\n      AND ((environment_id IS NULL AND owner_epoch IS NULL)\n        OR (environment_id IS NOT NULL AND owner_epoch IS NOT NULL)))\n  ),\n  CHECK (\n    (identity_source IS 'system-detected' AND identity_profile_id IS NULL)\n    OR\n    (identity_source IN ('system-configured', 'agent-override')\n      AND identity_profile_id IS NOT NULL)\n  ),\n  CHECK (\n    (source_head_commit IS NULL AND source_index_tree IS NULL AND workspace_tree IS NULL)\n    OR\n    (source_head_commit IS NOT NULL AND workspace_tree IS NOT NULL)\n  ),\n  CHECK (\n    (status IS 'published' AND pull_request_url IS NOT NULL AND error_code IS NULL\n      AND next_action IS NULL)\n    OR\n    (status IS 'failed' AND pull_request_url IS NULL AND error_code IS NOT NULL\n      AND next_action IS NOT NULL)\n    OR\n    (status IN ('requested', 'publishing') AND pull_request_url IS NULL\n      AND error_code IS NULL AND next_action IS NULL)\n  )\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_github_publication_requests_pending\n  ON github_publication_requests(status, updated_at_ms, request_id);\n\n-- Personal requests cannot be interpreted or resumed by older shared publishers.\nCREATE TABLE IF NOT EXISTS github_personal_publication_requests (\n  request_id TEXT NOT NULL PRIMARY KEY CHECK (length(request_id) = 36),\n  owner_profile_id TEXT NOT NULL CHECK (length(owner_profile_id) BETWEEN 1 AND 128),\n  connection_generation TEXT NOT NULL CHECK (length(connection_generation) = 36),\n  idempotency_key TEXT NOT NULL CHECK (length(idempotency_key) BETWEEN 1 AND 128),\n  request_digest TEXT NOT NULL CHECK (length(request_digest) = 64),\n  session_id TEXT NOT NULL CHECK (length(session_id) BETWEEN 1 AND 128),\n  session_key TEXT NOT NULL CHECK (length(session_key) BETWEEN 1 AND 1024),\n  agent_id TEXT NOT NULL CHECK (length(agent_id) BETWEEN 1 AND 128),\n  worktree_id TEXT NOT NULL CHECK (length(worktree_id) BETWEEN 1 AND 128),\n  repository_fingerprint TEXT NOT NULL CHECK (length(repository_fingerprint) BETWEEN 1 AND 256),\n  identity_source TEXT NOT NULL CHECK (identity_source = 'personal'),\n  identity_profile_id TEXT NOT NULL CHECK (length(identity_profile_id) = 36),\n  identity_account_id INTEGER NOT NULL CHECK (identity_account_id >= 1),\n  identity_login TEXT NOT NULL CHECK (length(identity_login) BETWEEN 1 AND 39),\n  title TEXT CHECK (title IS NULL OR length(title) BETWEEN 1 AND 256),\n  body TEXT CHECK (body IS NULL OR length(body) BETWEEN 1 AND 8192),\n  status TEXT NOT NULL CHECK (status IN ('requested', 'publishing', 'needs_confirmation', 'published', 'failed')),\n  gateway_instance_id TEXT CHECK (gateway_instance_id IS NULL OR length(gateway_instance_id) BETWEEN 1 AND 128),\n  execution_id TEXT CHECK (execution_id IS NULL OR length(execution_id) = 36),\n  last_effect TEXT CHECK (last_effect IS NULL OR last_effect IN ('push', 'pull_request')),\n  effect_state TEXT CHECK (effect_state IS NULL OR effect_state IN ('dispatched', 'observed')),\n  push_repository TEXT NOT NULL CHECK (length(push_repository) BETWEEN 3 AND 256),\n  repository TEXT NOT NULL CHECK (length(repository) BETWEEN 3 AND 256),\n  branch TEXT NOT NULL CHECK (length(branch) BETWEEN 1 AND 256),\n  base_branch TEXT NOT NULL CHECK (length(base_branch) BETWEEN 1 AND 256),\n  source_head_commit TEXT NOT NULL CHECK (length(source_head_commit) IN (40, 64)),\n  source_index_tree TEXT NOT NULL CHECK (length(source_index_tree) IN (40, 64)),\n  workspace_tree TEXT NOT NULL CHECK (length(workspace_tree) IN (40, 64)),\n  head_commit TEXT CHECK (head_commit IS NULL OR length(head_commit) IN (40, 64)),\n  pull_request_url TEXT CHECK (pull_request_url IS NULL OR length(pull_request_url) BETWEEN 1 AND 2048),\n  error_code TEXT CHECK (error_code IS NULL OR length(error_code) BETWEEN 1 AND 64),\n  next_action TEXT CHECK (next_action IS NULL OR length(next_action) BETWEEN 1 AND 1024),\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),\n  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= created_at_ms),\n  reported_at_ms INTEGER,\n  UNIQUE (owner_profile_id, session_id, idempotency_key),\n  CHECK ((status = 'publishing' AND gateway_instance_id IS NOT NULL AND execution_id IS NOT NULL) OR status <> 'publishing'),\n  CHECK ((last_effect IS NULL AND effect_state IS NULL) OR (last_effect IS NOT NULL AND effect_state IS NOT NULL)),\n  CHECK ((status = 'published' AND pull_request_url IS NOT NULL AND head_commit IS NOT NULL AND error_code IS NULL AND next_action IS NULL)\n    OR (status = 'failed' AND error_code IS NOT NULL AND next_action IS NOT NULL)\n    OR (status IN ('requested', 'publishing', 'needs_confirmation') AND error_code IS NULL AND next_action IS NULL))\n) STRICT;\nCREATE INDEX IF NOT EXISTS idx_github_personal_publication_owner_session\n  ON github_personal_publication_requests(owner_profile_id, session_id, created_at_ms);\nCREATE INDEX IF NOT EXISTS idx_github_personal_publication_pending\n  ON github_personal_publication_requests(status, updated_at_ms, request_id);\n\n-- Older readers validate both local receipt tables exactly. Their immutable\n-- lifecycle binding stays in a first-use companion so those schemas remain readable.\nCREATE TABLE IF NOT EXISTS github_publication_session_lifecycles (\n  publication_kind TEXT NOT NULL CHECK (publication_kind IN ('shared', 'personal')),\n  request_id TEXT NOT NULL,\n  lifecycle_revision TEXT,\n  requester_authority_json TEXT,\n  PRIMARY KEY (publication_kind, request_id)\n) STRICT;\n\n-- One active, opaque admission credential per worker environment. Plaintext\n-- may be retried until delivery acknowledgement but never enters durable state.\nCREATE TABLE IF NOT EXISTS worker_environment_credentials (\n  environment_id TEXT NOT NULL PRIMARY KEY,\n  credential_hash TEXT NOT NULL UNIQUE,\n  bundle_hash TEXT NOT NULL,\n  session_id TEXT,\n  rpc_set_version INTEGER NOT NULL CHECK (rpc_set_version >= 1),\n  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 0),\n  expires_at_ms INTEGER NOT NULL CHECK (expires_at_ms >= 0),\n  delivered_at_ms INTEGER CHECK (delivered_at_ms >= 0),\n  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE\n) STRICT;\n\n-- One durable sequence cursor per attached session owner epoch. The environment\n-- binding prevents independent workers with coincident epochs from sharing replay state.\nCREATE TABLE IF NOT EXISTS worker_transcript_commit_heads (\n  session_id TEXT NOT NULL,\n  run_epoch INTEGER NOT NULL CHECK (run_epoch >= 0),\n  environment_id TEXT NOT NULL,\n  next_seq INTEGER NOT NULL CHECK (next_seq >= 1),\n  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),\n  PRIMARY KEY (session_id, run_epoch)\n) STRICT;\n\n-- Pending rows preserve a claimed request across gateway restarts. Terminal rows\n-- cache the exact result returned for deterministic at-least-once replay.\nCREATE TABLE IF NOT EXISTS worker_transcript_commits (\n  session_id TEXT NOT NULL,\n  run_epoch INTEGER NOT NULL CHECK (run_epoch >= 0),\n  seq INTEGER NOT NULL CHECK (seq >= 1),\n  request_hash TEXT NOT NULL,\n  state TEXT NOT NULL CHECK (state IN ('pending', 'terminal')),\n  result_json TEXT,\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),\n  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),\n  PRIMARY KEY (session_id, run_epoch, seq),\n  FOREIGN KEY (session_id, run_epoch)\n    REFERENCES worker_transcript_commit_heads(session_id, run_epoch)\n    ON DELETE CASCADE,\n  CHECK (\n    (state = 'pending' AND result_json IS NULL) OR\n    (state = 'terminal' AND result_json IS NOT NULL)\n  )\n) STRICT;\n\n-- Pending rows preserve a claimed inference turn across gateway restarts.\n-- Terminal rows cache the exact outcome returned for deterministic replay.\nCREATE TABLE IF NOT EXISTS worker_inference_turns (\n  session_id TEXT NOT NULL,\n  run_epoch INTEGER NOT NULL CHECK (run_epoch >= 0),\n  run_id TEXT NOT NULL,\n  turn_id TEXT NOT NULL,\n  environment_id TEXT NOT NULL,\n  request_hash TEXT NOT NULL,\n  state TEXT NOT NULL CHECK (state IN ('pending', 'terminal')),\n  terminal_json TEXT,\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),\n  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),\n  PRIMARY KEY (session_id, run_epoch, run_id, turn_id),\n  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE,\n  CHECK (\n    (state = 'pending' AND terminal_json IS NULL) OR\n    (state = 'terminal' AND terminal_json IS NOT NULL)\n  )\n) STRICT;\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_worker_inference_turns_pending_run\n  ON worker_inference_turns(session_id, run_epoch, run_id)\n  WHERE state = 'pending';\n\nCREATE TABLE IF NOT EXISTS claw_installs (\n  agent_id TEXT NOT NULL PRIMARY KEY,\n  schema_version TEXT NOT NULL,\n  source_kind TEXT NOT NULL,\n  claw_name TEXT NOT NULL,\n  claw_version TEXT NOT NULL,\n  package_root TEXT NOT NULL,\n  manifest_path TEXT NOT NULL,\n  integrity_kind TEXT NOT NULL,\n  integrity TEXT NOT NULL,\n  source_byte_length INTEGER NOT NULL,\n  manifest_schema_version INTEGER NOT NULL,\n  plan_integrity TEXT NOT NULL,\n  workspace TEXT NOT NULL UNIQUE,\n  agent_config_digest TEXT NOT NULL,\n  agent_owned_paths_json TEXT NOT NULL,\n  bootstrap_source_path TEXT,\n  bootstrap_content_digest TEXT,\n  status TEXT NOT NULL CHECK (\n    status IN ('pending', 'workspace_ready', 'config_committed', 'complete', 'partial')\n  ),\n  added_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS claw_workspace_files (\n  agent_id TEXT NOT NULL,\n  target_path TEXT NOT NULL,\n  schema_version TEXT NOT NULL,\n  workspace TEXT NOT NULL,\n  source_path TEXT NOT NULL,\n  content_digest TEXT NOT NULL,\n  status TEXT NOT NULL,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (agent_id, target_path)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS claw_package_refs (\n  agent_id TEXT NOT NULL,\n  package_kind TEXT NOT NULL,\n  package_source TEXT NOT NULL,\n  package_ref TEXT NOT NULL,\n  package_version TEXT NOT NULL,\n  package_integrity TEXT NOT NULL,\n  schema_version TEXT NOT NULL,\n  claw_name TEXT NOT NULL,\n  package_status TEXT NOT NULL,\n  relationship TEXT NOT NULL CHECK (relationship IN ('managed', 'referenced')),\n  origin TEXT NOT NULL CHECK (origin IN ('claw-introduced', 'pre-existing')),\n  independent_owner INTEGER NOT NULL CHECK (independent_owner IN (0, 1)),\n  extension_id TEXT,\n  extension_format TEXT,\n  extension_detected_format TEXT,\n  extension_mapped_json TEXT,\n  extension_unavailable_json TEXT,\n  extension_adapter_identity TEXT,\n  installed_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (agent_id, package_kind, package_source, package_ref, package_version)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS claw_cron_refs (\n  agent_id TEXT NOT NULL,\n  manifest_id TEXT NOT NULL,\n  schema_version TEXT NOT NULL,\n  declaration_key TEXT NOT NULL UNIQUE,\n  scheduler_job_id TEXT UNIQUE,\n  status TEXT NOT NULL,\n  job_json TEXT NOT NULL,\n  error TEXT,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (agent_id, manifest_id)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS claw_mcp_server_refs (\n  agent_id TEXT NOT NULL,\n  name TEXT NOT NULL,\n  schema_version TEXT NOT NULL,\n  config_digest TEXT NOT NULL,\n  relationship TEXT NOT NULL CHECK (relationship IN ('managed', 'referenced')),\n  origin TEXT NOT NULL CHECK (origin IN ('claw-introduced', 'pre-existing')),\n  independent_owner INTEGER NOT NULL DEFAULT 0 CHECK (independent_owner IN (0, 1)),\n  status TEXT NOT NULL,\n  error TEXT,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (agent_id, name)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS user_profile_identities (\n  provider TEXT NOT NULL,\n  subject TEXT NOT NULL,\n  profile_id TEXT NOT NULL,\n  canonical_login TEXT,\n  created_at INTEGER NOT NULL,\n  authorization_id TEXT,\n  authorization_basis_json TEXT,\n  PRIMARY KEY (provider, subject)\n) STRICT;\nCREATE INDEX IF NOT EXISTS idx_user_profile_identities_profile_id\n  ON user_profile_identities(profile_id);\nCREATE UNIQUE INDEX IF NOT EXISTS idx_user_profile_identities_authorization\n  ON user_profile_identities(authorization_id);\n\nCREATE TABLE IF NOT EXISTS outbound_media_provenance (\n  realpath TEXT NOT NULL PRIMARY KEY,\n  kind TEXT NOT NULL,\n  version INTEGER NOT NULL,\n  sha256 TEXT NOT NULL,\n  size_bytes INTEGER NOT NULL,\n  created_at_ms INTEGER NOT NULL\n) STRICT;\n\n-- scope_id is non-null because SQLite treats NULLs as distinct in unique indexes/PKs,\n-- which would allow duplicate team rows. This PK also avoids a rebuild for identity scope.\nCREATE TABLE IF NOT EXISTS secret_store_entries (\n  scope_kind TEXT NOT NULL CHECK (scope_kind IN ('team', 'identity')),\n  scope_id TEXT NOT NULL,\n  name TEXT NOT NULL,\n  value TEXT NOT NULL,\n  kind TEXT NOT NULL CHECK (kind IN ('secret', 'env')),\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),\n  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),\n  updated_by TEXT,\n  deleted_at_ms INTEGER,\n  allowed_hosts TEXT,\n  CHECK ((scope_kind = 'team' AND scope_id = '') OR (scope_kind = 'identity' AND length(scope_id) > 0)),\n  PRIMARY KEY (scope_kind, scope_id, name)\n) STRICT;\nCREATE INDEX IF NOT EXISTS secret_store_entries_live_idx\n  ON secret_store_entries (scope_kind, scope_id, name) WHERE deleted_at_ms IS NULL;\n";
//#endregion
//#region src/state/openclaw-database-seal-schema.ts
function sqliteDatabaseSealSchemaFor(version = VERSION) {
	return createHash("sha256").update(JSON.stringify([2, version])).update(OPENCLAW_AGENT_SCHEMA_SQL).update(OPENCLAW_STATE_SCHEMA_SQL).digest("hex");
}
//#endregion
//#region src/infra/sqlite-clean-close-seal.ts
const fullVerificationIntervalMs = 6048e5;
function fileFields(file) {
	return {
		dev: file.dev.toString(),
		ino: file.ino.toString(),
		birthtime: readDatabaseIdentityBirthtime(file),
		size: file.size.toString(),
		mtimeNs: file.mtimeNs.toString()
	};
}
function checksum(payload) {
	return createHash("sha256").update(payload).digest("hex").slice(0, 16);
}
function hasNoJournal(pathname) {
	return ["-wal", "-journal"].every((suffix) => {
		try {
			const file = fs.statSync(`${pathname}${suffix}`, { bigint: true });
			return file.isFile() && file.size === 0n;
		} catch (error) {
			if (hasNodeErrorCode(error, "ENOENT")) return true;
			throw error;
		}
	});
}
/** The caller supplies fstat from its retained descriptor; closing a new one can release SQLite locks. */
function readSqliteCleanCloseSeal(pathname, schemaIdentity, file) {
	try {
		const sealPath = `${pathname}.seal`;
		if (!fs.lstatSync(sealPath).isFile()) return;
		const envelope = JSON.parse(fs.readFileSync(sealPath, "utf8"));
		if (!isRecord(envelope) || typeof envelope.payload !== "string" || envelope.checksum !== checksum(envelope.payload)) return;
		const payload = JSON.parse(envelope.payload);
		if (!isRecord(payload) || payload.version !== 1 || payload.schemaIdentity !== schemaIdentity || typeof payload.verifiedAt !== "number" || !Number.isSafeInteger(payload.verifiedAt) || !("facts" in payload) || !file.isFile()) return;
		const age = Date.now() - payload.verifiedAt;
		if (age < 0 || age > fullVerificationIntervalMs || !Object.entries(fileFields(file)).every(([key, value]) => payload[key] === value) || !hasNoJournal(pathname)) return;
		return {
			verifiedAt: payload.verifiedAt,
			facts: payload.facts
		};
	} catch {
		return;
	}
}
function invalidateSqliteCleanCloseSeal(pathname) {
	try {
		fs.unlinkSync(`${pathname}.seal`);
	} catch (error) {
		if (!hasNodeErrorCode(error, "ENOENT")) throw error;
	}
}
function writeSqliteCleanCloseSeal(pathname, schemaIdentity, file, proof) {
	try {
		const sealPath = `${pathname}.seal`;
		const existing = fs.lstatSync(sealPath, { throwIfNoEntry: false });
		if (!file.isFile() || existing && !existing.isFile() || !hasNoJournal(pathname)) {
			invalidateSqliteCleanCloseSeal(pathname);
			return false;
		}
		const payload = JSON.stringify({
			version: 1,
			schemaIdentity,
			...fileFields(file),
			verifiedAt: proof.verifiedAt,
			facts: proof.facts
		});
		fs.writeFileSync(sealPath, JSON.stringify({
			payload,
			checksum: checksum(payload)
		}));
		return true;
	} catch {
		try {
			invalidateSqliteCleanCloseSeal(pathname);
		} catch {}
		return false;
	}
}
//#endregion
//#region src/infra/sqlite-database-admission-seal.ts
const SQLITE_DATABASE_SEAL_SCHEMA = sqliteDatabaseSealSchemaFor();
const integrityVerificationKey = {
	name: "sqlite.full-verification",
	read: (value) => typeof value === "number" && Number.isSafeInteger(value) ? value : void 0
};
const sealedKeys = /* @__PURE__ */ new Set([
	"sqlite-schema",
	"sqlite.full-verification",
	"state.schema-version",
	"state.runtime-schema",
	"state.integrity",
	"agent.completed-validation",
	"agent.canonical-validation-receipt",
	"agent.schema-metadata"
]);
function isSealedKey(name) {
	return sealedKeys.has(name) || name.startsWith("memory.index-schema:");
}
function encodeSealValue(_key, value) {
	if (value instanceof Map) return {
		sealType: "map",
		entries: [...value]
	};
	if (value instanceof Set) return {
		sealType: "set",
		entries: [...value]
	};
	if (value instanceof SharedArrayBuffer) return {
		sealType: "shared",
		entries: [...new Int32Array(value)]
	};
	return value;
}
function decodeSealValue(_key, value) {
	if (!isRecord(value) || !Array.isArray(value.entries)) return value;
	if (value.sealType === "map") return new Map(value.entries);
	if (value.sealType === "set") return new Set(value.entries);
	if (value.sealType === "shared") {
		const shared = new SharedArrayBuffer(value.entries.length * Int32Array.BYTES_PER_ELEMENT);
		new Int32Array(shared).set(value.entries);
		return shared;
	}
	return value;
}
var SqliteDatabaseCleanCloseSeals = class {
	constructor(publishFact, references) {
		this.publishFact = publishFact;
		this.references = references;
		this.loaded = /* @__PURE__ */ new WeakSet();
	}
	markCreated(record) {
		this.loaded.add(record);
	}
	load(record) {
		if (threadId !== 0) return;
		if (this.loaded.has(record)) return;
		this.loaded.add(record);
		const seal = readSqliteCleanCloseSeal(record.location, SQLITE_DATABASE_SEAL_SCHEMA, fs.fstatSync(record.descriptor, { bigint: true }));
		if (!seal || typeof seal.facts !== "string") return;
		try {
			const facts = JSON.parse(seal.facts, decodeSealValue);
			if (!Array.isArray(facts) || !facts.every((entry) => Array.isArray(entry) && entry.length === 3 && typeof entry[0] === "string" && isSealedKey(entry[0]) && typeof entry[1] === "boolean") || !facts.some(([name, , value]) => name === integrityVerificationKey.name && value === seal.verifiedAt) || !facts.some(([name, , value]) => name === "sqlite-schema" && isRecord(value))) return;
			const schema = facts.find(([name]) => name === "sqlite-schema")?.[2];
			if (!(schema.tableSql instanceof Map) || hasPendingAgentStartupColumns(schema.tableSql)) return;
			for (const [name, schemaDependent, value] of facts) this.publishFact(record, {
				name,
				schemaDependent
			}, value, readSqliteDatabaseFactRevision(record, schemaDependent));
			Atomics.store(new Int32Array(record.generation), SqliteDatabaseGenerationSlot.sealPresent, 1);
		} catch {}
	}
	invalidate(location, record) {
		invalidateSqliteCleanCloseSeal(record?.location ?? location);
		if (record) Atomics.store(new Int32Array(record.generation), SqliteDatabaseGenerationSlot.sealPresent, 0);
	}
	prepare(database, record, verifiedAt) {
		const publish = this.preparePublication(database, record, verifiedAt);
		if (record) this.references.retain(record);
		let retained = record;
		return {
			publish: () => retained !== void 0 && publish(),
			[Symbol.dispose]: () => {
				const released = retained;
				retained = void 0;
				if (released) this.references.release(released);
			}
		};
	}
	preparePublication(database, record, verifiedAt) {
		if (!record || database.isTransaction) return () => false;
		if (verifiedAt === void 0) return () => false;
		const facts = [...record.facts].filter(([name, fact]) => isSealedKey(name) && isSqliteDatabaseAdmissionFactCurrent(record, fact));
		if (!facts.some(([name]) => name === "sqlite-schema")) return () => false;
		const serialized = JSON.stringify(facts.map(([name, fact]) => [
			name,
			fact.schemaDependent,
			fact.value
		]), encodeSealValue);
		return () => {
			if (database.isOpen || readSqliteDatabaseGeneration(record, "retired") !== 0 || facts.some(([, fact]) => Atomics.load(new Int32Array(fact.current), 0) !== 1 || fact.revision !== readSqliteDatabaseFactRevision(record, fact.schemaDependent))) return false;
			try {
				const file = fs.fstatSync(record.descriptor, { bigint: true });
				if (readSqliteDatabaseAdmissionIdentity(fs.statSync(record.location, { bigint: true })) !== record.identity) return false;
				const written = writeSqliteCleanCloseSeal(record.location, SQLITE_DATABASE_SEAL_SCHEMA, file, {
					verifiedAt,
					facts: serialized
				});
				Atomics.store(new Int32Array(record.generation), SqliteDatabaseGenerationSlot.sealPresent, written ? 1 : 0);
				return written;
			} catch {
				return false;
			}
		};
	}
};
//#endregion
//#region src/infra/sqlite-post-commit.ts
const log = createSubsystemLogger("sqlite/publication");
function committedPublicationState(publication) {
	return {
		commit: publication.installFacts,
		prepareObservers: publication.installProjection,
		invalidate: publication.invalidate,
		rollback: () => {}
	};
}
/**
* Installation is synchronous, including failure fencing. Observers cannot turn a
* committed write into a failed transaction or prevent another owner's receipt.
*/
function installCommittedState(states, publications) {
	const failures = /* @__PURE__ */ new Map();
	const install = (state, operation) => {
		try {
			operation?.();
		} catch (error) {
			failures.set(state, error);
		}
	};
	for (const state of states) install(state, state.commit);
	const invalidate = () => {
		let fenced = true;
		for (const [state, error] of failures) try {
			if (state.invalidate) state.invalidate(error);
			else fenced = false;
		} catch {
			fenced = false;
		}
		return fenced;
	};
	invalidate();
	for (const state of states) if (!failures.has(state)) install(state, state.prepareObservers);
	const fenced = invalidate();
	if (failures.size > 0) try {
		log.error("Committed SQLite facts could not be installed", {
			count: failures.size,
			fenced
		});
	} catch {}
	if (!fenced) return;
	for (const publish of publications) try {
		publish();
	} catch {
		try {
			log.error("SQLite post-commit notification failed");
		} catch {}
	}
}
/** Use the same phase ordering for an already committed worker receipt. */
function publishSqliteCommittedState(publication) {
	const publications = "installFacts" in publication ? [publication] : publication;
	installCommittedState(publications.map(committedPublicationState), publications.map((entry) => entry.notify));
}
/** Stage a complete owner publication; native savepoints share the outer commit. */
function stageSqliteCommittedPublication(db, publication) {
	if (!stageSqliteTransactionState(db, {
		stage: () => {},
		...committedPublicationState(publication)
	})) return false;
	deferSqlitePostCommitPublication(db, publication.notify);
	return true;
}
const pendingPublications = resolveGlobalSingleton(Symbol.for("openclaw.sqlitePostCommitPublications"), () => /* @__PURE__ */ new WeakMap());
const pendingTransactionState = resolveGlobalSingleton(Symbol.for("openclaw.sqliteTransactionState"), () => /* @__PURE__ */ new WeakMap());
/** Snapshots read within this managed transaction can still roll back. */
function hasSqlitePostCommitScope(db) {
	return pendingPublications.has(sqlPublicationAnchor(db));
}
/** Publications are non-throwing observers, never part of a durable transaction's result. */
function deferSqlitePostCommitPublication(db, publish) {
	const pending = pendingPublications.get(sqlPublicationAnchor(db));
	if (!pending) return false;
	pending.push(publish);
	return true;
}
/**
* Stage private transaction-local state that publishes before fallible observers.
* Observer preparation follows every committed state update. All callbacks must not throw.
*/
function stageSqliteTransactionState(db, state) {
	const pending = pendingTransactionState.get(sqlPublicationAnchor(db));
	if (!pending) return false;
	state.stage();
	pending.push({
		prepareCommit: state.prepareCommit,
		commit: state.commit,
		prepareObservers: state.prepareObservers,
		invalidate: state.invalidate,
		rollback: state.rollback
	});
	return true;
}
/** Tentative native writes stay private until their owner's final commit guard succeeds. */
function prepareSqliteTransactionCommit(db) {
	for (const state of pendingTransactionState.get(sqlPublicationAnchor(db)) ?? []) state.prepareCommit?.();
}
function rollbackTransactionState(states, error, outcome = "rolled-back") {
	const failures = [];
	for (const state of states.toReversed()) try {
		if (outcome === "unknown" && state.invalidate) state.invalidate(error);
		else state.rollback(error);
	} catch (failure) {
		failures.push(failure);
	}
	if (failures.length > 0) throw createSqliteLifecycleAggregateError([error, ...failures], "SQLite transaction and rollback observers failed", error);
}
/** A lost transaction invalidates every savepoint's staged state and observers. */
function discardSqliteTransactionState(database, error, outcome = "unknown") {
	const db = sqlPublicationAnchor(database);
	pendingPublications.get(db)?.splice(0);
	const rolledBackState = pendingTransactionState.get(db)?.splice(0) ?? [];
	pendingPublications.delete(db);
	pendingTransactionState.delete(db);
	rollbackTransactionState(rolledBackState, error, outcome);
}
/** Nested rollback restores staged state and discards observers; savepoints wait for outer commit. */
function withSqlitePostCommitPublications(database, transaction) {
	const db = sqlPublicationAnchor(database);
	const nested = database.isTransaction || pendingPublications.has(db);
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
	if (!nested) installCommittedState(transactionState ?? [], publications ?? []);
	return result;
}
//#endregion
//#region src/infra/sqlite-database-write-receipts.ts
const state$1 = resolveGlobalSingleton(Symbol.for("openclaw.sqliteDatabaseWriteScopes"), () => ({
	writeScopes: /* @__PURE__ */ new WeakMap(),
	pendingWriteScopes: /* @__PURE__ */ new WeakMap(),
	localScopeRevisions: /* @__PURE__ */ new WeakMap(),
	localUnscopedRevisions: /* @__PURE__ */ new WeakMap()
}));
/** Scoped revisions borrow physical admission and publication from their existing owner. */
function createSqliteDatabaseWriteReceipts(owner) {
	/** A typed owner certifies all session keys affected by this synchronous kernel. */
	function withSqliteDatabaseWriteScope(database, scope, run) {
		const record = owner.admission(database);
		if (!(record ? readSqliteDatabaseGeneration(record, "writeScopeRevision") > 0 : state$1.localScopeRevisions.has(database))) {
			const value = run();
			if (value instanceof Promise) throw new Error("SQLite write scopes cannot await work");
			return value;
		}
		const keys = normalizedWriteScopes(scope);
		const previous = state$1.writeScopes.get(database);
		state$1.writeScopes.set(database, keys);
		try {
			const value = run();
			if (value instanceof Promise) throw new Error("SQLite write scopes cannot await work");
			return value;
		} finally {
			if (previous) state$1.writeScopes.set(database, previous);
			else state$1.writeScopes.delete(database);
		}
	}
	/** Authority and user callbacks cannot borrow their caller's certified mutation scope. */
	function withoutSqliteDatabaseWriteScope(database, run) {
		const previous = state$1.writeScopes.get(database);
		state$1.writeScopes.delete(database);
		try {
			return run();
		} finally {
			if (previous) state$1.writeScopes.set(database, previous);
		}
	}
	function ensureWriteScopes(record, keys) {
		let changed = false;
		for (const key of keys) {
			const previous = record.writeScopes.get(key);
			if (!previous || Atomics.load(previous.state, 1) !== 0) {
				record.writeScopes.set(key, createScopeRevision());
				if (threadId === 0) advanceSqliteDatabaseGeneration(record, "writeScopeRevision");
				changed = true;
			}
		}
		if (changed) {
			advanceSqliteDatabaseGeneration(record, "publicationRevision");
			owner.publish(record);
		}
	}
	function createScopeRevision() {
		return {
			identity: randomUUID(),
			state: new Int32Array(new SharedArrayBuffer(2 * Int32Array.BYTES_PER_ELEMENT))
		};
	}
	/** Deletion owners retire only scopes whose stored identity has actually been removed. */
	function retireSqliteDatabaseWriteScopes(database, scope) {
		const keys = normalizedWriteScopes(scope);
		const record = owner.admission(database);
		const retire = () => {
			if (!record) {
				const local = state$1.localScopeRevisions.get(database);
				for (const key of keys) local?.delete(key);
				return;
			}
			if (isSqliteDatabaseAdmissionRetired(record)) return;
			let changed = false;
			for (const key of keys) {
				const revision = record.writeScopes.get(key);
				if (revision && Atomics.exchange(revision.state, 1, 1) === 0) changed = true;
			}
			if (changed) {
				advanceSqliteDatabaseGeneration(record, "writeScopeRevision");
				advanceSqliteDatabaseGeneration(record, "publicationRevision");
				owner.publish(record);
			}
		};
		if (!stageSqliteTransactionState(database, {
			stage() {},
			commit: retire,
			rollback() {}
		}) && !database.isTransaction) retire();
	}
	function scopedWriteToken(record, keys, pending) {
		return JSON.stringify([
			record.identity,
			record.generationId,
			readSqliteDatabaseGeneration(record, "schemaRevision"),
			readSqliteDatabaseGeneration(record, "unscopedWriteRevision") + (pending === null ? 1 : 0) | 0,
			keys.map((key) => [
				key,
				record.writeScopes.get(key).identity,
				Atomics.load(record.writeScopes.get(key).state, 0) + (pending?.has(key) ? 1 : 0) | 0
			])
		]);
	}
	function localScopedWriteToken(database, keys, pending) {
		return JSON.stringify([
			"memory",
			(state$1.localUnscopedRevisions.get(database) ?? 0) + (pending === null ? 1 : 0),
			keys.map((key) => [
				key,
				state$1.localScopeRevisions.get(database).get(key).identity,
				Atomics.load(state$1.localScopeRevisions.get(database).get(key).state, 0) + (pending?.has(key) ? 1 : 0) | 0
			])
		]);
	}
	function normalizedWriteScopes(scope) {
		return [...new Set((typeof scope === "string" ? [scope] : scope).map((key) => typeof key === "string" ? JSON.stringify(["key", toUSVString(key)]) : JSON.stringify(["session-id", toUSVString(key.sessionId)])))].toSorted();
	}
	function ensureLocalWriteScopes(database, keys) {
		const revisions = state$1.localScopeRevisions.get(database) ?? /* @__PURE__ */ new Map();
		for (const key of keys) if (!revisions.has(key)) revisions.set(key, createScopeRevision());
		state$1.localScopeRevisions.set(database, revisions);
	}
	function readScopedWriteToken(database, scope, includePending = false) {
		const keys = normalizedWriteScopes(scope);
		const record = owner.admission(database);
		if (record) ensureWriteScopes(record, keys);
		else ensureLocalWriteScopes(database, keys);
		if (owner.readRevision(database) === void 0) return;
		const pending = includePending ? state$1.pendingWriteScopes.get(database) : void 0;
		return record ? scopedWriteToken(record, keys, pending) : localScopedWriteToken(database, keys, pending);
	}
	/** Per-key receipts survive unrelated committed writes. */
	function readSqliteDatabaseScopedWriteToken(database, scope) {
		return readScopedWriteToken(database, scope);
	}
	function readSqliteDatabaseScopedWriteTokenForPath(location, scope) {
		const keys = normalizedWriteScopes(scope);
		const record = owner.pathAdmission(location);
		if (!record || isSqliteDatabaseAdmissionRetired(record)) return;
		ensureWriteScopes(record, keys);
		return scopedWriteToken(record, keys);
	}
	/** A cohort discovers all dependency scopes in one admission publication. */
	function readSqliteDatabaseScopedWriteTokensForPath(location, scopes) {
		const record = owner.pathAdmission(location);
		if (!record || isSqliteDatabaseAdmissionRetired(record)) return;
		const groups = scopes.map(normalizedWriteScopes);
		ensureWriteScopes(record, groups.flat());
		return groups.map((keys) => scopedWriteToken(record, keys));
	}
	/** Capture the exact post-commit token before any fallible publication executes. */
	function readSqliteDatabasePendingScopedWriteToken(database, scope) {
		return readScopedWriteToken(database, scope, true);
	}
	/** Host row caches retain a physical identity and receipt without opening SQLite. */
	function readSqliteDatabaseWriteTokenForPath(location) {
		const record = owner.pathAdmission(location);
		if (!record || isSqliteDatabaseAdmissionRetired(record)) return;
		return `${record.identity}:${record.generationId}:${readSqliteDatabaseGeneration(record, "writeRevision")}`;
	}
	/** Predict the token published when the current native mutation settles. */
	function readSqliteDatabasePendingWriteToken(database) {
		if (!database.isOpen || !database.isTransaction || !hasSqlitePostCommitScope(database) || owner.suspended(database)) return;
		const record = owner.writer(database);
		if (!record || isSqliteDatabaseAdmissionRetired(record)) return;
		return `${record.identity}:${record.generationId}:${readSqliteDatabaseGeneration(record, "writeRevision") + 1 | 0}`;
	}
	return {
		begin(database, unscoped) {
			const scope = unscoped ? void 0 : state$1.writeScopes.get(database);
			const pending = state$1.pendingWriteScopes.get(database);
			if (!scope || pending === null) state$1.pendingWriteScopes.set(database, null);
			else {
				const keys = pending ?? /* @__PURE__ */ new Set();
				for (const key of scope) keys.add(key);
				state$1.pendingWriteScopes.set(database, keys);
			}
		},
		finish(database, record) {
			const keys = state$1.pendingWriteScopes.get(database);
			state$1.pendingWriteScopes.delete(database);
			let unscoped = !keys;
			if (keys) {
				const local = state$1.localScopeRevisions.get(database);
				for (const key of keys) {
					const localRevision = local?.get(key);
					if (localRevision) Atomics.add(localRevision.state, 0, 1);
					const revision = record?.writeScopes.get(key);
					if (revision && Atomics.load(revision.state, 1) === 0) Atomics.add(revision.state, 0, 1);
					else if (record && (revision || record.writeScopeRevision !== readSqliteDatabaseGeneration(record, "writeScopeRevision"))) unscoped = true;
				}
			}
			if (unscoped) {
				state$1.localUnscopedRevisions.set(database, (state$1.localUnscopedRevisions.get(database) ?? 0) + 1);
				if (record) advanceSqliteDatabaseGeneration(record, "unscopedWriteRevision");
			}
		},
		retireSqliteDatabaseWriteScopes,
		withSqliteDatabaseWriteScope,
		withoutSqliteDatabaseWriteScope,
		readSqliteDatabaseScopedWriteToken,
		readSqliteDatabaseScopedWriteTokenForPath,
		readSqliteDatabaseScopedWriteTokensForPath,
		readSqliteDatabasePendingScopedWriteToken,
		readSqliteDatabaseWriteTokenForPath,
		readSqliteDatabasePendingWriteToken
	};
}
//#endregion
//#region src/infra/sqlite-database-admission.ts
const state = resolveGlobalSingleton(Symbol.for("openclaw.sqliteDatabaseAdmissions"), () => ({
	registry: new SqliteDatabaseAdmissionRegistry(),
	connections: /* @__PURE__ */ new WeakMap(),
	openedIdentities: /* @__PURE__ */ new WeakMap(),
	unproven: /* @__PURE__ */ new WeakSet(),
	suspended: /* @__PURE__ */ new WeakSet(),
	local: /* @__PURE__ */ new WeakMap(),
	rolledBack: /* @__PURE__ */ new WeakSet(),
	dataWriters: /* @__PURE__ */ new WeakMap(),
	localWriteRevisions: /* @__PURE__ */ new WeakMap(),
	writeListeners: /* @__PURE__ */ new WeakMap(),
	ddlRevisions: /* @__PURE__ */ new WeakMap(),
	schemaDirty: /* @__PURE__ */ new WeakSet(),
	localSchemaRevisions: /* @__PURE__ */ new Map(),
	misses: /* @__PURE__ */ new WeakMap(),
	exchange: new AsyncLocalStorage(),
	exchanging: false,
	publication: 0,
	seals: new SqliteDatabaseCleanCloseSeals(publishFact, {
		retain: (record) => state.registry.changeReferences(record, 1),
		release: releaseReference
	})
}));
function readSqliteDatabaseCleanClose(location) {
	const currentIdentity = prepareSqliteDatabaseAdmission(location);
	const record = pathAdmission(location);
	return record !== void 0 && record.identity === currentIdentity && Atomics.load(new Int32Array(record.generation), SqliteDatabaseGenerationSlot.sealPresent) === 1;
}
function readSqliteDatabaseIntegrityVerification(source) {
	const verifiedAt = typeof source === "string" ? getOrLoadSqliteDatabaseAdmissionForPath(source, integrityVerificationKey, () => void 0) : getSqliteDatabaseAdmission(source, integrityVerificationKey);
	return verifiedAt === void 0 ? void 0 : { verifiedAt };
}
function recordSqliteDatabaseIntegrity(db, verifiedAt = Date.now()) {
	publishSqliteDatabaseAdmission(db, integrityVerificationKey, verifiedAt);
}
/** Capture admitted facts before close; publish only after successful TRUNCATE and native close. */
function prepareSqliteDatabaseCleanClose(database) {
	return state.seals.prepare(database, admission(database), getSqliteDatabaseAdmission(database, integrityVerificationKey));
}
const scopedWrites = createSqliteDatabaseWriteReceipts({
	admission,
	pathAdmission,
	readRevision: readSqliteDatabaseWriteRevision,
	writer: (database) => state.dataWriters.get(database),
	suspended: (database) => state.suspended.has(database),
	publish(record) {
		state.registry.publish(record);
		exchange(record);
	}
});
const { retireSqliteDatabaseWriteScopes, withSqliteDatabaseWriteScope, withoutSqliteDatabaseWriteScope, readSqliteDatabaseScopedWriteToken, readSqliteDatabaseScopedWriteTokenForPath, readSqliteDatabaseScopedWriteTokensForPath, readSqliteDatabasePendingScopedWriteToken, readSqliteDatabaseWriteTokenForPath, readSqliteDatabasePendingWriteToken } = scopedWrites;
function exchange(target, create) {
	const current = state.exchange.getStore();
	if (!current || state.exchanging) return;
	state.exchanging = true;
	try {
		const scope = typeof target === "string" ? { location: target } : { admissions: [target] };
		const retired = typeof target !== "string" && isSqliteDatabaseAdmissionRetired(target);
		installSqliteDatabaseAdmissions(current(retired ? [target] : captureSqliteDatabaseAdmissions(void 0, scope), retired ? void 0 : typeof target === "string" ? target : target.location, create));
	} finally {
		state.exchanging = false;
	}
}
/** Identity descriptors stay open for the process: closing one can release SQLite's POSIX locks. */
function retainSqliteDatabaseAdmissionLocation(location) {
	const observed = fs.statSync(location, { bigint: true });
	if (!observed.isFile()) return;
	const key = readSqliteDatabaseAdmissionIdentity(observed);
	const previous = state.registry.records.get(key);
	if (previous && !isSqliteDatabaseAdmissionRetired(previous)) {
		state.registry.observeLocation(location, key);
		state.seals.load(previous);
		return;
	}
	if (threadId !== 0) return;
	const descriptor = state.registry.descriptors.get(key) ?? fs.openSync(location, "r");
	const opened = fs.fstatSync(descriptor, { bigint: true });
	if (!opened.isFile() || readSqliteDatabaseAdmissionIdentity(opened) !== key) throw new Error("SQLite database changed while retaining its admission identity");
	const record = state.registry.retainDescriptor(fs.realpathSync.native(location), descriptor, opened);
	state.registry.observeLocation(location, record.identity);
	state.seals.load(record);
}
function pathAdmission(location) {
	let retained = state.registry.forLocation(location);
	if (!retained) {
		exchange(location);
		retained = state.registry.forLocation(location);
	}
	if (retained) {
		state.seals.load(retained);
		return retained;
	}
	try {
		retainSqliteDatabaseAdmissionLocation(location);
		return state.registry.forLocation(location);
	} catch (error) {
		if (hasNodeErrorCode(error, "ENOENT")) return;
		throw error;
	}
}
/** Resolve SQLite's absolute URLs and encoded filename form at filesystem boundaries. */
function resolveSqliteDatabaseFilePath(location) {
	if (!location.startsWith("file:")) return location;
	const [uriFilename = ""] = location.slice(5).split(/[?#]/u, 1);
	return uriFilename.startsWith("/") ? fileURLToPath(location) : decodeURIComponent(uriFilename);
}
/** Bracket native open so a pathname swap cannot lend the replacement file's admission. */
function prepareSqliteDatabaseAdmission(location, options = {}) {
	let filename = location;
	let create = options.create;
	if (!filename || filename === ":memory:") return;
	if (filename.startsWith("file:")) {
		const url = new URL(filename);
		if (url.searchParams.get("mode") === "memory") return;
		if (["ro", "rw"].includes(url.searchParams.get("mode") ?? "")) create = false;
		filename = resolveSqliteDatabaseFilePath(filename);
		if (!filename || filename === ":memory:") return;
	}
	try {
		const file = fs.statSync(filename, { bigint: true });
		if (!file.isFile()) return;
		const observed = readSqliteDatabaseAdmissionIdentity(file);
		state.registry.observeLocation(filename, observed);
		return observed;
	} catch (error) {
		if (hasNodeErrorCode(error, "ENOENT")) {
			if (!create) return;
			if (threadId !== 0) {
				const managed = state.exchange.getStore() !== void 0;
				exchange(filename, true);
				const opened = prepareSqliteDatabaseAdmission(filename);
				if (managed && opened === void 0) throw new Error(`SQLite worker file creation requires host authority: ${filename}`, { cause: error });
				return opened;
			}
			let descriptor;
			try {
				descriptor = fs.openSync(filename, "wx", 420);
			} catch (creationError) {
				if (hasNodeErrorCode(creationError, "EEXIST")) return prepareSqliteDatabaseAdmission(filename);
				throw creationError;
			}
			const opened = fs.fstatSync(descriptor, { bigint: true });
			const record = state.registry.retainDescriptor(fs.realpathSync.native(filename), descriptor, opened);
			state.seals.markCreated(record);
			if (prepareSqliteDatabaseAdmission(filename) !== record.identity) throw new Error("SQLite database changed identity during file creation", { cause: error });
			return record.identity;
		}
		throw error;
	}
}
function bindSqliteDatabaseAdmission(database, expected) {
	state.connections.delete(database);
	state.openedIdentities.delete(database);
	state.unproven.delete(database);
	const location = database.location();
	if (!location || location === ":memory:") return;
	const observed = prepareSqliteDatabaseAdmission(location);
	if (expected !== void 0 && observed !== expected) throw new Error("SQLite database changed identity during native open");
	if (!observed) return;
	state.openedIdentities.set(database, observed);
	if (expected === void 0) {
		state.unproven.add(database);
		return;
	}
	const record = state.registry.records.get(observed);
	if (record && !isSqliteDatabaseAdmissionRetired(record)) retainConnection(database, record);
}
function admission(database, create = true) {
	const expected = state.openedIdentities.get(database);
	if (!database.isOpen || expected === void 0 || state.unproven.has(database)) return;
	const retained = state.connections.get(database);
	if (retained) return isSqliteDatabaseAdmissionRetired(retained) ? void 0 : retained;
	const location = database.location();
	if (!location || location === ":memory:") return;
	const record = create && !database.isTransaction ? pathAdmission(location) : state.registry.records.get(expected);
	if (record && record.identity !== expected) throw new Error("SQLite database changed identity before admission");
	return record && !isSqliteDatabaseAdmissionRetired(record) ? retainConnection(database, record) : void 0;
}
function retainConnection(database, record) {
	const expected = record.identity;
	let current = record;
	try {
		for (;;) {
			if (current.identity !== expected) throw new Error("SQLite database changed identity during native open");
			const publish = state.registry.changeReferences(current, 1);
			let retained = false;
			try {
				if (publish) exchange(current);
				const retirement = readSqliteDatabaseGeneration(current, "retired");
				if (retirement === 0) {
					state.connections.set(database, current);
					retained = true;
					return current;
				}
				if (retirement !== 2) throw new Error("SQLite database admission retired during native open");
			} finally {
				if (!retained) state.registry.changeReferences(current, -1);
			}
			const location = database.location();
			const replacement = database.isTransaction ? state.registry.records.get(expected) : location ? pathAdmission(location) : void 0;
			if (!replacement || isSqliteDatabaseAdmissionRetired(replacement)) throw new Error("SQLite database admission unavailable during native open");
			current = replacement;
		}
	} catch (error) {
		state.openedIdentities.delete(database);
		throw error;
	}
}
/** Native close has settled; keep only descriptor custody, never the closed database's payloads. */
function releaseSqliteDatabaseAdmission(database) {
	const record = state.connections.get(database);
	if (state.openedIdentities.delete(database) && record) {
		state.local.delete(database);
		releaseReference(record);
	}
}
function releaseReference(record) {
	if (state.registry.changeReferences(record, -1)) {
		state.localSchemaRevisions.delete(record.identity);
		exchange(record);
	}
}
const { getSqliteDatabaseAdmission, getOrLoadSqliteDatabaseAdmissionForPath } = createSqliteDatabaseAdmissionReader({
	state,
	admission,
	pathAdmission,
	exchange,
	publishFact
});
function publishFact(record, key, value, revision) {
	if (key.writer === "host" && threadId !== 0) throw new Error("SQLite host-owned admission facts require the host publisher");
	if (!publishSqliteDatabaseFact(record, key, value, revision, `${threadId}:${++state.publication}`)) return;
	state.registry.publish(record);
	exchange(record);
}
/** Publish one row-cache revision when a local native write settles. */
function beginSqliteDatabaseWrite(database, unscoped = false) {
	const record = admission(database);
	if (record && Atomics.load(new Int32Array(record.generation), SqliteDatabaseGenerationSlot.sealPresent) === 1) state.seals.invalidate(record.location, record);
	scopedWrites.begin(database, unscoped);
	if (state.dataWriters.has(database)) return;
	state.dataWriters.set(database, admission(database));
}
/** Local sibling writers notify maintenance after publishing their shared write revision. */
function onSqliteDatabaseWriteSettled(database, listener) {
	const record = admission(database);
	if (!record) return;
	let listeners = state.writeListeners.get(record);
	if (!listeners) {
		listeners = /* @__PURE__ */ new Set();
		state.writeListeners.set(record, listeners);
	}
	return registerListener(listeners, listener);
}
/** Native settlement invalidates row caches, including failed or rolled-back writes. */
function finishSqliteDatabaseWrite(database) {
	if (!state.dataWriters.has(database)) return;
	const record = state.dataWriters.get(database);
	state.dataWriters.delete(database);
	state.localWriteRevisions.set(database, (state.localWriteRevisions.get(database) ?? 0) + 1);
	scopedWrites.finish(database, record);
	if (record) {
		advanceSqliteDatabaseGeneration(record, "writeRevision");
		const listeners = state.writeListeners.get(record);
		if (listeners) notifyListeners(listeners, void 0);
	}
}
/** Ordinary reads consume the last committed writer revision without a writer census. */
function readSqliteDatabaseWriteRevision(connection) {
	const database = sqlPublicationAnchor(connection);
	if (!database.isOpen || state.suspended.has(database)) return;
	const record = admission(database);
	if (!record) {
		const location = database.location();
		return !location || location === ":memory:" ? state.localWriteRevisions.get(database) ?? 0 : void 0;
	}
	return readSqliteDatabaseGeneration(record, "writeRevision");
}
/** A stopped worker may have committed before delivering its row-cache receipt. */
function trackSqliteDatabaseAdmissionWorker(worker) {
	const owner = worker.threadId;
	worker.once("exit", () => state.registry.releaseWorker(owner));
}
function hasPendingSqliteDatabaseSchemaMutation(database) {
	const anchor = sqlPublicationAnchor(database);
	return database.isTransaction && state.schemaDirty.has(anchor);
}
function publishSqliteDatabaseAdmission(database, key, value, options = {}) {
	const anchor = sqlPublicationAnchor(database);
	const record = admission(anchor, !database.isTransaction);
	if (!record || isSqliteDatabaseAdmissionRetired(record) || state.suspended.has(anchor)) return;
	if (key.writer === "host" && threadId !== 0) throw new Error("SQLite host-owned admission facts require the host publisher");
	const revision = (key.schemaDependent ? options.schemaRevision : void 0) ?? readSqliteDatabaseFactRevision(record, key.schemaDependent);
	const native = isPostgresSqlConnection(database) ? void 0 : getSqliteNativeAdmissionFacts(database);
	if (!native && !database.isTransaction) {
		publishFact(record, key, value, revision);
		return;
	}
	const staged = {
		value,
		revision,
		schemaDependent: key.schemaDependent === true,
		ddlRevision: state.ddlRevisions.get(anchor) ?? 0
	};
	if (native) {
		native.set(key.name, staged);
		return;
	}
	const local = state.local.get(anchor) ?? /* @__PURE__ */ new Map();
	state.local.set(anchor, local);
	const previous = local.get(key.name);
	const restore = () => {
		if (state.local.get(anchor) !== local) return;
		if (previous === void 0) local.delete(key.name);
		else local.set(key.name, previous);
	};
	stageSqliteTransactionState(anchor, {
		stage: () => local.set(key.name, staged),
		rollback: restore,
		commit: () => {
			if (state.local.get(anchor) === local && local.get(key.name) === staged) {
				local.delete(key.name);
				if (staged.revision === readSqliteDatabaseFactRevision(record, staged.schemaDependent) && (!staged.schemaDependent || staged.ddlRevision === (state.ddlRevisions.get(anchor) ?? 0))) publishFact(record, key, value, staged.revision);
			}
		}
	});
}
/** Track uncommitted DDL separately so it cannot revive a receipt validated before a later change. */
function invalidateLocalSqliteSchemaAdmissions(database) {
	const anchor = sqlPublicationAnchor(database);
	const revision = state.ddlRevisions.get(anchor) ?? 0;
	const dirty = state.schemaDirty.has(anchor);
	const stage = () => {
		state.ddlRevisions.set(anchor, revision + 1);
		state.schemaDirty.add(anchor);
	};
	if (!stageSqliteTransactionState(anchor, {
		stage,
		commit: () => {},
		rollback: () => {
			state.ddlRevisions.set(anchor, revision);
			if (!dirty) state.schemaDirty.delete(anchor);
		}
	})) stage();
}
/** Raw rollback cannot restore staging boundaries; require new facts in any remaining transaction. */
function discardSqliteDatabaseTransactionAdmissions(database) {
	const anchor = sqlPublicationAnchor(database);
	const record = admission(anchor, false);
	for (const pending of [isPostgresSqlConnection(database) ? void 0 : getSqliteNativeAdmissionFacts(database), state.local.get(anchor)]) {
		for (const key of pending?.keys() ?? []) {
			const previous = record?.facts.get(key);
			if (previous) Atomics.store(new Int32Array(previous.current), 0, 0);
		}
		pending?.clear();
	}
	state.local.delete(anchor);
	state.rolledBack.add(anchor);
	if (!database.isTransaction) state.schemaDirty.delete(anchor);
}
/** The DDL owner advances committed format and acknowledges only its final validated receipts. */
function publishSqliteDatabaseSchemaChange(database) {
	const anchor = sqlPublicationAnchor(database);
	const record = admission(anchor, false);
	if (record) {
		const previous = advanceSqliteDatabaseGeneration(record, "schemaRevision");
		const ddlRevision = state.ddlRevisions.get(anchor) ?? 0;
		for (const fact of state.local.get(anchor)?.values() ?? []) if (fact.schemaDependent && fact.revision === previous && fact.ddlRevision === ddlRevision) fact.revision = previous + 1;
	} else {
		const fileIdentity = state.openedIdentities.get(anchor);
		if (fileIdentity) state.localSchemaRevisions.set(fileIdentity, (state.localSchemaRevisions.get(fileIdentity) ?? 0) + 1);
	}
	if (!database.isTransaction) state.schemaDirty.delete(anchor);
}
function revoke(record, location = record?.location) {
	if (location) state.seals.invalidate(location, record);
	if (record) {
		advanceSqliteDatabaseGeneration(record, "schemaRevision");
		advanceSqliteDatabaseGeneration(record, "factRevision");
	}
}
function revokeSqliteDatabaseAdmissions(database) {
	revoke(state.connections.get(database) ?? admission(database));
	state.local.delete(database);
}
function revokeSqliteDatabaseAdmissionsForPath(location) {
	revoke(pathAdmission(location), location);
}
/** Explicit removal or maintenance calls this only after its owner has joined native consumers. */
function retireSqliteDatabaseAdmissionForPath(location, options = {}) {
	const observed = prepareSqliteDatabaseAdmission(location);
	if (!observed) return;
	state.localSchemaRevisions.delete(observed);
	const record = threadId === 0 ? state.registry.records.get(observed) : pathAdmission(location);
	if (state.registry.retireDescriptor(observed, options) && record) exchange(record);
}
function getSqliteDatabaseSchemaRevision(connection) {
	const database = sqlPublicationAnchor(connection);
	const record = admission(database);
	if (record) return readSqliteDatabaseGeneration(record, "schemaRevision");
	const fileIdentity = state.openedIdentities.get(database);
	return fileIdentity ? state.localSchemaRevisions.get(fileIdentity) ?? 0 : void 0;
}
function suspendSqliteDatabaseAdmission(database, suspended) {
	if (suspended) state.suspended.add(database);
	else state.suspended.delete(database);
}
function hasSqliteDatabaseSchemaAdmissionForPath(location) {
	return hasSqliteDatabaseSchemaAdmission(pathAdmission(location));
}
/** Admission owns the descriptor's immutable identity; callers do not re-stat its pathname. */
function getSqliteDatabaseAdmissionIdentityForPath(location) {
	return state.registry.forLocation(location)?.physicalIdentity;
}
function captureSqliteDatabaseAdmissions(cursor, scope) {
	if (!scope) return state.registry.capture(cursor);
	const identities = new Set(scope.admissions?.map((record) => record.identity));
	if (scope.location !== void 0) {
		const observed = state.registry.forLocation(scope.location)?.identity;
		if (observed) identities.add(observed);
	}
	return state.registry.capture(cursor, identities);
}
function installSqliteDatabaseAdmissions(admissions) {
	state.registry.install(admissions);
}
/** Unsupported worker hosts retain native validation instead of waiting for unpublished facts. */
function canShareSqliteDatabaseAdmissions() {
	return threadId === 0 || state.exchange.getStore() !== void 0;
}
const inherited = readSqliteDatabaseAdmissions(getEnvironmentData(SQLITE_DATABASE_ADMISSIONS_KEY));
if (inherited) installSqliteDatabaseAdmissions(inherited);
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
	return registerListener(owner[disposeCallbacksSymbol] ??= /* @__PURE__ */ new Set(), callback);
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
	for (const method of ["close", Symbol.dispose]) if (typeof owner[method] === "function") {
		const dispose = owner[method].bind(owner);
		Object.defineProperty(owner, method, {
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
	if (isPostgresSqlConnection(db)) return execute(db.prepare(sql));
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
//#region src/infra/sqlite-pinned-read-snapshot.ts
const snapshots = resolveGlobalSingleton(Symbol.for("openclaw.sqlitePinnedReadSnapshots"), () => /* @__PURE__ */ new WeakMap());
function getSqlitePinnedReadSnapshot(db) {
	return snapshots.get(db);
}
/** First schema admission consumes the same cookie that pins its catalog capture. */
function runSqliteSchemaReadSnapshotSync(db, operation) {
	const parent = snapshots.get(db);
	snapshots.set(db, parent ?? {});
	try {
		return executeWithCachedStatement(db, "PRAGMA schema_version", [], (statement) => {
			const snapshot = statement.iterate();
			try {
				const first = snapshot.next();
				if (first.done) throw new Error("SQLite schema_version query returned no row");
				return operation(Number(first.value.schema_version));
			} finally {
				snapshot.return?.();
			}
		});
	} finally {
		if (!parent) snapshots.delete(db);
	}
}
//#endregion
//#region src/infra/sqlite-schema-admission.ts
const schemaAdmission = {
	name: "sqlite-schema",
	schemaDependent: true,
	read: (value) => {
		return isRecord(value) ? value : void 0;
	}
};
const textEncodingAdmission = {
	name: "sqlite-text-encoding",
	read: (value) => typeof value === "string" ? value : void 0
};
/** Native metadata read shared by admission and pre-admission migrations. */
function readSqliteTextEncoding(database) {
	const retained = getSqliteDatabaseAdmission(database, textEncodingAdmission);
	if (retained !== void 0) return retained;
	const encoding = executeWithCachedStatement(database, "PRAGMA encoding", [], (s) => s.get());
	if (typeof encoding?.encoding !== "string") throw new Error("SQLite did not report its text encoding");
	return encoding.encoding;
}
/** Capture the physical catalog for admission or pre-admission schema maintenance. */
function captureSqliteSchemaFacts(database, revision = 0, validateUserVersion) {
	const retainedTextEncoding = getSqliteDatabaseAdmission(database, textEncodingAdmission);
	const captured = runSqliteSchemaReadSnapshotSync(database, (schemaVersion) => {
		const version = executeWithCachedStatement(database, "PRAGMA user_version", [], (s) => s.get());
		const userVersion = Number(version?.user_version ?? 0);
		validateUserVersion?.(userVersion);
		const textEncoding = retainedTextEncoding ?? readSqliteTextEncoding(database);
		const objects = executeWithCachedStatement(database, "SELECT type, name, tbl_name, sql FROM main.sqlite_schema WHERE type IN ('table', 'view', 'index', 'trigger')", [], (s) => s.all());
		const facts = {
			admissionId: randomUUID(),
			revision,
			userVersion,
			textEncoding,
			schemaVersion,
			tables: /* @__PURE__ */ new Set(),
			views: /* @__PURE__ */ new Set(),
			tableSql: /* @__PURE__ */ new Map(),
			indexes: /* @__PURE__ */ new Set(),
			indexDefinitions: /* @__PURE__ */ new Map(),
			triggers: /* @__PURE__ */ new Map()
		};
		for (const row of objects) {
			if (typeof row.name !== "string") continue;
			const sql = typeof row.sql === "string" ? row.sql : null;
			switch (row.type) {
				case "table":
					facts.tables.add(row.name);
					facts.tableSql.set(row.name, sql);
					break;
				case "view":
					facts.views.add(row.name);
					break;
				case "index":
					facts.indexes.add(row.name);
					if (typeof row.tbl_name === "string") facts.indexDefinitions.set(row.name, {
						table: row.tbl_name,
						sql
					});
					break;
				case "trigger": if (typeof row.tbl_name === "string") facts.triggers.set(row.name, {
					table: row.tbl_name,
					sql
				});
			}
		}
		return facts;
	});
	if (retainedTextEncoding === void 0 && (captured.tables.size > 0 || captured.views.size > 0)) publishSqliteDatabaseAdmission(database, textEncodingAdmission, captured.textEncoding);
	return captured;
}
function captureTrackedSqliteSchemaFacts(database, owner, validateUserVersion) {
	owner.capturing = true;
	try {
		return captureSqliteSchemaFacts(database, owner.revision, validateUserVersion);
	} finally {
		owner.capturing = false;
	}
}
function invalidateTrackedSqliteSchemaFacts(owner) {
	owner.revision += 1;
	owner.facts = void 0;
}
//#endregion
//#region src/infra/diagnostic-flags-env.ts
function parseDiagnosticEnvFlags(raw) {
	const trimmed = raw?.trim() ?? "";
	const lowered = trimmed.toLowerCase();
	if (!lowered) return {
		flags: [],
		disablesAll: false
	};
	if ([
		"0",
		"false",
		"off",
		"none"
	].includes(lowered)) return {
		flags: [],
		disablesAll: true
	};
	if ([
		"1",
		"true",
		"all",
		"*"
	].includes(lowered)) return {
		flags: ["*"],
		disablesAll: false
	};
	return {
		flags: trimmed.split(/[,\s]+/),
		disablesAll: false
	};
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
const WORKER_CAPABILITIES_KEY = "openclaw.sqliteRuntimeCapabilities";
const SQLITE_NATIVE_RUNTIME_ADMISSION_KEY = "openclaw.sqliteNativeRuntimeAdmission";
const SQLITE_EXPECTED_SCHEMA_CONTRACTS_KEY = "openclaw.sqliteExpectedSchemaContracts.v1";
function createCapabilities(select) {
	let decision;
	let initialization;
	let earlyTopologyOwners = 0;
	const pending = Object.freeze({
		explicitSqliteCloseReleasesNativeResources: false,
		decided: false,
		reason: "SQLite close capability has not been decided"
	});
	function decide(value) {
		if (!decision) {
			decision = Object.freeze(value);
			setEnvironmentData(WORKER_CAPABILITIES_KEY, decision);
			if (decision.explicitSqliteCloseReleasesNativeResources && earlyTopologyOwners > 0) process.emitWarning(`SQLite close became capable after ${earlyTopologyOwners} topology owners were created; those owners remain conservative`, { code: "SQLITE_EARLY_TOPOLOGY" });
		}
		return decision;
	}
	function conservative(reason) {
		return {
			explicitSqliteCloseReleasesNativeResources: false,
			decided: true,
			reason
		};
	}
	function settled() {
		if (decision) return decision;
		if (!process.versions.bun) return decide({
			explicitSqliteCloseReleasesNativeResources: true,
			decided: true,
			reason: "Node runtime"
		});
		if (process.platform === "win32") return decide(conservative("Bun Windows native-close conformance is not qualified"));
		if (!isMainThread) return decide({
			...pending,
			reason: "Parent did not complete SQLite close admission",
			...getEnvironmentData(WORKER_CAPABILITIES_KEY)
		});
	}
	return {
		get() {
			return settled() ?? pending;
		},
		capture() {
			const fact = settled() ?? pending;
			if (!fact.decided) earlyTopologyOwners += 1;
			return fact.explicitSqliteCloseReleasesNativeResources;
		},
		initialize() {
			initialization ??= (async () => {
				select();
				const ready = settled();
				if (ready) return ready;
				try {
					if (parseDiagnosticEnvFlags(process.env.OPENCLAW_DIAGNOSTICS).flags.some((flag) => flag.toLowerCase() === "sqlite.close.conservative")) return decide(conservative("SQLite close optimization disabled by internal diagnostic flag"));
					const { probeSqliteNativeClose } = await import("./sqlite-readonly-bun-sqlite-close-probe-beGDnjyI.mjs");
					return decide({
						...await probeSqliteNativeClose(),
						decided: true
					});
				} catch (error) {
					return decide(conservative(`SQLite close check failed: ${String(error)}`));
				}
			})();
			return initialization;
		}
	};
}
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
function createSelector() {
	let selection;
	let failure;
	return (options = {}) => {
		if (failure) throw failure;
		if (selection) return selection;
		const override = options.explicitPath ?? (process.env.OPENCLAW_SQLITE_LIBRARY?.trim() || void 0);
		if (!process.versions.bun || process.platform !== "darwin") {
			selection = override ? {
				source: "runtime",
				ignoredOverride: "OPENCLAW_SQLITE_LIBRARY requires Bun on macOS"
			} : { source: "runtime" };
			return selection;
		}
		const prefix = process.env.HOMEBREW_PREFIX?.trim();
		const candidates = override !== void 0 ? [override] : [.../* @__PURE__ */ new Set([
			...prefix ? [posix.join(prefix, "opt/sqlite/lib/libsqlite3.dylib")] : [],
			"/opt/homebrew/opt/sqlite/lib/libsqlite3.dylib",
			"/usr/local/opt/sqlite/lib/libsqlite3.dylib",
			"/opt/local/lib/libsqlite3.dylib"
		])];
		const unusable = [];
		for (const path of candidates) {
			let probe;
			let present = true;
			try {
				try {
					probe = probeLibrary(path);
				} catch (error) {
					present = existsSync(path);
					throw present ? error : new Error("missing file", { cause: error });
				}
				if (!isSqliteWalResetSafeVersion(probe.version)) throw new Error(`SQLite version ${probe.version} below the WAL safety floor`);
				if (!probe.extensionLoadingSupported) throw new Error("built with SQLITE_OMIT_LOAD_EXTENSION");
			} catch (error) {
				if (override === void 0) {
					if (present) unusable.push(`${path} (${error instanceof Error ? error.message : String(error)})`);
					continue;
				}
				failure = selectionError(path, error);
				throw failure;
			}
			try {
				selectLibrary(path);
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
		failure = /* @__PURE__ */ new Error(`No supported SQLite library for Bun on macOS (${process.arch})` + (unusable.length > 0 ? `; unusable: ${unusable.join(", ")}` : "") + `. Apple's system SQLite fails OpenClaw's read-only database connections. Install one with brew install sqlite, or set OPENCLAW_SQLITE_LIBRARY to a libsqlite3.dylib built for ${process.arch}.`);
		throw failure;
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
	const sharedLibrary = Boolean(process.versions.bun) && process.platform === "darwin";
	const inherited = sharedLibrary && !isMainThread ? inheritedSelection() : void 0;
	const select = createSelector();
	let published = false;
	return (options) => {
		const selection = inherited ?? select(options);
		if (sharedLibrary && isMainThread && !published) {
			setEnvironmentData(WORKER_SELECTION_KEY, Object.freeze({ ...selection }));
			published = true;
		}
		return selection;
	};
}
function runtimeSelector() {
	return resolveGlobalSingleton(Symbol.for("openclaw.bunSqliteLibrarySelection"), createRuntimeSelector);
}
function capabilities() {
	const select = runtimeSelector();
	return select.capabilities ??= createCapabilities(select);
}
function getSqliteRuntimeCapabilities() {
	return capabilities().get();
}
/** A topology owner keeps this snapshot for placement and paired native retirement. */
function captureSqliteWorkerClosePolicy() {
	return capabilities().capture();
}
/** Retained supervisors forward the caller's current facts when creating each descendant. */
function captureSqliteWorkerEnvironmentData() {
	return [
		[WORKER_SELECTION_KEY, ensureSqliteLibrarySelected()],
		[WORKER_CAPABILITIES_KEY, getSqliteRuntimeCapabilities()],
		[SQLITE_NATIVE_RUNTIME_ADMISSION_KEY, getEnvironmentData(SQLITE_NATIVE_RUNTIME_ADMISSION_KEY)],
		[SQLITE_EXPECTED_SCHEMA_CONTRACTS_KEY, getEnvironmentData(SQLITE_EXPECTED_SCHEMA_CONTRACTS_KEY)],
		[SQLITE_DATABASE_ADMISSIONS_KEY, getEnvironmentData(SQLITE_DATABASE_ADMISSIONS_KEY)]
	];
}
/** Select once, before any SQLite open; shared across CLI and bundled SDK module graphs. */
function ensureSqliteLibrarySelected(options) {
	return runtimeSelector()(options);
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/util/object-utils.js
function isUndefined(obj) {
	return typeof obj === "undefined" || obj === void 0;
}
function isString(obj) {
	return typeof obj === "string";
}
function isNumber(obj) {
	return typeof obj === "number";
}
function isBoolean(obj) {
	return typeof obj === "boolean";
}
function isNull(obj) {
	return obj === null;
}
function isDate(obj) {
	return obj instanceof Date;
}
function isBigInt(obj) {
	return typeof obj === "bigint";
}
function isFunction(obj) {
	return typeof obj === "function";
}
function isObject(obj) {
	return typeof obj === "object" && obj !== null;
}
function freeze(obj) {
	return Object.freeze(obj);
}
function asArray(arg) {
	if (isReadonlyArray(arg)) return arg;
	else return [arg];
}
function isReadonlyArray(arg) {
	return Array.isArray(arg);
}
function noop(obj) {
	return obj;
}
function getMessage(error) {
	return error instanceof Error ? error.message : String(error);
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/alter-table-node.js
/**
* @internal
*/
const AlterTableNode = freeze({
	is(node) {
		return node.kind === "AlterTableNode";
	},
	create(table) {
		return freeze({
			kind: "AlterTableNode",
			table
		});
	},
	cloneWithTableProps(node, props) {
		return freeze({
			...node,
			...props
		});
	},
	cloneWithColumnAlteration(node, columnAlteration) {
		return freeze({
			...node,
			columnAlterations: node.columnAlterations ? [...node.columnAlterations, columnAlteration] : [columnAlteration]
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/identifier-node.js
/**
* @internal
*/
const IdentifierNode = freeze({
	is(node) {
		return node.kind === "IdentifierNode";
	},
	create(name) {
		return freeze({
			kind: "IdentifierNode",
			name
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/create-index-node.js
/**
* @internal
*/
const CreateIndexNode = freeze({
	is(node) {
		return node.kind === "CreateIndexNode";
	},
	create(name) {
		return freeze({
			kind: "CreateIndexNode",
			name: IdentifierNode.create(name)
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	},
	cloneWithColumns(node, columns) {
		return freeze({
			...node,
			columns: [...node.columns || [], ...columns]
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/create-schema-node.js
/**
* @internal
*/
const CreateSchemaNode = freeze({
	is(node) {
		return node.kind === "CreateSchemaNode";
	},
	create(schema, params) {
		return freeze({
			kind: "CreateSchemaNode",
			schema: IdentifierNode.create(schema),
			...params
		});
	},
	cloneWith(createSchema, params) {
		return freeze({
			...createSchema,
			...params
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/create-table-node.js
const ON_COMMIT_ACTIONS = [
	"preserve rows",
	"delete rows",
	"drop"
];
/**
* @internal
*/
const CreateTableNode = freeze({
	is(node) {
		return node.kind === "CreateTableNode";
	},
	create(table) {
		return freeze({
			kind: "CreateTableNode",
			table,
			columns: freeze([])
		});
	},
	cloneWithColumn(node, column) {
		return freeze({
			...node,
			columns: freeze([...node.columns, column])
		});
	},
	cloneWithConstraint(node, constraint) {
		return freeze({
			...node,
			constraints: node.constraints ? freeze([...node.constraints, constraint]) : freeze([constraint])
		});
	},
	cloneWithIndex(node, index) {
		return freeze({
			...node,
			indexes: node.indexes ? freeze([...node.indexes, index]) : freeze([index])
		});
	},
	cloneWithFrontModifier(node, modifier) {
		return freeze({
			...node,
			frontModifiers: node.frontModifiers ? freeze([...node.frontModifiers, modifier]) : freeze([modifier])
		});
	},
	cloneWithEndModifier(node, modifier) {
		return freeze({
			...node,
			endModifiers: node.endModifiers ? freeze([...node.endModifiers, modifier]) : freeze([modifier])
		});
	},
	cloneWith(node, params) {
		return freeze({
			...node,
			...params
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/schemable-identifier-node.js
/**
* @internal
*/
const SchemableIdentifierNode = freeze({
	is(node) {
		return node.kind === "SchemableIdentifierNode";
	},
	create(identifier) {
		return freeze({
			kind: "SchemableIdentifierNode",
			identifier: IdentifierNode.create(identifier)
		});
	},
	createWithSchema(schema, identifier) {
		return freeze({
			kind: "SchemableIdentifierNode",
			schema: IdentifierNode.create(schema),
			identifier: IdentifierNode.create(identifier)
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/drop-index-node.js
/**
* @internal
*/
const DropIndexNode = freeze({
	is(node) {
		return node.kind === "DropIndexNode";
	},
	create(name, params) {
		return freeze({
			kind: "DropIndexNode",
			name: SchemableIdentifierNode.create(name),
			...params
		});
	},
	cloneWith(dropIndex, props) {
		return freeze({
			...dropIndex,
			...props
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/drop-schema-node.js
/**
* @internal
*/
const DropSchemaNode = freeze({
	is(node) {
		return node.kind === "DropSchemaNode";
	},
	create(schema, params) {
		return freeze({
			kind: "DropSchemaNode",
			schema: IdentifierNode.create(schema),
			...params
		});
	},
	cloneWith(dropSchema, params) {
		return freeze({
			...dropSchema,
			...params
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/drop-table-node.js
/**
* @internal
*/
const DropTableNode = freeze({
	is(node) {
		return node.kind === "DropTableNode";
	},
	create(table, params) {
		return freeze({
			kind: "DropTableNode",
			table,
			...params
		});
	},
	cloneWith(dropIndex, params) {
		return freeze({
			...dropIndex,
			...params
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/alias-node.js
/**
* @internal
*/
const AliasNode = freeze({
	is(node) {
		return node.kind === "AliasNode";
	},
	create(node, alias) {
		return freeze({
			kind: "AliasNode",
			node,
			alias
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/table-node.js
/**
* @internal
*/
const TableNode = freeze({
	is(node) {
		return node.kind === "TableNode";
	},
	create(table) {
		return freeze({
			kind: "TableNode",
			table: SchemableIdentifierNode.create(table)
		});
	},
	createWithSchema(schema, table) {
		return freeze({
			kind: "TableNode",
			table: SchemableIdentifierNode.createWithSchema(schema, table)
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/operation-node-source.js
function isOperationNodeSource(obj) {
	return isObject(obj) && isFunction(obj.toOperationNode);
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/expression/expression.js
function isExpression(obj) {
	return isObject(obj) && "expressionType" in obj && isOperationNodeSource(obj);
}
function isAliasedExpression(obj) {
	return isObject(obj) && "expression" in obj && isString(obj.alias) && isOperationNodeSource(obj);
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/select-modifier-node.js
/**
* @internal
*/
const SelectModifierNode = freeze({
	is(node) {
		return node.kind === "SelectModifierNode";
	},
	create(modifier, of) {
		return freeze({
			kind: "SelectModifierNode",
			modifier,
			of
		});
	},
	createWithExpression(modifier) {
		return freeze({
			kind: "SelectModifierNode",
			rawModifier: modifier
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/and-node.js
/**
* @internal
*/
const AndNode = freeze({
	is(node) {
		return node.kind === "AndNode";
	},
	create(left, right) {
		return freeze({
			kind: "AndNode",
			left,
			right
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/or-node.js
/**
* @internal
*/
const OrNode = freeze({
	is(node) {
		return node.kind === "OrNode";
	},
	create(left, right) {
		return freeze({
			kind: "OrNode",
			left,
			right
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/on-node.js
/**
* @internal
*/
const OnNode = freeze({
	is(node) {
		return node.kind === "OnNode";
	},
	create(filter) {
		return freeze({
			kind: "OnNode",
			on: filter
		});
	},
	cloneWithOperation(onNode, operator, operation) {
		return freeze({
			...onNode,
			on: operator === "And" ? AndNode.create(onNode.on, operation) : OrNode.create(onNode.on, operation)
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/join-node.js
/**
* @internal
*/
const JoinNode = freeze({
	is(node) {
		return node.kind === "JoinNode";
	},
	create(joinType, table) {
		return freeze({
			kind: "JoinNode",
			joinType,
			table,
			on: void 0
		});
	},
	createWithOn(joinType, table, on) {
		return freeze({
			kind: "JoinNode",
			joinType,
			table,
			on: OnNode.create(on)
		});
	},
	cloneWithOn(joinNode, operation) {
		return freeze({
			...joinNode,
			on: joinNode.on ? OnNode.cloneWithOperation(joinNode.on, "And", operation) : OnNode.create(operation)
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/binary-operation-node.js
/**
* @internal
*/
const BinaryOperationNode = freeze({
	is(node) {
		return node.kind === "BinaryOperationNode";
	},
	create(leftOperand, operator, rightOperand) {
		return freeze({
			kind: "BinaryOperationNode",
			leftOperand,
			operator,
			rightOperand
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/operator-node.js
const COMPARISON_OPERATORS_DICTIONARY = freeze({
	"=": true,
	"==": true,
	"!=": true,
	"<>": true,
	">": true,
	">=": true,
	"<": true,
	"<=": true,
	in: true,
	"not in": true,
	is: true,
	"is not": true,
	like: true,
	"not like": true,
	match: true,
	ilike: true,
	"not ilike": true,
	"@>": true,
	"<@": true,
	"^@": true,
	"&&": true,
	"?": true,
	"?&": true,
	"?|": true,
	"!<": true,
	"!>": true,
	"<=>": true,
	"!~": true,
	"~": true,
	"~*": true,
	"!~*": true,
	"@@": true,
	"@@@": true,
	"!!": true,
	"<->": true,
	regexp: true,
	"is distinct from": true,
	"is not distinct from": true
});
Object.keys(COMPARISON_OPERATORS_DICTIONARY);
const ARITHMETIC_OPERATORS_DICTIONARY = freeze({
	"+": true,
	"-": true,
	"*": true,
	"/": true,
	"%": true,
	"^": true,
	"&": true,
	"|": true,
	"#": true,
	"<<": true,
	">>": true
});
Object.keys(ARITHMETIC_OPERATORS_DICTIONARY);
const JSON_OPERATORS_DICTIONARY = freeze({
	"->": true,
	"->>": true
});
/**
* @deprecated will be removed in version 0.30.x
*/
const JSON_OPERATORS = Object.keys(JSON_OPERATORS_DICTIONARY);
const BINARY_OPERATORS_DICTIONARY = freeze({
	...COMPARISON_OPERATORS_DICTIONARY,
	...ARITHMETIC_OPERATORS_DICTIONARY,
	"||": true
});
/**
* @deprecated will be removed in version 0.30.x
*/
const BINARY_OPERATORS = Object.keys(BINARY_OPERATORS_DICTIONARY);
const UNARY_FILTER_OPERATORS_DICTIONARY = freeze({
	exists: true,
	"not exists": true
});
Object.keys(UNARY_FILTER_OPERATORS_DICTIONARY);
const UNARY_OPERATORS_DICTIONARY = freeze({
	...UNARY_FILTER_OPERATORS_DICTIONARY,
	"-": true,
	not: true
});
/**
* @deprecated will be removed in version 0.30.x
*/
const UNARY_OPERATORS = Object.keys(UNARY_OPERATORS_DICTIONARY);
[
	...BINARY_OPERATORS,
	...JSON_OPERATORS,
	...UNARY_OPERATORS
];
/**
* @internal
*/
const OperatorNode = freeze({
	is(node) {
		return node.kind === "OperatorNode";
	},
	create(operator) {
		return freeze({
			kind: "OperatorNode",
			operator
		});
	}
});
function isBinaryOperator(op) {
	return isString(op) && BINARY_OPERATORS_DICTIONARY[op];
}
function isJSONOperator(op) {
	return isString(op) && JSON_OPERATORS_DICTIONARY[op];
}
function isUnaryOperator(op) {
	return isString(op) && UNARY_OPERATORS_DICTIONARY[op];
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/column-node.js
/**
* @internal
*/
const ColumnNode = freeze({
	is(node) {
		return node.kind === "ColumnNode";
	},
	create(column) {
		return freeze({
			kind: "ColumnNode",
			column: IdentifierNode.create(column)
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/select-all-node.js
/**
* @internal
*/
const SelectAllNode = freeze({
	is(node) {
		return node.kind === "SelectAllNode";
	},
	create() {
		return freeze({ kind: "SelectAllNode" });
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/reference-node.js
/**
* @internal
*/
const ReferenceNode = freeze({
	is(node) {
		return node.kind === "ReferenceNode";
	},
	create(column, table) {
		return freeze({
			kind: "ReferenceNode",
			table,
			column
		});
	},
	createSelectAll(table) {
		return freeze({
			kind: "ReferenceNode",
			table,
			column: SelectAllNode.create()
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/dynamic/dynamic-reference-builder.js
var DynamicReferenceBuilder = class {
	#dynamicReference;
	get dynamicReference() {
		return this.#dynamicReference;
	}
	/**
	* @private
	*
	* This needs to be here just so that the typings work. Without this
	* the generated .d.ts file contains no reference to the type param R
	* which causes this type to be equal to DynamicReferenceBuilder with
	* any R.
	*/
	get refType() {}
	constructor(reference) {
		this.#dynamicReference = reference;
	}
	toOperationNode() {
		return parseSimpleReferenceExpression(this.#dynamicReference);
	}
};
function isDynamicReferenceBuilder(obj) {
	return isObject(obj) && isOperationNodeSource(obj) && isString(obj.dynamicReference);
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/order-by-item-node.js
/**
* @internal
*/
const OrderByItemNode = freeze({
	is(node) {
		return node.kind === "OrderByItemNode";
	},
	create(orderBy, direction) {
		return freeze({
			kind: "OrderByItemNode",
			orderBy,
			direction
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/raw-node.js
/**
* @internal
*/
const RawNode = freeze({
	is(node) {
		return node.kind === "RawNode";
	},
	create(sqlFragments, parameters) {
		return freeze({
			kind: "RawNode",
			sqlFragments: freeze(sqlFragments),
			parameters: freeze(parameters)
		});
	},
	createWithSql(sql) {
		return RawNode.create([sql], []);
	},
	createWithChild(child) {
		return RawNode.create(["", ""], [child]);
	},
	createWithChildren(children) {
		return RawNode.create(new Array(children.length + 1).fill(""), children);
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/collate-node.js
/**
* @internal
*/
const CollateNode = freeze({
	is(node) {
		return node.kind === "CollateNode";
	},
	create(collation) {
		return freeze({
			kind: "CollateNode",
			collation: IdentifierNode.create(collation)
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/query-builder/order-by-item-builder.js
var OrderByItemBuilder = class OrderByItemBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Adds `desc` to the `order by` item.
	*
	* See {@link asc} for the opposite.
	*/
	desc() {
		return new OrderByItemBuilder({ node: OrderByItemNode.cloneWith(this.#props.node, { direction: RawNode.createWithSql("desc") }) });
	}
	/**
	* Adds `asc` to the `order by` item.
	*
	* See {@link desc} for the opposite.
	*/
	asc() {
		return new OrderByItemBuilder({ node: OrderByItemNode.cloneWith(this.#props.node, { direction: RawNode.createWithSql("asc") }) });
	}
	/**
	* Adds `nulls last` to the `order by` item.
	*
	* This is only supported by some dialects like PostgreSQL and SQLite.
	*
	* See {@link nullsFirst} for the opposite.
	*/
	nullsLast() {
		return new OrderByItemBuilder({ node: OrderByItemNode.cloneWith(this.#props.node, { nulls: "last" }) });
	}
	/**
	* Adds `nulls first` to the `order by` item.
	*
	* This is only supported by some dialects like PostgreSQL and SQLite.
	*
	* See {@link nullsLast} for the opposite.
	*/
	nullsFirst() {
		return new OrderByItemBuilder({ node: OrderByItemNode.cloneWith(this.#props.node, { nulls: "first" }) });
	}
	/**
	* Adds `collate <collationName>` to the `order by` item.
	*/
	collate(collation) {
		return new OrderByItemBuilder({ node: OrderByItemNode.cloneWith(this.#props.node, { collation: CollateNode.create(collation) }) });
	}
	toOperationNode() {
		return this.#props.node;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/util/log-once.js
const LOGGED_MESSAGES = /* @__PURE__ */ new Set();
/**
* Use for system-level logging, such as deprecation messages.
* Logs a message and ensures it won't be logged again.
*/
function logOnce(message) {
	if (LOGGED_MESSAGES.has(message)) return;
	LOGGED_MESSAGES.add(message);
	console.log(message);
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/parser/order-by-parser.js
function isOrderByDirection(thing) {
	return thing === "asc" || thing === "desc";
}
function parseOrderBy(args) {
	if (args.length === 2) return [parseOrderByItem(args[0], args[1])];
	if (args.length === 1) {
		const [orderBy] = args;
		if (Array.isArray(orderBy)) {
			logOnce("orderBy(array) is deprecated, use multiple orderBy calls instead.");
			return orderBy.map((item) => parseOrderByItem(item));
		}
		return [parseOrderByItem(orderBy)];
	}
	throw new Error(`Invalid number of arguments at order by! expected 1-2, received ${args.length}`);
}
function parseOrderByItem(expr, modifiers) {
	const parsedRef = parseOrderByExpression(expr);
	if (OrderByItemNode.is(parsedRef)) {
		if (modifiers) throw new Error("Cannot specify direction twice!");
		return parsedRef;
	}
	return parseOrderByWithModifiers(parsedRef, modifiers);
}
function parseOrderByExpression(expr) {
	if (isExpressionOrFactory(expr)) return parseExpression(expr);
	if (isDynamicReferenceBuilder(expr)) return expr.toOperationNode();
	const [ref, direction] = expr.split(" ");
	if (direction) {
		logOnce("`orderBy('column asc')` is deprecated. Use `orderBy('column', 'asc')` instead.");
		return parseOrderByWithModifiers(parseStringReference(ref), direction);
	}
	return parseStringReference(expr);
}
function parseOrderByWithModifiers(expr, modifiers) {
	if (typeof modifiers === "string") {
		if (!isOrderByDirection(modifiers)) throw new Error(`Invalid order by direction: ${modifiers}`);
		return OrderByItemNode.create(expr, RawNode.createWithSql(modifiers));
	}
	if (isExpression(modifiers)) {
		logOnce("`orderBy(..., expr)` is deprecated. Use `orderBy(..., 'asc')` or `orderBy(..., (ob) => ...)` instead.");
		return OrderByItemNode.create(expr, modifiers.toOperationNode());
	}
	const node = OrderByItemNode.create(expr);
	if (!modifiers) return node;
	return modifiers(new OrderByItemBuilder({ node })).toOperationNode();
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/json-reference-node.js
/**
* @internal
*/
const JSONReferenceNode = freeze({
	is(node) {
		return node.kind === "JSONReferenceNode";
	},
	create(reference, traversal) {
		return freeze({
			kind: "JSONReferenceNode",
			reference,
			traversal
		});
	},
	cloneWithTraversal(node, traversal) {
		return freeze({
			...node,
			traversal
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/json-operator-chain-node.js
/**
* @internal
*/
const JSONOperatorChainNode = freeze({
	is(node) {
		return node.kind === "JSONOperatorChainNode";
	},
	create(operator) {
		return freeze({
			kind: "JSONOperatorChainNode",
			operator,
			values: freeze([])
		});
	},
	cloneWithValue(node, value) {
		return freeze({
			...node,
			values: freeze([...node.values, value])
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/json-path-node.js
/**
* @internal
*/
const JSONPathNode = freeze({
	is(node) {
		return node.kind === "JSONPathNode";
	},
	create(inOperator) {
		return freeze({
			kind: "JSONPathNode",
			inOperator,
			pathLegs: freeze([])
		});
	},
	cloneWithLeg(jsonPathNode, pathLeg) {
		return freeze({
			...jsonPathNode,
			pathLegs: freeze([...jsonPathNode.pathLegs, pathLeg])
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/parser/reference-parser.js
function parseSimpleReferenceExpression(exp) {
	if (isString(exp)) return parseStringReference(exp);
	return exp.toOperationNode();
}
function parseReferenceExpressionOrList(arg) {
	if (isReadonlyArray(arg)) return arg.map((it) => parseReferenceExpression(it));
	else return [parseReferenceExpression(arg)];
}
function parseReferenceExpression(exp) {
	if (isExpressionOrFactory(exp)) return parseExpression(exp);
	return parseSimpleReferenceExpression(exp);
}
function parseJSONReference(ref, op) {
	if (isJSONOperator(op)) return JSONReferenceNode.create(parseStringReference(ref), JSONOperatorChainNode.create(OperatorNode.create(op)));
	if (op === "->$" || op === "->>$") return JSONReferenceNode.create(parseStringReference(ref), JSONPathNode.create(OperatorNode.create(op.slice(0, -1))));
	throw new Error(`Invalid JSON operator: ${op}`);
}
function parseStringReference(ref) {
	const COLUMN_SEPARATOR = ".";
	if (!ref.includes(COLUMN_SEPARATOR)) return ReferenceNode.create(ColumnNode.create(ref));
	const parts = ref.split(COLUMN_SEPARATOR).map(trim$2);
	if (parts.length === 3) return parseStringReferenceWithTableAndSchema(parts);
	if (parts.length === 2) return parseStringReferenceWithTable(parts);
	throw new Error(`invalid column reference ${ref}`);
}
function parseAliasedStringReference(ref) {
	const ALIAS_SEPARATOR = " as ";
	if (ref.includes(ALIAS_SEPARATOR)) {
		const [columnRef, alias] = ref.split(ALIAS_SEPARATOR).map(trim$2);
		return AliasNode.create(parseStringReference(columnRef), IdentifierNode.create(alias));
	} else return parseStringReference(ref);
}
function parseColumnName(column) {
	return ColumnNode.create(column);
}
function parseOrderedColumnName(column) {
	const ORDER_SEPARATOR = " ";
	if (column.includes(ORDER_SEPARATOR)) {
		const [columnName, order] = column.split(ORDER_SEPARATOR).map(trim$2);
		if (!isOrderByDirection(order)) throw new Error(`invalid order direction "${order}" next to "${columnName}"`);
		return parseOrderBy([columnName, order])[0];
	} else return parseColumnName(column);
}
function parseStringReferenceWithTableAndSchema(parts) {
	const [schema, table, column] = parts;
	return ReferenceNode.create(ColumnNode.create(column), TableNode.createWithSchema(schema, table));
}
function parseStringReferenceWithTable(parts) {
	const [table, column] = parts;
	return ReferenceNode.create(ColumnNode.create(column), TableNode.create(table));
}
function trim$2(str) {
	return str.trim();
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/primitive-value-list-node.js
/**
* @internal
*/
const PrimitiveValueListNode = freeze({
	is(node) {
		return node.kind === "PrimitiveValueListNode";
	},
	create(values) {
		return freeze({
			kind: "PrimitiveValueListNode",
			values: freeze([...values])
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/value-list-node.js
/**
* @internal
*/
const ValueListNode = freeze({
	is(node) {
		return node.kind === "ValueListNode";
	},
	create(values) {
		return freeze({
			kind: "ValueListNode",
			values: freeze(values)
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/value-node.js
/**
* @internal
*/
const ValueNode = freeze({
	is(node) {
		return node.kind === "ValueNode";
	},
	create(value) {
		return freeze({
			kind: "ValueNode",
			value
		});
	},
	createImmediate(value) {
		return freeze({
			kind: "ValueNode",
			value,
			immediate: true
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/parser/value-parser.js
function parseValueExpressionOrList(arg) {
	if (isReadonlyArray(arg)) return parseValueExpressionList(arg);
	return parseValueExpression(arg);
}
function parseValueExpression(exp) {
	if (isExpressionOrFactory(exp)) return parseExpression(exp);
	return ValueNode.create(exp);
}
function isSafeImmediateValue(value) {
	return isNumber(value) || isBoolean(value) || isNull(value);
}
function parseSafeImmediateValue(value) {
	if (!isSafeImmediateValue(value)) throw new Error(`unsafe immediate value ${JSON.stringify(value)}`);
	return ValueNode.createImmediate(value);
}
function parseValueExpressionList(arg) {
	if (arg.some(isExpressionOrFactory)) return ValueListNode.create(arg.map((it) => parseValueExpression(it)));
	return PrimitiveValueListNode.create(arg);
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/parens-node.js
/**
* @internal
*/
const ParensNode = freeze({
	is(node) {
		return node.kind === "ParensNode";
	},
	create(node) {
		return freeze({
			kind: "ParensNode",
			node
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/parser/binary-operation-parser.js
function parseValueBinaryOperationOrExpression(args) {
	if (args.length === 3) return parseValueBinaryOperation(args[0], args[1], args[2]);
	else if (args.length === 1) return parseValueExpression(args[0]);
	throw new Error(`invalid arguments: ${JSON.stringify(args)}`);
}
function parseValueBinaryOperation(left, operator, right) {
	if (isIsOperator(operator) && needsIsOperator(right)) return BinaryOperationNode.create(parseReferenceExpression(left), parseBinaryOperator(operator), ValueNode.createImmediate(right));
	return BinaryOperationNode.create(parseReferenceExpression(left), parseBinaryOperator(operator), parseValueExpressionOrList(right));
}
function parseReferentialBinaryOperation(left, operator, right) {
	return BinaryOperationNode.create(parseReferenceExpression(left), parseBinaryOperator(operator), parseReferenceExpression(right));
}
function parseFilterObject(obj, combinator) {
	return parseFilterList(Object.entries(obj).filter(([, v]) => !isUndefined(v)).map(([k, v]) => parseValueBinaryOperation(k, needsIsOperator(v) ? "is" : "=", v)), combinator);
}
function parseFilterList(list, combinator, withParens = true) {
	const combine = combinator === "and" ? AndNode.create : OrNode.create;
	if (list.length === 0) return BinaryOperationNode.create(ValueNode.createImmediate(1), OperatorNode.create("="), ValueNode.createImmediate(combinator === "and" ? 1 : 0));
	let node = toOperationNode(list[0]);
	for (let i = 1; i < list.length; ++i) node = combine(node, toOperationNode(list[i]));
	if (list.length > 1 && withParens) return ParensNode.create(node);
	return node;
}
function isIsOperator(operator) {
	return operator === "is" || operator === "is not";
}
function needsIsOperator(value) {
	return isNull(value) || isBoolean(value);
}
function parseBinaryOperator(operator) {
	if (isBinaryOperator(operator)) return OperatorNode.create(operator);
	if (isOperationNodeSource(operator)) return operator.toOperationNode();
	throw new Error(`invalid operator ${JSON.stringify(operator)}`);
}
function toOperationNode(nodeOrSource) {
	return isOperationNodeSource(nodeOrSource) ? nodeOrSource.toOperationNode() : nodeOrSource;
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/order-by-node.js
/**
* @internal
*/
const OrderByNode = freeze({
	is(node) {
		return node.kind === "OrderByNode";
	},
	create(items) {
		return freeze({
			kind: "OrderByNode",
			items: freeze([...items])
		});
	},
	cloneWithItems(orderBy, items) {
		return freeze({
			...orderBy,
			items: freeze([...orderBy.items, ...items])
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/partition-by-node.js
/**
* @internal
*/
const PartitionByNode = freeze({
	is(node) {
		return node.kind === "PartitionByNode";
	},
	create(items) {
		return freeze({
			kind: "PartitionByNode",
			items: freeze(items)
		});
	},
	cloneWithItems(partitionBy, items) {
		return freeze({
			...partitionBy,
			items: freeze([...partitionBy.items, ...items])
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/over-node.js
/**
* @internal
*/
const OverNode = freeze({
	is(node) {
		return node.kind === "OverNode";
	},
	create() {
		return freeze({ kind: "OverNode" });
	},
	cloneWithOrderByItems(overNode, items) {
		return freeze({
			...overNode,
			orderBy: overNode.orderBy ? OrderByNode.cloneWithItems(overNode.orderBy, items) : OrderByNode.create(items)
		});
	},
	cloneWithPartitionByItems(overNode, items) {
		return freeze({
			...overNode,
			partitionBy: overNode.partitionBy ? PartitionByNode.cloneWithItems(overNode.partitionBy, items) : PartitionByNode.create(items)
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/from-node.js
/**
* @internal
*/
const FromNode = freeze({
	is(node) {
		return node.kind === "FromNode";
	},
	create(froms) {
		return freeze({
			kind: "FromNode",
			froms: freeze(froms)
		});
	},
	cloneWithFroms(from, froms) {
		return freeze({
			...from,
			froms: freeze([...from.froms, ...froms])
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/group-by-node.js
/**
* @internal
*/
const GroupByNode = freeze({
	is(node) {
		return node.kind === "GroupByNode";
	},
	create(items) {
		return freeze({
			kind: "GroupByNode",
			items: freeze(items)
		});
	},
	cloneWithItems(groupBy, items) {
		return freeze({
			...groupBy,
			items: freeze([...groupBy.items, ...items])
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/having-node.js
/**
* @internal
*/
const HavingNode = freeze({
	is(node) {
		return node.kind === "HavingNode";
	},
	create(filter) {
		return freeze({
			kind: "HavingNode",
			having: filter
		});
	},
	cloneWithOperation(havingNode, operator, operation) {
		return freeze({
			...havingNode,
			having: operator === "And" ? AndNode.create(havingNode.having, operation) : OrNode.create(havingNode.having, operation)
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/insert-query-node.js
/**
* @internal
*/
const InsertQueryNode = freeze({
	is(node) {
		return node.kind === "InsertQueryNode";
	},
	create(into, withNode, replace) {
		return freeze({
			kind: "InsertQueryNode",
			into,
			...withNode && { with: withNode },
			replace
		});
	},
	createWithoutInto() {
		return freeze({ kind: "InsertQueryNode" });
	},
	cloneWith(insertQuery, props) {
		return freeze({
			...insertQuery,
			...props
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/list-node.js
/**
* @internal
*/
const ListNode = freeze({
	is(node) {
		return node.kind === "ListNode";
	},
	create(items) {
		return freeze({
			kind: "ListNode",
			items: freeze(items)
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/update-query-node.js
/**
* @internal
*/
const UpdateQueryNode = freeze({
	is(node) {
		return node.kind === "UpdateQueryNode";
	},
	create(tables, withNode) {
		return freeze({
			kind: "UpdateQueryNode",
			table: tables.length === 1 ? tables[0] : ListNode.create(tables),
			...withNode && { with: withNode }
		});
	},
	createWithoutTable() {
		return freeze({ kind: "UpdateQueryNode" });
	},
	cloneWithFromItems(updateQuery, fromItems) {
		return freeze({
			...updateQuery,
			from: updateQuery.from ? FromNode.cloneWithFroms(updateQuery.from, fromItems) : FromNode.create(fromItems)
		});
	},
	cloneWithUpdates(updateQuery, updates) {
		return freeze({
			...updateQuery,
			updates: updateQuery.updates ? freeze([...updateQuery.updates, ...updates]) : updates
		});
	},
	cloneWithLimit(updateQuery, limit) {
		return freeze({
			...updateQuery,
			limit
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/using-node.js
/**
* @internal
*/
const UsingNode = freeze({
	is(node) {
		return node.kind === "UsingNode";
	},
	create(tables) {
		return freeze({
			kind: "UsingNode",
			tables: freeze(tables)
		});
	},
	cloneWithTables(using, tables) {
		return freeze({
			...using,
			tables: freeze([...using.tables, ...tables])
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/delete-query-node.js
/**
* @internal
*/
const DeleteQueryNode = freeze({
	is(node) {
		return node.kind === "DeleteQueryNode";
	},
	create(fromItems, withNode) {
		return freeze({
			kind: "DeleteQueryNode",
			from: FromNode.create(fromItems),
			...withNode && { with: withNode }
		});
	},
	/**
	* @deprecated Use `QueryNode.cloneWithoutOrderBy` instead.
	*/
	cloneWithOrderByItems: (node, items) => QueryNode.cloneWithOrderByItems(node, items),
	/**
	* @deprecated Use `QueryNode.cloneWithoutOrderBy` instead.
	*/
	cloneWithoutOrderBy: (node) => QueryNode.cloneWithoutOrderBy(node),
	cloneWithLimit(deleteNode, limit) {
		return freeze({
			...deleteNode,
			limit
		});
	},
	cloneWithoutLimit(deleteNode) {
		return freeze({
			...deleteNode,
			limit: void 0
		});
	},
	cloneWithUsing(deleteNode, tables) {
		return freeze({
			...deleteNode,
			using: deleteNode.using !== void 0 ? UsingNode.cloneWithTables(deleteNode.using, tables) : UsingNode.create(tables)
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/where-node.js
/**
* @internal
*/
const WhereNode = freeze({
	is(node) {
		return node.kind === "WhereNode";
	},
	create(filter) {
		return freeze({
			kind: "WhereNode",
			where: filter
		});
	},
	cloneWithOperation(whereNode, operator, operation) {
		return freeze({
			...whereNode,
			where: operator === "And" ? AndNode.create(whereNode.where, operation) : OrNode.create(whereNode.where, operation)
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/returning-node.js
/**
* @internal
*/
const ReturningNode = freeze({
	is(node) {
		return node.kind === "ReturningNode";
	},
	create(selections) {
		return freeze({
			kind: "ReturningNode",
			selections: freeze(selections)
		});
	},
	cloneWithSelections(returning, selections) {
		return freeze({
			...returning,
			selections: returning.selections ? freeze([...returning.selections, ...selections]) : freeze(selections)
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/explain-node.js
/**
* @internal
*/
const ExplainNode = freeze({
	is(node) {
		return node.kind === "ExplainNode";
	},
	create(format, options) {
		return freeze({
			kind: "ExplainNode",
			format,
			options
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/when-node.js
/**
* @internal
*/
const WhenNode = freeze({
	is(node) {
		return node.kind === "WhenNode";
	},
	create(condition) {
		return freeze({
			kind: "WhenNode",
			condition
		});
	},
	cloneWithResult(whenNode, result) {
		return freeze({
			...whenNode,
			result
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/merge-query-node.js
/**
* @internal
*/
const MergeQueryNode = freeze({
	is(node) {
		return node.kind === "MergeQueryNode";
	},
	create(into, withNode) {
		return freeze({
			kind: "MergeQueryNode",
			into,
			...withNode && { with: withNode }
		});
	},
	cloneWithUsing(mergeNode, using) {
		return freeze({
			...mergeNode,
			using
		});
	},
	cloneWithWhen(mergeNode, when) {
		return freeze({
			...mergeNode,
			whens: mergeNode.whens ? freeze([...mergeNode.whens, when]) : freeze([when])
		});
	},
	cloneWithThen(mergeNode, then) {
		return freeze({
			...mergeNode,
			whens: mergeNode.whens ? freeze([...mergeNode.whens.slice(0, -1), WhenNode.cloneWithResult(mergeNode.whens[mergeNode.whens.length - 1], then)]) : void 0
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/output-node.js
/**
* @internal
*/
const OutputNode = freeze({
	is(node) {
		return node.kind === "OutputNode";
	},
	create(selections) {
		return freeze({
			kind: "OutputNode",
			selections: freeze(selections)
		});
	},
	cloneWithSelections(output, selections) {
		return freeze({
			...output,
			selections: output.selections ? freeze([...output.selections, ...selections]) : freeze(selections)
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/query-node.js
/**
* @internal
*/
const QueryNode = freeze({
	is(node) {
		return SelectQueryNode.is(node) || InsertQueryNode.is(node) || UpdateQueryNode.is(node) || DeleteQueryNode.is(node) || MergeQueryNode.is(node);
	},
	cloneWithEndModifier(node, modifier) {
		return freeze({
			...node,
			endModifiers: node.endModifiers ? freeze([...node.endModifiers, modifier]) : freeze([modifier])
		});
	},
	cloneWithWhere(node, operation) {
		return freeze({
			...node,
			where: node.where ? WhereNode.cloneWithOperation(node.where, "And", operation) : WhereNode.create(operation)
		});
	},
	cloneWithJoin(node, join) {
		return freeze({
			...node,
			joins: node.joins ? freeze([...node.joins, join]) : freeze([join])
		});
	},
	cloneWithReturning(node, selections) {
		return freeze({
			...node,
			returning: node.returning ? ReturningNode.cloneWithSelections(node.returning, selections) : ReturningNode.create(selections)
		});
	},
	cloneWithoutReturning(node) {
		return freeze({
			...node,
			returning: void 0
		});
	},
	cloneWithoutWhere(node) {
		return freeze({
			...node,
			where: void 0
		});
	},
	cloneWithExplain(node, format, options) {
		return freeze({
			...node,
			explain: ExplainNode.create(format, options?.toOperationNode())
		});
	},
	cloneWithTop(node, top) {
		return freeze({
			...node,
			top
		});
	},
	cloneWithOutput(node, selections) {
		return freeze({
			...node,
			output: node.output ? OutputNode.cloneWithSelections(node.output, selections) : OutputNode.create(selections)
		});
	},
	cloneWithOrderByItems(node, items) {
		return freeze({
			...node,
			orderBy: node.orderBy ? OrderByNode.cloneWithItems(node.orderBy, items) : OrderByNode.create(items)
		});
	},
	cloneWithoutOrderBy(node) {
		return freeze({
			...node,
			orderBy: void 0
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/select-query-node.js
/**
* @internal
*/
const SelectQueryNode = freeze({
	is(node) {
		return node.kind === "SelectQueryNode";
	},
	create(withNode) {
		return freeze({
			kind: "SelectQueryNode",
			...withNode && { with: withNode }
		});
	},
	createFrom(fromItems, withNode) {
		return freeze({
			kind: "SelectQueryNode",
			from: FromNode.create(fromItems),
			...withNode && { with: withNode }
		});
	},
	cloneWithSelections(select, selections) {
		return freeze({
			...select,
			selections: select.selections ? freeze([...select.selections, ...selections]) : freeze(selections)
		});
	},
	cloneWithDistinctOn(select, expressions) {
		return freeze({
			...select,
			distinctOn: select.distinctOn ? freeze([...select.distinctOn, ...expressions]) : freeze(expressions)
		});
	},
	cloneWithFrontModifier(select, modifier) {
		return freeze({
			...select,
			frontModifiers: select.frontModifiers ? freeze([...select.frontModifiers, modifier]) : freeze([modifier])
		});
	},
	/**
	* @deprecated Use `QueryNode.cloneWithoutOrderBy` instead.
	*/
	cloneWithOrderByItems: (node, items) => QueryNode.cloneWithOrderByItems(node, items),
	cloneWithGroupByItems(selectNode, items) {
		return freeze({
			...selectNode,
			groupBy: selectNode.groupBy ? GroupByNode.cloneWithItems(selectNode.groupBy, items) : GroupByNode.create(items)
		});
	},
	cloneWithLimit(selectNode, limit) {
		return freeze({
			...selectNode,
			limit
		});
	},
	cloneWithOffset(selectNode, offset) {
		return freeze({
			...selectNode,
			offset
		});
	},
	cloneWithFetch(selectNode, fetch) {
		return freeze({
			...selectNode,
			fetch
		});
	},
	cloneWithHaving(selectNode, operation) {
		return freeze({
			...selectNode,
			having: selectNode.having ? HavingNode.cloneWithOperation(selectNode.having, "And", operation) : HavingNode.create(operation)
		});
	},
	cloneWithSetOperations(selectNode, setOperations) {
		return freeze({
			...selectNode,
			setOperations: selectNode.setOperations ? freeze([...selectNode.setOperations, ...setOperations]) : freeze([...setOperations])
		});
	},
	cloneWithoutSelections(select) {
		return freeze({
			...select,
			selections: []
		});
	},
	cloneWithoutLimit(select) {
		return freeze({
			...select,
			limit: void 0
		});
	},
	cloneWithoutOffset(select) {
		return freeze({
			...select,
			offset: void 0
		});
	},
	/**
	* @deprecated Use `QueryNode.cloneWithoutOrderBy` instead.
	*/
	cloneWithoutOrderBy: (node) => QueryNode.cloneWithoutOrderBy(node),
	cloneWithoutGroupBy(select) {
		return freeze({
			...select,
			groupBy: void 0
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/query-builder/join-builder.js
var JoinBuilder = class JoinBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	on(...args) {
		return new JoinBuilder({
			...this.#props,
			joinNode: JoinNode.cloneWithOn(this.#props.joinNode, parseValueBinaryOperationOrExpression(args))
		});
	}
	/**
	* Just like {@link WhereInterface.whereRef} but adds an item to the join's
	* `on` clause instead.
	*
	* See {@link WhereInterface.whereRef} for documentation and examples.
	*/
	onRef(lhs, op, rhs) {
		return new JoinBuilder({
			...this.#props,
			joinNode: JoinNode.cloneWithOn(this.#props.joinNode, parseReferentialBinaryOperation(lhs, op, rhs))
		});
	}
	/**
	* Adds `on true`.
	*/
	onTrue() {
		return new JoinBuilder({
			...this.#props,
			joinNode: JoinNode.cloneWithOn(this.#props.joinNode, RawNode.createWithSql("true"))
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.joinNode;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/partition-by-item-node.js
/**
* @internal
*/
const PartitionByItemNode = freeze({
	is(node) {
		return node.kind === "PartitionByItemNode";
	},
	create(partitionBy) {
		return freeze({
			kind: "PartitionByItemNode",
			partitionBy
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/parser/partition-by-parser.js
function parsePartitionBy(partitionBy) {
	return parseReferenceExpressionOrList(partitionBy).map(PartitionByItemNode.create);
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/query-builder/over-builder.js
var OverBuilder = class OverBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	orderBy(...args) {
		return new OverBuilder({ overNode: OverNode.cloneWithOrderByItems(this.#props.overNode, parseOrderBy(args)) });
	}
	clearOrderBy() {
		return new OverBuilder({ overNode: QueryNode.cloneWithoutOrderBy(this.#props.overNode) });
	}
	partitionBy(partitionBy) {
		return new OverBuilder({ overNode: OverNode.cloneWithPartitionByItems(this.#props.overNode, parsePartitionBy(partitionBy)) });
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.overNode;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/selection-node.js
/**
* @internal
*/
const SelectionNode = freeze({
	is(node) {
		return node.kind === "SelectionNode";
	},
	create(selection) {
		return freeze({
			kind: "SelectionNode",
			selection
		});
	},
	createSelectAll() {
		return freeze({
			kind: "SelectionNode",
			selection: SelectAllNode.create()
		});
	},
	createSelectAllFromTable(table) {
		return freeze({
			kind: "SelectionNode",
			selection: ReferenceNode.createSelectAll(table)
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/parser/select-parser.js
function parseSelectArg(selection) {
	if (isFunction(selection)) return parseSelectArg(selection(expressionBuilder()));
	else if (isReadonlyArray(selection)) return selection.map((it) => parseSelectExpression(it));
	else return [parseSelectExpression(selection)];
}
function parseSelectExpression(selection) {
	if (isString(selection)) return SelectionNode.create(parseAliasedStringReference(selection));
	else if (isDynamicReferenceBuilder(selection)) return SelectionNode.create(selection.toOperationNode());
	else return SelectionNode.create(parseAliasedExpression(selection));
}
function parseSelectAll(table) {
	if (!table) return [SelectionNode.createSelectAll()];
	else if (Array.isArray(table)) return table.map(parseSelectAllArg);
	else return [parseSelectAllArg(table)];
}
function parseSelectAllArg(table) {
	if (isString(table)) return SelectionNode.createSelectAllFromTable(parseTable(table));
	throw new Error(`invalid value selectAll expression: ${JSON.stringify(table)}`);
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/values-node.js
/**
* @internal
*/
const ValuesNode = freeze({
	is(node) {
		return node.kind === "ValuesNode";
	},
	create(values) {
		return freeze({
			kind: "ValuesNode",
			values: freeze(values)
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/default-insert-value-node.js
/**
* @internal
*/
const DefaultInsertValueNode = freeze({
	is(node) {
		return node.kind === "DefaultInsertValueNode";
	},
	create() {
		return freeze({ kind: "DefaultInsertValueNode" });
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/parser/insert-values-parser.js
function parseInsertExpression(arg) {
	const objectOrList = isFunction(arg) ? arg(expressionBuilder()) : arg;
	return parseInsertColumnsAndValues(isReadonlyArray(objectOrList) ? objectOrList : freeze([objectOrList]));
}
function parseInsertColumnsAndValues(rows) {
	const columns = parseColumnNamesAndIndexes(rows);
	return [freeze([...columns.keys()].map(ColumnNode.create)), ValuesNode.create(rows.map((row) => parseRowValues(row, columns)))];
}
function parseColumnNamesAndIndexes(rows) {
	const columns = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const cols = Object.keys(row);
		for (const col of cols) if (!columns.has(col) && row[col] !== void 0) columns.set(col, columns.size);
	}
	return columns;
}
function parseRowValues(row, columns) {
	const rowColumns = Object.keys(row);
	const rowValues = Array.from({ length: columns.size });
	let hasUndefinedOrComplexColumns = false;
	let indexedRowColumns = rowColumns.length;
	for (const col of rowColumns) {
		const columnIdx = columns.get(col);
		if (isUndefined(columnIdx)) {
			indexedRowColumns--;
			continue;
		}
		const value = row[col];
		if (isUndefined(value) || isExpressionOrFactory(value)) hasUndefinedOrComplexColumns = true;
		rowValues[columnIdx] = value;
	}
	if (indexedRowColumns < columns.size || hasUndefinedOrComplexColumns) {
		const defaultValue = DefaultInsertValueNode.create();
		return ValueListNode.create(rowValues.map((it) => isUndefined(it) ? defaultValue : parseValueExpression(it)));
	}
	return PrimitiveValueListNode.create(rowValues);
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/column-update-node.js
/**
* @internal
*/
const ColumnUpdateNode = freeze({
	is(node) {
		return node.kind === "ColumnUpdateNode";
	},
	create(column, value) {
		return freeze({
			kind: "ColumnUpdateNode",
			column,
			value
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/parser/update-set-parser.js
function parseUpdate(...args) {
	if (args.length === 2) return [ColumnUpdateNode.create(parseReferenceExpression(args[0]), parseValueExpression(args[1]))];
	return parseUpdateObjectExpression(args[0]);
}
function parseUpdateObjectExpression(update) {
	const updateObj = isFunction(update) ? update(expressionBuilder()) : update;
	return Object.entries(updateObj).filter(([_, value]) => value !== void 0).map(([key, value]) => {
		return ColumnUpdateNode.create(ColumnNode.create(key), parseValueExpression(value));
	});
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/on-duplicate-key-node.js
/**
* @internal
*/
const OnDuplicateKeyNode = freeze({
	is(node) {
		return node.kind === "OnDuplicateKeyNode";
	},
	create(updates) {
		return freeze({
			kind: "OnDuplicateKeyNode",
			updates
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/query-builder/insert-result.js
/**
* The result of an insert query.
*
* If the table has an auto incrementing primary key {@link insertId} will hold
* the generated id on dialects that support it. For example PostgreSQL doesn't
* return the id by default and {@link insertId} is undefined. On PostgreSQL you
* need to use {@link ReturningInterface.returning} or {@link ReturningInterface.returningAll}
* to get out the inserted id.
*
* {@link numInsertedOrUpdatedRows} holds the number of (actually) inserted rows.
* On MySQL, updated rows are counted twice when using `on duplicate key update`.
*
* ### Examples
*
* ```ts
* import type { NewPerson } from 'type-editor' // imaginary module
*
* async function insertPerson(person: NewPerson) {
*   const result = await db
*     .insertInto('person')
*     .values(person)
*     .executeTakeFirstOrThrow()
*
*   console.log(result.insertId) // relevant on MySQL
*   console.log(result.numInsertedOrUpdatedRows) // always relevant
* }
* ```
*/
var InsertResult = class {
	/**
	* The auto incrementing primary key of the inserted row.
	*
	* This property can be undefined when the query contains an `on conflict`
	* clause that makes the query succeed even when nothing gets inserted.
	*
	* This property is always undefined on dialects like PostgreSQL that
	* don't return the inserted id by default. On those dialects you need
	* to use the {@link ReturningInterface.returning | returning} method.
	*/
	insertId;
	/**
	* Affected rows count.
	*/
	numInsertedOrUpdatedRows;
	constructor(insertId, numInsertedOrUpdatedRows) {
		this.insertId = insertId;
		this.numInsertedOrUpdatedRows = numInsertedOrUpdatedRows;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/query-builder/no-result-error.js
var NoResultError = class extends Error {
	/**
	* The operation node tree of the query that was executed.
	*/
	node;
	constructor(node) {
		super("no result");
		this.node = node;
	}
};
function isNoResultErrorConstructor(fn) {
	return Object.prototype.hasOwnProperty.call(fn, "prototype");
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/on-conflict-node.js
/**
* @internal
*/
const OnConflictNode = freeze({
	is(node) {
		return node.kind === "OnConflictNode";
	},
	create() {
		return freeze({ kind: "OnConflictNode" });
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	},
	cloneWithIndexWhere(node, operation) {
		return freeze({
			...node,
			indexWhere: node.indexWhere ? WhereNode.cloneWithOperation(node.indexWhere, "And", operation) : WhereNode.create(operation)
		});
	},
	cloneWithIndexOrWhere(node, operation) {
		return freeze({
			...node,
			indexWhere: node.indexWhere ? WhereNode.cloneWithOperation(node.indexWhere, "Or", operation) : WhereNode.create(operation)
		});
	},
	cloneWithUpdateWhere(node, operation) {
		return freeze({
			...node,
			updateWhere: node.updateWhere ? WhereNode.cloneWithOperation(node.updateWhere, "And", operation) : WhereNode.create(operation)
		});
	},
	cloneWithUpdateOrWhere(node, operation) {
		return freeze({
			...node,
			updateWhere: node.updateWhere ? WhereNode.cloneWithOperation(node.updateWhere, "Or", operation) : WhereNode.create(operation)
		});
	},
	cloneWithoutIndexWhere(node) {
		return freeze({
			...node,
			indexWhere: void 0
		});
	},
	cloneWithoutUpdateWhere(node) {
		return freeze({
			...node,
			updateWhere: void 0
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/query-builder/on-conflict-builder.js
var OnConflictBuilder = class OnConflictBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Specify a single column as the conflict target.
	*
	* Also see the {@link columns}, {@link constraint} and {@link expression}
	* methods for alternative ways to specify the conflict target.
	*/
	column(column) {
		const columnNode = ColumnNode.create(column);
		return new OnConflictBuilder({
			...this.#props,
			onConflictNode: OnConflictNode.cloneWith(this.#props.onConflictNode, { columns: this.#props.onConflictNode.columns ? freeze([...this.#props.onConflictNode.columns, columnNode]) : freeze([columnNode]) })
		});
	}
	/**
	* Specify a list of columns as the conflict target.
	*
	* Also see the {@link column}, {@link constraint} and {@link expression}
	* methods for alternative ways to specify the conflict target.
	*/
	columns(columns) {
		const columnNodes = columns.map(ColumnNode.create);
		return new OnConflictBuilder({
			...this.#props,
			onConflictNode: OnConflictNode.cloneWith(this.#props.onConflictNode, { columns: this.#props.onConflictNode.columns ? freeze([...this.#props.onConflictNode.columns, ...columnNodes]) : freeze(columnNodes) })
		});
	}
	/**
	* Specify a specific constraint by name as the conflict target.
	*
	* Also see the {@link column}, {@link columns} and {@link expression}
	* methods for alternative ways to specify the conflict target.
	*/
	constraint(constraintName) {
		return new OnConflictBuilder({
			...this.#props,
			onConflictNode: OnConflictNode.cloneWith(this.#props.onConflictNode, { constraint: IdentifierNode.create(constraintName) })
		});
	}
	/**
	* Specify an expression as the conflict target.
	*
	* This can be used if the unique index is an expression index.
	*
	* Also see the {@link column}, {@link columns} and {@link constraint}
	* methods for alternative ways to specify the conflict target.
	*/
	expression(expression) {
		return new OnConflictBuilder({
			...this.#props,
			onConflictNode: OnConflictNode.cloneWith(this.#props.onConflictNode, { indexExpression: expression.toOperationNode() })
		});
	}
	where(...args) {
		return new OnConflictBuilder({
			...this.#props,
			onConflictNode: OnConflictNode.cloneWithIndexWhere(this.#props.onConflictNode, parseValueBinaryOperationOrExpression(args))
		});
	}
	whereRef(lhs, op, rhs) {
		return new OnConflictBuilder({
			...this.#props,
			onConflictNode: OnConflictNode.cloneWithIndexWhere(this.#props.onConflictNode, parseReferentialBinaryOperation(lhs, op, rhs))
		});
	}
	clearWhere() {
		return new OnConflictBuilder({
			...this.#props,
			onConflictNode: OnConflictNode.cloneWithoutIndexWhere(this.#props.onConflictNode)
		});
	}
	/**
	* Adds the "do nothing" conflict action.
	*
	* ### Examples
	*
	* ```ts
	* const id = 1
	* const first_name = 'John'
	*
	* await db
	*   .insertInto('person')
	*   .values({ first_name, id })
	*   .onConflict((oc) => oc
	*     .column('id')
	*     .doNothing()
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* insert into "person" ("first_name", "id")
	* values ($1, $2)
	* on conflict ("id") do nothing
	* ```
	*/
	doNothing() {
		return new OnConflictDoNothingBuilder({
			...this.#props,
			onConflictNode: OnConflictNode.cloneWith(this.#props.onConflictNode, { doNothing: true })
		});
	}
	/**
	* Adds the "do update set" conflict action.
	*
	* ### Examples
	*
	* ```ts
	* const id = 1
	* const first_name = 'John'
	*
	* await db
	*   .insertInto('person')
	*   .values({ first_name, id })
	*   .onConflict((oc) => oc
	*     .column('id')
	*     .doUpdateSet({ first_name })
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* insert into "person" ("first_name", "id")
	* values ($1, $2)
	* on conflict ("id")
	* do update set "first_name" = $3
	* ```
	*
	* In the next example we use the `ref` method to reference
	* columns of the virtual table `excluded` in a type-safe way
	* to create an upsert operation:
	*
	* ```ts
	* import type { NewPerson } from 'type-editor' // imaginary module
	*
	* async function upsertPerson(person: NewPerson): Promise<void> {
	*   await db.insertInto('person')
	*     .values(person)
	*     .onConflict((oc) => oc
	*       .column('id')
	*       .doUpdateSet((eb) => ({
	*         first_name: eb.ref('excluded.first_name'),
	*         last_name: eb.ref('excluded.last_name')
	*       })
	*     )
	*   )
	*   .execute()
	* }
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* insert into "person" ("first_name", "last_name")
	* values ($1, $2)
	* on conflict ("id")
	* do update set
	*  "first_name" = excluded."first_name",
	*  "last_name" = excluded."last_name"
	* ```
	*/
	doUpdateSet(update) {
		return new OnConflictUpdateBuilder({
			...this.#props,
			onConflictNode: OnConflictNode.cloneWith(this.#props.onConflictNode, { updates: parseUpdateObjectExpression(update) })
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
};
var OnConflictDoNothingBuilder = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	toOperationNode() {
		return this.#props.onConflictNode;
	}
};
var OnConflictUpdateBuilder = class OnConflictUpdateBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	where(...args) {
		return new OnConflictUpdateBuilder({
			...this.#props,
			onConflictNode: OnConflictNode.cloneWithUpdateWhere(this.#props.onConflictNode, parseValueBinaryOperationOrExpression(args))
		});
	}
	/**
	* Specify a where condition for the update operation.
	*
	* See {@link WhereInterface.whereRef} for more info.
	*/
	whereRef(lhs, op, rhs) {
		return new OnConflictUpdateBuilder({
			...this.#props,
			onConflictNode: OnConflictNode.cloneWithUpdateWhere(this.#props.onConflictNode, parseReferentialBinaryOperation(lhs, op, rhs))
		});
	}
	clearWhere() {
		return new OnConflictUpdateBuilder({
			...this.#props,
			onConflictNode: OnConflictNode.cloneWithoutUpdateWhere(this.#props.onConflictNode)
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.onConflictNode;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/top-node.js
/**
* @internal
*/
const TopNode = freeze({
	is(node) {
		return node.kind === "TopNode";
	},
	create(expression, modifiers) {
		return freeze({
			kind: "TopNode",
			expression,
			modifiers
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/parser/top-parser.js
function parseTop(expression, modifiers) {
	if (!isNumber(expression) && !isBigInt(expression)) throw new Error(`Invalid top expression: ${expression}`);
	if (!isUndefined(modifiers) && !isTopModifiers(modifiers)) throw new Error(`Invalid top modifiers: ${modifiers}`);
	return TopNode.create(expression, modifiers);
}
function isTopModifiers(modifiers) {
	return modifiers === "percent" || modifiers === "with ties" || modifiers === "percent with ties";
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/or-action-node.js
/**
* @internal
*/
const OrActionNode = freeze({
	is(node) {
		return node.kind === "OrActionNode";
	},
	create(action) {
		return freeze({
			kind: "OrActionNode",
			action
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/query-builder/insert-query-builder.js
var InsertQueryBuilder = class InsertQueryBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Sets the values to insert for an {@link Kysely.insertInto | insert} query.
	*
	* This method takes an object whose keys are column names and values are
	* values to insert. In addition to the column's type, the values can be
	* raw {@link sql} snippets or select queries.
	*
	* You must provide all fields you haven't explicitly marked as nullable
	* or optional using {@link Generated} or {@link ColumnType}.
	*
	* The return value of an `insert` query is an instance of {@link InsertResult}. The
	* {@link InsertResult.insertId | insertId} field holds the auto incremented primary
	* key if the database returned one.
	*
	* On PostgreSQL and some other dialects, you need to call `returning` to get
	* something out of the query.
	*
	* Also see the {@link expression} method for inserting the result of a select
	* query or any other expression.
	*
	* ### Examples
	*
	* <!-- siteExample("insert", "Single row", 10) -->
	*
	* Insert a single row:
	*
	* ```ts
	* const result = await db
	*   .insertInto('person')
	*   .values({
	*     first_name: 'Jennifer',
	*     last_name: 'Aniston',
	*     age: 40
	*   })
	*   .executeTakeFirst()
	*
	* // `insertId` is only available on dialects that
	* // automatically return the id of the inserted row
	* // such as MySQL and SQLite. On PostgreSQL, for example,
	* // you need to add a `returning` clause to the query to
	* // get anything out. See the "returning data" example.
	* console.log(result.insertId)
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* insert into `person` (`first_name`, `last_name`, `age`) values (?, ?, ?)
	* ```
	*
	* <!-- siteExample("insert", "Multiple rows", 20) -->
	*
	* On dialects that support it (for example PostgreSQL) you can insert multiple
	* rows by providing an array. Note that the return value is once again very
	* dialect-specific. Some databases may only return the id of the *last* inserted
	* row and some return nothing at all unless you call `returning`.
	*
	* ```ts
	* await db
	*   .insertInto('person')
	*   .values([{
	*     first_name: 'Jennifer',
	*     last_name: 'Aniston',
	*     age: 40,
	*   }, {
	*     first_name: 'Arnold',
	*     last_name: 'Schwarzenegger',
	*     age: 70,
	*   }])
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* insert into "person" ("first_name", "last_name", "age") values (($1, $2, $3), ($4, $5, $6))
	* ```
	*
	* <!-- siteExample("insert", "Returning data", 30) -->
	*
	* On supported dialects like PostgreSQL you need to chain `returning` to the query to get
	* the inserted row's columns (or any other expression) as the return value. `returning`
	* works just like `select`. Refer to `select` method's examples and documentation for
	* more info.
	*
	* ```ts
	* const result = await db
	*   .insertInto('person')
	*   .values({
	*     first_name: 'Jennifer',
	*     last_name: 'Aniston',
	*     age: 40,
	*   })
	*   .returning(['id', 'first_name as name'])
	*   .executeTakeFirstOrThrow()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* insert into "person" ("first_name", "last_name", "age") values ($1, $2, $3) returning "id", "first_name" as "name"
	* ```
	*
	* <!-- siteExample("insert", "Complex values", 40) -->
	*
	* In addition to primitives, the values can also be arbitrary expressions.
	* You can build the expressions by using a callback and calling the methods
	* on the expression builder passed to it:
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* const ani = "Ani"
	* const ston = "ston"
	*
	* const result = await db
	*   .insertInto('person')
	*   .values(({ ref, selectFrom, fn }) => ({
	*     first_name: 'Jennifer',
	*     last_name: sql<string>`concat(${ani}, ${ston})`,
	*     middle_name: ref('first_name'),
	*     age: selectFrom('person')
	*       .select(fn.avg<number>('age').as('avg_age')),
	*   }))
	*   .executeTakeFirst()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* insert into "person" (
	*   "first_name",
	*   "last_name",
	*   "middle_name",
	*   "age"
	* )
	* values (
	*   $1,
	*   concat($2, $3),
	*   "first_name",
	*   (select avg("age") as "avg_age" from "person")
	* )
	* ```
	*
	* You can also use the callback version of subqueries or raw expressions:
	*
	* ```ts
	* await db.with('jennifer', (db) => db
	*   .selectFrom('person')
	*   .where('first_name', '=', 'Jennifer')
	*   .select(['id', 'first_name', 'gender'])
	*   .limit(1)
	* ).insertInto('pet').values((eb) => ({
	*   owner_id: eb.selectFrom('jennifer').select('id'),
	*   name: eb.selectFrom('jennifer').select('first_name'),
	*   species: 'cat',
	* }))
	* .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* with "jennifer" as (
	*   select "id", "first_name", "gender"
	*   from "person"
	*   where "first_name" = $1
	*   limit $2
	* )
	* insert into "pet" ("owner_id", "name", "species")
	* values (
	*  (select "id" from "jennifer"),
	*  (select "first_name" from "jennifer"),
	*  $3
	* )
	* ```
	*/
	values(insert) {
		const [columns, values] = parseInsertExpression(insert);
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, {
				columns,
				values
			})
		});
	}
	/**
	* Sets the columns to insert.
	*
	* The {@link values} method sets both the columns and the values and this method
	* is not needed. But if you are using the {@link expression} method, you can use
	* this method to set the columns to insert.
	*
	* ### Examples
	*
	* ```ts
	* await db.insertInto('person')
	*   .columns(['first_name'])
	*   .expression((eb) => eb.selectFrom('pet').select('pet.name'))
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* insert into "person" ("first_name")
	* select "pet"."name" from "pet"
	* ```
	*/
	columns(columns) {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { columns: freeze(columns.map(ColumnNode.create)) })
		});
	}
	/**
	* Insert an arbitrary expression. For example the result of a select query.
	*
	* ### Examples
	*
	* <!-- siteExample("insert", "Insert subquery", 50) -->
	*
	* You can create an `INSERT INTO SELECT FROM` query using the `expression` method.
	* This API doesn't follow our WYSIWYG principles and might be a bit difficult to
	* remember. The reasons for this design stem from implementation difficulties.
	*
	* ```ts
	* const result = await db.insertInto('person')
	*   .columns(['first_name', 'last_name', 'age'])
	*   .expression((eb) => eb
	*     .selectFrom('pet')
	*     .select((eb) => [
	*       'pet.name',
	*       eb.val('Petson').as('last_name'),
	*       eb.lit(7).as('age'),
	*     ])
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* insert into "person" ("first_name", "last_name", "age")
	* select "pet"."name", $1 as "last_name", 7 as "age from "pet"
	* ```
	*/
	expression(expression) {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { values: parseExpression(expression) })
		});
	}
	/**
	* Creates an `insert into "person" default values` query.
	*
	* ### Examples
	*
	* ```ts
	* await db.insertInto('person')
	*   .defaultValues()
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* insert into "person" default values
	* ```
	*/
	defaultValues() {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { defaultValues: true })
		});
	}
	/**
	* This can be used to add any additional SQL to the end of the query.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.insertInto('person')
	*   .values({
	*     first_name: 'John',
	*     last_name: 'Doe',
	*     gender: 'male',
	*   })
	*   .modifyEnd(sql`-- This is a comment`)
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* insert into `person` ("first_name", "last_name", "gender")
	* values (?, ?, ?) -- This is a comment
	* ```
	*/
	modifyEnd(modifier) {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, modifier.toOperationNode())
		});
	}
	/**
	* Changes an `insert into` query to an `insert ignore into` query.
	*
	* This is only supported by some dialects like MySQL.
	*
	* To avoid a footgun, when invoked with the SQLite dialect, this method will
	* be handled like {@link orIgnore}. See also, {@link orAbort}, {@link orFail},
	* {@link orReplace}, and {@link orRollback}.
	*
	* If you use the ignore modifier, ignorable errors that occur while executing the
	* insert statement are ignored. For example, without ignore, a row that duplicates
	* an existing unique index or primary key value in the table causes a duplicate-key
	* error and the statement is aborted. With ignore, the row is discarded and no error
	* occurs.
	*
	* ### Examples
	*
	* ```ts
	* await db.insertInto('person')
	*   .ignore()
	*   .values({
	*     first_name: 'John',
	*     last_name: 'Doe',
	*     gender: 'female',
	*   })
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* insert ignore into `person` (`first_name`, `last_name`, `gender`) values (?, ?, ?)
	* ```
	*
	* The generated SQL (SQLite):
	*
	* ```sql
	* insert or ignore into "person" ("first_name", "last_name", "gender") values (?, ?, ?)
	* ```
	*/
	ignore() {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { orAction: OrActionNode.create("ignore") })
		});
	}
	/**
	* Changes an `insert into` query to an `insert or ignore into` query.
	*
	* This is only supported by some dialects like SQLite.
	*
	* To avoid a footgun, when invoked with the MySQL dialect, this method will
	* be handled like {@link ignore}.
	*
	* See also, {@link orAbort}, {@link orFail}, {@link orReplace}, and {@link orRollback}.
	*
	* ### Examples
	*
	* ```ts
	* await db.insertInto('person')
	*   .orIgnore()
	*   .values({
	*     first_name: 'John',
	*     last_name: 'Doe',
	*     gender: 'female',
	*   })
	*   .execute()
	* ```
	*
	* The generated SQL (SQLite):
	*
	* ```sql
	* insert or ignore into "person" ("first_name", "last_name", "gender") values (?, ?, ?)
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* insert ignore into `person` (`first_name`, `last_name`, `gender`) values (?, ?, ?)
	* ```
	*/
	orIgnore() {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { orAction: OrActionNode.create("ignore") })
		});
	}
	/**
	* Changes an `insert into` query to an `insert or abort into` query.
	*
	* This is only supported by some dialects like SQLite.
	*
	* See also, {@link orIgnore}, {@link orFail}, {@link orReplace}, and {@link orRollback}.
	*
	* ### Examples
	*
	* ```ts
	* await db.insertInto('person')
	*   .orAbort()
	*   .values({
	*     first_name: 'John',
	*     last_name: 'Doe',
	*     gender: 'female',
	*   })
	*   .execute()
	* ```
	*
	* The generated SQL (SQLite):
	*
	* ```sql
	* insert or abort into "person" ("first_name", "last_name", "gender") values (?, ?, ?)
	* ```
	*/
	orAbort() {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { orAction: OrActionNode.create("abort") })
		});
	}
	/**
	* Changes an `insert into` query to an `insert or fail into` query.
	*
	* This is only supported by some dialects like SQLite.
	*
	* See also, {@link orIgnore}, {@link orAbort}, {@link orReplace}, and {@link orRollback}.
	*
	* ### Examples
	*
	* ```ts
	* await db.insertInto('person')
	*   .orFail()
	*   .values({
	*     first_name: 'John',
	*     last_name: 'Doe',
	*     gender: 'female',
	*   })
	*   .execute()
	* ```
	*
	* The generated SQL (SQLite):
	*
	* ```sql
	* insert or fail into "person" ("first_name", "last_name", "gender") values (?, ?, ?)
	* ```
	*/
	orFail() {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { orAction: OrActionNode.create("fail") })
		});
	}
	/**
	* Changes an `insert into` query to an `insert or replace into` query.
	*
	* This is only supported by some dialects like SQLite.
	*
	* You can also use {@link Kysely.replaceInto} to achieve the same result.
	*
	* See also, {@link orIgnore}, {@link orAbort}, {@link orFail}, and {@link orRollback}.
	*
	* ### Examples
	*
	* ```ts
	* await db.insertInto('person')
	*   .orReplace()
	*   .values({
	*     first_name: 'John',
	*     last_name: 'Doe',
	*     gender: 'female',
	*   })
	*   .execute()
	* ```
	*
	* The generated SQL (SQLite):
	*
	* ```sql
	* insert or replace into "person" ("first_name", "last_name", "gender") values (?, ?, ?)
	* ```
	*/
	orReplace() {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { orAction: OrActionNode.create("replace") })
		});
	}
	/**
	* Changes an `insert into` query to an `insert or rollback into` query.
	*
	* This is only supported by some dialects like SQLite.
	*
	* See also, {@link orIgnore}, {@link orAbort}, {@link orFail}, and {@link orReplace}.
	*
	* ### Examples
	*
	* ```ts
	* await db.insertInto('person')
	*   .orRollback()
	*   .values({
	*     first_name: 'John',
	*     last_name: 'Doe',
	*     gender: 'female',
	*   })
	*   .execute()
	* ```
	*
	* The generated SQL (SQLite):
	*
	* ```sql
	* insert or rollback into "person" ("first_name", "last_name", "gender") values (?, ?, ?)
	* ```
	*/
	orRollback() {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { orAction: OrActionNode.create("rollback") })
		});
	}
	/**
	* Changes an `insert into` query to an `insert top into` query.
	*
	* `top` clause is only supported by some dialects like MS SQL Server.
	*
	* ### Examples
	*
	* Insert the first 5 rows:
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.insertInto('person')
	*   .top(5)
	*   .columns(['first_name', 'gender'])
	*   .expression(
	*     (eb) => eb.selectFrom('pet').select(['name', sql.lit('other').as('gender')])
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (MS SQL Server):
	*
	* ```sql
	* insert top(5) into "person" ("first_name", "gender") select "name", 'other' as "gender" from "pet"
	* ```
	*
	* Insert the first 50 percent of rows:
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.insertInto('person')
	*   .top(50, 'percent')
	*   .columns(['first_name', 'gender'])
	*   .expression(
	*     (eb) => eb.selectFrom('pet').select(['name', sql.lit('other').as('gender')])
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (MS SQL Server):
	*
	* ```sql
	* insert top(50) percent into "person" ("first_name", "gender") select "name", 'other' as "gender" from "pet"
	* ```
	*/
	top(expression, modifiers) {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithTop(this.#props.queryNode, parseTop(expression, modifiers))
		});
	}
	/**
	* Adds an `on conflict` clause to the query.
	*
	* `on conflict` is only supported by some dialects like PostgreSQL and SQLite. On MySQL
	* you can use {@link ignore} and {@link onDuplicateKeyUpdate} to achieve similar results.
	*
	* ### Examples
	*
	* ```ts
	* await db
	*   .insertInto('pet')
	*   .values({
	*     name: 'Catto',
	*     species: 'cat',
	*     owner_id: 3,
	*   })
	*   .onConflict((oc) => oc
	*     .column('name')
	*     .doUpdateSet({ species: 'hamster' })
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* insert into "pet" ("name", "species", "owner_id")
	* values ($1, $2, $3)
	* on conflict ("name")
	* do update set "species" = $4
	* ```
	*
	* You can provide the name of the constraint instead of a column name:
	*
	* ```ts
	* await db
	*   .insertInto('pet')
	*   .values({
	*     name: 'Catto',
	*     species: 'cat',
	*     owner_id: 3,
	*   })
	*   .onConflict((oc) => oc
	*     .constraint('pet_name_key')
	*     .doUpdateSet({ species: 'hamster' })
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* insert into "pet" ("name", "species", "owner_id")
	* values ($1, $2, $3)
	* on conflict on constraint "pet_name_key"
	* do update set "species" = $4
	* ```
	*
	* You can also specify an expression as the conflict target in case
	* the unique index is an expression index:
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db
	*   .insertInto('pet')
	*   .values({
	*     name: 'Catto',
	*     species: 'cat',
	*     owner_id: 3,
	*   })
	*   .onConflict((oc) => oc
	*     .expression(sql<string>`lower(name)`)
	*     .doUpdateSet({ species: 'hamster' })
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* insert into "pet" ("name", "species", "owner_id")
	* values ($1, $2, $3)
	* on conflict (lower(name))
	* do update set "species" = $4
	* ```
	*
	* You can add a filter for the update statement like this:
	*
	* ```ts
	* await db
	*   .insertInto('pet')
	*   .values({
	*     name: 'Catto',
	*     species: 'cat',
	*     owner_id: 3,
	*   })
	*   .onConflict((oc) => oc
	*     .column('name')
	*     .doUpdateSet({ species: 'hamster' })
	*     .where('excluded.name', '!=', 'Catto')
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* insert into "pet" ("name", "species", "owner_id")
	* values ($1, $2, $3)
	* on conflict ("name")
	* do update set "species" = $4
	* where "excluded"."name" != $5
	* ```
	*
	* You can create an `on conflict do nothing` clauses like this:
	*
	* ```ts
	* await db
	*   .insertInto('pet')
	*   .values({
	*     name: 'Catto',
	*     species: 'cat',
	*     owner_id: 3,
	*   })
	*   .onConflict((oc) => oc
	*     .column('name')
	*     .doNothing()
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* insert into "pet" ("name", "species", "owner_id")
	* values ($1, $2, $3)
	* on conflict ("name") do nothing
	* ```
	*
	* You can refer to the columns of the virtual `excluded` table
	* in a type-safe way using a callback and the `ref` method of
	* `ExpressionBuilder`:
	*
	* ```ts
	* await db.insertInto('person')
	*   .values({
	*     id: 1,
	*     first_name: 'John',
	*     last_name: 'Doe',
	*     gender: 'male',
	*   })
	*   .onConflict(oc => oc
	*     .column('id')
	*     .doUpdateSet({
	*       first_name: (eb) => eb.ref('excluded.first_name'),
	*       last_name: (eb) => eb.ref('excluded.last_name')
	*     })
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* insert into "person" ("id", "first_name", "last_name", "gender")
	* values ($1, $2, $3, $4)
	* on conflict ("id")
	* do update set
	*  "first_name" = "excluded"."first_name",
	*  "last_name" = "excluded"."last_name"
	* ```
	*/
	onConflict(callback) {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { onConflict: callback(new OnConflictBuilder({ onConflictNode: OnConflictNode.create() })).toOperationNode() })
		});
	}
	/**
	* Adds `on duplicate key update` to the query.
	*
	* If you specify `on duplicate key update`, and a row is inserted that would cause
	* a duplicate value in a unique index or primary key, an update of the old row occurs.
	*
	* This is only implemented by some dialects like MySQL. On most dialects you should
	* use {@link onConflict} instead.
	*
	* ### Examples
	*
	* ```ts
	* await db
	*   .insertInto('person')
	*   .values({
	*     id: 1,
	*     first_name: 'John',
	*     last_name: 'Doe',
	*     gender: 'male',
	*   })
	*   .onDuplicateKeyUpdate({ updated_at: new Date().toISOString() })
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* insert into `person` (`id`, `first_name`, `last_name`, `gender`)
	* values (?, ?, ?, ?)
	* on duplicate key update `updated_at` = ?
	* ```
	*/
	onDuplicateKeyUpdate(update) {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { onDuplicateKey: OnDuplicateKeyNode.create(parseUpdateObjectExpression(update)) })
		});
	}
	returning(selection) {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectArg(selection))
		});
	}
	returningAll() {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectAll())
		});
	}
	output(args) {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithOutput(this.#props.queryNode, parseSelectArg(args))
		});
	}
	outputAll(table) {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithOutput(this.#props.queryNode, parseSelectAll(table))
		});
	}
	/**
	* Clears all `returning` clauses from the query.
	*
	* ### Examples
	*
	* ```ts
	* await db.insertInto('person')
	*   .values({ first_name: 'James', last_name: 'Smith', gender: 'male' })
	*   .returning(['first_name'])
	*   .clearReturning()
	*   .execute()
	* ```
	*
	* The generated SQL(PostgreSQL):
	*
	* ```sql
	* insert into "person" ("first_name", "last_name", "gender") values ($1, $2, $3)
	* ```
	*/
	clearReturning() {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithoutReturning(this.#props.queryNode)
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*
	* If you want to conditionally call a method on `this`, see
	* the {@link $if} method.
	*
	* ### Examples
	*
	* The next example uses a helper function `log` to log a query:
	*
	* ```ts
	* import type { Compilable } from 'kysely'
	*
	* function log<T extends Compilable>(qb: T): T {
	*   console.log(qb.compile())
	*   return qb
	* }
	*
	* await db.insertInto('person')
	*   .values({ first_name: 'John', last_name: 'Doe', gender: 'male' })
	*   .$call(log)
	*   .execute()
	* ```
	*/
	$call(func) {
		return func(this);
	}
	/**
	* Call `func(this)` if `condition` is true.
	*
	* This method is especially handy with optional selects. Any `returning` or `returningAll`
	* method calls add columns as optional fields to the output type when called inside
	* the `func` callback. This is because we can't know if those selections were actually
	* made before running the code.
	*
	* You can also call any other methods inside the callback.
	*
	* ### Examples
	*
	* ```ts
	* import type { NewPerson } from 'type-editor' // imaginary module
	*
	* async function insertPerson(values: NewPerson, returnLastName: boolean) {
	*   return await db
	*     .insertInto('person')
	*     .values(values)
	*     .returning(['id', 'first_name'])
	*     .$if(returnLastName, (qb) => qb.returning('last_name'))
	*     .executeTakeFirstOrThrow()
	* }
	* ```
	*
	* Any selections added inside the `if` callback will be added as optional fields to the
	* output type since we can't know if the selections were actually made before running
	* the code. In the example above the return type of the `insertPerson` function is:
	*
	* ```ts
	* Promise<{
	*   id: number
	*   first_name: string
	*   last_name?: string
	* }>
	* ```
	*/
	$if(condition, func) {
		if (condition) return func(this);
		return new InsertQueryBuilder({ ...this.#props });
	}
	/**
	* Change the output type of the query.
	*
	* This method call doesn't change the SQL in any way. This methods simply
	* returns a copy of this `InsertQueryBuilder` with a new output type.
	*/
	$castTo() {
		return new InsertQueryBuilder(this.#props);
	}
	/**
	* Narrows (parts of) the output type of the query.
	*
	* Kysely tries to be as type-safe as possible, but in some cases we have to make
	* compromises for better maintainability and compilation performance. At present,
	* Kysely doesn't narrow the output type of the query based on {@link values} input
	* when using {@link returning} or {@link returningAll}.
	*
	* This utility method is very useful for these situations, as it removes unncessary
	* runtime assertion/guard code. Its input type is limited to the output type
	* of the query, so you can't add a column that doesn't exist, or change a column's
	* type to something that doesn't exist in its union type.
	*
	* ### Examples
	*
	* Turn this code:
	*
	* ```ts
	* import type { Person } from 'type-editor' // imaginary module
	*
	* const person = await db.insertInto('person')
	*   .values({
	*     first_name: 'John',
	*     last_name: 'Doe',
	*     gender: 'male',
	*     nullable_column: 'hell yeah!'
	*   })
	*   .returningAll()
	*   .executeTakeFirstOrThrow()
	*
	* if (isWithNoNullValue(person)) {
	*   functionThatExpectsPersonWithNonNullValue(person)
	* }
	*
	* function isWithNoNullValue(person: Person): person is Person & { nullable_column: string } {
	*   return person.nullable_column != null
	* }
	* ```
	*
	* Into this:
	*
	* ```ts
	* import type { NotNull } from 'kysely'
	*
	* const person = await db.insertInto('person')
	*   .values({
	*     first_name: 'John',
	*     last_name: 'Doe',
	*     gender: 'male',
	*     nullable_column: 'hell yeah!'
	*   })
	*   .returningAll()
	*   .$narrowType<{ nullable_column: NotNull }>()
	*   .executeTakeFirstOrThrow()
	*
	* functionThatExpectsPersonWithNonNullValue(person)
	* ```
	*/
	$narrowType() {
		return new InsertQueryBuilder(this.#props);
	}
	/**
	* Asserts that query's output row type equals the given type `T`.
	*
	* This method can be used to simplify excessively complex types to make TypeScript happy
	* and much faster.
	*
	* Kysely uses complex type magic to achieve its type safety. This complexity is sometimes too much
	* for TypeScript and you get errors like this:
	*
	* ```
	* error TS2589: Type instantiation is excessively deep and possibly infinite.
	* ```
	*
	* In these case you can often use this method to help TypeScript a little bit. When you use this
	* method to assert the output type of a query, Kysely can drop the complex output type that
	* consists of multiple nested helper types and replace it with the simple asserted type.
	*
	* Using this method doesn't reduce type safety at all. You have to pass in a type that is
	* structurally equal to the current type.
	*
	* ### Examples
	*
	* ```ts
	* import type { NewPerson, NewPet, Species } from 'type-editor' // imaginary module
	*
	* async function insertPersonAndPet(person: NewPerson, pet: Omit<NewPet, 'owner_id'>) {
	*   return await db
	*     .with('new_person', (qb) => qb
	*       .insertInto('person')
	*       .values(person)
	*       .returning('id')
	*       .$assertType<{ id: number }>()
	*     )
	*     .with('new_pet', (qb) => qb
	*       .insertInto('pet')
	*       .values((eb) => ({
	*         owner_id: eb.selectFrom('new_person').select('id'),
	*         ...pet
	*       }))
	*       .returning(['name as pet_name', 'species'])
	*       .$assertType<{ pet_name: string, species: Species }>()
	*     )
	*     .selectFrom(['new_person', 'new_pet'])
	*     .selectAll()
	*     .executeTakeFirstOrThrow()
	* }
	* ```
	*/
	$assertType() {
		return new InsertQueryBuilder(this.#props);
	}
	/**
	* Returns a copy of this InsertQueryBuilder instance with the given plugin installed.
	*/
	withPlugin(plugin) {
		return new InsertQueryBuilder({
			...this.#props,
			executor: this.#props.executor.withPlugin(plugin)
		});
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.queryNode, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		const compiledQuery = this.compile();
		const result = await this.#props.executor.executeQuery(compiledQuery, options);
		const { adapter } = this.#props.executor;
		const query = compiledQuery.query;
		if (query.returning && adapter.supportsReturning || query.output && adapter.supportsOutput) return result.rows;
		return [new InsertResult(result.insertId, result.numAffectedRows ?? BigInt(0))];
	}
	async executeTakeFirst(options) {
		const [result] = await this.execute(options);
		return result;
	}
	async executeTakeFirstOrThrow(errorConstructorOrOptions) {
		if (typeof errorConstructorOrOptions === "function") errorConstructorOrOptions = { errorConstructor: errorConstructorOrOptions };
		const result = await this.executeTakeFirst(errorConstructorOrOptions);
		if (result === void 0) {
			const errorConstructor = errorConstructorOrOptions?.errorConstructor ?? NoResultError;
			throw isNoResultErrorConstructor(errorConstructor) ? new errorConstructor(this.toOperationNode()) : errorConstructor(this.toOperationNode());
		}
		return result;
	}
	async *stream(chunkSizeOrOptions) {
		if (typeof chunkSizeOrOptions !== "object") chunkSizeOrOptions = { chunkSize: chunkSizeOrOptions };
		const compiledQuery = this.compile();
		const stream = this.#props.executor.stream(compiledQuery, chunkSizeOrOptions.chunkSize ?? 100, chunkSizeOrOptions);
		for await (const item of stream) yield* item.rows;
	}
	async explain(format, options) {
		return await new InsertQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithExplain(this.#props.queryNode, format, options)
		}).execute();
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/query-builder/delete-result.js
var DeleteResult = class {
	numDeletedRows;
	constructor(numDeletedRows) {
		this.numDeletedRows = numDeletedRows;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/limit-node.js
/**
* @internal
*/
const LimitNode = freeze({
	is(node) {
		return node.kind === "LimitNode";
	},
	create(limit) {
		return freeze({
			kind: "LimitNode",
			limit
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/query-builder/delete-query-builder.js
var _a$3;
var DeleteQueryBuilder = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	where(...args) {
		return new _a$3({
			...this.#props,
			queryNode: QueryNode.cloneWithWhere(this.#props.queryNode, parseValueBinaryOperationOrExpression(args))
		});
	}
	whereRef(lhs, op, rhs) {
		return new _a$3({
			...this.#props,
			queryNode: QueryNode.cloneWithWhere(this.#props.queryNode, parseReferentialBinaryOperation(lhs, op, rhs))
		});
	}
	clearWhere() {
		return new _a$3({
			...this.#props,
			queryNode: QueryNode.cloneWithoutWhere(this.#props.queryNode)
		});
	}
	/**
	* Changes a `delete from` query into a `delete top from` query.
	*
	* `top` clause is only supported by some dialects like MS SQL Server.
	*
	* ### Examples
	*
	* Delete the first 5 rows:
	*
	* ```ts
	* await db
	*   .deleteFrom('person')
	*   .top(5)
	*   .where('age', '>', 18)
	*   .executeTakeFirstOrThrow()
	* ```
	*
	* The generated SQL (MS SQL Server):
	*
	* ```sql
	* delete top(5) from "person" where "age" > @1
	* ```
	*
	* Delete the first 50% of rows:
	*
	* ```ts
	* await db
	*   .deleteFrom('person')
	*   .top(50, 'percent')
	*   .where('age', '>', 18)
	*   .executeTakeFirstOrThrow()
	* ```
	*
	* The generated SQL (MS SQL Server):
	*
	* ```sql
	* delete top(50) percent from "person" where "age" > @1
	* ```
	*/
	top(expression, modifiers) {
		return new _a$3({
			...this.#props,
			queryNode: QueryNode.cloneWithTop(this.#props.queryNode, parseTop(expression, modifiers))
		});
	}
	using(tables) {
		return new _a$3({
			...this.#props,
			queryNode: DeleteQueryNode.cloneWithUsing(this.#props.queryNode, parseTableExpressionOrList(tables))
		});
	}
	innerJoin(...args) {
		return this.#join("InnerJoin", args);
	}
	leftJoin(...args) {
		return this.#join("LeftJoin", args);
	}
	rightJoin(...args) {
		return this.#join("RightJoin", args);
	}
	fullJoin(...args) {
		return this.#join("FullJoin", args);
	}
	#join(joinType, args) {
		return new _a$3({
			...this.#props,
			queryNode: QueryNode.cloneWithJoin(this.#props.queryNode, parseJoin(joinType, args))
		});
	}
	returning(selection) {
		return new _a$3({
			...this.#props,
			queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectArg(selection))
		});
	}
	returningAll(table) {
		return new _a$3({
			...this.#props,
			queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectAll(table))
		});
	}
	output(args) {
		return new _a$3({
			...this.#props,
			queryNode: QueryNode.cloneWithOutput(this.#props.queryNode, parseSelectArg(args))
		});
	}
	outputAll(table) {
		return new _a$3({
			...this.#props,
			queryNode: QueryNode.cloneWithOutput(this.#props.queryNode, parseSelectAll(table))
		});
	}
	/**
	* Clears all `returning` clauses from the query.
	*
	* ### Examples
	*
	* ```ts
	* await db.deleteFrom('pet')
	*   .returningAll()
	*   .where('name', '=', 'Max')
	*   .clearReturning()
	*   .execute()
	* ```
	*
	* The generated SQL(PostgreSQL):
	*
	* ```sql
	* delete from "pet" where "name" = "Max"
	* ```
	*/
	clearReturning() {
		return new _a$3({
			...this.#props,
			queryNode: QueryNode.cloneWithoutReturning(this.#props.queryNode)
		});
	}
	/**
	* Clears the `limit` clause from the query.
	*
	* ### Examples
	*
	* ```ts
	* await db.deleteFrom('pet')
	*   .returningAll()
	*   .where('name', '=', 'Max')
	*   .limit(5)
	*   .clearLimit()
	*   .execute()
	* ```
	*
	* The generated SQL(PostgreSQL):
	*
	* ```sql
	* delete from "pet" where "name" = "Max" returning *
	* ```
	*/
	clearLimit() {
		return new _a$3({
			...this.#props,
			queryNode: DeleteQueryNode.cloneWithoutLimit(this.#props.queryNode)
		});
	}
	orderBy(...args) {
		return new _a$3({
			...this.#props,
			queryNode: QueryNode.cloneWithOrderByItems(this.#props.queryNode, parseOrderBy(args))
		});
	}
	clearOrderBy() {
		return new _a$3({
			...this.#props,
			queryNode: QueryNode.cloneWithoutOrderBy(this.#props.queryNode)
		});
	}
	/**
	* Adds a limit clause to the query.
	*
	* A limit clause in a delete query is only supported by some dialects
	* like MySQL.
	*
	* ### Examples
	*
	* Delete 5 oldest items in a table:
	*
	* ```ts
	* await db
	*   .deleteFrom('pet')
	*   .orderBy('created_at')
	*   .limit(5)
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* delete from `pet` order by `created_at` limit ?
	* ```
	*/
	limit(limit) {
		return new _a$3({
			...this.#props,
			queryNode: DeleteQueryNode.cloneWithLimit(this.#props.queryNode, LimitNode.create(parseValueExpression(limit)))
		});
	}
	/**
	* This can be used to add any additional SQL to the end of the query.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.deleteFrom('person')
	*   .where('first_name', '=', 'John')
	*   .modifyEnd(sql`-- This is a comment`)
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* delete from `person`
	* where `first_name` = "John" -- This is a comment
	* ```
	*/
	modifyEnd(modifier) {
		return new _a$3({
			...this.#props,
			queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, modifier.toOperationNode())
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*
	* If you want to conditionally call a method on `this`, see
	* the {@link $if} method.
	*
	* ### Examples
	*
	* The next example uses a helper function `log` to log a query:
	*
	* ```ts
	* import type { Compilable } from 'kysely'
	*
	* function log<T extends Compilable>(qb: T): T {
	*   console.log(qb.compile())
	*   return qb
	* }
	*
	* await db.deleteFrom('person')
	*   .$call(log)
	*   .execute()
	* ```
	*/
	$call(func) {
		return func(this);
	}
	/**
	* Call `func(this)` if `condition` is true.
	*
	* This method is especially handy with optional selects. Any `returning` or `returningAll`
	* method calls add columns as optional fields to the output type when called inside
	* the `func` callback. This is because we can't know if those selections were actually
	* made before running the code.
	*
	* You can also call any other methods inside the callback.
	*
	* ### Examples
	*
	* ```ts
	* async function deletePerson(id: number, returnLastName: boolean) {
	*   return await db
	*     .deleteFrom('person')
	*     .where('id', '=', id)
	*     .returning(['id', 'first_name'])
	*     .$if(returnLastName, (qb) => qb.returning('last_name'))
	*     .executeTakeFirstOrThrow()
	* }
	* ```
	*
	* Any selections added inside the `if` callback will be added as optional fields to the
	* output type since we can't know if the selections were actually made before running
	* the code. In the example above the return type of the `deletePerson` function is:
	*
	* ```ts
	* Promise<{
	*   id: number
	*   first_name: string
	*   last_name?: string
	* }>
	* ```
	*/
	$if(condition, func) {
		if (condition) return func(this);
		return new _a$3({ ...this.#props });
	}
	/**
	* Change the output type of the query.
	*
	* This method call doesn't change the SQL in any way. This methods simply
	* returns a copy of this `DeleteQueryBuilder` with a new output type.
	*/
	$castTo() {
		return new _a$3(this.#props);
	}
	/**
	* Narrows (parts of) the output type of the query.
	*
	* Kysely tries to be as type-safe as possible, but in some cases we have to make
	* compromises for better maintainability and compilation performance. At present,
	* Kysely doesn't narrow the output type of the query when using {@link where} and {@link returning} or {@link returningAll}.
	*
	* This utility method is very useful for these situations, as it removes unncessary
	* runtime assertion/guard code. Its input type is limited to the output type
	* of the query, so you can't add a column that doesn't exist, or change a column's
	* type to something that doesn't exist in its union type.
	*
	* ### Examples
	*
	* Turn this code:
	*
	* ```ts
	* import type { Person } from 'type-editor' // imaginary module
	*
	* const person = await db.deleteFrom('person')
	*   .where('id', '=', 3)
	*   .where('nullable_column', 'is not', null)
	*   .returningAll()
	*   .executeTakeFirstOrThrow()
	*
	* if (isWithNoNullValue(person)) {
	*   functionThatExpectsPersonWithNonNullValue(person)
	* }
	*
	* function isWithNoNullValue(person: Person): person is Person & { nullable_column: string } {
	*   return person.nullable_column != null
	* }
	* ```
	*
	* Into this:
	*
	* ```ts
	* import type { NotNull } from 'kysely'
	*
	* const person = await db.deleteFrom('person')
	*   .where('id', '=', 3)
	*   .where('nullable_column', 'is not', null)
	*   .returningAll()
	*   .$narrowType<{ nullable_column: NotNull }>()
	*   .executeTakeFirstOrThrow()
	*
	* functionThatExpectsPersonWithNonNullValue(person)
	* ```
	*/
	$narrowType() {
		return new _a$3(this.#props);
	}
	/**
	* Asserts that query's output row type equals the given type `T`.
	*
	* This method can be used to simplify excessively complex types to make TypeScript happy
	* and much faster.
	*
	* Kysely uses complex type magic to achieve its type safety. This complexity is sometimes too much
	* for TypeScript and you get errors like this:
	*
	* ```
	* error TS2589: Type instantiation is excessively deep and possibly infinite.
	* ```
	*
	* In these case you can often use this method to help TypeScript a little bit. When you use this
	* method to assert the output type of a query, Kysely can drop the complex output type that
	* consists of multiple nested helper types and replace it with the simple asserted type.
	*
	* Using this method doesn't reduce type safety at all. You have to pass in a type that is
	* structurally equal to the current type.
	*
	* ### Examples
	*
	* ```ts
	* import type { Species } from 'type-editor' // imaginary module
	*
	* async function deletePersonAndPets(personId: number) {
	*   return await db
	*     .with('deleted_person', (qb) => qb
	*        .deleteFrom('person')
	*        .where('id', '=', personId)
	*        .returning('first_name')
	*        .$assertType<{ first_name: string }>()
	*     )
	*     .with('deleted_pets', (qb) => qb
	*       .deleteFrom('pet')
	*       .where('owner_id', '=', personId)
	*       .returning(['name as pet_name', 'species'])
	*       .$assertType<{ pet_name: string, species: Species }>()
	*     )
	*     .selectFrom(['deleted_person', 'deleted_pets'])
	*     .selectAll()
	*     .execute()
	* }
	* ```
	*/
	$assertType() {
		return new _a$3(this.#props);
	}
	/**
	* Returns a copy of this DeleteQueryBuilder instance with the given plugin installed.
	*/
	withPlugin(plugin) {
		return new _a$3({
			...this.#props,
			executor: this.#props.executor.withPlugin(plugin)
		});
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.queryNode, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		const compiledQuery = this.compile();
		const result = await this.#props.executor.executeQuery(compiledQuery, options);
		const { adapter } = this.#props.executor;
		const query = compiledQuery.query;
		if (query.returning && adapter.supportsReturning || query.output && adapter.supportsOutput) return result.rows;
		return [new DeleteResult(result.numAffectedRows ?? BigInt(0))];
	}
	async executeTakeFirst(options) {
		const [result] = await this.execute(options);
		return result;
	}
	async executeTakeFirstOrThrow(errorConstructorOrOptions) {
		if (typeof errorConstructorOrOptions === "function") errorConstructorOrOptions = { errorConstructor: errorConstructorOrOptions };
		const result = await this.executeTakeFirst(errorConstructorOrOptions);
		if (result === void 0) {
			const errorConstructor = errorConstructorOrOptions?.errorConstructor ?? NoResultError;
			throw isNoResultErrorConstructor(errorConstructor) ? new errorConstructor(this.toOperationNode()) : errorConstructor(this.toOperationNode());
		}
		return result;
	}
	async *stream(chunkSizeOrOptions) {
		if (typeof chunkSizeOrOptions !== "object") chunkSizeOrOptions = { chunkSize: chunkSizeOrOptions };
		const compiledQuery = this.compile();
		const stream = this.#props.executor.stream(compiledQuery, chunkSizeOrOptions.chunkSize ?? 100, chunkSizeOrOptions);
		for await (const item of stream) yield* item.rows;
	}
	async explain(format, options) {
		return await new _a$3({
			...this.#props,
			queryNode: QueryNode.cloneWithExplain(this.#props.queryNode, format, options)
		}).execute();
	}
};
_a$3 = DeleteQueryBuilder;
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/query-builder/update-result.js
var UpdateResult = class {
	/**
	* The number of rows the update query updated (even if not changed).
	*/
	numUpdatedRows;
	/**
	* The number of rows the update query changed.
	*
	* This is **optional** and only supported in dialects such as MySQL.
	* You would probably use {@link numUpdatedRows} in most cases.
	*/
	numChangedRows;
	constructor(numUpdatedRows, numChangedRows) {
		this.numUpdatedRows = numUpdatedRows;
		this.numChangedRows = numChangedRows;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/query-builder/update-query-builder.js
var _a$2;
var UpdateQueryBuilder = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	where(...args) {
		return new _a$2({
			...this.#props,
			queryNode: QueryNode.cloneWithWhere(this.#props.queryNode, parseValueBinaryOperationOrExpression(args))
		});
	}
	whereRef(lhs, op, rhs) {
		return new _a$2({
			...this.#props,
			queryNode: QueryNode.cloneWithWhere(this.#props.queryNode, parseReferentialBinaryOperation(lhs, op, rhs))
		});
	}
	clearWhere() {
		return new _a$2({
			...this.#props,
			queryNode: QueryNode.cloneWithoutWhere(this.#props.queryNode)
		});
	}
	/**
	* Changes an `update` query into a `update top` query.
	*
	* `top` clause is only supported by some dialects like MS SQL Server.
	*
	* ### Examples
	*
	* Update the first row:
	*
	* ```ts
	* await db.updateTable('person')
	*   .top(1)
	*   .set({ first_name: 'Foo' })
	*   .where('age', '>', 18)
	*   .executeTakeFirstOrThrow()
	* ```
	*
	* The generated SQL (MS SQL Server):
	*
	* ```sql
	* update top(1) "person" set "first_name" = @1 where "age" > @2
	* ```
	*
	* Update the 50% first rows:
	*
	* ```ts
	* await db.updateTable('person')
	*   .top(50, 'percent')
	*   .set({ first_name: 'Foo' })
	*   .where('age', '>', 18)
	*   .executeTakeFirstOrThrow()
	* ```
	*
	* The generated SQL (MS SQL Server):
	*
	* ```sql
	* update top(50) percent "person" set "first_name" = @1 where "age" > @2
	* ```
	*/
	top(expression, modifiers) {
		return new _a$2({
			...this.#props,
			queryNode: QueryNode.cloneWithTop(this.#props.queryNode, parseTop(expression, modifiers))
		});
	}
	from(from) {
		return new _a$2({
			...this.#props,
			queryNode: UpdateQueryNode.cloneWithFromItems(this.#props.queryNode, parseTableExpressionOrList(from))
		});
	}
	innerJoin(...args) {
		return this.#join("InnerJoin", args);
	}
	leftJoin(...args) {
		return this.#join("LeftJoin", args);
	}
	rightJoin(...args) {
		return this.#join("RightJoin", args);
	}
	fullJoin(...args) {
		return this.#join("FullJoin", args);
	}
	#join(joinType, args) {
		return new _a$2({
			...this.#props,
			queryNode: QueryNode.cloneWithJoin(this.#props.queryNode, parseJoin(joinType, args))
		});
	}
	orderBy(...args) {
		return new _a$2({
			...this.#props,
			queryNode: QueryNode.cloneWithOrderByItems(this.#props.queryNode, parseOrderBy(args))
		});
	}
	clearOrderBy() {
		return new _a$2({
			...this.#props,
			queryNode: QueryNode.cloneWithoutOrderBy(this.#props.queryNode)
		});
	}
	/**
	* Adds a limit clause to the update query for supported databases, such as MySQL.
	*
	* ### Examples
	*
	* Update the first 2 rows in the 'person' table:
	*
	* ```ts
	* await db
	*   .updateTable('person')
	*   .set({ first_name: 'Foo' })
	*   .limit(2)
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* update `person` set `first_name` = ? limit ?
	* ```
	*/
	limit(limit) {
		return new _a$2({
			...this.#props,
			queryNode: UpdateQueryNode.cloneWithLimit(this.#props.queryNode, LimitNode.create(parseValueExpression(limit)))
		});
	}
	set(...args) {
		return new _a$2({
			...this.#props,
			queryNode: UpdateQueryNode.cloneWithUpdates(this.#props.queryNode, parseUpdate(...args))
		});
	}
	returning(selection) {
		return new _a$2({
			...this.#props,
			queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectArg(selection))
		});
	}
	returningAll(table) {
		return new _a$2({
			...this.#props,
			queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectAll(table))
		});
	}
	output(args) {
		return new _a$2({
			...this.#props,
			queryNode: QueryNode.cloneWithOutput(this.#props.queryNode, parseSelectArg(args))
		});
	}
	outputAll(table) {
		return new _a$2({
			...this.#props,
			queryNode: QueryNode.cloneWithOutput(this.#props.queryNode, parseSelectAll(table))
		});
	}
	/**
	* This can be used to add any additional SQL to the end of the query.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.updateTable('person')
	*   .set({ age: 39 })
	*   .where('first_name', '=', 'John')
	*   .modifyEnd(sql.raw('-- This is a comment'))
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* update `person`
	* set `age` = 39
	* where `first_name` = "John" -- This is a comment
	* ```
	*/
	modifyEnd(modifier) {
		return new _a$2({
			...this.#props,
			queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, modifier.toOperationNode())
		});
	}
	/**
	* Clears all `returning` clauses from the query.
	*
	* ### Examples
	*
	* ```ts
	* db.updateTable('person')
	*   .returningAll()
	*   .set({ age: 39 })
	*   .where('first_name', '=', 'John')
	*   .clearReturning()
	* ```
	*
	* The generated SQL(PostgreSQL):
	*
	* ```sql
	* update "person" set "age" = 39 where "first_name" = "John"
	* ```
	*/
	clearReturning() {
		return new _a$2({
			...this.#props,
			queryNode: QueryNode.cloneWithoutReturning(this.#props.queryNode)
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*
	* If you want to conditionally call a method on `this`, see
	* the {@link $if} method.
	*
	* ### Examples
	*
	* The next example uses a helper function `log` to log a query:
	*
	* ```ts
	* import type { Compilable } from 'kysely'
	* import type { PersonUpdate } from 'type-editor' // imaginary module
	*
	* function log<T extends Compilable>(qb: T): T {
	*   console.log(qb.compile())
	*   return qb
	* }
	*
	* const values = {
	*   first_name: 'John',
	* } satisfies PersonUpdate
	*
	* db.updateTable('person')
	*   .set(values)
	*   .$call(log)
	*   .execute()
	* ```
	*/
	$call(func) {
		return func(this);
	}
	/**
	* Call `func(this)` if `condition` is true.
	*
	* This method is especially handy with optional selects. Any `returning` or `returningAll`
	* method calls add columns as optional fields to the output type when called inside
	* the `func` callback. This is because we can't know if those selections were actually
	* made before running the code.
	*
	* You can also call any other methods inside the callback.
	*
	* ### Examples
	*
	* ```ts
	* import type { PersonUpdate } from 'type-editor' // imaginary module
	*
	* async function updatePerson(id: number, updates: PersonUpdate, returnLastName: boolean) {
	*   return await db
	*     .updateTable('person')
	*     .set(updates)
	*     .where('id', '=', id)
	*     .returning(['id', 'first_name'])
	*     .$if(returnLastName, (qb) => qb.returning('last_name'))
	*     .executeTakeFirstOrThrow()
	* }
	* ```
	*
	* Any selections added inside the `if` callback will be added as optional fields to the
	* output type since we can't know if the selections were actually made before running
	* the code. In the example above the return type of the `updatePerson` function is:
	*
	* ```ts
	* Promise<{
	*   id: number
	*   first_name: string
	*   last_name?: string
	* }>
	* ```
	*/
	$if(condition, func) {
		if (condition) return func(this);
		return new _a$2({ ...this.#props });
	}
	/**
	* Change the output type of the query.
	*
	* This method call doesn't change the SQL in any way. This methods simply
	* returns a copy of this `UpdateQueryBuilder` with a new output type.
	*/
	$castTo() {
		return new _a$2(this.#props);
	}
	/**
	* Narrows (parts of) the output type of the query.
	*
	* Kysely tries to be as type-safe as possible, but in some cases we have to make
	* compromises for better maintainability and compilation performance. At present,
	* Kysely doesn't narrow the output type of the query based on {@link set} input
	* when using {@link where} and/or {@link returning} or {@link returningAll}.
	*
	* This utility method is very useful for these situations, as it removes unncessary
	* runtime assertion/guard code. Its input type is limited to the output type
	* of the query, so you can't add a column that doesn't exist, or change a column's
	* type to something that doesn't exist in its union type.
	*
	* ### Examples
	*
	* Turn this code:
	*
	* ```ts
	* import type { Person } from 'type-editor' // imaginary module
	*
	* const id = 1
	* const now = new Date().toISOString()
	*
	* const person = await db.updateTable('person')
	*   .set({ deleted_at: now })
	*   .where('id', '=', id)
	*   .where('nullable_column', 'is not', null)
	*   .returningAll()
	*   .executeTakeFirstOrThrow()
	*
	* if (isWithNoNullValue(person)) {
	*   functionThatExpectsPersonWithNonNullValue(person)
	* }
	*
	* function isWithNoNullValue(person: Person): person is Person & { nullable_column: string } {
	*   return person.nullable_column != null
	* }
	* ```
	*
	* Into this:
	*
	* ```ts
	* import type { NotNull } from 'kysely'
	*
	* const id = 1
	* const now = new Date().toISOString()
	*
	* const person = await db.updateTable('person')
	*   .set({ deleted_at: now })
	*   .where('id', '=', id)
	*   .where('nullable_column', 'is not', null)
	*   .returningAll()
	*   .$narrowType<{ deleted_at: Date; nullable_column: NotNull }>()
	*   .executeTakeFirstOrThrow()
	*
	* functionThatExpectsPersonWithNonNullValue(person)
	* ```
	*/
	$narrowType() {
		return new _a$2(this.#props);
	}
	/**
	* Asserts that query's output row type equals the given type `T`.
	*
	* This method can be used to simplify excessively complex types to make TypeScript happy
	* and much faster.
	*
	* Kysely uses complex type magic to achieve its type safety. This complexity is sometimes too much
	* for TypeScript and you get errors like this:
	*
	* ```
	* error TS2589: Type instantiation is excessively deep and possibly infinite.
	* ```
	*
	* In these case you can often use this method to help TypeScript a little bit. When you use this
	* method to assert the output type of a query, Kysely can drop the complex output type that
	* consists of multiple nested helper types and replace it with the simple asserted type.
	*
	* Using this method doesn't reduce type safety at all. You have to pass in a type that is
	* structurally equal to the current type.
	*
	* ### Examples
	*
	* ```ts
	* import type { PersonUpdate, PetUpdate, Species } from 'type-editor' // imaginary module
	*
	* const person = {
	*   id: 1,
	*   gender: 'other',
	* } satisfies PersonUpdate
	*
	* const pet = {
	*   name: 'Fluffy',
	* } satisfies PetUpdate
	*
	* const result = await db
	*   .with('updated_person', (qb) => qb
	*     .updateTable('person')
	*     .set(person)
	*     .where('id', '=', person.id)
	*     .returning('first_name')
	*     .$assertType<{ first_name: string }>()
	*   )
	*   .with('updated_pet', (qb) => qb
	*     .updateTable('pet')
	*     .set(pet)
	*     .where('owner_id', '=', person.id)
	*     .returning(['name as pet_name', 'species'])
	*     .$assertType<{ pet_name: string, species: Species }>()
	*   )
	*   .selectFrom(['updated_person', 'updated_pet'])
	*   .selectAll()
	*   .executeTakeFirstOrThrow()
	* ```
	*/
	$assertType() {
		return new _a$2(this.#props);
	}
	/**
	* Returns a copy of this UpdateQueryBuilder instance with the given plugin installed.
	*/
	withPlugin(plugin) {
		return new _a$2({
			...this.#props,
			executor: this.#props.executor.withPlugin(plugin)
		});
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.queryNode, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		const compiledQuery = this.compile();
		const result = await this.#props.executor.executeQuery(compiledQuery, options);
		const { adapter } = this.#props.executor;
		const query = compiledQuery.query;
		if (query.returning && adapter.supportsReturning || query.output && adapter.supportsOutput) return result.rows;
		return [new UpdateResult(result.numAffectedRows ?? BigInt(0), result.numChangedRows)];
	}
	async executeTakeFirst(options) {
		const [result] = await this.execute(options);
		return result;
	}
	async executeTakeFirstOrThrow(errorConstructorOrOptions) {
		if (typeof errorConstructorOrOptions === "function") errorConstructorOrOptions = { errorConstructor: errorConstructorOrOptions };
		const result = await this.executeTakeFirst(errorConstructorOrOptions);
		if (result === void 0) {
			const errorConstructor = errorConstructorOrOptions?.errorConstructor ?? NoResultError;
			throw isNoResultErrorConstructor(errorConstructor) ? new errorConstructor(this.toOperationNode()) : errorConstructor(this.toOperationNode());
		}
		return result;
	}
	async *stream(chunkSizeOrOptions) {
		if (typeof chunkSizeOrOptions !== "object") chunkSizeOrOptions = { chunkSize: chunkSizeOrOptions };
		const compiledQuery = this.compile();
		const stream = this.#props.executor.stream(compiledQuery, chunkSizeOrOptions.chunkSize ?? 100, chunkSizeOrOptions);
		for await (const item of stream) yield* item.rows;
	}
	async explain(format, options) {
		return await new _a$2({
			...this.#props,
			queryNode: QueryNode.cloneWithExplain(this.#props.queryNode, format, options)
		}).execute();
	}
};
_a$2 = UpdateQueryBuilder;
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/common-table-expression-name-node.js
/**
* @internal
*/
const CommonTableExpressionNameNode = freeze({
	is(node) {
		return node.kind === "CommonTableExpressionNameNode";
	},
	create(tableName, columnNames) {
		return freeze({
			kind: "CommonTableExpressionNameNode",
			table: TableNode.create(tableName),
			columns: columnNames ? freeze(columnNames.map(ColumnNode.create)) : void 0
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/common-table-expression-node.js
/**
* @internal
*/
const CommonTableExpressionNode = freeze({
	is(node) {
		return node.kind === "CommonTableExpressionNode";
	},
	create(name, expression) {
		return freeze({
			kind: "CommonTableExpressionNode",
			name,
			expression
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/query-builder/cte-builder.js
var CTEBuilder = class CTEBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Makes the common table expression materialized.
	*/
	materialized() {
		return new CTEBuilder({
			...this.#props,
			node: CommonTableExpressionNode.cloneWith(this.#props.node, { materialized: true })
		});
	}
	/**
	* Makes the common table expression not materialized.
	*/
	notMaterialized() {
		return new CTEBuilder({
			...this.#props,
			node: CommonTableExpressionNode.cloneWith(this.#props.node, { materialized: false })
		});
	}
	toOperationNode() {
		return this.#props.node;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/parser/with-parser.js
function parseCommonTableExpression(nameOrBuilderCallback, expression) {
	const expressionNode = isOperationNodeSource(expression) ? expression.toOperationNode() : expression(createQueryCreator()).toOperationNode();
	if (isFunction(nameOrBuilderCallback)) return nameOrBuilderCallback(cteBuilderFactory(expressionNode)).toOperationNode();
	return CommonTableExpressionNode.create(parseCommonTableExpressionName(nameOrBuilderCallback), expressionNode);
}
function cteBuilderFactory(expressionNode) {
	return (name) => {
		return new CTEBuilder({ node: CommonTableExpressionNode.create(parseCommonTableExpressionName(name), expressionNode) });
	};
}
function parseCommonTableExpressionName(name) {
	if (name.includes("(")) {
		const parts = name.split(/[\(\)]/);
		const table = parts[0];
		const columns = parts[1].split(",").map((it) => it.trim());
		return CommonTableExpressionNameNode.create(table, columns);
	} else return CommonTableExpressionNameNode.create(name);
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/with-node.js
/**
* @internal
*/
const WithNode = freeze({
	is(node) {
		return node.kind === "WithNode";
	},
	create(expression, params) {
		return freeze({
			kind: "WithNode",
			expressions: freeze([expression]),
			...params
		});
	},
	cloneWithExpression(withNode, expression) {
		return freeze({
			...withNode,
			expressions: freeze([...withNode.expressions, expression])
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/util/random-string.js
const CHARS = [
	"A",
	"B",
	"C",
	"D",
	"E",
	"F",
	"G",
	"H",
	"I",
	"J",
	"K",
	"L",
	"M",
	"N",
	"O",
	"P",
	"Q",
	"R",
	"S",
	"T",
	"U",
	"V",
	"W",
	"X",
	"Y",
	"Z",
	"a",
	"b",
	"c",
	"d",
	"e",
	"f",
	"g",
	"h",
	"i",
	"j",
	"k",
	"l",
	"m",
	"n",
	"o",
	"p",
	"q",
	"r",
	"s",
	"t",
	"u",
	"v",
	"w",
	"x",
	"y",
	"z",
	"0",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9"
];
function randomString(length) {
	let chars = "";
	for (let i = 0; i < length; ++i) chars += randomChar();
	return chars;
}
function randomChar() {
	return CHARS[~~(Math.random() * CHARS.length)];
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/util/query-id.js
function createQueryId() {
	return new LazyQueryId();
}
var LazyQueryId = class {
	#queryId;
	get queryId() {
		if (this.#queryId === void 0) this.#queryId = randomString(8);
		return this.#queryId;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/operation-node-transformer.js
/**
* Transforms an operation node tree into another one.
*
* Kysely queries are expressed internally as a tree of objects (operation nodes).
* `OperationNodeTransformer` takes such a tree as its input and returns a
* transformed deep copy of it. By default the `OperationNodeTransformer`
* does nothing. You need to override one or more methods to make it do
* something.
*
* There's a method for each node type. For example if you'd like to convert
* each identifier (table name, column name, alias etc.) from camelCase to
* snake_case, you'd do something like this:
*
* ```ts
* import { type IdentifierNode, OperationNodeTransformer } from 'kysely'
* import snakeCase from 'lodash/snakeCase'
*
* class CamelCaseTransformer extends OperationNodeTransformer {
*   override transformIdentifier(node: IdentifierNode): IdentifierNode {
*     node = super.transformIdentifier(node)
*
*     return {
*       ...node,
*       name: snakeCase(node.name),
*     }
*   }
* }
*
* const transformer = new CamelCaseTransformer()
*
* const query = db.selectFrom('person').select(['first_name', 'last_name'])
*
* const tree = transformer.transformNode(query.toOperationNode())
* ```
*/
var OperationNodeTransformer = class {
	nodeStack = [];
	#transformers = freeze({
		AliasNode: this.transformAlias.bind(this),
		ColumnNode: this.transformColumn.bind(this),
		IdentifierNode: this.transformIdentifier.bind(this),
		SchemableIdentifierNode: this.transformSchemableIdentifier.bind(this),
		RawNode: this.transformRaw.bind(this),
		ReferenceNode: this.transformReference.bind(this),
		SelectQueryNode: this.transformSelectQuery.bind(this),
		SelectionNode: this.transformSelection.bind(this),
		TableNode: this.transformTable.bind(this),
		FromNode: this.transformFrom.bind(this),
		SelectAllNode: this.transformSelectAll.bind(this),
		AndNode: this.transformAnd.bind(this),
		OrNode: this.transformOr.bind(this),
		ValueNode: this.transformValue.bind(this),
		ValueListNode: this.transformValueList.bind(this),
		PrimitiveValueListNode: this.transformPrimitiveValueList.bind(this),
		ParensNode: this.transformParens.bind(this),
		JoinNode: this.transformJoin.bind(this),
		OperatorNode: this.transformOperator.bind(this),
		WhereNode: this.transformWhere.bind(this),
		InsertQueryNode: this.transformInsertQuery.bind(this),
		DeleteQueryNode: this.transformDeleteQuery.bind(this),
		ReturningNode: this.transformReturning.bind(this),
		CreateTableNode: this.transformCreateTable.bind(this),
		AddColumnNode: this.transformAddColumn.bind(this),
		ColumnDefinitionNode: this.transformColumnDefinition.bind(this),
		DropTableNode: this.transformDropTable.bind(this),
		DataTypeNode: this.transformDataType.bind(this),
		OrderByNode: this.transformOrderBy.bind(this),
		OrderByItemNode: this.transformOrderByItem.bind(this),
		GroupByNode: this.transformGroupBy.bind(this),
		GroupByItemNode: this.transformGroupByItem.bind(this),
		UpdateQueryNode: this.transformUpdateQuery.bind(this),
		ColumnUpdateNode: this.transformColumnUpdate.bind(this),
		LimitNode: this.transformLimit.bind(this),
		OffsetNode: this.transformOffset.bind(this),
		OnConflictNode: this.transformOnConflict.bind(this),
		OnDuplicateKeyNode: this.transformOnDuplicateKey.bind(this),
		CreateIndexNode: this.transformCreateIndex.bind(this),
		DropIndexNode: this.transformDropIndex.bind(this),
		ListNode: this.transformList.bind(this),
		PrimaryKeyConstraintNode: this.transformPrimaryKeyConstraint.bind(this),
		UniqueConstraintNode: this.transformUniqueConstraint.bind(this),
		ReferencesNode: this.transformReferences.bind(this),
		CheckConstraintNode: this.transformCheckConstraint.bind(this),
		WithNode: this.transformWith.bind(this),
		CommonTableExpressionNode: this.transformCommonTableExpression.bind(this),
		CommonTableExpressionNameNode: this.transformCommonTableExpressionName.bind(this),
		HavingNode: this.transformHaving.bind(this),
		CreateSchemaNode: this.transformCreateSchema.bind(this),
		DropSchemaNode: this.transformDropSchema.bind(this),
		AlterTableNode: this.transformAlterTable.bind(this),
		DropColumnNode: this.transformDropColumn.bind(this),
		RenameColumnNode: this.transformRenameColumn.bind(this),
		AlterColumnNode: this.transformAlterColumn.bind(this),
		ModifyColumnNode: this.transformModifyColumn.bind(this),
		AddConstraintNode: this.transformAddConstraint.bind(this),
		DropConstraintNode: this.transformDropConstraint.bind(this),
		RenameConstraintNode: this.transformRenameConstraint.bind(this),
		ForeignKeyConstraintNode: this.transformForeignKeyConstraint.bind(this),
		CreateViewNode: this.transformCreateView.bind(this),
		RefreshMaterializedViewNode: this.transformRefreshMaterializedView.bind(this),
		DropViewNode: this.transformDropView.bind(this),
		GeneratedNode: this.transformGenerated.bind(this),
		DefaultValueNode: this.transformDefaultValue.bind(this),
		OnNode: this.transformOn.bind(this),
		ValuesNode: this.transformValues.bind(this),
		SelectModifierNode: this.transformSelectModifier.bind(this),
		CreateTypeNode: this.transformCreateType.bind(this),
		DropTypeNode: this.transformDropType.bind(this),
		ExplainNode: this.transformExplain.bind(this),
		DefaultInsertValueNode: this.transformDefaultInsertValue.bind(this),
		AggregateFunctionNode: this.transformAggregateFunction.bind(this),
		OverNode: this.transformOver.bind(this),
		PartitionByNode: this.transformPartitionBy.bind(this),
		PartitionByItemNode: this.transformPartitionByItem.bind(this),
		SetOperationNode: this.transformSetOperation.bind(this),
		BinaryOperationNode: this.transformBinaryOperation.bind(this),
		UnaryOperationNode: this.transformUnaryOperation.bind(this),
		UsingNode: this.transformUsing.bind(this),
		FunctionNode: this.transformFunction.bind(this),
		CaseNode: this.transformCase.bind(this),
		WhenNode: this.transformWhen.bind(this),
		JSONReferenceNode: this.transformJSONReference.bind(this),
		JSONPathNode: this.transformJSONPath.bind(this),
		JSONPathLegNode: this.transformJSONPathLeg.bind(this),
		JSONOperatorChainNode: this.transformJSONOperatorChain.bind(this),
		TupleNode: this.transformTuple.bind(this),
		MergeQueryNode: this.transformMergeQuery.bind(this),
		MatchedNode: this.transformMatched.bind(this),
		AddIndexNode: this.transformAddIndex.bind(this),
		CastNode: this.transformCast.bind(this),
		FetchNode: this.transformFetch.bind(this),
		TopNode: this.transformTop.bind(this),
		OutputNode: this.transformOutput.bind(this),
		OrActionNode: this.transformOrAction.bind(this),
		CollateNode: this.transformCollate.bind(this),
		AlterTypeNode: this.transformAlterType.bind(this),
		AddValueNode: this.transformAddValue.bind(this),
		RenameValueNode: this.transformRenameValue.bind(this)
	});
	transformNode(node, queryId) {
		if (!node) return node;
		this.nodeStack.push(node);
		const out = this.transformNodeImpl(node, queryId);
		this.nodeStack.pop();
		return freeze(out);
	}
	transformNodeImpl(node, queryId) {
		return this.#transformers[node.kind](node, queryId);
	}
	transformNodeList(list, queryId) {
		if (!list) return list;
		return freeze(list.map((node) => this.transformNode(node, queryId)));
	}
	transformSelectQuery(node, queryId) {
		return {
			kind: "SelectQueryNode",
			from: this.transformNode(node.from, queryId),
			selections: this.transformNodeList(node.selections, queryId),
			distinctOn: this.transformNodeList(node.distinctOn, queryId),
			joins: this.transformNodeList(node.joins, queryId),
			groupBy: this.transformNode(node.groupBy, queryId),
			orderBy: this.transformNode(node.orderBy, queryId),
			where: this.transformNode(node.where, queryId),
			frontModifiers: this.transformNodeList(node.frontModifiers, queryId),
			endModifiers: this.transformNodeList(node.endModifiers, queryId),
			limit: this.transformNode(node.limit, queryId),
			offset: this.transformNode(node.offset, queryId),
			with: this.transformNode(node.with, queryId),
			having: this.transformNode(node.having, queryId),
			explain: this.transformNode(node.explain, queryId),
			setOperations: this.transformNodeList(node.setOperations, queryId),
			fetch: this.transformNode(node.fetch, queryId),
			top: this.transformNode(node.top, queryId)
		};
	}
	transformSelection(node, queryId) {
		return {
			kind: "SelectionNode",
			selection: this.transformNode(node.selection, queryId)
		};
	}
	transformColumn(node, queryId) {
		return {
			kind: "ColumnNode",
			column: this.transformNode(node.column, queryId)
		};
	}
	transformAlias(node, queryId) {
		return {
			kind: "AliasNode",
			node: this.transformNode(node.node, queryId),
			alias: this.transformNode(node.alias, queryId)
		};
	}
	transformTable(node, queryId) {
		return {
			kind: "TableNode",
			table: this.transformNode(node.table, queryId)
		};
	}
	transformFrom(node, queryId) {
		return {
			kind: "FromNode",
			froms: this.transformNodeList(node.froms, queryId)
		};
	}
	transformReference(node, queryId) {
		return {
			kind: "ReferenceNode",
			column: this.transformNode(node.column, queryId),
			table: this.transformNode(node.table, queryId)
		};
	}
	transformAnd(node, queryId) {
		return {
			kind: "AndNode",
			left: this.transformNode(node.left, queryId),
			right: this.transformNode(node.right, queryId)
		};
	}
	transformOr(node, queryId) {
		return {
			kind: "OrNode",
			left: this.transformNode(node.left, queryId),
			right: this.transformNode(node.right, queryId)
		};
	}
	transformValueList(node, queryId) {
		return {
			kind: "ValueListNode",
			values: this.transformNodeList(node.values, queryId)
		};
	}
	transformParens(node, queryId) {
		return {
			kind: "ParensNode",
			node: this.transformNode(node.node, queryId)
		};
	}
	transformJoin(node, queryId) {
		return {
			kind: "JoinNode",
			joinType: node.joinType,
			table: this.transformNode(node.table, queryId),
			on: this.transformNode(node.on, queryId)
		};
	}
	transformRaw(node, queryId) {
		return {
			kind: "RawNode",
			sqlFragments: freeze([...node.sqlFragments]),
			parameters: this.transformNodeList(node.parameters, queryId)
		};
	}
	transformWhere(node, queryId) {
		return {
			kind: "WhereNode",
			where: this.transformNode(node.where, queryId)
		};
	}
	transformInsertQuery(node, queryId) {
		return {
			kind: "InsertQueryNode",
			into: this.transformNode(node.into, queryId),
			columns: this.transformNodeList(node.columns, queryId),
			values: this.transformNode(node.values, queryId),
			returning: this.transformNode(node.returning, queryId),
			onConflict: this.transformNode(node.onConflict, queryId),
			onDuplicateKey: this.transformNode(node.onDuplicateKey, queryId),
			endModifiers: this.transformNodeList(node.endModifiers, queryId),
			with: this.transformNode(node.with, queryId),
			orAction: this.transformNode(node.orAction, queryId),
			replace: node.replace,
			explain: this.transformNode(node.explain, queryId),
			defaultValues: node.defaultValues,
			top: this.transformNode(node.top, queryId),
			output: this.transformNode(node.output, queryId)
		};
	}
	transformValues(node, queryId) {
		return {
			kind: "ValuesNode",
			values: this.transformNodeList(node.values, queryId)
		};
	}
	transformDeleteQuery(node, queryId) {
		return {
			kind: "DeleteQueryNode",
			from: this.transformNode(node.from, queryId),
			using: this.transformNode(node.using, queryId),
			joins: this.transformNodeList(node.joins, queryId),
			where: this.transformNode(node.where, queryId),
			returning: this.transformNode(node.returning, queryId),
			endModifiers: this.transformNodeList(node.endModifiers, queryId),
			with: this.transformNode(node.with, queryId),
			orderBy: this.transformNode(node.orderBy, queryId),
			limit: this.transformNode(node.limit, queryId),
			explain: this.transformNode(node.explain, queryId),
			top: this.transformNode(node.top, queryId),
			output: this.transformNode(node.output, queryId)
		};
	}
	transformReturning(node, queryId) {
		return {
			kind: "ReturningNode",
			selections: this.transformNodeList(node.selections, queryId)
		};
	}
	transformCreateTable(node, queryId) {
		return {
			kind: "CreateTableNode",
			table: this.transformNode(node.table, queryId),
			columns: this.transformNodeList(node.columns, queryId),
			constraints: this.transformNodeList(node.constraints, queryId),
			indexes: this.transformNodeList(node.indexes, queryId),
			temporary: node.temporary,
			ifNotExists: node.ifNotExists,
			onCommit: node.onCommit,
			frontModifiers: this.transformNodeList(node.frontModifiers, queryId),
			endModifiers: this.transformNodeList(node.endModifiers, queryId),
			selectQuery: this.transformNode(node.selectQuery, queryId)
		};
	}
	transformColumnDefinition(node, queryId) {
		return {
			kind: "ColumnDefinitionNode",
			column: this.transformNode(node.column, queryId),
			dataType: this.transformNode(node.dataType, queryId),
			references: this.transformNode(node.references, queryId),
			primaryKey: node.primaryKey,
			autoIncrement: node.autoIncrement,
			unique: node.unique,
			notNull: node.notNull,
			unsigned: node.unsigned,
			defaultTo: this.transformNode(node.defaultTo, queryId),
			check: this.transformNode(node.check, queryId),
			generated: this.transformNode(node.generated, queryId),
			frontModifiers: this.transformNodeList(node.frontModifiers, queryId),
			endModifiers: this.transformNodeList(node.endModifiers, queryId),
			nullsNotDistinct: node.nullsNotDistinct,
			identity: node.identity,
			ifNotExists: node.ifNotExists
		};
	}
	transformAddColumn(node, queryId) {
		return {
			kind: "AddColumnNode",
			column: this.transformNode(node.column, queryId)
		};
	}
	transformDropTable(node, queryId) {
		return {
			kind: "DropTableNode",
			table: this.transformNode(node.table, queryId),
			ifExists: node.ifExists,
			cascade: node.cascade,
			temporary: node.temporary
		};
	}
	transformOrderBy(node, queryId) {
		return {
			kind: "OrderByNode",
			items: this.transformNodeList(node.items, queryId)
		};
	}
	transformOrderByItem(node, queryId) {
		return {
			kind: "OrderByItemNode",
			orderBy: this.transformNode(node.orderBy, queryId),
			direction: this.transformNode(node.direction, queryId),
			collation: this.transformNode(node.collation, queryId),
			nulls: node.nulls
		};
	}
	transformGroupBy(node, queryId) {
		return {
			kind: "GroupByNode",
			items: this.transformNodeList(node.items, queryId)
		};
	}
	transformGroupByItem(node, queryId) {
		return {
			kind: "GroupByItemNode",
			groupBy: this.transformNode(node.groupBy, queryId)
		};
	}
	transformUpdateQuery(node, queryId) {
		return {
			kind: "UpdateQueryNode",
			table: this.transformNode(node.table, queryId),
			from: this.transformNode(node.from, queryId),
			joins: this.transformNodeList(node.joins, queryId),
			where: this.transformNode(node.where, queryId),
			updates: this.transformNodeList(node.updates, queryId),
			returning: this.transformNode(node.returning, queryId),
			endModifiers: this.transformNodeList(node.endModifiers, queryId),
			with: this.transformNode(node.with, queryId),
			explain: this.transformNode(node.explain, queryId),
			limit: this.transformNode(node.limit, queryId),
			top: this.transformNode(node.top, queryId),
			output: this.transformNode(node.output, queryId),
			orderBy: this.transformNode(node.orderBy, queryId)
		};
	}
	transformColumnUpdate(node, queryId) {
		return {
			kind: "ColumnUpdateNode",
			column: this.transformNode(node.column, queryId),
			value: this.transformNode(node.value, queryId)
		};
	}
	transformLimit(node, queryId) {
		return {
			kind: "LimitNode",
			limit: this.transformNode(node.limit, queryId)
		};
	}
	transformOffset(node, queryId) {
		return {
			kind: "OffsetNode",
			offset: this.transformNode(node.offset, queryId)
		};
	}
	transformOnConflict(node, queryId) {
		return {
			kind: "OnConflictNode",
			columns: this.transformNodeList(node.columns, queryId),
			constraint: this.transformNode(node.constraint, queryId),
			indexExpression: this.transformNode(node.indexExpression, queryId),
			indexWhere: this.transformNode(node.indexWhere, queryId),
			updates: this.transformNodeList(node.updates, queryId),
			updateWhere: this.transformNode(node.updateWhere, queryId),
			doNothing: node.doNothing
		};
	}
	transformOnDuplicateKey(node, queryId) {
		return {
			kind: "OnDuplicateKeyNode",
			updates: this.transformNodeList(node.updates, queryId)
		};
	}
	transformCreateIndex(node, queryId) {
		return {
			kind: "CreateIndexNode",
			name: this.transformNode(node.name, queryId),
			table: this.transformNode(node.table, queryId),
			columns: this.transformNodeList(node.columns, queryId),
			unique: node.unique,
			using: this.transformNode(node.using, queryId),
			ifNotExists: node.ifNotExists,
			where: this.transformNode(node.where, queryId),
			nullsNotDistinct: node.nullsNotDistinct
		};
	}
	transformList(node, queryId) {
		return {
			kind: "ListNode",
			items: this.transformNodeList(node.items, queryId)
		};
	}
	transformDropIndex(node, queryId) {
		return {
			kind: "DropIndexNode",
			name: this.transformNode(node.name, queryId),
			table: this.transformNode(node.table, queryId),
			ifExists: node.ifExists,
			cascade: node.cascade
		};
	}
	transformPrimaryKeyConstraint(node, queryId) {
		return {
			kind: "PrimaryKeyConstraintNode",
			columns: this.transformNodeList(node.columns, queryId),
			name: this.transformNode(node.name, queryId),
			deferrable: node.deferrable,
			initiallyDeferred: node.initiallyDeferred
		};
	}
	transformUniqueConstraint(node, queryId) {
		return {
			kind: "UniqueConstraintNode",
			columns: this.transformNodeList(node.columns, queryId),
			name: this.transformNode(node.name, queryId),
			nullsNotDistinct: node.nullsNotDistinct,
			deferrable: node.deferrable,
			initiallyDeferred: node.initiallyDeferred
		};
	}
	transformForeignKeyConstraint(node, queryId) {
		return {
			kind: "ForeignKeyConstraintNode",
			columns: this.transformNodeList(node.columns, queryId),
			references: this.transformNode(node.references, queryId),
			name: this.transformNode(node.name, queryId),
			onDelete: node.onDelete,
			onUpdate: node.onUpdate,
			deferrable: node.deferrable,
			initiallyDeferred: node.initiallyDeferred
		};
	}
	transformSetOperation(node, queryId) {
		return {
			kind: "SetOperationNode",
			operator: node.operator,
			expression: this.transformNode(node.expression, queryId),
			all: node.all
		};
	}
	transformReferences(node, queryId) {
		return {
			kind: "ReferencesNode",
			table: this.transformNode(node.table, queryId),
			columns: this.transformNodeList(node.columns, queryId),
			onDelete: node.onDelete,
			onUpdate: node.onUpdate
		};
	}
	transformCheckConstraint(node, queryId) {
		return {
			kind: "CheckConstraintNode",
			expression: this.transformNode(node.expression, queryId),
			name: this.transformNode(node.name, queryId)
		};
	}
	transformWith(node, queryId) {
		return {
			kind: "WithNode",
			expressions: this.transformNodeList(node.expressions, queryId),
			recursive: node.recursive
		};
	}
	transformCommonTableExpression(node, queryId) {
		return {
			kind: "CommonTableExpressionNode",
			name: this.transformNode(node.name, queryId),
			materialized: node.materialized,
			expression: this.transformNode(node.expression, queryId)
		};
	}
	transformCommonTableExpressionName(node, queryId) {
		return {
			kind: "CommonTableExpressionNameNode",
			table: this.transformNode(node.table, queryId),
			columns: this.transformNodeList(node.columns, queryId)
		};
	}
	transformHaving(node, queryId) {
		return {
			kind: "HavingNode",
			having: this.transformNode(node.having, queryId)
		};
	}
	transformCreateSchema(node, queryId) {
		return {
			kind: "CreateSchemaNode",
			schema: this.transformNode(node.schema, queryId),
			ifNotExists: node.ifNotExists
		};
	}
	transformDropSchema(node, queryId) {
		return {
			kind: "DropSchemaNode",
			schema: this.transformNode(node.schema, queryId),
			ifExists: node.ifExists,
			cascade: node.cascade
		};
	}
	transformAlterTable(node, queryId) {
		return {
			kind: "AlterTableNode",
			table: this.transformNode(node.table, queryId),
			renameTo: this.transformNode(node.renameTo, queryId),
			setSchema: this.transformNode(node.setSchema, queryId),
			columnAlterations: this.transformNodeList(node.columnAlterations, queryId),
			addConstraint: this.transformNode(node.addConstraint, queryId),
			dropConstraint: this.transformNode(node.dropConstraint, queryId),
			renameConstraint: this.transformNode(node.renameConstraint, queryId),
			addIndex: this.transformNode(node.addIndex, queryId),
			dropIndex: this.transformNode(node.dropIndex, queryId)
		};
	}
	transformDropColumn(node, queryId) {
		return {
			kind: "DropColumnNode",
			column: this.transformNode(node.column, queryId),
			ifExists: node.ifExists
		};
	}
	transformRenameColumn(node, queryId) {
		return {
			kind: "RenameColumnNode",
			column: this.transformNode(node.column, queryId),
			renameTo: this.transformNode(node.renameTo, queryId)
		};
	}
	transformAlterColumn(node, queryId) {
		return {
			kind: "AlterColumnNode",
			column: this.transformNode(node.column, queryId),
			dataType: this.transformNode(node.dataType, queryId),
			dataTypeExpression: this.transformNode(node.dataTypeExpression, queryId),
			setDefault: this.transformNode(node.setDefault, queryId),
			dropDefault: node.dropDefault,
			setNotNull: node.setNotNull,
			dropNotNull: node.dropNotNull
		};
	}
	transformModifyColumn(node, queryId) {
		return {
			kind: "ModifyColumnNode",
			column: this.transformNode(node.column, queryId)
		};
	}
	transformAddConstraint(node, queryId) {
		return {
			kind: "AddConstraintNode",
			constraint: this.transformNode(node.constraint, queryId)
		};
	}
	transformDropConstraint(node, queryId) {
		return {
			kind: "DropConstraintNode",
			constraintName: this.transformNode(node.constraintName, queryId),
			ifExists: node.ifExists,
			modifier: node.modifier
		};
	}
	transformRenameConstraint(node, queryId) {
		return {
			kind: "RenameConstraintNode",
			oldName: this.transformNode(node.oldName, queryId),
			newName: this.transformNode(node.newName, queryId)
		};
	}
	transformCreateView(node, queryId) {
		return {
			kind: "CreateViewNode",
			name: this.transformNode(node.name, queryId),
			temporary: node.temporary,
			orReplace: node.orReplace,
			ifNotExists: node.ifNotExists,
			materialized: node.materialized,
			columns: this.transformNodeList(node.columns, queryId),
			as: this.transformNode(node.as, queryId)
		};
	}
	transformRefreshMaterializedView(node, queryId) {
		return {
			kind: "RefreshMaterializedViewNode",
			name: this.transformNode(node.name, queryId),
			concurrently: node.concurrently,
			withNoData: node.withNoData
		};
	}
	transformDropView(node, queryId) {
		return {
			kind: "DropViewNode",
			name: this.transformNode(node.name, queryId),
			ifExists: node.ifExists,
			materialized: node.materialized,
			cascade: node.cascade
		};
	}
	transformGenerated(node, queryId) {
		return {
			kind: "GeneratedNode",
			byDefault: node.byDefault,
			always: node.always,
			identity: node.identity,
			stored: node.stored,
			expression: this.transformNode(node.expression, queryId)
		};
	}
	transformDefaultValue(node, queryId) {
		return {
			kind: "DefaultValueNode",
			defaultValue: this.transformNode(node.defaultValue, queryId)
		};
	}
	transformOn(node, queryId) {
		return {
			kind: "OnNode",
			on: this.transformNode(node.on, queryId)
		};
	}
	transformSelectModifier(node, queryId) {
		return {
			kind: "SelectModifierNode",
			modifier: node.modifier,
			rawModifier: this.transformNode(node.rawModifier, queryId),
			of: this.transformNodeList(node.of, queryId)
		};
	}
	transformCreateType(node, queryId) {
		return {
			kind: "CreateTypeNode",
			name: this.transformNode(node.name, queryId),
			enum: this.transformNode(node.enum, queryId)
		};
	}
	transformDropType(node, queryId) {
		return {
			kind: "DropTypeNode",
			name: this.transformNode(node.name, queryId),
			additionalNames: this.transformNodeList(node.additionalNames, queryId),
			cascade: node.cascade,
			ifExists: node.ifExists
		};
	}
	transformExplain(node, queryId) {
		return {
			kind: "ExplainNode",
			format: node.format,
			options: this.transformNode(node.options, queryId)
		};
	}
	transformSchemableIdentifier(node, queryId) {
		return {
			kind: "SchemableIdentifierNode",
			schema: this.transformNode(node.schema, queryId),
			identifier: this.transformNode(node.identifier, queryId)
		};
	}
	transformAggregateFunction(node, queryId) {
		return {
			kind: "AggregateFunctionNode",
			func: node.func,
			aggregated: this.transformNodeList(node.aggregated, queryId),
			distinct: node.distinct,
			orderBy: this.transformNode(node.orderBy, queryId),
			withinGroup: this.transformNode(node.withinGroup, queryId),
			filter: this.transformNode(node.filter, queryId),
			over: this.transformNode(node.over, queryId)
		};
	}
	transformOver(node, queryId) {
		return {
			kind: "OverNode",
			orderBy: this.transformNode(node.orderBy, queryId),
			partitionBy: this.transformNode(node.partitionBy, queryId)
		};
	}
	transformPartitionBy(node, queryId) {
		return {
			kind: "PartitionByNode",
			items: this.transformNodeList(node.items, queryId)
		};
	}
	transformPartitionByItem(node, queryId) {
		return {
			kind: "PartitionByItemNode",
			partitionBy: this.transformNode(node.partitionBy, queryId)
		};
	}
	transformBinaryOperation(node, queryId) {
		return {
			kind: "BinaryOperationNode",
			leftOperand: this.transformNode(node.leftOperand, queryId),
			operator: this.transformNode(node.operator, queryId),
			rightOperand: this.transformNode(node.rightOperand, queryId)
		};
	}
	transformUnaryOperation(node, queryId) {
		return {
			kind: "UnaryOperationNode",
			operator: this.transformNode(node.operator, queryId),
			operand: this.transformNode(node.operand, queryId)
		};
	}
	transformUsing(node, queryId) {
		return {
			kind: "UsingNode",
			tables: this.transformNodeList(node.tables, queryId)
		};
	}
	transformFunction(node, queryId) {
		return {
			kind: "FunctionNode",
			func: node.func,
			arguments: this.transformNodeList(node.arguments, queryId)
		};
	}
	transformCase(node, queryId) {
		return {
			kind: "CaseNode",
			value: this.transformNode(node.value, queryId),
			when: this.transformNodeList(node.when, queryId),
			else: this.transformNode(node.else, queryId),
			isStatement: node.isStatement
		};
	}
	transformWhen(node, queryId) {
		return {
			kind: "WhenNode",
			condition: this.transformNode(node.condition, queryId),
			result: this.transformNode(node.result, queryId)
		};
	}
	transformJSONReference(node, queryId) {
		return {
			kind: "JSONReferenceNode",
			reference: this.transformNode(node.reference, queryId),
			traversal: this.transformNode(node.traversal, queryId)
		};
	}
	transformJSONPath(node, queryId) {
		return {
			kind: "JSONPathNode",
			inOperator: this.transformNode(node.inOperator, queryId),
			pathLegs: this.transformNodeList(node.pathLegs, queryId)
		};
	}
	transformJSONPathLeg(node, _queryId) {
		return {
			kind: "JSONPathLegNode",
			type: node.type,
			value: node.value
		};
	}
	transformJSONOperatorChain(node, queryId) {
		return {
			kind: "JSONOperatorChainNode",
			operator: this.transformNode(node.operator, queryId),
			values: this.transformNodeList(node.values, queryId)
		};
	}
	transformTuple(node, queryId) {
		return {
			kind: "TupleNode",
			values: this.transformNodeList(node.values, queryId)
		};
	}
	transformMergeQuery(node, queryId) {
		return {
			kind: "MergeQueryNode",
			into: this.transformNode(node.into, queryId),
			using: this.transformNode(node.using, queryId),
			whens: this.transformNodeList(node.whens, queryId),
			with: this.transformNode(node.with, queryId),
			top: this.transformNode(node.top, queryId),
			endModifiers: this.transformNodeList(node.endModifiers, queryId),
			output: this.transformNode(node.output, queryId),
			returning: this.transformNode(node.returning, queryId)
		};
	}
	transformMatched(node, _queryId) {
		return {
			kind: "MatchedNode",
			not: node.not,
			bySource: node.bySource
		};
	}
	transformAddIndex(node, queryId) {
		return {
			kind: "AddIndexNode",
			name: this.transformNode(node.name, queryId),
			columns: this.transformNodeList(node.columns, queryId),
			unique: node.unique,
			using: this.transformNode(node.using, queryId),
			ifNotExists: node.ifNotExists
		};
	}
	transformCast(node, queryId) {
		return {
			kind: "CastNode",
			expression: this.transformNode(node.expression, queryId),
			dataType: this.transformNode(node.dataType, queryId)
		};
	}
	transformFetch(node, queryId) {
		return {
			kind: "FetchNode",
			rowCount: this.transformNode(node.rowCount, queryId),
			modifier: node.modifier
		};
	}
	transformTop(node, _queryId) {
		return {
			kind: "TopNode",
			expression: node.expression,
			modifiers: node.modifiers
		};
	}
	transformOutput(node, queryId) {
		return {
			kind: "OutputNode",
			selections: this.transformNodeList(node.selections, queryId)
		};
	}
	transformAlterType(node, queryId) {
		return {
			kind: "AlterTypeNode",
			name: this.transformNode(node.name, queryId),
			addValue: this.transformNode(node.addValue, queryId),
			renameTo: this.transformNode(node.renameTo, queryId),
			renameValue: this.transformNode(node.renameValue, queryId),
			setSchema: this.transformNode(node.setSchema, queryId)
		};
	}
	transformAddValue(node, queryId) {
		return {
			kind: "AddValueNode",
			value: this.transformNode(node.value, queryId),
			ifNotExists: node.ifNotExists,
			isBefore: node.isBefore,
			neighborValue: this.transformNode(node.neighborValue, queryId)
		};
	}
	transformRenameValue(node, queryId) {
		return {
			kind: "RenameValueNode",
			oldValue: this.transformNode(node.oldValue, queryId),
			newValue: this.transformNode(node.newValue, queryId)
		};
	}
	transformDataType(node, _queryId) {
		return node;
	}
	transformSelectAll(node, _queryId) {
		return node;
	}
	transformIdentifier(node, _queryId) {
		return node;
	}
	transformValue(node, _queryId) {
		return node;
	}
	transformPrimitiveValueList(node, _queryId) {
		return node;
	}
	transformOperator(node, _queryId) {
		return node;
	}
	transformDefaultInsertValue(node, _queryId) {
		return node;
	}
	transformOrAction(node, _queryId) {
		return node;
	}
	transformCollate(node, _queryId) {
		return node;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/operation-node.js
function isOperationNode(thing) {
	return isObject(thing) && isString(thing.kind);
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/root-operation-node.js
const ROOT_OPERATION_NODE_KINDS = {
	AlterTableNode: true,
	AlterTypeNode: true,
	CreateIndexNode: true,
	CreateSchemaNode: true,
	CreateTableNode: true,
	CreateTypeNode: true,
	CreateViewNode: true,
	DeleteQueryNode: true,
	DropIndexNode: true,
	DropSchemaNode: true,
	DropTableNode: true,
	DropTypeNode: true,
	RefreshMaterializedViewNode: true,
	DropViewNode: true,
	InsertQueryNode: true,
	RawNode: true,
	SelectQueryNode: true,
	UpdateQueryNode: true,
	MergeQueryNode: true
};
function isRootOperationNode(thing) {
	return isOperationNode(thing) && ROOT_OPERATION_NODE_KINDS[thing.kind] === true;
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/plugin/with-schema/with-schema-transformer.js
const SCHEMALESS_FUNCTIONS = freeze({
	json_agg: true,
	to_json: true
});
var WithSchemaTransformer = class extends OperationNodeTransformer {
	#schema;
	#schemableIds = /* @__PURE__ */ new Set();
	#ctes = /* @__PURE__ */ new Set();
	constructor(schema) {
		super();
		this.#schema = schema;
	}
	transformNodeImpl(node, queryId) {
		if (!isRootOperationNode(node)) return super.transformNodeImpl(node, queryId);
		const ctes = this.#collectCTEs(node);
		for (const cte of ctes) this.#ctes.add(cte);
		const tables = this.#collectSchemableIds(node);
		for (const table of tables) this.#schemableIds.add(table);
		const transformed = super.transformNodeImpl(node, queryId);
		for (const table of tables) this.#schemableIds.delete(table);
		for (const cte of ctes) this.#ctes.delete(cte);
		return transformed;
	}
	transformSchemableIdentifier(node, queryId) {
		const transformed = super.transformSchemableIdentifier(node, queryId);
		if (transformed.schema || !this.#schemableIds.has(node.identifier.name)) return transformed;
		return {
			...transformed,
			schema: IdentifierNode.create(this.#schema)
		};
	}
	transformReferences(node, queryId) {
		const transformed = super.transformReferences(node, queryId);
		if (transformed.table.table.schema) return transformed;
		return {
			...transformed,
			table: TableNode.createWithSchema(this.#schema, transformed.table.table.identifier.name)
		};
	}
	transformAggregateFunction(node, queryId) {
		return {
			...super.transformAggregateFunction({
				...node,
				aggregated: []
			}, queryId),
			aggregated: this.#transformTableArgsWithoutSchemas(node, queryId, "aggregated")
		};
	}
	transformFunction(node, queryId) {
		return {
			...super.transformFunction({
				...node,
				arguments: []
			}, queryId),
			arguments: this.#transformTableArgsWithoutSchemas(node, queryId, "arguments")
		};
	}
	transformSelectModifier(node, queryId) {
		return {
			...super.transformSelectModifier({
				...node,
				of: void 0
			}, queryId),
			of: node.of?.map((item) => TableNode.is(item) && !item.table.schema ? {
				...item,
				table: this.transformIdentifier(item.table.identifier, queryId)
			} : this.transformNode(item, queryId))
		};
	}
	#transformTableArgsWithoutSchemas(node, queryId, argsKey) {
		return SCHEMALESS_FUNCTIONS[node.func] ? node[argsKey].map((arg) => !TableNode.is(arg) || arg.table.schema ? this.transformNode(arg, queryId) : {
			...arg,
			table: this.transformIdentifier(arg.table.identifier, queryId)
		}) : this.transformNodeList(node[argsKey], queryId);
	}
	#collectSchemableIds(node) {
		const schemableIds = /* @__PURE__ */ new Set();
		if ("name" in node && node.name && SchemableIdentifierNode.is(node.name)) this.#collectSchemableId(node.name, schemableIds);
		if ("from" in node && node.from) for (const from of node.from.froms) this.#collectSchemableIdsFromTableExpr(from, schemableIds);
		if ("into" in node && node.into) this.#collectSchemableIdsFromTableExpr(node.into, schemableIds);
		if ("table" in node && node.table) this.#collectSchemableIdsFromTableExpr(node.table, schemableIds);
		if ("joins" in node && node.joins) for (const join of node.joins) this.#collectSchemableIdsFromTableExpr(join.table, schemableIds);
		if ("using" in node && node.using) {
			if (JoinNode.is(node.using)) this.#collectSchemableIdsFromTableExpr(node.using.table, schemableIds);
			else this.#collectSchemableIdsFromTableExpr(node.using, schemableIds);
		}
		return schemableIds;
	}
	#collectCTEs(node) {
		const ctes = /* @__PURE__ */ new Set();
		if ("with" in node && node.with) this.#collectCTEIds(node.with, ctes);
		return ctes;
	}
	#collectSchemableIdsFromTableExpr(node, schemableIds) {
		if (TableNode.is(node)) return this.#collectSchemableId(node.table, schemableIds);
		if (AliasNode.is(node) && TableNode.is(node.node)) return this.#collectSchemableId(node.node.table, schemableIds);
		if (ListNode.is(node)) {
			for (const table of node.items) this.#collectSchemableIdsFromTableExpr(table, schemableIds);
			return;
		}
		if (UsingNode.is(node)) {
			for (const table of node.tables) this.#collectSchemableIdsFromTableExpr(table, schemableIds);
			return;
		}
	}
	#collectSchemableId(node, schemableIds) {
		const id = node.identifier.name;
		if (!this.#schemableIds.has(id) && !this.#ctes.has(id)) schemableIds.add(id);
	}
	#collectCTEIds(node, ctes) {
		for (const expr of node.expressions) {
			const cteId = expr.name.table.table.identifier.name;
			if (!this.#ctes.has(cteId)) ctes.add(cteId);
		}
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/plugin/with-schema/with-schema-plugin.js
var WithSchemaPlugin = class {
	#transformer;
	constructor(schema) {
		this.#transformer = new WithSchemaTransformer(schema);
	}
	transformQuery(args) {
		return this.#transformer.transformNode(args.node, args.queryId);
	}
	async transformResult(args) {
		return args.result;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/matched-node.js
/**
* @internal
*/
const MatchedNode = freeze({
	is(node) {
		return node.kind === "MatchedNode";
	},
	create(not, bySource = false) {
		return freeze({
			kind: "MatchedNode",
			not,
			bySource
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/parser/merge-parser.js
function parseMergeWhen(type, args, refRight) {
	return WhenNode.create(parseFilterList([MatchedNode.create(!type.isMatched, type.bySource), ...args && args.length > 0 ? [args.length === 3 && refRight ? parseReferentialBinaryOperation(args[0], args[1], args[2]) : parseValueBinaryOperationOrExpression(args)] : []], "and", false));
}
function parseMergeThen(result) {
	if (isString(result)) return RawNode.create([result], []);
	if (isOperationNodeSource(result)) return result.toOperationNode();
	return result;
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/util/deferred.js
var Deferred = class {
	#promise;
	#resolve;
	#reject;
	constructor() {
		this.#promise = new Promise((resolve, reject) => {
			this.#reject = reject;
			this.#resolve = resolve;
		});
	}
	get promise() {
		return this.#promise;
	}
	resolve = (value) => {
		this.#resolve?.(value);
		this.#resolve = this.#reject = void 0;
	};
	reject = (reason) => {
		this.#reject?.(reason);
		this.#reject = this.#resolve = void 0;
	};
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/util/provide-controlled-connection.js
async function provideControlledConnection(connectionProvider, options) {
	const connectionDefer = new Deferred();
	const connectionReleaseDefer = new Deferred();
	connectionProvider.provideConnection(async (connection) => {
		connectionDefer.resolve(connection);
		return await connectionReleaseDefer.promise;
	}, options).catch((ex) => connectionDefer.reject(ex));
	return freeze({
		connection: await connectionDefer.promise,
		release: connectionReleaseDefer.resolve
	});
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/util/abort.js
function getInflightQueryAbortHandler(abortStrategy = "ignore query", connection, beforeThrow) {
	if (abortStrategy === "ignore query") return;
	if (abortStrategy === "cancel query") {
		const handler = connection.cancelQuery;
		if (!handler) {
			beforeThrow();
			throwUnsupportedInflightQueryAbortStrategyError(abortStrategy, connection.killSession ? "kill session" : void 0);
		}
		return handler.bind(connection);
	}
	if (abortStrategy === "kill session") {
		const handler = connection.killSession;
		if (!handler) {
			beforeThrow();
			throwUnsupportedInflightQueryAbortStrategyError(abortStrategy, connection.cancelQuery ? "cancel query" : void 0);
		}
		return handler.bind(connection);
	}
	beforeThrow();
	throw new Error(`Unexpected \`inflightQueryAbortStrategy\`: "${abortStrategy}"`);
}
function throwUnsupportedInflightQueryAbortStrategyError(abortStrategy, alt) {
	throw new Error(`This dialect doesn't support \`inflightQueryAbortStrategy\` "${abortStrategy}". Use "ignore query"${alt ? ` or "${alt}"` : ""} instead.`);
}
function assertNotAborted(signal, timing, beforeThrow) {
	if (signal?.aborted) {
		beforeThrow?.();
		throwReasonWithTiming(signal.reason, timing);
	}
}
function throwReasonWithTiming(reason, timing) {
	decorateWithTiming(reason, timing);
	throw reason;
}
const ABORTED = {};
async function waitOrAbort(promise, signal, name, onAbort) {
	if (!signal) return promise;
	assertNotAborted(signal, `before ${name}`, onAbort);
	const { promise: abortPromise, resolve } = new Deferred();
	const abortListener = () => resolve(ABORTED);
	signal.addEventListener("abort", abortListener);
	try {
		assertNotAborted(signal, `before ${name}`, onAbort);
		const result = await Promise.race([promise, abortPromise]);
		if (result !== ABORTED) return result;
		onAbort?.();
		throwReasonWithTiming(signal.reason, `during ${name}`);
	} finally {
		signal.removeEventListener("abort", abortListener);
		resolve(ABORTED);
	}
}
function printBackgroundFail(name) {
	return (reason) => console.error(`\`${name}\` failed in the background after abortion: ${getMessage(reason)}`);
}
function decorateWithTiming(reason, timing) {
	if (reason !== null && typeof reason === "object" && !Object.isFrozen(reason)) Object.defineProperty(reason, "__kysely_timing__", {
		configurable: true,
		enumerable: false,
		value: timing,
		writable: false
	});
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/query-executor/query-executor-base.js
const NO_PLUGINS = freeze([]);
var QueryExecutorBase = class {
	#plugins;
	constructor(plugins = NO_PLUGINS) {
		this.#plugins = plugins;
	}
	get plugins() {
		return this.#plugins;
	}
	transformQuery(node, queryId) {
		for (const plugin of this.#plugins) {
			const transformedNode = plugin.transformQuery({
				node,
				queryId
			});
			if (transformedNode.kind === node.kind) node = transformedNode;
			else throw new Error([
				`KyselyPlugin.transformQuery must return a node`,
				`of the same kind that was given to it.`,
				`The plugin was given a ${node.kind}`,
				`but it returned a ${transformedNode.kind}`
			].join(" "));
		}
		return node;
	}
	async executeQuery(compiledQuery, options) {
		const { inflightQueryAbortStrategy = "ignore query", signal } = options || {};
		if (!signal) {
			const result = await this.provideConnection(async (connection) => {
				return await connection.executeQuery(compiledQuery);
			}, options);
			return await this.#transformResult(result, compiledQuery.queryId);
		}
		assertNotAborted(signal, "before query execution");
		options = freeze({ signal });
		const { connection, release } = await provideControlledConnection(this, options);
		const controlConnectionProvider = this.provideConnection.bind(this);
		const { promise: abortPromise, resolve } = new Deferred();
		const abortListener = () => resolve(ABORTED);
		signal.addEventListener("abort", abortListener, { once: true });
		try {
			assertNotAborted(signal, "before query execution", release);
			const inflightQueryAbortHandler = getInflightQueryAbortHandler(inflightQueryAbortStrategy, connection, release);
			if (inflightQueryAbortHandler && connection.collectSessionInfo) {
				assertNotAborted(signal, "before query execution", release);
				const collectPromise = connection.collectSessionInfo();
				if (await Promise.race([abortPromise, collectPromise]).catch((error) => {
					release();
					throw error;
				}) === ABORTED) {
					collectPromise.catch(printBackgroundFail("collectSessionInfo")).finally(release);
					throwReasonWithTiming(signal.reason, "before query execution");
				}
			}
			const queryPromise = connection.executeQuery(compiledQuery, options);
			const result = await Promise.race([abortPromise, queryPromise]).catch((error) => {
				release();
				throw error;
			});
			if (result === ABORTED) {
				Promise.allSettled([queryPromise.catch(printBackgroundFail("query")), inflightQueryAbortHandler?.(controlConnectionProvider).catch(printBackgroundFail("inflightQueryAbortHandler"))]).finally(release);
				throwReasonWithTiming(signal.reason, "during query execution");
			} else release();
			const transformPromise = this.#transformResult(result, compiledQuery.queryId, options);
			const transformedResult = await Promise.race([abortPromise, transformPromise]);
			if (transformedResult === ABORTED) {
				transformPromise.catch(printBackgroundFail("plugins.transformResult"));
				throwReasonWithTiming(signal.reason, "during result transformation");
			}
			return transformedResult;
		} finally {
			resolve(ABORTED);
			signal.removeEventListener("abort", abortListener);
		}
	}
	async *stream(compiledQuery, chunkSize, options) {
		const { signal } = options || {};
		if (!signal) {
			const { connection, release } = await provideControlledConnection(this);
			try {
				for await (const result of connection.streamQuery(compiledQuery, chunkSize)) yield await this.#transformResult(result, compiledQuery.queryId, options);
			} finally {
				release();
			}
			return;
		}
		options = freeze({ signal });
		assertNotAborted(signal, "before connection acquisition");
		const { connection, release } = await provideControlledConnection(this, options);
		const { promise: abortPromise, resolve } = new Deferred();
		const abortListener = () => resolve(ABORTED);
		signal.addEventListener("abort", abortListener, { once: true });
		let asyncIterator;
		let releasePrerequisite;
		assertNotAborted(signal, "before query streaming", release);
		const { queryId } = compiledQuery;
		try {
			asyncIterator = connection.streamQuery(compiledQuery, chunkSize, options);
			while (true) {
				assertNotAborted(signal, "during query streaming");
				const nextPromise = asyncIterator.next();
				const result = await Promise.race([abortPromise, nextPromise]);
				if (result === ABORTED) {
					releasePrerequisite = nextPromise.catch(printBackgroundFail("iterator.next"));
					throwReasonWithTiming(signal.reason, "during query streaming");
				}
				if (result.done) break;
				const transformPromise = this.#transformResult(result.value, queryId, options);
				const transformedResult = await Promise.race([abortPromise, transformPromise]);
				if (transformedResult === ABORTED) {
					releasePrerequisite = transformPromise.catch(printBackgroundFail("plugins.transformResult"));
					throwReasonWithTiming(signal.reason, "during result transformation");
				}
				yield transformedResult;
			}
		} finally {
			resolve(ABORTED);
			signal.removeEventListener("abort", abortListener);
			const cleanup = (asyncIterator?.return?.() || Promise.resolve()).finally(() => releasePrerequisite).finally(release);
			if (!releasePrerequisite) await cleanup;
		}
	}
	async #transformResult(result, queryId, options) {
		const { signal } = options || {};
		for (const plugin of this.#plugins) result = await plugin.transformResult(freeze({
			queryId,
			result,
			signal
		}));
		return result;
	}
};
const NOOP_QUERY_EXECUTOR = new class NoopQueryExecutor extends QueryExecutorBase {
	get adapter() {
		throw new Error("this query cannot be compiled to SQL");
	}
	compileQuery() {
		throw new Error("this query cannot be compiled to SQL");
	}
	provideConnection() {
		throw new Error("this query cannot be executed");
	}
	withConnectionProvider() {
		throw new Error("this query cannot have a connection provider");
	}
	withPlugin(plugin) {
		return new NoopQueryExecutor([...this.plugins, plugin]);
	}
	withPlugins(plugins) {
		return new NoopQueryExecutor([...this.plugins, ...plugins]);
	}
	withPluginAtFront(plugin) {
		return new NoopQueryExecutor([plugin, ...this.plugins]);
	}
	withoutPlugins() {
		return new NoopQueryExecutor([]);
	}
}();
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/query-builder/merge-result.js
var MergeResult = class {
	numChangedRows;
	constructor(numChangedRows) {
		this.numChangedRows = numChangedRows;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/query-builder/merge-query-builder.js
var MergeQueryBuilder = class MergeQueryBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* This can be used to add any additional SQL to the end of the query.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db
	*   .mergeInto('person')
	*   .using('pet', 'pet.owner_id', 'person.id')
	*   .whenMatched()
	*   .thenDelete()
	*   .modifyEnd(sql.raw('-- this is a comment'))
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* merge into "person" using "pet" on "pet"."owner_id" = "person"."id" when matched then delete -- this is a comment
	* ```
	*/
	modifyEnd(modifier) {
		return new MergeQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, modifier.toOperationNode())
		});
	}
	/**
	* Changes a `merge into` query to an `merge top into` query.
	*
	* `top` clause is only supported by some dialects like MS SQL Server.
	*
	* ### Examples
	*
	* Affect 5 matched rows at most:
	*
	* ```ts
	* await db.mergeInto('person')
	*   .top(5)
	*   .using('pet', 'person.id', 'pet.owner_id')
	*   .whenMatched()
	*   .thenDelete()
	*   .execute()
	* ```
	*
	* The generated SQL (MS SQL Server):
	*
	* ```sql
	* merge top(5) into "person"
	* using "pet" on "person"."id" = "pet"."owner_id"
	* when matched then
	*   delete
	* ```
	*
	* Affect 50% of matched rows:
	*
	* ```ts
	* await db.mergeInto('person')
	*   .top(50, 'percent')
	*   .using('pet', 'person.id', 'pet.owner_id')
	*   .whenMatched()
	*   .thenDelete()
	*   .execute()
	* ```
	*
	* The generated SQL (MS SQL Server):
	*
	* ```sql
	* merge top(50) percent into "person"
	* using "pet" on "person"."id" = "pet"."owner_id"
	* when matched then
	*   delete
	* ```
	*/
	top(expression, modifiers) {
		return new MergeQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithTop(this.#props.queryNode, parseTop(expression, modifiers))
		});
	}
	using(...args) {
		return new WheneableMergeQueryBuilder({
			...this.#props,
			queryNode: MergeQueryNode.cloneWithUsing(this.#props.queryNode, parseJoin("Using", args))
		});
	}
	returning(args) {
		return new MergeQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectArg(args))
		});
	}
	returningAll(table) {
		return new MergeQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectAll(table))
		});
	}
	output(args) {
		return new MergeQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithOutput(this.#props.queryNode, parseSelectArg(args))
		});
	}
	outputAll(table) {
		return new MergeQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithOutput(this.#props.queryNode, parseSelectAll(table))
		});
	}
};
var WheneableMergeQueryBuilder = class WheneableMergeQueryBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* This can be used to add any additional SQL to the end of the query.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db
	*   .mergeInto('person')
	*   .using('pet', 'pet.owner_id', 'person.id')
	*   .whenMatched()
	*   .thenDelete()
	*   .modifyEnd(sql.raw('-- this is a comment'))
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* merge into "person" using "pet" on "pet"."owner_id" = "person"."id" when matched then delete -- this is a comment
	* ```
	*/
	modifyEnd(modifier) {
		return new WheneableMergeQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, modifier.toOperationNode())
		});
	}
	/**
	* See {@link MergeQueryBuilder.top}.
	*/
	top(expression, modifiers) {
		return new WheneableMergeQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithTop(this.#props.queryNode, parseTop(expression, modifiers))
		});
	}
	/**
	* Adds a simple `when matched` clause to the query.
	*
	* For a `when matched` clause with an `and` condition, see {@link whenMatchedAnd}.
	*
	* For a simple `when not matched` clause, see {@link whenNotMatched}.
	*
	* For a `when not matched` clause with an `and` condition, see {@link whenNotMatchedAnd}.
	*
	* ### Examples
	*
	* ```ts
	* const result = await db.mergeInto('person')
	*   .using('pet', 'person.id', 'pet.owner_id')
	*   .whenMatched()
	*   .thenDelete()
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* merge into "person"
	* using "pet" on "person"."id" = "pet"."owner_id"
	* when matched then
	*   delete
	* ```
	*/
	whenMatched() {
		return this.#whenMatched([]);
	}
	whenMatchedAnd(...args) {
		return this.#whenMatched(args);
	}
	/**
	* Adds the `when matched` clause to the query with an `and` condition. But unlike
	* {@link whenMatchedAnd}, this method accepts a column reference as the 3rd argument.
	*
	* This method is similar to {@link SelectQueryBuilder.whereRef}, so see the documentation
	* for that method for more examples.
	*/
	whenMatchedAndRef(lhs, op, rhs) {
		return this.#whenMatched([
			lhs,
			op,
			rhs
		], true);
	}
	#whenMatched(args, refRight) {
		return new MatchedThenableMergeQueryBuilder({
			...this.#props,
			queryNode: MergeQueryNode.cloneWithWhen(this.#props.queryNode, parseMergeWhen({ isMatched: true }, args, refRight))
		});
	}
	/**
	* Adds a simple `when not matched` clause to the query.
	*
	* For a `when not matched` clause with an `and` condition, see {@link whenNotMatchedAnd}.
	*
	* For a simple `when matched` clause, see {@link whenMatched}.
	*
	* For a `when matched` clause with an `and` condition, see {@link whenMatchedAnd}.
	*
	* ### Examples
	*
	* ```ts
	* const result = await db.mergeInto('person')
	*   .using('pet', 'person.id', 'pet.owner_id')
	*   .whenNotMatched()
	*   .thenInsertValues({
	*     first_name: 'John',
	*     last_name: 'Doe',
	*   })
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* merge into "person"
	* using "pet" on "person"."id" = "pet"."owner_id"
	* when not matched then
	*   insert ("first_name", "last_name") values ($1, $2)
	* ```
	*/
	whenNotMatched() {
		return this.#whenNotMatched([]);
	}
	whenNotMatchedAnd(...args) {
		return this.#whenNotMatched(args);
	}
	/**
	* Adds the `when not matched` clause to the query with an `and` condition. But unlike
	* {@link whenNotMatchedAnd}, this method accepts a column reference as the 3rd argument.
	*
	* Unlike {@link whenMatchedAndRef}, you cannot reference columns from the target table.
	*
	* This method is similar to {@link SelectQueryBuilder.whereRef}, so see the documentation
	* for that method for more examples.
	*/
	whenNotMatchedAndRef(lhs, op, rhs) {
		return this.#whenNotMatched([
			lhs,
			op,
			rhs
		], true);
	}
	/**
	* Adds a simple `when not matched by source` clause to the query.
	*
	* Supported in MS SQL Server.
	*
	* Similar to {@link whenNotMatched}, but returns a {@link MatchedThenableMergeQueryBuilder}.
	*/
	whenNotMatchedBySource() {
		return this.#whenNotMatched([], false, true);
	}
	whenNotMatchedBySourceAnd(...args) {
		return this.#whenNotMatched(args, false, true);
	}
	/**
	* Adds the `when not matched by source` clause to the query with an `and` condition.
	*
	* Similar to {@link whenNotMatchedAndRef}, but you can reference columns from
	* the target table, and not from source table and returns a {@link MatchedThenableMergeQueryBuilder}.
	*/
	whenNotMatchedBySourceAndRef(lhs, op, rhs) {
		return this.#whenNotMatched([
			lhs,
			op,
			rhs
		], true, true);
	}
	returning(args) {
		return new WheneableMergeQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectArg(args))
		});
	}
	returningAll(table) {
		return new WheneableMergeQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectAll(table))
		});
	}
	output(args) {
		return new WheneableMergeQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithOutput(this.#props.queryNode, parseSelectArg(args))
		});
	}
	outputAll(table) {
		return new WheneableMergeQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithOutput(this.#props.queryNode, parseSelectAll(table))
		});
	}
	#whenNotMatched(args, refRight = false, bySource = false) {
		const props = {
			...this.#props,
			queryNode: MergeQueryNode.cloneWithWhen(this.#props.queryNode, parseMergeWhen({
				isMatched: false,
				bySource
			}, args, refRight))
		};
		return new (bySource ? MatchedThenableMergeQueryBuilder : NotMatchedThenableMergeQueryBuilder)(props);
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*
	* If you want to conditionally call a method on `this`, see
	* the {@link $if} method.
	*
	* ### Examples
	*
	* The next example uses a helper function `log` to log a query:
	*
	* ```ts
	* import type { Compilable } from 'kysely'
	*
	* function log<T extends Compilable>(qb: T): T {
	*   console.log(qb.compile())
	*   return qb
	* }
	*
	* await db.updateTable('person')
	*   .set({ first_name: 'John' })
	*   .$call(log)
	*   .execute()
	* ```
	*/
	$call(func) {
		return func(this);
	}
	/**
	* Call `func(this)` if `condition` is true.
	*
	* This method is especially handy with optional selects. Any `returning` or `returningAll`
	* method calls add columns as optional fields to the output type when called inside
	* the `func` callback. This is because we can't know if those selections were actually
	* made before running the code.
	*
	* You can also call any other methods inside the callback.
	*
	* ### Examples
	*
	* ```ts
	* import type { PersonUpdate } from 'type-editor' // imaginary module
	*
	* async function updatePerson(id: number, updates: PersonUpdate, returnLastName: boolean) {
	*   return await db
	*     .updateTable('person')
	*     .set(updates)
	*     .where('id', '=', id)
	*     .returning(['id', 'first_name'])
	*     .$if(returnLastName, (qb) => qb.returning('last_name'))
	*     .executeTakeFirstOrThrow()
	* }
	* ```
	*
	* Any selections added inside the `if` callback will be added as optional fields to the
	* output type since we can't know if the selections were actually made before running
	* the code. In the example above the return type of the `updatePerson` function is:
	*
	* ```ts
	* Promise<{
	*   id: number
	*   first_name: string
	*   last_name?: string
	* }>
	* ```
	*/
	$if(condition, func) {
		if (condition) return func(this);
		return new WheneableMergeQueryBuilder({ ...this.#props });
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.queryNode, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		const compiledQuery = this.compile();
		const result = await this.#props.executor.executeQuery(compiledQuery, options);
		const { adapter } = this.#props.executor;
		const query = compiledQuery.query;
		if (query.returning && adapter.supportsReturning || query.output && adapter.supportsOutput) return result.rows;
		return [new MergeResult(result.numAffectedRows)];
	}
	async executeTakeFirst(options) {
		const [result] = await this.execute(options);
		return result;
	}
	async executeTakeFirstOrThrow(errorConstructorOrOptions) {
		if (typeof errorConstructorOrOptions === "function") errorConstructorOrOptions = { errorConstructor: errorConstructorOrOptions };
		const result = await this.executeTakeFirst(errorConstructorOrOptions);
		if (result === void 0) {
			const errorConstructor = errorConstructorOrOptions?.errorConstructor ?? NoResultError;
			throw isNoResultErrorConstructor(errorConstructor) ? new errorConstructor(this.toOperationNode()) : errorConstructor(this.toOperationNode());
		}
		return result;
	}
};
var MatchedThenableMergeQueryBuilder = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Performs the `delete` action.
	*
	* To perform the `do nothing` action, see {@link thenDoNothing}.
	*
	* To perform the `update` action, see {@link thenUpdate} or {@link thenUpdateSet}.
	*
	* ### Examples
	*
	* ```ts
	* const result = await db.mergeInto('person')
	*   .using('pet', 'person.id', 'pet.owner_id')
	*   .whenMatched()
	*   .thenDelete()
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* merge into "person"
	* using "pet" on "person"."id" = "pet"."owner_id"
	* when matched then
	*   delete
	* ```
	*/
	thenDelete() {
		return new WheneableMergeQueryBuilder({
			...this.#props,
			queryNode: MergeQueryNode.cloneWithThen(this.#props.queryNode, parseMergeThen("delete"))
		});
	}
	/**
	* Performs the `do nothing` action.
	*
	* This is supported in PostgreSQL.
	*
	* To perform the `delete` action, see {@link thenDelete}.
	*
	* To perform the `update` action, see {@link thenUpdate} or {@link thenUpdateSet}.
	*
	* ### Examples
	*
	* ```ts
	* const result = await db.mergeInto('person')
	*   .using('pet', 'person.id', 'pet.owner_id')
	*   .whenMatched()
	*   .thenDoNothing()
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* merge into "person"
	* using "pet" on "person"."id" = "pet"."owner_id"
	* when matched then
	*   do nothing
	* ```
	*/
	thenDoNothing() {
		return new WheneableMergeQueryBuilder({
			...this.#props,
			queryNode: MergeQueryNode.cloneWithThen(this.#props.queryNode, parseMergeThen("do nothing"))
		});
	}
	/**
	* Perform an `update` operation with a full-fledged {@link UpdateQueryBuilder}.
	* This is handy when multiple `set` invocations are needed.
	*
	* For a shorthand version of this method, see {@link thenUpdateSet}.
	*
	* To perform the `delete` action, see {@link thenDelete}.
	*
	* To perform the `do nothing` action, see {@link thenDoNothing}.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* const result = await db.mergeInto('person')
	*   .using('pet', 'person.id', 'pet.owner_id')
	*   .whenMatched()
	*   .thenUpdate((ub) => ub
	*     .set(sql`metadata['has_pets']`, 'Y')
	*     .set({
	*       updated_at: new Date().toISOString(),
	*     })
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* merge into "person"
	* using "pet" on "person"."id" = "pet"."owner_id"
	* when matched then
	*   update set metadata['has_pets'] = $1, "updated_at" = $2
	* ```
	*/
	thenUpdate(set) {
		return new WheneableMergeQueryBuilder({
			...this.#props,
			queryNode: MergeQueryNode.cloneWithThen(this.#props.queryNode, parseMergeThen(set(new UpdateQueryBuilder({
				queryId: this.#props.queryId,
				executor: NOOP_QUERY_EXECUTOR,
				queryNode: UpdateQueryNode.createWithoutTable()
			}))))
		});
	}
	thenUpdateSet(...args) {
		return this.thenUpdate((ub) => ub.set(...args));
	}
};
var NotMatchedThenableMergeQueryBuilder = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Performs the `do nothing` action.
	*
	* This is supported in PostgreSQL.
	*
	* To perform the `insert` action, see {@link thenInsertValues}.
	*
	* ### Examples
	*
	* ```ts
	* const result = await db.mergeInto('person')
	*   .using('pet', 'person.id', 'pet.owner_id')
	*   .whenNotMatched()
	*   .thenDoNothing()
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* merge into "person"
	* using "pet" on "person"."id" = "pet"."owner_id"
	* when not matched then
	*   do nothing
	* ```
	*/
	thenDoNothing() {
		return new WheneableMergeQueryBuilder({
			...this.#props,
			queryNode: MergeQueryNode.cloneWithThen(this.#props.queryNode, parseMergeThen("do nothing"))
		});
	}
	thenInsertValues(insert) {
		const [columns, values] = parseInsertExpression(insert);
		return new WheneableMergeQueryBuilder({
			...this.#props,
			queryNode: MergeQueryNode.cloneWithThen(this.#props.queryNode, parseMergeThen(InsertQueryNode.cloneWith(InsertQueryNode.createWithoutInto(), {
				columns,
				values
			})))
		});
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/query-creator.js
var QueryCreator = class QueryCreator {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Creates a `select` query builder for the given table or tables.
	*
	* The tables passed to this method are built as the query's `from` clause.
	*
	* ### Examples
	*
	* Create a select query for one table:
	*
	* ```ts
	* db.selectFrom('person').selectAll()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select * from "person"
	* ```
	*
	* Create a select query for one table with an alias:
	*
	* ```ts
	* const persons = await db.selectFrom('person as p')
	*   .select(['p.id', 'first_name'])
	*   .execute()
	*
	* console.log(persons[0].id)
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select "p"."id", "first_name" from "person" as "p"
	* ```
	*
	* Create a select query from a subquery:
	*
	* ```ts
	* const persons = await db.selectFrom(
	*     (eb) => eb.selectFrom('person').select('person.id as identifier').as('p')
	*   )
	*   .select('p.identifier')
	*   .execute()
	*
	* console.log(persons[0].identifier)
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select "p"."identifier",
	* from (
	*   select "person"."id" as "identifier" from "person"
	* ) as p
	* ```
	*
	* Create a select query from raw sql:
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* const items = await db
	*   .selectFrom(sql<{ one: number }>`(select 1 as one)`.as('q'))
	*   .select('q.one')
	*   .execute()
	*
	* console.log(items[0].one)
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select "q"."one",
	* from (
	*   select 1 as one
	* ) as q
	* ```
	*
	* When you use the `sql` tag you need to also provide the result type of the
	* raw snippet / query so that Kysely can figure out what columns are
	* available for the rest of the query.
	*
	* The `selectFrom` method also accepts an array for multiple tables. All
	* the above examples can also be used in an array.
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* const items = await db.selectFrom([
	*     'person as p',
	*     db.selectFrom('pet').select('pet.species').as('a'),
	*     sql<{ one: number }>`(select 1 as one)`.as('q')
	*   ])
	*   .select(['p.id', 'a.species', 'q.one'])
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select "p".id, "a"."species", "q"."one"
	* from
	*   "person" as "p",
	*   (select "pet"."species" from "pet") as a,
	*   (select 1 as one) as "q"
	* ```
	*/
	selectFrom(from) {
		return createSelectQueryBuilder({
			queryId: createQueryId(),
			executor: this.#props.executor,
			queryNode: SelectQueryNode.createFrom(parseTableExpressionOrList(from), this.#props.withNode)
		});
	}
	selectNoFrom(selection) {
		return createSelectQueryBuilder({
			queryId: createQueryId(),
			executor: this.#props.executor,
			queryNode: SelectQueryNode.cloneWithSelections(SelectQueryNode.create(this.#props.withNode), parseSelectArg(selection))
		});
	}
	/**
	* Creates an insert query.
	*
	* The return value of this query is an instance of {@link InsertResult}. {@link InsertResult}
	* has the {@link InsertResult.insertId | insertId} field that holds the auto incremented id of
	* the inserted row if the db returned one.
	*
	* See the {@link InsertQueryBuilder.values | values} method for more info and examples. Also see
	* the {@link ReturningInterface.returning | returning} method for a way to return columns
	* on supported databases like PostgreSQL.
	*
	* ### Examples
	*
	* ```ts
	* const result = await db
	*   .insertInto('person')
	*   .values({
	*     first_name: 'Jennifer',
	*     last_name: 'Aniston'
	*   })
	*   .executeTakeFirst()
	*
	* console.log(result.insertId)
	* ```
	*
	* Some databases like PostgreSQL support the `returning` method:
	*
	* ```ts
	* const { id } = await db
	*   .insertInto('person')
	*   .values({
	*     first_name: 'Jennifer',
	*     last_name: 'Aniston'
	*   })
	*   .returning('id')
	*   .executeTakeFirstOrThrow()
	* ```
	*/
	insertInto(table) {
		return new InsertQueryBuilder({
			queryId: createQueryId(),
			executor: this.#props.executor,
			queryNode: InsertQueryNode.create(parseTable(table), this.#props.withNode)
		});
	}
	/**
	* Creates a "replace into" query.
	*
	* This is only supported by some dialects like MySQL or SQLite.
	*
	* Similar to MySQL's {@link InsertQueryBuilder.onDuplicateKeyUpdate} that deletes
	* and inserts values on collision instead of updating existing rows.
	*
	* An alias of SQLite's {@link InsertQueryBuilder.orReplace}.
	*
	* The return value of this query is an instance of {@link InsertResult}. {@link InsertResult}
	* has the {@link InsertResult.insertId | insertId} field that holds the auto incremented id of
	* the inserted row if the db returned one.
	*
	* See the {@link InsertQueryBuilder.values | values} method for more info and examples.
	*
	* ### Examples
	*
	* ```ts
	* const result = await db
	*   .replaceInto('person')
	*   .values({
	*     first_name: 'Jennifer',
	*     last_name: 'Aniston'
	*   })
	*   .executeTakeFirstOrThrow()
	*
	* console.log(result.insertId)
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* replace into `person` (`first_name`, `last_name`) values (?, ?)
	* ```
	*/
	replaceInto(table) {
		return new InsertQueryBuilder({
			queryId: createQueryId(),
			executor: this.#props.executor,
			queryNode: InsertQueryNode.create(parseTable(table), this.#props.withNode, true)
		});
	}
	/**
	* Creates a delete query.
	*
	* See the {@link DeleteQueryBuilder.where} method for examples on how to specify
	* a where clause for the delete operation.
	*
	* The return value of the query is an instance of {@link DeleteResult}.
	*
	* ### Examples
	*
	* <!-- siteExample("delete", "Single row", 10) -->
	*
	* Delete a single row:
	*
	* ```ts
	* const result = await db
	*   .deleteFrom('person')
	*   .where('person.id', '=', 1)
	*   .executeTakeFirst()
	*
	* console.log(result.numDeletedRows)
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* delete from "person" where "person"."id" = $1
	* ```
	*
	* Some databases such as MySQL support deleting from multiple tables:
	*
	* ```ts
	* const result = await db
	*   .deleteFrom(['person', 'pet'])
	*   .using('person')
	*   .innerJoin('pet', 'pet.owner_id', 'person.id')
	*   .where('person.id', '=', 1)
	*   .executeTakeFirst()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* delete from `person`, `pet`
	* using `person`
	* inner join `pet` on `pet`.`owner_id` = `person`.`id`
	* where `person`.`id` = ?
	* ```
	*/
	deleteFrom(from) {
		return new DeleteQueryBuilder({
			queryId: createQueryId(),
			executor: this.#props.executor,
			queryNode: DeleteQueryNode.create(parseTableExpressionOrList(from), this.#props.withNode)
		});
	}
	/**
	* Creates an update query.
	*
	* See the {@link UpdateQueryBuilder.where} method for examples on how to specify
	* a where clause for the update operation.
	*
	* See the {@link UpdateQueryBuilder.set} method for examples on how to
	* specify the updates.
	*
	* The return value of the query is an {@link UpdateResult}.
	*
	* ### Examples
	*
	* ```ts
	* const result = await db
	*   .updateTable('person')
	*   .set({ first_name: 'Jennifer' })
	*   .where('person.id', '=', 1)
	*   .executeTakeFirst()
	*
	* console.log(result.numUpdatedRows)
	* ```
	*/
	updateTable(tables) {
		return new UpdateQueryBuilder({
			queryId: createQueryId(),
			executor: this.#props.executor,
			queryNode: UpdateQueryNode.create(parseTableExpressionOrList(tables), this.#props.withNode)
		});
	}
	/**
	* Creates a merge query.
	*
	* The return value of the query is a {@link MergeResult}.
	*
	* See the {@link MergeQueryBuilder.using} method for examples on how to specify
	* the other table.
	*
	* ### Examples
	*
	* <!-- siteExample("merge", "Source row existence", 10) -->
	*
	* Update a target column based on the existence of a source row:
	*
	* ```ts
	* const result = await db
	*   .mergeInto('person as target')
	*   .using('pet as source', 'source.owner_id', 'target.id')
	*   .whenMatchedAnd('target.has_pets', '!=', 'Y')
	*   .thenUpdateSet({ has_pets: 'Y' })
	*   .whenNotMatchedBySourceAnd('target.has_pets', '=', 'Y')
	*   .thenUpdateSet({ has_pets: 'N' })
	*   .executeTakeFirstOrThrow()
	*
	* console.log(result.numChangedRows)
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* merge into "person"
	* using "pet"
	* on "pet"."owner_id" = "person"."id"
	* when matched and "has_pets" != $1
	* then update set "has_pets" = $2
	* when not matched by source and "has_pets" = $3
	* then update set "has_pets" = $4
	* ```
	*
	* <!-- siteExample("merge", "Temporary changes table", 20) -->
	*
	* Merge new entries from a temporary changes table:
	*
	* ```ts
	* const result = await db
	*   .mergeInto('wine as target')
	*   .using(
	*     'wine_stock_change as source',
	*     'source.wine_name',
	*     'target.name',
	*   )
	*   .whenNotMatchedAnd('source.stock_delta', '>', 0)
	*   .thenInsertValues(({ ref }) => ({
	*     name: ref('source.wine_name'),
	*     stock: ref('source.stock_delta'),
	*   }))
	*   .whenMatchedAnd(
	*     (eb) => eb('target.stock', '+', eb.ref('source.stock_delta')),
	*     '>',
	*     0,
	*   )
	*   .thenUpdateSet('stock', (eb) =>
	*     eb('target.stock', '+', eb.ref('source.stock_delta')),
	*   )
	*   .whenMatched()
	*   .thenDelete()
	*   .executeTakeFirstOrThrow()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* merge into "wine" as "target"
	* using "wine_stock_change" as "source"
	* on "source"."wine_name" = "target"."name"
	* when not matched and "source"."stock_delta" > $1
	* then insert ("name", "stock") values ("source"."wine_name", "source"."stock_delta")
	* when matched and "target"."stock" + "source"."stock_delta" > $2
	* then update set "stock" = "target"."stock" + "source"."stock_delta"
	* when matched
	* then delete
	* ```
	*/
	mergeInto(targetTable) {
		return new MergeQueryBuilder({
			queryId: createQueryId(),
			executor: this.#props.executor,
			queryNode: MergeQueryNode.create(parseAliasedTable(targetTable), this.#props.withNode)
		});
	}
	/**
	* Creates a `with` query (Common Table Expression).
	*
	* ### Examples
	*
	* <!-- siteExample("cte", "Simple selects", 10) -->
	*
	* Common table expressions (CTE) are a great way to modularize complex queries.
	* Essentially they allow you to run multiple separate queries within a
	* single roundtrip to the DB.
	*
	* Since CTEs are a part of the main query, query optimizers inside DB
	* engines are able to optimize the overall query. For example, postgres
	* is able to inline the CTEs inside the using queries if it decides it's
	* faster.
	*
	* ```ts
	* const result = await db
	*   // Create a CTE called `jennifers` that selects all
	*   // persons named 'Jennifer'.
	*   .with(
	*     'jennifers',
	*     db
	*       .selectFrom('person')
	*       .where('first_name', '=', 'Jennifer')
	*       .select(['id', 'age']),
	*   )
	*   // Select all rows from the `jennifers` CTE and
	*   // further filter it.
	*   // To refer to a CTE in another CTE, use the callback variant of `with`.
	*   .with('adult_jennifers', (db) =>
	*     db.selectFrom('jennifers').where('age', '>', 18).select(['id', 'age']),
	*   )
	*   // Finally select all adult jennifers that are
	*   // also younger than 60.
	*   .selectFrom('adult_jennifers')
	*   .where('age', '<', 60)
	*   .selectAll()
	*   .execute()
	* ```
	*
	* <!-- siteExample("cte", "Inserts, updates and deletions", 20) -->
	*
	* Some databases like postgres also allow you to run other queries than selects
	* in CTEs. On these databases CTEs are extremely powerful:
	*
	* ```ts
	* const result = await db
	*   .with('new_person', (db) => db
	*     .insertInto('person')
	*     .values({
	*       first_name: 'Jennifer',
	*       age: 35,
	*     })
	*     .returning('id')
	*   )
	*   .with('new_pet', (db) => db
	*     .insertInto('pet')
	*     .values({
	*       name: 'Doggo',
	*       species: 'dog',
	*       is_favorite: true,
	*       // Use the id of the person we just inserted.
	*       owner_id: db
	*         .selectFrom('new_person')
	*         .select('id')
	*     })
	*     .returning('id')
	*   )
	*   .selectFrom(['new_person', 'new_pet'])
	*   .select([
	*     'new_person.id as person_id',
	*     'new_pet.id as pet_id'
	*   ])
	*   .execute()
	* ```
	*
	* The CTE name can optionally specify column names in addition to
	* a name. In that case Kysely requires the expression to retun
	* rows with the same columns.
	*
	* ```ts
	* await db
	*   .with('jennifers(id, age)', (db) => db
	*     .selectFrom('person')
	*     .where('first_name', '=', 'Jennifer')
	*     // This is ok since we return columns with the same
	*     // names as specified by `jennifers(id, age)`.
	*     .select(['id', 'age'])
	*   )
	*   .selectFrom('jennifers')
	*   .selectAll()
	*   .execute()
	* ```
	*
	* The first argument can also be a callback. The callback is passed
	* a `CTEBuilder` instance that can be used to configure the CTE:
	*
	* ```ts
	* await db
	*   .with(
	*     (cte) => cte('jennifers').materialized(),
	*     (db) => db
	*       .selectFrom('person')
	*       .where('first_name', '=', 'Jennifer')
	*       .select(['id', 'age'])
	*   )
	*   .selectFrom('jennifers')
	*   .selectAll()
	*   .execute()
	* ```
	*/
	with(nameOrBuilder, expression) {
		const cte = parseCommonTableExpression(nameOrBuilder, expression);
		return new QueryCreator({
			...this.#props,
			withNode: this.#props.withNode ? WithNode.cloneWithExpression(this.#props.withNode, cte) : WithNode.create(cte)
		});
	}
	/**
	* Creates a recursive `with` query (Common Table Expression).
	*
	* Note that recursiveness is a property of the whole `with` statement.
	* You cannot have recursive and non-recursive CTEs in a same `with` statement.
	* Therefore the recursiveness is determined by the **first** `with` or
	* `withRecusive` call you make.
	*
	* See the {@link with} method for examples and more documentation.
	*/
	withRecursive(nameOrBuilder, expression) {
		const cte = parseCommonTableExpression(nameOrBuilder, expression);
		return new QueryCreator({
			...this.#props,
			withNode: this.#props.withNode ? WithNode.cloneWithExpression(this.#props.withNode, cte) : WithNode.create(cte, { recursive: true })
		});
	}
	/**
	* Returns a copy of this query creator instance with the given plugin installed.
	*/
	withPlugin(plugin) {
		return new QueryCreator({
			...this.#props,
			executor: this.#props.executor.withPlugin(plugin)
		});
	}
	/**
	* Returns a copy of this query creator instance without any plugins.
	*/
	withoutPlugins() {
		return new QueryCreator({
			...this.#props,
			executor: this.#props.executor.withoutPlugins()
		});
	}
	/**
	* Sets the schema to be used for all table references that don't explicitly
	* specify a schema.
	*
	* This only affects the query created through the builder returned from
	* this method and doesn't modify the `db` instance.
	*
	* See [this recipe](https://github.com/kysely-org/kysely/blob/master/site/docs/recipes/0007-schemas.md)
	* for a more detailed explanation.
	*
	* ### Examples
	*
	* ```
	* await db
	*   .withSchema('mammals')
	*   .selectFrom('pet')
	*   .selectAll()
	*   .innerJoin('public.person', 'public.person.id', 'pet.owner_id')
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select * from "mammals"."pet"
	* inner join "public"."person"
	* on "public"."person"."id" = "mammals"."pet"."owner_id"
	* ```
	*
	* `withSchema` is smart enough to not add schema for aliases,
	* common table expressions or other places where the schema
	* doesn't belong to:
	*
	* ```
	* await db
	*   .withSchema('mammals')
	*   .selectFrom('pet as p')
	*   .select('p.name')
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select "p"."name" from "mammals"."pet" as "p"
	* ```
	*/
	withSchema(schema) {
		return new QueryCreator({
			...this.#props,
			executor: this.#props.executor.withPluginAtFront(new WithSchemaPlugin(schema))
		});
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/parser/parse-utils.js
function createQueryCreator() {
	return new QueryCreator({ executor: NOOP_QUERY_EXECUTOR });
}
function createJoinBuilder(joinType, table) {
	return new JoinBuilder({ joinNode: JoinNode.create(joinType, parseTableExpression(table)) });
}
function createOverBuilder() {
	return new OverBuilder({ overNode: OverNode.create() });
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/parser/join-parser.js
function parseJoin(joinType, args) {
	if (args.length === 3) return parseSingleOnJoin(joinType, args[0], args[1], args[2]);
	else if (args.length === 2) return parseCallbackJoin(joinType, args[0], args[1]);
	else if (args.length === 1) return parseOnlessJoin(joinType, args[0]);
	else throw new Error("not implemented");
}
function parseCallbackJoin(joinType, from, callback) {
	return callback(createJoinBuilder(joinType, from)).toOperationNode();
}
function parseSingleOnJoin(joinType, from, lhsColumn, rhsColumn) {
	return JoinNode.createWithOn(joinType, parseTableExpression(from), parseReferentialBinaryOperation(lhsColumn, "=", rhsColumn));
}
function parseOnlessJoin(joinType, from) {
	return JoinNode.create(joinType, parseTableExpression(from));
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/offset-node.js
/**
* @internal
*/
const OffsetNode = freeze({
	is(node) {
		return node.kind === "OffsetNode";
	},
	create(offset) {
		return freeze({
			kind: "OffsetNode",
			offset
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/group-by-item-node.js
/**
* @internal
*/
const GroupByItemNode = freeze({
	is(node) {
		return node.kind === "GroupByItemNode";
	},
	create(groupBy) {
		return freeze({
			kind: "GroupByItemNode",
			groupBy
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/parser/group-by-parser.js
function parseGroupBy(groupBy) {
	groupBy = isFunction(groupBy) ? groupBy(expressionBuilder()) : groupBy;
	return parseReferenceExpressionOrList(groupBy).map(GroupByItemNode.create);
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/set-operation-node.js
/**
* @internal
*/
const SetOperationNode = freeze({
	is(node) {
		return node.kind === "SetOperationNode";
	},
	create(operator, expression, all) {
		return freeze({
			kind: "SetOperationNode",
			operator,
			expression,
			all
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/parser/set-operation-parser.js
function parseSetOperations(operator, expression, all) {
	if (isFunction(expression)) expression = expression(createExpressionBuilder());
	if (!isReadonlyArray(expression)) expression = [expression];
	return expression.map((expr) => SetOperationNode.create(operator, parseExpression(expr), all));
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/expression/expression-wrapper.js
var ExpressionWrapper = class ExpressionWrapper {
	#node;
	constructor(node) {
		this.#node = node;
	}
	/** @private */
	get expressionType() {}
	as(alias) {
		return new AliasedExpressionWrapper(this, alias);
	}
	or(...args) {
		return new OrWrapper(OrNode.create(this.#node, parseValueBinaryOperationOrExpression(args)));
	}
	and(...args) {
		return new AndWrapper(AndNode.create(this.#node, parseValueBinaryOperationOrExpression(args)));
	}
	/**
	* Change the output type of the expression.
	*
	* This method call doesn't change the SQL in any way. This methods simply
	* returns a copy of this `ExpressionWrapper` with a new output type.
	*/
	$castTo() {
		return new ExpressionWrapper(this.#node);
	}
	/**
	* Omit null from the expression's type.
	*
	* This function can be useful in cases where you know an expression can't be
	* null, but Kysely is unable to infer it.
	*
	* This method call doesn't change the SQL in any way. This methods simply
	* returns a copy of `this` with a new output type.
	*/
	$notNull() {
		return new ExpressionWrapper(this.#node);
	}
	toOperationNode() {
		return this.#node;
	}
};
var AliasedExpressionWrapper = class {
	#expr;
	#alias;
	constructor(expr, alias) {
		this.#expr = expr;
		this.#alias = alias;
	}
	/** @private */
	get expression() {
		return this.#expr;
	}
	/** @private */
	get alias() {
		return this.#alias;
	}
	toOperationNode() {
		return AliasNode.create(this.#expr.toOperationNode(), isOperationNodeSource(this.#alias) ? this.#alias.toOperationNode() : IdentifierNode.create(this.#alias));
	}
};
var OrWrapper = class OrWrapper {
	#node;
	constructor(node) {
		this.#node = node;
	}
	/** @private */
	get expressionType() {}
	as(alias) {
		return new AliasedExpressionWrapper(this, alias);
	}
	or(...args) {
		return new OrWrapper(OrNode.create(this.#node, parseValueBinaryOperationOrExpression(args)));
	}
	/**
	* Change the output type of the expression.
	*
	* This method call doesn't change the SQL in any way. This methods simply
	* returns a copy of this `OrWrapper` with a new output type.
	*/
	$castTo() {
		return new OrWrapper(this.#node);
	}
	toOperationNode() {
		return ParensNode.create(this.#node);
	}
};
var AndWrapper = class AndWrapper {
	#node;
	constructor(node) {
		this.#node = node;
	}
	/** @private */
	get expressionType() {}
	as(alias) {
		return new AliasedExpressionWrapper(this, alias);
	}
	and(...args) {
		return new AndWrapper(AndNode.create(this.#node, parseValueBinaryOperationOrExpression(args)));
	}
	/**
	* Change the output type of the expression.
	*
	* This method call doesn't change the SQL in any way. This methods simply
	* returns a copy of this `AndWrapper` with a new output type.
	*/
	$castTo() {
		return new AndWrapper(this.#node);
	}
	toOperationNode() {
		return ParensNode.create(this.#node);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/fetch-node.js
/**
* @internal
*/
const FetchNode = freeze({
	is(node) {
		return node.kind === "FetchNode";
	},
	create(rowCount, modifier) {
		return {
			kind: "FetchNode",
			rowCount: ValueNode.create(rowCount),
			modifier
		};
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/parser/fetch-parser.js
function parseFetch(rowCount, modifier) {
	if (!isNumber(rowCount) && !isBigInt(rowCount)) throw new Error(`Invalid fetch row count: ${rowCount}`);
	if (!isFetchModifier(modifier)) throw new Error(`Invalid fetch modifier: ${modifier}`);
	return FetchNode.create(rowCount, modifier);
}
function isFetchModifier(value) {
	return value === "only" || value === "with ties";
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/query-builder/select-query-builder.js
var _a$1;
var SelectQueryBuilderImpl = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	get expressionType() {}
	get isSelectQueryBuilder() {
		return true;
	}
	where(...args) {
		return new _a$1({
			...this.#props,
			queryNode: QueryNode.cloneWithWhere(this.#props.queryNode, parseValueBinaryOperationOrExpression(args))
		});
	}
	whereRef(lhs, op, rhs) {
		return new _a$1({
			...this.#props,
			queryNode: QueryNode.cloneWithWhere(this.#props.queryNode, parseReferentialBinaryOperation(lhs, op, rhs))
		});
	}
	having(...args) {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithHaving(this.#props.queryNode, parseValueBinaryOperationOrExpression(args))
		});
	}
	havingRef(lhs, op, rhs) {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithHaving(this.#props.queryNode, parseReferentialBinaryOperation(lhs, op, rhs))
		});
	}
	select(selection) {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithSelections(this.#props.queryNode, parseSelectArg(selection))
		});
	}
	distinctOn(selection) {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithDistinctOn(this.#props.queryNode, parseReferenceExpressionOrList(selection))
		});
	}
	modifyFront(modifier) {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithFrontModifier(this.#props.queryNode, SelectModifierNode.createWithExpression(modifier.toOperationNode()))
		});
	}
	modifyEnd(modifier) {
		return new _a$1({
			...this.#props,
			queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, SelectModifierNode.createWithExpression(modifier.toOperationNode()))
		});
	}
	distinct() {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithFrontModifier(this.#props.queryNode, SelectModifierNode.create("Distinct"))
		});
	}
	forUpdate(of) {
		return new _a$1({
			...this.#props,
			queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, SelectModifierNode.create("ForUpdate", of ? asArray(of).map(parseTable) : void 0))
		});
	}
	forShare(of) {
		return new _a$1({
			...this.#props,
			queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, SelectModifierNode.create("ForShare", of ? asArray(of).map(parseTable) : void 0))
		});
	}
	forKeyShare(of) {
		return new _a$1({
			...this.#props,
			queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, SelectModifierNode.create("ForKeyShare", of ? asArray(of).map(parseTable) : void 0))
		});
	}
	forNoKeyUpdate(of) {
		return new _a$1({
			...this.#props,
			queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, SelectModifierNode.create("ForNoKeyUpdate", of ? asArray(of).map(parseTable) : void 0))
		});
	}
	skipLocked() {
		return new _a$1({
			...this.#props,
			queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, SelectModifierNode.create("SkipLocked"))
		});
	}
	noWait() {
		return new _a$1({
			...this.#props,
			queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, SelectModifierNode.create("NoWait"))
		});
	}
	selectAll(table) {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithSelections(this.#props.queryNode, parseSelectAll(table))
		});
	}
	innerJoin(...args) {
		return this.#join("InnerJoin", args);
	}
	leftJoin(...args) {
		return this.#join("LeftJoin", args);
	}
	rightJoin(...args) {
		return this.#join("RightJoin", args);
	}
	fullJoin(...args) {
		return this.#join("FullJoin", args);
	}
	crossJoin(...args) {
		return this.#join("CrossJoin", args);
	}
	innerJoinLateral(...args) {
		return this.#join("LateralInnerJoin", args);
	}
	leftJoinLateral(...args) {
		return this.#join("LateralLeftJoin", args);
	}
	crossJoinLateral(...args) {
		return this.#join("LateralCrossJoin", args);
	}
	crossApply(...args) {
		return this.#join("CrossApply", args);
	}
	outerApply(...args) {
		return this.#join("OuterApply", args);
	}
	#join(joinType, args) {
		return new _a$1({
			...this.#props,
			queryNode: QueryNode.cloneWithJoin(this.#props.queryNode, parseJoin(joinType, args))
		});
	}
	orderBy(...args) {
		return new _a$1({
			...this.#props,
			queryNode: QueryNode.cloneWithOrderByItems(this.#props.queryNode, parseOrderBy(args))
		});
	}
	groupBy(groupBy) {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithGroupByItems(this.#props.queryNode, parseGroupBy(groupBy))
		});
	}
	limit(limit) {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithLimit(this.#props.queryNode, LimitNode.create(parseValueExpression(limit)))
		});
	}
	offset(offset) {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithOffset(this.#props.queryNode, OffsetNode.create(parseValueExpression(offset)))
		});
	}
	fetch(rowCount, modifier = "only") {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithFetch(this.#props.queryNode, parseFetch(rowCount, modifier))
		});
	}
	top(expression, modifiers) {
		return new _a$1({
			...this.#props,
			queryNode: QueryNode.cloneWithTop(this.#props.queryNode, parseTop(expression, modifiers))
		});
	}
	union(expression) {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithSetOperations(this.#props.queryNode, parseSetOperations("union", expression, false))
		});
	}
	unionAll(expression) {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithSetOperations(this.#props.queryNode, parseSetOperations("union", expression, true))
		});
	}
	intersect(expression) {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithSetOperations(this.#props.queryNode, parseSetOperations("intersect", expression, false))
		});
	}
	intersectAll(expression) {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithSetOperations(this.#props.queryNode, parseSetOperations("intersect", expression, true))
		});
	}
	except(expression) {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithSetOperations(this.#props.queryNode, parseSetOperations("except", expression, false))
		});
	}
	exceptAll(expression) {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithSetOperations(this.#props.queryNode, parseSetOperations("except", expression, true))
		});
	}
	as(alias) {
		return new AliasedSelectQueryBuilderImpl(this, alias);
	}
	clearSelect() {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithoutSelections(this.#props.queryNode)
		});
	}
	clearWhere() {
		return new _a$1({
			...this.#props,
			queryNode: QueryNode.cloneWithoutWhere(this.#props.queryNode)
		});
	}
	clearLimit() {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithoutLimit(this.#props.queryNode)
		});
	}
	clearOffset() {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithoutOffset(this.#props.queryNode)
		});
	}
	clearOrderBy() {
		return new _a$1({
			...this.#props,
			queryNode: QueryNode.cloneWithoutOrderBy(this.#props.queryNode)
		});
	}
	clearGroupBy() {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithoutGroupBy(this.#props.queryNode)
		});
	}
	$call(func) {
		return func(this);
	}
	$if(condition, func) {
		if (condition) return func(this);
		return new _a$1({ ...this.#props });
	}
	$castTo() {
		return new _a$1(this.#props);
	}
	$narrowType() {
		return new _a$1(this.#props);
	}
	$assertType() {
		return new _a$1(this.#props);
	}
	$asTuple() {
		return new ExpressionWrapper(this.toOperationNode());
	}
	$asScalar() {
		return new ExpressionWrapper(this.toOperationNode());
	}
	withPlugin(plugin) {
		return new _a$1({
			...this.#props,
			executor: this.#props.executor.withPlugin(plugin)
		});
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.queryNode, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		const compiledQuery = this.compile();
		return (await this.#props.executor.executeQuery(compiledQuery, options)).rows;
	}
	async executeTakeFirst(options) {
		const [result] = await this.execute(options);
		return result;
	}
	async executeTakeFirstOrThrow(errorConstructorOrOptions) {
		if (typeof errorConstructorOrOptions === "function") errorConstructorOrOptions = { errorConstructor: errorConstructorOrOptions };
		const result = await this.executeTakeFirst(errorConstructorOrOptions);
		if (result === void 0) {
			const errorConstructor = errorConstructorOrOptions?.errorConstructor ?? NoResultError;
			throw isNoResultErrorConstructor(errorConstructor) ? new errorConstructor(this.toOperationNode()) : errorConstructor(this.toOperationNode());
		}
		return result;
	}
	async *stream(chunkSizeOrOptions) {
		if (typeof chunkSizeOrOptions !== "object") chunkSizeOrOptions = { chunkSize: chunkSizeOrOptions };
		const compiledQuery = this.compile();
		const stream = this.#props.executor.stream(compiledQuery, chunkSizeOrOptions.chunkSize ?? 100, chunkSizeOrOptions);
		for await (const item of stream) yield* item.rows;
	}
	async explain(format, options) {
		return await new _a$1({
			...this.#props,
			queryNode: QueryNode.cloneWithExplain(this.#props.queryNode, format, options)
		}).execute();
	}
};
_a$1 = SelectQueryBuilderImpl;
function createSelectQueryBuilder(props) {
	return new SelectQueryBuilderImpl(props);
}
/**
* {@link SelectQueryBuilder} with an alias. The result of calling {@link SelectQueryBuilder.as}.
*/
var AliasedSelectQueryBuilderImpl = class {
	#queryBuilder;
	#alias;
	constructor(queryBuilder, alias) {
		this.#queryBuilder = queryBuilder;
		this.#alias = alias;
	}
	get expression() {
		return this.#queryBuilder;
	}
	get alias() {
		return this.#alias;
	}
	get isAliasedSelectQueryBuilder() {
		return true;
	}
	toOperationNode() {
		return AliasNode.create(this.#queryBuilder.toOperationNode(), IdentifierNode.create(this.#alias));
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/aggregate-function-node.js
/**
* @internal
*/
const AggregateFunctionNode = freeze({
	is(node) {
		return node.kind === "AggregateFunctionNode";
	},
	create(aggregateFunction, aggregated = []) {
		return freeze({
			kind: "AggregateFunctionNode",
			func: aggregateFunction,
			aggregated
		});
	},
	cloneWithDistinct(aggregateFunctionNode) {
		return freeze({
			...aggregateFunctionNode,
			distinct: true
		});
	},
	cloneWithOrderBy(aggregateFunctionNode, orderItems, withinGroup = false) {
		const prop = withinGroup ? "withinGroup" : "orderBy";
		return freeze({
			...aggregateFunctionNode,
			[prop]: aggregateFunctionNode[prop] ? OrderByNode.cloneWithItems(aggregateFunctionNode[prop], orderItems) : OrderByNode.create(orderItems)
		});
	},
	cloneWithFilter(aggregateFunctionNode, filter) {
		return freeze({
			...aggregateFunctionNode,
			filter: aggregateFunctionNode.filter ? WhereNode.cloneWithOperation(aggregateFunctionNode.filter, "And", filter) : WhereNode.create(filter)
		});
	},
	cloneWithOrFilter(aggregateFunctionNode, filter) {
		return freeze({
			...aggregateFunctionNode,
			filter: aggregateFunctionNode.filter ? WhereNode.cloneWithOperation(aggregateFunctionNode.filter, "Or", filter) : WhereNode.create(filter)
		});
	},
	cloneWithOver(aggregateFunctionNode, over) {
		return freeze({
			...aggregateFunctionNode,
			over
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/function-node.js
/**
* @internal
*/
const FunctionNode = freeze({
	is(node) {
		return node.kind === "FunctionNode";
	},
	create(func, args) {
		return freeze({
			kind: "FunctionNode",
			func,
			arguments: args
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/query-builder/aggregate-function-builder.js
var AggregateFunctionBuilder = class AggregateFunctionBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/** @private */
	get expressionType() {}
	/**
	* Returns an aliased version of the function.
	*
	* In addition to slapping `as "the_alias"` to the end of the SQL,
	* this method also provides strict typing:
	*
	* ```ts
	* const result = await db
	*   .selectFrom('person')
	*   .select(
	*     (eb) => eb.fn.count<number>('id').as('person_count')
	*   )
	*   .executeTakeFirstOrThrow()
	*
	* // `person_count: number` field exists in the result type.
	* console.log(result.person_count)
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select count("id") as "person_count"
	* from "person"
	* ```
	*/
	as(alias) {
		return new AliasedAggregateFunctionBuilder(this, alias);
	}
	/**
	* Adds a `distinct` clause inside the function.
	*
	* ### Examples
	*
	* ```ts
	* const result = await db
	*   .selectFrom('person')
	*   .select((eb) =>
	*     eb.fn.count<number>('first_name').distinct().as('first_name_count')
	*   )
	*   .executeTakeFirstOrThrow()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select count(distinct "first_name") as "first_name_count"
	* from "person"
	* ```
	*/
	distinct() {
		return new AggregateFunctionBuilder({
			...this.#props,
			aggregateFunctionNode: AggregateFunctionNode.cloneWithDistinct(this.#props.aggregateFunctionNode)
		});
	}
	orderBy(...args) {
		return new AggregateFunctionBuilder({
			...this.#props,
			aggregateFunctionNode: QueryNode.cloneWithOrderByItems(this.#props.aggregateFunctionNode, parseOrderBy(args))
		});
	}
	clearOrderBy() {
		return new AggregateFunctionBuilder({
			...this.#props,
			aggregateFunctionNode: QueryNode.cloneWithoutOrderBy(this.#props.aggregateFunctionNode)
		});
	}
	withinGroupOrderBy(...args) {
		return new AggregateFunctionBuilder({
			...this.#props,
			aggregateFunctionNode: AggregateFunctionNode.cloneWithOrderBy(this.#props.aggregateFunctionNode, parseOrderBy(args), true)
		});
	}
	filterWhere(...args) {
		return new AggregateFunctionBuilder({
			...this.#props,
			aggregateFunctionNode: AggregateFunctionNode.cloneWithFilter(this.#props.aggregateFunctionNode, parseValueBinaryOperationOrExpression(args))
		});
	}
	/**
	* Adds a `filter` clause with a nested `where` clause after the function, where
	* both sides of the operator are references to columns.
	*
	* Similar to {@link WhereInterface}'s `whereRef` method.
	*
	* ### Examples
	*
	* Count people with same first and last names versus general public:
	*
	* ```ts
	* const result = await db
	*   .selectFrom('person')
	*   .select((eb) => [
	*     eb.fn
	*       .count<number>('id')
	*       .filterWhereRef('first_name', '=', 'last_name')
	*       .as('repeat_name_count'),
	*     eb.fn.count<number>('id').as('total_count'),
	*   ])
	*   .executeTakeFirstOrThrow()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select
	*   count("id") filter(where "first_name" = "last_name") as "repeat_name_count",
	*   count("id") as "total_count"
	* from "person"
	* ```
	*/
	filterWhereRef(lhs, op, rhs) {
		return new AggregateFunctionBuilder({
			...this.#props,
			aggregateFunctionNode: AggregateFunctionNode.cloneWithFilter(this.#props.aggregateFunctionNode, parseReferentialBinaryOperation(lhs, op, rhs))
		});
	}
	/**
	* Adds an `over` clause (window functions) after the function.
	*
	* ### Examples
	*
	* ```ts
	* const result = await db
	*   .selectFrom('person')
	*   .select(
	*     (eb) => eb.fn.avg<number>('age').over().as('average_age')
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select avg("age") over() as "average_age"
	* from "person"
	* ```
	*
	* Also supports passing a callback that returns an over builder,
	* allowing to add partition by and sort by clauses inside over.
	*
	* ```ts
	* const result = await db
	*   .selectFrom('person')
	*   .select(
	*     (eb) => eb.fn.avg<number>('age').over(
	*       ob => ob.partitionBy('last_name').orderBy('first_name', 'asc')
	*     ).as('average_age')
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select avg("age") over(partition by "last_name" order by "first_name" asc) as "average_age"
	* from "person"
	* ```
	*/
	over(over) {
		const builder = createOverBuilder();
		return new AggregateFunctionBuilder({
			...this.#props,
			aggregateFunctionNode: AggregateFunctionNode.cloneWithOver(this.#props.aggregateFunctionNode, (over ? over(builder) : builder).toOperationNode())
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	/**
	* Casts the expression to the given type.
	*
	* This method call doesn't change the SQL in any way. This methods simply
	* returns a copy of this `AggregateFunctionBuilder` with a new output type.
	*/
	$castTo() {
		return new AggregateFunctionBuilder(this.#props);
	}
	/**
	* Omit null from the expression's type.
	*
	* This function can be useful in cases where you know an expression can't be
	* null, but Kysely is unable to infer it.
	*
	* This method call doesn't change the SQL in any way. This methods simply
	* returns a copy of `this` with a new output type.
	*/
	$notNull() {
		return new AggregateFunctionBuilder(this.#props);
	}
	toOperationNode() {
		return this.#props.aggregateFunctionNode;
	}
};
/**
* {@link AggregateFunctionBuilder} with an alias. The result of calling {@link AggregateFunctionBuilder.as}.
*/
var AliasedAggregateFunctionBuilder = class {
	#aggregateFunctionBuilder;
	#alias;
	constructor(aggregateFunctionBuilder, alias) {
		this.#aggregateFunctionBuilder = aggregateFunctionBuilder;
		this.#alias = alias;
	}
	/** @private */
	get expression() {
		return this.#aggregateFunctionBuilder;
	}
	/** @private */
	get alias() {
		return this.#alias;
	}
	toOperationNode() {
		return AliasNode.create(this.#aggregateFunctionBuilder.toOperationNode(), IdentifierNode.create(this.#alias));
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/query-builder/function-module.js
function createFunctionModule() {
	const fn = (name, args) => {
		return new ExpressionWrapper(FunctionNode.create(name, parseReferenceExpressionOrList(args ?? [])));
	};
	const agg = (name, args) => {
		return new AggregateFunctionBuilder({ aggregateFunctionNode: AggregateFunctionNode.create(name, args ? parseReferenceExpressionOrList(args) : void 0) });
	};
	return Object.assign(fn, {
		agg,
		avg(column) {
			return agg("avg", [column]);
		},
		coalesce(...values) {
			return fn("coalesce", values);
		},
		count(column) {
			return agg("count", [column]);
		},
		countAll(table) {
			return new AggregateFunctionBuilder({ aggregateFunctionNode: AggregateFunctionNode.create("count", parseSelectAll(table)) });
		},
		max(column) {
			return agg("max", [column]);
		},
		min(column) {
			return agg("min", [column]);
		},
		sum(column) {
			return agg("sum", [column]);
		},
		any(column) {
			return fn("any", [column]);
		},
		jsonAgg(table) {
			return new AggregateFunctionBuilder({ aggregateFunctionNode: AggregateFunctionNode.create("json_agg", [isString(table) ? parseTable(table) : table.toOperationNode()]) });
		},
		toJson(table) {
			return new ExpressionWrapper(FunctionNode.create("to_json", [isString(table) ? parseTable(table) : table.toOperationNode()]));
		}
	});
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/unary-operation-node.js
/**
* @internal
*/
const UnaryOperationNode = freeze({
	is(node) {
		return node.kind === "UnaryOperationNode";
	},
	create(operator, operand) {
		return freeze({
			kind: "UnaryOperationNode",
			operator,
			operand
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/parser/unary-operation-parser.js
function parseUnaryOperation(operator, operand) {
	if (isUnaryOperator(operator)) return UnaryOperationNode.create(OperatorNode.create(operator), parseReferenceExpression(operand));
	throw new Error(`invalid unary operator ${JSON.stringify(operator)}`);
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/case-node.js
/**
* @internal
*/
const CaseNode = freeze({
	is(node) {
		return node.kind === "CaseNode";
	},
	create(value) {
		return freeze({
			kind: "CaseNode",
			value
		});
	},
	cloneWithWhen(caseNode, when) {
		return freeze({
			...caseNode,
			when: freeze(caseNode.when ? [...caseNode.when, when] : [when])
		});
	},
	cloneWithThen(caseNode, then) {
		return freeze({
			...caseNode,
			when: caseNode.when ? freeze([...caseNode.when.slice(0, -1), WhenNode.cloneWithResult(caseNode.when[caseNode.when.length - 1], then)]) : void 0
		});
	},
	cloneWith(caseNode, props) {
		return freeze({
			...caseNode,
			...props
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/query-builder/case-builder.js
var CaseBuilder = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	when(...args) {
		return new CaseThenBuilder({
			...this.#props,
			node: CaseNode.cloneWithWhen(this.#props.node, WhenNode.create(parseValueBinaryOperationOrExpression(args)))
		});
	}
	whenRef(lhs, op, rhs) {
		return new CaseThenBuilder({
			...this.#props,
			node: CaseNode.cloneWithWhen(this.#props.node, WhenNode.create(parseReferentialBinaryOperation(lhs, op, rhs)))
		});
	}
};
var CaseThenBuilder = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	then(valueExpression) {
		return new CaseWhenBuilder({
			...this.#props,
			node: CaseNode.cloneWithThen(this.#props.node, isSafeImmediateValue(valueExpression) ? parseSafeImmediateValue(valueExpression) : parseValueExpression(valueExpression))
		});
	}
	/**
	* Adds a `then` clause to the `case` statement where the value is a reference to a column.
	*
	* See {@link then} for value-first variant.
	*
	* A `thenRef` call can be followed by {@link Whenable.when}, {@link Whenable.whenRef},
	* {@link CaseWhenBuilder.else}, {@link CaseWhenBuilder.elseRef},
	* {@link CaseWhenBuilder.end} or {@link CaseWhenBuilder.endCase} call.
	*/
	thenRef(expression) {
		return new CaseWhenBuilder({
			...this.#props,
			node: CaseNode.cloneWithThen(this.#props.node, parseReferenceExpression(expression))
		});
	}
};
var CaseWhenBuilder = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	when(...args) {
		return new CaseThenBuilder({
			...this.#props,
			node: CaseNode.cloneWithWhen(this.#props.node, WhenNode.create(parseValueBinaryOperationOrExpression(args)))
		});
	}
	whenRef(lhs, op, rhs) {
		return new CaseThenBuilder({
			...this.#props,
			node: CaseNode.cloneWithWhen(this.#props.node, WhenNode.create(parseReferentialBinaryOperation(lhs, op, rhs)))
		});
	}
	else(valueExpression) {
		return new CaseEndBuilder({
			...this.#props,
			node: CaseNode.cloneWith(this.#props.node, { else: isSafeImmediateValue(valueExpression) ? parseSafeImmediateValue(valueExpression) : parseValueExpression(valueExpression) })
		});
	}
	/**
	* Adds an `else` clause to the `case` statement where the value is a reference to a column.
	*
	* See {@link else} for value-first variant.
	*
	* An `elseRef` call must be followed by an {@link Endable.end} or {@link Endable.endCase} call.
	*/
	elseRef(expression) {
		return new CaseEndBuilder({
			...this.#props,
			node: CaseNode.cloneWith(this.#props.node, { else: parseReferenceExpression(expression) })
		});
	}
	end() {
		return new ExpressionWrapper(CaseNode.cloneWith(this.#props.node, { isStatement: false }));
	}
	endCase() {
		return new ExpressionWrapper(CaseNode.cloneWith(this.#props.node, { isStatement: true }));
	}
};
var CaseEndBuilder = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	end() {
		return new ExpressionWrapper(CaseNode.cloneWith(this.#props.node, { isStatement: false }));
	}
	endCase() {
		return new ExpressionWrapper(CaseNode.cloneWith(this.#props.node, { isStatement: true }));
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/json-path-leg-node.js
/**
* @internal
*/
const JSONPathLegNode = freeze({
	is(node) {
		return node.kind === "JSONPathLegNode";
	},
	create(type, value) {
		return freeze({
			kind: "JSONPathLegNode",
			type,
			value
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/query-builder/json-path-builder.js
const HASH_NEGATIVE_INDEX_REGEX = /^#-\d+$/;
var JSONPathBuilder = class {
	#node;
	constructor(node) {
		this.#node = node;
	}
	/**
	* Access an element of a JSON array in a specific location.
	*
	* Since there's no guarantee an element exists in the given array location, the
	* resulting type is always nullable. If you're sure the element exists, you
	* should use {@link SelectQueryBuilder.$assertType} to narrow the type safely.
	*
	* See also {@link key} to access properties of JSON objects.
	*
	* ### Examples
	*
	* ```ts
	* await db.selectFrom('person')
	*   .select(eb =>
	*     eb.ref('nicknames', '->').at(0).as('primary_nickname')
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select "nicknames"->0 as "primary_nickname" from "person"
	*```
	*
	* Combined with {@link key}:
	*
	* ```ts
	* db.selectFrom('person').select(eb =>
	*   eb.ref('experience', '->').at(0).key('role').as('first_role')
	* )
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select "experience"->0->'role' as "first_role" from "person"
	* ```
	*
	* You can use `'last'` to access the last element of the array in MySQL:
	*
	* ```ts
	* db.selectFrom('person').select(eb =>
	*   eb.ref('nicknames', '->$').at('last').as('last_nickname')
	* )
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* select `nicknames`->'$[last]' as `last_nickname` from `person`
	* ```
	*
	* Or `'#-1'` in SQLite:
	*
	* ```ts
	* db.selectFrom('person').select(eb =>
	*   eb.ref('nicknames', '->>$').at('#-1').as('last_nickname')
	* )
	* ```
	*
	* The generated SQL (SQLite):
	*
	* ```sql
	* select "nicknames"->>'$[#-1]' as `last_nickname` from `person`
	* ```
	*/
	at(index) {
		if (typeof index !== "number" && typeof index !== "string" || typeof index === "number" && !Number.isInteger(index) || typeof index === "string" && index !== "last" && !HASH_NEGATIVE_INDEX_REGEX.test(index)) throw new Error(`Unexpected index value in .at(...): ${index}`);
		return this.#createBuilderWithPathLeg("ArrayLocation", index);
	}
	/**
	* Access a property of a JSON object.
	*
	* If a field is optional, the resulting type will be nullable.
	*
	* See also {@link at} to access elements of JSON arrays.
	*
	* ### Examples
	*
	* ```ts
	* db.selectFrom('person').select(eb =>
	*   eb.ref('address', '->').key('city').as('city')
	* )
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select "address"->'city' as "city" from "person"
	* ```
	*
	* Going deeper:
	*
	* ```ts
	* db.selectFrom('person').select(eb =>
	*   eb.ref('profile', '->$').key('website').key('url').as('website_url')
	* )
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* select `profile`->'$.website.url' as `website_url` from `person`
	* ```
	*
	* Combined with {@link at}:
	*
	* ```ts
	* db.selectFrom('person').select(eb =>
	*   eb.ref('profile', '->').key('addresses').at(0).key('city').as('city')
	* )
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select "profile"->'addresses'->0->'city' as "city" from "person"
	* ```
	*/
	key(key) {
		return this.#createBuilderWithPathLeg("Member", key);
	}
	#createBuilderWithPathLeg(legType, value) {
		if (JSONReferenceNode.is(this.#node)) return new TraversedJSONPathBuilder(JSONReferenceNode.cloneWithTraversal(this.#node, JSONPathNode.is(this.#node.traversal) ? JSONPathNode.cloneWithLeg(this.#node.traversal, JSONPathLegNode.create(legType, value)) : JSONOperatorChainNode.cloneWithValue(this.#node.traversal, ValueNode.createImmediate(value))));
		return new TraversedJSONPathBuilder(JSONPathNode.cloneWithLeg(this.#node, JSONPathLegNode.create(legType, value)));
	}
};
var TraversedJSONPathBuilder = class TraversedJSONPathBuilder extends JSONPathBuilder {
	#node;
	constructor(node) {
		super(node);
		this.#node = node;
	}
	/** @private */
	get expressionType() {}
	as(alias) {
		return new AliasedJSONPathBuilder(this, alias);
	}
	/**
	* Change the output type of the json path.
	*
	* This method call doesn't change the SQL in any way. This methods simply
	* returns a copy of this `JSONPathBuilder` with a new output type.
	*/
	$castTo() {
		return new TraversedJSONPathBuilder(this.#node);
	}
	$notNull() {
		return new TraversedJSONPathBuilder(this.#node);
	}
	toOperationNode() {
		return this.#node;
	}
};
var AliasedJSONPathBuilder = class {
	#jsonPath;
	#alias;
	constructor(jsonPath, alias) {
		this.#jsonPath = jsonPath;
		this.#alias = alias;
	}
	/** @private */
	get expression() {
		return this.#jsonPath;
	}
	/** @private */
	get alias() {
		return this.#alias;
	}
	toOperationNode() {
		return AliasNode.create(this.#jsonPath.toOperationNode(), isOperationNodeSource(this.#alias) ? this.#alias.toOperationNode() : IdentifierNode.create(this.#alias));
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/tuple-node.js
/**
* @internal
*/
const TupleNode = freeze({
	is(node) {
		return node.kind === "TupleNode";
	},
	create(values) {
		return freeze({
			kind: "TupleNode",
			values: freeze(values)
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/data-type-node.js
const SIMPLE_COLUMN_DATA_TYPES = freeze({
	bigint: true,
	bigserial: true,
	binary: true,
	blob: true,
	boolean: true,
	bytea: true,
	char: true,
	date: true,
	datemultirange: true,
	daterange: true,
	datetime: true,
	datetime2: true,
	decimal: true,
	"double precision": true,
	float4: true,
	float8: true,
	int2: true,
	int4: true,
	int4multirange: true,
	int4range: true,
	int8: true,
	int8multirange: true,
	int8range: true,
	integer: true,
	json: true,
	jsonb: true,
	numeric: true,
	nummultirange: true,
	numrange: true,
	real: true,
	serial: true,
	smallint: true,
	text: true,
	time: true,
	timestamp: true,
	timestamptz: true,
	timetz: true,
	tsmultirange: true,
	tsrange: true,
	tstzmultirange: true,
	tstzrange: true,
	uuid: true,
	varbinary: true,
	varchar: true
});
const COLUMN_DATA_TYPE_REGEX = freeze([
	/^varchar\(\d+\)$/,
	/^char\(\d+\)$/,
	/^decimal\(\d+, \d+\)$/,
	/^numeric\(\d+, \d+\)$/,
	/^binary\(\d+\)$/,
	/^datetime\(\d+\)$/,
	/^time\(\d+\)$/,
	/^timetz\(\d+\)$/,
	/^timestamp\(\d+\)$/,
	/^timestamptz\(\d+\)$/,
	/^datetime2\(\d+\)$/,
	/^varbinary\(\d+\)$/
]);
/**
* @internal
*/
const DataTypeNode = freeze({
	is(node) {
		return node.kind === "DataTypeNode";
	},
	create(dataType) {
		return freeze({
			kind: "DataTypeNode",
			dataType
		});
	}
});
function isColumnDataType(dataType) {
	return SIMPLE_COLUMN_DATA_TYPES[dataType] || COLUMN_DATA_TYPE_REGEX.some((r) => r.test(dataType));
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/parser/data-type-parser.js
function parseDataTypeExpression(dataType) {
	if (isOperationNodeSource(dataType)) return dataType.toOperationNode();
	if (isColumnDataType(dataType)) return DataTypeNode.create(dataType);
	throw new Error(`invalid column data type ${JSON.stringify(dataType)}`);
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/cast-node.js
/**
* @internal
*/
const CastNode = freeze({
	is(node) {
		return node.kind === "CastNode";
	},
	create(expression, dataType) {
		return freeze({
			kind: "CastNode",
			expression,
			dataType
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/expression/expression-builder.js
function createExpressionBuilder(executor = NOOP_QUERY_EXECUTOR) {
	function binary(lhs, op, rhs) {
		return new ExpressionWrapper(parseValueBinaryOperation(lhs, op, rhs));
	}
	function unary(op, expr) {
		return new ExpressionWrapper(parseUnaryOperation(op, expr));
	}
	const eb = Object.assign(binary, {
		fn: void 0,
		eb: void 0,
		selectFrom(table) {
			return createSelectQueryBuilder({
				queryId: createQueryId(),
				executor,
				queryNode: SelectQueryNode.createFrom(parseTableExpressionOrList(table))
			});
		},
		case(reference) {
			return new CaseBuilder({ node: CaseNode.create(isUndefined(reference) ? void 0 : parseReferenceExpression(reference)) });
		},
		ref(reference, op) {
			if (isUndefined(op)) return new ExpressionWrapper(parseStringReference(reference));
			return new JSONPathBuilder(parseJSONReference(reference, op));
		},
		jsonPath() {
			return new JSONPathBuilder(JSONPathNode.create());
		},
		table(table) {
			return new ExpressionWrapper(parseTable(table));
		},
		val(value) {
			return new ExpressionWrapper(parseValueExpression(value));
		},
		refTuple(...values) {
			return new ExpressionWrapper(TupleNode.create(values.map(parseReferenceExpression)));
		},
		tuple(...values) {
			return new ExpressionWrapper(TupleNode.create(values.map(parseValueExpression)));
		},
		lit(value) {
			return new ExpressionWrapper(parseSafeImmediateValue(value));
		},
		unary,
		not(expr) {
			return unary("not", expr);
		},
		exists(expr) {
			return unary("exists", expr);
		},
		neg(expr) {
			return unary("-", expr);
		},
		between(expr, start, end) {
			return new ExpressionWrapper(BinaryOperationNode.create(parseReferenceExpression(expr), OperatorNode.create("between"), AndNode.create(parseValueExpression(start), parseValueExpression(end))));
		},
		betweenSymmetric(expr, start, end) {
			return new ExpressionWrapper(BinaryOperationNode.create(parseReferenceExpression(expr), OperatorNode.create("between symmetric"), AndNode.create(parseValueExpression(start), parseValueExpression(end))));
		},
		and(exprs) {
			if (isReadonlyArray(exprs)) return new ExpressionWrapper(parseFilterList(exprs, "and"));
			return new ExpressionWrapper(parseFilterObject(exprs, "and"));
		},
		or(exprs) {
			if (isReadonlyArray(exprs)) return new ExpressionWrapper(parseFilterList(exprs, "or"));
			return new ExpressionWrapper(parseFilterObject(exprs, "or"));
		},
		parens(...args) {
			const node = parseValueBinaryOperationOrExpression(args);
			if (ParensNode.is(node)) return new ExpressionWrapper(node);
			else return new ExpressionWrapper(ParensNode.create(node));
		},
		cast(expr, dataType) {
			return new ExpressionWrapper(CastNode.create(parseReferenceExpression(expr), parseDataTypeExpression(dataType)));
		}
	});
	eb.fn = createFunctionModule();
	eb.eb = eb;
	return eb;
}
function expressionBuilder(_) {
	return createExpressionBuilder();
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/parser/expression-parser.js
function parseExpression(exp) {
	if (isOperationNodeSource(exp)) return exp.toOperationNode();
	else if (isFunction(exp)) return exp(expressionBuilder()).toOperationNode();
	throw new Error(`invalid expression: ${JSON.stringify(exp)}`);
}
function parseAliasedExpression(exp) {
	if (isOperationNodeSource(exp)) return exp.toOperationNode();
	else if (isFunction(exp)) return exp(expressionBuilder()).toOperationNode();
	throw new Error(`invalid aliased expression: ${JSON.stringify(exp)}`);
}
function isExpressionOrFactory(obj) {
	return isExpression(obj) || isAliasedExpression(obj) || isFunction(obj);
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/dynamic/dynamic-table-builder.js
var DynamicTableBuilder = class {
	#table;
	get table() {
		return this.#table;
	}
	constructor(table) {
		this.#table = table;
	}
	as(alias) {
		return new AliasedDynamicTableBuilder(this.#table, alias);
	}
};
var AliasedDynamicTableBuilder = class {
	#table;
	#alias;
	get table() {
		return this.#table;
	}
	get alias() {
		return this.#alias;
	}
	constructor(table, alias) {
		this.#table = table;
		this.#alias = alias;
	}
	toOperationNode() {
		return AliasNode.create(parseTable(this.#table), IdentifierNode.create(this.#alias));
	}
};
function isAliasedDynamicTableBuilder(obj) {
	return isObject(obj) && isOperationNodeSource(obj) && isString(obj.table) && isString(obj.alias);
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/parser/table-parser.js
function parseTableExpressionOrList(table) {
	if (isReadonlyArray(table)) return table.map((it) => parseTableExpression(it));
	else return [parseTableExpression(table)];
}
function parseTableExpression(table) {
	if (isString(table)) return parseAliasedTable(table);
	else if (isAliasedDynamicTableBuilder(table)) return table.toOperationNode();
	else return parseAliasedExpression(table);
}
function parseAliasedTable(from) {
	const ALIAS_SEPARATOR = " as ";
	if (from.includes(ALIAS_SEPARATOR)) {
		const [table, alias] = from.split(ALIAS_SEPARATOR).map(trim$1);
		return AliasNode.create(parseTable(table), IdentifierNode.create(alias));
	} else return parseTable(from);
}
function parseTable(from) {
	const SCHEMA_SEPARATOR = ".";
	if (from.includes(SCHEMA_SEPARATOR)) {
		const [schema, table] = from.split(SCHEMA_SEPARATOR).map(trim$1);
		return TableNode.createWithSchema(schema, table);
	} else return TableNode.create(from);
}
function trim$1(str) {
	return str.trim();
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/add-column-node.js
/**
* @internal
*/
const AddColumnNode = freeze({
	is(node) {
		return node.kind === "AddColumnNode";
	},
	create(column) {
		return freeze({
			kind: "AddColumnNode",
			column
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/column-definition-node.js
/**
* @internal
*/
const ColumnDefinitionNode = freeze({
	is(node) {
		return node.kind === "ColumnDefinitionNode";
	},
	create(column, dataType) {
		return freeze({
			kind: "ColumnDefinitionNode",
			column: ColumnNode.create(column),
			dataType
		});
	},
	cloneWithFrontModifier(node, modifier) {
		return freeze({
			...node,
			frontModifiers: node.frontModifiers ? freeze([...node.frontModifiers, modifier]) : [modifier]
		});
	},
	cloneWithEndModifier(node, modifier) {
		return freeze({
			...node,
			endModifiers: node.endModifiers ? freeze([...node.endModifiers, modifier]) : [modifier]
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/drop-column-node.js
/**
* @internal
*/
const DropColumnNode = freeze({
	is(node) {
		return node.kind === "DropColumnNode";
	},
	create(column) {
		return freeze({
			kind: "DropColumnNode",
			column: ColumnNode.create(column)
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/rename-column-node.js
/**
* @internal
*/
const RenameColumnNode = freeze({
	is(node) {
		return node.kind === "RenameColumnNode";
	},
	create(column, newColumn) {
		return freeze({
			kind: "RenameColumnNode",
			column: ColumnNode.create(column),
			renameTo: ColumnNode.create(newColumn)
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/check-constraint-node.js
/**
* @internal
*/
const CheckConstraintNode = freeze({
	is(node) {
		return node.kind === "CheckConstraintNode";
	},
	create(expression, constraintName) {
		return freeze({
			kind: "CheckConstraintNode",
			expression,
			name: constraintName ? IdentifierNode.create(constraintName) : void 0
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/references-node.js
const ON_MODIFY_FOREIGN_ACTIONS_DICTIONARY = freeze({
	cascade: true,
	"no action": true,
	restrict: true,
	"set default": true,
	"set null": true
});
Object.keys(ON_MODIFY_FOREIGN_ACTIONS_DICTIONARY);
/**
* @internal
*/
const ReferencesNode = freeze({
	is(node) {
		return node.kind === "ReferencesNode";
	},
	create(table, columns) {
		return freeze({
			kind: "ReferencesNode",
			table,
			columns: freeze([...columns])
		});
	},
	cloneWithOnDelete(references, onDelete) {
		return freeze({
			...references,
			onDelete
		});
	},
	cloneWithOnUpdate(references, onUpdate) {
		return freeze({
			...references,
			onUpdate
		});
	}
});
function isOnModifyForeignAction(thing) {
	return isString(thing) && ON_MODIFY_FOREIGN_ACTIONS_DICTIONARY[thing];
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/parser/default-value-parser.js
function parseDefaultValueExpression(value) {
	return isOperationNodeSource(value) ? value.toOperationNode() : ValueNode.createImmediate(value);
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/generated-node.js
/**
* @internal
*/
const GeneratedNode = freeze({
	is(node) {
		return node.kind === "GeneratedNode";
	},
	create(params) {
		return freeze({
			kind: "GeneratedNode",
			...params
		});
	},
	createWithExpression(expression) {
		return freeze({
			kind: "GeneratedNode",
			always: true,
			expression
		});
	},
	cloneWith(node, params) {
		return freeze({
			...node,
			...params
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/default-value-node.js
/**
* @internal
*/
const DefaultValueNode = freeze({
	is(node) {
		return node.kind === "DefaultValueNode";
	},
	create(defaultValue) {
		return freeze({
			kind: "DefaultValueNode",
			defaultValue
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/parser/on-modify-action-parser.js
function parseOnModifyForeignAction(action) {
	if (isOnModifyForeignAction(action)) return action;
	throw new Error(`invalid OnModifyForeignAction ${action}`);
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/schema/column-definition-builder.js
var ColumnDefinitionBuilder = class ColumnDefinitionBuilder {
	#node;
	constructor(node) {
		this.#node = node;
	}
	/**
	* Adds `auto_increment` or `autoincrement` to the column definition
	* depending on the dialect.
	*
	* Some dialects like PostgreSQL don't support this. On PostgreSQL
	* you can use the `serial` or `bigserial` data type instead.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', col => col.autoIncrement().primaryKey())
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `id` integer primary key auto_increment
	* )
	* ```
	*/
	autoIncrement() {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { autoIncrement: true }));
	}
	/**
	* Makes the column an identity column.
	*
	* This only works on some dialects like MS SQL Server (MSSQL).
	*
	* For PostgreSQL's `generated always as identity` use {@link generatedAlwaysAsIdentity}.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', col => col.identity().primaryKey())
	*   .execute()
	* ```
	*
	* The generated SQL (MSSQL):
	*
	* ```sql
	* create table "person" (
	*   "id" integer identity primary key
	* )
	* ```
	*/
	identity() {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { identity: true }));
	}
	/**
	* Makes the column the primary key.
	*
	* If you want to specify a composite primary key use the
	* {@link CreateTableBuilder.addPrimaryKeyConstraint} method.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', col => col.primaryKey())
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `id` integer primary key
	* )
	*/
	primaryKey() {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { primaryKey: true }));
	}
	/**
	* Adds a foreign key constraint for the column.
	*
	* If your database engine doesn't support foreign key constraints in the
	* column definition (like MySQL 5) you need to call the table level
	* {@link CreateTableBuilder.addForeignKeyConstraint} method instead.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('pet')
	*   .addColumn('owner_id', 'integer', (col) => col.references('person.id'))
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* create table "pet" (
	*   "owner_id" integer references "person" ("id")
	* )
	* ```
	*/
	references(ref) {
		const references = parseStringReference(ref);
		if (!references.table || SelectAllNode.is(references.column)) throw new Error(`invalid call references('${ref}'). The reference must have format table.column or schema.table.column`);
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { references: ReferencesNode.create(references.table, [references.column]) }));
	}
	/**
	* Adds an `on delete` constraint for the foreign key column.
	*
	* If your database engine doesn't support foreign key constraints in the
	* column definition (like MySQL 5) you need to call the table level
	* {@link CreateTableBuilder.addForeignKeyConstraint} method instead.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('pet')
	*   .addColumn(
	*     'owner_id',
	*     'integer',
	*     (col) => col.references('person.id').onDelete('cascade')
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* create table "pet" (
	*   "owner_id" integer references "person" ("id") on delete cascade
	* )
	* ```
	*/
	onDelete(onDelete) {
		if (!this.#node.references) throw new Error("on delete constraint can only be added for foreign keys");
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { references: ReferencesNode.cloneWithOnDelete(this.#node.references, parseOnModifyForeignAction(onDelete)) }));
	}
	/**
	* Adds an `on update` constraint for the foreign key column.
	*
	* If your database engine doesn't support foreign key constraints in the
	* column definition (like MySQL 5) you need to call the table level
	* {@link CreateTableBuilder.addForeignKeyConstraint} method instead.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('pet')
	*   .addColumn(
	*     'owner_id',
	*     'integer',
	*     (col) => col.references('person.id').onUpdate('cascade')
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* create table "pet" (
	*   "owner_id" integer references "person" ("id") on update cascade
	* )
	* ```
	*/
	onUpdate(onUpdate) {
		if (!this.#node.references) throw new Error("on update constraint can only be added for foreign keys");
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { references: ReferencesNode.cloneWithOnUpdate(this.#node.references, parseOnModifyForeignAction(onUpdate)) }));
	}
	/**
	* Adds a unique constraint for the column.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('email', 'varchar(255)', col => col.unique())
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `email` varchar(255) unique
	* )
	* ```
	*/
	unique() {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { unique: true }));
	}
	/**
	* Adds a `not null` constraint for the column.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('first_name', 'varchar(255)', col => col.notNull())
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `first_name` varchar(255) not null
	* )
	* ```
	*/
	notNull() {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { notNull: true }));
	}
	/**
	* Adds a `unsigned` modifier for the column.
	*
	* This only works on some dialects like MySQL.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('age', 'integer', col => col.unsigned())
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `age` integer unsigned
	* )
	* ```
	*/
	unsigned() {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { unsigned: true }));
	}
	/**
	* Adds a default value constraint for the column.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('pet')
	*   .addColumn('number_of_legs', 'integer', (col) => col.defaultTo(4))
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `pet` (
	*   `number_of_legs` integer default 4
	* )
	* ```
	*
	* Values passed to `defaultTo` are interpreted as value literals by default. You can define
	* an arbitrary SQL expression using the {@link sql} template tag:
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('pet')
	*   .addColumn(
	*     'created_at',
	*     'timestamp',
	*     (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`)
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `pet` (
	*   `created_at` timestamp default CURRENT_TIMESTAMP
	* )
	* ```
	*/
	defaultTo(value) {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { defaultTo: DefaultValueNode.create(parseDefaultValueExpression(value)) }));
	}
	/**
	* Adds a check constraint for the column.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('pet')
	*   .addColumn('number_of_legs', 'integer', (col) =>
	*     col.check(sql`number_of_legs < 5`)
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `pet` (
	*   `number_of_legs` integer check (number_of_legs < 5)
	* )
	* ```
	*/
	check(expression) {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { check: CheckConstraintNode.create(expression.toOperationNode()) }));
	}
	/**
	* Makes the column a generated column using a `generated always as` statement.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('person')
	*   .addColumn('full_name', 'varchar(255)',
	*     (col) => col.generatedAlwaysAs(sql`concat(first_name, ' ', last_name)`)
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `full_name` varchar(255) generated always as (concat(first_name, ' ', last_name))
	* )
	* ```
	*/
	generatedAlwaysAs(expression) {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { generated: GeneratedNode.createWithExpression(expression.toOperationNode()) }));
	}
	/**
	* Adds the `generated always as identity` specifier.
	*
	* This only works on some dialects like PostgreSQL.
	*
	* For MS SQL Server (MSSQL)'s identity column use {@link identity}.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', col => col.generatedAlwaysAsIdentity().primaryKey())
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* create table "person" (
	*   "id" integer generated always as identity primary key
	* )
	* ```
	*/
	generatedAlwaysAsIdentity() {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { generated: GeneratedNode.create({
			identity: true,
			always: true
		}) }));
	}
	/**
	* Adds the `generated by default as identity` specifier on supported dialects.
	*
	* This only works on some dialects like PostgreSQL.
	*
	* For MS SQL Server (MSSQL)'s identity column use {@link identity}.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', col => col.generatedByDefaultAsIdentity().primaryKey())
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* create table "person" (
	*   "id" integer generated by default as identity primary key
	* )
	* ```
	*/
	generatedByDefaultAsIdentity() {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { generated: GeneratedNode.create({
			identity: true,
			byDefault: true
		}) }));
	}
	/**
	* Makes a generated column stored instead of virtual. This method can only
	* be used with {@link generatedAlwaysAs}
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('person')
	*   .addColumn('full_name', 'varchar(255)', (col) => col
	*     .generatedAlwaysAs(sql`concat(first_name, ' ', last_name)`)
	*     .stored()
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `full_name` varchar(255) generated always as (concat(first_name, ' ', last_name)) stored
	* )
	* ```
	*/
	stored() {
		if (!this.#node.generated) throw new Error("stored() can only be called after generatedAlwaysAs");
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { generated: GeneratedNode.cloneWith(this.#node.generated, { stored: true }) }));
	}
	/**
	* This can be used to add any additional SQL right after the column's data type.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', col => col.primaryKey())
	*   .addColumn(
	*     'first_name',
	*     'varchar(36)',
	*     (col) => col.modifyFront(sql`collate utf8mb4_general_ci`).notNull()
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `id` integer primary key,
	*   `first_name` varchar(36) collate utf8mb4_general_ci not null
	* )
	* ```
	*/
	modifyFront(modifier) {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWithFrontModifier(this.#node, modifier.toOperationNode()));
	}
	/**
	* Adds `nulls not distinct` specifier.
	* Should be used with `unique` constraint.
	*
	* This only works on some dialects like PostgreSQL.
	*
	* ### Examples
	*
	* ```ts
	* db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', col => col.primaryKey())
	*   .addColumn('first_name', 'varchar(30)', col => col.unique().nullsNotDistinct())
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* create table "person" (
	*   "id" integer primary key,
	*   "first_name" varchar(30) unique nulls not distinct
	* )
	* ```
	*/
	nullsNotDistinct() {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { nullsNotDistinct: true }));
	}
	/**
	* Adds `if not exists` specifier. This only works for PostgreSQL.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .alterTable('person')
	*   .addColumn('email', 'varchar(255)', col => col.unique().ifNotExists())
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* alter table "person" add column if not exists "email" varchar(255) unique
	* ```
	*/
	ifNotExists() {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { ifNotExists: true }));
	}
	/**
	* This can be used to add any additional SQL to the end of the column definition.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', col => col.primaryKey())
	*   .addColumn(
	*     'age',
	*     'integer',
	*     col => col.unsigned()
	*       .notNull()
	*       .modifyEnd(sql`comment ${sql.lit('it is not polite to ask a woman her age')}`)
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `id` integer primary key,
	*   `age` integer unsigned not null comment 'it is not polite to ask a woman her age'
	* )
	* ```
	*/
	modifyEnd(modifier) {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWithEndModifier(this.#node, modifier.toOperationNode()));
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#node;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/modify-column-node.js
/**
* @internal
*/
const ModifyColumnNode = freeze({
	is(node) {
		return node.kind === "ModifyColumnNode";
	},
	create(column) {
		return freeze({
			kind: "ModifyColumnNode",
			column
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/foreign-key-constraint-node.js
/**
* @internal
*/
const ForeignKeyConstraintNode = freeze({
	is(node) {
		return node.kind === "ForeignKeyConstraintNode";
	},
	create(sourceColumns, targetTable, targetColumns, constraintName) {
		return freeze({
			kind: "ForeignKeyConstraintNode",
			columns: sourceColumns,
			references: ReferencesNode.create(targetTable, targetColumns),
			name: constraintName ? IdentifierNode.create(constraintName) : void 0
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/schema/foreign-key-constraint-builder.js
var ForeignKeyConstraintBuilder = class ForeignKeyConstraintBuilder {
	#node;
	constructor(node) {
		this.#node = node;
	}
	onDelete(onDelete) {
		return new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(this.#node, { onDelete: parseOnModifyForeignAction(onDelete) }));
	}
	onUpdate(onUpdate) {
		return new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(this.#node, { onUpdate: parseOnModifyForeignAction(onUpdate) }));
	}
	deferrable() {
		return new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(this.#node, { deferrable: true }));
	}
	notDeferrable() {
		return new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(this.#node, { deferrable: false }));
	}
	initiallyDeferred() {
		return new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(this.#node, { initiallyDeferred: true }));
	}
	initiallyImmediate() {
		return new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(this.#node, { initiallyDeferred: false }));
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#node;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/add-constraint-node.js
/**
* @internal
*/
const AddConstraintNode = freeze({
	is(node) {
		return node.kind === "AddConstraintNode";
	},
	create(constraint) {
		return freeze({
			kind: "AddConstraintNode",
			constraint
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/unique-constraint-node.js
/**
* @internal
*/
const UniqueConstraintNode = freeze({
	is(node) {
		return node.kind === "UniqueConstraintNode";
	},
	create(columns, constraintName, nullsNotDistinct) {
		if (isString(columns.at(0))) {
			logOnce("`UniqueConstraintNode.create(columns: string[], ...)` is deprecated - pass `ColumnNode[]` instead.");
			columns = columns.map(ColumnNode.create);
		}
		return freeze({
			kind: "UniqueConstraintNode",
			columns: freeze(columns),
			name: constraintName ? IdentifierNode.create(constraintName) : void 0,
			nullsNotDistinct
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/drop-constraint-node.js
/**
* @internal
*/
const DropConstraintNode = freeze({
	is(node) {
		return node.kind === "DropConstraintNode";
	},
	create(constraintName) {
		return freeze({
			kind: "DropConstraintNode",
			constraintName: IdentifierNode.create(constraintName)
		});
	},
	cloneWith(dropConstraint, props) {
		return freeze({
			...dropConstraint,
			...props
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/alter-column-node.js
/**
* @internal
*/
const AlterColumnNode = freeze({
	is(node) {
		return node.kind === "AlterColumnNode";
	},
	create(column, prop, value) {
		return freeze({
			kind: "AlterColumnNode",
			column: ColumnNode.create(column),
			[prop]: value
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/schema/alter-column-builder.js
var AlterColumnBuilder = class {
	#column;
	constructor(column) {
		this.#column = column;
	}
	setDataType(dataType) {
		return new AlteredColumnBuilder(AlterColumnNode.create(this.#column, "dataType", parseDataTypeExpression(dataType)));
	}
	setDefault(value) {
		return new AlteredColumnBuilder(AlterColumnNode.create(this.#column, "setDefault", parseDefaultValueExpression(value)));
	}
	dropDefault() {
		return new AlteredColumnBuilder(AlterColumnNode.create(this.#column, "dropDefault", true));
	}
	setNotNull() {
		return new AlteredColumnBuilder(AlterColumnNode.create(this.#column, "setNotNull", true));
	}
	dropNotNull() {
		return new AlteredColumnBuilder(AlterColumnNode.create(this.#column, "dropNotNull", true));
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
};
/**
* Allows us to force consumers to do exactly one alteration to a column.
*
* One cannot do no alterations:
*
* ```ts
* await db.schema
*   .alterTable('person')
* //  .execute() // Property 'execute' does not exist on type 'AlteredColumnBuilder'.
* ```
*
* ```ts
* await db.schema
*   .alterTable('person')
* //  .alterColumn('age', (ac) => ac) // Type 'AlterColumnBuilder' is not assignable to type 'AlteredColumnBuilder'.
* //  .execute()
* ```
*
* One cannot do multiple alterations:
*
* ```ts
* await db.schema
*   .alterTable('person')
* //  .alterColumn('age', (ac) => ac.dropNotNull().setNotNull()) // Property 'setNotNull' does not exist on type 'AlteredColumnBuilder'.
* //  .execute()
* ```
*
* Which would now throw a compilation error, instead of a runtime error.
*/
var AlteredColumnBuilder = class {
	#alterColumnNode;
	constructor(alterColumnNode) {
		this.#alterColumnNode = alterColumnNode;
	}
	toOperationNode() {
		return this.#alterColumnNode;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/schema/alter-table-executor.js
var AlterTableExecutor = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/schema/alter-table-add-foreign-key-constraint-builder.js
var AlterTableAddForeignKeyConstraintBuilder = class AlterTableAddForeignKeyConstraintBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	onDelete(onDelete) {
		return new AlterTableAddForeignKeyConstraintBuilder({
			...this.#props,
			constraintBuilder: this.#props.constraintBuilder.onDelete(onDelete)
		});
	}
	onUpdate(onUpdate) {
		return new AlterTableAddForeignKeyConstraintBuilder({
			...this.#props,
			constraintBuilder: this.#props.constraintBuilder.onUpdate(onUpdate)
		});
	}
	deferrable() {
		return new AlterTableAddForeignKeyConstraintBuilder({
			...this.#props,
			constraintBuilder: this.#props.constraintBuilder.deferrable()
		});
	}
	notDeferrable() {
		return new AlterTableAddForeignKeyConstraintBuilder({
			...this.#props,
			constraintBuilder: this.#props.constraintBuilder.notDeferrable()
		});
	}
	initiallyDeferred() {
		return new AlterTableAddForeignKeyConstraintBuilder({
			...this.#props,
			constraintBuilder: this.#props.constraintBuilder.initiallyDeferred()
		});
	}
	initiallyImmediate() {
		return new AlterTableAddForeignKeyConstraintBuilder({
			...this.#props,
			constraintBuilder: this.#props.constraintBuilder.initiallyImmediate()
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(AlterTableNode.cloneWithTableProps(this.#props.node, { addConstraint: AddConstraintNode.create(this.#props.constraintBuilder.toOperationNode()) }), this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/schema/alter-table-drop-constraint-builder.js
var AlterTableDropConstraintBuilder = class AlterTableDropConstraintBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	ifExists() {
		return new AlterTableDropConstraintBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { dropConstraint: DropConstraintNode.cloneWith(this.#props.node.dropConstraint, { ifExists: true }) })
		});
	}
	cascade() {
		return new AlterTableDropConstraintBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { dropConstraint: DropConstraintNode.cloneWith(this.#props.node.dropConstraint, { modifier: "cascade" }) })
		});
	}
	restrict() {
		return new AlterTableDropConstraintBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { dropConstraint: DropConstraintNode.cloneWith(this.#props.node.dropConstraint, { modifier: "restrict" }) })
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/primary-key-constraint-node.js
/**
* @internal
*/
const PrimaryKeyConstraintNode = freeze({
	is(node) {
		return node.kind === "PrimaryKeyConstraintNode";
	},
	create(columns, constraintName) {
		return freeze({
			kind: "PrimaryKeyConstraintNode",
			columns: freeze(columns.map(ColumnNode.create)),
			name: constraintName ? IdentifierNode.create(constraintName) : void 0
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/add-index-node.js
/**
* @internal
*/
const AddIndexNode = freeze({
	is(node) {
		return node.kind === "AddIndexNode";
	},
	create(name) {
		return freeze({
			kind: "AddIndexNode",
			name: IdentifierNode.create(name)
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	},
	cloneWithColumns(node, columns) {
		return freeze({
			...node,
			columns: [...node.columns || [], ...columns]
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/schema/alter-table-add-index-builder.js
var AlterTableAddIndexBuilder = class AlterTableAddIndexBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Makes the index unique.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .alterTable('person')
	*   .addIndex('person_first_name_index')
	*   .unique()
	*   .column('email')
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* alter table `person` add unique index `person_first_name_index` (`email`)
	* ```
	*/
	unique() {
		return new AlterTableAddIndexBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { addIndex: AddIndexNode.cloneWith(this.#props.node.addIndex, { unique: true }) })
		});
	}
	column(arg) {
		return new AlterTableAddIndexBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { addIndex: AddIndexNode.cloneWithColumns(this.#props.node.addIndex, [isString(arg) ? parseOrderedColumnName(arg) : arg.toOperationNode()]) })
		});
	}
	/**
	* Specifies a list of columns for the index.
	*
	* Also see {@link column} for adding a single column or {@link expression} for
	* specifying an arbitrary expression.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .alterTable('person')
	*   .addIndex('person_first_name_and_age_index')
	*   .columns(['first_name', sql`(left(lower(last_name), 1))`, 'age desc'])
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* alter table `person`
	* add index `person_first_name_and_age_index` (
	*   `first_name`,
	*   (left(lower(last_name), 1)),
	*   `age` desc
	* )
	* ```
	*/
	columns(columns) {
		return new AlterTableAddIndexBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { addIndex: AddIndexNode.cloneWithColumns(this.#props.node.addIndex, columns.map((item) => isString(item) ? parseOrderedColumnName(item) : item.toOperationNode())) })
		});
	}
	/**
	* Specifies an arbitrary expression for the index.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .alterTable('person')
	*   .addIndex('person_first_name_index')
	*   .expression(sql<boolean>`(first_name < 'Sami')`)
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* alter table `person` add index `person_first_name_index` ((first_name < 'Sami'))
	* ```
	*
	* @deprecated Use {@link column} or {@link columns} with an {@link Expression} instead.
	*/
	expression(expression) {
		return new AlterTableAddIndexBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { addIndex: AddIndexNode.cloneWithColumns(this.#props.node.addIndex, [expression.toOperationNode()]) })
		});
	}
	using(indexType) {
		return new AlterTableAddIndexBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { addIndex: AddIndexNode.cloneWith(this.#props.node.addIndex, { using: RawNode.createWithSql(indexType) }) })
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/schema/unique-constraint-builder.js
var UniqueConstraintNodeBuilder = class UniqueConstraintNodeBuilder {
	#node;
	constructor(node) {
		this.#node = node;
	}
	/**
	* Adds `nulls not distinct` to the unique constraint definition
	*
	* Supported by PostgreSQL dialect only
	*/
	nullsNotDistinct() {
		return new UniqueConstraintNodeBuilder(UniqueConstraintNode.cloneWith(this.#node, { nullsNotDistinct: true }));
	}
	deferrable() {
		return new UniqueConstraintNodeBuilder(UniqueConstraintNode.cloneWith(this.#node, { deferrable: true }));
	}
	notDeferrable() {
		return new UniqueConstraintNodeBuilder(UniqueConstraintNode.cloneWith(this.#node, { deferrable: false }));
	}
	initiallyDeferred() {
		return new UniqueConstraintNodeBuilder(UniqueConstraintNode.cloneWith(this.#node, { initiallyDeferred: true }));
	}
	initiallyImmediate() {
		return new UniqueConstraintNodeBuilder(UniqueConstraintNode.cloneWith(this.#node, { initiallyDeferred: false }));
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#node;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/schema/primary-key-constraint-builder.js
var PrimaryKeyConstraintBuilder = class PrimaryKeyConstraintBuilder {
	#node;
	constructor(node) {
		this.#node = node;
	}
	deferrable() {
		return new PrimaryKeyConstraintBuilder(PrimaryKeyConstraintNode.cloneWith(this.#node, { deferrable: true }));
	}
	notDeferrable() {
		return new PrimaryKeyConstraintBuilder(PrimaryKeyConstraintNode.cloneWith(this.#node, { deferrable: false }));
	}
	initiallyDeferred() {
		return new PrimaryKeyConstraintBuilder(PrimaryKeyConstraintNode.cloneWith(this.#node, { initiallyDeferred: true }));
	}
	initiallyImmediate() {
		return new PrimaryKeyConstraintBuilder(PrimaryKeyConstraintNode.cloneWith(this.#node, { initiallyDeferred: false }));
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#node;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/schema/check-constraint-builder.js
var CheckConstraintBuilder = class {
	#node;
	constructor(node) {
		this.#node = node;
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#node;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/rename-constraint-node.js
/**
* @internal
*/
const RenameConstraintNode = freeze({
	is(node) {
		return node.kind === "RenameConstraintNode";
	},
	create(oldName, newName) {
		return freeze({
			kind: "RenameConstraintNode",
			oldName: IdentifierNode.create(oldName),
			newName: IdentifierNode.create(newName)
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/schema/drop-column-builder.js
var DropColumnBuilder = class DropColumnBuilder {
	#props;
	constructor(props) {
		this.#props = freeze({ ...props });
	}
	ifExists() {
		return new DropColumnBuilder({
			...this.#props,
			node: DropColumnNode.cloneWith(this.#props.node, { ifExists: true })
		});
	}
	toOperationNode() {
		return this.#props.node;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/schema/alter-table-builder.js
/**
* This builder can be used to create a `alter table` query.
*/
var AlterTableBuilder = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	renameTo(newTableName) {
		return new AlterTableExecutor({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { renameTo: parseTable(newTableName) })
		});
	}
	setSchema(newSchema) {
		return new AlterTableExecutor({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { setSchema: IdentifierNode.create(newSchema) })
		});
	}
	alterColumn(column, alteration) {
		const builder = alteration(new AlterColumnBuilder(column));
		return new AlterTableColumnAlteringBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, builder.toOperationNode())
		});
	}
	dropColumn(column, build = noop) {
		const builder = build(new DropColumnBuilder({ node: DropColumnNode.create(column) }));
		return new AlterTableColumnAlteringBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, builder.toOperationNode())
		});
	}
	renameColumn(column, newColumn) {
		return new AlterTableColumnAlteringBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, RenameColumnNode.create(column, newColumn))
		});
	}
	addColumn(columnName, dataType, build = noop) {
		const builder = build(new ColumnDefinitionBuilder(ColumnDefinitionNode.create(columnName, parseDataTypeExpression(dataType))));
		return new AlterTableColumnAlteringBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, AddColumnNode.create(builder.toOperationNode()))
		});
	}
	modifyColumn(columnName, dataType, build = noop) {
		const builder = build(new ColumnDefinitionBuilder(ColumnDefinitionNode.create(columnName, parseDataTypeExpression(dataType))));
		return new AlterTableColumnAlteringBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, ModifyColumnNode.create(builder.toOperationNode()))
		});
	}
	/**
	* See {@link CreateTableBuilder.addUniqueConstraint}
	*/
	addUniqueConstraint(constraintName, columns, build = noop) {
		const uniqueConstraintBuilder = build(new UniqueConstraintNodeBuilder(UniqueConstraintNode.create(columns.map((column) => isString(column) ? ColumnNode.create(column) : parseExpression(column)), constraintName)));
		return new AlterTableExecutor({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { addConstraint: AddConstraintNode.create(uniqueConstraintBuilder.toOperationNode()) })
		});
	}
	/**
	* See {@link CreateTableBuilder.addCheckConstraint}
	*/
	addCheckConstraint(constraintName, checkExpression, build = noop) {
		const constraintBuilder = build(new CheckConstraintBuilder(CheckConstraintNode.create(checkExpression.toOperationNode(), constraintName)));
		return new AlterTableExecutor({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { addConstraint: AddConstraintNode.create(constraintBuilder.toOperationNode()) })
		});
	}
	/**
	* See {@link CreateTableBuilder.addForeignKeyConstraint}
	*
	* Unlike {@link CreateTableBuilder.addForeignKeyConstraint} this method returns
	* the constraint builder and doesn't take a callback as the last argument. This
	* is because you can only add one column per `ALTER TABLE` query.
	*/
	addForeignKeyConstraint(constraintName, columns, targetTable, targetColumns, build = noop) {
		const constraintBuilder = build(new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.create(columns.map(ColumnNode.create), parseTable(targetTable), targetColumns.map(ColumnNode.create), constraintName)));
		return new AlterTableAddForeignKeyConstraintBuilder({
			...this.#props,
			constraintBuilder
		});
	}
	/**
	* See {@link CreateTableBuilder.addPrimaryKeyConstraint}
	*/
	addPrimaryKeyConstraint(constraintName, columns, build = noop) {
		const constraintBuilder = build(new PrimaryKeyConstraintBuilder(PrimaryKeyConstraintNode.create(columns, constraintName)));
		return new AlterTableExecutor({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { addConstraint: AddConstraintNode.create(constraintBuilder.toOperationNode()) })
		});
	}
	dropConstraint(constraintName) {
		return new AlterTableDropConstraintBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { dropConstraint: DropConstraintNode.create(constraintName) })
		});
	}
	renameConstraint(oldName, newName) {
		return new AlterTableDropConstraintBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { renameConstraint: RenameConstraintNode.create(oldName, newName) })
		});
	}
	/**
	* This can be used to add index to table.
	*
	*  ### Examples
	*
	* ```ts
	* db.schema.alterTable('person')
	*   .addIndex('person_email_index')
	*   .column('email')
	*   .unique()
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* alter table `person` add unique index `person_email_index` (`email`)
	* ```
	*/
	addIndex(indexName) {
		return new AlterTableAddIndexBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { addIndex: AddIndexNode.create(indexName) })
		});
	}
	/**
	* This can be used to drop index from table.
	*
	* ### Examples
	*
	* ```ts
	* db.schema.alterTable('person')
	*   .dropIndex('person_email_index')
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* alter table `person` drop index `test_first_name_index`
	* ```
	*/
	dropIndex(indexName) {
		return new AlterTableExecutor({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { dropIndex: DropIndexNode.create(indexName) })
		});
	}
	/**
	* Calls the given function passing `this` as the only argument.
	*
	* See {@link CreateTableBuilder.$call}
	*/
	$call(func) {
		return func(this);
	}
};
var AlterTableColumnAlteringBuilder = class AlterTableColumnAlteringBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	alterColumn(column, alteration) {
		const builder = alteration(new AlterColumnBuilder(column));
		return new AlterTableColumnAlteringBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, builder.toOperationNode())
		});
	}
	dropColumn(column, build = noop) {
		const builder = build(new DropColumnBuilder({ node: DropColumnNode.create(column) }));
		return new AlterTableColumnAlteringBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, builder.toOperationNode())
		});
	}
	renameColumn(column, newColumn) {
		return new AlterTableColumnAlteringBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, RenameColumnNode.create(column, newColumn))
		});
	}
	addColumn(columnName, dataType, build = noop) {
		const builder = build(new ColumnDefinitionBuilder(ColumnDefinitionNode.create(columnName, parseDataTypeExpression(dataType))));
		return new AlterTableColumnAlteringBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, AddColumnNode.create(builder.toOperationNode()))
		});
	}
	modifyColumn(columnName, dataType, build = noop) {
		const builder = build(new ColumnDefinitionBuilder(ColumnDefinitionNode.create(columnName, parseDataTypeExpression(dataType))));
		return new AlterTableColumnAlteringBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, ModifyColumnNode.create(builder.toOperationNode()))
		});
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/plugin/immediate-value/immediate-value-transformer.js
/**
* Transforms all ValueNodes to immediate.
*
* WARNING! This should never be part of the public API. Users should never use this.
* This is an internal helper.
*
* @internal
*/
var ImmediateValueTransformer = class extends OperationNodeTransformer {
	transformPrimitiveValueList(node) {
		return ValueListNode.create(node.values.map(ValueNode.createImmediate));
	}
	transformValue(node) {
		return ValueNode.createImmediate(node.value);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/schema/create-index-builder.js
var CreateIndexBuilder = class CreateIndexBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Adds the "if not exists" modifier.
	*
	* If the index already exists, no error is thrown if this method has been called.
	*/
	ifNotExists() {
		return new CreateIndexBuilder({
			...this.#props,
			node: CreateIndexNode.cloneWith(this.#props.node, { ifNotExists: true })
		});
	}
	/**
	* Makes the index unique.
	*/
	unique() {
		return new CreateIndexBuilder({
			...this.#props,
			node: CreateIndexNode.cloneWith(this.#props.node, { unique: true })
		});
	}
	/**
	* Adds `nulls not distinct` specifier to index.
	* This only works on some dialects like PostgreSQL.
	*
	* ### Examples
	*
	* ```ts
	* db.schema.createIndex('person_first_name_index')
	*  .on('person')
	*  .column('first_name')
	*  .nullsNotDistinct()
	*  .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* create index "person_first_name_index"
	* on "test" ("first_name")
	* nulls not distinct;
	* ```
	*/
	nullsNotDistinct() {
		return new CreateIndexBuilder({
			...this.#props,
			node: CreateIndexNode.cloneWith(this.#props.node, { nullsNotDistinct: true })
		});
	}
	/**
	* Specifies the table for the index.
	*/
	on(table) {
		return new CreateIndexBuilder({
			...this.#props,
			node: CreateIndexNode.cloneWith(this.#props.node, { table: parseTable(table) })
		});
	}
	column(arg) {
		return new CreateIndexBuilder({
			...this.#props,
			node: CreateIndexNode.cloneWithColumns(this.#props.node, [isString(arg) ? parseOrderedColumnName(arg) : arg.toOperationNode()])
		});
	}
	/**
	* Adds a list of columns to the index.
	*
	* Also see {@link column} for adding a single column.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createIndex('person_first_name_and_age_index')
	*   .on('person')
	*   .columns(['first_name', sql`left(lower("last_name"), 1)`, 'age desc'])
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* create index "person_first_name_and_age_index"
	* on "person" ("first_name", left(lower("last_name"), 1), "age" desc)
	* ```
	*/
	columns(columns) {
		return new CreateIndexBuilder({
			...this.#props,
			node: CreateIndexNode.cloneWithColumns(this.#props.node, columns.map((item) => isString(item) ? parseOrderedColumnName(item) : item.toOperationNode()))
		});
	}
	/**
	* Adds an arbitrary expression as a column to the index.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createIndex('person_first_name_index')
	*   .on('person')
	*   .expression(sql`first_name COLLATE "fi_FI"`)
	*   .column('gender')
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* create index "person_first_name_index"
	* on "person" (first_name COLLATE "fi_FI", "gender")
	* ```
	*
	* @deprecated Use {@link column} or {@link columns} with an {@link Expression} instead.
	*/
	expression(expression) {
		return new CreateIndexBuilder({
			...this.#props,
			node: CreateIndexNode.cloneWithColumns(this.#props.node, [expression.toOperationNode()])
		});
	}
	using(indexType) {
		return new CreateIndexBuilder({
			...this.#props,
			node: CreateIndexNode.cloneWith(this.#props.node, { using: RawNode.createWithSql(indexType) })
		});
	}
	where(...args) {
		const transformer = new ImmediateValueTransformer();
		return new CreateIndexBuilder({
			...this.#props,
			node: QueryNode.cloneWithWhere(this.#props.node, transformer.transformNode(parseValueBinaryOperationOrExpression(args), this.#props.queryId))
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/schema/create-schema-builder.js
var CreateSchemaBuilder = class CreateSchemaBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	ifNotExists() {
		return new CreateSchemaBuilder({
			...this.#props,
			node: CreateSchemaNode.cloneWith(this.#props.node, { ifNotExists: true })
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/parser/on-commit-action-parse.js
function parseOnCommitAction(action) {
	if (ON_COMMIT_ACTIONS.includes(action)) return action;
	throw new Error(`invalid OnCommitAction ${action}`);
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/schema/create-table-add-index-builder.js
var CreateTableAddIndexBuilder = class CreateTableAddIndexBuilder {
	#node;
	constructor(node) {
		this.#node = node;
	}
	using(indexType) {
		return new CreateTableAddIndexBuilder(AddIndexNode.cloneWith(this.#node, { using: RawNode.createWithSql(indexType) }));
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#node;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/schema/create-table-builder.js
/**
* This builder can be used to create a `create table` query.
*/
var CreateTableBuilder = class CreateTableBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Adds the "temporary" modifier.
	*
	* Use this to create a temporary table.
	*/
	temporary() {
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWith(this.#props.node, { temporary: true })
		});
	}
	/**
	* Adds an "on commit" statement.
	*
	* This can be used in conjunction with temporary tables on supported databases
	* like PostgreSQL.
	*/
	onCommit(onCommit) {
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWith(this.#props.node, { onCommit: parseOnCommitAction(onCommit) })
		});
	}
	/**
	* Adds the "if not exists" modifier.
	*
	* If the table already exists, no error is thrown if this method has been called.
	*/
	ifNotExists() {
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWith(this.#props.node, { ifNotExists: true })
		});
	}
	/**
	* Adds a column to the table.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
	*   .addColumn('first_name', 'varchar(50)', (col) => col.notNull())
	*   .addColumn('last_name', 'varchar(255)')
	*   .addColumn('bank_balance', 'numeric(8, 2)')
	*   // You can specify any data type using the `sql` tag if the types
	*   // don't include it.
	*   .addColumn('data', sql`any_type_here`)
	*   .addColumn('parent_id', 'integer', (col) =>
	*     col.references('person.id').onDelete('cascade')
	*   )
	* ```
	*
	* With this method, it's once again good to remember that Kysely just builds the
	* query and doesn't provide the same API for all databases. For example, some
	* databases like older MySQL don't support the `references` statement in the
	* column definition. Instead foreign key constraints need to be defined in the
	* `create table` query. See the next example:
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', (col) => col.primaryKey())
	*   .addColumn('parent_id', 'integer')
	*   .addForeignKeyConstraint(
	*     'person_parent_id_fk',
	*     ['parent_id'],
	*     'person',
	*     ['id'],
	*     (cb) => cb.onDelete('cascade')
	*   )
	*   .execute()
	* ```
	*
	* Another good example is that PostgreSQL doesn't support the `auto_increment`
	* keyword and you need to define an autoincrementing column for example using
	* `serial`:
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'serial', (col) => col.primaryKey())
	*   .execute()
	* ```
	*/
	addColumn(columnName, dataType, build = noop) {
		const columnBuilder = build(new ColumnDefinitionBuilder(ColumnDefinitionNode.create(columnName, parseDataTypeExpression(dataType))));
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWithColumn(this.#props.node, columnBuilder.toOperationNode())
		});
	}
	/**
	* Adds a primary key constraint for one or more columns.
	*
	* The constraint name can be anything you want, but it must be unique
	* across the whole database.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('first_name', 'varchar(64)')
	*   .addColumn('last_name', 'varchar(64)')
	*   .addPrimaryKeyConstraint('primary_key', ['first_name', 'last_name'])
	*   .execute()
	* ```
	*/
	addPrimaryKeyConstraint(constraintName, columns, build = noop) {
		const constraintBuilder = build(new PrimaryKeyConstraintBuilder(PrimaryKeyConstraintNode.create(columns, constraintName)));
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWithConstraint(this.#props.node, constraintBuilder.toOperationNode())
		});
	}
	/**
	* Adds a unique constraint for one or more columns.
	*
	* The constraint name can be anything you want, but it must be unique
	* across the whole database.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('first_name', 'varchar(64)')
	*   .addColumn('last_name', 'varchar(64)')
	*   .addUniqueConstraint(
	*     'first_name_last_name_unique',
	*     ['first_name', 'last_name']
	*   )
	*   .execute()
	* ```
	*
	* In dialects such as PostgreSQL you can specify `nulls not distinct` as follows:
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('first_name', 'varchar(64)')
	*   .addColumn('last_name', 'varchar(64)')
	*   .addUniqueConstraint(
	*     'first_name_last_name_unique',
	*     ['first_name', 'last_name'],
	*     (cb) => cb.nullsNotDistinct()
	*   )
	*   .execute()
	* ```
	*
	* In dialects such as MySQL you create unique constraints on expressions as follows:
	*
	* ```ts
	*
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('person')
	*   .addColumn('first_name', 'varchar(64)')
	*   .addColumn('last_name', 'varchar(64)')
	*   .addUniqueConstraint(
	*     'first_name_last_name_unique',
	*     [sql`(lower('first_name'))`, 'last_name']
	*   )
	*   .execute()
	* ```
	*/
	addUniqueConstraint(constraintName, columns, build = noop) {
		const uniqueConstraintBuilder = build(new UniqueConstraintNodeBuilder(UniqueConstraintNode.create(columns.map((column) => isString(column) ? ColumnNode.create(column) : parseExpression(column)), constraintName)));
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWithConstraint(this.#props.node, uniqueConstraintBuilder.toOperationNode())
		});
	}
	/**
	* Adds an index that includes one or more columns.
	*
	* This is only supported by some dialects like MySQL.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('first_name', 'varchar(64)')
	*   .addColumn('last_name', 'varchar(64)')
	*   .addIndex('last_name_key', ['last_name'])
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `id` integer primary key,
	*   `first_name` varchar(64) not null,
	*   `last_name` varchar(64) not null,
	*   index `last_name_key` (`last_name`)
	* )
	* ```
	*/
	addIndex(indexName, columns, build = noop) {
		const addIndexBuilder = build(new CreateTableAddIndexBuilder(AddIndexNode.cloneWithColumns(AddIndexNode.create(indexName), columns.map((column) => isString(column) ? ColumnNode.create(column) : parseExpression(column)))));
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWithIndex(this.#props.node, addIndexBuilder.toOperationNode())
		});
	}
	/**
	* Adds a check constraint.
	*
	* The constraint name can be anything you want, but it must be unique
	* across the whole database.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('animal')
	*   .addColumn('number_of_legs', 'integer')
	*   .addCheckConstraint('check_legs', sql`number_of_legs < 5`)
	*   .execute()
	* ```
	*/
	addCheckConstraint(constraintName, checkExpression, build = noop) {
		const constraintBuilder = build(new CheckConstraintBuilder(CheckConstraintNode.create(checkExpression.toOperationNode(), constraintName)));
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWithConstraint(this.#props.node, constraintBuilder.toOperationNode())
		});
	}
	/**
	* Adds a foreign key constraint.
	*
	* The constraint name can be anything you want, but it must be unique
	* across the whole database.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('pet')
	*   .addColumn('owner_id', 'integer')
	*   .addForeignKeyConstraint(
	*     'owner_id_foreign',
	*     ['owner_id'],
	*     'person',
	*     ['id'],
	*   )
	*   .execute()
	* ```
	*
	* Add constraint for multiple columns:
	*
	* ```ts
	* await db.schema
	*   .createTable('pet')
	*   .addColumn('owner_id1', 'integer')
	*   .addColumn('owner_id2', 'integer')
	*   .addForeignKeyConstraint(
	*     'owner_id_foreign',
	*     ['owner_id1', 'owner_id2'],
	*     'person',
	*     ['id1', 'id2'],
	*     (cb) => cb.onDelete('cascade')
	*   )
	*   .execute()
	* ```
	*/
	addForeignKeyConstraint(constraintName, columns, targetTable, targetColumns, build = noop) {
		const builder = build(new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.create(columns.map(ColumnNode.create), parseTable(targetTable), targetColumns.map(ColumnNode.create), constraintName)));
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWithConstraint(this.#props.node, builder.toOperationNode())
		});
	}
	/**
	* This can be used to add any additional SQL to the front of the query __after__ the `create` keyword.
	*
	* Also see {@link temporary}.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('person')
	*   .modifyFront(sql`global temporary`)
	*   .addColumn('id', 'integer', col => col.primaryKey())
	*   .addColumn('first_name', 'varchar(64)', col => col.notNull())
	*   .addColumn('last_name', 'varchar(64)', col => col.notNull())
	*   .execute()
	* ```
	*
	* The generated SQL (Postgres):
	*
	* ```sql
	* create global temporary table "person" (
	*   "id" integer primary key,
	*   "first_name" varchar(64) not null,
	*   "last_name" varchar(64) not null
	* )
	* ```
	*/
	modifyFront(modifier) {
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWithFrontModifier(this.#props.node, modifier.toOperationNode())
		});
	}
	/**
	* This can be used to add any additional SQL to the end of the query.
	*
	* Also see {@link onCommit}.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', col => col.primaryKey())
	*   .addColumn('first_name', 'varchar(64)', col => col.notNull())
	*   .addColumn('last_name', 'varchar(64)', col => col.notNull())
	*   .modifyEnd(sql`collate utf8_unicode_ci`)
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `id` integer primary key,
	*   `first_name` varchar(64) not null,
	*   `last_name` varchar(64) not null
	* ) collate utf8_unicode_ci
	* ```
	*/
	modifyEnd(modifier) {
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWithEndModifier(this.#props.node, modifier.toOperationNode())
		});
	}
	/**
	* Allows to create table from `select` query.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('copy')
	*   .temporary()
	*   .as(db.selectFrom('person').select(['first_name', 'last_name']))
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* create temporary table "copy" as
	* select "first_name", "last_name" from "person"
	* ```
	*/
	as(expression) {
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWith(this.#props.node, { selectQuery: parseExpression(expression) })
		});
	}
	/**
	* Calls the given function passing `this` as the only argument.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('test')
	*   .$call((builder) => builder.addColumn('id', 'integer'))
	*   .execute()
	* ```
	*
	* This is useful for creating reusable functions that can be called with a builder.
	*
	* ```ts
	* import { type CreateTableBuilder, sql } from 'kysely'
	*
	* const addDefaultColumns = (ctb: CreateTableBuilder<any, any>) => {
	*   return ctb
	*     .addColumn('id', 'integer', (col) => col.notNull())
	*     .addColumn('created_at', 'date', (col) =>
	*       col.notNull().defaultTo(sql`now()`)
	*     )
	*     .addColumn('updated_at', 'date', (col) =>
	*       col.notNull().defaultTo(sql`now()`)
	*     )
	* }
	*
	* await db.schema
	*   .createTable('test')
	*   .$call(addDefaultColumns)
	*   .execute()
	* ```
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/schema/drop-index-builder.js
var DropIndexBuilder = class DropIndexBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Specifies the table the index was created for. This is not needed
	* in all dialects.
	*/
	on(table) {
		return new DropIndexBuilder({
			...this.#props,
			node: DropIndexNode.cloneWith(this.#props.node, { table: parseTable(table) })
		});
	}
	ifExists() {
		return new DropIndexBuilder({
			...this.#props,
			node: DropIndexNode.cloneWith(this.#props.node, { ifExists: true })
		});
	}
	cascade() {
		return new DropIndexBuilder({
			...this.#props,
			node: DropIndexNode.cloneWith(this.#props.node, { cascade: true })
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/schema/drop-schema-builder.js
var DropSchemaBuilder = class DropSchemaBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	ifExists() {
		return new DropSchemaBuilder({
			...this.#props,
			node: DropSchemaNode.cloneWith(this.#props.node, { ifExists: true })
		});
	}
	cascade() {
		return new DropSchemaBuilder({
			...this.#props,
			node: DropSchemaNode.cloneWith(this.#props.node, { cascade: true })
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/schema/drop-table-builder.js
var DropTableBuilder = class DropTableBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Adds the "temporary" modifier.
	*
	* This is only supported by some dialects like MySQL.
	*/
	temporary() {
		return new DropTableBuilder({
			...this.#props,
			node: DropTableNode.cloneWith(this.#props.node, { temporary: true })
		});
	}
	ifExists() {
		return new DropTableBuilder({
			...this.#props,
			node: DropTableNode.cloneWith(this.#props.node, { ifExists: true })
		});
	}
	cascade() {
		return new DropTableBuilder({
			...this.#props,
			node: DropTableNode.cloneWith(this.#props.node, { cascade: true })
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/create-view-node.js
/**
* @internal
*/
const CreateViewNode = freeze({
	is(node) {
		return node.kind === "CreateViewNode";
	},
	create(name) {
		return freeze({
			kind: "CreateViewNode",
			name: SchemableIdentifierNode.create(name)
		});
	},
	cloneWith(createView, params) {
		return freeze({
			...createView,
			...params
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/plugin/immediate-value/immediate-value-plugin.js
/**
* Transforms all ValueNodes to immediate.
*
* WARNING! This should never be part of the public API. Users should never use this.
* This is an internal helper.
*
* @internal
*/
var ImmediateValuePlugin = class {
	#transformer = new ImmediateValueTransformer();
	transformQuery(args) {
		return this.#transformer.transformNode(args.node, args.queryId);
	}
	transformResult(args) {
		return Promise.resolve(args.result);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/schema/create-view-builder.js
var CreateViewBuilder = class CreateViewBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Adds the "temporary" modifier.
	*
	* Use this to create a temporary view.
	*/
	temporary() {
		return new CreateViewBuilder({
			...this.#props,
			node: CreateViewNode.cloneWith(this.#props.node, { temporary: true })
		});
	}
	materialized() {
		return new CreateViewBuilder({
			...this.#props,
			node: CreateViewNode.cloneWith(this.#props.node, { materialized: true })
		});
	}
	/**
	* Only implemented on some dialects like SQLite. On most dialects, use {@link orReplace}.
	*/
	ifNotExists() {
		return new CreateViewBuilder({
			...this.#props,
			node: CreateViewNode.cloneWith(this.#props.node, { ifNotExists: true })
		});
	}
	orReplace() {
		return new CreateViewBuilder({
			...this.#props,
			node: CreateViewNode.cloneWith(this.#props.node, { orReplace: true })
		});
	}
	columns(columns) {
		return new CreateViewBuilder({
			...this.#props,
			node: CreateViewNode.cloneWith(this.#props.node, { columns: columns.map(parseColumnName) })
		});
	}
	/**
	* Sets the select query or a `values` statement that creates the view.
	*
	* WARNING!
	* Some dialects don't support parameterized queries in DDL statements and therefore
	* the query or raw {@link sql } expression passed here is interpolated into a single
	* string opening an SQL injection vulnerability. DO NOT pass unchecked user input
	* into the query or raw expression passed to this method!
	*/
	as(query) {
		const queryNode = query.withPlugin(new ImmediateValuePlugin()).toOperationNode();
		return new CreateViewBuilder({
			...this.#props,
			node: CreateViewNode.cloneWith(this.#props.node, { as: queryNode })
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/drop-view-node.js
/**
* @internal
*/
const DropViewNode = freeze({
	is(node) {
		return node.kind === "DropViewNode";
	},
	create(name) {
		return freeze({
			kind: "DropViewNode",
			name: SchemableIdentifierNode.create(name)
		});
	},
	cloneWith(dropView, params) {
		return freeze({
			...dropView,
			...params
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/schema/drop-view-builder.js
var DropViewBuilder = class DropViewBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	materialized() {
		return new DropViewBuilder({
			...this.#props,
			node: DropViewNode.cloneWith(this.#props.node, { materialized: true })
		});
	}
	ifExists() {
		return new DropViewBuilder({
			...this.#props,
			node: DropViewNode.cloneWith(this.#props.node, { ifExists: true })
		});
	}
	cascade() {
		return new DropViewBuilder({
			...this.#props,
			node: DropViewNode.cloneWith(this.#props.node, { cascade: true })
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/create-type-node.js
/**
* @internal
*/
const CreateTypeNode = freeze({
	is(node) {
		return node.kind === "CreateTypeNode";
	},
	create(name) {
		return freeze({
			kind: "CreateTypeNode",
			name
		});
	},
	cloneWithEnum(createType, values) {
		return freeze({
			...createType,
			enum: ValueListNode.create(values.map(ValueNode.createImmediate))
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/schema/create-type-builder.js
var CreateTypeBuilder = class CreateTypeBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	/**
	* Creates an enum type.
	*
	* ### Examples
	*
	* ```ts
	* db.schema.createType('species').asEnum(['cat', 'dog', 'frog'])
	* ```
	*/
	asEnum(values) {
		return new CreateTypeBuilder({
			...this.#props,
			node: CreateTypeNode.cloneWithEnum(this.#props.node, values)
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/drop-type-node.js
/**
* @internal
*/
const DropTypeNode = freeze({
	is(node) {
		return node.kind === "DropTypeNode";
	},
	create(names) {
		if (!Array.isArray(names)) names = [names];
		return freeze({
			kind: "DropTypeNode",
			name: names[0],
			additionalNames: names.slice(1)
		});
	},
	cloneWith(dropType, params) {
		return freeze({
			...dropType,
			...params
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/schema/drop-type-builder.js
var DropTypeBuilder = class DropTypeBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Adds `if exists` to the query.
	*/
	ifExists() {
		return new DropTypeBuilder({
			...this.#props,
			node: DropTypeNode.cloneWith(this.#props.node, { ifExists: true })
		});
	}
	/**
	* Adds `cascade` to the query.
	*/
	cascade() {
		return new DropTypeBuilder({
			...this.#props,
			node: DropTypeNode.cloneWith(this.#props.node, { cascade: true })
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/parser/identifier-parser.js
function parseSchemableIdentifier(id) {
	const SCHEMA_SEPARATOR = ".";
	if (id.includes(SCHEMA_SEPARATOR)) {
		const parts = id.split(SCHEMA_SEPARATOR).map(trim);
		if (parts.length === 2) return SchemableIdentifierNode.createWithSchema(parts[0], parts[1]);
		else throw new Error(`invalid schemable identifier ${id}`);
	} else return SchemableIdentifierNode.create(id);
}
function parseSchemableIdentifierArray(id) {
	if (!Array.isArray(id)) id = [id];
	return id.map(parseSchemableIdentifier);
}
function trim(str) {
	return str.trim();
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/refresh-materialized-view-node.js
/**
* @internal
*/
const RefreshMaterializedViewNode = freeze({
	is(node) {
		return node.kind === "RefreshMaterializedViewNode";
	},
	create(name) {
		return freeze({
			kind: "RefreshMaterializedViewNode",
			name: SchemableIdentifierNode.create(name)
		});
	},
	cloneWith(createView, params) {
		return freeze({
			...createView,
			...params
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/schema/refresh-materialized-view-builder.js
var RefreshMaterializedViewBuilder = class RefreshMaterializedViewBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Adds the "concurrently" modifier.
	*
	* Use this to refresh the view without locking out concurrent selects on the materialized view.
	*
	* WARNING!
	* This cannot be used with the "with no data" modifier.
	*/
	concurrently() {
		return new RefreshMaterializedViewBuilder({
			...this.#props,
			node: RefreshMaterializedViewNode.cloneWith(this.#props.node, {
				concurrently: true,
				withNoData: false
			})
		});
	}
	/**
	* Adds the "with data" modifier.
	*
	* If specified (or defaults) the backing query is executed to provide the new data, and the materialized view is left in a scannable state
	*/
	withData() {
		return new RefreshMaterializedViewBuilder({
			...this.#props,
			node: RefreshMaterializedViewNode.cloneWith(this.#props.node, { withNoData: false })
		});
	}
	/**
	* Adds the "with no data" modifier.
	*
	* If specified, no new data is generated and the materialized view is left in an unscannable state.
	*
	* WARNING!
	* This cannot be used with the "concurrently" modifier.
	*/
	withNoData() {
		return new RefreshMaterializedViewBuilder({
			...this.#props,
			node: RefreshMaterializedViewNode.cloneWith(this.#props.node, {
				withNoData: true,
				concurrently: false
			})
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/alter-type-node.js
/**
* @internal
*/
const AlterTypeNode = freeze({
	is(node) {
		return node.kind === "AlterTypeNode";
	},
	create(name) {
		return freeze({
			kind: "AlterTypeNode",
			name
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/add-value-node.js
/**
* @internal
*/
const AddValueNode = freeze({
	is(node) {
		return node.kind === "AddValueNode";
	},
	create(value) {
		return freeze({
			kind: "AddValueNode",
			value
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/query-finalizer.js
var QueryFinalizer = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	/**
	* Compiles the query.
	*/
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	/**
	* Executes the query.
	*/
	async execute(options) {
		return await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/schema/alter-type-add-value-builder.js
var _a;
var AlterTypeAddValueBuilder = class extends QueryFinalizer {
	#props;
	constructor(props) {
		super(props);
		this.#props = props;
	}
	/**
	* Adds an `if not exists` clause.
	*/
	ifNotExists() {
		return new _a({
			...this.#props,
			node: AlterTypeNode.cloneWith(this.#props.node, { addValue: AddValueNode.cloneWith(this.#props.node.addValue, { ifNotExists: true }) })
		});
	}
	/**
	* Sets a `before <value>` clause.
	*/
	before(neighborValue) {
		return this.#setNeighbor(neighborValue, true);
	}
	/**
	* Sets an `after <value>` clause.
	*/
	after(neighborValue) {
		return this.#setNeighbor(neighborValue, false);
	}
	#setNeighbor(neighborValue, isBefore) {
		return new _a({
			...this.#props,
			node: AlterTypeNode.cloneWith(this.#props.node, { addValue: AddValueNode.cloneWith(this.#props.node.addValue, {
				isBefore,
				neighborValue: ValueNode.createImmediate(neighborValue)
			}) })
		});
	}
};
_a = AlterTypeAddValueBuilder;
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/rename-value-node.js
const RenameValueNode = freeze({
	is(node) {
		return node.kind === "RenameValueNode";
	},
	create(oldValue, newValue) {
		return freeze({
			kind: "RenameValueNode",
			oldValue,
			newValue
		});
	}
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/schema/alter-type-builder.js
/**
* This builder can be used to create `alter type` queries.
*/
var AlterTypeBuilder = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Adds a new value to an enum type.
	*/
	addValue(value) {
		return new AlterTypeAddValueBuilder({
			...this.#props,
			node: AlterTypeNode.cloneWith(this.#props.node, { addValue: AddValueNode.create(ValueNode.createImmediate(value)) })
		});
	}
	/**
	* Rename the type.
	*/
	renameTo(newName) {
		return new QueryFinalizer({
			...this.#props,
			node: AlterTypeNode.cloneWith(this.#props.node, { renameTo: IdentifierNode.create(newName) })
		});
	}
	/**
	* Renames a value of an enum type.
	*/
	renameValue(oldValue, newValue) {
		return new QueryFinalizer({
			...this.#props,
			node: AlterTypeNode.cloneWith(this.#props.node, { renameValue: RenameValueNode.create(ValueNode.createImmediate(oldValue), ValueNode.createImmediate(newValue)) })
		});
	}
	/**
	* Changes the type's schema.
	*/
	setSchema(schema) {
		return new QueryFinalizer({
			...this.#props,
			node: AlterTypeNode.cloneWith(this.#props.node, { setSchema: IdentifierNode.create(schema) })
		});
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/schema/schema-module.js
/**
* Provides methods for building database schema.
*/
var SchemaModule = class SchemaModule {
	#executor;
	constructor(executor) {
		this.#executor = executor;
	}
	/**
	* Create a new table.
	*
	* ### Examples
	*
	* This example creates a new table with columns `id`, `first_name`,
	* `last_name` and `gender`:
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
	*   .addColumn('first_name', 'varchar', col => col.notNull())
	*   .addColumn('last_name', 'varchar', col => col.notNull())
	*   .addColumn('gender', 'varchar')
	*   .execute()
	* ```
	*
	* This example creates a table with a foreign key. Not all database
	* engines support column-level foreign key constraint definitions.
	* For example if you are using MySQL 5.X see the next example after
	* this one.
	*
	* ```ts
	* await db.schema
	*   .createTable('pet')
	*   .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
	*   .addColumn('owner_id', 'integer', col => col
	*     .references('person.id')
	*     .onDelete('cascade')
	*   )
	*   .execute()
	* ```
	*
	* This example adds a foreign key constraint for a columns just
	* like the previous example, but using a table-level statement.
	* On MySQL 5.X you need to define foreign key constraints like
	* this:
	*
	* ```ts
	* await db.schema
	*   .createTable('pet')
	*   .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
	*   .addColumn('owner_id', 'integer')
	*   .addForeignKeyConstraint(
	*     'pet_owner_id_foreign', ['owner_id'], 'person', ['id'],
	*     (constraint) => constraint.onDelete('cascade')
	*   )
	*   .execute()
	* ```
	*/
	createTable(table) {
		return new CreateTableBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: CreateTableNode.create(parseTable(table))
		});
	}
	/**
	* Drop a table.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .dropTable('person')
	*   .execute()
	* ```
	*/
	dropTable(table) {
		return new DropTableBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: DropTableNode.create(parseTable(table))
		});
	}
	/**
	* Create a new index.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createIndex('person_full_name_unique_index')
	*   .on('person')
	*   .columns(['first_name', 'last_name'])
	*   .execute()
	* ```
	*/
	createIndex(indexName) {
		return new CreateIndexBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: CreateIndexNode.create(indexName)
		});
	}
	/**
	* Drop an index.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .dropIndex('person_full_name_unique_index')
	*   .execute()
	* ```
	*/
	dropIndex(indexName) {
		return new DropIndexBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: DropIndexNode.create(indexName)
		});
	}
	/**
	* Create a new schema.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createSchema('some_schema')
	*   .execute()
	* ```
	*/
	createSchema(schema) {
		return new CreateSchemaBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: CreateSchemaNode.create(schema)
		});
	}
	/**
	* Drop a schema.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .dropSchema('some_schema')
	*   .execute()
	* ```
	*/
	dropSchema(schema) {
		return new DropSchemaBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: DropSchemaNode.create(schema)
		});
	}
	/**
	* Alter a table.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .alterTable('person')
	*   .alterColumn('first_name', (ac) => ac.setDataType('text'))
	*   .execute()
	* ```
	*/
	alterTable(table) {
		return new AlterTableBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: AlterTableNode.create(parseTable(table))
		});
	}
	/**
	* Create a new view.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createView('dogs')
	*   .orReplace()
	*   .as(db.selectFrom('pet').selectAll().where('species', '=', 'dog'))
	*   .execute()
	* ```
	*/
	createView(viewName) {
		return new CreateViewBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: CreateViewNode.create(viewName)
		});
	}
	/**
	* Refresh a materialized view.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .refreshMaterializedView('my_view')
	*   .concurrently()
	*   .execute()
	* ```
	*/
	refreshMaterializedView(viewName) {
		return new RefreshMaterializedViewBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: RefreshMaterializedViewNode.create(viewName)
		});
	}
	/**
	* Drop a view.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .dropView('dogs')
	*   .ifExists()
	*   .execute()
	* ```
	*/
	dropView(viewName) {
		return new DropViewBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: DropViewNode.create(viewName)
		});
	}
	/**
	* Create a new type.
	*
	* Only some dialects like PostgreSQL have user-defined types.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createType('species')
	*   .asEnum(['dog', 'cat', 'frog'])
	*   .execute()
	* ```
	*/
	createType(typeName) {
		return new CreateTypeBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: CreateTypeNode.create(parseSchemableIdentifier(typeName))
		});
	}
	/**
	* Alter a type. Rename it, change schema or add/rename enum type values.
	*
	* Only some dialects like PostgreSQL have user-defined types.
	*
	* ```ts
	* await db.schema
	*   .alterType('species')
	*   .addValue('capybara')
	*   .execute()
	* ```
	*/
	alterType(name) {
		return new AlterTypeBuilder({
			executor: this.#executor,
			node: AlterTypeNode.create(parseSchemableIdentifier(name)),
			queryId: createQueryId()
		});
	}
	/**
	* Drop a type.
	*
	* Only some dialects like PostgreSQL have user-defined types.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .dropType('species')
	*   .ifExists()
	*   .execute()
	* ```
	*
	* You can also provide multiple type names:
	*
	* ```ts
	* await db.schema
	*   .dropType(['species', 'colors'])
	*   .ifExists()
	*   .cascade()
	*   .execute()
	* ```
	*/
	dropType(typeName) {
		return new DropTypeBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: DropTypeNode.create(parseSchemableIdentifierArray(typeName))
		});
	}
	/**
	* Returns a copy of this schema module with the given plugin installed.
	*/
	withPlugin(plugin) {
		return new SchemaModule(this.#executor.withPlugin(plugin));
	}
	/**
	* Returns a copy of this schema module  without any plugins.
	*/
	withoutPlugins() {
		return new SchemaModule(this.#executor.withoutPlugins());
	}
	/**
	* See {@link QueryCreator.withSchema}
	*/
	withSchema(schema) {
		return new SchemaModule(this.#executor.withPluginAtFront(new WithSchemaPlugin(schema)));
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/dynamic/dynamic.js
var DynamicModule = class {
	/**
	* Creates a dynamic reference to a column that is not know at compile time.
	*
	* Kysely is built in a way that by default you can't refer to tables or columns
	* that are not actually visible in the current query and context. This is all
	* done by TypeScript at compile time, which means that you need to know the
	* columns and tables at compile time. This is not always the case of course.
	*
	* This method is meant to be used in those cases where the column names
	* come from the user input or are not otherwise known at compile time.
	*
	* WARNING! Unlike values, column names are not escaped by the database engine
	* or Kysely and if you pass in unchecked column names using this method, you
	* create an SQL injection vulnerability. Always __always__ validate the user
	* input before passing it to this method.
	*
	* There are couple of examples below for some use cases, but you can pass
	* `ref` to other methods as well. If the types allow you to pass a `ref`
	* value to some place, it should work.
	*
	* ### Examples
	*
	* Filter by a column not know at compile time:
	*
	* ```ts
	* async function someQuery(filterColumn: string, filterValue: string) {
	*   const { ref } = db.dynamic
	*
	*   return await db
	*     .selectFrom('person')
	*     .selectAll()
	*     .where(ref(filterColumn), '=', filterValue)
	*     .execute()
	* }
	*
	* someQuery('first_name', 'Arnold')
	* someQuery('person.last_name', 'Aniston')
	* ```
	*
	* Order by a column not know at compile time:
	*
	* ```ts
	* async function someQuery(orderBy: string) {
	*   const { ref } = db.dynamic
	*
	*   return await db
	*     .selectFrom('person')
	*     .select('person.first_name as fn')
	*     .orderBy(ref(orderBy))
	*     .execute()
	* }
	*
	* someQuery('fn')
	* ```
	*
	* In this example we add selections dynamically:
	*
	* ```ts
	* const { ref } = db.dynamic
	*
	* // Some column name provided by the user. Value not known at compile time.
	* const columnFromUserInput: PossibleColumns = 'birthdate';
	*
	* // A type that lists all possible values `columnFromUserInput` can have.
	* // You can use `keyof Person` if any column of an interface is allowed.
	* type PossibleColumns = 'last_name' | 'first_name' | 'birthdate'
	*
	* const [person] = await db.selectFrom('person')
	*   .select([
	*     ref<PossibleColumns>(columnFromUserInput),
	*     'id'
	*   ])
	*   .execute()
	*
	* // The resulting type contains all `PossibleColumns` as optional fields
	* // because we cannot know which field was actually selected before
	* // running the code.
	* const lastName: string | null | undefined = person?.last_name
	* const firstName: string | undefined = person?.first_name
	* const birthDate: Date | null | undefined = person?.birthdate
	*
	* // The result type also contains the compile time selection `id`.
	* person?.id
	* ```
	*/
	ref(reference) {
		return new DynamicReferenceBuilder(reference);
	}
	/**
	* Creates a table reference to a table that's not fully known at compile time.
	*
	* The type `T` is allowed to be a union of multiple tables.
	*
	* <!-- siteExample("select", "Generic find query", 130) -->
	*
	* A generic type-safe helper function for finding a row by a column value:
	*
	* ```ts
	* import { SelectType } from 'kysely'
	* import { Database } from 'type-editor'
	*
	* async function getRowByColumn<
	*   T extends keyof Database,
	*   C extends keyof Database[T] & string,
	*   V extends SelectType<Database[T][C]>,
	* >(t: T, c: C, v: V) {
	*   // We need to use the dynamic module since the table name
	*   // is not known at compile time.
	*   const { table, ref } = db.dynamic
	*
	*   return await db
	*     .selectFrom(table(t).as('t'))
	*     .selectAll()
	*     .where(ref(c), '=', v)
	*     .orderBy('t.id')
	*     .executeTakeFirstOrThrow()
	* }
	*
	* const person = await getRowByColumn('person', 'first_name', 'Arnold')
	* ```
	*/
	table(table) {
		return new DynamicTableBuilder(table);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/driver/default-connection-provider.js
var DefaultConnectionProvider = class {
	#driver;
	constructor(driver) {
		this.#driver = driver;
	}
	async provideConnection(consumer, options) {
		const connection = await this.#driver.acquireConnection(options);
		try {
			return await consumer(connection);
		} finally {
			await this.#driver.releaseConnection(connection, options);
		}
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/query-executor/default-query-executor.js
var DefaultQueryExecutor = class DefaultQueryExecutor extends QueryExecutorBase {
	#compiler;
	#adapter;
	#connectionProvider;
	constructor(compiler, adapter, connectionProvider, plugins = []) {
		super(plugins);
		this.#compiler = compiler;
		this.#adapter = adapter;
		this.#connectionProvider = connectionProvider;
	}
	get adapter() {
		return this.#adapter;
	}
	compileQuery(node, queryId) {
		return this.#compiler.compileQuery(node, queryId);
	}
	provideConnection(consumer, options) {
		return this.#connectionProvider.provideConnection(consumer, options);
	}
	withPlugins(plugins) {
		return new DefaultQueryExecutor(this.#compiler, this.#adapter, this.#connectionProvider, [...this.plugins, ...plugins]);
	}
	withPlugin(plugin) {
		return new DefaultQueryExecutor(this.#compiler, this.#adapter, this.#connectionProvider, [...this.plugins, plugin]);
	}
	withPluginAtFront(plugin) {
		return new DefaultQueryExecutor(this.#compiler, this.#adapter, this.#connectionProvider, [plugin, ...this.plugins]);
	}
	withConnectionProvider(connectionProvider) {
		return new DefaultQueryExecutor(this.#compiler, this.#adapter, connectionProvider, [...this.plugins]);
	}
	withoutPlugins() {
		return new DefaultQueryExecutor(this.#compiler, this.#adapter, this.#connectionProvider, []);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/util/performance-now.js
function performanceNow() {
	if (typeof performance !== "undefined" && isFunction(performance.now)) return performance.now();
	else return Date.now();
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/driver/connection-mutex.js
/**
* This mutex is used to ensure that only one operation at a time can
* acquire a connection from the driver. This is necessary when the
* driver only has a single connection, like SQLite and PGlite.
*
* @internal
*/
var ConnectionMutex = class {
	#promise;
	#resolve;
	async obtainLock() {
		while (this.#promise) await this.#promise;
		this.#promise = new Promise((resolve) => {
			this.#resolve = resolve;
		});
	}
	releaseLock() {
		const resolve = this.#resolve;
		this.#promise = void 0;
		this.#resolve = void 0;
		resolve?.();
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/driver/runtime-driver.js
/**
* A small wrapper around {@link Driver} that makes sure the driver is
* initialized before it is used, only initialized and destroyed
* once etc.
*/
var RuntimeDriver = class {
	#driver;
	#log;
	#initPromise;
	#initDone;
	#destroyPromise;
	#connections = /* @__PURE__ */ new WeakSet();
	#connectionMutex;
	constructor(driver, adapter, log) {
		this.#driver = driver;
		this.#initDone = false;
		this.#log = log;
		if (adapter.supportsMultipleConnections === false) this.#connectionMutex = new ConnectionMutex();
	}
	async init(options) {
		if (this.#destroyPromise) throw new Error("driver has already been destroyed");
		this.#initPromise ??= this.#driver.init(options).then(() => {
			this.#initDone = true;
		}).catch((reason) => {
			this.#initPromise = void 0;
			throw reason;
		});
		await waitOrAbort(this.#initPromise, options?.signal, "init");
	}
	async acquireConnection(options) {
		if (this.#destroyPromise) throw new Error("driver has already been destroyed");
		if (!this.#initDone) await this.init(options);
		if (this.#connectionMutex) {
			const lockPromise = this.#connectionMutex.obtainLock();
			await waitOrAbort(lockPromise, options?.signal, "acquireConnection:mutex", () => lockPromise.then(() => this.#connectionMutex?.releaseLock()));
		}
		const connectionPromise = this.#driver.acquireConnection(options);
		const connection = await waitOrAbort(connectionPromise, options?.signal, "acquireConnection:acquire", () => connectionPromise?.then((connection) => this.releaseConnection(connection).catch(printBackgroundFail("driver.releaseConnection"))).catch(printBackgroundFail("driver.acquireConnection")));
		if (!this.#connections.has(connection)) {
			if (this.#needsLogging()) this.#addLogging(connection);
			this.#connections.add(connection);
		}
		return connection;
	}
	async releaseConnection(connection, options) {
		await this.#driver.releaseConnection(connection, options);
		this.#connectionMutex?.releaseLock();
	}
	async beginTransaction(connection, settings) {
		return await this.#driver.beginTransaction(connection, settings);
	}
	async commitTransaction(connection) {
		return await this.#driver.commitTransaction(connection);
	}
	async rollbackTransaction(connection) {
		return await this.#driver.rollbackTransaction(connection);
	}
	async savepoint(connection, savepointName, compileQuery) {
		if (this.#driver.savepoint) return await this.#driver.savepoint(connection, savepointName, compileQuery);
		throw new Error("The `savepoint` method is not supported by this driver");
	}
	async rollbackToSavepoint(connection, savepointName, compileQuery) {
		if (this.#driver.rollbackToSavepoint) return await this.#driver.rollbackToSavepoint(connection, savepointName, compileQuery);
		throw new Error("The `rollbackToSavepoint` method is not supported by this driver");
	}
	async releaseSavepoint(connection, savepointName, compileQuery) {
		if (this.#driver.releaseSavepoint) return await this.#driver.releaseSavepoint(connection, savepointName, compileQuery);
		throw new Error("The `releaseSavepoint` method is not supported by this driver");
	}
	async destroy(options) {
		if (!this.#initPromise) return;
		await waitOrAbort(this.#initPromise, options?.signal, "destroy:initPromise");
		this.#destroyPromise ??= this.#driver.destroy(options).catch((reason) => {
			this.#destroyPromise = void 0;
			throw reason;
		});
		await waitOrAbort(this.#destroyPromise, options?.signal, "destroy");
	}
	#needsLogging() {
		return this.#log.isLevelEnabled("query") || this.#log.isLevelEnabled("error");
	}
	#addLogging(connection) {
		const executeQuery = connection.executeQuery;
		const streamQuery = connection.streamQuery;
		const dis = this;
		connection.executeQuery = async (compiledQuery, options) => {
			let caughtError;
			const startTime = performanceNow();
			try {
				return await executeQuery.call(connection, compiledQuery, options);
			} catch (error) {
				caughtError = error;
				await dis.#logError(error, compiledQuery, startTime);
				throw error;
			} finally {
				if (!caughtError) await dis.#logQuery(compiledQuery, startTime);
			}
		};
		connection.streamQuery = async function* (compiledQuery, chunkSize, options) {
			let caughtError;
			const startTime = performanceNow();
			try {
				for await (const result of streamQuery.call(connection, compiledQuery, chunkSize, options)) yield result;
			} catch (error) {
				caughtError = error;
				await dis.#logError(error, compiledQuery, startTime);
				throw error;
			} finally {
				if (!caughtError) await dis.#logQuery(compiledQuery, startTime, true);
			}
		};
	}
	async #logError(error, compiledQuery, startTime) {
		await this.#log.error(() => ({
			level: "error",
			error,
			query: compiledQuery,
			queryDurationMillis: this.#calculateDurationMillis(startTime)
		}));
	}
	async #logQuery(compiledQuery, startTime, isStream = false) {
		await this.#log.query(() => ({
			level: "query",
			isStream,
			query: compiledQuery,
			queryDurationMillis: this.#calculateDurationMillis(startTime)
		}));
	}
	#calculateDurationMillis(startTime) {
		return performanceNow() - startTime;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/driver/single-connection-provider.js
const ignoreError = () => {};
var SingleConnectionProvider = class {
	#connection;
	#runningPromise;
	constructor(connection) {
		this.#connection = connection;
	}
	async provideConnection(consumer) {
		while (this.#runningPromise) await this.#runningPromise.catch(ignoreError);
		this.#runningPromise = this.#run(consumer).finally(() => {
			this.#runningPromise = void 0;
		});
		return this.#runningPromise;
	}
	async #run(runner) {
		return await runner(this.#connection);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/driver/driver.js
const TRANSACTION_ACCESS_MODES = ["read only", "read write"];
const TRANSACTION_ISOLATION_LEVELS = [
	"read uncommitted",
	"read committed",
	"repeatable read",
	"serializable",
	"snapshot"
];
function validateTransactionSettings(settings) {
	if (settings.accessMode && !TRANSACTION_ACCESS_MODES.includes(settings.accessMode)) throw new Error(`invalid transaction access mode ${settings.accessMode}`);
	if (settings.isolationLevel && !TRANSACTION_ISOLATION_LEVELS.includes(settings.isolationLevel)) throw new Error(`invalid transaction isolation level ${settings.isolationLevel}`);
}
freeze(["query", "error"]);
var Log = class {
	#levels;
	#logger;
	constructor(config) {
		if (isFunction(config)) {
			this.#logger = config;
			this.#levels = freeze({
				query: true,
				error: true
			});
		} else {
			this.#logger = defaultLogger;
			this.#levels = freeze({
				query: config.includes("query"),
				error: config.includes("error")
			});
		}
	}
	isLevelEnabled(level) {
		return this.#levels[level];
	}
	async query(getEvent) {
		if (this.#levels.query) await this.#logger(getEvent());
	}
	async error(getEvent) {
		if (this.#levels.error) await this.#logger(getEvent());
	}
};
function defaultLogger(event) {
	if (event.level === "query") {
		const prefix = `kysely:query:${event.isStream ? "stream:" : ""}`;
		console.log(`${prefix} ${event.query.sql}`);
		console.log(`${prefix} duration: ${event.queryDurationMillis.toFixed(1)}ms`);
	} else if (event.level === "error") {
		if (event.error instanceof Error) console.error(`kysely:error: ${event.error.stack ?? event.error.message}`);
		else console.error(`kysely:error: ${JSON.stringify({
			error: event.error,
			query: event.query.sql,
			queryDurationMillis: event.queryDurationMillis
		})}`);
	}
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/util/compilable.js
function isCompilable(value) {
	return isObject(value) && isFunction(value.compile);
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/kysely.js
Symbol.asyncDispose ??= Symbol("Symbol.asyncDispose");
/**
* The main Kysely class.
*
* You should create one instance of `Kysely` per database using the {@link Kysely}
* constructor. Each `Kysely` instance maintains its own connection pool.
*
* ### Examples
*
* This example assumes your database has a "person" table:
*
* ```ts
* import * as Sqlite from 'better-sqlite3'
* import { type Generated, Kysely, SqliteDialect } from 'kysely'
*
* interface Database {
*   person: {
*     id: Generated<number>
*     first_name: string
*     last_name: string | null
*   }
* }
*
* const db = new Kysely<Database>({
*   dialect: new SqliteDialect({
*     database: new Sqlite(':memory:'),
*   })
* })
* ```
*
* @typeParam DB - The database interface type. Keys of this type must be table names
*    in the database and values must be interfaces that describe the rows in those
*    tables. See the examples above.
*/
var Kysely = class Kysely extends QueryCreator {
	#props;
	constructor(args) {
		let superProps;
		let props;
		if (isKyselyProps(args)) {
			superProps = { executor: args.executor };
			props = { ...args };
		} else {
			const dialect = args.dialect;
			const driver = dialect.createDriver();
			const compiler = dialect.createQueryCompiler();
			const adapter = dialect.createAdapter();
			const runtimeDriver = new RuntimeDriver(driver, adapter, new Log(args.log ?? []));
			const executor = new DefaultQueryExecutor(compiler, adapter, new DefaultConnectionProvider(runtimeDriver), args.plugins ?? []);
			superProps = { executor };
			props = {
				config: args,
				executor,
				dialect,
				driver: runtimeDriver
			};
		}
		super(superProps);
		this.#props = freeze(props);
	}
	/**
	* Returns the {@link SchemaModule} module for building database schema.
	*/
	get schema() {
		return new SchemaModule(this.#props.executor);
	}
	/**
	* Returns a the {@link DynamicModule} module.
	*
	* The {@link DynamicModule} module can be used to bypass strict typing and
	* passing in dynamic values for the queries.
	*/
	get dynamic() {
		return new DynamicModule();
	}
	/**
	* Returns a {@link DatabaseIntrospector | database introspector}.
	*/
	get introspection() {
		return this.#props.dialect.createIntrospector(this.withoutPlugins());
	}
	case(value) {
		return new CaseBuilder({ node: CaseNode.create(isUndefined(value) ? void 0 : parseExpression(value)) });
	}
	/**
	* Returns a {@link FunctionModule} that can be used to write somewhat type-safe function
	* calls.
	*
	* ```ts
	* const { count } = db.fn
	*
	* await db.selectFrom('person')
	*   .innerJoin('pet', 'pet.owner_id', 'person.id')
	*   .select([
	*     'id',
	*     count('pet.id').as('person_count'),
	*   ])
	*   .groupBy('person.id')
	*   .having(count('pet.id'), '>', 10)
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select "person"."id", count("pet"."id") as "person_count"
	* from "person"
	* inner join "pet" on "pet"."owner_id" = "person"."id"
	* group by "person"."id"
	* having count("pet"."id") > $1
	* ```
	*
	* Why "somewhat" type-safe? Because the function calls are not bound to the
	* current query context. They allow you to reference columns and tables that
	* are not in the current query. E.g. remove the `innerJoin` from the previous
	* query and TypeScript won't even complain.
	*
	* If you want to make the function calls fully type-safe, you can use the
	* {@link ExpressionBuilder.fn} getter for a query context-aware, stricter {@link FunctionModule}.
	*
	* ```ts
	* await db.selectFrom('person')
	*   .innerJoin('pet', 'pet.owner_id', 'person.id')
	*   .select((eb) => [
	*     'person.id',
	*     eb.fn.count('pet.id').as('pet_count')
	*   ])
	*   .groupBy('person.id')
	*   .having((eb) => eb.fn.count('pet.id'), '>', 10)
	*   .execute()
	* ```
	*/
	get fn() {
		return createFunctionModule();
	}
	/**
	* Creates a {@link TransactionBuilder} that can be used to run queries inside a transaction.
	*
	* The returned {@link TransactionBuilder} can be used to configure the transaction. The
	* {@link TransactionBuilder.execute} method can then be called to run the transaction.
	* {@link TransactionBuilder.execute} takes a function that is run inside the
	* transaction. If the function throws an exception,
	* 1. the exception is caught,
	* 2. the transaction is rolled back, and
	* 3. the exception is thrown again.
	* Otherwise the transaction is committed.
	*
	* The callback function passed to the {@link TransactionBuilder.execute | execute}
	* method gets the transaction object as its only argument. The transaction is
	* of type {@link Transaction} which inherits {@link Kysely}. Any query
	* started through the transaction object is executed inside the transaction.
	*
	* To run a controlled transaction, allowing you to commit and rollback manually,
	* use {@link startTransaction} instead.
	*
	* ### Examples
	*
	* <!-- siteExample("transactions", "Simple transaction", 10) -->
	*
	* This example inserts two rows in a transaction. If an exception is thrown inside
	* the callback passed to the `execute` method,
	* 1. the exception is caught,
	* 2. the transaction is rolled back, and
	* 3. the exception is thrown again.
	* Otherwise the transaction is committed.
	*
	* ```ts
	* const catto = await db.transaction().execute(async (trx) => {
	*   const jennifer = await trx.insertInto('person')
	*     .values({
	*       first_name: 'Jennifer',
	*       last_name: 'Aniston',
	*       age: 40,
	*     })
	*     .returning('id')
	*     .executeTakeFirstOrThrow()
	*
	*   return await trx.insertInto('pet')
	*     .values({
	*       owner_id: jennifer.id,
	*       name: 'Catto',
	*       species: 'cat',
	*       is_favorite: false,
	*     })
	*     .returningAll()
	*     .executeTakeFirst()
	* })
	* ```
	*
	* Setting the isolation level:
	*
	* ```ts
	* import type { Kysely } from 'kysely'
	*
	* await db
	*   .transaction()
	*   .setIsolationLevel('serializable')
	*   .execute(async (trx) => {
	*     await doStuff(trx)
	*   })
	*
	* async function doStuff(kysely: typeof db) {
	*   // ...
	* }
	* ```
	*/
	transaction() {
		return new TransactionBuilder({ ...this.#props });
	}
	/**
	* Creates a {@link ControlledTransactionBuilder} that can be used to run queries inside a controlled transaction.
	*
	* The returned {@link ControlledTransactionBuilder} can be used to configure the transaction.
	* The {@link ControlledTransactionBuilder.execute} method can then be called
	* to start the transaction and return a {@link ControlledTransaction}.
	*
	* A {@link ControlledTransaction} allows you to commit and rollback manually,
	* execute savepoint commands. It extends {@link Transaction} which extends {@link Kysely},
	* so you can run queries inside the transaction. Once the transaction is committed,
	* or rolled back, it can't be used anymore - all queries will throw an error.
	* This is to prevent accidentally running queries outside the transaction - where
	* atomicity is not guaranteed anymore.
	*
	* ### Examples
	*
	* <!-- siteExample("transactions", "Controlled transaction", 11) -->
	*
	* A controlled transaction allows you to commit and rollback manually, execute
	* savepoint commands, and queries in general.
	*
	* In this example we start a transaction, use it to insert two rows and then commit
	* the transaction. If an error is thrown, we catch it and rollback the transaction.
	*
	* ```ts
	* const trx = await db.startTransaction().execute()
	*
	* try {
	*   const jennifer = await trx.insertInto('person')
	*     .values({
	*       first_name: 'Jennifer',
	*       last_name: 'Aniston',
	*       age: 40,
	*     })
	*     .returning('id')
	*     .executeTakeFirstOrThrow()
	*
	*   const catto = await trx.insertInto('pet')
	*     .values({
	*       owner_id: jennifer.id,
	*       name: 'Catto',
	*       species: 'cat',
	*       is_favorite: false,
	*     })
	*     .returningAll()
	*     .executeTakeFirstOrThrow()
	*
	*   await trx.commit().execute()
	*
	*   // ...
	* } catch (error) {
	*   await trx.rollback().execute()
	* }
	* ```
	*
	* <!-- siteExample("transactions", "Controlled transaction /w savepoints", 12) -->
	*
	* A controlled transaction allows you to commit and rollback manually, execute
	* savepoint commands, and queries in general.
	*
	* In this example we start a transaction, insert a person, create a savepoint,
	* try inserting a toy and a pet, and if an error is thrown, we rollback to the
	* savepoint. Eventually we release the savepoint, insert an audit record and
	* commit the transaction. If an error is thrown, we catch it and rollback the
	* transaction.
	*
	* ```ts
	* const trx = await db.startTransaction().execute()
	*
	* try {
	*   const jennifer = await trx
	*     .insertInto('person')
	*     .values({
	*       first_name: 'Jennifer',
	*       last_name: 'Aniston',
	*       age: 40,
	*     })
	*     .returning('id')
	*     .executeTakeFirstOrThrow()
	*
	*   const trxAfterJennifer = await trx.savepoint('after_jennifer').execute()
	*
	*   try {
	*     const catto = await trxAfterJennifer
	*       .insertInto('pet')
	*       .values({
	*         owner_id: jennifer.id,
	*         name: 'Catto',
	*         species: 'cat',
	*       })
	*       .returning('id')
	*       .executeTakeFirstOrThrow()
	*
	*     await trxAfterJennifer
	*       .insertInto('toy')
	*       .values({ name: 'Bone', price: 1.99, pet_id: catto.id })
	*       .execute()
	*   } catch (error) {
	*     await trxAfterJennifer.rollbackToSavepoint('after_jennifer').execute()
	*   }
	*
	*   await trxAfterJennifer.releaseSavepoint('after_jennifer').execute()
	*
	*   await trx.insertInto('audit').values({ action: 'added Jennifer' }).execute()
	*
	*   await trx.commit().execute()
	* } catch (error) {
	*   await trx.rollback().execute()
	* }
	* ```
	*/
	startTransaction() {
		return new ControlledTransactionBuilder({ ...this.#props });
	}
	/**
	* Provides a kysely instance bound to a single database connection.
	*
	* ### Examples
	*
	* ```ts
	* await db
	*   .connection()
	*   .execute(async (db) => {
	*     // `db` is an instance of `Kysely` that's bound to a single
	*     // database connection. All queries executed through `db` use
	*     // the same connection.
	*     await doStuff(db)
	*   })
	*
	* async function doStuff(kysely: typeof db) {
	*   // ...
	* }
	* ```
	*/
	connection() {
		return new ConnectionBuilder({ ...this.#props });
	}
	/**
	* Returns a copy of this Kysely instance with the given plugin installed.
	*/
	withPlugin(plugin) {
		return new Kysely({
			...this.#props,
			executor: this.#props.executor.withPlugin(plugin)
		});
	}
	/**
	* Returns a copy of this Kysely instance without any plugins.
	*/
	withoutPlugins() {
		return new Kysely({
			...this.#props,
			executor: this.#props.executor.withoutPlugins()
		});
	}
	/**
	* @override
	*/
	withSchema(schema) {
		return new Kysely({
			...this.#props,
			executor: this.#props.executor.withPluginAtFront(new WithSchemaPlugin(schema))
		});
	}
	/**
	* Returns a copy of this Kysely instance with tables added to its
	* database type.
	*
	* This method only modifies the types and doesn't affect any of the
	* executed queries in any way.
	*
	* ### Examples
	*
	* The following example adds and uses a temporary table:
	*
	* ```ts
	* await db.schema
	*   .createTable('temp_table')
	*   .temporary()
	*   .addColumn('some_column', 'integer')
	*   .execute()
	*
	* const tempDb = db.$extendTables<{
	*   temp_table: {
	*     some_column: number
	*   }
	* }>()
	*
	* await tempDb
	*   .insertInto('temp_table')
	*   .values({ some_column: 100 })
	*   .execute()
	* ```
	*/
	$extendTables() {
		return new Kysely({ ...this.#props });
	}
	/**
	* Returns a copy of this Kysely instance without the given tables (provided as
	* a union type of table names).
	*
	* This method only modifies the types and doesn't affect any of the executed
	* queries in any way.
	*
	* See also {@link $pickTables} and {@link $extendTables}.
	*
	* ### Examples
	*
	* The following example omits tables not used in the downstream query. This
	* can help with compile-time performance as downstream checks and calculations
	* work against a smaller scope of the database - less tables and columns.
	*
	* Don't optimize prematurely! Build your queries first, measure later. If you
	* realize the query has a noticeable impact on compilation - try the helper.
	*
	* ```ts
	* const results = await db
	*   .$omitTables<'toy'>()
	*   .selectFrom('person')
	*   .innerJoin('pet', 'pet.owner_id', 'person.id')
	*   .selectAll()
	*   .execute()
	* ```
	*
	* The query is arguably less readable now, and changing it is less obvious -
	* e.g. adding another table.
	*/
	$omitTables() {
		return new Kysely({ ...this.#props });
	}
	/**
	* Returns a copy of this Kysely instance with just the given tables (provided as
	* a union type of table names).
	*
	* This method only modifies the types and doesn't affect any of the executed
	* queries in any way.
	*
	* See also {@link $omitTables} and {@link $extendTables}.
	*
	* ### Examples
	*
	* The following example picks the tables used in the downstream query. This
	* can help with compile-time performance as downstream checks and calculations
	* work against a smaller scope of the database - less tables and columns.
	*
	* Don't optimize prematurely! Build your queries first, measure later. If you
	* realize the query has a noticeable impact on compilation - try the helper.
	*
	* ```ts
	* const results = await db
	*   .$pickTables<'person' | 'pet'>()
	*   .selectFrom('person')
	*   .innerJoin('pet', 'pet.owner_id', 'person.id')
	*   .selectAll()
	*   .execute()
	* ```
	*
	* The query is arguably less readable now, and changing it is less obvious -
	* e.g. adding another table.
	*/
	$pickTables() {
		return new Kysely({ ...this.#props });
	}
	/**
	* @deprecated use {@link $extendTables} instead.
	*/
	withTables() {
		return this.$extendTables();
	}
	/**
	* Releases all resources and disconnects from the database.
	*
	* You need to call this when you are done using the `Kysely` instance.
	*/
	async destroy() {
		await this.#props.driver.destroy();
	}
	/**
	* Returns true if this `Kysely` instance is a transaction.
	*
	* You can also use `db instanceof Transaction`.
	*/
	get isTransaction() {
		return false;
	}
	/**
	* @internal
	* @private
	*/
	getExecutor() {
		return this.#props.executor;
	}
	/**
	* Executes a given compiled query or query builder.
	*
	* See {@link https://github.com/kysely-org/kysely/blob/master/site/docs/recipes/0004-splitting-query-building-and-execution.md#execute-compiled-queries splitting build, compile and execute code recipe} for more information.
	*/
	async executeQuery(query, options) {
		const compiledQuery = isCompilable(query) ? query.compile() : query;
		return await this.#props.executor.executeQuery(compiledQuery, options);
	}
	async [Symbol.asyncDispose]() {
		await this.destroy();
	}
};
var Transaction = class Transaction extends Kysely {
	#props;
	constructor(props) {
		super(props);
		this.#props = props;
	}
	get isTransaction() {
		return true;
	}
	/**
	* @deprecated calling the transaction method for a Transaction is not supported
	*/
	transaction() {
		throw new Error("calling the transaction method for a Transaction is not supported");
	}
	/**
	* @deprecated calling the controlled transaction method for a Transaction is not supported
	*/
	startTransaction() {
		throw new Error("calling the controlled transaction method for a Transaction is not supported");
	}
	/**
	* @deprecated calling the connection method for a Transaction is not supported
	*/
	connection() {
		throw new Error("calling the connection method for a Transaction is not supported");
	}
	/**
	* @deprecated calling the destroy method for a Transaction is not supported
	*/
	destroy() {
		throw new Error("calling the destroy method for a Transaction is not supported");
	}
	/**
	* Similar to {@link Kysely.withPlugin} but returns the transaction.
	*/
	withPlugin(plugin) {
		return new Transaction({
			...this.#props,
			executor: this.#props.executor.withPlugin(plugin)
		});
	}
	/**
	* Similar to {@link Kysely.withoutPlugins} but returns the transaction.
	*/
	withoutPlugins() {
		return new Transaction({
			...this.#props,
			executor: this.#props.executor.withoutPlugins()
		});
	}
	/**
	* Similar to {@link Kysely.withSchema} but returns the transaction.
	*/
	withSchema(schema) {
		return new Transaction({
			...this.#props,
			executor: this.#props.executor.withPluginAtFront(new WithSchemaPlugin(schema))
		});
	}
	/**
	* Similar to {@link Kysely.withTables} but returns the transaction.
	*
	* @deprecated use {@link $extendTables} instead.
	*/
	withTables() {
		return new Transaction({ ...this.#props });
	}
	/**
	* Similar to {@link Kysely.$extendTables} but returns the transaction.
	*/
	$extendTables() {
		return new Transaction({ ...this.#props });
	}
	/**
	* Similar to {@link Kysely.$omitTables} but returns the transaction.
	*/
	$omitTables() {
		return new Transaction({ ...this.#props });
	}
	/**
	* Similar to {@link Kysely.$pickTables} but returns the transaction.
	*/
	$pickTables() {
		return new Transaction({ ...this.#props });
	}
};
function isKyselyProps(obj) {
	return isObject(obj) && isObject(obj.config) && isObject(obj.driver) && isObject(obj.executor) && isObject(obj.dialect);
}
var ConnectionBuilder = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	async execute(callback, options) {
		return this.#props.executor.provideConnection(async (connection) => {
			const executor = this.#props.executor.withConnectionProvider(new SingleConnectionProvider(connection));
			return await callback(new Kysely({
				...this.#props,
				executor
			}));
		}, freeze({ signal: options?.signal }));
	}
};
var TransactionBuilder = class TransactionBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	setAccessMode(accessMode) {
		return new TransactionBuilder({
			...this.#props,
			accessMode
		});
	}
	setIsolationLevel(isolationLevel) {
		return new TransactionBuilder({
			...this.#props,
			isolationLevel
		});
	}
	async execute(callback) {
		const { isolationLevel, accessMode, ...kyselyProps } = this.#props;
		const settings = {
			isolationLevel,
			accessMode
		};
		validateTransactionSettings(settings);
		return this.#props.executor.provideConnection(async (connection) => {
			const state = {
				isCommitted: false,
				isRolledBack: false
			};
			const executor = new NotCommittedOrRolledBackAssertingExecutor(this.#props.executor.withConnectionProvider(new SingleConnectionProvider(connection)), state);
			const transaction = new Transaction({
				...kyselyProps,
				executor
			});
			let transactionBegun = false;
			try {
				await this.#props.driver.beginTransaction(connection, settings);
				transactionBegun = true;
				const result = await callback(transaction);
				await this.#props.driver.commitTransaction(connection);
				state.isCommitted = true;
				return result;
			} catch (error) {
				if (transactionBegun) {
					await this.#props.driver.rollbackTransaction(connection);
					state.isRolledBack = true;
				}
				throw error;
			}
		});
	}
};
var ControlledTransactionBuilder = class ControlledTransactionBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	setAccessMode(accessMode) {
		return new ControlledTransactionBuilder({
			...this.#props,
			accessMode
		});
	}
	setIsolationLevel(isolationLevel) {
		return new ControlledTransactionBuilder({
			...this.#props,
			isolationLevel
		});
	}
	async execute() {
		const { isolationLevel, accessMode, ...props } = this.#props;
		const settings = {
			isolationLevel,
			accessMode
		};
		validateTransactionSettings(settings);
		const connection = await provideControlledConnection(this.#props.executor);
		await this.#props.driver.beginTransaction(connection.connection, settings);
		return new ControlledTransaction({
			...props,
			connection,
			executor: this.#props.executor.withConnectionProvider(new SingleConnectionProvider(connection.connection))
		});
	}
};
var ControlledTransaction = class ControlledTransaction extends Transaction {
	#props;
	#compileQuery;
	#state;
	constructor(props) {
		const state = {
			isCommitted: false,
			isRolledBack: false
		};
		props = {
			...props,
			executor: new NotCommittedOrRolledBackAssertingExecutor(props.executor, state)
		};
		const { connection, ...transactionProps } = props;
		super(transactionProps);
		this.#props = freeze(props);
		this.#state = state;
		const queryId = createQueryId();
		this.#compileQuery = (node) => props.executor.compileQuery(node, queryId);
	}
	get isCommitted() {
		return this.#state.isCommitted;
	}
	get isRolledBack() {
		return this.#state.isRolledBack;
	}
	/**
	* Commits the transaction.
	*
	* See {@link rollback}.
	*
	* ### Examples
	*
	* ```ts
	* import type { Kysely } from 'kysely'
	* import type { Database } from 'type-editor' // imaginary module
	*
	* const trx = await db.startTransaction().execute()
	*
	* try {
	*   await doSomething(trx)
	*
	*   await trx.commit().execute()
	* } catch (error) {
	*   await trx.rollback().execute()
	* }
	*
	* async function doSomething(kysely: Kysely<Database>) {}
	* ```
	*/
	commit() {
		assertNotCommittedOrRolledBack(this.#state);
		return new Command(async () => {
			await this.#props.driver.commitTransaction(this.#props.connection.connection);
			this.#state.isCommitted = true;
			this.#props.connection.release();
		});
	}
	/**
	* Rolls back the transaction.
	*
	* See {@link commit} and {@link rollbackToSavepoint}.
	*
	* ### Examples
	*
	* ```ts
	* import type { Kysely } from 'kysely'
	* import type { Database } from 'type-editor' // imaginary module
	*
	* const trx = await db.startTransaction().execute()
	*
	* try {
	*   await doSomething(trx)
	*
	*   await trx.commit().execute()
	* } catch (error) {
	*   await trx.rollback().execute()
	* }
	*
	* async function doSomething(kysely: Kysely<Database>) {}
	* ```
	*/
	rollback() {
		assertNotCommittedOrRolledBack(this.#state);
		return new Command(async () => {
			await this.#props.driver.rollbackTransaction(this.#props.connection.connection);
			this.#state.isRolledBack = true;
			this.#props.connection.release();
		});
	}
	/**
	* Creates a savepoint with a given name.
	*
	* See {@link rollbackToSavepoint} and {@link releaseSavepoint}.
	*
	* For a type-safe experience, you should use the returned instance from now on.
	*
	* ### Examples
	*
	* ```ts
	* import type { Kysely } from 'kysely'
	* import type { Database } from 'type-editor' // imaginary module
	*
	* const trx = await db.startTransaction().execute()
	*
	* await insertJennifer(trx)
	*
	* const trxAfterJennifer = await trx.savepoint('after_jennifer').execute()
	*
	* try {
	*   await doSomething(trxAfterJennifer)
	* } catch (error) {
	*   await trxAfterJennifer.rollbackToSavepoint('after_jennifer').execute()
	* }
	*
	* async function insertJennifer(kysely: Kysely<Database>) {}
	* async function doSomething(kysely: Kysely<Database>) {}
	* ```
	*/
	savepoint(savepointName) {
		assertNotCommittedOrRolledBack(this.#state);
		return new Command(async () => {
			await this.#props.driver.savepoint?.(this.#props.connection.connection, savepointName, this.#compileQuery);
			return new ControlledTransaction({ ...this.#props });
		});
	}
	/**
	* Rolls back to a savepoint with a given name.
	*
	* See {@link savepoint} and {@link releaseSavepoint}.
	*
	* You must use the same instance returned by {@link savepoint}, or
	* escape the type-check by using `as any`.
	*
	* ### Examples
	*
	* ```ts
	* import type { Kysely } from 'kysely'
	* import type { Database } from 'type-editor' // imaginary module
	*
	* const trx = await db.startTransaction().execute()
	*
	* await insertJennifer(trx)
	*
	* const trxAfterJennifer = await trx.savepoint('after_jennifer').execute()
	*
	* try {
	*   await doSomething(trxAfterJennifer)
	* } catch (error) {
	*   await trxAfterJennifer.rollbackToSavepoint('after_jennifer').execute()
	* }
	*
	* async function insertJennifer(kysely: Kysely<Database>) {}
	* async function doSomething(kysely: Kysely<Database>) {}
	* ```
	*/
	rollbackToSavepoint(savepointName) {
		assertNotCommittedOrRolledBack(this.#state);
		return new Command(async () => {
			await this.#props.driver.rollbackToSavepoint?.(this.#props.connection.connection, savepointName, this.#compileQuery);
			return new ControlledTransaction({ ...this.#props });
		});
	}
	/**
	* Releases a savepoint with a given name.
	*
	* See {@link savepoint} and {@link rollbackToSavepoint}.
	*
	* You must use the same instance returned by {@link savepoint}, or
	* escape the type-check by using `as any`.
	*
	* ### Examples
	*
	* ```ts
	* import type { Kysely } from 'kysely'
	* import type { Database } from 'type-editor' // imaginary module
	*
	* const trx = await db.startTransaction().execute()
	*
	* await insertJennifer(trx)
	*
	* const trxAfterJennifer = await trx.savepoint('after_jennifer').execute()
	*
	* try {
	*   await doSomething(trxAfterJennifer)
	* } catch (error) {
	*   await trxAfterJennifer.rollbackToSavepoint('after_jennifer').execute()
	* }
	*
	* await trxAfterJennifer.releaseSavepoint('after_jennifer').execute()
	*
	* await doSomethingElse(trx)
	*
	* async function insertJennifer(kysely: Kysely<Database>) {}
	* async function doSomething(kysely: Kysely<Database>) {}
	* async function doSomethingElse(kysely: Kysely<Database>) {}
	* ```
	*/
	releaseSavepoint(savepointName) {
		assertNotCommittedOrRolledBack(this.#state);
		return new Command(async () => {
			await this.#props.driver.releaseSavepoint?.(this.#props.connection.connection, savepointName, this.#compileQuery);
			return new ControlledTransaction({ ...this.#props });
		});
	}
	withPlugin(plugin) {
		return new ControlledTransaction({
			...this.#props,
			executor: this.#props.executor.withPlugin(plugin)
		});
	}
	withoutPlugins() {
		return new ControlledTransaction({
			...this.#props,
			executor: this.#props.executor.withoutPlugins()
		});
	}
	withSchema(schema) {
		return new ControlledTransaction({
			...this.#props,
			executor: this.#props.executor.withPluginAtFront(new WithSchemaPlugin(schema))
		});
	}
	withTables() {
		return new ControlledTransaction({ ...this.#props });
	}
	$extendTables() {
		return new ControlledTransaction({ ...this.#props });
	}
	$omitTables() {
		return new ControlledTransaction({ ...this.#props });
	}
	$pickTables() {
		return new ControlledTransaction({ ...this.#props });
	}
};
var Command = class {
	#cb;
	constructor(cb) {
		this.#cb = cb;
	}
	/**
	* Executes the command.
	*/
	async execute() {
		return await this.#cb();
	}
};
function assertNotCommittedOrRolledBack(state) {
	if (state.isCommitted) throw new Error("Transaction is already committed");
	if (state.isRolledBack) throw new Error("Transaction is already rolled back");
}
/**
* An executor wrapper that asserts that the transaction state is not committed
* or rolled back when a query is executed.
*
* @internal
*/
var NotCommittedOrRolledBackAssertingExecutor = class NotCommittedOrRolledBackAssertingExecutor {
	#executor;
	#state;
	constructor(executor, state) {
		this.#executor = executor instanceof NotCommittedOrRolledBackAssertingExecutor ? executor.#executor : executor;
		this.#state = state;
	}
	get adapter() {
		return this.#executor.adapter;
	}
	get plugins() {
		return this.#executor.plugins;
	}
	transformQuery(node, queryId) {
		return this.#executor.transformQuery(node, queryId);
	}
	compileQuery(node, queryId) {
		return this.#executor.compileQuery(node, queryId);
	}
	provideConnection(consumer, options) {
		return this.#executor.provideConnection(consumer, options);
	}
	executeQuery(compiledQuery, options) {
		assertNotCommittedOrRolledBack(this.#state);
		return this.#executor.executeQuery(compiledQuery, options);
	}
	stream(compiledQuery, chunkSize, options) {
		assertNotCommittedOrRolledBack(this.#state);
		return this.#executor.stream(compiledQuery, chunkSize, options);
	}
	withConnectionProvider(connectionProvider) {
		return new NotCommittedOrRolledBackAssertingExecutor(this.#executor.withConnectionProvider(connectionProvider), this.#state);
	}
	withPlugin(plugin) {
		return new NotCommittedOrRolledBackAssertingExecutor(this.#executor.withPlugin(plugin), this.#state);
	}
	withPlugins(plugins) {
		return new NotCommittedOrRolledBackAssertingExecutor(this.#executor.withPlugins(plugins), this.#state);
	}
	withPluginAtFront(plugin) {
		return new NotCommittedOrRolledBackAssertingExecutor(this.#executor.withPluginAtFront(plugin), this.#state);
	}
	withoutPlugins() {
		return new NotCommittedOrRolledBackAssertingExecutor(this.#executor.withoutPlugins(), this.#state);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/raw-builder/raw-builder.js
var RawBuilderImpl = class RawBuilderImpl {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	get expressionType() {}
	get isRawBuilder() {
		return true;
	}
	as(alias) {
		return new AliasedRawBuilderImpl(this, alias);
	}
	$castTo() {
		return new RawBuilderImpl({ ...this.#props });
	}
	$notNull() {
		return new RawBuilderImpl(this.#props);
	}
	withPlugin(plugin) {
		return new RawBuilderImpl({
			...this.#props,
			plugins: this.#props.plugins !== void 0 ? freeze([...this.#props.plugins, plugin]) : freeze([plugin])
		});
	}
	toOperationNode() {
		return this.#toOperationNode(this.#getExecutor());
	}
	compile(executorProvider) {
		return this.#compile(this.#getExecutor(executorProvider));
	}
	async execute(executorProvider, options) {
		const executor = this.#getExecutor(executorProvider);
		return executor.executeQuery(this.#compile(executor), options);
	}
	#getExecutor(executorProvider) {
		const executor = executorProvider !== void 0 ? executorProvider.getExecutor() : NOOP_QUERY_EXECUTOR;
		return this.#props.plugins !== void 0 ? executor.withPlugins(this.#props.plugins) : executor;
	}
	#toOperationNode(executor) {
		return executor.transformQuery(this.#props.rawNode, this.#props.queryId);
	}
	#compile(executor) {
		return executor.compileQuery(this.#toOperationNode(executor), this.#props.queryId);
	}
};
function createRawBuilder(props) {
	return new RawBuilderImpl(props);
}
var AliasedRawBuilderImpl = class {
	#rawBuilder;
	#alias;
	constructor(rawBuilder, alias) {
		this.#rawBuilder = rawBuilder;
		this.#alias = alias;
	}
	get expression() {
		return this.#rawBuilder;
	}
	get alias() {
		return this.#alias;
	}
	get rawBuilder() {
		return this.#rawBuilder;
	}
	toOperationNode() {
		return AliasNode.create(this.#rawBuilder.toOperationNode(), isOperationNodeSource(this.#alias) ? this.#alias.toOperationNode() : IdentifierNode.create(this.#alias));
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/raw-builder/sql.js
const sql = Object.assign((sqlFragments, ...parameters) => {
	return createRawBuilder({
		queryId: createQueryId(),
		rawNode: RawNode.create(sqlFragments, parameters?.map(parseParameter) ?? [])
	});
}, {
	ref(columnReference) {
		return createRawBuilder({
			queryId: createQueryId(),
			rawNode: RawNode.createWithChild(parseStringReference(columnReference))
		});
	},
	val(value) {
		return createRawBuilder({
			queryId: createQueryId(),
			rawNode: RawNode.createWithChild(parseValueExpression(value))
		});
	},
	table(tableReference) {
		return createRawBuilder({
			queryId: createQueryId(),
			rawNode: RawNode.createWithChild(parseTable(tableReference))
		});
	},
	id(...ids) {
		const fragments = new Array(ids.length + 1).fill(".");
		fragments[0] = "";
		fragments[fragments.length - 1] = "";
		return createRawBuilder({
			queryId: createQueryId(),
			rawNode: RawNode.create(fragments, ids.map(IdentifierNode.create))
		});
	},
	lit(value) {
		return createRawBuilder({
			queryId: createQueryId(),
			rawNode: RawNode.createWithChild(ValueNode.createImmediate(value))
		});
	},
	raw(sql) {
		return createRawBuilder({
			queryId: createQueryId(),
			rawNode: RawNode.createWithSql(sql)
		});
	},
	join(array, separator = sql`, `) {
		const nodes = new Array(Math.max(2 * array.length - 1, 0));
		const sep = separator.toOperationNode();
		for (let i = 0; i < array.length; ++i) {
			nodes[2 * i] = parseParameter(array[i]);
			if (i !== array.length - 1) nodes[2 * i + 1] = sep;
		}
		return createRawBuilder({
			queryId: createQueryId(),
			rawNode: RawNode.createWithChildren(nodes)
		});
	}
});
function parseParameter(param) {
	if (isOperationNodeSource(param)) return param.toOperationNode();
	return parseValueExpression(param);
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/operation-node/operation-node-visitor.js
var OperationNodeVisitor = class {
	nodeStack = [];
	get parentNode() {
		return this.nodeStack[this.nodeStack.length - 2];
	}
	#visitors = freeze({
		AliasNode: this.visitAlias.bind(this),
		ColumnNode: this.visitColumn.bind(this),
		IdentifierNode: this.visitIdentifier.bind(this),
		SchemableIdentifierNode: this.visitSchemableIdentifier.bind(this),
		RawNode: this.visitRaw.bind(this),
		ReferenceNode: this.visitReference.bind(this),
		SelectQueryNode: this.visitSelectQuery.bind(this),
		SelectionNode: this.visitSelection.bind(this),
		TableNode: this.visitTable.bind(this),
		FromNode: this.visitFrom.bind(this),
		SelectAllNode: this.visitSelectAll.bind(this),
		AndNode: this.visitAnd.bind(this),
		OrNode: this.visitOr.bind(this),
		ValueNode: this.visitValue.bind(this),
		ValueListNode: this.visitValueList.bind(this),
		PrimitiveValueListNode: this.visitPrimitiveValueList.bind(this),
		ParensNode: this.visitParens.bind(this),
		JoinNode: this.visitJoin.bind(this),
		OperatorNode: this.visitOperator.bind(this),
		WhereNode: this.visitWhere.bind(this),
		InsertQueryNode: this.visitInsertQuery.bind(this),
		DeleteQueryNode: this.visitDeleteQuery.bind(this),
		ReturningNode: this.visitReturning.bind(this),
		CreateTableNode: this.visitCreateTable.bind(this),
		AddColumnNode: this.visitAddColumn.bind(this),
		ColumnDefinitionNode: this.visitColumnDefinition.bind(this),
		DropTableNode: this.visitDropTable.bind(this),
		DataTypeNode: this.visitDataType.bind(this),
		OrderByNode: this.visitOrderBy.bind(this),
		OrderByItemNode: this.visitOrderByItem.bind(this),
		GroupByNode: this.visitGroupBy.bind(this),
		GroupByItemNode: this.visitGroupByItem.bind(this),
		UpdateQueryNode: this.visitUpdateQuery.bind(this),
		ColumnUpdateNode: this.visitColumnUpdate.bind(this),
		LimitNode: this.visitLimit.bind(this),
		OffsetNode: this.visitOffset.bind(this),
		OnConflictNode: this.visitOnConflict.bind(this),
		OnDuplicateKeyNode: this.visitOnDuplicateKey.bind(this),
		CreateIndexNode: this.visitCreateIndex.bind(this),
		DropIndexNode: this.visitDropIndex.bind(this),
		ListNode: this.visitList.bind(this),
		PrimaryKeyConstraintNode: this.visitPrimaryKeyConstraint.bind(this),
		UniqueConstraintNode: this.visitUniqueConstraint.bind(this),
		ReferencesNode: this.visitReferences.bind(this),
		CheckConstraintNode: this.visitCheckConstraint.bind(this),
		WithNode: this.visitWith.bind(this),
		CommonTableExpressionNode: this.visitCommonTableExpression.bind(this),
		CommonTableExpressionNameNode: this.visitCommonTableExpressionName.bind(this),
		HavingNode: this.visitHaving.bind(this),
		CreateSchemaNode: this.visitCreateSchema.bind(this),
		DropSchemaNode: this.visitDropSchema.bind(this),
		AlterTableNode: this.visitAlterTable.bind(this),
		DropColumnNode: this.visitDropColumn.bind(this),
		RenameColumnNode: this.visitRenameColumn.bind(this),
		AlterColumnNode: this.visitAlterColumn.bind(this),
		ModifyColumnNode: this.visitModifyColumn.bind(this),
		AddConstraintNode: this.visitAddConstraint.bind(this),
		DropConstraintNode: this.visitDropConstraint.bind(this),
		RenameConstraintNode: this.visitRenameConstraint.bind(this),
		ForeignKeyConstraintNode: this.visitForeignKeyConstraint.bind(this),
		CreateViewNode: this.visitCreateView.bind(this),
		RefreshMaterializedViewNode: this.visitRefreshMaterializedView.bind(this),
		DropViewNode: this.visitDropView.bind(this),
		GeneratedNode: this.visitGenerated.bind(this),
		DefaultValueNode: this.visitDefaultValue.bind(this),
		OnNode: this.visitOn.bind(this),
		ValuesNode: this.visitValues.bind(this),
		SelectModifierNode: this.visitSelectModifier.bind(this),
		CreateTypeNode: this.visitCreateType.bind(this),
		DropTypeNode: this.visitDropType.bind(this),
		ExplainNode: this.visitExplain.bind(this),
		DefaultInsertValueNode: this.visitDefaultInsertValue.bind(this),
		AggregateFunctionNode: this.visitAggregateFunction.bind(this),
		OverNode: this.visitOver.bind(this),
		PartitionByNode: this.visitPartitionBy.bind(this),
		PartitionByItemNode: this.visitPartitionByItem.bind(this),
		SetOperationNode: this.visitSetOperation.bind(this),
		BinaryOperationNode: this.visitBinaryOperation.bind(this),
		UnaryOperationNode: this.visitUnaryOperation.bind(this),
		UsingNode: this.visitUsing.bind(this),
		FunctionNode: this.visitFunction.bind(this),
		CaseNode: this.visitCase.bind(this),
		WhenNode: this.visitWhen.bind(this),
		JSONReferenceNode: this.visitJSONReference.bind(this),
		JSONPathNode: this.visitJSONPath.bind(this),
		JSONPathLegNode: this.visitJSONPathLeg.bind(this),
		JSONOperatorChainNode: this.visitJSONOperatorChain.bind(this),
		TupleNode: this.visitTuple.bind(this),
		MergeQueryNode: this.visitMergeQuery.bind(this),
		MatchedNode: this.visitMatched.bind(this),
		AddIndexNode: this.visitAddIndex.bind(this),
		CastNode: this.visitCast.bind(this),
		FetchNode: this.visitFetch.bind(this),
		TopNode: this.visitTop.bind(this),
		OutputNode: this.visitOutput.bind(this),
		OrActionNode: this.visitOrAction.bind(this),
		CollateNode: this.visitCollate.bind(this),
		AlterTypeNode: this.visitAlterType.bind(this),
		AddValueNode: this.visitAddValue.bind(this),
		RenameValueNode: this.visitRenameValue.bind(this)
	});
	visitNode = (node) => {
		this.nodeStack.push(node);
		this.#visitors[node.kind](node);
		this.nodeStack.pop();
	};
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/query-compiler/default-query-compiler.js
const LIT_WRAP_REGEX = /'/g;
const JSON_PATH_MEMBER_WRAP_REGEX = /['"]/g;
var DefaultQueryCompiler = class extends OperationNodeVisitor {
	#sql = "";
	#parameters = [];
	get numParameters() {
		return this.#parameters.length;
	}
	compileQuery(node, queryId) {
		this.#sql = "";
		this.#parameters = [];
		this.nodeStack.splice(0, this.nodeStack.length);
		this.visitNode(node);
		return freeze({
			query: node,
			queryId,
			sql: this.getSql(),
			parameters: [...this.#parameters]
		});
	}
	getSql() {
		return this.#sql;
	}
	visitSelectQuery(node) {
		const wrapInParens = this.parentNode !== void 0 && !ParensNode.is(this.parentNode) && !InsertQueryNode.is(this.parentNode) && !CreateTableNode.is(this.parentNode) && !CreateViewNode.is(this.parentNode) && !SetOperationNode.is(this.parentNode);
		if (this.parentNode === void 0 && node.explain) {
			this.visitNode(node.explain);
			this.append(" ");
		}
		if (wrapInParens) this.append("(");
		if (node.with) {
			this.visitNode(node.with);
			this.append(" ");
		}
		this.append("select");
		if (node.distinctOn) {
			this.append(" ");
			this.compileDistinctOn(node.distinctOn);
		}
		if (node.frontModifiers?.length) {
			this.append(" ");
			this.compileList(node.frontModifiers, " ");
		}
		if (node.top) {
			this.append(" ");
			this.visitNode(node.top);
		}
		if (node.selections) {
			this.append(" ");
			this.compileList(node.selections);
		}
		if (node.from) {
			this.append(" ");
			this.visitNode(node.from);
		}
		if (node.joins) {
			this.append(" ");
			this.compileList(node.joins, " ");
		}
		if (node.where) {
			this.append(" ");
			this.visitNode(node.where);
		}
		if (node.groupBy) {
			this.append(" ");
			this.visitNode(node.groupBy);
		}
		if (node.having) {
			this.append(" ");
			this.visitNode(node.having);
		}
		if (node.setOperations) {
			this.append(" ");
			this.compileList(node.setOperations, " ");
		}
		if (node.orderBy) {
			this.append(" ");
			this.visitNode(node.orderBy);
		}
		if (node.limit) {
			this.append(" ");
			this.visitNode(node.limit);
		}
		if (node.offset) {
			this.append(" ");
			this.visitNode(node.offset);
		}
		if (node.fetch) {
			this.append(" ");
			this.visitNode(node.fetch);
		}
		if (node.endModifiers?.length) {
			this.append(" ");
			this.compileList(this.sortSelectModifiers(node.endModifiers), " ");
		}
		if (wrapInParens) this.append(")");
	}
	visitFrom(node) {
		this.append("from ");
		this.compileList(node.froms);
	}
	visitSelection(node) {
		this.visitNode(node.selection);
	}
	visitColumn(node) {
		this.visitNode(node.column);
	}
	compileDistinctOn(expressions) {
		this.append("distinct on (");
		this.compileList(expressions);
		this.append(")");
	}
	compileList(nodes, separator = ", ") {
		const lastIndex = nodes.length - 1;
		for (let i = 0; i <= lastIndex; i++) {
			this.visitNode(nodes[i]);
			if (i < lastIndex) this.append(separator);
		}
	}
	visitWhere(node) {
		this.append("where ");
		this.visitNode(node.where);
	}
	visitHaving(node) {
		this.append("having ");
		this.visitNode(node.having);
	}
	visitInsertQuery(node) {
		const wrapInParens = this.parentNode !== void 0 && !ParensNode.is(this.parentNode) && !RawNode.is(this.parentNode) && !WhenNode.is(this.parentNode);
		if (this.parentNode === void 0 && node.explain) {
			this.visitNode(node.explain);
			this.append(" ");
		}
		if (wrapInParens) this.append("(");
		if (node.with) {
			this.visitNode(node.with);
			this.append(" ");
		}
		this.append(node.replace ? "replace" : "insert");
		if (node.orAction) {
			this.append(" ");
			this.visitNode(node.orAction);
		}
		if (node.top) {
			this.append(" ");
			this.visitNode(node.top);
		}
		if (node.into) {
			this.append(" into ");
			this.visitNode(node.into);
		}
		if (node.columns) {
			this.append(" (");
			this.compileList(node.columns);
			this.append(")");
		}
		if (node.output) {
			this.append(" ");
			this.visitNode(node.output);
		}
		if (node.values) {
			this.append(" ");
			this.visitNode(node.values);
		}
		if (node.defaultValues) {
			this.append(" ");
			this.append("default values");
		}
		if (node.onConflict) {
			this.append(" ");
			this.visitNode(node.onConflict);
		}
		if (node.onDuplicateKey) {
			this.append(" ");
			this.visitNode(node.onDuplicateKey);
		}
		if (node.returning) {
			this.append(" ");
			this.visitNode(node.returning);
		}
		if (wrapInParens) this.append(")");
		if (node.endModifiers?.length) {
			this.append(" ");
			this.compileList(node.endModifiers, " ");
		}
	}
	visitValues(node) {
		this.append("values ");
		this.compileList(node.values);
	}
	visitDeleteQuery(node) {
		const wrapInParens = this.parentNode !== void 0 && !ParensNode.is(this.parentNode) && !RawNode.is(this.parentNode);
		if (this.parentNode === void 0 && node.explain) {
			this.visitNode(node.explain);
			this.append(" ");
		}
		if (wrapInParens) this.append("(");
		if (node.with) {
			this.visitNode(node.with);
			this.append(" ");
		}
		this.append("delete ");
		if (node.top) {
			this.visitNode(node.top);
			this.append(" ");
		}
		this.visitNode(node.from);
		if (node.output) {
			this.append(" ");
			this.visitNode(node.output);
		}
		if (node.using) {
			this.append(" ");
			this.visitNode(node.using);
		}
		if (node.joins) {
			this.append(" ");
			this.compileList(node.joins, " ");
		}
		if (node.where) {
			this.append(" ");
			this.visitNode(node.where);
		}
		if (node.returning) {
			this.append(" ");
			this.visitNode(node.returning);
		}
		if (node.orderBy) {
			this.append(" ");
			this.visitNode(node.orderBy);
		}
		if (node.limit) {
			this.append(" ");
			this.visitNode(node.limit);
		}
		if (wrapInParens) this.append(")");
		if (node.endModifiers?.length) {
			this.append(" ");
			this.compileList(node.endModifiers, " ");
		}
	}
	visitReturning(node) {
		this.append("returning ");
		this.compileList(node.selections);
	}
	visitAlias(node) {
		this.visitNode(node.node);
		this.append(" as ");
		this.visitNode(node.alias);
	}
	visitReference(node) {
		if (node.table) {
			this.visitNode(node.table);
			this.append(".");
		}
		this.visitNode(node.column);
	}
	visitSelectAll(_) {
		this.append("*");
	}
	visitIdentifier(node) {
		this.append(this.getLeftIdentifierWrapper());
		this.compileUnwrappedIdentifier(node);
		this.append(this.getRightIdentifierWrapper());
	}
	compileUnwrappedIdentifier(node) {
		if (!isString(node.name)) throw new Error("a non-string identifier was passed to compileUnwrappedIdentifier.");
		this.append(this.sanitizeIdentifier(node.name));
	}
	visitAnd(node) {
		this.visitNode(node.left);
		this.append(" and ");
		this.visitNode(node.right);
	}
	visitOr(node) {
		this.visitNode(node.left);
		this.append(" or ");
		this.visitNode(node.right);
	}
	visitValue(node) {
		if (node.immediate) this.appendImmediateValue(node.value);
		else this.appendValue(node.value);
	}
	visitValueList(node) {
		this.append("(");
		this.compileList(node.values);
		this.append(")");
	}
	visitTuple(node) {
		this.append("(");
		this.compileList(node.values);
		this.append(")");
	}
	visitPrimitiveValueList(node) {
		this.append("(");
		const { values } = node;
		for (let i = 0; i < values.length; ++i) {
			this.appendValue(values[i]);
			if (i !== values.length - 1) this.append(", ");
		}
		this.append(")");
	}
	visitParens(node) {
		this.append("(");
		this.visitNode(node.node);
		this.append(")");
	}
	visitJoin(node) {
		this.append(JOIN_TYPE_SQL[node.joinType]);
		this.append(" ");
		this.visitNode(node.table);
		if (node.on) {
			this.append(" ");
			this.visitNode(node.on);
		}
	}
	visitOn(node) {
		this.append("on ");
		this.visitNode(node.on);
	}
	visitRaw(node) {
		const { sqlFragments, parameters: params } = node;
		for (let i = 0; i < sqlFragments.length; ++i) {
			this.append(sqlFragments[i]);
			if (params.length > i) this.visitNode(params[i]);
		}
	}
	visitOperator(node) {
		this.append(node.operator);
	}
	visitTable(node) {
		this.visitNode(node.table);
	}
	visitSchemableIdentifier(node) {
		if (node.schema) {
			this.visitNode(node.schema);
			this.append(".");
		}
		this.visitNode(node.identifier);
	}
	visitCreateTable(node) {
		this.append("create ");
		if (node.frontModifiers?.length) {
			this.compileList(node.frontModifiers, " ");
			this.append(" ");
		}
		if (node.temporary) this.append("temporary ");
		this.append("table ");
		if (node.ifNotExists) this.append("if not exists ");
		this.visitNode(node.table);
		if (!node.selectQuery) {
			this.append(" (");
			this.compileList([
				...node.columns,
				...node.constraints ?? [],
				...node.indexes ?? []
			]);
			this.append(")");
		}
		if (node.onCommit) {
			this.append(" on commit ");
			this.append(node.onCommit);
		}
		if (node.endModifiers?.length) {
			this.append(" ");
			this.compileList(node.endModifiers, " ");
		}
		if (node.selectQuery) {
			this.append(" as ");
			this.visitNode(node.selectQuery);
		}
	}
	visitColumnDefinition(node) {
		if (node.ifNotExists) this.append("if not exists ");
		this.visitNode(node.column);
		this.append(" ");
		this.visitNode(node.dataType);
		if (node.unsigned) this.append(" unsigned");
		if (node.frontModifiers && node.frontModifiers.length > 0) {
			this.append(" ");
			this.compileList(node.frontModifiers, " ");
		}
		if (node.generated) {
			this.append(" ");
			this.visitNode(node.generated);
		}
		if (node.identity) this.append(" identity");
		if (node.defaultTo) {
			this.append(" ");
			this.visitNode(node.defaultTo);
		}
		if (node.notNull) this.append(" not null");
		if (node.unique) this.append(" unique");
		if (node.nullsNotDistinct) this.append(" nulls not distinct");
		if (node.primaryKey) this.append(" primary key");
		if (node.autoIncrement) {
			this.append(" ");
			this.append(this.getAutoIncrement());
		}
		if (node.references) {
			this.append(" ");
			this.visitNode(node.references);
		}
		if (node.check) {
			this.append(" ");
			this.visitNode(node.check);
		}
		if (node.endModifiers && node.endModifiers.length > 0) {
			this.append(" ");
			this.compileList(node.endModifiers, " ");
		}
	}
	getAutoIncrement() {
		return "auto_increment";
	}
	visitReferences(node) {
		this.append("references ");
		this.visitNode(node.table);
		this.append(" (");
		this.compileList(node.columns);
		this.append(")");
		if (node.onDelete) {
			this.append(" on delete ");
			this.append(node.onDelete);
		}
		if (node.onUpdate) {
			this.append(" on update ");
			this.append(node.onUpdate);
		}
	}
	visitDropTable(node) {
		this.append("drop ");
		if (node.temporary) this.append("temporary ");
		this.append("table ");
		if (node.ifExists) this.append("if exists ");
		this.visitNode(node.table);
		if (node.cascade) this.append(" cascade");
	}
	visitDataType(node) {
		this.append(node.dataType);
	}
	visitOrderBy(node) {
		this.append("order by ");
		this.compileList(node.items);
	}
	visitOrderByItem(node) {
		this.visitNode(node.orderBy);
		if (node.collation) {
			this.append(" ");
			this.visitNode(node.collation);
		}
		if (node.direction) {
			this.append(" ");
			this.visitNode(node.direction);
		}
		if (node.nulls) {
			this.append(" nulls ");
			this.append(node.nulls);
		}
	}
	visitGroupBy(node) {
		this.append("group by ");
		this.compileList(node.items);
	}
	visitGroupByItem(node) {
		this.visitNode(node.groupBy);
	}
	visitUpdateQuery(node) {
		const wrapInParens = this.parentNode !== void 0 && !ParensNode.is(this.parentNode) && !RawNode.is(this.parentNode) && !WhenNode.is(this.parentNode);
		if (this.parentNode === void 0 && node.explain) {
			this.visitNode(node.explain);
			this.append(" ");
		}
		if (wrapInParens) this.append("(");
		if (node.with) {
			this.visitNode(node.with);
			this.append(" ");
		}
		this.append("update ");
		if (node.top) {
			this.visitNode(node.top);
			this.append(" ");
		}
		if (node.table) {
			this.visitNode(node.table);
			this.append(" ");
		}
		this.append("set ");
		if (node.updates) this.compileList(node.updates);
		if (node.output) {
			this.append(" ");
			this.visitNode(node.output);
		}
		if (node.from) {
			this.append(" ");
			this.visitNode(node.from);
		}
		if (node.joins) {
			if (!node.from) throw new Error("Joins in an update query are only supported as a part of a PostgreSQL 'update set from join' query. If you want to create a MySQL 'update join set' query, see https://kysely.dev/docs/examples/update/my-sql-joins");
			this.append(" ");
			this.compileList(node.joins, " ");
		}
		if (node.where) {
			this.append(" ");
			this.visitNode(node.where);
		}
		if (node.returning) {
			this.append(" ");
			this.visitNode(node.returning);
		}
		if (node.orderBy) {
			this.append(" ");
			this.visitNode(node.orderBy);
		}
		if (node.limit) {
			this.append(" ");
			this.visitNode(node.limit);
		}
		if (wrapInParens) this.append(")");
		if (node.endModifiers?.length) {
			this.append(" ");
			this.compileList(node.endModifiers, " ");
		}
	}
	visitColumnUpdate(node) {
		this.visitNode(node.column);
		this.append(" = ");
		this.visitNode(node.value);
	}
	visitLimit(node) {
		this.append("limit ");
		this.visitNode(node.limit);
	}
	visitOffset(node) {
		this.append("offset ");
		this.visitNode(node.offset);
	}
	visitOnConflict(node) {
		this.append("on conflict");
		if (node.columns) {
			this.append(" (");
			this.compileList(node.columns);
			this.append(")");
		} else if (node.constraint) {
			this.append(" on constraint ");
			this.visitNode(node.constraint);
		} else if (node.indexExpression) {
			this.append(" (");
			this.visitNode(node.indexExpression);
			this.append(")");
		}
		if (node.indexWhere) {
			this.append(" ");
			this.visitNode(node.indexWhere);
		}
		if (node.doNothing === true) this.append(" do nothing");
		else if (node.updates) {
			this.append(" do update set ");
			this.compileList(node.updates);
			if (node.updateWhere) {
				this.append(" ");
				this.visitNode(node.updateWhere);
			}
		}
	}
	visitOnDuplicateKey(node) {
		this.append("on duplicate key update ");
		this.compileList(node.updates);
	}
	visitCreateIndex(node) {
		this.append("create ");
		if (node.unique) this.append("unique ");
		this.append("index ");
		if (node.ifNotExists) this.append("if not exists ");
		this.visitNode(node.name);
		if (node.table) {
			this.append(" on ");
			this.visitNode(node.table);
		}
		if (node.using) {
			this.append(" using ");
			this.visitNode(node.using);
		}
		if (node.columns) {
			this.append(" (");
			this.compileList(node.columns);
			this.append(")");
		}
		if (node.nullsNotDistinct) this.append(" nulls not distinct");
		if (node.where) {
			this.append(" ");
			this.visitNode(node.where);
		}
	}
	visitDropIndex(node) {
		this.append("drop index ");
		if (node.ifExists) this.append("if exists ");
		this.visitNode(node.name);
		if (node.table) {
			this.append(" on ");
			this.visitNode(node.table);
		}
		if (node.cascade) this.append(" cascade");
	}
	visitCreateSchema(node) {
		this.append("create schema ");
		if (node.ifNotExists) this.append("if not exists ");
		this.visitNode(node.schema);
	}
	visitDropSchema(node) {
		this.append("drop schema ");
		if (node.ifExists) this.append("if exists ");
		this.visitNode(node.schema);
		if (node.cascade) this.append(" cascade");
	}
	visitPrimaryKeyConstraint(node) {
		if (node.name) {
			this.append("constraint ");
			this.visitNode(node.name);
			this.append(" ");
		}
		this.append("primary key (");
		this.compileList(node.columns);
		this.append(")");
		this.buildDeferrable(node);
	}
	buildDeferrable(node) {
		if (node.deferrable !== void 0) {
			if (node.deferrable) this.append(" deferrable");
			else this.append(" not deferrable");
		}
		if (node.initiallyDeferred !== void 0) {
			if (node.initiallyDeferred) this.append(" initially deferred");
			else this.append(" initially immediate");
		}
	}
	visitUniqueConstraint(node) {
		if (node.name) {
			this.append("constraint ");
			this.visitNode(node.name);
			this.append(" ");
		}
		this.append("unique");
		if (node.nullsNotDistinct) this.append(" nulls not distinct");
		this.append(" (");
		this.compileList(node.columns);
		this.append(")");
		this.buildDeferrable(node);
	}
	visitCheckConstraint(node) {
		if (node.name) {
			this.append("constraint ");
			this.visitNode(node.name);
			this.append(" ");
		}
		this.append("check (");
		this.visitNode(node.expression);
		this.append(")");
	}
	visitForeignKeyConstraint(node) {
		if (node.name) {
			this.append("constraint ");
			this.visitNode(node.name);
			this.append(" ");
		}
		this.append("foreign key (");
		this.compileList(node.columns);
		this.append(") ");
		this.visitNode(node.references);
		if (node.onDelete) {
			this.append(" on delete ");
			this.append(node.onDelete);
		}
		if (node.onUpdate) {
			this.append(" on update ");
			this.append(node.onUpdate);
		}
		this.buildDeferrable(node);
	}
	visitList(node) {
		this.compileList(node.items);
	}
	visitWith(node) {
		this.append("with ");
		if (node.recursive) this.append("recursive ");
		this.compileList(node.expressions);
	}
	visitCommonTableExpression(node) {
		this.visitNode(node.name);
		this.append(" as ");
		if (isBoolean(node.materialized)) {
			if (!node.materialized) this.append("not ");
			this.append("materialized ");
		}
		this.visitNode(node.expression);
	}
	visitCommonTableExpressionName(node) {
		this.visitNode(node.table);
		if (node.columns) {
			this.append("(");
			this.compileList(node.columns);
			this.append(")");
		}
	}
	visitAlterTable(node) {
		this.append("alter table ");
		this.visitNode(node.table);
		this.append(" ");
		if (node.renameTo) {
			this.append("rename to ");
			this.visitNode(node.renameTo);
		}
		if (node.setSchema) {
			this.append("set schema ");
			this.visitNode(node.setSchema);
		}
		if (node.addConstraint) this.visitNode(node.addConstraint);
		if (node.dropConstraint) this.visitNode(node.dropConstraint);
		if (node.renameConstraint) this.visitNode(node.renameConstraint);
		if (node.columnAlterations) this.compileColumnAlterations(node.columnAlterations);
		if (node.addIndex) this.visitNode(node.addIndex);
		if (node.dropIndex) this.visitNode(node.dropIndex);
	}
	visitAddColumn(node) {
		this.append("add column ");
		this.visitNode(node.column);
	}
	visitRenameColumn(node) {
		this.append("rename column ");
		this.visitNode(node.column);
		this.append(" to ");
		this.visitNode(node.renameTo);
	}
	visitDropColumn(node) {
		this.append("drop column ");
		if (node.ifExists) this.append("if exists ");
		this.visitNode(node.column);
	}
	visitAlterColumn(node) {
		this.append("alter column ");
		this.visitNode(node.column);
		this.append(" ");
		if (node.dataType) {
			if (this.announcesNewColumnDataType()) this.append("type ");
			this.visitNode(node.dataType);
			if (node.dataTypeExpression) {
				this.append("using ");
				this.visitNode(node.dataTypeExpression);
			}
		}
		if (node.setDefault) {
			this.append("set default ");
			this.visitNode(node.setDefault);
		}
		if (node.dropDefault) this.append("drop default");
		if (node.setNotNull) this.append("set not null");
		if (node.dropNotNull) this.append("drop not null");
	}
	visitModifyColumn(node) {
		this.append("modify column ");
		this.visitNode(node.column);
	}
	visitAddConstraint(node) {
		this.append("add ");
		this.visitNode(node.constraint);
	}
	visitDropConstraint(node) {
		this.append("drop constraint ");
		if (node.ifExists) this.append("if exists ");
		this.visitNode(node.constraintName);
		if (node.modifier === "cascade") this.append(" cascade");
		else if (node.modifier === "restrict") this.append(" restrict");
	}
	visitRenameConstraint(node) {
		this.append("rename constraint ");
		this.visitNode(node.oldName);
		this.append(" to ");
		this.visitNode(node.newName);
	}
	visitSetOperation(node) {
		this.append(node.operator);
		this.append(" ");
		if (node.all) this.append("all ");
		this.visitNode(node.expression);
	}
	visitCreateView(node) {
		this.append("create ");
		if (node.orReplace) this.append("or replace ");
		if (node.materialized) this.append("materialized ");
		if (node.temporary) this.append("temporary ");
		this.append("view ");
		if (node.ifNotExists) this.append("if not exists ");
		this.visitNode(node.name);
		this.append(" ");
		if (node.columns) {
			this.append("(");
			this.compileList(node.columns);
			this.append(") ");
		}
		if (node.as) {
			this.append("as ");
			this.visitNode(node.as);
		}
	}
	visitRefreshMaterializedView(node) {
		this.append("refresh materialized view ");
		if (node.concurrently) this.append("concurrently ");
		this.visitNode(node.name);
		if (node.withNoData) this.append(" with no data");
		else this.append(" with data");
	}
	visitDropView(node) {
		this.append("drop ");
		if (node.materialized) this.append("materialized ");
		this.append("view ");
		if (node.ifExists) this.append("if exists ");
		this.visitNode(node.name);
		if (node.cascade) this.append(" cascade");
	}
	visitGenerated(node) {
		this.append("generated ");
		if (node.always) this.append("always ");
		if (node.byDefault) this.append("by default ");
		this.append("as ");
		if (node.identity) this.append("identity");
		if (node.expression) {
			this.append("(");
			this.visitNode(node.expression);
			this.append(")");
		}
		if (node.stored) this.append(" stored");
	}
	visitDefaultValue(node) {
		this.append("default ");
		this.visitNode(node.defaultValue);
	}
	visitSelectModifier(node) {
		if (node.rawModifier) this.visitNode(node.rawModifier);
		else this.append(SELECT_MODIFIER_SQL[node.modifier]);
		if (node.of) {
			this.append(" of ");
			this.compileList(node.of, ", ");
		}
	}
	visitCreateType(node) {
		this.append("create type ");
		this.visitNode(node.name);
		if (node.enum) {
			this.append(" as enum ");
			this.visitNode(node.enum);
		}
	}
	visitDropType(node) {
		this.append("drop type ");
		if (node.ifExists) this.append("if exists ");
		this.visitNode(node.name);
		if (node.additionalNames?.length) {
			this.append(", ");
			this.compileList(node.additionalNames);
		}
		if (node.cascade) this.append(" cascade");
	}
	visitAlterType(node) {
		this.append("alter type ");
		this.visitNode(node.name);
		this.append(" ");
		if (node.addValue) this.visitNode(node.addValue);
		else if (node.renameTo) {
			this.append("rename to ");
			this.visitNode(node.renameTo);
		} else if (node.renameValue) this.visitNode(node.renameValue);
		else if (node.setSchema) {
			this.append("set schema ");
			this.visitNode(node.setSchema);
		}
	}
	visitAddValue(node) {
		this.append("add value ");
		if (node.ifNotExists) this.append("if not exists ");
		this.visitNode(node.value);
		if (node.neighborValue) {
			this.append(node.isBefore ? " before " : " after ");
			this.visitNode(node.neighborValue);
		}
	}
	visitRenameValue(node) {
		this.append("rename value ");
		this.visitNode(node.oldValue);
		this.append(" to ");
		this.visitNode(node.newValue);
	}
	visitExplain(node) {
		this.append("explain");
		if (node.options || node.format) {
			this.append(" ");
			this.append(this.getLeftExplainOptionsWrapper());
			if (node.options) {
				this.visitNode(node.options);
				if (node.format) this.append(this.getExplainOptionsDelimiter());
			}
			if (node.format) {
				this.append("format");
				this.append(this.getExplainOptionAssignment());
				this.append(node.format);
			}
			this.append(this.getRightExplainOptionsWrapper());
		}
	}
	visitDefaultInsertValue(_) {
		this.append("default");
	}
	visitAggregateFunction(node) {
		this.append(node.func);
		this.append("(");
		if (node.distinct) this.append("distinct ");
		this.compileList(node.aggregated);
		if (node.orderBy) {
			this.append(" ");
			this.visitNode(node.orderBy);
		}
		this.append(")");
		if (node.withinGroup) {
			this.append(" within group (");
			this.visitNode(node.withinGroup);
			this.append(")");
		}
		if (node.filter) {
			this.append(" filter(");
			this.visitNode(node.filter);
			this.append(")");
		}
		if (node.over) {
			this.append(" ");
			this.visitNode(node.over);
		}
	}
	visitOver(node) {
		this.append("over(");
		if (node.partitionBy) {
			this.visitNode(node.partitionBy);
			if (node.orderBy) this.append(" ");
		}
		if (node.orderBy) this.visitNode(node.orderBy);
		this.append(")");
	}
	visitPartitionBy(node) {
		this.append("partition by ");
		this.compileList(node.items);
	}
	visitPartitionByItem(node) {
		this.visitNode(node.partitionBy);
	}
	visitBinaryOperation(node) {
		this.visitNode(node.leftOperand);
		this.append(" ");
		this.visitNode(node.operator);
		this.append(" ");
		this.visitNode(node.rightOperand);
	}
	visitUnaryOperation(node) {
		this.visitNode(node.operator);
		if (!this.isMinusOperator(node.operator)) this.append(" ");
		this.visitNode(node.operand);
	}
	isMinusOperator(node) {
		return OperatorNode.is(node) && node.operator === "-";
	}
	visitUsing(node) {
		this.append("using ");
		this.compileList(node.tables);
	}
	visitFunction(node) {
		this.append(node.func);
		this.append("(");
		this.compileList(node.arguments);
		this.append(")");
	}
	visitCase(node) {
		this.append("case");
		if (node.value) {
			this.append(" ");
			this.visitNode(node.value);
		}
		if (node.when) {
			this.append(" ");
			this.compileList(node.when, " ");
		}
		if (node.else) {
			this.append(" else ");
			this.visitNode(node.else);
		}
		this.append(" end");
		if (node.isStatement) this.append(" case");
	}
	visitWhen(node) {
		this.append("when ");
		this.visitNode(node.condition);
		if (node.result) {
			this.append(" then ");
			this.visitNode(node.result);
		}
	}
	visitJSONReference(node) {
		this.visitNode(node.reference);
		this.visitNode(node.traversal);
	}
	visitJSONPath(node) {
		if (node.inOperator) this.visitNode(node.inOperator);
		this.append("'$");
		for (const pathLeg of node.pathLegs) this.visitNode(pathLeg);
		this.append("'");
	}
	visitJSONPathLeg(node) {
		const isArrayLocation = node.type === "ArrayLocation";
		const value = String(node.value);
		if (isArrayLocation) {
			this.append("[");
			this.append(this.sanitizeStringLiteral(value));
			this.append("]");
		} else {
			this.append(".\"");
			this.append(this.sanitizeJSONPathMemberValue(value));
			this.append("\"");
		}
	}
	visitJSONOperatorChain(node) {
		for (let i = 0, len = node.values.length; i < len; i++) {
			if (i === len - 1) this.visitNode(node.operator);
			else this.append("->");
			this.visitNode(node.values[i]);
		}
	}
	visitMergeQuery(node) {
		if (node.with) {
			this.visitNode(node.with);
			this.append(" ");
		}
		this.append("merge ");
		if (node.top) {
			this.visitNode(node.top);
			this.append(" ");
		}
		this.append("into ");
		this.visitNode(node.into);
		if (node.using) {
			this.append(" ");
			this.visitNode(node.using);
		}
		if (node.whens) {
			this.append(" ");
			this.compileList(node.whens, " ");
		}
		if (node.returning) {
			this.append(" ");
			this.visitNode(node.returning);
		}
		if (node.output) {
			this.append(" ");
			this.visitNode(node.output);
		}
		if (node.endModifiers?.length) {
			this.append(" ");
			this.compileList(node.endModifiers, " ");
		}
	}
	visitMatched(node) {
		if (node.not) this.append("not ");
		this.append("matched");
		if (node.bySource) this.append(" by source");
	}
	visitAddIndex(node) {
		if (!this.parentNode || !CreateTableNode.is(this.parentNode)) this.append("add ");
		if (node.unique) this.append("unique ");
		this.append("index ");
		this.visitNode(node.name);
		if (node.columns) {
			this.append(" (");
			this.compileList(node.columns);
			this.append(")");
		}
		if (node.using) {
			this.append(" using ");
			this.visitNode(node.using);
		}
	}
	visitCast(node) {
		this.append("cast(");
		this.visitNode(node.expression);
		this.append(" as ");
		this.visitNode(node.dataType);
		this.append(")");
	}
	visitFetch(node) {
		this.append("fetch next ");
		this.visitNode(node.rowCount);
		this.append(` rows ${node.modifier}`);
	}
	visitOutput(node) {
		this.append("output ");
		this.compileList(node.selections);
	}
	visitTop(node) {
		this.append(`top(${node.expression})`);
		if (node.modifiers) this.append(` ${node.modifiers}`);
	}
	visitOrAction(node) {
		this.append(node.action);
	}
	visitCollate(node) {
		this.append("collate ");
		this.visitNode(node.collation);
	}
	append(str) {
		this.#sql += str;
	}
	appendValue(parameter) {
		this.addParameter(parameter);
		this.append(this.getCurrentParameterPlaceholder());
	}
	getLeftIdentifierWrapper() {
		return "\"";
	}
	getRightIdentifierWrapper() {
		return "\"";
	}
	getCurrentParameterPlaceholder() {
		return "$" + this.numParameters;
	}
	getLeftExplainOptionsWrapper() {
		return "(";
	}
	getExplainOptionAssignment() {
		return " ";
	}
	getExplainOptionsDelimiter() {
		return ", ";
	}
	getRightExplainOptionsWrapper() {
		return ")";
	}
	sanitizeIdentifier(identifier) {
		const leftWrap = this.getLeftIdentifierWrapper();
		const rightWrap = this.getRightIdentifierWrapper();
		let sanitized = "";
		for (const c of identifier) {
			sanitized += c;
			if (c === leftWrap) sanitized += leftWrap;
			else if (c === rightWrap) sanitized += rightWrap;
		}
		return sanitized;
	}
	sanitizeStringLiteral(value) {
		return value.replace(LIT_WRAP_REGEX, "''");
	}
	sanitizeJSONPathMemberValue(value) {
		return value.replace(JSON_PATH_MEMBER_WRAP_REGEX, (char) => char === "'" ? "''" : "\\\"");
	}
	addParameter(parameter) {
		this.#parameters.push(parameter);
	}
	appendImmediateValue(value) {
		if (isString(value)) this.appendStringLiteral(value);
		else if (isNumber(value) || isBoolean(value) || isBigInt(value)) this.append(value.toString());
		else if (isNull(value)) this.append("null");
		else if (isDate(value)) this.appendImmediateValue(value.toISOString());
		else throw new Error(`invalid immediate value ${value}`);
	}
	appendStringLiteral(value) {
		this.append("'");
		this.append(this.sanitizeStringLiteral(value));
		this.append("'");
	}
	sortSelectModifiers(arr) {
		return freeze(arr.toSorted((left, right) => left.modifier && right.modifier ? SELECT_MODIFIER_PRIORITY[left.modifier] - SELECT_MODIFIER_PRIORITY[right.modifier] : 1));
	}
	compileColumnAlterations(columnAlterations) {
		this.compileList(columnAlterations);
	}
	/**
	* controls whether the dialect adds a "type" keyword before a column's new data
	* type in an ALTER TABLE statement.
	*/
	announcesNewColumnDataType() {
		return true;
	}
};
const SELECT_MODIFIER_SQL = freeze({
	ForKeyShare: "for key share",
	ForNoKeyUpdate: "for no key update",
	ForUpdate: "for update",
	ForShare: "for share",
	NoWait: "nowait",
	SkipLocked: "skip locked",
	Distinct: "distinct"
});
const SELECT_MODIFIER_PRIORITY = freeze({
	ForKeyShare: 1,
	ForNoKeyUpdate: 1,
	ForUpdate: 1,
	ForShare: 1,
	NoWait: 2,
	SkipLocked: 2,
	Distinct: 0
});
const JOIN_TYPE_SQL = freeze({
	InnerJoin: "inner join",
	LeftJoin: "left join",
	RightJoin: "right join",
	FullJoin: "full join",
	CrossJoin: "cross join",
	LateralInnerJoin: "inner join lateral",
	LateralLeftJoin: "left join lateral",
	LateralCrossJoin: "cross join lateral",
	OuterApply: "outer apply",
	CrossApply: "cross apply",
	Using: "using"
});
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/query-compiler/compiled-query.js
const CompiledQuery = freeze({ raw(sql, parameters = []) {
	return freeze({
		sql,
		query: RawNode.createWithSql(sql),
		parameters: freeze(parameters),
		queryId: createQueryId()
	});
} });
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/dialect/dialect-adapter-base.js
/**
* A basic implementation of `DialectAdapter` with sensible default values.
* Third-party dialects can extend this instead of implementing the `DialectAdapter`
* interface from scratch. That way all new settings will get default values when
* they are added and there will be less breaking changes.
*/
var DialectAdapterBase = class {
	get supportsCreateIfNotExists() {
		return true;
	}
	get supportsMultipleConnections() {
		return true;
	}
	get supportsTransactionalDdl() {
		return false;
	}
	get supportsReturning() {
		return false;
	}
	get supportsOutput() {
		return false;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/parser/savepoint-parser.js
function parseSavepointCommand(command, savepointName) {
	return RawNode.createWithChildren([RawNode.createWithSql(`${command} `), IdentifierNode.create(savepointName)]);
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/dialect/sqlite/sqlite-driver.js
var SqliteDriver = class {
	#config;
	#db;
	#connection;
	constructor(config) {
		this.#config = freeze({ ...config });
	}
	async init(options) {
		this.#db = isFunction(this.#config.database) ? await this.#config.database(options) : this.#config.database;
		this.#connection = new SqliteConnection(this.#db);
		if (this.#config.onCreateConnection) await this.#config.onCreateConnection(this.#connection, options);
	}
	async acquireConnection() {
		return this.#connection;
	}
	async beginTransaction(connection) {
		await connection.executeQuery(CompiledQuery.raw("begin"));
	}
	async commitTransaction(connection) {
		await connection.executeQuery(CompiledQuery.raw("commit"));
	}
	async rollbackTransaction(connection) {
		await connection.executeQuery(CompiledQuery.raw("rollback"));
	}
	async savepoint(connection, savepointName, compileQuery) {
		await connection.executeQuery(compileQuery(parseSavepointCommand("savepoint", savepointName), createQueryId()));
	}
	async rollbackToSavepoint(connection, savepointName, compileQuery) {
		await connection.executeQuery(compileQuery(parseSavepointCommand("rollback to", savepointName), createQueryId()));
	}
	async releaseSavepoint(connection, savepointName, compileQuery) {
		await connection.executeQuery(compileQuery(parseSavepointCommand("release", savepointName), createQueryId()));
	}
	async releaseConnection() {}
	async destroy() {
		this.#db?.close();
	}
};
var SqliteConnection = class {
	#db;
	constructor(db) {
		this.#db = db;
	}
	async executeQuery(compiledQuery) {
		const { sql, parameters } = compiledQuery;
		const stmt = this.#db.prepare(sql);
		if (stmt.reader) return { rows: stmt.all(parameters) };
		const { changes, lastInsertRowid } = stmt.run(parameters);
		return {
			insertId: lastInsertRowid != null ? BigInt(lastInsertRowid) : void 0,
			numAffectedRows: changes != null ? BigInt(changes) : void 0,
			rows: []
		};
	}
	async *streamQuery(compiledQuery, _chunkSize) {
		const { sql, parameters, query } = compiledQuery;
		const stmt = this.#db.prepare(sql);
		if (!SelectQueryNode.is(query)) throw new Error("Sqlite driver only supports streaming of select queries");
		const iter = stmt.iterate(parameters);
		for (const row of iter) yield { rows: [row] };
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/dialect/sqlite/sqlite-query-compiler.js
const ID_WRAP_REGEX$1 = /"/g;
const JSON_PATH_MEMBER_ESCAPE_REGEX = /[\\'"]/g;
var SqliteQueryCompiler = class extends DefaultQueryCompiler {
	visitOrAction(node) {
		this.append("or ");
		this.append(node.action);
	}
	getCurrentParameterPlaceholder() {
		return "?";
	}
	getLeftExplainOptionsWrapper() {
		return "";
	}
	getRightExplainOptionsWrapper() {
		return "";
	}
	getLeftIdentifierWrapper() {
		return "\"";
	}
	getRightIdentifierWrapper() {
		return "\"";
	}
	getAutoIncrement() {
		return "autoincrement";
	}
	sanitizeIdentifier(identifier) {
		return identifier.replace(ID_WRAP_REGEX$1, "\"\"");
	}
	sanitizeJSONPathMemberValue(value) {
		return value.replace(JSON_PATH_MEMBER_ESCAPE_REGEX, (char) => char === "\\" ? "\\\\" : char === "'" ? "''" : "\\\"");
	}
	visitDefaultInsertValue(_) {
		this.append("null");
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/migration/migrator.js
const DEFAULT_MIGRATION_TABLE = "kysely_migration";
const DEFAULT_MIGRATION_LOCK_TABLE = "kysely_migration_lock";
freeze({ __noMigrations__: true });
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/dialect/sqlite/sqlite-introspector.js
var SqliteIntrospector = class {
	#db;
	constructor(db) {
		this.#db = db;
	}
	async getSchemas() {
		return [];
	}
	async getTables(options = { withInternalKyselyTables: false }) {
		return await this.#getTableMetadata(options);
	}
	#tablesQuery(qb, options) {
		let tablesQuery = qb.selectFrom("sqlite_master").where("type", "in", ["table", "view"]).where("name", "not like", "sqlite_%").select([
			"name",
			"sql",
			"type"
		]).orderBy("name");
		if (!options.withInternalKyselyTables) tablesQuery = tablesQuery.where("name", "!=", DEFAULT_MIGRATION_TABLE).where("name", "!=", DEFAULT_MIGRATION_LOCK_TABLE);
		return tablesQuery;
	}
	async #getTableMetadata(options) {
		const tablesResult = await this.#tablesQuery(this.#db, options).execute();
		const tableMetadata = await this.#db.with("table_list", (qb) => this.#tablesQuery(qb, options)).selectFrom(["table_list as tl", sql`pragma_table_info(tl.name)`.as("p")]).select([
			"tl.name as table",
			"p.cid",
			"p.name",
			"p.type",
			"p.notnull",
			"p.dflt_value",
			"p.pk"
		]).orderBy("tl.name").orderBy("p.cid").execute();
		const columnsByTable = {};
		for (const row of tableMetadata) {
			columnsByTable[row.table] ??= [];
			columnsByTable[row.table].push(row);
		}
		return tablesResult.map(({ name, sql, type }) => {
			let autoIncrementCol = sql?.split(/[\(\),]/)?.find((it) => it.toLowerCase().includes("autoincrement"))?.trimStart()?.split(/\s+/)?.[0]?.replace(/["`]/g, "");
			const columns = columnsByTable[name] ?? [];
			if (!autoIncrementCol) {
				const pkCols = columns.filter((r) => r.pk > 0);
				if (pkCols.length === 1 && pkCols[0].type.toLowerCase() === "integer") autoIncrementCol = pkCols[0].name;
			}
			return {
				name,
				isView: type === "view",
				isForeign: false,
				columns: columns.map((col) => ({
					name: col.name,
					dataType: col.type,
					isNullable: !col.notnull,
					isAutoIncrementing: col.name === autoIncrementCol,
					hasDefaultValue: col.dflt_value != null,
					comment: void 0
				}))
			};
		});
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/dialect/sqlite/sqlite-adapter.js
var SqliteAdapter = class extends DialectAdapterBase {
	get supportsMultipleConnections() {
		return false;
	}
	get supportsTransactionalDdl() {
		return false;
	}
	get supportsReturning() {
		return true;
	}
	async acquireMigrationLock(_db, _opt) {}
	async releaseMigrationLock(_db, _opt) {}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/dialect/sqlite/sqlite-dialect.js
/**
* SQLite dialect that uses the [better-sqlite3](https://github.com/JoshuaWise/better-sqlite3) library.
*
* The constructor takes an instance of {@link SqliteDialectConfig}.
*
* ```ts
* import Database from 'better-sqlite3'
*
* new SqliteDialect({
*   database: new Database('db.sqlite')
* })
* ```
*
* If you want the pool to only be created once it's first used, `database`
* can be a function:
*
* ```ts
* import Database from 'better-sqlite3'
*
* new SqliteDialect({
*   database: async () => new Database('db.sqlite')
* })
* ```
*/
var SqliteDialect = class {
	#config;
	constructor(config) {
		this.#config = freeze({ ...config });
	}
	createDriver() {
		return new SqliteDriver(this.#config);
	}
	createQueryCompiler() {
		return new SqliteQueryCompiler();
	}
	createAdapter() {
		return new SqliteAdapter();
	}
	createIntrospector(db) {
		return new SqliteIntrospector(db);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/util/stack-trace-utils.js
function extendStackTrace(err, stackError) {
	if (isStackHolder(err) && stackError.stack) {
		const stackExtension = stackError.stack.split("\n").slice(1).join("\n");
		err.stack += `\n${stackExtension}`;
		return err;
	}
	return err;
}
function isStackHolder(obj) {
	return isObject(obj) && isString(obj.stack);
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/dialect/postgres/postgres-driver.js
const PRIVATE_RELEASE_METHOD = Symbol();
var PostgresDriver = class {
	#config;
	#connections = /* @__PURE__ */ new WeakMap();
	#pool;
	constructor(config) {
		this.#config = freeze({ ...config });
	}
	async init(options) {
		this.#pool = isFunction(this.#config.pool) ? await this.#config.pool(options) : this.#config.pool;
	}
	async acquireConnection(options) {
		const client = await this.#pool.connect();
		let connection = this.#connections.get(client);
		if (!connection) {
			connection = new PostgresConnection(client, {
				controlClient: this.#config.controlClient || this.#pool.Client,
				cursor: this.#config.cursor ?? null,
				poolOptions: this.#pool.options
			});
			this.#connections.set(client, connection);
			if (this.#config.onCreateConnection) await this.#config.onCreateConnection(connection, options);
		}
		if (this.#config.onReserveConnection) await this.#config.onReserveConnection(connection, options);
		return connection;
	}
	async beginTransaction(connection, settings) {
		let sql = "begin";
		if (settings.isolationLevel || settings.accessMode) {
			sql = "start transaction";
			if (settings.isolationLevel) sql += ` isolation level ${settings.isolationLevel}`;
			if (settings.accessMode) sql += ` ${settings.accessMode}`;
		}
		await connection.executeQuery(CompiledQuery.raw(sql));
	}
	async commitTransaction(connection) {
		await connection.executeQuery(CompiledQuery.raw("commit"));
	}
	async rollbackTransaction(connection) {
		await connection.executeQuery(CompiledQuery.raw("rollback"));
	}
	async savepoint(connection, savepointName, compileQuery) {
		await connection.executeQuery(compileQuery(parseSavepointCommand("savepoint", savepointName), createQueryId()));
	}
	async rollbackToSavepoint(connection, savepointName, compileQuery) {
		await connection.executeQuery(compileQuery(parseSavepointCommand("rollback to", savepointName), createQueryId()));
	}
	async releaseSavepoint(connection, savepointName, compileQuery) {
		await connection.executeQuery(compileQuery(parseSavepointCommand("release", savepointName), createQueryId()));
	}
	async releaseConnection(connection) {
		connection[PRIVATE_RELEASE_METHOD]();
	}
	async destroy() {
		if (this.#pool) {
			const pool = this.#pool;
			this.#pool = void 0;
			await pool.end();
		}
	}
};
var PostgresConnection = class {
	#client;
	#options;
	#queryId;
	#pid;
	constructor(client, options) {
		this.#client = client;
		this.#options = options;
	}
	async cancelQuery(controlConnectionProvider) {
		return await this.#executeControlQuery(`select pg_cancel_backend(${this.#pid})`, controlConnectionProvider);
	}
	async collectSessionInfo() {
		if (this.#pid) return;
		const { processID } = this.#client;
		if (processID) this.#pid = processID;
		else {
			const { rows: [{ pid }] } = await this.#client.query("select pg_backend_pid() as pid", []);
			this.#pid = Number(pid);
		}
	}
	async executeQuery(compiledQuery) {
		try {
			this.#queryId = compiledQuery.queryId;
			const { command, rowCount, rows } = await this.#client.query(compiledQuery.sql, compiledQuery.parameters);
			return {
				numAffectedRows: command === "INSERT" || command === "UPDATE" || command === "DELETE" || command === "MERGE" ? BigInt(rowCount) : void 0,
				rows: rows ?? []
			};
		} catch (err) {
			throw extendStackTrace(err, /* @__PURE__ */ new Error());
		} finally {
			this.#queryId = void 0;
		}
	}
	async killSession(controlConnectionProvider) {
		return await this.#executeControlQuery(`select pg_terminate_backend(${this.#pid})`, controlConnectionProvider);
	}
	async *streamQuery(compiledQuery, chunkSize) {
		if (!this.#options.cursor) throw new Error("`cursor` is not present in your postgres dialect config. It's required to make streaming work in postgres.");
		this.#queryId = compiledQuery.queryId;
		const cursor = this.#client.query(new this.#options.cursor(compiledQuery.sql, compiledQuery.parameters.slice()));
		try {
			while (true) {
				const rows = await cursor.read(chunkSize);
				if (rows.length === 0) break;
				yield { rows };
			}
		} finally {
			await cursor.close();
			this.#queryId = void 0;
		}
	}
	[PRIVATE_RELEASE_METHOD]() {
		this.#client.release();
	}
	async #executeControlQuery(query, controlConnectionProvider) {
		if (!this.#queryId) return;
		const { controlClient: Client, poolOptions } = this.#options;
		const queryIdToCancel = this.#queryId;
		if (!Client) return await controlConnectionProvider(async (controlConnection) => {
			if (queryIdToCancel.queryId === this.#queryId?.queryId) await controlConnection.executeQuery(CompiledQuery.raw(query, []));
		});
		const controlClient = new Client({
			...poolOptions,
			password: "password" in poolOptions ? poolOptions.password : void 0
		});
		try {
			await controlClient.connect();
			if (queryIdToCancel.queryId !== this.#queryId.queryId) return;
			await controlClient.query(query, []);
		} finally {
			controlClient.end();
		}
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/dialect/postgres/postgres-introspector.js
var PostgresIntrospector = class {
	#db;
	constructor(db) {
		this.#db = db;
	}
	async getSchemas() {
		return (await this.#db.selectFrom("pg_catalog.pg_namespace").select("nspname").$castTo().execute()).map((it) => ({ name: it.nspname }));
	}
	async getTables(options = { withInternalKyselyTables: false }) {
		let query = this.#db.selectFrom("pg_catalog.pg_attribute as a").innerJoin("pg_catalog.pg_class as c", "a.attrelid", "c.oid").innerJoin("pg_catalog.pg_namespace as ns", "c.relnamespace", "ns.oid").innerJoin("pg_catalog.pg_type as typ", "a.atttypid", "typ.oid").innerJoin("pg_catalog.pg_namespace as dtns", "typ.typnamespace", "dtns.oid").select([
			"a.attname as column",
			"a.attnotnull as not_null",
			"a.atthasdef as has_default",
			"c.relname as table",
			"c.relkind as table_type",
			"ns.nspname as schema",
			"typ.typname as type",
			"dtns.nspname as type_schema",
			sql`col_description(a.attrelid, a.attnum)`.as("column_description"),
			sql`pg_get_serial_sequence(quote_ident(ns.nspname) || '.' || quote_ident(c.relname), a.attname)`.as("auto_incrementing")
		]).where("c.relkind", "in", [
			"r",
			"v",
			"p",
			"f"
		]).where("ns.nspname", "!~", "^pg_").where("ns.nspname", "!=", "information_schema").where("ns.nspname", "!=", "crdb_internal").where(sql`has_schema_privilege(ns.nspname, 'USAGE')`).where("a.attnum", ">=", 0).where("a.attisdropped", "!=", true).orderBy("ns.nspname").orderBy("c.relname").orderBy("a.attnum").$castTo();
		if (!options.withInternalKyselyTables) query = query.where("c.relname", "!=", DEFAULT_MIGRATION_TABLE).where("c.relname", "!=", DEFAULT_MIGRATION_LOCK_TABLE);
		const rawColumns = await query.execute();
		return this.#parseTableMetadata(rawColumns);
	}
	#parseTableMetadata(columns) {
		const tables = [];
		const schemas = /* @__PURE__ */ new Map();
		for (const column of columns) {
			let schema = schemas.get(column.schema);
			if (!schema) {
				schema = /* @__PURE__ */ new Map();
				schemas.set(column.schema, schema);
			}
			let table = schema.get(column.table);
			if (!table) {
				table = freeze({
					columns: [],
					isForeign: column.table_type === "f",
					isView: column.table_type === "v",
					name: column.table,
					schema: column.schema
				});
				schema.set(column.table, table);
				tables.push(table);
			}
			table.columns.push(freeze({
				comment: column.column_description ?? void 0,
				dataType: column.type,
				dataTypeSchema: column.type_schema,
				hasDefaultValue: column.has_default,
				isAutoIncrementing: column.auto_incrementing !== null,
				isNullable: !column.not_null,
				name: column.column
			}));
		}
		return tables;
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/dialect/postgres/postgres-query-compiler.js
const ID_WRAP_REGEX = /"/g;
var PostgresQueryCompiler = class extends DefaultQueryCompiler {
	sanitizeIdentifier(identifier) {
		return identifier.replace(ID_WRAP_REGEX, "\"\"");
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/dialect/postgres/postgres-adapter.js
const LOCK_ID = BigInt("3853314791062309107");
const LOCK_TIMEOUT_MILLISECONDS = 36e5;
var PostgresAdapter = class extends DialectAdapterBase {
	get supportsTransactionalDdl() {
		return true;
	}
	get supportsReturning() {
		return true;
	}
	async acquireMigrationLock(db, _opt) {
		await sql`
    with set_timeout as (
      select set_config('lock_timeout', '${sql.lit(LOCK_TIMEOUT_MILLISECONDS)}', true) as config_val
    )
    select pg_advisory_lock(${sql.lit(LOCK_ID)})
    from set_timeout`.execute(db);
	}
	async releaseMigrationLock(db, _opt) {
		await sql`select pg_advisory_unlock(${sql.lit(LOCK_ID)})`.execute(db);
	}
};
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/dialect/postgres/postgres-dialect.js
/**
* PostgreSQL dialect that uses the [pg](https://node-postgres.com/) library.
*
* The constructor takes an instance of {@link PostgresDialectConfig}.
*
* ```ts
* import { Pool } from 'pg'
*
* new PostgresDialect({
*   pool: new Pool({
*     database: 'some_db',
*     host: 'localhost',
*   })
* })
* ```
*
* If you want the pool to only be created once it's first used, `pool`
* can be a function:
*
* ```ts
* import { Pool } from 'pg'
*
* new PostgresDialect({
*   pool: async () => new Pool({
*     database: 'some_db',
*     host: 'localhost',
*   })
* })
* ```
*/
var PostgresDialect = class {
	#config;
	constructor(config) {
		this.#config = config;
	}
	createDriver() {
		return new PostgresDriver(this.#config);
	}
	createQueryCompiler() {
		return new PostgresQueryCompiler();
	}
	createAdapter() {
		return new PostgresAdapter();
	}
	createIntrospector(db) {
		return new PostgresIntrospector(db);
	}
};
//#endregion
//#region src/infra/sql-query-compiler.ts
const templateFragments = (fragments, _value) => fragments;
const sqliteStringSetFragments = templateFragments`(SELECT value FROM json_each(${0}))`;
const sqliteStringSetEntriesFragments = templateFragments`json_each(${0})`;
/** Lower only the shared string-set primitive; arbitrary raw SQL stays caller-owned. */
var OpenClawPostgresQueryCompiler = class extends PostgresQueryCompiler {
	visitRaw(node) {
		const values = node.sqlFragments === sqliteStringSetFragments;
		if (!values && node.sqlFragments !== sqliteStringSetEntriesFragments) {
			super.visitRaw(node);
			return;
		}
		this.append(values ? "(SELECT value FROM json_array_elements_text(" : "(SELECT ordinality - 1 AS key, value FROM json_array_elements_text(");
		this.compileList(node.parameters);
		this.append(values ? "::json) AS value)" : "::json) WITH ORDINALITY AS entries(value, ordinality))");
	}
};
var OpenClawPostgresDialect = class extends PostgresDialect {
	createQueryCompiler() {
		return new OpenClawPostgresQueryCompiler();
	}
};
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
	if (!owner) return;
	const { timing: _, ...identity } = owner;
	return identity;
}
/** Mutable diagnostic counters only; never source or write authority. */
function currentSqliteOperationTiming() {
	return readerOwners.getStore()?.timing;
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
	return {
		progress() {
			if (databaseReaders.has(token)) reader.lastProgressAtMs = Date.now();
		},
		release() {
			if (!databaseReaders.delete(token)) return;
			if (databaseReaders.size === 0 && activeReaders.byDatabase.get(database) === databaseReaders) activeReaders.byDatabase.delete(database);
			pathReaders?.delete(token);
			if (databasePath && pathReaders?.size === 0 && activeReaders.byPath.get(databasePath) === pathReaders) activeReaders.byPath.delete(databasePath);
		}
	};
}
function diagnostics(readers) {
	const now = Date.now();
	return [...readers].map(({ startedAtMs, lastProgressAtMs, ...reader }) => Object.assign(reader, {
		ageMs: Math.max(0, now - startedAtMs),
		idleMs: Math.max(0, now - lastProgressAtMs)
	})).toSorted((left, right) => right.ageMs - left.ageMs).slice(0, 8);
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
function assertNoActiveSqliteReaders(database, label) {
	const readers = diagnostics(activeReaders.byDatabase.get(database)?.values() ?? []);
	if (readers.length === 0) return;
	const oldest = readers[0];
	throw new Error(`${label} retained ${readers.length} active SQLite reader(s); oldest operation=${oldest.operation} ageMs=${oldest.ageMs}`);
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
const postgresKyselyByDatabase = /* @__PURE__ */ new WeakMap();
const compileOnlyPostgresDialect = new OpenClawPostgresDialect({ pool: async () => {
	throw new Error("getNodeSqliteKysely() returns a compile-only Kysely facade.");
} });
function getNodeSqliteKysely(db) {
	if (isPostgresSqlConnection(db)) {
		let kysely = postgresKyselyByDatabase.get(db);
		if (!kysely) {
			kysely = new Kysely({ dialect: compileOnlyPostgresDialect });
			postgresKyselyByDatabase.set(db, kysely);
		}
		return kysely;
	}
	const existing = kyselyByDatabase.get(db);
	if (existing) return existing;
	const kysely = new Kysely({ dialect: compileOnlySqliteDialect });
	kyselyByDatabase.set(db, kysely);
	return kysely;
}
/** A single bound set avoids SQLite parameter and JS variadic-call limits. */
function encodeSqliteStringSet(values) {
	return JSON.stringify(values.map((value) => value === null ? null : toUSVString(value))).replace(/\\(?:\\|u0000)/g, (escape) => escape === "\\u0000" ? "\\x00" : escape);
}
function sqliteStringSet(values) {
	return sql(sqliteStringSetFragments, encodeSqliteStringSet(values));
}
function reportNodeSqliteKyselyQueryError(db, error) {
	try {
		queryErrorHandlerByDatabase.get(db)?.(error);
	} catch {}
}
function releaseSqliteIterator(iterator, reader, failed, cleanupErrorMessage) {
	let cleanupError;
	try {
		iterator.return?.();
	} catch (error) {
		cleanupError = error;
	}
	reader.release();
	if (!failed && cleanupError !== void 0) throw toErrorObject(cleanupError, cleanupErrorMessage);
}
/** Execute a compiled Kysely query synchronously against node:sqlite. */
function executeCompiledSqliteQuerySync(db, compiledQuery, firstRowOnly = false, parameters = compiledQuery.parameters) {
	if (isPostgresSqlConnection(db)) {
		const result = db.query(compiledQuery.sql, parameters);
		const rows = firstRowOnly ? result.rows.slice(0, 1) : result.rows;
		return result.columns.length > 0 ? { rows } : {
			rows: [],
			numAffectedRows: BigInt(result.rowCount)
		};
	}
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
				releaseSqliteIterator(iterator, reader, failed, "SQLite query cleanup failed");
				if (failed) throw toErrorObject(failure, "SQLite query failed");
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
/** Cache compiled query functions or bundles by native connection. */
function createSqliteQueryCache(create) {
	const queriesByDatabase = /* @__PURE__ */ new WeakMap();
	return (database) => {
		let queries = queriesByDatabase.get(database);
		if (queries === void 0) {
			queries = create(database);
			queriesByDatabase.set(database, queries);
		}
		return queries;
	};
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
/** Compile a fixed first-row read once and bind fresh values on every execution. */
function prepareSqliteQueryTakeFirstSync(db, build) {
	const { compiled, bind } = compileSqliteQueryBindings(build);
	return (params) => executeCompiledSqliteQuerySync(db, compiled, true, bind(params)).rows[0];
}
/** Compile and lazily iterate a Kysely query synchronously against node:sqlite. */
function iterateSqliteQuerySync(db, query) {
	if (isPostgresSqlConnection(db)) return (function* () {
		yield* executeCompiledSqliteQuerySync(db, query.compile()).rows;
	})();
	const owner = captureSqliteReaderOwner();
	return (function* () {
		const compiledQuery = query.compile();
		try {
			const statement = db.prepare(compiledQuery.sql);
			if (!SelectQueryNode.is(compiledQuery.query) && statement.columns().length === 0) return;
			const parameters = compiledQuery.parameters;
			const iterator = statement.iterate(...parameters);
			const reader = retainSqliteReader(db, "kysely iterator", owner);
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
				releaseSqliteIterator(iterator, reader, failed, "SQLite iterator cleanup failed");
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
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/internal/constants.js
var require_constants = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		MAX_LENGTH: 256,
		MAX_SAFE_COMPONENT_LENGTH: 16,
		MAX_SAFE_BUILD_LENGTH: 250,
		MAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER || 
		/* istanbul ignore next */ 9007199254740991,
		RELEASE_TYPES: [
			"major",
			"premajor",
			"minor",
			"preminor",
			"patch",
			"prepatch",
			"prerelease"
		],
		SEMVER_SPEC_VERSION: "2.0.0",
		FLAG_INCLUDE_PRERELEASE: 1,
		FLAG_LOOSE: 2
	};
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/internal/debug.js
var require_debug = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {};
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/internal/re.js
var require_re = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { MAX_SAFE_COMPONENT_LENGTH, MAX_SAFE_BUILD_LENGTH, MAX_LENGTH } = require_constants();
	const debug = require_debug();
	exports = module.exports = {};
	const re = exports.re = [];
	const safeRe = exports.safeRe = [];
	const src = exports.src = [];
	const safeSrc = exports.safeSrc = [];
	const t = exports.t = {};
	let R = 0;
	const LETTERDASHNUMBER = "[a-zA-Z0-9-]";
	const safeRegexReplacements = [
		["\\s", 1],
		["\\d", MAX_LENGTH],
		[LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
	];
	const makeSafeRegex = (value) => {
		for (const [token, max] of safeRegexReplacements) value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
		return value;
	};
	const createToken = (name, value, isGlobal) => {
		const safe = makeSafeRegex(value);
		const index = R++;
		debug(name, index, value);
		t[name] = index;
		src[index] = value;
		safeSrc[index] = safe;
		re[index] = new RegExp(value, isGlobal ? "g" : void 0);
		safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
	};
	createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
	createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
	createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
	createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`);
	createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`);
	createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIER]})`);
	createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIERLOOSE]})`);
	createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
	createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
	createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
	createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
	createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
	createToken("FULL", `^${src[t.FULLPLAIN]}$`);
	createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
	createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
	createToken("GTLT", "((?:<|>)?=?)");
	createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
	createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
	createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`);
	createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`);
	createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
	createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
	createToken("COERCEPLAIN", `(^|[^\\d])(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
	createToken("COERCE", `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
	createToken("COERCEFULL", src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?(?:${src[t.BUILD]})?(?:$|[^\\d])`);
	createToken("COERCERTL", src[t.COERCE], true);
	createToken("COERCERTLFULL", src[t.COERCEFULL], true);
	createToken("LONETILDE", "(?:~>?)");
	createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
	exports.tildeTrimReplace = "$1~";
	createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
	createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
	createToken("LONECARET", "(?:\\^)");
	createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
	exports.caretTrimReplace = "$1^";
	createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
	createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
	createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
	createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
	createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
	exports.comparatorTrimReplace = "$1$2$3";
	createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
	createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`);
	createToken("STAR", "(<|>)?=?\\s*\\*");
	createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
	createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/internal/parse-options.js
var require_parse_options = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const looseOption = Object.freeze({ loose: true });
	const emptyOpts = Object.freeze({});
	const parseOptions = (options) => {
		if (!options) return emptyOpts;
		if (typeof options !== "object") return looseOption;
		return options;
	};
	module.exports = parseOptions;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/internal/identifiers.js
var require_identifiers = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const numeric = /^[0-9]+$/;
	const compareIdentifiers = (a, b) => {
		if (typeof a === "number" && typeof b === "number") return a === b ? 0 : a < b ? -1 : 1;
		const anum = numeric.test(a);
		const bnum = numeric.test(b);
		if (anum && bnum) {
			a = +a;
			b = +b;
		}
		return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
	};
	const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
	module.exports = {
		compareIdentifiers,
		rcompareIdentifiers
	};
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/classes/semver.js
var require_semver$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const debug = require_debug();
	const { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
	const { safeRe: re, t } = require_re();
	const parseOptions = require_parse_options();
	const { compareIdentifiers } = require_identifiers();
	const isPrereleaseIdentifier = (prerelease, identifier) => {
		const identifiers = identifier.split(".");
		if (identifiers.length > prerelease.length) return false;
		for (let i = 0; i < identifiers.length; i++) if (compareIdentifiers(prerelease[i], identifiers[i]) !== 0) return false;
		return true;
	};
	module.exports = class SemVer {
		constructor(version, options) {
			options = parseOptions(options);
			if (version instanceof SemVer) {
				if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) return version;
				else version = version.version;
			} else if (typeof version !== "string") throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
			if (version.length > MAX_LENGTH) throw new TypeError(`version is longer than ${MAX_LENGTH} characters`);
			debug("SemVer", version, options);
			this.options = options;
			this.loose = !!options.loose;
			this.includePrerelease = !!options.includePrerelease;
			const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
			if (!m) throw new TypeError(`Invalid Version: ${version}`);
			this.raw = version;
			this.major = +m[1];
			this.minor = +m[2];
			this.patch = +m[3];
			if (this.major > MAX_SAFE_INTEGER || this.major < 0) throw new TypeError("Invalid major version");
			if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) throw new TypeError("Invalid minor version");
			if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) throw new TypeError("Invalid patch version");
			if (!m[4]) this.prerelease = [];
			else this.prerelease = m[4].split(".").map((id) => {
				if (/^[0-9]+$/.test(id)) {
					const num = +id;
					if (num >= 0 && num < MAX_SAFE_INTEGER) return num;
				}
				return id;
			});
			this.build = m[5] ? m[5].split(".") : [];
			this.format();
		}
		format() {
			this.version = `${this.major}.${this.minor}.${this.patch}`;
			if (this.prerelease.length) this.version += `-${this.prerelease.join(".")}`;
			return this.version;
		}
		toString() {
			return this.version;
		}
		compare(other) {
			debug("SemVer.compare", this.version, this.options, other);
			if (!(other instanceof SemVer)) {
				if (typeof other === "string" && other === this.version) return 0;
				other = new SemVer(other, this.options);
			}
			if (other.version === this.version) return 0;
			return this.compareMain(other) || this.comparePre(other);
		}
		compareMain(other) {
			if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
			if (this.major < other.major) return -1;
			if (this.major > other.major) return 1;
			if (this.minor < other.minor) return -1;
			if (this.minor > other.minor) return 1;
			if (this.patch < other.patch) return -1;
			if (this.patch > other.patch) return 1;
			return 0;
		}
		comparePre(other) {
			if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
			if (this.prerelease.length && !other.prerelease.length) return -1;
			else if (!this.prerelease.length && other.prerelease.length) return 1;
			else if (!this.prerelease.length && !other.prerelease.length) return 0;
			let i = 0;
			do {
				const a = this.prerelease[i];
				const b = other.prerelease[i];
				debug("prerelease compare", i, a, b);
				if (a === void 0 && b === void 0) return 0;
				else if (b === void 0) return 1;
				else if (a === void 0) return -1;
				else if (a === b) continue;
				else return compareIdentifiers(a, b);
			} while (++i);
		}
		compareBuild(other) {
			if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
			let i = 0;
			do {
				const a = this.build[i];
				const b = other.build[i];
				debug("build compare", i, a, b);
				if (a === void 0 && b === void 0) return 0;
				else if (b === void 0) return 1;
				else if (a === void 0) return -1;
				else if (a === b) continue;
				else return compareIdentifiers(a, b);
			} while (++i);
		}
		inc(release, identifier, identifierBase) {
			if (release.startsWith("pre")) {
				if (!identifier && identifierBase === false) throw new Error("invalid increment argument: identifier is empty");
				if (identifier) {
					const match = `-${identifier}`.match(this.options.loose ? re[t.PRERELEASELOOSE] : re[t.PRERELEASE]);
					if (!match || match[1] !== identifier) throw new Error(`invalid identifier: ${identifier}`);
				}
			}
			switch (release) {
				case "premajor":
					this.prerelease.length = 0;
					this.patch = 0;
					this.minor = 0;
					this.major++;
					this.inc("pre", identifier, identifierBase);
					break;
				case "preminor":
					this.prerelease.length = 0;
					this.patch = 0;
					this.minor++;
					this.inc("pre", identifier, identifierBase);
					break;
				case "prepatch":
					this.prerelease.length = 0;
					this.inc("patch", identifier, identifierBase);
					this.inc("pre", identifier, identifierBase);
					break;
				case "prerelease":
					if (this.prerelease.length === 0) this.inc("patch", identifier, identifierBase);
					this.inc("pre", identifier, identifierBase);
					break;
				case "release":
					if (this.prerelease.length === 0) throw new Error(`version ${this.raw} is not a prerelease`);
					this.prerelease.length = 0;
					break;
				case "major":
					if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) this.major++;
					this.minor = 0;
					this.patch = 0;
					this.prerelease = [];
					break;
				case "minor":
					if (this.patch !== 0 || this.prerelease.length === 0) this.minor++;
					this.patch = 0;
					this.prerelease = [];
					break;
				case "patch":
					if (this.prerelease.length === 0) this.patch++;
					this.prerelease = [];
					break;
				case "pre": {
					const base = Number(identifierBase) ? 1 : 0;
					if (this.prerelease.length === 0) this.prerelease = [base];
					else {
						let i = this.prerelease.length;
						while (--i >= 0) if (typeof this.prerelease[i] === "number") {
							this.prerelease[i]++;
							i = -2;
						}
						if (i === -1) {
							if (identifier === this.prerelease.join(".") && identifierBase === false) throw new Error("invalid increment argument: identifier already exists");
							this.prerelease.push(base);
						}
					}
					if (identifier) {
						let prerelease = [identifier, base];
						if (identifierBase === false) prerelease = [identifier];
						if (isPrereleaseIdentifier(this.prerelease, identifier)) {
							const prereleaseBase = this.prerelease[identifier.split(".").length];
							if (isNaN(prereleaseBase)) this.prerelease = prerelease;
						} else this.prerelease = prerelease;
					}
					break;
				}
				default: throw new Error(`invalid increment argument: ${release}`);
			}
			this.raw = this.format();
			if (this.build.length) this.raw += `+${this.build.join(".")}`;
			return this;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/parse.js
var require_parse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const parse = (version, options, throwErrors = false) => {
		if (version instanceof SemVer) return version;
		try {
			return new SemVer(version, options);
		} catch (er) {
			if (!throwErrors) return null;
			throw er;
		}
	};
	module.exports = parse;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/valid.js
var require_valid$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const parse = require_parse();
	const valid = (version, options) => {
		const v = parse(version, options);
		return v ? v.version : null;
	};
	module.exports = valid;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/clean.js
var require_clean = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const parse = require_parse();
	const clean = (version, options) => {
		const s = parse(version.trim().replace(/^[=v]+/, ""), options);
		return s ? s.version : null;
	};
	module.exports = clean;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/inc.js
var require_inc = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const inc = (version, release, options, identifier, identifierBase) => {
		if (typeof options === "string") {
			identifierBase = identifier;
			identifier = options;
			options = void 0;
		}
		try {
			return new SemVer(version instanceof SemVer ? version.version : version, options).inc(release, identifier, identifierBase).version;
		} catch (er) {
			return null;
		}
	};
	module.exports = inc;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/diff.js
var require_diff = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const parse = require_parse();
	const diff = (version1, version2) => {
		const v1 = parse(version1, null, true);
		const v2 = parse(version2, null, true);
		const comparison = v1.compare(v2);
		if (comparison === 0) return null;
		const v1Higher = comparison > 0;
		const highVersion = v1Higher ? v1 : v2;
		const lowVersion = v1Higher ? v2 : v1;
		const highHasPre = !!highVersion.prerelease.length;
		if (!!lowVersion.prerelease.length && !highHasPre) {
			if (!lowVersion.patch && !lowVersion.minor) return "major";
			if (lowVersion.compareMain(highVersion) === 0) {
				if (lowVersion.minor && !lowVersion.patch) return "minor";
				return "patch";
			}
		}
		const prefix = highHasPre ? "pre" : "";
		if (v1.major !== v2.major) return prefix + "major";
		if (v1.minor !== v2.minor) return prefix + "minor";
		if (v1.patch !== v2.patch) return prefix + "patch";
		return "prerelease";
	};
	module.exports = diff;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/major.js
var require_major = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const major = (a, loose) => new SemVer(a, loose).major;
	module.exports = major;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/minor.js
var require_minor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const minor = (a, loose) => new SemVer(a, loose).minor;
	module.exports = minor;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/patch.js
var require_patch = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const patch = (a, loose) => new SemVer(a, loose).patch;
	module.exports = patch;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/prerelease.js
var require_prerelease = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const parse = require_parse();
	const prerelease = (version, options) => {
		const parsed = parse(version, options);
		return parsed && parsed.prerelease.length ? parsed.prerelease : null;
	};
	module.exports = prerelease;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/compare.js
var require_compare = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const compare = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
	module.exports = compare;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/rcompare.js
var require_rcompare = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const rcompare = (a, b, loose) => compare(b, a, loose);
	module.exports = rcompare;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/compare-loose.js
var require_compare_loose = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const compareLoose = (a, b) => compare(a, b, true);
	module.exports = compareLoose;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/compare-build.js
var require_compare_build = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const compareBuild = (a, b, loose) => {
		const versionA = new SemVer(a, loose);
		const versionB = new SemVer(b, loose);
		return versionA.compare(versionB) || versionA.compareBuild(versionB);
	};
	module.exports = compareBuild;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/sort.js
var require_sort = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compareBuild = require_compare_build();
	const sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose));
	module.exports = sort;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/rsort.js
var require_rsort = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compareBuild = require_compare_build();
	const rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose));
	module.exports = rsort;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/gt.js
var require_gt = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const gt = (a, b, loose) => compare(a, b, loose) > 0;
	module.exports = gt;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/lt.js
var require_lt = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const lt = (a, b, loose) => compare(a, b, loose) < 0;
	module.exports = lt;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/eq.js
var require_eq = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const eq = (a, b, loose) => compare(a, b, loose) === 0;
	module.exports = eq;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/neq.js
var require_neq = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const neq = (a, b, loose) => compare(a, b, loose) !== 0;
	module.exports = neq;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/gte.js
var require_gte = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const gte = (a, b, loose) => compare(a, b, loose) >= 0;
	module.exports = gte;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/lte.js
var require_lte = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const lte = (a, b, loose) => compare(a, b, loose) <= 0;
	module.exports = lte;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/cmp.js
var require_cmp = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const eq = require_eq();
	const neq = require_neq();
	const gt = require_gt();
	const gte = require_gte();
	const lt = require_lt();
	const lte = require_lte();
	const cmp = (a, op, b, loose) => {
		switch (op) {
			case "===":
				if (typeof a === "object") a = a.version;
				if (typeof b === "object") b = b.version;
				return a === b;
			case "!==":
				if (typeof a === "object") a = a.version;
				if (typeof b === "object") b = b.version;
				return a !== b;
			case "":
			case "=":
			case "==": return eq(a, b, loose);
			case "!=": return neq(a, b, loose);
			case ">": return gt(a, b, loose);
			case ">=": return gte(a, b, loose);
			case "<": return lt(a, b, loose);
			case "<=": return lte(a, b, loose);
			default: throw new TypeError(`Invalid operator: ${op}`);
		}
	};
	module.exports = cmp;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/coerce.js
var require_coerce = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const parse = require_parse();
	const { safeRe: re, t } = require_re();
	const coerce = (version, options) => {
		if (version instanceof SemVer) return version;
		if (typeof version === "number") version = String(version);
		if (typeof version !== "string") return null;
		options = options || {};
		let match = null;
		if (!options.rtl) match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
		else {
			const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
			let next;
			while ((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)) {
				if (!match || next.index + next[0].length !== match.index + match[0].length) match = next;
				coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
			}
			coerceRtlRegex.lastIndex = -1;
		}
		if (match === null) return null;
		const major = match[2];
		const minor = match[3] || "0";
		const patch = match[4] || "0";
		const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : "";
		const build = options.includePrerelease && match[6] ? `+${match[6]}` : "";
		return parse(`${major}.${minor}.${patch}${prerelease}${build}`, options);
	};
	module.exports = coerce;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/truncate.js
var require_truncate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const parse = require_parse();
	const constants = require_constants();
	const SemVer = require_semver$1();
	const truncate = (version, truncation, options) => {
		if (!constants.RELEASE_TYPES.includes(truncation)) return null;
		const clonedVersion = cloneInputVersion(version, options);
		return clonedVersion && doTruncation(clonedVersion, truncation);
	};
	const cloneInputVersion = (version, options) => {
		const versionStringToParse = version instanceof SemVer ? version.version : version;
		return parse(versionStringToParse, options);
	};
	const doTruncation = (version, truncation) => {
		if (isPrerelease(truncation)) return version.version;
		version.prerelease = [];
		switch (truncation) {
			case "major":
				version.minor = 0;
				version.patch = 0;
				break;
			case "minor": version.patch = 0;
		}
		return version.format();
	};
	const isPrerelease = (type) => {
		return type.startsWith("pre");
	};
	module.exports = truncate;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/internal/lrucache.js
var require_lrucache = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var LRUCache = class {
		constructor() {
			this.max = 1e3;
			this.map = /* @__PURE__ */ new Map();
		}
		get(key) {
			const value = this.map.get(key);
			if (value === void 0) return;
			else {
				this.map.delete(key);
				this.map.set(key, value);
				return value;
			}
		}
		delete(key) {
			return this.map.delete(key);
		}
		set(key, value) {
			if (!this.delete(key) && value !== void 0) {
				if (this.map.size >= this.max) {
					const firstKey = this.map.keys().next().value;
					this.delete(firstKey);
				}
				this.map.set(key, value);
			}
			return this;
		}
	};
	module.exports = LRUCache;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/classes/range.js
var require_range = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SPACE_CHARACTERS = /\s+/g;
	module.exports = class Range {
		constructor(range, options) {
			options = parseOptions(options);
			if (range instanceof Range) {
				if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) return range;
				else return new Range(range.raw, options);
			}
			if (range instanceof Comparator) {
				this.raw = range.value;
				this.set = [[range]];
				this.formatted = void 0;
				return this;
			}
			this.options = options;
			this.loose = !!options.loose;
			this.includePrerelease = !!options.includePrerelease;
			this.raw = range.trim().replace(SPACE_CHARACTERS, " ");
			this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
			if (!this.set.length) throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
			if (this.set.length > 1) {
				const first = this.set[0];
				this.set = this.set.filter((c) => !isNullSet(c[0]));
				if (this.set.length === 0) this.set = [first];
				else if (this.set.length > 1) {
					for (const c of this.set) if (c.length === 1 && isAny(c[0])) {
						this.set = [c];
						break;
					}
				}
			}
			this.formatted = void 0;
		}
		get range() {
			if (this.formatted === void 0) {
				this.formatted = "";
				for (let i = 0; i < this.set.length; i++) {
					if (i > 0) this.formatted += "||";
					const comps = this.set[i];
					for (let k = 0; k < comps.length; k++) {
						if (k > 0) this.formatted += " ";
						this.formatted += comps[k].toString().trim();
					}
				}
			}
			return this.formatted;
		}
		format() {
			return this.range;
		}
		toString() {
			return this.range;
		}
		parseRange(range) {
			range = range.replace(BUILDSTRIPRE, "");
			const memoKey = ((this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE)) + ":" + range;
			const cached = cache.get(memoKey);
			if (cached) return cached;
			const loose = this.options.loose;
			const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
			range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
			debug("hyphen replace", range);
			range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
			debug("comparator trim", range);
			range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
			debug("tilde trim", range);
			range = range.replace(re[t.CARETTRIM], caretTrimReplace);
			debug("caret trim", range);
			let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
			if (loose) rangeList = rangeList.filter((comp) => {
				debug("loose invalid filter", comp, this.options);
				return !!comp.match(re[t.COMPARATORLOOSE]);
			});
			debug("range list", rangeList);
			const rangeMap = /* @__PURE__ */ new Map();
			const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
			for (const comp of comparators) {
				if (isNullSet(comp)) return [comp];
				rangeMap.set(comp.value, comp);
			}
			if (rangeMap.size > 1 && rangeMap.has("")) rangeMap.delete("");
			const result = [...rangeMap.values()];
			cache.set(memoKey, result);
			return result;
		}
		intersects(range, options) {
			if (!(range instanceof Range)) throw new TypeError("a Range is required");
			return this.set.some((thisComparators) => {
				return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators) => {
					return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
						return rangeComparators.every((rangeComparator) => {
							return thisComparator.intersects(rangeComparator, options);
						});
					});
				});
			});
		}
		test(version) {
			if (!version) return false;
			if (typeof version === "string") try {
				version = new SemVer(version, this.options);
			} catch (er) {
				return false;
			}
			for (let i = 0; i < this.set.length; i++) if (testSet(this.set[i], version, this.options)) return true;
			return false;
		}
	};
	const cache = new (require_lrucache())();
	const parseOptions = require_parse_options();
	const Comparator = require_comparator();
	const debug = require_debug();
	const SemVer = require_semver$1();
	const { safeRe: re, src, t, comparatorTrimReplace, tildeTrimReplace, caretTrimReplace } = require_re();
	const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require_constants();
	const BUILDSTRIPRE = new RegExp(src[t.BUILD], "g");
	const isNullSet = (c) => c.value === "<0.0.0-0";
	const isAny = (c) => c.value === "";
	const isSatisfiable = (comparators, options) => {
		let result = true;
		const remainingComparators = comparators.slice();
		let testComparator = remainingComparators.pop();
		while (result && remainingComparators.length) {
			result = remainingComparators.every((otherComparator) => {
				return testComparator.intersects(otherComparator, options);
			});
			testComparator = remainingComparators.pop();
		}
		return result;
	};
	const parseComparator = (comp, options) => {
		comp = comp.replace(re[t.BUILD], "");
		debug("comp", comp, options);
		comp = replaceCarets(comp, options);
		debug("caret", comp);
		comp = replaceTildes(comp, options);
		debug("tildes", comp);
		comp = replaceXRanges(comp, options);
		debug("xrange", comp);
		comp = replaceStars(comp, options);
		debug("stars", comp);
		return comp;
	};
	const isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
	const invalidXRangeOrder = (M, m, p) => isX(M) && !isX(m) || isX(m) && p && !isX(p);
	const replaceTildes = (comp, options) => {
		return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
	};
	const replaceTilde = (comp, options) => {
		const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
		const z = options.includePrerelease ? "-0" : "";
		return comp.replace(r, (_, M, m, p, pr) => {
			debug("tilde", comp, _, M, m, p, pr);
			let ret;
			if (isX(M)) ret = "";
			else if (isX(m)) ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
			else if (isX(p)) ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
			else if (pr) {
				debug("replaceTilde pr", pr);
				ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
			} else ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
			debug("tilde return", ret);
			return ret;
		});
	};
	const replaceCarets = (comp, options) => {
		return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
	};
	const replaceCaret = (comp, options) => {
		debug("caret", comp, options);
		const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
		const z = options.includePrerelease ? "-0" : "";
		return comp.replace(r, (_, M, m, p, pr) => {
			debug("caret", comp, _, M, m, p, pr);
			let ret;
			if (isX(M)) ret = "";
			else if (isX(m)) ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
			else if (isX(p)) {
				if (M === "0") ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
				else ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
			} else if (pr) {
				debug("replaceCaret pr", pr);
				if (M === "0") {
					if (m === "0") ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
					else ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
				} else ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
			} else {
				debug("no pr");
				if (M === "0") {
					if (m === "0") ret = `>=${M}.${m}.${p} <${M}.${m}.${+p + 1}-0`;
					else ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
				} else ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
			}
			debug("caret return", ret);
			return ret;
		});
	};
	const replaceXRanges = (comp, options) => {
		debug("replaceXRanges", comp, options);
		return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
	};
	const replaceXRange = (comp, options) => {
		comp = comp.trim();
		const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
		return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
			debug("xRange", comp, ret, gtlt, M, m, p, pr);
			if (invalidXRangeOrder(M, m, p)) return comp;
			const xM = isX(M);
			const xm = xM || isX(m);
			const xp = xm || isX(p);
			const anyX = xp;
			if (gtlt === "=" && anyX) gtlt = "";
			pr = options.includePrerelease ? "-0" : "";
			if (xM) {
				if (gtlt === ">" || gtlt === "<") ret = "<0.0.0-0";
				else ret = "*";
			} else if (gtlt && anyX) {
				if (xm) m = 0;
				p = 0;
				if (gtlt === ">") {
					gtlt = ">=";
					if (xm) {
						M = +M + 1;
						m = 0;
						p = 0;
					} else {
						m = +m + 1;
						p = 0;
					}
				} else if (gtlt === "<=") {
					gtlt = "<";
					if (xm) M = +M + 1;
					else m = +m + 1;
				}
				if (gtlt === "<") pr = "-0";
				ret = `${gtlt + M}.${m}.${p}${pr}`;
			} else if (xm) ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
			else if (xp) ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
			debug("xRange return", ret);
			return ret;
		});
	};
	const replaceStars = (comp, options) => {
		debug("replaceStars", comp, options);
		return comp.trim().replace(re[t.STAR], "");
	};
	const replaceGTE0 = (comp, options) => {
		debug("replaceGTE0", comp, options);
		return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
	};
	const hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
		if (isX(fM)) from = "";
		else if (isX(fm)) from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
		else if (isX(fp)) from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
		else if (fpr) from = `>=${from}`;
		else from = `>=${from}${incPr ? "-0" : ""}`;
		if (isX(tM)) to = "";
		else if (isX(tm)) to = `<${+tM + 1}.0.0-0`;
		else if (isX(tp)) to = `<${tM}.${+tm + 1}.0-0`;
		else if (tpr) to = `<=${tM}.${tm}.${tp}-${tpr}`;
		else if (incPr) to = `<${tM}.${tm}.${+tp + 1}-0`;
		else to = `<=${to}`;
		return `${from} ${to}`.trim();
	};
	const testSet = (set, version, options) => {
		for (let i = 0; i < set.length; i++) if (!set[i].test(version)) return false;
		if (version.prerelease.length && !options.includePrerelease) {
			for (let i = 0; i < set.length; i++) {
				debug(set[i].semver);
				if (set[i].semver === Comparator.ANY) continue;
				if (set[i].semver.prerelease.length > 0) {
					const allowed = set[i].semver;
					if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) return true;
				}
			}
			return false;
		}
		return true;
	};
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/classes/comparator.js
var require_comparator = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const ANY = Symbol("SemVer ANY");
	module.exports = class Comparator {
		static get ANY() {
			return ANY;
		}
		constructor(comp, options) {
			options = parseOptions(options);
			if (comp instanceof Comparator) {
				if (comp.loose === !!options.loose) return comp;
				else comp = comp.value;
			}
			comp = comp.trim().split(/\s+/).join(" ");
			debug("comparator", comp, options);
			this.options = options;
			this.loose = !!options.loose;
			this.parse(comp);
			if (this.semver === ANY) this.value = "";
			else this.value = this.operator + this.semver.version;
			debug("comp", this);
		}
		parse(comp) {
			const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
			const m = comp.match(r);
			if (!m) throw new TypeError(`Invalid comparator: ${comp}`);
			this.operator = m[1] !== void 0 ? m[1] : "";
			if (this.operator === "=") this.operator = "";
			if (!m[2]) this.semver = ANY;
			else this.semver = new SemVer(m[2], this.options.loose);
		}
		toString() {
			return this.value;
		}
		test(version) {
			debug("Comparator.test", version, this.options.loose);
			if (this.semver === ANY || version === ANY) return true;
			if (typeof version === "string") try {
				version = new SemVer(version, this.options);
			} catch (er) {
				return false;
			}
			return cmp(version, this.operator, this.semver, this.options);
		}
		intersects(comp, options) {
			if (!(comp instanceof Comparator)) throw new TypeError("a Comparator is required");
			if (this.operator === "") {
				if (this.value === "") return true;
				return new Range(comp.value, options).test(this.value);
			} else if (comp.operator === "") {
				if (comp.value === "") return true;
				return new Range(this.value, options).test(comp.semver);
			}
			options = parseOptions(options);
			if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) return false;
			if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) return false;
			if (this.operator.startsWith(">") && comp.operator.startsWith(">")) return true;
			if (this.operator.startsWith("<") && comp.operator.startsWith("<")) return true;
			if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) return true;
			if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) return true;
			if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) return true;
			return false;
		}
	};
	const parseOptions = require_parse_options();
	const { safeRe: re, t } = require_re();
	const cmp = require_cmp();
	const debug = require_debug();
	const SemVer = require_semver$1();
	const Range = require_range();
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/satisfies.js
var require_satisfies = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Range = require_range();
	const satisfies = (version, range, options) => {
		try {
			range = new Range(range, options);
		} catch (er) {
			return false;
		}
		return range.test(version);
	};
	module.exports = satisfies;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/ranges/to-comparators.js
var require_to_comparators = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Range = require_range();
	const toComparators = (range, options) => new Range(range, options).set.map((comp) => comp.map((c) => c.value).join(" ").trim().split(" "));
	module.exports = toComparators;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/ranges/max-satisfying.js
var require_max_satisfying = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const Range = require_range();
	const maxSatisfying = (versions, range, options) => {
		let max = null;
		let maxSV = null;
		let rangeObj = null;
		try {
			rangeObj = new Range(range, options);
		} catch (er) {
			return null;
		}
		versions.forEach((v) => {
			if (rangeObj.test(v)) {
				if (!max || maxSV.compare(v) === -1) {
					max = v;
					maxSV = new SemVer(max, options);
				}
			}
		});
		return max;
	};
	module.exports = maxSatisfying;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/ranges/min-satisfying.js
var require_min_satisfying = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const Range = require_range();
	const minSatisfying = (versions, range, options) => {
		let min = null;
		let minSV = null;
		let rangeObj = null;
		try {
			rangeObj = new Range(range, options);
		} catch (er) {
			return null;
		}
		versions.forEach((v) => {
			if (rangeObj.test(v)) {
				if (!min || minSV.compare(v) === 1) {
					min = v;
					minSV = new SemVer(min, options);
				}
			}
		});
		return min;
	};
	module.exports = minSatisfying;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/ranges/min-version.js
var require_min_version = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const Range = require_range();
	const gt = require_gt();
	const minVersion = (range, loose) => {
		range = new Range(range, loose);
		let minver = new SemVer("0.0.0");
		if (range.test(minver)) return minver;
		minver = new SemVer("0.0.0-0");
		if (range.test(minver)) return minver;
		minver = null;
		for (let i = 0; i < range.set.length; ++i) {
			const comparators = range.set[i];
			let setMin = null;
			comparators.forEach((comparator) => {
				const compver = new SemVer(comparator.semver.version);
				switch (comparator.operator) {
					case ">":
						if (compver.prerelease.length === 0) compver.patch++;
						else compver.prerelease.push(0);
						compver.raw = compver.format();
					case "":
					case ">=":
						if (!setMin || gt(compver, setMin)) setMin = compver;
						break;
					case "<":
					case "<=": break;
					/* istanbul ignore next */
					default: throw new Error(`Unexpected operation: ${comparator.operator}`);
				}
			});
			if (setMin && (!minver || gt(minver, setMin))) minver = setMin;
		}
		if (minver && range.test(minver)) return minver;
		return null;
	};
	module.exports = minVersion;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/ranges/valid.js
var require_valid = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Range = require_range();
	const validRange = (range, options) => {
		try {
			return new Range(range, options).range || "*";
		} catch (er) {
			return null;
		}
	};
	module.exports = validRange;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/ranges/outside.js
var require_outside = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const Comparator = require_comparator();
	const { ANY } = Comparator;
	const Range = require_range();
	const satisfies = require_satisfies();
	const gt = require_gt();
	const lt = require_lt();
	const lte = require_lte();
	const gte = require_gte();
	const outside = (version, range, hilo, options) => {
		version = new SemVer(version, options);
		range = new Range(range, options);
		let gtfn, ltefn, ltfn, comp, ecomp;
		switch (hilo) {
			case ">":
				gtfn = gt;
				ltefn = lte;
				ltfn = lt;
				comp = ">";
				ecomp = ">=";
				break;
			case "<":
				gtfn = lt;
				ltefn = gte;
				ltfn = gt;
				comp = "<";
				ecomp = "<=";
				break;
			default: throw new TypeError("Must provide a hilo val of \"<\" or \">\"");
		}
		if (satisfies(version, range, options)) return false;
		for (let i = 0; i < range.set.length; ++i) {
			const comparators = range.set[i];
			let high = null;
			let low = null;
			comparators.forEach((comparator) => {
				if (comparator.semver === ANY) comparator = new Comparator(">=0.0.0");
				high = high || comparator;
				low = low || comparator;
				if (gtfn(comparator.semver, high.semver, options)) high = comparator;
				else if (ltfn(comparator.semver, low.semver, options)) low = comparator;
			});
			if (high.operator === comp || high.operator === ecomp) return false;
			if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) return false;
			else if (low.operator === ecomp && ltfn(version, low.semver)) return false;
		}
		return true;
	};
	module.exports = outside;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/ranges/gtr.js
var require_gtr = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const outside = require_outside();
	const gtr = (version, range, options) => outside(version, range, ">", options);
	module.exports = gtr;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/ranges/ltr.js
var require_ltr = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const outside = require_outside();
	const ltr = (version, range, options) => outside(version, range, "<", options);
	module.exports = ltr;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/ranges/intersects.js
var require_intersects = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Range = require_range();
	const intersects = (r1, r2, options) => {
		r1 = new Range(r1, options);
		r2 = new Range(r2, options);
		return r1.intersects(r2, options);
	};
	module.exports = intersects;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/ranges/simplify.js
var require_simplify = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const satisfies = require_satisfies();
	const compare = require_compare();
	module.exports = (versions, range, options) => {
		const set = [];
		let first = null;
		let prev = null;
		const v = versions.sort((a, b) => compare(a, b, options));
		for (const version of v) if (satisfies(version, range, options)) {
			prev = version;
			if (!first) first = version;
		} else {
			if (prev) set.push([first, prev]);
			prev = null;
			first = null;
		}
		if (first) set.push([first, null]);
		const ranges = [];
		for (const [min, max] of set) if (min === max) ranges.push(min);
		else if (!max && min === v[0]) ranges.push("*");
		else if (!max) ranges.push(`>=${min}`);
		else if (min === v[0]) ranges.push(`<=${max}`);
		else ranges.push(`${min} - ${max}`);
		const simplified = ranges.join(" || ");
		const original = typeof range.raw === "string" ? range.raw : String(range);
		return simplified.length < original.length ? simplified : range;
	};
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/ranges/subset.js
var require_subset = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Range = require_range();
	const Comparator = require_comparator();
	const { ANY } = Comparator;
	const satisfies = require_satisfies();
	const compare = require_compare();
	const subset = (sub, dom, options = {}) => {
		if (sub === dom) return true;
		sub = new Range(sub, options);
		dom = new Range(dom, options);
		let sawNonNull = false;
		OUTER: for (const simpleSub of sub.set) {
			for (const simpleDom of dom.set) {
				const isSub = simpleSubset(simpleSub, simpleDom, options);
				sawNonNull = sawNonNull || isSub !== null;
				if (isSub) continue OUTER;
			}
			if (sawNonNull) return false;
		}
		return true;
	};
	const minimumVersionWithPreRelease = [new Comparator(">=0.0.0-0")];
	const minimumVersion = [new Comparator(">=0.0.0")];
	const simpleSubset = (sub, dom, options) => {
		if (sub === dom) return true;
		if (sub.length === 1 && sub[0].semver === ANY) {
			if (dom.length === 1 && dom[0].semver === ANY) return true;
			else if (options.includePrerelease) sub = minimumVersionWithPreRelease;
			else sub = minimumVersion;
		}
		if (dom.length === 1 && dom[0].semver === ANY) {
			if (options.includePrerelease) return true;
			else dom = minimumVersion;
		}
		const eqSet = /* @__PURE__ */ new Set();
		let gt, lt;
		for (const c of sub) if (c.operator === ">" || c.operator === ">=") gt = higherGT(gt, c, options);
		else if (c.operator === "<" || c.operator === "<=") lt = lowerLT(lt, c, options);
		else eqSet.add(c.semver);
		if (eqSet.size > 1) return null;
		let gtltComp;
		if (gt && lt) {
			gtltComp = compare(gt.semver, lt.semver, options);
			if (gtltComp > 0) return null;
			else if (gtltComp === 0 && (gt.operator !== ">=" || lt.operator !== "<=")) return null;
		}
		for (const eq of eqSet) {
			if (gt && !satisfies(eq, String(gt), options)) return null;
			if (lt && !satisfies(eq, String(lt), options)) return null;
			for (const c of dom) if (!satisfies(eq, String(c), options)) return false;
			return true;
		}
		let higher, lower;
		let hasDomLT, hasDomGT;
		let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
		let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
		if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === "<" && needDomLTPre.prerelease[0] === 0) needDomLTPre = false;
		for (const c of dom) {
			hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
			hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
			if (gt) {
				if (needDomGTPre) {
					if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) needDomGTPre = false;
				}
				if (c.operator === ">" || c.operator === ">=") {
					higher = higherGT(gt, c, options);
					if (higher === c && higher !== gt) return false;
				} else if (gt.operator === ">=" && !c.test(gt.semver)) return false;
			}
			if (lt) {
				if (needDomLTPre) {
					if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) needDomLTPre = false;
				}
				if (c.operator === "<" || c.operator === "<=") {
					lower = lowerLT(lt, c, options);
					if (lower === c && lower !== lt) return false;
				} else if (lt.operator === "<=" && !c.test(lt.semver)) return false;
			}
			if (!c.operator && (lt || gt) && gtltComp !== 0) return false;
		}
		if (gt && hasDomLT && !lt && gtltComp !== 0) return false;
		if (lt && hasDomGT && !gt && gtltComp !== 0) return false;
		if (needDomGTPre || needDomLTPre) return false;
		return true;
	};
	const higherGT = (a, b, options) => {
		if (!a) return b;
		const comp = compare(a.semver, b.semver, options);
		return comp > 0 ? a : comp < 0 ? b : b.operator === ">" && a.operator === ">=" ? b : a;
	};
	const lowerLT = (a, b, options) => {
		if (!a) return b;
		const comp = compare(a.semver, b.semver, options);
		return comp < 0 ? a : comp > 0 ? b : b.operator === "<" && a.operator === "<=" ? b : a;
	};
	module.exports = subset;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/index.js
var require_semver = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const internalRe = require_re();
	const constants = require_constants();
	const SemVer = require_semver$1();
	const identifiers = require_identifiers();
	module.exports = {
		parse: require_parse(),
		valid: require_valid$1(),
		clean: require_clean(),
		inc: require_inc(),
		diff: require_diff(),
		major: require_major(),
		minor: require_minor(),
		patch: require_patch(),
		prerelease: require_prerelease(),
		compare: require_compare(),
		rcompare: require_rcompare(),
		compareLoose: require_compare_loose(),
		compareBuild: require_compare_build(),
		sort: require_sort(),
		rsort: require_rsort(),
		gt: require_gt(),
		lt: require_lt(),
		eq: require_eq(),
		neq: require_neq(),
		gte: require_gte(),
		lte: require_lte(),
		cmp: require_cmp(),
		coerce: require_coerce(),
		truncate: require_truncate(),
		Comparator: require_comparator(),
		Range: require_range(),
		satisfies: require_satisfies(),
		toComparators: require_to_comparators(),
		maxSatisfying: require_max_satisfying(),
		minSatisfying: require_min_satisfying(),
		minVersion: require_min_version(),
		validRange: require_valid(),
		outside: require_outside(),
		gtr: require_gtr(),
		ltr: require_ltr(),
		intersects: require_intersects(),
		simplifyRange: require_simplify(),
		subset: require_subset(),
		SemVer,
		re: internalRe.re,
		src: internalRe.src,
		tokens: internalRe.t,
		SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
		RELEASE_TYPES: constants.RELEASE_TYPES,
		compareIdentifiers: identifiers.compareIdentifiers,
		rcompareIdentifiers: identifiers.rcompareIdentifiers
	};
}));
//#endregion
//#region src/infra/semver.ts
var import_semver = require_semver();
function compareValidSemver(left, right) {
	const parsedLeft = (0, import_semver.parse)(left);
	const parsedRight = (0, import_semver.parse)(right);
	return parsedLeft && parsedRight ? parsedLeft.compare(parsedRight) : null;
}
//#endregion
//#region src/infra/sqlite-schema-mutation.ts
function schemaStatement(sql) {
	if (/^(?:CREATE|ALTER|DROP|REINDEX|VACUUM)\b/iu.test(sql)) return true;
	const catalogWrite = /^(?:INSERT(?: OR \w+)? INTO|UPDATE(?: OR \w+)?|DELETE FROM|REPLACE INTO)\s+/iu.exec(sql);
	if (catalogWrite) {
		const target = readSqlToken(sql, catalogWrite[0].length)?.raw ?? "";
		const name = target.slice(findSqlCharacter(target, ".") + 1);
		return ["sqlite_schema", "sqlite_master"].includes(normalizeSqlIdentifier(name));
	}
	if (!/^PRAGMA\b/iu.test(sql)) return false;
	const argumentsAt = [findSqlCharacter(sql, "="), findSqlCharacter(sql, "(")].filter((position) => position >= 0);
	if (argumentsAt.length === 0) return false;
	const qualified = sql.slice(6, Math.min(...argumentsAt)).trim();
	const name = qualified.slice(findSqlCharacter(qualified, ".") + 1).trim();
	const pragma = name.startsWith("'") && name.endsWith("'") ? name.slice(1, -1).toLowerCase() : normalizeSqlIdentifier(name);
	return ["user_version", "schema_version"].includes(pragma);
}
function changesSchema(sql) {
	if (!/\b(?:CREATE|ALTER|DROP|REINDEX|VACUUM|PRAGMA|INSERT|UPDATE|DELETE|REPLACE)\b/iu.test(sql)) return false;
	let remaining = normalizeSqlWhitespace(sql);
	while (remaining) {
		remaining = remaining.replace(/^[\s;]+/u, "");
		const end = findSqlCharacter(remaining, ";");
		if (schemaStatement(end < 0 ? remaining : remaining.slice(0, end))) return true;
		remaining = end < 0 ? "" : remaining.slice(end + 1);
	}
	return false;
}
function createsOnlyTemporaryObject(sql) {
	let remaining = normalizeSqlWhitespace(sql);
	const kind = /^\s*CREATE\s+(?:TEMP|TEMPORARY)\s+(TABLE|TRIGGER)\b/iu.exec(remaining)?.[1]?.toUpperCase();
	if (!kind) return false;
	let end = findSqlCharacter(remaining, ";");
	if (kind === "TABLE") return end < 0 || remaining.slice(end + 1).trim() === "";
	while (end >= 0) {
		remaining = remaining.slice(end + 1).trim();
		end = findSqlCharacter(remaining, ";");
		const step = (end < 0 ? remaining : remaining.slice(0, end)).trim();
		if (/^END$/iu.test(step)) return end < 0 || remaining.slice(end + 1).trim() === "";
	}
	return false;
}
function changesOnlyTemporaryTable(sql) {
	const normalized = normalizeSqlWhitespace(sql);
	const end = findSqlCharacter(normalized, ";");
	if (end >= 0 && normalized.slice(end + 1).trim() !== "") return false;
	return /^CREATE\s+(?:TEMP|TEMPORARY)\s+TABLE\b/iu.test(normalized) || /^DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?(?:temp|"temp"|`temp`|\[temp\])\s*\./iu.test(normalized);
}
function changesData(sql) {
	return hasUnquotedSqlKeyword(sql, /\b(?:INSERT|UPDATE|DELETE|REPLACE)\b/giu);
}
function temporaryWriteTables(sql) {
	const tables = [];
	let remaining = normalizeSqlWhitespace(sql);
	while (remaining) {
		remaining = remaining.replace(/^[\s;]+/u, "");
		const end = findSqlCharacter(remaining, ";");
		const statement = end < 0 ? remaining : remaining.slice(0, end);
		if (changesData(statement)) {
			const table = /^(?:INSERT(?: OR \w+)? INTO|REPLACE INTO|UPDATE(?: OR \w+)?|DELETE FROM)\s+(?:temp|"temp"|`temp`|\[temp\])\s*\.\s*("(?:[^"]|"")+"|`(?:[^`]|``)+`|\[[^\]]+\]|[a-z_]\w*)(?=\s|\(|$)/iu.exec(statement)?.[1];
			if (table === void 0) return;
			tables.push(normalizeSqlIdentifier(table));
		}
		remaining = end < 0 ? "" : remaining.slice(end + 1);
	}
	return tables;
}
const sqlLeadingTrivia = /^(?:\s|;|--[^\n]*(?:\n|$)|\/\*(?:[^*]|\*(?!\/))*(?:\*\/|$))*/u;
const transactionControlPrefix = /^(BEGIN|SAVEPOINT|COMMIT|END|RELEASE|ROLLBACK)\b/i;
function readTransactionControl(sql, mode) {
	let control;
	let outerRollback = false;
	let otherChanges = false;
	let statements = 0;
	let remaining = sql;
	while (remaining) {
		remaining = remaining.replace(sqlLeadingTrivia, "");
		if (!remaining) break;
		statements += 1;
		const end = remaining.includes(";") ? findSqlCharacter(remaining, ";") : -1;
		const statement = end < 0 ? remaining : remaining.slice(0, end);
		const next = transactionControlPrefix.exec(statement)?.[1]?.toUpperCase();
		if (next === "ROLLBACK") {
			control = next;
			otherChanges ||= outerRollback;
			outerRollback = !/^ROLLBACK(?: TRANSACTION)? TO\b/iu.test(normalizeSqlWhitespace(statement));
			otherChanges ||= !outerRollback;
		} else if (next || !/^SELECT\b/iu.test(statement) && (changesSchema(statement) || changesData(statement))) otherChanges = true;
		control ||= next;
		if (end < 0 || mode === "statement") break;
		remaining = remaining.slice(end + 1);
	}
	return control ? {
		kind: control,
		single: statements === 1,
		outerRollback: outerRollback && !otherChanges
	} : void 0;
}
function canPreserveTransactionSnapshot(control, inTransaction) {
	return Boolean(inTransaction && control?.single && (control.kind === "SAVEPOINT" || control.kind === "RELEASE" || control.kind === "ROLLBACK"));
}
function classifySqliteMutation(sql, mode) {
	const schemaChange = changesSchema(sql);
	const dataChange = changesData(sql);
	const temporaryTableSchemaChange = schemaChange && changesOnlyTemporaryTable(sql);
	return {
		schemaChange,
		mainSchemaChange: schemaChange && !temporaryTableSchemaChange && !createsOnlyTemporaryObject(sql),
		temporaryTableSchemaChange,
		dataChange,
		temporaryWriteTables: dataChange ? temporaryWriteTables(sql) : void 0,
		control: readTransactionControl(sql, mode)
	};
}
//#endregion
//#region src/infra/sqlite-native-observer.ts
/** The runtime owner reuses its prepared one-row library probe, once per process load. */
function probeSqliteIteratorBehavior(statement) {
	const previous = statement.iterate();
	previous.next();
	previous.next();
	const nextAfterDoneIsTerminal = previous.next().done === true;
	previous.return?.();
	const current = statement.iterate();
	try {
		current.next();
		previous.return?.();
		return {
			nextAfterDoneIsTerminal,
			returnAfterDoneIsInert: current.next().done === true
		};
	} finally {
		current.return?.();
	}
}
const pending = resolveGlobalSingleton(Symbol.for("openclaw.sqliteNativeExecution"), () => /* @__PURE__ */ new WeakMap());
const iteratorFinalizer = new FinalizationRegistry((lifetimes) => {
	for (const lifetime of lifetimes) lifetime.finish(false, true);
});
function createIteratorLifetime(active, activeIterators) {
	const lifetime = {
		finished: false,
		invalidated: false,
		pause: () => lifetime.stopObservation(),
		invalidate: () => {
			lifetime.invalidated = true;
			lifetime.finish();
		},
		stopObservation: (succeeded = false, abandoned = false) => {
			const previous = lifetime.observed;
			lifetime.observed = void 0;
			activeIterators.delete(lifetime);
			previous?.finish(succeeded, abandoned);
		},
		finish: (succeeded = false, abandoned = false) => {
			if (!lifetime.finished) {
				lifetime.finished = true;
				active.delete(lifetime);
				lifetime.stopObservation(succeeded, abandoned);
			}
		}
	};
	active.add(lifetime);
	return lifetime;
}
const bindingMutation = {
	schemaChange: false,
	mainSchemaChange: false,
	temporaryTableSchemaChange: false,
	dataChange: false,
	temporaryWriteTables: void 0,
	control: void 0
};
/** Dispose callbacks may refuse close; native custody expires only after SQLite has closed. */
function observeSqliteNativeClose(database, onClose) {
	for (const method of ["close", Symbol.dispose]) {
		if (typeof database[method] !== "function") continue;
		const close = database[method].bind(database);
		database[method] = () => {
			try {
				close();
			} finally {
				if (!database.isOpen) onClose();
			}
		};
	}
}
function callStatement(method, bindings) {
	return Reflect.apply(method, void 0, bindings);
}
/** Native callbacks can mutate from any SQL, including SELECT and retained prepared statements. */
function observeSqliteNativeOperations(database, native, observe) {
	const begin = (mutation, phase) => {
		const observed = observe(mutation, phase);
		pending.set(database, (pending.get(database) ?? 0) + 1);
		return {
			...observed,
			finish(succeeded, abandoned) {
				try {
					observed.finish(succeeded, abandoned);
				} finally {
					const remaining = (pending.get(database) ?? 1) - 1;
					if (remaining === 0) pending.delete(database);
					else pending.set(database, remaining);
				}
			}
		};
	};
	const activeIterators = /* @__PURE__ */ new Set();
	const execute = (operation, mutation, phase = "execute") => {
		const observed = begin(mutation, phase);
		let succeeded = false;
		try {
			const result = operation();
			if (phase !== "bind") observed.stepped?.();
			succeeded = true;
			return result;
		} finally {
			observed.finish(succeeded);
		}
	};
	database.exec = (sql) => execute(() => native.DatabaseSync.prototype.exec.call(database, sql), classifySqliteMutation(sql, "batch"), "exec");
	database.prepare = (...prepareArgs) => {
		const statement = native.DatabaseSync.prototype.prepare.call(database, ...prepareArgs);
		const mutation = classifySqliteMutation(prepareArgs[0], "statement");
		const run = Object.hasOwn(statement, "run") ? statement.run.bind(statement) : void 0;
		const get = Object.hasOwn(statement, "get") ? statement.get.bind(statement) : void 0;
		const all = Object.hasOwn(statement, "all") ? statement.all.bind(statement) : void 0;
		const iterate = Object.hasOwn(statement, "iterate") ? statement.iterate.bind(statement) : void 0;
		const active = /* @__PURE__ */ new Set();
		let registered = false;
		const reset = (operation, kind = "reuse") => {
			if (active.size === 0) return operation();
			const previous = [...active];
			const result = operation();
			for (const lifetime of previous) if (kind === "return") lifetime.pause();
			else lifetime.invalidate();
			return result;
		};
		const wrap = (resolve) => (...bindings) => execute(() => reset(() => callStatement(resolve(), bindings)), mutation);
		statement.run = wrap(() => run ?? native.StatementSync.prototype.run.bind(statement));
		statement.get = wrap(() => get ?? native.StatementSync.prototype.get.bind(statement));
		statement.all = wrap(() => all ?? native.StatementSync.prototype.all.bind(statement));
		statement.iterate = (...bindings) => {
			if (!registered) {
				iteratorFinalizer.register(statement, active);
				registered = true;
			}
			const rows = execute(() => reset(() => callStatement(iterate ?? native.StatementSync.prototype.iterate.bind(statement), bindings)), bindingMutation, "bind");
			const reference = new WeakRef(rows);
			let done = false;
			const lifetime = createIteratorLifetime(active, activeIterators);
			const nativeNext = rows.next;
			const nativeReturn = rows.return;
			rows.next = function(...args) {
				if (this !== reference.deref() || lifetime.invalidated || done || !database.isOpen) return nativeNext.apply(this, args);
				if (lifetime.finished) {
					lifetime.finished = false;
					active.add(lifetime);
				}
				lifetime.observed ??= begin(mutation, "iterate");
				activeIterators.add(lifetime);
				const result = nativeNext.apply(this, args);
				if (result.done) {
					done = native.iteratorBehavior.nextAfterDoneIsTerminal;
					if (done) lifetime.finish(true);
					else lifetime.stopObservation(true);
				} else lifetime.observed?.stepped?.();
				return result;
			};
			if (nativeReturn) rows.return = function(...args) {
				if (this !== reference.deref() || done && native.iteratorBehavior.returnAfterDoneIsInert || !database.isOpen) return nativeReturn.apply(this, args);
				const result = execute(() => lifetime.finished || lifetime.invalidated ? nativeReturn.apply(this, args) : reset(() => nativeReturn.apply(this, args), "return"), bindingMutation, "bind");
				done = result.done === true;
				lifetime.finish();
				return result;
			};
			return rows;
		};
		for (const method of ["close", Symbol.dispose]) {
			const close = statement[method]?.bind(statement);
			if (close) statement[method] = () => reset(close, "finalize");
		}
		return statement;
	};
	observeSqliteNativeClose(database, () => {
		for (const lifetime of activeIterators) lifetime.invalidate();
	});
	return execute;
}
//#endregion
//#region src/infra/sqlite-schema-lifetime.ts
function observeSchemaLifetime(database, owner, snapshot) {
	if (owner.snapshot && owner.snapshot !== snapshot) {
		if (!database.isTransaction || !owner.transactionCatalogBound) invalidateTrackedSqliteSchemaFacts(owner);
		owner.snapshot = void 0;
		owner.qualifiedSnapshot = void 0;
	}
	const processRevision = getSqliteDatabaseSchemaRevision(database);
	const scopeChanged = owner.processRevision !== void 0 && owner.processRevision !== processRevision;
	if (scopeChanged && !owner.transactionalSchema && (database.isTransaction && owner.transactionCatalogBound || owner.facts && snapshot && owner.qualifiedSnapshot === snapshot)) {
		owner.transactionalFacts ||= database.isTransaction;
		owner.snapshot = snapshot;
		return false;
	}
	owner.processRevision = processRevision;
	if (scopeChanged) invalidateTrackedSqliteSchemaFacts(owner);
	if ((owner.transactionalSchema || owner.transactionalTempSchema || owner.transactionalFacts) && !database.isTransaction) {
		if (owner.transactionalSchema) publishSqliteDatabaseSchemaChange(database);
		invalidateTrackedSqliteSchemaFacts(owner);
		owner.transactionalSchema = false;
		owner.transactionalTempSchema = false;
		owner.transactionalFacts = false;
	}
	return scopeChanged;
}
//#endregion
//#region src/infra/sqlite-schema-scope.ts
function observeSqliteTransactionState(database, owner) {
	const inTransaction = database.isTransaction;
	if (owner.transactionOpen !== inTransaction) {
		if (owner.transactionOpen) owner.mutationRevision += 1;
		owner.transactionOpen = inTransaction;
		owner.transactionMutationRevision = void 0;
		owner.transactionSnapshot = void 0;
		owner.transactionRead = false;
		owner.transactionCatalogBound = false;
	}
}
function finishSqliteReadScope(database, owner, wasTransaction, expiresRead, succeeded, openingMutationRevision) {
	const inTransaction = database.isTransaction;
	if (!succeeded && wasTransaction && !inTransaction) owner.mutationRevision += 1;
	owner.transactionOpen = inTransaction;
	if (!wasTransaction || !inTransaction) owner.transactionMutationRevision = inTransaction ? openingMutationRevision : void 0;
	if (wasTransaction !== inTransaction || expiresRead) {
		owner.transactionSnapshot = void 0;
		owner.transactionRead = false;
		owner.transactionCatalogBound = false;
	}
}
//#endregion
//#region src/infra/sqlite-temp-generation-schema.ts
function prepareSqliteTempTrackingSchema(database, schema) {
	const { createSql, objects } = prepareTranscriptIndexSchema(schema);
	const definitions = new Map(objects.map((object) => [object.name.toLowerCase(), object]));
	const names = objects.map((object) => object.name);
	const tableNames = objects.filter((object) => object.type === "table").map((object) => object.name);
	const parameters = [...names, ...tableNames];
	const existing = executeWithCachedStatement(database, `SELECT type, name, tbl_name, sql FROM temp.sqlite_schema
     WHERE name COLLATE NOCASE IN (${names.map(() => "?").join(",")})
       OR (type = 'trigger' AND tbl_name COLLATE NOCASE IN (${tableNames.map(() => "?").join(",")}))`, parameters, (statement) => statement.all(...parameters));
	const unexpected = existing.some((row) => {
		const declared = typeof row.name === "string" ? definitions.get(row.name.toLowerCase()) : void 0;
		return !declared || row.type !== declared.type || row.tbl_name !== declared.table || typeof row.sql !== "string" || normalizeSchemaSql(row.sql) !== normalizeSchemaSql(declared.sql);
	});
	return {
		sql: createSql(new Set(existing.flatMap((row) => row.type === "trigger" && typeof row.name === "string" ? [row.name.toLowerCase()] : []))),
		unexpected
	};
}
function prepareTranscriptIndexSchema(schema) {
	const status = quoteSqliteIdentifier(schema.statusTable);
	const pending = quoteSqliteIdentifier(schema.pendingTable);
	const index = quoteSqliteIdentifier(schema.pendingIndex);
	const statusTable = `${status} (
    id INTEGER PRIMARY KEY CHECK (id = 1), sibling_write_revision INTEGER NOT NULL,
    schema_version INTEGER NOT NULL, complete INTEGER NOT NULL, after_session TEXT,
    completed_traversals INTEGER NOT NULL
  ) STRICT`;
	const pendingTable = `${pending} (session_id TEXT PRIMARY KEY, state INTEGER NOT NULL) STRICT`;
	const pendingIndex = `${index} ON ${pending}(state, session_id)`;
	const triggers = schema.observedTables.flatMap((table) => [
		"INSERT",
		"UPDATE",
		"DELETE"
	].map((operation) => {
		const name = `openclaw_${table}_projection_${operation.toLowerCase()}`;
		const sources = operation === "UPDATE" ? ["OLD", "NEW"] : [operation === "DELETE" ? "OLD" : "NEW"];
		return {
			name,
			table,
			definition: `TRIGGER ${quoteSqliteIdentifier(name)} AFTER ${operation} ON main.${quoteSqliteIdentifier(table)}
          WHEN ${sources.map((source) => `NOT EXISTS (
                SELECT 1 FROM ${pending}
                WHERE session_id = ${source}.session_id AND state = 0
              )`).join(" OR ")} BEGIN
            ${sources.map((source) => `
                  UPDATE ${pending} SET state = 0 WHERE session_id = ${source}.session_id;
                  INSERT INTO ${pending}
                    SELECT ${source}.session_id, 0 WHERE NOT EXISTS (
                      SELECT 1 FROM ${pending} WHERE session_id = ${source}.session_id
                    );`).join("\n")}
          END`
		};
	}));
	const createSql = (existingTriggers) => `
    CREATE TEMP TABLE IF NOT EXISTS ${statusTable};
    INSERT OR IGNORE INTO temp.${status} VALUES (1, -1, -1, 0, NULL, 0);
    UPDATE temp.${status} SET sibling_write_revision = -1;
    CREATE TEMP TABLE IF NOT EXISTS ${pendingTable};
    CREATE INDEX IF NOT EXISTS temp.${pendingIndex};
    ${triggers.map(({ name, definition }) => {
		return `${existingTriggers.has(name.toLowerCase()) ? `DROP TRIGGER IF EXISTS temp.${quoteSqliteIdentifier(name)};` : ""}CREATE TEMP ${definition};`;
	}).join("\n")}
  `;
	return {
		createSql,
		objects: [
			{
				name: schema.statusTable,
				type: "table",
				table: schema.statusTable,
				sql: `CREATE TABLE ${statusTable}`
			},
			{
				name: schema.pendingTable,
				type: "table",
				table: schema.pendingTable,
				sql: `CREATE TABLE ${pendingTable}`
			},
			{
				name: schema.pendingIndex,
				type: "index",
				table: schema.pendingTable,
				sql: `CREATE INDEX ${pendingIndex}`
			},
			...triggers.map((trigger) => ({
				name: trigger.name,
				type: "trigger",
				table: trigger.table,
				sql: `CREATE ${trigger.definition}`
			}))
		]
	};
}
//#endregion
//#region src/infra/sqlite-schema-facts.ts
const owners = resolveGlobalSingleton(Symbol.for("openclaw.sqliteSchemaFacts"), () => /* @__PURE__ */ new WeakMap());
/** Schema publications outside DDL (such as a deferred version marker) share this revision. */
function invalidateSqliteSchemaFacts(database) {
	invalidateSchemaFacts(database, true);
}
function invalidateSchemaFacts(database, publish, change = "main", notify = change !== "temp") {
	const owner = owners.get(database);
	if (owner) {
		const changesMain = change === "main";
		owner.isolatedTempTables.clear();
		if (database.isTransaction) owner.transactionMutationRevision = void 0;
		if (changesMain) invalidateLocalSqliteSchemaAdmissions(database);
		if (changesMain && database.isTransaction && !owner.transactionalSchema) owner.transactionBaseFacts = owner.facts;
		if (notify) for (const listener of owner.mutationListeners ?? []) listener(void 0);
		invalidateTrackedSqliteSchemaFacts(owner);
		owner.transactionalSchema ||= changesMain && database.isTransaction;
		owner.transactionalTempSchema ||= change === "temp" && database.isTransaction;
		owner.pendingSchema ||= changesMain && owner.nativeDepth > 0;
		if (publish && changesMain && !database.isTransaction && owner.nativeDepth === 0) publishSqliteDatabaseSchemaChange(database);
	}
}
/** MAIN mutations and rollback revoke before execution; TEMP DDL only revokes local facts. */
function registerSqliteSchemaMutationListener(database, listener) {
	const owner = owners.get(database);
	if (!owner) throw new Error("SQLite schema observation requires a tracked connection");
	const listeners = owner.mutationListeners ??= /* @__PURE__ */ new Set();
	listeners.add(listener);
	return () => listeners.delete(listener);
}
function trackSchemaChanges(database, owner, native, writable) {
	const settle = (boundary = false, rolledBack = false) => {
		if (rolledBack) {
			const snapshot = getSqlitePinnedReadSnapshot(database);
			const facts = snapshot && (owner.transactionalSchema ? owner.transactionBaseFacts : owner.facts);
			discardSqliteDatabaseTransactionAdmissions(database);
			invalidateTrackedSqliteSchemaFacts(owner);
			owner.transactionalSchema = false;
			owner.transactionalTempSchema = false;
			owner.transactionalFacts = false;
			if (snapshot && owner.admitted && !owner.authorizerActive) {
				owner.facts = facts ? {
					...facts,
					revision: owner.revision
				} : captureTrackedSqliteSchemaFacts(database, owner);
				owner.snapshot = snapshot;
				owner.qualifiedSnapshot = snapshot;
			}
			owner.transactionBaseFacts = void 0;
			return;
		}
		if ((boundary || !database.isTransaction) && (owner.transactionalSchema || owner.transactionalTempSchema || owner.transactionalFacts)) {
			if (owner.transactionalSchema) publishSqliteDatabaseSchemaChange(database);
			invalidateTrackedSqliteSchemaFacts(owner);
			owner.transactionalSchema &&= database.isTransaction;
			owner.transactionalTempSchema &&= database.isTransaction;
			owner.transactionalFacts = false;
		}
	};
	const execute = observeSqliteNativeOperations(database, native, (mutation, phase) => {
		if (owner.settling) return { finish: () => {} };
		const { control, dataChange } = mutation;
		const schemaChange = control?.outerRollback === true ? false : mutation.schemaChange;
		const mainSchemaChange = mutation.mainSchemaChange && control?.outerRollback !== true;
		observeSqliteTransactionState(database, owner);
		const snapshot = phase === "bind" ? void 0 : getSqlitePinnedReadSnapshot(database);
		const iterator = phase !== "bind" && !snapshot && !owner.capturing ? {} : void 0;
		if (snapshot && snapshot !== owner.snapshot && !owner.capturing) {
			if (database.isTransaction && (owner.transactionRead || owner.transactionCatalogBound) && owner.processRevision !== getSqliteDatabaseSchemaRevision(database)) {
				if (!owner.transactionCatalogBound) invalidateTrackedSqliteSchemaFacts(owner);
				owner.transactionalFacts = true;
			} else {
				observeSchemaLifetime(database, owner, void 0);
				if (!owner.facts && !owner.transactionalSchema) {
					const retained = getSqliteDatabaseAdmission(database, schemaAdmission);
					if (retained) owner.facts = {
						...retained,
						revision: owner.revision
					};
				}
			}
			owner.snapshot = snapshot;
			owner.qualifiedSnapshot = snapshot;
		}
		if (owner.nativeDepth === 0) settle();
		const wasTransaction = database.isTransaction;
		if (writable && !wasTransaction && (control?.kind === "BEGIN" || control?.kind === "SAVEPOINT")) getSqliteDatabaseSchemaRevision(database);
		const openingMutationRevision = !wasTransaction && control?.kind === "BEGIN" && control.single ? owner.mutationRevision : void 0;
		if (!wasTransaction && control?.kind === "BEGIN" && owner.admitted) getAdmittedSqliteSchemaFacts(database);
		const expiresRead = Boolean(control) && !canPreserveTransactionSnapshot(control, wasTransaction);
		const rollback = control?.kind === "ROLLBACK";
		const rollsBackSchema = rollback && owner.transactionalSchema && !control.outerRollback;
		const notifySchema = schemaChange && !mutation.temporaryTableSchemaChange || rollback && owner.transactionalSchema;
		const schemaInvalidation = mainSchemaChange || rollsBackSchema ? "main" : rollback ? owner.transactionalTempSchema && !owner.transactionalSchema ? "temp" : "rollback" : mutation.temporaryTableSchemaChange ? "temp" : "local";
		if (rollback) discardSqliteDatabaseTransactionAdmissions(database);
		if (schemaChange || rollback) invalidateSchemaFacts(database, false, schemaInvalidation, notifySchema);
		if (dataChange || mutation.temporaryTableSchemaChange || control?.kind === "ROLLBACK") owner.mutationRevision += 1;
		if (phase !== "bind" && wasTransaction && !control && owner.readDepth === 0 && !owner.transactionCatalogBound) owner.transactionRead = true;
		const changesReadScope = schemaChange || dataChange || control !== void 0;
		const temporaryWrite = mutation.temporaryWriteTables?.every((table) => owner.isolatedTempTables.has(table));
		if (dataChange && !temporaryWrite || mainSchemaChange) beginSqliteDatabaseWrite(database, mainSchemaChange || owner.nativeDepth > 0);
		if (changesReadScope) owner.mutationDepth += 1;
		owner.nativeDepth += 1;
		const finishAdmissions = beginSqliteDatabaseAdmissionOperation(database);
		const pendingBefore = owner.schemaMutationRevision;
		if (mainSchemaChange) owner.schemaMutationRevision += 1;
		owner.pendingSchema ||= mainSchemaChange;
		if (iterator) owner.unmanagedSnapshots.add(iterator);
		return {
			stepped: () => {
				if (database.isTransaction && !control && !owner.transactionRead && !owner.transactionCatalogBound && owner.facts && owner.processRevision === getSqliteDatabaseSchemaRevision(database)) owner.transactionCatalogBound = true;
			},
			finish: (succeeded, abandoned) => {
				if (iterator && owner.unmanagedSnapshots.delete(iterator) && owner.iteratorFacts) {
					invalidateTrackedSqliteSchemaFacts(owner);
					owner.iteratorFacts = false;
				}
				finishAdmissions();
				owner.nativeDepth -= 1;
				if (changesReadScope) owner.mutationDepth -= 1;
				if (!database.isOpen) return;
				if (schemaChange || rollback) {
					if (rollback) discardSqliteDatabaseTransactionAdmissions(database);
					invalidateSchemaFacts(database, false, schemaInvalidation, notifySchema);
				}
				const rolledBack = succeeded && wasTransaction && control?.outerRollback === true && !database.isTransaction && !mainSchemaChange && owner.schemaMutationRevision === pendingBefore;
				if (rolledBack) {
					settle(false, true);
					owner.pendingSchema = false;
				}
				if (owner.nativeDepth === 0) {
					owner.settling = true;
					try {
						const changedSchema = owner.pendingSchema || owner.transactionalSchema;
						if (!rolledBack && owner.pendingSchema && !database.isTransaction && !owner.transactionalSchema) publishSqliteDatabaseSchemaChange(database);
						if (!rolledBack) settle(expiresRead);
						if (changedSchema && !database.isTransaction && !rolledBack) {
							invalidateTrackedSqliteSchemaFacts(owner);
							if (!succeeded) discardSqliteDatabaseTransactionAdmissions(database);
							if (owner.admitted && !owner.authorizerActive && !abandoned) {
								getAdmittedSqliteSchemaFacts(database);
								owner.transactionBaseFacts = void 0;
							}
						}
						owner.pendingSchema = false;
					} finally {
						owner.settling = false;
					}
				}
				finishSqliteReadScope(database, owner, wasTransaction, expiresRead, succeeded, openingMutationRevision);
				if (owner.mutationDepth === 0 && !database.isTransaction) finishSqliteDatabaseWrite(database);
				owner.transactionRead ||= database.isTransaction && Boolean(control && !control.single);
			}
		};
	});
	observeSqliteNativeClose(database, () => {
		finishSqliteDatabaseWrite(database);
		releaseSqliteDatabaseAdmission(database);
	});
	owner.installTempTrackingSchema = (schema) => {
		const { sql, unexpected } = prepareSqliteTempTrackingSchema(database, schema);
		try {
			execute(() => native.DatabaseSync.prototype.exec.call(database, sql), {
				schemaChange: unexpected,
				mainSchemaChange: unexpected,
				temporaryTableSchemaChange: false,
				dataChange: true,
				temporaryWriteTables: [],
				control: void 0
			});
			if (!unexpected) for (const table of [schema.statusTable, schema.pendingTable]) owner.isolatedTempTables.add(table.toLowerCase());
		} catch (error) {
			invalidateSqliteSchemaFacts(database);
			throw error;
		}
	};
	if (typeof database.setAuthorizer === "function") database.setAuthorizer = (callback) => {
		native.DatabaseSync.prototype.setAuthorizer.call(database, callback);
		owner.authorizerActive = callback !== null;
		suspendSqliteDatabaseAdmission(database, owner.authorizerActive);
		invalidateTrackedSqliteSchemaFacts(owner);
	};
	registerNodeSqliteDisposeCallback(database, () => {
		invalidateTrackedSqliteSchemaFacts(owner);
		owner.readRevision = void 0;
		owner.transactionSnapshot = void 0;
	});
}
/** Local mutation witness; committed sibling writes use the physical admission revision. */
function readSqliteNativeMutationRevision(database) {
	return isPostgresSqlConnection(database) ? void 0 : owners.get(database)?.mutationRevision;
}
/** Reuse schema only through unchanged synchronous transaction work, never as write authority. */
function canReuseSqliteSchemaInTransaction(database) {
	if (isPostgresSqlConnection(database)) return false;
	const owner = owners.get(database);
	return owner !== void 0 && !owner.authorizerActive && database.isTransaction;
}
/** Reuse row facts only inside an admitted synchronous operation. */
function runSqliteReadOperationSync(database, operation) {
	if (isPostgresSqlConnection(database)) return operation();
	const owner = owners.get(database);
	if (!owner || owner.authorizerActive) return operation();
	owner.readDepth += 1;
	try {
		if (owner.admitted) getAdmittedSqliteSchemaFacts(database);
		return operation();
	} finally {
		owner.readDepth -= 1;
	}
}
/** Install at native open, before callers can retain statements or install an authorizer. */
function trackSqliteSchema(database, native, writable = true) {
	if (!owners.has(database)) {
		const owner = {
			admitted: false,
			revision: 0,
			readDepth: 0,
			mutationRevision: 0,
			mutationDepth: 0,
			transactionOpen: database.isOpen && database.isTransaction,
			transactionRead: false,
			transactionCatalogBound: false,
			nativeDepth: 0,
			pendingSchema: false,
			schemaMutationRevision: 0,
			settling: false,
			capturing: false,
			transactionalSchema: false,
			transactionalTempSchema: false,
			transactionalFacts: false,
			authorizerActive: false,
			unmanagedSnapshots: /* @__PURE__ */ new Set(),
			isolatedTempTables: /* @__PURE__ */ new Set(),
			iteratorFacts: false
		};
		owners.set(database, owner);
		trackSchemaChanges(database, owner, native, writable);
		const retained = getSqliteDatabaseAdmission(database, schemaAdmission, { existingOnly: true });
		if (retained) {
			owner.admitted = true;
			owner.facts = {
				...retained,
				revision: owner.revision
			};
			owner.processRevision = getSqliteDatabaseSchemaRevision(database);
		}
	}
}
/** Select first ordinary admission without querying or authorizing a connection. */
function isSqliteSchemaAdmissionCold(database) {
	const owner = owners.get(database);
	return Boolean(owner && !owner.admitted && !owner.authorizerActive);
}
/** Admission retains schema facts; its header validator must stay synchronous and read-free. */
function admitSqliteSchema(database, validateUserVersion) {
	const owner = owners.get(database);
	if (!owner) throw new Error("SQLite schema admission requires a connection tracked from native open");
	owner.admitted = true;
	getAdmittedSqliteSchemaFacts(database, validateUserVersion);
}
/** Match transferred proof against the schema owner's current admitted catalog. */
function adoptSqliteSchemaFacts(database, facts) {
	const owner = owners.get(database);
	if (!owner || owner.authorizerActive || database.isTransaction || owner.unmanagedSnapshots.size > 0) return false;
	owner.admitted = true;
	const current = getAdmittedSqliteSchemaFacts(database);
	return current !== void 0 && current.schemaVersion === facts.schemaVersion && current.userVersion === facts.userVersion;
}
/** Consume the physical database's admitted facts and owner-published schema changes. */
function getAdmittedSqliteSchemaFacts(database, validateUserVersion) {
	if (isPostgresSqlConnection(database)) return;
	const owner = owners.get(database);
	if (!owner?.admitted || owner.authorizerActive) return;
	const snapshot = getSqlitePinnedReadSnapshot(database);
	const unknownSnapshot = database.isTransaction && (owner.transactionRead || owner.transactionCatalogBound) && owner.processRevision !== getSqliteDatabaseSchemaRevision(database) || owner.unmanagedSnapshots.size > 0;
	const scopeChanged = observeSchemaLifetime(database, owner, snapshot);
	if (!owner.facts) {
		owner.snapshot = snapshot;
		owner.transactionalFacts ||= database.isTransaction && (owner.readDepth === 0 || scopeChanged);
		const localSnapshot = unknownSnapshot || Boolean(snapshot) || owner.transactionalSchema;
		const retained = owner.transactionalSchema || localSnapshot ? void 0 : getSqliteDatabaseAdmission(database, schemaAdmission);
		if (retained) {
			validateUserVersion?.(retained.userVersion);
			owner.facts = {
				...retained,
				revision: owner.revision
			};
			return owner.facts;
		}
		const schemaRevision = getSqliteDatabaseSchemaRevision(database);
		owner.facts = captureTrackedSqliteSchemaFacts(database, owner, validateUserVersion);
		owner.iteratorFacts ||= owner.unmanagedSnapshots.size > 0;
		owner.qualifiedSnapshot = snapshot;
		owner.transactionCatalogBound ||= database.isTransaction;
		if (!localSnapshot) publishSqliteDatabaseAdmission(database, schemaAdmission, owner.facts, { schemaRevision });
	} else validateUserVersion?.(owner.facts.userVersion);
	return owner.facts;
}
//#endregion
//#region src/infra/warning-filter.ts
const warningFilterKey = Symbol.for("openclaw.warning-filter");
function shouldIgnoreWarning(warning) {
	return Boolean(warning.code === "DEP0040" && warning.message?.includes("punycode") || warning.code === "DEP0060" && warning.message?.includes("util._extend") || warning.name === "ExperimentalWarning" && warning.message?.includes("SQLite is an experimental feature"));
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
let extensionLoadingSupported = false;
let jsonbSupported = false;
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
/** Build an immutable SQLite URI without losing the Windows long-path namespace. */
function resolveImmutableSqliteFileUri(pathname, platform = process.platform) {
	return `${resolveSqliteFileUriPath(pathname, platform)}?mode=ro&immutable=1`;
}
function assertSqliteWalResetSafeVersion(version, nodeVersion) {
	if (isSqliteWalResetSafeVersion(version)) return;
	const variables = process.config?.variables;
	const isShared = variables?.node_shared_sqlite === true || variables?.node_shared_sqlite === "true";
	throw new Error(`OpenClaw requires SQLite 3.51.3+, 3.50.7+ within 3.50.x, or 3.44.6+ within 3.44.x for WAL safety; Node ${nodeVersion} ${isShared ? "uses shared system" : "embeds"} SQLite ${version}, which is affected by the upstream WAL-reset database corruption bug. ${isShared ? "Upgrade the system SQLite library to one of those safe versions, or use a Node build embedding a safe version." : "Upgrade to Node 24.22.1+ or 26.12.1+ before retrying."}`);
}
function sqliteNativeRuntimeIdentity() {
	return {
		pid: process.pid,
		executable: process.execPath,
		nodeVersion: process.versions.node,
		bunVersion: process.versions.bun,
		library: ensureSqliteLibrarySelected()
	};
}
function parseSqliteNativeRuntimeAdmission(value) {
	if (!isRecord(value) || value.format !== 1 || typeof value.version !== "string" || typeof value.extensionLoadingSupported !== "boolean" || !isRecord(value.iteratorBehavior) || typeof value.iteratorBehavior.nextAfterDoneIsTerminal !== "boolean" || typeof value.iteratorBehavior.returnAfterDoneIsInert !== "boolean") return;
	const runtime = sqliteNativeRuntimeIdentity();
	if (!isDeepStrictEqual(value.runtime, runtime)) return;
	return {
		format: 1,
		runtime,
		version: value.version,
		extensionLoadingSupported: value.extensionLoadingSupported,
		iteratorBehavior: {
			nextAfterDoneIsTerminal: value.iteratorBehavior.nextAfterDoneIsTerminal,
			returnAfterDoneIsInert: value.iteratorBehavior.returnAfterDoneIsInert
		}
	};
}
function safeSqliteNativeRuntimeAdmission(value) {
	try {
		const admission = parseSqliteNativeRuntimeAdmission(value);
		return admission && isSqliteWalResetSafeVersion(admission.version) ? admission : void 0;
	} catch {
		return;
	}
}
/** Publish to later sibling workers; database authority remains with its existing owners. */
function installSqliteNativeRuntimeAdmission(value) {
	const admission = safeSqliteNativeRuntimeAdmission(value);
	if (admission) setEnvironmentData(SQLITE_NATIVE_RUNTIME_ADMISSION_KEY, admission);
}
function assertSafeSqliteRuntime(sqlite) {
	if (validatedSqliteModule?.sqlite === sqlite) return validatedSqliteModule.iteratorBehavior;
	const inherited = isMainThread ? void 0 : parseSqliteNativeRuntimeAdmission(getEnvironmentData(SQLITE_NATIVE_RUNTIME_ADMISSION_KEY));
	if (inherited) {
		assertSqliteWalResetSafeVersion(inherited.version, process.versions.node);
		jsonbSupported = (compareValidSemver(inherited.version, "3.45.0") ?? -1) >= 0;
		extensionLoadingSupported = inherited.extensionLoadingSupported;
		validatedSqliteModule = {
			sqlite,
			iteratorBehavior: inherited.iteratorBehavior
		};
		return inherited.iteratorBehavior;
	}
	const database = new sqlite.DatabaseSync(":memory:");
	let version;
	let extensions;
	let iteratorBehavior;
	try {
		const statement = database.prepare("SELECT sqlite_version() AS version, sqlite_compileoption_used('OMIT_LOAD_EXTENSION') AS omitted");
		const row = statement.get();
		version = typeof row?.version === "string" ? row.version : "unknown";
		assertSqliteWalResetSafeVersion(version, process.versions.node);
		extensions = row?.omitted === 0;
		iteratorBehavior = probeSqliteIteratorBehavior(statement);
	} finally {
		database.close();
	}
	jsonbSupported = (compareValidSemver(version, "3.45.0") ?? -1) >= 0;
	extensionLoadingSupported = extensions;
	validatedSqliteModule = {
		sqlite,
		iteratorBehavior
	};
	setEnvironmentData(SQLITE_NATIVE_RUNTIME_ADMISSION_KEY, {
		format: 1,
		runtime: sqliteNativeRuntimeIdentity(),
		version,
		extensionLoadingSupported: extensions,
		iteratorBehavior
	});
	return iteratorBehavior;
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
/** Whether the loaded SQLite library supports native extensions. */
function supportsNodeSqliteExtensionLoading() {
	requireNodeSqlite();
	return extensionLoadingSupported;
}
/** JSONB is absent from the supported SQLite 3.44 maintenance line. */
function supportsNodeSqliteJsonb() {
	requireNodeSqlite();
	return jsonbSupported;
}
/** Open node:sqlite through OpenClaw's runtime and filesystem-location boundary. */
function openNodeSqliteDatabase(location, options) {
	const sqlite = requireNodeSqlite();
	const resolvedLocation = resolveNodeSqliteLocation(location);
	const identity = options?.open === false ? void 0 : prepareSqliteDatabaseAdmission(resolvedLocation, { create: options?.readOnly !== true });
	const database = new sqlite.DatabaseSync(resolvedLocation, options ?? {});
	if (database.isOpen) try {
		bindSqliteDatabaseAdmission(database, identity);
	} catch (error) {
		database.close();
		throw error;
	}
	database.open = () => {
		const reopenedIdentity = prepareSqliteDatabaseAdmission(resolvedLocation, { create: options?.readOnly !== true });
		sqlite.DatabaseSync.prototype.open.call(database);
		try {
			bindSqliteDatabaseAdmission(database, reopenedIdentity);
		} catch (error) {
			database.close();
			throw error;
		}
	};
	trackSqliteSchema(database, {
		DatabaseSync: sqlite.DatabaseSync,
		StatementSync: sqlite.StatementSync,
		iteratorBehavior: assertSafeSqliteRuntime(sqlite)
	}, options?.readOnly !== true);
	if (!getSqliteRuntimeCapabilities().explicitSqliteCloseReleasesNativeResources) registerNodeSqliteDisposeCallback(database, () => {});
	registerSqliteReaderConnection(database);
	return database;
}
//#endregion
//#region src/infra/sqlite-busy-timeout.ts
const lockFailureReportingByDatabase = /* @__PURE__ */ new WeakMap();
const { busyTimeoutByDatabase, trackedDatabases } = resolveGlobalSingleton(Symbol.for("openclaw.sqliteBusyTimeout"), () => ({
	busyTimeoutByDatabase: /* @__PURE__ */ new WeakMap(),
	trackedDatabases: /* @__PURE__ */ new WeakSet()
}));
function rememberSqliteBusyTimeout(database, busyTimeoutMs) {
	if (!trackedDatabases.has(database)) {
		trackedDatabases.add(database);
		registerNodeSqliteDisposeCallback(database, () => busyTimeoutByDatabase.delete(database));
	}
	busyTimeoutByDatabase.set(database, busyTimeoutMs);
}
function normalizeSqliteNonNegativeInteger(value, label) {
	if (!Number.isInteger(value) || value < 0) throw new Error(`${label} must be a non-negative integer`);
	return value;
}
function readSqliteBusyTimeout(database) {
	const known = busyTimeoutByDatabase.get(database);
	if (known !== void 0) return known;
	const row = database.prepare("PRAGMA busy_timeout").get();
	const value = row?.busy_timeout ?? row?.timeout;
	const busyTimeoutMs = typeof value === "bigint" ? Number(value) : Number(value ?? 0);
	rememberSqliteBusyTimeout(database, busyTimeoutMs);
	return busyTimeoutMs;
}
/** All policy changes on a managed connection go through this owner. */
function setSqliteBusyTimeout(database, busyTimeoutMs) {
	const normalizedTimeoutMs = normalizeSqliteNonNegativeInteger(busyTimeoutMs, "busyTimeoutMs");
	if (busyTimeoutByDatabase.get(database) === normalizedTimeoutMs) return;
	database.exec(`PRAGMA busy_timeout = ${normalizedTimeoutMs}`);
	rememberSqliteBusyTimeout(database, normalizedTimeoutMs);
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
	setSqliteBusyTimeout(database, normalizedTimeoutMs);
	let restored = false;
	const restore = () => {
		if (restored) return;
		if (database.isOpen && previousBusyTimeoutMs !== normalizedTimeoutMs) setSqliteBusyTimeout(database, previousBusyTimeoutMs);
		if (previousLockFailureReporting) lockFailureReportingByDatabase.set(database, previousLockFailureReporting);
		else lockFailureReportingByDatabase.delete(database);
		restored = true;
	};
	try {
		return operation(restore);
	} finally {
		restore();
	}
}
//#endregion
export { registerNodeSqliteDisposeCallback as $, findSqlClosingParenthesis as $t, prepareSqliteQueryTakeFirstSync as A, readFileWindowFullySync as An, prepareSqliteTransactionCommit as At, captureSqliteWorkerClosePolicy as B, AsyncWorkScope as Bt, require_semver as C, OpenClawStateOwnershipError as Cn, retireSqliteDatabaseAdmissionForPath as Ct, getNodeSqliteKysely as D, runWithSqliteCleanup as Dn, deferSqlitePostCommitPublication as Dt, executeSqliteQueryTakeFirstSync as E, createSqliteLifecycleAggregateError as En, trackSqliteDatabaseAdmissionWorker as Et, readSqliteReaderDiagnosticsForPath as F, OPENCLAW_STATE_SCHEMA_SQL as Ft, captureSqliteSchemaFacts as G, CANONICAL_READY_COLUMN_DEFINITION as Gt, ensureSqliteLibrarySelected as H, createDeferredCore as Ht, sqliteReaderDatabasePathKey as I, OPENCLAW_AGENT_SCHEMA_SQL as It, runSqliteSchemaReadSnapshotSync as J, hasPendingAgentStartupColumns as Jt, readSqliteTextEncoding as K, FIRST_USE_ADDITIVE_AGENT_COLUMN_DEFINITIONS as Kt, sql as L, VERSION as Lt, assertNoActiveSqliteReaders as M, stageSqliteCommittedPublication as Mt, captureSqliteReaderOwner as N, stageSqliteTransactionState as Nt, iterateSqliteQuerySync as O, throwSqliteLifecycleErrors as On, discardSqliteTransactionState as Ot, currentSqliteOperationTiming as P, withSqlitePostCommitPublications as Pt, executeWithCachedStatement as Q, extractSqliteTableSchema as Qt, expressionBuilder as R, resolveRuntimeServiceCommit as Rt, runSqliteReadOperationSync as S, OpenClawStateExternalOwnershipError as Sn, retainSqliteDatabaseAdmissionLocation as St, executeSqliteQuerySync as T, SqliteCoordinatorError as Tn, revokeSqliteDatabaseAdmissionsForPath as Tt, getSqliteRuntimeCapabilities as U, runInDetachedAsyncContext as Ut, captureSqliteWorkerEnvironmentData as V, runOutsideAsyncWorkScope as Vt, parseDiagnosticEnvFlags as W, materializeErrorStack as Wt, disposeNodeSqliteDependents as X, createSqliteTableContract as Xt, clearNodeSqliteKyselyCacheForDatabase as Y, createSqliteIndexContract as Yt, enableNodeSqliteKyselyStatementCache as Z, parseSqliteTableDefinition as Zt, getAdmittedSqliteSchemaFacts as _, resolveDatabasePathKey as _n, readSqliteDatabaseCleanClose as _t, shouldReportSqliteLockFailure as a, splitSqlList as an, getOrLoadSqliteDatabaseAdmissionForPath as at, readSqliteNativeMutationRevision as b, isPostgresSqlConnection as bn, recordSqliteDatabaseIntegrity as bt, requireNodeSqlite as c, assertDatabaseFileIdentity as cn, hasPendingSqliteDatabaseSchemaMutation as ct, resolveSqliteFilesystemPath as d, inspectDatabasePathIdentitySync as dn, invalidateLocalSqliteSchemaAdmissions as dt, normalizeSchemaSql as en, registerNodeSqliteKyselyQueryErrorHandler as et, supportsNodeSqliteExtensionLoading as f, normalizeDatabasePath as fn, onSqliteDatabaseWriteSettled as ft, canReuseSqliteSchemaInTransaction as g, readDatabasePathIdentitySync as gn, publishSqliteDatabaseSchemaChange as gt, adoptSqliteSchemaFacts as h, readDatabasePathIdentity as hn, publishSqliteDatabaseAdmission as ht, setSqliteBusyTimeout as i, readSqlToken as in, finishSqliteDatabaseWrite as it, sqliteStringSet as j, publishSqliteCommittedState as jt, prepareSqliteQuerySync as k, isPromiseLike as kn, hasSqlitePostCommitScope as kt, resolveExistingSqliteFileUri as l, assertExistingDatabaseIdentity as ln, hasSqliteDatabaseSchemaAdmissionForPath as lt, admitSqliteSchema as m, readDatabaseIdentityBirthtime as mn, prepareSqliteDatabaseCleanClose as mt, readSqliteBusyTimeout as n, normalizeSqlWhitespace as nn, canShareSqliteDatabaseAdmissions as nt, installSqliteNativeRuntimeAdmission as o, createSqliteDatabaseAdmissionCursor as on, getSqliteDatabaseAdmission as ot, supportsNodeSqliteJsonb as p, readDatabaseFileIdentity as pn, prepareSqliteDatabaseAdmission as pt, schemaAdmission as q, STARTUP_ADDITIVE_AGENT_COLUMN_DEFINITIONS as qt, runWithSqliteBusyTimeout as r, quoteSqliteIdentifier as rn, captureSqliteDatabaseAdmissions as rt, openNodeSqliteDatabase as s, readSqliteDatabaseAdmissions as sn, getSqliteDatabaseAdmissionIdentityForPath as st, normalizeSqliteNonNegativeInteger as t, normalizeSqlIdentifier as tn, beginSqliteDatabaseWrite as tt, resolveImmutableSqliteFileUri as u, findChangedDatabasePaths as un, installSqliteDatabaseAdmissions as ut, invalidateSqliteSchemaFacts as v, assertPostgresTransactionUsable as vn, readSqliteDatabaseIntegrityVerification as vt, createSqliteQueryCache as w, OpenClawStateOwnershipMetadataError as wn, revokeSqliteDatabaseAdmissions as wt, registerSqliteSchemaMutationListener as x, sqlPublicationAnchor as xn, resolveSqliteDatabaseFilePath as xt, isSqliteSchemaAdmissionCold as y, assertSyncTransactionResult as yn, readSqliteDatabaseWriteRevision as yt, SQLITE_EXPECTED_SCHEMA_CONTRACTS_KEY as z, resolveOpenClawPackageRootSync as zt };
