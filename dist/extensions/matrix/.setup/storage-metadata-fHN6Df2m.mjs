import { t as getMatrixRuntime } from "./runtime-1kn1P6io.mjs";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash, randomUUID } from "node:crypto";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
//#region extensions/matrix/src/matrix/sqlite-state.ts
function resolveStateDirOverride(options) {
	if (!options) return;
	if (options.stateDir) return options.stateDir;
	if (options.stateRootDir) return options.stateRootDir;
	return getMatrixRuntime().state.resolveStateDir(options.env ?? process.env, os.homedir);
}
function resolveMatrixSqliteStateKey(options) {
	return resolveStateDirOverride(options) ?? "";
}
function resolveMatrixSqliteStateEnv(options) {
	const stateDir = resolveStateDirOverride(options);
	if (!stateDir) return options?.env;
	return {
		...options?.env ?? process.env,
		OPENCLAW_STATE_DIR: stateDir
	};
}
//#endregion
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
const MATRIX_LEGACY_CRYPTO_MIGRATION_FILENAME = "legacy-crypto-migration.json";
const MATRIX_IDB_SNAPSHOT_FILENAME = "crypto-idb-snapshot.json";
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
	return normalizeMatrixStoredRecoveryKey(await stateRuntime.openKeyedStore(openMatrixRecoveryKeyStoreOptions(path.dirname(recoveryKeyPath))).lookup(resolveRecoveryKeyStateKeyForPath(recoveryKeyPath)));
}
async function writeMatrixRecoveryKeyStateForPathAsync(params) {
	const payload = normalizeMatrixStoredRecoveryKey(params.payload);
	if (!payload) throw new Error("Invalid Matrix recovery key state");
	if (params.preserveEncodedPrivateKey) {
		await updateMatrixRecoveryKeyState(params, (current) => normalizeMatrixStoredRecoveryKey({
			...payload,
			encodedPrivateKey: normalizeMatrixStoredRecoveryKey(current)?.encodedPrivateKey
		}) ?? void 0);
		return;
	}
	await params.stateRuntime.openKeyedStore(openMatrixRecoveryKeyStoreOptions(path.dirname(params.recoveryKeyPath))).register(resolveRecoveryKeyStateKeyForPath(params.recoveryKeyPath), payload);
}
async function updateMatrixRecoveryKeyState(params, update) {
	const store = params.stateRuntime.openKeyedStore(openMatrixRecoveryKeyStoreOptions(path.dirname(params.recoveryKeyPath)));
	const key = resolveRecoveryKeyStateKeyForPath(params.recoveryKeyPath);
	if (!store.observe || !store.compareAndApply) {
		if (!store.update) throw new Error("Matrix recovery key store does not support atomic updates");
		await store.update(key, update);
		return;
	}
	let observation = await store.observe(key);
	for (;;) {
		const value = update(observation.value);
		const result = await store.compareAndApply(key, observation.comparison, value === void 0 ? {
			operation: "update",
			action: "keep"
		} : {
			operation: "update",
			action: "set",
			value
		});
		if (result.status !== "conflict") return;
		observation = result.current;
	}
}
async function hasMatrixRecoveryKeyStateInStore(params) {
	return normalizeMatrixStoredRecoveryKey(await params.store.lookup(STATE_KEY)) !== null;
}
async function writeMatrixRecoveryKeyStateToStore(params) {
	const payload = normalizeMatrixStoredRecoveryKey(params.payload);
	if (!payload) throw new Error("Invalid Matrix recovery key state");
	await params.store.register(STATE_KEY, payload);
}
async function readMatrixLegacyCryptoMigrationState(storageRootDir) {
	return normalizeMatrixLegacyCryptoMigrationState(await getMatrixRuntime().state.openKeyedStore(openMatrixLegacyCryptoMigrationStoreOptions(storageRootDir)).lookup(STATE_KEY));
}
async function hasMatrixLegacyCryptoMigrationStateInStore(params) {
	return normalizeMatrixLegacyCryptoMigrationState(await params.store.lookup(STATE_KEY)) !== null;
}
async function writeMatrixLegacyCryptoMigrationStateToStore(params) {
	const state = normalizeMatrixLegacyCryptoMigrationState(params.state);
	if (!state) throw new Error("Invalid Matrix legacy crypto migration state");
	await params.store.register(STATE_KEY, state);
}
async function readMatrixIdbSnapshotJson(storageRootDir, stateRuntime = getMatrixRuntime().state) {
	return await readMatrixIdbSnapshotJsonFromStore({ store: stateRuntime.openKeyedStore(openMatrixIdbSnapshotStoreOptions(storageRootDir)) });
}
async function hasMatrixIdbSnapshotState(storageRootDir) {
	return isIdbSnapshotMeta(await getMatrixRuntime().state.openKeyedStore(openMatrixIdbSnapshotStoreOptions(storageRootDir)).lookup(idbMetaKey()));
}
async function writeMatrixIdbSnapshotJson(params) {
	await writeMatrixIdbSnapshotJsonToStore({
		snapshotJson: params.snapshotJson,
		databaseCount: params.databaseCount,
		store: (params.stateRuntime ?? getMatrixRuntime().state).openKeyedStore(openMatrixIdbSnapshotStoreOptions(params.storageRootDir))
	});
}
async function readMatrixIdbSnapshotJsonFromStore(params) {
	return await readIdbSnapshotJsonFromAsyncStore(params.store);
}
async function writeMatrixIdbSnapshotJsonToStore(params) {
	const rows = buildIdbSnapshotRows(params.snapshotJson, params.databaseCount);
	for (const row of rows.chunks) await params.store.register(row.key, row.value);
	await params.store.register(rows.meta.key, rows.meta.value);
	for (const row of await params.store.entries()) if (row.key.startsWith(idbChunkKeyPrefix()) && !rows.nextChunkKeys.has(row.key)) await params.store.delete(row.key);
}
async function migrateLegacyMatrixRecoveryKeyFilePathToStoreAsync(recoveryKeyPath, stateRuntime) {
	const legacy = readLegacyMatrixRecoveryKeyFile(recoveryKeyPath);
	if (legacy) await updateMatrixRecoveryKeyState({
		recoveryKeyPath,
		stateRuntime
	}, (current) => normalizeMatrixStoredRecoveryKey(current) ? void 0 : legacy);
	else await readMatrixRecoveryKeyStateForPathAsync(recoveryKeyPath, stateRuntime);
	return archiveLegacyStateFileIfPossible(recoveryKeyPath);
}
async function migrateLegacyMatrixLegacyCryptoMigrationFileToStore(storageRootDir) {
	const options = openMatrixLegacyCryptoMigrationStoreOptions(storageRootDir);
	const store = getMatrixRuntime().state.openKeyedStore(options);
	const legacy = readLegacyMatrixLegacyCryptoMigrationState(storageRootDir);
	if (!legacy) await store.lookup(STATE_KEY);
	else if (!store.observe || !store.compareAndApply) {
		const legacyStore = openSyncStore(options);
		if (!normalizeMatrixLegacyCryptoMigrationState(legacyStore.lookup(STATE_KEY))) legacyStore.register(STATE_KEY, legacy);
	} else {
		let observation = await store.observe(STATE_KEY);
		for (;;) {
			if (normalizeMatrixLegacyCryptoMigrationState(observation.value)) break;
			const result = await store.compareAndApply(STATE_KEY, observation.comparison, {
				operation: "update",
				action: "set",
				value: legacy
			});
			if (result.status !== "conflict") break;
			observation = result.current;
		}
	}
	return archiveLegacyStateFileIfPossible(path.join(storageRootDir, MATRIX_LEGACY_CRYPTO_MIGRATION_FILENAME));
}
function readLegacyMatrixRecoveryKeyState(storageRootDir) {
	return readLegacyMatrixRecoveryKeyFile(path.join(storageRootDir, MATRIX_RECOVERY_KEY_FILENAME));
}
function readLegacyMatrixRecoveryKeyFile(filePath) {
	return readJsonFileSync(filePath, normalizeMatrixStoredRecoveryKey);
}
function readLegacyMatrixLegacyCryptoMigrationState(storageRootDir) {
	return readJsonFileSync(path.join(storageRootDir, MATRIX_LEGACY_CRYPTO_MIGRATION_FILENAME), normalizeMatrixLegacyCryptoMigrationState);
}
async function scoreMatrixCryptoStateInStore(storageRootDir) {
	if (!matrixCryptoStateDatabaseExists(storageRootDir)) return 0;
	let score = 0;
	try {
		if (await readMatrixLegacyCryptoMigrationState(storageRootDir)) score += 3;
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
function normalizeMatrixLegacyCryptoMigrationState(value) {
	if (!isRecord(value) || value.version !== 1 || typeof value.accountId !== "string") return null;
	if (value.restoreStatus !== "pending" && value.restoreStatus !== "completed" && value.restoreStatus !== "manual-action-required") return null;
	const roomKeyCounts = isRecord(value.roomKeyCounts) && typeof value.roomKeyCounts.total === "number" && typeof value.roomKeyCounts.backedUp === "number" ? {
		total: value.roomKeyCounts.total,
		backedUp: value.roomKeyCounts.backedUp
	} : null;
	return {
		version: 1,
		...value.source === "matrix-bot-sdk-rust" ? { source: value.source } : {},
		accountId: value.accountId,
		...typeof value.deviceId === "string" || value.deviceId === null ? { deviceId: value.deviceId } : {},
		roomKeyCounts,
		...typeof value.backupVersion === "string" || value.backupVersion === null ? { backupVersion: value.backupVersion } : {},
		...typeof value.decryptionKeyImported === "boolean" ? { decryptionKeyImported: value.decryptionKeyImported } : {},
		restoreStatus: value.restoreStatus,
		...typeof value.detectedAt === "string" ? { detectedAt: value.detectedAt } : {},
		...typeof value.restoredAt === "string" ? { restoredAt: value.restoredAt } : {},
		...typeof value.importedCount === "number" ? { importedCount: value.importedCount } : {},
		...typeof value.totalCount === "number" ? { totalCount: value.totalCount } : {},
		...typeof value.lastError === "string" || value.lastError === null ? { lastError: value.lastError } : {}
	};
}
function openSyncStore(options) {
	return getMatrixRuntime().state.openSyncKeyedStore(options);
}
function readJsonFileSync(filePath, normalize) {
	try {
		return normalize(JSON.parse(fs.readFileSync(filePath, "utf8")));
	} catch {
		return null;
	}
}
function archiveLegacyStateFileIfPossible(filePath) {
	if (!fs.existsSync(filePath)) return false;
	const archivedPath = `${filePath}.migrated`;
	if (fs.existsSync(archivedPath)) return false;
	fs.renameSync(filePath, archivedPath);
	return true;
}
async function readIdbSnapshotJsonFromAsyncStore(store) {
	const meta = await store.lookup(idbMetaKey());
	if (!isIdbSnapshotMeta(meta)) return null;
	const chunks = await readIdbSnapshotChunksAsync(meta, store);
	return chunks ? chunks.join("") : null;
}
async function readIdbSnapshotChunksAsync(meta, store) {
	const records = await store.lookupMany?.(Array.from({ length: meta.chunkCount }, (_, index) => idbChunkKey(meta.generation, index)));
	const chunks = [];
	for (let index = 0; index < meta.chunkCount; index += 1) {
		const result = records?.[index];
		if (result && !result.ok) throw result.error;
		const chunk = records ? result?.value : await store.lookup(idbChunkKey(meta.generation, index));
		if (!isIdbSnapshotChunk(chunk) || chunk.index !== index) return null;
		chunks.push(chunk.data);
	}
	const snapshotJson = chunks.join("");
	if (meta.digest !== digestText(snapshotJson)) return null;
	return chunks;
}
function buildIdbSnapshotRows(snapshotJson, databaseCount) {
	const generation = randomUUID().replaceAll("-", "");
	const chunks = chunkText(snapshotJson).map((data, index) => ({
		key: idbChunkKey(generation, index),
		value: {
			kind: "snapshot-chunk",
			index,
			data
		}
	}));
	return {
		chunks,
		nextChunkKeys: new Set(chunks.map((chunk) => chunk.key)),
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
function chunkText(value) {
	const chunks = [];
	let current = "";
	let currentBytes = 0;
	for (const char of value) {
		const charBytes = Buffer.byteLength(char, "utf8");
		if (current && currentBytes + charBytes > IDB_SNAPSHOT_CHUNK_BYTES) {
			pushChunk(chunks, current);
			current = "";
			currentBytes = 0;
		}
		current += char;
		currentBytes += charBytes;
	}
	if (current) pushChunk(chunks, current);
	return chunks;
}
function pushChunk(chunks, chunk) {
	if (chunks.length >= IDB_SNAPSHOT_MAX_CHUNKS) throw new Error("Matrix IndexedDB snapshot exceeds SQLite chunk limit");
	chunks.push(chunk);
}
function digestText(value) {
	return createHash("sha256").update(value, "utf8").digest("hex");
}
function isIdbSnapshotMeta(value) {
	return isRecord(value) && value.kind === "meta" && value.version === 1 && typeof value.generation === "string" && value.generation.trim() !== "" && typeof value.chunkCount === "number" && Number.isSafeInteger(value.chunkCount) && value.chunkCount >= 0 && value.chunkCount <= IDB_SNAPSHOT_MAX_CHUNKS && typeof value.digest === "string" && typeof value.databaseCount === "number" && Number.isSafeInteger(value.databaseCount) && value.databaseCount >= 0 && typeof value.persistedAt === "string";
}
function isIdbSnapshotChunk(value) {
	return isRecord(value) && value.kind === "snapshot-chunk" && typeof value.index === "number" && Number.isSafeInteger(value.index) && value.index >= 0 && typeof value.data === "string";
}
//#endregion
//#region extensions/matrix/src/matrix/client/storage-metadata.ts
const STORAGE_META_NAMESPACE = "storage-meta";
const STORAGE_META_STATE_KEY = "current";
const STORAGE_META_MAX_ENTRIES = 10;
function openMatrixStorageMetaStoreOptions(storageRootDir) {
	return {
		namespace: STORAGE_META_NAMESPACE,
		maxEntries: STORAGE_META_MAX_ENTRIES,
		env: resolveMatrixSqliteStateEnv({ stateDir: storageRootDir })
	};
}
function normalizeMatrixStorageMetadata(value) {
	if (!isRecord(value)) return null;
	const metadata = {};
	if (typeof value.homeserver === "string" && value.homeserver.trim()) metadata.homeserver = value.homeserver.trim();
	if (typeof value.userId === "string" && value.userId.trim()) metadata.userId = value.userId.trim();
	if (typeof value.accountId === "string" && value.accountId.trim()) metadata.accountId = value.accountId.trim();
	if (typeof value.accessTokenHash === "string" && value.accessTokenHash.trim()) metadata.accessTokenHash = value.accessTokenHash.trim();
	if (typeof value.deviceId === "string" && value.deviceId.trim()) metadata.deviceId = value.deviceId.trim();
	if (value.currentTokenStateClaimed === true) metadata.currentTokenStateClaimed = true;
	if (typeof value.createdAt === "string" && value.createdAt.trim()) metadata.createdAt = value.createdAt.trim();
	return Object.keys(metadata).length > 0 ? metadata : null;
}
async function hasMatrixStorageMetaStateInStore(params) {
	return normalizeMatrixStorageMetadata(await params.store.lookup(STORAGE_META_STATE_KEY)) !== null;
}
async function writeMatrixStorageMetaStateToStore(params) {
	await params.store.register(STORAGE_META_STATE_KEY, params.payload);
}
//#endregion
export { writeMatrixIdbSnapshotJson as C, writeMatrixRecoveryKeyStateToStore as D, writeMatrixRecoveryKeyStateForPathAsync as E, resolveMatrixSqliteStateEnv as O, scoreMatrixCryptoStateInStore as S, writeMatrixLegacyCryptoMigrationStateToStore as T, readLegacyMatrixRecoveryKeyFile as _, writeMatrixStorageMetaStateToStore as a, readMatrixIdbSnapshotJsonFromStore as b, MATRIX_RECOVERY_KEY_FILENAME as c, migrateLegacyMatrixLegacyCryptoMigrationFileToStore as d, migrateLegacyMatrixRecoveryKeyFilePathToStoreAsync as f, readLegacyMatrixLegacyCryptoMigrationState as g, openMatrixRecoveryKeyStoreOptions as h, openMatrixStorageMetaStoreOptions as i, resolveMatrixSqliteStateKey as k, hasMatrixLegacyCryptoMigrationStateInStore as l, openMatrixLegacyCryptoMigrationStoreOptions as m, hasMatrixStorageMetaStateInStore as n, MATRIX_IDB_SNAPSHOT_FILENAME as o, openMatrixIdbSnapshotStoreOptions as p, normalizeMatrixStorageMetadata as r, MATRIX_LEGACY_CRYPTO_MIGRATION_FILENAME as s, STORAGE_META_STATE_KEY as t, hasMatrixRecoveryKeyStateInStore as u, readLegacyMatrixRecoveryKeyState as v, writeMatrixIdbSnapshotJsonToStore as w, readMatrixRecoveryKeyStateForPathAsync as x, readMatrixIdbSnapshotJson as y };
