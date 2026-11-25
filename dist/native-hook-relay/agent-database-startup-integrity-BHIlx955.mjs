import{a as isRecord,o as isStringArray}from"./record-coerce-DwDZngEy.mjs";import{l as resolveGlobalSingleton}from"./string-coerce-BBqv4GXj.mjs";import{b as MEMORY_PATH_FTS_TRIGGER_DEFINITIONS,v as MEMORY_CHUNK_FTS_TRIGGER_DEFINITIONS,y as MEMORY_INDEX_SOURCES_TABLE}from"./sqlite-source-handle-ZZZxvMwE.mjs";import{n as isSqliteCorruptionError}from"./sqlite-error-diagnostics-BiABvfN9.mjs";import"./number-coercion-DIhBGkET.mjs";import"./sqlite-user-version-CX1Gi2_y.mjs";import"./redact-BliqFuHZ.mjs";import{a as hasPreJournalStateSchema,l as createSqliteSchemaEnsurer}from"./openclaw-state-db-CbbiDpCs.mjs";import{c as isPathInside}from"./state-dir-C22DK7p0.mjs";import"./subsystem-rLS79yG2.mjs";import{t as formatErrorMessage}from"./errors-B4gik7lY.mjs";import"./version-C5P3ytoc.mjs";import"./plugin-instance-invocation-D2U32-yV.mjs";import{a as registerListener,i as notifyListeners,r as sqlPublicationAnchor}from"./sql-connection-Di4IkB2k.mjs";import"./kysely-sync-cache-state-CnmRo6Wk.mjs";import{p as resolveDatabasePathKey,t as assertDatabaseFileIdentity}from"./sqlite-worker-identity-gGA4fE_R.mjs";import{a as resolveOpenClawRegisteredAgentDatabasePath}from"./openclaw-state-db.paths-BAgG4Sc_.mjs";import{c as executeSqliteQuerySync,l as executeSqliteQueryTakeFirstSync,u as getNodeSqliteKysely}from"./sqlite-schema-issues-36DfJ4f1.mjs";import{$ as STARTUP_ADDITIVE_AGENT_COLUMN_DEFINITIONS,Mt as publishSqliteCommittedState,Nt as stageSqliteCommittedPublication,Pt as stageSqliteTransactionState,Q as FIRST_USE_ADDITIVE_AGENT_COLUMN_DEFINITIONS,Y as OPENCLAW_AGENT_SCHEMA_SQL}from"./sqlite-database-admission-4nHQnkzb.mjs";import{a as normalizeSchemaSql,t as extractSqliteTableSchema}from"./sqlite-schema-sql-D2HdV_QG.mjs";import"./sqlite-schema-facts-CuveMqub.mjs";import{a as tableHasColumn,i as tableExists}from"./openclaw-state-db-schema-helpers-Cw8xjLYP.mjs";import{n as normalizeAgentId}from"./agent-id-0RKGHEYi.mjs";import{s as observeOwnedDirectory}from"./agent-scope-config-DIJ4NXpt.mjs";import"./session-key-C7QrtJ_S.mjs";import"./openclaw-agent-db-resources-D8I6FkF7.mjs";import"./sqlite-handle-lifecycle-BG12Wy84.mjs";import{P as readTrackedStateDatabaseIdentity}from"./openclaw-state-db-cache-DKIDY9CG.mjs";import{o as SQLITE_WORKER_MAX_MESSAGE_BYTES}from"./sqlite-worker-operation-settlement-D99cNZM5.mjs";import"./sqlite-worker-operation-admission-DG9scDRb.mjs";import"./update-rehearsal-paths-DGU-9n1Y.mjs";import"./session-row-changes-DVCmTNT2.mjs";import{o as runSqliteReadSnapshotSync}from"./sqlite-transaction-BGOBjc3R.mjs";import"./config-env-vars-bZviYoz_.mjs";import{A as withoutAgentColdArchiveChunks,N as withoutAgentActiveEventFacts,T as withoutAgentCreationOperations,f as withLegacyAgentMemoryRevisionTriggers,h as withLegacyAgentIndexes,i as readRegisteredAgentDatabaseRows,s as withoutTrajectoryPayloadColumns,u as withoutAgentToolUsage}from"./openclaw-agent-db-registry-listing-B7Eu5xJ6.mjs";import{Ot as SESSION_PARTICIPANTS_TABLE,o as withExistingOpenClawStateDatabaseReadOnly}from"./openclaw-state-db-readonly-BX6K6gyA.mjs";import"./openclaw-state-worker-context-C26htsyi.mjs";import"./sqlite-worker-store-f3ILbpbs.mjs";import path from"node:path";import{createHash,randomUUID}from"node:crypto";import{stat}from"node:fs/promises";import{expressionBuilder}from"kysely";import{serialize}from"node:v8";
//!src/templates/provenance-secondary-references.ts
const TEMPLATE_SECONDARY_REFERENCE_TABLES=[`template_package_refs`,`template_mcp_server_refs`,`template_cron_refs`];function readTemplateSecondaryReferenceTables(e,t){return TEMPLATE_SECONDARY_REFERENCE_TABLES.filter(n=>{if(!tableExists(e,n))return false;return Boolean(e.prepare(`SELECT 1 FROM ${n} WHERE agent_id = ? LIMIT 1`).get(t))})}
//!src/state/agent-deletion-journal-authority.worker.ts
function hasTemplateDeletionOwnership(e,t){const n=getNodeSqliteKysely(e.db);return[`template_installs`,`template_workspace_files`].some(r=>tableExists(e.db,r)&&executeSqliteQueryTakeFirstSync(e.db,n.selectFrom(r).select(`agent_id`).where(`agent_id`,`=`,t).limit(1))!==void 0)||readTemplateSecondaryReferenceTables(e.db,t).length>0}
//!src/infra/sqlite-commit-receipt.ts
function createSqliteCommitReceipt(e){return{version:1,operationId:randomUUID(),source:e.source,domain:e.domain,facts:new Map([...new Set(e.keys)].map(t=>[t,e.readFact(t)]))}}function hasSqliteCommitReceiptCoverage(e,t){if(!isRecord(e)||e.version!==1||typeof e.operationId!==`string`||!e.operationId||e.domain!==t.domain||!isRecord(e.source)||e.source.identity!==t.source.identity||e.source.incarnation!==t.source.incarnation||!(e.facts instanceof Map))return false;const n=new Set(t.keys);const r=e.facts;return r.size===n.size&&[...n].every(e=>{const t=r.get(e);return isRecord(t)&&(t.kind===`absent`||t.kind===`unchanged`||t.kind===`unknown`||t.kind===`postimage`&&`value`in t)})}function readSqliteCommitReceipt(e,t){if(!isRecord(e)||!isRecord(e.source)||typeof e.source.identity!==`string`||typeof e.source.incarnation!==`string`||!(e.facts instanceof Map)||!hasSqliteCommitReceiptCoverage(e,{source:t.source??{identity:e.source.identity,incarnation:e.source.incarnation},domain:t.domain,keys:t.keys??[...e.facts.keys()]})||![...e.facts].every(([e,n])=>typeof e===`string`&&t.isFact(e,n)))throw new Error(t.invalidReceiptMessage??`State domain commit receipt is invalid`);return e}
//!src/state/state-domain-publication.ts
const batch=resolveGlobalSingleton(Symbol.for(`openclaw.stateDomainPublicationBatch`),()=>({current:void 0}));function createStateDomainPublication(e){const t=createKeyedStateDomainPublication({domain:e.domain,sourceIdentity:e.sourceIdentity,isFact:(t,n)=>n.kind===`absent`||n.kind===`postimage`&&e.isValue(n.value)&&e.keyOf(n.value)===t});return{...t,stagePostimages(n,r){t.stagePostimages(n,r.map(t=>[e.keyOf(t),t]))}}}function createKeyedStateDomainPublication(e){const t=resolveGlobalSingleton(Symbol.for(`openclaw.stateDomainPublication.${e.domain}`),()=>({sources:/* @__PURE__ */ new WeakMap,facts:/* @__PURE__ */ new Set,installingFacts:0}));const sourceFor=n=>{const r=sqlPublicationAnchor(n);let i=t.sources.get(r);if(!i){i={identity:e.sourceIdentity?.(n)??readTrackedStateDatabaseIdentity(n)?.key??Symbol(e.domain),incarnation:randomUUID()};t.sources.set(r,i)}return i};const receiptFor=(t,n)=>createSqliteCommitReceipt({source:sourceFor(t),domain:e.domain,keys:[...n.keys()],readFact:e=>n.get(e)});const install=n=>{const r=[];t.installingFacts++;try{notifyListeners(t.facts,n,e=>r.push(e))}finally{t.installingFacts--}if(r.length)throw new AggregateError(r,e.installFailureMessage??`State domain fact installation failed`)};const publication=e=>{let t={kind:`committed`,receipt:e};return{installFacts:()=>install(t),invalidate(){t={kind:`unknown`,identity:e.source.identity};install(t)},notify(){}}};const stage=(n,r)=>{if(e.mutationDuringInstallMessage&&t.installingFacts)throw new Error(e.mutationDuringInstallMessage);if(!r.size)return;const i=t.capture;if(i&&sqlPublicationAnchor(i.db)===sqlPublicationAnchor(n)){const e=new Map([...r.keys()].map(e=>[e,i.facts.get(e)]));if(!stageSqliteTransactionState(n,{stage(){for(const[e,t]of r)i.facts.set(e,t)},commit(){},rollback(){for(const[t,n]of e)if(n)i.facts.set(t,n);else i.facts.delete(t)}}))throw new Error(`State domain capture requires its owning transaction`)}const a=publication(receiptFor(n,r));if(!stageSqliteCommittedPublication(n,a)&&!n.isTransaction)publishSqliteCommittedState(a)};const readReceipt=(t,n=e.isFact)=>readSqliteCommitReceipt(t,{domain:e.domain,isFact:n,invalidReceiptMessage:e.invalidReceiptMessage});return{receipt:receiptFor,readReceipt,stageFacts:stage,stagePostimages(e,t){stage(e,new Map(t.map(([e,t])=>[e,{kind:`postimage`,value:structuredClone(t)}])))},stageDeletions(e,t){stage(e,new Map(t.map(e=>[e,{kind:`absent`}])))},capture(e,n){const r=t.capture;const i=r&&sqlPublicationAnchor(r.db)===sqlPublicationAnchor(e)?r:{db:e,facts:/* @__PURE__ */ new Map};t.capture=i;try{return{result:n(),receipt:receiptFor(e,i.facts)}}finally{t.capture=r}},bound(e){return serialize(e).byteLength<=33554432/4?e:{kind:`unknown`,identity:e.source.identity}},subscribeFacts:e=>registerListener(t.facts,e),begin(n,r=e.isFact){const i=randomUUID();const a=/* @__PURE__ */ new Set;let o=false;let s=false;let c=false;let l=false;const u=registerListener(t.facts,e=>{if(o)return;if(e.kind===`committed`&&e.receipt.source.identity===n.identity)for(const t of e.receipt.facts.keys())a.add(t);else if(e.kind===`unknown`&&e.identity===n.identity)s=true});try{if(n.publishPending!==false)install({kind:`pending`,identity:n.identity,operationId:i})}catch(e){u();try{install({kind:`settled`,identity:n.identity,operationId:i})}catch{}throw e}return{committed(t,i){try{n.assertCurrent();if(l)throw new Error(e.closedMessage??`State domain publication owner is closed`);if(isRecord(t)&&t.kind===`unknown`&&t.identity===n.identity)install({kind:`unknown`,identity:n.identity});else{const i=readReceipt(t,r);if(i.source.identity!==n.identity)throw new Error(e.changedOwnerMessage??`State domain commit receipt changed owner`);const c=publication({...i,facts:new Map([...i.facts].map(([e,t])=>[e,s||a.has(e)?{kind:`unknown`}:t]))});const l={...c,installFacts(){o=true;try{c.installFacts()}finally{o=false}}};if(batch.current)batch.current.push(l);else publishSqliteCommittedState(l)}c=true;i?.()}catch(e){install({kind:`unknown`,identity:n.identity});throw e}finally{o=false}},finish(e,t=false){if(l)return;l=true;u();try{if(!e||!c&&!t)install({kind:`unknown`,identity:n.identity})}finally{if(n.publishPending!==false)install({kind:`settled`,identity:n.identity,operationId:i})}}}}}}
//!src/state/agent-provenance-publication.ts
const agentProvenancePublication=createStateDomainPublication({domain:`agent-provenance`,keyOf:e=>e.agentId,isValue:e=>isRecord(e)&&typeof e.agentId===`string`&&(e.createdVia===`operator`||e.createdVia===`agent`||e.createdVia===`template`)&&(e.creatorAgentId===null||typeof e.creatorAgentId===`string`)&&typeof e.createdAtMs===`number`});
//!src/state/agent-deletion-journal-publication.ts
const agentDeletionJournalPublication=createStateDomainPublication({domain:`agent-deletion-journal`,keyOf:e=>e.agentId,isValue:e=>isRecord(e)&&typeof e.agentId===`string`&&typeof e.operationId===`string`&&typeof e.cleanupCompleted===`boolean`});
//!src/infra/state-migrations.receipts.ts
function readLegacyMigrationReceiptFromDatabase(e,t){const n=executeSqliteQueryTakeFirstSync(e,getNodeSqliteKysely(e).selectFrom(`migration_sources`).select([`source_sha256`,`removed_source`,`report_json`]).where(`source_key`,`=`,t));return n?{sourceKey:t,sourceSha256:n.source_sha256,removedSource:n.removed_source===1,reportJson:n.report_json}:null}
//!src/state/agent-deletion-journal-recovery.kernel.ts
const AGENT_DELETION_RECOVERY_SOURCE_KEY=`agent-deletion-journal-reconstruction`;const AGENT_DELETION_RECONSTRUCTION_DESCRIPTION=`Reconstructed the missing agent deletion journal; held databases require explicit agent restore or delete.`;function parseHolds(e){return e.map(e=>{if(!isRecord(e)||typeof e.agentId!==`string`||e.agentId!==normalizeAgentId(e.agentId)||typeof e.path!==`string`||!e.path.trim())throw new Error(`Invalid agent database hold in deletion journal reconstruction receipt.`);return{agentId:e.agentId,path:e.path}})}function readReport(e){const t=readLegacyMigrationReceiptFromDatabase(e.db,AGENT_DELETION_RECOVERY_SOURCE_KEY);if(!t)return;const n=JSON.parse(t.reportJson);if(!isRecord(n)||typeof n.description!==`string`||!Array.isArray(n.held))throw new Error(`Invalid agent deletion journal reconstruction receipt.`);const r=parseHolds(n.held);if(n.missingJournal!==void 0&&!Array.isArray(n.missingJournal))throw new Error(`Invalid missing-journal provenance in deletion journal reconstruction receipt.`);const i=Array.isArray(n.missingJournal)?parseHolds(n.missingJournal):n.description===`Reconstructed the missing agent deletion journal; held databases require explicit agent restore or delete.`?r:[];if(i.some(e=>!r.some(t=>t.agentId===e.agentId&&t.path===e.path)))throw new Error(`Missing-journal provenance refers to an unheld agent database.`);return{...n,description:n.description,held:r,missingJournal:i}}function decodeHolds(e,t){return t.map(t=>({agentId:t.agentId,path:resolveOpenClawRegisteredAgentDatabasePath(e.path,t.path)}))}function readAgentDeletionRecoveryHolds(e){return decodeHolds(e,readReport(e)?.held??[])}
//!src/state/agent-deletion-journal-status.ts
const pendingLoads=resolveGlobalSingleton(Symbol.for(`openclaw.agentDeletionJournalStatusLoads`),()=>/* @__PURE__ */ new Map);
//!src/state/agent-deletion-journal.read.ts
function parseAgentDeletionDatabasePaths(e){const t=JSON.parse(e);if(isStringArray(t))return t;throw new Error(`Invalid agent deletion database path journal.`)}function readRetainedAgentDeletionsFromDatabase(e,t,n=`maintenance`,r){let i=[];let a=false;let o;try{a=!tableExists(e,`agent_deletion_journal`);if(!a){const t=expressionBuilder();const a=t.and([t(`cleanup_completed`,`=`,1),t(`delete_files`,`=`,0)]);const s=n!==`runtime`?t.or([a,t(`cleanup_completed`,`=`,0)]):a;i=executeSqliteQuerySync(e,getNodeSqliteKysely(e).selectFrom(`agent_deletion_journal`).select([`agent_id`,`cleanup_completed`]).select(tableHasColumn(e,`agent_deletion_journal`,`phase`)?`phase`:t.lit(null).as(`phase`)).select([t.case().when(s).then(t.ref(`agent_dir`)).else(null).end().as(`agent_dir`),t.case().when(s).then(t.ref(`database_paths_json`)).else(`[]`).end().as(`database_paths_json`)]).$if(!r,e=>e.where(s)).orderBy(`agent_id`,`asc`)).rows.flatMap(t=>{r?.push({agentId:t.agent_id,status:t.cleanup_completed===1?`complete`:`pending`});if(t.agent_dir===null)return[];let i=[];try{i=parseAgentDeletionDatabasePaths(t.database_paths_json)}catch(e){if(n===`maintenance`)o??=formatErrorMessage(e)}const a={agentId:t.agent_id,agentDir:t.agent_dir,databasePaths:[path.join(t.agent_dir,`openclaw-agent.sqlite`),...i],cleanupCompleted:t.cleanup_completed===1};if(t.cleanup_completed===0&&t.phase==null&&hasTemplateDeletionOwnership({db:e},t.agent_id))a.manualTemplateRemoval=true;return a})}}catch(e){if(isSqliteCorruptionError(e))throw e;o=formatErrorMessage(e)}let s=[];try{if(tableExists(e,`migration_sources`))s=readAgentDeletionRecoveryHolds({db:e,path:t})}catch(e){if(n===`maintenance`||isSqliteCorruptionError(e))throw e}if(a&&s.length===0&&hasPreJournalStateSchema(e))return{status:`empty`};if(a||o!==void 0)return{status:`unavailable`,cause:a?`missing`:`unreadable`,reason:a?`deletion journal missing`:`deletion journal unreadable: ${o}`,...i.length||s.length?{known:{entries:i,held:s}}:{}};return i.length||s.length?{status:`present`,entries:i,held:s}:{status:`empty`}}function readAgentDatabaseDeletionSnapshot(e,t=`maintenance`){return withExistingOpenClawStateDatabaseReadOnly(({db:e,path:n})=>runSqliteReadSnapshotSync(e,()=>({retainedDeletions:readRetainedAgentDeletionsFromDatabase(e,n,t),registeredAgentDatabases:readRegisteredAgentDatabaseRows(e,n,false)}),{operationLabel:`agentDeletionJournal.snapshot`}),{env:e})}
//!packages/memory-host-sdk/src/host/memory-schema-provenance.ts
const MEMORY_INDEX_CHUNK_PROVENANCE_TABLE=`memory_index_chunk_provenance`;const MEMORY_INDEX_CHUNK_PROVENANCE_SCHEMA_SQL=`
  CREATE TABLE IF NOT EXISTS ${MEMORY_INDEX_CHUNK_PROVENANCE_TABLE} (
    chunk_id TEXT PRIMARY KEY,
    origin_class TEXT NOT NULL CHECK (origin_class IN ('owner', 'agent', 'untrusted', 'system')),
    session_kind TEXT NOT NULL CHECK (session_kind IN ('interactive', 'cron', 'heartbeat', 'subagent', 'unknown')),
    observed_at INTEGER NOT NULL,
    supersedes_key TEXT,
    FOREIGN KEY (chunk_id) REFERENCES memory_index_chunks(id) ON DELETE CASCADE
  ) STRICT;
`;const ensureProvenanceTable=createSqliteSchemaEnsurer(()=>MEMORY_INDEX_CHUNK_PROVENANCE_SCHEMA_SQL,{tables:[MEMORY_INDEX_CHUNK_PROVENANCE_TABLE]});
//!packages/memory-host-sdk/src/host/memory-schema-recall.ts
const MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE=`memory_index_chunk_recall_metadata`;
//!packages/memory-host-sdk/src/host/memory-schema-storage-migration.ts
const LEGACY_CHUNK_REVISION_TRIGGERS=[`insert`,`update`,`delete`].map(e=>({name:`memory_index_chunks_revision_after_${e}`,sql:`CREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_${e}
    AFTER ${e.toUpperCase()} ON memory_index_chunks
    BEGIN UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1; END;`}));
