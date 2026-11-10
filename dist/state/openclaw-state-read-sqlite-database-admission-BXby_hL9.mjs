import { n as registerListener, s as resolveGlobalSingleton, t as notifyListeners } from "./openclaw-state-read-listeners-C6ALBiqg.mjs";
import { d as isPostgresSqlConnection, f as sqlPublicationAnchor } from "./openclaw-state-read-sqlite-reader-lifecycle-CGTFS3iz.mjs";
import { a as isRecord, t as asNullableRecord } from "./openclaw-state-read-record-coerce-DWp7lFsP.mjs";
import { F as escapeRegExp, I as normalizeWindowsPathPreservingCase, U as isMissingPathError, h as getPluginExecutionFrame, t as createSubsystemLogger } from "./openclaw-state-read-subsystem-S9LTuPwa.mjs";
import { E as normalizeLowercaseStringOrEmpty, k as normalizeOptionalString } from "./openclaw-state-read-types.secrets-Wz8lmfvB.mjs";
import { n as readFileDescriptorBoundedSync } from "./openclaw-state-read-bounded-read-CQOkim7o.mjs";
import { n as hasNodeErrorCode } from "./openclaw-state-read-path-DKRN8JwZ.mjs";
import { n as readFileWindowFullySync } from "./openclaw-state-read-positional-read-CqU0x7kD.mjs";
import "./openclaw-state-read-errors-BV4NDRNo.mjs";
import { t as isPromiseLike } from "./openclaw-state-read-promise-like-D7-l5Fsp.mjs";
import "./openclaw-state-read-detached-async-context-BrFwufJ7.mjs";
import { t as createDeferredCore } from "./openclaw-state-read-deferred-D0La5CRk.mjs";
import { createRequire } from "node:module";
import fs, { fstatSync, readdirSync, realpathSync, statSync, default as openClawRootFsSync } from "node:fs";
import path from "node:path";
import { getEnvironmentData, setEnvironmentData, threadId } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import { toUSVString } from "node:util";
import { createHash, randomUUID } from "node:crypto";
import { AsyncLocalStorage, AsyncResource } from "node:async_hooks";
import { realpath, stat } from "node:fs/promises";
import { isUtf8 } from "node:buffer";
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
function getPluginCacheRoot(rootDir) {
	const cache = getPluginCache();
	const cached = cache.roots.get(cache.rootAliases.get(rootDir) ?? rootDir);
	if (cached) return cached;
	const lexical = path.resolve(rootDir);
	const key = cache.rootAliases.get(lexical) ?? lexical;
	let root = cache.roots.get(key);
	if (!root) {
		root = {
			rootDir: key,
			files: /* @__PURE__ */ new Map(),
			checkedEntries: /* @__PURE__ */ new Map(),
			paths: /* @__PURE__ */ new Map(),
			artifactLoadsInProgress: /* @__PURE__ */ new Set(),
			artifacts: /* @__PURE__ */ new Map(),
			runtimeArtifacts: /* @__PURE__ */ new Map(),
			entryBoundaries: /* @__PURE__ */ new Map(),
			entryPaths: /* @__PURE__ */ new Map()
		};
		cache.roots.set(key, root);
	}
	return root;
}
function mergeRootFacts(target, source) {
	for (const [key, value] of source) if (!target.has(key)) target.set(key, value);
}
/** Bind aliases only after a checked file establishes their shared package boundary. */
function bindPluginCacheRoot(rootDir, canonicalRoot) {
	const cache = getPluginCache();
	const lexical = path.resolve(rootDir);
	const canonical = path.resolve(canonicalRoot);
	const root = getPluginCacheRoot(lexical);
	root.rootDir = canonical;
	const existing = cache.roots.get(canonical);
	if (existing && existing !== root) {
		mergeRootFacts(root.files, existing.files);
		mergeRootFacts(root.checkedEntries, existing.checkedEntries);
		mergeRootFacts(root.paths, existing.paths);
		mergeRootFacts(root.artifacts, existing.artifacts);
		mergeRootFacts(root.runtimeArtifacts, existing.runtimeArtifacts);
		mergeRootFacts(root.entryBoundaries, existing.entryBoundaries);
		mergeRootFacts(root.entryPaths, existing.entryPaths);
		root.directory ??= existing.directory;
		root.publicSurfaceBoundary ??= existing.publicSurfaceBoundary;
		for (const artifact of existing.artifactLoadsInProgress) root.artifactLoadsInProgress.add(artifact);
		Object.assign(existing, root);
	}
	cache.roots.set(canonical, root);
	cache.rootAliases.set(lexical, canonical);
	return root;
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
/** TEMP-trigger owners already see their own writes and only need sibling settlement. */
function readSqliteDatabaseSiblingWriteRevision(connection) {
	const database = sqlPublicationAnchor(connection);
	const revision = readSqliteDatabaseWriteRevision(database);
	return revision === void 0 ? void 0 : revision - (state.localWriteRevisions.get(database) ?? 0) | 0;
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
function withSqliteDatabaseAdmissionExchange(exchangeOwner, operation) {
	return state.exchange.run(exchangeOwner, operation);
}
/** Unsupported worker hosts retain native validation instead of waiting for unpublished facts. */
function canShareSqliteDatabaseAdmissions() {
	return threadId === 0 || state.exchange.getStore() !== void 0;
}
const inherited = readSqliteDatabaseAdmissions(getEnvironmentData(SQLITE_DATABASE_ADMISSIONS_KEY));
if (inherited) installSqliteDatabaseAdmissions(inherited);
//#endregion
export { resolveOpenClawPackageRootSync as $, revokeSqliteDatabaseAdmissionsForPath as A, normalizeDatabasePath as At, stageSqliteTransactionState as B, readSqliteDatabaseWriteRevision as C, splitSqlList as Ct, retainSqliteDatabaseAdmissionLocation as D, assertExistingDatabaseIdentity as Dt, resolveSqliteDatabaseFilePath as E, readSqliteDatabaseAdmissions as Et, discardSqliteTransactionState as F, resolveDatabasePathKey as Ft, SqliteCoordinatorError as G, OpenClawStateExternalOwnershipError as H, hasSqlitePostCommitScope as I, SQLITE_DATABASE_ADMISSIONS_KEY as It, throwSqliteLifecycleErrors as J, createSqliteLifecycleAggregateError as K, prepareSqliteTransactionCommit as L, trackSqliteDatabaseAdmissionWorker as M, readDatabaseIdentityBirthtime as Mt, withSqliteDatabaseAdmissionExchange as N, readDatabasePathIdentity as Nt, retireSqliteDatabaseAdmissionForPath as O, findChangedDatabasePaths as Ot, deferSqlitePostCommitPublication as P, readDatabasePathIdentitySync as Pt, resolveRuntimeServiceCommit as Q, publishSqliteCommittedState as R, readSqliteDatabaseSiblingWriteRevision as S, readSqlToken as St, releaseSqliteDatabaseAdmission as T, createSqliteDatabaseAdmissionCursor as Tt, OpenClawStateOwnershipError as U, withSqlitePostCommitPublications as V, OpenClawStateOwnershipMetadataError as W, OPENCLAW_AGENT_SCHEMA_SQL as X, OPENCLAW_STATE_SCHEMA_SQL as Y, VERSION as Z, prepareSqliteDatabaseCleanClose as _, hasUnquotedSqlKeyword as _t, discardSqliteDatabaseTransactionAdmissions as a, materializeErrorStack as at, readSqliteDatabaseCleanClose as b, normalizeSqlWhitespace as bt, getSqliteDatabaseAdmission as c, SESSION_OWNER_COLUMN_DEFINITIONS as ct, hasPendingSqliteDatabaseSchemaMutation as d, createSqliteIndexContract as dt, bindPluginCacheRoot as et, hasSqliteDatabaseSchemaAdmissionForPath as f, createSqliteTableContract as ft, prepareSqliteDatabaseAdmission as g, findSqlClosingParenthesis as gt, onSqliteDatabaseWriteSettled as h, findSqlCharacter as ht, captureSqliteDatabaseAdmissions as i, runOutsideAsyncWorkScope as it, suspendSqliteDatabaseAdmission as j, readDatabaseFileIdentity as jt, revokeSqliteDatabaseAdmissions as k, inspectDatabasePathIdentitySync as kt, getSqliteDatabaseAdmissionIdentityForPath as l, STARTUP_ADDITIVE_AGENT_COLUMN_DEFINITIONS as lt, invalidateLocalSqliteSchemaAdmissions as m, extractSqliteTableSchema as mt, bindSqliteDatabaseAdmission as n, getPluginCacheRoot as nt, finishSqliteDatabaseWrite as o, CANONICAL_READY_COLUMN_DEFINITION as ot, installSqliteDatabaseAdmissions as p, parseSqliteTableDefinition as pt, runWithSqliteCleanup as q, canShareSqliteDatabaseAdmissions as r, AsyncWorkScope as rt, getOrLoadSqliteDatabaseAdmissionForPath as s, FIRST_USE_ADDITIVE_AGENT_COLUMN_DEFINITIONS as st, beginSqliteDatabaseWrite as t, getPluginCache as tt, getSqliteDatabaseSchemaRevision as u, hasPendingAgentStartupColumns as ut, publishSqliteDatabaseAdmission as v, normalizeSchemaSql as vt, recordSqliteDatabaseIntegrity as w, beginSqliteDatabaseAdmissionOperation as wt, readSqliteDatabaseIntegrityVerification as x, quoteSqliteIdentifier as xt, publishSqliteDatabaseSchemaChange as y, normalizeSqlIdentifier as yt, stageSqliteCommittedPublication as z };
