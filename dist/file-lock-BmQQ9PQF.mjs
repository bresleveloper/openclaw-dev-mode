import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as getFileLockProcessStartTime } from "./pid-alive-CXdZEzr_.mjs";
import "./fs-safe-defaults-D3xd3zKO.mjs";
import { n as isLockOwnerDefinitelyStale, r as shouldRemoveDeadOwnerOrExpiredLock, t as inspectStaleLockOwner } from "./stale-lock-file-DDEYOm3C.mjs";
import fs from "node:fs/promises";
import { acquireFileLock, drainFileLockManagerForTest, resetFileLockManagerForTest } from "@openclaw/fs-safe/file-lock";
//#region src/plugin-sdk/file-lock.ts
/** Stable error code used when lock acquisition retries are exhausted. */
const FILE_LOCK_TIMEOUT_ERROR_CODE = "file_lock_timeout";
/** Stable error code used when stale lock recovery cannot proceed safely. */
const FILE_LOCK_STALE_ERROR_CODE = "file_lock_stale";
const FILE_LOCK_MANAGER_KEY = "openclaw.plugin-sdk.file-lock";
const STALE_FILE_LOCK_RECLAIM_MANAGER_KEY = "openclaw.plugin-sdk.stale-file-lock-reclaim";
let currentProcessStartTime;
function getCurrentProcessStartTime() {
	if (currentProcessStartTime === void 0) currentProcessStartTime = getFileLockProcessStartTime(process.pid);
	return currentProcessStartTime;
}
function createCurrentProcessLockPayload() {
	const payload = {
		pid: process.pid,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	const starttime = getCurrentProcessStartTime();
	if (starttime !== null) payload.starttime = starttime;
	return payload;
}
function asLockPayload(payload) {
	return asNullableRecord(payload);
}
function sameStatValue(left, right) {
	return typeof left === typeof right ? left === right : BigInt(left) === BigInt(right);
}
function sameFileIdentity(left, right) {
	if (!sameStatValue(left.ino, right.ino)) return false;
	if (sameStatValue(left.dev, right.dev)) return true;
	return process.platform === "win32" && (left.dev === 0 || left.dev === 0n || right.dev === 0 || right.dev === 0n);
}
async function isSameRegularFile(filePath, observed) {
	try {
		const current = await fs.lstat(filePath, { bigint: true });
		return current.isFile() && sameFileIdentity(current, observed);
	} catch {
		return false;
	}
}
function normalizeLockError(err, staleOwner = null) {
	if (err.code === "file_lock_timeout") throw Object.assign(new Error(err.message), {
		code: FILE_LOCK_TIMEOUT_ERROR_CODE,
		lockPath: err.lockPath ?? ""
	});
	if (err.code === "file_lock_stale") {
		const detail = staleOwner ? ` [${staleOwner.reason} pid=${staleOwner.pid} recorded-start=${staleOwner.recordedStarttime ?? "unknown"} observed-start=${staleOwner.observedStarttime ?? "unknown"}]` : "";
		throw Object.assign(/* @__PURE__ */ new Error(`${err.message}${detail}`), {
			code: FILE_LOCK_STALE_ERROR_CODE,
			lockPath: err.lockPath ?? ""
		});
	}
	throw err;
}
/** Reset process-local file-lock state for tests that isolate lock managers. */
function resetFileLockStateForTest() {
	resetFileLockManagerForTest(FILE_LOCK_MANAGER_KEY, FILE_LOCK_MANAGER_KEY);
}
/** Wait for process-local file-lock state to drain before test teardown. */
async function drainFileLockStateForTest() {
	await drainFileLockManagerForTest(FILE_LOCK_MANAGER_KEY, FILE_LOCK_MANAGER_KEY);
}
/** Acquire an owner-scoped process-local file lock backed by a `.lock` sidecar file. */
async function acquireFileLock$1(filePath, options) {
	options.assertResourceUnborrowed?.(filePath);
	const staleRecovery = options.staleRecovery ?? "remove-if-unchanged";
	let staleOwner = null;
	try {
		const lock = await acquireFileLock(filePath, {
			managerKey: FILE_LOCK_MANAGER_KEY,
			staleMs: options.stale,
			retry: options.retries,
			staleRecovery: staleRecovery === "remove-if-definitely-stale" ? "remove-if-unchanged" : staleRecovery,
			reentrantOwner: options.reentrantOwner,
			payload: () => {
				options.assertResourceUnborrowed?.(filePath);
				return createCurrentProcessLockPayload();
			},
			shouldReclaim: (params) => {
				if (staleRecovery === "fail-closed") {
					staleOwner = inspectStaleLockOwner({ payload: asLockPayload(params.payload) });
					return staleOwner !== null;
				}
				if (staleRecovery === "remove-if-definitely-stale") return isLockOwnerDefinitelyStale({ payload: asLockPayload(params.payload) });
				return shouldRemoveDeadOwnerOrExpiredLock({
					payload: asLockPayload(params.payload),
					staleMs: params.staleMs,
					nowMs: params.nowMs
				});
			},
			...staleRecovery === "remove-if-unchanged" || staleRecovery === "remove-if-definitely-stale" ? { shouldRemoveStaleLock: (snapshot) => {
				options.assertResourceUnborrowed?.(snapshot.normalizedTargetPath);
				if (staleRecovery === "remove-if-definitely-stale") return isLockOwnerDefinitelyStale({ payload: asLockPayload(snapshot.payload) });
				return shouldRemoveDeadOwnerOrExpiredLock({
					payload: asLockPayload(snapshot.payload),
					staleMs: options.stale
				});
			} } : {}
		});
		const targetPath = lock.lockPath.slice(0, -5);
		options.assertResourceUnborrowed?.(targetPath);
		return {
			lockPath: lock.lockPath,
			release: async () => {
				options.assertResourceUnborrowed?.(targetPath);
				await lock.release();
			}
		};
	} catch (err) {
		return normalizeLockError(err, staleOwner);
	}
}
/** Remove one definitely stale, unchanged regular lock sidecar; retain every ambiguous owner. */
async function reclaimDefinitelyStaleFileLock(lockPath) {
	let observed;
	try {
		observed = await fs.lstat(lockPath, { bigint: true });
	} catch (err) {
		if (err.code === "ENOENT") return "missing";
		throw err;
	}
	if (!observed.isFile()) return "retained";
	const ownerIsDefinitelyStale = async (payload) => await isSameRegularFile(lockPath, observed) && isLockOwnerDefinitelyStale({ payload: asLockPayload(payload) });
	const targetPath = lockPath.endsWith(".lock") ? lockPath.slice(0, -5) : lockPath;
	try {
		await (await acquireFileLock(targetPath, {
			managerKey: STALE_FILE_LOCK_RECLAIM_MANAGER_KEY,
			lockPath,
			staleMs: 0,
			retry: { retries: 0 },
			staleRecovery: "remove-if-unchanged",
			payload: createCurrentProcessLockPayload,
			shouldReclaim: ({ payload }) => ownerIsDefinitelyStale(payload),
			shouldRemoveStaleLock: ({ payload }) => ownerIsDefinitelyStale(payload)
		})).release();
		return "removed";
	} catch (err) {
		const code = err.code;
		if (code === "file_lock_timeout" || code === "file_lock_stale") return "retained";
		throw err;
	}
}
/** Run an async callback while holding a file lock, always releasing the lock afterward. */
async function withFileLock(filePath, options, fn) {
	const lock = await acquireFileLock$1(filePath, options);
	let outcome;
	try {
		outcome = { value: await fn() };
	} catch (error) {
		outcome = { error };
	}
	try {
		await lock.release();
	} catch (error) {
		if ("error" in outcome) throw new AggregateError([outcome.error, error], "File operation failed and lock release is unresolved", { cause: error });
		throw error;
	}
	if ("error" in outcome) throw outcome.error;
	return outcome.value;
}
//#endregion
export { reclaimDefinitelyStaleFileLock as a, drainFileLockStateForTest as i, FILE_LOCK_TIMEOUT_ERROR_CODE as n, resetFileLockStateForTest as o, acquireFileLock$1 as r, withFileLock as s, FILE_LOCK_STALE_ERROR_CODE as t };
