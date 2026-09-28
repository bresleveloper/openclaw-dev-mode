import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { o as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { i as tableHasColumn, t as ensureColumn } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { t as extractSqliteTableSchema } from "./sqlite-schema-sql-5Wa9sNMr.mjs";
import { i as collectSqliteSchemaIssues } from "./sqlite-schema-contract-BFcZzasN.mjs";
import { t as SessionMetadataUnavailableError } from "./session-metadata-unavailable-error-DwD7IuoE.mjs";
import { n as SESSION_PARTICIPANTS_TABLE } from "./openclaw-agent-db-contract-DzsRD6Fl.mjs";
import { b as MEMORY_INDEX_SOURCES_TABLE, d as MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE, g as MEMORY_CHUNK_FTS_TRIGGER_DEFINITIONS, m as MEMORY_INDEX_CHUNK_PROVENANCE_TABLE, x as MEMORY_PATH_FTS_TRIGGER_DEFINITIONS } from "./memory-schema-CkxujvZk.mjs";
import { i as OPENCLAW_AGENT_SCHEMA_SQL } from "./openclaw-agent-board-schema-vd3Vff_q.mjs";
import { r as SESSION_PROGRESS_CARDS_TABLE } from "./openclaw-agent-progress-card-schema-P92mHByB.mjs";
import { statSync } from "node:fs";
import { randomUUID } from "node:crypto";
//#region src/state/openclaw-agent-context-engine-turn-outbox-schema.ts
const CONTEXT_ENGINE_TURN_OUTBOX_TABLE = "context_engine_turn_outbox";
const ENSURED_DATABASES$2 = /* @__PURE__ */ new WeakSet();
/** Lazily installs the additive context-engine turn outbox on first use. */
function ensureContextEngineTurnOutboxSchema(db) {
	if (ENSURED_DATABASES$2.has(db)) return;
	const ensure = () => {
		db.exec(extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, CONTEXT_ENGINE_TURN_OUTBOX_TABLE, {
			endMarker: "CREATE TABLE IF NOT EXISTS cache_entries (",
			includeEndMarker: false,
			errorMessage: "OpenClaw context-engine turn outbox schema markers are missing."
		}));
	};
	if (db.isTransaction) {
		ensure();
		return;
	}
	runSqliteImmediateTransactionSync(db, ensure);
	ENSURED_DATABASES$2.add(db);
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
//#region src/state/openclaw-agent-message-tool-outcome-schema.ts
const MESSAGE_TOOL_RUN_OUTCOMES_TABLE = "message_tool_run_outcomes";
const ENSURED_DATABASES$1 = /* @__PURE__ */ new WeakSet();
/** Lazily installs the additive outcome table on first use. */
function ensureMessageToolRunOutcomeSchema(db) {
	if (ENSURED_DATABASES$1.has(db)) return;
	runSqliteImmediateTransactionSync(db, () => {
		db.exec(extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, MESSAGE_TOOL_RUN_OUTCOMES_TABLE, {
			endMarker: "CREATE TABLE IF NOT EXISTS session_goal_operations (",
			includeEndMarker: false,
			errorMessage: "OpenClaw message-tool run outcome schema markers are missing."
		}));
	});
	ENSURED_DATABASES$1.add(db);
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
//#region src/state/openclaw-agent-session-transcript-archive-schema.ts
const SESSION_TRANSCRIPT_ARCHIVES_TABLE = "session_transcript_archives";
const ENSURED_DATABASES = /* @__PURE__ */ new WeakSet();
/** Lazily installs the additive canonical archive owner on first archive use. */
function ensureSessionTranscriptArchiveSchema(db) {
	if (ENSURED_DATABASES.has(db)) return;
	const ensure = () => {
		db.exec(extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, SESSION_TRANSCRIPT_ARCHIVES_TABLE, {
			endMarker: "CREATE TABLE IF NOT EXISTS transcript_rewrite_watermarks (",
			includeEndMarker: false,
			errorMessage: "OpenClaw session transcript archive schema markers are missing."
		}));
	};
	if (db.isTransaction) {
		ensure();
		return;
	}
	runSqliteImmediateTransactionSync(db, ensure);
	ENSURED_DATABASES.add(db);
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
function ensureStandingIntentCreatorColumn(db) {
	if (db.prepare("PRAGMA table_info(standing_intents)").all().some((column) => column.name === "creator_sender")) return;
	db.exec("ALTER TABLE standing_intents ADD COLUMN creator_sender TEXT CHECK (creator_sender IS NULL OR length(trim(creator_sender)) > 0)");
}
/** Lazily add the canonical standing-intents tables on first feature use. */
function ensureOpenClawAgentStandingIntentsSchema(db) {
	const ensure = () => {
		db.exec(extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, STANDING_INTENTS_TABLE, {
			endMarker: "CREATE TABLE IF NOT EXISTS session_transcript_index_state (",
			includeEndMarker: false,
			errorMessage: "OpenClaw standing-intents schema markers are missing."
		}));
		ensureStandingIntentCreatorColumn(db);
	};
	if (db.isTransaction) {
		ensure();
		return;
	}
	runSqliteImmediateTransactionSync(db, ensure);
}
//#endregion
//#region src/state/openclaw-agent-db-schema-compatibility.ts
const AGENT_SCHEMA_COMPATIBILITY = {
	allowCompatibleAdditiveColumns: true,
	allowedMissingTables: [
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
//#region src/state/openclaw-agent-db-identity.ts
const identities = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseIdentities"), () => /* @__PURE__ */ new WeakMap());
/** Prepare physical and connection identity once at open; cached aliases are not resolved again. */
function registerOpenClawAgentDatabaseIdentity(db) {
	const filename = db.location() ?? "";
	const file = filename ? statSync(filename, { bigint: true }) : void 0;
	const identity = file ? `${file.dev}:${file.ino}` : Symbol("incognito-agent-database");
	identities.set(db, {
		identity,
		birthtime: file?.birthtimeNs.toString(),
		incarnation: randomUUID(),
		filename
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
	if (database.db.location() !== filename) return false;
	const current = statSync(database.path, {
		bigint: true,
		throwIfNoEntry: false
	});
	return current !== void 0 && identity === `${current.dev}:${current.ino}`;
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
export { LEGACY_ACP_MIGRATION_COLUMN_DEFINITION as C, CANONICAL_READY_COLUMN_DEFINITION as S, ensureContextEngineTurnOutboxSchema as T, hasPendingInputConsumptionColumnMigration as _, registerOpenClawAgentDatabaseIdentity as a, SESSION_GOAL_OPERATIONS_TABLE as b, ensureOpenClawAgentStandingIntentsSchema as c, SESSION_INPUT_COMPLETIONS_TABLE as d, SESSION_PENDING_INPUTS_TABLE as f, hasPendingInputConsumptionColumn as g, ensureSessionPendingInputsSchema as h, readOpenClawAgentDatabaseIdentity as i, SESSION_TRANSCRIPT_ARCHIVES_TABLE as l, ensureSessionInputCompletionsSchema as m, findOpenClawAgentDatabaseIdentity as n, classifyOpenClawAgentDatabaseReadError as o, ensurePendingInputConsumptionColumn as p, isOpenClawAgentDatabasePathCurrent as r, AGENT_SCHEMA_COMPATIBILITY as s, createOpenClawAgentDatabaseClaim as t, ensureSessionTranscriptArchiveSchema as u, hasSessionPendingInputsSchema as v, SESSION_OWNER_COLUMN_DEFINITIONS as w, ensureSessionGoalOperationsSchema as x, ensureMessageToolRunOutcomeSchema as y };
