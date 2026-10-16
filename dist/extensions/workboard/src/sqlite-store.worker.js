import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, o as iterateSqliteQuerySync, r as executeSqliteQuerySync, t as compileSqliteQueryBindings, u as sqliteStringSet } from "../../../kysely-sync-K7ftY-g4.mjs";
import { t as openNodeSqliteDatabase } from "../../../node-sqlite-XIcwmOrl.mjs";
import { a as runSqliteImmediateTransactionSync, r as runSqliteDeferredTransactionSync } from "../../../sqlite-transaction-DsZ3X6nD.mjs";
import { t as configureSqliteConnectionPragmas } from "../../../sqlite-wal-DUSYRhyv.mjs";
import { t as migrateSqliteSchemaToStrict } from "../../../sqlite-strict-CYeSH78z.mjs";
import "../../../sqlite-worker-runtime-BFi6Nryt.mjs";
import "../../../plugin-state-runtime-CD-7t-B7.mjs";
import { _ as createDefaultWorkboardSessionsBoardSpec, g as workboardCardSlotOwner, h as workboardCardConsumesOwnerSlot, t as encodeWorkboardSqliteFailure, v as normalizeWorkboardSessionsBoardSpec, y as patchWorkboardSessionsBoardSpec } from "../../../sqlite-store-errors-ClY8dC8v.mjs";
import fs from "node:fs";
import path from "node:path";
//#region extensions/workboard/src/sqlite-store-records.ts
function jsonValue(value) {
	return value === void 0 ? null : JSON.stringify(value);
}
function parseJson(value) {
	if (typeof value !== "string" || !value) return;
	return JSON.parse(value);
}
function stringValue(row, key) {
	const value = row[key];
	return typeof value === "string" && value.length > 0 ? value : void 0;
}
function numberValue(row, key) {
	const value = row[key];
	if (typeof value === "number") return Number.isFinite(value) ? value : void 0;
	if (typeof value === "bigint") return Number(value);
}
function requiredString(row, key) {
	const value = stringValue(row, key);
	if (!value) throw new Error(`workboard sqlite row missing ${key}`);
	return value;
}
function requiredNumber(row, key) {
	const value = numberValue(row, key);
	if (value === void 0) throw new Error(`workboard sqlite row missing ${key}`);
	return value;
}
function optional(value) {
	return Object.keys(value).length > 0 ? value : void 0;
}
function definedFields(fields) {
	for (const key in fields) if (fields[key] === void 0) delete fields[key];
	return fields;
}
function blobToBase64(value) {
	if (value instanceof Uint8Array) return Buffer.from(value).toString("base64");
	if (typeof value === "string") return Buffer.from(value).toString("base64");
	return "";
}
const CARD_CHILD_TABLES = [
	"workboard_card_labels",
	"workboard_card_events",
	"workboard_card_attempts",
	"workboard_card_comments",
	"workboard_card_links",
	"workboard_card_proof",
	"workboard_card_artifacts",
	"workboard_card_attachments",
	"workboard_worker_logs",
	"workboard_card_diagnostics",
	"workboard_card_notifications"
];
function groupByCardId(rows) {
	const grouped = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const cardId = stringValue(row, "card_id");
		if (!cardId) continue;
		const bucket = grouped.get(cardId);
		if (bucket) bucket.push(row);
		else grouped.set(cardId, [row]);
	}
	return grouped;
}
function loadCardChildRows(db, cardIds) {
	const query = getNodeSqliteKysely(db);
	const selectedIds = cardIds ? sqliteStringSet(cardIds) : void 0;
	const byTable = /* @__PURE__ */ new Map();
	for (const table of CARD_CHILD_TABLES) {
		let rows = query.selectFrom(table).selectAll().orderBy("card_id", "asc").orderBy("ordinal", "asc");
		if (selectedIds) rows = rows.where("card_id", "in", selectedIds);
		byTable.set(table, groupByCardId(iterateSqliteQuerySync(db, rows)));
	}
	const workerProtocol = /* @__PURE__ */ new Map();
	let protocols = query.selectFrom("workboard_worker_protocol").selectAll();
	if (selectedIds) protocols = protocols.where("card_id", "in", selectedIds);
	for (const row of iterateSqliteQuerySync(db, protocols)) {
		const cardId = stringValue(row, "card_id");
		if (cardId) workerProtocol.set(cardId, row);
	}
	return {
		byTable,
		workerProtocol
	};
}
function childRows(db, table, cardId, preloaded) {
	const cached = preloaded?.byTable.get(table);
	if (cached) {
		const rows = cached.get(cardId) ?? [];
		cached.delete(cardId);
		return rows;
	}
	return db.prepare(`SELECT * FROM ${table} WHERE card_id = ? ORDER BY ordinal ASC`).all(cardId);
}
function workerProtocolRow(db, cardId, preloaded) {
	if (preloaded) {
		const row = preloaded.workerProtocol.get(cardId);
		preloaded.workerProtocol.delete(cardId);
		return row;
	}
	return db.prepare("SELECT * FROM workboard_worker_protocol WHERE card_id = ?").get(cardId);
}
function readLabels(db, cardId, preloaded) {
	return childRows(db, "workboard_card_labels", cardId, preloaded).flatMap((row) => {
		const label = stringValue(row, "label");
		return label ? [label] : [];
	});
}
function readEvents(db, cardId, preloaded) {
	const events = childRows(db, "workboard_card_events", cardId, preloaded).map((row) => {
		return definedFields({
			id: requiredString(row, "id"),
			kind: requiredString(row, "kind"),
			at: requiredNumber(row, "at"),
			fromStatus: stringValue(row, "from_status"),
			toStatus: stringValue(row, "to_status"),
			sessionKey: stringValue(row, "session_key"),
			runId: stringValue(row, "run_id")
		});
	});
	return events.length > 0 ? events : void 0;
}
function readExecution(row) {
	const id = stringValue(row, "execution_id");
	if (!id) return;
	return definedFields({
		id,
		kind: "agent-session",
		mode: requiredString(row, "execution_mode"),
		status: requiredString(row, "execution_status"),
		engine: stringValue(row, "execution_engine"),
		model: stringValue(row, "execution_model"),
		sessionKey: stringValue(row, "execution_session_key"),
		runId: stringValue(row, "execution_run_id"),
		startedAt: requiredNumber(row, "execution_started_at"),
		updatedAt: requiredNumber(row, "execution_updated_at")
	});
}
function readAttachment(row) {
	return definedFields({
		id: requiredString(row, "id"),
		cardId: requiredString(row, "card_id"),
		createdAt: requiredNumber(row, "created_at"),
		fileName: requiredString(row, "file_name"),
		byteSize: requiredNumber(row, "byte_size"),
		mimeType: stringValue(row, "mime_type"),
		note: stringValue(row, "note")
	});
}
function readMetadata(db, row, preloaded) {
	const cardId = requiredString(row, "id");
	const attempts = childRows(db, "workboard_card_attempts", cardId, preloaded).map((child) => {
		return definedFields({
			id: requiredString(child, "id"),
			status: requiredString(child, "status"),
			startedAt: requiredNumber(child, "started_at"),
			endedAt: numberValue(child, "ended_at"),
			engine: stringValue(child, "engine"),
			mode: stringValue(child, "mode"),
			model: stringValue(child, "model"),
			sessionKey: stringValue(child, "session_key"),
			runId: stringValue(child, "run_id"),
			error: stringValue(child, "error")
		});
	});
	const comments = childRows(db, "workboard_card_comments", cardId, preloaded).map((child) => {
		return definedFields({
			id: requiredString(child, "id"),
			body: requiredString(child, "body"),
			createdAt: requiredNumber(child, "created_at"),
			updatedAt: numberValue(child, "updated_at")
		});
	});
	const links = childRows(db, "workboard_card_links", cardId, preloaded).map((child) => {
		return definedFields({
			id: requiredString(child, "id"),
			type: requiredString(child, "type"),
			createdAt: requiredNumber(child, "created_at"),
			targetCardId: stringValue(child, "target_card_id"),
			title: stringValue(child, "title"),
			url: stringValue(child, "url")
		});
	});
	const proof = childRows(db, "workboard_card_proof", cardId, preloaded).map((child) => {
		return definedFields({
			id: requiredString(child, "id"),
			status: requiredString(child, "status"),
			createdAt: requiredNumber(child, "created_at"),
			label: stringValue(child, "label"),
			command: stringValue(child, "command"),
			url: stringValue(child, "url"),
			note: stringValue(child, "note")
		});
	});
	const artifacts = childRows(db, "workboard_card_artifacts", cardId, preloaded).map((child) => {
		return definedFields({
			id: requiredString(child, "id"),
			createdAt: requiredNumber(child, "created_at"),
			label: stringValue(child, "label"),
			url: stringValue(child, "url"),
			path: stringValue(child, "path"),
			mimeType: stringValue(child, "mime_type")
		});
	});
	const attachments = childRows(db, "workboard_card_attachments", cardId, preloaded).map(readAttachment);
	const workerLogs = childRows(db, "workboard_worker_logs", cardId, preloaded).map((child) => {
		return definedFields({
			id: requiredString(child, "id"),
			createdAt: requiredNumber(child, "created_at"),
			level: requiredString(child, "level"),
			message: requiredString(child, "message"),
			sessionKey: stringValue(child, "session_key"),
			runId: stringValue(child, "run_id")
		});
	});
	const diagnostics = childRows(db, "workboard_card_diagnostics", cardId, preloaded).map((child) => ({
		kind: requiredString(child, "kind"),
		severity: requiredString(child, "severity"),
		title: requiredString(child, "title"),
		detail: requiredString(child, "detail"),
		firstSeenAt: requiredNumber(child, "first_seen_at"),
		lastSeenAt: requiredNumber(child, "last_seen_at"),
		count: requiredNumber(child, "count"),
		actions: parseJson(child.actions_json) ?? []
	}));
	const notifications = childRows(db, "workboard_card_notifications", cardId, preloaded).map((child) => {
		return definedFields({
			id: requiredString(child, "id"),
			kind: requiredString(child, "kind"),
			createdAt: requiredNumber(child, "created_at"),
			message: requiredString(child, "message"),
			sequence: numberValue(child, "sequence"),
			sessionKey: stringValue(child, "session_key"),
			runId: stringValue(child, "run_id")
		});
	});
	const protocol = workerProtocolRow(db, cardId, preloaded);
	const automation = parseJson(row.automation_json);
	const claim = parseJson(row.claim_json);
	const stale = parseJson(row.stale_json);
	return optional(definedFields({
		attempts: attempts.length > 0 ? attempts : void 0,
		comments: comments.length > 0 ? comments : void 0,
		links: links.length > 0 ? links : void 0,
		proof: proof.length > 0 ? proof : void 0,
		artifacts: artifacts.length > 0 ? artifacts : void 0,
		attachments: attachments.length > 0 ? attachments : void 0,
		workerLogs: workerLogs.length > 0 ? workerLogs : void 0,
		workerProtocol: protocol ? definedFields({
			state: requiredString(protocol, "state"),
			updatedAt: requiredNumber(protocol, "updated_at"),
			detail: stringValue(protocol, "detail")
		}) : void 0,
		automation: automation || void 0,
		claim: claim || void 0,
		diagnostics: diagnostics.length > 0 ? diagnostics : void 0,
		notifications: notifications.length > 0 ? notifications : void 0,
		templateId: stringValue(row, "template_id"),
		archivedAt: numberValue(row, "archived_at"),
		stale: stale || void 0,
		lifecycleStatusSourceUpdatedAt: numberValue(row, "lifecycle_status_source_updated_at"),
		failureCount: numberValue(row, "failure_count")
	}));
}
function readCard(db, row, preloaded) {
	const card = {
		id: requiredString(row, "id"),
		title: requiredString(row, "title"),
		status: requiredString(row, "status"),
		priority: requiredString(row, "priority"),
		labels: readLabels(db, requiredString(row, "id"), preloaded),
		position: requiredNumber(row, "position"),
		createdAt: requiredNumber(row, "created_at"),
		updatedAt: requiredNumber(row, "updated_at")
	};
	const metadata = readMetadata(db, row, preloaded);
	const events = readEvents(db, card.id, preloaded);
	const execution = readExecution(row);
	return definedFields({
		...card,
		notes: stringValue(row, "notes"),
		agentId: stringValue(row, "agent_id"),
		sessionKey: stringValue(row, "session_key"),
		runId: stringValue(row, "run_id"),
		sourceUrl: stringValue(row, "source_url"),
		execution,
		startedAt: numberValue(row, "started_at"),
		completedAt: numberValue(row, "completed_at"),
		events,
		metadata
	});
}
//#endregion
//#region extensions/workboard/src/sqlite-store-schema.ts
const SCHEMA_VERSION = 3;
const WORKBOARD_SQLITE_BUSY_TIMEOUT_MS = 5e3;
const WORKBOARD_SQLITE_DIR_MODE = 448;
const WORKBOARD_SQLITE_FILE_MODE = 384;
function tableColumns(db, tableName) {
	return new Set(db.prepare(`PRAGMA table_info(${tableName})`).all().flatMap((row) => typeof row.name === "string" ? [row.name] : []));
}
function ensureColumn(db, tableName, columnName, definition) {
	if (tableColumns(db, tableName).has(columnName)) return;
	db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${definition}`);
}
const WORKBOARD_SCHEMA_SQL = `
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
  `;
function ensureWorkboardSchema(db) {
	db.exec(WORKBOARD_SCHEMA_SQL);
	ensureColumn(db, "workboard_boards", "automation_job_id", "automation_job_id TEXT");
	ensureColumn(db, "workboard_boards", "kind", "kind TEXT");
	ensureColumn(db, "workboard_boards", "sessions_spec", "sessions_spec TEXT");
	const migrationId = `schema-${SCHEMA_VERSION}`;
	if (!db.prepare("SELECT 1 AS found FROM workboard_schema_migrations WHERE id = ?").get(migrationId)) {
		migrateSqliteSchemaToStrict(db, WORKBOARD_SCHEMA_SQL, { databaseLabel: "workboard database" });
		db.prepare("INSERT OR IGNORE INTO workboard_schema_migrations (id, applied_at) VALUES (?, ?)").run(migrationId, Date.now());
	}
}
function chmodIfExists(targetPath, mode) {
	try {
		fs.chmodSync(targetPath, mode);
	} catch (err) {
		if (err.code !== "ENOENT") throw err;
	}
}
function hardenWorkboardDatabaseFiles(dbPath) {
	fs.chmodSync(path.dirname(dbPath), WORKBOARD_SQLITE_DIR_MODE);
	chmodIfExists(dbPath, WORKBOARD_SQLITE_FILE_MODE);
	chmodIfExists(`${dbPath}-wal`, WORKBOARD_SQLITE_FILE_MODE);
	chmodIfExists(`${dbPath}-shm`, WORKBOARD_SQLITE_FILE_MODE);
	chmodIfExists(`${dbPath}-journal`, WORKBOARD_SQLITE_FILE_MODE);
}
function prepareWorkboardDatabasePath(dbPath) {
	fs.mkdirSync(path.dirname(dbPath), {
		recursive: true,
		mode: WORKBOARD_SQLITE_DIR_MODE
	});
	chmodIfExists(path.dirname(dbPath), WORKBOARD_SQLITE_DIR_MODE);
	if (!fs.existsSync(dbPath)) fs.closeSync(fs.openSync(dbPath, "a", WORKBOARD_SQLITE_FILE_MODE));
}
function createWorkboardDatabase(dbPath, retainClose) {
	prepareWorkboardDatabasePath(dbPath);
	const db = openNodeSqliteDatabase(dbPath);
	let maintenance;
	let maintenanceClosed = false;
	let databaseClosed = false;
	const close = () => {
		if (!maintenanceClosed) {
			maintenance?.close();
			maintenanceClosed = true;
		}
		if (!databaseClosed) {
			db.close();
			databaseClosed = true;
		}
	};
	try {
		retainClose?.(close);
		maintenance = configureSqliteConnectionPragmas(db, {
			busyTimeoutMs: WORKBOARD_SQLITE_BUSY_TIMEOUT_MS,
			checkpointIntervalMs: 0,
			databaseLabel: "workboard database",
			databasePath: dbPath,
			foreignKeys: true,
			synchronous: "NORMAL"
		});
		ensureWorkboardSchema(db);
		hardenWorkboardDatabaseFiles(dbPath);
		return {
			db,
			close
		};
	} catch (error) {
		if (!retainClose) try {
			maintenance?.close();
		} finally {
			db.close();
		}
		throw error;
	}
}
//#endregion
//#region extensions/workboard/src/sqlite-store-sessions-board.ts
const PREVIOUS_DEFAULT_RULES = new Map(Object.entries({
	"needs-input": { health: ["waiting-on-user"] },
	working: {
		health: [
			"on-track",
			"grinding",
			"wrapping-up"
		],
		run: ["active"]
	},
	stuck: { health: ["stuck", "failed"] },
	"in-review": { pullRequest: ["open", "draft"] },
	merged: { pullRequest: ["merged"] },
	done: { health: ["done"] }
}).map(([id, match]) => [id, JSON.stringify(match)]));
var WorkboardSqliteSessionsBoardStore = class {
	constructor(db, boards) {
		this.db = db;
		this.boards = boards;
	}
	get(boardId) {
		const board = this.boards.lookup(boardId)?.board;
		if (!board) throw new Error(`board not found: ${boardId}`);
		if (board.kind !== "sessions" || !board.sessions) throw new Error("This board is not a Sessions board.");
		return {
			...board,
			kind: "sessions",
			sessions: board.sessions
		};
	}
	update(boardId, patch) {
		return runSqliteImmediateTransactionSync(this.db, () => {
			const current = this.get(boardId);
			const sessions = patchWorkboardSessionsBoardSpec(current.sessions, patch);
			const updatedAt = Math.max(Date.now(), current.updatedAt + 1);
			executeSqliteQuerySync(this.db, getNodeSqliteKysely(this.db).updateTable("workboard_boards").set({
				sessions_spec: JSON.stringify(sessions),
				updated_at: updatedAt
			}).where("id", "=", boardId));
			return {
				...current,
				sessions,
				updatedAt
			};
		});
	}
	listPlacements(boardId) {
		const query = getNodeSqliteKysely(this.db).selectFrom("workboard_session_placements").selectAll().where("board_id", "=", boardId).orderBy("session_key", "asc");
		return Array.from(iterateSqliteQuerySync(this.db, query), (row) => ({
			sessionKey: row.session_key,
			columnId: row.column_id,
			source: row.source,
			reason: row.reason,
			factsHash: row.facts_hash,
			updatedAt: row.updated_at
		}));
	}
	repairPlacements() {
		return runSqliteImmediateTransactionSync(this.db, () => {
			const query = getNodeSqliteKysely(this.db);
			const placements = Number(executeSqliteQuerySync(this.db, query.deleteFrom("workboard_session_placements").where("source", "!=", "operator")).numAffectedRows ?? 0n);
			const defaults = createDefaultWorkboardSessionsBoardSpec().columns;
			let boards = 0;
			for (const { id } of executeSqliteQuerySync(this.db, query.selectFrom("workboard_boards").select("id").where("kind", "=", "sessions")).rows) {
				const board = this.get(id);
				if (board.sessions.columns.some((column) => {
					const previous = PREVIOUS_DEFAULT_RULES.get(column.id);
					return previous === void 0 || JSON.stringify(column.match) !== previous;
				})) continue;
				const columns = board.sessions.columns.map((column) => ({
					...column,
					match: defaults.find((entry) => entry.id === column.id)?.match
				}));
				if (columns.map((column) => column.id).join(",") === [...PREVIOUS_DEFAULT_RULES.keys()].join(",")) columns.splice(1, 0, ...columns.splice(2, 1));
				if (JSON.stringify(columns) !== JSON.stringify(board.sessions.columns)) {
					this.update(id, { columns });
					boards += 1;
				}
			}
			return {
				placements,
				boards
			};
		});
	}
	writePlacement(boardId, placement, expectedSpec) {
		const expected = JSON.stringify(normalizeWorkboardSessionsBoardSpec(expectedSpec));
		return runSqliteImmediateTransactionSync(this.db, () => {
			const board = this.get(boardId);
			if (JSON.stringify(board.sessions) !== expected) return false;
			if (!board.sessions.columns.some((column) => column.id === placement.columnId)) throw new Error(`Unknown sessions board column: ${placement.columnId}`);
			if (!placement.sessionKey || placement.source !== "operator" || typeof placement.reason !== "string" || !Number.isSafeInteger(placement.updatedAt) || placement.updatedAt < 0) throw new Error("Invalid session pin.");
			const query = getNodeSqliteKysely(this.db);
			const current = executeSqliteQueryTakeFirstSync(this.db, query.selectFrom("workboard_session_placements").select("updated_at").where("board_id", "=", boardId).where("session_key", "=", placement.sessionKey));
			if (current?.updated_at !== placement.expectedUpdatedAt) return false;
			executeSqliteQuerySync(this.db, query.insertInto("workboard_session_placements").values({
				board_id: boardId,
				session_key: placement.sessionKey,
				column_id: placement.columnId,
				source: "operator",
				reason: placement.reason,
				facts_hash: "",
				updated_at: Math.max(placement.updatedAt, (current?.updated_at ?? -1) + 1)
			}).onConflict((conflict) => conflict.columns(["board_id", "session_key"]).doUpdateSet((eb) => ({
				column_id: eb.ref("excluded.column_id"),
				source: eb.ref("excluded.source"),
				reason: eb.ref("excluded.reason"),
				facts_hash: eb.ref("excluded.facts_hash"),
				updated_at: eb.ref("excluded.updated_at")
			}))));
			return true;
		});
	}
};
//#endregion
//#region extensions/workboard/src/sqlite-store-write.ts
function cardBoardId(card) {
	return card.metadata?.automation?.boardId ?? "default";
}
function bindNull(value) {
	if (value === void 0 || value === null || typeof value === "string" || typeof value === "number" || typeof value === "bigint" || value instanceof Uint8Array) return value ?? null;
	return JSON.stringify(value);
}
function insertChildren(db, table, cardId, entries, fields) {
	const deletion = compileSqliteQueryBindings(() => getNodeSqliteKysely(db).deleteFrom(table).where("card_id", "=", cardId));
	db.prepare(deletion.compiled.sql).run(...deletion.bind());
	if (entries?.length) {
		const { compiled, bind } = compileSqliteQueryBindings((parameter) => getNodeSqliteKysely(db).insertInto(table).values({
			ordinal: parameter(([, ordinal]) => ordinal),
			...Object.fromEntries(Object.entries(fields).map(([column, read]) => [column, parameter(([entry]) => read(entry))]))
		}));
		const statement = db.prepare(compiled.sql);
		entries.forEach((entry, ordinal) => statement.run(...bind([entry, ordinal])));
	}
}
function insertCard(db, card) {
	if (executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("workboard_boards").select("kind").where("id", "=", cardBoardId(card)))?.kind === "sessions") throw new Error("Sessions boards do not hold cards");
	const execution = card.execution;
	const metadata = card.metadata;
	const query = getNodeSqliteKysely(db);
	const parent = compileSqliteQueryBindings((p) => query.insertInto("workboard_cards").values({
		id: p(() => card.id),
		board_id: p(() => cardBoardId(card)),
		title: p(() => card.title),
		notes: p(() => bindNull(card.notes)),
		status: p(() => card.status),
		priority: p(() => card.priority),
		agent_id: p(() => bindNull(card.agentId)),
		session_key: p(() => bindNull(card.sessionKey)),
		run_id: p(() => bindNull(card.runId)),
		source_url: p(() => bindNull(card.sourceUrl)),
		position: p(() => card.position),
		created_at: p(() => card.createdAt),
		updated_at: p(() => card.updatedAt),
		started_at: p(() => bindNull(card.startedAt)),
		completed_at: p(() => bindNull(card.completedAt)),
		execution_id: p(() => bindNull(execution?.id)),
		execution_kind: p(() => bindNull(execution?.kind)),
		execution_engine: p(() => bindNull(execution?.engine)),
		execution_mode: p(() => bindNull(execution?.mode)),
		execution_status: p(() => bindNull(execution?.status)),
		execution_model: p(() => bindNull(execution?.model)),
		execution_session_key: p(() => bindNull(execution?.sessionKey)),
		execution_run_id: p(() => bindNull(execution?.runId)),
		execution_started_at: p(() => bindNull(execution?.startedAt)),
		execution_updated_at: p(() => bindNull(execution?.updatedAt)),
		automation_json: p(() => jsonValue(metadata?.automation)),
		claim_json: p(() => jsonValue(metadata?.claim)),
		template_id: p(() => bindNull(metadata?.templateId)),
		archived_at: p(() => bindNull(metadata?.archivedAt)),
		stale_json: p(() => jsonValue(metadata?.stale)),
		lifecycle_status_source_updated_at: p(() => bindNull(metadata?.lifecycleStatusSourceUpdatedAt)),
		failure_count: p(() => bindNull(metadata?.failureCount))
	}).onConflict((conflict) => conflict.column("id").doUpdateSet((eb) => ({
		board_id: eb.ref("excluded.board_id"),
		title: eb.ref("excluded.title"),
		notes: eb.ref("excluded.notes"),
		status: eb.ref("excluded.status"),
		priority: eb.ref("excluded.priority"),
		agent_id: eb.ref("excluded.agent_id"),
		session_key: eb.ref("excluded.session_key"),
		run_id: eb.ref("excluded.run_id"),
		source_url: eb.ref("excluded.source_url"),
		position: eb.ref("excluded.position"),
		created_at: eb.ref("excluded.created_at"),
		updated_at: eb.ref("excluded.updated_at"),
		started_at: eb.ref("excluded.started_at"),
		completed_at: eb.ref("excluded.completed_at"),
		execution_id: eb.ref("excluded.execution_id"),
		execution_kind: eb.ref("excluded.execution_kind"),
		execution_engine: eb.ref("excluded.execution_engine"),
		execution_mode: eb.ref("excluded.execution_mode"),
		execution_status: eb.ref("excluded.execution_status"),
		execution_model: eb.ref("excluded.execution_model"),
		execution_session_key: eb.ref("excluded.execution_session_key"),
		execution_run_id: eb.ref("excluded.execution_run_id"),
		execution_started_at: eb.ref("excluded.execution_started_at"),
		execution_updated_at: eb.ref("excluded.execution_updated_at"),
		automation_json: eb.ref("excluded.automation_json"),
		claim_json: eb.ref("excluded.claim_json"),
		template_id: eb.ref("excluded.template_id"),
		archived_at: eb.ref("excluded.archived_at"),
		stale_json: eb.ref("excluded.stale_json"),
		lifecycle_status_source_updated_at: eb.ref("excluded.lifecycle_status_source_updated_at"),
		failure_count: eb.ref("excluded.failure_count")
	}))));
	db.prepare(parent.compiled.sql).run(...parent.bind());
	insertChildren(db, "workboard_card_labels", card.id, card.labels, {
		card_id: () => card.id,
		label: (label) => label
	});
	insertChildren(db, "workboard_card_events", card.id, card.events, {
		id: (event) => event.id,
		card_id: () => card.id,
		kind: (event) => event.kind,
		at: (event) => event.at,
		from_status: (event) => bindNull(event.fromStatus),
		to_status: (event) => bindNull(event.toStatus),
		session_key: (event) => bindNull(event.sessionKey),
		run_id: (event) => bindNull(event.runId)
	});
	insertChildren(db, "workboard_card_attempts", card.id, metadata?.attempts, {
		id: (entry) => entry.id,
		card_id: () => card.id,
		status: (entry) => entry.status,
		started_at: (entry) => entry.startedAt,
		ended_at: (entry) => bindNull(entry.endedAt),
		engine: (entry) => bindNull(entry.engine),
		mode: (entry) => bindNull(entry.mode),
		model: (entry) => bindNull(entry.model),
		session_key: (entry) => bindNull(entry.sessionKey),
		run_id: (entry) => bindNull(entry.runId),
		error: (entry) => bindNull(entry.error)
	});
	insertChildren(db, "workboard_card_comments", card.id, metadata?.comments, {
		id: (entry) => entry.id,
		card_id: () => card.id,
		body: (entry) => entry.body,
		created_at: (entry) => entry.createdAt,
		updated_at: (entry) => bindNull(entry.updatedAt)
	});
	insertChildren(db, "workboard_card_links", card.id, metadata?.links, {
		id: (entry) => entry.id,
		card_id: () => card.id,
		type: (entry) => entry.type,
		target_card_id: (entry) => bindNull(entry.targetCardId),
		title: (entry) => bindNull(entry.title),
		url: (entry) => bindNull(entry.url),
		created_at: (entry) => entry.createdAt
	});
	insertChildren(db, "workboard_card_proof", card.id, metadata?.proof, {
		id: (entry) => entry.id,
		card_id: () => card.id,
		status: (entry) => entry.status,
		label: (entry) => bindNull(entry.label),
		command: (entry) => bindNull(entry.command),
		url: (entry) => bindNull(entry.url),
		note: (entry) => bindNull(entry.note),
		created_at: (entry) => entry.createdAt
	});
	insertChildren(db, "workboard_card_artifacts", card.id, metadata?.artifacts, {
		id: (entry) => entry.id,
		card_id: () => card.id,
		label: (entry) => bindNull(entry.label),
		url: (entry) => bindNull(entry.url),
		path: (entry) => bindNull(entry.path),
		mime_type: (entry) => bindNull(entry.mimeType),
		created_at: (entry) => entry.createdAt
	});
	insertChildren(db, "workboard_card_attachments", card.id, metadata?.attachments, {
		id: (entry) => entry.id,
		card_id: (entry) => entry.cardId,
		file_name: (entry) => entry.fileName,
		byte_size: (entry) => entry.byteSize,
		mime_type: (entry) => bindNull(entry.mimeType),
		note: (entry) => bindNull(entry.note),
		created_at: (entry) => entry.createdAt
	});
	insertChildren(db, "workboard_card_diagnostics", card.id, metadata?.diagnostics, {
		card_id: () => card.id,
		kind: (entry) => entry.kind,
		severity: (entry) => entry.severity,
		title: (entry) => entry.title,
		detail: (entry) => entry.detail,
		first_seen_at: (entry) => entry.firstSeenAt,
		last_seen_at: (entry) => entry.lastSeenAt,
		count: (entry) => entry.count,
		actions_json: (entry) => JSON.stringify(entry.actions)
	});
	insertChildren(db, "workboard_card_notifications", card.id, metadata?.notifications, {
		id: (entry) => entry.id,
		card_id: () => card.id,
		kind: (entry) => entry.kind,
		message: (entry) => entry.message,
		created_at: (entry) => entry.createdAt,
		sequence: (entry) => bindNull(entry.sequence),
		session_key: (entry) => bindNull(entry.sessionKey),
		run_id: (entry) => bindNull(entry.runId)
	});
	insertChildren(db, "workboard_worker_logs", card.id, metadata?.workerLogs, {
		id: (entry) => entry.id,
		card_id: () => card.id,
		level: (entry) => entry.level,
		message: (entry) => entry.message,
		created_at: (entry) => entry.createdAt,
		session_key: (entry) => bindNull(entry.sessionKey),
		run_id: (entry) => bindNull(entry.runId)
	});
	const protocolDelete = compileSqliteQueryBindings((p) => query.deleteFrom("workboard_worker_protocol").where("card_id", "=", p(() => card.id)));
	db.prepare(protocolDelete.compiled.sql).run(...protocolDelete.bind());
	if (metadata?.workerProtocol) {
		const { compiled, bind } = compileSqliteQueryBindings((p) => query.insertInto("workboard_worker_protocol").values({
			card_id: p(() => card.id),
			state: p(() => metadata.workerProtocol.state),
			updated_at: p(() => metadata.workerProtocol.updatedAt),
			detail: p(() => bindNull(metadata.workerProtocol.detail))
		}));
		db.prepare(compiled.sql).run(...bind());
	}
}
//#endregion
//#region extensions/workboard/src/sqlite-store-kernel.ts
var WorkboardSqliteCardStore = class {
	constructor(db) {
		this.db = db;
	}
	matchesUpdatedAt(key, expectedUpdatedAt) {
		const current = executeSqliteQueryTakeFirstSync(this.db, getNodeSqliteKysely(this.db).selectFrom("workboard_cards").select("updated_at").where("id", "=", key));
		return current !== void 0 && numberValue(current, "updated_at") === expectedUpdatedAt;
	}
	validatePayload(key, value) {
		if (value.version !== 1 || value.card.id !== key) throw new Error("invalid workboard card payload");
	}
	register(key, value) {
		this.validatePayload(key, value);
		runSqliteImmediateTransactionSync(this.db, () => insertCard(this.db, value.card));
	}
	registerIfAbsent(key, value) {
		this.validatePayload(key, value);
		return runSqliteImmediateTransactionSync(this.db, () => {
			if (this.db.prepare("SELECT 1 FROM workboard_cards WHERE id = ?").get(key)) return false;
			insertCard(this.db, value.card);
			return true;
		});
	}
	registerIfUpdatedAt(key, value, expectedUpdatedAt) {
		this.validatePayload(key, value);
		return runSqliteImmediateTransactionSync(this.db, () => {
			if (!this.matchesUpdatedAt(key, expectedUpdatedAt)) return false;
			insertCard(this.db, value.card);
			return true;
		});
	}
	claimIfOwnerAvailable(key, value, expectedUpdatedAt, ownerId, now) {
		this.validatePayload(key, value);
		return runSqliteImmediateTransactionSync(this.db, () => {
			const query = getNodeSqliteKysely(this.db);
			const current = executeSqliteQueryTakeFirstSync(this.db, query.selectFrom("workboard_cards").selectAll().where("id", "=", key).where("updated_at", "=", expectedUpdatedAt));
			if (!current) return "conflict";
			const candidates = query.selectFrom("workboard_cards").select([
				"status",
				"agent_id",
				"claim_json",
				"execution_id",
				"execution_status"
			]).where("id", "!=", key).where((eb) => eb.or([eb("archived_at", "is", null), eb("archived_at", "=", 0)])).where((eb) => eb.or([
				eb("status", "=", "running"),
				eb.and([eb("execution_id", "!=", ""), eb("execution_status", "=", "running")]),
				eb.and([eb("claim_json", "is not", null), eb("status", "!=", "done")])
			]));
			for (const row of iterateSqliteQuerySync(this.db, candidates)) {
				const card = {
					status: requiredString(row, "status"),
					agentId: stringValue(row, "agent_id"),
					metadata: { claim: parseJson(row.claim_json) },
					execution: stringValue(row, "execution_id") ? { status: requiredString(row, "execution_status") } : void 0
				};
				if (workboardCardConsumesOwnerSlot(card, now) && workboardCardSlotOwner(card) === ownerId) return "owner_busy";
			}
			readCard(this.db, current);
			insertCard(this.db, value.card);
			return "updated";
		});
	}
	deleteIfUpdatedAt(key, expectedUpdatedAt) {
		return runSqliteImmediateTransactionSync(this.db, () => {
			if (!this.matchesUpdatedAt(key, expectedUpdatedAt)) return false;
			this.deleteCard(key);
			return true;
		});
	}
	lookup(key) {
		const row = this.db.prepare("SELECT * FROM workboard_cards WHERE id = ?").get(key);
		return row ? {
			version: 1,
			card: readCard(this.db, row)
		} : void 0;
	}
	delete(key) {
		return runSqliteImmediateTransactionSync(this.db, () => this.deleteCard(key)).changes > 0;
	}
	deleteCard(key) {
		this.db.prepare(`
          DELETE FROM workboard_attachment_blobs
          WHERE attachment_id IN (
            SELECT id FROM workboard_card_attachments WHERE card_id = ?
          )
        `).run(key);
		return this.db.prepare("DELETE FROM workboard_cards WHERE id = ?").run(key);
	}
	workerContextCardIds(scope) {
		const query = getNodeSqliteKysely(this.db);
		const doneParents = new Set(scope.parentIds.length === 0 ? [] : Array.from(iterateSqliteQuerySync(this.db, query.selectFrom("workboard_cards").select("id").where("id", "in", sqliteStringSet(scope.parentIds)).where("status", "=", "done")), (row) => requiredString(row, "id")));
		const parents = scope.parentIds.filter((id) => doneParents.has(id)).slice(-6);
		const recent = scope.agentId ? Array.from(iterateSqliteQuerySync(this.db, query.selectFrom("workboard_cards").select("id").where("board_id", "=", scope.boardId).where("agent_id", "=", scope.agentId).where("status", "=", "done").where("id", "!=", scope.cardId).orderBy("updated_at", "desc").orderBy("position", "asc").orderBy("created_at", "asc").orderBy("id", "asc").limit(5)), (row) => requiredString(row, "id")) : [];
		return [.../* @__PURE__ */ new Set([...parents, ...recent])];
	}
	entries(scope) {
		return scope?.kind === "worker-context" ? runSqliteDeferredTransactionSync(this.db, () => this.readEntries(scope)) : this.readEntries(scope);
	}
	readEntries(scope) {
		let query = getNodeSqliteKysely(this.db).selectFrom("workboard_cards").selectAll().orderBy("created_at", "asc").orderBy("id", "asc");
		if (scope?.kind === "board") query = query.where("board_id", "=", scope.boardId);
		else if (scope?.kind === "session") query = query.where((eb) => eb.or([eb("session_key", "=", scope.sessionKey), eb.and([
			eb.or([eb("session_key", "is", null), eb("session_key", "=", "")]),
			eb("execution_id", "!=", ""),
			eb("execution_session_key", "=", scope.sessionKey)
		])]));
		else if (scope?.kind === "worker-context") {
			const ids = this.workerContextCardIds(scope);
			if (ids.length === 0) return [];
			query = query.where("id", "in", sqliteStringSet(ids));
		}
		const rows = Array.from(iterateSqliteQuerySync(this.db, query));
		if (scope !== void 0 && rows.length === 0) return [];
		const preloaded = loadCardChildRows(this.db, scope === void 0 ? void 0 : rows.map((row) => requiredString(row, "id")));
		return rows.map((row) => ({
			key: requiredString(row, "id"),
			value: {
				version: 1,
				card: readCard(this.db, row, preloaded)
			}
		}));
	}
	listCardStatuses(ids) {
		if (ids.length === 0) return [];
		const query = getNodeSqliteKysely(this.db).selectFrom("workboard_cards").select(["id", "status"]).where("id", "in", sqliteStringSet(ids));
		return Array.from(iterateSqliteQuerySync(this.db, query), (row) => ({
			id: requiredString(row, "id"),
			status: requiredString(row, "status")
		}));
	}
	listBoardAggregates() {
		return this.db.prepare(`
          SELECT
            board_id,
            status,
            COUNT(*) AS total,
            SUM(CASE WHEN archived_at IS NOT NULL AND archived_at <> 0 THEN 1 ELSE 0 END) AS archived,
            MAX(updated_at) AS updated_at
          FROM workboard_cards
          GROUP BY board_id, status
          ORDER BY board_id ASC, status ASC
        `).all().map((row) => ({
			boardId: requiredString(row, "board_id"),
			status: requiredString(row, "status"),
			total: requiredNumber(row, "total"),
			archived: requiredNumber(row, "archived"),
			updatedAt: requiredNumber(row, "updated_at")
		}));
	}
	listStatsAggregates(boardId) {
		let query = getNodeSqliteKysely(this.db).selectFrom("workboard_cards").select((eb) => [
			"status",
			"agent_id",
			eb.fn.countAll().as("total"),
			eb.fn.sum(eb.case().when(eb.and([eb("archived_at", "is not", null), eb("archived_at", "!=", 0)])).then(1).else(0).end()).as("archived"),
			eb.fn.max("updated_at").as("updated_at"),
			eb.fn.min(eb.case().when(eb.and([eb("status", "=", "ready"), eb.or([eb("archived_at", "is", null), eb("archived_at", "=", 0)])])).then(eb.ref("updated_at")).else(null).end()).as("oldest_ready_at")
		]).groupBy(["status", "agent_id"]);
		if (boardId !== void 0) query = query.where("board_id", "=", boardId);
		return Array.from(iterateSqliteQuerySync(this.db, query), (row) => ({
			status: requiredString(row, "status"),
			agentId: stringValue(row, "agent_id"),
			total: requiredNumber(row, "total"),
			archived: requiredNumber(row, "archived"),
			updatedAt: requiredNumber(row, "updated_at"),
			oldestReadyAt: numberValue(row, "oldest_ready_at")
		}));
	}
	hasCards(boardId) {
		return executeSqliteQueryTakeFirstSync(this.db, getNodeSqliteKysely(this.db).selectFrom("workboard_cards").select("id").where("board_id", "=", boardId).limit(1)) !== void 0;
	}
};
function readBoard(row) {
	const kind = stringValue(row, "kind");
	if (kind !== void 0 && kind !== "cards" && kind !== "sessions") throw new Error("invalid workboard board kind");
	const defaultWorkspace = parseJson(row.default_workspace_json);
	const orchestration = parseJson(row.orchestration_json);
	return {
		version: 1,
		board: definedFields({
			id: requiredString(row, "id"),
			...kind ? { kind } : {},
			...kind === "sessions" ? { sessions: normalizeWorkboardSessionsBoardSpec(parseJson(row.sessions_spec)) } : {},
			name: stringValue(row, "name"),
			description: stringValue(row, "description"),
			icon: stringValue(row, "icon"),
			color: stringValue(row, "color"),
			automationJobId: stringValue(row, "automation_job_id"),
			...defaultWorkspace ? { defaultWorkspace } : {},
			...orchestration ? { orchestration } : {},
			createdAt: requiredNumber(row, "created_at"),
			updatedAt: requiredNumber(row, "updated_at"),
			archivedAt: numberValue(row, "archived_at")
		})
	};
}
var WorkboardSqliteBoardStore = class {
	constructor(db) {
		this.db = db;
		this.rowsQuery = getNodeSqliteKysely(db).selectFrom("workboard_boards").selectAll();
	}
	register(key, value) {
		if (value.version !== 1 || value.board.id !== key) throw new Error("invalid workboard board payload");
		const board = value.board;
		const { compiled, bind } = compileSqliteQueryBindings((parameter) => getNodeSqliteKysely(this.db).insertInto("workboard_boards").values({
			id: parameter(() => board.id),
			name: parameter(() => bindNull(board.name)),
			description: parameter(() => bindNull(board.description)),
			icon: parameter(() => bindNull(board.icon)),
			color: parameter(() => bindNull(board.color)),
			kind: parameter(() => bindNull(board.kind)),
			sessions_spec: parameter(() => board.kind === "sessions" ? jsonValue(normalizeWorkboardSessionsBoardSpec(board.sessions)) : null),
			automation_job_id: parameter(() => bindNull(board.automationJobId)),
			default_workspace_json: parameter(() => jsonValue(board.defaultWorkspace)),
			orchestration_json: parameter(() => jsonValue(board.orchestration)),
			created_at: parameter(() => board.createdAt),
			updated_at: parameter(() => board.updatedAt),
			archived_at: parameter(() => bindNull(board.archivedAt))
		}).onConflict((conflict) => conflict.column("id").doUpdateSet((eb) => ({
			name: eb.ref("excluded.name"),
			description: eb.ref("excluded.description"),
			icon: eb.ref("excluded.icon"),
			color: eb.ref("excluded.color"),
			automation_job_id: eb.ref("excluded.automation_job_id"),
			default_workspace_json: eb.ref("excluded.default_workspace_json"),
			orchestration_json: eb.ref("excluded.orchestration_json"),
			created_at: eb.ref("excluded.created_at"),
			updated_at: eb.ref("excluded.updated_at"),
			archived_at: eb.ref("excluded.archived_at")
		}))));
		const statement = this.db.prepare(compiled.sql);
		runSqliteImmediateTransactionSync(this.db, () => {
			const existing = this.lookup(key)?.board;
			if (existing && (existing.kind ?? "cards") !== (board.kind ?? "cards")) throw new Error("board kind cannot be changed after creation.");
			if (board.kind === "sessions" && !existing) {
				const card = executeSqliteQueryTakeFirstSync(this.db, getNodeSqliteKysely(this.db).selectFrom("workboard_cards").select("id").where("board_id", "=", key).limit(1));
				if (key === "default" || card) throw new Error("board kind cannot be changed after creation.");
			}
			statement.run(...bind());
		});
	}
	lookup(key) {
		const row = executeSqliteQueryTakeFirstSync(this.db, this.rowsQuery.where("id", "=", key));
		return row ? readBoard(row) : void 0;
	}
	delete(key) {
		return (executeSqliteQuerySync(this.db, getNodeSqliteKysely(this.db).deleteFrom("workboard_boards").where("id", "=", key)).numAffectedRows ?? 0n) > 0n;
	}
	entries() {
		return Array.from(iterateSqliteQuerySync(this.db, this.rowsQuery.orderBy("id", "asc")), (row) => ({
			key: requiredString(row, "id"),
			value: readBoard(row)
		}));
	}
};
function readSubscription(row) {
	const eventKinds = parseJson(row.event_kinds_json);
	const deliveredEventIds = parseJson(row.delivered_event_ids_json);
	return {
		version: 1,
		subscription: definedFields({
			id: requiredString(row, "id"),
			boardId: requiredString(row, "board_id"),
			cardId: stringValue(row, "card_id"),
			sessionKey: stringValue(row, "session_key"),
			runId: stringValue(row, "run_id"),
			target: stringValue(row, "target"),
			...eventKinds ? { eventKinds } : {},
			lastEventAt: numberValue(row, "last_event_at"),
			lastEventId: stringValue(row, "last_event_id"),
			lastEventSequence: numberValue(row, "last_event_sequence"),
			...deliveredEventIds ? { deliveredEventIds } : {},
			createdAt: requiredNumber(row, "created_at"),
			updatedAt: requiredNumber(row, "updated_at")
		})
	};
}
var WorkboardSqliteSubscriptionStore = class {
	constructor(db) {
		this.db = db;
		this.rowsQuery = getNodeSqliteKysely(db).selectFrom("workboard_notification_subscriptions").selectAll();
	}
	register(key, value) {
		if (value.version !== 1 || value.subscription.id !== key) throw new Error("invalid workboard notification subscription payload");
		const subscription = value.subscription;
		const { compiled, bind } = compileSqliteQueryBindings((parameter) => getNodeSqliteKysely(this.db).insertInto("workboard_notification_subscriptions").values({
			id: parameter(() => subscription.id),
			board_id: parameter(() => subscription.boardId),
			card_id: parameter(() => bindNull(subscription.cardId)),
			session_key: parameter(() => bindNull(subscription.sessionKey)),
			run_id: parameter(() => bindNull(subscription.runId)),
			target: parameter(() => bindNull(subscription.target)),
			event_kinds_json: parameter(() => jsonValue(subscription.eventKinds)),
			last_event_at: parameter(() => bindNull(subscription.lastEventAt)),
			last_event_id: parameter(() => bindNull(subscription.lastEventId)),
			last_event_sequence: parameter(() => bindNull(subscription.lastEventSequence)),
			delivered_event_ids_json: parameter(() => jsonValue(subscription.deliveredEventIds)),
			created_at: parameter(() => subscription.createdAt),
			updated_at: parameter(() => subscription.updatedAt)
		}).onConflict((conflict) => conflict.column("id").doUpdateSet((eb) => ({
			board_id: eb.ref("excluded.board_id"),
			card_id: eb.ref("excluded.card_id"),
			session_key: eb.ref("excluded.session_key"),
			run_id: eb.ref("excluded.run_id"),
			target: eb.ref("excluded.target"),
			event_kinds_json: eb.ref("excluded.event_kinds_json"),
			last_event_at: eb.ref("excluded.last_event_at"),
			last_event_id: eb.ref("excluded.last_event_id"),
			last_event_sequence: eb.ref("excluded.last_event_sequence"),
			delivered_event_ids_json: eb.ref("excluded.delivered_event_ids_json"),
			created_at: eb.ref("excluded.created_at"),
			updated_at: eb.ref("excluded.updated_at")
		}))));
		this.db.prepare(compiled.sql).run(...bind());
	}
	lookup(key) {
		const row = executeSqliteQueryTakeFirstSync(this.db, this.rowsQuery.where("id", "=", key));
		return row ? readSubscription(row) : void 0;
	}
	delete(key) {
		return this.db.prepare("DELETE FROM workboard_notification_subscriptions WHERE id = ?").run(key).changes > 0;
	}
	entries(options = {}) {
		let query = this.rowsQuery;
		if (options.boardId) query = query.where("board_id", "=", options.boardId);
		if (options.cardId) query = query.where("card_id", "=", options.cardId);
		return Array.from(iterateSqliteQuerySync(this.db, query.orderBy("created_at", "asc").orderBy("id", "asc")), (row) => ({
			key: requiredString(row, "id"),
			value: readSubscription(row)
		}));
	}
};
function readPersistedAttachment(row) {
	return {
		version: 1,
		attachment: readAttachment(row),
		contentBase64: blobToBase64(row.content)
	};
}
var WorkboardSqliteAttachmentStore = class {
	constructor(db) {
		this.db = db;
		this.rowsQuery = getNodeSqliteKysely(db).selectFrom("workboard_card_attachments as a").innerJoin("workboard_attachment_blobs as b", "b.attachment_id", "a.id").selectAll("a").select("b.content");
	}
	register(key, value) {
		if (value.version !== 1 || value.attachment.id !== key) throw new Error("invalid workboard attachment payload");
		const attachment = value.attachment;
		this.db.prepare(`
          INSERT INTO workboard_attachment_blobs (attachment_id, content)
          VALUES (?, ?)
          ON CONFLICT(attachment_id) DO UPDATE SET content = excluded.content
        `).run(attachment.id, Buffer.from(value.contentBase64, "base64"));
	}
	lookup(key) {
		const row = executeSqliteQueryTakeFirstSync(this.db, this.rowsQuery.where("a.id", "=", key));
		return row ? readPersistedAttachment(row) : void 0;
	}
	delete(key) {
		return runSqliteImmediateTransactionSync(this.db, () => {
			this.db.prepare("DELETE FROM workboard_attachment_blobs WHERE attachment_id = ?").run(key);
			return this.db.prepare("DELETE FROM workboard_card_attachments WHERE id = ?").run(key);
		}).changes > 0;
	}
	entries() {
		return Array.from(iterateSqliteQuerySync(this.db, this.rowsQuery.orderBy("a.created_at", "asc").orderBy("a.id", "asc")), (row) => ({
			key: requiredString(row, "id"),
			value: readPersistedAttachment(row)
		}));
	}
};
function createWorkboardSqliteKernel(dbPath, retainClose) {
	const { db, close } = createWorkboardDatabase(dbPath, retainClose);
	const boards = new WorkboardSqliteBoardStore(db);
	return {
		cards: new WorkboardSqliteCardStore(db),
		boards,
		sessionsBoard: new WorkboardSqliteSessionsBoardStore(db, boards),
		subscriptions: new WorkboardSqliteSubscriptionStore(db),
		attachments: new WorkboardSqliteAttachmentStore(db),
		dataVersion: () => requiredNumber(db.prepare("PRAGMA data_version").get(), "data_version"),
		close
	};
}
//#endregion
//#region extensions/workboard/src/sqlite-store.worker.ts
function createSqliteWorkerBackend(_input, context) {
	const initial = createWorkboardSqliteKernel(context.databasePath);
	const connections = /* @__PURE__ */ new Map();
	connections.set(0, {
		kernel: initial,
		close: initial.close
	});
	let nextConnection = 0;
	function execute(command) {
		const connection = connections.get(command.input.connection);
		if (!connection) throw new Error("Workboard SQLite connection is closed.");
		if (command.type === "connection.close") {
			connection.close();
			connections.delete(command.input.connection);
			return;
		}
		const kernel = connection.kernel;
		if (!kernel) throw new Error("Workboard SQLite connection initialization failed.");
		switch (command.type) {
			case "dataVersion": return kernel.dataVersion();
			case "cards.register": return kernel.cards.register(...command.input.args);
			case "cards.registerIfAbsent": return kernel.cards.registerIfAbsent(...command.input.args);
			case "cards.registerIfUpdatedAt": return kernel.cards.registerIfUpdatedAt(...command.input.args);
			case "cards.claimIfOwnerAvailable": return kernel.cards.claimIfOwnerAvailable(...command.input.args);
			case "cards.deleteIfUpdatedAt": return kernel.cards.deleteIfUpdatedAt(...command.input.args);
			case "cards.lookup": return kernel.cards.lookup(...command.input.args);
			case "cards.delete": return kernel.cards.delete(...command.input.args);
			case "cards.entries": return kernel.cards.entries(...command.input.args);
			case "cards.listCardStatuses": return kernel.cards.listCardStatuses(...command.input.args);
			case "cards.listBoardAggregates": return kernel.cards.listBoardAggregates(...command.input.args);
			case "cards.listStatsAggregates": return kernel.cards.listStatsAggregates(...command.input.args);
			case "cards.hasCards": return kernel.cards.hasCards(...command.input.args);
			case "boards.register": return kernel.boards.register(...command.input.args);
			case "boards.lookup": return kernel.boards.lookup(...command.input.args);
			case "boards.delete": return kernel.boards.delete(...command.input.args);
			case "boards.entries": return kernel.boards.entries(...command.input.args);
			case "sessionsBoard.get": return kernel.sessionsBoard.get(...command.input.args);
			case "sessionsBoard.update": return kernel.sessionsBoard.update(...command.input.args);
			case "sessionsBoard.listPlacements": return kernel.sessionsBoard.listPlacements(...command.input.args);
			case "sessionsBoard.repairPlacements": return kernel.sessionsBoard.repairPlacements(...command.input.args);
			case "sessionsBoard.writePlacement": return kernel.sessionsBoard.writePlacement(...command.input.args);
			case "subscriptions.register": return kernel.subscriptions.register(...command.input.args);
			case "subscriptions.lookup": return kernel.subscriptions.lookup(...command.input.args);
			case "subscriptions.delete": return kernel.subscriptions.delete(...command.input.args);
			case "subscriptions.entries": return kernel.subscriptions.entries(...command.input.args);
			case "attachments.register": return kernel.attachments.register(...command.input.args);
			case "attachments.lookup": return kernel.attachments.lookup(...command.input.args);
			case "attachments.delete": return kernel.attachments.delete(...command.input.args);
			case "attachments.entries": return kernel.attachments.entries(...command.input.args);
		}
	}
	return {
		execute(command) {
			if (command.type === "connection.open") {
				const connection = ++nextConnection;
				try {
					const unclaimed = connections.get(0);
					connections.delete(0);
					const kernel = unclaimed?.kernel ?? createWorkboardSqliteKernel(context.databasePath, (close) => {
						connections.set(connection, { close });
					});
					connections.set(connection, {
						kernel,
						close: kernel.close
					});
					return {
						ok: true,
						value: {
							connection,
							dataVersion: kernel.dataVersion()
						}
					};
				} catch (error) {
					const owned = connections.get(connection);
					if (owned) try {
						owned.close();
						connections.delete(connection);
					} catch {
						return {
							ok: false,
							failure: {
								...encodeWorkboardSqliteFailure(error),
								cleanupConnection: connection
							}
						};
					}
					return {
						ok: false,
						failure: encodeWorkboardSqliteFailure(error)
					};
				}
			}
			try {
				return {
					ok: true,
					value: execute(command)
				};
			} catch (error) {
				return {
					ok: false,
					failure: encodeWorkboardSqliteFailure(error)
				};
			}
		},
		close() {
			const failures = [];
			for (const [id, kernel] of connections) try {
				kernel.close();
				connections.delete(id);
			} catch (error) {
				failures.push(error);
			}
			if (failures.length) throw new AggregateError(failures, "Workboard SQLite cleanup failed");
		}
	};
}
//#endregion
export { createSqliteWorkerBackend };
