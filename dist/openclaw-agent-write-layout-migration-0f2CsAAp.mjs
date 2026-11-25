import{t as migrateSqliteTableWithoutRowid}from"./sqlite-table-layout-migration-BK7UdKNY.mjs";
//!src/state/openclaw-agent-write-layout-migration.ts
function withLegacyAgentPostgresWriteLayout(e){return`${e}
    DROP INDEX "idx_agent_session_windows_conversation";
    CREATE INDEX "idx_agent_session_windows_conversation"
      ON "session_windows" (("primary_conversation_id") ASC NULLS FIRST,
        ("updated_at") DESC NULLS LAST, ("session_id") ASC NULLS FIRST)
      WHERE "primary_conversation_id" IS NOT NULL;
    CREATE INDEX "idx_agent_transcript_event_parent"
      ON "transcript_event_identities" (("session_id") ASC NULLS FIRST,
        ("parent_id") ASC NULLS FIRST)
      WHERE "parent_id" IS NOT NULL;
  `}const AGENT_WRITE_LAYOUT_POSTGRES_MIGRATION_SQL=`
  DROP INDEX "idx_agent_transcript_event_parent";
  DROP INDEX "idx_agent_session_windows_conversation";
  CREATE INDEX "idx_agent_session_windows_conversation"
    ON "session_windows" (("primary_conversation_id") ASC NULLS FIRST)
    WHERE "primary_conversation_id" IS NOT NULL;
`;function migrateAgentWriteLayoutInTransaction(e){e.exec(`
    DROP INDEX IF EXISTS idx_agent_transcript_event_parent;
    DROP INDEX IF EXISTS idx_agent_session_windows_conversation;
    CREATE INDEX idx_agent_session_windows_conversation
      ON session_windows(primary_conversation_id)
      WHERE primary_conversation_id IS NOT NULL;
  `);migrateSqliteTableWithoutRowid(e,`memory_entry_origins`)}export{migrateAgentWriteLayoutInTransaction as n,withLegacyAgentPostgresWriteLayout as r,AGENT_WRITE_LAYOUT_POSTGRES_MIGRATION_SQL as t};