//!packages/memory-host-sdk/src/host/memory-schema.ts
const LEGACY_MEMORY_INDEX_SOURCE_COLUMNS=[`path`,`source`,`hash`,`mtime`,`size`];const MEMORY_INDEX_SOURCE_COLUMNS=[`id`,...LEGACY_MEMORY_INDEX_SOURCE_COLUMNS];
//!src/state/openclaw-agent-context-engine-turn-outbox-schema.ts
const CONTEXT_ENGINE_TURN_OUTBOX_TABLE=`context_engine_turn_outbox`;const ensureNativeContextEngineTurnOutboxSchema=createSqliteSchemaEnsurer(()=>extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL,CONTEXT_ENGINE_TURN_OUTBOX_TABLE,{endMarker:`CREATE TABLE IF NOT EXISTS cache_entries (`,includeEndMarker:false,errorMessage:`OpenClaw context-engine turn outbox schema markers are missing.`}),{tables:[CONTEXT_ENGINE_TURN_OUTBOX_TABLE],indexes:[`idx_agent_context_engine_turn_outbox_engine`]});
//!src/state/openclaw-agent-goal-operations-schema.ts
const SESSION_GOAL_OPERATIONS_TABLE=`session_goal_operations`;const ensureNativeSessionGoalOperationsSchema=createSqliteSchemaEnsurer(()=>extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL,SESSION_GOAL_OPERATIONS_TABLE,{endMarker:`CREATE TABLE IF NOT EXISTS transcript_events (`,includeEndMarker:false,errorMessage:`OpenClaw Goal operation schema markers are missing.`}),{tables:[SESSION_GOAL_OPERATIONS_TABLE],indexes:[`idx_agent_session_goal_operations_expiry`]});
//!src/state/openclaw-agent-pending-inputs-schema.ts
const SESSION_PENDING_INPUTS_TABLE=`session_pending_inputs`;const SESSION_INPUT_COMPLETIONS_TABLE=`session_input_completions`;const ensurePendingTable=createSqliteSchemaEnsurer(()=>extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL,SESSION_PENDING_INPUTS_TABLE,{endMarker:`-- Processing completion`,includeEndMarker:false,errorMessage:`OpenClaw pending-input schema marker is missing.`}),{tables:[SESSION_PENDING_INPUTS_TABLE],indexes:[`idx_agent_session_pending_inputs_session`]});const ensureInputCompletionsTable=createSqliteSchemaEnsurer(()=>extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL,SESSION_INPUT_COMPLETIONS_TABLE,{endMarker:`ON session_input_completions(session_key);`,errorMessage:`OpenClaw input-completion schema marker is missing.`}),{tables:[SESSION_INPUT_COMPLETIONS_TABLE],indexes:[`idx_agent_session_input_completions_session_key`]});
//!src/state/openclaw-agent-session-snapshots-schema.ts
function sessionEntrySnapshotsSchemaSql(e){return extractSqliteTableSchema(e,`session_entry_snapshots`,{endMarker:`CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_updated_at`,includeEndMarker:false})}function withoutSessionEntrySnapshotsSchema(e){if(!e.includes(`CREATE TABLE IF NOT EXISTS session_entry_snapshots (`))return e;return e.replace(`  snapshot_revision INTEGER NOT NULL DEFAULT 0,
`,``).replace(sessionEntrySnapshotsSchemaSql(e),``)}
//!src/state/openclaw-agent-transcript-fts-schema-source.ts
const DEPLOYED_FTS_ROWS_SCHEMA=`CREATE TABLE IF NOT EXISTS session_transcript_fts_rows (
  session_id TEXT NOT NULL,
  fts_rowid INTEGER NOT NULL PRIMARY KEY
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_transcript_fts_rows_session
  ON session_transcript_fts_rows(session_id);
`;function withDeployedTranscriptFtsRowSchema(e){const t=extractSqliteTableSchema(e,`session_transcript_index_state`);return e.replace(t,t.replace(`  updated_at INTEGER NOT NULL,`,`  fts_row_count INTEGER,
  updated_at INTEGER NOT NULL,`)).replace(`CREATE VIRTUAL TABLE IF NOT EXISTS session_transcript_fts USING fts5(`,`${DEPLOYED_FTS_ROWS_SCHEMA}\nCREATE VIRTUAL TABLE IF NOT EXISTS session_transcript_fts USING fts5(`)}
