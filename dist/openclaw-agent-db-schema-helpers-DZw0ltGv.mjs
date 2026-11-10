import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { t as VERSION } from "./version-jg_14gWz.mjs";
import { Q as hasPendingAgentStartupColumns, Z as STARTUP_ADDITIVE_AGENT_COLUMN_DEFINITIONS, nt as extractSqliteTableSchema } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { t as OPENCLAW_AGENT_SCHEMA_SQL } from "./openclaw-agent-schema-BKBD8edk.mjs";
import { h as captureSqliteSchemaFacts, i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { a as throwSqliteSchemaMismatches, i as legacySqliteSchemaIssueMessages, t as SqliteSchemaMismatchError } from "./sqlite-schema-issues-BnRd2KGO.mjs";
import { a as tableExists, n as ensureColumn, o as tableHasColumn } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { n as publishAgentSchemaMetadata, r as readExistingAgentSchemaMeta } from "./openclaw-agent-db-metadata-90thy9YD.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-Q7gNRxhK.mjs";
import { c as getCanonicalSqliteNamedIndexContracts, l as getCanonicalSqliteTableNames, n as assertSqliteSchemaContains, o as collectSqliteSchemaIssues, r as assertSqliteSchemaTablesPresent } from "./sqlite-schema-contract-C7_zBR7q.mjs";
import "./session-key-CSDERtm3.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import { t as createSqliteSchemaEnsurer } from "./sqlite-schema-ensure-CwIgvH1h.mjs";
import { _ as repairCanonicalSqliteIndexes } from "./openclaw-state-db-BtDOU_3j.mjs";
import { r as SESSION_PARTICIPANTS_TABLE } from "./openclaw-agent-db-contract-BcoeqAm4.mjs";
import { T as hasLegacyMemoryRecallMetadataColumns } from "./memory-schema-DY2eOY6N.mjs";
import { A as AGENT_SCHEMA_COMPATIBILITY, E as withoutCanonicalSessionValidationSchema } from "./openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import { r as ensureOpenClawAgentBoardSchemaInTransaction, t as AGENT_V14_BOARD_SCHEMA_SQL } from "./openclaw-agent-board-schema-CskkNSvY.mjs";
import { i as ensureOpenClawAgentProgressCardSchemaInTransaction, n as AGENT_SCHEMA_WITHOUT_PROGRESS_CARD_SQL, t as AGENT_PROGRESS_CARD_SCHEMA_SQL } from "./openclaw-agent-progress-card-schema-CCXTSC64.mjs";
import { n as assertCurrentAgentSchemaMetadata, r as assertExistingAgentSchemaOwner } from "./openclaw-agent-db-schema-read-CX4aGKRI.mjs";
import { t as normalizeChatType } from "./chat-type-qwvaeaJu.mjs";
import { r as parseSqliteSessionEntryRecord } from "./session-entry-json-iiByG7LE.mjs";
import { n as normalizeConversationPeerId, t as buildConversationRef } from "./conversation-ref-BU3wU9j-.mjs";
import { t as deriveSessionChatTypeFromKey } from "./session-chat-type-shared-B18DLTwm.mjs";
//#region src/state/openclaw-agent-canonical-validation-migration.ts
const LEGACY_ENTRY_VALIDITY_TRIGGERS_SQL = `
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
`;
const LEGACY_CANONICAL_PENDING_TRIGGERS_SQL = `
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
`;
/** Legacy shape repair precedes the historical schema assertion during offline migration. */
function ensureLegacySessionEntryValidityTriggers(db) {
	db.exec(LEGACY_ENTRY_VALIDITY_TRIGGERS_SQL);
}
/** Historical preflight compares the trigger contract those releases actually wrote. */
function withLegacyCanonicalSessionValidationTriggers(schema) {
	return schema.replace("CREATE TABLE IF NOT EXISTS session_windows (", `${LEGACY_ENTRY_VALIDITY_TRIGGERS_SQL}\nCREATE TABLE IF NOT EXISTS session_windows (`).replace("CREATE TABLE IF NOT EXISTS conversations (", `${LEGACY_CANONICAL_PENDING_TRIGGERS_SQL}\nCREATE TABLE IF NOT EXISTS conversations (`);
}
const LEGACY_CANONICAL_VALIDATION_TRIGGER_NAMES = Object.freeze([...`${LEGACY_ENTRY_VALIDITY_TRIGGERS_SQL}\n${LEGACY_CANONICAL_PENDING_TRIGGERS_SQL}`.matchAll(/CREATE TRIGGER IF NOT EXISTS (\w+)/gu)].map((match) => match[1]));
/** The offline schema owner retires raw-writer tracking before publishing schema 25. */
function migrateCanonicalSessionWriterValidation(db) {
	for (const name of LEGACY_CANONICAL_VALIDATION_TRIGGER_NAMES) db.exec(`DROP TRIGGER IF EXISTS ${name}`);
	ensureColumn(db, "session_key_contract", "canonical_ready TEXT");
	db.exec(`
    INSERT INTO session_canonical_validation_pending (session_key)
    SELECT session_key FROM session_nodes WHERE true
    ON CONFLICT (session_key) DO NOTHING;
    UPDATE session_key_contract SET canonical_ready = NULL WHERE id = 1;
  `);
}
function seedCanonicalSessionValidationPending(db) {
	db.exec(`
    INSERT INTO session_canonical_validation_pending (session_key)
    SELECT node.session_key FROM session_nodes AS node
    WHERE NOT EXISTS (
      SELECT 1 FROM session_canonical_validation_pending AS pending
      WHERE pending.session_key = node.session_key
    );
  `);
}
//#endregion
//#region src/state/openclaw-agent-db-metadata-write.ts
function persistAgentSchemaMetadata(db, agentId, targetVersion) {
	const now = Date.now();
	const metadata = {
		role: "agent",
		schema_version: targetVersion,
		agent_id: agentId,
		app_version: VERSION
	};
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("schema_meta").values({
		meta_key: "primary",
		...metadata,
		created_at: now,
		updated_at: now
	}).onConflict((conflict) => conflict.column("meta_key").doUpdateSet({
		...metadata,
		updated_at: now
	}).where((eb) => eb.or([
		eb("schema_meta.schema_version", "!=", targetVersion),
		eb("schema_meta.app_version", "is", null),
		eb("schema_meta.app_version", "!=", VERSION),
		eb("schema_meta.agent_id", "!=", agentId)
	]))));
	publishAgentSchemaMetadata(db, {
		role: "agent",
		schemaVersion: targetVersion,
		agentId
	});
}
//#endregion
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
function assertSupportedAgentMigrationSchemas(db, pathname, userVersion) {
	if (userVersion < 8 && [
		"sessions",
		"session_entries",
		"transcript_events"
	].some((table) => tableExists(db, table)) || tableExists(db, "session_transcript_files") || readSqliteTableColumns(db, "session_transcript_fts")?.has("session_key")) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${pathname} contains an unreleased session schema (version ${userVersion}). Preserve a complete copy of your state directory and configuration, including shared agent registration. Run "openclaw doctor --fix" with OpenClaw 2026.9.7 against that copy. If a store is held, follow Doctor's explicit agent-restoration instructions, then rerun Doctor before retrying the upgrade.`);
	const acpParentStreamColumns = readSqliteTableColumns(db, "acp_parent_stream_events");
	const trajectoryColumns = readSqliteTableColumns(db, "trajectory_runtime_events");
	const memorySourceColumns = readSqliteTableColumns(db, "memory_index_sources");
	if (acpParentStreamColumns && !acpParentStreamColumns.has("session_id") || trajectoryColumns?.has("event_id") || memorySourceColumns?.has("source_kind")) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${pathname} has an unsupported legacy schema. Upgrades from pre-July-2026 state are no longer migrated; restore a backup produced by a July 2026 or newer release before retrying.`);
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
function inferMigratedChatType(params) {
	const explicit = normalizeChatType(normalizeOptionalString(params.entry.chatType)) ?? normalizeChatType(params.persistedChatType);
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
	const originTarget = normalizeOptionalString(origin?.from);
	const kind = inferMigratedChatType({
		entry,
		persistedChatType,
		sessionKey,
		deliveryTarget: deliveryRouteTarget ?? originTarget
	});
	const deliveryTarget = deliveryRouteTarget ?? (kind === "direct" ? originTarget : void 0);
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
		const entry = typeof row.entry_json === "string" ? safeParseJsonRecord(row.entry_json) : void 0;
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
	if (!tableExists(db, tableName)) return null;
	const rows = db.prepare(`PRAGMA table_info(${tableName})`).all();
	return new Set(rows.flatMap((row) => typeof row.name === "string" ? [row.name] : []));
}
/** Installs same-version session projections on first updated-binary open. */
function ensureSessionAdditiveColumns(db) {
	for (const { tableName, columnName, dataType } of STARTUP_ADDITIVE_AGENT_COLUMN_DEFINITIONS) ensureColumn(db, tableName, `${columnName} ${dataType}`);
	if (tableExists(db, "session_conversations") && !getAdmittedSqliteSchemaFacts(db)?.triggers.has("session_conversations_route_context_invalidate_after_update")) db.exec(`
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
/** Adds the v11 exact delivery target before the conversation backfill writes canonical rows. */
function migrateConversationDeliveryTargetColumn(db) {
	ensureColumn(db, "conversations", "delivery_target TEXT NOT NULL DEFAULT ''");
}
/** Adds the validity projection and settles only rows left pending by older writers. */
function ensureSessionEntryValidityProjection(db) {
	const columns = readSqliteTableColumns(db, "session_nodes");
	if (!columns) return;
	if (!columns.has("entry_valid")) db.exec("ALTER TABLE session_nodes ADD COLUMN entry_valid INTEGER NOT NULL DEFAULT 0 CHECK (entry_valid IN (-1, 0, 1))");
	const selectPending = db.prepare("SELECT current_session_id, entry_json, session_key, updated_at FROM session_nodes WHERE entry_valid = 0 ORDER BY session_key LIMIT 256");
	const update = db.prepare("UPDATE session_nodes SET entry_valid = ? WHERE session_key = ?");
	update.setReadBigInts(true);
	while (true) {
		const rows = selectPending.all();
		if (rows.length === 0) break;
		for (const row of rows) update.run(parseSqliteSessionEntryRecord(row) ? 1 : -1, row.session_key);
	}
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
//#region src/state/openclaw-agent-json-predicate-schema.ts
/** Derived fields introduced together by agent schema 26. JSON remains canonical. */
const AGENT_JSON_PREDICATE_COLUMNS = {
	session_nodes: ["session_started_at", "has_optional_references"],
	transcript_events: [
		"navigation_type",
		"navigation_custom_type",
		"navigation_display",
		"message_role",
		"navigation_last_type",
		"navigation_last_custom_type",
		"navigation_valid"
	],
	context_engine_turn_outbox: ["payload_state"]
};
const COLUMN_DECLARATIONS = {
	session_started_at: "INTEGER",
	has_optional_references: "INTEGER NOT NULL DEFAULT 0",
	payload_state: "TEXT",
	navigation_type: "TEXT",
	navigation_custom_type: "TEXT",
	navigation_display: "INTEGER NOT NULL DEFAULT 0",
	message_role: "TEXT",
	navigation_last_type: "TEXT",
	navigation_last_custom_type: "TEXT",
	navigation_valid: "INTEGER NOT NULL DEFAULT 1"
};
/** Historical admission compares the schema before predicate columns existed. */
function withoutAgentJsonPredicateColumns(schema) {
	let historicalSchema = schema;
	for (const [column, declaration] of Object.entries(COLUMN_DECLARATIONS)) historicalSchema = historicalSchema.replace(`  ${column} ${declaration},\n`, "");
	return historicalSchema;
}
/** Runs once inside the versioned migration transaction, never on runtime reads. */
function migrateAgentJsonPredicatesInTransaction(database) {
	ensureColumn(database, "session_nodes", "session_started_at INTEGER");
	ensureColumn(database, "session_nodes", "has_optional_references INTEGER NOT NULL DEFAULT 0");
	database.exec(`
    UPDATE session_nodes SET
      session_started_at = CASE WHEN json_valid(entry_json)
        THEN CAST(json_extract(entry_json, '$.sessionStartedAt') AS INTEGER) END,
      has_optional_references = CASE WHEN NOT json_valid(entry_json) OR instr(entry_json, char(0)) > 0 THEN 1
        WHEN json_type(entry_json, '$.previousSessionId') IS NOT NULL
          OR json_type(entry_json, '$.usageFamilySessionIds') IS NOT NULL
          OR json_type(entry_json, '$.compactionCheckpoints') IS NOT NULL THEN 1
        ELSE 0 END;
  `);
	if (tableExists(database, "context_engine_turn_outbox")) {
		ensureColumn(database, "context_engine_turn_outbox", "payload_state TEXT");
		database.exec(`
      UPDATE context_engine_turn_outbox SET payload_state = CASE
        WHEN json_valid(payload_json) THEN CASE
          WHEN json_type(payload_json, '$.state') = 'text'
          THEN json_extract(payload_json, '$.state') END END;
    `);
	}
	for (const column of AGENT_JSON_PREDICATE_COLUMNS.transcript_events) ensureColumn(database, "transcript_events", `${column} ${COLUMN_DECLARATIONS[column]}`);
	database.exec(`
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
  `);
}
//#endregion
//#region src/state/openclaw-agent-outbox-sequence-migration.ts
/** Historical admission and migration witnesses retain the pre-sequence contract. */
function withoutOutboxEnqueueSequence(schema) {
	return schema.replace("  enqueue_sequence INTEGER PRIMARY KEY,\n  advancement_key TEXT NOT NULL UNIQUE,", "  advancement_key TEXT NOT NULL PRIMARY KEY,");
}
/** Rebuild within the schema owner's exclusive migration transaction. */
function migrateOutboxEnqueueSequenceInTransaction(database) {
	if (!tableExists(database, "context_engine_turn_outbox") || tableHasColumn(database, "context_engine_turn_outbox", "enqueue_sequence")) return null;
	const started = performance.now();
	const facts = getAdmittedSqliteSchemaFacts(database) ?? captureSqliteSchemaFacts(database);
	const objects = [...facts.indexDefinitions.values(), ...facts.triggers.values()].filter(({ table }) => table === "context_engine_turn_outbox");
	const schema = extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, "context_engine_turn_outbox");
	database.exec(`
    ${schema.replace("IF NOT EXISTS context_engine_turn_outbox", "context_engine_turn_outbox_sequence_migration")}
    INSERT INTO context_engine_turn_outbox_sequence_migration
      (enqueue_sequence, advancement_key, engine_id, owner_plugin_id, session_id,
       payload_json, payload_state, attempt_count, last_attempt_at, last_error, created_at)
    SELECT rowid, advancement_key, engine_id, owner_plugin_id, session_id,
       payload_json, payload_state, attempt_count, last_attempt_at, last_error, created_at
    FROM context_engine_turn_outbox;
    DROP TABLE context_engine_turn_outbox;
    ALTER TABLE context_engine_turn_outbox_sequence_migration RENAME TO context_engine_turn_outbox;
  `);
	for (const object of objects) if (object.sql !== null) database.exec(object.sql);
	return performance.now() - started;
}
//#endregion
//#region src/state/openclaw-agent-session-participants-schema.ts
function sessionParticipantsSchemaSql() {
	return extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, SESSION_PARTICIPANTS_TABLE, {
		endMarker: "CREATE TABLE IF NOT EXISTS session_key_contract (",
		includeEndMarker: false,
		errorMessage: "OpenClaw session participant schema markers are missing."
	});
}
const ensureSessionParticipantsSchema = createSqliteSchemaEnsurer(sessionParticipantsSchemaSql, { tables: [SESSION_PARTICIPANTS_TABLE] });
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
//#region src/state/openclaw-agent-session-snapshots-schema.ts
function sessionEntrySnapshotsSchemaSql(schema) {
	return extractSqliteTableSchema(schema, "session_entry_snapshots", {
		endMarker: "CREATE INDEX IF NOT EXISTS idx_agent_session_nodes_updated_at",
		includeEndMarker: false
	});
}
/** Historical admission must validate the representation its reader actually understood. */
function withoutSessionEntrySnapshotsSchema(schema) {
	if (!schema.includes("CREATE TABLE IF NOT EXISTS session_entry_snapshots (")) return schema;
	return schema.replace("  snapshot_revision INTEGER NOT NULL DEFAULT 0,\n", "").replace(sessionEntrySnapshotsSchemaSql(schema), "");
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
	let historicalSchema = withoutSessionEntrySnapshotsSchema(schema);
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
const AGENT_V14_CORE_SCHEMA_SQL = withLegacySessionParticipantsSchema(withLegacyAgentStorageSchema(withLegacyCanonicalSessionValidationTriggers(withoutAgentJsonPredicateColumns(withoutOutboxEnqueueSequence(AGENT_SCHEMA_WITHOUT_PROGRESS_CARD_SQL.replace(sessionSharingSchema, ""))))));
//#endregion
//#region src/state/openclaw-agent-db-schema-helpers.ts
/** Compare historical migration targets against only the representation they support. */
function getOpenClawAgentMigrationSchema(targetVersion) {
	const sequenceSchemaSql = targetVersion < 27 ? withoutOutboxEnqueueSequence(OPENCLAW_AGENT_SCHEMA_SQL) : OPENCLAW_AGENT_SCHEMA_SQL;
	const predicateSchemaSql = targetVersion < 26 ? withoutAgentJsonPredicateColumns(sequenceSchemaSql) : sequenceSchemaSql;
	const canonicalSchemaSql = targetVersion < 25 ? withLegacyCanonicalSessionValidationTriggers(predicateSchemaSql) : predicateSchemaSql;
	const sessionSchemaSql = targetVersion < 24 ? withoutSessionEntrySnapshotsSchema(canonicalSchemaSql) : canonicalSchemaSql;
	const targetSchemaSql = targetVersion < 23 ? withLegacyAgentStorageSchema(sessionSchemaSql, targetVersion) : sessionSchemaSql;
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
		return false;
	}
	const repairableIndexes = new Set(getCanonicalSqliteNamedIndexContracts(schemaSql).map((index) => index.name));
	const issues = collectSqliteSchemaIssues(database, schemaSql, compatibility);
	if (issues.some((issue) => issue.code !== "missing-or-drifted-index" || !repairableIndexes.has(issue.objectName))) throwSqliteSchemaMismatches(pathname, legacySqliteSchemaIssueMessages(issues));
	return issues.length > 0;
}
function assertOpenClawAgentCurrentRuntimeSchema(database, options) {
	const agentId = normalizeAgentId(options.agentId);
	const metadata = readExistingAgentSchemaMeta(database);
	assertCurrentAgentSchemaMetadata(metadata, agentId, options.pathname);
	if (hasRetiredAgentStateLeaseSchema(database)) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${options.pathname} retains retired state_leases storage; run openclaw doctor --fix before using it.`);
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
/** Ensure the additive session-key contract table inside the caller's transaction. */
function ensureSessionKeyContractSchemaInTransaction(db) {
	if (tableExists(db, "session_key_contract") && db.prepare("SELECT 1 FROM session_key_contract WHERE id = 1").get()) return;
	db.exec(extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, "session_key_contract", {
		endMarker: "CREATE TABLE IF NOT EXISTS session_windows (",
		includeEndMarker: false,
		errorMessage: "OpenClaw agent session-key contract schema markers are missing."
	}));
}
function ensureSessionReactionsSchemaInTransaction(db) {
	const schema = getAdmittedSqliteSchemaFacts(db);
	if (schema?.tables.has("session_reactions") && schema.indexes.has("idx_agent_session_reactions_message")) return;
	db.exec(extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, "session_reactions", {
		endMarker: "CREATE TABLE IF NOT EXISTS board_tabs (",
		includeEndMarker: false,
		errorMessage: "OpenClaw agent session-reactions schema markers are missing."
	}));
}
function repairAndAssertOpenClawAgentV14SchemaForMigration(database, options) {
	const userVersion = readSqliteUserVersion(database);
	if (userVersion !== 14) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${options.pathname} uses schema version ${userVersion}; expected 14 before migrating it.`);
	const agentId = normalizeAgentId(options.agentId);
	const metadata = readExistingAgentSchemaMeta(database);
	if (!metadata) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${options.pathname} has no schema ownership metadata. Run openclaw doctor --fix to inspect and repair its ownership.`);
	assertExistingAgentSchemaOwner(metadata, agentId, options.pathname);
	if (metadata.schemaVersion !== 14) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${options.pathname} metadata schema version ${metadata.schemaVersion ?? "invalid"} does not match 14; repair the ownership metadata before migrating it.`);
	ensureSessionAdditiveColumns(database);
	ensureSessionEntryValidityProjection(database);
	ensureLegacySessionEntryValidityTriggers(database);
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
	if (readSqliteUserVersion(db) !== options.version || metadata?.schemaVersion !== options.version) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${options.pathname} did not converge on schema version ${options.version}.`);
	assertOpenClawAgentSchemaContains(db, options.pathname, schemaSql, options.version < 18 ? "legacy" : "current");
}
function finishAgentSchemaMigration(db, agentId, pathname, targetVersion, schemaSql, requiresMaintenance, assertMigration) {
	db.exec(`PRAGMA user_version = ${targetVersion};`);
	persistAgentSchemaMetadata(db, agentId, targetVersion);
	assertAgentSchemaVersion(db, {
		agentId,
		pathname,
		version: targetVersion
	}, schemaSql);
	if (requiresMaintenance && db.prepare("PRAGMA foreign_key_check").all().length > 0) throw new Error(`Agent schema migration failed foreign key validation for ${pathname}.`);
	assertMigration();
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
	const hasContractTable = tableExists(db, "session_key_contract");
	return !sessionNodeColumns.has("entry_valid") || !hasContractTable;
}
function hasPendingCurrentVersionAgentDatabaseMigration(database) {
	return !tableExists(database, "session_reactions") || hasPendingMemoryChunkMetadataMigration(database) || hasPendingSessionKeyContractSchemaMigration(database) || hasRetiredAgentStateLeaseSchema(database) || hasPendingAgentStartupColumns((getAdmittedSqliteSchemaFacts(database) ?? captureSqliteSchemaFacts(database)).tableSql);
}
//#endregion
export { migrateSessionTranscriptGenerations as A, assertSupportedAgentMigrationSchemas as C, migrateConversationDeliveryTargetColumn as D, ensureSessionEntryValidityProjection as E, ensureLegacySessionEntryValidityTriggers as F, migrateCanonicalSessionWriterValidation as I, seedCanonicalSessionValidationPending as L, migrateLegacySessionCreator as M, persistAgentSchemaMetadata as N, migrateSessionCreatorNamespaces as O, LEGACY_CANONICAL_VALIDATION_TRIGGER_NAMES as P, migrateAgentJsonPredicatesInTransaction as S, ensureSessionAdditiveColumns as T, migrateSessionParticipantsSchema as _, ensureSessionReactionsSchemaInTransaction as a, withoutOutboxEnqueueSequence as b, hasPendingCurrentVersionAgentDatabaseMigration as c, migratedSessionColumn as d, repairAndAssertOpenClawAgentV14SchemaForMigration as f, withoutSessionEntrySnapshotsSchema as g, sessionEntrySnapshotsSchemaSql as h, ensureSessionKeyContractSchemaInTransaction as i, readSqliteTableColumns as j, migrateSessionTranscriptActiveProjection as k, hasPendingMemoryChunkMetadataMigration as l, migrateDeployedTranscriptFtsRowsInTransaction as m, assertOpenClawAgentCurrentRuntimeSchema as n, finishAgentSchemaMigration as o, withLegacyAgentStorageSchema as p, assertOpenClawAgentSchemaContains as r, getOpenClawAgentMigrationSchema as s, assertAgentSchemaVersion as t, migrateRetiredAgentStateLeaseSchema as u, ensureSessionParticipantsSchema as v, backfillSessionConversations as w, AGENT_JSON_PREDICATE_COLUMNS as x, migrateOutboxEnqueueSequenceInTransaction as y };
