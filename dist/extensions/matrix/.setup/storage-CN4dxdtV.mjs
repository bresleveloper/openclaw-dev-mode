import { t as getMatrixRuntime } from "./runtime-1kn1P6io.mjs";
import { n as isMatrixActiveTokenRootDirectory, r as resolveMatrixAccountStorageRoot } from "./storage-paths-B51JM-pC.mjs";
import { i as assertMatrixSupportedStateRoot, r as assertMatrixSupportedStateFile } from "./retired-state-C4UnLIg4.mjs";
import { r as updateMatrixKeyedState, t as resolveMatrixSqliteStateEnv } from "./sqlite-state-LByPx4Yp.mjs";
import { n as MATRIX_RECOVERY_KEY_FILENAME, o as scoreMatrixCryptoStateInStore, t as MATRIX_IDB_SNAPSHOT_FILENAME } from "./crypto-state-store-DclM-fO5.mjs";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
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
	return getMatrixRuntime().state.openKeyedStoreV2(openMatrixStorageMetaStoreOptions(rootDir));
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
	const populatedSiblingTokenHashes = [];
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
		populatedSiblingTokenHashes.push(entry.name);
		const candidate = {
			rootDir: candidateRootDir,
			tokenHash: entry.name,
			score: candidateScore,
			mtimeMs: resolveStorageRootMtimeMs(candidateRootDir)
		};
		if (candidate.score > best.score || best.rootDir !== params.canonicalRootDir && candidate.score === best.score && candidate.mtimeMs > best.mtimeMs) best = candidate;
	}
	if (populatedTokenHashes.length > 1) getMatrixRuntime().logging.getChildLogger({ module: "matrix-storage" }).warn("matrix: multiple populated token-hash storage roots detected", {
		parentDir,
		canonicalTokenHash: params.canonicalTokenHash,
		selectedTokenHash: best.tokenHash,
		populatedTokenHashes,
		populatedSiblingTokenHashes,
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
	const syncCache = await import("./sync-cache-state-L1kwjhjj.mjs").then((n) => n.o);
	const { Utf8InputError } = await import("./runtime-doctor-migrations-hxP-CXX7.mjs").then((n) => n.t);
	const logger = getMatrixRuntime().logging.getChildLogger({ module: "matrix-storage" });
	let persisted;
	try {
		persisted = await syncCache.readLegacyMatrixSyncCacheState(rootDir);
	} catch (error) {
		if (!(error instanceof Utf8InputError)) throw error;
		logger.warn?.(`${error.message} Legacy Matrix sync cache left in place: ${storagePath}`);
		return;
	}
	if (!persisted) return;
	fs.mkdirSync(rootDir, { recursive: true });
	let migrated = false;
	try {
		const store = getMatrixRuntime().state.openKeyedStoreV2(syncCache.openMatrixSyncCacheStoreOptions(rootDir));
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
		return await updateMatrixKeyedState(store, STORAGE_META_STATE_KEY, (current) => prepareStorageMetaMutation(decode(current), mutation) ?? void 0, "skip");
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
export { resolveMatrixStateFilePath as a, repairCurrentTokenStorageMetaDeviceId as i, maybeMigrateLegacyStorage as n, resolveMatrixStoragePaths as o, recordCurrentStorageMetaDeviceId as r, writeStorageMeta as s, claimCurrentTokenStorageState as t };
