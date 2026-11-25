import{n as e}from"./worker-chunk-Du4wjDfF.mjs";import{r as t,t as n}from"./worker-chunk-Lqe5oW9n.mjs";import{nt as r,tt as i}from"./worker-chunk-Cb_C8ZGK.mjs";import{t as a}from"./worker-chunk-BBc33yzu.mjs";import{t as o}from"./worker-chunk-jU_exdO6.mjs";import{n as s,t as c}from"./worker-chunk-q96lGjEz.mjs";var l;function init_logbook_port_generated(){return(init_logbook_port_generated=e((()=>{l={id:`logbook`,version:3,minimumPostgresVersion:16,schema:``,sqlite:`
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
`,tables:[{name:`batches`,columns:[{name:`id`,type:`bigint`,nullable:!1,identity:!0,default:null},{name:`day`,type:`text`,nullable:!1,identity:!1,default:null},{name:`start_ms`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`end_ms`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`status`,type:`text`,nullable:!1,identity:!1,default:`'pending'`},{name:`error`,type:`text`,nullable:!0,identity:!1,default:null},{name:`frame_count`,type:`bigint`,nullable:!1,identity:!1,default:`0`},{name:`model`,type:`text`,nullable:!0,identity:!1,default:null},{name:`created_ms`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`updated_ms`,type:`bigint`,nullable:!1,identity:!1,default:null}],pk:[`id`],unique:[],foreignKeys:[],indexes:2,identities:[{column:`id`,autoIncrement:!0}]},{name:`cards`,columns:[{name:`id`,type:`bigint`,nullable:!1,identity:!0,default:null},{name:`day`,type:`text`,nullable:!1,identity:!1,default:null},{name:`start_ms`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`end_ms`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`title`,type:`text`,nullable:!1,identity:!1,default:null},{name:`summary`,type:`text`,nullable:!1,identity:!1,default:null},{name:`detail`,type:`text`,nullable:!1,identity:!1,default:`''`},{name:`category`,type:`text`,nullable:!1,identity:!1,default:`'other'`},{name:`app_primary`,type:`text`,nullable:!0,identity:!1,default:null},{name:`app_secondary`,type:`text`,nullable:!0,identity:!1,default:null},{name:`distractions`,type:`text`,nullable:!1,identity:!1,default:`'[]'`},{name:`keyframe_id`,type:`bigint`,nullable:!0,identity:!1,default:null},{name:`updated_ms`,type:`bigint`,nullable:!1,identity:!1,default:null}],pk:[`id`],unique:[],foreignKeys:[{columns:[`keyframe_id`],target:`frames`,targetColumns:[`id`],onUpdate:`NO ACTION`,onDelete:`SET NULL`,deferrable:!1,deferred:!1}],indexes:3,identities:[{column:`id`,autoIncrement:!0}]},{name:`frames`,columns:[{name:`id`,type:`bigint`,nullable:!1,identity:!0,default:null},{name:`captured_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`day`,type:`text`,nullable:!1,identity:!1,default:null},{name:`path`,type:`text`,nullable:!1,identity:!1,default:null},{name:`screen_index`,type:`bigint`,nullable:!1,identity:!1,default:`0`},{name:`width`,type:`bigint`,nullable:!0,identity:!1,default:null},{name:`height`,type:`bigint`,nullable:!0,identity:!1,default:null},{name:`byte_size`,type:`bigint`,nullable:!1,identity:!1,default:`0`},{name:`content_hash`,type:`text`,nullable:!1,identity:!1,default:null},{name:`idle`,type:`bigint`,nullable:!1,identity:!1,default:`0`},{name:`batch_id`,type:`bigint`,nullable:!0,identity:!1,default:null}],pk:[`id`],unique:[],foreignKeys:[{columns:[`batch_id`],target:`batches`,targetColumns:[`id`],onUpdate:`NO ACTION`,onDelete:`SET NULL`,deferrable:!1,deferred:!1}],indexes:5,identities:[{column:`id`,autoIncrement:!0}]},{name:`observations`,columns:[{name:`id`,type:`bigint`,nullable:!1,identity:!0,default:null},{name:`batch_id`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`day`,type:`text`,nullable:!1,identity:!1,default:null},{name:`start_ms`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`end_ms`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`text`,type:`text`,nullable:!1,identity:!1,default:null}],pk:[`id`],unique:[],foreignKeys:[{columns:[`batch_id`],target:`batches`,targetColumns:[`id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}],indexes:3,identities:[{column:`id`,autoIncrement:!0}]},{name:`standups`,columns:[{name:`day`,type:`text`,nullable:!1,identity:!1,default:null},{name:`text`,type:`text`,nullable:!1,identity:!1,default:null},{name:`updated_ms`,type:`bigint`,nullable:!1,identity:!1,default:null}],pk:[`day`],unique:[],foreignKeys:[],indexes:1,identities:[]}],objects:[{table:`batches`,kind:`check`,sql:`("status" IN ('pending', 'running', 'done', 'error'))`},{table:`frames`,kind:`check`,sql:`("idle" IN (0, 1))`}],triggers:[],preData:[0,2084],postData:[2084,3396]}})))()}async function loadLogbookPortDescriptor(e=l.version){if(e!==l.version&&e!==1&&e!==2)throw new a(`Missing logbook PostgreSQL backup descriptor for version ${e}`);let t=api().postgresSchema,n={...l,preData:t.slice(l.preData[0],l.preData[1]),postData:t.slice(l.postData[0],l.postData[1]),expectedCatalog:i(l),inspectSqliteSource(e){try{return api().inspectLogbookPortSource(e)}catch(e){throw e instanceof api().LogbookPortSchemaError?new a(e.message):e}},migrateSqliteSource:e=>api().admitLogbookPort(e),admit:(e,t)=>api().admitLogbookPort(e,t)};return e===l.version?n:c(n,e,t,e===2?`schema-nullability`:`sqlite`)}function api(){return t({dirName:`logbook`,artifactBasename:`database-port-api.js`}).logbookDatabasePortApi}e((()=>{n(),s(),init_logbook_port_generated(),o(),r()}))();export{loadLogbookPortDescriptor};