import { n as normalizeCompatibilityConfig, r as runtime_doctor_migrations_exports, t as legacyConfigRules } from "./.setup/doctor-contract-CsTNmbMa.mjs";
import { i as normalizeMatrixStoredCredentials, n as isMatrixCredentialRevocation, r as matrixCredentialsStoreKey, t as MATRIX_CREDENTIALS_NAMESPACE } from "./.setup/credentials-state-B3cuUFwZ.mjs";
import { c as resolveMatrixStateLayoutChildDepth, i as resolveMatrixCredentialsDir } from "./.setup/storage-paths-B51JM-pC.mjs";
import { a as describeRetiredMatrixState, o as resolveMatrixSqliteStateEnv, t as RETIRED_MATRIX_STATE_FILENAMES } from "./.setup/retired-state-BXUQ2I-C.mjs";
import { i as readLegacyMatrixSyncCacheState, n as hasMatrixSyncCacheStateInStore, r as openMatrixSyncCacheStoreOptions, s as writeMatrixSyncCacheStateToStore } from "./.setup/sync-cache-state-C2z64uyk.mjs";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash } from "node:crypto";
import path from "node:path";
import fs from "node:fs/promises";
import { hasNodeErrorCode } from "@openclaw/fs-safe/path";
import { walkDirectory } from "@openclaw/fs-safe/walk";
//#region extensions/matrix/src/matrix/state-layout-walk.ts
/** Traverse only shipped Matrix layouts; archives and unrelated descendants stay unopened. */
async function walkMatrixStateFiles(stateDir, includeFile, stateRootDepths = []) {
	const matrixRoot = path.resolve(stateDir, "matrix");
	const depths = /* @__PURE__ */ new Map([[matrixRoot, 0]]);
	const result = await walkDirectory(matrixRoot, {
		symlinks: "skip",
		include: (entry) => entry.kind === "file" && includeFile(entry.name, depths.get(path.dirname(entry.path))),
		descend: (entry) => {
			const parentDepth = depths.get(path.dirname(entry.path));
			const depth = entry.name === "state" && stateRootDepths.includes(parentDepth) ? 5 : resolveMatrixStateLayoutChildDepth(parentDepth, entry.name);
			if (depth === null) return false;
			depths.set(entry.path, depth);
			return true;
		}
	});
	return {
		entries: result.entries,
		failedDirs: result.failedDirs.filter((failure) => failure.path !== matrixRoot || !hasNodeErrorCode(failure.error, "ENOENT"))
	};
}
//#endregion
//#region extensions/matrix/src/matrix/account-state-schema-doctor.ts
const STATE_DATABASE_FILENAME = "openclaw.sqlite";
async function collectMatrixAccountStateRoots(stateDir) {
	const { entries, failedDirs } = await walkMatrixStateFiles(stateDir, (name, depth) => depth === 5 && name === STATE_DATABASE_FILENAME || (depth === 0 || depth === 2 || depth === 4) && RETIRED_MATRIX_STATE_FILENAMES.has(name), [2, 4]);
	if (failedDirs.length > 0) throw failedDirs[0].error;
	const retired = entries.filter((entry) => path.basename(entry.path) !== STATE_DATABASE_FILENAME);
	if (retired.length > 0) throw new Error(retired.map((entry) => describeRetiredMatrixState(entry.path)).join("\n"));
	return entries.map((entry) => path.dirname(path.dirname(entry.path))).toSorted();
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
const MATRIX_PLUGIN_ID = "matrix";
const MIGRATION_COMPLETION_NAMESPACE = "inbound-dedupe-migration-state";
const MIGRATION_COMPLETION_KEY = "sqlite-json-to-claimable-v1";
const STATE_DATABASE_RELATIVE_PATH = path.join("state", "openclaw.sqlite");
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
	const matrixRoot = path.resolve(stateDir, "matrix");
	const sqliteRoots = /* @__PURE__ */ new Set();
	const { entries, failedDirs } = await walkMatrixStateFiles(stateDir, (name, depth) => (depth === 0 || depth === 2 || depth === 4) && name === MATRIX_LEGACY_INBOUND_DEDUPE_FILENAME || depth === 5 && name === "openclaw.sqlite", [
		0,
		2,
		4
	]);
	for (const entry of entries) if (entry.name === MATRIX_LEGACY_INBOUND_DEDUPE_FILENAME) throw new Error(describeRetiredMatrixState(entry.path));
	else sqliteRoots.add(path.dirname(path.dirname(entry.path)));
	const warnings = failedDirs.map(({ path: directory, error }) => `Failed scanning Matrix inbound dedupe sources under ${directory}: ${String(error)}`);
	const isAccountRoot = (root) => root !== matrixRoot;
	const roots = { sqliteRoots: [...sqliteRoots].filter(isAccountRoot).toSorted() };
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
	return warnings;
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
	const { buildMatrixInboundDedupeEventKey, MATRIX_INBOUND_DEDUPE_STATE_MAX_ENTRIES, MATRIX_INBOUND_DEDUPE_TTL_MS, resolveMatrixInboundDedupeStateNamespace } = await import("./.setup/inbound-dedupe-C-EBGY0B.mjs");
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
	const { requiresExplicitMatrixDefaultAccount, resolveMatrixDefaultOrOnlyAccountId } = await import("./.setup/account-selection-BDeeqwwR.mjs").then((n) => n.t);
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
async function* readLegacyMatrixSyncCacheSources(stateDir) {
	const { entries } = await walkMatrixStateFiles(stateDir, (name, depth) => name === MATRIX_SYNC_CACHE_FILENAME && (depth === 2 || depth === 4));
	for (const storageRootDir of entries.map((entry) => path.dirname(entry.path)).toSorted()) {
		const payload = await readLegacyMatrixSyncCacheState(storageRootDir);
		if (payload) yield {
			storageRootDir,
			payload
		};
	}
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
					await (0, runtime_doctor_migrations_exports.archiveLegacyStateSource)({
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
					await (0, runtime_doctor_migrations_exports.archiveLegacyStateSource)({
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
				await (0, runtime_doctor_migrations_exports.archiveLegacyStateSource)({
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
			const sources = await collectMatrixInboundDedupeSources(params.stateDir);
			if (params.config.channels?.matrix === void 0 && sources.status === "complete" && sources.sqliteRoots.length === 0) return null;
			return await hasCompletedMatrixInboundDedupeMigration(params.context, params.env) ? null : { preview: ["Matrix inbound dedupe legacy sources need a one-time migration scan"] };
		},
		async migrateLegacyState(params) {
			const sources = await collectMatrixInboundDedupeSources(params.stateDir);
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
			if (sources.status === "incomplete") warnings.push(...sources.warnings);
			const recordCompletionIfClean = async (verifyRetirement = false) => {
				if (warnings.length > 0) return;
				if (verifyRetirement) {
					warnings.push(...await verifyMatrixInboundDedupeSourcesRetired(params.stateDir));
					if (warnings.length > 0) return;
				}
				try {
					await recordMatrixInboundDedupeMigrationCompletion(params.context, params.env);
					if (sources.sqliteRoots.length > 0) changes.push(`Recorded Matrix inbound dedupe migration completion (${sources.sqliteRoots.length} SQLite roots scanned)`);
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
			if (sqliteRootsToRetire.length === 0) {
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
			await recordCompletionIfClean(true);
			return {
				changes,
				warnings
			};
		}
	},
	{
		id: "matrix-sync-cache-json-to-plugin-state",
		label: "Matrix sync cache",
		async detectLegacyState(params) {
			const previews = [];
			for await (const { storageRootDir } of readLegacyMatrixSyncCacheSources(params.stateDir)) previews.push(`Matrix sync cache JSON can migrate to SQLite: ${storageRootDir}`);
			return previews.length > 0 ? { preview: previews } : null;
		},
		async migrateLegacyState(params) {
			const changes = [];
			const warnings = [];
			const notices = [];
			for await (const source of readLegacyMatrixSyncCacheSources(params.stateDir)) {
				const store = params.context.openPluginStateKeyedStore(openMatrixSyncCacheStoreOptions(source.storageRootDir));
				const existing = await hasMatrixSyncCacheStateInStore({
					...source,
					store
				});
				if (!existing) {
					await writeMatrixSyncCacheStateToStore({
						...source,
						store
					});
					changes.push(`Migrated Matrix sync cache JSON to SQLite for ${source.storageRootDir}`);
				}
				const warningCount = warnings.length;
				await (0, runtime_doctor_migrations_exports.archiveLegacyStateSource)({
					filePath: path.join(source.storageRootDir, MATRIX_SYNC_CACHE_FILENAME),
					label: "Matrix sync cache",
					changes,
					warnings
				});
				if (existing && warnings.length === warningCount) notices.push(`Kept existing Matrix sync cache in SQLite and archived the legacy source for ${source.storageRootDir}`);
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
