import { n as __exportAll } from "./runtime-doctor-migrations-hxP-CXX7.mjs";
import { t as getMatrixRuntime } from "./runtime-1kn1P6io.mjs";
import { r as readMatrixIdbSnapshotJson, t as MATRIX_IDB_SNAPSHOT_FILENAME } from "./crypto-state-store-DclM-fO5.mjs";
import { t as walkMatrixStateFiles } from "./state-layout-walk-BQMgMykU.mjs";
import { i as withMatrixCryptoStoreRecoveryLock, n as isMatrixCryptoStoreUnsafe, r as sealMatrixCryptoStoreRecovery } from "./crypto-store-ownership-Dr-T40Rp.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { FILE_LOCK_TIMEOUT_ERROR_CODE } from "openclaw/plugin-sdk/file-lock";
//#region extensions/matrix/src/matrix/crypto-unsafe-state-doctor.ts
var crypto_unsafe_state_doctor_exports = /* @__PURE__ */ __exportAll({
	listMatrixCryptoUnsafeState: () => listMatrixCryptoUnsafeState,
	recoverMatrixCryptoUnsafeState: () => recoverMatrixCryptoUnsafeState
});
const MARKER_NAME = `${MATRIX_IDB_SNAPSHOT_FILENAME}.owner.poisoned`;
async function listMatrixCryptoUnsafeState(stateDir, stateRuntime) {
	const { entries, failedDirs } = await walkMatrixStateFiles(stateDir, (name, depth) => (depth === 0 || depth === 4) && name === MARKER_NAME || depth === 5 && name === "openclaw.sqlite", [0, 4]);
	if (failedDirs.length > 0) throw failedDirs[0].error;
	const roots = new Set(entries.map((entry) => path.basename(entry.path) === MARKER_NAME ? path.dirname(entry.path) : path.dirname(path.dirname(entry.path))));
	const abandoned = [];
	for (const root of roots) {
		const snapshotPath = path.join(root, MATRIX_IDB_SNAPSHOT_FILENAME);
		try {
			if (await withMatrixCryptoStoreRecoveryLock(snapshotPath, () => isMatrixCryptoStoreUnsafe(snapshotPath, stateRuntime ?? getMatrixRuntime().state))) abandoned.push(root);
		} catch (error) {
			if (error !== null && typeof error === "object" && "code" in error && error.code === FILE_LOCK_TIMEOUT_ERROR_CODE) continue;
			throw error;
		}
	}
	return abandoned.toSorted();
}
/** A valid snapshot is a rollback point, not proof that the failed owner's last keys were saved. */
async function recoverMatrixCryptoUnsafeState(params) {
	if (!params.acceptSnapshotRollback) throw new Error("Matrix crypto recovery requires explicit --accept-snapshot-rollback.");
	const snapshotPath = path.join(params.storageRootDir, MATRIX_IDB_SNAPSHOT_FILENAME);
	await withMatrixCryptoStoreRecoveryLock(snapshotPath, async () => {
		try {
			await fs.access(path.join(params.storageRootDir, "state", "openclaw.sqlite"));
		} catch (error) {
			if (error !== null && typeof error === "object" && "code" in error && error.code === "ENOENT") throw new Error("Matrix crypto SQLite snapshot is absent; refusal remains in place.", { cause: error });
			throw error;
		}
		const snapshot = await readMatrixIdbSnapshotJson(params.storageRootDir, getMatrixRuntime().state);
		if (!snapshot) throw new Error("Matrix crypto SQLite snapshot is absent or invalid; refusal remains in place.");
		const { validateMatrixIdbSnapshotJson } = await import("./idb-persistence-C2TsCHY2.mjs");
		try {
			await validateMatrixIdbSnapshotJson(snapshot);
		} catch (error) {
			throw new Error("Matrix crypto SQLite snapshot cannot be replayed; refusal remains in place.", { cause: error });
		}
		await sealMatrixCryptoStoreRecovery(snapshotPath, getMatrixRuntime().state);
	});
}
//#endregion
export { listMatrixCryptoUnsafeState as n, recoverMatrixCryptoUnsafeState as r, crypto_unsafe_state_doctor_exports as t };
