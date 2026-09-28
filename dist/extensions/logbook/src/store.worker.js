import { i as asOptionalObjectRecord } from "../../../record-coerce-DItp3I4t.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, s as prepareSqliteQuerySync } from "../../../kysely-sync-Bn6Qrpbz.mjs";
import { r as enableNodeSqliteKyselyStatementCache } from "../../../kysely-sync-cache-state-CFxglP-_.mjs";
import { t as openNodeSqliteDatabase } from "../../../node-sqlite-BO6jRFcG.mjs";
import { o as runSqliteImmediateTransactionSync } from "../../../sqlite-transaction-DKSXLQhb.mjs";
import { t as configureSqliteConnectionPragmas } from "../../../sqlite-wal-BzoPsBh0.mjs";
import { t as migrateSqliteSchemaToStrict } from "../../../sqlite-strict-DxDkCm9i.mjs";
import "../../../string-coerce-runtime-C_MKhRVt.mjs";
import "../../../sqlite-worker-runtime-BV5P9OQ4.mjs";
import { t as expectDefined } from "../../../expect-runtime-CJBt0Gq2.mjs";
import "../../../plugin-state-runtime-BxOzg-qH.mjs";
import { i as pickKeyframeId } from "../../../analyze-8ysrnznv.mjs";
import { chmodSync, mkdirSync, rmSync, rmdirSync } from "node:fs";
import path from "node:path";
//#region extensions/logbook/src/store-frame-queries.ts
function createLogbookFrameQueries(db, query) {
	const framesQuery = query.selectFrom("frames").select([
		"id",
		"captured_at_ms",
		"day",
		"path",
		"screen_index",
		"width",
		"height",
		"byte_size",
		"idle"
	]).orderBy("captured_at_ms", "asc").orderBy("id", "asc");
	return {
		framesQuery,
		sampledBatchFrames: prepareSqliteQuerySync(db, (p) => {
			const sampledIds = query.with("ordered_frames", (cte) => cte.selectFrom("frames").select("id").select((eb) => [eb.fn.agg("row_number", []).over((ob) => ob.orderBy("captured_at_ms", "asc").orderBy("id", "asc")).as("ordinal"), eb.fn.countAll().over().as("total")]).where("batch_id", "=", p((batchId) => batchId))).selectFrom("ordered_frames").select("id").where((eb) => {
				const step = eb(eb.cast(eb("total", "-", eb.val(1)), "real"), "/", eb.val(15));
				return eb.or([eb("total", "<=", 16), ...Array.from({ length: 16 }, (_, index) => eb("ordinal", "=", eb(eb.cast(eb(eb(eb.val(index), "*", step), "+", eb.val(.5)), "integer"), "+", eb.val(1))))]);
			});
			return framesQuery.where("id", "in", sampledIds);
		})
	};
}
//#endregion
//#region extensions/logbook/src/store-schema.ts
const SCHEMA = `
CREATE TABLE IF NOT EXISTS batches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day TEXT NOT NULL,
  start_ms INTEGER NOT NULL,
  end_ms INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'done', 'error')),
  error TEXT,
  frame_count INTEGER NOT NULL DEFAULT 0,
  model TEXT,
  created_ms INTEGER NOT NULL,
  updated_ms INTEGER NOT NULL
) STRICT;
CREATE INDEX IF NOT EXISTS idx_logbook_batches_day ON batches (day, start_ms);
CREATE TABLE IF NOT EXISTS frames (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  captured_at_ms INTEGER NOT NULL,
  day TEXT NOT NULL,
  path TEXT NOT NULL,
  screen_index INTEGER NOT NULL DEFAULT 0,
  width INTEGER,
  height INTEGER,
  byte_size INTEGER NOT NULL DEFAULT 0,
  content_hash TEXT NOT NULL,
  idle INTEGER NOT NULL DEFAULT 0 CHECK (idle IN (0, 1)),
  batch_id INTEGER REFERENCES batches(id) ON DELETE SET NULL
) STRICT;
CREATE INDEX IF NOT EXISTS idx_logbook_frames_day ON frames (day, captured_at_ms);
CREATE INDEX IF NOT EXISTS idx_logbook_frames_captured_at ON frames (captured_at_ms);
CREATE INDEX IF NOT EXISTS idx_logbook_frames_unbatched ON frames (batch_id) WHERE batch_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_logbook_frames_batch ON frames (batch_id, captured_at_ms) WHERE batch_id IS NOT NULL;
CREATE TABLE IF NOT EXISTS observations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  batch_id INTEGER NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  day TEXT NOT NULL,
  start_ms INTEGER NOT NULL,
  end_ms INTEGER NOT NULL,
  text TEXT NOT NULL
) STRICT;
CREATE INDEX IF NOT EXISTS idx_logbook_observations_day ON observations (day, start_ms);
CREATE INDEX IF NOT EXISTS idx_logbook_observations_batch ON observations (batch_id);
CREATE TABLE IF NOT EXISTS cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day TEXT NOT NULL,
  start_ms INTEGER NOT NULL,
  end_ms INTEGER NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'other',
  app_primary TEXT,
  app_secondary TEXT,
  distractions TEXT NOT NULL DEFAULT '[]',
  keyframe_id INTEGER REFERENCES frames(id) ON DELETE SET NULL,
  updated_ms INTEGER NOT NULL
) STRICT;
CREATE INDEX IF NOT EXISTS idx_logbook_cards_day ON cards (day, start_ms);
CREATE INDEX IF NOT EXISTS idx_logbook_cards_keyframe ON cards (keyframe_id) WHERE keyframe_id IS NOT NULL;
CREATE TABLE IF NOT EXISTS standups (
  day TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  updated_ms INTEGER NOT NULL
) STRICT;
`;
function toFrame(row) {
	return {
		id: row.id,
		capturedAtMs: row.captured_at_ms,
		day: row.day,
		path: row.path,
		screenIndex: row.screen_index,
		width: row.width ?? void 0,
		height: row.height ?? void 0,
		byteSize: row.byte_size,
		idle: row.idle === 1
	};
}
function toBatch(row) {
	return {
		id: row.id,
		day: row.day,
		startMs: row.start_ms,
		endMs: row.end_ms,
		status: row.status,
		error: row.error ?? void 0,
		frameCount: row.frame_count,
		model: row.model ?? void 0
	};
}
function parseDistractions(raw) {
	try {
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.filter((entry) => {
			const record = asOptionalObjectRecord(entry);
			return record !== void 0 && typeof record.title === "string" && typeof record.startMs === "number" && typeof record.endMs === "number";
		});
	} catch {
		return [];
	}
}
function toCard(row) {
	return {
		id: row.id,
		day: row.day,
		startMs: row.start_ms,
		endMs: row.end_ms,
		title: row.title,
		summary: row.summary,
		detail: row.detail,
		category: row.category,
		appPrimary: row.app_primary ?? void 0,
		appSecondary: row.app_secondary ?? void 0,
		distractions: parseDistractions(row.distractions),
		keyframeId: row.keyframe_id ?? void 0
	};
}
//#endregion
//#region extensions/logbook/src/store.worker.ts
const LOGBOOK_SQLITE_BUSY_TIMEOUT_MS = 5e3;
const FRAME_PRUNE_BATCH_SIZE = 64;
var LogbookDatabaseStore = class {
	constructor(dataDir, dbPath) {
		mkdirSync(dataDir, {
			recursive: true,
			mode: 448
		});
		chmodSync(dataDir, 448);
		this.framesDir = path.join(dataDir, "frames");
		mkdirSync(this.framesDir, {
			recursive: true,
			mode: 448
		});
		chmodSync(this.framesDir, 448);
		const db = openNodeSqliteDatabase(dbPath);
		let walMaintenance;
		try {
			enableNodeSqliteKyselyStatementCache(db);
			chmodSync(dbPath, 384);
			walMaintenance = configureSqliteConnectionPragmas(db, {
				busyTimeoutMs: LOGBOOK_SQLITE_BUSY_TIMEOUT_MS,
				databaseLabel: "logbook",
				databasePath: dbPath,
				foreignKeys: true,
				synchronous: "NORMAL"
			});
			const versionRow = db.prepare("PRAGMA user_version").get();
			const schemaVersion = Number(versionRow?.user_version ?? 0);
			if (schemaVersion > 1) throw new Error(`Logbook database uses newer schema version ${schemaVersion}; this build supports 1`);
			db.exec(SCHEMA);
			if (schemaVersion < 1) {
				migrateSqliteSchemaToStrict(db, SCHEMA, { databaseLabel: dbPath });
				db.exec(`PRAGMA user_version = 1;`);
			}
			this.db = db;
			this.walMaintenance = walMaintenance;
			this.query = getNodeSqliteKysely(db);
			const { framesQuery, sampledBatchFrames } = createLogbookFrameQueries(db, this.query);
			this.framesQuery = framesQuery;
			this.batchesQuery = this.query.selectFrom("batches").select([
				"id",
				"day",
				"start_ms",
				"end_ms",
				"status",
				"error",
				"frame_count",
				"model"
			]);
			this.cardsQuery = this.query.selectFrom("cards");
			this.statements = {
				sampledBatchFrames,
				insertFrame: prepareSqliteQuerySync(db, (p) => this.query.insertInto("frames").values({
					captured_at_ms: p((row) => row.capturedAtMs),
					day: p((row) => row.day),
					path: p((row) => row.path),
					screen_index: p((row) => row.screenIndex),
					width: p((row) => row.width ?? null),
					height: p((row) => row.height ?? null),
					byte_size: p((row) => row.byteSize),
					content_hash: p((row) => row.contentHash),
					idle: p((row) => row.idle ? 1 : 0)
				})),
				insertBatch: prepareSqliteQuerySync(db, (p) => this.query.insertInto("batches").values({
					day: p((row) => row.day),
					start_ms: p((row) => row.startMs),
					end_ms: p((row) => row.endMs),
					status: "pending",
					frame_count: p((row) => row.frameIds.length),
					created_ms: p((row) => row.now),
					updated_ms: p((row) => row.now)
				})),
				assignFrame: prepareSqliteQuerySync(db, (p) => this.query.updateTable("frames").set({ batch_id: p((row) => row.batchId) }).where("id", "=", p((row) => row.frameId)).where("batch_id", "is", null)),
				setBatchStatus: prepareSqliteQuerySync(db, (p) => this.query.updateTable("batches").set((eb) => ({
					status: p((row) => row.status),
					error: p((row) => row.error ?? null),
					model: eb.fn.coalesce(p((row) => row.model ?? null), "model"),
					updated_ms: p((row) => row.now)
				})).where("id", "=", p((row) => row.batchId))),
				resetRunningBatches: prepareSqliteQuerySync(db, (p) => this.query.updateTable("batches").set({
					status: "pending",
					updated_ms: p((now) => now)
				}).where("status", "=", "running")),
				resetErrorBatches: prepareSqliteQuerySync(db, (p) => this.query.updateTable("batches").set({
					status: "pending",
					error: null,
					updated_ms: p((now) => now)
				}).where("status", "=", "error")),
				deleteObservations: prepareSqliteQuerySync(db, (p) => this.query.deleteFrom("observations").where("batch_id", "=", p((batchId) => batchId))),
				insertObservation: prepareSqliteQuerySync(db, (p) => this.query.insertInto("observations").values({
					batch_id: p((row) => row.batchId),
					day: p((row) => row.day),
					start_ms: p((row) => row.startMs),
					end_ms: p((row) => row.endMs),
					text: p((row) => row.text)
				})),
				deleteCards: prepareSqliteQuerySync(db, (p) => this.query.deleteFrom("cards").where("day", "=", p((window) => window.day)).where("end_ms", ">", p((window) => window.startMs)).where("start_ms", "<", p((window) => window.endMs))),
				insertCard: prepareSqliteQuerySync(db, (p) => this.query.insertInto("cards").values({
					day: p((row) => row.day),
					start_ms: p((row) => row.startMs),
					end_ms: p((row) => row.endMs),
					title: p((row) => row.title),
					summary: p((row) => row.summary),
					detail: p((row) => row.detail),
					category: p((row) => row.category),
					app_primary: p((row) => row.appPrimary ?? null),
					app_secondary: p((row) => row.appSecondary ?? null),
					distractions: p((row) => JSON.stringify(row.distractions)),
					keyframe_id: p((row) => row.keyframeId ?? null),
					updated_ms: p((row) => row.now)
				})),
				saveStandup: prepareSqliteQuerySync(db, (p) => this.query.insertInto("standups").values({
					day: p((row) => row.day),
					text: p((row) => row.text),
					updated_ms: p((row) => row.now)
				}).onConflict((conflict) => conflict.column("day").doUpdateSet((eb) => ({
					text: eb.ref("excluded.text"),
					updated_ms: eb.ref("excluded.updated_ms")
				}))))
			};
		} catch (error) {
			try {
				walMaintenance?.close();
			} catch {}
			try {
				db.close();
			} catch {}
			throw error;
		}
	}
	close() {
		try {
			this.walMaintenance.close();
		} finally {
			this.db.close();
		}
	}
	insertFrame(params) {
		const result = this.statements.insertFrame(params);
		return Number(expectDefined(result.insertId, "Logbook inserted frame ID"));
	}
	lastFrame() {
		const row = executeSqliteQueryTakeFirstSync(this.db, this.query.selectFrom("frames").select(["captured_at_ms", "content_hash"]).orderBy("captured_at_ms", "desc").orderBy("id", "desc").limit(1));
		return row ? {
			capturedAtMs: row.captured_at_ms,
			contentHash: row.content_hash
		} : null;
	}
	unbatchedActiveFrames(limit) {
		return executeSqliteQuerySync(this.db, this.framesQuery.clearSelect().select([
			"id",
			"captured_at_ms",
			"screen_index",
			"width",
			"height",
			"byte_size",
			"idle"
		]).where("batch_id", "is", null).where("idle", "=", 0).limit(limit)).rows.map((row) => ({
			id: row.id,
			capturedAtMs: row.captured_at_ms
		}));
	}
	countUnbatchedActiveFrames() {
		const row = executeSqliteQueryTakeFirstSync(this.db, this.query.selectFrom("frames").select((eb) => eb.fn.countAll().as("n")).where("batch_id", "is", null).where("idle", "=", 0));
		return expectDefined(row, "Logbook unbatched frame count").n;
	}
	frameById(id) {
		const row = executeSqliteQueryTakeFirstSync(this.db, this.framesQuery.where("id", "=", id));
		return row ? toFrame(row) : null;
	}
	framesInRange(startMs, endMs) {
		return executeSqliteQuerySync(this.db, this.framesQuery.clearSelect().select([
			"id",
			"captured_at_ms",
			"screen_index",
			"width",
			"height",
			"byte_size",
			"idle"
		]).where("captured_at_ms", ">=", startMs).where("captured_at_ms", "<", endMs)).rows.map((row) => ({
			id: row.id,
			capturedAtMs: row.captured_at_ms,
			idle: row.idle === 1
		}));
	}
	createBatch(params) {
		if (params.frameIds.length === 0) throw new Error("Logbook batch requires at least one frame");
		const now = Date.now();
		return runSqliteImmediateTransactionSync(this.db, () => {
			const result = this.statements.insertBatch({
				...params,
				now
			});
			const batchId = Number(expectDefined(result.insertId, "Logbook inserted batch ID"));
			for (const frameId of params.frameIds) {
				const assigned = this.statements.assignFrame({
					batchId,
					frameId
				});
				if (expectDefined(assigned.numAffectedRows, "Logbook assigned frame count") !== 1n) throw new Error(`Logbook frame ${frameId} is missing or already batched`);
			}
			return batchId;
		}, {
			busyTimeoutMs: LOGBOOK_SQLITE_BUSY_TIMEOUT_MS,
			databaseLabel: "logbook",
			operationLabel: "logbook.batch.create"
		});
	}
	setBatchStatus(batchId, status, error, model) {
		this.statements.setBatchStatus({
			batchId,
			status,
			error,
			model,
			now: Date.now()
		});
	}
	latestBatch() {
		const row = executeSqliteQueryTakeFirstSync(this.db, this.batchesQuery.orderBy("id", "desc").limit(1));
		return row ? toBatch(row) : null;
	}
	/** Requeues batches stuck in `running` after a crash so frames are not orphaned. */
	resetRunningBatches() {
		this.statements.resetRunningBatches(Date.now());
	}
	/** Requeues failed batches for an explicit user-driven retry (analyze now). */
	resetErrorBatches() {
		const result = this.statements.resetErrorBatches(Date.now());
		return Number(expectDefined(result.numAffectedRows, "Logbook reset batch count"));
	}
	nextPendingBatch() {
		const row = executeSqliteQueryTakeFirstSync(this.db, this.batchesQuery.where("status", "=", "pending").orderBy("start_ms", "asc").orderBy("id", "asc").limit(1));
		return row ? toBatch(row) : null;
	}
	batchFrames(batchId) {
		return executeSqliteQuerySync(this.db, this.framesQuery.where("batch_id", "=", batchId)).rows.map(toFrame);
	}
	sampledBatchFrames(batchId) {
		return this.statements.sampledBatchFrames(batchId).rows.map(toFrame);
	}
	replaceObservations(batchId, day, segments) {
		runSqliteImmediateTransactionSync(this.db, () => {
			this.statements.deleteObservations(batchId);
			for (const segment of segments) this.statements.insertObservation({
				...segment,
				batchId,
				day
			});
		}, {
			busyTimeoutMs: LOGBOOK_SQLITE_BUSY_TIMEOUT_MS,
			databaseLabel: "logbook",
			operationLabel: "logbook.observations.replace"
		});
	}
	observationsInRange(day, startMs, endMs, tailLimit) {
		const direction = tailLimit === void 0 ? "asc" : "desc";
		let query = this.query.selectFrom("observations").selectAll().where("day", "=", day).where("end_ms", ">", startMs).where("start_ms", "<", endMs).orderBy("start_ms", direction).orderBy("id", direction);
		if (tailLimit !== void 0) query = query.limit(tailLimit);
		const rows = executeSqliteQuerySync(this.db, query).rows;
		if (tailLimit !== void 0) rows.reverse();
		return rows.map((row) => ({
			id: row.id,
			batchId: row.batch_id,
			day: row.day,
			startMs: row.start_ms,
			endMs: row.end_ms,
			text: row.text
		}));
	}
	cardsForDay(day, window) {
		let query = this.cardsQuery.selectAll().where("day", "=", day).orderBy("start_ms", "asc").orderBy("id", "asc");
		if (window) query = query.where("end_ms", ">", window.startMs).where("start_ms", "<", window.endMs);
		return executeSqliteQuerySync(this.db, query).rows.map(toCard);
	}
	countCardsForDay(day) {
		const row = executeSqliteQueryTakeFirstSync(this.db, this.cardsQuery.select((eb) => eb.fn.countAll().as("count")).where("day", "=", day));
		return expectDefined(row, "Logbook card count").count;
	}
	replaceCardsInWindow(day, startMs, endMs, drafts, selectKeyframes = false) {
		const now = Date.now();
		runSqliteImmediateTransactionSync(this.db, () => {
			const frames = selectKeyframes ? executeSqliteQuerySync(this.db, this.framesQuery.clearSelect().select([
				"id",
				"captured_at_ms",
				"screen_index",
				"width",
				"height",
				"byte_size",
				"idle"
			]).where("captured_at_ms", ">=", startMs).where("captured_at_ms", "<", endMs)).rows.map((row) => ({
				id: row.id,
				capturedAtMs: row.captured_at_ms
			})) : void 0;
			this.statements.deleteCards({
				day,
				startMs,
				endMs
			});
			for (const draft of drafts) {
				const keyframeId = frames ? pickKeyframeId(draft, frames) : draft.keyframeId;
				this.statements.insertCard({
					...draft,
					keyframeId,
					now
				});
			}
		}, {
			busyTimeoutMs: LOGBOOK_SQLITE_BUSY_TIMEOUT_MS,
			databaseLabel: "logbook",
			operationLabel: "logbook.cards.replace"
		});
	}
	listDays() {
		return executeSqliteQuerySync(this.db, this.cardsQuery.select((eb) => [
			"day",
			eb.fn.countAll().as("cards"),
			eb.fn.min("start_ms").as("first_ms"),
			eb.fn.max("end_ms").as("last_ms")
		]).groupBy("day").orderBy("day", "desc")).rows.map((row) => ({
			day: row.day,
			cards: row.cards,
			firstMs: row.first_ms,
			lastMs: row.last_ms
		}));
	}
	timelineForDay(day) {
		const cards = this.cardsForDay(day);
		const categories = /* @__PURE__ */ new Map();
		const apps = /* @__PURE__ */ new Map();
		let trackedMs = 0;
		let distractionMs = 0;
		for (const card of cards) {
			const duration = Math.max(0, card.endMs - card.startMs);
			trackedMs += duration;
			categories.set(card.category, (categories.get(card.category) ?? 0) + duration);
			if (card.appPrimary) apps.set(card.appPrimary, (apps.get(card.appPrimary) ?? 0) + duration);
			for (const distraction of card.distractions) distractionMs += Math.max(0, distraction.endMs - distraction.startMs);
		}
		const byMsDesc = (a, b) => b.ms - a.ms;
		return {
			day,
			cards,
			stats: {
				trackedMs,
				distractionMs,
				categories: [...categories.entries()].map(([category, ms]) => ({
					category,
					ms
				})).toSorted(byMsDesc),
				apps: [...apps.entries()].map(([domain, ms]) => ({
					domain,
					ms
				})).toSorted(byMsDesc)
			}
		};
	}
	getStandup(day) {
		const row = executeSqliteQueryTakeFirstSync(this.db, this.query.selectFrom("standups").selectAll().where("day", "=", day));
		return row ? {
			day: row.day,
			text: row.text,
			updatedMs: row.updated_ms
		} : null;
	}
	saveStandup(day, text) {
		this.statements.saveStandup({
			day,
			text,
			now: Date.now()
		});
	}
	pruneFrames(olderThanMs) {
		const rows = executeSqliteQuerySync(this.db, this.query.selectFrom("frames").select([
			"id",
			"path",
			"day"
		]).where("captured_at_ms", "<", olderThanMs)).rows;
		if (rows.length === 0) return 0;
		const days = /* @__PURE__ */ new Set();
		for (const row of rows) {
			rmSync(row.path, { force: true });
			days.add(row.day);
		}
		const deleted = runSqliteImmediateTransactionSync(this.db, () => {
			let count = 0;
			for (let offset = 0; offset < rows.length; offset += FRAME_PRUNE_BATCH_SIZE) {
				const batch = rows.slice(offset, offset + FRAME_PRUNE_BATCH_SIZE);
				const ids = batch.map((row) => row.id);
				const currentPaths = new Map(executeSqliteQuerySync(this.db, this.query.selectFrom("frames").select(["id", "path"]).where("id", "in", ids)).rows.map((row) => [row.id, row.path]));
				for (const row of batch) if (currentPaths.has(row.id) && currentPaths.get(row.id) !== row.path) throw new Error(`Logbook frame ${row.id} changed path while pruning`);
				const result = executeSqliteQuerySync(this.db, this.query.deleteFrom("frames").where("id", "in", ids));
				count += Number(expectDefined(result.numAffectedRows, "Logbook pruned frame count"));
			}
			return count;
		}, {
			busyTimeoutMs: LOGBOOK_SQLITE_BUSY_TIMEOUT_MS,
			databaseLabel: "logbook",
			operationLabel: "logbook.frames.prune"
		});
		for (const day of days) try {
			rmdirSync(path.join(this.framesDir, day));
		} catch {}
		return deleted;
	}
};
function createSqliteWorkerBackend(input, context) {
	const store = new LogbookDatabaseStore(input.dataDir, context.databasePath);
	return {
		execute(command) {
			switch (command.type) {
				case "insertFrame": return store.insertFrame(command.input);
				case "lastFrame": return store.lastFrame();
				case "unbatchedActiveFrames": return store.unbatchedActiveFrames(command.input.limit);
				case "countUnbatchedActiveFrames": return store.countUnbatchedActiveFrames();
				case "frameById": return store.frameById(command.input.id);
				case "framesInRange": return store.framesInRange(command.input.startMs, command.input.endMs);
				case "createBatch": return store.createBatch(command.input);
				case "setBatchStatus": return store.setBatchStatus(command.input.batchId, command.input.status, command.input.error, command.input.model);
				case "latestBatch": return store.latestBatch();
				case "resetRunningBatches": return store.resetRunningBatches();
				case "resetErrorBatches": return store.resetErrorBatches();
				case "nextPendingBatch": return store.nextPendingBatch();
				case "batchFrames": return store.batchFrames(command.input.batchId);
				case "sampledBatchFrames": return store.sampledBatchFrames(command.input.batchId);
				case "replaceObservations": return store.replaceObservations(command.input.batchId, command.input.day, command.input.segments);
				case "observationsInRange": return store.observationsInRange(command.input.day, command.input.startMs, command.input.endMs, command.input.tailLimit);
				case "cardsForDay": return store.cardsForDay(command.input.day, command.input.window);
				case "countCardsForDay": return store.countCardsForDay(command.input.day);
				case "replaceCardsInWindow": return store.replaceCardsInWindow(command.input.day, command.input.startMs, command.input.endMs, command.input.drafts, command.input.selectKeyframes);
				case "listDays": return store.listDays();
				case "timelineForDay": return store.timelineForDay(command.input.day);
				case "getStandup": return store.getStandup(command.input.day);
				case "saveStandup": return store.saveStandup(command.input.day, command.input.text);
				case "pruneFrames": return store.pruneFrames(command.input.olderThanMs);
			}
		},
		close: () => store.close()
	};
}
//#endregion
export { createSqliteWorkerBackend };
