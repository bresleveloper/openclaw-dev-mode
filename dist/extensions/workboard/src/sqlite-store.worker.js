import { c as isRecord } from "../../../record-coerce-TIsquoVR.mjs";
import { a as executeSqliteQueryTakeFirstSync, d as sqliteStringSet, i as executeSqliteQuerySync, o as getNodeSqliteKysely, s as iterateSqliteQuerySync, t as compileSqliteQueryBindings } from "../../../kysely-sync-9fPQaMlh.mjs";
import { a as runSqliteImmediateTransactionSync } from "../../../sqlite-transaction-CpDyZPQ0.mjs";
import { f as requestSqliteWorkerOperationAdmission } from "../../../sqlite-worker-operation-admission-puNZKEvP.mjs";
import { a as runEngineWorkerWrite, i as runEngineStoreReadSnapshot } from "../../../open-L_IbZFu2.mjs";
import "../../../string-coerce-runtime-BbIJhy7G.mjs";
import "../../../sqlite-worker-runtime-Da3qtgYL.mjs";
import { t as normalizeSessionKeyForComparison } from "../../../session-key-comparison-DHDhHc25.mjs";
import "../../../session-key-runtime-fFI27U8l.mjs";
import "../../../database-engine-worker-runtime-LUHighaR.mjs";
import { t as createWorkboardDatabase } from "../../../sqlite-store-schema-BlzFlT6H.mjs";
import { G as workboardCardConsumesOwnerSlot, J as normalizeWorkboardSessionsBoardSpec, K as workboardCardSlotOwner, Y as patchWorkboardSessionsBoardSpec, g as normalizeLaunchState, q as createDefaultWorkboardSessionsBoardSpec, t as encodeWorkboardSqliteFailure } from "../../../sqlite-store-errors-BajGRUMO.mjs";
import { t as definedFields } from "../../../record-fields-BHIzSIrv.mjs";
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
	const readChildren = (table, decode) => {
		const rows = childRows(db, table, cardId, preloaded).map((child) => definedFields(decode(child)));
		return rows.length ? rows : void 0;
	};
	const attempts = readChildren("workboard_card_attempts", (child) => ({
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
	}));
	const comments = readChildren("workboard_card_comments", (child) => ({
		id: requiredString(child, "id"),
		body: requiredString(child, "body"),
		createdAt: requiredNumber(child, "created_at"),
		updatedAt: numberValue(child, "updated_at")
	}));
	const links = readChildren("workboard_card_links", (child) => ({
		id: requiredString(child, "id"),
		type: requiredString(child, "type"),
		createdAt: requiredNumber(child, "created_at"),
		targetCardId: stringValue(child, "target_card_id"),
		title: stringValue(child, "title"),
		url: stringValue(child, "url")
	}));
	const proof = readChildren("workboard_card_proof", (child) => ({
		id: requiredString(child, "id"),
		status: requiredString(child, "status"),
		createdAt: requiredNumber(child, "created_at"),
		label: stringValue(child, "label"),
		command: stringValue(child, "command"),
		url: stringValue(child, "url"),
		note: stringValue(child, "note")
	}));
	const artifacts = readChildren("workboard_card_artifacts", (child) => ({
		id: requiredString(child, "id"),
		createdAt: requiredNumber(child, "created_at"),
		label: stringValue(child, "label"),
		url: stringValue(child, "url"),
		path: stringValue(child, "path"),
		mimeType: stringValue(child, "mime_type")
	}));
	const attachments = childRows(db, "workboard_card_attachments", cardId, preloaded).map(readAttachment);
	const workerLogs = readChildren("workboard_worker_logs", (child) => ({
		id: requiredString(child, "id"),
		createdAt: requiredNumber(child, "created_at"),
		level: requiredString(child, "level"),
		message: requiredString(child, "message"),
		sessionKey: stringValue(child, "session_key"),
		runId: stringValue(child, "run_id")
	}));
	const diagnostics = readChildren("workboard_card_diagnostics", (child) => ({
		kind: requiredString(child, "kind"),
		severity: requiredString(child, "severity"),
		title: requiredString(child, "title"),
		detail: requiredString(child, "detail"),
		firstSeenAt: requiredNumber(child, "first_seen_at"),
		lastSeenAt: requiredNumber(child, "last_seen_at"),
		count: requiredNumber(child, "count"),
		actions: parseJson(child.actions_json) ?? []
	}));
	const notifications = readChildren("workboard_card_notifications", (child) => ({
		id: requiredString(child, "id"),
		kind: requiredString(child, "kind"),
		createdAt: requiredNumber(child, "created_at"),
		message: requiredString(child, "message"),
		sequence: numberValue(child, "sequence"),
		sessionKey: stringValue(child, "session_key"),
		runId: stringValue(child, "run_id")
	}));
	const protocol = workerProtocolRow(db, cardId, preloaded);
	const automation = parseJson(row.automation_json);
	if (isRecord(automation)) {
		const launch = normalizeLaunchState(automation.launch);
		if (launch) automation.launch = launch;
		else delete automation.launch;
	}
	const claim = parseJson(row.claim_json);
	const stale = parseJson(row.stale_json);
	return optional(definedFields({
		attempts,
		comments,
		links,
		proof,
		artifacts,
		attachments: attachments.length > 0 ? attachments : void 0,
		workerLogs,
		workerProtocol: protocol ? definedFields({
			state: requiredString(protocol, "state"),
			updatedAt: requiredNumber(protocol, "updated_at"),
			detail: stringValue(protocol, "detail")
		}) : void 0,
		automation: automation || void 0,
		claim: claim || void 0,
		diagnostics,
		notifications,
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
//#region extensions/workboard/src/sqlite-store-session-links.ts
const ASCII_KEY_CHARACTERS = Array.from({ length: 94 }, (_, index) => String.fromCharCode(33 + index)).join("");
function readSessionLinkedCardIds(db, scope) {
	const query = getNodeSqliteKysely(db);
	const key = normalizeSessionKeyForComparison(scope.sessionKey);
	const folded = key.toLowerCase();
	const ascii = /^[\x20-\x7e]*$/.test(key);
	const selected = /* @__PURE__ */ new Set();
	let cards = query.selectFrom("workboard_cards").select([
		"id",
		"session_key",
		"execution_id",
		"execution_session_key"
	]);
	if (ascii) cards = cards.where((eb) => eb.or(["session_key", "execution_session_key"].flatMap((column) => [eb(eb.fn("lower", [eb.fn("trim", [column])]), "=", folded), eb(eb.fn("trim", [eb.ref(column), eb.val(ASCII_KEY_CHARACTERS)]), "!=", "")])));
	if (scope.boardId !== void 0) cards = cards.where("board_id", "=", scope.boardId);
	for (const row of iterateSqliteQuerySync(db, cards)) if ([stringValue(row, "session_key"), stringValue(row, "execution_id") ? stringValue(row, "execution_session_key") : void 0].some((candidate) => candidate && normalizeSessionKeyForComparison(candidate) === key)) selected.add(requiredString(row, "id"));
	for (const table of ["workboard_card_attempts", "workboard_card_events"]) {
		let links = query.selectFrom(table).select(["card_id", "session_key"]);
		if (ascii) links = links.where((eb) => eb.or([eb(eb.fn("lower", [eb.fn("trim", ["session_key"])]), "=", folded), eb(eb.fn("trim", [eb.ref("session_key"), eb.val(ASCII_KEY_CHARACTERS)]), "!=", "")]));
		if (scope.boardId !== void 0) links = links.where("card_id", "in", query.selectFrom("workboard_cards").select("id").where("board_id", "=", scope.boardId));
		for (const row of iterateSqliteQuerySync(db, links)) {
			const candidate = stringValue(row, "session_key");
			if (candidate && normalizeSessionKeyForComparison(candidate) === key) selected.add(requiredString(row, "card_id"));
		}
	}
	return [...selected];
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
		const expected = JSON.stringify(expectedSpec);
		return runSqliteImmediateTransactionSync(this.db, () => {
			const board = this.get(boardId);
			if (JSON.stringify(board.sessions) !== expected) return false;
			if (!board.sessions.columns.some((column) => column.id === placement.columnId)) throw new Error(`Unknown sessions board column: ${placement.columnId}`);
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
function prepareWorkboardUpsert(db, table, fields, preserved = []) {
	const { compiled, bind } = compileSqliteQueryBindings((parameter) => getNodeSqliteKysely(db).insertInto(table).values(Object.fromEntries(Object.entries(fields).map(([key, read]) => [key, parameter(read)]))).onConflict((conflict) => conflict.column("id").doUpdateSet((eb) => Object.fromEntries(Object.keys(fields).filter((key) => key !== "id" && !preserved.includes(key)).map((key) => [key, eb.ref(`excluded.${key}`)])))));
	const statement = db.prepare(compiled.sql);
	return () => {
		statement.run(...bind());
	};
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
	prepareWorkboardUpsert(db, "workboard_cards", {
		id: () => card.id,
		board_id: () => cardBoardId(card),
		title: () => card.title,
		notes: () => bindNull(card.notes),
		status: () => card.status,
		priority: () => card.priority,
		agent_id: () => bindNull(card.agentId),
		session_key: () => bindNull(card.sessionKey),
		run_id: () => bindNull(card.runId),
		source_url: () => bindNull(card.sourceUrl),
		position: () => card.position,
		created_at: () => card.createdAt,
		updated_at: () => card.updatedAt,
		started_at: () => bindNull(card.startedAt),
		completed_at: () => bindNull(card.completedAt),
		execution_id: () => bindNull(execution?.id),
		execution_kind: () => bindNull(execution?.kind),
		execution_engine: () => bindNull(execution?.engine),
		execution_mode: () => bindNull(execution?.mode),
		execution_status: () => bindNull(execution?.status),
		execution_model: () => bindNull(execution?.model),
		execution_session_key: () => bindNull(execution?.sessionKey),
		execution_run_id: () => bindNull(execution?.runId),
		execution_started_at: () => bindNull(execution?.startedAt),
		execution_updated_at: () => bindNull(execution?.updatedAt),
		automation_json: () => jsonValue(metadata?.automation),
		claim_json: () => jsonValue(metadata?.claim),
		template_id: () => bindNull(metadata?.templateId),
		archived_at: () => bindNull(metadata?.archivedAt),
		stale_json: () => jsonValue(metadata?.stale),
		lifecycle_status_source_updated_at: () => bindNull(metadata?.lifecycleStatusSourceUpdatedAt),
		failure_count: () => bindNull(metadata?.failureCount)
	})();
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
function keyedEntries(rows, read) {
	return Array.from(rows, (row) => ({
		key: requiredString(row, "id"),
		value: read(row)
	}));
}
var WorkboardSqliteCardStore = class {
	constructor(db) {
		this.db = db;
	}
	matchesUpdatedAt(key, expectedUpdatedAt) {
		const current = executeSqliteQueryTakeFirstSync(this.db, getNodeSqliteKysely(this.db).selectFrom("workboard_cards").select("updated_at").where("id", "=", key));
		return current !== void 0 && numberValue(current, "updated_at") === expectedUpdatedAt;
	}
	register(_key, value) {
		runSqliteImmediateTransactionSync(this.db, () => insertCard(this.db, value.card));
	}
	registerIfAbsent(key, value) {
		return runSqliteImmediateTransactionSync(this.db, () => {
			if (this.db.prepare("SELECT 1 FROM workboard_cards WHERE id = ?").get(key)) return false;
			insertCard(this.db, value.card);
			return true;
		});
	}
	registerIfUpdatedAt(key, value, expectedUpdatedAt) {
		return runSqliteImmediateTransactionSync(this.db, () => {
			if (!this.matchesUpdatedAt(key, expectedUpdatedAt)) return false;
			insertCard(this.db, value.card);
			return true;
		});
	}
	claimIfOwnerAvailable(key, value, expectedUpdatedAt, ownerId, now) {
		return runSqliteImmediateTransactionSync(this.db, () => {
			const query = getNodeSqliteKysely(this.db);
			if (!executeSqliteQueryTakeFirstSync(this.db, query.selectFrom("workboard_cards").selectAll().where("id", "=", key).where("updated_at", "=", expectedUpdatedAt))) return "conflict";
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
		return scope?.kind === "worker-context" || scope?.kind === "session-links" ? runEngineStoreReadSnapshot(this.db, () => this.readEntries(scope)) : this.readEntries(scope);
	}
	readEntries(scope) {
		let query = getNodeSqliteKysely(this.db).selectFrom("workboard_cards").selectAll().orderBy("created_at", "asc").orderBy("id", "asc");
		if (scope?.kind === "board") query = query.where("board_id", "=", scope.boardId);
		else if (scope?.kind === "session") query = query.where((eb) => eb.or([eb("session_key", "=", scope.sessionKey), eb.and([
			eb.or([eb("session_key", "is", null), eb("session_key", "=", "")]),
			eb("execution_id", "!=", ""),
			eb("execution_session_key", "=", scope.sessionKey)
		])]));
		else if (scope?.kind === "session-links") {
			const ids = readSessionLinkedCardIds(this.db, scope);
			if (ids.length === 0) return [];
			query = query.where("id", "in", sqliteStringSet(ids));
		} else if (scope?.kind === "worker-context") {
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
		const board = value.board;
		const write = prepareWorkboardUpsert(this.db, "workboard_boards", {
			id: () => board.id,
			name: () => bindNull(board.name),
			description: () => bindNull(board.description),
			icon: () => bindNull(board.icon),
			color: () => bindNull(board.color),
			kind: () => bindNull(board.kind),
			sessions_spec: () => board.kind === "sessions" ? jsonValue(normalizeWorkboardSessionsBoardSpec(board.sessions)) : null,
			automation_job_id: () => bindNull(board.automationJobId),
			default_workspace_json: () => jsonValue(board.defaultWorkspace),
			orchestration_json: () => jsonValue(board.orchestration),
			created_at: () => board.createdAt,
			updated_at: () => board.updatedAt,
			archived_at: () => bindNull(board.archivedAt)
		}, ["kind", "sessions_spec"]);
		runSqliteImmediateTransactionSync(this.db, () => {
			const existing = this.lookup(key)?.board;
			if (existing && (existing.kind ?? "cards") !== (board.kind ?? "cards")) throw new Error("board kind cannot be changed after creation.");
			if (board.kind === "sessions" && !existing) {
				const card = executeSqliteQueryTakeFirstSync(this.db, getNodeSqliteKysely(this.db).selectFrom("workboard_cards").select("id").where("board_id", "=", key).limit(1));
				if (key === "default" || card) throw new Error("board kind cannot be changed after creation.");
			}
			write();
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
		return keyedEntries(iterateSqliteQuerySync(this.db, this.rowsQuery.orderBy("id", "asc")), readBoard);
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
	register(_key, value) {
		const subscription = value.subscription;
		prepareWorkboardUpsert(this.db, "workboard_notification_subscriptions", {
			id: () => subscription.id,
			board_id: () => subscription.boardId,
			card_id: () => bindNull(subscription.cardId),
			session_key: () => bindNull(subscription.sessionKey),
			run_id: () => bindNull(subscription.runId),
			target: () => bindNull(subscription.target),
			event_kinds_json: () => jsonValue(subscription.eventKinds),
			last_event_at: () => bindNull(subscription.lastEventAt),
			last_event_id: () => bindNull(subscription.lastEventId),
			last_event_sequence: () => bindNull(subscription.lastEventSequence),
			delivered_event_ids_json: () => jsonValue(subscription.deliveredEventIds),
			created_at: () => subscription.createdAt,
			updated_at: () => subscription.updatedAt
		})();
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
		return keyedEntries(iterateSqliteQuerySync(this.db, query.orderBy("created_at", "asc").orderBy("id", "asc")), readSubscription);
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
	register(_key, value) {
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
		return keyedEntries(iterateSqliteQuerySync(this.db, this.rowsQuery.orderBy("a.created_at", "asc").orderBy("a.id", "asc")), readPersistedAttachment);
	}
};
function createWorkboardSqliteKernel(dbPath, retainClose, postgresInput) {
	const { db, close } = createWorkboardDatabase(dbPath, retainClose, postgresInput);
	const boards = new WorkboardSqliteBoardStore(db);
	return {
		cards: new WorkboardSqliteCardStore(db),
		boards,
		sessionsBoard: new WorkboardSqliteSessionsBoardStore(db, boards),
		subscriptions: new WorkboardSqliteSubscriptionStore(db),
		attachments: new WorkboardSqliteAttachmentStore(db),
		close,
		withWriteTransaction: (operation, options) => runSqliteImmediateTransactionSync(db, operation, options)
	};
}
//#endregion
//#region extensions/workboard/src/sqlite-store.worker.ts
function createSqliteWorkerBackend(input, context) {
	const kernel = createWorkboardSqliteKernel(context.databasePath, void 0, input);
	const operations = {
		"cards.register": kernel.cards.register.bind(kernel.cards),
		"cards.registerIfAbsent": kernel.cards.registerIfAbsent.bind(kernel.cards),
		"cards.registerIfUpdatedAt": kernel.cards.registerIfUpdatedAt.bind(kernel.cards),
		"cards.claimIfOwnerAvailable": kernel.cards.claimIfOwnerAvailable.bind(kernel.cards),
		"cards.deleteIfUpdatedAt": kernel.cards.deleteIfUpdatedAt.bind(kernel.cards),
		"cards.lookup": kernel.cards.lookup.bind(kernel.cards),
		"cards.delete": kernel.cards.delete.bind(kernel.cards),
		"cards.entries": kernel.cards.entries.bind(kernel.cards),
		"cards.listCardStatuses": kernel.cards.listCardStatuses.bind(kernel.cards),
		"cards.listBoardAggregates": kernel.cards.listBoardAggregates.bind(kernel.cards),
		"cards.listStatsAggregates": kernel.cards.listStatsAggregates.bind(kernel.cards),
		"cards.hasCards": kernel.cards.hasCards.bind(kernel.cards),
		"boards.register": kernel.boards.register.bind(kernel.boards),
		"boards.lookup": kernel.boards.lookup.bind(kernel.boards),
		"boards.delete": kernel.boards.delete.bind(kernel.boards),
		"boards.entries": kernel.boards.entries.bind(kernel.boards),
		"sessionsBoard.get": kernel.sessionsBoard.get.bind(kernel.sessionsBoard),
		"sessionsBoard.update": kernel.sessionsBoard.update.bind(kernel.sessionsBoard),
		"sessionsBoard.listPlacements": kernel.sessionsBoard.listPlacements.bind(kernel.sessionsBoard),
		"sessionsBoard.repairPlacements": kernel.sessionsBoard.repairPlacements.bind(kernel.sessionsBoard),
		"sessionsBoard.writePlacement": kernel.sessionsBoard.writePlacement.bind(kernel.sessionsBoard),
		"subscriptions.register": kernel.subscriptions.register.bind(kernel.subscriptions),
		"subscriptions.lookup": kernel.subscriptions.lookup.bind(kernel.subscriptions),
		"subscriptions.delete": kernel.subscriptions.delete.bind(kernel.subscriptions),
		"subscriptions.entries": kernel.subscriptions.entries.bind(kernel.subscriptions),
		"attachments.register": kernel.attachments.register.bind(kernel.attachments),
		"attachments.lookup": kernel.attachments.lookup.bind(kernel.attachments),
		"attachments.delete": kernel.attachments.delete.bind(kernel.attachments),
		"attachments.entries": kernel.attachments.entries.bind(kernel.attachments)
	};
	function execute(command) {
		return operations[command.type](...command.input.args);
	}
	return {
		execute(command) {
			try {
				return {
					ok: true,
					value: ![
						"cards.lookup",
						"cards.entries",
						"cards.listCardStatuses",
						"cards.listBoardAggregates",
						"cards.listStatsAggregates",
						"cards.hasCards",
						"boards.lookup",
						"boards.entries",
						"sessionsBoard.get",
						"sessionsBoard.listPlacements",
						"subscriptions.lookup",
						"subscriptions.entries",
						"attachments.lookup",
						"attachments.entries"
					].includes(command.type) ? runEngineWorkerWrite(input, () => execute(command), (operation) => {
						requestSqliteWorkerOperationAdmission({
							stage: "transaction",
							facts: void 0
						});
						return kernel.withWriteTransaction(operation, { withCommit(commit) {
							requestSqliteWorkerOperationAdmission({
								stage: "commit",
								facts: void 0
							});
							commit();
						} });
					}) : execute(command)
				};
			} catch (error) {
				return {
					ok: false,
					failure: encodeWorkboardSqliteFailure(error)
				};
			}
		},
		close: kernel.close
	};
}
//#endregion
export { createSqliteWorkerBackend };
