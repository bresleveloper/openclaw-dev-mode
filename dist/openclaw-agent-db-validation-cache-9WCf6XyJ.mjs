import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { f as readDatabasePathIdentitySync, p as resolveDatabasePathKey, r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { c as registerNodeSqliteDisposeCallback } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { C as readSqliteDatabaseIntegrityVerification, J as FIRST_USE_ADDITIVE_AGENT_COLUMN_DEFINITIONS, M as recordSqliteDatabaseIntegrity, Z as STARTUP_ADDITIVE_AGENT_COLUMN_DEFINITIONS, b as publishSqliteDatabaseAdmission, c as getSqliteDatabaseAdmission, nt as extractSqliteTableSchema, q as CANONICAL_READY_COLUMN_DEFINITION, st as normalizeSchemaSql, tt as parseSqliteTableDefinition } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { t as OPENCLAW_AGENT_SCHEMA_SQL } from "./openclaw-agent-schema-BKBD8edk.mjs";
import { s as stageSqliteTransactionState } from "./sqlite-post-commit-22SfWsLt.mjs";
import { f as registerSqliteSchemaMutationListener, i as getAdmittedSqliteSchemaFacts, n as adoptSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { d as sqlitePrimaryResultCode } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { s as matchesAgentDatabaseReadCandidatePath } from "./agent-database-readers-DSwi8tar.mjs";
import { S as AgentDatabaseSchemaAdmissionInvalidError, x as AgentDatabaseSchemaAdmissionChangedError } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as tableExists, n as ensureColumn, o as tableHasColumn } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-Q7gNRxhK.mjs";
import { t as SessionMetadataUnavailableError } from "./session-metadata-unavailable-error-DwD7IuoE.mjs";
import { o as collectSqliteSchemaIssues, u as readSqliteSchemaCookie } from "./sqlite-schema-contract-C7_zBR7q.mjs";
import { t as observeOwnedDirectory } from "./owned-directory-observation-DGvnK2He.mjs";
import { a as readOpenClawAgentDatabaseIdentity, r as findOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { t as createSqliteSchemaEnsurer } from "./sqlite-schema-ensure-CwIgvH1h.mjs";
import { r as SESSION_PARTICIPANTS_TABLE } from "./openclaw-agent-db-contract-BcoeqAm4.mjs";
import { C as MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE, E as MEMORY_INDEX_CHUNK_PROVENANCE_TABLE, _ as MEMORY_PATH_FTS_TRIGGER_DEFINITIONS, f as MEMORY_CHUNK_FTS_TRIGGER_DEFINITIONS, g as MEMORY_INDEX_SOURCES_TABLE } from "./memory-schema-DY2eOY6N.mjs";
import { t as MESSAGE_TOOL_RUN_OUTCOMES_TABLE } from "./openclaw-agent-message-tool-outcome-schema-D6vAotVz.mjs";
import { r as SESSION_PROGRESS_CARDS_TABLE } from "./openclaw-agent-progress-card-schema-CCXTSC64.mjs";
import { t as SESSION_TRANSCRIPT_ARCHIVES_TABLE } from "./openclaw-agent-session-transcript-archive-schema-CnBz2Ueu.mjs";
import { a as STANDING_INTENTS_TABLE, i as STANDING_INTENTS_FTS_TABLE, n as createOpenClawAgentDatabaseValidationReceipt, r as STANDING_INTENTS_FTS_SHADOW_TABLES, t as agentDatabaseValidationKey } from "./openclaw-agent-db-validation-facts-BQcDbrLo.mjs";
import path from "node:path";
//#region src/state/openclaw-agent-context-engine-turn-outbox-schema.ts
const CONTEXT_ENGINE_TURN_OUTBOX_TABLE = "context_engine_turn_outbox";
/** Lazily installs the additive context-engine turn outbox on first use. */
const ensureContextEngineTurnOutboxSchema = createSqliteSchemaEnsurer(() => extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, CONTEXT_ENGINE_TURN_OUTBOX_TABLE, {
	endMarker: "CREATE TABLE IF NOT EXISTS cache_entries (",
	includeEndMarker: false,
	errorMessage: "OpenClaw context-engine turn outbox schema markers are missing."
}), {
	tables: [CONTEXT_ENGINE_TURN_OUTBOX_TABLE],
	indexes: ["idx_agent_context_engine_turn_outbox_engine"]
});
//#endregion
//#region src/state/openclaw-agent-goal-operations-schema.ts
const SESSION_GOAL_OPERATIONS_TABLE = "session_goal_operations";
/** First typed Goal use installs the additive receipt table, without a version bump. */
const ensureSessionGoalOperationsSchema = createSqliteSchemaEnsurer(() => extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, SESSION_GOAL_OPERATIONS_TABLE, {
	endMarker: "CREATE TABLE IF NOT EXISTS transcript_events (",
	includeEndMarker: false,
	errorMessage: "OpenClaw Goal operation schema markers are missing."
}), {
	tables: [SESSION_GOAL_OPERATIONS_TABLE],
	indexes: ["idx_agent_session_goal_operations_expiry"]
});
//#endregion
//#region src/state/openclaw-agent-pending-inputs-schema.ts
const SESSION_PENDING_INPUTS_TABLE = "session_pending_inputs";
const SESSION_INPUT_COMPLETIONS_TABLE = "session_input_completions";
const ensurePendingTable = createSqliteSchemaEnsurer(() => extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, SESSION_PENDING_INPUTS_TABLE, {
	endMarker: "-- Processing completion",
	includeEndMarker: false,
	errorMessage: "OpenClaw pending-input schema marker is missing."
}), {
	tables: [SESSION_PENDING_INPUTS_TABLE],
	indexes: ["idx_agent_session_pending_inputs_session"]
});
/** Read-only callers consume the schema owner's presence facts without installing anything. */
function hasSessionPendingInputsSchema(db) {
	return tableExists(db, SESSION_PENDING_INPUTS_TABLE);
}
/** Install canonical first-use storage and migrate older same-version tables. */
function ensureSessionPendingInputsSchema(db) {
	ensurePendingTable(db);
	if (!hasPendingInputConsumptionColumn(db)) runSqliteImmediateTransactionSync(db, () => ensurePendingInputConsumptionColumn(db));
}
/** Completion tracking is opt-in; ordinary input admission does not create this table. */
const ensureSessionInputCompletionsSchema = createSqliteSchemaEnsurer(() => extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, SESSION_INPUT_COMPLETIONS_TABLE, { errorMessage: "OpenClaw input-completion schema marker is missing." }), { tables: [SESSION_INPUT_COMPLETIONS_TABLE] });
function ensurePendingInputConsumptionColumn(db) {
	ensureColumn(db, SESSION_PENDING_INPUTS_TABLE, "consumed_event_id TEXT");
}
function hasPendingInputConsumptionColumn(db) {
	const schema = getAdmittedSqliteSchemaFacts(db);
	if (schema) {
		const sql = schema.tableSql.get(SESSION_PENDING_INPUTS_TABLE);
		return sql !== void 0 && sql !== null && parseSqliteTableDefinition(sql, "session_pending_inputs").columns.has("consumed_event_id");
	}
	return tableHasColumn(db, SESSION_PENDING_INPUTS_TABLE, "consumed_event_id");
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
		...STARTUP_ADDITIVE_AGENT_COLUMN_DEFINITIONS.map(({ columnName, tableName }) => `${tableName}.${columnName}`),
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
const validationTables = /* @__PURE__ */ new Set([
	"session_nodes",
	"session_windows",
	"session_key_contract",
	"session_canonical_validation_pending"
]);
const definitionsSql = `SELECT name, sql FROM main.sqlite_schema
  WHERE name = 'session_canonical_validation_pending'
    OR (type = 'trigger' AND tbl_name IN (
      'session_nodes', 'session_windows', 'session_key_contract', 'session_canonical_validation_pending'
    ))`;
const validatedSchemas = resolveGlobalSingleton(Symbol.for("openclaw.agentCanonicalValidationSchemas"), () => /* @__PURE__ */ new WeakMap());
const expectedDefinitions = /* @__PURE__ */ new Map([["session_canonical_validation_pending", normalizeSchemaSql(extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, "session_canonical_validation_pending"))]]);
function readDefinitions(database, schema) {
	const definitions = /* @__PURE__ */ new Map();
	const pending = "session_canonical_validation_pending";
	const rows = schema ? [...schema.tableSql.has(pending) ? [{
		name: pending,
		sql: schema.tableSql.get(pending)
	}] : [], ...Array.from(schema.triggers).flatMap(([name, trigger]) => name === pending || validationTables.has(trigger.table) ? [{
		name,
		sql: trigger.sql
	}] : [])] : database.prepare(definitionsSql).all();
	for (const row of rows) {
		if (typeof row.name !== "string" || typeof row.sql !== "string") throw new Error("Session canonical validation schema has an unreadable definition");
		definitions.set(row.name, normalizeSchemaSql(row.sql));
	}
	return definitions;
}
/** Require the canonical admission schema before consuming its pending work. */
function assertCanonicalSessionValidationSchema(database) {
	const schema = getAdmittedSqliteSchemaFacts(database);
	const cookie = schema?.schemaVersion ?? readSqliteSchemaCookie(database);
	if (typeof cookie !== "number") throw new Error("Session canonical validation schema version is unavailable");
	const cached = validatedSchemas.get(database);
	if (cached && (schema ? cached.schema === schema : !cached.schema && cached.cookie === cookie)) return;
	validatedSchemas.delete(database);
	const actual = readDefinitions(database, schema);
	for (const name of /* @__PURE__ */ new Set([...expectedDefinitions.keys(), ...actual.keys()])) if (expectedDefinitions.get(name) !== actual.get(name)) throw classifyOpenClawAgentDatabaseReadError(database, /* @__PURE__ */ new Error(`Session canonical validation schema is missing or drifted: ${name}; run openclaw doctor --fix with the compatible build.`));
	if (schema || !database.isTransaction) validatedSchemas.set(database, {
		cookie,
		schema
	});
}
/** Writable admission may carry this assertion from its validated physical sibling. */
function adoptCanonicalSessionValidationSchema(database) {
	const schema = getAdmittedSqliteSchemaFacts(database);
	if (!schema) throw new Error("Canonical schema handoff requires admitted schema facts");
	validatedSchemas.set(database, {
		cookie: schema.schemaVersion,
		schema
	});
}
/** The schema owner installs the pending queue before seeding imported keys. */
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
//#region src/state/openclaw-agent-canonical-validation-receipt.ts
const canonicalReceiptAdmission = {
	name: "agent.canonical-validation-receipt",
	schemaDependent: true,
	read: (value) => value === null || typeof value === "string" ? value : void 0
};
function hasReceiptColumn(db) {
	const { tableName, columnName } = CANONICAL_READY_COLUMN_DEFINITION;
	return tableHasColumn(db, tableName, columnName);
}
function physicalReceipt(database) {
	const physical = findOpenClawAgentDatabaseIdentity(database);
	if (!physical || typeof physical.identity !== "string") return;
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
	return receipt !== void 0 && getSqliteDatabaseAdmission(database.db, canonicalReceiptAdmission) === receipt;
}
/** Schema admission and worker read-open load proof; runtime misses use canonical validation. */
function loadOpenClawAgentCanonicalValidationReceipt(database) {
	const receipt = physicalReceipt(database);
	if (!receipt) return false;
	let persisted = getSqliteDatabaseAdmission(database.db, canonicalReceiptAdmission);
	if (persisted === void 0) {
		if (!hasReceiptColumn(database.db)) return false;
		assertCanonicalSessionValidationSchema(database.db);
		persisted = executeSqliteQueryTakeFirstSync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_key_contract").select("canonical_ready").where("id", "=", 1))?.canonical_ready ?? null;
		publishSqliteDatabaseAdmission(database.db, canonicalReceiptAdmission, persisted);
	}
	return persisted === receipt;
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
	executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).updateTable("session_key_contract").set({ canonical_ready: receipt }).where("id", "=", 1));
	publishSqliteDatabaseAdmission(database.db, canonicalReceiptAdmission, receipt);
}
/** Offline repair revokes imported-row proof without changing physical integrity admission. */
function clearPersistedOpenClawAgentCanonicalValidation(database) {
	if (!hasReceiptColumn(database.db)) return;
	executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).updateTable("session_key_contract").set({ canonical_ready: null }).where("id", "=", 1).where("canonical_ready", "is not", null));
	publishSqliteDatabaseAdmission(database.db, canonicalReceiptAdmission, null);
}
//#endregion
//#region src/state/openclaw-agent-db-validation-cache.ts
const validatedPaths = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseValidatedPaths"), () => /* @__PURE__ */ new Map(), () => clearOpenClawAgentDatabaseValidationCache());
const validationObservations = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseValidationObservations"), () => /* @__PURE__ */ new Map());
function releaseValidationObservation(pathname) {
	validationObservations.get(pathname)?.close();
}
function observeValidationPath(pathname, admission) {
	const existing = validationObservations.get(pathname);
	if (existing) {
		if (admission) existing.revalidate();
		return;
	}
	const revalidate = () => {
		const validation = validatedPaths.get(pathname)?.validation;
		if (!validation || Atomics.load(new Int32Array(validation.valid), 0) !== 1) return;
		try {
			assertExistingDatabaseIdentity(pathname, `file:${validation.identity}`, validation.birthtime);
		} catch {
			invalidateOpenClawAgentDatabaseValidation(pathname, validation.identity);
		}
	};
	const watched = observeOwnedDirectory(path.dirname(pathname), (filename) => {
		if (filename === void 0 || (process.platform === "win32" ? filename.toLowerCase() === path.basename(pathname).toLowerCase() : filename === path.basename(pathname))) revalidate();
	}, { recoveryIntervalMs: 3e4 });
	validationObservations.set(pathname, {
		revalidate,
		close() {
			watched.close();
			validationObservations.delete(pathname);
		}
	});
	revalidate();
}
const validationBindings = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseValidationBindings"), () => /* @__PURE__ */ new WeakMap());
function bindValidationLifetime(database, validation) {
	const current = validationBindings.get(database.db);
	if (!database.db.isOpen || current?.validation === validation) return;
	current?.unregister();
	const key = readOpenClawAgentDatabaseIdentity(database).canonicalPath;
	const unobserve = registerSqliteSchemaMutationListener(database.db, (observed) => {
		const revoke = (schema) => {
			if (schema && (!observed || schema.facts.schemaVersion !== observed.schemaVersion || schema.facts.userVersion !== observed.userVersion)) Atomics.store(new Int32Array(schema.valid), 0, 0);
		};
		revoke(validation.schema);
		const published = validatedPaths.get(key)?.validation;
		if (published?.schema && published.agentId === validation.agentId && published.identity === validation.identity) revoke(published.schema);
	});
	const unregister = registerNodeSqliteDisposeCallback(database.db, (reason) => {
		if (reason === "replace") Atomics.store(new Int32Array(validation.valid), 0, 0);
		validationBindings.delete(database.db);
		unobserve();
		unregister();
	});
	validationBindings.set(database.db, {
		validation,
		unregister: () => {
			unobserve();
			unregister();
		}
	});
}
/** Revocation precedes schema inspection so siblings cannot borrow the superseded revision. */
function invalidateOpenClawAgentDatabaseSchema(database) {
	const schema = getOpenClawAgentDatabaseValidation(database)?.schema;
	if (schema) Atomics.store(new Int32Array(schema.valid), 0, 0);
}
/** Consume only a live physical owner's schema proof at connection admission. */
function adoptOpenClawAgentDatabaseSchema(database, reuseIntegrity = true, required = false) {
	const validation = getOpenClawAgentDatabaseValidation(database);
	const schema = validation?.schema;
	const admitted = reuseIntegrity && schema && !database.db.isTransaction ? getAdmittedSqliteSchemaFacts(database.db) : void 0;
	const adopted = Boolean(reuseIntegrity && schema && Atomics.load(new Int32Array(schema.valid), 0) === 1 && (admitted?.schemaVersion === schema.facts.schemaVersion && admitted.userVersion === schema.facts.userVersion || adoptSqliteSchemaFacts(database.db, schema.facts)) && Atomics.load(new Int32Array(schema.valid), 0) === 1);
	if (required && !adopted) throw new Error("Agent schema admission changed before handle adoption; retry the operation");
	if (adopted) {
		adoptCanonicalSessionValidationSchema(database.db);
		if (validation?.integrityVerifiedAt !== void 0) {
			if (readSqliteDatabaseIntegrityVerification(database.db) === void 0) recordSqliteDatabaseIntegrity(database.db, validation.integrityVerifiedAt);
			if (getSqliteDatabaseAdmission(database.db, agentDatabaseValidationKey)?.receiptId !== validation.receiptId) publishSqliteDatabaseAdmission(database.db, agentDatabaseValidationKey, validation);
		}
	}
	return adopted;
}
function matchesValidation(database, validation) {
	return validation.agentId === database.agentId && validation.identity === findOpenClawAgentDatabaseIdentity(database)?.identity && validation.birthtime === findOpenClawAgentDatabaseIdentity(database)?.birthtime && Atomics.load(new Int32Array(validation.valid), 0) === 1;
}
function hasRevokedOpenClawAgentDatabaseValidation(pathname, received) {
	const previous = validatedPaths.get(resolveDatabasePathKey(pathname));
	return received !== void 0 && Atomics.load(new Int32Array(received.valid), 0) !== 1 || previous?.revoked === true || previous?.validation !== void 0 && Atomics.load(new Int32Array(previous.validation.valid), 0) !== 1;
}
function getOpenClawAgentDatabaseValidation(database) {
	const pathname = readOpenClawAgentDatabaseIdentity(database).canonicalPath;
	let entry = validatedPaths.get(pathname);
	if (entry?.revoked) return;
	if (!entry?.integrityVerified || !entry.validation || entry.validation.schema && Atomics.load(new Int32Array(entry.validation.schema.valid), 0) !== 1 || !matchesValidation(database, entry.validation)) {
		const validation = getSqliteDatabaseAdmission(database.db, agentDatabaseValidationKey);
		if (validation && matchesValidation(database, validation)) {
			if (entry && (entry.agentId === void 0 || entry.agentId === database.agentId) && (!entry.validation || matchesValidation(database, entry.validation))) {
				entry.agentId = database.agentId;
				if (entry.validation && entry.validation.receiptId === validation.receiptId) entry.validation.schema = validation.schema;
				else entry.validation = validation;
				entry.integrityVerified = true;
			} else {
				entry = {
					agentId: database.agentId,
					validation,
					integrityVerified: true
				};
				validatedPaths.set(pathname, entry);
			}
		}
	}
	if (!entry?.integrityVerified || !entry.validation || !matchesValidation(database, entry.validation)) return;
	bindValidationLifetime(database, entry.validation);
	return entry.validation;
}
/** The receiving opener must adopt this proof against its own physical file identity. */
function getOpenClawAgentDatabaseValidationForTransfer(database) {
	const pathname = validatedPaths.has(database.path) ? database.path : resolveDatabasePathKey(database.path);
	const entry = validatedPaths.get(pathname);
	if (!entry?.integrityVerified || entry.validation?.agentId !== database.agentId || Atomics.load(new Int32Array(entry.validation.valid), 0) !== 1) return;
	return entry.validation;
}
/** Readers borrow physical/canonical proof without copying the schema catalog or opening a host handle. */
function captureOpenClawAgentDatabaseReadValidation(database, mode = "retained") {
	const current = getOpenClawAgentDatabaseValidationForTransfer(database);
	if (!current) return;
	let canonicalPath = database.path;
	if (validatedPaths.has(canonicalPath)) {
		observeValidationPath(canonicalPath, mode === "admission");
		if (Atomics.load(new Int32Array(current.valid), 0) !== 1) return;
	} else {
		const capturedIdentity = readDatabasePathIdentitySync(database.path);
		if (capturedIdentity.key !== `file:${current.identity}` || capturedIdentity.birthtime !== current.birthtime) return;
		canonicalPath = capturedIdentity.canonicalPath;
	}
	const { agentId, identity, birthtime, receiptId, valid, canonicalReady } = current;
	const validation = {
		agentId,
		identity,
		birthtime,
		receiptId,
		valid,
		canonicalReady
	};
	return {
		canonicalPath,
		validation,
		inputBytes: JSON.stringify(validation).length * 2 + valid.byteLength + canonicalReady.byteLength,
		assertCurrent() {
			if (getOpenClawAgentDatabaseValidationForTransfer(database) !== current) throw new Error("Session reader validation is no longer current");
		}
	};
}
/** Retire a replaced file's proof before capturing its successor's publication guard. */
function retireReplacedAgentValidation(agentId, pathname, expectedIdentity) {
	if (!expectedIdentity) return;
	const retainedValidation = getOpenClawAgentDatabaseValidationForTransfer({
		agentId,
		path: pathname
	});
	if (retainedValidation && retainedValidation.identity !== expectedIdentity.physicalIdentity) invalidateOpenClawAgentDatabaseValidation(pathname, retainedValidation.identity);
}
/** Native admission supplies the checked file identity; no host SQLite handle is needed. */
function captureOpenClawAgentDatabaseValidationTransfer(database) {
	const receive = captureValidationTransfer(database, false);
	return (identity, received) => receive(identity, received) === "accepted";
}
function captureValidationTransfer(database, schemaRequired) {
	const pathname = resolveDatabasePathKey(database.path);
	const existing = validatedPaths.get(pathname);
	const captured = existing?.agentId === database.agentId ? existing : {
		...existing,
		agentId: database.agentId,
		integrityVerified: existing?.integrityVerified ?? false
	};
	validatedPaths.set(pathname, captured);
	const capturedValidation = captured.validation;
	const wasValid = capturedValidation ? Atomics.load(new Int32Array(capturedValidation.valid), 0) : void 0;
	return (identity, value) => {
		const received = agentDatabaseValidationKey.read(value);
		if (!received || received.agentId !== database.agentId || received.identity !== identity || typeof received.birthtime !== "string" || typeof received.receiptId !== "string" || received.receiptId.length === 0) return "invalid";
		const schema = received.schema;
		const valid = Atomics.load(new Int32Array(received.valid), 0);
		const schemaValid = schema && Atomics.load(new Int32Array(schema.valid), 0);
		if (valid !== 0 && valid !== 1 || schemaRequired && (!schema || schemaValid !== 0 && schemaValid !== 1)) return "invalid";
		if (schemaRequired && schemaValid !== 1 || validatedPaths.get(pathname) !== captured || capturedValidation && wasValid === 1 && Atomics.load(new Int32Array(capturedValidation.valid), 0) !== 1 || captured.validation !== capturedValidation && captured.validation && (captured.validation.identity !== identity || Atomics.load(new Int32Array(captured.validation.valid), 0) !== 1) || Atomics.load(new Int32Array(received.valid), 0) !== 1) {
			if (schemaRequired && validatedPaths.get(pathname)?.revoked) Atomics.store(new Int32Array(received.valid), 0, 0);
			return "stale";
		}
		if (captured.integrityVerified && captured.validation?.agentId === database.agentId && captured.validation.identity === identity && captured.validation.birthtime === received.birthtime && Atomics.load(new Int32Array(captured.validation.valid), 0) === 1) {
			const currentSchema = captured.validation.schema;
			if (currentSchema && schema && schemaValid === 1 && Atomics.load(new Int32Array(currentSchema.valid), 0) === 1 && currentSchema.facts.schemaVersion === schema.facts.schemaVersion && currentSchema.facts.userVersion === schema.facts.userVersion) return "accepted";
			if (currentSchema) Atomics.store(new Int32Array(currentSchema.valid), 0, 0);
			captured.validation.schema = schema;
			return "accepted";
		}
		if (hasRevokedOpenClawAgentDatabaseValidation(pathname)) Atomics.store(new Int32Array(received.canonicalReady), 0, 0);
		const aliases = captured.validation?.identity === identity ? [...validatedPaths].flatMap(([candidate, entry]) => entry.validation?.agentId === database.agentId && entry.validation.identity === identity ? [candidate] : []) : [];
		if (wasValid !== 0) invalidateOpenClawAgentDatabaseValidation(pathname);
		else for (const alias of aliases) {
			const superseded = validatedPaths.get(alias)?.validation;
			if (superseded && superseded.receiptId !== received.receiptId) Atomics.store(new Int32Array(superseded.valid), 0, 0);
		}
		validatedPaths.set(pathname, {
			validation: received,
			integrityVerified: true
		});
		for (const alias of aliases) validatedPaths.set(alias, {
			validation: received,
			integrityVerified: true
		});
		return "accepted";
	};
}
/** An admitted runtime acquisition must receive a current schema, never fall back to host scans. */
function captureOpenClawAgentDatabaseAdmissionPublication(database) {
	const receive = captureValidationTransfer(database, true);
	return (identity, received) => {
		const result = receive(identity, received);
		if (result === "invalid") throw new AgentDatabaseSchemaAdmissionInvalidError();
		const schema = getOpenClawAgentDatabaseValidationForTransfer(database)?.schema;
		if (result === "stale" || !schema || Atomics.load(new Int32Array(schema.valid), 0) !== 1) throw new AgentDatabaseSchemaAdmissionChangedError();
	};
}
/** An alias may consume the exact acknowledged physical receipt without revoking it again. */
function captureOpenClawAgentDatabaseAliasPublication(database) {
	const publish = captureOpenClawAgentDatabaseAdmissionPublication(database);
	return (identity, received) => {
		const current = getOpenClawAgentDatabaseValidationForTransfer(database);
		if (isRecord(received) && received.agentId === database.agentId && received.identity === identity && current?.identity === identity && typeof received.receiptId === "string" && received.receiptId.length > 0 && current.receiptId === received.receiptId && current.valid === received.valid && current.schema && isRecord(received.schema) && current.schema.valid === received.schema.valid && Atomics.load(new Int32Array(current.schema.valid), 0) === 1) return;
		publish(identity, received);
	};
}
function canonicalValidationReceipt(database) {
	const pathname = findOpenClawAgentDatabaseIdentity(database)?.canonicalPath;
	if (!database.db.isOpen || !pathname) return;
	const validation = validatedPaths.get(pathname)?.validation;
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
	const pathname = findOpenClawAgentDatabaseIdentity(database)?.canonicalPath;
	if (!pathname || database.db.isTransaction || validatedPaths.get(pathname)?.validation !== void 0 || hasRevokedOpenClawAgentDatabaseValidation(pathname) || !hasPersistedOpenClawAgentCanonicalValidation(database)) return false;
	const canonical = createOpenClawAgentDatabaseValidationReceipt(database, true);
	const entry = validatedPaths.get(pathname) ?? { integrityVerified: false };
	entry.validation = canonical;
	validatedPaths.set(pathname, entry);
	bindValidationLifetime({
		...database,
		path: pathname
	}, canonical);
	return true;
}
/** Offline import/repair owns exclusive custody; rollback may conservatively require validation. */
function invalidateOpenClawAgentCanonicalValidation(database) {
	const validation = canonicalValidationReceipt(database);
	if (validation) {
		Atomics.store(new Int32Array(validation.canonicalReady), 0, 0);
		const pathname = findOpenClawAgentDatabaseIdentity(database)?.canonicalPath;
		if (pathname && validatedPaths.get(pathname)?.integrityVerified) publishSqliteDatabaseAdmission(database.db, agentDatabaseValidationKey, validation);
	}
	clearPersistedOpenClawAgentCanonicalValidation(database);
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
	const pathname = readOpenClawAgentDatabaseIdentity(database).canonicalPath;
	if (hasRevokedOpenClawAgentDatabaseValidation(pathname)) Atomics.store(new Int32Array(validation.canonicalReady), 0, 0);
	invalidateOpenClawAgentDatabaseValidation(pathname);
	validatedPaths.set(pathname, {
		validation,
		integrityVerified: true
	});
	bindValidationLifetime(database, validation);
	return true;
}
function isOpenClawAgentCanonicalStoreEmpty(database) {
	if (database.db.isTransaction || (getAdmittedSqliteSchemaFacts(database.db)?.userVersion ?? readSqliteUserVersion(database.db)) < 21) return false;
	assertCanonicalSessionValidationSchema(database.db);
	return database.db.prepare(`SELECT
    EXISTS(SELECT 1 FROM session_nodes) OR
    EXISTS(SELECT 1 FROM session_canonical_validation_pending) AS populated`).get()?.populated === 0;
}
function setOpenClawAgentDatabaseValidation(database) {
	const pathname = readOpenClawAgentDatabaseIdentity(database).canonicalPath;
	const revoked = hasRevokedOpenClawAgentDatabaseValidation(pathname);
	let validation = createOpenClawAgentDatabaseValidationReceipt(database, isOpenClawAgentCanonicalStoreEmpty(database) || !revoked && !database.db.isTransaction && loadOpenClawAgentCanonicalValidationReceipt(database));
	const entry = validatedPaths.get(pathname);
	if (!revoked && entry && (entry.agentId === void 0 || entry.agentId === database.agentId) && (!entry.validation || matchesValidation(database, entry.validation))) {
		if (entry.validation) {
			if (validation.integrityVerifiedAt !== void 0) entry.validation.integrityVerifiedAt = validation.integrityVerifiedAt;
			Atomics.store(new Int32Array(entry.validation.canonicalReady), 0, Atomics.load(new Int32Array(validation.canonicalReady), 0));
			validation = entry.validation;
		}
		entry.validation = validation;
		entry.integrityVerified = true;
	} else {
		invalidateOpenClawAgentDatabaseValidation(pathname);
		validatedPaths.set(pathname, {
			validation,
			integrityVerified: true
		});
	}
	bindValidationLifetime(database, validation);
	publishOpenClawAgentDatabaseSchema(database);
	return validation;
}
/** The open/migration owner calls this only after complete canonical schema validation. */
function publishOpenClawAgentDatabaseSchema(database) {
	const validation = getOpenClawAgentDatabaseValidation(database);
	const facts = getAdmittedSqliteSchemaFacts(database.db);
	if (validation && facts && !database.db.isTransaction) {
		let valid = validation.schema?.valid;
		if (!valid || Atomics.load(new Int32Array(valid), 0) !== 1) {
			valid = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
			Atomics.store(new Int32Array(valid), 0, 1);
		}
		validation.schema = {
			facts,
			valid
		};
		publishSqliteDatabaseAdmission(database.db, agentDatabaseValidationKey, validation);
	}
}
function invalidateOpenClawAgentDatabaseValidation(pathname, identity = validatedPaths.get(resolveDatabasePathKey(pathname))?.validation?.identity) {
	const resolved = resolveDatabasePathKey(pathname);
	const paths = /* @__PURE__ */ new Set([resolved]);
	if (identity) {
		for (const [candidate, entry] of validatedPaths) if (entry.validation?.identity === identity) paths.add(candidate);
	}
	for (const candidate of paths) {
		releaseValidationObservation(candidate);
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
	const rootKey = rootPath === void 0 ? void 0 : resolveDatabasePathKey(rootPath);
	for (const pathname of validatedPaths.keys()) if (rootKey === void 0 || isPathInside(rootKey, pathname)) {
		invalidateOpenClawAgentDatabaseValidation(pathname);
		validatedPaths.delete(pathname);
	}
}
/** Reader cleanup releases local metadata without revoking its parent's shared proof. */
function releaseOpenClawAgentDatabaseReadValidation(candidates, retainedPaths = []) {
	for (const pathname of validatedPaths.keys()) if (!retainedPaths.some((retained) => matchesAgentDatabaseReadCandidatePath({ path: retained }, pathname)) && candidates.some((candidate) => matchesAgentDatabaseReadCandidatePath(candidate, pathname))) {
		releaseValidationObservation(pathname);
		validatedPaths.delete(pathname);
	}
}
//#endregion
export { AGENT_SCHEMA_COMPATIBILITY as A, adoptCanonicalSessionValidationSchema as C, classifyOpenClawAgentDatabaseReadError as D, withoutCanonicalSessionValidationSchema as E, hasPendingInputConsumptionColumn as F, hasSessionPendingInputsSchema as I, SESSION_GOAL_OPERATIONS_TABLE as L, SESSION_PENDING_INPUTS_TABLE as M, ensureSessionInputCompletionsSchema as N, isOpenClawAgentDatabaseReadOpenFailure as O, ensureSessionPendingInputsSchema as P, ensureSessionGoalOperationsSchema as R, recordOpenClawAgentCanonicalValidation as S, canonicalSessionValidationSchemaSql as T, publishOpenClawAgentDatabaseSchema as _, captureOpenClawAgentDatabaseReadValidation as a, setOpenClawAgentDatabaseValidation as b, getOpenClawAgentDatabaseValidation as c, hasRevokedOpenClawAgentDatabaseValidation as d, invalidateOpenClawAgentCanonicalValidation as f, markOpenClawAgentCanonicalValidation as g, invalidateOpenClawAgentDatabaseValidationsForAgent as h, captureOpenClawAgentDatabaseAliasPublication as i, SESSION_INPUT_COMPLETIONS_TABLE as j, recordOpenClawAgentDatabaseReadOpenFailure as k, getOpenClawAgentDatabaseValidationForTransfer as l, invalidateOpenClawAgentDatabaseValidation as m, adoptOpenClawAgentDatabaseValidation as n, captureOpenClawAgentDatabaseValidationTransfer as o, invalidateOpenClawAgentDatabaseSchema as p, captureOpenClawAgentDatabaseAdmissionPublication as r, clearOpenClawAgentDatabaseValidationCache as s, adoptOpenClawAgentDatabaseSchema as t, hasOpenClawAgentCanonicalValidation as u, releaseOpenClawAgentDatabaseReadValidation as v, assertCanonicalSessionValidationSchema as w, loadOpenClawAgentCanonicalValidationReceipt as x, retireReplacedAgentValidation as y, ensureContextEngineTurnOutboxSchema as z };
