import{$ as e,_t as t}from"./transcript-sqlite-database-admission-5Zju-fzc.mjs";import{s as n,t as r}from"./transcript-sqlite-schema-sql-BnVx4b5A.mjs";import{h as i}from"./transcript-sqlite-schema-facts-B1OszW_q.mjs";import{r as a}from"./transcript-sqlite-schema-catalog-D96ihGg7.mjs";import"./transcript-worker-pool-sizing-Bbr_YJuw.mjs";const o=`session_participants`,s=r(e,`session_transcript_active_event_facts`,{endMarker:`-- END ACTIVE EVENT FACTS`,includeEndMarker:!1});function withoutAgentActiveEventFacts(e){return e.replace(`${s}-- END ACTIVE EVENT FACTS\n\n`,``)}const c=/CREATE TABLE "session_transcript_active_event_facts" \([\s\S]*?\n\);|ALTER TABLE "session_transcript_active_event_facts"[^;]+;/gu;function withoutAgentPostgresActiveEventFacts(e){return e.replace(RegExp(`(?:${c.source})\\n\\n`,`gu`),``)}function agentActiveEventFactsPostgresMigration(e){let t=e.match(c);if(t?.length!==2)throw Error(`Active event facts table or foreign key is missing`);return t.join(`

`)}const l=r(e,`session_transcript_cold_archive_chunks`);function withoutAgentColdArchiveChunks(e){return e.replace(`${l}\n\n`,``)}function withoutAgentPostgresColdArchiveChunks(e){return e.replace(/CREATE TABLE "session_transcript_cold_archive_chunks" \([\s\S]*?\n\);\n\n/gu,``).replace(/ALTER TABLE "session_transcript_cold_archive_chunks" [^\n]+\n\n/gu,``)}function agentColdArchiveChunksPostgresMigration(e){return(e.match(/CREATE TABLE "session_transcript_cold_archive_chunks" \([\s\S]*?\n\);|ALTER TABLE "session_transcript_cold_archive_chunks" [^\n]+/gu)??[]).join(`

`)}function withoutAgentColdNavigation(e){return e.replace(/\s+OR \(\s+event_json IS NULL AND event_zstd IS NULL\s+AND event_utf8_bytes IS NOT NULL\s+AND event_utf8_bytes BETWEEN 1 AND 4194304\s+AND navigation_json IS NOT NULL\s+\)/u,``)}function withoutAgentPostgresColdNavigation(e){return e.replace(` OR ("event_json" IS NULL AND "event_zstd" IS NULL AND "event_utf8_bytes" IS NOT NULL AND ("event_utf8_bytes" BETWEEN 1 AND 4194304) AND "navigation_json" IS NOT NULL)`,``)}function agentColdNavigationPostgresMigration(e){let t=e.match(/ {2}CHECK \([^\n]*"event_zstd" IS NOT NULL[^\n]+/u)?.[0];if(!t)throw Error(`Cold navigation payload constraint is missing`);return`ALTER TABLE "transcript_events" DROP CONSTRAINT "transcript_events_check";
    ALTER TABLE "transcript_events" ADD CONSTRAINT "transcript_events_check" ${t.trim().replace(/,$/u,``)};`}function migrateAgentColdNavigationInTransaction(o){let s=`transcript_events`,c=i(o).tableSql.get(s);if(!c)throw Error(`Cold navigation migration requires the transcript table`);let l=r(e,s),u=t(l,s).constraints.find(e=>e.includes(`event_zstd IS NOT NULL`));if(!u)throw Error(`Cold navigation payload constraint is missing`);let d=withoutAgentColdNavigation(u),f=n(c);if(f.includes(u))return;if(!f.includes(d))throw Error(`Cold navigation migration cannot identify the prior payload constraint`);let p=f.replace(/^CREATE TABLE (?:IF NOT EXISTS )?(?:"transcript_events"|transcript_events)/u,`CREATE TABLE "transcript_events"`).replace(d,u);a(o,s,p)}const u=`session_creation_operations`,d=r(e,u,{endMarker:`-- END SESSION CREATION OPERATIONS`,includeEndMarker:!1});function withoutAgentCreationOperations(e){return e.replace(`${d}-- END SESSION CREATION OPERATIONS\n\n`,``)}const f=/CREATE TABLE "session_creation_operations" \([\s\S]*?\n\);|CREATE INDEX "idx_agent_(?:session_creation_operations_expiry|session_input_completions_session_key|conversation_deliveries_source_session)"[^;]+;/gu;function withoutAgentPostgresCreationOperations(e){return e.replace(RegExp(`(?:${f.source})\\n\\n`,`gu`),``)}function agentCreationOperationsPostgresMigration(e){let t=e.match(f);if(t?.length!==4)throw Error(`Session creation receipt table or schema-40 index is missing`);return t.join(`

`)}function withLegacyAgentIndexes(e){return e.replace(`CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_label`,`CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_last_interaction_at
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
  `}const p=`
  DROP INDEX IF EXISTS idx_agent_session_nodes_last_interaction_at;
  DROP INDEX IF EXISTS idx_agent_session_reactions_message;
`,m=[`memory_index_sources`,`memory_index_chunks`],h=[`insert`,`update`,`delete`],g=m.flatMap(e=>h.map(t=>({name:`${e}_revision_after_${t}`,table:e,sql:`CREATE TRIGGER IF NOT EXISTS ${e}_revision_after_${t}
AFTER ${t.toUpperCase()} ON ${e}
BEGIN
  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;
END;`})));g.map(e=>e.name);function withLegacyAgentMemoryRevisionTriggers(e){let t=g.map(e=>e.sql).join(`

`);return e.replace(`CREATE INDEX IF NOT EXISTS idx_memory_embedding_cache_updated_at`,`${t}\n\nCREATE INDEX IF NOT EXISTS idx_memory_embedding_cache_updated_at`)}function withLegacyAgentPostgresMemoryRevisionTriggers(e){return`${e}\n${m.map(e=>`CREATE FUNCTION "openclaw_${e}_trigger"() RETURNS trigger LANGUAGE plpgsql SET search_path FROM CURRENT AS $trigger$
BEGIN
  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;
  RETURN NULL;
END;
$trigger$;
${h.map(t=>`CREATE TRIGGER "${e}_revision_after_${t}" AFTER ${t.toUpperCase()} ON "${e}" FOR EACH ROW EXECUTE FUNCTION "openclaw_${e}_trigger"();`).join(`
`)}`).join(`

`)}`}const _=m.flatMap(e=>h.map(t=>`DROP TRIGGER IF EXISTS ${e}_revision_after_${t};`)).join(`
`),v=m.map(e=>`${h.map(t=>`DROP TRIGGER IF EXISTS ${e}_revision_after_${t} ON ${e};`).join(`
`)}
DROP FUNCTION IF EXISTS openclaw_${e}_trigger();`).join(`
`),y=r(e,`agent_tool_usage`,{endMarker:`-- END AGENT TOOL USAGE`,includeEndMarker:!1});function withoutAgentToolUsage(e){return e.replace(`${y}-- END AGENT TOOL USAGE\n\n`,``)}const b=/CREATE TABLE "agent_tool_usage" \([\s\S]*?\n\);/u;function withoutAgentPostgresToolUsage(e){return e.replace(RegExp(`${b.source}\\n\\n`,`u`),``)}function agentToolUsagePostgresMigration(e){let t=e.match(b)?.[0];if(!t)throw Error(`Agent tool usage table is missing`);return t}function withoutTrajectoryPayloadColumns(e){return e.replace(`  event_utf8_bytes INTEGER,
  event_payload BLOB,
  event_codec TEXT,
`,``).replace(`COALESCE(event_utf8_bytes, octet_length(event_json))`,`octet_length(event_json)`)}function withLegacyAgentPostgresTrajectoryStorage(e){return e.replace(`  "event_utf8_bytes" bigint,
  "event_payload" bytea,
  "event_codec" text COLLATE "C",
`,``).replaceAll(`coalesce("event_utf8_bytes", octet_length("event_json"))`,`octet_length("event_json")`)}const x=`
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
  `)}export{agentActiveEventFactsPostgresMigration as A,withoutAgentColdNavigation as C,withoutAgentColdArchiveChunks as D,agentColdArchiveChunksPostgresMigration as E,withoutAgentPostgresActiveEventFacts as M,o as N,withoutAgentPostgresColdArchiveChunks as O,migrateAgentColdNavigationInTransaction as S,l as T,u as _,y as a,withoutAgentPostgresCreationOperations as b,withoutAgentToolUsage as c,withLegacyAgentMemoryRevisionTriggers as d,withLegacyAgentPostgresMemoryRevisionTriggers as f,d as g,withLegacyAgentPostgresIndexes as h,withoutTrajectoryPayloadColumns as i,withoutAgentActiveEventFacts as j,s as k,v as l,withLegacyAgentIndexes as m,migrateAgentTrajectoryStorageInTransaction as n,agentToolUsagePostgresMigration as o,p,withLegacyAgentPostgresTrajectoryStorage as r,withoutAgentPostgresToolUsage as s,x as t,_ as u,agentCreationOperationsPostgresMigration as v,withoutAgentPostgresColdNavigation as w,agentColdNavigationPostgresMigration as x,withoutAgentCreationOperations as y};