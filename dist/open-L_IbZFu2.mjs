import { s as redactSensitiveText } from "./redact-BcXJu5HP.mjs";
import { r as resolveRuntimeWorkerThreadExecArgv } from "./runtime-worker-url-CvMrvFI1.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-BCfqgqXF.mjs";
import { r as recordWorkerMessage } from "./worker-message-metrics-CcNXClPZ.mjs";
import { i as sqlPublicationAnchor, n as assertSyncTransactionResult, r as isPostgresSqlConnection, t as assertPostgresTransactionUsable } from "./sql-connection-DmQzXTVz.mjs";
import { b as publishSqliteDatabaseAdmission, c as getSqliteDatabaseAdmission, h as invalidateLocalSqliteSchemaAdmissions, o as finishSqliteDatabaseWrite, t as beginSqliteDatabaseWrite, x as publishSqliteDatabaseSchemaChange } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { c as withSqlitePostCommitPublications, s as stageSqliteTransactionState } from "./sqlite-post-commit-22SfWsLt.mjs";
import { o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as runSqliteImmediateTransactionSync, o as runSqliteReadSnapshotSync, r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as postgresSchemaMetadataSql, c as verifyAndRecordPostgresSchema, i as admitPostgresCapabilities, l as verifyPostgresSchema, m as assertEngineStoreExecutionAllowed, o as postgresSchemaSql, s as readPostgresSchema, t as admitPostgresPhysicalFacts } from "./physical-facts-Cvtfrs3r.mjs";
import { c as SqliteWorkerError } from "./sqlite-worker-contract-DhDutMia.mjs";
import { a as deferSqliteWorkerCommitReceipt, p as currentSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { createHash, randomUUID } from "node:crypto";
import { MessageChannel, Worker, receiveMessageOnPort, threadId } from "node:worker_threads";
import { channel } from "node:diagnostics_channel";
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
function observeDatabaseRequest(engine, operation) {
	const target = channels.request;
	if (!target.hasSubscribers) return operation();
	return (async () => {
		const started = performance.now();
		let outcome = "error";
		try {
			const result = await operation();
			outcome = "ok";
			return result;
		} finally {
			target.publish({
				engine,
				threadId,
				outcome,
				durationMs: performance.now() - started
			});
		}
	})();
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
/** Worker envelopes need a transaction only on PostgreSQL; native SQLite statements stay identical. */
function runEngineWorkerWrite(input, operation, transaction) {
	return input ? transaction(operation) : operation();
}
function runEngineStoreReadSnapshot(db, operation) {
	return isPostgresSqlConnection(db) ? runSqliteReadSnapshotSync(db, operation) : runSqliteDeferredTransactionSync(db, operation);
}
/** Dedicated streaming readers retain this snapshot until their last host acknowledgement. */
function beginEngineStoreReadSnapshot(db) {
	if (db.isTransaction) throw new Error("Streaming read snapshot requires a dedicated connection");
	db.exec(isPostgresSqlConnection(db) ? "BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY" : "BEGIN DEFERRED");
	return { close() {
		if (db.isTransaction) db.exec("ROLLBACK");
	} };
}
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
export { runEngineWorkerWrite as a, runEngineStoreReadSnapshot as i, readEngineAnchor as n, decodePostgresRows as o, beginEngineStoreReadSnapshot as r, observeDatabaseRequest as s, openEngineStore as t };
