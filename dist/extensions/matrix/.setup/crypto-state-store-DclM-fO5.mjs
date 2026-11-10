import { t as getMatrixRuntime } from "./runtime-1kn1P6io.mjs";
import { c as writeMatrixStateChunks, o as chunkMatrixStateJson, s as readMatrixStateChunks } from "./retired-state-C4UnLIg4.mjs";
import { r as updateMatrixKeyedState, t as resolveMatrixSqliteStateEnv } from "./sqlite-state-LByPx4Yp.mjs";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash, randomUUID } from "node:crypto";
import path from "node:path";
import { asSafeIntegerInRange } from "openclaw/plugin-sdk/number-runtime";
import fs from "node:fs";
//#region extensions/matrix/src/matrix/crypto-state-store.ts
const STATE_KEY = "current";
const RECOVERY_KEY_NAMESPACE = "recovery-key";
const LEGACY_CRYPTO_MIGRATION_NAMESPACE = "legacy-crypto-migration";
const IDB_SNAPSHOT_NAMESPACE = "idb-snapshot";
const SMALL_STATE_MAX_ENTRIES = 10;
const IDB_SNAPSHOT_MAX_ENTRIES = 2e4;
const IDB_SNAPSHOT_MAX_CHUNKS = Math.floor(19999 / 2);
const IDB_SNAPSHOT_CHUNK_BYTES = 24e3;
const MATRIX_RECOVERY_KEY_FILENAME = "recovery-key.json";
const MATRIX_IDB_SNAPSHOT_FILENAME = "crypto-idb-snapshot.json";
var MatrixIdbSnapshotInvalidError = class extends Error {
	constructor(reason) {
		super(`Invalid Matrix crypto SQLite snapshot (${reason}); preserve the account state and restore a valid backup before retrying.`);
		this.code = "matrix-idb-snapshot-invalid";
		this.name = "MatrixIdbSnapshotInvalidError";
	}
};
function openMatrixRecoveryKeyStoreOptions(storageRootDir) {
	return {
		namespace: RECOVERY_KEY_NAMESPACE,
		maxEntries: SMALL_STATE_MAX_ENTRIES,
		env: resolveMatrixSqliteStateEnv({ stateDir: storageRootDir })
	};
}
function openMatrixLegacyCryptoMigrationStoreOptions(storageRootDir) {
	return {
		namespace: LEGACY_CRYPTO_MIGRATION_NAMESPACE,
		maxEntries: SMALL_STATE_MAX_ENTRIES,
		env: resolveMatrixSqliteStateEnv({ stateDir: storageRootDir })
	};
}
function openMatrixIdbSnapshotStoreOptions(storageRootDir) {
	return {
		namespace: IDB_SNAPSHOT_NAMESPACE,
		maxEntries: IDB_SNAPSHOT_MAX_ENTRIES,
		env: resolveMatrixSqliteStateEnv({ stateDir: storageRootDir })
	};
}
async function readMatrixRecoveryKeyStateForPathAsync(recoveryKeyPath, stateRuntime) {
	return normalizeMatrixStoredRecoveryKey(await stateRuntime.openKeyedStoreV2(openMatrixRecoveryKeyStoreOptions(path.dirname(recoveryKeyPath))).lookup(resolveRecoveryKeyStateKeyForPath(recoveryKeyPath)));
}
async function writeMatrixRecoveryKeyStateForPathAsync(params) {
	const payload = normalizeMatrixStoredRecoveryKey(params.payload);
	if (!payload) throw new Error("Invalid Matrix recovery key state");
	const store = params.stateRuntime.openKeyedStoreV2(openMatrixRecoveryKeyStoreOptions(path.dirname(params.recoveryKeyPath)));
	const key = resolveRecoveryKeyStateKeyForPath(params.recoveryKeyPath);
	if (params.preserveEncodedPrivateKey) {
		const update = (current) => normalizeMatrixStoredRecoveryKey({
			...payload,
			encodedPrivateKey: normalizeMatrixStoredRecoveryKey(current)?.encodedPrivateKey
		}) ?? void 0;
		await updateMatrixKeyedState(store, key, update);
		return;
	}
	await store.register(key, payload);
}
async function readMatrixIdbSnapshotJson(storageRootDir, stateRuntime = getMatrixRuntime().state) {
	const store = stateRuntime.openKeyedStoreV2(openMatrixIdbSnapshotStoreOptions(storageRootDir));
	const meta = await store.lookup(idbMetaKey());
	if (meta === void 0) {
		if ((await store.entries()).length !== 0) throw new MatrixIdbSnapshotInvalidError("metadata is missing");
		return null;
	}
	if (!isIdbSnapshotMeta(meta)) throw new MatrixIdbSnapshotInvalidError("metadata is malformed");
	const chunks = await readMatrixStateChunks(store, Array.from({ length: meta.chunkCount }, (_, index) => idbChunkKey(meta.generation, index)), "snapshot-chunk");
	if (!chunks) throw new MatrixIdbSnapshotInvalidError("snapshot chunks are missing or malformed");
	const snapshotJson = chunks.join("");
	if (meta.digest !== digestText(snapshotJson)) throw new MatrixIdbSnapshotInvalidError("checksum mismatch");
	return snapshotJson;
}
async function readMatrixIdbSnapshotOwnerGeneration(storageRootDir, stateRuntime = getMatrixRuntime().state) {
	const meta = await stateRuntime.openKeyedStoreV2(openMatrixIdbSnapshotStoreOptions(storageRootDir)).lookup(idbMetaKey());
	if (meta === void 0) return;
	if (!isIdbSnapshotMeta(meta)) throw new MatrixIdbSnapshotInvalidError("metadata is malformed");
	return meta.cleanOwnerGeneration;
}
/** Publish last, after the final snapshot and clean sync cursor have settled. */
async function sealMatrixIdbSnapshotOwnerGeneration(storageRootDir, generation, stateRuntime = getMatrixRuntime().state) {
	const store = stateRuntime.openKeyedStoreV2(openMatrixIdbSnapshotStoreOptions(storageRootDir));
	const meta = await store.lookup(idbMetaKey());
	if (!isIdbSnapshotMeta(meta)) throw new MatrixIdbSnapshotInvalidError("final metadata is missing or malformed");
	await store.register(idbMetaKey(), {
		...meta,
		cleanOwnerGeneration: generation
	});
}
async function hasMatrixIdbSnapshotState(storageRootDir) {
	return isIdbSnapshotMeta(await getMatrixRuntime().state.openKeyedStoreV2(openMatrixIdbSnapshotStoreOptions(storageRootDir)).lookup(idbMetaKey()));
}
async function writeMatrixIdbSnapshotJson(params) {
	const store = (params.stateRuntime ?? getMatrixRuntime().state).openKeyedStoreV2(openMatrixIdbSnapshotStoreOptions(params.storageRootDir));
	const rows = buildIdbSnapshotRows(params.snapshotJson, params.databaseCount);
	await writeMatrixStateChunks(store, rows, idbChunkKeyPrefix());
}
async function scoreMatrixCryptoStateInStore(storageRootDir) {
	if (!matrixCryptoStateDatabaseExists(storageRootDir)) return 0;
	let score = 0;
	try {
		const migration = await getMatrixRuntime().state.openKeyedStoreV2(openMatrixLegacyCryptoMigrationStoreOptions(storageRootDir)).lookup(STATE_KEY);
		if (isRecord(migration) && migration.version === 1 && typeof migration.accountId === "string" && (migration.restoreStatus === "pending" || migration.restoreStatus === "completed" || migration.restoreStatus === "manual-action-required")) score += 3;
	} catch {}
	try {
		if (await readMatrixRecoveryKeyStateForPathAsync(path.join(storageRootDir, "recovery-key.json"), getMatrixRuntime().state)) score += 2;
	} catch {}
	try {
		if (await hasMatrixIdbSnapshotState(storageRootDir)) score += 2;
	} catch {}
	return score;
}
function matrixCryptoStateDatabaseExists(storageRootDir) {
	return fs.existsSync(path.join(storageRootDir, "state", "openclaw.sqlite"));
}
function resolveRecoveryKeyStateKeyForPath(recoveryKeyPath) {
	const basename = path.basename(recoveryKeyPath);
	if (basename === "recovery-key.json") return STATE_KEY;
	return `file:${createHash("sha256").update(basename, "utf8").digest("hex").slice(0, 32)}`;
}
function normalizeMatrixStoredRecoveryKey(value) {
	if (!isRecord(value) || value.version !== 1 || typeof value.createdAt !== "string" || typeof value.privateKeyBase64 !== "string" || !value.privateKeyBase64.trim()) return null;
	return {
		version: 1,
		createdAt: value.createdAt,
		keyId: typeof value.keyId === "string" ? value.keyId : null,
		...typeof value.encodedPrivateKey === "string" ? { encodedPrivateKey: value.encodedPrivateKey } : {},
		privateKeyBase64: value.privateKeyBase64,
		...isRecord(value.keyInfo) ? { keyInfo: {
			...value.keyInfo.passphrase !== void 0 ? { passphrase: value.keyInfo.passphrase } : {},
			...typeof value.keyInfo.name === "string" ? { name: value.keyInfo.name } : {}
		} } : {}
	};
}
function buildIdbSnapshotRows(snapshotJson, databaseCount) {
	const generation = randomUUID().replaceAll("-", "");
	const chunks = chunkMatrixStateJson(snapshotJson, IDB_SNAPSHOT_CHUNK_BYTES, IDB_SNAPSHOT_MAX_CHUNKS, "Matrix IndexedDB snapshot exceeds SQLite chunk limit").map((data, index) => ({
		key: idbChunkKey(generation, index),
		value: {
			kind: "snapshot-chunk",
			index,
			data
		}
	}));
	return {
		chunks,
		meta: {
			key: idbMetaKey(),
			value: {
				kind: "meta",
				version: 1,
				generation,
				chunkCount: chunks.length,
				digest: digestText(snapshotJson),
				databaseCount,
				persistedAt: (/* @__PURE__ */ new Date()).toISOString()
			}
		}
	};
}
function idbMetaKey() {
	return `${STATE_KEY}:meta`;
}
function idbChunkKeyPrefix() {
	return `${STATE_KEY}:snapshot:`;
}
function idbChunkKey(generation, index) {
	return `${idbChunkKeyPrefix()}${generation}:${index}`;
}
function digestText(value) {
	return createHash("sha256").update(value, "utf8").digest("hex");
}
function isIdbSnapshotMeta(value) {
	return isRecord(value) && value.kind === "meta" && value.version === 1 && typeof value.generation === "string" && value.generation.trim() !== "" && asSafeIntegerInRange(value.chunkCount, {
		min: 0,
		max: IDB_SNAPSHOT_MAX_CHUNKS
	}) !== void 0 && typeof value.digest === "string" && asSafeIntegerInRange(value.databaseCount, { min: 0 }) !== void 0 && typeof value.persistedAt === "string" && (value.cleanOwnerGeneration === void 0 || typeof value.cleanOwnerGeneration === "string" && /^[a-f0-9]{32}$/.test(value.cleanOwnerGeneration));
}
//#endregion
export { readMatrixRecoveryKeyStateForPathAsync as a, writeMatrixIdbSnapshotJson as c, readMatrixIdbSnapshotOwnerGeneration as i, writeMatrixRecoveryKeyStateForPathAsync as l, MATRIX_RECOVERY_KEY_FILENAME as n, scoreMatrixCryptoStateInStore as o, readMatrixIdbSnapshotJson as r, sealMatrixIdbSnapshotOwnerGeneration as s, MATRIX_IDB_SNAPSHOT_FILENAME as t };
