import{n as e}from"./worker-chunk-lTaEq7OX.mjs";import{c as t,o as n}from"./worker-chunk-ol4R2Y93.mjs";import{c as r,l as i}from"./worker-chunk-D-pM6VZQ.mjs";import{n as a,t as o}from"./worker-chunk-C5bO4Pvi.mjs";import{r as s}from"./worker-chunk-D3C_QfoA.mjs";import{o as c}from"./worker-chunk-BlaVrMFq.mjs";import{i as l,o as u,s as d,u as f}from"./worker-chunk-0R9-efJM.mjs";import{R as p,X as m,Y as h,_t as g,ct as _,m as ee,pt as te}from"./worker-chunk-nCN7lbx3.mjs";import{_ as ne,c as re,g as ie,i as v,l as ae,t as oe,u as y,y as se}from"./worker-chunk-CfWg-CZ2.mjs";import{a as b,t as ce}from"./worker-chunk-CIFkg5YY.mjs";import{o as le,r as ue}from"./worker-chunk-8BtaZ3IZ.mjs";import{d as de,f as fe,r as x,s as pe}from"./worker-chunk-DUflihCn.mjs";import{s as S}from"./worker-chunk-B-FmzGT2.mjs";import{i as me,o as C}from"./worker-chunk-BJAs1Zl8.mjs";import{f as w,v as he,x as ge}from"./worker-chunk-CKLjF99n.mjs";import{n as _e,o as T}from"./worker-chunk-zEl65iey.mjs";import{a as ve,l as E,r as ye}from"./worker-chunk-Bz5olQ4k.mjs";import{i as be,u as xe}from"./worker-chunk-LezG9avP.mjs";import{i as Se,o as Ce}from"./worker-chunk-DZIw2MZV.mjs";import{n as we,u as Te}from"./worker-chunk-qhgeU88D.mjs";import{i as Ee,n as De}from"./worker-chunk-JBw2XdDn.mjs";import{D as Oe,E as ke,G as Ae,T as je,W as Me,at as Ne,ct as Pe,d as Fe,f as Ie,it as Le,nt as Re,tt as ze,w as Be,y as Ve}from"./worker-chunk-DiqKZ6lx.mjs";import{i as D}from"./worker-chunk-6FY92XOD.mjs";import{i as He,s as Ue}from"./worker-chunk-9AQ6nZ2e.mjs";import{S as We,c as Ge,n as Ke,p as qe,x as Je}from"./worker-chunk-BH8OQES1.mjs";import{C as Ye,T as Xe,d as Ze,n as Qe,w as O}from"./worker-chunk-Dnmgrwwf.mjs";import{d as $e,h as k,i as et,r as tt,u as A}from"./worker-chunk-DE6RD0_f.mjs";import{A as nt,D as rt,E as it,F as at,G as ot,I as st,J as ct,K as lt,L as ut,M as j,N as M,O as dt,P as ft,Q as pt,R as N,S as mt,T as ht,U as P,W as F,X as gt,Y as I,Z as _t,_ as vt,a as yt,b as bt,c as xt,d as L,f as R,g as St,h as z,i as B,j as V,k as H,l as U,m as W,n as G,o as Ct,p as wt,q as Tt,r as Et,s as K,t as q,u as J,v as Dt,x as Ot,y as kt}from"./worker-chunk-C4W50uM2.mjs";import{i as At,n as jt}from"./worker-chunk-YafhX7q2.mjs";import{n as Mt,t as Nt}from"./worker-chunk-yBFQp6Ok.mjs";import{n as Pt,t as Ft}from"./worker-chunk-CL77cth_.mjs";import{a as It,o as Lt,t as Rt}from"./worker-chunk-BwiH0yXs.mjs";import{i as zt,t as Bt}from"./worker-chunk-B232573C.mjs";import{a as Vt,i as Ht}from"./worker-chunk-T9TluC2x.mjs";import{chmodSync as Ut,existsSync as Wt,mkdirSync as Gt,statSync as Kt}from"node:fs";import Y from"node:path";function ensureMode(e,t){(process.platform===`win32`||(Kt(e).mode&4095)!==t)&&Ut(e,t)}function ensureOpenClawAgentDatabasePermissions(e,t){let n=Y.dirname(e),r=E({agentId:t.agentId,env:t.env}),i=Y.resolve(e)===Y.resolve(r),a=Wt(n);Gt(n,{recursive:!0,mode:X}),(i||!a)&&ensureMode(n,X);for(let t of le(e))try{ensureMode(t,qt)}catch(e){if(e.code!==`ENOENT`)throw e}}var X,qt,Jt=e((()=>{ue(),ye(),X=448,qt=384}));function decodePreviousRollup(e){let n=t(e??``);if(n&&n.version===6&&typeof n.pricingFingerprint==`string`&&i(n.checkpoint)&&(n.checkpoint.kind===`jsonl`||n.checkpoint.kind===`sqlite`)&&typeof n.scannedAt==`number`&&typeof n.parsedRecords==`number`&&typeof n.countedRecords==`number`&&i(n.rollup)&&i(n.rollup.buckets)&&i(n.rollup.untimestamped))return n}function migrateSessionCostUsageRollupStorage(e,t){let n=u(e),r;for(;;){t?.();let i=n.selectFrom(`cache_entries`).select([`key`,`value_json`,`updated_at`]).where(`scope`,`=`,Z).orderBy(`key`,`asc`).limit(1);r!==void 0&&(i=i.where(`key`,`>`,r));let a=l(e,i).rows[0];if(!a)break;r=a.key;let o=decodePreviousRollup(a.value_json);if(o){let t=It(o);l(e,n.insertInto(`cache_entries`).values({scope:Rt,key:a.key,value_json:t.valueJson,blob:t.blob,updated_at:a.updated_at,expires_at:null}).onConflict(e=>e.columns([`scope`,`key`]).doNothing()))}l(e,n.deleteFrom(`cache_entries`).where(`scope`,`=`,Z).where(`key`,`=`,a.key))}}var Z,Yt=e((()=>{n(),r(),d(),Lt(),Z=`session-cost-usage-rollup-v2`}));function backfillTranscriptMutationWatermarks(e){Ce(e,`transcript_events`)&&e.exec(`
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
  `)}var Xt=e((()=>{Se()}));function migrateOpenClawAgentSchema(e){if(C(e)>=27)return;let t=N(e,`sessions`);if(t){for(let[n,r]of Object.entries({transcript_updated_at:`INTEGER DEFAULT NULL`,transcript_observed_at:`INTEGER DEFAULT NULL`,session_entry_provenance:`INTEGER NOT NULL DEFAULT 0 CHECK (session_entry_provenance IN (0, 1))`,acp_owned:`INTEGER NOT NULL DEFAULT 0 CHECK (acp_owned IN (0, 1))`,plugin_owner_id:`TEXT`,hook_external_content_source:`TEXT CHECK (hook_external_content_source IS NULL OR hook_external_content_source IN ('gmail', 'webhook'))`}))t.has(n)||e.exec(`ALTER TABLE sessions ADD COLUMN ${n} ${r};`);backfillTranscriptMutationWatermarks(e)}}var Zt=e((()=>{me(),D(),M(),Xt()}));function jsonText(e){return`CASE
    WHEN json_valid(entry_json) AND json_type(entry_json, '${e}') = 'text'
    THEN NULLIF(trim(CAST(json_extract(entry_json, '${e}') AS TEXT)), '')
    ELSE NULL
  END`}function jsonNumber(e){return`CASE
    WHEN json_valid(entry_json) AND json_type(entry_json, '${e}') IN ('integer', 'real')
    THEN CAST(json_extract(entry_json, '${e}') AS INTEGER)
    ELSE NULL
  END`}function createSessionNodes(e){e.exec(`
    CREATE TABLE IF NOT EXISTS session_nodes (
      session_key TEXT NOT NULL PRIMARY KEY,
      current_session_id TEXT NOT NULL,
      entry_json TEXT NOT NULL,
      updated_at INTEGER NOT NULL,
      status TEXT CHECK (status IS NULL OR status IN ('running', 'done', 'failed', 'killed', 'timeout')),
      created_at INTEGER,
      created_via TEXT CHECK (created_via IS NULL OR created_via IN ('operator', 'spawn', 'channel', 'cron', 'talk', 'run', 'plugin', 'internal')),
      created_actor_type TEXT CHECK (created_actor_type IS NULL OR created_actor_type IN ('human', 'agent', 'system')),
      created_actor_id TEXT,
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
  `)}function backfillSessionNodes(e){let t=N(e,`session_entries`),n=N(e,`session_routes`);if(t){let n=R(t,`status`,`NULL`);e.exec(`INSERT OR REPLACE INTO session_nodes (
        session_key, current_session_id, entry_json, updated_at, status,
        created_at, created_via, created_actor_type, created_actor_id,
        parent_session_key, spawned_by, fork_source_session_key,
        fork_source_session_id, fork_source_entry_id, label, display_name,
        category, icon, pinned_at, archived_at, last_read_at,
        last_interaction_at, last_activity_at
      ) SELECT
        session_key,
        session_id,
        entry_json,
        updated_at,
        ${n},
        ${jsonNumber(`$.createdAt`)},
        CASE
          WHEN json_valid(entry_json)
            AND json_extract(entry_json, '$.createdVia') IN
              ('operator', 'spawn', 'channel', 'cron', 'talk', 'run', 'plugin', 'internal')
          THEN json_extract(entry_json, '$.createdVia')
          ELSE NULL
        END,
        CASE
          WHEN json_valid(entry_json)
            AND json_extract(entry_json, '$.createdActor.type') IN ('human', 'agent', 'system')
          THEN json_extract(entry_json, '$.createdActor.type')
          WHEN ${jsonText(`$.createdBy.id`)} IS NOT NULL THEN 'human'
          ELSE NULL
        END,
        COALESCE(${jsonText(`$.createdActor.id`)}, ${jsonText(`$.createdBy.id`)}),
        COALESCE(${jsonText(`$.parentSessionKey`)}, ${jsonText(`$.spawnedBy`)}),
        ${jsonText(`$.spawnedBy`)},
        ${jsonText(`$.forkSource.sessionKey`)},
        ${jsonText(`$.forkSource.sessionId`)},
        ${jsonText(`$.forkSource.entryId`)},
        ${jsonText(`$.label`)},
        ${jsonText(`$.displayName`)},
        ${jsonText(`$.category`)},
        NULL,
        ${jsonNumber(`$.pinnedAt`)},
        ${jsonNumber(`$.archivedAt`)},
        ${jsonNumber(`$.lastReadAt`)},
        ${jsonNumber(`$.lastInteractionAt`)},
        ${jsonNumber(`$.lastActivityAt`)}
      FROM session_entries;`)}n&&e.exec(`INSERT OR IGNORE INTO session_nodes
      (session_key, current_session_id, entry_json, updated_at)
      SELECT session_key, session_id, '{}', updated_at FROM session_routes;`),e.exec(`INSERT OR IGNORE INTO session_nodes
    (session_key, current_session_id, entry_json, updated_at)
    SELECT session_key, session_id, '{}', updated_at FROM sessions;`)}function createLegacySessionWindowSelect(e){let t=N(e,`sessions`);if(!t)return;let n=N(e,`session_entries`),r=N(e,`session_routes`),ownerValue=(e,t)=>`(SELECT candidate.${t}
        FROM ${e} AS candidate
        INNER JOIN session_windows AS owner_window ON owner_window.session_id = candidate.session_id
        WHERE candidate.session_id = session_windows.session_id
        ORDER BY CASE WHEN candidate.session_key = owner_window.session_key THEN 0 ELSE 1 END,
                 candidate.updated_at DESC,
                 candidate.session_key ASC
        LIMIT 1)`,i=n?ownerValue(`session_entries`,`session_key`):`NULL`,a=r?ownerValue(`session_routes`,`session_key`):`NULL`,o=n?ownerValue(`session_entries`,`entry_json`):`NULL`;return{columns:`session_id, session_key, previous_session_id, reason, session_scope,
      created_at, updated_at, transcript_updated_at, transcript_observed_at,
      session_entry_provenance, acp_owned, plugin_owner_id,
      hook_external_content_source, started_at, ended_at, status, chat_type,
      channel, account_id, primary_conversation_id, model_provider, model,
      agent_harness_id, parent_session_key, spawned_by, display_name`,sql:`SELECT
      session_id,
      COALESCE(${i}, ${a}, session_key),
      CASE
        WHEN json_valid(${o})
        THEN NULLIF(trim(CAST(json_extract(${o}, '$.previousSessionId') AS TEXT)), '')
        ELSE NULL
      END,
      NULL,
      ${R(t,`session_scope`,`'conversation'`)},
      created_at,
      updated_at,
      ${R(t,`transcript_updated_at`,`NULL`)},
      ${R(t,`transcript_observed_at`,`NULL`)},
      ${R(t,`session_entry_provenance`,`0`)},
      ${R(t,`acp_owned`,`0`)},
      ${R(t,`plugin_owner_id`,`NULL`)},
      ${R(t,`hook_external_content_source`,`NULL`)},
      ${R(t,`started_at`,`NULL`)},
      ${R(t,`ended_at`,`NULL`)},
      ${R(t,`status`,`NULL`)},
      ${R(t,`chat_type`,`NULL`)},
      ${R(t,`channel`,`NULL`)},
      ${R(t,`account_id`,`NULL`)},
      ${R(t,`primary_conversation_id`,`NULL`)},
      ${R(t,`model_provider`,`NULL`)},
      ${R(t,`model`,`NULL`)},
      ${R(t,`agent_harness_id`,`NULL`)},
      ${R(t,`parent_session_key`,`NULL`)},
      ${R(t,`spawned_by`,`NULL`)},
      ${R(t,`display_name`,`NULL`)}
    FROM session_windows`}}function migrateSessionWindows(e){let t=createLegacySessionWindowSelect(e);t&&(e.exec(`ALTER TABLE sessions RENAME TO session_windows;`),e.exec(`
    DROP TABLE IF EXISTS session_windows_new;
    CREATE TABLE session_windows_new (
      session_id TEXT NOT NULL PRIMARY KEY,
      session_key TEXT NOT NULL,
      previous_session_id TEXT,
      reason TEXT CHECK (reason IS NULL OR reason IN ('initial', 'reset', 'rollover', 'fork', 'rewind', 'switch', 'recovery', 'compaction')),
      session_scope TEXT NOT NULL DEFAULT 'conversation' CHECK (session_scope IN ('conversation', 'shared-main', 'group', 'channel')),
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      transcript_updated_at INTEGER DEFAULT NULL,
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
    INSERT INTO session_windows_new (${t.columns})
    ${t.sql};
    DROP TABLE session_windows;
    ALTER TABLE session_windows_new RENAME TO session_windows;
  `))}function renameTranscriptRewriteWatermarks(e){N(e,`session_transcript_generations`)&&!N(e,`transcript_rewrite_watermarks`)&&e.exec(`ALTER TABLE session_transcript_generations RENAME TO transcript_rewrite_watermarks;`)}function rebuildBoardTabs(e){N(e,`board_tabs`)&&(N(e,`board_widgets`)&&e.exec(`
      DELETE FROM board_widgets
      WHERE NOT EXISTS (
        SELECT 1 FROM session_nodes WHERE session_nodes.session_key = board_widgets.session_key
      );
    `),e.exec(`
    DROP TABLE IF EXISTS board_tabs_new;
    CREATE TABLE board_tabs_new (
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
    INSERT INTO board_tabs_new (
      session_key, tab_id, title, position, chat_dock, created_by, revision
    )
    SELECT b.session_key, b.tab_id, b.title, b.position, b.chat_dock, b.created_by, b.revision
    FROM board_tabs AS b
    INNER JOIN session_nodes AS n ON n.session_key = b.session_key;
    DROP TABLE board_tabs;
    ALTER TABLE board_tabs_new RENAME TO board_tabs;
  `))}function rebuildHeartbeatOutcomes(e){let t=N(e,`heartbeat_outcomes`);t&&e.exec(`
    DROP TABLE IF EXISTS heartbeat_outcomes_new;
    CREATE TABLE heartbeat_outcomes_new (
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
    INSERT INTO heartbeat_outcomes_new (
      session_key, run_session_key, outcome, summary, response_reason, priority,
      next_check, task_names_json, wake_source, wake_reason, occurred_at,
      context_run_id, context_claimed_at, updated_at
    )
    SELECT
      h.session_key,
      h.run_session_key,
      h.outcome,
      h.summary,
      ${R(t,`response_reason`,`NULL`)},
      ${R(t,`priority`,`NULL`)},
      ${R(t,`next_check`,`NULL`)},
      ${R(t,`task_names_json`,`NULL`)},
      ${R(t,`wake_source`,`NULL`)},
      ${R(t,`wake_reason`,`NULL`)},
      h.occurred_at,
      ${R(t,`context_run_id`,`NULL`)},
      ${R(t,`context_claimed_at`,`NULL`)},
      h.updated_at
    FROM heartbeat_outcomes AS h
    INNER JOIN session_nodes AS n ON n.session_key = h.session_key;
    DROP TABLE heartbeat_outcomes;
    ALTER TABLE heartbeat_outcomes_new RENAME TO heartbeat_outcomes;
  `)}function rebuildSessionMembers(e){N(e,`session_members`)&&e.exec(`
    DROP TABLE IF EXISTS session_members_new;
    CREATE TABLE session_members_new (
      session_key TEXT NOT NULL,
      identity_id TEXT NOT NULL,
      added_by TEXT NOT NULL,
      added_at INTEGER NOT NULL,
      PRIMARY KEY (session_key, identity_id),
      FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
    ) STRICT;
    INSERT INTO session_members_new (session_key, identity_id, added_by, added_at)
    SELECT m.session_key, m.identity_id, m.added_by, m.added_at
    FROM session_members AS m
    INNER JOIN session_nodes AS n ON n.session_key = m.session_key;
    DROP TABLE session_members;
    ALTER TABLE session_members_new RENAME TO session_members;
  `)}function rebuildTranscriptIndexState(e){let t=N(e,`session_transcript_index_state`);t&&e.exec(`
    DROP TABLE IF EXISTS session_transcript_index_state_new;
    CREATE TABLE session_transcript_index_state_new (
      session_id TEXT NOT NULL PRIMARY KEY,
      indexed_seq INTEGER NOT NULL,
      leaf_event_id TEXT,
      needs_rebuild INTEGER NOT NULL DEFAULT 0,
      active_event_count INTEGER NOT NULL DEFAULT 0,
      active_message_count INTEGER NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (session_id) REFERENCES session_windows(session_id) ON DELETE CASCADE
    ) STRICT;
    INSERT INTO session_transcript_index_state_new (
      session_id, indexed_seq, leaf_event_id, needs_rebuild,
      active_event_count, active_message_count, updated_at
    )
    SELECT
      i.session_id,
      i.indexed_seq,
      ${R(t,`leaf_event_id`,`NULL`)},
      ${R(t,`needs_rebuild`,`0`)},
      ${R(t,`active_event_count`,`0`)},
      ${R(t,`active_message_count`,`0`)},
      i.updated_at
    FROM session_transcript_index_state AS i
    INNER JOIN session_windows AS w ON w.session_id = i.session_id;
    DROP TABLE session_transcript_index_state;
    ALTER TABLE session_transcript_index_state_new RENAME TO session_transcript_index_state;
  `)}function migrateSessionNodesAndWindows(e,t){t>=Qt||!N(e,`sessions`)||(createSessionNodes(e),backfillSessionNodes(e),migrateSessionWindows(e),renameTranscriptRewriteWatermarks(e),rebuildBoardTabs(e),rebuildHeartbeatOutcomes(e),rebuildSessionMembers(e),rebuildTranscriptIndexState(e),e.exec(`
    DROP TABLE IF EXISTS session_routes;
    DROP TABLE IF EXISTS session_entries;
  `))}var Qt,$t=e((()=>{J(),M(),Qt=14}));function migrateSessionEntrySnapshotsInTransaction(e){e.exec(`ALTER TABLE session_nodes ADD COLUMN snapshot_revision INTEGER NOT NULL DEFAULT 0`),e.exec(kt(h));let t=u(e),n=t.selectFrom(`session_nodes`).select([`session_key`,`current_session_id`,`updated_at`,`entry_json`]).orderBy(`session_key`).limit(64),r=f(e,e=>n.where(`session_key`,`>`,e(e=>e))),i=f(e,e=>t.insertInto(`session_entry_snapshots`).values({session_key:e(e=>e.sessionKey),field:e(e=>e.field),value_json:e(e=>e.valueJson)})),a=f(e,e=>t.updateTable(`session_nodes`).set({entry_json:e(e=>e.entryJson)}).where(`session_key`,`=`,e(e=>e.sessionKey))),o=f(e,e=>t.updateTable(`session_nodes`).set({entry_valid:1}).where(`session_key`,`=`,e(e=>e))),s;for(;;){let{rows:t}=s===void 0?l(e,n):r(s);if(t.length===0)return;k();for(let e of t){if(typeof e.session_key!=`string`||typeof e.current_session_id!=`string`||typeof e.updated_at!=`number`||typeof e.entry_json!=`string`)throw Error(`Unreadable session row during snapshot migration`);s=e.session_key;let t=At({current_session_id:e.current_session_id,updated_at:e.updated_at,entry_json:e.entry_json});if(!t)continue;let{entryJson:n,snapshots:r}=zt(t);if(r.length!==0){for(let t of r)i({sessionKey:e.session_key,...t});a({entryJson:n,sessionKey:e.session_key}),o(e.session_key)}}}}var en=e((()=>{jt(),Bt(),d(),A(),m(),Dt()}));function assertTranscriptRebuildInputs(e){we(e,`transcript payload migration`,_(z(h),`transcript_events`));let t=e.prepare(`PRAGMA table_xinfo(transcript_events)`).all(),n=/* @__PURE__ */ new Set([`session_id`,`seq`,`event_json`,`created_at`]);if(t.length!==n.size||t.some(e=>typeof e.name!=`string`||!n.has(e.name)))throw Error(`Transcript payload migration cannot discard unknown columns`);if(e.prepare(`SELECT name FROM sqlite_schema
      WHERE (type IN ('trigger', 'index') AND tbl_name = 'transcript_events' AND sql IS NOT NULL)
         OR (type IN ('view', 'trigger') AND sql LIKE '%transcript_events%')`).all().length>0)throw Error(`Transcript payload migration cannot rebuild unknown indexes, views, or triggers`);if(e.prepare(`SELECT 1 FROM sqlite_schema WHERE name = ?`).get(Q))throw Error(`Transcript payload migration table already exists`);for(let t of e.prepare(`SELECT name FROM sqlite_schema WHERE type = 'table'`).all()){if(typeof t.name!=`string`)throw Error(`Invalid table name during transcript payload migration`);if(!tn.has(t.name)&&e.prepare(`PRAGMA foreign_key_list(${g(t.name)})`).all().some(e=>e.table===`transcript_events`))throw Error(`Transcript payload migration cannot rebuild an unknown foreign-key target`)}}function migrateTranscriptPayloadStorageInTransaction(e){if(!e.isTransaction||e.prepare(`PRAGMA foreign_keys`).get()?.foreign_keys!==0)throw Error(`Transcript payload migration requires an admitted transaction with foreign keys off`);assertTranscriptRebuildInputs(e);let t=ne(e)===`UTF-8`,n=new TextDecoder(`utf-8`,{fatal:!0,ignoreBOM:!0}),r=Pt();e.exec(_(h,`transcript_events`).replace(`IF NOT EXISTS transcript_events`,Q));let i=e.prepare(`
    INSERT INTO ${Q}
      (rowid, session_id, seq, event_json, created_at, event_zstd, event_utf8_bytes, navigation_json)
    SELECT rowid, session_id, seq, event_json, created_at, NULL,
           CASE WHEN ? THEN octet_length(event_json) ELSE NULL END, ?
    FROM transcript_events WHERE rowid = ?`),a=e.prepare(`
    INSERT INTO ${Q}
      (rowid, session_id, seq, event_json, created_at, event_zstd, event_utf8_bytes, navigation_json)
    SELECT rowid, session_id, seq, NULL, created_at, ?, ?, ?
    FROM transcript_events WHERE rowid = ?`);i.setReadBigInts(!0),a.setReadBigInts(!0);let o=e.prepare(`SELECT CAST(event_json AS BLOB) AS bytes FROM transcript_events WHERE rowid = ?`),s=e.prepare(`SELECT rowid AS storage_rowid, octet_length(event_json) AS bytes FROM transcript_events ORDER BY rowid`);s.setReadBigInts(!0);let c=performance.now();for(let l of s.iterate()){if(performance.now()-c>=1e3&&(k(),c=performance.now()),typeof l.storage_rowid!=`bigint`||typeof l.bytes!=`bigint`)throw Error(`Invalid transcript storage identity during migration`);let s=null,u=!1;if(t&&l.bytes<=BigInt(4194304)){let t=o.get(l.storage_rowid)?.bytes;if(!(t instanceof Uint8Array))throw Error(`Transcript payload disappeared during migration`);let i;try{i=n.decode(t)}catch{}if(i!==void 0){let n=Vt(e,i,void 0,`UTF-8`);if(s=n.navigation_json,n.event_zstd!==null){if(!r||n.event_utf8_bytes===null||!r.decompress(n.event_zstd,n.event_utf8_bytes).equals(t))throw Error(`Transcript compression did not preserve canonical bytes`);let e=a.run(n.event_zstd,n.event_utf8_bytes,s,l.storage_rowid);if(Number(e.changes)!==1)throw Error(`Transcript payload disappeared before migration publication`);u=!0}}}if(!u&&Number(i.run(+!!t,s,l.storage_rowid).changes)!==1)throw Error(`Transcript identity payload disappeared before migration publication`)}k(),e.exec(`DROP TABLE transcript_events;
    ALTER TABLE ${Q} RENAME TO transcript_events;`)}var Q,tn,nn=e((()=>{Ht(),ie(),Te(),te(),Ft(),A(),m(),W(),Q=`transcript_events_payload_migration`,tn=/* @__PURE__ */ new Set([`transcript_event_identities`,`session_transcript_active_events`])}));function resolveAgentDatabaseIntegrityGateReason(e,t){return t.integrityRevoked?`stale-lease-full`:Fe(e.path,t.validation)?`revoked`:t.reuseIntegrity?`no-proof`:`lease-class`}function migrateMemoryChunkMetadataSchema(e){Ne(e),Pe(e)}function*agentDatabaseIntegrityBeforeMutationSteps(e,t,n,r,i,a=!1,o=!1){if(a&&o)return r&&(r.integrityGateOutcome=`cached`),!1;b(e,S);let s=v(e)?.userVersion??C(e),c=s===0&&ot(e),l=s===0&&c||s>0&&s<27;l&&$.info(`agent database schema migration pending; verifying integrity first`,{fromVersion:s,path:n,toVersion:27});let u=s===27&&xt(e),d=performance.now();if(r?.integrityGateReason===`stale-lease-full`&&r.because&&$.info(`agent database integrityGateReason=stale-lease-full because=${r.because}`,{agentId:t,path:n,...r}),s===27&&!u){let o=yield*Xe(e,n,h,{allowMissingColumns:!0,validateAfterRepair:()=>G(e,{agentId:t,pathname:n}),diagnostics:r,reuseIntegrity:a||i!==void 0&&!l&&!u});o.length>0&&$.warn(`Rebuilt canonical agent SQLite indexes for ${t} (${n}): ${o.join(`, `)}`,{agentId:t,path:n,indexes:o,elapsedMs:Math.floor(performance.now()-d)}),G(e,{agentId:t,pathname:n})}else s===0&&!c&&e.prepare(`PRAGMA page_count`).get()?.page_count===0?x(e,n):yield*fe(e,n,r);return u}function migrateAgentStorageInTransaction(e,t,n,r){if(k(),n===22)vt(e,t);else if(e.prepare(`SELECT 1 FROM sqlite_schema WHERE name = ?`).get(`session_transcript_fts_rows`))throw Error(`Transcript FTS row map already exists before the schema-23 storage migration.`);k(),migrateTranscriptPayloadStorageInTransaction(e),k(),Le(e,{renewAuthority:k,onWarning:e=>r.push(e)}),k(),migrateSessionCostUsageRollupStorage(e,k),k(),e.exec(t),n!==22&&e.exec(`
    INSERT INTO session_transcript_fts_rows (id, session_id, message_id)
    SELECT rowid, session_id, message_id FROM session_transcript_fts;
  `)}function ensureAgentSchema(e,t,n,r=27,i=e=>e(),a,o=!1){let s=[],c=K(r);e.exec(`PRAGMA foreign_keys = OFF; PRAGMA legacy_alter_table = OFF;`);let l=!1;try{let mutate=()=>{ae(e);let i=w(e);P(i,t,n);let a=F(e,n),u=a===0&&!ot(e),d=a<r&&(a>0||i!==null),f=r>=18&&d;if(f&&i?.schemaVersion!==a)throw Error(`Agent schema markers disagree for ${n}; repair ownership metadata before migration.`);if(a>r)throw Error(`OpenClaw agent database ${n} uses schema version ${a}; expected at most ${r} for this migration.`);!u&&a<r&&H(e,n,a);let assertMigration=()=>{d&&(f&&tt(),xe()?.assertAgentSchemaMigration({agentId:t,path:n,foundVersion:a,supportedVersion:r}))};if(assertMigration(),u&&r===27){e.exec(c),e.exec(`PRAGMA user_version = ${r};`),ct(e,t,r),l=!0;return}let p=!u&&a<25&&r>=25,m=!u&&a<23&&r>=23,h=!u&&a<24&&r>=24,g=h?bt(c):c,_=m?z(g,a):g,finishStorageMigration=()=>{if(m&&migrateAgentStorageInTransaction(e,g,a,s),h&&migrateSessionEntrySnapshotsInTransaction(e),p&&_t(e),!u&&a<26&&r>=26&&dt(e),a<27&&r>=27){let r=it(e);r!==null&&$.info(`agent outbox enqueue sequence rebuilt`,{agentId:t,pathname:n,elapsedMs:r})}a<25&&O(e,n,c,{verifyPhysicalIntegrity:!1}),Ct(e,t,n,r,c,f,assertMigration)};if(a>=25&&a<r){q(e,{agentId:t,pathname:n,version:a},K(a)),o||V(e),finishStorageMigration();return}if(a<r&&a>=20&&a<25&&r>=21){a>=21&&(L(e,n,r),V(e),j(e),I(e),B(e),U(e)&&migrateMemoryChunkMetadataSchema(e));let i=K(a);O(e,n,i,{verifyPhysicalIntegrity:!1}),q(e,{agentId:t,pathname:n,version:a},i),a<21&&(e.exec(ke(_)),p||pt(e)),finishStorageMigration();return}if(a===17&&(V(e),I(e),x(e,n),migrateMemoryChunkMetadataSchema(e),Et(e,n,K(a),`legacy`,!0)),L(e,n,r),a===r){V(e),j(e),B(e),yt(e),U(e)&&(migrateMemoryChunkMetadataSchema(e),e.exec(c)),O(e,n,c,{verifyPhysicalIntegrity:!1}),ct(e,t,r),q(e,{agentId:t,pathname:n,version:r},c),et();return}a===14&&wt(e,{agentId:t,pathname:n}),k(),Re(e),migrateOpenClawAgentSchema(e),ft(e),a<11&&nt(e),migrateSessionNodesAndWindows(e,a),k(),V(e),r>=18&&a<18&&mt(e,n),r>=19&&at(e,a),j(e),k(),e.exec(_),a!==17&&migrateMemoryChunkMetadataSchema(e),a<r&&Me(e),ut(e,a),st(e,a),a<11&&Ee(e,_,{databaseLabel:n}),a<21&&r>=21&&!p&&pt(e),finishStorageMigration()};T(e,()=>i(mutate),{databaseLabel:n,operationLabel:`agent.schema.ensure`,withCommit:i})}finally{e.isOpen&&e.exec(`PRAGMA foreign_keys = ON;`)}l&&(y(e)||v(e))&&(oe(e),Be(e));for(let e of s){let n=`Agent ${t}: ${e}`;$.warn(n),a?.(n)}}function ensureOpenClawAgentDatabaseSchema(e,t){de(ensureOpenClawAgentDatabaseSchemaSteps(e,t))}function*ensureOpenClawAgentDatabaseSchemaSteps(e,t){let n=s(t.agentId),r={...t,agentId:n},i=E(r);p(e),P(w(e),n,i);let a=F(e,i);a<27&&H(e,i,a);let o=r.register===!0&&ve(i,r.env)?qe({agentId:n,path:i},{env:r.env},`maintenance`):void 0,withRegistrationFence=e=>o?Ze(t=>(Je(t,i),Ke(t,o),e()),{env:r.env,initializationAgentPaths:[i]}):e();withRegistrationFence(()=>void 0),e.location()&&$e(i),ensureOpenClawAgentDatabasePermissions(i,r),b(e,S),F(e,i),P(w(e),n,i);let withIntegrityMutation=t=>o?T(e,()=>withRegistrationFence(t),{databaseLabel:i,operationLabel:`agent.schema.integrity`,withCommit:withRegistrationFence}):t();if(!t.versionMigrationOnly&&C(e)!==17){let t=agentDatabaseIntegrityBeforeMutationSteps(e,n,i);try{let e=withIntegrityMutation(()=>t.next());for(;!e.done;){let n;try{yield e.value}catch(e){n={error:e}}e=withIntegrityMutation(()=>n?t.throw(n.error):t.next())}}finally{t.return(!1)}}if(he(e,{busyTimeoutMs:S}),ensureAgentSchema(e,n,i,27,withRegistrationFence,t.onMigrationWarning,t.versionMigrationOnly),t.versionMigrationOnly)return;ensureOpenClawAgentDatabasePermissions(i,r);let c;e.location()&&(y(e)||v(e))&&(oe(e),je(e),Ue(e),Ve({db:e,path:i,agentId:n}),c=e),r.register===!0&&Mt({agentId:n,path:i,env:r.env,admittedDb:c})}var $,rn=e((()=>{ze(),Yt(),ce(),ee(),Ye(),pe(),se(),re(),De(),_e(),me(),ge(),a(),c(),We(),Ge(),Ae(),gt(),Oe(),D(),He(),A(),Zt(),Tt(),Jt(),Nt(),J(),lt(),M(),$t(),Ie(),ye(),rt(),ht(),Ot(),m(),en(),Dt(),W(),St(),nn(),be(),Qe(),$=o(`state/agent-db`)}));export{rn as a,Jt as c,ensureOpenClawAgentDatabaseSchemaSteps as i,ensureAgentSchema as n,resolveAgentDatabaseIntegrityGateReason as o,ensureOpenClawAgentDatabaseSchema as r,ensureOpenClawAgentDatabasePermissions as s,agentDatabaseIntegrityBeforeMutationSteps as t};