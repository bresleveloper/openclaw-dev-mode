import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as registerListener } from "./listeners-BogSNJ-R.mjs";
import { i as readSqliteReaderDiagnosticsForPath, s as sqliteReaderDatabasePathKey } from "./sqlite-reader-lifecycle-Cw11HwJP.mjs";
import { n as normalizeSqliteNumber, r as readFiniteSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import fs from "node:fs";
//#region src/infra/sqlite-wal-checkpoint.ts
const checkpointListeners = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWalCheckpointListeners"), () => /* @__PURE__ */ new Set());
/** Maintenance consumers receive observations after the checkpoint owner records its outcome. */
function onSqliteWalCheckpoint(listener) {
	return registerListener(checkpointListeners, listener);
}
/** A relayed worker result adds host observations without claiming visibility into other threads. */
function observeSqliteWalCheckpointHealth(databasePath, health) {
	const { activeReaders: previousReaders, readerDiagnostics: previousDiagnostics, ...observation } = health;
	if (health.state === "complete") return observation;
	const { activeReaders, ...local } = readSqliteReaderDiagnosticsForPath(databasePath);
	return {
		...observation,
		activeReaders: [...(previousReaders ?? []).filter((reader) => reader.threadId !== local.threadId), ...activeReaders].toSorted((left, right) => right.ageMs - left.ageMs).slice(0, 8),
		readerDiagnostics: [...(previousDiagnostics ?? []).filter((diagnostic) => diagnostic.threadId !== local.threadId), local].slice(-8)
	};
}
function notifyCheckpoint(databasePath, snapshot) {
	for (const listener of checkpointListeners) try {
		listener({
			databasePath: sqliteReaderDatabasePathKey(databasePath),
			health: structuredClone(snapshot.health),
			observedAtNs: snapshot.observedAtNs,
			lastCompletedAtNs: snapshot.lastCompletedAtNs
		});
	} catch {}
}
/** Worker result transport relays the recorded fact and returns its enriched diagnostic snapshot. */
function publishSqliteWalCheckpointObservation(databasePath, snapshot) {
	const observed = {
		health: observeSqliteWalCheckpointHealth(databasePath, snapshot.health),
		observedAtNs: snapshot.observedAtNs,
		lastCompletedAtNs: snapshot.lastCompletedAtNs
	};
	notifyCheckpoint(databasePath, observed);
	return observed;
}
function sqliteFileBytes(pathname) {
	try {
		return fs.statSync(pathname).size;
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return 0;
		throw error;
	}
}
function readCheckpointResult(row) {
	const [busy, logFrames, checkpointedFrames] = Object.values(row ?? {}).map((value) => normalizeSqliteNumber(typeof value === "number" || typeof value === "bigint" ? value : null));
	if (busy === void 0 || logFrames === void 0 || checkpointedFrames === void 0) throw new Error("SQLite returned an invalid WAL checkpoint result");
	return {
		busy,
		logFrames,
		checkpointedFrames
	};
}
function checkpoint(database, mode) {
	return database.prepare(`PRAGMA wal_checkpoint(${mode});`).get();
}
/** Offline maintenance must stop before compaction or recovery if truncation remains busy. */
var SqliteWalCheckpointBusyError = class extends Error {};
function truncateSqliteWal(database, sqlitePath) {
	const row = checkpoint(database, "TRUNCATE");
	const busy = readFiniteSqliteNumber(row?.busy ?? (row ? Object.values(row)[0] : void 0));
	if (busy === void 0) throw new Error(`SQLite checkpoint returned an invalid result for ${sqlitePath}.`);
	if (busy !== 0) throw new SqliteWalCheckpointBusyError(`SQLite checkpoint remained busy for ${sqlitePath}. Stop OpenClaw and retry.`);
}
/** The maintenance lifecycle owns this checkpoint result and its last observation. */
function createSqliteWalCheckpoint(database, options, journalSizeLimitBytes) {
	let snapshot;
	const checkpointObservation = () => ({
		state: "error",
		observedAtMs: Date.now(),
		walBytes: null,
		databaseBytes: null,
		logFrames: null,
		checkpointedFrames: null,
		lastCompletedAtMs: snapshot?.health.lastCompletedAtMs ?? null,
		consecutiveBlocked: 0,
		warning: true
	});
	const recordCheckpointError = (error, observation = checkpointObservation()) => {
		const failed = {
			...observation,
			observedAtMs: Date.now(),
			state: "error",
			consecutiveBlocked: 0,
			warning: true,
			error: formatErrorMessage(error)
		};
		snapshot = {
			observedAtNs: process.hrtime.bigint(),
			lastCompletedAtNs: snapshot?.lastCompletedAtNs,
			health: options.databasePath ? observeSqliteWalCheckpointHealth(options.databasePath, failed) : failed
		};
		if (options.databasePath) notifyCheckpoint(options.databasePath, snapshot);
		options.onCheckpointError?.(error);
	};
	const recordCheckpoint = (mode, row, quiet) => {
		const observedAtNs = process.hrtime.bigint();
		const observation = checkpointObservation();
		let busy;
		let sizeError;
		try {
			const { busy: busyResult, logFrames, checkpointedFrames } = readCheckpointResult(row);
			busy = busyResult !== 0;
			observation.logFrames = logFrames;
			observation.checkpointedFrames = checkpointedFrames;
			observation.state = busy || checkpointedFrames < logFrames ? "blocked" : "complete";
			if (observation.state === "complete") observation.lastCompletedAtMs = observation.observedAtMs;
			else observation.consecutiveBlocked = (snapshot?.health.consecutiveBlocked ?? 0) + 1;
			if (options.databasePath) try {
				observation.databaseBytes = sqliteFileBytes(options.databasePath);
				observation.walBytes = sqliteFileBytes(`${options.databasePath}-wal`);
			} catch (error) {
				sizeError = error;
				observation.error = formatErrorMessage(error);
			}
			observation.warning = observation.state === "blocked" && (observation.consecutiveBlocked >= 2 || observation.walBytes !== null && observation.databaseBytes !== null && observation.walBytes > Math.max(2 * observation.databaseBytes, journalSizeLimitBytes));
			snapshot = {
				observedAtNs,
				lastCompletedAtNs: observation.state === "complete" ? observedAtNs : snapshot?.lastCompletedAtNs,
				health: options.databasePath ? observeSqliteWalCheckpointHealth(options.databasePath, observation) : observation
			};
			if (options.databasePath) notifyCheckpoint(options.databasePath, snapshot);
		} catch (error) {
			recordCheckpointError(error, observation);
			return false;
		}
		if (observation.error !== void 0) options.onCheckpointError?.(sizeError);
		if ((busy || observation.warning) && !quiet) {
			const label = options.databaseLabel ?? "sqlite database";
			options.onCheckpointError?.(/* @__PURE__ */ new Error(`${label} WAL checkpoint ${mode} ${busy ? "remained busy" : "blocked by a reader"}`));
		}
		return observation.state === "complete";
	};
	return {
		adopt(received) {
			if (snapshot && snapshot.observedAtNs >= received.observedAtNs && (snapshot.lastCompletedAtNs ?? 0n) >= (received.lastCompletedAtNs ?? 0n)) return;
			const completed = (snapshot?.lastCompletedAtNs ?? 0n) > (received.lastCompletedAtNs ?? 0n) ? snapshot : received;
			if (!snapshot || received.observedAtNs > snapshot.observedAtNs) snapshot = structuredClone(received);
			snapshot.lastCompletedAtNs = completed?.lastCompletedAtNs;
			snapshot.health.lastCompletedAtMs = completed?.health.lastCompletedAtMs ?? null;
			if (options.databasePath) {
				snapshot.health = observeSqliteWalCheckpointHealth(options.databasePath, snapshot.health);
				notifyCheckpoint(options.databasePath, snapshot);
			}
		},
		checkpoint(mode, checkpointOptions = {}) {
			try {
				return recordCheckpoint(mode, checkpoint(database, mode), checkpointOptions.quiet === true);
			} catch (error) {
				recordCheckpointError(error);
				return false;
			}
		},
		recordError: recordCheckpointError,
		inspectIdle() {
			const { busy, logFrames, checkpointedFrames } = readCheckpointResult(checkpoint(database, "PASSIVE"));
			return busy === 0 && logFrames >= 0 && checkpointedFrames >= 0 && checkpointedFrames <= logFrames;
		},
		get health() {
			return snapshot ? structuredClone(snapshot.health) : void 0;
		},
		get snapshot() {
			return snapshot ? structuredClone(snapshot) : void 0;
		}
	};
}
//#endregion
export { truncateSqliteWal as a, publishSqliteWalCheckpointObservation as i, createSqliteWalCheckpoint as n, onSqliteWalCheckpoint as r, SqliteWalCheckpointBusyError as t };
