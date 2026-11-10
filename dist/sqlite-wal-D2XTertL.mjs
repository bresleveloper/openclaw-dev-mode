import { n as MAX_TIMER_TIMEOUT_MS } from "./number-coercion-CkhMiRw8.mjs";
import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { t as GatewayScheduler } from "./gateway-scheduler-DzQtXKjV.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { i as setSqliteBusyTimeout, r as runWithSqliteBusyTimeout, t as normalizeSqliteNonNegativeInteger } from "./sqlite-busy-timeout-COlIRjFZ.mjs";
import { A as readSqliteDatabaseWriteRevision, _ as onSqliteDatabaseWriteSettled, b as publishSqliteDatabaseAdmission, c as getSqliteDatabaseAdmission } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { a as isSqliteLockError } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { n as createSqliteWalCheckpoint } from "./sqlite-wal-checkpoint-CgnAfdqs.mjs";
import { t as decodeMountInfoPath } from "./mountinfo-path-BCOIljp0.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { n as createSqliteWalMaintenanceScheduler, r as isSqliteWalWorkerMaintained, t as cancelSqliteWalWriteAdmission } from "./sqlite-wal-write-admission-Civ4GaI3.mjs";
import fs from "node:fs";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { probeTreeClone } from "@openclaw/fs-safe/copy";
//#region src/infra/sqlite-wal-filesystem.ts
const ROLLBACK_FILESYSTEM_MAGIC = /* @__PURE__ */ new Set([
	26985,
	20859,
	4283649346,
	4266872130,
	16914839
]);
const LINUX_BTRFS_SUPER_MAGIC = 2435016766;
const PROC_MOUNTINFO_PATH = "/proc/self/mountinfo";
const MOUNT_COMMAND_TIMEOUT_MS = 1e3;
const NETWORK_FILESYSTEM_TYPES = /* @__PURE__ */ new Set([
	"cifs",
	"smbfs",
	"smb2",
	"smb3"
]);
const CROSS_VM_FILESYSTEM_TYPES = /* @__PURE__ */ new Set([
	"virtiofs",
	"fuse.virtiofs",
	"9p",
	"9p2000.l"
]);
const log$1 = createSubsystemLogger("infra/sqlite-wal");
let warnedNoCow = false;
function findExistingVolumePaths(targetPath) {
	let current = path.resolve(targetPath);
	while (true) {
		let stats;
		try {
			stats = fs.statSync(current);
		} catch {
			const parent = path.dirname(current);
			if (parent === current) return null;
			current = parent;
			continue;
		}
		const existingPath = fs.realpathSync(current);
		return {
			canonicalPath: stats.isDirectory() ? existingPath : path.dirname(existingPath),
			originalPath: stats.isDirectory() ? current : path.dirname(current)
		};
	}
}
function parseProcMountInfoEntries(contents) {
	const entries = [];
	for (const line of contents.split("\n")) {
		const separator = line.indexOf(" - ");
		if (separator === -1) continue;
		const fields = line.slice(0, separator).split(" ");
		const suffixFields = line.slice(separator + 3).split(" ");
		const mountPoint = fields[4];
		const fsType = suffixFields[0];
		if (mountPoint && fsType) entries.push({
			mountPoint: decodeMountInfoPath(mountPoint),
			fsType,
			...suffixFields[1] ? { source: decodeMountInfoPath(suffixFields[1]) } : {}
		});
	}
	return entries;
}
function parseMountCommandEntries(contents) {
	const entries = [];
	for (const line of contents.split("\n")) {
		const match = /^(.+) on (.+) type ([^,\s)]+) \(/.exec(line) ?? /^(.+) on (.+) \(([^,\s)]+)/.exec(line);
		if (match) {
			const [, source, mountPoint, fsType] = match;
			if (source && mountPoint && fsType) entries.push({
				source,
				mountPoint,
				fsType
			});
		}
	}
	return entries;
}
function readMountEntries() {
	try {
		return {
			ok: true,
			value: parseProcMountInfoEntries(fs.readFileSync(PROC_MOUNTINFO_PATH, "utf8"))
		};
	} catch {}
	try {
		return {
			ok: true,
			value: parseMountCommandEntries(String(process.getBuiltinModule("node:child_process").execFileSync("mount", [], {
				killSignal: "SIGKILL",
				timeout: MOUNT_COMMAND_TIMEOUT_MS
			})))
		};
	} catch (error) {
		return hasErrnoCode(error, "ETIMEDOUT") ? {
			ok: false,
			error: "timeout"
		} : {
			ok: true,
			value: []
		};
	}
}
function isPathWithinMount(targetPath, mountPoint) {
	const resolvedTarget = path.resolve(targetPath);
	const resolvedMountPoint = path.resolve(mountPoint);
	return resolvedTarget === resolvedMountPoint || resolvedMountPoint === path.parse(resolvedMountPoint).root || resolvedTarget.startsWith(`${resolvedMountPoint}${path.sep}`);
}
function isSshfsMountSource(source) {
	if (!source) return false;
	const normalized = source.toLowerCase();
	return normalized === "sshfs" || normalized.startsWith("sshfs#") || normalized.startsWith("sshfs@") || /^(?:[^/\s:]+@)?[^/\s:]+:.*/u.test(source);
}
function resolveMountTypeJournalPolicy(entry) {
	const normalized = entry.fsType.toLowerCase();
	if (normalized.startsWith("nfs") || NETWORK_FILESYSTEM_TYPES.has(normalized) || CROSS_VM_FILESYSTEM_TYPES.has(normalized) || normalized.startsWith("9p")) return "rollback";
	if (normalized === "fuse.sshfs") return "unsupported";
	if ((normalized === "macfuse" || normalized === "osxfuse") && isSshfsMountSource(entry.source)) return "unsupported";
	return "wal";
}
function findMountEntry(targetPath, mountEntries) {
	return mountEntries.filter((entry) => isPathWithinMount(targetPath, entry.mountPoint)).toSorted((a, b) => b.mountPoint.length - a.mountPoint.length)[0];
}
function resolveMountEntryJournalPolicy(targetPath, mountEntries) {
	const mountEntry = findMountEntry(targetPath, mountEntries);
	return mountEntry ? resolveMountTypeJournalPolicy(mountEntry) : "wal";
}
/** Classify the physical store location, including a not-yet-created database. */
function isSqlitePathOnBtrfs(targetPath) {
	if (process.platform !== "linux") return false;
	const checkedPaths = findExistingVolumePaths(targetPath);
	if (!checkedPaths) return false;
	try {
		return fs.statfsSync(checkedPaths.canonicalPath).type === LINUX_BTRFS_SUPER_MAGIC;
	} catch {
		const mounts = readMountEntries();
		return mounts.ok && findMountEntry(checkedPaths.canonicalPath, mounts.value)?.fsType.toLowerCase() === "btrfs";
	}
}
/** Doctor requires failure to abort publication; never apply attributes to data files. */
function setSqliteDirectoryNoCow(directory) {
	if (!fs.statSync(directory).isDirectory()) throw new Error(`SQLite NOCOW target is not a directory: ${directory}`);
	const result = process.getBuiltinModule("node:child_process").spawnSync("chattr", ["+C", directory], {
		encoding: "utf8",
		killSignal: "SIGKILL",
		timeout: MOUNT_COMMAND_TIMEOUT_MS,
		maxBuffer: 4096
	});
	if (result.error || result.status !== 0) throw result.error ?? /* @__PURE__ */ new Error(`chattr +C failed: ${result.stderr.trim() || result.signal || result.status}`);
}
/** Called after directory permissions are established, before SQLite creates any files. */
function prepareSqliteDatabaseDirectory(databasePath) {
	if (process.platform !== "linux" || fs.existsSync(databasePath)) return;
	try {
		if (isSqlitePathOnBtrfs(databasePath)) setSqliteDirectoryNoCow(path.dirname(databasePath));
	} catch (error) {
		if (!warnedNoCow) {
			warnedNoCow = true;
			log$1.warn("Could not enable SQLite directory NOCOW; continuing with filesystem defaults", {
				databasePath,
				error: error instanceof Error ? error.message : String(error)
			});
		}
	}
}
function combineMountEntryJournalPolicies(targetPaths) {
	const mountResult = readMountEntries();
	if (!mountResult.ok) {
		const [originalPath, canonicalPath] = targetPaths;
		if (process.platform === "darwin" && originalPath === canonicalPath) try {
			if (probeTreeClone(canonicalPath) === "apfs") return "wal";
		} catch {}
		return "rollback";
	}
	const policies = new Set(targetPaths.map((targetPath) => resolveMountEntryJournalPolicy(targetPath, mountResult.value)));
	if (policies.has("unsupported")) return "unsupported";
	return policies.has("rollback") ? "rollback" : "wal";
}
function isWindowsUncPath(targetPath) {
	return /^\\\\\?\\UNC\\[^\\]+\\[^\\]+/i.test(targetPath) || /^\\\\(?![?.]\\)[^\\]+\\[^\\]+/.test(targetPath);
}
function isWindowsDrivePath(targetPath) {
	return /^[A-Za-z]:[\\/]/.test(targetPath) || /^\\\\\?\\[A-Za-z]:[\\/]/i.test(targetPath);
}
function resolvePathJournalPolicy(targetPath) {
	if (process.platform === "win32") {
		const normalizedTargetPath = path.win32.normalize(targetPath);
		if (isWindowsUncPath(normalizedTargetPath)) return "rollback";
		if (isWindowsDrivePath(normalizedTargetPath)) try {
			return isWindowsUncPath(path.win32.normalize(fs.realpathSync.native(targetPath))) ? "rollback" : "wal";
		} catch {
			return "rollback";
		}
	}
	const checkedPaths = findExistingVolumePaths(targetPath);
	if (!checkedPaths) return "wal";
	const mountLookupPaths = [checkedPaths.originalPath, checkedPaths.canonicalPath];
	if (typeof fs.statfsSync !== "function") return combineMountEntryJournalPolicies(mountLookupPaths);
	try {
		if (ROLLBACK_FILESYSTEM_MAGIC.has(fs.statfsSync(checkedPaths.canonicalPath).type)) return "rollback";
	} catch {}
	return combineMountEntryJournalPolicies(mountLookupPaths);
}
//#endregion
//#region src/infra/sqlite-wal-reclamation.ts
const VACUUM_UNIT_TARGET_MS = 25;
const vacuumPageBudgets = /* @__PURE__ */ new WeakMap();
function createSqliteWalReclamationResult() {
	return {
		checkpointCompleted: false,
		freePagesBefore: null,
		remainingFreePages: null,
		checkpointCalls: 0,
		checkpointIncomplete: 0,
		checkpointMs: 0,
		checkpointMaxMs: 0,
		queryMs: 0,
		vacuumMs: 0,
		vacuumPasses: 0,
		vacuumPagesRequested: 0
	};
}
/** Physical page accounting for both reclamation and its read-only eligibility probe. */
function readSqliteFreePageCount(database, diagnostics) {
	const startedAt = diagnostics ? performance.now() : 0;
	try {
		return Number(database.prepare("PRAGMA freelist_count").get()?.freelist_count ?? 0);
	} finally {
		if (diagnostics) diagnostics.queryMs += performance.now() - startedAt;
	}
}
/** One online unit never waits for readers or adds vacuum frames behind a blocked checkpoint. */
function reclaimSqliteWalFreePages(database, runCheckpoint, options) {
	const result = createSqliteWalReclamationResult();
	const checkpoint = () => {
		options.beforeMutation?.();
		const startedAt = performance.now();
		try {
			const mode = options.checkpointMode ?? "TRUNCATE";
			let completed = runCheckpoint(mode);
			result.checkpointCalls++;
			if (!completed && mode === "TRUNCATE") {
				options.beforeMutation?.();
				completed = runCheckpoint("PASSIVE");
				result.checkpointCalls++;
			}
			result.checkpointCompleted = completed;
			result.checkpointIncomplete += Number(!completed);
			return completed;
		} finally {
			const elapsed = performance.now() - startedAt;
			result.checkpointMs += elapsed;
			result.checkpointMaxMs = Math.max(result.checkpointMaxMs, elapsed);
		}
	};
	if (options.maxPages === 0 && options.checkpointMode === "PASSIVE") {
		checkpoint();
		return result;
	}
	return runWithSqliteBusyTimeout(database, 0, () => {
		if (!checkpoint() || options.maxPages === 0) return result;
		const before = readSqliteFreePageCount(database, result);
		result.freePagesBefore = before;
		result.remainingFreePages = before;
		if (!Number.isSafeInteger(before) || before <= 0) return result;
		const pages = Math.min(vacuumPageBudgets.get(database) ?? 8, before, options.maxPages ?? 512);
		if (!Number.isSafeInteger(pages) || pages <= 0) throw new Error("SQLite page reclamation requires a positive integer page limit");
		const startedAt = performance.now();
		let entered = false;
		let completed = false;
		try {
			runSqliteImmediateTransactionSync(database, () => {
				entered = true;
				options.beforeMutation?.();
				result.vacuumPasses++;
				result.vacuumPagesRequested += pages;
				database.exec(`PRAGMA incremental_vacuum(${pages});`);
				options.onCommit?.();
			}, {
				busyTimeoutMs: 0,
				operationLabel: "incremental-vacuum"
			});
			completed = true;
		} catch (error) {
			if (entered || !isSqliteLockError(error)) throw error;
			return result;
		} finally {
			const elapsedMs = performance.now() - startedAt;
			result.vacuumMs += elapsedMs;
			if (completed) vacuumPageBudgets.set(database, Math.max(1, Math.min(512, pages * 2, Math.floor(pages * VACUUM_UNIT_TARGET_MS / Math.max(elapsedMs, .001)))));
		}
		options.afterCommit?.();
		if (checkpoint()) result.remainingFreePages = readSqliteFreePageCount(database, result);
		return result;
	});
}
//#endregion
//#region src/infra/sqlite-wal-split-brain.ts
const PROC_SELF_FD_PATH = "/proc/self/fd";
const SQLITE_WAL_SPLIT_BRAIN_FATAL_MESSAGE = "SQLite WAL sidecar identity mismatch; terminating without SQLite cleanup";
function readUnlessMissing(read, allowClosedDescriptor = false) {
	try {
		return read();
	} catch (error) {
		if (allowClosedDescriptor && hasErrnoCode(error, "EBADF") || hasErrnoCode(error, "ENOENT")) return;
		throw error;
	}
}
function isSqliteWalSidecarSplitBrain(descriptor, target) {
	return descriptor.nlink === 0n || !target || descriptor.dev !== target.dev || descriptor.ino !== target.ino;
}
function detectSqliteWalSplitBrain(databasePath) {
	const descriptors = readUnlessMissing(() => fs.readdirSync(PROC_SELF_FD_PATH));
	const sidecarPaths = [`${databasePath}-wal`, `${databasePath}-shm`];
	for (const descriptorName of descriptors ?? []) {
		const descriptorPath = path.join(PROC_SELF_FD_PATH, descriptorName);
		const linkedPath = readUnlessMissing(() => fs.readlinkSync(descriptorPath));
		if (linkedPath === void 0) continue;
		const sidecarPath = sidecarPaths.find((candidate) => linkedPath === candidate || linkedPath === `${candidate} (deleted)`);
		if (!sidecarPath) continue;
		const descriptor = readUnlessMissing(() => fs.fstatSync(Number(descriptorName), { bigint: true }), true);
		if (descriptor === void 0 || readUnlessMissing(() => fs.readlinkSync(descriptorPath)) !== linkedPath) continue;
		const target = readUnlessMissing(() => fs.statSync(sidecarPath, { bigint: true }));
		if (!isSqliteWalSidecarSplitBrain(descriptor, target)) continue;
		return {
			event: "sqlite_wal_sidecar_identity_mismatch",
			databasePath,
			descriptorDevice: descriptor.dev.toString(),
			descriptorInode: descriptor.ino.toString(),
			sidecarPath,
			...target ? {
				targetDevice: target.dev.toString(),
				targetInode: target.ino.toString()
			} : {}
		};
	}
}
function terminateForSqliteWalSplitBrain(splitBrain, databaseLabel) {
	try {
		fs.writeSync(2, `${JSON.stringify({
			level: "fatal",
			subsystem: "infra/sqlite-wal",
			message: SQLITE_WAL_SPLIT_BRAIN_FATAL_MESSAGE,
			...splitBrain,
			databaseLabel,
			pid: process.pid
		})}\n`);
	} catch {}
	try {
		process.kill(process.pid, "SIGKILL");
	} finally {
		process.abort();
	}
}
//#endregion
//#region src/infra/sqlite-wal.ts
const DEFAULT_SQLITE_WAL_AUTOCHECKPOINT_PAGES = 16384;
const DEFAULT_SQLITE_WAL_CHECKPOINT_TICK_MS = 1e4;
const DEFAULT_SQLITE_WAL_CHECKPOINT_INTERVAL_MS = 18e5;
const DEFAULT_SQLITE_WAL_JOURNAL_SIZE_LIMIT_BYTES = 67108864;
const JOURNAL_MODE_RETRY_INTERVAL_MS = 10;
const JOURNAL_MODE_RETRY_SLEEP = new Int32Array(new SharedArrayBuffer(4));
const log = createSubsystemLogger("infra/sqlite-wal");
const maintenanceScheduler = new GatewayScheduler();
let nextMaintenanceId = 0;
const completedCheckpointKey = {
	name: "sqlite-wal-completed-write-revision",
	read: (value) => value instanceof SharedArrayBuffer && value.byteLength === Int32Array.BYTES_PER_ELEMENT ? value : void 0
};
function sharedCompletedCheckpoint(db, writeRevision) {
	let shared = getSqliteDatabaseAdmission(db, completedCheckpointKey);
	if (!shared) {
		shared = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
		Atomics.store(new Int32Array(shared), 0, writeRevision - 1 | 0);
		publishSqliteDatabaseAdmission(db, completedCheckpointKey, shared);
		shared = getSqliteDatabaseAdmission(db, completedCheckpointKey);
	}
	return shared ? new Int32Array(shared) : void 0;
}
/** Restrict inspection connections without changing journal or persistence policy. */
function configureSqliteReadOnlyPragmas(db) {
	db.exec("PRAGMA query_only = ON; PRAGMA trusted_schema = OFF;");
}
/** Private snapshots publish one standalone file even when their source used WAL. */
function configureSqliteSnapshotPragmas(db) {
	setSqliteBusyTimeout(db, 3e4);
	db.exec("PRAGMA trusted_schema = OFF; PRAGMA journal_mode = DELETE;");
}
function enableIncrementalAutoVacuumForFreshDatabase(db) {
	if (db.prepare("PRAGMA page_count").get()?.page_count === 0) db.exec("PRAGMA auto_vacuum = INCREMENTAL;");
}
/**
* Configure lock retry before inspecting or mutating a fresh database header.
* Concurrent first opens can otherwise fail before schema transactions begin.
*/
function configureSqlitePreSchemaPragmas(db, options = {}) {
	if (options.busyTimeoutMs !== void 0) setSqliteBusyTimeout(db, options.busyTimeoutMs);
	enableIncrementalAutoVacuumForFreshDatabase(db);
}
function readJournalModeResult(row) {
	if (!row || typeof row !== "object") return null;
	const record = row;
	const value = record.journal_mode ?? Object.values(record)[0];
	return typeof value === "string" ? value.toLowerCase() : null;
}
function hasInMemoryMainDatabase(db) {
	return db.prepare("PRAGMA database_list;").all().find((row) => row.name === "main")?.file === "";
}
function requireRollbackJournalMode(db, options) {
	const journalMode = readJournalModeResult(db.prepare("PRAGMA journal_mode = DELETE;").get());
	if (journalMode !== "delete") {
		const label = options.databaseLabel ?? "sqlite database";
		const location = options.databasePath ? ` at ${options.databasePath}` : "";
		throw new Error(`${label}${location} is on a network-backed volume but SQLite kept journal_mode=${journalMode ?? "unknown"}; refusing to continue with WAL on network storage.`);
	}
}
function enableWalJournalMode(db, retryTimeoutMs, options) {
	const deadline = performance.now() + retryTimeoutMs;
	let restoreBusyTimeout = false;
	try {
		while (true) try {
			const journalMode = readJournalModeResult(db.prepare("PRAGMA journal_mode = WAL;").get());
			if (journalMode === "wal") return true;
			if (journalMode === "memory" && hasInMemoryMainDatabase(db)) return false;
			const label = options.databaseLabel ?? "sqlite database";
			const location = options.databasePath ? ` at ${options.databasePath}` : "";
			throw new Error(`${label}${location} could not enable WAL; SQLite kept journal_mode=${journalMode ?? "unknown"}.`);
		} catch (error) {
			const remainingMs = Math.max(0, deadline - performance.now());
			if (!isSqliteLockError(error) || remainingMs <= 0) throw error;
			if (!restoreBusyTimeout) {
				setSqliteBusyTimeout(db, 0);
				restoreBusyTimeout = true;
			}
			Atomics.wait(JOURNAL_MODE_RETRY_SLEEP, 0, 0, Math.min(JOURNAL_MODE_RETRY_INTERVAL_MS, remainingMs));
		}
	} finally {
		if (restoreBusyTimeout) setSqliteBusyTimeout(db, retryTimeoutMs);
	}
}
function enableMacosCheckpointFullfsync(db) {
	if (process.platform !== "darwin") return;
	try {
		db.exec("PRAGMA checkpoint_fullfsync = 1;");
	} catch {}
}
function refuseUnsupportedFilesystem(options) {
	const label = options.databaseLabel ?? "sqlite database";
	const location = options.databasePath ? ` at ${options.databasePath}` : "";
	throw new Error(`${label}${location} is on SSHFS, which cannot safely coordinate SQLite writes across mounts; refusing to open the database.`);
}
/** Configure safe journaling pragmas and return a handle for checkpoint/close maintenance. */
function configureSqliteWalMaintenance(db, options = {}) {
	const busyTimeoutMs = options.busyTimeoutMs ?? 0;
	if (options.busyTimeoutMs !== void 0) setSqliteBusyTimeout(db, options.busyTimeoutMs);
	const autoCheckpointPages = normalizeSqliteNonNegativeInteger(options.autoCheckpointPages ?? DEFAULT_SQLITE_WAL_AUTOCHECKPOINT_PAGES, "autoCheckpointPages");
	const checkpointIntervalMs = normalizeSqliteNonNegativeInteger(options.checkpointIntervalMs ?? DEFAULT_SQLITE_WAL_CHECKPOINT_INTERVAL_MS, "checkpointIntervalMs");
	const timerIntervalMs = Math.min(checkpointIntervalMs, MAX_TIMER_TIMEOUT_MS);
	const checkpointTickMs = checkpointIntervalMs > DEFAULT_SQLITE_WAL_CHECKPOINT_TICK_MS ? DEFAULT_SQLITE_WAL_CHECKPOINT_TICK_MS : 0;
	const checkpointMode = options.checkpointMode ?? "TRUNCATE";
	const periodicCheckpointMode = options.checkpointMode ?? "PASSIVE";
	const journalPolicy = options.databasePath ? resolvePathJournalPolicy(options.databasePath) : "wal";
	if (journalPolicy === "unsupported") refuseUnsupportedFilesystem(options);
	if (journalPolicy === "rollback") requireRollbackJournalMode(db, options);
	if (journalPolicy === "rollback" || !enableWalJournalMode(db, busyTimeoutMs, options)) return {
		checkpoint: () => true,
		reclaimFreePages: (reclaimOptions = {}) => reclaimSqliteWalFreePages(db, () => true, reclaimOptions),
		stop: async () => {},
		close: () => true
	};
	enableMacosCheckpointFullfsync(db);
	db.exec(`PRAGMA wal_autocheckpoint = ${isSqliteWalWorkerMaintained(db) ? 0 : autoCheckpointPages};`);
	db.exec(`PRAGMA journal_size_limit = ${DEFAULT_SQLITE_WAL_JOURNAL_SIZE_LIMIT_BYTES};`);
	const tripwireDatabasePath = process.platform === "linux" && options.databasePath && fs.existsSync(options.databasePath) ? fs.realpathSync.native(options.databasePath) : void 0;
	let invalidated = false;
	let splitBrainDetectionEnabled = Boolean(tripwireDatabasePath);
	const checkpointOwner = createSqliteWalCheckpoint(db, options, DEFAULT_SQLITE_WAL_JOURNAL_SIZE_LIMIT_BYTES);
	const runCheckpoint = checkpointOwner.checkpoint;
	const runMaintenance = (operation) => {
		if (invalidated) return false;
		try {
			return options.runMaintenance ? options.runMaintenance(operation) : operation();
		} catch (error) {
			checkpointOwner.recordError(error);
			return false;
		}
	};
	const checkpoint = () => runMaintenance(() => runCheckpoint(checkpointMode));
	const reclaimFreePages = (reclaimOptions = {}) => {
		let result;
		let failure;
		runMaintenance(() => {
			try {
				result = reclaimSqliteWalFreePages(db, runCheckpoint, reclaimOptions);
				return result.checkpointCompleted;
			} catch (error) {
				failure = { error };
				throw error;
			}
		});
		if (failure) throw failure.error;
		if (!result) throw new Error("SQLite page reclamation owner is unavailable");
		return {
			...result,
			checkpoint: checkpointOwner.snapshot
		};
	};
	const scope = maintenanceScheduler.scope();
	const maintenanceId = `sqlite-wal:${++nextMaintenanceId}`;
	let nextPageBudget = 0;
	let completedTickRevision;
	const maintainPeriodic = (request, admit, maintain) => {
		if (invalidated) return { reclaimedPages: 0 };
		if (request.checkpoint) checkpointOwner.adopt(request.checkpoint);
		let reclaimedPages = 0;
		const quiet = request.maxPages === 0;
		const checkpointOnly = quiet && request.checkpointMode === "PASSIVE";
		const writeRevision = checkpointOnly ? readSqliteDatabaseWriteRevision(db) : void 0;
		const sharedCompletion = writeRevision === void 0 ? void 0 : sharedCompletedCheckpoint(db, writeRevision);
		const completedBySibling = sharedCompletion !== void 0 && Atomics.load(sharedCompletion, 0) === writeRevision;
		if (writeRevision !== void 0 && (completedBySibling || writeRevision === completedTickRevision && checkpointOwner.health?.state === "complete")) return {
			reclaimedPages: 0,
			checkpoint: checkpointOwner.health?.state === "complete" ? checkpointOwner.snapshot : void 0
		};
		const runTickCheckpoint = (mode) => checkpointOwner.checkpoint(mode, { quiet });
		completedTickRevision = runMaintenance(() => {
			let checkpointed;
			if (checkpointOnly) {
				admit?.("transaction");
				checkpointed = runTickCheckpoint("PASSIVE");
			} else {
				const reclaimed = reclaimSqliteWalFreePages(db, runTickCheckpoint, {
					checkpointMode: request.checkpointMode,
					maxPages: request.maxPages,
					beforeMutation: () => admit?.("transaction"),
					onCommit: () => admit?.("commit")
				});
				checkpointed = reclaimed.checkpointCompleted;
				if (checkpointed && reclaimed.freePagesBefore !== null && reclaimed.remainingFreePages !== null) reclaimedPages = Math.min(reclaimed.vacuumPagesRequested, reclaimed.freePagesBefore - reclaimed.remainingFreePages);
			}
			if (checkpointed && request.checkpointMode === "PASSIVE" && (checkpointOwner.health?.walBytes ?? 0) > DEFAULT_SQLITE_WAL_JOURNAL_SIZE_LIMIT_BYTES) {
				admit?.("transaction");
				runWithSqliteBusyTimeout(db, 0, () => runTickCheckpoint("TRUNCATE"));
			}
			if (checkpointed && request.maxPages > 0 && !request.continuation) try {
				maintain?.();
			} catch (error) {
				if (!isSqliteLockError(error)) throw error;
			}
			return checkpointed;
		}) && checkpointOwner.health?.state === "complete" ? writeRevision : void 0;
		if (sharedCompletion && completedTickRevision !== void 0) Atomics.store(sharedCompletion, 0, completedTickRevision);
		return {
			reclaimedPages,
			checkpoint: checkpointOwner.snapshot
		};
	};
	let stopCheckpointTick;
	const maintain = createSqliteWalMaintenanceScheduler(db, maintainPeriodic, (maxPages) => timerIntervalMs > 0 && !scope.signal.aborted && !invalidated && !options.isScheduledMaintenanceSuspended?.() ? {
		maxPages,
		checkpointMode: periodicCheckpointMode,
		checkpoint: checkpointOwner.snapshot
	} : void 0, checkpointOwner.adopt, (error) => checkpointOwner.recordError(error), () => {
		const budget = nextPageBudget;
		nextPageBudget = 0;
		return budget;
	}, () => stopCheckpointTick?.());
	const schedule = (phase, intervalMs, run) => runInDetachedAsyncContext(() => scope.schedule({
		id: `${maintenanceId}:${phase}`,
		delayMs: intervalMs,
		everyMs: intervalMs,
		run
	}));
	if (timerIntervalMs > 0) schedule("periodic", timerIntervalMs, () => {
		if (tripwireDatabasePath && splitBrainDetectionEnabled) {
			let splitBrain;
			try {
				splitBrain = detectSqliteWalSplitBrain(tripwireDatabasePath);
			} catch (error) {
				splitBrainDetectionEnabled = false;
				log.warn("SQLite WAL split-brain detection disabled", {
					databaseLabel: options.databaseLabel,
					databasePath: tripwireDatabasePath,
					error: error instanceof Error ? error.message : String(error)
				});
			}
			if (splitBrain) {
				invalidated = true;
				scope.beginClose();
				terminateForSqliteWalSplitBrain(splitBrain, options.databaseLabel);
			}
		}
		nextPageBudget = 512;
		return maintain();
	});
	if (checkpointTickMs > 0 && !isSqliteWalWorkerMaintained(db)) {
		let stopped = false;
		let tick;
		const cancelTick = () => {
			tick?.cancel();
			tick = void 0;
		};
		const armTick = () => {
			if (!stopped && !tick && !scope.signal.aborted && !invalidated) tick = runInDetachedAsyncContext(() => scope.schedule({
				id: `${maintenanceId}:tick`,
				delayMs: checkpointTickMs,
				run: runTick
			}));
		};
		const runTick = async () => {
			tick = void 0;
			await maintain();
			if (stopped) return;
			const revision = readSqliteDatabaseWriteRevision(db);
			const completed = revision === void 0 ? void 0 : sharedCompletedCheckpoint(db, revision);
			if (completed && Atomics.load(completed, 0) === revision) cancelTick();
			else armTick();
		};
		const unregisterWrites = periodicCheckpointMode === "PASSIVE" ? onSqliteDatabaseWriteSettled(db, armTick) : void 0;
		if (unregisterWrites) {
			stopCheckpointTick = () => {
				stopped = true;
				unregisterWrites();
				cancelTick();
			};
			armTick();
		} else stopCheckpointTick = schedule("tick", checkpointTickMs, maintain).cancel;
	}
	const beginClose = () => {
		stopCheckpointTick?.();
		runInDetachedAsyncContext(() => scope.beginClose());
		return cancelSqliteWalWriteAdmission(db);
	};
	return {
		get health() {
			return checkpointOwner.health;
		},
		checkpoint,
		maintainPeriodic,
		reclaimFreePages,
		inspectIdle: () => runMaintenance(checkpointOwner.inspectIdle) ? "healthy" : "retire",
		stop: async () => {
			try {
				await beginClose();
			} finally {
				await runInDetachedAsyncContext(() => scope.stop());
			}
		},
		close: (closeOptions) => {
			beginClose();
			if (invalidated || isSqliteWalWorkerMaintained(db)) return false;
			return runMaintenance(() => runCheckpoint(closeOptions?.checkpointMode ?? checkpointMode));
		}
	};
}
let lastSqliteExitGroup;
function detachEmptySqliteExitGroup(group) {
	if (group.pending.size > 0) return;
	if (lastSqliteExitGroup === group) lastSqliteExitGroup = void 0;
	process.removeListener("exit", group.dispatch);
}
/**
* Register a best-effort exit-time close for a SQLite handle cache. Returns an
* unregister callback the cache's orderly close path must invoke, so tests and
* runtime shutdowns do not accumulate listeners on shared worker processes.
*/
function registerSqliteCacheExitClose(closeAll) {
	const registration = {
		close: closeAll,
		fired: false
	};
	let group = lastSqliteExitGroup;
	if (!group || process.listeners("exit").at(-1) !== group.dispatch) {
		const pending = /* @__PURE__ */ new Set([registration]);
		const created = {
			pending,
			dispatch: () => {
				const snapshot = [...pending];
				for (const entry of snapshot) {
					if (entry.fired) continue;
					entry.fired = true;
					pending.delete(entry);
					detachEmptySqliteExitGroup(created);
					try {
						entry.close();
					} catch {}
				}
			}
		};
		process.on("exit", created.dispatch);
		lastSqliteExitGroup = group = created;
	} else group.pending.add(registration);
	const owner = group;
	return () => {
		owner.pending.delete(registration);
		detachEmptySqliteExitGroup(owner);
	};
}
/** Configure per-connection SQLite pragmas in the safe lock-retry/WAL order. */
function configureSqliteConnectionPragmas(db, options = {}) {
	const { foreignKeys, synchronous, ...walOptions } = options;
	const maintenance = configureSqliteWalMaintenance(db, walOptions);
	try {
		if (synchronous) db.exec(`PRAGMA synchronous = ${synchronous};`);
		if (foreignKeys) db.exec("PRAGMA foreign_keys = ON;");
		return maintenance;
	} catch (error) {
		try {
			maintenance.close();
		} catch (closeError) {
			throw createSqliteLifecycleAggregateError([error, closeError], "SQLite connection pragma configuration and WAL maintenance cleanup both failed.", error);
		}
		throw error;
	}
}
//#endregion
export { configureSqliteWalMaintenance as a, readSqliteFreePageCount as c, setSqliteDirectoryNoCow as d, configureSqliteSnapshotPragmas as i, isSqlitePathOnBtrfs as l, configureSqlitePreSchemaPragmas as n, registerSqliteCacheExitClose as o, configureSqliteReadOnlyPragmas as r, createSqliteWalReclamationResult as s, configureSqliteConnectionPragmas as t, prepareSqliteDatabaseDirectory as u };
