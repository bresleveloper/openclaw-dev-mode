import{n as e}from"./worker-chunk-lTaEq7OX.mjs";import{n as t,u as n}from"./worker-chunk-Beu5zrK3.mjs";import{c as r,o as i}from"./worker-chunk-CY1CrHY4.mjs";import{a,c as o,l as s}from"./worker-chunk-D-pM6VZQ.mjs";import{r as c,t as l}from"./worker-chunk-D3C_QfoA.mjs";import{n as u,r as d}from"./worker-chunk-Dr-GiZID.mjs";import{f,l as p,n as m,r as h}from"./worker-chunk-CUrtmFkF.mjs";import{At as g,Ct as _,Ft as ee,Mt as te,Nt as v,Pt as ne,Rt as re,Ut as ie,Vt as ae,_t as oe,an as se,in as ce,jt as le,kt as y,nn as ue,rn as de,tn as b,un as fe,vt as x,wt as pe}from"./worker-chunk-BbSbjQ7i.mjs";import{i as S,n as me,o as C}from"./worker-chunk-DUr_gRO4.mjs";import{f as he,m as w,o as T,p as ge,s as E,u as _e}from"./worker-chunk-dAobKEER.mjs";import{a as D,c as O,f as ve,i as k,n as A,o as ye,p as be,u as j}from"./worker-chunk-DlM5E89b.mjs";import{n as M,t as xe}from"./worker-chunk-DA9m_w42.mjs";import{l as Se,u as N}from"./worker-chunk-CtoGiFVB.mjs";import{a as Ce,o as we}from"./worker-chunk-Eul5dA72.mjs";import{o as Te}from"./worker-chunk-Co5fpgOJ.mjs";import{S as Ee,x as De}from"./worker-chunk-B6rcFU5N.mjs";import{n as Oe,t as ke}from"./worker-chunk-CrNE5ZuS.mjs";import{r as Ae,t as je}from"./worker-chunk-BMpjyKxd.mjs";import Me from"node:crypto";function assertSupportedAgentSchemaVersion(e,t){let n=m(e)?.userVersion??C(e);if(n>24)throw me(`OpenClaw agent database`,t,n,24);return n}function assertCanonicalAgentPersistenceVersion(e,t,n=m(e)?.userVersion??C(e)){let r=n===0&&e.prepare(`SELECT 1 FROM sqlite_master WHERE substr(name, 1, 7) <> 'sqlite_' LIMIT 1`).get(),i=n===0&&N(e)===null&&!r;if(n<17&&!i)throw new Ce(t,n);if(n<24&&!i)throw new O(`OpenClaw agent database ${t} uses schema version ${n}; stop active agents and run openclaw doctor --fix to migrate session identities before using it.`)}function assertExistingAgentSchemaOwner(e,t,n){if(e){if(e.role!==`agent`)throw new O(`OpenClaw agent database ${n} has schema role ${e.role??`unknown`}; expected agent. Run openclaw doctor --fix to inspect and repair its ownership.`);if(!e.agentId)throw new O(`OpenClaw agent database ${n} has no agent owner. Run openclaw doctor --fix to inspect and repair its ownership.`);if(c(e.agentId)!==t)throw new O(`OpenClaw agent database ${n} belongs to agent ${e.agentId}; requested agent ${t}.`)}}var Ne=e((()=>{l(),h(),j(),S(),M(),Se(),we()}));function hasValidSessionEntryIdentity(e){return typeof e.sessionId==`string`&&typeof e.updatedAt==`number`&&Number.isFinite(e.updatedAt)}function parseSqliteSessionEntryRecord(e){try{let t=JSON.parse(e.entry_json);return!s(t)||!hasValidSessionEntryIdentity(t)||e.current_session_id!==void 0&&e.current_session_id!==t.sessionId||e.updated_at!==void 0&&e.updated_at!==t.updatedAt?null:t}catch{return null}}var P=e((()=>{o()}));function normalizeConversationPeerId(e,t){let n=t.trim(),r=`${e.trim().toLowerCase()}:`;return n.toLowerCase().startsWith(r)&&(n=n.slice(r.length).trim()),n.replace(/^(user|channel|group|conversation|room|dm|thread):/i,``).trim()}function buildConversationRef(e){return`conv_${Me.createHash(`sha256`).update(JSON.stringify([e.channel,e.accountId,e.kind,e.peerId,e.parentConversationRef??``,e.threadId??``])).digest(`hex`).slice(0,32)}`}var F=e((()=>{}));function migrateLegacySessionCreator(e){let t=e,n=e.createdActor??(s(t.createdBy)?{...t.createdBy,type:`human`,source:`unknown`}:void 0);if(n?.type!==`human`)return e;let r=n.source===`profile`||n.source===`channel`||n.source===`unknown`?n.source:e.createdVia===`operator`||e.createdVia===`run`?`profile`:e.createdVia===`channel`?`channel`:`unknown`;if(n===e.createdActor&&r===n.source&&!t.createdBy)return e;let i={...t,createdActor:{...n,source:r}};return delete i.createdBy,i}var I=e((()=>{o()}));function assertSupportedAgentMigrationSchemas(e,t,n){if(n<8&&[`sessions`,`session_entries`,`transcript_events`].some(t=>D(e,t))||D(e,`session_transcript_files`)||readSqliteTableColumns(e,`session_transcript_fts`)?.has(`session_key`))throw new O(`OpenClaw agent database ${t} contains an unreleased session schema (version ${n}). Preserve a complete copy of your state directory and configuration, including shared agent registration. Run "openclaw doctor --fix" with OpenClaw 2026.9.7 against that copy. If a store is held, follow Doctor's explicit agent-restoration instructions, then rerun Doctor before retrying the upgrade.`);let r=readSqliteTableColumns(e,`acp_parent_stream_events`),i=readSqliteTableColumns(e,`trajectory_runtime_events`),a=readSqliteTableColumns(e,`memory_index_sources`);if(r&&!r.has(`session_id`)||i?.has(`event_id`)||a?.has(`source_kind`))throw new O(`OpenClaw agent database ${t} has an unsupported legacy schema. Upgrades from pre-July-2026 state are no longer migrated; restore a backup produced by a July 2026 or newer release before retrying.`)}function migrateSessionTranscriptGenerations(e,t){if(t>=13)return;let n=e.prepare(`INSERT OR IGNORE INTO transcript_rewrite_watermarks (session_id, generation, updated_at)
     SELECT session_id, lower(hex(randomblob(16))), ?
     FROM transcript_events
     GROUP BY session_id`);n.setReadBigInts(!0),n.run(Date.now())}function migrateSessionTranscriptActiveProjection(e,t){if(t>=10)return;let n=readSqliteTableColumns(e,`session_transcript_index_state`);n&&!n.has(`active_event_count`)&&e.exec(`ALTER TABLE session_transcript_index_state ADD COLUMN active_event_count INTEGER NOT NULL DEFAULT 0;`),n&&!n.has(`active_message_count`)&&e.exec(`ALTER TABLE session_transcript_index_state ADD COLUMN active_message_count INTEGER NOT NULL DEFAULT 0;`),e.exec(`
    DELETE FROM session_transcript_active_events;
    UPDATE session_transcript_index_state
    SET needs_rebuild = 1,
        active_event_count = 0,
        active_message_count = 0,
        updated_at = ${Date.now()};
  `)}function parseConversationEntry(e){return typeof e==`string`?r(e):void 0}function inferMigratedChatType(e){let t=Oe(n(e.entry.chatType))??Oe(n(e.persistedChatType));if(t)return t;let r=je(e.sessionKey);if(r!==`unknown`)return r;let i=e.deliveryTarget?.toLowerCase();return i?.startsWith(`channel:`)||/^[^:]+:channel:/u.test(i??``)?`channel`:/^(?:[^:]+:)?(?:group|room):/u.test(i??``)||n(e.entry.groupId)?`group`:`direct`}function migratedConversation(e,t,r){let i=a(e.delivery),o=a(i?.context)??a(e.deliveryContext),s=a(i?.origin)??a(e.origin),c=n(o?.to),l=inferMigratedChatType({entry:e,persistedChatType:t,sessionKey:r,deliveryTarget:c??n(s?.from)}),u=c??(l===`direct`?n(s?.from):void 0);if(!u)return;let f=!!c,p=(f?n(o?.channel)??n(e.channel)??n(e.lastChannel)??n(s?.provider):n(s?.provider))?.toLowerCase(),m=d(f?n(o?.accountId)??n(e.lastAccountId)??n(s?.accountId):n(s?.accountId)),h=f?o?.threadId:s?.threadId,g=typeof h==`number`&&Number.isFinite(h)?String(h):n(h),_=p?normalizeConversationPeerId(p,u):void 0;if(p&&_)return{conversationRef:buildConversationRef({channel:p,accountId:m,kind:l,peerId:_,threadId:g}),channel:p,accountId:m,kind:l,peerId:_,deliveryTarget:u,threadId:g,nativeChannelId:n(s?.nativeChannelId),nativeDirectUserId:n(s?.nativeDirectUserId),label:n(e.displayName)??n(e.label)??n(e.subject)??n(e.groupId)}}function backfillSessionConversations(e){if(!readSqliteTableColumns(e,`session_entries`)||!readSqliteTableColumns(e,`sessions`)||!readSqliteTableColumns(e,`conversations`))return;readSqliteTableColumns(e,`session_conversations`)||e.exec(`
      CREATE TABLE session_conversations (
        session_id TEXT NOT NULL,
        conversation_id TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'primary' CHECK (role IN ('primary', 'participant', 'related')),
        route_context_json TEXT,
        first_seen_at INTEGER NOT NULL,
        last_seen_at INTEGER NOT NULL,
        PRIMARY KEY (session_id, conversation_id, role),
        FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE,
        FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE
      );
    `),e.exec(`
    UPDATE sessions
    SET primary_conversation_id = NULL
    WHERE primary_conversation_id IN (
      SELECT conversation_id FROM conversations WHERE delivery_target = ''
    );
    DELETE FROM session_conversations
    WHERE conversation_id IN (
      SELECT conversation_id FROM conversations WHERE delivery_target = ''
    );
    DELETE FROM conversations WHERE delivery_target = '';
  `);let t=e.prepare(`
        SELECT
          se.session_id,
          se.entry_json,
          se.session_key,
          se.updated_at,
          s.session_scope,
          CASE WHEN se.session_key = s.session_key THEN s.chat_type END AS persisted_chat_type
        FROM session_entries AS se
        INNER JOIN sessions AS s ON s.session_id = se.session_id
        ORDER BY se.updated_at ASC, se.session_key ASC;
      `).all(),r=e.prepare(`
    INSERT INTO conversations (
      conversation_id, channel, account_id, kind, peer_id, delivery_target,
      parent_conversation_id, thread_id, native_channel_id,
      native_direct_user_id, label, metadata_json, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, NULL, ?, ?, ?, ?, NULL, ?, ?)
    ON CONFLICT(conversation_id) DO UPDATE SET
      channel = excluded.channel,
      account_id = excluded.account_id,
      kind = excluded.kind,
      peer_id = excluded.peer_id,
      delivery_target = excluded.delivery_target,
      thread_id = excluded.thread_id,
      native_channel_id = excluded.native_channel_id,
      native_direct_user_id = excluded.native_direct_user_id,
      label = excluded.label,
      updated_at = excluded.updated_at;
  `),i=e.prepare(`
    DELETE FROM session_conversations
    WHERE session_id = ? AND conversation_id = ? AND role = 'related';
  `),a=e.prepare(`
    UPDATE session_conversations SET role = 'related', last_seen_at = ?
    WHERE session_id = ? AND role = 'primary';
  `),o=e.prepare(`
    INSERT INTO session_conversations (
      session_id, conversation_id, role, first_seen_at, last_seen_at
    ) VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(session_id, conversation_id, role) DO UPDATE SET
      last_seen_at = excluded.last_seen_at;
  `),s=e.prepare(`UPDATE sessions SET primary_conversation_id = ? WHERE session_id = ?`);for(let e of[r,i,a,o,s])e.setReadBigInts(!0);for(let e of t){let t=n(e.session_id),c=parseConversationEntry(e.entry_json),l=typeof e.updated_at==`number`?e.updated_at:Date.now(),u=c?migratedConversation(c,n(e.persisted_chat_type),n(e.session_key)):void 0;if(!t||!u)continue;let d=e.session_scope===`shared-main`&&u.kind===`direct`?`participant`:`primary`;r.run(u.conversationRef,u.channel,u.accountId,u.kind,u.peerId,u.deliveryTarget,u.threadId??null,u.nativeChannelId??null,u.nativeDirectUserId??null,u.label??null,l,l),d===`primary`&&(a.run(l,t),i.run(t,u.conversationRef)),o.run(t,u.conversationRef,d,l,l),d===`primary`&&s.run(u.conversationRef,t)}}function readSqliteTableColumns(e,t){if(!/^[A-Za-z_][A-Za-z0-9_]*$/.test(t))throw Error(`invalid SQLite table identifier: ${t}`);if(!D(e,t))return null;let n=e.prepare(`PRAGMA table_info(${t})`).all();return new Set(n.flatMap(e=>typeof e.name==`string`?[e.name]:[]))}function ensureSessionAdditiveColumns(e){re(e),A(e,`session_transcript_active_events`,`context_eligible INTEGER`),A(e,`session_nodes`,`project_id TEXT`),A(e,`session_conversations`,`route_context_json TEXT`),D(e,`session_conversations`)&&e.exec(`
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
    `)}function hasPendingSessionConversationRouteContextColumn(e){let t=readSqliteTableColumns(e,`session_conversations`);return!(!t||t.has(`route_context_json`))}function hasPendingSessionProjectColumn(e){let t=readSqliteTableColumns(e,`session_nodes`);return!(!t||t.has(`project_id`))}function hasPendingSessionTranscriptContextEligibilityColumn(e){let t=readSqliteTableColumns(e,`session_transcript_active_events`);return!(!t||t.has(`context_eligible`))}function migrateConversationDeliveryTargetColumn(e){A(e,`conversations`,`delivery_target TEXT NOT NULL DEFAULT ''`)}function ensureSessionEntryValidityProjection(e){let t=readSqliteTableColumns(e,`session_nodes`);if(!t)return;t.has(`entry_valid`)||e.exec(`ALTER TABLE session_nodes ADD COLUMN entry_valid INTEGER NOT NULL DEFAULT 0 CHECK (entry_valid IN (-1, 0, 1))`),e.exec(`
    CREATE TRIGGER IF NOT EXISTS session_nodes_entry_valid_after_insert
    AFTER INSERT ON session_nodes
    BEGIN
      UPDATE session_nodes SET entry_valid = 0 WHERE session_key = NEW.session_key;
    END;
    CREATE TRIGGER IF NOT EXISTS session_nodes_entry_valid_after_entry_update
    AFTER UPDATE OF entry_json ON session_nodes
    BEGIN
      UPDATE session_nodes SET entry_valid = 0 WHERE session_key = NEW.session_key;
    END;
    CREATE TRIGGER IF NOT EXISTS session_nodes_entry_valid_after_identity_update
    AFTER UPDATE OF current_session_id, updated_at ON session_nodes
    BEGIN
      UPDATE session_nodes SET entry_valid = 0 WHERE session_key = NEW.session_key;
    END;
  `);let n=e.prepare(`SELECT current_session_id, entry_json, session_key, updated_at FROM session_nodes WHERE entry_valid = 0 ORDER BY session_key LIMIT 256`),r=e.prepare(`UPDATE session_nodes SET entry_valid = ? WHERE session_key = ?`);for(r.setReadBigInts(!0);;){let e=n.all();if(e.length===0)break;for(let t of e)r.run(parseSqliteSessionEntryRecord(t)?1:-1,t.session_key)}}function migrateSessionCreatorNamespaces(e,t){if(t>=19||!D(e,`session_nodes`))return;let n=e.prepare(`UPDATE session_nodes SET entry_json = ?, created_actor_type = ?, created_actor_id = ? WHERE session_key = ?`);n.setReadBigInts(!0);let r=e.prepare(`SELECT session_key, entry_json FROM session_nodes
    WHERE json_valid(entry_json) AND (json_extract(entry_json, '$.createdActor.type') = 'human'
      OR (json_type(entry_json, '$.createdActor') IS NULL AND json_type(entry_json, '$.createdBy') = 'object'))`);for(let e of r.all()){let t=migrateLegacySessionCreator(JSON.parse(e.entry_json));n.run(JSON.stringify(t),t.createdActor?.type??null,t.createdActor?.id??null,e.session_key)}}var L=e((()=>{i(),o(),t(),ke(),P(),j(),u(),F(),Ae(),I(),ie(),k()}));function sessionParticipantsSchemaSql(){return p(b,xe,{endMarker:`CREATE TABLE IF NOT EXISTS session_key_contract (`,includeEndMarker:!1,errorMessage:`OpenClaw session participant schema markers are missing.`})}var R,z,B=e((()=>{ce(),f(),M(),ue(),{ensure:R,recordCommitted:z}=de(sessionParticipantsSchemaSql)}));function withLegacySessionParticipantsSchema(e){return x(e).replace(sessionParticipantsSchemaSql().trim(),V)}function migrateSessionParticipantsSchema(e,t){if(!D(e,`session_participants`))return;if(T(e,t,V,{allowedMissingColumns:U}),D(e,H))throw Error(`Participant migration table already exists: ${H}`);if(e.prepare(`SELECT name FROM sqlite_schema
    WHERE (type IN ('trigger', 'index') AND tbl_name = 'session_participants' AND sql IS NOT NULL)
       OR (type IN ('view', 'trigger') AND sql LIKE '%session_participants%')`).all().length>0)throw Error(`Participant migration cannot rebuild unknown indexes, views, or triggers.`);for(let t of e.prepare(`SELECT name FROM sqlite_schema WHERE type = 'table'`).all())if(e.prepare(`PRAGMA foreign_key_list("${String(t.name).replaceAll(`"`,`""`)}")`).all().some(e=>e.table===`session_participants`))throw Error(`Participant migration cannot rebuild a table referenced by an unknown foreign key.`);let n=ye(e,`session_participants`,`actor_source`)?`actor_source`:`NULL`,r=ye(e,`session_participants`,`contribution_count`)?`coalesce(contribution_count, 1)`:`1`,i=`actor_type = 'agent' AND ${n} = 'agent' AND actor_id <> ''`,a=`(${i}) OR (actor_type = 'human' AND ${n} = 'channel')`;e.exec(`
    ${sessionParticipantsSchemaSql().replace(`IF NOT EXISTS session_participants`,H)}
    INSERT INTO ${H}
      (session_key, identity_namespace, actor_id, contribution_count, first_prompted_at, last_prompted_at)
    SELECT session_key,
      CASE
        WHEN actor_type = 'human' AND ${n} = 'profile' AND actor_id <> '' THEN json_object('type', 'profile')
        WHEN ${i} THEN json_object('type', 'agent')
        ELSE json_object('type', 'legacy', 'actorType', actor_type, 'source', ${n})
      END,
      actor_id, ${r},
      CASE WHEN ${a} THEN first_prompted_at ELSE NULL END,
      CASE WHEN ${a} THEN last_prompted_at ELSE NULL END
    FROM session_participants;
    DROP TABLE session_participants;
    ALTER TABLE ${H} RENAME TO session_participants;
  `)}var V,H,U,W=e((()=>{w(),oe(),B(),k(),V=`CREATE TABLE IF NOT EXISTS session_participants (
  session_key TEXT NOT NULL,
  actor_type TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  actor_source TEXT,
  contribution_count INTEGER,
  first_prompted_at INTEGER NOT NULL,
  last_prompted_at INTEGER NOT NULL,
  PRIMARY KEY (session_key, actor_type, actor_id),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
) STRICT;`,H=`session_participants_identity_migration`,U=[`session_participants.actor_source`,`session_participants.contribution_count`]}));function sessionEntrySnapshotsSchemaSql(e){return p(e,`session_entry_snapshots`,{endMarker:`CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_updated_at`,includeEndMarker:!1})}function withoutSessionEntrySnapshotsSchema(e){return e.includes(`CREATE TABLE IF NOT EXISTS session_entry_snapshots (`)?e.replace(`  snapshot_revision INTEGER NOT NULL DEFAULT 0,
`,``).replace(sessionEntrySnapshotsSchemaSql(e),``):e}var G=e((()=>{f()}));function withDeployedTranscriptFtsRowSchema(e){let t=p(e,`session_transcript_index_state`);return e.replace(t,t.replace(`  updated_at INTEGER NOT NULL,`,`  fts_row_count INTEGER,
  updated_at INTEGER NOT NULL,`)).replace(`CREATE VIRTUAL TABLE IF NOT EXISTS session_transcript_fts USING fts5(`,`${K}\nCREATE VIRTUAL TABLE IF NOT EXISTS session_transcript_fts USING fts5(`)}function migrateDeployedTranscriptFtsRowsInTransaction(e,t){if(!e.isTransaction||e.prepare(`PRAGMA foreign_keys`).get()?.foreign_keys!==0)throw Error(`Transcript FTS migration requires an admitted transaction with foreign keys off`);T(e,`deployed transcript FTS ownership`,K);let n=e.prepare(`PRAGMA table_xinfo(session_transcript_fts_rows)`).all();if(n.length!==2||n.some(e=>e.name!==`session_id`&&e.name!==`fts_rowid`))throw Error(`Transcript FTS migration cannot discard unknown row-map columns`);let r=e.prepare(`SELECT name FROM sqlite_schema
    WHERE (tbl_name = 'session_transcript_fts_rows' AND sql IS NOT NULL
      AND type IN ('index', 'trigger') AND name != 'idx_agent_transcript_fts_rows_session')
      OR (type IN ('view', 'trigger') AND sql LIKE '%session_transcript_fts_rows%')`).all(),i=e.prepare(`SELECT schema.name FROM sqlite_schema AS schema
    JOIN pragma_foreign_key_list(schema.name) AS fk
    WHERE schema.type = 'table' AND fk."table" = 'session_transcript_fts_rows'`).all();if(r.length||i.length)throw Error(`Transcript FTS migration cannot discard unknown row-map dependencies`);if(e.prepare(`SELECT 1 FROM sqlite_schema WHERE name = ?`).get(q))throw Error(`Transcript FTS migration table already exists`);e.exec(`ALTER TABLE session_transcript_fts_rows RENAME TO ${q}`),e.exec(p(t,`session_transcript_fts_rows`,{endMarker:`INSERT OR IGNORE INTO memory_index_state`,includeEndMarker:!1})),e.exec(`INSERT INTO session_transcript_fts_rows (id, session_id, message_id)
    SELECT rowid, session_id, message_id FROM session_transcript_fts`),e.exec(`UPDATE session_transcript_index_state AS state SET needs_rebuild = 1
    WHERE needs_rebuild = 0 AND (
      fts_row_count IS NULL
      OR fts_row_count != (SELECT count(*) FROM ${q} AS old WHERE old.session_id = state.session_id)
      OR EXISTS (
        SELECT 1 FROM ${q} AS old
        WHERE old.session_id = state.session_id AND NOT EXISTS (
          SELECT 1 FROM session_transcript_fts_rows AS current
          WHERE current.id = old.fts_rowid AND current.session_id = old.session_id))
      OR EXISTS (
        SELECT 1 FROM session_transcript_fts_rows AS current
        WHERE current.session_id = state.session_id AND NOT EXISTS (
          SELECT 1 FROM ${q} AS old
          WHERE old.fts_rowid = current.id AND old.session_id = current.session_id))
    );
    DROP TABLE ${q};
    ALTER TABLE session_transcript_index_state DROP COLUMN fts_row_count;`)}var K,q,Pe=e((()=>{w(),f(),K=`CREATE TABLE IF NOT EXISTS session_transcript_fts_rows (
  session_id TEXT NOT NULL,
  fts_rowid INTEGER NOT NULL PRIMARY KEY
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_transcript_fts_rows_session
  ON session_transcript_fts_rows(session_id);
`,q=`session_transcript_fts_rows_legacy22`}));function withLegacyAgentStorageSchema(e,t=21){let n=withoutSessionEntrySnapshotsSchema(e);for(let[e,t]of Object.entries(Fe))n=n.replace(p(n,e),t);return n.includes(`CREATE TABLE IF NOT EXISTS session_transcript_fts_rows (`)&&(n=n.replace(p(n,`session_transcript_fts_rows`,{endMarker:`INSERT OR IGNORE INTO memory_index_state`,includeEndMarker:!1}),``)),t===22?withDeployedTranscriptFtsRowSchema(n):n}var Fe,J=e((()=>{f(),M(),G(),Pe(),Fe={transcript_events:`CREATE TABLE IF NOT EXISTS transcript_events (
  session_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  event_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (session_id, seq),
  FOREIGN KEY (session_id) REFERENCES "session_windows"(session_id) ON DELETE CASCADE
) STRICT;`,memory_index_chunks:`CREATE TABLE IF NOT EXISTS memory_index_chunks (
  id TEXT PRIMARY KEY,
  path TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'memory',
  start_line INTEGER NOT NULL,
  end_line INTEGER NOT NULL,
  hash TEXT NOT NULL,
  model TEXT NOT NULL,
  text TEXT NOT NULL,
  embedding TEXT NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;`,memory_embedding_cache:`CREATE TABLE IF NOT EXISTS memory_embedding_cache (
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  provider_key TEXT NOT NULL,
  hash TEXT NOT NULL,
  embedding TEXT NOT NULL,
  dims INTEGER,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (provider, model, provider_key, hash)
) STRICT;`}})),Ie,Y,X,Z,Q,Le,Re=e((()=>{if(f(),W(),te(),J(),Ie=`CREATE TABLE IF NOT EXISTS session_suggestions (`,Y=p(g,`session_members`,{endMarker:`CREATE TABLE IF NOT EXISTS heartbeat_outcomes (`,includeEndMarker:!1,errorMessage:`OpenClaw agent session-sharing schema markers are missing.`}),X=Y.indexOf(Ie),X===-1)throw Error(`OpenClaw agent session-suggestions schema marker is missing.`);Z=Y.slice(0,X),Q=Y.slice(X),Le=withLegacySessionParticipantsSchema(withLegacyAgentStorageSchema(g.replace(Y,``)))}));function getOpenClawAgentMigrationSchema(e){let t=e<24?withoutSessionEntrySnapshotsSchema(b):b,n=e<23?withLegacyAgentStorageSchema(t,e):t;return e<18?withLegacySessionParticipantsSchema(n):e<21?x(n):n}function migratedSessionColumn(e,t,n){return e.has(t)?t:n}function hasRetiredAgentStateLeaseSchema(e){return!!e.prepare(`SELECT 1 FROM main.sqlite_schema WHERE name = 'state_leases'`).get()}function assertOpenClawAgentSchemaContains(e,t,n,r=`current`,i=!1){let a={..._,allowedMissingTables:[..._.allowedMissingTables,...r===`legacy`?[`session_transcript_cold_archives`]:[]],allowedMissingColumns:[..._.allowedMissingColumns,...r===`legacy`?U:[]]};if(!i){T(e,t,n,a);return}let o=new Set(he(n).map(e=>e.name)),s=_e(e,n,a);s.some(e=>e.code!==`missing-or-drifted-index`||!o.has(e.objectName))&&be(t,ve(s))}function assertOpenClawAgentCurrentRuntimeSchema(e,t){let n=c(t.agentId),r=N(e);if(!r)throw new O(`OpenClaw agent database ${t.pathname} has no schema ownership metadata. Run openclaw doctor --fix to inspect and repair its ownership.`);if(assertExistingAgentSchemaOwner(r,n,t.pathname),r.schemaVersion!==24)throw new O(`OpenClaw agent database ${t.pathname} metadata schema version ${r.schemaVersion??`invalid`} does not match 24; run openclaw doctor --fix before using it.`);if(hasRetiredAgentStateLeaseSchema(e))throw new O(`OpenClaw agent database ${t.pathname} retains retired state_leases storage; run openclaw doctor --fix before using it.`);assertOpenClawAgentSchemaContains(e,t.pathname,b)}function hasAnyCanonicalTable(e,t){let n=ge(t),r=n.map(()=>`?`).join(`, `);return!!e.prepare(`SELECT 1 FROM main.sqlite_schema
         WHERE type = 'table' AND name IN (${r})
         LIMIT 1`).get(...n)}function repairAndAssertAgentSchemaGroup(e,t,n){Ee(e,t,n,{verifyPhysicalIntegrity:!1}),assertOpenClawAgentSchemaContains(e,t,n,`legacy`)}function ensureSessionKeyContractSchemaInTransaction(e){e.exec(p(b,`session_key_contract`,{endMarker:`CREATE TABLE IF NOT EXISTS session_windows (`,includeEndMarker:!1,errorMessage:`OpenClaw agent session-key contract schema markers are missing.`}))}function ensureSessionReactionsSchemaInTransaction(e){e.exec(p(b,`session_reactions`,{endMarker:`CREATE TABLE IF NOT EXISTS board_tabs (`,includeEndMarker:!1,errorMessage:`OpenClaw agent session-reactions schema markers are missing.`}))}function repairAndAssertOpenClawAgentV14SchemaForMigration(e,t){let n=C(e);if(n!==14)throw new O(`OpenClaw agent database ${t.pathname} uses schema version ${n}; expected 14 before migrating it.`);let r=c(t.agentId),i=N(e);if(!i)throw new O(`OpenClaw agent database ${t.pathname} has no schema ownership metadata. Run openclaw doctor --fix to inspect and repair its ownership.`);if(assertExistingAgentSchemaOwner(i,r,t.pathname),i.schemaVersion!==14)throw new O(`OpenClaw agent database ${t.pathname} metadata schema version ${i.schemaVersion??`invalid`} does not match 14; repair the ownership metadata before migrating it.`);ensureSessionAdditiveColumns(e),ensureSessionEntryValidityProjection(e),ensureSessionKeyContractSchemaInTransaction(e),repairAndAssertAgentSchemaGroup(e,t.pathname,Le),hasAnyCanonicalTable(e,Z)&&repairAndAssertAgentSchemaGroup(e,t.pathname,Z),hasAnyCanonicalTable(e,Q)&&repairAndAssertAgentSchemaGroup(e,t.pathname,Q),hasAnyCanonicalTable(e,v)&&(E(e,t.pathname,v),ne(e),repairAndAssertAgentSchemaGroup(e,t.pathname,v)),hasAnyCanonicalTable(e,y)&&(E(e,t.pathname,y),le(e),repairAndAssertAgentSchemaGroup(e,t.pathname,y))}function migrateRetiredAgentStateLeaseSchema(e,t,n){n<17||!hasRetiredAgentStateLeaseSchema(e)||(T(e,t,$),e.exec(`DROP TABLE state_leases;`))}function assertAgentSchemaVersion(e,t,n){let r=N(e);if(assertExistingAgentSchemaOwner(r,t.agentId,t.pathname),C(e)!==t.version||r?.schemaVersion!==t.version)throw new O(`OpenClaw agent database ${t.pathname} did not converge on schema version ${t.version}.`);assertOpenClawAgentSchemaContains(e,t.pathname,n,t.version<18?`legacy`:`current`)}function hasLegacyMemoryChunkProvenanceTrigger(e){return!!e.prepare(`SELECT 1 FROM sqlite_schema WHERE type = 'trigger' AND name = 'memory_index_chunk_provenance_after_insert'`).get()}function hasPendingMemoryChunkMetadataMigration(e){return fe(e)||hasLegacyMemoryChunkProvenanceTrigger(e)}function hasPendingSessionKeyContractSchemaMigration(e){let t=readSqliteTableColumns(e,`session_nodes`);if(!t)return!1;let n=D(e,`session_key_contract`);return!t.has(`entry_valid`)||!n}function hasPendingCurrentVersionAgentDatabaseMigration(e){return!D(e,`session_reactions`)||hasPendingMemoryChunkMetadataMigration(e)||hasPendingSessionKeyContractSchemaMigration(e)||hasRetiredAgentStateLeaseSchema(e)||hasPendingSessionConversationRouteContextColumn(e)||hasPendingSessionTranscriptContextEligibilityColumn(e)||ae(e)||hasPendingSessionProjectColumn(e)}var $,ze=e((()=>{se(),De(),w(),j(),f(),S(),Te(),ee(),oe(),M(),pe(),Ne(),L(),W(),ie(),te(),ue(),Re(),G(),J(),k(),$=`
CREATE TABLE state_leases (
  scope TEXT NOT NULL,
  lease_key TEXT NOT NULL,
  owner TEXT NOT NULL,
  expires_at INTEGER,
  heartbeat_at INTEGER,
  payload_json TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (scope, lease_key)
) STRICT;
`}));export{L as A,normalizeConversationPeerId as B,z as C,backfillSessionConversations as D,assertSupportedAgentMigrationSchemas as E,readSqliteTableColumns as F,assertExistingAgentSchemaOwner as G,P as H,I,assertSupportedAgentSchemaVersion as K,migrateLegacySessionCreator as L,migrateSessionCreatorNamespaces as M,migrateSessionTranscriptActiveProjection as N,ensureSessionAdditiveColumns as O,migrateSessionTranscriptGenerations as P,buildConversationRef as R,withLegacySessionParticipantsSchema as S,B as T,parseSqliteSessionEntryRecord as U,hasValidSessionEntryIdentity as V,assertCanonicalAgentPersistenceVersion as W,G as _,ensureSessionReactionsSchemaInTransaction as a,W as b,hasPendingMemoryChunkMetadataMigration as c,migratedSessionColumn as d,repairAndAssertOpenClawAgentV14SchemaForMigration as f,migrateDeployedTranscriptFtsRowsInTransaction as g,Pe as h,ensureSessionKeyContractSchemaInTransaction as i,migrateConversationDeliveryTargetColumn as j,ensureSessionEntryValidityProjection as k,ze as l,withLegacyAgentStorageSchema as m,assertOpenClawAgentCurrentRuntimeSchema as n,getOpenClawAgentMigrationSchema as o,J as p,Ne as q,assertOpenClawAgentSchemaContains as r,hasPendingCurrentVersionAgentDatabaseMigration as s,assertAgentSchemaVersion as t,migrateRetiredAgentStateLeaseSchema as u,sessionEntrySnapshotsSchemaSql as v,R as w,migrateSessionParticipantsSchema as x,withoutSessionEntrySnapshotsSchema as y,F as z};