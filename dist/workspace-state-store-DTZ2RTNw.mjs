import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { c as resolveWorkspaceStateIdentity, i as createWorkspaceStateIdentity, n as WorkspaceAliasRepointedError, o as resolveCanonicalWorkspacePath, s as resolveWorkspaceStateAliases } from "./workspace-state-identity-CmGr5k4K.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { t as MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES } from "./workspace-bootstrap-read-BRjL0YJr.mjs";
import { n as formatDoctorStateRepairFailure } from "./state-repair-message-B5Bu99oR.mjs";
import fs, { existsSync } from "node:fs";
import path from "node:path";
//#region src/agents/workspace-file-cache.ts
const MAX_WORKSPACE_FILE_CACHE_BYTES = 6 * MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES;
const MAX_WORKSPACE_FILE_CACHE_ENTRIES = 64;
const workspaceFileCache = /* @__PURE__ */ new Map();
let workspaceFileCacheBytes = 0;
function deleteWorkspaceFileCacheEntry(filePath) {
	const entry = workspaceFileCache.get(filePath);
	if (!entry) return;
	workspaceFileCache.delete(filePath);
	workspaceFileCacheBytes -= entry.sizeBytes;
}
function readWorkspaceFileCache(filePath, identity) {
	const entry = workspaceFileCache.get(filePath);
	if (!entry) return;
	if (entry.identity !== identity) {
		deleteWorkspaceFileCacheEntry(filePath);
		return;
	}
	workspaceFileCache.delete(filePath);
	workspaceFileCache.set(filePath, entry);
	return entry.content;
}
function writeWorkspaceFileCache(params) {
	deleteWorkspaceFileCacheEntry(params.filePath);
	const entry = {
		content: params.content,
		identity: params.identity,
		sizeBytes: Buffer.byteLength(params.content, "utf8")
	};
	workspaceFileCache.set(params.filePath, entry);
	workspaceFileCacheBytes += entry.sizeBytes;
	while (workspaceFileCache.size > MAX_WORKSPACE_FILE_CACHE_ENTRIES || workspaceFileCacheBytes > MAX_WORKSPACE_FILE_CACHE_BYTES) {
		const oldest = workspaceFileCache.keys().next().value;
		if (oldest === void 0) break;
		deleteWorkspaceFileCacheEntry(oldest);
	}
}
function retireWorkspaceFileCache(workspaceRoot) {
	const rootIdentityPath = workspaceRoot.normalize("NFC");
	for (const filePath of workspaceFileCache.keys()) if (isPathInside(rootIdentityPath, filePath.normalize("NFC"))) deleteWorkspaceFileCacheEntry(filePath);
}
const WORKSPACE_ATTESTATION_RECENT_MS = 864e5;
const WORKSPACE_LEGACY_STATE_MIGRATION_KIND = "legacy-workspace-setup-files";
const WORKSPACE_CONTENT_RELOCATION_MIGRATION_KIND = "workspace-content-relocation";
const MAX_WORKSPACE_ATTESTATION_FILENAME_LENGTH = 255;
const SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/u;
const SAFE_ATTESTATION_BASENAME = /^[A-Za-z0-9._-]+\.md$/u;
const WINDOWS_RESERVED_DEVICE_STEMS = /^(?:con|prn|aux|nul|com[0-9]|lpt[0-9])$/iu;
function isSafeWorkspaceAttestationFilename(filename) {
	return filename.length <= MAX_WORKSPACE_ATTESTATION_FILENAME_LENGTH && SAFE_ATTESTATION_BASENAME.test(filename) && !filename.startsWith(".") && !WINDOWS_RESERVED_DEVICE_STEMS.test(filename.split(".")[0] ?? "");
}
function isCanonicalIsoTimestamp(value) {
	const timestamp = new Date(value);
	return Number.isFinite(timestamp.getTime()) && timestamp.toISOString() === value;
}
function assertCanonicalTimestamp(value, label) {
	if (value !== null && !isCanonicalIsoTimestamp(value)) throw new Error(`workspace ${label} timestamp is invalid`);
}
function assertCanonicalIntegerTimestamp(value, label) {
	if (!Number.isSafeInteger(value) || value < 0) throw new Error(`workspace ${label} timestamp is invalid`);
}
function workspacePathEntryExists(workspaceDir) {
	try {
		fs.lstatSync(path.resolve(resolveUserPath(workspaceDir)));
		return true;
	} catch {
		return false;
	}
}
function resolveWorkspaceIdentityFromDatabase(params) {
	const aliases = resolveWorkspaceStateAliases(params.workspaceDir);
	const canonicalIdentity = aliases.at(-1);
	const kysely = getNodeSqliteKysely(params.database.db);
	const rows = executeSqliteQuerySync(params.database.db, kysely.selectFrom("workspace_path_aliases").selectAll().where("alias_key", "in", aliases.map((alias) => alias.workspaceKey))).rows;
	const aliasesByKey = new Map(aliases.map((alias) => [alias.workspaceKey, alias]));
	let storedIdentity;
	for (const row of rows) {
		const alias = aliasesByKey.get(row.alias_key);
		if (!alias || alias.workspacePath !== row.alias_path) throw new Error("workspace path alias key collision");
		const rowIdentity = createWorkspaceStateIdentity(row.workspace_path);
		if (rowIdentity.workspaceKey !== row.workspace_key) throw new Error("workspace path alias target is invalid");
		if (workspacePathEntryExists(params.workspaceDir) && rowIdentity.workspaceKey !== canonicalIdentity.workspaceKey) throw new WorkspaceAliasRepointedError({
			aliasPath: aliases[0].workspacePath,
			storedWorkspacePath: rowIdentity.workspacePath,
			currentWorkspacePath: canonicalIdentity.workspacePath
		});
		if (storedIdentity && storedIdentity.workspaceKey !== rowIdentity.workspaceKey) throw new Error("workspace path aliases resolve to conflicting state");
		storedIdentity = rowIdentity;
	}
	const existingAliasKeys = new Set(rows.map((row) => row.alias_key));
	return {
		identity: storedIdentity ?? canonicalIdentity,
		aliases,
		missingAliasKeys: aliases.map((alias) => alias.workspaceKey).filter((aliasKey) => !existingAliasKeys.has(aliasKey))
	};
}
function registerWorkspaceStateAliasIdentitiesInTransaction(params) {
	assertCanonicalIntegerTimestamp(params.updatedAtMs, "path alias update");
	const kysely = getNodeSqliteKysely(params.database.db);
	for (const alias of params.aliases) {
		const existing = executeSqliteQueryTakeFirstSync(params.database.db, kysely.selectFrom("workspace_path_aliases").selectAll().where("alias_key", "=", alias.workspaceKey));
		if (existing) {
			if (existing.alias_path !== alias.workspacePath || existing.workspace_key !== params.identity.workspaceKey || existing.workspace_path !== params.identity.workspacePath) throw new Error("workspace path alias conflicts with canonical state");
			continue;
		}
		executeSqliteQuerySync(params.database.db, kysely.insertInto("workspace_path_aliases").values({
			alias_key: alias.workspaceKey,
			alias_path: alias.workspacePath,
			workspace_key: params.identity.workspaceKey,
			workspace_path: params.identity.workspacePath,
			updated_at_ms: params.updatedAtMs
		}));
	}
}
function registerWorkspaceStateAliasesInTransaction(params) {
	const aliases = /* @__PURE__ */ new Map();
	for (const workspaceDir of params.workspaceDirs) for (const alias of resolveWorkspaceStateAliases(workspaceDir)) aliases.set(alias.workspaceKey, alias);
	registerWorkspaceStateAliasIdentitiesInTransaction({
		database: params.database,
		identity: params.identity,
		aliases: [...aliases.values()],
		updatedAtMs: params.updatedAtMs
	});
}
function readWorkspaceStateSnapshotFromDatabase(params) {
	const identity = params.identity;
	const kysely = getNodeSqliteKysely(params.database.db);
	const setupRow = executeSqliteQueryTakeFirstSync(params.database.db, kysely.selectFrom("workspace_setup_state").selectAll().where("workspace_key", "=", identity.workspaceKey));
	if (setupRow?.workspace_path != null && setupRow.workspace_path !== identity.workspacePath) throw new Error("workspace state key collision");
	if (setupRow?.version != null && setupRow.version !== 1) throw new Error(formatDoctorStateRepairFailure(`unsupported workspace setup version ${setupRow.version} in ${params.database.path} for ${identity.workspacePath}`, "Use a compatible OpenClaw build that supports this workspace version; preserve the database unchanged."));
	if (setupRow?.version != null) {
		assertCanonicalTimestamp(setupRow.bootstrap_seeded_at, "bootstrap seeded");
		assertCanonicalTimestamp(setupRow.setup_completed_at, "setup completed");
		if (setupRow.updated_at == null) throw new Error("workspace setup update timestamp is invalid");
		assertCanonicalIntegerTimestamp(setupRow.updated_at, "setup update");
	}
	const attestationPresent = setupRow?.attested_at_ms != null;
	const generatedHashes = /* @__PURE__ */ new Map();
	if (setupRow && attestationPresent) {
		assertCanonicalIntegerTimestamp(setupRow.attested_at_ms, "attestation");
		const hashRows = executeSqliteQuerySync(params.database.db, kysely.selectFrom("workspace_generated_bootstrap_hashes").select(["filename", "sha256"]).where("workspace_key", "=", identity.workspaceKey).orderBy("filename", "asc")).rows;
		for (const row of hashRows) {
			if (!isSafeWorkspaceAttestationFilename(row.filename) || !SHA256_HEX_PATTERN.test(row.sha256)) throw new Error("workspace attestation hash row is invalid");
			generatedHashes.set(row.filename, row.sha256);
		}
	}
	const setupExists = setupRow?.version != null;
	return {
		identity,
		setupExists,
		...setupExists && setupRow?.updated_at != null ? { setupUpdatedAtMs: setupRow.updated_at } : {},
		setup: {
			version: 1,
			...setupRow?.bootstrap_seeded_at ? { bootstrapSeededAt: setupRow.bootstrap_seeded_at } : {},
			...setupRow?.setup_completed_at ? { setupCompletedAt: setupRow.setup_completed_at } : {}
		},
		...attestationPresent ? { attestation: {
			attestedAtMs: setupRow.attested_at_ms,
			generatedHashes
		} } : {}
	};
}
//#endregion
//#region src/agents/workspace-state-store.ts
async function readWorkspaceStateSnapshot(workspaceDir, options = {}) {
	if (options.readOnly) {
		const capturedWorkspaceDir = path.resolve(resolveUserPath(workspaceDir));
		const reply = await executeExistingOpenClawStateRead(options, {
			type: "workspace.snapshot",
			workspaceDir: capturedWorkspaceDir
		});
		if (reply && (!reply.ok || reply.type !== "workspace.snapshot")) throw new Error("Unexpected workspace state snapshot result");
		return reply?.snapshot ?? {
			identity: resolveWorkspaceStateIdentity(capturedWorkspaceDir),
			setupExists: false,
			setup: { version: 1 }
		};
	}
	const database = openOpenClawStateDatabase(options);
	const initial = runSqliteDeferredTransactionSync(database.db, () => {
		const resolution = resolveWorkspaceIdentityFromDatabase({
			workspaceDir,
			database
		});
		return {
			resolution,
			snapshot: readWorkspaceStateSnapshotFromDatabase({
				identity: resolution.identity,
				database
			})
		};
	});
	if (initial.resolution.missingAliasKeys.length === 0 || !initial.snapshot.setupExists && !initial.snapshot.attestation) return initial.snapshot;
	return runOpenClawStateWriteTransaction((writeDatabase) => {
		options.assertCurrent?.();
		const currentAliases = resolveWorkspaceStateAliases(workspaceDir);
		const currentCanonicalIdentity = currentAliases.at(-1);
		if (workspacePathEntryExists(workspaceDir) && currentCanonicalIdentity.workspaceKey !== initial.resolution.identity.workspaceKey) throw new WorkspaceAliasRepointedError({
			aliasPath: currentAliases[0].workspacePath,
			storedWorkspacePath: initial.resolution.identity.workspacePath,
			currentWorkspacePath: currentCanonicalIdentity.workspacePath
		});
		const snapshot = readWorkspaceStateSnapshotFromDatabase({
			identity: initial.resolution.identity,
			database: writeDatabase
		});
		if (snapshot.setupExists || snapshot.attestation) {
			const aliases = new Map([...initial.resolution.aliases, ...currentAliases].map((alias) => [alias.workspaceKey, alias]));
			registerWorkspaceStateAliasIdentitiesInTransaction({
				database: writeDatabase,
				identity: initial.resolution.identity,
				aliases: [...aliases.values()],
				updatedAtMs: Date.now()
			});
		}
		return snapshot;
	}, options);
}
async function mergeWorkspaceSetupState(workspaceDir, next, nowMs = Date.now(), options = {}) {
	assertCanonicalIntegerTimestamp(nowMs, "setup update");
	if (next.bootstrapSeededAt) assertCanonicalTimestamp(next.bootstrapSeededAt, "bootstrap seeded");
	if (next.setupCompletedAt) assertCanonicalTimestamp(next.setupCompletedAt, "setup completed");
	return runOpenClawStateWriteTransaction((database) => {
		options.assertCurrent?.();
		const resolution = resolveWorkspaceIdentityFromDatabase({
			workspaceDir,
			database
		});
		const identity = resolution.identity;
		const snapshot = readWorkspaceStateSnapshotFromDatabase({
			identity,
			database
		});
		const bootstrapSeededAt = snapshot.setup.bootstrapSeededAt ?? next.bootstrapSeededAt;
		const setupCompletedAt = snapshot.setup.setupCompletedAt ?? next.setupCompletedAt;
		const merged = {
			version: 1,
			...bootstrapSeededAt ? { bootstrapSeededAt } : {},
			...setupCompletedAt ? { setupCompletedAt } : {}
		};
		const kysely = getNodeSqliteKysely(database.db);
		executeSqliteQuerySync(database.db, kysely.insertInto("workspace_setup_state").values({
			workspace_key: identity.workspaceKey,
			workspace_path: identity.workspacePath,
			version: 1,
			bootstrap_seeded_at: merged.bootstrapSeededAt ?? null,
			setup_completed_at: merged.setupCompletedAt ?? null,
			updated_at: nowMs
		}).onConflict((conflict) => conflict.column("workspace_key").doUpdateSet({
			workspace_path: identity.workspacePath,
			version: 1,
			bootstrap_seeded_at: merged.bootstrapSeededAt ?? null,
			setup_completed_at: merged.setupCompletedAt ?? null,
			updated_at: nowMs
		})));
		registerWorkspaceStateAliasIdentitiesInTransaction({
			database,
			identity,
			aliases: resolution.aliases,
			updatedAtMs: nowMs
		});
		return merged;
	}, options);
}
async function replaceWorkspaceAttestation(params) {
	assertCanonicalIntegerTimestamp(params.attestedAtMs, "attestation");
	if (params.nowMs !== void 0) assertCanonicalIntegerTimestamp(params.nowMs, "attestation update");
	for (const [filename, sha256] of params.generatedHashes) if (!isSafeWorkspaceAttestationFilename(filename) || !SHA256_HEX_PATTERN.test(sha256)) throw new Error("workspace attestation hash is invalid");
	const sortedHashes = [...params.generatedHashes.entries()].toSorted(([left], [right]) => left.localeCompare(right));
	return runOpenClawStateWriteTransaction((database) => {
		params.assertCurrent?.();
		const updatedAtMs = params.nowMs ?? Date.now();
		assertCanonicalIntegerTimestamp(updatedAtMs, "attestation update");
		const resolution = resolveWorkspaceIdentityFromDatabase({
			workspaceDir: params.workspaceDir,
			database
		});
		const identity = resolution.identity;
		const snapshot = readWorkspaceStateSnapshotFromDatabase({
			identity,
			database
		});
		if (snapshot.attestation && snapshot.attestation.attestedAtMs > params.attestedAtMs && snapshot.attestation.attestedAtMs <= updatedAtMs) {
			registerWorkspaceStateAliasIdentitiesInTransaction({
				database,
				identity,
				aliases: resolution.aliases,
				updatedAtMs
			});
			return snapshot.attestation;
		}
		const kysely = getNodeSqliteKysely(database.db);
		executeSqliteQuerySync(database.db, kysely.insertInto("workspace_setup_state").values({
			workspace_key: identity.workspaceKey,
			workspace_path: identity.workspacePath,
			attested_at_ms: params.attestedAtMs,
			attestation_updated_at_ms: updatedAtMs
		}).onConflict((conflict) => conflict.column("workspace_key").doUpdateSet({
			workspace_path: identity.workspacePath,
			attested_at_ms: params.attestedAtMs,
			attestation_updated_at_ms: updatedAtMs
		})));
		executeSqliteQuerySync(database.db, kysely.deleteFrom("workspace_generated_bootstrap_hashes").where("workspace_key", "=", identity.workspaceKey));
		if (sortedHashes.length > 0) executeSqliteQuerySync(database.db, kysely.insertInto("workspace_generated_bootstrap_hashes").values(sortedHashes.map(([filename, sha256]) => ({
			workspace_key: identity.workspaceKey,
			filename,
			sha256
		}))));
		registerWorkspaceStateAliasIdentitiesInTransaction({
			database,
			identity,
			aliases: resolution.aliases,
			updatedAtMs
		});
		return {
			attestedAtMs: params.attestedAtMs,
			generatedHashes: new Map(sortedHashes)
		};
	});
}
function deleteWorkspaceRows(database, { workspaceKey, workspacePath }) {
	const kysely = getNodeSqliteKysely(database.db);
	const receiptRows = executeSqliteQuerySync(database.db, kysely.selectFrom("migration_sources").select([
		"source_key",
		"last_run_id",
		"report_json"
	]).where("migration_kind", "in", [WORKSPACE_LEGACY_STATE_MIGRATION_KIND, WORKSPACE_CONTENT_RELOCATION_MIGRATION_KIND])).rows.filter((row) => {
		try {
			return JSON.parse(row.report_json).workspaceKey === workspaceKey;
		} catch {
			return false;
		}
	});
	if (receiptRows.length > 0) {
		const receiptKeys = receiptRows.map((row) => row.source_key);
		executeSqliteQuerySync(database.db, kysely.deleteFrom("migration_sources").where("source_key", "in", receiptKeys));
		const runIds = [...new Set(receiptRows.map((row) => row.last_run_id))];
		const referencedRunIds = new Set(executeSqliteQuerySync(database.db, kysely.selectFrom("migration_sources").select("last_run_id").where("last_run_id", "in", runIds)).rows.map((row) => row.last_run_id));
		const orphanedRunIds = runIds.filter((runId) => !referencedRunIds.has(runId));
		if (orphanedRunIds.length > 0) executeSqliteQuerySync(database.db, kysely.deleteFrom("migration_runs").where("id", "in", orphanedRunIds));
	}
	executeSqliteQuerySync(database.db, kysely.deleteFrom("workspace_generated_bootstrap_hashes").where("workspace_key", "=", workspaceKey));
	executeSqliteQuerySync(database.db, kysely.deleteFrom("workspace_setup_state").where("workspace_key", "=", workspaceKey));
	executeSqliteQuerySync(database.db, kysely.deleteFrom("workspace_path_aliases").where("workspace_key", "=", workspaceKey));
	deferSqlitePostCommitPublication(database.db, () => retireWorkspaceFileCache(workspacePath));
}
/** The migration owner has verified the same workspace and every relocated byte before this commit. */
function retireWorkspaceRelocationAttestation(params) {
	const snapshot = readWorkspaceStateSnapshotFromDatabase(params);
	if (snapshot.setupExists || snapshot.attestation?.attestedAtMs !== params.attestedAtMs || snapshot.attestation.generatedHashes.size > 0) return false;
	executeSqliteQuerySync(params.database.db, getNodeSqliteKysely(params.database.db).updateTable("workspace_setup_state").set({
		attested_at_ms: null,
		attestation_updated_at_ms: null
	}).where("workspace_key", "=", params.identity.workspaceKey));
	return true;
}
/** Clear expired state only when no concurrent writer refreshed the vanished workspace. */
async function clearExpiredWorkspaceStateForVanishedWorkspace(workspaceDir, nowMs = Date.now(), options = {}) {
	assertCanonicalIntegerTimestamp(nowMs, "workspace expiry check");
	return runOpenClawStateWriteTransaction((database) => {
		options.assertCurrent?.();
		const resolution = resolveWorkspaceIdentityFromDatabase({
			workspaceDir,
			database
		});
		const identity = resolution.identity;
		const snapshot = readWorkspaceStateSnapshotFromDatabase({
			identity,
			database
		});
		const preserveRecentState = () => {
			registerWorkspaceStateAliasIdentitiesInTransaction({
				database,
				identity,
				aliases: resolution.aliases,
				updatedAtMs: nowMs
			});
			return false;
		};
		if (snapshot.attestation) {
			if (nowMs - snapshot.attestation.attestedAtMs <= 864e5) return preserveRecentState();
		}
		if ((snapshot.setup.bootstrapSeededAt || snapshot.setup.setupCompletedAt) && snapshot.setupUpdatedAtMs !== void 0) {
			if (nowMs - snapshot.setupUpdatedAtMs <= 864e5) return preserveRecentState();
		}
		deleteWorkspaceRows(database, identity);
		return true;
	});
}
/** Capture workspace identity before the filesystem entry is removed. */
function prepareWorkspaceStateDeletion(workspaceDir) {
	const aliases = resolveWorkspaceStateAliases(workspaceDir);
	return {
		cacheRoot: resolveCanonicalWorkspacePath(workspaceDir),
		lexicalAlias: aliases[0],
		currentCanonicalIdentity: aliases.at(-1),
		pathEntryExisted: workspacePathEntryExists(workspaceDir)
	};
}
async function deleteWorkspaceState(plan, options = {}) {
	if (!existsSync(resolveOpenClawStateSqlitePath())) {
		options.assertCurrent?.();
		retireWorkspaceFileCache(plan.cacheRoot);
		return;
	}
	runOpenClawStateWriteTransaction((database) => {
		options.assertCurrent?.();
		const { lexicalAlias, currentCanonicalIdentity } = plan;
		const kysely = getNodeSqliteKysely(database.db);
		const storedAlias = executeSqliteQueryTakeFirstSync(database.db, kysely.selectFrom("workspace_path_aliases").selectAll().where("alias_key", "=", lexicalAlias.workspaceKey));
		if (storedAlias && storedAlias.alias_path !== lexicalAlias.workspacePath) throw new Error("workspace path alias key collision");
		const storedIdentity = storedAlias ? createWorkspaceStateIdentity(storedAlias.workspace_path) : void 0;
		if (storedIdentity && storedIdentity.workspaceKey !== storedAlias?.workspace_key) throw new Error("workspace path alias target is invalid");
		if (storedIdentity && plan.pathEntryExisted && storedIdentity.workspaceKey !== currentCanonicalIdentity.workspaceKey) {
			executeSqliteQuerySync(database.db, kysely.deleteFrom("workspace_path_aliases").where("alias_key", "=", lexicalAlias.workspaceKey));
			return deleteWorkspaceRows(database, resolveWorkspaceIdentityFromDatabase({
				workspaceDir: currentCanonicalIdentity.workspacePath,
				database
			}).identity);
		}
		if (storedIdentity) return deleteWorkspaceRows(database, storedIdentity);
		return deleteWorkspaceRows(database, resolveWorkspaceIdentityFromDatabase({
			workspaceDir: currentCanonicalIdentity.workspacePath,
			database
		}).identity);
	});
}
//#endregion
export { writeWorkspaceFileCache as _, readWorkspaceStateSnapshot as a, WORKSPACE_ATTESTATION_RECENT_MS as c, isSafeWorkspaceAttestationFilename as d, readWorkspaceStateSnapshotFromDatabase as f, retireWorkspaceFileCache as g, readWorkspaceFileCache as h, prepareWorkspaceStateDeletion as i, WORKSPACE_CONTENT_RELOCATION_MIGRATION_KIND as l, registerWorkspaceStateAliasesInTransaction as m, deleteWorkspaceState as n, replaceWorkspaceAttestation as o, registerWorkspaceStateAliasIdentitiesInTransaction as p, mergeWorkspaceSetupState as r, retireWorkspaceRelocationAttestation as s, clearExpiredWorkspaceStateForVanishedWorkspace as t, WORKSPACE_LEGACY_STATE_MIGRATION_KIND as u };
