import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { i as databaseFileIdentityKey } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { o as runWithSqliteCleanup } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { t as getFileLockProcessStartTime } from "./pid-alive-dd7OR8F6.mjs";
import { t as acquireFileLockSync } from "./file-lock-manager-D-LVVqdD.mjs";
import { Jn as string, Nt as array, Pn as number, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { t as safeParseJsonWithSchema } from "./zod-parse-Bip-sZi_.mjs";
import { n as isLockOwnerDefinitelyStale } from "./stale-lock-file-BdSoQ5K8.mjs";
import { i as setSqliteBusyTimeout } from "./sqlite-busy-timeout-COlIRjFZ.mjs";
import { a as resolveExistingSqliteFileUri, r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { a as isSqliteLockError, l as sqliteErrorCode, u as sqliteExtendedResultCode } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely, p as sql } from "./kysely-sync-9fPQaMlh.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { n as createPrivateWindowsFile } from "./windows-private-directory-MPEowKNX.mjs";
import { a as tableExists, n as ensureColumn } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { p as syncDirectorySync, s as requireDirectorySync } from "./directory-durability-B2RKADOj.mjs";
import { n as packageUpdateRefusal } from "./package-update-refusal-DuTdNl6m.mjs";
import { n as withExistingSqliteRollbackDatabase, t as createExistingSqliteRollbackReader } from "./sqlite-existing-database-CZ3ULeQw.mjs";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { FsSafeError } from "@openclaw/fs-safe/errors";
import { root } from "@openclaw/fs-safe/root";
//#region src/infra/file-lock-sync.ts
/** Coordinate synchronous store access, reclaiming only definitely dead owners. */
function acquireFileLockSyncWithRetry(path, options = {}) {
	const lockPath = `${path}.lock`;
	const { lockRoot, reentrantOwner, timeoutMs } = options;
	const deadline = lockRoot && timeoutMs !== void 0 && Number.isFinite(timeoutMs) && timeoutMs >= 0 ? performance.now() + timeoutMs : void 0;
	rejectUnsupportedLockPath(lockPath);
	const processStartTime = getFileLockProcessStartTime(process.pid);
	const createPayload = () => ({
		pid: process.pid,
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		...processStartTime === null ? {} : { starttime: processStartTime }
	});
	const isStale = ({ payload }) => isLockOwnerDefinitelyStale({ payload: isRecord(payload) ? payload : null });
	for (;;) {
		let reclaimObserved = false;
		try {
			const lock = acquireFileLockSync(path, {
				lockRoot,
				reentrantOwner,
				timeoutMs: deadline === void 0 ? timeoutMs : Math.max(0, deadline - performance.now()),
				staleMs: 3e4,
				retry: {
					...timeoutMs === void 0 ? { retries: 9 } : {},
					factor: 1,
					minTimeout: 20,
					maxTimeout: 20,
					randomize: false
				},
				staleRecovery: "remove-if-unchanged",
				payload: createPayload,
				shouldReclaim: (snapshot) => {
					reclaimObserved = false;
					const stale = isStale(snapshot);
					reclaimObserved = true;
					return stale;
				},
				shouldRemoveStaleLock: isStale
			});
			return () => lock.release();
		} catch (error) {
			if (deadline === void 0 || !reclaimObserved || !(error instanceof FsSafeError) || error.code !== "path-mismatch" || error.message !== "sidecar changed during reclaim policy callback" || !sidecarAbsent(lockPath)) throw error;
			if (performance.now() >= deadline) throw Object.assign(new Error(`Storage lock admission timed out: ${lockPath}`, { cause: error }), {
				code: "file_lock_timeout",
				lockPath
			});
		}
	}
}
function sidecarAbsent(lockPath) {
	try {
		fs.lstatSync(lockPath);
		return false;
	} catch (error) {
		return hasErrnoCode(error, "ENOENT");
	}
}
function rejectUnsupportedLockPath(lockPath) {
	let observed;
	try {
		observed = fs.lstatSync(lockPath);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
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
const HANDOFF_BUSY_TIMEOUT_MS = 5e3;
const writeAdmissions = new AsyncLocalStorage();
function identityChangedMessage(databasePath, changes) {
	return `managed handoff lease database identity changed at ${databasePath}: ${changes.join("; ")}. Run ${formatCliCommand("openclaw update repair")}.`;
}
function assertRecordedDatabasePath(databasePath, existingIdentity) {
	if (existingIdentity && databasePath !== existingIdentity.databasePath) throw packageUpdateRefusal("managed-handoff-lease-identity-changed", identityChangedMessage(databasePath, [`path (recorded ${existingIdentity.databasePath}; current ${databasePath})`]));
}
function prepareHandoffDirectory(databasePath) {
	const dir = path.dirname(databasePath);
	fs.mkdirSync(dir, {
		recursive: true,
		mode: 448
	});
	const stat = fs.lstatSync(dir);
	if (!stat.isDirectory() || stat.isSymbolicLink() || typeof process.getuid === "function" && stat.uid !== process.getuid()) throw new Error("managed handoff lease directory is unsafe");
	fs.chmodSync(dir, 448);
}
/** Prepare a directory capability without repairing identity-bound storage. */
async function prepareManagedHandoffLeaseDatabase(databasePath, existingIdentity) {
	assertRecordedDatabasePath(databasePath, existingIdentity);
	if (existingIdentity) assertManagedUpdateLeaseDatabaseIdentity(existingIdentity);
	else prepareHandoffDirectory(databasePath);
	const lockRoot = await root(path.dirname(databasePath));
	if (existingIdentity) assertManagedUpdateLeaseDatabaseIdentity(existingIdentity);
	return createManagedHandoffLeaseDatabase(existingIdentity ? databasePath : path.join(lockRoot.rootReal, path.basename(databasePath)), existingIdentity, lockRoot);
}
/** Bootstrap owned storage and capture the identity used by later no-repair operations. */
async function prepareManagedHandoffLeaseDatabaseIdentity(databasePath, assertCurrent) {
	const withDatabase = await prepareManagedHandoffLeaseDatabase(databasePath);
	assertCurrent?.();
	return withDatabase(true, () => captureManagedUpdateLeaseDatabaseIdentity(withDatabase.databasePath));
}
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
	if (tableExists(db, "managed_update_handoffs")) return;
	executeSqliteQuerySync(db, leaseQueries(db).schema.createTable("managed_update_handoffs").ifNotExists().addColumn("install_root", "text", (column) => column.notNull().primaryKey()).addColumn("owner", "text", (column) => column.notNull()).addColumn("payload_json", "text", (column) => column.notNull()).addColumn("updated_at", "integer", (column) => column.notNull()).addColumn("recovery_json", "text").modifyEnd(sql`STRICT`));
}
function assertManagedHandoffPath(stat, kind) {
	if (stat.isSymbolicLink() || !(kind === "directory" ? stat.isDirectory() : stat.isFile()) || kind === "file" && stat.nlink !== 1n || typeof process.getuid === "function" && stat.uid !== BigInt(process.getuid()) || process.platform !== "win32" && (stat.mode & 63n) !== 0n) throw new Error("managed handoff lease " + kind + " is unsafe");
}
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
	let privateFile;
	try {
		if (process.platform === "win32") {
			privateFile = createPrivateWindowsFile(databasePath);
			descriptor = privateFile.fd;
		} else descriptor = fs.openSync(databasePath, fs.constants.O_RDWR | fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_NOFOLLOW, 384);
	} catch (error) {
		if (!(process.platform === "win32" ? error instanceof FsSafeError && error.code === "already-exists" : hasErrnoCode(error, "EEXIST"))) throw error;
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
		if (privateFile) privateFile.close();
		else if (descriptor !== void 0) fs.closeSync(descriptor);
	}
}
function isUnadoptableStore(stat) {
	return stat.isSymbolicLink() || !stat.isFile() || stat.nlink !== 1 || typeof process.getuid === "function" && stat.uid !== process.getuid() || process.platform !== "win32" && (stat.mode & 18) !== 0;
}
/** Capture only an already-admitted database, never provision one during recovery. */
function captureManagedUpdateLeaseDatabaseIdentity(databasePath, previous, legacyNumeric = false) {
	let canonical;
	let file;
	let parent;
	try {
		canonical = fs.realpathSync(databasePath);
		file = fs.lstatSync(canonical, { bigint: true });
		parent = fs.lstatSync(path.dirname(canonical), { bigint: true });
	} catch (error) {
		if (previous && error instanceof Error && hasErrnoCode(error, "ENOENT")) error.message = `${identityChangedMessage(databasePath, [`${file ? "parent directory" : "file"} identity (recorded ${file ? previous.parentIdentity : previous.databaseIdentity}; current missing)`])} ${error.message}`;
		throw error;
	}
	assertManagedHandoffPath(file, "file");
	assertManagedHandoffPath(parent, "directory");
	const matches = (stat, expected) => expected === databaseFileIdentityKey(stat) || legacyNumeric && expected === `${Number(stat.dev)}:${Number(stat.ino)}`;
	if (previous) {
		const changes = [];
		if (canonical !== previous.databasePath) changes.push(`path (recorded ${previous.databasePath}; current ${canonical})`);
		if (!matches(file, previous.databaseIdentity)) changes.push(`file identity (recorded ${previous.databaseIdentity}; current ${databaseFileIdentityKey(file)})`);
		if (!matches(parent, previous.parentIdentity)) changes.push(`parent directory identity (recorded ${previous.parentIdentity}; current ${databaseFileIdentityKey(parent)})`);
		if (changes.length) throw packageUpdateRefusal("managed-handoff-lease-identity-changed", identityChangedMessage(databasePath, changes));
	}
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
function createManagedHandoffLeaseDatabase(databasePath, existingIdentity, writeLockRoot) {
	assertRecordedDatabasePath(databasePath, existingIdentity);
	const assertCurrent = () => {
		if (existingIdentity) assertManagedUpdateLeaseDatabaseIdentity(existingIdentity);
	};
	const existingTransactions = /* @__PURE__ */ new WeakMap();
	const existingOptions = existingIdentity ? {
		busyTimeoutMs: HANDOFF_BUSY_TIMEOUT_MS,
		assertIdentity: assertCurrent
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
	function recoverUnadoptableStore(target, parent) {
		if (!observeUnadoptable(target)) return;
		const current = writeAdmissions.getStore();
		const admission = current?.databasePath === target ? current : void 0;
		const release = acquireFileLockSyncWithRetry(target, writeLockRoot || admission ? {
			lockRoot: writeLockRoot ?? admission?.lockRoot,
			reentrantOwner: admission?.owner,
			timeoutMs: HANDOFF_BUSY_TIMEOUT_MS
		} : void 0);
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
	function accessDatabase(write, operation, busyTimeoutMs = HANDOFF_BUSY_TIMEOUT_MS) {
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
				busyTimeoutMs,
				write
			}, run);
		}
		const dir = path.dirname(databasePath);
		if (write) prepareHandoffDirectory(databasePath);
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
			setSqliteBusyTimeout(db, busyTimeoutMs);
			if (write) initializeLeaseSchema(db);
			return operation(db);
		} finally {
			if (db.isOpen) db.close();
		}
	}
	function withDatabase(write, operation) {
		if (!write || !writeLockRoot && (process.platform !== "win32" || existingIdentity)) return accessDatabase(write, operation);
		assertCurrent();
		const inherited = writeAdmissions.getStore();
		const admission = inherited?.databasePath === databasePath ? inherited : {
			owner: randomUUID(),
			deadline: performance.now() + HANDOFF_BUSY_TIMEOUT_MS,
			databasePath,
			lockRoot: writeLockRoot
		};
		if (!writeLockRoot && !existingIdentity) prepareHandoffDirectory(databasePath);
		const remaining = () => Math.max(0, Math.ceil(admission.deadline - performance.now()));
		const release = acquireFileLockSyncWithRetry(databasePath, {
			lockRoot: writeLockRoot ?? admission.lockRoot,
			reentrantOwner: admission.owner,
			timeoutMs: remaining()
		});
		return runWithSqliteCleanup({ release }, "Managed handoff writer admission", () => writeAdmissions.run(admission, () => accessDatabase(write, operation, remaining())));
	}
	return Object.assign(withDatabase, {
		databasePath,
		forExisting(identity) {
			return createManagedHandoffLeaseDatabase(identity.databasePath, identity, writeLockRoot);
		},
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
			const transact = existingTransactions.get(db) ?? ((write, transactionOptions) => runSqliteImmediateTransactionSync(db, write, transactionOptions));
			let entered = false;
			try {
				return transact(() => {
					entered = true;
					return operation();
				}, {
					...options,
					withCommit: (commit) => {
						assertCurrent();
						commit();
					}
				});
			} catch (error) {
				if (writeLockRoot && !entered && isSqliteLockError(error)) throw Object.assign(new Error("The managed handoff database is locked. Another OpenClaw update or Doctor from an older release may still be using it. Wait for it to finish, then rerun this command.", { cause: error }), {
					code: sqliteErrorCode(error),
					errcode: sqliteExtendedResultCode(error)
				});
				throw error;
			}
		}
	});
}
//#endregion
export { createManagedHandoffLeaseDatabase as a, prepareManagedHandoffLeaseDatabase as c, acquireFileLockSyncWithRetry as d, captureManagedUpdateLeaseDatabaseIdentity as i, prepareManagedHandoffLeaseDatabaseIdentity as l, assertManagedUpdateLeaseDatabaseIdentity as n, leaseQueries as o, assertSameManagedHandoffPath as r, managedHandoffLeaseBinding as s, assertManagedHandoffPath as t, readManagedHandoffRepairMetadata as u };
