import { Fn as object, Jn as string, Nt as array } from "./schemas-BOYIvvln.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { a as isPrimarySessionTranscriptFileName, m as resolveTrajectoryPointerPath, p as resolveTrajectoryPath } from "./artifacts-C9weQ_MG.mjs";
import { c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import { i as recordLegacyMigrationReceipt, r as readLegacyMigrationReceiptFromDatabase, s as resolveLegacyMigrationSourceKey } from "./state-migrations.receipts-D6lbWbKJ.mjs";
import { s as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Dcog4O-M.mjs";
import { C as readMigrationArtifactIdentity, T as statMigrationPath, b as MigrationArtifactSchema, f as readSessionSqliteMigrationManifest, h as resolveSessionSqliteMigrationRunsDir, i as canonicalMigrationFilePath, o as filterRestoreManifestTargets, u as listSessionSqliteMigrationManifestPaths, w as sameMigrationArtifact } from "./doctor-session-sqlite-migration-run-Dta_SQ4O.mjs";
import { c as isLegacySessionRecordOwnedByTarget, d as resolveLegacyTranscriptPaths, f as shouldFilterLegacySessionRecordsByTarget, n as verifyCanonicalSessionTranscriptSources, u as readLegacySessionStoreEntries } from "./doctor-session-sqlite-verification-DgNenNCo.mjs";
import { a as readLegacyPrimaryTranscriptIdentity, o as readOnlySqliteDbStats, s as readOnlySqliteValidationSnapshot } from "./doctor-session-sqlite-readers-un_PyUoF.mjs";
import { s as recordStartupMigrationWarnings } from "./state-migrations.messages-Sd7IFIbe.mjs";
import fs from "node:fs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/infra/deferred-plugin-session-verification.ts
/** A replaced database cannot inherit completed-import authority from an old inode. */
function verifyDeferredSessionDatabase(params) {
	const target = {
		...params.target,
		sqlitePath: params.sqlitePath
	};
	const snapshot = readOnlySqliteValidationSnapshot(target);
	const stats = readOnlySqliteDbStats(target);
	if (!snapshot.ok || !stats.ok || stats.stats.integrityCheck !== "ok") throw new Error(`Cannot verify retained session history against ${params.sqlitePath}; inspect SQLite integrity with openclaw doctor --session-sqlite validate. Sources remain protected.`);
	const resolved = new Map(params.sources.map((source) => [source.originalPath, source.path]));
	const indexPath = resolved.get(path.resolve(target.storePath));
	const issues = [];
	const records = indexPath ? readLegacySessionStoreEntries(target, issues, { sourcePath: indexPath }).entries.map(({ entry, sessionKey }) => ({
		entry,
		sessionKey,
		transcriptPath: resolveLegacyTranscriptPaths(target, entry).transcriptPath
	})) : [];
	if (issues.some((issue) => issue.code !== "entry_invalid")) throw new Error(`Cannot verify retained session index ${target.storePath}; preserve the source and inspect it with openclaw doctor --session-sqlite validate.`);
	for (const record of records) {
		if (shouldFilterLegacySessionRecordsByTarget(target) && !isLegacySessionRecordOwnedByTarget(params.cfg, target, record.sessionKey)) continue;
		if (snapshot.snapshot.sessionKeysBySessionId.get(record.entry.sessionId) !== record.sessionKey) throw new Error(`Retained session ${record.sessionKey} is not present in ${params.sqlitePath}; sources remain protected. Compare a verified database backup before retrying recovery; canonical edits and deletions were not replayed.`);
	}
	for (const source of params.sources) {
		if (!isPrimarySessionTranscriptFileName(path.basename(source.originalPath))) continue;
		const sourcePath = resolved.get(source.originalPath);
		const sessionId = records.find((candidate) => candidate.transcriptPath === source.originalPath)?.entry.sessionId ?? (sourcePath && readLegacyPrimaryTranscriptIdentity(sourcePath, source.originalPath)?.sessionId);
		if (!sourcePath || !sessionId || !snapshot.snapshot.sessionKeysBySessionId.has(sessionId) || !verifyCanonicalSessionTranscriptSources({
			target,
			sources: [{
				path: sourcePath,
				originalPath: source.originalPath,
				sessionId
			}],
			env: params.env
		})) throw new Error(`Retained transcript ${source.path} is not complete in ${params.sqlitePath}; source remains protected. Compare a verified database backup before retrying recovery; canonical history was not overwritten.`);
	}
}
//#endregion
//#region src/infra/deferred-plugin-session-sources.ts
const RECEIPT_KIND = "deferred-plugin-session-import";
const receiptSchema = object({
	databaseIdentity: string(),
	pluginIds: array(string()),
	sources: array(object({
		path: string(),
		identity: MigrationArtifactSchema.shape.identity
	}))
});
/** Capture originals before deferral; settlement may only archive these verified identities. */
function captureDeferredPluginSessionSources(params) {
	const sources = /* @__PURE__ */ new Map([[path.resolve(params.storePath), params.indexIdentity]]);
	for (const file of params.unreferencedJsonlFiles) if (!params.referencedPaths?.has(canonicalMigrationFilePath(file))) sources.set(path.resolve(file), readMigrationArtifactIdentity(file));
	for (const record of params.records) {
		if (!record.transcriptPath || !record.sourceFingerprint) continue;
		sources.set(path.resolve(record.transcriptPath), readMigrationArtifactIdentity(record.transcriptPath, 1n, record.sourceFingerprint));
		for (const file of [resolveTrajectoryPath(record.transcriptPath), resolveTrajectoryPointerPath(record.transcriptPath)]) if (file && fs.existsSync(file)) sources.set(path.resolve(file), readMigrationArtifactIdentity(file));
	}
	return [...sources].map(([sourcePath, identity]) => ({
		path: sourcePath,
		identity
	}));
}
function deferredPluginSessionStoreIds(params) {
	if (params.target.storePath.endsWith(".sqlite")) return [];
	return params.pending.map((pending) => pending.pluginId);
}
/** File-era repair must not rewrite an original that a deferred owner still needs. */
function preserveDeferredPluginSessionSource(params) {
	if (deferredPluginSessionStoreIds(params).length > 0) return true;
	const sqlite = resolveSqliteTargetFromSessionStorePath(params.target.storePath, {
		agentId: params.target.agentId,
		env: params.env
	});
	return readDeferredPluginSessionImport({
		cfg: params.cfg,
		target: params.target,
		sqlitePath: params.target.sqlitePath ?? sqlite.path,
		env: params.env
	}) !== void 0;
}
function sourceKey(target) {
	return resolveLegacyMigrationSourceKey(RECEIPT_KIND, target.storePath, `${target.agentId}\0${path.resolve(target.sqlitePath)}`);
}
function databaseIdentity(sqlitePath) {
	const file = fs.lstatSync(sqlitePath, { bigint: true });
	if (!file.isFile()) throw new Error("The imported session database is no longer a regular file.");
	return `${file.dev}:${file.ino}`;
}
function collectArchivedSources(target, env) {
	const archives = /* @__PURE__ */ new Map();
	for (const manifestPath of listSessionSqliteMigrationManifestPaths(env)) {
		const manifest = readSessionSqliteMigrationManifest(manifestPath);
		if (!manifest) continue;
		for (const candidate of filterRestoreManifestTargets(manifest, [target])) for (const move of candidate.plannedMoves) if (move.artifact) {
			const paths = archives.get(move.sourcePath) ?? [];
			paths.push({
				path: move.archivePath,
				identity: move.artifact.identity
			});
			archives.set(move.sourcePath, paths);
		}
	}
	return archives;
}
function existingSessionSourcePaths(sourcePath, target, env, archives) {
	return statMigrationPath(sourcePath) ? [sourcePath] : ((archives ?? collectArchivedSources(target, env)).get(sourcePath) ?? []).map((source) => source.path).filter((source) => statMigrationPath(source));
}
/** Receipt verification and retained counting share one synchronous phase; publication revalidates. */
function prepareSessionSourceVerification(params) {
	const verification = /* @__PURE__ */ new Map();
	return {
		cfg: params.cfg,
		target: params.target,
		resolvedTarget: {
			agentId: params.target.agentId,
			storePath: params.target.storePath,
			sqlitePath: params.sqlitePath
		},
		sqlitePath: params.sqlitePath,
		env: params.env,
		verification
	};
}
function resolveVerifiedSessionSource(source, target, env, verification = /* @__PURE__ */ new Map()) {
	const targetKey = JSON.stringify([sourceKey(target), resolveSessionSqliteMigrationRunsDir(env)]);
	let cachedTarget = verification.get(targetKey);
	if (!cachedTarget) {
		cachedTarget = { resolved: /* @__PURE__ */ new Map() };
		verification.set(targetKey, cachedTarget);
	}
	const resolutions = cachedTarget.resolved.get(source.path) ?? [];
	const cached = resolutions.find(({ identity }) => sameMigrationArtifact(identity, source.identity));
	if (cached) return cached.path;
	const resolved = statMigrationPath(source.path) ? sameSourceContent(readMigrationArtifactIdentity(source.path), source.identity) ? source.path : void 0 : (cachedTarget.archives ??= collectArchivedSources(target, env)).get(source.path)?.find(({ identity, path: archivePath }) => identity.sha256 === source.identity.sha256 && identity.size === source.identity.size && statMigrationPath(archivePath) && sameSourceContent(readMigrationArtifactIdentity(archivePath), source.identity))?.path;
	resolutions.push({
		identity: { ...source.identity },
		path: resolved
	});
	cachedTarget.resolved.set(source.path, resolutions);
	return resolved;
}
function sameSourceContent(left, right) {
	return left.sha256 === right.sha256 && left.size === right.size;
}
function assertVerifiedSessionSources(params, receipt, verification = /* @__PURE__ */ new Map(), onSourceConflict) {
	const target = {
		...params.target,
		sqlitePath: params.sqlitePath
	};
	const verifiedPaths = /* @__PURE__ */ new Map();
	let conflictArchives;
	for (const source of receipt.sources) {
		let verifiedPath;
		try {
			verifiedPath = resolveVerifiedSessionSource(source, target, params.env, verification);
		} catch (error) {
			if (!onSourceConflict) throw error;
		}
		if (!verifiedPath) {
			if (onSourceConflict) {
				onSourceConflict(source.path);
				for (const artifactPath of existingSessionSourcePaths(source.path, target, params.env, conflictArchives ??= collectArchivedSources(target, params.env))) if (artifactPath !== source.path) onSourceConflict(source.path, artifactPath);
				continue;
			}
			throw new Error(`Retained session migration source changed: ${source.path}. Resolve the source conflict before running openclaw doctor --fix again; the verified import was not replayed.`);
		}
		verifiedPaths.set(source.path, verifiedPath);
	}
	const index = receipt.sources.find((source) => source.path === path.resolve(params.target.storePath));
	const sourcePath = index && verifiedPaths.get(index.path);
	if ((!index || onSourceConflict && !sourcePath) && !statMigrationPath(params.target.storePath)) return;
	if (!index || !sourcePath) throw new Error("A deferred session import requires its verified original index.");
	const issues = [];
	const source = readLegacySessionStoreEntries(params.target, issues, { sourcePath });
	if (issues.some((issue) => issue.code !== "entry_invalid") || !source.bytes || source.bytes.length !== index.identity.size || createHash("sha256").update(source.bytes).digest("hex") !== index.identity.sha256) throw new Error(`Retained session migration source changed: ${params.target.storePath}`);
	for (const { entry, sessionKey } of source.entries) {
		if (shouldFilterLegacySessionRecordsByTarget(params.target) && !isLegacySessionRecordOwnedByTarget(params.cfg, params.target, sessionKey)) continue;
		const { transcriptCandidates } = resolveLegacyTranscriptPaths(params.target, entry);
		if (transcriptCandidates.some((candidate) => verifiedPaths.has(path.resolve(candidate)) || onSourceConflict && receipt.sources.some((recordedSource) => recordedSource.path === path.resolve(candidate)))) continue;
		for (const candidate of transcriptCandidates) if (statMigrationPath(candidate)) throw new Error(`Retained session migration source changed: ${candidate}. A previously unimported transcript appeared; preserve it and resolve the source conflict before running openclaw doctor --fix again.`);
	}
}
/** A completed core import remains authoritative after canonical sessions change or are deleted. */
function readDeferredPluginSessionImport(params) {
	const receipt = readSessionImportReceipt(params);
	if (!receipt) return;
	let recorded = parseSessionImportReceipt(params, receipt, params.purpose);
	if (params.allowMissingIndex && !statMigrationPath(params.target.storePath)) recorded = {
		...recorded,
		sources: recorded.sources.filter((source) => source.path !== path.resolve(params.target.storePath) || resolveVerifiedSessionSource(source, {
			...params.target,
			sqlitePath: params.sqlitePath
		}, params.env, params.verification) || existingSessionSourcePaths(source.path, {
			...params.target,
			sqlitePath: params.sqlitePath
		}, params.env).length > 0)
	};
	assertVerifiedSessionSources(params, recorded, params.verification, params.onSourceConflict);
	return recorded;
}
function hasDeferredPluginSessionImport(params) {
	return Boolean(readSessionImportReceipt(params));
}
function readSessionImportReceipt(params) {
	const target = {
		...params.target,
		sqlitePath: params.sqlitePath
	};
	const read = (db) => tableExists(db, "migration_sources") ? readLegacyMigrationReceiptFromDatabase(db, sourceKey(target)) : void 0;
	return params.database ? read(params.database) : withExistingOpenClawStateDatabaseReadOnly(({ db }) => read(db), { env: params.env });
}
function parseSessionImportReceipt(params, receipt, purpose) {
	const recorded = receiptSchema.parse(JSON.parse(receipt.reportJson));
	if (recorded.databaseIdentity !== databaseIdentity(params.sqlitePath)) {
		if (purpose !== "readiness") throw new Error("The verified session import database changed; run openclaw doctor --session-sqlite recover to verify the retained sources against the current database.");
		recordStartupMigrationWarnings(["Retained session import database identity changed; sources remain protected. Run openclaw doctor --session-sqlite recover to revalidate the receipt."]);
	}
	return recorded;
}
/** Rebuild only derived source evidence; retain the original index hash and every conflict. */
function rebuildDeferredPluginSessionSourceIndex(params) {
	const receipt = readSessionImportReceipt(params);
	if (!receipt) return false;
	const recorded = receiptSchema.parse(JSON.parse(receipt.reportJson));
	const currentDatabaseIdentity = databaseIdentity(params.sqlitePath);
	const target = {
		...params.target,
		sqlitePath: params.sqlitePath
	};
	const index = recorded.sources.find((source) => source.path === path.resolve(target.storePath));
	const archives = collectArchivedSources(target, params.env);
	const missingIndex = index && existingSessionSourcePaths(index.path, target, params.env, archives).length === 0;
	const sources = recorded.sources.filter((source) => !missingIndex || source !== index).map((source) => {
		const candidates = statMigrationPath(source.path) ? [source.path] : (archives.get(source.path) ?? []).map((archive) => archive.path);
		for (const candidate of candidates) {
			if (!statMigrationPath(candidate)) continue;
			try {
				const identity = readMigrationArtifactIdentity(candidate);
				if (identity.size === source.identity.size && identity.sha256 === source.identity.sha256) return {
					path: source.path,
					identity
				};
			} catch {}
		}
		return source;
	});
	if (currentDatabaseIdentity !== recorded.databaseIdentity) {
		assertVerifiedSessionSources(params, {
			...recorded,
			sources
		});
		verifyDeferredSessionDatabase({
			...params,
			sources: sources.map((source) => ({
				originalPath: source.path,
				path: resolveVerifiedSessionSource(source, target, params.env)
			}))
		});
	}
	const rebuilt = {
		...recorded,
		databaseIdentity: currentDatabaseIdentity,
		sources
	};
	if (isDeepStrictEqual(rebuilt, recorded)) return false;
	runOpenClawStateWriteTransaction(({ db }) => {
		const current = readSessionImportReceipt({
			...params,
			database: db
		});
		if (!isDeepStrictEqual(current, receipt) || databaseIdentity(params.sqlitePath) !== currentDatabaseIdentity) throw new Error("Deferred session import changed before its source index was rebuilt.");
		const reportJson = JSON.stringify(rebuilt);
		const query = getNodeSqliteKysely(db);
		executeSqliteQuerySync(db, query.updateTable("migration_sources").set({ report_json: reportJson }).where("source_key", "=", receipt.sourceKey));
		executeSqliteQuerySync(db, query.updateTable("migration_runs").set({ report_json: reportJson }).where("id", "=", receipt.sourceKey));
	}, { env: params.env }, { operationLabel: "state.rebuild-plugin-session-source-index" });
	return true;
}
/** Reuse verified source bytes only within one uninterrupted synchronous migration loop. */
function prepareDeferredPluginSessionImportReader(params) {
	const verified = /* @__PURE__ */ new Map();
	return (database, agentId) => {
		const sourceTarget = {
			...params.target,
			agentId
		};
		const sqlite = resolveSqliteTargetFromSessionStorePath(sourceTarget.storePath, {
			agentId,
			env: params.env
		});
		const target = {
			...sourceTarget,
			sqlitePath: sqlite.path
		};
		const key = sourceKey(target);
		const receipt = readLegacyMigrationReceiptFromDatabase(database, key);
		let prepared = verified.get(key);
		if (!prepared || !isDeepStrictEqual(prepared.receipt, receipt)) {
			prepared = {
				receipt,
				imported: readDeferredPluginSessionImport({
					cfg: params.cfg,
					target: sourceTarget,
					sqlitePath: sqlite.path,
					env: params.env,
					database
				})
			};
			verified.set(key, prepared);
		}
		if (!prepared.imported) return;
		if (prepared.imported.databaseIdentity !== databaseIdentity(target.sqlitePath)) throw new Error("The verified session import database changed; retained source was not replayed.");
		return target;
	};
}
/** Called after full core import validation, before any original can be retired. */
function recordDeferredPluginSessionImport(params) {
	const report = {
		databaseIdentity: databaseIdentity(params.sqlitePath),
		pluginIds: params.pluginIds,
		sources: params.sources
	};
	const index = params.sources.find((source) => source.path === path.resolve(params.target.storePath));
	if (!index) throw new Error("A deferred session import requires its verified original index.");
	runOpenClawStateWriteTransaction(({ db }) => {
		assertVerifiedSessionSources(params, report);
		if (report.databaseIdentity !== databaseIdentity(params.sqlitePath)) throw new Error("Session import database changed before its receipt was recorded.");
		const key = sourceKey({
			...params.target,
			sqlitePath: params.sqlitePath
		});
		recordLegacyMigrationReceipt(db, {
			sourceKey: key,
			migrationKind: RECEIPT_KIND,
			sourcePath: path.resolve(params.target.storePath),
			targetTable: "session_nodes",
			sourceSha256: index.identity.sha256,
			sourceSizeBytes: index.identity.size,
			sourceRecordCount: params.recordCount,
			runId: key,
			reportJson: JSON.stringify(report),
			now: Date.now()
		});
	}, { env: params.env }, { operationLabel: "state.retain-plugin-session-source" });
}
//#endregion
export { prepareSessionSourceVerification as a, rebuildDeferredPluginSessionSourceIndex as c, prepareDeferredPluginSessionImportReader as i, recordDeferredPluginSessionImport as l, deferredPluginSessionStoreIds as n, preserveDeferredPluginSessionSource as o, hasDeferredPluginSessionImport as r, readDeferredPluginSessionImport as s, captureDeferredPluginSessionSources as t, resolveVerifiedSessionSource as u };
