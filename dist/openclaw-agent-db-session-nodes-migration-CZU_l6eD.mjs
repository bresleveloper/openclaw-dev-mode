import{d as migratedSessionColumn,w as readSqliteTableColumns}from"./openclaw-agent-db-schema-helpers-BBqlSz75.mjs";
//!src/state/openclaw-agent-db-session-nodes-migration.ts
const SESSION_NODE_SCHEMA_VERSION=14;function jsonText(e){return`CASE
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
  `)}function backfillSessionNodes(e){const t=readSqliteTableColumns(e,`session_entries`);const n=readSqliteTableColumns(e,`session_routes`);if(t){const n=migratedSessionColumn(t,`status`,`NULL`);e.exec(`INSERT OR REPLACE INTO session_nodes (
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
      FROM session_entries;`)}if(n)e.exec(`INSERT OR IGNORE INTO session_nodes
      (session_key, current_session_id, entry_json, updated_at)
      SELECT session_key, session_id, '{}', updated_at FROM session_routes;`);e.exec(`INSERT OR IGNORE INTO session_nodes
    (session_key, current_session_id, entry_json, updated_at)
    SELECT session_key, session_id, '{}', updated_at FROM sessions;`)}function createLegacySessionWindowSelect(e){const t=readSqliteTableColumns(e,`sessions`);if(!t)return;const n=readSqliteTableColumns(e,`session_entries`);const r=readSqliteTableColumns(e,`session_routes`);const ownerValue=(e,t)=>`(SELECT candidate.${t}
        FROM ${e} AS candidate
        INNER JOIN session_windows AS owner_window ON owner_window.session_id = candidate.session_id
        WHERE candidate.session_id = session_windows.session_id
        ORDER BY CASE WHEN candidate.session_key = owner_window.session_key THEN 0 ELSE 1 END,
                 candidate.updated_at DESC,
                 candidate.session_key ASC
        LIMIT 1)`;const i=n?ownerValue(`session_entries`,`session_key`):`NULL`;const a=r?ownerValue(`session_routes`,`session_key`):`NULL`;const o=n?ownerValue(`session_entries`,`entry_json`):`NULL`;return{columns:`session_id, session_key, previous_session_id, reason, session_scope,
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
      ${migratedSessionColumn(t,`session_scope`,`'conversation'`)},
      created_at,
      updated_at,
      ${migratedSessionColumn(t,`transcript_updated_at`,`NULL`)},
      ${migratedSessionColumn(t,`transcript_observed_at`,`NULL`)},
      ${migratedSessionColumn(t,`session_entry_provenance`,`0`)},
      ${migratedSessionColumn(t,`acp_owned`,`0`)},
      ${migratedSessionColumn(t,`plugin_owner_id`,`NULL`)},
      ${migratedSessionColumn(t,`hook_external_content_source`,`NULL`)},
      ${migratedSessionColumn(t,`started_at`,`NULL`)},
      ${migratedSessionColumn(t,`ended_at`,`NULL`)},
      ${migratedSessionColumn(t,`status`,`NULL`)},
      ${migratedSessionColumn(t,`chat_type`,`NULL`)},
      ${migratedSessionColumn(t,`channel`,`NULL`)},
      ${migratedSessionColumn(t,`account_id`,`NULL`)},
      ${migratedSessionColumn(t,`primary_conversation_id`,`NULL`)},
      ${migratedSessionColumn(t,`model_provider`,`NULL`)},
      ${migratedSessionColumn(t,`model`,`NULL`)},
      ${migratedSessionColumn(t,`agent_harness_id`,`NULL`)},
      ${migratedSessionColumn(t,`parent_session_key`,`NULL`)},
      ${migratedSessionColumn(t,`spawned_by`,`NULL`)},
      ${migratedSessionColumn(t,`display_name`,`NULL`)}
    FROM session_windows`}}function migrateSessionWindows(e){const t=createLegacySessionWindowSelect(e);if(!t)return;e.exec(`ALTER TABLE sessions RENAME TO session_windows;`);e.exec(`
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
  `)}function renameTranscriptRewriteWatermarks(e){if(readSqliteTableColumns(e,`session_transcript_generations`)&&!readSqliteTableColumns(e,`transcript_rewrite_watermarks`))e.exec(`ALTER TABLE session_transcript_generations RENAME TO transcript_rewrite_watermarks;`)}function rebuildBoardTabs(e){if(!readSqliteTableColumns(e,`board_tabs`))return;if(readSqliteTableColumns(e,`board_widgets`))e.exec(`
      DELETE FROM board_widgets
      WHERE NOT EXISTS (
        SELECT 1 FROM session_nodes WHERE session_nodes.session_key = board_widgets.session_key
      );
    `);e.exec(`
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
  `)}function rebuildHeartbeatOutcomes(e){const t=readSqliteTableColumns(e,`heartbeat_outcomes`);if(!t)return;e.exec(`
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
      ${migratedSessionColumn(t,`response_reason`,`NULL`)},
      ${migratedSessionColumn(t,`priority`,`NULL`)},
      ${migratedSessionColumn(t,`next_check`,`NULL`)},
      ${migratedSessionColumn(t,`task_names_json`,`NULL`)},
      ${migratedSessionColumn(t,`wake_source`,`NULL`)},
      ${migratedSessionColumn(t,`wake_reason`,`NULL`)},
      h.occurred_at,
      ${migratedSessionColumn(t,`context_run_id`,`NULL`)},
      ${migratedSessionColumn(t,`context_claimed_at`,`NULL`)},
      h.updated_at
    FROM heartbeat_outcomes AS h
    INNER JOIN session_nodes AS n ON n.session_key = h.session_key;
    DROP TABLE heartbeat_outcomes;
    ALTER TABLE heartbeat_outcomes_new RENAME TO heartbeat_outcomes;
  `)}function rebuildSessionMembers(e){if(!readSqliteTableColumns(e,`session_members`))return;e.exec(`
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
  `)}function rebuildTranscriptIndexState(e){const t=readSqliteTableColumns(e,`session_transcript_index_state`);if(!t)return;e.exec(`
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
      ${migratedSessionColumn(t,`leaf_event_id`,`NULL`)},
      ${migratedSessionColumn(t,`needs_rebuild`,`0`)},
      ${migratedSessionColumn(t,`active_event_count`,`0`)},
      ${migratedSessionColumn(t,`active_message_count`,`0`)},
      i.updated_at
    FROM session_transcript_index_state AS i
    INNER JOIN session_windows AS w ON w.session_id = i.session_id;
    DROP TABLE session_transcript_index_state;
    ALTER TABLE session_transcript_index_state_new RENAME TO session_transcript_index_state;
  `)}function migrateSessionNodesAndWindows(e,t){if(t>=SESSION_NODE_SCHEMA_VERSION||!readSqliteTableColumns(e,`sessions`))return;createSessionNodes(e);backfillSessionNodes(e);migrateSessionWindows(e);renameTranscriptRewriteWatermarks(e);rebuildBoardTabs(e);rebuildHeartbeatOutcomes(e);rebuildSessionMembers(e);rebuildTranscriptIndexState(e);e.exec(`
    DROP TABLE IF EXISTS session_routes;
    DROP TABLE IF EXISTS session_entries;
  `)}export{migrateSessionNodesAndWindows as t};