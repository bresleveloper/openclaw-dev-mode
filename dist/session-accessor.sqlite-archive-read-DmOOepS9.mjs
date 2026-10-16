import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as getNodeSqliteKysely, c as prepareSqliteQuerySync, i as executeSqliteQueryTakeFirstSync, l as prepareSqliteQueryTakeFirstSync, o as iterateSqliteQuerySync, r as executeSqliteQuerySync, s as prepareSqliteQueryIterator } from "./kysely-sync-K7ftY-g4.mjs";
import { r as enableNodeSqliteKyselyStatementCache } from "./kysely-sync-cache-state-eUau8Jaa.mjs";
import { n as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { p as createPrivateSqliteTempDirectorySync } from "./sqlite-snapshot-staging-BIgaAYlp.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { v as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
import { n as openOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-open-hQ4ohjUT.mjs";
import { a as readSessionTranscriptFailureRunId, o as readSessionTranscriptRunId } from "./transcript-events-DUHAZLVw.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { c as scanSessionTranscriptNavigation, d as selectSessionTranscriptActiveEntryIndexes, h as visitSessionTranscriptTreePathNodes } from "./transcript-tree-CaYJo8Xs.mjs";
import { n as hashSessionArchiveBytes, t as MAX_MATERIALIZED_ARCHIVE_BATCH_BYTES } from "./session-accessor.sqlite-archive-artifact-kIblIqSS.mjs";
import { n as isVisibleTranscriptRecord, t as isVisibleAssistantResultEventForRun } from "./transcript-visible-record-C_2yzTED.mjs";
import "./session-accessor.sqlite-visible-cursor-CJh4GhW9.mjs";
import { n as readSessionTranscriptHeaderStartedAt } from "./transcript-header-CyuYZIZn.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { Readable, Transform } from "node:stream";
import zlib from "node:zlib";
import { pipeline as pipeline$1 } from "node:stream/promises";
//#region src/config/sessions/session-accessor.sqlite-archive-selection.ts
async function withTranscriptArchiveSelection(run) {
	const directory = createPrivateSqliteTempDirectorySync(os.tmpdir(), "openclaw-archive-selection-");
	let database;
	try {
		const filename = path.join(directory, "navigation.sqlite");
		fs.closeSync(fs.openSync(filename, "wx", 384));
		database = openNodeSqliteDatabase(filename);
		database.exec(`
      PRAGMA cache_size = -2048;
      PRAGMA temp_store = FILE;
      PRAGMA journal_mode = OFF;
      PRAGMA synchronous = OFF;
      CREATE TABLE records (idx INTEGER PRIMARY KEY, seq INTEGER NOT NULL, record_json TEXT NOT NULL, owns_run INTEGER NOT NULL);
      CREATE TABLE nodes (id TEXT PRIMARY KEY, node_json TEXT NOT NULL) WITHOUT ROWID;
      CREATE TABLE sets (kind TEXT NOT NULL, id TEXT NOT NULL, PRIMARY KEY(kind, id)) WITHOUT ROWID;
      CREATE TABLE paths (kind TEXT NOT NULL, position INTEGER NOT NULL, node_json TEXT NOT NULL, PRIMARY KEY(kind, position)) WITHOUT ROWID;
      CREATE TABLE selected (seq INTEGER PRIMARY KEY, owns_run INTEGER NOT NULL);
    `);
		enableNodeSqliteKyselyStatementCache(database);
		return await run(new TranscriptArchiveSelection(database));
	} finally {
		try {
			database?.close();
		} finally {
			fs.rmSync(directory, {
				recursive: true,
				force: true
			});
		}
	}
}
var TranscriptArchiveSelection = class {
	constructor(database) {
		this.database = database;
		this.pendingMemberships = /* @__PURE__ */ new Map();
		this.pendingMembershipBytes = 0;
		this.membershipRevision = 0;
		this.pending = [];
		this.pendingBytes = 0;
		this.count = 0;
		this.hasRun = false;
		const db = getNodeSqliteKysely(database);
		this.insertMembership = prepareSqliteQuerySync(database, (parameter) => db.insertInto("sets").orIgnore().values({
			kind: parameter((row) => row.kind),
			id: parameter((row) => row.id)
		}));
		this.hasMembership = prepareSqliteQueryTakeFirstSync(database, (parameter) => db.selectFrom("sets").select("id").where("kind", "=", parameter((row) => row.kind)).where("id", "=", parameter((row) => row.id)));
		this.insert = prepareSqliteQuerySync(database, (parameter) => db.insertInto("records").values({
			idx: parameter((row) => row.idx),
			seq: parameter((row) => row.seq),
			record_json: parameter((row) => row.record_json),
			owns_run: parameter((row) => row.owns_run)
		}));
		this.readRecord = prepareSqliteQueryTakeFirstSync(database, (parameter) => db.selectFrom("records").select("record_json").where("idx", "=", parameter((index) => index)));
		this.contains = prepareSqliteQueryTakeFirstSync(database, (parameter) => db.selectFrom("selected").select("seq").where("seq", "=", parameter((seq) => seq)));
	}
	append(record, seq, ownsRun) {
		const json = JSON.stringify(record);
		this.pending.push({
			seq,
			json,
			ownsRun
		});
		this.pendingBytes += Buffer.byteLength(json);
		this.hasRun ||= ownsRun;
		if (this.pending.length >= 1024 || this.pendingBytes >= 1048576) this.flush();
	}
	transaction(run) {
		this.database.exec("BEGIN");
		try {
			run();
			this.database.exec("COMMIT");
		} catch (error) {
			this.database.exec("ROLLBACK");
			throw error;
		}
	}
	flush() {
		this.transaction(() => {
			for (const entry of this.pending) this.insert({
				idx: this.count++,
				seq: entry.seq,
				record_json: entry.json,
				owns_run: entry.ownsRun ? 1 : 0
			});
		});
		this.pending = [];
		this.pendingBytes = 0;
	}
	select() {
		this.flush();
		if (!this.hasRun) return false;
		this.transaction(() => this.selectActiveEntries());
		return executeSqliteQueryTakeFirstSync(this.database, getNodeSqliteKysely(this.database).selectFrom("selected").select("seq").where("owns_run", "=", 1).limit(1)) !== void 0;
	}
	has(seq) {
		return this.contains(seq) !== void 0;
	}
	membership(kind) {
		let cachedId;
		let cachedRevision = -1;
		let cachedResult = false;
		return {
			has: (id) => {
				if (cachedId === id && cachedRevision === this.membershipRevision) return cachedResult;
				const result = this.pendingMemberships.has(JSON.stringify([kind, id])) || this.hasMembership({
					kind,
					id
				}) !== void 0;
				cachedId = id;
				cachedRevision = this.membershipRevision;
				cachedResult = result;
				return result;
			},
			add: (id) => {
				const key = JSON.stringify([kind, id]);
				if (this.pendingMemberships.has(key)) return;
				this.pendingMemberships.set(key, {
					kind,
					id
				});
				this.membershipRevision += 1;
				this.pendingMembershipBytes += Buffer.byteLength(key);
				if (this.pendingMemberships.size >= 1024 || this.pendingMembershipBytes >= 1048576) {
					this.transaction(() => {
						for (const row of this.pendingMemberships.values()) this.insertMembership(row);
					});
					this.pendingMemberships.clear();
					this.pendingMembershipBytes = 0;
				}
			}
		};
	}
	selectActiveEntries() {
		const database = this.database;
		const db = getNodeSqliteKysely(database);
		const putNode = prepareSqliteQuerySync(database, (parameter) => db.insertInto("nodes").orReplace().values({
			id: parameter((row) => row.id),
			node_json: parameter((row) => JSON.stringify(row.node))
		}));
		const getNode = prepareSqliteQueryTakeFirstSync(database, (parameter) => db.selectFrom("nodes").select("node_json").where("id", "=", parameter((id) => id)));
		const hasNode = prepareSqliteQueryTakeFirstSync(database, (parameter) => db.selectFrom("nodes").select("id").where("id", "=", parameter((id) => id)));
		const byId = {
			get: (id) => {
				const row = getNode(id);
				return row ? JSON.parse(row.node_json) : void 0;
			},
			has: (id) => hasNode(id) !== void 0,
			set: (id, node) => {
				putNode({
					id,
					node
				});
			}
		};
		const clearSet = prepareSqliteQuerySync(database, (parameter) => db.deleteFrom("sets").where("kind", "=", parameter((kind) => kind)));
		const diskSet = (kind) => ({
			add: (id) => {
				this.insertMembership({
					kind,
					id
				});
			},
			has: (id) => this.hasMembership({
				kind,
				id
			}) !== void 0,
			clear: () => {
				clearSet(kind);
			}
		});
		function* records() {
			for (const row of iterateSqliteQuerySync(database, db.selectFrom("records").select("record_json").orderBy("idx"))) yield JSON.parse(row.record_json);
		}
		const tree = scanSessionTranscriptNavigation(records(), {
			byId,
			addNode: () => {},
			resetDescendantIds: diskSet("reset"),
			invalidLeafControlIds: diskSet("invalid")
		});
		if (tree.hasInvalidLeafControl) throw new Error("Archived transcript contains an invalid branch selection.");
		const putPath = prepareSqliteQuerySync(database, (parameter) => db.insertInto("paths").values({
			kind: parameter((row) => row.kind),
			position: parameter((row) => row.position),
			node_json: parameter((row) => row.node_json)
		}));
		const clearPath = prepareSqliteQuerySync(database, (parameter) => db.deleteFrom("paths").where("kind", "=", parameter((kind) => kind)));
		const getPath = prepareSqliteQueryIterator(database, (parameter) => db.selectFrom("paths").select("node_json").where("kind", "=", parameter((kind) => kind)).orderBy("position", "desc"));
		const paths = /* @__PURE__ */ new Map();
		const readPath = (leafId) => {
			let kind = paths.get(leafId);
			if (kind === void 0) {
				const pathKind = String(paths.size);
				kind = pathKind;
				paths.set(leafId, pathKind);
				const seen = diskSet("walk");
				seen.clear();
				let position = 0;
				if (!visitSessionTranscriptTreePathNodes(byId, leafId, seen, (node) => {
					putPath({
						kind: pathKind,
						position: position++,
						node_json: JSON.stringify(node)
					});
				})) clearPath(kind);
			}
			const selectedKind = kind;
			return { *[Symbol.iterator]() {
				for (const row of getPath(selectedKind)) yield JSON.parse(row.node_json);
			} };
		};
		const select = prepareSqliteQuerySync(database, (parameter) => db.insertInto("selected").orIgnore().columns(["seq", "owns_run"]).expression(db.selectFrom("records").select(["seq", "owns_run"]).where("idx", "=", parameter((index) => index))));
		for (const index of selectSessionTranscriptActiveEntryIndexes({
			tree,
			entryCount: this.count,
			recordAt: (recordIndex) => {
				const row = this.readRecord(recordIndex);
				return row ? JSON.parse(row.record_json) : void 0;
			},
			readPath
		})) select(index);
	}
};
//#endregion
//#region src/config/sessions/session-accessor.sqlite-archive-stream.ts
const MAX_TASK_ARCHIVE_RECORD_BYTES = 8388608;
const TASK_ARCHIVE_RECORD_CAPACITY_ERROR = "Archived transcript is unavailable because a record exceeds the task-history read capacity.";
/** Frame JSONL and retained multiline JSON as bytes; the caller owns strict JSON validation. */
async function* readTranscriptArchiveRecords(source, maxRecordBytes) {
	let fragments = [];
	let bytes = 0;
	let depth = 0;
	let quoted = false;
	let escaped = false;
	let hasContent = false;
	for await (const chunk of source) {
		let start = 0;
		for (let index = 0; index < chunk.byteLength; index += 1) {
			const byte = chunk[index];
			if (byte === 10 && (depth <= 0 || quoted)) {
				fragments.push(chunk.subarray(start, index));
				bytes += index - start;
				if (hasContent) yield Buffer.concat(fragments, bytes);
				fragments = [];
				bytes = 0;
				depth = 0;
				quoted = false;
				escaped = false;
				hasContent = false;
				start = index + 1;
				continue;
			}
			if (maxRecordBytes !== void 0 && bytes + index - start + 1 > maxRecordBytes) throw new Error(TASK_ARCHIVE_RECORD_CAPACITY_ERROR);
			if (byte !== 32 && byte !== 9 && byte !== 10 && byte !== 13) hasContent = true;
			if (escaped) escaped = false;
			else if (quoted && byte === 92) escaped = true;
			else if (byte === 34) quoted = !quoted;
			else if (!quoted) {
				if (byte === 123 || byte === 91) depth += 1;
				else if (byte === 125 || byte === 93) depth -= 1;
			}
		}
		if (start < chunk.byteLength) {
			fragments.push(chunk.subarray(start));
			bytes += chunk.byteLength - start;
		}
	}
	if (hasContent) yield Buffer.concat(fragments, bytes);
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-archive-read.ts
function listTranscriptArchivesFromDatabase({ db, agentId }, logicalAgentId, selectors, archiveNames) {
	if (!tableExists(db, "session_transcript_archives")) return [];
	let query = getNodeSqliteKysely(db).selectFrom("session_transcript_archives").select([
		"archive_name as archiveName",
		"session_id as sessionId",
		"session_key as sessionKey",
		"created_at as createdAt"
	]).orderBy("created_at").orderBy("session_id");
	query = query.where((expression) => expression.or([...selectors.length > 0 ? [expression("session_id", "in", selectors), expression("session_key", "in", selectors)] : [], ...archiveNames.length > 0 ? [expression("archive_name", "in", archiveNames)] : []]));
	return executeSqliteQuerySync(db, query).rows.map((row) => Object.assign(row, { agentId: resolveAgentIdFromSessionKey(row.sessionKey, agentId) })).filter((row) => logicalAgentId === void 0 || row.agentId === logicalAgentId);
}
function hasTranscriptArchiveInDatabase(database, target) {
	return listTranscriptArchivesFromDatabase(database, target.logicalAgentId, [target.sessionId ?? target.sessionKey], []).some((archive) => target.sessionId ? archive.sessionId === target.sessionId : archive.sessionKey === target.sessionKey);
}
function readTranscriptArchivePresenceInWorker(request) {
	const assertCurrent = () => assertExistingDatabaseIdentity(request.database.path, request.expectedIdentity.key, request.expectedIdentity.birthtime);
	assertCurrent();
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		const actual = readOpenClawAgentDatabaseIdentity(database);
		if (typeof actual.identity !== "string" || `file:${actual.identity}` !== request.expectedIdentity.key || actual.birthtime !== request.expectedIdentity.birthtime) throw new Error("SQLite archive metadata changed its captured database owner");
		return hasTranscriptArchiveInDatabase(database, request);
	}, {
		...request.database,
		env: request.env
	});
	assertCurrent();
	return result.found && result.value;
}
/** Scan one canonical read snapshot without constructing the decoded history. */
async function readTranscriptArchiveFinalInWorker(plan, env) {
	const assertCurrent = () => {
		if (plan.expectedIdentity) assertExistingDatabaseIdentity(plan.databasePath, plan.expectedIdentity.key, plan.expectedIdentity.birthtime);
	};
	assertCurrent();
	const opened = openOpenClawAgentDatabaseReadOnly({
		agentId: plan.agentId,
		path: plan.databasePath,
		env
	});
	if (!opened.found) {
		assertCurrent();
		return {};
	}
	const database = opened.database;
	let transactionOpen = false;
	try {
		if (plan.expectedIdentity) {
			const actual = readOpenClawAgentDatabaseIdentity(database);
			if (typeof actual.identity !== "string" || `file:${actual.identity}` !== plan.expectedIdentity.key || actual.birthtime !== plan.expectedIdentity.birthtime) throw new Error("SQLite archive read changed its captured database owner");
		}
		database.db.exec("BEGIN");
		transactionOpen = true;
		const archives = listTranscriptArchivesFromDatabase(database, plan.logicalAgentId, [plan.sessionId ?? plan.sessionKey], []).toReversed();
		const result = {};
		for (const archive of archives) {
			if (plan.sessionId ? archive.sessionId !== plan.sessionId : archive.sessionKey !== plan.sessionKey) continue;
			const row = executeSqliteQueryTakeFirstSync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_transcript_archives").select([
				"archive_blob",
				"archive_sha256",
				"encoding"
			]).where("archive_name", "=", archive.archiveName).where("session_id", "=", archive.sessionId).where("session_key", "=", archive.sessionKey));
			if (!row) continue;
			if (hashSessionArchiveBytes(row.archive_blob) !== row.archive_sha256) throw new Error("Archived transcript bytes do not match their registered hash.");
			await scanArchivedTranscript(row.archive_blob, row.encoding === "zstd", archive.sessionId, (event) => {
				if (isVisibleAssistantResultEventForRun(event, plan.runId)) result.event = event;
			});
			if (result.event !== void 0) break;
		}
		database.db.exec("COMMIT");
		transactionOpen = false;
		assertCurrent();
		return result;
	} finally {
		try {
			if (transactionOpen) database.db.exec("ROLLBACK");
		} finally {
			database.close();
		}
	}
}
async function scanArchivedTranscript(bytes, compressed, sessionId, visit, decodedBudget, maxRecordBytes) {
	const input = Readable.from((function* () {
		for (let offset = 0; offset < bytes.byteLength; offset += 65536) yield bytes.subarray(offset, offset + 65536);
	})());
	const createZstdDecompress = zlib.createZstdDecompress;
	if (compressed && !createZstdDecompress) throw new Error("Cannot decode compressed transcript archive: this runtime lacks zstd support");
	let headerRead = false;
	let sessionStartedAt;
	let seq = 1;
	const scan = async (source) => {
		for await (const record of readTranscriptArchiveRecords(source, maxRecordBytes)) {
			const event = JSON.parse(record.toString("utf8"));
			if (!headerRead) {
				if (!isRecord(event) || event.type !== "session" || event.id !== sessionId) throw new Error("Archived transcript header does not match its registered session.");
				headerRead = true;
				sessionStartedAt = readSessionTranscriptHeaderStartedAt(event, sessionId);
			} else visit(event, seq++);
		}
	};
	const bound = new Transform({ transform(chunk, _encoding, callback) {
		if (decodedBudget) decodedBudget.remainingBytes -= chunk.byteLength;
		callback(decodedBudget !== void 0 && decodedBudget.remainingBytes < 0 ? /* @__PURE__ */ new Error("Archived transcript exceeds the bounded read size.") : null, chunk);
	} });
	await pipeline$1([
		input,
		...compressed && createZstdDecompress ? [createZstdDecompress.call(zlib)] : [],
		...decodedBudget === void 0 ? [] : [bound],
		scan
	]);
	if (!headerRead) throw new Error("Archived transcript header does not match its registered session.");
	return sessionStartedAt;
}
function readArchivePageCursor(plan) {
	if (plan.cursor === void 0) return;
	if (plan.cursor.length > 4096) throw new Error("Invalid archived transcript cursor.");
	let cursor;
	try {
		const bytes = Buffer.from(plan.cursor, "base64url");
		if (bytes.toString("base64url") !== plan.cursor) throw new Error("Noncanonical archived transcript cursor.");
		cursor = JSON.parse(bytes.toString("utf8"));
	} catch {
		throw new Error("Invalid archived transcript cursor.");
	}
	if (!isRecord(cursor) || cursor.sessionKey !== plan.sessionKey || cursor.runId !== plan.runId || typeof cursor.sessionId !== "string" || typeof cursor.generation !== "string" || typeof cursor.sha256 !== "string" || typeof cursor.beforeSeq !== "number" || !Number.isSafeInteger(cursor.beforeSeq) || cursor.beforeSeq < 0) throw new Error("Invalid archived transcript cursor.");
	return {
		sessionKey: cursor.sessionKey,
		runId: cursor.runId,
		sessionId: cursor.sessionId,
		generation: cursor.generation,
		sha256: cursor.sha256,
		beforeSeq: cursor.beforeSeq
	};
}
function sameArchiveBinding(left, right) {
	return left.sessionId === right.sessionId && left.generation === right.generation && left.sha256 === right.sha256;
}
/** Select a unique run-owned archive, never the newest archive for a reused key. */
async function readTranscriptArchivePageInWorker(plan, env) {
	const [{ prepareChatHistoryRecoveryMessages }, { createSubagentCoordinationHistoryProjection, createPreSessionStartAnnouncePairFilter }, { createBoundSessionHistorySubagentSource }, { projectTranscriptEntryMessage }] = await Promise.all([
		import("./chat-display-projection.core-BermlSUA.mjs"),
		import("./chat-display-projection.history-BwJmMvNQ.mjs"),
		import("./session-history-subagent-sources-DVKQIdof.mjs"),
		import("./session-transcript-entry-message-UHxZHAD-.mjs")
	]);
	const cursor = readArchivePageCursor(plan);
	const expectedBinding = plan.verifyBinding ?? cursor;
	const opened = openOpenClawAgentDatabaseReadOnly({
		agentId: plan.agentId,
		path: plan.databasePath,
		env
	});
	if (!opened.found) {
		if (expectedBinding) throw new Error("Archived transcript is no longer available.");
		return;
	}
	const database = opened.database;
	let transactionOpen = false;
	try {
		database.db.exec("BEGIN");
		transactionOpen = true;
		let result;
		let foundRun = false;
		if (resolveAgentIdFromSessionKey(plan.sessionKey, database.agentId) === plan.logicalAgentId && tableExists(database.db, "session_transcript_archives")) {
			const archiveQuery = getNodeSqliteKysely(database.db).selectFrom("session_transcript_archives").where("session_key", "=", plan.sessionKey);
			const sizing = executeSqliteQueryTakeFirstSync(database.db, archiveQuery.select(({ fn }) => [fn.countAll().as("count"), fn.sum(fn("length", ["archive_blob"])).as("bytes")]));
			if (sizing && (sizing.count > 1e4 || (sizing.bytes ?? 0) > 268435456)) throw new Error("Archived transcript candidates exceed the bounded read size.");
			const archives = executeSqliteQuerySync(database.db, archiveQuery.select([
				"session_id",
				"generation",
				"archive_sha256"
			])).rows;
			const selectionBudget = { remainingBytes: MAX_MATERIALIZED_ARCHIVE_BATCH_BYTES };
			for (const archive of archives) {
				const row = executeSqliteQueryTakeFirstSync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_transcript_archives").select(["archive_blob", "encoding"]).where("session_key", "=", plan.sessionKey).where("session_id", "=", archive.session_id).where("generation", "=", archive.generation));
				if (!row || hashSessionArchiveBytes(row.archive_blob) !== archive.archive_sha256) throw new Error("Archived transcript bytes do not match their registered hash.");
				const binding = {
					sessionId: archive.session_id,
					generation: archive.generation,
					sha256: archive.archive_sha256
				};
				const entries = [];
				await withTranscriptArchiveSelection(async (selection) => {
					const sessionStartedAt = await scanArchivedTranscript(row.archive_blob, row.encoding === "zstd", archive.session_id, (event, seq) => {
						if (!isRecord(event)) return;
						const ownsRun = (readSessionTranscriptRunId(event.message) ?? readSessionTranscriptFailureRunId(event)) === plan.runId;
						const record = {};
						for (const key of [
							"type",
							"id",
							"parentId",
							"targetId",
							"appendParentId",
							"appendMode",
							"firstKeptEntryId"
						]) if (Object.hasOwn(event, key)) {
							const value = event[key];
							record[key] = typeof value === "string" || value === null ? value : false;
						}
						selection.append(record, seq, ownsRun);
					}, selectionBudget, MAX_TASK_ARCHIVE_RECORD_BYTES);
					foundRun ||= selection.hasRun;
					if (!selection.select()) return;
					if (result) throw new Error("Multiple archived transcript generations contain this run.");
					if (expectedBinding && !sameArchiveBinding(expectedBinding, binding)) throw new Error("Archived transcript identity changed.");
					if (plan.verifyBinding) {
						result = {
							binding,
							entries: [],
							totalMessages: 0
						};
						return;
					}
					if (cursor && !selection.has(cursor.beforeSeq)) throw new Error("Invalid archived transcript cursor position.");
					let totalMessages = 0;
					let selectedBytes = 0;
					let hasOlder = false;
					let eligibleMessages = 0;
					let oversizedSeq;
					let preceding = [];
					let precedingHead = 0;
					let precedingBytes = 0;
					const sourceTrue = selection.membership("coord-source-true");
					const sourceFalse = selection.membership("coord-source-false");
					const source = createBoundSessionHistorySubagentSource((read) => read({
						database,
						resolved: { agentId: plan.logicalAgentId }
					}), plan.projectionSources?.stateDatabase, () => plan.projectionSources?.sourceDatabases, {
						get: (key) => sourceTrue.has(key) ? true : sourceFalse.has(key) ? false : void 0,
						set: (key, value) => (value ? sourceTrue : sourceFalse).add(key)
					});
					const projectCoordination = createSubagentCoordinationHistoryProjection({
						isSubagentSession: (key) => {
							if (!plan.projectionSources) throw new Error("Archived transcript coordination sources are unavailable.");
							return source(key);
						},
						isSubagentRunMessage: () => false
					}, {
						hiddenInputKeys: selection.membership("coord-hidden-input"),
						visibleInputKeys: selection.membership("coord-visible-input"),
						visibleSteerRunIds: selection.membership("coord-visible-steer")
					});
					const contextEntries = [];
					const contextMaxMessages = plan.contextMaxMessages ?? 0;
					let contextBytes = 0;
					let contextStopped = false;
					const trimPrecedingContext = (extraBytes = 0, extraMessages = 0) => {
						while (precedingHead < preceding.length && (selectedBytes + precedingBytes + contextBytes + extraBytes > plan.maxBytes || preceding.length - precedingHead + contextEntries.length + extraMessages > contextMaxMessages)) {
							const removed = preceding[precedingHead];
							if (!removed) throw new Error("Archived transcript context is unavailable.");
							precedingBytes -= removed.bytes;
							preceding[precedingHead++] = void 0;
						}
						if (precedingHead >= contextMaxMessages) {
							preceding = preceding.slice(precedingHead);
							precedingHead = 0;
						}
					};
					const filterAnnouncePairs = createPreSessionStartAnnouncePairFilter(sessionStartedAt);
					await scanArchivedTranscript(row.archive_blob, row.encoding === "zstd", archive.session_id, (event, seq) => {
						if (!selection.has(seq) || !isVisibleTranscriptRecord(event)) return;
						const messages = filterAnnouncePairs([projectTranscriptEntryMessage(event, seq)]);
						if (messages.length === 0) return;
						const [display] = projectCoordination(prepareChatHistoryRecoveryMessages(messages));
						const visibleEntry = {
							event,
							seq,
							...isRecord(display) && display.display === false ? { coordinationHidden: true } : {}
						};
						totalMessages += 1;
						if (cursor && seq >= cursor.beforeSeq) {
							if (contextStopped || contextMaxMessages === 0 || oversizedSeq !== void 0) return;
							if (isRecord(event.message) && event.message.role === "user" || contextEntries.length >= contextMaxMessages) {
								contextStopped = true;
								return;
							}
							const bytes = Buffer.byteLength(JSON.stringify(event), "utf8");
							if (selectedBytes + contextBytes + bytes > plan.maxBytes) {
								contextStopped = true;
								return;
							}
							trimPrecedingContext(bytes, 1);
							contextEntries.push(visibleEntry);
							contextBytes += bytes;
							return;
						}
						eligibleMessages += 1;
						const bytes = Buffer.byteLength(JSON.stringify(event), "utf8");
						if (bytes > plan.maxBytes) {
							entries.length = 0;
							selectedBytes = 0;
							preceding = [];
							precedingHead = 0;
							precedingBytes = 0;
							oversizedSeq = seq;
							hasOlder = eligibleMessages > 1;
							return;
						}
						if (oversizedSeq !== void 0) {
							hasOlder = true;
							oversizedSeq = void 0;
						}
						entries.push({
							...visibleEntry,
							bytes
						});
						selectedBytes += bytes;
						while (entries.length > plan.limit || selectedBytes > plan.maxBytes) {
							const removed = entries.shift();
							selectedBytes -= removed.bytes;
							preceding.push(removed);
							precedingBytes += removed.bytes;
							hasOlder = true;
						}
						trimPrecedingContext();
					}, { remainingBytes: MAX_MATERIALIZED_ARCHIVE_BATCH_BYTES }, MAX_TASK_ARCHIVE_RECORD_BYTES);
					const projectionContext = [...preceding.slice(precedingHead).flatMap((entry) => {
						if (!entry) return [];
						const { bytes: _bytes, ...record } = entry;
						return [record];
					}), ...contextEntries];
					const beforeSeq = entries[0]?.seq ?? oversizedSeq;
					result = {
						binding,
						entries: entries.map(({ bytes: _bytes, ...entry }) => entry),
						...projectionContext.length > 0 ? { contextEntries: projectionContext } : {},
						totalMessages,
						...oversizedSeq !== void 0 ? { omittedOversized: true } : {},
						...hasOlder && beforeSeq !== void 0 ? { nextCursor: Buffer.from(JSON.stringify({
							...binding,
							sessionKey: plan.sessionKey,
							runId: plan.runId,
							beforeSeq
						}), "utf8").toString("base64url") } : {}
					};
				});
			}
		}
		if (!result && foundRun) throw new Error("Archived transcript run is not on the active branch.");
		if (!result && expectedBinding) throw new Error("Archived transcript is no longer available.");
		database.db.exec("COMMIT");
		transactionOpen = false;
		return result;
	} finally {
		try {
			if (transactionOpen) database.db.exec("ROLLBACK");
		} finally {
			database.close();
		}
	}
}
//#endregion
export { readTranscriptArchivePresenceInWorker as a, readTranscriptArchivePageInWorker as i, listTranscriptArchivesFromDatabase as n, readTranscriptArchiveFinalInWorker as r, hasTranscriptArchiveInDatabase as t };
