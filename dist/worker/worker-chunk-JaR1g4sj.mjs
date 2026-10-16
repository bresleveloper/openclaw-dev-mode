import{n as e}from"./worker-chunk-lTaEq7OX.mjs";import{r as t,t as n}from"./worker-chunk-BznV15BX.mjs";import{r,t as i}from"./worker-chunk-BOaKRGfz.mjs";import{f as a,s as o}from"./worker-chunk-z04j10rr.mjs";import{c as s,o as c}from"./worker-chunk-CY1CrHY4.mjs";import{c as l,l as u}from"./worker-chunk-D-pM6VZQ.mjs";import{n as d,t as f}from"./worker-chunk-BPRtk9Jm.mjs";import{n as p,t as m}from"./worker-chunk-9eOBldsQ.mjs";import{r as h}from"./worker-chunk-BBJ6v1Ek.mjs";import{r as g}from"./worker-chunk-D3C_QfoA.mjs";import{t as _}from"./worker-chunk-Bwzwa3wU.mjs";import{c as v,o as y}from"./worker-chunk-CR5jHKwv.mjs";import{n as b,t as ee}from"./worker-chunk-Dpfm-ucS.mjs";import{i as te,u as ne}from"./worker-chunk-DNqLbMlg.mjs";import{s as x}from"./worker-chunk-DlpqH9XP.mjs";import{f as re,g as ie,l as ae}from"./worker-chunk-CUrtmFkF.mjs";import{_ as oe,b as se,p as ce,u as le,v as ue}from"./worker-chunk-DUCME8Gg.mjs";import{Ft as de,I as fe,N as pe,Pt as me,_t as he,an as ge,cn as _e,fn as ve,gn as ye,gt as be,ln as xe,mn as Se,nn as S,on as Ce,tn as C,vt as we}from"./worker-chunk-BbSbjQ7i.mjs";import{n as Te,o as Ee}from"./worker-chunk-Epl24hFw.mjs";import{n as De,r as Oe}from"./worker-chunk-DgFmVOlu.mjs";import{a as w,l as T,o as E,r as D}from"./worker-chunk-DmByjxfp.mjs";import{i as ke,o as O}from"./worker-chunk-DUr_gRO4.mjs";import{m as Ae,o as je}from"./worker-chunk-dAobKEER.mjs";import{a as Me,i as Ne}from"./worker-chunk-DlM5E89b.mjs";import{n as Pe}from"./worker-chunk-DA9m_w42.mjs";import{u as k}from"./worker-chunk-CtoGiFVB.mjs";import{o as Fe,r as Ie}from"./worker-chunk-CrNmJxXV.mjs";import{a as Le,g as Re,i as ze,l as Be,o as Ve}from"./worker-chunk-D_XctZIX.mjs";import{o as He}from"./worker-chunk-Co5fpgOJ.mjs";import{i as Ue,l as A,o as We}from"./worker-chunk-DKjEy5g9.mjs";import{n as Ge,t as Ke}from"./worker-chunk-CL77cth_.mjs";import{C as qe,S as j,t as Je,u as Ye,w as Xe,x as Ze}from"./worker-chunk-B6rcFU5N.mjs";import{A as M,D as Qe,E as N,F as P,G as F,H as $e,K as I,M as et,N as tt,O as L,P as nt,S as rt,U as it,_ as at,a as ot,b as st,c as ct,d as R,f as lt,g as ut,h as dt,i as ft,j as pt,k as z,l as mt,m as B,n as ht,o as gt,p as _t,s as vt,t as V,u as yt,v as bt,x as xt,y as St}from"./worker-chunk-DlFwUFK6.mjs";import{c as Ct,o as wt,t as Tt,v as Et,y as Dt}from"./worker-chunk-BXjLBA-E.mjs";import{d as Ot,h as H,i as kt,r as At,u as U}from"./worker-chunk-DXyipglk.mjs";import{n as jt,t as Mt}from"./worker-chunk-TAVm38GB.mjs";import{a as Nt,n as Pt}from"./worker-chunk-BaE4N64e.mjs";import{a as Ft,i as It}from"./worker-chunk-Dv2jXMOh.mjs";import{chmodSync as Lt,existsSync as Rt,mkdirSync as zt,statSync as Bt}from"node:fs";import W from"node:path";import{AsyncLocalStorage as Vt}from"node:async_hooks";import{fork as Ht}from"node:child_process";import{performance as G}from"node:perf_hooks";var SqliteIntegrityWorkerInterruptedError,Ut=e((()=>{SqliteIntegrityWorkerInterruptedError=class extends Error{constructor(e,t){super(`SQLite integrity check stopped by ${e} before completion (lastObservedPhase=${t})`),this.signal=e,this.name=`SqliteIntegrityWorkerInterruptedError`}}}));async function closeIntegrityProcess(e){e.retired||(e.retired=!0,e.child.connected&&e.child.send({type:`close`},t=>{t&&e.child.kill(`SIGKILL`)}));let t=setTimeout(()=>e.child.kill(`SIGKILL`),e.closeBudgetMs);t.unref();try{await e.closed}finally{clearTimeout(t)}}async function withSqliteIntegrityWorkerScope(e,t){let n=K.getStore();if(n&&!n.accepting)throw Error(`SQLite integrity maintenance scope is closed`);let r={queue:n?.queue??{tail:Promise.resolve()},assertCurrent:e,accepting:!0,pending:/* @__PURE__ */ new Set};try{return await K.run(r,async()=>{let n;try{n={value:await t()}}catch(e){n={error:e}}r.accepting=!1;let i=`error`in n?[n.error]:[];for(let e of await Promise.allSettled(r.pending))e.status===`rejected`&&!i.includes(e.reason)&&i.push(e.reason);try{e()}catch(e){i.includes(e)||i.push(e)}if(v(i,`SQLite integrity maintenance scope failed`),`error`in n)throw n.error;return n.value})}finally{r.accepting=!1,!n&&r.queue.process&&await closeIntegrityProcess(r.queue.process)}}function assertSqliteIntegrityInWorker(e,t,n,r=e,i,a){let o=K.getStore(),run=async o=>{if(!a)return assertSqliteIntegrityWithProcess(e,t,n,r,i,o);o?.assertCurrent();let s=G.now(),c=a.filter(e=>e.check===`integrity_check`),l=[a.filter(e=>e.check===`quick_check`),...Array.from({length:Math.min(3,c.length)},(e,t)=>c.filter((e,n)=>n%3===t))].filter(e=>e.length>0).map(e=>({tables:e,timing:{}})),u=await Promise.allSettled(l.map(async i=>assertSqliteIntegrityWithProcess(e,t,n,r,i.timing,void 0,i.tables)));i&&(i.workerLifetimeElapsedMs=G.now()-s,i.workerCheckElapsedMs=Math.max(0,...l.map(e=>e.timing.workerCheckElapsedMs??0)),i.tables=l.flatMap(e=>e.timing.tables??[]).toSorted((e,t)=>e.table.localeCompare(t.table))),o?.assertCurrent();for(let e of u)if(e.status===`rejected`)throw e.reason};if(!o)return run();if(!o.accepting)return Promise.reject(/* @__PURE__ */ Error(`SQLite integrity maintenance scope is closed`));let s=o.queue.tail.then(async()=>{try{o.queue.process?.retired&&await o.queue.process.closed,await run(o)}catch(e){throw o.queue.process&&await closeIntegrityProcess(o.queue.process),e}});return o.queue.tail=s.catch(()=>void 0),o.pending.add(s),s.finally(()=>o.pending.delete(s)).catch(()=>void 0),s}function assertSqliteIntegrityWithProcess(e,n,i,o,s,c,l){let u=Be(i)??i;s&&(delete s.workerCheckElapsedMs,delete s.workerLifetimeElapsedMs),u.throwIfAborted(),c?.assertCurrent();let d=se(e),{timeoutMs:f,size:p}=Ve(`integrity check`,o,d.size),h=G.now(),g=c?.queue.process;if(!g||g.retired){let e=r(`sqliteIntegrity`),n=Ht(e,[],{execArgv:t(e).slice(0,-1),serialization:`advanced`,stdio:[`ignore`,`ignore`,`ignore`,`ipc`],timeout:c||Le()?void 0:f,killSignal:`SIGKILL`,...c?{}:{signal:u}}),{promise:i,resolve:o}=m();g={child:n,closed:i,retired:!1,closeBudgetMs:f};let s=g;n.on(`error`,e=>{s.failure=a(e),s.retired=!0,n.kill(`SIGKILL`)}),n.once(`close`,()=>{s.retired=!0,o()}),c&&(c.queue.process=g)}g.closeBudgetMs=f;let _=g,v=_.child;return new Promise((t,r)=>{let i,m,g=`starting`,y,b=setInterval(()=>{Wt.info(`SQLite integrity check still running: ${o} (${p}, ${Math.floor((G.now()-h)/1e3)}s elapsed, phase=${g}).`)},1e4);b.unref();let deadlineError=()=>{let e=Re(`integrity check`,o,f,p);return e.message+=` (lastObservedPhase=${g})`,e},kill=()=>{_.retired=!0,v.kill(`SIGKILL`)},onAbort=()=>{m=a(u.reason),kill()},finish=(n,o)=>{if(clearTimeout(y),clearInterval(b),u.removeEventListener(`abort`,onAbort),v.off(`message`,onMessage),v.off(`close`,onClose),s){s.workerLifetimeElapsedMs=G.now()-h,s.tables=i?.tables;let e=i?.checkElapsedMs;typeof e==`number`&&Number.isFinite(e)&&e>=0&&(s.workerCheckElapsedMs=e)}try{u.throwIfAborted(),c?.assertCurrent();let r=m??_.failure;if(r)throw r;if(v.killed&&o===`SIGKILL`)throw deadlineError();if(n!==0||!i)throw!i&&o?new SqliteIntegrityWorkerInterruptedError(o,g):Error(`SQLite integrity worker exited ${n} without a completed check (lastObservedPhase=${g})`);if(se(e,d),!i.ok){let e=i.error.cause?Object.assign(Error(i.error.cause.message),i.error.cause):void 0;throw Object.assign(Error(i.error.message,e?{cause:e}:void 0),{name:i.error.name,code:i.error.code,errcode:i.error.errcode})}t()}catch(e){c&&!_.retired?(kill(),_.closed.then(()=>r(a(e)))):r(a(e))}},onClose=(e,t)=>finish(e,t),onMessage=e=>{`type`in e&&e.type===`phase`?!i&&(e.phase===`opening`||e.phase===`checking`||e.phase===`closing`)&&(g=e.phase):`ok`in e&&(i=e,g=`result-received`,c&&(e.ok&&!_.retired&&!m&&!_.failure?finish(0,null):_.retired=!0))};v.on(`message`,onMessage),v.once(`close`,onClose),c&&(u.addEventListener(`abort`,onAbort,{once:!0}),Le()||(y=setTimeout(()=>{(!i||i.ok)&&(m??=_.failure??deadlineError()),kill()},f),y.unref())),u.aborted?c&&onAbort():v.send({pathname:e,databaseLabel:o,identity:d,busyTimeoutMs:n,tables:l,...c?{reuse:!0}:{}},e=>{e&&(m=e,kill())})})}var K,Wt,Gt=e((()=>{o(),d(),p(),i(),n(),ue(),Ut(),y(),ze(),K=new Vt,Wt=f(`state/sqlite`)}));function ensureMode(e,t){(process.platform===`win32`||(Bt(e).mode&4095)!==t)&&Lt(e,t)}function ensureOpenClawAgentDatabasePermissions(e,t){let n=W.dirname(e),r=A({agentId:t.agentId,env:t.env}),i=W.resolve(e)===W.resolve(r),a=Rt(n);zt(n,{recursive:!0,mode:q}),(i||!a)&&ensureMode(n,q);for(let t of Fe(e))try{ensureMode(t,J)}catch(e){if(e.code!==`ENOENT`)throw e}}var q,J,Kt=e((()=>{Ie(),Ue(),q=448,J=384}));function encodeUsageCostRollup(e){let t=JSON.stringify(e.rollup),n=Buffer.from(t,`utf8`),r=n.byteLength>=1024?Jt?.compress(n,1):void 0,i=r!==void 0&&r.byteLength<n.byteLength,a=i?r:n,o={version:e.version,pricingFingerprint:e.pricingFingerprint,checkpoint:e.checkpoint,scannedAt:e.scannedAt,parsedRecords:e.parsedRecords,countedRecords:e.countedRecords,format:qt,body:{encoding:i?`zstd`:`identity`,bytes:n.byteLength,storedBytes:a.byteLength,utf16Length:t.length,sha256:h(n)}};return{valueJson:JSON.stringify(o),blob:Uint8Array.from(a)}}var qt,Y,Jt,Yt=e((()=>{_(),Ke(),qt=1,Y=`session-cost-usage-rollup-v3`,Jt=Ge()}));function decodePreviousRollup(e){let t=s(e??``);if(t&&t.version===6&&typeof t.pricingFingerprint==`string`&&u(t.checkpoint)&&(t.checkpoint.kind===`jsonl`||t.checkpoint.kind===`sqlite`)&&typeof t.scannedAt==`number`&&typeof t.parsedRecords==`number`&&typeof t.countedRecords==`number`&&u(t.rollup)&&u(t.rollup.buckets)&&u(t.rollup.untimestamped))return t}function migrateSessionCostUsageRollupStorage(e,t){let n=w(e),r;for(;;){t?.();let i=n.selectFrom(`cache_entries`).select([`key`,`value_json`,`updated_at`]).where(`scope`,`=`,X).orderBy(`key`,`asc`).limit(1);r!==void 0&&(i=i.where(`key`,`>`,r));let a=D(e,i).rows[0];if(!a)break;r=a.key;let o=decodePreviousRollup(a.value_json);if(o){let t=encodeUsageCostRollup(o);D(e,n.insertInto(`cache_entries`).values({scope:Y,key:a.key,value_json:t.valueJson,blob:t.blob,updated_at:a.updated_at,expires_at:null}).onConflict(e=>e.columns([`scope`,`key`]).doNothing()))}D(e,n.deleteFrom(`cache_entries`).where(`scope`,`=`,X).where(`key`,`=`,a.key))}}var X,Xt=e((()=>{c(),l(),E(),Yt(),X=`session-cost-usage-rollup-v2`}));function backfillTranscriptMutationWatermarks(e){Me(e,`transcript_events`)&&e.exec(`
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
  `)}var Zt=e((()=>{Ne()}));function migrateOpenClawAgentSchema(e){if(O(e)>=24)return;let t=P(e,`sessions`);if(t){for(let[n,r]of Object.entries({transcript_updated_at:`INTEGER DEFAULT NULL`,transcript_observed_at:`INTEGER DEFAULT NULL`,session_entry_provenance:`INTEGER NOT NULL DEFAULT 0 CHECK (session_entry_provenance IN (0, 1))`,acp_owned:`INTEGER NOT NULL DEFAULT 0 CHECK (acp_owned IN (0, 1))`,plugin_owner_id:`TEXT`,hook_external_content_source:`TEXT CHECK (hook_external_content_source IS NULL OR hook_external_content_source IN ('gmail', 'webhook'))`}))t.has(n)||e.exec(`ALTER TABLE sessions ADD COLUMN ${n} ${r};`);backfillTranscriptMutationWatermarks(e)}}var Qt=e((()=>{ke(),Pe(),M(),Zt()}));function persistAgentSchemaMetadata(e,t,n){let r=Date.now(),i={role:`agent`,schema_version:n,agent_id:t,app_version:ee};D(e,w(e).insertInto(`schema_meta`).values({meta_key:`primary`,...i,created_at:r,updated_at:r}).onConflict(e=>e.column(`meta_key`).doUpdateSet({...i,updated_at:r}).where(e=>e.or([e(`schema_meta.schema_version`,`!=`,n),e(`schema_meta.app_version`,`is`,null),e(`schema_meta.app_version`,`!=`,ee),e(`schema_meta.agent_id`,`!=`,t)]))))}var $t=e((()=>{E(),b()}));function jsonText(e){return`CASE
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
  `)}function backfillSessionNodes(e){let t=P(e,`session_entries`),n=P(e,`session_routes`);if(t){let n=R(t,`status`,`NULL`);e.exec(`INSERT OR REPLACE INTO session_nodes (
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
    SELECT session_key, session_id, '{}', updated_at FROM sessions;`)}function createLegacySessionWindowSelect(e){let t=P(e,`sessions`);if(!t)return;let n=P(e,`session_entries`),r=P(e,`session_routes`),ownerValue=(e,t)=>`(SELECT candidate.${t}
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
  `))}function renameTranscriptRewriteWatermarks(e){P(e,`session_transcript_generations`)&&!P(e,`transcript_rewrite_watermarks`)&&e.exec(`ALTER TABLE session_transcript_generations RENAME TO transcript_rewrite_watermarks;`)}function rebuildBoardTabs(e){P(e,`board_tabs`)&&(P(e,`board_widgets`)&&e.exec(`
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
  `))}function rebuildHeartbeatOutcomes(e){let t=P(e,`heartbeat_outcomes`);t&&e.exec(`
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
  `)}function rebuildSessionMembers(e){P(e,`session_members`)&&e.exec(`
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
  `)}function rebuildTranscriptIndexState(e){let t=P(e,`session_transcript_index_state`);t&&e.exec(`
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
  `)}function migrateSessionNodesAndWindows(e,t){t>=en||!P(e,`sessions`)||(createSessionNodes(e),backfillSessionNodes(e),migrateSessionWindows(e),renameTranscriptRewriteWatermarks(e),rebuildBoardTabs(e),rebuildHeartbeatOutcomes(e),rebuildSessionMembers(e),rebuildTranscriptIndexState(e),e.exec(`
    DROP TABLE IF EXISTS session_routes;
    DROP TABLE IF EXISTS session_entries;
  `))}var en,tn=e((()=>{mt(),M(),en=14}));function migrateSessionEntrySnapshotsInTransaction(e){e.exec(`ALTER TABLE session_nodes ADD COLUMN snapshot_revision INTEGER NOT NULL DEFAULT 0`),e.exec(bt(C));let t=w(e),n=t.selectFrom(`session_nodes`).select([`session_key`,`current_session_id`,`updated_at`,`entry_json`]).orderBy(`session_key`).limit(64),r=T(e,e=>n.where(`session_key`,`>`,e(e=>e))),i=T(e,e=>t.insertInto(`session_entry_snapshots`).values({session_key:e(e=>e.sessionKey),field:e(e=>e.field),value_json:e(e=>e.valueJson)})),a=T(e,e=>t.updateTable(`session_nodes`).set({entry_json:e(e=>e.entryJson)}).where(`session_key`,`=`,e(e=>e.sessionKey))),o=T(e,e=>t.updateTable(`session_nodes`).set({entry_valid:1}).where(`session_key`,`=`,e(e=>e))),s;for(;;){let{rows:t}=s===void 0?D(e,n):r(s);if(t.length===0)return;H();for(let e of t){if(typeof e.session_key!=`string`||typeof e.current_session_id!=`string`||typeof e.updated_at!=`number`||typeof e.entry_json!=`string`)throw Error(`Unreadable session row during snapshot migration`);s=e.session_key;let t=it({current_session_id:e.current_session_id,updated_at:e.updated_at,entry_json:e.entry_json});if(!t)continue;let{entryJson:n,snapshots:r}=Nt(t);if(r.length!==0){for(let t of r)i({sessionKey:e.session_key,...t});a({entryJson:n,sessionKey:e.session_key}),o(e.session_key)}}}}var nn=e((()=>{$e(),Pt(),E(),U(),S(),at()}));function assertTranscriptRebuildInputs(e){je(e,`transcript payload migration`,ae(B(C),`transcript_events`));let t=e.prepare(`PRAGMA table_xinfo(transcript_events)`).all(),n=/* @__PURE__ */ new Set([`session_id`,`seq`,`event_json`,`created_at`]);if(t.length!==n.size||t.some(e=>typeof e.name!=`string`||!n.has(e.name)))throw Error(`Transcript payload migration cannot discard unknown columns`);if(e.prepare(`SELECT name FROM sqlite_schema
      WHERE (type IN ('trigger', 'index') AND tbl_name = 'transcript_events' AND sql IS NOT NULL)
         OR (type IN ('view', 'trigger') AND sql LIKE '%transcript_events%')`).all().length>0)throw Error(`Transcript payload migration cannot rebuild unknown indexes, views, or triggers`);if(e.prepare(`SELECT 1 FROM sqlite_schema WHERE name = ?`).get(Z))throw Error(`Transcript payload migration table already exists`);for(let t of e.prepare(`SELECT name FROM sqlite_schema WHERE type = 'table'`).all()){if(typeof t.name!=`string`)throw Error(`Invalid table name during transcript payload migration`);if(!Q.has(t.name)&&e.prepare(`PRAGMA foreign_key_list(${ie(t.name)})`).all().some(e=>e.table===`transcript_events`))throw Error(`Transcript payload migration cannot rebuild an unknown foreign-key target`)}}function migrateTranscriptPayloadStorageInTransaction(e){if(!e.isTransaction||e.prepare(`PRAGMA foreign_keys`).get()?.foreign_keys!==0)throw Error(`Transcript payload migration requires an admitted transaction with foreign keys off`);assertTranscriptRebuildInputs(e);let t=e.prepare(`PRAGMA encoding`).get()?.encoding===`UTF-8`,n=new TextDecoder(`utf-8`,{fatal:!0,ignoreBOM:!0}),r=Ge();e.exec(ae(C,`transcript_events`).replace(`IF NOT EXISTS transcript_events`,Z));let i=e.prepare(`
    INSERT INTO ${Z}
      (rowid, session_id, seq, event_json, created_at, event_zstd, event_utf8_bytes, navigation_json)
    SELECT rowid, session_id, seq, event_json, created_at, NULL,
           CASE WHEN ? THEN octet_length(event_json) ELSE NULL END, ?
    FROM transcript_events WHERE rowid = ?`),a=e.prepare(`
    INSERT INTO ${Z}
      (rowid, session_id, seq, event_json, created_at, event_zstd, event_utf8_bytes, navigation_json)
    SELECT rowid, session_id, seq, NULL, created_at, ?, ?, ?
    FROM transcript_events WHERE rowid = ?`);i.setReadBigInts(!0),a.setReadBigInts(!0);let o=e.prepare(`SELECT CAST(event_json AS BLOB) AS bytes FROM transcript_events WHERE rowid = ?`),s=e.prepare(`SELECT rowid AS storage_rowid, octet_length(event_json) AS bytes FROM transcript_events ORDER BY rowid`);s.setReadBigInts(!0);let c=performance.now();for(let l of s.iterate()){if(performance.now()-c>=1e3&&(H(),c=performance.now()),typeof l.storage_rowid!=`bigint`||typeof l.bytes!=`bigint`)throw Error(`Invalid transcript storage identity during migration`);let s=null,u=!1;if(t&&l.bytes<=BigInt(4194304)){let t=o.get(l.storage_rowid)?.bytes;if(!(t instanceof Uint8Array))throw Error(`Transcript payload disappeared during migration`);let i;try{i=n.decode(t)}catch{}if(i!==void 0){let n=Ft(e,i);if(s=n.navigation_json,n.event_zstd!==null){if(!r||n.event_utf8_bytes===null||!r.decompress(n.event_zstd,n.event_utf8_bytes).equals(t))throw Error(`Transcript compression did not preserve canonical bytes`);let e=a.run(n.event_zstd,n.event_utf8_bytes,s,l.storage_rowid);if(Number(e.changes)!==1)throw Error(`Transcript payload disappeared before migration publication`);u=!0}}}if(!u&&Number(i.run(+!!t,s,l.storage_rowid).changes)!==1)throw Error(`Transcript identity payload disappeared before migration publication`)}H(),e.exec(`DROP TABLE transcript_events;
    ALTER TABLE ${Z} RENAME TO transcript_events;`)}var Z,Q,rn=e((()=>{It(),Ae(),re(),Ke(),U(),S(),_t(),Z=`transcript_events_payload_migration`,Q=/* @__PURE__ */ new Set([`transcript_event_identities`,`session_transcript_active_events`])}));function migrateMemoryChunkMetadataSchema(e){xe(e),ve(e)}function*agentDatabaseIntegrityBeforeMutationSteps(e,t,n,r,i,a=!1,o=!1){e.exec(`PRAGMA busy_timeout = ${x};`);let s=O(e),c=e.prepare(`SELECT 1 FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' LIMIT 1`).get(),l=s===0&&c!==void 0||s>0&&s<24;l&&$.info(`agent database schema migration pending; verifying integrity first`,{fromVersion:s,path:n,toVersion:24});let u=s===24&&vt(e);if(s===24&&!u){let s=performance.now(),c=a||pe(n,i,l||u),d=yield*qe(e,n,C,{allowMissingColumns:!0,validateAfterRepair:()=>ht(e,{agentId:t,pathname:n}),diagnostics:r,integrityTables:o&&!c?[{name:`sqlite_schema`},...e.prepare(`SELECT name FROM sqlite_schema WHERE type = 'table' ORDER BY name`).all()].map(({name:e})=>({table:String(e),check:e===`transcript_events`?`quick_check`:`integrity_check`})):void 0,reuseIntegrity:c});d.length>0&&$.warn(`Rebuilt canonical agent SQLite indexes for ${t} (${n}): ${d.join(`, `)}`,{agentId:t,path:n,indexes:d,elapsedMs:Math.floor(performance.now()-s)}),ht(e,{agentId:t,pathname:n})}else s===0&&!c&&e.prepare(`PRAGMA page_count`).get()?.page_count===0?le(e,n):yield*oe(e,n,r);return u}function seedCanonicalSessionValidationPending(e){e.exec(`
    INSERT INTO session_canonical_validation_pending (session_key)
    SELECT node.session_key FROM session_nodes AS node
    WHERE NOT EXISTS (
      SELECT 1 FROM session_canonical_validation_pending AS pending
      WHERE pending.session_key = node.session_key
    );
  `)}function migrateAgentStorageInTransaction(e,t,n,r){if(H(),n===22)ut(e,t);else if(e.prepare(`SELECT 1 FROM sqlite_schema WHERE name = ?`).get(`session_transcript_fts_rows`))throw Error(`Transcript FTS row map already exists before the schema-23 storage migration.`);H(),migrateTranscriptPayloadStorageInTransaction(e),H(),_e(e,{renewAuthority:H,onWarning:e=>r.push(e)}),H(),migrateSessionCostUsageRollupStorage(e,H),H(),e.exec(t),n!==22&&e.exec(`
    INSERT INTO session_transcript_fts_rows (id, session_id, message_id)
    SELECT rowid, session_id, message_id FROM session_transcript_fts;
  `)}function finishAgentSchemaMigration(e,t,n,r,i,a,o){if(j(e,n,i,{verifyPhysicalIntegrity:!1}),e.exec(`PRAGMA user_version = ${r};`),persistAgentSchemaMetadata(e,t,r),V(e,{agentId:t,pathname:n,version:r},i),a&&e.prepare(`PRAGMA foreign_key_check`).all().length>0)throw Error(`Agent schema migration failed foreign key validation for ${n}.`);o()}function ensureAgentSchema(e,t,n,r=24,i=e=>e(),a){let o=[],s=gt(r),c=O(e),l=c<r&&(c>0||k(e)!==null),u=r>=18&&l,assertMigration=()=>{l&&(u&&At(),ne()?.assertAgentSchemaMigration({agentId:t,path:n,foundVersion:c,supportedVersion:r}))};assertMigration(),e.exec(`PRAGMA foreign_keys = OFF; PRAGMA legacy_alter_table = OFF;`);try{let mutate=()=>{F(k(e),t,n),I(e,n);let i=O(e);if(u&&k(e)?.schemaVersion!==i)throw Error(`Agent schema markers disagree for ${n}; repair ownership metadata before migration.`);if(i>r)throw Error(`OpenClaw agent database ${n} uses schema version ${i}; expected at most ${r} for this migration.`);i<r&&N(e,n,i);let a=i===0&&k(e)===null&&!e.prepare(`SELECT 1 FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' LIMIT 1`).get(),c=!a&&i<23&&r>=23,l=!a&&i<24&&r>=24,d=l?St(s):s,f=c?B(d,i):d;if(i<r&&i>=20&&i<24&&r>=21){i>=21&&(yt(e,n,r),L(e),z(e),ft(e),ct(e)&&migrateMemoryChunkMetadataSchema(e));let a=i<21?we(f):f;j(e,n,a,{verifyPhysicalIntegrity:!1}),V(e,{agentId:t,pathname:n,version:i},a),i<21&&(e.exec(be(f)),seedCanonicalSessionValidationPending(e)),c&&migrateAgentStorageInTransaction(e,d,i,o),l&&migrateSessionEntrySnapshotsInTransaction(e),finishAgentSchemaMigration(e,t,n,r,s,u,assertMigration);return}if(i===17){let r=rt(B(C));L(e),Xe(e,n,r,{validateAfterRepair:()=>{V(e,{agentId:t,pathname:n,version:17},r)}})}if(yt(e,n,r),i===r){L(e),z(e),ft(e),ot(e),ct(e)&&(migrateMemoryChunkMetadataSchema(e),e.exec(s)),j(e,n,s,{verifyPhysicalIntegrity:!1}),persistAgentSchemaMetadata(e,t,r),V(e,{agentId:t,pathname:n,version:r},s),kt();return}i===14&&lt(e,{agentId:t,pathname:n}),H(),Ce(e),migrateOpenClawAgentSchema(e),pt(e),i<11&&Qe(e),migrateSessionNodesAndWindows(e,i),H(),L(e),z(e),r>=18&&i<18&&xt(e,n),r>=19&&et(e,i),H(),e.exec(f),migrateMemoryChunkMetadataSchema(e),i<r&&me(e),nt(e,i),tt(e,i),i<11&&ye(e,f,{databaseLabel:n}),i<21&&r>=21&&seedCanonicalSessionValidationPending(e),c&&migrateAgentStorageInTransaction(e,d,i,o),l&&migrateSessionEntrySnapshotsInTransaction(e),finishAgentSchemaMigration(e,t,n,r,s,u,assertMigration)};Ee(e,()=>i(mutate),{databaseLabel:n,operationLabel:`agent.schema.ensure`,withCommit:i})}finally{e.isOpen&&e.exec(`PRAGMA foreign_keys = ON;`)}for(let e of o){let n=`Agent ${t}: ${e}`;$.warn(n),a?.(n)}}function*ensureOpenClawAgentDatabaseSchemaSteps(e,t){let n=g(t.agentId),r={...t,agentId:n},i=A(r);F(k(e),n,i);let a=I(e,i);a<24&&N(e,i,a);let o=r.register===!0&&We(i,r.env)?Ct({agentId:n,path:i},{env:r.env},`maintenance`):void 0,withRegistrationFence=e=>o?Ye(t=>(Et(t,i),Tt(t,o),e()),{env:r.env,initializationAgentPaths:[i]}):e();withRegistrationFence(()=>void 0),e.location()&&Ot(i,r.env),ensureOpenClawAgentDatabasePermissions(i,r),e.exec(`PRAGMA busy_timeout = ${x};`),I(e,i),F(k(e),n,i);let withIntegrityMutation=t=>o?Ee(e,()=>withRegistrationFence(t),{databaseLabel:i,operationLabel:`agent.schema.integrity`,withCommit:withRegistrationFence}):t();if(O(e)!==17){let t=agentDatabaseIntegrityBeforeMutationSteps(e,n,i);try{let e=withIntegrityMutation(()=>t.next());for(;!e.done;){let n;try{yield e.value}catch(e){n={error:e}}e=withIntegrityMutation(()=>n?t.throw(n.error):t.next())}}finally{t.return(!1)}}De(e,{busyTimeoutMs:x}),ensureAgentSchema(e,n,i,24,withRegistrationFence,t.onMigrationWarning),ensureOpenClawAgentDatabasePermissions(i,r),r.register===!0&&jt({agentId:n,path:i,env:r.env})}function*migrateOpenClawAgentDatabaseToMediaPrerequisiteSchemaSteps(e,t){if(O(e)>16)return;let n=g(t.agentId),r=A({...t,agentId:n});F(k(e),n,r),N(e,r,O(e)),e.location()&&Ot(r,t.env),yield*agentDatabaseIntegrityBeforeMutationSteps(e,n,r),De(e,{busyTimeoutMs:x}),ensureAgentSchema(e,n,r,16)}var $,an=e((()=>{ge(),Xt(),Ze(),ce(),Se(),Te(),ke(),Oe(),d(),He(),Dt(),wt(),de(),he(),Pe(),U(),Qt(),$t(),Kt(),Mt(),mt(),M(),tn(),Ue(),st(),S(),nn(),at(),_t(),dt(),rn(),fe(),te(),Je(),$=f(`state/agent-db`)}));export{migrateOpenClawAgentDatabaseToMediaPrerequisiteSchemaSteps as a,ensureOpenClawAgentDatabasePermissions as c,Gt as d,withSqliteIntegrityWorkerScope as f,an as i,Kt as l,ensureAgentSchema as n,Y as o,ensureOpenClawAgentDatabaseSchemaSteps as r,Yt as s,agentDatabaseIntegrityBeforeMutationSteps as t,assertSqliteIntegrityInWorker as u};