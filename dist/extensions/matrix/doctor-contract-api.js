import { t as runtime_doctor_migrations_exports } from "./.setup/runtime-doctor-migrations-CSvRANPN.mjs";
import { i as normalizeMatrixStoredCredentials, n as isMatrixCredentialRevocation, r as matrixCredentialsStoreKey, t as MATRIX_CREDENTIALS_NAMESPACE } from "./.setup/credentials-state-jxq29yQw.mjs";
import { i as resolveMatrixCredentialsDir } from "./.setup/storage-paths-e_Vq6cvw.mjs";
import { n as normalizeCompatibilityConfig, t as legacyConfigRules } from "./.setup/doctor-contract-GiXgCj7k.mjs";
import { a as describeRetiredMatrixState, t as RETIRED_MATRIX_STATE_FILENAMES } from "./.setup/retired-state-BsxdpJNk.mjs";
import { t as resolveMatrixSqliteStateEnv } from "./.setup/sqlite-state-D6Zpz1q1.mjs";
import { t as walkMatrixStateFiles } from "./.setup/state-layout-walk-BqCZTHpp.mjs";
import { i as readLegacyMatrixSyncCacheState, n as hasMatrixSyncCacheStateInStore, r as openMatrixSyncCacheStoreOptions, s as writeMatrixSyncCacheStateToStore } from "./.setup/sync-cache-state-BMvqW4Ii.mjs";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash } from "node:crypto";
import path from "node:path";
import fs from "node:fs/promises";
// extensions/matrix/src/matrix/account-state-schema-doctor.ts
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
// extensions/matrix/src/matrix/monitor/inbound-dedupe-migration.ts
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
/** Import committed replay markers as ingress tombstones without replaying payloads. */
async function importInboundDedupeMarkersToIngress(params) {
	const openQueue = resolveMatrixIngressQueueOpener(params.context);
	const queues = /* @__PURE__ */ new Map();
	const now = Date.now();
	const newestByKey = /* @__PURE__ */ new Map();
	for (const marker of params.markers) {
		const accountId = marker.accountId.trim() || "default";
		const eventId = marker.eventId.trim();
		if (!marker.roomId.trim() || !eventId) continue;
		const key = JSON.stringify([accountId, eventId]);
		const existing = newestByKey.get(key);
		if (!existing || marker.ts > existing.ts) newestByKey.set(key, {
			...marker,
			accountId,
			eventId
		});
	}
	let imported = 0;
	for (const marker of newestByKey.values()) {
		if (now - marker.ts >= MATRIX_INBOUND_DEDUPE_TTL_MS) continue;
		let queue = queues.get(marker.accountId);
		if (!queue) {
			queue = openQueue({ accountId: marker.accountId });
			queues.set(marker.accountId, queue);
		}
		if (await queue.complete(marker.eventId, { completedAt: marker.ts })) imported++;
	}
	return {
		imported,
		total: newestByKey.size
	};
}
function resolveMatrixIngressQueueOpener(context) {
	const openQueue = context.channelIngressQueues?.find((entry) => entry.channelId === "matrix")?.openChannelIngressQueue;
	if (!openQueue) throw new Error("Matrix ingress migration requires the host-owned ingress queue");
	return openQueue;
}
const MATRIX_INBOUND_DEDUPE_TTL_MS = 2592e6;
const MATRIX_INBOUND_DEDUPE_STATE_MAX_ENTRIES = 2e4;
const MATRIX_INBOUND_DEDUPE_STATE_NAMESPACE = `matrix.inbound-dedupe.${createHash("sha256").update("global").digest("hex").slice(0, 32)}`;
function readReplayGuardRows(context) {
	const read = context.readPluginStateEntriesInKeyRange;
	if (!read) throw new Error("Matrix ingress migration requires the host-owned plugin-state reader");
	const rows = [];
	let after;
	for (;;) {
		const batch = read(MATRIX_INBOUND_DEDUPE_STATE_NAMESPACE, {
			prefix: "",
			after,
			limit: 512
		});
		rows.push(...batch);
		const last = batch.at(-1);
		if (batch.length < 512 || !last) return rows;
		after = last.key;
	}
}
function parseReplayGuardMarker(value) {
	if (!isRecord(value) || typeof value.key !== "string") return null;
	const [accountId, roomId, eventId, extra] = value.key.split("\0");
	const ts = normalizeLegacyTimestamp(value.seenAt);
	return accountId && roomId && eventId && extra === void 0 && ts !== null ? {
		accountId,
		roomId,
		eventId,
		ts
	} : null;
}
const matrixReplayGuardIngressMigration = {
	id: "matrix-replay-guard-to-ingress",
	label: "Matrix inbound replay markers",
	collectBackupResources: () => [],
	detectLegacyState({ context }) {
		return readReplayGuardRows(context).length > 0 ? { preview: ["Move committed Matrix event identities into the durable ingress spool."] } : null;
	},
	async migrateLegacyState({ context, env }) {
		const rows = readReplayGuardRows(context);
		if (rows.length === 0) return {
			changes: [],
			warnings: []
		};
		const result = await importInboundDedupeMarkersToIngress({
			context,
			markers: rows.flatMap((row) => {
				const marker = parseReplayGuardMarker(row.value);
				return marker ? [marker] : [];
			})
		});
		const store = context.openPluginStateKeyedStore({
			namespace: MATRIX_INBOUND_DEDUPE_STATE_NAMESPACE,
			maxEntries: MATRIX_INBOUND_DEDUPE_STATE_MAX_ENTRIES,
			defaultTtlMs: MATRIX_INBOUND_DEDUPE_TTL_MS,
			env
		});
		for (const row of rows) await store.delete(row.key);
		return {
			changes: [`Migrated Matrix replay markers to the durable ingress spool (${result.imported} of ${result.total} entries)`],
			warnings: []
		};
	}
};
// extensions/matrix/doctor-contract-api.ts
const registerRecoveryCli = async (params) => {
	const { registerMatrixDoctorCommands } = await import("./.setup/cli-doctor-CoRX0erj.mjs");
	registerMatrixDoctorCommands(params);
};
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
	const { requiresExplicitMatrixDefaultAccount, resolveMatrixDefaultOrOnlyAccountId } = await import("./.setup/account-selection-Cow3TMFO.mjs").then((n) => n.t);
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
		const raw = JSON.parse((0, runtime_doctor_migrations_exports.decodeUtf8Input)(await fs.readFile(source.filePath), "Legacy Matrix credentials"));
		const createdAt = isRecord(raw) && typeof raw.createdAt === "string" && raw.createdAt ? raw.createdAt : (await fs.stat(source.filePath)).mtime.toISOString();
		return normalizeMatrixStoredCredentials(isRecord(raw) ? {
			...raw,
			createdAt
		} : raw, source.accountId);
	} catch (error) {
		if (error instanceof runtime_doctor_migrations_exports.Utf8InputError) throw error;
		return null;
	}
}
async function* readLegacyMatrixSyncCacheSources(stateDir) {
	const { entries } = await walkMatrixStateFiles(stateDir, (name, depth) => name === MATRIX_SYNC_CACHE_FILENAME && (depth === 2 || depth === 4));
	for (const storageRootDir of entries.map((entry) => path.dirname(entry.path)).toSorted()) {
		let payload;
		try {
			payload = await readLegacyMatrixSyncCacheState(storageRootDir);
		} catch (error) {
			if (!(error instanceof runtime_doctor_migrations_exports.Utf8InputError)) throw error;
			yield {
				storageRootDir,
				payload: null,
				error
			};
			continue;
		}
		if (payload) yield {
			storageRootDir,
			payload,
			error: void 0
		};
	}
}
const stateMigrations = [
	{
		id: "matrix-crypto-unsafe-state",
		label: "Matrix crypto unsafe final state",
		async detectLegacyState(params) {
			const { listMatrixCryptoUnsafeState } = await import("./.setup/crypto-unsafe-state-doctor-D3WLE-t4.mjs").then((n) => n.t);
			const roots = await listMatrixCryptoUnsafeState(params.stateDir, { openKeyedStoreV2: params.context.openPluginStateKeyedStore });
			return roots.length > 0 ? { preview: roots.map((root) => `Matrix crypto store is blocked after unsafe final save: ${root}. Run openclaw matrix doctor inspect; recovery is never automatic.`) } : null;
		},
		async migrateLegacyState(params) {
			const { listMatrixCryptoUnsafeState } = await import("./.setup/crypto-unsafe-state-doctor-D3WLE-t4.mjs").then((n) => n.t);
			return {
				changes: [],
				warnings: (await listMatrixCryptoUnsafeState(params.stateDir, { openKeyedStoreV2: params.context.openPluginStateKeyedStore })).map((root) => `Matrix crypto store remains blocked: ${root}. Inspect with openclaw matrix doctor inspect; explicit recovery may roll back keys.`)
			};
		}
	},
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
			let utf8Warnings = 0;
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
				let credentials;
				try {
					credentials = await readLegacyMatrixCredentials(source);
				} catch (error) {
					if (!(error instanceof runtime_doctor_migrations_exports.Utf8InputError)) throw error;
					warnings.push(`${error.message} Left legacy source in place: ${source.filePath}`);
					utf8Warnings++;
					continue;
				}
				if (!credentials) {
					warnings.push(`Left invalid Matrix credential legacy source in place: ${source.filePath}`);
					continue;
				}
				const key = matrixCredentialsStoreKey(source.accountId);
				const stored = await store.lookup(key);
				const archiveSource = () => (0, runtime_doctor_migrations_exports.archiveLegacyStateSource)({
					filePath: source.filePath,
					label: "Matrix credentials",
					changes,
					warnings
				});
				if (isMatrixCredentialRevocation(stored, source.accountId)) {
					changes.push(`Archived revoked Matrix credential legacy source for account ${source.accountId}`);
					await archiveSource();
					continue;
				}
				const existing = normalizeMatrixStoredCredentials(stored, source.accountId);
				if (existing && JSON.stringify(existing) !== JSON.stringify(credentials)) {
					changes.push(`Kept existing Matrix credentials for account ${source.accountId}`);
					await archiveSource();
					continue;
				}
				if (!existing) try {
					if (!await store.registerIfAbsent(key, credentials)) throw new Error("Canonical state appeared during offline import.");
				} catch (error) {
					warnings.push(`Failed importing Matrix credentials for account ${source.accountId}: ${String(error)}; left legacy source in place`);
					continue;
				}
				changes.push(`Migrated Matrix credentials for account ${source.accountId} to SQLite`);
				await archiveSource();
			}
			return {
				changes,
				warnings,
				...utf8Warnings > 0 && utf8Warnings === warnings.length ? { warningDisposition: "recoverable" } : {}
			};
		}
	},
	{
		id: "matrix-inbound-dedupe-to-claimable-dedupe",
		label: "Matrix inbound dedupe markers",
		sqliteOnly: { family: "state" },
		async detectLegacyState(params) {
			const sources = await collectMatrixInboundDedupeSources(params.stateDir);
			if (sources.status === "complete" && sources.sqliteRoots.length === 0) return null;
			if (await hasCompletedMatrixInboundDedupeMigration(params.context, params.env)) return null;
			const pending = { preview: ["Matrix inbound dedupe legacy sources need a one-time migration scan"] };
			if (sources.status === "incomplete") return pending;
			for (const storageRootDir of sources.sqliteRoots) if ((await readLegacyInboundDedupeSqliteSource(storageRootDir)).legacyRowCount > 0) return pending;
			return null;
		},
		async migrateLegacyState(params) {
			const sources = await collectMatrixInboundDedupeSources(params.stateDir);
			const changes = [];
			const warnings = [];
			if (await hasCompletedMatrixInboundDedupeMigration(params.context, params.env)) return {
				changes,
				warnings
			};
			if (sources.status === "incomplete") warnings.push(...sources.warnings);
			const recordCompletionIfClean = async () => {
				if (warnings.length > 0) return;
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
				const result = await importInboundDedupeMarkersToIngress({
					context: params.context,
					markers: gathered
				});
				changes.push(`Migrated Matrix inbound dedupe markers to the durable ingress spool (${result.imported} of ${result.total} entries)`);
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
			await recordCompletionIfClean();
			return {
				changes,
				warnings
			};
		}
	},
	matrixReplayGuardIngressMigration,
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
			let utf8Warnings = 0;
			for await (const source of readLegacyMatrixSyncCacheSources(params.stateDir)) {
				if (source.error) {
					warnings.push(`${source.error.message} Left legacy source in place: ${source.storageRootDir}`);
					utf8Warnings++;
					continue;
				}
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
				...notices.length > 0 ? { notices } : {},
				...utf8Warnings > 0 && utf8Warnings === warnings.length ? { warningDisposition: "recoverable" } : {}
			};
		}
	}
];
export { legacyConfigRules, normalizeCompatibilityConfig, registerRecoveryCli, stateMigrations };
