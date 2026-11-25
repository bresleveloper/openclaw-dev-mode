import{l as isRecord}from"./record-coerce-BTbqdJ3-.mjs";import{n as safeParseJsonRecord}from"./json-coercion-DNNwq4_v.mjs";import{n as normalizeAgentId}from"./agent-id-cOfqmfln.mjs";import"./session-key-C6YO7qUA.mjs";import{a as isPersistentOpenClawAgentDatabasePath,l as resolveOpenClawAgentSqlitePath}from"./openclaw-agent-db.paths-CxBl-eWJ.mjs";import{a as getOpenClawDatabaseMaintenanceScope}from"./openclaw-state-maintenance-context-l7SzbyyV.mjs";import{K as revokeSqliteDatabaseAdmissions,k as readSqliteDatabaseIntegrityVerification}from"./sqlite-database-admission-BVeAafOy.mjs";import{l as quoteSqliteIdentifier,t as extractSqliteTableSchema}from"./sqlite-schema-sql-XrfUK8rp.mjs";import{t as OPENCLAW_AGENT_SCHEMA_SQL}from"./openclaw-agent-schema-BhcrjAJt.mjs";import{t as OPENCLAW_AGENT_SCHEMA_VERSION}from"./openclaw-schema-versions-rhFQpVhP.mjs";import{t as createSubsystemLogger}from"./subsystem-BXrV0rVs.mjs";import{i as executeSqliteQuerySync,s as getNodeSqliteKysely,u as prepareSqliteQuerySync}from"./kysely-sync-Dl78faM1.mjs";import{d as invalidateSqliteSchemaFacts,f as isSqliteSchemaAdmissionCold,o as getAdmittedSqliteSchemaFacts,t as admitSqliteSchema,y as readSqliteTextEncoding}from"./sqlite-schema-facts-Edd-ttp_.mjs";import{a as tableExists}from"./openclaw-state-db-schema-helpers-4Hs1ye38.mjs";import{o as readSqliteUserVersion}from"./sqlite-user-version-Cipe-U8x.mjs";import{l as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS}from"./openclaw-state-db-contract-G6fQNIi2.mjs";import"./openclaw-state-db-async-lifecycle-BLEEXDiM.mjs";import{a as setSqliteBusyTimeout}from"./sqlite-busy-timeout-DrKhgmlA.mjs";import{a as resolveSqliteDatabaseFilePaths}from"./sqlite-files-B0i-1anU.mjs";import{a as runSqliteImmediateTransactionSync}from"./sqlite-transaction-mUAqxIBY.mjs";import{d as sqliteIntegrityCheckSteps,i as assertSqliteIntegrity,u as runSqliteIntegrityOperationSync}from"./sqlite-integrity-BphT0_i3.mjs";import{n as configureSqlitePreSchemaPragmas}from"./sqlite-wal-D5aTyNQo.mjs";import{t as assertSqliteSchemaContains}from"./sqlite-schema-contract-DWWs0_IS.mjs";import{f as resolveSchemaMigrationIntegrityTables}from"./openclaw-state-db-maintenance-C4Lyjx3H.mjs";import"./openclaw-agent-db-contract-Cunt8iGM.mjs";import{J as verifyAndRepairCanonicalSqliteIndexSteps,_ as resolveSchemaMigrationIntegrityCheck,l as runOpenClawStateWriteTransaction,q as repairCanonicalSqliteIndexes}from"./openclaw-state-db-C9cEGLQ4.mjs";import{r as migrateSqliteSchemaToStrictInTransaction}from"./sqlite-strict-sjVHUlvM.mjs";import{s as registerOpenClawAgentDatabaseIdentity}from"./openclaw-agent-db-identity-9VNXBhLc.mjs";import{D as AGENT_COLD_ARCHIVE_CHUNKS_SQL,a as AGENT_TOOL_USAGE_SQL,h as AGENT_INDEX_RETIREMENT_SQL,i as withoutTrajectoryPayloadColumns,j as AGENT_ACTIVE_EVENT_FACTS_SQL,n as migrateAgentTrajectoryStorageInTransaction,u as AGENT_MEMORY_REVISION_SQL,v as AGENT_CREATION_OPERATIONS_SQL,w as migrateAgentColdNavigationInTransaction}from"./openclaw-agent-trajectory-storage-migration-BxFaVsT7.mjs";import{n as agentDatabaseMaintenanceAuthority,r as assertAgentDatabaseMaintenanceAuthority}from"./openclaw-agent-db-maintenance-authority-O9i0lwjG.mjs";import{r as readExistingAgentSchemaMeta}from"./openclaw-agent-db-metadata-62omBN3S.mjs";import{a as hasAgentDatabaseApplicationSchema,i as assertSupportedAgentSchemaVersion,r as assertExistingAgentSchemaOwner}from"./openclaw-agent-db-schema-read-CK93P2XH.mjs";import{n as migrateAgentWriteLayoutInTransaction}from"./openclaw-agent-write-layout-migration-0f2CsAAp.mjs";import{d as prepareAgentDeletionPathFence,h as assertAgentDeletionRecoveryAllowsMutation,n as assertAgentDeletionPathFence}from"./agent-deletion-journal-DNYQA80U.mjs";import{c as invalidateOpenClawAgentDatabaseIntegrityBeforeMutation,h as renewAgentDatabaseMaintenanceAuthorityIfPresent,r as assertAgentDatabaseMaintenanceAuthorityIfPresent}from"./openclaw-agent-db-lease-BLDGfRR2.mjs";import{n as migrateMemoryIndexSourcesIdentity,u as migrateMemoryIndexStorage}from"./memory-schema-CxKZYQTC.mjs";import{s as interruptHistoricalPendingInputs}from"./openclaw-agent-db-schema-compatibility-DAaxyvWD.mjs";import{C as withoutSessionEntrySnapshotsSchema,S as sessionEntrySnapshotsSchemaSql,_ as getOpenClawAgentMigrationSchema,b as withLegacyAgentStorageSchema,g as canonicalSessionValidationSchemaSql,x as DEPLOYED_FTS_ROWS_SCHEMA}from"./openclaw-agent-progress-card-schema-BkcfBjRI.mjs";import{C as adoptCanonicalSessionValidationSchema,w as assertCanonicalSessionValidationSchema,y as setOpenClawAgentDatabaseValidation}from"./openclaw-agent-db-validation-cache-5Di28JcD.mjs";import{a as parseSqliteSessionEntryRecord}from"./session-entry-json-78qqTrc5.mjs";import{A as ensureOpenClawAgentBoardSchemaInTransaction,C as migrateSessionTranscriptGenerations,D as ensureLegacySessionEntryValidityTriggers,E as persistAgentSchemaMetadata,O as migrateCanonicalSessionWriterValidation,S as migrateSessionTranscriptActiveProjection,_ as backfillSessionConversations,a as ensureSessionReactionsSchemaInTransaction,b as migrateConversationDeliveryTargetColumn,c as hasPendingMemoryChunkMetadataMigration,f as repairAndAssertOpenClawAgentV14SchemaForMigration,g as assertSupportedAgentMigrationSchemas,i as ensureSessionKeyContractSchemaInTransaction,k as seedCanonicalSessionValidationPending,l as migrateMemoryChunkMetadataSchema,m as migrateSessionParticipantsSchema,n as assertOpenClawAgentCurrentRuntimeSchema,o as finishAgentSchemaMigration,p as repairAndAssertOpenClawAgentV16Validity,r as assertOpenClawAgentSchemaContains,s as hasPendingCurrentVersionAgentDatabaseMigration,t as assertAgentSchemaVersion,u as migrateRetiredAgentStateLeaseSchema,v as ensureSessionAdditiveColumns,w as readSqliteTableColumns,x as migrateSessionCreatorNamespaces,y as ensureSessionEntryValidityProjection}from"./openclaw-agent-db-schema-helpers-BBqlSz75.mjs";import{t as registerOpenClawAgentDatabase}from"./openclaw-agent-db-registry-BQVKmO0t.mjs";import{t as admitAgentDatabaseRuntimeStructure}from"./agent-database-startup-integrity-BylszsEi.mjs";import{t as migrateSessionNodesAndWindows}from"./openclaw-agent-db-session-nodes-migration-CZU_l6eD.mjs";import{t as migrateAgentJsonPredicatesInTransaction}from"./openclaw-agent-json-predicate-schema-BsBriDSn.mjs";import{t as migrateOutboxEnqueueSequenceInTransaction}from"./openclaw-agent-outbox-sequence-migration-gdS4zfLw.mjs";import{i as splitSessionEntrySnapshots}from"./session-entry-snapshots-CCEpWtmT.mjs";import{t as resolveZstdCodec}from"./zstd-codec-DUOHW191.mjs";import{o as encodeUsageCostRollup,t as USAGE_COST_ROLLUP_SCOPE}from"./session-cost-usage-rollup-codec-DtgB7cQJ.mjs";import{s as prepareTranscriptPayload}from"./transcript-payload-DPiEv7H6.mjs";import{t as MAX_COMPRESSED_EVENT_BYTES}from"./transcript-payload-read-viRRgj17.mjs";import{chmodSync,existsSync,mkdirSync,statSync}from"node:fs";import path from"node:path";
//!src/state/openclaw-agent-db-permissions.ts
const OPENCLAW_AGENT_DB_DIR_MODE=448;const OPENCLAW_AGENT_DB_FILE_MODE=384;function ensureMode(e,t){if(process.platform===`win32`||(statSync(e).mode&4095)!==t)chmodSync(e,t)}function ensureOpenClawAgentDatabasePermissions(e,t){const n=path.dirname(e);const r=resolveOpenClawAgentSqlitePath({agentId:t.agentId,env:t.env});const i=path.resolve(e)===path.resolve(r);const a=existsSync(n);mkdirSync(n,{recursive:true,mode:OPENCLAW_AGENT_DB_DIR_MODE});if(i||!a)ensureMode(n,OPENCLAW_AGENT_DB_DIR_MODE);for(const t of resolveSqliteDatabaseFilePaths(e))try{ensureMode(t,OPENCLAW_AGENT_DB_FILE_MODE)}catch(e){if(e.code!==`ENOENT`)throw e}}
//!src/state/openclaw-agent-db-session-provenance.ts
function backfillTranscriptMutationWatermarks(e){if(!tableExists(e,`transcript_events`))return;e.exec(`
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
  `)}
