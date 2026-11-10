import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { i as setSqliteBusyTimeout } from "./sqlite-busy-timeout-COlIRjFZ.mjs";
import { R as revokeSqliteDatabaseAdmissions, nt as extractSqliteTableSchema, ut as quoteSqliteIdentifier } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { t as OPENCLAW_AGENT_SCHEMA_SQL } from "./openclaw-agent-schema-BKBD8edk.mjs";
import { g as readSqliteTextEncoding, i as getAdmittedSqliteSchemaFacts, l as invalidateSqliteSchemaFacts, p as runSqliteReadOperationSync, t as admitSqliteSchema, u as isSqliteSchemaAdmissionCold, v as runSqliteSchemaReadSnapshotSync } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { i as executeSqliteQuerySync, l as prepareSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as resolveOpenClawAgentSqlitePath, i as isPersistentOpenClawAgentDatabasePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { d as sqliteIntegrityCheckSteps, r as assertSqliteIntegrity, u as runSqliteIntegrityOperationSync } from "./sqlite-integrity-06TCB-az.mjs";
import { n as configureSqlitePreSchemaPragmas } from "./sqlite-wal-D2XTertL.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { r as readExistingAgentSchemaMeta } from "./openclaw-agent-db-metadata-90thy9YD.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-Q7gNRxhK.mjs";
import { a as resolveSqliteDatabaseFilePaths } from "./sqlite-files-N5UzY_DG.mjs";
import { n as assertSqliteSchemaContains } from "./sqlite-schema-contract-C7_zBR7q.mjs";
import "./session-key-CSDERtm3.mjs";
import { o as registerOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { _ as assertAgentDeletionRecoveryAllowsMutation, f as prepareAgentDeletionPathFence, n as assertAgentDeletionPathFence } from "./agent-deletion-journal-DpYVtbBb.mjs";
import { _ as repairCanonicalSqliteIndexes, u as runOpenClawStateWriteTransaction, v as verifyAndRepairCanonicalSqliteIndexSteps } from "./openclaw-state-db-BtDOU_3j.mjs";
import { r as migrateSqliteSchemaToStrictInTransaction } from "./sqlite-strict-CTENSqnV.mjs";
import "./openclaw-agent-db-contract-BcoeqAm4.mjs";
import { _ as renewAgentDatabaseMaintenanceAuthorityIfPresent, i as assertAgentDatabaseMaintenanceAuthorityIfPresent, r as assertAgentDatabaseMaintenanceAuthority, u as invalidateOpenClawAgentDatabaseIntegrityBeforeMutation } from "./openclaw-agent-db-lease-Brvd0WI4.mjs";
import { D as ensureMemoryChunkProvenance, a as migrateMemoryIndexStorage, n as migrateMemoryIndexSourcesIdentity, w as ensureMemoryRecallMetadataSchema } from "./memory-schema-DY2eOY6N.mjs";
import { C as adoptCanonicalSessionValidationSchema, T as canonicalSessionValidationSchemaSql, _ as publishOpenClawAgentDatabaseSchema, b as setOpenClawAgentDatabaseValidation, c as getOpenClawAgentDatabaseValidation, d as hasRevokedOpenClawAgentDatabaseValidation, m as invalidateOpenClawAgentDatabaseValidation, p as invalidateOpenClawAgentDatabaseSchema, t as adoptOpenClawAgentDatabaseSchema, w as assertCanonicalSessionValidationSchema } from "./openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import { r as ensureOpenClawAgentBoardSchemaInTransaction } from "./openclaw-agent-board-schema-CskkNSvY.mjs";
import { A as migrateSessionTranscriptGenerations, C as assertSupportedAgentMigrationSchemas, D as migrateConversationDeliveryTargetColumn, E as ensureSessionEntryValidityProjection, F as ensureLegacySessionEntryValidityTriggers, I as migrateCanonicalSessionWriterValidation, L as seedCanonicalSessionValidationPending, N as persistAgentSchemaMetadata, O as migrateSessionCreatorNamespaces, S as migrateAgentJsonPredicatesInTransaction, T as ensureSessionAdditiveColumns, _ as migrateSessionParticipantsSchema, a as ensureSessionReactionsSchemaInTransaction, c as hasPendingCurrentVersionAgentDatabaseMigration, d as migratedSessionColumn, f as repairAndAssertOpenClawAgentV14SchemaForMigration, g as withoutSessionEntrySnapshotsSchema, h as sessionEntrySnapshotsSchemaSql, i as ensureSessionKeyContractSchemaInTransaction, j as readSqliteTableColumns, k as migrateSessionTranscriptActiveProjection, l as hasPendingMemoryChunkMetadataMigration, m as migrateDeployedTranscriptFtsRowsInTransaction, n as assertOpenClawAgentCurrentRuntimeSchema, o as finishAgentSchemaMigration, p as withLegacyAgentStorageSchema, r as assertOpenClawAgentSchemaContains, s as getOpenClawAgentMigrationSchema, t as assertAgentSchemaVersion, u as migrateRetiredAgentStateLeaseSchema, w as backfillSessionConversations, y as migrateOutboxEnqueueSequenceInTransaction } from "./openclaw-agent-db-schema-helpers-DZw0ltGv.mjs";
import { a as hasAgentDatabaseApplicationSchema, i as assertSupportedAgentSchemaVersion, n as assertCurrentAgentSchemaMetadata, r as assertExistingAgentSchemaOwner, t as assertCanonicalAgentPersistenceVersion } from "./openclaw-agent-db-schema-read-CX4aGKRI.mjs";
import { r as parseSqliteSessionEntryRecord } from "./session-entry-json-iiByG7LE.mjs";
import { t as registerOpenClawAgentDatabase } from "./openclaw-agent-db-registry-DuEPPF6m.mjs";
import { t as resolveZstdCodec } from "./zstd-codec-C-vEb3Qf.mjs";
import { a as encodeUsageCostRollup, t as USAGE_COST_ROLLUP_SCOPE } from "./session-cost-usage-rollup-codec-BkTlisOD.mjs";
import { r as splitSessionEntrySnapshots } from "./session-entry-snapshots-CwvH1YlE.mjs";
import { i as prepareTranscriptPayload } from "./transcript-payload-Cu49oQKq.mjs";
import { chmodSync, existsSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
//#region src/state/openclaw-agent-db-permissions.ts
const OPENCLAW_AGENT_DB_DIR_MODE = 448;
const OPENCLAW_AGENT_DB_FILE_MODE = 384;
function ensureMode(target, mode) {
	if (process.platform === "win32" || (statSync(target).mode & 4095) !== mode) chmodSync(target, mode);
}
function ensureOpenClawAgentDatabasePermissions(pathname, options) {
	const dir = path.dirname(pathname);
	const defaultPath = resolveOpenClawAgentSqlitePath({
		agentId: options.agentId,
		env: options.env
	});
	const isDefaultAgentDatabase = path.resolve(pathname) === path.resolve(defaultPath);
	const dirExisted = existsSync(dir);
	mkdirSync(dir, {
		recursive: true,
		mode: OPENCLAW_AGENT_DB_DIR_MODE
	});
	if (isDefaultAgentDatabase || !dirExisted) ensureMode(dir, OPENCLAW_AGENT_DB_DIR_MODE);
	for (const candidate of resolveSqliteDatabaseFilePaths(pathname)) try {
		ensureMode(candidate, OPENCLAW_AGENT_DB_FILE_MODE);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
}
//#endregion
//#region src/infra/session-cost-usage-cache-migration.ts
const PREVIOUS_SCOPE = "session-cost-usage-rollup-v2";
/** Migration-only reader for the version-6 complete-JSON representation. */
function decodePreviousRollup(valueJson) {
	const value = safeParseJsonRecord(valueJson ?? "");
	if (!value || value.version !== 6 || typeof value.pricingFingerprint !== "string" || !isRecord(value.checkpoint) || value.checkpoint.kind !== "jsonl" && value.checkpoint.kind !== "sqlite" || typeof value.scannedAt !== "number" || typeof value.parsedRecords !== "number" || typeof value.countedRecords !== "number" || !isRecord(value.rollup) || !isRecord(value.rollup.buckets) || !isRecord(value.rollup.untimestamped)) return;
	return value;
}
/** Caller owns the migration transaction; retain at most one complete report body at a time. */
function migrateSessionCostUsageRollupStorage(db, renewAuthority) {
	const cache = getNodeSqliteKysely(db);
	let afterKey;
	for (;;) {
		renewAuthority?.();
		let query = cache.selectFrom("cache_entries").select([
			"key",
			"value_json",
			"updated_at"
		]).where("scope", "=", PREVIOUS_SCOPE).orderBy("key", "asc").limit(1);
		if (afterKey !== void 0) query = query.where("key", ">", afterKey);
		const row = executeSqliteQuerySync(db, query).rows[0];
		if (!row) break;
		afterKey = row.key;
		const entry = decodePreviousRollup(row.value_json);
		if (entry) {
			const encoded = encodeUsageCostRollup(entry);
			executeSqliteQuerySync(db, cache.insertInto("cache_entries").values({
				scope: USAGE_COST_ROLLUP_SCOPE,
				key: row.key,
				value_json: encoded.valueJson,
				blob: encoded.blob,
				updated_at: row.updated_at,
				expires_at: null
			}).onConflict((conflict) => conflict.columns(["scope", "key"]).doNothing()));
		}
		executeSqliteQuerySync(db, cache.deleteFrom("cache_entries").where("scope", "=", PREVIOUS_SCOPE).where("key", "=", row.key));
	}
}
//#endregion
//#region src/state/openclaw-agent-db-session-provenance.ts
function backfillTranscriptMutationWatermarks(db) {
	if (!tableExists(db, "transcript_events")) return;
	db.exec(`
    UPDATE sessions
    SET
      transcript_updated_at = COALESCE(
        transcript_updated_at,
        (SELECT MAX(transcript_events.created_at)
         FROM transcript_events
         WHERE transcript_events.session_id = sessions.session_id)
      ),
      transcript_observed_at = COALESCE(transcript_observed_at, updated_at)
    WHERE EXISTS (
      SELECT 1 FROM transcript_events
      WHERE transcript_events.session_id = sessions.session_id
    );
  `);
}
//#endregion
//#region src/state/openclaw-agent-db-legacy-schema.ts
function migrateOpenClawAgentSchema(db) {
	if (readSqliteUserVersion(db) >= 27) return;
	const columns = readSqliteTableColumns(db, "sessions");
	if (!columns) return;
	for (const [name, definition] of Object.entries({
		transcript_updated_at: "INTEGER DEFAULT NULL",
		transcript_observed_at: "INTEGER DEFAULT NULL",
		session_entry_provenance: "INTEGER NOT NULL DEFAULT 0 CHECK (session_entry_provenance IN (0, 1))",
		acp_owned: "INTEGER NOT NULL DEFAULT 0 CHECK (acp_owned IN (0, 1))",
		plugin_owner_id: "TEXT",
		hook_external_content_source: "TEXT CHECK (hook_external_content_source IS NULL OR hook_external_content_source IN ('gmail', 'webhook'))"
	})) if (!columns.has(name)) db.exec(`ALTER TABLE sessions ADD COLUMN ${name} ${definition};`);
	backfillTranscriptMutationWatermarks(db);
}
//#endregion
//#region src/state/openclaw-agent-db-session-nodes-migration.ts
const SESSION_NODE_SCHEMA_VERSION = 14;
function jsonText(path) {
	return `CASE
    WHEN json_valid(entry_json) AND json_type(entry_json, '${path}') = 'text'
    THEN NULLIF(trim(CAST(json_extract(entry_json, '${path}') AS TEXT)), '')
    ELSE NULL
  END`;
}
function jsonNumber(path) {
	return `CASE
    WHEN json_valid(entry_json) AND json_type(entry_json, '${path}') IN ('integer', 'real')
    THEN CAST(json_extract(entry_json, '${path}') AS INTEGER)
    ELSE NULL
  END`;
}
function createSessionNodes(db) {
	db.exec(`
    CREATE TABLE IF NOT EXISTS session_nodes (
      session_key TEXT NOT NULL PRIMARY KEY,
      current_session_id TEXT NOT NULL,
      entry_json TEXT NOT NULL,
      updated_at INTEGER NOT NULL,
      status TEXT CHECK (status IS NULL OR status IN ('running', 'done', 'failed', 'killed', 'timeout')),
      created_at INTEGER,
      created_via TEXT CHECK (created_via IS NULL OR created_via IN ('operator', 'spawn', 'channel', 'cron', 'talk', 'run', 'plugin', 'internal')),
      created_actor_type TEXT CHECK (created_actor_type IS NULL OR created_actor_type IN ('human', 'agent', 'system')),
      created_actor_id TEXT,
      parent_session_key TEXT,
      spawned_by TEXT,
      fork_source_session_key TEXT,
      fork_source_session_id TEXT,
      fork_source_entry_id TEXT,
      label TEXT,
      display_name TEXT,
      category TEXT,
      icon TEXT,
      pinned_at INTEGER,
      archived_at INTEGER,
      last_read_at INTEGER,
      last_interaction_at INTEGER,
      last_activity_at INTEGER
    ) STRICT;
  `);
}
/** Live entries take precedence over routes, then retained generations. */
function backfillSessionNodes(db) {
	const entryColumns = readSqliteTableColumns(db, "session_entries");
	const routeColumns = readSqliteTableColumns(db, "session_routes");
	if (entryColumns) {
		const status = migratedSessionColumn(entryColumns, "status", "NULL");
		db.exec(`INSERT OR REPLACE INTO session_nodes (
        session_key, current_session_id, entry_json, updated_at, status,
        created_at, created_via, created_actor_type, created_actor_id,
        parent_session_key, spawned_by, fork_source_session_key,
        fork_source_session_id, fork_source_entry_id, label, display_name,
        category, icon, pinned_at, archived_at, last_read_at,
        last_interaction_at, last_activity_at
      ) SELECT
        session_key,
        session_id,
        entry_json,
        updated_at,
        ${status},
        ${jsonNumber("$.createdAt")},
        CASE
          WHEN json_valid(entry_json)
            AND json_extract(entry_json, '$.createdVia') IN
              ('operator', 'spawn', 'channel', 'cron', 'talk', 'run', 'plugin', 'internal')
          THEN json_extract(entry_json, '$.createdVia')
          ELSE NULL
        END,
        CASE
          WHEN json_valid(entry_json)
            AND json_extract(entry_json, '$.createdActor.type') IN ('human', 'agent', 'system')
          THEN json_extract(entry_json, '$.createdActor.type')
          WHEN ${jsonText("$.createdBy.id")} IS NOT NULL THEN 'human'
          ELSE NULL
        END,
        COALESCE(${jsonText("$.createdActor.id")}, ${jsonText("$.createdBy.id")}),
        COALESCE(${jsonText("$.parentSessionKey")}, ${jsonText("$.spawnedBy")}),
        ${jsonText("$.spawnedBy")},
        ${jsonText("$.forkSource.sessionKey")},
        ${jsonText("$.forkSource.sessionId")},
        ${jsonText("$.forkSource.entryId")},
        ${jsonText("$.label")},
        ${jsonText("$.displayName")},
        ${jsonText("$.category")},
        NULL,
        ${jsonNumber("$.pinnedAt")},
        ${jsonNumber("$.archivedAt")},
        ${jsonNumber("$.lastReadAt")},
        ${jsonNumber("$.lastInteractionAt")},
        ${jsonNumber("$.lastActivityAt")}
      FROM session_entries;`);
	}
	if (routeColumns) db.exec(`INSERT OR IGNORE INTO session_nodes
      (session_key, current_session_id, entry_json, updated_at)
      SELECT session_key, session_id, '{}', updated_at FROM session_routes;`);
	db.exec(`INSERT OR IGNORE INTO session_nodes
    (session_key, current_session_id, entry_json, updated_at)
    SELECT session_key, session_id, '{}', updated_at FROM sessions;`);
}
/** Project the legacy window owner with the migration's entry/route precedence. */
function createLegacySessionWindowSelect(db) {
	const columns = readSqliteTableColumns(db, "sessions");
	if (!columns) return;
	const entryColumns = readSqliteTableColumns(db, "session_entries");
	const routeColumns = readSqliteTableColumns(db, "session_routes");
	const ownerValue = (table, column) => `(SELECT candidate.${column}
        FROM ${table} AS candidate
        INNER JOIN session_windows AS owner_window ON owner_window.session_id = candidate.session_id
        WHERE candidate.session_id = session_windows.session_id
        ORDER BY CASE WHEN candidate.session_key = owner_window.session_key THEN 0 ELSE 1 END,
                 candidate.updated_at DESC,
                 candidate.session_key ASC
        LIMIT 1)`;
	const entryOwner = entryColumns ? ownerValue("session_entries", "session_key") : "NULL";
	const routeOwner = routeColumns ? ownerValue("session_routes", "session_key") : "NULL";
	const currentEntryJson = entryColumns ? ownerValue("session_entries", "entry_json") : "NULL";
	return {
		columns: `session_id, session_key, previous_session_id, reason, session_scope,
      created_at, updated_at, transcript_updated_at, transcript_observed_at,
      session_entry_provenance, acp_owned, plugin_owner_id,
      hook_external_content_source, started_at, ended_at, status, chat_type,
      channel, account_id, primary_conversation_id, model_provider, model,
      agent_harness_id, parent_session_key, spawned_by, display_name`,
		sql: `SELECT
      session_id,
      COALESCE(${entryOwner}, ${routeOwner}, session_key),
      CASE
        WHEN json_valid(${currentEntryJson})
        THEN NULLIF(trim(CAST(json_extract(${currentEntryJson}, '$.previousSessionId') AS TEXT)), '')
        ELSE NULL
      END,
      NULL,
      ${migratedSessionColumn(columns, "session_scope", "'conversation'")},
      created_at,
      updated_at,
      ${migratedSessionColumn(columns, "transcript_updated_at", "NULL")},
      ${migratedSessionColumn(columns, "transcript_observed_at", "NULL")},
      ${migratedSessionColumn(columns, "session_entry_provenance", "0")},
      ${migratedSessionColumn(columns, "acp_owned", "0")},
      ${migratedSessionColumn(columns, "plugin_owner_id", "NULL")},
      ${migratedSessionColumn(columns, "hook_external_content_source", "NULL")},
      ${migratedSessionColumn(columns, "started_at", "NULL")},
      ${migratedSessionColumn(columns, "ended_at", "NULL")},
      ${migratedSessionColumn(columns, "status", "NULL")},
      ${migratedSessionColumn(columns, "chat_type", "NULL")},
      ${migratedSessionColumn(columns, "channel", "NULL")},
      ${migratedSessionColumn(columns, "account_id", "NULL")},
      ${migratedSessionColumn(columns, "primary_conversation_id", "NULL")},
      ${migratedSessionColumn(columns, "model_provider", "NULL")},
      ${migratedSessionColumn(columns, "model", "NULL")},
      ${migratedSessionColumn(columns, "agent_harness_id", "NULL")},
      ${migratedSessionColumn(columns, "parent_session_key", "NULL")},
      ${migratedSessionColumn(columns, "spawned_by", "NULL")},
      ${migratedSessionColumn(columns, "display_name", "NULL")}
    FROM session_windows`
	};
}
function migrateSessionWindows(db) {
	const projection = createLegacySessionWindowSelect(db);
	if (!projection) return;
	db.exec("ALTER TABLE sessions RENAME TO session_windows;");
	db.exec(`
    DROP TABLE IF EXISTS session_windows_new;
    CREATE TABLE session_windows_new (
      session_id TEXT NOT NULL PRIMARY KEY,
      session_key TEXT NOT NULL,
      previous_session_id TEXT,
      reason TEXT CHECK (reason IS NULL OR reason IN ('initial', 'reset', 'rollover', 'fork', 'rewind', 'switch', 'recovery', 'compaction')),
      session_scope TEXT NOT NULL DEFAULT 'conversation' CHECK (session_scope IN ('conversation', 'shared-main', 'group', 'channel')),
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      transcript_updated_at INTEGER DEFAULT NULL,
      transcript_observed_at INTEGER DEFAULT NULL,
      session_entry_provenance INTEGER NOT NULL DEFAULT 0 CHECK (session_entry_provenance IN (0, 1)),
      acp_owned INTEGER NOT NULL DEFAULT 0 CHECK (acp_owned IN (0, 1)),
      plugin_owner_id TEXT,
      hook_external_content_source TEXT CHECK (hook_external_content_source IS NULL OR hook_external_content_source IN ('gmail', 'webhook')),
      started_at INTEGER,
      ended_at INTEGER,
      status TEXT CHECK (status IS NULL OR status IN ('running', 'done', 'failed', 'killed', 'timeout')),
      chat_type TEXT CHECK (chat_type IS NULL OR chat_type IN ('direct', 'group', 'channel')),
      channel TEXT,
      account_id TEXT,
      primary_conversation_id TEXT,
      model_provider TEXT,
      model TEXT,
      agent_harness_id TEXT,
      parent_session_key TEXT,
      spawned_by TEXT,
      display_name TEXT,
      FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE,
      FOREIGN KEY (primary_conversation_id) REFERENCES conversations(conversation_id) ON DELETE SET NULL
    ) STRICT;
    INSERT INTO session_windows_new (${projection.columns})
    ${projection.sql};
    DROP TABLE session_windows;
    ALTER TABLE session_windows_new RENAME TO session_windows;
  `);
}
function renameTranscriptRewriteWatermarks(db) {
	if (readSqliteTableColumns(db, "session_transcript_generations") && !readSqliteTableColumns(db, "transcript_rewrite_watermarks")) db.exec("ALTER TABLE session_transcript_generations RENAME TO transcript_rewrite_watermarks;");
}
function rebuildBoardTabs(db) {
	if (!readSqliteTableColumns(db, "board_tabs")) return;
	if (readSqliteTableColumns(db, "board_widgets")) db.exec(`
      DELETE FROM board_widgets
      WHERE NOT EXISTS (
        SELECT 1 FROM session_nodes WHERE session_nodes.session_key = board_widgets.session_key
      );
    `);
	db.exec(`
    DROP TABLE IF EXISTS board_tabs_new;
    CREATE TABLE board_tabs_new (
      session_key TEXT NOT NULL,
      tab_id TEXT NOT NULL,
      title TEXT NOT NULL,
      position INTEGER NOT NULL CHECK (position >= 0),
      chat_dock TEXT NOT NULL DEFAULT 'right' CHECK (chat_dock IN ('left', 'right', 'bottom', 'hidden')),
      created_by TEXT NOT NULL CHECK (created_by IN ('user', 'agent')),
      revision INTEGER NOT NULL CHECK (revision >= 0),
      PRIMARY KEY (session_key, tab_id),
      FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
    ) STRICT;
    INSERT INTO board_tabs_new (
      session_key, tab_id, title, position, chat_dock, created_by, revision
    )
    SELECT b.session_key, b.tab_id, b.title, b.position, b.chat_dock, b.created_by, b.revision
    FROM board_tabs AS b
    INNER JOIN session_nodes AS n ON n.session_key = b.session_key;
    DROP TABLE board_tabs;
    ALTER TABLE board_tabs_new RENAME TO board_tabs;
  `);
}
function rebuildHeartbeatOutcomes(db) {
	const columns = readSqliteTableColumns(db, "heartbeat_outcomes");
	if (!columns) return;
	db.exec(`
    DROP TABLE IF EXISTS heartbeat_outcomes_new;
    CREATE TABLE heartbeat_outcomes_new (
      session_key TEXT NOT NULL PRIMARY KEY,
      run_session_key TEXT NOT NULL,
      outcome TEXT NOT NULL CHECK (outcome IN ('progress', 'done', 'blocked', 'needs_attention')),
      summary TEXT NOT NULL,
      response_reason TEXT,
      priority TEXT CHECK (priority IS NULL OR priority IN ('low', 'normal', 'high')),
      next_check TEXT,
      task_names_json TEXT,
      wake_source TEXT,
      wake_reason TEXT,
      occurred_at INTEGER NOT NULL,
      context_run_id TEXT,
      context_claimed_at INTEGER,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
    ) STRICT;
    INSERT INTO heartbeat_outcomes_new (
      session_key, run_session_key, outcome, summary, response_reason, priority,
      next_check, task_names_json, wake_source, wake_reason, occurred_at,
      context_run_id, context_claimed_at, updated_at
    )
    SELECT
      h.session_key,
      h.run_session_key,
      h.outcome,
      h.summary,
      ${migratedSessionColumn(columns, "response_reason", "NULL")},
      ${migratedSessionColumn(columns, "priority", "NULL")},
      ${migratedSessionColumn(columns, "next_check", "NULL")},
      ${migratedSessionColumn(columns, "task_names_json", "NULL")},
      ${migratedSessionColumn(columns, "wake_source", "NULL")},
      ${migratedSessionColumn(columns, "wake_reason", "NULL")},
      h.occurred_at,
      ${migratedSessionColumn(columns, "context_run_id", "NULL")},
      ${migratedSessionColumn(columns, "context_claimed_at", "NULL")},
      h.updated_at
    FROM heartbeat_outcomes AS h
    INNER JOIN session_nodes AS n ON n.session_key = h.session_key;
    DROP TABLE heartbeat_outcomes;
    ALTER TABLE heartbeat_outcomes_new RENAME TO heartbeat_outcomes;
  `);
}
function rebuildSessionMembers(db) {
	if (!readSqliteTableColumns(db, "session_members")) return;
	db.exec(`
    DROP TABLE IF EXISTS session_members_new;
    CREATE TABLE session_members_new (
      session_key TEXT NOT NULL,
      identity_id TEXT NOT NULL,
      added_by TEXT NOT NULL,
      added_at INTEGER NOT NULL,
      PRIMARY KEY (session_key, identity_id),
      FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
    ) STRICT;
    INSERT INTO session_members_new (session_key, identity_id, added_by, added_at)
    SELECT m.session_key, m.identity_id, m.added_by, m.added_at
    FROM session_members AS m
    INNER JOIN session_nodes AS n ON n.session_key = m.session_key;
    DROP TABLE session_members;
    ALTER TABLE session_members_new RENAME TO session_members;
  `);
}
function rebuildTranscriptIndexState(db) {
	const columns = readSqliteTableColumns(db, "session_transcript_index_state");
	if (!columns) return;
	db.exec(`
    DROP TABLE IF EXISTS session_transcript_index_state_new;
    CREATE TABLE session_transcript_index_state_new (
      session_id TEXT NOT NULL PRIMARY KEY,
      indexed_seq INTEGER NOT NULL,
      leaf_event_id TEXT,
      needs_rebuild INTEGER NOT NULL DEFAULT 0,
      active_event_count INTEGER NOT NULL DEFAULT 0,
      active_message_count INTEGER NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (session_id) REFERENCES session_windows(session_id) ON DELETE CASCADE
    ) STRICT;
    INSERT INTO session_transcript_index_state_new (
      session_id, indexed_seq, leaf_event_id, needs_rebuild,
      active_event_count, active_message_count, updated_at
    )
    SELECT
      i.session_id,
      i.indexed_seq,
      ${migratedSessionColumn(columns, "leaf_event_id", "NULL")},
      ${migratedSessionColumn(columns, "needs_rebuild", "0")},
      ${migratedSessionColumn(columns, "active_event_count", "0")},
      ${migratedSessionColumn(columns, "active_message_count", "0")},
      i.updated_at
    FROM session_transcript_index_state AS i
    INNER JOIN session_windows AS w ON w.session_id = i.session_id;
    DROP TABLE session_transcript_index_state;
    ALTER TABLE session_transcript_index_state_new RENAME TO session_transcript_index_state;
  `);
}
/** Replace split entry/route roots with logical nodes and generation windows. */
function migrateSessionNodesAndWindows(db, previousVersion) {
	if (previousVersion >= SESSION_NODE_SCHEMA_VERSION || !readSqliteTableColumns(db, "sessions")) return;
	createSessionNodes(db);
	backfillSessionNodes(db);
	migrateSessionWindows(db);
	renameTranscriptRewriteWatermarks(db);
	rebuildBoardTabs(db);
	rebuildHeartbeatOutcomes(db);
	rebuildSessionMembers(db);
	rebuildTranscriptIndexState(db);
	db.exec(`
    DROP TABLE IF EXISTS session_routes;
    DROP TABLE IF EXISTS session_entries;
  `);
}
//#endregion
//#region src/state/openclaw-agent-session-snapshots-migration.ts
/** The existing schema owner holds maintenance authority and the outer write transaction. */
function migrateSessionEntrySnapshotsInTransaction(database) {
	database.exec("ALTER TABLE session_nodes ADD COLUMN snapshot_revision INTEGER NOT NULL DEFAULT 0");
	database.exec(sessionEntrySnapshotsSchemaSql(OPENCLAW_AGENT_SCHEMA_SQL));
	const db = getNodeSqliteKysely(database);
	const select = db.selectFrom("session_nodes").select([
		"session_key",
		"current_session_id",
		"updated_at",
		"entry_json"
	]).orderBy("session_key").limit(64);
	const selectAfter = prepareSqliteQuerySync(database, (parameter) => select.where("session_key", ">", parameter((key) => key)));
	const insert = prepareSqliteQuerySync(database, (parameter) => db.insertInto("session_entry_snapshots").values({
		session_key: parameter((row) => row.sessionKey),
		field: parameter((row) => row.field),
		value_json: parameter((row) => row.valueJson)
	}));
	const update = prepareSqliteQuerySync(database, (parameter) => db.updateTable("session_nodes").set({ entry_json: parameter((row) => row.entryJson) }).where("session_key", "=", parameter((row) => row.sessionKey)));
	const markValid = prepareSqliteQuerySync(database, (parameter) => db.updateTable("session_nodes").set({ entry_valid: 1 }).where("session_key", "=", parameter((key) => key)));
	let after;
	while (true) {
		const { rows } = after === void 0 ? executeSqliteQuerySync(database, select) : selectAfter(after);
		if (rows.length === 0) return;
		renewAgentDatabaseMaintenanceAuthorityIfPresent();
		for (const row of rows) {
			if (typeof row.session_key !== "string" || typeof row.current_session_id !== "string" || typeof row.updated_at !== "number" || typeof row.entry_json !== "string") throw new Error("Unreadable session row during snapshot migration");
			after = row.session_key;
			const entry = parseSqliteSessionEntryRecord({
				current_session_id: row.current_session_id,
				updated_at: row.updated_at,
				entry_json: row.entry_json
			});
			if (!entry) continue;
			const { entryJson, snapshots } = splitSessionEntrySnapshots(entry);
			if (snapshots.length === 0) continue;
			for (const snapshot of snapshots) insert({
				sessionKey: row.session_key,
				...snapshot
			});
			update({
				entryJson,
				sessionKey: row.session_key
			});
			markValid(row.session_key);
		}
	}
}
//#endregion
//#region src/state/openclaw-agent-transcript-payload-migration.ts
const MIGRATION_TABLE = "transcript_events_payload_migration";
const KNOWN_CHILDREN = /* @__PURE__ */ new Set(["transcript_event_identities", "session_transcript_active_events"]);
function assertTranscriptRebuildInputs(database) {
	assertSqliteSchemaContains(database, "transcript payload migration", extractSqliteTableSchema(withLegacyAgentStorageSchema(OPENCLAW_AGENT_SCHEMA_SQL), "transcript_events"));
	const columns = database.prepare("PRAGMA table_xinfo(transcript_events)").all();
	const expectedColumns = /* @__PURE__ */ new Set([
		"session_id",
		"seq",
		"event_json",
		"created_at"
	]);
	if (columns.length !== expectedColumns.size || columns.some((column) => typeof column.name !== "string" || !expectedColumns.has(column.name))) throw new Error("Transcript payload migration cannot discard unknown columns");
	if (database.prepare(`SELECT name FROM sqlite_schema
      WHERE (type IN ('trigger', 'index') AND tbl_name = 'transcript_events' AND sql IS NOT NULL)
         OR (type IN ('view', 'trigger') AND sql LIKE '%transcript_events%')`).all().length > 0) throw new Error("Transcript payload migration cannot rebuild unknown indexes, views, or triggers");
	if (database.prepare("SELECT 1 FROM sqlite_schema WHERE name = ?").get(MIGRATION_TABLE)) throw new Error("Transcript payload migration table already exists");
	for (const table of database.prepare("SELECT name FROM sqlite_schema WHERE type = 'table'").all()) {
		if (typeof table.name !== "string") throw new Error("Invalid table name during transcript payload migration");
		if (KNOWN_CHILDREN.has(table.name)) continue;
		if (database.prepare(`PRAGMA foreign_key_list(${quoteSqliteIdentifier(table.name)})`).all().some((key) => key.table === "transcript_events")) throw new Error("Transcript payload migration cannot rebuild an unknown foreign-key target");
	}
}
/** Convert original bytes under the admitted agent migration; never hydrate oversized identity rows. */
function migrateTranscriptPayloadStorageInTransaction(database) {
	if (!database.isTransaction || database.prepare("PRAGMA foreign_keys").get()?.foreign_keys !== 0) throw new Error("Transcript payload migration requires an admitted transaction with foreign keys off");
	assertTranscriptRebuildInputs(database);
	const utf8 = readSqliteTextEncoding(database) === "UTF-8";
	const decoder = new TextDecoder("utf-8", {
		fatal: true,
		ignoreBOM: true
	});
	const codec = resolveZstdCodec();
	database.exec(extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, "transcript_events").replace("IF NOT EXISTS transcript_events", MIGRATION_TABLE));
	const copyIdentity = database.prepare(`
    INSERT INTO ${MIGRATION_TABLE}
      (rowid, session_id, seq, event_json, created_at, event_zstd, event_utf8_bytes, navigation_json)
    SELECT rowid, session_id, seq, event_json, created_at, NULL,
           CASE WHEN ? THEN octet_length(event_json) ELSE NULL END, ?
    FROM transcript_events WHERE rowid = ?`);
	const copyCompressed = database.prepare(`
    INSERT INTO ${MIGRATION_TABLE}
      (rowid, session_id, seq, event_json, created_at, event_zstd, event_utf8_bytes, navigation_json)
    SELECT rowid, session_id, seq, NULL, created_at, ?, ?, ?
    FROM transcript_events WHERE rowid = ?`);
	copyIdentity.setReadBigInts(true);
	copyCompressed.setReadBigInts(true);
	const readBytes = database.prepare("SELECT CAST(event_json AS BLOB) AS bytes FROM transcript_events WHERE rowid = ?");
	const metadata = database.prepare("SELECT rowid AS storage_rowid, octet_length(event_json) AS bytes FROM transcript_events ORDER BY rowid");
	metadata.setReadBigInts(true);
	let renewedAt = performance.now();
	for (const row of metadata.iterate()) {
		if (performance.now() - renewedAt >= 1e3) {
			renewAgentDatabaseMaintenanceAuthorityIfPresent();
			renewedAt = performance.now();
		}
		if (typeof row.storage_rowid !== "bigint" || typeof row.bytes !== "bigint") throw new Error("Invalid transcript storage identity during migration");
		let navigation = null;
		let copied = false;
		if (utf8 && row.bytes <= BigInt(4194304)) {
			const bytes = readBytes.get(row.storage_rowid)?.bytes;
			if (!(bytes instanceof Uint8Array)) throw new Error("Transcript payload disappeared during migration");
			let text;
			try {
				text = decoder.decode(bytes);
			} catch {}
			if (text !== void 0) {
				const payload = prepareTranscriptPayload(database, text, void 0, "UTF-8");
				navigation = payload.navigation_json;
				if (payload.event_zstd !== null) {
					if (!codec || payload.event_utf8_bytes === null || !codec.decompress(payload.event_zstd, payload.event_utf8_bytes).equals(bytes)) throw new Error("Transcript compression did not preserve canonical bytes");
					const result = copyCompressed.run(payload.event_zstd, payload.event_utf8_bytes, navigation, row.storage_rowid);
					if (Number(result.changes) !== 1) throw new Error("Transcript payload disappeared before migration publication");
					copied = true;
				}
			}
		}
		if (!copied && Number(copyIdentity.run(utf8 ? 1 : 0, navigation, row.storage_rowid).changes) !== 1) throw new Error("Transcript identity payload disappeared before migration publication");
	}
	renewAgentDatabaseMaintenanceAuthorityIfPresent();
	database.exec(`DROP TABLE transcript_events;
    ALTER TABLE ${MIGRATION_TABLE} RENAME TO transcript_events;`);
}
//#endregion
//#region src/state/openclaw-agent-db-schema.ts
const agentDbLog = createSubsystemLogger("state/agent-db");
function resolveAgentDatabaseIntegrityGateReason(database, proof) {
	if (proof.integrityRevoked) return "stale-lease-full";
	if (hasRevokedOpenClawAgentDatabaseValidation(database.path, proof.validation)) return "revoked";
	return proof.reuseIntegrity ? "no-proof" : "lease-class";
}
function migrateMemoryChunkMetadataSchema(db) {
	ensureMemoryRecallMetadataSchema(db);
	ensureMemoryChunkProvenance(db);
}
function* agentDatabaseIntegrityBeforeMutationSteps(database, agentId, pathname, diagnostics, verification, reuseRuntimeIntegrity = false, admittedSchema = false) {
	if (reuseRuntimeIntegrity && admittedSchema) {
		if (diagnostics) diagnostics.integrityGateOutcome = "cached";
		return false;
	}
	setSqliteBusyTimeout(database, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);
	const userVersion = getAdmittedSqliteSchemaFacts(database)?.userVersion ?? readSqliteUserVersion(database);
	const hasApplicationSchema = userVersion === 0 && hasAgentDatabaseApplicationSchema(database);
	const migrationPending = userVersion === 0 && hasApplicationSchema || userVersion > 0 && userVersion < 27;
	if (migrationPending) agentDbLog.info("agent database schema migration pending; verifying integrity first", {
		fromVersion: userVersion,
		path: pathname,
		toVersion: 27
	});
	const hasPendingCurrentVersionMigration = userVersion === 27 && hasPendingCurrentVersionAgentDatabaseMigration(database);
	const startedAt = performance.now();
	if (diagnostics?.integrityGateReason === "stale-lease-full" && diagnostics.because) agentDbLog.info(`agent database integrityGateReason=stale-lease-full because=${diagnostics.because}`, {
		agentId,
		path: pathname,
		...diagnostics
	});
	if (userVersion === 27 && !hasPendingCurrentVersionMigration) {
		const rebuiltIndexes = yield* verifyAndRepairCanonicalSqliteIndexSteps(database, pathname, OPENCLAW_AGENT_SCHEMA_SQL, {
			allowMissingColumns: true,
			validateAfterRepair: () => assertOpenClawAgentCurrentRuntimeSchema(database, {
				agentId,
				pathname
			}),
			diagnostics,
			reuseIntegrity: reuseRuntimeIntegrity || verification !== void 0 && !migrationPending && !hasPendingCurrentVersionMigration
		});
		if (rebuiltIndexes.length > 0) agentDbLog.warn(`Rebuilt canonical agent SQLite indexes for ${agentId} (${pathname}): ${rebuiltIndexes.join(", ")}`, {
			agentId,
			path: pathname,
			indexes: rebuiltIndexes,
			elapsedMs: Math.floor(performance.now() - startedAt)
		});
		assertOpenClawAgentCurrentRuntimeSchema(database, {
			agentId,
			pathname
		});
	} else if (userVersion === 0 && !hasApplicationSchema && database.prepare("PRAGMA page_count").get()?.page_count === 0) assertSqliteIntegrity(database, pathname);
	else yield* sqliteIntegrityCheckSteps(database, pathname, diagnostics);
	return hasPendingCurrentVersionMigration;
}
/** Re-admit the retained connection without replacing its native generation or lease. */
function refreshOpenClawAgentDatabaseSchema(database, assertCurrent) {
	const { db, agentId, path: pathname } = database;
	assertCurrent();
	if (db.isTransaction) throw new Error("Agent schema admission requires a settled writer");
	try {
		const reused = runSqliteReadOperationSync(db, () => {
			assertSupportedAgentSchemaVersion(db, pathname);
			assertCurrentAgentSchemaMetadata(readExistingAgentSchemaMeta(db), agentId, pathname);
			const validation = getOpenClawAgentDatabaseValidation(database);
			return validation && adoptOpenClawAgentDatabaseSchema(database) ? validation : void 0;
		});
		if (reused) return reused;
		const validation = getOpenClawAgentDatabaseValidation(database);
		invalidateOpenClawAgentDatabaseSchema(database);
		const convergence = runSqliteIntegrityOperationSync(agentDatabaseIntegrityBeforeMutationSteps(db, agentId, pathname, void 0, void 0, Boolean(validation)), assertCurrent);
		assertCanonicalAgentPersistenceVersion(db, pathname);
		if (convergence) ensureAgentSchema(db, agentId, pathname);
		return runSqliteSchemaReadSnapshotSync(db, () => {
			admitSqliteSchema(db);
			assertCanonicalSessionValidationSchema(db);
			assertCurrent();
			if (!validation) return setOpenClawAgentDatabaseValidation(database);
			publishOpenClawAgentDatabaseSchema(database);
			return validation;
		});
	} catch (error) {
		invalidateOpenClawAgentDatabaseValidation(pathname);
		throw error;
	}
}
function migrateAgentStorageInTransaction(db, schemaSql, previousVersion, warnings) {
	renewAgentDatabaseMaintenanceAuthorityIfPresent();
	if (previousVersion === 22) migrateDeployedTranscriptFtsRowsInTransaction(db, schemaSql);
	else if (db.prepare("SELECT 1 FROM sqlite_schema WHERE name = ?").get("session_transcript_fts_rows")) throw new Error("Transcript FTS row map already exists before the schema-23 storage migration.");
	renewAgentDatabaseMaintenanceAuthorityIfPresent();
	migrateTranscriptPayloadStorageInTransaction(db);
	renewAgentDatabaseMaintenanceAuthorityIfPresent();
	migrateMemoryIndexStorage(db, {
		renewAuthority: renewAgentDatabaseMaintenanceAuthorityIfPresent,
		onWarning: (warning) => warnings.push(warning)
	});
	renewAgentDatabaseMaintenanceAuthorityIfPresent();
	migrateSessionCostUsageRollupStorage(db, renewAgentDatabaseMaintenanceAuthorityIfPresent);
	renewAgentDatabaseMaintenanceAuthorityIfPresent();
	db.exec(schemaSql);
	if (previousVersion !== 22) db.exec(`
    INSERT INTO session_transcript_fts_rows (id, session_id, message_id)
    SELECT rowid, session_id, message_id FROM session_transcript_fts;
  `);
}
function ensureAgentSchema(db, agentId, pathname, targetVersion = 27, withMutation = (run) => run(), onMigrationWarning, versionMigrationOnly = false) {
	const warnings = [];
	const schemaSql = getOpenClawAgentMigrationSchema(targetVersion);
	db.exec("PRAGMA foreign_keys = OFF; PRAGMA legacy_alter_table = OFF;");
	let created = false;
	try {
		const mutate = () => {
			invalidateSqliteSchemaFacts(db);
			const metadata = readExistingAgentSchemaMeta(db);
			assertExistingAgentSchemaOwner(metadata, agentId, pathname);
			const previousVersion = assertSupportedAgentSchemaVersion(db, pathname);
			const isEmptyDatabase = previousVersion === 0 && !hasAgentDatabaseApplicationSchema(db);
			const schemaMigration = previousVersion < targetVersion && (previousVersion > 0 || metadata !== null);
			const identityMigration = targetVersion >= 18 && schemaMigration;
			if (identityMigration && metadata?.schemaVersion !== previousVersion) throw new Error(`Agent schema markers disagree for ${pathname}; repair ownership metadata before migration.`);
			if (previousVersion > targetVersion) throw new Error(`OpenClaw agent database ${pathname} uses schema version ${previousVersion}; expected at most ${targetVersion} for this migration.`);
			if (!isEmptyDatabase && previousVersion < targetVersion) assertSupportedAgentMigrationSchemas(db, pathname, previousVersion);
			const assertMigration = () => {
				if (!schemaMigration) return;
				if (identityMigration) assertAgentDatabaseMaintenanceAuthority();
				getOpenClawDatabaseMaintenanceScope()?.assertAgentSchemaMigration({
					agentId,
					path: pathname,
					foundVersion: previousVersion,
					supportedVersion: targetVersion
				});
			};
			assertMigration();
			if (isEmptyDatabase && targetVersion === 27) {
				db.exec(schemaSql);
				db.exec(`PRAGMA user_version = ${targetVersion};`);
				persistAgentSchemaMetadata(db, agentId, targetVersion);
				created = true;
				return;
			}
			const requiresCanonicalWriterMigration = !isEmptyDatabase && previousVersion < 25 && targetVersion >= 25;
			const requiresStorageMigration = !isEmptyDatabase && previousVersion < 23 && targetVersion >= 23;
			const requiresSnapshotMigration = !isEmptyDatabase && previousVersion < 24 && targetVersion >= 24;
			const storageSchemaSql = requiresSnapshotMigration ? withoutSessionEntrySnapshotsSchema(schemaSql) : schemaSql;
			const migrationSchemaSql = requiresStorageMigration ? withLegacyAgentStorageSchema(storageSchemaSql, previousVersion) : storageSchemaSql;
			const finishStorageMigration = () => {
				if (requiresStorageMigration) migrateAgentStorageInTransaction(db, storageSchemaSql, previousVersion, warnings);
				if (requiresSnapshotMigration) migrateSessionEntrySnapshotsInTransaction(db);
				if (requiresCanonicalWriterMigration) migrateCanonicalSessionWriterValidation(db);
				if (!isEmptyDatabase && previousVersion < 26 && targetVersion >= 26) migrateAgentJsonPredicatesInTransaction(db);
				if (previousVersion < 27 && targetVersion >= 27) {
					const elapsedMs = migrateOutboxEnqueueSequenceInTransaction(db);
					if (elapsedMs !== null) agentDbLog.info("agent outbox enqueue sequence rebuilt", {
						agentId,
						pathname,
						elapsedMs
					});
				}
				if (previousVersion < 25) repairCanonicalSqliteIndexes(db, pathname, schemaSql, { verifyPhysicalIntegrity: false });
				finishAgentSchemaMigration(db, agentId, pathname, targetVersion, schemaSql, identityMigration, assertMigration);
			};
			if (previousVersion >= 25 && previousVersion < targetVersion) {
				assertAgentSchemaVersion(db, {
					agentId,
					pathname,
					version: previousVersion
				}, getOpenClawAgentMigrationSchema(previousVersion));
				if (!versionMigrationOnly) ensureSessionAdditiveColumns(db);
				finishStorageMigration();
				return;
			}
			if (previousVersion < targetVersion && previousVersion >= 20 && previousVersion < 25 && targetVersion >= 21) {
				if (previousVersion >= 21) {
					migrateRetiredAgentStateLeaseSchema(db, pathname, targetVersion);
					ensureSessionAdditiveColumns(db);
					ensureSessionEntryValidityProjection(db);
					ensureLegacySessionEntryValidityTriggers(db);
					ensureSessionKeyContractSchemaInTransaction(db);
					if (hasPendingMemoryChunkMetadataMigration(db)) migrateMemoryChunkMetadataSchema(db);
				}
				const previousSchema = getOpenClawAgentMigrationSchema(previousVersion);
				repairCanonicalSqliteIndexes(db, pathname, previousSchema, { verifyPhysicalIntegrity: false });
				assertAgentSchemaVersion(db, {
					agentId,
					pathname,
					version: previousVersion
				}, previousSchema);
				if (previousVersion < 21) {
					db.exec(canonicalSessionValidationSchemaSql(migrationSchemaSql));
					if (!requiresCanonicalWriterMigration) seedCanonicalSessionValidationPending(db);
				}
				finishStorageMigration();
				return;
			}
			if (previousVersion === 17) {
				ensureSessionAdditiveColumns(db);
				ensureLegacySessionEntryValidityTriggers(db);
				assertSqliteIntegrity(db, pathname);
				migrateMemoryChunkMetadataSchema(db);
				assertOpenClawAgentSchemaContains(db, pathname, getOpenClawAgentMigrationSchema(previousVersion), "legacy", true);
			}
			migrateRetiredAgentStateLeaseSchema(db, pathname, targetVersion);
			if (previousVersion === targetVersion) {
				ensureSessionAdditiveColumns(db);
				ensureSessionEntryValidityProjection(db);
				ensureSessionKeyContractSchemaInTransaction(db);
				ensureSessionReactionsSchemaInTransaction(db);
				if (hasPendingMemoryChunkMetadataMigration(db)) {
					migrateMemoryChunkMetadataSchema(db);
					db.exec(schemaSql);
				}
				repairCanonicalSqliteIndexes(db, pathname, schemaSql, { verifyPhysicalIntegrity: false });
				persistAgentSchemaMetadata(db, agentId, targetVersion);
				assertAgentSchemaVersion(db, {
					agentId,
					pathname,
					version: targetVersion
				}, schemaSql);
				assertAgentDatabaseMaintenanceAuthorityIfPresent();
				return;
			} else if (previousVersion === 14) repairAndAssertOpenClawAgentV14SchemaForMigration(db, {
				agentId,
				pathname
			});
			renewAgentDatabaseMaintenanceAuthorityIfPresent();
			migrateMemoryIndexSourcesIdentity(db);
			migrateOpenClawAgentSchema(db);
			migrateConversationDeliveryTargetColumn(db);
			if (previousVersion < 11) backfillSessionConversations(db);
			migrateSessionNodesAndWindows(db, previousVersion);
			renewAgentDatabaseMaintenanceAuthorityIfPresent();
			ensureSessionAdditiveColumns(db);
			if (targetVersion >= 18 && previousVersion < 18) migrateSessionParticipantsSchema(db, pathname);
			if (targetVersion >= 19) migrateSessionCreatorNamespaces(db, previousVersion);
			ensureSessionEntryValidityProjection(db);
			renewAgentDatabaseMaintenanceAuthorityIfPresent();
			db.exec(migrationSchemaSql);
			if (previousVersion !== 17) migrateMemoryChunkMetadataSchema(db);
			if (previousVersion < targetVersion) ensureOpenClawAgentBoardSchemaInTransaction(db);
			migrateSessionTranscriptGenerations(db, previousVersion);
			migrateSessionTranscriptActiveProjection(db, previousVersion);
			if (previousVersion < 11) migrateSqliteSchemaToStrictInTransaction(db, migrationSchemaSql, { databaseLabel: pathname });
			if (previousVersion < 21 && targetVersion >= 21 && !requiresCanonicalWriterMigration) seedCanonicalSessionValidationPending(db);
			finishStorageMigration();
		};
		runSqliteImmediateTransactionSync(db, () => withMutation(mutate), {
			databaseLabel: pathname,
			operationLabel: "agent.schema.ensure",
			withCommit: withMutation
		});
	} finally {
		if (db.isOpen) db.exec("PRAGMA foreign_keys = ON;");
	}
	if (created && (isSqliteSchemaAdmissionCold(db) || getAdmittedSqliteSchemaFacts(db))) {
		admitSqliteSchema(db);
		adoptCanonicalSessionValidationSchema(db);
	}
	for (const warning of warnings) {
		const message = `Agent ${agentId}: ${warning}`;
		agentDbLog.warn(message);
		onMigrationWarning?.(message);
	}
}
/** Initialize agent schema/ownership metadata on an independently managed connection. */
function ensureOpenClawAgentDatabaseSchema(db, options) {
	runSqliteIntegrityOperationSync(ensureOpenClawAgentDatabaseSchemaSteps(db, options));
}
/** Share one schema sequence between synchronous callers and leased maintenance. */
function* ensureOpenClawAgentDatabaseSchemaSteps(db, options) {
	const agentId = normalizeAgentId(options.agentId);
	const databaseOptions = {
		...options,
		agentId
	};
	const pathname = resolveOpenClawAgentSqlitePath(databaseOptions);
	revokeSqliteDatabaseAdmissions(db);
	assertExistingAgentSchemaOwner(readExistingAgentSchemaMeta(db), agentId, pathname);
	const version = assertSupportedAgentSchemaVersion(db, pathname);
	if (version < 27) assertSupportedAgentMigrationSchemas(db, pathname, version);
	const deletionFence = databaseOptions.register === true && isPersistentOpenClawAgentDatabasePath(pathname, databaseOptions.env) ? prepareAgentDeletionPathFence({
		agentId,
		path: pathname
	}, { env: databaseOptions.env }, "maintenance") : void 0;
	const withRegistrationFence = (run) => {
		if (!deletionFence) return run();
		return runOpenClawStateWriteTransaction((database) => {
			assertAgentDeletionRecoveryAllowsMutation(database, pathname);
			assertAgentDeletionPathFence(database, deletionFence);
			return run();
		}, {
			env: databaseOptions.env,
			initializationAgentPaths: [pathname]
		});
	};
	withRegistrationFence(() => void 0);
	if (db.location()) invalidateOpenClawAgentDatabaseIntegrityBeforeMutation(pathname);
	ensureOpenClawAgentDatabasePermissions(pathname, databaseOptions);
	setSqliteBusyTimeout(db, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);
	assertSupportedAgentSchemaVersion(db, pathname);
	assertExistingAgentSchemaOwner(readExistingAgentSchemaMeta(db), agentId, pathname);
	const withIntegrityMutation = (run) => deletionFence ? runSqliteImmediateTransactionSync(db, () => withRegistrationFence(run), {
		databaseLabel: pathname,
		operationLabel: "agent.schema.integrity",
		withCommit: withRegistrationFence
	}) : run();
	if (!options.versionMigrationOnly && readSqliteUserVersion(db) !== 17) {
		const integrity = agentDatabaseIntegrityBeforeMutationSteps(db, agentId, pathname);
		try {
			let step = withIntegrityMutation(() => integrity.next());
			while (!step.done) {
				let failure;
				try {
					yield step.value;
				} catch (error) {
					failure = { error };
				}
				step = withIntegrityMutation(() => failure ? integrity.throw(failure.error) : integrity.next());
			}
		} finally {
			integrity.return(false);
		}
	}
	configureSqlitePreSchemaPragmas(db, { busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS });
	ensureAgentSchema(db, agentId, pathname, 27, withRegistrationFence, options.onMigrationWarning, options.versionMigrationOnly);
	if (options.versionMigrationOnly) return;
	ensureOpenClawAgentDatabasePermissions(pathname, databaseOptions);
	let admittedDb;
	if (db.location() && (isSqliteSchemaAdmissionCold(db) || getAdmittedSqliteSchemaFacts(db))) {
		admitSqliteSchema(db);
		assertCanonicalSessionValidationSchema(db);
		registerOpenClawAgentDatabaseIdentity(db);
		setOpenClawAgentDatabaseValidation({
			db,
			path: pathname,
			agentId
		});
		admittedDb = db;
	}
	if (databaseOptions.register === true) registerOpenClawAgentDatabase({
		agentId,
		path: pathname,
		env: databaseOptions.env,
		admittedDb
	});
}
//#endregion
export { refreshOpenClawAgentDatabaseSchema as a, ensureOpenClawAgentDatabaseSchemaSteps as i, ensureAgentSchema as n, resolveAgentDatabaseIntegrityGateReason as o, ensureOpenClawAgentDatabaseSchema as r, ensureOpenClawAgentDatabasePermissions as s, agentDatabaseIntegrityBeforeMutationSteps as t };
