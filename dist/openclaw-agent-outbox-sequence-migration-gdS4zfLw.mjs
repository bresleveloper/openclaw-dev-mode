import{t as extractSqliteTableSchema}from"./sqlite-schema-sql-XrfUK8rp.mjs";import{t as OPENCLAW_AGENT_SCHEMA_SQL}from"./openclaw-agent-schema-BhcrjAJt.mjs";import{_ as captureSqliteSchemaFacts,o as getAdmittedSqliteSchemaFacts}from"./sqlite-schema-facts-Edd-ttp_.mjs";import{a as tableExists,o as tableHasColumn}from"./openclaw-state-db-schema-helpers-4Hs1ye38.mjs";import"./openclaw-agent-progress-card-schema-BkcfBjRI.mjs";
//!src/state/openclaw-agent-outbox-sequence-migration.ts
function migrateOutboxEnqueueSequenceInTransaction(e){if(!tableExists(e,`context_engine_turn_outbox`)||tableHasColumn(e,`context_engine_turn_outbox`,`enqueue_sequence`))return null;const t=performance.now();const n=getAdmittedSqliteSchemaFacts(e)??captureSqliteSchemaFacts(e);const r=[...n.indexDefinitions.values(),...n.triggers.values()].filter(({table:e})=>e===`context_engine_turn_outbox`);const i=extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL,`context_engine_turn_outbox`);e.exec(`
    ${i.replace(`IF NOT EXISTS context_engine_turn_outbox`,`context_engine_turn_outbox_sequence_migration`)}
    INSERT INTO context_engine_turn_outbox_sequence_migration
      (enqueue_sequence, advancement_key, engine_id, owner_plugin_id, session_id,
       payload_json, payload_state, attempt_count, last_attempt_at, last_error, created_at)
    SELECT rowid, advancement_key, engine_id, owner_plugin_id, session_id,
       payload_json, payload_state, attempt_count, last_attempt_at, last_error, created_at
    FROM context_engine_turn_outbox;
    DROP TABLE context_engine_turn_outbox;
    ALTER TABLE context_engine_turn_outbox_sequence_migration RENAME TO context_engine_turn_outbox;
  `);for(const t of r)if(t.sql!==null)e.exec(t.sql);return performance.now()-t}export{migrateOutboxEnqueueSequenceInTransaction as t};