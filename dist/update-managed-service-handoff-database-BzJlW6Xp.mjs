import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as getFileLockProcessStartTime } from "./pid-alive-CPS_shDt.mjs";
import { t as acquireFileLockSync } from "./file-lock-manager-D-LVVqdD.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { a as getNodeSqliteKysely, c as prepareSqliteQuerySync, d as sql, i as executeSqliteQueryTakeFirstSync, n as createSqliteQueryCache, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { r as databaseFileIdentityKey } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { r as resolveExistingSqliteFileUri, t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { i as setSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { n as createPrivateWindowsFile } from "./windows-private-directory-Guk4nrA5.mjs";
import { n as ensureColumn } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { Jn as string, Nt as array, Pn as number, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { t as safeParseJsonWithSchema } from "./zod-parse-Bip-sZi_.mjs";
import { n as isLockOwnerDefinitelyStale } from "./stale-lock-file-BXwDVcTj.mjs";
import { p as syncDirectorySync, s as requireDirectorySync } from "./directory-durability-CqSvP1tc.mjs";
import { n as withExistingSqliteRollbackDatabase, t as createExistingSqliteRollbackReader } from "./sqlite-existing-database-DMt1YTXm.mjs";
import fs from "node:fs";
import path from "node:path";
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
//#region src/infra/update-managed-service-handoff-store-repair.ts
/** Retain unusable coordination state for diagnostics before the caller provisions its replacement. */
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
const text = string().min(1).max(4096);
const repairMetadataSchema = strictObject({
	version: literal(3),
	binding: string(),
	source: strictObject({
		owner: text,
		payload_json: string(),
		updated_at: number().int().nonnegative()
	}),
	facts: strictObject({
		runIds: array(text).min(1),
		artifactPaths: array(text.refine(path.isAbsolute)),
		timeoutMs: number().int().positive().safe().nullable()
	})
});
const managedHandoffLeaseBinding = (lease) => JSON.stringify([
	lease.owner,
	lease.payload,
	lease.updatedAt
]);
const recoveryColumns = /* @__PURE__ */ new WeakSet();
function readManagedHandoffRepairMetadata(db, lease, transact) {
	if (!recoveryColumns.has(db)) {
		if (db.isTransaction) throw new Error("Handoff recovery schema requires a separate writer admission.");
		transact(() => ensureColumn(db, "managed_update_handoffs", "recovery_json TEXT"));
		recoveryColumns.add(db);
	}
	const retained = executeSqliteQueryTakeFirstSync(db, leaseQueries(db).selectFrom("managed_update_handoffs").select("recovery_json").where("install_root", "=", lease.key))?.recovery_json;
	const parsed = retained ? safeParseJsonWithSchema(repairMetadataSchema, retained) : null;
	if (retained !== null && retained !== void 0 && !parsed) throw new Error("Handoff recovery metadata is unreadable; preserve its retained artifacts.");
	return parsed?.binding === managedHandoffLeaseBinding(lease) ? parsed : null;
}
function initializeLeaseSchema(db) {
	executeSqliteQuerySync(db, leaseQueries(db).schema.createTable("managed_update_handoffs").ifNotExists().addColumn("install_root", "text", (column) => column.notNull().primaryKey()).addColumn("owner", "text", (column) => column.notNull()).addColumn("payload_json", "text", (column) => column.notNull()).addColumn("updated_at", "integer", (column) => column.notNull()).addColumn("recovery_json", "text").modifyEnd(sql`STRICT`));
}
function assertManagedHandoffPath(stat, kind) {
	if (stat.isSymbolicLink() || !(kind === "directory" ? stat.isDirectory() : stat.isFile()) || kind === "file" && stat.nlink !== 1n || typeof process.getuid === "function" && stat.uid !== BigInt(process.getuid()) || process.platform !== "win32" && (stat.mode & 63n) !== 0n) throw new Error("managed handoff lease " + kind + " is unsafe");
}
/**
* Earlier writers created the file under the caller's umask and chmodded it
* after schema creation. Excess read bits on a path we own can therefore be
* that interrupted work. Restore the
* invariant instead of refusing, which would otherwise lock the product out of its
* own state for every install root until an operator deleted the file by hand.
*
* Excess bits here are defense in depth rather than a live exposure: assertManagedHandoffPath
* enforces a 0700 owned directory on every read and every write, and a single
* link, so no other user could traverse to this inode or hold a descriptor on it
* whatever the file's own mode said. Write bits are still refused rather than
* repaired, because chmod cannot revoke a descriptor and integrity is the one
* thing the directory guarantee would not restore. Ownership, type and link count
* are likewise not ours to repair; all of those still refuse in assertManagedHandoffPath.
*/
function repairPrivateFileMode(databasePath, stat) {
	if (process.platform === "win32" || (stat.mode & 63n) === 0n || (stat.mode & 18n) !== 0n || stat.isSymbolicLink() || !stat.isFile() || stat.nlink !== 1n || typeof process.getuid === "function" && stat.uid !== BigInt(process.getuid())) return stat;
	fs.chmodSync(databasePath, 384);
	return fs.lstatSync(databasePath, { bigint: true });
}
function assertSameManagedHandoffPath(stat, expected, kind) {
	assertManagedHandoffPath(stat, kind);
	if (process.platform === "win32" && [
		stat.dev,
		stat.ino,
		expected.dev,
		expected.ino
	].includes(0n) || databaseFileIdentityKey(stat) !== databaseFileIdentityKey(expected)) throw new Error("managed handoff lease " + kind + " changed during initialization");
}
function createMissingDatabaseFile(databasePath, parentReceipt) {
	let descriptor;
	try {
		descriptor = process.platform === "win32" ? createPrivateWindowsFile(databasePath) : fs.openSync(databasePath, fs.constants.O_RDWR | fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_NOFOLLOW, 384);
	} catch (error) {
		if (!hasErrnoCode(error, "EEXIST")) throw error;
	}
	try {
		if (descriptor !== void 0) {
			fs.fchmodSync(descriptor, 384);
			fs.fsyncSync(descriptor);
		}
		const identity = descriptor === void 0 ? repairPrivateFileMode(databasePath, fs.lstatSync(databasePath, { bigint: true })) : fs.fstatSync(descriptor, { bigint: true });
		assertSameManagedHandoffPath(fs.lstatSync(databasePath, { bigint: true }), identity, "file");
		assertSameManagedHandoffPath(fs.lstatSync(parentReceipt.path, { bigint: true }), parentReceipt.identity, "directory");
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
function captureManagedUpdateLeaseDatabaseIdentity(databasePath, previous, legacyNumeric = false) {
	const canonical = fs.realpathSync(databasePath);
	const file = fs.lstatSync(canonical, { bigint: true });
	const parent = fs.lstatSync(path.dirname(canonical), { bigint: true });
	assertManagedHandoffPath(file, "file");
	assertManagedHandoffPath(parent, "directory");
	const matches = (stat, expected) => expected === databaseFileIdentityKey(stat) || legacyNumeric && expected === `${Number(stat.dev)}:${Number(stat.ino)}`;
	if (previous && (canonical !== previous.databasePath || !matches(file, previous.databaseIdentity) || !matches(parent, previous.parentIdentity))) throw new Error("managed handoff lease database identity changed");
	return Object.freeze({
		databasePath: canonical,
		databaseIdentity: databaseFileIdentityKey(file),
		parentIdentity: databaseFileIdentityKey(parent)
	});
}
function assertManagedUpdateLeaseDatabaseIdentity(binding) {
	captureManagedUpdateLeaseDatabaseIdentity(binding.databasePath, binding);
}
/** Existing managed-update lease storage; extraction does not change its schema. */
function createManagedHandoffLeaseDatabase(databasePath, existingIdentity) {
	if (existingIdentity && databasePath !== existingIdentity.databasePath) throw new Error("managed handoff lease database path changed");
	const existingTransactions = /* @__PURE__ */ new WeakMap();
	const validationQuery = createSqliteQueryCache((db) => prepareSqliteQuerySync(db, () => leaseQueries(db).selectFrom("managed_update_handoffs").selectAll().limit(0)));
	const existingOptions = existingIdentity ? {
		busyTimeoutMs: 5e3,
		assertIdentity: () => assertManagedUpdateLeaseDatabaseIdentity(existingIdentity),
		validate: (db) => {
			validationQuery(db)();
		}
	} : void 0;
	let readExisting;
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
		if (existingOptions) {
			const run = (db, transact) => {
				existingTransactions.set(db, transact);
				try {
					return operation(db);
				} finally {
					existingTransactions.delete(db);
				}
			};
			return !write && readExisting ? readExisting(run) : withExistingSqliteRollbackDatabase(databasePath, {
				...existingOptions,
				write
			}, run);
		}
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
		assertManagedHandoffPath(directoryIdentity, "directory");
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
		const databaseIdentity = repairPrivateFileMode(databasePath, fs.lstatSync(databasePath, { bigint: true }));
		assertManagedHandoffPath(databaseIdentity, "file");
		const db = openNodeSqliteDatabase(write ? resolveExistingSqliteFileUri(databasePath) : databasePath, { readOnly: !write });
		try {
			assertSameManagedHandoffPath(fs.lstatSync(dir, { bigint: true }), directoryIdentity, "directory");
			assertSameManagedHandoffPath(fs.lstatSync(databasePath, { bigint: true }), databaseIdentity, "file");
			setSqliteBusyTimeout(db, 5e3);
			if (write) initializeLeaseSchema(db);
			return operation(db);
		} finally {
			if (db.isOpen) db.close();
		}
	}
	return Object.assign(withDatabase, {
		retainReadConnection() {
			if (!existingOptions || readExisting) throw new Error("Existing SQLite reader requires an unretained identity-bound store.");
			const reader = createExistingSqliteRollbackReader(databasePath, existingOptions);
			readExisting = reader;
			return { [Symbol.dispose]() {
				if (readExisting === reader) readExisting = void 0;
				reader[Symbol.dispose]();
			} };
		},
		transact(db, operation, options) {
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
		}
	});
}
//#endregion
export { createManagedHandoffLeaseDatabase as a, readManagedHandoffRepairMetadata as c, captureManagedUpdateLeaseDatabaseIdentity as i, acquireFileLockSyncWithRetry as l, assertManagedUpdateLeaseDatabaseIdentity as n, leaseQueries as o, assertSameManagedHandoffPath as r, managedHandoffLeaseBinding as s, assertManagedHandoffPath as t };