//!src/state/openclaw-agent-storage-schema.ts
const LEGACY_STORAGE_TABLES={transcript_events:`CREATE TABLE IF NOT EXISTS transcript_events (
  session_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  event_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (session_id, seq),
  FOREIGN KEY (session_id) REFERENCES "session_windows"(session_id) ON DELETE CASCADE
) STRICT;`,memory_index_chunks:`CREATE TABLE IF NOT EXISTS memory_index_chunks (
  id TEXT PRIMARY KEY,
  path TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'memory',
  start_line INTEGER NOT NULL,
  end_line INTEGER NOT NULL,
  hash TEXT NOT NULL,
  model TEXT NOT NULL,
  text TEXT NOT NULL,
  embedding TEXT NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;`,memory_embedding_cache:`CREATE TABLE IF NOT EXISTS memory_embedding_cache (
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  provider_key TEXT NOT NULL,
  hash TEXT NOT NULL,
  embedding TEXT NOT NULL,
  dims INTEGER,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (provider, model, provider_key, hash)
) STRICT;`};function withLegacyAgentStorageSchema(e,t=21){let n=withoutSessionEntrySnapshotsSchema(e);for(const[e,t]of Object.entries(LEGACY_STORAGE_TABLES))n=n.replace(extractSqliteTableSchema(n,e),t);if(n.includes(`CREATE TABLE IF NOT EXISTS session_transcript_fts_rows (`))n=n.replace(extractSqliteTableSchema(n,`session_transcript_fts_rows`,{endMarker:`INSERT OR IGNORE INTO memory_index_state`,includeEndMarker:false}),``);return t===22?withDeployedTranscriptFtsRowSchema(n):n}
//!src/state/openclaw-agent-schema-history.ts
const LEGACY_ENTRY_VALIDITY_TRIGGERS_SQL=`
CREATE TRIGGER IF NOT EXISTS session_nodes_entry_valid_after_insert
AFTER INSERT ON session_nodes
BEGIN
  UPDATE session_nodes SET entry_valid = 0 WHERE session_key = NEW.session_key;
END;

CREATE TRIGGER IF NOT EXISTS session_nodes_entry_valid_after_entry_update
AFTER UPDATE OF entry_json ON session_nodes
BEGIN
  UPDATE session_nodes SET entry_valid = 0 WHERE session_key = NEW.session_key;
END;

CREATE TRIGGER IF NOT EXISTS session_nodes_entry_valid_after_identity_update
AFTER UPDATE OF current_session_id, updated_at ON session_nodes
BEGIN
  UPDATE session_nodes SET entry_valid = 0 WHERE session_key = NEW.session_key;
END;
`;const LEGACY_CANONICAL_PENDING_TRIGGERS_SQL=`
-- Avoid trigger-local conflict clauses: SQLite inherits the outer writer's
-- conflict policy, including writers that predate this validation projection.
CREATE TRIGGER IF NOT EXISTS session_nodes_canonical_pending_after_insert
AFTER INSERT ON session_nodes
BEGIN
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT NEW.session_key
  WHERE NOT EXISTS (
    SELECT 1 FROM session_canonical_validation_pending WHERE session_key = NEW.session_key
  );
END;

CREATE TRIGGER IF NOT EXISTS session_nodes_canonical_pending_after_update
AFTER UPDATE OF session_key, current_session_id, entry_json, entry_valid,
  parent_session_key, spawned_by, fork_source_session_key ON session_nodes
WHEN OLD.session_key IS NOT NEW.session_key
  OR OLD.current_session_id IS NOT NEW.current_session_id
  OR OLD.entry_json IS NOT NEW.entry_json
  OR OLD.entry_valid IS NOT NEW.entry_valid
  OR OLD.parent_session_key IS NOT NEW.parent_session_key
  OR OLD.spawned_by IS NOT NEW.spawned_by
  OR OLD.fork_source_session_key IS NOT NEW.fork_source_session_key
BEGIN
  DELETE FROM session_canonical_validation_pending
  WHERE session_key = OLD.session_key AND OLD.session_key IS NOT NEW.session_key;
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT NEW.session_key
  WHERE NOT EXISTS (
    SELECT 1 FROM session_canonical_validation_pending WHERE session_key = NEW.session_key
  );
END;

CREATE TRIGGER IF NOT EXISTS session_nodes_canonical_pending_after_delete
AFTER DELETE ON session_nodes
BEGIN
  DELETE FROM session_canonical_validation_pending WHERE session_key = OLD.session_key;
END;

CREATE TRIGGER IF NOT EXISTS session_windows_canonical_pending_after_insert
AFTER INSERT ON session_windows
BEGIN
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT node.session_key FROM session_nodes AS node
  WHERE node.current_session_id = NEW.session_id
    AND NOT EXISTS (
      SELECT 1 FROM session_canonical_validation_pending AS pending
      WHERE pending.session_key = node.session_key
    );
END;

CREATE TRIGGER IF NOT EXISTS session_windows_canonical_pending_after_update
AFTER UPDATE OF session_id, session_key ON session_windows
WHEN OLD.session_id IS NOT NEW.session_id OR OLD.session_key IS NOT NEW.session_key
BEGIN
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT node.session_key FROM session_nodes AS node
  WHERE node.current_session_id IN (OLD.session_id, NEW.session_id)
    AND NOT EXISTS (
      SELECT 1 FROM session_canonical_validation_pending AS pending
      WHERE pending.session_key = node.session_key
    );
END;

CREATE TRIGGER IF NOT EXISTS session_windows_canonical_pending_after_delete
AFTER DELETE ON session_windows
BEGIN
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT node.session_key FROM session_nodes AS node
  WHERE node.current_session_id = OLD.session_id
    AND NOT EXISTS (
      SELECT 1 FROM session_canonical_validation_pending AS pending
      WHERE pending.session_key = node.session_key
    );
END;

CREATE TRIGGER IF NOT EXISTS session_key_contract_canonical_pending_after_insert
AFTER INSERT ON session_key_contract
BEGIN
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT node.session_key FROM session_nodes AS node
  WHERE NOT EXISTS (
    SELECT 1 FROM session_canonical_validation_pending AS pending
    WHERE pending.session_key = node.session_key
  );
END;

CREATE TRIGGER IF NOT EXISTS session_key_contract_canonical_pending_after_update
AFTER UPDATE OF main_key ON session_key_contract
WHEN OLD.main_key IS NOT NEW.main_key
BEGIN
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT node.session_key FROM session_nodes AS node
  WHERE NOT EXISTS (
    SELECT 1 FROM session_canonical_validation_pending AS pending
    WHERE pending.session_key = node.session_key
  );
END;

CREATE TRIGGER IF NOT EXISTS session_key_contract_canonical_pending_after_delete
AFTER DELETE ON session_key_contract
BEGIN
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT node.session_key FROM session_nodes AS node
  WHERE NOT EXISTS (
    SELECT 1 FROM session_canonical_validation_pending AS pending
    WHERE pending.session_key = node.session_key
  );
END;
`;function withLegacyCanonicalSessionValidationTriggers(e){return e.replace(`CREATE TABLE IF NOT EXISTS session_windows (`,`${LEGACY_ENTRY_VALIDITY_TRIGGERS_SQL}\nCREATE TABLE IF NOT EXISTS session_windows (`).replace(`CREATE TABLE IF NOT EXISTS conversations (`,`${LEGACY_CANONICAL_PENDING_TRIGGERS_SQL}\nCREATE TABLE IF NOT EXISTS conversations (`)}const LEGACY_CANONICAL_VALIDATION_TRIGGER_NAMES=Object.freeze([...`${LEGACY_ENTRY_VALIDITY_TRIGGERS_SQL}\n${LEGACY_CANONICAL_PENDING_TRIGGERS_SQL}`.matchAll(/CREATE TRIGGER IF NOT EXISTS (\w+)/gu)].map(e=>e[1]));function canonicalSessionValidationSchemaSql(e=OPENCLAW_AGENT_SCHEMA_SQL){return extractSqliteTableSchema(e,`session_canonical_validation_pending`,{endMarker:`CREATE TABLE IF NOT EXISTS conversations (`,includeEndMarker:false})}function withoutCanonicalSessionValidationSchema(e){if(!e.includes(`CREATE TABLE IF NOT EXISTS session_canonical_validation_pending (`))return e;return e.replace(canonicalSessionValidationSchemaSql(e),``)}const AGENT_JSON_PREDICATE_COLUMN_DECLARATIONS={session_started_at:`INTEGER`,has_optional_references:`INTEGER NOT NULL DEFAULT 0`,payload_state:`TEXT`,navigation_type:`TEXT`,navigation_custom_type:`TEXT`,navigation_display:`INTEGER NOT NULL DEFAULT 0`,message_role:`TEXT`,navigation_last_type:`TEXT`,navigation_last_custom_type:`TEXT`,navigation_valid:`INTEGER NOT NULL DEFAULT 1`};function withoutAgentJsonPredicateColumns(e){let t=e;for(const[e,n]of Object.entries(AGENT_JSON_PREDICATE_COLUMN_DECLARATIONS))t=t.replace(`  ${e} ${n},\n`,``);return t}const LEGACY_PARTICIPANTS_SCHEMA=`CREATE TABLE IF NOT EXISTS session_participants (
  session_key TEXT NOT NULL,
  actor_type TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  actor_source TEXT,
  contribution_count INTEGER,
  first_prompted_at INTEGER NOT NULL,
  last_prompted_at INTEGER NOT NULL,
  PRIMARY KEY (session_key, actor_type, actor_id),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
) STRICT;`;function sessionParticipantsSchemaSql(){return extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL,SESSION_PARTICIPANTS_TABLE,{endMarker:`CREATE TABLE IF NOT EXISTS session_key_contract (`,includeEndMarker:false,errorMessage:`OpenClaw session participant schema markers are missing.`})}function withLegacySessionParticipantsSchema(e){return withoutCanonicalSessionValidationSchema(e).replace(sessionParticipantsSchemaSql().trim(),LEGACY_PARTICIPANTS_SCHEMA)}function withoutOutboxEnqueueSequence(e){return e.replace(`  enqueue_sequence INTEGER PRIMARY KEY,
  advancement_key TEXT NOT NULL UNIQUE,`,`  advancement_key TEXT NOT NULL PRIMARY KEY,`)}const LEGACY_PARENT_INDEX=`CREATE INDEX IF NOT EXISTS idx_agent_transcript_event_parent
  ON transcript_event_identities(session_id, parent_id)
  WHERE parent_id IS NOT NULL;

`;function withLegacyAgentWriteLayout(e){return e.replace(/(CREATE TABLE IF NOT EXISTS memory_entry_origins \([\s\S]*?\n\) STRICT), WITHOUT ROWID;/u,`$1;`).replace(`ON session_windows(primary_conversation_id)`,`ON session_windows(primary_conversation_id, updated_at DESC, session_id)`).replace(`CREATE INDEX IF NOT EXISTS idx_agent_transcript_event_sequence`,`${LEGACY_PARENT_INDEX}CREATE INDEX IF NOT EXISTS idx_agent_transcript_event_sequence`)}const AGENT_SCHEMA_BEFORE_TOOL_USAGE=withoutAgentToolUsage(OPENCLAW_AGENT_SCHEMA_SQL);const AGENT_SCHEMA_BEFORE_ACTIVE_EVENT_FACTS=withoutAgentActiveEventFacts(AGENT_SCHEMA_BEFORE_TOOL_USAGE);const AGENT_SCHEMA_BEFORE_CREATION_OPERATIONS=withoutAgentCreationOperations(AGENT_SCHEMA_BEFORE_ACTIVE_EVENT_FACTS);const AGENT_SCHEMA_BEFORE_SESSION_DELETION_INDEXES=AGENT_SCHEMA_BEFORE_CREATION_OPERATIONS.replace(/\nCREATE INDEX IF NOT EXISTS idx_agent_(?:session_input_completions_session_key|conversation_deliveries_source_session)\b[^;]*;\n/gu,``);const OPENCLAW_AGENT_BOARD_SCHEMA_SQL=extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL,`board_tabs`,{endMarker:`CREATE TABLE IF NOT EXISTS session_progress_cards (`,includeEndMarker:false,errorMessage:`OpenClaw agent board schema markers are missing from the canonical schema.`});const OPENCLAW_AGENT_SCHEMA_WITHOUT_BOARD_SQL=withLegacyAgentIndexes(withoutTrajectoryPayloadColumns(withLegacyAgentMemoryRevisionTriggers(withoutAgentColdArchiveChunks(AGENT_SCHEMA_BEFORE_SESSION_DELETION_INDEXES)))).replace(OPENCLAW_AGENT_BOARD_SCHEMA_SQL,``);const SESSION_PROGRESS_CARDS_TABLE=`session_progress_cards`;const AGENT_PROGRESS_CARD_SCHEMA_SQL=extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_WITHOUT_BOARD_SQL,SESSION_PROGRESS_CARDS_TABLE,{endMarker:`CREATE TABLE IF NOT EXISTS heartbeat_outcomes (`,includeEndMarker:false,errorMessage:`OpenClaw agent progress-card schema markers are missing.`});const AGENT_SCHEMA_WITHOUT_PROGRESS_CARD_SQL=OPENCLAW_AGENT_SCHEMA_WITHOUT_BOARD_SQL.replace(AGENT_PROGRESS_CARD_SCHEMA_SQL,``);const SUGGESTIONS_SCHEMA_START=`CREATE TABLE IF NOT EXISTS session_suggestions (`;const sessionSharingSchema=extractSqliteTableSchema(AGENT_SCHEMA_WITHOUT_PROGRESS_CARD_SQL,`session_members`,{endMarker:`CREATE TABLE IF NOT EXISTS heartbeat_outcomes (`,includeEndMarker:false,errorMessage:`OpenClaw agent session-sharing schema markers are missing.`});const sessionSuggestionsStart=sessionSharingSchema.indexOf(SUGGESTIONS_SCHEMA_START);if(sessionSuggestionsStart===-1)throw new Error(`OpenClaw agent session-suggestions schema marker is missing.`);const AGENT_V14_SESSION_SHARING_SCHEMA_SQL=sessionSharingSchema.slice(0,sessionSuggestionsStart);const AGENT_V14_ADDITIVE_SCHEMA_SQL=sessionSharingSchema.slice(sessionSuggestionsStart);const AGENT_V14_CORE_SCHEMA_SQL=withLegacySessionParticipantsSchema(withLegacyAgentStorageSchema(withLegacyCanonicalSessionValidationTriggers(withoutAgentJsonPredicateColumns(withoutOutboxEnqueueSequence(withLegacyAgentWriteLayout(AGENT_SCHEMA_WITHOUT_PROGRESS_CARD_SQL.replace(sessionSharingSchema,``)))))));
//!src/state/openclaw-agent-session-transcript-archive-schema.ts
const SESSION_TRANSCRIPT_ARCHIVES_TABLE=`session_transcript_archives`;const ensureNativeSessionTranscriptArchiveSchema=createSqliteSchemaEnsurer(()=>extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL,SESSION_TRANSCRIPT_ARCHIVES_TABLE,{endMarker:`CREATE TABLE IF NOT EXISTS transcript_rewrite_watermarks (`,includeEndMarker:false,errorMessage:`OpenClaw session transcript archive schema markers are missing.`}),{tables:[SESSION_TRANSCRIPT_ARCHIVES_TABLE,`session_transcript_cold_archives`],indexes:[`idx_agent_session_transcript_archives_pending`,`idx_agent_session_transcript_archives_retention`]});
//!src/state/openclaw-agent-standing-intents-schema.ts
const STANDING_INTENTS_TABLE=`standing_intents`;const STANDING_INTENTS_FTS_TABLE=`standing_intents_fts`;const STANDING_INTENTS_FTS_SHADOW_TABLES=[`standing_intents_fts_config`,`standing_intents_fts_data`,`standing_intents_fts_docsize`,`standing_intents_fts_idx`];
//!src/state/openclaw-agent-db-schema-compatibility.ts
const AGENT_SCHEMA_COMPATIBILITY={allowCompatibleAdditiveColumns:true,allowedMissingTables:[`session_reactions`,`memory_entry_origins`,`memory_session_tombstones`,MEMORY_INDEX_CHUNK_PROVENANCE_TABLE,MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE,CONTEXT_ENGINE_TURN_OUTBOX_TABLE,`message_tool_run_outcomes`,SESSION_GOAL_OPERATIONS_TABLE,SESSION_PENDING_INPUTS_TABLE,SESSION_INPUT_COMPLETIONS_TABLE,SESSION_PARTICIPANTS_TABLE,SESSION_PROGRESS_CARDS_TABLE,SESSION_TRANSCRIPT_ARCHIVES_TABLE,STANDING_INTENTS_TABLE,STANDING_INTENTS_FTS_TABLE,...STANDING_INTENTS_FTS_SHADOW_TABLES],allowedMissingColumns:[...STARTUP_ADDITIVE_AGENT_COLUMN_DEFINITIONS.map(({columnName:e,tableName:t})=>`${t}.${e}`),`standing_intents.creator_sender`,...FIRST_USE_ADDITIVE_AGENT_COLUMN_DEFINITIONS.map(({columnName:e,tableName:t})=>`${t}.${e}`)],allowedColumnDefinitions:{"session_pending_inputs.recovery_intent_json":[`recovery_intent_json TEXT`],"conversations.delivery_target":[`delivery_target TEXT NOT NULL DEFAULT ''`]},allowedMissingIndexes:[`idx_agent_transcript_context_pending`,`idx_agent_session_nodes_label`,`idx_agent_session_nodes_entry_not_valid`,`idx_agent_session_input_completions_session_key`,`idx_agent_conversation_deliveries_source_session`],optionalCanonicalTriggerGroups:[{tableName:`memory_index_chunks`,triggers:MEMORY_CHUNK_FTS_TRIGGER_DEFINITIONS},{tableName:MEMORY_INDEX_SOURCES_TABLE,triggers:MEMORY_PATH_FTS_TRIGGER_DEFINITIONS}]};
//!src/state/openclaw-agent-db-read-error.ts
const settledReadOpenFailures=resolveGlobalSingleton(Symbol.for(`openclaw.agentDatabaseSettledReadOpenFailures`),()=>/* @__PURE__ */ new WeakSet);
//!src/state/openclaw-agent-canonical-validation-schema.ts
const validatedSchemas=resolveGlobalSingleton(Symbol.for(`openclaw.agentCanonicalValidationSchemas`),()=>/* @__PURE__ */ new WeakMap);const expectedDefinitions=/* @__PURE__ */ new Map([[`session_canonical_validation_pending`,normalizeSchemaSql(extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL,`session_canonical_validation_pending`))]]);
//!src/state/openclaw-agent-db-validation-facts.ts
const agentDatabaseValidationKey={name:`agent.completed-validation`,lifetime:`process`,read(e){return isRecord(e)?e:void 0}};
//!src/state/openclaw-agent-db-validation-observation.ts
const validationObservations=resolveGlobalSingleton(Symbol.for(`openclaw.agentDatabaseValidationObservations`),()=>/* @__PURE__ */ new Map);function createAgentValidationObservation(e,t){function releaseValidationObservation(e){validationObservations.get(e)?.close()}function observeValidationPath(n,r){const i=validationObservations.get(n);if(i)return r?i.revalidate():i.ready;const revalidate=async()=>{const r=e(n);if(!r||Atomics.load(new Int32Array(r.valid),0)!==1)return;try{assertDatabaseFileIdentity(await stat(n,{bigint:true}),{key:`file:${r.identity}`,birthtime:r.birthtime})}catch{if(e(n)===r)t(n,r.identity)}};const a=observeOwnedDirectory(path.dirname(n),(e,t)=>{if(t===`change`&&e!==void 0)return;if(e===void 0||(process.platform===`win32`?e.toLowerCase()===path.basename(n).toLowerCase():e===path.basename(n)))revalidate()});const o=revalidate();validationObservations.set(n,{revalidate,ready:o,close(){a.close();validationObservations.delete(n)}});return o.finally(()=>{const e=validationObservations.get(n);if(e?.ready===o)delete e.ready})}return{observe:observeValidationPath,release:releaseValidationObservation}}
//!src/state/openclaw-agent-db-validation-cache.ts
const validatedPaths=resolveGlobalSingleton(Symbol.for(`openclaw.agentDatabaseValidatedPaths`),()=>/* @__PURE__ */ new Map,()=>clearOpenClawAgentDatabaseValidationCache());const validationObservation=createAgentValidationObservation(e=>validatedPaths.get(e)?.validation,invalidatePathValidation);const validationBindings=resolveGlobalSingleton(Symbol.for(`openclaw.agentDatabaseValidationBindings`),()=>/* @__PURE__ */ new WeakMap);function invalidateOpenClawAgentDatabaseValidation(e,t){invalidatePathValidation(typeof e===`string`?resolveDatabasePathKey(e):e.canonicalPath,t)}function invalidatePathValidation(e,t=validatedPaths.get(e)?.validation?.identity){const n=/* @__PURE__ */ new Set([e]);if(t){for(const[e,r]of validatedPaths)if(r.validation?.identity===t)n.add(e)}for(const e of n){validationObservation.release(e);const t=validatedPaths.get(e);const n=t?.validation;if(n)Atomics.store(new Int32Array(n.valid),0,0);validatedPaths.set(e,{agentId:t?.agentId,validation:n,integrityVerified:false,revoked:true})}}function clearOpenClawAgentDatabaseValidationCache(e){const t=e===void 0?void 0:resolveDatabasePathKey(e);for(const e of validatedPaths.keys())if(t===void 0||isPathInside(t,e)){invalidateOpenClawAgentDatabaseValidation(e);validatedPaths.delete(e)}}
//!src/state/openclaw-agent-board-schema.ts
const ensureBoardTables=createSqliteSchemaEnsurer(()=>OPENCLAW_AGENT_BOARD_SCHEMA_SQL,{tables:[`board_tabs`,`board_widgets`],indexes:[`idx_agent_board_widgets_tab_position`]});
//!src/state/openclaw-agent-session-participants-schema.ts
const ensureNativeSessionParticipantsSchema=createSqliteSchemaEnsurer(sessionParticipantsSchemaSql,{tables:[SESSION_PARTICIPANTS_TABLE]});export{readRetainedAgentDeletionsFromDatabase as i,agentDatabaseValidationKey as n,readAgentDatabaseDeletionSnapshot as r,invalidateOpenClawAgentDatabaseValidation as t};