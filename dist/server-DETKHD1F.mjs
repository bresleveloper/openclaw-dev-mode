import { R as timestampMsToIsoString, j as resolveIntegerOption } from "./number-coercion-CLj0HTDM.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { a as normalizeFastMode, g as readStringValue, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, t as hasNonEmptyString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { t as isMainModule } from "./is-main-CH4EEB_R.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { a as routeLogsToStderr } from "./console-DwqfhE-H.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, s as prepareSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DM1AypRG.mjs";
import { o as closeOpenClawStateDatabaseAsync } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { Ct as estimateAcpSessionRowBytes, St as estimateAcpEventRowBytes } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { n as THINKING_LEVELS_HELP, t as BASE_THINKING_LEVELS } from "./thinking.shared-BKzBCWpI.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { r as isDevMode } from "./globals-QODkv80i.mjs";
import { t as hasHttpUrlPrefix } from "./url-protocol-OU3K-ySz.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES, t as GATEWAY_CLIENT_CAPS } from "./client-info-B_ICKCYw.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { t as startGatewayClientWhenEventLoopReady } from "./readiness-Beq7kS5p.mjs";
import { r as resolveGatewayClientBootstrap } from "./client-bootstrap-CE3rvLFg.mjs";
import { t as GatewayClient } from "./client-CpsABkfT.mjs";
import { t as createFixedWindowBudget } from "./fixed-window-rate-limit-wyPr2JvV.mjs";
import { i as readNonNegativeInteger, n as readMetadataNumber, r as readMetadataString, t as readBool } from "./meta-CqHXgeKW.mjs";
import { t as toAcpSessionLineageMeta } from "./session-lineage-meta-BvaElXY_.mjs";
import { t as createInMemorySessionStore } from "./session-fgn9B89t.mjs";
import { t as normalizeAcpProvenanceMode } from "./types-jI0iRy2N.mjs";
import { t as readSecretFromFile } from "./secret-file-BSX1SxMk.mjs";
import { t as normalizeTerminalChatSendAckStatus } from "./chat-send-ack-status-DwkWEMgk.mjs";
import { t as ACP_AGENT_INFO } from "./types-CMhDVB5X.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";
import { Readable, Writable } from "node:stream";
import { randomUUID } from "node:crypto";
import { AGENT_METHODS, AgentSideConnection, PROTOCOL_VERSION, ndJsonStream } from "@agentclientprotocol/sdk";
//#region src/acp/event-ledger.types.ts
const DEFAULT_MAX_SESSIONS = 200;
const DEFAULT_MAX_EVENTS_PER_SESSION = 5e3;
const DEFAULT_MAX_SERIALIZED_BYTES = 16777216;
function normalizeAcpLedgerOptions(options = {}) {
	return {
		maxSessions: resolveIntegerOption(options.maxSessions, DEFAULT_MAX_SESSIONS, { min: 1 }),
		maxEventsPerSession: resolveIntegerOption(options.maxEventsPerSession, DEFAULT_MAX_EVENTS_PER_SESSION, { min: 1 }),
		maxSerializedBytes: resolveIntegerOption(options.maxSerializedBytes, DEFAULT_MAX_SERIALIZED_BYTES, { min: 1024 }),
		now: options.now ?? Date.now
	};
}
function cloneAcpLedgerValue(value) {
	return structuredClone(value);
}
function createAcpPromptUpdates(prompt) {
	return prompt.map((content) => ({
		sessionUpdate: "user_message_chunk",
		content: cloneAcpLedgerValue(content)
	}));
}
function normalizeAcpLedgerEvent(raw) {
	if (!isRecord(raw) || !isRecord(raw.update)) return;
	const seq = raw.seq;
	const at = raw.at;
	const sessionId = raw.sessionId;
	const sessionKey = raw.sessionKey;
	const runId = raw.runId;
	const sessionUpdate = raw.update.sessionUpdate;
	if (typeof seq !== "number" || !Number.isInteger(seq) || seq < 0 || typeof at !== "number" || !Number.isFinite(at) || typeof sessionId !== "string" || typeof sessionKey !== "string" || typeof sessionUpdate !== "string") return;
	return {
		seq,
		at,
		sessionId,
		sessionKey,
		...typeof runId === "string" && runId ? { runId } : {},
		update: cloneAcpLedgerValue(raw.update)
	};
}
//#endregion
//#region src/acp/event-ledger.ts
function normalizeSqliteInteger(value) {
	return value === null ? 0 : coerceRequiredSqliteNumber(value);
}
function createSqliteLedgerQueries(db) {
	const query = getNodeSqliteKysely(db);
	return {
		readSession: prepareSqliteQuerySync(db, (parameter) => sqliteSessionMetadataQuery(db).where("session_id", "=", parameter((sessionId) => sessionId))),
		updateSessionMetadata: prepareSqliteQuerySync(db, (parameter) => query.updateTable("acp_replay_sessions").set((eb) => ({
			estimated_bytes: eb("estimated_bytes", "+", parameter((params) => params.metadataDelta)),
			session_key: parameter((params) => params.sessionKey),
			cwd: parameter((params) => params.cwd),
			complete: parameter((params) => params.complete),
			updated_at: parameter((params) => params.now)
		})).where("session_id", "=", parameter((params) => params.sessionId))),
		insertEvent: prepareSqliteQuerySync(db, (parameter) => query.insertInto("acp_replay_events").values({
			session_id: parameter((params) => params.sessionId),
			seq: parameter((params) => params.seq),
			at: parameter((params) => params.at),
			session_key: parameter((params) => params.sessionKey),
			run_id: parameter((params) => params.runId),
			update_json: parameter((params) => params.updateJson),
			estimated_bytes: parameter((params) => params.eventBytes)
		})),
		updateSessionAfterAppend: prepareSqliteQuerySync(db, (parameter) => query.updateTable("acp_replay_sessions").set((eb) => ({
			estimated_bytes: eb("estimated_bytes", "+", parameter((params) => params.eventBytes)),
			updated_at: parameter((params) => params.now),
			next_seq: parameter((params) => params.nextSeq)
		})).where("session_id", "=", parameter((params) => params.sessionId))),
		readEventCapCandidates: prepareSqliteQuerySync(db, (parameter) => query.selectFrom("acp_replay_sessions as s").select("s.session_id").select((eb) => eb.selectFrom("acp_replay_events as e").select((count) => count.fn.count("e.seq").as("event_count")).whereRef("e.session_id", "=", "s.session_id").as("event_count")).where((eb) => {
			const events = eb.selectFrom("acp_replay_events as e").whereRef("e.session_id", "=", "s.session_id");
			return eb(eb(events.select((endpoint) => endpoint.fn.max("e.seq").as("seq")), "-", events.select((endpoint) => endpoint.fn.min("e.seq").as("seq"))), ">=", parameter((limit) => limit));
		})),
		readExcessSessions: prepareSqliteQuerySync(db, (parameter) => query.selectFrom("acp_replay_sessions").select("session_id").orderBy("updated_at", "desc").orderBy("session_id", "asc").limit(-1).offset(parameter((limit) => limit))),
		readTotalBytes: prepareSqliteQuerySync(db, () => query.selectFrom("acp_replay_sessions").select((eb) => eb.fn.coalesce(eb.fn.sum("estimated_bytes"), eb.val(0)).as("total"))),
		readOldestSession: prepareSqliteQuerySync(db, () => query.selectFrom("acp_replay_sessions").select("session_id").orderBy("updated_at", "asc").orderBy("session_id", "asc").limit(1)),
		deleteOldestEvents: prepareSqliteQuerySync(db, (parameter) => {
			const sessionId = parameter((params) => params.sessionId);
			return query.deleteFrom("acp_replay_events").where("session_id", "=", sessionId).where("seq", "in", query.selectFrom("acp_replay_events").select("seq").where("session_id", "=", sessionId).orderBy("seq", "asc").limit(parameter((params) => params.limit))).returning("estimated_bytes");
		}),
		subtractSessionBytes: prepareSqliteQuerySync(db, (parameter) => query.updateTable("acp_replay_sessions").set((eb) => ({
			estimated_bytes: eb.fn("max", [eb.val(0), eb("estimated_bytes", "-", parameter((params) => params.freed))]),
			complete: 0
		})).where("session_id", "=", parameter((params) => params.sessionId))),
		deleteSession: prepareSqliteQuerySync(db, (parameter) => query.deleteFrom("acp_replay_sessions").where("session_id", "=", parameter((sessionId) => sessionId)))
	};
}
const sqliteLedgerQueries = /* @__PURE__ */ new WeakMap();
function getSqliteLedgerQueries(db) {
	let queries = sqliteLedgerQueries.get(db);
	if (!queries) {
		queries = createSqliteLedgerQueries(db);
		sqliteLedgerQueries.set(db, queries);
	}
	return queries;
}
function sqliteRowToLedgerEvent(row) {
	let update;
	try {
		update = JSON.parse(row.update_json);
	} catch {
		return;
	}
	return normalizeAcpLedgerEvent({
		seq: normalizeSqliteInteger(row.seq),
		at: normalizeSqliteInteger(row.at),
		sessionId: row.session_id,
		sessionKey: row.session_key,
		...row.run_id ? { runId: row.run_id } : {},
		update
	});
}
function sqliteSessionMetadataQuery(db) {
	return getNodeSqliteKysely(db).selectFrom("acp_replay_sessions").select([
		"session_id",
		"session_key",
		"cwd",
		"complete",
		"next_seq"
	]);
}
function readSqliteSessionById(db, sessionId) {
	return getSqliteLedgerQueries(db).readSession(sessionId).rows[0];
}
function readLatestCompleteSqliteSessionByKey(db, sessionKey) {
	return executeSqliteQueryTakeFirstSync(db, sqliteSessionMetadataQuery(db).where("session_key", "=", sessionKey).where("complete", "=", 1).orderBy("updated_at", "desc").orderBy("session_id", "asc").limit(1));
}
function upsertSqliteSession(db, state, params) {
	const now = state.now();
	const existing = params.reset ? void 0 : readSqliteSessionById(db, params.sessionId);
	if (existing) {
		const cwd = params.cwd || existing.cwd;
		const complete = normalizeSqliteInteger(existing.complete) === 1 || params.complete ? 1 : 0;
		const metadataDelta = estimateAcpSessionRowBytes({
			...params,
			cwd
		}) - estimateAcpSessionRowBytes({
			sessionId: params.sessionId,
			sessionKey: existing.session_key,
			cwd: existing.cwd
		});
		getSqliteLedgerQueries(db).updateSessionMetadata({
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			cwd,
			complete,
			now,
			metadataDelta
		});
		return normalizeSqliteInteger(existing.next_seq);
	}
	if (params.reset) db.prepare("DELETE FROM acp_replay_events WHERE session_id = ?").run(params.sessionId);
	const rowBytes = estimateAcpSessionRowBytes({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		cwd: params.cwd
	});
	db.prepare(`INSERT INTO acp_replay_sessions (
       session_id, session_key, cwd, complete, created_at, updated_at, next_seq, estimated_bytes
     ) VALUES (?, ?, ?, ?, ?, ?, 1, ?)
     ON CONFLICT(session_id) DO UPDATE SET
       session_key = excluded.session_key,
       cwd = excluded.cwd,
       complete = excluded.complete,
       updated_at = excluded.updated_at,
       next_seq = excluded.next_seq,
       -- Row overhead plus whatever event rows still exist: exact after a
       -- reset (events deleted, sum is 0) and on any conflicting rewrite.
       estimated_bytes = excluded.estimated_bytes + COALESCE(
         (SELECT SUM(e.estimated_bytes) FROM acp_replay_events e
           WHERE e.session_id = excluded.session_id), 0)`).run(params.sessionId, params.sessionKey, params.cwd, params.complete ? 1 : 0, now, now, rowBytes);
	return 1;
}
function estimateSqliteLedgerBytes(db) {
	const row = getSqliteLedgerQueries(db).readTotalBytes().rows[0];
	return normalizeSqliteInteger(row?.total ?? 0);
}
const LEDGER_TRIM_EVENT_BATCH = 64;
function deleteOldestSqliteEvents(db, sessionId, limit) {
	const queries = getSqliteLedgerQueries(db);
	const rows = queries.deleteOldestEvents({
		sessionId,
		limit
	}).rows;
	if (rows.length === 0) return 0;
	const freed = rows.reduce((sum, row) => sum + normalizeSqliteInteger(row.estimated_bytes), 0);
	queries.subtractSessionBytes({
		sessionId,
		freed
	});
	return rows.length;
}
function trimSqliteLedger(db, state) {
	const queries = getSqliteLedgerQueries(db);
	const eventCapCandidates = queries.readEventCapCandidates(state.maxEventsPerSession).rows;
	for (const row of eventCapCandidates) {
		const overage = normalizeSqliteInteger(row.event_count) - state.maxEventsPerSession;
		if (overage > 0) deleteOldestSqliteEvents(db, row.session_id, overage);
	}
	const oldSessions = queries.readExcessSessions(state.maxSessions).rows;
	for (const session of oldSessions) queries.deleteSession(session.session_id);
	let serializedBytes = estimateSqliteLedgerBytes(db);
	while (serializedBytes > state.maxSerializedBytes) {
		const session = queries.readOldestSession().rows[0];
		if (!session) break;
		if (deleteOldestSqliteEvents(db, session.session_id, LEDGER_TRIM_EVENT_BATCH) === 0) queries.deleteSession(session.session_id);
		serializedBytes = estimateSqliteLedgerBytes(db);
	}
}
function appendSqliteUpdate(db, state, params) {
	const nextSeq = upsertSqliteSession(db, state, {
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		cwd: "",
		complete: false
	});
	const now = state.now();
	const updateJson = JSON.stringify(cloneAcpLedgerValue(params.update));
	const eventBytes = estimateAcpEventRowBytes({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		...params.runId !== void 0 ? { runId: params.runId } : {},
		updateJson
	});
	const queries = getSqliteLedgerQueries(db);
	queries.insertEvent({
		sessionId: params.sessionId,
		seq: nextSeq,
		at: now,
		sessionKey: params.sessionKey,
		runId: params.runId ?? null,
		updateJson,
		eventBytes
	});
	queries.updateSessionAfterAppend({
		sessionId: params.sessionId,
		eventBytes,
		now,
		nextSeq: nextSeq + 1
	});
	trimSqliteLedger(db, state);
}
function buildSqliteReplay(db, session) {
	if (!session || normalizeSqliteInteger(session.complete) !== 1) return {
		complete: false,
		events: []
	};
	const events = executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("acp_replay_events").select([
		"session_id",
		"seq",
		"at",
		"session_key",
		"run_id",
		"update_json"
	]).where("session_id", "=", session.session_id).orderBy("seq", "asc")).rows.flatMap((row) => {
		const event = sqliteRowToLedgerEvent(row);
		return event ? [event] : [];
	});
	return {
		complete: true,
		sessionId: session.session_id,
		sessionKey: session.session_key,
		events
	};
}
/** Creates the SQLite-backed ACP event ledger used by the state database. */
function createSqliteAcpEventLedger(params = {}) {
	const normalized = normalizeAcpLedgerOptions(params);
	const dbOptions = {
		env: params.env,
		path: params.path
	};
	const state = { ...normalized };
	const mutate = (fn) => runOpenClawStateWriteTransaction((database) => fn(database.db), dbOptions);
	const read = (fn) => fn(openOpenClawStateDatabase(dbOptions).db);
	return {
		async startSession(sessionParams) {
			mutate((db) => {
				upsertSqliteSession(db, state, sessionParams);
				trimSqliteLedger(db, state);
			});
		},
		async recordUserPrompt(promptParams) {
			mutate((db) => {
				for (const update of createAcpPromptUpdates(promptParams.prompt)) appendSqliteUpdate(db, state, {
					sessionId: promptParams.sessionId,
					sessionKey: promptParams.sessionKey,
					runId: promptParams.runId,
					update
				});
			});
		},
		async recordUpdate(updateParams) {
			mutate((db) => {
				appendSqliteUpdate(db, state, updateParams);
			});
		},
		async markIncomplete(markParams) {
			mutate((db) => {
				db.prepare(`UPDATE acp_replay_sessions
              SET complete = 0, updated_at = ?
            WHERE session_id = ? AND session_key = ?`).run(state.now(), markParams.sessionId, markParams.sessionKey);
			});
		},
		async readReplay(replayParams) {
			return read((db) => {
				const session = readSqliteSessionById(db, replayParams.sessionId);
				if (session?.session_key !== replayParams.sessionKey) return {
					complete: false,
					events: []
				};
				return buildSqliteReplay(db, session);
			});
		},
		async readReplayBySessionId(replayParams) {
			return read((db) => buildSqliteReplay(db, readSqliteSessionById(db, replayParams.sessionId)));
		},
		async readReplayBySessionKey(replayParams) {
			return read((db) => buildSqliteReplay(db, readLatestCompleteSqliteSessionByKey(db, replayParams.sessionKey)));
		}
	};
}
//#endregion
//#region src/acp/session-new-ordering.ts
const SESSION_ESTABLISHING_METHODS = /* @__PURE__ */ new Set(["session/load", "session/resume"]);
const MAX_QUEUED_UPDATES_PER_SESSION = 256;
/** Owns wire order because the SDK serializes results only after handlers return. */
var AcpSessionNewOrdering = class {
	constructor() {
		this.establishedSessionIds = /* @__PURE__ */ new Set();
		this.queue = [];
		this.queuedPerSession = /* @__PURE__ */ new Map();
		this.provisionalSessions = /* @__PURE__ */ new Map();
		this.provisionalClaims = /* @__PURE__ */ new Map();
		this.pendingNewSessionRequestIds = /* @__PURE__ */ new Set();
	}
	observeInbound(message) {
		const messageObject = asOptionalRecord(message);
		const method = messageObject?.method;
		const requestId = readRequestId(messageObject?.id);
		if (messageObject?.jsonrpc !== "2.0" || typeof method !== "string" || requestId === void 0) return;
		if (method === "session/new") {
			this.pendingNewSessionRequestIds.add(requestId);
			return;
		}
		const sessionId = readSessionId(messageObject?.params);
		if (!sessionId) return;
		if (SESSION_ESTABLISHING_METHODS.has(method)) {
			this.provisionalSessions.set(requestId, sessionId);
			this.provisionalClaims.set(sessionId, (this.provisionalClaims.get(sessionId) ?? 0) + 1);
			return;
		}
		if (method === "session/close") this.forget(sessionId);
	}
	forget(sessionId) {
		this.establishedSessionIds.delete(sessionId);
	}
	transformOutbound(message, controller) {
		const emit = (queued) => controller.enqueue(queued);
		this.drain(emit);
		const messageObject = asOptionalRecord(message);
		const responseId = isJsonRpcResponse(messageObject) ? readRequestId(messageObject?.id) : void 0;
		if (responseId !== void 0) {
			const claimed = this.provisionalSessions.get(responseId);
			if (claimed !== void 0) {
				this.provisionalSessions.delete(responseId);
				const remaining = (this.provisionalClaims.get(claimed) ?? 1) - 1;
				if (remaining > 0) this.provisionalClaims.set(claimed, remaining);
				else this.provisionalClaims.delete(claimed);
				if (messageObject?.error === void 0) this.establish(claimed);
			}
		}
		if (responseId !== void 0 && this.pendingNewSessionRequestIds.delete(responseId)) {
			emit(message);
			const establishedSessionId = readSessionId(messageObject?.result);
			if (establishedSessionId) {
				this.establish(establishedSessionId);
				this.releaseSession(establishedSessionId, emit);
			}
			this.drain(emit);
			return;
		}
		const sessionId = readSessionId(messageObject?.params);
		if (messageObject?.method === "session/update" && sessionId && this.shouldQueue(sessionId) && this.enqueue(sessionId, message, emit)) return;
		emit(message);
	}
	isRecognized(sessionId) {
		return this.establishedSessionIds.has(sessionId) || this.provisionalClaims.has(sessionId);
	}
	shouldQueue(sessionId) {
		if (this.queuedPerSession.has(sessionId)) return true;
		if (this.isRecognized(sessionId)) return false;
		return this.pendingNewSessionRequestIds.size > 0;
	}
	establish(sessionId) {
		this.establishedSessionIds.add(sessionId);
	}
	enqueue(sessionId, message, emit) {
		const queued = this.queuedPerSession.get(sessionId) ?? 0;
		if (queued >= MAX_QUEUED_UPDATES_PER_SESSION) {
			this.releaseSession(sessionId, emit);
			return false;
		}
		this.queue.push({
			sessionId,
			message
		});
		this.queuedPerSession.set(sessionId, queued + 1);
		return true;
	}
	releaseSession(sessionId, emit) {
		if (!this.queuedPerSession.delete(sessionId)) return;
		let kept = 0;
		for (const entry of this.queue) {
			if (entry.sessionId === sessionId) {
				emit(entry.message);
				continue;
			}
			this.queue[kept] = entry;
			kept += 1;
		}
		this.queue.length = kept;
	}
	drain(emit) {
		if (this.queue.length === 0) return;
		const nothingOutstanding = this.pendingNewSessionRequestIds.size === 0;
		let released = 0;
		for (const entry of this.queue) {
			if (!nothingOutstanding && !this.isRecognized(entry.sessionId)) break;
			emit(entry.message);
			const remaining = this.queuedPerSession.get(entry.sessionId) ?? 1;
			if (remaining <= 1) this.queuedPerSession.delete(entry.sessionId);
			else this.queuedPerSession.set(entry.sessionId, remaining - 1);
			released += 1;
		}
		if (released > 0) this.queue.splice(0, released);
	}
};
function isJsonRpcResponse(value) {
	if (value === void 0 || "method" in value) return false;
	if (value.id === null && asOptionalRecord(value.error)?.code === -32600) return false;
	return value.result !== void 0 || value.error !== void 0;
}
function readRequestId(value) {
	return value === null || typeof value === "string" || typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function readSessionId(value) {
	const sessionId = asOptionalRecord(value)?.sessionId;
	return typeof sessionId === "string" && sessionId.length > 0 ? sessionId : void 0;
}
//#endregion
//#region src/acp/event-mapper.ts
const TOOL_LOCATION_PATH_KEYS = [
	"path",
	"filePath",
	"file_path",
	"targetPath",
	"target_path",
	"targetFile",
	"target_file",
	"sourcePath",
	"source_path",
	"destinationPath",
	"destination_path",
	"oldPath",
	"old_path",
	"newPath",
	"new_path",
	"outputPath",
	"output_path",
	"inputPath",
	"input_path"
];
const TOOL_LOCATION_LINE_KEYS = [
	"line",
	"lineNumber",
	"line_number",
	"startLine",
	"start_line"
];
const TOOL_RESULT_PATH_MARKER_RE = /^(?:FILE|MEDIA):(.+)$/gm;
const TOOL_LOCATION_MAX_DEPTH = 4;
const TOOL_LOCATION_MAX_NODES = 100;
const INLINE_CONTROL_ESCAPE_MAP = {
	"\0": "\\0",
	"\r": "\\r",
	"\n": "\\n",
	"	": "\\t",
	"\v": "\\v",
	"\f": "\\f",
	"\u2028": "\\u2028",
	"\u2029": "\\u2029"
};
function escapeInlineControlChars(value) {
	return value.replace(/[\p{Cc}\u2028\u2029]/gu, (char) => INLINE_CONTROL_ESCAPE_MAP[char] || `\\x${char.charCodeAt(0).toString(16).padStart(2, "0")}`);
}
function escapeResourceTitle(value) {
	return escapeInlineControlChars(value).replace(/[()[\]]/g, (char) => `\\${char}`);
}
function normalizeToolLocationPath(value) {
	const trimmed = value.trim();
	if (!trimmed || trimmed.length > 4096 || trimmed.includes("\0") || trimmed.includes("\r") || trimmed.includes("\n")) return;
	if (hasHttpUrlPrefix(trimmed)) return;
	if (/^file:\/\//i.test(trimmed)) try {
		const parsed = new URL(trimmed);
		return decodeURIComponent(parsed.pathname || "") || void 0;
	} catch {
		return;
	}
	return trimmed;
}
function normalizeToolLocationLine(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return;
	const line = Math.floor(value);
	return line > 0 ? line : void 0;
}
function extractToolLocationLine(record) {
	for (const key of TOOL_LOCATION_LINE_KEYS) {
		const line = normalizeToolLocationLine(record[key]);
		if (line !== void 0) return line;
	}
}
function addToolLocation(locations, rawPath, line) {
	const path = normalizeToolLocationPath(rawPath);
	if (!path) return;
	for (const [existingKey, existing] of locations.entries()) {
		if (existing.path !== path) continue;
		if (line === void 0 || existing.line === line) return;
		if (existing.line === void 0) locations.delete(existingKey);
	}
	const locationKey = `${path}:${line ?? ""}`;
	if (locations.has(locationKey)) return;
	locations.set(locationKey, line ? {
		path,
		line
	} : { path });
}
function collectLocationsFromTextMarkers(text, locations) {
	for (const match of text.matchAll(TOOL_RESULT_PATH_MARKER_RE)) {
		const candidate = normalizeOptionalString(match[1]);
		if (candidate) addToolLocation(locations, candidate);
	}
}
function collectToolLocations(value, locations, state, depth) {
	if (state.visited >= TOOL_LOCATION_MAX_NODES || depth > TOOL_LOCATION_MAX_DEPTH) return;
	state.visited += 1;
	if (typeof value === "string") {
		collectLocationsFromTextMarkers(value, locations);
		return;
	}
	if (!value || typeof value !== "object") return;
	if (Array.isArray(value)) {
		for (const item of value) {
			collectToolLocations(item, locations, state, depth + 1);
			if (state.visited >= TOOL_LOCATION_MAX_NODES) return;
		}
		return;
	}
	const record = value;
	const line = extractToolLocationLine(record);
	for (const key of TOOL_LOCATION_PATH_KEYS) {
		const rawPath = record[key];
		if (typeof rawPath === "string") addToolLocation(locations, rawPath, line);
	}
	const content = Array.isArray(record.content) ? record.content : void 0;
	if (content) for (const block of content) {
		const entry = asOptionalRecord(block);
		if (entry?.type === "text" && typeof entry.text === "string") collectLocationsFromTextMarkers(entry.text, locations);
	}
	for (const [key, nested] of Object.entries(record)) {
		if (key === "content") continue;
		collectToolLocations(nested, locations, state, depth + 1);
		if (state.visited >= TOOL_LOCATION_MAX_NODES) return;
	}
}
/** Extracts bounded text content from an ACP prompt block list. */
function extractTextFromPrompt(prompt, maxBytes) {
	const parts = [];
	let totalBytes = 0;
	for (const block of prompt) {
		let blockText;
		if (block.type === "text") blockText = block.text;
		else if (block.type === "resource" && "text" in block.resource && block.resource.text) blockText = block.resource.text;
		else if (block.type === "resource_link") {
			const title = block.title ? ` (${escapeResourceTitle(block.title)})` : "";
			const uri = block.uri ? escapeInlineControlChars(block.uri) : "";
			blockText = uri ? `[Resource link${title}] ${uri}` : `[Resource link${title}]`;
		}
		if (blockText !== void 0) {
			if (maxBytes !== void 0) {
				const separatorBytes = parts.length > 0 ? 1 : 0;
				totalBytes += separatorBytes + Buffer.byteLength(blockText, "utf-8");
				if (totalBytes > maxBytes) throw new Error(`Prompt exceeds maximum allowed size of ${maxBytes} bytes`);
			}
			parts.push(blockText);
		}
	}
	return parts.join("\n");
}
/** Extracts image/file prompt blocks into Gateway attachment payloads. */
function extractAttachmentsFromPrompt(prompt) {
	const attachments = [];
	for (const block of prompt) {
		if (block.type !== "image") continue;
		if (!block.data || !block.mimeType) continue;
		attachments.push({
			type: "image",
			mimeType: block.mimeType,
			content: block.data
		});
	}
	return attachments;
}
/** Builds the display title used for ACP tool-call events. */
function formatToolTitle(name, args) {
	const base = name ?? "tool";
	if (!args || Object.keys(args).length === 0) return base;
	return escapeInlineControlChars(`${base}: ${Object.entries(args).map(([key, value]) => {
		const raw = typeof value === "string" ? value : JSON.stringify(value);
		return `${key}: ${raw.length > 100 ? `${truncateUtf16Safe(raw, 100)}...` : raw}`;
	}).join(", ")}`);
}
/** Infers ACP tool kind from a normalized tool name. */
function inferToolKind(name) {
	if (!name) return "other";
	const normalized = normalizeLowercaseStringOrEmpty(name);
	if (normalized.includes("read")) return "read";
	if (normalized.includes("write") || normalized.includes("edit")) return "edit";
	if (normalized.includes("delete") || normalized.includes("remove")) return "delete";
	if (normalized.includes("move") || normalized.includes("rename")) return "move";
	if (normalized.includes("search") || normalized.includes("find")) return "search";
	if (normalized.includes("exec") || normalized.includes("run") || normalized.includes("bash")) return "execute";
	if (normalized.includes("fetch") || normalized.includes("http")) return "fetch";
	return "other";
}
/** Extracts textual ACP tool-call content from unknown runtime payloads. */
function extractToolCallContent(value) {
	if (hasNonEmptyString(value)) return value.trim() ? [{
		type: "content",
		content: {
			type: "text",
			text: value
		}
	}] : void 0;
	const record = asOptionalRecord(value);
	if (!record) return;
	const contents = [];
	const blocks = Array.isArray(record.content) ? record.content : [];
	for (const block of blocks) {
		const entry = asOptionalRecord(block);
		if (entry?.type === "text" && hasNonEmptyString(entry.text)) contents.push({
			type: "content",
			content: {
				type: "text",
				text: entry.text
			}
		});
	}
	if (contents.length > 0) return contents;
	const fallbackText = readStringValue(record.text) ?? readStringValue(record.message) ?? readStringValue(record.error);
	if (!hasNonEmptyString(fallbackText)) return;
	return [{
		type: "content",
		content: {
			type: "text",
			text: fallbackText
		}
	}];
}
/** Extracts bounded file locations from nested tool-call payloads. */
function extractToolCallLocations(...values) {
	const locations = /* @__PURE__ */ new Map();
	for (const value of values) collectToolLocations(value, locations, { visited: 0 }, 0);
	return locations.size > 0 ? [...locations.values()] : void 0;
}
//#endregion
//#region src/acp/session-mapper.ts
/** Resolves ACP request metadata into OpenClaw Gateway session keys and reset behavior. */
/** Parses ACP request metadata into OpenClaw session routing hints. */
function parseSessionMeta(meta) {
	if (!meta || typeof meta !== "object") return {};
	const record = meta;
	return {
		sessionKey: readMetadataString(record, [
			"sessionKey",
			"session",
			"key"
		]),
		sessionLabel: readMetadataString(record, ["sessionLabel", "label"]),
		resetSession: readBool(record, ["resetSession", "reset"]),
		requireExisting: readBool(record, ["requireExistingSession", "requireExisting"]),
		prefixCwd: readBool(record, ["prefixCwd"])
	};
}
/** Resolves the Gateway session key for an ACP request using metadata, defaults, or fallback. */
async function resolveAcpSessionKey(params) {
	const requestedLabel = params.meta.sessionLabel ?? params.opts.defaultSessionLabel;
	const requestedKey = params.meta.sessionKey ?? params.opts.defaultSessionKey;
	const requireExisting = params.meta.requireExisting ?? params.opts.requireExistingSession ?? false;
	if (params.meta.sessionLabel) {
		const resolved = await params.gateway.request("sessions.resolve", { label: params.meta.sessionLabel });
		if (!resolved?.key) throw new Error(`Unable to resolve session label: ${params.meta.sessionLabel}`);
		return resolved.key;
	}
	if (params.meta.sessionKey) {
		if (!requireExisting) return params.meta.sessionKey;
		const resolved = await params.gateway.request("sessions.resolve", { key: params.meta.sessionKey });
		if (!resolved?.key) throw new Error(`Session key not found: ${params.meta.sessionKey}`);
		return resolved.key;
	}
	if (requestedLabel) {
		const resolved = await params.gateway.request("sessions.resolve", { label: requestedLabel });
		if (!resolved?.key) throw new Error(`Unable to resolve session label: ${requestedLabel}`);
		return resolved.key;
	}
	if (requestedKey) {
		if (!requireExisting) return requestedKey;
		const resolved = await params.gateway.request("sessions.resolve", { key: requestedKey });
		if (!resolved?.key) throw new Error(`Session key not found: ${requestedKey}`);
		return resolved.key;
	}
	return params.fallbackKey;
}
/** Sends a Gateway session reset when ACP metadata or server defaults request it. */
async function resetSessionIfNeeded(params) {
	if (!(params.meta.resetSession ?? params.opts.resetSession ?? false)) return;
	await params.gateway.request("sessions.reset", { key: params.sessionKey });
}
//#endregion
//#region src/acp/permission-relay.ts
const FALLBACK_EXEC_APPROVAL_DECISIONS = ["allow-once", "deny"];
function normalizeGatewayExecApprovalDecision(value) {
	if (value === "allow-once" || value === "allow-always" || value === "deny") return value;
}
/** Normalizes allowed Gateway exec approval decisions with a conservative fallback set. */
function normalizeGatewayExecApprovalDecisions(value) {
	const normalized = Array.isArray(value) ? value.map(normalizeGatewayExecApprovalDecision).filter((decision) => Boolean(decision)) : [];
	return normalized.length > 0 ? normalized : [...FALLBACK_EXEC_APPROVAL_DECISIONS];
}
/** Converts Gateway exec decisions into ACP permission options. */
function buildAcpPermissionOptions(decisions) {
	const unique = new Set(decisions);
	const options = [];
	if (unique.has("allow-once")) options.push({
		optionId: "allow-once",
		name: "Allow once",
		kind: "allow_once"
	});
	if (unique.has("allow-always")) options.push({
		optionId: "allow-always",
		name: "Allow always",
		kind: "allow_always"
	});
	if (unique.has("deny")) options.push({
		optionId: "deny",
		name: "Deny",
		kind: "reject_once"
	});
	return options.length > 0 ? options : buildAcpPermissionOptions(FALLBACK_EXEC_APPROVAL_DECISIONS);
}
/** Parses legacy Gateway approval event data into ACP relay state. */
function parseGatewayExecApprovalEventData(data) {
	if (data.phase !== "requested" || data.kind !== "exec" || data.status !== "pending") return null;
	const approvalId = normalizeOptionalString(data.approvalId);
	if (!approvalId) return null;
	return {
		approvalId,
		command: normalizeOptionalString(data.command),
		host: normalizeOptionalString(data.host),
		title: normalizeOptionalString(data.title),
		toolCallId: normalizeOptionalString(data.toolCallId)
	};
}
/** Parses structured Gateway approval-request payloads into ACP relay state. */
function parseGatewayExecApprovalRequestEventPayload(payload) {
	const approvalId = normalizeOptionalString(payload.id);
	const request = payload.request;
	if (!approvalId || !request || typeof request !== "object" || Array.isArray(request)) return null;
	const requestRecord = request;
	return {
		approvalId,
		command: normalizeOptionalString(requestRecord.command) ?? normalizeOptionalString(requestRecord.commandPreview),
		host: normalizeOptionalString(requestRecord.host),
		toolCallId: normalizeOptionalString(requestRecord.toolCallId)
	};
}
/** Builds the ACP request_permission payload shown to a client. */
function buildAcpPermissionRequest(params) {
	const command = normalizeOptionalString(params.details?.commandText) ?? normalizeOptionalString(params.details?.commandPreview) ?? params.event.command;
	const host = normalizeOptionalString(params.details?.host) ?? params.event.host;
	const decisions = normalizeGatewayExecApprovalDecisions(params.details?.allowedDecisions);
	const rawInput = {
		name: "exec",
		approvalId: params.event.approvalId
	};
	if (command) rawInput.command = command;
	if (host) rawInput.host = host;
	return {
		sessionId: params.sessionId,
		toolCall: {
			toolCallId: params.event.toolCallId ?? `exec:${params.event.approvalId}`,
			title: params.event.title ?? "Command approval requested",
			kind: "execute",
			status: "pending",
			rawInput,
			_meta: {
				toolName: "exec",
				approvalId: params.event.approvalId
			}
		},
		options: buildAcpPermissionOptions(decisions)
	};
}
/** Maps an ACP permission response back to the Gateway exec approval decision. */
function resolveGatewayDecisionFromPermissionOutcome(response, options) {
	const outcome = response?.outcome;
	if (!outcome || outcome.outcome !== "selected") return;
	return normalizeGatewayExecApprovalDecision(options.find((option) => option.optionId === outcome.optionId)?.optionId);
}
//#endregion
//#region src/acp/translator.agent-events.ts
var AcpTranslatorAgentEvents = class {
	constructor(connection, gateway, sessionUpdates, pendingPrompts, approvalRelays, getPendingPrompt, findPendingBySessionKey, log) {
		this.connection = connection;
		this.gateway = gateway;
		this.sessionUpdates = sessionUpdates;
		this.pendingPrompts = pendingPrompts;
		this.approvalRelays = approvalRelays;
		this.getPendingPrompt = getPendingPrompt;
		this.findPendingBySessionKey = findPendingBySessionKey;
		this.log = log;
	}
	async handleAgentEvent(evt) {
		const payload = evt.payload;
		if (!payload) return;
		const stream = payload.stream;
		const runId = payload.runId;
		const data = payload.data;
		const sessionKey = payload.sessionKey;
		if (!stream || !data || !sessionKey) return;
		if (stream === "approval") {
			await this.handleApprovalEvent({
				sessionKey,
				runId,
				data
			});
			return;
		}
		if (stream !== "tool") return;
		const phase = data.phase;
		const name = data.name;
		const toolCallId = data.toolCallId;
		if (!toolCallId) return;
		const pending = this.findPendingBySessionKey(sessionKey, runId);
		if (!pending) return;
		if (phase === "start") {
			if (!pending.toolCalls) pending.toolCalls = /* @__PURE__ */ new Map();
			if (pending.toolCalls.has(toolCallId)) return;
			const args = data.args;
			const title = formatToolTitle(name, args);
			const kind = inferToolKind(name);
			const locations = extractToolCallLocations(args);
			pending.toolCalls.set(toolCallId, {
				title,
				kind,
				rawInput: args,
				locations
			});
			await this.sessionUpdates.emit({
				sessionId: pending.sessionId,
				sessionKey: pending.sessionKey,
				...pending.ledgerSessionId ? { ledgerSessionId: pending.ledgerSessionId } : {},
				runId: pending.idempotencyKey,
				record: true,
				update: {
					sessionUpdate: "tool_call",
					toolCallId,
					title,
					status: "in_progress",
					rawInput: args,
					kind,
					locations
				}
			});
			return;
		}
		if (phase === "update") {
			const toolState = pending.toolCalls?.get(toolCallId);
			const partialResult = data.partialResult;
			await this.sessionUpdates.emit({
				sessionId: pending.sessionId,
				sessionKey: pending.sessionKey,
				...pending.ledgerSessionId ? { ledgerSessionId: pending.ledgerSessionId } : {},
				runId: pending.idempotencyKey,
				record: true,
				update: {
					sessionUpdate: "tool_call_update",
					toolCallId,
					status: "in_progress",
					rawOutput: partialResult,
					content: extractToolCallContent(partialResult),
					locations: extractToolCallLocations(toolState?.locations, partialResult)
				}
			});
			return;
		}
		if (phase === "result") {
			const isError = Boolean(data.isError);
			const toolState = pending.toolCalls?.get(toolCallId);
			pending.toolCalls?.delete(toolCallId);
			await this.sessionUpdates.emit({
				sessionId: pending.sessionId,
				sessionKey: pending.sessionKey,
				...pending.ledgerSessionId ? { ledgerSessionId: pending.ledgerSessionId } : {},
				runId: pending.idempotencyKey,
				record: true,
				update: {
					sessionUpdate: "tool_call_update",
					toolCallId,
					status: isError ? "failed" : "completed",
					rawOutput: data.result,
					content: extractToolCallContent(data.result),
					locations: extractToolCallLocations(toolState?.locations, data.result)
				}
			});
		}
	}
	handleExecApprovalRequestEvent(evt) {
		const payload = evt.payload;
		if (!payload) return;
		const approvalEvent = parseGatewayExecApprovalRequestEventPayload(payload);
		if (!approvalEvent) return;
		const request = payload.request;
		const sessionKey = normalizeOptionalString(request?.sessionKey);
		if (!sessionKey) return;
		this.startApprovalRelay({
			sessionKey,
			approvalEvent
		});
	}
	clearApprovalRelaysForPrompt(sessionId, runId, opts = {}) {
		for (const [approvalId, relay] of this.approvalRelays) {
			if (relay.sessionId !== sessionId) continue;
			if (runId && relay.runId !== runId) continue;
			this.approvalRelays.delete(approvalId);
			if (opts.denyActive && relay.state === "active") this.resolveGatewayApproval(approvalId, "deny");
		}
	}
	async handleApprovalEvent(params) {
		const approvalEvent = parseGatewayExecApprovalEventData(params.data);
		if (!approvalEvent) return;
		this.startApprovalRelay({
			sessionKey: params.sessionKey,
			runId: params.runId,
			approvalEvent
		});
	}
	startApprovalRelay(params) {
		const approvalEvent = params.approvalEvent;
		const existing = this.approvalRelays.get(approvalEvent.approvalId);
		if (existing) {
			this.retryApprovalRelayDecision(existing);
			return;
		}
		const pending = this.findPendingForApproval(params);
		if (!pending) return;
		const pendingToolCall = approvalEvent.toolCallId ? pending.toolCalls?.get(approvalEvent.toolCallId) : void 0;
		const correlatedApprovalEvent = !approvalEvent.title && pendingToolCall?.kind === "execute" ? {
			...approvalEvent,
			title: pendingToolCall.title
		} : approvalEvent;
		const relay = {
			approvalId: approvalEvent.approvalId,
			runId: pending.idempotencyKey,
			sessionId: pending.sessionId,
			sessionKey: pending.sessionKey,
			state: "active"
		};
		this.approvalRelays.set(relay.approvalId, relay);
		this.runApprovalRelay(relay, correlatedApprovalEvent);
	}
	findPendingForApproval(params) {
		if (params.runId) return this.findPendingBySessionKey(params.sessionKey, params.runId);
		const toolCallId = params.approvalEvent.toolCallId;
		if (!toolCallId) return this.findUniquePendingBySessionKey(params.sessionKey);
		let match;
		for (const pending of this.pendingPrompts.values()) {
			if (pending.sessionKey !== params.sessionKey || pending.toolCalls?.get(toolCallId)?.kind !== "execute") continue;
			if (match) return;
			match = pending;
		}
		return match;
	}
	async runApprovalRelay(relay, approvalEvent) {
		let resolved = false;
		let decision;
		try {
			const details = await this.getGatewayApprovalDetails(relay.approvalId);
			if (!this.isApprovalRelayActive(relay)) {
				resolved = await this.resolveGatewayApproval(relay.approvalId, "deny");
				return;
			}
			const request = buildAcpPermissionRequest({
				sessionId: relay.sessionId,
				event: approvalEvent,
				details
			});
			try {
				decision = resolveGatewayDecisionFromPermissionOutcome(await this.connection.requestPermission(request), request.options);
			} catch (err) {
				this.log(`approval relay request failed for ${relay.approvalId}: ${String(err)}`);
			}
			const selectedDecision = this.isApprovalRelayActive(relay) && decision ? decision : "deny";
			resolved = await this.resolveGatewayApproval(relay.approvalId, selectedDecision);
		} finally {
			const current = this.approvalRelays.get(relay.approvalId);
			if (current === relay && current.state === "active") {
				if (resolved) current.state = "completed";
				else if (decision) current.pendingDecision = decision;
				else this.approvalRelays.delete(relay.approvalId);
			}
		}
	}
	async retryApprovalRelayDecision(relay) {
		const decision = relay.pendingDecision;
		if (!decision || !this.isApprovalRelayActive(relay)) return;
		if (!await this.resolveGatewayApproval(relay.approvalId, decision) || !this.isApprovalRelayActive(relay)) return;
		relay.pendingDecision = void 0;
		relay.state = "completed";
	}
	async replayApprovalDecisionsOnReconnect() {
		for (const relay of this.approvalRelays.values()) await this.retryApprovalRelayDecision(relay);
	}
	async getGatewayApprovalDetails(approvalId) {
		try {
			return await this.gateway.request("exec.approval.get", { id: approvalId });
		} catch (err) {
			this.log(`approval relay hydrate failed for ${approvalId}: ${String(err)}`);
			return null;
		}
	}
	async resolveGatewayApproval(approvalId, decision) {
		try {
			await this.gateway.request("exec.approval.resolve", {
				id: approvalId,
				decision
			});
			return true;
		} catch (err) {
			this.log(`approval relay resolve failed for ${approvalId}: ${String(err)}`);
			return false;
		}
	}
	isApprovalRelayActive(relay) {
		return this.approvalRelays.get(relay.approvalId) === relay && relay.state === "active" && this.getPendingPrompt(relay.sessionId, relay.runId) !== void 0;
	}
	findUniquePendingBySessionKey(sessionKey) {
		let match;
		for (const pending of this.pendingPrompts.values()) {
			if (pending.sessionKey !== sessionKey) continue;
			if (match) return;
			match = pending;
		}
		return match;
	}
};
//#endregion
//#region src/acp/translator.disconnects.ts
const ACP_GATEWAY_DISCONNECT_GRACE_MS = 5e3;
var AcpTranslatorDisconnects = class {
	constructor(gateway, pendingPrompts, getPendingPrompt, settleRecoveredPrompt, rejectPendingPrompt, log) {
		this.gateway = gateway;
		this.pendingPrompts = pendingPrompts;
		this.getPendingPrompt = getPendingPrompt;
		this.settleRecoveredPrompt = settleRecoveredPrompt;
		this.rejectPendingPrompt = rejectPendingPrompt;
		this.log = log;
		this.disconnectTimer = null;
		this.activeDisconnectContext = null;
		this.disconnectGeneration = 0;
	}
	get activeContext() {
		return this.activeDisconnectContext;
	}
	shutdown() {
		this.activeDisconnectContext = null;
		this.clearDisconnectTimer();
	}
	handleGatewayReconnect() {
		this.log("gateway reconnected");
		const disconnectContext = this.activeDisconnectContext;
		this.activeDisconnectContext = null;
		if (!disconnectContext) return;
		this.reconcilePendingPrompts(disconnectContext.generation, false);
	}
	handleGatewayDisconnect(reason) {
		this.log(`gateway disconnected: ${reason}`);
		const disconnectContext = {
			generation: this.disconnectGeneration + 1,
			reason
		};
		this.disconnectGeneration = disconnectContext.generation;
		this.activeDisconnectContext = disconnectContext;
		if (this.pendingPrompts.size === 0) return;
		for (const pending of this.pendingPrompts.values()) pending.disconnectContext = disconnectContext;
		this.armDisconnectTimer(disconnectContext);
	}
	armForActiveContext() {
		if (this.activeDisconnectContext && !this.disconnectTimer) this.armDisconnectTimer(this.activeDisconnectContext);
	}
	clearWhenIdle() {
		if (this.pendingPrompts.size === 0) this.clearDisconnectTimer();
	}
	clearDisconnectTimer() {
		if (!this.disconnectTimer) return;
		clearTimeout(this.disconnectTimer);
		this.disconnectTimer = null;
	}
	armDisconnectTimer(disconnectContext) {
		this.clearDisconnectTimer();
		this.disconnectTimer = setTimeout(() => {
			this.disconnectTimer = null;
			this.reconcilePendingPrompts(disconnectContext.generation, true);
		}, ACP_GATEWAY_DISCONNECT_GRACE_MS);
		this.disconnectTimer.unref?.();
	}
	clearPendingDisconnectState(pending, disconnectContext) {
		if (pending.disconnectContext !== disconnectContext) return;
		pending.disconnectContext = void 0;
	}
	shouldRejectPendingAtDisconnectDeadline(pending, disconnectContext) {
		return pending.disconnectContext === disconnectContext && (!pending.sendAccepted || this.activeDisconnectContext?.generation === disconnectContext.generation);
	}
	async reconcilePendingPrompts(observedDisconnectGeneration, deadlineExpired) {
		if (this.pendingPrompts.size === 0) {
			if (this.disconnectGeneration === observedDisconnectGeneration) this.clearDisconnectTimer();
			return;
		}
		const pendingEntries = [...this.pendingPrompts.entries()];
		let keepDisconnectTimer = false;
		for (const [sessionId, pending] of pendingEntries) {
			if (this.pendingPrompts.get(sessionId) !== pending) continue;
			if (pending.disconnectContext?.generation !== observedDisconnectGeneration) continue;
			if (await this.reconcilePendingPrompt(sessionId, pending, deadlineExpired)) keepDisconnectTimer = true;
		}
		if (!keepDisconnectTimer && this.disconnectGeneration === observedDisconnectGeneration) this.clearDisconnectTimer();
	}
	async reconcilePendingPrompt(sessionId, pending, deadlineExpired) {
		const disconnectContext = pending.disconnectContext;
		if (!disconnectContext) return false;
		let result;
		try {
			result = await this.gateway.request("agent.wait", {
				runId: pending.idempotencyKey,
				timeoutMs: 0
			}, { timeoutMs: null });
		} catch (err) {
			this.log(`agent.wait reconcile failed for ${pending.idempotencyKey}: ${String(err)}`);
			if (deadlineExpired) {
				if (this.shouldRejectPendingAtDisconnectDeadline(pending, disconnectContext)) {
					await this.rejectPendingPrompt(pending, /* @__PURE__ */ new Error(`Gateway disconnected: ${disconnectContext.reason}`), { recordDisconnectNotice: true });
					return false;
				}
				this.clearPendingDisconnectState(pending, disconnectContext);
				return false;
			}
			return true;
		}
		const currentPending = this.getPendingPrompt(sessionId, pending.idempotencyKey);
		if (!currentPending) return false;
		const hasVisibleReply = result?.terminalReply?.disposition === "visible";
		if (result?.status === "ok" || result?.status === "error" || result?.status === "timeout" && hasVisibleReply) {
			await this.settleRecoveredPrompt(sessionId, currentPending, result);
			return false;
		}
		if (deadlineExpired) {
			if (this.shouldRejectPendingAtDisconnectDeadline(currentPending, disconnectContext)) {
				const currentDisconnectContext = currentPending.disconnectContext;
				if (!currentDisconnectContext) return false;
				await this.rejectPendingPrompt(currentPending, /* @__PURE__ */ new Error(`Gateway disconnected: ${currentDisconnectContext.reason}`), { recordDisconnectNotice: true });
				return false;
			}
			this.clearPendingDisconnectState(currentPending, disconnectContext);
			return false;
		}
		return true;
	}
};
//#endregion
//#region src/acp/translator.prompt-stream.ts
/** ACP prompt submission, Gateway chat streaming, and prompt settlement. */
const DEFAULT_MAX_PROMPT_BYTES = 2097152;
function getMaxPromptBytes() {
	return isDevMode() ? 52428800 : DEFAULT_MAX_PROMPT_BYTES;
}
const ACP_SHUTDOWN_ABORT_TIMEOUT_MS = 1e3;
function isAdminScopeProvenanceRejection(err) {
	if (!(err instanceof Error)) return false;
	const gatewayCode = typeof err.gatewayCode === "string" ? err.gatewayCode : void 0;
	return err.name === "GatewayClientRequestError" && gatewayCode === "INVALID_REQUEST" && err.message.includes("system provenance fields require admin scope");
}
function isGatewayCloseError(err) {
	return (err instanceof Error ? err.message : String(err)).startsWith("gateway closed (");
}
function buildSystemInputProvenance(originSessionId) {
	return {
		kind: "external_user",
		originSessionId,
		sourceChannel: "acp",
		sourceTool: "openclaw_acp"
	};
}
function buildSystemProvenanceReceipt(params) {
	return [
		"[Source Receipt]",
		"bridge=openclaw-acp",
		`originHost=${os.hostname()}`,
		`originCwd=${shortenHomePath(params.cwd)}`,
		`acpSessionId=${params.sessionId}`,
		`originSessionId=${params.sessionId}`,
		`targetSession=${params.sessionKey}`,
		"[/Source Receipt]"
	].join("\n");
}
var AcpTranslatorPromptStream = class {
	constructor(connection, gateway, opts, sessionStore, sessionUpdates, sessionState, approvalRelays, log) {
		this.gateway = gateway;
		this.opts = opts;
		this.sessionStore = sessionStore;
		this.sessionUpdates = sessionUpdates;
		this.sessionState = sessionState;
		this.approvalRelays = approvalRelays;
		this.log = log;
		this.pendingPrompts = /* @__PURE__ */ new Map();
		this.pendingPromptAdmissions = /* @__PURE__ */ new Map();
		this.settlingPromptKeys = /* @__PURE__ */ new Set();
		this.stopped = false;
		this.agentEvents = new AcpTranslatorAgentEvents(connection, gateway, sessionUpdates, this.pendingPrompts, this.approvalRelays, (sessionId, runId) => this.getPendingPrompt(sessionId, runId), (sessionKey, runId) => this.findPendingBySessionKey(sessionKey, runId), log);
		this.disconnects = new AcpTranslatorDisconnects(gateway, this.pendingPrompts, (sessionId, runId) => this.getPendingPrompt(sessionId, runId), (sessionId, pending, result) => this.settleRecoveredPrompt(sessionId, pending, result), (pending, error, options) => this.rejectPendingPrompt(pending, error, options), log);
	}
	async shutdown() {
		this.stopped = true;
		this.disconnects.shutdown();
		const sessions = /* @__PURE__ */ new Map();
		for (const pending of this.pendingPrompts.values()) sessions.set(pending.sessionId, {
			sessionId: pending.sessionId,
			sessionKey: pending.sessionKey,
			activeRunId: pending.idempotencyKey
		});
		for (const admission of this.pendingPromptAdmissions.values()) sessions.set(admission.session.sessionId, admission.session);
		await Promise.all([...sessions.values()].map((session) => this.cancelSessionWork(session, ACP_SHUTDOWN_ABORT_TIMEOUT_MS)));
	}
	handleGatewayReconnect() {
		this.agentEvents.replayApprovalDecisionsOnReconnect();
		this.disconnects.handleGatewayReconnect();
	}
	handleGatewayDisconnect(reason) {
		this.disconnects.handleGatewayDisconnect(reason);
	}
	async handleGatewayEvent(evt) {
		if (evt.event === "chat") {
			await this.handleChatEvent(evt);
			return;
		}
		if (evt.event === "exec.approval.requested") {
			this.agentEvents.handleExecApprovalRequestEvent(evt);
			return;
		}
		if (evt.event === "agent") await this.agentEvents.handleAgentEvent(evt);
	}
	async prompt(params) {
		const session = this.sessionStore.getSession(params.sessionId);
		if (!session) throw new Error(`Session ${params.sessionId} not found`);
		const admission = {
			session,
			previous: this.pendingPromptAdmissions.get(params.sessionId),
			closed: this.stopped,
			closure: createDeferredCore(),
			settled: createDeferredCore()
		};
		this.pendingPromptAdmissions.set(params.sessionId, admission);
		if (admission.previous) admission.previous.closed = true;
		try {
			if (!this.ownsPromptAdmission(admission)) return { stopReason: "cancelled" };
			if (session.abortController || this.pendingPrompts.has(params.sessionId)) {
				await Promise.race([this.cancelSessionWork(session, void 0, admission), admission.closure.promise]);
				if (!this.ownsPromptAdmission(admission)) return { stopReason: "cancelled" };
			}
			if (admission.previous) {
				await Promise.race([admission.previous.settled.promise, admission.closure.promise]);
				if (!this.ownsPromptAdmission(admission)) return { stopReason: "cancelled" };
				admission.previous = void 0;
			}
			return await Promise.race([this.submitPrompt(params, session), admission.closure.promise.then(() => ({ stopReason: "cancelled" }))]);
		} finally {
			admission.settled.resolve();
			if (this.pendingPromptAdmissions.get(params.sessionId) === admission) this.pendingPromptAdmissions.delete(params.sessionId);
		}
	}
	submitPrompt(params, session) {
		const meta = parseSessionMeta(params["_meta"]);
		const userText = extractTextFromPrompt(params.prompt, getMaxPromptBytes());
		const attachments = extractAttachmentsFromPrompt(params.prompt);
		const prefixCwd = meta.prefixCwd ?? this.opts.prefixCwd ?? true;
		const displayCwd = shortenHomePath(session.cwd);
		const message = prefixCwd ? `[Working directory: ${displayCwd}]\n\n${userText}` : userText;
		const provenanceMode = this.opts.provenanceMode ?? "off";
		const systemInputProvenance = provenanceMode === "off" ? void 0 : buildSystemInputProvenance(params.sessionId);
		const systemProvenanceReceipt = provenanceMode === "meta+receipt" ? buildSystemProvenanceReceipt({
			cwd: session.cwd,
			sessionId: params.sessionId,
			sessionKey: session.sessionKey
		}) : void 0;
		const maxPromptBytes = getMaxPromptBytes();
		if (Buffer.byteLength(message, "utf-8") > maxPromptBytes) throw new Error(`Prompt exceeds maximum allowed size of ${maxPromptBytes} bytes`);
		const abortController = new AbortController();
		const runId = randomUUID();
		this.sessionStore.setActiveRun(params.sessionId, runId, abortController);
		const requestParams = {
			sessionKey: session.sessionKey,
			message,
			attachments: attachments.length > 0 ? attachments : void 0,
			idempotencyKey: runId,
			thinking: readMetadataString(params["_meta"], ["thinking", "thinkingLevel"]),
			deliver: readBool(params["_meta"], ["deliver"]),
			timeoutMs: readNonNegativeInteger(params["_meta"], ["timeoutMs"])
		};
		return new Promise((resolve, reject) => {
			this.pendingPrompts.set(params.sessionId, {
				sessionId: params.sessionId,
				sessionKey: session.sessionKey,
				...session.ledgerSessionId ? { ledgerSessionId: session.ledgerSessionId } : {},
				idempotencyKey: runId,
				disconnectContext: this.disconnects.activeContext ?? void 0,
				resolve,
				reject
			});
			this.disconnects.armForActiveContext();
			const sendWithProvenanceFallback = async () => {
				const markSendAccepted = () => {
					const pending = this.getPendingPrompt(params.sessionId, runId);
					if (!pending) return false;
					pending.sendAccepted = true;
					return true;
				};
				const applyTerminalAck = async (ack) => {
					const status = normalizeTerminalChatSendAckStatus(ack?.status);
					const pending = () => this.getPendingPrompt(params.sessionId, runId);
					if (status === "timeout") {
						const current = pending();
						if (current) await this.finishPrompt(params.sessionId, current, "cancelled");
						return true;
					}
					if (status === "error") {
						const current = pending();
						if (current) await this.rejectPendingPrompt(current, /* @__PURE__ */ new Error("Chat failed before the run started; try again."));
						return true;
					}
					if (status === "ok") {
						if (!markSendAccepted()) return true;
						await this.sessionUpdates.recordUserPrompt(session, runId, params.prompt);
						const current = pending();
						if (current) await this.finishPrompt(params.sessionId, current, "end_turn");
						return true;
					}
					return false;
				};
				const sendChat = async (payload) => {
					const ack = await this.gateway.request("chat.send", payload, { timeoutMs: null });
					return await applyTerminalAck(ack);
				};
				try {
					if (await sendChat({
						...requestParams,
						systemInputProvenance,
						systemProvenanceReceipt
					})) return;
					if (!markSendAccepted()) return;
					await this.sessionUpdates.recordUserPrompt(session, runId, params.prompt);
				} catch (err) {
					if ((systemInputProvenance || systemProvenanceReceipt) && isAdminScopeProvenanceRejection(err)) {
						if (!this.getPendingPrompt(params.sessionId, runId)) return;
						if (await sendChat(requestParams)) return;
						if (!markSendAccepted()) return;
						await this.sessionUpdates.recordUserPrompt(session, runId, params.prompt);
						return;
					}
					throw err;
				}
			};
			sendWithProvenanceFallback().catch(async (err) => {
				const promptKey = this.pendingPromptKey(params.sessionId, runId);
				if (this.settlingPromptKeys.has(promptKey)) return;
				if (isGatewayCloseError(err) && this.getPendingPrompt(params.sessionId, runId)) return;
				const error = err instanceof Error ? err : new Error(String(err));
				const current = this.getPendingPrompt(params.sessionId, runId);
				if (current) await this.rejectPendingPrompt(current, error);
			});
		});
	}
	async cancel(params) {
		const session = this.sessionStore.getSession(params.sessionId);
		if (!session) return;
		await this.cancelSessionWork(session);
	}
	async cancelSessionWork(session, abortTimeoutMs, retainedAdmission) {
		const closingAdmissions = [];
		if (!retainedAdmission) {
			let admission = this.pendingPromptAdmissions.get(session.sessionId);
			while (admission) {
				admission.closed = true;
				admission.closure.resolve();
				closingAdmissions.push(admission.settled.promise);
				admission = admission.previous;
			}
		}
		const pending = this.pendingPrompts.get(session.sessionId);
		const scopedRunId = session.activeRunId ?? pending?.idempotencyKey;
		if (!scopedRunId) {
			await Promise.all(closingAdmissions);
			return;
		}
		this.sessionStore.cancelActiveRun(session.sessionId, scopedRunId);
		if (pending?.idempotencyKey === scopedRunId && this.claimPendingPrompt(pending)) pending.resolve({ stopReason: "cancelled" });
		try {
			const abortParams = {
				sessionKey: session.sessionKey,
				runId: scopedRunId
			};
			await (abortTimeoutMs === void 0 ? this.gateway.request("chat.abort", abortParams) : this.gateway.request("chat.abort", abortParams, { timeoutMs: abortTimeoutMs }));
		} catch (err) {
			this.log(`cancel error: ${String(err)}`);
		}
		await Promise.all(closingAdmissions);
	}
	ownsPromptAdmission(admission) {
		return !this.stopped && !admission.closed && this.pendingPromptAdmissions.get(admission.session.sessionId) === admission && this.sessionStore.getSession(admission.session.sessionId) === admission.session;
	}
	pendingPromptKey(sessionId, runId) {
		return `${sessionId}\u0000${runId}`;
	}
	getPendingPrompt(sessionId, runId) {
		const pending = this.pendingPrompts.get(sessionId);
		if (pending?.idempotencyKey !== runId) return;
		return pending;
	}
	claimPendingPrompt(pending) {
		if (this.getPendingPrompt(pending.sessionId, pending.idempotencyKey) !== pending) return false;
		this.agentEvents.clearApprovalRelaysForPrompt(pending.sessionId, pending.idempotencyKey, { denyActive: true });
		this.pendingPrompts.delete(pending.sessionId);
		this.sessionStore.clearActiveRun(pending.sessionId, pending.idempotencyKey);
		this.disconnects.clearWhenIdle();
		return true;
	}
	async handleChatEvent(evt) {
		const payload = evt.payload;
		if (!payload) return;
		const sessionKey = payload.sessionKey;
		const state = payload.state;
		const runId = payload.runId;
		const messageData = payload.message;
		if (!sessionKey || !state) return;
		const pending = this.findPendingBySessionKey(sessionKey, runId);
		if (!pending) return;
		if (messageData && (state === "delta" || state === "final")) {
			if (!await this.handleDeltaEvent(pending, messageData) || this.getPendingPrompt(pending.sessionId, pending.idempotencyKey) !== pending || state === "delta") return;
		}
		if (state === "final") {
			const stopReason = payload.stopReason === "max_tokens" ? "max_tokens" : "end_turn";
			await this.finishPrompt(pending.sessionId, pending, stopReason);
			return;
		}
		if (state === "aborted") {
			const interruption = typeof payload.errorMessage === "string" ? payload.errorMessage : void 0;
			await this.finishPrompt(pending.sessionId, pending, "cancelled", { interruption });
			return;
		}
		if (state === "error") {
			const stopReason = payload.errorKind === "refusal" ? "refusal" : "end_turn";
			this.finishPrompt(pending.sessionId, pending, stopReason);
		}
	}
	async handleDeltaEvent(pending, messageData) {
		const content = messageData.content;
		const sessionId = pending.sessionId;
		if (this.getPendingPrompt(sessionId, pending.idempotencyKey) !== pending) return false;
		const fullThought = content?.filter((block) => block?.type === "thinking").map((block) => block.thinking ?? "").join("\n").trimEnd();
		const sentThoughtSoFar = pending.sentThought?.length ?? 0;
		if (fullThought && fullThought.length > sentThoughtSoFar) {
			const newThought = fullThought.slice(sentThoughtSoFar);
			pending.sentThought = fullThought;
			await this.emitPromptChunk(pending, "agent_thought_chunk", newThought);
			if (this.getPendingPrompt(sessionId, pending.idempotencyKey) !== pending) return false;
		}
		const fullText = content?.filter((block) => block?.type === "text").map((block) => block.text ?? "").join("\n").trimEnd();
		const sentSoFar = pending.sentText?.length ?? 0;
		if (!fullText || fullText.length <= sentSoFar) return true;
		const newText = fullText.slice(sentSoFar);
		pending.sentText = fullText;
		await this.emitPromptChunk(pending, "agent_message_chunk", newText);
		return this.getPendingPrompt(sessionId, pending.idempotencyKey) === pending;
	}
	async finishPrompt(sessionId, pending, stopReason, options = {}) {
		if (!options.claimed && !this.claimPendingPrompt(pending)) return;
		if (options.interruption) await this.emitPromptChunk(pending, "agent_message_chunk", `[OpenClaw interruption] ${options.interruption}`, false);
		const promptKey = this.pendingPromptKey(sessionId, pending.idempotencyKey);
		this.settlingPromptKeys.add(promptKey);
		try {
			const sessionSnapshot = await this.sessionState.getSnapshot(pending.sessionKey);
			try {
				await this.sessionState.sendSnapshotUpdate({
					sessionId,
					sessionKey: pending.sessionKey,
					...pending.ledgerSessionId ? { ledgerSessionId: pending.ledgerSessionId } : {}
				}, sessionSnapshot, {
					includeControls: false,
					record: true,
					runId: pending.idempotencyKey
				});
			} catch (err) {
				this.log(`session snapshot update failed for ${sessionId}: ${String(err)}`);
			}
			pending.resolve({ stopReason });
		} finally {
			this.settlingPromptKeys.delete(promptKey);
		}
	}
	async emitPromptChunk(pending, kind, text, waitForDelivery = true) {
		await this.sessionUpdates.emit({
			sessionId: pending.sessionId,
			sessionKey: pending.sessionKey,
			...pending.ledgerSessionId ? { ledgerSessionId: pending.ledgerSessionId } : {},
			runId: pending.idempotencyKey,
			record: true,
			...waitForDelivery ? {} : { waitForDelivery: false },
			update: {
				sessionUpdate: kind,
				content: {
					type: "text",
					text
				}
			}
		});
	}
	async settleRecoveredPrompt(sessionId, pending, result) {
		if (!this.claimPendingPrompt(pending)) return;
		const terminalReply = result.terminalReply;
		if (terminalReply?.disposition === "visible") {
			const sentText = (pending.sentText ?? "").trimStart();
			const recoveredText = terminalReply.text.startsWith(sentText) ? terminalReply.text.slice(sentText.length) : "";
			if (recoveredText) await this.emitPromptChunk(pending, "agent_message_chunk", recoveredText, false);
		}
		if (result.status !== "error") {
			await this.finishPrompt(sessionId, pending, "end_turn", { claimed: true });
			return;
		}
		const message = result.error?.trim() || "run failed";
		await this.emitPromptChunk(pending, "agent_message_chunk", `[OpenClaw interruption] ${message}`, false);
		await this.rejectPendingPrompt(pending, new Error(message), { claimed: true });
	}
	findPendingBySessionKey(sessionKey, runId) {
		for (const pending of this.pendingPrompts.values()) {
			if (pending.sessionKey !== sessionKey) continue;
			if (runId && pending.idempotencyKey !== runId) continue;
			return pending;
		}
		if (runId) for (const pending of this.pendingPrompts.values()) {
			if (pending.idempotencyKey !== runId) continue;
			this.reconcilePendingSessionKey(pending, sessionKey);
			return pending;
		}
	}
	reconcilePendingSessionKey(pending, sessionKey) {
		if (pending.sessionKey === sessionKey) return;
		this.log(`session key reconciled: ${pending.sessionKey} -> ${sessionKey}`);
		pending.sessionKey = sessionKey;
		const session = this.sessionStore.getSession(pending.sessionId);
		if (session?.activeRunId === pending.idempotencyKey) session.sessionKey = sessionKey;
	}
	async rejectPendingPrompt(pending, error, options = {}) {
		if (!options.claimed && !this.claimPendingPrompt(pending)) return;
		const promptKey = this.pendingPromptKey(pending.sessionId, pending.idempotencyKey);
		this.settlingPromptKeys.add(promptKey);
		try {
			if (options.recordDisconnectNotice) {
				const text = pending.sendAccepted ? "[OpenClaw interruption] The Gateway disconnected after accepting this message, so its final outcome is unknown. Check the session before retrying." : "[OpenClaw interruption] The Gateway disconnected before OpenClaw could confirm whether this message was accepted, so its final outcome is unknown. Check the session before retrying.";
				await this.emitPromptChunk(pending, "agent_message_chunk", text, false);
			}
		} catch (noticeError) {
			this.log(`disconnect notice failed for ${pending.idempotencyKey}: ${String(noticeError)}`);
		} finally {
			pending.reject(error);
			this.settlingPromptKeys.delete(promptKey);
		}
	}
};
//#endregion
//#region src/acp/translator.replay.ts
function extractReplayChunks(message) {
	const role = typeof message.role === "string" ? message.role : "";
	if (role !== "user" && role !== "assistant") return [];
	if (typeof message.content === "string") return message.content.length > 0 ? [{
		sessionUpdate: role === "user" ? "user_message_chunk" : "agent_message_chunk",
		text: message.content
	}] : [];
	if (!Array.isArray(message.content)) return [];
	const replayChunks = [];
	for (const block of message.content) {
		if (!block || typeof block !== "object" || Array.isArray(block)) continue;
		const typedBlock = block;
		if (typedBlock.type === "text" && typeof typedBlock.text === "string" && typedBlock.text) {
			replayChunks.push({
				sessionUpdate: role === "user" ? "user_message_chunk" : "agent_message_chunk",
				text: typedBlock.text
			});
			continue;
		}
		if (role === "assistant" && typedBlock.type === "thinking" && typeof typedBlock.thinking === "string" && typedBlock.thinking) replayChunks.push({
			sessionUpdate: "agent_thought_chunk",
			text: typedBlock.thinking
		});
	}
	return replayChunks;
}
//#endregion
//#region src/acp/translator.session-list.ts
/** Cursor and pagination helpers for ACP session/list requests. */
const ACP_LIST_SESSIONS_DEFAULT_PAGE_SIZE = 100;
const ACP_LIST_SESSIONS_MAX_PAGE_SIZE = 100;
const ACP_LIST_SESSIONS_MAX_CURSOR_OFFSET = 1e4;
/** Maximum rows fetched to satisfy ACP session-list pagination plus next-page detection. */
const ACP_LIST_SESSIONS_MAX_FETCH_LIMIT = 10101;
/** Encodes an ACP session-list cursor as base64url JSON. */
function encodeListSessionsCursor(cursor) {
	return Buffer.from(JSON.stringify({
		v: 1,
		...cursor
	}), "utf8").toString("base64url");
}
/** Decodes and validates an ACP session-list cursor, defaulting to the first page. */
function decodeListSessionsCursor(value) {
	if (value === null || value === void 0) return { offset: 0 };
	let parsed;
	try {
		const bytes = Buffer.from(value, "base64url");
		if (bytes.toString("base64url") !== value) throw new Error("non-canonical base64url");
		parsed = JSON.parse(bytes.toString("utf8"));
	} catch {
		throw new Error("Invalid ACP session list cursor.");
	}
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid ACP session list cursor.");
	const record = parsed;
	if (record.v !== 1) throw new Error("Unsupported ACP session list cursor.");
	if (typeof record.offset !== "number" || !Number.isSafeInteger(record.offset) || record.offset < 0 || record.offset > ACP_LIST_SESSIONS_MAX_CURSOR_OFFSET) throw new Error("Invalid ACP session list cursor offset.");
	const cwd = normalizeOptionalString(record.cwd);
	const cursor = {
		offset: record.offset,
		...cwd ? { cwd } : {}
	};
	if (encodeListSessionsCursor(cursor) !== value) throw new Error("Invalid ACP session list cursor.");
	return cursor;
}
/** Throws when an ACP method receives a relative cwd filter/path. */
function assertAbsoluteCwd(cwd, method) {
	if (!path.isAbsolute(cwd)) throw new Error(`ACP ${method} requires an absolute cwd.`);
}
/** Resolves requested ACP session-list page size with bridge limits. */
function resolveListSessionsPageSize(meta) {
	const requested = readMetadataNumber(meta, ["limit", "pageSize"]);
	if (requested === void 0) return ACP_LIST_SESSIONS_DEFAULT_PAGE_SIZE;
	return Math.min(ACP_LIST_SESSIONS_MAX_PAGE_SIZE, Math.max(1, Math.floor(requested)));
}
//#endregion
//#region src/acp/translator.session-lifecycle.ts
/** ACP session creation, loading, listing, resuming, closing, and configuration. */
const ACP_LOAD_SESSION_REPLAY_LIMIT = 1e6;
function hasExplicitSessionRouting(meta, opts) {
	return Boolean(meta.sessionKey || meta.sessionLabel || opts.defaultSessionKey || opts.defaultSessionLabel);
}
var AcpTranslatorSessionLifecycle = class {
	constructor(gateway, opts, sessionStore, sessionUpdates, sessionState, sessionCreateRateLimiter, cancelSessionWork, log) {
		this.gateway = gateway;
		this.opts = opts;
		this.sessionStore = sessionStore;
		this.sessionUpdates = sessionUpdates;
		this.sessionState = sessionState;
		this.sessionCreateRateLimiter = sessionCreateRateLimiter;
		this.cancelSessionWork = cancelSessionWork;
		this.log = log;
	}
	async newSession(params) {
		this.assertSupportedSessionSetup(params.mcpServers);
		this.enforceSessionCreateRateLimit("newSession");
		const sessionId = randomUUID();
		const meta = parseSessionMeta(params["_meta"]);
		const sessionKey = await this.resolveSessionKeyFromMeta({
			meta,
			fallbackKey: `acp-bridge:${sessionId}`
		});
		const session = this.sessionStore.createSession({
			sessionId,
			sessionKey,
			cwd: params.cwd
		});
		await this.sessionUpdates.startLedgerSession(session, {
			complete: true,
			reset: true
		});
		this.log(`newSession: ${session.sessionId} -> ${session.sessionKey}`);
		const sessionSnapshot = await this.sessionState.getSnapshot(session.sessionKey);
		await this.sessionState.sendSnapshotUpdate(session, sessionSnapshot, {
			includeControls: false,
			record: true
		});
		await this.sessionUpdates.sendAvailableCommands(session, { record: true });
		const { configOptions, modes } = sessionSnapshot;
		return {
			sessionId: session.sessionId,
			configOptions,
			modes
		};
	}
	async loadSession(params) {
		this.assertSupportedSessionSetup(params.mcpServers);
		if (!this.sessionStore.hasSession(params.sessionId)) this.enforceSessionCreateRateLimit("loadSession");
		const meta = parseSessionMeta(params["_meta"]);
		const hasExplicitRouting = hasExplicitSessionRouting(meta, this.opts);
		const exactLedgerReplay = hasExplicitRouting ? {
			complete: false,
			events: []
		} : await this.sessionUpdates.readLedgerReplayBySessionId(params.sessionId);
		const listedLedgerReplay = !hasExplicitRouting && !exactLedgerReplay.complete ? await this.sessionUpdates.readLedgerReplayBySessionKey(params.sessionId) : {
			complete: false,
			events: []
		};
		const routedLedgerReplay = exactLedgerReplay.complete ? exactLedgerReplay : listedLedgerReplay;
		const sessionKey = await this.resolveSessionKeyFromMeta({
			meta,
			fallbackKey: routedLedgerReplay.sessionKey ?? params.sessionId
		});
		const ledgerReplay = exactLedgerReplay.complete && exactLedgerReplay.sessionKey === sessionKey ? exactLedgerReplay : listedLedgerReplay.complete && listedLedgerReplay.sessionKey === sessionKey ? listedLedgerReplay : await this.sessionUpdates.readLedgerReplay({
			sessionId: params.sessionId,
			sessionKey
		});
		const session = this.sessionStore.createSession({
			sessionId: params.sessionId,
			sessionKey,
			...ledgerReplay.sessionId ? { ledgerSessionId: ledgerReplay.sessionId } : {},
			cwd: params.cwd
		});
		await this.sessionUpdates.startLedgerSession(session, { complete: ledgerReplay.complete });
		this.log(`loadSession: ${session.sessionId} -> ${session.sessionKey}`);
		const [sessionSnapshot, transcript] = await Promise.all([this.sessionState.getSnapshot(session.sessionKey), ledgerReplay.complete ? Promise.resolve([]) : this.getSessionTranscript(session.sessionKey).catch((err) => {
			this.log(`session transcript fallback for ${session.sessionKey}: ${String(err)}`);
			return [];
		})]);
		if (ledgerReplay.complete) await this.replayLedgerSession(session.sessionId, ledgerReplay);
		else await this.replaySessionTranscript(session.sessionId, transcript);
		await this.sessionState.sendSnapshotUpdate(session, sessionSnapshot, {
			includeControls: false,
			record: false
		});
		await this.sessionUpdates.sendAvailableCommands(session, { record: false });
		const { configOptions, modes } = sessionSnapshot;
		return {
			configOptions,
			modes
		};
	}
	async listSessions(params) {
		const requestedCwd = normalizeOptionalString(params.cwd);
		if (requestedCwd) assertAbsoluteCwd(requestedCwd, "session/list");
		const fallbackCwd = requestedCwd ?? process.cwd();
		const rawCursor = params.cursor;
		const cursor = decodeListSessionsCursor(rawCursor);
		if (rawCursor && cursor.cwd !== requestedCwd) throw new Error("ACP session list cursor does not match the cwd filter.");
		const pageSize = resolveListSessionsPageSize(params["_meta"]);
		const start = cursor.offset;
		const end = start + pageSize;
		let fetchLimit = end + 1;
		let rows = [];
		while (true) {
			const result = await this.gateway.request("sessions.list", {
				limit: fetchLimit,
				includeDerivedTitles: true
			});
			rows = result.sessions.filter((session) => {
				if (!requestedCwd) return true;
				return (normalizeOptionalString(session.spawnedCwd) ?? normalizeOptionalString(session.spawnedWorkspaceDir)) === requestedCwd;
			}).map((session) => this.sessionState.mapGatewaySession(session, fallbackCwd));
			if (rows.length > end || result.hasMore !== true || fetchLimit >= 10101) break;
			fetchLimit = Math.min(fetchLimit * 2, ACP_LIST_SESSIONS_MAX_FETCH_LIMIT);
		}
		return {
			sessions: rows.slice(start, end),
			nextCursor: rows.length > end ? encodeListSessionsCursor({
				offset: end,
				...requestedCwd ? { cwd: requestedCwd } : {}
			}) : null
		};
	}
	async resumeSession(params) {
		this.assertSupportedSessionSetup(params.mcpServers ?? []);
		assertAbsoluteCwd(params.cwd, "session/resume");
		const existingSession = this.sessionStore.getSession(params.sessionId);
		if (!existingSession) this.enforceSessionCreateRateLimit("resumeSession");
		const meta = parseSessionMeta(params["_meta"]);
		const fallbackKey = existingSession?.sessionKey ?? params.sessionId;
		const sessionKey = await this.resolveSessionKeyFromMeta({
			meta,
			fallbackKey
		});
		const sessionSnapshot = !existingSession || sessionKey !== existingSession.sessionKey ? await this.sessionState.getExistingSnapshot(sessionKey) : await this.sessionState.getSnapshot(sessionKey);
		const session = this.sessionStore.createSession({
			sessionId: params.sessionId,
			sessionKey,
			cwd: params.cwd
		});
		await this.sessionUpdates.startLedgerSession(session, { complete: false });
		this.log(`resumeSession: ${session.sessionId} -> ${session.sessionKey}`);
		await this.sessionState.sendSnapshotUpdate(session, sessionSnapshot, {
			includeControls: false,
			record: false
		});
		await this.sessionUpdates.sendAvailableCommands(session, { record: false });
		const { configOptions, modes } = sessionSnapshot;
		return {
			configOptions,
			modes
		};
	}
	async closeSession(params) {
		const session = this.sessionStore.getSession(params.sessionId);
		if (!session) throw new Error(`Session ${params.sessionId} not found`);
		await this.cancelSessionWork(session);
		this.sessionStore.deleteSession(params.sessionId);
		this.log(`closeSession: ${params.sessionId}`);
		return {};
	}
	async authenticate(_params) {
		return {};
	}
	async setSessionMode(params) {
		const session = this.sessionStore.getSession(params.sessionId);
		if (!session) throw new Error(`Session ${params.sessionId} not found`);
		if (!params.modeId) return {};
		try {
			await this.gateway.request("sessions.patch", {
				key: session.sessionKey,
				thinkingLevel: params.modeId
			});
			this.log(`setSessionMode: ${session.sessionId} -> ${params.modeId}`);
			const sessionSnapshot = await this.sessionState.getSnapshot(session.sessionKey, { thinkingLevel: params.modeId });
			await this.sessionState.sendSnapshotUpdate(session, sessionSnapshot, {
				includeControls: true,
				record: true
			});
		} catch (err) {
			this.log(`setSessionMode error: ${String(err)}`);
			throw err instanceof Error ? err : new Error(String(err));
		}
		return {};
	}
	async setSessionConfigOption(params) {
		const session = this.sessionStore.getSession(params.sessionId);
		if (!session) throw new Error(`Session ${params.sessionId} not found`);
		const sessionPatch = this.sessionState.resolveConfigPatch(params.configId, params.value);
		try {
			if (sessionPatch.patch) await this.gateway.request("sessions.patch", {
				key: session.sessionKey,
				...sessionPatch.patch
			});
			this.log(`setSessionConfigOption: ${session.sessionId} -> ${params.configId}=${params.value}`);
			const sessionSnapshot = await this.sessionState.getSnapshot(session.sessionKey, sessionPatch.overrides);
			await this.sessionState.sendSnapshotUpdate(session, sessionSnapshot, {
				includeControls: true,
				record: true
			});
			return { configOptions: sessionSnapshot.configOptions };
		} catch (err) {
			this.log(`setSessionConfigOption error: ${String(err)}`);
			throw err instanceof Error ? err : new Error(String(err));
		}
	}
	async resolveSessionKeyFromMeta(params) {
		const sessionKey = await resolveAcpSessionKey({
			meta: params.meta,
			fallbackKey: params.fallbackKey,
			gateway: this.gateway,
			opts: this.opts
		});
		await resetSessionIfNeeded({
			meta: params.meta,
			sessionKey,
			gateway: this.gateway,
			opts: this.opts
		});
		return sessionKey;
	}
	async getSessionTranscript(sessionKey) {
		const result = await this.gateway.request("sessions.get", {
			key: sessionKey,
			limit: ACP_LOAD_SESSION_REPLAY_LIMIT
		});
		if (!Array.isArray(result.messages)) return [];
		return result.messages;
	}
	async replaySessionTranscript(sessionId, transcript) {
		for (const message of transcript) {
			const replayChunks = extractReplayChunks(message);
			for (const chunk of replayChunks) await this.sessionUpdates.emit({
				sessionId,
				update: {
					sessionUpdate: chunk.sessionUpdate,
					content: {
						type: "text",
						text: chunk.text
					}
				}
			});
		}
	}
	async replayLedgerSession(sessionId, ledgerReplay) {
		for (const event of ledgerReplay.events) await this.sessionUpdates.emit({
			sessionId,
			update: event.update,
			record: false
		});
	}
	assertSupportedSessionSetup(mcpServers) {
		if (mcpServers.length === 0) return;
		throw new Error("ACP bridge mode does not support per-session MCP servers. Configure MCP on the OpenClaw gateway or agent instead.");
	}
	enforceSessionCreateRateLimit(method) {
		const budget = this.sessionCreateRateLimiter.consume();
		if (budget.allowed) return;
		throw new Error(`ACP session creation rate limit exceeded for ${method}; retry after ${Math.ceil(budget.retryAfterMs / 1e3)}s.`);
	}
};
//#endregion
//#region src/acp/translator.presentation.ts
/** ACP config option ids exposed to compatible ACP clients. */
const ACP_THOUGHT_LEVEL_CONFIG_ID = "thought_level";
const ACP_FAST_MODE_CONFIG_ID = "fast_mode";
const ACP_VERBOSE_LEVEL_CONFIG_ID = "verbose_level";
const ACP_TRACE_LEVEL_CONFIG_ID = "trace_level";
const ACP_REASONING_LEVEL_CONFIG_ID = "reasoning_level";
const ACP_RESPONSE_USAGE_CONFIG_ID = "response_usage";
const ACP_ELEVATED_LEVEL_CONFIG_ID = "elevated_level";
const ACP_TIMEOUT_CONFIG_ID = "timeout";
const ACP_TIMEOUT_SECONDS_CONFIG_ID = "timeout_seconds";
function formatThinkingLevelName(level) {
	switch (level) {
		case "xhigh": return "Extra High";
		case "adaptive": return "Adaptive";
		default: return level.length > 0 ? `${level.charAt(0).toUpperCase()}${level.slice(1)}` : "Unknown";
	}
}
function buildThinkingModeDescription(level) {
	if (level === "adaptive") return "Use the Gateway session default thought level.";
}
function formatConfigValueName(value) {
	switch (value) {
		case "xhigh": return "Extra High";
		default: return value.length > 0 ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : "Unknown";
	}
}
function buildSelectConfigOption(params) {
	return {
		type: "select",
		id: params.id,
		name: params.name,
		category: params.category,
		description: params.description,
		currentValue: params.currentValue,
		options: params.values.map((value) => ({
			value,
			name: formatConfigValueName(value)
		}))
	};
}
function buildSessionPresentation(params) {
	const row = {
		...params.row,
		...params.overrides
	};
	const availableLevelIds = row.thinkingLevels?.map((level) => level.id) ?? [...BASE_THINKING_LEVELS];
	const currentModeId = normalizeOptionalString(row.thinkingLevel) || "adaptive";
	const currentFastMode = normalizeFastMode(row.effectiveFastMode ?? row.fastMode) ?? false;
	if (!availableLevelIds.includes(currentModeId)) availableLevelIds.push(currentModeId);
	const modes = {
		currentModeId,
		availableModes: availableLevelIds.map((level) => ({
			id: level,
			name: formatThinkingLevelName(level),
			description: buildThinkingModeDescription(level)
		}))
	};
	return {
		configOptions: [
			buildSelectConfigOption({
				id: ACP_THOUGHT_LEVEL_CONFIG_ID,
				name: "Thought level",
				category: "thought_level",
				description: "Controls how much deliberate reasoning OpenClaw requests from the Gateway model.",
				currentValue: currentModeId,
				values: availableLevelIds
			}),
			buildSelectConfigOption({
				id: ACP_FAST_MODE_CONFIG_ID,
				name: "Fast mode",
				description: "Controls whether OpenAI sessions use the Gateway fast-mode profile.",
				currentValue: currentFastMode === "auto" ? "auto" : currentFastMode ? "on" : "off",
				values: [
					"off",
					"auto",
					"on"
				]
			}),
			buildSelectConfigOption({
				id: ACP_VERBOSE_LEVEL_CONFIG_ID,
				name: "Tool verbosity",
				description: "Controls how much tool progress and output detail OpenClaw keeps enabled for the session.",
				currentValue: normalizeOptionalString(row.verboseLevel) || "off",
				values: [
					"off",
					"on",
					"full"
				]
			}),
			buildSelectConfigOption({
				id: ACP_TRACE_LEVEL_CONFIG_ID,
				name: "Plugin trace",
				description: "Controls whether plugin-owned trace lines are shown for the session.",
				currentValue: normalizeOptionalString(row.traceLevel) || "off",
				values: ["off", "on"]
			}),
			buildSelectConfigOption({
				id: ACP_REASONING_LEVEL_CONFIG_ID,
				name: "Reasoning stream",
				description: "Controls whether reasoning-capable models emit reasoning text for the session.",
				currentValue: normalizeOptionalString(row.reasoningLevel) || "off",
				values: [
					"off",
					"on",
					"stream"
				]
			}),
			buildSelectConfigOption({
				id: ACP_RESPONSE_USAGE_CONFIG_ID,
				name: "Usage detail",
				description: "Controls how much usage information OpenClaw attaches to responses for the session. 'inherit' follows the configured default; 'off' explicitly disables it for this session.",
				currentValue: normalizeOptionalString(row.responseUsage) || "inherit",
				values: [
					"inherit",
					"off",
					"tokens",
					"full"
				]
			}),
			buildSelectConfigOption({
				id: ACP_ELEVATED_LEVEL_CONFIG_ID,
				name: "Elevated actions",
				description: "Controls how aggressively the session allows elevated execution behavior.",
				currentValue: normalizeOptionalString(row.elevatedLevel) || "off",
				values: [
					"off",
					"on",
					"ask",
					"full"
				]
			})
		],
		modes
	};
}
function buildSessionMetadata(params) {
	return {
		title: normalizeOptionalString(params.row?.derivedTitle) || normalizeOptionalString(params.row?.displayName) || normalizeOptionalString(params.row?.label) || params.sessionKey,
		updatedAt: timestampMsToIsoString(params.row?.updatedAt) ?? null,
		_meta: toAcpSessionLineageMeta(params.row ?? {
			key: params.sessionKey,
			kind: "unknown"
		})
	};
}
function buildSessionUsageSnapshot(row) {
	const totalTokens = row?.totalTokens;
	const contextTokens = row?.contextTokens;
	if (row?.totalTokensFresh !== true || typeof totalTokens !== "number" || !Number.isFinite(totalTokens) || typeof contextTokens !== "number" || !Number.isFinite(contextTokens) || contextTokens <= 0) return;
	const size = Math.max(0, Math.floor(contextTokens));
	return {
		size,
		used: Math.max(0, Math.min(Math.floor(totalTokens), size))
	};
}
//#endregion
//#region src/acp/translator.session-state.ts
var AcpTranslatorSessionState = class {
	constructor(gateway, sessionUpdates, log) {
		this.gateway = gateway;
		this.sessionUpdates = sessionUpdates;
		this.log = log;
	}
	async getSnapshot(sessionKey, overrides) {
		try {
			const row = await this.getGatewaySessionRow(sessionKey);
			return {
				...buildSessionPresentation({
					row,
					overrides
				}),
				metadata: buildSessionMetadata({
					row,
					sessionKey
				}),
				usage: buildSessionUsageSnapshot(row)
			};
		} catch (err) {
			this.log(`session presentation fallback for ${sessionKey}: ${String(err)}`);
			return {
				...buildSessionPresentation({ overrides }),
				metadata: buildSessionMetadata({ sessionKey })
			};
		}
	}
	async getExistingSnapshot(sessionKey) {
		const row = await this.getGatewaySessionRow(sessionKey);
		if (!row) throw new Error(`Session ${sessionKey} not found`);
		return {
			...buildSessionPresentation({ row }),
			metadata: buildSessionMetadata({
				row,
				sessionKey
			}),
			usage: buildSessionUsageSnapshot(row)
		};
	}
	mapGatewaySession(session, fallbackCwd) {
		const cwd = normalizeOptionalString(session.spawnedCwd) ?? normalizeOptionalString(session.spawnedWorkspaceDir) ?? fallbackCwd;
		return {
			sessionId: session.key,
			cwd,
			title: session.derivedTitle ?? session.displayName ?? session.label ?? session.key,
			updatedAt: timestampMsToIsoString(session.updatedAt),
			_meta: toAcpSessionLineageMeta(session)
		};
	}
	async sendSnapshotUpdate(session, sessionSnapshot, options) {
		if (options.includeControls) {
			await this.sessionUpdates.emit({
				sessionId: session.sessionId,
				sessionKey: session.sessionKey,
				...session.ledgerSessionId ? { ledgerSessionId: session.ledgerSessionId } : {},
				runId: options.runId,
				record: options.record,
				update: {
					sessionUpdate: "current_mode_update",
					currentModeId: sessionSnapshot.modes.currentModeId
				}
			});
			await this.sessionUpdates.emit({
				sessionId: session.sessionId,
				sessionKey: session.sessionKey,
				...session.ledgerSessionId ? { ledgerSessionId: session.ledgerSessionId } : {},
				runId: options.runId,
				record: options.record,
				update: {
					sessionUpdate: "config_option_update",
					configOptions: sessionSnapshot.configOptions
				}
			});
		}
		if (sessionSnapshot.metadata) await this.sessionUpdates.emit({
			sessionId: session.sessionId,
			sessionKey: session.sessionKey,
			...session.ledgerSessionId ? { ledgerSessionId: session.ledgerSessionId } : {},
			runId: options.runId,
			record: options.record,
			update: {
				sessionUpdate: "session_info_update",
				...sessionSnapshot.metadata
			}
		});
		if (sessionSnapshot.usage) await this.sessionUpdates.emit({
			sessionId: session.sessionId,
			sessionKey: session.sessionKey,
			...session.ledgerSessionId ? { ledgerSessionId: session.ledgerSessionId } : {},
			runId: options.runId,
			record: options.record,
			update: {
				sessionUpdate: "usage_update",
				used: sessionSnapshot.usage.used,
				size: sessionSnapshot.usage.size,
				_meta: {
					source: "gateway-session-store",
					approximate: true
				}
			}
		});
	}
	resolveConfigPatch(configId, value) {
		if (typeof value !== "string") throw new Error(`ACP bridge does not support non-string session config option values for "${configId}".`);
		switch (configId) {
			case ACP_THOUGHT_LEVEL_CONFIG_ID: return {
				patch: { thinkingLevel: value },
				overrides: { thinkingLevel: value }
			};
			case ACP_FAST_MODE_CONFIG_ID: {
				const fastMode = normalizeFastMode(value);
				if (fastMode === void 0) throw new Error(`Unsupported fast mode value: ${value}`);
				return {
					patch: { fastMode },
					overrides: { fastMode }
				};
			}
			case ACP_VERBOSE_LEVEL_CONFIG_ID: return {
				patch: { verboseLevel: value },
				overrides: { verboseLevel: value }
			};
			case ACP_TRACE_LEVEL_CONFIG_ID: return {
				patch: { traceLevel: value },
				overrides: { traceLevel: value }
			};
			case ACP_REASONING_LEVEL_CONFIG_ID: return {
				patch: { reasoningLevel: value },
				overrides: { reasoningLevel: value }
			};
			case ACP_RESPONSE_USAGE_CONFIG_ID: {
				const next = value === "inherit" ? null : value;
				return {
					patch: { responseUsage: next },
					overrides: { responseUsage: next }
				};
			}
			case ACP_ELEVATED_LEVEL_CONFIG_ID: return {
				patch: { elevatedLevel: value },
				overrides: { elevatedLevel: value }
			};
			case ACP_TIMEOUT_CONFIG_ID:
			case ACP_TIMEOUT_SECONDS_CONFIG_ID: return { overrides: {} };
			default: throw new Error(`ACP bridge mode does not support session config option "${configId}".`);
		}
	}
	async getGatewaySessionRow(sessionKey) {
		const session = (await this.gateway.request("sessions.list", {
			limit: 200,
			search: sessionKey,
			includeDerivedTitles: true
		})).sessions.find((entry) => entry.key === sessionKey);
		if (!session) return;
		return {
			key: session.key,
			kind: session.kind,
			channel: session.channel,
			parentSessionKey: session.parentSessionKey,
			spawnedBy: session.spawnedBy,
			spawnDepth: session.spawnDepth,
			subagentRole: session.subagentRole,
			subagentControlScope: session.subagentControlScope,
			spawnedWorkspaceDir: session.spawnedWorkspaceDir,
			spawnedCwd: session.spawnedCwd,
			displayName: session.displayName,
			label: session.label,
			derivedTitle: session.derivedTitle,
			updatedAt: session.updatedAt,
			thinkingLevel: session.thinkingLevel,
			thinkingLevels: session.thinkingLevels,
			modelProvider: session.modelProvider,
			model: session.model,
			fastMode: session.fastMode,
			effectiveFastMode: session.effectiveFastMode,
			verboseLevel: session.verboseLevel,
			traceLevel: session.traceLevel,
			reasoningLevel: session.reasoningLevel,
			responseUsage: session.responseUsage,
			elevatedLevel: session.elevatedLevel,
			totalTokens: session.totalTokens,
			totalTokensFresh: session.totalTokensFresh,
			contextTokens: session.contextTokens
		};
	}
};
//#endregion
//#region src/acp/commands.ts
const BASE_AVAILABLE_COMMANDS = [
	{
		name: "help",
		description: "Show help and common commands."
	},
	{
		name: "commands",
		description: "List available commands."
	},
	{
		name: "status",
		description: "Show current status."
	},
	{
		name: "context",
		description: "Explain context usage (list|detail|json).",
		input: { hint: "list | detail | json" }
	},
	{
		name: "whoami",
		description: "Show sender id (alias: /id)."
	},
	{
		name: "id",
		description: "Alias for /whoami."
	},
	{
		name: "subagents",
		description: "List or manage sub-agents."
	},
	{
		name: "config",
		description: "Read or write config (owner-only)."
	},
	{
		name: "debug",
		description: "Set runtime-only overrides (owner-only)."
	},
	{
		name: "usage",
		description: "Toggle usage footer (off|tokens|full|reset). 'reset'/'inherit'/'clear'/'default' clears the session override to re-inherit the configured default."
	},
	{
		name: "stop",
		description: "Stop the current run."
	},
	{
		name: "restart",
		description: "Restart the gateway (if enabled)."
	},
	{
		name: "activation",
		description: "Set group activation (mention|always)."
	},
	{
		name: "send",
		description: "Set send mode (on|off|inherit)."
	},
	{
		name: "reset",
		description: "Reset the session (/new)."
	},
	{
		name: "new",
		description: "Reset the session (/reset)."
	},
	{
		name: "think",
		description: `Set thinking level (${THINKING_LEVELS_HELP}).`
	},
	{
		name: "verbose",
		description: "Set verbose mode (on|full|off)."
	},
	{
		name: "trace",
		description: "Set plugin trace mode (on|off)."
	},
	{
		name: "reasoning",
		description: "Toggle reasoning output (on|off|stream)."
	},
	{
		name: "elevated",
		description: "Toggle elevated mode (on|off)."
	},
	{
		name: "model",
		description: "Select a model (list|status|<name>)."
	},
	{
		name: "queue",
		description: "Adjust queue mode and options."
	},
	{
		name: "bash",
		description: "Run a host command (if enabled)."
	},
	{
		name: "compact",
		description: "Compact the session history."
	}
];
/** Returns the built-in ACP commands. */
function getAvailableCommands() {
	return [...BASE_AVAILABLE_COMMANDS];
}
//#endregion
//#region src/acp/translator.session-updates.ts
function resolveLedgerSessionId(session) {
	return session.ledgerSessionId ?? session.sessionId;
}
/** Helper that keeps ACP client updates and replay ledger writes in sync. */
var AcpTranslatorSessionUpdates = class {
	constructor(options) {
		this.options = options;
		this.stopped = false;
		this.ledgerMutationTails = /* @__PURE__ */ new Map();
	}
	stop() {
		this.stopped = true;
	}
	async startLedgerSession(session, options) {
		if (this.stopped) return;
		try {
			await this.options.eventLedger.startSession({
				sessionId: resolveLedgerSessionId(session),
				sessionKey: session.sessionKey,
				cwd: session.cwd,
				complete: options.complete,
				...options.reset ? { reset: true } : {}
			});
		} catch (err) {
			this.options.log(`event ledger session start failed for ${session.sessionId}: ${String(err)}`);
		}
	}
	async readLedgerReplay(params) {
		if (this.stopped) return {
			complete: false,
			events: []
		};
		try {
			return await this.options.eventLedger.readReplay(params);
		} catch (err) {
			this.options.log(`event ledger replay fallback for ${params.sessionId}: ${String(err)}`);
			return {
				complete: false,
				events: []
			};
		}
	}
	async readLedgerReplayBySessionId(sessionId) {
		if (this.stopped) return {
			complete: false,
			events: []
		};
		try {
			return await this.options.eventLedger.readReplayBySessionId({ sessionId });
		} catch (err) {
			this.options.log(`event ledger exact replay fallback for ${sessionId}: ${String(err)}`);
			return {
				complete: false,
				events: []
			};
		}
	}
	async readLedgerReplayBySessionKey(sessionKey) {
		if (this.stopped) return {
			complete: false,
			events: []
		};
		try {
			return await this.options.eventLedger.readReplayBySessionKey({ sessionKey });
		} catch (err) {
			this.options.log(`event ledger session-key replay fallback for ${sessionKey}: ${String(err)}`);
			return {
				complete: false,
				events: []
			};
		}
	}
	async recordUserPrompt(session, runId, prompt) {
		await this.enqueueLedgerMutation(resolveLedgerSessionId(session), async () => {
			if (this.stopped) return;
			try {
				await this.options.eventLedger.recordUserPrompt({
					sessionId: resolveLedgerSessionId(session),
					sessionKey: session.sessionKey,
					runId,
					prompt
				});
			} catch (err) {
				this.options.log(`event ledger prompt record failed for ${session.sessionId}: ${String(err)}`);
				await this.markLedgerIncomplete(session);
			}
		});
	}
	async emit(params) {
		if (this.stopped) return;
		const delivery = this.options.connection.sessionUpdate({
			sessionId: params.sessionId,
			update: params.update
		});
		const recording = params.record && params.sessionKey ? this.recordLedgerUpdate({
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			...params.ledgerSessionId ? { ledgerSessionId: params.ledgerSessionId } : {},
			...params.runId ? { runId: params.runId } : {},
			update: params.update
		}) : void 0;
		if (params.waitForDelivery === false) delivery.catch((err) => {
			this.options.log(`session update delivery failed for ${params.sessionId}: ${String(err)}`);
		});
		else await delivery;
		await recording;
	}
	async sendAvailableCommands(session, options) {
		await this.emit({
			sessionId: session.sessionId,
			sessionKey: session.sessionKey,
			...session.ledgerSessionId ? { ledgerSessionId: session.ledgerSessionId } : {},
			record: options.record,
			update: {
				sessionUpdate: "available_commands_update",
				availableCommands: getAvailableCommands()
			}
		});
	}
	async recordLedgerUpdate(params) {
		await this.enqueueLedgerMutation(params.ledgerSessionId ?? params.sessionId, async () => {
			if (this.stopped) return;
			try {
				await this.options.eventLedger.recordUpdate({
					sessionId: params.ledgerSessionId ?? params.sessionId,
					sessionKey: params.sessionKey,
					...params.runId ? { runId: params.runId } : {},
					update: params.update
				});
			} catch (err) {
				this.options.log(`event ledger update record failed for ${params.sessionId}: ${String(err)}`);
				await this.markLedgerIncomplete({
					sessionId: params.sessionId,
					sessionKey: params.sessionKey,
					...params.ledgerSessionId ? { ledgerSessionId: params.ledgerSessionId } : {}
				});
			}
		});
	}
	enqueueLedgerMutation(ledgerSessionId, mutation) {
		const pending = (this.ledgerMutationTails.get(ledgerSessionId) ?? Promise.resolve()).then(mutation, mutation);
		const tail = pending.catch(() => {});
		this.ledgerMutationTails.set(ledgerSessionId, tail);
		tail.then(() => {
			if (this.ledgerMutationTails.get(ledgerSessionId) === tail) this.ledgerMutationTails.delete(ledgerSessionId);
		});
		return pending;
	}
	async markLedgerIncomplete(session) {
		if (this.stopped) return;
		try {
			await this.options.eventLedger.markIncomplete({
				sessionId: resolveLedgerSessionId(session),
				sessionKey: session.sessionKey
			});
		} catch (err) {
			this.options.log(`event ledger incomplete mark failed for ${session.sessionId}: ${String(err)}`);
		}
	}
};
//#endregion
//#region src/acp/translator.ts
const SESSION_CREATE_RATE_LIMIT_DEFAULT_MAX_REQUESTS = 120;
const SESSION_CREATE_RATE_LIMIT_DEFAULT_WINDOW_MS = 1e4;
const loadAcpSdkModule = createLazyRuntimeModule(() => import("@agentclientprotocol/sdk"));
/** ACP Agent implementation backed by the OpenClaw Gateway and replay ledger. */
var AcpGatewayAgent = class {
	constructor(connection, gateway, opts) {
		this.approvalRelays = /* @__PURE__ */ new Map();
		this.log = opts.verbose ? (msg) => process.stderr.write(`[acp] ${msg}\n`) : () => {};
		let sessionStore;
		if (opts.sessionStore === void 0) {
			this.ownedSessionStore = createInMemorySessionStore();
			sessionStore = this.ownedSessionStore;
		} else {
			this.ownedSessionStore = void 0;
			sessionStore = opts.sessionStore;
		}
		this.sessionUpdates = new AcpTranslatorSessionUpdates({
			connection,
			eventLedger: opts.eventLedger,
			log: this.log
		});
		const sessionState = new AcpTranslatorSessionState(gateway, this.sessionUpdates, this.log);
		this.promptStream = new AcpTranslatorPromptStream(connection, gateway, opts, sessionStore, this.sessionUpdates, sessionState, this.approvalRelays, this.log);
		const sessionCreateRateLimiter = createFixedWindowBudget({
			maxRequests: resolveIntegerOption(opts.sessionCreateRateLimit?.maxRequests, SESSION_CREATE_RATE_LIMIT_DEFAULT_MAX_REQUESTS, { min: 1 }),
			windowMs: resolveIntegerOption(opts.sessionCreateRateLimit?.windowMs, SESSION_CREATE_RATE_LIMIT_DEFAULT_WINDOW_MS, { min: 1e3 })
		});
		this.sessionLifecycle = new AcpTranslatorSessionLifecycle(gateway, opts, sessionStore, this.sessionUpdates, sessionState, sessionCreateRateLimiter, (session) => this.promptStream.cancelSessionWork(session), this.log);
	}
	start() {
		this.log("ready");
	}
	async shutdown() {
		this.sessionUpdates.stop();
		try {
			await this.promptStream.shutdown();
		} finally {
			this.ownedSessionStore?.dispose();
		}
	}
	handleGatewayReconnect() {
		this.promptStream.handleGatewayReconnect();
	}
	handleGatewayDisconnect(reason) {
		this.promptStream.handleGatewayDisconnect(reason);
	}
	async handleGatewayEvent(evt) {
		await this.promptStream.handleGatewayEvent(evt);
	}
	async initialize(_params) {
		return {
			protocolVersion: (await loadAcpSdkModule()).PROTOCOL_VERSION,
			agentCapabilities: {
				loadSession: true,
				promptCapabilities: {
					image: true,
					audio: false,
					embeddedContext: true
				},
				mcpCapabilities: {
					http: false,
					sse: false
				},
				sessionCapabilities: {
					list: {},
					resume: {},
					close: {}
				}
			},
			agentInfo: ACP_AGENT_INFO,
			authMethods: []
		};
	}
	async newSession(params) {
		return await this.sessionLifecycle.newSession(params);
	}
	async loadSession(params) {
		return await this.sessionLifecycle.loadSession(params);
	}
	async listSessions(params) {
		return await this.sessionLifecycle.listSessions(params);
	}
	async resumeSession(params) {
		return await this.sessionLifecycle.resumeSession(params);
	}
	async closeSession(params) {
		return await this.sessionLifecycle.closeSession(params);
	}
	async authenticate(params) {
		return await this.sessionLifecycle.authenticate(params);
	}
	async setSessionMode(params) {
		return await this.sessionLifecycle.setSessionMode(params);
	}
	async setSessionConfigOption(params) {
		return await this.sessionLifecycle.setSessionConfigOption(params);
	}
	async prompt(params) {
		return await this.promptStream.prompt(params);
	}
	async cancel(params) {
		await this.promptStream.cancel(params);
	}
};
//#endregion
//#region src/acp/server.ts
/** ACP stdio server that bridges Agent Client Protocol clients to the OpenClaw Gateway. */
const MAX_STARTUP_ACP_BUFFER_BYTES = 1048576;
function createStartupInputMonitor(input) {
	const [monitor, readable] = input.tee();
	const reader = monitor.getReader();
	let readableTaken = false;
	let monitorCancelled = false;
	const cancelMonitor = (reason) => {
		if (monitorCancelled) return;
		monitorCancelled = true;
		reader.cancel(reason).catch(() => {});
	};
	const cancelBoth = (reason) => {
		cancelMonitor(reason);
		readable.cancel(reason).catch(() => {});
	};
	return {
		dispose: () => {
			if (!readableTaken) cancelBoth();
			else cancelMonitor();
		},
		ended: (async () => {
			try {
				let bufferedBytes = 0;
				while (true) {
					const { done, value } = await reader.read();
					if (done) return;
					bufferedBytes += value.byteLength;
					if (bufferedBytes > MAX_STARTUP_ACP_BUFFER_BYTES) {
						const error = /* @__PURE__ */ new Error("ACP startup input exceeded the 1 MiB buffer limit");
						cancelBoth(error);
						throw error;
					}
				}
			} finally {
				reader.releaseLock();
			}
		})(),
		takeReadable: () => {
			readableTaken = true;
			return readable;
		}
	};
}
/** Starts the ACP Gateway bridge and serves AgentSideConnection over stdio. */
async function serveAcpGateway(opts = {}) {
	routeLogsToStderr();
	const cfg = getRuntimeConfig();
	const bootstrap = await resolveGatewayClientBootstrap({
		config: cfg,
		gatewayUrl: opts.gatewayUrl,
		explicitAuth: {
			token: opts.gatewayToken,
			password: opts.gatewayPassword
		},
		env: process.env
	});
	let agent = null;
	let sessionStore = null;
	let onClosed;
	let onCloseFailed;
	const closed = new Promise((resolve, reject) => {
		onClosed = resolve;
		onCloseFailed = reject;
	});
	closed.catch(() => {});
	const startupAbortController = new AbortController();
	let stopped = false;
	let gatewayConnected = false;
	let onGatewayReadyResolve;
	let onGatewayReadyReject;
	let gatewayReadySettled = false;
	const gatewayReady = new Promise((resolve, reject) => {
		onGatewayReadyResolve = resolve;
		onGatewayReadyReject = reject;
	});
	const resolveGatewayReady = () => {
		if (gatewayReadySettled) return;
		gatewayReadySettled = true;
		onGatewayReadyResolve();
	};
	const rejectGatewayReady = (err) => {
		if (gatewayReadySettled) return;
		gatewayReadySettled = true;
		onGatewayReadyReject(err instanceof Error ? err : new Error(String(err)));
	};
	const closeStateDatabase = async () => {
		try {
			await closeOpenClawStateDatabaseAsync();
		} catch (err) {
			console.warn(`acp: state database close failed during shutdown: ${formatErrorMessage(err)}`);
			throw err;
		}
	};
	const gateway = new GatewayClient({
		url: bootstrap.url,
		token: bootstrap.auth.token,
		password: bootstrap.auth.password,
		preauthHandshakeTimeoutMs: bootstrap.preauthHandshakeTimeoutMs,
		tlsFingerprint: bootstrap.tlsFingerprint,
		clientName: GATEWAY_CLIENT_NAMES.CLI,
		clientDisplayName: "ACP",
		clientVersion: "acp",
		mode: GATEWAY_CLIENT_MODES.CLI,
		caps: [GATEWAY_CLIENT_CAPS.EXEC_APPROVALS, GATEWAY_CLIENT_CAPS.TOOL_EVENTS],
		onEvent: (evt) => {
			if (stopped) return;
			agent?.handleGatewayEvent(evt).catch((err) => {
				process.stderr.write(`openclaw acp: gateway event ${evt.event} failed\n`);
				if (opts.verbose) process.stderr.write(`openclaw acp: gateway event ${evt.event} error: ${formatErrorMessage(err)}\n`);
			});
		},
		onHelloOk: () => {
			gatewayConnected = true;
			resolveGatewayReady();
			agent?.handleGatewayReconnect();
		},
		onConnectError: (err) => {
			rejectGatewayReady(err);
		},
		onClose: (code, reason) => {
			if (stopped) return;
			rejectGatewayReady(/* @__PURE__ */ new Error(`gateway closed before ready (${code}): ${reason}`));
			agent?.handleGatewayDisconnect(`${code}: ${reason}`);
		}
	});
	const startupInput = createStartupInputMonitor(Readable.toWeb(process.stdin));
	let shuttingDown;
	let stoppingAgent = null;
	const shutdown = () => {
		if (shuttingDown) return shuttingDown;
		shuttingDown = (async () => {
			if (!stopped) {
				stopped = true;
				startupAbortController.abort();
				startupInput.dispose();
				process.stdin.pause();
				resolveGatewayReady();
				stoppingAgent = agent;
				agent = null;
			}
			await stoppingAgent?.shutdown();
			stoppingAgent = null;
			sessionStore?.dispose();
			sessionStore = null;
			await gateway.stopAndWait().catch((err) => {
				console.warn(`acp: gateway stop failed during shutdown: ${formatErrorMessage(err)}`);
			});
			await closeStateDatabase();
			onClosed();
		})();
		shuttingDown.catch((error) => {
			shuttingDown = void 0;
			onCloseFailed(error);
		});
		return shuttingDown;
	};
	startupInput.ended.then(() => {
		if (!gatewayConnected) shutdown();
	}, shutdown).catch(onCloseFailed);
	process.once("SIGINT", () => {
		shutdown();
	});
	process.once("SIGTERM", () => {
		shutdown();
	});
	if (!(await startGatewayClientWhenEventLoopReady(gateway, {
		clientOptions: { preauthHandshakeTimeoutMs: bootstrap.preauthHandshakeTimeoutMs },
		signal: startupAbortController.signal
	})).ready) rejectGatewayReady(/* @__PURE__ */ new Error("gateway event loop readiness timeout"));
	await gatewayReady.catch(async (err) => {
		await shutdown();
		throw err;
	});
	if (stopped) return closed;
	const bufferedInput = startupInput.takeReadable();
	startupInput.dispose();
	const output = Writable.toWeb(process.stdout);
	const stream = ndJsonStream(output, bufferedInput);
	const sessionNewOrdering = new AcpSessionNewOrdering();
	sessionStore = createInMemorySessionStore({ onSessionRemoved: (sessionId) => sessionNewOrdering.forget(sessionId) });
	const readable = stream.readable.pipeThrough(new TransformStream({ transform(message, controller) {
		sessionNewOrdering.observeInbound(message);
		controller.enqueue(normalizeAcpInitializeProtocolVersion(message));
	} }));
	const orderedOutbound = new TransformStream({ transform(message, controller) {
		sessionNewOrdering.transformOutbound(message, controller);
	} });
	orderedOutbound.readable.pipeTo(stream.writable).catch(async (err) => {
		if (opts.verbose) process.stderr.write(`openclaw acp: outbound stream failed: ${formatErrorMessage(err)}\n`);
		await shutdown();
	}).catch(onCloseFailed);
	const eventLedger = createSqliteAcpEventLedger();
	new AgentSideConnection((conn) => {
		agent = new AcpGatewayAgent(conn, gateway, {
			...opts,
			eventLedger,
			sessionStore: sessionStore ?? void 0
		});
		agent.start();
		return agent;
	}, {
		writable: orderedOutbound.writable,
		readable
	}).closed.then(shutdown, shutdown).catch(onCloseFailed);
	return closed;
}
function normalizeAcpInitializeProtocolVersion(message) {
	if (!isRecord(message)) return message;
	const messageObject = message;
	if (messageObject.method !== AGENT_METHODS.initialize) return message;
	const params = messageObject.params;
	if (!isRecord(params) || isUint16Integer(params.protocolVersion)) return message;
	return {
		...message,
		params: {
			...params,
			protocolVersion: PROTOCOL_VERSION
		}
	};
}
function isUint16Integer(value) {
	return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 65535;
}
function parseArgs(args) {
	const opts = {};
	let tokenFile;
	let passwordFile;
	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i];
		if (arg === "--url" || arg === "--gateway-url") {
			opts.gatewayUrl = args[i + 1];
			i += 1;
			continue;
		}
		if (arg === "--token" || arg === "--gateway-token") {
			opts.gatewayToken = args[i + 1];
			i += 1;
			continue;
		}
		if (arg === "--token-file" || arg === "--gateway-token-file") {
			tokenFile = args[i + 1];
			i += 1;
			continue;
		}
		if (arg === "--password" || arg === "--gateway-password") {
			opts.gatewayPassword = args[i + 1];
			i += 1;
			continue;
		}
		if (arg === "--password-file" || arg === "--gateway-password-file") {
			passwordFile = args[i + 1];
			i += 1;
			continue;
		}
		if (arg === "--session") {
			opts.defaultSessionKey = args[i + 1];
			i += 1;
			continue;
		}
		if (arg === "--session-label") {
			opts.defaultSessionLabel = args[i + 1];
			i += 1;
			continue;
		}
		if (arg === "--require-existing") {
			opts.requireExistingSession = true;
			continue;
		}
		if (arg === "--reset-session") {
			opts.resetSession = true;
			continue;
		}
		if (arg === "--no-prefix-cwd") {
			opts.prefixCwd = false;
			continue;
		}
		if (arg === "--provenance") {
			const provenanceMode = normalizeAcpProvenanceMode(args[i + 1]);
			if (!provenanceMode) throw new Error("Invalid --provenance value. Use off, meta, or meta+receipt.");
			opts.provenanceMode = provenanceMode;
			i += 1;
			continue;
		}
		if (arg === "--verbose" || arg === "-v") {
			opts.verbose = true;
			continue;
		}
		if (arg === "--help" || arg === "-h") {
			printHelp();
			process.exit(0);
		}
	}
	const gatewayToken = normalizeOptionalString(opts.gatewayToken);
	const gatewayPassword = normalizeOptionalString(opts.gatewayPassword);
	const normalizedTokenFile = normalizeOptionalString(tokenFile);
	const normalizedPasswordFile = normalizeOptionalString(passwordFile);
	if (gatewayToken && normalizedTokenFile) throw new Error("Use either --token or --token-file.");
	if (gatewayPassword && normalizedPasswordFile) throw new Error("Use either --password or --password-file.");
	if (normalizedTokenFile) opts.gatewayToken = readSecretFromFile(normalizedTokenFile, "Gateway token");
	if (normalizedPasswordFile) opts.gatewayPassword = readSecretFromFile(normalizedPasswordFile, "Gateway password");
	return opts;
}
function printHelp() {
	console.log(`Usage: openclaw acp [options]

Gateway-backed ACP server for IDE integration.

Options:
  --url <url>             Gateway WebSocket URL
  --token <token>         Gateway auth token
  --token-file <path>     Read gateway auth token from file
  --password <password>   Gateway auth password
  --password-file <path>  Read gateway auth password from file
  --session <key>         Default session key (e.g. "agent:main:main")
  --session-label <label> Default session label to resolve
  --require-existing      Fail if the session key/label does not exist
  --reset-session         Reset the session key before first use
  --no-prefix-cwd         Do not prefix prompts with the working directory
  --provenance <mode>     ACP provenance mode: off, meta, or meta+receipt
  --verbose, -v           Verbose logging to stderr
  --help, -h              Show this help message
`);
}
if (isMainModule({ currentFile: fileURLToPath(import.meta.url) })) {
	const argv = process.argv.slice(2);
	if (argv.includes("--token") || argv.includes("--gateway-token")) console.error("Warning: --token can be exposed via process listings. Prefer --token-file or OPENCLAW_GATEWAY_TOKEN.");
	if (argv.includes("--password") || argv.includes("--gateway-password")) console.error("Warning: --password can be exposed via process listings. Prefer --password-file or OPENCLAW_GATEWAY_PASSWORD.");
	serveAcpGateway(parseArgs(argv)).catch((err) => {
		console.error(formatErrorMessage(err));
		process.exit(1);
	});
}
//#endregion
export { serveAcpGateway };
