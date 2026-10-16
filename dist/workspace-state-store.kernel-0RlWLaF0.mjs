import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./utils-DgZn2dLu.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import "./sqlite-transaction-DsZ3X6nD.mjs";
import { i as createWorkspaceStateIdentity, n as WorkspaceAliasRepointedError, s as resolveWorkspaceStateAliases } from "./workspace-state-identity-EPAs22n_.mjs";
import { n as formatDoctorStateRepairFailure } from "./state-repair-message-B5Bu99oR.mjs";
import fs from "node:fs";
import path from "node:path";
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
function replaceWorkspaceAttestationInDatabase(database, params) {
	assertCanonicalIntegerTimestamp(params.attestedAtMs, "attestation");
	if (params.nowMs !== void 0) assertCanonicalIntegerTimestamp(params.nowMs, "attestation update");
	for (const [filename, sha256] of params.generatedHashes) if (!isSafeWorkspaceAttestationFilename(filename) || !SHA256_HEX_PATTERN.test(sha256)) throw new Error("workspace attestation hash is invalid");
	const sortedHashes = [...params.generatedHashes.entries()].toSorted(([left], [right]) => left.localeCompare(right));
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
	const committedHashes = snapshot.attestation?.generatedHashes;
	if (committedHashes?.size !== params.generatedHashes.size || sortedHashes.some(([filename, sha256]) => committedHashes.get(filename) !== sha256)) {
		executeSqliteQuerySync(database.db, kysely.deleteFrom("workspace_generated_bootstrap_hashes").where("workspace_key", "=", identity.workspaceKey));
		if (sortedHashes.length > 0) executeSqliteQuerySync(database.db, kysely.insertInto("workspace_generated_bootstrap_hashes").values(sortedHashes.map(([filename, sha256]) => ({
			workspace_key: identity.workspaceKey,
			filename,
			sha256
		}))));
	}
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
}
function deleteWorkspaceStateRowsInDatabase(database, { workspaceKey }) {
	const kysely = getNodeSqliteKysely(database.db);
	const receiptRows = executeSqliteQuerySync(database.db, kysely.selectFrom("migration_sources").select([
		"source_key",
		"last_run_id",
		"report_json"
	]).where("migration_kind", "in", [WORKSPACE_LEGACY_STATE_MIGRATION_KIND, WORKSPACE_CONTENT_RELOCATION_MIGRATION_KIND])).rows.filter((row) => {
		try {
			const report = JSON.parse(row.report_json);
			return isRecord(report) && report.workspaceKey === workspaceKey;
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
}
function recentWorkspaceAttestation(attestation, nowMs = Date.now()) {
	if (!attestation) return;
	if (nowMs - attestation.attestedAtMs > 864e5) return;
	return attestation;
}
function hasWorkspaceSetupStateMarker(state) {
	return Boolean(state.bootstrapSeededAt || state.setupCompletedAt);
}
function hasRecentWorkspaceSetupState(snapshot, nowMs = Date.now()) {
	if (!hasWorkspaceSetupStateMarker(snapshot.setup) || snapshot.setupUpdatedAtMs === void 0) return false;
	return nowMs - snapshot.setupUpdatedAtMs <= WORKSPACE_ATTESTATION_RECENT_MS;
}
//#endregion
export { assertCanonicalTimestamp as a, hasWorkspaceSetupStateMarker as c, recentWorkspaceAttestation as d, registerWorkspaceStateAliasIdentitiesInTransaction as f, workspacePathEntryExists as g, resolveWorkspaceIdentityFromDatabase as h, assertCanonicalIntegerTimestamp as i, isSafeWorkspaceAttestationFilename as l, replaceWorkspaceAttestationInDatabase as m, WORKSPACE_CONTENT_RELOCATION_MIGRATION_KIND as n, deleteWorkspaceStateRowsInDatabase as o, registerWorkspaceStateAliasesInTransaction as p, WORKSPACE_LEGACY_STATE_MIGRATION_KIND as r, hasRecentWorkspaceSetupState as s, WORKSPACE_ATTESTATION_RECENT_MS as t, readWorkspaceStateSnapshotFromDatabase as u };
