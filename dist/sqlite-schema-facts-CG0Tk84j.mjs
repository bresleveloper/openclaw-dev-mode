import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { c as registerNodeSqliteDisposeCallback, i as executeWithCachedStatement } from "./kysely-sync-cache-state-eUau8Jaa.mjs";
import { n as findSqlCharacter } from "./sqlite-schema-sql-CKIqAlrf.mjs";
import { u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
//#region src/infra/sqlite-pinned-read-snapshot.ts
const snapshots = resolveGlobalSingleton(Symbol.for("openclaw.sqlitePinnedReadSnapshots"), () => /* @__PURE__ */ new WeakMap());
function getSqlitePinnedReadSnapshot(db) {
	return snapshots.get(db);
}
/** Pin an implicit read snapshot without requiring transaction-control authorization. */
function runSqlitePinnedReadSnapshotSync(db, operation) {
	const parent = snapshots.get(db);
	snapshots.set(db, parent ?? {});
	try {
		return executeWithCachedStatement(db, "PRAGMA schema_version", [], (statement) => {
			const snapshot = statement.iterate();
			try {
				const first = snapshot.next();
				if (first.done) throw new Error("SQLite schema version query returned no row");
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
//#region src/infra/sqlite-schema-facts.ts
const scopes = resolveGlobalSingleton(Symbol.for("openclaw.sqliteSchemaScopes"), () => {
	const byIdentity = /* @__PURE__ */ new Map();
	const release = (scope) => {
		scope.users -= 1;
		if (scope.users === 0 && scope.key && byIdentity.get(scope.key) === scope) byIdentity.delete(scope.key);
	};
	return {
		byIdentity,
		release,
		finalizer: new FinalizationRegistry(release)
	};
});
const owners = resolveGlobalSingleton(Symbol.for("openclaw.sqliteSchemaFacts"), () => /* @__PURE__ */ new WeakMap());
function invalidate(owner) {
	owner.revision += 1;
	owner.facts = void 0;
}
function bindScope(database, owner) {
	if (owner.scope) return owner.scope;
	const location = database.location();
	const key = location ? readDatabasePathIdentitySync(location).key : void 0;
	const scope = key && scopes.byIdentity.get(key) || {
		key,
		revision: 0,
		users: 0
	};
	if (key) scopes.byIdentity.set(key, scope);
	scope.users += 1;
	owner.scope = scope;
	owner.scopeRevision = scope.revision;
	scopes.finalizer.register(database, scope, owner);
	return scope;
}
function publishSchemaChange(database, owner) {
	const scope = bindScope(database, owner);
	scope.revision += 1;
	owner.scopeRevision = scope.revision;
}
/** Schema publications outside DDL (such as a deferred version marker) share this revision. */
function invalidateSqliteSchemaFacts(database) {
	const owner = owners.get(database);
	if (owner) {
		bindScope(database, owner);
		invalidate(owner);
		owner.transactionalSchema ||= database.isTransaction;
		if (!database.isTransaction) publishSchemaChange(database, owner);
	}
}
function changesSchema(sql) {
	return /\b(?:CREATE|ALTER|DROP|REINDEX|VACUUM)\b|\bPRAGMA\b[\s\S]*\b(?:user_version|schema_version|writable_schema)\b[\s\S]*[=(]/i.test(sql);
}
const transactionControlPrefix = /^(?:\s|;|--[^\n]*(?:\n|$)|\/\*(?:[^*]|\*(?!\/))*\*\/)*(BEGIN|SAVEPOINT|COMMIT|END|RELEASE|ROLLBACK)\b/i;
function batchTransactionControl(sql) {
	let control;
	let remaining = sql;
	while (remaining) {
		const next = transactionControlPrefix.exec(remaining)?.[1]?.toUpperCase();
		if (next === "ROLLBACK") return next;
		control ||= next;
		const end = remaining.includes(";") ? findSqlCharacter(remaining, ";") : -1;
		if (end < 0) break;
		remaining = remaining.slice(end + 1);
	}
	return control;
}
function callStatement(method, [first, ...remaining]) {
	if (first === void 0) return method();
	if (typeof first === "object" && first !== null && !ArrayBuffer.isView(first)) return method(first, ...remaining);
	return method(first, ...remaining);
}
function trackSchemaChanges(database, owner, native) {
	const settle = (boundary = false) => {
		if ((boundary || !database.isTransaction) && (owner.transactionalSchema || owner.transactionalFacts)) {
			if (owner.transactionalSchema) publishSchemaChange(database, owner);
			invalidate(owner);
			owner.transactionalSchema &&= database.isTransaction;
			owner.transactionalFacts = false;
		}
	};
	const execute = (operation, schemaChange, control) => {
		if (owner.transactionalSchema && !owner.scope) bindScope(database, owner);
		settle();
		const invalidates = schemaChange || control === "ROLLBACK" && owner.transactionalSchema;
		if (invalidates) invalidateSqliteSchemaFacts(database);
		try {
			return operation();
		} finally {
			if (invalidates) invalidateSqliteSchemaFacts(database);
			settle(Boolean(control));
		}
	};
	database.exec = (sql) => execute(() => native.DatabaseSync.prototype.exec.call(database, sql), changesSchema(sql), batchTransactionControl(sql));
	database.prepare = (...prepareArgs) => {
		const [sql] = prepareArgs;
		const statement = native.DatabaseSync.prototype.prepare.call(database, ...prepareArgs);
		const schemaChange = changesSchema(sql);
		const control = transactionControlPrefix.exec(sql)?.[1]?.toUpperCase();
		if (schemaChange || control) {
			const run = Object.hasOwn(statement, "run") ? statement.run.bind(statement) : void 0;
			const get = Object.hasOwn(statement, "get") ? statement.get.bind(statement) : void 0;
			const all = Object.hasOwn(statement, "all") ? statement.all.bind(statement) : void 0;
			const iterate = Object.hasOwn(statement, "iterate") ? statement.iterate.bind(statement) : void 0;
			statement.run = (...bindings) => execute(() => callStatement(run ?? native.StatementSync.prototype.run.bind(statement), bindings), schemaChange, control);
			statement.get = (...bindings) => execute(() => callStatement(get ?? native.StatementSync.prototype.get.bind(statement), bindings), schemaChange, control);
			statement.all = (...bindings) => execute(() => callStatement(all ?? native.StatementSync.prototype.all.bind(statement), bindings), schemaChange, control);
			statement.iterate = function* (...bindings) {
				if (owner.transactionalSchema && !owner.scope) bindScope(database, owner);
				settle();
				const invalidates = schemaChange || control === "ROLLBACK" && owner.transactionalSchema;
				if (invalidates) invalidateSqliteSchemaFacts(database);
				try {
					yield* callStatement(iterate ?? native.StatementSync.prototype.iterate.bind(statement), bindings);
				} finally {
					if (invalidates) invalidateSqliteSchemaFacts(database);
					settle(Boolean(control));
				}
			};
		}
		return statement;
	};
	if (typeof database.setAuthorizer === "function") database.setAuthorizer = (callback) => {
		native.DatabaseSync.prototype.setAuthorizer.call(database, callback);
		owner.authorizerActive = callback !== null;
		invalidate(owner);
	};
	registerNodeSqliteDisposeCallback(database, () => {
		invalidate(owner);
		owner.dataVersion = void 0;
		owner.readDataVersion = void 0;
		if (owner.scope) {
			scopes.finalizer.unregister(owner);
			scopes.release(owner.scope);
			owner.scope = void 0;
			owner.scopeRevision = void 0;
		}
	});
}
/** Share freshness only within this synchronous call stack, never across an await. */
function runSqliteReadOperationSync(database, operation) {
	const owner = owners.get(database);
	if (!owner?.admitted || owner.authorizerActive) return operation();
	owner.readDepth += 1;
	try {
		return operation();
	} finally {
		owner.readDepth -= 1;
		if (owner.readDepth === 0) owner.readDataVersion = void 0;
	}
}
/** Always execute a fresh probe; compare versions only on the same connection. */
function readSqliteDataVersion(database) {
	const row = executeWithCachedStatement(database, "PRAGMA data_version", [], (statement) => statement.get());
	if (typeof row?.data_version !== "number") throw new Error("SQLite did not return a numeric PRAGMA data_version");
	return row.data_version;
}
/** Foreign commits are observed on the next operation; SQLite owns snapshot visibility. */
function readSqliteCacheDataVersion(database) {
	const tracked = owners.get(database);
	const owner = tracked?.admitted ? tracked : void 0;
	if (owner && !owner.authorizerActive && owner.readDataVersion !== void 0) return owner.readDataVersion;
	const dataVersion = readSqliteDataVersion(database);
	if (owner) {
		if (owner.dataVersion !== dataVersion) {
			const facts = owner.facts;
			if (!(facts && runSqlitePinnedReadSnapshotSync(database, (schemaVersion) => {
				const userVersion = executeWithCachedStatement(database, "PRAGMA user_version", [], (s) => s.get());
				return facts.schemaVersion === schemaVersion && facts.userVersion === userVersion?.user_version;
			}))) invalidate(owner);
			owner.dataVersion = dataVersion;
		}
		if (owner.readDepth > 0 && !owner.authorizerActive) owner.readDataVersion = dataVersion;
	}
	return dataVersion;
}
/** Install at native open, before callers can retain statements or install an authorizer. */
function trackSqliteSchema(database, native) {
	if (!owners.has(database)) {
		const owner = {
			admitted: false,
			revision: 0,
			readDepth: 0,
			transactionalSchema: false,
			transactionalFacts: false,
			authorizerActive: false
		};
		owners.set(database, owner);
		trackSchemaChanges(database, owner, native);
	}
}
/** Only database admission opts a connection into retained schema facts. */
function admitSqliteSchema(database) {
	const owner = owners.get(database);
	if (!owner) throw new Error("SQLite schema admission requires a connection tracked from native open");
	owner.admitted = true;
	getAdmittedSqliteSchemaFacts(database);
}
/** Schema changes revoke the admission; ordinary reads consume its recorded facts. */
function getAdmittedSqliteSchemaFacts(database) {
	const owner = owners.get(database);
	if (!owner?.admitted || owner.authorizerActive) return;
	readSqliteCacheDataVersion(database);
	const snapshot = getSqlitePinnedReadSnapshot(database);
	if (owner.snapshot && owner.snapshot !== snapshot) {
		invalidate(owner);
		owner.snapshot = void 0;
	}
	const scope = bindScope(database, owner);
	if (owner.scopeRevision !== scope.revision) {
		invalidate(owner);
		owner.scopeRevision = scope.revision;
	}
	if ((owner.transactionalSchema || owner.transactionalFacts) && !database.isTransaction) {
		if (owner.transactionalSchema) publishSchemaChange(database, owner);
		invalidate(owner);
		owner.transactionalSchema = false;
		owner.transactionalFacts = false;
	}
	if (!owner.facts) {
		owner.snapshot = snapshot;
		owner.transactionalFacts = database.isTransaction;
		owner.facts = runSqlitePinnedReadSnapshotSync(database, (schemaVersion) => {
			const userVersion = executeWithCachedStatement(database, "PRAGMA user_version", [], (s) => s.get());
			const tables = executeWithCachedStatement(database, "SELECT name, sql FROM main.sqlite_schema WHERE type = 'table'", [], (s) => s.all());
			return {
				revision: owner.revision,
				userVersion: Number(userVersion?.user_version ?? 0),
				schemaVersion,
				tables: new Set(tables.flatMap((row) => typeof row.name === "string" ? [row.name] : [])),
				tableSql: new Map(tables.flatMap((row) => typeof row.name === "string" ? [[row.name, typeof row.sql === "string" ? row.sql : null]] : []))
			};
		});
	}
	return owner.facts;
}
//#endregion
export { readSqliteDataVersion as a, runSqlitePinnedReadSnapshotSync as c, readSqliteCacheDataVersion as i, getAdmittedSqliteSchemaFacts as n, runSqliteReadOperationSync as o, invalidateSqliteSchemaFacts as r, trackSqliteSchema as s, admitSqliteSchema as t };
