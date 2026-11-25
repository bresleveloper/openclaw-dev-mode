import{wt as parseSqliteTableDefinition}from"./sqlite-database-admission-BVeAafOy.mjs";import{c as normalizeSqlWhitespace,t as extractSqliteTableSchema}from"./sqlite-schema-sql-XrfUK8rp.mjs";import{t as OPENCLAW_AGENT_SCHEMA_SQL}from"./openclaw-agent-schema-BhcrjAJt.mjs";import{_ as captureSqliteSchemaFacts}from"./sqlite-schema-facts-Edd-ttp_.mjs";import{i as replaceSqliteTableDefinition}from"./sqlite-schema-catalog-CLvN7hW4.mjs";
//!src/state/openclaw-agent-active-event-facts-schema.ts
const AGENT_ACTIVE_EVENT_FACTS_SQL=extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL,`session_transcript_active_event_facts`,{endMarker:`-- END ACTIVE EVENT FACTS`,includeEndMarker:false});function withoutAgentActiveEventFacts(e){return e.replace(`${AGENT_ACTIVE_EVENT_FACTS_SQL}-- END ACTIVE EVENT FACTS\n\n`,``)}const postgresObjects$1=/CREATE TABLE "session_transcript_active_event_facts" \([\s\S]*?\n\);|ALTER TABLE "session_transcript_active_event_facts"[^;]+;/gu;function withoutAgentPostgresActiveEventFacts(e){return e.replace(new RegExp(`(?:${postgresObjects$1.source})\\n\\n`,`gu`),``)}function agentActiveEventFactsPostgresMigration(e){const t=e.match(postgresObjects$1);if(t?.length!==2)throw new Error(`Active event facts table or foreign key is missing`);return t.join(`

`)}
//!src/state/openclaw-agent-cold-archive-chunks-schema.ts
const AGENT_COLD_ARCHIVE_CHUNKS_SQL=extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL,`session_transcript_cold_archive_chunks`);function withoutAgentColdArchiveChunks(e){return e.replace(`${AGENT_COLD_ARCHIVE_CHUNKS_SQL}\n\n`,``)}function withoutAgentPostgresColdArchiveChunks(e){return e.replace(/CREATE TABLE "session_transcript_cold_archive_chunks" \([\s\S]*?\n\);\n\n/gu,``).replace(/ALTER TABLE "session_transcript_cold_archive_chunks" [^\n]+\n\n/gu,``)}function agentColdArchiveChunksPostgresMigration(e){return(e.match(/CREATE TABLE "session_transcript_cold_archive_chunks" \([\s\S]*?\n\);|ALTER TABLE "session_transcript_cold_archive_chunks" [^\n]+/gu)??[]).join(`

`)}
//!src/state/openclaw-agent-cold-navigation-schema.ts
function withoutAgentColdNavigation(e){return e.replace(/\s+OR \(\s+event_json IS NULL AND event_zstd IS NULL\s+AND event_utf8_bytes IS NOT NULL\s+AND event_utf8_bytes BETWEEN 1 AND 4194304\s+AND navigation_json IS NOT NULL\s+\)/u,``)}function withoutAgentPostgresColdNavigation(e){return e.replace(` OR ("event_json" IS NULL AND "event_zstd" IS NULL AND "event_utf8_bytes" IS NOT NULL AND ("event_utf8_bytes" BETWEEN 1 AND 4194304) AND "navigation_json" IS NOT NULL)`,``)}function agentColdNavigationPostgresMigration(e){const t=e.match(/ {2}CHECK \([^\n]*"event_zstd" IS NOT NULL[^\n]+/u)?.[0];if(!t)throw new Error(`Cold navigation payload constraint is missing`);return`ALTER TABLE "transcript_events" DROP CONSTRAINT "transcript_events_check";
    ALTER TABLE "transcript_events" ADD CONSTRAINT "transcript_events_check" ${t.trim().replace(/,$/u,``)};`}function migrateAgentColdNavigationInTransaction(e){const t=`transcript_events`;const n=captureSqliteSchemaFacts(e).tableSql.get(t);if(!n)throw new Error(`Cold navigation migration requires the transcript table`);const r=extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL,t);const i=parseSqliteTableDefinition(r,t).constraints.find(e=>e.includes(`event_zstd IS NOT NULL`));if(!i)throw new Error(`Cold navigation payload constraint is missing`);const a=withoutAgentColdNavigation(i);const o=normalizeSqlWhitespace(n);if(o.includes(i))return;if(!o.includes(a))throw new Error(`Cold navigation migration cannot identify the prior payload constraint`);const s=o.replace(/^CREATE TABLE (?:IF NOT EXISTS )?(?:"transcript_events"|transcript_events)/u,`CREATE TABLE "transcript_events"`).replace(a,i);replaceSqliteTableDefinition(e,t,s)}
