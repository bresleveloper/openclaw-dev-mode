import { t as getMatrixRuntime } from "./runtime-1kn1P6io.mjs";
import { i as readMatrixIdbSnapshotOwnerGeneration, s as sealMatrixIdbSnapshotOwnerGeneration } from "./crypto-state-store-DclM-fO5.mjs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { constants } from "node:fs";
import fs$1 from "node:fs/promises";
import { FILE_LOCK_STALE_ERROR_CODE, FILE_LOCK_TIMEOUT_ERROR_CODE, acquireFileLock } from "openclaw/plugin-sdk/file-lock";
import { syncDirectory } from "@openclaw/fs-safe/durability";
//#region extensions/matrix/src/matrix/sdk/crypto-store-ownership.ts
const MATRIX_CRYPTO_STORE_OWNER_ACTIVE_ERROR_CODE = "matrix_crypto_store_owner_active";
const GUARD_BYTES = 33;
var MatrixCryptoStoreOwnerActiveError = class extends Error {
	constructor(cause) {
		super("Timed out waiting for exclusive Matrix crypto state ownership", { cause });
		this.code = MATRIX_CRYPTO_STORE_OWNER_ACTIVE_ERROR_CODE;
		this.name = "MatrixCryptoStoreOwnerActiveError";
	}
};
const LOCK_OPTIONS = {
	retries: {
		retries: 0,
		factor: 1,
		minTimeout: 0,
		maxTimeout: 0
	},
	stale: 0,
	staleRecovery: "remove-if-definitely-stale"
};
function isContention(error) {
	return error !== null && typeof error === "object" && "code" in error && (error.code === FILE_LOCK_TIMEOUT_ERROR_CODE || error.code === FILE_LOCK_STALE_ERROR_CODE);
}
function filesystemErrorCode(error) {
	return error !== null && typeof error === "object" && "code" in error ? error.code : void 0;
}
function poisonPath(snapshotPath) {
	return `${snapshotPath}.owner.poisoned`;
}
/** Doctor-only lock: inspect and recover refusal state without entering crypto. */
async function withMatrixCryptoStoreRecoveryLock(snapshotPath, inspect) {
	const lock = await acquireFileLock(`${snapshotPath}.owner`, LOCK_OPTIONS);
	try {
		return await inspect(poisonPath(snapshotPath));
	} finally {
		await lock.release();
	}
}
async function syncParentDirectory(filePath) {
	try {
		await syncDirectory(path.dirname(filePath));
	} catch (error) {
		const code = filesystemErrorCode(error);
		if (process.platform !== "win32" || ![
			"EINVAL",
			"ENOTSUP",
			"ENOSYS",
			"EISDIR",
			"EPERM",
			"EACCES"
		].includes(String(code))) throw error;
	}
}
/** Null is a legacy/fresh store without a guard; empty means an invalid or old refusal marker. */
async function readOwnerGuard(snapshotPath) {
	const marker = poisonPath(snapshotPath);
	let stat;
	try {
		stat = await fs$1.lstat(marker);
	} catch (error) {
		if (filesystemErrorCode(error) === "ENOENT") return null;
		throw error;
	}
	if (!stat.isFile() || stat.isSymbolicLink()) throw new Error("Matrix crypto owner guard must be a regular file");
	if (stat.size !== GUARD_BYTES) return "";
	const file = await fs$1.open(marker, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
	try {
		const bytes = Buffer.alloc(GUARD_BYTES);
		const { bytesRead } = await file.read(bytes, 0, bytes.length, 0);
		const value = bytes.toString("utf8");
		return bytesRead === GUARD_BYTES && /^[a-f0-9]{32}\n$/.test(value) ? value.trimEnd() : "";
	} finally {
		await file.close();
	}
}
/** Flush the guard before Rust mutates state; retain its inode across clean generations. */
async function writeOwnerGuard(snapshotPath, generation, create, onChanged = () => {}) {
	const marker = poisonPath(snapshotPath);
	const flags = constants.O_RDWR | (constants.O_NOFOLLOW ?? 0) | (create ? constants.O_CREAT | constants.O_EXCL : 0);
	const file = await fs$1.open(marker, flags, 384);
	try {
		if (!(await file.stat()).isFile()) throw new Error("Matrix crypto owner guard must be a regular file");
		onChanged();
		await file.writeFile(`${generation}\n`, "ascii");
		await file.truncate(GUARD_BYTES);
		await file.sync();
	} finally {
		await file.close();
	}
	if (create) await syncParentDirectory(marker);
}
/** The caller holds custody. Snapshot checksum and schema validation remain the restore owner's job. */
async function isMatrixCryptoStoreUnsafe(snapshotPath, stateRuntime = getMatrixRuntime().state) {
	const guard = await readOwnerGuard(snapshotPath);
	if (guard === "") return true;
	const cleanGeneration = await readMatrixIdbSnapshotOwnerGeneration(path.dirname(snapshotPath), stateRuntime);
	return guard === null ? cleanGeneration !== void 0 : guard !== cleanGeneration;
}
/** Doctor has already validated the snapshot and obtained explicit rollback consent under custody. */
async function sealMatrixCryptoStoreRecovery(snapshotPath, stateRuntime = getMatrixRuntime().state) {
	const guard = await readOwnerGuard(snapshotPath);
	const generation = randomUUID().replaceAll("-", "");
	await writeOwnerGuard(snapshotPath, generation, guard === null);
	await sealMatrixIdbSnapshotOwnerGeneration(path.dirname(snapshotPath), generation, stateRuntime);
}
async function acquireMatrixCryptoStoreOwnership(snapshotPath, options = {}) {
	const stateRuntime = options.stateRuntime ?? getMatrixRuntime().state;
	let lock;
	options.signal?.throwIfAborted();
	try {
		lock = await acquireFileLock(`${snapshotPath}.owner`, {
			...LOCK_OPTIONS,
			retries: {
				retries: 25,
				factor: 1,
				minTimeout: 200,
				maxTimeout: 200
			}
		});
	} catch (error) {
		if (isContention(error)) throw new MatrixCryptoStoreOwnerActiveError(error);
		throw error;
	}
	let previousGuard;
	try {
		options.signal?.throwIfAborted();
		if (await isMatrixCryptoStoreUnsafe(snapshotPath, stateRuntime)) throw new Error("Matrix crypto state has an unresolved unsafe final state (discarded, failed, or lost save); refusing another owner. Preserve the account state and run \"openclaw matrix doctor inspect\". Recovery guidance: https://docs.openclaw.ai/channels/matrix/encryption");
		previousGuard = await readOwnerGuard(snapshotPath);
	} catch (error) {
		await lock.release();
		throw error;
	}
	const generation = randomUUID().replaceAll("-", "");
	let guardChanged = false;
	let armPromise;
	return {
		armUnsafeState: async () => {
			armPromise ??= writeOwnerGuard(snapshotPath, generation, previousGuard === null, () => {
				guardChanged = true;
			});
			await armPromise;
		},
		cancelUnsafeState: async () => {
			if (!guardChanged) return;
			if (previousGuard === null) {
				await fs$1.unlink(poisonPath(snapshotPath));
				await syncParentDirectory(poisonPath(snapshotPath));
			} else await writeOwnerGuard(snapshotPath, previousGuard, false);
			guardChanged = false;
			armPromise = void 0;
		},
		sealSafeState: async () => {
			if (!guardChanged) return;
			await armPromise;
			try {
				await sealMatrixIdbSnapshotOwnerGeneration(path.dirname(snapshotPath), generation, stateRuntime);
			} catch (error) {
				if (await readMatrixIdbSnapshotOwnerGeneration(path.dirname(snapshotPath), stateRuntime).catch(() => void 0) !== generation) throw error;
			}
			guardChanged = false;
		},
		release: () => lock.release()
	};
}
//#endregion
export { withMatrixCryptoStoreRecoveryLock as i, isMatrixCryptoStoreUnsafe as n, sealMatrixCryptoStoreRecovery as r, acquireMatrixCryptoStoreOwnership as t };
