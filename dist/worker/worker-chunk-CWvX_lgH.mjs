import{n as e}from"./worker-chunk-Du4wjDfF.mjs";import{r as t,t as n}from"./worker-chunk-Lqe5oW9n.mjs";import{nt as r,tt as i}from"./worker-chunk-Cb_C8ZGK.mjs";import{t as a}from"./worker-chunk-BBc33yzu.mjs";import{t as o}from"./worker-chunk-jU_exdO6.mjs";import{n as s,t as c}from"./worker-chunk-q96lGjEz.mjs";var l;function init_workboard_port_generated(){return(init_workboard_port_generated=e((()=>{l={id:`workboard`,version:4,minimumPostgresVersion:16,schema:``,sqlite:`
    CREATE TABLE IF NOT EXISTS workboard_schema_migrations (
      id TEXT PRIMARY KEY,
      applied_at INTEGER NOT NULL
    ) STRICT;

    CREATE TABLE IF NOT EXISTS workboard_boards (
      id TEXT PRIMARY KEY,
      name TEXT,
      description TEXT,
      icon TEXT,
      color TEXT,
      kind TEXT,
      sessions_spec TEXT,
      automation_job_id TEXT,
      default_workspace_json TEXT,
      orchestration_json TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      archived_at INTEGER
    ) STRICT;

    CREATE TABLE IF NOT EXISTS workboard_session_placements (
      board_id TEXT NOT NULL REFERENCES workboard_boards(id) ON DELETE CASCADE,
      session_key TEXT NOT NULL,
      column_id TEXT NOT NULL,
      source TEXT NOT NULL CHECK(source IN ('state', 'model', 'operator')),
      reason TEXT NOT NULL,
      facts_hash TEXT NOT NULL,
      updated_at INTEGER NOT NULL,
      PRIMARY KEY(board_id, session_key)
    ) STRICT;

    CREATE TABLE IF NOT EXISTS workboard_cards (
      id TEXT PRIMARY KEY,
      board_id TEXT NOT NULL,
      title TEXT NOT NULL,
      notes TEXT,
      status TEXT NOT NULL,
      priority TEXT NOT NULL,
      agent_id TEXT,
      session_key TEXT,
      run_id TEXT,
      task_id TEXT,
      source_url TEXT,
      position REAL NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      started_at INTEGER,
      completed_at INTEGER,
      execution_id TEXT,
      execution_kind TEXT,
      execution_engine TEXT,
      execution_mode TEXT,
      execution_status TEXT,
      execution_model TEXT,
      execution_session_key TEXT,
      execution_run_id TEXT,
      execution_started_at INTEGER,
      execution_updated_at INTEGER,
      automation_json TEXT,
      claim_json TEXT,
      template_id TEXT,
      archived_at INTEGER,
      stale_json TEXT,
      lifecycle_status_source_updated_at INTEGER,
      failure_count INTEGER
    ) STRICT;
    CREATE INDEX IF NOT EXISTS workboard_cards_board_status_idx
      ON workboard_cards(board_id, status, position);
    CREATE INDEX IF NOT EXISTS workboard_cards_session_idx
      ON workboard_cards(session_key, run_id);

    CREATE TABLE IF NOT EXISTS workboard_card_labels (
      card_id TEXT NOT NULL REFERENCES workboard_cards(id) ON DELETE CASCADE,
      ordinal INTEGER NOT NULL,
      label TEXT NOT NULL,
      PRIMARY KEY(card_id, ordinal)
    ) STRICT;

    CREATE TABLE IF NOT EXISTS workboard_card_events (
      id TEXT PRIMARY KEY,
      card_id TEXT NOT NULL REFERENCES workboard_cards(id) ON DELETE CASCADE,
      ordinal INTEGER NOT NULL,
      kind TEXT NOT NULL,
      at INTEGER NOT NULL,
      from_status TEXT,
      to_status TEXT,
      session_key TEXT,
      run_id TEXT
    ) STRICT;
    CREATE INDEX IF NOT EXISTS workboard_card_events_card_idx
      ON workboard_card_events(card_id, ordinal);

    CREATE TABLE IF NOT EXISTS workboard_card_attempts (
      id TEXT PRIMARY KEY,
      card_id TEXT NOT NULL REFERENCES workboard_cards(id) ON DELETE CASCADE,
      ordinal INTEGER NOT NULL,
      status TEXT NOT NULL,
      started_at INTEGER NOT NULL,
      ended_at INTEGER,
      engine TEXT,
      mode TEXT,
      model TEXT,
      session_key TEXT,
      run_id TEXT,
      error TEXT
    ) STRICT;
    CREATE INDEX IF NOT EXISTS workboard_card_attempts_card_idx
      ON workboard_card_attempts(card_id, ordinal);

    CREATE TABLE IF NOT EXISTS workboard_card_comments (
      id TEXT PRIMARY KEY,
      card_id TEXT NOT NULL REFERENCES workboard_cards(id) ON DELETE CASCADE,
      ordinal INTEGER NOT NULL,
      body TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER
    ) STRICT;
    CREATE INDEX IF NOT EXISTS workboard_card_comments_card_idx
      ON workboard_card_comments(card_id, ordinal);

    CREATE TABLE IF NOT EXISTS workboard_card_links (
      id TEXT PRIMARY KEY,
      card_id TEXT NOT NULL REFERENCES workboard_cards(id) ON DELETE CASCADE,
      ordinal INTEGER NOT NULL,
      type TEXT NOT NULL,
      target_card_id TEXT,
      title TEXT,
      url TEXT,
      created_at INTEGER NOT NULL
    ) STRICT;
    CREATE INDEX IF NOT EXISTS workboard_card_links_card_idx
      ON workboard_card_links(card_id, ordinal);

    CREATE TABLE IF NOT EXISTS workboard_card_proof (
      id TEXT PRIMARY KEY,
      card_id TEXT NOT NULL REFERENCES workboard_cards(id) ON DELETE CASCADE,
      ordinal INTEGER NOT NULL,
      status TEXT NOT NULL,
      label TEXT,
      command TEXT,
      url TEXT,
      note TEXT,
      created_at INTEGER NOT NULL
    ) STRICT;
    CREATE INDEX IF NOT EXISTS workboard_card_proof_card_idx
      ON workboard_card_proof(card_id, ordinal);

    CREATE TABLE IF NOT EXISTS workboard_card_artifacts (
      id TEXT PRIMARY KEY,
      card_id TEXT NOT NULL REFERENCES workboard_cards(id) ON DELETE CASCADE,
      ordinal INTEGER NOT NULL,
      label TEXT,
      url TEXT,
      path TEXT,
      mime_type TEXT,
      created_at INTEGER NOT NULL
    ) STRICT;
    CREATE INDEX IF NOT EXISTS workboard_card_artifacts_card_idx
      ON workboard_card_artifacts(card_id, ordinal);

    CREATE TABLE IF NOT EXISTS workboard_card_diagnostics (
      card_id TEXT NOT NULL REFERENCES workboard_cards(id) ON DELETE CASCADE,
      ordinal INTEGER NOT NULL,
      kind TEXT NOT NULL,
      severity TEXT NOT NULL,
      title TEXT NOT NULL,
      detail TEXT NOT NULL,
      first_seen_at INTEGER NOT NULL,
      last_seen_at INTEGER NOT NULL,
      count INTEGER NOT NULL,
      actions_json TEXT NOT NULL,
      PRIMARY KEY(card_id, ordinal)
    ) STRICT;

    CREATE TABLE IF NOT EXISTS workboard_card_notifications (
      id TEXT PRIMARY KEY,
      card_id TEXT NOT NULL REFERENCES workboard_cards(id) ON DELETE CASCADE,
      ordinal INTEGER NOT NULL,
      kind TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      sequence INTEGER,
      session_key TEXT,
      run_id TEXT
    ) STRICT;
    CREATE INDEX IF NOT EXISTS workboard_card_notifications_card_idx
      ON workboard_card_notifications(card_id, ordinal);

    CREATE TABLE IF NOT EXISTS workboard_worker_logs (
      id TEXT PRIMARY KEY,
      card_id TEXT NOT NULL REFERENCES workboard_cards(id) ON DELETE CASCADE,
      ordinal INTEGER NOT NULL,
      level TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      session_key TEXT,
      run_id TEXT
    ) STRICT;
    CREATE INDEX IF NOT EXISTS workboard_worker_logs_card_idx
      ON workboard_worker_logs(card_id, ordinal);

    CREATE TABLE IF NOT EXISTS workboard_worker_protocol (
      card_id TEXT PRIMARY KEY REFERENCES workboard_cards(id) ON DELETE CASCADE,
      state TEXT NOT NULL,
      updated_at INTEGER NOT NULL,
      detail TEXT
    ) STRICT;

    CREATE TABLE IF NOT EXISTS workboard_card_attachments (
      id TEXT PRIMARY KEY,
      card_id TEXT NOT NULL REFERENCES workboard_cards(id) ON DELETE CASCADE,
      ordinal INTEGER NOT NULL,
      file_name TEXT NOT NULL,
      byte_size INTEGER NOT NULL,
      mime_type TEXT,
      note TEXT,
      created_at INTEGER NOT NULL
    ) STRICT;
    CREATE INDEX IF NOT EXISTS workboard_card_attachments_card_idx
      ON workboard_card_attachments(card_id, ordinal);

    CREATE TABLE IF NOT EXISTS workboard_attachment_blobs (
      attachment_id TEXT PRIMARY KEY,
      content BLOB NOT NULL
    ) STRICT;

    CREATE TABLE IF NOT EXISTS workboard_notification_subscriptions (
      id TEXT PRIMARY KEY,
      board_id TEXT NOT NULL,
      card_id TEXT,
      session_key TEXT,
      run_id TEXT,
      target TEXT,
      event_kinds_json TEXT,
      last_event_at INTEGER,
      last_event_id TEXT,
      last_event_sequence INTEGER,
      delivered_event_ids_json TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    ) STRICT;
  `,tables:[{name:`workboard_attachment_blobs`,columns:[{name:`attachment_id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`content`,type:`bytea`,nullable:!1,identity:!1,default:null}],pk:[`attachment_id`],unique:[],foreignKeys:[],indexes:1,identities:[]},{name:`workboard_boards`,columns:[{name:`id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`name`,type:`text`,nullable:!0,identity:!1,default:null},{name:`description`,type:`text`,nullable:!0,identity:!1,default:null},{name:`icon`,type:`text`,nullable:!0,identity:!1,default:null},{name:`color`,type:`text`,nullable:!0,identity:!1,default:null},{name:`kind`,type:`text`,nullable:!0,identity:!1,default:null},{name:`sessions_spec`,type:`text`,nullable:!0,identity:!1,default:null},{name:`automation_job_id`,type:`text`,nullable:!0,identity:!1,default:null},{name:`default_workspace_json`,type:`text`,nullable:!0,identity:!1,default:null},{name:`orchestration_json`,type:`text`,nullable:!0,identity:!1,default:null},{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`archived_at`,type:`bigint`,nullable:!0,identity:!1,default:null}],pk:[`id`],unique:[],foreignKeys:[],indexes:1,identities:[]},{name:`workboard_card_artifacts`,columns:[{name:`id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`card_id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`ordinal`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`label`,type:`text`,nullable:!0,identity:!1,default:null},{name:`url`,type:`text`,nullable:!0,identity:!1,default:null},{name:`path`,type:`text`,nullable:!0,identity:!1,default:null},{name:`mime_type`,type:`text`,nullable:!0,identity:!1,default:null},{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null}],pk:[`id`],unique:[],foreignKeys:[{columns:[`card_id`],target:`workboard_cards`,targetColumns:[`id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}],indexes:2,identities:[]},{name:`workboard_card_attachments`,columns:[{name:`id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`card_id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`ordinal`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`file_name`,type:`text`,nullable:!1,identity:!1,default:null},{name:`byte_size`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`mime_type`,type:`text`,nullable:!0,identity:!1,default:null},{name:`note`,type:`text`,nullable:!0,identity:!1,default:null},{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null}],pk:[`id`],unique:[],foreignKeys:[{columns:[`card_id`],target:`workboard_cards`,targetColumns:[`id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}],indexes:2,identities:[]},{name:`workboard_card_attempts`,columns:[{name:`id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`card_id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`ordinal`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`status`,type:`text`,nullable:!1,identity:!1,default:null},{name:`started_at`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`ended_at`,type:`bigint`,nullable:!0,identity:!1,default:null},{name:`engine`,type:`text`,nullable:!0,identity:!1,default:null},{name:`mode`,type:`text`,nullable:!0,identity:!1,default:null},{name:`model`,type:`text`,nullable:!0,identity:!1,default:null},{name:`session_key`,type:`text`,nullable:!0,identity:!1,default:null},{name:`run_id`,type:`text`,nullable:!0,identity:!1,default:null},{name:`error`,type:`text`,nullable:!0,identity:!1,default:null}],pk:[`id`],unique:[],foreignKeys:[{columns:[`card_id`],target:`workboard_cards`,targetColumns:[`id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}],indexes:2,identities:[]},{name:`workboard_card_comments`,columns:[{name:`id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`card_id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`ordinal`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`body`,type:`text`,nullable:!1,identity:!1,default:null},{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`updated_at`,type:`bigint`,nullable:!0,identity:!1,default:null}],pk:[`id`],unique:[],foreignKeys:[{columns:[`card_id`],target:`workboard_cards`,targetColumns:[`id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}],indexes:2,identities:[]},{name:`workboard_card_diagnostics`,columns:[{name:`card_id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`ordinal`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`kind`,type:`text`,nullable:!1,identity:!1,default:null},{name:`severity`,type:`text`,nullable:!1,identity:!1,default:null},{name:`title`,type:`text`,nullable:!1,identity:!1,default:null},{name:`detail`,type:`text`,nullable:!1,identity:!1,default:null},{name:`first_seen_at`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`last_seen_at`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`count`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`actions_json`,type:`text`,nullable:!1,identity:!1,default:null}],pk:[`card_id`,`ordinal`],unique:[],foreignKeys:[{columns:[`card_id`],target:`workboard_cards`,targetColumns:[`id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}],indexes:1,identities:[]},{name:`workboard_card_events`,columns:[{name:`id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`card_id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`ordinal`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`kind`,type:`text`,nullable:!1,identity:!1,default:null},{name:`at`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`from_status`,type:`text`,nullable:!0,identity:!1,default:null},{name:`to_status`,type:`text`,nullable:!0,identity:!1,default:null},{name:`session_key`,type:`text`,nullable:!0,identity:!1,default:null},{name:`run_id`,type:`text`,nullable:!0,identity:!1,default:null}],pk:[`id`],unique:[],foreignKeys:[{columns:[`card_id`],target:`workboard_cards`,targetColumns:[`id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}],indexes:2,identities:[]},{name:`workboard_card_labels`,columns:[{name:`card_id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`ordinal`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`label`,type:`text`,nullable:!1,identity:!1,default:null}],pk:[`card_id`,`ordinal`],unique:[],foreignKeys:[{columns:[`card_id`],target:`workboard_cards`,targetColumns:[`id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}],indexes:1,identities:[]},{name:`workboard_card_links`,columns:[{name:`id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`card_id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`ordinal`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`type`,type:`text`,nullable:!1,identity:!1,default:null},{name:`target_card_id`,type:`text`,nullable:!0,identity:!1,default:null},{name:`title`,type:`text`,nullable:!0,identity:!1,default:null},{name:`url`,type:`text`,nullable:!0,identity:!1,default:null},{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null}],pk:[`id`],unique:[],foreignKeys:[{columns:[`card_id`],target:`workboard_cards`,targetColumns:[`id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}],indexes:2,identities:[]},{name:`workboard_card_notifications`,columns:[{name:`id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`card_id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`ordinal`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`kind`,type:`text`,nullable:!1,identity:!1,default:null},{name:`message`,type:`text`,nullable:!1,identity:!1,default:null},{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`sequence`,type:`bigint`,nullable:!0,identity:!1,default:null},{name:`session_key`,type:`text`,nullable:!0,identity:!1,default:null},{name:`run_id`,type:`text`,nullable:!0,identity:!1,default:null}],pk:[`id`],unique:[],foreignKeys:[{columns:[`card_id`],target:`workboard_cards`,targetColumns:[`id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}],indexes:2,identities:[]},{name:`workboard_card_proof`,columns:[{name:`id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`card_id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`ordinal`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`status`,type:`text`,nullable:!1,identity:!1,default:null},{name:`label`,type:`text`,nullable:!0,identity:!1,default:null},{name:`command`,type:`text`,nullable:!0,identity:!1,default:null},{name:`url`,type:`text`,nullable:!0,identity:!1,default:null},{name:`note`,type:`text`,nullable:!0,identity:!1,default:null},{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null}],pk:[`id`],unique:[],foreignKeys:[{columns:[`card_id`],target:`workboard_cards`,targetColumns:[`id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}],indexes:2,identities:[]},{name:`workboard_cards`,columns:[{name:`id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`board_id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`title`,type:`text`,nullable:!1,identity:!1,default:null},{name:`notes`,type:`text`,nullable:!0,identity:!1,default:null},{name:`status`,type:`text`,nullable:!1,identity:!1,default:null},{name:`priority`,type:`text`,nullable:!1,identity:!1,default:null},{name:`agent_id`,type:`text`,nullable:!0,identity:!1,default:null},{name:`session_key`,type:`text`,nullable:!0,identity:!1,default:null},{name:`run_id`,type:`text`,nullable:!0,identity:!1,default:null},{name:`task_id`,type:`text`,nullable:!0,identity:!1,default:null},{name:`source_url`,type:`text`,nullable:!0,identity:!1,default:null},{name:`position`,type:`double precision`,nullable:!1,identity:!1,default:null},{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`started_at`,type:`bigint`,nullable:!0,identity:!1,default:null},{name:`completed_at`,type:`bigint`,nullable:!0,identity:!1,default:null},{name:`execution_id`,type:`text`,nullable:!0,identity:!1,default:null},{name:`execution_kind`,type:`text`,nullable:!0,identity:!1,default:null},{name:`execution_engine`,type:`text`,nullable:!0,identity:!1,default:null},{name:`execution_mode`,type:`text`,nullable:!0,identity:!1,default:null},{name:`execution_status`,type:`text`,nullable:!0,identity:!1,default:null},{name:`execution_model`,type:`text`,nullable:!0,identity:!1,default:null},{name:`execution_session_key`,type:`text`,nullable:!0,identity:!1,default:null},{name:`execution_run_id`,type:`text`,nullable:!0,identity:!1,default:null},{name:`execution_started_at`,type:`bigint`,nullable:!0,identity:!1,default:null},{name:`execution_updated_at`,type:`bigint`,nullable:!0,identity:!1,default:null},{name:`automation_json`,type:`text`,nullable:!0,identity:!1,default:null},{name:`claim_json`,type:`text`,nullable:!0,identity:!1,default:null},{name:`template_id`,type:`text`,nullable:!0,identity:!1,default:null},{name:`archived_at`,type:`bigint`,nullable:!0,identity:!1,default:null},{name:`stale_json`,type:`text`,nullable:!0,identity:!1,default:null},{name:`lifecycle_status_source_updated_at`,type:`bigint`,nullable:!0,identity:!1,default:null},{name:`failure_count`,type:`bigint`,nullable:!0,identity:!1,default:null}],pk:[`id`],unique:[],foreignKeys:[],indexes:3,identities:[]},{name:`workboard_notification_subscriptions`,columns:[{name:`id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`board_id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`card_id`,type:`text`,nullable:!0,identity:!1,default:null},{name:`session_key`,type:`text`,nullable:!0,identity:!1,default:null},{name:`run_id`,type:`text`,nullable:!0,identity:!1,default:null},{name:`target`,type:`text`,nullable:!0,identity:!1,default:null},{name:`event_kinds_json`,type:`text`,nullable:!0,identity:!1,default:null},{name:`last_event_at`,type:`bigint`,nullable:!0,identity:!1,default:null},{name:`last_event_id`,type:`text`,nullable:!0,identity:!1,default:null},{name:`last_event_sequence`,type:`bigint`,nullable:!0,identity:!1,default:null},{name:`delivered_event_ids_json`,type:`text`,nullable:!0,identity:!1,default:null},{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null}],pk:[`id`],unique:[],foreignKeys:[],indexes:1,identities:[]},{name:`workboard_schema_migrations`,columns:[{name:`id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`applied_at`,type:`bigint`,nullable:!1,identity:!1,default:null}],pk:[`id`],unique:[],foreignKeys:[],indexes:1,identities:[]},{name:`workboard_session_placements`,columns:[{name:`board_id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null},{name:`column_id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`source`,type:`text`,nullable:!1,identity:!1,default:null},{name:`reason`,type:`text`,nullable:!1,identity:!1,default:null},{name:`facts_hash`,type:`text`,nullable:!1,identity:!1,default:null},{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null}],pk:[`board_id`,`session_key`],unique:[],foreignKeys:[{columns:[`board_id`],target:`workboard_boards`,targetColumns:[`id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}],indexes:1,identities:[]},{name:`workboard_worker_logs`,columns:[{name:`id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`card_id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`ordinal`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`level`,type:`text`,nullable:!1,identity:!1,default:null},{name:`message`,type:`text`,nullable:!1,identity:!1,default:null},{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`session_key`,type:`text`,nullable:!0,identity:!1,default:null},{name:`run_id`,type:`text`,nullable:!0,identity:!1,default:null}],pk:[`id`],unique:[],foreignKeys:[{columns:[`card_id`],target:`workboard_cards`,targetColumns:[`id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}],indexes:2,identities:[]},{name:`workboard_worker_protocol`,columns:[{name:`card_id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`state`,type:`text`,nullable:!1,identity:!1,default:null},{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`detail`,type:`text`,nullable:!0,identity:!1,default:null}],pk:[`card_id`],unique:[],foreignKeys:[{columns:[`card_id`],target:`workboard_cards`,targetColumns:[`id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}],indexes:1,identities:[]}],objects:[{table:`workboard_session_placements`,kind:`check`,sql:`("source" IN ('state', 'model', 'operator'))`}],triggers:[],preData:[0,6963],postData:[6963,10288]}})))()}async function loadDescriptor(e=l.version){if(e!==l.version&&e!==3)throw new a(`Missing workboard PostgreSQL backup descriptor for version ${e}`);let n=t({dirName:`workboard`,artifactBasename:`database-port-api.js`}).workboardDatabasePortApi,{postgres:r}=n,o={...l,preData:r.slice(l.preData[0],l.preData[1]),postData:r.slice(l.postData[0],l.postData[1]),expectedCatalog:i(l),inspectSqliteSource(e){try{return n.inspectWorkboardPortSource(e)}catch(e){throw e instanceof n.WorkboardPortSchemaError?new a(e.message):e}},migrateSqliteSource:e=>n.admitWorkboardPort(e),admit:(e,t)=>n.admitWorkboardPort(e,t)};return e===l.version?o:c(o,e,r)}e((()=>{n(),s(),o(),r(),init_workboard_port_generated()}))();export{loadDescriptor};