//!src/state/openclaw-agent-db-legacy-schema.ts
function migrateOpenClawAgentSchema(e){if(readSqliteUserVersion(e)>=42)return;const t=readSqliteTableColumns(e,`sessions`);if(!t)return;for(const[n,r]of Object.entries({transcript_updated_at:`INTEGER DEFAULT NULL`,transcript_observed_at:`INTEGER DEFAULT NULL`,session_entry_provenance:`INTEGER NOT NULL DEFAULT 0 CHECK (session_entry_provenance IN (0, 1))`,acp_owned:`INTEGER NOT NULL DEFAULT 0 CHECK (acp_owned IN (0, 1))`,plugin_owner_id:`TEXT`,hook_external_content_source:`TEXT CHECK (hook_external_content_source IS NULL OR hook_external_content_source IN ('gmail', 'webhook'))`}))if(!t.has(n))e.exec(`ALTER TABLE sessions ADD COLUMN ${n} ${r};`);backfillTranscriptMutationWatermarks(e)}
//!src/state/openclaw-agent-db-schema-admission.ts
function admitOpenClawAgentDatabaseSchema(e,t){if(e.location()&&readSqliteDatabaseIntegrityVerification(e)&&(isSqliteSchemaAdmissionCold(e)||getAdmittedSqliteSchemaFacts(e))){admitSqliteSchema(e);assertCanonicalSessionValidationSchema(e);registerOpenClawAgentDatabaseIdentity(e);setOpenClawAgentDatabaseValidation({db:e,...t});return e}}
//!src/state/openclaw-agent-session-snapshots-migration.ts
function migrateSessionEntrySnapshotsInTransaction(e){e.exec(`ALTER TABLE session_nodes ADD COLUMN snapshot_revision INTEGER NOT NULL DEFAULT 0`);e.exec(sessionEntrySnapshotsSchemaSql(OPENCLAW_AGENT_SCHEMA_SQL));const t=getNodeSqliteKysely(e);const n=t.selectFrom(`session_nodes`).select([`session_key`,`current_session_id`,`updated_at`,`entry_json`]).orderBy(`session_key`).limit(64);const r=prepareSqliteQuerySync(e,e=>n.where(`session_key`,`>`,e(e=>e)));const i=prepareSqliteQuerySync(e,e=>t.insertInto(`session_entry_snapshots`).values({session_key:e(e=>e.sessionKey),field:e(e=>e.field),value_json:e(e=>e.valueJson)}));const a=prepareSqliteQuerySync(e,e=>t.updateTable(`session_nodes`).set({entry_json:e(e=>e.entryJson)}).where(`session_key`,`=`,e(e=>e.sessionKey)));const o=prepareSqliteQuerySync(e,e=>t.updateTable(`session_nodes`).set({entry_valid:1}).where(`session_key`,`=`,e(e=>e)));let s;while(true){const{rows:t}=s===void 0?executeSqliteQuerySync(e,n):r(s);if(t.length===0)return;renewAgentDatabaseMaintenanceAuthorityIfPresent();for(const e of t){if(typeof e.session_key!==`string`||typeof e.current_session_id!==`string`||typeof e.updated_at!==`number`||typeof e.entry_json!==`string`)throw new Error(`Unreadable session row during snapshot migration`);s=e.session_key;const t=parseSqliteSessionEntryRecord({current_session_id:e.current_session_id,updated_at:e.updated_at,entry_json:e.entry_json});if(!t)continue;const{entryJson:n,snapshots:r}=splitSessionEntrySnapshots(t);if(r.length===0)continue;for(const t of r)i({sessionKey:e.session_key,...t});a({entryJson:n,sessionKey:e.session_key});o(e.session_key)}}}
//!src/infra/session-cost-usage-cache-migration.ts
const PREVIOUS_SCOPE=`session-cost-usage-rollup-v2`;function decodePreviousRollup(e){const t=safeParseJsonRecord(e??``);if(!t||t.version!==6||typeof t.pricingFingerprint!==`string`||!isRecord(t.checkpoint)||t.checkpoint.kind!==`jsonl`&&t.checkpoint.kind!==`sqlite`||typeof t.scannedAt!==`number`||typeof t.parsedRecords!==`number`||typeof t.countedRecords!==`number`||!isRecord(t.rollup)||!isRecord(t.rollup.buckets)||!isRecord(t.rollup.untimestamped))return;return t}function migrateSessionCostUsageRollupStorage(e,t){const n=getNodeSqliteKysely(e);let r;for(;;){t?.();let i=n.selectFrom(`cache_entries`).select([`key`,`value_json`,`updated_at`]).where(`scope`,`=`,PREVIOUS_SCOPE).orderBy(`key`,`asc`).limit(1);if(r!==void 0)i=i.where(`key`,`>`,r);const a=executeSqliteQuerySync(e,i).rows[0];if(!a)break;r=a.key;const o=decodePreviousRollup(a.value_json);if(o){const t=encodeUsageCostRollup(o);executeSqliteQuerySync(e,n.insertInto(`cache_entries`).values({scope:USAGE_COST_ROLLUP_SCOPE,key:a.key,value_json:t.valueJson,blob:t.blob,updated_at:a.updated_at,expires_at:null}).onConflict(e=>e.columns([`scope`,`key`]).doNothing()))}executeSqliteQuerySync(e,n.deleteFrom(`cache_entries`).where(`scope`,`=`,PREVIOUS_SCOPE).where(`key`,`=`,a.key))}}
//!src/state/openclaw-agent-transcript-fts-schema.ts
const RETIRED_FTS_ROWS=`session_transcript_fts_rows_legacy22`;function migrateDeployedTranscriptFtsRowsInTransaction(e,t){if(!e.isTransaction||e.prepare(`PRAGMA foreign_keys`).get()?.foreign_keys!==0)throw new Error(`Transcript FTS migration requires an admitted transaction with foreign keys off`);assertSqliteSchemaContains(e,`deployed transcript FTS ownership`,DEPLOYED_FTS_ROWS_SCHEMA);const n=e.prepare(`PRAGMA table_xinfo(session_transcript_fts_rows)`).all();if(n.length!==2||n.some(e=>e.name!==`session_id`&&e.name!==`fts_rowid`))throw new Error(`Transcript FTS migration cannot discard unknown row-map columns`);const r=e.prepare(`SELECT name FROM sqlite_schema
    WHERE (tbl_name = 'session_transcript_fts_rows' AND sql IS NOT NULL
      AND type IN ('index', 'trigger') AND name != 'idx_agent_transcript_fts_rows_session')
      OR (type IN ('view', 'trigger') AND sql LIKE '%session_transcript_fts_rows%')`).all();const i=e.prepare(`SELECT schema.name FROM sqlite_schema AS schema
    JOIN pragma_foreign_key_list(schema.name) AS fk
    WHERE schema.type = 'table' AND fk."table" = 'session_transcript_fts_rows'`).all();if(r.length||i.length)throw new Error(`Transcript FTS migration cannot discard unknown row-map dependencies`);if(e.prepare(`SELECT 1 FROM sqlite_schema WHERE name = ?`).get(RETIRED_FTS_ROWS))throw new Error(`Transcript FTS migration table already exists`);e.exec(`ALTER TABLE session_transcript_fts_rows RENAME TO ${RETIRED_FTS_ROWS}`);e.exec(extractSqliteTableSchema(t,`session_transcript_fts_rows`,{endMarker:`INSERT OR IGNORE INTO memory_index_state`,includeEndMarker:false}));e.exec(`INSERT INTO session_transcript_fts_rows (id, session_id, message_id)
    SELECT rowid, session_id, message_id FROM session_transcript_fts`);e.exec(`UPDATE session_transcript_index_state AS state SET needs_rebuild = 1
    WHERE needs_rebuild = 0 AND (
      fts_row_count IS NULL
      OR fts_row_count != (SELECT count(*) FROM ${RETIRED_FTS_ROWS} AS old WHERE old.session_id = state.session_id)
      OR EXISTS (
        SELECT 1 FROM ${RETIRED_FTS_ROWS} AS old
        WHERE old.session_id = state.session_id AND NOT EXISTS (
          SELECT 1 FROM session_transcript_fts_rows AS current
          WHERE current.id = old.fts_rowid AND current.session_id = old.session_id))
      OR EXISTS (
        SELECT 1 FROM session_transcript_fts_rows AS current
        WHERE current.session_id = state.session_id AND NOT EXISTS (
          SELECT 1 FROM ${RETIRED_FTS_ROWS} AS old
          WHERE old.fts_rowid = current.id AND old.session_id = current.session_id))
    );
    DROP TABLE ${RETIRED_FTS_ROWS};
    ALTER TABLE session_transcript_index_state DROP COLUMN fts_row_count;`)}
