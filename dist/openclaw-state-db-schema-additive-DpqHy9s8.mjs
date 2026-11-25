import{n as isPostgresSqlConnection}from"./sql-connection-nx8lLUJM.mjs";import{ut as OPENCLAW_STATE_SCHEMA_SQL}from"./sqlite-database-admission-BVeAafOy.mjs";import{t as extractSqliteTableSchema}from"./sqlite-schema-sql-XrfUK8rp.mjs";import{a as tableExists,n as ensureColumn,o as tableHasColumn}from"./openclaw-state-db-schema-helpers-4Hs1ye38.mjs";import{i as FIRST_USE_STATE_TABLES,o as LAZY_ADDITIVE_STATE_TABLES}from"./openclaw-state-db-contract-G6fQNIi2.mjs";import{r as ensureStatePostgresFragment}from"./openclaw-state-db-engine-D6XIrck-.mjs";import{c as CLAW_FIRST_USE_ADDITIVE_STATE_COLUMN_DEFINITIONS,d as ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS,u as CLAW_STARTUP_ADDITIVE_STATE_COLUMN_DEFINITIONS}from"./openclaw-state-db-schema-v36-template-names-BdFIivde.mjs";import{o as getCanonicalSqliteNamedIndexNames,s as getCanonicalSqliteTableNames,t as assertSqliteSchemaContains}from"./sqlite-schema-contract-DWWs0_IS.mjs";import{a as ensureOperatorApprovalResolutionRefs,i as backfillDeliveryQueueEntriesFromEntryJson,n as backfillCronJobsFromJobJson,o as repairLegacySubagentExecutionPayloads,r as backfillCronRunLogEntryJson,s as repairLegacySubagentRetainedResults,t as backfillAcpReplayEstimatedBytes}from"./openclaw-state-db-legacy-backfills-B4OP4VfR.mjs";import{t as createSqliteSchemaEnsurer}from"./sqlite-schema-ensure-C9ABVm7H.mjs";
//!src/state/openclaw-state-feature-schema.ts
const featureLocalSql={local_workspace_projections:[extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL,`local_workspace_projections`),extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL,`local_workspace_manifest_nodes`),extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL,`local_workspace_tree_packs`),extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL,`local_workspace_source_path_sets`)].join(`
`),user_profiles:`
CREATE TABLE IF NOT EXISTS user_profiles (
  id TEXT NOT NULL PRIMARY KEY,
  display_name TEXT,
  primary_github_account_id INTEGER,
  avatar BLOB,
  avatar_mime TEXT,
  avatar_sha256 TEXT,
  merged_into TEXT,
  role TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS user_profile_emails (
  email TEXT NOT NULL PRIMARY KEY,
  profile_id TEXT NOT NULL,
  binding_id TEXT,
  created_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_user_profile_emails_profile_id
  ON user_profile_emails(profile_id);

${extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL,`user_profile_identities`)}
`,operator_approval_standing_grants:`
CREATE TABLE IF NOT EXISTS operator_approval_standing_grants (
  grant_id TEXT NOT NULL PRIMARY KEY CHECK (length(grant_id) > 0),
  minted_by_approval_id TEXT NOT NULL
    REFERENCES operator_approvals(approval_id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL CHECK (length(agent_id) > 0),
  cron_job_id TEXT NOT NULL CHECK (length(cron_job_id) > 0),
  job_config_revision TEXT NOT NULL CHECK (length(job_config_revision) > 0),
  operation_binding TEXT NOT NULL CHECK (length(operation_binding) > 0),
  created_at_ms INTEGER NOT NULL,
  expires_at_ms INTEGER CHECK (expires_at_ms IS NULL OR expires_at_ms >= created_at_ms),
  revoked_at_ms INTEGER,
  revoked_by TEXT,
  last_used_at_ms INTEGER,
  use_count INTEGER NOT NULL DEFAULT 0
) STRICT;

CREATE INDEX IF NOT EXISTS idx_operator_approval_standing_grants_binding
  ON operator_approval_standing_grants(agent_id, cron_job_id, operation_binding, created_at_ms DESC);

CREATE TABLE IF NOT EXISTS operator_approval_standing_grant_generations (
  grant_id TEXT NOT NULL PRIMARY KEY
    REFERENCES operator_approval_standing_grants(grant_id) ON DELETE CASCADE,
  job_definition_generation INTEGER NOT NULL CHECK (job_definition_generation >= 1)
) STRICT;
`,worker_environment_session_attachments:`
CREATE TABLE IF NOT EXISTS worker_environment_session_attachments (
  session_id TEXT PRIMARY KEY,
  session_key TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  session_lifecycle_revision TEXT,
  environment_id TEXT NOT NULL UNIQUE,
  generation INTEGER NOT NULL CHECK (generation >= 1),
  created_at_ms INTEGER NOT NULL,
  last_used_at_ms INTEGER NOT NULL,
  closed_at_ms INTEGER,
  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE
) STRICT;
CREATE INDEX IF NOT EXISTS worker_environment_session_attachments_session_key
ON worker_environment_session_attachments(agent_id, session_key);
`};function getOpenClawStateFeatureSchemaSql(e,t){if(t===void 0&&featureLocalSql[e])return featureLocalSql[e];if(e===`skill_library_entries`&&t===void 0)return extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL,e,{endMarker:`-- End profile-owned skill library.`,includeEndMarker:false,errorMessage:`Canonical skill library schema missing.`});return extractSqliteTableSchema(e===`user_profile_emails`?featureLocalSql.user_profiles:OPENCLAW_STATE_SCHEMA_SQL,e,t)}let declarations;function listOpenClawStateFeatureSchemas(){if(declarations)return declarations;const e={local_workspace_projections:[`local_workspace_projections`,`local_workspace_manifest_nodes`,`local_workspace_tree_packs`,`local_workspace_source_path_sets`],user_profiles:[`user_profiles`,`user_profile_emails`,`user_profile_identities`],skill_library_entries:[`skill_library_entries`,`skill_library_revisions`,`skill_library_events`,`skill_library_uploads`],operator_approval_standing_grants:[`operator_approval_standing_grants`,`operator_approval_standing_grant_generations`],worker_environment_session_attachments:[`worker_environment_session_attachments`]};const t=new Set(FIRST_USE_STATE_TABLES);const n=new Set(Object.values(e).flat());for(const t of LAZY_ADDITIVE_STATE_TABLES)if(!n.has(t))e[t]=[t];const r=new Map(Object.entries(e).flatMap(([e,t])=>t.map(t=>[t,e])));const i=[...OPENCLAW_STATE_SCHEMA_SQL.matchAll(/CREATE (?:UNIQUE )?INDEX IF NOT EXISTS (\w+)\s+ON (\w+)[\s\S]*?;/g)];declarations=Object.entries(e).map(([e,n])=>{const a=n.map(e=>getOpenClawStateFeatureSchemaSql(e));const o=i.filter(e=>n.includes(e[2]));const s=[...a,...o.map(e=>e[0])].join(`
`);const c=[...s.matchAll(/CREATE (?:UNIQUE )?INDEX IF NOT EXISTS (\w+)/g)].map(e=>e[1]);const l=[...new Set([...s.matchAll(/REFERENCES (\w+)/g)].map(e=>r.get(e[1])).filter(t=>t!==void 0&&t!==e))];const u=n.some(e=>t.has(e))||e===`worker_environment_session_attachments`?`first-use`:`version-additive`;return{id:e,tables:n,indexes:[...new Set(c)],dependencies:l,activation:u,sql:()=>s}});return declarations}
//!src/state/openclaw-state-db-schema-additive.ts
const tableEnsurers=/* @__PURE__ */ new Map;function ensureTable(e,t,n){if(isPostgresSqlConnection(e))return ensureStatePostgresFragment(e,t);let r=tableEnsurers.get(t);if(!r){const e=getOpenClawStateFeatureSchemaSql(t,n);r=createSqliteSchemaEnsurer(()=>e,{tables:getCanonicalSqliteTableNames(e),indexes:getCanonicalSqliteNamedIndexNames(e)});tableEnsurers.set(t,r)}r(e)}function ensureRepositoryWorkspacePendingResultSchema(e){const t=`worker_workspace_pending_results`;if(tableHasColumn(e,t,`repository_workspace_id`))return;ensureColumn(e,t,`repository_workspace_id TEXT`)}function ensureSessionRepositoryWorkspaceSchema(e){ensureTable(e,`session_repository_workspaces`,{errorMessage:`Repository workspace schema marker is missing.`})}function ensureRepositoryGitHubPublicationSchema(e){ensureTable(e,`github_repository_publication_requests`,{endMarker:`ON github_repository_publication_requests(owner_profile_id, session_id, idempotency_key) WHERE owner_profile_id IS NOT NULL;`,errorMessage:`Repository GitHub publication schema marker is missing.`})}function ensureGitHubPublicationSessionLifecycleSchema(e){ensureTable(e,`github_publication_session_lifecycles`,{errorMessage:`GitHub publication lifecycle schema marker is missing.`})}function ensureSecretStoreSchema(e){ensureTable(e,`secret_store_entries`,{endMarker:`ON secret_store_entries (scope_kind, scope_id, name) WHERE deleted_at_ms IS NULL;`,errorMessage:`OpenClaw secret store schema marker is missing.`});ensureColumn(e,`secret_store_entries`,`allowed_hosts TEXT`)}function ensureMcpOAuthPendingSchema(e){ensureTable(e,`mcp_oauth_pending_authorizations`,{errorMessage:`OpenClaw MCP OAuth pending schema marker is missing.`})}function ensureDevicePairingJoinCodeSchema(e){ensureTable(e,`device_pairing_join_codes`,{errorMessage:`OpenClaw device pairing join-code schema marker is missing.`})}function ensureDevicePairingBrowserRequestSchema(e){ensureTable(e,`device_pairing_browser_requests`,{errorMessage:`OpenClaw device pairing browser request schema marker is missing.`})}function ensureConfigRevisionKeySchema(e){ensureTable(e,`config_revision_keys`,{errorMessage:`OpenClaw config revision key schema marker is missing.`})}function assertAgentDeletionJournalAvailable(e){if(!tableHasColumn(e,`agent_deletion_journal`,`agent_id`))throw new Error(`Agent deletion journal missing; run openclaw doctor --fix to reconstruct it before restoring or deleting agents.`)}function reconstructAgentDeletionJournalSchema(e,t){const n=extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL,`agent_deletion_journal`);const r=tableExists(e,`agent_deletion_journal`);if(!r)e.exec(n);ensureAgentDeletionJournalPhaseSchema(e);assertSqliteSchemaContains(e,t,n);return!r}function ensureAgentDeletionJournalPhaseSchema(e){assertAgentDeletionJournalAvailable(e);if(tableHasColumn(e,`agent_deletion_journal`,`phase`))return;ensureColumn(e,`agent_deletion_journal`,`phase TEXT`)}function ensureAgentDatabaseLeaseSchema(e){if(tableHasColumn(e,`agent_database_leases`,`provenance`))return;ensureTable(e,`agent_database_leases`);ensureColumn(e,`agent_database_leases`,`provenance TEXT`)}function ensureDevicePairSetupCompletionSchema(e){ensureTable(e,`device_pair_setup_completions`)}function ensureDevicePairSetupBootstrapSchema(e){ensureColumn(e,`device_bootstrap_tokens`,`setup_id TEXT`)}function ensureWorkerEnvironmentNodeEnrollmentSchema(e){ensureDevicePairSetupCompletionSchema(e);ensureColumn(e,`worker_environments`,`node_setup_id TEXT`);ensureColumn(e,`worker_environments`,`node_device_id TEXT`)}function ensureNodeWorkerPreparedWorkspaceSchema(e){ensureTable(e,`node_worker_prepared_workspaces`,{errorMessage:`Node prepared workspace schema marker is missing.`})}function ensureWorkerSessionToolStateSchema(e){ensureTable(e,`worker_turn_tool_authorities`);ensureTable(e,`worker_session_tool_operations`)}function ensureGitHubPublicationSchema(e){ensureTable(e,`github_publication_requests`,{endMarker:`ON github_publication_requests(status, updated_at_ms, request_id);`})}function ensurePersonalGitHubPublicationSchema(e){ensureTable(e,`github_personal_publication_requests`,{endMarker:`ON github_personal_publication_requests(status, updated_at_ms, request_id);`,errorMessage:`Personal GitHub publication schema marker is missing.`})}function ensureFirstUseAdditiveStateColumnsForStrictMigration(e){for(const{columnName:t,dataType:n,tableName:r}of CLAW_FIRST_USE_ADDITIVE_STATE_COLUMN_DEFINITIONS)ensureColumn(e,r,`${t} ${n}`)}function ensureColumns(e,t){const n=[];for(const[r,i]of t){const t=i.trim().split(/\s+/,1)[0];if(t&&ensureColumn(e,r,i))n.push({tableName:r,columnName:t})}return n}function ensureAdditiveStateColumns(e,t){const n=t===`repair`;ensureWorkerSessionToolStateSchema(e);for(const{columnName:t,dataType:n,tableName:r}of CLAW_STARTUP_ADDITIVE_STATE_COLUMN_DEFINITIONS)ensureColumn(e,r,`${t} ${n}`);if(ensureColumn(e,...ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.packageUpdatedAt[0]))e.exec(`UPDATE template_package_refs SET updated_at_ms = installed_at_ms;`);ensureColumns(e,ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.packageIntegrity);const r=ensureColumn(e,...ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.diagnosticSequence[0]);if(r)e.exec(`
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
    `);if(r||n)e.exec(`DROP INDEX IF EXISTS idx_diagnostic_events_scope_created;`);const i=ensureColumns(e,ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.cronRunLogs);if(n||i.some(({tableName:e})=>e===`cron_run_logs`))backfillCronRunLogEntryJson(e);const a=ensureColumns(e,ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.acpReplay).length>0;if(a||n)backfillAcpReplayEstimatedBytes(e,a);const o=ensureColumns(e,ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.cronJobs);if(n||o.some(({columnName:e})=>[`name`,`enabled`,`agent_id`,`payload_kind`,`runtime_updated_at_ms`].includes(e)))backfillCronJobsFromJobJson(e);const s=ensureColumns(e,ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.deliveryQueue);if(n||s.some(({tableName:e})=>e===`delivery_queue_entries`))backfillDeliveryQueueEntriesFromEntryJson(e);ensureColumn(e,...ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.originalMediaRoot[0]);ensureColumns(e,ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.beforeTaskAttribution);ensureColumns(e,ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.taskRequester);ensureColumns(e,ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.taskRunDetails);if(n){repairLegacySubagentExecutionPayloads(e);repairLegacySubagentRetainedResults(e)}ensureColumns(e,ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.workerEnvironments);if(n||!tableHasColumn(e,`operator_approvals`,`resolution_ref`))ensureOperatorApprovalResolutionRefs(e)}export{listOpenClawStateFeatureSchemas as C,getOpenClawStateFeatureSchemaSql as S,ensureRepositoryWorkspacePendingResultSchema as _,ensureConfigRevisionKeySchema as a,ensureWorkerEnvironmentNodeEnrollmentSchema as b,ensureDevicePairingBrowserRequestSchema as c,ensureGitHubPublicationSchema as d,ensureGitHubPublicationSessionLifecycleSchema as f,ensureRepositoryGitHubPublicationSchema as g,ensurePersonalGitHubPublicationSchema as h,ensureAgentDeletionJournalPhaseSchema as i,ensureDevicePairingJoinCodeSchema as l,ensureNodeWorkerPreparedWorkspaceSchema as m,ensureAdditiveStateColumns as n,ensureDevicePairSetupBootstrapSchema as o,ensureMcpOAuthPendingSchema as p,ensureAgentDatabaseLeaseSchema as r,ensureDevicePairSetupCompletionSchema as s,assertAgentDeletionJournalAvailable as t,ensureFirstUseAdditiveStateColumnsForStrictMigration as u,ensureSecretStoreSchema as v,reconstructAgentDeletionJournalSchema as x,ensureSessionRepositoryWorkspaceSchema as y};