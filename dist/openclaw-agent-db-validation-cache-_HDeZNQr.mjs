import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { c as registerNodeSqliteDisposeCallback } from "./kysely-sync-cache-state-eUau8Jaa.mjs";
import { n as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-CG0Tk84j.mjs";
import { i as normalizeSchemaSql, t as extractSqliteTableSchema } from "./sqlite-schema-sql-CKIqAlrf.mjs";
import { o as normalizeDatabasePath, u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { d as sqlitePrimaryResultCode } from "./sqlite-error-diagnostics-DCvjvszg.mjs";
import { a as tableHasColumn, n as ensureColumn } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { i as stageSqliteTransactionState, t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-ZJ4dPMsi.mjs";
import { t as SessionMetadataUnavailableError } from "./session-metadata-unavailable-error-DwD7IuoE.mjs";
import { c as matchesAgentDatabaseReadCandidatePath } from "./agent-database-readers-DAuOtcuZ.mjs";
import { a as collectSqliteSchemaIssues, l as readSqliteSchemaCookie } from "./sqlite-schema-contract-BTxZz0OV.mjs";
import { S as MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE, T as MEMORY_INDEX_CHUNK_PROVENANCE_TABLE, d as MEMORY_CHUNK_FTS_TRIGGER_DEFINITIONS, g as MEMORY_PATH_FTS_TRIGGER_DEFINITIONS, h as MEMORY_INDEX_SOURCES_TABLE } from "./memory-schema-BA04oCjG.mjs";
import { r as createSqliteSchemaEnsurer, t as SESSION_TRANSCRIPT_ARCHIVES_TABLE } from "./openclaw-agent-session-transcript-archive-schema-DeVxJLCy.mjs";
import { t as OPENCLAW_AGENT_SCHEMA_SQL } from "./openclaw-agent-schema-BcJs-SM4.mjs";
import { n as FIRST_USE_ADDITIVE_AGENT_COLUMN_DEFINITIONS, t as CANONICAL_READY_COLUMN_DEFINITION } from "./openclaw-agent-db-additive-columns-DEY4xthY.mjs";
import { n as SESSION_PARTICIPANTS_TABLE } from "./openclaw-agent-db-contract-ClUH-Vmp.mjs";
import { t as MESSAGE_TOOL_RUN_OUTCOMES_TABLE } from "./openclaw-agent-message-tool-outcome-schema-r9u1KU-x.mjs";
import { r as SESSION_PROGRESS_CARDS_TABLE } from "./openclaw-agent-progress-card-schema-CFYelX0N.mjs";
import "./openclaw-agent-db-resources-x2MmUEok.mjs";
import { statSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region src/state/openclaw-agent-context-engine-turn-outbox-schema.ts
const CONTEXT_ENGINE_TURN_OUTBOX_TABLE = "context_engine_turn_outbox";
const schema = createSqliteSchemaEnsurer(() => extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, CONTEXT_ENGINE_TURN_OUTBOX_TABLE, {
	endMarker: "CREATE TABLE IF NOT EXISTS cache_entries (",
	includeEndMarker: false,
	errorMessage: "OpenClaw context-engine turn outbox schema markers are missing."
}));
/**
* Records that a caller-owned transaction which ran the lazy DDL committed, so
* later commands on this connection skip it.
*/
const recordContextEngineTurnOutboxSchemaCommitted = schema.recordCommitted;
/** Lazily installs the additive context-engine turn outbox on first use. */
function ensureContextEngineTurnOutboxSchema(db) {
	schema.ensure(db);
}
//#endregion
//#region src/state/openclaw-agent-goal-operations-schema.ts
const SESSION_GOAL_OPERATIONS_TABLE = "session_goal_operations";
const ensuredDatabases = /* @__PURE__ */ new WeakSet();
/** First typed Goal use installs the additive receipt table, without a version bump. */
function ensureSessionGoalOperationsSchema(db) {
	if (ensuredDatabases.has(db)) return;
	const schema = extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, SESSION_GOAL_OPERATIONS_TABLE, {
		endMarker: "CREATE TABLE IF NOT EXISTS transcript_events (",
		includeEndMarker: false,
		errorMessage: "OpenClaw Goal operation schema markers are missing."
	});
	runSqliteImmediateTransactionSync(db, () => {
		db.exec(schema);
	});
	ensuredDatabases.add(db);
}
//#endregion
//#region src/state/openclaw-agent-pending-inputs-schema.ts
const SESSION_PENDING_INPUTS_TABLE = "session_pending_inputs";
const SESSION_INPUT_COMPLETIONS_TABLE = "session_input_completions";
const presentDatabases = /* @__PURE__ */ new WeakSet();
const completeDatabases = /* @__PURE__ */ new WeakSet();
const completionDatabases = /* @__PURE__ */ new WeakSet();
let absentDatabases = /* @__PURE__ */ new WeakSet();
/** Cache feature-table presence per connection; first use invalidates earlier absence checks. */
function hasSessionPendingInputsSchema(db) {
	if (presentDatabases.has(db)) return true;
	if (!db.isTransaction && absentDatabases.has(db)) return false;
	const present = Boolean(db.prepare("SELECT 1 FROM sqlite_schema WHERE type = 'table' AND name = ?").get(SESSION_PENDING_INPUTS_TABLE));
	if (!db.isTransaction) (present ? presentDatabases : absentDatabases).add(db);
	return present;
}
/** Lazily installs accepted-input custody without changing either schema version marker. */
function ensureSessionPendingInputsSchema(db) {
	if (completeDatabases.has(db)) return;
	const start = OPENCLAW_AGENT_SCHEMA_SQL.indexOf(`CREATE TABLE IF NOT EXISTS ${SESSION_PENDING_INPUTS_TABLE} (`);
	if (start < 0) throw new Error("OpenClaw pending-input schema marker is missing.");
	const nested = db.isTransaction;
	runSqliteImmediateTransactionSync(db, () => {
		db.exec(OPENCLAW_AGENT_SCHEMA_SQL.slice(start, OPENCLAW_AGENT_SCHEMA_SQL.indexOf("-- Processing completion")));
		ensureColumn(db, SESSION_PENDING_INPUTS_TABLE, "consumed_event_id TEXT");
	});
	absentDatabases = /* @__PURE__ */ new WeakSet();
	if (!nested) {
		presentDatabases.add(db);
		completeDatabases.add(db);
	}
}
/** Completion tracking is opt-in; ordinary input admission does not create this table. */
function ensureSessionInputCompletionsSchema(db) {
	if (completionDatabases.has(db)) return;
	const start = OPENCLAW_AGENT_SCHEMA_SQL.indexOf("CREATE TABLE IF NOT EXISTS session_input_completions (");
	if (start < 0) throw new Error("OpenClaw input-completion schema marker is missing.");
	const nested = db.isTransaction;
	runSqliteImmediateTransactionSync(db, () => {
		db.exec(OPENCLAW_AGENT_SCHEMA_SQL.slice(start));
	});
	if (!nested) completionDatabases.add(db);
}
/** Existing same-version stores converge through Doctor/open; absent tables stay feature-local. */
function hasPendingInputConsumptionColumnMigration(db) {
	return hasSessionPendingInputsSchema(db) && !tableHasColumn(db, "session_pending_inputs", "consumed_event_id");
}
function ensurePendingInputConsumptionColumn(db) {
	ensureColumn(db, SESSION_PENDING_INPUTS_TABLE, "consumed_event_id TEXT");
}
/** Read-only callers can inspect pre-feature stores without installing schema. */
function hasPendingInputConsumptionColumn(db) {
	if (completeDatabases.has(db)) return true;
	const present = tableHasColumn(db, SESSION_PENDING_INPUTS_TABLE, "consumed_event_id");
	if (present && !db.isTransaction) completeDatabases.add(db);
	return present;
}
//#endregion
//#region src/state/openclaw-agent-standing-intents-schema.ts
const STANDING_INTENTS_TABLE = "standing_intents";
const STANDING_INTENTS_FTS_TABLE = "standing_intents_fts";
const STANDING_INTENTS_FTS_SHADOW_TABLES = [
	"standing_intents_fts_config",
	"standing_intents_fts_data",
	"standing_intents_fts_docsize",
	"standing_intents_fts_idx"
];
const admittedSchemas = /* @__PURE__ */ new WeakMap();
function hasCurrentStandingIntentsSchema(db) {
	const cached = admittedSchemas.get(db);
	if (!cached) return false;
	try {
		if (getAdmittedSqliteSchemaFacts(db) === cached) return true;
	} catch {}
	admittedSchemas.delete(db);
	return false;
}
function rememberCommittedStandingIntentsSchema(db, schemaSql) {
	admittedSchemas.delete(db);
	try {
		if (!db.isOpen || db.isTransaction) return;
		const before = getAdmittedSqliteSchemaFacts(db);
		if (!before || collectSqliteSchemaIssues(db, schemaSql).length > 0) return;
		const after = getAdmittedSqliteSchemaFacts(db);
		if (after === before) admittedSchemas.set(db, after);
	} catch {}
}
/** Lazily add the canonical standing-intents tables on first feature use. */
function ensureOpenClawAgentStandingIntentsSchema(db) {
	if (hasCurrentStandingIntentsSchema(db)) return;
	const schemaSql = extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, STANDING_INTENTS_TABLE, {
		endMarker: "CREATE TABLE IF NOT EXISTS session_transcript_index_state (",
		includeEndMarker: false,
		errorMessage: "OpenClaw standing-intents schema markers are missing."
	});
	const ensure = () => {
		db.exec(schemaSql);
		ensureColumn(db, STANDING_INTENTS_TABLE, "creator_sender TEXT CHECK (creator_sender IS NULL OR length(trim(creator_sender)) > 0)");
	};
	if (db.isTransaction) {
		ensure();
		deferSqlitePostCommitPublication(db, () => rememberCommittedStandingIntentsSchema(db, schemaSql));
		return;
	}
	runSqliteImmediateTransactionSync(db, ensure);
	rememberCommittedStandingIntentsSchema(db, schemaSql);
}
//#endregion
//#region src/state/openclaw-agent-db-schema-compatibility.ts
const AGENT_SCHEMA_COMPATIBILITY = {
	allowCompatibleAdditiveColumns: true,
	allowedMissingTables: [
		"session_reactions",
		"memory_entry_origins",
		"memory_session_tombstones",
		MEMORY_INDEX_CHUNK_PROVENANCE_TABLE,
		MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE,
		CONTEXT_ENGINE_TURN_OUTBOX_TABLE,
		MESSAGE_TOOL_RUN_OUTCOMES_TABLE,
		SESSION_GOAL_OPERATIONS_TABLE,
		SESSION_PENDING_INPUTS_TABLE,
		SESSION_INPUT_COMPLETIONS_TABLE,
		SESSION_PARTICIPANTS_TABLE,
		SESSION_PROGRESS_CARDS_TABLE,
		SESSION_TRANSCRIPT_ARCHIVES_TABLE,
		STANDING_INTENTS_TABLE,
		STANDING_INTENTS_FTS_TABLE,
		...STANDING_INTENTS_FTS_SHADOW_TABLES
	],
	allowedMissingColumns: [
		"session_pending_inputs.consumed_event_id",
		"session_transcript_active_events.context_eligible",
		"session_conversations.route_context_json",
		"standing_intents.creator_sender",
		...FIRST_USE_ADDITIVE_AGENT_COLUMN_DEFINITIONS.map(({ columnName, tableName }) => `${tableName}.${columnName}`)
	],
	allowedColumnDefinitions: { "conversations.delivery_target": ["delivery_target TEXT NOT NULL DEFAULT ''"] },
	allowedMissingIndexes: [
		"idx_agent_transcript_context_pending",
		"idx_agent_session_nodes_label",
		"idx_agent_session_nodes_entry_not_valid"
	],
	optionalCanonicalTriggerGroups: [{
		tableName: "memory_index_chunks",
		triggers: MEMORY_CHUNK_FTS_TRIGGER_DEFINITIONS
	}, {
		tableName: MEMORY_INDEX_SOURCES_TABLE,
		triggers: MEMORY_PATH_FTS_TRIGGER_DEFINITIONS
	}]
};
//#endregion
//#region src/state/openclaw-agent-db-read-error.ts
const settledReadOpenFailures = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseSettledReadOpenFailures"), () => /* @__PURE__ */ new WeakSet());
/** Only the native open owner can classify an unreadable store after successful cleanup. */
function recordOpenClawAgentDatabaseReadOpenFailure(error) {
	if (error !== null && typeof error === "object" && sqlitePrimaryResultCode(error) !== void 0) settledReadOpenFailures.add(error);
}
function isOpenClawAgentDatabaseReadOpenFailure(error) {
	return error !== null && typeof error === "object" && settledReadOpenFailures.has(error);
}
/** Record schema-owner facts after a failed query or admission, never infer them from error prose. */
function classifyOpenClawAgentDatabaseReadError(db, error) {
	try {
		const missingTables = collectSqliteSchemaIssues(db, OPENCLAW_AGENT_SCHEMA_SQL, AGENT_SCHEMA_COMPATIBILITY).filter((issue) => issue.code === "missing-table").map((issue) => issue.objectName);
		return missingTables.length > 0 ? new SessionMetadataUnavailableError("table-missing", { cause: error }, missingTables) : error;
	} catch {
		return error;
	}
}
//#endregion
//#region src/state/openclaw-agent-canonical-validation-schema.ts
const definitionsSql = `SELECT name, sql FROM main.sqlite_schema
  WHERE name = 'session_canonical_validation_pending'
    OR (type = 'trigger' AND tbl_name IN (
      'session_nodes', 'session_windows', 'session_key_contract', 'session_canonical_validation_pending'
    ))`;
const validatedSchemas = resolveGlobalSingleton(Symbol.for("openclaw.agentCanonicalValidationSchemas"), () => /* @__PURE__ */ new WeakMap());
function readDefinitions(database) {
	const definitions = /* @__PURE__ */ new Map();
	const rows = database.prepare(definitionsSql).all();
	for (const row of rows) {
		if (typeof row.name !== "string" || typeof row.sql !== "string") throw new Error("Session canonical validation schema has an unreadable definition");
		definitions.set(row.name, normalizeSchemaSql(row.sql));
	}
	return definitions;
}
function expectedDefinitions() {
	return resolveGlobalSingleton(Symbol.for("openclaw.agentCanonicalValidationSchemaDefinitions"), () => {
		const database = openNodeSqliteDatabase(":memory:");
		try {
			database.exec([
				extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, "session_nodes"),
				extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, "session_windows"),
				extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, "session_key_contract", {
					endMarker: "CREATE TABLE IF NOT EXISTS session_windows (",
					includeEndMarker: false
				}),
				canonicalSessionValidationSchemaSql()
			].join("\n"));
			return readDefinitions(database);
		} finally {
			database.close();
		}
	});
}
/** Require the exact invalidation group before an empty pending set can certify readiness. */
function assertCanonicalSessionValidationSchema(database) {
	const schema = getAdmittedSqliteSchemaFacts(database);
	const cookie = schema?.schemaVersion ?? readSqliteSchemaCookie(database);
	if (typeof cookie !== "number") throw new Error("Session canonical validation schema version is unavailable");
	const cached = validatedSchemas.get(database);
	if (cached && (schema ? cached.schema === schema : !cached.schema && cached.cookie === cookie)) return;
	cached?.unregister();
	validatedSchemas.delete(database);
	const expected = expectedDefinitions();
	const actual = readDefinitions(database);
	for (const name of /* @__PURE__ */ new Set([...expected.keys(), ...actual.keys()])) if (expected.get(name) !== actual.get(name)) throw classifyOpenClawAgentDatabaseReadError(database, /* @__PURE__ */ new Error(`Session canonical validation schema is missing or drifted: ${name}; run openclaw doctor --fix with the compatible build.`));
	if (!schema && readSqliteSchemaCookie(database) !== cookie) throw new Error("Session canonical validation schema changed during admission; retry the read");
	if (schema || !database.isTransaction) {
		const unregister = registerNodeSqliteDisposeCallback(database, () => {
			validatedSchemas.delete(database);
			unregister();
		});
		validatedSchemas.set(database, {
			cookie,
			schema,
			unregister
		});
	}
}
/** The schema owner installs this complete group before seeding pending keys. */
function canonicalSessionValidationSchemaSql(schema = OPENCLAW_AGENT_SCHEMA_SQL) {
	return extractSqliteTableSchema(schema, "session_canonical_validation_pending", {
		endMarker: "CREATE TABLE IF NOT EXISTS conversations (",
		includeEndMarker: false
	});
}
/** Historical migration preflights cannot require the schema-21 validation projection. */
function withoutCanonicalSessionValidationSchema(schema) {
	if (!schema.includes("CREATE TABLE IF NOT EXISTS session_canonical_validation_pending (")) return schema;
	return schema.replace(canonicalSessionValidationSchemaSql(schema), "");
}
//#endregion
//#region src/state/openclaw-agent-db-identity.ts
const identities = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseIdentities"), () => /* @__PURE__ */ new WeakMap());
/** Prepare physical and connection identity once at open; cached aliases are not resolved again. */
function registerOpenClawAgentDatabaseIdentity(db) {
	const filename = normalizeDatabasePath(db.location() ?? "");
	const file = filename ? readDatabasePathIdentitySync(filename) : void 0;
	if (file && !file.key.startsWith("file:")) throw new Error("OpenClaw agent database disappeared before identity registration");
	const identity = file ? file.key.slice(5) : Symbol("incognito-agent-database");
	identities.set(db, {
		identity,
		birthtime: file?.birthtime,
		incarnation: randomUUID(),
		filename,
		canonicalPath: file?.canonicalPath ?? filename
	});
}
/** Reuse facts captured at open; aliases must never be resolved again at a handoff. */
function readOpenClawAgentDatabaseIdentity(database) {
	const prepared = findOpenClawAgentDatabaseIdentity(database);
	if (prepared === void 0) throw new Error("OpenClaw agent database identity was not prepared at open");
	return prepared;
}
/** Raw diagnostic connections have no admitted physical identity. */
function findOpenClawAgentDatabaseIdentity(database) {
	return identities.get(database.db);
}
/** A retained connection can outlive its pathname or be deserialized away from that file. */
function isOpenClawAgentDatabasePathCurrent(database) {
	if (!database.db.isOpen) return false;
	const { identity, filename } = readOpenClawAgentDatabaseIdentity(database);
	if (typeof identity === "symbol") return true;
	if (normalizeDatabasePath(database.db.location() ?? "") !== filename) return false;
	const current = statSync(database.path, {
		bigint: true,
		throwIfNoEntry: false
	});
	return current !== void 0 && identity === `${current.dev}:${current.ino}`;
}
function assertOpenClawAgentDatabaseIdentity(database, expected) {
	const identity = readOpenClawAgentDatabaseIdentity(database);
	if (`file:${String(identity.identity)}` !== expected.key || expected.birthtime !== void 0 && identity.birthtime !== expected.birthtime || !isOpenClawAgentDatabasePathCurrent(database)) throw new Error("Agent database changed during repair admission");
}
function createOpenClawAgentDatabaseClaim(database, release) {
	let released = false;
	const isCurrent = () => !released && database.db.isOpen;
	const { identity, incarnation } = readOpenClawAgentDatabaseIdentity(database);
	return {
		identity,
		incarnation,
		isCurrent,
		assertCurrent: () => {
			if (!isCurrent()) throw new Error("OpenClaw agent database claim is no longer current");
		},
		release: () => {
			if (!released) {
				released = true;
				release();
			}
		}
	};
}
//#endregion
//#region src/state/openclaw-agent-canonical-validation-receipt.ts
const receiptSchemas = /* @__PURE__ */ new WeakSet();
function hasReceiptColumn(db) {
	if (receiptSchemas.has(db)) return true;
	const { tableName, columnName } = CANONICAL_READY_COLUMN_DEFINITION;
	const present = tableHasColumn(db, tableName, columnName);
	if (present && !db.isTransaction) receiptSchemas.add(db);
	return present;
}
function physicalReceipt(database) {
	const physical = findOpenClawAgentDatabaseIdentity(database);
	if (!physical || typeof physical.identity !== "string" || !isOpenClawAgentDatabasePathCurrent({
		...database,
		path: physical.filename
	})) return;
	return JSON.stringify([
		1,
		database.agentId,
		physical.identity,
		physical.birthtime
	]);
}
/** Canonical proof follows this file generation; it never certifies physical integrity. */
function hasPersistedOpenClawAgentCanonicalValidation(database) {
	const receipt = physicalReceipt(database);
	if (!receipt || !hasReceiptColumn(database.db)) return false;
	assertCanonicalSessionValidationSchema(database.db);
	return executeSqliteQueryTakeFirstSync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_key_contract").select("canonical_ready").where("id", "=", 1))?.canonical_ready === receipt;
}
/** The certifying writer records proof in the same authorized transaction as its final batch. */
function recordOpenClawAgentCanonicalValidation(database) {
	if (!database.db.isTransaction) throw new Error("Canonical validation receipt requires write admission");
	const receipt = physicalReceipt(database);
	if (!receipt) throw new Error("Canonical validation database owner is no longer current");
	assertCanonicalSessionValidationSchema(database.db);
	if (!hasReceiptColumn(database.db)) {
		const { tableName, columnName, dataType } = CANONICAL_READY_COLUMN_DEFINITION;
		ensureColumn(database.db, tableName, `${columnName} ${dataType}`);
	}
	deferSqlitePostCommitPublication(database.db, () => receiptSchemas.add(database.db));
	executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).updateTable("session_key_contract").set({ canonical_ready: receipt }).where("id", "=", 1));
}
//#endregion
//#region src/state/openclaw-agent-db-validation-cache.ts
const validatedPaths = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseValidatedPaths"), () => /* @__PURE__ */ new Map(), () => clearOpenClawAgentDatabaseValidationCache());
const validationBindings = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseValidationBindings"), () => /* @__PURE__ */ new WeakMap());
function bindValidationLifetime(database, validation) {
	const current = validationBindings.get(database.db);
	if (!database.db.isOpen || current?.validation === validation) return;
	current?.unregister();
	const unregister = registerNodeSqliteDisposeCallback(database.db, (reason) => {
		if (reason === "replace") Atomics.store(new Int32Array(validation.valid), 0, 0);
		validationBindings.delete(database.db);
		unregister();
	});
	validationBindings.set(database.db, {
		validation,
		unregister
	});
}
function matchesValidation(database, validation) {
	return validation.agentId === database.agentId && validation.identity === findOpenClawAgentDatabaseIdentity(database)?.identity && Atomics.load(new Int32Array(validation.valid), 0) === 1;
}
function hasRevokedOpenClawAgentDatabaseValidation(pathname, received) {
	const previous = validatedPaths.get(path.resolve(pathname));
	return received !== void 0 && Atomics.load(new Int32Array(received.valid), 0) !== 1 || previous?.revoked === true || previous?.validation !== void 0 && Atomics.load(new Int32Array(previous.validation.valid), 0) !== 1;
}
function getOpenClawAgentDatabaseValidation(database) {
	const entry = validatedPaths.get(path.resolve(database.path));
	if (!entry?.integrityVerified || !entry.validation || !matchesValidation(database, entry.validation)) return;
	const validation = entry.validation;
	bindValidationLifetime(database, validation);
	return validation;
}
/** The receiving opener must adopt this proof against its own physical file identity. */
function getOpenClawAgentDatabaseValidationForTransfer(database) {
	const entry = validatedPaths.get(path.resolve(database.path));
	if (!entry?.integrityVerified || !entry.validation || entry.validation.agentId !== database.agentId || Atomics.load(new Int32Array(entry.validation.valid), 0) !== 1) return;
	return entry.validation;
}
/** Native admission supplies the checked file identity; no host SQLite handle is needed. */
function captureOpenClawAgentDatabaseValidationTransfer(database) {
	const pathname = path.resolve(database.path);
	const existing = validatedPaths.get(pathname);
	const captured = existing?.agentId === database.agentId ? existing : {
		...existing,
		agentId: database.agentId,
		integrityVerified: existing?.integrityVerified ?? false
	};
	validatedPaths.set(pathname, captured);
	const capturedValidation = captured.validation;
	const wasValid = capturedValidation ? Atomics.load(new Int32Array(capturedValidation.valid), 0) : void 0;
	return (identity, received) => {
		if (validatedPaths.get(pathname) !== captured || capturedValidation && wasValid === 1 && Atomics.load(new Int32Array(capturedValidation.valid), 0) !== 1 || !isRecord(received) || received.agentId !== database.agentId || received.identity !== identity || !(received.valid instanceof SharedArrayBuffer) || received.valid.byteLength !== Int32Array.BYTES_PER_ELEMENT || Atomics.load(new Int32Array(received.valid), 0) !== 1 || !(received.canonicalReady instanceof SharedArrayBuffer) || received.canonicalReady.byteLength !== Int32Array.BYTES_PER_ELEMENT) return false;
		if (wasValid === 1 && captured.integrityVerified && captured.validation?.agentId === database.agentId && captured.validation?.identity === identity) return true;
		const validation = {
			agentId: database.agentId,
			identity,
			valid: received.valid,
			canonicalReady: received.canonicalReady
		};
		if (hasRevokedOpenClawAgentDatabaseValidation(pathname)) Atomics.store(new Int32Array(validation.canonicalReady), 0, 0);
		invalidateOpenClawAgentDatabaseValidation(pathname);
		validatedPaths.set(pathname, {
			validation,
			integrityVerified: true
		});
		return true;
	};
}
function canonicalValidationReceipt(database) {
	if (!database.db.isOpen || !findOpenClawAgentDatabaseIdentity(database)) return;
	const pathname = database.path ?? database.db.location();
	if (!pathname) return;
	const validation = validatedPaths.get(path.resolve(pathname))?.validation;
	if (!validation || !matchesValidation({
		...database,
		path: pathname
	}, validation)) return;
	bindValidationLifetime({
		...database,
		path: pathname
	}, validation);
	return validation;
}
/** A clean pending table needs proof from this admitted physical generation. */
function hasOpenClawAgentCanonicalValidation(database) {
	const validation = canonicalValidationReceipt(database);
	if (validation) return Atomics.load(new Int32Array(validation.canonicalReady), 0) === 1 && Atomics.load(new Int32Array(validation.valid), 0) === 1;
	const pathname = database.path ?? findOpenClawAgentDatabaseIdentity(database)?.filename;
	if (!pathname || database.db.isTransaction || validatedPaths.get(path.resolve(pathname))?.validation !== void 0 || hasRevokedOpenClawAgentDatabaseValidation(pathname) || !hasPersistedOpenClawAgentCanonicalValidation(database)) return false;
	const canonical = createValidationReceipt({
		...database,
		path: pathname
	}, true);
	validatedPaths.set(path.resolve(pathname), {
		validation: canonical,
		integrityVerified: false
	});
	bindValidationLifetime({
		...database,
		path: pathname
	}, canonical);
	return true;
}
/** Publish successful canonical proof only when its outer transaction has committed. */
function markOpenClawAgentCanonicalValidation(database) {
	const validation = canonicalValidationReceipt(database);
	if (!validation) return false;
	const publish = () => {
		if (Atomics.load(new Int32Array(validation.valid), 0) === 1) Atomics.store(new Int32Array(validation.canonicalReady), 0, 1);
	};
	if (database.db.isTransaction) return stageSqliteTransactionState(database.db, {
		stage: () => {},
		rollback: () => {},
		commit: publish
	});
	publish();
	return Atomics.load(new Int32Array(validation.valid), 0) === 1;
}
function adoptOpenClawAgentDatabaseValidation(database, validation) {
	if (!matchesValidation(database, validation)) return false;
	if (getOpenClawAgentDatabaseValidation(database)) return true;
	if (hasRevokedOpenClawAgentDatabaseValidation(database.path)) Atomics.store(new Int32Array(validation.canonicalReady), 0, 0);
	invalidateOpenClawAgentDatabaseValidation(database.path);
	validatedPaths.set(path.resolve(database.path), {
		validation,
		integrityVerified: true
	});
	bindValidationLifetime(database, validation);
	return true;
}
function isOpenClawAgentCanonicalStoreEmpty(database) {
	if (database.db.isTransaction || readSqliteUserVersion(database.db) < 21) return false;
	assertCanonicalSessionValidationSchema(database.db);
	return database.db.prepare(`SELECT
    EXISTS(SELECT 1 FROM session_nodes) OR
    EXISTS(SELECT 1 FROM session_canonical_validation_pending) AS populated`).get()?.populated === 0;
}
function createValidationReceipt(database, canonicalReady) {
	const { identity } = readOpenClawAgentDatabaseIdentity(database);
	if (typeof identity !== "string") throw new Error("Only persistent agent databases retain integrity validation");
	const validation = {
		agentId: database.agentId,
		identity,
		valid: new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT),
		canonicalReady: new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)
	};
	if (canonicalReady) Atomics.store(new Int32Array(validation.canonicalReady), 0, 1);
	Atomics.store(new Int32Array(validation.valid), 0, 1);
	return validation;
}
function setOpenClawAgentDatabaseValidation(database) {
	const revoked = hasRevokedOpenClawAgentDatabaseValidation(database.path);
	const validation = createValidationReceipt(database, isOpenClawAgentCanonicalStoreEmpty(database) || !revoked && !database.db.isTransaction && hasPersistedOpenClawAgentCanonicalValidation(database));
	invalidateOpenClawAgentDatabaseValidation(database.path);
	validatedPaths.set(path.resolve(database.path), {
		validation,
		integrityVerified: true
	});
	bindValidationLifetime(database, validation);
	return validation;
}
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
function invalidateOpenClawAgentDatabaseValidationsForAgent(agentId, removedPaths) {
	for (const pathname of removedPaths) invalidateOpenClawAgentDatabaseValidation(pathname);
	for (const [pathname, entry] of validatedPaths) if (entry.validation?.agentId === agentId || entry.agentId === agentId) invalidateOpenClawAgentDatabaseValidation(pathname);
}
function clearOpenClawAgentDatabaseValidationCache(rootPath) {
	for (const pathname of validatedPaths.keys()) if (rootPath === void 0 || isPathInside(rootPath, pathname)) {
		invalidateOpenClawAgentDatabaseValidation(pathname);
		validatedPaths.delete(pathname);
	}
}
/** Reader cleanup releases local metadata without revoking its parent's shared proof. */
function releaseOpenClawAgentDatabaseReadValidation(candidates) {
	for (const pathname of validatedPaths.keys()) if (candidates.some((candidate) => matchesAgentDatabaseReadCandidatePath(candidate, pathname))) validatedPaths.delete(pathname);
}
//#endregion
export { ensurePendingInputConsumptionColumn as A, classifyOpenClawAgentDatabaseReadError as C, ensureOpenClawAgentStandingIntentsSchema as D, AGENT_SCHEMA_COMPATIBILITY as E, hasSessionPendingInputsSchema as F, SESSION_GOAL_OPERATIONS_TABLE as I, ensureSessionGoalOperationsSchema as L, ensureSessionPendingInputsSchema as M, hasPendingInputConsumptionColumn as N, SESSION_INPUT_COMPLETIONS_TABLE as O, hasPendingInputConsumptionColumnMigration as P, ensureContextEngineTurnOutboxSchema as R, withoutCanonicalSessionValidationSchema as S, recordOpenClawAgentDatabaseReadOpenFailure as T, isOpenClawAgentDatabasePathCurrent as _, getOpenClawAgentDatabaseValidationForTransfer as a, assertCanonicalSessionValidationSchema as b, invalidateOpenClawAgentDatabaseValidation as c, releaseOpenClawAgentDatabaseReadValidation as d, setOpenClawAgentDatabaseValidation as f, findOpenClawAgentDatabaseIdentity as g, createOpenClawAgentDatabaseClaim as h, getOpenClawAgentDatabaseValidation as i, ensureSessionInputCompletionsSchema as j, SESSION_PENDING_INPUTS_TABLE as k, invalidateOpenClawAgentDatabaseValidationsForAgent as l, assertOpenClawAgentDatabaseIdentity as m, captureOpenClawAgentDatabaseValidationTransfer as n, hasOpenClawAgentCanonicalValidation as o, recordOpenClawAgentCanonicalValidation as p, clearOpenClawAgentDatabaseValidationCache as r, hasRevokedOpenClawAgentDatabaseValidation as s, adoptOpenClawAgentDatabaseValidation as t, markOpenClawAgentCanonicalValidation as u, readOpenClawAgentDatabaseIdentity as v, isOpenClawAgentDatabaseReadOpenFailure as w, canonicalSessionValidationSchemaSql as x, registerOpenClawAgentDatabaseIdentity as y, recordContextEngineTurnOutboxSchemaCommitted as z };