//!src/state/openclaw-agent-transcript-payload-migration.ts
const MIGRATION_TABLE=`transcript_events_payload_migration`;const KNOWN_CHILDREN=/* @__PURE__ */ new Set([`transcript_event_identities`,`session_transcript_active_events`]);function assertTranscriptRebuildInputs(e){assertSqliteSchemaContains(e,`transcript payload migration`,extractSqliteTableSchema(withLegacyAgentStorageSchema(OPENCLAW_AGENT_SCHEMA_SQL),`transcript_events`));const t=e.prepare(`PRAGMA table_xinfo(transcript_events)`).all();const n=/* @__PURE__ */ new Set([`session_id`,`seq`,`event_json`,`created_at`]);if(t.length!==n.size||t.some(e=>typeof e.name!==`string`||!n.has(e.name)))throw new Error(`Transcript payload migration cannot discard unknown columns`);if(e.prepare(`SELECT name FROM sqlite_schema
      WHERE (type IN ('trigger', 'index') AND tbl_name = 'transcript_events' AND sql IS NOT NULL)
         OR (type IN ('view', 'trigger') AND sql LIKE '%transcript_events%')`).all().length>0)throw new Error(`Transcript payload migration cannot rebuild unknown indexes, views, or triggers`);if(e.prepare(`SELECT 1 FROM sqlite_schema WHERE name = ?`).get(MIGRATION_TABLE))throw new Error(`Transcript payload migration table already exists`);for(const t of e.prepare(`SELECT name FROM sqlite_schema WHERE type = 'table'`).all()){if(typeof t.name!==`string`)throw new Error(`Invalid table name during transcript payload migration`);if(KNOWN_CHILDREN.has(t.name))continue;if(e.prepare(`PRAGMA foreign_key_list(${quoteSqliteIdentifier(t.name)})`).all().some(e=>e.table===`transcript_events`))throw new Error(`Transcript payload migration cannot rebuild an unknown foreign-key target`)}}function migrateTranscriptPayloadStorageInTransaction(e,t){if(!e.isTransaction||e.prepare(`PRAGMA foreign_keys`).get()?.foreign_keys!==0)throw new Error(`Transcript payload migration requires an admitted transaction with foreign keys off`);assertTranscriptRebuildInputs(e);const n=readSqliteTextEncoding(e)===`UTF-8`;const r=new TextDecoder(`utf-8`,{fatal:true,ignoreBOM:true});const i=resolveZstdCodec();e.exec(extractSqliteTableSchema(t,`transcript_events`).replace(`IF NOT EXISTS transcript_events`,MIGRATION_TABLE));const a=e.prepare(`
    INSERT INTO ${MIGRATION_TABLE}
      (rowid, session_id, seq, event_json, created_at, event_zstd, event_utf8_bytes, navigation_json)
    SELECT rowid, session_id, seq, event_json, created_at, NULL,
           CASE WHEN ? THEN octet_length(event_json) ELSE NULL END, ?
    FROM transcript_events WHERE rowid = ?`);const o=e.prepare(`
    INSERT INTO ${MIGRATION_TABLE}
      (rowid, session_id, seq, event_json, created_at, event_zstd, event_utf8_bytes, navigation_json)
    SELECT rowid, session_id, seq, NULL, created_at, ?, ?, ?
    FROM transcript_events WHERE rowid = ?`);a.setReadBigInts(true);o.setReadBigInts(true);const s=e.prepare(`SELECT CAST(event_json AS BLOB) AS bytes FROM transcript_events WHERE rowid = ?`);const c=e.prepare(`SELECT rowid AS storage_rowid, octet_length(event_json) AS bytes FROM transcript_events ORDER BY rowid`);c.setReadBigInts(true);let l=performance.now();for(const t of c.iterate()){if(performance.now()-l>=1e3){renewAgentDatabaseMaintenanceAuthorityIfPresent();l=performance.now()}if(typeof t.storage_rowid!==`bigint`||typeof t.bytes!==`bigint`)throw new Error(`Invalid transcript storage identity during migration`);let c=null;let u=false;if(n&&t.bytes<=BigInt(4194304)){const n=s.get(t.storage_rowid)?.bytes;if(!(n instanceof Uint8Array))throw new Error(`Transcript payload disappeared during migration`);let a;try{a=r.decode(n)}catch{}if(a!==void 0){const r=prepareTranscriptPayload(e,a,void 0,`UTF-8`);c=r.navigation_json;if(r.event_zstd!==null){if(r.event_utf8_bytes===null||!i.decompress(r.event_zstd,r.event_utf8_bytes).equals(n))throw new Error(`Transcript compression did not preserve canonical bytes`);const e=o.run(r.event_zstd,r.event_utf8_bytes,c,t.storage_rowid);if(Number(e.changes)!==1)throw new Error(`Transcript payload disappeared before migration publication`);u=true}}}if(!u&&Number(a.run(n?1:0,c,t.storage_rowid).changes)!==1)throw new Error(`Transcript identity payload disappeared before migration publication`)}renewAgentDatabaseMaintenanceAuthorityIfPresent();e.exec(`DROP TABLE transcript_events;
    ALTER TABLE ${MIGRATION_TABLE} RENAME TO transcript_events;`)}
//!src/state/openclaw-agent-storage-migration.ts
function migrateAgentStorageInTransaction(e,t,n,r){renewAgentDatabaseMaintenanceAuthorityIfPresent();migrateMemoryIndexStorage(e,{renewAuthority:renewAgentDatabaseMaintenanceAuthorityIfPresent,onWarning:e=>r.push(e)});renewAgentDatabaseMaintenanceAuthorityIfPresent();if(n===22)migrateDeployedTranscriptFtsRowsInTransaction(e,t);else if(e.prepare(`SELECT 1 FROM sqlite_schema WHERE name = ?`).get(`session_transcript_fts_rows`))throw new Error(`Transcript FTS row map already exists before the schema-23 storage migration.`);renewAgentDatabaseMaintenanceAuthorityIfPresent();migrateTranscriptPayloadStorageInTransaction(e,t);renewAgentDatabaseMaintenanceAuthorityIfPresent();migrateSessionCostUsageRollupStorage(e,renewAgentDatabaseMaintenanceAuthorityIfPresent);renewAgentDatabaseMaintenanceAuthorityIfPresent();e.exec(t);if(n!==22)e.exec(`
    INSERT INTO session_transcript_fts_rows (id, session_id, message_id)
    SELECT rowid, session_id, message_id FROM session_transcript_fts;
  `)}
