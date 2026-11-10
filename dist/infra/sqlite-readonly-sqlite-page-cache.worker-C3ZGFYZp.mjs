import { D as getNodeSqliteKysely, E as executeSqliteQueryTakeFirstSync, T as executeSqliteQuerySync, i as setSqliteBusyTimeout, s as openNodeSqliteDatabase } from "./sqlite-readonly-sqlite-busy-timeout-CPLgQzS6.mjs";
import fs from "node:fs";
import { performance } from "node:perf_hooks";
import { samplePageCacheResidency } from "@openclaw/proc-safe/diagnostics";
//#region src/infra/sqlite-page-cache-residency.ts
/** Worker-only, bounded file residency sample; it does not identify SQLite's logical hot set. */
function readSqlitePageCacheResidency(pathname) {
	if (process.platform !== "linux") return;
	const fd = fs.openSync(pathname, "r");
	try {
		const stat = fs.fstatSync(fd);
		if (!stat.isFile()) throw new Error("SQLite page-cache residency requires a regular file");
		const { sampledPages, residentPages, pageSize } = samplePageCacheResidency(fd, { maxPages: 256 });
		return {
			scope: "file-sample",
			sampledPages,
			residentPages,
			residentRatio: sampledPages === 0 ? 1 : residentPages / sampledPages,
			pageSize,
			sizeBytes: stat.size
		};
	} finally {
		fs.closeSync(fd);
	}
}
//#endregion
//#region src/infra/sqlite-page-cache.worker.ts
const CHUNK_BYTES = 1048576;
const RECENT_MS = 6048e5;
const PAYLOAD_RECENT_MS = 1728e5;
const MAX_PROJECTION_BYTES = 262144;
const PAYLOAD_BATCH_MESSAGES = 8;
const MAX_PAYLOAD_MESSAGES = 32;
const MAX_PAYLOAD_BYTES = 65536;
function readIo() {
	const io = fs.readFileSync("/proc/self/io", "utf8");
	return {
		readBytes: Number(/^rchar: (\d+)$/m.exec(io)?.[1] ?? 0),
		diskBytes: Number(/^read_bytes: (\d+)$/m.exec(io)?.[1] ?? 0)
	};
}
/** Keyset reads finish before yielding; no SQLite snapshot survives the returned row. */
function* recentSessions(db, since) {
	const recent = getNodeSqliteKysely(db).selectFrom("session_nodes").select([
		"session_key",
		"current_session_id",
		"updated_at"
	]).where("updated_at", ">=", since).orderBy("updated_at", "desc").orderBy("session_key").limit(1);
	let cursor;
	for (let visited = 0; visited < 4096; visited++) {
		const row = (cursor ? executeSqliteQueryTakeFirstSync(db, recent.where("updated_at", "=", cursor.updated_at).where("session_key", ">", cursor.session_key)) : void 0) ?? executeSqliteQueryTakeFirstSync(db, cursor ? recent.where("updated_at", "<", cursor.updated_at) : recent);
		if (!row) return;
		cursor = row;
		yield row;
	}
}
function sessionEntryProjection(query) {
	return query.selectFrom("session_nodes").select((eb) => eb.case().when(eb.fn("octet_length", ["entry_json"]), "<=", MAX_PROJECTION_BYTES).then(eb.ref("entry_json")).else(null).end().as("entry"));
}
function* agentHotPages(db, now) {
	const query = getNodeSqliteKysely(db);
	for (const row of recentSessions(db, now - RECENT_MS)) {
		executeSqliteQuerySync(db, sessionEntryProjection(query).where("session_key", "=", row.session_key));
		for (const column of [
			"active_position",
			"event_seq",
			"message_position"
		]) {
			const recent = query.selectFrom("session_transcript_active_events").select(column).where("session_id", "=", row.current_session_id);
			executeSqliteQuerySync(db, (column === "message_position" ? recent.where(column, "is not", null) : recent).orderBy(column, "desc").limit(256));
		}
		for (const messagesOnly of [false, true]) {
			const recent = query.selectFrom("transcript_event_identities").select("seq").where("session_id", "=", row.current_session_id);
			executeSqliteQuerySync(db, (messagesOnly ? recent.where("event_type", "=", "message") : recent).orderBy("seq", "desc").limit(256));
		}
		yield;
	}
	for (const row of recentSessions(db, now - PAYLOAD_RECENT_MS)) {
		const { rows: tail } = executeSqliteQuerySync(db, query.selectFrom("session_transcript_active_events").select("event_seq").where("session_id", "=", row.current_session_id).where("message_position", "is not", null).orderBy("message_position", "desc").limit(MAX_PAYLOAD_MESSAGES));
		yield;
		for (let offset = 0; offset < tail.length; offset += PAYLOAD_BATCH_MESSAGES) {
			const sequences = tail.slice(offset, offset + PAYLOAD_BATCH_MESSAGES).map((event) => event.event_seq);
			const { rows: messages } = executeSqliteQuerySync(db, query.selectFrom("transcript_events").select((eb) => {
				const bounded = (column) => eb.case().when(eb.fn("octet_length", [column]), "<=", MAX_PAYLOAD_BYTES).then(eb.ref(column)).else(null).end();
				return [bounded("event_json").as("json"), bounded("event_zstd").as("compressed")];
			}).where("session_id", "=", row.current_session_id).where("seq", "in", sequences));
			const stats = {
				payloadBytes: 0,
				payloadMessages: 0
			};
			for (const message of messages) {
				stats.payloadBytes += message.json === null ? 0 : Buffer.byteLength(message.json);
				stats.payloadBytes += message.compressed?.byteLength ?? 0;
				stats.payloadMessages += Number(message.json !== null || message.compressed !== null);
			}
			yield stats;
		}
	}
}
function* sharedPages(pathname) {
	const fd = fs.openSync(pathname, "r");
	try {
		const size = fs.fstatSync(fd).size;
		const buffer = Buffer.allocUnsafe(CHUNK_BYTES);
		for (let offset = 0; offset < size; offset += CHUNK_BYTES) {
			if (fs.readSync(fd, buffer, 0, Math.min(CHUNK_BYTES, size - offset), offset) === 0) break;
			yield;
		}
	} finally {
		fs.closeSync(fd);
	}
}
let active;
function* warm(pathname, input) {
	const started = performance.now();
	const initial = readIo();
	const progress = {
		residency: readSqlitePageCacheResidency(pathname),
		readBytes: 0,
		diskBytes: 0,
		elapsedMs: 0,
		complete: false,
		limited: false,
		payloadBytes: 0,
		payloadMessages: 0
	};
	let db;
	let measureQuery;
	const update = () => {
		const io = readIo();
		progress.readBytes = io.readBytes - initial.readBytes;
		progress.diskBytes = io.diskBytes - initial.diskBytes;
		progress.elapsedMs = performance.now() - started;
		return { ...progress };
	};
	try {
		if (input.kind === "agent") {
			db = openNodeSqliteDatabase(pathname, { readOnly: true });
			setSqliteBusyTimeout(db, 0);
			db.exec("PRAGMA cache_size = -1024; PRAGMA mmap_size = 0;");
			const hotQuery = sessionEntryProjection(getNodeSqliteKysely(db)).where("updated_at", ">=", input.now - RECENT_MS).orderBy("updated_at", "desc").limit(8);
			const database = db;
			measureQuery = () => {
				database.exec("PRAGMA shrink_memory");
				const before = performance.now();
				executeSqliteQuerySync(database, hotQuery);
				return performance.now() - before;
			};
			progress.queryBeforeMs = measureQuery();
		}
		yield update();
		if ((progress.residency?.residentRatio ?? 1) < .8 || (progress.queryBeforeMs ?? 0) > 10) {
			const pages = db ? agentHotPages(db, input.now) : sharedPages(pathname);
			try {
				for (const chunk of pages) {
					if (chunk) {
						progress.payloadBytes += chunk.payloadBytes;
						progress.payloadMessages += chunk.payloadMessages;
					}
					update();
					if (Math.max(progress.readBytes, progress.diskBytes) >= input.maxBytes) {
						progress.limited = true;
						break;
					}
					yield update();
				}
			} finally {
				pages.return();
			}
			progress.queryAfterMs = measureQuery?.();
			progress.residencyAfter = readSqlitePageCacheResidency(pathname);
		}
		progress.complete = true;
		yield update();
	} finally {
		db?.close();
	}
}
function advance(pathname) {
	if (!active || active.path !== pathname) throw new Error("Database page-cache warm is no longer active");
	try {
		const result = active.steps.next();
		if (result.done) throw new Error("Database page-cache warm ended without progress");
		if (result.value.complete) {
			active.steps.return();
			active = void 0;
		}
		return result.value;
	} catch (error) {
		active = void 0;
		throw error;
	}
}
const pageCacheReadOperations = {
	"pageCache.begin": (input, context) => {
		active?.steps.return();
		active = {
			path: context.path,
			steps: warm(context.path, input)
		};
		return advance(context.path);
	},
	"pageCache.step": (_input, context) => {
		return advance(context.path);
	}
};
//#endregion
export { pageCacheReadOperations };
