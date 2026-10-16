import { t as extractSqliteTableSchema } from "./sqlite-schema-sql-CKIqAlrf.mjs";
import { a as tableHasColumn, i as tableExists, n as ensureColumn } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { t as assertSqliteSchemaContains } from "./sqlite-schema-contract-BTxZz0OV.mjs";
import { A as ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS, D as CLAW_FIRST_USE_ADDITIVE_STATE_COLUMN_DEFINITIONS, a as ensureOperatorApprovalResolutionRefs, c as repairLegacySubagentSuspensionReasons, f as OPENCLAW_STATE_SCHEMA_SQL, i as backfillDeliveryQueueEntriesFromEntryJson, k as CLAW_STARTUP_ADDITIVE_STATE_COLUMN_DEFINITIONS, n as backfillCronJobsFromJobJson, o as repairLegacySubagentExecutionPayloads, r as backfillCronRunLogEntryJson, s as repairLegacySubagentRetainedResults, t as backfillAcpReplayEstimatedBytes } from "./openclaw-state-db-legacy-backfills-BxTnDU05.mjs";
//#region src/state/openclaw-state-db-schema-additive.ts
function ensureTable(database, table, options) {
	database.exec(extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, table, options));
}
const repositoryWorkspacePendingSchemas = /* @__PURE__ */ new WeakSet();
function hasRepositoryWorkspacePendingResultSchema(database) {
	if (repositoryWorkspacePendingSchemas.has(database)) return true;
	const exists = tableHasColumn(database, "worker_workspace_pending_results", "repository_workspace_id");
	if (exists && !database.isTransaction) repositoryWorkspacePendingSchemas.add(database);
	return exists;
}
function ensureRepositoryWorkspacePendingResultSchema(database) {
	if (!hasRepositoryWorkspacePendingResultSchema(database)) ensureColumn(database, "worker_workspace_pending_results", "repository_workspace_id TEXT");
}
function ensureSessionRepositoryWorkspaceSchema(database) {
	ensureTable(database, "session_repository_workspaces", { errorMessage: "Repository workspace schema marker is missing." });
}
function ensureRepositoryGitHubPublicationSchema(database) {
	ensureTable(database, "github_repository_publication_requests", {
		endMarker: "ON github_repository_publication_requests(owner_profile_id, session_id, idempotency_key) WHERE owner_profile_id IS NOT NULL;",
		errorMessage: "Repository GitHub publication schema marker is missing."
	});
}
function ensureGitHubPublicationSessionLifecycleSchema(database) {
	ensureTable(database, "github_publication_session_lifecycles", { errorMessage: "GitHub publication lifecycle schema marker is missing." });
}
/** Lazily install the additive secret store table and index on first write. */
function ensureSecretStoreSchema(database) {
	ensureTable(database, "secret_store_entries", {
		endMarker: "ON secret_store_entries (scope_kind, scope_id, name) WHERE deleted_at_ms IS NULL;",
		errorMessage: "OpenClaw secret store schema marker is missing."
	});
	ensureColumn(database, "secret_store_entries", "allowed_hosts TEXT");
}
/** Lazily install durable MCP OAuth callback correlation on first feature use. */
function ensureMcpOAuthPendingSchema(database) {
	ensureTable(database, "mcp_oauth_pending_authorizations", { errorMessage: "OpenClaw MCP OAuth pending schema marker is missing." });
}
/** Lazily install the additive device join-code table on first mint or redemption. */
function ensureDevicePairingJoinCodeSchema(database) {
	ensureTable(database, "device_pairing_join_codes", { errorMessage: "OpenClaw device pairing join-code schema marker is missing." });
}
/** Lazily installs the Gateway's installation-local config revision key owner. */
function ensureConfigRevisionKeySchema(database) {
	ensureTable(database, "config_revision_keys", { errorMessage: "OpenClaw config revision key schema marker is missing." });
}
function assertAgentDeletionJournalAvailable(database) {
	if (!tableHasColumn(database, "agent_deletion_journal", "agent_id")) throw new Error("Agent deletion journal missing; run openclaw doctor --fix to reconstruct it before restoring or deleting agents.");
}
/** Doctor calls this inside the transaction that records its recovery receipt. */
function reconstructAgentDeletionJournalSchema(database, databasePath) {
	const schema = extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, "agent_deletion_journal");
	const existed = tableExists(database, "agent_deletion_journal");
	if (!existed) database.exec(schema);
	assertSqliteSchemaContains(database, databasePath, schema);
	return !existed;
}
function ensureAgentDatabaseLeaseSchema(database) {
	ensureTable(database, "agent_database_leases");
}
/**
* Same-version additive table, registered in LAZY_ADDITIVE_STATE_TABLES so
* existing v6 databases stay valid without it. Uses the canonical schema;
* a downgraded reader simply loses setup-completion reconciliation.
*/
function ensureDevicePairSetupCompletionSchema(database) {
	ensureTable(database, "device_pair_setup_completions");
}
/** Lazily add setup correlation only when setup pairing first writes or consumes a token. */
function ensureDevicePairSetupBootstrapSchema(database) {
	ensureColumn(database, "device_bootstrap_tokens", "setup_id TEXT");
}
/** Installs environment-owned node binding columns at first cloud enrollment use. */
function ensureWorkerEnvironmentNodeEnrollmentSchema(database) {
	ensureDevicePairSetupCompletionSchema(database);
	ensureColumn(database, "worker_environments", "node_setup_id TEXT");
	ensureColumn(database, "worker_environments", "node_device_id TEXT");
}
/** Register fixed build ownership on the dedicated node's current transaction. */
function ensureNodeWorkerPreparedWorkspaceSchema(database) {
	ensureTable(database, "node_worker_prepared_workspaces", { errorMessage: "Node prepared workspace schema marker is missing." });
}
function ensureWorkerSessionToolStateSchema(db) {
	db.exec([extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, "worker_turn_tool_authorities"), extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, "worker_session_tool_operations")].join("\n"));
}
function ensureGitHubPublicationSchema(db) {
	ensureTable(db, "github_publication_requests", { endMarker: "ON github_publication_requests(status, updated_at_ms, request_id);" });
}
/** First personal publication write only; status and old readers leave this surface dormant. */
function ensurePersonalGitHubPublicationSchema(db) {
	ensureTable(db, "github_personal_publication_requests", {
		endMarker: "ON github_personal_publication_requests(status, updated_at_ms, request_id);",
		errorMessage: "Personal GitHub publication schema marker is missing."
	});
}
/**
* Add the feature-owned first-use columns that a STRICT rebuild cannot skip.
*
* These columns normally stay absent until their owning feature first writes
* them, and the persistent schema contract accepts that shape. The STRICT
* table rebuild is the one caller that cannot: it recreates each table from
* canonical SQL, which already declares these columns, so a database missing
* them fails the canonical column check and rolls the entire repair back.
* Ensuring them immediately before that rebuild matches the shape the rebuild
* produces anyway, and stays scoped to databases old enough to need it.
*/
function ensureFirstUseAdditiveStateColumnsForStrictMigration(db) {
	for (const { columnName, dataType, tableName } of CLAW_FIRST_USE_ADDITIVE_STATE_COLUMN_DEFINITIONS) ensureColumn(db, tableName, `${columnName} ${dataType}`);
}
function ensureColumns(db, definitions) {
	const added = [];
	for (const [tableName, definition] of definitions) {
		const columnName = definition.trim().split(/\s+/, 1)[0];
		if (columnName && ensureColumn(db, tableName, definition)) added.push({
			tableName,
			columnName
		});
	}
	return added;
}
/** Runtime pairs new columns with their transforms; full historical repair stays explicit. */
function ensureAdditiveStateColumns(db, scope) {
	const repairHistoricalRows = scope === "repair";
	ensureWorkerSessionToolStateSchema(db);
	for (const { columnName, dataType, tableName } of CLAW_STARTUP_ADDITIVE_STATE_COLUMN_DEFINITIONS) ensureColumn(db, tableName, `${columnName} ${dataType}`);
	if (ensureColumn(db, ...ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.packageUpdatedAt[0])) db.exec("UPDATE claw_package_refs SET updated_at_ms = installed_at_ms;");
	ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.packageIntegrity);
	const addedDiagnosticEventSequence = ensureColumn(db, ...ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.diagnosticSequence[0]);
	if (addedDiagnosticEventSequence) db.exec(`
      WITH ranked AS (
        SELECT
          rowid AS event_rowid,
          ROW_NUMBER() OVER (
            PARTITION BY scope
            ORDER BY created_at ASC, rowid ASC
          ) AS sequence
        FROM diagnostic_events
      )
      UPDATE diagnostic_events
      SET sequence = (
        SELECT ranked.sequence
        FROM ranked
        WHERE ranked.event_rowid = diagnostic_events.rowid
      );
    `);
	if (addedDiagnosticEventSequence || repairHistoricalRows) db.exec("DROP INDEX IF EXISTS idx_diagnostic_events_scope_created;");
	const addedCronLogColumns = ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.cronRunLogs);
	if (repairHistoricalRows || addedCronLogColumns.some(({ tableName }) => tableName === "cron_run_logs")) backfillCronRunLogEntryJson(db);
	if (ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.acpReplay).length > 0 || repairHistoricalRows) backfillAcpReplayEstimatedBytes(db);
	const addedCronJobColumns = ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.cronJobs);
	if (repairHistoricalRows || addedCronJobColumns.some(({ columnName }) => [
		"name",
		"enabled",
		"agent_id",
		"payload_kind",
		"runtime_updated_at_ms"
	].includes(columnName))) backfillCronJobsFromJobJson(db);
	const addedDeliveryColumns = ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.deliveryQueue);
	if (repairHistoricalRows || addedDeliveryColumns.some(({ tableName }) => tableName === "delivery_queue_entries")) backfillDeliveryQueueEntriesFromEntryJson(db);
	ensureColumn(db, ...ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.originalMediaRoot[0]);
	ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.beforeTaskAttribution);
	ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.taskRequester);
	ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.taskRunDetails);
	if (repairHistoricalRows) {
		repairLegacySubagentSuspensionReasons(db);
		repairLegacySubagentExecutionPayloads(db);
		repairLegacySubagentRetainedResults(db);
	}
	ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.workerEnvironments);
	if (repairHistoricalRows || !tableHasColumn(db, "operator_approvals", "resolution_ref")) ensureOperatorApprovalResolutionRefs(db);
}
//#endregion
export { ensureSessionRepositoryWorkspaceSchema as _, ensureDevicePairSetupBootstrapSchema as a, ensureFirstUseAdditiveStateColumnsForStrictMigration as c, ensureMcpOAuthPendingSchema as d, ensureNodeWorkerPreparedWorkspaceSchema as f, ensureSecretStoreSchema as g, ensureRepositoryWorkspacePendingResultSchema as h, ensureConfigRevisionKeySchema as i, ensureGitHubPublicationSchema as l, ensureRepositoryGitHubPublicationSchema as m, ensureAdditiveStateColumns as n, ensureDevicePairSetupCompletionSchema as o, ensurePersonalGitHubPublicationSchema as p, ensureAgentDatabaseLeaseSchema as r, ensureDevicePairingJoinCodeSchema as s, assertAgentDeletionJournalAvailable as t, ensureGitHubPublicationSessionLifecycleSchema as u, ensureWorkerEnvironmentNodeEnrollmentSchema as v, reconstructAgentDeletionJournalSchema as y };
