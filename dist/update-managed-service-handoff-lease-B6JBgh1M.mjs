import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as isPidDefinitelyDead, t as getFileLockProcessStartTime } from "./pid-alive-CXdZEzr_.mjs";
import { t as acquireFileLockSync } from "./file-lock-manager-xRAOv56w.mjs";
import { a as probePathCaseInsensitiveSync, d as sameFileIdentity } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { Et as _enum, Jn as string, Nt as array, Pn as number, Yt as discriminatedUnion, or as union, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, u as sql } from "./kysely-sync-Bn6Qrpbz.mjs";
import { i as resolveExistingSqliteFileUri, t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { i as setSqliteBusyTimeout, r as runWithSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { o as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { d as createPrivateWindowsFile } from "./sqlite-snapshot-staging-BNvNaOwn.mjs";
import "./path-case-CAaiJQol.mjs";
import { p as syncDirectorySync, s as requireDirectorySync } from "./directory-durability-BKe2aOQN.mjs";
import { n as isLockOwnerDefinitelyStale } from "./stale-lock-file-DDEYOm3C.mjs";
import { t as resolveServiceManagerEnv } from "./service-process-env-B2RAsQsF.mjs";
import { n as isChildProcessTreeAlive } from "./child-process-tree-Cmpyfjdc.mjs";
import { i as readWindowsProcessArgsSync } from "./windows-port-pids-Bid_Huck.mjs";
import { r as getSelfAndAncestorPidsSync } from "./restart-stale-pids-DjtzhbID.mjs";
import fs from "node:fs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { spawnSync } from "node:child_process";
import os from "node:os";
import { createHash } from "node:crypto";
//#region src/infra/update-managed-service-handoff-schema.ts
const text$1 = string().min(1).max(4096);
const nativeProcessIdentityShape = {
	pid: number().int().positive(),
	startIdentity: text$1.max(128)
};
const processIdentitySchema = strictObject({
	...nativeProcessIdentityShape,
	startIdentitySource: literal("argv-sha256").nullable().optional()
}).refine(({ startIdentity, startIdentitySource }) => startIdentitySource === "argv-sha256" ? /^win32-argv-sha256:[a-f0-9]{64}$/.test(startIdentity) : !startIdentity.startsWith("win32-argv-sha256:"));
const managedHandoffBootSchema = union([
	strictObject({
		platform: _enum(["linux", "darwin"]),
		identity: string().regex(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i)
	}),
	strictObject({
		platform: literal("win32"),
		identity: string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{7}Z$/)
	}),
	strictObject({
		platform: literal("freebsd"),
		identity: string().regex(/^[a-f0-9]{32}$/)
	})
]);
const nativeLifetimeSchema = strictObject({
	kind: literal("native"),
	unit: text$1,
	scope: text$1,
	placement: discriminatedUnion("kind", [strictObject({ kind: literal("pending") }), strictObject({
		kind: literal("attached"),
		invocation: string().regex(/^[a-f0-9]{32}$/i)
	})])
});
const actionSchema = discriminatedUnion("kind", [strictObject({ kind: literal("update") }), strictObject({
	kind: literal("triage"),
	phase: _enum([
		"reserved",
		"running",
		"closing",
		"closed",
		"uncertain"
	]),
	lifetime: discriminatedUnion("kind", [strictObject({
		kind: literal("foreground"),
		boot: managedHandoffBootSchema
	}), nativeLifetimeSchema])
}).refine((action) => action.phase !== "running" || action.lifetime.kind !== "native" || action.lifetime.placement.kind === "attached")]);
const sourcePath = text$1.refine(path.isAbsolute, "Native source path must be absolute");
const digest = string().regex(/^[a-f0-9]{64}$/);
const nativeBorrowerSourceSchema = strictObject({
	runId: text$1,
	transactionId: text$1,
	claimId: text$1,
	revision: number().int().nonnegative(),
	recordSha256: digest,
	serviceKey: sourcePath,
	configPaths: array(sourcePath).min(1).max(512),
	lifetimeId: text$1
});
const nativeBorrowerSchema = strictObject({
	id: string().uuid(),
	phase: _enum(["reserved", "admitted"]),
	source: nativeBorrowerSourceSchema
});
const commonPayload = {
	executor: processIdentitySchema,
	helper: processIdentitySchema,
	action: actionSchema
};
const payloadSchema = discriminatedUnion("version", [strictObject({
	version: literal(2),
	...commonPayload
}), strictObject({
	version: literal(3),
	...commonPayload,
	action: strictObject({ kind: literal("update") }),
	nativeBorrower: nativeBorrowerSchema
})]);
const retiredPayloadSchema = strictObject({
	version: literal(1),
	...nativeProcessIdentityShape
});
function parseManagedHandoffLeasePayload(value) {
	try {
		return payloadSchema.parse(JSON.parse(value));
	} catch {
		return null;
	}
}
/** Distinguish an exactly decoded retired record from unreadable prospective data. */
function parseRetiredManagedHandoffLeasePayload(value) {
	try {
		const parsed = retiredPayloadSchema.safeParse(JSON.parse(value));
		return parsed.success ? parsed.data : null;
	} catch {
		return null;
	}
}
function isRetiredManagedHandoffLeasePayload(value) {
	return parseRetiredManagedHandoffLeasePayload(value) !== null;
}
//#endregion
//#region src/infra/update-managed-service-handoff-boot.ts
/** Bind the lease environment without caching boot identity or selecting an OS early. */
function createManagedHandoffBootIdentityReader(serviceManagerEnv) {
	return function bootIdentity() {
		let value;
		if (process.platform === "linux") value = fs.readFileSync("/proc/sys/kernel/random/boot_id", "utf8").trim();
		else if (process.platform === "freebsd") {
			const result = spawnSync("/sbin/sysctl", ["-b", "kern.boot_id"], {
				env: serviceManagerEnv,
				timeout: 1e3,
				maxBuffer: 16,
				killSignal: "SIGKILL",
				stdio: [
					"ignore",
					"pipe",
					"ignore"
				]
			});
			if (!result.error && result.status === 0 && Buffer.isBuffer(result.stdout) && result.stdout.length === 16) value = result.stdout.toString("hex");
		} else if (process.platform === "darwin" || process.platform === "win32") {
			const windows = process.platform === "win32";
			const result = spawnSync(windows ? "powershell.exe" : "/usr/sbin/sysctl", windows ? [
				"-NoProfile",
				"-NonInteractive",
				"-Command",
				"(Get-CimInstance -ClassName Win32_OperatingSystem).LastBootUpTime.ToUniversalTime().ToString('o')"
			] : ["-n", "kern.bootsessionuuid"], {
				env: serviceManagerEnv,
				encoding: "utf8",
				timeout: windows ? 5e3 : 1e3,
				killSignal: "SIGKILL",
				windowsHide: true,
				stdio: [
					"ignore",
					"pipe",
					"ignore"
				]
			});
			if (!result.error && result.status === 0) value = result.stdout.trim();
		}
		const boot = {
			platform: process.platform,
			identity: process.platform === "win32" ? value : value?.toLowerCase()
		};
		const parsed = managedHandoffBootSchema.safeParse(boot);
		if (!parsed.success) throw new Error("OS boot identity unavailable; run openclaw triage manually");
		return parsed.data;
	};
}
//#endregion
//#region src/infra/update-managed-service-handoff-cleanup.ts
/** v1 shipped in 2026.8.2. This proves cleanup eligibility, never v2 authority. */
function canCleanupLegacyManagedHandoff(payload, processState) {
	let value;
	try {
		value = JSON.parse(payload);
	} catch {
		return false;
	}
	return isRecord(value) && Object.keys(value).length === 3 && value.version === 1 && typeof value.pid === "number" && Number.isInteger(value.pid) && value.pid > 0 && typeof value.startIdentity === "string" && Number.isSafeInteger(Number(value.startIdentity)) && Number(value.startIdentity) >= 0 && String(Number(value.startIdentity)) === value.startIdentity && processState({
		pid: value.pid,
		startIdentity: value.startIdentity
	}) === "dead";
}
const MANAGED_SERVICE_UPDATE_HANDOFF_TEMP_PREFIX = "openclaw-update-run-handoff-";
const MANAGED_SERVICE_UPDATE_HANDOFF_STALE_TTL_MS = 864e5;
async function cleanupStaleManagedServiceUpdateHandoffs(params) {
	const tmpDir = params?.tmpDir ?? os.tmpdir();
	const nowMs = params?.nowMs ?? Date.now();
	const ttlMs = params?.ttlMs ?? MANAGED_SERVICE_UPDATE_HANDOFF_STALE_TTL_MS;
	let entries;
	try {
		entries = await fs$1.readdir(tmpDir, { withFileTypes: true });
	} catch {
		return 0;
	}
	let removed = 0;
	for (const entry of entries.toSorted((left, right) => left.name.localeCompare(right.name))) {
		if (!entry.isDirectory() || !entry.name.startsWith("openclaw-update-run-handoff-")) continue;
		const dir = path.join(tmpDir, entry.name);
		let stats;
		try {
			stats = await fs$1.stat(dir);
		} catch {
			continue;
		}
		if (nowMs - stats.mtimeMs < ttlMs) continue;
		try {
			await fs$1.rm(dir, {
				recursive: true,
				force: true
			});
			removed += 1;
		} catch {}
	}
	return removed;
}
//#endregion
//#region src/infra/file-lock-sync.ts
/** Synchronous lock for legacy stores that cannot transact in SQLite yet. */
function acquireFileLockSyncWithRetry(path) {
	rejectUnsupportedLockPath(`${path}.lock`);
	const processStartTime = getFileLockProcessStartTime(process.pid);
	const createPayload = () => ({
		pid: process.pid,
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		...processStartTime === null ? {} : { starttime: processStartTime }
	});
	const isStale = ({ payload }) => isLockOwnerDefinitelyStale({ payload: isRecord(payload) ? payload : null });
	const lock = acquireFileLockSync(path, {
		staleMs: 3e4,
		retry: {
			retries: 9,
			factor: 1,
			minTimeout: 20,
			maxTimeout: 20,
			randomize: false
		},
		staleRecovery: "remove-if-unchanged",
		payload: createPayload,
		shouldReclaim: isStale,
		shouldRemoveStaleLock: isStale
	});
	return () => lock.release();
}
function rejectUnsupportedLockPath(lockPath) {
	let observed;
	try {
		observed = fs.lstatSync(lockPath);
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
	if (observed.isFile() && !observed.isSymbolicLink()) return;
	if (!observed.isDirectory() || observed.isSymbolicLink()) throw new Error(`Storage lock path has an unsupported legacy type: ${lockPath}`);
	throw Object.assign(/* @__PURE__ */ new Error(`Legacy storage lock requires manual removal after verifying no older OpenClaw process is running: ${lockPath}`), {
		code: "file_lock_stale",
		lockPath
	});
}
//#endregion
//#region src/infra/sqlite-existing-database.ts
/** Keep a SQLite-owned read lock until the existing writer has acquired its lock. */
function withExistingSqliteRollbackDatabase(pathname, options, operation) {
	options.assertIdentity();
	if (fs.statSync(pathname).size === 0) throw new Error("Existing SQLite storage is empty.");
	const reader = openNodeSqliteDatabase(pathname, { readOnly: true });
	let writer;
	let snapshotOpen = false;
	const releaseReader = () => {
		if (!reader.isOpen) return;
		try {
			if (snapshotOpen) {
				reader.exec("ROLLBACK");
				snapshotOpen = false;
			}
		} finally {
			reader.close();
		}
	};
	try {
		options.assertIdentity();
		setSqliteBusyTimeout(reader, options.busyTimeoutMs);
		reader.exec("PRAGMA locking_mode = EXCLUSIVE");
		reader.exec("BEGIN");
		snapshotOpen = true;
		const mode = reader.prepare("PRAGMA journal_mode").get()?.journal_mode;
		if (![
			"delete",
			"truncate",
			"persist"
		].includes(String(mode))) throw new Error("Existing SQLite storage requires rollback journal mode.");
		reader.exec("PRAGMA locking_mode = NORMAL");
		options.validate(reader);
		options.assertIdentity();
		if (!options.write) return operation(reader, () => {
			throw new Error("Read-only SQLite observation cannot admit a writer.");
		});
		writer = openNodeSqliteDatabase(resolveExistingSqliteFileUri(pathname));
		options.assertIdentity();
		setSqliteBusyTimeout(writer, options.busyTimeoutMs);
		const database = writer;
		let admitted = false;
		return operation(database, (write, transactionOptions) => {
			if (admitted && !database.isTransaction) throw new Error("Existing SQLite write admission has already settled.");
			options.assertIdentity();
			return runWithSqliteBusyTimeout(database, 0, (restore) => runSqliteImmediateTransactionSync(database, () => {
				if (!admitted) {
					admitted = true;
					releaseReader();
				}
				restore();
				options.assertIdentity();
				return write();
			}, transactionOptions));
		});
	} finally {
		try {
			if (writer?.isOpen) writer.close();
		} finally {
			releaseReader();
		}
	}
}
//#endregion
//#region src/infra/update-managed-service-handoff-store-repair.ts
/**
* Coordination state for updates lives in a shared temp directory, so anything
* that lands there — an interrupted first write, an operator clearing the file,
* a half-written page — used to refuse config mutation and native service
* operations for every install root on the host, permanently and with no
* in-product recovery. Updates cannot have a state that ends that way.
*
* Retain the evidence instead of trusting or deleting it: move the store aside
* under a name that records the defect, and let the caller open a fresh one. The
* retained copy keeps whatever diagnostics the failure left behind, while nothing
* inside it is read back or believed.
*/
function quarantineManagedHandoffStore(databasePath, defect, warn = (message) => console.warn(message)) {
	const retained = `${databasePath}.${defect}.${Date.now()}`;
	try {
		fs.renameSync(databasePath, retained);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		try {
			fs.rmSync(databasePath, { force: true });
		} catch {
			return;
		}
		warn(`[openclaw] managed handoff lease store was ${defect}; removed ${path.basename(databasePath)} to restore updates`);
		return;
	}
	warn(`[openclaw] managed handoff lease store was ${defect}; retained it as ${path.basename(retained)} and started a new one`);
	return retained;
}
//#endregion
//#region src/infra/update-managed-service-handoff-database.ts
const leaseQueries = (db) => getNodeSqliteKysely(db);
function initializeLeaseSchema(db) {
	executeSqliteQuerySync(db, leaseQueries(db).schema.createTable("managed_update_handoffs").ifNotExists().addColumn("install_root", "text", (column) => column.notNull().primaryKey()).addColumn("owner", "text", (column) => column.notNull()).addColumn("payload_json", "text", (column) => column.notNull()).addColumn("updated_at", "integer", (column) => column.notNull()).modifyEnd(sql`STRICT`));
}
function errorCode(error) {
	return error && typeof error === "object" && "code" in error && typeof error.code === "string" ? error.code : void 0;
}
function assertPath(stat, kind) {
	if (stat.isSymbolicLink() || !(kind === "directory" ? stat.isDirectory() : stat.isFile()) || kind === "file" && BigInt(stat.nlink) !== 1n || typeof process.getuid === "function" && BigInt(stat.uid) !== BigInt(process.getuid()) || process.platform !== "win32" && (BigInt(stat.mode) & 63n) !== 0n) throw new Error("managed handoff lease " + kind + " is unsafe");
}
/**
* Earlier writers created the file under the caller's umask and chmodded it
* after schema creation. Excess read bits on a path we own can therefore be
* that interrupted work. Restore the
* invariant instead of refusing, which would otherwise lock the product out of its
* own state for every install root until an operator deleted the file by hand.
*
* Excess bits here are defense in depth rather than a live exposure: assertPath
* enforces a 0700 owned directory on every read and every write, and a single
* link, so no other user could traverse to this inode or hold a descriptor on it
* whatever the file's own mode said. Write bits are still refused rather than
* repaired, because chmod cannot revoke a descriptor and integrity is the one
* thing the directory guarantee would not restore. Ownership, type and link count
* are likewise not ours to repair; all of those still refuse in assertPath.
*/
function repairPrivateFileMode(databasePath, stat) {
	if (process.platform === "win32" || (stat.mode & 63) === 0 || (stat.mode & 18) !== 0 || stat.isSymbolicLink() || !stat.isFile() || stat.nlink !== 1 || typeof process.getuid === "function" && stat.uid !== process.getuid()) return stat;
	fs.chmodSync(databasePath, 384);
	return fs.lstatSync(databasePath);
}
function assertSamePath(stat, expected, kind) {
	assertPath(stat, kind);
	if (process.platform === "win32" && [
		stat.dev,
		stat.ino,
		expected.dev,
		expected.ino
	].some((value) => value === 0 || value === 0n) || !sameFileIdentity(stat, expected)) throw new Error("managed handoff lease " + kind + " changed during initialization");
}
function createMissingDatabaseFile(databasePath, parentReceipt) {
	let descriptor;
	try {
		descriptor = process.platform === "win32" ? createPrivateWindowsFile(databasePath) : fs.openSync(databasePath, fs.constants.O_RDWR | fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_NOFOLLOW, 384);
	} catch (error) {
		if (errorCode(error) !== "EEXIST") throw error;
	}
	try {
		if (descriptor !== void 0) {
			fs.fchmodSync(descriptor, 384);
			fs.fsyncSync(descriptor);
		}
		const identity = descriptor === void 0 ? repairPrivateFileMode(databasePath, fs.lstatSync(databasePath)) : fs.fstatSync(descriptor, { bigint: true });
		assertSamePath(descriptor === void 0 ? fs.lstatSync(databasePath) : fs.lstatSync(databasePath, { bigint: true }), identity, "file");
		assertSamePath(fs.lstatSync(parentReceipt.path, { bigint: true }), parentReceipt.identity, "directory");
		const directorySync = syncDirectorySync(parentReceipt);
		requireDirectorySync(directorySync, "Managed handoff lease directory");
	} finally {
		if (descriptor !== void 0) fs.closeSync(descriptor);
	}
}
/**
* Bytes we could never adopt: the path is not our regular single-linked file, or
* it carries write bits, which mean a descriptor we cannot revoke may already
* exist. Excess read bits are excluded — repairPrivateFileMode restores those in
* place, because the store sets 0600 after every write and keeps its directory
* private, so they are its own interrupted work.
*/
function isUnadoptableStore(stat) {
	return stat.isSymbolicLink() || !stat.isFile() || stat.nlink !== 1 || typeof process.getuid === "function" && stat.uid !== process.getuid() || process.platform !== "win32" && (stat.mode & 18) !== 0;
}
/** Capture only an already-admitted database, never provision one during recovery. */
function captureManagedUpdateLeaseDatabaseIdentity(databasePath) {
	const canonical = fs.realpathSync(databasePath);
	const file = fs.lstatSync(canonical);
	const parent = fs.lstatSync(path.dirname(canonical));
	assertPath(file, "file");
	assertPath(parent, "directory");
	return Object.freeze({
		databasePath: canonical,
		databaseIdentity: `${file.dev}:${file.ino}`,
		parentIdentity: `${parent.dev}:${parent.ino}`
	});
}
function assertManagedUpdateLeaseDatabaseIdentity(binding) {
	const actual = captureManagedUpdateLeaseDatabaseIdentity(binding.databasePath);
	if (actual.databasePath !== binding.databasePath || actual.databaseIdentity !== binding.databaseIdentity || actual.parentIdentity !== binding.parentIdentity) throw new Error("managed handoff lease database identity changed");
}
/** Existing managed-update lease storage; extraction does not change its schema. */
function createManagedHandoffLeaseDatabase(databasePath, existingIdentity) {
	if (existingIdentity && databasePath !== existingIdentity.databasePath) throw new Error("managed handoff lease database path changed");
	const existingTransactions = /* @__PURE__ */ new WeakMap();
	/**
	* The store keeps its directory at 0700, so drift on a directory we own is its
	* own interrupted work. Ownership and type stay the temp-root resolver's call.
	*/
	function recoverDirectoryMode(target) {
		if (process.platform === "win32") return;
		try {
			const stat = fs.lstatSync(target);
			if (stat.isDirectory() && !stat.isSymbolicLink() && (stat.mode & 63) !== 0 && (typeof process.getuid !== "function" || stat.uid === process.getuid())) fs.chmodSync(target, 448);
		} catch {}
	}
	/**
	* Coordination state lives in a shared temp directory, so a store we cannot
	* adopt used to end config mutation and native service operations for every
	* install root on the host, permanently and with no in-product recovery.
	* Retain it under a name recording the defect and leave a usable store behind.
	*
	* Repairers must not race: renaming on a stale observation lets one process
	* retain the clean store another already opened, leaving two authoritative
	* databases and defeating the lock this store exists to provide. The decision
	* is therefore retaken under the lock, where the replacement is visible.
	*/
	function recoverUnadoptableStore(target, parent) {
		if (!observeUnadoptable(target)) return;
		const release = acquireFileLockSyncWithRetry(target);
		try {
			if (!observeUnadoptable(target)) return;
			quarantineManagedHandoffStore(target, "unsafe-file");
			createMissingDatabaseFile(target, parent);
		} finally {
			release();
		}
	}
	function observeUnadoptable(target) {
		try {
			return isUnadoptableStore(fs.lstatSync(target));
		} catch {
			return false;
		}
	}
	function withDatabase(write, operation) {
		if (existingIdentity) return withExistingSqliteRollbackDatabase(databasePath, {
			write,
			busyTimeoutMs: 5e3,
			assertIdentity: () => assertManagedUpdateLeaseDatabaseIdentity(existingIdentity),
			validate: (db) => {
				executeSqliteQuerySync(db, leaseQueries(db).selectFrom("managed_update_handoffs").selectAll().limit(0));
			}
		}, (db, transact) => {
			existingTransactions.set(db, transact);
			try {
				return operation(db);
			} finally {
				existingTransactions.delete(db);
			}
		});
		const dir = path.dirname(databasePath);
		if (write) {
			fs.mkdirSync(dir, {
				recursive: true,
				mode: 448
			});
			const stat = fs.lstatSync(dir);
			if (!stat.isDirectory() || stat.isSymbolicLink() || typeof process.getuid === "function" && stat.uid !== process.getuid()) throw new Error("managed handoff lease directory is unsafe");
			fs.chmodSync(dir, 448);
		}
		recoverDirectoryMode(dir);
		const directoryIdentity = fs.lstatSync(dir, { bigint: true });
		assertPath(directoryIdentity, "directory");
		recoverUnadoptableStore(databasePath, {
			path: dir,
			realPath: fs.realpathSync(dir),
			identity: directoryIdentity
		});
		if (write && !fs.existsSync(databasePath)) createMissingDatabaseFile(databasePath, {
			path: dir,
			realPath: fs.realpathSync(dir),
			identity: directoryIdentity
		});
		const databaseIdentity = repairPrivateFileMode(databasePath, fs.lstatSync(databasePath));
		assertPath(databaseIdentity, "file");
		const db = openNodeSqliteDatabase(write ? resolveExistingSqliteFileUri(databasePath) : databasePath, { readOnly: !write });
		try {
			assertSamePath(fs.lstatSync(dir, { bigint: true }), directoryIdentity, "directory");
			assertSamePath(fs.lstatSync(databasePath), databaseIdentity, "file");
			setSqliteBusyTimeout(db, 5e3);
			if (write) initializeLeaseSchema(db);
			return operation(db);
		} finally {
			if (db.isOpen) db.close();
		}
	}
	return Object.assign(withDatabase, { transact(db, operation, options) {
		const assertCurrent = () => {
			if (existingIdentity) assertManagedUpdateLeaseDatabaseIdentity(existingIdentity);
		};
		assertCurrent();
		return (existingTransactions.get(db) ?? ((write, transactionOptions) => runSqliteImmediateTransactionSync(db, write, transactionOptions)))(() => {
			assertCurrent();
			return operation();
		}, {
			...options,
			withCommit: (commit) => {
				assertCurrent();
				commit();
			}
		});
	} });
}
//#endregion
//#region src/infra/update-managed-service-handoff-legacy-parent.ts
function readBorrowedLegacyHandoffParent(root, row, executor) {
	const payload = row && parseRetiredManagedHandoffLeasePayload(row.payload_json);
	if (!row || !payload || row.owner.length === 0 || row.owner.length > 4096 || !Number.isSafeInteger(row.updated_at) || row.updated_at < 0) return null;
	const identity = {
		pid: payload.pid,
		startIdentity: payload.startIdentity
	};
	return {
		version: 1,
		key: root,
		owner: row.owner,
		payload: row.payload_json,
		updatedAt: row.updated_at,
		helper: identity,
		executor: executor ?? identity,
		action: { kind: "update" }
	};
}
/** The shipped runner may supervise a respawned updater instead of execing it. */
function isBorrowedLegacyHandoffParentCurrent(parent, readRow, isProcessIdentityCurrent) {
	const ancestors = [...getSelfAndAncestorPidsSync(void 0, { requireVerifiedParent: true })];
	const executorIndex = ancestors.indexOf(parent.executor.pid);
	return executorIndex > 0 && ancestors.indexOf(parent.helper.pid) >= executorIndex && isProcessIdentityCurrent(parent.helper) && isProcessIdentityCurrent(parent.executor) && isDeepStrictEqual(readBorrowedLegacyHandoffParent(parent.key, readRow(), parent.executor), parent);
}
//#endregion
//#region src/infra/update-managed-service-handoff-process.ts
const WINDOWS_ARGV_IDENTITY_PREFIX = "win32-argv-sha256:";
const WINDOWS_ARGV_IDENTITY_PATTERN = /^win32-argv-sha256:[a-f0-9]{64}$/;
function windowsArgvIdentity(argv) {
	if (!argv[0]) return null;
	const normalized = [path.win32.normalize(argv[0]).toLowerCase(), ...argv.slice(1)];
	return WINDOWS_ARGV_IDENTITY_PREFIX + createHash("sha256").update(JSON.stringify(normalized)).digest("hex");
}
/** Process facts shared by lease admission, live ownership, and cleanup. */
function createManagedHandoffProcessIdentityReader(options) {
	const warnedIdentityPids = /* @__PURE__ */ new Set();
	let selfIdentity;
	let parentStartIdentity;
	let selfLauncherIdentity;
	function warn(pid, continuation) {
		if (warnedIdentityPids.has(pid)) return;
		warnedIdentityPids.add(pid);
		try {
			options.onWarning?.(pid, `Native Windows creation-time queries returned no identity for PID ${pid}; ${continuation}.`);
		} catch {}
	}
	const isPidAlive = (pid) => !isPidDefinitelyDead(pid);
	function readProcessStartIdentity(pid) {
		const start = getFileLockProcessStartTime(pid, {
			...options.env,
			LC_ALL: "C",
			TZ: "UTC"
		});
		return start === null ? pid === process.pid ? parentStartIdentity ?? null : null : String(start);
	}
	function readWindowsArgvIdentity(pid) {
		if (pid !== process.pid) {
			const argv = readWindowsProcessArgsSync(pid, void 0, options.env);
			return argv ? windowsArgvIdentity(argv) : null;
		}
		if (selfLauncherIdentity === void 0) {
			const report = process.report.getReport();
			const argv = isRecord(report) && isRecord(report.header) ? report.header.commandLine : null;
			selfLauncherIdentity = Array.isArray(argv) && argv.every((arg) => typeof arg === "string") ? windowsArgvIdentity(argv) : null;
		}
		return selfLauncherIdentity;
	}
	function inspectProcessIdentity(value) {
		if (!isPidAlive(value.pid)) return "dead";
		if (process.platform === "win32" && WINDOWS_ARGV_IDENTITY_PATTERN.test(value.startIdentity)) {
			const argvIdentity = readWindowsArgvIdentity(value.pid);
			return argvIdentity === null ? "unknown" : argvIdentity === value.startIdentity ? "live" : "mismatch";
		}
		const start = readProcessStartIdentity(value.pid);
		return start === null ? "unknown" : start === value.startIdentity ? "live" : "dead";
	}
	function processState(value) {
		const state = inspectProcessIdentity(value);
		return state === "mismatch" ? "unknown" : state;
	}
	function isProcessIdentityCurrent(value, ownedCustody = false) {
		const state = inspectProcessIdentity(value);
		return state === "live" || state === "unknown" && ownedCustody && process.platform === "win32" && WINDOWS_ARGV_IDENTITY_PATTERN.test(value.startIdentity);
	}
	function acceptSelfIdentity(value, parentBound = false) {
		if (value.pid !== process.pid) return false;
		const state = inspectProcessIdentity(value);
		if (state === "live") {
			selfIdentity ??= { ...value };
			return true;
		}
		if (state !== "unknown" || !parentBound || process.platform !== "win32" || WINDOWS_ARGV_IDENTITY_PATTERN.test(value.startIdentity)) return false;
		parentStartIdentity = value.startIdentity;
		selfIdentity ??= { ...value };
		warn(value.pid, "continuing with the creation identity established by the live parent");
		return true;
	}
	function processIdentity(pid = process.pid, argv) {
		if (pid === process.pid && selfIdentity) {
			const observed = process.platform === "win32" && WINDOWS_ARGV_IDENTITY_PATTERN.test(selfIdentity.startIdentity) ? readWindowsArgvIdentity(pid) : readProcessStartIdentity(pid);
			if (observed !== null && observed !== selfIdentity.startIdentity) throw new Error("managed handoff process identity changed");
			return { ...selfIdentity };
		}
		const startIdentity = readProcessStartIdentity(pid);
		if (startIdentity !== null) {
			if (pid === process.pid) selfIdentity = {
				pid,
				startIdentity
			};
			return {
				pid,
				startIdentity
			};
		}
		const attribution = process.platform === "win32" ? argv ? windowsArgvIdentity(argv) : readWindowsArgvIdentity(pid) : null;
		if (attribution) {
			warn(pid, "continuing with PID and launcher attribution");
			if (pid === process.pid) selfIdentity = {
				pid,
				startIdentity: attribution,
				startIdentitySource: "argv-sha256"
			};
			return {
				pid,
				startIdentity: attribution,
				startIdentitySource: "argv-sha256"
			};
		}
		throw new Error("managed handoff process start identity is unavailable");
	}
	return {
		isPidAlive,
		readProcessStartIdentity,
		processIdentity,
		processState,
		isProcessIdentityCurrent,
		acceptSelfIdentity
	};
}
//#endregion
//#region src/infra/update-managed-service-handoff-retained-custody.ts
function sourceKey(resource) {
	const absolute = path.resolve(resource);
	try {
		return path.join(fs.realpathSync(path.dirname(absolute)), path.basename(absolute));
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return absolute;
		throw error;
	}
}
function fileIdentity(file) {
	try {
		return fs.statSync(file, { bigint: true });
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	}
}
function normalizationInsensitive(directory) {
	try {
		const names = fs.readdirSync(directory);
		for (const name of names) {
			const nfc = name.normalize("NFC");
			const nfd = name.normalize("NFD");
			if (nfc === nfd) continue;
			const originalPath = path.join(directory, name);
			const alternate = name === nfc ? nfd : nfc;
			const original = fs.lstatSync(originalPath, { bigint: true });
			if (original.ino === 0n) return;
			let insensitive;
			try {
				const other = fs.lstatSync(path.join(directory, alternate), { bigint: true });
				if (other.ino === 0n) return;
				insensitive = !names.includes(alternate) && original.dev === other.dev && original.ino === other.ino;
			} catch (error) {
				if (!hasErrnoCode(error, "ENOENT")) return;
				insensitive = false;
			}
			const current = fs.lstatSync(originalPath, { bigint: true });
			return current.dev === original.dev && current.ino === original.ino ? insensitive : void 0;
		}
	} catch {}
}
function sameSource(left, right) {
	if (left === right) return true;
	let distinct = false;
	for (const suffix of ["", ".lock"]) {
		const a = fileIdentity(left + suffix);
		const b = fileIdentity(right + suffix);
		if (a && b) {
			if (a.ino !== 0n && a.dev === b.dev && a.ino === b.ino) return true;
			if (a.ino !== 0n && b.ino !== 0n && (a.ino !== b.ino || a.dev !== b.dev)) distinct = true;
		}
	}
	if (distinct || path.dirname(left) !== path.dirname(right)) return false;
	const leftName = path.basename(left);
	const rightName = path.basename(right);
	const leftFolded = leftName.toLowerCase();
	const rightFolded = rightName.toLowerCase();
	if (leftFolded.normalize("NFC") !== rightFolded.normalize("NFC")) return false;
	if (leftFolded !== rightFolded) {
		const insensitive = normalizationInsensitive(path.dirname(right));
		if (insensitive === void 0) throw new Error("Source resource Unicode alias identity is unavailable.");
		if (!insensitive) return false;
	}
	if (leftName.normalize("NFC") === rightName.normalize("NFC")) return true;
	const insensitive = probePathCaseInsensitiveSync(right, { allowTemporaryProbe: false });
	if (insensitive === void 0) throw new Error("Source resource alias identity is unavailable.");
	return insensitive;
}
/** Read-only compatibility for preserved v3 records. No current producer mints them. */
function assertNoRetainedSourceBorrower(resource, rows) {
	const key = sourceKey(resource);
	for (const lease of rows) if (lease.version === 3 && [lease.nativeBorrower.source.serviceKey, ...lease.nativeBorrower.source.configPaths].some((reserved) => sameSource(reserved, key))) throw new Error("Source resource has unresolved native custody.");
}
//#endregion
//#region src/infra/update-managed-service-handoff-scope.ts
/** Inspect the native scope through the same captured service-manager environment. */
function createManagedHandoffScopeReader(serviceManagerEnv) {
	const control = (command, args, timeout = 5e3) => spawnSync(command, args, {
		env: serviceManagerEnv,
		encoding: "utf8",
		timeout,
		killSignal: "SIGKILL",
		windowsHide: true,
		stdio: [
			"ignore",
			"pipe",
			"ignore"
		]
	});
	function properties(stdout) {
		return Object.fromEntries(String(stdout || "").trim().split(/\r?\n/).map((line) => {
			const i = line.indexOf("=");
			return [line.slice(0, i), line.slice(i + 1)];
		}));
	}
	function nativeScope(life) {
		const result = control("systemctl", [
			"--user",
			"show",
			life.scope,
			"--property=Id,LoadState,ActiveState,InvocationID,ControlGroup"
		]);
		const scope = properties(result.stdout);
		return !result.error && (result.status === 0 || scope.LoadState === "not-found") ? scope : null;
	}
	function isInNativeScope(life, scope = nativeScope(life)) {
		if (!scope || scope.Id !== life.scope || scope.LoadState !== "loaded" || !scope.ControlGroup || life.placement.kind === "attached" && scope.InvocationID !== life.placement.invocation) return false;
		return fs.readFileSync("/proc/self/cgroup", "utf8").split("\n").some((line) => {
			const systemd = /^[1-9][0-9]*:name=systemd:(.*)$/.exec(line);
			return line === "0::" + scope.ControlGroup || systemd?.[1] === scope.ControlGroup;
		});
	}
	function nativeClosed(life, scope = nativeScope(life)) {
		return Boolean(scope && scope.Id === life.scope && (scope.LoadState === "not-found" || scope.LoadState === "loaded" && ["inactive", "failed"].some((state) => state === scope.ActiveState) && scope.ControlGroup === "" && (life.placement.kind === "pending" || scope.InvocationID === life.placement.invocation)));
	}
	return {
		control,
		properties,
		nativeScope,
		isInNativeScope,
		nativeClosed
	};
}
//#endregion
//#region src/infra/update-managed-service-handoff-source-inspection.ts
/** Match every schema object, including wrong shapes, using SQLite's identifier casing. */
function hasManagedHandoffSchemaObject(db) {
	return Boolean(executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("sqlite_schema").select("name").where((eb) => eb(eb.fn("lower", ["name"]), "=", "managed_update_handoffs"))));
}
/** A first writer may have created the private inode before SQLite commits its schema. */
function isManagedHandoffSchemaEmpty(db) {
	return !executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("sqlite_schema").select("name").limit(1));
}
//#endregion
//#region src/infra/update-managed-service-handoff-lease.ts
const text = string().min(1).max(4096);
const triageFailureSchema = strictObject({
	kind: _enum(["update", "gateway-startup"]),
	phase: string().max(120),
	error: string().max(800),
	installationRoot: text.optional(),
	expectedVersion: string().max(100).optional(),
	gateway: _enum(["verify-running", "preserve"])
});
function resolveManagedUpdateLeaseDatabasePath() {
	return path.join(resolvePreferredOpenClawTmpDir(), "managed-update-handoffs.sqlite");
}
/** One lease implementation, preloaded normally and sealed before package replacement. */
function createManagedHandoffLeaseStore(options = {
	databasePath: resolveManagedUpdateLeaseDatabasePath(),
	serviceManagerEnv: resolveServiceManagerEnv()
}, logger) {
	const { databasePath, serviceManagerEnv } = options;
	const bootIdentity = createManagedHandoffBootIdentityReader(serviceManagerEnv);
	const { isPidAlive, readProcessStartIdentity, processIdentity, processState, isProcessIdentityCurrent, acceptSelfIdentity } = createManagedHandoffProcessIdentityReader({
		env: serviceManagerEnv,
		onWarning: options.onProcessIdentityWarning ?? ((pid, message) => logger?.warn(message, { pid }))
	});
	const { control, properties, nativeScope, isInNativeScope, nativeClosed } = createManagedHandoffScopeReader(serviceManagerEnv);
	const withDatabase = createManagedHandoffLeaseDatabase(databasePath, options.existingIdentity);
	function row(db, root) {
		return executeSqliteQueryTakeFirstSync(db, leaseQueries(db).selectFrom("managed_update_handoffs").select([
			"owner",
			"payload_json",
			"updated_at"
		]).where("install_root", "=", root));
	}
	function handle(root, value) {
		const payload = parseManagedHandoffLeasePayload(value.payload_json);
		if (!payload || !text.safeParse(value.owner).success) throw new Error("existing managed handoff lease is incompatible; retain diagnostics and run openclaw triage manually");
		return {
			key: root,
			owner: value.owner,
			payload: value.payload_json,
			updatedAt: value.updated_at,
			...payload
		};
	}
	function admissionLease(root, value) {
		const legacyDead = value && text.safeParse(value.owner).success && Number.isSafeInteger(value.updated_at) && value.updated_at >= 0 && canCleanupLegacyManagedHandoff(value.payload_json, processState);
		return value && !legacyDead ? handle(root, value) : null;
	}
	function deleteRow(db, root, value) {
		return executeSqliteQuerySync(db, leaseQueries(db).deleteFrom("managed_update_handoffs").where("install_root", "=", root).where("owner", "=", value.owner).where("payload_json", "=", value.payload_json).where("updated_at", "=", value.updated_at)).numAffectedRows === 1n;
	}
	function updateRow(db, lease, values) {
		return executeSqliteQuerySync(db, leaseQueries(db).updateTable("managed_update_handoffs").set(values).where("install_root", "=", lease.key).where("owner", "=", lease.owner).where("payload_json", "=", lease.payload).where("updated_at", "=", lease.updatedAt)).numAffectedRows === 1n;
	}
	function read(root) {
		try {
			if (!options.existingIdentity && !fs.existsSync(databasePath)) return { kind: "absent" };
			return withDatabase(false, (db) => {
				if (!options.existingIdentity && isManagedHandoffSchemaEmpty(db)) return { kind: "absent" };
				const value = row(db, root);
				return value ? {
					kind: "current",
					lease: handle(root, value)
				} : { kind: "absent" };
			});
		} catch {
			return { kind: "unreadable" };
		}
	}
	function readLegacyParent(root, executor) {
		return withDatabase(false, (db) => readBorrowedLegacyHandoffParent(root, row(db, root), executor));
	}
	function currentLegacyParent(parent, db) {
		return isBorrowedLegacyHandoffParentCurrent(parent, () => row(db, parent.key), isProcessIdentityCurrent);
	}
	const sameRow = (a, b) => a?.owner === b?.owner && a?.payload_json === b?.payload_json && a?.updated_at === b?.updated_at;
	function transact(db, operation) {
		return withDatabase.transact(db, operation, { logger });
	}
	function hasUnsettledChildren(lease, connection) {
		if (lease.version === 3) return true;
		const prefix = `${lease.key}/.openclaw-update-child-`;
		const inspect = (db) => {
			return executeSqliteQuerySync(db, leaseQueries(db).selectFrom("managed_update_handoffs").select([
				"install_root",
				"owner",
				"payload_json",
				"updated_at"
			]).where("install_root", ">=", prefix).where("install_root", "<", prefix + "￿")).rows.some((entry) => {
				const child = handle(entry.install_root, entry);
				return child.version === 3 || processState(child.helper) !== "dead" || processState(child.executor) !== "dead" || process.platform !== "win32" && isChildProcessTreeAlive(child.executor);
			});
		};
		return connection ? inspect(connection) : withDatabase(false, inspect);
	}
	function reclaimable(lease, db) {
		if (lease.version === 3) return false;
		const action = lease.action;
		if (action.kind === "triage" && action.lifetime.kind === "foreground") {
			const boot = bootIdentity();
			if (boot.platform === action.lifetime.boot.platform && boot.identity !== action.lifetime.boot.identity) return true;
			if (!["reserved", "closed"].includes(action.phase)) return false;
		}
		if (processState(lease.helper) !== "dead" || processState(lease.executor) !== "dead") return false;
		return !hasUnsettledChildren(lease, db) && (action.kind !== "triage" || action.lifetime.kind !== "native" || nativeClosed(action.lifetime));
	}
	function admit(root, owner, payload, source, legacyParent) {
		return withDatabase(true, (db) => {
			const observed = row(db, root);
			const destination = admissionLease(root, observed);
			const canReplace = !destination || destination.owner !== owner && reclaimable(destination, db);
			return transact(db, () => {
				if (source && !sameRow({
					owner: source.owner,
					payload_json: source.payload,
					updated_at: source.updatedAt
				}, row(db, source.key))) throw new Error("managed triage source changed during admission");
				if (source && hasUnsettledChildren(source, db)) return {
					kind: "busy",
					owner: source.owner
				};
				const childMarker = root.indexOf("/.openclaw-update-child-");
				if (childMarker >= 0) {
					const parentKey = root.slice(0, childMarker);
					const parent = row(db, parentKey);
					if (legacyParent) {
						if (legacyParent.key !== parentKey || !currentLegacyParent(legacyParent, db)) throw new Error("Borrowed legacy update parent changed during child admission");
						if (root.lastIndexOf("/.openclaw-update-child-") === childMarker && hasUnsettledChildren(legacyParent, db)) return {
							kind: "busy",
							owner: legacyParent.owner
						};
					} else if (!parent || handle(parentKey, parent).version === 3) return {
						kind: "busy",
						owner: parent?.owner ?? owner
					};
				} else if (legacyParent) throw new Error("Borrowed legacy update authority admits only child rows");
				const latest = row(db, root);
				if (!sameRow(observed, latest)) {
					if (latest) return {
						kind: "busy",
						owner: handle(root, latest).owner
					};
					throw new Error("managed handoff lease changed during admission");
				}
				const previous = destination ?? readBorrowedLegacyHandoffParent(root, observed);
				if (!canReplace || previous && hasUnsettledChildren(previous, db)) return {
					kind: "busy",
					owner: previous?.owner ?? owner
				};
				if (observed) deleteRow(db, root, observed);
				const updatedAt = Math.max(Date.now(), (source?.updatedAt ?? 0) + 1);
				if (source) {
					if (!updateRow(db, source, {
						install_root: root,
						payload_json: payload,
						updated_at: updatedAt
					})) throw new Error("managed triage source changed during transfer");
				} else executeSqliteQuerySync(db, leaseQueries(db).insertInto("managed_update_handoffs").values({
					install_root: root,
					owner,
					payload_json: payload,
					updated_at: updatedAt
				}));
				return {
					kind: "acquired",
					lease: handle(root, {
						owner,
						payload_json: payload,
						updated_at: updatedAt
					})
				};
			});
		});
	}
	function acquire(root, owner, action, transition = false, legacyParent) {
		const helper = processIdentity();
		const payload = JSON.stringify({
			version: 2,
			executor: helper,
			helper,
			action
		});
		if (!text.safeParse(root).success || !text.safeParse(owner).success || !parseManagedHandoffLeasePayload(payload)) throw new Error("managed handoff admission is invalid");
		if (transition) {
			if (legacyParent) throw new Error("Borrowed legacy authority cannot transition a lease");
			const result = read(root);
			if (result.kind !== "current" || result.lease.owner !== owner || result.lease.payload !== payload || action.kind !== "triage" || action.phase !== "reserved" || action.lifetime.kind !== "native" || action.lifetime.placement.kind !== "pending") throw new Error("managed triage transition lost its current lease");
			return {
				kind: "acquired",
				lease: result.lease
			};
		}
		return admit(root, owner, payload, void 0, legacyParent);
	}
	function current(lease) {
		if (lease.version === 1) return withDatabase(false, (db) => currentLegacyParent(lease, db));
		const result = read(lease.key);
		return result.kind === "current" && isDeepStrictEqual(result.lease, lease);
	}
	function owns(lease, role = "helper") {
		return current(lease) && !(lease.action.kind === "triage" && [
			"closing",
			"closed",
			"uncertain"
		].includes(lease.action.phase)) && lease[role].pid === process.pid && isProcessIdentityCurrent(lease.helper) && acceptSelfIdentity(lease[role]);
	}
	function acceptParentBoundExecutor(lease) {
		return current(lease) && lease.version === 2 && lease.action.kind === "update" && lease.helper.pid === process.ppid && lease.executor.pid === process.pid && isProcessIdentityCurrent(lease.helper) && acceptSelfIdentity(lease.executor, true);
	}
	function cas(lease, action, executor) {
		if (lease.version === 3) return null;
		const payload = JSON.stringify({
			...parseManagedHandoffLeasePayload(lease.payload),
			action,
			...executor ? {
				executor,
				helper: lease.helper
			} : {}
		});
		if (!parseManagedHandoffLeasePayload(payload)) return null;
		return withDatabase(true, (db) => transact(db, () => {
			if (hasUnsettledChildren(lease, db)) return null;
			const updatedAt = Math.max(Date.now(), lease.updatedAt + 1);
			return updateRow(db, lease, {
				payload_json: payload,
				updated_at: updatedAt
			}) ? handle(lease.key, {
				owner: lease.owner,
				payload_json: payload,
				updated_at: updatedAt
			}) : null;
		}));
	}
	function bind(lease, pid, action = lease.action, argv) {
		if (!owns(lease)) return null;
		const previous = lease.action;
		if (previous.kind === "triage") {
			if (previous.phase !== "reserved" || action.kind !== "triage" || action.phase !== "reserved" || lease.executor.pid !== lease.helper.pid) return null;
			const lifetime = previous.lifetime.kind === "native" && action.lifetime.kind === "native" && previous.lifetime.placement.kind === "pending" ? {
				...previous.lifetime,
				placement: action.lifetime.placement
			} : previous.lifetime;
			if (JSON.stringify(lifetime) !== JSON.stringify(action.lifetime)) return null;
		} else if (action.kind !== "update") return null;
		return cas(lease, action, processIdentity(pid, argv));
	}
	function retarget(lease, root, action) {
		if (lease.version !== 2 || hasUnsettledChildren(lease) || !owns(lease, "executor") || lease.helper.pid !== process.pid || lease.action.kind !== "update" || action.kind !== "triage" || action.phase !== "reserved" || action.lifetime.kind !== "native" || action.lifetime.placement.kind !== "pending") return null;
		const payload = JSON.stringify({
			version: 2,
			executor: lease.helper,
			helper: lease.helper,
			action
		});
		if (!text.safeParse(root).success || !parseManagedHandoffLeasePayload(payload) || fs.realpathSync(root) !== root) throw new Error("managed triage destination is not canonical");
		if (root === lease.key) {
			const next = cas(lease, action, lease.helper);
			return next ? {
				kind: "acquired",
				lease: next
			} : null;
		}
		return admit(root, lease.owner, payload, lease);
	}
	function activate(lease) {
		if (!owns(lease) || processState(lease.executor) !== "live" || lease.executor.pid === lease.helper.pid || lease.action.kind !== "triage" || lease.action.phase !== "reserved") return null;
		return cas(lease, {
			...lease.action,
			phase: "running"
		});
	}
	function readGeneration(lease) {
		const result = read(lease.key);
		if (result.kind !== "current") return null;
		const active = result.lease;
		return lease.version === 2 && active.version === 2 && lease.action.kind === "triage" && active.action.kind === "triage" && lease.owner === active.owner && JSON.stringify(lease.helper) === JSON.stringify(active.helper) && JSON.stringify(lease.executor) === JSON.stringify(active.executor) && JSON.stringify(lease.action.lifetime) === JSON.stringify(active.action.lifetime) ? {
			...active,
			action: active.action
		} : null;
	}
	function settle(lease, phase) {
		const active = readGeneration(lease);
		if (!active) return null;
		const actor = active.helper.pid === process.pid && phase !== "closed" ? active.helper : active.executor;
		if (actor.pid !== process.pid || processState(actor) !== "live") return null;
		if (phase === "closed") {
			if (!["running", "closing"].includes(active.action.phase)) return null;
		} else if (active.action.phase === "uncertain" || phase === "closing" && ["closing", "closed"].includes(active.action.phase)) return active;
		return cas(active, {
			...active.action,
			phase
		});
	}
	function release(lease) {
		if (!current(lease) || hasUnsettledChildren(lease) || lease.key.includes("/.openclaw-update-child-") && lease.executor.pid !== lease.helper.pid && process.platform !== "win32" && isChildProcessTreeAlive(lease.executor)) return false;
		const localHelper = lease.helper.pid === process.pid && processState(lease.helper) === "live";
		const action = lease.action;
		const executorClosed = lease.executor.pid === process.pid || processState(lease.executor) === "dead";
		if (!(localHelper ? action.kind === "update" ? executorClosed : action.lifetime.kind === "foreground" ? ["reserved", "closed"].includes(action.phase) && executorClosed : nativeClosed(action.lifetime) : reclaimable(lease))) return false;
		return withDatabase(true, (db) => transact(db, () => !hasUnsettledChildren(lease, db) && deleteRow(db, lease.key, {
			owner: lease.owner,
			payload_json: lease.payload,
			updated_at: lease.updatedAt
		})));
	}
	function readRetainedSources() {
		try {
			fs.lstatSync(databasePath);
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) return [];
			throw error;
		}
		return withDatabase(false, (db) => {
			if (!options.existingIdentity && !hasManagedHandoffSchemaObject(db)) return [];
			return executeSqliteQuerySync(db, leaseQueries(db).selectFrom("managed_update_handoffs").select([
				"install_root",
				"owner",
				"payload_json",
				"updated_at"
			])).rows.flatMap((entry) => isRetiredManagedHandoffLeasePayload(entry.payload_json) ? [] : [handle(entry.install_root, entry)]);
		});
	}
	function assertSourceUnborrowed(resource) {
		assertNoRetainedSourceBorrower(resource, readRetainedSources());
	}
	function stopNative(lease, ownPlacement = false) {
		const life = lease.action.kind === "triage" && lease.action.lifetime;
		if (!life || life.kind !== "native" || life.placement.kind !== "attached" && !ownPlacement || !ownPlacement && !current(lease)) return false;
		const scope = nativeScope(life);
		if (ownPlacement && (![lease.helper.pid, lease.executor.pid].includes(process.pid) || processState(lease.helper.pid === process.pid ? lease.helper : lease.executor) !== "live" || !isInNativeScope(life, scope))) return false;
		if (nativeClosed(life, scope)) return true;
		if (!scope || scope.Id !== life.scope || life.placement.kind === "attached" && scope.InvocationID !== life.placement.invocation || !ownPlacement && !current(lease)) return false;
		const result = control("systemctl", [
			"--user",
			...ownPlacement ? ["--no-block"] : [],
			"stop",
			life.scope
		], 3e4);
		return !result.error && result.status === 0 && (ownPlacement || nativeClosed(life));
	}
	return {
		transact,
		read,
		readLegacyParent,
		acquire,
		bind,
		retarget,
		activate,
		owns,
		hasUnsettledChildren,
		acceptParentBoundExecutor,
		current,
		readGeneration,
		settle,
		release,
		assertSourceUnborrowed,
		stopNative,
		isInNativeScope,
		processIdentity,
		isProcessIdentityCurrent,
		readProcessStartIdentity,
		isPidAlive,
		bootIdentity,
		properties,
		validFailure: (value) => triageFailureSchema.safeParse(value).success
	};
}
//#endregion
export { assertManagedUpdateLeaseDatabaseIdentity as a, withExistingSqliteRollbackDatabase as c, cleanupStaleManagedServiceUpdateHandoffs as d, createManagedHandoffProcessIdentityReader as i, acquireFileLockSyncWithRetry as l, resolveManagedUpdateLeaseDatabasePath as n, captureManagedUpdateLeaseDatabaseIdentity as o, triageFailureSchema as r, createManagedHandoffLeaseDatabase as s, createManagedHandoffLeaseStore as t, MANAGED_SERVICE_UPDATE_HANDOFF_TEMP_PREFIX as u };
