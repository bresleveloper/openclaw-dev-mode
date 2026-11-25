import{n as isPostgresSqlConnection}from"./sql-connection-nx8lLUJM.mjs";import{t as extractSqliteTableSchema}from"./sqlite-schema-sql-XrfUK8rp.mjs";import{t as OPENCLAW_AGENT_SCHEMA_SQL}from"./openclaw-agent-schema-BhcrjAJt.mjs";import{a as tableExists}from"./openclaw-state-db-schema-helpers-4Hs1ye38.mjs";import{n as SESSION_PARTICIPANTS_TABLE}from"./openclaw-agent-db-contract-Cunt8iGM.mjs";import{N as withoutAgentActiveEventFacts,T as withoutAgentColdNavigation,c as withoutAgentToolUsage,g as withLegacyAgentIndexes,i as withoutTrajectoryPayloadColumns,k as withoutAgentColdArchiveChunks,p as withLegacyAgentMemoryRevisionTriggers,x as withoutAgentCreationOperations}from"./openclaw-agent-trajectory-storage-migration-BxFaVsT7.mjs";
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
`;function withLegacyCanonicalSessionValidationTriggers(e){return e.replace(`CREATE TABLE IF NOT EXISTS session_windows (`,`${LEGACY_ENTRY_VALIDITY_TRIGGERS_SQL}\nCREATE TABLE IF NOT EXISTS session_windows (`).replace(`CREATE TABLE IF NOT EXISTS conversations (`,`${LEGACY_CANONICAL_PENDING_TRIGGERS_SQL}\nCREATE TABLE IF NOT EXISTS conversations (`)}const LEGACY_CANONICAL_VALIDATION_TRIGGER_NAMES=Object.freeze([...`${LEGACY_ENTRY_VALIDITY_TRIGGERS_SQL}\n${LEGACY_CANONICAL_PENDING_TRIGGERS_SQL}`.matchAll(/CREATE TRIGGER IF NOT EXISTS (\w+)/gu)].map(e=>e[1]));function canonicalSessionValidationSchemaSql(e=OPENCLAW_AGENT_SCHEMA_SQL){return extractSqliteTableSchema(e,`session_canonical_validation_pending`,{endMarker:`CREATE TABLE IF NOT EXISTS conversations (`,includeEndMarker:false})}function withoutCanonicalSessionValidationSchema(e){if(!e.includes(`CREATE TABLE IF NOT EXISTS session_canonical_validation_pending (`))return e;return e.replace(canonicalSessionValidationSchemaSql(e),``)}const AGENT_JSON_PREDICATE_COLUMNS={session_nodes:[`session_started_at`,`has_optional_references`],transcript_events:[`navigation_type`,`navigation_custom_type`,`navigation_display`,`message_role`,`navigation_last_type`,`navigation_last_custom_type`,`navigation_valid`],context_engine_turn_outbox:[`payload_state`]};const AGENT_JSON_PREDICATE_COLUMN_DECLARATIONS={session_started_at:`INTEGER`,has_optional_references:`INTEGER NOT NULL DEFAULT 0`,payload_state:`TEXT`,navigation_type:`TEXT`,navigation_custom_type:`TEXT`,navigation_display:`INTEGER NOT NULL DEFAULT 0`,message_role:`TEXT`,navigation_last_type:`TEXT`,navigation_last_custom_type:`TEXT`,navigation_valid:`INTEGER NOT NULL DEFAULT 1`};function withoutAgentJsonPredicateColumns(e){let t=e;for(const[e,n]of Object.entries(AGENT_JSON_PREDICATE_COLUMN_DECLARATIONS))t=t.replace(`  ${e} ${n},\n`,``);return t}const LEGACY_PARTICIPANTS_SCHEMA=`CREATE TABLE IF NOT EXISTS session_participants (
  session_key TEXT NOT NULL,
  actor_type TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  actor_source TEXT,
  contribution_count INTEGER,
  first_prompted_at INTEGER NOT NULL,
  last_prompted_at INTEGER NOT NULL,
  PRIMARY KEY (session_key, actor_type, actor_id),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
) STRICT;`;const LEGACY_PARTICIPANT_OPTIONAL_COLUMNS=[`session_participants.actor_source`,`session_participants.contribution_count`];function sessionParticipantsSchemaSql(){return extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL,SESSION_PARTICIPANTS_TABLE,{endMarker:`CREATE TABLE IF NOT EXISTS session_key_contract (`,includeEndMarker:false,errorMessage:`OpenClaw session participant schema markers are missing.`})}function withLegacySessionParticipantsSchema(e){return withoutCanonicalSessionValidationSchema(e).replace(sessionParticipantsSchemaSql().trim(),LEGACY_PARTICIPANTS_SCHEMA)}const RETIRED_AGENT_STATE_LEASE_SCHEMA_SQL=`
CREATE TABLE state_leases (
  scope TEXT NOT NULL,
  lease_key TEXT NOT NULL,
  owner TEXT NOT NULL,
  expires_at INTEGER,
  heartbeat_at INTEGER,
  payload_json TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (scope, lease_key)
) STRICT;
`;function withoutOutboxEnqueueSequence(e){return e.replace(`  enqueue_sequence INTEGER PRIMARY KEY,
  advancement_key TEXT NOT NULL UNIQUE,`,`  advancement_key TEXT NOT NULL PRIMARY KEY,`)}const LEGACY_PARENT_INDEX=`CREATE INDEX IF NOT EXISTS idx_agent_transcript_event_parent
  ON transcript_event_identities(session_id, parent_id)
  WHERE parent_id IS NOT NULL;

`;function withLegacyAgentWriteLayout(e){return e.replace(/(CREATE TABLE IF NOT EXISTS memory_entry_origins \([\s\S]*?\n\) STRICT), WITHOUT ROWID;/u,`$1;`).replace(`ON session_windows(primary_conversation_id)`,`ON session_windows(primary_conversation_id, updated_at DESC, session_id)`).replace(`CREATE INDEX IF NOT EXISTS idx_agent_transcript_event_sequence`,`${LEGACY_PARENT_INDEX}CREATE INDEX IF NOT EXISTS idx_agent_transcript_event_sequence`)}const AGENT_SCHEMA_BEFORE_TOOL_USAGE=withoutAgentToolUsage(OPENCLAW_AGENT_SCHEMA_SQL);const AGENT_SCHEMA_BEFORE_ACTIVE_EVENT_FACTS=withoutAgentActiveEventFacts(AGENT_SCHEMA_BEFORE_TOOL_USAGE);const AGENT_SCHEMA_BEFORE_CREATION_OPERATIONS=withoutAgentCreationOperations(AGENT_SCHEMA_BEFORE_ACTIVE_EVENT_FACTS);const AGENT_SCHEMA_BEFORE_SESSION_DELETION_INDEXES=AGENT_SCHEMA_BEFORE_CREATION_OPERATIONS.replace(/\nCREATE INDEX IF NOT EXISTS idx_agent_(?:session_input_completions_session_key|conversation_deliveries_source_session)\b[^;]*;\n/gu,``);function getOpenClawAgentMigrationSchema(e){const t=e<39?AGENT_SCHEMA_BEFORE_SESSION_DELETION_INDEXES:e<40?AGENT_SCHEMA_BEFORE_CREATION_OPERATIONS:e<41?AGENT_SCHEMA_BEFORE_ACTIVE_EVENT_FACTS:e<42?AGENT_SCHEMA_BEFORE_TOOL_USAGE:OPENCLAW_AGENT_SCHEMA_SQL;const n=e<39?withoutAgentColdNavigation(t):t;const r=e<37?withoutAgentColdArchiveChunks(n):n;const i=e<31?withLegacyAgentMemoryRevisionTriggers(r):r;const a=e<30?withoutTrajectoryPayloadColumns(i):i;const o=e<29?withLegacyAgentIndexes(a):a;const s=e<28?withLegacyAgentWriteLayout(o):o;const c=e<27?withoutOutboxEnqueueSequence(s):s;const l=e<26?withoutAgentJsonPredicateColumns(c):c;const u=e<25?withLegacyCanonicalSessionValidationTriggers(l):l;const d=e<24?withoutSessionEntrySnapshotsSchema(u):u;const f=e<23?withLegacyAgentStorageSchema(d,e):d;return e<18?withLegacySessionParticipantsSchema(f):e<21?withoutCanonicalSessionValidationSchema(f):f}const OPENCLAW_AGENT_BOARD_SCHEMA_SQL=extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL,`board_tabs`,{endMarker:`CREATE TABLE IF NOT EXISTS session_progress_cards (`,includeEndMarker:false,errorMessage:`OpenClaw agent board schema markers are missing from the canonical schema.`});const AGENT_V14_BOARD_SCHEMA_SQL=OPENCLAW_AGENT_BOARD_SCHEMA_SQL;const OPENCLAW_AGENT_SCHEMA_WITHOUT_BOARD_SQL=withLegacyAgentIndexes(withoutTrajectoryPayloadColumns(withLegacyAgentMemoryRevisionTriggers(withoutAgentColdArchiveChunks(AGENT_SCHEMA_BEFORE_SESSION_DELETION_INDEXES)))).replace(OPENCLAW_AGENT_BOARD_SCHEMA_SQL,``);const SESSION_PROGRESS_CARDS_TABLE=`session_progress_cards`;const AGENT_PROGRESS_CARD_SCHEMA_SQL=extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_WITHOUT_BOARD_SQL,SESSION_PROGRESS_CARDS_TABLE,{endMarker:`CREATE TABLE IF NOT EXISTS heartbeat_outcomes (`,includeEndMarker:false,errorMessage:`OpenClaw agent progress-card schema markers are missing.`});const AGENT_SCHEMA_WITHOUT_PROGRESS_CARD_SQL=OPENCLAW_AGENT_SCHEMA_WITHOUT_BOARD_SQL.replace(AGENT_PROGRESS_CARD_SCHEMA_SQL,``);const SUGGESTIONS_SCHEMA_START=`CREATE TABLE IF NOT EXISTS session_suggestions (`;const sessionSharingSchema=extractSqliteTableSchema(AGENT_SCHEMA_WITHOUT_PROGRESS_CARD_SQL,`session_members`,{endMarker:`CREATE TABLE IF NOT EXISTS heartbeat_outcomes (`,includeEndMarker:false,errorMessage:`OpenClaw agent session-sharing schema markers are missing.`});const sessionSuggestionsStart=sessionSharingSchema.indexOf(SUGGESTIONS_SCHEMA_START);if(sessionSuggestionsStart===-1)throw new Error(`OpenClaw agent session-suggestions schema marker is missing.`);const AGENT_V14_SESSION_SHARING_SCHEMA_SQL=sessionSharingSchema.slice(0,sessionSuggestionsStart);const AGENT_V14_ADDITIVE_SCHEMA_SQL=sessionSharingSchema.slice(sessionSuggestionsStart);const AGENT_V14_CORE_SCHEMA_SQL=withLegacySessionParticipantsSchema(withLegacyAgentStorageSchema(withLegacyCanonicalSessionValidationTriggers(withoutAgentJsonPredicateColumns(withoutOutboxEnqueueSequence(withLegacyAgentWriteLayout(AGENT_SCHEMA_WITHOUT_PROGRESS_CARD_SQL.replace(sessionSharingSchema,``)))))));
//!src/state/openclaw-agent-progress-card-schema.ts
function ensureOpenClawAgentProgressCardSchemaInTransaction(e){if(!e.isTransaction)throw new Error(`progress-card schema ensure requires an active transaction`);if(isPostgresSqlConnection(e)||tableExists(e,`session_progress_cards`))return;e.exec(AGENT_PROGRESS_CARD_SCHEMA_SQL)}export{withoutSessionEntrySnapshotsSchema as C,sessionEntrySnapshotsSchemaSql as S,getOpenClawAgentMigrationSchema as _,AGENT_V14_ADDITIVE_SCHEMA_SQL as a,withLegacyAgentStorageSchema as b,AGENT_V14_SESSION_SHARING_SCHEMA_SQL as c,LEGACY_PARTICIPANTS_SCHEMA as d,LEGACY_PARTICIPANT_OPTIONAL_COLUMNS as f,canonicalSessionValidationSchemaSql as g,SESSION_PROGRESS_CARDS_TABLE as h,AGENT_PROGRESS_CARD_SCHEMA_SQL as i,LEGACY_CANONICAL_VALIDATION_TRIGGER_NAMES as l,RETIRED_AGENT_STATE_LEASE_SCHEMA_SQL as m,AGENT_JSON_PREDICATE_COLUMNS as n,AGENT_V14_BOARD_SCHEMA_SQL as o,OPENCLAW_AGENT_BOARD_SCHEMA_SQL as p,AGENT_JSON_PREDICATE_COLUMN_DECLARATIONS as r,AGENT_V14_CORE_SCHEMA_SQL as s,ensureOpenClawAgentProgressCardSchemaInTransaction as t,LEGACY_ENTRY_VALIDITY_TRIGGERS_SQL as u,sessionParticipantsSchemaSql as v,DEPLOYED_FTS_ROWS_SCHEMA as x,withoutOutboxEnqueueSequence as y};