import{n as e}from"./worker-chunk-Du4wjDfF.mjs";import{n as t,t as n}from"./worker-chunk-BL8IsHVh.mjs";import{vt as r,yt as i}from"./worker-chunk-CEZYAk4y.mjs";import{o as a,s as o,t as s,u as c}from"./worker-chunk-DBPe0gM1.mjs";import{a as l,c as u,i as d,s as f}from"./worker-chunk-0SEMnZfQ.mjs";import{o as ee,u as te}from"./worker-chunk-Cb_C8ZGK.mjs";import{r as p,t as m}from"./worker-chunk-DRFLBm48.mjs";import{c as ne,i as h,n as g,o as _,s as v}from"./worker-chunk-BPAboNOm.mjs";import{i as re,s as ie}from"./worker-chunk-pyTZgBGy.mjs";import{m as ae}from"./worker-chunk-Bt6v_KX1.mjs";import{a as y,r as oe,s as b}from"./worker-chunk-D46xuc6s.mjs";import{n as x,t as S}from"./worker-chunk-CPTKFXyU.mjs";import{i as C,n as se}from"./worker-chunk-xkbjeZMh.mjs";import{h as ce,i as le,m as ue,r as de}from"./worker-chunk-hkd94ElM.mjs";import{a as fe,s as pe}from"./worker-chunk-Cs2QYsjt.mjs";import{a as me,i as he,l as ge,r as _e,t as ve}from"./worker-chunk-_Aeyyloa.mjs";import{a as ye,i as be,n as xe,o as Se,t as w}from"./worker-chunk-CgbJT7DA.mjs";import{existsSync as T}from"node:fs";import E from"node:path";function tableHasCanonicalColumns(e,t,n,r,i){let a=e.prepare(`PRAGMA table_info(${t})`).all(),o=a.filter(e=>Number(e.pk??0)>0);return a.length===n.length&&a.every((e,t)=>e.name===n[t])&&o.length===1&&o[0]?.name===r&&i.every(e=>a.some(t=>t.name===e&&Number(t.notnull??0)===1))}function tableSql(e,t){let n=e.prepare(`SELECT sql FROM sqlite_master WHERE type = 'table' AND name = ?`).get(t);return typeof n?.sql==`string`?n.sql:void 0}function tableHasUniqueColumns(e,t,n){let r=e.prepare(`PRAGMA index_list(${t})`).all();return n.every(t=>r.some(n=>{if(Number(n.unique??0)!==1||typeof n.name!=`string`)return!1;let r=n.name.replaceAll(`'`,`''`),i=e.prepare(`PRAGMA index_info('${r}')`).all();return i.length===1&&i[0]?.name===t}))}function hasCanonicalAuditEventTable(e,t,n){let r=tableSql(e,`audit_events`)?.toLowerCase();return tableHasCanonicalColumns(e,`audit_events`,t,`sequence`,n)&&typeof r==`string`&&/\bsequence\s+integer\s+primary\s+key\s+autoincrement\b/.test(r)&&tableHasUniqueColumns(e,`audit_events`,[`event_id`,`source_id`])}function hasCanonicalAuditIdentityKeyTable(e){if(!_(e,`audit_identity_keys`))return!1;let t=tableSql(e,`audit_identity_keys`)?.toLowerCase();return tableHasCanonicalColumns(e,`audit_identity_keys`,[`id`,`key_id`,`key`,`created_at`],`id`,[`id`,`key_id`,`key`,`created_at`])&&typeof t==`string`&&/\bcheck\s*\(\s*id\s*=\s*1\s*\)/.test(t)}function hasCanonicalAuditEventsSchema(e){let t=ee(e);return t&&O.every(({name:e,sql:n})=>o(t.tableSql.get(e)??null)===n)?!0:_(e,`audit_events`)?hasCanonicalAuditEventTable(e,j,[`event_id`,`source_id`,`schema_version`,`source_sequence`,`occurred_at`,`kind`,`action`,`status`,`actor_type`,`actor_id`])&&hasCanonicalAuditIdentityKeyTable(e):ie(e)<D&&!_(e,`audit_identity_keys`)}function canRepairLegacyAuditEventsSchema(e){return!_(e,`audit_events`)||_(e,`audit_events_migration_new`)||v(e,`audit_events`,`schema_version`)?!1:(!_(e,`audit_identity_keys`)||hasCanonicalAuditIdentityKeyTable(e))&&hasCanonicalAuditEventTable(e,k,[`event_id`,`source_id`,`source_sequence`,`occurred_at`,`kind`,`action`,`status`,`actor_type`,`actor_id`,`agent_id`,`run_id`])}function readAuditEventSequenceHighWater(e){if(!_(e,`sqlite_sequence`))return;let t=e.prepare(`SELECT CAST(seq AS TEXT) AS seq FROM sqlite_sequence WHERE name = 'audit_events'`).get();if(t===void 0)return;if(typeof t.seq!=`string`||!/^\d+$/.test(t.seq))throw Error(`audit event sequence high-water mark is invalid`);let n=BigInt(t.seq);if(n>BigInt(2**53-1))throw Error(`audit event sequence high-water mark exceeds the supported integer range`);return Number(n)}function restoreAuditEventSequenceHighWater(e,t){t!==void 0&&(e.prepare(`DELETE FROM sqlite_sequence WHERE name = 'audit_events'`).run(),e.prepare(`INSERT INTO sqlite_sequence (name, seq) VALUES ('audit_events', ?)`).run(t))}function repairAuditEventsSchema(e){if(hasCanonicalAuditEventsSchema(e)||!canRepairLegacyAuditEventsSchema(e))return!1;let t=readAuditEventSequenceHighWater(e);return e.exec(`
    CREATE TABLE audit_events_migration_new (
      sequence INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id TEXT NOT NULL UNIQUE,
      source_id TEXT NOT NULL UNIQUE,
      schema_version INTEGER NOT NULL DEFAULT 1,
      source_sequence INTEGER NOT NULL,
      occurred_at INTEGER NOT NULL,
      kind TEXT NOT NULL,
      action TEXT NOT NULL,
      status TEXT NOT NULL,
      error_code TEXT,
      actor_type TEXT NOT NULL,
      actor_id TEXT NOT NULL,
      agent_id TEXT,
      session_key TEXT,
      session_id TEXT,
      run_id TEXT,
      tool_call_id TEXT,
      tool_name TEXT,
      direction TEXT,
      channel TEXT,
      conversation_kind TEXT,
      message_outcome TEXT,
      reason_code TEXT,
      delivery_kind TEXT,
      failure_stage TEXT,
      duration_ms INTEGER,
      result_count INTEGER,
      account_ref TEXT,
      conversation_ref TEXT,
      message_ref TEXT,
      target_ref TEXT
    );
    INSERT INTO audit_events_migration_new (${A.join(`, `)})
    SELECT ${A.map(e=>e===`schema_version`?`1`:e).join(`, `)}
    FROM audit_events;
    DROP TABLE audit_events;
    ALTER TABLE audit_events_migration_new RENAME TO audit_events;
    CREATE INDEX idx_audit_events_time
      ON audit_events(occurred_at DESC, sequence DESC);
    CREATE INDEX idx_audit_events_agent_sequence
      ON audit_events(agent_id, sequence DESC);
    CREATE INDEX idx_audit_events_session_sequence
      ON audit_events(session_key, sequence DESC);
    CREATE INDEX idx_audit_events_run_sequence
      ON audit_events(run_id, sequence DESC);
    CREATE INDEX idx_audit_events_kind_sequence
      ON audit_events(kind, sequence DESC);
    CREATE INDEX idx_audit_events_status_sequence
      ON audit_events(status, sequence DESC);
    CREATE INDEX idx_audit_events_channel_sequence
      ON audit_events(channel, sequence DESC);
    CREATE INDEX idx_audit_events_direction_sequence
      ON audit_events(direction, sequence DESC);
    CREATE TABLE IF NOT EXISTS audit_identity_keys (
      id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),
      key_id TEXT NOT NULL,
      key BLOB NOT NULL,
      created_at INTEGER NOT NULL
    );
  `),restoreAuditEventSequenceHighWater(e,t),!0}var D,O,k,A,j,M=e((()=>{te(),a(),re(),h(),i(),D=2,O=[`audit_events`,`audit_identity_keys`].map(e=>({name:e,sql:o(s(r,e))})),k=[`sequence`,`event_id`,`source_id`,`source_sequence`,`occurred_at`,`kind`,`action`,`status`,`error_code`,`actor_type`,`actor_id`,`agent_id`,`session_key`,`session_id`,`run_id`,`tool_call_id`,`tool_name`],A=k.flatMap(e=>e===`source_id`?[e,`schema_version`]:[e]),j=[...A,`direction`,`channel`,`conversation_kind`,`message_outcome`,`reason_code`,`delivery_kind`,`failure_stage`,`duration_ms`,`result_count`,`account_ref`,`conversation_ref`,`message_ref`,`target_ref`]}));function createStateConfigMachineTable(e){e.exec(`
    CREATE TABLE IF NOT EXISTS config_machine_state (
      state_key TEXT NOT NULL PRIMARY KEY,
      value_json TEXT NOT NULL,
      updated_at_ms INTEGER NOT NULL
    ) STRICT;
  `)}function migrateSingletonStateFoldInV12(e,t){if(t>=12)return!1;createStateConfigMachineTable(e);let n=e.prepare(`INSERT INTO config_machine_state (state_key, value_json, updated_at_ms) VALUES (?, ?, ?) ON CONFLICT(state_key) DO NOTHING`);if(_(e,`update_check_state`)){let t=e.prepare(`SELECT * FROM update_check_state WHERE state_key = 'default'`).get();t&&n.run(`update.checkState`,JSON.stringify({lastCheckedAt:t.last_checked_at??void 0,lastNotifiedVersion:t.last_notified_version??void 0,lastNotifiedTag:t.last_notified_tag??void 0,lastAvailableVersion:t.last_available_version??void 0,lastAvailableTag:t.last_available_tag??void 0,autoInstallId:t.auto_install_id??void 0,autoFirstSeenVersion:t.auto_first_seen_version??void 0,autoFirstSeenTag:t.auto_first_seen_tag??void 0,autoFirstSeenAt:t.auto_first_seen_at??void 0,autoLastAttemptVersion:t.auto_last_attempt_version??void 0,autoLastAttemptAt:t.auto_last_attempt_at??void 0,autoLastSuccessVersion:t.auto_last_success_version??void 0,autoLastSuccessAt:t.auto_last_success_at??void 0}),Number(t.updated_at_ms))}if(_(e,`voicewake_triggers`)){let t=e.prepare(`SELECT trigger, updated_at_ms FROM voicewake_triggers WHERE config_key = 'default' ORDER BY position`).all();t.length>0&&n.run(`voicewake.triggers`,JSON.stringify(t.map(e=>e.trigger)),Math.max(...t.map(e=>Number(e.updated_at_ms))))}if(_(e,`voicewake_routing_config`)){let t=e.prepare(`SELECT * FROM voicewake_routing_config WHERE config_key = 'default'`).get();if(t){let r=_(e,`voicewake_routing_routes`)?e.prepare(`SELECT trigger, target_mode, target_agent_id, target_session_key FROM voicewake_routing_routes WHERE config_key = 'default' ORDER BY position`).all():[],targetFromColumns=(e,t,n)=>e===`agent`&&typeof t==`string`&&t?{agentId:t}:e===`session`&&typeof n==`string`&&n?{sessionKey:n}:{mode:`current`};n.run(`voicewake.routing`,JSON.stringify({version:1,defaultTarget:targetFromColumns(t.default_target_mode,t.default_target_agent_id,t.default_target_session_key),routes:r.map(e=>({trigger:e.trigger,target:targetFromColumns(e.target_mode,e.target_agent_id,e.target_session_key)})),updatedAtMs:t.updated_at_ms}),Number(t.updated_at_ms))}}if(_(e,`onboarding_recommendations`)){let t=e.prepare(`SELECT * FROM onboarding_recommendations`).all();for(let e of t)n.run(`onboarding.recommendations.${String(e.config_key)}`,JSON.stringify({inventoryHash:e.inventory_hash,matches:JSON.parse(String(e.matches_json)),offeredAt:e.offered_at_ms,acceptedAt:e.accepted_at_ms,updatedAt:e.updated_at_ms}),Number(e.updated_at_ms))}if(_(e,`sidebar_sections`)){let t=e.prepare(`SELECT section_id FROM sidebar_sections ORDER BY position, section_id`).all();t.length>0&&n.run(`sidebar.sectionOrder`,JSON.stringify(t.map(e=>e.section_id)),Date.now())}if(_(e,`node_host_config`)){let t=e.prepare(`SELECT * FROM node_host_config WHERE config_key = 'current'`).get();if(t){let e={host:t.gateway_host??void 0,port:t.gateway_port??void 0,tls:t.gateway_tls==null?void 0:t.gateway_tls===1,tlsFingerprint:t.gateway_tls_fingerprint??void 0,contextPath:t.gateway_context_path??void 0,cloudflareAccess:t.gateway_cloudflare_access_json==null?void 0:JSON.parse(String(t.gateway_cloudflare_access_json))};n.run(`nodeHost.config`,JSON.stringify({version:t.version,nodeId:t.node_id,...t.display_name==null?{}:{displayName:t.display_name},gateway:Object.values(e).some(e=>e!==void 0)?e:void 0,installedAppsSharing:t.installed_apps_sharing===1}),Number(t.updated_at_ms))}}if(_(e,`web_push_vapid_keys`)){let t=e.prepare(`SELECT * FROM web_push_vapid_keys WHERE key_id = 'default'`).get();t&&n.run(`webPush.vapidKeys`,JSON.stringify({publicKey:t.public_key,privateKey:t.private_key,subject:t.subject}),Number(t.updated_at_ms))}let r=!1;for(let t of N)_(e,t)&&(e.exec(`DROP TABLE IF EXISTS ${t};`),r=!0);return r}var N,P=e((()=>{h(),N=[`skill_curator_state`,`update_check_state`,`clawhub_promotions_feed_state`,`model_catalog_remote`,`voicewake_triggers`,`voicewake_routing_routes`,`voicewake_routing_config`,`onboarding_recommendations`,`cron_store_epochs`,`tui_last_sessions`,`sidebar_sections`,`node_host_config`,`web_push_vapid_keys`]})),F,I,L=e((()=>{F=`explicit`,I=`ambient-group`}));function getSessionWatchCursorKysely(e){return f(e)}function hasLegacyAmbientWatchSentinels(e){return l(e,getSessionWatchCursorKysely(e).selectFrom(`session_watch_cursors`).select(`watcher_session_key`).where(`watcher_session_key`,`>=`,z).where(`watcher_session_key`,`<`,B).limit(1))!==void 0}function needsSessionWatchCursorProvenanceMigration(e,t){return _(e,`session_watch_cursors`)?t<R||!v(e,`session_watch_cursors`,`provenance`)||hasLegacyAmbientWatchSentinels(e):!1}function decodeLegacyAmbientWatchMarkerKey(e){let t=e.slice(20);if(t&&t.length%2==0&&/^[0-9a-f]+$/.test(t))try{return new TextDecoder(`utf-8`,{fatal:!0,ignoreBOM:!0}).decode(Buffer.from(t,`hex`))}catch{return}}function migrateSessionWatchCursorProvenance(e){if(!_(e,`session_watch_cursors`))return{migratedAmbientWatches:0,removedLegacySentinels:0};g(e,`session_watch_cursors`,V);let t=getSessionWatchCursorKysely(e),n=d(e,t.selectFrom(`session_watch_cursors`).select([`watcher_session_key`,`target_session_key`,`updated_at`]).where(`watcher_session_key`,`>=`,z).where(`watcher_session_key`,`<`,B)).rows,r=0;for(let i of n){let n=decodeLegacyAmbientWatchMarkerKey(i.watcher_session_key);if(n){let a=l(e,t.selectFrom(`session_watch_cursors`).select(`updated_at`).where(`watcher_session_key`,`=`,n).where(`target_session_key`,`=`,i.target_session_key));if(a){let o=d(e,t.updateTable(`session_watch_cursors`).set({provenance:I,updated_at:Math.max(a.updated_at,i.updated_at)}).where(`watcher_session_key`,`=`,n).where(`target_session_key`,`=`,i.target_session_key));r+=Number(o.numAffectedRows??0n)}}d(e,t.deleteFrom(`session_watch_cursors`).where(`watcher_session_key`,`=`,i.watcher_session_key).where(`target_session_key`,`=`,i.target_session_key))}return{migratedAmbientWatches:r,removedLegacySentinels:n.length}}var R,z,B,V,H=e((()=>{u(),h(),L(),R=4,z=`ambient-group-watch:`,B=`ambient-group-watch;`,V=`provenance TEXT NOT NULL DEFAULT '${F}' CHECK (provenance IN ('${F}', '${I}'))`})),U,W,G,K,Ce=e((()=>{U=`
  id TEXT NOT NULL PRIMARY KEY,
  agent_id TEXT NOT NULL,
  session_key TEXT NOT NULL,
  channel TEXT NOT NULL,
  account_id TEXT,
  recipient_id TEXT,
  thread_id TEXT,
  sender_id TEXT,
  kind TEXT NOT NULL,
  sensitivity TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL,
  reason TEXT NOT NULL,
  suggested_text TEXT NOT NULL,
  dedupe_key TEXT NOT NULL,
  confidence REAL NOT NULL,
  due_earliest_ms INTEGER NOT NULL,
  due_latest_ms INTEGER NOT NULL,
  due_timezone TEXT NOT NULL,
  source_message_id TEXT,
  source_run_id TEXT,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  attempts INTEGER NOT NULL,
  last_attempt_at_ms INTEGER,
  sent_at_ms INTEGER,
  dismissed_at_ms INTEGER,
  snoozed_until_ms INTEGER,
  expired_at_ms INTEGER,
  record_json TEXT NOT NULL
`,W=`CREATE INDEX idx_commitments_scope_due
  ON commitments(agent_id, session_key, status, due_earliest_ms, due_latest_ms);
CREATE INDEX idx_commitments_status_due
  ON commitments(status, due_earliest_ms, due_latest_ms);
CREATE INDEX idx_commitments_scope_dedupe
  ON commitments(agent_id, session_key, channel, dedupe_key, status);`,G=`
CREATE TABLE commitments (${U.slice(1,-1)}
) STRICT;
${W}
CREATE INDEX idx_commitments_agent_due
  ON commitments(agent_id, status, due_earliest_ms, due_latest_ms, session_key);
CREATE INDEX idx_commitments_agent_sent
  ON commitments(agent_id, status, sent_at_ms, session_key);
`,K=`
CREATE TABLE commitments (${U.slice(1,-1)}
);
${W}
`}));function deriveRetiredCommitmentsContract(){let e=new Map(me(G).map(({fingerprint:e,name:t})=>[t,JSON.stringify(e)]));return{indexFingerprints:e,compatibility:{allowedColumnDefinitions:{"commitments.attempts":[`attempts INTEGER NOT NULL DEFAULT 0`],"commitments.confidence":[`confidence REAL NOT NULL DEFAULT 0`],"commitments.created_at_ms":[`created_at_ms INTEGER NOT NULL DEFAULT 0`],"commitments.dedupe_key":[`dedupe_key TEXT NOT NULL DEFAULT ''`],"commitments.due_timezone":[`due_timezone TEXT NOT NULL DEFAULT 'UTC'`],"commitments.kind":[`kind TEXT NOT NULL DEFAULT 'followup'`],"commitments.reason":[`reason TEXT NOT NULL DEFAULT ''`],"commitments.sensitivity":[`sensitivity TEXT NOT NULL DEFAULT 'normal'`],"commitments.source":[`source TEXT NOT NULL DEFAULT 'unknown'`],"commitments.suggested_text":[`suggested_text TEXT NOT NULL DEFAULT ''`]},allowedMissingColumns:Y,allowedMissingIndexes:[...e.keys()]}}}function hasSupportedRetiredCommitmentsSchema(e,t,{compatibility:n,indexFingerprints:r}){return he(e,t,n).length>0?!1:e.prepare(`SELECT type, name
           FROM sqlite_schema
          WHERE type IN ('index', 'trigger')
            AND tbl_name = 'commitments'
            AND sql IS NOT NULL
          ORDER BY type, name`).all().every(t=>t.type===`index`&&JSON.stringify(_e(e,t.name))===r.get(t.name))}function assertRecognizedRetiredCommitmentsSchema(e){if(!hasRecognizedRetiredCommitmentsSchema(e))throw ve(e,`retired OpenClaw commitments schema`,G,deriveRetiredCommitmentsContract().compatibility),Error(`Retired OpenClaw commitments schema has unsupported additional indexes; refusing destructive migration.`)}function hasRecognizedRetiredCommitmentsSchema(e){let t=deriveRetiredCommitmentsContract();return hasSupportedRetiredCommitmentsSchema(e,G,t)||hasSupportedRetiredCommitmentsSchema(e,K,t)}function assertNoRetiredCommitmentsForeignKeys(e){let t=e.prepare(`SELECT name
         FROM sqlite_schema
        WHERE type = 'table' AND name <> 'commitments'
        ORDER BY name`).all();for(let n of t)if(e.prepare(`PRAGMA foreign_key_list(${c(n.name)})`).all().some(e=>typeof e.table==`string`&&e.table.toLowerCase()===`commitments`))throw Error(`Retired OpenClaw commitments schema is referenced by table ${n.name}; refusing destructive migration.`)}function collectRetainedSchemaSql(e){return new Map(e.prepare(`SELECT type, name, sql
             FROM sqlite_schema
            WHERE type IN ('trigger', 'view')
              AND tbl_name <> 'commitments'
              AND sql IS NOT NULL
            ORDER BY type, name`).all().map(e=>[`${e.type}:${e.name}`,e.sql]))}function assertNoRetiredCommitmentsSchemaDependencies(e){let t=`__openclaw_retired_commitments_probe`;if(_(e,t))throw Error(`OpenClaw state database already contains ${t}; refusing destructive migration.`);let n=collectRetainedSchemaSql(e),r=`openclaw_probe_commitments_dependencies`;e.exec(`SAVEPOINT ${r};`);let i;try{e.exec(`ALTER TABLE commitments RENAME TO ${c(t)};`);let r=collectRetainedSchemaSql(e);i=[...n].find(([e,t])=>r.get(e)!==t)?.[0]}catch(t){throw e.exec(`ROLLBACK TO ${r}; RELEASE ${r};`),Error(`Could not prove retained SQLite views and triggers independent of commitments; refusing destructive migration.`,{cause:t})}if(e.exec(`ROLLBACK TO ${r}; RELEASE ${r};`),i){let[e,t]=i.split(`:`,2);throw Error(`Retired OpenClaw commitments schema is referenced by ${e} ${t}; refusing destructive migration.`)}}function assertVirtualTablesUsable(e,t){let n=e.prepare(`SELECT name
         FROM sqlite_schema
        WHERE type = 'table' AND lower(sql) LIKE 'create virtual table%'
        ORDER BY name`).all();for(let r of n)try{e.prepare(`SELECT * FROM ${c(r.name)} LIMIT 1`).all()}catch(e){throw Error(`SQLite virtual table ${r.name} is unusable ${t} commitments retirement.`,{cause:e})}}function migrateRetiredCommitmentsSchema(e,t){if(t>=7||!_(e,`commitments`))return!1;assertRecognizedRetiredCommitmentsSchema(e),assertNoRetiredCommitmentsForeignKeys(e),assertNoRetiredCommitmentsSchemaDependencies(e),assertVirtualTablesUsable(e,`before`);let n=`openclaw_retire_commitments_v7`;e.exec(`SAVEPOINT ${n};`);try{return e.exec(`DROP TABLE commitments;`),assertVirtualTablesUsable(e,`after`),e.exec(`RELEASE ${n};`),!0}catch(t){throw e.exec(`ROLLBACK TO ${n}; RELEASE ${n};`),t}}function migrateRetiredDeadStateTablesV10(e,t){if(t>=10)return!1;let n=!1;for(let t of J)_(e,t)&&(e.exec(`DROP TABLE IF EXISTS ${t};`),n=!0);return n}function migrateRetiredSkillCuratorTablesV11(e,t){if(t>=11)return!1;let n=X.filter(t=>_(e,t));if(n.length===0)return!1;if(n.includes(`skill_lifecycle`)){let t=Number(e.prepare(`SELECT COUNT(*) AS archived_count FROM skill_lifecycle WHERE state = 'archived'`).get()?.archived_count);t>0&&q.info(`${t} previously archived workshop skills are live again; archive any you no longer want`)}for(let t of n)e.exec(`DROP TABLE IF EXISTS ${t};`);return!0}function dropRetiredSkillWorkshopProposalTables(e){let t=Z.filter(t=>_(e,t));if(t.length===0)return!1;let n=e.prepare(`SELECT type, name FROM sqlite_schema
        WHERE type IN ('index', 'trigger') AND sql IS NOT NULL
          AND tbl_name IN (${t.map(()=>`?`).join(`, `)})`).all(...t);for(let{type:t,name:r}of n)(t===`index`||t===`trigger`)&&typeof r==`string`&&e.exec(`DROP ${t.toUpperCase()} IF EXISTS ${c(r)};`);for(let n of t)e.exec(`DROP TABLE ${n};`);return!0}function runRetiredStateTableMigrations(e,t){let n=[];return migrateRetiredCommitmentsSchema(e,t)&&n.push(`Discarded retired shared-state commitments rows, table, and indexes`),migrateRetiredDeadStateTablesV10(e,t)&&n.push(`Retired six dead shared-state tables (v10)`),migrateRetiredSkillCuratorTablesV11(e,t)&&n.push(`Retired legacy skill curator lifecycle and proposal origin-run tables`),n}var q,logRetiredStateTableMigration,J,Y,X,Z,Q=e((()=>{ge(),a(),t(),h(),Ce(),q=n(`state/db`),logRetiredStateTableMigration=e=>q.info(e),J=[`agent_model_catalogs`,`android_notification_recent_packages`,`command_log_entries`,`diagnostic_stability_bundles`,`media_blobs`,`model_capability_cache`],Y=[`commitments.account_id`,`commitments.recipient_id`,`commitments.thread_id`,`commitments.sender_id`,`commitments.kind`,`commitments.sensitivity`,`commitments.source`,`commitments.reason`,`commitments.suggested_text`,`commitments.dedupe_key`,`commitments.confidence`,`commitments.due_timezone`,`commitments.source_message_id`,`commitments.source_run_id`,`commitments.created_at_ms`,`commitments.attempts`,`commitments.last_attempt_at_ms`,`commitments.sent_at_ms`,`commitments.dismissed_at_ms`,`commitments.snoozed_until_ms`,`commitments.expired_at_ms`],X=[`skill_lifecycle`,`skill_workshop_proposal_origin_runs`],Z=[`skill_workshop_proposal_events`,`skill_workshop_proposal_rollbacks`,`skill_workshop_collection_reviews`,`skill_workshop_proposals`]}));function dropLegacyStateTables(e){e.exec(`DROP TABLE IF EXISTS database_verifications;`),e.exec(`DROP TABLE IF EXISTS node_pairing_pending; DROP TABLE IF EXISTS node_pairing_paired;`)}function migrateWorkerPlacementExecutionModeSchema(e,t){if(t>=8||!_(e,`worker_session_placements`))return!1;for(let t of[`execution_mode TEXT`,`terminal_reason TEXT`,`terminal_at_ms INTEGER`])g(e,`worker_session_placements`,t);let n=s(r,`worker_session_placements`,{errorMessage:`Canonical worker placement schema block is missing`}),i=x(`:memory:`),a;try{i.exec(n),a=i.prepare(`PRAGMA table_xinfo(worker_session_placements)`).all().filter(e=>e.hidden===0).map(e=>e.name)}finally{i.close()}let o=e.prepare(`PRAGMA table_xinfo(worker_session_placements)`).all().filter(e=>e.hidden===0).map(e=>e.name),l=new Set(a);if(o.length!==a.length||o.some(e=>!l.has(e)))throw Error(`OpenClaw v7 worker placement columns are not canonical`);if(e.prepare(`SELECT type, name
         FROM sqlite_schema
        WHERE tbl_name = 'worker_session_placements'
          AND type IN ('index', 'trigger')
          AND sql IS NOT NULL
          AND name NOT IN (
            'idx_worker_session_placements_session_key',
            'idx_worker_session_placements_reconcile',
            'idx_worker_session_placements_environment'
          )`).all().length>0)throw Error(`OpenClaw v7 worker placement schema has unsupported attached objects`);let u=`worker_session_placements_migration_v8`;if(_(e,u))throw Error(`OpenClaw worker placement migration table already exists: ${u}`);let d=n.replace(`CREATE TABLE IF NOT EXISTS worker_session_placements`,`CREATE TABLE ${u}`),f=a.map(c).join(`, `);return e.exec(d),e.exec(`INSERT INTO ${u} (${f}) SELECT ${f} FROM worker_session_placements;`),e.exec(`DROP TABLE worker_session_placements;`),e.exec(`ALTER TABLE ${u} RENAME TO worker_session_placements;`),!0}function isDefaultAgentDatabasePath(e,t){let n=E.dirname(e),r=E.dirname(n);return E.basename(e)===`openclaw-agent.sqlite`&&E.basename(n)===`agent`&&E.basename(r)===t&&E.basename(E.dirname(r))===`agents`}function migrateAgentDatabaseRelativePaths(e,t,n){if(t>=9||!_(e,`agent_databases`))return{relativized:0,reanchored:[],deleted:[],preserved:0};let r=e.prepare(`SELECT agent_id, path FROM agent_databases`).all(),i=e.prepare(`UPDATE agent_databases SET path = ? WHERE agent_id = ? AND path = ?`),a=e.prepare(`DELETE FROM agent_databases WHERE agent_id = ? AND path = ?`),o=e.prepare(`SELECT 1 FROM agent_databases WHERE agent_id = ? AND path = ? LIMIT 1`),s=e.prepare(`
    UPDATE agent_databases AS canonical
       SET schema_version = source.schema_version,
           last_seen_at = source.last_seen_at,
           size_bytes = source.size_bytes
      FROM agent_databases AS source
     WHERE canonical.agent_id = ? AND canonical.path = ?
       AND source.agent_id = canonical.agent_id AND source.path = ?
       AND source.last_seen_at > canonical.last_seen_at
  `),c=0,l=[],u=[];for(let e of r){let t=e.agent_id,r=e.path;if(typeof t!=`string`||typeof r!=`string`)throw Error(`OpenClaw v8 agent database registry paths are not canonical`);if(!E.isAbsolute(r))continue;let l=y(n,r);E.isAbsolute(l)||(o.get(t,l)?(s.run(t,l,r),a.run(t,r),u.push(r)):(i.run(l,t,r),c+=1))}let d=b(n);for(let e of r){let t=e.agent_id,r=e.path;if(typeof t==`string`&&typeof r==`string`&&E.isAbsolute(r)&&E.isAbsolute(y(n,r))&&isDefaultAgentDatabasePath(E.resolve(r),t)){let e=E.join(d,`agents`,t,`agent`,`openclaw-agent.sqlite`),s=y(n,e);o.get(t,s)?(a.run(t,r),u.push(r)):T(e)&&(i.run(s,t,r),l.push(r))}}return{relativized:c,reanchored:l,deleted:u,preserved:r.length-c-l.length-u.length}}function assertCanonicalAgentDatabasesPrimaryKey(e,t){if(!_(e,`agent_databases`))return;let n=ne(e,`agent_databases`);if(n.length!==2||n[0]!==`agent_id`||n[1]!==`path`)throw new m(`OpenClaw state database ${t} has an unsupported agent database registry schema. Upgrades from pre-July-2026 state are no longer migrated; restore a backup produced by a July 2026 or newer release before retrying.`)}function repairLegacyGatewayRestartHandoffsForStrictMigration(e){_(e,`gateway_restart_handoff`)&&(e.prepare(`DELETE FROM gateway_restart_handoff WHERE expires_at <= ?`).run(Date.now()),e.exec(`
    UPDATE gateway_restart_handoff
    SET
      restart_trace_started_at = CASE
        WHEN typeof(restart_trace_started_at) = 'real'
          THEN CAST(restart_trace_started_at AS INTEGER)
        ELSE restart_trace_started_at
      END,
      restart_trace_last_at = CASE
        WHEN typeof(restart_trace_last_at) = 'real'
          THEN CAST(restart_trace_last_at AS INTEGER)
        ELSE restart_trace_last_at
      END
    WHERE typeof(restart_trace_started_at) = 'real'
       OR typeof(restart_trace_last_at) = 'real';
  `))}function assertCanonicalStateSchemaShape(e,t){if(be(e,t),assertCanonicalAgentDatabasesPrimaryKey(e,t),!hasCanonicalAuditEventsSchema(e))throw canRepairLegacyAuditEventsSchema(e)?new se(`audit-events-v2`,t):new m(`OpenClaw state database ${t} has a noncanonical audit event schema that cannot be repaired automatically; restore the canonical audit_events shape before retrying.`)}function detectOpenClawStateDatabaseSchemaMigrationsFromDatabase(e,t){assertCanonicalAgentDatabasesPrimaryKey(e,t);let n=[],r=pe(e);return r<7&&_(e,`commitments`)&&hasRecognizedRetiredCommitmentsSchema(e)&&n.push({kind:`commitments-retirement-v7`,path:t}),r===7&&_(e,`worker_session_placements`)&&n.push({kind:`worker-placement-execution-mode-v8`,path:t}),r===8&&_(e,`agent_databases`)&&n.push({kind:`agent-databases-relative-paths-v9`,path:t}),r<10&&J.some(t=>_(e,t))&&n.push({kind:`state-table-retirement-v10`,path:t}),r<11&&X.some(t=>_(e,t))&&n.push({kind:`state-table-retirement-v11`,path:t}),r<12&&N.some(t=>_(e,t))&&n.push({kind:`singleton-state-foldin-v12`,path:t}),r<13&&(v(e,`cron_jobs`,`schedule_kind`)||v(e,`subagent_runs`,`task`)||_(e,`workspace_attestations`)||_(e,`installed_plugin_index`)||_(e,`auth_profile_stores`))&&n.push({kind:`state-consolidation-v13`,path:t}),r<14&&_(e,`cron_jobs`)&&n.push({kind:`creator-namespace-v14`,path:t}),r<15&&(v(e,`current_conversation_bindings`,`target_agent_id`)||v(e,`current_conversation_bindings`,`target_session_id`))&&n.push({kind:`conversation-binding-targets-v15`,path:t}),r<17&&_(e,`worker_environments`)&&!v(e,`worker_environments`,`preparation_consumed_at_ms`)&&n.push({kind:`prepared-worker-ownership-v17`,path:t}),r<18&&[`github_publication_session_lifecycles`,`github_repository_publication_requests`].some(t=>_(e,t)&&!v(e,t,`requester_authority_json`))&&n.push({kind:`github-publication-requester-authority-v18`,path:t}),r<21&&[`meeting_transcript_sessions`,`meeting_transcript_summaries`,`delivery_queue_entries`].some(t=>_(e,t))&&n.push({kind:`predicate-columns-v21`,path:t}),r<22&&[`acp_sessions`,...w].some(t=>_(e,t))&&n.push({kind:`portable-identity-columns-v22`,path:t}),r<23&&_(e,`meeting_transcript_sessions`)&&n.push({kind:`meeting-transcript-start-time`,path:t}),r<24&&_(e,`task_runs`)&&n.push({kind:`task-run-indexes-v24`,path:t}),r<25&&n.push({kind:`subagent-operator-recovery-v25`,path:t}),r<26&&_(e,`session_state_heads`)&&n.push({kind:`session-state-head-layout-v26`,path:t}),r<27&&n.push({kind:`state-write-indexes-v27`,path:t}),(r<28||ce(e))&&n.push({kind:`github-publication-draft-v28`,path:t}),r<29&&n.push({kind:`local-client-credentials-v29`,path:t}),r<30&&n.push({kind:`automation-policy-fence-v30`,path:t}),r<31&&n.push({kind:`local-workspace-manifests-v31`,path:t}),r<35&&n.push({kind:`local-workspace-cas-v35`,path:t}),r<36&&n.push({kind:`template-names-v36`,path:t}),r<37&&n.push({kind:`worker-resource-receipts-v37`,path:t}),r<38&&n.push({kind:`repository-disk-authority-v38`,path:t}),hasCanonicalAuditEventsSchema(e)||n.push({kind:`audit-events-v2`,path:t}),_(e,`audit_events`)&&r<3&&n.push({kind:`strict-tables-v3`,path:t}),needsSessionWatchCursorProvenanceMigration(e,r)&&n.push({kind:`session-watch-cursor-provenance-v4`,path:t}),n.push(...ye(e,t)),n}var $,we=e((()=>{S(),p(),a(),M(),ae(),Se(),h(),C(),P(),xe(),ue(),le(),fe(),H(),Q(),oe(),i(),$={"agent-databases-composite-primary-key":[`agent_databases`],"audit-events-v2":[`audit_events`,`audit_identity_keys`],"commitments-retirement-v7":[`commitments`],"worker-placement-execution-mode-v8":[`worker_session_placements`],"agent-databases-relative-paths-v9":[`agent_databases`],"state-table-retirement-v10":J,"state-table-retirement-v11":X,"singleton-state-foldin-v12":[`config_machine_state`,...N],"state-consolidation-v13":[`cron_jobs`,`subagent_runs`,`workspace_setup_state`,`workspace_attestations`,`workspace_generated_bootstrap_hashes`,`auth_profile_stores`,`auth_profile_state`,`installed_plugin_index`,`config_machine_state`,`diagnostic_events`],"creator-namespace-v14":[`cron_jobs`],"conversation-binding-targets-v15":[`current_conversation_bindings`],"prepared-worker-ownership-v17":[`worker_environments`],"github-publication-requester-authority-v18":[`github_publication_session_lifecycles`,`github_repository_publication_requests`],"meeting-transcript-start-time":[`meeting_transcript_sessions`],"portable-identity-columns-v22":[`acp_sessions`,...w],"task-run-indexes-v24":[],"subagent-operator-recovery-v25":[],"session-state-head-layout-v26":[],"state-write-indexes-v27":[],"github-publication-draft-v28":[`github_publication_requests`,`github_personal_publication_requests`,`github_repository_publication_requests`],"local-client-credentials-v29":[`device_identities`,`device_auth_tokens`,`gateway_origin_device_tokens`,`exec_approvals_config`],"predicate-columns-v21":[`meeting_transcript_sessions`,`meeting_transcript_summaries`,`delivery_queue_entries`],"automation-policy-fence-v30":[`cron_jobs`],"local-workspace-manifests-v31":[`local_workspace_projections`,`local_workspace_manifest_nodes`],"local-workspace-cas-v35":[`local_workspace_projections`,`local_workspace_tree_packs`,`local_workspace_source_path_sets`],"template-names-v36":[...de.flat(),`agent_provenance`],"worker-resource-receipts-v37":[`worker_environments`],"repository-disk-authority-v38":[`session_repository_workspaces`,`worker_workspace_pending_results`],"operator-approvals-system-agent":[`operator_approvals`],"session-watch-cursor-provenance-v4":[`session_watch_cursors`],"strict-tables-v3":r.split(`
`).flatMap(e=>{let t=/^CREATE TABLE IF NOT EXISTS (\w+) \(/u.exec(e)?.[1];return t?[t]:[]})}}));export{M as C,migrateSingletonStateFoldInV12 as S,I as _,dropLegacyStateTables as a,createStateConfigMachineTable as b,migrateWorkerPlacementExecutionModeSchema as c,Q as d,logRetiredStateTableMigration as f,needsSessionWatchCursorProvenanceMigration as g,migrateSessionWatchCursorProvenance as h,detectOpenClawStateDatabaseSchemaMigrationsFromDatabase as i,repairLegacyGatewayRestartHandoffsForStrictMigration as l,H as m,assertCanonicalAgentDatabasesPrimaryKey as n,we as o,runRetiredStateTableMigrations as p,assertCanonicalStateSchemaShape as r,migrateAgentDatabaseRelativePaths as s,$ as t,dropRetiredSkillWorkshopProposalTables as u,F as v,repairAuditEventsSchema as w,P as x,L as y};