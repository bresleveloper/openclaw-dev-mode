import{n as e}from"./worker-chunk-Du4wjDfF.mjs";import{n as t,t as n}from"./worker-chunk-BRKmeGPN.mjs";function withLegacyAgentPostgresWriteLayout(e){return`${e}
    DROP INDEX "idx_agent_session_windows_conversation";
    CREATE INDEX "idx_agent_session_windows_conversation"
      ON "session_windows" (("primary_conversation_id") ASC NULLS FIRST,
        ("updated_at") DESC NULLS LAST, ("session_id") ASC NULLS FIRST)
      WHERE "primary_conversation_id" IS NOT NULL;
    CREATE INDEX "idx_agent_transcript_event_parent"
      ON "transcript_event_identities" (("session_id") ASC NULLS FIRST,
        ("parent_id") ASC NULLS FIRST)
      WHERE "parent_id" IS NOT NULL;
  `}function migrateAgentWriteLayoutInTransaction(e){e.exec(`
    DROP INDEX IF EXISTS idx_agent_transcript_event_parent;
    DROP INDEX IF EXISTS idx_agent_session_windows_conversation;
    CREATE INDEX idx_agent_session_windows_conversation
      ON session_windows(primary_conversation_id)
      WHERE primary_conversation_id IS NOT NULL;
  `),t(e,`memory_entry_origins`)}var r,i=e((()=>{n(),r=`
  DROP INDEX "idx_agent_transcript_event_parent";
  DROP INDEX "idx_agent_session_windows_conversation";
  CREATE INDEX "idx_agent_session_windows_conversation"
    ON "session_windows" (("primary_conversation_id") ASC NULLS FIRST)
    WHERE "primary_conversation_id" IS NOT NULL;
`}));export{withLegacyAgentPostgresWriteLayout as i,i as n,migrateAgentWriteLayoutInTransaction as r,r as t};