//!src/state/openclaw-agent-creation-operations-schema.ts
const SESSION_CREATION_OPERATIONS_TABLE=`session_creation_operations`;const AGENT_CREATION_OPERATIONS_SQL=extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL,SESSION_CREATION_OPERATIONS_TABLE,{endMarker:`-- END SESSION CREATION OPERATIONS`,includeEndMarker:false});function withoutAgentCreationOperations(e){return e.replace(`${AGENT_CREATION_OPERATIONS_SQL}-- END SESSION CREATION OPERATIONS\n\n`,``)}const postgresObjects=/CREATE TABLE "session_creation_operations" \([\s\S]*?\n\);|CREATE INDEX "idx_agent_(?:session_creation_operations_expiry|session_input_completions_session_key|conversation_deliveries_source_session)"[^;]+;/gu;function withoutAgentPostgresCreationOperations(e){return e.replace(new RegExp(`(?:${postgresObjects.source})\\n\\n`,`gu`),``)}function agentCreationOperationsPostgresMigration(e){const t=e.match(postgresObjects);if(t?.length!==4)throw new Error(`Session creation receipt table or schema-40 index is missing`);return t.join(`

`)}
//!src/state/openclaw-agent-index-retirement-migration.ts
function withLegacyAgentIndexes(e){return e.replace(`CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_label`,`CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_last_interaction_at
  ON session_nodes(last_interaction_at DESC, session_key);

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_label`).replace(`CREATE TABLE IF NOT EXISTS board_tabs (`,`CREATE INDEX IF NOT EXISTS idx_agent_session_reactions_message
  ON session_reactions(session_key, session_id, message_id);

CREATE TABLE IF NOT EXISTS board_tabs (`)}function withLegacyAgentPostgresIndexes(e){return`${e}
    ALTER FUNCTION openclaw_transcript_navigation_check(text)
      CALLED ON NULL INPUT RESET search_path;
    CREATE INDEX "idx_agent_session_nodes_last_interaction_at"
      ON "session_nodes" (("last_interaction_at") DESC NULLS LAST,
        ("session_key") ASC NULLS FIRST);
    CREATE INDEX "idx_agent_session_reactions_message"
      ON "session_reactions" (("session_key") ASC NULLS FIRST,
        ("session_id") ASC NULLS FIRST, ("message_id") ASC NULLS FIRST);
  `}const AGENT_INDEX_RETIREMENT_SQL=`
  DROP INDEX IF EXISTS idx_agent_session_nodes_last_interaction_at;
  DROP INDEX IF EXISTS idx_agent_session_reactions_message;
`;
//!src/state/openclaw-agent-memory-revision-migration.ts
const revisionTables=[`memory_index_sources`,`memory_index_chunks`];const revisionEvents=[`insert`,`update`,`delete`];const LEGACY_MEMORY_REVISION_SQLITE_TRIGGERS=revisionTables.flatMap(e=>revisionEvents.map(t=>({name:`${e}_revision_after_${t}`,table:e,sql:`CREATE TRIGGER IF NOT EXISTS ${e}_revision_after_${t}
AFTER ${t.toUpperCase()} ON ${e}
BEGIN
  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;
END;`})));const LEGACY_MEMORY_REVISION_TRIGGER_NAMES=LEGACY_MEMORY_REVISION_SQLITE_TRIGGERS.map(e=>e.name);function withLegacyAgentMemoryRevisionTriggers(e){const t=LEGACY_MEMORY_REVISION_SQLITE_TRIGGERS.map(e=>e.sql).join(`

`);return e.replace(`CREATE INDEX IF NOT EXISTS idx_memory_embedding_cache_updated_at`,`${t}\n\nCREATE INDEX IF NOT EXISTS idx_memory_embedding_cache_updated_at`)}function withLegacyAgentPostgresMemoryRevisionTriggers(e){return`${e}\n${revisionTables.map(e=>`CREATE FUNCTION "openclaw_${e}_trigger"() RETURNS trigger LANGUAGE plpgsql SET search_path FROM CURRENT AS $trigger$
BEGIN
  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;
  RETURN NULL;
END;
$trigger$;
${revisionEvents.map(t=>`CREATE TRIGGER "${e}_revision_after_${t}" AFTER ${t.toUpperCase()} ON "${e}" FOR EACH ROW EXECUTE FUNCTION "openclaw_${e}_trigger"();`).join(`
`)}`).join(`

`)}`}const AGENT_MEMORY_REVISION_SQL=revisionTables.flatMap(e=>revisionEvents.map(t=>`DROP TRIGGER IF EXISTS ${e}_revision_after_${t};`)).join(`
`);const AGENT_MEMORY_REVISION_POSTGRES_SQL=revisionTables.map(e=>`${revisionEvents.map(t=>`DROP TRIGGER IF EXISTS ${e}_revision_after_${t} ON ${e};`).join(`
`)}
DROP FUNCTION IF EXISTS openclaw_${e}_trigger();`).join(`
`);
//!src/state/openclaw-agent-tool-usage-schema.ts
const AGENT_TOOL_USAGE_SQL=extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL,`agent_tool_usage`,{endMarker:`-- END AGENT TOOL USAGE`,includeEndMarker:false});function withoutAgentToolUsage(e){return e.replace(`${AGENT_TOOL_USAGE_SQL}-- END AGENT TOOL USAGE\n\n`,``)}const postgresTable=/CREATE TABLE "agent_tool_usage" \([\s\S]*?\n\);/u;function withoutAgentPostgresToolUsage(e){return e.replace(new RegExp(`${postgresTable.source}\\n\\n`,`u`),``)}function agentToolUsagePostgresMigration(e){const t=e.match(postgresTable)?.[0];if(!t)throw new Error(`Agent tool usage table is missing`);return t}
//!src/state/openclaw-agent-trajectory-storage-migration.ts
function withoutTrajectoryPayloadColumns(e){return e.replace(`  event_utf8_bytes INTEGER,
  event_payload BLOB,
  event_codec TEXT,
`,``).replace(`COALESCE(event_utf8_bytes, octet_length(event_json))`,`octet_length(event_json)`)}function withLegacyAgentPostgresTrajectoryStorage(e){return e.replace(`  "event_utf8_bytes" bigint,
  "event_payload" bytea,
  "event_codec" text COLLATE "C",
`,``).replaceAll(`coalesce("event_utf8_bytes", octet_length("event_json"))`,`octet_length("event_json")`)}const AGENT_TRAJECTORY_STORAGE_POSTGRES_MIGRATION_SQL=`
  ALTER TABLE "trajectory_runtime_events" ADD COLUMN "event_utf8_bytes" bigint;
  ALTER TABLE "trajectory_runtime_events" ADD COLUMN "event_payload" bytea;
  ALTER TABLE "trajectory_runtime_events" ADD COLUMN "event_codec" text COLLATE "C";
  DROP INDEX "idx_agent_trajectory_runtime_run";
  CREATE INDEX "idx_agent_trajectory_runtime_run"
    ON "trajectory_runtime_events" (("session_id") ASC NULLS FIRST,
      ("run_id") ASC NULLS FIRST, ("created_at") ASC NULLS FIRST,
      (COALESCE("event_utf8_bytes", octet_length("event_json"))) ASC NULLS FIRST);
`;function migrateAgentTrajectoryStorageInTransaction(e){e.exec(`
    ALTER TABLE trajectory_runtime_events ADD COLUMN event_utf8_bytes INTEGER;
    ALTER TABLE trajectory_runtime_events ADD COLUMN event_payload BLOB;
    ALTER TABLE trajectory_runtime_events ADD COLUMN event_codec TEXT;
    DROP INDEX idx_agent_trajectory_runtime_run;
    CREATE INDEX idx_agent_trajectory_runtime_run
      ON trajectory_runtime_events(session_id, run_id, created_at,
        COALESCE(event_utf8_bytes, octet_length(event_json)));
  `)}export{withoutAgentPostgresColdArchiveChunks as A,agentColdNavigationPostgresMigration as C,AGENT_COLD_ARCHIVE_CHUNKS_SQL as D,withoutAgentPostgresColdNavigation as E,agentActiveEventFactsPostgresMigration as M,withoutAgentActiveEventFacts as N,agentColdArchiveChunksPostgresMigration as O,withoutAgentPostgresActiveEventFacts as P,withoutAgentPostgresCreationOperations as S,withoutAgentColdNavigation as T,withLegacyAgentPostgresIndexes as _,AGENT_TOOL_USAGE_SQL as a,agentCreationOperationsPostgresMigration as b,withoutAgentToolUsage as c,LEGACY_MEMORY_REVISION_SQLITE_TRIGGERS as d,LEGACY_MEMORY_REVISION_TRIGGER_NAMES as f,withLegacyAgentIndexes as g,AGENT_INDEX_RETIREMENT_SQL as h,withoutTrajectoryPayloadColumns as i,AGENT_ACTIVE_EVENT_FACTS_SQL as j,withoutAgentColdArchiveChunks as k,AGENT_MEMORY_REVISION_POSTGRES_SQL as l,withLegacyAgentPostgresMemoryRevisionTriggers as m,migrateAgentTrajectoryStorageInTransaction as n,agentToolUsagePostgresMigration as o,withLegacyAgentMemoryRevisionTriggers as p,withLegacyAgentPostgresTrajectoryStorage as r,withoutAgentPostgresToolUsage as s,AGENT_TRAJECTORY_STORAGE_POSTGRES_MIGRATION_SQL as t,AGENT_MEMORY_REVISION_SQL as u,AGENT_CREATION_OPERATIONS_SQL as v,migrateAgentColdNavigationInTransaction as w,withoutAgentCreationOperations as x,SESSION_CREATION_OPERATIONS_TABLE as y};