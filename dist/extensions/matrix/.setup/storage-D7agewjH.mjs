import { t as getMatrixRuntime } from "./runtime-1kn1P6io.mjs";
import { n as isMatrixActiveTokenRootDirectory, r as resolveMatrixAccountStorageRoot } from "./storage-paths-B51JM-pC.mjs";
import { c as chunkMatrixStateJson, i as assertMatrixSupportedStateRoot, l as readMatrixStateChunks, o as resolveMatrixSqliteStateEnv, r as assertMatrixSupportedStateFile, u as writeMatrixStateChunks } from "./retired-state-BXUQ2I-C.mjs";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash, randomUUID } from "node:crypto";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
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
async function readMatrixIdbSnapshotJson(storageRootDir, stateRuntime = getMatrixRuntime().state) {
	const store = stateRuntime.openKeyedStore(openMatrixIdbSnapshotStoreOptions(storageRootDir));
	const meta = await store.lookup(idbMetaKey());
	if (!isIdbSnapshotMeta(meta)) return null;
	const chunks = await readMatrixStateChunks(store, Array.from({ length: meta.chunkCount }, (_, index) => idbChunkKey(meta.generation, index)), "snapshot-chunk");
	if (!chunks) return null;
	const snapshotJson = chunks.join("");
	return meta.digest === digestText(snapshotJson) ? snapshotJson : null;
}
async function hasMatrixIdbSnapshotState(storageRootDir) {
	return isIdbSnapshotMeta(await getMatrixRuntime().state.openKeyedStore(openMatrixIdbSnapshotStoreOptions(storageRootDir)).lookup(idbMetaKey()));
}
async function writeMatrixIdbSnapshotJson(params) {
	const store = (params.stateRuntime ?? getMatrixRuntime().state).openKeyedStore(openMatrixIdbSnapshotStoreOptions(params.storageRootDir));
	const rows = buildIdbSnapshotRows(params.snapshotJson, params.databaseCount);
	await writeMatrixStateChunks(store, rows, idbChunkKeyPrefix());
}
async function scoreMatrixCryptoStateInStore(storageRootDir) {
	if (!matrixCryptoStateDatabaseExists(storageRootDir)) return 0;
	let score = 0;
	try {
		const migration = await getMatrixRuntime().state.openKeyedStore(openMatrixLegacyCryptoMigrationStoreOptions(storageRootDir)).lookup(STATE_KEY);
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
function digestText(value) {
	return createHash("sha256").update(value, "utf8").digest("hex");
}
function isIdbSnapshotMeta(value) {
	return isRecord(value) && value.kind === "meta" && value.version === 1 && typeof value.generation === "string" && value.generation.trim() !== "" && typeof value.chunkCount === "number" && Number.isSafeInteger(value.chunkCount) && value.chunkCount >= 0 && value.chunkCount <= IDB_SNAPSHOT_MAX_CHUNKS && typeof value.digest === "string" && typeof value.databaseCount === "number" && Number.isSafeInteger(value.databaseCount) && value.databaseCount >= 0 && typeof value.persistedAt === "string";
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
	for (const field of [
		"homeserver",
		"userId",
		"accountId",
		"accessTokenHash",
		"deviceId",
		"createdAt"
	]) {
		const entry = value[field];
		if (typeof entry === "string" && entry.trim()) metadata[field] = entry.trim();
	}
	if (value.currentTokenStateClaimed === true) metadata.currentTokenStateClaimed = true;
	return Object.keys(metadata).length > 0 ? metadata : null;
}
//#endregion
//#region extensions/matrix/src/matrix/client/storage.ts
const DEFAULT_ACCOUNT_KEY = "default";
const STORAGE_META_FILENAME = "storage-meta.json";
function openStorageMetaStore(rootDir) {
	return getMatrixRuntime().state.openKeyedStore(openMatrixStorageMetaStoreOptions(rootDir));
}
async function scoreStorageRoot(rootDir, metadata) {
	let score = 0;
	if (Object.keys(metadata).length > 0) score += 1;
	if (metadata.currentTokenStateClaimed === true) score += 8;
	if (fs.existsSync(path.join(rootDir, "crypto"))) score += 8;
	score += await scoreMatrixCryptoStateInStore(rootDir);
	return score;
}
function resolveStorageRootMtimeMs(rootDir) {
	try {
		return fs.statSync(rootDir).mtimeMs;
	} catch {
		return 0;
	}
}
async function readStoredRootMetadata(rootDir) {
	await assertMatrixSupportedStateFile(path.join(rootDir, STORAGE_META_FILENAME));
	if (fs.existsSync(path.join(rootDir, "state", "openclaw.sqlite"))) try {
		const stored = normalizeMatrixStorageMetadata(await openStorageMetaStore(rootDir).lookup(STORAGE_META_STATE_KEY));
		if (stored) return stored;
	} catch {}
	return {};
}
function isCompatibleStorageRoot(params) {
	const { metadata } = params;
	if (metadata.homeserver && metadata.homeserver !== params.homeserver) return false;
	if (metadata.userId && metadata.userId !== params.userId) return false;
	if (metadata.accountId && normalizeAccountId(metadata.accountId) !== normalizeAccountId(params.accountKey)) return false;
	return metadata.deviceId?.trim() === params.deviceId.trim();
}
async function resolvePreferredMatrixStorageRoot(params) {
	const canonical = {
		rootDir: params.canonicalRootDir,
		tokenHash: params.canonicalTokenHash
	};
	const deviceId = params.deviceId?.trim();
	if (!deviceId) return canonical;
	const canonicalMetadata = await readStoredRootMetadata(params.canonicalRootDir);
	if (canonicalMetadata.accessTokenHash === params.canonicalTokenHash && canonicalMetadata.deviceId?.trim() === deviceId && canonicalMetadata.currentTokenStateClaimed === true) return canonical;
	const parentDir = path.dirname(params.canonicalRootDir);
	const bestCurrentScore = await scoreStorageRoot(params.canonicalRootDir, canonicalMetadata);
	const bestCurrentMtimeMs = resolveStorageRootMtimeMs(params.canonicalRootDir);
	let best = {
		rootDir: params.canonicalRootDir,
		tokenHash: params.canonicalTokenHash,
		score: bestCurrentScore,
		mtimeMs: bestCurrentMtimeMs
	};
	let siblingEntries;
	try {
		siblingEntries = fs.readdirSync(parentDir, { withFileTypes: true });
	} catch {
		return {
			rootDir: best.rootDir,
			tokenHash: best.tokenHash
		};
	}
	const compatiblePopulatedSiblings = [];
	const populatedTokenHashes = bestCurrentScore > 0 ? [params.canonicalTokenHash] : [];
	for (const entry of siblingEntries.toSorted((a, b) => a.name.localeCompare(b.name))) {
		if (!entry.isDirectory()) continue;
		if (entry.name === params.canonicalTokenHash) continue;
		if (!isMatrixActiveTokenRootDirectory(entry.name)) continue;
		const candidateRootDir = path.join(parentDir, entry.name);
		const metadata = await readStoredRootMetadata(candidateRootDir);
		if (!isCompatibleStorageRoot({
			metadata,
			homeserver: params.homeserver,
			userId: params.userId,
			accountKey: params.accountKey,
			deviceId
		})) continue;
		const candidateScore = await scoreStorageRoot(candidateRootDir, metadata);
		if (candidateScore <= 0) continue;
		populatedTokenHashes.push(entry.name);
		compatiblePopulatedSiblings.push({
			rootDir: candidateRootDir,
			tokenHash: entry.name,
			score: candidateScore,
			mtimeMs: resolveStorageRootMtimeMs(candidateRootDir)
		});
	}
	for (const candidate of compatiblePopulatedSiblings) if (candidate.score > best.score || best.rootDir !== params.canonicalRootDir && candidate.score === best.score && candidate.mtimeMs > best.mtimeMs) best = candidate;
	if (populatedTokenHashes.length > 1) getMatrixRuntime().logging.getChildLogger({ module: "matrix-storage" }).warn("matrix: multiple populated token-hash storage roots detected", {
		parentDir,
		canonicalTokenHash: params.canonicalTokenHash,
		selectedTokenHash: best.tokenHash,
		populatedTokenHashes,
		populatedSiblingTokenHashes: compatiblePopulatedSiblings.map((root) => root.tokenHash),
		populatedRootCount: populatedTokenHashes.length
	});
	return {
		rootDir: best.rootDir,
		tokenHash: best.tokenHash
	};
}
async function resolveMatrixStoragePaths(params) {
	const env = params.env ?? process.env;
	const stateDir = params.stateDir ?? getMatrixRuntime().state.resolveStateDir(env, os.homedir);
	const canonical = resolveMatrixAccountStorageRoot({
		stateDir,
		homeserver: params.homeserver,
		userId: params.userId,
		accessToken: params.accessToken,
		accountId: params.accountId
	});
	const { rootDir, tokenHash } = await resolvePreferredMatrixStorageRoot({
		canonicalRootDir: canonical.rootDir,
		canonicalTokenHash: canonical.tokenHash,
		homeserver: params.homeserver,
		userId: params.userId,
		accountKey: canonical.accountKey,
		deviceId: params.deviceId
	});
	return {
		rootDir,
		storagePath: path.join(rootDir, "bot-storage.json"),
		cryptoPath: path.join(rootDir, "crypto"),
		recoveryKeyPath: path.join(rootDir, MATRIX_RECOVERY_KEY_FILENAME),
		idbSnapshotPath: path.join(rootDir, MATRIX_IDB_SNAPSHOT_FILENAME),
		accountKey: canonical.accountKey,
		tokenHash
	};
}
async function resolveMatrixStateFilePath(params) {
	const storagePaths = await resolveMatrixStoragePaths({
		homeserver: params.auth.homeserver,
		userId: params.auth.userId,
		accessToken: params.auth.accessToken,
		accountId: params.accountId ?? params.auth.accountId,
		deviceId: params.auth.deviceId,
		env: params.env,
		stateDir: params.stateDir
	});
	return path.join(storagePaths.rootDir, params.filename);
}
async function maybeMigrateLegacyStorage({ storagePaths }) {
	const { rootDir, storagePath } = storagePaths;
	await assertMatrixSupportedStateRoot(rootDir);
	if (!fs.existsSync(storagePath)) return;
	const syncCache = await import("./sync-cache-state-C2z64uyk.mjs").then((n) => n.o);
	if (!await syncCache.readLegacyMatrixSyncCacheState(rootDir)) return;
	const logger = getMatrixRuntime().logging.getChildLogger({ module: "matrix-storage" });
	fs.mkdirSync(rootDir, { recursive: true });
	let migrated = false;
	try {
		const persisted = await syncCache.readLegacyMatrixSyncCacheState(rootDir);
		if (!persisted) return;
		const store = getMatrixRuntime().state.openKeyedStore(syncCache.openMatrixSyncCacheStoreOptions(rootDir));
		if (!await syncCache.hasMatrixSyncCacheStateInStore({
			storageRootDir: rootDir,
			store
		})) {
			await syncCache.writeMatrixSyncCacheStateToStore({
				storageRootDir: rootDir,
				payload: persisted,
				store
			});
			await claimCurrentTokenStorageState({ rootDir });
			migrated = true;
		}
	} catch (err) {
		throw new Error(`Failed migrating legacy Matrix client storage: ${String(err)}`, { cause: err });
	}
	const archivePath = `${storagePath}.migrated`;
	const skippedArchive = fs.existsSync(archivePath);
	if (!skippedArchive) fs.renameSync(storagePath, archivePath);
	if (migrated) logger.info(`matrix: migrated legacy client storage into ${rootDir}\n- account sync cache: ${storagePath} -> ${rootDir} SQLite sync cache`);
	if (skippedArchive) logger.warn?.(`matrix: legacy client storage files were left in place because their migrated targets already existed.
- account sync cache remains at ${storagePath} because ${archivePath} already exists`);
}
function prepareStorageMetaMutation(metadata, mutation) {
	if (mutation.kind !== "initialize" && !metadata.accessTokenHash?.trim()) return null;
	return normalizeMatrixStorageMetadata({
		...mutation.kind === "initialize" ? mutation.metadata : metadata,
		accountId: mutation.kind === "initialize" ? mutation.metadata.accountId : metadata.accountId ?? DEFAULT_ACCOUNT_KEY,
		deviceId: mutation.kind === "device" ? mutation.deviceId : mutation.kind === "initialize" ? mutation.metadata.deviceId ?? metadata.deviceId : metadata.deviceId,
		currentTokenStateClaimed: mutation.kind === "claim" || (mutation.kind === "initialize" ? mutation.metadata.currentTokenStateClaimed ?? metadata.currentTokenStateClaimed === true : metadata.currentTokenStateClaimed === true),
		createdAt: metadata.createdAt ?? (/* @__PURE__ */ new Date()).toISOString()
	});
}
async function mutateStorageMeta(rootDir, mutation) {
	await assertMatrixSupportedStateFile(path.join(rootDir, STORAGE_META_FILENAME));
	try {
		const store = openStorageMetaStore(rootDir);
		const decode = (value) => normalizeMatrixStorageMetadata(value) ?? {};
		if (!store.observe || !store.compareAndApply) {
			const legacyStore = getMatrixRuntime().state.openSyncKeyedStore(openMatrixStorageMetaStoreOptions(rootDir));
			const next = prepareStorageMetaMutation(decode(legacyStore.lookup(STORAGE_META_STATE_KEY)), mutation);
			if (!next) return false;
			legacyStore.register(STORAGE_META_STATE_KEY, next);
			return true;
		}
		let observation = await store.observe(STORAGE_META_STATE_KEY);
		for (;;) {
			const next = prepareStorageMetaMutation(decode(observation.value), mutation);
			if (!next) return false;
			const result = await store.compareAndApply(STORAGE_META_STATE_KEY, observation.comparison, {
				operation: "update",
				action: "set",
				value: next
			});
			if (result.status !== "conflict") return true;
			observation = result.current;
		}
	} catch {
		return false;
	}
}
async function writeStorageMeta(params) {
	return mutateStorageMeta(params.storagePaths.rootDir, {
		kind: "initialize",
		metadata: {
			homeserver: params.homeserver,
			userId: params.userId,
			accountId: params.accountId ?? DEFAULT_ACCOUNT_KEY,
			accessTokenHash: params.storagePaths.tokenHash,
			deviceId: params.deviceId ?? null,
			currentTokenStateClaimed: params.currentTokenStateClaimed
		}
	});
}
async function claimCurrentTokenStorageState(params) {
	return mutateStorageMeta(params.rootDir, { kind: "claim" });
}
async function recordCurrentStorageMetaDeviceId(params) {
	const rootDir = params.rootDir;
	const deviceId = params.deviceId.trim();
	if (!deviceId || !(await readStoredRootMetadata(rootDir)).accessTokenHash?.trim()) return false;
	return mutateStorageMeta(rootDir, {
		kind: "device",
		deviceId
	});
}
async function repairCurrentTokenStorageMetaDeviceId(params) {
	const { homeserver, userId, accessToken, accountId, deviceId, env, stateDir } = params;
	return writeStorageMeta({
		storagePaths: await resolveMatrixStoragePaths({
			homeserver,
			userId,
			accessToken,
			accountId,
			env,
			stateDir
		}),
		homeserver,
		userId,
		accountId,
		deviceId
	});
}
//#endregion
export { resolveMatrixStateFilePath as a, readMatrixIdbSnapshotJson as c, writeMatrixRecoveryKeyStateForPathAsync as d, repairCurrentTokenStorageMetaDeviceId as i, readMatrixRecoveryKeyStateForPathAsync as l, maybeMigrateLegacyStorage as n, resolveMatrixStoragePaths as o, recordCurrentStorageMetaDeviceId as r, writeStorageMeta as s, claimCurrentTokenStorageState as t, writeMatrixIdbSnapshotJson as u };
