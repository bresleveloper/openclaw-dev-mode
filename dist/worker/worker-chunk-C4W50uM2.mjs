import{n as e}from"./worker-chunk-lTaEq7OX.mjs";import{n as t,u as n}from"./worker-chunk-Beu5zrK3.mjs";import{c as r,o as i}from"./worker-chunk-ol4R2Y93.mjs";import{a,c as o,l as s}from"./worker-chunk-D-pM6VZQ.mjs";import{r as c,t as l}from"./worker-chunk-D3C_QfoA.mjs";import{n as u,r as d}from"./worker-chunk-Dr-GiZID.mjs";import{o as f}from"./worker-chunk-BlaVrMFq.mjs";import{i as p,o as m,s as h}from"./worker-chunk-0R9-efJM.mjs";import{X as g,Y as _,ct as v,nt as ee,pt as y,rt as te,tt as ne}from"./worker-chunk-nCN7lbx3.mjs";import{n as re,t as ie}from"./worker-chunk-Af7r65nx.mjs";import{c as b,g as ae,h as oe,i as x}from"./worker-chunk-CfWg-CZ2.mjs";import{i as se,n as ce,o as S}from"./worker-chunk-BJAs1Zl8.mjs";import{d as le,f as C,u as ue}from"./worker-chunk-CKLjF99n.mjs";import{a as de,o as fe}from"./worker-chunk-aG8-LLwy.mjs";import{i as w,n as T,o as E,s as D}from"./worker-chunk-DZIw2MZV.mjs";import{a as pe,o as me,r as O,t as k}from"./worker-chunk-CG9KdiV9.mjs";import{c as he,l as ge,n as A,o as _e,r as ve,u as j}from"./worker-chunk-qhgeU88D.mjs";import{n as ye,t as be}from"./worker-chunk-_-kuICa8.mjs";import{B as xe,D as Se,G as Ce,H as we,N as M,O as Te,P as Ee,U as N,V as De,W as Oe,ot as ke,tt as Ae,z as P}from"./worker-chunk-DiqKZ6lx.mjs";import{i as F,r as je}from"./worker-chunk-6FY92XOD.mjs";import{C as Me,w as Ne}from"./worker-chunk-Dnmgrwwf.mjs";import{n as Pe,t as Fe}from"./worker-chunk-CrNE5ZuS.mjs";import{i as Ie,n as Le}from"./worker-chunk-YafhX7q2.mjs";import{n as Re,r as ze,t as Be}from"./worker-chunk-qxOBR8fh.mjs";import{r as Ve,t as He}from"./worker-chunk-BsXxkkSk.mjs";function ensureLegacySessionEntryValidityTriggers(e){e.exec(I)}function withLegacyCanonicalSessionValidationTriggers(e){return e.replace(`CREATE TABLE IF NOT EXISTS session_windows (`,`${I}\nCREATE TABLE IF NOT EXISTS session_windows (`).replace(`CREATE TABLE IF NOT EXISTS conversations (`,`${L}\nCREATE TABLE IF NOT EXISTS conversations (`)}function migrateCanonicalSessionWriterValidation(e){for(let t of Ue)e.exec(`DROP TRIGGER IF EXISTS ${t}`);T(e,`session_key_contract`,`canonical_ready TEXT`),e.exec(`
    INSERT INTO session_canonical_validation_pending (session_key)
    SELECT session_key FROM session_nodes WHERE true
    ON CONFLICT (session_key) DO NOTHING;
    UPDATE session_key_contract SET canonical_ready = NULL WHERE id = 1;
  `)}function seedCanonicalSessionValidationPending(e){e.exec(`
    INSERT INTO session_canonical_validation_pending (session_key)
    SELECT node.session_key FROM session_nodes AS node
    WHERE NOT EXISTS (
      SELECT 1 FROM session_canonical_validation_pending AS pending
      WHERE pending.session_key = node.session_key
    );
  `)}var I,L,Ue,R=e((()=>{w(),I=`
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
`,L=`
-- Avoid trigger-local conflict clauses: SQLite inherits the outer writer's
-- conflict policy, including writers that predate this validation projection.
CREATE TRIGGER IF NOT EXISTS session_nodes_canonical_pending_after_insert
AFTER INSERT ON session_nodes
BEGIN
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT NEW.session_key
  WHERE NOT EXISTS (
    SELECT 1 FROM session_canonical_validation_pending WHERE session_key = NEW.session_key
  );
END;

CREATE TRIGGER IF NOT EXISTS session_nodes_canonical_pending_after_update
AFTER UPDATE OF session_key, current_session_id, entry_json, entry_valid,
  parent_session_key, spawned_by, fork_source_session_key ON session_nodes
WHEN OLD.session_key IS NOT NEW.session_key
  OR OLD.current_session_id IS NOT NEW.current_session_id
  OR OLD.entry_json IS NOT NEW.entry_json
  OR OLD.entry_valid IS NOT NEW.entry_valid
  OR OLD.parent_session_key IS NOT NEW.parent_session_key
  OR OLD.spawned_by IS NOT NEW.spawned_by
  OR OLD.fork_source_session_key IS NOT NEW.fork_source_session_key
BEGIN
  DELETE FROM session_canonical_validation_pending
  WHERE session_key = OLD.session_key AND OLD.session_key IS NOT NEW.session_key;
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT NEW.session_key
  WHERE NOT EXISTS (
    SELECT 1 FROM session_canonical_validation_pending WHERE session_key = NEW.session_key
  );
END;

CREATE TRIGGER IF NOT EXISTS session_nodes_canonical_pending_after_delete
AFTER DELETE ON session_nodes
BEGIN
  DELETE FROM session_canonical_validation_pending WHERE session_key = OLD.session_key;
END;

CREATE TRIGGER IF NOT EXISTS session_windows_canonical_pending_after_insert
AFTER INSERT ON session_windows
BEGIN
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT node.session_key FROM session_nodes AS node
  WHERE node.current_session_id = NEW.session_id
    AND NOT EXISTS (
      SELECT 1 FROM session_canonical_validation_pending AS pending
      WHERE pending.session_key = node.session_key
    );
END;

CREATE TRIGGER IF NOT EXISTS session_windows_canonical_pending_after_update
AFTER UPDATE OF session_id, session_key ON session_windows
WHEN OLD.session_id IS NOT NEW.session_id OR OLD.session_key IS NOT NEW.session_key
BEGIN
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT node.session_key FROM session_nodes AS node
  WHERE node.current_session_id IN (OLD.session_id, NEW.session_id)
    AND NOT EXISTS (
      SELECT 1 FROM session_canonical_validation_pending AS pending
      WHERE pending.session_key = node.session_key
    );
END;

CREATE TRIGGER IF NOT EXISTS session_windows_canonical_pending_after_delete
AFTER DELETE ON session_windows
BEGIN
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT node.session_key FROM session_nodes AS node
  WHERE node.current_session_id = OLD.session_id
    AND NOT EXISTS (
      SELECT 1 FROM session_canonical_validation_pending AS pending
      WHERE pending.session_key = node.session_key
    );
END;

CREATE TRIGGER IF NOT EXISTS session_key_contract_canonical_pending_after_insert
AFTER INSERT ON session_key_contract
BEGIN
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT node.session_key FROM session_nodes AS node
  WHERE NOT EXISTS (
    SELECT 1 FROM session_canonical_validation_pending AS pending
    WHERE pending.session_key = node.session_key
  );
END;

CREATE TRIGGER IF NOT EXISTS session_key_contract_canonical_pending_after_update
AFTER UPDATE OF main_key ON session_key_contract
WHEN OLD.main_key IS NOT NEW.main_key
BEGIN
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT node.session_key FROM session_nodes AS node
  WHERE NOT EXISTS (
    SELECT 1 FROM session_canonical_validation_pending AS pending
    WHERE pending.session_key = node.session_key
  );
END;

CREATE TRIGGER IF NOT EXISTS session_key_contract_canonical_pending_after_delete
AFTER DELETE ON session_key_contract
BEGIN
  INSERT INTO session_canonical_validation_pending (session_key)
  SELECT node.session_key FROM session_nodes AS node
  WHERE NOT EXISTS (
    SELECT 1 FROM session_canonical_validation_pending AS pending
    WHERE pending.session_key = node.session_key
  );
END;
`,Ue=Object.freeze([...`${I}\n${L}`.matchAll(/CREATE TRIGGER IF NOT EXISTS (\w+)/gu)].map(e=>e[1]))}));function persistAgentSchemaMetadata(e,t,n){let r=Date.now(),i={role:`agent`,schema_version:n,agent_id:t,app_version:ie};p(e,m(e).insertInto(`schema_meta`).values({meta_key:`primary`,...i,created_at:r,updated_at:r}).onConflict(e=>e.column(`meta_key`).doUpdateSet({...i,updated_at:r}).where(e=>e.or([e(`schema_meta.schema_version`,`!=`,n),e(`schema_meta.app_version`,`is`,null),e(`schema_meta.app_version`,`!=`,ie),e(`schema_meta.agent_id`,`!=`,t)])))),le(e,{role:`agent`,schemaVersion:n,agentId:t})}var We=e((()=>{h(),re(),ue()}));function assertSupportedAgentSchemaVersion(e,t,n=x(e)?.userVersion??S(e)){if(n>27)throw ce(`OpenClaw agent database`,t,n,27);return n}function hasAgentDatabaseApplicationSchema(e){let t=x(e);if(t){for(let e of[t.tables,t.views,t.indexes,t.triggers.keys()])for(let t of e)if(!t.startsWith(`sqlite_`))return!0;return!1}return!!e.prepare(`SELECT 1 FROM sqlite_master WHERE substr(name, 1, 7) <> 'sqlite_' LIMIT 1`).get()}function assertCanonicalAgentPersistenceVersion(e,t,n=x(e)?.userVersion??S(e)){let r=n===0&&!hasAgentDatabaseApplicationSchema(e);if(n<17&&!r)throw new de(t,n);if(n<27&&!r)throw new k(`OpenClaw agent database ${t} uses schema version ${n}; stop active agents and run openclaw doctor --fix to migrate session identities before using it.`)}function assertExistingAgentSchemaOwner(e,t,n){if(e){if(e.role!==`agent`)throw new k(`OpenClaw agent database ${n} has schema role ${e.role??`unknown`}; expected agent. Run openclaw doctor --fix to inspect and repair its ownership.`);if(!e.agentId)throw new k(`OpenClaw agent database ${n} has no agent owner. Run openclaw doctor --fix to inspect and repair its ownership.`);if(c(e.agentId)!==t)throw new k(`OpenClaw agent database ${n} belongs to agent ${e.agentId}; requested agent ${t}.`)}}function assertCurrentAgentSchemaMetadata(e,t,n){if(!e)throw new k(`OpenClaw agent database ${n} has no schema ownership metadata. Run openclaw doctor --fix to inspect and repair its ownership.`);if(assertExistingAgentSchemaOwner(e,t,n),e.schemaVersion!==27)throw new k(`OpenClaw agent database ${n} metadata schema version ${e.schemaVersion??`invalid`} does not match 27; run openclaw doctor --fix before using it.`)}var Ge=e((()=>{l(),b(),O(),se(),F(),fe(),ue()}));function migrateLegacySessionCreator(e){let t=e,n=e.createdActor??(s(t.createdBy)?{...t.createdBy,type:`human`,source:`unknown`}:void 0);if(n?.type!==`human`)return e;let r=n.source===`profile`||n.source===`channel`||n.source===`unknown`?n.source:e.createdVia===`operator`||e.createdVia===`run`?`profile`:e.createdVia===`channel`?`channel`:`unknown`;if(n===e.createdActor&&r===n.source&&!t.createdBy)return e;let i={...t,createdActor:{...n,source:r}};return delete i.createdBy,i}var Ke=e((()=>{o()}));function assertSupportedAgentMigrationSchemas(e,t,n){if(n<8&&[`sessions`,`session_entries`,`transcript_events`].some(t=>E(e,t))||E(e,`session_transcript_files`)||readSqliteTableColumns(e,`session_transcript_fts`)?.has(`session_key`))throw new k(`OpenClaw agent database ${t} contains an unreleased session schema (version ${n}). Preserve a complete copy of your state directory and configuration, including shared agent registration. Run "openclaw doctor --fix" with OpenClaw 2026.9.7 against that copy. If a store is held, follow Doctor's explicit agent-restoration instructions, then rerun Doctor before retrying the upgrade.`);let r=readSqliteTableColumns(e,`acp_parent_stream_events`),i=readSqliteTableColumns(e,`trajectory_runtime_events`),a=readSqliteTableColumns(e,`memory_index_sources`);if(r&&!r.has(`session_id`)||i?.has(`event_id`)||a?.has(`source_kind`))throw new k(`OpenClaw agent database ${t} has an unsupported legacy schema. Upgrades from pre-July-2026 state are no longer migrated; restore a backup produced by a July 2026 or newer release before retrying.`)}function migrateSessionTranscriptGenerations(e,t){if(t>=13)return;let n=e.prepare(`INSERT OR IGNORE INTO transcript_rewrite_watermarks (session_id, generation, updated_at)
     SELECT session_id, lower(hex(randomblob(16))), ?
     FROM transcript_events
     GROUP BY session_id`);n.setReadBigInts(!0),n.run(Date.now())}function migrateSessionTranscriptActiveProjection(e,t){if(t>=10)return;let n=readSqliteTableColumns(e,`session_transcript_index_state`);n&&!n.has(`active_event_count`)&&e.exec(`ALTER TABLE session_transcript_index_state ADD COLUMN active_event_count INTEGER NOT NULL DEFAULT 0;`),n&&!n.has(`active_message_count`)&&e.exec(`ALTER TABLE session_transcript_index_state ADD COLUMN active_message_count INTEGER NOT NULL DEFAULT 0;`),e.exec(`
    DELETE FROM session_transcript_active_events;
    UPDATE session_transcript_index_state
    SET needs_rebuild = 1,
        active_event_count = 0,
        active_message_count = 0,
        updated_at = ${Date.now()};
  `)}function inferMigratedChatType(e){let t=Pe(n(e.entry.chatType))??Pe(e.persistedChatType);if(t)return t;let r=He(e.sessionKey);if(r!==`unknown`)return r;let i=e.deliveryTarget?.toLowerCase();return i?.startsWith(`channel:`)||/^[^:]+:channel:/u.test(i??``)?`channel`:/^(?:[^:]+:)?(?:group|room):/u.test(i??``)||n(e.entry.groupId)?`group`:`direct`}function migratedConversation(e,t,r){let i=a(e.delivery),o=a(i?.context)??a(e.deliveryContext),s=a(i?.origin)??a(e.origin),c=n(o?.to),l=n(s?.from),u=inferMigratedChatType({entry:e,persistedChatType:t,sessionKey:r,deliveryTarget:c??l}),f=c??(u===`direct`?l:void 0);if(!f)return;let p=!!c,m=(p?n(o?.channel)??n(e.channel)??n(e.lastChannel)??n(s?.provider):n(s?.provider))?.toLowerCase(),h=d(p?n(o?.accountId)??n(e.lastAccountId)??n(s?.accountId):n(s?.accountId)),g=p?o?.threadId:s?.threadId,_=typeof g==`number`&&Number.isFinite(g)?String(g):n(g),v=m?ze(m,f):void 0;if(m&&v)return{conversationRef:Be({channel:m,accountId:h,kind:u,peerId:v,threadId:_}),channel:m,accountId:h,kind:u,peerId:v,deliveryTarget:f,threadId:_,nativeChannelId:n(s?.nativeChannelId),nativeDirectUserId:n(s?.nativeDirectUserId),label:n(e.displayName)??n(e.label)??n(e.subject)??n(e.groupId)}}function backfillSessionConversations(e){if(!readSqliteTableColumns(e,`session_entries`)||!readSqliteTableColumns(e,`sessions`)||!readSqliteTableColumns(e,`conversations`))return;readSqliteTableColumns(e,`session_conversations`)||e.exec(`
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
      `).all(),i=e.prepare(`
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
  `),a=e.prepare(`
    DELETE FROM session_conversations
    WHERE session_id = ? AND conversation_id = ? AND role = 'related';
  `),o=e.prepare(`
    UPDATE session_conversations SET role = 'related', last_seen_at = ?
    WHERE session_id = ? AND role = 'primary';
  `),s=e.prepare(`
    INSERT INTO session_conversations (
      session_id, conversation_id, role, first_seen_at, last_seen_at
    ) VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(session_id, conversation_id, role) DO UPDATE SET
      last_seen_at = excluded.last_seen_at;
  `),c=e.prepare(`UPDATE sessions SET primary_conversation_id = ? WHERE session_id = ?`);for(let e of[i,a,o,s,c])e.setReadBigInts(!0);for(let e of t){let t=n(e.session_id),l=typeof e.entry_json==`string`?r(e.entry_json):void 0,u=typeof e.updated_at==`number`?e.updated_at:Date.now(),d=l?migratedConversation(l,n(e.persisted_chat_type),n(e.session_key)):void 0;if(!t||!d)continue;let f=e.session_scope===`shared-main`&&d.kind===`direct`?`participant`:`primary`;i.run(d.conversationRef,d.channel,d.accountId,d.kind,d.peerId,d.deliveryTarget,d.threadId??null,d.nativeChannelId??null,d.nativeDirectUserId??null,d.label??null,u,u),f===`primary`&&(o.run(u,t),a.run(t,d.conversationRef)),s.run(t,d.conversationRef,f,u,u),f===`primary`&&c.run(d.conversationRef,t)}}function readSqliteTableColumns(e,t){if(!/^[A-Za-z_][A-Za-z0-9_]*$/.test(t))throw Error(`invalid SQLite table identifier: ${t}`);if(!E(e,t))return null;let n=e.prepare(`PRAGMA table_info(${t})`).all();return new Set(n.flatMap(e=>typeof e.name==`string`?[e.name]:[]))}function ensureSessionAdditiveColumns(e){for(let{tableName:t,columnName:n,dataType:r}of ne)T(e,t,`${n} ${r}`);E(e,`session_conversations`)&&!x(e)?.triggers.has(`session_conversations_route_context_invalidate_after_update`)&&e.exec(`
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
    `)}function migrateConversationDeliveryTargetColumn(e){T(e,`conversations`,`delivery_target TEXT NOT NULL DEFAULT ''`)}function ensureSessionEntryValidityProjection(e){let t=readSqliteTableColumns(e,`session_nodes`);if(!t)return;t.has(`entry_valid`)||e.exec(`ALTER TABLE session_nodes ADD COLUMN entry_valid INTEGER NOT NULL DEFAULT 0 CHECK (entry_valid IN (-1, 0, 1))`);let n=e.prepare(`SELECT current_session_id, entry_json, session_key, updated_at FROM session_nodes WHERE entry_valid = 0 ORDER BY session_key LIMIT 256`),r=e.prepare(`UPDATE session_nodes SET entry_valid = ? WHERE session_key = ?`);for(r.setReadBigInts(!0);;){let e=n.all();if(e.length===0)break;for(let t of e)r.run(Ie(t)?1:-1,t.session_key)}}function migrateSessionCreatorNamespaces(e,t){if(t>=19||!E(e,`session_nodes`))return;let n=e.prepare(`UPDATE session_nodes SET entry_json = ?, created_actor_type = ?, created_actor_id = ? WHERE session_key = ?`);n.setReadBigInts(!0);let r=e.prepare(`SELECT session_key, entry_json FROM session_nodes
    WHERE json_valid(entry_json) AND (json_extract(entry_json, '$.createdActor.type') = 'human'
      OR (json_type(entry_json, '$.createdActor') IS NULL AND json_type(entry_json, '$.createdBy') = 'object'))`);for(let e of r.all()){let t=migrateLegacySessionCreator(JSON.parse(e.entry_json));n.run(JSON.stringify(t),t.createdActor?.type??null,t.createdActor?.id??null,e.session_key)}}var qe=e((()=>{i(),o(),t(),Fe(),Le(),b(),O(),u(),Re(),Ve(),Ke(),te(),w()}));function withoutAgentJsonPredicateColumns(e){let t=e;for(let[e,n]of Object.entries(z))t=t.replace(`  ${e} ${n},\n`,``);return t}function migrateAgentJsonPredicatesInTransaction(e){T(e,`session_nodes`,`session_started_at INTEGER`),T(e,`session_nodes`,`has_optional_references INTEGER NOT NULL DEFAULT 0`),e.exec(`
    UPDATE session_nodes SET
      session_started_at = CASE WHEN json_valid(entry_json)
        THEN CAST(json_extract(entry_json, '$.sessionStartedAt') AS INTEGER) END,
      has_optional_references = CASE WHEN NOT json_valid(entry_json) OR instr(entry_json, char(0)) > 0 THEN 1
        WHEN json_type(entry_json, '$.previousSessionId') IS NOT NULL
          OR json_type(entry_json, '$.usageFamilySessionIds') IS NOT NULL
          OR json_type(entry_json, '$.compactionCheckpoints') IS NOT NULL THEN 1
        ELSE 0 END;
  `),E(e,`context_engine_turn_outbox`)&&(T(e,`context_engine_turn_outbox`,`payload_state TEXT`),e.exec(`
      UPDATE context_engine_turn_outbox SET payload_state = CASE
        WHEN json_valid(payload_json) THEN CASE
          WHEN json_type(payload_json, '$.state') = 'text'
          THEN json_extract(payload_json, '$.state') END END;
    `));for(let t of Je.transcript_events)T(e,`transcript_events`,`${t} ${z[t]}`);e.exec(`
    WITH source AS (
      SELECT session_id, seq, CASE WHEN event_json IS NOT NULL THEN event_json
        ELSE json_extract(navigation_json, '$.navigation') END AS event
      FROM transcript_events
    ), navigation AS (
      SELECT session_id, seq, coalesce(json_valid(event), 0) AS valid,
        CASE WHEN json_valid(event) THEN event ELSE '{}' END AS event
      FROM source
    ), fields AS (
      SELECT session_id, seq, valid,
        json_extract(event, '$.type') AS first_type,
        json_extract(event, '$.customType') AS first_custom_type,
        CASE WHEN json_type(event, '$.display') = 'true' THEN 1 ELSE 0 END AS display,
        json_extract(event, '$.message.role') AS role,
        (SELECT value FROM json_each(event) WHERE key = 'type' ORDER BY id DESC LIMIT 1) AS last_type,
        (SELECT value FROM json_each(event) WHERE key = 'customType' ORDER BY id DESC LIMIT 1) AS last_custom_type
      FROM navigation
    )
    UPDATE transcript_events SET
      navigation_type = CASE WHEN fields.first_type IN ('session', 'message', 'reset', 'compaction', 'custom_message', 'custom') THEN fields.first_type END,
      navigation_custom_type = CASE WHEN fields.first_custom_type IN ('openclaw.runtime-context', 'openclaw.cache-ttl') THEN fields.first_custom_type END,
      navigation_display = fields.display,
      message_role = CASE WHEN fields.role IN ('user', 'assistant', 'toolResult', 'system') THEN fields.role END,
      navigation_last_type = CASE WHEN fields.last_type IN ('session', 'message', 'reset', 'compaction', 'custom_message', 'custom') THEN fields.last_type END,
      navigation_last_custom_type = CASE WHEN fields.last_custom_type IN ('openclaw.runtime-context', 'openclaw.cache-ttl') THEN fields.last_custom_type END,
      navigation_valid = fields.valid
    FROM fields WHERE transcript_events.session_id = fields.session_id AND transcript_events.seq = fields.seq;
  `)}var Je,z,B=e((()=>{w(),Je={session_nodes:[`session_started_at`,`has_optional_references`],transcript_events:[`navigation_type`,`navigation_custom_type`,`navigation_display`,`message_role`,`navigation_last_type`,`navigation_last_custom_type`,`navigation_valid`],context_engine_turn_outbox:[`payload_state`]},z={session_started_at:`INTEGER`,has_optional_references:`INTEGER NOT NULL DEFAULT 0`,payload_state:`TEXT`,navigation_type:`TEXT`,navigation_custom_type:`TEXT`,navigation_display:`INTEGER NOT NULL DEFAULT 0`,message_role:`TEXT`,navigation_last_type:`TEXT`,navigation_last_custom_type:`TEXT`,navigation_valid:`INTEGER NOT NULL DEFAULT 1`}}));function withoutOutboxEnqueueSequence(e){return e.replace(`  enqueue_sequence INTEGER PRIMARY KEY,
  advancement_key TEXT NOT NULL UNIQUE,`,`  advancement_key TEXT NOT NULL PRIMARY KEY,`)}function migrateOutboxEnqueueSequenceInTransaction(e){if(!E(e,`context_engine_turn_outbox`)||D(e,`context_engine_turn_outbox`,`enqueue_sequence`))return null;let t=performance.now(),n=x(e)??oe(e),r=[...n.indexDefinitions.values(),...n.triggers.values()].filter(({table:e})=>e===`context_engine_turn_outbox`),i=v(_,`context_engine_turn_outbox`);e.exec(`
    ${i.replace(`IF NOT EXISTS context_engine_turn_outbox`,`context_engine_turn_outbox_sequence_migration`)}
    INSERT INTO context_engine_turn_outbox_sequence_migration
      (enqueue_sequence, advancement_key, engine_id, owner_plugin_id, session_id,
       payload_json, payload_state, attempt_count, last_attempt_at, last_error, created_at)
    SELECT rowid, advancement_key, engine_id, owner_plugin_id, session_id,
       payload_json, payload_state, attempt_count, last_attempt_at, last_error, created_at
    FROM context_engine_turn_outbox;
    DROP TABLE context_engine_turn_outbox;
    ALTER TABLE context_engine_turn_outbox_sequence_migration RENAME TO context_engine_turn_outbox;
  `);for(let t of r)t.sql!==null&&e.exec(t.sql);return performance.now()-t}var V=e((()=>{ae(),b(),y(),g(),w()}));function sessionParticipantsSchemaSql(){return v(_,je,{endMarker:`CREATE TABLE IF NOT EXISTS session_key_contract (`,includeEndMarker:!1,errorMessage:`OpenClaw session participant schema markers are missing.`})}var Ye,Xe=e((()=>{ye(),y(),F(),g(),Ye=be(sessionParticipantsSchemaSql,{tables:[je]})}));function withLegacySessionParticipantsSchema(e){return Te(e).replace(sessionParticipantsSchemaSql().trim(),H)}function migrateSessionParticipantsSchema(e,t){if(!E(e,`session_participants`))return;if(A(e,t,H,{allowedMissingColumns:W}),E(e,U))throw Error(`Participant migration table already exists: ${U}`);if(e.prepare(`SELECT name FROM sqlite_schema
    WHERE (type IN ('trigger', 'index') AND tbl_name = 'session_participants' AND sql IS NOT NULL)
       OR (type IN ('view', 'trigger') AND sql LIKE '%session_participants%')`).all().length>0)throw Error(`Participant migration cannot rebuild unknown indexes, views, or triggers.`);for(let t of e.prepare(`SELECT name FROM sqlite_schema WHERE type = 'table'`).all())if(e.prepare(`PRAGMA foreign_key_list("${String(t.name).replaceAll(`"`,`""`)}")`).all().some(e=>e.table===`session_participants`))throw Error(`Participant migration cannot rebuild a table referenced by an unknown foreign key.`);let n=D(e,`session_participants`,`actor_source`)?`actor_source`:`NULL`,r=D(e,`session_participants`,`contribution_count`)?`coalesce(contribution_count, 1)`:`1`,i=`actor_type = 'agent' AND ${n} = 'agent' AND actor_id <> ''`,a=`(${i}) OR (actor_type = 'human' AND ${n} = 'channel')`;e.exec(`
    ${sessionParticipantsSchemaSql().replace(`IF NOT EXISTS session_participants`,U)}
    INSERT INTO ${U}
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
    ALTER TABLE ${U} RENAME TO session_participants;
  `)}var H,U,W,G=e((()=>{j(),Se(),Xe(),w(),H=`CREATE TABLE IF NOT EXISTS session_participants (
  session_key TEXT NOT NULL,
  actor_type TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  actor_source TEXT,
  contribution_count INTEGER,
  first_prompted_at INTEGER NOT NULL,
  last_prompted_at INTEGER NOT NULL,
  PRIMARY KEY (session_key, actor_type, actor_id),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
) STRICT;`,U=`session_participants_identity_migration`,W=[`session_participants.actor_source`,`session_participants.contribution_count`]}));function sessionEntrySnapshotsSchemaSql(e){return v(e,`session_entry_snapshots`,{endMarker:`CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_updated_at`,includeEndMarker:!1})}function withoutSessionEntrySnapshotsSchema(e){return e.includes(`CREATE TABLE IF NOT EXISTS session_entry_snapshots (`)?e.replace(`  snapshot_revision INTEGER NOT NULL DEFAULT 0,
`,``).replace(sessionEntrySnapshotsSchemaSql(e),``):e}var K=e((()=>{y()}));function withDeployedTranscriptFtsRowSchema(e){let t=v(e,`session_transcript_index_state`);return e.replace(t,t.replace(`  updated_at INTEGER NOT NULL,`,`  fts_row_count INTEGER,
  updated_at INTEGER NOT NULL,`)).replace(`CREATE VIRTUAL TABLE IF NOT EXISTS session_transcript_fts USING fts5(`,`${q}\nCREATE VIRTUAL TABLE IF NOT EXISTS session_transcript_fts USING fts5(`)}function migrateDeployedTranscriptFtsRowsInTransaction(e,t){if(!e.isTransaction||e.prepare(`PRAGMA foreign_keys`).get()?.foreign_keys!==0)throw Error(`Transcript FTS migration requires an admitted transaction with foreign keys off`);A(e,`deployed transcript FTS ownership`,q);let n=e.prepare(`PRAGMA table_xinfo(session_transcript_fts_rows)`).all();if(n.length!==2||n.some(e=>e.name!==`session_id`&&e.name!==`fts_rowid`))throw Error(`Transcript FTS migration cannot discard unknown row-map columns`);let r=e.prepare(`SELECT name FROM sqlite_schema
    WHERE (tbl_name = 'session_transcript_fts_rows' AND sql IS NOT NULL
      AND type IN ('index', 'trigger') AND name != 'idx_agent_transcript_fts_rows_session')
      OR (type IN ('view', 'trigger') AND sql LIKE '%session_transcript_fts_rows%')`).all(),i=e.prepare(`SELECT schema.name FROM sqlite_schema AS schema
    JOIN pragma_foreign_key_list(schema.name) AS fk
    WHERE schema.type = 'table' AND fk."table" = 'session_transcript_fts_rows'`).all();if(r.length||i.length)throw Error(`Transcript FTS migration cannot discard unknown row-map dependencies`);if(e.prepare(`SELECT 1 FROM sqlite_schema WHERE name = ?`).get(J))throw Error(`Transcript FTS migration table already exists`);e.exec(`ALTER TABLE session_transcript_fts_rows RENAME TO ${J}`),e.exec(v(t,`session_transcript_fts_rows`,{endMarker:`INSERT OR IGNORE INTO memory_index_state`,includeEndMarker:!1})),e.exec(`INSERT INTO session_transcript_fts_rows (id, session_id, message_id)
    SELECT rowid, session_id, message_id FROM session_transcript_fts`),e.exec(`UPDATE session_transcript_index_state AS state SET needs_rebuild = 1
    WHERE needs_rebuild = 0 AND (
      fts_row_count IS NULL
      OR fts_row_count != (SELECT count(*) FROM ${J} AS old WHERE old.session_id = state.session_id)
      OR EXISTS (
        SELECT 1 FROM ${J} AS old
        WHERE old.session_id = state.session_id AND NOT EXISTS (
          SELECT 1 FROM session_transcript_fts_rows AS current
          WHERE current.id = old.fts_rowid AND current.session_id = old.session_id))
      OR EXISTS (
        SELECT 1 FROM session_transcript_fts_rows AS current
        WHERE current.session_id = state.session_id AND NOT EXISTS (
          SELECT 1 FROM ${J} AS old
          WHERE old.fts_rowid = current.id AND old.session_id = current.session_id))
    );
    DROP TABLE ${J};
    ALTER TABLE session_transcript_index_state DROP COLUMN fts_row_count;`)}var q,J,Ze=e((()=>{j(),y(),q=`CREATE TABLE IF NOT EXISTS session_transcript_fts_rows (
  session_id TEXT NOT NULL,
  fts_rowid INTEGER NOT NULL PRIMARY KEY
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_transcript_fts_rows_session
  ON session_transcript_fts_rows(session_id);
`,J=`session_transcript_fts_rows_legacy22`}));function withLegacyAgentStorageSchema(e,t=21){let n=withoutSessionEntrySnapshotsSchema(e);for(let[e,t]of Object.entries(Qe))n=n.replace(v(n,e),t);return n.includes(`CREATE TABLE IF NOT EXISTS session_transcript_fts_rows (`)&&(n=n.replace(v(n,`session_transcript_fts_rows`,{endMarker:`INSERT OR IGNORE INTO memory_index_state`,includeEndMarker:!1}),``)),t===22?withDeployedTranscriptFtsRowSchema(n):n}var Qe,Y=e((()=>{y(),F(),K(),Ze(),Qe={transcript_events:`CREATE TABLE IF NOT EXISTS transcript_events (
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
) STRICT;`}})),$e,X,Z,Q,$,et,tt=e((()=>{if(y(),R(),B(),V(),G(),we(),Y(),$e=`CREATE TABLE IF NOT EXISTS session_suggestions (`,X=v(xe,`session_members`,{endMarker:`CREATE TABLE IF NOT EXISTS heartbeat_outcomes (`,includeEndMarker:!1,errorMessage:`OpenClaw agent session-sharing schema markers are missing.`}),Z=X.indexOf($e),Z===-1)throw Error(`OpenClaw agent session-suggestions schema marker is missing.`);Q=X.slice(0,Z),$=X.slice(Z),et=withLegacySessionParticipantsSchema(withLegacyAgentStorageSchema(withLegacyCanonicalSessionValidationTriggers(withoutAgentJsonPredicateColumns(withoutOutboxEnqueueSequence(xe.replace(X,``))))))}));function getOpenClawAgentMigrationSchema(e){let t=e<27?withoutOutboxEnqueueSequence(_):_,n=e<26?withoutAgentJsonPredicateColumns(t):t,r=e<25?withLegacyCanonicalSessionValidationTriggers(n):n,i=e<24?withoutSessionEntrySnapshotsSchema(r):r,a=e<23?withLegacyAgentStorageSchema(i,e):i;return e<18?withLegacySessionParticipantsSchema(a):e<21?Te(a):a}function migratedSessionColumn(e,t,n){return e.has(t)?t:n}function hasRetiredAgentStateLeaseSchema(e){return!!e.prepare(`SELECT 1 FROM main.sqlite_schema WHERE name = 'state_leases'`).get()}function assertOpenClawAgentSchemaContains(e,t,n,r=`current`,i=!1){let a={...M,allowedMissingTables:[...M.allowedMissingTables,...r===`legacy`?[`session_transcript_cold_archives`]:[]],allowedMissingColumns:[...M.allowedMissingColumns,...r===`legacy`?W:[]]};if(!i)return A(e,t,n,a),!1;let o=new Set(he(n).map(e=>e.name)),s=_e(e,n,a);return s.some(e=>e.code!==`missing-or-drifted-index`||!o.has(e.objectName))&&me(t,pe(s)),s.length>0}function assertOpenClawAgentCurrentRuntimeSchema(e,t){let n=c(t.agentId);if(assertCurrentAgentSchemaMetadata(C(e),n,t.pathname),hasRetiredAgentStateLeaseSchema(e))throw new k(`OpenClaw agent database ${t.pathname} retains retired state_leases storage; run openclaw doctor --fix before using it.`);assertOpenClawAgentSchemaContains(e,t.pathname,_)}function hasAnyCanonicalTable(e,t){let n=ge(t),r=n.map(()=>`?`).join(`, `);return!!e.prepare(`SELECT 1 FROM main.sqlite_schema
         WHERE type = 'table' AND name IN (${r})
         LIMIT 1`).get(...n)}function repairAndAssertAgentSchemaGroup(e,t,n){Ne(e,t,n,{verifyPhysicalIntegrity:!1}),assertOpenClawAgentSchemaContains(e,t,n,`legacy`)}function ensureSessionKeyContractSchemaInTransaction(e){E(e,`session_key_contract`)&&e.prepare(`SELECT 1 FROM session_key_contract WHERE id = 1`).get()||e.exec(v(_,`session_key_contract`,{endMarker:`CREATE TABLE IF NOT EXISTS session_windows (`,includeEndMarker:!1,errorMessage:`OpenClaw agent session-key contract schema markers are missing.`}))}function ensureSessionReactionsSchemaInTransaction(e){let t=x(e);t?.tables.has(`session_reactions`)&&t.indexes.has(`idx_agent_session_reactions_message`)||e.exec(v(_,`session_reactions`,{endMarker:`CREATE TABLE IF NOT EXISTS board_tabs (`,includeEndMarker:!1,errorMessage:`OpenClaw agent session-reactions schema markers are missing.`}))}function repairAndAssertOpenClawAgentV14SchemaForMigration(e,t){let n=S(e);if(n!==14)throw new k(`OpenClaw agent database ${t.pathname} uses schema version ${n}; expected 14 before migrating it.`);let r=c(t.agentId),i=C(e);if(!i)throw new k(`OpenClaw agent database ${t.pathname} has no schema ownership metadata. Run openclaw doctor --fix to inspect and repair its ownership.`);if(assertExistingAgentSchemaOwner(i,r,t.pathname),i.schemaVersion!==14)throw new k(`OpenClaw agent database ${t.pathname} metadata schema version ${i.schemaVersion??`invalid`} does not match 14; repair the ownership metadata before migrating it.`);ensureSessionAdditiveColumns(e),ensureSessionEntryValidityProjection(e),ensureLegacySessionEntryValidityTriggers(e),ensureSessionKeyContractSchemaInTransaction(e),repairAndAssertAgentSchemaGroup(e,t.pathname,et),hasAnyCanonicalTable(e,Q)&&repairAndAssertAgentSchemaGroup(e,t.pathname,Q),hasAnyCanonicalTable(e,$)&&repairAndAssertAgentSchemaGroup(e,t.pathname,$),hasAnyCanonicalTable(e,N)&&(ve(e,t.pathname,N),Oe(e),repairAndAssertAgentSchemaGroup(e,t.pathname,N)),hasAnyCanonicalTable(e,P)&&(ve(e,t.pathname,P),De(e),repairAndAssertAgentSchemaGroup(e,t.pathname,P))}function migrateRetiredAgentStateLeaseSchema(e,t,n){n<17||!hasRetiredAgentStateLeaseSchema(e)||(A(e,t,nt),e.exec(`DROP TABLE state_leases;`))}function assertAgentSchemaVersion(e,t,n){let r=C(e);if(assertExistingAgentSchemaOwner(r,t.agentId,t.pathname),S(e)!==t.version||r?.schemaVersion!==t.version)throw new k(`OpenClaw agent database ${t.pathname} did not converge on schema version ${t.version}.`);assertOpenClawAgentSchemaContains(e,t.pathname,n,t.version<18?`legacy`:`current`)}function finishAgentSchemaMigration(e,t,n,r,i,a,o){if(e.exec(`PRAGMA user_version = ${r};`),persistAgentSchemaMetadata(e,t,r),assertAgentSchemaVersion(e,{agentId:t,pathname:n,version:r},i),a&&e.prepare(`PRAGMA foreign_key_check`).all().length>0)throw Error(`Agent schema migration failed foreign key validation for ${n}.`);o()}function hasLegacyMemoryChunkProvenanceTrigger(e){return!!e.prepare(`SELECT 1 FROM sqlite_schema WHERE type = 'trigger' AND name = 'memory_index_chunk_provenance_after_insert'`).get()}function hasPendingMemoryChunkMetadataMigration(e){return ke(e)||hasLegacyMemoryChunkProvenanceTrigger(e)}function hasPendingSessionKeyContractSchemaMigration(e){let t=readSqliteTableColumns(e,`session_nodes`);if(!t)return!1;let n=E(e,`session_key_contract`);return!t.has(`entry_valid`)||!n}function hasPendingCurrentVersionAgentDatabaseMigration(e){return!E(e,`session_reactions`)||hasPendingMemoryChunkMetadataMigration(e)||hasPendingSessionKeyContractSchemaMigration(e)||hasRetiredAgentStateLeaseSchema(e)||ee((x(e)??oe(e)).tableSql)}var nt,rt=e((()=>{Ae(),Me(),ae(),j(),b(),O(),y(),se(),f(),Ce(),R(),Se(),te(),F(),We(),Ee(),Ge(),qe(),B(),V(),G(),we(),g(),tt(),K(),Y(),w(),nt=`
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
`}));export{backfillSessionConversations as A,migrateLegacySessionCreator as B,Ye as C,B as D,migrateOutboxEnqueueSequenceInTransaction as E,migrateSessionCreatorNamespaces as F,hasAgentDatabaseApplicationSchema as G,assertCurrentAgentSchemaMetadata as H,migrateSessionTranscriptActiveProjection as I,persistAgentSchemaMetadata as J,Ge as K,migrateSessionTranscriptGenerations as L,ensureSessionEntryValidityProjection as M,qe as N,migrateAgentJsonPredicatesInTransaction as O,migrateConversationDeliveryTargetColumn as P,seedCanonicalSessionValidationPending as Q,readSqliteTableColumns as R,migrateSessionParticipantsSchema as S,V as T,assertExistingAgentSchemaOwner as U,assertCanonicalAgentPersistenceVersion as V,assertSupportedAgentSchemaVersion as W,R as X,ensureLegacySessionEntryValidityTriggers as Y,migrateCanonicalSessionWriterValidation as Z,migrateDeployedTranscriptFtsRowsInTransaction as _,ensureSessionReactionsSchemaInTransaction as a,withoutSessionEntrySnapshotsSchema as b,hasPendingCurrentVersionAgentDatabaseMigration as c,migrateRetiredAgentStateLeaseSchema as d,migratedSessionColumn as f,Ze as g,withLegacyAgentStorageSchema as h,ensureSessionKeyContractSchemaInTransaction as i,ensureSessionAdditiveColumns as j,assertSupportedAgentMigrationSchemas as k,hasPendingMemoryChunkMetadataMigration as l,Y as m,assertOpenClawAgentCurrentRuntimeSchema as n,finishAgentSchemaMigration as o,repairAndAssertOpenClawAgentV14SchemaForMigration as p,We as q,assertOpenClawAgentSchemaContains as r,getOpenClawAgentMigrationSchema as s,assertAgentSchemaVersion as t,rt as u,K as v,Xe as w,G as x,sessionEntrySnapshotsSchemaSql as y,Ke as z};