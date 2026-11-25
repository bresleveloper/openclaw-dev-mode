import{n as e}from"./worker-chunk-Du4wjDfF.mjs";import{l as t,u as n}from"./worker-chunk-EAEbv0hu.mjs";import{r,t as i}from"./worker-chunk-CG818IAg.mjs";import{n as a,t as o}from"./worker-chunk-BL8IsHVh.mjs";import{r as s}from"./worker-chunk-BcUp1FuP.mjs";import{s as c}from"./worker-chunk-Bxv9ACSn.mjs";import{a as l,l as u,r as d}from"./worker-chunk-Bp1O4Ooy.mjs";import{a as f}from"./worker-chunk-D_02hvd5.mjs";import{A as p,K as m,bt as h,m as g,xt as _}from"./worker-chunk-CEZYAk4y.mjs";import{o as v,t as y,u as b}from"./worker-chunk-DBPe0gM1.mjs";import"./worker-chunk-DhldO1WL.mjs";import{c as x,d as S,i as C,s as ee}from"./worker-chunk-0SEMnZfQ.mjs";import{_ as te,b as ne,d as re,f as ie,o as w,t as ae,u as T,v as E}from"./worker-chunk-Cb_C8ZGK.mjs";import{i as oe,o as D,s as se}from"./worker-chunk-BPAboNOm.mjs";import{i as O,s as k}from"./worker-chunk-pyTZgBGy.mjs";import{l as A}from"./worker-chunk-Bt6v_KX1.mjs";import{i as ce}from"./worker-chunk-U6sELi5j.mjs";import{o as le,t as ue}from"./worker-chunk-B2-vZf-9.mjs";import{o as de,r as fe}from"./worker-chunk-DVBHhI-q.mjs";import{n as pe,o as me}from"./worker-chunk-Cah9p62j.mjs";import{d as he,f as ge,i as j,s as _e}from"./worker-chunk-BoIB2pE5.mjs";import{f as ve,l as ye}from"./worker-chunk-CGIcfX_Y.mjs";import{l as M,t as N}from"./worker-chunk-_Aeyyloa.mjs";import{m as be,p as xe}from"./worker-chunk-Bfa80a62.mjs";import{r as P}from"./worker-chunk-BXmh_BAZ.mjs";import{S as F,b as Se,ct as Ce,ot as we,st as I,t as Te,u as Ee}from"./worker-chunk-Dlrdc8z0.mjs";import{i as De,n as Oe}from"./worker-chunk-DZyAHTvS.mjs";import{c as ke,i as Ae}from"./worker-chunk-fMGf5rZh.mjs";import{A as L,C as R,D as je,E as Me,K as Ne,M as Pe,O as Fe,R as Ie,S as Le,U as Re,W as ze,j as Be,k as Ve,w as He,z as Ue}from"./worker-chunk-B23d29Iv.mjs";import{B as We,C as Ge,F as Ke,G as qe,J as Je,M as Ye,O as Xe,T as Ze,U as Qe,X as $e,_ as et,a as tt,d as z,g as nt,i as B,k as rt,m as it,o as at,p as ot,r as V,y as st,z as ct}from"./worker-chunk-C45OPGga.mjs";import{D as lt,E as ut,T as dt,f as ft,y as pt}from"./worker-chunk-DjaikYtS.mjs";import{b as mt,c as ht,f as gt,n as _t,y as vt}from"./worker-chunk-DD0g7hCo.mjs";import{c as H,l as yt,p as U,r as bt}from"./worker-chunk-BmUyJUAc.mjs";import{i as xt,n as St,r as Ct}from"./worker-chunk-olGpaVY9.mjs";import{n as wt,r as Tt}from"./worker-chunk-DkIKsDkr.mjs";import{n as Et,t as Dt}from"./worker-chunk-DNbFs6q6.mjs";import{o as Ot,r as kt}from"./worker-chunk-ZWv5BlMA.mjs";import{C as At,D as jt,E as Mt,F as Nt,I as Pt,L as Ft,M as It,N as Lt,O as Rt,P as zt,R as Bt,S as W,T as Vt,a as Ht,b as Ut,c as Wt,d as Gt,g as Kt,h as qt,i as Jt,j as Yt,l as Xt,m as Zt,n as Qt,o as $t,p as en,r as tn,s as nn,t as G,u as K,w as rn,x as q,y as an}from"./worker-chunk-StP6NlVv.mjs";import{r as on,t as sn}from"./worker-chunk-D1GRGqyP.mjs";import{i as cn,n as ln,r as un,t as dn}from"./worker-chunk-Cwu69M9s.mjs";import{a as fn,n as pn}from"./worker-chunk-DdCuQMfF.mjs";import{n as mn,t as hn}from"./worker-chunk-CjGCNeE2.mjs";import{o as gn,s as _n,t as vn}from"./worker-chunk-Bs10i9Px.mjs";import{a as yn,c as bn}from"./worker-chunk-gHd8IvY9.mjs";import{chmodSync as xn,existsSync as Sn,mkdirSync as Cn,statSync as wn}from"node:fs";import J from"node:path";function ensureMode(e,t){(process.platform===`win32`||(wn(e).mode&4095)!==t)&&xn(e,t)}function ensureOpenClawAgentDatabasePermissions(e,t){let n=J.dirname(e),r=u({agentId:t.agentId,env:t.env}),i=J.resolve(e)===J.resolve(r),a=Sn(n);Cn(n,{recursive:!0,mode:Y}),(i||!a)&&ensureMode(n,Y);for(let t of de(e))try{ensureMode(t,Tn)}catch(e){if(e.code!==`ENOENT`)throw e}}var Y,Tn,En=e((()=>{fe(),d(),Y=448,Tn=384}));function backfillTranscriptMutationWatermarks(e){D(e,`transcript_events`)&&e.exec(`
    UPDATE sessions
    SET
      transcript_updated_at = COALESCE(
        transcript_updated_at,
        (SELECT MAX(transcript_events.created_at)
         FROM transcript_events
         WHERE transcript_events.session_id = sessions.session_id)
      ),
      transcript_observed_at = COALESCE(transcript_observed_at, updated_at)
    WHERE EXISTS (
      SELECT 1 FROM transcript_events
      WHERE transcript_events.session_id = sessions.session_id
    );
  `)}var Dn=e((()=>{oe()}));function migrateOpenClawAgentSchema(e){if(k(e)>=42)return;let t=Rt(e,`sessions`);if(t){for(let[n,r]of Object.entries({transcript_updated_at:`INTEGER DEFAULT NULL`,transcript_observed_at:`INTEGER DEFAULT NULL`,session_entry_provenance:`INTEGER NOT NULL DEFAULT 0 CHECK (session_entry_provenance IN (0, 1))`,acp_owned:`INTEGER NOT NULL DEFAULT 0 CHECK (acp_owned IN (0, 1))`,plugin_owner_id:`TEXT`,hook_external_content_source:`TEXT CHECK (hook_external_content_source IS NULL OR hook_external_content_source IN ('gmail', 'webhook'))`}))t.has(n)||e.exec(`ALTER TABLE sessions ADD COLUMN ${n} ${r};`);backfillTranscriptMutationWatermarks(e)}}var On=e((()=>{O(),P(),At(),Dn()}));function admitOpenClawAgentDatabaseSchema(e,t){if(e.location()&&p(e)&&(ie(e)||w(e)))return ae(e),ut(e),ke(e),pt({db:e,...t}),e}var kn=e((()=>{g(),T(),lt(),Ae(),ft()}));function migrateOutboxEnqueueSequenceInTransaction(e){if(!D(e,`context_engine_turn_outbox`)||se(e,`context_engine_turn_outbox`,`enqueue_sequence`))return null;let t=performance.now(),n=w(e)??te(e),r=[...n.indexDefinitions.values(),...n.triggers.values()].filter(({table:e})=>e===`context_engine_turn_outbox`),i=y(h,`context_engine_turn_outbox`);e.exec(`
    ${i.replace(`IF NOT EXISTS context_engine_turn_outbox`,`context_engine_turn_outbox_sequence_migration`)}
    INSERT INTO context_engine_turn_outbox_sequence_migration
      (enqueue_sequence, advancement_key, engine_id, owner_plugin_id, session_id,
       payload_json, payload_state, attempt_count, last_attempt_at, last_error, created_at)
    SELECT rowid, advancement_key, engine_id, owner_plugin_id, session_id,
       payload_json, payload_state, attempt_count, last_attempt_at, last_error, created_at
    FROM context_engine_turn_outbox;
    DROP TABLE context_engine_turn_outbox;
    ALTER TABLE context_engine_turn_outbox_sequence_migration RENAME TO context_engine_turn_outbox;
  `);for(let t of r)t.sql!==null&&e.exec(t.sql);return performance.now()-t}var An=e((()=>{E(),T(),v(),_(),oe(),He()}));function migrateSessionEntrySnapshotsInTransaction(e){e.exec(`ALTER TABLE session_nodes ADD COLUMN snapshot_revision INTEGER NOT NULL DEFAULT 0`),e.exec(Be(h));let t=ee(e),n=t.selectFrom(`session_nodes`).select([`session_key`,`current_session_id`,`updated_at`,`entry_json`]).orderBy(`session_key`).limit(64),r=S(e,e=>n.where(`session_key`,`>`,e(e=>e))),i=S(e,e=>t.insertInto(`session_entry_snapshots`).values({session_key:e(e=>e.sessionKey),field:e(e=>e.field),value_json:e(e=>e.valueJson)})),a=S(e,e=>t.updateTable(`session_nodes`).set({entry_json:e(e=>e.entryJson)}).where(`session_key`,`=`,e(e=>e.sessionKey))),o=S(e,e=>t.updateTable(`session_nodes`).set({entry_valid:1}).where(`session_key`,`=`,e(e=>e))),s;for(;;){let{rows:t}=s===void 0?C(e,n):r(s);if(t.length===0)return;U();for(let e of t){if(typeof e.session_key!=`string`||typeof e.current_session_id!=`string`||typeof e.updated_at!=`number`||typeof e.entry_json!=`string`)throw Error(`Unreadable session row during snapshot migration`);s=e.session_key;let t=Ot({current_session_id:e.current_session_id,updated_at:e.updated_at,entry_json:e.entry_json});if(!t)continue;let{entryJson:n,snapshots:r}=fn(t);if(r.length!==0){for(let t of r)i({sessionKey:e.session_key,...t});a({entryJson:n,sessionKey:e.session_key}),o(e.session_key)}}}}var jn=e((()=>{kt(),pn(),x(),H(),_(),L()}));function decodePreviousRollup(e){let t=r(e??``);if(t&&t.version===6&&typeof t.pricingFingerprint==`string`&&n(t.checkpoint)&&(t.checkpoint.kind===`jsonl`||t.checkpoint.kind===`sqlite`)&&typeof t.scannedAt==`number`&&typeof t.parsedRecords==`number`&&typeof t.countedRecords==`number`&&n(t.rollup)&&n(t.rollup.buckets)&&n(t.rollup.untimestamped))return t}function migrateSessionCostUsageRollupStorage(e,t){let n=ee(e),r;for(;;){t?.();let i=n.selectFrom(`cache_entries`).select([`key`,`value_json`,`updated_at`]).where(`scope`,`=`,X).orderBy(`key`,`asc`).limit(1);r!==void 0&&(i=i.where(`key`,`>`,r));let a=C(e,i).rows[0];if(!a)break;r=a.key;let o=decodePreviousRollup(a.value_json);if(o){let t=gn(o);C(e,n.insertInto(`cache_entries`).values({scope:vn,key:a.key,value_json:t.valueJson,blob:t.blob,updated_at:a.updated_at,expires_at:null}).onConflict(e=>e.columns([`scope`,`key`]).doNothing()))}C(e,n.deleteFrom(`cache_entries`).where(`scope`,`=`,X).where(`key`,`=`,a.key))}}var X,Mn=e((()=>{i(),t(),x(),_n(),X=`session-cost-usage-rollup-v2`}));function migrateDeployedTranscriptFtsRowsInTransaction(e,t){if(!e.isTransaction||e.prepare(`PRAGMA foreign_keys`).get()?.foreign_keys!==0)throw Error(`Transcript FTS migration requires an admitted transaction with foreign keys off`);N(e,`deployed transcript FTS ownership`,Fe);let n=e.prepare(`PRAGMA table_xinfo(session_transcript_fts_rows)`).all();if(n.length!==2||n.some(e=>e.name!==`session_id`&&e.name!==`fts_rowid`))throw Error(`Transcript FTS migration cannot discard unknown row-map columns`);let r=e.prepare(`SELECT name FROM sqlite_schema
    WHERE (tbl_name = 'session_transcript_fts_rows' AND sql IS NOT NULL
      AND type IN ('index', 'trigger') AND name != 'idx_agent_transcript_fts_rows_session')
      OR (type IN ('view', 'trigger') AND sql LIKE '%session_transcript_fts_rows%')`).all(),i=e.prepare(`SELECT schema.name FROM sqlite_schema AS schema
    JOIN pragma_foreign_key_list(schema.name) AS fk
    WHERE schema.type = 'table' AND fk."table" = 'session_transcript_fts_rows'`).all();if(r.length||i.length)throw Error(`Transcript FTS migration cannot discard unknown row-map dependencies`);if(e.prepare(`SELECT 1 FROM sqlite_schema WHERE name = ?`).get(Z))throw Error(`Transcript FTS migration table already exists`);e.exec(`ALTER TABLE session_transcript_fts_rows RENAME TO ${Z}`),e.exec(y(t,`session_transcript_fts_rows`,{endMarker:`INSERT OR IGNORE INTO memory_index_state`,includeEndMarker:!1})),e.exec(`INSERT INTO session_transcript_fts_rows (id, session_id, message_id)
    SELECT rowid, session_id, message_id FROM session_transcript_fts`),e.exec(`UPDATE session_transcript_index_state AS state SET needs_rebuild = 1
    WHERE needs_rebuild = 0 AND (
      fts_row_count IS NULL
      OR fts_row_count != (SELECT count(*) FROM ${Z} AS old WHERE old.session_id = state.session_id)
      OR EXISTS (
        SELECT 1 FROM ${Z} AS old
        WHERE old.session_id = state.session_id AND NOT EXISTS (
          SELECT 1 FROM session_transcript_fts_rows AS current
          WHERE current.id = old.fts_rowid AND current.session_id = old.session_id))
      OR EXISTS (
        SELECT 1 FROM session_transcript_fts_rows AS current
        WHERE current.session_id = state.session_id AND NOT EXISTS (
          SELECT 1 FROM ${Z} AS old
          WHERE old.fts_rowid = current.id AND old.session_id = current.session_id))
    );
    DROP TABLE ${Z};
    ALTER TABLE session_transcript_index_state DROP COLUMN fts_row_count;`)}var Z,Nn=e((()=>{M(),v(),Ve(),Z=`session_transcript_fts_rows_legacy22`}));function assertTranscriptRebuildInputs(e){N(e,`transcript payload migration`,y(je(h),`transcript_events`));let t=e.prepare(`PRAGMA table_xinfo(transcript_events)`).all(),n=/* @__PURE__ */ new Set([`session_id`,`seq`,`event_json`,`created_at`]);if(t.length!==n.size||t.some(e=>typeof e.name!=`string`||!n.has(e.name)))throw Error(`Transcript payload migration cannot discard unknown columns`);if(e.prepare(`SELECT name FROM sqlite_schema
      WHERE (type IN ('trigger', 'index') AND tbl_name = 'transcript_events' AND sql IS NOT NULL)
         OR (type IN ('view', 'trigger') AND sql LIKE '%transcript_events%')`).all().length>0)throw Error(`Transcript payload migration cannot rebuild unknown indexes, views, or triggers`);if(e.prepare(`SELECT 1 FROM sqlite_schema WHERE name = ?`).get(Q))throw Error(`Transcript payload migration table already exists`);for(let t of e.prepare(`SELECT name FROM sqlite_schema WHERE type = 'table'`).all()){if(typeof t.name!=`string`)throw Error(`Invalid table name during transcript payload migration`);if(!Pn.has(t.name)&&e.prepare(`PRAGMA foreign_key_list(${b(t.name)})`).all().some(e=>e.table===`transcript_events`))throw Error(`Transcript payload migration cannot rebuild an unknown foreign-key target`)}}function migrateTranscriptPayloadStorageInTransaction(e,t){if(!e.isTransaction||e.prepare(`PRAGMA foreign_keys`).get()?.foreign_keys!==0)throw Error(`Transcript payload migration requires an admitted transaction with foreign keys off`);assertTranscriptRebuildInputs(e);let n=ne(e)===`UTF-8`,r=new TextDecoder(`utf-8`,{fatal:!0,ignoreBOM:!0}),i=mn();e.exec(y(t,`transcript_events`).replace(`IF NOT EXISTS transcript_events`,Q));let a=e.prepare(`
    INSERT INTO ${Q}
      (rowid, session_id, seq, event_json, created_at, event_zstd, event_utf8_bytes, navigation_json)
    SELECT rowid, session_id, seq, event_json, created_at, NULL,
           CASE WHEN ? THEN octet_length(event_json) ELSE NULL END, ?
    FROM transcript_events WHERE rowid = ?`),o=e.prepare(`
    INSERT INTO ${Q}
      (rowid, session_id, seq, event_json, created_at, event_zstd, event_utf8_bytes, navigation_json)
    SELECT rowid, session_id, seq, NULL, created_at, ?, ?, ?
    FROM transcript_events WHERE rowid = ?`);a.setReadBigInts(!0),o.setReadBigInts(!0);let s=e.prepare(`SELECT CAST(event_json AS BLOB) AS bytes FROM transcript_events WHERE rowid = ?`),c=e.prepare(`SELECT rowid AS storage_rowid, octet_length(event_json) AS bytes FROM transcript_events ORDER BY rowid`);c.setReadBigInts(!0);let l=performance.now();for(let t of c.iterate()){if(performance.now()-l>=1e3&&(U(),l=performance.now()),typeof t.storage_rowid!=`bigint`||typeof t.bytes!=`bigint`)throw Error(`Invalid transcript storage identity during migration`);let c=null,u=!1;if(n&&t.bytes<=BigInt(4194304)){let n=s.get(t.storage_rowid)?.bytes;if(!(n instanceof Uint8Array))throw Error(`Transcript payload disappeared during migration`);let a;try{a=r.decode(n)}catch{}if(a!==void 0){let r=bn(e,a,void 0,`UTF-8`);if(c=r.navigation_json,r.event_zstd!==null){if(r.event_utf8_bytes===null||!i.decompress(r.event_zstd,r.event_utf8_bytes).equals(n))throw Error(`Transcript compression did not preserve canonical bytes`);let e=o.run(r.event_zstd,r.event_utf8_bytes,c,t.storage_rowid);if(Number(e.changes)!==1)throw Error(`Transcript payload disappeared before migration publication`);u=!0}}}if(!u&&Number(a.run(+!!n,c,t.storage_rowid).changes)!==1)throw Error(`Transcript identity payload disappeared before migration publication`)}U(),e.exec(`DROP TABLE transcript_events;
    ALTER TABLE ${Q} RENAME TO transcript_events;`)}var Q,Pn,Fn=e((()=>{yn(),E(),M(),v(),hn(),H(),_(),Me(),Q=`transcript_events_payload_migration`,Pn=/* @__PURE__ */ new Set([`transcript_event_identities`,`session_transcript_active_events`])}));function migrateAgentStorageInTransaction(e,t,n,r){if(U(),Ne(e,{renewAuthority:U,onWarning:e=>r.push(e)}),U(),n===22)migrateDeployedTranscriptFtsRowsInTransaction(e,t);else if(e.prepare(`SELECT 1 FROM sqlite_schema WHERE name = ?`).get(`session_transcript_fts_rows`))throw Error(`Transcript FTS row map already exists before the schema-23 storage migration.`);U(),migrateTranscriptPayloadStorageInTransaction(e,t),U(),migrateSessionCostUsageRollupStorage(e,U),U(),e.exec(t),n!==22&&e.exec(`
    INSERT INTO session_transcript_fts_rows (id, session_id, message_id)
    SELECT rowid, session_id, message_id FROM session_transcript_fts;
  `)}var In=e((()=>{Re(),Mn(),P(),H(),Nn(),Fn()}));function*agentDatabaseIntegrityBeforeMutationSteps(e,t,n,{runtimeAdmission:r=!1,diagnostics:i,verification:a,reuseRuntimeIntegrity:o=!1,admittedSchema:s=!1,integrityCheck:c,integrityTables:l}={}){let u=r&&o;if(u&&s)return i&&(i.integrityGateOutcome=`cached`),!1;le(e,A);let d=w(e)?.userVersion??k(e),f=d===0&&tt(e),p=d===0&&f||d>0&&d<42;p&&$.info(`agent database schema migration pending; verifying integrity first`,{fromVersion:d,path:n,toVersion:42});let m=d===42&&nn(e),h=F({kind:`agent`,foundVersion:d,supportedVersion:42},c),g=performance.now();if(d===42&&!m){let o=r&&!a&&!u&&c!==`full`?sn(e,n,t,i):void 0,s=u||a!==void 0&&!p&&!m,validateSchema=r=>Qt(e,{agentId:t,pathname:n},r),d=o??(yield*Ce(e,n,`-- Session storage doctrine: session_nodes.entry_json owns hot logical-session facts;
-- session_entry_snapshots owns keyed cold values. Promoted node columns are query
-- indexes; session_windows and their children own transcript generations.
-- Legacy ACP provenance is private import evidence carried with its logical session.

CREATE TABLE IF NOT EXISTS schema_meta (
  meta_key TEXT NOT NULL PRIMARY KEY,
  role TEXT NOT NULL,
  schema_version INTEGER NOT NULL,
  agent_id TEXT,
  app_version TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS session_nodes (
  session_key TEXT NOT NULL PRIMARY KEY,
  current_session_id TEXT NOT NULL,
  entry_json TEXT NOT NULL,
  session_started_at INTEGER,
  has_optional_references INTEGER NOT NULL DEFAULT 0,
  snapshot_revision INTEGER NOT NULL DEFAULT 0,
  legacy_acp_migration_json TEXT,
  entry_valid INTEGER NOT NULL DEFAULT 0 CHECK (entry_valid IN (-1, 0, 1)),
  updated_at INTEGER NOT NULL,
  status TEXT CHECK (status IS NULL OR status IN ('running', 'done', 'failed', 'killed', 'timeout')),
  created_at INTEGER,
  created_via TEXT CHECK (created_via IS NULL OR created_via IN ('operator', 'spawn', 'channel', 'cron', 'talk', 'run', 'plugin', 'internal')),
  created_actor_type TEXT CHECK (created_actor_type IS NULL OR created_actor_type IN ('human', 'agent', 'system')),
  created_actor_id TEXT,
  owner_actor_type TEXT,
  owner_actor_id TEXT,
  owner_assigned_by_type TEXT,
  owner_assigned_by_id TEXT,
  owner_assigned_at INTEGER,
  project_id TEXT,
  parent_session_key TEXT,
  spawned_by TEXT,
  fork_source_session_key TEXT,
  fork_source_session_id TEXT,
  fork_source_entry_id TEXT,
  label TEXT,
  display_name TEXT,
  category TEXT,
  icon TEXT,
  pinned_at INTEGER,
  archived_at INTEGER,
  last_read_at INTEGER,
  last_interaction_at INTEGER,
  last_activity_at INTEGER
) STRICT;

CREATE TABLE IF NOT EXISTS session_entry_snapshots (
  session_key TEXT NOT NULL,
  field TEXT NOT NULL CHECK (field IN ('sessionDiffBaseline', 'skillsSnapshot', 'systemPromptReport')),
  value_json TEXT NOT NULL,
  PRIMARY KEY (session_key, field),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
) STRICT, WITHOUT ROWID;

CREATE TRIGGER IF NOT EXISTS session_entry_snapshots_after_insert
AFTER INSERT ON session_entry_snapshots
BEGIN
  UPDATE session_nodes SET snapshot_revision = snapshot_revision + 1
  WHERE session_key = NEW.session_key;
END;

CREATE TRIGGER IF NOT EXISTS session_entry_snapshots_after_update
AFTER UPDATE OF session_key, field, value_json ON session_entry_snapshots
WHEN NEW.session_key IS NOT OLD.session_key
  OR NEW.field IS NOT OLD.field OR NEW.value_json IS NOT OLD.value_json
BEGIN
  UPDATE session_nodes SET snapshot_revision = snapshot_revision + 1
  WHERE session_key IN (OLD.session_key, NEW.session_key);
END;

CREATE TRIGGER IF NOT EXISTS session_entry_snapshots_after_delete
AFTER DELETE ON session_entry_snapshots
BEGIN
  UPDATE session_nodes SET snapshot_revision = snapshot_revision + 1
  WHERE session_key = OLD.session_key;
END;

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_updated_at
  ON session_nodes(updated_at DESC, session_key);

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_label
  ON session_nodes(label, session_key)
  WHERE label IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_parent_session_key
  ON session_nodes(parent_session_key, session_key);

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_spawned_by
  ON session_nodes(spawned_by, session_key);

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_status
  ON session_nodes(status, session_key)
  WHERE status IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_archived_at
  ON session_nodes(archived_at, session_key)
  WHERE archived_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_active
  ON session_nodes(session_key)
  WHERE archived_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_current_session_id
  ON session_nodes(current_session_id);

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_entry_valid_pending
  ON session_nodes(session_key)
  WHERE entry_valid = 0;

CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_entry_not_valid
  ON session_nodes(session_key)
  WHERE entry_valid != 1;

CREATE TABLE IF NOT EXISTS session_participants (
  session_key TEXT NOT NULL,
  identity_namespace TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  contribution_count INTEGER NOT NULL,
  first_prompted_at INTEGER,
  last_prompted_at INTEGER,
  PRIMARY KEY (session_key, identity_namespace, actor_id),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS session_key_contract (
  id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),
  main_key TEXT NOT NULL,
  canonical_ready TEXT,
  updated_at INTEGER NOT NULL
) STRICT;

INSERT OR IGNORE INTO session_key_contract (id, main_key, updated_at) VALUES (1, 'main', 0);

CREATE TABLE IF NOT EXISTS session_windows (
  session_id TEXT NOT NULL PRIMARY KEY,
  session_key TEXT NOT NULL,
  previous_session_id TEXT,
  reason TEXT CHECK (reason IS NULL OR reason IN ('initial', 'reset', 'rollover', 'fork', 'rewind', 'switch', 'recovery', 'compaction')),
  session_scope TEXT NOT NULL DEFAULT 'conversation' CHECK (session_scope IN ('conversation', 'shared-main', 'group', 'channel')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  transcript_updated_at INTEGER DEFAULT NULL,
  row_transcript_json TEXT,
  row_transcript_updated_at INTEGER,
  transcript_observed_at INTEGER DEFAULT NULL,
  session_entry_provenance INTEGER NOT NULL DEFAULT 0 CHECK (session_entry_provenance IN (0, 1)),
  acp_owned INTEGER NOT NULL DEFAULT 0 CHECK (acp_owned IN (0, 1)),
  plugin_owner_id TEXT,
  hook_external_content_source TEXT CHECK (hook_external_content_source IS NULL OR hook_external_content_source IN ('gmail', 'webhook')),
  started_at INTEGER,
  ended_at INTEGER,
  status TEXT CHECK (status IS NULL OR status IN ('running', 'done', 'failed', 'killed', 'timeout')),
  chat_type TEXT CHECK (chat_type IS NULL OR chat_type IN ('direct', 'group', 'channel')),
  channel TEXT,
  account_id TEXT,
  primary_conversation_id TEXT,
  model_provider TEXT,
  model TEXT,
  agent_harness_id TEXT,
  parent_session_key TEXT,
  spawned_by TEXT,
  display_name TEXT,
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE,
  FOREIGN KEY (primary_conversation_id) REFERENCES conversations(conversation_id) ON DELETE SET NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_session_windows_updated_at
  ON session_windows(updated_at DESC, session_id);

CREATE INDEX IF NOT EXISTS idx_agent_session_windows_session_key
  ON session_windows(session_key, updated_at DESC, session_id);

CREATE INDEX IF NOT EXISTS idx_agent_session_windows_created_at
  ON session_windows(created_at DESC, session_id);

CREATE INDEX IF NOT EXISTS idx_agent_session_windows_conversation
  ON session_windows(primary_conversation_id)
  WHERE primary_conversation_id IS NOT NULL;

-- Offline imports and repairs queue explicit work; admission also settles keys
-- removed during repair, so the queue deliberately has no node foreign key.
CREATE TABLE IF NOT EXISTS session_canonical_validation_pending (
  session_key TEXT NOT NULL PRIMARY KEY
) STRICT;

CREATE TABLE IF NOT EXISTS conversations (
  conversation_id TEXT NOT NULL PRIMARY KEY,
  channel TEXT NOT NULL,
  account_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('direct', 'group', 'channel')),
  peer_id TEXT NOT NULL,
  delivery_target TEXT NOT NULL,
  parent_conversation_id TEXT,
  thread_id TEXT,
  native_channel_id TEXT,
  native_direct_user_id TEXT,
  label TEXT,
  metadata_json TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_conversations_lookup
  ON conversations(channel, account_id, kind, peer_id, thread_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_agent_conversations_identity
  ON conversations(
    channel,
    account_id,
    kind,
    peer_id,
    IFNULL(parent_conversation_id, ''),
    IFNULL(thread_id, '')
  );

CREATE INDEX IF NOT EXISTS idx_agent_conversations_updated
  ON conversations(updated_at DESC, conversation_id);

CREATE TABLE IF NOT EXISTS conversation_deliveries (
  operation_id TEXT NOT NULL PRIMARY KEY,
  operation_kind TEXT NOT NULL CHECK (operation_kind IN ('send', 'turn')),
  conversation_id TEXT NOT NULL,
  source_session_key TEXT,
  message_hash TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('created', 'queued', 'sent', 'suppressed', 'rejected', 'unknown', 'replied')),
  prepared_message_id TEXT,
  platform_message_id TEXT,
  queue_id TEXT,
  rejection_error TEXT,
  reply_message_id TEXT,
  reply_to_id TEXT,
  reply_thread_id TEXT,
  reply_text TEXT,
  reply_timestamp INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  CHECK (
    (status = 'rejected' AND rejection_error IS NOT NULL) OR
    (status != 'rejected' AND rejection_error IS NULL)
  ),
  FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_conversation_deliveries_reply
  ON conversation_deliveries(conversation_id, platform_message_id, prepared_message_id)
  WHERE status IN ('queued', 'sent', 'replied');

CREATE INDEX IF NOT EXISTS idx_agent_conversation_deliveries_updated
  ON conversation_deliveries(updated_at DESC, operation_id);

CREATE INDEX IF NOT EXISTS idx_agent_conversation_deliveries_source_session
  ON conversation_deliveries(source_session_key, operation_id);

CREATE TABLE IF NOT EXISTS session_conversations (
  session_id TEXT NOT NULL,
  conversation_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'primary' CHECK (role IN ('primary', 'participant', 'related')),
  route_context_json TEXT,
  first_seen_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL,
  PRIMARY KEY (session_id, conversation_id, role),
  FOREIGN KEY (session_id) REFERENCES "session_windows"(session_id) ON DELETE CASCADE,
  FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE
) STRICT;

-- Older same-version writers preserve the envelope while updating the association.
CREATE TRIGGER IF NOT EXISTS session_conversations_route_context_invalidate_after_update
AFTER UPDATE OF role, last_seen_at ON session_conversations
WHEN NEW.route_context_json IS OLD.route_context_json
BEGIN
  UPDATE session_conversations
  SET route_context_json = NULL
  WHERE session_id = NEW.session_id
    AND conversation_id = NEW.conversation_id
    AND role = NEW.role;
END;

CREATE INDEX IF NOT EXISTS idx_agent_session_conversations_conversation
  ON session_conversations(conversation_id, last_seen_at DESC, session_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_agent_session_conversations_primary
  ON session_conversations(session_id)
  WHERE role = 'primary';

CREATE TABLE IF NOT EXISTS session_members (
  session_key TEXT NOT NULL,
  identity_id TEXT NOT NULL,
  added_by TEXT NOT NULL,
  added_at INTEGER NOT NULL,
  PRIMARY KEY (session_key, identity_id),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_session_members_identity
  ON session_members(identity_id, session_key);

CREATE TABLE IF NOT EXISTS session_suggestions (
  id TEXT PRIMARY KEY,
  session_key TEXT NOT NULL,
  author_id TEXT NOT NULL,
  author_label TEXT,
  text TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('pending', 'accepted', 'dismissed')),
  dispatch_token TEXT,
  dispatch_started_at INTEGER,
  dispatch_resolution TEXT CHECK (dispatch_resolution IN ('send', 'queue', 'edit', 'dismiss')),
  CHECK (
    (dispatch_token IS NULL AND dispatch_started_at IS NULL AND dispatch_resolution IS NULL)
    OR (dispatch_token IS NOT NULL AND dispatch_started_at IS NOT NULL AND dispatch_resolution IS NOT NULL)
  ),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_session_suggestions_session_state_created
  ON session_suggestions(session_key, state, created_at, id);

CREATE INDEX IF NOT EXISTS idx_agent_session_suggestions_author_created
  ON session_suggestions(author_id, created_at, id);

CREATE TABLE IF NOT EXISTS session_reactions (
  session_key TEXT NOT NULL,
  session_id TEXT NOT NULL,
  message_id TEXT NOT NULL,
  emoji TEXT NOT NULL,
  identity_id TEXT NOT NULL,
  identity_label TEXT,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (session_key, session_id, message_id, emoji, identity_id),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS board_tabs (
  session_key TEXT NOT NULL,
  tab_id TEXT NOT NULL,
  title TEXT NOT NULL,
  position INTEGER NOT NULL CHECK (position >= 0),
  chat_dock TEXT NOT NULL DEFAULT 'right' CHECK (chat_dock IN ('left', 'right', 'bottom', 'hidden')),
  created_by TEXT NOT NULL CHECK (created_by IN ('user', 'agent')),
  revision INTEGER NOT NULL CHECK (revision >= 0),
  PRIMARY KEY (session_key, tab_id),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS board_widgets (
  session_key TEXT NOT NULL,
  name TEXT NOT NULL,
  tab_id TEXT NOT NULL,
  title TEXT,
  content_kind TEXT NOT NULL CHECK (content_kind IN ('html', 'mcp-app', 'plugin')),
  html BLOB,
  descriptor_json TEXT,
  sha256 TEXT NOT NULL,
  view_generation TEXT,
  revision INTEGER NOT NULL CHECK (revision >= 1),
  size_w INTEGER NOT NULL CHECK (size_w BETWEEN 1 AND 12),
  size_h INTEGER NOT NULL CHECK (size_h BETWEEN 1 AND 20),
  position INTEGER NOT NULL CHECK (position >= 0),
  manifest TEXT NOT NULL DEFAULT '{}',
  grant_state TEXT NOT NULL DEFAULT 'none' CHECK (grant_state IN ('none', 'pending', 'granted', 'rejected')),
  granted_sha TEXT,
  created_by TEXT NOT NULL CHECK (created_by IN ('user', 'agent')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (session_key, name),
  FOREIGN KEY (session_key, tab_id) REFERENCES board_tabs(session_key, tab_id) ON DELETE CASCADE,
  CHECK (
    (content_kind = 'html' AND html IS NOT NULL AND descriptor_json IS NULL AND view_generation IS NOT NULL) OR
    (content_kind = 'mcp-app' AND html IS NULL AND descriptor_json IS NOT NULL AND view_generation IS NULL) OR
    (content_kind = 'plugin' AND html IS NULL AND descriptor_json IS NOT NULL AND view_generation IS NULL)
  )
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_board_widgets_tab_position
  ON board_widgets(session_key, tab_id, position);

CREATE TABLE IF NOT EXISTS session_progress_cards (
  session_key TEXT NOT NULL PRIMARY KEY,
  markdown TEXT,
  steps_json TEXT,
  revision INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS heartbeat_outcomes (
  session_key TEXT NOT NULL PRIMARY KEY,
  run_session_key TEXT NOT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('progress', 'done', 'blocked', 'needs_attention')),
  summary TEXT NOT NULL,
  response_reason TEXT,
  priority TEXT CHECK (priority IS NULL OR priority IN ('low', 'normal', 'high')),
  next_check TEXT,
  task_names_json TEXT,
  wake_source TEXT,
  wake_reason TEXT,
  occurred_at INTEGER NOT NULL,
  context_run_id TEXT,
  context_claimed_at INTEGER,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS message_tool_run_outcomes (
  id INTEGER PRIMARY KEY,
  run_id TEXT NOT NULL,
  session_key TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('tool_delivered', 'mute')),
  run_status TEXT NOT NULL CHECK (run_status IN ('completed', 'errored', 'aborted')),
  occurred_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_message_tool_run_outcomes_occurred
  ON message_tool_run_outcomes(occurred_at DESC, id DESC);

-- Receipts outlive Goal clear and session reset so a delayed retry cannot recreate a Goal.
-- They intentionally have no session FK; bounded retention belongs to the operation owner.
CREATE TABLE IF NOT EXISTS session_creation_operations (
  operation_digest TEXT PRIMARY KEY,
  request_fingerprint TEXT NOT NULL,
  session_key TEXT NOT NULL,
  session_id TEXT NOT NULL,
  lifecycle_revision TEXT,
  role TEXT,
  scopes_json TEXT NOT NULL,
  expires_at INTEGER NOT NULL
) STRICT;
CREATE INDEX IF NOT EXISTS idx_agent_session_creation_operations_expiry
  ON session_creation_operations(expires_at);
-- END SESSION CREATION OPERATIONS

CREATE TABLE IF NOT EXISTS session_goal_operations (
  session_key TEXT NOT NULL,
  operation_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  request_fingerprint TEXT NOT NULL,
  result_json TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  PRIMARY KEY (session_key, operation_id)
) STRICT;
CREATE INDEX IF NOT EXISTS idx_agent_session_goal_operations_expiry
  ON session_goal_operations(expires_at);

CREATE TABLE IF NOT EXISTS transcript_events (
  session_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  event_json TEXT,
  created_at INTEGER NOT NULL,
  event_zstd BLOB,
  event_utf8_bytes INTEGER CHECK (event_utf8_bytes IS NULL OR event_utf8_bytes >= 0),
  navigation_json TEXT,
  navigation_type TEXT,
  navigation_custom_type TEXT,
  navigation_display INTEGER NOT NULL DEFAULT 0,
  message_role TEXT,
  navigation_last_type TEXT,
  navigation_last_custom_type TEXT,
  navigation_valid INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (session_id, seq),
  FOREIGN KEY (session_id) REFERENCES "session_windows"(session_id) ON DELETE CASCADE,
  CHECK (
    (event_json IS NOT NULL AND event_zstd IS NULL)
    OR (
      event_json IS NULL AND event_zstd IS NOT NULL
      AND event_utf8_bytes IS NOT NULL
      AND event_utf8_bytes BETWEEN 1 AND 4194304
      AND length(event_zstd) BETWEEN 1 AND 4194304
      AND navigation_json IS NOT NULL
    )
    OR (
      event_json IS NULL AND event_zstd IS NULL
      AND event_utf8_bytes IS NOT NULL
      AND event_utf8_bytes BETWEEN 1 AND 4194304
      AND navigation_json IS NOT NULL
    )
  ),
  CHECK (
    navigation_json IS NULL OR CASE WHEN json_valid(navigation_json) THEN coalesce(
      octet_length(navigation_json) <= 16384
      AND json_type(navigation_json, '$.version') = 'integer'
      AND json_extract(navigation_json, '$.version') = 1
      AND json_type(navigation_json, '$.report') = 'object'
      AND json_extract(navigation_json, '$.report.kind') IN ('canonical', 'leaf', 'link', 'ignored')
      AND json_type(navigation_json, '$.navigation') = 'object'
      AND json_type(navigation_json, '$.reset') = 'object'
      AND json_type(navigation_json, '$.model') = 'object'
      AND json_type(navigation_json, '$.modelBytes') = 'integer'
      AND json_extract(navigation_json, '$.modelBytes') BETWEEN 0 AND 4194304
      AND json_type(navigation_json, '$.modelWithoutCheckpointBytes') = 'integer'
      AND json_extract(navigation_json, '$.modelWithoutCheckpointBytes') BETWEEN 0 AND 4194304
      AND json_type(navigation_json, '$.withoutCustomDataBytes') = 'integer'
      AND json_extract(navigation_json, '$.withoutCustomDataBytes') BETWEEN 0 AND 4194304,
      0) ELSE 0 END
  )
) STRICT;

-- Canonical cold-tier owner for reclaimed transcript generations. The derived
-- .deleted/.reset file may be recreated from this row after a crash.
CREATE TABLE IF NOT EXISTS session_transcript_archives (
  session_id TEXT NOT NULL,
  generation TEXT NOT NULL,
  session_key TEXT NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('deleted', 'reset')),
  encoding TEXT NOT NULL CHECK (encoding IN ('identity', 'zstd')),
  archive_blob BLOB NOT NULL,
  archive_sha256 TEXT NOT NULL CHECK (length(archive_sha256) = 64),
  archive_name TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  published_at INTEGER,
  publish_attempts INTEGER NOT NULL DEFAULT 0 CHECK (publish_attempts >= 0),
  last_publish_attempt_at INTEGER,
  last_publish_error TEXT,
  PRIMARY KEY (session_id, generation),
  CHECK (archive_name NOT LIKE '%/%' AND archive_name NOT LIKE '%\\%')
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_session_transcript_archives_pending
  ON session_transcript_archives(created_at, session_id, generation)
  WHERE published_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_agent_session_transcript_archives_retention
  ON session_transcript_archives(created_at, session_id, generation);

CREATE TABLE IF NOT EXISTS session_transcript_cold_archives (
  session_id TEXT NOT NULL PRIMARY KEY,
  generation TEXT NOT NULL,
  archive_name TEXT NOT NULL UNIQUE,
  archive_sha256 TEXT NOT NULL CHECK (length(archive_sha256) = 64),
  event_count INTEGER NOT NULL CHECK (event_count >= 1),
  raw_bytes INTEGER NOT NULL CHECK (raw_bytes >= 0),
  archive_bytes INTEGER NOT NULL CHECK (archive_bytes >= 0),
  last_seq INTEGER NOT NULL,
  archived_at INTEGER NOT NULL,
  storage TEXT NOT NULL CHECK (storage IN ('file', 'sqlite')),
  archive_blob BLOB,
  FOREIGN KEY (session_id) REFERENCES "session_windows"(session_id) ON DELETE CASCADE,
  CHECK (length(archive_name) > 0 AND archive_name NOT IN ('.', '..') AND archive_name NOT LIKE '%/%' AND archive_name NOT LIKE '%\\%'),
  CHECK ((storage = 'file' AND archive_blob IS NULL) OR (storage = 'sqlite' AND archive_blob IS NOT NULL))
) STRICT;

CREATE TABLE IF NOT EXISTS session_transcript_cold_archive_chunks (
  session_id TEXT NOT NULL,
  chunk_index INTEGER NOT NULL CHECK (chunk_index >= 0),
  archive_name TEXT NOT NULL UNIQUE,
  archive_sha256 TEXT NOT NULL CHECK (length(archive_sha256) = 64),
  first_seq INTEGER NOT NULL,
  last_seq INTEGER NOT NULL CHECK (last_seq >= first_seq),
  event_count INTEGER NOT NULL CHECK (event_count >= 1),
  raw_bytes INTEGER NOT NULL CHECK (raw_bytes >= 0),
  archive_bytes INTEGER NOT NULL CHECK (archive_bytes >= 0),
  archive_blob BLOB,
  PRIMARY KEY (session_id, chunk_index),
  FOREIGN KEY (session_id) REFERENCES session_transcript_cold_archives(session_id) ON DELETE CASCADE,
  CHECK (length(archive_name) > 0 AND archive_name NOT IN ('.', '..') AND archive_name NOT LIKE '%/%' AND archive_name NOT LIKE '%\\%')
) STRICT, WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS transcript_rewrite_watermarks (
  session_id TEXT NOT NULL PRIMARY KEY,
  generation TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (session_id) REFERENCES "session_windows"(session_id) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS trajectory_runtime_events (
  session_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  run_id TEXT,
  event_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  event_utf8_bytes INTEGER,
  event_payload BLOB,
  event_codec TEXT,
  PRIMARY KEY (session_id, seq),
  FOREIGN KEY (session_id) REFERENCES "session_windows"(session_id) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_trajectory_runtime_run
  ON trajectory_runtime_events(session_id, run_id, created_at, COALESCE(event_utf8_bytes, octet_length(event_json)));

CREATE TABLE IF NOT EXISTS acp_parent_stream_events (
  session_id TEXT NOT NULL,
  run_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  event_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (session_id, run_id, seq),
  FOREIGN KEY (session_id) REFERENCES "session_windows"(session_id) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_acp_parent_stream_run
  ON acp_parent_stream_events(run_id, seq);

CREATE TABLE IF NOT EXISTS transcript_event_identities (
  session_id TEXT NOT NULL,
  event_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  event_type TEXT,
  parent_id TEXT,
  message_idempotency_key TEXT,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (session_id, event_id),
  FOREIGN KEY (session_id, seq) REFERENCES transcript_events(session_id, seq) ON DELETE CASCADE
) STRICT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_agent_transcript_message_idempotency
  ON transcript_event_identities(session_id, message_idempotency_key)
  WHERE message_idempotency_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_agent_transcript_event_identity_sequence
  ON transcript_event_identities(session_id, seq);

CREATE INDEX IF NOT EXISTS idx_agent_transcript_event_sequence
  ON transcript_event_identities(session_id, event_type, seq DESC);

CREATE TABLE IF NOT EXISTS context_engine_turn_outbox (
  enqueue_sequence INTEGER PRIMARY KEY,
  advancement_key TEXT NOT NULL UNIQUE,
  engine_id TEXT NOT NULL,
  owner_plugin_id TEXT,
  session_id TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  payload_state TEXT,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  last_attempt_at INTEGER,
  last_error TEXT,
  created_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_context_engine_turn_outbox_engine
  ON context_engine_turn_outbox(engine_id, created_at);

CREATE TABLE IF NOT EXISTS agent_tool_usage (
  tool_id TEXT PRIMARY KEY NOT NULL,
  score REAL NOT NULL CHECK (score >= 0),
  updated_at INTEGER NOT NULL
) STRICT;
-- END AGENT TOOL USAGE

CREATE TABLE IF NOT EXISTS cache_entries (
  scope TEXT NOT NULL,
  key TEXT NOT NULL,
  value_json TEXT,
  blob BLOB,
  expires_at INTEGER,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (scope, key)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_cache_expiry
  ON cache_entries(scope, expires_at, key)
  WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_agent_cache_updated
  ON cache_entries(scope, updated_at DESC, key);

CREATE INDEX IF NOT EXISTS idx_agent_voice_session_open_scope
  ON cache_entries(CASE WHEN json_valid(value_json) THEN json_extract(value_json, '$.agentId') END,
    CASE WHEN json_valid(value_json) THEN json_extract(value_json, '$.sessionKey') END, CASE WHEN json_valid(value_json) THEN json_extract(value_json, '$.origin') END)
  WHERE scope = 'talk-client-voice-sessions'
    AND CASE WHEN json_valid(value_json) THEN json_extract(value_json, '$.status') END = 'open';

CREATE INDEX IF NOT EXISTS idx_agent_voice_session_open_updated
  ON cache_entries(scope, updated_at)
  WHERE scope = 'talk-client-voice-sessions'
    AND CASE WHEN json_valid(value_json) THEN json_extract(value_json, '$.status') END = 'open';

CREATE TABLE IF NOT EXISTS auth_profile_store (
  store_key TEXT NOT NULL PRIMARY KEY,
  store_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS auth_profile_state (
  state_key TEXT NOT NULL PRIMARY KEY,
  state_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS memory_index_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS memory_index_sources (
  id INTEGER PRIMARY KEY,
  path TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'memory',
  hash TEXT NOT NULL,
  mtime REAL NOT NULL,
  size INTEGER NOT NULL,
  UNIQUE (path, source)
) STRICT;

CREATE TABLE IF NOT EXISTS memory_index_chunks (
  chunk_rowid INTEGER PRIMARY KEY,
  id TEXT NOT NULL UNIQUE,
  path TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'memory',
  start_line INTEGER NOT NULL,
  end_line INTEGER NOT NULL,
  hash TEXT NOT NULL,
  model TEXT NOT NULL,
  text TEXT NOT NULL,
  embedding BLOB NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS memory_index_chunk_recall_metadata (
  chunk_id TEXT PRIMARY KEY,
  importance INTEGER CHECK (importance IS NULL OR importance BETWEEN 1 AND 10),
  triggers TEXT,
  project_key TEXT,
  FOREIGN KEY (chunk_id) REFERENCES memory_index_chunks(id) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS memory_index_chunk_provenance (
  chunk_id TEXT PRIMARY KEY,
  origin_class TEXT NOT NULL CHECK (origin_class IN ('owner', 'agent', 'untrusted', 'system')),
  session_kind TEXT NOT NULL CHECK (session_kind IN ('interactive', 'cron', 'heartbeat', 'subagent', 'unknown')),
  observed_at INTEGER NOT NULL,
  supersedes_key TEXT,
  FOREIGN KEY (chunk_id) REFERENCES memory_index_chunks(id) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS memory_entry_origins (
  entry_key TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  session_key TEXT,
  origin_class TEXT NOT NULL CHECK (origin_class IN ('owner', 'agent', 'untrusted', 'system')),
  observed_at INTEGER NOT NULL,
  PRIMARY KEY (entry_key, agent_id, session_id)
) STRICT, WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS memory_session_tombstones (
  session_id TEXT NOT NULL PRIMARY KEY,
  agent_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS memory_embedding_cache (
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  provider_key TEXT NOT NULL,
  hash TEXT NOT NULL,
  embedding BLOB NOT NULL,
  dims INTEGER,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (provider, model, provider_key, hash)
) STRICT;

CREATE TABLE IF NOT EXISTS memory_index_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  revision INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS standing_intents (
  intent_key INTEGER PRIMARY KEY,
  id TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  trigger_keywords TEXT NOT NULL,
  trigger_embedding TEXT,
  channel_scope TEXT,
  sender_scope TEXT,
  creator_sender TEXT CHECK (creator_sender IS NULL OR length(trim(creator_sender)) > 0),
  status TEXT NOT NULL CHECK (status IN ('pending', 'armed', 'fired', 'done', 'cancelled', 'expired')),
  expires_at INTEGER NOT NULL,
  max_fires INTEGER NOT NULL CHECK (max_fires > 0),
  fire_count INTEGER NOT NULL DEFAULT 0 CHECK (fire_count >= 0),
  cooldown_seconds INTEGER NOT NULL DEFAULT 86400 CHECK (cooldown_seconds >= 0),
  last_fired_at INTEGER,
  created_at INTEGER NOT NULL,
  source_session_id TEXT
) STRICT;

CREATE INDEX IF NOT EXISTS idx_standing_intents_lifecycle
  ON standing_intents(status, expires_at, last_fired_at);

CREATE INDEX IF NOT EXISTS idx_standing_intents_scope
  ON standing_intents(status, channel_scope, sender_scope);

CREATE VIRTUAL TABLE IF NOT EXISTS standing_intents_fts USING fts5(
  trigger_keywords,
  content = 'standing_intents',
  content_rowid = 'intent_key',
  tokenize = 'unicode61 remove_diacritics 2'
);

CREATE TRIGGER IF NOT EXISTS standing_intents_fts_after_insert
AFTER INSERT ON standing_intents
BEGIN
  INSERT INTO standing_intents_fts(rowid, trigger_keywords)
  VALUES (new.intent_key, new.trigger_keywords);
END;

CREATE TRIGGER IF NOT EXISTS standing_intents_fts_after_delete
AFTER DELETE ON standing_intents
BEGIN
  INSERT INTO standing_intents_fts(standing_intents_fts, rowid, trigger_keywords)
  VALUES ('delete', old.intent_key, old.trigger_keywords);
END;

CREATE TRIGGER IF NOT EXISTS standing_intents_fts_after_update
AFTER UPDATE OF trigger_keywords ON standing_intents
BEGIN
  INSERT INTO standing_intents_fts(standing_intents_fts, rowid, trigger_keywords)
  VALUES ('delete', old.intent_key, old.trigger_keywords);
  INSERT INTO standing_intents_fts(rowid, trigger_keywords)
  VALUES (new.intent_key, new.trigger_keywords);
END;

CREATE TABLE IF NOT EXISTS session_transcript_index_state (
  session_id TEXT NOT NULL PRIMARY KEY,
  indexed_seq INTEGER NOT NULL,
  leaf_event_id TEXT,
  needs_rebuild INTEGER NOT NULL DEFAULT 0,
  active_event_count INTEGER NOT NULL DEFAULT 0,
  active_message_count INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (session_id) REFERENCES session_windows(session_id) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS session_transcript_active_events (
  session_id TEXT NOT NULL,
  active_position INTEGER NOT NULL CHECK (active_position >= 0),
  event_seq INTEGER NOT NULL,
  message_position INTEGER CHECK (message_position IS NULL OR message_position >= 0),
  context_eligible INTEGER,
  PRIMARY KEY (session_id, active_position),
  FOREIGN KEY (session_id, event_seq) REFERENCES transcript_events(session_id, seq) ON DELETE CASCADE
) STRICT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_agent_transcript_active_event_seq
  ON session_transcript_active_events(session_id, event_seq);

CREATE UNIQUE INDEX IF NOT EXISTS idx_agent_transcript_active_messages
  ON session_transcript_active_events(session_id, message_position)
  WHERE message_position IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_agent_transcript_context_pending
  ON session_transcript_active_events(session_id)
  WHERE context_eligible IS NULL;

CREATE TABLE IF NOT EXISTS session_transcript_active_event_facts (
  session_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  serialized_bytes INTEGER NOT NULL CHECK (serialized_bytes >= 1),
  dependency_navigation_json TEXT NOT NULL,
  PRIMARY KEY (session_id, seq),
  FOREIGN KEY (session_id, seq)
    REFERENCES session_transcript_active_events(session_id, event_seq) ON DELETE CASCADE
) STRICT, WITHOUT ROWID;
-- END ACTIVE EVENT FACTS

CREATE VIRTUAL TABLE IF NOT EXISTS session_transcript_fts USING fts5(
  text,
  session_id UNINDEXED,
  message_id UNINDEXED,
  role UNINDEXED,
  timestamp UNINDEXED,
  tokenize = 'unicode61 remove_diacritics 2'
);

CREATE TABLE IF NOT EXISTS session_transcript_fts_rows (
  id INTEGER PRIMARY KEY,
  session_id TEXT NOT NULL,
  message_id TEXT
) STRICT;

CREATE INDEX IF NOT EXISTS idx_session_transcript_fts_rows_session_message
  ON session_transcript_fts_rows(session_id, message_id);

CREATE TRIGGER IF NOT EXISTS session_transcript_fts_rows_after_delete
AFTER DELETE ON session_transcript_fts_rows
BEGIN
  DELETE FROM session_transcript_fts WHERE rowid = OLD.id;
END;

INSERT OR IGNORE INTO memory_index_state (id, revision) VALUES (1, 0);

CREATE INDEX IF NOT EXISTS idx_memory_embedding_cache_updated_at
  ON memory_embedding_cache(updated_at);

CREATE INDEX IF NOT EXISTS idx_memory_index_sources_source
  ON memory_index_sources(source);

CREATE INDEX IF NOT EXISTS idx_memory_index_chunks_path_source
  ON memory_index_chunks(path, source);

CREATE INDEX IF NOT EXISTS idx_memory_index_chunks_source
  ON memory_index_chunks(source);

-- Accepted input stays outside the active transcript until its exact turn owns execution.
CREATE TABLE IF NOT EXISTS session_pending_inputs (
  seq INTEGER PRIMARY KEY AUTOINCREMENT,
  input_id TEXT NOT NULL UNIQUE,
  session_key TEXT NOT NULL,
  session_id TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  run_id TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  message_json TEXT NOT NULL,
  lifecycle_generation TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('queued', 'interrupted', 'cancelled')),
  accepted_at INTEGER NOT NULL,
  consumed_event_id TEXT,
  UNIQUE (session_id, idempotency_key),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES session_windows(session_id) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_session_pending_inputs_session
  ON session_pending_inputs(session_key, session_id, seq DESC);

-- Processing completion is separate from input consumption; neither schedules replay.
CREATE TABLE IF NOT EXISTS session_input_completions (
  session_key TEXT NOT NULL,
  session_id TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  run_id TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  outcome_json TEXT NOT NULL,
  succeeded INTEGER NOT NULL CHECK (succeeded IN (0, 1)),
  completed_at INTEGER NOT NULL,
  PRIMARY KEY (session_id, idempotency_key),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES session_windows(session_id) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_session_input_completions_session_key
  ON session_input_completions(session_key);
`,{allowMissingColumns:!0,validateAfterRepair:validateSchema,validateUnchanged:validateSchema,diagnostics:i,reuseIntegrity:s,integrity:c?{...h,tables:l??h.tables}:void 0}));d.length>0&&$.warn(`Rebuilt canonical agent SQLite indexes for ${t} (${n}): ${d.join(`, `)}`,{agentId:t,path:n,indexes:d,elapsedMs:Math.floor(performance.now()-g)})}else d===0&&!f&&e.prepare(`PRAGMA page_count`).get()?.page_count===0?j(e,n,c?h:void 0):yield*ge(e,n,i,h);return m}function ensureAgentSchema(e,t,n,r=42,i=e=>e(),a,o=!1,s){let c=[],l=R(r);e.exec(`PRAGMA foreign_keys = OFF; PRAGMA legacy_alter_table = OFF;`);let u=!1;try{me(e,()=>{re(e);let i=z(e);V(i,t,n);let a=B(e,n),d=F({kind:`agent`,foundVersion:a,supportedVersion:r},s),p=a===0&&!tt(e),m=a<r&&(a>0||i!==null),h=r>=18&&m;if(h&&i?.schemaVersion!==a)throw Error(`Agent schema markers disagree for ${n}; repair ownership metadata before migration.`);if(a>r)throw Error(`OpenClaw agent database ${n} uses schema version ${a}; expected at most ${r} for this migration.`);!p&&a<r&&an(e,n,a);let assertMigration=()=>{m&&(h&&Ct(),f()?.assertAgentSchemaMigration({agentId:t,path:n,foundVersion:a,supportedVersion:r}))};if(assertMigration(),a<r&&Ue(e,a),p&&r===42){e.exec(l),e.exec(`PRAGMA user_version = ${r};`),It(e,t,r),u=!0;return}let crossesVersion=e=>!p&&a<e&&r>=e,g=crossesVersion(25),_=crossesVersion(23),v=crossesVersion(24),y=crossesVersion(30),b=y?nt(l):l,x=v?Pe(b):b,S=_?je(x,a):x,finishStorageMigration=()=>{if(_&&migrateAgentStorageInTransaction(e,x,a,c),v&&migrateSessionEntrySnapshotsInTransaction(e),g&&Nt(e),crossesVersion(26)&&ln(e),a<27&&r>=27){let r=migrateOutboxEnqueueSequenceInTransaction(e);r!==null&&$.info(`agent outbox enqueue sequence rebuilt`,{agentId:t,pathname:n,elapsedMs:r})}crossesVersion(28)&&Tt(e),crossesVersion(29)&&e.exec(Xe),y&&it(e),crossesVersion(31)&&e.exec(Ge),crossesVersion(37)&&e.exec(Qe),crossesVersion(39)&&We(e),crossesVersion(40)&&e.exec(Ye),crossesVersion(41)&&e.exec(Je),crossesVersion(42)&&e.exec(et),a<25&&I(e,n,l,{verifyPhysicalIntegrity:!1,integrity:d}),$t(e,t,n,r,l,h,assertMigration,m?{tables:be({kind:`agent`,foundVersion:a,supportedVersion:r}),...a>=40&&r<=42&&d.check===`quick`?{foreignKeyTables:a<41?[`session_transcript_active_event_facts`]:[]}:{}}:void 0)};if(a>=25&&a<r)G(e,{agentId:t,pathname:n,version:a},R(a)),o||q(e),finishStorageMigration();else if(a<r&&a>=20&&a<25&&r>=21){a>=21&&(Gt(e,n,r),q(e),W(e),Lt(e),Jt(e),Wt(e)&&K(e));let i=R(a);I(e,n,i,{verifyPhysicalIntegrity:!1,integrity:d}),G(e,{agentId:t,pathname:n,version:a},i),a<21&&(e.exec(Le(S)),g||Pt(e)),finishStorageMigration()}else a===17&&(q(e),Lt(e),j(e,n,d),K(e),tn(e,n,R(a),`legacy`,!0)),Gt(e,n,r),a===r?(q(e),W(e),Jt(e),Ht(e),Wt(e)&&(K(e),e.exec(l)),I(e,n,l,{verifyPhysicalIntegrity:!1,integrity:s?d:void 0}),a===16&&Zt(e,n,l),It(e,t,r),G(e,{agentId:t,pathname:n,version:r},l),bt()):(a===14&&en(e,{agentId:t,pathname:n}),U(),ze(e),migrateOpenClawAgentSchema(e),rn(e),a<11&&Ut(e),cn(e,a),U(),q(e),r>=18&&a<18&&Kt(e,n),r>=19&&Vt(e,a),W(e),U(),e.exec(S),a!==17&&K(e),a<r&&Ft(e),jt(e,a),Mt(e,a),a<11&&De(e,S,{databaseLabel:n,integrityCheck:s}),a<21&&r>=21&&!g&&Pt(e),finishStorageMigration())},{databaseLabel:n,operationLabel:`agent.schema.ensure`,withCommit:i})}finally{e.isOpen&&e.exec(`PRAGMA foreign_keys = ON;`)}u&&(ie(e)||w(e))&&(ae(e),dt(e));for(let e of c){let n=`Agent ${t}: ${e}`;$.warn(n),a?.(n)}}function ensureOpenClawAgentDatabaseSchema(e,t){he(ensureOpenClawAgentDatabaseSchemaSteps(e,t))}function*ensureOpenClawAgentDatabaseSchemaSteps(e,t){let n=s(t.agentId),r={...t,agentId:n},i=e.location()??u(r);t.versionMigrationOnly||m(e),V(z(e),n,i);let a=B(e,i);a<42&&an(e,i,a);let o=r.register===!0&&l(i,r.env)?gt({agentId:n,path:i},{env:r.env},`maintenance`):void 0,withRegistrationFence=e=>o?Ee(r=>{let a=St.getStore()?.authority.holdWriteFence?.(r.db);vt(r,i),_t(r,o);let s=e(),c=a?.renew();if(c){let e=`Agent ${n}: ${c}`;$.warn(e),t.onMigrationWarning?.(e)}return s},{env:r.env,initializationAgentPaths:[i]}):e();withRegistrationFence(()=>void 0),e.location()&&!t.versionMigrationOnly&&yt(i),ensureOpenClawAgentDatabasePermissions(i,r),le(e,A),B(e,i),V(z(e),n,i);let withIntegrityMutation=t=>o?me(e,t,{databaseLabel:i,operationLabel:`agent.schema.integrity`,withCommit:withRegistrationFence}):t();if(!t.versionMigrationOnly&&k(e)!==17){let r=agentDatabaseIntegrityBeforeMutationSteps(e,n,i,{integrityCheck:t.integrityCheck});try{let e=withIntegrityMutation(()=>r.next());for(;!e.done;){let t;try{yield e.value}catch(e){t={error:e}}e=withIntegrityMutation(()=>t?r.throw(t.error):r.next())}}finally{r.return(!1)}}if(ye(e,{busyTimeoutMs:A}),ensureAgentSchema(e,n,i,42,withRegistrationFence,t.onMigrationWarning,t.versionMigrationOnly,t.integrityCheck),t.versionMigrationOnly)return;ensureOpenClawAgentDatabasePermissions(i,r);let c=admitOpenClawAgentDatabaseSchema(e,{agentId:n,path:i});r.register===!0&&Et({agentId:n,path:i,env:t.env,admittedDb:c})}var $,Ln=e((()=>{Re(),ue(),g(),we(),_e(),T(),Oe(),pe(),O(),ve(),a(),c(),on(),mt(),ht(),$e(),Bt(),zt(),lt(),qe(),ct(),Ke(),P(),H(),On(),xt(),Yt(),En(),Dt(),kn(),Xt(),at(),At(),un(),d(),rt(),dn(),Ze(),An(),qt(),Ie(),_(),jn(),L(),In(),Me(),st(),ot(),wt(),ce(),Te(),Se(),xe(),$=o(`state/agent-db`)}));export{Ln as a,ensureOpenClawAgentDatabasePermissions as c,ensureOpenClawAgentDatabaseSchemaSteps as i,En as l,ensureAgentSchema as n,admitOpenClawAgentDatabaseSchema as o,ensureOpenClawAgentDatabaseSchema as r,kn as s,agentDatabaseIntegrityBeforeMutationSteps as t};