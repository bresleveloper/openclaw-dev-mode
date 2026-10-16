import { a as normalizeFastMode, g as readStringValue, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, t as hasNonEmptyString } from "./string-coerce-1VuiLaaR.mjs";
import { R as timestampMsToIsoString, j as resolveIntegerOption } from "./number-coercion-CuVhdCBs.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { a as asOptionalRecord, c as isRecord, o as asRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as isMainModule } from "./is-main-DYSvvM1W.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as finalizeActiveDebugProxyCaptures } from "./runtime-cleanup-CDxMLsqE.mjs";
import { a as getNodeSqliteKysely, c as prepareSqliteQuerySync, i as executeSqliteQueryTakeFirstSync, n as createSqliteQueryCache, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as routeLogsToStderr } from "./console-BnFs8ZzT.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { t as createFixedWindowBudget } from "./fixed-window-rate-limit-Xo1v2_Qn.mjs";
import { a as closeOpenClawStateDatabaseAsync } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { E as estimateAcpSessionRowBytes, T as estimateAcpEventRowBytes } from "./openclaw-state-db-legacy-backfills-BxTnDU05.mjs";
import { l as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { n as BASE_THINKING_LEVELS, r as THINKING_LEVELS_HELP } from "./thinking.shared-Jy32Vp-O.mjs";
import { t as hasHttpUrlPrefix } from "./url-protocol-OU3K-ySz.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES, t as GATEWAY_CLIENT_CAPS } from "./client-info-C8RatpKO.mjs";
import { r as isDevMode } from "./globals-BXbZ1A_g.mjs";
import { t as startGatewayClientWhenEventLoopReady } from "./readiness-kkd804Uc.mjs";
import { r as resolveGatewayClientBootstrap } from "./client-bootstrap-D-pUrrKi.mjs";
import { t as GatewayClient } from "./client-CrrkVIh8.mjs";
import { i as readNonNegativeInteger, n as readMetadataNumber, r as readMetadataString, t as readBool } from "./meta-DxG1x8i6.mjs";
import { t as toAcpSessionLineageMeta } from "./session-lineage-meta-hqVeyYg8.mjs";
import { t as createInMemorySessionStore } from "./session-Deba5eqn.mjs";
import { t as normalizeAcpProvenanceMode } from "./types-CH9TQs-4.mjs";
import { t as readSecretFromFile } from "./secret-file-CbewS3sM.mjs";
import { t as mergeChatStreamMessage } from "./chat-stream-message-Cxmp5iwS.mjs";
import { t as normalizeTerminalChatSendAckStatus } from "./chat-send-ack-status-BEIhB1hF.mjs";
import { t as ACP_AGENT_INFO } from "./types-D_YxRLY4.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";
import { randomUUID } from "node:crypto";
import { Readable, Writable } from "node:stream";
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
function createAcpPromptUpdates(prompt) {
	return prompt.map((content) => ({
		sessionUpdate: "user_message_chunk",
		content: structuredClone(content)
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
		update: structuredClone(raw.update)
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
const getSqliteLedgerQueries = createSqliteQueryCache(createSqliteLedgerQueries);
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
	const updateJson = JSON.stringify(structuredClone(params.update));
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
				if (messageObject?.error === void 0) this.establishedSessionIds.add(claimed);
			}
		}
		if (responseId !== void 0 && this.pendingNewSessionRequestIds.delete(responseId)) {
			emit(message);
			const establishedSessionId = readSessionId(messageObject?.result);
			if (establishedSessionId) {
				this.establishedSessionIds.add(establishedSessionId);
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
//#region packages/gateway-client/src/run-recovery-text.ts
async function recoverTerminalReply(params) {
	const { runId, scope, request, signal } = params;
	const result = asRecord(params.result);
	const disposition = asRecord(result.terminalReply).disposition;
	if (disposition === "silent" || disposition === "empty") return { outputText: "" };
	if (!scope.sessionKey) return { unavailable: "session-unavailable" };
	const receipt = asRecord(result.terminalReceipt);
	if (receipt.runId !== void 0 && receipt.runId !== runId) return { unavailable: "terminal-receipt-mismatch" };
	const expectedSessionId = typeof receipt.sessionId === "string" ? receipt.sessionId : scope.sessionId;
	const idempotencyKey = typeof receipt.assistantTranscriptIdempotencyKey === "string" ? receipt.assistantTranscriptIdempotencyKey : void 0;
	const matches = (message) => {
		const metadata = asRecord(message["__openclaw"]);
		return message.role === "assistant" && asRecord(message.openclawStreamFallback).source !== "segment" && (metadata.runId === runId || idempotencyKey !== void 0 && metadata.idempotencyKey === idempotencyKey);
	};
	const target = {
		sessionKey: scope.sessionKey,
		...scope.agentId ? { agentId: scope.agentId } : {}
	};
	let offset;
	let sessionId = expectedSessionId;
	const pages = [];
	let complete = false;
	try {
		for (let pageIndex = 0; pageIndex < 10; pageIndex += 1) {
			signal.throwIfAborted();
			const page = asRecord(await request("chat.history", {
				...target,
				limit: 200,
				...offset !== void 0 ? { offset } : {}
			}, signal));
			if (sessionId !== void 0 && page.sessionId !== sessionId) return { unavailable: "session-changed" };
			if (typeof page.sessionId === "string") sessionId = page.sessionId;
			const messages = Array.isArray(page.messages) ? page.messages.map(asRecord) : [];
			pages.unshift(messages.filter(matches));
			if (page.hasMore !== true) {
				complete = true;
				break;
			}
			if (typeof page.nextOffset !== "number" || !Number.isSafeInteger(page.nextOffset) || page.nextOffset <= (offset ?? 0)) break;
			offset = page.nextOffset;
		}
		if (!complete) return { unavailable: "history-limit-reached" };
		const messages = pages.flat();
		if (messages.length === 0 || idempotencyKey !== void 0 && !messages.some((message) => asRecord(message["__openclaw"]).idempotencyKey === idempotencyKey)) return { unavailable: "reply-not-found" };
		let outputText = "";
		const seen = /* @__PURE__ */ new Set();
		for (let message of messages) {
			signal.throwIfAborted();
			const metadata = asRecord(message["__openclaw"]);
			if (typeof metadata.id === "string") {
				if (seen.has(metadata.id)) continue;
				seen.add(metadata.id);
			}
			if (metadata.truncated === true) {
				if (typeof metadata.id !== "string") return { unavailable: "message-identity-unavailable" };
				const full = asRecord(await request("chat.message.get", {
					...target,
					messageId: metadata.id
				}, signal));
				message = asRecord(full.message);
				if (full.ok !== true || asRecord(message["__openclaw"]).id !== metadata.id || !matches(message) || asRecord(message["__openclaw"]).truncated === true) return { unavailable: "full-message-unavailable" };
			}
			const content = typeof message.text === "string" ? message.text : message.content;
			if (typeof content !== "string" && !Array.isArray(content)) return { unavailable: "reply-text-unavailable" };
			const text = typeof content === "string" ? content : content.flatMap((block) => {
				const part = asRecord(block);
				return (part.type === "text" || part.type === "input_text" || part.type === "output_text") && typeof part.text === "string" ? [part.text] : [];
			}).join("\n");
			if (outputText && text) {
				const trailing = outputText.endsWith("\n\n") ? 2 : outputText.endsWith("\n") ? 1 : 0;
				const leading = text.startsWith("\n\n") ? 2 : text.startsWith("\n") ? 1 : 0;
				outputText += "\n".repeat(Math.max(0, 2 - trailing - leading));
			}
			outputText += text;
		}
		return { outputText };
	} catch {
		signal.throwIfAborted();
		return { unavailable: "history-request-failed" };
	}
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
function formatToolTitle(name, args) {
	const base = name ?? "tool";
	if (!args || Object.keys(args).length === 0) return base;
	return escapeInlineControlChars(`${base}: ${Object.entries(args).map(([key, value]) => {
		const raw = typeof value === "string" ? value : JSON.stringify(value) ?? String(value);
		return `${key}: ${raw.length > 100 ? `${truncateUtf16Safe(raw, 100)}...` : raw}`;
	}).join(", ")}`);
}
const TOOL_KIND_PATTERNS = [
	["read", /read/],
	["edit", /write|edit/],
	["delete", /delete|remove/],
	["move", /move|rename/],
	["search", /search|find/],
	["execute", /exec|run|bash/],
	["fetch", /fetch|http/]
];
function inferToolKind(name) {
	const normalized = normalizeLowercaseStringOrEmpty(name);
	return TOOL_KIND_PATTERNS.find(([, pattern]) => pattern.test(normalized))?.[0] ?? "other";
}
function extractToolCallContent(value) {
	const texts = [];
	if (hasNonEmptyString(value)) texts.push(value);
	else {
		const record = asOptionalRecord(value);
		if (!record) return;
		const blocks = Array.isArray(record.content) ? record.content : [];
		for (const block of blocks) {
			const entry = asOptionalRecord(block);
			if (entry?.type === "text" && hasNonEmptyString(entry.text)) texts.push(entry.text);
		}
		if (texts.length === 0) {
			const fallbackText = readStringValue(record.text) ?? readStringValue(record.message) ?? readStringValue(record.error);
			if (hasNonEmptyString(fallbackText)) texts.push(fallbackText);
		}
	}
	return texts.length > 0 ? texts.map((text) => ({
		type: "content",
		content: {
			type: "text",
			text
		}
	})) : void 0;
}
function extractToolCallLocations(...values) {
	const locations = /* @__PURE__ */ new Map();
	for (const value of values) collectToolLocations(value, locations, { visited: 0 }, 0);
	return locations.size > 0 ? [...locations.values()] : void 0;
}
//#endregion
//#region src/acp/session-mapper.ts
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
async function resolveAcpSessionKey(params) {
	const requestedLabel = params.meta.sessionLabel ?? (params.meta.sessionKey ? void 0 : params.opts.defaultSessionLabel);
	const requestedKey = params.meta.sessionKey ?? params.opts.defaultSessionKey;
	const requireExisting = params.meta.requireExisting ?? params.opts.requireExistingSession ?? false;
	if (requestedLabel || requestedKey && requireExisting) {
		const resolved = await params.gateway.request("sessions.resolve", requestedLabel ? { label: requestedLabel } : { key: requestedKey });
		if (!resolved?.key) throw new Error(requestedLabel ? `Unable to resolve session label: ${requestedLabel}` : `Session key not found: ${requestedKey}`);
		return resolved.key;
	}
	return requestedKey || params.fallbackKey;
}
async function resetSessionIfNeeded(params) {
	if (!(params.meta.resetSession ?? params.opts.resetSession ?? false)) return;
	await params.gateway.request("sessions.reset", { key: params.sessionKey });
}
//#endregion
//#region src/acp/permission-relay.ts
const FALLBACK_EXEC_APPROVAL_DECISIONS = ["allow-once", "deny"];
const EXEC_APPROVAL_OPTIONS = [
	{
		optionId: "allow-once",
		name: "Allow once",
		kind: "allow_once"
	},
	{
		optionId: "allow-always",
		name: "Allow always",
		kind: "allow_always"
	},
	{
		optionId: "deny",
		name: "Deny",
		kind: "reject_once"
	}
];
function normalizeGatewayExecApprovalDecision(value) {
	if (value === "allow-once" || value === "allow-always" || value === "deny") return value;
}
function buildAcpPermissionOptions(value) {
	const normalized = Array.isArray(value) ? value.map(normalizeGatewayExecApprovalDecision).filter((decision) => decision !== void 0) : [];
	const decisions = new Set(normalized.length > 0 ? normalized : FALLBACK_EXEC_APPROVAL_DECISIONS);
	const options = [];
	for (const option of EXEC_APPROVAL_OPTIONS) if (decisions.has(option.optionId)) options.push({ ...option });
	return options;
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
function buildAcpPermissionRequest(params) {
	const command = normalizeOptionalString(params.details?.commandText) ?? normalizeOptionalString(params.details?.commandPreview) ?? params.event.command;
	const host = normalizeOptionalString(params.details?.host) ?? params.event.host;
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
		options: buildAcpPermissionOptions(params.details?.allowedDecisions)
	};
}
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
		let update;
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
				locations
			});
			update = {
				sessionUpdate: "tool_call",
				toolCallId,
				title,
				status: "in_progress",
				rawInput: args,
				kind,
				locations
			};
		} else if (phase === "update" || phase === "result") {
			const toolState = pending.toolCalls?.get(toolCallId);
			const result = phase === "update" ? data.partialResult : data.result;
			if (phase === "result") pending.toolCalls?.delete(toolCallId);
			update = {
				sessionUpdate: "tool_call_update",
				toolCallId,
				status: phase === "update" ? "in_progress" : data.isError ? "failed" : "completed",
				rawOutput: result,
				content: extractToolCallContent(result),
				locations: extractToolCallLocations(toolState?.locations, result)
			};
		} else return;
		await this.sessionUpdates.emit({
			sessionId: pending.sessionId,
			sessionKey: pending.sessionKey,
			...pending.ledgerSessionId ? { ledgerSessionId: pending.ledgerSessionId } : {},
			runId: pending.idempotencyKey,
			record: true,
			update
		});
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
			state: "active"
		};
		this.approvalRelays.set(relay.approvalId, relay);
		this.runApprovalRelay(relay, correlatedApprovalEvent);
	}
	findPendingForApproval(params) {
		if (params.runId) return this.findPendingBySessionKey(params.sessionKey, params.runId);
		const toolCallId = params.approvalEvent.toolCallId;
		let match;
		for (const pending of this.pendingPrompts.values()) {
			if (pending.sessionKey !== params.sessionKey || toolCallId && pending.toolCalls?.get(toolCallId)?.kind !== "execute") continue;
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
	async expirePendingPrompt(pending, disconnectContext) {
		if (pending.disconnectContext !== disconnectContext) return false;
		if (!pending.sendAccepted || this.activeDisconnectContext?.generation === disconnectContext.generation) await this.rejectPendingPrompt(pending, /* @__PURE__ */ new Error(`Gateway disconnected: ${disconnectContext.reason}`), { recordDisconnectNotice: true });
		else pending.disconnectContext = void 0;
		return false;
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
			if (deadlineExpired) return await this.expirePendingPrompt(pending, disconnectContext);
			return true;
		}
		const currentPending = this.getPendingPrompt(sessionId, pending.idempotencyKey);
		if (!currentPending) return false;
		const hasVisibleReply = result?.terminalReply?.disposition === "visible";
		if (result?.status === "ok" || result?.status === "error" || result?.status === "timeout" && hasVisibleReply) {
			await this.settleRecoveredPrompt(sessionId, currentPending, result);
			return false;
		}
		if (deadlineExpired) return await this.expirePendingPrompt(currentPending, disconnectContext);
		return true;
	}
};
//#endregion
//#region src/acp/translator.prompt-stream.ts
const DEFAULT_MAX_PROMPT_BYTES = 2097152;
function getMaxPromptBytes() {
	return isDevMode() ? 52428800 : DEFAULT_MAX_PROMPT_BYTES;
}
const ACP_SHUTDOWN_ABORT_TIMEOUT_MS = 1e3;
function isAdminScopeProvenanceRejection(err) {
	return err instanceof Error && err.name === "GatewayClientRequestError" && "gatewayCode" in err && err.gatewayCode === "INVALID_REQUEST" && err.message.includes("system provenance fields require admin scope");
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
					if (!await applyTerminalAck(ack) && markSendAccepted()) await this.sessionUpdates.recordUserPrompt(session, runId, params.prompt);
				};
				try {
					await sendChat({
						...requestParams,
						systemInputProvenance,
						systemProvenanceReceipt
					});
				} catch (err) {
					if ((systemInputProvenance || systemProvenanceReceipt) && isAdminScopeProvenanceRejection(err)) {
						if (!this.getPendingPrompt(params.sessionId, runId)) return;
						await sendChat(requestParams);
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
		if (!sessionKey || !state) return;
		const pending = this.findPendingBySessionKey(sessionKey, runId);
		if (!pending) return;
		const messageData = state === "delta" ? mergeChatStreamMessage(pending.streamMessage, payload) : payload.message;
		if (isRecord(messageData) && (state === "delta" || state === "final")) {
			pending.streamMessage = messageData;
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
		for (const [blockType, field, sentField, kind] of [[
			"thinking",
			"thinking",
			"sentThought",
			"agent_thought_chunk"
		], [
			"text",
			"text",
			"sentText",
			"agent_message_chunk"
		]]) {
			const fullText = content?.filter((block) => block?.type === blockType).map((block) => block[field] ?? "").join("\n").trimEnd();
			const sentSoFar = pending[sentField]?.length ?? 0;
			if (!fullText || fullText.length <= sentSoFar) continue;
			pending[sentField] = fullText;
			await this.emitPromptChunk(pending, kind, fullText.slice(sentSoFar));
			if (this.getPendingPrompt(sessionId, pending.idempotencyKey) !== pending) return false;
		}
		return true;
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
		const signal = this.sessionStore.getSession(sessionId)?.abortController?.signal ?? new AbortController().signal;
		const reply = await recoverTerminalReply({
			runId: pending.idempotencyKey,
			scope: { sessionKey: pending.sessionKey },
			result,
			request: (method, params, requestSignal) => this.gateway.request(method, params, { signal: requestSignal }),
			signal
		}).catch(() => ({
			outputText: void 0,
			unavailable: "recovery-cancelled"
		}));
		if (!this.claimPendingPrompt(pending)) return;
		const sentText = pending.sentText ?? "";
		const outputText = reply.outputText;
		const unavailable = reply.unavailable ?? (outputText?.startsWith(sentText) === false ? "reply-rewritten" : void 0);
		if (unavailable) {
			const message = `Full reply recovery unavailable (${unavailable}). Check the session history.`;
			await this.emitPromptChunk(pending, "agent_message_chunk", `[OpenClaw interruption] ${message}`, false);
			await this.rejectPendingPrompt(pending, new Error(message), { claimed: true });
			return;
		}
		const recoveredText = outputText?.slice(sentText.length);
		if (recoveredText) await this.emitPromptChunk(pending, "agent_message_chunk", recoveredText, false);
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
const ACP_LIST_SESSIONS_DEFAULT_PAGE_SIZE = 100;
const ACP_LIST_SESSIONS_MAX_PAGE_SIZE = 100;
const ACP_LIST_SESSIONS_MAX_CURSOR_OFFSET = 1e4;
/** Maximum rows fetched to satisfy ACP session-list pagination plus next-page detection. */
const ACP_LIST_SESSIONS_MAX_FETCH_LIMIT = 10101;
function encodeListSessionsCursor(cursor) {
	return Buffer.from(JSON.stringify({
		v: 1,
		...cursor
	}), "utf8").toString("base64url");
}
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
function assertAbsoluteCwd(cwd, method) {
	if (!path.isAbsolute(cwd)) throw new Error(`ACP ${method} requires an absolute cwd.`);
}
function resolveListSessionsPageSize(meta) {
	const requested = readMetadataNumber(meta, ["limit", "pageSize"]);
	if (requested === void 0) return ACP_LIST_SESSIONS_DEFAULT_PAGE_SIZE;
	return Math.min(ACP_LIST_SESSIONS_MAX_PAGE_SIZE, Math.max(1, Math.floor(requested)));
}
//#endregion
//#region src/acp/translator.session-lifecycle.ts
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
		const presentation = await this.publishSessionSnapshot(session, sessionSnapshot, true);
		return {
			sessionId: session.sessionId,
			...presentation
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
		return await this.publishSessionSnapshot(session, sessionSnapshot, false);
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
		return await this.publishSessionSnapshot(session, sessionSnapshot, false);
	}
	async closeSession(params) {
		const session = this.requireSession(params.sessionId);
		await this.cancelSessionWork(session);
		this.sessionStore.deleteSession(params.sessionId);
		this.log(`closeSession: ${params.sessionId}`);
		return {};
	}
	async authenticate(_params) {
		return {};
	}
	async setSessionMode(params) {
		const session = this.requireSession(params.sessionId);
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
		const session = this.requireSession(params.sessionId);
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
	async publishSessionSnapshot(session, snapshot, record) {
		await this.sessionState.sendSnapshotUpdate(session, snapshot, {
			includeControls: false,
			record
		});
		await this.sessionUpdates.sendAvailableCommands(session, { record });
		const { configOptions, modes } = snapshot;
		return {
			configOptions,
			modes
		};
	}
	requireSession(sessionId) {
		const session = this.sessionStore.getSession(sessionId);
		if (!session) throw new Error(`Session ${sessionId} not found`);
		return session;
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
const ACP_THOUGHT_LEVEL_CONFIG_ID = "thought_level";
const ACP_FAST_MODE_CONFIG_ID = "fast_mode";
const ACP_VERBOSE_LEVEL_CONFIG_ID = "verbose_level";
const ACP_TRACE_LEVEL_CONFIG_ID = "trace_level";
const ACP_REASONING_LEVEL_CONFIG_ID = "reasoning_level";
const ACP_RESPONSE_USAGE_CONFIG_ID = "response_usage";
const ACP_ELEVATED_LEVEL_CONFIG_ID = "elevated_level";
const ACP_TIMEOUT_CONFIG_ID = "timeout";
const ACP_TIMEOUT_SECONDS_CONFIG_ID = "timeout_seconds";
function formatConfigValueName(value) {
	return value === "xhigh" ? "Extra High" : value.length > 0 ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : "Unknown";
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
			name: formatConfigValueName(level),
			description: level === "adaptive" ? "Use the Gateway session default thought level." : void 0
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
const STRING_CONFIG_FIELDS = /* @__PURE__ */ new Map([
	[ACP_THOUGHT_LEVEL_CONFIG_ID, "thinkingLevel"],
	[ACP_VERBOSE_LEVEL_CONFIG_ID, "verboseLevel"],
	[ACP_TRACE_LEVEL_CONFIG_ID, "traceLevel"],
	[ACP_REASONING_LEVEL_CONFIG_ID, "reasoningLevel"],
	[ACP_ELEVATED_LEVEL_CONFIG_ID, "elevatedLevel"]
]);
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
		const emit = (update) => this.sessionUpdates.emit({
			sessionId: session.sessionId,
			sessionKey: session.sessionKey,
			...session.ledgerSessionId ? { ledgerSessionId: session.ledgerSessionId } : {},
			runId: options.runId,
			record: options.record,
			update
		});
		if (options.includeControls) {
			await emit({
				sessionUpdate: "current_mode_update",
				currentModeId: sessionSnapshot.modes.currentModeId
			});
			await emit({
				sessionUpdate: "config_option_update",
				configOptions: sessionSnapshot.configOptions
			});
		}
		if (sessionSnapshot.metadata) await emit({
			sessionUpdate: "session_info_update",
			...sessionSnapshot.metadata
		});
		if (sessionSnapshot.usage) await emit({
			sessionUpdate: "usage_update",
			used: sessionSnapshot.usage.used,
			size: sessionSnapshot.usage.size,
			_meta: {
				source: "gateway-session-store",
				approximate: true
			}
		});
	}
	resolveConfigPatch(configId, value) {
		if (typeof value !== "string") throw new Error(`ACP bridge does not support non-string session config option values for "${configId}".`);
		const field = STRING_CONFIG_FIELDS.get(configId);
		if (field) {
			const patch = { [field]: value };
			return {
				patch,
				overrides: patch
			};
		}
		switch (configId) {
			case ACP_FAST_MODE_CONFIG_ID: {
				const fastMode = normalizeFastMode(value);
				if (fastMode === void 0) throw new Error(`Unsupported fast mode value: ${value}`);
				return {
					patch: { fastMode },
					overrides: { fastMode }
				};
			}
			case ACP_RESPONSE_USAGE_CONFIG_ID: {
				const next = value === "inherit" ? null : value;
				return {
					patch: { responseUsage: next },
					overrides: { responseUsage: next }
				};
			}
			case ACP_TIMEOUT_CONFIG_ID:
			case ACP_TIMEOUT_SECONDS_CONFIG_ID: return { overrides: {} };
			default: throw new Error(`ACP bridge mode does not support session config option "${configId}".`);
		}
	}
	async getGatewaySessionRow(sessionKey) {
		return (await this.gateway.request("sessions.list", {
			limit: 200,
			search: sessionKey,
			includeDerivedTitles: true
		})).sessions.find((entry) => entry.key === sessionKey);
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
function getAvailableCommands() {
	return [...BASE_AVAILABLE_COMMANDS];
}
//#endregion
//#region src/acp/translator.session-updates.ts
function resolveLedgerSessionId(session) {
	return session.ledgerSessionId ?? session.sessionId;
}
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
	readLedgerReplay(params) {
		return this.readReplay(() => this.options.eventLedger.readReplay(params), `replay fallback for ${params.sessionId}`);
	}
	readLedgerReplayBySessionId(sessionId) {
		return this.readReplay(() => this.options.eventLedger.readReplayBySessionId({ sessionId }), `exact replay fallback for ${sessionId}`);
	}
	readLedgerReplayBySessionKey(sessionKey) {
		return this.readReplay(() => this.options.eventLedger.readReplayBySessionKey({ sessionKey }), `session-key replay fallback for ${sessionKey}`);
	}
	async readReplay(read, failure) {
		if (this.stopped) return {
			complete: false,
			events: []
		};
		try {
			return await read();
		} catch (err) {
			this.options.log(`event ledger ${failure}: ${String(err)}`);
			return {
				complete: false,
				events: []
			};
		}
	}
	recordUserPrompt(session, runId, prompt) {
		return this.recordLedgerMutation(session, "prompt", () => this.options.eventLedger.recordUserPrompt({
			sessionId: resolveLedgerSessionId(session),
			sessionKey: session.sessionKey,
			runId,
			prompt
		}));
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
	recordLedgerUpdate(params) {
		return this.recordLedgerMutation(params, "update", () => this.options.eventLedger.recordUpdate({
			sessionId: resolveLedgerSessionId(params),
			sessionKey: params.sessionKey,
			...params.runId ? { runId: params.runId } : {},
			update: params.update
		}));
	}
	recordLedgerMutation(session, kind, mutation) {
		return this.enqueueLedgerMutation(resolveLedgerSessionId(session), async () => {
			if (this.stopped) return;
			try {
				await mutation();
			} catch (err) {
				this.options.log(`event ledger ${kind} record failed for ${session.sessionId}: ${String(err)}`);
				await this.markLedgerIncomplete(session);
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
var AcpGatewayAgent = class {
	constructor(connection, gateway, opts) {
		this.approvalRelays = /* @__PURE__ */ new Map();
		this.log = opts.verbose ? (msg) => process.stderr.write(`[acp] ${msg}\n`) : () => {};
		const sessionStore = opts.sessionStore === void 0 ? this.ownedSessionStore = createInMemorySessionStore() : opts.sessionStore;
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
		const sessionLifecycle = new AcpTranslatorSessionLifecycle(gateway, opts, sessionStore, this.sessionUpdates, sessionState, sessionCreateRateLimiter, (session) => this.promptStream.cancelSessionWork(session), this.log);
		this.newSession = sessionLifecycle.newSession.bind(sessionLifecycle);
		this.loadSession = sessionLifecycle.loadSession.bind(sessionLifecycle);
		this.listSessions = sessionLifecycle.listSessions.bind(sessionLifecycle);
		this.resumeSession = sessionLifecycle.resumeSession.bind(sessionLifecycle);
		this.closeSession = sessionLifecycle.closeSession.bind(sessionLifecycle);
		this.authenticate = sessionLifecycle.authenticate.bind(sessionLifecycle);
		this.setSessionMode = sessionLifecycle.setSessionMode.bind(sessionLifecycle);
		this.setSessionConfigOption = sessionLifecycle.setSessionConfigOption.bind(sessionLifecycle);
		this.prompt = this.promptStream.prompt.bind(this.promptStream);
		this.cancel = this.promptStream.cancel.bind(this.promptStream);
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
};
//#endregion
//#region src/acp/server.ts
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
	const { promise: closed, resolve: onClosed, reject: onCloseFailed } = createDeferredCore();
	closed.catch(() => {});
	const startupAbortController = new AbortController();
	let stopped = false;
	let gatewayConnected = false;
	const { promise: gatewayReady, resolve: resolveGatewayReady, reject: rejectReady } = createDeferredCore();
	const rejectGatewayReady = (err) => {
		rejectReady(err instanceof Error ? err : new Error(String(err)));
	};
	const closeStateDatabase = async () => {
		const errors = [];
		try {
			await finalizeActiveDebugProxyCaptures();
		} catch (error) {
			errors.push(error);
		}
		try {
			await closeOpenClawStateDatabaseAsync();
		} catch (err) {
			console.warn(`acp: state database close failed during shutdown: ${formatErrorMessage(err)}`);
			errors.push(err);
		}
		if (errors.length === 1) throw errors[0];
		if (errors.length > 1) throw new AggregateError(errors, "ACP capture and state database shutdown failed.");
	};
	const gateway = new GatewayClient({
		url: bootstrap.url,
		deviceAuthScope: bootstrap.deviceAuthScope,
		...bootstrap.sshTunnel ? { sshTunnel: bootstrap.sshTunnel } : {},
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
	const stringOptions = /* @__PURE__ */ new Map([
		["--url", "gatewayUrl"],
		["--gateway-url", "gatewayUrl"],
		["--token", "gatewayToken"],
		["--gateway-token", "gatewayToken"],
		["--password", "gatewayPassword"],
		["--gateway-password", "gatewayPassword"],
		["--session", "defaultSessionKey"],
		["--session-label", "defaultSessionLabel"]
	]);
	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i];
		const field = arg === void 0 ? void 0 : stringOptions.get(arg);
		if (field) {
			opts[field] = args[i + 1];
			i += 1;
			continue;
		}
		if (arg === "--token-file" || arg === "--gateway-token-file") {
			tokenFile = args[i + 1];
			i += 1;
			continue;
		}
		if (arg === "--password-file" || arg === "--gateway-password-file") {
			passwordFile = args[i + 1];
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
