import{a as tableExists,n as ensureColumn}from"./openclaw-state-db-schema-helpers-4Hs1ye38.mjs";import{n as AGENT_JSON_PREDICATE_COLUMNS,r as AGENT_JSON_PREDICATE_COLUMN_DECLARATIONS}from"./openclaw-agent-progress-card-schema-BkcfBjRI.mjs";
//!src/state/openclaw-agent-json-predicate-schema.ts
function migrateAgentJsonPredicatesInTransaction(e){ensureColumn(e,`session_nodes`,`session_started_at INTEGER`);ensureColumn(e,`session_nodes`,`has_optional_references INTEGER NOT NULL DEFAULT 0`);e.exec(`
    UPDATE session_nodes SET
      session_started_at = CASE WHEN json_valid(entry_json)
        THEN CAST(json_extract(entry_json, '$.sessionStartedAt') AS INTEGER) END,
      has_optional_references = CASE WHEN NOT json_valid(entry_json) OR instr(entry_json, char(0)) > 0 THEN 1
        WHEN json_type(entry_json, '$.previousSessionId') IS NOT NULL
          OR json_type(entry_json, '$.usageFamilySessionIds') IS NOT NULL
          OR json_type(entry_json, '$.compactionCheckpoints') IS NOT NULL THEN 1
        ELSE 0 END;
  `);if(tableExists(e,`context_engine_turn_outbox`)){ensureColumn(e,`context_engine_turn_outbox`,`payload_state TEXT`);e.exec(`
      UPDATE context_engine_turn_outbox SET payload_state = CASE
        WHEN json_valid(payload_json) THEN CASE
          WHEN json_type(payload_json, '$.state') = 'text'
          THEN json_extract(payload_json, '$.state') END END;
    `)}for(const t of AGENT_JSON_PREDICATE_COLUMNS.transcript_events)ensureColumn(e,`transcript_events`,`${t} ${AGENT_JSON_PREDICATE_COLUMN_DECLARATIONS[t]}`)}export{migrateAgentJsonPredicatesInTransaction as t};