//!src/state/openclaw-agent-db-schema.ts
const agentDbLog=createSubsystemLogger(`state/agent-db`);function*agentDatabaseIntegrityBeforeMutationSteps(e,t,n,{runtimeAdmission:r=false,diagnostics:i,verification:a,reuseRuntimeIntegrity:o=false,admittedSchema:s=false,integrityCheck:c,integrityTables:l}={}){const u=r&&o;if(u&&s){if(i)i.integrityGateOutcome=`cached`;return false}setSqliteBusyTimeout(e,OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);const d=getAdmittedSqliteSchemaFacts(e)?.userVersion??readSqliteUserVersion(e);const f=d===0&&hasAgentDatabaseApplicationSchema(e);const p=d===0&&f||d>0&&d<42;if(p)agentDbLog.info(`agent database schema migration pending; verifying integrity first`,{fromVersion:d,path:n,toVersion:42});const m=d===42&&hasPendingCurrentVersionAgentDatabaseMigration(e);const h=resolveSchemaMigrationIntegrityCheck({kind:`agent`,foundVersion:d,supportedVersion:42},c);const g=performance.now();if(d===42&&!m){const o=r&&!a&&!u&&c!==`full`?admitAgentDatabaseRuntimeStructure(e,n,t,i):void 0;const s=u||a!==void 0&&!p&&!m;const validateSchema=r=>assertOpenClawAgentCurrentRuntimeSchema(e,{agentId:t,pathname:n},r);const d=o??(yield*verifyAndRepairCanonicalSqliteIndexSteps(e,n,`-- Session storage doctrine: session_nodes.entry_json owns hot logical-session facts;
-- session_entry_snapshots owns keyed cold values. Promoted node columns are query
-- indexes; session_windows and their children own transcript generations.
-- Legacy ACP provenance is private import evidence carried with its logical session.

CREATE TABLE IF NOT EXISTS schema_meta (
  meta_key TEXT NOT NULL PRIMARY KEY,
  role TEXT NOT NULL,
  schema_version INTEGER NOT NULL,
  agent_id TEXT,
  app_version TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS session_nodes (
  session_key TEXT NOT NULL PRIMARY KEY,
  current_session_id TEXT NOT NULL,
  entry_json TEXT NOT NULL,
  session_started_at INTEGER,
  has_optional_references INTEGER NOT NULL DEFAULT 0,
  snapshot_revision INTEGER NOT NULL DEFAULT 0,
  legacy_acp_migration_json TEXT,
  entry_valid INTEGER NOT NULL DEFAULT 0 CHECK (entry_valid IN (-1, 0, 1)),
  updated_at INTEGER NOT NULL,
  status TEXT CHECK (status IS NULL OR status IN ('running', 'done', 'failed', 'killed', 'timeout')),
  created_at INTEGER,
  created_via TEXT CHECK (created_via IS NULL OR created_via IN ('operator', 'spawn', 'channel', 'cron', 'talk', 'run', 'plugin', 'internal')),
  created_actor_type TEXT CHECK (created_actor_type IS NULL OR created_actor_type IN ('human', 'agent', 'system')),
  created_actor_id TEXT,
  owner_actor_type TEXT,
  owner_actor_id TEXT,
  owner_assigned_by_type TEXT,
  owner_assigned_by_id TEXT,
  owner_assigned_at INTEGER,
  project_id TEXT,
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

CREATE TABLE IF NOT EXISTS session_entry_snapshots (
  session_key TEXT NOT NULL,
  field TEXT NOT NULL CHECK (field IN ('sessionDiffBaseline', 'skillsSnapshot', 'systemPromptReport')),
  value_json TEXT NOT NULL,
  PRIMARY KEY (session_key, field),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
) STRICT, WITHOUT ROWID;

CREATE TRIGGER IF NOT EXISTS session_entry_snapshots_after_insert
AFTER INSERT ON session_entry_snapshots
BEGIN
  UPDATE session_nodes SET snapshot_revision = snapshot_revision + 1
  WHERE session_key = NEW.session_key;
END;

CREATE TRIGGER IF NOT EXISTS session_entry_snapshots_after_update
AFTER UPDATE OF session_key, field, value_json ON session_entry_snapshots
WHEN NEW.session_key IS NOT OLD.session_key
  OR NEW.field IS NOT OLD.field OR NEW.value_json IS NOT OLD.value_json
BEGIN
  UPDATE session_nodes SET snapshot_revision = snapshot_revision + 1
  WHERE session_key IN (OLD.session_key, NEW.session_key);
END;

CREATE TRIGGER IF NOT EXISTS session_entry_snapshots_after_delete
AFTER DELETE ON session_entry_snapshots
BEGIN
  UPDATE session_nodes SET snapshot_revision = snapshot_revision + 1
  WHERE session_key = OLD.session_key;
END;

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_updated_at
  ON session_nodes(updated_at DESC, session_key);

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_label
  ON session_nodes(label, session_key)
  WHERE label IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_parent_session_key
  ON session_nodes(parent_session_key, session_key);

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_spawned_by
  ON session_nodes(spawned_by, session_key);

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_status
  ON session_nodes(status, session_key)
  WHERE status IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_archived_at
  ON session_nodes(archived_at, session_key)
  WHERE archived_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_active
  ON session_nodes(session_key)
  WHERE archived_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_current_session_id
  ON session_nodes(current_session_id);

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_entry_valid_pending
  ON session_nodes(session_key)
  WHERE entry_valid = 0;

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_entry_not_valid
  ON session_nodes(session_key)
  WHERE entry_valid != 1;

CREATE TABLE IF NOT EXISTS session_participants (
  session_key TEXT NOT NULL,
  identity_namespace TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  contribution_count INTEGER NOT NULL,
  first_prompted_at INTEGER,
  last_prompted_at INTEGER,
  PRIMARY KEY (session_key, identity_namespace, actor_id),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS session_key_contract (
  id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),
  main_key TEXT NOT NULL,
  canonical_ready TEXT,
  updated_at INTEGER NOT NULL
) STRICT;

INSERT OR IGNORE INTO session_key_contract (id, main_key, updated_at) VALUES (1, 'main', 0);

CREATE TABLE IF NOT EXISTS session_windows (
  session_id TEXT NOT NULL PRIMARY KEY,
  session_key TEXT NOT NULL,
  previous_session_id TEXT,
  reason TEXT CHECK (reason IS NULL OR reason IN ('initial', 'reset', 'rollover', 'fork', 'rewind', 'switch', 'recovery', 'compaction')),
  session_scope TEXT NOT NULL DEFAULT 'conversation' CHECK (session_scope IN ('conversation', 'shared-main', 'group', 'channel')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  transcript_updated_at INTEGER DEFAULT NULL,
  row_transcript_json TEXT,
  row_transcript_updated_at INTEGER,
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

CREATE INDEX IF NOT EXISTS idx_agent_session_windows_updated_at
  ON session_windows(updated_at DESC, session_id);

CREATE INDEX IF NOT EXISTS idx_agent_session_windows_session_key
  ON session_windows(session_key, updated_at DESC, session_id);

CREATE INDEX IF NOT EXISTS idx_agent_session_windows_created_at
  ON session_windows(created_at DESC, session_id);

CREATE INDEX IF NOT EXISTS idx_agent_session_windows_conversation
  ON session_windows(primary_conversation_id)
  WHERE primary_conversation_id IS NOT NULL;

-- Offline imports and repairs queue explicit work; admission also settles keys
-- removed during repair, so the queue deliberately has no node foreign key.
CREATE TABLE IF NOT EXISTS session_canonical_validation_pending (
  session_key TEXT NOT NULL PRIMARY KEY
) STRICT;

CREATE TABLE IF NOT EXISTS conversations (
  conversation_id TEXT NOT NULL PRIMARY KEY,
  channel TEXT NOT NULL,
  account_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('direct', 'group', 'channel')),
  peer_id TEXT NOT NULL,
  delivery_target TEXT NOT NULL,
  parent_conversation_id TEXT,
  thread_id TEXT,
  native_channel_id TEXT,
  native_direct_user_id TEXT,
  label TEXT,
  metadata_json TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_conversations_lookup
  ON conversations(channel, account_id, kind, peer_id, thread_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_agent_conversations_identity
  ON conversations(
    channel,
    account_id,
    kind,
    peer_id,
    IFNULL(parent_conversation_id, ''),
    IFNULL(thread_id, '')
  );

CREATE INDEX IF NOT EXISTS idx_agent_conversations_updated
  ON conversations(updated_at DESC, conversation_id);

CREATE TABLE IF NOT EXISTS conversation_deliveries (
  operation_id TEXT NOT NULL PRIMARY KEY,
  operation_kind TEXT NOT NULL CHECK (operation_kind IN ('send', 'turn')),
  conversation_id TEXT NOT NULL,
  source_session_key TEXT,
  message_hash TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('created', 'queued', 'sent', 'suppressed', 'rejected', 'unknown', 'replied')),
  prepared_message_id TEXT,
  platform_message_id TEXT,
  queue_id TEXT,
  rejection_error TEXT,
  reply_message_id TEXT,
  reply_to_id TEXT,
  reply_thread_id TEXT,
  reply_text TEXT,
  reply_timestamp INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  CHECK (
    (status = 'rejected' AND rejection_error IS NOT NULL) OR
    (status != 'rejected' AND rejection_error IS NULL)
  ),
  FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_conversation_deliveries_reply
  ON conversation_deliveries(conversation_id, platform_message_id, prepared_message_id)
  WHERE status IN ('queued', 'sent', 'replied');

CREATE INDEX IF NOT EXISTS idx_agent_conversation_deliveries_updated
  ON conversation_deliveries(updated_at DESC, operation_id);

CREATE INDEX IF NOT EXISTS idx_agent_conversation_deliveries_source_session
  ON conversation_deliveries(source_session_key, operation_id);

CREATE TABLE IF NOT EXISTS session_conversations (
  session_id TEXT NOT NULL,
  conversation_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'primary' CHECK (role IN ('primary', 'participant', 'related')),
  route_context_json TEXT,
  first_seen_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL,
  PRIMARY KEY (session_id, conversation_id, role),
  FOREIGN KEY (session_id) REFERENCES "session_windows"(session_id) ON DELETE CASCADE,
  FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE
) STRICT;

-- Older same-version writers preserve the envelope while updating the association.
CREATE TRIGGER IF NOT EXISTS session_conversations_route_context_invalidate_after_update
AFTER UPDATE OF role, last_seen_at ON session_conversations
WHEN NEW.route_context_json IS OLD.route_context_json
BEGIN
  UPDATE session_conversations
  SET route_context_json = NULL
  WHERE session_id = NEW.session_id
    AND conversation_id = NEW.conversation_id
    AND role = NEW.role;
END;

CREATE INDEX IF NOT EXISTS idx_agent_session_conversations_conversation
  ON session_conversations(conversation_id, last_seen_at DESC, session_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_agent_session_conversations_primary
  ON session_conversations(session_id)
  WHERE role = 'primary';

CREATE TABLE IF NOT EXISTS session_members (
  session_key TEXT NOT NULL,
  identity_id TEXT NOT NULL,
  added_by TEXT NOT NULL,
  added_at INTEGER NOT NULL,
  PRIMARY KEY (session_key, identity_id),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_session_members_identity
  ON session_members(identity_id, session_key);

CREATE TABLE IF NOT EXISTS session_suggestions (
  id TEXT PRIMARY KEY,
  session_key TEXT NOT NULL,
  author_id TEXT NOT NULL,
  author_label TEXT,
  text TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('pending', 'accepted', 'dismissed')),
  dispatch_token TEXT,
  dispatch_started_at INTEGER,
  dispatch_resolution TEXT CHECK (dispatch_resolution IN ('send', 'queue', 'edit', 'dismiss')),
  CHECK (
    (dispatch_token IS NULL AND dispatch_started_at IS NULL AND dispatch_resolution IS NULL)
    OR (dispatch_token IS NOT NULL AND dispatch_started_at IS NOT NULL AND dispatch_resolution IS NOT NULL)
  ),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_session_suggestions_session_state_created
  ON session_suggestions(session_key, state, created_at, id);

CREATE INDEX IF NOT EXISTS idx_agent_session_suggestions_author_created
  ON session_suggestions(author_id, created_at, id);

CREATE TABLE IF NOT EXISTS session_reactions (
  session_key TEXT NOT NULL,
  session_id TEXT NOT NULL,
  message_id TEXT NOT NULL,
  emoji TEXT NOT NULL,
  identity_id TEXT NOT NULL,
  identity_label TEXT,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (session_key, session_id, message_id, emoji, identity_id),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS board_tabs (
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

CREATE TABLE IF NOT EXISTS board_widgets (
  session_key TEXT NOT NULL,
  name TEXT NOT NULL,
  tab_id TEXT NOT NULL,
  title TEXT,
  content_kind TEXT NOT NULL CHECK (content_kind IN ('html', 'mcp-app', 'plugin')),
  html BLOB,
  descriptor_json TEXT,
  sha256 TEXT NOT NULL,
  view_generation TEXT,
  revision INTEGER NOT NULL CHECK (revision >= 1),
  size_w INTEGER NOT NULL CHECK (size_w BETWEEN 1 AND 12),
  size_h INTEGER NOT NULL CHECK (size_h BETWEEN 1 AND 20),
  position INTEGER NOT NULL CHECK (position >= 0),
  manifest TEXT NOT NULL DEFAULT '{}',
  grant_state TEXT NOT NULL DEFAULT 'none' CHECK (grant_state IN ('none', 'pending', 'granted', 'rejected')),
  granted_sha TEXT,
  created_by TEXT NOT NULL CHECK (created_by IN ('user', 'agent')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (session_key, name),
  FOREIGN KEY (session_key, tab_id) REFERENCES board_tabs(session_key, tab_id) ON DELETE CASCADE,
  CHECK (
    (content_kind = 'html' AND html IS NOT NULL AND descriptor_json IS NULL AND view_generation IS NOT NULL) OR
    (content_kind = 'mcp-app' AND html IS NULL AND descriptor_json IS NOT NULL AND view_generation IS NULL) OR
    (content_kind = 'plugin' AND html IS NULL AND descriptor_json IS NOT NULL AND view_generation IS NULL)
  )
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_board_widgets_tab_position
  ON board_widgets(session_key, tab_id, position);

CREATE TABLE IF NOT EXISTS session_progress_cards (
  session_key TEXT NOT NULL PRIMARY KEY,
  markdown TEXT,
  steps_json TEXT,
  revision INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS heartbeat_outcomes (
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

CREATE TABLE IF NOT EXISTS message_tool_run_outcomes (
  id INTEGER PRIMARY KEY,
  run_id TEXT NOT NULL,
  session_key TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('tool_delivered', 'mute')),
  run_status TEXT NOT NULL CHECK (run_status IN ('completed', 'errored', 'aborted')),
  occurred_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_message_tool_run_outcomes_occurred
  ON message_tool_run_outcomes(occurred_at DESC, id DESC);

-- Receipts outlive Goal clear and session reset so a delayed retry cannot recreate a Goal.
-- They intentionally have no session FK; bounded retention belongs to the operation owner.
CREATE TABLE IF NOT EXISTS session_creation_operations (
  operation_digest TEXT PRIMARY KEY,
  request_fingerprint TEXT NOT NULL,
  session_key TEXT NOT NULL,
  session_id TEXT NOT NULL,
  lifecycle_revision TEXT,
  role TEXT,
  scopes_json TEXT NOT NULL,
  expires_at INTEGER NOT NULL
) STRICT;
CREATE INDEX IF NOT EXISTS idx_agent_session_creation_operations_expiry
  ON session_creation_operations(expires_at);
-- END SESSION CREATION OPERATIONS

CREATE TABLE IF NOT EXISTS session_goal_operations (
  session_key TEXT NOT NULL,
  operation_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  request_fingerprint TEXT NOT NULL,
  result_json TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  PRIMARY KEY (session_key, operation_id)
) STRICT;
CREATE INDEX IF NOT EXISTS idx_agent_session_goal_operations_expiry
  ON session_goal_operations(expires_at);

CREATE TABLE IF NOT EXISTS transcript_events (
  session_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  event_json TEXT,
  created_at INTEGER NOT NULL,
  event_zstd BLOB,
  event_utf8_bytes INTEGER CHECK (event_utf8_bytes IS NULL OR event_utf8_bytes >= 0),
  navigation_json TEXT,
  navigation_type TEXT,
  navigation_custom_type TEXT,
  navigation_display INTEGER NOT NULL DEFAULT 0,
  message_role TEXT,
  navigation_last_type TEXT,
  navigation_last_custom_type TEXT,
  navigation_valid INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (session_id, seq),
  FOREIGN KEY (session_id) REFERENCES "session_windows"(session_id) ON DELETE CASCADE,
  CHECK (
    (event_json IS NOT NULL AND event_zstd IS NULL)
    OR (
      event_json IS NULL AND event_zstd IS NOT NULL
      AND event_utf8_bytes IS NOT NULL
      AND event_utf8_bytes BETWEEN 1 AND 4194304
      AND length(event_zstd) BETWEEN 1 AND 4194304
      AND navigation_json IS NOT NULL
    )
    OR (
      event_json IS NULL AND event_zstd IS NULL
      AND event_utf8_bytes IS NOT NULL
      AND event_utf8_bytes BETWEEN 1 AND 4194304
      AND navigation_json IS NOT NULL
    )
  ),
  CHECK (
    navigation_json IS NULL OR CASE WHEN json_valid(navigation_json) THEN coalesce(
      octet_length(navigation_json) <= 16384
      AND json_type(navigation_json, '$.version') = 'integer'
      AND json_extract(navigation_json, '$.version') = 1
      AND json_type(navigation_json, '$.report') = 'object'
      AND json_extract(navigation_json, '$.report.kind') IN ('canonical', 'leaf', 'link', 'ignored')
      AND json_type(navigation_json, '$.navigation') = 'object'
      AND json_type(navigation_json, '$.reset') = 'object'
      AND json_type(navigation_json, '$.model') = 'object'
      AND json_type(navigation_json, '$.modelBytes') = 'integer'
      AND json_extract(navigation_json, '$.modelBytes') BETWEEN 0 AND 4194304
      AND json_type(navigation_json, '$.modelWithoutCheckpointBytes') = 'integer'
      AND json_extract(navigation_json, '$.modelWithoutCheckpointBytes') BETWEEN 0 AND 4194304
      AND json_type(navigation_json, '$.withoutCustomDataBytes') = 'integer'
      AND json_extract(navigation_json, '$.withoutCustomDataBytes') BETWEEN 0 AND 4194304,
      0) ELSE 0 END
  )
) STRICT;

-- Canonical cold-tier owner for reclaimed transcript generations. The derived
-- .deleted/.reset file may be recreated from this row after a crash.
CREATE TABLE IF NOT EXISTS session_transcript_archives (
  session_id TEXT NOT NULL,
  generation TEXT NOT NULL,
  session_key TEXT NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('deleted', 'reset')),
  encoding TEXT NOT NULL CHECK (encoding IN ('identity', 'zstd')),
  archive_blob BLOB NOT NULL,
  archive_sha256 TEXT NOT NULL CHECK (length(archive_sha256) = 64),
  archive_name TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  published_at INTEGER,
  publish_attempts INTEGER NOT NULL DEFAULT 0 CHECK (publish_attempts >= 0),
  last_publish_attempt_at INTEGER,
  last_publish_error TEXT,
  PRIMARY KEY (session_id, generation),
  CHECK (archive_name NOT LIKE '%/%' AND archive_name NOT LIKE '%\\%')
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_session_transcript_archives_pending
  ON session_transcript_archives(created_at, session_id, generation)
  WHERE published_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_agent_session_transcript_archives_retention
  ON session_transcript_archives(created_at, session_id, generation);

CREATE TABLE IF NOT EXISTS session_transcript_cold_archives (
  session_id TEXT NOT NULL PRIMARY KEY,
  generation TEXT NOT NULL,
  archive_name TEXT NOT NULL UNIQUE,
  archive_sha256 TEXT NOT NULL CHECK (length(archive_sha256) = 64),
  event_count INTEGER NOT NULL CHECK (event_count >= 1),
  raw_bytes INTEGER NOT NULL CHECK (raw_bytes >= 0),
  archive_bytes INTEGER NOT NULL CHECK (archive_bytes >= 0),
  last_seq INTEGER NOT NULL,
  archived_at INTEGER NOT NULL,
  storage TEXT NOT NULL CHECK (storage IN ('file', 'sqlite')),
  archive_blob BLOB,
  FOREIGN KEY (session_id) REFERENCES "session_windows"(session_id) ON DELETE CASCADE,
  CHECK (length(archive_name) > 0 AND archive_name NOT IN ('.', '..') AND archive_name NOT LIKE '%/%' AND archive_name NOT LIKE '%\\%'),
  CHECK ((storage = 'file' AND archive_blob IS NULL) OR (storage = 'sqlite' AND archive_blob IS NOT NULL))
) STRICT;

CREATE TABLE IF NOT EXISTS session_transcript_cold_archive_chunks (
  session_id TEXT NOT NULL,
  chunk_index INTEGER NOT NULL CHECK (chunk_index >= 0),
  archive_name TEXT NOT NULL UNIQUE,
  archive_sha256 TEXT NOT NULL CHECK (length(archive_sha256) = 64),
  first_seq INTEGER NOT NULL,
  last_seq INTEGER NOT NULL CHECK (last_seq >= first_seq),
  event_count INTEGER NOT NULL CHECK (event_count >= 1),
  raw_bytes INTEGER NOT NULL CHECK (raw_bytes >= 0),
  archive_bytes INTEGER NOT NULL CHECK (archive_bytes >= 0),
  archive_blob BLOB,
  PRIMARY KEY (session_id, chunk_index),
  FOREIGN KEY (session_id) REFERENCES session_transcript_cold_archives(session_id) ON DELETE CASCADE,
  CHECK (length(archive_name) > 0 AND archive_name NOT IN ('.', '..') AND archive_name NOT LIKE '%/%' AND archive_name NOT LIKE '%\\%')
) STRICT, WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS transcript_rewrite_watermarks (
  session_id TEXT NOT NULL PRIMARY KEY,
  generation TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (session_id) REFERENCES "session_windows"(session_id) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS trajectory_runtime_events (
  session_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  run_id TEXT,
  event_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  event_utf8_bytes INTEGER,
  event_payload BLOB,
  event_codec TEXT,
  PRIMARY KEY (session_id, seq),
  FOREIGN KEY (session_id) REFERENCES "session_windows"(session_id) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_trajectory_runtime_run
  ON trajectory_runtime_events(session_id, run_id, created_at, COALESCE(event_utf8_bytes, octet_length(event_json)));

CREATE TABLE IF NOT EXISTS acp_parent_stream_events (
  session_id TEXT NOT NULL,
  run_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  event_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (session_id, run_id, seq),
  FOREIGN KEY (session_id) REFERENCES "session_windows"(session_id) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_acp_parent_stream_run
  ON acp_parent_stream_events(run_id, seq);

CREATE TABLE IF NOT EXISTS transcript_event_identities (
  session_id TEXT NOT NULL,
  event_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  event_type TEXT,
  parent_id TEXT,
  message_idempotency_key TEXT,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (session_id, event_id),
  FOREIGN KEY (session_id, seq) REFERENCES transcript_events(session_id, seq) ON DELETE CASCADE
) STRICT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_agent_transcript_message_idempotency
  ON transcript_event_identities(session_id, message_idempotency_key)
  WHERE message_idempotency_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_agent_transcript_event_identity_sequence
  ON transcript_event_identities(session_id, seq);

CREATE INDEX IF NOT EXISTS idx_agent_transcript_event_sequence
  ON transcript_event_identities(session_id, event_type, seq DESC);

CREATE TABLE IF NOT EXISTS context_engine_turn_outbox (
  enqueue_sequence INTEGER PRIMARY KEY,
  advancement_key TEXT NOT NULL UNIQUE,
  engine_id TEXT NOT NULL,
  owner_plugin_id TEXT,
  session_id TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  payload_state TEXT,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  last_attempt_at INTEGER,
  last_error TEXT,
  created_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_context_engine_turn_outbox_engine
  ON context_engine_turn_outbox(engine_id, created_at);

CREATE TABLE IF NOT EXISTS agent_tool_usage (
  tool_id TEXT PRIMARY KEY NOT NULL,
  score REAL NOT NULL CHECK (score >= 0),
  updated_at INTEGER NOT NULL
) STRICT;
-- END AGENT TOOL USAGE

CREATE TABLE IF NOT EXISTS cache_entries (
  scope TEXT NOT NULL,
  key TEXT NOT NULL,
  value_json TEXT,
  blob BLOB,
  expires_at INTEGER,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (scope, key)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_cache_expiry
  ON cache_entries(scope, expires_at, key)
  WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_agent_cache_updated
  ON cache_entries(scope, updated_at DESC, key);

CREATE INDEX IF NOT EXISTS idx_agent_voice_session_open_scope
  ON cache_entries(CASE WHEN json_valid(value_json) THEN json_extract(value_json, '$.agentId') END,
    CASE WHEN json_valid(value_json) THEN json_extract(value_json, '$.sessionKey') END, CASE WHEN json_valid(value_json) THEN json_extract(value_json, '$.origin') END)
  WHERE scope = 'talk-client-voice-sessions'
    AND CASE WHEN json_valid(value_json) THEN json_extract(value_json, '$.status') END = 'open';

CREATE INDEX IF NOT EXISTS idx_agent_voice_session_open_updated
  ON cache_entries(scope, updated_at)
  WHERE scope = 'talk-client-voice-sessions'
    AND CASE WHEN json_valid(value_json) THEN json_extract(value_json, '$.status') END = 'open';

CREATE TABLE IF NOT EXISTS auth_profile_store (
  store_key TEXT NOT NULL PRIMARY KEY,
  store_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS auth_profile_state (
  state_key TEXT NOT NULL PRIMARY KEY,
  state_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS memory_index_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS memory_index_sources (
  id INTEGER PRIMARY KEY,
  path TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'memory',
  hash TEXT NOT NULL,
  mtime REAL NOT NULL,
  size INTEGER NOT NULL,
  UNIQUE (path, source)
) STRICT;

CREATE TABLE IF NOT EXISTS memory_index_chunks (
  chunk_rowid INTEGER PRIMARY KEY,
  id TEXT NOT NULL UNIQUE,
  path TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'memory',
  start_line INTEGER NOT NULL,
  end_line INTEGER NOT NULL,
  hash TEXT NOT NULL,
  model TEXT NOT NULL,
  text TEXT NOT NULL,
  embedding BLOB NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS memory_index_chunk_recall_metadata (
  chunk_id TEXT PRIMARY KEY,
  importance INTEGER CHECK (importance IS NULL OR importance BETWEEN 1 AND 10),
  triggers TEXT,
  project_key TEXT,
  FOREIGN KEY (chunk_id) REFERENCES memory_index_chunks(id) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS memory_index_chunk_provenance (
  chunk_id TEXT PRIMARY KEY,
  origin_class TEXT NOT NULL CHECK (origin_class IN ('owner', 'agent', 'untrusted', 'system')),
  session_kind TEXT NOT NULL CHECK (session_kind IN ('interactive', 'cron', 'heartbeat', 'subagent', 'unknown')),
  observed_at INTEGER NOT NULL,
  supersedes_key TEXT,
  FOREIGN KEY (chunk_id) REFERENCES memory_index_chunks(id) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS memory_entry_origins (
  entry_key TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  session_key TEXT,
  origin_class TEXT NOT NULL CHECK (origin_class IN ('owner', 'agent', 'untrusted', 'system')),
  observed_at INTEGER NOT NULL,
  PRIMARY KEY (entry_key, agent_id, session_id)
) STRICT, WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS memory_session_tombstones (
  session_id TEXT NOT NULL PRIMARY KEY,
  agent_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS memory_embedding_cache (
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  provider_key TEXT NOT NULL,
  hash TEXT NOT NULL,
  embedding BLOB NOT NULL,
  dims INTEGER,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (provider, model, provider_key, hash)
) STRICT;

CREATE TABLE IF NOT EXISTS memory_index_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  revision INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS standing_intents (
  intent_key INTEGER PRIMARY KEY,
  id TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  trigger_keywords TEXT NOT NULL,
  trigger_embedding TEXT,
  channel_scope TEXT,
  sender_scope TEXT,
  creator_sender TEXT CHECK (creator_sender IS NULL OR length(trim(creator_sender)) > 0),
  status TEXT NOT NULL CHECK (status IN ('pending', 'armed', 'fired', 'done', 'cancelled', 'expired')),
  expires_at INTEGER NOT NULL,
  max_fires INTEGER NOT NULL CHECK (max_fires > 0),
  fire_count INTEGER NOT NULL DEFAULT 0 CHECK (fire_count >= 0),
  cooldown_seconds INTEGER NOT NULL DEFAULT 86400 CHECK (cooldown_seconds >= 0),
  last_fired_at INTEGER,
  created_at INTEGER NOT NULL,
  source_session_id TEXT
) STRICT;

CREATE INDEX IF NOT EXISTS idx_standing_intents_lifecycle
  ON standing_intents(status, expires_at, last_fired_at);

CREATE INDEX IF NOT EXISTS idx_standing_intents_scope
  ON standing_intents(status, channel_scope, sender_scope);

CREATE VIRTUAL TABLE IF NOT EXISTS standing_intents_fts USING fts5(
  trigger_keywords,
  content = 'standing_intents',
  content_rowid = 'intent_key',
  tokenize = 'unicode61 remove_diacritics 2'
);

CREATE TRIGGER IF NOT EXISTS standing_intents_fts_after_insert
AFTER INSERT ON standing_intents
BEGIN
  INSERT INTO standing_intents_fts(rowid, trigger_keywords)
  VALUES (new.intent_key, new.trigger_keywords);
END;

CREATE TRIGGER IF NOT EXISTS standing_intents_fts_after_delete
AFTER DELETE ON standing_intents
BEGIN
  INSERT INTO standing_intents_fts(standing_intents_fts, rowid, trigger_keywords)
  VALUES ('delete', old.intent_key, old.trigger_keywords);
END;

CREATE TRIGGER IF NOT EXISTS standing_intents_fts_after_update
AFTER UPDATE OF trigger_keywords ON standing_intents
BEGIN
  INSERT INTO standing_intents_fts(standing_intents_fts, rowid, trigger_keywords)
  VALUES ('delete', old.intent_key, old.trigger_keywords);
  INSERT INTO standing_intents_fts(rowid, trigger_keywords)
  VALUES (new.intent_key, new.trigger_keywords);
END;

CREATE TABLE IF NOT EXISTS session_transcript_index_state (
  session_id TEXT NOT NULL PRIMARY KEY,
  indexed_seq INTEGER NOT NULL,
  leaf_event_id TEXT,
  needs_rebuild INTEGER NOT NULL DEFAULT 0,
  active_event_count INTEGER NOT NULL DEFAULT 0,
  active_message_count INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (session_id) REFERENCES session_windows(session_id) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS session_transcript_active_events (
  session_id TEXT NOT NULL,
  active_position INTEGER NOT NULL CHECK (active_position >= 0),
  event_seq INTEGER NOT NULL,
  message_position INTEGER CHECK (message_position IS NULL OR message_position >= 0),
  context_eligible INTEGER,
  PRIMARY KEY (session_id, active_position),
  FOREIGN KEY (session_id, event_seq) REFERENCES transcript_events(session_id, seq) ON DELETE CASCADE
) STRICT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_agent_transcript_active_event_seq
  ON session_transcript_active_events(session_id, event_seq);

CREATE UNIQUE INDEX IF NOT EXISTS idx_agent_transcript_active_messages
  ON session_transcript_active_events(session_id, message_position)
  WHERE message_position IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_agent_transcript_context_pending
  ON session_transcript_active_events(session_id)
  WHERE context_eligible IS NULL;

CREATE TABLE IF NOT EXISTS session_transcript_active_event_facts (
  session_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  serialized_bytes INTEGER NOT NULL CHECK (serialized_bytes >= 1),
  dependency_navigation_json TEXT NOT NULL,
  PRIMARY KEY (session_id, seq),
  FOREIGN KEY (session_id, seq)
    REFERENCES session_transcript_active_events(session_id, event_seq) ON DELETE CASCADE
) STRICT, WITHOUT ROWID;
-- END ACTIVE EVENT FACTS

CREATE VIRTUAL TABLE IF NOT EXISTS session_transcript_fts USING fts5(
  text,
  session_id UNINDEXED,
  message_id UNINDEXED,
  role UNINDEXED,
  timestamp UNINDEXED,
  tokenize = 'unicode61 remove_diacritics 2'
);

CREATE TABLE IF NOT EXISTS session_transcript_fts_rows (
  id INTEGER PRIMARY KEY,
  session_id TEXT NOT NULL,
  message_id TEXT
) STRICT;

CREATE INDEX IF NOT EXISTS idx_session_transcript_fts_rows_session_message
  ON session_transcript_fts_rows(session_id, message_id);

CREATE TRIGGER IF NOT EXISTS session_transcript_fts_rows_after_delete
AFTER DELETE ON session_transcript_fts_rows
BEGIN
  DELETE FROM session_transcript_fts WHERE rowid = OLD.id;
END;

INSERT OR IGNORE INTO memory_index_state (id, revision) VALUES (1, 0);

CREATE INDEX IF NOT EXISTS idx_memory_embedding_cache_updated_at
  ON memory_embedding_cache(updated_at);

CREATE INDEX IF NOT EXISTS idx_memory_index_sources_source
  ON memory_index_sources(source);

CREATE INDEX IF NOT EXISTS idx_memory_index_chunks_path_source
  ON memory_index_chunks(path, source);

CREATE INDEX IF NOT EXISTS idx_memory_index_chunks_source
  ON memory_index_chunks(source);

-- Accepted input stays outside the active transcript until its exact turn owns execution.
CREATE TABLE IF NOT EXISTS session_pending_inputs (
  seq INTEGER PRIMARY KEY AUTOINCREMENT,
  input_id TEXT NOT NULL UNIQUE,
  session_key TEXT NOT NULL,
  session_id TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  run_id TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  message_json TEXT NOT NULL,
  lifecycle_generation TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('queued', 'interrupted', 'cancelled')),
  accepted_at INTEGER NOT NULL,
  consumed_event_id TEXT,
  UNIQUE (session_id, idempotency_key),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES session_windows(session_id) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_session_pending_inputs_session
  ON session_pending_inputs(session_key, session_id, seq DESC);

-- Processing completion is separate from input consumption; neither schedules replay.
CREATE TABLE IF NOT EXISTS session_input_completions (
  session_key TEXT NOT NULL,
  session_id TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  run_id TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  outcome_json TEXT NOT NULL,
  succeeded INTEGER NOT NULL CHECK (succeeded IN (0, 1)),
  completed_at INTEGER NOT NULL,
  PRIMARY KEY (session_id, idempotency_key),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES session_windows(session_id) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_session_input_completions_session_key
  ON session_input_completions(session_key);
`,{allowMissingColumns:true,validateAfterRepair:validateSchema,validateUnchanged:validateSchema,diagnostics:i,reuseIntegrity:s,integrity:c?{...h,tables:l??h.tables}:void 0}));if(d.length>0)agentDbLog.warn(`Rebuilt canonical agent SQLite indexes for ${t} (${n}): ${d.join(`, `)}`,{agentId:t,path:n,indexes:d,elapsedMs:Math.floor(performance.now()-g)})}else if(d===0&&!f&&e.prepare(`PRAGMA page_count`).get()?.page_count===0)assertSqliteIntegrity(e,n,c?h:void 0);else yield*sqliteIntegrityCheckSteps(e,n,i,h);return m}function ensureAgentSchema(e,t,n,r=42,i=e=>e(),a,o=false,s){const c=[];const l=getOpenClawAgentMigrationSchema(r);e.exec(`PRAGMA foreign_keys = OFF; PRAGMA legacy_alter_table = OFF;`);let u=false;try{const mutate=()=>{invalidateSqliteSchemaFacts(e);const i=readExistingAgentSchemaMeta(e);assertExistingAgentSchemaOwner(i,t,n);const a=assertSupportedAgentSchemaVersion(e,n);const d=resolveSchemaMigrationIntegrityCheck({kind:`agent`,foundVersion:a,supportedVersion:r},s);const f=a===0&&!hasAgentDatabaseApplicationSchema(e);const p=a<r&&(a>0||i!==null);const m=r>=18&&p;if(m&&i?.schemaVersion!==a)throw new Error(`Agent schema markers disagree for ${n}; repair ownership metadata before migration.`);if(a>r)throw new Error(`OpenClaw agent database ${n} uses schema version ${a}; expected at most ${r} for this migration.`);if(!f&&a<r)assertSupportedAgentMigrationSchemas(e,n,a);const assertMigration=()=>{if(!p)return;if(m)assertAgentDatabaseMaintenanceAuthority();getOpenClawDatabaseMaintenanceScope()?.assertAgentSchemaMigration({agentId:t,path:n,foundVersion:a,supportedVersion:r})};assertMigration();if(a<r)interruptHistoricalPendingInputs(e,a);if(f&&r===42){e.exec(l);e.exec(`PRAGMA user_version = ${r};`);persistAgentSchemaMetadata(e,t,r);u=true;return}const crossesVersion=e=>!f&&a<e&&r>=e;const h=crossesVersion(25);const g=crossesVersion(23);const _=crossesVersion(24);const v=crossesVersion(30);const y=v?withoutTrajectoryPayloadColumns(l):l;const b=_?withoutSessionEntrySnapshotsSchema(y):y;const x=g?withLegacyAgentStorageSchema(b,a):b;const finishStorageMigration=()=>{if(g)migrateAgentStorageInTransaction(e,b,a,c);if(_)migrateSessionEntrySnapshotsInTransaction(e);if(h)migrateCanonicalSessionWriterValidation(e);if(crossesVersion(26))migrateAgentJsonPredicatesInTransaction(e);if(a<27&&r>=27){const r=migrateOutboxEnqueueSequenceInTransaction(e);if(r!==null)agentDbLog.info(`agent outbox enqueue sequence rebuilt`,{agentId:t,pathname:n,elapsedMs:r})}if(crossesVersion(28))migrateAgentWriteLayoutInTransaction(e);if(crossesVersion(29))e.exec(AGENT_INDEX_RETIREMENT_SQL);if(v)migrateAgentTrajectoryStorageInTransaction(e);if(crossesVersion(31))e.exec(AGENT_MEMORY_REVISION_SQL);if(crossesVersion(37))e.exec(AGENT_COLD_ARCHIVE_CHUNKS_SQL);if(crossesVersion(39))migrateAgentColdNavigationInTransaction(e);if(crossesVersion(40))e.exec(AGENT_CREATION_OPERATIONS_SQL);if(crossesVersion(41))e.exec(AGENT_ACTIVE_EVENT_FACTS_SQL);if(crossesVersion(42))e.exec(AGENT_TOOL_USAGE_SQL);if(a<25)repairCanonicalSqliteIndexes(e,n,l,{verifyPhysicalIntegrity:false,integrity:d});finishAgentSchemaMigration(e,t,n,r,l,m,assertMigration,p?{tables:resolveSchemaMigrationIntegrityTables({kind:`agent`,foundVersion:a,supportedVersion:r}),...a>=40&&r<=42&&d.check===`quick`?{foreignKeyTables:a<41?[`session_transcript_active_event_facts`]:[]}:{}}:void 0)};if(a>=25&&a<r){assertAgentSchemaVersion(e,{agentId:t,pathname:n,version:a},getOpenClawAgentMigrationSchema(a));if(!o)ensureSessionAdditiveColumns(e);finishStorageMigration();return}if(a<r&&a>=21-1&&a<25&&r>=21){if(a>=21){migrateRetiredAgentStateLeaseSchema(e,n,r);ensureSessionAdditiveColumns(e);ensureSessionEntryValidityProjection(e);ensureLegacySessionEntryValidityTriggers(e);ensureSessionKeyContractSchemaInTransaction(e);if(hasPendingMemoryChunkMetadataMigration(e))migrateMemoryChunkMetadataSchema(e)}const i=getOpenClawAgentMigrationSchema(a);repairCanonicalSqliteIndexes(e,n,i,{verifyPhysicalIntegrity:false,integrity:d});assertAgentSchemaVersion(e,{agentId:t,pathname:n,version:a},i);if(a<21){e.exec(canonicalSessionValidationSchemaSql(x));if(!h)seedCanonicalSessionValidationPending(e)}finishStorageMigration();return}if(a===17){ensureSessionAdditiveColumns(e);ensureLegacySessionEntryValidityTriggers(e);assertSqliteIntegrity(e,n,d);migrateMemoryChunkMetadataSchema(e);assertOpenClawAgentSchemaContains(e,n,getOpenClawAgentMigrationSchema(a),`legacy`,true)}migrateRetiredAgentStateLeaseSchema(e,n,r);if(a===r){ensureSessionAdditiveColumns(e);ensureSessionEntryValidityProjection(e);ensureSessionKeyContractSchemaInTransaction(e);ensureSessionReactionsSchemaInTransaction(e);if(hasPendingMemoryChunkMetadataMigration(e)){migrateMemoryChunkMetadataSchema(e);e.exec(l)}repairCanonicalSqliteIndexes(e,n,l,{verifyPhysicalIntegrity:false,integrity:s?d:void 0});if(a===16)repairAndAssertOpenClawAgentV16Validity(e,n,l);persistAgentSchemaMetadata(e,t,r);assertAgentSchemaVersion(e,{agentId:t,pathname:n,version:r},l);assertAgentDatabaseMaintenanceAuthorityIfPresent();return}else if(a===14)repairAndAssertOpenClawAgentV14SchemaForMigration(e,{agentId:t,pathname:n});renewAgentDatabaseMaintenanceAuthorityIfPresent();migrateMemoryIndexSourcesIdentity(e);migrateOpenClawAgentSchema(e);migrateConversationDeliveryTargetColumn(e);if(a<11)backfillSessionConversations(e);migrateSessionNodesAndWindows(e,a);renewAgentDatabaseMaintenanceAuthorityIfPresent();ensureSessionAdditiveColumns(e);if(r>=18&&a<18)migrateSessionParticipantsSchema(e,n);if(r>=19)migrateSessionCreatorNamespaces(e,a);ensureSessionEntryValidityProjection(e);renewAgentDatabaseMaintenanceAuthorityIfPresent();e.exec(x);if(a!==17)migrateMemoryChunkMetadataSchema(e);if(a<r)ensureOpenClawAgentBoardSchemaInTransaction(e);migrateSessionTranscriptGenerations(e,a);migrateSessionTranscriptActiveProjection(e,a);if(a<11)migrateSqliteSchemaToStrictInTransaction(e,x,{databaseLabel:n,integrityCheck:s});if(a<21&&r>=21&&!h)seedCanonicalSessionValidationPending(e);finishStorageMigration()};runSqliteImmediateTransactionSync(e,mutate,{databaseLabel:n,operationLabel:`agent.schema.ensure`,withCommit:i})}finally{if(e.isOpen)e.exec(`PRAGMA foreign_keys = ON;`)}if(u&&(isSqliteSchemaAdmissionCold(e)||getAdmittedSqliteSchemaFacts(e))){admitSqliteSchema(e);adoptCanonicalSessionValidationSchema(e)}for(const e of c){const n=`Agent ${t}: ${e}`;agentDbLog.warn(n);a?.(n)}}function ensureOpenClawAgentDatabaseSchema(e,t){runSqliteIntegrityOperationSync(ensureOpenClawAgentDatabaseSchemaSteps(e,t))}function*ensureOpenClawAgentDatabaseSchemaSteps(e,t){const n=normalizeAgentId(t.agentId);const r={...t,agentId:n};const i=e.location()??resolveOpenClawAgentSqlitePath(r);if(!t.versionMigrationOnly)revokeSqliteDatabaseAdmissions(e);assertExistingAgentSchemaOwner(readExistingAgentSchemaMeta(e),n,i);const a=assertSupportedAgentSchemaVersion(e,i);if(a<42)assertSupportedAgentMigrationSchemas(e,i,a);const o=r.register===true&&isPersistentOpenClawAgentDatabasePath(i,r.env)?prepareAgentDeletionPathFence({agentId:n,path:i},{env:r.env},`maintenance`):void 0;const withRegistrationFence=e=>{if(!o)return e();return runOpenClawStateWriteTransaction(r=>{const a=agentDatabaseMaintenanceAuthority.getStore()?.authority.holdWriteFence?.(r.db);assertAgentDeletionRecoveryAllowsMutation(r,i);assertAgentDeletionPathFence(r,o);const s=e();const c=a?.renew();if(c){const e=`Agent ${n}: ${c}`;agentDbLog.warn(e);t.onMigrationWarning?.(e)}return s},{env:r.env,initializationAgentPaths:[i]})};withRegistrationFence(()=>void 0);if(e.location()&&!t.versionMigrationOnly)invalidateOpenClawAgentDatabaseIntegrityBeforeMutation(i);ensureOpenClawAgentDatabasePermissions(i,r);setSqliteBusyTimeout(e,OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);assertSupportedAgentSchemaVersion(e,i);assertExistingAgentSchemaOwner(readExistingAgentSchemaMeta(e),n,i);const withIntegrityMutation=t=>o?runSqliteImmediateTransactionSync(e,t,{databaseLabel:i,operationLabel:`agent.schema.integrity`,withCommit:withRegistrationFence}):t();if(!t.versionMigrationOnly&&readSqliteUserVersion(e)!==17){const r=agentDatabaseIntegrityBeforeMutationSteps(e,n,i,{integrityCheck:t.integrityCheck});try{let e=withIntegrityMutation(()=>r.next());while(!e.done){let t;try{yield e.value}catch(e){t={error:e}}e=withIntegrityMutation(()=>t?r.throw(t.error):r.next())}}finally{r.return(false)}}configureSqlitePreSchemaPragmas(e,{busyTimeoutMs:OPENCLAW_SQLITE_BUSY_TIMEOUT_MS});ensureAgentSchema(e,n,i,42,withRegistrationFence,t.onMigrationWarning,t.versionMigrationOnly,t.integrityCheck);if(t.versionMigrationOnly)return;ensureOpenClawAgentDatabasePermissions(i,r);const s=admitOpenClawAgentDatabaseSchema(e,{agentId:n,path:i});if(r.register===true)registerOpenClawAgentDatabase({agentId:n,path:i,env:t.env,admittedDb:s})}export{admitOpenClawAgentDatabaseSchema as a,ensureOpenClawAgentDatabaseSchemaSteps as i,ensureAgentSchema as n,ensureOpenClawAgentDatabasePermissions as o,ensureOpenClawAgentDatabaseSchema as r,agentDatabaseIntegrityBeforeMutationSteps as t};