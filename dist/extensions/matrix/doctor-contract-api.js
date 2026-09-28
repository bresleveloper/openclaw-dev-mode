import { i as normalizeMatrixStoredCredentials, n as isMatrixCredentialRevocation, r as matrixCredentialsStoreKey, t as MATRIX_CREDENTIALS_NAMESPACE } from "./.setup/credentials-state-B3cuUFwZ.mjs";
import { c as resolveMatrixStateLayoutChildDepth, i as resolveMatrixCredentialsDir } from "./.setup/storage-paths-DVCANXTc.mjs";
import { n as normalizeCompatibilityConfig, t as legacyConfigRules } from "./.setup/doctor-contract-HyWFZQVG.mjs";
import { D as writeMatrixRecoveryKeyStateToStore, O as resolveMatrixSqliteStateEnv, T as writeMatrixLegacyCryptoMigrationStateToStore, a as writeMatrixStorageMetaStateToStore, c as MATRIX_RECOVERY_KEY_FILENAME, g as readLegacyMatrixLegacyCryptoMigrationState, h as openMatrixRecoveryKeyStoreOptions, i as openMatrixStorageMetaStoreOptions, l as hasMatrixLegacyCryptoMigrationStateInStore, m as openMatrixLegacyCryptoMigrationStoreOptions, n as hasMatrixStorageMetaStateInStore, o as MATRIX_IDB_SNAPSHOT_FILENAME, r as normalizeMatrixStorageMetadata, s as MATRIX_LEGACY_CRYPTO_MIGRATION_FILENAME, u as hasMatrixRecoveryKeyStateInStore, v as readLegacyMatrixRecoveryKeyState } from "./.setup/storage-metadata-fHN6Df2m.mjs";
import { a as readLegacyMatrixSyncCacheState, c as writeMatrixSyncCacheStateToStore, i as openMatrixSyncCacheStoreOptions, r as hasMatrixSyncCacheStateInStore } from "./.setup/sync-cache-state-BMtGMxU1.mjs";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { createHash } from "node:crypto";
import path from "node:path";
import { archiveLegacyStateSource } from "openclaw/plugin-sdk/runtime-doctor-migrations";
import fs from "node:fs/promises";
//#region extensions/matrix/src/matrix/account-state-schema-doctor.ts
const STATE_DATABASE_FILENAME = "openclaw.sqlite";
async function collectMatrixAccountStateRoots(stateDir) {
	const matrixRoot = path.join(stateDir, "matrix");
	const roots = /* @__PURE__ */ new Set();
	async function visit(dir, depth, allowMissing = false) {
		let entries;
		try {
			entries = await fs.readdir(dir, { withFileTypes: true });
		} catch (error) {
			if (allowMissing && typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") return;
			throw error;
		}
		for (const entry of entries) {
			const entryPath = path.join(dir, entry.name);
			if (entry.isFile() && depth === 5 && entry.name === STATE_DATABASE_FILENAME) {
				roots.add(path.dirname(dir));
				continue;
			}
			if (!entry.isDirectory()) continue;
			if ((depth === 2 || depth === 4) && entry.name === "state") {
				await visit(entryPath, 5);
				continue;
			}
			const childDepth = resolveMatrixStateLayoutChildDepth(depth, entry.name);
			if (childDepth !== null) await visit(entryPath, childDepth);
		}
	}
	await visit(matrixRoot, 0, true);
	return [...roots].toSorted();
}
function describeMatrixAccountStateMigration(storageRootDir, migration) {
	return `Matrix account SQLite schema migration (${migration.kind}): ${storageRootDir}`;
}
const matrixAccountStateSchemaMigration = {
	id: "matrix-account-sqlite-schema",
	label: "Matrix account SQLite schemas",
	async detectLegacyState(params) {
		const preview = [];
		for (const storageRootDir of await collectMatrixAccountStateRoots(params.stateDir)) {
			const { detectOpenClawStateDatabaseSchemaMigrations } = await import("openclaw/plugin-sdk/doctor-repair-runtime");
			const env = resolveMatrixSqliteStateEnv({
				env: params.env,
				stateDir: storageRootDir
			});
			preview.push(...detectOpenClawStateDatabaseSchemaMigrations({ env }).map((migration) => describeMatrixAccountStateMigration(storageRootDir, migration)));
		}
		return preview.length > 0 ? { preview } : null;
	},
	async migrateLegacyState(params) {
		const changes = [];
		const warnings = [];
		for (const storageRootDir of await collectMatrixAccountStateRoots(params.stateDir)) {
			const { detectOpenClawStateDatabaseSchemaMigrations, repairOpenClawStateDatabaseSchema } = await import("openclaw/plugin-sdk/doctor-repair-runtime");
			const env = resolveMatrixSqliteStateEnv({
				env: params.env,
				stateDir: storageRootDir
			});
			if (detectOpenClawStateDatabaseSchemaMigrations({ env }).length === 0) continue;
			const repaired = repairOpenClawStateDatabaseSchema({ env });
			changes.push(...repaired.changes.map((change) => `Matrix account SQLite ${storageRootDir}: ${change}`));
			warnings.push(...repaired.warnings.map((warning) => `Matrix account SQLite ${storageRootDir}: ${warning}`));
		}
		return {
			changes,
			warnings
		};
	}
};
//#endregion
//#region extensions/matrix/src/matrix/monitor/inbound-dedupe-migration.ts
const LEGACY_SQLITE_NAMESPACE = "inbound-dedupe";
const LEGACY_MARKERS_NAMESPACE = "inbound-dedupe-migrations";
const LEGACY_JSON_VERSION = 1;
const MATRIX_PLUGIN_ID = "matrix";
const MIGRATION_COMPLETION_NAMESPACE = "inbound-dedupe-migration-state";
const MIGRATION_COMPLETION_KEY = "sqlite-json-to-claimable-v1";
const STATE_DATABASE_RELATIVE_PATH = path.join("state", "openclaw.sqlite");
const STORAGE_META_FILENAME = "storage-meta.json";
const MATRIX_LEGACY_INBOUND_DEDUPE_FILENAME = "inbound-dedupe.json";
function openMatrixInboundDedupeMigrationCompletionStore(context, env) {
	return context.openPluginStateKeyedStore({
		namespace: MIGRATION_COMPLETION_NAMESPACE,
		maxEntries: 4,
		overflowPolicy: "reject-new",
		env
	});
}
async function hasCompletedMatrixInboundDedupeMigration(context, env) {
	const marker = await openMatrixInboundDedupeMigrationCompletionStore(context, env).lookup(MIGRATION_COMPLETION_KEY);
	return isRecord(marker) && marker.version === 1 && typeof marker.completedAt === "number" && Number.isFinite(marker.completedAt) && marker.completedAt >= 0;
}
async function recordMatrixInboundDedupeMigrationCompletion(context, env) {
	await openMatrixInboundDedupeMigrationCompletionStore(context, env).register(MIGRATION_COMPLETION_KEY, {
		version: 1,
		completedAt: Date.now()
	});
}
/**
* Reserves the durable completion row before any legacy source is changed.
* The invalid timestamp keeps detection active after an interrupted run, while
* updating this same key after retirement remains possible at plugin capacity.
*/
async function reserveMatrixInboundDedupeMigrationCompletion(context, env) {
	await openMatrixInboundDedupeMigrationCompletionStore(context, env).register(MIGRATION_COMPLETION_KEY, {
		version: 1,
		completedAt: -1
	});
}
async function collectMatrixInboundDedupeSources(stateDir) {
	const matrixRoot = path.join(stateDir, "matrix");
	const sqliteRoots = /* @__PURE__ */ new Set();
	const jsonRoots = /* @__PURE__ */ new Set();
	const warnings = [];
	async function visit(dir, depth, allowMissing = false) {
		let entries;
		try {
			entries = await fs.readdir(dir, { withFileTypes: true });
		} catch (err) {
			if (allowMissing && err.code === "ENOENT") return;
			warnings.push(`Failed scanning Matrix inbound dedupe sources under ${dir}: ${String(err)}`);
			return;
		}
		const isStorageRoot = depth === 0 || depth === 2 || depth === 4;
		for (const entry of entries) {
			const entryPath = path.join(dir, entry.name);
			if (entry.isFile()) {
				if (isStorageRoot && entry.name === "inbound-dedupe.json") jsonRoots.add(dir);
				else if (depth === 5 && entry.name === "openclaw.sqlite") sqliteRoots.add(path.dirname(dir));
				continue;
			}
			if (!entry.isDirectory()) continue;
			if (isStorageRoot && entry.name === "state") {
				await visit(entryPath, 5);
				continue;
			}
			const childDepth = resolveMatrixStateLayoutChildDepth(depth, entry.name);
			if (childDepth !== null) await visit(entryPath, childDepth);
		}
	}
	await visit(matrixRoot, 0, true);
	const matrixRootResolved = path.resolve(matrixRoot);
	const isAccountRoot = (root) => path.resolve(root) !== matrixRootResolved;
	const roots = {
		sqliteRoots: [...sqliteRoots].filter(isAccountRoot).toSorted(),
		jsonRoots: [...jsonRoots].filter(isAccountRoot).toSorted()
	};
	return warnings.length === 0 ? {
		status: "complete",
		...roots
	} : {
		status: "incomplete",
		...roots,
		warnings
	};
}
function selectLegacySqliteRows(db) {
	if (!db.prepare(`SELECT 1 AS present
       FROM sqlite_master
       WHERE type = 'table' AND name = 'plugin_state_entries'`).get()) return [];
	return db.prepare(`SELECT namespace, entry_key, value_json, expires_at
       FROM plugin_state_entries
       WHERE plugin_id = ? AND namespace IN (?, ?)
       ORDER BY namespace ASC, created_at ASC, entry_key ASC`).all(MATRIX_PLUGIN_ID, LEGACY_SQLITE_NAMESPACE, LEGACY_MARKERS_NAMESPACE);
}
function isLegacySqliteRowExpired(row, now) {
	if (typeof row.expires_at === "bigint") return row.expires_at <= BigInt(now);
	return row.expires_at !== null && row.expires_at <= now;
}
function normalizeLegacyTimestamp(raw) {
	if (typeof raw !== "number" || !Number.isFinite(raw)) return null;
	return Math.max(0, Math.floor(raw));
}
function parseLegacySqliteRow(row) {
	const value = isRecord(row.value) ? row.value : {};
	const roomId = typeof value.roomId === "string" ? value.roomId.trim() : "";
	const eventId = typeof value.eventId === "string" ? value.eventId.trim() : "";
	const ts = normalizeLegacyTimestamp(value.ts);
	const separator = row.key.lastIndexOf(":");
	if (!roomId || !eventId || ts === null || separator <= 0) return null;
	const accountId = row.key.slice(0, separator);
	const digest = createHash("sha256").update(accountId).update("\0").update(roomId).update("\0").update(eventId).digest("hex");
	if (row.key.slice(separator + 1) !== digest) return null;
	return {
		accountId,
		roomId,
		eventId,
		ts
	};
}
/**
* Reads one storage root's legacy SQLite dedupe rows without opening it through
* the current state runtime. Historical per-account databases can predate the
* current core schema, and detection must not upgrade them merely to inspect
* these retired plugin-state namespaces.
*/
async function readLegacyInboundDedupeSqliteSource(storageRootDir) {
	const { openNodeSqliteDatabase } = await import("openclaw/plugin-sdk/sqlite-worker-runtime");
	const db = openNodeSqliteDatabase(path.join(storageRootDir, STATE_DATABASE_RELATIVE_PATH), { readOnly: true });
	try {
		const rows = selectLegacySqliteRows(db);
		const markers = [];
		const now = Date.now();
		for (const row of rows) {
			if (isLegacySqliteRowExpired(row, now)) continue;
			const value = JSON.parse(row.value_json);
			if (row.namespace !== LEGACY_SQLITE_NAMESPACE) continue;
			const marker = parseLegacySqliteRow({
				key: row.entry_key,
				value
			});
			if (marker) markers.push(marker);
		}
		return {
			markers,
			legacyRowCount: rows.length
		};
	} finally {
		db.close();
	}
}
/** Deletes only the two retired Matrix namespaces after a successful import. */
async function retireLegacyInboundDedupeSqliteRows(storageRootDir) {
	const { openNodeSqliteDatabase, runSqliteImmediateTransactionSync } = await import("openclaw/plugin-sdk/sqlite-worker-runtime");
	const db = openNodeSqliteDatabase(path.join(storageRootDir, STATE_DATABASE_RELATIVE_PATH));
	try {
		if (selectLegacySqliteRows(db).length === 0) return;
		runSqliteImmediateTransactionSync(db, () => {
			if (selectLegacySqliteRows(db).length === 0) return;
			db.prepare(`DELETE FROM plugin_state_entries
         WHERE plugin_id = ? AND namespace IN (?, ?)`).run(MATRIX_PLUGIN_ID, LEGACY_SQLITE_NAMESPACE, LEGACY_MARKERS_NAMESPACE);
		});
	} finally {
		db.close();
	}
}
async function verifyMatrixInboundDedupeSourcesRetired(stateDir) {
	const warnings = [];
	const remaining = await collectMatrixInboundDedupeSources(stateDir);
	if (remaining.status === "incomplete") warnings.push(...remaining.warnings);
	for (const storageRootDir of remaining.sqliteRoots) try {
		if ((await readLegacyInboundDedupeSqliteSource(storageRootDir)).legacyRowCount > 0) warnings.push(`Matrix inbound dedupe rows remain after retirement for ${storageRootDir}`);
	} catch (err) {
		warnings.push(`Failed verifying retired Matrix inbound dedupe rows for ${storageRootDir}: ${String(err)}`);
	}
	for (const storageRootDir of remaining.jsonRoots) warnings.push(`Matrix inbound dedupe JSON remains after retirement for ${storageRootDir}`);
	return warnings;
}
async function resolveJsonRootAccountId(storageRootDir) {
	for (const filename of [STORAGE_META_FILENAME, `${STORAGE_META_FILENAME}.migrated`]) try {
		const metadata = normalizeMatrixStorageMetadata(JSON.parse(await fs.readFile(path.join(storageRootDir, filename), "utf8")));
		if (metadata?.accountId) return metadata.accountId;
	} catch {}
	return "default";
}
/**
* Reads one storage root's legacy inbound-dedupe.json markers. Throws on file
* read errors so a transiently unreadable file is never retired unread, and
* returns null for malformed content so the caller can archive it explicitly.
*/
async function readLegacyInboundDedupeJsonSource(storageRootDir) {
	const jsonPath = path.join(storageRootDir, MATRIX_LEGACY_INBOUND_DEDUPE_FILENAME);
	const raw = await fs.readFile(jsonPath, "utf8");
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return null;
	}
	if (!isRecord(parsed) || parsed.version !== LEGACY_JSON_VERSION || !Array.isArray(parsed.entries)) return null;
	const accountId = await resolveJsonRootAccountId(storageRootDir);
	const markers = [];
	for (const entry of parsed.entries) {
		if (!isRecord(entry) || typeof entry.key !== "string") continue;
		const separator = entry.key.indexOf("|");
		if (separator <= 0) continue;
		const roomId = entry.key.slice(0, separator).trim();
		const eventId = entry.key.slice(separator + 1).trim();
		const ts = normalizeLegacyTimestamp(entry.ts);
		if (!roomId || !eventId || ts === null) continue;
		markers.push({
			accountId,
			roomId,
			eventId,
			ts
		});
	}
	return markers;
}
/**
* Imports the globally newest legacy markers into the claimable-dedupe store.
* Never exceeds capacity, never replaces a post-upgrade destination row, and
* preserves source timestamps because eviction is ordered by row creation
* time. Throws on import or verification errors so the caller keeps the legacy
* sources for the next doctor attempt.
*/
async function importNewestInboundDedupeMarkers(params) {
	const { createPersistentDedupeImportEntry } = await import("openclaw/plugin-sdk/persistent-dedupe");
	const { buildMatrixInboundDedupeEventKey, MATRIX_INBOUND_DEDUPE_STATE_MAX_ENTRIES, MATRIX_INBOUND_DEDUPE_TTL_MS, resolveMatrixInboundDedupeStateNamespace } = await import("./.setup/inbound-dedupe-BSlv35xl.mjs");
	const now = params.now ?? Date.now();
	const stateMaxEntries = params.stateMaxEntries ?? MATRIX_INBOUND_DEDUPE_STATE_MAX_ENTRIES;
	const newestByKey = /* @__PURE__ */ new Map();
	for (const marker of params.markers) {
		const key = buildMatrixInboundDedupeEventKey(marker);
		if (!key) continue;
		const existing = newestByKey.get(key);
		if (!existing || marker.ts > existing.ts) newestByKey.set(key, {
			...marker,
			key
		});
	}
	const markers = [...newestByKey.values()].toSorted((left, right) => right.ts - left.ts);
	const store = params.io.context.openPluginStateKeyedStore({
		namespace: resolveMatrixInboundDedupeStateNamespace(),
		maxEntries: stateMaxEntries,
		defaultTtlMs: MATRIX_INBOUND_DEDUPE_TTL_MS,
		env: params.io.env
	});
	const existingEntries = await store.entries();
	const existingKeys = new Set(existingEntries.map((entry) => entry.key));
	const missingEntries = markers.flatMap((marker) => {
		const remainingTtlMs = MATRIX_INBOUND_DEDUPE_TTL_MS - (now - marker.ts);
		if (remainingTtlMs <= 0) return [];
		const entry = createPersistentDedupeImportEntry({
			key: marker.key,
			seenAt: marker.ts,
			ttlMs: Math.max(1, Math.floor(remainingTtlMs))
		});
		return existingKeys.has(entry.key) ? [] : [{
			marker,
			entry
		}];
	});
	const namespaceCapacity = Math.max(0, stateMaxEntries - existingEntries.length);
	const pluginCapacity = missingEntries.length > 0 ? params.io.context.getPluginStateCapacity?.() : void 0;
	if (missingEntries.length > 0 && !pluginCapacity) throw new Error("plugin-wide Matrix inbound dedupe import capacity is unavailable");
	const pluginRemainingCapacity = pluginCapacity ? Math.max(0, pluginCapacity.maxEntries - pluginCapacity.liveEntries) : namespaceCapacity;
	const capacity = Math.min(namespaceCapacity, pluginRemainingCapacity);
	const selectedEntries = missingEntries.slice(0, capacity);
	if (selectedEntries.length > 0) {
		const importEntries = params.io.context.importPluginStateEntries;
		if (!importEntries) throw new Error("retention-aware Matrix inbound dedupe import is unavailable");
		importEntries({
			namespace: resolveMatrixInboundDedupeStateNamespace(),
			maxEntries: stateMaxEntries,
			defaultTtlMs: MATRIX_INBOUND_DEDUPE_TTL_MS,
			env: params.io.env
		}, selectedEntries.map(({ marker, entry }) => ({
			key: entry.key,
			value: entry.value,
			createdAt: marker.ts,
			...entry.ttlMs != null ? { ttlMs: entry.ttlMs } : {}
		})));
		const importedKeys = new Set((await store.entries()).map((entry) => entry.key));
		const missingKey = selectedEntries.find(({ entry }) => !importedKeys.has(entry.key))?.entry.key;
		if (missingKey) throw new Error(`retention-aware Matrix inbound dedupe import did not persist ${missingKey}`);
	}
	return {
		imported: selectedEntries.length,
		total: markers.length
	};
}
//#endregion
//#region extensions/matrix/doctor-contract-api.ts
const MATRIX_SYNC_CACHE_FILENAME = "bot-storage.json";
const MATRIX_STORAGE_META_FILENAME = "storage-meta.json";
async function collectLegacyMatrixCredentialSources(params) {
	const credentialsDir = resolveMatrixCredentialsDir(params.stateDir);
	let entries;
	try {
		entries = await fs.readdir(credentialsDir, { withFileTypes: true });
	} catch {
		return [];
	}
	const files = entries.filter((entry) => entry.isFile() && /^credentials(?:-[a-z0-9._-]+)?\.json$/iu.test(entry.name)).toSorted((left, right) => {
		if (left.name === "credentials.json") return 1;
		if (right.name === "credentials.json") return -1;
		return left.name.localeCompare(right.name);
	});
	if (files.length === 0) return [];
	const { requiresExplicitMatrixDefaultAccount, resolveMatrixDefaultOrOnlyAccountId } = await import("./.setup/account-selection-BHkfU1eC.mjs").then((n) => n.t);
	return files.map((entry) => {
		const namedAccount = /^credentials(?:-([a-z0-9._-]+))?\.json$/iu.exec(entry.name)?.[1];
		return {
			accountId: namedAccount ? normalizeAccountId(namedAccount) : requiresExplicitMatrixDefaultAccount(params.config, params.env) ? null : normalizeAccountId(resolveMatrixDefaultOrOnlyAccountId(params.config, params.env)),
			filePath: path.join(credentialsDir, entry.name)
		};
	});
}
async function readLegacyMatrixCredentials(source) {
	if (!source.accountId) return null;
	try {
		const raw = JSON.parse(await fs.readFile(source.filePath, "utf8"));
		const createdAt = isRecord(raw) && typeof raw.createdAt === "string" && raw.createdAt ? raw.createdAt : (await fs.stat(source.filePath)).mtime.toISOString();
		return normalizeMatrixStoredCredentials(isRecord(raw) ? {
			...raw,
			createdAt
		} : raw, source.accountId);
	} catch {
		return null;
	}
}
async function collectLegacyMatrixStateRoots(stateDir, filename, options) {
	const matrixRoot = path.join(stateDir, "matrix");
	const roots = [];
	async function visit(dir, depth) {
		let entries;
		try {
			entries = await fs.readdir(dir, { withFileTypes: true });
		} catch {
			return;
		}
		for (const entry of entries) {
			const entryPath = path.join(dir, entry.name);
			if ((depth === 0 || depth === 2 || depth === 4) && entry.isFile() && entry.name === filename) {
				roots.push(dir);
				continue;
			}
			if (!entry.isDirectory()) continue;
			const childDepth = resolveMatrixStateLayoutChildDepth(depth, entry.name);
			if (childDepth !== null) await visit(entryPath, childDepth);
		}
	}
	await visit(matrixRoot, 0);
	return roots.filter((root) => options?.includeMatrixRoot || path.resolve(root) !== path.resolve(matrixRoot)).toSorted();
}
async function* readLegacyMatrixSyncCaches(stateDir) {
	for (const storageRootDir of await collectLegacyMatrixStateRoots(stateDir, MATRIX_SYNC_CACHE_FILENAME)) {
		const persisted = await readLegacyMatrixSyncCacheState(storageRootDir);
		if (persisted) yield {
			storageRootDir,
			persisted
		};
	}
}
async function readLegacyMatrixStorageMetadata(storageRootDir) {
	try {
		return normalizeMatrixStorageMetadata(JSON.parse(await fs.readFile(path.join(storageRootDir, MATRIX_STORAGE_META_FILENAME), "utf8")));
	} catch {
		return null;
	}
}
async function archiveLegacySyncCache(params) {
	await archiveLegacyMatrixStateFile({
		...params,
		filename: MATRIX_SYNC_CACHE_FILENAME,
		label: "Matrix sync cache"
	});
}
async function archiveLegacyMatrixStateFile(params) {
	const warningCount = params.warnings.length;
	await archiveLegacyStateSource({
		filePath: path.join(params.storageRootDir, params.filename),
		label: params.label,
		changes: params.changes,
		warnings: params.warnings
	});
	if (params.notice && params.warnings.length === warningCount) params.notices?.push(params.notice);
}
const stateMigrations = [
	matrixAccountStateSchemaMigration,
	{
		id: "matrix-credentials-json-to-plugin-state",
		label: "Matrix credentials",
		async detectLegacyState(params) {
			const sources = await collectLegacyMatrixCredentialSources(params);
			return sources.length > 0 ? { preview: [`Matrix credential JSON can migrate to SQLite (${sources.length} ${sources.length === 1 ? "file" : "files"})`] } : null;
		},
		async migrateLegacyState(params) {
			const changes = [];
			const warnings = [];
			const sources = await collectLegacyMatrixCredentialSources(params);
			const store = params.context.openPluginStateKeyedStore({
				namespace: MATRIX_CREDENTIALS_NAMESPACE,
				maxEntries: 256,
				overflowPolicy: "reject-new"
			});
			for (const source of sources) {
				if (!source.accountId) {
					warnings.push(`Left ambiguous Matrix credential legacy source in place because no default account is selected: ${source.filePath}`);
					continue;
				}
				const credentials = await readLegacyMatrixCredentials(source);
				if (!credentials) {
					warnings.push(`Left invalid Matrix credential legacy source in place: ${source.filePath}`);
					continue;
				}
				const key = matrixCredentialsStoreKey(source.accountId);
				const stored = await store.lookup(key);
				if (isMatrixCredentialRevocation(stored, source.accountId)) {
					changes.push(`Archived revoked Matrix credential legacy source for account ${source.accountId}`);
					await archiveLegacyStateSource({
						filePath: source.filePath,
						label: "Matrix credentials",
						changes,
						warnings
					});
					continue;
				}
				const existing = normalizeMatrixStoredCredentials(stored, source.accountId);
				if (existing && JSON.stringify(existing) !== JSON.stringify(credentials)) {
					changes.push(`Kept existing Matrix credentials for account ${source.accountId}`);
					await archiveLegacyStateSource({
						filePath: source.filePath,
						label: "Matrix credentials",
						changes,
						warnings
					});
					continue;
				}
				if (!existing) try {
					await store.registerIfAbsent(key, credentials);
				} catch (error) {
					warnings.push(`Failed importing Matrix credentials for account ${source.accountId}: ${String(error)}; left legacy source in place`);
					continue;
				}
				const persisted = normalizeMatrixStoredCredentials(await store.lookup(key), source.accountId);
				if (!persisted || JSON.stringify(persisted) !== JSON.stringify(credentials)) {
					warnings.push(`Failed verifying Matrix credentials for account ${source.accountId}; left legacy source in place`);
					continue;
				}
				changes.push(`Migrated Matrix credentials for account ${source.accountId} to SQLite`);
				await archiveLegacyStateSource({
					filePath: source.filePath,
					label: "Matrix credentials",
					changes,
					warnings
				});
			}
			return {
				changes,
				warnings
			};
		}
	},
	{
		id: "matrix-inbound-dedupe-to-claimable-dedupe",
		label: "Matrix inbound dedupe markers",
		async detectLegacyState(params) {
			return await hasCompletedMatrixInboundDedupeMigration(params.context, params.env) ? null : { preview: ["Matrix inbound dedupe legacy sources need a one-time migration scan"] };
		},
		async migrateLegacyState(params) {
			const io = {
				context: params.context,
				env: params.env
			};
			const changes = [];
			const warnings = [];
			if (await hasCompletedMatrixInboundDedupeMigration(params.context, params.env)) return {
				changes,
				warnings
			};
			try {
				await reserveMatrixInboundDedupeMigrationCompletion(params.context, params.env);
			} catch (err) {
				warnings.push(`Failed reserving Matrix inbound dedupe migration completion: ${String(err)}; left legacy sources in place`);
				return {
					changes,
					warnings
				};
			}
			const sources = await collectMatrixInboundDedupeSources(params.stateDir);
			if (sources.status === "incomplete") warnings.push(...sources.warnings);
			const recordCompletionIfClean = async (verifyRetirement = false) => {
				if (warnings.length > 0) return;
				if (verifyRetirement) {
					warnings.push(...await verifyMatrixInboundDedupeSourcesRetired(params.stateDir));
					if (warnings.length > 0) return;
				}
				try {
					await recordMatrixInboundDedupeMigrationCompletion(params.context, params.env);
					if (sources.sqliteRoots.length + sources.jsonRoots.length > 0) changes.push(`Recorded Matrix inbound dedupe migration completion (${sources.sqliteRoots.length} SQLite roots, ${sources.jsonRoots.length} JSON roots scanned)`);
				} catch (err) {
					warnings.push(`Failed recording Matrix inbound dedupe migration completion: ${String(err)}`);
				}
			};
			const gathered = [];
			const sqliteRootsToRetire = [];
			for (const storageRootDir of sources.sqliteRoots) try {
				const source = await readLegacyInboundDedupeSqliteSource(storageRootDir);
				if (source.legacyRowCount === 0) continue;
				gathered.push(...source.markers);
				sqliteRootsToRetire.push(storageRootDir);
			} catch (err) {
				warnings.push(`Failed reading Matrix inbound dedupe rows for ${storageRootDir}: ${String(err)}; left legacy rows in place`);
			}
			const jsonRootsToRetire = [];
			for (const storageRootDir of sources.jsonRoots) try {
				const markers = await readLegacyInboundDedupeJsonSource(storageRootDir);
				if (markers === null) warnings.push(`Matrix inbound dedupe JSON for ${storageRootDir} is malformed; archived without import`);
				else gathered.push(...markers);
				jsonRootsToRetire.push(storageRootDir);
			} catch (err) {
				warnings.push(`Failed reading Matrix inbound dedupe JSON for ${storageRootDir}: ${String(err)}; left legacy file in place`);
			}
			if (sqliteRootsToRetire.length + jsonRootsToRetire.length === 0) {
				await recordCompletionIfClean();
				return {
					changes,
					warnings
				};
			}
			try {
				const result = await importNewestInboundDedupeMarkers({
					io,
					markers: gathered
				});
				changes.push(`Migrated Matrix inbound dedupe markers to the claimable dedupe store (${result.imported} of ${result.total} entries)`);
			} catch (err) {
				warnings.push(`Failed importing Matrix inbound dedupe markers: ${String(err)}; left legacy sources in place`);
				return {
					changes,
					warnings
				};
			}
			for (const storageRootDir of sqliteRootsToRetire) try {
				await retireLegacyInboundDedupeSqliteRows(storageRootDir);
				changes.push(`Retired Matrix inbound dedupe rows for ${storageRootDir}`);
			} catch (err) {
				warnings.push(`Failed retiring Matrix inbound dedupe rows for ${storageRootDir}: ${String(err)}`);
			}
			for (const storageRootDir of jsonRootsToRetire) await archiveLegacyMatrixStateFile({
				storageRootDir,
				filename: MATRIX_LEGACY_INBOUND_DEDUPE_FILENAME,
				label: "Matrix inbound dedupe",
				changes,
				warnings
			});
			await recordCompletionIfClean(true);
			return {
				changes,
				warnings
			};
		}
	},
	{
		id: "matrix-storage-meta-json-to-plugin-state",
		label: "Matrix storage metadata",
		async detectLegacyState(params) {
			const previews = [];
			for (const storageRootDir of await collectLegacyMatrixStateRoots(params.stateDir, MATRIX_STORAGE_META_FILENAME)) {
				if (!await readLegacyMatrixStorageMetadata(storageRootDir)) continue;
				previews.push(`Matrix storage metadata JSON can migrate to SQLite: ${storageRootDir}`);
			}
			return previews.length > 0 ? { preview: previews } : null;
		},
		async migrateLegacyState(params) {
			const changes = [];
			const warnings = [];
			const notices = [];
			for (const storageRootDir of await collectLegacyMatrixStateRoots(params.stateDir, MATRIX_STORAGE_META_FILENAME)) {
				const payload = await readLegacyMatrixStorageMetadata(storageRootDir);
				if (!payload) continue;
				const store = params.context.openPluginStateKeyedStore(openMatrixStorageMetaStoreOptions(storageRootDir));
				if (await hasMatrixStorageMetaStateInStore({ store })) {
					await archiveLegacyMatrixStateFile({
						storageRootDir,
						filename: MATRIX_STORAGE_META_FILENAME,
						label: "Matrix storage metadata",
						changes,
						warnings,
						notices,
						notice: `Kept existing Matrix storage metadata in SQLite and archived the legacy source for ${storageRootDir}`
					});
					continue;
				}
				await writeMatrixStorageMetaStateToStore({
					payload,
					store
				});
				changes.push(`Migrated Matrix storage metadata JSON to SQLite for ${storageRootDir}`);
				await archiveLegacyMatrixStateFile({
					storageRootDir,
					filename: MATRIX_STORAGE_META_FILENAME,
					label: "Matrix storage metadata",
					changes,
					warnings
				});
			}
			return {
				changes,
				warnings,
				...notices.length > 0 ? { notices } : {}
			};
		}
	},
	{
		id: "matrix-sync-cache-json-to-plugin-state",
		label: "Matrix sync cache",
		async detectLegacyState(params) {
			const previews = [];
			for await (const { storageRootDir } of readLegacyMatrixSyncCaches(params.stateDir)) previews.push(`Matrix sync cache JSON can migrate to SQLite: ${storageRootDir}`);
			return previews.length > 0 ? { preview: previews } : null;
		},
		async migrateLegacyState(params) {
			const changes = [];
			const warnings = [];
			const notices = [];
			for await (const { storageRootDir, persisted } of readLegacyMatrixSyncCaches(params.stateDir)) {
				const store = params.context.openPluginStateKeyedStore(openMatrixSyncCacheStoreOptions(storageRootDir));
				if (await hasMatrixSyncCacheStateInStore({
					storageRootDir,
					store
				})) {
					await archiveLegacySyncCache({
						storageRootDir,
						changes,
						warnings,
						notices,
						notice: `Kept existing Matrix sync cache in SQLite and archived the legacy source for ${storageRootDir}`
					});
					continue;
				}
				await writeMatrixSyncCacheStateToStore({
					storageRootDir,
					payload: persisted,
					store
				});
				changes.push(`Migrated Matrix sync cache JSON to SQLite for ${storageRootDir}`);
				await archiveLegacySyncCache({
					storageRootDir,
					changes,
					warnings
				});
			}
			return {
				changes,
				warnings,
				...notices.length > 0 ? { notices } : {}
			};
		}
	},
	{
		id: "matrix-recovery-key-json-to-plugin-state",
		label: "Matrix recovery key",
		async detectLegacyState(params) {
			const previews = [];
			for (const storageRootDir of await collectLegacyMatrixStateRoots(params.stateDir, MATRIX_RECOVERY_KEY_FILENAME)) {
				if (!readLegacyMatrixRecoveryKeyState(storageRootDir)) continue;
				previews.push(`Matrix recovery-key JSON can migrate to SQLite: ${storageRootDir}`);
			}
			return previews.length > 0 ? { preview: previews } : null;
		},
		async migrateLegacyState(params) {
			const changes = [];
			const warnings = [];
			const notices = [];
			for (const storageRootDir of await collectLegacyMatrixStateRoots(params.stateDir, MATRIX_RECOVERY_KEY_FILENAME)) {
				const payload = readLegacyMatrixRecoveryKeyState(storageRootDir);
				if (!payload) continue;
				const store = params.context.openPluginStateKeyedStore(openMatrixRecoveryKeyStoreOptions(storageRootDir));
				if (await hasMatrixRecoveryKeyStateInStore({ store })) {
					await archiveLegacyMatrixStateFile({
						storageRootDir,
						filename: MATRIX_RECOVERY_KEY_FILENAME,
						label: "Matrix recovery key",
						changes,
						warnings,
						notices,
						notice: `Kept existing Matrix recovery key in SQLite and archived the legacy source for ${storageRootDir}`
					});
					continue;
				}
				await writeMatrixRecoveryKeyStateToStore({
					payload,
					store
				});
				changes.push(`Migrated Matrix recovery-key JSON to SQLite for ${storageRootDir}`);
				await archiveLegacyMatrixStateFile({
					storageRootDir,
					filename: MATRIX_RECOVERY_KEY_FILENAME,
					label: "Matrix recovery key",
					changes,
					warnings
				});
			}
			return {
				changes,
				warnings,
				...notices.length > 0 ? { notices } : {}
			};
		}
	},
	{
		id: "matrix-legacy-crypto-migration-json-to-plugin-state",
		label: "Matrix legacy crypto state",
		async detectLegacyState(params) {
			const previews = [];
			for (const storageRootDir of await collectLegacyMatrixStateRoots(params.stateDir, MATRIX_LEGACY_CRYPTO_MIGRATION_FILENAME, { includeMatrixRoot: true })) {
				if (!readLegacyMatrixLegacyCryptoMigrationState(storageRootDir)) continue;
				previews.push(`Matrix legacy crypto migration JSON can migrate to SQLite: ${storageRootDir}`);
			}
			for (const storageRootDir of await collectLegacyMatrixStateRoots(params.stateDir, MATRIX_IDB_SNAPSHOT_FILENAME, { includeMatrixRoot: true })) previews.push(`Matrix IndexedDB snapshot JSON can migrate to SQLite: ${storageRootDir}`);
			return previews.length > 0 ? { preview: previews } : null;
		},
		async migrateLegacyState(params) {
			const changes = [];
			const warnings = [];
			const notices = [];
			for (const storageRootDir of await collectLegacyMatrixStateRoots(params.stateDir, MATRIX_LEGACY_CRYPTO_MIGRATION_FILENAME, { includeMatrixRoot: true })) {
				const state = readLegacyMatrixLegacyCryptoMigrationState(storageRootDir);
				if (!state) continue;
				const store = params.context.openPluginStateKeyedStore(openMatrixLegacyCryptoMigrationStoreOptions(storageRootDir));
				if (await hasMatrixLegacyCryptoMigrationStateInStore({ store })) {
					await archiveLegacyMatrixStateFile({
						storageRootDir,
						filename: MATRIX_LEGACY_CRYPTO_MIGRATION_FILENAME,
						label: "Matrix legacy crypto migration",
						changes,
						warnings,
						notices,
						notice: `Kept existing Matrix legacy crypto migration in SQLite and archived the legacy source for ${storageRootDir}`
					});
					continue;
				}
				await writeMatrixLegacyCryptoMigrationStateToStore({
					state,
					store
				});
				changes.push(`Migrated Matrix legacy crypto migration JSON to SQLite for ${storageRootDir}`);
				await archiveLegacyMatrixStateFile({
					storageRootDir,
					filename: MATRIX_LEGACY_CRYPTO_MIGRATION_FILENAME,
					label: "Matrix legacy crypto migration",
					changes,
					warnings
				});
			}
			for (const storageRootDir of await collectLegacyMatrixStateRoots(params.stateDir, MATRIX_IDB_SNAPSHOT_FILENAME, { includeMatrixRoot: true })) {
				const { migrateLegacyMatrixIdbSnapshot } = await import("./.setup/crypto-snapshot-doctor.runtime-CMWa1d9Y.mjs");
				await migrateLegacyMatrixIdbSnapshot({
					storageRootDir,
					context: params.context,
					changes,
					notices,
					warnings
				});
			}
			return {
				changes,
				warnings,
				...notices.length > 0 ? { notices } : {}
			};
		}
	}
];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };
