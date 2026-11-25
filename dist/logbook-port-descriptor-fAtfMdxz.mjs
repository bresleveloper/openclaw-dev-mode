import{n as expectedPostgresCatalog}from"./postgres-catalog-DLo1qY5z.mjs";import{n as loadBundledPluginPublicArtifactModuleSync}from"./public-surface-loader-BfDPD6QJ.mjs";import{t as DatabasePortDataError}from"./postgres-store-metadata-BAneIabP.mjs";import"./port-descriptor-DhuAPrkv.mjs";import{t as historicalIndexOrderingPort}from"./historical-index-ordering-port-BZqQjHGy.mjs";
//!src/infra/database-engine/logbook-port.generated.json
var logbook_port_generated_default={id:`logbook`,version:3,minimumPostgresVersion:16,schema:``,sqlite:`
CREATE TABLE IF NOT EXISTS batches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day TEXT NOT NULL,
  start_ms INTEGER NOT NULL,
  end_ms INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'done', 'error')),
  error TEXT,
  frame_count INTEGER NOT NULL DEFAULT 0,
  model TEXT,
  created_ms INTEGER NOT NULL,
  updated_ms INTEGER NOT NULL
) STRICT;
CREATE INDEX IF NOT EXISTS idx_logbook_batches_pending ON batches (start_ms, id) WHERE status = 'pending';
DROP INDEX IF EXISTS idx_logbook_batches_day;
CREATE TABLE IF NOT EXISTS frames (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  captured_at_ms INTEGER NOT NULL,
  day TEXT NOT NULL,
  path TEXT NOT NULL,
  screen_index INTEGER NOT NULL DEFAULT 0,
  width INTEGER,
  height INTEGER,
  byte_size INTEGER NOT NULL DEFAULT 0,
  content_hash TEXT NOT NULL,
  idle INTEGER NOT NULL DEFAULT 0 CHECK (idle IN (0, 1)),
  batch_id INTEGER REFERENCES batches(id) ON DELETE SET NULL
) STRICT;
CREATE INDEX IF NOT EXISTS idx_logbook_frames_day ON frames (day, captured_at_ms);
CREATE INDEX IF NOT EXISTS idx_logbook_frames_captured_at ON frames (captured_at_ms);
CREATE INDEX IF NOT EXISTS idx_logbook_frames_unbatched ON frames (batch_id) WHERE batch_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_logbook_frames_batch ON frames (batch_id, captured_at_ms) WHERE batch_id IS NOT NULL;
CREATE TABLE IF NOT EXISTS observations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  batch_id INTEGER NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  day TEXT NOT NULL,
  start_ms INTEGER NOT NULL,
  end_ms INTEGER NOT NULL,
  text TEXT NOT NULL
) STRICT;
CREATE INDEX IF NOT EXISTS idx_logbook_observations_day ON observations (day, start_ms);
CREATE INDEX IF NOT EXISTS idx_logbook_observations_batch ON observations (batch_id);
CREATE TABLE IF NOT EXISTS cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day TEXT NOT NULL,
  start_ms INTEGER NOT NULL,
  end_ms INTEGER NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'other',
  app_primary TEXT,
  app_secondary TEXT,
  distractions TEXT NOT NULL DEFAULT '[]',
  keyframe_id INTEGER REFERENCES frames(id) ON DELETE SET NULL,
  updated_ms INTEGER NOT NULL
) STRICT;
CREATE INDEX IF NOT EXISTS idx_logbook_cards_day ON cards (day, start_ms);
CREATE INDEX IF NOT EXISTS idx_logbook_cards_keyframe ON cards (keyframe_id) WHERE keyframe_id IS NOT NULL;
CREATE TABLE IF NOT EXISTS standups (
  day TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  updated_ms INTEGER NOT NULL
) STRICT;
`,tables:[{"name":`batches`,"columns":[{"name":`id`,"type":`bigint`,"nullable":false,"identity":true,"default":null},{"name":`day`,"type":`text`,"nullable":false,"identity":false,"default":null},{"name":`start_ms`,"type":`bigint`,"nullable":false,"identity":false,"default":null},{"name":`end_ms`,"type":`bigint`,"nullable":false,"identity":false,"default":null},{"name":`status`,"type":`text`,"nullable":false,"identity":false,"default":`'pending'`},{"name":`error`,"type":`text`,"nullable":true,"identity":false,"default":null},{"name":`frame_count`,"type":`bigint`,"nullable":false,"identity":false,"default":`0`},{"name":`model`,"type":`text`,"nullable":true,"identity":false,"default":null},{"name":`created_ms`,"type":`bigint`,"nullable":false,"identity":false,"default":null},{"name":`updated_ms`,"type":`bigint`,"nullable":false,"identity":false,"default":null}],"pk":[`id`],"unique":[],"foreignKeys":[],"indexes":2,"identities":[{"column":`id`,"autoIncrement":true}]},{"name":`cards`,"columns":[{"name":`id`,"type":`bigint`,"nullable":false,"identity":true,"default":null},{"name":`day`,"type":`text`,"nullable":false,"identity":false,"default":null},{"name":`start_ms`,"type":`bigint`,"nullable":false,"identity":false,"default":null},{"name":`end_ms`,"type":`bigint`,"nullable":false,"identity":false,"default":null},{"name":`title`,"type":`text`,"nullable":false,"identity":false,"default":null},{"name":`summary`,"type":`text`,"nullable":false,"identity":false,"default":null},{"name":`detail`,"type":`text`,"nullable":false,"identity":false,"default":`''`},{"name":`category`,"type":`text`,"nullable":false,"identity":false,"default":`'other'`},{"name":`app_primary`,"type":`text`,"nullable":true,"identity":false,"default":null},{"name":`app_secondary`,"type":`text`,"nullable":true,"identity":false,"default":null},{"name":`distractions`,"type":`text`,"nullable":false,"identity":false,"default":`'[]'`},{"name":`keyframe_id`,"type":`bigint`,"nullable":true,"identity":false,"default":null},{"name":`updated_ms`,"type":`bigint`,"nullable":false,"identity":false,"default":null}],"pk":[`id`],"unique":[],"foreignKeys":[{"columns":[`keyframe_id`],"target":`frames`,"targetColumns":[`id`],"onUpdate":`NO ACTION`,"onDelete":`SET NULL`,"deferrable":false,"deferred":false}],"indexes":3,"identities":[{"column":`id`,"autoIncrement":true}]},{"name":`frames`,"columns":[{"name":`id`,"type":`bigint`,"nullable":false,"identity":true,"default":null},{"name":`captured_at_ms`,"type":`bigint`,"nullable":false,"identity":false,"default":null},{"name":`day`,"type":`text`,"nullable":false,"identity":false,"default":null},{"name":`path`,"type":`text`,"nullable":false,"identity":false,"default":null},{"name":`screen_index`,"type":`bigint`,"nullable":false,"identity":false,"default":`0`},{"name":`width`,"type":`bigint`,"nullable":true,"identity":false,"default":null},{"name":`height`,"type":`bigint`,"nullable":true,"identity":false,"default":null},{"name":`byte_size`,"type":`bigint`,"nullable":false,"identity":false,"default":`0`},{"name":`content_hash`,"type":`text`,"nullable":false,"identity":false,"default":null},{"name":`idle`,"type":`bigint`,"nullable":false,"identity":false,"default":`0`},{"name":`batch_id`,"type":`bigint`,"nullable":true,"identity":false,"default":null}],"pk":[`id`],"unique":[],"foreignKeys":[{"columns":[`batch_id`],"target":`batches`,"targetColumns":[`id`],"onUpdate":`NO ACTION`,"onDelete":`SET NULL`,"deferrable":false,"deferred":false}],"indexes":5,"identities":[{"column":`id`,"autoIncrement":true}]},{"name":`observations`,"columns":[{"name":`id`,"type":`bigint`,"nullable":false,"identity":true,"default":null},{"name":`batch_id`,"type":`bigint`,"nullable":false,"identity":false,"default":null},{"name":`day`,"type":`text`,"nullable":false,"identity":false,"default":null},{"name":`start_ms`,"type":`bigint`,"nullable":false,"identity":false,"default":null},{"name":`end_ms`,"type":`bigint`,"nullable":false,"identity":false,"default":null},{"name":`text`,"type":`text`,"nullable":false,"identity":false,"default":null}],"pk":[`id`],"unique":[],"foreignKeys":[{"columns":[`batch_id`],"target":`batches`,"targetColumns":[`id`],"onUpdate":`NO ACTION`,"onDelete":`CASCADE`,"deferrable":false,"deferred":false}],"indexes":3,"identities":[{"column":`id`,"autoIncrement":true}]},{"name":`standups`,"columns":[{"name":`day`,"type":`text`,"nullable":false,"identity":false,"default":null},{"name":`text`,"type":`text`,"nullable":false,"identity":false,"default":null},{"name":`updated_ms`,"type":`bigint`,"nullable":false,"identity":false,"default":null}],"pk":[`day`],"unique":[],"foreignKeys":[],"indexes":1,"identities":[]}],objects:[{"table":`batches`,"kind":`check`,"sql":`("status" IN ('pending', 'running', 'done', 'error'))`},{"table":`frames`,"kind":`check`,"sql":`("idle" IN (0, 1))`}],triggers:[],preData:[0,2084],postData:[2084,3396]};
//!src/infra/database-engine/logbook-port-descriptor.ts
async function loadLogbookPortDescriptor(e=logbook_port_generated_default.version){if(e!==logbook_port_generated_default.version&&e!==1&&e!==2)throw new DatabasePortDataError(`Missing logbook PostgreSQL backup descriptor for version ${e}`);const t=api().postgresSchema;const n={...logbook_port_generated_default,preData:t.slice(logbook_port_generated_default.preData[0],logbook_port_generated_default.preData[1]),postData:t.slice(logbook_port_generated_default.postData[0],logbook_port_generated_default.postData[1]),expectedCatalog:expectedPostgresCatalog(logbook_port_generated_default),inspectSqliteSource(e){try{return api().inspectLogbookPortSource(e)}catch(e){if(e instanceof api().LogbookPortSchemaError)throw new DatabasePortDataError(e.message);throw e}},migrateSqliteSource:e=>api().admitLogbookPort(e),admit:(e,t)=>api().admitLogbookPort(e,t)};if(e===logbook_port_generated_default.version)return n;return historicalIndexOrderingPort(n,e,t,e===2?`schema-nullability`:`sqlite`)}function api(){return loadBundledPluginPublicArtifactModuleSync({dirName:`logbook`,artifactBasename:`database-port-api.js`}).logbookDatabasePortApi}export{loadLogbookPortDescriptor};