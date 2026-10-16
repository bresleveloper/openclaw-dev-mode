import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, o as iterateSqliteQuerySync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { c as readDatabaseIdentityBirthtime, r as databaseFileIdentityKey } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { Fn as object, Jn as string, Nt as array, xn as literal } from "./schemas-BOYIvvln.mjs";
import { f as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { a as isPrimarySessionTranscriptFileName, m as resolveTrajectoryPointerPath, p as resolveTrajectoryPath } from "./artifacts-BvSTVPj-.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { i as readLegacyMigrationReceiptFromDatabase, l as resolveLegacyMigrationSourceKey, o as recordLegacyMigrationReceipt, s as recordLegacyMigrationRun } from "./state-migrations.receipts-gEcgM3Aq.mjs";
import { u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { s as transcriptEventJsonSql } from "./transcript-payload-Yc_w8Yx5.mjs";
import { o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { p as runExclusiveSqliteSessionWrite, s as resolveSqliteScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { u as reconcileSessionTranscriptIndexInTransaction } from "./session-transcript-index-FbEuN6S5.mjs";
import { D as invalidateSessionEntryMaintenanceAgeFact, r as publishSessionEntryCacheInvalidation } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { n as assertSessionTranscriptHot } from "./session-cold-storage-state-CzcE3h3O.mjs";
import { i as recordLegacyAcpMigrationSources } from "./session-accessor.sqlite-acp-provenance-tjrzB-wk.mjs";
import { d as writeSessionEntry } from "./session-accessor.sqlite-entry-store-BnbK5FTE.mjs";
import { n as appendTranscriptEventsInTransaction } from "./session-accessor.sqlite-transcript-store-CV2CGkbJ.mjs";
import { d as touchTranscriptMutationInTransaction, t as advanceTranscriptMutationAtInTransaction } from "./session-accessor.sqlite-transcript-state-xJ1TJ9j2.mjs";
import { i as readExactSessionEntryRowForCanonicalRepair } from "./session-accessor.sqlite-canonical-repair-DenliiOw.mjs";
import { t as extractGeneratedTranscriptSessionId } from "./generated-transcript-session-id-C-WpjhM8.mjs";
import { E as statMigrationPath, T as sameMigrationArtifact, d as listSessionSqliteMigrationManifestPaths, g as resolveSessionSqliteMigrationRunsDir, i as canonicalMigrationFilePath, p as readSessionSqliteMigrationManifest, s as filterRestoreManifestTargets, w as readMigrationArtifactIdentity, x as MigrationArtifactSchema } from "./session-sqlite-migration-manifest-CT3ckmkL.mjs";
import { d as shouldFilterLegacySessionRecordsByTarget, l as readLegacySessionStoreEntries, r as withSqliteSessionImportStage, s as isLegacySessionRecordOwnedByTarget, t as verifyCanonicalSessionTranscriptSources, u as resolveLegacyTranscriptPaths } from "./session-sqlite-transcript-verification-9Tj6tF5J.mjs";
import { a as readLegacyPrimaryTranscriptIdentity, l as readTranscriptFingerprint, n as createTranscriptEventReader, o as readOnlySqliteDbStats, s as readOnlySqliteValidationSnapshot } from "./session-sqlite-migration-readers-D3juTq9n.mjs";
import { s as recordStartupMigrationWarnings } from "./state-migrations.messages-CXxBVY0a.mjs";
import fs from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-accessor.sqlite-import.ts
function resolveSqliteSessionImport(params) {
	const resolvedScope = resolveSqliteScope(params);
	return {
		params,
		resolved: params.preserveExactStoredKey ? {
			...resolvedScope,
			sessionKey: params.sessionKey
		} : resolvedScope
	};
}
function importSqliteSessionRowsInTransaction(database, prepared, stage, source, repair) {
	const { params, resolved } = prepared;
	let transcriptEvents = 0;
	const currentEntry = readExactSessionEntryRowForCanonicalRepair(database, resolved.sessionKey, { allowMalformedRowRepair: params.allowMalformedRowRepair === true })?.entry;
	assertSessionTranscriptHot(database.db, params.entry.sessionId);
	const preservedHarnessId = params.entry.agentHarnessId === void 0 && currentEntry?.sessionId === params.entry.sessionId && currentEntry.lifecycleRevision === params.entry.lifecycleRevision ? currentEntry.agentHarnessId?.trim() : void 0;
	const importedEntry = {
		...params.entry,
		...preservedHarnessId ? { agentHarnessId: preservedHarnessId } : {},
		sessionFile: resolved.sessionKey
	};
	let preserveHistoricalNode = false;
	if (params.historicalOnly) {
		const db = getSessionKysely(database.db);
		const owner = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select("session_key").where("session_id", "=", params.entry.sessionId))?.session_key;
		if (owner && owner !== resolved.sessionKey) throw new Error(`Historical transcript ${params.entry.sessionId} already belongs to ${owner}`);
		preserveHistoricalNode = Boolean(executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_nodes").select("session_key").where("session_key", "=", resolved.sessionKey)));
	}
	if (!preserveHistoricalNode) {
		invalidateSessionEntryMaintenanceAgeFact(database.db);
		writeSessionEntry(database, resolved.sessionKey, importedEntry, {
			allowStoredAliases: true,
			previousEntry: currentEntry ?? null
		});
		if (params.legacyAcpMigrationSource) recordLegacyAcpMigrationSources(database.db, resolved.sessionKey, [params.legacyAcpMigrationSource]);
	}
	if (params.readTranscriptEvents) {
		const transcriptScope = {
			...resolved,
			sessionId: params.entry.sessionId
		};
		stage.resetSeen();
		for (const row of iterateSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("transcript_events").select(transcriptEventJsonSql(database.db).as("event_json")).where("session_id", "=", params.entry.sessionId))) stage.addSeen(row.event_json);
		transcriptEvents = appendTranscriptEventsInTransaction(database, transcriptScope, stage.iterateUnseenEvents(source), {
			allowStoredAlias: true,
			scheduleProjectionReconcile: false,
			touchMutation: false
		});
		reconcileSessionTranscriptIndexInTransaction(database.db, params.entry.sessionId);
		publishSessionEntryCacheInvalidation(database, { sessionKey: resolved.sessionKey });
	}
	if (params.transcriptMtimeMs !== void 0) advanceTranscriptMutationAtInTransaction(database, params.entry.sessionId, params.transcriptMtimeMs);
	else if (transcriptEvents > 0) touchTranscriptMutationInTransaction(database, params.entry.sessionId);
	return {
		sessionId: params.entry.sessionId,
		sessionKey: resolved.sessionKey,
		transcriptEvents,
		...repair ? { recovery: {
			complete: repair.recognized && stage.complete,
			repaired: repair.repaired,
			events: repair.events
		} } : {}
	};
}
/** Imports legacy session rows that share one SQLite store in one durable transaction. */
async function importSqliteSessionRowsBatch(params) {
	if (params.length === 0) return [];
	const prepared = params.map(resolveSqliteSessionImport);
	const resolved = prepared[0].resolved;
	const databasePath = resolveOpenClawAgentSqlitePath(toDatabaseOptions(resolved));
	if (prepared.some((row) => resolveOpenClawAgentSqlitePath(toDatabaseOptions(row.resolved)) !== databasePath)) throw new Error("SQLite session import batch spans multiple stores");
	return await runExclusiveSqliteSessionWrite(resolved, async () => withSqliteSessionImportStage((stage) => {
		const validators = [];
		const repairs = /* @__PURE__ */ new Map();
		for (const [source, { params: importParams }] of prepared.entries()) {
			let seq = 0;
			const validate = importParams.readTranscriptEvents?.((event) => stage.append(source, seq++, JSON.stringify(event)));
			if (validate) validators.push(validate);
			if (importParams.repairLegacyTranscript && importParams.readTranscriptEvents) repairs.set(source, stage.repairLegacyTranscript(source));
		}
		for (const validate of validators) validate();
		for (const { params: importParams } of prepared) importParams.beforePersistentApply?.();
		return runOpenClawAgentWriteTransaction((database) => prepared.map((row, source) => importSqliteSessionRowsInTransaction(database, row, stage, source, repairs.get(source))), toDatabaseOptions(resolved), { operationLabel: "session.import.batch" });
	}), "session.import.batch");
}
//#endregion
//#region src/infra/deferred-plugin-session-empty.ts
/** An empty retained original carries no history; its backups and canonical owner must prove it. */
async function recoverEmptyRetainedTranscript(params) {
	const { source, target, env } = params;
	const original = readMigrationArtifactIdentity(source.path);
	const prefix = `${path.basename(source.originalPath)}.bak-`;
	const candidates = fs.readdirSync(path.dirname(source.originalPath)).filter((name) => name.startsWith(prefix) && /^\d+-\d+$/.test(name.slice(prefix.length))).map((name) => path.join(path.dirname(source.originalPath), name));
	const manual = `Preserve ${source.path} and the backup candidates (${candidates.join(", ") || `${source.originalPath}.bak-<pid>-<timestamp>: none found`}). Restore a complete verified transcript at ${source.originalPath}, then run openclaw doctor --session-sqlite recover --session-sqlite-all-agents against this same state directory. Canonical database: ${target.sqlitePath}.`;
	try {
		if (original.size !== 0) throw new Error("Retained transcript is no longer empty");
		const snapshot = readOnlySqliteValidationSnapshot(target);
		if (!snapshot.ok) throw snapshot.error;
		const filename = path.basename(source.originalPath);
		const sessionIds = params.sessionIds.length ? params.sessionIds : [extractGeneratedTranscriptSessionId(filename) ?? filename.slice(0, -6)];
		const backups = candidates.map((candidate) => ({
			path: candidate,
			identity: readMigrationArtifactIdentity(candidate)
		})).toSorted((a, b) => b.identity.size - a.identity.size || a.path.localeCompare(b.path));
		for (const sessionId of sessionIds) {
			const sessionKey = snapshot.snapshot.sessionKeysBySessionId.get(sessionId);
			if (!sessionKey) throw new Error(`No canonical session owner for ${sessionId}; deleted history was not replayed`);
			if (!backups.length && !snapshot.snapshot.transcriptEventCountsBySessionId.get(sessionId)) throw new Error(`No backup or canonical transcript rows for ${sessionId}`);
			for (const [index, backup] of backups.entries()) {
				if (params.sessionIds.length === 0 && readLegacyPrimaryTranscriptIdentity(backup.path, source.originalPath, void 0, true)?.sessionId !== sessionId) throw new Error(`Backup has no matching primary session identity: ${backup.path}`);
				const sources = [{
					path: backup.path,
					originalPath: source.originalPath,
					sessionId
				}];
				const verify = (mode) => verifyCanonicalSessionTranscriptSources({
					target,
					sources,
					env,
					mode
				});
				const verified = verify(index === 0 ? "appendable" : "contained");
				if (!verified || verified.events === 0) throw new Error(`Backup is not covered by canonical history: ${backup.path}`);
				if (verified.missingEvents) {
					const fingerprint = readTranscriptFingerprint(backup.path);
					await importSqliteSessionRowsBatch([{
						agentId: target.agentId,
						storePath: target.sqlitePath,
						env,
						sessionKey,
						entry: {
							sessionId,
							updatedAt: 0
						},
						historicalOnly: true,
						preserveExactStoredKey: true,
						readTranscriptEvents: createTranscriptEventReader(backup.path, sessionId, false, fingerprint, source.originalPath),
						beforePersistentApply: () => {
							params.assertCurrent();
							const current = readOnlySqliteValidationSnapshot(target);
							if (!current.ok || current.snapshot.sessionKeysBySessionId.get(sessionId) !== sessionKey || !verify("appendable")) throw new Error("Canonical session owner or transcript changed before recovery");
							if (!sameMigrationArtifact(readMigrationArtifactIdentity(source.path), original) || !sameMigrationArtifact(readMigrationArtifactIdentity(backup.path), backup.identity)) throw new Error("Retained transcript or backup changed before recovery");
						}
					}]);
					if (!verify("contained")) throw new Error(`Recovered backup could not be verified: ${backup.path}`);
				}
			}
		}
		if (!sameMigrationArtifact(readMigrationArtifactIdentity(source.path), original) || backups.some((backup) => !sameMigrationArtifact(readMigrationArtifactIdentity(backup.path), backup.identity))) throw new Error("Retained transcript or backup changed during recovery");
		params.assertCurrent();
		return `Verified-empty retained transcript; superseded by canonical SQLite history. Backup candidates: ${candidates.join(", ") || "none"}.`;
	} catch (error) {
		throw new Error(`${String(error)}. ${manual}`, { cause: error });
	}
}
//#endregion
//#region src/infra/deferred-plugin-session-verification.ts
/** Capture originals before deferral; settlement may only archive these verified identities. */
function captureDeferredPluginSessionSources(params) {
	const sources = new Map(params.indexIdentity ? [[path.resolve(params.storePath), params.indexIdentity]] : []);
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
/** A replaced database cannot inherit completed-import authority from an old inode. */
async function verifyDeferredSessionDatabase(params) {
	const target = {
		...params.target,
		sqlitePath: params.sqlitePath
	};
	const snapshot = readOnlySqliteValidationSnapshot(target);
	const stats = readOnlySqliteDbStats(target);
	if (!snapshot.ok || !stats.ok || stats.stats.integrityCheck !== "ok") throw new Error(`Cannot verify retained session history against ${params.sqlitePath}; inspect SQLite integrity with openclaw doctor --session-sqlite validate. Sources remain protected.`);
	const resolved = new Map(params.sources.map((source) => [source.originalPath, source.path]));
	const verifiedSourcePaths = params.verifiedSourcePaths ?? new Set(resolved.keys());
	const indexPath = resolved.get(path.resolve(target.storePath));
	const issues = [];
	const records = (indexPath ? readLegacySessionStoreEntries(target, issues, { sourcePath: indexPath }).entries.map(({ entry, sessionKey }) => ({
		entry,
		sessionKey,
		transcriptPath: resolveLegacyTranscriptPaths(target, entry, verifiedSourcePaths).transcriptPath
	})) : []).filter(({ sessionKey }) => !shouldFilterLegacySessionRecordsByTarget(target) || isLegacySessionRecordOwnedByTarget(params.cfg, target, sessionKey));
	if (issues.some((issue) => issue.code !== "entry_invalid")) throw new Error(`Cannot verify retained session index ${target.storePath}: ${issues.map((issue) => issue.message).join("; ")}`);
	for (const record of records) if (snapshot.snapshot.sessionKeysBySessionId.get(record.entry.sessionId) !== record.sessionKey) throw new Error(`Retained session ${record.sessionKey} is not present in ${params.sqlitePath}; sources remain protected. Preserve ${record.transcriptPath ?? target.storePath} and its backups. Restore the intended session from a verified backup to ${params.sqlitePath}, then run openclaw doctor --session-sqlite recover --session-sqlite-all-agents against the same state directory. Canonical edits and deletions were not replayed.`);
	for (const source of params.sources) {
		if (!isPrimarySessionTranscriptFileName(path.basename(source.originalPath))) continue;
		const sourcePath = resolved.get(source.originalPath);
		const indexed = records.filter((candidate) => candidate.transcriptPath === source.originalPath);
		if (sourcePath && readMigrationArtifactIdentity(sourcePath).size === 0) {
			const reason = await recoverEmptyRetainedTranscript({
				source,
				target,
				env: params.env,
				sessionIds: indexed.map((record) => record.entry.sessionId),
				assertCurrent: params.assertCurrent
			});
			params.onEmptySource?.(source.path, reason);
			continue;
		}
		if (params.requireCompleteTranscript && indexed.length === 0) throw new Error(`Changed retained transcript has no verified indexed owner: ${source.path}`);
		const sessionIds = indexed.length ? indexed.map((record) => record.entry.sessionId) : [sourcePath && readLegacyPrimaryTranscriptIdentity(sourcePath, source.originalPath)?.sessionId];
		if (!sourcePath || sessionIds.some((sessionId) => {
			if (!sessionId || !snapshot.snapshot.sessionKeysBySessionId.has(sessionId)) return true;
			const verified = verifyCanonicalSessionTranscriptSources({
				target,
				sources: [{
					path: sourcePath,
					originalPath: source.originalPath,
					sessionId
				}],
				env: params.env
			});
			return !verified || params.requireCompleteTranscript && verified.events !== snapshot.snapshot.transcriptEventCountsBySessionId.get(sessionId);
		})) throw new Error(`Retained transcript ${source.path} is not complete in ${params.sqlitePath}; source remains protected. Compare a verified database backup before retrying recovery; canonical history was not overwritten.`);
	}
}
/** Old receipts bind bytes, not row identities; only a proven original JSON value can rebind. */
function preservesRecordedIndexValue(bytes, identity) {
	const value = JSON.parse(bytes.toString("utf8"));
	const pretty = JSON.stringify(value, null, 2);
	return [
		bytes.subarray(0, identity.size),
		bytes.subarray(-identity.size),
		...[
			JSON.stringify(value),
			pretty,
			pretty.replaceAll("\n", "\r\n")
		].flatMap((encoded) => [
			"",
			"\n",
			"\r\n"
		].map((ending) => Buffer.from(encoded + ending)))
	].some((original) => original.length === identity.size && sha256Hex(original) === identity.sha256 && isDeepStrictEqual(JSON.parse(original.toString("utf8")), value));
}
function databaseIdentity(sqlitePath, kind = "receipt") {
	const file = fs.lstatSync(sqlitePath, {
		bigint: true,
		throwIfNoEntry: false
	});
	if (!file?.isFile()) throw new Error(`The imported session database is missing or no longer a regular file: ${sqlitePath}. Run ${formatCliCommand("openclaw doctor --session-sqlite recover --session-sqlite-all-agents")} against the same state/config before retrying repair.`);
	return kind === "physical" ? databaseFileIdentityKey(file) : `inode:${file.ino}:birthtime:${readDatabaseIdentityBirthtime(file)}`;
}
function sameSourceContent(left, right) {
	return left.sha256 === right.sha256 && left.size === right.size;
}
//#endregion
//#region src/infra/state-migrations.deferred-session-import.ts
const DeferredPluginSessionImportSchema = object({
	databaseIdentity: string(),
	superseded: literal("different-database").optional(),
	pluginIds: array(string()),
	sources: array(object({
		path: string(),
		identity: MigrationArtifactSchema.shape.identity
	}))
});
function parseSessionImportReceipt(params, receipt) {
	const recorded = DeferredPluginSessionImportSchema.parse(JSON.parse(receipt.reportJson));
	const currentDatabaseIdentity = databaseIdentity(params.sqlitePath);
	const physicalIdentity = databaseIdentity(params.sqlitePath, "physical");
	return {
		recorded,
		currentDatabaseIdentity,
		physicalIdentity,
		stale: Boolean(recorded.superseded) || recorded.databaseIdentity !== currentDatabaseIdentity && recorded.databaseIdentity !== physicalIdentity
	};
}
/** Preserve the foreign receipt before releasing its claim on the live database. */
function supersedeDeferredPluginSessionImport(params) {
	const { receipt } = params;
	runOpenClawStateWriteTransaction(({ db }) => {
		if (!isDeepStrictEqual(readLegacyMigrationReceiptFromDatabase(db, receipt.sourceKey), receipt) || databaseIdentity(params.sqlitePath) !== params.databaseIdentity || databaseIdentity(params.sqlitePath, "physical") !== params.physicalIdentity) throw new Error("Deferred session receipt or database changed before supersession; originals retained.");
		const now = Date.now();
		const recorded = JSON.parse(receipt.reportJson);
		recordLegacyMigrationRun(db, {
			runId: `${receipt.sourceKey}:superseded:${sha256Hex(receipt.reportJson + "\0" + params.databaseIdentity)}`,
			startedAt: now,
			finishedAt: now,
			status: "superseded",
			upsert: true,
			reportJson: JSON.stringify({
				receipt: recorded,
				databaseIdentity: params.databaseIdentity,
				reason: "Receipt bound to a different database; it cannot certify the live database's history."
			})
		});
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("migration_sources").set({
			status: "superseded",
			report_json: JSON.stringify({
				...recorded,
				superseded: "different-database"
			})
		}).where("source_key", "=", receipt.sourceKey));
	}, { env: params.env }, { operationLabel: "state.supersede-plugin-session-source" });
}
//#endregion
//#region src/infra/deferred-plugin-session-sources.ts
const RECEIPT_KIND = "deferred-plugin-session-import";
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
	return hasDeferredPluginSessionImport({
		target: {
			...params.target,
			sqlitePath: params.target.sqlitePath ?? sqlite.path
		},
		sqlitePath: params.target.sqlitePath ?? sqlite.path,
		env: params.env
	});
}
function sourceKey(target) {
	return resolveLegacyMigrationSourceKey(RECEIPT_KIND, target.storePath, `${target.agentId}\0${path.resolve(target.sqlitePath)}`);
}
function collectArchivedSources(target, env) {
	const archives = /* @__PURE__ */ new Map();
	for (const manifestPath of listSessionSqliteMigrationManifestPaths(env)) {
		const manifest = readSessionSqliteMigrationManifest(manifestPath);
		const targets = manifest ? filterRestoreManifestTargets(manifest, [target]) : [];
		for (const candidate of targets) for (const move of candidate.plannedMoves) if (move.artifact) {
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
	const resolved = statMigrationPath(source.path) ? sameSourceContent(readMigrationArtifactIdentity(source.path), source.identity) ? source.path : void 0 : (cachedTarget.archives ??= collectArchivedSources(target, env)).get(source.path)?.find(({ identity, path: archivePath }) => sameSourceContent(identity, source.identity) && statMigrationPath(archivePath) && sameSourceContent(readMigrationArtifactIdentity(archivePath), source.identity))?.path;
	resolutions.push({
		identity: { ...source.identity },
		path: resolved
	});
	cachedTarget.resolved.set(source.path, resolutions);
	return resolved;
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
			throw new Error(`Retained session migration source changed: ${source.path}. Preserve the current file and its ${source.path}.bak-<pid>-<timestamp> siblings, restore the verified original at ${source.path}, then run openclaw doctor --session-sqlite recover --session-sqlite-all-agents against the same state directory. Canonical SQLite sessions were not replayed.`);
		}
		verifiedPaths.set(source.path, verifiedPath);
	}
	const index = receipt.sources.find((source) => source.path === path.resolve(params.target.storePath));
	const sourcePath = index && verifiedPaths.get(index.path);
	if (!index && statMigrationPath(params.target.storePath) && onSourceConflict) onSourceConflict(path.resolve(params.target.storePath));
	if (onSourceConflict && (!index || !sourcePath) || !index && !statMigrationPath(params.target.storePath)) return;
	if (!index || !sourcePath) throw new Error(`Session source changed in ${path.dirname(params.target.storePath)}: the current index has no verified import receipt. Run ${formatCliCommand("openclaw doctor --fix --non-interactive --yes", params.env)} against the same state/config to preserve and reverify it.`);
	const issues = [];
	const source = readLegacySessionStoreEntries(params.target, issues, { sourcePath });
	if (issues.some((issue) => issue.code !== "entry_invalid") || !source.bytes || source.bytes.length !== index.identity.size || sha256Hex(source.bytes) !== index.identity.sha256) throw new Error(`Retained session migration source changed in ${path.dirname(params.target.storePath)}: ${params.target.storePath}. Run ${formatCliCommand("openclaw doctor --fix --non-interactive --yes", params.env)} against the same state/config to preserve and reverify it.`);
	for (const { entry, sessionKey } of source.entries) {
		if (shouldFilterLegacySessionRecordsByTarget(params.target) && !isLegacySessionRecordOwnedByTarget(params.cfg, params.target, sessionKey)) continue;
		const { transcriptCandidates } = resolveLegacyTranscriptPaths(params.target, entry);
		if (transcriptCandidates.some((candidate) => verifiedPaths.has(path.resolve(candidate)) || onSourceConflict && receipt.sources.some((recordedSource) => recordedSource.path === path.resolve(candidate)))) continue;
		for (const candidate of transcriptCandidates) if (statMigrationPath(candidate)) {
			if (onSourceConflict) {
				onSourceConflict(candidate);
				continue;
			}
			throw new Error(`Retained session migration source changed: ${candidate}. A previously unimported transcript appeared; run openclaw doctor --fix to preserve it in the migration archive.`);
		}
	}
}
/** A completed core import remains authoritative after canonical sessions change or are deleted. */
function readDeferredPluginSessionImport(params) {
	const receipt = params.purpose === "canonical" ? readSessionImportReceipt(params) : readDeferredPluginSessionImportReceipt(params);
	if (!receipt) return;
	const binding = parseSessionImportReceipt(params, receipt);
	if (binding.stale) {
		recordStartupMigrationWarnings(["Retained session import receipt belongs to a different database; sources remain protected. Run openclaw doctor --fix to recover retained history against the live database."]);
		return;
	}
	let recorded = {
		...binding.recorded,
		databaseIdentity: binding.currentDatabaseIdentity
	};
	if (params.purpose === "canonical") return recorded;
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
	try {
		assertVerifiedSessionSources(params, recorded, params.verification, params.onSourceConflict);
	} catch (error) {
		if (params.purpose !== "readiness") throw error;
		recordStartupMigrationWarnings([`Retained plugin session source awaits Doctor repair; canonical SQLite sessions remain available: ${String(error)}`]);
	}
	return recorded;
}
function hasDeferredPluginSessionImport(params) {
	return Boolean(readDeferredPluginSessionImportReceipt(params));
}
function readStaleDeferredPluginSessionImport(params) {
	const receipt = readDeferredPluginSessionImportReceipt(params);
	const binding = receipt && parseSessionImportReceipt(params, receipt);
	return binding?.stale ? binding.recorded : void 0;
}
function readDeferredPluginSessionImportReceipt(params) {
	const receipt = readSessionImportReceipt(params);
	return receipt?.removedSource ? void 0 : receipt;
}
/** Archive retirement ends active custody, not the canonical import's no-replay evidence. */
function readSessionImportReceipt(params) {
	const target = {
		...params.target,
		sqlitePath: params.sqlitePath
	};
	const read = (db) => tableExists(db, "migration_sources") ? readLegacyMigrationReceiptFromDatabase(db, sourceKey(target)) : void 0;
	return params.database ? read(params.database) : withExistingOpenClawStateDatabaseReadOnly(({ db }) => read(db), { env: params.env });
}
/** Rebuild derived evidence from proven original index values or verified canonical transcripts. */
async function rebuildDeferredPluginSessionSourceIndex(params) {
	const receipt = readDeferredPluginSessionImportReceipt(params);
	if (!receipt) return false;
	const { recorded, currentDatabaseIdentity, physicalIdentity, stale } = parseSessionImportReceipt(params, receipt);
	if (recorded.superseded) return false;
	if (stale) {
		supersedeDeferredPluginSessionImport({
			receipt,
			databaseIdentity: currentDatabaseIdentity,
			sqlitePath: params.sqlitePath,
			physicalIdentity,
			env: params.env
		});
		return true;
	}
	const target = {
		...params.target,
		sqlitePath: params.sqlitePath
	};
	const index = recorded.sources.find((source) => source.path === path.resolve(target.storePath));
	let verifiedIndex = index;
	const archives = collectArchivedSources(target, params.env);
	const verifiedSourcePaths = new Set(recorded.sources.map((source) => source.path));
	const missingIndex = index && existingSessionSourcePaths(index.path, target, params.env, archives).length === 0;
	const assertCurrent = () => {
		if (!isDeepStrictEqual(readDeferredPluginSessionImportReceipt(params), receipt) || databaseIdentity(params.sqlitePath, "physical") !== physicalIdentity || databaseIdentity(params.sqlitePath) !== currentDatabaseIdentity || verifiedIndex && !missingIndex && !resolveVerifiedSessionSource(verifiedIndex, target, params.env) || missingIndex && existingSessionSourcePaths(index.path, target, params.env).length > 0) throw new Error("Retained session receipt, index, or database changed during recovery; sources remain protected.");
	};
	const sources = [];
	for (const source of recorded.sources.filter((item) => !missingIndex || item !== index)) sources.push(await (async () => {
		let failure;
		const candidates = statMigrationPath(source.path) ? [source.path] : (archives.get(source.path) ?? []).map((archive) => archive.path);
		for (const candidate of candidates) {
			if (!statMigrationPath(candidate)) continue;
			try {
				const identity = readMigrationArtifactIdentity(candidate);
				const emptyTranscript = identity.size === 0 && isPrimarySessionTranscriptFileName(path.basename(source.path));
				if ((!emptyTranscript || candidate !== source.path && currentDatabaseIdentity === recorded.databaseIdentity) && sameSourceContent(identity, source.identity)) return {
					path: source.path,
					identity
				};
				if (!emptyTranscript && candidate !== source.path || source.path !== path.resolve(target.storePath) && !isPrimarySessionTranscriptFileName(path.basename(source.path))) continue;
				const isIndex = source.path === path.resolve(target.storePath);
				const indexPath = !isIndex && verifiedIndex && resolveVerifiedSessionSource(verifiedIndex, target, params.env);
				if (isIndex) {
					const issues = [];
					const current = readLegacySessionStoreEntries(params.target, issues, { sourcePath: candidate });
					if (!current.bytes || !preservesRecordedIndexValue(current.bytes, source.identity)) throw new Error(`Cannot prove the retained index preserves its original entries, metadata, and transcript links: ${candidate}. ${issues.map((issue) => issue.message).join("; ")}`);
				} else {
					if (!emptyTranscript && (!indexPath || !verifiedIndex)) throw new Error("Changed transcript has no verified retained index to establish its session owner.");
					await verifyDeferredSessionDatabase({
						...params,
						sources: [...verifiedIndex && indexPath ? [{
							originalPath: verifiedIndex.path,
							path: indexPath
						}] : [], {
							originalPath: source.path,
							path: candidate
						}],
						requireCompleteTranscript: true,
						verifiedSourcePaths,
						assertCurrent
					});
				}
				if (!sameMigrationArtifact(readMigrationArtifactIdentity(candidate), identity) || indexPath && verifiedIndex && !sameSourceContent(readMigrationArtifactIdentity(indexPath), verifiedIndex.identity)) continue;
				if (isIndex) verifiedIndex = {
					path: source.path,
					identity
				};
				return {
					path: source.path,
					identity
				};
			} catch (error) {
				if (statMigrationPath(candidate)?.size === 0 && isPrimarySessionTranscriptFileName(path.basename(source.path))) throw error;
				failure = error;
			}
		}
		if (failure !== void 0) params.onSourceConflict?.(source.path, void 0, failure);
		return source;
	})());
	const rebuilt = {
		...recorded,
		databaseIdentity: currentDatabaseIdentity,
		sources
	};
	if (isDeepStrictEqual(rebuilt, recorded)) return false;
	runOpenClawStateWriteTransaction(({ db }) => {
		const current = readDeferredPluginSessionImportReceipt({
			...params,
			database: db
		});
		if (!isDeepStrictEqual(current, receipt) || databaseIdentity(params.sqlitePath, "physical") !== physicalIdentity || databaseIdentity(params.sqlitePath) !== currentDatabaseIdentity) throw new Error(`Deferred session import changed in ${path.dirname(params.target.storePath)} before its source index was rebuilt. Run ${formatCliCommand("openclaw doctor --fix --non-interactive --yes", params.env)} against the same state/config to retry.`);
		const reportJson = JSON.stringify(rebuilt);
		const rebuiltIndex = sources.find((source) => source.path === path.resolve(target.storePath));
		const query = getNodeSqliteKysely(db);
		executeSqliteQuerySync(db, query.updateTable("migration_sources").set({
			report_json: reportJson,
			...rebuiltIndex ? {
				source_sha256: rebuiltIndex.identity.sha256,
				source_size_bytes: rebuiltIndex.identity.size
			} : {}
		}).where("source_key", "=", receipt.sourceKey));
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
				binding: receipt ? parseSessionImportReceipt(target, receipt) : void 0
			};
			verified.set(key, prepared);
		}
		const binding = prepared.binding;
		if (!binding) return { kind: "absent" };
		if (binding.currentDatabaseIdentity !== databaseIdentity(target.sqlitePath)) throw new Error(`The verified session import database changed for ${path.dirname(target.storePath)}; retained source was not replayed. Run ${formatCliCommand("openclaw doctor --session-sqlite recover --session-sqlite-all-agents", params.env)} against the same state/config.`);
		return binding.stale ? { kind: "stale" } : {
			kind: "canonical",
			target
		};
	};
}
/** Resolve the verified live or archived legacy index retained for plugin-owned migration. */
function resolveDeferredPluginSessionStoreSource(params) {
	const sqlite = resolveSqliteTargetFromSessionStorePath(params.target.storePath, {
		agentId: params.target.agentId,
		env: params.env
	});
	const index = readDeferredPluginSessionImport({
		...params,
		sqlitePath: sqlite.path,
		purpose: "canonical"
	})?.sources.find((source) => source.path === path.resolve(params.target.storePath));
	return index ? resolveVerifiedSessionSource(index, {
		...params.target,
		sqlitePath: sqlite.path
	}, params.env) : void 0;
}
/** Called after full core import validation, before any original can be retired. */
function recordDeferredPluginSessionImport(params) {
	const report = {
		databaseIdentity: databaseIdentity(params.sqlitePath),
		pluginIds: params.pluginIds,
		sources: params.sources
	};
	const index = params.sources.find((source) => source.path === path.resolve(params.target.storePath));
	runOpenClawStateWriteTransaction(({ db }) => {
		assertVerifiedSessionSources(params, report);
		if (report.databaseIdentity !== databaseIdentity(params.sqlitePath)) throw new Error(`Session import database changed for ${path.dirname(params.target.storePath)} before its receipt was recorded. Run ${formatCliCommand("openclaw doctor --fix --non-interactive --yes", params.env)} against the same state/config to retry.`);
		const key = sourceKey({
			...params.target,
			sqlitePath: params.sqlitePath
		});
		const previous = readLegacyMigrationReceiptFromDatabase(db, key);
		recordLegacyMigrationReceipt(db, {
			sourceKey: key,
			migrationKind: RECEIPT_KIND,
			sourcePath: path.resolve(params.target.storePath),
			targetTable: "session_nodes",
			sourceSha256: index?.identity.sha256 ?? null,
			sourceSizeBytes: index?.identity.size ?? null,
			sourceRecordCount: params.recordCount,
			runId: key,
			reportJson: JSON.stringify(report),
			now: Date.now(),
			upsert: Boolean(previous && (previous.removedSource || parseSessionImportReceipt(params, previous).recorded.superseded))
		});
	}, { env: params.env }, { operationLabel: "state.retain-plugin-session-source" });
}
//#endregion
export { preserveDeferredPluginSessionSource as a, readStaleDeferredPluginSessionImport as c, resolveDeferredPluginSessionStoreSource as d, resolveVerifiedSessionSource as f, importSqliteSessionRowsBatch as h, prepareSessionSourceVerification as i, rebuildDeferredPluginSessionSourceIndex as l, captureDeferredPluginSessionSources as m, hasDeferredPluginSessionImport as n, readDeferredPluginSessionImport as o, DeferredPluginSessionImportSchema as p, prepareDeferredPluginSessionImportReader as r, readDeferredPluginSessionImportReceipt as s, deferredPluginSessionStoreIds as t, recordDeferredPluginSessionImport as u };
