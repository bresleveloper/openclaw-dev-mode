import { c as coerceErrorMessage, d as extractErrorCode, s as resolveGlobalSingleton } from "./openclaw-state-read-listeners-C6ALBiqg.mjs";
import { C as readSqliteDatabaseWriteRevision, St as readSqlToken, T as releaseSqliteDatabaseAdmission, _t as hasUnquotedSqlKeyword, a as discardSqliteDatabaseTransactionAdmissions, bt as normalizeSqlWhitespace, c as getSqliteDatabaseAdmission, ht as findSqlCharacter, j as suspendSqliteDatabaseAdmission, m as invalidateLocalSqliteSchemaAdmissions, o as finishSqliteDatabaseWrite, t as beginSqliteDatabaseWrite, u as getSqliteDatabaseSchemaRevision, v as publishSqliteDatabaseAdmission, vt as normalizeSchemaSql, wt as beginSqliteDatabaseAdmissionOperation, xt as quoteSqliteIdentifier, y as publishSqliteDatabaseSchemaChange, yt as normalizeSqlIdentifier } from "./openclaw-state-read-sqlite-database-admission-BXby_hL9.mjs";
import { d as isPostgresSqlConnection } from "./openclaw-state-read-sqlite-reader-lifecycle-CGTFS3iz.mjs";
import { a as isRecord, n as asOptionalObjectRecord } from "./openclaw-state-read-record-coerce-DWp7lFsP.mjs";
import { T as registerNodeSqliteDisposeCallback, w as executeWithCachedStatement } from "./openclaw-state-read-kysely-sync-DrKJlREt.mjs";
import { randomUUID } from "node:crypto";
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
/** Reuse row facts only inside admitted reads, never during a native write or snapshot. */
function getSqliteReadOperationRevision(database) {
	if (isPostgresSqlConnection(database)) return;
	if (database.isTransaction || getSqlitePinnedReadSnapshot(database)) return;
	const revision = getSqliteReadScopeRevision(database);
	return revision?.snapshot === void 0 ? revision : void 0;
}
/** Stable identity for row facts in the admitted operation's current SQLite snapshot. */
function getSqliteReadScopeRevision(database) {
	if (isPostgresSqlConnection(database)) return;
	const owner = owners.get(database);
	if (owner) observeSqliteTransactionState(database, owner);
	if (!owner?.admitted || !owner.facts || owner.authorizerActive || owner.readDepth === 0 || owner.mutationDepth !== 0 || owner.unmanagedSnapshots.size > 0) return;
	const snapshot = getSqlitePinnedReadSnapshot(database) ?? (database.isTransaction ? owner.transactionSnapshot ??= {} : void 0);
	const previous = owner.readRevision;
	if (snapshot) {
		if (previous?.schema === owner.facts && previous.snapshot === snapshot && previous.mutationRevision === owner.mutationRevision) return previous;
		return owner.readRevision = {
			schema: owner.facts,
			mutationRevision: owner.mutationRevision,
			snapshot,
			writeRevision: void 0
		};
	}
	const writeRevision = readSqliteDatabaseWriteRevision(database);
	if (writeRevision === void 0) return;
	if (previous?.schema === owner.facts && previous.snapshot === void 0 && previous.writeRevision === writeRevision && previous.mutationRevision === owner.mutationRevision) return previous;
	return owner.readRevision = {
		schema: owner.facts,
		snapshot: void 0,
		writeRevision,
		mutationRevision: owner.mutationRevision
	};
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
//#region src/infra/sqlite-error-diagnostics.ts
const SQLITE_INSPECTION_OPERATIONS = {
	source: "opening the source database",
	snapshot: "creating its private snapshot"
};
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
function isSqliteNativeOpenFailure(error) {
	return error !== null && typeof error === "object" && nativeOpenFailures.has(error);
}
function markSqliteInspectionOperation(error, operation) {
	if (error !== null && typeof error === "object" && !inspectionOperations.has(error)) inspectionOperations.set(error, operation);
	return error;
}
function formatSqliteReadOnlyInspectionFailure(error) {
	const message = coerceErrorMessage(error);
	const { suffix, operation } = readSqliteErrorDetails(error);
	const details = `${message}${suffix}`;
	return operation === void 0 ? details : `failed while ${SQLITE_INSPECTION_OPERATIONS[operation]}: ${details}`;
}
function readSqliteErrorDetails(error) {
	const details = /* @__PURE__ */ new Set();
	let operation;
	for (let current = error, depth = 0; depth < 8 && isRecord(current); depth += 1) {
		operation = inspectionOperations.get(current) ?? operation;
		const code = extractErrorCode(current);
		if (code && /^[A-Z0-9_]{1,64}$/u.test(code)) details.add(`code=${code}`);
		const { errcode } = current;
		if (typeof errcode === "number" && Number.isInteger(errcode) && errcode >= 0 && errcode <= 2147483647) details.add(`errcode=${errcode}`);
		current = current.cause;
	}
	return {
		suffix: details.size > 0 ? ` (${[...details].join(", ")})` : "",
		operation
	};
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
export { captureSqliteSchemaFacts as C, probeSqliteIteratorBehavior as D, runSqliteSchemaReadSnapshotSync as E, trackSqliteSchema as S, schemaAdmission as T, invalidateSqliteSchemaFacts as _, markSqliteInspectionOperation as a, registerSqliteSchemaMutationListener as b, sqliteExtendedResultCode as c, admitSqliteSchema as d, adoptSqliteSchemaFacts as f, getSqliteReadScopeRevision as g, getSqliteReadOperationRevision as h, isSqliteNativeOpenFailure as i, sqlitePrimaryResultCode as l, getAdmittedSqliteSchemaFacts as m, isSqliteCorruptionError as n, markSqliteNativeOpenFailure as o, canReuseSqliteSchemaInTransaction as p, isSqliteLockError as r, sqliteErrorCode as s, formatSqliteReadOnlyInspectionFailure as t, withSqliteNativeOpen as u, isSqliteSchemaAdmissionCold as v, readSqliteTextEncoding as w, runSqliteReadOperationSync as x, readSqliteNativeMutationRevision as y };
