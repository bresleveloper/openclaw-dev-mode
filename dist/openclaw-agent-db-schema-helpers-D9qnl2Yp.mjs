import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-C7YSvZ9t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { o as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { i as tableHasColumn, r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { t as readExistingAgentSchemaMeta } from "./openclaw-agent-db-metadata-CUXsFwAM.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-B1TtVu8E.mjs";
import { t as extractSqliteTableSchema } from "./sqlite-schema-sql-5Wa9sNMr.mjs";
import { i as collectSqliteSchemaIssues, l as legacySqliteSchemaIssueMessages, n as assertSqliteSchemaTablesPresent, o as getCanonicalSqliteNamedIndexContracts, s as getCanonicalSqliteTableNames, t as assertSqliteSchemaContains, u as throwSqliteSchemaMismatches } from "./sqlite-schema-contract-BFcZzasN.mjs";
import { j as repairCanonicalSqliteIndexes } from "./openclaw-state-db-BFK9cMiV.mjs";
import { n as SESSION_PARTICIPANTS_TABLE } from "./openclaw-agent-db-contract-DzsRD6Fl.mjs";
import { p as hasLegacyMemoryRecallMetadataColumns } from "./memory-schema-CkxujvZk.mjs";
import { i as OPENCLAW_AGENT_SCHEMA_SQL, r as ensureOpenClawAgentBoardSchemaInTransaction, t as AGENT_V14_BOARD_SCHEMA_SQL } from "./openclaw-agent-board-schema-vd3Vff_q.mjs";
import { _ as hasPendingInputConsumptionColumnMigration, p as ensurePendingInputConsumptionColumn, s as AGENT_SCHEMA_COMPATIBILITY } from "./openclaw-agent-db-identity-DLTnzTd_.mjs";
import { i as ensureOpenClawAgentProgressCardSchemaInTransaction, n as AGENT_SCHEMA_WITHOUT_PROGRESS_CARD_SQL, t as AGENT_PROGRESS_CARD_SCHEMA_SQL } from "./openclaw-agent-progress-card-schema-P92mHByB.mjs";
import { r as withoutCanonicalSessionValidationSchema } from "./openclaw-agent-canonical-validation-schema-Di3TgIwr.mjs";
import { n as assertExistingAgentSchemaOwner } from "./openclaw-agent-db-schema-read-B7E3mJp3.mjs";
import { t as normalizeChatType } from "./chat-type-Dbv0JQHI.mjs";
import { i as parseSqliteSessionEntryRecord, n as normalizeConversationPeerId, t as buildConversationRef } from "./conversation-ref-8kIjGCCc.mjs";
import { t as deriveSessionChatTypeFromKey } from "./session-chat-type-shared-CThMOjN8.mjs";
//#region src/state/creator-namespace-migration.ts
/** Doctor and versioned upgrades alone may qualify historical creation seams. */
function migrateLegacySessionCreator(entry) {
	const legacy = entry;
	const actor = entry.createdActor ?? (isRecord(legacy.createdBy) ? {
		...legacy.createdBy,
		type: "human",
		source: "unknown"
	} : void 0);
	if (actor?.type !== "human") return entry;
	const source = actor.source === "profile" || actor.source === "channel" || actor.source === "unknown" ? actor.source : entry.createdVia === "operator" || entry.createdVia === "run" ? "profile" : entry.createdVia === "channel" ? "channel" : "unknown";
	if (actor === entry.createdActor && source === actor.source && !legacy.createdBy) return entry;
	const migrated = {
		...legacy,
		createdActor: {
			...actor,
			source
		}
	};
	delete migrated.createdBy;
	return migrated;
}
//#endregion
//#region src/state/openclaw-agent-db-session-migrations.ts
function dropLegacySessionTranscriptSearchSchema(db) {
	db.exec("DROP TABLE IF EXISTS session_transcript_files;");
	if (db.prepare("PRAGMA table_info(session_transcript_fts)").all().some((row) => row.name === "session_key")) db.exec(`
      DROP TABLE IF EXISTS session_transcript_fts;
      DROP TABLE IF EXISTS session_transcript_index_state;
    `);
}
function dropLegacyRuntimeJournalSchemas(db) {
	const acpParentStreamColumns = readSqliteTableColumns(db, "acp_parent_stream_events");
	if (acpParentStreamColumns && !acpParentStreamColumns.has("session_id")) db.exec(`
      DROP INDEX IF EXISTS idx_agent_acp_parent_stream_events_created;
      DROP TABLE acp_parent_stream_events;
    `);
	if (readSqliteTableColumns(db, "trajectory_runtime_events")?.has("event_id")) db.exec(`
      DROP INDEX IF EXISTS idx_agent_trajectory_runtime_events_session;
      DROP INDEX IF EXISTS idx_agent_trajectory_runtime_events_run;
      DROP TABLE trajectory_runtime_events;
    `);
}
/** Backfill one generation token without copying or rewriting transcript rows. */
function migrateSessionTranscriptGenerations(db, previousVersion) {
	if (previousVersion >= 13) return;
	const insert = db.prepare(`INSERT OR IGNORE INTO transcript_rewrite_watermarks (session_id, generation, updated_at)
     SELECT session_id, lower(hex(randomblob(16))), ?
     FROM transcript_events
     GROUP BY session_id`);
	insert.setReadBigInts(true);
	insert.run(Date.now());
}
function migrateSessionTranscriptActiveProjection(db, previousVersion) {
	if (previousVersion >= 10) return;
	const columns = readSqliteTableColumns(db, "session_transcript_index_state");
	if (columns && !columns.has("active_event_count")) db.exec("ALTER TABLE session_transcript_index_state ADD COLUMN active_event_count INTEGER NOT NULL DEFAULT 0;");
	if (columns && !columns.has("active_message_count")) db.exec("ALTER TABLE session_transcript_index_state ADD COLUMN active_message_count INTEGER NOT NULL DEFAULT 0;");
	db.exec(`
    DELETE FROM session_transcript_active_events;
    UPDATE session_transcript_index_state
    SET needs_rebuild = 1,
        active_event_count = 0,
        active_message_count = 0,
        updated_at = ${Date.now()};
  `);
}
function parseConversationEntry(value) {
	return typeof value === "string" ? safeParseJsonRecord(value) : void 0;
}
function inferMigratedChatType(params) {
	const explicit = normalizeChatType(normalizeOptionalString(params.entry.chatType)) ?? normalizeChatType(normalizeOptionalString(params.persistedChatType));
	if (explicit) return explicit;
	const keyType = deriveSessionChatTypeFromKey(params.sessionKey);
	if (keyType !== "unknown") return keyType;
	const target = params.deliveryTarget?.toLowerCase();
	if (target?.startsWith("channel:") || /^[^:]+:channel:/u.test(target ?? "")) return "channel";
	if (/^(?:[^:]+:)?(?:group|room):/u.test(target ?? "") || normalizeOptionalString(params.entry.groupId)) return "group";
	return "direct";
}
function migratedConversation(entry, persistedChatType, sessionKey) {
	const canonicalDelivery = asOptionalRecord(entry.delivery);
	const delivery = asOptionalRecord(canonicalDelivery?.context) ?? asOptionalRecord(entry.deliveryContext);
	const origin = asOptionalRecord(canonicalDelivery?.origin) ?? asOptionalRecord(entry.origin);
	const deliveryRouteTarget = normalizeOptionalString(delivery?.to);
	const kind = inferMigratedChatType({
		entry,
		persistedChatType,
		sessionKey,
		deliveryTarget: deliveryRouteTarget ?? normalizeOptionalString(origin?.from)
	});
	const deliveryTarget = deliveryRouteTarget ?? (kind === "direct" ? normalizeOptionalString(origin?.from) : void 0);
	if (!deliveryTarget) return;
	const routeOwnsTarget = Boolean(deliveryRouteTarget);
	const channel = (routeOwnsTarget ? normalizeOptionalString(delivery?.channel) ?? normalizeOptionalString(entry.channel) ?? normalizeOptionalString(entry.lastChannel) ?? normalizeOptionalString(origin?.provider) : normalizeOptionalString(origin?.provider))?.toLowerCase();
	const accountId = normalizeAccountId(routeOwnsTarget ? normalizeOptionalString(delivery?.accountId) ?? normalizeOptionalString(entry.lastAccountId) ?? normalizeOptionalString(origin?.accountId) : normalizeOptionalString(origin?.accountId));
	const threadIdRaw = routeOwnsTarget ? delivery?.threadId : origin?.threadId;
	const threadId = typeof threadIdRaw === "number" && Number.isFinite(threadIdRaw) ? String(threadIdRaw) : normalizeOptionalString(threadIdRaw);
	const peerId = channel ? normalizeConversationPeerId(channel, deliveryTarget) : void 0;
	if (!channel || !peerId) return;
	return {
		conversationRef: buildConversationRef({
			channel,
			accountId,
			kind,
			peerId,
			threadId
		}),
		channel,
		accountId,
		kind,
		peerId,
		deliveryTarget,
		threadId,
		nativeChannelId: normalizeOptionalString(origin?.nativeChannelId),
		nativeDirectUserId: normalizeOptionalString(origin?.nativeDirectUserId),
		label: normalizeOptionalString(entry.displayName) ?? normalizeOptionalString(entry.label) ?? normalizeOptionalString(entry.subject) ?? normalizeOptionalString(entry.groupId)
	};
}
/** Backfills canonical external addresses once when conversation routing becomes active. */
function backfillSessionConversations(db) {
	if (!readSqliteTableColumns(db, "session_entries") || !readSqliteTableColumns(db, "sessions") || !readSqliteTableColumns(db, "conversations")) return;
	if (!readSqliteTableColumns(db, "session_conversations")) db.exec(`
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
    `);
	db.exec(`
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
  `);
	const rows = db.prepare(`
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
      `).all();
	const upsertConversation = db.prepare(`
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
  `);
	const deleteMatchingRelated = db.prepare(`
    DELETE FROM session_conversations
    WHERE session_id = ? AND conversation_id = ? AND role = 'related';
  `);
	const demotePrimary = db.prepare(`
    UPDATE session_conversations SET role = 'related', last_seen_at = ?
    WHERE session_id = ? AND role = 'primary';
  `);
	const linkConversation = db.prepare(`
    INSERT INTO session_conversations (
      session_id, conversation_id, role, first_seen_at, last_seen_at
    ) VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(session_id, conversation_id, role) DO UPDATE SET
      last_seen_at = excluded.last_seen_at;
  `);
	const updatePrimary = db.prepare("UPDATE sessions SET primary_conversation_id = ? WHERE session_id = ?");
	for (const statement of [
		upsertConversation,
		deleteMatchingRelated,
		demotePrimary,
		linkConversation,
		updatePrimary
	]) statement.setReadBigInts(true);
	for (const row of rows) {
		const sessionId = normalizeOptionalString(row.session_id);
		const entry = parseConversationEntry(row.entry_json);
		const updatedAt = typeof row.updated_at === "number" ? row.updated_at : Date.now();
		const conversation = entry ? migratedConversation(entry, normalizeOptionalString(row.persisted_chat_type), normalizeOptionalString(row.session_key)) : void 0;
		if (!sessionId || !conversation) continue;
		const role = row.session_scope === "shared-main" && conversation.kind === "direct" ? "participant" : "primary";
		upsertConversation.run(conversation.conversationRef, conversation.channel, conversation.accountId, conversation.kind, conversation.peerId, conversation.deliveryTarget, conversation.threadId ?? null, conversation.nativeChannelId ?? null, conversation.nativeDirectUserId ?? null, conversation.label ?? null, updatedAt, updatedAt);
		if (role === "primary") {
			demotePrimary.run(updatedAt, sessionId);
			deleteMatchingRelated.run(sessionId, conversation.conversationRef);
		}
		linkConversation.run(sessionId, conversation.conversationRef, role, updatedAt, updatedAt);
		if (role === "primary") updatePrimary.run(conversation.conversationRef, sessionId);
	}
}
function readSqliteTableColumns(db, tableName) {
	if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(tableName)) throw new Error(`invalid SQLite table identifier: ${tableName}`);
	if (!db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName)) return null;
	const rows = db.prepare(`PRAGMA table_info(${tableName})`).all();
	return new Set(rows.flatMap((row) => typeof row.name === "string" ? [row.name] : []));
}
/** Installs same-version session projections on first updated-binary open. */
function ensureSessionAdditiveColumns(db) {
	ensurePendingInputConsumptionColumn(db);
	if (hasPendingSessionTranscriptContextEligibilityColumn(db)) db.exec("ALTER TABLE session_transcript_active_events ADD COLUMN context_eligible INTEGER;");
	const columns = readSqliteTableColumns(db, "session_nodes");
	if (columns && !columns.has("project_id")) db.exec("ALTER TABLE session_nodes ADD COLUMN project_id TEXT;");
	const conversationColumns = readSqliteTableColumns(db, "session_conversations");
	if (conversationColumns && !conversationColumns.has("route_context_json")) db.exec("ALTER TABLE session_conversations ADD COLUMN route_context_json TEXT");
	if (conversationColumns) db.exec(`
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
    `);
}
function hasPendingSessionConversationRouteContextColumn(db) {
	const columns = readSqliteTableColumns(db, "session_conversations");
	return Boolean(columns && !columns.has("route_context_json"));
}
function hasPendingSessionProjectColumn(db) {
	const columns = readSqliteTableColumns(db, "session_nodes");
	return Boolean(columns && !columns.has("project_id"));
}
function hasPendingSessionTranscriptContextEligibilityColumn(db) {
	const columns = readSqliteTableColumns(db, "session_transcript_active_events");
	return Boolean(columns && !columns.has("context_eligible"));
}
/** Adds the v11 exact delivery target before the conversation backfill writes canonical rows. */
function migrateConversationDeliveryTargetColumn(db) {
	const columns = readSqliteTableColumns(db, "conversations");
	if (!columns || columns.has("delivery_target")) return;
	db.exec("ALTER TABLE conversations ADD COLUMN delivery_target TEXT NOT NULL DEFAULT '';");
}
/** Adds the validity projection and settles only rows left pending by older writers. */
function ensureSessionEntryValidityProjection(db) {
	const columns = readSqliteTableColumns(db, "session_nodes");
	if (!columns) return;
	if (!columns.has("entry_valid")) db.exec("ALTER TABLE session_nodes ADD COLUMN entry_valid INTEGER NOT NULL DEFAULT 0 CHECK (entry_valid IN (-1, 0, 1))");
	db.exec(`
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
  `);
	const selectPending = db.prepare("SELECT current_session_id, entry_json, session_key, updated_at FROM session_nodes WHERE entry_valid = 0 ORDER BY session_key LIMIT 256");
	const update = db.prepare("UPDATE session_nodes SET entry_valid = ? WHERE session_key = ?");
	update.setReadBigInts(true);
	while (true) {
		const rows = selectPending.all();
		if (rows.length === 0) break;
		for (const row of rows) update.run(parseSqliteSessionEntryRecord(row) ? 1 : -1, row.session_key);
	}
}
function migrateSessionEntryStatusProjection(db, readStatus) {
	const columns = readSqliteTableColumns(db, "session_entries");
	if (!columns) return;
	if (!columns.has("status")) db.exec("ALTER TABLE session_entries ADD COLUMN status TEXT CHECK (status IS NULL OR status IN ('running', 'done', 'failed', 'killed', 'timeout'));");
	const rows = db.prepare("SELECT session_key, entry_json FROM session_entries").all();
	const update = db.prepare("UPDATE session_entries SET status = ? WHERE session_key = ?");
	update.setReadBigInts(true);
	for (const row of rows) if (typeof row.session_key === "string") update.run(readStatus(row.entry_json), row.session_key);
}
function migrateSessionCreatorNamespaces(db, previousVersion) {
	if (previousVersion >= 19 || !tableExists(db, "session_nodes")) return;
	const update = db.prepare("UPDATE session_nodes SET entry_json = ?, created_actor_type = ?, created_actor_id = ? WHERE session_key = ?");
	update.setReadBigInts(true);
	const rows = db.prepare(`SELECT session_key, entry_json FROM session_nodes
    WHERE json_valid(entry_json) AND (json_extract(entry_json, '$.createdActor.type') = 'human'
      OR (json_type(entry_json, '$.createdActor') IS NULL AND json_type(entry_json, '$.createdBy') = 'object'))`);
	for (const row of rows.all()) {
		const entry = migrateLegacySessionCreator(JSON.parse(row.entry_json));
		update.run(JSON.stringify(entry), entry.createdActor?.type ?? null, entry.createdActor?.id ?? null, row.session_key);
	}
}
//#endregion
//#region src/state/openclaw-agent-session-participants-schema.ts
const ensuredDatabases = /* @__PURE__ */ new WeakSet();
function sessionParticipantsSchemaSql() {
	return extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, SESSION_PARTICIPANTS_TABLE, {
		endMarker: "CREATE TABLE IF NOT EXISTS session_key_contract (",
		includeEndMarker: false,
		errorMessage: "OpenClaw session participant schema markers are missing."
	});
}
/** Lazily installs the additive participant table on the first admitted prompt. */
function ensureSessionParticipantsSchema(database) {
	if (ensuredDatabases.has(database)) return false;
	const ensure = () => {
		database.exec(sessionParticipantsSchemaSql());
	};
	if (database.isTransaction) {
		ensure();
		return true;
	}
	runSqliteImmediateTransactionSync(database, ensure);
	ensuredDatabases.add(database);
	return false;
}
/** Cache a first-use ensure only after its owning transaction commits. */
function confirmSessionParticipantsSchemaEnsured(database) {
	ensuredDatabases.add(database);
}
//#endregion
//#region src/state/openclaw-agent-participants-migration.ts
const LEGACY_PARTICIPANTS_SCHEMA = `CREATE TABLE IF NOT EXISTS session_participants (
  session_key TEXT NOT NULL,
  actor_type TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  actor_source TEXT,
  contribution_count INTEGER,
  first_prompted_at INTEGER NOT NULL,
  last_prompted_at INTEGER NOT NULL,
  PRIMARY KEY (session_key, actor_type, actor_id),
  FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
) STRICT;`;
const MIGRATION_TABLE = "session_participants_identity_migration";
const LEGACY_PARTICIPANT_OPTIONAL_COLUMNS = ["session_participants.actor_source", "session_participants.contribution_count"];
/** Historical structural/media validation must not require a future identity key. */
function withLegacySessionParticipantsSchema(sql) {
	return withoutCanonicalSessionValidationSchema(sql).replace(sessionParticipantsSchemaSql().trim(), LEGACY_PARTICIPANTS_SCHEMA);
}
function migrateSessionParticipantsSchema(database, pathname) {
	if (!tableExists(database, "session_participants")) return;
	assertSqliteSchemaContains(database, pathname, LEGACY_PARTICIPANTS_SCHEMA, { allowedMissingColumns: LEGACY_PARTICIPANT_OPTIONAL_COLUMNS });
	if (tableExists(database, MIGRATION_TABLE)) throw new Error(`Participant migration table already exists: ${MIGRATION_TABLE}`);
	if (database.prepare(`SELECT name FROM sqlite_schema
    WHERE (type IN ('trigger', 'index') AND tbl_name = 'session_participants' AND sql IS NOT NULL)
       OR (type IN ('view', 'trigger') AND sql LIKE '%session_participants%')`).all().length > 0) throw new Error("Participant migration cannot rebuild unknown indexes, views, or triggers.");
	for (const table of database.prepare("SELECT name FROM sqlite_schema WHERE type = 'table'").all()) if (database.prepare(`PRAGMA foreign_key_list("${String(table.name).replaceAll("\"", "\"\"")}")`).all().some((key) => key.table === "session_participants")) throw new Error("Participant migration cannot rebuild a table referenced by an unknown foreign key.");
	const source = tableHasColumn(database, "session_participants", "actor_source") ? "actor_source" : "NULL";
	const count = tableHasColumn(database, "session_participants", "contribution_count") ? "coalesce(contribution_count, 1)" : "1";
	const knownAgent = `actor_type = 'agent' AND ${source} = 'agent' AND actor_id <> ''`;
	const knownObservation = `(${knownAgent}) OR (actor_type = 'human' AND ${source} = 'channel')`;
	database.exec(`
    ${sessionParticipantsSchemaSql().replace("IF NOT EXISTS session_participants", MIGRATION_TABLE)}
    INSERT INTO ${MIGRATION_TABLE}
      (session_key, identity_namespace, actor_id, contribution_count, first_prompted_at, last_prompted_at)
    SELECT session_key,
      CASE
        WHEN actor_type = 'human' AND ${source} = 'profile' AND actor_id <> '' THEN json_object('type', 'profile')
        WHEN ${knownAgent} THEN json_object('type', 'agent')
        ELSE json_object('type', 'legacy', 'actorType', actor_type, 'source', ${source})
      END,
      actor_id, ${count},
      CASE WHEN ${knownObservation} THEN first_prompted_at ELSE NULL END,
      CASE WHEN ${knownObservation} THEN last_prompted_at ELSE NULL END
    FROM session_participants;
    DROP TABLE session_participants;
    ALTER TABLE ${MIGRATION_TABLE} RENAME TO session_participants;
  `);
}
//#endregion
//#region src/state/openclaw-agent-transcript-fts-schema.ts
const DEPLOYED_FTS_ROWS_SCHEMA = `CREATE TABLE IF NOT EXISTS session_transcript_fts_rows (
  session_id TEXT NOT NULL,
  fts_rowid INTEGER NOT NULL PRIMARY KEY
) STRICT;

CREATE INDEX IF NOT EXISTS idx_agent_transcript_fts_rows_session
  ON session_transcript_fts_rows(session_id);
`;
const RETIRED_FTS_ROWS = "session_transcript_fts_rows_legacy22";
/** Describe the deployed schema-22 predecessor, independently of the new row-map layout. */
function withDeployedTranscriptFtsRowSchema(legacyStorageSchema) {
	const indexState = extractSqliteTableSchema(legacyStorageSchema, "session_transcript_index_state");
	return legacyStorageSchema.replace(indexState, indexState.replace("  updated_at INTEGER NOT NULL,", "  fts_row_count INTEGER,\n  updated_at INTEGER NOT NULL,")).replace("CREATE VIRTUAL TABLE IF NOT EXISTS session_transcript_fts USING fts5(", `${DEPLOYED_FTS_ROWS_SCHEMA}\nCREATE VIRTUAL TABLE IF NOT EXISTS session_transcript_fts USING fts5(`);
}
/** Preserve the FTS content; replace only its old, possibly incomplete ownership projection. */
function migrateDeployedTranscriptFtsRowsInTransaction(db, schemaSql) {
	if (!db.isTransaction || db.prepare("PRAGMA foreign_keys").get()?.foreign_keys !== 0) throw new Error("Transcript FTS migration requires an admitted transaction with foreign keys off");
	assertSqliteSchemaContains(db, "deployed transcript FTS ownership", DEPLOYED_FTS_ROWS_SCHEMA);
	const columns = db.prepare("PRAGMA table_xinfo(session_transcript_fts_rows)").all();
	if (columns.length !== 2 || columns.some((column) => column.name !== "session_id" && column.name !== "fts_rowid")) throw new Error("Transcript FTS migration cannot discard unknown row-map columns");
	const dependents = db.prepare(`SELECT name FROM sqlite_schema
    WHERE (tbl_name = 'session_transcript_fts_rows' AND sql IS NOT NULL
      AND type IN ('index', 'trigger') AND name != 'idx_agent_transcript_fts_rows_session')
      OR (type IN ('view', 'trigger') AND sql LIKE '%session_transcript_fts_rows%')`).all();
	const children = db.prepare(`SELECT schema.name FROM sqlite_schema AS schema
    JOIN pragma_foreign_key_list(schema.name) AS fk
    WHERE schema.type = 'table' AND fk."table" = 'session_transcript_fts_rows'`).all();
	if (dependents.length || children.length) throw new Error("Transcript FTS migration cannot discard unknown row-map dependencies");
	if (db.prepare("SELECT 1 FROM sqlite_schema WHERE name = ?").get(RETIRED_FTS_ROWS)) throw new Error("Transcript FTS migration table already exists");
	db.exec(`ALTER TABLE session_transcript_fts_rows RENAME TO ${RETIRED_FTS_ROWS}`);
	db.exec(extractSqliteTableSchema(schemaSql, "session_transcript_fts_rows", {
		endMarker: "INSERT OR IGNORE INTO memory_index_state",
		includeEndMarker: false
	}));
	db.exec(`INSERT INTO session_transcript_fts_rows (id, session_id, message_id)
    SELECT rowid, session_id, message_id FROM session_transcript_fts`);
	db.exec(`UPDATE session_transcript_index_state AS state SET needs_rebuild = 1
    WHERE needs_rebuild = 0 AND (
      fts_row_count IS NULL
      OR fts_row_count != (SELECT count(*) FROM ${RETIRED_FTS_ROWS} AS old WHERE old.session_id = state.session_id)
      OR EXISTS (
        SELECT 1 FROM ${RETIRED_FTS_ROWS} AS old
        WHERE old.session_id = state.session_id AND NOT EXISTS (
          SELECT 1 FROM session_transcript_fts_rows AS current
          WHERE current.id = old.fts_rowid AND current.session_id = old.session_id))
      OR EXISTS (
        SELECT 1 FROM session_transcript_fts_rows AS current
        WHERE current.session_id = state.session_id AND NOT EXISTS (
          SELECT 1 FROM ${RETIRED_FTS_ROWS} AS old
          WHERE old.fts_rowid = current.id AND old.session_id = current.session_id))
    );
    DROP TABLE ${RETIRED_FTS_ROWS};
    ALTER TABLE session_transcript_index_state DROP COLUMN fts_row_count;`);
}
//#endregion
//#region src/state/openclaw-agent-storage-schema.ts
const LEGACY_STORAGE_TABLES = {
	transcript_events: `CREATE TABLE IF NOT EXISTS transcript_events (
  session_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  event_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (session_id, seq),
  FOREIGN KEY (session_id) REFERENCES "session_windows"(session_id) ON DELETE CASCADE
) STRICT;`,
	memory_index_chunks: `CREATE TABLE IF NOT EXISTS memory_index_chunks (
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
) STRICT;`,
	memory_embedding_cache: `CREATE TABLE IF NOT EXISTS memory_embedding_cache (
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  provider_key TEXT NOT NULL,
  hash TEXT NOT NULL,
  embedding TEXT NOT NULL,
  dims INTEGER,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (provider, model, provider_key, hash)
) STRICT;`
};
/** Preserve historical storage contracts before the admitted schema-23 cutover. */
function withLegacyAgentStorageSchema(schema, version = 21) {
	let historicalSchema = schema;
	for (const [table, legacySchema] of Object.entries(LEGACY_STORAGE_TABLES)) historicalSchema = historicalSchema.replace(extractSqliteTableSchema(historicalSchema, table), legacySchema);
	if (historicalSchema.includes("CREATE TABLE IF NOT EXISTS session_transcript_fts_rows (")) historicalSchema = historicalSchema.replace(extractSqliteTableSchema(historicalSchema, "session_transcript_fts_rows", {
		endMarker: "INSERT OR IGNORE INTO memory_index_state",
		includeEndMarker: false
	}), "");
	return version === 22 ? withDeployedTranscriptFtsRowSchema(historicalSchema) : historicalSchema;
}
//#endregion
//#region src/state/openclaw-agent-session-sharing-schema.ts
const SUGGESTIONS_SCHEMA_START = "CREATE TABLE IF NOT EXISTS session_suggestions (";
const sessionSharingSchema = extractSqliteTableSchema(AGENT_SCHEMA_WITHOUT_PROGRESS_CARD_SQL, "session_members", {
	endMarker: "CREATE TABLE IF NOT EXISTS heartbeat_outcomes (",
	includeEndMarker: false,
	errorMessage: "OpenClaw agent session-sharing schema markers are missing."
});
const sessionSuggestionsStart = sessionSharingSchema.indexOf(SUGGESTIONS_SCHEMA_START);
if (sessionSuggestionsStart === -1) throw new Error("OpenClaw agent session-suggestions schema marker is missing.");
const AGENT_V14_SESSION_SHARING_SCHEMA_SQL = sessionSharingSchema.slice(0, sessionSuggestionsStart);
const AGENT_V14_ADDITIVE_SCHEMA_SQL = sessionSharingSchema.slice(sessionSuggestionsStart);
const AGENT_V14_CORE_SCHEMA_SQL = withLegacySessionParticipantsSchema(withLegacyAgentStorageSchema(AGENT_SCHEMA_WITHOUT_PROGRESS_CARD_SQL.replace(sessionSharingSchema, "")));
//#endregion
//#region src/state/openclaw-agent-db-schema-helpers.ts
/** Compare historical migration targets against only the representation they support. */
function getOpenClawAgentMigrationSchema(targetVersion) {
	const targetSchemaSql = targetVersion < 23 ? withLegacyAgentStorageSchema(OPENCLAW_AGENT_SCHEMA_SQL, targetVersion) : OPENCLAW_AGENT_SCHEMA_SQL;
	return targetVersion < 18 ? withLegacySessionParticipantsSchema(targetSchemaSql) : targetVersion < 21 ? withoutCanonicalSessionValidationSchema(targetSchemaSql) : targetSchemaSql;
}
function migratedSessionColumn(columns, columnName, fallback) {
	return columns.has(columnName) ? columnName : fallback;
}
function hasRetiredAgentStateLeaseSchema(database) {
	return Boolean(database.prepare("SELECT 1 FROM main.sqlite_schema WHERE name = 'state_leases'").get());
}
function assertOpenClawAgentSchemaContains(database, pathname, schemaSql, participantSchema = "current", allowStartupIndexRepair = false) {
	const compatibility = {
		...AGENT_SCHEMA_COMPATIBILITY,
		allowedMissingTables: [...AGENT_SCHEMA_COMPATIBILITY.allowedMissingTables, ...participantSchema === "legacy" ? ["session_transcript_cold_archives"] : []],
		allowedMissingColumns: [...AGENT_SCHEMA_COMPATIBILITY.allowedMissingColumns, ...participantSchema === "legacy" ? LEGACY_PARTICIPANT_OPTIONAL_COLUMNS : []]
	};
	if (!allowStartupIndexRepair) {
		assertSqliteSchemaContains(database, pathname, schemaSql, compatibility);
		return;
	}
	const repairableIndexes = new Set(getCanonicalSqliteNamedIndexContracts(schemaSql).map((index) => index.name));
	const issues = collectSqliteSchemaIssues(database, schemaSql, compatibility);
	if (issues.some((issue) => issue.code !== "missing-or-drifted-index" || !repairableIndexes.has(issue.objectName))) throwSqliteSchemaMismatches(pathname, legacySqliteSchemaIssueMessages(issues));
}
function assertOpenClawAgentCurrentRuntimeSchema(database, options) {
	const agentId = normalizeAgentId(options.agentId);
	const metadata = readExistingAgentSchemaMeta(database);
	if (!metadata) throw new Error(`OpenClaw agent database ${options.pathname} has no schema ownership metadata.`);
	assertExistingAgentSchemaOwner(metadata, agentId, options.pathname);
	if (metadata.schemaVersion !== 23) throw new Error(`OpenClaw agent database ${options.pathname} metadata schema version ${metadata.schemaVersion ?? "invalid"} does not match 23; run openclaw doctor --fix before using it.`);
	if (hasRetiredAgentStateLeaseSchema(database)) throw new Error(`OpenClaw agent database ${options.pathname} retains retired state_leases storage; run openclaw doctor --fix before using it.`);
	assertOpenClawAgentSchemaContains(database, options.pathname, OPENCLAW_AGENT_SCHEMA_SQL);
}
function hasAnyCanonicalTable(database, schemaSql) {
	const tableNames = getCanonicalSqliteTableNames(schemaSql);
	const placeholders = tableNames.map(() => "?").join(", ");
	return Boolean(database.prepare(`SELECT 1 FROM main.sqlite_schema
         WHERE type = 'table' AND name IN (${placeholders})
         LIMIT 1`).get(...tableNames));
}
function repairAndAssertAgentSchemaGroup(database, pathname, schemaSql) {
	repairCanonicalSqliteIndexes(database, pathname, schemaSql, { verifyPhysicalIntegrity: false });
	assertOpenClawAgentSchemaContains(database, pathname, schemaSql, "legacy");
}
const SESSION_KEY_CONTRACT_SCHEMA_START = "CREATE TABLE IF NOT EXISTS session_key_contract (";
const SESSION_KEY_CONTRACT_SCHEMA_END = "CREATE TABLE IF NOT EXISTS session_windows (";
/** Ensure the additive session-key contract table inside the caller's transaction. */
function ensureSessionKeyContractSchemaInTransaction(db) {
	const start = OPENCLAW_AGENT_SCHEMA_SQL.indexOf(SESSION_KEY_CONTRACT_SCHEMA_START);
	const end = OPENCLAW_AGENT_SCHEMA_SQL.indexOf(SESSION_KEY_CONTRACT_SCHEMA_END, start);
	if (start === -1 || end === -1) throw new Error("OpenClaw agent session-key contract schema markers are missing.");
	db.exec(OPENCLAW_AGENT_SCHEMA_SQL.slice(start, end));
}
function repairAndAssertOpenClawAgentV14SchemaForMigration(database, options) {
	const userVersion = readSqliteUserVersion(database);
	if (userVersion !== 14) throw new Error(`OpenClaw agent database ${options.pathname} uses schema version ${userVersion}; expected 14 before migrating it.`);
	const agentId = normalizeAgentId(options.agentId);
	const metadata = readExistingAgentSchemaMeta(database);
	if (!metadata) throw new Error(`OpenClaw agent database ${options.pathname} has no schema ownership metadata.`);
	assertExistingAgentSchemaOwner(metadata, agentId, options.pathname);
	if (metadata.schemaVersion !== 14) throw new Error(`OpenClaw agent database ${options.pathname} metadata schema version ${metadata.schemaVersion ?? "invalid"} does not match 14; repair the ownership metadata before migrating it.`);
	ensureSessionAdditiveColumns(database);
	ensureSessionEntryValidityProjection(database);
	ensureSessionKeyContractSchemaInTransaction(database);
	repairAndAssertAgentSchemaGroup(database, options.pathname, AGENT_V14_CORE_SCHEMA_SQL);
	if (hasAnyCanonicalTable(database, AGENT_V14_SESSION_SHARING_SCHEMA_SQL)) repairAndAssertAgentSchemaGroup(database, options.pathname, AGENT_V14_SESSION_SHARING_SCHEMA_SQL);
	if (hasAnyCanonicalTable(database, AGENT_V14_ADDITIVE_SCHEMA_SQL)) repairAndAssertAgentSchemaGroup(database, options.pathname, AGENT_V14_ADDITIVE_SCHEMA_SQL);
	if (hasAnyCanonicalTable(database, AGENT_V14_BOARD_SCHEMA_SQL)) {
		assertSqliteSchemaTablesPresent(database, options.pathname, AGENT_V14_BOARD_SCHEMA_SQL);
		ensureOpenClawAgentBoardSchemaInTransaction(database);
		repairAndAssertAgentSchemaGroup(database, options.pathname, AGENT_V14_BOARD_SCHEMA_SQL);
	}
	if (hasAnyCanonicalTable(database, AGENT_PROGRESS_CARD_SCHEMA_SQL)) {
		assertSqliteSchemaTablesPresent(database, options.pathname, AGENT_PROGRESS_CARD_SCHEMA_SQL);
		ensureOpenClawAgentProgressCardSchemaInTransaction(database);
		repairAndAssertAgentSchemaGroup(database, options.pathname, AGENT_PROGRESS_CARD_SCHEMA_SQL);
	}
}
const RETIRED_AGENT_STATE_LEASE_SCHEMA_SQL = `
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
`;
function migrateRetiredAgentStateLeaseSchema(db, pathname, targetVersion) {
	if (targetVersion < 17 || !hasRetiredAgentStateLeaseSchema(db)) return;
	assertSqliteSchemaContains(db, pathname, RETIRED_AGENT_STATE_LEASE_SCHEMA_SQL);
	db.exec("DROP TABLE state_leases;");
}
function assertAgentSchemaVersion(db, options, schemaSql) {
	const metadata = readExistingAgentSchemaMeta(db);
	assertExistingAgentSchemaOwner(metadata, options.agentId, options.pathname);
	if (readSqliteUserVersion(db) !== options.version || metadata?.schemaVersion !== options.version) throw new Error(`OpenClaw agent database ${options.pathname} did not converge on schema version ${options.version}.`);
	assertOpenClawAgentSchemaContains(db, options.pathname, schemaSql, options.version < 18 ? "legacy" : "current");
}
function hasLegacyMemoryChunkProvenanceTrigger(db) {
	return Boolean(db.prepare("SELECT 1 FROM sqlite_schema WHERE type = 'trigger' AND name = 'memory_index_chunk_provenance_after_insert'").get());
}
function hasPendingMemoryChunkMetadataMigration(db) {
	return hasLegacyMemoryRecallMetadataColumns(db) || hasLegacyMemoryChunkProvenanceTrigger(db);
}
function hasPendingSessionKeyContractSchemaMigration(db) {
	const sessionNodeColumns = readSqliteTableColumns(db, "session_nodes");
	if (!sessionNodeColumns) return false;
	const hasContractTable = Boolean(db.prepare("SELECT 1 FROM sqlite_schema WHERE type = 'table' AND name = 'session_key_contract'").get());
	return !sessionNodeColumns.has("entry_valid") || !hasContractTable;
}
function hasPendingCurrentVersionAgentDatabaseMigration(database) {
	return hasPendingMemoryChunkMetadataMigration(database) || hasPendingSessionKeyContractSchemaMigration(database) || hasRetiredAgentStateLeaseSchema(database) || hasPendingSessionConversationRouteContextColumn(database) || hasPendingSessionTranscriptContextEligibilityColumn(database) || hasPendingInputConsumptionColumnMigration(database) || hasPendingSessionProjectColumn(database);
}
//#endregion
export { migrateSessionCreatorNamespaces as C, readSqliteTableColumns as D, migrateSessionTranscriptGenerations as E, migrateLegacySessionCreator as O, migrateConversationDeliveryTargetColumn as S, migrateSessionTranscriptActiveProjection as T, backfillSessionConversations as _, getOpenClawAgentMigrationSchema as a, ensureSessionAdditiveColumns as b, migrateRetiredAgentStateLeaseSchema as c, withLegacyAgentStorageSchema as d, migrateDeployedTranscriptFtsRowsInTransaction as f, ensureSessionParticipantsSchema as g, confirmSessionParticipantsSchemaEnsured as h, ensureSessionKeyContractSchemaInTransaction as i, migratedSessionColumn as l, withLegacySessionParticipantsSchema as m, assertOpenClawAgentCurrentRuntimeSchema as n, hasPendingCurrentVersionAgentDatabaseMigration as o, migrateSessionParticipantsSchema as p, assertOpenClawAgentSchemaContains as r, hasPendingMemoryChunkMetadataMigration as s, assertAgentSchemaVersion as t, repairAndAssertOpenClawAgentV14SchemaForMigration as u, dropLegacyRuntimeJournalSchemas as v, migrateSessionEntryStatusProjection as w, ensureSessionEntryValidityProjection as x, dropLegacySessionTranscriptSearchSchema as y };
